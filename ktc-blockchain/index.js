const SHA256 = require('crypto-js/sha256');
const MOMENT = require('moment');

class Block {

    constructor(index, data, previousHash = '') {

        this.index = index;
        this.minedTime = 0;
        this.createdDate = MOMENT();
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {

        return SHA256(this.index + this.previousHash + this.createdDate + JSON.stringify(this.data)).toString();
    }

    isValid() {

        return this.calculateHash() === this.hash;
    }

    mineBlock(difficultly) {
        // const start = MOMENT();
        while (this.hash.substring(0, difficultly) !== Array(difficultly + 1).join("0")) {
            // this.minedTime = MOMENT().diff(start, 'seconds');
            this.minedTime++;
            this.hash = this.calculateHash();
        }

        console.log("Time: " + this.minedTime + "seconds");
        console.log("Block mined: " + this.hash);
    }
}

class Chain {

    constructor() {

        this.chain = [this.createGenesisBlock()];
        this.difficultly = 1;
    }

    createGenesisBlock() {

        return new Block(0, "Genesis Block", "0");
    }

    getLength() {

        return this.chain.length;
    }

    getLatestBlock() {

        const length = this.getLength();

        if (0 === length) {
            return null;
        }

        return this.chain[length - 1];
    }

    addBlock(block) {

        block.previousHash = this.getLatestBlock().hash;
        block.mineBlock(this.difficultly);
        this.chain.push(block);
    }

    isValid() {

        const length = this.getLength();
        if (1 === length) {
            return true;
        }

        for (let i = 1; i < length; ++i) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1]

            if (!currentBlock.isValid()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }

        }

        return true;
    }
}

let ktcCoin = new Chain();

console.log('Mining block 1...');
ktcCoin.addBlock(new Block(1, { amount: 113 }));

console.log('Mining block 1...');
ktcCoin.addBlock(new Block(2, { amount: 200 }));
