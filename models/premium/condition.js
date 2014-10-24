'use strict';

var ko = require('knockout');

module.exports = Condition;

function Condition(parent) {
  var self = this;

  self.billingMethod = ko.observable();

  self.addCondition = function () {
    parent.conditions.push(self);
  };
}
