import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

// ১. আপনার Prisma Schema অনুযায়ী টাইপ ডিক্লেয়ারেশন
interface Profile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  location: string | null;
  photoUrl: string | null;
  version: number;
}

// React Hook Form-এর জন্য ইন্টারফেস (ফর্ম ইনপুট সবসময় স্ট্রিং নেয়)
interface ProfileFormData {
  firstName: string;
  lastName: string;
  location: string;
  photoUrl: string;
}

const Profile: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [saveStatus, setSaveStatus] = useState<string>('Saved');
  
  // সম্পূর্ণ প্রোফাইল অবজেক্ট স্টেট
  const [profile, setProfile] = useState<Profile | null>(null);

  const { register, watch, handleSubmit, reset } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      location: '',
      photoUrl: '',
    }
  });

  // URL থেকে সোশ্যাল লগইনের টোকেন হ্যান্ডেল করা
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
    }
    // এখানে ব্যাকেন্ড থেকে এক্সিসটিং প্রোফাইল ডেটা ফেচ করার ফাংশন কল করতে পারেন
    fetchCurrentProfile();
  }, [searchParams]);

  // ব্যাকেন্ড থেকে কারেন্ট প্রোফাইল ডেটা লোড করা
  const fetchCurrentProfile = async () => {
    try {
      const response = await axios.get('/api/auth/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data: Profile = response.data;
      setProfile(data);
      
      // ফর্মে ডেটা পোপুলেট করা (null থাকলে খালি স্ট্রিং বসবে)
      reset({
        firstName: data.firstName,
        lastName: data.lastName,
        location: data.location || '',
        photoUrl: data.photoUrl || '',
      });
    } catch (error) {
      setSaveStatus('Failed to load profile data');
    }
  };

  // ফর্মের সব চেঞ্জ ট্র্যাকিং করার জন্য ওয়াচ করা
  const watchedFields = watch();
  const isFirstRender = useRef(true);

  // ২. AUTO-SAVE MECHANISM (টাইপিং থামানোর ৫ সেকেন্ড পর সেভ হবে)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!profile) return;

    setSaveStatus('Changes detected...');
    
    const delayDebounceFn = setTimeout(() => {
      autoSaveProfile(watchedFields);
    }, 5000);

    return () => clearTimeout(delayDebounceFn);
  }, [watchedFields]);

  // ৩. OPTIMISTIC LOCKING সহ AUTO-SAVE FUNCTION
  const autoSaveProfile = async (data: ProfileFormData) => {
    if (!profile) return;
    
    setSaveStatus('Auto-saving...');
    try {
      // স্কিমা অনুযায়ী রিকোয়েস্ট বডি সাজানো
      const response = await axios.post('/api/auth/profile/auto-save', {
        id: profile.id,         // Profile UUID
        userId: profile.userId, // User Relation ID
        firstName: data.firstName,
        lastName: data.lastName,
        location: data.location || null, // খালি থাকলে null পাঠানো হচ্ছে স্কিমা মিলানোর জন্য
        photoUrl: data.photoUrl || null, // খালি থাকলে null পাঠানো হচ্ছে
        version: profile.version         // বর্তমান ভার্সন (Optimistic Locking)
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      // ব্যাকেন্ড সাকসেসফুলি সেভ করে নতুন ভার্সন সহ পুরো প্রোফাইল রিটার্ন করবে
      const updatedProfile: Profile = response.data;
      setProfile(updatedProfile);
      setSaveStatus('Saved');
    } catch (error: any) {
      // ৪. ভার্সন কনফ্লিক্ট হ্যান্ডেলিং (409 Conflict)
      if (error.response?.status === 409) {
        setSaveStatus('Conflict! This profile was updated elsewhere. Please refresh.');
        alert('Optimistic Locking Error: Version mismatch. Please reload the page to get the latest data.');
      } else {
        setSaveStatus('Failed to auto-save');
      }
    }
  };

  return (
    <div className="container py-5">
      {/* Upper Status Bar */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h2>Personal Profile Dashboard (Me)</h2>
        {profile && (
          <span className={`badge ${saveStatus === 'Saved' ? 'bg-success' : 'bg-warning text-dark'}`}>
            {saveStatus} (Database Version: {profile.version})
          </span>
        )}
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <form onSubmit={handleSubmit(autoSaveProfile)}>
            
            {/* PRISMA SCHEMA BASED FORM CARD */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-light fw-bold text-secondary">
                Profile Built-in Attributes
              </div>
              <div className="card-body">
                <div className="row g-3">
                  
                  {/* ID & UserId Fields (Read-Only just to track schema accuracy) */}
                  <div className="col-md-6">
                    <label className="form-label text-muted small">Profile ID (UUID)</label>
                    <input type="text" className="form-control form-control-sm bg-light" value={profile?.id || 'Loading...'} readOnly />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small">User ID (Relation)</label>
                    <input type="text" className="form-control form-control-sm bg-light" value={profile?.userId || 'Loading...'} readOnly />
                  </div>

                  {/* firstName */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">First Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      {...register('firstName', { required: true })} 
                      placeholder="Enter first name"
                    />
                  </div>

                  {/* lastName */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Last Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      {...register('lastName', { required: true })} 
                      placeholder="Enter last name"
                    />
                  </div>

                  {/* location (Optional -> String?) */}
                  <div className="col-md-12">
                    <label className="form-label fw-semibold">Location (Optional)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      {...register('location')} 
                      placeholder="e.g. New York, USA"
                    />
                  </div>

                  {/* photoUrl (Optional -> String?) */}
                  <div className="col-md-12">
                    <label className="form-label fw-semibold">Photo URL (Cloudinary Link - Optional)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      {...register('photoUrl')} 
                      placeholder="https://res.cloudinary.com/..."
                    />
                  </div>

                </div>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;