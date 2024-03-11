"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_s3_1 = require("@aws-sdk/client-s3");
// import { Response } from "node-fetch";
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const r2Client = new client_s3_1.S3Client({
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
const listObjectsCommand = new client_s3_1.ListBucketsCommand(r2_params);
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
app.get("/*", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // id.100xdevs.com
    const host = req.hostname;
    console.log("hitting");
    const id = host.split(".")[0];
    const filePath = req.path;
    const streamToString = (stream) => new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });
    const input = new client_s3_1.GetObjectCommand({
        Bucket: 'deploy',
        Key: `dist/${id}${filePath}`,
    });
    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript";
    res.set("Content-Type", type);
    // dist/zidlvl/index.html
    r2Client.send(input, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            res.send({ json: "please check URL route" });
        }
        if (data && data.Body) {
            const bodyContents = yield streamToString(data.Body);
            res.send(bodyContents);
            // const contents = data.Body.toString();
        }
        else {
            res.send({ json: "please check URL route" });
        }
    }));
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
}));
app.listen(3003, () => {
    console.log("Request-handler-Service hitting...");
});
function streamToBuffer(stream) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const chunks = [];
            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
            stream.on('error', (error) => reject(error));
        });
    });
}
