import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 👇 1. सबसे पहले रिएक्ट क्वेरी को यहाँ इम्पोर्ट करें
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 👇 2. क्वेरी क्लाइंट का एक इंस्टेंस बनाएं
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
  </StrictMode >,
)
