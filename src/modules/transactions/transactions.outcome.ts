import { Injectable } from "@nestjs/common";
import { Transactions } from "./entities/transactions.entity";
import { STATUS,TRANSACTIONS_TYPE } from "./entities/transactions.entity";

@Injectable()
export class TransactionsOutcome{

    completedDataUpdate(amount:number, transtype:TRANSACTIONS_TYPE,accountAId?:number,accountBId?:number){

        /**Updates the Transactions field with the required data */

        let transaction = new Transactions();

        if (typeof(accountAId) !== "undefined") {
                transaction.sourceAccountID = accountAId;
        }
        
        if (typeof(accountBId) !== "undefined") {
                transaction.destinationAccountID = accountBId;
        }
        transaction.amount = amount;
        transaction.transactionsType = transtype;
        transaction.status = STATUS.COMPLETED;
        transaction.transactionDate = new Date();
        transaction.timeStamp = new Date();
        
        return transaction
    }

    failedDataUpdate(amount:number,transtype:TRANSACTIONS_TYPE,accountAId?:number,accountBId?:number){

        
        let transaction = new Transactions();

        if (typeof(accountAId) !== "undefined") {
                transaction.sourceAccountID = accountAId;
        }
        
            if (typeof(accountBId) !== "undefined") {
                transaction.destinationAccountID = accountBId;
        }
        transaction.amount = amount;
        transaction.transactionsType = transtype;
        transaction.status = STATUS.FAILED;
        transaction.transactionDate = new Date();
        transaction.timeStamp = new Date();

        return transaction
    }
}