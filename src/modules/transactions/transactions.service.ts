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
import { Logger } from '@nestjs/common';





@Injectable()
export class TransactionsService {
    constructor(@InjectRepository(Transactions) private transactionsRepository:Repository<Transactions>,
                @InjectRepository(Account) private accountRepository:Repository<Account>,
                private accountsService:AccountsService,
                private configService:ConfigService,
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

                    await queryRunner.manager.save(accountA);
                    await queryRunner.manager.save(accountB);

                    // Create transaction record
                    let transaction = new Transactions();
                    transaction.sourceAccountID = accountAId;
                    transaction.destinationAccountID = accountBId;
                    transaction.amount = amount;
                    transaction.transactionsType = TRANSACTIONS_TYPE.TRANSFER;
                    transaction.status = STATUS.COMPLETED;
                    transaction.transactionDate = new Date();
                    transaction.timeStamp = new Date();

                    transaction = await queryRunner.manager.save(transaction)
                    
                    await queryRunner.commitTransaction();
                    Logger.log("Transaction commited and saved")

                     return transaction;
                } catch (error) {
                    await queryRunner.rollbackTransaction();
                    throw error;    
                } finally {
                    await queryRunner.release();
                }

            }

            async depositTransaction(accountId:number,deposit:number){
            
                const account = await this.accountRepository.findOne({where:{accountID:accountId}})
                this.accountsService.withdraw(accountId,deposit)
            
                const transactionExecution = await this.transactionsRepository.create({
                    transactionsType:TRANSACTIONS_TYPE.DEPOSIT,
                    amount: deposit,
                    transactionDate: new Date(),
                    destinationAccountID:account?.accountID,
                    status:STATUS.COMPLETED,
                    timeStamp: new Date()
                })
                
                return this.transactionsRepository.save(transactionExecution)
            }

        async withdrawTransaction(accountId:number,withdraw:number){

        const account = await this.accountRepository.findOne({where:{accountID:accountId}})

        if (!account) throw new NotFoundException("account not found")
        if (account.balance < withdraw) throw new ForbiddenException("Insufficient funds")

        this.accountsService.withdraw(accountId,withdraw)

        const transactionExecution = await this.transactionsRepository.create({
            transactionsType:TRANSACTIONS_TYPE.WITHDRAW,
            amount: withdraw,
            transactionDate: new Date(),
            sourceAccountID: account?.accountID,
            status:STATUS.COMPLETED,
            timeStamp: new Date()
        })

        return this.transactionsRepository.save(transactionExecution)
    }
}
