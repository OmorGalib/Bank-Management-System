import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { Loan } from './loan.entity';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Loan]), AccountsModule],
  providers: [LoansService],
  controllers: [LoansController],
  exports: [LoansService],
})
export class LoansModule {}