import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserResponse from './UserResponse';
import SearchForUserResponseBtn from './SearchForUserResponseBtn';

interface EmailItem {
  email: string;
}

export default function Responses() {
  const [emails, setEmails] = useState<EmailItem[]>([]); // Ensures state starts as an array
  const [filteredEmails, setFilteredEmails] = useState<EmailItem[]>([]); // Ensures state starts as an array

  useEffect(() => {
    axios.get('http://localhost/PHP/Responses.php') 
      .then((response) => {
        if (Array.isArray(response.data)) {
          setEmails(response.data);
          setFilteredEmails(response.data);
        } else {
          console.error('Invalid JSON response:', response.data);
          setEmails([]);
          setFilteredEmails([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching emails:", error);
        setEmails([]);
        setFilteredEmails([]);
      });
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredEmails(emails); // Reset when input is empty
    } else {
      setFilteredEmails(
        emails.filter((emailItem) =>
          emailItem.email.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  const handleClick = (email: string) => {
    console.log('Selected:', email);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #3498db, #f39c12)',
      }}
    >
      <div
        style={{
          overflowY: 'auto',
          height: '500px',
          width: '400px',
          padding: '15px',
          borderRadius: '12px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
          backgroundColor: 'rgba(255,255,255,0.9)',
        }}
      >
        <SearchForUserResponseBtn onSearch={handleSearch} />

        {/* ✅ Ensure filteredEmails is always an array */}
        {Array.isArray(filteredEmails) && filteredEmails.length > 0 ? (
          filteredEmails.map((emailItem, index) => (
            <UserResponse key={index} user={emailItem.email} handleClick={handleClick} />
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#777', marginTop: '10px' }}>
            No emails found.
          </p>
        )}
      </div>
    </div>
  );
}
