/*
  Warnings:

  - You are about to drop the column `reipeCost` on the `RecipeSite` table. All the data in the column will be lost.
  - Added the required column `recipeCost` to the `RecipeSite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecipeSite" DROP COLUMN "reipeCost",
ADD COLUMN     "recipeCost" TEXT NOT NULL;
