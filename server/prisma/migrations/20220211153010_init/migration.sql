-- AlterTable
ALTER TABLE `user` MODIFY `email` VARCHAR(512) NOT NULL,
    MODIFY `password` VARCHAR(1024) NOT NULL;