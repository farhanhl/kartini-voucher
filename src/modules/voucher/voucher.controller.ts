import { Controller, Post, Body, Param, Put, Logger } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from '../../core/dtos/create-voucher.dto';
import { UpdateVoucherDto } from '../../core/dtos/update-voucher.dto';
import { PrismaService } from 'src/core/services/prisma.service';

@Controller('generate')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}
  private readonly logger = new Logger(PrismaService.name);

  @Post('uvc')
  async generateVoucher(@Body() createVoucherDto: CreateVoucherDto) {
    return this.voucherService.createVoucher(createVoucherDto);
  }

  @Put('uvc/:voucherId')
  async editVoucher(
    @Param('voucherId') voucherId: string,
    @Body() updateVoucherDto: UpdateVoucherDto,
  ) {
    return this.voucherService.editVoucher(voucherId, updateVoucherDto);
  }
}
