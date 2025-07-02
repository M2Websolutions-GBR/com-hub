import fs from "fs";
import generateTmpFilePath from "./generate-tmp-file-path.mjs";


export default (filePathTemplate) => {
    const hash = getRandomString(10);
	const tmpFilePath = filePathTemplate.replace("{HASH}", hash);

	return tmpFilePath;
}

const getRandomString = (len) => {
    const charset = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let result = "";

	for (let i = len; i > 0; --i) {
		result += charset[Math.floor(Math.random() * charset.length)];
	}

	return result;
}

const template = "/tmp/vid-{HASH}.mp4";
const uniqueFilePath = generateTmpFilePath(template);
console.log(uniqueFilePath); 

