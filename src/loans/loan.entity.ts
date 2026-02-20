import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Account } from '../accounts/account.entity';

export enum LoanType {
  PERSONAL = 'personal',
  HOME = 'home',
  AUTO = 'auto',
  EDUCATION = 'education',
  BUSINESS = 'business',
}

export enum LoanStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ACTIVE = 'active',
  CLOSED = 'closed',
  DEFAULTED = 'defaulted',
}

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: LoanType,
  })
  loanType: LoanType;

  @Column({
    type: 'enum',
    enum: LoanStatus,
    default: LoanStatus.PENDING,
  })
  status: LoanStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  interestRate: number;

  @Column({ type: 'int' })
  termMonths: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monthlyPayment: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amountPaid: number;

  @Column({ nullable: true })
  purpose: string;

  @ManyToOne(() => User, (user) => user.accounts)
  user: User;

  @ManyToOne(() => Account)
  disbursementAccount: Account;

  @CreateDateColumn()
  appliedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}