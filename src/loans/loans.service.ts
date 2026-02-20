import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan, LoanStatus, LoanType } from './loan.entity';
import { AccountsService } from '../accounts/accounts.service';
import { User } from '../users/user.entity';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private loansRepository: Repository<Loan>,
    private accountsService: AccountsService,
  ) {}

  async apply(user: User, applyLoanDto: any): Promise<Loan> {
    // Calculate monthly payment (simplified)
    const principal = applyLoanDto.amount;
    const monthlyRate = applyLoanDto.interestRate / 100 / 12;
    const term = applyLoanDto.termMonths;
    
    let monthlyPayment: number;
    
    if (monthlyRate === 0) {
      monthlyPayment = principal / term;
    } else {
      monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, term) / 
                      (Math.pow(1 + monthlyRate, term) - 1);
    }

    const loan = this.loansRepository.create({
      loanType: applyLoanDto.loanType,
      amount: applyLoanDto.amount,
      interestRate: applyLoanDto.interestRate,
      termMonths: applyLoanDto.termMonths,
      purpose: applyLoanDto.purpose,
      monthlyPayment: isNaN(monthlyPayment) ? principal / term : monthlyPayment,
      user: user,
    });

    const savedLoan = await this.loansRepository.save(loan);
    return savedLoan;
  }

  async findAll(userId?: string): Promise<Loan[]> {
    const where = userId ? { user: { id: userId } } : {};
    return this.loansRepository.find({
      where,
      relations: ['user', 'disbursementAccount'],
    });
  }

  async findOne(id: string): Promise<Loan> {
    const loan = await this.loansRepository.findOne({
      where: { id },
      relations: ['user', 'disbursementAccount'],
    });

    if (!loan) {
      throw new NotFoundException('Loan application not found');
    }

    return loan;
  }

  async approve(id: string, disbursementAccountId: string): Promise<Loan> {
    const loan = await this.findOne(id);
    
    if (loan.status !== LoanStatus.PENDING) {
      throw new BadRequestException('Loan is not in pending state');
    }

    const account = await this.accountsService.findOne(disbursementAccountId);
    
    loan.status = LoanStatus.APPROVED;
    loan.disbursementAccount = account;

    // Disburse loan amount to account
    await this.accountsService.updateBalance(disbursementAccountId, Number(loan.amount));

    const updatedLoan = await this.loansRepository.save(loan);
    return updatedLoan;
  }

  async reject(id: string, reason?: string): Promise<Loan> {
    const loan = await this.findOne(id);
    
    if (loan.status !== LoanStatus.PENDING) {
      throw new BadRequestException('Loan is not in pending state');
    }

    loan.status = LoanStatus.REJECTED;
    
    const updatedLoan = await this.loansRepository.save(loan);
    return updatedLoan;
  }

  async makePayment(id: string, amount: number): Promise<Loan> {
    const loan = await this.findOne(id);
    
    if (loan.status !== LoanStatus.ACTIVE && loan.status !== LoanStatus.APPROVED) {
      throw new BadRequestException('Loan is not active');
    }

    loan.amountPaid = Number(loan.amountPaid) + amount;
    
    if (loan.amountPaid >= loan.amount) {
      loan.status = LoanStatus.CLOSED;
    }

    const updatedLoan = await this.loansRepository.save(loan);
    return updatedLoan;
  }
}