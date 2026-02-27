'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _this = this;

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utilsVoiceAuth = require('../utils/VoiceAuth');

var _utilsVoiceAuth2 = _interopRequireDefault(_utilsVoiceAuth);

var _servicesApi = require('../services/api');

require('./AuthStyles.css');

var RegisterPage = function RegisterPage() {
  var _useState = (0, _react.useState)({
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

  var _useState2 = _slicedToArray(_useState, 2);

  var formData = _useState2[0];
  var setFormData = _useState2[1];

  var _useState3 = (0, _react.useState)(false);

  var _useState32 = _slicedToArray(_useState3, 2);

  var isLoading = _useState32[0];
  var setIsLoading = _useState32[1];

  var _useState4 = (0, _react.useState)(false);

  var _useState42 = _slicedToArray(_useState4, 2);

  var isListening = _useState42[0];
  var setIsListening = _useState42[1];

  var _useState5 = (0, _react.useState)('');

  var _useState52 = _slicedToArray(_useState5, 2);

  var error = _useState52[0];
  var setError = _useState52[1];

  var _useState6 = (0, _react.useState)('');

  var _useState62 = _slicedToArray(_useState6, 2);

  var success = _useState62[0];
  var setSuccess = _useState62[1];

  var _useState7 = (0, _react.useState)(false);

  var _useState72 = _slicedToArray(_useState7, 2);

  var showPassword = _useState72[0];
  var setShowPassword = _useState72[1];

  var _useState8 = (0, _react.useState)(false);

  var _useState82 = _slicedToArray(_useState8, 2);

  var showConfirmPassword = _useState82[0];
  var setShowConfirmPassword = _useState82[1];

  var _useState9 = (0, _react.useState)('');

  var _useState92 = _slicedToArray(_useState9, 2);

  var authStatus = _useState92[0];
  var setAuthStatus = _useState92[1];
  // For voice authentication status

  var voiceAuthRef = (0, _react.useRef)(null);

  // Initialize voice authentication
  (0, _react.useEffect)(function () {
    voiceAuthRef.current = new _utilsVoiceAuth2['default']();

    // Set up callbacks
    voiceAuthRef.current.setOnResult(function (transcript) {
      setIsListening(false);
      setAuthStatus('Heard: ' + transcript);

      // Parse the command
      var parsedData = voiceAuthRef.current.parseAuthCommand(transcript);

      // Update form data based on parsed data
      if (parsedData.firstName) {
        setFormData(function (prev) {
          return _extends({}, prev, {
            firstName: parsedData.firstName
          });
        });
      }

      if (parsedData.lastName) {
        setFormData(function (prev) {
          return _extends({}, prev, {
            lastName: parsedData.lastName
          });
        });
      }

      if (parsedData.email) {
        setFormData(function (prev) {
          return _extends({}, prev, {
            email: parsedData.email
          });
        });
      }

      if (parsedData.phone) {
        setFormData(function (prev) {
          return _extends({}, prev, {
            phone: parsedData.phone
          });
        });
      }

      if (parsedData.username) {
        setFormData(function (prev) {
          return _extends({}, prev, {
            username: parsedData.username
          });
        });
      }

      if (parsedData.password) {
        setFormData(function (prev) {
          return _extends({}, prev, {
            password: parsedData.password
          });
        });
      }
    });

    voiceAuthRef.current.setOnError(function (event) {
      setIsListening(false);
      setAuthStatus('');
      setError('Voice recognition error: ' + event.error);
      voiceAuthRef.current.speak('Sorry, I couldn\'t understand that. ' + event.error);
    });

    voiceAuthRef.current.setOnStart(function () {
      setIsListening(true);
      setAuthStatus('Listening...');
      setError('');
    });

    voiceAuthRef.current.setOnEnd(function () {
      setIsListening(false);
      if (authStatus === 'Listening...') {
        setAuthStatus('');
      }
    });

    // Load voices for speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthesis.onvoiceschanged = function () {
        // Voices are loaded
      };
    }

    // Cleanup on unmount
    return function () {
      if (voiceAuthRef.current) {
        voiceAuthRef.current.abort();
      }
    };
  }, []);

  var handleChange = function handleChange(e) {
    setFormData(_extends({}, formData, _defineProperty({}, e.target.name, e.target.value)));
    setError('');
  };

  var handleSubmit = function handleSubmit(e) {
    var userData, response;
    return regeneratorRuntime.async(function handleSubmit$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          e.preventDefault();

          // Validation

          if (!(!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.username || !formData.password)) {
            context$2$0.next = 5;
            break;
          }

          setError('Please fill in all required fields');
          voiceAuthRef.current.speak('Please fill in all required fields');
          return context$2$0.abrupt('return');

        case 5:
          if (!(formData.password !== formData.confirmPassword)) {
            context$2$0.next = 9;
            break;
          }

          setError('Passwords do not match');
          voiceAuthRef.current.speak('Passwords do not match');
          return context$2$0.abrupt('return');

        case 9:
          if (!(formData.password.length < 6)) {
            context$2$0.next = 13;
            break;
          }

          setError('Password must be at least 6 characters');
          voiceAuthRef.current.speak('Password must be at least 6 characters');
          return context$2$0.abrupt('return');

        case 13:

          setIsLoading(true);
          setAuthStatus('Creating your account...');
          setError('');

          context$2$0.prev = 16;
          userData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            username: formData.username,
            password: formData.password
          };
          context$2$0.next = 20;
          return regeneratorRuntime.awrap(_servicesApi.authService.register(userData));

        case 20:
          response = context$2$0.sent;

          if (response.success) {
            setSuccess('Registration successful! You can now log in.');
            voiceAuthRef.current.speak('Registration successful! You can now log in.');
            setAuthStatus('');

            // Reset form after successful registration
            setTimeout(function () {
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
          context$2$0.next = 28;
          break;

        case 24:
          context$2$0.prev = 24;
          context$2$0.t0 = context$2$0['catch'](16);

          setError(context$2$0.t0.message || 'An error occurred during registration');
          voiceAuthRef.current.speak('Registration failed, please try again');

        case 28:
          context$2$0.prev = 28;

          setIsLoading(false);
          return context$2$0.finish(28);

        case 31:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this, [[16, 24, 28, 31]]);
  };

  var startVoiceRecognition = function startVoiceRecognition() {
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
  (0, _react.useEffect)(function () {
    if (authStatus.includes('Heard:')) {
      // Process parsed data automatically
    }
  }, [authStatus]);

  var speakInstruction = function speakInstruction(instruction) {
    if (voiceAuthRef.current) {
      voiceAuthRef.current.speak(instruction);
    }
  };

  return _react2['default'].createElement(
    'div',
    { className: 'auth-container' },
    _react2['default'].createElement(
      'div',
      { className: 'auth-card' },
      _react2['default'].createElement(
        'div',
        { className: 'auth-header' },
        _react2['default'].createElement(
          'h1',
          null,
          '🎙️ voiceBank Register'
        ),
        _react2['default'].createElement(
          'p',
          null,
          'Create your account to access voice banking services'
        )
      ),
      _react2['default'].createElement(
        'form',
        { onSubmit: handleSubmit, className: 'auth-form' },
        error && _react2['default'].createElement(
          'div',
          { className: 'error-message' },
          error
        ),
        success && _react2['default'].createElement(
          'div',
          { className: 'success-message' },
          success
        ),
        authStatus && !success && _react2['default'].createElement(
          'div',
          { className: 'status-message ' + (authStatus.includes('Error') || authStatus.includes('Invalid') ? 'error' : 'info') },
          authStatus
        ),
        _react2['default'].createElement(
          'div',
          { className: 'form-row' },
          _react2['default'].createElement(
            'div',
            { className: 'input-group' },
            _react2['default'].createElement(
              'label',
              { htmlFor: 'firstName' },
              'First Name *'
            ),
            _react2['default'].createElement(
              'div',
              { className: 'input-with-voice' },
              _react2['default'].createElement('input', {
                type: 'text',
                id: 'firstName',
                name: 'firstName',
                value: formData.firstName,
                onChange: handleChange,
                placeholder: 'Enter first name',
                'aria-label': 'First name'
              }),
              _react2['default'].createElement(
                'button',
                {
                  type: 'button',
                  className: 'voice-btn ' + (isListening ? 'listening' : ''),
                  onClick: function () {
                    startVoiceRecognition();
                    speakInstruction("Please say your first name");
                  },
                  title: 'Use voice input for first name',
                  'aria-label': 'Voice input for first name'
                },
                isListening ? '🔴' : '🎤'
              )
            )
          ),
          _react2['default'].createElement(
            'div',
            { className: 'input-group' },
            _react2['default'].createElement(
              'label',
              { htmlFor: 'lastName' },
              'Last Name *'
            ),
            _react2['default'].createElement(
              'div',
              { className: 'input-with-voice' },
              _react2['default'].createElement('input', {
                type: 'text',
                id: 'lastName',
                name: 'lastName',
                value: formData.lastName,
                onChange: handleChange,
                placeholder: 'Enter last name',
                'aria-label': 'Last name'
              }),
              _react2['default'].createElement(
                'button',
                {
                  type: 'button',
                  className: 'voice-btn ' + (isListening ? 'listening' : ''),
                  onClick: function () {
                    startVoiceRecognition();
                    speakInstruction("Please say your last name");
                  },
                  title: 'Use voice input for last name',
                  'aria-label': 'Voice input for last name'
                },
                isListening ? '🔴' : '🎤'
              )
            )
          )
        ),
        _react2['default'].createElement(
          'div',
          { className: 'form-row' },
          _react2['default'].createElement(
            'div',
            { className: 'input-group' },
            _react2['default'].createElement(
              'label',
              { htmlFor: 'email' },
              'Email *'
            ),
            _react2['default'].createElement(
              'div',
              { className: 'input-with-voice' },
              _react2['default'].createElement('input', {
                type: 'email',
                id: 'email',
                name: 'email',
                value: formData.email,
                onChange: handleChange,
                placeholder: 'Enter email address',
                'aria-label': 'Email address'
              }),
              _react2['default'].createElement(
                'button',
                {
                  type: 'button',
                  className: 'voice-btn ' + (isListening ? 'listening' : ''),
                  onClick: function () {
                    startVoiceRecognition();
                    speakInstruction("Please say your email address");
                  },
                  title: 'Use voice input for email',
                  'aria-label': 'Voice input for email'
                },
                isListening ? '🔴' : '🎤'
              )
            )
          ),
          _react2['default'].createElement(
            'div',
            { className: 'input-group' },
            _react2['default'].createElement(
              'label',
              { htmlFor: 'phone' },
              'Phone Number *'
            ),
            _react2['default'].createElement(
              'div',
              { className: 'input-with-voice' },
              _react2['default'].createElement('input', {
                type: 'tel',
                id: 'phone',
                name: 'phone',
                value: formData.phone,
                onChange: handleChange,
                placeholder: 'Enter phone number',
                'aria-label': 'Phone number'
              }),
              _react2['default'].createElement(
                'button',
                {
                  type: 'button',
                  className: 'voice-btn ' + (isListening ? 'listening' : ''),
                  onClick: function () {
                    startVoiceRecognition();
                    speakInstruction("Please say your phone number");
                  },
                  title: 'Use voice input for phone number',
                  'aria-label': 'Voice input for phone number'
                },
                isListening ? '🔴' : '🎤'
              )
            )
          )
        ),
        _react2['default'].createElement(
          'div',
          { className: 'input-group' },
          _react2['default'].createElement(
            'label',
            { htmlFor: 'username' },
            'Username *'
          ),
          _react2['default'].createElement(
            'div',
            { className: 'input-with-voice' },
            _react2['default'].createElement('input', {
              type: 'text',
              id: 'username',
              name: 'username',
              value: formData.username,
              onChange: handleChange,
              placeholder: 'Choose a username',
              'aria-label': 'Username'
            }),
            _react2['default'].createElement(
              'button',
              {
                type: 'button',
                className: 'voice-btn ' + (isListening ? 'listening' : ''),
                onClick: function () {
                  startVoiceRecognition();
                  speakInstruction("Please say your desired username");
                },
                title: 'Use voice input for username',
                'aria-label': 'Voice input for username'
              },
              isListening ? '🔴' : '🎤'
            )
          )
        ),
        _react2['default'].createElement(
          'div',
          { className: 'form-row' },
          _react2['default'].createElement(
            'div',
            { className: 'input-group' },
            _react2['default'].createElement(
              'label',
              { htmlFor: 'password' },
              'Password *'
            ),
            _react2['default'].createElement(
              'div',
              { className: 'input-with-voice' },
              _react2['default'].createElement('input', {
                type: showPassword ? "text" : "password",
                id: 'password',
                name: 'password',
                value: formData.password,
                onChange: handleChange,
                placeholder: 'Create a password',
                'aria-label': 'Password'
              }),
              _react2['default'].createElement(
                'button',
                {
                  type: 'button',
                  className: 'toggle-password',
                  onClick: function () {
                    return setShowPassword(!showPassword);
                  },
                  title: 'Show/hide password',
                  'aria-label': showPassword ? "Hide password" : "Show password"
                },
                showPassword ? '👁️' : '👁️‍🗨️'
              ),
              _react2['default'].createElement(
                'button',
                {
                  type: 'button',
                  className: 'voice-btn ' + (isListening ? 'listening' : ''),
                  onClick: function () {
                    startVoiceRecognition();
                    speakInstruction("Please say your password");
                  },
                  title: 'Use voice input for password',
                  'aria-label': 'Voice input for password'
                },
                isListening ? '🔴' : '🎤'
              )
            )
          ),
          _react2['default'].createElement(
            'div',
            { className: 'input-group' },
            _react2['default'].createElement(
              'label',
              { htmlFor: 'confirmPassword' },
              'Confirm Password *'
            ),
            _react2['default'].createElement(
              'div',
              { className: 'input-with-voice' },
              _react2['default'].createElement('input', {
                type: showConfirmPassword ? "text" : "password",
                id: 'confirmPassword',
                name: 'confirmPassword',
                value: formData.confirmPassword,
                onChange: handleChange,
                placeholder: 'Confirm your password',
                'aria-label': 'Confirm password'
              }),
              _react2['default'].createElement(
                'button',
                {
                  type: 'button',
                  className: 'toggle-password',
                  onClick: function () {
                    return setShowConfirmPassword(!showConfirmPassword);
                  },
                  title: 'Show/hide confirm password',
                  'aria-label': showConfirmPassword ? "Hide confirm password" : "Show confirm password"
                },
                showConfirmPassword ? '👁️' : '👁️‍🗨️'
              ),
              _react2['default'].createElement(
                'button',
                {
                  type: 'button',
                  className: 'voice-btn ' + (isListening ? 'listening' : ''),
                  onClick: function () {
                    startVoiceRecognition();
                    speakInstruction("Please say your password again to confirm");
                  },
                  title: 'Use voice input for confirm password',
                  'aria-label': 'Voice input for confirm password'
                },
                isListening ? '🔴' : '🎤'
              )
            )
          )
        ),
        _react2['default'].createElement(
          'div',
          { className: 'form-row' },
          _react2['default'].createElement(
            'div',
            { className: 'input-group' },
            _react2['default'].createElement(
              'label',
              { htmlFor: 'aadhaar' },
              'Aadhaar Number'
            ),
            _react2['default'].createElement(
              'div',
              { className: 'input-with-voice' },
              _react2['default'].createElement('input', {
                type: 'text',
                id: 'aadhaar',
                name: 'aadhaar',
                value: formData.aadhaar,
                onChange: handleChange,
                placeholder: 'Enter Aadhaar number (optional)',
                'aria-label': 'Aadhaar number'
              }),
              _react2['default'].createElement(
                'button',
                {
                  type: 'button',
                  className: 'voice-btn ' + (isListening ? 'listening' : ''),
                  onClick: function () {
                    startVoiceRecognition();
                    speakInstruction("Please say your Aadhaar number");
                  },
                  title: 'Use voice input for Aadhaar number',
                  'aria-label': 'Voice input for Aadhaar number'
                },
                isListening ? '🔴' : '🎤'
              )
            )
          ),
          _react2['default'].createElement(
            'div',
            { className: 'input-group' },
            _react2['default'].createElement(
              'label',
              { htmlFor: 'dob' },
              'Date of Birth'
            ),
            _react2['default'].createElement('input', {
              type: 'date',
              id: 'dob',
              name: 'dob',
              value: formData.dob,
              onChange: handleChange,
              'aria-label': 'Date of birth'
            })
          )
        ),
        _react2['default'].createElement(
          'div',
          { className: 'form-agreement' },
          _react2['default'].createElement(
            'label',
            { className: 'checkbox-label' },
            _react2['default'].createElement('input', { type: 'checkbox', required: true, 'aria-label': 'Agree to terms' }),
            _react2['default'].createElement('span', { className: 'checkmark' }),
            'I agree to the Terms of Service and Privacy Policy'
          )
        ),
        _react2['default'].createElement(
          'button',
          { type: 'submit', className: 'auth-btn', disabled: authStatus.includes('Creating') },
          authStatus.includes('Creating') ? 'Creating Account...' : 'Create Account'
        )
      ),
      _react2['default'].createElement(
        'div',
        { className: 'voice-instructions' },
        _react2['default'].createElement(
          'h3',
          null,
          'Voice Commands:'
        ),
        _react2['default'].createElement(
          'ul',
          null,
          _react2['default'].createElement(
            'li',
            null,
            'Say: "My name is John Doe, email is john@example.com, phone is 9876543210"'
          ),
          _react2['default'].createElement(
            'li',
            null,
            'Say: "Username is johndoe, password is secret123"'
          )
        )
      ),
      _react2['default'].createElement(
        'div',
        { className: 'auth-footer' },
        _react2['default'].createElement(
          'p',
          null,
          'Already have an account? ',
          _react2['default'].createElement(
            'a',
            { href: '/login' },
            'Sign In'
          )
        )
      )
    )
  );
};

exports['default'] = RegisterPage;
module.exports = exports['default'];