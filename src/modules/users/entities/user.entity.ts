import {Entity,PrimaryGeneratedColumn,Column} from 'typeorm'


export enum Role {
    USER = "user",
    ADMIN = "admin",
}


@Entity('user')
export class User{

    @PrimaryGeneratedColumn()
    id: number;

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
        
}
