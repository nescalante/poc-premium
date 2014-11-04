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
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (i) {
    return new Month(i, self);
  }).forEach(addMonth);

  if (global.localStorage && global.localStorage.data) {
    json = eval('(' + global.localStorage.data + ')');

    json.months.forEach(function (m) {
      var month = self.months()[m.number - 1];

      month.summaryCondition(m.summaryCondition);
      month.testSubscribers(m.testSubscribers);
      month.testRetailPrice(m.testRetailPrice);

      m.conditions.forEach(month.addCondition);
    });
  }

  self.testResult = ko.computed(function () {
    return self.months().map(function (m) {
      return m.testResult();
    }).reduce(function (a, b) {
      return (a || 0) + (b || 0);
    }, 0);
  });

  function save() {
    var data = JSON.stringify({
      months: self.months().map(function (m) {
        return {
          conditions: m.conditions().map(function (c) {
            return {
              billingMethod: c.billingMethod.name,
              invoiceGroup: c.invoiceGroup() && c.invoiceGroup().name,
              priceMethod: c.priceMethod() && c.priceMethod().name,
              serviceType: c.serviceType() && c.serviceType().name,
              subscribersPackage: c.subscribersPackage() && c.subscribersPackage().name,
              product: c.product() && c.product().name,
              price: c.price(),
              defaultSubscribers: c.defaultSubscribers(),
              ranges: c.ranges().map(function (r) {
                return {
                  to: r.to(),
                  price: r.price(),
                  percentage: r.percentage(),
                };
              })
            };
          }),
          number: parseInt(m.number, 10),
          name: m.name,
          summaryCondition: m.summaryCondition(),
          testSubscribers: m.testSubscribers(),
          testRetailPrice: m.testRetailPrice(),
        };
      })
    });

    global.localStorage['data'] = data;
  }

  function addMonth(month) {
    self.months.push(month);
  }

  (function saveForever() {
    setInterval(function () {
      save();
      saveForever();
    }, 2000);
  })();
}
