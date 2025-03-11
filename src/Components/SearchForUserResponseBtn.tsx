import React, { useState } from 'react';

interface SearchProps {
  onSearch: (query: string) => void;
}

export default function SearchForUserResponseBtn({ onSearch }: SearchProps) {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div style={{ marginBottom: '15px', display: 'flex', gap: '8px' }}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search email..."
        style={{
          padding: '10px',
          flex: 1,
          borderRadius: '8px',
          border: '1px solid #ccc',
        }}
      />
    </div>
  );
}