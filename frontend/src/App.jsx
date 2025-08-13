import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [apiMessage, setApiMessage] = useState('');
  const [health, setHealth] = useState(null);

  useEffect(() => {
    axios.get('/api/v1/hello')
      .then(res => setApiMessage(res.data.message))
      .catch(err => setApiMessage('Error: ' + err.message));

    axios.get('/health')
      .then(res => setHealth(res.data))
      .catch(err => setHealth({ status: 'error', error: err.message }));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Frontend → Backend Test</h1>
      <p><strong>Message:</strong> {apiMessage}</p>
      <p><strong>Health:</strong> {health ? JSON.stringify(health) : 'Loading...'}</p>
    </div>
  );
}

export default App;
