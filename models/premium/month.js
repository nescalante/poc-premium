var ko = require('knockout');
var Condition = require('./condition.js')
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

module.exports = Month;

function Month(number, parent) {
  var self = this;

  self.name = months[number - 1];
  self.number = number > 9 ? "" + number : "0" + number;
  self.conditions = ko.observableArray();

  self.newCondition = function() {
    parent.selectedCondition(new Condition(self));
  };
}
