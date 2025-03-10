import React, { useState } from 'react';
import TxtArea from './TxtArea';
import RadioArea from './RadioArea';
import Checkbox from './CheckBoxArea';
import CategorizationBtn from './CategorizationBtn';
import TxtAreaLabelFieldComponent from './TxtAreaLabelFieldComponent';
import CheckBoxFieldLabel from './CheckBoxFieldLabel';
import RadioFieldLabel from './RadioFieldLabel';
import AskAi from './AskAi';
import { GeneratedField, GeneratedForm } from './GeneratedForm';


interface Field {
  id: string;
  type: 'textarea' | 'radio' | 'checkbox';
  question: string;
  value: string;
  checked?: boolean;
}

interface Section {
  id: string;
  title: string;
  fields: Field[];
}

function DisplayFormComponents() {
  const [sections, setSections] = useState<Section[]>([]);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [aiGeneratedFields, setAiGeneratedFields] = useState<GeneratedField[]>([]);


  
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
                  text: `Generate a JSON structure for a form using radio buttons, checkboxes, and text inputs. The form should focus on '${message}'.
                  
                  **Important Instructions:**
                  - Return only JSON. No markdown, no explanations.
                  - JSON format:
                  {
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
                  - Ensure the JSON contains a **fields array**.
                  - Do not wrap the JSON in markdown or backticks.`
                }
              ]
            }
          ]
        })
      });
  
      const data = await response.json();
      let aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
      // Remove possible markdown artifacts if present
      aiText = aiText.replace(/```json|```/g, "").trim();
  
      let parsed;
      try {
        parsed = JSON.parse(aiText);
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        parsed = { fields: [] }; // Default empty structure
      }
  
      if (Array.isArray(parsed.fields)) {
        setAiGeneratedFields(parsed.fields);
      } else {
        console.warn("AI response did not contain a valid 'fields' array.");
        setAiGeneratedFields([]); // Ensure it's always an array
      }
    } catch (error) {
      console.error("Failed to fetch AI response:", error);
      setAiGeneratedFields([]); // Prevent undefined state
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

  const handleEndSection = () => {
    setCurrentSection(null);
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
                },
              ],
            }
          : section
      )
    );
  };

  const handleChange = (sectionId: string, fieldId: string, newValue: string | boolean) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.map(field =>
                field.id === fieldId ? { ...field, value: newValue.toString() } : field
              )
            }
          : section
      )
    );
  };

  return (
    <div style={{ padding: '10px' }}>
      {/* Buttons aligned to top-right */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '15px' }}>
        <TxtArea handleClick={() => handleAddField('textarea')} />
        <RadioArea handleClick={() => handleAddField('radio')} />
        <Checkbox handleClick={() => handleAddField('checkbox')} />
        <CategorizationBtn
          handleClick={handleStartSection}
          handleEnd={() => setCurrentSection(null)}
          isCategorizing={!!currentSection}
        />
        <AskAi
          onRequest={(message) => {
            handleAiRequest(message);
          }}
        />
      </div>
  
      {/* Scrollable Display Area for User-created Sections */}
      <div style={{ overflowY: 'auto', height: '500px', padding: '10px' }}>
        {sections.map(section => (
          <div key={section.id} style={{ marginBottom: '30px' }}>
            <h2>{section.title}</h2>
            {section.fields.map(field => {
              switch (field.type) {
                case 'textarea':
                  return (
                    <TxtAreaLabelFieldComponent
                      key={field.id}
                      id={field.id}
                      label={field.question}
                      value={field.value}
                      onChange={(id, val) => handleChange(section.id, id, val)}
                    />
                  );
                case 'checkbox':
                  return (
                    <CheckBoxFieldLabel
                      key={field.id}
                      id={field.id}
                      label={field.question}
                      question={field.question}
                      checked={field.value === 'true'}
                      onCheckChange={(id, checked) => handleChange(section.id, id, checked)}
                      onQuestionChange={(id, val) => handleChange(section.id, id, val)}
                    />
                  );
                case 'radio':
                  return (
                    <RadioFieldLabel
                      key={field.id}
                      id={field.id}
                      question={field.question}
                      selected={field.value === 'true'}
                      onSelectChange={(id: string) => handleChange(section.id, id, true)}
                      onQuestionChange={(id: string, val: string) => handleChange(section.id, id, val)}
                    />
                  );
                default:
                  return null;
              }
            })}
          </div>
        ))}
  
        {/* AI-generated fields */}
        {aiGeneratedFields && aiGeneratedFields.length > 0 ? (
  aiGeneratedFields.map((field, idx) => (
    <div key={idx}>
      <h3>{field.question}</h3>
      {field.type === 'radio' &&
        field.options?.map(opt => (
          <label key={opt}>
            <input type="radio" name={`radio-${idx}`} />
            {opt}
          </label>
        ))}
      {field.type === 'checkbox' &&
        field.options?.map(opt => (
          <label key={opt}>
            <input type="checkbox" />
            {opt}
          </label>
        ))}
      {field.type === 'textarea' && <textarea rows={4} cols={50} />}
    </div>
  ))
) : (
  <p>No AI-generated fields yet.</p>
)}

      </div>
    </div>
  );
}

export default DisplayFormComponents;
