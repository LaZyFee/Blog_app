/* eslint-disable */
import { useEffect, useState } from "react";
import { SlDislike, SlLike } from "react-icons/sl";
import { AiFillLike } from "react-icons/ai";
import { BiSolidDislike } from "react-icons/bi";
import { useAuth } from "../Store/AuthStore";
import showToast from "./ShowToast";

const getReaction = (reactions, userId) => {
  const reaction = (Array.isArray(reactions) ? reactions : []).find((item) => (item.user?._id || item.user)?.toString() === userId?.toString());
  return reaction?.type || null;
};

const UserReact = ({ id, likes = 0, dislikes = 0, reactions = [], toggleLike }) => {
  const { user } = useAuth();
  const [likeStatus, setLikeStatus] = useState(null);
  const [currentLikes, setLikes] = useState(Number(likes) || 0);
  const [currentDislikes, setDislikes] = useState(Number(dislikes) || 0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLikes(Number(likes) || 0);
    setDislikes(Number(dislikes) || 0);
    setLikeStatus(getReaction(reactions, user?._id));
  }, [id, likes, dislikes, reactions, user?._id]);

  const handleReaction = async (type) => {
    if (!user) return showToast("Oops!", "Only logged-in users can react.", "info");
    if (submitting) return;
    const action = likeStatus === type ? "none" : type;
    setSubmitting(true);
    try {
      const result = await toggleLike(id, action);
      if (!result?.success) return;
      const updated = result.data;
      setLikes(Number(updated.likes) || 0);
      setDislikes(Number(updated.dislikes) || 0);
      setLikeStatus(updated.userReaction || null);
    } finally {
      setSubmitting(false);
    }
  };

  return <div className="flex items-center gap-4"><button type="button" disabled={submitting} aria-pressed={likeStatus === "like"} onClick={() => handleReaction("like")} className={`flex items-center gap-1 disabled:opacity-50 ${likeStatus === "like" ? "text-blue-500" : "text-gray-500"}`}>{likeStatus === "like" ? <AiFillLike /> : <SlLike />}<span>{currentLikes}</span></button><button type="button" disabled={submitting} aria-pressed={likeStatus === "dislike"} onClick={() => handleReaction("dislike")} className={`flex items-center gap-1 disabled:opacity-50 ${likeStatus === "dislike" ? "text-red-500" : "text-gray-500"}`}>{likeStatus === "dislike" ? <BiSolidDislike /> : <SlDislike />}<span>{currentDislikes}</span></button></div>;
};

export default UserReact;
