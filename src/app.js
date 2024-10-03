import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./routes/user-routes";
import blogRouter from "./routes/blog-routes";

const app = express();
dotenv.config();

app.use(express.json());
app.use("/v1/users", router);
app.use("/v1/blog", blogRouter);

mongoose.connect(process.env.DATABASE_URL).then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is Running on Port ${process.env.PORT}`)
    })
}).catch((error) => console.log(error));

