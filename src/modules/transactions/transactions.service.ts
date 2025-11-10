import { ForbiddenException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { STATUS, Transactions } from './entities/transactions.entity';
import { Account } from '../accounts/entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TRANSACTIONS_TYPE } from './entities/transactions.entity';
import { NotFoundException } from '@nestjs/common';
import { AccountsService } from '../accounts/accounts.service';


@Injectable()
export class TransactionsService {
    constructor(@InjectRepository(Transactions) private transactionsRepository:Repository<Transactions>,
                @InjectRepository(Account) private accountRepository:Repository<Account>,
                private accountsService:AccountsService
            ){}
    
            async createTransaction(amount:number,accountA:number,accountB:number):Promise<Transactions>{ 
                
                const accountSource = await this.accountRepository.findOne({where:{accountID:accountA}})
                const accountDestination = await this.accountRepository.findOne({where:{accountID:accountB}})
                
                if(!accountSource) throw new NotFoundException("user not found")
                    if(!accountDestination) throw new NotFoundException("user not found")
                        
                        accountSource.balance = accountSource.balance - amount
                        if(accountSource.balance < amount) throw new ForbiddenException("Insufficient funds")
                            
                            accountDestination.balance = accountDestination.balance + amount
                            
                            const transactionExecution = await this.transactionsRepository.create({
                                
                                transactionsType:TRANSACTIONS_TYPE.TRANSFER,
                                amount: amount,
                                transactionDate: new Date(),
                                sourceAccountID: accountSource?.accountID,
                                destinationAccountID:accountDestination?.accountID,
                                status:STATUS.COMPLETED,
                                timeStamp: new Date()
                            })
                            
                            return this.transactionsRepository.save(transactionExecution)
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
