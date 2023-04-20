const { Block } = require('./block');
const { Transaction } = require('./transaction');

class Chain {

    constructor() {

        this.chain = [this.createGenesisBlock()];
        this.difficultly = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {

        return new Block("Genesis Block", "0");
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

    minePendingTransactions(miningRewardAdr) {
        let block = new Block(this.pendingTransactions);
        block.mineBlock(this.difficultly);
        console.log("Block successfully mined!");

        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null, miningRewardAdr, this.miningReward),
        ]
    }

    addTransaction(transaction) {
        if (!transaction.fromAdr || !transaction.toAdr) {
            throw new Error('Transaction must include from and to address.');
        }

        if (!transaction.isValid()) {
            throw new Error('Cannot and invalid transaction to chain.')
        }

        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(adr) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAdr === adr) {
                    balance -= trans.quantity;
                }

                if (trans.toAdr === adr) {
                    balance += trans.quantity;
                }
            }
        }

        return balance;
    }

    isValid() {

        const length = this.getLength();
        if (1 === length) {
            return true;
        }

        for (let i = 1; i < length; ++i) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1]

            if (!currentBlock.hasValidTransactions()) {
                return false;
            }

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

module.exports.Chain = Chain;