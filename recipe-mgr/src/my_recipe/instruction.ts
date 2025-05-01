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
  const instructions = await c.req.json();
  try {
    if (Array.isArray(instructions) && instructions.length > 0) {
      const data = await prisma.instruction.createMany({
        data: instructions,
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
    const data = await prisma.instruction.findMany({
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
    const data = await prisma.instruction.delete({
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
  const { instructions } = await c.req.json();
  try {
    const updatePromises = instructions.map(async (instruction: any) => {
      return await prisma.instruction.update({
        where: { id: instruction.id }, // 各オブジェクトのIDを指定
        data: { ...instruction }, // 更新するデータ
      });
    });
    const updatedData = await Promise.all(updatePromises);
    return c.json({ data: updatedData });
  } catch (e) {
    return c.json({ error: e });
  }
});

export default app;
