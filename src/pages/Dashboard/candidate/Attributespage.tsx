import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiossecure';
import Swal from 'sweetalert2'; 

interface AttributeProps {
  id: string;
  attributeId: string; 
  value: string;
  version: number;
  attribute: { 
    label: string;
    type: string; 
  };
}

export const AttributesPage: React.FC = () => {
  const [attributes, setAttributes] = useState<AttributeProps[]>([]);
  const [saveStatus, setSaveStatus] = useState<string>('Saved');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  
  // Modal States
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newLabel, setNewLabel] = useState<string>('');
  const [newType, setNewType] = useState<string>('TEXT');
  const [newValue, setNewValue] = useState<string>('');
  const [modalError, setModalError] = useState<string>('');

  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axiosSecure.get('dashboard/user-attributes')
      .then(res => setAttributes(res.data))
      .catch(err => console.error(err));
  }, []);

  // ইনপুট ফিল্ড চেঞ্জ স্টেট আপডেট করার হ্যান্ডলার
  const handleLocalInputChange = (attributeId: string, val: string) => {
    setAttributes(prev => prev.map(attr => 
      attr.attributeId === attributeId ? { ...attr, value: val } : attr
    ));
    setSaveStatus('Unsaved Changes');
  };

  // ম্যানুয়াল আপডেট সাবমিট হ্যান্ডলার (Update Button Click)
  const handleUpdateAllAttributes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (attributes.length === 0) return;

    setIsUpdating(true);
    setSaveStatus('Saving...');

    try {
      // প্রতিটি অ্যাট্রিবিউট প্রমিজ অ্যারে আকারে ব্যাকএন্ডে পুশ হবে
      const updatePromises = attributes.map(attr =>
        axiosSecure.put('dashboard/user-attributes/sync', {
          attributeId: attr.attributeId,
          value: attr.value,
          version: attr.version
        })
      );

      const responses = await Promise.all(updatePromises);

      // ব্যাকএন্ড থেকে আসা নতুন ভার্সন টোকেন দিয়ে স্টেট আপডেট
      setAttributes(prev => prev.map((attr, index) => ({
        ...attr,
        version: responses[index].data.version
      })));

      setSaveStatus('Saved');

      // 🟢 সফলভাবে আপডেট হওয়ার পর SweetAlert2
      Swal.fire({
        icon: 'success',
        title: 'Updated Successfully!',
        text: 'All your changes have been saved to the database.',
        timer: 2000,
        showConfirmButton: false
      });

    } catch (err: any) {
      if (err.response && err.response.status === 409) {
        setSaveStatus('Conflict detected!');
        Swal.fire({
          icon: 'error',
          title: 'Conflict Detected!',
          text: 'Some sections were updated elsewhere. Please refresh the page and try again.',
          confirmButtonColor: '#d33'
        });
      } else {
        setSaveStatus('Error saving');
        Swal.fire({
          icon: 'error',
          title: 'Save Failed',
          text: 'An error occurred while saving attributes.',
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Modal Form Submit (Create Handler)
  const handleCreateAttribute = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    
    if (!newLabel || !newValue) {
      setModalError('All fields are required.');
      return;
    }

    try {
      const response = await axiosSecure.post('dashboard/user-attributes', {
        label: newLabel,
        type: newType,
        value: newType === 'BOOLEAN' ? String(newValue === 'true') : newValue
      });

      setAttributes(prev => [...prev, response.data]);
      
      setNewLabel('');
      setNewValue('');
      setNewType('TEXT');
      setShowModal(false);

      Swal.fire({
        icon: 'success',
        title: 'Attribute Added!',
        text: 'Your new attribute has been successfully saved to the database.',
        timer: 2500,
        showConfirmButton: false
      });

    } catch (err: any) {
      setModalError(err.response?.data?.message || 'Failed to create attribute.');
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Attributes Library</h2>
        <div>
          <button className="btn btn-primary me-2" onClick={() => setShowModal(true)}>
            + Add Attribute
          </button>
          <span className={`badge ${saveStatus === 'Saved' ? 'bg-success' : 'bg-warning'}`}>{saveStatus}</span>
        </div>
      </div>

      {attributes.length > 0 ? (
        <form onSubmit={handleUpdateAllAttributes}>
          {attributes.map((attr: AttributeProps) => {
            const isBoolean = attr.attribute.type === 'BOOLEAN';
            const isNumber = attr.attribute.type === 'NUMBER';

            return (
              <div className={isBoolean ? "form-check mb-3" : "mb-3"} key={attr.id}>
                {!isBoolean && <label className="form-label fw-semibold">{attr.attribute.label}</label>}
                
                <input 
                  type={isBoolean ? "checkbox" : isNumber ? "number" : "text"} 
                  className={isBoolean ? "form-check-input" : "form-control"} 
                  value={!isBoolean ? attr.value : undefined}
                  checked={isBoolean ? attr.value === 'true' : undefined}
                  onChange={(e) => {
                    const val = isBoolean ? String(e.target.checked) : e.target.value;
                    handleLocalInputChange(attr.attributeId, val);
                  }}
                />

                {isBoolean && <label className="form-check-label fw-semibold ms-2">{attr.attribute.label}</label>}
              </div>
            );
          })}
          
          {/* 🟢 ম্যানুয়াল আপডেট বাটন */}
          <div className="mt-4 shadow-sm p-3 bg-light rounded d-flex justify-content-end">
            <button 
              type="submit" 
              className="btn btn-success px-4 fw-bold" 
              disabled={isUpdating || saveStatus === 'Saved'}
            >
              {isUpdating ? 'Updating...' : 'Update Attributes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center p-5 border rounded bg-light">
          <p className="text-muted">No attributes found in your library. Click "+ Add Attribute" to create one.</p>
        </div>
      )}

      {/* React State Managed Modal Backdrop and Window */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
          <div className="modal fade show d-block" style={{ zIndex: 1050 }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New Attribute</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleCreateAttribute}>
                  <div className="modal-body">
                    {modalError && <div className="alert alert-danger">{modalError}</div>}
                    
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Attribute Label</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. Years of Experience" 
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Data Type</label>
                      <select className="form-select" value={newType} onChange={(e) => {
                        setNewType(e.target.value);
                        setNewValue(''); 
                      }}>
                        <option value="TEXT">Text</option>
                        <option value="NUMBER">Number</option>
                        <option value="BOOLEAN">Boolean (True/False)</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Initial Value</label>
                      {newType === 'BOOLEAN' ? (
                        <select className="form-select" value={newValue} onChange={(e) => setNewValue(e.target.value)}>
                          <option value="">Select Value</option>
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      ) : (
                        <input 
                          type={newType === 'NUMBER' ? "number" : "text"} 
                          className="form-control" 
                          placeholder="Enter current value" 
                          value={newValue}
                          onChange={(e) => setNewValue(e.target.value)}
                        />
                      )}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-success">Save to DB</button>
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