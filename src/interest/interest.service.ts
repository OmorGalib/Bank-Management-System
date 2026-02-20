import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AccountsService } from '../accounts/accounts.service';
import { TransactionsService } from '../transactions/transactions.service';
import { AccountType } from '../accounts/account.entity';

@Injectable()
export class InterestService {
  private readonly logger = new Logger(InterestService.name);

  constructor(
    private accountsService: AccountsService,
    private transactionsService: TransactionsService,
  ) {}

  // Run at midnight on the first day of every month
  @Cron('0 0 1 * *')
  async calculateAndCreditMonthlyInterest() {
    this.logger.log('Starting monthly interest calculation...');

    const accounts = await this.accountsService.findAll();
    
    for (const account of accounts) {
      // Only credit interest for savings accounts
      if (account.accountType === AccountType.SAVINGS && account.balance > 0) {
        const monthlyRate = account.interestRate / 100 / 12;
        const interestAmount = Number(account.balance) * monthlyRate;
        
        if (interestAmount > 0) {
          // Credit interest to account
          await this.transactionsService.deposit(
            account.id,
            interestAmount,
            `Monthly interest credit @ ${account.interestRate}% p.a.`,
          );
          
          this.logger.log(`Credited $${interestAmount.toFixed(2)} interest to account ${account.accountNumber}`);
        }
      }
    }

    this.logger.log('Monthly interest calculation completed');
  }
}