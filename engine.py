import time
import numpy
import random
import math
from threading import Lock, Semaphore
import logging

import ioSystem
from bktree import *
from learner import *


class Recommender:

    def __init__(self, configFileName="ConfigFile.json"):

        self.config = ioSystem.getConfigOpts(configFileName)

        if self.config["nameTreeFile"] is None:

            self.nameFinder = BKtree()

            self.config["nameTreeFile"] = "ConfigFile.json"
            ioSystem.saveConfigOpts(self.config, "ConfigFile.json")

        else:
            self.nameFinder = BKtree.load(self.config["nameTreeFile"])

        self.learner = None

        if self.config["matrixOption"] == 0:

            # cand va fi cazul,
            # va trebui sa apelez din recommender factorizarea matricii
            # si sa setez self.learner.useFactorization = True

            userCnt, itemCnt, R = ioSystem.parseRmatrix(self.config["Rmatrix"])

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

            if userCnt >= self.config["updateThreshold"]:

                logging.info("Factorizing R matrix...")
                factLog = self.learner.factorizeMatrix()
                logging.info(f"Factorizing matrix log: {factLog}")

                Learner.save(self.learner, self.config['Rmatrix'], self.config['Pmatrix'], self.config['Qmatrix'])

        elif self.config["matrixOption"] == 1:

            userCnt, itemCnt, R = ioSystem.parseRmatrix(self.config["Rmatrix"])

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

            userCnt, featureCnt, P = ioSystem.parsePmatrix(self.config["Pmatrix"])
            featureCnt, itemCnt, Q = ioSystem.parseQmatrix(self.config["Qmatrix"])

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

            userCnt, itemCnt, R = ioSystem.parseRmatrix(self.config["Rmatrix"])

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

            logging.info("Factorizing R matrix...")
            factLog = self.learner.factorizeMatrix()
            logging.info(f"Factorizing matrix log: {factLog}")

            Learner.save(self.learner, self.config['Rmatrix'], self.config['Pmatrix'], self.config['Qmatrix'])

    # generator, cate o instanta pt fiecare proces de request
    def getSimilarUsers(self, currentUserIndex: int):

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

            if len(M1) == 0:
                yield None
                break

            # cat timp am persoane "cele mai similare" in acest batch
            # selectez cu probabilitatile descrise mai sus una dintre ele
            while len(M1) > 0:

                selectFrom = []

                m1i = numpy.random.choice(range(len(M1)))

                m2i = None
                if len(M2) > 0:
                    m2i = numpy.random.choice(range(len(M2)))

                m3i = None
                if len(M3) > 0:
                    m3i = numpy.random.choice(range(len(M3)))

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

                selected = choice(selectFrom)
                if selected == m1:
                    M1.pop(m1i)
                elif selected == m2:
                    M2.pop(m2i)
                elif selected == m3:
                    M3.pop(m3i)

                yield selected

    # generator, cate o instanta pt fiecare proces de request
    def getSimilarUsersByattr(self, attributes: list, currentUserIndex: int):

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

            if len(M) == 0:
                yield None

            for rec in M:
                yield rec

    # generator, cate o instanta pt fiecare proces de request
    def findByName(self, nameToSearch: str):

        while True:

            found = self.nameFinder.search(nameToSearch, self.config["nameSearchMaxDist"])

            if len(found) == 0:
                yield None
                break

            for _, _, dbIds in found:
                for dbId in dbIds:
                    yield dbId

    def addNewUser(self, attributes: list, fullName: str, dbIndex: int):

        # adaugare in matricea preferintelor

        if isinstance(attributes, numpy.ndarray) is False:
            attributes = numpy.array(attributes)

        _, newUserIndex = self.learner.addNewUser(newRline=attributes)

        if self.config["matrixOption"] == 0 and self.learner.useFactorization is False:

            # ---- SYNC ----

            self.learner.waitingQueue.acquire()
            self.learner.learnerLock.acquire()
            self.learner.waitingQueue.release()

            # ---- END SYNC ----

            if self.learner.userCnt + 1 > self.config["updateThreshold"]:

                if (self.learner.Q is None) or (self.learner.P is None):
                    self.learner.factorizeMatrix()

                self.learner.useFactorization = True

            # ---- SYNC ----

            self.learner.learnerLock.release()

            # ---- END SYNC ----

        Learner.save(self.learner, self.config['Rmatrix'], self.config['Pmatrix'], self.config['Qmatrix'])

        # adaugare in arborele BK

        self.nameFinder.insert(fullName, dbIndex)

        BKtree.save(self.nameFinder, self.config['nameTreeFile'])

        return newUserIndex

    def changeUser(self, userIndex: int, attributes: list, fullName: str, dbIndex: int):
        logging.info(f"{userIndex}, {attributes}, {fullName}, {dbIndex}")
        # modificare in matricea preferintelor

        if isinstance(attributes, numpy.ndarray) is False:
            attributes = numpy.array(attributes)

        self.learner.changeUser(userIndex, attributes)

        Learner.save(self.learner, self.config['Rmatrix'], self.config['Pmatrix'], self.config['Qmatrix'])

        # modificare in arborele BK

        self.nameFinder.delete(fullName, dbIndex)
        self.nameFinder.insert(fullName, dbIndex)

        BKtree.save(self.nameFinder, self.config['nameTreeFile'])

        return 'OK'

    @staticmethod
    def test_getSimilarUsers():

        simgen = recommender.getSimilarUsers(currentUserIndex=18)

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

            if recIndex is None:
                print("\nnici o persoana asemanatoare gasita")
                return

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

            print("\ndiferentele intre activitatile votate dupa ML: ", end=' ')

            for j in range(15):
                if attr[j] == 0 or recl[j] == 0:
                    print(0, end=' ')
                else:
                    print(round(attr[j] - recl[j], 2), end=' ')
            print('\n\n')


if __name__ == "__main__":

    recommender = Recommender("ConfigFile.json")
    # recommender.test_getSimilarUsers()
    recommender.test2_getSimilarUsersByattr()












