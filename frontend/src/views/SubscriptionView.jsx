import React, { useEffect, useState } from "react";

import { FaRegFrown } from "react-icons/fa";
import { Link } from "react-router-dom";
import SubscriptionService from "../services/SubscriptionService";
import { useSideMenuOpen } from "../contexts/SideMenuContext";

const SubscriptionView = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const { sideMenuOpen } = useSideMenuOpen();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await SubscriptionService.getSubscribedChannels();
        setSubscriptions(response.data);
      } catch (error) {
        console.error("Failed to fetch subscriptions:", error);
      }
    };

    fetchSubscriptions();
  }, []);

  return (
    <div className={`flex flex-col items-center h-screen transition-all duration-300 overflow-y-auto no-scrollbar ${sideMenuOpen ? "ml-60" : ""}`}>
      <div className="flex-1 sm:w-[90%] lg:w-[80%] xl:w-[70%] mx-auto p-4 flex-wrap justify-start">
        {subscriptions.length > 0 ? (
          subscriptions.map((subscription) => (
            <div key={subscription.channelId._id} className="w-full p-2">
              <Link to={`/channel/${subscription.channelId._id}`}>
                <div className="max-w-[1440px] mx-auto mt-4 px-6 py-8 bg-gray-100 rounded-lg shadow-md sm:flex sm:flex-row sm:items-start">
                  <div className="flex-shrink-0 w-20 h-20 mb-4 sm:mb-0">
                    <img
                      src={subscription.channelId.avatarUrl}
                      alt="avatar"
                      className="object-cover w-full h-full rounded-full cursor-pointer"
                    />
                  </div>
                  <div className="ml-4">
                    <h2 className="mb-4 text-2xl font-bold">{subscription.channelId.channelName}</h2>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full text-gray-500">
            <FaRegFrown className="mb-4 text-6xl" />
            <p className="text-xl font-semibold">No subscriptions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionView;
