import React, { useState, useEffect, useRef } from 'react';
import VoiceAuth from '../utils/VoiceAuth';
import { authService } from '../services/api';
import './AuthStyles.css';

import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    aadhaar: '',
    dob: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      
      // Update form data based on parsed data
      if (parsedData.firstName) {
        setFormData(prev => ({
          ...prev,
          firstName: parsedData.firstName
        }));
      }
      
      if (parsedData.lastName) {
        setFormData(prev => ({
          ...prev,
          lastName: parsedData.lastName
        }));
      }
      
      if (parsedData.email) {
        setFormData(prev => ({
          ...prev,
          email: parsedData.email
        }));
      }
      
      if (parsedData.phone) {
        setFormData(prev => ({
          ...prev,
          phone: parsedData.phone
        }));
      }
      
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.phone || !formData.username || !formData.password) {
      setError('Please fill in all required fields');
      voiceAuthRef.current.speak('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      voiceAuthRef.current.speak('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      voiceAuthRef.current.speak('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    setAuthStatus('Creating your account...');
    setError('');
    
    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        username: formData.username,
        password: formData.password,
      };
      
      const response = await authService.register(userData);
      
      if (response.success) {
        setSuccess('Registration successful! You can now log in.');
        voiceAuthRef.current.speak('Registration successful! You can now log in.');
        setAuthStatus('');
        
        // After a short pause, navigate to the login page
        setTimeout(() => {
          navigate('/login');
        }, 1500);

        // Reset form after successful registration
        setTimeout(() => {
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            username: '',
            password: '',
            confirmPassword: '',
            aadhaar: '',
            dob: ''
          });
        }, 2000);
      } else {
        setError(response.message || 'Registration failed');
        voiceAuthRef.current.speak(response.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
      voiceAuthRef.current.speak('Registration failed, please try again');
    } finally {
      setIsLoading(false);
    }
  };

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
  
  // Auto-fill form based on voice input
  useEffect(() => {
    if (authStatus.includes('Heard:')) {
      // Process parsed data automatically
    }
  }, [authStatus]);

  const speakInstruction = (instruction) => {
    if (voiceAuthRef.current) {
      voiceAuthRef.current.speak(instruction);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🎙️ voiceBank Register</h1>
          <p>Create your account to access voice banking services</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          {authStatus && !success && (
            <div className={`status-message ${authStatus.includes('Error') || authStatus.includes('Invalid') ? 'error' : 'info'}`}>
              {authStatus}
            </div>
          )}

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="firstName">First Name *</label>
              <div className="input-with-voice">
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  aria-label="First name"
                />
                <button
                  type="button"
                  className={`voice-btn ${isListening ? 'listening' : ''}`}
                  onClick={() => {
                    startVoiceRecognition();
                    speakInstruction("Please say your first name");
                  }}
                  title="Use voice input for first name"
                  aria-label="Voice input for first name"
                >
                  {isListening ? '🔴' : '🎤'}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="lastName">Last Name *</label>
              <div className="input-with-voice">
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  aria-label="Last name"
                />
                <button
                  type="button"
                  className={`voice-btn ${isListening ? 'listening' : ''}`}
                  onClick={() => {
                    startVoiceRecognition();
                    speakInstruction("Please say your last name");
                  }}
                  title="Use voice input for last name"
                  aria-label="Voice input for last name"
                >
                  {isListening ? '🔴' : '🎤'}
                </button>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="email">Email *</label>
              <div className="input-with-voice">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  aria-label="Email address"
                />
                <button
                  type="button"
                  className={`voice-btn ${isListening ? 'listening' : ''}`}
                  onClick={() => {
                    startVoiceRecognition();
                    speakInstruction("Please say your email address");
                  }}
                  title="Use voice input for email"
                  aria-label="Voice input for email"
                >
                  {isListening ? '🔴' : '🎤'}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="phone">Phone Number *</label>
              <div className="input-with-voice">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  aria-label="Phone number"
                />
                <button
                  type="button"
                  className={`voice-btn ${isListening ? 'listening' : ''}`}
                  onClick={() => {
                    startVoiceRecognition();
                    speakInstruction("Please say your phone number");
                  }}
                  title="Use voice input for phone number"
                  aria-label="Voice input for phone number"
                >
                  {isListening ? '🔴' : '🎤'}
                </button>
              </div>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="username">Username *</label>
            <div className="input-with-voice">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                aria-label="Username"
              />
              <button
                type="button"
                className={`voice-btn ${isListening ? 'listening' : ''}`}
                onClick={() => {
                  startVoiceRecognition();
                  speakInstruction("Please say your desired username");
                }}
                title="Use voice input for username"
                aria-label="Voice input for username"
              >
                {isListening ? '🔴' : '🎤'}
              </button>
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="password">Password *</label>
              <div className="input-with-voice">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
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

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <div className="input-with-voice">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  aria-label="Confirm password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  title="Show/hide confirm password"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
                <button
                  type="button"
                  className={`voice-btn ${isListening ? 'listening' : ''}`}
                  onClick={() => {
                    startVoiceRecognition();
                    speakInstruction("Please say your password again to confirm");
                  }}
                  title="Use voice input for confirm password"
                  aria-label="Voice input for confirm password"
                >
                  {isListening ? '🔴' : '🎤'}
                </button>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="aadhaar">Aadhaar Number</label>
              <div className="input-with-voice">
                <input
                  type="text"
                  id="aadhaar"
                  name="aadhaar"
                  value={formData.aadhaar}
                  onChange={handleChange}
                  placeholder="Enter Aadhaar number (optional)"
                  aria-label="Aadhaar number"
                />
                <button
                  type="button"
                  className={`voice-btn ${isListening ? 'listening' : ''}`}
                  onClick={() => {
                    startVoiceRecognition();
                    speakInstruction("Please say your Aadhaar number");
                  }}
                  title="Use voice input for Aadhaar number"
                  aria-label="Voice input for Aadhaar number"
                >
                  {isListening ? '🔴' : '🎤'}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="dob">Date of Birth</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                aria-label="Date of birth"
              />
            </div>
          </div>

          <div className="form-agreement">
            <label className="checkbox-label">
              <input type="checkbox" required aria-label="Agree to terms" />
              <span className="checkmark"></span>
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          <button type="submit" className="auth-btn" disabled={authStatus.includes('Creating')}>
            {authStatus.includes('Creating') ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="voice-instructions">
          <h3>Voice Commands:</h3>
          <ul>
            <li>Say: "My name is John Doe, email is john@example.com, phone is 9876543210"</li>
            <li>Say: "Username is johndoe, password is secret123"</li>
          </ul>
        </div>

        <div className="auth-footer">
          <p>Already have an account? <a href="/login">Sign In</a></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;