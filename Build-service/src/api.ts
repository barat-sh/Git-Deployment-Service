import express from "express";
import { createClient, commandOptions } from "redis";
import { downloadR2Folder, copyFinalBuild } from "./aws";
import { buildProject } from "./utils";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();


const client = createClient({
    url: process.env.EXTERNAL_REDIS_KEY
  });
const initiateRedisConnection = async() => {
    client.on('error', (err) => console.log('Redis Client Error', err));
      
    await client.connect();
    console.log("redis connected...")
}

const main = async() => {
    while(true){
        const response = await client.brPop(
            commandOptions({isolated: true}),
            "build-queue",
            0
        );
        if(response){
            await downloadR2Folder(`outputCloned/${response.element}`)
            console.log("Downloading")
            await buildProject(response?.element)
            console.log("Building Project")
            await copyFinalBuild(response?.element);
            console.log("uploading build to R2->/dist")
            await client.hSet("status", response?.element, "BUILD")
        }
    }
}


app.listen(3002, async()=>{
    await initiateRedisConnection()
    console.log("server hitting..")
    main()
})