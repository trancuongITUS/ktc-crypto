const SHA256 = require('crypto-js/sha256');
const MOMENT = require('moment');

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const { Block } = require('./models/block');
const { Transaction } = require('./models/transaction');
const { Chain } = require('./models/blockchain');

const myKey = ec.keyFromPrivate('aa9318be1b0941c45ea2107e43252aafa202c94756e900e01bcfaf54953da148');
const myWalletAddress = myKey.getPublic('hex');

let ktcCoin = new Chain();
const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
ktcCoin.addTransaction(tx1);

console.log('\nStarting the miner ...');
ktcCoin.minePendingTransactions(myWalletAddress);
console.log('\nBalance of iuz: ', ktcCoin.getBalanceOfAddress(myWalletAddress));

console.log(ktcCoin.chain);