import time
import numpy
import random
import math
# sursa de invatare / documentatie: https://towardsdatascience.com/recommendation-system-matrix-factorization-d61978660b4b


class Info:

    FEATURES_CNT = 0
    USERS_CNT = 0
    ITEMS_CNT = 0

    R = None

    @classmethod
    def randomTestInput(cls):

        cls.USERS_CNT = random.randint(10, 20)
        cls.ITEMS_CNT = random.randint(20, 30)
        cls.FEATURES_CNT = 1

        cls.R = numpy.random.rand(cls.USERS_CNT, cls.ITEMS_CNT)

        for user in range(cls.USERS_CNT):
            for item in range(cls.ITEMS_CNT):
                a = random.random()
                if a < 0.7:
                    cls.R[user][item] = 0

    @classmethod
    def parseInput(cls):

        inputMatrixFile = open("inputMatrix.txt", "r")
        inputMatrix = inputMatrixFile.read()
        inputMatrix = inputMatrix.split('\n')

        matrixDimensionsL = inputMatrix[0].split()
        cls.USERS_CNT = int(matrixDimensionsL[0])
        cls.ITEMS_CNT = int(matrixDimensionsL[1])

        cls.FEATURES_CNT = 3  # deocamdata pt teste

        inputMatrix = inputMatrix[1:]

        for i in range(len(inputMatrix)):
            inputMatrix[i] = [float(el) for el in inputMatrix[i].split()]

        cls.R = numpy.array(inputMatrix)


class Learner:

    OVERSHOTS = 0
    PRINT_TESTING = True

    @staticmethod
    def test1(TCNT):

        for i in range(TCNT):

            # Info.parseInput()
            Info.randomTestInput()

            ml = Learner(R=Info.R, userCnt=Info.USERS_CNT, featureCnt=Info.FEATURES_CNT, itemCnt=Info.ITEMS_CNT)

            t = time.time()

            P, Q, MSE = ml.factorizeMatrix()

            print(f"time elapsed: {time.time() - t}; MSE: {MSE}; overshots: {Learner.OVERSHOTS}", end='\n\n')

            R = numpy.empty((Info.USERS_CNT, Info.ITEMS_CNT), numpy.float64)

            if Learner.PRINT_TESTING is True:
                for user in range(Info.USERS_CNT):
                    for item in range(Info.ITEMS_CNT):
                        if Info.R[user][item] > 0:
                            print(Info.R[user][item] - numpy.dot(P[user, :], Q[:, item]), end=" ")
                        else:
                            print("new" + 15 * " ", end=" ")
                    print()

    def __init__(self, userCnt, itemCnt, featureCnt, R=None, P=None, Q=None, stdRoundCnt=5000, stdLearningRate=0.005, stdAcceptanceThreshold=0.1):

        self.R = R
        self.Q = Q
        self.P = P

        self.userCnt = userCnt
        self.itemCnt = itemCnt
        self.featureCnt = featureCnt
        self.stdRoundCnt = stdRoundCnt
        self.stdLearningRate = stdLearningRate
        self.stdAcceptanceThreshold = stdAcceptanceThreshold

    def factorizeMatrix(self, roundCnt=None, learningRate=None, acceptanceThreshold=None):

        # var pentru testare daca fac overshoot peste minim cu learning rate prea mare
        oldMSE = float('inf')

        if self.R is None:
            raise ValueError("R matrix is not initialized!")

        if roundCnt is None:
            roundCnt = self.stdRoundCnt

        if learningRate is None:
            learningRate = self.stdLearningRate

        if acceptanceThreshold is None:
            acceptanceThreshold = self.stdAcceptanceThreshold
        acceptanceThreshold *= self.userCnt * self.itemCnt / 10

        P = numpy.random.rand(self.userCnt, self.featureCnt)
        Q = numpy.random.rand(self.featureCnt, self.itemCnt)

        for r in range(roundCnt):

            for user in range(self.userCnt):
                for item in range(self.itemCnt):
                    if self.R[user][item] > 0:

                        err = self.R[user][item] - numpy.dot(P[user, :], Q[:, item])

                        for feature in range(self.featureCnt):

                            aux = P[user][feature]
                            P[user][feature] += 2 * learningRate * err * Q[feature][item]
                            Q[feature][item] += 2 * learningRate * err * aux

            MSE = 0
            for user in range(self.userCnt):
                for item in range(self.itemCnt):
                    if self.R[user][item] > 0:

                        MSE += (self.R[user][item] - numpy.dot(P[user, :], Q[:, item])) ** 2

            if MSE > oldMSE:
                Learner.OVERSHOTS += 1
                oldMSE = MSE
                break

            if oldMSE - MSE < 0.00001:
                print(f"pleateau achieved: {oldMSE - MSE}")
                break

            oldMSE = MSE

            if MSE < acceptanceThreshold:
                print(f"acceptance threshold reached: (MSE = {MSE})")
                break

        return P, Q, oldMSE

    # !!!!!!!!!!!! mentine Q fixat !!!!!!!!!!!!!!!!!
    def addNewUser(self, newRline, roundCnt=None, learningRate=None, acceptanceThreshold=None):

        if self.P is None or self.Q is None:
            raise ValueError("P or Q matrices are not initialized!")

        if roundCnt is None:
            roundCnt = self.stdRoundCnt

        if learningRate is None:
            learningRate = self.stdLearningRate

        if acceptanceThreshold is None:
            acceptanceThreshold = self.stdAcceptanceThreshold

        newPline = numpy.random.rand(self.featureCnt)

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

            if MSE < acceptanceThreshold:
                break

    # !!!!!!!!!!!! mentine Q fixat !!!!!!!!!!!!!!!!!
    def changeUser(self, userIndex, updatedRline, roundCnt=None, learningRate=None, acceptanceThreshold=None):

        if self.P is None or self.Q is None:
            raise ValueError("P or Q matrices are not initialized!")

        if roundCnt is None:
            roundCnt = self.stdRoundCnt

        if learningRate is None:
            learningRate = self.stdLearningRate

        if acceptanceThreshold is None:
            acceptanceThreshold = self.stdAcceptanceThreshold

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

            if MSE < acceptanceThreshold:
                break


Learner.test1(1)


'''for user in range(Info.USERS_CNT):
    for feature in range(Info.FEATURES_CNT):
        print(P[user][feature], end=" ")
    print()

print()

for feature in range(Info.FEATURES_CNT):
    for item in range(Info.ITEMS_CNT):
        print(Q[feature][item], end=" ")
    print()'''

'''R = [[0 for j in range(Info.ITEMS_CNT)] for i in range(Info.USERS_CNT)]
for i in range(Info.USERS_CNT):
    for j in range(Info.ITEMS_CNT):
        R[i][j] = numpy.dot(P[i, :], Q[:, j])


print()

for user in range(Info.USERS_CNT):
    for item in range(Info.ITEMS_CNT):
        print(R[user][item], end=" ")
    print()'''