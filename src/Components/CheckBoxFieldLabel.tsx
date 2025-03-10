import React from 'react';

interface Props {
  id: string;
  label: string;
  checked: boolean;
  question: string;
  onQuestionChange: (id: string, newQuestion: string) => void;
  onCheckChange: (id: string, checked: boolean) => void;
}

function CheckBoxFieldLabel({ id, label, checked, question, onCheckChange, onQuestionChange }: Props) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckChange(id, e.target.checked)}
      />
      <input
        type="text"
        placeholder="Enter your checkbox question"
        value={question}
        onChange={(e) => onQuestionChange(id, e.target.value)}
        style={{ marginLeft: '8px' }}
      />
    </div>
  );
}

export default CheckBoxFieldLabel;
