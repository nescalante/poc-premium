'use strict';

var Month = require('./month.js');
var config = require('../config');
var db = require('../../db');

module.exports = ContractPremium;

function ContractPremium() {
  var self = this;
  var json;

  self.billingMethods = [config.billingMethods.flatFee, config.billingMethods.revenueShare, config.billingMethods.actualSubscribers];
  self.priceMethods = [config.priceMethods.range, config.priceMethods.incremental];
  self.invoiceGroups = config.invoiceGroups;
  self.serviceTypes = config.serviceTypes;
  self.subscribersPackages = config.subscribersPackages;
  self.months = ko.observableArray();
  self.selectedCondition = ko.observable();
  self.demoMode = ko.observable();
  self.test = test;
  self.save = save;

  self.clearData = function () {
    if (global.confirm('Are you sure you want to clear all data?')) {
      db('months').clear();
      createInitialData();
    }
  };

  createInitialData();

  try
  {
    db('months').get().forEach(function (m) {
      var month = self.months()[m.number - 1];

      if (month) {
        month.initialize(m);
      }
    });
  }
  // just in case
  catch(err) {
    console.error('Error while trying to fetch data :( \n' +
      '  The message was: ' + err.message + '\n' +
      '  Have fun looking over the stack: \n', err.stack);

    // everything went wrong, clear months and re-try
    createInitialData();
  }

  function createInitialData() {
    self.months([]);
    getInitialMonths().forEach(addMonth);
  }

  function getInitialMonths() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (i) {
      return new Month(i, self);
    });
  }

  function test() {
    save();
    global.location.href = 'test.html';
  }

  function save() {
    var data = self.months().map(function (m) {
      return m.getMonthData();
    });

    db('months').save(data);
  }

  function addMonth(month) {
    self.months.push(month);
  }

  global.onbeforeunload = save;
}
