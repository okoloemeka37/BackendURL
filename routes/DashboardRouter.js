import express from 'express';
import { AuthMiddleware } from '../Middleware/AuthMiddleware.js';
const router= express.Router();
import db from '../database/db.js';


router.get("/Dashboard",AuthMiddleware,async(req,res)=>{
    const userId= req.userData.id;
    //get links beloging to user
 try {
       const [query]=await db.query("SELECT * FROM links WHERE userId = ? LIMIT 10",[userId]);

       const totalClicks=query.map((e)=>{return e['clicks']}).reduce((a,c)=>{return a+c},0)
        
            return res.status(200).json({status:200,data:{links:query,totalClicks:totalClicks}})
 } catch (error) {
    console.log(error)
    return res.status(500).json({message:"SOMETHING WENT WRONG WHEN FETCHING DATA"})
 }
})

router.post("/linkDetails",AuthMiddleware,async(req,res)=>{
    const {id}= req.body;
    const userId=req.userData;
    console.log(id)
    //get links beloging to user
  try {
       const [query]=await db.query("SELECT * FROM links WHERE id= ? LIMIT 1",[id]);
      const [device]=await db.query("SELECT device,os,COUNT(os) AS OsCount FROM linkpropeties WHERE linkId= ? GROUP BY os",[id]);
 const [location]=await db.query("SELECT country,state,city,COUNT(city) AS CityCount FROM linkpropeties WHERE linkId= ? GROUP BY city",[id]);

       //const totalClicks=query.map((e)=>{return e['clicks']}).reduce((a,c)=>{return a+c},0)
        
            return res.status(200).json({status:200,data:{link:query,device,location}})
 } catch (error) {
    console.log(error)
    return res.status(500).json({message:"SOMETHING WENT WRONG WHEN FETCHING DATA"})
 } 
})


//EditLinkDestination

router.post("/EditLinkDestination",AuthMiddleware,async(req,res)=>{
   const {linkId,original}=req.body['body'];
   
   try {
      const query="UPDATE links SET original=? WHERE id=?"
               await db.query(query,[original,linkId])
                return res.status(200).json({status:201,data:'Updated Successfully'});
   } catch (error) {
         console.log(error)
    return res.status(500).json({message:"SOMETHING WENT WRONG WHEN FETCHING DATA"})
   }

})


//VIEW ALL LINKS

router.get("/Link",AuthMiddleware,async(req,res)=>{
    const userId= req.userData.id;
    //get links beloging to user
 try {
       const [query]=await db.query("SELECT * FROM links WHERE userId = ?",[userId]);

            return res.status(200).json({status:200,data:{links:query}})
 } catch (error) {
    console.log(error)
    return res.status(500).json({message:"SOMETHING WENT WRONG WHEN FETCHING DATA"})
 }
})
export default router;