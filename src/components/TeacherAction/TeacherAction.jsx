import React, { useState, useEffect } from 'react';
import './TeacherAction.css';
import { 
  FiUser, 
  FiBook, 
  FiUsers, 
  FiMessageCircle, 
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiAward,
  FiBarChart2,
  FiActivity,
  FiFileText,
  FiEdit3,
  FiTarget,
  FiStar
} from 'react-icons/fi';

const TeacherAction = ({ filters = {} }) => {
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Set default values for filters
  const currentFilters = {
    school: filters.school || 'All Schools',
    schoolBlock: filters.schoolBlock || 'All Blocks',
    class: filters.class || 'All Classes',
    section: filters.section || 'All Sections'
  };

  useEffect(() => {
    // Simulate data loading when filters change
    if (currentFilters.school !== 'All Schools' && 
        currentFilters.schoolBlock !== 'All Blocks' && 
        currentFilters.class !== 'All Classes' && 
        currentFilters.section !== 'All Sections') {
      setLoading(true);
      setTimeout(() => {
        setTeacherData({
          name: 'Ms. Anita Desai',
          role: 'Biology Teacher',
          school: currentFilters.school,
          block: currentFilters.schoolBlock,
          class: currentFilters.class,
          section: currentFilters.section
        });
        setLoading(false);
      }, 500);
    } else {
      setTeacherData(null);
    }
  }, [currentFilters.school, currentFilters.schoolBlock, currentFilters.class, currentFilters.section]);

  const stats = [
    { 
      icon: <FiEdit3 />, 
      value: 23, 
      label: 'Homework Created',
      color: '#8B5CF6',
      bgColor: 'rgba(139, 92, 246, 0.1)'
    },
    { 
      icon: <FiBook />, 
      value: 18, 
      label: 'Classwork Given',
      color: '#3B82F6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    { 
      icon: <FiBarChart2 />, 
      value: 156, 
      label: 'Student Analytics Checked',
      color: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    { 
      icon: <FiMessageCircle />, 
      value: 47, 
      label: 'Chatbot Interactions',
      color: '#F59E0B',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    },
  ];

  const assignments = [
    {
      type: 'HOMEWORK CREATED',
      title: 'Mathematics - Chapter 4: Quadratic Equations',
      class: '7th A, B, C',
      due: 'Tomorrow 16:00',
      questions: '5 questions selected from question bank',
      submitted: 32,
      pending: 13,
      total: 45,
      time: 'Today, 14:25',
      color: '#8B5CF6'
    },
    {
      type: 'CLASSWORK UPLOAD',
      title: 'Mathematics - Class Exercise',
      class: '7th B',
      due: '10:30 AM',
      questions: '8 questions',
      submitted: 28,
      pending: 0,
      total: 28,
      time: '10:30 AM',
      color: '#3B82F6'
    },
    {
      type: 'WORKSHEET SHARED',
      title: 'Mathematics - Practice Problems',
      class: '7th C',
      due: 'Next Week',
      questions: '15 practice problems',
      worksheetsCreated: 35,
      time: 'Yesterday, 16:45',
      color: '#10B981'
    }
  ];

  const mostUsedFeatures = [
    { name: 'Chatbot Data Fetch', count: 18, percentage: 90 },
    { name: 'View Classwork Submissions', count: 12, percentage: 60 },
    { name: 'View Homework Submissions', count: 10, percentage: 50 },
    { name: 'Create Homework', count: 8, percentage: 40 },
    { name: 'Auto Submit Homework', count: 5, percentage: 25 },
    { name: 'Create/Submit Classwork', count: 3, percentage: 15 }
  ];

  const topStudents = [
    { id: '9MMB55', name: 'Rahul Kumar', calls: 56, level: 'high', avatar: '👨‍🎓' },
    { id: '9MMB46', name: 'Priya Sharma', calls: 42, level: 'medium', avatar: '👩‍🎓' },
    { id: '9MMB49', name: 'Arjun Singh', calls: 40, level: 'medium', avatar: '👨‍🎓' },
    { id: '9MMB42', name: 'Anita Patel', calls: 35, level: 'medium', avatar: '👩‍🎓' },
    { id: '9MMB48', name: 'Vijay Reddy', calls: 32, level: 'medium', avatar: '👨‍🎓' },
    { id: '9MMB66', name: 'Sneha Gupta', calls: 28, level: 'low', avatar: '👩‍🎓' },
    { id: '9MMB41', name: 'Amit Verma', calls: 25, level: 'low', avatar: '👨‍🎓' },
    { id: '9MMB61', name: 'Kavita Nair', calls: 22, level: 'low', avatar: '👩‍🎓' },
    { id: '9MMB52', name: 'Ravi Mehta', calls: 20, level: 'low', avatar: '👨‍🎓' },
    { id: '9MMB56', name: 'Pooja Joshi', calls: 18, level: 'low', avatar: '👩‍🎓' }
  ];

  if (!teacherData && !loading) {
    return (
      <div className="teacher-action-container">
        <div className="selection-prompt">
          <div className="prompt-icon">
            <FiUsers className="icon-large" />
          </div>
          <h2>Select Filters to View Teacher Details</h2>
          <p>Please select School, School Block, Class, and Section to view teacher information</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="teacher-action-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading teacher data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-action-container">
      {/* Teacher Profile Card */}
      <div className="teacher-profile-card">
        <div className="profile-background">
          <div className="profile-pattern"></div>
        </div>
        <div className="profile-content">
          <div className="profile-avatar">
            <span className="avatar-text">
              {teacherData.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="profile-info">
            <h2 className="teacher-name">{teacherData.name}</h2>
            <p className="teacher-details">
              {teacherData.role} | {teacherData.school} - {teacherData.block}
            </p>
            <p className="teacher-class-info">
              <span className="info-badge">Class: {teacherData.class}</span>
              <span className="info-badge">Section: {teacherData.section}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="stat-card"
            style={{ 
              '--stat-color': stat.color,
              '--stat-bg': stat.bgColor,
              '--delay': `${index * 0.1}s` 
            }}
          >
            <div className="stat-icon" style={{ color: stat.color, background: stat.bgColor }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3 className="stat-value" style={{ color: stat.color }}>{stat.value}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Assignment Creation Activity */}
      <div className="assignment-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-icon">📝</span>
            Assignment Creation Activity
          </h2>
        </div>
        
        <div className="assignments-grid">
          {assignments.map((assignment, index) => (
            <div 
              key={index} 
              className="assignment-card"
              style={{ 
                '--border-color': assignment.color,
                '--delay': `${index * 0.15}s` 
              }}
            >
              <div className="assignment-header">
                <span className="assignment-type" style={{ color: assignment.color }}>
                  {assignment.type}
                </span>
                <span className="assignment-time">{assignment.time}</span>
              </div>
              
              <h3 className="assignment-title">{assignment.title}</h3>
              
              <div className="assignment-details">
                <div className="detail-row">
                  <span className="detail-label">CLASS</span>
                  <span className="detail-value">{assignment.class}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">DUE</span>
                  <span className="detail-value">{assignment.due}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">QUESTIONS</span>
                  <span className="detail-value">{assignment.questions}</span>
                </div>
              </div>

              {assignment.type === 'WORKSHEET SHARED' ? (
                <div className="worksheet-stats">
                  <div className="worksheet-created">
                    <FiFileText className="stat-icon" />
                    <span className="stat-number">{assignment.worksheetsCreated}</span>
                    <span className="stat-text">Worksheets Created</span>
                  </div>
                </div>
              ) : (
                <div className="submission-stats">
                  <div className="submission-progress">
                    <div className="progress-labels">
                      <span className="submitted">
                        <FiCheckCircle /> {assignment.submitted} Submitted
                      </span>
                      {assignment.pending > 0 && (
                        <span className="pending">
                          <FiClock /> {assignment.pending} Pending
                        </span>
                      )}
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${(assignment.submitted / assignment.total) * 100}%`,
                          background: assignment.pending === 0 ? '#10B981' : `linear-gradient(90deg, #10B981 ${(assignment.submitted / assignment.total) * 100}%, #F59E0B 0%)`
                        }}
                      ></div>
                    </div>
                    <div className="total-count">
                      Total: <strong>{assignment.total}</strong>
                      {assignment.pending === 0 && <span className="all-completed">✨ All students completed!</span>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Features and Students Analytics */}
      <div className="analytics-section">
        {/* Most Used Features */}
        <div className="features-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="title-icon">🔥</span>
              Most Used Features
            </h3>
            <span className="badge">Teacher Features</span>
          </div>
          
          <div className="features-list">
            {mostUsedFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="feature-item"
                style={{ '--delay': `${index * 0.1}s` }}
              >
                <div className="feature-info">
                  <span className="feature-rank">#{index + 1}</span>
                  <span className="feature-name">{feature.name}</span>
                  <span className="feature-count">{feature.count} uses</span>
                </div>
                <div className="feature-bar">
                  <div 
                    className="bar-fill"
                    style={{ 
                      width: `${feature.percentage}%`,
                      background: `linear-gradient(90deg, ${index < 3 ? '#8B5CF6' : '#3B82F6'} 0%, ${index < 3 ? '#EC4899' : '#06B6D4'} 100%)`
                    }}
                  >
                    <span className="bar-value">{feature.percentage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 10 Most Active Students */}
        <div className="students-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="title-icon">🏆</span>
              Top 10 Most Active Students
            </h3>
            <div className="legend">
              <span className="legend-item high"><span className="dot"></span>High</span>
              <span className="legend-item medium"><span className="dot"></span>Medium</span>
              <span className="legend-item low"><span className="dot"></span>Low</span>
            </div>
          </div>
          
          <div className="students-list">
            {topStudents.map((student, index) => (
              <div 
                key={student.id} 
                className={`student-item ${student.level}`}
                style={{ '--delay': `${index * 0.08}s` }}
              >
                <div className="student-rank">
                  {index === 0 && <FiAward className="trophy gold" />}
                  {index === 1 && <FiAward className="trophy silver" />}
                  {index === 2 && <FiAward className="trophy bronze" />}
                  {index > 2 && <span className="rank-number">{index + 1}</span>}
                </div>
                
                <div className="student-avatar">{student.avatar}</div>
                
                <div className="student-info">
                  <p className="student-name">{student.name}</p>
                  <p className="student-id">{student.id}</p>
                </div>
                
                <div className="student-stats">
                  <div className="calls-bar">
                    <div 
                      className="calls-fill"
                      style={{ 
                        width: `${(student.calls / 60) * 100}%`,
                        background: student.level === 'high' ? 'linear-gradient(90deg, #EF4444 0%, #F59E0B 100%)' : 
                                   student.level === 'medium' ? 'linear-gradient(90deg, #F59E0B 0%, #FCD34D 100%)' :
                                   'linear-gradient(90deg, #FCD34D 0%, #FDE68A 100%)'
                      }}
                    ></div>
                  </div>
                  <span className="calls-count">{student.calls} calls</span>
                </div>
                
                {index < 3 && (
                  <div className="achievement-badge">
                    <FiStar className="star-icon" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAction;