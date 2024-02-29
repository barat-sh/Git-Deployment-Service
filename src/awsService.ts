// import fs from "fs";
// import { PutObjectCommand, ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

//id= 193b33557c4a85dffc889fd9723a9683
// //secret  - 42cc6375f7b9f0c3faaba12bbd80bc2c4949441ced3f0bcd3468ba715a1459a3
// //    Endpoint - https://3392c68a9f7f3dd514af38c714c073bb.r2.cloudflarestorage.com

// const testfilepath = "/Users/barathelangovan/Developer/testing/package.json"

// const s3Client = new S3Client({
//   region: "auto",
//   endpoint: "https://3392c68a9f7f3dd514af38c714c073bb.r2.cloudflarestorage.com",
//   credentials: {
//     accessKeyId: "6c409ffd3da2fc01f1e5aa5f2dd23eb8",
//     secretAccessKey:
//       "8a9b8d8fbfa3fbd00e5d4af3d2a48f1044ad917a9d32d6f36aa4f1993fbecdc8",
//   },
// });

import { S3 } from "aws-sdk";
import fs from "fs";

const s3 = new S3({
    accessKeyId: "6c409ffd3da2fc01f1e5aa5f2dd23eb8",
    secretAccessKey: "8a9b8d8fbfa3fbd00e5d4af3d2a48f1044ad917a9d32d6f36aa4f1993fbecdc8",
    endpoint: "https://3392c68a9f7f3dd514af38c714c073bb.r2.cloudflarestorage.com"
})

// fileName => output/12312/src/App.jsx
// filePath => /Users/harkiratsingh/vercel/dist/output/12312/src/App.jsx
export const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel",
        Key: fileName,
    }).promise();
    console.log(response);
}