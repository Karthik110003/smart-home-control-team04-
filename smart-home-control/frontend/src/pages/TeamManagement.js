import React, { useState } from 'react';
import Members from './Members';
import AddMember from './AddMember';
import MemberDetail from './MemberDetail';

const TeamManagement = ({ setPage }) => {
  const [view, setView] = useState('home'); // 'home' | 'list' | 'add' | 'detail'
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#1f2937',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    },
    content: {
      textAlign: 'center',
      color: '#fff'
    },
    title: {
      fontSize: 56,
      fontWeight: 700,
      letterSpacing: 3,
      marginBottom: 16,
      color: '#fff'
    },
    subtitle: {
      fontSize: 16,
      marginBottom: 48,
      color: '#d1d5db'
    },
    manageBox: {
      background: '#2563eb',
      borderRadius: 12,
      padding: '40px 60px',
      display: 'inline-block'
    },
    manageTitle: {
      fontSize: 20,
      fontWeight: 700,
      marginBottom: 24,
      color: '#fff'
    },
    buttonGroup: {
      display: 'flex',
      gap: 16,
      justifyContent: 'center'
    },
    btn: {
      background: '#fff',
      color: '#2563eb',
      border: 'none',
      borderRadius: 6,
      padding: '12px 28px',
      fontSize: 14,
      fontWeight: 700,
      cursor: 'pointer',
      minWidth: '140px'
    }
  };

  if (view === 'add') {
    return <AddMember onMemberAdded={() => setView('list')} onBack={() => setView('home')} />
  }

  if (view === 'detail' && selectedMemberId) {
    return <MemberDetail memberId={selectedMemberId} onBack={() => setView('list')} />;
  }

  if (view === 'list') {
    return (
      <Members
        onSelectMember={(id) => { setSelectedMemberId(id); setView('detail'); }}
        onAddMember={() => setView('add')}
        onBack={() => setView('home')}
      />
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>TEAM 04</h1>
        <p style={styles.subtitle}>Welcome to Team04 Management</p>
        <div style={styles.manageBox}>
          <p style={styles.manageTitle}>Manage Team</p>
          <div style={styles.buttonGroup}>
            <button style={styles.btn} onClick={() => setView('add')}>Add Member</button>
            <button style={styles.btn} onClick={() => setView('list')}>View Members</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;
