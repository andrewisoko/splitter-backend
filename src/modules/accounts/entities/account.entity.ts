import { User } from "src/modules/users/entities/user.entity";
import { Column,ManyToOne,PrimaryColumn } from "typeorm";


export class Account{


    @PrimaryColumn()
    accountID:number;

    @Column()
    accountNumber:number;

    @Column()
    userReference:number;

    @Column()
    balance:number;

    @Column()
    currency:string;

    @Column()
    status:string;

    @Column()
    createdAt:Date;

    @Column()
    updatedAt:Date;
    
    @ManyToOne(()=>User,user=>user.accounts)
    user:User
}

