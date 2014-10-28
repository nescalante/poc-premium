'use strict';

module.exports = {
  flatFee: getMethod('Flat Fee', 'flat-fee'),
  revenueShare: getMethod('Revenue Share', 'revenue-share', true),
  actualSubscribers: getMethod('Actual Subscribers', 'actual-subscribers', true),
};

function getMethod(name, template, hasDefault) {
  return {
    name: name,
    template: template,
    hasDefault: !!hasDefault
  };
}
