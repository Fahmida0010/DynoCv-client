import React, { useEffect, useState } from "react";
import { FaBan, FaTrash, FaCheckCircle, FaSpinner } from "react-icons/fa";

interface UserItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "CANDIDATE" | "RECRUITER" | "ADMIN";
  isBlocked: boolean;
}

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/admin/users`;



export const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update User Role
  const handleRoleChange = async (id: string, newRole: UserItem["role"]) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!response.ok) throw new Error("Failed to update role");

      setUsers((prev) =>
        prev.map((user) => (user.id === id ? { ...user, role: newRole } : user))
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Block / Unblock User
  const handleToggleBlock = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    const confirmMsg = `Are you sure you want to ${nextStatus ? "BLOCK" : "UNBLOCK"} this user?`;
    
    if (!window.confirm(confirmMsg)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${id}/block`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: nextStatus }),
      });
      if (!response.ok) throw new Error("Failed to update status");

      setUsers((prev) =>
        prev.map((user) => (user.id === id ? { ...user, isBlocked: nextStatus } : user))
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Delete User
  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently DELETE this user?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete user");

      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <FaSpinner className="spinner-border text-primary" style={{ animation: "spin 1s linear infinite" }} />
        <span className="ms-2">Loading users data...</span>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger role-alert">{error}</div>;
  }

  return (
    <div className="container-fluid px-2 px-md-4 py-3">
      {/* Header Section */}
      <div className="mb-4">
        <h2 className="fw-bold">Manage Users</h2>
        <p className="text-muted">
          Assign roles, remove roles, block, unblock, or delete accounts across the system.
        </p>
      </div>

      {/* Main Container with Full Responsiveness */}
      <div className="card shadow-sm border-0 rounded-3">
        {/* Desktop View (Table) - Visible on md and up */}
        <div className="table-responsive d-none d-md-block">
          <table className="table table-hover align-middle border-0 mb-0">
            <thead className="table-light text-uppercase fs-7">
              <tr>
                <th className="ps-4 py-3">User Info</th>
                <th className="py-3">Current Role</th>
                <th className="py-3">Account Status</th>
                <th className="text-end pe-4 py-3">Administrative Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="ps-4 py-3">
                    <div className="fw-bold text-dark">{`${user.firstName} ${user.lastName}`}</div>
                    <small className="text-muted d-block">{user.email}</small>
                  </td>
                  <td className="py-3">
                    <select
                      className="form-select form-select-sm w-auto bg-light border-secondary-subtle"
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                    >
                      <option value="CANDIDATE">Candidate</option>
                      <option value="RECRUITER">Recruiter</option>
                      <option value="ADMIN">Administrator</option>
                    </select>
                  </td>
                  <td className="py-3">
                    <span className={`badge rounded-pill px-3 py-2 ${user.isBlocked ? "bg-danger-subtle text-danger" : "bg-success-subtle text-success"}`}>
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="text-end pe-4 py-3">
                    <div className="d-flex justify-content-end gap-2">
                      {user.isBlocked ? (
                        <button
                          className="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1"
                          onClick={() => handleToggleBlock(user.id, user.isBlocked)}
                          title="Unblock User"
                        >
                          <FaCheckCircle /> Unblock
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-outline-warning d-inline-flex align-items-center gap-1"
                          onClick={() => handleToggleBlock(user.id, user.isBlocked)}
                          title="Block User"
                        >
                          <FaBan /> Block
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Delete User"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile & Tablet View (Cards Layout) - Visible below md */}
        <div className="d-block d-md-none p-3">
          {users.map((user) => (
            <div key={user.id} className="card mb-3 border-light-subtle shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">{`${user.firstName} ${user.lastName}`}</h6>
                    <small className="text-muted">{user.email}</small>
                  </div>
                  <span className={`badge rounded-pill px-2 py-1 ${user.isBlocked ? "bg-danger-subtle text-danger" : "bg-success-subtle text-success"}`}>
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </div>
                
                <div className="my-3">
                  <label className="form-label small text-muted mb-1">Change Role:</label>
                  <select
                    className="form-select form-select-sm w-100 bg-light"
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                  >
                    <option value="CANDIDATE">Candidate</option>
                    <option value="RECRUITER">Recruiter</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </div>

                <div className="d-flex gap-2 mt-2 w-100">
                  {user.isBlocked ? (
                    <button
                      className="btn btn-sm btn-outline-success flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                      onClick={() => handleToggleBlock(user.id, user.isBlocked)}
                    >
                      <FaCheckCircle /> Unblock
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-outline-warning flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                      onClick={() => handleToggleBlock(user.id, user.isBlocked)}
                    >
                      <FaBan /> Block
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-outline-danger flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};