'use strict';

var Month = require('./month.js');
var config = require('../config');

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

  // initial data
  getInitialMonths().forEach(addMonth);

  if (global.localStorage && global.localStorage.data) {
    // its evalution baby!
    json = eval('(' + global.localStorage.data + ')');

    try
    {
      json.months.forEach(function (m) {
        var month = self.months()[m.number - 1];

        if (month) {
          month.initialize(m);
        }
      });
    }
    catch(err) {
      console.error('Error while trying to fetch data :( \n' +
        '  The message was: ' + err.message + '\n' +
        '  Have fun looking over the stack: \n', err.stack);
      global.localStorage.clear();

      // everything went wrong, clear months and re-try
      self.months([]);
      getInitialMonths().forEach(addMonth);
    }
  }

  self.testResult = ko.computed(function () {
    if (self.demoMode()) {
      return self.months().map(function (m) {
        return m.testResult();
      }).reduce(function (a, b) {
        return (a || 0) + (b || 0);
      }, 0);
    }
  });

  function getInitialMonths() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (i) {
      return new Month(i, self);
    });
  }

  function save() {
    var data = JSON.stringify({
      months: self.months().map(function (m) {
        return m.getMonthData();
      })
    });

    global.localStorage['data'] = data;
  }

  global.onbeforeunload = save;

  function addMonth(month) {
    self.months.push(month);
  }

  (function saveForever() {
    setInterval(function () {
      save();
      saveForever();
    }, 3000);
  })();
}
