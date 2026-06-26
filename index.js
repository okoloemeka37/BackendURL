import express from'express'
import cors from 'cors'
const app = express()
const port = 5000

//app.get('/', (req, res) => res.send('Hello World!'))

import UrlRouter from './routes/UrlRouter.js'

app.use(express.json());
app.use(cors({
    origin:"http://localhost:3000",
    credentials:false
}))


app.use("/api/user",UrlRouter)
app.listen(port, () => console.log(`App listening on port ${port}!`))