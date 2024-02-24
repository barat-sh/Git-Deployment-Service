import { S3 } from "aws-sdk";
import fs from "fs";
import path from "path";

const s3 = new S3({
  accessKeyId: "193b33557c4a85dffc889fd9723a9683",
  secretAccessKey:
    "42cc6375f7b9f0c3faaba12bbd80bc2c4949441ced3f0bcd3468ba715a1459a3",
  endpoint: "https://3392c68a9f7f3dd514af38c714c073bb.r2.cloudflarestorage.com",
});
export const uploadToS3 = async (fileName: string, localFilepath: string) => {
  const fileContent = fs.readFileSync(localFilepath);
  const response = await s3
    .upload({
      Bucket: "oneClickDeployment",
      Key: fileName,
      Body: fileContent,
    })
    .promise();
  console.log("hitting R2 upload");
  console.log(response);
};
