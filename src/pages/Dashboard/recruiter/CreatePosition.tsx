import React, { useState, useEffect } from "react";
import { FaSave, FaArrowLeft, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


interface Attribute {
  id: string;
  label: string;
  type: string;
  isBuiltIn: boolean;
}

export const CreatePosition: React.FC = () => {
  const navigate = useNavigate();

  // স্টেট ম্যানেজমেন্ট
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [availableAttributes, setAvailableAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(false);

  // Database-এর AttributeLibrary থেকে ডাইনামিকালি ডাটা ফেচ করা
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        // আপনার ব্যাকএন্ড API এন্ডপয়েন্ট অনুযায়ী ইউআরএল পরিবর্তন করে নিবেন
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/attributes`);
      
        if (response.ok) {
          const data = await response.json();
          setAvailableAttributes(data);
        } else {
          console.error("Failed to fetch attributes from database");
        }
      } catch (error) {
        console.error("Error fetching attributes:", error);
      }
    };

    fetchAttributes();
  }, []);

  // চেকবক্স হ্যান্ডলার
  const handleAttributeChange = (attrId: string) => {
    setSelectedAttributes((prev) =>
      prev.includes(attrId) ? prev.filter((id) => id !== attrId) : [...prev, attrId]
    );
  };
 

  const handleSavePosition = async () => {
    // ভ্যালিডেশন চেক
    if (!title.trim() || !description.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please fill in both Position Title and Job Description.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    // ব্যাকএন্ডে পাঠানোর জন্য ডাইনামিক পেলোড
    const payload = {
      title: title.trim(),
      description: description.trim(),
      attributeIds: selectedAttributes, 
    };

    try {
      setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/positions`,   {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const resData = await response.json();
        
        // সফল হলে SweetAlert2 সাকসেস মেসেজ
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Position and CV Template created successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
        
      
        const newDiscussionId = resData?.discussions?.[0]?.id;
        
        setTimeout(() => {
          if (newDiscussionId) {
            navigate(`/dashboard/discussions?id=${newDiscussionId}`);
          } else {
            navigate("/dashboard/positions");
          }
        }, 2000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: errorData.message || "Failed to create position. Please try again.",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      console.error("Error creating position:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong! Server might be offline.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      {/* Top Header Section */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <button 
          className="btn btn-light border btn-sm d-flex align-items-center gap-1" 
          onClick={() => navigate("/dashboard/positions")}
        >
          <FaArrowLeft /> Back
        </button>
        <h2 className="mb-0 fw-bold text-secondary">Create New Position</h2>
      </div>

      <div className="row">
        {/* Left Side: Position Details */}
        <div className="col-lg-7 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white fw-bold">
              Position Details
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">Position Title</label>
                <input 
                  type="text" 
                  className="form-control form-control-lg" 
                  placeholder="e.g., Senior Node.js Developer" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Job Description</label>
                <textarea 
                  className="form-control" 
                  rows={6} 
                  placeholder="Write position requirements and responsibilities..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: CV Template Configuration */}
        <div className="col-lg-5 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-dark text-white fw-bold">
              Configure CV Template
            </div>
            <div className="card-body">
              <p className="text-muted small">
                Select which attributes from the <strong>Attribute Library</strong> are required for this position's CV template.
              </p>
              
              {/* Dynamic Attribute Selection List */}
              <div className="list-group mb-4" style={{ maxHeight: "300px", overflowY: "auto" }}>
                {availableAttributes.length === 0 ? (
                  <div className="text-center text-muted py-3">No attributes found in library.</div>
                ) : (
                  availableAttributes.map((attr) => (
                    <label className="list-group-item d-flex gap-3 align-items-center" key={attr.id}>
                      <input 
                        className="form-check-input flex-shrink-0" 
                        type="checkbox" 
                        checked={selectedAttributes.includes(attr.id)}
                        onChange={() => handleAttributeChange(attr.id)}
                        style={{ width: "1.2em", height: "1.2em" }}
                      />
                      <div>
                        <strong className="d-block text-dark">{attr.label}</strong>
                        <span className="badge bg-light text-secondary border mt-1">
                          Type: {attr.type}
                        </span>
                        {attr.isBuiltIn && (
                          <span className="badge bg-info text-white ms-2">Built-in</span>
                        )}
                      </div>
                    </label>
                  ))
                )}
              </div>

              <button className="btn btn-outline-secondary btn-sm w-100 mb-3 d-flex align-items-center justify-content-center gap-2">
                <FaPlus /> Create Custom Attribute
              </button>

              <button 
                className="btn btn-success w-100 btn-lg d-flex align-items-center justify-content-center gap-2"
                onClick={handleSavePosition}
                disabled={loading}
              >
                <FaSave /> {loading ? "Saving Position..." : "Save Position & Template"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};