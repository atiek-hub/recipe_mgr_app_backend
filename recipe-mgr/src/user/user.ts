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
  const { id, name, email } = await c.req.json();
  try {
    const data = await prisma.user.create({
      data: {
        id,
        name,
        email,
      },
    });
    return c.json({ data: data });
  } catch (e) {
    return c.json({ error: e });
  }
});

app.get("/", async (c) => {
  try {
    const data = await prisma.user.findMany();
    return c.json({ data: data });
  } catch (e) {
    return c.json({ error: e });
  }
});

export default app;
