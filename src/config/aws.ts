import { S3Client, ListBucketsCommand, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";

const r2Client = new S3Client({
    region: "auto",
    endpoint: "https://3392c68a9f7f3dd514af38c714c073bb.r2.cloudflarestorage.com",
    credentials: {
      accessKeyId: "3ce8310bea81df91a276b104fd34a3c4",
      secretAccessKey: "d4aa30cfdc67b1307e365b42c5a0e5acc7b3c62fbad949d47413beb934101d09",
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
        Bucket: "deploy",
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