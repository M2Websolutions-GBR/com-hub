import React, { useEffect, useState } from 'react';

import { Link } from "react-router-dom";
import { LuReply } from 'react-icons/lu';
import axios from 'axios';

const CommentSection = ({ videoId }) => {
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState([]);
  const [showAllComments, setShowAllComments] = useState(false);
  const [replyInputs, setReplyInputs] = useState({});
  const [replyVisibility, setReplyVisibility] = useState({});

  const fetchComments = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL_DATA}/api/data/comments/${videoId}/videos`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      setComments(response.data.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL_DATA}/api/data/comments`,
        {
          videoId,
          text: commentInput,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      setComments([...comments, response.data.data]);
      setCommentInput('');
      fetchComments();
    } catch (error) {
      console.error('Failed to submit comment:', error);
    }
  };

  const handleReplySubmit = async (event, commentId) => {
    event.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL_DATA}/api/data/replies`,
        {
          commentId,
          text: replyInputs[commentId] || '',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? { ...comment, replies: [...comment.replies, response.data.data] }
            : comment
        )
      );
      setReplyInputs((prev) => {
        const newInputs = { ...prev };
        delete newInputs[commentId];
        return newInputs;
      });
      fetchComments();
    } catch (error) {
      console.error('Failed to submit reply:', error);
    }
  };

  const handleReplyChange = (commentId, value) => {
    setReplyInputs((prev) => ({ ...prev, [commentId]: value }));
  };

  const toggleReplyVisibility = (commentId) => {
    setReplyVisibility((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = String(date.getUTCFullYear()).slice(-2);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <div className="px-4 py-2 mt-8 mb-8 bg-gray-100 rounded-lg max-w-[95%] mx-auto">
      <h3 className="mb-4 text-lg font-bold">Comments</h3>
      {comments.length > 0 ? (
        <>
          {comments
            .slice(0, showAllComments ? comments.length : 2)
            .map((comment) => (
              <div key={comment._id} className="flex flex-col py-2 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                  <Link to={`/channel/${comment.userId.id}`}>
                    <img
                      src={comment.userId.avatarUrl}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full"
                      />
                      </Link>
                    <div>
                    <Link to={`/channel/${comment.userId.id}`}>
                      <p className="font-semibold">
                        {comment.userId.channelName}{' '}
                        <span className="text-sm font-normal text-gray-400">
                          {formatDate(comment.createdAt)}
                        </span>
                      </p>
                  </Link>
                      <p className="text-sm text-gray-500">{comment.text}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 pl-4">
                    <button
                      className="text-sm text-cyan-600"
                      onClick={() => toggleReplyVisibility(comment._id)}
                    >
                      {replyVisibility[comment._id]
                        ? 'Hide Replies'
                        : `${comment.replies ? comment.replies.length : '0'} Replies`}
                    </button>
                    <button
                      className="text-sm text-cyan-600"
                      onClick={() =>
                        setReplyInputs((prev) => ({
                          ...prev,
                          [comment._id]: '',
                        }))
                      }
                    >
                      <LuReply />
                    </button>
                  </div>
                </div>
                {replyInputs.hasOwnProperty(comment._id) && (
                  <form
                    onSubmit={(e) => handleReplySubmit(e, comment._id)}
                    className="flex items-center mt-2"
                  >
                    <input
                      type="text"
                      value={replyInputs[comment._id] || ''}
                      onChange={(e) => handleReplyChange(comment._id, e.target.value)}
                      placeholder="Add a reply..."
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-600"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 ml-2 text-white transition-colors duration-300 rounded-lg bg-cyan-600 hover:bg-cyan-700"
                    >
                      Send
                    </button>
                  </form>
                )}
                {comment.replies &&
                  comment.replies.map((reply, index) => (
                    <div
                      key={reply._id}
                      className={
                        index === 0 || replyVisibility[comment._id]
                          ? 'flex items-center justify-between py-2 ml-10 border-b'
                          : 'hidden'
                      }
                    >
                      <div className="flex items-center space-x-4">
                      <Link to={`/channel/${reply.userId.id}`} >
                        <img
                          src={reply.userId.avatarUrl}
                          alt="Avatar"
                          className="w-8 h-8 rounded-full"
                          />
                          </Link>
                        <div>
                        <Link to={`/channel/${reply.userId.id}`} >
                          <p className="font-semibold">
                            {reply.userId.channelName}{' '}
                            <span className="text-sm font-normal text-gray-400">
                              {formatDate(reply.createdAt)}
                            </span>
                          </p>
                        </Link>
                          <p className="text-sm text-gray-500">{reply.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          {comments.length > 2 && !showAllComments && (
            <button
              className="mt-4 text-cyan-600"
              onClick={() => setShowAllComments(true)}
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <p>No comments available for this video.</p>
      )}
      <form onSubmit={handleCommentSubmit} className="flex items-center mt-4">
        <input
          type="text"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          placeholder="Add a comment..."
          className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-600"
        />
        <button
          type="submit"
          className="px-4 py-2 ml-2 text-white transition-colors duration-300 rounded-lg bg-cyan-600 hover:bg-cyan-700"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
