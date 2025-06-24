const mongoose = require("mongoose");
const Video = require("./Video");
// const s3 = require("../config/s3");

// jest.mock("aws-sdk"); // Mock AWS SDK
// jest.mock("../config/s3"); // Mock s3 module

describe("Video Model", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // it("should upload a video file to S3", async () => {
    //     const mockFile = {
    //         originalname: "video.mp4",
    //         buffer: Buffer.from("mocked-video-content"),
    //         mimetype: "video/mp4",
    //     };

    //     const mockS3Client = {
    //         upload: jest.fn().mockReturnThis(),
    //         promise: jest.fn().mockResolvedValue({ Key: "mocked-key" }),
    //     };

    //     s3.mockImplementation(() => mockS3Client); // Mock s3() function

    //     const result = await Video.upload(mockFile);

    //     expect(s3).toHaveBeenCalled();
    //     expect(mockS3Client.upload).toHaveBeenCalledWith({
    //         Bucket: process.env.BUCKET_NAME,
    //         Key: expect.stringContaining("video.mp4"),
    //         Body: mockFile.buffer,
    //         ContentType: mockFile.mimetype,
    //         ACL: "private",
    //     });
    //     expect(result).toEqual("mocked-key");
    // });

    it("should define correct schema fields", () => {
        const schema = Video.schema.obj;
        expect(schema.title).toBeDefined();
        expect(schema.description).toBeDefined();
        expect(schema.thumbnailUrl).toBeDefined();
        expect(schema.views).toBeDefined();
        expect(schema.key).toBeDefined();
        expect(schema.status).toBeDefined();
        expect(schema.categoryId).toBeDefined();
        expect(schema.userId).toBeDefined();
    });

    it("should define correct virtuals", () => {
        const virtuals = Video.schema.virtuals;
        expect(virtuals.dislikes).toBeDefined();
        expect(virtuals.likes).toBeDefined();
        expect(virtuals.comments).toBeDefined();
    });

    it("should index title field for text search", () => {
        const indexes = Video.schema.indexes();
        const titleIndex = indexes.find((index) => index[0].title === "text");
        expect(titleIndex).toBeDefined();
    });
});
