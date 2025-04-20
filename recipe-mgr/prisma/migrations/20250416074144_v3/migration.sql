/*
  Warnings:

  - The primary key for the `Ingredient` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Ingredient` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Instruction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Instruction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `MyRecipe` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `MyRecipe` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `RecipeSite` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `RecipeSite` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `myRecipeId` on the `Ingredient` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `myRecipeId` on the `Instruction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_myRecipeId_fkey";

-- DropForeignKey
ALTER TABLE "Instruction" DROP CONSTRAINT "Instruction_myRecipeId_fkey";

-- AlterTable
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "myRecipeId",
ADD COLUMN     "myRecipeId" INTEGER NOT NULL,
ADD CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Instruction" DROP CONSTRAINT "Instruction_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "myRecipeId",
ADD COLUMN     "myRecipeId" INTEGER NOT NULL,
ADD CONSTRAINT "Instruction_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "MyRecipe" DROP CONSTRAINT "MyRecipe_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "MyRecipe_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "RecipeSite" DROP CONSTRAINT "RecipeSite_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "RecipeSite_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_myRecipeId_fkey" FOREIGN KEY ("myRecipeId") REFERENCES "MyRecipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instruction" ADD CONSTRAINT "Instruction_myRecipeId_fkey" FOREIGN KEY ("myRecipeId") REFERENCES "MyRecipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
