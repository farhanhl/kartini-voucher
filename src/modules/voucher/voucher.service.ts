import {
  Injectable,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../core/services/prisma.service';
import { CreateVoucherDto } from '../../core/dtos/create-voucher.dto';
import { UpdateVoucherDto } from 'src/core/dtos/update-voucher.dto';

@Injectable()
export class VoucherService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(PrismaService.name);

  async createVoucher(dto: CreateVoucherDto): Promise<any> {
    const startDate = dto.startDate ? new Date(dto.startDate) : new Date();
    const endDate = dto.endDate ? new Date(dto.endDate) : new Date(startDate);
    if (!dto.endDate) endDate.setFullYear(startDate.getFullYear() + 1);

    try {
      const voucher = await this.prisma.$transaction(async (prisma) => {
        const uvcs = await this.generateUniqueUvcs(
          dto.amount,
          dto.numGenerations,
          prisma,
          startDate,
          endDate,
        );

        const voucher = await prisma.voucherTable.create({
          data: {
            name: dto.name,
            start_date: startDate,
            end_date: endDate,
            amount: dto.amount,
            uvcs: {
              create: uvcs,
            },
          },
        });

        return voucher;
      });

      return voucher;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(
          `Rollback: Duplicate code detected, transaction aborted. Conflicted code: ${error.message}`,
        );
      }

      throw new BadRequestException(
        'An error occurred while creating the voucher, transaction aborted.',
      );
    }
  }

  async editVoucher(voucherId: string, dto: UpdateVoucherDto): Promise<any> {
    const voucher = await this.prisma.voucherTable.findUnique({
      where: { id: voucherId },
      include: { uvcs: true },
    });

    if (!voucher) throw new BadRequestException('Voucher not found');

    if (dto.numGenerations < voucher.uvcs.length) {
      throw new BadRequestException(
        'numGenerations cannot be lower than existing UVC count',
      );
    }

    try {
      const updatedVoucher = await this.prisma.$transaction(async (prisma) => {
        const updatedVoucher = await prisma.voucherTable.update({
          where: { id: voucherId },
          data: {
            name: dto.name,
            amount: dto.amount,
            uvcs: {
              updateMany: {
                where: { id_voucher: voucherId },
                data: { amount: dto.amount },
              },
            },
          },
          include: { uvcs: true }, // Include UVCs in the returned voucher
        });

        return updatedVoucher;
      });

      return updatedVoucher;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(
          `Rollback: Duplicate code detected, transaction aborted. Conflicted code: ${error.message}`,
        );
      }

      throw new BadRequestException(
        'An error occurred while editing the voucher, transaction aborted.',
      );
    }
  }

  private async generateUniqueUvcs(
    amount: number,
    numGenerations: number,
    prisma,
    startDate?: Date,
    endDate?: Date,
  ) {
    const uvcs = [];
    const generatedCodes = new Set<string>();

    for (let i = 0; i < numGenerations; i++) {
      let code = this.generateRandomCode();
      let isConflict = await this.isCodeExist(code, prisma);

      while (isConflict || generatedCodes.has(code)) {
        code = this.generateRandomCode();
        isConflict = await this.isCodeExist(code, prisma);

        if (isConflict) {
          throw new ConflictException(code);
        }
      }

      generatedCodes.add(code);

      uvcs.push({
        start_date: startDate,
        end_date: endDate,
        amount: amount,
        code: code,
      });
    }

    return uvcs;
  }

  private generateRandomCode(): string {
    return Math.random().toString(36).substring(2, 5).toUpperCase();
  }

  private async isCodeExist(code: string, prisma): Promise<boolean> {
    const uvc = await prisma.uVCTable.findUnique({
      where: { code },
    });
    return uvc !== null;
  }
}
