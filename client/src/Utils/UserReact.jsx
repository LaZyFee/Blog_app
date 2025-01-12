import { useState, useEffect } from "react";
import { SlDislike, SlLike } from "react-icons/sl";
import { AiFillLike } from "react-icons/ai";
import { BiSolidDislike } from "react-icons/bi";
import { useAuth } from "../Store/AuthStore";

const UserReact = ({ id, likes, dislikes, reactions, toggleLike }) => {
  const { user } = useAuth();
  const [likeStatus, setLikeStatus] = useState(null); // 'like', 'dislike', or null
  const [currentLikes, setLikes] = useState(likes);
  const [currentDislikes, setDislikes] = useState(dislikes);

  useEffect(() => {
    if (user?._id) {
      const userReaction = reactions.find(
        (reaction) => reaction.user === user._id
      );
      if (userReaction) {
        setLikeStatus(userReaction.type); // 'like' or 'dislike'
      }
    }
  }, [user?._id, reactions]);

  const handleToggle = async (action) => {
    const currentReaction = likeStatus; // Current reaction (like/dislike/null)
    console.log("currentReaction :", currentReaction, typeof currentReaction);
    const newAction = currentReaction === action ? null : action;

    console.log("newAction :", newAction, typeof newAction);

    // Optimistic UI update
    setLikeStatus(newAction);
    if (newAction === "like") {
      setLikes(currentLikes + 1);
      if (currentReaction === "dislike") setDislikes(currentDislikes - 1);
    } else if (newAction === "dislike") {
      setDislikes(currentDislikes + 1);
      if (currentReaction === "like") setLikes(currentLikes - 1);
    } else {
      if (currentReaction === "like") setLikes(currentLikes - 1);
      if (currentReaction === "dislike") setDislikes(currentDislikes - 1);
    }

    try {
      const response = await toggleLike(id, newAction);

      // Ensure response has the correct structure
      const { likes, dislikes, userReaction } = response.data.data;

      console.log("Updated data:", { likes, dislikes, userReaction });

      // Sync state with backend response
      setLikes(likes);
      setDislikes(dislikes);
      setLikeStatus(userReaction);
    } catch (error) {
      console.error("Failed to toggle like/dislike:", error.message);

      // Revert UI on failure
      setLikeStatus(currentReaction);
      setLikes(currentLikes);
      setDislikes(currentDislikes);
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
      <button
        className={`flex items-center gap-1 ${
          likeStatus === "like" ? "text-blue-500" : ""
        }`}
        onClick={() => handleToggle("like")}
      >
        {likeStatus === "like" ? <AiFillLike /> : <SlLike />}
        <span className="ml-1">{currentLikes}</span>
      </button>
      <button
        className={`flex items-center gap-1 ${
          likeStatus === "dislike" ? "text-red-500" : ""
        }`}
        onClick={() => handleToggle("dislike")}
      >
        {likeStatus === "dislike" ? <BiSolidDislike /> : <SlDislike />}
        <span className="ml-1">{currentDislikes}</span>
      </button>
    </div>
  );
};

export default UserReact;
