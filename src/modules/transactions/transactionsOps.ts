import { Injectable, Logger } from "@nestjs/common";
import { Transactions } from "./entities/transactions.entity";
import { STATUS,TRANSACTIONS_TYPE } from "./entities/transactions.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Account } from "../accounts/entities/account.entity";
import { NotFoundException } from "@nestjs/common";
import { DataSource } from "typeorm";



@Injectable()
export class TransactionsOps{

    constructor(@InjectRepository(Account) private accountRepository:Repository<Account>,
                @InjectRepository(Transactions) private transactionsRepository:Repository<Transactions>,
                private dataSource: DataSource,
            

){}
    
    async account(accountId:number):Promise<Account>{

        const accountWithUser = await this.accountRepository.findOne({
            where: { accountID: accountId },
            relations: ['user']
            }); 
        if (!accountWithUser) throw new  NotFoundException("account not found")  
        
        return accountWithUser  
    }

    async transactionFailed(transaction){

        if(transaction){
            await this.transactionsRepository.save(transaction);
            return Logger.log("Transaction Failed");
        }
    }

    async queryRunner(transaction:any,accountA:Account,accountB?:Account){
        
        const queryRunner = this.dataSource.createQueryRunner();
        try{

            await queryRunner.connect();
            await queryRunner.startTransaction();
    
            await queryRunner.manager.save(accountA)

            if (typeof(accountB) !== "undefined") {
              await queryRunner.manager.save(accountB)
             }
             
            await queryRunner.manager.save(transaction)
            await queryRunner.commitTransaction()
            return Logger.log("Transaction Completed!")

        }catch(error){
        await queryRunner.rollbackTransaction();
        throw error;
        } finally {
        await queryRunner.release();
        }

    }


    transactionFieldsUpdate(
        amount:number,
        currency:string,
        transtype:TRANSACTIONS_TYPE,
        status:STATUS,
        amountConverted?:number,
        secondCurrency?:string,
        accountAId?:number,
        accountBId?:number,
        ){

        /**Updates the Transaction fields with the required data */

        let transaction = new Transactions();
        

        if (typeof(accountAId) !== "undefined") {
                transaction.sourceAccountID = accountAId;
        }
        
        if (typeof(accountBId) !== "undefined") {
                transaction.destinationAccountID = accountBId;
        }
        if (typeof(amountConverted) !== "undefined") {
                transaction.amountConverted = amountConverted;
        }
        if (typeof(secondCurrency) !== "undefined") {
                transaction.secondCurrency = secondCurrency;
        }
        transaction.amount = amount;
        transaction.currency = currency;
        transaction.transactionsType = transtype;
        transaction.status = status,
        transaction.transactionDate = new Date();
        transaction.timeStamp = new Date();
        
        return transaction
    }
    
}

