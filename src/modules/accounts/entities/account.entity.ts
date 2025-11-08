import { User } from "src/modules/users/entities/user.entity";
import { Column,Entity,ManyToOne,PrimaryGeneratedColumn } from "typeorm";


export enum AccountStatus {

    ACTIVE = "active",
    INACTIVE = 'Inactive',
    SUSPENDED = 'Suspended',
    CLOSE  = 'Closed',
    PENDING = 'Pending',

}

@Entity('accounts')


export class Account{


    @PrimaryGeneratedColumn()
    accountID:number;

    @Column()
    accountNumber:number;

    @Column()
    userReference:number;

    @Column()
    balance:number;

    @Column()
    currency:string;

    @Column({
        type:"enum",
        enum:AccountStatus,
        default:AccountStatus.ACTIVE
    })
    status:AccountStatus;

    @Column()
    createdAt:Date;

    @Column()
    updatedAt:Date;
    
    @ManyToOne(()=>User,user=>user.accounts)
    user:User
}

