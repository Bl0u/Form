import React from 'react';

interface Props {
  id: string;
  question: string;
  options: string[];
  onQuestionChange: (id: string, newQuestion: string) => void;
  onOptionsChange: (id: string, newOptions: string[]) => void;
}

function CheckBoxFieldLabel({ id, question, options, onQuestionChange, onOptionsChange }: Props) {
  const handleOptionChange = (index: number, newValue: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = newValue;
    onOptionsChange(id, updatedOptions);
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <input
        type="text"
        value={question}
        onChange={(e) => onQuestionChange(id, e.target.value)}
        placeholder="Enter question"
        style={{ width: '100%', marginBottom: '5px' }}
      />
      {options.map((option, idx) => (
        <div key={idx}>
          <input type="checkbox" disabled />
          <input
            type="text"
            value={option}
            onChange={(e) => handleOptionChange(idx, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}

export default CheckBoxFieldLabel;
