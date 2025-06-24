import React, { useEffect, useState } from "react";

import { FaRegFrown } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import HistoryCard from "../components/HistoryCard";
import ProfileService from "../services/ProfileService";
import useHistoryService from "../services/HistoryService";
import { useSideMenuOpen } from "../contexts/SideMenuContext";
import { useUserContext } from "../contexts/UserContext";

const HistoryListView = () => {
  const { getHistories, deleteHistory, deleteAllHistories } =
    useHistoryService();
  const [userId, setUserId] = useState();
  const [historiesCache, setHistoriesCache] = useState({});
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { sideMenuOpen } = useSideMenuOpen();
  const { setUserData, setAboutText, setAvatarUrl } = useUserContext();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchProfileAndUser = async () => {
      try {
        await ProfileService.getProfile(
          setAboutText,
          setUserData,
          setAvatarUrl
        );
        const userData = await ProfileService.getUser();
        setUserId(userData.data.id);
      } catch (error) {
        console.error("Failed to fetch profile or user ID:", error);
      }
    };

    fetchProfileAndUser();
  }, [setAboutText, setUserData, setAvatarUrl]);

  useEffect(() => {
    const fetchHistories = async () => {
      setLoading(true);
      try {
        if (!historiesCache[userId]) {
          const data = await getHistories();
          setHistoriesCache({ ...historiesCache, [userId]: data });
        }
        const cachedHistories = historiesCache[userId];
        if (cachedHistories) {
          const filteredHistories = cachedHistories.filter(
            (history) => history.userId === userId && history.type === "watch"
          );
          setHistories(filteredHistories.reverse());
        }
      } catch (error) {
        console.error("Error fetching histories:", error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) {
      fetchHistories();
    }
  }, [userId, historiesCache]);

  const handleDeleteHistory = async (id) => {
    try {
      await deleteHistory(id);
      setHistories(histories.filter((history) => history._id !== id));
    } catch (error) {
      console.error("Error deleting history:", error);
    }
  };

  const handleDeleteAllHistories = async () => {
    setShowDeleteModal(false);
    try {
      await deleteAllHistories("watch");
      setHistories([]);
      setHistoriesCache({ ...historiesCache, [userId]: [] });
    } catch (error) {
      console.error("Error deleting all histories:", error);
    }
  };

  return (
    <div
      className={`flex items-center flex-col h-screen transition-all duration-300 overflow-y-auto no-scrollbar ${
        sideMenuOpen ? "ml-60" : ""
      }`}
    >
      <h2 className="mb-4 text-2xl font-bold">Video History</h2>
      <button
        onClick={() => setShowDeleteModal(true)}
        className="px-4 py-2 text-white bg-red-500 rounded delete-all-button hover:bg-red-600"
      >
        <FaTrashCan />
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="mt-4 w-full max-w-[90%] sm:max-w-[80%] lg:max-w-[70%]">
          {histories.length > 0 ? (
            histories.map((history) => (
              <li key={history._id} className="mb-4">
                <HistoryCard
                  imageUrl={history.videoId.thumbnailUrl}
                  videoTitle={history.videoId.title}
                  videoDescription={history.videoId.description}
                  videoId={history.videoId.id}
                  historyId={history._id}
                  handleDeleteHistory={handleDeleteHistory}
                />
                <p className="mb-2 text-sm text-gray-600">
                  Watched on: {new Date(history.createdAt).toLocaleString()}
                </p>
              </li>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full text-gray-500">
              <FaRegFrown className="mb-4 text-6xl" />
              <p className="text-xl font-semibold">No history found</p>
              <p className="mt-2 text-md">
                Please check back later or watch a video.
              </p>
            </div>
          )}
        </ul>
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed z-[50] inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-center">
              Clear History
            </h2>
            <p className="mb-4 text-center text-gray-700">
              Are you sure you want to clear your history?
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700 focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAllHistories}
                className="px-4 py-2 ml-2 font-bold text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:shadow-outline"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryListView;
