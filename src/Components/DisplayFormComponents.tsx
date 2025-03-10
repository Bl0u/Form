import React, { useState } from 'react';
import TxtArea from './TxtArea';
import RadioArea from './RadioArea';
import Checkbox from './CheckBoxArea';
import CategorizationBtn from './CategorizationBtn';
import TxtAreaLabelFieldComponent from './TxtAreaLabelFieldComponent';
import CheckBoxFieldLabel from './CheckBoxFieldLabel';
import RadioFieldLabel from './RadioFieldLabel';
import AskAi from './AskAi';

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

function DisplayFormComponents() {
  const [sections, setSections] = useState<Section[]>([]);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [formMetadata, setFormMetadata] = useState<FormMetadata>({
    logo: '',
    name: '',
    field: ''
  });

  const handleAiRequest = async (message: string) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate a structured JSON form with an appropriate section name. 
                  - The form should focus on '${message}'.
                  - Include only JSON output with:
                    {
                      "sectionName": "Suggested Section Title",
                      "fields": [
                        {
                          "type": "radio",
                          "question": "Example radio question?",
                          "options": ["Option1", "Option2"]
                        },
                        {
                          "type": "checkbox",
                          "question": "Example checkbox question?",
                          "options": ["Option1", "Option2", "Option3"]
                        },
                        {
                          "type": "textarea",
                          "question": "Example open-ended question?"
                        }
                      ]
                    }
                  - Ensure that the JSON contains a "sectionName" and a "fields" array.
                  - Do not wrap the JSON inside markdown formatting.
                  - Return only JSON, no explanations.`
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      let aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      aiText = aiText.replace(/```json|```/g, "").trim();

      let parsed;
      try {
        parsed = JSON.parse(aiText);
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        parsed = { sectionName: "AI Generated Section", fields: [] };
      }

      if (Array.isArray(parsed.fields)) {
        const aiSection: Section = {
          id: Date.now().toString(),
          title: parsed.sectionName || "AI Generated Section",
          fields: parsed.fields.map((field: { type: 'textarea' | 'radio' | 'checkbox'; question: string; options?: string[] }, index: number) => ({
            id: `${Date.now()}-${index}`,
            type: field.type,
            question: field.question,
            value: "",
            options: field.options || []
          }))
        };

        setSections(prev => [...prev, aiSection]);
        setCurrentSection(aiSection.id);
      } else {
        console.warn("AI response did not contain a valid 'fields' array.");
      }
    } catch (error) {
      console.error("Failed to fetch AI response:", error);
    }
  };

  const handleStartSection = () => {
    const title = prompt('Enter Section Name:');
    if (title) {
      const newSection: Section = {
        id: Date.now().toString(),
        title,
        fields: [],
      };
      setSections(prev => [...prev, newSection]);
      setCurrentSection(newSection.id);
    }
  };

  const handleAddField = (type: 'textarea' | 'radio' | 'checkbox') => {
    if (!currentSection) {
      alert('Please start a section first.');
      return;
    }

    setSections(prevSections =>
      prevSections.map(section =>
        section.id === currentSection
          ? {
              ...section,
              fields: [
                ...section.fields,
                {
                  id: Date.now().toString(),
                  type,
                  question: `Question ${section.fields.length + 1}`,
                  value: '',
                  options: type !== 'textarea' ? ["Option 1"] : undefined
                },
              ],
            }
          : section
      )
    );
  };

  const handleFieldChange = (sectionId: string, fieldId: string, fieldKey: keyof Field, newValue: string | string[]) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.map(field =>
                field.id === fieldId ? { ...field, [fieldKey]: newValue } : field
              )
            }
          : section
      )
    );
  };

  const handleAddOption = (sectionId: string, fieldId: string) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.map(field =>
                field.id === fieldId
                  ? {
                      ...field,
                      options: [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`]
                    }
                  : field
              )
            }
          : section
      )
    );
  };

  const handleRemoveOption = (sectionId: string, fieldId: string, optionIndex: number) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.map(field =>
                field.id === fieldId
                  ? {
                      ...field,
                      options: field.options?.filter((_, index) => index !== optionIndex) || []
                    }
                  : field
              )
            }
          : section
      )
    );
  };

  const handleRemoveField = (sectionId: string, fieldId: string) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.filter(field => field.id !== fieldId)
            }
          : section
      )
    );
  };

  const handleGenerateUrl = () => {
    setShowMetadataModal(true);
  };

  const handleMetadataSubmit = () => {
    const formData = JSON.stringify({
      metadata: formMetadata,
      sections: sections
    });
    const encodedData = encodeURIComponent(formData);
    const url = `${window.location.origin}/form?data=${encodedData}`;
    setGeneratedUrl(url);
    setShowMetadataModal(false);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(generatedUrl || '');
    setGeneratedUrl(null);
  };

  const renderPreviewField = (field: Field) => {
    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.id} style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{field.question}</label>
            <textarea 
              value={field.value} 
              onChange={(e) => handleFieldChange(sections[0].id, field.id, 'value', e.target.value)}
              style={{ width: '100%', minHeight: '100px', padding: '8px' }}
            />
          </div>
        );
      case 'checkbox':
        return (
          <div key={field.id} style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{field.question}</label>
            <div style={{ marginLeft: '20px' }}>
              {field.options?.map((option, index) => (
                <div key={index} style={{ marginBottom: '5px' }}>
                  <input 
                    type="checkbox" 
                    checked={field.value === option} 
                    onChange={() => handleFieldChange(sections[0].id, field.id, 'value', option)}
                  />
                  <label style={{ marginLeft: '5px' }}>{option}</label>
                </div>
              ))}
            </div>
          </div>
        );
      case 'radio':
        return (
          <div key={field.id} style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{field.question}</label>
            <div style={{ marginLeft: '20px' }}>
              {field.options?.map((option, index) => (
                <div key={index} style={{ marginBottom: '5px' }}>
                  <input 
                    type="radio" 
                    name={field.id} 
                    checked={field.value === option} 
                    onChange={() => handleFieldChange(sections[0].id, field.id, 'value', option)}
                  />
                  <label style={{ marginLeft: '5px' }}>{option}</label>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '15px' }}>
        {!isPreview && (
          <>
            <TxtArea handleClick={() => handleAddField('textarea')} />
            <RadioArea handleClick={() => handleAddField('radio')} />
            <Checkbox handleClick={() => handleAddField('checkbox')} />
            <CategorizationBtn handleClick={handleStartSection} handleEnd={() => setCurrentSection(null)} isCategorizing={!!currentSection} />
            <AskAi onRequest={handleAiRequest} />
          </>
        )}
        <button 
          onClick={() => setIsPreview(!isPreview)}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: isPreview ? '#ff4444' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isPreview ? 'Edit Form' : 'Preview Form'}
        </button>
        {!isPreview && (
          <button 
            onClick={handleGenerateUrl}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Create URL
          </button>
        )}
      </div>
      {generatedUrl && (
        <div style={{ 
          marginBottom: '15px', 
          padding: '10px', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '4px',
          wordBreak: 'break-all'
        }}>
          <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>Shareable URL:</div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input 
              type="text" 
              value={generatedUrl} 
              readOnly 
              style={{ 
                flex: 1, 
                padding: '8px', 
                border: '1px solid #ddd', 
                borderRadius: '4px' 
              }}
            />
            <button 
              onClick={handleCopyUrl}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Copy
            </button>
          </div>
        </div>
      )}
      <div style={{ overflowY: 'auto', height: '500px', padding: '10px' }}>
        {sections.map(section => (
          <div key={section.id} style={{ marginBottom: '30px' }}>
            <h2>{section.title}</h2>
            {isPreview ? (
              section.fields.map(field => renderPreviewField(field))
            ) : (
              section.fields.map(field => {
                switch (field.type) {
                  case 'textarea':
                    return (
                      <div key={field.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                        <div style={{ flex: 1 }}>
                          <TxtAreaLabelFieldComponent id={field.id} question={field.question} value={field.value} onQuestionChange={(id, val) => handleFieldChange(section.id, id, 'question', val)} onValueChange={(id, val) => handleFieldChange(section.id, id, 'value', val)} />
                        </div>
                        <button 
                          onClick={() => handleRemoveField(section.id, field.id)}
                          style={{ 
                            padding: '4px 8px',
                            backgroundColor: '#ff4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  case 'checkbox':
                    return (
                      <div key={field.id} style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                          <div style={{ flex: 1 }}>
                            <CheckBoxFieldLabel 
                              id={field.id} 
                              question={field.question} 
                              options={field.options || []} 
                              onQuestionChange={(id, val) => handleFieldChange(section.id, id, 'question', val)} 
                              onOptionsChange={(id, val) => handleFieldChange(section.id, id, 'options', val)}
                              onRemoveOption={(id, index) => handleRemoveOption(section.id, id, index)}
                            />
                          </div>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <button 
                              className="button-success"
                              onClick={() => handleAddOption(section.id, field.id)}
                            >
                              Add Option
                            </button>
                            <button 
                              className="button-danger"
                              onClick={() => handleRemoveField(section.id, field.id)}
                            >
                              Remove Question
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  case 'radio':
                    return (
                      <div key={field.id} style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                          <div style={{ flex: 1 }}>
                            <RadioFieldLabel 
                              id={field.id} 
                              question={field.question} 
                              options={field.options || []} 
                              onQuestionChange={(id, val) => handleFieldChange(section.id, id, 'question', val)} 
                              onOptionsChange={(id, val) => handleFieldChange(section.id, id, 'options', val)}
                              onRemoveOption={(id, index) => handleRemoveOption(section.id, id, index)}
                            />
                          </div>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <button 
                              className="button-success"
                              onClick={() => handleAddOption(section.id, field.id)}
                            >
                              Add Option
                            </button>
                            <button 
                              className="button-danger"
                              onClick={() => handleRemoveField(section.id, field.id)}
                            >
                              Remove Question
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  default:
                    return null;
                }
              })
            )}
          </div>
        ))}
      </div>
      {showMetadataModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '400px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ 
              marginBottom: '20px',
              color: '#333',
              fontSize: '24px'
            }}>Form Details</h2>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px',
                color: '#555',
                fontWeight: '500'
              }}>Company Logo URL:</label>
              <input
                type="text"
                value={formMetadata.logo}
                onChange={(e) => setFormMetadata({ ...formMetadata, logo: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  color: '#333',
                  backgroundColor: '#ffffff',
                  fontSize: '14px'
                }}
                placeholder="Enter logo URL"
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px',
                color: '#555',
                fontWeight: '500'
              }}>Form Name:</label>
              <input
                type="text"
                value={formMetadata.name}
                onChange={(e) => setFormMetadata({ ...formMetadata, name: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  color: '#333',
                  backgroundColor: '#ffffff',
                  fontSize: '14px'
                }}
                placeholder="Enter form name"
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px',
                color: '#555',
                fontWeight: '500'
              }}>Form Field:</label>
              <input
                type="text"
                value={formMetadata.field}
                onChange={(e) => setFormMetadata({ ...formMetadata, field: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  color: '#333',
                  backgroundColor: '#ffffff',
                  fontSize: '14px'
                }}
                placeholder="Enter form field (e.g., healthcare, education)"
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowMetadataModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#666',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#555'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#666'}
              >
                Cancel
              </button>
              <button
                onClick={handleMetadataSubmit}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
              >
                Generate URL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DisplayFormComponents;
