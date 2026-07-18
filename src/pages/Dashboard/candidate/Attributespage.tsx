import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

interface AttributeProps {
  id: string;
  value: string;
  version: number;
  attribute: { label: string };
}

export const AttributesPage: React.FC = () => {
  const [attributes, setAttributes] = useState<AttributeProps[]>([]);
  const [saveStatus, setSaveStatus] = useState<string>('Saved');

  useEffect(() => {
    axios.get('/api/dashboard/candidate/attributes')
      .then(res => setAttributes(res.data));
  }, []);

  // Optimistic Locking & Autosave implementation
  const triggerAutosave = useCallback(async (attributeId: string, newValue: string, currentVersion: number) => {
    setSaveStatus('Saving...');
    try {
      const response = await axios.put('/api/dashboard/candidate/attributes/sync', {
        attributeId,
        value: newValue,
        version: currentVersion
      });
      
      // Update new version token received from server response
      setAttributes(prev => prev.map(attr => 
        attr.id === attributeId ? { ...attr, version: response.data.version, value: newValue } : attr
      ));
      setSaveStatus('Saved');
    } catch (err: any) {
      if (err.response && err.response.status === 409) {
        setSaveStatus('Conflict detected! Please refresh.');
        alert('This section was updated elsewhere. Overwriting blocked to prevent data loss.');
      } else {
        setSaveStatus('Error saving');
      }
    }
  }, []);

  // Debouncing setup for preventing saves on every single keystroke (5-10 sec rule)
  const debounce = (func: Function, delay: number) => {
    let timer: any;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handlerChangeDebounced = useCallback(debounce(triggerAutosave, 5000), [triggerAutosave]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>My Attributes Library</h2>
        <span className={`badge ${saveStatus === 'Saved' ? 'bg-success' : 'bg-warning'}`}>{saveStatus}</span>
      </div>
      <form>
        {attributes.map((attr: any) => (
          <div className="mb-3" key={attr.id}>
            <label className="form-label">{attr.attribute.label}</label>
            <input 
              type="text" 
              className="form-control" 
              defaultValue={attr.value} 
              onChange={(e) => handlerChangeDebounced(attr.attributeId, e.target.value, attr.version)}
            />
          </div>
        ))}
      </form>
    </div>
  );
};