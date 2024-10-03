import express from "express";
import { addBlog, deleteBlog, getAllBlogs, getBlogById, getBlogByUserId, updateBlog } from "../controllers/blog-controller";

const blogRouter = express.Router();
blogRouter.get("/", getAllBlogs);
blogRouter.post("/", addBlog);
blogRouter.put("/:id", updateBlog);
blogRouter.get("/:id", getBlogById);
blogRouter.delete("/:id", deleteBlog);
blogRouter.get("/user/:id", getBlogByUserId);

export default blogRouter;