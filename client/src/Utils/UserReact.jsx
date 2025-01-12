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
      const reactionsArray = Array.isArray(reactions) ? reactions : [];
      const userReaction = reactionsArray.find(
        (reaction) => reaction.user === user._id
      );
      if (userReaction) {
        setLikeStatus(userReaction.type); // 'like' or 'dislike'
      }
    }
  }, [user?._id, reactions]);

  const handleToggle = async (action) => {
    const currentReaction = likeStatus; // Current reaction (like/dislike/null)
    const newAction = currentReaction === action ? "none" : action;

    // Optimistic UI update
    setLikeStatus(newAction === "none" ? null : action);
    if (newAction === "like") {
      setLikes(currentLikes + 1);
      if (currentReaction === "dislike") setDislikes(currentDislikes - 1);
    } else if (newAction === "dislike") {
      setDislikes(currentDislikes + 1);
      if (currentReaction === "like") setLikes(currentLikes - 1);
    } else {
      if (currentReaction === "like") setLikes(currentLikes - 1);
      else if (currentReaction === "dislike") setDislikes(currentDislikes - 1);
    }

    // Call the API to update the reaction
    try {
      await toggleLike(id, newAction);
    } catch (error) {
      // Revert changes if the API call fails
      setLikeStatus(currentReaction);
      if (currentReaction === "like") setLikes(currentLikes);
      else if (currentReaction === "dislike") setDislikes(currentDislikes);
      else {
        if (newAction === "like") setLikes(currentLikes - 1);
        if (newAction === "dislike") setDislikes(currentDislikes - 1);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleToggle("like")}
        className={`flex items-center gap-1 ${
          likeStatus === "like" ? "text-blue-500" : "text-gray-500"
        }`}
      >
        {likeStatus === "like" ? <AiFillLike /> : <SlLike />} {currentLikes}
      </button>
      <button
        onClick={() => handleToggle("dislike")}
        className={`flex items-center gap-1 ${
          likeStatus === "dislike" ? "text-red-500" : "text-gray-500"
        }`}
      >
        {likeStatus === "dislike" ? <BiSolidDislike /> : <SlDislike />}{" "}
        {currentDislikes}
      </button>
    </div>
  );
};

export default UserReact;
