import time
import numpy
import random
import math
import json
# sursa de invatare / documentatie pentru Funk MF: https://towardsdatascience.com/recommendation-system-matrix-factorization-d61978660b4b


class User:

    nameToUser = {}

    def __init__(self, matrixRow, userName, location):

        self.userName = userName
        self.location = location
        self.matrixRow = matrixRow

        User.nameToUser.update({userName: self})


class Item:

    nameToItem = {}

    def __init__(self, matrixColumn, itemName):

        self.itemName = itemName
        self.matrixColumn = matrixColumn

        Item.nameToItem.update({itemName: self})


class Info:

    @staticmethod
    def randomTestInput():

        userCnt = 1000
        itemCnt = 50

        R = numpy.random.rand(userCnt, itemCnt)

        for user in range(userCnt):
            for item in range(itemCnt):
                a = random.random()
                if a < 0.7:
                    R[user][item] = 0

        return userCnt, itemCnt, R

    @staticmethod
    def parseRmatrix(inputFileName="Rmatrix.txt"):

        inputMatrixFile = open(inputFileName, "r")
        inputMatrix = inputMatrixFile.read()

        R = []

        for line in inputMatrix.split('\n'):

            line = [float(el) for el in line.split()]
            R.append(line)

        userCnt = len(R)
        itemCnt = len(R[0])

        return userCnt, itemCnt, numpy.array(R)

    @staticmethod
    def parsePmatrix(inputFileName="Pmatrix.txt"):

        inputMatrixFile = open(inputFileName, "r")
        inputMatrix = inputMatrixFile.read()

        P = []

        cnt = 0
        for line in inputMatrix.split('\n'):

            line = line.split()
            userName = line[0]
            line = [float(el) for el in line[1:]]

            if userName not in User.nameToUser.keys():
                User(cnt, userName, (None, None))
            else:
                User.nameToUser[userName].matrixRow = cnt

            P.append(line)
            cnt += 1

        userCnt = len(P)
        featureCnt = len(P[0])

        return userCnt, featureCnt, numpy.array(P)

    @staticmethod
    def parseQmatrix(inputFileName="Qmatrix.txt"):

        inputMatrixFile = open(inputFileName, "r")
        inputMatrix = inputMatrixFile.read()

        Q = []

        cnt = 0
        for line in inputMatrix.split('\n'):

            line = line.split()
            itemName = line[0]
            line = [float(el) for el in line[1:]]

            if itemName not in Item.nameToItem.keys():
                Item(cnt, itemName)
            else:
                Item.nameToItem[itemName].matrixColumn = cnt

            Q.append(line)
            cnt += 1

        Q = numpy.array(Q)
        Q = Q.T

        featureCnt = len(Q)
        itemCnt = len(Q[0])

        return featureCnt, itemCnt, numpy.array(Q)

    @staticmethod
    def getConfigOpts(inputFileName="ConfigFile.json"):

        # matrixOption - optiunea pentru algoritmul folosit pt searching:
        # (update adica trecerea de la a folosi matricea R nemodificata la a factoriza in P si Q)
        #   0 - matricea R, cand trec de un anumit prag de utilizatori sa faca update automat cat
        #   1 - matricea R tot timpul, fara sa faca update automat dupa un anumit prag de utilizatori
        #   2 - matricile P si Q, calculate in urma factorizarii
        #   3 - matricea R din calculeaza la initializare P si Q indiferent de numarul de utilizatori
        #
        # updateThreshold - pragul pentru care fac update, (doar pentru matrixOption 0, ignorat in rest)
        #
        # Rmatrix - numele fisierului unde se gaseste matricea R (ignorat pentru matrixOption 2)
        # Pmatrix - numele fisierului unde se gaseste matricea P (ignorat pentru matrixOption 1)
        # Qmatrix - numele fisierului unde se gaseste matricea Q (ignorat pentru matrixOption 1)

        inputFile = open(inputFileName, "r")
        inputStr = inputFile.read()

        configOpts = json.loads(inputStr)
        return configOpts


class Learner:

    PRINT_TESTING = True

    @staticmethod
    def test1(TCNT):

        for i in range(TCNT):

            # userCnt, itemCnt, R = Info.parseRmatrix()
            userCnt, itemCnt, R = Info.randomTestInput()
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

    def __init__(self, userCnt, itemCnt, featureCnt, R=None, P=None, Q=None, useFactorization=True, stdRoundCnt=5000, stdLearningRate=0.005, stdAcceptanceThreshold=0.1, stdMinProgress=0.00001):

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

        return returnStatus

    # !!!!!!!!!!!! mentine Q fixat !!!!!!!!!!!!!!!!!
    def addNewUser(self, newRline, roundCnt=None, learningRate=None, acceptanceThreshold=None, minProgress=None, matrixFactorized=None):

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

            return returnStatus

        else:  # cazul cand fac update doar la matricea R
            self.R = numpy.vstack([self.R, newRline])

    # !!!!!!!!!!!! mentine Q fixat !!!!!!!!!!!!!!!!!
    def changeUser(self, userIndex, updatedRline, roundCnt=None, learningRate=None, acceptanceThreshold=None, minProgress=None, matrixFactorized=None):

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

            return returnStatus

        else:  # cazul cand fac update doar la matricea R
            self.R[userIndex] = updatedRline


# voi avea un fisier in care retin starea curenta a recommender ului pentru cazul cand inchid serverul

class Recommender:

    def __init__(self, configFileName="ConfigFile.json"):

        self.learner = None

        self.config = Info.getConfigOpts(configFileName)

        if self.config["matrixOption"] == 0:

            # cand va fi cazul,
            # va trebui sa apelez din recommender factorizarea matricii
            # si sa setez self.learner.useFactorization = True

            userCnt, itemCnt, R = Info.parseRmatrix()

            useFactorization = False
            if userCnt >= self.config["updateThreshold"]:
                useFactorization = True

            self.learner = Learner(R=R, P=None, Q=None,
                                   useFactorization=useFactorization,
                                   userCnt=userCnt,
                                   featureCnt=itemCnt * self.config["featureCntProcentage"],
                                   itemCnt=itemCnt,
                                   stdLearningRate=self.config["stdLearningRate"],
                                   stdMinProgress=self.config["stdMinProgress"],
                                   stdAcceptanceThreshold=self.config["stdAcceptanceThreshold"],
                                   stdRoundCnt=self.config["stdRoundCnt"])

        elif self.config["matrixOption"] == 1:

            userCnt, itemCnt, R = Info.parseRmatrix()

            self.learner = Learner(R=R, P=None, Q=None,
                                   useFactorization=False,
                                   userCnt=userCnt,
                                   featureCnt=itemCnt * self.config["featureCntProcentage"],
                                   itemCnt=itemCnt,
                                   stdLearningRate=self.config["stdLearningRate"],
                                   stdMinProgress=self.config["stdMinProgress"],
                                   stdAcceptanceThreshold=self.config["stdAcceptanceThreshold"],
                                   stdRoundCnt=self.config["stdRoundCnt"])

        elif self.config["matrixOption"] == 2:

            userCnt, featureCnt, P = Info.parsePmatrix()
            featureCnt, itemCnt, Q = Info.parseQmatrix()

            self.learner = Learner(R=None, P=P, Q=Q,
                                   userCnt=userCnt,
                                   useFactorization=True,
                                   featureCnt=itemCnt * self.config["featureCntProcentage"],
                                   itemCnt=itemCnt,
                                   stdLearningRate=self.config["stdLearningRate"],
                                   stdMinProgress=self.config["stdMinProgress"],
                                   stdAcceptanceThreshold=self.config["stdAcceptanceThreshold"],
                                   stdRoundCnt=self.config["stdRoundCnt"])

        elif self.config["matrixOption"] == 3:

            userCnt, itemCnt, R = Info.parseRmatrix()

            self.learner = Learner(R=R, P=None, Q=None,
                                   userCnt=userCnt,
                                   useFactorization=True,
                                   featureCnt=itemCnt * self.config["featureCntProcentage"],
                                   itemCnt=itemCnt,
                                   stdLearningRate=self.config["stdLearningRate"],
                                   stdMinProgress=self.config["stdMinProgress"],
                                   stdAcceptanceThreshold=self.config["stdAcceptanceThreshold"],
                                   stdRoundCnt=self.config["stdRoundCnt"])

            self.learner.factorizeMatrix()


# Learner.test1(10)

# a = Recommender()

