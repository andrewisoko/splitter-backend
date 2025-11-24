import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { STATUS, Transactions } from './entities/transactions.entity';
import { Account } from '../accounts/entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TRANSACTIONS_TYPE } from './entities/transactions.entity';
import { NotFoundException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { GetTransactionsDto } from './dto/create_transactions.DTO';
import { TransactionsOutcome } from './transactions.outcome';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';


@Injectable()
export class TransactionsService {
    constructor(@InjectRepository(Transactions) private transactionsRepository:Repository<Transactions>,
                private transactionOutcome:TransactionsOutcome,
                private dataSource: DataSource
            ){}


            async transferFunds(accountAId: number, accountBId: number, amount: number){

                const queryRunner = this.dataSource.createQueryRunner();

                await queryRunner.connect();
                await queryRunner.startTransaction();

                try {
                    
                    const accountA = await queryRunner.manager.findOne(Account, { where: { accountID: accountAId },relations:["user"], lock:{mode:'pessimistic_write'} });
                    const accountB = await queryRunner.manager.findOne(Account, { where: { accountID: accountBId },relations:["user"], lock:{mode:'pessimistic_write'}  });

                    if (accountAId === accountBId) throw new BadRequestException("Invalid Transaction");
                    if (!accountA) throw new NotFoundException('Source account not found');
                    if (!accountB) throw new NotFoundException('Destination account not found');
                    if (accountA.balance < amount) throw new BadRequestException('Insufficient funds in source account');

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

                    await queryRunner.rollbackTransaction();
                    let transaction = this.
                    transactionOutcome.
                    transactionFieldsUpdate(amount,TRANSACTIONS_TYPE.TRANSFER,STATUS.FAILED,accountAId,accountBId)
                   
                    transaction = await queryRunner.manager.save(transaction)
                    Logger.log("Transaction Failed")
                   
                    throw error;    
                } finally {
                    await queryRunner.release();
                }

            }

            async depositTransaction(accountId:number,deposit:number){

                const queryRunner = this.dataSource.createQueryRunner();
                await queryRunner.connect();
                await queryRunner.startTransaction();
                
                try {
                    const account = await queryRunner.manager.findOne(Account, { where: { accountID: accountId },relations:["user"], lock:{mode:'pessimistic_write'} });
               
                    if (!account) throw new NotFoundException('Account not found');
                    if(account.balance + deposit >= 12000) throw new BadRequestException('Maximum fund amount reached');
                    if( account.balance >= 12000) throw new BadRequestException('Maximum fund amount reached');

                    account.balance += deposit
                    account.updatedAt = new Date()

                    await queryRunner.manager.save(account);
                    
                    let transaction = this.
                    transactionOutcome.
                    transactionFieldsUpdate(deposit,TRANSACTIONS_TYPE.DEPOSIT,STATUS.COMPLETED,accountId)
                    
                    await queryRunner.manager.save(transaction)
                    
                    await queryRunner.commitTransaction();
                    Logger.log("Transaction Completed!")

                    return transaction;
    
                } catch (error) {

                    await queryRunner.rollbackTransaction();
                    let transaction = this.
                    transactionOutcome.
                    transactionFieldsUpdate(deposit,TRANSACTIONS_TYPE.DEPOSIT,STATUS.FAILED,accountId)
                   
                    transaction = await queryRunner.manager.save(transaction)

                    Logger.log("Transaction Failed")
                    throw error; 

                } finally{
                    await queryRunner.release();
                }
            }

            async withdrawTransaction(accountId:number,withdraw:number,userName:string){

                const queryRunner = this.dataSource.createQueryRunner();

                 let transactionFailed;
                await queryRunner.connect();
                await queryRunner.startTransaction();
                
                try {

                    const account = await queryRunner.manager.findOne(Account, {
                        where: { accountID: accountId },
                        lock:{mode:'pessimistic_write'} });

                    if (!account) throw new NotFoundException('Account not found');  
                    const accountWithUser = await  queryRunner.manager.findOne(Account, {
                    where: { accountID: accountId },
                    relations: ['user']
                    }); 
                   
                
                    
                    if (!accountWithUser) throw new  NotFoundException("account not found")
                    
                    if (accountWithUser.user.userName !== userName) throw new UnauthorizedException("You do not own this account");
                    if(account.balance <= 0) throw new BadRequestException('Invald amount');
                    if(account.balance < withdraw) throw new BadRequestException('invald amount'); 
                    
                    account.balance -= withdraw
                    account.updatedAt = new Date()

                    await queryRunner.manager.save(account)

                    let transaction = this.
                    transactionOutcome.
                    transactionFieldsUpdate(withdraw,TRANSACTIONS_TYPE.WITHDRAW,STATUS.COMPLETED,accountId)

                    transaction = await queryRunner.manager.save(transaction)

                    await queryRunner.commitTransaction();
                    Logger.log("Transaction Completed!")

                    return transaction;

                } catch (error) {

                    await queryRunner.rollbackTransaction();
                    transactionFailed = this.
                    transactionOutcome.
                    transactionFieldsUpdate(withdraw,TRANSACTIONS_TYPE.WITHDRAW,STATUS.FAILED,accountId)
                    Logger.error('Error during withdrawTransaction:', error);
                    throw error; 
                    
                } finally{
                    await queryRunner.release();
                    if (transactionFailed) {
                        // await this.transactionsRepository.save(transactionFailed);
                        Logger.log("Transaction Failed")
                        }
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
