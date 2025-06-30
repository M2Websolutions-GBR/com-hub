import fs from "fs";
import path from "path";
import generateTmpFilePath from "./generate-tmp-file-path.mjs";

export default async (uploadsDir, videoFileName) => {
    const sourcePath = path.join(uploadsDir, videoFileName);
    const videoBuffer = await fs.promises.readFile(sourcePath);
    const tmpVideoFilePath = await saveFileToTmpDirectory(videoBuffer);
    return tmpVideoFilePath;
};

const saveFileToTmpDirectory = async (fileBuffer) => {
    const tmpVideoPathTemplate = "/tmp/vid-{HASH}.mp4";
    const tmpVideoFilePath = generateTmpFilePath(tmpVideoPathTemplate);
    await fs.promises.writeFile(tmpVideoFilePath, fileBuffer);
    return tmpVideoFilePath;
};