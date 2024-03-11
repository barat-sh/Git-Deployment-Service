import { S3Client, ListBucketsCommand, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import * as dotenv from 'dotenv';
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
export const uploadFileToR2 = async(fileName: string, localFilePath: string) => {
    console.log("called");
    const fileContent = fs.readFileSync(localFilePath);
    const input = {
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileName,
        Body: fileContent,
    };
    console.log(input)
    r2Client.send(new PutObjectCommand(input), (err, res)=>{
        if (err) {
            console.log("Error uploading data:",err)
            console.log("r2 endpoint", r2Client.config.endpoint)
        }
        console.log("successl", res)        
    })
}