/* eslint-disable */
import { useState, useEffect } from "react";
import { SlDislike, SlLike } from "react-icons/sl";
import { AiFillLike } from "react-icons/ai";
import { BiSolidDislike } from "react-icons/bi";
import { useAuth } from "../Store/AuthStore";
import showToast from "./ShowToast";

const UserReact = ({ id, likes, dislikes, reactions, toggleLike }) => {
  const { user } = useAuth();
  const [likeStatus, setLikeStatus] = useState(null); // 'like', 'dislike', or null
  const [currentLikes, setLikes] = useState(likes || 0);
  const [currentDislikes, setDislikes] = useState(dislikes || 0);

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

  const handleReaction = async (type) => {
    if (!user) {
      // Show the toast and prevent any state changes
      showToast("Oops!", "Only logged-in users can react.", "info");
      return;
    }

    const action = likeStatus === type ? "none" : type;

    try {
      await toggleLike(id, action);

      if (type === "like") {
        if (action === "like") {
          setLikes((prev) => prev + 1);
          if (likeStatus === "dislike") {
            setDislikes((prev) => prev - 1);
          }
        } else if (action === "none") {
          setLikes((prev) => prev - 1);
        }
      } else if (type === "dislike") {
        if (action === "dislike") {
          setDislikes((prev) => prev + 1);
          if (likeStatus === "like") {
            setLikes((prev) => prev - 1);
          }
        } else if (action === "none") {
          setDislikes((prev) => prev - 1);
        }
      }

      setLikeStatus(action);
    } catch (error) {
      console.error("Failed to toggle reaction:", error.message);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => handleReaction("like")}
        className={`flex items-center gap-1 ${
          likeStatus === "like" ? "text-blue-500" : "text-gray-500"
        }`}
      >
        {likeStatus === "like" ? <AiFillLike /> : <SlLike />}
        <span>{currentLikes}</span>
      </button>
      <button
        onClick={() => handleReaction("dislike")}
        className={`flex items-center gap-1 ${
          likeStatus === "dislike" ? "text-red-500" : "text-gray-500"
        }`}
      >
        {likeStatus === "dislike" ? <BiSolidDislike /> : <SlDislike />}
        <span>{currentDislikes}</span>
      </button>
    </div>
  );
};

export default UserReact;
