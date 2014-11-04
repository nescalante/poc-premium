'use strict';

module.exports = {
  flatFee: createMethod('Flat Fee', 'flat-fee'),
  revenueShare: createMethod('Revenue Share', 'revenue-share'),
  actualSubscribers: createMethod('Actual Subscribers', 'actual-subscribers', true),
};

function createMethod(name, template, isActualSubscribers) {
  return {
    name: name,
    template: template,
    isActualSubscribers: !!isActualSubscribers,
  };
}
