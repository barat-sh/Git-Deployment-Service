import express, {Request, json, response} from "express";
import cors from "cors";
import circularJson from "circular-json";
import { Readable } from 'stream';
import * as dotenv from "dotenv";

import { S3Client, ListBucketsCommand, ListObjectsCommand, ListObjectsV2Command, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
// import { Response } from "node-fetch";
const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();


const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESSKEY || '',
    secretAccessKey: process.env.R2_SECRETKEY || '',
  },
});

const r2_params = {
    Bucket: "deploy",
    MaxKeys: 20,
};

const listObjectsCommand = new ListBucketsCommand(r2_params);

// app.get('/*', async (req: Request, res: Response) => {
//     try {
//         const hostName = req.hostname;
//         console.log(hostName);
//         const id = hostName.split('.')[0];
//         console.log(id);

//         const filePath = req.path;

//         const input = new GetObjectCommand({
//             Bucket: 'deploy',
//             Key: `dist/zidlvl/index.html`,
//         });

//         const response = await r2Client.send(input);

//         console.log("response", response)

//         const htmlContent = await streamToBuffer(response.Body);

//         const type = filePath.endsWith('html') ? 'text/html' : filePath.endsWith('css') ? 'text/css' : 'application/javascript';

//         res.set('Content-Type', type);

//         const returnValue = circularJson.stringify(response.Body)

//         if (htmlContent){
//             console.log(htmlContent.toString())
//             res.send(returnValue)
//         }

//         console.log("nullkl")
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Internal Server Error');
//     }
// });

app.get("/*", async (req, res) => {
    // id.100xdevs.com
    const host = req.hostname;
    console.log("hitting")

    const id = host.split(".")[0];
    const filePath = req.path;

    const streamToString = (stream: any) =>
      new Promise((resolve, reject) => {
        const chunks: any[] = [];
        stream.on("data", (chunk:any) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });

    const input = new GetObjectCommand({
        Bucket: 'deploy',
        Key: `dist/${id}${filePath}`,
    });

    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript";

    res.set("Content-Type", type);
    // dist/zidlvl/index.html
    r2Client.send(input,async (err, data)=>{
      if (err){
        res.send({json: "please check URL route"})
      }
      if (data && data.Body){
        const bodyContents = await streamToString(data.Body);
        res.send(bodyContents);
        // const contents = data.Body.toString();
      }
      else{
        res.send({json: "please check URL route"})
      }
    });

    // @ts-ignore
    // const response = new Response(bodyContents);

    // console.log(bodyContents);
    // res.send(bodyContents);

    // if (contents.Body instanceof Readable){
    //   const chunks: Uint8Array[] = [];
    //   contents.Body?.on('data', (chunk:any) => chunks.push(chunk));
    //   contents.Body?.on('end', () => {
    //   const htmlContent = Buffer.concat(chunks);
    //   res.send(contents?.Body);
    // })  
    // } else {
    //   throw new Error('Invalid response from S3. Body is not a Readable stream.');
    // }
    // res.send(contents.Body);

    // const parsed = circularJson.stringify(contents.Body);

    // Convert the ReadableStream to a string
})


app.listen(process.env.PORT || 3003, ()=>{
    console.log("Request-handler-Service hitting...")
})
async function streamToBuffer(stream: any) {
    return new Promise((resolve, reject) => {
      const chunks: any[] = [];
      stream.on('data', (chunk: any[]) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', (error: any) => reject(error));
    });
  }