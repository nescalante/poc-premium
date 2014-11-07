'use strict';

var Condition = require('./condition.js');
var Product = require('./product.js');
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var config = require('../config');

module.exports = Month;

function Month(number, parent) {
  var self = this;
  var testSubscribers = 0;
  var testRetailPrice = 0;

  self.name = months[number - 1];
  self.number = number > 9 ? '' + number : '0' + number;
  self.products = ko.observableArray();

  self.$last = ko.computed(function () {
    return parent.months()[parent.months().length - 1] === self;
  });

  self.copyFrom = function (month) {
    var data = month.getMonthData();

    self.initialize(data);
  };

  self.addProduct = function (obj) {
    var product = new Product(self);

    if (obj) {
      product.summaryCondition(obj.summaryCondition);
      product.testSubscribers(obj.testSubscribers);
      product.testRetailPrice(obj.testRetailPrice);
      product.defaultSubscribers(obj.defaultSubscribers);
      product.invoiceGroup(config.getByName(config.invoiceGroups, obj.invoiceGroup));
      product.subscribersPackage(config.getByName(config.subscribersPackages, obj.subscribersPackage));
      product.product(config.getByName(config.products, obj.product));
      product.category(obj.category);

      (obj.conditions || []).forEach(product.addCondition);
    }

    self.products.push(product);
  };

  self.getMonthData = function () {
    return {
      products: self.products().map(function (p) {
        return {
          summaryCondition: p.summaryCondition(),
          testSubscribers: p.testSubscribers(),
          testRetailPrice: p.testRetailPrice(),
          invoiceGroup: p.invoiceGroup() && p.invoiceGroup().name,
          subscribersPackage: p.subscribersPackage() && p.subscribersPackage().name,
          product: p.product() && p.product().name,
          category: p.category(),
          defaultSubscribers: p.defaultSubscribers(),
          conditions: p.conditions().map(function (c) {
            return {
              billingMethod: c.billingMethod.name,
              priceMethod: c.priceMethod() && c.priceMethod().name,
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
      }),
      number: parseInt(self.number, 10),
      name: self.name,
    };
  };

  self.initialize = function (data) {
    self.products([]);

    (data.products || []).forEach(self.addProduct);
  };
}
