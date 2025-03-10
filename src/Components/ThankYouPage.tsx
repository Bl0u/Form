import React from 'react';
import { useNavigate } from 'react-router-dom';

function ThankYouPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%'
      }}>
        <h1 style={{ 
          color: '#4CAF50',
          marginBottom: '20px',
          fontSize: '32px'
        }}>
          Thank You!
        </h1>
        
        <p style={{ 
          fontSize: '18px',
          color: '#666',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          Your response has been recorded. We appreciate your time and feedback.
        </p>

        <button
          onClick={() => navigate('/')}
          style={{
            padding: '12px 30px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
        >
          Return Home
        </button>
      </div>
    </div>
  );
}

export default ThankYouPage; 