import React, { useState, useEffect } from "react";
import { FaDatabase, FaPlus, FaTrash, FaEdit, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

interface Attribute {
  id: string;
  label: string;
  type: string; // TEXT, NUMBER, BOOLEAN
  isBuiltIn: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const AttributeLibrary: React.FC = () => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal States
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [label, setLabel] = useState<string>("");
  const [type, setType] = useState<string>("TEXT");

  // ১. DB থেকে সব ডাটা রিড করা
  const fetchAttributes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/attributes`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setAttributes(data);
      } else if (data && Array.isArray(data.data)) {
        setAttributes(data.data);
      } else {
        setAttributes([]);
      }
    } catch (err) {
      console.error("Error fetching attributes:", err);
      setAttributes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  // Modal ওপেন করার ফাংশন (Add Mode)
  const openAddModal = () => {
    setIsEditMode(false);
    setSelectedId(null);
    setLabel("");
    setType("TEXT");
    setShowModal(true);
  };

  // Modal ওপেন করার ফাংশন (Edit Mode)
  const openEditModal = (attr: Attribute) => {
    setIsEditMode(true);
    setSelectedId(attr.id);
    setLabel(attr.label);
    setType(attr.type);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // সেফটি চেক: স্টেট খালি কিনা
  if (!label || !label.trim()) {
    Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "Attribute Name cannot be empty!",
    });
    return;
  }

  try {
    const url = isEditMode 
      ? `${API_BASE_URL}/api/attributes/${selectedId}` 
      : `${API_BASE_URL}/api/attributes`;
      
    const method = isEditMode ? "PUT" : "POST";

    // 💡 এখানে স্পষ্টভাবে অবজেক্ট তৈরি করা হচ্ছে যা ব্যাকএন্ডের DTO এক্সপেক্ট করে
    const requestBody = isEditMode
      ? { label: label.trim() }
      : { label: label.trim(), type: type, isBuiltIn: false };

    console.log("Sending payload:", requestBody); // আপনার ব্রাউজার কনসোলে ডাটা চেক করার জন্য

    const res = await fetch(url, {
      method: method,
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(requestBody), // অবজেক্টকে JSON স্ট্রিং-এ রূপান্তর
    });

    if (res.ok) {
      setShowModal(false);
      fetchAttributes(); // টেবিল ডাটা রিফ্রেশ করবে
      
      Swal.fire({
        icon: "success",
        title: isEditMode ? "Updated!" : "Created!",
        text: `Attribute has been ${isEditMode ? "updated" : "added"} successfully.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      const errorResponse = await res.json();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorResponse.message || "Something went wrong on the server.",
      });
    }
  } catch (err) {
    console.error("Error saving attribute:", err);
    Swal.fire({
      icon: "error",
      title: "Network Error",
      text: "Could not connect to the server.",
    });
  }
};


  // ৩. DB থেকে ডিলিট করা (SweetAlert2 কনফার্মেশন সহ)
  const handleDeleteAttribute = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/attributes/${id}`, {
            method: "DELETE",
          });

          if (res.ok) {
            setAttributes(attributes.filter((attr) => attr.id !== id));
            Swal.fire("Deleted!", "Your attribute has been deleted.", "success");
          } else {
            Swal.fire("Error!", "Failed to delete the attribute.", "error");
          }
        } catch (err) {
          console.error("Error deleting attribute:", err);
        }
      }
    });
  };

  if (loading) return <div className="p-4 text-center fw-bold">Loading Library...</div>;

  return (
    <div className="container-fluid p-3">
      {/* Header Section */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="mb-1 fw-bold">Reusable Attribute Library</h2>
          <p className="text-muted mb-0">Define global attributes that can be reused across all positions and CVs.</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 shadow-sm" onClick={openAddModal}>
          <FaPlus /> Add New Attribute
        </button>
      </div>

      {/* Responsive Display: Mobile (Cards) & Desktop (Table) */}
      
      {/* 📱 Mobile view (Visible only on small devices) */}
      <div className="d-block d-md-none">
        {attributes.map((attr) => (
          <div key={attr.id} className="card mb-3 shadow-sm border">
            <div className="card-body">
              <div className="d-flex align-items-center gap-2 mb-2">
                <FaDatabase className={attr.isBuiltIn ? "text-danger" : "text-success"} />
                <h5 className="card-title mb-0 fw-semibold">{attr.label}</h5>
              </div>
              <p className="mb-2">
                <strong>Type:</strong> <span className="badge bg-light text-dark border ms-1">{attr.type}</span>
              </p>
              <p className="mb-3">
                <strong>Scope:</strong>{" "}
                {attr.isBuiltIn ? (
                  <span className="badge bg-danger-subtle text-danger border border-danger-subtle ms-1">Mandatory</span>
                ) : (
                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle ms-1">Custom</span>
                )}
              </p>
              <div className="d-flex justify-content-end gap-2 border-top pt-2">
                <button 
                  className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1" 
                  disabled={attr.isBuiltIn}
                  onClick={() => openEditModal(attr)}
                >
                  <FaEdit /> Edit
                </button>
                <button 
                  className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1" 
                  disabled={attr.isBuiltIn}
                  onClick={() => handleDeleteAttribute(attr.id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 💻 Desktop View (Visible on Medium screens and up) */}
      <div className="d-none d-md-block table-responsive shadow-sm rounded border bg-white">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th className="ps-3">Attribute Name</th>
              <th>Data Type</th>
              <th>Scope/Engine</th>
              <th className="text-end pe-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attributes.map((attr) => (
              <tr key={attr.id}>
                <td className="ps-3">
                  <div className="d-flex align-items-center gap-2">
                    <FaDatabase className={attr.isBuiltIn ? "text-danger" : "text-success"} />
                    <span className="fw-semibold">{attr.label}</span>
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
                <td className="text-end pe-3">
                  <div className="d-flex justify-content-end gap-2">
                    <button 
                      className="btn btn-sm btn-outline-primary" 
                      disabled={attr.isBuiltIn} 
                      title="Edit Attribute"
                      onClick={() => openEditModal(attr)}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-danger" 
                      disabled={attr.isBuiltIn} 
                      onClick={() => handleDeleteAttribute(attr.id)}
                      title="Delete Attribute"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📋 Dynamic Add/Edit Bootstrap Modal */}
      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content shadow-lg border-0">
                <div className="modal-header bg-light">
                  <h5 className="modal-title fw-bold">
                    {isEditMode ? "✏️ Edit Attribute" : "➕ Add New Attribute"}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Attribute Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., GitHub URL, Years of Experience"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Data Type</label>
                      <select 
                        className="form-select" 
                        value={type} 
                        onChange={(e) => setType(e.target.value)}
                        disabled={isEditMode} // সেফটির জন্য এডিটের সময় টাইপ লক রাখা ভালো
                      >
                        <option value="TEXT">TEXT (String / Input)</option>
                        <option value="NUMBER">NUMBER (Integer / Float)</option>
                        <option value="BOOLEAN">BOOLEAN (Yes / No Checkbox)</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer bg-light">
                    <button type="button" className="btn btn-secondary d-flex align-items-center gap-1" onClick={() => setShowModal(false)}>
                      <FaTimes /> Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {isEditMode ? "Update Attribute" : "Save Attribute"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};