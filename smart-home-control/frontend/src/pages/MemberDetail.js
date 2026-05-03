import React, { useState, useEffect } from 'react';
import { memberService } from '../services/api';

const MemberDetail = ({ memberId, onBack }) => {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchMember(); }, [memberId]);

  const fetchMember = async () => {
    setLoading(true);
    try {
      const res = await memberService.getMemberById(memberId);
      if (res.data.success) setMember(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch member');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await memberService.deleteMember(memberId);
        onBack?.();
      } catch (err) {
        setError('Failed to delete member');
      }
    }
  };

  const s = {
    page: { minHeight: '100vh', background: '#f5f7fa', fontFamily: 'Arial, sans-serif', padding: '30px 20px' },
    backBtn: { background: 'none', border: '1px solid #2563eb', color: '#2563eb', borderRadius: 4, padding: '7px 18px', cursor: 'pointer', fontSize: 14, marginBottom: 24 },
    card: { maxWidth: 700, margin: '0 auto', background: '#fff', borderRadius: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.10)', overflow: 'hidden' },
    imgBox: { width: '100%', height: 400, background: '#dbeafe', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    img: { width: '100%', height: '100%', objectFit: 'contain' },
    placeholder: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72, color: '#93c5fd' },
    body: { padding: '24px 28px' },
    name: { fontSize: 24, fontWeight: 700, color: '#1e3a8a', marginBottom: 4 },
    roll: { fontSize: 14, color: '#64748b', marginBottom: 20 },
    section: { marginBottom: 18 },
    label: { fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 },
    value: { fontSize: 15, color: '#1e293b', margin: 0 },
    divider: { border: 'none', borderTop: '1px solid #e2e8f0', margin: '16px 0' },
    deleteBtn: { marginTop: 24, padding: '10px 28px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: 'pointer' }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;
  if (error || !member) return (
    <div style={s.page}>
      <button style={s.backBtn} onClick={onBack}>← Back</button>
      <p style={{ color: 'red', textAlign: 'center' }}>{error || 'Member not found'}</p>
    </div>
  );

  const fields = [
    { label: 'Roll Number', value: member.rollNumber },
    { label: 'Year', value: member.year },
    { label: 'Degree', value: member.degree },
    { label: 'About Project', value: member.aboutProject },
    { label: 'Hobbies', value: member.hobbies },
    { label: 'Certificate', value: member.certificate },
    { label: 'Internship', value: member.internship },
    { label: 'About Aim', value: member.aboutAim },
  ].filter(f => f.value);

  return (
    <div style={s.page}>
      <button style={s.backBtn} onClick={onBack}>← Back to Members</button>
      <div style={s.card}>
        <div style={s.imgBox}>
          {member.image
            ? <img src={`${window.location.origin.replace(':3000', ':5000')}/uploads/${member.image}`} alt={member.name} style={s.img} onError={e => { e.target.src = 'https://via.placeholder.com/700x260?text=No+Image'; }} />
            : <div style={s.placeholder}>👤</div>
          }
        </div>
        <div style={s.body}>
          <p style={s.name}>{member.name}</p>
          <p style={s.roll}>Added on {new Date(member.createdAt).toLocaleDateString()}</p>
          <hr style={s.divider} />
          {fields.map(f => (
            <div key={f.label} style={s.section}>
              <p style={s.label}>{f.label}</p>
              <p style={s.value}>{f.value}</p>
            </div>
          ))}
          <button style={s.deleteBtn} onClick={handleDelete}>🗑️ Delete Member</button>
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;
