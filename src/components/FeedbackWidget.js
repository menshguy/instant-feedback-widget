import React, { useState, useCallback } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import styled from 'styled-components';

const WidgetContainer = styled.div`
  position: fixed;
  ${props => {
    switch(props.position) {
      case 'top-left':
        return 'top: 20px; left: 20px;';
      case 'top-right':
        return 'top: 20px; right: 20px;';
      case 'bottom-left':
        return 'bottom: 20px; left: 20px;';
      default:
        return 'bottom: 20px; right: 20px;';
    }
  }}
  cursor: pointer;
  z-index: 1000;
  ${props => props.containerStyle && Object.entries(props.containerStyle).map(([key, value]) => `${key}: ${value};`).join('\n')}
`;

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  width: 400px;
  max-width: 90vw;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ThumbsContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 15px;
`;

const ThumbButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  opacity: ${props => props.selected ? 1 : 0.5};
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.8;
  }
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
`;

const TextArea = styled.textarea`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
`;

const SubmitButton = styled.button`
  padding: 10px;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:disabled {
    background: #cccccc;
  }
  
  &:hover:not(:disabled) {
    background: #0052a3;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
  line-height: 1;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const FeedbackWidget = ({ 
  icon = "💭", 
  text = "", 
  position = "bottom-right",
  label,
  containerStyle = {},
  prefillEmail = "",
  formId
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sentiment, setSentiment] = useState(null);
  
  // Check if formId is provided - required
  if (!formId) {
    console.error('FeedbackWidget Error: formId prop is required. The widget will be disabled.');
    return null;
  }

  const [state, handleSubmit] = useForm(formId);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  if (!label) {
    console.error("Label prop is required for FeedbackWidget");
    return null;
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('sentiment', sentiment);
    
    // Convert FormData to object for Formspree
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });
    
    // Submit with sentiment included
    handleSubmit(formObject);
  };

  if (state.succeeded) {
    return (
      <>
        <Overlay onClick={handleClose} />
        <Modal onClick={e => e.stopPropagation()}>
          <CloseButton onClick={() => setIsOpen(false)}>×</CloseButton>
          <h2>Thank you for your feedback!</h2>
          <SubmitButton type="button" onClick={() => setIsOpen(false)}>Close</SubmitButton>
        </Modal>
      </>
    );
  }

  return (
    <React.Fragment>
      <WidgetContainer position={position} containerStyle={containerStyle} onClick={() => setIsOpen(true)}>
        <IconWrapper>
          <span style={{ fontSize: '24px' }}>{icon}</span>
          {text && <span>{text}</span>}
        </IconWrapper>
      </WidgetContainer>

      {isOpen && (
        <React.Fragment>
          <Overlay onClick={handleClose} />
          <Modal onClick={e => e.stopPropagation()}>
            <CloseButton onClick={() => setIsOpen(false)}>×</CloseButton>
            <h2>{label}</h2>
            <Form onSubmit={handleFormSubmit}>
              <ThumbsContainer>
                <ThumbButton
                  type="button"
                  onClick={() => setSentiment('positive 👍')}
                  selected={sentiment === 'positive'}
                >
                  👍
                </ThumbButton>
                <ThumbButton
                  type="button"
                  onClick={() => setSentiment('negative 👎')}
                  selected={sentiment === 'negative'}
                >
                  👎
                </ThumbButton>
              </ThumbsContainer>

              <TextArea
                id="message"
                name="message"
                placeholder="Your feedback (optional)"
              />
              <ValidationError prefix="Message" field="message" errors={state.errors} />

              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Your email (optional)"
                defaultValue={prefillEmail}
              />
              <ValidationError prefix="Email" field="email" errors={state.errors} />

              <SubmitButton type="submit" disabled={state.submitting}>
                Submit Feedback
              </SubmitButton>
            </Form>
          </Modal>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default FeedbackWidget;
