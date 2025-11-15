import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { STATUS, Transactions } from './entities/transactions.entity';
import { Account } from '../accounts/entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TRANSACTIONS_TYPE } from './entities/transactions.entity';
import { NotFoundException } from '@nestjs/common';
import { AccountsService } from '../accounts/accounts.service';
import { Logger } from '@nestjs/common';
import { GetTransactionsDto } from './dto/create_transactions.DTO';
import { DataSourceConnection } from '../data.source';
import { TransactionsOutcome } from './transactions.outcome';





@Injectable()
export class TransactionsService {
    constructor(@InjectRepository(Transactions) private transactionsRepository:Repository<Transactions>,
                private accountsService:AccountsService,
                private transactionOutcome:TransactionsOutcome,
                private dataSourceConnection: DataSourceConnection
            ){}

            async transferFunds(accountAId: number, accountBId: number, amount: number){

  
                const queryRunner = await this.dataSourceConnection.createDataSource()
                

                await queryRunner.connect();
                await queryRunner.startTransaction();

                try {
                    
                    const accountA = await queryRunner.manager.findOne(Account, { where: { accountID: accountAId } });
                    const accountB = await queryRunner.manager.findOne(Account, { where: { accountID: accountBId } });

                    if (!accountA) throw new NotFoundException('Source account not found');
                    if (!accountB) throw new NotFoundException('Destination account not found');
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
                    transactionFieldsUpdate(amount,TRANSACTIONS_TYPE.TRANSFER,STATUS.COMPLETED,accountAId,accountBId)


                    
                    await queryRunner.manager.save(transaction)
                    
                    await queryRunner.commitTransaction();
                    Logger.log("Transaction Completed!")

                     return transaction;
                } catch (error) {

                    let transaction = this.
                    transactionOutcome.
                    transactionFieldsUpdate(amount,TRANSACTIONS_TYPE.TRANSFER,STATUS.FAILED,accountAId,accountBId)
                   
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

                const queryRunner = await this.dataSourceConnection.createDataSource()
                
                await queryRunner.connect();
                await queryRunner.startTransaction();
                
                try {

                    await this.accountsService.deposit(accountId,deposit)
                    
                    let transaction = this.
                    transactionOutcome.
                    transactionFieldsUpdate(deposit,TRANSACTIONS_TYPE.DEPOSIT,STATUS.COMPLETED,accountId)
                    
                    await queryRunner.manager.save(transaction)
                    
                    await queryRunner.commitTransaction();
                    Logger.log("Transaction Completed!")

                    return transaction;
    
                } catch (error) {
                          let transaction = this.
                    transactionOutcome.
                    transactionFieldsUpdate(deposit,TRANSACTIONS_TYPE.DEPOSIT,STATUS.FAILED,accountId)
                   
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

              const queryRunner = await this.dataSourceConnection.createDataSource()
                
                await queryRunner.connect();
                await queryRunner.startTransaction();
                
                try {
                    await this.accountsService.withdraw(accountId,withdraw)

                    let transaction = this.
                    transactionOutcome.
                    transactionFieldsUpdate(withdraw,TRANSACTIONS_TYPE.WITHDRAW,STATUS.COMPLETED,accountId)

                    transaction = await queryRunner.manager.save(transaction)

                    await queryRunner.commitTransaction();
                    Logger.log("Transaction Completed!")

                    return transaction;
    
                } catch (error) {
                          let transaction = this.
                    transactionOutcome.
                    transactionFieldsUpdate(withdraw,TRANSACTIONS_TYPE.WITHDRAW,STATUS.FAILED,accountId)
                   
                    transaction = await queryRunner.manager.save(transaction)
                    await queryRunner.commitTransaction();

                    Logger.log("Transaction Failed")

                    await queryRunner.rollbackTransaction();
                    throw error; 

                } finally{
                    await queryRunner.release();
                }
            }

            async getTransactions(filters: GetTransactionsDto){

                const queBuilder = await this.transactionsRepository.createQueryBuilder('t')
                .leftJoinAndSelect('t.sourceAccount', 'src')
                .leftJoinAndSelect('t.destinationAccount', 'dst')

                if (filters.accountId) {
                    queBuilder.andWhere('(t.sourceAccountID = :accId OR t.destinationAccountID = :accId)', { accId: filters.accountId });
                }
                if (filters.dateFrom) {
                    queBuilder.andWhere('t.transactionDate >= :dateFrom', { dateFrom: filters.dateFrom });
                }
                if (filters.dateTo) {
                queBuilder.andWhere('t.transactionDate <= :dateTo', { dateTo: filters.dateTo });
                }
                if (filters.types && filters.types.length > 0) {
                queBuilder.andWhere('t.transactionsType IN (:...types)', { types: filters.types });
                }

                if (filters.status && filters.status.length > 0) {
                queBuilder.andWhere('t.status IN (:...statuses)', { statuses: filters.status });
                }

                // Pagination
                const limit = filters.limit ?? 50;
                const offset = filters.offset ?? 0;
                queBuilder.take(limit).skip(offset);

                queBuilder.orderBy('t.transactionDate', filters.sort ?? 'DESC');

          
                return queBuilder.getMany();
            }
}
