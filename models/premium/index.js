'use strict';

var Month = require('./month.js');
var config = require('../config');

module.exports = ContractPremium;

function ContractPremium() {
  var self = this;

  self.billingMethods = [config.billingMethods.flatFee, config.billingMethods.revenueShare, config.billingMethods.actualSubscribers];
  self.priceMethods = [config.priceMethods.range, config.priceMethods.incremental];
  self.invoiceGroups = config.invoiceGroups;
  self.serviceTypes = config.serviceTypes;
  self.subscribersPackages = config.subscribersPackages;
  self.months = ko.observableArray();
  self.selectedCondition = ko.observable();
  self.demoMode = ko.observable();

  // initial data
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (i) {
    return new Month(i, self);
  }).forEach(addMonth);

  self.months()[0].addCondition({
    billingMethod: config.billingMethods.actualSubscribers,
    serviceType: 'HD Basic',
    subscribersPackage: 'Premium Fox Sports',
    ranges: [{
      to: 100,
      price: 1,
    }, {
      to: 200,
      price: 2,
    }, {
      price: 3,
    }],
  });

  self.demoMode(true);

  function addMonth(month) {
    self.months.push(month);
  }
}
