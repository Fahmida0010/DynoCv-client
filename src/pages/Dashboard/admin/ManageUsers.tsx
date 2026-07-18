import React from "react";
import { FaUsers, FaUserShield, FaBan, FaTrash, FaCheckCircle } from "react-icons/fa";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "CANDIDATE" | "RECRUITER" | "ADMIN";
  status: "Active" | "Blocked";
}

export const ManageUsers: React.FC = () => {
  const usersList: UserItem[] = [
    { id: "usr-1", name: "Fahmida Akter", email: "fahmida@example.com", role: "ADMIN", status: "Active" },
    { id: "usr-2", name: "Rahat Karim", email: "rahat@example.com", role: "RECRUITER", status: "Active" },
    { id: "usr-3", name: "Anik Ahmed", email: "anik@example.com", role: "CANDIDATE", status: "Blocked" },
  ];

  return (
    <div>
      <div className="mb-4">
        <h2>Manage Users</h2>
        <p className="text-muted">Assign roles, remove roles, block, unblock, or delete accounts across the system.</p>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle border">
          <thead className="table-light">
            <tr>
              <th>User Info</th>
              <th>Current Role</th>
              <th>Account Status</th>
              <th className="text-end">Administrative Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="fw-bold">{user.name}</div>
                  <small className="text-muted">{user.email}</small>
                </td>
                <td>
                  <select className="form-select form-select-sm w-auto" defaultValue={user.role}>
                    <option value="CANDIDATE">Candidate</option>
                    <option value="RECRUITER">Recruiter</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </td>
                <td>
                  <span className={`badge ${user.status === "Active" ? "bg-success" : "bg-danger"}`}>
                    {user.status}
                  </span>
                </td>
                <td className="text-end">
                  <div className="d-flex justify-content-end gap-2">
                    {user.status === "Active" ? (
                      <button className="btn btn-sm btn-outline-warning" title="Block User">
                        <FaBan /> Block
                      </button>
                    ) : (
                      <button className="btn btn-sm btn-outline-success" title="Unblock User">
                        <FaCheckCircle /> Unblock
                      </button>
                    )}
                    <button className="btn btn-sm btn-outline-danger" title="Delete User">
                      <FaTrash /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};