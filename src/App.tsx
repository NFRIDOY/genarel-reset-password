import { useState, useEffect } from 'react';
import './App.css';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

interface DecodedToken {
  email: string;
  backend: string;
}

function App() {
  const [password, setPassword] = useState('');
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token') as string;
    setToken(token);
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        console.log("decoded", decoded)
        setDecodedToken(decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (decodedToken) {
  //     try {
  //       const response = await fetch(decodedToken?.backend, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         // body: JSON.stringify({ email: decodedToken?.email, newPassword }),
  //         body: JSON.stringify({ newPassword: password }),
  //       });
  //       if (response.ok) {
  //         alert('Password reset successfully!');
  //       } else {
  //         alert('Failed to reset password.');
  //       }
  //     } catch (error) {
  //       console.error('Error resetting password:', error);
  //       alert('An error occurred while resetting the password.');
  //     }
  //   }
  // };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!decodedToken?.backend || !password) {
      alert('Missing backend URL or password.');
      return;
    }

    try {
      console.log("decodedToken?.backend", decodedToken?.backend)
      const urlWithToken = await `${decodedToken.backend}?token=${token as string}`;
      const response = await axios.post(urlWithToken, {
        auth: { newPassword: password },
        // Optionally include email if your backend expects it:
        // email: decodedToken.email,
      });
      console.log("response", response)
      if (response.status === 200) {
        alert('Password reset successfully!');
      } else {
        alert(`Failed to reset password. Status: ${response.status}`);
      }
    } catch (error: any) {
      console.error('Error resetting password:', error);
      alert(
        error.response?.data?.message ||
        'An error occurred while resetting the password.'
      );
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Genarel Reset Password</h1>
      </header>
      <div className="card">
        {decodedToken ? (
          <form onSubmit={handleSubmit}>
            <h1>Reset Your Password</h1>
            <p className="subtitle">
              Welcome back! Please enter your new password for {decodedToken.email}.
            </p>
            <div className="input-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Reset Password</button>
          </form>
        ) : (
          <div className="error-message">
            <h1>Invalid Token</h1>
            <p>The link you used is either invalid or has expired. Please request a new password reset link.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;