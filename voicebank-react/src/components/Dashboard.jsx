import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import VoiceAuth from '../utils/VoiceAuth';
import { bankingService } from '../services/api';
import './AuthStyles.css';

const Dashboard = ({ user, logout }) => {
  const navigate = useNavigate();
  // Handle user prop properly - user might be an object with firstName/username or just a string
  const displayName = (user && typeof user === 'object') 
    ? (user.firstName || user.username || 'User') 
    : (user || 'User');
  const [voiceCommand, setVoiceCommand] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);
  const [balance, setBalance] = useState(15750.50); // Mock balance
  
  const voiceAuthRef = useRef(null);

  useEffect(() => {
    voiceAuthRef.current = new VoiceAuth();
    
    // Set up callbacks
    voiceAuthRef.current.setOnResult((transcript) => {
      setIsListening(false);
      setVoiceCommand(transcript);
      
      // Add to command history
      setCommandHistory(prev => [...prev, { command: transcript, timestamp: new Date().toLocaleTimeString() }]);
      
      // Process the command
      processVoiceCommand(transcript);
    });
    
    voiceAuthRef.current.setOnError((event) => {
      setIsListening(false);
      setVoiceCommand('');
      voiceAuthRef.current.speak(`Sorry, I couldn't understand that. ${event.error}`);
    });
    
    voiceAuthRef.current.setOnStart(() => {
      setIsListening(true);
      setVoiceCommand('Listening...');
    });
    
    voiceAuthRef.current.setOnEnd(() => {
      setIsListening(false);
      if (voiceCommand === 'Listening...') {
        setVoiceCommand('');
      }
    });
    
    // Load voices for speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthesis.onvoiceschanged = () => {
        // Voices are loaded
      };
    }
    
    // Welcome message
    if (voiceAuthRef.current) {
      voiceAuthRef.current.speak(`Welcome to voiceBank, ${displayName}! How can I assist you today?`);
    }
    
    // Cleanup on unmount
    return () => {
      if (voiceAuthRef.current) {
        voiceAuthRef.current.abort();
      }
    };
  }, [displayName]);

  const processVoiceCommand = async (command) => {
    const lowerCmd = command.toLowerCase();
    
    try {
      if (lowerCmd.includes('balance') || lowerCmd.includes('money') || lowerCmd.includes('amount')) {
        // Use the existing Flask backend for processing
        const response = await bankingService.processSpeech(command);
        if (response.success) {
          voiceAuthRef.current.speak(response.response);
        } else {
          voiceAuthRef.current.speak('Unable to retrieve your account balance at this time.');
        }
      } else if (lowerCmd.includes('transfer') || lowerCmd.includes('send money')) {
        const response = await bankingService.processSpeech(command);
        if (response.success) {
          voiceAuthRef.current.speak(response.response);
        } else {
          voiceAuthRef.current.speak('You can transfer money using the transfer option on your screen.');
        }
      } else if (lowerCmd.includes('transactions') || lowerCmd.includes('history')) {
        const response = await bankingService.processSpeech(command);
        if (response.success) {
          voiceAuthRef.current.speak(response.response);
        } else {
          voiceAuthRef.current.speak('You can view your recent transactions in the transactions section.');
        }
      } else if (lowerCmd.includes('loan') || lowerCmd.includes('emi')) {
        const response = await bankingService.processSpeech(command);
        if (response.success) {
          voiceAuthRef.current.speak(response.response);
        } else {
          voiceAuthRef.current.speak('You can check your loan details in the loans section.');
        }
      } else if (lowerCmd.includes('help') || lowerCmd.includes('options')) {
        voiceAuthRef.current.speak('You can ask about your balance, transfer money, view transactions, check loan details, or get help.');
      } else if (lowerCmd.includes('logout') || lowerCmd.includes('sign out')) {
        handleLogout();
      } else {
        // For unknown commands, try processing through the backend
        const response = await bankingService.processSpeech(command);
        if (response.success) {
          voiceAuthRef.current.speak(response.response);
        } else {
          voiceAuthRef.current.speak("I'm not sure how to help with that. You can ask about balance, transfers, transactions, or loans.");
        }
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
      voiceAuthRef.current.speak('Sorry, I encountered an error processing your request. Please try again.');
    }
  };

  const handleVoiceInput = () => {
    if (!voiceAuthRef.current.isSupported) {
      alert('Voice recognition not supported in your browser');
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
      alert(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      navigate('/login');
    }
  };

  // helper for redirecting to Flask index.html page
  const goToFlaskIndex = () => {
    // open in same window
    window.location.href = 'http://localhost:5000/';
  };

  // optional: automatically redirect to the Flask index.html
  // uncomment below if you want auto-redirect:
  // useEffect(() => {
  //   const timer = setTimeout(goToFlaskIndex, 2000);
  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to voiceBank, {displayName}!</h1>
        <div>
          <button onClick={goToFlaskIndex} className="auth-btn" style={{marginRight:'10px'}}>
            Open VoiceBank
          </button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-grid">
            <div className="action-card">
              <h3>💰 Check Balance</h3>
              <p>Your balance: ₹{balance.toFixed(2)}</p>
            </div>
            <div className="action-card">
              <h3>💸 Transfer Money</h3>
              <p>Send money to other accounts</p>
            </div>
            <div className="action-card">
              <h3>💳 View Transactions</h3>
              <p>See your recent activity</p>
            </div>
            <div className="action-card">
              <h3>🏦 Loan Information</h3>
              <p>Manage your loans and EMIs</p>
            </div>
          </div>
        </div>
        
        <div className="voice-assistant-section">
          <h2>🎙️ Voice Assistant</h2>
          <div className="voice-input-area">
            <button 
              className={`voice-btn-large ${isListening ? 'listening' : ''}`}
              onClick={handleVoiceInput}
            >
              <span className="mic-icon">{isListening ? '🔴' : '🎤'}</span>
              <span>{isListening ? 'Listening...' : 'Tap & Speak'}</span>
            </button>
            <p>Say: "What is my account balance?" or "Transfer money to John"</p>
          </div>
          
          {voiceCommand && (
            <div className="voice-command-display">
              <p><strong>Last command:</strong> {voiceCommand}</p>
            </div>
          )}
          
          <div className="command-history">
            <h3>Recent Commands</h3>
            <ul>
              {commandHistory.slice(-3).reverse().map((item, index) => (
                <li key={index}>{item.command} <small>({item.timestamp})</small></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;