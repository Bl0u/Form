import React from 'react';

interface Props {
  onRequest: (message: string) => void;
}

function AskAi({ onRequest }: Props) {
  const handleClick = () => {
    const userMessage = prompt("Describe the form you want AI to build:");
    if (userMessage) {
      onRequest(userMessage);
    }
  };

  return <button onClick={handleClick}>Ask AI</button>;
}

export default AskAi;
