import {Entity,PrimaryGeneratedColumn,Column} from 'typeorm'

@Entity('user')
export class User{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
        fullName:string;

    @Column()
        username:string;

    @Column()
        number:number;

    @Column()
        email:string;

    @Column()
        password:string;
        
}
