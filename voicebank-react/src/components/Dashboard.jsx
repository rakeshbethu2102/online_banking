import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import VoiceAuth from '../utils/VoiceAuth';
import { bankingService, pageService } from '../services/api';
import './AuthStyles.css';

const Dashboard = ({ user, logout }) => {
  const navigate = useNavigate();
  // Handle user prop properly - user might be an object with firstName/username or just a string
  const displayName = (user && typeof user === 'object') 
    ? (user.firstName || user.username || 'User') 
    : (user || 'User');

  const getReply = (en, te) => (voiceLang === 'te-IN' ? te : en);
  const speak = (en, te = en) => {
    if (voiceAuthRef.current) {
      voiceAuthRef.current.speak(getReply(en, te), { lang: voiceLang });
    }
  };

  // attempts simple keyword translation for dynamic backend responses
  const localizeDynamic = (txt) => {
    if (voiceLang !== 'te-IN' || !txt) return txt;
    return txt
      .replace(/balance/gi, 'బ్యాలెన్స్')
      .replace(/your/gi, 'మీ')
      .replace(/account/gi, 'ఖాతా')
      .replace(/transaction/gi, 'లావాదేవీ')
      .replace(/transfer/gi, 'బదిలీ')
      .replace(/loan/gi, 'రుణ')
      .replace(/available/gi, 'లభ్యమైన')
      .replace(/\$/g, '₹');
  };

  const speakDynamic = (text) => {
    if (!voiceAuthRef.current) return;
    // if backend already returned Telugu (language starts with 'te'), just speak the text
    // otherwise run our keyword-based localizer as a fallback
    const msg = voiceLang.startsWith('te') ? text : localizeDynamic(text);
    voiceAuthRef.current.speak(msg, { lang: voiceLang });
  };
  const [voiceCommand, setVoiceCommand] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState(null);
  const [account, setAccount] = useState(null);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinVerified, setPinVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [voiceLang, setVoiceLang] = useState('en-US');

  const voiceAuthRef = useRef(null);

  useEffect(() => {
    voiceAuthRef.current = new VoiceAuth();
    
    // when user switches languages, check voices
    if (voiceLang.startsWith('te')) {
      const voices = speechSynthesis.getVoices();
      console.log('available voices:', voices);
      const hasTelugu = voices.some(v => v.lang && v.lang.startsWith('te')) ||
                         voices.some(v => /telugu|lekha|rishi/i.test(v.name));
      if (!hasTelugu) {
        console.warn('No Telugu voice installed; please add a Telugu TTS voice via OS settings');
        // optionally, inform the user via speech as well
        if (voiceAuthRef.current) {
          voiceAuthRef.current.speak(
            'Note: Telugu voice not available, using default voice.',
            'గమనిక: తెలుగు వాయిస్ అందుబాటులో లేదు, డిఫాల్ట్ వాయిస్ ఉపయోగిస్తోంది.'
          );
        }
      }
    }

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
      speak(`Sorry, I couldn't understand that. ${event.error}`, `క్షమించండి, నేను అర్థం చేసుకోలేదు. ${event.error}`);
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
      speak(
        `Hi ${displayName}, good to see you again. What can I do for you today?`,
        `హాయ్ ${displayName}, మళ్లీ మీరు చూడడం خوش ہے. నాకు ఇప్పుడు ఏం చేయాలో చెప్పండి?`
      );
    }
    
    // Cleanup on unmount
    return () => {
      if (voiceAuthRef.current) {
        voiceAuthRef.current.abort();
      }
    };
  }, [displayName, voiceLang]);

  // Handler to verify PIN and fetch account-related data
  const handlePinSubmit = async () => {
    setPinError('');
    setLoading(true);
    try {
      const acctRes = await pageService.getAccountInfo(pin);
      if (acctRes.success) {
        setAccount(acctRes.account);
        setPin('');
        if (acctRes.account && acctRes.account.balance) setBalance(acctRes.account.balance);
        // once pin is correct we can load other sections as well
        const [txRes, loansRes] = await Promise.all([
          pageService.getTransactions(),
          pageService.getLoans(),
        ]);
        if (txRes.success) setTransactions(txRes.transactions || []);
        if (loansRes.success) setLoans(loansRes.loans || {});
        setPinVerified(true);
      } else {
        setPinError(acctRes.message || 'Invalid PIN');
      }
    } catch (err) {
      setPinError('Invalid PIN');
    } finally {
      setLoading(false);
    }
  };

  // we no longer fetch data automatically at mount; waiting for PIN

  const processVoiceCommand = async (command) => {
    const lowerCmd = command.toLowerCase();
    
    try {
      if (lowerCmd.includes('balance') || lowerCmd.includes('money') || lowerCmd.includes('amount')) {
        // Use the existing Flask backend for processing
        const response = await bankingService.processSpeech(command, voiceLang);
        if (response.success) {
          speakDynamic(response.response);
        } else {
          speak('Hmm, I can’t seem to get your balance right now. Try again in a moment.', 'హుమ్, ఈ సమయంలో మీ బ్యాలెన్స్‌ని తీసుకురాలేకపోతున్నాను. మరొకసారి ప్రయత్నించండి.');
        }
      } else if (lowerCmd.includes('pin') && /\d{4}/.test(lowerCmd) && !pinVerified) {
        // voice command supplying PIN when dashboard locked
        const numberMatch = lowerCmd.match(/(\d{4})/);
        if (numberMatch) {
          const spokenPin = numberMatch[1];
          setPin(spokenPin);
          await handlePinSubmit();
        }
      } else if (lowerCmd.includes('transfer') || lowerCmd.includes('send money')) {
        const response = await bankingService.processSpeech(command, voiceLang);
        if (response.success) {
          speakDynamic(response.response);
        } else {
          speak('If you want to move money, hit the transfer button on the screen.', 'మీరు డబ్బు పంపదలచుకుంటే, స్క్రీన్‌పైని ట్రాన్స్ఫర్ బటన్‌ను నొక్కండి.');
        }
      } else if (lowerCmd.includes('transactions') || lowerCmd.includes('history')) {
        const response = await bankingService.processSpeech(command, voiceLang);
        if (response.success) {
          speakDynamic(response.response);
        } else {
          speak('Your recent purchases and payments are listed under Transactions.', 'పూర్తి లేదా చెల్లింపుల వివరాలు ట్రాన్సాక్షన్స్‌లో కనిపిస్తాయి.');
        }
      } else if (lowerCmd.includes('loan') || lowerCmd.includes('emi')) {
        const response = await bankingService.processSpeech(command, voiceLang);
        if (response.success) {
          speakDynamic(response.response);
        } else {
          speak('You can check your loan details in the loans section.', 'రుణాల విభాగంలో మీ రుణ వివరాలను తనిఖీ చేయవచ్చు.');
        }
      } else if (lowerCmd.includes('help') || lowerCmd.includes('options')) {
        speak('You can ask about your balance, transfer money, view transactions, check loan details, or get help.', 'మీ బ్యాలన్స్ గురించి అడగవచ్చు, డబ్బు ట్రాన్స్ఫర్ చేయవచ్చు, లావాదేవీలను చూడవచ్చు, రుణ వివరాలను తనిఖీ చేయవచ్చు లేదా సహాయం పొందవచ్చు.');
      } else if (lowerCmd.includes('logout') || lowerCmd.includes('sign out')) {
        handleLogout();
      } else {
        // For unknown commands, try processing through the backend
        const response = await bankingService.processSpeech(command, voiceLang);
        if (response.success) {
          speakDynamic(response.response);
        } else {
          speak(
          "Hmm, that one’s new to me. Try asking about your balance, moving money, transactions, or a loan.",
          "అది నాకు కొత్తది. మీ బ్యాలెన్స్, డబ్బు బదిలీ, లావాదేవీలు లేదా రుణం గురించి అడగండి."
        );
        }
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
      speak(
        'Oops, something went wrong on my end. Could you say that again?',
        'అయ్యో, నా వద్దే లోపం జరిగింది. మళ్లీ చెప్పగలవా?'
      );
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
        language: voiceLang // use selected language
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

  const toggleExpand = (key) => setExpandedCard(prev => prev === key ? null : key);

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrap">
        <div className="dashboard-header">
          <h1>Welcome to voiceBank, {displayName}!</h1>
          <div className="header-actions">
            <button onClick={goToFlaskIndex} className="auth-btn" style={{marginRight:'10px'}}>
              Open VoiceBank
            </button>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
        
        <div className="dashboard-content">
          <div>
            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="action-grid">
                <div className="action-card" onClick={() => toggleExpand('balance')}>
                  <h3>💰 Check Balance</h3>
                  <p>{ loading ? <span className="skeleton" style={{width:120}}/> : (balance!=null ? `Your balance: ₹${balance.toFixed(2)}` : 'No account info') }</p>
                  { expandedCard === 'balance' && (
                    <div style={{marginTop:12, color:'#374151'}}>Account number: {account?.number || '—'}</div>
                  )}
                </div>

                <div className="action-card" onClick={() => toggleExpand('transfer')}>
                  <h3>💸 Transfer Money</h3>
                  <p>Send money to other accounts</p>
                  { expandedCard === 'transfer' && (
                    <div style={{marginTop:12}}>
                      <p style={{color:'#374151'}}>Feature coming soon — voice or form based transfers.</p>
                    </div>
                  )}
                </div>

                <div className="action-card" onClick={() => toggleExpand('transactions')}>
                  <h3>💳 View Transactions</h3>
                  <p>See your recent activity</p>
                  { expandedCard === 'transactions' && (
                    <div style={{marginTop:12}}>
                      { loading ? <div className="skeleton" style={{width:'100%',height:12}}/> : (
                        transactions.length ? (
                          <ul style={{margin:0,paddingLeft:12}}>
                            {transactions.slice(0,5).map((t,i) => (
                              <li key={i} style={{padding:'6px 0'}}>
                                {t.date} — {t.description} — <strong>{t.type==='credit'?'+':'-'}₹{t.amount}</strong>
                              </li>
                            ))}
                          </ul>
                        ) : <div style={{color:'#374151'}}>No transactions</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="action-card" onClick={() => toggleExpand('loans')}>
                  <h3>🏦 Loan Information</h3>
                  <p>Manage your loans and EMIs</p>
                  { expandedCard === 'loans' && (
                    <div style={{marginTop:12}}>
                      { loading ? <div className="skeleton" style={{width:180}}/> : (
                        loans ? (
                          <div>
                            <div className="kv"><span>Personal loan</span><span>{loans.personal_loan?.status}</span></div>
                            <div className="kv"><span>EMI</span><span>₹{loans.personal_loan?.emi}</span></div>
                          </div>
                        ) : <div style={{color:'#374151'}}>No loan data</div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>

            <div style={{marginTop:18}} className="voice-assistant-section">
              <h2>🎙️ Voice Assistant</h2>
              <div className="voice-input-area">
                <button 
                  className={`voice-btn-large ${isListening ? 'listening' : ''}`}
                  onClick={handleVoiceInput}
                >
                  <span className="mic-icon">{isListening ? '🔴' : '🎤'}</span>
                </button>
                <div>
                  <div style={{color:'#374151',fontWeight:600}}>{isListening ? 'Listening...' : 'Tap & Speak'}</div>
                  <div style={{color:'#6b7280',fontSize:'0.9rem'}}>
                    Say: "What is my account balance?" or "Transfer money to John" or "PIN 1234" to unlock overview
                    {voiceLang.startsWith('te') && (
                      <div style={{marginTop:'4px',fontSize:'0.85rem',color:'#4a5568'}}>
                        (ఉదాహరణ: "నా బ్యాలెన్స్ ఎంత?")
                      </div>
                    )}
                  </div>
                </div>
                <select
                  value={voiceLang}
                  onChange={e => setVoiceLang(e.target.value)}
                  style={{marginLeft:'12px',padding:'6px',borderRadius:'6px'}}
                >
                  <option value="en-US">English</option>
                  <option value="te-IN">తెలుగు (Telugu)</option>
                </select>
              </div>

              {voiceCommand && (
                <div className="voice-command-display">
                  <p><strong>Last command:</strong> {voiceCommand}</p>
                </div>
              )}

              <div className="command-history">
                <h3>Recent Commands</h3>
                <ul>
                  {commandHistory.slice(-5).reverse().map((item, index) => (
                    <li key={index}>{item.command} <small>({item.timestamp})</small></li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          <div>
            {!pinVerified ? (
              <div className="account-card">
                <h3 style={{marginTop:0}}>🔒 Enter PIN to view account</h3>
                <div style={{height:12}} />
                <input
                  type="password"
                  value={pin}
                  maxLength={4}
                  onChange={e => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="••••"
                  style={{
                    width: '120px',
                    padding: '8px 12px',
                    fontSize: '1.1rem',
                    textAlign: 'center',
                    borderRadius: '8px',
                    border: '2px solid #e0e5eb',
                    marginBottom: '12px'
                  }}
                />
                <br />
                <button
                  className="auth-btn"
                  onClick={handlePinSubmit}
                  disabled={loading || pin.length !== 4}
                  style={{width:'auto',padding:'10px 28px',marginTop:'8px'}}
                >
                  {loading ? 'Verifying...' : 'Unlock'}
                </button>
                {pinError && <div className="error-message" style={{marginTop:'12px'}}>{pinError}</div>}
              </div>
            ) : (
              <div className="account-card">
                <h3 style={{marginTop:0}}>Account Overview</h3>
                <div style={{height:8}} />
                <div className="account-balance">{ loading ? <span className="skeleton" style={{width:120}}/> : `₹${(balance||0).toFixed(2)}` }</div>
                <div style={{height:12}} />
                <div className="kv"><span>Account No</span><span>{account?.number || '—'}</span></div>
                <div className="kv"><span>Available Transfer</span><span>{loading? '—' : '₹'+( (account?.available_today) ? account.available_today : '—')}</span></div>

                <div style={{height:12}} />
                <h4 style={{margin:'10px 0 6px 0'}}>Recent Transactions</h4>
                { loading ? <div className="skeleton" style={{width:'100%',height:12}}/> : (
                  transactions.length ? (
                    <ul style={{margin:0,paddingLeft:12}}>
                      {transactions.slice(0,4).map((t,i)=> (
                        <li key={i} style={{padding:'6px 0'}}>{t.date} — {t.description} — {t.type==='credit'?'+':'-'}₹{t.amount}</li>
                      ))}
                    </ul>
                  ) : <div style={{color:'#374151'}}>No recent transactions</div>
                )}

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

};

export default Dashboard;