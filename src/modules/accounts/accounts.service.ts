import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { User } from '../users/entities/user.entity';


@Injectable()
export class AccountsService {
    constructor(@InjectRepository(Account) private accountRepository:Repository<Account>,
    ){}

    async createAccount(user:User,currency:string,balance:number):Promise<Account>{  /**create a list that contains all the currencies to check validation */

        if(!user || balance < 10) throw new NotFoundException("Invalid data")

        const userAccount = await this.accountRepository.create({
           user:user,
           currency:currency,
           balance:balance
        })
        return this.accountRepository.save(userAccount)
    }

}
