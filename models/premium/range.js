'use strict';

var ko = require('knockout');

module.exports = ConditionRange;

function ConditionRange(parent) {
  var self = this;

  self.from = ko.observable();
  self.to = ko.observable();
  self.price = ko.observable();
  self.percentage = ko.observable();
}
