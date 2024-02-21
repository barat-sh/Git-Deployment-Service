import express, { Request, Response } from "express";
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hola");
});

app.post("/deploy", (req: Request, res: Response) => {
  const URL = req.body.gitURL;
  console.log(URL);
  res.json({ URL });
});

app.listen(3001, () => {
  console.log("** Hitting diployment server! **");
});
