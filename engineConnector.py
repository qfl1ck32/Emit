from engine import *
from ioSystem import getConfigOpts
import socket
from multiprocessing import Process
import logging
import json


class Listen:

    CALLABLE = {
        'su': (Recommender.getSimilarUsers, 1),
        'suat': (Recommender.getSimilarUsersByattr, 2),
        'fn': (Recommender.findByName, 1),
        'anu': (Recommender.addNewUser, 1),
        'chu': (Recommender.changeUser, 2),
    }

    def __init__(self, recommender):

        configOpts = getConfigOpts("ConfigFile.json")

        self.port = configOpts["SE_PORT"]
        self.addr = configOpts["SE_ADDR"]
        self.maxConnQueue = configOpts["MAX_QUEUE_SE_CONN"]
        self.connTimeout = configOpts["SE_CONN_TIMEOUT"]

        self.conns = []
        self.sock = None  # socket

        self.recommender = recommender

    def parseReq(self, req):

        req = json.loads(req)

        reqtype = req['reqtype']
        getGen, argcnt = Listen.CALLABLE[reqtype]

        args = [self.recommender]
        for i in range(argcnt):
            args.append(req[i])

        gen = getGen(*args)

    def handleConnection(self, conn, connAddr):

        try:

            conn.settimeout(self.connTimeout)

            while True:

                reqLen = conn.recv(2)

                if len(reqLen) == 0:
                    logging.info(f"Connection with {connAddr} closed")
                    return

                reqLen = int.from_bytes(reqLen, byteorder='big')
                req = conn.recv(reqLen)

                if len(req) == 0:
                    logging.info(f"Connection with {connAddr} closed")
                    return

                resGen, resCnt = self.parseReq(req)

                res = {}
                for i in range(resCnt):
                    res.update({i: next(resGen)})

                res = json.dumps(res)

                conn.send(len(res))
                conn.send(res)

        except socket.timeout:
            logging.warning(f"Connection with {connAddr} timed out; connection closing...")

        except Exception as err:
            logging.warning(f"Error at connection with address {connAddr}: {err}; connection closing...")

    def listen(self):

        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM, socket.IPPROTO_TCP)
        self.sock.bind((self.addr, self.port))

        self.sock.listen(self.maxConnQueue)

        try:
            while True:

                conn, connAddr = self.sock.accept()

                logging.info(f"Connection with {connAddr} established")

                connProc = Process(target=self.handleConnection, kwargs={'conn': conn, 'connAddr': connAddr})
                self.conns.append((conn, connAddr, connProc))

                connProc.start()

        except KeyboardInterrupt:
            self.sock.close()


if __name__ == '__main__':

    logging.basicConfig(filename="SE_log.txt")

    recommender = Recommender("ConfigFile.json")

    listener = Listen(recommender)
    listener.listen()
