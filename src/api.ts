// secret = "d4aa30cfdc67b1307e365b42c5a0e5acc7b3c62fbad949d47413beb934101d09"
// endpoint = "https://3392c68a9f7f3dd514af38c714c073bb.r2.cloudflarestorage.com"
// accesskey = "3ce8310bea81df91a276b104fd34a3c4"

import express, {Request,Response} from "express";
import cors from "cors";
import path from "path";
import { generate } from "./config/store";
import { cloneGitRepository } from "./gitUtils";
import { getAllFiles } from "./config/files";
import { uploadFileToR2 } from "./config/aws";

// uploadFileToR2( "build/output/5amj42/tsconfig.json","/Users/barat/Developer/React-Deployment-Service/build/output/5amj42/tsconfig.json")
const app = express()
app.use(express.json());

app.post("/deploy", async(req:Request,res:Response)=>{
    const repoURL = req.body.repoURL;
    console.log(repoURL);

    const sessionID = generate();
    console.log(sessionID);

    await cloneGitRepository(repoURL, sessionID);

    const files = getAllFiles(path.join(__dirname, `outputCloned/${sessionID}`))
    console.log(files)

    files.forEach(async file => {
        console.log(file.slice(__dirname.length + 1));
        await uploadFileToR2(file.slice(__dirname.length + 1), file);
    })

    res.json({repoURL:repoURL, sessionID: sessionID})
})
app.listen(3001, ()=>{
    console.log("server hiiting....")
})