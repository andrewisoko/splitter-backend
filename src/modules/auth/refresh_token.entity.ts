import {Entity,PrimaryGeneratedColumn,Column} from 'typeorm'

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  tokenHash: string;
  
  @Column()
  userId: string;
  
  @Column()
  expiresAt: Date;
}