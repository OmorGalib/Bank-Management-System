import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('reports')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('account-statement')
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER)
  async getAccountStatement(
    @Query('accountId') accountId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.generateAccountStatement(
      accountId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('portfolio-summary')
  @Roles(UserRole.ADMIN)
  async getPortfolioSummary() {
    return this.reportsService.generatePortfolioSummary();
  }
}