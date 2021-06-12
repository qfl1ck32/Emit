import time
import numpy
import random
import math
from threading import Lock, Semaphore
import logging

import ioSystem
from bktree import *

# sursa de invatare / documentatie pentru Funk MF:
# https://towardsdatascience.com/recommendation-system-matrix-factorization-d61978660b4b

# nu am metoda de stergere, chiar daca utilizatorul isi sterge contul,
# algoritmului ii este util sa aiba ponderile in continuare


class Learner:

    PRINT_TESTING = True

    classLock = Lock()

    @staticmethod
    def save(learner, Rfilename, Pfilename, Qfilename):

        Learner.classLock.acquire()

        if learner.Q is not None:
            with open(Qfilename, "w") as f:

                for i in range(len(learner.Q)):
                    for j in range(len(learner.Q[i])):
                        f.write(f"{round(learner.Q[i][j], 3)} ")
                    f.write("\n")

        if learner.P is not None:
            with open(Pfilename, "w") as f:

                for i in range(len(learner.P)):
                    for j in range(len(learner.P[i])):
                        f.write(f"{round(learner.P[i][j], 3)} ")
                    f.write("\n")

        if learner.R is not None:
            with open(Rfilename, "w") as f:

                for i in range(len(learner.R)):
                    for j in range(len(learner.R[i])):
                        f.write(f"{round(learner.R[i][j], 3)} ")
                    f.write("\n")

        Learner.classLock.release()

    @staticmethod
    def testRndRmatrix(TCNT):

        for i in range(TCNT):

            # userCnt, itemCnt, R = ioSystem.parseRmatrix()
            userCnt, itemCnt, R = ioSystem.randomTestInput()
            featureCnt = 20

            ml = Learner(R=R, userCnt=userCnt, featureCnt=featureCnt, itemCnt=itemCnt, stdLearningRate=0.1)

            status = ml.factorizeMatrix()
            print(status)

            R = numpy.empty((userCnt, itemCnt), numpy.float64)

            if Learner.PRINT_TESTING is True:

                maxDif = float('-inf')

                for user in range(userCnt):
                    for item in range(itemCnt):
                        if R[user][item] > 0 and R[user][item] - numpy.dot(ml.P[user, :], ml.Q[:, item]) > maxDif:
                            maxDif = R[user][item] - numpy.dot(ml.P[user, :], ml.Q[:, item])
                print(maxDif)

    @staticmethod
    def generateRtestMatrix():

        file = open("Rmatrix.txt", "w")
        for cnt in range(1000):

            r = random.randint(3, 8)
            featuresNon0 = random.sample(range(15), k=r)

            fs = [0 for i in range(15)]
            for f in featuresNon0:

                fs[f] = random.random()
                while fs[f] == 0:
                    fs[f] = random.random()

            for f in fs:
                file.write(f"{round(f, 3)} ")
            file.write('\n')

    @staticmethod
    def euclideanDistance(v1, v2):

        d = 0
        for i in range(len(v1)):
            d += (v1[i] - v2[i]) ** 2

        return math.sqrt(d)

    @staticmethod
    def cosineSimilarity(v1, v2):

        dotProduct = numpy.dot(v1, v2)
        v1Norm = numpy.linalg.norm(v1)
        v2Norm = numpy.linalg.norm(v2)

        return dotProduct / (v1Norm * v2Norm)

    def __init__(self, userCnt, itemCnt, featureCnt, R=None, P=None, Q=None, useFactorization=True, stdRoundCnt=5000, stdLearningRate=0.005, stdAcceptanceThreshold=0.1, stdMinProgress=0.00001, similarity='COSINE'):

        self.R = R
        self.Q = Q
        self.P = P
        logging.info('init')
        self.useFactorization = useFactorization

        self.userCnt = userCnt
        self.itemCnt = itemCnt
        self.featureCnt = featureCnt
        self.stdRoundCnt = stdRoundCnt
        self.stdLearningRate = stdLearningRate
        self.stdAcceptanceThreshold = stdAcceptanceThreshold
        self.stdMinProgress = stdMinProgress

        if similarity == 'COSINE':
            self.similarity = Learner.cosineSimilarity
        elif similarity == 'EUCLIDEAN':
            self.similarity = Learner.euclideanDistance

        # readers-writers problem

        self.learnerLock = Lock()  # lock that can block any operation
        self.rCntLock = Lock()
        self.waitingQueue = Semaphore(1)

        self.rCnt = 0

    # !!!!!! thread unsafe !!!!!!
    def factorizeMatrix(self, roundCnt=None, learningRate=None, acceptanceThreshold=None, minProgress=None):

        returnStatus = ""

        if self.R is None:
            raise ValueError("R matrix is not initialized!")

        if roundCnt is None:
            roundCnt = self.stdRoundCnt

        if learningRate is None:
            learningRate = self.stdLearningRate

        if acceptanceThreshold is None:
            acceptanceThreshold = self.stdAcceptanceThreshold
        acceptanceThreshold *= self.userCnt * self.itemCnt / 10

        if minProgress is None:
            minProgress = self.stdMinProgress

        self.P = numpy.random.rand(self.userCnt, self.featureCnt)
        self.Q = numpy.random.rand(self.featureCnt, self.itemCnt)

        oldMSE = float('inf')
        startTime = time.time()

        for r in range(roundCnt):

            for user in range(self.userCnt):
                for item in range(self.itemCnt):
                    if self.R[user][item] > 0:

                        err = self.R[user][item] - numpy.dot(self.P[user, :], self.Q[:, item])

                        for feature in range(self.featureCnt):

                            aux = self.P[user][feature]
                            self.P[user][feature] += 2 * learningRate * err * self.Q[feature][item]
                            self.Q[feature][item] += 2 * learningRate * err * aux

            MSE = 0
            for user in range(self.userCnt):
                for item in range(self.itemCnt):
                    if self.R[user][item] > 0:

                        MSE += (self.R[user][item] - numpy.dot(self.P[user, :], self.Q[:, item])) ** 2

            # print(oldMSE)
            '''if MSE > oldMSE:
                returnStatus += f"min value overshot"
                oldMSE = MSE
                break'''

            if oldMSE - MSE < minProgress:
                returnStatus += f"pleateau achieved: {oldMSE - MSE}"
                break

            oldMSE = MSE

            if MSE < acceptanceThreshold:
                returnStatus += f"acceptance threshold reached: (MSE = {MSE})"
                break

        returnStatus += f"\ntime elapsed: {time.time() - startTime}; MSE: {oldMSE}\n"

        return returnStatus

    # !!!!!!!!!!!! mentine Q fixat !!!!!!!!!!!!!!!!!
    def addNewUser(self, newRline, roundCnt=None, learningRate=None, acceptanceThreshold=None, minProgress=None, matrixFactorized=None):

        # ---- SYNC ----

        self.waitingQueue.acquire()
        self.learnerLock.acquire()
        self.waitingQueue.release()

        # ---- END SYNC ----

        if matrixFactorized is None:
            matrixFactorized = self.useFactorization

        if matrixFactorized is True:

            returnStatus = ""

            if self.P is None or self.Q is None:
                raise ValueError("P or Q matrices are not initialized!")

            if roundCnt is None:
                roundCnt = self.stdRoundCnt

            if learningRate is None:
                learningRate = self.stdLearningRate

            if acceptanceThreshold is None:
                acceptanceThreshold = self.stdAcceptanceThreshold
            acceptanceThreshold *= self.userCnt * self.itemCnt / 10

            if minProgress is None:
                minProgress = self.stdMinProgress

            newPline = numpy.random.rand(self.featureCnt)

            oldMSE = float('inf')
            startTime = time.time()

            for r in range(roundCnt):

                for item in range(self.itemCnt):
                    if newRline[item] > 0:

                        err = newRline[item] - numpy.dot(newPline, self.Q[:, item])

                        for feature in range(self.featureCnt):
                            newPline[feature] += 2 * learningRate * err * self.Q[feature][item]

                MSE = 0
                for item in range(self.itemCnt):
                    if newRline[item] > 0:

                        MSE += newRline[item] - numpy.dot(newPline, self.Q[:, item])

                if MSE > oldMSE:
                    returnStatus += f"min value overshot"
                    oldMSE = MSE
                    break

                if oldMSE - MSE < minProgress:
                    returnStatus += f"pleateau achieved: {oldMSE - MSE}"
                    break

                oldMSE = MSE

                if MSE < acceptanceThreshold:
                    returnStatus += f"acceptance threshold reached: (MSE = {MSE})"
                    break

            self.P = numpy.vstack([self.P, newPline])
            self.userCnt += 1

            returnStatus += f"\ntime elapsed: {time.time() - startTime}; MSE: {oldMSE}\n"

            # ---- SYNC ----

            self.learnerLock.release()

            # ---- END SYNC ----

            return returnStatus, len(self.P) - 1

        else:  # cazul cand fac update doar la matricea R
            self.R = numpy.vstack([self.R, newRline])

            # ---- SYNC ----

            self.learnerLock.release()

            # ---- END SYNC ----

            return "", len(self.R) - 1

    # !!!!!!!!!!!! mentine Q fixat !!!!!!!!!!!!!!!!!
    def changeUser(self, userIndex, updatedRline, roundCnt=None, learningRate=None, acceptanceThreshold=None, minProgress=None, matrixFactorized=None):

        # ---- SYNC ----

        self.waitingQueue.acquire()
        self.learnerLock.acquire()
        self.waitingQueue.release()

        # ---- END SYNC ----

        if matrixFactorized is None:
            matrixFactorized = self.useFactorization

        if matrixFactorized is True:

            returnStatus = ""

            if self.P is None or self.Q is None:
                raise ValueError("P or Q matrices are not initialized!")

            if roundCnt is None:
                roundCnt = self.stdRoundCnt

            if learningRate is None:
                learningRate = self.stdLearningRate

            if acceptanceThreshold is None:
                acceptanceThreshold = self.stdAcceptanceThreshold
            acceptanceThreshold *= self.userCnt * self.itemCnt / 10

            if minProgress is None:
                minProgress = self.stdMinProgress

            oldMSE = float('inf')
            startTime = time.time()

            for r in range(roundCnt):

                for item in range(self.itemCnt):
                    if updatedRline[item] > 0:

                        err = updatedRline[item] - numpy.dot(self.P[userIndex, :], self.Q[:, item])

                        for feature in range(self.featureCnt):
                            self.P[userIndex][feature] += 2 * learningRate * err * self.Q[feature][item]

                MSE = 0
                for item in range(self.itemCnt):
                    if updatedRline[item] > 0:

                        MSE += updatedRline[item] - numpy.dot(self.P[userIndex, :], self.Q[:, item])

                if MSE > oldMSE:
                    returnStatus += f"min value overshot"
                    oldMSE = MSE
                    break

                if oldMSE - MSE < minProgress:
                    returnStatus += f"pleateau achieved: {oldMSE - MSE}"
                    break

                oldMSE = MSE

                if MSE < acceptanceThreshold:
                    returnStatus += f"acceptance threshold reached: (MSE = {MSE})"
                    break

            returnStatus += f"\ntime elapsed: {time.time() - startTime}; MSE: {oldMSE}\n"

            # ---- SYNC ----

            self.learnerLock.release()

            # ---- END SYNC ----

            return returnStatus

        else:  # cazul cand fac update doar la matricea R
            self.R[userIndex] = updatedRline

            # ---- SYNC ----

            self.learnerLock.release()

            # ---- END SYNC ----

            return ""

    # !!!!!!!!! thread unsafe !!!!!!!!!!
    # returneaza efectiv coloana din self.R
    # sau produsul scalar corespunzator intre liniile si coloanele din P si Q
    # in functie de caz
    def getRrow(self, userIndex, matrixFactorized=None):

        if matrixFactorized is None:
            matrixFactorized = self.useFactorization

        if matrixFactorized is True:

            if self.P is None or self.Q is None:
                raise ValueError("P or Q matrices are not initialized!")

            userLine = numpy.empty(shape=self.itemCnt)
            for item in range(self.itemCnt):
                userLine[item] = numpy.dot(self.P[userIndex, :], self.Q[:, item])

        else:
            userLine = self.R[userIndex, :]

        return userLine

    def getUserSimilarity(self, fstUserIndex, sndUserIndex, matrixFactorized=None):

        # ---- SYNC ----

        self.waitingQueue.acquire()
        self.rCntLock.acquire()

        self.rCnt += 1
        if self.rCnt == 1:
            self.learnerLock.acquire()

        self.waitingQueue.release()
        self.rCntLock.release()

        # ---- END SYNC ----

        fstUserLine = self.getRrow(fstUserIndex, matrixFactorized)
        sndUserLine = self.getRrow(sndUserIndex, matrixFactorized)

        # ---- SYNC ----

        self.rCntLock.acquire()

        self.rCnt -= 1
        if self.rCnt == 0:
            self.learnerLock.release()

        self.rCntLock.release()

        # ---- END SYNC ----

        return self.similarity(fstUserLine, sndUserLine)

    def getUserSimilarityByattr(self, attributes, userIndex, matrixFactorized=None):

        # ---- SYNC ----

        self.waitingQueue.acquire()
        self.rCntLock.acquire()

        self.rCnt += 1
        if self.rCnt == 1:
            self.learnerLock.acquire()

        self.waitingQueue.release()
        self.rCntLock.release()

        # ---- END SYNC ----

        userLine = self.getRrow(userIndex, matrixFactorized)

        # ---- SYNC ----

        self.rCntLock.acquire()

        self.rCnt -= 1
        if self.rCnt == 0:
            self.learnerLock.release()

        self.rCntLock.release()

        # ---- END SYNC ----

        return self.similarity(attributes, userLine)
