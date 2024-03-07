import express, {Request,Response} from "express";
import cors from "cors";
import path from "path";
import { generate } from "./config/store";
import { cloneGitRepository } from "./gitUtils";
import { getAllFiles } from "./config/files";
import { uploadFileToR2 } from "./config/aws";
import { createClient } from "redis";

const app = express()
app.use(express.json());
const publisher = createClient();
publisher.connect();

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
        try{
            publisher.lPush("build-queue", sessionID);
            console.log("Added to Redis-queue...")
        }catch(err){
            console.log("error while publishing to redis")
        }
    }catch(err){
        console.log("Error while Uploading files", err)
    }finally{
        console.log("finished uploading to R2...")
    }

    // pushing to queue
    
    res.json({repoURL:repoURL, sessionID: sessionID})
})
app.listen(3001, ()=>{
    console.log("server hiiting....")
})