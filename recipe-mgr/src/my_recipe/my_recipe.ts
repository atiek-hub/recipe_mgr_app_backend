import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();
const prisma = new PrismaClient();

app.post("/", async (c) => {
  const { recipeName, recipeImg, userId } = await c.req.json();
  try {
    const recipe = await prisma.myRecipe.create({
      data: {
        recipeName: recipeName,
        recipeImg: recipeImg,
        userId: userId,
      },
    });
    return c.json({ data: recipe });
  } catch (e) {
    return c.json({ error: "Server error occurred.", detail: e }, 500);
  }
});

app.get("/:userId", async (c) => {
  const id = c.req.param("userId");
  try {
    const data = await prisma.myRecipe.findMany({
      where: {
        userId: id,
      },
    });
    return c.json({ data: data });
  } catch (e) {
    return c.json({ error: e });
  }
});

app.get("/unique/:recipeId", async (c) => {
  const id = c.req.param("recipeId");
  try {
    const data = await prisma.myRecipe.findUnique({
      where: {
        id: Number(id),
      },
    });
    return c.json({ data: data });
  } catch (e) {
    return c.json({ error: e });
  }
});

app.patch("/:myRecipeId", async (c) => {
  const id = c.req.param("myRecipeId");
  const { recipeName, recipeImg, ingredients, instructions } =
    await c.req.json();
  try {
    const updatedMyRecipe = await prisma.myRecipe.update({
      where: {
        id: Number(id),
      },
      data: {
        recipeName: recipeName,
        recipeImg: recipeImg,
      },
    });

    const updateIngredientsPromis = ingredients.map(async (ingredient: any) => {
      return await prisma.ingredient.update({
        where: { id: ingredient.id }, // 各オブジェクトのIDを指定
        data: { ...ingredient }, // 更新するデータ
      });
    });
    const updatedIngredients = await Promise.all(updateIngredientsPromis);

    const updateInstructionsPromis = instructions.map(
      async (instruction: any) => {
        return await prisma.instruction.update({
          where: { id: instruction.id }, // 各オブジェクトのIDを指定
          data: { ...instruction }, // 更新するデータ
        });
      }
    );
    const updatedInstructions = await Promise.all(updateInstructionsPromis);

    return c.json({
      myRecipe: updatedMyRecipe,
      ingredients: updatedIngredients,
      instructions: updatedInstructions,
    });
  } catch (e) {
    return c.json({ error: e });
  }
});

app.delete("/:myRecipeId", async (c) => {
  const id = c.req.param("myRecipeId");
  try {
    await prisma.ingredient.deleteMany({
      where: {
        myRecipeId: Number(id),
      },
    });
    await prisma.instruction.deleteMany({
      where: {
        myRecipeId: Number(id),
      },
    });
    const data = await prisma.myRecipe.delete({
      where: {
        id: Number(id),
      },
    });
    return c.json({ data: data });
  } catch (e) {
    return c.json({ error: e });
  }
});
export default app;
