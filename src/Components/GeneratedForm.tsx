export interface GeneratedField {
    type: 'radio' | 'checkbox' | 'textarea';
    question: string;
    options?: string[];
  }
  
  export interface GeneratedForm {
    fields: GeneratedField[];
  }
  