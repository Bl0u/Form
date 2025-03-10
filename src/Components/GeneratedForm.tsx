import React, { useEffect, useState } from 'react';

interface Field {
  id: string;
  type: 'textarea' | 'radio' | 'checkbox';
  question: string;
  value: string;
  options?: string[];
}

interface Section {
  id: string;
  title: string;
  fields: Field[];
}

function GeneratedForm() {
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    if (data) {
      try {
        const decodedData = decodeURIComponent(data);
        const parsedData = JSON.parse(decodedData);
        setSections(parsedData);
      } catch (error) {
        console.error('Failed to parse form data:', error);
      }
    }
  }, []);

  const handleFieldChange = (sectionId: string, fieldId: string, newValue: string) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.map(field =>
                field.id === fieldId ? { ...field, value: newValue } : field
              )
            }
          : section
      )
    );
  };

  const renderField = (field: Field, sectionId: string) => {
    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.id} style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{field.question}</label>
            <textarea 
              value={field.value} 
              onChange={(e) => handleFieldChange(sectionId, field.id, e.target.value)}
              style={{ width: '100%', minHeight: '100px', padding: '8px' }}
            />
          </div>
        );
      case 'checkbox':
        return (
          <div key={field.id} style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{field.question}</label>
            {field.options?.map((option, index) => (
              <label key={index} style={{ display: 'block', marginLeft: '20px' }}>
                <input 
                  type="checkbox" 
                  checked={field.value === option}
                  onChange={() => handleFieldChange(sectionId, field.id, option)}
                />
                {option}
              </label>
            ))}
          </div>
        );
      case 'radio':
        return (
          <div key={field.id} style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{field.question}</label>
            {field.options?.map((option, index) => (
              <label key={index} style={{ display: 'block', marginLeft: '20px' }}>
                <input 
                  type="radio" 
                  name={field.id}
                  checked={field.value === option}
                  onChange={() => handleFieldChange(sectionId, field.id, option)}
                />
                {option}
              </label>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {sections.map(section => (
        <div key={section.id} style={{ marginBottom: '30px' }}>
          <h2>{section.title}</h2>
          {section.fields.map(field => renderField(field, section.id))}
        </div>
      ))}
    </div>
  );
}

export default GeneratedForm;
  