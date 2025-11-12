import { Injectable } from "@nestjs/common";
import { Transactions } from "./entities/transactions.entity";
import { STATUS,TRANSACTIONS_TYPE } from "./entities/transactions.entity";

@Injectable()
export class TransactionsOutcome{

    transactionFieldsUpdate(amount:number,transtype:TRANSACTIONS_TYPE, status:STATUS,accountAId?:number,accountBId?:number){

        /**Updates the Transaction fields with the required data */

        let transaction = new Transactions();

        if (typeof(accountAId) !== "undefined") {
                transaction.sourceAccountID = accountAId;
        }
        
        if (typeof(accountBId) !== "undefined") {
                transaction.destinationAccountID = accountBId;
        }
        transaction.amount = amount;
        transaction.transactionsType = transtype;
        transaction.status = status,
        transaction.transactionDate = new Date();
        transaction.timeStamp = new Date();
        
        return transaction
    }
}