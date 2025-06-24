import { MdCloudUpload } from "react-icons/md";
import { Oval } from "react-loader-spinner";
import { RxCross2 } from "react-icons/rx";
import VideoService from "../services/VideoService";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";

const UploadVideo = ({ isOpen, onClose, onNewVideo }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("private");
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleVisibilityChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setErrorMessage("Please choose a video to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("status", status);

    const token = localStorage.getItem("token");

    setIsUploading(true);

    try {
      const newVideo = await VideoService.uploadVideo(formData, token);
      setErrorMessage("");
      onClose();
      toast.success("Video successfully uploaded!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      const temporaryId = Math.floor(Math.random() * 1000);
      const { title, description, status, likes, thumbnailUrl } = newVideo;
      const videoData = {
        id: temporaryId,
        title,
        description,
        status,
        videoLike: likes, // Assuming 'likes' is the property representing likes
        thumbnailUrl, // Assuming 'thumbnailUrl' is the property representing thumbnail
      };
      console.log("videoData", videoData);
      onNewVideo(videoData); // Pass the new video data to the parent component
    } catch (error) {
      console.error("Error uploading video:", error);
      setErrorMessage("Failed to upload, please try again");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <RxCross2
          className="absolute w-6 h-6 text-gray-400 cursor-pointer top-4 right-4 hover:text-gray-600"
          onClick={onClose}
        />
        <h2 className="mb-4 text-2xl font-bold text-center text-cyan-600">
          Upload Video
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-bold text-gray-700">
              Video File
            </label>
            <label className="flex items-center justify-center w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 focus:bg-gray-300 focus:outline-none focus:shadow-outline">
              <MdCloudUpload className="w-6 h-6 mr-2" />
              Choose a file
              <input
                type="file"
                onChange={handleFileChange}
                accept="video/*"
                className="hidden"
              />
            </label>
            {fileName && (
              <p className="mt-2 text-sm text-gray-600">{fileName}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-bold text-gray-700">Title</label>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={handleTitleChange}
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-bold text-gray-700">
              Description
            </label>
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={handleDescriptionChange}
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>
          <div className="mb-4 text-gray-700">
            <label className="block mb-2 font-bold text-gray-700">
              Visibility
            </label>
            <div className="flex items-center">
              <label className="mr-4">
                <input
                  type="radio"
                  name="status"
                  value="private"
                  checked={status === "private"}
                  onChange={handleVisibilityChange}
                  className="mr-1"
                />
                Private
              </label>
              <label>
                <input
                  type="radio"
                  name="status"
                  value="public"
                  checked={status === "public"}
                  onChange={handleVisibilityChange}
                  className="mr-1"
                />
                Public
              </label>
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              {errorMessage && (
                <p className="mt-4 text-sm text-red-500">{errorMessage}</p>
              )}
            </div>
            <div>
              <button
                type="button"
                id="cancel-upload-button"
                onClick={onClose}
                className="px-4 py-3 mr-2 text-sm font-medium text-gray-700 bg-gray-300 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-3 text-sm font-medium text-white rounded bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-600"
              >
                {isUploading ? (
                  <Oval color="#fff" height={20} width={20} />
                ) : (
                  "Upload"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadVideo;
