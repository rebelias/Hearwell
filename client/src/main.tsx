import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './i18n/config'; // Initialize i18n

createRoot(document.getElementById('root')!).render(<App />);
