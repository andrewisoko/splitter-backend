import { IsOptional } from "class-validator";
import { Account } from "src/modules/accounts/entities/account.entity";
import { Column, Entity, ManyToOne,JoinColumn } from "typeorm";
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
        default:TRANSACTIONS_TYPE.TRANSFER,
    })
    transactionsType:TRANSACTIONS_TYPE;

    @Column({ 
        type: 'numeric',
        precision: 12,
        nullable: false,
        default: 0 
        })
    amount:number;

    @Column() 
    currency:string;

    @Column()
    transactionDate: Date;

    
    @Column({
        type:"enum",
        enum:STATUS,
        default:STATUS.PENDING,
    })
    status: STATUS;
    
    @Column()
    timeStamp:Date;  

    @IsOptional()
     @Column({ 
        type: 'numeric',
        precision: 12,
        nullable: true, 
        })
    amountConverted:number;

    @IsOptional()
    @Column({ nullable: true })
    secondCurrency:string
    
    @ManyToOne(()=>Account,account=>account.outgoingTransactions)
    @JoinColumn({ name: 'sourceAccountID' })
    sourceAccount:Account
    
    @IsOptional()
    @Column({ nullable: true })
    sourceAccountID: number;
    
    @ManyToOne(()=>Account,account=>account.incomingTransactions)
    @JoinColumn({ name: 'destinationAccountID' })
    destinationAccount:Account
    
    @IsOptional()
    @Column({ nullable: true })
    destinationAccountID:number;
}