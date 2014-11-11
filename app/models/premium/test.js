'use strict';

var Month = require('./month.js');
var config = require('../config');
var db = require('../../db');

module.exports = ContractTest;

function ContractTest() {
  var self = this;
  var testFields = ['testRetailPrice', 'testSubscribers'];

  self.months = ko.observableArray();
  self.testResult = ko.computed(getTotal(self.months));

  db('months').get().forEach(function (m) {
    var month = new Month(m.number, self);

    month.initialize(m);
    month.products().forEach(function (p) { setAsTesting(p, month); });
    month.testResult = ko.computed(getTotal(month.products));

    self.months.push(month);
  });

  function getTotal(list) {
    return function () {
      var totals = list().map(function (p) {
        return p.testResult();
      });

      return totals.reduce(function (a, b) { return a + b; }, 0);
    };
  }

  function setAsTesting(product, month) {
    product.testRetailPrice = ko.numericObservable();
    product.testSubscribers = ko.numericObservable();
    product.testResult = ko.numericObservable();
    product.conditions().forEach(function (c) {
      c.currentRange = ko.observable();
    });

    testFields
      .map(function (i) {
        return {
          field: product[i],
          name: i
        };
      }).forEach(function (i) {
        var last = {};

        i.field.subscribe(function () {
          changeTestData(product, i.name, last);
          doTest(product);
        });
      });

    doTest(product);
  }

  function changeTestData(product, field, last) {
    var products = self.months()
      .map(function (m) { return m.products(); })
      .reduce(function (x, y) { return x.concat(y); }, []);
    var i = products.indexOf(product) - 1;

    while (products[++i]) {
      if (!products[i][field]() || products[i][field]() === last[field]) {
        products[i][field](product[field]());
      }
    }

    last[field] = product[field]();
  }

  function doTest(product) {
    var calc = product.calculate(product.testSubscribers() || product.defaultSubscribers(), product.testRetailPrice());

    product.testResult(calc.total);

    calc.conditions.forEach(function (c) {
      c.condition.currentRange(c.range);
    });
  }
}
