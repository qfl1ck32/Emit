class Node:

    def __init__(self, name: str, dbId: list):

        self.name = name  # string ul efectiv
        self.dbIds = {dbId}  # id urile din baza de date a acelui string (mai multe persoane cu acelasi nume)

        self.nextNodes = []  # [(nod urmator, distanta pana la el), ...]


class BKtree:

    # TODO: search cache implementation

    @staticmethod
    def LevenshteinDistance(fstStr, sndStr):

        levd = [[0 for i in range(len(sndStr))] for j in range(len(fstStr))]

        for i in range(1, len(fstStr)):
            for j in range(1, len(sndStr)):

                if fstStr[i - 1] == sndStr[j - 1]:  # indecsi deplasati cu 1 datorita indexarii de la 0 si indexarii matricei de la 1
                    levd[i][j] = levd[i - 1][j - 1]
                else:
                    levd[i][j] = 1 + min(levd[i - 1][j - 1], levd[i - 1][j], levd[i][j - 1])

        return levd[len(fstStr) - 1][len(sndStr) - 1]

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

    def search(self, strToSearch, maxDistance=3) -> list(tuple(str, int, set)):

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









