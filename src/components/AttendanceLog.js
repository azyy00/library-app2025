import React, { useState } from 'react';
import axios from 'axios';

function AttendanceLog() {
  const [studentId, setStudentId] = useState('');
  const [purpose, setPurpose] = useState('');
  const [student, setStudent] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const purposes = [
    { value: "Study", icon: "📚", color: "#800000" },
    { value: "Research", icon: "🔬", color: "#A0522D" },
    { value: "Borrow Books", icon: "📖", color: "#CD853F" },
    { value: "Used Computer", icon: "💻", color: "#D2691E" },
    { value: "Library Card Application", icon: "🆔", color: "#B22222" }
  ];

  const searchStudent = async () => {
    if (!studentId.trim()) {
      setMessage('Please enter a student ID');
      return;
    }

    setIsLoading(true);
    setMessage('');
    
    try {
      console.log('Searching for student:', studentId);
      const response = await axios.get(`http://localhost:3001/api/students/search?q=${studentId}`);
      console.log('Search response:', response.data);
      
      if (response.data.length > 0) {
        setStudent(response.data[0]);
        setMessage('');
      } else {
        setStudent(null);
        setMessage('Student not found');
      }
    } catch (error) {
      console.error('Search error:', error);
      setMessage('Error searching student');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!student || !purpose) {
      setMessage('Please select a student and purpose');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Checking in student:', { student_id: student.student_id, purpose });
      const response = await axios.post('http://localhost:3001/api/attendance/checkin', {
        student_id: student.student_id,
        purpose: purpose
      });
      console.log('Check-in response:', response.data);
      
      setMessage('✅ Check-in successful! Welcome to the library!');
      // Reset form
      setStudentId('');
      setPurpose('');
      setStudent(null);
    } catch (error) {
      console.error('Check-in error:', error);
      setMessage(error.response?.data?.error || 'Error during check-in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      {/* Header Section with Animation */}
      <div className="text-center mb-5">
        <div className="d-flex justify-content-center align-items-center mb-3">
          <div className="me-3">
            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" 
                 style={{ width: '80px', height: '80px', backgroundColor: '#800000' }}>
              <i className="bi bi-person-check text-white" style={{ fontSize: '2rem' }}></i>
            </div>
          </div>
          <div>
            <h1 className="display-4 fw-bold text-dark mb-0">Library Check-In</h1>
            <p className="lead text-muted">Welcome to Goa Community Library</p>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-lg border-0" style={{ borderRadius: '20px' }}>
            <div className="card-header text-white text-center py-4" 
                 style={{ 
                   backgroundColor: '#800000', 
                   borderRadius: '20px 20px 0 0',
                   background: 'linear-gradient(135deg, #800000 0%, #A0522D 100%)'
                 }}>
              <h3 className="mb-0">
                <i className="bi bi-clock-history me-2"></i>
                Student Attendance System
              </h3>
              <p className="mb-0 mt-2 opacity-75">Quick and easy check-in process</p>
            </div>
            
            <div className="card-body p-5">
              <div className="row">
                {/* Left Side - Input Form */}
                <div className="col-lg-6">
                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark mb-3">
                      <i className="bi bi-search me-2"></i>Search Student
                    </label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-person-badge text-muted"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="Enter Student ID"
                        onKeyPress={(e) => e.key === 'Enter' && searchStudent()}
                        style={{ fontSize: '1.1rem' }}
                      />
                      <button 
                        className="btn btn-outline-primary"
                        onClick={searchStudent}
                        disabled={isLoading || !studentId.trim()}
                      >
                        {isLoading ? (
                          <span className="spinner-border spinner-border-sm me-2"></span>
                        ) : (
                          <i className="bi bi-search me-2"></i>
                        )}
                        Search
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark mb-3">
                      <i className="bi bi-list-check me-2"></i>Select Purpose
                    </label>
                    <div className="row g-2">
                      {purposes.map((purposeItem, index) => (
                        <div key={purposeItem.value} className="col-6">
                          <button
                            className={`btn w-100 py-3 border-2 ${
                              purpose === purposeItem.value 
                                ? 'text-white' 
                                : 'btn-outline-secondary'
                            }`}
                            style={{
                              backgroundColor: purpose === purposeItem.value ? purposeItem.color : 'transparent',
                              borderColor: purposeItem.color,
                              borderRadius: '15px',
                              transition: 'all 0.3s ease'
                            }}
                            onClick={() => setPurpose(purposeItem.value)}
                          >
                            <div className="d-flex flex-column align-items-center">
                              <span style={{ fontSize: '1.5rem' }}>{purposeItem.icon}</span>
                              <small className="fw-bold">{purposeItem.value}</small>
                            </div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="d-grid">
                    <button 
                      className="btn btn-lg text-white fw-bold py-3"
                      style={{ 
                        backgroundColor: '#800000',
                        borderRadius: '15px',
                        background: 'linear-gradient(135deg, #800000 0%, #A0522D 100%)',
                        border: 'none',
                        boxShadow: '0 4px 15px rgba(128, 0, 0, 0.3)'
                      }}
                      onClick={handleCheckIn}
                      disabled={!student || !purpose || isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Check In Student
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Right Side - Student Info & Status */}
                <div className="col-lg-6">
                  {student ? (
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                      <div className="card-header text-white text-center py-3" 
                           style={{ 
                             backgroundColor: '#800000',
                             borderRadius: '15px 15px 0 0'
                           }}>
                        <h5 className="mb-0">
                          <i className="bi bi-person-check me-2"></i>
                          Student Found
                        </h5>
                      </div>
                      <div className="card-body p-4">
                        <div className="text-center mb-4">
                          <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                               style={{ width: '80px', height: '80px' }}>
                            <i className="bi bi-person-fill text-muted" style={{ fontSize: '2.5rem' }}></i>
                          </div>
                          <h4 className="fw-bold text-dark mb-1">
                            {student.first_name} {student.last_name}
                          </h4>
                          <p className="text-muted mb-0">Student ID: {student.student_id}</p>
                        </div>
                        
                        <div className="row g-3">
                          <div className="col-6">
                            <div className="text-center p-3 bg-light rounded-3">
                              <i className="bi bi-book text-primary mb-2" style={{ fontSize: '1.5rem' }}></i>
                              <h6 className="fw-bold mb-1">Course</h6>
                              <p className="mb-0 text-dark">{student.course}</p>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="text-center p-3 bg-light rounded-3">
                              <i className="bi bi-calendar text-success mb-2" style={{ fontSize: '1.5rem' }}></i>
                              <h6 className="fw-bold mb-1">Year & Section</h6>
                              <p className="mb-0 text-dark">{student.year_level}-{student.section}</p>
                            </div>
                          </div>
                        </div>

                        {purpose && (
                          <div className="mt-4 p-3 rounded-3" 
                               style={{ backgroundColor: '#f8f9fa', border: '2px solid #800000' }}>
                            <div className="d-flex align-items-center">
                              <span className="me-3" style={{ fontSize: '1.5rem' }}>
                                {purposes.find(p => p.value === purpose)?.icon}
                              </span>
                              <div>
                                <h6 className="fw-bold mb-1 text-dark">Selected Purpose</h6>
                                <p className="mb-0 text-muted">{purpose}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="card border-0 shadow-sm h-100 d-flex align-items-center justify-content-center" 
                         style={{ borderRadius: '15px', minHeight: '400px' }}>
                      <div className="text-center text-muted">
                        <i className="bi bi-person-search" style={{ fontSize: '4rem' }}></i>
                        <h5 className="mt-3 mb-2">Search for a Student</h5>
                        <p className="mb-0">Enter a student ID to begin the check-in process</p>
                      </div>
                    </div>
                  )}

                  {/* Message Display */}
                  {message && (
                    <div className={`alert alert-dismissible fade show mt-4 ${
                      message.includes('Error') || message.includes('not found') 
                        ? 'alert-danger' 
                        : 'alert-success'
                    }`} style={{ borderRadius: '15px' }}>
                      <div className="d-flex align-items-center">
                        <i className={`bi ${
                          message.includes('Error') || message.includes('not found')
                            ? 'bi-exclamation-triangle'
                            : 'bi-check-circle'
                        } me-2`} style={{ fontSize: '1.2rem' }}></i>
                        <span className="fw-bold">{message}</span>
                      </div>
                      <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setMessage('')}
                      ></button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row mt-5">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm text-center p-4" style={{ borderRadius: '15px' }}>
            <i className="bi bi-people text-primary mb-3" style={{ fontSize: '2.5rem' }}></i>
            <h4 className="fw-bold text-dark">Easy Check-In</h4>
            <p className="text-muted mb-0">Quick and simple student verification process</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm text-center p-4" style={{ borderRadius: '15px' }}>
            <i className="bi bi-shield-check text-success mb-3" style={{ fontSize: '2.5rem' }}></i>
            <h4 className="fw-bold text-dark">Secure System</h4>
            <p className="text-muted mb-0">Safe and reliable attendance tracking</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm text-center p-4" style={{ borderRadius: '15px' }}>
            <i className="bi bi-graph-up text-info mb-3" style={{ fontSize: '2.5rem' }}></i>
            <h4 className="fw-bold text-dark">Real-time Data</h4>
            <p className="text-muted mb-0">Instant updates and analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceLog;
