import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { User } from '../users/entities/user.entity';
import { AuthService } from '../auth/auth.service';


@Injectable()
export class AccountsService {
    constructor(@InjectRepository(Account) private accountRepository:Repository<Account>,
                @InjectRepository(User) private userRepository:Repository<User>,
                private authService:AuthService,
    ){}

    async createAccount(username:string,currency:string,balance:number):Promise<Account>{  /**create a list that contains all the currencies to check validation */
        const user = await this.userRepository.findOneBy({ userName: username });
        if(!user) throw new NotFoundException("user not found")
        if(balance < 25) throw new Error("Insufficent balance")

        const userAccount = await this.accountRepository.create({
           user:user,
           currency:currency,
           balance,
        })
        return this.accountRepository.save(userAccount)
    }

    async retrieveAccount(email:string,password:string,accountId:number){

        const validUser = await this.authService.validateUser(email,password)
        return validUser.accounts.forEach((account => this.accountRepository.findOne({where:{accountID:accountId}})))
    }

    async deposit(accountId:number,deposit:number){
        const account = await this.accountRepository.findOneBy({ accountID: accountId });

        if (!account) throw new NotFoundException('Account not found');
        if( account.balance > 12000) throw new Error('invald amount');
        
        const balanceDeposit = deposit + account.balance
        account.balance = balanceDeposit
        
        return this.accountRepository.save(account)

        }

    async withdraw(accountId:number,withdraw:number){
        const account = await this.accountRepository.findOneBy({ accountID: accountId });

        if (!account) throw new NotFoundException('Account not found');
        if(account.balance < 0) throw new Error('invald amount');

        const balanceDeposit = withdraw - account.balance
        account.balance = balanceDeposit
        
        return this.accountRepository.save(account)

        }
    
    }


