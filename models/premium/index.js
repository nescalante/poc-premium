'use strict';

var ko = require('knockout');
var Month = require('./month.js');
var config = require('../config');

module.exports = ContractPremium;

function ContractPremium() {
  var self = this;

  self.billingMethods = config.billingMethods;
  self.invoiceGroups = config.invoiceGroups;
  self.priceMethods = config.priceMethods;
  self.serviceTypes = config.serviceTypes;
  self.subscribersPackages = config.subscribersPackages;
  self.months = ko.observableArray();
  self.selectedCondition = ko.observable();

  self.productsFor = function (type) {
    return ko.computed(function () {
      return config.products.filter(function (p) { return p.type === type(); });
    });
  };

  // initial data
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (i) {
    return new Month(i, self);
  }).forEach(addMonth);

  self.months()[0].addCondition({
    billingMethod: config.billingMethods[0], // flat fee
    signal: 'HD Basic',
    package: 'Premium Fox Sports',
    price: 0,
  });

  self.months()[0].addCondition({
    billingMethod: config.billingMethods[1], // revenue share
    signal: 'HD Basic',
    package: 'Premium Fox Sports',
  });

  function addMonth(month) {
    self.months.push(month);
  }
}
