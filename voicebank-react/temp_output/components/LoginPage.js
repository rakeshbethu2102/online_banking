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

var LoginPage = function LoginPage(_ref) {
  var login = _ref.login;

  var _useState = (0, _react.useState)({
    username: '',
    password: ''
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

  var _useState6 = (0, _react.useState)(false);

  var _useState62 = _slicedToArray(_useState6, 2);

  var showPassword = _useState62[0];
  var setShowPassword = _useState62[1];

  var _useState7 = (0, _react.useState)('');

  var _useState72 = _slicedToArray(_useState7, 2);

  var authStatus = _useState72[0];
  var setAuthStatus = _useState72[1];
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

  var handleVoiceSubmit = function handleVoiceSubmit(parsedData) {
    return regeneratorRuntime.async(function handleVoiceSubmit$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          if (!(!parsedData.username || !parsedData.password)) {
            context$2$0.next = 4;
            break;
          }

          setError('Please provide both username and password through voice');
          voiceAuthRef.current.speak('Please provide both username and password');
          return context$2$0.abrupt('return');

        case 4:

          // Set form data and trigger submit
          setFormData({
            username: parsedData.username,
            password: parsedData.password
          });

          // Submit the form
          context$2$0.next = 7;
          return regeneratorRuntime.awrap(handleSubmitFromData({
            username: parsedData.username,
            password: parsedData.password
          }));

        case 7:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  };

  var handleChange = function handleChange(e) {
    setFormData(_extends({}, formData, _defineProperty({}, e.target.name, e.target.value)));
    setError('');
  };

  var handleSubmitFromData = function handleSubmitFromData(data) {
    var response;
    return regeneratorRuntime.async(function handleSubmitFromData$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          setIsLoading(true);
          setError('');
          setAuthStatus('Authenticating...');

          context$2$0.prev = 3;
          context$2$0.next = 6;
          return regeneratorRuntime.awrap(_servicesApi.authService.login(data));

        case 6:
          response = context$2$0.sent;

          if (response.success) {
            login(response); // Pass the full response object
            voiceAuthRef.current.speak('Welcome back, ' + (response.user.firstName || response.user.username) + '!');
            setAuthStatus('Login successful!');
          } else {
            setError(response.message || 'Login failed');
            voiceAuthRef.current.speak(response.message || 'Login failed, please try again');
          }
          context$2$0.next = 14;
          break;

        case 10:
          context$2$0.prev = 10;
          context$2$0.t0 = context$2$0['catch'](3);

          setError(context$2$0.t0.message || 'An error occurred during login');
          voiceAuthRef.current.speak('Login failed, please try again');

        case 14:
          context$2$0.prev = 14;

          setIsLoading(false);
          return context$2$0.finish(14);

        case 17:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this, [[3, 10, 14, 17]]);
  };

  var handleSubmit = function handleSubmit(e) {
    return regeneratorRuntime.async(function handleSubmit$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          e.preventDefault();

          if (!(!formData.username || !formData.password)) {
            context$2$0.next = 5;
            break;
          }

          setError('Please enter both username and password');
          voiceAuthRef.current.speak('Please enter both username and password');
          return context$2$0.abrupt('return');

        case 5:
          context$2$0.next = 7;
          return regeneratorRuntime.awrap(handleSubmitFromData(formData));

        case 7:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  };

  // Auto-login if both username and password are filled from voice input
  (0, _react.useEffect)(function () {
    if (formData.username && formData.password && formData.username.trim() && formData.password.trim()) {
      var _ret = (function () {
        var autoLogin = function autoLogin() {
          return regeneratorRuntime.async(function autoLogin$(context$4$0) {
            while (1) switch (context$4$0.prev = context$4$0.next) {
              case 0:
                if (!(!isLoading && !authStatus.includes('Authenticating'))) {
                  context$4$0.next = 3;
                  break;
                }

                context$4$0.next = 3;
                return regeneratorRuntime.awrap(handleSubmitFromData(formData));

              case 3:
              case 'end':
                return context$4$0.stop();
            }
          }, null, _this);
        };

        // Only auto-login if both fields were populated via voice
        if (authStatus.includes('Heard:')) {
          var _ret2 = (function () {
            var timer = setTimeout(function () {
              autoLogin();
            }, 1500);

            return {
              v: {
                v: function () {
                  return clearTimeout(timer);
                }
              }
            };
          })();

          if (typeof _ret2 === 'object') return _ret2.v;
        }
      })();

      if (typeof _ret === 'object') return _ret.v;
    }
  }, [formData]);

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
          '🎙️ voiceBank Login'
        ),
        _react2['default'].createElement(
          'p',
          null,
          'Welcome back! Please sign in to access your account'
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
        authStatus && _react2['default'].createElement(
          'div',
          { className: 'status-message ' + (authStatus.includes('Error') || authStatus.includes('Invalid') ? 'error' : 'info') },
          authStatus
        ),
        _react2['default'].createElement(
          'div',
          { className: 'input-group' },
          _react2['default'].createElement(
            'label',
            { htmlFor: 'username' },
            'Username'
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
              placeholder: 'Enter your username',
              'aria-label': 'Username'
            }),
            _react2['default'].createElement(
              'button',
              {
                type: 'button',
                className: 'voice-btn ' + (isListening ? 'listening' : ''),
                onClick: function () {
                  startVoiceRecognition();
                  speakInstruction("Please say your username");
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
          { className: 'input-group' },
          _react2['default'].createElement(
            'label',
            { htmlFor: 'password' },
            'Password'
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
              placeholder: 'Enter your password',
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
          { className: 'form-options' },
          _react2['default'].createElement(
            'label',
            { className: 'checkbox-label' },
            _react2['default'].createElement('input', { type: 'checkbox', 'aria-label': 'Remember me' }),
            _react2['default'].createElement('span', { className: 'checkmark' }),
            'Remember me'
          ),
          _react2['default'].createElement(
            'a',
            { href: '#forgot-password', className: 'forgot-password' },
            'Forgot Password?'
          )
        ),
        _react2['default'].createElement(
          'button',
          { type: 'submit', className: 'auth-btn', disabled: authStatus.includes('Authenticating') },
          authStatus.includes('Authenticating') ? 'Signing In...' : 'Sign In'
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
            'Say: "My username is john_doe and password is secret123"'
          ),
          _react2['default'].createElement(
            'li',
            null,
            'Say: "Login with username john_doe and password secret123"'
          )
        )
      ),
      _react2['default'].createElement(
        'div',
        { className: 'auth-footer' },
        _react2['default'].createElement(
          'p',
          null,
          'Don\'t have an account? ',
          _react2['default'].createElement(
            'a',
            { href: '/register' },
            'Sign Up'
          )
        )
      )
    )
  );
};

exports['default'] = LoginPage;
module.exports = exports['default'];