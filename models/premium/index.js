'use strict';

var ko = require('knockout');
var Month = require('./month.js');
var config = require('../config');

module.exports = ContractPremium;

function ContractPremium() {
  var self = this;

  self.billingMethods = config.billingMethods;
  self.months = ko.observableArray();
  self.selectedCondition = ko.observable();

  // initial data
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (i) {
    return new Month(i, self);
  }).forEach(addMonth);

  function addMonth(month) {
    self.months.push(month);
  }
}
