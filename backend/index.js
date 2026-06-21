import  express  from "express";
import  connectDB from "./connectDB.js";
import blogRouter from "./routes/blog.routes.js";
import userRouter from "./routes/user.routers.js";
import socialRouter from "./routes/social.routes.js";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";



dotenv.config({ path: path.resolve("./.env") });

const PORT = process.env.PORT;
const app = express();
connectDB();

app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
}));

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());

// Rate limiting configurations
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per 15 minutes
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { message: "Too many requests from this IP, please try again after 15 minutes." }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 auth requests per 15 minutes (login/register)
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many authentication attempts from this IP, please try again after 15 minutes." }
});

// Protect authentication routes and global API endpoints with rate limits
app.use("/api/v1/user/login", authLimiter);
app.use("/api/v1/user/register", authLimiter);
app.use("/api/v1", globalLimiter);

app.use("/api/v1/blog", blogRouter );
app.use("/api/v1/user", userRouter);
app.use("/api/v1/social", socialRouter);

app.get("/", (req, res)=>{
   return res.status(200).json({message:"Welcome from Server!"})
})

app.listen(PORT, ()=> {
console.log(`server started at http://localhost:${PORT}/`)
})