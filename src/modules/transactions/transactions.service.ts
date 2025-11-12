import { ForbiddenException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { STATUS, Transactions } from './entities/transactions.entity';
import { Account } from '../accounts/entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TRANSACTIONS_TYPE } from './entities/transactions.entity';
import { NotFoundException } from '@nestjs/common';
import { AccountsService } from '../accounts/accounts.service';
import { createDataSource } from '../data.source';
import { ConfigService } from '@nestjs/config';
import { TransactionsOutcome } from './transactions.outcome';
import { Logger } from '@nestjs/common';





@Injectable()
export class TransactionsService {
    constructor(@InjectRepository(Transactions) private transactionsRepository:Repository<Transactions>,
                @InjectRepository(Account) private accountRepository:Repository<Account>,
                private accountsService:AccountsService,
                private configService:ConfigService,
                private transactionOutcome:TransactionsOutcome
            ){}

            async transferFunds(accountAId: number, accountBId: number, amount: number){

                const AppDataSource = createDataSource(this.configService);
    
                await AppDataSource.initialize().
                then(()=>
                    console.log('Data Source has been initialised!')
                )
                .catch((err)=>
                     console.error('Error during Data Source initialisation', err)
                )
                
                const queryRunner = AppDataSource.createQueryRunner();
                

                await queryRunner.connect();
                await queryRunner.startTransaction();

                try {
                    
                    const accountA = await queryRunner.manager.findOne(Account, { where: { accountID: accountAId } });
                    const accountB = await queryRunner.manager.findOne(Account, { where: { accountID: accountBId } });

                    if (!accountA) throw new Error('Source account not found');
                    if (!accountB) throw new Error('Destination account not found');
                    if (accountA.balance < amount) throw new Error('Insufficient funds in source account');

                    accountA.balance -= amount;
                    accountB.balance += amount;

                    accountA.updatedAt = new Date()
                    accountB.updatedAt = new Date()

                    await queryRunner.manager.save(accountA);
                    await queryRunner.manager.save(accountB);

                    // Create transaction record
                    let transaction = this.
                    transactionOutcome.
                    completedDataUpdate(amount,TRANSACTIONS_TYPE.TRANSFER,accountAId,accountBId)


                    
                    await queryRunner.manager.save(transaction)
                    
                    await queryRunner.commitTransaction();
                    Logger.log("Transaction Completed!")

                     return transaction;
                } catch (error) {

                    let transaction = this.
                    transactionOutcome.
                    failedDataUpdate(amount,TRANSACTIONS_TYPE.TRANSFER,accountAId,accountBId)
                   
                    transaction = await queryRunner.manager.save(transaction)
                    await queryRunner.commitTransaction();

                    Logger.log("Transaction Failed")

                    await queryRunner.rollbackTransaction();
                    throw error;    
                } finally {
                    await queryRunner.release();
                }

            }

            async depositTransaction(accountId:number,deposit:number){

                const AppDataSource = createDataSource(this.configService);

                await AppDataSource.initialize().
                then(()=>
                    console.log('Data Source has been initialised!')
                )
                .catch((err)=>
                     console.error('Error during Data Source initialisation', err)
                )
                
                const queryRunner = AppDataSource.createQueryRunner();
                
                await queryRunner.connect();
                await queryRunner.startTransaction();
                
                try {
                    
                    
                    const account = queryRunner.manager.findOne(Account,{where:{accountID:accountId}})
                    if (!account) throw new Error('account not found');

                    this.accountsService.deposit(accountId,deposit)
                    
                    let transaction = this.
                    transactionOutcome.
                    completedDataUpdate(deposit,TRANSACTIONS_TYPE.DEPOSIT,accountId)
                    
                    await queryRunner.manager.save(transaction)
                    
                    await queryRunner.commitTransaction();
                    Logger.log("Transaction Completed!")

                    return transaction;
    
                } catch (error) {
                          let transaction = this.
                    transactionOutcome.
                    failedDataUpdate(deposit,TRANSACTIONS_TYPE.DEPOSIT,undefined,accountId)
                   
                    transaction = await queryRunner.manager.save(transaction)
                    await queryRunner.commitTransaction();

                    Logger.log("Transaction Failed")

                    await queryRunner.rollbackTransaction();
                    throw error; 

                } finally{
                    await queryRunner.release();
                }
            }

            async withdrawTransaction(accountId:number,withdraw:number){

                const AppDataSource = createDataSource(this.configService);

                await AppDataSource.initialize().
                then(()=>
                    console.log('Data Source has been initialised!')
                )
                .catch((err)=>
                     console.error('Error during Data Source initialisation', err)
                )
                
                const queryRunner = AppDataSource.createQueryRunner();
                
                await queryRunner.connect();
                await queryRunner.startTransaction();
                
                try {
                    
                    const account = queryRunner.manager.findOne(Account,{where:{accountID:accountId}})
                    if (!account) throw new Error('account not found');

                    this.accountsService.withdraw(accountId,withdraw)

                    let transaction = this.
                    transactionOutcome.
                    completedDataUpdate(withdraw,TRANSACTIONS_TYPE.WITHDRAW,accountId)

                    transaction = await queryRunner.manager.save(transaction)

                    await queryRunner.commitTransaction();
                    Logger.log("Transaction Completed!")

                    return transaction;
    
                } catch (error) {
                          let transaction = this.
                    transactionOutcome.
                    failedDataUpdate(withdraw,TRANSACTIONS_TYPE.WITHDRAW,accountId)
                   
                    transaction = await queryRunner.manager.save(transaction)
                    await queryRunner.commitTransaction();

                    Logger.log("Transaction Failed")

                    await queryRunner.rollbackTransaction();
                    throw error; 

                } finally{
                    await queryRunner.release();
                }
            }

    
}
