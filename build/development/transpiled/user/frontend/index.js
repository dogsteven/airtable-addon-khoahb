"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _ui = require("@airtable/blocks/ui");

var _react = _interopRequireDefault(require("react"));

var _google_font = _interopRequireWildcard(require("./utilities/google_font"));

var _app_view = _interopRequireDefault(require("./views/app_view"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function run() {
  Promise.all([new _google_font.GoogleFont("Nunito Sans").withWeight(200).withWeight(300).withWeight(400).withWeight(600).withWeight(700), new _google_font.GoogleFont("Nunito").withWeight(200).withWeight(300).withWeight(400).withWeight(600).withWeight(700)].map(_google_font.default)).then(function () {
    (0, _ui.initializeBlock)(function () {
      return /*#__PURE__*/_react.default.createElement(_app_view.default, null);
    });
  });
}

run();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzeCJdLCJuYW1lcyI6WyJydW4iLCJQcm9taXNlIiwiYWxsIiwiR29vZ2xlRm9udCIsIndpdGhXZWlnaHQiLCJtYXAiLCJMb2FkR29vZ2xlRm9udCIsInRoZW4iXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7QUFHQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFQSxTQUFTQSxHQUFULEdBQWU7QUFDWEMsRUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksQ0FDUCxJQUFJQyx1QkFBSixDQUFlLGFBQWYsQ0FBRCxDQUFnQ0MsVUFBaEMsQ0FBMkMsR0FBM0MsRUFBZ0RBLFVBQWhELENBQTJELEdBQTNELEVBQWdFQSxVQUFoRSxDQUEyRSxHQUEzRSxFQUFnRkEsVUFBaEYsQ0FBMkYsR0FBM0YsRUFBZ0dBLFVBQWhHLENBQTJHLEdBQTNHLENBRFEsRUFFUCxJQUFJRCx1QkFBSixDQUFlLFFBQWYsQ0FBRCxDQUEyQkMsVUFBM0IsQ0FBc0MsR0FBdEMsRUFBMkNBLFVBQTNDLENBQXNELEdBQXRELEVBQTJEQSxVQUEzRCxDQUFzRSxHQUF0RSxFQUEyRUEsVUFBM0UsQ0FBc0YsR0FBdEYsRUFBMkZBLFVBQTNGLENBQXNHLEdBQXRHLENBRlEsRUFHVkMsR0FIVSxDQUdOQyxvQkFITSxDQUFaLEVBR3VCQyxJQUh2QixDQUc0QixZQUFNO0FBQzlCLDZCQUFnQjtBQUFBLDBCQUFNLDZCQUFDLGlCQUFELE9BQU47QUFBQSxLQUFoQjtBQUNILEdBTEQ7QUFNSDs7QUFFRFAsR0FBRyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgaW5pdGlhbGl6ZUJsb2NrXG59IGZyb20gJ0BhaXJ0YWJsZS9ibG9ja3MvdWknO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBMb2FkR29vZ2xlRm9udCwgeyBHb29nbGVGb250IH0gZnJvbSAnLi91dGlsaXRpZXMvZ29vZ2xlX2ZvbnQnO1xuaW1wb3J0IEFwcFZpZXcgZnJvbSAnLi92aWV3cy9hcHBfdmlldyc7XG5cbmZ1bmN0aW9uIHJ1bigpIHtcbiAgICBQcm9taXNlLmFsbChbXG4gICAgICAgIChuZXcgR29vZ2xlRm9udChcIk51bml0byBTYW5zXCIpKS53aXRoV2VpZ2h0KDIwMCkud2l0aFdlaWdodCgzMDApLndpdGhXZWlnaHQoNDAwKS53aXRoV2VpZ2h0KDYwMCkud2l0aFdlaWdodCg3MDApLFxuICAgICAgICAobmV3IEdvb2dsZUZvbnQoXCJOdW5pdG9cIikpLndpdGhXZWlnaHQoMjAwKS53aXRoV2VpZ2h0KDMwMCkud2l0aFdlaWdodCg0MDApLndpdGhXZWlnaHQoNjAwKS53aXRoV2VpZ2h0KDcwMClcbiAgICBdLm1hcChMb2FkR29vZ2xlRm9udCkpLnRoZW4oKCkgPT4ge1xuICAgICAgICBpbml0aWFsaXplQmxvY2soKCkgPT4gPEFwcFZpZXcgLz4pXG4gICAgfSlcbn1cblxucnVuKCkiXX0=