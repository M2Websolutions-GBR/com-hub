import fs from "fs";
import path from "path";
import doesFileExist from "./does-file-exist.mjs";
import downloadVideoToTmpDirectory from "./download-video-to-tmp-directory.mjs";
import generateThumbnailsFromVideo from "./generate-thumbnails-from-video.mjs";

const THUMBNAILS_TO_CREATE = 1;

export const handler = async (event) => {
    await wipeTmpDirectory();
    const { videoFileName, uploadsDir } = extractParams(event);
    const tmpVideoPath = await downloadVideoToTmpDirectory(uploadsDir, videoFileName);

    if (doesFileExist(tmpVideoPath)) {
        await generateThumbnailsFromVideo(tmpVideoPath, THUMBNAILS_TO_CREATE, videoFileName);
    }
};

const extractParams = event => {
    return {
        videoFileName: event.videoFileName,
        uploadsDir: event.uploadsDir || process.env.FILE_UPLOAD_PATH || path.resolve("../Video/public/uploads")
    };
};

const wipeTmpDirectory = async () => {
    const files = await fs.promises.readdir("/tmp/");
    const filePaths = files.map(file => path.join("/tmp/", file));
    await Promise.all(filePaths.map(file => fs.promises.unlink(file)));
}