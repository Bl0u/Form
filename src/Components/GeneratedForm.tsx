import React from 'react';
import { useSearchParams } from 'react-router-dom';

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

export function GeneratedForm() {
  const [searchParams] = useSearchParams();
  const formData = searchParams.get('data');
  const sections: Section[] = formData ? JSON.parse(decodeURIComponent(formData)) : [];

  return (
    <div style={{ padding: '20px' }}>
      {sections.map(section => (
        <div key={section.id} style={{ marginBottom: '30px' }}>
          <h2>{section.title}</h2>
          {section.fields.map(field => (
            <div key={field.id} style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                {field.question}
              </label>
              {field.type === 'textarea' ? (
                <textarea style={{ width: '100%', minHeight: '100px', padding: '8px' }} />
              ) : field.type === 'radio' ? (
                <div>
                  {field.options?.map((option, index) => (
                    <div key={index} style={{ marginBottom: '5px' }}>
                      <input type="radio" name={field.id} value={option} />
                      <label style={{ marginLeft: '5px' }}>{option}</label>
                    </div>
                  ))}
                </div>
              ) : field.type === 'checkbox' ? (
                <div>
                  {field.options?.map((option, index) => (
                    <div key={index} style={{ marginBottom: '5px' }}>
                      <input type="checkbox" value={option} />
                      <label style={{ marginLeft: '5px' }}>{option}</label>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
  
  