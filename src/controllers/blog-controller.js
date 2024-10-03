import mongoose from "mongoose";
import Blog from "../model/Blog";
import User from "../model/User";

export const getAllBlogs = async(request, response, next) => {
    
    let blog;
    try {
        blog = await Blog.find();
    }
    catch (error) {
        return response.status(400).json({message: "Something went wrong", status: false})
    }

    if(!blog) {
        return response.status(404).json({message: "No Blog Found", status: false})
    }

    return response.status(400).json({message: "Fetched Successfully", data: blog, status: true})
}

export const getBlogById = async(request, response, next) => {
    
    const { id} =  request.params;

    let blog;
    try {
        blog = await Blog.findById(id);
    }
    catch (error) {
        return response.status(400).json({message: "Something went wrong", status: false})
    }

    if(!blog) {
        return response.status(404).json({message: "No Blog Found", status: false})
    }

    return response.status(400).json({message: "Fetched Successfully", data: blog, status: true})
}

export const addBlog = async  (request, response, next) => {

    const { title, description, image, user} = request.body;

    let existingUser;
    try {
        existingUser = await User.findById(user);
    }
    catch (err) {
        return response.status(400).json({message: "Something went wrong", status: false})
    }

    if(!existingUser) {
        return response.status(404).json({message: "User Not Found", status: false})
    }

    
    const blog = new Blog({title, description, image, user});

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save({session});
        existingUser.blogs.push(blog);
        await existingUser.save({session});
        await session.commitTransaction();
    }
    catch (err) {
        return response.status(500).json({message: err, status: false})
    }

    return response.status(200).json({message: "Successfully Added ", blog: blog, status: false})
}


export const updateBlog = async (request, response, next) => {

    const { id} =  request.params;

    const { title, description } = request.body;
    let  blog;
    try {
        blog = await Blog.findByIdAndUpdate(id, {
            title,
            description
        })
    }
    catch (err) {
        return response.status(400).json({message: "Something went wrong", status: false})
    }

    if(!blog) {
        return response.status(400).json({message: "Unable to Update The Blog", status: false}) 
    }

    return response.status(200).json({message: "Successfully Added ", blog: blog, status: false})

}

export const deleteBlog = async(request, response, next) => {
    
    const { id} =  request.params;

    let blog;
    try {
        blog = await Blog.findByIdAndDelete(id).populate('user');
        await blog.user.blogs.pull(blog);
        await blog.user.save();
    }
    catch (error) {
        return response.status(400).json({message: "Something went wrong", status: false})
    }

    if(!blog) {
        return response.status(404).json({message: "No Blog Found", status: false})
    }

    return response.status(400).json({message: "Successfully Blog Deleted", status: true})
}

export const getBlogByUserId = async(request, response, next) => {
    const {id} =  request.params;
    let userBlogs;

    try {
        userBlogs = User.findById(id).populate("blogs");
    }
    catch (err) {
        return response.status(500).json({message: err, success: false})
    }

    if(!userBlogs) {
        return response.status(500).json({message: "No Blog Found", success: false})
    }

    return response.status(200).json({message: "Blogs", blog: userBlogs, success: false})
}