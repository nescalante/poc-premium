'use strict';

module.exports = {
  flatFee: createMethod('Flat Fee', 'flat-fee'),
  revenueShare: createMethod('Revenue Share', 'revenue-share', true),
  actualSubscribers: createMethod('Actual Subscribers', 'actual-subscribers'),
};

function createMethod(name, template, isRevenueShare) {
  return {
    name: name,
    template: template,
    isRevenueShare: !!isRevenueShare,
  };
}
