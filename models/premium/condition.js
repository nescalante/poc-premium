'use strict';

var ko = require('knockout');
var ConditionRange = require('./range.js');

module.exports = Condition;

function Condition(parent) {
  var self = this;
  var subscriptions = [];

  self.billingMethod = ko.observable();
  self.signal = ko.observable();
  self.package = ko.observable();
  self.price = ko.observable();
  self.ranges = ko.observableArray();

  self.addToMonth = function () {
    parent.conditions.push(self);
  };

  initializeNewRange();

  function initializeNewRange() {
    var lastRange;

    self.ranges.push(new ConditionRange(self));
    lastRange = self.ranges()[self.ranges().length - 1];
    [
      lastRange.from,
      lastRange.to,
      lastRange.price,
      lastRange.percentage,
    ].map(function (f) {
      return f.subscribe(addNewRange);
    }).forEach(function (s) {
      subscriptions.push(s);
    });
  }

  function addNewRange() {
    subscriptions.forEach(function (s) {
      s.dispose();
    });
    subscriptions = [];
    initializeNewRange();
  }
}
