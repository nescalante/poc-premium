var ko = require('knockout');
var ContractPremium = require('./models').ContractPremium;

// model definition
var model = new ContractPremium();

ko.applyBindings(model);
