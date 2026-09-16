import express from 'express'
import db from '../database/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthMiddleware } from '../Middleware/AuthMiddleware.js';
const key = '1234JRT';
const router=express.Router();



router.post('/userReg',async(req,res)=>{
   const {name,email,password,terms}=req.body['RegData']

   try {

        const [checkUser]=await db.query("SELECT * FROM users WHERE email =? LIMIT 1",[email]);
        if (checkUser.length==0) {
            const pass=await bcrypt.hash(password,10)
             const [query]= await db.query('INSERT INTO users(name,email,password,terms) VALUE(?,?,?,?)',[name,email,pass,'true']);
   
        if (query) {
             // Fetch inserted user
    const [rows] = await db.query(
      "SELECT id, name, email FROM users WHERE email = ?",
      [email]
    )

    const user = rows[0]

    // Create token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      key,
      { expiresIn: "1d" }
    )

  res.cookie("token", token, {
      httpOnly: true,
     secure: true,
      sameSite: "none",
      maxAge:1 * 24 * 60 * 60 * 1000,
    })

    return res.status(201).json({
        status:201,
      message: "Registration successful",
      color: "green",
      user,
    })

        } 
           
        }else{
            return res.json({status:400,error:{'gen':'Email Has Is Taken'}})
        }
     
   } catch (error) {
    console.log(error)
    error['gen']="SomeThing Went Wrong Please Report This Error";
     return res.status(500).json({status:500,error:error})
   }
  
})
/* =========================
   LOGIN 
========================= */
router.post("/userLogin", async (req, res) => {
  let error = {}
  const { email, password } = req.body['RegData']
  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    )

    if (rows.length === 0) {
      return  res.json({status:400,error:{'gen':"Invalid Email Or Password"} })
    }

    const user = rows[0]
    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      return res.json({status:400,error:{'gen':"Invalid Email Or Password"} })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      key,
      { expiresIn: "7d" }
    )

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.status(201).json({
        status:201,
      message: "Login Successful",
      color: "green",
      user: {
        name: user.name,
        email: user.email,
      },
    })

  } catch (err) {
    console.error(err)
     error['gen']="SomeThing Went Wrong Please Report This Error";
    return res.status(500).json({
        status:400,
      message: "Something went wrong",
      color: "red",
    })
  }
})


/* =========================
   CHECK AUTH
========================= */
router.get("/checkAuth", AuthMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id,name, email FROM users WHERE email = ?",
      [req.user.email]
    )

    return res.status(200).json({
      user: rows[0],
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      message: "Failed to fetch user",
    })
  }
})

/* =========================
   LOGOUT
========================= */
router.get("/logout", AuthMiddleware, (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  })

  return res.status(200).json({
    message: "Logged Out Successfully",
    color: "green",
  })
})


export default router