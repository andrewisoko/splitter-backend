import { Account } from 'src/modules/accounts/entities/account.entity';
import {Entity,PrimaryGeneratedColumn,Column, OneToMany} from 'typeorm'
import { RefreshToken } from 'src/modules/auth/refresh_token.entity';


export enum Role {
    USER = "user",
    ADMIN = "admin",
}

@Entity('user')
export class User{ 

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
    type:"enum",
    enum: Role,
    default:Role.USER,
    })
    role:Role

    @Column()
        fullName:string;

    @Column()
        userName:string;

    @Column()
        number:number;

    @Column()
        email:string;

    @Column()
        password:string;  
    
    @Column({ nullable: true })
        refreshTokenHash?: string;

    @Column({ nullable: true })
        refreshTokenExpiresAt?: Date;
        
    @OneToMany(() => Account,account => account.user)
        accounts:Account[]
}

 