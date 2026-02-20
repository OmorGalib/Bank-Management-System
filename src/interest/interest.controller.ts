import { Controller, Post, UseGuards } from '@nestjs/common';
import { InterestService } from './interest.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('interest')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class InterestController {
  constructor(private readonly interestService: InterestService) {}

  @Post('calculate-monthly')
  @Roles(UserRole.ADMIN)
  async triggerMonthlyInterest() {
    await this.interestService.calculateAndCreditMonthlyInterest();
    return { message: 'Monthly interest calculation triggered successfully' };
  }
}