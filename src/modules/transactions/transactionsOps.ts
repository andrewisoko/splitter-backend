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
                private dataSource: DataSource

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


    // async withdrawTransaction(accountId:number,withdraw:number,userName:string){

    //             const queryRunner = this.dataSource.createQueryRunner();
    //             let transactionFailed;
    //             let transaction;

    //             await queryRunner.connect();
    //             await queryRunner.startTransaction();
                
    //             try {

    //                 const account = await queryRunner.manager.findOne(Account, {
    //                     where: { accountID: accountId },
    //                     lock:{mode:'pessimistic_write'}});

    //                 if (!account) throw new NotFoundException('Account not found');  
         
    //                 /** valid accoun't user process */
    //                 const accountWithUser = await  queryRunner.manager.findOne(Account, {
    //                 where: { accountID: accountId },
    //                 relations: ['user']
    //                 }); 
    //                 if (!accountWithUser) throw new  NotFoundException("account not found")
    //                 if (accountWithUser.user.userName !== userName) throw new UnauthorizedException("You do not own this account");
    //                 /**  until here  */

    //                 if(accountWithUser.balance <= 0) throw new BadRequestException('Invald amount');
    //                 if(accountWithUser.balance < withdraw) throw new BadRequestException('invald amount'); 
                    
    //                 accountWithUser.balance -= withdraw
    //                 accountWithUser.updatedAt = new Date()

    //                 await queryRunner.manager.save(accountWithUser)

    //                 transaction = this.
    //                 transactionOutcome.
    //                 transactionFieldsUpdate(withdraw,TRANSACTIONS_TYPE.WITHDRAW,STATUS.COMPLETED,accountId)

    //                 transaction = await queryRunner.manager.save(transaction)

    //                 await queryRunner.commitTransaction();
    //                 Logger.log("Transaction Completed!")

    //                 return transaction;

    //             } catch (error) {

    //                 await queryRunner.rollbackTransaction();
    //                 transactionFailed = this.
    //                 transactionOutcome.
    //                 transactionFieldsUpdate(withdraw,TRANSACTIONS_TYPE.WITHDRAW,STATUS.FAILED,accountId)
    //                 throw error; 
                    
    //             } finally{
    //                 await queryRunner.release();
    //                 if (transactionFailed) {
    //                     await this.transactionsRepository.save(transactionFailed);
    //                     Logger.log("Transaction Failed")
    //                     }
    //             }
    //         }