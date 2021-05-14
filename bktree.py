from random import shuffle

class Node:

    def __init__(self, name: str, dbId: list):

        self.name = name  # string ul efectiv
        self.dbIds = {dbId}  # id urile din baza de date a acelui string (mai multe persoane cu acelasi nume)

        self.nextNodes = []  # [(nod urmator, distanta pana la el), ...]


class BKtree:

    # TODO: search cache implementation

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

    def insert(self, strToInsert, dbId):

        if self.root is None:

            self.root = Node(strToInsert, dbId)
            self.allNodes.update({self.root.name: self.root})

            return

        currentNode = self.root
        while currentNode is not None:

            if currentNode.name == strToInsert:

                if currentNode.dbIds is None:
                    currentNode.dbIds = {dbId}

                elif dbId not in currentNode.dbIds:
                    currentNode.dbIds.add(dbId)

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

                return

    def search(self, strToSearch, maxDistance=3):

        if self.root is None:
            return []

        foundList = []  # [(nume, distanta, {dbid1, dbid2, ...}), ...]

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

        return foundList

    def delete(self, strToDelete, dbId):

        if strToDelete in self.allNodes.keys():
            dbIds = self.allNodes[strToDelete].dbIds

            if dbId in dbIds:
                dbIds.pop()

                if not dbIds:
                    dbIds = None


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

    print(bktree.search("Calin", maxDistance=1))
    print(bktree.search("Mihail", maxDistance=2))
    print(bktree.search("Grig", maxDistance=3))
    print(bktree.search("Iuia", maxDistance=2))


if __name__ == '__main__':

    print(BKtree.LevenshteinDistance('Calin', 'Halin'))

    test_bktree()









