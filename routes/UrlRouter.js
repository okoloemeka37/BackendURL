import express from 'express'
import {nanoid} from 'nanoid';
import db from "../database/db.js"

const router=express.Router()



function isValidURL(str){
try {
    new URL(str);
    return true
} catch (_) {
    return false
}

}

router.post("/postClip",(req,res)=>{
    const data=req.body;
    const vsl=isValidURL(data.clip)
    if (vsl) {
        const userId=nanoid(4)
        const slug="_"+nanoid(5)
        const url=new URL(data.clip);
        const original=url.href
        const hostName=url.hostname;
        const shortURL=`http://localhost:3000/${slug}`;

      const result=  db.query(`INSERT INTO links(userId,short,original,clicks) VALUES(?,?,?,?)`,[userId,slug,original,0])
        console.log(result)
         return res.status(200).json({shortURL})
    } else {
        return res.status(500).json({clip:"The Provided URL Is Not Valid"})
    }

})

router.get("/getClip",(req,res)=>{
    const {slug} =req.query;
   
    console.log(slug)
    const sql=`SELECT * FROM links  WHERE short=?`;
    db.query(sql,[slug],(err,result)=>{
         
    const url=result[0]['original'];

    return res.status(200).json({url})
    });
   
})

export default router;