-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `walletAddress` VARCHAR(191) NOT NULL,
    `username` VARCHAR(10) NOT NULL,

    UNIQUE INDEX `User_walletAddress_key`(`walletAddress`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Habit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `details` VARCHAR(256) NULL,
    `startDate` DATETIME(3) NOT NULL,
    `duration` INTEGER NOT NULL,
    `endDate` DATETIME(3) NOT NULL DEFAULT (startDate + INTERVAL duration DAY),
    `provingMethod` ENUM('UPLOAD_IMAGE', 'SELF_CONFIRM') NOT NULL,
    `status` ENUM('NOT_STARTED', 'IN_PROGRESS', 'ENDED') NOT NULL DEFAULT 'IN_PROGRESS',
    `amountPunishment` DECIMAL(10, 2) NOT NULL,
    `sponsorAmount` DECIMAL(10, 2) NULL,
    `moneyTransferStatus` ENUM('PENDING', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    `totalMoney` DECIMAL(10, 2) NOT NULL,
    `transferBackStatus` ENUM('NOT_TRANSFERRED', 'TRANSFERRED_BACK') NOT NULL DEFAULT 'NOT_TRANSFERRED',
    `currentStreak` INTEGER NOT NULL DEFAULT 0,
    `maxStreak` INTEGER NOT NULL DEFAULT 0,
    `userId` VARCHAR(191) NOT NULL,

    INDEX `Habit_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HabitTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isCompleted` BOOLEAN NOT NULL DEFAULT false,
    `imageURL` VARCHAR(191) NULL,
    `habitId` INTEGER NOT NULL,

    INDEX `HabitTransaction_habitId_idx`(`habitId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Habit` ADD CONSTRAINT `Habit_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HabitTransaction` ADD CONSTRAINT `HabitTransaction_habitId_fkey` FOREIGN KEY (`habitId`) REFERENCES `Habit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
