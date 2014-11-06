'use strict';

var billingMethods = require('./billingMethods.js');
var invoiceGroups = require('./invoiceGroups.js');
var priceMethods = require('./priceMethods.js');
var products = require('./products.js');
var serviceTypes = require('./serviceTypes.js');
var subscribersPackages = require('./subscribersPackages.js');

module.exports = {
  billingMethods: billingMethods,
  invoiceGroups: invoiceGroups,
  priceMethods: priceMethods,
  products: products,
  serviceTypes: serviceTypes,
  subscribersPackages: subscribersPackages,
  getByName: getByName,
  get: get
};

function getByName(type, name) {
  return get(type).filter(function (i) { return i.name === name; })[0];
}

function get(type) {
  return Object.keys(type).map(function (k) { return type[k]; });
}
