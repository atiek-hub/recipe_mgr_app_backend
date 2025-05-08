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
  try {
    const ingredients = await c.req.json();
    if (Array.isArray(ingredients) && ingredients.length > 0) {
      const data = await prisma.ingredient.createMany({
        data: ingredients,
        skipDuplicates: false,
      });
      return c.json({ data: data });
    }
  } catch (e) {
    return c.json({ error: e });
  }
});

app.get("/:myRecipeId", async (c) => {
  const myRecipeId = c.req.param("myRecipeId");
  try {
    const data = await prisma.ingredient.findMany({
      where: {
        myRecipeId: Number(myRecipeId),
      },
    });
    return c.json({ data: data });
  } catch (e) {
    return c.json({ error: e });
  }
});

app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const data = await prisma.ingredient.delete({
      where: {
        id: Number(id),
      },
    });
    return c.json({ data: data });
  } catch (e) {
    return c.json({ error: e });
  }
});

app.put("/", async (c) => {
  const ingredients = await c.req.json();
  try {
    const updatePromises = ingredients.map(async (ingredient: any) => {
      return await prisma.ingredient.update({
        where: { id: ingredient.id }, // 各オブジェクトのIDを指定
        data: { ...ingredient }, // 更新するデータ
      });
    });
    const updatedData = await Promise.all(updatePromises);
    return c.json({ data: updatedData });
  } catch (e) {
    return c.json({ error: e });
  }
});
export default app;
