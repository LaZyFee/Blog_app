/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { IoMdTime } from "react-icons/io";
import { useAuth } from "../../../Store/AuthStore";
import useCommentsStore from "../../../Store/CommentStore";
import { formatDate } from "../../../Utils/formatedate";
import { Link } from "react-router-dom";
import UserReact from "../../../Utils/UserReact";

const COMMENT_LIMIT = 10;
const REPLY_LIMIT = 10;

function CommentSection({ blogId }) {
  const { user } = useAuth();
  const {
    comments, pagination, isLoading, isLoadingMore, error,
    fetchComments, fetchReplies, createComment, toggleLike, addReply, clearError,
  } = useCommentsStore();
  const [commentInput, setCommentInput] = useState("");
  const [replyInput, setReplyInput] = useState({});
  const [expandedReplies, setExpandedReplies] = useState({});
  const [replyPages, setReplyPages] = useState({});
  const [replyErrors, setReplyErrors] = useState({});

  useEffect(() => {
    if (!blogId) return;
    fetchComments(blogId, { page: 1, limit: COMMENT_LIMIT });
    setReplyInput({});
    setExpandedReplies({});
    setReplyPages({});
    setReplyErrors({});
  }, [blogId, fetchComments]);

  const submitComment = async () => {
    const value = commentInput.trim();
    if (!value) return;
    const result = await createComment(blogId, value);
    if (result.success) setCommentInput("");
  };

  const submitReply = async (commentId) => {
    const value = (replyInput[commentId] || "").trim();
    if (!value) return;
    const result = await addReply(blogId, commentId, value);
    if (result.success) setReplyInput((state) => ({ ...state, [commentId]: "" }));
  };

  const loadReplies = async (comment) => {
    const nextPage = (replyPages[comment._id]?.page || 0) + 1;
    const result = await fetchReplies(comment._id, { page: nextPage, limit: REPLY_LIMIT });
    if (!result.success) {
      setReplyErrors((state) => ({ ...state, [comment._id]: result.error }));
      return;
    }
    setReplyErrors((state) => ({ ...state, [comment._id]: null }));
    setReplyPages((state) => ({
      ...state,
      [comment._id]: { page: nextPage, pagination: result.pagination },
    }));
    useCommentsStore.setState((state) => ({
      comments: state.comments.map((item) => item._id === comment._id
        ? { ...item, replies: [...(nextPage === 1 ? [] : item.replies || []), ...result.data] }
        : item),
    }));
    setExpandedReplies((state) => ({ ...state, [comment._id]: true }));
  };

  return (
    <section className="mx-auto mt-8 max-w-4xl p-6" aria-labelledby="comments-title">
      <h2 id="comments-title" className="mb-4 text-2xl font-bold text-primary">Comments</h2>
      {error && <div role="alert" className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-red-700">{error}<button type="button" className="ml-3 underline" onClick={clearError}>Dismiss</button></div>}
      {user ? (
        <div className="flex max-w-2xl items-center gap-3">
          <label htmlFor="new-comment" className="sr-only">Write a comment</label>
          <input id="new-comment" type="text" maxLength={2000} value={commentInput} onChange={(event) => setCommentInput(event.target.value)} placeholder="Write a comment…" className="flex-grow rounded border px-4 py-2" />
          <button type="button" onClick={submitComment} disabled={!commentInput.trim() || commentInput.length > 2000} className="rounded bg-primary px-4 py-2 text-white disabled:opacity-50">Post</button>
        </div>
      ) : <p className="text-center font-bold">Please <Link to="/login" className="text-primary">log in</Link> to comment.</p>}

      {isLoading ? <div role="status" className="mt-8 space-y-3"><div className="skeleton h-20 w-full"/><div className="skeleton h-20 w-full"/></div> : (
        <div className="mt-8">
          {comments.length === 0 ? <p className="text-gray-500">No approved comments yet.</p> : comments.map((comment) => (
            <article key={comment._id} className="mb-6 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <img src={comment.createdBy?.profilepic || ""} alt="" className="h-10 w-10 rounded-full object-cover" />
                <div><p className="font-semibold">{comment.createdBy?.name || "Unknown"}</p><p className="flex items-center gap-1 text-sm text-gray-500"><IoMdTime />{formatDate(comment.createdAt)}</p></div>
              </div>
              <p className="ml-12 mt-2 whitespace-pre-wrap">{comment.comment}</p>
              <div className="ml-12 mt-2 flex items-center gap-3">
                <UserReact id={comment._id} likes={comment.likes || 0} dislikes={comment.disLikes || 0} reactions={comment.reactions || []} toggleLike={(id, action) => toggleLike(id, action, "comment")} />
                {user && <button type="button" className="text-blue-600 hover:underline" onClick={() => setReplyInput((state) => ({ ...state, [comment._id]: state[comment._id] === undefined ? "" : undefined }))}>Reply</button>}
              </div>
              {replyInput[comment._id] !== undefined && <div className="ml-12 mt-3 flex gap-2"><label htmlFor={`reply-${comment._id}`} className="sr-only">Write a reply</label><input id={`reply-${comment._id}`} maxLength={2000} value={replyInput[comment._id]} onChange={(event) => setReplyInput((state) => ({ ...state, [comment._id]: event.target.value }))} placeholder="Write a reply…" className="flex-1 rounded border px-3 py-2"/><button type="button" disabled={!replyInput[comment._id]?.trim()} onClick={() => submitReply(comment._id)} className="rounded bg-primary px-3 py-2 text-white disabled:opacity-50">Post</button></div>}
              {(comment.replies || []).map((reply) => <div key={reply._id} className="ml-12 mt-4 border-l-2 border-blue-500 pl-3"><p className="font-semibold">{reply.createdBy?.name || "Unknown"}</p><p className="whitespace-pre-wrap">{reply.comment}</p><UserReact id={reply._id} likes={reply.likes || 0} dislikes={reply.disLikes || 0} reactions={reply.reactions || []} toggleLike={(id, action) => toggleLike(id, action, "reply", comment._id)} /></div>)}
              {replyErrors[comment._id] && <p role="alert" className="ml-12 mt-2 text-red-600">{replyErrors[comment._id]}</p>}
              {(!expandedReplies[comment._id] || (replyPages[comment._id]?.pagination?.page < replyPages[comment._id]?.pagination?.totalPages)) && <button type="button" className="ml-12 mt-2 text-sm text-blue-600 hover:underline" onClick={() => loadReplies(comment)}>{expandedReplies[comment._id] ? "Load more replies" : "Load replies"}</button>}
            </article>
          ))}
          {pagination.page < pagination.totalPages && <button type="button" disabled={isLoadingMore} onClick={() => fetchComments(blogId, { page: pagination.page + 1, limit: COMMENT_LIMIT, append: true })} className="rounded border px-4 py-2 disabled:opacity-50">{isLoadingMore ? "Loading…" : "Load more comments"}</button>}
        </div>
      )}
    </section>
  );
}

export default CommentSection;
