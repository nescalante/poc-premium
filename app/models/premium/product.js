'use strict';

var config = require('../config');
var billingMethods = require('../config').billingMethods;
var priceMethods = require('../config').priceMethods;
var Condition = require('./condition.js');

module.exports = Product;

function Product(parent) {
  var self = this;
  var subscriptions = [];
  var isSorting;

  self.invoiceGroup = ko.observable();
  self.product = ko.observable();
  self.subscribersPackage = ko.observable();
  self.category = ko.observable();
  self.price = ko.numericObservable();
  self.defaultSubscribers = ko.numericObservable();
  self.conditions = ko.observableArray();
  self.summaryCondition = ko.observable('lower');
  self.animate = ko.observable();
  self.month = function () { return parent; };
  self.name = ko.computed(function () {
    return self.product() && self.product().name;
  });

  self.equals = function (product) {
    return product.product() === self.product() &&
      product.invoiceGroup() === self.invoiceGroup() &&
      product.subscribersPackage() === self.subscribersPackage() &&
      product.category() === self.category();
  };

  self.calculate = function (subscribers, retailPrice) {
    var total, selected;
    var condition = self.summaryCondition();
    var results = self.conditions().map(function (c) {
      return c.calculate(subscribers, retailPrice);
    });
    var totals = results.map(function (r) { return r.total; });

    if (condition === 'lower') {
      total = totals.sort(function (a, b) { return a - b; })[0];
    }
    else if (condition === 'higher') {
      total = totals.sort(function (a, b) { return a - b; })[totals.length - 1];
    }
    else if (condition === 'average') {
      total = totals.reduce(function (a, b) { return a + b; }, 0) / totals.length;
    }
    else if (condition === 'sum') {
      total = totals.reduce(function (a, b) { return a + b; }, 0);
    }

    selected = condition !== 'average' && results.length > 1 ? results.filter(function (r) { return r.total === total; })[0] : null;

    return {
      total: total || 0,
      conditions: results,
      selected: selected && selected.condition,
    };
  };

  self.$last = ko.computed(function () {
    return parent.products()[parent.products().length - 1] === self;
  });

  self.remove = function () {
    if (global.confirm('Are you sure you want to remove this product?')) {
      var result = parent.products()
        .filter(function (p) { return p !== self; });

      parent.products(result);
    }
  };

  self.addCondition = function(obj) {
    var condition, billingMethod;

    // obj could be a billing method or a condition
    if (config.get(config.billingMethods).indexOf(obj) > -1) {
      condition = new Condition(obj, self);
    }
    else {
      billingMethod = config.getByName(config.billingMethods, obj.billingMethod);
      condition = new Condition(billingMethod, self, (obj.ranges && obj.ranges.length));

      condition.price(obj.price);
      condition.minimumGuaranteed(obj.minimumGuaranteed);
      condition.priceMethod(config.getByName(config.priceMethods, obj.priceMethod));

      (obj.ranges || []).forEach(condition.addRange);
    }

    self.conditions.push(condition);
  };

  self.getProductData = function () {
    return {
      summaryCondition: self.summaryCondition(),
      invoiceGroup: self.invoiceGroup() && self.invoiceGroup().name,
      subscribersPackage: self.subscribersPackage() && self.subscribersPackage().name,
      product: self.product() && self.product().name,
      category: self.category(),
      defaultSubscribers: self.defaultSubscribers(),
      conditions: self.conditions().map(function (c) {
        return {
          billingMethod: c.billingMethod.name,
          priceMethod: c.priceMethod() && c.priceMethod().name,
          minimumGuaranteed: c.minimumGuaranteed(),
          price: c.price(),
          ranges: c.ranges().map(function (r) {
            return {
              to: r.to(),
              price: r.price(),
              percentage: r.percentage(),
            };
          })
        };
      })
    };
  };
}
