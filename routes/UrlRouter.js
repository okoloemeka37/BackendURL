import express from 'express'
import {nanoid} from 'nanoid';
import db from "../database/db.js"
import maxmind from "maxmind";
import {UAParser} from "ua-parser-js";
import path from "path";

const router=express.Router()



function isValidURL(str){
try {
    new URL(str);
    return true
} catch (_) {
    return false
}

}

router.post("/postClip",async (req,res)=>{

    const data=req.body.bod;
    console.log(data)
const clip =data.clip;
    const vsl=isValidURL(clip)
    if (vsl) {
        const userId=data['userId'];
        const slug="_"+nanoid(5)
        const url=new URL(clip);
        const original=url.href
        const hostName=url.hostname;
       // const shortURL=`https://zyler.com.ng/${slug}`;
        const shortURL=`http://localhost:3000/${slug}`
        //const shortURL=`https://frontend-url-blush.vercel.app/${slug}`
      const result=await db.query(`INSERT INTO links(userId,short,original,clicks) VALUES(?,?,?,?)`,[userId,slug,original,0])
        console.log(result)
         return res.status(200).json({shortURL})
    } else {
        return res.status(500).json({clip:"The Provided URL Is Not Valid"})
    } 

})



router.post("/getClip",async(req,res)=>{
     const {slug} =req.query;

    const parser = new UAParser(req.headers["user-agent"]);

    const Agentresult = parser.getResult();

   const deviceProp= {
        device: Agentresult.device.type ?? "desktop",
        browser: Agentresult.browser.name,
        os: Agentresult.os.name
    }
    
    const location=req.body

const deviceLocation={ip:location['ip'],city:location['city'],country:location['country'],region:location['region'],continent:'AF'}

console.log(deviceLocation)

   const sql=`SELECT * FROM links  WHERE short=?`;
       try {
         const [rest]=await db.query(sql,[slug]);
         console.log(rest)
         const url=rest[0]['original'];
         const click_Count=rest[0]['clicks']+1;
        const userId=rest[0]['userId'];
        const linkId=rest[0]['id']
         // update counts
         const update=`UPDATE links SET clicks=? WHERE short=?`;
         await db.query(update,[click_Count,slug])
        
         //add details to location table
         const add_location="INSERT INTO linkpropeties(ip,city,userId,linkId,continent,state,country,device,browser,os)VALUE(?,?,?,?,?,?,?,?,?)";
         await db.query(add_location,[deviceLocation['ip'],deviceLocation['city'],userId,linkId,deviceLocation['continent'],deviceLocation['region'],deviceLocation['country'],deviceProp['device'],deviceProp['browser'],deviceProp['os']]);
             return res.status(200).json({url})
       } catch (error) {
        console.log(error)
          return res.status(402).json({error:"No Link Was Found For This Clip"})
       }   
})
 
export default router;