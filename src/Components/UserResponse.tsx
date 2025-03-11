import React from 'react';
import CheckResponseButton from './CheckResponseButton';

interface Info {
  user: string;
  handleClick: (email: string) => void;
}

export default function UserResponse({ user, handleClick }: Info) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <button
        onClick={() => handleClick(user)}
        type="button"
        className="list-group-item list-group-item-action"
        style={{ flex: 1, textAlign: 'left' }}
      >
        {user}
      </button>
      <CheckResponseButton email={user} />
    </div>
  );
}
