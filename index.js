import express from'express'
import cors from 'cors'
const app = express()
const port = 5000
import cookieParser from "cookie-parser";
import UrlRouter from './routes/UrlRouter.js';
import userRouter from './routes/userRouter.js';
import DashboardRouter from './routes/DashboardRouter.js';

app.use(express.json());
app.set("trust proxy", true);

app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))
 
app.use(cookieParser())
/* const allowedOrigins = [
  "https://zyler.com.ng",
  "https://www.zyler.com.ng",
  "https://frontendurl-cwfx.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: false
})); */
 

app.use("/api/user",UrlRouter)
app.use("/api/Auth",userRouter)
app.use("/api/Admin",DashboardRouter)
app.listen(port, () => console.log(`App listening on port ${port}!`))