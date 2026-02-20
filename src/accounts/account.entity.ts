import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Transaction } from '../transactions/transaction.entity';

export enum AccountType {
  SAVINGS = 'savings',
  CHECKING = 'checking',
  LOAN = 'loan',
}

export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  FROZEN = 'frozen',
  CLOSED = 'closed',
}

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  accountNumber: string;

  @Column({
    type: 'enum',
    enum: AccountType,
  })
  accountType: AccountType;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.ACTIVE,
  })
  status: AccountStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  availableBalance: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  interestRate: number;

  @Column({ nullable: true })
  currency: string;

  @ManyToOne(() => User, (user) => user.accounts)
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}