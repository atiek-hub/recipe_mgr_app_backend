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
    const { name, amount, myRecipeId } = await c.req.parseBody();
    const data = await prisma.ingredient.create({
      data: {
        name: String(name),
        amount: String(amount),
        myRecipeId: Number(myRecipeId),
      },
    });
    return c.json({ data: data });
  } catch (e) {
    return c.json({ error: e });
  }
});

app.get("/", async (c) => {
  try {
    const data = await prisma.ingredient.findMany();
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

app.patch("/", async (c) => {
  const { ingredients } = await c.req.json();
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
