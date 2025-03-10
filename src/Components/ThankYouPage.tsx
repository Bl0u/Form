import React from 'react';
import { useNavigate } from 'react-router-dom';

function ThankYouPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(-45deg, #2193b0, #6dd5ed, #2193b0, #6dd5ed)',
      backgroundSize: '400% 400%',
      animation: 'gradient 15s ease infinite',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '60px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '36px',
          color: '#333',
          marginBottom: '20px',
          fontWeight: '600'
        }}>
          Thank You!
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#666',
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          Your response has been successfully submitted. We appreciate your time and feedback.
        </p>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '15px 40px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#45a049';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#4CAF50';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }}
        >
          Return Home
        </button>
      </div>
    </div>
  );
}

export default ThankYouPage; 