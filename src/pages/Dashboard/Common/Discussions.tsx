import React from "react";
import { FaComments, FaReply, FaThumbsUp, FaUserCircle } from "react-icons/fa";

interface Comment {
  id: string;
  author: string;
  role: string;
  content: string;
  timestamp: string;
  likes: number;
}

export const Discussions: React.FC = () => {
  const comments: Comment[] = [
    {
      id: "c-1",
      author: "Alex Mercer",
      role: "Recruiter",
      content: "Please make sure to mention your Docker orchestration experience in the project section.",
      timestamp: "2 hours ago",
      likes: 4,
    },
    {
      id: "c-2",
      author: "Fahmida Akter",
      role: "Candidate",
      content: "Can we add customized technical tags in the project description area?",
      timestamp: "1 hour ago",
      likes: 1,
    }
  ];

  return (
    <div>
      <div className="mb-4">
        <h2>Discussions</h2>
        <p className="text-muted">Collaborate, ask questions, or provide feedback on specific CV templates.</p>
      </div>

      {/* New Comment Input Box */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <label className="form-label fw-semibold">Join the discussion</label>
          <textarea className="form-control mb-3" rows={3} placeholder="Write a comment or feedback..."></textarea>
          <div className="d-flex justify-content-end">
            <button className="btn btn-primary d-flex align-items-center gap-2">
              <FaComments /> Post Comment
            </button>
          </div>
        </div>
      </div>

      {/* Comments List Thread */}
      <div className="d-flex flex-column gap-3">
        {comments.map((comment) => (
          <div className="card border-0 bg-light shadow-sm" key={comment.id}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center gap-2">
                  <FaUserCircle className="fs-4 text-secondary" />
                  <div>
                    <h6 className="mb-0 fw-bold">{comment.author}</h6>
                    <small className="badge bg-secondary-subtle text-secondary-emphasis" style={{ fontSize: "10px" }}>
                      {comment.role}
                    </small>
                  </div>
                </div>
                <small className="text-muted">{comment.timestamp}</small>
              </div>

              <p className="card-text text-dark ps-1">{comment.content}</p>

              <div className="d-flex gap-3 mt-2 border-top pt-2">
                <button className="btn btn-sm btn-link text-decoration-none text-muted d-flex align-items-center gap-1 p-0">
                  <FaThumbsUp className="text-primary" /> {comment.likes} Likes
                </button>
                <button className="btn btn-sm btn-link text-decoration-none text-muted d-flex align-items-center gap-1 p-0">
                  <FaReply /> Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};