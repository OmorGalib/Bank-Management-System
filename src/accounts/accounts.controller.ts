import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('accounts')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Req() req, @Body() createAccountDto: any) {
    return this.accountsService.create(req.user, createAccountDto);
  }

  @Get()
  findAll(@Req() req) {
    // Admin sees all accounts, customers see only theirs
    const userId = req.user.role === UserRole.ADMIN ? undefined : req.user.id;
    return this.accountsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountsService.findOne(id);
  }

  @Get(':id/balance')
  async getBalance(@Param('id') id: string) {
    const account = await this.accountsService.findOne(id);
    return { balance: account.balance, availableBalance: account.availableBalance };
  }
}