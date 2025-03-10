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

interface FormValues {
  [key: string]: string | string[];
}

function GeneratedForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{ metadata: FormMetadata; sections: Section[] } | null>(null);
  const [formValues, setFormValues] = useState<FormValues>({});

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
    if (!formData) return;

    setFormValues(prev => {
      const field = formData.sections
        .flatMap(section => section.fields)
        .find(f => f.id === fieldId);

      if (!field) return prev;

      if (field.type === 'checkbox') {
        const currentValues = Array.isArray(prev[fieldId]) ? prev[fieldId] as string[] : [];
        const newValues = currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value];
        return { ...prev, [fieldId]: newValues };
      }

      return { ...prev, [fieldId]: value };
    });
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
      width: '100vw',
      ...backgroundStyle,
      padding: '20px',
      transition: 'background 0.3s ease',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '20px auto',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        {formData.metadata.logo && (
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <img 
              src={formData.metadata.logo} 
              alt="Company Logo" 
              style={{ 
                maxHeight: '200px', 
                maxWidth: '400px',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                margin: '0 auto'
              }}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {formData.sections.map(section => (
            <div key={section.id} style={{ marginBottom: '40px' }}>
              <h2 style={{ 
                marginBottom: '25px',
                color: '#333',
                borderBottom: '2px solid #eee',
                paddingBottom: '15px',
                fontSize: '24px',
                fontWeight: '600'
              }}>
                {section.title}
              </h2>
              
              {section.fields.map(field => (
                <div key={field.id} style={{ marginBottom: '25px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '10px',
                    fontWeight: '600',
                    color: '#333',
                    fontSize: '16px'
                  }}>
                    {field.question}
                  </label>

                  {field.type === 'textarea' && (
                    <textarea
                      value={formValues[field.id] || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      style={{
                        width: '100%',
                        minHeight: '120px',
                        padding: '12px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '16px',
                        resize: 'vertical'
                      }}
                    />
                  )}

                  {field.type === 'checkbox' && (
                    <div style={{ marginLeft: '20px' }}>
                      {field.options?.map((option, index) => (
                        <div key={index} style={{ marginBottom: '12px' }}>
                          <input
                            type="checkbox"
                            checked={Array.isArray(formValues[field.id]) && formValues[field.id].includes(option)}
                            onChange={() => handleFieldChange(field.id, option)}
                            style={{ marginRight: '10px' }}
                          />
                          <label style={{ color: '#000', fontSize: '16px' }}>{option}</label>
                        </div>
                      ))}
                    </div>
                  )}

                  {field.type === 'radio' && (
                    <div style={{ marginLeft: '20px' }}>
                      {field.options?.map((option, index) => (
                        <div key={index} style={{ marginBottom: '12px' }}>
                          <input
                            type="radio"
                            name={field.id}
                            value={option}
                            checked={formValues[field.id] === option}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            style={{ marginRight: '10px' }}
                          />
                          <label style={{ color: '#000', fontSize: '16px' }}>{option}</label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button
              type="submit"
              style={{
                padding: '15px 40px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#45a049';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#4CAF50';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
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
  
  