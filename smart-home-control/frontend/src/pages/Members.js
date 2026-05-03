import React, { useState, useEffect } from 'react';
import { memberService } from '../services/api';

const Members = ({ onSelectMember, onAddMember, onBack }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await memberService.getAllMembers();
      if (response.data.success) setMembers(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  const s = {
    page: { minHeight: '100vh', background: '#fff', fontFamily: 'Arial, sans-serif', padding: '30px 20px' },
    title: { textAlign: 'center', fontSize: 28, fontWeight: 700, color: '#2563eb', letterSpacing: 2, marginBottom: 32, textTransform: 'uppercase' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24, maxWidth: 1100, margin: '0 auto' },
    card: { border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    imgBox: { width: '100%', height: 280, background: '#e5e7eb', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    img: { width: '100%', height: '100%', objectFit: 'contain' },
    placeholder: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#dbeafe', fontSize: 48 },
    cardBody: { padding: '14px 16px', borderTop: '2px solid #2563eb' },
    name: { fontWeight: 700, fontSize: 15, textAlign: 'center', margin: '0 0 4px', color: '#111' },
    roll: { fontSize: 13, color: '#555', textAlign: 'center', margin: '0 0 12px' },
    btn: { display: 'block', width: '100%', padding: '8px 0', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, fontSize: 12, fontWeight: 700, letterSpacing: 1, cursor: 'pointer', textTransform: 'uppercase' },
    addBtn: { display: 'block', margin: '0 auto 28px', padding: '10px 28px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: 'pointer' }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={s.page}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: 24 }}>
        {onBack && <button onClick={onBack} style={{ position: 'absolute', left: 0, background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#2563eb', padding: 0 }}>←</button>}
        <h1 style={s.title}>MEET YOUR AMAZING TEAM</h1>
      </div>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <div style={s.grid}>
        {members.map(member => (
          <div key={member._id} style={s.card}>
            <div style={s.imgBox}>
              {member.image
                ? <img src={`${window.location.origin.replace(':3000', ':5000')}/uploads/${member.image}`} alt={member.name} style={s.img} onError={e => { e.target.src = 'https://via.placeholder.com/260x200?text=No+Image'; }} />
                : <div style={s.placeholder}>👤</div>
              }
            </div>
            <div style={s.cardBody}>
              <p style={s.name}>{member.name}</p>
              <p style={s.roll}>Roll Number: {member.rollNumber}</p>
              <button style={s.btn} onClick={() => onSelectMember(member._id)}>View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Members;
