'use strict';

var Condition = require('./condition.js');
var Product = require('./product.js');
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var config = require('../config');

module.exports = Month;

function Month(number, parent) {
  var self = this;

  self.name = months[number - 1];
  self.number = number;
  self.products = ko.observableArray();

  self.showClone = ko.observable();
  self.cloneProduct = ko.observable();
  self.cloneMonths = ko.numericObservable();

  self.clone = function () {
    var i = parent.months().indexOf(self) + 1;
    var end = i + (self.cloneMonths() || 0);
    var month;

    for (; i < end; i++) {
      month = parent.months()[i];

      if (month && self.cloneProduct()) {
        cloneProduct(self.cloneProduct());
      }
      else if (month) {
        self.products().forEach(cloneProduct);
      }
    }

    self.hideClone();

    function cloneProduct(product) {
      month.addProduct(product.getProductData());
    }
  };

  self.hideClone = function () {
    self.cloneProduct(null);
    self.cloneMonths(null);
    self.showClone(false);
  };

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
      product.defaultSubscribers(obj.defaultSubscribers);
      product.invoiceGroup(config.getByName(config.invoiceGroups, obj.invoiceGroup));
      product.subscribersPackage(config.getByName(config.subscribersPackages, obj.subscribersPackage));
      product.product(config.getByName(config.products, obj.product));
      product.category(obj.category);

      (obj.conditions || []).forEach(product.addCondition);
    }

    self.products.push(product);

    if (!obj) {
      product.animate(true);
      global.location.href = '#product-' + number + '-' + self.products().indexOf(product);
      global.scrollTo(global.scrollX, global.scrollY - 10);
    }
  };

  self.getMonthData = function () {
    return {
      products: self.products().map(function (p) {
        return p.getProductData();
      }),
      number: number,
      name: self.name,
    };
  };

  self.initialize = function (data) {
    self.products([]);

    (data.products || []).forEach(self.addProduct);
  };
}
