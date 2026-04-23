import React from 'react';
import '../styles/Home.css';

const Home = ({ setPage }) => {

  return (
    <div className="home-container">
      {/* Header Banner */}
      <div className="home-banner">
        <div className="banner-content">
          <h1 className="team-title">🏢 Team Management System</h1>
          <p className="team-subtitle">Professional Team Member Management & Directory</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="home-content">
        {/* Welcome Section */}
        <section className="welcome-section">
          <div className="welcome-card">
            <div className="welcome-icon">👋</div>
            <h2>Welcome to Our Team Portal</h2>
            <p>
              Manage and organize your team members efficiently. Create a centralized directory 
              of all team members with their details, roles, and contact information.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Add Members</h3>
              <p>Easily add new team members with their profile information and photos</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>View Directory</h3>
              <p>Browse all team members in a clean, organized list view</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Member Details</h3>
              <p>View comprehensive information about each team member</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📸</div>
              <h3>Photo Profiles</h3>
              <p>Upload and manage professional profile photographs</p>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="cta-section">
          <h2>Get Started</h2>
          <div className="button-group">
            <button 
              className="btn btn-primary"
              onClick={() => { if (setPage) setPage('add-member'); }}
            >
              ➕ Add New Member
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => { if (setPage) setPage('members'); }}
            >
              👥 View All Members
            </button>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stat-card">
            <div className="stat-number">Team Management</div>
            <div className="stat-label">Organized & Efficient</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">Central Directory</div>
            <div className="stat-label">Easy to Access</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">Professional</div>
            <div className="stat-label">Clean Interface</div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
