import types

from engine import *
from ioSystem import getConfigOpts
import socket
from threading import Thread
import logging
import json


class Listen:

    CALLABLE = {
        'su': (Recommender.getSimilarUsers, 1),
        'suat': (Recommender.getSimilarUsersByattr, 2),
        'fn': (Recommender.findByName, 1),
        'anu': (Recommender.addNewUser, 3),
        'chu': (Recommender.changeUser, 4),
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
            args.append(req[str(i)])

        return getGen(*args), req['rescnt']

    def makeRes(self, resGen, resCnt):

        res = {}

        if isinstance(resGen, types.GeneratorType):

            for i in range(resCnt):

                nextres = next(resGen)
                if nextres is None:
                    break

                res.update({i: nextres})

        else:
            res.update({'resValue': resGen})

        return json.dumps(res).encode('utf-8')

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

                logging.info(f"request received: {req}")

                resGen, resCnt = self.parseReq(req)
                conn.send(self.makeRes(resGen, resCnt))

                logging.info(f"response delivered")

        except socket.timeout:
            logging.warning(f"Connection with {connAddr} timed out; connection closed")

        except Exception as err:
            logging.warning(f"Error at connection with address {connAddr}: {err}; connection closing...")

    def listen(self):

        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM, socket.IPPROTO_TCP)
        self.sock.bind((self.addr, self.port))

        self.sock.listen(self.maxConnQueue)

        print("Listener ready for connections")
        logging.info("Listener ready for connections")

        try:
            while True:

                conn, connAddr = self.sock.accept()

                logging.info(f"Connection with {connAddr} established")

                connThr = Thread(target=self.handleConnection, kwargs={'conn': conn, 'connAddr': connAddr})
                self.conns.append((conn, connAddr, connThr))

                connThr.start()

        except KeyboardInterrupt:
            self.sock.close()


if __name__ == '__main__':

    logging.basicConfig(filename="SE_log.txt", filemode="w", level=logging.DEBUG)

    recommender = Recommender("ConfigFile.json")

    listener = Listen(recommender)
    listener.listen()

    logging.info("Listener is closed.")
