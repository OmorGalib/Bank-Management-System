import { Injectable } from '@nestjs/common';
import { AccountsService } from '../accounts/accounts.service';
import { TransactionsService } from '../transactions/transactions.service';
import { LoansService } from '../loans/loans.service';

@Injectable()
export class ReportsService {
  constructor(
    private accountsService: AccountsService,
    private transactionsService: TransactionsService,
    private loansService: LoansService,
  ) {}

  async generateAccountStatement(accountId: string, startDate: Date, endDate: Date) {
    const account = await this.accountsService.findOne(accountId);
    const transactions = await this.transactionsService.getAccountTransactions(accountId);

    // Filter transactions by date range
    const filteredTransactions = transactions.filter(t => {
      const date = new Date(t.createdAt);
      return date >= startDate && date <= endDate;
    });

    // Calculate summary
    const totalCredits = filteredTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalDebits = filteredTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

    return {
      accountInfo: {
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        accountHolder: `${account.user.firstName} ${account.user.lastName}`,
      },
      period: {
        startDate,
        endDate,
      },
      openingBalance: account.balance - totalCredits + totalDebits,
      closingBalance: account.balance,
      summary: {
        totalCredits,
        totalDebits,
        netChange: totalCredits - totalDebits,
      },
      transactions: filteredTransactions,
    };
  }

  async generatePortfolioSummary() {
    const accounts = await this.accountsService.findAll();
    
    const totalDeposits = accounts
      .filter(a => a.accountType !== 'loan')
      .reduce((sum, a) => sum + Number(a.balance), 0);

    const totalLoans = accounts
      .filter(a => a.accountType === 'loan')
      .reduce((sum, a) => sum + Number(a.balance), 0);

    const activeAccounts = accounts.filter(a => a.status === 'active').length;

    return {
      totalAccounts: accounts.length,
      activeAccounts,
      totalDeposits,
      totalLoans,
      netPosition: totalDeposits - totalLoans,
      accountTypeBreakdown: {
        savings: accounts.filter(a => a.accountType === 'savings').length,
        checking: accounts.filter(a => a.accountType === 'checking').length,
        loan: accounts.filter(a => a.accountType === 'loan').length,
      },
    };
  }
}