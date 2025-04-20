import { Hono } from "hono";
import users from "./user/user";
import my_recipes from "./my_recipe/my_recipe";
import ingredients from "./my_recipe/ingredient";
import instructions from "./my_recipe/instruction";
import recipe_site from "./recipe_site/recipe_site";
import { cors } from "hono/cors";

const app = new Hono();
app.use(
  "/*",
  cors({
    origin: ["http://localhost:5173"],
  })
);
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/user", users);
app.route("/my_recipe", my_recipes);
app.route("/ingredient", ingredients);
app.route("/instruction", instructions);
app.route("/recipe_site", recipe_site);

export default app;
