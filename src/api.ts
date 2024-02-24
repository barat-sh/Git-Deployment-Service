//id= 193b33557c4a85dffc889fd9723a9683
//secret  - 42cc6375f7b9f0c3faaba12bbd80bc2c4949441ced3f0bcd3468ba715a1459a3
//    Endpoint - https://3392c68a9f7f3dd514af38c714c073bb.r2.cloudflarestorage.com

import express, { Request, Response } from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generateID } from "./utils";
import path from "path";
import { createUploadPath } from "./filehandler";
import { uploadToS3 } from "./awsService";

const app = express();
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("hola");
});

app.post("/deploy", async (req: Request, res: Response) => {
  const URL = req.body.repoURL;
  const id = generateID();
  // cloning repo
  try {
    await simpleGit().clone(URL, path.join(__dirname, `repoOutput/${id}`));
  } catch (error) {
    res.json({ GitCloneError: error });
  }
  // getting repo path
  const paths = path.join(__dirname, `repoOutput/${id}`);
  // getting all repo files
  const files = createUploadPath(paths);

  // files.forEach(async (file) => {
  // await uploadToS3(file.slice(__dirname.length + 1), file);
  //});
  res.json({ id: id });
});

app.listen(3001, () => {
  console.log("** Hitting diployment server! **");
});
