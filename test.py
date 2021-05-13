import numpy
import random

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



