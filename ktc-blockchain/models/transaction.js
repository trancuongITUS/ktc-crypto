const { SHA256 } = require("crypto-js");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction {
    constructor(fromAdr, toAdr, quantity) {
        this.fromAdr = fromAdr;
        this.toAdr = toAdr;
        this.quantity = quantity;
    }

    calculateHash() {
        return SHA256(this.fromAdr + this.toAdr + this.quantity).toString();
    }

    signTransaction(signingKey) {
        if (signingKey.getPublic('hex') !== this.fromAdr) {
            throw new Error('Cannot sign transactions for other wallet!');
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid() {
        if (null === this.fromAdr) {
            return true;
        }

        if (!this.signature || 0 === this.signature.length) {
            throw new Error('No signature in this transaction.');
        }

        const publicKey = ec.keyFromPublic(this.fromAdr, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

module.exports.Transaction = Transaction;