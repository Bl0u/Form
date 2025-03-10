import React from 'react';

interface Props {
  id: string;
  question: string;
  options: string[];
  onQuestionChange: (id: string, newQuestion: string) => void;
  onOptionsChange: (id: string, newOptions: string[]) => void;
  onRemoveOption: (id: string, index: number) => void;
}

function RadioFieldLabel({ id, question, options, onQuestionChange, onOptionsChange, onRemoveOption }: Props) {
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
        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
          <input type="radio" disabled />
          <input
            type="text"
            value={option}
            onChange={(e) => handleOptionChange(idx, e.target.value)}
            style={{ 
              flex: 1,
              padding: '4px 8px',
              border: '1px solid #e0e0e0',
              borderRadius: '4px'
            }}
          />
          <button 
            onClick={() => onRemoveOption(id, idx)}
            style={{ 
              padding: '0 4px',
              fontSize: '14px',
              lineHeight: '1',
              background: 'none',
              border: 'none',
              color: '#ff4444',
              cursor: 'pointer',
              opacity: 0.7,
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default RadioFieldLabel;
