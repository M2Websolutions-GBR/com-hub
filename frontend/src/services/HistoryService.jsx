import axios from 'axios';

const useHistoryService = () => {
  const getHistories = async () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL_DATA}/api/data/histories`, config);
      return response.data.data; // Ensure this matches the structure of your API response
    } catch (error) {
      console.error('Error fetching histories:', error);
      throw error;
    }
  };

  const createHistory = async (history) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL_DATA}/api/data/histories`, history, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating history:', error);
      throw error;
    }
  };

  const deleteHistory = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL_DATA}/api/data/histories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting history:', error);
      throw error;
    }
  };

  const deleteAllHistories = async (type) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL_DATA}/api/data/histories/${type}/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting all histories:', error);
      throw error;
    }
  };

  return {
    getHistories,
    createHistory,
    deleteHistory,
    deleteAllHistories,
  };
};

export default useHistoryService;
