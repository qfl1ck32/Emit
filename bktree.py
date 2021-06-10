from random import *
from pickle import dumps, loads
from multiprocessing import Lock, Semaphore


class Node:

    def __init__(self, name: str, dbId: list):

        self.name = name  # string ul efectiv
        self.dbIds = {dbId}  # id urile din baza de date a acelui string (mai multe persoane cu acelasi nume)

        self.nextNodes = []  # [(nod urmator, distanta pana la el), ...]


class BKtree:

    classLock = Lock()

    @staticmethod
    def save(tree, filename):

        BKtree.classLock.acquire()

        with open(filename, "wb") as f:
            serialized = dumps(tree)
            f.write(serialized)

        BKtree.classLock.release()

    @staticmethod
    def load(filename):

        BKtree.classLock.acquire()

        with open(filename, "rb") as f:
            serialized = f.read()
            BKtree.classLock.release()
            return loads(serialized)

    @staticmethod
    def LevenshteinDistance(fstStr, sndStr):

        levd = [[0 for j in range(len(sndStr) + 1)] for i in range(len(fstStr) + 1)]

        for i in range(1, len(sndStr) + 1):
            levd[0][i] = i

        for i in range(1, len(fstStr) + 1):
            levd[i][0] = i

        for i in range(1, len(fstStr) + 1):
            for j in range(1, len(sndStr) + 1):

                if fstStr[i - 1] == sndStr[j - 1]:
                    levd[i][j] = levd[i - 1][j - 1]
                else:
                    levd[i][j] = 1 + min(levd[i - 1][j - 1], levd[i - 1][j], levd[i][j - 1])

        return levd[len(fstStr)][len(sndStr)]

    def __init__(self):

        self.root = None
        self.distance = BKtree.LevenshteinDistance

        self.allNodes = {}  # {nume: nod, ...} - pentru stergere (marcare ca fiind sters) in timp constant

        # readers-writers problem

        self.treeLock = Lock()  # lock that can block any operation
        self.rCntLock = Lock()
        self.waitingQueue = Semaphore(1)

        self.rCnt = 0

    def __getstate__(self):

        state = self.__dict__.copy()

        del state['treeLock']
        del state['rCntLock']
        del state['waitingQueue']

        return state

    def __setstate__(self, state):

        self.__dict__.update(state)

        self.treeLock = Lock()
        self.rCntLock = Lock()
        self.waitingQueue = Semaphore(1)

    def insert(self, strToInsert, dbId):

        # ---- SYNC ----

        self.waitingQueue.acquire()
        self.treeLock.acquire()
        self.waitingQueue.release()

        # ---- END SYNC ----

        if self.root is None:

            self.root = Node(strToInsert, dbId)
            self.allNodes.update({self.root.name: self.root})

            # ---- SYNC ----

            self.treeLock.release()

            # ---- END SYNC ----

            return

        currentNode = self.root
        while currentNode is not None:

            if currentNode.name == strToInsert:

                if currentNode.dbIds is None:
                    currentNode.dbIds = {dbId}

                elif dbId not in currentNode.dbIds:
                    currentNode.dbIds.add(dbId)

                # ---- SYNC ----

                self.treeLock.release()

                # ---- END SYNC ----
                return

            d = self.distance(currentNode.name, strToInsert)

            found = False
            for nextNode, dist in currentNode.nextNodes:

                if dist == d:
                    currentNode = nextNode
                    found = True

            if not found:

                toInsert = Node(strToInsert, dbId)
                currentNode.nextNodes.append((toInsert, d))

                self.allNodes.update({toInsert.name: toInsert})

                # ---- SYNC ----

                self.treeLock.release()

                # ---- END SYNC ----

                return

        # ---- SYNC ----

        self.treeLock.release()

        # ---- END SYNC ----

    def search(self, strToSearch, maxDistance=3):

        # ---- SYNC ----

        self.waitingQueue.acquire()
        self.rCntLock.acquire()
        
        self.rCnt += 1
        if self.rCnt == 1:
            self.treeLock.acquire()

        self.waitingQueue.release()
        self.rCntLock.release()

        # ---- END SYNC ----

        foundList = []  # [(nume, {dbid1, dbid2, ...}), ...]

        if self.root is not None:

            workingSet = set()
            workingSet.add(self.root)

            while workingSet:

                currentNode = workingSet.pop()
                if currentNode.dbIds is not None:  # verific sa nu fie marcat ca sters

                    d = self.distance(currentNode.name, strToSearch)
                    if d <= maxDistance:
                        foundList.append((currentNode.name, currentNode.dbIds))

                    for nextNode, dist in currentNode.nextNodes:
                        if nextNode.dbIds is not None and abs(dist - d) <= maxDistance:
                            workingSet.add(nextNode)

            foundList.sort(key=lambda t: t[1])

        # ---- SYNC ----

        self.rCntLock.acquire()

        self.rCnt -= 1
        if self.rCnt == 0:
            self.treeLock.release()

        self.rCntLock.release()

        # ---- END SYNC ----

        return foundList

    def delete(self, strToDelete, dbId):

        # ---- SYNC ----

        self.waitingQueue.acquire()
        self.treeLock.acquire()
        self.waitingQueue.release()

        # ---- END SYNC ----

        if strToDelete in self.allNodes.keys():
            dbIds = self.allNodes[strToDelete].dbIds

            if dbId in dbIds:
                dbIds.pop()

                if not dbIds:
                    dbIds = None

        # ---- SYNC ----

        self.treeLock.release()

        # ---- END SYNC ----

    @staticmethod
    def test_bktree():

        f = open("bktestinput.txt", "r+")
        inp = f.read().split()

        names = []

        dbidcnt = 0

        for name in inp:

            i = 0
            while i < len(name):
                if not (ord('a') <= ord(name[i]) <= ord('z') or ord('A') <= ord(name[i]) <= ord('Z')):
                    name = name[:i] + name[i + 1:]
                    i -= 1

                i += 1

            if len(name) > 0:
                names.append((name, dbidcnt))
                dbidcnt += 1

        f.close()

        shuffle(names)

        '''g = open('bktestinput.txt', "w")
        for n in names:
            g.write(f"{n} ")
        g.close()'''

        bktree = BKtree()

        for name, dbid in names:
            bktree.insert(name, dbid)

        testTuples = [("Calin", 1), ("Mihail", 2), ("Grig", 3), ("Iuia", 2)]

        print("Started testing corectness of word distance\n")
        for test in testTuples:

            print(f"Searching for words resembling {test[0]}, max Levenshtein distance {test[1]}")
            foundList = bktree.search(test[0], test[1])

            print(f"{len(foundList)} results found")
            for found in foundList:

                if BKtree.LevenshteinDistance(test[0], found[0]) > test[1]:
                    print(f"Wrong example found: {found[0]} for searched word: {test[0]}")
                    return

            print("Example passed\n")

        print("Testing save and load in file\n")

        BKtree.save(bktree, "tree.bkt")
        bktree2 = BKtree.load("tree.bkt")

        print("Data structure successfully loaded from file\n")
        print("Testing again for word distance\n")

        for test in testTuples:

            print(f"Searching for words resembling {test[0]}, max Levenshtein distance {test[1]}")
            foundList = bktree2.search(test[0], test[1])

            print(f"{len(foundList)} results found")
            for found in foundList:

                if BKtree.LevenshteinDistance(test[0], found[0]) > test[1]:
                    print(f"Wrong example found: {found[0]} for searched word: {test[0]}")
                    return

            print("Example passed\n")

    @staticmethod
    def test_bktree_rndtests(test_count):

        for t in range(test_count):

            print(f"-----------------------------------------------\nTest number {t}\n")

            names = []

            namesLen = randint(100, 10000)

            chrs = [chr(i) for i in range(ord('a'), ord('z') + 1)] + \
                   [chr(i) for i in range(ord('A'), ord('Z') + 1)]

            for i in range(namesLen):

                name = "".join([choice(chrs) for _ in range(randint(3, 8))])
                names.append((name, i))

            bktree = BKtree()

            for name, dbid in names:
                bktree.insert(name, dbid)

            testTuplesLen = randint(5, 20)
            testTuples = []

            for _ in range(testTuplesLen):
                testTuples.append(("".join([choice(chrs) for _ in range(randint(3, 8))]), randint(1, 5)))

            print("Started testing corectness of word distance\n")
            for test in testTuples:

                print(f"Searching for words resembling {test[0]}, max Levenshtein distance {test[1]}")
                foundList = bktree.search(test[0], test[1])

                print(f"{len(foundList)} results found")
                for found in foundList:

                    if BKtree.LevenshteinDistance(test[0], found[0]) > test[1]:
                        print(f"Wrong example found: {found[0]} for searched word: {test[0]}")
                        return

                print("Example passed\n")

            print("Testing save and load in file\n")

            BKtree.save(bktree, "treetest2.bkt")
            bktree2 = BKtree.load("treetest2.bkt")

            print("Data structure successfully loaded from file\n")
            print("Testing again for word distance\n")

            for test in testTuples:

                print(f"Searching for words resembling {test[0]}, max Levenshtein distance {test[1]}")
                foundList = bktree2.search(test[0], test[1])

                print(f"{len(foundList)} results found")
                for found in foundList:

                    if BKtree.LevenshteinDistance(test[0], found[0]) > test[1]:
                        print(f"Wrong example found: {found[0]} for searched word: {test[0]}")
                        return

                print("Example passed\n")


if __name__ == '__main__':

    BKtree.test_bktree_rndtests(10)











