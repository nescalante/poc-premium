'use strict';

var ko = require('knockout');
var Month = require('./month.js');
var config = require('../config');

module.exports = ContractPremium;

function ContractPremium() {
  var self = this;

  self.billingMethods = [config.billingMethods.flatFee, config.billingMethods.revenueShare, config.billingMethods.actualSubscribers];
  self.invoiceGroups = config.invoiceGroups;
  self.priceMethods = config.priceMethods;
  self.serviceTypes = config.serviceTypes;
  self.subscribersPackages = config.subscribersPackages;
  self.months = ko.observableArray();
  self.selectedCondition = ko.observable();

  // initial data
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (i) {
    return new Month(i, self);
  }).forEach(addMonth);

  self.months()[0].addCondition({
    billingMethod: config.billingMethods.flatFee,
    serviceType: 'HD Basic',
    subscribersPackage: 'Premium Fox Sports',
    price: 0,
  });

  self.months()[0].addCondition({
    billingMethod: config.billingMethods.revenueShare,
    serviceType: 'HD Basic',
    subscribersPackage: 'Premium Fox Sports',
  });

  function addMonth(month) {
    self.months.push(month);
  }
}
