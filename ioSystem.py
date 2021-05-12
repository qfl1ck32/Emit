import time
import numpy
import random
import math
import json


# momentan pt teste
PERSONS_CNT = 0

    
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


def parseRmatrix(inputFileName="Rmatrix.txt"):

    global PERSONS_CNT

    with open(inputFileName, "r") as inputMatrixFile:

        inputMatrix = inputMatrixFile.read()

        R = []

        for line in inputMatrix.split('\n'):

            line = [float(el) for el in line.split()]
            R.append(line)

        userCnt = len(R)
        itemCnt = len(R[0])

        PERSONS_CNT = userCnt

        return userCnt, itemCnt, numpy.array(R)


def parsePmatrix(inputFileName="Pmatrix.txt"):

    global PERSONS_CNT

    with open(inputFileName, "r") as inputMatrixFile:

        inputMatrix = inputMatrixFile.read()

        P = []

        for line in inputMatrix.split('\n'):

            line = [float(el) for el in line.split()]
            P.append(line)

        userCnt = len(P)
        featureCnt = len(P[0])

        PERSONS_CNT = userCnt

        return userCnt, featureCnt, numpy.array(P)


def parseQmatrix(inputFileName="Qmatrix.txt"):

    with open(inputFileName, "r") as inputMatrixFile:

        inputMatrix = inputMatrixFile.read()

        Q = []

        for line in inputMatrix.split('\n'):

            line = [float(el) for el in line.split()]
            Q.append(line)

        Q = numpy.array(Q)
        Q = Q.T

        featureCnt = len(Q)
        itemCnt = len(Q[0])

        return featureCnt, itemCnt, numpy.array(Q)


def getConfigOpts(inputFileName="ConfigFile.json"):

    # matrixOption - optiunea pentru algoritmul folosit pt searching:
    # (update adica trecerea de la a folosi matricea R nemodificata la a factoriza in P si Q)
    #   0 - matricea R, cand trec de un anumit prag de utilizatori sa faca update automat
    #   1 - matricea R tot timpul, fara sa faca update automat dupa un anumit prag de utilizatori
    #   2 - matricile P si Q, calculate in urma factorizarii
    #   3 - matricea R, calculata la initializare din P si Q indiferent de numarul de utilizatori
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


# preia indecsii din matricea P(R) coresp persoanelor apropiate, in ordine de la cele mai apropiate la cele mai departate
# va fi legat cu BD ul
def getNearUsers(cnt, currentUserIndex):

    # implementare cat nu am BD ul, returneaza toate liniile din P fara vreo ordine anume

    l = random.sample([i for i in range(PERSONS_CNT)], PERSONS_CNT)
    l.remove(currentUserIndex)
    return l

