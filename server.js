import { app } from "./app.js";
import { config } from "dotenv";
import  {connectToMySql}  from "./data/database.js";

export const connection = connectToMySql();
config({
  path: "./.env.local",
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});
