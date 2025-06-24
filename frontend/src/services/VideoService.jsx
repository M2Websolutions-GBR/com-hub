import axios from "axios";

const VideoService = {
  getPublicVideosByUserId: async (userId) => {
    console.log('userId', userId)
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL_DATA}/api/data/videos/public/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching public videos by user ID:", error);
      throw error;
    }
  },

  getPrivateVideosByUserId: async (userId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL_DATA
        }/api/data/videos/private/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching public videos by user ID:", error);
      throw error;
    }
  },

  getAllPublicVideos: async (setPublicVideoData, page) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL_DATA
        }/api/data/videos/public?page=${page}&limit=12`
      );
      const videoData = response.data;
      setPublicVideoData(videoData);
      return response.data;
    } catch (error) {
      console.error("Error fetching all public videos:", error);
      throw error;
    }
  },

  getAllPrivateVideos: async (setPrivateVideoData, page) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL_DATA
        }/api/data/videos/private?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const videoData = response.data;
      setPrivateVideoData(videoData);
      return response.data;
    } catch (error) {
      console.error("Error fetching private videos:", error);
      throw error;
    }
  },

  uploadVideo: async (formData, token) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL_VIDEO}/api/videos/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading video:", error);
      throw error;
    }
  },
};

export default VideoService;
