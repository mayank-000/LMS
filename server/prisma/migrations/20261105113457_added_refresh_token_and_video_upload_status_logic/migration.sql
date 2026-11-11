-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "refreshToken" TEXT;

-- AlterTable
ALTER TABLE "Tutor" ADD COLUMN     "refreshToken" TEXT;

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'successfull';
