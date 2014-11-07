'use strict';

var Month = require('./month.js');
var config = require('../config');
var db = require('../../db');

module.exports = ContractTest;

function ContractTest() {
  self.months = ko.observableArray();

  db('months').get().forEach(function (m) {
    var month = new Month(m.number, self);

    month.initialize(m);
    month.products().forEach(setAsTesting);
    month.testResult = ko.computed(getTotal(month.products));

    self.months.push(month);
  });

  self.testResult = ko.computed(getTotal(self.months));

  function getTotal(list) {
    return function () {
      var totals = list().map(function (p) {
        return p.testResult();
      });

      total = totals.reduce(function (a, b) { return a + b; }, 0);
    }
  }

  function setAsTesting(product) {
    product.testRetailPrice = ko.numericObservable();
    product.testSubscribers = ko.numericObservable(product.defaultSubscribers());
    product.testResult = ko.numericObservable();
    product.conditions().forEach(function (c) {
      c.currentRange = ko.observable();
    });

    [product.testRetailPrice, product.testSubscribers].forEach(function (f) {
      var calc = product.calculate(product.testSubscribers(), product.testRetailPrice());

      product.testResult(calc.total);

      calc.conditions.forEach(function (c) {
        c.currentRange(c.range);
      });
    });
  }
}
