import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('deposit')
  deposit(@Body() body: { accountId: string; amount: number; description?: string }) {
    return this.transactionsService.deposit(body.accountId, body.amount, body.description);
  }

  @Post('withdraw')
  withdraw(@Body() body: { accountId: string; amount: number; description?: string }) {
    return this.transactionsService.withdraw(body.accountId, body.amount, body.description);
  }

  @Post('transfer')
  transfer(@Body() body: { sourceAccountId: string; destinationAccountNumber: string; amount: number; description?: string }) {
    return this.transactionsService.transfer(
      body.sourceAccountId,
      body.destinationAccountNumber,
      body.amount,
      body.description,
    );
  }

  @Get('account/:accountId')
  getAccountTransactions(@Param('accountId') accountId: string) {
    return this.transactionsService.getAccountTransactions(accountId);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  findAll() {
    return this.transactionsService.findAll();
  }
}