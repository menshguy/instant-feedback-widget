## Sign In and Sign Up Features
The following document will outline the requirements for the project

This project will be a simple npm package.

## NPM Package
1. The npm package will be called "instant-feedback"
2. You will need to help me publish this package.
3. I should be able to npm install this package easily into any react project and have it display the widgent described below


## Clippy-style Compoment
1. This package will be a single React Component. The component will create a clipply style widget that sits in one of the four corners of the screen.
2. It will accept 3 props: icon (by defaul, a feedback icon of your choosing), text (by default, none. Any text provided will appear beneat the icon), position (by default, bottom right corner, but all 4 corners as options), and label (required, this will denote the feature that the user is providing feedback on.)

## Feedback Component
1. Clicking on the icon will open a feedback modal.
2. The modal will contain the title "Provide Feedback on {label}"
3. The modal should have a form that allows users to submit feedback. 
4. The form should include a quick thumbs up/down icon, an optional text input field for the user to provide feedback, an optional email field for the user to provide feedback, and a submit button.
5. Submitting the form should send the data to a Formspree form. Below is an example form from formspree that you must adapte to meet the requirements above.

```
// Make sure to run npm install @formspree/react
import React from 'react';
import { useForm, ValidationError } from '@formspree/react';

function ContactForm() {
  const [state, handleSubmit] = useForm("mzzdljjz");
  if (state.succeeded) {
      return <p>Thanks for joining!</p>;
  }
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">
        Email Address
      </label>
      <input
        id="email"
        type="email" 
        name="email"
      />
      <ValidationError 
        prefix="Email" 
        field="email"
        errors={state.errors}
      />
      <textarea
        id="message"
        name="message"
      />
      <ValidationError 
        prefix="Message" 
        field="message"
        errors={state.errors}
      />
      <button type="submit" disabled={state.submitting}>
        Submit
      </button>
    </form>
  );
}

function App() {
  return (
    <ContactForm />
  );
}

export default App;
```
