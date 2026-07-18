import React from "react";
import { FaDatabase, FaPlus, FaTrash, FaEdit } from "react-icons/fa";

interface Attribute {
  id: string;
  name: string;
  type: "Text" | "Number" | "Boolean" | "Dropdown";
  isBuiltIn: boolean; // Me সেকশনের জন্য (যা রিক্রুটাররা ডিলিট করতে পারবে না)
}

export const AttributeLibrary: React.FC = () => {
  const libraryAttributes: Attribute[] = [
    { id: "1", name: "First Name", type: "Text", isBuiltIn: true },
    { id: "2", name: "Personal Photo", type: "Text", isBuiltIn: true },
    { id: "3", name: "IELTS Score", type: "Number", isBuiltIn: false },
    { id: "4", name: "Remote Work Availability", type: "Boolean", isBuiltIn: false },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Reusable Attribute Library</h2>
          <p className="text-muted">Define global attributes that can be reused across all positions and CVs.</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2">
          <FaPlus /> Add New Attribute
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle border">
          <thead className="table-light">
            <tr>
              <th>Attribute Name</th>
              <th>Data Type</th>
              <th>Scope/Engine</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {libraryAttributes.map((attr) => (
              <tr key={attr.id}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <FaDatabase className={attr.isBuiltIn ? "text-danger" : "text-success"} />
                    <span className="fw-semibold">{attr.name}</span>
                  </div>
                </td>
                <td><span className="badge bg-light text-dark border">{attr.type}</span></td>
                <td>
                  {attr.isBuiltIn ? (
                    <span className="badge bg-danger-subtle text-danger border border-danger-subtle">Mandatory (Built-in)</span>
                  ) : (
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle">Custom / Reusable</span>
                  )}
                </td>
                <td className="text-end">
                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-sm btn-outline-primary" disabled={attr.isBuiltIn} title="Edit Attribute">
                      <FaEdit />
                    </button>
                    <button className="btn btn-sm btn-outline-danger" disabled={attr.isBuiltIn} title="Delete Attribute">
                      <FaTrash />
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