import React, { useState } from 'react';
import UserResponse from './UserResponse';
import SearchForUserResponseBtn from './SearchForUserResponseBtn';

interface EmailItem {
  email: string;
}

export default function Responses() {
  const emails: EmailItem[] = [
    { email: 'john@example.com' },
    { email: 'jane@example.com' },
    { email: 'mike@example.com' },
  ];

  const [filteredEmails, setFilteredEmails] = useState<EmailItem[]>(emails);

  const handleClick = (email: string) => {
    console.log('Selected:', email);
  };

  const handleSearch = (query: string) => {
    if (query.trim() === '') {
      setFilteredEmails(emails);
    } else {
      setFilteredEmails(
        emails.filter((emailItem) =>
          emailItem.email.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
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

        {filteredEmails.map((emailItem, index) => (
          <UserResponse
            key={index}
            user={emailItem.email}
            handleClick={handleClick}
          />
        ))}

        {filteredEmails.length === 0 && (
          <p style={{ textAlign: 'center', color: '#777', marginTop: '10px' }}>
            No emails found.
          </p>
        )}
      </div>
    </div>
  );
}
