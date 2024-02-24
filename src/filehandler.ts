import fs from "fs";
import path from "path";

export const createUploadPath = (folderPath: string) => {
  let response: string[] = [];

  // gives file in current folder
  const allFiles = fs.readdirSync(folderPath);

  allFiles.forEach((file) => {
    const filePath = path.join(folderPath, file);
    if (fs.statSync(filePath).isFile()) {
      response.push(filePath);
    } else {
      response = response.concat(createUploadPath(filePath));
    }
  });
  return response;
};
