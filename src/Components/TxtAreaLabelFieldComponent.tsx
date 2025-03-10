import React from 'react';

export interface Props {
  id: string;
  question: string;
  value: string;
  onQuestionChange: (id: string, newQuestion: string) => void;
  onValueChange: (id: string, newValue: string) => void;
}

function TxtAreaLabelFieldComponent({ id, question, value, onQuestionChange, onValueChange }: Props) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <input
        type="text"
        value={question}
        onChange={(e) => onQuestionChange(id, e.target.value)}
        placeholder="Enter question"
        style={{ width: '100%', marginBottom: '5px' }}
      />
      <textarea
        value={value}
        onChange={(e) => onValueChange(id, e.target.value)}
        style={{
          width: '70%',
          minHeight: '80px',
          padding: '12px',
          border: '1px solid #ddd',
          borderRadius: '6px',
          fontSize: '14px',
          resize: 'vertical'
        }}
      />
    </div>
  );
}

export default TxtAreaLabelFieldComponent;
