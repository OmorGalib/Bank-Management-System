import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account, AccountType, AccountStatus } from './account.entity';
import { User } from '../users/user.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {}

  async create(user: User, createAccountDto: any): Promise<Account> {
    // Generate account number
    const accountNumber = this.generateAccountNumber();

    // Set interest rate based on account type
    let interestRate = 0;
    switch (createAccountDto.accountType) {
      case AccountType.SAVINGS:
        interestRate = 4.5;
        break;
      case AccountType.CHECKING:
        interestRate = 1.0;
        break;
      case AccountType.LOAN:
        interestRate = 8.5;
        break;
    }

    const account = this.accountsRepository.create({
      accountNumber,
      accountType: createAccountDto.accountType,
      currency: createAccountDto.currency || 'USD',
      interestRate,
      user,
      balance: createAccountDto.initialDeposit || 0,
      availableBalance: createAccountDto.initialDeposit || 0,
    });

    return this.accountsRepository.save(account);
  }

  async findAll(userId?: string): Promise<Account[]> {
    const where = userId ? { user: { id: userId } } : {};
    return this.accountsRepository.find({
      where,
      relations: ['user'],
    });
  }

  async findOne(id: string): Promise<Account> {
    const account = await this.accountsRepository.findOne({
      where: { id },
      relations: ['user', 'transactions'],
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async findByAccountNumber(accountNumber: string): Promise<Account> {
    const account = await this.accountsRepository.findOne({
      where: { accountNumber },
      relations: ['user'],
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async updateBalance(accountId: string, amount: number): Promise<Account> {
    const account = await this.findOne(accountId);
    
    const newBalance = Number(account.balance) + amount;
    if (newBalance < 0) {
      throw new BadRequestException('Insufficient funds');
    }

    account.balance = newBalance;
    account.availableBalance = newBalance;

    return this.accountsRepository.save(account);
  }

  async updateStatus(id: string, status: AccountStatus): Promise<Account> {
    const account = await this.findOne(id);
    account.status = status;
    return this.accountsRepository.save(account);
  }

  private generateAccountNumber(): string {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${timestamp}${random}`;
  }
}