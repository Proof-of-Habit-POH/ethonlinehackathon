-- AlterTable
ALTER TABLE `Habit` MODIFY `endDate` DATETIME(3) NOT NULL DEFAULT (startDate + INTERVAL duration DAY);

-- CreateTable
CREATE TABLE `Sponsorship` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `habitId` INTEGER NOT NULL,
    `walletAddress` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Sponsorship_habitId_idx`(`habitId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Sponsorship` ADD CONSTRAINT `Sponsorship_habitId_fkey` FOREIGN KEY (`habitId`) REFERENCES `Habit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
