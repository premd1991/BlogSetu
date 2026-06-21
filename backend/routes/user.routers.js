import { Router } from "express";
import { 
    handleCreateNewUser, 
    handleLoginUser, 
    handleLogoutUser, 
    handleUpdateUser, 
    handleDeleteUser,
    handleGetCurrentUser
} from "../controllers/user.controllers.js";
import { handleVerifyUserLogin } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/register").post(handleCreateNewUser);

router.route("/login").post(handleLoginUser);

router.route("/logout").get(handleVerifyUserLogin, handleLogoutUser);

router.route("/me").get(handleVerifyUserLogin, handleGetCurrentUser);

router.route("/edit").post(handleVerifyUserLogin, handleUpdateUser);

router.route("/delete").post(handleVerifyUserLogin, handleDeleteUser);

export default router;