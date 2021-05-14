import time
import numpy
import random
import math
import json
from multiprocessing import Process, Lock

import ioSystem

# sursa de invatare / documentatie pentru Funk MF: https://towardsdatascience.com/recommendation-system-matrix-factorization-d61978660b4b


# nu am metoda de stergere, chiar daca utilizatorul isi sterge contul,
# algoritmului ii este util sa aiba ponderile in continuare

class Learner:

    PRINT_TESTING = True

    @staticmethod
    def test1(TCNT):

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

        self.learnerLock = Lock()

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

        self.learnerLock.acquire()

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

            self.learnerLock.release()

            return returnStatus

        else:  # cazul cand fac update doar la matricea R
            self.R = numpy.vstack([self.R, newRline])
            self.learnerLock.release()

    # !!!!!!!!!!!! mentine Q fixat !!!!!!!!!!!!!!!!!
    def changeUser(self, userIndex, updatedRline, roundCnt=None, learningRate=None, acceptanceThreshold=None, minProgress=None, matrixFactorized=None):

        self.learnerLock.acquire()

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

            self.learnerLock.release()

            return returnStatus

        else:  # cazul cand fac update doar la matricea R
            self.R[userIndex] = updatedRline
            self.learnerLock.release()

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

        self.learnerLock.acquire()

        fstUserLine = self.getRrow(fstUserIndex, matrixFactorized)
        sndUserLine = self.getRrow(sndUserIndex, matrixFactorized)

        self.learnerLock.release()

        return self.similarity(fstUserLine, sndUserLine)

    def getUserSimilarityByattr(self, attributes, userIndex, matrixFactorized=None):

        self.learnerLock.acquire()
        userLine = self.getRrow(userIndex, matrixFactorized)
        self.learnerLock.release()

        return self.similarity(attributes, userLine)


class Recommender:

    def __init__(self, configFileName="ConfigFile.json"):

        self.learner = None

        self.config = ioSystem.getConfigOpts(configFileName)

        if self.config["matrixOption"] == 0:

            # cand va fi cazul,
            # va trebui sa apelez din recommender factorizarea matricii
            # si sa setez self.learner.useFactorization = True

            userCnt, itemCnt, R = ioSystem.parseRmatrix()

            useFactorization = False
            if userCnt >= self.config["updateThreshold"]:
                useFactorization = True

            self.learner = Learner(R=R, P=None, Q=None,
                                   useFactorization=useFactorization,
                                   userCnt=userCnt,
                                   featureCnt=self.config["featureCnt"],
                                   itemCnt=itemCnt,
                                   stdLearningRate=self.config["stdLearningRate"],
                                   stdMinProgress=self.config["stdMinProgress"],
                                   stdAcceptanceThreshold=self.config["stdAcceptanceThreshold"],
                                   stdRoundCnt=self.config["stdRoundCnt"],
                                   similarity=self.config["similarity"])

        elif self.config["matrixOption"] == 1:

            userCnt, itemCnt, R = ioSystem.parseRmatrix()

            self.learner = Learner(R=R, P=None, Q=None,
                                   useFactorization=False,
                                   userCnt=userCnt,
                                   featureCnt=self.config["featureCnt"],
                                   itemCnt=itemCnt,
                                   stdLearningRate=self.config["stdLearningRate"],
                                   stdMinProgress=self.config["stdMinProgress"],
                                   stdAcceptanceThreshold=self.config["stdAcceptanceThreshold"],
                                   stdRoundCnt=self.config["stdRoundCnt"],
                                   similarity=self.config["similarity"])

        elif self.config["matrixOption"] == 2:

            userCnt, featureCnt, P = ioSystem.parsePmatrix()
            featureCnt, itemCnt, Q = ioSystem.parseQmatrix()

            self.learner = Learner(R=None, P=P, Q=Q,
                                   userCnt=userCnt,
                                   useFactorization=True,
                                   featureCnt=self.config["featureCnt"],
                                   itemCnt=itemCnt,
                                   stdLearningRate=self.config["stdLearningRate"],
                                   stdMinProgress=self.config["stdMinProgress"],
                                   stdAcceptanceThreshold=self.config["stdAcceptanceThreshold"],
                                   stdRoundCnt=self.config["stdRoundCnt"],
                                   similarity=self.config["similarity"])

        elif self.config["matrixOption"] == 3:

            userCnt, itemCnt, R = ioSystem.parseRmatrix()

            self.learner = Learner(R=R, P=None, Q=None,
                                   userCnt=userCnt,
                                   useFactorization=True,
                                   featureCnt=self.config["featureCnt"],
                                   itemCnt=itemCnt,
                                   stdLearningRate=self.config["stdLearningRate"],
                                   stdMinProgress=self.config["stdMinProgress"],
                                   stdAcceptanceThreshold=self.config["stdAcceptanceThreshold"],
                                   stdRoundCnt=self.config["stdRoundCnt"],
                                   similarity=self.config["similarity"])

            print(self.learner.factorizeMatrix())

    # generator, cate o instanta pt fiecare proces de request
    def getSimilarUsers(self, currentUserIndex):

        simp1 = self.config[f"{self.config['similarity']}_SimP1"]
        simp2 = self.config[f"{self.config['similarity']}_SimP2"]

        while True:

            nearUsersIds = ioSystem.getNearUsers(self.config["nearUsersBatchCnt"], currentUserIndex)

            # M1 - cel mai probabil de recomandat: 70%, similarity > simp1
            # M2 - al doilea cel mai probabil: 20%, simp1 > similarity > simp2
            # M3 - cel mai putin probabil: 10%, simp2 > similarity
            # se aplica daca mai sunt elemente in fiecare dintre M1, M2, M3
            # daca nu mai sunt, probabilitatile se modifica

            M1 = []
            M2 = []
            M3 = []

            # calculez similaritatile
            for userId in nearUsersIds:

                sim = self.learner.getUserSimilarity(fstUserIndex=currentUserIndex, sndUserIndex=userId)

                if sim >= simp1:
                    M1.append(userId)

                elif simp1 > sim >= simp2:
                    M2.append(userId)

                else:
                    M3.append(userId)

            # cat timp am persoane "cele mai similare" in acest batch
            # selectez cu probabilitatile descrise mai sus una dintre ele
            while len(M1) > 0:

                selectFrom = []

                m1i = random.choice(range(len(M1)))

                m2i = None
                if len(M2) > 0:
                    m2i = random.choice(range(len(M2)))

                m3i = None
                if len(M3) > 0:
                    m3i = random.choice(range(len(M3)))

                m1 = M1[m1i]
                selectFrom = [m1] * 16

                m2 = None
                if m2i is not None:
                    m2 = M2[m2i]
                    selectFrom.extend([m2] * 3)

                m3 = None
                if m3i is not None:
                    m3 = M3[m3i]
                    selectFrom.append(m3)

                selected = random.choice(selectFrom)
                if selected == m1:
                    M1.pop(m1i)
                elif selected == m2:
                    M2.pop(m2i)
                elif selected == m3:
                    M3.pop(m3i)

                yield selected

    # generator, cate o instanta pt fiecare proces de request
    def getSimilarUsersByattr(self, attributes, currentUserIndex):

        if isinstance(attributes, numpy.ndarray) is False:
            attributes = numpy.array(attributes)

        simp1 = self.config[f"{self.config['similarity']}_SimP1"]

        while True:

            nearUsersIds = ioSystem.getNearUsers(self.config["nearUsersBatchCnt"], currentUserIndex)

            M = []

            # calculez similaritatile
            for userId in nearUsersIds:

                sim = self.learner.getUserSimilarityByattr(attributes=attributes, userIndex=userId)
                if sim > simp1:
                    M.append(userId)

            M.sort(reverse=True)

            for rec in M:
                yield rec

    def addNewUser(self, attributes):

        if isinstance(attributes, numpy.ndarray) is False:
            attributes = numpy.array(attributes)

        self.learner.addNewUser(newRline=attributes)

        if self.config["matrixOption"] == 0 and self.learner.useFactorization is False:

            self.learner.learnerLock.acquire()

            if self.learner.userCnt + 1 > self.config["updateThreshold"]:
                self.learner.factorizeMatrix()
                self.learner.useFactorization = True

            self.learner.learnerLock.release()

    def changeUser(self, userIndex, attributes):

        if isinstance(attributes, numpy.ndarray) is False:
            attributes = numpy.array(attributes)

        self.learner.changeUser(userIndex, attributes)



    @staticmethod
    def test_getSimilarUsers():

        simgen = recommender.getSimilarUsers(currentUserIndex=18)
        print("here")
        for i in range(10):

            l = recommender.learner.R[18]

            recIndex = next(simgen)
            recl = recommender.learner.R[recIndex]

            print("prima persoana R: ", end=' ')
            for j in range(15):
                print(round(l[j], 2), end=' ')

            l = recommender.learner.getRrow(18)

            print("\nprima persoana dupa ML: ", end=' ')
            for j in range(15):
                print(round(l[j], 2), end=' ')

            print("\na doua persoana R: ", end=' ')
            for j in range(15):
                print(round(recl[j], 2), end=' ')

            recl = recommender.learner.getRrow(recIndex)

            print("\na doua persoana dupa ML: ", end=' ')
            for j in range(15):
                print(round(recl[j], 2), end=' ')

            print(f"\nsimilaritate: {recommender.learner.getUserSimilarity(18, recIndex)}")

            l = recommender.learner.R[18]
            recl = recommender.learner.R[recIndex]

            print("diferentele intre activitatile votate R: ", end=' ')

            for j in range(15):
                if l[j] == 0 or recl[j] == 0:
                    print(0, end=' ')
                else:
                    print(round(l[j] - recl[j], 2), end=' ')
            print('\n\n')

            l = recommender.learner.getRrow(18)
            recl = recommender.learner.getRrow(recIndex)

            print("diferentele intre activitatile votate dupa ML: ", end=' ')

            for j in range(15):
                if l[j] == 0 or recl[j] == 0:
                    print(0, end=' ')
                else:
                    print(round(l[j] - recl[j], 2), end=' ')
            print('\n\n')

    @staticmethod
    def test2_getSimilarUsersByattr():

        attr = [0.9, 0.8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.9, 0]

        simgen = recommender.getSimilarUsersByattr(attributes=attr, currentUserIndex=18)

        for i in range(10):

            recIndex = next(simgen)
            recl = recommender.learner.R[recIndex]

            print(*attr)

            print("\na doua persoana R: ", end=' ')
            for j in range(15):
                print(round(recl[j], 2), end=' ')

            recl = recommender.learner.getRrow(recIndex)

            print("\na doua persoana dupa ML: ", end=' ')
            for j in range(15):
                print(round(recl[j], 2), end=' ')

            print(f"\nsimilaritate: {recommender.learner.getUserSimilarity(18, recIndex)}")

            recl = recommender.learner.R[recIndex]

            print("diferentele intre activitatile votate R: ", end=' ')

            for j in range(15):
                if attr[j] == 0 or recl[j] == 0:
                    print(0, end=' ')
                else:
                    print(round(attr[j] - recl[j], 2), end=' ')

            recl = recommender.learner.getRrow(recIndex)

            print("diferentele intre activitatile votate dupa ML: ", end=' ')

            for j in range(15):
                if attr[j] == 0 or recl[j] == 0:
                    print(0, end=' ')
                else:
                    print(round(attr[j] - recl[j], 2), end=' ')
            print('\n\n')


if __name__ == "__main__":
    recommender = Recommender("ConfigFile.json")

    #recommender.test_getSimilarUsers()
    print('\n-------------------------\n')
    recommender.test2_getSimilarUsersByattr()








