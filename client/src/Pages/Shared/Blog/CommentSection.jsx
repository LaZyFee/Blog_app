/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { SlDislike, SlLike } from "react-icons/sl";
import { AiFillLike } from "react-icons/ai";
import { BiSolidDislike } from "react-icons/bi";
import { IoMdTime } from "react-icons/io";
import { useAuth } from "../../../Store/AuthStore";
import useCommentsStore from "../../../Store/CommentStore";
import { formatDate } from "../../../Utils/formatedate";

function CommentSection({ blogId }) {
  const { user } = useAuth();
  const {
    comments,
    isLoading: commentsLoading,
    error: commentsError,
    fetchComments,
    createComment,
    toggleLike,
    addReply,
  } = useCommentsStore();

  const [commentInput, setCommentInput] = useState("");
  const [replyInput, setReplyInput] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const [likeStatus, setLikeStatus] = useState({});
  const [commentsToShow, setCommentsToShow] = useState(8);
  console.log(comments);

  useEffect(() => {
    if (blogId) fetchComments(blogId);

    // Outside click to close reply input
    const handleClickOutside = (event) => {
      if (!event.target.closest(".reply-container")) {
        setReplyInput({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [blogId, fetchComments]);

  const handleCreateComment = async () => {
    if (commentInput.trim()) {
      await createComment(blogId, commentInput);
      setCommentInput("");
    }
  };

  const handleReply = async (commentId) => {
    if (replyInput[commentId]?.trim()) {
      await addReply(blogId, commentId, replyInput[commentId]);
      setReplyInput((prev) => ({ ...prev, [commentId]: undefined }));
    }
  };

  const toggleReply = (commentId) => {
    setReplyInput((prev) => ({
      ...prev,
      [commentId]: prev[commentId] !== undefined ? undefined : "",
    }));
  };

  const toggleReplies = (commentId) => {
    setShowReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const loadMoreComments = () => {
    setCommentsToShow((prev) => Math.min(prev + 8, comments.length));
  };

  const renderReplies = (replies, commentId) => {
    const displayedReplies = showReplies[commentId]
      ? replies
      : replies.slice(0, 2);

    if (commentsLoading) return <p>{commentsLoading}</p>;
    if (commentsError) return <p>{commentsError}</p>;
    return (
      <div className="ml-8 mt-4">
        {displayedReplies.map((reply) => (
          <div
            key={reply._id}
            className="border-l-2 border-blue-500 pl-2 mb-2 ml-5"
          >
            <div className="flex items-center">
              <img
                src={
                  reply.createdBy?.profilepic
                    ? `${
                        import.meta.env.VITE_BACKEND_URL
                      }/${reply.createdBy.profilepic.replace(/^src\//, "")}`
                    : "/default-profile.png"
                }
                alt={reply.createdBy?.name || "Unknown"}
                className="w-8 h-8 rounded-full mr-2"
              />
              <div>
                <span className="font-semibold">
                  {reply.createdBy?.name || "Unknown"}
                </span>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <IoMdTime />
                  <span>{formatDate(reply.createdAt)}</span>
                </div>
              </div>
            </div>
            <p className="mt-1">{reply.comment}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
              <button
                className={`flex items-center gap-1 ${
                  likeStatus[reply._id] === "like" ? "text-blue-500" : ""
                }`}
                onClick={() => toggleLike(reply._id, "like")}
              >
                {likeStatus[reply._id] === "like" ? <AiFillLike /> : <SlLike />}
                <span className="ml-1">{reply.likes || 0}</span>
              </button>
              <button
                className={`flex items-center gap-1 ${
                  likeStatus[reply._id] === "dislike" ? "text-red-500" : ""
                }`}
                onClick={() => toggleLike(reply._id, "dislike")}
              >
                {likeStatus[reply._id] === "dislike" ? (
                  <BiSolidDislike />
                ) : (
                  <SlDislike />
                )}
                <span className="ml-1">{reply.dislikes || 0}</span>
              </button>
              {/* <button
                onClick={() => toggleReply(reply._id)}
                className="text-blue-500 hover:underline"
              >
                Reply
              </button> */}
            </div>

            {replyInput[reply._id] !== undefined && (
              <div className="reply-container mt-2 flex items-center">
                <input
                  type="text"
                  value={replyInput[reply._id]}
                  onChange={(e) =>
                    setReplyInput((prev) => ({
                      ...prev,
                      [reply._id]: e.target.value,
                    }))
                  }
                  placeholder="Write a reply..."
                  className="flex-grow border rounded px-4 py-2"
                />
                <button
                  onClick={() => handleReply(reply._id)}
                  className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Post
                </button>
              </div>
            )}
          </div>
        ))}

        {replies.length > 2 && (
          <button
            onClick={() => toggleReplies(commentId)}
            className="text-sm text-blue-500 mt-2 hover:underline"
          >
            {showReplies[commentId] ? "Show Less" : "Show More Replies"}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="mt-8">
      {user ? (
        <div className="flex items-center">
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}/${user.profilePic}`}
            alt={user.name}
            className="w-10 h-10 rounded-full mr-4"
          />
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Write a comment..."
            className="flex-grow border rounded px-4 py-2"
          />
          <button
            onClick={handleCreateComment}
            className="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Post
          </button>
        </div>
      ) : (
        ""
      )}
      <div className="mt-8">
        {comments.slice(0, commentsToShow).map((comment) => (
          <div key={comment._id} className="rounded-lg mb-6 border p-4">
            <div className="flex">
              <img
                src={
                  comment.createdBy?.profilepic
                    ? `${
                        import.meta.env.VITE_BACKEND_URL
                      }/${comment.createdBy.profilepic.replace(/^src\//, "")}`
                    : "/default-profile.png"
                }
                alt={comment.createdBy?.name || "Unknown"}
                className="w-10 h-10 rounded-full mr-2"
              />
              <div>
                <span className="font-semibold">
                  {comment.createdBy?.name || "Unknown"}
                </span>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <IoMdTime />
                  <span>{formatDate(comment.createdAt)}</span>
                </div>
              </div>
            </div>
            <p className="mt-2 ml-10">{comment.comment}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-2 ml-10">
              <button
                className={`flex items-center gap-1 ${
                  likeStatus[comment._id] === "like" ? "text-blue-500" : ""
                }`}
                onClick={() => toggleLike(comment._id, "like")}
              >
                {likeStatus[comment._id] === "like" ? (
                  <AiFillLike />
                ) : (
                  <SlLike />
                )}
                <span className="ml-1">{comment.likes || 0}</span>
              </button>
              <button
                className={`flex items-center gap-1 ${
                  likeStatus[comment._id] === "dislike" ? "text-red-500" : ""
                }`}
                onClick={() => toggleLike(comment._id, "dislike")}
              >
                {likeStatus[comment._id] === "dislike" ? (
                  <BiSolidDislike />
                ) : (
                  <SlDislike />
                )}
                <span className="ml-1">{comment.dislikes || 0}</span>
              </button>
              <button
                onClick={() => toggleReply(comment._id)}
                className="text-blue-500 hover:underline"
              >
                Reply
              </button>
            </div>

            {replyInput[comment._id] !== undefined && (
              <div className="reply-container mt-2 flex items-center">
                <input
                  type="text"
                  value={replyInput[comment._id]}
                  onChange={(e) =>
                    setReplyInput((prev) => ({
                      ...prev,
                      [comment._id]: e.target.value,
                    }))
                  }
                  placeholder="Write a reply..."
                  className="flex-grow border rounded px-4 py-2"
                />
                <button
                  onClick={() => handleReply(comment._id)}
                  className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Post
                </button>
              </div>
            )}

            {comment.replies.length > 0 &&
              renderReplies(comment.replies, comment._id)}
          </div>
        ))}
      </div>

      {comments.length > commentsToShow && (
        <button
          onClick={loadMoreComments}
          className="text-sm text-blue-500 mt-4 hover:underline"
        >
          Load More Comments
        </button>
      )}
    </div>
  );
}

export default CommentSection;
