import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import Swal from 'sweetalert2'; 
import useAxiosSecure from '../../../hooks/useAxiossecure';

// Project Interface based on schema
interface Project {
  id: string;
  name: string;
  startDate: string;
  endDate?: string | null;
  description: string;
  tags: string[];
}

interface ProjectFormInput {
  name: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const { register, handleSubmit, reset } = useForm<ProjectFormInput>();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axiosSecure.get('/api/dashboard/candidate/projects');
      if (Array.isArray(res.data)) {
        setProjects(res.data);
      } else if (res.data && Array.isArray(res.data.projects)) {
        setProjects(res.data.projects);
      } else {
        console.error('Unexpected response format:', res.data);
        setProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    }
  };

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const onSubmit = async (data: ProjectFormInput) => {
    try {
      setIsSubmitting(true);
      const payload = {
        ...data,
        tags,
        endDate: data.endDate ? data.endDate : null, 
      };
      
      await axiosSecure.post('/api/dashboard/candidate/projects', payload);
      
      
      Swal.fire({
        title: 'Success!',
        text: 'Your project has been saved and published successfully.',
        icon: 'success',
        confirmButtonColor: '#198754', 
        timer: 2000
      });

      reset();
      setTags([]);
      await fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong while saving the project.',
        icon: 'error',
        confirmButtonColor: '#dc3545'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatProjectDuration = (startDateStr: string, endDateStr?: string | null) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' };
    const start = new Date(startDateStr).toLocaleDateString('en-US', options);
    const end = endDateStr ? new Date(endDateStr).toLocaleDateString('en-US', options) : 'Present';
    return `${start} - ${end}`;
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-2">
        <h2 className="text-primary fw-bold mb-0">Manage Showcase Projects</h2>
        <span className="badge bg-secondary px-3 py-2 rounded-pill ">Total: {projects.length}</span>
      </div>

      <div className="row g-4">
      
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 bg-white p-4 sticky-top" style={{ top: '20px', zIndex: 10 }}>
            <h4 className="fw-semibold text-secondary mb-3">Add New Project</h4>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label fw-medium text-muted">Project Name</label>
                <input 
                  {...register('name')} 
                  className="form-control form-control-lg border-2" 
                  placeholder="e.g., DynoCV Platform"
                  disabled={isSubmitting}
                  required 
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label fw-medium text-muted">Start Date</label>
                  <input type="date" {...register('startDate')} className="form-control border-2" disabled={isSubmitting} required />
                </div>
                <div className="col-6">
                  <label className="form-label fw-medium text-muted ">End Date</label>
                  <input type="date" {...register('endDate')} className="form-control border-2" disabled={isSubmitting} />
                </div>
              </div>

              <div className="mb-3 ">
                <label className="form-label  fw-medium text-muted">Description (Markdown Supported)</label>
                <textarea 
                  {...register('description')} 
                  className="form-control border-2" 
                  rows={5} 
                  placeholder="Describe your role, core features, architecture details..."
                  disabled={isSubmitting}
                  required 
                />
              </div>
              
              <div className="mb-4">
                <label className="form-label fw-medium text-muted">Technology Stack Tags</label>
                <div className="d-flex mb-2">
                  <input 
                    type="text" 
                    className="form-control border-2 me-2" 
                    value={tagInput} 
                    onChange={(e) => setTagInput(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Press enter or click add..."
                    disabled={isSubmitting}
                  />
                  <button type="button" className="btn btn-dark px-3" onClick={addTag} disabled={isSubmitting}>Add</button>
                </div>
                <div className="d-flex flex-wrap gap-1 pt-1">
                  {tags.length === 0 && <span className="text-muted small fs-7">No tags added yet.</span>}
                  {tags.map((t, idx) => (
                    <span key={idx} className="badge bg-primary d-flex align-items-center gap-1 py-2 px-2 rounded-2">
                      {t}
                      <button 
                        type="button" 
                        className="btn-close btn-close-white fs-7" 
                        style={{ padding: '2px', fontSize: '0.65rem' }}
                        onClick={() => removeTag(idx)}
                        disabled={isSubmitting}
                      ></button>
                    </span>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-success btn-lg w-100 shadow-sm fw-bold d-flex align-items-center justify-content-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Publishing...
                  </>
                ) : (
                  'Save & Publish Project'
                )}
              </button>
            </form>
          </div>
        </div>

      
        <div className="col-lg-7">
          <h4 className="fw-semibold text-secondary mb-3">Project History & Portfolio</h4>
          
          {projects.length === 0 ? (
            <div className="card text-center p-5 shadow-sm border-0 border-top border-3 border-warning bg-white">
              <div className="card-body">
                <p className="text-muted mb-0 fs-5">No projects found. Use the creation form to add your first architecture masterpiece!</p>
              </div>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {projects.map((p) => (
                <div className="card shadow-sm border-0 bg-white border-start border-4 border-primary p-4 transition-hover" key={p.id}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h4 className="fw-bold text-dark mb-0">{p.name}</h4>
                  </div>
                  
                  {/* Project Duration */}
                  <div className="mb-3">
                    <span className="text-uppercase fw-bold text-muted small tracking-wider me-2">Project Duration:</span>
                    <span className="badge bg-light text-dark border py-1.5 px-2.5 fw-semibold">
                      {formatProjectDuration(p.startDate, p.endDate)}
                    </span>
                  </div>

                  {/* Markdown Renderer Section */}
                  <div className="markdown-content text-secondary mb-3 text-break custom-markdown-styles">
                    <ReactMarkdown>{p.description}</ReactMarkdown>
                  </div>

                  {/* Tags mapping */}
                  <div className="d-flex flex-wrap gap-1 border-top pt-3">
                    {p.tags && Array.isArray(p.tags) && p.tags.map((t) => (
                      <span key={t} className="badge bg-light text-secondary border border-secondary-subtle px-2.5 py-1.5 rounded-1 fw-medium">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};