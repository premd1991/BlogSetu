import { Router } from "express";
import { 
  handleToggleLikeBlog, 
  handleAddCommentBlog, 
  handleDeleteCommentBlog, 
  handleToggleFollowUser 
} from "../controllers/social.controllers.js";
import { handleVerifyUserLogin } from "../middlewares/auth.middleware.js";

const router = Router();

// Require login for all social actions
router.use(handleVerifyUserLogin);

router.route("/like/:id").post(handleToggleLikeBlog);
router.route("/comment/:id").post(handleAddCommentBlog);
router.route("/comment/:id/:commentId").delete(handleDeleteCommentBlog);
router.route("/follow/:userId").post(handleToggleFollowUser);

export default router;
