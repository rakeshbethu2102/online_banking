import React, { useState, useEffect, useRef } from 'react';
import VoiceAuth from '../utils/VoiceAuth';
import { authService } from '../services/api';
import './AuthStyles.css';

import { useNavigate } from 'react-router-dom';

const LoginPage = ({ login }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authStatus, setAuthStatus] = useState(''); // For voice authentication status
  
  const voiceAuthRef = useRef(null);

  // Initialize voice authentication
  useEffect(() => {
    voiceAuthRef.current = new VoiceAuth();
    
    // Set up callbacks
    voiceAuthRef.current.setOnResult((transcript) => {
      setIsListening(false);
      setAuthStatus(`Heard: ${transcript}`);
      
      // Parse the command
      const parsedData = voiceAuthRef.current.parseAuthCommand(transcript);
      
      if (parsedData.username) {
        setFormData(prev => ({
          ...prev,
          username: parsedData.username
        }));
      }
      
      if (parsedData.password) {
        setFormData(prev => ({
          ...prev,
          password: parsedData.password
        }));
      }
      
      // If both username and password are captured, auto-submit
        if (parsedData.username && parsedData.password) {
        // Auto-fill form with parsed data
        setFormData({
          username: parsedData.username,
          password: parsedData.password
        });
        
        // Optionally auto-submit if both fields are filled
        // Uncomment the following lines if auto-submit is desired:
        // setTimeout(() => {
        //   handleVoiceSubmit(parsedData);
        // }, 1000);
      }
    });
    
    voiceAuthRef.current.setOnError((event) => {
      setIsListening(false);
      setAuthStatus('');
      setError(`Voice recognition error: ${event.error}`);
      voiceAuthRef.current.speak(`Sorry, I couldn't understand that. ${event.error}`);
    });
    
    voiceAuthRef.current.setOnStart(() => {
      setIsListening(true);
      setAuthStatus('Listening...');
      setError('');
    });
    
    voiceAuthRef.current.setOnEnd(() => {
      setIsListening(false);
      if (authStatus === 'Listening...') {
        setAuthStatus('');
      }
    });
    
    // Load voices for speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthesis.onvoiceschanged = () => {
        // Voices are loaded
      };
    }
    
    // Cleanup on unmount
    return () => {
      if (voiceAuthRef.current) {
        voiceAuthRef.current.abort();
      }
    };
  }, []);

  const handleVoiceSubmit = async (parsedData) => {
    if (!parsedData.username || !parsedData.password) {
      setError('Please provide both username and password through voice');
      voiceAuthRef.current.speak('Please provide both username and password');
      return;
    }
    
    // Set form data and trigger submit
    setFormData({
      username: parsedData.username,
      password: parsedData.password
    });
    
    // Submit the form
    await handleSubmitFromData({
      username: parsedData.username,
      password: parsedData.password
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmitFromData = async (data) => {
    setIsLoading(true);
    setError('');
    setAuthStatus('Authenticating...');
    
    try {
      const response = await authService.login(data);
      
      if (response.success) {
        login(response); // Pass the full response object
        voiceAuthRef.current.speak(`Welcome back, ${response.user.firstName || response.user.username}!`);
        setAuthStatus('Login successful!');
        // Navigation is handled by App router when isAuthenticated becomes true
      } else {
        setError(response.message || 'Login failed');
        voiceAuthRef.current.speak(response.message || 'Login failed, please try again');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login');
      voiceAuthRef.current.speak('Login failed, please try again');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      voiceAuthRef.current.speak('Please enter both username and password');
      return;
    }
    
    await handleSubmitFromData(formData);
  };
  
  // Auto-login if both username and password are filled from voice input
  useEffect(() => {
    if (formData.username && formData.password && formData.username.trim() && formData.password.trim()) {
      const autoLogin = async () => {
        if (!isLoading && !authStatus.includes('Authenticating')) {
          await handleSubmitFromData(formData);
        }
      };
      
      // Only auto-login if both fields were populated via voice
      if (authStatus.includes('Heard:')) {
        const timer = setTimeout(() => {
          autoLogin();
        }, 1500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [formData]);

  const startVoiceRecognition = () => {
    if (!voiceAuthRef.current.isSupported) {
      setError('Voice recognition not supported in your browser');
      voiceAuthRef.current.speak('Voice recognition is not supported in your browser');
      return;
    }
    
    try {
      voiceAuthRef.current.initialize({
        continuous: false,
        interimResults: false,
        language: 'en-US'
      });
      voiceAuthRef.current.start();
    } catch (err) {
      setError(err.message);
      voiceAuthRef.current.speak('Error initializing voice recognition');
    }
  };

  const speakInstruction = (instruction) => {
    if (voiceAuthRef.current) {
      voiceAuthRef.current.speak(instruction);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🎙️ voiceBank Login</h1>
          <p>Welcome back! Please sign in to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          
          {authStatus && (
            <div className={`status-message ${authStatus.includes('Error') || authStatus.includes('Invalid') ? 'error' : 'info'}`}>
              {authStatus}
            </div>
          )}

          <div className="input-group">
            <label htmlFor="username">Username</label>
            <div className="input-with-voice">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                aria-label="Username"
              />
              <button
                type="button"
                className={`voice-btn ${isListening ? 'listening' : ''}`}
                onClick={() => {
                  startVoiceRecognition();
                  speakInstruction("Please say your username");
                }}
                title="Use voice input for username"
                aria-label="Voice input for username"
              >
                {isListening ? '🔴' : '🎤'}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-voice">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                aria-label="Password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                title="Show/hide password"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
              <button
                type="button"
                className={`voice-btn ${isListening ? 'listening' : ''}`}
                onClick={() => {
                  startVoiceRecognition();
                  speakInstruction("Please say your password");
                }}
                title="Use voice input for password"
                aria-label="Voice input for password"
              >
                {isListening ? '🔴' : '🎤'}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" aria-label="Remember me" />
              <span className="checkmark"></span>
              Remember me
            </label>
            <a href="#forgot-password" className="forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" className="auth-btn" disabled={authStatus.includes('Authenticating')}>
            {authStatus.includes('Authenticating') ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="voice-instructions">
          <h3>Voice Commands:</h3>
          <ul>
            <li>Say: "My username is john_doe and password is secret123"</li>
            <li>Say: "Login with username john_doe and password secret123"</li>
          </ul>
        </div>

        <div className="auth-footer">
          <p>Don't have an account? <a href="/register">Sign Up</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;