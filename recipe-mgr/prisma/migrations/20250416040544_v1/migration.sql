/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateTable
CREATE TABLE "MyRecipe" (
    "id" TEXT NOT NULL,
    "recipeName" TEXT NOT NULL,
    "recipeImg" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MyRecipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "myRecipeId" TEXT NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instruction" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "myRecipeId" TEXT NOT NULL,

    CONSTRAINT "Instruction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeSite" (
    "id" TEXT NOT NULL,
    "recipeId" INTEGER NOT NULL,
    "recipeTitle" TEXT NOT NULL,
    "recipeUrl" TEXT NOT NULL,
    "foodImageUrl" TEXT NOT NULL,
    "mediumImageUrl" TEXT NOT NULL,
    "smallImageUrl" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "recipeDescription" TEXT NOT NULL,
    "recipeMaterial" TEXT NOT NULL,
    "recipeIndication" TEXT NOT NULL,
    "reipeCost" TEXT NOT NULL,
    "recipePublishday" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "RecipeSite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MyRecipe" ADD CONSTRAINT "MyRecipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_myRecipeId_fkey" FOREIGN KEY ("myRecipeId") REFERENCES "MyRecipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instruction" ADD CONSTRAINT "Instruction_myRecipeId_fkey" FOREIGN KEY ("myRecipeId") REFERENCES "MyRecipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeSite" ADD CONSTRAINT "RecipeSite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
