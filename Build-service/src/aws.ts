import { S3Client, ListBucketsCommand, ListObjectsV2Command, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { createWriteStream, mkdirSync, existsSync } from "fs";
import { dirname, join } from "path";
import { Readable } from 'stream';
import { exec, spawn } from "child_process";
import path from "path";
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

export const downloadR2Folder = async (locationId: string) => {
    console.log(locationId);
    const input = {
        Bucket: "deploy",
        Prefix: locationId
    };
    const queryCommand = new ListObjectsV2Command(input);
    const allFiles = await r2Client.send(queryCommand)

    const allPromises: Promise<string>[] = (allFiles.Contents || []).map(({ Key }) => {
        return new Promise<string>((resolve) => {
            if (!Key) {
                resolve("");
                return;
            }
    
            const finalOutputPath = join(__dirname, Key);
            const outputFile = createWriteStream(finalOutputPath);
            const dirName = dirname(finalOutputPath);
    
            if (!existsSync(dirName)) {
                mkdirSync(dirName, { recursive: true });
            }
    
            const getObjectParams = {
                Bucket: "deploy",
                Key
            };
    
            r2Client.send(new GetObjectCommand(getObjectParams))
                .then(data => {
                    if (data.Body instanceof Readable) {
                        // making it a readable stream
                        data.Body.pipe(outputFile);
    
                        data.Body.on("end", () => {
                            // resolving promise
                            resolve("");
                        });
                    } else {
                        console.error(`Error: Response body is not a Readable stream for object ${Key}`);
                        resolve("");
                    }
                })
                .catch((error: { message: any; }) => {
                    console.error(`Error downloading object ${Key}: ${error.message}`);
                    resolve("");
                });
        });
    });
    
    console.log("awaiting");

    await Promise.all(allPromises?.filter(x => x !== undefined));
}

export const copyFinalBuild = (id: string) => {
    const folderPath = path.join(__dirname, `outputCloned/${id}/dist`);
    const allFiles = getAllFiles(folderPath);
    allFiles.forEach(file => {
        uploadFileToR2(`dist/${id}/` + file.slice(folderPath.length + 1), file)
    })
}

export const getAllFiles = (folderPath: string) => {
    let response: string[] = [];

    const allFilesAndFolders = fs.readdirSync(folderPath);allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        if (fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath))
        } else {
            response.push(fullFilePath);
        }
    });
    return response;
}

export const uploadFileToR2 = async(fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const input = {
        Bucket: "deploy",
        Key: fileName,
        Body: fileContent,
    };
    r2Client.send(new PutObjectCommand(input), (err, res)=>{
        if (err) {
            console.log("Error uploading data:",err)
            console.log("r2 endpoint", r2Client.config.endpoint)
        }
        console.log("successl", res)        
    })
}