import express, {Request,Response} from "express";
import cors from "cors";
import path from "path";
import { generate } from "./config/store";
import { cloneGitRepository } from "./gitUtils";
import { getAllFiles } from "./config/files";
import { uploadFileToR2 } from "./config/aws";
import * as dotenv from 'dotenv';
import { createClient } from "redis";

const app = express()
app.use(cors());
app.use(express.json());
dotenv.config();
const PORT = process.env.PORT;


const client = createClient({
    url: process.env.EXTERNAL_REDIS_KEY
  });
const initiateRedisConnection = async() => {
    client.on('error', (err) => console.log('Redis Client Error', err));
      
    await client.connect();
    console.log("redis connected...")
}

app.post("/deploy", async(req:Request,res:Response)=>{
    const repoURL = req.body.repoURL;
    console.log(repoURL);

    const sessionID = generate();
    console.log(sessionID);

    await cloneGitRepository(repoURL, sessionID);

    const files = getAllFiles(path.join(__dirname, `outputCloned/${sessionID}`))
    console.log(files)

    try{
        files.forEach(async file => {
            await uploadFileToR2(file.slice(__dirname.length + 1), file);
        })
        setTimeout(async()=>{
            try{
                await client.lPush("build-queue", sessionID);
                console.log("Added to Redis-queue...")
            }catch(err){
                console.log("error while publishing to redis")
            }
        }, 30000);
    }catch(err){
        console.log("Error while Uploading files", err)
    }finally{
        console.log("finished uploading files...")
    }

    await client.hSet("status", sessionID, "UPLOAD")

    // pushing to queue
    
    res.json({repoURL:repoURL, sessionID: sessionID})
})

app.get("/status",async (req,res)=>{
    const id = req.query.id;
    const response = await client.hGet("status", id as string);
    res.json({
        status:response
    })
})
app.listen(PORT, ()=>{
    initiateRedisConnection()
    console.log(`server hiiting at ${PORT}...`)
})