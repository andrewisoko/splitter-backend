import {  ForbiddenException, Injectable, NotFoundException,UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account, AccountStatus } from './entities/account.entity';
import { User } from '../users/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { Logger } from '@nestjs/common';


@Injectable()
export class AccountsService {
    constructor(@InjectRepository(Account) private accountRepository:Repository<Account>,
                @InjectRepository(User) private userRepository:Repository<User>,
                private authService:AuthService,
    ){}

    async accountNumberGenerator():Promise<number>{ 

        let accountNumber:number = 10123456;
        let accountDB = await this.accountRepository.find({select:['accountNumber']})

        const accountNumbers: number[] = accountDB.map(acc => acc.accountNumber);

        if (accountNumbers.includes(accountNumber)){};
        accountNumbers.push(accountNumber)

        
        if (accountNumbers[accountNumbers.length -1] >= 99999999){
            accountNumbers.pop();
            Logger.log("exceeded account numbers.")  
            } 

        accountNumber = accountNumbers[accountNumbers.length -1] + 1
        accountNumbers.push(accountNumber)
         
        return accountNumber
        
    }

    async createAccount(currency:string,balance:number,username:string):Promise<Account>{ 
        const user = await this.userRepository.findOneBy({ userName: username });
        if(!user) throw new NotFoundException("user not found")
        if(balance < 25) throw new Error("Insufficent balance")

        const accNumber = await this.accountNumberGenerator()

        const userAccount = await this.accountRepository.create({

            accountNumber:accNumber,
            currency:currency,
            balance,
            user:user,
            userReference:user.id,
            status:AccountStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date()

        })
        return this.accountRepository.save(userAccount)
    }

    async findAllAccounts(password:string,email: string): Promise<Account[]> {

        const validUser = await this.authService.validateUser(email, password);
        if (!validUser) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const userWithAccounts = await this.userRepository.findOne({
            where: { id: validUser.id },
            relations: ['accounts'],
        });

        if (!userWithAccounts || !userWithAccounts.accounts) {
            return [];
        }
        return userWithAccounts.accounts;
        }


    async retrieveAccount(password: string, accountId: number, email:string ):Promise<Account> {


        const validUser = await this.authService.validateUser(email, password);
        if (!validUser) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const account = await this.accountRepository.findOne({ where:{accountID: accountId}});
        if (!account) throw new NotFoundException('Account not found');

        return account
        }

        async deleteAccount(accountId:number, password:string, username:string){

            const account = await this.accountRepository.findOne
            ({where:{accountID:accountId},
              relations:["user"]})
            if (!account) throw new NotFoundException("account not found");

            
            if (account.user.userName !== username) throw new UnauthorizedException("You do not own this account");
            if(account.balance > 0) throw new UnauthorizedException("Balance must be zero for account to be deleted.");
            if (account.status === "Pending") throw new UnauthorizedException("Account still pending.");
            
            const pendingTransaction = await this.accountRepository.createQueryBuilder("acc")
                                        .leftJoin('acc.outgoingTransactions', 'txOut')
                                        .leftJoin('acc.incomingTransactions', 'txIn')
                                        .select([
                                            "acc.accountID",
                                            "txOut.status",
                                            "txIn.status"
                                        ])
                                        .where("acc.accountID = :accountId",{accountId})
                                        .andWhere('(txOut.status = :status OR txIn.status = :status)', { status: 'pending' })
                                        .getOne()
            

            if(pendingTransaction) throw new UnauthorizedException("transaction still pending.");
            return this.accountRepository.delete(account)
          
            
            

        }

    
    }


