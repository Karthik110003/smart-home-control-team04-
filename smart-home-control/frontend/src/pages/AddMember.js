import React, { useState } from 'react';
import { memberService } from '../services/api';

const AddMember = ({ onMemberAdded, onBack }) => {
  const [formData, setFormData] = useState({
    name: '', rollNumber: '', year: '', degree: '',
    aboutProject: '', hobbies: '', certificate: '',
    internship: '', aboutAim: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB'); return; }
    setImage(file || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { setError('Please enter your name'); return; }
    if (!formData.rollNumber.trim()) { setError('Please enter roll number'); return; }
    if (!formData.year.trim()) { setError('Please enter year'); return; }
    if (!formData.degree.trim()) { setError('Please enter degree'); return; }

    setLoading(true); setError(''); setSuccess('');
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      const res = await memberService.addMember(fd);
      if (res.data.success) {
        setSuccess('Member added successfully!');
        setTimeout(() => onMemberAdded?.(), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%', padding: '9px 12px', border: '1px solid #d0d5dd',
    borderRadius: 5, fontSize: 13, fontFamily: 'inherit', outline: 'none',
    boxSizing: 'border-box', color: '#1a1a2e'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', display: 'flex', justifyContent: 'center', padding: '30px 16px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: 8, width: '100%', maxWidth: 520, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', height: 'fit-content' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e8eaed', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#444', padding: 0 }}>←</button>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#1a1a2e', flex: 1, textAlign: 'center' }}>Add Team Member</h2>
          <div style={{ width: 20 }}></div>
        </div>

        <div style={{ padding: '20px 24px' }}>
          {error && <div style={{ background: '#fff0f0', border: '1px solid #ffcdd2', color: '#c62828', padding: '8px 12px', borderRadius: 5, fontSize: 13, marginBottom: 12 }}>{error}</div>}
          {success && <div style={{ background: '#f0fff4', border: '1px solid #c8e6c9', color: '#2e7d32', padding: '8px 12px', borderRadius: 5, fontSize: 13, marginBottom: 12 }}>{success}</div>}

          <form onSubmit={handleSubmit}>
            {['name', 'rollNumber'].map(name => (
              <div key={name} style={{ marginBottom: 12 }}>
                <input type="text" name={name} placeholder={name === 'rollNumber' ? 'Roll Number' : 'Name'} value={formData[name]} onChange={handleChange} style={inp} />
              </div>
            ))}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <input type="text" name="year" placeholder="Year" value={formData.year} onChange={handleChange} style={inp} />
              <input type="text" name="degree" placeholder="Degree" value={formData.degree} onChange={handleChange} style={inp} />
            </div>

            <div style={{ marginBottom: 12 }}>
              <textarea name="aboutProject" placeholder="About Project" value={formData.aboutProject} onChange={handleChange} rows={3} style={{ ...inp, resize: 'vertical' }} />
            </div>

            {['hobbies', 'certificate', 'internship'].map(name => (
              <div key={name} style={{ marginBottom: 12 }}>
                <input type="text" name={name} placeholder={name === 'hobbies' ? 'Hobbies (comma separated)' : name.charAt(0).toUpperCase() + name.slice(1)} value={formData[name]} onChange={handleChange} style={inp} />
              </div>
            ))}

            <div style={{ marginBottom: 12 }}>
              <textarea name="aboutAim" placeholder="About Your Aim" value={formData.aboutAim} onChange={handleChange} rows={3} style={{ ...inp, resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', border: '1px solid #d0d5dd', borderRadius: 5, overflow: 'hidden', marginBottom: 16 }}>
              <label style={{ padding: '8px 14px', background: '#f0f2f5', borderRight: '1px solid #d0d5dd', fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', color: '#444' }}>
                Browse...
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </label>
              <span style={{ fontSize: 13, color: '#888', padding: '8px 12px' }}>{image ? image.name : 'No file selected.'}</span>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: 12, background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 5, fontSize: 13, fontWeight: 700, letterSpacing: 1, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Submitting...' : 'SUBMIT'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMember;
