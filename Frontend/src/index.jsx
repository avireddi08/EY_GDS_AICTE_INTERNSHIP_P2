import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

// Lazy load the main App component for better performance
const App = lazy(() => import('../../frontend/src/App'));

// Error Boundary Component to catch runtime errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-message">
          <h2>Something went wrong 😢</h2>
          <p>Try refreshing the page or come back later.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Create root element
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<div className="loading-spinner"></div>}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>
);

// Performance reporting (can be sent to an analytics service)
reportWebVitals(console.log);
