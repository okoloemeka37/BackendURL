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
        //const shortURL=`http://localhost:3000/${slug}`
        const shortURL=`https://frontend-url-blush.vercel.app/${slug}`
      const result=await db.query(`INSERT INTO links(userId,short,original,clicks) VALUES(?,?,?,?)`,[userId,slug,original,0])
        console.log(result)
         return res.status(200).json({shortURL})
    } else {
        return res.status(500).json({clip:"The Provided URL Is Not Valid"})
    } 

})

const dbPath = path.join(process.cwd(), 'data', 'GeoLite2-City.mmdb');

const geoDb = await maxmind.open(dbPath);


router.get("/getClip",async(req,res)=>{
     const {slug} =req.query;

    const parser = new UAParser(req.headers["user-agent"]);

    const Agentresult = parser.getResult();

   const deviceProp= {
        device: Agentresult.device.type ?? "desktop",
        browser: Agentresult.browser.name,
        os: Agentresult.os.name
    }
// 1. Extract the actual client IP (Vercel sets the true user IP as the first IP in x-forwarded-for)
  const xForwardedFor = req.headers['x-forwarded-for'];
  const clientIp = xForwardedFor
    ? xForwardedFor.split(',')[0].trim()
    : req.socket.remoteAddress?.replace(/^::ffff:/, '') || '';

  // 2. Read Vercel's edge geolocation headers
  let country = req.headers['x-vercel-ip-country']
    ? decodeURIComponent(req.headers['x-vercel-ip-country'])
    : null;

  let state = req.headers['x-vercel-ip-country-region']
    ? decodeURIComponent(req.headers['x-vercel-ip-country-region'])
    : null;

  let city = req.headers['x-vercel-ip-city']
    ? decodeURIComponent(req.headers['x-vercel-ip-city'])
    : null;

  let continent = req.headers['x-vercel-ip-continent']
    ? decodeURIComponent(req.headers['x-vercel-ip-continent'])
    : null;

  // 3. Fallback: If Vercel detects 'US' incorrectly or headers are missing, query IP-API directly using the client's IP
  if (!country || country === 'US' || clientIp === '127.0.0.1' || clientIp === '::1') {
    try {
      // Pass clientIp explicitly so the API locates the user, not the Vercel D.C. server
      const targetIp = (clientIp === '127.0.0.1' || clientIp === '::1') ? '' : clientIp;
      
      const geoResponse = await fetch(`http://ip-api.com/json/${targetIp}`);
      const geoData = await geoResponse.json();

      if (geoData.status === 'success') {
        country = geoData.countryCode || geoData.country;
        state = geoData.regionName;
        city = geoData.city;
        continent = geoData.timezone ? geoData.timezone.split('/')[0] : continent;
      }
    } catch (err) {
      console.error('External Geo IP fallback failed:', err);
    }
  }

  // 4. Format location string
  let location;
  if (city) {
    location = state ? `${city}, ${state}, ${country}` : `${city}, ${country}`;
  } else if (state) {
    location = `${state}, ${country}`;
  } else if (country) {
    location = country;
  } else {
    location = "Unknown";
  }


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
         const add_location="INSERT INTO linkpropeties(city,userId,linkId,continent,state,country,device,browser,os)VALUE(?,?,?,?,?,?,?,?,?)";
         await db.query(add_location,[city,userId,linkId,continent,state,country,deviceProp['device'],deviceProp['browser'],deviceProp['os']]);
             return res.status(200).json({url})
       } catch (error) {
        console.log(error)
          return res.status(402).json({error:"No Link Was Found For This Clip"})
       }  
})

export default router;