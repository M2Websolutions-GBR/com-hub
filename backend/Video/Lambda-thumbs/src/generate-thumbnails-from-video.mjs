import fs from "fs";
import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

import doesFileExist from "./does-file-exist.mjs";
import generateTmpFilePath from "./generate-tmp-file-path.mjs";

// ESM __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// robust pfade
const ffprobePath = path.join(__dirname, "ffprobe");
const ffmpegPath = path.join(__dirname, "ffmpeg");

const THUMBNAIL_OUTPUT_DIR = process.env.THUMBNAIL_OUTPUT_PATH || path.resolve("../Video/public/thumbnails");

export default async (tmpVideoPath, numberOfThumbnails, videoFileName) => {
    console.log("🚀 Starte Thumbnail-Erstellung...");
    console.log("🔍 video:", tmpVideoPath);
    console.log("🔍 ffprobe:", ffprobePath);
    console.log("🔍 ffmpeg:", ffmpegPath);

    const randomTimes = generateRandomTimes(tmpVideoPath, numberOfThumbnails);
    console.log("🎯 Random Times:", randomTimes);

    for (const [index, randomTime] of Object.entries(randomTimes)) {
        const tmpThumbnailPath = await createImageFromVideo(tmpVideoPath, randomTime);

        if (doesFileExist(tmpThumbnailPath)) {
            const nameOfImageToCreate = generateNameOfImageToUpload(videoFileName, index);
            await saveThumbnail(tmpThumbnailPath, nameOfImageToCreate);
            console.log(`✅ Thumbnail gespeichert: ${nameOfImageToCreate}`);
        } else {
            console.error(`🚨 Thumbnail bei Sekunde ${randomTime} NICHT erstellt`);
        }
    }
};

const generateRandomTimes = (tmpVideoPath, numberOfTimesToGenerate) => {
    const timesInSeconds = [];
    const videoDuration = getVideoDuration(tmpVideoPath);

    console.log("🎥 Video Duration:", videoDuration);

    for (let x = 0; x < numberOfTimesToGenerate; x++) {
        const randomNum = getRandomNumberNotInExistingList(timesInSeconds, videoDuration);
        if (randomNum >= 0) {
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
};

const getRandomNumber = (upperLimit) => {
    return Math.floor(Math.random() * upperLimit);
};

const getVideoDuration = (tmpVideoPath) => {
    const ffprobe = spawnSync(ffprobePath, [
        "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=nw=1:nk=1",
        tmpVideoPath
    ]);

    const stderr = ffprobe.stderr?.toString();
    const stdout = ffprobe.stdout?.toString();

    if (stderr) console.error("🚨 ffprobe stderr:", stderr);
    if (!stdout) throw new Error(`⚠️ ffprobe lieferte keine Duration für ${tmpVideoPath}`);

    const duration = Math.floor(parseFloat(stdout));
    if (isNaN(duration)) throw new Error(`⚠️ Dauer konnte nicht geparst werden: ${stdout}`);

    return duration;
};

const createImageFromVideo = (tmpVideoPath, targetSecond) => {
    const tmpThumbnailPath = generateThumbnailPath(targetSecond);
    const ffmpegParams = createFfmpegParams(tmpVideoPath, tmpThumbnailPath, targetSecond);

    console.log(`🎬 Erstelle Frame bei Sekunde ${targetSecond}: ${tmpThumbnailPath}`);
    const ffmpeg = spawnSync(ffmpegPath, ffmpegParams);

    if (ffmpeg.stderr) console.error("🚨 ffmpeg stderr:", ffmpeg.stderr.toString());
    if (ffmpeg.stdout) console.log("ffmpeg stdout:", ffmpeg.stdout.toString());

    return tmpThumbnailPath;
};

const generateThumbnailPath = (targetSecond) => {
    const tmpThumbnailPathTemplate = "/tmp/thumbnail-{HASH}-{num}.jpg";
    const uniqueThumbnailPath = generateTmpFilePath(tmpThumbnailPathTemplate);
    return uniqueThumbnailPath.replace("{num}", targetSecond);
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
