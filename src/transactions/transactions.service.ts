import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType, TransactionStatus } from './transaction.entity';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private accountsService: AccountsService,
  ) {}

  async deposit(accountId: string, amount: number, description?: string): Promise<Transaction> {
    const account = await this.accountsService.findOne(accountId);
    
    // Create transaction
    const transaction = this.transactionsRepository.create({
      type: TransactionType.DEPOSIT,
      amount,
      description: description || 'Cash deposit',
      account,
    });

    // Update account balance
    await this.accountsService.updateBalance(accountId, amount);

    return this.transactionsRepository.save(transaction);
  }

  async withdraw(accountId: string, amount: number, description?: string): Promise<Transaction> {
    const account = await this.accountsService.findOne(accountId);
    
    // Check sufficient funds
    if (account.availableBalance < amount) {
      throw new BadRequestException('Insufficient funds');
    }

    // Create transaction
    const transaction = this.transactionsRepository.create({
      type: TransactionType.WITHDRAWAL,
      amount,
      description: description || 'Cash withdrawal',
      account,
    });

    // Update account balance
    await this.accountsService.updateBalance(accountId, -amount);

    return this.transactionsRepository.save(transaction);
  }

  async transfer(
    sourceAccountId: string,
    destinationAccountNumber: string,
    amount: number,
    description?: string,
  ): Promise<Transaction> {
    const sourceAccount = await this.accountsService.findOne(sourceAccountId);
    
    // Check sufficient funds
    if (sourceAccount.availableBalance < amount) {
      throw new BadRequestException('Insufficient funds');
    }

    // Find destination account
    const destinationAccount = await this.accountsService.findByAccountNumber(destinationAccountNumber);

    // Calculate fee (0.5% for transfers)
    const fee = amount * 0.005;
    const totalDeduction = amount + fee;

    // Create transaction
    const transaction = this.transactionsRepository.create({
      type: TransactionType.TRANSFER,
      amount,
      fee,
      description: description || `Transfer to account ${destinationAccountNumber}`,
      destinationAccountNumber,
      account: sourceAccount,
    });

    // Update balances
    await this.accountsService.updateBalance(sourceAccountId, -totalDeduction);
    await this.accountsService.updateBalance(destinationAccount.id, amount);

    return this.transactionsRepository.save(transaction);
  }

  async getAccountTransactions(accountId: string): Promise<Transaction[]> {
    return this.transactionsRepository.find({
      where: { account: { id: accountId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionsRepository.find({
      relations: ['account'],
      order: { createdAt: 'DESC' },
    });
  }
}