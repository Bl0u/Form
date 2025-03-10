import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

interface FormMetadata {
  logo: string;
  name: string;
  field: string;
}

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

interface FormData {
  metadata: FormMetadata;
  sections: Section[];
}

function GeneratedForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(data));
        setFormData(decodedData);
        document.title = decodedData.metadata.name;
      } catch (error) {
        console.error('Error parsing form data:', error);
      }
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formValues);
    navigate('/thank-you');
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }));
  };

  if (!formData) {
    return <div>Loading...</div>;
  }

  const getBackgroundColor = (field: string) => {
    const fieldColors: Record<string, string> = {
      'healthcare': '#e3f2fd',
      'education': '#f3e5f5',
      'technology': '#e8f5e9',
      'finance': '#fff3e0',
      'retail': '#fce4ec',
      'default': '#ffffff'
    };
    return fieldColors[field.toLowerCase()] || fieldColors.default;
  };

  const getBackgroundStyle = (field: string) => {
    return {
      background: 'linear-gradient(-45deg, #2193b0, #6dd5ed, #2193b0, #6dd5ed)',
      backgroundSize: '400% 400%',
      animation: 'gradient 15s ease infinite',
      '@keyframes gradient': {
        '0%': {
          backgroundPosition: '0% 50%'
        },
        '50%': {
          backgroundPosition: '100% 50%'
        },
        '100%': {
          backgroundPosition: '0% 50%'
        }
      }
    };
  };

  const backgroundStyle = getBackgroundStyle(formData.metadata.field);

  return (
    <div style={{
      minHeight: '100vh',
      ...backgroundStyle,
      padding: '20px',
      transition: 'background 0.3s ease'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        {formData.metadata.logo && (
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <img 
              src={formData.metadata.logo} 
              alt="Company Logo" 
              style={{ 
                maxHeight: '150px', 
                maxWidth: '300px',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                margin: '0 auto'
              }}
            />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {formData.sections.map(section => (
            <div key={section.id} style={{ marginBottom: '30px' }}>
              <h2 style={{ 
                marginBottom: '20px',
                color: '#444',
                borderBottom: '2px solid #eee',
                paddingBottom: '10px'
              }}>
                {section.title}
              </h2>
              
              {section.fields.map(field => (
                <div key={field.id} style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    color: '#555'
                  }}>
                    {field.question}
                  </label>

                  {field.type === 'textarea' && (
                    <textarea
                      value={formValues[field.id] || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      style={{
                        width: '100%',
                        minHeight: '100px',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '16px'
                      }}
                    />
                  )}

                  {field.type === 'radio' && (
                    <div style={{ marginLeft: '20px' }}>
                      {field.options?.map((option, index) => (
                        <div key={index} style={{ marginBottom: '8px' }}>
                          <input
                            type="radio"
                            name={field.id}
                            value={option}
                            checked={formValues[field.id] === option}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            style={{ marginRight: '8px' }}
                          />
                          <label style={{ color: '#000' }}>{option}</label>
                        </div>
                      ))}
                    </div>
                  )}

                  {field.type === 'checkbox' && (
                    <div style={{ marginLeft: '20px' }}>
                      {field.options?.map((option, index) => (
                        <div key={index} style={{ marginBottom: '8px' }}>
                          <input
                            type="checkbox"
                            checked={formValues[field.id] === option}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            style={{ marginRight: '8px' }}
                          />
                          <label style={{ color: '#000' }}>{option}</label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button
              type="submit"
              style={{
                padding: '12px 30px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
            >
              Submit Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GeneratedForm;
  
  