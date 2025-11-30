import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { STATUS, Transactions } from './entities/transactions.entity';
import { Account } from '../accounts/entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TRANSACTIONS_TYPE } from './entities/transactions.entity';
import { NotFoundException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { GetTransactionsDto } from './dto/create_transactions.DTO';
import { TransactionsOps } from './transactionsOps';
import { UnauthorizedException } from '@nestjs/common';
import { ConversionCurrencies } from '../accounts/currency-conversion';




@Injectable()
export class TransactionsService {
    constructor(@InjectRepository(Transactions) private transactionsRepository:Repository<Transactions>,
                @InjectRepository(Account) private accountRepository:Repository<Account>,
                private transactionOps:TransactionsOps,
                private conversionCurrencies:ConversionCurrencies
            ){}


            async transferFunds(accountAId: number, accountBId: number, amount: number, username:string){

                let transactionFailed;
                let transaction;
                let accountA;
                let accountB;

                try {
                    accountA = await this.transactionOps.account(accountAId);
                    accountB = await this.transactionOps.account(accountBId);
                    
        
                    if (accountAId === accountBId) throw new BadRequestException("Invalid Transaction");
                    if (accountA.balance < amount) throw new BadRequestException('Insufficient funds in source account');
                    if (accountA.user.userName !== username) throw new UnauthorizedException("You do not own this account");
                    


                    await this.accountRepository.decrement({ accountID:accountAId },'balance', amount);
                    await this.accountRepository.increment({ accountID:accountBId },'balance', amount);

                    /* Re-fetch accounts to get their updated balances*/
                    accountA = await this.transactionOps.account(accountAId);
                    accountB = await this.transactionOps.account(accountBId);

                    accountA.updatedAt = new Date()
                    accountB.updatedAt = new Date()

                    transaction = this.
                    transactionOps.transactionFieldsUpdate(amount,TRANSACTIONS_TYPE.TRANSFER,STATUS.COMPLETED,accountAId,accountBId)

                    await this.transactionOps.queryRunner(transaction,accountA,accountB)

                    return transaction
                    
                } catch (error) {
                    transactionFailed = this.
                    transactionOps.
                    transactionFieldsUpdate(amount,TRANSACTIONS_TYPE.TRANSFER,STATUS.FAILED,accountAId,accountBId);
                    throw error;  
                    
                }finally{
                    await this.transactionOps.transactionFailed(transactionFailed)
                }
            }
         
            
            async depositTransaction(accountId:number,deposit:number,userName:string){
                
                let transactionFailed;
                let transaction;
                let account;
                
                try {
                    
                    account = await this.transactionOps.account(accountId);
                    
                    if (account.user.userName !== userName) throw new UnauthorizedException("You do not own this account");
                    if (!account) throw new NotFoundException('Account not found');
                    if(account.balance + deposit >= 12000) throw new BadRequestException('Maximum fund amount reached');
                    if( account.balance >= 12000) throw new BadRequestException('Maximum fund amount reached');
                    
                    
                    await this.accountRepository.increment({ accountID:accountId },'balance',deposit);
                    account = await this.transactionOps.account(accountId);
                    
                    account.updatedAt = new Date()

                    transaction = this.
                    transactionOps.
                    transactionFieldsUpdate(deposit,TRANSACTIONS_TYPE.DEPOSIT,STATUS.COMPLETED,accountId)

                    await this.transactionOps.queryRunner(transaction,account);

                    return transaction
                    
                } catch (error) {
                    transactionFailed = this.
                    transactionOps.
                    transactionFieldsUpdate(deposit,TRANSACTIONS_TYPE.DEPOSIT,STATUS.FAILED,accountId);
                    throw error;  
                }
                finally{
                    await this.transactionOps.transactionFailed(transactionFailed)
                }
              
            }

            async withdrawTransaction(accountId:number,withdraw:number,userName:string){

                let transactionFailed;
                let transaction;
                let account;
                
                try {
                    
                    account = await this.transactionOps.account(accountId);

                    if (account.user.userName !== userName) throw new UnauthorizedException("You do not own this account");
                    if(account.balance <= 0) throw new BadRequestException('Invald amount');
                    if(account.balance < withdraw) throw new BadRequestException('invald amount'); 
                    
                    await this.accountRepository.decrement({ accountID:accountId },'balance',withdraw);
                    account = await this.transactionOps.account(accountId);
                    account.updatedAt = new Date()

                    transaction = this.
                    transactionOps.
                    transactionFieldsUpdate(withdraw,TRANSACTIONS_TYPE.WITHDRAW,STATUS.COMPLETED,accountId);

                    await this.transactionOps.queryRunner(transaction,account);

                    return transaction
                    
                } catch (error) {
                    transactionFailed = this.
                    transactionOps.
                    transactionFieldsUpdate(withdraw,TRANSACTIONS_TYPE.WITHDRAW,STATUS.FAILED,accountId);
                    throw error;  
                }
                finally{
                    await this.transactionOps.transactionFailed(transactionFailed)
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
