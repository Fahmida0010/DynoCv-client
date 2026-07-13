import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown'; // For Markdown overview integration

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    axios.get('/api/dashboard/candidate/projects').then(res => setProjects(res.data));
  };

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const onSubmit = async (data: any) => {
    const payload = { ...data, tags };
    await axios.post('/api/dashboard/candidate/projects', payload);
    reset();
    setTags([]);
    fetchProjects();
  };

  return (
    <div className="container mt-4">
      <h2>Manage Projects</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="card p-3 bg-light mb-4">
        <div className="mb-3">
          <label>Project Name</label>
          <input {...register('name')} className="form-control" required />
        </div>
        <div className="row mb-3">
          <div className="col"><label>Start Date</label><input type="date" {...register('startDate')} className="form-control"/></div>
          <div className="col"><label>End Date</label><input type="date" {...register('endDate')} className="form-control"/></div>
        </div>
        <div className="mb-3">
          <label>Description (Markdown supported)</label>
          <textarea {...register('description')} className="form-control" rows={4} />
        </div>
        
        {/* Simple Auto-complete / Clean UI Custom tags Component view block */}
        <div className="mb-3">
          <label>Technology Tags</label>
          <div className="d-flex mb-2">
            <input type="text" className="form-control me-2" value={tagInput} onChange={(e)=>setTagInput(e.target.value)} placeholder="React, Node etc..."/>
            <button type="button" className="btn btn-secondary" onClick={addTag}>Add</button>
          </div>
          <div>
            {tags.map(t => <span key={t} className="badge bg-primary me-1">{t}</span>)}
          </div>
        </div>
        <button type="submit" className="btn btn-success">Save Project</button>
      </form>

      <h3>Project History</h3>
      {projects.map((p: any) => (
        <div className="card p-3 mb-2" key={p.id}>
          <h4>{p.name}</h4>
          <ReactMarkdown>{p.description}</ReactMarkdown>
          <div>{p.tags.map((t:string) => <span key={t} className="badge bg-secondary me-1">{t}</span>)}</div>
        </div>
      ))}
    </div>
  );
};