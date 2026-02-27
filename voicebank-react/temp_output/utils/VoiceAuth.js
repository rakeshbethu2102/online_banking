// Voice Authentication Utility
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var VoiceAuth = (function () {
  function VoiceAuth() {
    _classCallCheck(this, VoiceAuth);

    this.recognition = null;
    this.isSupported = this.checkSupport();
    this.callbacks = {
      onResult: null,
      onError: null,
      onStart: null,
      onEnd: null
    };
  }

  _createClass(VoiceAuth, [{
    key: 'checkSupport',
    value: function checkSupport() {
      return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }
  }, {
    key: 'initialize',
    value: function initialize() {
      var _this = this;

      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (!this.isSupported) {
        throw new Error('Speech recognition is not supported in this browser');
      }

      var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();

      // Configure recognition
      this.recognition.continuous = options.continuous || false;
      this.recognition.interimResults = options.interimResults || false;
      this.recognition.lang = options.language || 'en-US';
      this.recognition.maxAlternatives = options.maxAlternatives || 1;

      // Set up event handlers
      this.recognition.onresult = function (event) {
        var transcript = event.results[event.results.length - 1][0].transcript;
        if (_this.callbacks.onResult) {
          _this.callbacks.onResult(transcript, event);
        }
      };

      this.recognition.onerror = function (event) {
        if (_this.callbacks.onError) {
          _this.callbacks.onError(event);
        }
      };

      this.recognition.onstart = function () {
        if (_this.callbacks.onStart) {
          _this.callbacks.onStart();
        }
      };

      this.recognition.onend = function () {
        if (_this.callbacks.onEnd) {
          _this.callbacks.onEnd();
        }
      };
    }
  }, {
    key: 'start',
    value: function start() {
      if (this.recognition) {
        this.recognition.start();
      }
    }
  }, {
    key: 'stop',
    value: function stop() {
      if (this.recognition) {
        this.recognition.stop();
      }
    }
  }, {
    key: 'abort',
    value: function abort() {
      if (this.recognition) {
        this.recognition.abort();
      }
    }
  }, {
    key: 'setOnResult',
    value: function setOnResult(callback) {
      this.callbacks.onResult = callback;
    }
  }, {
    key: 'setOnError',
    value: function setOnError(callback) {
      this.callbacks.onError = callback;
    }
  }, {
    key: 'setOnStart',
    value: function setOnStart(callback) {
      this.callbacks.onStart = callback;
    }
  }, {
    key: 'setOnEnd',
    value: function setOnEnd(callback) {
      this.callbacks.onEnd = callback;
    }

    // Text to speech functionality
  }, {
    key: 'speak',
    value: function speak(text) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if ('speechSynthesis' in window) {
        var utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = options.rate || 1.0;
        utterance.pitch = options.pitch || 1.0;
        utterance.volume = options.volume || 1.0;

        // Try to use a specific voice if available
        if (options.voice) {
          var availableVoices = speechSynthesis.getVoices();
          var selectedVoice = availableVoices.find(function (v) {
            return v.name.includes(options.voice) || v.lang.includes(options.lang || 'en');
          });
          if (selectedVoice) {
            utterance.voice = selectedVoice;
          }
        }

        speechSynthesis.speak(utterance);
      }
    }

    // Parse authentication-related voice commands
  }, {
    key: 'parseAuthCommand',
    value: function parseAuthCommand(command) {
      var lowerCmd = command.toLowerCase().trim();

      var authPatterns = {
        login: /(?:login|sign in|log in|enter|authenticate)/i,
        register: /(?:register|sign up|create account|new user)/i,
        username: /(?:username|name is|user is|my name|call me)\s+(.+)/i,
        password: /(?:password|pass is|secret is|pin is)\s+(.+)/i,
        email: /(?:email|mail is|at)\s+([^,]+)/i,
        phone: /(?:phone|mobile|number|call me at)\s+(\d+)/i,
        firstName: /(?:first name|given name)\s+(.+)/i,
        lastName: /(?:last name|surname)\s+(.+)/i
      };

      var parsedData = {};

      // Check for different patterns
      if (authPatterns.login.test(lowerCmd)) parsedData.action = 'login';
      if (authPatterns.register.test(lowerCmd)) parsedData.action = 'register';

      // Extract username
      var usernameMatch = lowerCmd.match(authPatterns.username);
      if (usernameMatch) parsedData.username = usernameMatch[1].trim();

      // Extract password
      var passwordMatch = lowerCmd.match(authPatterns.password);
      if (passwordMatch) parsedData.password = passwordMatch[1].trim();

      // Extract email
      var emailMatch = lowerCmd.match(authPatterns.email);
      if (emailMatch) parsedData.email = emailMatch[1].trim();

      // Extract phone
      var phoneMatch = lowerCmd.match(authPatterns.phone);
      if (phoneMatch) parsedData.phone = phoneMatch[1].trim();

      // Extract first name
      var firstNameMatch = lowerCmd.match(authPatterns.firstName);
      if (firstNameMatch) parsedData.firstName = firstNameMatch[1].trim();

      // Extract last name
      var lastNameMatch = lowerCmd.match(authPatterns.lastName);
      if (lastNameMatch) parsedData.lastName = lastNameMatch[1].trim();

      return parsedData;
    }

    // Validate extracted data
  }, {
    key: 'validateAuthData',
    value: function validateAuthData(data) {
      var requiredFields = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

      var errors = [];

      requiredFields.forEach(function (field) {
        if (!data[field]) {
          errors.push(field + ' is required');
        }
      });

      return {
        isValid: errors.length === 0,
        errors: errors
      };
    }
  }]);

  return VoiceAuth;
})();

exports['default'] = VoiceAuth;
module.exports = exports['default'];