import { IsOptional } from "class-validator";
import { Account } from "src/modules/accounts/entities/account.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";


export enum TRANSACTIONS_TYPE {
    DEPOSIT = "deposit",
    WITHDRAW = "withdraw",
    TRANSFER = "transfer"
}


export enum STATUS {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed"
}


@Entity("transactions")
export class Transactions{

    @PrimaryGeneratedColumn()
    transactionsID:number;


    @Column({
        type: "enum",
        enum: TRANSACTIONS_TYPE,
        default:TRANSACTIONS_TYPE.TRANSFER
    })
    transactionsType:TRANSACTIONS_TYPE;

    @Column()
    amount:number;

    @Column()
    transactionDate: Date;

    @IsOptional()
    @Column()
    sourceAccountID: number;

    @IsOptional()
    @Column()
    destinationAccountID:number;

    @Column({
        type:"enum",
        enum:STATUS,
        default:STATUS.PENDING
    })
    status: STATUS;

    @Column()
    timeStamp:Date;  

    @ManyToOne(()=>Account,account=>account.transactions)
    account:Account

}