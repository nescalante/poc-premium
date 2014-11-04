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
  getByName: get,
};

function get(type, name) {
  if (type === billingMethods) {
    return getFromArray([billingMethods.flatFee, billingMethods.revenueShare, billingMethods.actualSubscribers], name);
  }
  else if (type === priceMethods) {
    return getFromArray([priceMethods.range, priceMethods.incremental], name);
  }
  else {
    return getFromArray(type, name);
  }

}

function getFromArray(array, name) {
  var a = array.filter(function (a) {
    return a.name === name;
  })[0];

  return(a);
}
