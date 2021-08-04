/**
 * colors
 */

const chalk = require('chalk');

exports.formatTitle = function (severity, message) {
  return chalk[exports.bgColor(severity)].black('', message, '');
};

exports.formatText = function (severity, message) {
  return chalk[exports.textColor(severity)](message);
};

exports.bgColor = function (severity) {
  const color = exports.textColor(severity);
  return 'bg' + capitalizeFirstLetter(color);
};

exports.textColor = function (severity) {
  switch (severity.toLowerCase()) {
    case 'success':
      return 'green';
    case 'info':
      return 'blue';
    case 'note':
      return 'white';
    case 'warning':
      return 'yellow';
    case 'error':
      return 'red';
    default:
      return 'red';
  }
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
