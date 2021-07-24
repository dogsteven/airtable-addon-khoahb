"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _ui = require("@airtable/blocks/ui");

var _react = _interopRequireWildcard(require("react"));

var _casso_service = require("./services/casso_service");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var App = function App() {
  var _globalConfig$get;

  var base = (0, _ui.useBase)();
  var globalConfig = (0, _ui.useGlobalConfig)();
  var selectedTableId = (_globalConfig$get = globalConfig.get('selectedTableId')) !== null && _globalConfig$get !== void 0 ? _globalConfig$get : '';
  var table = base.getTableByIdIfExists(selectedTableId);
  var record = (0, _ui.useRecords)(table);

  var _useState = (0, _react.useState)(""),
      _useState2 = _slicedToArray(_useState, 2),
      apiKey = _useState2[0],
      setApiKey = _useState2[1];

  var setStateApiKey = function setStateApiKey(event) {
    setApiKey(event.target.value);
  };

  var _useState3 = (0, _react.useState)(""),
      _useState4 = _slicedToArray(_useState3, 2),
      status = _useState4[0],
      setStatus = _useState4[1];

  var getAccessTokenHanlder = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var data;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return new _casso_service.CassoService().getAccessToken(apiKey);

            case 2:
              data = _context.sent;

              if ('error' in data) {
                setStatus(data.message);
              } else {
                setStatus(data.access_token);
              }

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function getAccessTokenHanlder() {
      return _ref.apply(this, arguments);
    };
  }();

  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/_react.default.createElement(_ui.TablePickerSynced, {
    globalConfigKey: "selectedTableId"
  }), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'row'
    }
  }, /*#__PURE__*/_react.default.createElement("input", {
    value: apiKey,
    onChange: setStateApiKey
  }), /*#__PURE__*/_react.default.createElement("button", {
    onClick: getAccessTokenHanlder
  }, "Get Access Token")), "Status: ", status);
};

(0, _ui.initializeBlock)(function () {
  return /*#__PURE__*/_react.default.createElement(App, null);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzeCJdLCJuYW1lcyI6WyJBcHAiLCJiYXNlIiwiZ2xvYmFsQ29uZmlnIiwic2VsZWN0ZWRUYWJsZUlkIiwiZ2V0IiwidGFibGUiLCJnZXRUYWJsZUJ5SWRJZkV4aXN0cyIsInJlY29yZCIsImFwaUtleSIsInNldEFwaUtleSIsInNldFN0YXRlQXBpS2V5IiwiZXZlbnQiLCJ0YXJnZXQiLCJ2YWx1ZSIsInN0YXR1cyIsInNldFN0YXR1cyIsImdldEFjY2Vzc1Rva2VuSGFubGRlciIsIkNhc3NvU2VydmljZSIsImdldEFjY2Vzc1Rva2VuIiwiZGF0YSIsIm1lc3NhZ2UiLCJhY2Nlc3NfdG9rZW4iLCJkaXNwbGF5IiwiZmxleERpcmVjdGlvbiJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOztBQU1BOztBQUtBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsR0FBYSxHQUFHLFNBQWhCQSxHQUFnQixHQUFNO0FBQUE7O0FBQ3hCLE1BQU1DLElBQUksR0FBRyxrQkFBYjtBQUNBLE1BQU1DLFlBQVksR0FBRywwQkFBckI7QUFFQSxNQUFNQyxlQUFlLHdCQUFJRCxZQUFZLENBQUNFLEdBQWIsQ0FBaUIsaUJBQWpCLENBQUosaUVBQTJDLEVBQWhFO0FBQ0EsTUFBTUMsS0FBSyxHQUFHSixJQUFJLENBQUNLLG9CQUFMLENBQTBCSCxlQUExQixDQUFkO0FBRUEsTUFBTUksTUFBTSxHQUFHLG9CQUFXRixLQUFYLENBQWY7O0FBRUEsa0JBQTRCLHFCQUFTLEVBQVQsQ0FBNUI7QUFBQTtBQUFBLE1BQU9HLE1BQVA7QUFBQSxNQUFlQyxTQUFmOztBQUNBLE1BQU1DLGNBQW9ELEdBQUcsU0FBdkRBLGNBQXVELENBQUNDLEtBQUQsRUFBVztBQUNwRUYsSUFBQUEsU0FBUyxDQUFDRSxLQUFLLENBQUNDLE1BQU4sQ0FBYUMsS0FBZCxDQUFUO0FBQ0gsR0FGRDs7QUFJQSxtQkFBNEIscUJBQVMsRUFBVCxDQUE1QjtBQUFBO0FBQUEsTUFBT0MsTUFBUDtBQUFBLE1BQWVDLFNBQWY7O0FBRUEsTUFBTUMscUJBQXFCO0FBQUEsdUVBQUc7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQkFDUixJQUFJQywyQkFBSixFQUFELENBQXFCQyxjQUFyQixDQUFvQ1YsTUFBcEMsQ0FEUzs7QUFBQTtBQUN0QlcsY0FBQUEsSUFEc0I7O0FBRTFCLGtCQUFJLFdBQVdBLElBQWYsRUFBcUI7QUFDakJKLGdCQUFBQSxTQUFTLENBQUNJLElBQUksQ0FBQ0MsT0FBTixDQUFUO0FBQ0gsZUFGRCxNQUVPO0FBQ0hMLGdCQUFBQSxTQUFTLENBQUNJLElBQUksQ0FBQ0UsWUFBTixDQUFUO0FBQ0g7O0FBTnlCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBQUg7O0FBQUEsb0JBQXJCTCxxQkFBcUI7QUFBQTtBQUFBO0FBQUEsS0FBM0I7O0FBU0Esc0JBQ0k7QUFDSSxJQUFBLEtBQUssRUFBRTtBQUNITSxNQUFBQSxPQUFPLEVBQUUsTUFETjtBQUVIQyxNQUFBQSxhQUFhLEVBQUU7QUFGWjtBQURYLGtCQU1JLDZCQUFDLHFCQUFEO0FBQ0ksSUFBQSxlQUFlLEVBQUM7QUFEcEIsSUFOSixlQVNJO0FBQ0ksSUFBQSxLQUFLLEVBQUU7QUFDSEQsTUFBQUEsT0FBTyxFQUFFLE1BRE47QUFFSEMsTUFBQUEsYUFBYSxFQUFFO0FBRlo7QUFEWCxrQkFNSTtBQUFPLElBQUEsS0FBSyxFQUFFZixNQUFkO0FBQXNCLElBQUEsUUFBUSxFQUFFRTtBQUFoQyxJQU5KLGVBT0k7QUFDSSxJQUFBLE9BQU8sRUFBRU07QUFEYix3QkFQSixDQVRKLGNBc0JhRixNQXRCYixDQURKO0FBMEJILENBbkREOztBQXFEQSx5QkFBZ0I7QUFBQSxzQkFBTSw2QkFBQyxHQUFELE9BQU47QUFBQSxDQUFoQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgaW5pdGlhbGl6ZUJsb2NrLCB1c2VHbG9iYWxDb25maWcsXG4gICAgdXNlQmFzZSwgdXNlUmVjb3JkcyxcbiAgICBUYWJsZVBpY2tlclN5bmNlZFxufSBmcm9tICdAYWlydGFibGUvYmxvY2tzL3VpJztcblxuaW1wb3J0IFJlYWN0LCB7XG4gICAgdXNlU3RhdGUsXG4gICAgQ2hhbmdlRXZlbnRIYW5kbGVyXG59IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgQ2Fzc29TZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9jYXNzb19zZXJ2aWNlJztcblxuY29uc3QgQXBwOiBSZWFjdC5GQyA9ICgpID0+IHtcbiAgICBjb25zdCBiYXNlID0gdXNlQmFzZSgpO1xuICAgIGNvbnN0IGdsb2JhbENvbmZpZyA9IHVzZUdsb2JhbENvbmZpZygpO1xuXG4gICAgY29uc3Qgc2VsZWN0ZWRUYWJsZUlkID0gKGdsb2JhbENvbmZpZy5nZXQoJ3NlbGVjdGVkVGFibGVJZCcpID8/ICcnKSBhcyBzdHJpbmc7XG4gICAgY29uc3QgdGFibGUgPSBiYXNlLmdldFRhYmxlQnlJZElmRXhpc3RzKHNlbGVjdGVkVGFibGVJZCk7XG5cbiAgICBjb25zdCByZWNvcmQgPSB1c2VSZWNvcmRzKHRhYmxlKTtcblxuICAgIGNvbnN0IFthcGlLZXksIHNldEFwaUtleV0gPSB1c2VTdGF0ZShcIlwiKTtcbiAgICBjb25zdCBzZXRTdGF0ZUFwaUtleTogQ2hhbmdlRXZlbnRIYW5kbGVyPEhUTUxJbnB1dEVsZW1lbnQ+ID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHNldEFwaUtleShldmVudC50YXJnZXQudmFsdWUpO1xuICAgIH1cblxuICAgIGNvbnN0IFtzdGF0dXMsIHNldFN0YXR1c10gPSB1c2VTdGF0ZShcIlwiKTtcblxuICAgIGNvbnN0IGdldEFjY2Vzc1Rva2VuSGFubGRlciA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgbGV0IGRhdGEgPSBhd2FpdCAobmV3IENhc3NvU2VydmljZSgpKS5nZXRBY2Nlc3NUb2tlbihhcGlLZXkpO1xuICAgICAgICBpZiAoJ2Vycm9yJyBpbiBkYXRhKSB7XG4gICAgICAgICAgICBzZXRTdGF0dXMoZGF0YS5tZXNzYWdlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNldFN0YXR1cyhkYXRhLmFjY2Vzc190b2tlbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJ1xuICAgICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgICAgPFRhYmxlUGlja2VyU3luY2VkXG4gICAgICAgICAgICAgICAgZ2xvYmFsQ29uZmlnS2V5PSdzZWxlY3RlZFRhYmxlSWQnXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ3JvdydcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB2YWx1ZT17YXBpS2V5fSBvbkNoYW5nZT17c2V0U3RhdGVBcGlLZXl9IC8+XG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtnZXRBY2Nlc3NUb2tlbkhhbmxkZXJ9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICBHZXQgQWNjZXNzIFRva2VuXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIFN0YXR1czoge3N0YXR1c31cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuaW5pdGlhbGl6ZUJsb2NrKCgpID0+IDxBcHAgLz4pO1xuIl19