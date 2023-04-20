const MOMENT = require('moment');
const SHA256 = require('crypto-js/sha256');

class Block {

    constructor(transactions, previousHash = '') {

        this.minedTime = 0;
        this.createdDate = MOMENT();
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {

        return SHA256(this.minedTime + this.previousHash + this.createdDate + JSON.stringify(this.transactions)).toString();
    }

    isValid() {

        return this.calculateHash() === this.hash;
    }

    mineBlock(difficultly) {
        while (this.hash.substring(0, difficultly) !== Array(difficultly + 1).join("0")) {
            this.minedTime++;
            this.hash = this.calculateHash();
        }


        console.log("Time: " + this.minedTime + "seconds");
        console.log("Block mined: " + this.hash);
    }

    hasValidTransactions() {
        for (const tx of this.transactions) {
            if (!tx.isValid()) {
                return false;
            }
        }

        return true;
    }
}

module.exports.Block = Block;