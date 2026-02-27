'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _componentsLoginPage = require('./components/LoginPage');

var _componentsLoginPage2 = _interopRequireDefault(_componentsLoginPage);

var _componentsRegisterPage = require('./components/RegisterPage');

var _componentsRegisterPage2 = _interopRequireDefault(_componentsRegisterPage);

var _componentsDashboard = require('./components/Dashboard');

var _componentsDashboard2 = _interopRequireDefault(_componentsDashboard);

var _servicesApi = require('./services/api');

function App() {
  var _this = this;

  var _useState = (0, _react.useState)(false);

  var _useState2 = _slicedToArray(_useState, 2);

  var isAuthenticated = _useState2[0];
  var setIsAuthenticated = _useState2[1];

  var _useState3 = (0, _react.useState)(null);

  var _useState32 = _slicedToArray(_useState3, 2);

  var currentUser = _useState32[0];
  var setCurrentUser = _useState32[1];

  // Check if user is authenticated on app load
  (0, _react.useEffect)(function () {
    var token = localStorage.getItem('token');
    var user = localStorage.getItem('currentUser');
    if (token && user) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  var login = function login(userData) {
    // Store token and user data
    localStorage.setItem('token', userData.token);
    localStorage.setItem('currentUser', JSON.stringify(userData.user));
    setIsAuthenticated(true);
    setCurrentUser(userData.user);
  };

  var logout = function logout() {
    return regeneratorRuntime.async(function logout$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.prev = 0;
          context$2$0.next = 3;
          return regeneratorRuntime.awrap(_servicesApi.authService.logout());

        case 3:
          context$2$0.next = 8;
          break;

        case 5:
          context$2$0.prev = 5;
          context$2$0.t0 = context$2$0['catch'](0);

          console.error('Logout error:', context$2$0.t0);

        case 8:
          context$2$0.prev = 8;

          // Clear local storage
          localStorage.removeItem('token');
          localStorage.removeItem('currentUser');
          setIsAuthenticated(false);
          setCurrentUser(null);
          return context$2$0.finish(8);

        case 14:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this, [[0, 5, 8, 14]]);
  };

  return _react2['default'].createElement(
    _reactRouterDom.BrowserRouter,
    null,
    _react2['default'].createElement(
      'div',
      { className: 'App' },
      _react2['default'].createElement(
        _reactRouterDom.Routes,
        null,
        _react2['default'].createElement(_reactRouterDom.Route, {
          path: '/',
          element: isAuthenticated ? _react2['default'].createElement(_reactRouterDom.Navigate, { to: '/dashboard' }) : _react2['default'].createElement(_componentsLoginPage2['default'], { login: login })
        }),
        _react2['default'].createElement(_reactRouterDom.Route, {
          path: '/login',
          element: isAuthenticated ? _react2['default'].createElement(_reactRouterDom.Navigate, { to: '/dashboard' }) : _react2['default'].createElement(_componentsLoginPage2['default'], { login: login })
        }),
        _react2['default'].createElement(_reactRouterDom.Route, { path: '/register', element: _react2['default'].createElement(_componentsRegisterPage2['default'], null) }),
        _react2['default'].createElement(_reactRouterDom.Route, {
          path: '/dashboard',
          element: isAuthenticated ? _react2['default'].createElement(_componentsDashboard2['default'], { user: currentUser, logout: logout }) : _react2['default'].createElement(_reactRouterDom.Navigate, { to: '/login' })
        })
      )
    )
  );
}

exports['default'] = App;
module.exports = exports['default'];

// Call logout API