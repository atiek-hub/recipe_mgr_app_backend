import { Hono } from "hono";
import users from "./users/users";
import my_recipes from "./my_recipes/my_recipes";
import ingredients from "./my_recipes/ingredients";
import instructions from "./my_recipes/instructions";
import recipe_site from "./recipe_sites/recipe_sites";
import { cors } from "hono/cors";

const app = new Hono();
app.use(
  "/*",
  cors({
    origin: ["http://localhost:5173", "https://recipe-mgr.vercel.app"],
  })
);
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/users", users);
app.route("/my_recipes", my_recipes);
app.route("/ingredients", ingredients);
app.route("/instructions", instructions);
app.route("/recipe_sites", recipe_site);

export default app;
