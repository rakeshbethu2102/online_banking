// src/services/api.js
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _this = this;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var API_BASE_URL = 'http://localhost:5000/api';

// Create a base API request function
var apiRequest = function apiRequest(endpoint) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var url, config, token, response, data;
  return regeneratorRuntime.async(function apiRequest$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        url = '' + API_BASE_URL + endpoint;
        config = _extends({
          headers: _extends({
            'Content-Type': 'application/json'
          }, options.headers)
        }, options);
        token = localStorage.getItem('token');

        if (token && !config.headers.Authorization) {
          config.headers.Authorization = 'Bearer ' + token;
        }

        context$1$0.prev = 4;
        context$1$0.next = 7;
        return regeneratorRuntime.awrap(fetch(url, config));

      case 7:
        response = context$1$0.sent;
        context$1$0.next = 10;
        return regeneratorRuntime.awrap(response.json());

      case 10:
        data = context$1$0.sent;

        if (response.ok) {
          context$1$0.next = 13;
          break;
        }

        throw new Error(data.message || 'Something went wrong');

      case 13:
        return context$1$0.abrupt('return', data);

      case 16:
        context$1$0.prev = 16;
        context$1$0.t0 = context$1$0['catch'](4);

        console.error('API Error for ' + url + ':', context$1$0.t0);
        throw context$1$0.t0;

      case 20:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[4, 16]]);
};

// Authentication services
var authService = {
  // Register a new user
  register: function register(userData) {
    return regeneratorRuntime.async(function register$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          return context$1$0.abrupt('return', apiRequest('/register', {
            method: 'POST',
            body: JSON.stringify(userData)
          }));

        case 1:
        case 'end':
          return context$1$0.stop();
      }
    }, null, _this);
  },

  // Login user
  login: function login(credentials) {
    return regeneratorRuntime.async(function login$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          return context$1$0.abrupt('return', apiRequest('/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
          }));

        case 1:
        case 'end':
          return context$1$0.stop();
      }
    }, null, _this);
  },

  // Logout user
  logout: function logout() {
    return regeneratorRuntime.async(function logout$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          return context$1$0.abrupt('return', apiRequest('/logout', {
            method: 'POST'
          }));

        case 1:
        case 'end':
          return context$1$0.stop();
      }
    }, null, _this);
  },

  // Check if user is authenticated
  isAuthenticated: function isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Get current user info
  getCurrentUser: function getCurrentUser() {
    var user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  // Test protected route
  testProtected: function testProtected() {
    return regeneratorRuntime.async(function testProtected$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          return context$1$0.abrupt('return', apiRequest('/protected/test', {
            method: 'GET'
          }));

        case 1:
        case 'end':
          return context$1$0.stop();
      }
    }, null, _this);
  }
};

exports.authService = authService;
// Banking services
var bankingService = {
  // Process speech commands (existing voiceBank functionality)
  processSpeech: function processSpeech(speechText) {
    return regeneratorRuntime.async(function processSpeech$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          return context$1$0.abrupt('return', fetch('http://localhost:5000/process_speech', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: speechText })
          }).then(function (response) {
            return response.json();
          }));

        case 1:
        case 'end':
          return context$1$0.stop();
      }
    }, null, _this);
  }
};

exports.bankingService = bankingService;
exports['default'] = {
  authService: authService,
  bankingService: bankingService
};

// Add auth token if available