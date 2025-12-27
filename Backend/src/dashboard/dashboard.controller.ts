import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get('summary')
  getSummary() {
    return this.service.getSummary();
  }

  @Get('recent-books')
  getRecentBooks() {
    return this.service.getRecentBooks();
  }

  @Get('quick-stats')
  getQuickStats() {
    return this.service.getQuickStats();
  }
}
