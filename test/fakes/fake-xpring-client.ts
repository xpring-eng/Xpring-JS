import { XpringClientDecorator } from "../../src/xpring-client-decorator";
import TransactionStatus from "../../src/transaction-status";
import { Wallet } from "../../src/index";
import { TransactionStatus as RawTransactionStatus } from "xpring-common-js"

/* global BigInt */

class FakeXpringClient implements XpringClientDecorator{
    public constructor(
        public getBalanceValue: BigInt,
        public getTransactionStatusValue: TransactionStatus,
        public sendValue: string,
        public getLastValidatedLedgerSequenceValue: number,
        public getRawTransactionStatusValue: RawTransactionStatus
    ) {}
    
    public async getBalance(address: string): Promise<BigInt> {
        return Promise.resolve(this.getBalanceValue);
    }    
        
    public async getTransactionStatus(transactionHash: string): Promise<TransactionStatus> {
        return Promise.resolve(this.getTransactionStatusValue);
    }

    public async send(amount: any, destination: string, sender: Wallet): Promise<string> {
        return Promise.resolve(this.sendValue);
    }

    public async getLastValidatedLedgerSequence(): Promise<number> {
        return Promise.resolve(this.getLastValidatedLedgerSequenceValue)
    }
    
    public async getRawTransactionStatus(transactionHash: string): Promise<RawTransactionStatus> {
       return Promise.resolve(this.getRawTransactionStatusValue);
    }
}

export default FakeXpringClient;