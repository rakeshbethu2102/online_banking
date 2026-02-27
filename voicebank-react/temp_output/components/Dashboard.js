'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _this = this;

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _utilsVoiceAuth = require('../utils/VoiceAuth');

var _utilsVoiceAuth2 = _interopRequireDefault(_utilsVoiceAuth);

var _servicesApi = require('../services/api');

require('./AuthStyles.css');

var Dashboard = function Dashboard(_ref) {
  var user = _ref.user;
  var logout = _ref.logout;

  var navigate = (0, _reactRouterDom.useNavigate)();
  var displayName = user ? user.firstName || user.username : 'User';

  var _useState = (0, _react.useState)('');

  var _useState2 = _slicedToArray(_useState, 2);

  var voiceCommand = _useState2[0];
  var setVoiceCommand = _useState2[1];

  var _useState3 = (0, _react.useState)(false);

  var _useState32 = _slicedToArray(_useState3, 2);

  var isListening = _useState32[0];
  var setIsListening = _useState32[1];

  var _useState4 = (0, _react.useState)([]);

  var _useState42 = _slicedToArray(_useState4, 2);

  var commandHistory = _useState42[0];
  var setCommandHistory = _useState42[1];

  var _useState5 = (0, _react.useState)(15750.50);

  var _useState52 = _slicedToArray(_useState5, 2);

  var balance = _useState52[0];
  var setBalance = _useState52[1];
  // Mock balance

  var voiceAuthRef = (0, _react.useRef)(null);

  (0, _react.useEffect)(function () {
    voiceAuthRef.current = new _utilsVoiceAuth2['default']();

    // Set up callbacks
    voiceAuthRef.current.setOnResult(function (transcript) {
      setIsListening(false);
      setVoiceCommand(transcript);

      // Add to command history
      setCommandHistory(function (prev) {
        return [].concat(_toConsumableArray(prev), [{ command: transcript, timestamp: new Date().toLocaleTimeString() }]);
      });

      // Process the command
      processVoiceCommand(transcript);
    });

    voiceAuthRef.current.setOnError(function (event) {
      setIsListening(false);
      setVoiceCommand('');
      voiceAuthRef.current.speak('Sorry, I couldn\'t understand that. ' + event.error);
    });

    voiceAuthRef.current.setOnStart(function () {
      setIsListening(true);
      setVoiceCommand('Listening...');
    });

    voiceAuthRef.current.setOnEnd(function () {
      setIsListening(false);
      if (voiceCommand === 'Listening...') {
        setVoiceCommand('');
      }
    });

    // Load voices for speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthesis.onvoiceschanged = function () {
        // Voices are loaded
      };
    }

    // Welcome message
    if (voiceAuthRef.current) {
      voiceAuthRef.current.speak('Welcome to voiceBank, ' + user + '! How can I assist you today?');
    }

    // Cleanup on unmount
    return function () {
      if (voiceAuthRef.current) {
        voiceAuthRef.current.abort();
      }
    };
  }, [user]);

  var processVoiceCommand = function processVoiceCommand(command) {
    var lowerCmd, response;
    return regeneratorRuntime.async(function processVoiceCommand$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          lowerCmd = command.toLowerCase();
          context$2$0.prev = 1;

          if (!(lowerCmd.includes('balance') || lowerCmd.includes('money') || lowerCmd.includes('amount'))) {
            context$2$0.next = 9;
            break;
          }

          context$2$0.next = 5;
          return regeneratorRuntime.awrap(_servicesApi.bankingService.processSpeech(command));

        case 5:
          response = context$2$0.sent;

          if (response.success) {
            voiceAuthRef.current.speak(response.response);
          } else {
            voiceAuthRef.current.speak('Unable to retrieve your account balance at this time.');
          }
          context$2$0.next = 42;
          break;

        case 9:
          if (!(lowerCmd.includes('transfer') || lowerCmd.includes('send money'))) {
            context$2$0.next = 16;
            break;
          }

          context$2$0.next = 12;
          return regeneratorRuntime.awrap(_servicesApi.bankingService.processSpeech(command));

        case 12:
          response = context$2$0.sent;

          if (response.success) {
            voiceAuthRef.current.speak(response.response);
          } else {
            voiceAuthRef.current.speak('You can transfer money using the transfer option on your screen.');
          }
          context$2$0.next = 42;
          break;

        case 16:
          if (!(lowerCmd.includes('transactions') || lowerCmd.includes('history'))) {
            context$2$0.next = 23;
            break;
          }

          context$2$0.next = 19;
          return regeneratorRuntime.awrap(_servicesApi.bankingService.processSpeech(command));

        case 19:
          response = context$2$0.sent;

          if (response.success) {
            voiceAuthRef.current.speak(response.response);
          } else {
            voiceAuthRef.current.speak('You can view your recent transactions in the transactions section.');
          }
          context$2$0.next = 42;
          break;

        case 23:
          if (!(lowerCmd.includes('loan') || lowerCmd.includes('emi'))) {
            context$2$0.next = 30;
            break;
          }

          context$2$0.next = 26;
          return regeneratorRuntime.awrap(_servicesApi.bankingService.processSpeech(command));

        case 26:
          response = context$2$0.sent;

          if (response.success) {
            voiceAuthRef.current.speak(response.response);
          } else {
            voiceAuthRef.current.speak('You can check your loan details in the loans section.');
          }
          context$2$0.next = 42;
          break;

        case 30:
          if (!(lowerCmd.includes('help') || lowerCmd.includes('options'))) {
            context$2$0.next = 34;
            break;
          }

          voiceAuthRef.current.speak('You can ask about your balance, transfer money, view transactions, check loan details, or get help.');
          context$2$0.next = 42;
          break;

        case 34:
          if (!(lowerCmd.includes('logout') || lowerCmd.includes('sign out'))) {
            context$2$0.next = 38;
            break;
          }

          handleLogout();
          context$2$0.next = 42;
          break;

        case 38:
          context$2$0.next = 40;
          return regeneratorRuntime.awrap(_servicesApi.bankingService.processSpeech(command));

        case 40:
          response = context$2$0.sent;

          if (response.success) {
            voiceAuthRef.current.speak(response.response);
          } else {
            voiceAuthRef.current.speak("I'm not sure how to help with that. You can ask about balance, transfers, transactions, or loans.");
          }

        case 42:
          context$2$0.next = 48;
          break;

        case 44:
          context$2$0.prev = 44;
          context$2$0.t0 = context$2$0['catch'](1);

          console.error('Error processing voice command:', context$2$0.t0);
          voiceAuthRef.current.speak('Sorry, I encountered an error processing your request. Please try again.');

        case 48:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this, [[1, 44]]);
  };

  var handleVoiceInput = function handleVoiceInput() {
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

  var handleLogout = function handleLogout() {
    return regeneratorRuntime.async(function handleLogout$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.prev = 0;
          context$2$0.next = 3;
          return regeneratorRuntime.awrap(logout());

        case 3:
          context$2$0.next = 8;
          break;

        case 5:
          context$2$0.prev = 5;
          context$2$0.t0 = context$2$0['catch'](0);

          console.error('Logout error:', context$2$0.t0);

        case 8:
          context$2$0.prev = 8;

          navigate('/login');
          return context$2$0.finish(8);

        case 11:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this, [[0, 5, 8, 11]]);
  };

  return _react2['default'].createElement(
    'div',
    { className: 'dashboard-container' },
    _react2['default'].createElement(
      'div',
      { className: 'dashboard-header' },
      _react2['default'].createElement(
        'h1',
        null,
        'Welcome to voiceBank, ',
        user,
        '!'
      ),
      _react2['default'].createElement(
        'button',
        { onClick: handleLogout, className: 'logout-btn' },
        'Logout'
      )
    ),
    _react2['default'].createElement(
      'div',
      { className: 'dashboard-content' },
      _react2['default'].createElement(
        'div',
        { className: 'quick-actions' },
        _react2['default'].createElement(
          'h2',
          null,
          'Quick Actions'
        ),
        _react2['default'].createElement(
          'div',
          { className: 'action-grid' },
          _react2['default'].createElement(
            'div',
            { className: 'action-card' },
            _react2['default'].createElement(
              'h3',
              null,
              '💰 Check Balance'
            ),
            _react2['default'].createElement(
              'p',
              null,
              'Your balance: ₹',
              balance.toFixed(2)
            )
          ),
          _react2['default'].createElement(
            'div',
            { className: 'action-card' },
            _react2['default'].createElement(
              'h3',
              null,
              '💸 Transfer Money'
            ),
            _react2['default'].createElement(
              'p',
              null,
              'Send money to other accounts'
            )
          ),
          _react2['default'].createElement(
            'div',
            { className: 'action-card' },
            _react2['default'].createElement(
              'h3',
              null,
              '💳 View Transactions'
            ),
            _react2['default'].createElement(
              'p',
              null,
              'See your recent activity'
            )
          ),
          _react2['default'].createElement(
            'div',
            { className: 'action-card' },
            _react2['default'].createElement(
              'h3',
              null,
              '🏦 Loan Information'
            ),
            _react2['default'].createElement(
              'p',
              null,
              'Manage your loans and EMIs'
            )
          )
        )
      ),
      _react2['default'].createElement(
        'div',
        { className: 'voice-assistant-section' },
        _react2['default'].createElement(
          'h2',
          null,
          '🎙️ Voice Assistant'
        ),
        _react2['default'].createElement(
          'div',
          { className: 'voice-input-area' },
          _react2['default'].createElement(
            'button',
            {
              className: 'voice-btn-large ' + (isListening ? 'listening' : ''),
              onClick: handleVoiceInput
            },
            _react2['default'].createElement(
              'span',
              { className: 'mic-icon' },
              isListening ? '🔴' : '🎤'
            ),
            _react2['default'].createElement(
              'span',
              null,
              isListening ? 'Listening...' : 'Tap & Speak'
            )
          ),
          _react2['default'].createElement(
            'p',
            null,
            'Say: "What is my account balance?" or "Transfer money to John"'
          )
        ),
        voiceCommand && _react2['default'].createElement(
          'div',
          { className: 'voice-command-display' },
          _react2['default'].createElement(
            'p',
            null,
            _react2['default'].createElement(
              'strong',
              null,
              'Last command:'
            ),
            ' ',
            voiceCommand
          )
        ),
        _react2['default'].createElement(
          'div',
          { className: 'command-history' },
          _react2['default'].createElement(
            'h3',
            null,
            'Recent Commands'
          ),
          _react2['default'].createElement(
            'ul',
            null,
            commandHistory.slice(-3).reverse().map(function (item, index) {
              return _react2['default'].createElement(
                'li',
                { key: index },
                item.command,
                ' ',
                _react2['default'].createElement(
                  'small',
                  null,
                  '(',
                  item.timestamp,
                  ')'
                )
              );
            })
          )
        )
      )
    )
  );
};

exports['default'] = Dashboard;
module.exports = exports['default'];

// Use the existing Flask backend for processing

// For unknown commands, try processing through the backend