import React, { useEffect, useState } from "react";

import SubscriptionService from "../services/SubscriptionService";
import { toast } from "react-toastify";

const AboutOtherChannel = ({ channelName, avatarUrl, aboutText, channelId }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      try {
        const response = await SubscriptionService.checkSubscription(channelId);
        setIsSubscribed(!!response.data);
      } catch (error) {
        console.error('Failed to check subscription status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSubscriptionStatus();
  }, [channelId]);

  const handleSubscribeToggle = async () => {
    setLoading(true);
    try {
      if (isSubscribed) {
        await SubscriptionService.unsubscribe(channelId);
        setIsSubscribed(false);
        toast.success(`Unsubscribed to channel ${channelName}`, {
          theme: "colored",
        });
      } else {
        await SubscriptionService.subscribe(channelId);
        setIsSubscribed(true);
        toast.success(`Subscribed to channel ${channelName}`, {
          theme: "colored",
        });
      }
    } catch (error) {
      console.error('Failed to subscribe/unsubscribe:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto mt-4 px-6 py-8 bg-gray-100 rounded-lg shadow-md sm:flex sm:flex-row sm:items-start">
      <div className="flex-shrink-0 w-48 h-48 mb-4 sm:mb-0">
        <img
          src={avatarUrl}
          alt="avatar"
          className="object-cover w-full h-full rounded-full cursor-pointer"
        />
      </div>
      <div className="flex-grow sm:pl-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold">{channelName}</h2>
          <button onClick={handleSubscribeToggle} disabled={loading} className="px-4 py-2 font-bold text-white rounded bg-cyan-600 hover:bg-cyan-700">
            {loading ? 'Loading...' : isSubscribed ? 'Unsubscribe' : 'Subscribe'}
          </button>
        </div>
        <div className="relative">
          <p className="p-3 text-sm text-gray-800 break-words border rounded shadow-sm">
            {aboutText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutOtherChannel;
