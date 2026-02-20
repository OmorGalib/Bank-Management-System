import { Controller, Get, Post, Body, Param, UseGuards, Req, Patch } from '@nestjs/common';
import { LoansService } from './loans.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('loans')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post('apply')
  apply(@Req() req, @Body() applyLoanDto: any) {
    return this.loansService.apply(req.user, applyLoanDto);
  }

  @Get()
  findAll(@Req() req) {
    const userId = req.user.role === UserRole.ADMIN ? undefined : req.user.id;
    return this.loansService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loansService.findOne(id);
  }

  @Patch(':id/approve')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  approve(@Param('id') id: string, @Body() body: { disbursementAccountId: string }) {
    return this.loansService.approve(id, body.disbursementAccountId);
  }

  @Patch(':id/reject')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  reject(@Param('id') id: string, @Body() body: { reason?: string }) {
    return this.loansService.reject(id, body.reason);
  }
}