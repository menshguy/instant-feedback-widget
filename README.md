# instant-feedback

A Clippy-style feedback widget for React applications. This package provides a simple way to add a feedback collection widget to your React application and have the feedback emailed to you.

## Setup Formspree

1. First, create a free https://formspree.io/ Account
2. Create a form, and grab the form ID (Looks something like this: "mzzdlejz")

## Installation

```bash
npm install instant-feedback
```

## Usage

```jsx
import FeedbackWidget from 'instant-feedback';

function App() {
  return (
    <div>
      <h1>My App</h1>
      <FeedbackWidget 
        label="Homepage" // Required - identifies the feature being rated
        icon="💭"       // Optional - default is 💭
        text="Feedback" // Optional - text to show below icon
        position="bottom-right" // Optional - one of: 'top-left', 'top-right', 'bottom-left', 'bottom-right'
      />
    </div>
  );
}
```

## Props

- `label` (required): String that identifies the feature being rated
- `formId` (required): Formspree ID 
- `icon` (optional): Emoji or text to use as the widget icon. Default: "💭"
- `text` (optional): Text to display below the icon. Default: none
- `position` (optional): Corner position for the widget. Options: "top-left", "top-right", "bottom-left", "bottom-right". Default: "bottom-right"
- `containerStyle` (optional): Object containing CSS styles to be applied to the widget container. Default: {}
- `prefillEmail` (optional): If you want to prefill the senders email, like from a users account

## Example with Custom Styling

```jsx
import FeedbackWidget from 'instant-feedback';

function App() {
  return (
    <div>
      <h1>My App</h1>
      <FeedbackWidget 
        label="Homepage"
        icon="🌟"
        text="Rate us!"
        position="bottom-right"
        containerStyle={{
          background: '#f0f9ff',
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'transform 0.2s ease'
        }}
      />
    </div>
  );
}
```

## Features

- Clippy-style widget that sits in any corner of the screen
- Clicking opens a feedback modal
- Collect feedback with thumbs up/down
- Optional text feedback
- Optional email collection
- Integrates with Formspree for form submission

## License

MIT
