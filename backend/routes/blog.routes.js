import { Router } from "express";
import { 
    handleCreateNewBlog, 
    handleGetAllBlogs, 
    handleGetMyBlogs,
    handleGetSingleBlog,
    handleUpdateSingleBlog, 
    handleDeleteSingleBlog 
} from "../controllers/blog.controllers.js";
import { handleVerifyUserLogin } from "../middlewares/auth.middleware.js";    

const router = Router();

// Public routes
router.route("/").get(handleGetAllBlogs);
router.route("/:id").get(handleGetSingleBlog);

// Protected routes
router.route("/").post(handleVerifyUserLogin, handleCreateNewBlog);
router.route("/my-blogs").get(handleVerifyUserLogin, handleGetMyBlogs);
router.route("/:id").patch(handleVerifyUserLogin, handleUpdateSingleBlog);
router.route("/:id").delete(handleVerifyUserLogin, handleDeleteSingleBlog);

export default router;