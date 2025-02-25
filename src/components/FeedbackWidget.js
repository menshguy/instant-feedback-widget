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
  ${props => props.containerstyle && Object.entries(props.containerstyle).map(([key, value]) => `${key}: ${value};`).join('\n')}
  font-family: 'Manrope', sans-serif;
  font-size: 20px;
`;

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  font-family: 'Manrope', sans-serif;
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
  max-width: 500px;
  width: 90%;
  z-index: 1000;
  font-family: 'Manrope', sans-serif;
  font-size: 20px;
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
  font-family: 'Manrope', sans-serif;
  font-size: 20px;
`;

const ThumbsContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 15px;
  font-family: 'Manrope', sans-serif;
  font-size: 20px;
`;

const ThumbButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: ${props => props.selected ? '20px' : '36px'};
  opacity: ${props => props.selected ? 1 : 0.25};
  transition: opacity 0.2s;
  font-family: 'Manrope', sans-serif;
  
  &:hover {
    font-size: 36px;
    opacity: 0.5;
  }
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white !important;
  font-family: 'Manrope', sans-serif;
  font-size: 20px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Manrope', sans-serif;
  font-size: 20px;
  min-height: 100px;
`;

const SubmitButton = styled.button`
  padding: 10px;
  background: #8ac2ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Manrope', sans-serif;
  font-size: 20px;
  
  &:disabled {
    opacity: 0.25;
  }
  
  &:hover:not(:disabled) {
    background: #668fbd;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 5px 10px;
  color: #666;
  font-family: 'Manrope', sans-serif;
  
  &:hover {
    color: #ffffff;
  }
`;

const FeedbackWidget = ({ 
  icon = "💭", 
  text = "", 
  position = "bottom-right",
  label,
  containerstyle = {},
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
  
  // Check if label is provided - required
  if (!label) {
    console.error("Label prop is required for FeedbackWidget. This is used to determine what the user is providing feedback on.");
    return null;
  }

  const [state, handleSubmit] = useForm(formId);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (state.succeeded) {
      state.reset();
    }
  }, [state]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('sentiment', sentiment);
    formData.append('label', label);
    
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
          <CloseButton onClick={handleClose}>×</CloseButton>
          <h2>Thank you for your feedback!</h2>
          <SubmitButton type="button" onClick={handleClose}>Close</SubmitButton>
        </Modal>
      </>
    );
  }

  return (
    <React.Fragment>
      <WidgetContainer position={position} containerstyle={containerstyle} onClick={() => setIsOpen(true)}>
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
