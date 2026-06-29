import dotenv from "dotenv";
dotenv.config({
  path: "./.env.local",
});

import app from "./app.js";
import connectDB from "./db/index.js";

console.log(process.env.MONGO_URL);
connectDB()
  .then(() => {
    const PORT = parseInt(process.env.PORT || "3005", 10);
    const HOST = "0.0.0.0";
    app.listen(PORT, HOST, () => {
      console.log(
        `Server is running on port ${process.env.PORT} \n-----------------------------------\n`,
      );
    });
  })
  .catch((error) => {
    console.log(error);
  });
