import React, { useState, useEffect } from "react";
import { FaComments, FaReply, FaThumbsUp, FaUserCircle, FaInbox } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiossecure";
import Swal from "sweetalert2";
import { useAuth } from "../../../context/AuthContext";

interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "RECRUITER" | "CANDIDATE";
  photo?: string;
}

interface DBComment {
  id: string;
  discussionId: string;
  userId: string;
  text: string;
  createdAt: string | Date;
  user: UserInfo;
  _count?: { likes: number };
  likesCount?: number;
  replies?: DBComment[];
}

interface Attribute {
  id: string;
  label: string;
  type: string;
}

interface TemplateFieldData {
  id: string;
  attribute: Attribute;
}

interface PositionData {
  id: string;
  title: string;
  description: string;
  templates: TemplateFieldData[];
}

interface DiscussionApiResponse {
  id: string;
  title: string;
  content: string;
  position: PositionData;
  comments: DBComment[];
}

export const Discussions: React.FC = () => {
  const [searchParams] = useSearchParams();
  const axiosSecure = useAxiosSecure();
  const { user: currentUser } = useAuth(); 
  
  const discussionId = searchParams.get("id");

  const [positionInfo, setPositionInfo] = useState<PositionData | null>(null);
  const [comments, setComments] = useState<DBComment[]>([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [activeReplyBox, setActiveReplyBox] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/comments`;
  const DISCUSSION_API_URL = `${import.meta.env.VITE_API_URL}/api/discussions`; // ব্যাকএন্ডের ডিসকাশন এন্ডপয়েন্ট

  // ১. ব্যাকএন্ড থেকে ডিসকাশন ডিটেইলস (পজিশন + অ্যাট্রিবিউটস) এবং কমেন্ট লোড করা
  useEffect(() => {
    if (!discussionId) {
      setLoading(false);
      return;
    }

    const fetchDiscussionData = async () => {
      try {
        setLoading(true);
        
        // ব্যাকএন্ডের এই একটি এন্ডপয়েন্ট থেকেই পজিশন এবং কমেন্ট ডেটা চলে আসবে
        const response = await axiosSecure.get<DiscussionApiResponse>(`${DISCUSSION_API_URL}/${discussionId}`);
        
        // পজিশন এবং সিলেক্টেড টেমপ্লেট ফিল্ডস সেট করা
        if (response.data.position) {
          setPositionInfo(response.data.position);
        }

        // কমেন্টস এবং লাইক কাউন্ট ফরম্যাট করা
        const rawComments = response.data.comments || [];
        const formattedComments = rawComments.map((c) => ({
          ...c,
          likesCount: c._count?.likes || 0,
          replies: (c.replies || []).map((r) => ({
            ...r,
            likesCount: r._count?.likes || 0,
          })),
        }));

        setComments(formattedComments);
      } catch (error) {
        console.error("Error loading discussion data:", error);
        Swal.fire("Error!", "Failed to load discussions thread.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussionData();
  }, [discussionId]);

  // ২. নতুন কমেন্ট পোস্ট করার API কল
  const handlePostComment = async () => {
    if (!newCommentText.trim() || !discussionId || !currentUser) return;

    try {
      const response = await axiosSecure.post<DBComment>(API_BASE_URL, {
        discussionId,
        text: newCommentText,
      });

      const savedComment = {
        ...response.data,
        user: response.data.user || (currentUser as UserInfo),
        likesCount: 0,
        replies: [],
      };

      setComments([savedComment, ...comments]);
      setNewCommentText("");
      Swal.fire({ icon: "success", title: "Comment Posted", timer: 1000, showConfirmButton: false });
    } catch (error) {
      console.error("Error posting comment:", error);
      Swal.fire("Error!", "Failed to post comment.", "error");
    }
  };

  // ৩. কমেন্ট/রিপ্লাইতে লাইক টগল করার API কল
  const handleLike = async (commentId: string, isReply = false, parentId?: string) => {
    try {
      const response = await axiosSecure.post<{ liked: boolean }>(`${API_BASE_URL}/${commentId}/like`);
      const { liked } = response.data;

      if (!isReply) {
        setComments(
          comments.map((c) =>
            c.id === commentId
              ? { ...c, likesCount: (c.likesCount || 0) + (liked ? 1 : -1) }
              : c
          )
        );
      } else {
        setComments(
          comments.map((c) => {
            if (c.id === parentId) {
              return {
                ...c,
                replies: c.replies?.map((r) =>
                  r.id === commentId
                    ? { ...r, likesCount: (r.likesCount || 0) + (liked ? 1 : -1) }
                    : r
                ),
              };
            }
            return c;
          })
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  // ৪. কমেন্টের আন্ডারে রিপ্লাই দেওয়ার API কল
  const handlePostReply = async (commentId: string) => {
    if (!replyText.trim() || !discussionId || !currentUser) return;

    try {
      const response = await axiosSecure.post<DBComment>(API_BASE_URL, {
        discussionId,
        text: replyText,
        parentId: commentId,
      });

      const savedReply = {
        ...response.data,
        user: response.data.user || (currentUser as UserInfo),
        likesCount: 0,
      };

      setComments(
        comments.map((c) => {
          if (c.id === commentId) {
            return {
              ...c,
              replies: [...(c.replies || []), savedReply],
            };
          }
          return c;
        })
      );

      setReplyText("");
      setActiveReplyBox(null);
    } catch (error) {
      console.error("Error posting reply:", error);
      Swal.fire("Error!", "Failed to post reply.", "error");
    }
  };

  const formatTime = (dateInput: string | Date) => {
    const date = new Date(dateInput);
    return (
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
      " - " +
      date.toLocaleDateString()
    );
  };

  if (!discussionId) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm border-0 p-5 bg-white rounded-3">
          <FaInbox className="text-muted display-1 mb-3" />
          <h4 className="fw-bold text-secondary">No Discussion Selected</h4>
          <p className="text-muted max-w-md mx-auto">
            Please navigate to the <strong>Manage Positions</strong> page and click on the discussion icon of a specific position to view or participate in Q&A.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-5"><h5>Loading discussions thread...</h5></div>;
  }

  return (
    <div className="container py-4 px-2 px-md-3">
      
      {/* dynamically fetched position and attributes view */}
      {positionInfo && (
        <div className="card mb-4 shadow-sm border-0 rounded-3 bg-white border-start border-4 border-primary">
          <div className="card-body p-4">
            <span className="badge bg-primary-subtle text-primary mb-2 px-3 py-1.5 rounded-pill fw-bold">Active Discussion Target</span>
            <h3 className="fw-bold text-dark mb-2">{positionInfo.title}</h3>
            <p className="text-secondary mb-3" style={{ whiteSpace: "pre-line", fontSize: "15px" }}>
              {positionInfo.description}
            </p>

            <div className="border-top pt-3 mt-2">
              <h6 className="fw-bold text-muted mb-2 text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                Required CV Attributes
              </h6>
              <div className="d-flex flex-wrap gap-2">
                {positionInfo.templates && positionInfo.templates.length > 0 ? (
                  positionInfo.templates.map((t) => (
                    <span key={t.id} className="badge bg-light text-dark border px-3 py-2 rounded-pill shadow-sm">
                      <span className="fw-semibold text-primary">{t.attribute.label}</span> 
                      <small className="text-muted ms-1" style={{ fontSize: '10px' }}>({t.attribute.type})</small>
                    </span>
                  ))
                ) : (
                  <span className="text-muted small">No specific attributes mapped to this position.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* নতুন কমেন্ট লেখার বক্স */}
      <div className="card mb-4 shadow-sm border-0 rounded-3">
        <div className="card-body p-3 p-md-4 bg-white rounded-3">
          <label className="form-label fw-semibold text-dark">
            Join the discussion as <span className="text-primary fw-bold">{currentUser?.firstName} {currentUser?.lastName}</span>
          </label>
          <textarea
            className="form-control mb-3"
            rows={3}
            placeholder="Write a comment or feedback about this position..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
          ></textarea>
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm"
              onClick={handlePostComment}
              disabled={!currentUser}
            >
              <FaComments /> Post Comment
            </button>
          </div>
        </div>
      </div>

      {/* কমেন্টের থ্রেড লিস্ট */}
      <div className="d-flex flex-column gap-3">
        {comments.length === 0 ? (
          <div className="text-center text-muted py-5 border rounded bg-white">
            No comments yet. Be the first to start the conversation!
          </div>
        ) : (
          comments.map((comment) => (
            <div className="card border-0 bg-light shadow-sm rounded-3" key={comment.id}>
              <div className="card-body p-3 p-md-4">
                <div className="d-flex justify-content-between align-items-start align-items-md-center mb-3">
                  <div className="d-flex align-items-center gap-2">
                    {comment.user?.photo ? (
                      <img src={comment.user.photo} alt="Avatar" className="rounded-circle" style={{ width: '32px', height: '32px', objectFit: 'cover' }} />
                    ) : (
                      <FaUserCircle className="fs-3 text-secondary" />
                    )}
                    <div>
                      <h6 className="mb-0 fw-bold text-dark">
                        {comment.user?.firstName} {comment.user?.lastName}
                      </h6>
                      <span className="badge bg-secondary-subtle text-secondary-emphasis" style={{ fontSize: "10px" }}>
                        {comment.user?.role}
                      </span>
                    </div>
                  </div>
                  <small className="text-muted small">{formatTime(comment.createdAt)}</small>
                </div>

                <p className="card-text text-dark ps-1 mb-2" style={{ whiteSpace: "pre-line" }}>{comment.text}</p>

                <div className="d-flex gap-4 mt-2 border-top pt-2">
                  <button
                    className="btn btn-sm btn-link text-decoration-none text-muted d-flex align-items-center gap-1 p-0 fw-semibold"
                    onClick={() => handleLike(comment.id, false)}
                  >
                    <FaThumbsUp className="text-primary" /> {comment.likesCount} Likes
                  </button>
                  <button
                    className="btn btn-sm btn-link text-decoration-none text-muted d-flex align-items-center gap-1 p-0 fw-semibold"
                    onClick={() => setActiveReplyBox(activeReplyBox === comment.id ? null : comment.id)}
                  >
                    <FaReply /> Reply
                  </button>
                </div>

                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3 ps-3 border-start border-2 border-secondary-subtle d-flex flex-column gap-2">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="bg-white p-3 rounded-3 shadow-sm border border-light-subtle">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            <strong className="text-dark" style={{ fontSize: "13px" }}>
                              {reply.user?.firstName} {reply.user?.lastName}
                            </strong>
                            <span className="badge bg-light text-muted border ms-2" style={{ fontSize: "9px" }}>
                              {reply.user?.role}
                            </span>
                          </div>
                          <small className="text-muted" style={{ fontSize: "11px" }}>
                            {formatTime(reply.createdAt)}
                          </small>
                        </div>
                        <p className="mb-2 text-secondary" style={{ fontSize: "14px", whiteSpace: "pre-line" }}>{reply.text}</p>
                        
                        <div>
                          <button
                            className="btn btn-sm btn-link text-decoration-none text-muted d-flex align-items-center gap-1 p-0"
                            style={{ fontSize: "12px" }}
                            onClick={() => handleLike(reply.id, true, comment.id)}
                          >
                            <FaThumbsUp className="text-primary" style={{ fontSize: "11px" }} /> {reply.likesCount} Likes
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeReplyBox === comment.id && (
                  <div className="mt-3 d-flex gap-2 bg-white p-2 rounded border shadow-sm">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <button
                      className="btn btn-sm btn-primary px-3"
                      onClick={() => handlePostReply(comment.id)}
                    >
                      Reply
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};