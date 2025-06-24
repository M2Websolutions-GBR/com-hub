import axios from "axios";

const useFeelingsService = () => {
  const getFeelings = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL_DATA}/api/data/feelings/videos`, // Corrected endpoint to fetch feelings
        config
      );
      return response.data.data; // Assuming the API response has a `data` property with feelings
    } catch (error) {
      console.error("Error fetching feelings:", error);
      throw error;
    }
  };

  return {
    getFeelings,
  };
};

export default useFeelingsService;
