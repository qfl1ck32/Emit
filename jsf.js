const fs = require('fs');
const express = require('express');
const path = require('path');
const net = require('net');
const { json } = require('express');

const SE_PORT = 11000;
const SE_ADDR = 'localhost';
const SE_RES_CNT = 20;
const app = express();


function getLen_16b(str){

    slen = str.length;

    strlen = new Uint8Array(2);

    strlen[0] = (slen >> 8) & 255;
    strlen[1] = slen & 255;
    
    return strlen;
}

function seReq(reqStr, callback){

    let decoder = new TextDecoder('utf8');

    const sock = net.createConnection({port: SE_PORT, host: SE_ADDR}, () => {
        
        sock.write(getLen_16b(reqStr));
        sock.write(reqStr);
    });

    sock.on('data', (data) => {

        sock.destroy();
        jsonData = JSON.parse(decoder.decode(data));
        
        callback(jsonData);
    });
}

function makeSimUserReq(recMatrixIndex){

    return JSON.stringify({'reqtype': 'su', 
                            'rescnt': SE_RES_CNT,
                            '0': recMatrixIndex});
}

function makeSimUserByattrReq(recMatrixIndex, attributes){

    return JSON.stringify({'reqtype': 'suat', 
                            'rescnt': SE_RES_CNT,
                            '0': attributes,
                            '1': recMatrixIndex});
}

function makeFindByNameReq(name){

    return JSON.stringify({'reqtype': 'fn', 
                            'rescnt': SE_RES_CNT,
                            '0': name});
}

function makeAddNewUserReq(name, attributes, dbIndex){

    return JSON.stringify({'reqtype': 'anu', 
                            'rescnt': SE_RES_CNT,
                            '0': attributes,
                            '1': name,
                            '2': dbIndex});
}

function makeChUserReq(recMatrixIndex, name, attributes, dbIndex){

    return JSON.stringify({'reqtype': 'chu', 
                            'rescnt': SE_RES_CNT,
                            '0': recMatrixIndex,
                            '1': attributes,
                            '2': name,
                            '3': dbIndex});
}


seReq(makeSimUserReq(18), (simUsers) => {

    console.log(simUsers);
});
//seReq(makeSimUserByattrReq(18, [0.9, 0.8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.9, 0]));
//seReq(makeFindByNameReq("Calin"));
//seReq(makeAddNewUserReq("Calin6", [0.9, 0.8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.9, 0], 15002));
//seReq(makeChUserReq(1000, "Calin100", [0.9, 0.8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.9, 0], 10000));

