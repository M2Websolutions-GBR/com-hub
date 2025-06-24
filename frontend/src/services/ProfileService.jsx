import axios from "axios";

const ProfileService = {
  getProfileById: async (channelId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL_DATA}/api/data/users/${channelId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching profile by ID:", error);
      throw error;
    }
  },

  getProfile: async (setAboutText, setUserData, setAvatarUrl) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL_AUTH}/api/auth/getprofile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = response.data.data;
      setAboutText(userData.aboutText);
      setUserData((prevData) => ({
        ...prevData,
        channelName: userData.channelName,
      }));
      if (userData.avatarUrl) {
        setAvatarUrl(userData.avatarUrl);
      }
      return userData;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  getUser: async () => {
    try {
      const token = localStorage.getItem("token"); 

      if (!token) {
        throw new Error("No token available");
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL_AUTH}/api/auth/getuser`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("User details:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      throw error;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL_AUTH}/api/auth/updatepassword`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },

  changeEmail: async (newEmail) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL_AUTH}/api/auth/updateemail`,
        { newEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error changing email:", error);
      throw error;
    }
  },

  changeChannelName: async (newChannelName) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL_AUTH}/api/auth/updatechannelname`,
        { newChannelName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error changing channel name:", error);
      throw error;
    }
  },
};

export default ProfileService;
