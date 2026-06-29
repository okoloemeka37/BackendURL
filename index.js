import express from'express'
import cors from 'cors'
const app = express()
const port = 5000

//app.get('/', (req, res) => res.send('Hello World!'))

import UrlRouter from './routes/UrlRouter.js'

app.use(express.json());

const allowedOrigins = [
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
}));


app.use("/api/user",UrlRouter)
app.listen(port, () => console.log(`App listening on port ${port}!`))