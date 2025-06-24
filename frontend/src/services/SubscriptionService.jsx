// SubscriptionService.jsx

import axios from 'axios';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); 
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

const getChannels = async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL_DATA}/api/data/subscriptions/channels`, getAuthHeaders());
  return response.data;
};

const getSubscribedVideos = async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL_DATA}/api/data/subscriptions/videos`, getAuthHeaders());
  return response.data;
};

const checkSubscription = async (channelId) => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL_DATA}/api/data/subscriptions/check`, { channelId }, getAuthHeaders());
  return response.data;
};

const subscribe = async (channelId) => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL_DATA}/api/data/subscriptions`, { channelId }, getAuthHeaders());
  return response.data;
};

const unsubscribe = async (channelId) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL_DATA}/api/data/subscriptions/subscriptions`, {
        ...getAuthHeaders(),
        params: { channelId }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      throw error;
    }
  };

const getSubscribedChannels = async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL_DATA}/api/data/subscriptions/channels`, getAuthHeaders());
  return response.data;
};

const SubscriptionService = {
  getChannels,
  getSubscribedVideos,
  checkSubscription,
  subscribe,
  unsubscribe,
  getSubscribedChannels,
};

export default SubscriptionService;
