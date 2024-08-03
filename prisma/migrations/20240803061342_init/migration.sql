-- CreateTable
CREATE TABLE "VoucherTable" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "VoucherTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UVCTable" (
    "id" TEXT NOT NULL,
    "id_voucher" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "UVCTable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UVCTable_code_key" ON "UVCTable"("code");

-- AddForeignKey
ALTER TABLE "UVCTable" ADD CONSTRAINT "UVCTable_id_voucher_fkey" FOREIGN KEY ("id_voucher") REFERENCES "VoucherTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
