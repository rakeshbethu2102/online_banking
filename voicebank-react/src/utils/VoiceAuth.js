// Voice Authentication Utility
class VoiceAuth {
  constructor() {
    this.recognition = null;
    this.isSupported = this.checkSupport();
    this.callbacks = {
      onResult: null,
      onError: null,
      onStart: null,
      onEnd: null
    };
  }

  checkSupport() {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  initialize(options = {}) {
    if (!this.isSupported) {
      throw new Error('Speech recognition is not supported in this browser');
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    // Configure recognition
    this.recognition.continuous = options.continuous || false;
    this.recognition.interimResults = options.interimResults || false;
    this.recognition.lang = options.language || 'en-US';
    this.recognition.maxAlternatives = options.maxAlternatives || 1;

    // Set up event handlers
    this.recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      if (this.callbacks.onResult) {
        this.callbacks.onResult(transcript, event);
      }
    };

    this.recognition.onerror = (event) => {
      if (this.callbacks.onError) {
        this.callbacks.onError(event);
      }
    };

    this.recognition.onstart = () => {
      if (this.callbacks.onStart) {
        this.callbacks.onStart();
      }
    };

    this.recognition.onend = () => {
      if (this.callbacks.onEnd) {
        this.callbacks.onEnd();
      }
    };
  }

  start() {
    if (this.recognition) {
      this.recognition.start();
    }
  }

  stop() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  abort() {
    if (this.recognition) {
      this.recognition.abort();
    }
  }

  setOnResult(callback) {
    this.callbacks.onResult = callback;
  }

  setOnError(callback) {
    this.callbacks.onError = callback;
  }

  setOnStart(callback) {
    this.callbacks.onStart = callback;
  }

  setOnEnd(callback) {
    this.callbacks.onEnd = callback;
  }

  // Text to speech functionality
  speak(text, options = {}) {
    if (!('speechSynthesis' in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;

    // inform engine of language so pronunciation improves
    utterance.lang = options.lang || 'en-US';

    // ensure voices list is populated (voiceschanged may not fire on first load)
    let voices = speechSynthesis.getVoices();
    if (!voices.length) {
      // try forcing a load
      speechSynthesis.onvoiceschanged = () => {
        voices = speechSynthesis.getVoices();
      };
    }

    // helper to find a Telugu-specific voice by language or common names
    const findTeluguVoice = () => {
      // language code based match
      let v = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('te'));
      if (v) return v;
      // name-based fallback
      const keywords = ['telugu', 'lekha', 'rishi'];
      return voices.find(v => {
        const name = v.name.toLowerCase();
        return keywords.some(k => name.includes(k));
      });
    };

    let selectedVoice = null;

    if (options.voice) {
      selectedVoice = voices.find(v =>
        v.name.includes(options.voice) || v.lang.includes(options.voice)
      );
    }
    if (!selectedVoice && options.lang) {
      // direct match by language prefix
      selectedVoice = voices.find(v => v.lang && v.lang.startsWith(options.lang));
    }

    // if requesting Telugu and nothing matched yet, try extra heuristics
    if (!selectedVoice && utterance.lang.startsWith('te')) {
      selectedVoice = findTeluguVoice();
      if (!selectedVoice) {
        console.warn('No Telugu TTS voice found; speaking with default voice');
      }
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    speechSynthesis.speak(utterance);
  }

  // Parse authentication-related voice commands
  parseAuthCommand(command) {
    const lowerCmd = command.toLowerCase().trim();
    
    const authPatterns = {
      login: /(?:login|sign in|log in|enter|authenticate)/i,
      register: /(?:register|sign up|create account|new user)/i,
      username: /(?:username|name is|user is|my name|call me)\s+(.+)/i,
      password: /(?:password|pass is|secret is)\s+(.+)/i,
      pin: /(?:pin|pincode|four digit pin)\s+(\d{4})/i,
      email: /(?:email|mail is|at)\s+([^,]+)/i,
      phone: /(?:phone|mobile|number|call me at)\s+(\d+)/i,
      firstName: /(?:first name|given name)\s+(.+)/i,
      lastName: /(?:last name|surname)\s+(.+)/i,
    };

    const parsedData = {};

    // Check for different patterns
    if (authPatterns.login.test(lowerCmd)) parsedData.action = 'login';
    if (authPatterns.register.test(lowerCmd)) parsedData.action = 'register';

    // Extract username
    const usernameMatch = lowerCmd.match(authPatterns.username);
    if (usernameMatch) parsedData.username = usernameMatch[1].trim();

    // Extract password (do not confuse with pin)
    const passwordMatch = lowerCmd.match(authPatterns.password);
    if (passwordMatch) parsedData.password = passwordMatch[1].trim();

    // Extract PIN if present
    const pinMatch = lowerCmd.match(authPatterns.pin);
    if (pinMatch) parsedData.pin = pinMatch[1].trim();

    // Extract email
    const emailMatch = lowerCmd.match(authPatterns.email);
    if (emailMatch) parsedData.email = emailMatch[1].trim();

    // Extract phone
    const phoneMatch = lowerCmd.match(authPatterns.phone);
    if (phoneMatch) parsedData.phone = phoneMatch[1].trim();

    // Extract first name
    const firstNameMatch = lowerCmd.match(authPatterns.firstName);
    if (firstNameMatch) parsedData.firstName = firstNameMatch[1].trim();

    // Extract last name
    const lastNameMatch = lowerCmd.match(authPatterns.lastName);
    if (lastNameMatch) parsedData.lastName = lastNameMatch[1].trim();

    return parsedData;
  }

  // Validate extracted data
  validateAuthData(data, requiredFields = []) {
    const errors = [];
    
    requiredFields.forEach(field => {
      if (!data[field]) {
        errors.push(`${field} is required`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default VoiceAuth;