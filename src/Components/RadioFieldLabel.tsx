import React from 'react';

interface Props {
  id: string;
  selected: boolean;
  question: string;
  onQuestionChange: (id: string, newQuestion: string) => void;
  onSelectChange: (id: string) => void;
}

function RadioFieldLabel({ id, selected, question, onSelectChange, onQuestionChange }: Props) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <input
        type="radio"
        checked={selected}
        onChange={() => onSelectChange(id)}
      />
      <input
        type="text"
        placeholder="Enter radio label"
        value={question}
        onChange={(e) => onQuestionChange(id, e.target.value)}
        style={{ marginLeft: '8px' }}
      />
    </div>
  );
}

export default RadioFieldLabel;
