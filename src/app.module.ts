import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VoucherModule } from './modules/voucher/voucher.module';

@Module({
  imports: [VoucherModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
