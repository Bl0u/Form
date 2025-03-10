import React from 'react';

interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (id: string, newValue: string) => void;
}

function TxtAreaLabelFieldComponent({ id, label, value, onChange }: Props) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <label>{label}</label><br />
      <textarea
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
      />
    </div>
  );
}

export default TxtAreaLabelFieldComponent;
