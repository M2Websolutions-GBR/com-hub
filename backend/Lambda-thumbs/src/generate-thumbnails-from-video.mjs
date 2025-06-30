import fs from "fs";
import { spawnSync } from "child_process";
import path from "path";
import doesFileExist from "./does-file-exist.mjs";
import generateTmpFilePath from "./generate-tmp-file-path.mjs";

const ffprobePath = "/opt/nodejs/ffprobe";
const ffmpegPath = "/opt/nodejs/ffmpeg";

const THUMBNAIL_OUTPUT_DIR = process.env.THUMBNAIL_OUTPUT_PATH || path.resolve("../Video/public/thumbnails");

export default async (tmpVideoPath, numberOfThumbnails, videoFileName) => {
    const randomTimes = generateRandomTimes(tmpVideoPath, numberOfThumbnails);
    
    for(const [index, randomTime] of Object.entries(randomTimes)) {
        const tmpThumbnailPath = await createImageFromVideo(tmpVideoPath, randomTime);

        if (doesFileExist(tmpThumbnailPath)) {
            const nameOfImageToCreate = generateNameOfImageToUpload(videoFileName, index);
            await saveThumbnail(tmpThumbnailPath, nameOfImageToCreate);
        }
    }
}

const generateRandomTimes = (tmpVideoPath, numberOfTimesToGenerate) => {
    const timesInSeconds = [];
    const videoDuration = getVideoDuration(tmpVideoPath);

    for (let x = 0; x < numberOfTimesToGenerate; x++) {
        const randomNum = getRandomNumberNotInExistingList(timesInSeconds, videoDuration);
        
        if(randomNum >= 0) {
            timesInSeconds.push(randomNum);
        }
    }

    return timesInSeconds;
};

const getRandomNumberNotInExistingList = (existingList, maxValueOfNumber) => {
    for (let attemptNumber = 0; attemptNumber < 3; attemptNumber++) {
        const randomNum = getRandomNumber(maxValueOfNumber);
        
        if (!existingList.includes(randomNum)) {
            return randomNum;
        }
    }
    
    return -1;
}

const getRandomNumber = (upperLimit) => {
    return Math.floor(Math.random() * upperLimit);
};

const getVideoDuration = (tmpVideoPath) => {
    const ffprobe = spawnSync(ffprobePath, [
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "default=nw=1:nk=1",
        tmpVideoPath
    ]);

    return Math.floor(ffprobe.stdout.toString());
};

const createImageFromVideo = (tmpVideoPath, targetSecond) => {
    const tmpThumbnailPath = generateThumbnailPath(targetSecond);
    const ffmpegParams = createFfmpegParams(tmpVideoPath, tmpThumbnailPath, targetSecond);
    spawnSync(ffmpegPath, ffmpegParams);

    return tmpThumbnailPath;
};

const generateThumbnailPath = (targetSecond) => {
    const tmpThumbnailPathTemplate = "/tmp/thumbnail-{HASH}-{num}.jpg";
    const uniqueThumbnailPath = generateTmpFilePath(tmpThumbnailPathTemplate);
    const thumbnailPathWithNumber = uniqueThumbnailPath.replace("{num}", targetSecond);

    return thumbnailPathWithNumber;
};

const createFfmpegParams = (tmpVideoPath, tmpThumbnailPath, targetSecond) => {
    return [
        "-ss", targetSecond,
        "-i", tmpVideoPath,
        "-vf", "thumbnail,scale=1024:720",
        "-vframes", 1,
        tmpThumbnailPath
    ];
};

const generateNameOfImageToUpload = (videoFileName, i) => {
    const strippedExtension = videoFileName.replace(".mp4", "");
    return `thumbnails/${strippedExtension}-${i}.jpg`;
};

const saveThumbnail = async (tmpThumbnailPath, nameOfImageToCreate) => {
    const targetPath = path.join(THUMBNAIL_OUTPUT_DIR, path.basename(nameOfImageToCreate));
    await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.promises.copyFile(tmpThumbnailPath, targetPath);
};