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
app.get("/registered_recipes/:userId", async (c) => {
  const id = c.req.param("userId");
  try {
    const res = await prisma.recipeSite.findMany({
      where: {
        userId: id,
      },
    });
    return c.json({ data: res });
  } catch (e) {
    return c.json({ error: e });
  }
});
app.delete("/registered_recipes/:recipeId", async (c) => {
  const id = c.req.param("recipeId");
  try {
    const res = await prisma.recipeSite.delete({
      where: {
        id: Number(id),
      },
    });
    return c.json({ data: res });
  } catch (e) {
    return c.json({ error: e });
  }
});
app.post("/", async (c) => {
  let param;
  try {
    param = await c.req.json();
  } catch (e) {
    return c.json({ error: "Invalid JSON body" }, 400); // 明示的に返す
  }
  try {
    const res = await prisma.recipeSite.findMany({
      where: {
        userId: param.userId,
      },
    });

    const check = res.find((r) => r.recipeId === param.recipeId);
    if (check) {
      return c.text("既に登録済みです");
    } else {
      try {
        const data = await prisma.recipeSite.create({
          data: {
            recipeId: Number(param.recipeId),
            recipeTitle: String(param.recipeTitle),
            recipeUrl: String(param.recipeUrl),
            foodImageUrl: String(param.foodImageUrl),
            mediumImageUrl: String(param.mediumImageUrl),
            smallImageUrl: String(param.smallImageUrl),
            nickname: String(param.nickname),
            recipeDescription: String(param.recipeDescription),
            recipeMaterial: String(param.recipeMaterial),
            recipeIndication: String(param.recipeIndication),
            recipeCost: String(param.recipeCost),
            recipePublishday: String(param.recipePublishday),
            rank: String(param.rank),
            userId: String(param.userId),
          },
        });
        return c.json({ data: data });
      } catch (e) {
        return c.json({ error: e });
      }
    }
  } catch (e) {
    return c.json({ error: e });
  }
});

app.get("/", async (c) => {
  try {
    const data = await prisma.recipeSite.findMany();
    return c.json({ data: data });
  } catch (e) {
    return c.json({ error: e });
  }
});

app.get("/categories", async (c) => {
  const apiUrl = Bun.env.RAKUTEN_API;
  if (!apiUrl) {
    return c.json({ error: "Failed to fetch category data." }, 502);
  }
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return c.json({ error: "Failed to fetch category data." }, 502);
    }
    const json = await response.json();
    const { large, medium, small } = json.result;
    const formatSmall = small.map((category: any) => {
      const parentMedium = medium.find(
        (item: any) => Number(category.parentCategoryId) === item.categoryId
      );
      return {
        ...category,
        categoryId2: parentMedium
          ? `${parentMedium.parentCategoryId}-${parentMedium.categoryId}-${category.categoryId}`
          : "",
      };
    });
    return c.json({ large: large, medium: medium, small: formatSmall });
  } catch (e) {
    return c.json(
      { error: "An unexpected error occurred.", detail: `${e}` },
      500
    );
  }
});

app.get("/category_rankings/:categoryId", async (c) => {
  const id = c.req.param("categoryId");
  const apiUrl = `${Bun.env.RAKUTEN_CATEGORYRANKING_API}&categoryId=${id}`;
  if (!apiUrl) {
    return c.json({ error: "Failed to fetch category data." }, 502);
  }
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return c.json({ error: "Failed to fetch category data." }, 502);
    }
    const json = await response.json();
    return c.json({ data: json });
  } catch (e) {
    return c.json(
      { error: "An unexpected error occurred.", detail: `${e}` },
      500
    );
  }
});

export default app;
