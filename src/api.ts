import express, {Request,Response} from "express";
import cors from "cors";
import path from "path";
import { generate } from "./config/store";
import { cloneGitRepository } from "./gitUtils";
import { getAllFiles } from "./config/files";
import { uploadFileToR2 } from "./config/aws";
import { createClient } from "redis";

const app = express()
app.use(cors());
app.use(express.json());
const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();

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
                await publisher.lPush("build-queue", sessionID);
                console.log("Added to Redis-queue...")
            }catch(err){
                console.log("error while publishing to redis")
            }
        }, 30000);
    }catch(err){
        console.log("Error while Uploading files", err)
    }finally{
        console.log("finished uploading to R2...")
    }

    await publisher.hSet("status", sessionID, "UPLOAD")

    // pushing to queue
    
    res.json({repoURL:repoURL, sessionID: sessionID})
})

app.get("/status",async (req,res)=>{
    const id = req.query.id;
    const response = await subscriber.hGet("status", id as string);
    res.json({
        status:response
    })
})
app.listen(3001, ()=>{
    console.log("server hiiting....")
})