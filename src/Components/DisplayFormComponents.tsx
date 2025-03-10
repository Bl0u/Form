import React, { useState } from 'react';
import TxtArea from './TxtArea';
import RadioArea from './RadioArea';
import Checkbox from './CheckBoxArea';
import CategorizationBtn from './CategorizationBtn';
import TxtAreaLabelFieldComponent from './TxtAreaLabelFieldComponent';
import CheckBoxFieldLabel from './CheckBoxFieldLabel';
import RadioFieldLabel from './RadioFieldLabel';
import AskAi from './AskAi';

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

  return (
    <div style={{ padding: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '15px' }}>
        <TxtArea handleClick={() => handleAddField('textarea')} />
        <RadioArea handleClick={() => handleAddField('radio')} />
        <Checkbox handleClick={() => handleAddField('checkbox')} />
        <CategorizationBtn handleClick={handleStartSection} handleEnd={() => setCurrentSection(null)} isCategorizing={!!currentSection} />
        <AskAi onRequest={handleAiRequest} />
      </div>
      <div style={{ overflowY: 'auto', height: '500px', padding: '10px' }}>
        {sections.map(section => (
          <div key={section.id} style={{ marginBottom: '30px' }}>
            <h2>{section.title}</h2>
            {section.fields.map(field => {
              switch (field.type) {
                case 'textarea':
                  return <TxtAreaLabelFieldComponent key={field.id} id={field.id} question={field.question} value={field.value} onQuestionChange={(id, val) => handleFieldChange(section.id, id, 'question', val)} onValueChange={(id, val) => handleFieldChange(section.id, id, 'value', val)} />;
                case 'checkbox':
                  return <CheckBoxFieldLabel key={field.id} id={field.id} question={field.question} options={field.options || []} onQuestionChange={(id, val) => handleFieldChange(section.id, id, 'question', val)} onOptionsChange={(id, val) => handleFieldChange(section.id, id, 'options', val)} />;
                case 'radio':
                  return <RadioFieldLabel key={field.id} id={field.id} question={field.question} options={field.options || []} onQuestionChange={(id, val) => handleFieldChange(section.id, id, 'question', val)} onOptionsChange={(id, val) => handleFieldChange(section.id, id, 'options', val)} />;
                default:
                  return null;
              }
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DisplayFormComponents;
