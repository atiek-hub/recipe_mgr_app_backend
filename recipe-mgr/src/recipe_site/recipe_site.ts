import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { env } from "hono/adapter";

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
    const data = await prisma.recipeSite.create({
      data: {
        recipeId: 3,
        recipeTitle: "aaa",
        recipeUrl: "aaa",
        foodImageUrl: "aaa",
        mediumImageUrl: "aaa",
        smallImageUrl: "aaa",
        nickname: "aaa",
        recipeDescription: "aaa",
        recipeMaterial: "aaa",
        recipeIndication: "aaa",
        reipeCost: "aaa",
        recipePublishday: "aaa",
        rank: "aaa",
        userId: "1",
      },
    });
    return c.json({ data: data });
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

app.get("/category", async (c) => {
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

app.get("/category_ranking/:categoryId",async(c) =>{
  const id = c.req.param("categoryId");
  const apiUrl = `${Bun.env.RAKUTEN_CATEGORYRANKING_API}&categoryId=${id}`
  console.log(apiUrl)
  if(!apiUrl){
    return c.json({ error: "Failed to fetch category data." }, 502);
  }
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return c.json({ error: "Failed to fetch category data." }, 502);
    }
    const json = await response.json();
    return c.json({ data:json });
  } catch (e) {
    return c.json(
      { error: "An unexpected error occurred.", detail: `${e}` },
      500
    );
  }
})

export default app;
