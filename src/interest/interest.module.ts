import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from '../accounts/accounts.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { InterestService } from './interest.service';
import { InterestController } from './interest.controller';

@Module({
  imports: [AccountsModule, TransactionsModule],
  providers: [InterestService],
  controllers: [InterestController],
})
export class InterestModule {}