var ko = require('knockout');
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

module.exports = Month;

function Month(number) {
  var self = this;

  self.name = months[number - 1];
  self.number = number > 9 ? "" + number : "0" + number;
}
