import React from 'react';

interface CheckResponseButtonProps {
  email: string;
}

export default function CheckResponseButton({ email }: CheckResponseButtonProps) {
  const handleCheck = () => {
    console.log(`Checked response for: ${email}`);
  };

  return (
    <button
      onClick={() => handleCheck()}
      className="btn btn-sm btn-primary"
      style={{ marginLeft: 'auto' }}
    >
      Check
    </button>
  );
}

