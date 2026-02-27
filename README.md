# voiceBank - Voice-Based AI Banking Assistant

A revolutionary voice-powered banking solution designed for illiterate and less tech-savvy users, promoting financial inclusion and accessibility.

## 🎯 Project Overview

voiceBank is an innovative voice-based banking assistant that eliminates the barriers of traditional banking interfaces. Users can perform essential banking operations through simple voice commands, making financial services accessible to everyone regardless of literacy level or technical expertise.

## 🚀 Key Features

- **Voice Control**: Hands-free banking operations using speech recognition
- **Text-to-Speech**: Audio responses for complete accessibility
- **Intent Recognition**: Intelligent understanding of user requests
- **Dummy Banking Data**: Safe testing environment with realistic scenarios
- **Multi-language Support**: Configurable for different languages
- **Responsive Design**: Works on mobile and desktop devices

## 🏦 Supported Banking Operations

1. **Account Balance Check**
   - "What is my account balance?"
   - "How much money do I have?"

2. **Fund Transfer Information**
   - "How much can I transfer today?"
   - "Money transfer limits"

3. **Loan Information**
   - "Tell me about my loans"
   - "What are my EMIs?"

4. **Transaction History**
   - "Show my recent transactions"
   - "Last few transactions"

5. **Help & Guidance**
   - "What can you help me with?"
   - "Show available options"

## 📁 Folder Structure

```
online_banking/
│
├── app.py                 # Flask backend server
├── requirements.txt       # Python dependencies
├── README.md             # Project documentation
│
├── templates/
│   └── index.html        # Main frontend interface
│
└── static/               # (Optional) Additional assets
```

## 🛠️ Technology Stack

### Backend
- **Python 3.8+**
- **Flask** - Web framework
- **SpeechRecognition** - Speech-to-text processing
- **pyttsx3** - Text-to-speech engine

### Frontend
- **HTML5** - Structure and semantic markup
- **CSS3** - Modern styling and animations
- **JavaScript** - Client-side speech processing
- **Web Speech API** - Browser-native speech recognition

## 🚀 Setup and Installation

### Prerequisites
- Python 3.8 or higher
- Microphone access
- Modern web browser (Chrome, Firefox, Edge)

### Step-by-Step Installation

1. **Clone or Download the Project**
   ```bash
   # If using git
   git clone <repository-url>
   cd online_banking
   
   # Or simply navigate to the project folder
   cd path/to/online_banking
   ```

2. **Create Virtual Environment** (Recommended)
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate
   
   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Application**
   ```bash
   python app.py
   ```

5. **Access the Application**
   - Open your browser
   - Navigate to `http://localhost:5000`
   - Allow microphone access when prompted

## 🎮 Usage Instructions

### For Users
1. **Click the Microphone Button** - Large circular button in the center
2. **Speak Your Request** - Use natural language
3. **Listen to Response** - System will speak back the information
4. **View on Screen** - Text response appears for reference

### Example Commands
- "Check my account balance"
- "How much money can I transfer today?"
- "Tell me about my personal loan"
- "Show my recent transactions"
- "What banking services do you offer?"

## 🔧 Development Guide

### Backend Architecture (`app.py`)
- **Flask Routes**: `/` (main page), `/process_speech` (API endpoint). The `/process_speech` endpoint now accepts a `language` field (e.g. `'te'` or `'te-IN'` for Telugu) and performs simple Telugu-to-English normalization so that commands spoken in Telugu are understood. It also returns responses already localized into Telugu when the language flag indicates Telugu.
- **Intent Recognition**: Keyword-based classification system
- **Data Processing**: Functions for each banking operation
- **Dummy Data**: Realistic banking information for testing

### Frontend Components (`index.html`)
- **Speech Recognition**: Web Speech API integration

**Installing a Telugu TTS voice:**
1. **Windows:** Settings → Time & Language → Speech → Manage voices → Add voices → select "Telugu (India)".
2. **macOS:** System Settings → Accessibility → Spoken Content → System Voice → Customise… → tick a Telugu voice such as Lekha or Rishi, then download.
3. **Linux:** install a Telugu pack for your TTS engine (e.g. `sudo apt install espeak-ng-data` and verify with `espeak-ng --voices | grep te`).

Reload the page and check `speechSynthesis.getVoices()` in the dev console to confirm the voice appears.
- **Text-to-Speech Improvements**: `utterance.lang` is now set and voices selected by language so Telugu responses use an appropriate voice when available.  If your browser has no Telugu voices installed, the assistant will fall back to the default voice and will sound English — you can add a voice via your OS settings (see below).
- **Voice Interface**: Large accessible microphone button
- **Visual Feedback**: Status indicators and animations
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Mobile-first approach

### Key Functions

**Backend Functions:**
- `recognize_intent(text)` - Classifies user requests
- `process_balance_check()` - Handles balance inquiries
- `process_fund_transfer()` - Manages transfer information
- `process_loan_info()` - Provides loan details
- `process_transaction_history()` - Shows transaction data

**Frontend Functions:**
- `startListening()` - Initiates speech recognition
- `sendToServer()` - Communicates with backend
- `speakResponse()` - Text-to-speech output
- `updateUI()` - Manages interface states

## 🧪 Testing

### Manual Testing
1. Start the server: `python app.py`
2. Open browser to `http://localhost:5000`
3. Test various voice commands:
   - Balance inquiries
   - Transfer limit questions
   - Loan information requests
   - Transaction history queries

### Test Cases
- ✅ "What is my account balance?"
- ✅ "How much can I transfer today?"
- ✅ "Tell me about my loans"
- ✅ "Show recent transactions"
- ✅ "What can you help me with?"

## 🎯 Social Impact & Accessibility

### Key Benefits
- **Financial Inclusion**: Accessible to illiterate populations
- **Digital Literacy**: No technical skills required
- **Independence**: Users can bank without assistance
- **Confidence Building**: Encourages financial participation
- **Cost Effective**: Reduces need for human banking assistants

### Accessibility Features
- ✅ Voice-only interface
- ✅ Large touch targets
- ✅ High contrast design
- ✅ Audio feedback
- ✅ Simple language responses
- ✅ Error recovery guidance

## 🏆 Hackathon Presentation Points

### Problem Statement
Traditional banking interfaces create barriers for:
- Illiterate populations
- Elderly users
- Technologically challenged individuals
- Visually impaired users

### Solution Innovation
voiceBank addresses these challenges through:
- **Voice-first design** eliminating text barriers
- **Intuitive intent recognition** understanding natural language
- **Audio responses** providing complete accessibility
- **Dummy data environment** safe for learning and testing

### Technical Excellence
- **Modern Web APIs** leveraging browser capabilities
- **Python Flask backend** for robust processing
- **Real-time speech processing** with low latency
- **Scalable architecture** ready for production

### Social Impact
- **Financial inclusion** for underserved populations
- **Digital empowerment** without literacy requirements
- **Banking democratization** making services accessible to all
- **Economic participation** enabling financial independence

### Future Roadmap
- Multi-language support (Hindi, Tamil, Telugu, etc.)
- Integration with real banking APIs
- Mobile app development
- Offline voice recognition capabilities
- Enhanced security features

## 📞 Support and Troubleshooting

### Common Issues

**Microphone Not Working:**
- Check browser permissions
- Ensure microphone is connected
- Try refreshing the page

**Speech Not Recognized:**
- Speak clearly and at normal pace
- Use simple, direct language
- Ensure quiet environment

**Server Connection Errors:**
- Verify Flask server is running
- Check if port 5000 is available
- Confirm no firewall blocking

### Browser Compatibility
- **Best**: Google Chrome (recommended)
- **Good**: Microsoft Edge, Firefox
- **Limited**: Safari (some speech features)

## 📄 License

This project is developed for educational and demonstration purposes. Feel free to modify and extend for your specific needs.

## 🙏 Acknowledgments

Special thanks to:
- Web Speech API for browser-native voice capabilities
- Flask community for excellent documentation
- Open source speech recognition libraries
- Financial inclusion advocates inspiring this work

---

**voiceBank** - Making banking accessible to everyone, one voice at a time. 🎙️💰