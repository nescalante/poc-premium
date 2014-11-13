(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

module.exports = db;

function db(table) {
  return {
    get: function () {
      var item = global.localStorage.getItem(table);

      if (item) {
        // its evalution baby!
        return eval('(' + item + ')');
      }
      else {
        return [];
      }
    },
    save: function (data) {
      var str = JSON.stringify(data);

      global.localStorage.setItem(table, str);
    },
    clear: function (table) {
      global.localStorage.removeItem(table);
    }
  };
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
'use strict';

module.exports = numericObservable;

function numericObservable(initialValue) {
  var _actual = ko.observable(initialValue);

  var result = ko.computed({
    read: function() {
      return _actual();
    },
    write: function(newValue) {
      var parsedValue = parseFloat(newValue);
      _actual(isNaN(parsedValue) ? newValue : parsedValue);
    }
  });

  return result;
}

},{}],3:[function(require,module,exports){
(function (global){
'use strict';

global.ko = require('knockout');
global.models = require('./models');
global.use = use;

// extensions
ko.numericObservable = require('./extensions/numericObservable.js');

function use(Model) {
  var model = new Model();

  ko.applyBindings(model);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./extensions/numericObservable.js":2,"./models":11,"knockout":19}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{"./billingMethods.js":4,"./invoiceGroups.js":6,"./priceMethods.js":7,"./products.js":8,"./serviceTypes.js":9,"./subscribersPackages.js":10}],6:[function(require,module,exports){
'use strict';

var groups = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (i) {
  return {
    name: 'Invoice ' + i,
  };
});

module.exports = groups;

},{}],7:[function(require,module,exports){
'use strict';

var range = createMethod('Range');
var incremental = createMethod('Incremental');

module.exports = {
  range: range,
  incremental: incremental,
};

function createMethod(name) {
  return {
    name: name,
  };
}

},{}],8:[function(require,module,exports){
'use strict';

var products = [{
  name: 'Signal Fox HD',
  type: 'Signal',
}, {
  name: 'Signal Fox Life',
  type: 'Signal',
}, {
  name: 'Signal Fox Sports',
  type: 'Signal',
}, {
  name: 'Signal Fox Sports 2',
  type: 'Signal',
}, {
  name: 'Signal Fox Sports 2 HD',
  type: 'Signal',
}, {
  name: 'Signal Fox Sports Premium',
  type: 'Signal',
}, {
  name: 'Signal FX',
  type: 'Signal',
}, {
  name: 'Signal FX HD',
  type: 'Signal',
}, {
  name: 'Signal Mundo Fox',
  type: 'Signal',
}, {
  name: 'CF+NG',
  type: 'Package',
}, {
  name: 'CF+NG+FS',
  type: 'Package',
}, {
  name: 'CF+NG+FX+FS3+FL',
  type: 'Package',
}, {
  name: 'FS3+NGW',
  type: 'Package',
}, {
  name: 'FL+NGW+FS3',
  type: 'Package',
}, {
  name: 'Syfy+UC',
  type: 'Package',
}, {
  name: 'FSB+FS2',
  type: 'Package',
}, {
  name: 'CF+NG+FS3',
  type: 'Package',
}, {
  name: 'UTILIS+CF+NG+FX+FL',
  type: 'Package',
}];

module.exports = products;

},{}],9:[function(require,module,exports){
'use strict';

var products = require('./products.js');
var types = [{
  name: 'Signal',
}, {
  name: 'Package',
}];

module.exports = types.map(function (t) {
  t.products = products.filter(function (p) { return p.type === t.name; });

  return t;
});

},{"./products.js":8}],10:[function(require,module,exports){
'use strict';

var packages = [{
  name: 'New',
}, {
  name: 'Old',
}, {
  name: 'All',
}];

module.exports = packages;

},{}],11:[function(require,module,exports){
'use strict';

var config = require('./config');
var premium = require('./premium');

module.exports = {
  config: config,
  premium: premium,
};

},{"./config":5,"./premium":14}],12:[function(require,module,exports){
'use strict';

var billingMethods = require('../config').billingMethods;
var priceMethods = require('../config').priceMethods;
var ConditionRange = require('./range.js');

module.exports = Condition;

function Condition(billingMethod, parent, preventRangeInit) {
  var self = this;
  var subscriptions = [];
  var isSorting;

  self.billingMethod = billingMethod;
  self.priceMethod = ko.observable(priceMethods.range);
  self.minimumGuaranteed = ko.numericObservable();
  self.price = ko.numericObservable();
  self.ranges = ko.observableArray();

  self.ranges.subscribe(function () {
    var lastRange = self.ranges()[self.ranges().length - 1];
    disposeSubscriptions();
    subscribeRange(lastRange);
    if (!isSorting) {
      isSorting = true;
      self.sort();
    }
  });

  self.sort = function () {
    var result = self.ranges()
      .sort(function (a, b) {
        if (!b.to()) {
          return -1;
        }
        else if (!a.to()) {
          return 1;
        }
        else {
          return a.to() - b.to();
        }
      });

    self.ranges(result);
    isSorting = false;
  };

  self.remove = function () {
    var result = parent.conditions()
      .filter(function (c) { return c !== self; });

    parent.conditions(result);
  };

  self.calculate = function(subscribers, retailPrice) {
    var range = getRangeFor(subscribers);
    var remaining = subscribers;
    var total = 0;
    var last;

    if (billingMethod === billingMethods.flatFee) {
      total = self.price();
    }
    else if (billingMethod === billingMethods.revenueShare && range) {
      total = retailPrice * (range.percentage() / 100) * remaining;
    }
    else if (billingMethod === billingMethods.actualSubscribers && range) {
      if (self.minimumGuaranteed() && remaining < self.minimumGuaranteed()) {
        remaining = self.minimumGuaranteed();
      }

      if (self.priceMethod() === priceMethods.range) {
        total = range.price() * remaining;
      }
      else if (self.priceMethod() === priceMethods.incremental) {
        self.ranges().forEach(function (r) {
          var lastTo = last ? last.to() : 0;

          if (remaining && r.price()) {
            if (r.to()) {
              remaining -= r.to() - lastTo;

              if (remaining > 0) {
                total += (r.to() - lastTo) * r.price();
              }
              else {
                total += (r.to() - lastTo + remaining) * r.price();
                remaining = 0;
              }
            }
            else {
              total += remaining * r.price();
              remaining = 0;
            }
          }

          last = r;
        });
      }
    }

    return {
      total: total || 0,
      range: range,
      condition: self,
    };
  };

  self.addRange = function (i) {
    var range = new ConditionRange(self);

    range.to(i.to);
    range.price(i.price);
    range.percentage(i.percentage);

    self.ranges.push(range);
  };

  !preventRangeInit && initializeNewRange();

  function initializeNewRange() {
    self.ranges.push(new ConditionRange(self));
  }

  function subscribeRange(range) {
    [
      'to',
    ].map(function (f) {
      return range[f].subscribe(addNewRange);
    }).forEach(function (s) {
      subscriptions.push(s);
    });
  }

  function getRangeFor(subscribers) {
    var range;

    self.ranges().forEach(function (r) {
      var isOnRange = r.to() >= subscribers;

      if (isOnRange && r.isHigherThan(range)) {
        range = r;
      }
    });

    if (!range) {
      range = self.ranges().filter(function (r) {
        return (r.price() || r.percentage()) && !r.to();
      })[0];
    }

    return range;
  }

  function addNewRange(value) {
    if (value) {
      disposeSubscriptions();
      initializeNewRange();
    }
  }

  function disposeSubscriptions() {
    subscriptions.forEach(function (s) {
        s.dispose();
      });
    subscriptions = [];
  }
}

},{"../config":5,"./range.js":17}],13:[function(require,module,exports){
(function (global){
'use strict';

var Month = require('./month.js');
var config = require('../config');
var db = require('../../db');

module.exports = ContractPremium;

function ContractPremium() {
  var self = this;
  var json;

  self.billingMethods = [config.billingMethods.flatFee, config.billingMethods.revenueShare, config.billingMethods.actualSubscribers];
  self.priceMethods = [config.priceMethods.range, config.priceMethods.incremental];
  self.invoiceGroups = config.invoiceGroups;
  self.serviceTypes = config.serviceTypes;
  self.subscribersPackages = config.subscribersPackages;
  self.months = ko.observableArray();
  self.selectedCondition = ko.observable();
  self.demoMode = ko.observable();
  self.test = test;
  self.save = save;

  self.clearData = function () {
    if (global.confirm('Are you sure you want to clear all data?')) {
      db('months').clear();
      createInitialData();
    }
  };

  createInitialData();

  try
  {
    db('months').get().forEach(function (m) {
      var month = self.months()[m.number - 1];

      if (month) {
        month.initialize(m);
      }
    });
  }
  // just in case
  catch(err) {
    console.error('Error while trying to fetch data :( \n' +
      '  The message was: ' + err.message + '\n' +
      '  Have fun looking over the stack: \n', err.stack);

    // everything went wrong, clear months and re-try
    createInitialData();
  }

  function createInitialData() {
    self.months([]);
    getInitialMonths().forEach(addMonth);
  }

  function getInitialMonths() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (i) {
      return new Month(i, self);
    });
  }

  function test() {
    save();
    global.location.href = 'test.html';
  }

  function save() {
    var data = self.months().map(function (m) {
      return m.getMonthData();
    });

    db('months').save(data);
  }

  function addMonth(month) {
    self.months.push(month);
  }

  global.onbeforeunload = save;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../db":1,"../config":5,"./month.js":15}],14:[function(require,module,exports){
'use strict';

var Contract = require('./contract.js');
var ContractTest = require('./test.js');
var Month = require('./month.js');
var Condition = require('./condition.js');
var Range = require('./range.js');

module.exports = {
  Contract: Contract,
  ContractTest: ContractTest,
  Month: Month,
  Condition: Condition,
  Range: Range,
};

},{"./condition.js":12,"./contract.js":13,"./month.js":15,"./range.js":17,"./test.js":18}],15:[function(require,module,exports){
(function (global){
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../config":5,"./condition.js":12,"./product.js":16}],16:[function(require,module,exports){
(function (global){
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../config":5,"./condition.js":12}],17:[function(require,module,exports){
'use strict';

module.exports = ConditionRange;

function ConditionRange(parent) {
  var self = this;

  self.to = ko.numericObservable();
  self.price = ko.numericObservable();
  self.percentage = ko.numericObservable();

  self.remove = function () {
    var isLast = self === parent.ranges()[parent.ranges().length - 1];
    var isAnotherInfinity = parent.ranges().filter(function (r) { return r !== self && !r.to(); }).length;

    if ((parent.ranges().length > 1 && !isLast) || isAnotherInfinity) {
      var result = parent.ranges()
        .filter(function (r) { return r !== self; });
      parent.ranges(result);
    }
  };

  self.$last = ko.computed(function () {
    return parent.ranges()[parent.ranges().length - 1] === self;
  });

  [self.to, self.price, self.percentage].forEach(function (f) {
    f.subscribe(function (v) {
      if (!self.to() && !self.price() && !self.percentage()) {
        self.remove();
      }
      if (!self.to() && !self.$last() && parent.ranges().length) {
        parent.ranges()[parent.ranges().length - 1].remove();
      }
    });
  });

  self.isHigherThan = function (r) {
    return !r || (self.to() < r.to());
  };
}

},{}],18:[function(require,module,exports){
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

},{"../../db":1,"../config":5,"./month.js":15}],19:[function(require,module,exports){
/*!
 * Knockout JavaScript library v3.2.0
 * (c) Steven Sanderson - http://knockoutjs.com/
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

(function(){
var DEBUG=true;
(function(undefined){
    // (0, eval)('this') is a robust way of getting a reference to the global object
    // For details, see http://stackoverflow.com/questions/14119988/return-this-0-evalthis/14120023#14120023
    var window = this || (0, eval)('this'),
        document = window['document'],
        navigator = window['navigator'],
        jQueryInstance = window["jQuery"],
        JSON = window["JSON"];
(function(factory) {
    // Support three module loading scenarios
    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        // [1] CommonJS/Node.js
        var target = module['exports'] || exports; // module.exports is for Node.js
        factory(target, require);
    } else if (typeof define === 'function' && define['amd']) {
        // [2] AMD anonymous module
        define(['exports', 'require'], factory);
    } else {
        // [3] No module loader (plain <script> tag) - put directly in global namespace
        factory(window['ko'] = {});
    }
}(function(koExports, require){
// Internally, all KO objects are attached to koExports (even the non-exported ones whose names will be minified by the closure compiler).
// In the future, the following "ko" variable may be made distinct from "koExports" so that private objects are not externally reachable.
var ko = typeof koExports !== 'undefined' ? koExports : {};
// Google Closure Compiler helpers (used only to make the minified file smaller)
ko.exportSymbol = function(koPath, object) {
    var tokens = koPath.split(".");

    // In the future, "ko" may become distinct from "koExports" (so that non-exported objects are not reachable)
    // At that point, "target" would be set to: (typeof koExports !== "undefined" ? koExports : ko)
    var target = ko;

    for (var i = 0; i < tokens.length - 1; i++)
        target = target[tokens[i]];
    target[tokens[tokens.length - 1]] = object;
};
ko.exportProperty = function(owner, publicName, object) {
    owner[publicName] = object;
};
ko.version = "3.2.0";

ko.exportSymbol('version', ko.version);
ko.utils = (function () {
    function objectForEach(obj, action) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                action(prop, obj[prop]);
            }
        }
    }

    function extend(target, source) {
        if (source) {
            for(var prop in source) {
                if(source.hasOwnProperty(prop)) {
                    target[prop] = source[prop];
                }
            }
        }
        return target;
    }

    function setPrototypeOf(obj, proto) {
        obj.__proto__ = proto;
        return obj;
    }

    var canSetPrototype = ({ __proto__: [] } instanceof Array);

    // Represent the known event types in a compact way, then at runtime transform it into a hash with event name as key (for fast lookup)
    var knownEvents = {}, knownEventTypesByEventName = {};
    var keyEventTypeName = (navigator && /Firefox\/2/i.test(navigator.userAgent)) ? 'KeyboardEvent' : 'UIEvents';
    knownEvents[keyEventTypeName] = ['keyup', 'keydown', 'keypress'];
    knownEvents['MouseEvents'] = ['click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave'];
    objectForEach(knownEvents, function(eventType, knownEventsForType) {
        if (knownEventsForType.length) {
            for (var i = 0, j = knownEventsForType.length; i < j; i++)
                knownEventTypesByEventName[knownEventsForType[i]] = eventType;
        }
    });
    var eventsThatMustBeRegisteredUsingAttachEvent = { 'propertychange': true }; // Workaround for an IE9 issue - https://github.com/SteveSanderson/knockout/issues/406

    // Detect IE versions for bug workarounds (uses IE conditionals, not UA string, for robustness)
    // Note that, since IE 10 does not support conditional comments, the following logic only detects IE < 10.
    // Currently this is by design, since IE 10+ behaves correctly when treated as a standard browser.
    // If there is a future need to detect specific versions of IE10+, we will amend this.
    var ieVersion = document && (function() {
        var version = 3, div = document.createElement('div'), iElems = div.getElementsByTagName('i');

        // Keep constructing conditional HTML blocks until we hit one that resolves to an empty fragment
        while (
            div.innerHTML = '<!--[if gt IE ' + (++version) + ']><i></i><![endif]-->',
            iElems[0]
        ) {}
        return version > 4 ? version : undefined;
    }());
    var isIe6 = ieVersion === 6,
        isIe7 = ieVersion === 7;

    function isClickOnCheckableElement(element, eventType) {
        if ((ko.utils.tagNameLower(element) !== "input") || !element.type) return false;
        if (eventType.toLowerCase() != "click") return false;
        var inputType = element.type;
        return (inputType == "checkbox") || (inputType == "radio");
    }

    return {
        fieldsIncludedWithJsonPost: ['authenticity_token', /^__RequestVerificationToken(_.*)?$/],

        arrayForEach: function (array, action) {
            for (var i = 0, j = array.length; i < j; i++)
                action(array[i], i);
        },

        arrayIndexOf: function (array, item) {
            if (typeof Array.prototype.indexOf == "function")
                return Array.prototype.indexOf.call(array, item);
            for (var i = 0, j = array.length; i < j; i++)
                if (array[i] === item)
                    return i;
            return -1;
        },

        arrayFirst: function (array, predicate, predicateOwner) {
            for (var i = 0, j = array.length; i < j; i++)
                if (predicate.call(predicateOwner, array[i], i))
                    return array[i];
            return null;
        },

        arrayRemoveItem: function (array, itemToRemove) {
            var index = ko.utils.arrayIndexOf(array, itemToRemove);
            if (index > 0) {
                array.splice(index, 1);
            }
            else if (index === 0) {
                array.shift();
            }
        },

        arrayGetDistinctValues: function (array) {
            array = array || [];
            var result = [];
            for (var i = 0, j = array.length; i < j; i++) {
                if (ko.utils.arrayIndexOf(result, array[i]) < 0)
                    result.push(array[i]);
            }
            return result;
        },

        arrayMap: function (array, mapping) {
            array = array || [];
            var result = [];
            for (var i = 0, j = array.length; i < j; i++)
                result.push(mapping(array[i], i));
            return result;
        },

        arrayFilter: function (array, predicate) {
            array = array || [];
            var result = [];
            for (var i = 0, j = array.length; i < j; i++)
                if (predicate(array[i], i))
                    result.push(array[i]);
            return result;
        },

        arrayPushAll: function (array, valuesToPush) {
            if (valuesToPush instanceof Array)
                array.push.apply(array, valuesToPush);
            else
                for (var i = 0, j = valuesToPush.length; i < j; i++)
                    array.push(valuesToPush[i]);
            return array;
        },

        addOrRemoveItem: function(array, value, included) {
            var existingEntryIndex = ko.utils.arrayIndexOf(ko.utils.peekObservable(array), value);
            if (existingEntryIndex < 0) {
                if (included)
                    array.push(value);
            } else {
                if (!included)
                    array.splice(existingEntryIndex, 1);
            }
        },

        canSetPrototype: canSetPrototype,

        extend: extend,

        setPrototypeOf: setPrototypeOf,

        setPrototypeOfOrExtend: canSetPrototype ? setPrototypeOf : extend,

        objectForEach: objectForEach,

        objectMap: function(source, mapping) {
            if (!source)
                return source;
            var target = {};
            for (var prop in source) {
                if (source.hasOwnProperty(prop)) {
                    target[prop] = mapping(source[prop], prop, source);
                }
            }
            return target;
        },

        emptyDomNode: function (domNode) {
            while (domNode.firstChild) {
                ko.removeNode(domNode.firstChild);
            }
        },

        moveCleanedNodesToContainerElement: function(nodes) {
            // Ensure it's a real array, as we're about to reparent the nodes and
            // we don't want the underlying collection to change while we're doing that.
            var nodesArray = ko.utils.makeArray(nodes);

            var container = document.createElement('div');
            for (var i = 0, j = nodesArray.length; i < j; i++) {
                container.appendChild(ko.cleanNode(nodesArray[i]));
            }
            return container;
        },

        cloneNodes: function (nodesArray, shouldCleanNodes) {
            for (var i = 0, j = nodesArray.length, newNodesArray = []; i < j; i++) {
                var clonedNode = nodesArray[i].cloneNode(true);
                newNodesArray.push(shouldCleanNodes ? ko.cleanNode(clonedNode) : clonedNode);
            }
            return newNodesArray;
        },

        setDomNodeChildren: function (domNode, childNodes) {
            ko.utils.emptyDomNode(domNode);
            if (childNodes) {
                for (var i = 0, j = childNodes.length; i < j; i++)
                    domNode.appendChild(childNodes[i]);
            }
        },

        replaceDomNodes: function (nodeToReplaceOrNodeArray, newNodesArray) {
            var nodesToReplaceArray = nodeToReplaceOrNodeArray.nodeType ? [nodeToReplaceOrNodeArray] : nodeToReplaceOrNodeArray;
            if (nodesToReplaceArray.length > 0) {
                var insertionPoint = nodesToReplaceArray[0];
                var parent = insertionPoint.parentNode;
                for (var i = 0, j = newNodesArray.length; i < j; i++)
                    parent.insertBefore(newNodesArray[i], insertionPoint);
                for (var i = 0, j = nodesToReplaceArray.length; i < j; i++) {
                    ko.removeNode(nodesToReplaceArray[i]);
                }
            }
        },

        fixUpContinuousNodeArray: function(continuousNodeArray, parentNode) {
            // Before acting on a set of nodes that were previously outputted by a template function, we have to reconcile
            // them against what is in the DOM right now. It may be that some of the nodes have already been removed, or that
            // new nodes might have been inserted in the middle, for example by a binding. Also, there may previously have been
            // leading comment nodes (created by rewritten string-based templates) that have since been removed during binding.
            // So, this function translates the old "map" output array into its best guess of the set of current DOM nodes.
            //
            // Rules:
            //   [A] Any leading nodes that have been removed should be ignored
            //       These most likely correspond to memoization nodes that were already removed during binding
            //       See https://github.com/SteveSanderson/knockout/pull/440
            //   [B] We want to output a continuous series of nodes. So, ignore any nodes that have already been removed,
            //       and include any nodes that have been inserted among the previous collection

            if (continuousNodeArray.length) {
                // The parent node can be a virtual element; so get the real parent node
                parentNode = (parentNode.nodeType === 8 && parentNode.parentNode) || parentNode;

                // Rule [A]
                while (continuousNodeArray.length && continuousNodeArray[0].parentNode !== parentNode)
                    continuousNodeArray.shift();

                // Rule [B]
                if (continuousNodeArray.length > 1) {
                    var current = continuousNodeArray[0], last = continuousNodeArray[continuousNodeArray.length - 1];
                    // Replace with the actual new continuous node set
                    continuousNodeArray.length = 0;
                    while (current !== last) {
                        continuousNodeArray.push(current);
                        current = current.nextSibling;
                        if (!current) // Won't happen, except if the developer has manually removed some DOM elements (then we're in an undefined scenario)
                            return;
                    }
                    continuousNodeArray.push(last);
                }
            }
            return continuousNodeArray;
        },

        setOptionNodeSelectionState: function (optionNode, isSelected) {
            // IE6 sometimes throws "unknown error" if you try to write to .selected directly, whereas Firefox struggles with setAttribute. Pick one based on browser.
            if (ieVersion < 7)
                optionNode.setAttribute("selected", isSelected);
            else
                optionNode.selected = isSelected;
        },

        stringTrim: function (string) {
            return string === null || string === undefined ? '' :
                string.trim ?
                    string.trim() :
                    string.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g, '');
        },

        stringStartsWith: function (string, startsWith) {
            string = string || "";
            if (startsWith.length > string.length)
                return false;
            return string.substring(0, startsWith.length) === startsWith;
        },

        domNodeIsContainedBy: function (node, containedByNode) {
            if (node === containedByNode)
                return true;
            if (node.nodeType === 11)
                return false; // Fixes issue #1162 - can't use node.contains for document fragments on IE8
            if (containedByNode.contains)
                return containedByNode.contains(node.nodeType === 3 ? node.parentNode : node);
            if (containedByNode.compareDocumentPosition)
                return (containedByNode.compareDocumentPosition(node) & 16) == 16;
            while (node && node != containedByNode) {
                node = node.parentNode;
            }
            return !!node;
        },

        domNodeIsAttachedToDocument: function (node) {
            return ko.utils.domNodeIsContainedBy(node, node.ownerDocument.documentElement);
        },

        anyDomNodeIsAttachedToDocument: function(nodes) {
            return !!ko.utils.arrayFirst(nodes, ko.utils.domNodeIsAttachedToDocument);
        },

        tagNameLower: function(element) {
            // For HTML elements, tagName will always be upper case; for XHTML elements, it'll be lower case.
            // Possible future optimization: If we know it's an element from an XHTML document (not HTML),
            // we don't need to do the .toLowerCase() as it will always be lower case anyway.
            return element && element.tagName && element.tagName.toLowerCase();
        },

        registerEventHandler: function (element, eventType, handler) {
            var mustUseAttachEvent = ieVersion && eventsThatMustBeRegisteredUsingAttachEvent[eventType];
            if (!mustUseAttachEvent && jQueryInstance) {
                jQueryInstance(element)['bind'](eventType, handler);
            } else if (!mustUseAttachEvent && typeof element.addEventListener == "function")
                element.addEventListener(eventType, handler, false);
            else if (typeof element.attachEvent != "undefined") {
                var attachEventHandler = function (event) { handler.call(element, event); },
                    attachEventName = "on" + eventType;
                element.attachEvent(attachEventName, attachEventHandler);

                // IE does not dispose attachEvent handlers automatically (unlike with addEventListener)
                // so to avoid leaks, we have to remove them manually. See bug #856
                ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                    element.detachEvent(attachEventName, attachEventHandler);
                });
            } else
                throw new Error("Browser doesn't support addEventListener or attachEvent");
        },

        triggerEvent: function (element, eventType) {
            if (!(element && element.nodeType))
                throw new Error("element must be a DOM node when calling triggerEvent");

            // For click events on checkboxes and radio buttons, jQuery toggles the element checked state *after* the
            // event handler runs instead of *before*. (This was fixed in 1.9 for checkboxes but not for radio buttons.)
            // IE doesn't change the checked state when you trigger the click event using "fireEvent".
            // In both cases, we'll use the click method instead.
            var useClickWorkaround = isClickOnCheckableElement(element, eventType);

            if (jQueryInstance && !useClickWorkaround) {
                jQueryInstance(element)['trigger'](eventType);
            } else if (typeof document.createEvent == "function") {
                if (typeof element.dispatchEvent == "function") {
                    var eventCategory = knownEventTypesByEventName[eventType] || "HTMLEvents";
                    var event = document.createEvent(eventCategory);
                    event.initEvent(eventType, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, element);
                    element.dispatchEvent(event);
                }
                else
                    throw new Error("The supplied element doesn't support dispatchEvent");
            } else if (useClickWorkaround && element.click) {
                element.click();
            } else if (typeof element.fireEvent != "undefined") {
                element.fireEvent("on" + eventType);
            } else {
                throw new Error("Browser doesn't support triggering events");
            }
        },

        unwrapObservable: function (value) {
            return ko.isObservable(value) ? value() : value;
        },

        peekObservable: function (value) {
            return ko.isObservable(value) ? value.peek() : value;
        },

        toggleDomNodeCssClass: function (node, classNames, shouldHaveClass) {
            if (classNames) {
                var cssClassNameRegex = /\S+/g,
                    currentClassNames = node.className.match(cssClassNameRegex) || [];
                ko.utils.arrayForEach(classNames.match(cssClassNameRegex), function(className) {
                    ko.utils.addOrRemoveItem(currentClassNames, className, shouldHaveClass);
                });
                node.className = currentClassNames.join(" ");
            }
        },

        setTextContent: function(element, textContent) {
            var value = ko.utils.unwrapObservable(textContent);
            if ((value === null) || (value === undefined))
                value = "";

            // We need there to be exactly one child: a text node.
            // If there are no children, more than one, or if it's not a text node,
            // we'll clear everything and create a single text node.
            var innerTextNode = ko.virtualElements.firstChild(element);
            if (!innerTextNode || innerTextNode.nodeType != 3 || ko.virtualElements.nextSibling(innerTextNode)) {
                ko.virtualElements.setDomNodeChildren(element, [element.ownerDocument.createTextNode(value)]);
            } else {
                innerTextNode.data = value;
            }

            ko.utils.forceRefresh(element);
        },

        setElementName: function(element, name) {
            element.name = name;

            // Workaround IE 6/7 issue
            // - https://github.com/SteveSanderson/knockout/issues/197
            // - http://www.matts411.com/post/setting_the_name_attribute_in_ie_dom/
            if (ieVersion <= 7) {
                try {
                    element.mergeAttributes(document.createElement("<input name='" + element.name + "'/>"), false);
                }
                catch(e) {} // For IE9 with doc mode "IE9 Standards" and browser mode "IE9 Compatibility View"
            }
        },

        forceRefresh: function(node) {
            // Workaround for an IE9 rendering bug - https://github.com/SteveSanderson/knockout/issues/209
            if (ieVersion >= 9) {
                // For text nodes and comment nodes (most likely virtual elements), we will have to refresh the container
                var elem = node.nodeType == 1 ? node : node.parentNode;
                if (elem.style)
                    elem.style.zoom = elem.style.zoom;
            }
        },

        ensureSelectElementIsRenderedCorrectly: function(selectElement) {
            // Workaround for IE9 rendering bug - it doesn't reliably display all the text in dynamically-added select boxes unless you force it to re-render by updating the width.
            // (See https://github.com/SteveSanderson/knockout/issues/312, http://stackoverflow.com/questions/5908494/select-only-shows-first-char-of-selected-option)
            // Also fixes IE7 and IE8 bug that causes selects to be zero width if enclosed by 'if' or 'with'. (See issue #839)
            if (ieVersion) {
                var originalWidth = selectElement.style.width;
                selectElement.style.width = 0;
                selectElement.style.width = originalWidth;
            }
        },

        range: function (min, max) {
            min = ko.utils.unwrapObservable(min);
            max = ko.utils.unwrapObservable(max);
            var result = [];
            for (var i = min; i <= max; i++)
                result.push(i);
            return result;
        },

        makeArray: function(arrayLikeObject) {
            var result = [];
            for (var i = 0, j = arrayLikeObject.length; i < j; i++) {
                result.push(arrayLikeObject[i]);
            };
            return result;
        },

        isIe6 : isIe6,
        isIe7 : isIe7,
        ieVersion : ieVersion,

        getFormFields: function(form, fieldName) {
            var fields = ko.utils.makeArray(form.getElementsByTagName("input")).concat(ko.utils.makeArray(form.getElementsByTagName("textarea")));
            var isMatchingField = (typeof fieldName == 'string')
                ? function(field) { return field.name === fieldName }
                : function(field) { return fieldName.test(field.name) }; // Treat fieldName as regex or object containing predicate
            var matches = [];
            for (var i = fields.length - 1; i >= 0; i--) {
                if (isMatchingField(fields[i]))
                    matches.push(fields[i]);
            };
            return matches;
        },

        parseJson: function (jsonString) {
            if (typeof jsonString == "string") {
                jsonString = ko.utils.stringTrim(jsonString);
                if (jsonString) {
                    if (JSON && JSON.parse) // Use native parsing where available
                        return JSON.parse(jsonString);
                    return (new Function("return " + jsonString))(); // Fallback on less safe parsing for older browsers
                }
            }
            return null;
        },

        stringifyJson: function (data, replacer, space) {   // replacer and space are optional
            if (!JSON || !JSON.stringify)
                throw new Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");
            return JSON.stringify(ko.utils.unwrapObservable(data), replacer, space);
        },

        postJson: function (urlOrForm, data, options) {
            options = options || {};
            var params = options['params'] || {};
            var includeFields = options['includeFields'] || this.fieldsIncludedWithJsonPost;
            var url = urlOrForm;

            // If we were given a form, use its 'action' URL and pick out any requested field values
            if((typeof urlOrForm == 'object') && (ko.utils.tagNameLower(urlOrForm) === "form")) {
                var originalForm = urlOrForm;
                url = originalForm.action;
                for (var i = includeFields.length - 1; i >= 0; i--) {
                    var fields = ko.utils.getFormFields(originalForm, includeFields[i]);
                    for (var j = fields.length - 1; j >= 0; j--)
                        params[fields[j].name] = fields[j].value;
                }
            }

            data = ko.utils.unwrapObservable(data);
            var form = document.createElement("form");
            form.style.display = "none";
            form.action = url;
            form.method = "post";
            for (var key in data) {
                // Since 'data' this is a model object, we include all properties including those inherited from its prototype
                var input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = ko.utils.stringifyJson(ko.utils.unwrapObservable(data[key]));
                form.appendChild(input);
            }
            objectForEach(params, function(key, value) {
                var input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = value;
                form.appendChild(input);
            });
            document.body.appendChild(form);
            options['submitter'] ? options['submitter'](form) : form.submit();
            setTimeout(function () { form.parentNode.removeChild(form); }, 0);
        }
    }
}());

ko.exportSymbol('utils', ko.utils);
ko.exportSymbol('utils.arrayForEach', ko.utils.arrayForEach);
ko.exportSymbol('utils.arrayFirst', ko.utils.arrayFirst);
ko.exportSymbol('utils.arrayFilter', ko.utils.arrayFilter);
ko.exportSymbol('utils.arrayGetDistinctValues', ko.utils.arrayGetDistinctValues);
ko.exportSymbol('utils.arrayIndexOf', ko.utils.arrayIndexOf);
ko.exportSymbol('utils.arrayMap', ko.utils.arrayMap);
ko.exportSymbol('utils.arrayPushAll', ko.utils.arrayPushAll);
ko.exportSymbol('utils.arrayRemoveItem', ko.utils.arrayRemoveItem);
ko.exportSymbol('utils.extend', ko.utils.extend);
ko.exportSymbol('utils.fieldsIncludedWithJsonPost', ko.utils.fieldsIncludedWithJsonPost);
ko.exportSymbol('utils.getFormFields', ko.utils.getFormFields);
ko.exportSymbol('utils.peekObservable', ko.utils.peekObservable);
ko.exportSymbol('utils.postJson', ko.utils.postJson);
ko.exportSymbol('utils.parseJson', ko.utils.parseJson);
ko.exportSymbol('utils.registerEventHandler', ko.utils.registerEventHandler);
ko.exportSymbol('utils.stringifyJson', ko.utils.stringifyJson);
ko.exportSymbol('utils.range', ko.utils.range);
ko.exportSymbol('utils.toggleDomNodeCssClass', ko.utils.toggleDomNodeCssClass);
ko.exportSymbol('utils.triggerEvent', ko.utils.triggerEvent);
ko.exportSymbol('utils.unwrapObservable', ko.utils.unwrapObservable);
ko.exportSymbol('utils.objectForEach', ko.utils.objectForEach);
ko.exportSymbol('utils.addOrRemoveItem', ko.utils.addOrRemoveItem);
ko.exportSymbol('unwrap', ko.utils.unwrapObservable); // Convenient shorthand, because this is used so commonly

if (!Function.prototype['bind']) {
    // Function.prototype.bind is a standard part of ECMAScript 5th Edition (December 2009, http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf)
    // In case the browser doesn't implement it natively, provide a JavaScript implementation. This implementation is based on the one in prototype.js
    Function.prototype['bind'] = function (object) {
        var originalFunction = this, args = Array.prototype.slice.call(arguments), object = args.shift();
        return function () {
            return originalFunction.apply(object, args.concat(Array.prototype.slice.call(arguments)));
        };
    };
}

ko.utils.domData = new (function () {
    var uniqueId = 0;
    var dataStoreKeyExpandoPropertyName = "__ko__" + (new Date).getTime();
    var dataStore = {};

    function getAll(node, createIfNotFound) {
        var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
        var hasExistingDataStore = dataStoreKey && (dataStoreKey !== "null") && dataStore[dataStoreKey];
        if (!hasExistingDataStore) {
            if (!createIfNotFound)
                return undefined;
            dataStoreKey = node[dataStoreKeyExpandoPropertyName] = "ko" + uniqueId++;
            dataStore[dataStoreKey] = {};
        }
        return dataStore[dataStoreKey];
    }

    return {
        get: function (node, key) {
            var allDataForNode = getAll(node, false);
            return allDataForNode === undefined ? undefined : allDataForNode[key];
        },
        set: function (node, key, value) {
            if (value === undefined) {
                // Make sure we don't actually create a new domData key if we are actually deleting a value
                if (getAll(node, false) === undefined)
                    return;
            }
            var allDataForNode = getAll(node, true);
            allDataForNode[key] = value;
        },
        clear: function (node) {
            var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
            if (dataStoreKey) {
                delete dataStore[dataStoreKey];
                node[dataStoreKeyExpandoPropertyName] = null;
                return true; // Exposing "did clean" flag purely so specs can infer whether things have been cleaned up as intended
            }
            return false;
        },

        nextKey: function () {
            return (uniqueId++) + dataStoreKeyExpandoPropertyName;
        }
    };
})();

ko.exportSymbol('utils.domData', ko.utils.domData);
ko.exportSymbol('utils.domData.clear', ko.utils.domData.clear); // Exporting only so specs can clear up after themselves fully

ko.utils.domNodeDisposal = new (function () {
    var domDataKey = ko.utils.domData.nextKey();
    var cleanableNodeTypes = { 1: true, 8: true, 9: true };       // Element, Comment, Document
    var cleanableNodeTypesWithDescendants = { 1: true, 9: true }; // Element, Document

    function getDisposeCallbacksCollection(node, createIfNotFound) {
        var allDisposeCallbacks = ko.utils.domData.get(node, domDataKey);
        if ((allDisposeCallbacks === undefined) && createIfNotFound) {
            allDisposeCallbacks = [];
            ko.utils.domData.set(node, domDataKey, allDisposeCallbacks);
        }
        return allDisposeCallbacks;
    }
    function destroyCallbacksCollection(node) {
        ko.utils.domData.set(node, domDataKey, undefined);
    }

    function cleanSingleNode(node) {
        // Run all the dispose callbacks
        var callbacks = getDisposeCallbacksCollection(node, false);
        if (callbacks) {
            callbacks = callbacks.slice(0); // Clone, as the array may be modified during iteration (typically, callbacks will remove themselves)
            for (var i = 0; i < callbacks.length; i++)
                callbacks[i](node);
        }

        // Erase the DOM data
        ko.utils.domData.clear(node);

        // Perform cleanup needed by external libraries (currently only jQuery, but can be extended)
        ko.utils.domNodeDisposal["cleanExternalData"](node);

        // Clear any immediate-child comment nodes, as these wouldn't have been found by
        // node.getElementsByTagName("*") in cleanNode() (comment nodes aren't elements)
        if (cleanableNodeTypesWithDescendants[node.nodeType])
            cleanImmediateCommentTypeChildren(node);
    }

    function cleanImmediateCommentTypeChildren(nodeWithChildren) {
        var child, nextChild = nodeWithChildren.firstChild;
        while (child = nextChild) {
            nextChild = child.nextSibling;
            if (child.nodeType === 8)
                cleanSingleNode(child);
        }
    }

    return {
        addDisposeCallback : function(node, callback) {
            if (typeof callback != "function")
                throw new Error("Callback must be a function");
            getDisposeCallbacksCollection(node, true).push(callback);
        },

        removeDisposeCallback : function(node, callback) {
            var callbacksCollection = getDisposeCallbacksCollection(node, false);
            if (callbacksCollection) {
                ko.utils.arrayRemoveItem(callbacksCollection, callback);
                if (callbacksCollection.length == 0)
                    destroyCallbacksCollection(node);
            }
        },

        cleanNode : function(node) {
            // First clean this node, where applicable
            if (cleanableNodeTypes[node.nodeType]) {
                cleanSingleNode(node);

                // ... then its descendants, where applicable
                if (cleanableNodeTypesWithDescendants[node.nodeType]) {
                    // Clone the descendants list in case it changes during iteration
                    var descendants = [];
                    ko.utils.arrayPushAll(descendants, node.getElementsByTagName("*"));
                    for (var i = 0, j = descendants.length; i < j; i++)
                        cleanSingleNode(descendants[i]);
                }
            }
            return node;
        },

        removeNode : function(node) {
            ko.cleanNode(node);
            if (node.parentNode)
                node.parentNode.removeChild(node);
        },

        "cleanExternalData" : function (node) {
            // Special support for jQuery here because it's so commonly used.
            // Many jQuery plugins (including jquery.tmpl) store data using jQuery's equivalent of domData
            // so notify it to tear down any resources associated with the node & descendants here.
            if (jQueryInstance && (typeof jQueryInstance['cleanData'] == "function"))
                jQueryInstance['cleanData']([node]);
        }
    }
})();
ko.cleanNode = ko.utils.domNodeDisposal.cleanNode; // Shorthand name for convenience
ko.removeNode = ko.utils.domNodeDisposal.removeNode; // Shorthand name for convenience
ko.exportSymbol('cleanNode', ko.cleanNode);
ko.exportSymbol('removeNode', ko.removeNode);
ko.exportSymbol('utils.domNodeDisposal', ko.utils.domNodeDisposal);
ko.exportSymbol('utils.domNodeDisposal.addDisposeCallback', ko.utils.domNodeDisposal.addDisposeCallback);
ko.exportSymbol('utils.domNodeDisposal.removeDisposeCallback', ko.utils.domNodeDisposal.removeDisposeCallback);
(function () {
    var leadingCommentRegex = /^(\s*)<!--(.*?)-->/;

    function simpleHtmlParse(html) {
        // Based on jQuery's "clean" function, but only accounting for table-related elements.
        // If you have referenced jQuery, this won't be used anyway - KO will use jQuery's "clean" function directly

        // Note that there's still an issue in IE < 9 whereby it will discard comment nodes that are the first child of
        // a descendant node. For example: "<div><!-- mycomment -->abc</div>" will get parsed as "<div>abc</div>"
        // This won't affect anyone who has referenced jQuery, and there's always the workaround of inserting a dummy node
        // (possibly a text node) in front of the comment. So, KO does not attempt to workaround this IE issue automatically at present.

        // Trim whitespace, otherwise indexOf won't work as expected
        var tags = ko.utils.stringTrim(html).toLowerCase(), div = document.createElement("div");

        // Finds the first match from the left column, and returns the corresponding "wrap" data from the right column
        var wrap = tags.match(/^<(thead|tbody|tfoot)/)              && [1, "<table>", "</table>"] ||
                   !tags.indexOf("<tr")                             && [2, "<table><tbody>", "</tbody></table>"] ||
                   (!tags.indexOf("<td") || !tags.indexOf("<th"))   && [3, "<table><tbody><tr>", "</tr></tbody></table>"] ||
                   /* anything else */                                 [0, "", ""];

        // Go to html and back, then peel off extra wrappers
        // Note that we always prefix with some dummy text, because otherwise, IE<9 will strip out leading comment nodes in descendants. Total madness.
        var markup = "ignored<div>" + wrap[1] + html + wrap[2] + "</div>";
        if (typeof window['innerShiv'] == "function") {
            div.appendChild(window['innerShiv'](markup));
        } else {
            div.innerHTML = markup;
        }

        // Move to the right depth
        while (wrap[0]--)
            div = div.lastChild;

        return ko.utils.makeArray(div.lastChild.childNodes);
    }

    function jQueryHtmlParse(html) {
        // jQuery's "parseHTML" function was introduced in jQuery 1.8.0 and is a documented public API.
        if (jQueryInstance['parseHTML']) {
            return jQueryInstance['parseHTML'](html) || []; // Ensure we always return an array and never null
        } else {
            // For jQuery < 1.8.0, we fall back on the undocumented internal "clean" function.
            var elems = jQueryInstance['clean']([html]);

            // As of jQuery 1.7.1, jQuery parses the HTML by appending it to some dummy parent nodes held in an in-memory document fragment.
            // Unfortunately, it never clears the dummy parent nodes from the document fragment, so it leaks memory over time.
            // Fix this by finding the top-most dummy parent element, and detaching it from its owner fragment.
            if (elems && elems[0]) {
                // Find the top-most parent element that's a direct child of a document fragment
                var elem = elems[0];
                while (elem.parentNode && elem.parentNode.nodeType !== 11 /* i.e., DocumentFragment */)
                    elem = elem.parentNode;
                // ... then detach it
                if (elem.parentNode)
                    elem.parentNode.removeChild(elem);
            }

            return elems;
        }
    }

    ko.utils.parseHtmlFragment = function(html) {
        return jQueryInstance ? jQueryHtmlParse(html)   // As below, benefit from jQuery's optimisations where possible
                              : simpleHtmlParse(html);  // ... otherwise, this simple logic will do in most common cases.
    };

    ko.utils.setHtml = function(node, html) {
        ko.utils.emptyDomNode(node);

        // There's no legitimate reason to display a stringified observable without unwrapping it, so we'll unwrap it
        html = ko.utils.unwrapObservable(html);

        if ((html !== null) && (html !== undefined)) {
            if (typeof html != 'string')
                html = html.toString();

            // jQuery contains a lot of sophisticated code to parse arbitrary HTML fragments,
            // for example <tr> elements which are not normally allowed to exist on their own.
            // If you've referenced jQuery we'll use that rather than duplicating its code.
            if (jQueryInstance) {
                jQueryInstance(node)['html'](html);
            } else {
                // ... otherwise, use KO's own parsing logic.
                var parsedNodes = ko.utils.parseHtmlFragment(html);
                for (var i = 0; i < parsedNodes.length; i++)
                    node.appendChild(parsedNodes[i]);
            }
        }
    };
})();

ko.exportSymbol('utils.parseHtmlFragment', ko.utils.parseHtmlFragment);
ko.exportSymbol('utils.setHtml', ko.utils.setHtml);

ko.memoization = (function () {
    var memos = {};

    function randomMax8HexChars() {
        return (((1 + Math.random()) * 0x100000000) | 0).toString(16).substring(1);
    }
    function generateRandomId() {
        return randomMax8HexChars() + randomMax8HexChars();
    }
    function findMemoNodes(rootNode, appendToArray) {
        if (!rootNode)
            return;
        if (rootNode.nodeType == 8) {
            var memoId = ko.memoization.parseMemoText(rootNode.nodeValue);
            if (memoId != null)
                appendToArray.push({ domNode: rootNode, memoId: memoId });
        } else if (rootNode.nodeType == 1) {
            for (var i = 0, childNodes = rootNode.childNodes, j = childNodes.length; i < j; i++)
                findMemoNodes(childNodes[i], appendToArray);
        }
    }

    return {
        memoize: function (callback) {
            if (typeof callback != "function")
                throw new Error("You can only pass a function to ko.memoization.memoize()");
            var memoId = generateRandomId();
            memos[memoId] = callback;
            return "<!--[ko_memo:" + memoId + "]-->";
        },

        unmemoize: function (memoId, callbackParams) {
            var callback = memos[memoId];
            if (callback === undefined)
                throw new Error("Couldn't find any memo with ID " + memoId + ". Perhaps it's already been unmemoized.");
            try {
                callback.apply(null, callbackParams || []);
                return true;
            }
            finally { delete memos[memoId]; }
        },

        unmemoizeDomNodeAndDescendants: function (domNode, extraCallbackParamsArray) {
            var memos = [];
            findMemoNodes(domNode, memos);
            for (var i = 0, j = memos.length; i < j; i++) {
                var node = memos[i].domNode;
                var combinedParams = [node];
                if (extraCallbackParamsArray)
                    ko.utils.arrayPushAll(combinedParams, extraCallbackParamsArray);
                ko.memoization.unmemoize(memos[i].memoId, combinedParams);
                node.nodeValue = ""; // Neuter this node so we don't try to unmemoize it again
                if (node.parentNode)
                    node.parentNode.removeChild(node); // If possible, erase it totally (not always possible - someone else might just hold a reference to it then call unmemoizeDomNodeAndDescendants again)
            }
        },

        parseMemoText: function (memoText) {
            var match = memoText.match(/^\[ko_memo\:(.*?)\]$/);
            return match ? match[1] : null;
        }
    };
})();

ko.exportSymbol('memoization', ko.memoization);
ko.exportSymbol('memoization.memoize', ko.memoization.memoize);
ko.exportSymbol('memoization.unmemoize', ko.memoization.unmemoize);
ko.exportSymbol('memoization.parseMemoText', ko.memoization.parseMemoText);
ko.exportSymbol('memoization.unmemoizeDomNodeAndDescendants', ko.memoization.unmemoizeDomNodeAndDescendants);
ko.extenders = {
    'throttle': function(target, timeout) {
        // Throttling means two things:

        // (1) For dependent observables, we throttle *evaluations* so that, no matter how fast its dependencies
        //     notify updates, the target doesn't re-evaluate (and hence doesn't notify) faster than a certain rate
        target['throttleEvaluation'] = timeout;

        // (2) For writable targets (observables, or writable dependent observables), we throttle *writes*
        //     so the target cannot change value synchronously or faster than a certain rate
        var writeTimeoutInstance = null;
        return ko.dependentObservable({
            'read': target,
            'write': function(value) {
                clearTimeout(writeTimeoutInstance);
                writeTimeoutInstance = setTimeout(function() {
                    target(value);
                }, timeout);
            }
        });
    },

    'rateLimit': function(target, options) {
        var timeout, method, limitFunction;

        if (typeof options == 'number') {
            timeout = options;
        } else {
            timeout = options['timeout'];
            method = options['method'];
        }

        limitFunction = method == 'notifyWhenChangesStop' ?  debounce : throttle;
        target.limit(function(callback) {
            return limitFunction(callback, timeout);
        });
    },

    'notify': function(target, notifyWhen) {
        target["equalityComparer"] = notifyWhen == "always" ?
            null :  // null equalityComparer means to always notify
            valuesArePrimitiveAndEqual;
    }
};

var primitiveTypes = { 'undefined':1, 'boolean':1, 'number':1, 'string':1 };
function valuesArePrimitiveAndEqual(a, b) {
    var oldValueIsPrimitive = (a === null) || (typeof(a) in primitiveTypes);
    return oldValueIsPrimitive ? (a === b) : false;
}

function throttle(callback, timeout) {
    var timeoutInstance;
    return function () {
        if (!timeoutInstance) {
            timeoutInstance = setTimeout(function() {
                timeoutInstance = undefined;
                callback();
            }, timeout);
        }
    };
}

function debounce(callback, timeout) {
    var timeoutInstance;
    return function () {
        clearTimeout(timeoutInstance);
        timeoutInstance = setTimeout(callback, timeout);
    };
}

function applyExtenders(requestedExtenders) {
    var target = this;
    if (requestedExtenders) {
        ko.utils.objectForEach(requestedExtenders, function(key, value) {
            var extenderHandler = ko.extenders[key];
            if (typeof extenderHandler == 'function') {
                target = extenderHandler(target, value) || target;
            }
        });
    }
    return target;
}

ko.exportSymbol('extenders', ko.extenders);

ko.subscription = function (target, callback, disposeCallback) {
    this.target = target;
    this.callback = callback;
    this.disposeCallback = disposeCallback;
    this.isDisposed = false;
    ko.exportProperty(this, 'dispose', this.dispose);
};
ko.subscription.prototype.dispose = function () {
    this.isDisposed = true;
    this.disposeCallback();
};

ko.subscribable = function () {
    ko.utils.setPrototypeOfOrExtend(this, ko.subscribable['fn']);
    this._subscriptions = {};
}

var defaultEvent = "change";

var ko_subscribable_fn = {
    subscribe: function (callback, callbackTarget, event) {
        var self = this;

        event = event || defaultEvent;
        var boundCallback = callbackTarget ? callback.bind(callbackTarget) : callback;

        var subscription = new ko.subscription(self, boundCallback, function () {
            ko.utils.arrayRemoveItem(self._subscriptions[event], subscription);
            if (self.afterSubscriptionRemove)
                self.afterSubscriptionRemove(event);
        });

        if (self.beforeSubscriptionAdd)
            self.beforeSubscriptionAdd(event);

        if (!self._subscriptions[event])
            self._subscriptions[event] = [];
        self._subscriptions[event].push(subscription);

        return subscription;
    },

    "notifySubscribers": function (valueToNotify, event) {
        event = event || defaultEvent;
        if (this.hasSubscriptionsForEvent(event)) {
            try {
                ko.dependencyDetection.begin(); // Begin suppressing dependency detection (by setting the top frame to undefined)
                for (var a = this._subscriptions[event].slice(0), i = 0, subscription; subscription = a[i]; ++i) {
                    // In case a subscription was disposed during the arrayForEach cycle, check
                    // for isDisposed on each subscription before invoking its callback
                    if (!subscription.isDisposed)
                        subscription.callback(valueToNotify);
                }
            } finally {
                ko.dependencyDetection.end(); // End suppressing dependency detection
            }
        }
    },

    limit: function(limitFunction) {
        var self = this, selfIsObservable = ko.isObservable(self),
            isPending, previousValue, pendingValue, beforeChange = 'beforeChange';

        if (!self._origNotifySubscribers) {
            self._origNotifySubscribers = self["notifySubscribers"];
            self["notifySubscribers"] = function(value, event) {
                if (!event || event === defaultEvent) {
                    self._rateLimitedChange(value);
                } else if (event === beforeChange) {
                    self._rateLimitedBeforeChange(value);
                } else {
                    self._origNotifySubscribers(value, event);
                }
            };
        }

        var finish = limitFunction(function() {
            // If an observable provided a reference to itself, access it to get the latest value.
            // This allows computed observables to delay calculating their value until needed.
            if (selfIsObservable && pendingValue === self) {
                pendingValue = self();
            }
            isPending = false;
            if (self.isDifferent(previousValue, pendingValue)) {
                self._origNotifySubscribers(previousValue = pendingValue);
            }
        });

        self._rateLimitedChange = function(value) {
            isPending = true;
            pendingValue = value;
            finish();
        };
        self._rateLimitedBeforeChange = function(value) {
            if (!isPending) {
                previousValue = value;
                self._origNotifySubscribers(value, beforeChange);
            }
        };
    },

    hasSubscriptionsForEvent: function(event) {
        return this._subscriptions[event] && this._subscriptions[event].length;
    },

    getSubscriptionsCount: function () {
        var total = 0;
        ko.utils.objectForEach(this._subscriptions, function(eventName, subscriptions) {
            total += subscriptions.length;
        });
        return total;
    },

    isDifferent: function(oldValue, newValue) {
        return !this['equalityComparer'] || !this['equalityComparer'](oldValue, newValue);
    },

    extend: applyExtenders
};

ko.exportProperty(ko_subscribable_fn, 'subscribe', ko_subscribable_fn.subscribe);
ko.exportProperty(ko_subscribable_fn, 'extend', ko_subscribable_fn.extend);
ko.exportProperty(ko_subscribable_fn, 'getSubscriptionsCount', ko_subscribable_fn.getSubscriptionsCount);

// For browsers that support proto assignment, we overwrite the prototype of each
// observable instance. Since observables are functions, we need Function.prototype
// to still be in the prototype chain.
if (ko.utils.canSetPrototype) {
    ko.utils.setPrototypeOf(ko_subscribable_fn, Function.prototype);
}

ko.subscribable['fn'] = ko_subscribable_fn;


ko.isSubscribable = function (instance) {
    return instance != null && typeof instance.subscribe == "function" && typeof instance["notifySubscribers"] == "function";
};

ko.exportSymbol('subscribable', ko.subscribable);
ko.exportSymbol('isSubscribable', ko.isSubscribable);

ko.computedContext = ko.dependencyDetection = (function () {
    var outerFrames = [],
        currentFrame,
        lastId = 0;

    // Return a unique ID that can be assigned to an observable for dependency tracking.
    // Theoretically, you could eventually overflow the number storage size, resulting
    // in duplicate IDs. But in JavaScript, the largest exact integral value is 2^53
    // or 9,007,199,254,740,992. If you created 1,000,000 IDs per second, it would
    // take over 285 years to reach that number.
    // Reference http://blog.vjeux.com/2010/javascript/javascript-max_int-number-limits.html
    function getId() {
        return ++lastId;
    }

    function begin(options) {
        outerFrames.push(currentFrame);
        currentFrame = options;
    }

    function end() {
        currentFrame = outerFrames.pop();
    }

    return {
        begin: begin,

        end: end,

        registerDependency: function (subscribable) {
            if (currentFrame) {
                if (!ko.isSubscribable(subscribable))
                    throw new Error("Only subscribable things can act as dependencies");
                currentFrame.callback(subscribable, subscribable._id || (subscribable._id = getId()));
            }
        },

        ignore: function (callback, callbackTarget, callbackArgs) {
            try {
                begin();
                return callback.apply(callbackTarget, callbackArgs || []);
            } finally {
                end();
            }
        },

        getDependenciesCount: function () {
            if (currentFrame)
                return currentFrame.computed.getDependenciesCount();
        },

        isInitial: function() {
            if (currentFrame)
                return currentFrame.isInitial;
        }
    };
})();

ko.exportSymbol('computedContext', ko.computedContext);
ko.exportSymbol('computedContext.getDependenciesCount', ko.computedContext.getDependenciesCount);
ko.exportSymbol('computedContext.isInitial', ko.computedContext.isInitial);
ko.exportSymbol('computedContext.isSleeping', ko.computedContext.isSleeping);
ko.observable = function (initialValue) {
    var _latestValue = initialValue;

    function observable() {
        if (arguments.length > 0) {
            // Write

            // Ignore writes if the value hasn't changed
            if (observable.isDifferent(_latestValue, arguments[0])) {
                observable.valueWillMutate();
                _latestValue = arguments[0];
                if (DEBUG) observable._latestValue = _latestValue;
                observable.valueHasMutated();
            }
            return this; // Permits chained assignments
        }
        else {
            // Read
            ko.dependencyDetection.registerDependency(observable); // The caller only needs to be notified of changes if they did a "read" operation
            return _latestValue;
        }
    }
    ko.subscribable.call(observable);
    ko.utils.setPrototypeOfOrExtend(observable, ko.observable['fn']);

    if (DEBUG) observable._latestValue = _latestValue;
    observable.peek = function() { return _latestValue };
    observable.valueHasMutated = function () { observable["notifySubscribers"](_latestValue); }
    observable.valueWillMutate = function () { observable["notifySubscribers"](_latestValue, "beforeChange"); }

    ko.exportProperty(observable, 'peek', observable.peek);
    ko.exportProperty(observable, "valueHasMutated", observable.valueHasMutated);
    ko.exportProperty(observable, "valueWillMutate", observable.valueWillMutate);

    return observable;
}

ko.observable['fn'] = {
    "equalityComparer": valuesArePrimitiveAndEqual
};

var protoProperty = ko.observable.protoProperty = "__ko_proto__";
ko.observable['fn'][protoProperty] = ko.observable;

// Note that for browsers that don't support proto assignment, the
// inheritance chain is created manually in the ko.observable constructor
if (ko.utils.canSetPrototype) {
    ko.utils.setPrototypeOf(ko.observable['fn'], ko.subscribable['fn']);
}

ko.hasPrototype = function(instance, prototype) {
    if ((instance === null) || (instance === undefined) || (instance[protoProperty] === undefined)) return false;
    if (instance[protoProperty] === prototype) return true;
    return ko.hasPrototype(instance[protoProperty], prototype); // Walk the prototype chain
};

ko.isObservable = function (instance) {
    return ko.hasPrototype(instance, ko.observable);
}
ko.isWriteableObservable = function (instance) {
    // Observable
    if ((typeof instance == "function") && instance[protoProperty] === ko.observable)
        return true;
    // Writeable dependent observable
    if ((typeof instance == "function") && (instance[protoProperty] === ko.dependentObservable) && (instance.hasWriteFunction))
        return true;
    // Anything else
    return false;
}


ko.exportSymbol('observable', ko.observable);
ko.exportSymbol('isObservable', ko.isObservable);
ko.exportSymbol('isWriteableObservable', ko.isWriteableObservable);
ko.exportSymbol('isWritableObservable', ko.isWriteableObservable);
ko.observableArray = function (initialValues) {
    initialValues = initialValues || [];

    if (typeof initialValues != 'object' || !('length' in initialValues))
        throw new Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");

    var result = ko.observable(initialValues);
    ko.utils.setPrototypeOfOrExtend(result, ko.observableArray['fn']);
    return result.extend({'trackArrayChanges':true});
};

ko.observableArray['fn'] = {
    'remove': function (valueOrPredicate) {
        var underlyingArray = this.peek();
        var removedValues = [];
        var predicate = typeof valueOrPredicate == "function" && !ko.isObservable(valueOrPredicate) ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
        for (var i = 0; i < underlyingArray.length; i++) {
            var value = underlyingArray[i];
            if (predicate(value)) {
                if (removedValues.length === 0) {
                    this.valueWillMutate();
                }
                removedValues.push(value);
                underlyingArray.splice(i, 1);
                i--;
            }
        }
        if (removedValues.length) {
            this.valueHasMutated();
        }
        return removedValues;
    },

    'removeAll': function (arrayOfValues) {
        // If you passed zero args, we remove everything
        if (arrayOfValues === undefined) {
            var underlyingArray = this.peek();
            var allValues = underlyingArray.slice(0);
            this.valueWillMutate();
            underlyingArray.splice(0, underlyingArray.length);
            this.valueHasMutated();
            return allValues;
        }
        // If you passed an arg, we interpret it as an array of entries to remove
        if (!arrayOfValues)
            return [];
        return this['remove'](function (value) {
            return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
        });
    },

    'destroy': function (valueOrPredicate) {
        var underlyingArray = this.peek();
        var predicate = typeof valueOrPredicate == "function" && !ko.isObservable(valueOrPredicate) ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
        this.valueWillMutate();
        for (var i = underlyingArray.length - 1; i >= 0; i--) {
            var value = underlyingArray[i];
            if (predicate(value))
                underlyingArray[i]["_destroy"] = true;
        }
        this.valueHasMutated();
    },

    'destroyAll': function (arrayOfValues) {
        // If you passed zero args, we destroy everything
        if (arrayOfValues === undefined)
            return this['destroy'](function() { return true });

        // If you passed an arg, we interpret it as an array of entries to destroy
        if (!arrayOfValues)
            return [];
        return this['destroy'](function (value) {
            return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
        });
    },

    'indexOf': function (item) {
        var underlyingArray = this();
        return ko.utils.arrayIndexOf(underlyingArray, item);
    },

    'replace': function(oldItem, newItem) {
        var index = this['indexOf'](oldItem);
        if (index >= 0) {
            this.valueWillMutate();
            this.peek()[index] = newItem;
            this.valueHasMutated();
        }
    }
};

// Populate ko.observableArray.fn with read/write functions from native arrays
// Important: Do not add any additional functions here that may reasonably be used to *read* data from the array
// because we'll eval them without causing subscriptions, so ko.computed output could end up getting stale
ko.utils.arrayForEach(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (methodName) {
    ko.observableArray['fn'][methodName] = function () {
        // Use "peek" to avoid creating a subscription in any computed that we're executing in the context of
        // (for consistency with mutating regular observables)
        var underlyingArray = this.peek();
        this.valueWillMutate();
        this.cacheDiffForKnownOperation(underlyingArray, methodName, arguments);
        var methodCallResult = underlyingArray[methodName].apply(underlyingArray, arguments);
        this.valueHasMutated();
        return methodCallResult;
    };
});

// Populate ko.observableArray.fn with read-only functions from native arrays
ko.utils.arrayForEach(["slice"], function (methodName) {
    ko.observableArray['fn'][methodName] = function () {
        var underlyingArray = this();
        return underlyingArray[methodName].apply(underlyingArray, arguments);
    };
});

// Note that for browsers that don't support proto assignment, the
// inheritance chain is created manually in the ko.observableArray constructor
if (ko.utils.canSetPrototype) {
    ko.utils.setPrototypeOf(ko.observableArray['fn'], ko.observable['fn']);
}

ko.exportSymbol('observableArray', ko.observableArray);
var arrayChangeEventName = 'arrayChange';
ko.extenders['trackArrayChanges'] = function(target) {
    // Only modify the target observable once
    if (target.cacheDiffForKnownOperation) {
        return;
    }
    var trackingChanges = false,
        cachedDiff = null,
        pendingNotifications = 0,
        underlyingSubscribeFunction = target.subscribe;

    // Intercept "subscribe" calls, and for array change events, ensure change tracking is enabled
    target.subscribe = target['subscribe'] = function(callback, callbackTarget, event) {
        if (event === arrayChangeEventName) {
            trackChanges();
        }
        return underlyingSubscribeFunction.apply(this, arguments);
    };

    function trackChanges() {
        // Calling 'trackChanges' multiple times is the same as calling it once
        if (trackingChanges) {
            return;
        }

        trackingChanges = true;

        // Intercept "notifySubscribers" to track how many times it was called.
        var underlyingNotifySubscribersFunction = target['notifySubscribers'];
        target['notifySubscribers'] = function(valueToNotify, event) {
            if (!event || event === defaultEvent) {
                ++pendingNotifications;
            }
            return underlyingNotifySubscribersFunction.apply(this, arguments);
        };

        // Each time the array changes value, capture a clone so that on the next
        // change it's possible to produce a diff
        var previousContents = [].concat(target.peek() || []);
        cachedDiff = null;
        target.subscribe(function(currentContents) {
            // Make a copy of the current contents and ensure it's an array
            currentContents = [].concat(currentContents || []);

            // Compute the diff and issue notifications, but only if someone is listening
            if (target.hasSubscriptionsForEvent(arrayChangeEventName)) {
                var changes = getChanges(previousContents, currentContents);
                if (changes.length) {
                    target['notifySubscribers'](changes, arrayChangeEventName);
                }
            }

            // Eliminate references to the old, removed items, so they can be GCed
            previousContents = currentContents;
            cachedDiff = null;
            pendingNotifications = 0;
        });
    }

    function getChanges(previousContents, currentContents) {
        // We try to re-use cached diffs.
        // The scenarios where pendingNotifications > 1 are when using rate-limiting or the Deferred Updates
        // plugin, which without this check would not be compatible with arrayChange notifications. Normally,
        // notifications are issued immediately so we wouldn't be queueing up more than one.
        if (!cachedDiff || pendingNotifications > 1) {
            cachedDiff = ko.utils.compareArrays(previousContents, currentContents, { 'sparse': true });
        }

        return cachedDiff;
    }

    target.cacheDiffForKnownOperation = function(rawArray, operationName, args) {
        // Only run if we're currently tracking changes for this observable array
        // and there aren't any pending deferred notifications.
        if (!trackingChanges || pendingNotifications) {
            return;
        }
        var diff = [],
            arrayLength = rawArray.length,
            argsLength = args.length,
            offset = 0;

        function pushDiff(status, value, index) {
            return diff[diff.length] = { 'status': status, 'value': value, 'index': index };
        }
        switch (operationName) {
            case 'push':
                offset = arrayLength;
            case 'unshift':
                for (var index = 0; index < argsLength; index++) {
                    pushDiff('added', args[index], offset + index);
                }
                break;

            case 'pop':
                offset = arrayLength - 1;
            case 'shift':
                if (arrayLength) {
                    pushDiff('deleted', rawArray[offset], offset);
                }
                break;

            case 'splice':
                // Negative start index means 'from end of array'. After that we clamp to [0...arrayLength].
                // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
                var startIndex = Math.min(Math.max(0, args[0] < 0 ? arrayLength + args[0] : args[0]), arrayLength),
                    endDeleteIndex = argsLength === 1 ? arrayLength : Math.min(startIndex + (args[1] || 0), arrayLength),
                    endAddIndex = startIndex + argsLength - 2,
                    endIndex = Math.max(endDeleteIndex, endAddIndex),
                    additions = [], deletions = [];
                for (var index = startIndex, argsIndex = 2; index < endIndex; ++index, ++argsIndex) {
                    if (index < endDeleteIndex)
                        deletions.push(pushDiff('deleted', rawArray[index], index));
                    if (index < endAddIndex)
                        additions.push(pushDiff('added', args[argsIndex], index));
                }
                ko.utils.findMovesInArrayComparison(deletions, additions);
                break;

            default:
                return;
        }
        cachedDiff = diff;
    };
};
ko.computed = ko.dependentObservable = function (evaluatorFunctionOrOptions, evaluatorFunctionTarget, options) {
    var _latestValue,
        _needsEvaluation = true,
        _isBeingEvaluated = false,
        _suppressDisposalUntilDisposeWhenReturnsFalse = false,
        _isDisposed = false,
        readFunction = evaluatorFunctionOrOptions,
        pure = false,
        isSleeping = false;

    if (readFunction && typeof readFunction == "object") {
        // Single-parameter syntax - everything is on this "options" param
        options = readFunction;
        readFunction = options["read"];
    } else {
        // Multi-parameter syntax - construct the options according to the params passed
        options = options || {};
        if (!readFunction)
            readFunction = options["read"];
    }
    if (typeof readFunction != "function")
        throw new Error("Pass a function that returns the value of the ko.computed");

    function addSubscriptionToDependency(subscribable, id) {
        if (!_subscriptionsToDependencies[id]) {
            _subscriptionsToDependencies[id] = subscribable.subscribe(evaluatePossiblyAsync);
            ++_dependenciesCount;
        }
    }

    function disposeAllSubscriptionsToDependencies() {
        ko.utils.objectForEach(_subscriptionsToDependencies, function (id, subscription) {
            subscription.dispose();
        });
        _subscriptionsToDependencies = {};
    }

    function disposeComputed() {
        disposeAllSubscriptionsToDependencies();
        _dependenciesCount = 0;
        _isDisposed = true;
        _needsEvaluation = false;
    }

    function evaluatePossiblyAsync() {
        var throttleEvaluationTimeout = dependentObservable['throttleEvaluation'];
        if (throttleEvaluationTimeout && throttleEvaluationTimeout >= 0) {
            clearTimeout(evaluationTimeoutInstance);
            evaluationTimeoutInstance = setTimeout(evaluateImmediate, throttleEvaluationTimeout);
        } else if (dependentObservable._evalRateLimited) {
            dependentObservable._evalRateLimited();
        } else {
            evaluateImmediate();
        }
    }

    function evaluateImmediate(suppressChangeNotification) {
        if (_isBeingEvaluated) {
            if (pure) {
                throw Error("A 'pure' computed must not be called recursively");
            }
            // If the evaluation of a ko.computed causes side effects, it's possible that it will trigger its own re-evaluation.
            // This is not desirable (it's hard for a developer to realise a chain of dependencies might cause this, and they almost
            // certainly didn't intend infinite re-evaluations). So, for predictability, we simply prevent ko.computeds from causing
            // their own re-evaluation. Further discussion at https://github.com/SteveSanderson/knockout/pull/387
            return;
        }

        // Do not evaluate (and possibly capture new dependencies) if disposed
        if (_isDisposed) {
            return;
        }

        if (disposeWhen && disposeWhen()) {
            // See comment below about _suppressDisposalUntilDisposeWhenReturnsFalse
            if (!_suppressDisposalUntilDisposeWhenReturnsFalse) {
                dispose();
                return;
            }
        } else {
            // It just did return false, so we can stop suppressing now
            _suppressDisposalUntilDisposeWhenReturnsFalse = false;
        }

        _isBeingEvaluated = true;

        // When sleeping, recalculate the value and return.
        if (isSleeping) {
            try {
                var dependencyTracking = {};
                ko.dependencyDetection.begin({
                    callback: function (subscribable, id) {
                        if (!dependencyTracking[id]) {
                            dependencyTracking[id] = 1;
                            ++_dependenciesCount;
                        }
                    },
                    computed: dependentObservable,
                    isInitial: undefined
                });
                _dependenciesCount = 0;
                _latestValue = readFunction.call(evaluatorFunctionTarget);
            } finally {
                ko.dependencyDetection.end();
                _isBeingEvaluated = false;
            }
        } else {
            try {
                // Initially, we assume that none of the subscriptions are still being used (i.e., all are candidates for disposal).
                // Then, during evaluation, we cross off any that are in fact still being used.
                var disposalCandidates = _subscriptionsToDependencies, disposalCount = _dependenciesCount;
                ko.dependencyDetection.begin({
                    callback: function(subscribable, id) {
                        if (!_isDisposed) {
                            if (disposalCount && disposalCandidates[id]) {
                                // Don't want to dispose this subscription, as it's still being used
                                _subscriptionsToDependencies[id] = disposalCandidates[id];
                                ++_dependenciesCount;
                                delete disposalCandidates[id];
                                --disposalCount;
                            } else {
                                // Brand new subscription - add it
                                addSubscriptionToDependency(subscribable, id);
                            }
                        }
                    },
                    computed: dependentObservable,
                    isInitial: pure ? undefined : !_dependenciesCount        // If we're evaluating when there are no previous dependencies, it must be the first time
                });

                _subscriptionsToDependencies = {};
                _dependenciesCount = 0;

                try {
                    var newValue = evaluatorFunctionTarget ? readFunction.call(evaluatorFunctionTarget) : readFunction();

                } finally {
                    ko.dependencyDetection.end();

                    // For each subscription no longer being used, remove it from the active subscriptions list and dispose it
                    if (disposalCount) {
                        ko.utils.objectForEach(disposalCandidates, function(id, toDispose) {
                            toDispose.dispose();
                        });
                    }

                    _needsEvaluation = false;
                }

                if (dependentObservable.isDifferent(_latestValue, newValue)) {
                    dependentObservable["notifySubscribers"](_latestValue, "beforeChange");

                    _latestValue = newValue;
                    if (DEBUG) dependentObservable._latestValue = _latestValue;

                    if (suppressChangeNotification !== true) {  // Check for strict true value since setTimeout in Firefox passes a numeric value to the function
                        dependentObservable["notifySubscribers"](_latestValue);
                    }
                }
            } finally {
                _isBeingEvaluated = false;
            }
        }

        if (!_dependenciesCount)
            dispose();
    }

    function dependentObservable() {
        if (arguments.length > 0) {
            if (typeof writeFunction === "function") {
                // Writing a value
                writeFunction.apply(evaluatorFunctionTarget, arguments);
            } else {
                throw new Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
            }
            return this; // Permits chained assignments
        } else {
            // Reading the value
            ko.dependencyDetection.registerDependency(dependentObservable);
            if (_needsEvaluation)
                evaluateImmediate(true /* suppressChangeNotification */);
            return _latestValue;
        }
    }

    function peek() {
        // Peek won't re-evaluate, except to get the initial value when "deferEvaluation" is set, or while the computed is sleeping.
        // Those are the only times that both of these conditions will be satisfied.
        if (_needsEvaluation && !_dependenciesCount)
            evaluateImmediate(true /* suppressChangeNotification */);
        return _latestValue;
    }

    function isActive() {
        return _needsEvaluation || _dependenciesCount > 0;
    }

    // By here, "options" is always non-null
    var writeFunction = options["write"],
        disposeWhenNodeIsRemoved = options["disposeWhenNodeIsRemoved"] || options.disposeWhenNodeIsRemoved || null,
        disposeWhenOption = options["disposeWhen"] || options.disposeWhen,
        disposeWhen = disposeWhenOption,
        dispose = disposeComputed,
        _subscriptionsToDependencies = {},
        _dependenciesCount = 0,
        evaluationTimeoutInstance = null;

    if (!evaluatorFunctionTarget)
        evaluatorFunctionTarget = options["owner"];

    ko.subscribable.call(dependentObservable);
    ko.utils.setPrototypeOfOrExtend(dependentObservable, ko.dependentObservable['fn']);

    dependentObservable.peek = peek;
    dependentObservable.getDependenciesCount = function () { return _dependenciesCount; };
    dependentObservable.hasWriteFunction = typeof options["write"] === "function";
    dependentObservable.dispose = function () { dispose(); };
    dependentObservable.isActive = isActive;

    // Replace the limit function with one that delays evaluation as well.
    var originalLimit = dependentObservable.limit;
    dependentObservable.limit = function(limitFunction) {
        originalLimit.call(dependentObservable, limitFunction);
        dependentObservable._evalRateLimited = function() {
            dependentObservable._rateLimitedBeforeChange(_latestValue);

            _needsEvaluation = true;    // Mark as dirty

            // Pass the observable to the rate-limit code, which will access it when
            // it's time to do the notification.
            dependentObservable._rateLimitedChange(dependentObservable);
        }
    };

    if (options['pure']) {
        pure = true;
        isSleeping = true;     // Starts off sleeping; will awake on the first subscription
        dependentObservable.beforeSubscriptionAdd = function () {
            // If asleep, wake up the computed and evaluate to register any dependencies.
            if (isSleeping) {
                isSleeping = false;
                evaluateImmediate(true /* suppressChangeNotification */);
            }
        }
        dependentObservable.afterSubscriptionRemove = function () {
            if (!dependentObservable.getSubscriptionsCount()) {
                disposeAllSubscriptionsToDependencies();
                isSleeping = _needsEvaluation = true;
            }
        }
    } else if (options['deferEvaluation']) {
        // This will force a computed with deferEvaluation to evaluate when the first subscriptions is registered.
        dependentObservable.beforeSubscriptionAdd = function () {
            peek();
            delete dependentObservable.beforeSubscriptionAdd;
        }
    }

    ko.exportProperty(dependentObservable, 'peek', dependentObservable.peek);
    ko.exportProperty(dependentObservable, 'dispose', dependentObservable.dispose);
    ko.exportProperty(dependentObservable, 'isActive', dependentObservable.isActive);
    ko.exportProperty(dependentObservable, 'getDependenciesCount', dependentObservable.getDependenciesCount);

    // Add a "disposeWhen" callback that, on each evaluation, disposes if the node was removed without using ko.removeNode.
    if (disposeWhenNodeIsRemoved) {
        // Since this computed is associated with a DOM node, and we don't want to dispose the computed
        // until the DOM node is *removed* from the document (as opposed to never having been in the document),
        // we'll prevent disposal until "disposeWhen" first returns false.
        _suppressDisposalUntilDisposeWhenReturnsFalse = true;

        // Only watch for the node's disposal if the value really is a node. It might not be,
        // e.g., { disposeWhenNodeIsRemoved: true } can be used to opt into the "only dispose
        // after first false result" behaviour even if there's no specific node to watch. This
        // technique is intended for KO's internal use only and shouldn't be documented or used
        // by application code, as it's likely to change in a future version of KO.
        if (disposeWhenNodeIsRemoved.nodeType) {
            disposeWhen = function () {
                return !ko.utils.domNodeIsAttachedToDocument(disposeWhenNodeIsRemoved) || (disposeWhenOption && disposeWhenOption());
            };
        }
    }

    // Evaluate, unless sleeping or deferEvaluation is true
    if (!isSleeping && !options['deferEvaluation'])
        evaluateImmediate();

    // Attach a DOM node disposal callback so that the computed will be proactively disposed as soon as the node is
    // removed using ko.removeNode. But skip if isActive is false (there will never be any dependencies to dispose).
    if (disposeWhenNodeIsRemoved && isActive() && disposeWhenNodeIsRemoved.nodeType) {
        dispose = function() {
            ko.utils.domNodeDisposal.removeDisposeCallback(disposeWhenNodeIsRemoved, dispose);
            disposeComputed();
        };
        ko.utils.domNodeDisposal.addDisposeCallback(disposeWhenNodeIsRemoved, dispose);
    }

    return dependentObservable;
};

ko.isComputed = function(instance) {
    return ko.hasPrototype(instance, ko.dependentObservable);
};

var protoProp = ko.observable.protoProperty; // == "__ko_proto__"
ko.dependentObservable[protoProp] = ko.observable;

ko.dependentObservable['fn'] = {
    "equalityComparer": valuesArePrimitiveAndEqual
};
ko.dependentObservable['fn'][protoProp] = ko.dependentObservable;

// Note that for browsers that don't support proto assignment, the
// inheritance chain is created manually in the ko.dependentObservable constructor
if (ko.utils.canSetPrototype) {
    ko.utils.setPrototypeOf(ko.dependentObservable['fn'], ko.subscribable['fn']);
}

ko.exportSymbol('dependentObservable', ko.dependentObservable);
ko.exportSymbol('computed', ko.dependentObservable); // Make "ko.computed" an alias for "ko.dependentObservable"
ko.exportSymbol('isComputed', ko.isComputed);

ko.pureComputed = function (evaluatorFunctionOrOptions, evaluatorFunctionTarget) {
    if (typeof evaluatorFunctionOrOptions === 'function') {
        return ko.computed(evaluatorFunctionOrOptions, evaluatorFunctionTarget, {'pure':true});
    } else {
        evaluatorFunctionOrOptions = ko.utils.extend({}, evaluatorFunctionOrOptions);   // make a copy of the parameter object
        evaluatorFunctionOrOptions['pure'] = true;
        return ko.computed(evaluatorFunctionOrOptions, evaluatorFunctionTarget);
    }
}
ko.exportSymbol('pureComputed', ko.pureComputed);

(function() {
    var maxNestedObservableDepth = 10; // Escape the (unlikely) pathalogical case where an observable's current value is itself (or similar reference cycle)

    ko.toJS = function(rootObject) {
        if (arguments.length == 0)
            throw new Error("When calling ko.toJS, pass the object you want to convert.");

        // We just unwrap everything at every level in the object graph
        return mapJsObjectGraph(rootObject, function(valueToMap) {
            // Loop because an observable's value might in turn be another observable wrapper
            for (var i = 0; ko.isObservable(valueToMap) && (i < maxNestedObservableDepth); i++)
                valueToMap = valueToMap();
            return valueToMap;
        });
    };

    ko.toJSON = function(rootObject, replacer, space) {     // replacer and space are optional
        var plainJavaScriptObject = ko.toJS(rootObject);
        return ko.utils.stringifyJson(plainJavaScriptObject, replacer, space);
    };

    function mapJsObjectGraph(rootObject, mapInputCallback, visitedObjects) {
        visitedObjects = visitedObjects || new objectLookup();

        rootObject = mapInputCallback(rootObject);
        var canHaveProperties = (typeof rootObject == "object") && (rootObject !== null) && (rootObject !== undefined) && (!(rootObject instanceof Date)) && (!(rootObject instanceof String)) && (!(rootObject instanceof Number)) && (!(rootObject instanceof Boolean));
        if (!canHaveProperties)
            return rootObject;

        var outputProperties = rootObject instanceof Array ? [] : {};
        visitedObjects.save(rootObject, outputProperties);

        visitPropertiesOrArrayEntries(rootObject, function(indexer) {
            var propertyValue = mapInputCallback(rootObject[indexer]);

            switch (typeof propertyValue) {
                case "boolean":
                case "number":
                case "string":
                case "function":
                    outputProperties[indexer] = propertyValue;
                    break;
                case "object":
                case "undefined":
                    var previouslyMappedValue = visitedObjects.get(propertyValue);
                    outputProperties[indexer] = (previouslyMappedValue !== undefined)
                        ? previouslyMappedValue
                        : mapJsObjectGraph(propertyValue, mapInputCallback, visitedObjects);
                    break;
            }
        });

        return outputProperties;
    }

    function visitPropertiesOrArrayEntries(rootObject, visitorCallback) {
        if (rootObject instanceof Array) {
            for (var i = 0; i < rootObject.length; i++)
                visitorCallback(i);

            // For arrays, also respect toJSON property for custom mappings (fixes #278)
            if (typeof rootObject['toJSON'] == 'function')
                visitorCallback('toJSON');
        } else {
            for (var propertyName in rootObject) {
                visitorCallback(propertyName);
            }
        }
    };

    function objectLookup() {
        this.keys = [];
        this.values = [];
    };

    objectLookup.prototype = {
        constructor: objectLookup,
        save: function(key, value) {
            var existingIndex = ko.utils.arrayIndexOf(this.keys, key);
            if (existingIndex >= 0)
                this.values[existingIndex] = value;
            else {
                this.keys.push(key);
                this.values.push(value);
            }
        },
        get: function(key) {
            var existingIndex = ko.utils.arrayIndexOf(this.keys, key);
            return (existingIndex >= 0) ? this.values[existingIndex] : undefined;
        }
    };
})();

ko.exportSymbol('toJS', ko.toJS);
ko.exportSymbol('toJSON', ko.toJSON);
(function () {
    var hasDomDataExpandoProperty = '__ko__hasDomDataOptionValue__';

    // Normally, SELECT elements and their OPTIONs can only take value of type 'string' (because the values
    // are stored on DOM attributes). ko.selectExtensions provides a way for SELECTs/OPTIONs to have values
    // that are arbitrary objects. This is very convenient when implementing things like cascading dropdowns.
    ko.selectExtensions = {
        readValue : function(element) {
            switch (ko.utils.tagNameLower(element)) {
                case 'option':
                    if (element[hasDomDataExpandoProperty] === true)
                        return ko.utils.domData.get(element, ko.bindingHandlers.options.optionValueDomDataKey);
                    return ko.utils.ieVersion <= 7
                        ? (element.getAttributeNode('value') && element.getAttributeNode('value').specified ? element.value : element.text)
                        : element.value;
                case 'select':
                    return element.selectedIndex >= 0 ? ko.selectExtensions.readValue(element.options[element.selectedIndex]) : undefined;
                default:
                    return element.value;
            }
        },

        writeValue: function(element, value, allowUnset) {
            switch (ko.utils.tagNameLower(element)) {
                case 'option':
                    switch(typeof value) {
                        case "string":
                            ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, undefined);
                            if (hasDomDataExpandoProperty in element) { // IE <= 8 throws errors if you delete non-existent properties from a DOM node
                                delete element[hasDomDataExpandoProperty];
                            }
                            element.value = value;
                            break;
                        default:
                            // Store arbitrary object using DomData
                            ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, value);
                            element[hasDomDataExpandoProperty] = true;

                            // Special treatment of numbers is just for backward compatibility. KO 1.2.1 wrote numerical values to element.value.
                            element.value = typeof value === "number" ? value : "";
                            break;
                    }
                    break;
                case 'select':
                    if (value === "" || value === null)       // A blank string or null value will select the caption
                        value = undefined;
                    var selection = -1;
                    for (var i = 0, n = element.options.length, optionValue; i < n; ++i) {
                        optionValue = ko.selectExtensions.readValue(element.options[i]);
                        // Include special check to handle selecting a caption with a blank string value
                        if (optionValue == value || (optionValue == "" && value === undefined)) {
                            selection = i;
                            break;
                        }
                    }
                    if (allowUnset || selection >= 0 || (value === undefined && element.size > 1)) {
                        element.selectedIndex = selection;
                    }
                    break;
                default:
                    if ((value === null) || (value === undefined))
                        value = "";
                    element.value = value;
                    break;
            }
        }
    };
})();

ko.exportSymbol('selectExtensions', ko.selectExtensions);
ko.exportSymbol('selectExtensions.readValue', ko.selectExtensions.readValue);
ko.exportSymbol('selectExtensions.writeValue', ko.selectExtensions.writeValue);
ko.expressionRewriting = (function () {
    var javaScriptReservedWords = ["true", "false", "null", "undefined"];

    // Matches something that can be assigned to--either an isolated identifier or something ending with a property accessor
    // This is designed to be simple and avoid false negatives, but could produce false positives (e.g., a+b.c).
    // This also will not properly handle nested brackets (e.g., obj1[obj2['prop']]; see #911).
    var javaScriptAssignmentTarget = /^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i;

    function getWriteableValue(expression) {
        if (ko.utils.arrayIndexOf(javaScriptReservedWords, expression) >= 0)
            return false;
        var match = expression.match(javaScriptAssignmentTarget);
        return match === null ? false : match[1] ? ('Object(' + match[1] + ')' + match[2]) : expression;
    }

    // The following regular expressions will be used to split an object-literal string into tokens

        // These two match strings, either with double quotes or single quotes
    var stringDouble = '"(?:[^"\\\\]|\\\\.)*"',
        stringSingle = "'(?:[^'\\\\]|\\\\.)*'",
        // Matches a regular expression (text enclosed by slashes), but will also match sets of divisions
        // as a regular expression (this is handled by the parsing loop below).
        stringRegexp = '/(?:[^/\\\\]|\\\\.)*/\w*',
        // These characters have special meaning to the parser and must not appear in the middle of a
        // token, except as part of a string.
        specials = ',"\'{}()/:[\\]',
        // Match text (at least two characters) that does not contain any of the above special characters,
        // although some of the special characters are allowed to start it (all but the colon and comma).
        // The text can contain spaces, but leading or trailing spaces are skipped.
        everyThingElse = '[^\\s:,/][^' + specials + ']*[^\\s' + specials + ']',
        // Match any non-space character not matched already. This will match colons and commas, since they're
        // not matched by "everyThingElse", but will also match any other single character that wasn't already
        // matched (for example: in "a: 1, b: 2", each of the non-space characters will be matched by oneNotSpace).
        oneNotSpace = '[^\\s]',

        // Create the actual regular expression by or-ing the above strings. The order is important.
        bindingToken = RegExp(stringDouble + '|' + stringSingle + '|' + stringRegexp + '|' + everyThingElse + '|' + oneNotSpace, 'g'),

        // Match end of previous token to determine whether a slash is a division or regex.
        divisionLookBehind = /[\])"'A-Za-z0-9_$]+$/,
        keywordRegexLookBehind = {'in':1,'return':1,'typeof':1};

    function parseObjectLiteral(objectLiteralString) {
        // Trim leading and trailing spaces from the string
        var str = ko.utils.stringTrim(objectLiteralString);

        // Trim braces '{' surrounding the whole object literal
        if (str.charCodeAt(0) === 123) str = str.slice(1, -1);

        // Split into tokens
        var result = [], toks = str.match(bindingToken), key, values, depth = 0;

        if (toks) {
            // Append a comma so that we don't need a separate code block to deal with the last item
            toks.push(',');

            for (var i = 0, tok; tok = toks[i]; ++i) {
                var c = tok.charCodeAt(0);
                // A comma signals the end of a key/value pair if depth is zero
                if (c === 44) { // ","
                    if (depth <= 0) {
                        if (key)
                            result.push(values ? {key: key, value: values.join('')} : {'unknown': key});
                        key = values = depth = 0;
                        continue;
                    }
                // Simply skip the colon that separates the name and value
                } else if (c === 58) { // ":"
                    if (!values)
                        continue;
                // A set of slashes is initially matched as a regular expression, but could be division
                } else if (c === 47 && i && tok.length > 1) {  // "/"
                    // Look at the end of the previous token to determine if the slash is actually division
                    var match = toks[i-1].match(divisionLookBehind);
                    if (match && !keywordRegexLookBehind[match[0]]) {
                        // The slash is actually a division punctuator; re-parse the remainder of the string (not including the slash)
                        str = str.substr(str.indexOf(tok) + 1);
                        toks = str.match(bindingToken);
                        toks.push(',');
                        i = -1;
                        // Continue with just the slash
                        tok = '/';
                    }
                // Increment depth for parentheses, braces, and brackets so that interior commas are ignored
                } else if (c === 40 || c === 123 || c === 91) { // '(', '{', '['
                    ++depth;
                } else if (c === 41 || c === 125 || c === 93) { // ')', '}', ']'
                    --depth;
                // The key must be a single token; if it's a string, trim the quotes
                } else if (!key && !values) {
                    key = (c === 34 || c === 39) /* '"', "'" */ ? tok.slice(1, -1) : tok;
                    continue;
                }
                if (values)
                    values.push(tok);
                else
                    values = [tok];
            }
        }
        return result;
    }

    // Two-way bindings include a write function that allow the handler to update the value even if it's not an observable.
    var twoWayBindings = {};

    function preProcessBindings(bindingsStringOrKeyValueArray, bindingOptions) {
        bindingOptions = bindingOptions || {};

        function processKeyValue(key, val) {
            var writableVal;
            function callPreprocessHook(obj) {
                return (obj && obj['preprocess']) ? (val = obj['preprocess'](val, key, processKeyValue)) : true;
            }
            if (!bindingParams) {
                if (!callPreprocessHook(ko['getBindingHandler'](key)))
                    return;

                if (twoWayBindings[key] && (writableVal = getWriteableValue(val))) {
                    // For two-way bindings, provide a write method in case the value
                    // isn't a writable observable.
                    propertyAccessorResultStrings.push("'" + key + "':function(_z){" + writableVal + "=_z}");
                }
            }
            // Values are wrapped in a function so that each value can be accessed independently
            if (makeValueAccessors) {
                val = 'function(){return ' + val + ' }';
            }
            resultStrings.push("'" + key + "':" + val);
        }

        var resultStrings = [],
            propertyAccessorResultStrings = [],
            makeValueAccessors = bindingOptions['valueAccessors'],
            bindingParams = bindingOptions['bindingParams'],
            keyValueArray = typeof bindingsStringOrKeyValueArray === "string" ?
                parseObjectLiteral(bindingsStringOrKeyValueArray) : bindingsStringOrKeyValueArray;

        ko.utils.arrayForEach(keyValueArray, function(keyValue) {
            processKeyValue(keyValue.key || keyValue['unknown'], keyValue.value);
        });

        if (propertyAccessorResultStrings.length)
            processKeyValue('_ko_property_writers', "{" + propertyAccessorResultStrings.join(",") + " }");

        return resultStrings.join(",");
    }

    return {
        bindingRewriteValidators: [],

        twoWayBindings: twoWayBindings,

        parseObjectLiteral: parseObjectLiteral,

        preProcessBindings: preProcessBindings,

        keyValueArrayContainsKey: function(keyValueArray, key) {
            for (var i = 0; i < keyValueArray.length; i++)
                if (keyValueArray[i]['key'] == key)
                    return true;
            return false;
        },

        // Internal, private KO utility for updating model properties from within bindings
        // property:            If the property being updated is (or might be) an observable, pass it here
        //                      If it turns out to be a writable observable, it will be written to directly
        // allBindings:         An object with a get method to retrieve bindings in the current execution context.
        //                      This will be searched for a '_ko_property_writers' property in case you're writing to a non-observable
        // key:                 The key identifying the property to be written. Example: for { hasFocus: myValue }, write to 'myValue' by specifying the key 'hasFocus'
        // value:               The value to be written
        // checkIfDifferent:    If true, and if the property being written is a writable observable, the value will only be written if
        //                      it is !== existing value on that writable observable
        writeValueToProperty: function(property, allBindings, key, value, checkIfDifferent) {
            if (!property || !ko.isObservable(property)) {
                var propWriters = allBindings.get('_ko_property_writers');
                if (propWriters && propWriters[key])
                    propWriters[key](value);
            } else if (ko.isWriteableObservable(property) && (!checkIfDifferent || property.peek() !== value)) {
                property(value);
            }
        }
    };
})();

ko.exportSymbol('expressionRewriting', ko.expressionRewriting);
ko.exportSymbol('expressionRewriting.bindingRewriteValidators', ko.expressionRewriting.bindingRewriteValidators);
ko.exportSymbol('expressionRewriting.parseObjectLiteral', ko.expressionRewriting.parseObjectLiteral);
ko.exportSymbol('expressionRewriting.preProcessBindings', ko.expressionRewriting.preProcessBindings);

// Making bindings explicitly declare themselves as "two way" isn't ideal in the long term (it would be better if
// all bindings could use an official 'property writer' API without needing to declare that they might). However,
// since this is not, and has never been, a public API (_ko_property_writers was never documented), it's acceptable
// as an internal implementation detail in the short term.
// For those developers who rely on _ko_property_writers in their custom bindings, we expose _twoWayBindings as an
// undocumented feature that makes it relatively easy to upgrade to KO 3.0. However, this is still not an official
// public API, and we reserve the right to remove it at any time if we create a real public property writers API.
ko.exportSymbol('expressionRewriting._twoWayBindings', ko.expressionRewriting.twoWayBindings);

// For backward compatibility, define the following aliases. (Previously, these function names were misleading because
// they referred to JSON specifically, even though they actually work with arbitrary JavaScript object literal expressions.)
ko.exportSymbol('jsonExpressionRewriting', ko.expressionRewriting);
ko.exportSymbol('jsonExpressionRewriting.insertPropertyAccessorsIntoJson', ko.expressionRewriting.preProcessBindings);
(function() {
    // "Virtual elements" is an abstraction on top of the usual DOM API which understands the notion that comment nodes
    // may be used to represent hierarchy (in addition to the DOM's natural hierarchy).
    // If you call the DOM-manipulating functions on ko.virtualElements, you will be able to read and write the state
    // of that virtual hierarchy
    //
    // The point of all this is to support containerless templates (e.g., <!-- ko foreach:someCollection -->blah<!-- /ko -->)
    // without having to scatter special cases all over the binding and templating code.

    // IE 9 cannot reliably read the "nodeValue" property of a comment node (see https://github.com/SteveSanderson/knockout/issues/186)
    // but it does give them a nonstandard alternative property called "text" that it can read reliably. Other browsers don't have that property.
    // So, use node.text where available, and node.nodeValue elsewhere
    var commentNodesHaveTextProperty = document && document.createComment("test").text === "<!--test-->";

    var startCommentRegex = commentNodesHaveTextProperty ? /^<!--\s*ko(?:\s+([\s\S]+))?\s*-->$/ : /^\s*ko(?:\s+([\s\S]+))?\s*$/;
    var endCommentRegex =   commentNodesHaveTextProperty ? /^<!--\s*\/ko\s*-->$/ : /^\s*\/ko\s*$/;
    var htmlTagsWithOptionallyClosingChildren = { 'ul': true, 'ol': true };

    function isStartComment(node) {
        return (node.nodeType == 8) && startCommentRegex.test(commentNodesHaveTextProperty ? node.text : node.nodeValue);
    }

    function isEndComment(node) {
        return (node.nodeType == 8) && endCommentRegex.test(commentNodesHaveTextProperty ? node.text : node.nodeValue);
    }

    function getVirtualChildren(startComment, allowUnbalanced) {
        var currentNode = startComment;
        var depth = 1;
        var children = [];
        while (currentNode = currentNode.nextSibling) {
            if (isEndComment(currentNode)) {
                depth--;
                if (depth === 0)
                    return children;
            }

            children.push(currentNode);

            if (isStartComment(currentNode))
                depth++;
        }
        if (!allowUnbalanced)
            throw new Error("Cannot find closing comment tag to match: " + startComment.nodeValue);
        return null;
    }

    function getMatchingEndComment(startComment, allowUnbalanced) {
        var allVirtualChildren = getVirtualChildren(startComment, allowUnbalanced);
        if (allVirtualChildren) {
            if (allVirtualChildren.length > 0)
                return allVirtualChildren[allVirtualChildren.length - 1].nextSibling;
            return startComment.nextSibling;
        } else
            return null; // Must have no matching end comment, and allowUnbalanced is true
    }

    function getUnbalancedChildTags(node) {
        // e.g., from <div>OK</div><!-- ko blah --><span>Another</span>, returns: <!-- ko blah --><span>Another</span>
        //       from <div>OK</div><!-- /ko --><!-- /ko -->,             returns: <!-- /ko --><!-- /ko -->
        var childNode = node.firstChild, captureRemaining = null;
        if (childNode) {
            do {
                if (captureRemaining)                   // We already hit an unbalanced node and are now just scooping up all subsequent nodes
                    captureRemaining.push(childNode);
                else if (isStartComment(childNode)) {
                    var matchingEndComment = getMatchingEndComment(childNode, /* allowUnbalanced: */ true);
                    if (matchingEndComment)             // It's a balanced tag, so skip immediately to the end of this virtual set
                        childNode = matchingEndComment;
                    else
                        captureRemaining = [childNode]; // It's unbalanced, so start capturing from this point
                } else if (isEndComment(childNode)) {
                    captureRemaining = [childNode];     // It's unbalanced (if it wasn't, we'd have skipped over it already), so start capturing
                }
            } while (childNode = childNode.nextSibling);
        }
        return captureRemaining;
    }

    ko.virtualElements = {
        allowedBindings: {},

        childNodes: function(node) {
            return isStartComment(node) ? getVirtualChildren(node) : node.childNodes;
        },

        emptyNode: function(node) {
            if (!isStartComment(node))
                ko.utils.emptyDomNode(node);
            else {
                var virtualChildren = ko.virtualElements.childNodes(node);
                for (var i = 0, j = virtualChildren.length; i < j; i++)
                    ko.removeNode(virtualChildren[i]);
            }
        },

        setDomNodeChildren: function(node, childNodes) {
            if (!isStartComment(node))
                ko.utils.setDomNodeChildren(node, childNodes);
            else {
                ko.virtualElements.emptyNode(node);
                var endCommentNode = node.nextSibling; // Must be the next sibling, as we just emptied the children
                for (var i = 0, j = childNodes.length; i < j; i++)
                    endCommentNode.parentNode.insertBefore(childNodes[i], endCommentNode);
            }
        },

        prepend: function(containerNode, nodeToPrepend) {
            if (!isStartComment(containerNode)) {
                if (containerNode.firstChild)
                    containerNode.insertBefore(nodeToPrepend, containerNode.firstChild);
                else
                    containerNode.appendChild(nodeToPrepend);
            } else {
                // Start comments must always have a parent and at least one following sibling (the end comment)
                containerNode.parentNode.insertBefore(nodeToPrepend, containerNode.nextSibling);
            }
        },

        insertAfter: function(containerNode, nodeToInsert, insertAfterNode) {
            if (!insertAfterNode) {
                ko.virtualElements.prepend(containerNode, nodeToInsert);
            } else if (!isStartComment(containerNode)) {
                // Insert after insertion point
                if (insertAfterNode.nextSibling)
                    containerNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
                else
                    containerNode.appendChild(nodeToInsert);
            } else {
                // Children of start comments must always have a parent and at least one following sibling (the end comment)
                containerNode.parentNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
            }
        },

        firstChild: function(node) {
            if (!isStartComment(node))
                return node.firstChild;
            if (!node.nextSibling || isEndComment(node.nextSibling))
                return null;
            return node.nextSibling;
        },

        nextSibling: function(node) {
            if (isStartComment(node))
                node = getMatchingEndComment(node);
            if (node.nextSibling && isEndComment(node.nextSibling))
                return null;
            return node.nextSibling;
        },

        hasBindingValue: isStartComment,

        virtualNodeBindingValue: function(node) {
            var regexMatch = (commentNodesHaveTextProperty ? node.text : node.nodeValue).match(startCommentRegex);
            return regexMatch ? regexMatch[1] : null;
        },

        normaliseVirtualElementDomStructure: function(elementVerified) {
            // Workaround for https://github.com/SteveSanderson/knockout/issues/155
            // (IE <= 8 or IE 9 quirks mode parses your HTML weirdly, treating closing </li> tags as if they don't exist, thereby moving comment nodes
            // that are direct descendants of <ul> into the preceding <li>)
            if (!htmlTagsWithOptionallyClosingChildren[ko.utils.tagNameLower(elementVerified)])
                return;

            // Scan immediate children to see if they contain unbalanced comment tags. If they do, those comment tags
            // must be intended to appear *after* that child, so move them there.
            var childNode = elementVerified.firstChild;
            if (childNode) {
                do {
                    if (childNode.nodeType === 1) {
                        var unbalancedTags = getUnbalancedChildTags(childNode);
                        if (unbalancedTags) {
                            // Fix up the DOM by moving the unbalanced tags to where they most likely were intended to be placed - *after* the child
                            var nodeToInsertBefore = childNode.nextSibling;
                            for (var i = 0; i < unbalancedTags.length; i++) {
                                if (nodeToInsertBefore)
                                    elementVerified.insertBefore(unbalancedTags[i], nodeToInsertBefore);
                                else
                                    elementVerified.appendChild(unbalancedTags[i]);
                            }
                        }
                    }
                } while (childNode = childNode.nextSibling);
            }
        }
    };
})();
ko.exportSymbol('virtualElements', ko.virtualElements);
ko.exportSymbol('virtualElements.allowedBindings', ko.virtualElements.allowedBindings);
ko.exportSymbol('virtualElements.emptyNode', ko.virtualElements.emptyNode);
//ko.exportSymbol('virtualElements.firstChild', ko.virtualElements.firstChild);     // firstChild is not minified
ko.exportSymbol('virtualElements.insertAfter', ko.virtualElements.insertAfter);
//ko.exportSymbol('virtualElements.nextSibling', ko.virtualElements.nextSibling);   // nextSibling is not minified
ko.exportSymbol('virtualElements.prepend', ko.virtualElements.prepend);
ko.exportSymbol('virtualElements.setDomNodeChildren', ko.virtualElements.setDomNodeChildren);
(function() {
    var defaultBindingAttributeName = "data-bind";

    ko.bindingProvider = function() {
        this.bindingCache = {};
    };

    ko.utils.extend(ko.bindingProvider.prototype, {
        'nodeHasBindings': function(node) {
            switch (node.nodeType) {
                case 1: // Element
                    return node.getAttribute(defaultBindingAttributeName) != null
                        || ko.components['getComponentNameForNode'](node);
                case 8: // Comment node
                    return ko.virtualElements.hasBindingValue(node);
                default: return false;
            }
        },

        'getBindings': function(node, bindingContext) {
            var bindingsString = this['getBindingsString'](node, bindingContext),
                parsedBindings = bindingsString ? this['parseBindingsString'](bindingsString, bindingContext, node) : null;
            return ko.components.addBindingsForCustomElement(parsedBindings, node, bindingContext, /* valueAccessors */ false);
        },

        'getBindingAccessors': function(node, bindingContext) {
            var bindingsString = this['getBindingsString'](node, bindingContext),
                parsedBindings = bindingsString ? this['parseBindingsString'](bindingsString, bindingContext, node, { 'valueAccessors': true }) : null;
            return ko.components.addBindingsForCustomElement(parsedBindings, node, bindingContext, /* valueAccessors */ true);
        },

        // The following function is only used internally by this default provider.
        // It's not part of the interface definition for a general binding provider.
        'getBindingsString': function(node, bindingContext) {
            switch (node.nodeType) {
                case 1: return node.getAttribute(defaultBindingAttributeName);   // Element
                case 8: return ko.virtualElements.virtualNodeBindingValue(node); // Comment node
                default: return null;
            }
        },

        // The following function is only used internally by this default provider.
        // It's not part of the interface definition for a general binding provider.
        'parseBindingsString': function(bindingsString, bindingContext, node, options) {
            try {
                var bindingFunction = createBindingsStringEvaluatorViaCache(bindingsString, this.bindingCache, options);
                return bindingFunction(bindingContext, node);
            } catch (ex) {
                ex.message = "Unable to parse bindings.\nBindings value: " + bindingsString + "\nMessage: " + ex.message;
                throw ex;
            }
        }
    });

    ko.bindingProvider['instance'] = new ko.bindingProvider();

    function createBindingsStringEvaluatorViaCache(bindingsString, cache, options) {
        var cacheKey = bindingsString + (options && options['valueAccessors'] || '');
        return cache[cacheKey]
            || (cache[cacheKey] = createBindingsStringEvaluator(bindingsString, options));
    }

    function createBindingsStringEvaluator(bindingsString, options) {
        // Build the source for a function that evaluates "expression"
        // For each scope variable, add an extra level of "with" nesting
        // Example result: with(sc1) { with(sc0) { return (expression) } }
        var rewrittenBindings = ko.expressionRewriting.preProcessBindings(bindingsString, options),
            functionBody = "with($context){with($data||{}){return{" + rewrittenBindings + "}}}";
        return new Function("$context", "$element", functionBody);
    }
})();

ko.exportSymbol('bindingProvider', ko.bindingProvider);
(function () {
    ko.bindingHandlers = {};

    // The following element types will not be recursed into during binding. In the future, we
    // may consider adding <template> to this list, because such elements' contents are always
    // intended to be bound in a different context from where they appear in the document.
    var bindingDoesNotRecurseIntoElementTypes = {
        // Don't want bindings that operate on text nodes to mutate <script> contents,
        // because it's unexpected and a potential XSS issue
        'script': true
    };

    // Use an overridable method for retrieving binding handlers so that a plugins may support dynamically created handlers
    ko['getBindingHandler'] = function(bindingKey) {
        return ko.bindingHandlers[bindingKey];
    };

    // The ko.bindingContext constructor is only called directly to create the root context. For child
    // contexts, use bindingContext.createChildContext or bindingContext.extend.
    ko.bindingContext = function(dataItemOrAccessor, parentContext, dataItemAlias, extendCallback) {

        // The binding context object includes static properties for the current, parent, and root view models.
        // If a view model is actually stored in an observable, the corresponding binding context object, and
        // any child contexts, must be updated when the view model is changed.
        function updateContext() {
            // Most of the time, the context will directly get a view model object, but if a function is given,
            // we call the function to retrieve the view model. If the function accesses any obsevables or returns
            // an observable, the dependency is tracked, and those observables can later cause the binding
            // context to be updated.
            var dataItemOrObservable = isFunc ? dataItemOrAccessor() : dataItemOrAccessor,
                dataItem = ko.utils.unwrapObservable(dataItemOrObservable);

            if (parentContext) {
                // When a "parent" context is given, register a dependency on the parent context. Thus whenever the
                // parent context is updated, this context will also be updated.
                if (parentContext._subscribable)
                    parentContext._subscribable();

                // Copy $root and any custom properties from the parent context
                ko.utils.extend(self, parentContext);

                // Because the above copy overwrites our own properties, we need to reset them.
                // During the first execution, "subscribable" isn't set, so don't bother doing the update then.
                if (subscribable) {
                    self._subscribable = subscribable;
                }
            } else {
                self['$parents'] = [];
                self['$root'] = dataItem;

                // Export 'ko' in the binding context so it will be available in bindings and templates
                // even if 'ko' isn't exported as a global, such as when using an AMD loader.
                // See https://github.com/SteveSanderson/knockout/issues/490
                self['ko'] = ko;
            }
            self['$rawData'] = dataItemOrObservable;
            self['$data'] = dataItem;
            if (dataItemAlias)
                self[dataItemAlias] = dataItem;

            // The extendCallback function is provided when creating a child context or extending a context.
            // It handles the specific actions needed to finish setting up the binding context. Actions in this
            // function could also add dependencies to this binding context.
            if (extendCallback)
                extendCallback(self, parentContext, dataItem);

            return self['$data'];
        }
        function disposeWhen() {
            return nodes && !ko.utils.anyDomNodeIsAttachedToDocument(nodes);
        }

        var self = this,
            isFunc = typeof(dataItemOrAccessor) == "function" && !ko.isObservable(dataItemOrAccessor),
            nodes,
            subscribable = ko.dependentObservable(updateContext, null, { disposeWhen: disposeWhen, disposeWhenNodeIsRemoved: true });

        // At this point, the binding context has been initialized, and the "subscribable" computed observable is
        // subscribed to any observables that were accessed in the process. If there is nothing to track, the
        // computed will be inactive, and we can safely throw it away. If it's active, the computed is stored in
        // the context object.
        if (subscribable.isActive()) {
            self._subscribable = subscribable;

            // Always notify because even if the model ($data) hasn't changed, other context properties might have changed
            subscribable['equalityComparer'] = null;

            // We need to be able to dispose of this computed observable when it's no longer needed. This would be
            // easy if we had a single node to watch, but binding contexts can be used by many different nodes, and
            // we cannot assume that those nodes have any relation to each other. So instead we track any node that
            // the context is attached to, and dispose the computed when all of those nodes have been cleaned.

            // Add properties to *subscribable* instead of *self* because any properties added to *self* may be overwritten on updates
            nodes = [];
            subscribable._addNode = function(node) {
                nodes.push(node);
                ko.utils.domNodeDisposal.addDisposeCallback(node, function(node) {
                    ko.utils.arrayRemoveItem(nodes, node);
                    if (!nodes.length) {
                        subscribable.dispose();
                        self._subscribable = subscribable = undefined;
                    }
                });
            };
        }
    }

    // Extend the binding context hierarchy with a new view model object. If the parent context is watching
    // any obsevables, the new child context will automatically get a dependency on the parent context.
    // But this does not mean that the $data value of the child context will also get updated. If the child
    // view model also depends on the parent view model, you must provide a function that returns the correct
    // view model on each update.
    ko.bindingContext.prototype['createChildContext'] = function (dataItemOrAccessor, dataItemAlias, extendCallback) {
        return new ko.bindingContext(dataItemOrAccessor, this, dataItemAlias, function(self, parentContext) {
            // Extend the context hierarchy by setting the appropriate pointers
            self['$parentContext'] = parentContext;
            self['$parent'] = parentContext['$data'];
            self['$parents'] = (parentContext['$parents'] || []).slice(0);
            self['$parents'].unshift(self['$parent']);
            if (extendCallback)
                extendCallback(self);
        });
    };

    // Extend the binding context with new custom properties. This doesn't change the context hierarchy.
    // Similarly to "child" contexts, provide a function here to make sure that the correct values are set
    // when an observable view model is updated.
    ko.bindingContext.prototype['extend'] = function(properties) {
        // If the parent context references an observable view model, "_subscribable" will always be the
        // latest view model object. If not, "_subscribable" isn't set, and we can use the static "$data" value.
        return new ko.bindingContext(this._subscribable || this['$data'], this, null, function(self, parentContext) {
            // This "child" context doesn't directly track a parent observable view model,
            // so we need to manually set the $rawData value to match the parent.
            self['$rawData'] = parentContext['$rawData'];
            ko.utils.extend(self, typeof(properties) == "function" ? properties() : properties);
        });
    };

    // Returns the valueAccesor function for a binding value
    function makeValueAccessor(value) {
        return function() {
            return value;
        };
    }

    // Returns the value of a valueAccessor function
    function evaluateValueAccessor(valueAccessor) {
        return valueAccessor();
    }

    // Given a function that returns bindings, create and return a new object that contains
    // binding value-accessors functions. Each accessor function calls the original function
    // so that it always gets the latest value and all dependencies are captured. This is used
    // by ko.applyBindingsToNode and getBindingsAndMakeAccessors.
    function makeAccessorsFromFunction(callback) {
        return ko.utils.objectMap(ko.dependencyDetection.ignore(callback), function(value, key) {
            return function() {
                return callback()[key];
            };
        });
    }

    // Given a bindings function or object, create and return a new object that contains
    // binding value-accessors functions. This is used by ko.applyBindingsToNode.
    function makeBindingAccessors(bindings, context, node) {
        if (typeof bindings === 'function') {
            return makeAccessorsFromFunction(bindings.bind(null, context, node));
        } else {
            return ko.utils.objectMap(bindings, makeValueAccessor);
        }
    }

    // This function is used if the binding provider doesn't include a getBindingAccessors function.
    // It must be called with 'this' set to the provider instance.
    function getBindingsAndMakeAccessors(node, context) {
        return makeAccessorsFromFunction(this['getBindings'].bind(this, node, context));
    }

    function validateThatBindingIsAllowedForVirtualElements(bindingName) {
        var validator = ko.virtualElements.allowedBindings[bindingName];
        if (!validator)
            throw new Error("The binding '" + bindingName + "' cannot be used with virtual elements")
    }

    function applyBindingsToDescendantsInternal (bindingContext, elementOrVirtualElement, bindingContextsMayDifferFromDomParentElement) {
        var currentChild,
            nextInQueue = ko.virtualElements.firstChild(elementOrVirtualElement),
            provider = ko.bindingProvider['instance'],
            preprocessNode = provider['preprocessNode'];

        // Preprocessing allows a binding provider to mutate a node before bindings are applied to it. For example it's
        // possible to insert new siblings after it, and/or replace the node with a different one. This can be used to
        // implement custom binding syntaxes, such as {{ value }} for string interpolation, or custom element types that
        // trigger insertion of <template> contents at that point in the document.
        if (preprocessNode) {
            while (currentChild = nextInQueue) {
                nextInQueue = ko.virtualElements.nextSibling(currentChild);
                preprocessNode.call(provider, currentChild);
            }
            // Reset nextInQueue for the next loop
            nextInQueue = ko.virtualElements.firstChild(elementOrVirtualElement);
        }

        while (currentChild = nextInQueue) {
            // Keep a record of the next child *before* applying bindings, in case the binding removes the current child from its position
            nextInQueue = ko.virtualElements.nextSibling(currentChild);
            applyBindingsToNodeAndDescendantsInternal(bindingContext, currentChild, bindingContextsMayDifferFromDomParentElement);
        }
    }

    function applyBindingsToNodeAndDescendantsInternal (bindingContext, nodeVerified, bindingContextMayDifferFromDomParentElement) {
        var shouldBindDescendants = true;

        // Perf optimisation: Apply bindings only if...
        // (1) We need to store the binding context on this node (because it may differ from the DOM parent node's binding context)
        //     Note that we can't store binding contexts on non-elements (e.g., text nodes), as IE doesn't allow expando properties for those
        // (2) It might have bindings (e.g., it has a data-bind attribute, or it's a marker for a containerless template)
        var isElement = (nodeVerified.nodeType === 1);
        if (isElement) // Workaround IE <= 8 HTML parsing weirdness
            ko.virtualElements.normaliseVirtualElementDomStructure(nodeVerified);

        var shouldApplyBindings = (isElement && bindingContextMayDifferFromDomParentElement)             // Case (1)
                               || ko.bindingProvider['instance']['nodeHasBindings'](nodeVerified);       // Case (2)
        if (shouldApplyBindings)
            shouldBindDescendants = applyBindingsToNodeInternal(nodeVerified, null, bindingContext, bindingContextMayDifferFromDomParentElement)['shouldBindDescendants'];

        if (shouldBindDescendants && !bindingDoesNotRecurseIntoElementTypes[ko.utils.tagNameLower(nodeVerified)]) {
            // We're recursing automatically into (real or virtual) child nodes without changing binding contexts. So,
            //  * For children of a *real* element, the binding context is certainly the same as on their DOM .parentNode,
            //    hence bindingContextsMayDifferFromDomParentElement is false
            //  * For children of a *virtual* element, we can't be sure. Evaluating .parentNode on those children may
            //    skip over any number of intermediate virtual elements, any of which might define a custom binding context,
            //    hence bindingContextsMayDifferFromDomParentElement is true
            applyBindingsToDescendantsInternal(bindingContext, nodeVerified, /* bindingContextsMayDifferFromDomParentElement: */ !isElement);
        }
    }

    var boundElementDomDataKey = ko.utils.domData.nextKey();


    function topologicalSortBindings(bindings) {
        // Depth-first sort
        var result = [],                // The list of key/handler pairs that we will return
            bindingsConsidered = {},    // A temporary record of which bindings are already in 'result'
            cyclicDependencyStack = []; // Keeps track of a depth-search so that, if there's a cycle, we know which bindings caused it
        ko.utils.objectForEach(bindings, function pushBinding(bindingKey) {
            if (!bindingsConsidered[bindingKey]) {
                var binding = ko['getBindingHandler'](bindingKey);
                if (binding) {
                    // First add dependencies (if any) of the current binding
                    if (binding['after']) {
                        cyclicDependencyStack.push(bindingKey);
                        ko.utils.arrayForEach(binding['after'], function(bindingDependencyKey) {
                            if (bindings[bindingDependencyKey]) {
                                if (ko.utils.arrayIndexOf(cyclicDependencyStack, bindingDependencyKey) !== -1) {
                                    throw Error("Cannot combine the following bindings, because they have a cyclic dependency: " + cyclicDependencyStack.join(", "));
                                } else {
                                    pushBinding(bindingDependencyKey);
                                }
                            }
                        });
                        cyclicDependencyStack.length--;
                    }
                    // Next add the current binding
                    result.push({ key: bindingKey, handler: binding });
                }
                bindingsConsidered[bindingKey] = true;
            }
        });

        return result;
    }

    function applyBindingsToNodeInternal(node, sourceBindings, bindingContext, bindingContextMayDifferFromDomParentElement) {
        // Prevent multiple applyBindings calls for the same node, except when a binding value is specified
        var alreadyBound = ko.utils.domData.get(node, boundElementDomDataKey);
        if (!sourceBindings) {
            if (alreadyBound) {
                throw Error("You cannot apply bindings multiple times to the same element.");
            }
            ko.utils.domData.set(node, boundElementDomDataKey, true);
        }

        // Optimization: Don't store the binding context on this node if it's definitely the same as on node.parentNode, because
        // we can easily recover it just by scanning up the node's ancestors in the DOM
        // (note: here, parent node means "real DOM parent" not "virtual parent", as there's no O(1) way to find the virtual parent)
        if (!alreadyBound && bindingContextMayDifferFromDomParentElement)
            ko.storedBindingContextForNode(node, bindingContext);

        // Use bindings if given, otherwise fall back on asking the bindings provider to give us some bindings
        var bindings;
        if (sourceBindings && typeof sourceBindings !== 'function') {
            bindings = sourceBindings;
        } else {
            var provider = ko.bindingProvider['instance'],
                getBindings = provider['getBindingAccessors'] || getBindingsAndMakeAccessors;

            // Get the binding from the provider within a computed observable so that we can update the bindings whenever
            // the binding context is updated or if the binding provider accesses observables.
            var bindingsUpdater = ko.dependentObservable(
                function() {
                    bindings = sourceBindings ? sourceBindings(bindingContext, node) : getBindings.call(provider, node, bindingContext);
                    // Register a dependency on the binding context to support obsevable view models.
                    if (bindings && bindingContext._subscribable)
                        bindingContext._subscribable();
                    return bindings;
                },
                null, { disposeWhenNodeIsRemoved: node }
            );

            if (!bindings || !bindingsUpdater.isActive())
                bindingsUpdater = null;
        }

        var bindingHandlerThatControlsDescendantBindings;
        if (bindings) {
            // Return the value accessor for a given binding. When bindings are static (won't be updated because of a binding
            // context update), just return the value accessor from the binding. Otherwise, return a function that always gets
            // the latest binding value and registers a dependency on the binding updater.
            var getValueAccessor = bindingsUpdater
                ? function(bindingKey) {
                    return function() {
                        return evaluateValueAccessor(bindingsUpdater()[bindingKey]);
                    };
                } : function(bindingKey) {
                    return bindings[bindingKey];
                };

            // Use of allBindings as a function is maintained for backwards compatibility, but its use is deprecated
            function allBindings() {
                return ko.utils.objectMap(bindingsUpdater ? bindingsUpdater() : bindings, evaluateValueAccessor);
            }
            // The following is the 3.x allBindings API
            allBindings['get'] = function(key) {
                return bindings[key] && evaluateValueAccessor(getValueAccessor(key));
            };
            allBindings['has'] = function(key) {
                return key in bindings;
            };

            // First put the bindings into the right order
            var orderedBindings = topologicalSortBindings(bindings);

            // Go through the sorted bindings, calling init and update for each
            ko.utils.arrayForEach(orderedBindings, function(bindingKeyAndHandler) {
                // Note that topologicalSortBindings has already filtered out any nonexistent binding handlers,
                // so bindingKeyAndHandler.handler will always be nonnull.
                var handlerInitFn = bindingKeyAndHandler.handler["init"],
                    handlerUpdateFn = bindingKeyAndHandler.handler["update"],
                    bindingKey = bindingKeyAndHandler.key;

                if (node.nodeType === 8) {
                    validateThatBindingIsAllowedForVirtualElements(bindingKey);
                }

                try {
                    // Run init, ignoring any dependencies
                    if (typeof handlerInitFn == "function") {
                        ko.dependencyDetection.ignore(function() {
                            var initResult = handlerInitFn(node, getValueAccessor(bindingKey), allBindings, bindingContext['$data'], bindingContext);

                            // If this binding handler claims to control descendant bindings, make a note of this
                            if (initResult && initResult['controlsDescendantBindings']) {
                                if (bindingHandlerThatControlsDescendantBindings !== undefined)
                                    throw new Error("Multiple bindings (" + bindingHandlerThatControlsDescendantBindings + " and " + bindingKey + ") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");
                                bindingHandlerThatControlsDescendantBindings = bindingKey;
                            }
                        });
                    }

                    // Run update in its own computed wrapper
                    if (typeof handlerUpdateFn == "function") {
                        ko.dependentObservable(
                            function() {
                                handlerUpdateFn(node, getValueAccessor(bindingKey), allBindings, bindingContext['$data'], bindingContext);
                            },
                            null,
                            { disposeWhenNodeIsRemoved: node }
                        );
                    }
                } catch (ex) {
                    ex.message = "Unable to process binding \"" + bindingKey + ": " + bindings[bindingKey] + "\"\nMessage: " + ex.message;
                    throw ex;
                }
            });
        }

        return {
            'shouldBindDescendants': bindingHandlerThatControlsDescendantBindings === undefined
        };
    };

    var storedBindingContextDomDataKey = ko.utils.domData.nextKey();
    ko.storedBindingContextForNode = function (node, bindingContext) {
        if (arguments.length == 2) {
            ko.utils.domData.set(node, storedBindingContextDomDataKey, bindingContext);
            if (bindingContext._subscribable)
                bindingContext._subscribable._addNode(node);
        } else {
            return ko.utils.domData.get(node, storedBindingContextDomDataKey);
        }
    }

    function getBindingContext(viewModelOrBindingContext) {
        return viewModelOrBindingContext && (viewModelOrBindingContext instanceof ko.bindingContext)
            ? viewModelOrBindingContext
            : new ko.bindingContext(viewModelOrBindingContext);
    }

    ko.applyBindingAccessorsToNode = function (node, bindings, viewModelOrBindingContext) {
        if (node.nodeType === 1) // If it's an element, workaround IE <= 8 HTML parsing weirdness
            ko.virtualElements.normaliseVirtualElementDomStructure(node);
        return applyBindingsToNodeInternal(node, bindings, getBindingContext(viewModelOrBindingContext), true);
    };

    ko.applyBindingsToNode = function (node, bindings, viewModelOrBindingContext) {
        var context = getBindingContext(viewModelOrBindingContext);
        return ko.applyBindingAccessorsToNode(node, makeBindingAccessors(bindings, context, node), context);
    };

    ko.applyBindingsToDescendants = function(viewModelOrBindingContext, rootNode) {
        if (rootNode.nodeType === 1 || rootNode.nodeType === 8)
            applyBindingsToDescendantsInternal(getBindingContext(viewModelOrBindingContext), rootNode, true);
    };

    ko.applyBindings = function (viewModelOrBindingContext, rootNode) {
        // If jQuery is loaded after Knockout, we won't initially have access to it. So save it here.
        if (!jQueryInstance && window['jQuery']) {
            jQueryInstance = window['jQuery'];
        }

        if (rootNode && (rootNode.nodeType !== 1) && (rootNode.nodeType !== 8))
            throw new Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");
        rootNode = rootNode || window.document.body; // Make "rootNode" parameter optional

        applyBindingsToNodeAndDescendantsInternal(getBindingContext(viewModelOrBindingContext), rootNode, true);
    };

    // Retrieving binding context from arbitrary nodes
    ko.contextFor = function(node) {
        // We can only do something meaningful for elements and comment nodes (in particular, not text nodes, as IE can't store domdata for them)
        switch (node.nodeType) {
            case 1:
            case 8:
                var context = ko.storedBindingContextForNode(node);
                if (context) return context;
                if (node.parentNode) return ko.contextFor(node.parentNode);
                break;
        }
        return undefined;
    };
    ko.dataFor = function(node) {
        var context = ko.contextFor(node);
        return context ? context['$data'] : undefined;
    };

    ko.exportSymbol('bindingHandlers', ko.bindingHandlers);
    ko.exportSymbol('applyBindings', ko.applyBindings);
    ko.exportSymbol('applyBindingsToDescendants', ko.applyBindingsToDescendants);
    ko.exportSymbol('applyBindingAccessorsToNode', ko.applyBindingAccessorsToNode);
    ko.exportSymbol('applyBindingsToNode', ko.applyBindingsToNode);
    ko.exportSymbol('contextFor', ko.contextFor);
    ko.exportSymbol('dataFor', ko.dataFor);
})();
(function(undefined) {
    var loadingSubscribablesCache = {}, // Tracks component loads that are currently in flight
        loadedDefinitionsCache = {};    // Tracks component loads that have already completed

    ko.components = {
        get: function(componentName, callback) {
            var cachedDefinition = getObjectOwnProperty(loadedDefinitionsCache, componentName);
            if (cachedDefinition) {
                // It's already loaded and cached. Reuse the same definition object.
                // Note that for API consistency, even cache hits complete asynchronously.
                setTimeout(function() { callback(cachedDefinition) }, 0);
            } else {
                // Join the loading process that is already underway, or start a new one.
                loadComponentAndNotify(componentName, callback);
            }
        },

        clearCachedDefinition: function(componentName) {
            delete loadedDefinitionsCache[componentName];
        },

        _getFirstResultFromLoaders: getFirstResultFromLoaders
    };

    function getObjectOwnProperty(obj, propName) {
        return obj.hasOwnProperty(propName) ? obj[propName] : undefined;
    }

    function loadComponentAndNotify(componentName, callback) {
        var subscribable = getObjectOwnProperty(loadingSubscribablesCache, componentName),
            completedAsync;
        if (!subscribable) {
            // It's not started loading yet. Start loading, and when it's done, move it to loadedDefinitionsCache.
            subscribable = loadingSubscribablesCache[componentName] = new ko.subscribable();
            beginLoadingComponent(componentName, function(definition) {
                loadedDefinitionsCache[componentName] = definition;
                delete loadingSubscribablesCache[componentName];

                // For API consistency, all loads complete asynchronously. However we want to avoid
                // adding an extra setTimeout if it's unnecessary (i.e., the completion is already
                // async) since setTimeout(..., 0) still takes about 16ms or more on most browsers.
                if (completedAsync) {
                    subscribable['notifySubscribers'](definition);
                } else {
                    setTimeout(function() {
                        subscribable['notifySubscribers'](definition);
                    }, 0);
                }
            });
            completedAsync = true;
        }
        subscribable.subscribe(callback);
    }

    function beginLoadingComponent(componentName, callback) {
        getFirstResultFromLoaders('getConfig', [componentName], function(config) {
            if (config) {
                // We have a config, so now load its definition
                getFirstResultFromLoaders('loadComponent', [componentName, config], function(definition) {
                    callback(definition);
                });
            } else {
                // The component has no config - it's unknown to all the loaders.
                // Note that this is not an error (e.g., a module loading error) - that would abort the
                // process and this callback would not run. For this callback to run, all loaders must
                // have confirmed they don't know about this component.
                callback(null);
            }
        });
    }

    function getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders) {
        // On the first call in the stack, start with the full set of loaders
        if (!candidateLoaders) {
            candidateLoaders = ko.components['loaders'].slice(0); // Use a copy, because we'll be mutating this array
        }

        // Try the next candidate
        var currentCandidateLoader = candidateLoaders.shift();
        if (currentCandidateLoader) {
            var methodInstance = currentCandidateLoader[methodName];
            if (methodInstance) {
                var wasAborted = false,
                    synchronousReturnValue = methodInstance.apply(currentCandidateLoader, argsExceptCallback.concat(function(result) {
                        if (wasAborted) {
                            callback(null);
                        } else if (result !== null) {
                            // This candidate returned a value. Use it.
                            callback(result);
                        } else {
                            // Try the next candidate
                            getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders);
                        }
                    }));

                // Currently, loaders may not return anything synchronously. This leaves open the possibility
                // that we'll extend the API to support synchronous return values in the future. It won't be
                // a breaking change, because currently no loader is allowed to return anything except undefined.
                if (synchronousReturnValue !== undefined) {
                    wasAborted = true;

                    // Method to suppress exceptions will remain undocumented. This is only to keep
                    // KO's specs running tidily, since we can observe the loading got aborted without
                    // having exceptions cluttering up the console too.
                    if (!currentCandidateLoader['suppressLoaderExceptions']) {
                        throw new Error('Component loaders must supply values by invoking the callback, not by returning values synchronously.');
                    }
                }
            } else {
                // This candidate doesn't have the relevant handler. Synchronously move on to the next one.
                getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders);
            }
        } else {
            // No candidates returned a value
            callback(null);
        }
    }

    // Reference the loaders via string name so it's possible for developers
    // to replace the whole array by assigning to ko.components.loaders
    ko.components['loaders'] = [];

    ko.exportSymbol('components', ko.components);
    ko.exportSymbol('components.get', ko.components.get);
    ko.exportSymbol('components.clearCachedDefinition', ko.components.clearCachedDefinition);
})();
(function(undefined) {

    // The default loader is responsible for two things:
    // 1. Maintaining the default in-memory registry of component configuration objects
    //    (i.e., the thing you're writing to when you call ko.components.register(someName, ...))
    // 2. Answering requests for components by fetching configuration objects
    //    from that default in-memory registry and resolving them into standard
    //    component definition objects (of the form { createViewModel: ..., template: ... })
    // Custom loaders may override either of these facilities, i.e.,
    // 1. To supply configuration objects from some other source (e.g., conventions)
    // 2. Or, to resolve configuration objects by loading viewmodels/templates via arbitrary logic.

    var defaultConfigRegistry = {};

    ko.components.register = function(componentName, config) {
        if (!config) {
            throw new Error('Invalid configuration for ' + componentName);
        }

        if (ko.components.isRegistered(componentName)) {
            throw new Error('Component ' + componentName + ' is already registered');
        }

        defaultConfigRegistry[componentName] = config;
    }

    ko.components.isRegistered = function(componentName) {
        return componentName in defaultConfigRegistry;
    }

    ko.components.unregister = function(componentName) {
        delete defaultConfigRegistry[componentName];
        ko.components.clearCachedDefinition(componentName);
    }

    ko.components.defaultLoader = {
        'getConfig': function(componentName, callback) {
            var result = defaultConfigRegistry.hasOwnProperty(componentName)
                ? defaultConfigRegistry[componentName]
                : null;
            callback(result);
        },

        'loadComponent': function(componentName, config, callback) {
            var errorCallback = makeErrorCallback(componentName);
            possiblyGetConfigFromAmd(errorCallback, config, function(loadedConfig) {
                resolveConfig(componentName, errorCallback, loadedConfig, callback);
            });
        },

        'loadTemplate': function(componentName, templateConfig, callback) {
            resolveTemplate(makeErrorCallback(componentName), templateConfig, callback);
        },

        'loadViewModel': function(componentName, viewModelConfig, callback) {
            resolveViewModel(makeErrorCallback(componentName), viewModelConfig, callback);
        }
    };

    var createViewModelKey = 'createViewModel';

    // Takes a config object of the form { template: ..., viewModel: ... }, and asynchronously convert it
    // into the standard component definition format:
    //    { template: <ArrayOfDomNodes>, createViewModel: function(params, componentInfo) { ... } }.
    // Since both template and viewModel may need to be resolved asynchronously, both tasks are performed
    // in parallel, and the results joined when both are ready. We don't depend on any promises infrastructure,
    // so this is implemented manually below.
    function resolveConfig(componentName, errorCallback, config, callback) {
        var result = {},
            makeCallBackWhenZero = 2,
            tryIssueCallback = function() {
                if (--makeCallBackWhenZero === 0) {
                    callback(result);
                }
            },
            templateConfig = config['template'],
            viewModelConfig = config['viewModel'];

        if (templateConfig) {
            possiblyGetConfigFromAmd(errorCallback, templateConfig, function(loadedConfig) {
                ko.components._getFirstResultFromLoaders('loadTemplate', [componentName, loadedConfig], function(resolvedTemplate) {
                    result['template'] = resolvedTemplate;
                    tryIssueCallback();
                });
            });
        } else {
            tryIssueCallback();
        }

        if (viewModelConfig) {
            possiblyGetConfigFromAmd(errorCallback, viewModelConfig, function(loadedConfig) {
                ko.components._getFirstResultFromLoaders('loadViewModel', [componentName, loadedConfig], function(resolvedViewModel) {
                    result[createViewModelKey] = resolvedViewModel;
                    tryIssueCallback();
                });
            });
        } else {
            tryIssueCallback();
        }
    }

    function resolveTemplate(errorCallback, templateConfig, callback) {
        if (typeof templateConfig === 'string') {
            // Markup - parse it
            callback(ko.utils.parseHtmlFragment(templateConfig));
        } else if (templateConfig instanceof Array) {
            // Assume already an array of DOM nodes - pass through unchanged
            callback(templateConfig);
        } else if (isDocumentFragment(templateConfig)) {
            // Document fragment - use its child nodes
            callback(ko.utils.makeArray(templateConfig.childNodes));
        } else if (templateConfig['element']) {
            var element = templateConfig['element'];
            if (isDomElement(element)) {
                // Element instance - copy its child nodes
                callback(cloneNodesFromTemplateSourceElement(element));
            } else if (typeof element === 'string') {
                // Element ID - find it, then copy its child nodes
                var elemInstance = document.getElementById(element);
                if (elemInstance) {
                    callback(cloneNodesFromTemplateSourceElement(elemInstance));
                } else {
                    errorCallback('Cannot find element with ID ' + element);
                }
            } else {
                errorCallback('Unknown element type: ' + element);
            }
        } else {
            errorCallback('Unknown template value: ' + templateConfig);
        }
    }

    function resolveViewModel(errorCallback, viewModelConfig, callback) {
        if (typeof viewModelConfig === 'function') {
            // Constructor - convert to standard factory function format
            // By design, this does *not* supply componentInfo to the constructor, as the intent is that
            // componentInfo contains non-viewmodel data (e.g., the component's element) that should only
            // be used in factory functions, not viewmodel constructors.
            callback(function (params /*, componentInfo */) {
                return new viewModelConfig(params);
            });
        } else if (typeof viewModelConfig[createViewModelKey] === 'function') {
            // Already a factory function - use it as-is
            callback(viewModelConfig[createViewModelKey]);
        } else if ('instance' in viewModelConfig) {
            // Fixed object instance - promote to createViewModel format for API consistency
            var fixedInstance = viewModelConfig['instance'];
            callback(function (params, componentInfo) {
                return fixedInstance;
            });
        } else if ('viewModel' in viewModelConfig) {
            // Resolved AMD module whose value is of the form { viewModel: ... }
            resolveViewModel(errorCallback, viewModelConfig['viewModel'], callback);
        } else {
            errorCallback('Unknown viewModel value: ' + viewModelConfig);
        }
    }

    function cloneNodesFromTemplateSourceElement(elemInstance) {
        switch (ko.utils.tagNameLower(elemInstance)) {
            case 'script':
                return ko.utils.parseHtmlFragment(elemInstance.text);
            case 'textarea':
                return ko.utils.parseHtmlFragment(elemInstance.value);
            case 'template':
                // For browsers with proper <template> element support (i.e., where the .content property
                // gives a document fragment), use that document fragment.
                if (isDocumentFragment(elemInstance.content)) {
                    return ko.utils.cloneNodes(elemInstance.content.childNodes);
                }
        }

        // Regular elements such as <div>, and <template> elements on old browsers that don't really
        // understand <template> and just treat it as a regular container
        return ko.utils.cloneNodes(elemInstance.childNodes);
    }

    function isDomElement(obj) {
        if (window['HTMLElement']) {
            return obj instanceof HTMLElement;
        } else {
            return obj && obj.tagName && obj.nodeType === 1;
        }
    }

    function isDocumentFragment(obj) {
        if (window['DocumentFragment']) {
            return obj instanceof DocumentFragment;
        } else {
            return obj && obj.nodeType === 11;
        }
    }

    function possiblyGetConfigFromAmd(errorCallback, config, callback) {
        if (typeof config['require'] === 'string') {
            // The config is the value of an AMD module
            if (require || window['require']) {
                (require || window['require'])([config['require']], callback);
            } else {
                errorCallback('Uses require, but no AMD loader is present');
            }
        } else {
            callback(config);
        }
    }

    function makeErrorCallback(componentName) {
        return function (message) {
            throw new Error('Component \'' + componentName + '\': ' + message);
        };
    }

    ko.exportSymbol('components.register', ko.components.register);
    ko.exportSymbol('components.isRegistered', ko.components.isRegistered);
    ko.exportSymbol('components.unregister', ko.components.unregister);

    // Expose the default loader so that developers can directly ask it for configuration
    // or to resolve configuration
    ko.exportSymbol('components.defaultLoader', ko.components.defaultLoader);

    // By default, the default loader is the only registered component loader
    ko.components['loaders'].push(ko.components.defaultLoader);

    // Privately expose the underlying config registry for use in old-IE shim
    ko.components._allRegisteredComponents = defaultConfigRegistry;
})();
(function (undefined) {
    // Overridable API for determining which component name applies to a given node. By overriding this,
    // you can for example map specific tagNames to components that are not preregistered.
    ko.components['getComponentNameForNode'] = function(node) {
        var tagNameLower = ko.utils.tagNameLower(node);
        return ko.components.isRegistered(tagNameLower) && tagNameLower;
    };

    ko.components.addBindingsForCustomElement = function(allBindings, node, bindingContext, valueAccessors) {
        // Determine if it's really a custom element matching a component
        if (node.nodeType === 1) {
            var componentName = ko.components['getComponentNameForNode'](node);
            if (componentName) {
                // It does represent a component, so add a component binding for it
                allBindings = allBindings || {};

                if (allBindings['component']) {
                    // Avoid silently overwriting some other 'component' binding that may already be on the element
                    throw new Error('Cannot use the "component" binding on a custom element matching a component');
                }

                var componentBindingValue = { 'name': componentName, 'params': getComponentParamsFromCustomElement(node, bindingContext) };

                allBindings['component'] = valueAccessors
                    ? function() { return componentBindingValue; }
                    : componentBindingValue;
            }
        }

        return allBindings;
    }

    var nativeBindingProviderInstance = new ko.bindingProvider();

    function getComponentParamsFromCustomElement(elem, bindingContext) {
        var paramsAttribute = elem.getAttribute('params');

        if (paramsAttribute) {
            var params = nativeBindingProviderInstance['parseBindingsString'](paramsAttribute, bindingContext, elem, { 'valueAccessors': true, 'bindingParams': true }),
                rawParamComputedValues = ko.utils.objectMap(params, function(paramValue, paramName) {
                    return ko.computed(paramValue, null, { disposeWhenNodeIsRemoved: elem });
                }),
                result = ko.utils.objectMap(rawParamComputedValues, function(paramValueComputed, paramName) {
                    // Does the evaluation of the parameter value unwrap any observables?
                    if (!paramValueComputed.isActive()) {
                        // No it doesn't, so there's no need for any computed wrapper. Just pass through the supplied value directly.
                        // Example: "someVal: firstName, age: 123" (whether or not firstName is an observable/computed)
                        return paramValueComputed.peek();
                    } else {
                        // Yes it does. Supply a computed property that unwraps both the outer (binding expression)
                        // level of observability, and any inner (resulting model value) level of observability.
                        // This means the component doesn't have to worry about multiple unwrapping.
                        return ko.computed(function() {
                            return ko.utils.unwrapObservable(paramValueComputed());
                        }, null, { disposeWhenNodeIsRemoved: elem });
                    }
                });

            // Give access to the raw computeds, as long as that wouldn't overwrite any custom param also called '$raw'
            // This is in case the developer wants to react to outer (binding) observability separately from inner
            // (model value) observability, or in case the model value observable has subobservables.
            if (!result.hasOwnProperty('$raw')) {
                result['$raw'] = rawParamComputedValues;
            }

            return result;
        } else {
            // For consistency, absence of a "params" attribute is treated the same as the presence of
            // any empty one. Otherwise component viewmodels need special code to check whether or not
            // 'params' or 'params.$raw' is null/undefined before reading subproperties, which is annoying.
            return { '$raw': {} };
        }
    }

    // --------------------------------------------------------------------------------
    // Compatibility code for older (pre-HTML5) IE browsers

    if (ko.utils.ieVersion < 9) {
        // Whenever you preregister a component, enable it as a custom element in the current document
        ko.components['register'] = (function(originalFunction) {
            return function(componentName) {
                document.createElement(componentName); // Allows IE<9 to parse markup containing the custom element
                return originalFunction.apply(this, arguments);
            }
        })(ko.components['register']);

        // Whenever you create a document fragment, enable all preregistered component names as custom elements
        // This is needed to make innerShiv/jQuery HTML parsing correctly handle the custom elements
        document.createDocumentFragment = (function(originalFunction) {
            return function() {
                var newDocFrag = originalFunction(),
                    allComponents = ko.components._allRegisteredComponents;
                for (var componentName in allComponents) {
                    if (allComponents.hasOwnProperty(componentName)) {
                        newDocFrag.createElement(componentName);
                    }
                }
                return newDocFrag;
            };
        })(document.createDocumentFragment);
    }
})();(function(undefined) {

    var componentLoadingOperationUniqueId = 0;

    ko.bindingHandlers['component'] = {
        'init': function(element, valueAccessor, ignored1, ignored2, bindingContext) {
            var currentViewModel,
                currentLoadingOperationId,
                disposeAssociatedComponentViewModel = function () {
                    var currentViewModelDispose = currentViewModel && currentViewModel['dispose'];
                    if (typeof currentViewModelDispose === 'function') {
                        currentViewModelDispose.call(currentViewModel);
                    }

                    // Any in-flight loading operation is no longer relevant, so make sure we ignore its completion
                    currentLoadingOperationId = null;
                };

            ko.utils.domNodeDisposal.addDisposeCallback(element, disposeAssociatedComponentViewModel);

            ko.computed(function () {
                var value = ko.utils.unwrapObservable(valueAccessor()),
                    componentName, componentParams;

                if (typeof value === 'string') {
                    componentName = value;
                } else {
                    componentName = ko.utils.unwrapObservable(value['name']);
                    componentParams = ko.utils.unwrapObservable(value['params']);
                }

                if (!componentName) {
                    throw new Error('No component name specified');
                }

                var loadingOperationId = currentLoadingOperationId = ++componentLoadingOperationUniqueId;
                ko.components.get(componentName, function(componentDefinition) {
                    // If this is not the current load operation for this element, ignore it.
                    if (currentLoadingOperationId !== loadingOperationId) {
                        return;
                    }

                    // Clean up previous state
                    disposeAssociatedComponentViewModel();

                    // Instantiate and bind new component. Implicitly this cleans any old DOM nodes.
                    if (!componentDefinition) {
                        throw new Error('Unknown component \'' + componentName + '\'');
                    }
                    cloneTemplateIntoElement(componentName, componentDefinition, element);
                    var componentViewModel = createViewModel(componentDefinition, element, componentParams),
                        childBindingContext = bindingContext['createChildContext'](componentViewModel);
                    currentViewModel = componentViewModel;
                    ko.applyBindingsToDescendants(childBindingContext, element);
                });
            }, null, { disposeWhenNodeIsRemoved: element });

            return { 'controlsDescendantBindings': true };
        }
    };

    ko.virtualElements.allowedBindings['component'] = true;

    function cloneTemplateIntoElement(componentName, componentDefinition, element) {
        var template = componentDefinition['template'];
        if (!template) {
            throw new Error('Component \'' + componentName + '\' has no template');
        }

        var clonedNodesArray = ko.utils.cloneNodes(template);
        ko.virtualElements.setDomNodeChildren(element, clonedNodesArray);
    }

    function createViewModel(componentDefinition, element, componentParams) {
        var componentViewModelFactory = componentDefinition['createViewModel'];
        return componentViewModelFactory
            ? componentViewModelFactory.call(componentDefinition, componentParams, { element: element })
            : componentParams; // Template-only component
    }

})();
var attrHtmlToJavascriptMap = { 'class': 'className', 'for': 'htmlFor' };
ko.bindingHandlers['attr'] = {
    'update': function(element, valueAccessor, allBindings) {
        var value = ko.utils.unwrapObservable(valueAccessor()) || {};
        ko.utils.objectForEach(value, function(attrName, attrValue) {
            attrValue = ko.utils.unwrapObservable(attrValue);

            // To cover cases like "attr: { checked:someProp }", we want to remove the attribute entirely
            // when someProp is a "no value"-like value (strictly null, false, or undefined)
            // (because the absence of the "checked" attr is how to mark an element as not checked, etc.)
            var toRemove = (attrValue === false) || (attrValue === null) || (attrValue === undefined);
            if (toRemove)
                element.removeAttribute(attrName);

            // In IE <= 7 and IE8 Quirks Mode, you have to use the Javascript property name instead of the
            // HTML attribute name for certain attributes. IE8 Standards Mode supports the correct behavior,
            // but instead of figuring out the mode, we'll just set the attribute through the Javascript
            // property for IE <= 8.
            if (ko.utils.ieVersion <= 8 && attrName in attrHtmlToJavascriptMap) {
                attrName = attrHtmlToJavascriptMap[attrName];
                if (toRemove)
                    element.removeAttribute(attrName);
                else
                    element[attrName] = attrValue;
            } else if (!toRemove) {
                element.setAttribute(attrName, attrValue.toString());
            }

            // Treat "name" specially - although you can think of it as an attribute, it also needs
            // special handling on older versions of IE (https://github.com/SteveSanderson/knockout/pull/333)
            // Deliberately being case-sensitive here because XHTML would regard "Name" as a different thing
            // entirely, and there's no strong reason to allow for such casing in HTML.
            if (attrName === "name") {
                ko.utils.setElementName(element, toRemove ? "" : attrValue.toString());
            }
        });
    }
};
(function() {

ko.bindingHandlers['checked'] = {
    'after': ['value', 'attr'],
    'init': function (element, valueAccessor, allBindings) {
        var checkedValue = ko.pureComputed(function() {
            // Treat "value" like "checkedValue" when it is included with "checked" binding
            if (allBindings['has']('checkedValue')) {
                return ko.utils.unwrapObservable(allBindings.get('checkedValue'));
            } else if (allBindings['has']('value')) {
                return ko.utils.unwrapObservable(allBindings.get('value'));
            }

            return element.value;
        });

        function updateModel() {
            // This updates the model value from the view value.
            // It runs in response to DOM events (click) and changes in checkedValue.
            var isChecked = element.checked,
                elemValue = useCheckedValue ? checkedValue() : isChecked;

            // When we're first setting up this computed, don't change any model state.
            if (ko.computedContext.isInitial()) {
                return;
            }

            // We can ignore unchecked radio buttons, because some other radio
            // button will be getting checked, and that one can take care of updating state.
            if (isRadio && !isChecked) {
                return;
            }

            var modelValue = ko.dependencyDetection.ignore(valueAccessor);
            if (isValueArray) {
                if (oldElemValue !== elemValue) {
                    // When we're responding to the checkedValue changing, and the element is
                    // currently checked, replace the old elem value with the new elem value
                    // in the model array.
                    if (isChecked) {
                        ko.utils.addOrRemoveItem(modelValue, elemValue, true);
                        ko.utils.addOrRemoveItem(modelValue, oldElemValue, false);
                    }

                    oldElemValue = elemValue;
                } else {
                    // When we're responding to the user having checked/unchecked a checkbox,
                    // add/remove the element value to the model array.
                    ko.utils.addOrRemoveItem(modelValue, elemValue, isChecked);
                }
            } else {
                ko.expressionRewriting.writeValueToProperty(modelValue, allBindings, 'checked', elemValue, true);
            }
        };

        function updateView() {
            // This updates the view value from the model value.
            // It runs in response to changes in the bound (checked) value.
            var modelValue = ko.utils.unwrapObservable(valueAccessor());

            if (isValueArray) {
                // When a checkbox is bound to an array, being checked represents its value being present in that array
                element.checked = ko.utils.arrayIndexOf(modelValue, checkedValue()) >= 0;
            } else if (isCheckbox) {
                // When a checkbox is bound to any other value (not an array), being checked represents the value being trueish
                element.checked = modelValue;
            } else {
                // For radio buttons, being checked means that the radio button's value corresponds to the model value
                element.checked = (checkedValue() === modelValue);
            }
        };

        var isCheckbox = element.type == "checkbox",
            isRadio = element.type == "radio";

        // Only bind to check boxes and radio buttons
        if (!isCheckbox && !isRadio) {
            return;
        }

        var isValueArray = isCheckbox && (ko.utils.unwrapObservable(valueAccessor()) instanceof Array),
            oldElemValue = isValueArray ? checkedValue() : undefined,
            useCheckedValue = isRadio || isValueArray;

        // IE 6 won't allow radio buttons to be selected unless they have a name
        if (isRadio && !element.name)
            ko.bindingHandlers['uniqueName']['init'](element, function() { return true });

        // Set up two computeds to update the binding:

        // The first responds to changes in the checkedValue value and to element clicks
        ko.computed(updateModel, null, { disposeWhenNodeIsRemoved: element });
        ko.utils.registerEventHandler(element, "click", updateModel);

        // The second responds to changes in the model value (the one associated with the checked binding)
        ko.computed(updateView, null, { disposeWhenNodeIsRemoved: element });
    }
};
ko.expressionRewriting.twoWayBindings['checked'] = true;

ko.bindingHandlers['checkedValue'] = {
    'update': function (element, valueAccessor) {
        element.value = ko.utils.unwrapObservable(valueAccessor());
    }
};

})();var classesWrittenByBindingKey = '__ko__cssValue';
ko.bindingHandlers['css'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (typeof value == "object") {
            ko.utils.objectForEach(value, function(className, shouldHaveClass) {
                shouldHaveClass = ko.utils.unwrapObservable(shouldHaveClass);
                ko.utils.toggleDomNodeCssClass(element, className, shouldHaveClass);
            });
        } else {
            value = String(value || ''); // Make sure we don't try to store or set a non-string value
            ko.utils.toggleDomNodeCssClass(element, element[classesWrittenByBindingKey], false);
            element[classesWrittenByBindingKey] = value;
            ko.utils.toggleDomNodeCssClass(element, value, true);
        }
    }
};
ko.bindingHandlers['enable'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (value && element.disabled)
            element.removeAttribute("disabled");
        else if ((!value) && (!element.disabled))
            element.disabled = true;
    }
};

ko.bindingHandlers['disable'] = {
    'update': function (element, valueAccessor) {
        ko.bindingHandlers['enable']['update'](element, function() { return !ko.utils.unwrapObservable(valueAccessor()) });
    }
};
// For certain common events (currently just 'click'), allow a simplified data-binding syntax
// e.g. click:handler instead of the usual full-length event:{click:handler}
function makeEventHandlerShortcut(eventName) {
    ko.bindingHandlers[eventName] = {
        'init': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var newValueAccessor = function () {
                var result = {};
                result[eventName] = valueAccessor();
                return result;
            };
            return ko.bindingHandlers['event']['init'].call(this, element, newValueAccessor, allBindings, viewModel, bindingContext);
        }
    }
}

ko.bindingHandlers['event'] = {
    'init' : function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var eventsToHandle = valueAccessor() || {};
        ko.utils.objectForEach(eventsToHandle, function(eventName) {
            if (typeof eventName == "string") {
                ko.utils.registerEventHandler(element, eventName, function (event) {
                    var handlerReturnValue;
                    var handlerFunction = valueAccessor()[eventName];
                    if (!handlerFunction)
                        return;

                    try {
                        // Take all the event args, and prefix with the viewmodel
                        var argsForHandler = ko.utils.makeArray(arguments);
                        viewModel = bindingContext['$data'];
                        argsForHandler.unshift(viewModel);
                        handlerReturnValue = handlerFunction.apply(viewModel, argsForHandler);
                    } finally {
                        if (handlerReturnValue !== true) { // Normally we want to prevent default action. Developer can override this be explicitly returning true.
                            if (event.preventDefault)
                                event.preventDefault();
                            else
                                event.returnValue = false;
                        }
                    }

                    var bubble = allBindings.get(eventName + 'Bubble') !== false;
                    if (!bubble) {
                        event.cancelBubble = true;
                        if (event.stopPropagation)
                            event.stopPropagation();
                    }
                });
            }
        });
    }
};
// "foreach: someExpression" is equivalent to "template: { foreach: someExpression }"
// "foreach: { data: someExpression, afterAdd: myfn }" is equivalent to "template: { foreach: someExpression, afterAdd: myfn }"
ko.bindingHandlers['foreach'] = {
    makeTemplateValueAccessor: function(valueAccessor) {
        return function() {
            var modelValue = valueAccessor(),
                unwrappedValue = ko.utils.peekObservable(modelValue);    // Unwrap without setting a dependency here

            // If unwrappedValue is the array, pass in the wrapped value on its own
            // The value will be unwrapped and tracked within the template binding
            // (See https://github.com/SteveSanderson/knockout/issues/523)
            if ((!unwrappedValue) || typeof unwrappedValue.length == "number")
                return { 'foreach': modelValue, 'templateEngine': ko.nativeTemplateEngine.instance };

            // If unwrappedValue.data is the array, preserve all relevant options and unwrap again value so we get updates
            ko.utils.unwrapObservable(modelValue);
            return {
                'foreach': unwrappedValue['data'],
                'as': unwrappedValue['as'],
                'includeDestroyed': unwrappedValue['includeDestroyed'],
                'afterAdd': unwrappedValue['afterAdd'],
                'beforeRemove': unwrappedValue['beforeRemove'],
                'afterRender': unwrappedValue['afterRender'],
                'beforeMove': unwrappedValue['beforeMove'],
                'afterMove': unwrappedValue['afterMove'],
                'templateEngine': ko.nativeTemplateEngine.instance
            };
        };
    },
    'init': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor));
    },
    'update': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor), allBindings, viewModel, bindingContext);
    }
};
ko.expressionRewriting.bindingRewriteValidators['foreach'] = false; // Can't rewrite control flow bindings
ko.virtualElements.allowedBindings['foreach'] = true;
var hasfocusUpdatingProperty = '__ko_hasfocusUpdating';
var hasfocusLastValue = '__ko_hasfocusLastValue';
ko.bindingHandlers['hasfocus'] = {
    'init': function(element, valueAccessor, allBindings) {
        var handleElementFocusChange = function(isFocused) {
            // Where possible, ignore which event was raised and determine focus state using activeElement,
            // as this avoids phantom focus/blur events raised when changing tabs in modern browsers.
            // However, not all KO-targeted browsers (Firefox 2) support activeElement. For those browsers,
            // prevent a loss of focus when changing tabs/windows by setting a flag that prevents hasfocus
            // from calling 'blur()' on the element when it loses focus.
            // Discussion at https://github.com/SteveSanderson/knockout/pull/352
            element[hasfocusUpdatingProperty] = true;
            var ownerDoc = element.ownerDocument;
            if ("activeElement" in ownerDoc) {
                var active;
                try {
                    active = ownerDoc.activeElement;
                } catch(e) {
                    // IE9 throws if you access activeElement during page load (see issue #703)
                    active = ownerDoc.body;
                }
                isFocused = (active === element);
            }
            var modelValue = valueAccessor();
            ko.expressionRewriting.writeValueToProperty(modelValue, allBindings, 'hasfocus', isFocused, true);

            //cache the latest value, so we can avoid unnecessarily calling focus/blur in the update function
            element[hasfocusLastValue] = isFocused;
            element[hasfocusUpdatingProperty] = false;
        };
        var handleElementFocusIn = handleElementFocusChange.bind(null, true);
        var handleElementFocusOut = handleElementFocusChange.bind(null, false);

        ko.utils.registerEventHandler(element, "focus", handleElementFocusIn);
        ko.utils.registerEventHandler(element, "focusin", handleElementFocusIn); // For IE
        ko.utils.registerEventHandler(element, "blur",  handleElementFocusOut);
        ko.utils.registerEventHandler(element, "focusout",  handleElementFocusOut); // For IE
    },
    'update': function(element, valueAccessor) {
        var value = !!ko.utils.unwrapObservable(valueAccessor()); //force boolean to compare with last value
        if (!element[hasfocusUpdatingProperty] && element[hasfocusLastValue] !== value) {
            value ? element.focus() : element.blur();
            ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, value ? "focusin" : "focusout"]); // For IE, which doesn't reliably fire "focus" or "blur" events synchronously
        }
    }
};
ko.expressionRewriting.twoWayBindings['hasfocus'] = true;

ko.bindingHandlers['hasFocus'] = ko.bindingHandlers['hasfocus']; // Make "hasFocus" an alias
ko.expressionRewriting.twoWayBindings['hasFocus'] = true;
ko.bindingHandlers['html'] = {
    'init': function() {
        // Prevent binding on the dynamically-injected HTML (as developers are unlikely to expect that, and it has security implications)
        return { 'controlsDescendantBindings': true };
    },
    'update': function (element, valueAccessor) {
        // setHtml will unwrap the value if needed
        ko.utils.setHtml(element, valueAccessor());
    }
};
// Makes a binding like with or if
function makeWithIfBinding(bindingKey, isWith, isNot, makeContextCallback) {
    ko.bindingHandlers[bindingKey] = {
        'init': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var didDisplayOnLastUpdate,
                savedNodes;
            ko.computed(function() {
                var dataValue = ko.utils.unwrapObservable(valueAccessor()),
                    shouldDisplay = !isNot !== !dataValue, // equivalent to isNot ? !dataValue : !!dataValue
                    isFirstRender = !savedNodes,
                    needsRefresh = isFirstRender || isWith || (shouldDisplay !== didDisplayOnLastUpdate);

                if (needsRefresh) {
                    // Save a copy of the inner nodes on the initial update, but only if we have dependencies.
                    if (isFirstRender && ko.computedContext.getDependenciesCount()) {
                        savedNodes = ko.utils.cloneNodes(ko.virtualElements.childNodes(element), true /* shouldCleanNodes */);
                    }

                    if (shouldDisplay) {
                        if (!isFirstRender) {
                            ko.virtualElements.setDomNodeChildren(element, ko.utils.cloneNodes(savedNodes));
                        }
                        ko.applyBindingsToDescendants(makeContextCallback ? makeContextCallback(bindingContext, dataValue) : bindingContext, element);
                    } else {
                        ko.virtualElements.emptyNode(element);
                    }

                    didDisplayOnLastUpdate = shouldDisplay;
                }
            }, null, { disposeWhenNodeIsRemoved: element });
            return { 'controlsDescendantBindings': true };
        }
    };
    ko.expressionRewriting.bindingRewriteValidators[bindingKey] = false; // Can't rewrite control flow bindings
    ko.virtualElements.allowedBindings[bindingKey] = true;
}

// Construct the actual binding handlers
makeWithIfBinding('if');
makeWithIfBinding('ifnot', false /* isWith */, true /* isNot */);
makeWithIfBinding('with', true /* isWith */, false /* isNot */,
    function(bindingContext, dataValue) {
        return bindingContext['createChildContext'](dataValue);
    }
);
var captionPlaceholder = {};
ko.bindingHandlers['options'] = {
    'init': function(element) {
        if (ko.utils.tagNameLower(element) !== "select")
            throw new Error("options binding applies only to SELECT elements");

        // Remove all existing <option>s.
        while (element.length > 0) {
            element.remove(0);
        }

        // Ensures that the binding processor doesn't try to bind the options
        return { 'controlsDescendantBindings': true };
    },
    'update': function (element, valueAccessor, allBindings) {
        function selectedOptions() {
            return ko.utils.arrayFilter(element.options, function (node) { return node.selected; });
        }

        var selectWasPreviouslyEmpty = element.length == 0;
        var previousScrollTop = (!selectWasPreviouslyEmpty && element.multiple) ? element.scrollTop : null;
        var unwrappedArray = ko.utils.unwrapObservable(valueAccessor());
        var includeDestroyed = allBindings.get('optionsIncludeDestroyed');
        var arrayToDomNodeChildrenOptions = {};
        var captionValue;
        var filteredArray;
        var previousSelectedValues;

        if (element.multiple) {
            previousSelectedValues = ko.utils.arrayMap(selectedOptions(), ko.selectExtensions.readValue);
        } else {
            previousSelectedValues = element.selectedIndex >= 0 ? [ ko.selectExtensions.readValue(element.options[element.selectedIndex]) ] : [];
        }

        if (unwrappedArray) {
            if (typeof unwrappedArray.length == "undefined") // Coerce single value into array
                unwrappedArray = [unwrappedArray];

            // Filter out any entries marked as destroyed
            filteredArray = ko.utils.arrayFilter(unwrappedArray, function(item) {
                return includeDestroyed || item === undefined || item === null || !ko.utils.unwrapObservable(item['_destroy']);
            });

            // If caption is included, add it to the array
            if (allBindings['has']('optionsCaption')) {
                captionValue = ko.utils.unwrapObservable(allBindings.get('optionsCaption'));
                // If caption value is null or undefined, don't show a caption
                if (captionValue !== null && captionValue !== undefined) {
                    filteredArray.unshift(captionPlaceholder);
                }
            }
        } else {
            // If a falsy value is provided (e.g. null), we'll simply empty the select element
        }

        function applyToObject(object, predicate, defaultValue) {
            var predicateType = typeof predicate;
            if (predicateType == "function")    // Given a function; run it against the data value
                return predicate(object);
            else if (predicateType == "string") // Given a string; treat it as a property name on the data value
                return object[predicate];
            else                                // Given no optionsText arg; use the data value itself
                return defaultValue;
        }

        // The following functions can run at two different times:
        // The first is when the whole array is being updated directly from this binding handler.
        // The second is when an observable value for a specific array entry is updated.
        // oldOptions will be empty in the first case, but will be filled with the previously generated option in the second.
        var itemUpdate = false;
        function optionForArrayItem(arrayEntry, index, oldOptions) {
            if (oldOptions.length) {
                previousSelectedValues = oldOptions[0].selected ? [ ko.selectExtensions.readValue(oldOptions[0]) ] : [];
                itemUpdate = true;
            }
            var option = element.ownerDocument.createElement("option");
            if (arrayEntry === captionPlaceholder) {
                ko.utils.setTextContent(option, allBindings.get('optionsCaption'));
                ko.selectExtensions.writeValue(option, undefined);
            } else {
                // Apply a value to the option element
                var optionValue = applyToObject(arrayEntry, allBindings.get('optionsValue'), arrayEntry);
                ko.selectExtensions.writeValue(option, ko.utils.unwrapObservable(optionValue));

                // Apply some text to the option element
                var optionText = applyToObject(arrayEntry, allBindings.get('optionsText'), optionValue);
                ko.utils.setTextContent(option, optionText);
            }
            return [option];
        }

        // By using a beforeRemove callback, we delay the removal until after new items are added. This fixes a selection
        // problem in IE<=8 and Firefox. See https://github.com/knockout/knockout/issues/1208
        arrayToDomNodeChildrenOptions['beforeRemove'] =
            function (option) {
                element.removeChild(option);
            };

        function setSelectionCallback(arrayEntry, newOptions) {
            // IE6 doesn't like us to assign selection to OPTION nodes before they're added to the document.
            // That's why we first added them without selection. Now it's time to set the selection.
            if (previousSelectedValues.length) {
                var isSelected = ko.utils.arrayIndexOf(previousSelectedValues, ko.selectExtensions.readValue(newOptions[0])) >= 0;
                ko.utils.setOptionNodeSelectionState(newOptions[0], isSelected);

                // If this option was changed from being selected during a single-item update, notify the change
                if (itemUpdate && !isSelected)
                    ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, "change"]);
            }
        }

        var callback = setSelectionCallback;
        if (allBindings['has']('optionsAfterRender')) {
            callback = function(arrayEntry, newOptions) {
                setSelectionCallback(arrayEntry, newOptions);
                ko.dependencyDetection.ignore(allBindings.get('optionsAfterRender'), null, [newOptions[0], arrayEntry !== captionPlaceholder ? arrayEntry : undefined]);
            }
        }

        ko.utils.setDomNodeChildrenFromArrayMapping(element, filteredArray, optionForArrayItem, arrayToDomNodeChildrenOptions, callback);

        ko.dependencyDetection.ignore(function () {
            if (allBindings.get('valueAllowUnset') && allBindings['has']('value')) {
                // The model value is authoritative, so make sure its value is the one selected
                ko.selectExtensions.writeValue(element, ko.utils.unwrapObservable(allBindings.get('value')), true /* allowUnset */);
            } else {
                // Determine if the selection has changed as a result of updating the options list
                var selectionChanged;
                if (element.multiple) {
                    // For a multiple-select box, compare the new selection count to the previous one
                    // But if nothing was selected before, the selection can't have changed
                    selectionChanged = previousSelectedValues.length && selectedOptions().length < previousSelectedValues.length;
                } else {
                    // For a single-select box, compare the current value to the previous value
                    // But if nothing was selected before or nothing is selected now, just look for a change in selection
                    selectionChanged = (previousSelectedValues.length && element.selectedIndex >= 0)
                        ? (ko.selectExtensions.readValue(element.options[element.selectedIndex]) !== previousSelectedValues[0])
                        : (previousSelectedValues.length || element.selectedIndex >= 0);
                }

                // Ensure consistency between model value and selected option.
                // If the dropdown was changed so that selection is no longer the same,
                // notify the value or selectedOptions binding.
                if (selectionChanged) {
                    ko.utils.triggerEvent(element, "change");
                }
            }
        });

        // Workaround for IE bug
        ko.utils.ensureSelectElementIsRenderedCorrectly(element);

        if (previousScrollTop && Math.abs(previousScrollTop - element.scrollTop) > 20)
            element.scrollTop = previousScrollTop;
    }
};
ko.bindingHandlers['options'].optionValueDomDataKey = ko.utils.domData.nextKey();
ko.bindingHandlers['selectedOptions'] = {
    'after': ['options', 'foreach'],
    'init': function (element, valueAccessor, allBindings) {
        ko.utils.registerEventHandler(element, "change", function () {
            var value = valueAccessor(), valueToWrite = [];
            ko.utils.arrayForEach(element.getElementsByTagName("option"), function(node) {
                if (node.selected)
                    valueToWrite.push(ko.selectExtensions.readValue(node));
            });
            ko.expressionRewriting.writeValueToProperty(value, allBindings, 'selectedOptions', valueToWrite);
        });
    },
    'update': function (element, valueAccessor) {
        if (ko.utils.tagNameLower(element) != "select")
            throw new Error("values binding applies only to SELECT elements");

        var newValue = ko.utils.unwrapObservable(valueAccessor());
        if (newValue && typeof newValue.length == "number") {
            ko.utils.arrayForEach(element.getElementsByTagName("option"), function(node) {
                var isSelected = ko.utils.arrayIndexOf(newValue, ko.selectExtensions.readValue(node)) >= 0;
                ko.utils.setOptionNodeSelectionState(node, isSelected);
            });
        }
    }
};
ko.expressionRewriting.twoWayBindings['selectedOptions'] = true;
ko.bindingHandlers['style'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor() || {});
        ko.utils.objectForEach(value, function(styleName, styleValue) {
            styleValue = ko.utils.unwrapObservable(styleValue);

            if (styleValue === null || styleValue === undefined || styleValue === false) {
                // Empty string removes the value, whereas null/undefined have no effect
                styleValue = "";
            }

            element.style[styleName] = styleValue;
        });
    }
};
ko.bindingHandlers['submit'] = {
    'init': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        if (typeof valueAccessor() != "function")
            throw new Error("The value for a submit binding must be a function");
        ko.utils.registerEventHandler(element, "submit", function (event) {
            var handlerReturnValue;
            var value = valueAccessor();
            try { handlerReturnValue = value.call(bindingContext['$data'], element); }
            finally {
                if (handlerReturnValue !== true) { // Normally we want to prevent default action. Developer can override this be explicitly returning true.
                    if (event.preventDefault)
                        event.preventDefault();
                    else
                        event.returnValue = false;
                }
            }
        });
    }
};
ko.bindingHandlers['text'] = {
    'init': function() {
        // Prevent binding on the dynamically-injected text node (as developers are unlikely to expect that, and it has security implications).
        // It should also make things faster, as we no longer have to consider whether the text node might be bindable.
        return { 'controlsDescendantBindings': true };
    },
    'update': function (element, valueAccessor) {
        ko.utils.setTextContent(element, valueAccessor());
    }
};
ko.virtualElements.allowedBindings['text'] = true;
(function () {

if (window && window.navigator) {
    var parseVersion = function (matches) {
        if (matches) {
            return parseFloat(matches[1]);
        }
    };

    // Detect various browser versions because some old versions don't fully support the 'input' event
    var operaVersion = window.opera && window.opera.version && parseInt(window.opera.version()),
        userAgent = window.navigator.userAgent,
        safariVersion = parseVersion(userAgent.match(/^(?:(?!chrome).)*version\/([^ ]*) safari/i)),
        firefoxVersion = parseVersion(userAgent.match(/Firefox\/([^ ]*)/));
}

// IE 8 and 9 have bugs that prevent the normal events from firing when the value changes.
// But it does fire the 'selectionchange' event on many of those, presumably because the
// cursor is moving and that counts as the selection changing. The 'selectionchange' event is
// fired at the document level only and doesn't directly indicate which element changed. We
// set up just one event handler for the document and use 'activeElement' to determine which
// element was changed.
if (ko.utils.ieVersion < 10) {
    var selectionChangeRegisteredName = ko.utils.domData.nextKey(),
        selectionChangeHandlerName = ko.utils.domData.nextKey();
    var selectionChangeHandler = function(event) {
        var target = this.activeElement,
            handler = target && ko.utils.domData.get(target, selectionChangeHandlerName);
        if (handler) {
            handler(event);
        }
    };
    var registerForSelectionChangeEvent = function (element, handler) {
        var ownerDoc = element.ownerDocument;
        if (!ko.utils.domData.get(ownerDoc, selectionChangeRegisteredName)) {
            ko.utils.domData.set(ownerDoc, selectionChangeRegisteredName, true);
            ko.utils.registerEventHandler(ownerDoc, 'selectionchange', selectionChangeHandler);
        }
        ko.utils.domData.set(element, selectionChangeHandlerName, handler);
    };
}

ko.bindingHandlers['textInput'] = {
    'init': function (element, valueAccessor, allBindings) {

        var previousElementValue = element.value,
            timeoutHandle,
            elementValueBeforeEvent;

        var updateModel = function (event) {
            clearTimeout(timeoutHandle);
            elementValueBeforeEvent = timeoutHandle = undefined;

            var elementValue = element.value;
            if (previousElementValue !== elementValue) {
                // Provide a way for tests to know exactly which event was processed
                if (DEBUG && event) element['_ko_textInputProcessedEvent'] = event.type;
                previousElementValue = elementValue;
                ko.expressionRewriting.writeValueToProperty(valueAccessor(), allBindings, 'textInput', elementValue);
            }
        };

        var deferUpdateModel = function (event) {
            if (!timeoutHandle) {
                // The elementValueBeforeEvent variable is set *only* during the brief gap between an
                // event firing and the updateModel function running. This allows us to ignore model
                // updates that are from the previous state of the element, usually due to techniques
                // such as rateLimit. Such updates, if not ignored, can cause keystrokes to be lost.
                elementValueBeforeEvent = element.value;
                var handler = DEBUG ? updateModel.bind(element, {type: event.type}) : updateModel;
                timeoutHandle = setTimeout(handler, 4);
            }
        };

        var updateView = function () {
            var modelValue = ko.utils.unwrapObservable(valueAccessor());

            if (modelValue === null || modelValue === undefined) {
                modelValue = '';
            }

            if (elementValueBeforeEvent !== undefined && modelValue === elementValueBeforeEvent) {
                setTimeout(updateView, 4);
                return;
            }

            // Update the element only if the element and model are different. On some browsers, updating the value
            // will move the cursor to the end of the input, which would be bad while the user is typing.
            if (element.value !== modelValue) {
                previousElementValue = modelValue;  // Make sure we ignore events (propertychange) that result from updating the value
                element.value = modelValue;
            }
        };

        var onEvent = function (event, handler) {
            ko.utils.registerEventHandler(element, event, handler);
        };

        if (DEBUG && ko.bindingHandlers['textInput']['_forceUpdateOn']) {
            // Provide a way for tests to specify exactly which events are bound
            ko.utils.arrayForEach(ko.bindingHandlers['textInput']['_forceUpdateOn'], function(eventName) {
                if (eventName.slice(0,5) == 'after') {
                    onEvent(eventName.slice(5), deferUpdateModel);
                } else {
                    onEvent(eventName, updateModel);
                }
            });
        } else {
            if (ko.utils.ieVersion < 10) {
                // Internet Explorer <= 8 doesn't support the 'input' event, but does include 'propertychange' that fires whenever
                // any property of an element changes. Unlike 'input', it also fires if a property is changed from JavaScript code,
                // but that's an acceptable compromise for this binding. IE 9 does support 'input', but since it doesn't fire it
                // when using autocomplete, we'll use 'propertychange' for it also.
                onEvent('propertychange', function(event) {
                    if (event.propertyName === 'value') {
                        updateModel(event);
                    }
                });

                if (ko.utils.ieVersion == 8) {
                    // IE 8 has a bug where it fails to fire 'propertychange' on the first update following a value change from
                    // JavaScript code. It also doesn't fire if you clear the entire value. To fix this, we bind to the following
                    // events too.
                    onEvent('keyup', updateModel);      // A single keystoke
                    onEvent('keydown', updateModel);    // The first character when a key is held down
                }
                if (ko.utils.ieVersion >= 8) {
                    // Internet Explorer 9 doesn't fire the 'input' event when deleting text, including using
                    // the backspace, delete, or ctrl-x keys, clicking the 'x' to clear the input, dragging text
                    // out of the field, and cutting or deleting text using the context menu. 'selectionchange'
                    // can detect all of those except dragging text out of the field, for which we use 'dragend'.
                    // These are also needed in IE8 because of the bug described above.
                    registerForSelectionChangeEvent(element, updateModel);  // 'selectionchange' covers cut, paste, drop, delete, etc.
                    onEvent('dragend', deferUpdateModel);
                }
            } else {
                // All other supported browsers support the 'input' event, which fires whenever the content of the element is changed
                // through the user interface.
                onEvent('input', updateModel);

                if (safariVersion < 5 && ko.utils.tagNameLower(element) === "textarea") {
                    // Safari <5 doesn't fire the 'input' event for <textarea> elements (it does fire 'textInput'
                    // but only when typing). So we'll just catch as much as we can with keydown, cut, and paste.
                    onEvent('keydown', deferUpdateModel);
                    onEvent('paste', deferUpdateModel);
                    onEvent('cut', deferUpdateModel);
                } else if (operaVersion < 11) {
                    // Opera 10 doesn't always fire the 'input' event for cut, paste, undo & drop operations.
                    // We can try to catch some of those using 'keydown'.
                    onEvent('keydown', deferUpdateModel);
                } else if (firefoxVersion < 4.0) {
                    // Firefox <= 3.6 doesn't fire the 'input' event when text is filled in through autocomplete
                    onEvent('DOMAutoComplete', updateModel);

                    // Firefox <=3.5 doesn't fire the 'input' event when text is dropped into the input.
                    onEvent('dragdrop', updateModel);       // <3.5
                    onEvent('drop', updateModel);           // 3.5
                }
            }
        }

        // Bind to the change event so that we can catch programmatic updates of the value that fire this event.
        onEvent('change', updateModel);

        ko.computed(updateView, null, { disposeWhenNodeIsRemoved: element });
    }
};
ko.expressionRewriting.twoWayBindings['textInput'] = true;

// textinput is an alias for textInput
ko.bindingHandlers['textinput'] = {
    // preprocess is the only way to set up a full alias
    'preprocess': function (value, name, addBinding) {
        addBinding('textInput', value);
    }
};

})();ko.bindingHandlers['uniqueName'] = {
    'init': function (element, valueAccessor) {
        if (valueAccessor()) {
            var name = "ko_unique_" + (++ko.bindingHandlers['uniqueName'].currentIndex);
            ko.utils.setElementName(element, name);
        }
    }
};
ko.bindingHandlers['uniqueName'].currentIndex = 0;
ko.bindingHandlers['value'] = {
    'after': ['options', 'foreach'],
    'init': function (element, valueAccessor, allBindings) {
        // If the value binding is placed on a radio/checkbox, then just pass through to checkedValue and quit
        if (element.tagName.toLowerCase() == "input" && (element.type == "checkbox" || element.type == "radio")) {
            ko.applyBindingAccessorsToNode(element, { 'checkedValue': valueAccessor });
            return;
        }

        // Always catch "change" event; possibly other events too if asked
        var eventsToCatch = ["change"];
        var requestedEventsToCatch = allBindings.get("valueUpdate");
        var propertyChangedFired = false;
        var elementValueBeforeEvent = null;

        if (requestedEventsToCatch) {
            if (typeof requestedEventsToCatch == "string") // Allow both individual event names, and arrays of event names
                requestedEventsToCatch = [requestedEventsToCatch];
            ko.utils.arrayPushAll(eventsToCatch, requestedEventsToCatch);
            eventsToCatch = ko.utils.arrayGetDistinctValues(eventsToCatch);
        }

        var valueUpdateHandler = function() {
            elementValueBeforeEvent = null;
            propertyChangedFired = false;
            var modelValue = valueAccessor();
            var elementValue = ko.selectExtensions.readValue(element);
            ko.expressionRewriting.writeValueToProperty(modelValue, allBindings, 'value', elementValue);
        }

        // Workaround for https://github.com/SteveSanderson/knockout/issues/122
        // IE doesn't fire "change" events on textboxes if the user selects a value from its autocomplete list
        var ieAutoCompleteHackNeeded = ko.utils.ieVersion && element.tagName.toLowerCase() == "input" && element.type == "text"
                                       && element.autocomplete != "off" && (!element.form || element.form.autocomplete != "off");
        if (ieAutoCompleteHackNeeded && ko.utils.arrayIndexOf(eventsToCatch, "propertychange") == -1) {
            ko.utils.registerEventHandler(element, "propertychange", function () { propertyChangedFired = true });
            ko.utils.registerEventHandler(element, "focus", function () { propertyChangedFired = false });
            ko.utils.registerEventHandler(element, "blur", function() {
                if (propertyChangedFired) {
                    valueUpdateHandler();
                }
            });
        }

        ko.utils.arrayForEach(eventsToCatch, function(eventName) {
            // The syntax "after<eventname>" means "run the handler asynchronously after the event"
            // This is useful, for example, to catch "keydown" events after the browser has updated the control
            // (otherwise, ko.selectExtensions.readValue(this) will receive the control's value *before* the key event)
            var handler = valueUpdateHandler;
            if (ko.utils.stringStartsWith(eventName, "after")) {
                handler = function() {
                    // The elementValueBeforeEvent variable is non-null *only* during the brief gap between
                    // a keyX event firing and the valueUpdateHandler running, which is scheduled to happen
                    // at the earliest asynchronous opportunity. We store this temporary information so that
                    // if, between keyX and valueUpdateHandler, the underlying model value changes separately,
                    // we can overwrite that model value change with the value the user just typed. Otherwise,
                    // techniques like rateLimit can trigger model changes at critical moments that will
                    // override the user's inputs, causing keystrokes to be lost.
                    elementValueBeforeEvent = ko.selectExtensions.readValue(element);
                    setTimeout(valueUpdateHandler, 0);
                };
                eventName = eventName.substring("after".length);
            }
            ko.utils.registerEventHandler(element, eventName, handler);
        });

        var updateFromModel = function () {
            var newValue = ko.utils.unwrapObservable(valueAccessor());
            var elementValue = ko.selectExtensions.readValue(element);

            if (elementValueBeforeEvent !== null && newValue === elementValueBeforeEvent) {
                setTimeout(updateFromModel, 0);
                return;
            }

            var valueHasChanged = (newValue !== elementValue);

            if (valueHasChanged) {
                if (ko.utils.tagNameLower(element) === "select") {
                    var allowUnset = allBindings.get('valueAllowUnset');
                    var applyValueAction = function () {
                        ko.selectExtensions.writeValue(element, newValue, allowUnset);
                    };
                    applyValueAction();

                    if (!allowUnset && newValue !== ko.selectExtensions.readValue(element)) {
                        // If you try to set a model value that can't be represented in an already-populated dropdown, reject that change,
                        // because you're not allowed to have a model value that disagrees with a visible UI selection.
                        ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, "change"]);
                    } else {
                        // Workaround for IE6 bug: It won't reliably apply values to SELECT nodes during the same execution thread
                        // right after you've changed the set of OPTION nodes on it. So for that node type, we'll schedule a second thread
                        // to apply the value as well.
                        setTimeout(applyValueAction, 0);
                    }
                } else {
                    ko.selectExtensions.writeValue(element, newValue);
                }
            }
        };

        ko.computed(updateFromModel, null, { disposeWhenNodeIsRemoved: element });
    },
    'update': function() {} // Keep for backwards compatibility with code that may have wrapped value binding
};
ko.expressionRewriting.twoWayBindings['value'] = true;
ko.bindingHandlers['visible'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        var isCurrentlyVisible = !(element.style.display == "none");
        if (value && !isCurrentlyVisible)
            element.style.display = "";
        else if ((!value) && isCurrentlyVisible)
            element.style.display = "none";
    }
};
// 'click' is just a shorthand for the usual full-length event:{click:handler}
makeEventHandlerShortcut('click');
// If you want to make a custom template engine,
//
// [1] Inherit from this class (like ko.nativeTemplateEngine does)
// [2] Override 'renderTemplateSource', supplying a function with this signature:
//
//        function (templateSource, bindingContext, options) {
//            // - templateSource.text() is the text of the template you should render
//            // - bindingContext.$data is the data you should pass into the template
//            //   - you might also want to make bindingContext.$parent, bindingContext.$parents,
//            //     and bindingContext.$root available in the template too
//            // - options gives you access to any other properties set on "data-bind: { template: options }"
//            //
//            // Return value: an array of DOM nodes
//        }
//
// [3] Override 'createJavaScriptEvaluatorBlock', supplying a function with this signature:
//
//        function (script) {
//            // Return value: Whatever syntax means "Evaluate the JavaScript statement 'script' and output the result"
//            //               For example, the jquery.tmpl template engine converts 'someScript' to '${ someScript }'
//        }
//
//     This is only necessary if you want to allow data-bind attributes to reference arbitrary template variables.
//     If you don't want to allow that, you can set the property 'allowTemplateRewriting' to false (like ko.nativeTemplateEngine does)
//     and then you don't need to override 'createJavaScriptEvaluatorBlock'.

ko.templateEngine = function () { };

ko.templateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options) {
    throw new Error("Override renderTemplateSource");
};

ko.templateEngine.prototype['createJavaScriptEvaluatorBlock'] = function (script) {
    throw new Error("Override createJavaScriptEvaluatorBlock");
};

ko.templateEngine.prototype['makeTemplateSource'] = function(template, templateDocument) {
    // Named template
    if (typeof template == "string") {
        templateDocument = templateDocument || document;
        var elem = templateDocument.getElementById(template);
        if (!elem)
            throw new Error("Cannot find template with ID " + template);
        return new ko.templateSources.domElement(elem);
    } else if ((template.nodeType == 1) || (template.nodeType == 8)) {
        // Anonymous template
        return new ko.templateSources.anonymousTemplate(template);
    } else
        throw new Error("Unknown template type: " + template);
};

ko.templateEngine.prototype['renderTemplate'] = function (template, bindingContext, options, templateDocument) {
    var templateSource = this['makeTemplateSource'](template, templateDocument);
    return this['renderTemplateSource'](templateSource, bindingContext, options);
};

ko.templateEngine.prototype['isTemplateRewritten'] = function (template, templateDocument) {
    // Skip rewriting if requested
    if (this['allowTemplateRewriting'] === false)
        return true;
    return this['makeTemplateSource'](template, templateDocument)['data']("isRewritten");
};

ko.templateEngine.prototype['rewriteTemplate'] = function (template, rewriterCallback, templateDocument) {
    var templateSource = this['makeTemplateSource'](template, templateDocument);
    var rewritten = rewriterCallback(templateSource['text']());
    templateSource['text'](rewritten);
    templateSource['data']("isRewritten", true);
};

ko.exportSymbol('templateEngine', ko.templateEngine);

ko.templateRewriting = (function () {
    var memoizeDataBindingAttributeSyntaxRegex = /(<([a-z]+\d*)(?:\s+(?!data-bind\s*=\s*)[a-z0-9\-]+(?:=(?:\"[^\"]*\"|\'[^\']*\'))?)*\s+)data-bind\s*=\s*(["'])([\s\S]*?)\3/gi;
    var memoizeVirtualContainerBindingSyntaxRegex = /<!--\s*ko\b\s*([\s\S]*?)\s*-->/g;

    function validateDataBindValuesForRewriting(keyValueArray) {
        var allValidators = ko.expressionRewriting.bindingRewriteValidators;
        for (var i = 0; i < keyValueArray.length; i++) {
            var key = keyValueArray[i]['key'];
            if (allValidators.hasOwnProperty(key)) {
                var validator = allValidators[key];

                if (typeof validator === "function") {
                    var possibleErrorMessage = validator(keyValueArray[i]['value']);
                    if (possibleErrorMessage)
                        throw new Error(possibleErrorMessage);
                } else if (!validator) {
                    throw new Error("This template engine does not support the '" + key + "' binding within its templates");
                }
            }
        }
    }

    function constructMemoizedTagReplacement(dataBindAttributeValue, tagToRetain, nodeName, templateEngine) {
        var dataBindKeyValueArray = ko.expressionRewriting.parseObjectLiteral(dataBindAttributeValue);
        validateDataBindValuesForRewriting(dataBindKeyValueArray);
        var rewrittenDataBindAttributeValue = ko.expressionRewriting.preProcessBindings(dataBindKeyValueArray, {'valueAccessors':true});

        // For no obvious reason, Opera fails to evaluate rewrittenDataBindAttributeValue unless it's wrapped in an additional
        // anonymous function, even though Opera's built-in debugger can evaluate it anyway. No other browser requires this
        // extra indirection.
        var applyBindingsToNextSiblingScript =
            "ko.__tr_ambtns(function($context,$element){return(function(){return{ " + rewrittenDataBindAttributeValue + " } })()},'" + nodeName.toLowerCase() + "')";
        return templateEngine['createJavaScriptEvaluatorBlock'](applyBindingsToNextSiblingScript) + tagToRetain;
    }

    return {
        ensureTemplateIsRewritten: function (template, templateEngine, templateDocument) {
            if (!templateEngine['isTemplateRewritten'](template, templateDocument))
                templateEngine['rewriteTemplate'](template, function (htmlString) {
                    return ko.templateRewriting.memoizeBindingAttributeSyntax(htmlString, templateEngine);
                }, templateDocument);
        },

        memoizeBindingAttributeSyntax: function (htmlString, templateEngine) {
            return htmlString.replace(memoizeDataBindingAttributeSyntaxRegex, function () {
                return constructMemoizedTagReplacement(/* dataBindAttributeValue: */ arguments[4], /* tagToRetain: */ arguments[1], /* nodeName: */ arguments[2], templateEngine);
            }).replace(memoizeVirtualContainerBindingSyntaxRegex, function() {
                return constructMemoizedTagReplacement(/* dataBindAttributeValue: */ arguments[1], /* tagToRetain: */ "<!-- ko -->", /* nodeName: */ "#comment", templateEngine);
            });
        },

        applyMemoizedBindingsToNextSibling: function (bindings, nodeName) {
            return ko.memoization.memoize(function (domNode, bindingContext) {
                var nodeToBind = domNode.nextSibling;
                if (nodeToBind && nodeToBind.nodeName.toLowerCase() === nodeName) {
                    ko.applyBindingAccessorsToNode(nodeToBind, bindings, bindingContext);
                }
            });
        }
    }
})();


// Exported only because it has to be referenced by string lookup from within rewritten template
ko.exportSymbol('__tr_ambtns', ko.templateRewriting.applyMemoizedBindingsToNextSibling);
(function() {
    // A template source represents a read/write way of accessing a template. This is to eliminate the need for template loading/saving
    // logic to be duplicated in every template engine (and means they can all work with anonymous templates, etc.)
    //
    // Two are provided by default:
    //  1. ko.templateSources.domElement       - reads/writes the text content of an arbitrary DOM element
    //  2. ko.templateSources.anonymousElement - uses ko.utils.domData to read/write text *associated* with the DOM element, but
    //                                           without reading/writing the actual element text content, since it will be overwritten
    //                                           with the rendered template output.
    // You can implement your own template source if you want to fetch/store templates somewhere other than in DOM elements.
    // Template sources need to have the following functions:
    //   text() 			- returns the template text from your storage location
    //   text(value)		- writes the supplied template text to your storage location
    //   data(key)			- reads values stored using data(key, value) - see below
    //   data(key, value)	- associates "value" with this template and the key "key". Is used to store information like "isRewritten".
    //
    // Optionally, template sources can also have the following functions:
    //   nodes()            - returns a DOM element containing the nodes of this template, where available
    //   nodes(value)       - writes the given DOM element to your storage location
    // If a DOM element is available for a given template source, template engines are encouraged to use it in preference over text()
    // for improved speed. However, all templateSources must supply text() even if they don't supply nodes().
    //
    // Once you've implemented a templateSource, make your template engine use it by subclassing whatever template engine you were
    // using and overriding "makeTemplateSource" to return an instance of your custom template source.

    ko.templateSources = {};

    // ---- ko.templateSources.domElement -----

    ko.templateSources.domElement = function(element) {
        this.domElement = element;
    }

    ko.templateSources.domElement.prototype['text'] = function(/* valueToWrite */) {
        var tagNameLower = ko.utils.tagNameLower(this.domElement),
            elemContentsProperty = tagNameLower === "script" ? "text"
                                 : tagNameLower === "textarea" ? "value"
                                 : "innerHTML";

        if (arguments.length == 0) {
            return this.domElement[elemContentsProperty];
        } else {
            var valueToWrite = arguments[0];
            if (elemContentsProperty === "innerHTML")
                ko.utils.setHtml(this.domElement, valueToWrite);
            else
                this.domElement[elemContentsProperty] = valueToWrite;
        }
    };

    var dataDomDataPrefix = ko.utils.domData.nextKey() + "_";
    ko.templateSources.domElement.prototype['data'] = function(key /*, valueToWrite */) {
        if (arguments.length === 1) {
            return ko.utils.domData.get(this.domElement, dataDomDataPrefix + key);
        } else {
            ko.utils.domData.set(this.domElement, dataDomDataPrefix + key, arguments[1]);
        }
    };

    // ---- ko.templateSources.anonymousTemplate -----
    // Anonymous templates are normally saved/retrieved as DOM nodes through "nodes".
    // For compatibility, you can also read "text"; it will be serialized from the nodes on demand.
    // Writing to "text" is still supported, but then the template data will not be available as DOM nodes.

    var anonymousTemplatesDomDataKey = ko.utils.domData.nextKey();
    ko.templateSources.anonymousTemplate = function(element) {
        this.domElement = element;
    }
    ko.templateSources.anonymousTemplate.prototype = new ko.templateSources.domElement();
    ko.templateSources.anonymousTemplate.prototype.constructor = ko.templateSources.anonymousTemplate;
    ko.templateSources.anonymousTemplate.prototype['text'] = function(/* valueToWrite */) {
        if (arguments.length == 0) {
            var templateData = ko.utils.domData.get(this.domElement, anonymousTemplatesDomDataKey) || {};
            if (templateData.textData === undefined && templateData.containerData)
                templateData.textData = templateData.containerData.innerHTML;
            return templateData.textData;
        } else {
            var valueToWrite = arguments[0];
            ko.utils.domData.set(this.domElement, anonymousTemplatesDomDataKey, {textData: valueToWrite});
        }
    };
    ko.templateSources.domElement.prototype['nodes'] = function(/* valueToWrite */) {
        if (arguments.length == 0) {
            var templateData = ko.utils.domData.get(this.domElement, anonymousTemplatesDomDataKey) || {};
            return templateData.containerData;
        } else {
            var valueToWrite = arguments[0];
            ko.utils.domData.set(this.domElement, anonymousTemplatesDomDataKey, {containerData: valueToWrite});
        }
    };

    ko.exportSymbol('templateSources', ko.templateSources);
    ko.exportSymbol('templateSources.domElement', ko.templateSources.domElement);
    ko.exportSymbol('templateSources.anonymousTemplate', ko.templateSources.anonymousTemplate);
})();
(function () {
    var _templateEngine;
    ko.setTemplateEngine = function (templateEngine) {
        if ((templateEngine != undefined) && !(templateEngine instanceof ko.templateEngine))
            throw new Error("templateEngine must inherit from ko.templateEngine");
        _templateEngine = templateEngine;
    }

    function invokeForEachNodeInContinuousRange(firstNode, lastNode, action) {
        var node, nextInQueue = firstNode, firstOutOfRangeNode = ko.virtualElements.nextSibling(lastNode);
        while (nextInQueue && ((node = nextInQueue) !== firstOutOfRangeNode)) {
            nextInQueue = ko.virtualElements.nextSibling(node);
            action(node, nextInQueue);
        }
    }

    function activateBindingsOnContinuousNodeArray(continuousNodeArray, bindingContext) {
        // To be used on any nodes that have been rendered by a template and have been inserted into some parent element
        // Walks through continuousNodeArray (which *must* be continuous, i.e., an uninterrupted sequence of sibling nodes, because
        // the algorithm for walking them relies on this), and for each top-level item in the virtual-element sense,
        // (1) Does a regular "applyBindings" to associate bindingContext with this node and to activate any non-memoized bindings
        // (2) Unmemoizes any memos in the DOM subtree (e.g., to activate bindings that had been memoized during template rewriting)

        if (continuousNodeArray.length) {
            var firstNode = continuousNodeArray[0],
                lastNode = continuousNodeArray[continuousNodeArray.length - 1],
                parentNode = firstNode.parentNode,
                provider = ko.bindingProvider['instance'],
                preprocessNode = provider['preprocessNode'];

            if (preprocessNode) {
                invokeForEachNodeInContinuousRange(firstNode, lastNode, function(node, nextNodeInRange) {
                    var nodePreviousSibling = node.previousSibling;
                    var newNodes = preprocessNode.call(provider, node);
                    if (newNodes) {
                        if (node === firstNode)
                            firstNode = newNodes[0] || nextNodeInRange;
                        if (node === lastNode)
                            lastNode = newNodes[newNodes.length - 1] || nodePreviousSibling;
                    }
                });

                // Because preprocessNode can change the nodes, including the first and last nodes, update continuousNodeArray to match.
                // We need the full set, including inner nodes, because the unmemoize step might remove the first node (and so the real
                // first node needs to be in the array).
                continuousNodeArray.length = 0;
                if (!firstNode) { // preprocessNode might have removed all the nodes, in which case there's nothing left to do
                    return;
                }
                if (firstNode === lastNode) {
                    continuousNodeArray.push(firstNode);
                } else {
                    continuousNodeArray.push(firstNode, lastNode);
                    ko.utils.fixUpContinuousNodeArray(continuousNodeArray, parentNode);
                }
            }

            // Need to applyBindings *before* unmemoziation, because unmemoization might introduce extra nodes (that we don't want to re-bind)
            // whereas a regular applyBindings won't introduce new memoized nodes
            invokeForEachNodeInContinuousRange(firstNode, lastNode, function(node) {
                if (node.nodeType === 1 || node.nodeType === 8)
                    ko.applyBindings(bindingContext, node);
            });
            invokeForEachNodeInContinuousRange(firstNode, lastNode, function(node) {
                if (node.nodeType === 1 || node.nodeType === 8)
                    ko.memoization.unmemoizeDomNodeAndDescendants(node, [bindingContext]);
            });

            // Make sure any changes done by applyBindings or unmemoize are reflected in the array
            ko.utils.fixUpContinuousNodeArray(continuousNodeArray, parentNode);
        }
    }

    function getFirstNodeFromPossibleArray(nodeOrNodeArray) {
        return nodeOrNodeArray.nodeType ? nodeOrNodeArray
                                        : nodeOrNodeArray.length > 0 ? nodeOrNodeArray[0]
                                        : null;
    }

    function executeTemplate(targetNodeOrNodeArray, renderMode, template, bindingContext, options) {
        options = options || {};
        var firstTargetNode = targetNodeOrNodeArray && getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
        var templateDocument = firstTargetNode && firstTargetNode.ownerDocument;
        var templateEngineToUse = (options['templateEngine'] || _templateEngine);
        ko.templateRewriting.ensureTemplateIsRewritten(template, templateEngineToUse, templateDocument);
        var renderedNodesArray = templateEngineToUse['renderTemplate'](template, bindingContext, options, templateDocument);

        // Loosely check result is an array of DOM nodes
        if ((typeof renderedNodesArray.length != "number") || (renderedNodesArray.length > 0 && typeof renderedNodesArray[0].nodeType != "number"))
            throw new Error("Template engine must return an array of DOM nodes");

        var haveAddedNodesToParent = false;
        switch (renderMode) {
            case "replaceChildren":
                ko.virtualElements.setDomNodeChildren(targetNodeOrNodeArray, renderedNodesArray);
                haveAddedNodesToParent = true;
                break;
            case "replaceNode":
                ko.utils.replaceDomNodes(targetNodeOrNodeArray, renderedNodesArray);
                haveAddedNodesToParent = true;
                break;
            case "ignoreTargetNode": break;
            default:
                throw new Error("Unknown renderMode: " + renderMode);
        }

        if (haveAddedNodesToParent) {
            activateBindingsOnContinuousNodeArray(renderedNodesArray, bindingContext);
            if (options['afterRender'])
                ko.dependencyDetection.ignore(options['afterRender'], null, [renderedNodesArray, bindingContext['$data']]);
        }

        return renderedNodesArray;
    }

    function resolveTemplateName(template, data, context) {
        // The template can be specified as:
        if (ko.isObservable(template)) {
            // 1. An observable, with string value
            return template();
        } else if (typeof template === 'function') {
            // 2. A function of (data, context) returning a string
            return template(data, context);
        } else {
            // 3. A string
            return template;
        }
    }

    ko.renderTemplate = function (template, dataOrBindingContext, options, targetNodeOrNodeArray, renderMode) {
        options = options || {};
        if ((options['templateEngine'] || _templateEngine) == undefined)
            throw new Error("Set a template engine before calling renderTemplate");
        renderMode = renderMode || "replaceChildren";

        if (targetNodeOrNodeArray) {
            var firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);

            var whenToDispose = function () { return (!firstTargetNode) || !ko.utils.domNodeIsAttachedToDocument(firstTargetNode); }; // Passive disposal (on next evaluation)
            var activelyDisposeWhenNodeIsRemoved = (firstTargetNode && renderMode == "replaceNode") ? firstTargetNode.parentNode : firstTargetNode;

            return ko.dependentObservable( // So the DOM is automatically updated when any dependency changes
                function () {
                    // Ensure we've got a proper binding context to work with
                    var bindingContext = (dataOrBindingContext && (dataOrBindingContext instanceof ko.bindingContext))
                        ? dataOrBindingContext
                        : new ko.bindingContext(ko.utils.unwrapObservable(dataOrBindingContext));

                    var templateName = resolveTemplateName(template, bindingContext['$data'], bindingContext),
                        renderedNodesArray = executeTemplate(targetNodeOrNodeArray, renderMode, templateName, bindingContext, options);

                    if (renderMode == "replaceNode") {
                        targetNodeOrNodeArray = renderedNodesArray;
                        firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
                    }
                },
                null,
                { disposeWhen: whenToDispose, disposeWhenNodeIsRemoved: activelyDisposeWhenNodeIsRemoved }
            );
        } else {
            // We don't yet have a DOM node to evaluate, so use a memo and render the template later when there is a DOM node
            return ko.memoization.memoize(function (domNode) {
                ko.renderTemplate(template, dataOrBindingContext, options, domNode, "replaceNode");
            });
        }
    };

    ko.renderTemplateForEach = function (template, arrayOrObservableArray, options, targetNode, parentBindingContext) {
        // Since setDomNodeChildrenFromArrayMapping always calls executeTemplateForArrayItem and then
        // activateBindingsCallback for added items, we can store the binding context in the former to use in the latter.
        var arrayItemContext;

        // This will be called by setDomNodeChildrenFromArrayMapping to get the nodes to add to targetNode
        var executeTemplateForArrayItem = function (arrayValue, index) {
            // Support selecting template as a function of the data being rendered
            arrayItemContext = parentBindingContext['createChildContext'](arrayValue, options['as'], function(context) {
                context['$index'] = index;
            });

            var templateName = resolveTemplateName(template, arrayValue, arrayItemContext);
            return executeTemplate(null, "ignoreTargetNode", templateName, arrayItemContext, options);
        }

        // This will be called whenever setDomNodeChildrenFromArrayMapping has added nodes to targetNode
        var activateBindingsCallback = function(arrayValue, addedNodesArray, index) {
            activateBindingsOnContinuousNodeArray(addedNodesArray, arrayItemContext);
            if (options['afterRender'])
                options['afterRender'](addedNodesArray, arrayValue);
        };

        return ko.dependentObservable(function () {
            var unwrappedArray = ko.utils.unwrapObservable(arrayOrObservableArray) || [];
            if (typeof unwrappedArray.length == "undefined") // Coerce single value into array
                unwrappedArray = [unwrappedArray];

            // Filter out any entries marked as destroyed
            var filteredArray = ko.utils.arrayFilter(unwrappedArray, function(item) {
                return options['includeDestroyed'] || item === undefined || item === null || !ko.utils.unwrapObservable(item['_destroy']);
            });

            // Call setDomNodeChildrenFromArrayMapping, ignoring any observables unwrapped within (most likely from a callback function).
            // If the array items are observables, though, they will be unwrapped in executeTemplateForArrayItem and managed within setDomNodeChildrenFromArrayMapping.
            ko.dependencyDetection.ignore(ko.utils.setDomNodeChildrenFromArrayMapping, null, [targetNode, filteredArray, executeTemplateForArrayItem, options, activateBindingsCallback]);

        }, null, { disposeWhenNodeIsRemoved: targetNode });
    };

    var templateComputedDomDataKey = ko.utils.domData.nextKey();
    function disposeOldComputedAndStoreNewOne(element, newComputed) {
        var oldComputed = ko.utils.domData.get(element, templateComputedDomDataKey);
        if (oldComputed && (typeof(oldComputed.dispose) == 'function'))
            oldComputed.dispose();
        ko.utils.domData.set(element, templateComputedDomDataKey, (newComputed && newComputed.isActive()) ? newComputed : undefined);
    }

    ko.bindingHandlers['template'] = {
        'init': function(element, valueAccessor) {
            // Support anonymous templates
            var bindingValue = ko.utils.unwrapObservable(valueAccessor());
            if (typeof bindingValue == "string" || bindingValue['name']) {
                // It's a named template - clear the element
                ko.virtualElements.emptyNode(element);
            } else {
                // It's an anonymous template - store the element contents, then clear the element
                var templateNodes = ko.virtualElements.childNodes(element),
                    container = ko.utils.moveCleanedNodesToContainerElement(templateNodes); // This also removes the nodes from their current parent
                new ko.templateSources.anonymousTemplate(element)['nodes'](container);
            }
            return { 'controlsDescendantBindings': true };
        },
        'update': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var value = valueAccessor(),
                dataValue,
                options = ko.utils.unwrapObservable(value),
                shouldDisplay = true,
                templateComputed = null,
                templateName;

            if (typeof options == "string") {
                templateName = value;
                options = {};
            } else {
                templateName = options['name'];

                // Support "if"/"ifnot" conditions
                if ('if' in options)
                    shouldDisplay = ko.utils.unwrapObservable(options['if']);
                if (shouldDisplay && 'ifnot' in options)
                    shouldDisplay = !ko.utils.unwrapObservable(options['ifnot']);

                dataValue = ko.utils.unwrapObservable(options['data']);
            }

            if ('foreach' in options) {
                // Render once for each data point (treating data set as empty if shouldDisplay==false)
                var dataArray = (shouldDisplay && options['foreach']) || [];
                templateComputed = ko.renderTemplateForEach(templateName || element, dataArray, options, element, bindingContext);
            } else if (!shouldDisplay) {
                ko.virtualElements.emptyNode(element);
            } else {
                // Render once for this single data point (or use the viewModel if no data was provided)
                var innerBindingContext = ('data' in options) ?
                    bindingContext['createChildContext'](dataValue, options['as']) :  // Given an explitit 'data' value, we create a child binding context for it
                    bindingContext;                                                        // Given no explicit 'data' value, we retain the same binding context
                templateComputed = ko.renderTemplate(templateName || element, innerBindingContext, options, element);
            }

            // It only makes sense to have a single template computed per element (otherwise which one should have its output displayed?)
            disposeOldComputedAndStoreNewOne(element, templateComputed);
        }
    };

    // Anonymous templates can't be rewritten. Give a nice error message if you try to do it.
    ko.expressionRewriting.bindingRewriteValidators['template'] = function(bindingValue) {
        var parsedBindingValue = ko.expressionRewriting.parseObjectLiteral(bindingValue);

        if ((parsedBindingValue.length == 1) && parsedBindingValue[0]['unknown'])
            return null; // It looks like a string literal, not an object literal, so treat it as a named template (which is allowed for rewriting)

        if (ko.expressionRewriting.keyValueArrayContainsKey(parsedBindingValue, "name"))
            return null; // Named templates can be rewritten, so return "no error"
        return "This template engine does not support anonymous templates nested within its templates";
    };

    ko.virtualElements.allowedBindings['template'] = true;
})();

ko.exportSymbol('setTemplateEngine', ko.setTemplateEngine);
ko.exportSymbol('renderTemplate', ko.renderTemplate);
// Go through the items that have been added and deleted and try to find matches between them.
ko.utils.findMovesInArrayComparison = function (left, right, limitFailedCompares) {
    if (left.length && right.length) {
        var failedCompares, l, r, leftItem, rightItem;
        for (failedCompares = l = 0; (!limitFailedCompares || failedCompares < limitFailedCompares) && (leftItem = left[l]); ++l) {
            for (r = 0; rightItem = right[r]; ++r) {
                if (leftItem['value'] === rightItem['value']) {
                    leftItem['moved'] = rightItem['index'];
                    rightItem['moved'] = leftItem['index'];
                    right.splice(r, 1);         // This item is marked as moved; so remove it from right list
                    failedCompares = r = 0;     // Reset failed compares count because we're checking for consecutive failures
                    break;
                }
            }
            failedCompares += r;
        }
    }
};

ko.utils.compareArrays = (function () {
    var statusNotInOld = 'added', statusNotInNew = 'deleted';

    // Simple calculation based on Levenshtein distance.
    function compareArrays(oldArray, newArray, options) {
        // For backward compatibility, if the third arg is actually a bool, interpret
        // it as the old parameter 'dontLimitMoves'. Newer code should use { dontLimitMoves: true }.
        options = (typeof options === 'boolean') ? { 'dontLimitMoves': options } : (options || {});
        oldArray = oldArray || [];
        newArray = newArray || [];

        if (oldArray.length <= newArray.length)
            return compareSmallArrayToBigArray(oldArray, newArray, statusNotInOld, statusNotInNew, options);
        else
            return compareSmallArrayToBigArray(newArray, oldArray, statusNotInNew, statusNotInOld, options);
    }

    function compareSmallArrayToBigArray(smlArray, bigArray, statusNotInSml, statusNotInBig, options) {
        var myMin = Math.min,
            myMax = Math.max,
            editDistanceMatrix = [],
            smlIndex, smlIndexMax = smlArray.length,
            bigIndex, bigIndexMax = bigArray.length,
            compareRange = (bigIndexMax - smlIndexMax) || 1,
            maxDistance = smlIndexMax + bigIndexMax + 1,
            thisRow, lastRow,
            bigIndexMaxForRow, bigIndexMinForRow;

        for (smlIndex = 0; smlIndex <= smlIndexMax; smlIndex++) {
            lastRow = thisRow;
            editDistanceMatrix.push(thisRow = []);
            bigIndexMaxForRow = myMin(bigIndexMax, smlIndex + compareRange);
            bigIndexMinForRow = myMax(0, smlIndex - 1);
            for (bigIndex = bigIndexMinForRow; bigIndex <= bigIndexMaxForRow; bigIndex++) {
                if (!bigIndex)
                    thisRow[bigIndex] = smlIndex + 1;
                else if (!smlIndex)  // Top row - transform empty array into new array via additions
                    thisRow[bigIndex] = bigIndex + 1;
                else if (smlArray[smlIndex - 1] === bigArray[bigIndex - 1])
                    thisRow[bigIndex] = lastRow[bigIndex - 1];                  // copy value (no edit)
                else {
                    var northDistance = lastRow[bigIndex] || maxDistance;       // not in big (deletion)
                    var westDistance = thisRow[bigIndex - 1] || maxDistance;    // not in small (addition)
                    thisRow[bigIndex] = myMin(northDistance, westDistance) + 1;
                }
            }
        }

        var editScript = [], meMinusOne, notInSml = [], notInBig = [];
        for (smlIndex = smlIndexMax, bigIndex = bigIndexMax; smlIndex || bigIndex;) {
            meMinusOne = editDistanceMatrix[smlIndex][bigIndex] - 1;
            if (bigIndex && meMinusOne === editDistanceMatrix[smlIndex][bigIndex-1]) {
                notInSml.push(editScript[editScript.length] = {     // added
                    'status': statusNotInSml,
                    'value': bigArray[--bigIndex],
                    'index': bigIndex });
            } else if (smlIndex && meMinusOne === editDistanceMatrix[smlIndex - 1][bigIndex]) {
                notInBig.push(editScript[editScript.length] = {     // deleted
                    'status': statusNotInBig,
                    'value': smlArray[--smlIndex],
                    'index': smlIndex });
            } else {
                --bigIndex;
                --smlIndex;
                if (!options['sparse']) {
                    editScript.push({
                        'status': "retained",
                        'value': bigArray[bigIndex] });
                }
            }
        }

        // Set a limit on the number of consecutive non-matching comparisons; having it a multiple of
        // smlIndexMax keeps the time complexity of this algorithm linear.
        ko.utils.findMovesInArrayComparison(notInSml, notInBig, smlIndexMax * 10);

        return editScript.reverse();
    }

    return compareArrays;
})();

ko.exportSymbol('utils.compareArrays', ko.utils.compareArrays);
(function () {
    // Objective:
    // * Given an input array, a container DOM node, and a function from array elements to arrays of DOM nodes,
    //   map the array elements to arrays of DOM nodes, concatenate together all these arrays, and use them to populate the container DOM node
    // * Next time we're given the same combination of things (with the array possibly having mutated), update the container DOM node
    //   so that its children is again the concatenation of the mappings of the array elements, but don't re-map any array elements that we
    //   previously mapped - retain those nodes, and just insert/delete other ones

    // "callbackAfterAddingNodes" will be invoked after any "mapping"-generated nodes are inserted into the container node
    // You can use this, for example, to activate bindings on those nodes.

    function mapNodeAndRefreshWhenChanged(containerNode, mapping, valueToMap, callbackAfterAddingNodes, index) {
        // Map this array value inside a dependentObservable so we re-map when any dependency changes
        var mappedNodes = [];
        var dependentObservable = ko.dependentObservable(function() {
            var newMappedNodes = mapping(valueToMap, index, ko.utils.fixUpContinuousNodeArray(mappedNodes, containerNode)) || [];

            // On subsequent evaluations, just replace the previously-inserted DOM nodes
            if (mappedNodes.length > 0) {
                ko.utils.replaceDomNodes(mappedNodes, newMappedNodes);
                if (callbackAfterAddingNodes)
                    ko.dependencyDetection.ignore(callbackAfterAddingNodes, null, [valueToMap, newMappedNodes, index]);
            }

            // Replace the contents of the mappedNodes array, thereby updating the record
            // of which nodes would be deleted if valueToMap was itself later removed
            mappedNodes.length = 0;
            ko.utils.arrayPushAll(mappedNodes, newMappedNodes);
        }, null, { disposeWhenNodeIsRemoved: containerNode, disposeWhen: function() { return !ko.utils.anyDomNodeIsAttachedToDocument(mappedNodes); } });
        return { mappedNodes : mappedNodes, dependentObservable : (dependentObservable.isActive() ? dependentObservable : undefined) };
    }

    var lastMappingResultDomDataKey = ko.utils.domData.nextKey();

    ko.utils.setDomNodeChildrenFromArrayMapping = function (domNode, array, mapping, options, callbackAfterAddingNodes) {
        // Compare the provided array against the previous one
        array = array || [];
        options = options || {};
        var isFirstExecution = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) === undefined;
        var lastMappingResult = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) || [];
        var lastArray = ko.utils.arrayMap(lastMappingResult, function (x) { return x.arrayEntry; });
        var editScript = ko.utils.compareArrays(lastArray, array, options['dontLimitMoves']);

        // Build the new mapping result
        var newMappingResult = [];
        var lastMappingResultIndex = 0;
        var newMappingResultIndex = 0;

        var nodesToDelete = [];
        var itemsToProcess = [];
        var itemsForBeforeRemoveCallbacks = [];
        var itemsForMoveCallbacks = [];
        var itemsForAfterAddCallbacks = [];
        var mapData;

        function itemMovedOrRetained(editScriptIndex, oldPosition) {
            mapData = lastMappingResult[oldPosition];
            if (newMappingResultIndex !== oldPosition)
                itemsForMoveCallbacks[editScriptIndex] = mapData;
            // Since updating the index might change the nodes, do so before calling fixUpContinuousNodeArray
            mapData.indexObservable(newMappingResultIndex++);
            ko.utils.fixUpContinuousNodeArray(mapData.mappedNodes, domNode);
            newMappingResult.push(mapData);
            itemsToProcess.push(mapData);
        }

        function callCallback(callback, items) {
            if (callback) {
                for (var i = 0, n = items.length; i < n; i++) {
                    if (items[i]) {
                        ko.utils.arrayForEach(items[i].mappedNodes, function(node) {
                            callback(node, i, items[i].arrayEntry);
                        });
                    }
                }
            }
        }

        for (var i = 0, editScriptItem, movedIndex; editScriptItem = editScript[i]; i++) {
            movedIndex = editScriptItem['moved'];
            switch (editScriptItem['status']) {
                case "deleted":
                    if (movedIndex === undefined) {
                        mapData = lastMappingResult[lastMappingResultIndex];

                        // Stop tracking changes to the mapping for these nodes
                        if (mapData.dependentObservable)
                            mapData.dependentObservable.dispose();

                        // Queue these nodes for later removal
                        nodesToDelete.push.apply(nodesToDelete, ko.utils.fixUpContinuousNodeArray(mapData.mappedNodes, domNode));
                        if (options['beforeRemove']) {
                            itemsForBeforeRemoveCallbacks[i] = mapData;
                            itemsToProcess.push(mapData);
                        }
                    }
                    lastMappingResultIndex++;
                    break;

                case "retained":
                    itemMovedOrRetained(i, lastMappingResultIndex++);
                    break;

                case "added":
                    if (movedIndex !== undefined) {
                        itemMovedOrRetained(i, movedIndex);
                    } else {
                        mapData = { arrayEntry: editScriptItem['value'], indexObservable: ko.observable(newMappingResultIndex++) };
                        newMappingResult.push(mapData);
                        itemsToProcess.push(mapData);
                        if (!isFirstExecution)
                            itemsForAfterAddCallbacks[i] = mapData;
                    }
                    break;
            }
        }

        // Call beforeMove first before any changes have been made to the DOM
        callCallback(options['beforeMove'], itemsForMoveCallbacks);

        // Next remove nodes for deleted items (or just clean if there's a beforeRemove callback)
        ko.utils.arrayForEach(nodesToDelete, options['beforeRemove'] ? ko.cleanNode : ko.removeNode);

        // Next add/reorder the remaining items (will include deleted items if there's a beforeRemove callback)
        for (var i = 0, nextNode = ko.virtualElements.firstChild(domNode), lastNode, node; mapData = itemsToProcess[i]; i++) {
            // Get nodes for newly added items
            if (!mapData.mappedNodes)
                ko.utils.extend(mapData, mapNodeAndRefreshWhenChanged(domNode, mapping, mapData.arrayEntry, callbackAfterAddingNodes, mapData.indexObservable));

            // Put nodes in the right place if they aren't there already
            for (var j = 0; node = mapData.mappedNodes[j]; nextNode = node.nextSibling, lastNode = node, j++) {
                if (node !== nextNode)
                    ko.virtualElements.insertAfter(domNode, node, lastNode);
            }

            // Run the callbacks for newly added nodes (for example, to apply bindings, etc.)
            if (!mapData.initialized && callbackAfterAddingNodes) {
                callbackAfterAddingNodes(mapData.arrayEntry, mapData.mappedNodes, mapData.indexObservable);
                mapData.initialized = true;
            }
        }

        // If there's a beforeRemove callback, call it after reordering.
        // Note that we assume that the beforeRemove callback will usually be used to remove the nodes using
        // some sort of animation, which is why we first reorder the nodes that will be removed. If the
        // callback instead removes the nodes right away, it would be more efficient to skip reordering them.
        // Perhaps we'll make that change in the future if this scenario becomes more common.
        callCallback(options['beforeRemove'], itemsForBeforeRemoveCallbacks);

        // Finally call afterMove and afterAdd callbacks
        callCallback(options['afterMove'], itemsForMoveCallbacks);
        callCallback(options['afterAdd'], itemsForAfterAddCallbacks);

        // Store a copy of the array items we just considered so we can difference it next time
        ko.utils.domData.set(domNode, lastMappingResultDomDataKey, newMappingResult);
    }
})();

ko.exportSymbol('utils.setDomNodeChildrenFromArrayMapping', ko.utils.setDomNodeChildrenFromArrayMapping);
ko.nativeTemplateEngine = function () {
    this['allowTemplateRewriting'] = false;
}

ko.nativeTemplateEngine.prototype = new ko.templateEngine();
ko.nativeTemplateEngine.prototype.constructor = ko.nativeTemplateEngine;
ko.nativeTemplateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options) {
    var useNodesIfAvailable = !(ko.utils.ieVersion < 9), // IE<9 cloneNode doesn't work properly
        templateNodesFunc = useNodesIfAvailable ? templateSource['nodes'] : null,
        templateNodes = templateNodesFunc ? templateSource['nodes']() : null;

    if (templateNodes) {
        return ko.utils.makeArray(templateNodes.cloneNode(true).childNodes);
    } else {
        var templateText = templateSource['text']();
        return ko.utils.parseHtmlFragment(templateText);
    }
};

ko.nativeTemplateEngine.instance = new ko.nativeTemplateEngine();
ko.setTemplateEngine(ko.nativeTemplateEngine.instance);

ko.exportSymbol('nativeTemplateEngine', ko.nativeTemplateEngine);
(function() {
    ko.jqueryTmplTemplateEngine = function () {
        // Detect which version of jquery-tmpl you're using. Unfortunately jquery-tmpl
        // doesn't expose a version number, so we have to infer it.
        // Note that as of Knockout 1.3, we only support jQuery.tmpl 1.0.0pre and later,
        // which KO internally refers to as version "2", so older versions are no longer detected.
        var jQueryTmplVersion = this.jQueryTmplVersion = (function() {
            if (!jQueryInstance || !(jQueryInstance['tmpl']))
                return 0;
            // Since it exposes no official version number, we use our own numbering system. To be updated as jquery-tmpl evolves.
            try {
                if (jQueryInstance['tmpl']['tag']['tmpl']['open'].toString().indexOf('__') >= 0) {
                    // Since 1.0.0pre, custom tags should append markup to an array called "__"
                    return 2; // Final version of jquery.tmpl
                }
            } catch(ex) { /* Apparently not the version we were looking for */ }

            return 1; // Any older version that we don't support
        })();

        function ensureHasReferencedJQueryTemplates() {
            if (jQueryTmplVersion < 2)
                throw new Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");
        }

        function executeTemplate(compiledTemplate, data, jQueryTemplateOptions) {
            return jQueryInstance['tmpl'](compiledTemplate, data, jQueryTemplateOptions);
        }

        this['renderTemplateSource'] = function(templateSource, bindingContext, options) {
            options = options || {};
            ensureHasReferencedJQueryTemplates();

            // Ensure we have stored a precompiled version of this template (don't want to reparse on every render)
            var precompiled = templateSource['data']('precompiled');
            if (!precompiled) {
                var templateText = templateSource['text']() || "";
                // Wrap in "with($whatever.koBindingContext) { ... }"
                templateText = "{{ko_with $item.koBindingContext}}" + templateText + "{{/ko_with}}";

                precompiled = jQueryInstance['template'](null, templateText);
                templateSource['data']('precompiled', precompiled);
            }

            var data = [bindingContext['$data']]; // Prewrap the data in an array to stop jquery.tmpl from trying to unwrap any arrays
            var jQueryTemplateOptions = jQueryInstance['extend']({ 'koBindingContext': bindingContext }, options['templateOptions']);

            var resultNodes = executeTemplate(precompiled, data, jQueryTemplateOptions);
            resultNodes['appendTo'](document.createElement("div")); // Using "appendTo" forces jQuery/jQuery.tmpl to perform necessary cleanup work

            jQueryInstance['fragments'] = {}; // Clear jQuery's fragment cache to avoid a memory leak after a large number of template renders
            return resultNodes;
        };

        this['createJavaScriptEvaluatorBlock'] = function(script) {
            return "{{ko_code ((function() { return " + script + " })()) }}";
        };

        this['addTemplate'] = function(templateName, templateMarkup) {
            document.write("<script type='text/html' id='" + templateName + "'>" + templateMarkup + "<" + "/script>");
        };

        if (jQueryTmplVersion > 0) {
            jQueryInstance['tmpl']['tag']['ko_code'] = {
                open: "__.push($1 || '');"
            };
            jQueryInstance['tmpl']['tag']['ko_with'] = {
                open: "with($1) {",
                close: "} "
            };
        }
    };

    ko.jqueryTmplTemplateEngine.prototype = new ko.templateEngine();
    ko.jqueryTmplTemplateEngine.prototype.constructor = ko.jqueryTmplTemplateEngine;

    // Use this one by default *only if jquery.tmpl is referenced*
    var jqueryTmplTemplateEngineInstance = new ko.jqueryTmplTemplateEngine();
    if (jqueryTmplTemplateEngineInstance.jQueryTmplVersion > 0)
        ko.setTemplateEngine(jqueryTmplTemplateEngineInstance);

    ko.exportSymbol('jqueryTmplTemplateEngine', ko.jqueryTmplTemplateEngine);
})();
}));
}());
})();

},{}]},{},[3])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiYXBwXFxkYlxcaW5kZXguanMiLCJhcHBcXGV4dGVuc2lvbnNcXG51bWVyaWNPYnNlcnZhYmxlLmpzIiwiYXBwXFxtYWluLmpzIiwiYXBwXFxtb2RlbHNcXGNvbmZpZ1xcYmlsbGluZ01ldGhvZHMuanMiLCJhcHBcXG1vZGVsc1xcY29uZmlnXFxpbmRleC5qcyIsImFwcFxcbW9kZWxzXFxjb25maWdcXGludm9pY2VHcm91cHMuanMiLCJhcHBcXG1vZGVsc1xcY29uZmlnXFxwcmljZU1ldGhvZHMuanMiLCJhcHBcXG1vZGVsc1xcY29uZmlnXFxwcm9kdWN0cy5qcyIsImFwcFxcbW9kZWxzXFxjb25maWdcXHNlcnZpY2VUeXBlcy5qcyIsImFwcFxcbW9kZWxzXFxjb25maWdcXHN1YnNjcmliZXJzUGFja2FnZXMuanMiLCJhcHBcXG1vZGVsc1xcaW5kZXguanMiLCJhcHBcXG1vZGVsc1xccHJlbWl1bVxcY29uZGl0aW9uLmpzIiwiYXBwXFxtb2RlbHNcXHByZW1pdW1cXGNvbnRyYWN0LmpzIiwiYXBwXFxtb2RlbHNcXHByZW1pdW1cXGluZGV4LmpzIiwiYXBwXFxtb2RlbHNcXHByZW1pdW1cXG1vbnRoLmpzIiwiYXBwXFxtb2RlbHNcXHByZW1pdW1cXHByb2R1Y3QuanMiLCJhcHBcXG1vZGVsc1xccHJlbWl1bVxccmFuZ2UuanMiLCJhcHBcXG1vZGVsc1xccHJlbWl1bVxcdGVzdC5qcyIsIm5vZGVfbW9kdWxlc1xca25vY2tvdXRcXGJ1aWxkXFxvdXRwdXRcXGtub2Nrb3V0LWxhdGVzdC5kZWJ1Zy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBkYjtcblxuZnVuY3Rpb24gZGIodGFibGUpIHtcbiAgcmV0dXJuIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBpdGVtID0gZ2xvYmFsLmxvY2FsU3RvcmFnZS5nZXRJdGVtKHRhYmxlKTtcblxuICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgLy8gaXRzIGV2YWx1dGlvbiBiYWJ5IVxuICAgICAgICByZXR1cm4gZXZhbCgnKCcgKyBpdGVtICsgJyknKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG4gICAgfSxcbiAgICBzYXZlOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgdmFyIHN0ciA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuXG4gICAgICBnbG9iYWwubG9jYWxTdG9yYWdlLnNldEl0ZW0odGFibGUsIHN0cik7XG4gICAgfSxcbiAgICBjbGVhcjogZnVuY3Rpb24gKHRhYmxlKSB7XG4gICAgICBnbG9iYWwubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGFibGUpO1xuICAgIH1cbiAgfTtcbn1cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG51bWVyaWNPYnNlcnZhYmxlO1xuXG5mdW5jdGlvbiBudW1lcmljT2JzZXJ2YWJsZShpbml0aWFsVmFsdWUpIHtcbiAgdmFyIF9hY3R1YWwgPSBrby5vYnNlcnZhYmxlKGluaXRpYWxWYWx1ZSk7XG5cbiAgdmFyIHJlc3VsdCA9IGtvLmNvbXB1dGVkKHtcbiAgICByZWFkOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfYWN0dWFsKCk7XG4gICAgfSxcbiAgICB3cml0ZTogZnVuY3Rpb24obmV3VmFsdWUpIHtcbiAgICAgIHZhciBwYXJzZWRWYWx1ZSA9IHBhcnNlRmxvYXQobmV3VmFsdWUpO1xuICAgICAgX2FjdHVhbChpc05hTihwYXJzZWRWYWx1ZSkgPyBuZXdWYWx1ZSA6IHBhcnNlZFZhbHVlKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4ndXNlIHN0cmljdCc7XG5cbmdsb2JhbC5rbyA9IHJlcXVpcmUoJ2tub2Nrb3V0Jyk7XG5nbG9iYWwubW9kZWxzID0gcmVxdWlyZSgnLi9tb2RlbHMnKTtcbmdsb2JhbC51c2UgPSB1c2U7XG5cbi8vIGV4dGVuc2lvbnNcbmtvLm51bWVyaWNPYnNlcnZhYmxlID0gcmVxdWlyZSgnLi9leHRlbnNpb25zL251bWVyaWNPYnNlcnZhYmxlLmpzJyk7XG5cbmZ1bmN0aW9uIHVzZShNb2RlbCkge1xuICB2YXIgbW9kZWwgPSBuZXcgTW9kZWwoKTtcblxuICBrby5hcHBseUJpbmRpbmdzKG1vZGVsKTtcbn1cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZmxhdEZlZTogY3JlYXRlTWV0aG9kKCdGbGF0IEZlZScsICdmbGF0LWZlZScpLFxuICByZXZlbnVlU2hhcmU6IGNyZWF0ZU1ldGhvZCgnUmV2ZW51ZSBTaGFyZScsICdyZXZlbnVlLXNoYXJlJyksXG4gIGFjdHVhbFN1YnNjcmliZXJzOiBjcmVhdGVNZXRob2QoJ0FjdHVhbCBTdWJzY3JpYmVycycsICdhY3R1YWwtc3Vic2NyaWJlcnMnLCB0cnVlKSxcbn07XG5cbmZ1bmN0aW9uIGNyZWF0ZU1ldGhvZChuYW1lLCB0ZW1wbGF0ZSwgaXNBY3R1YWxTdWJzY3JpYmVycykge1xuICByZXR1cm4ge1xuICAgIG5hbWU6IG5hbWUsXG4gICAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICAgIGlzQWN0dWFsU3Vic2NyaWJlcnM6ICEhaXNBY3R1YWxTdWJzY3JpYmVycyxcbiAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJpbGxpbmdNZXRob2RzID0gcmVxdWlyZSgnLi9iaWxsaW5nTWV0aG9kcy5qcycpO1xudmFyIGludm9pY2VHcm91cHMgPSByZXF1aXJlKCcuL2ludm9pY2VHcm91cHMuanMnKTtcbnZhciBwcmljZU1ldGhvZHMgPSByZXF1aXJlKCcuL3ByaWNlTWV0aG9kcy5qcycpO1xudmFyIHByb2R1Y3RzID0gcmVxdWlyZSgnLi9wcm9kdWN0cy5qcycpO1xudmFyIHNlcnZpY2VUeXBlcyA9IHJlcXVpcmUoJy4vc2VydmljZVR5cGVzLmpzJyk7XG52YXIgc3Vic2NyaWJlcnNQYWNrYWdlcyA9IHJlcXVpcmUoJy4vc3Vic2NyaWJlcnNQYWNrYWdlcy5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYmlsbGluZ01ldGhvZHM6IGJpbGxpbmdNZXRob2RzLFxuICBpbnZvaWNlR3JvdXBzOiBpbnZvaWNlR3JvdXBzLFxuICBwcmljZU1ldGhvZHM6IHByaWNlTWV0aG9kcyxcbiAgcHJvZHVjdHM6IHByb2R1Y3RzLFxuICBzZXJ2aWNlVHlwZXM6IHNlcnZpY2VUeXBlcyxcbiAgc3Vic2NyaWJlcnNQYWNrYWdlczogc3Vic2NyaWJlcnNQYWNrYWdlcyxcbiAgZ2V0QnlOYW1lOiBnZXRCeU5hbWUsXG4gIGdldDogZ2V0XG59O1xuXG5mdW5jdGlvbiBnZXRCeU5hbWUodHlwZSwgbmFtZSkge1xuICByZXR1cm4gZ2V0KHR5cGUpLmZpbHRlcihmdW5jdGlvbiAoaSkgeyByZXR1cm4gaS5uYW1lID09PSBuYW1lOyB9KVswXTtcbn1cblxuZnVuY3Rpb24gZ2V0KHR5cGUpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHR5cGUpLm1hcChmdW5jdGlvbiAoaykgeyByZXR1cm4gdHlwZVtrXTsgfSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBncm91cHMgPSBbMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTBdLm1hcChmdW5jdGlvbiAoaSkge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdJbnZvaWNlICcgKyBpLFxuICB9O1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZ3JvdXBzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcmFuZ2UgPSBjcmVhdGVNZXRob2QoJ1JhbmdlJyk7XG52YXIgaW5jcmVtZW50YWwgPSBjcmVhdGVNZXRob2QoJ0luY3JlbWVudGFsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICByYW5nZTogcmFuZ2UsXG4gIGluY3JlbWVudGFsOiBpbmNyZW1lbnRhbCxcbn07XG5cbmZ1bmN0aW9uIGNyZWF0ZU1ldGhvZChuYW1lKSB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogbmFtZSxcbiAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHByb2R1Y3RzID0gW3tcbiAgbmFtZTogJ1NpZ25hbCBGb3ggSEQnLFxuICB0eXBlOiAnU2lnbmFsJyxcbn0sIHtcbiAgbmFtZTogJ1NpZ25hbCBGb3ggTGlmZScsXG4gIHR5cGU6ICdTaWduYWwnLFxufSwge1xuICBuYW1lOiAnU2lnbmFsIEZveCBTcG9ydHMnLFxuICB0eXBlOiAnU2lnbmFsJyxcbn0sIHtcbiAgbmFtZTogJ1NpZ25hbCBGb3ggU3BvcnRzIDInLFxuICB0eXBlOiAnU2lnbmFsJyxcbn0sIHtcbiAgbmFtZTogJ1NpZ25hbCBGb3ggU3BvcnRzIDIgSEQnLFxuICB0eXBlOiAnU2lnbmFsJyxcbn0sIHtcbiAgbmFtZTogJ1NpZ25hbCBGb3ggU3BvcnRzIFByZW1pdW0nLFxuICB0eXBlOiAnU2lnbmFsJyxcbn0sIHtcbiAgbmFtZTogJ1NpZ25hbCBGWCcsXG4gIHR5cGU6ICdTaWduYWwnLFxufSwge1xuICBuYW1lOiAnU2lnbmFsIEZYIEhEJyxcbiAgdHlwZTogJ1NpZ25hbCcsXG59LCB7XG4gIG5hbWU6ICdTaWduYWwgTXVuZG8gRm94JyxcbiAgdHlwZTogJ1NpZ25hbCcsXG59LCB7XG4gIG5hbWU6ICdDRitORycsXG4gIHR5cGU6ICdQYWNrYWdlJyxcbn0sIHtcbiAgbmFtZTogJ0NGK05HK0ZTJyxcbiAgdHlwZTogJ1BhY2thZ2UnLFxufSwge1xuICBuYW1lOiAnQ0YrTkcrRlgrRlMzK0ZMJyxcbiAgdHlwZTogJ1BhY2thZ2UnLFxufSwge1xuICBuYW1lOiAnRlMzK05HVycsXG4gIHR5cGU6ICdQYWNrYWdlJyxcbn0sIHtcbiAgbmFtZTogJ0ZMK05HVytGUzMnLFxuICB0eXBlOiAnUGFja2FnZScsXG59LCB7XG4gIG5hbWU6ICdTeWZ5K1VDJyxcbiAgdHlwZTogJ1BhY2thZ2UnLFxufSwge1xuICBuYW1lOiAnRlNCK0ZTMicsXG4gIHR5cGU6ICdQYWNrYWdlJyxcbn0sIHtcbiAgbmFtZTogJ0NGK05HK0ZTMycsXG4gIHR5cGU6ICdQYWNrYWdlJyxcbn0sIHtcbiAgbmFtZTogJ1VUSUxJUytDRitORytGWCtGTCcsXG4gIHR5cGU6ICdQYWNrYWdlJyxcbn1dO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHByb2R1Y3RzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcHJvZHVjdHMgPSByZXF1aXJlKCcuL3Byb2R1Y3RzLmpzJyk7XG52YXIgdHlwZXMgPSBbe1xuICBuYW1lOiAnU2lnbmFsJyxcbn0sIHtcbiAgbmFtZTogJ1BhY2thZ2UnLFxufV07XG5cbm1vZHVsZS5leHBvcnRzID0gdHlwZXMubWFwKGZ1bmN0aW9uICh0KSB7XG4gIHQucHJvZHVjdHMgPSBwcm9kdWN0cy5maWx0ZXIoZnVuY3Rpb24gKHApIHsgcmV0dXJuIHAudHlwZSA9PT0gdC5uYW1lOyB9KTtcblxuICByZXR1cm4gdDtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcGFja2FnZXMgPSBbe1xuICBuYW1lOiAnTmV3Jyxcbn0sIHtcbiAgbmFtZTogJ09sZCcsXG59LCB7XG4gIG5hbWU6ICdBbGwnLFxufV07XG5cbm1vZHVsZS5leHBvcnRzID0gcGFja2FnZXM7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZycpO1xudmFyIHByZW1pdW0gPSByZXF1aXJlKCcuL3ByZW1pdW0nKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNvbmZpZzogY29uZmlnLFxuICBwcmVtaXVtOiBwcmVtaXVtLFxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJpbGxpbmdNZXRob2RzID0gcmVxdWlyZSgnLi4vY29uZmlnJykuYmlsbGluZ01ldGhvZHM7XG52YXIgcHJpY2VNZXRob2RzID0gcmVxdWlyZSgnLi4vY29uZmlnJykucHJpY2VNZXRob2RzO1xudmFyIENvbmRpdGlvblJhbmdlID0gcmVxdWlyZSgnLi9yYW5nZS5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbmRpdGlvbjtcblxuZnVuY3Rpb24gQ29uZGl0aW9uKGJpbGxpbmdNZXRob2QsIHBhcmVudCwgcHJldmVudFJhbmdlSW5pdCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBzdWJzY3JpcHRpb25zID0gW107XG4gIHZhciBpc1NvcnRpbmc7XG5cbiAgc2VsZi5iaWxsaW5nTWV0aG9kID0gYmlsbGluZ01ldGhvZDtcbiAgc2VsZi5wcmljZU1ldGhvZCA9IGtvLm9ic2VydmFibGUocHJpY2VNZXRob2RzLnJhbmdlKTtcbiAgc2VsZi5taW5pbXVtR3VhcmFudGVlZCA9IGtvLm51bWVyaWNPYnNlcnZhYmxlKCk7XG4gIHNlbGYucHJpY2UgPSBrby5udW1lcmljT2JzZXJ2YWJsZSgpO1xuICBzZWxmLnJhbmdlcyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xuXG4gIHNlbGYucmFuZ2VzLnN1YnNjcmliZShmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxhc3RSYW5nZSA9IHNlbGYucmFuZ2VzKClbc2VsZi5yYW5nZXMoKS5sZW5ndGggLSAxXTtcbiAgICBkaXNwb3NlU3Vic2NyaXB0aW9ucygpO1xuICAgIHN1YnNjcmliZVJhbmdlKGxhc3RSYW5nZSk7XG4gICAgaWYgKCFpc1NvcnRpbmcpIHtcbiAgICAgIGlzU29ydGluZyA9IHRydWU7XG4gICAgICBzZWxmLnNvcnQoKTtcbiAgICB9XG4gIH0pO1xuXG4gIHNlbGYuc29ydCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVzdWx0ID0gc2VsZi5yYW5nZXMoKVxuICAgICAgLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgaWYgKCFiLnRvKCkpIHtcbiAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIWEudG8oKSkge1xuICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHJldHVybiBhLnRvKCkgLSBiLnRvKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgc2VsZi5yYW5nZXMocmVzdWx0KTtcbiAgICBpc1NvcnRpbmcgPSBmYWxzZTtcbiAgfTtcblxuICBzZWxmLnJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVzdWx0ID0gcGFyZW50LmNvbmRpdGlvbnMoKVxuICAgICAgLmZpbHRlcihmdW5jdGlvbiAoYykgeyByZXR1cm4gYyAhPT0gc2VsZjsgfSk7XG5cbiAgICBwYXJlbnQuY29uZGl0aW9ucyhyZXN1bHQpO1xuICB9O1xuXG4gIHNlbGYuY2FsY3VsYXRlID0gZnVuY3Rpb24oc3Vic2NyaWJlcnMsIHJldGFpbFByaWNlKSB7XG4gICAgdmFyIHJhbmdlID0gZ2V0UmFuZ2VGb3Ioc3Vic2NyaWJlcnMpO1xuICAgIHZhciByZW1haW5pbmcgPSBzdWJzY3JpYmVycztcbiAgICB2YXIgdG90YWwgPSAwO1xuICAgIHZhciBsYXN0O1xuXG4gICAgaWYgKGJpbGxpbmdNZXRob2QgPT09IGJpbGxpbmdNZXRob2RzLmZsYXRGZWUpIHtcbiAgICAgIHRvdGFsID0gc2VsZi5wcmljZSgpO1xuICAgIH1cbiAgICBlbHNlIGlmIChiaWxsaW5nTWV0aG9kID09PSBiaWxsaW5nTWV0aG9kcy5yZXZlbnVlU2hhcmUgJiYgcmFuZ2UpIHtcbiAgICAgIHRvdGFsID0gcmV0YWlsUHJpY2UgKiAocmFuZ2UucGVyY2VudGFnZSgpIC8gMTAwKSAqIHJlbWFpbmluZztcbiAgICB9XG4gICAgZWxzZSBpZiAoYmlsbGluZ01ldGhvZCA9PT0gYmlsbGluZ01ldGhvZHMuYWN0dWFsU3Vic2NyaWJlcnMgJiYgcmFuZ2UpIHtcbiAgICAgIGlmIChzZWxmLm1pbmltdW1HdWFyYW50ZWVkKCkgJiYgcmVtYWluaW5nIDwgc2VsZi5taW5pbXVtR3VhcmFudGVlZCgpKSB7XG4gICAgICAgIHJlbWFpbmluZyA9IHNlbGYubWluaW11bUd1YXJhbnRlZWQoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNlbGYucHJpY2VNZXRob2QoKSA9PT0gcHJpY2VNZXRob2RzLnJhbmdlKSB7XG4gICAgICAgIHRvdGFsID0gcmFuZ2UucHJpY2UoKSAqIHJlbWFpbmluZztcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHNlbGYucHJpY2VNZXRob2QoKSA9PT0gcHJpY2VNZXRob2RzLmluY3JlbWVudGFsKSB7XG4gICAgICAgIHNlbGYucmFuZ2VzKCkuZm9yRWFjaChmdW5jdGlvbiAocikge1xuICAgICAgICAgIHZhciBsYXN0VG8gPSBsYXN0ID8gbGFzdC50bygpIDogMDtcblxuICAgICAgICAgIGlmIChyZW1haW5pbmcgJiYgci5wcmljZSgpKSB7XG4gICAgICAgICAgICBpZiAoci50bygpKSB7XG4gICAgICAgICAgICAgIHJlbWFpbmluZyAtPSByLnRvKCkgLSBsYXN0VG87XG5cbiAgICAgICAgICAgICAgaWYgKHJlbWFpbmluZyA+IDApIHtcbiAgICAgICAgICAgICAgICB0b3RhbCArPSAoci50bygpIC0gbGFzdFRvKSAqIHIucHJpY2UoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0b3RhbCArPSAoci50bygpIC0gbGFzdFRvICsgcmVtYWluaW5nKSAqIHIucHJpY2UoKTtcbiAgICAgICAgICAgICAgICByZW1haW5pbmcgPSAwO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgdG90YWwgKz0gcmVtYWluaW5nICogci5wcmljZSgpO1xuICAgICAgICAgICAgICByZW1haW5pbmcgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGxhc3QgPSByO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdG90YWw6IHRvdGFsIHx8IDAsXG4gICAgICByYW5nZTogcmFuZ2UsXG4gICAgICBjb25kaXRpb246IHNlbGYsXG4gICAgfTtcbiAgfTtcblxuICBzZWxmLmFkZFJhbmdlID0gZnVuY3Rpb24gKGkpIHtcbiAgICB2YXIgcmFuZ2UgPSBuZXcgQ29uZGl0aW9uUmFuZ2Uoc2VsZik7XG5cbiAgICByYW5nZS50byhpLnRvKTtcbiAgICByYW5nZS5wcmljZShpLnByaWNlKTtcbiAgICByYW5nZS5wZXJjZW50YWdlKGkucGVyY2VudGFnZSk7XG5cbiAgICBzZWxmLnJhbmdlcy5wdXNoKHJhbmdlKTtcbiAgfTtcblxuICAhcHJldmVudFJhbmdlSW5pdCAmJiBpbml0aWFsaXplTmV3UmFuZ2UoKTtcblxuICBmdW5jdGlvbiBpbml0aWFsaXplTmV3UmFuZ2UoKSB7XG4gICAgc2VsZi5yYW5nZXMucHVzaChuZXcgQ29uZGl0aW9uUmFuZ2Uoc2VsZikpO1xuICB9XG5cbiAgZnVuY3Rpb24gc3Vic2NyaWJlUmFuZ2UocmFuZ2UpIHtcbiAgICBbXG4gICAgICAndG8nLFxuICAgIF0ubWFwKGZ1bmN0aW9uIChmKSB7XG4gICAgICByZXR1cm4gcmFuZ2VbZl0uc3Vic2NyaWJlKGFkZE5ld1JhbmdlKTtcbiAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChzKSB7XG4gICAgICBzdWJzY3JpcHRpb25zLnB1c2gocyk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRSYW5nZUZvcihzdWJzY3JpYmVycykge1xuICAgIHZhciByYW5nZTtcblxuICAgIHNlbGYucmFuZ2VzKCkuZm9yRWFjaChmdW5jdGlvbiAocikge1xuICAgICAgdmFyIGlzT25SYW5nZSA9IHIudG8oKSA+PSBzdWJzY3JpYmVycztcblxuICAgICAgaWYgKGlzT25SYW5nZSAmJiByLmlzSGlnaGVyVGhhbihyYW5nZSkpIHtcbiAgICAgICAgcmFuZ2UgPSByO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKCFyYW5nZSkge1xuICAgICAgcmFuZ2UgPSBzZWxmLnJhbmdlcygpLmZpbHRlcihmdW5jdGlvbiAocikge1xuICAgICAgICByZXR1cm4gKHIucHJpY2UoKSB8fCByLnBlcmNlbnRhZ2UoKSkgJiYgIXIudG8oKTtcbiAgICAgIH0pWzBdO1xuICAgIH1cblxuICAgIHJldHVybiByYW5nZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZE5ld1JhbmdlKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBkaXNwb3NlU3Vic2NyaXB0aW9ucygpO1xuICAgICAgaW5pdGlhbGl6ZU5ld1JhbmdlKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZGlzcG9zZVN1YnNjcmlwdGlvbnMoKSB7XG4gICAgc3Vic2NyaXB0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIHMuZGlzcG9zZSgpO1xuICAgICAgfSk7XG4gICAgc3Vic2NyaXB0aW9ucyA9IFtdO1xuICB9XG59XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBNb250aCA9IHJlcXVpcmUoJy4vbW9udGguanMnKTtcbnZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcnKTtcbnZhciBkYiA9IHJlcXVpcmUoJy4uLy4uL2RiJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udHJhY3RQcmVtaXVtO1xuXG5mdW5jdGlvbiBDb250cmFjdFByZW1pdW0oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGpzb247XG5cbiAgc2VsZi5iaWxsaW5nTWV0aG9kcyA9IFtjb25maWcuYmlsbGluZ01ldGhvZHMuZmxhdEZlZSwgY29uZmlnLmJpbGxpbmdNZXRob2RzLnJldmVudWVTaGFyZSwgY29uZmlnLmJpbGxpbmdNZXRob2RzLmFjdHVhbFN1YnNjcmliZXJzXTtcbiAgc2VsZi5wcmljZU1ldGhvZHMgPSBbY29uZmlnLnByaWNlTWV0aG9kcy5yYW5nZSwgY29uZmlnLnByaWNlTWV0aG9kcy5pbmNyZW1lbnRhbF07XG4gIHNlbGYuaW52b2ljZUdyb3VwcyA9IGNvbmZpZy5pbnZvaWNlR3JvdXBzO1xuICBzZWxmLnNlcnZpY2VUeXBlcyA9IGNvbmZpZy5zZXJ2aWNlVHlwZXM7XG4gIHNlbGYuc3Vic2NyaWJlcnNQYWNrYWdlcyA9IGNvbmZpZy5zdWJzY3JpYmVyc1BhY2thZ2VzO1xuICBzZWxmLm1vbnRocyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xuICBzZWxmLnNlbGVjdGVkQ29uZGl0aW9uID0ga28ub2JzZXJ2YWJsZSgpO1xuICBzZWxmLmRlbW9Nb2RlID0ga28ub2JzZXJ2YWJsZSgpO1xuICBzZWxmLnRlc3QgPSB0ZXN0O1xuICBzZWxmLnNhdmUgPSBzYXZlO1xuXG4gIHNlbGYuY2xlYXJEYXRhID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChnbG9iYWwuY29uZmlybSgnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGNsZWFyIGFsbCBkYXRhPycpKSB7XG4gICAgICBkYignbW9udGhzJykuY2xlYXIoKTtcbiAgICAgIGNyZWF0ZUluaXRpYWxEYXRhKCk7XG4gICAgfVxuICB9O1xuXG4gIGNyZWF0ZUluaXRpYWxEYXRhKCk7XG5cbiAgdHJ5XG4gIHtcbiAgICBkYignbW9udGhzJykuZ2V0KCkuZm9yRWFjaChmdW5jdGlvbiAobSkge1xuICAgICAgdmFyIG1vbnRoID0gc2VsZi5tb250aHMoKVttLm51bWJlciAtIDFdO1xuXG4gICAgICBpZiAobW9udGgpIHtcbiAgICAgICAgbW9udGguaW5pdGlhbGl6ZShtKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICAvLyBqdXN0IGluIGNhc2VcbiAgY2F0Y2goZXJyKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3Igd2hpbGUgdHJ5aW5nIHRvIGZldGNoIGRhdGEgOiggXFxuJyArXG4gICAgICAnICBUaGUgbWVzc2FnZSB3YXM6ICcgKyBlcnIubWVzc2FnZSArICdcXG4nICtcbiAgICAgICcgIEhhdmUgZnVuIGxvb2tpbmcgb3ZlciB0aGUgc3RhY2s6IFxcbicsIGVyci5zdGFjayk7XG5cbiAgICAvLyBldmVyeXRoaW5nIHdlbnQgd3JvbmcsIGNsZWFyIG1vbnRocyBhbmQgcmUtdHJ5XG4gICAgY3JlYXRlSW5pdGlhbERhdGEoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUluaXRpYWxEYXRhKCkge1xuICAgIHNlbGYubW9udGhzKFtdKTtcbiAgICBnZXRJbml0aWFsTW9udGhzKCkuZm9yRWFjaChhZGRNb250aCk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRJbml0aWFsTW9udGhzKCkge1xuICAgIHJldHVybiBbMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTAsIDExLCAxMl0ubWFwKGZ1bmN0aW9uIChpKSB7XG4gICAgICByZXR1cm4gbmV3IE1vbnRoKGksIHNlbGYpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gdGVzdCgpIHtcbiAgICBzYXZlKCk7XG4gICAgZ2xvYmFsLmxvY2F0aW9uLmhyZWYgPSAndGVzdC5odG1sJztcbiAgfVxuXG4gIGZ1bmN0aW9uIHNhdmUoKSB7XG4gICAgdmFyIGRhdGEgPSBzZWxmLm1vbnRocygpLm1hcChmdW5jdGlvbiAobSkge1xuICAgICAgcmV0dXJuIG0uZ2V0TW9udGhEYXRhKCk7XG4gICAgfSk7XG5cbiAgICBkYignbW9udGhzJykuc2F2ZShkYXRhKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZE1vbnRoKG1vbnRoKSB7XG4gICAgc2VsZi5tb250aHMucHVzaChtb250aCk7XG4gIH1cblxuICBnbG9iYWwub25iZWZvcmV1bmxvYWQgPSBzYXZlO1xufVxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBDb250cmFjdCA9IHJlcXVpcmUoJy4vY29udHJhY3QuanMnKTtcbnZhciBDb250cmFjdFRlc3QgPSByZXF1aXJlKCcuL3Rlc3QuanMnKTtcbnZhciBNb250aCA9IHJlcXVpcmUoJy4vbW9udGguanMnKTtcbnZhciBDb25kaXRpb24gPSByZXF1aXJlKCcuL2NvbmRpdGlvbi5qcycpO1xudmFyIFJhbmdlID0gcmVxdWlyZSgnLi9yYW5nZS5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQ29udHJhY3Q6IENvbnRyYWN0LFxuICBDb250cmFjdFRlc3Q6IENvbnRyYWN0VGVzdCxcbiAgTW9udGg6IE1vbnRoLFxuICBDb25kaXRpb246IENvbmRpdGlvbixcbiAgUmFuZ2U6IFJhbmdlLFxufTtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIENvbmRpdGlvbiA9IHJlcXVpcmUoJy4vY29uZGl0aW9uLmpzJyk7XG52YXIgUHJvZHVjdCA9IHJlcXVpcmUoJy4vcHJvZHVjdC5qcycpO1xudmFyIG1vbnRocyA9IFsnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsICdKdWx5JywgJ0F1Z3VzdCcsICdTZXB0ZW1iZXInLCAnT2N0b2JlcicsICdOb3ZlbWJlcicsICdEZWNlbWJlciddO1xudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1vbnRoO1xuXG5mdW5jdGlvbiBNb250aChudW1iZXIsIHBhcmVudCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgc2VsZi5uYW1lID0gbW9udGhzW251bWJlciAtIDFdO1xuICBzZWxmLm51bWJlciA9IG51bWJlcjtcbiAgc2VsZi5wcm9kdWN0cyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xuXG4gIHNlbGYuc2hvd0Nsb25lID0ga28ub2JzZXJ2YWJsZSgpO1xuICBzZWxmLmNsb25lUHJvZHVjdCA9IGtvLm9ic2VydmFibGUoKTtcbiAgc2VsZi5jbG9uZU1vbnRocyA9IGtvLm51bWVyaWNPYnNlcnZhYmxlKCk7XG5cbiAgc2VsZi5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaSA9IHBhcmVudC5tb250aHMoKS5pbmRleE9mKHNlbGYpICsgMTtcbiAgICB2YXIgZW5kID0gaSArIChzZWxmLmNsb25lTW9udGhzKCkgfHwgMCk7XG4gICAgdmFyIG1vbnRoO1xuXG4gICAgZm9yICg7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgbW9udGggPSBwYXJlbnQubW9udGhzKClbaV07XG5cbiAgICAgIGlmIChtb250aCAmJiBzZWxmLmNsb25lUHJvZHVjdCgpKSB7XG4gICAgICAgIGNsb25lUHJvZHVjdChzZWxmLmNsb25lUHJvZHVjdCgpKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKG1vbnRoKSB7XG4gICAgICAgIHNlbGYucHJvZHVjdHMoKS5mb3JFYWNoKGNsb25lUHJvZHVjdCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2VsZi5oaWRlQ2xvbmUoKTtcblxuICAgIGZ1bmN0aW9uIGNsb25lUHJvZHVjdChwcm9kdWN0KSB7XG4gICAgICBtb250aC5hZGRQcm9kdWN0KHByb2R1Y3QuZ2V0UHJvZHVjdERhdGEoKSk7XG4gICAgfVxuICB9O1xuXG4gIHNlbGYuaGlkZUNsb25lID0gZnVuY3Rpb24gKCkge1xuICAgIHNlbGYuY2xvbmVQcm9kdWN0KG51bGwpO1xuICAgIHNlbGYuY2xvbmVNb250aHMobnVsbCk7XG4gICAgc2VsZi5zaG93Q2xvbmUoZmFsc2UpO1xuICB9O1xuXG4gIHNlbGYuJGxhc3QgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHBhcmVudC5tb250aHMoKVtwYXJlbnQubW9udGhzKCkubGVuZ3RoIC0gMV0gPT09IHNlbGY7XG4gIH0pO1xuXG4gIHNlbGYuY29weUZyb20gPSBmdW5jdGlvbiAobW9udGgpIHtcbiAgICB2YXIgZGF0YSA9IG1vbnRoLmdldE1vbnRoRGF0YSgpO1xuXG4gICAgc2VsZi5pbml0aWFsaXplKGRhdGEpO1xuICB9O1xuXG4gIHNlbGYuYWRkUHJvZHVjdCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICB2YXIgcHJvZHVjdCA9IG5ldyBQcm9kdWN0KHNlbGYpO1xuXG4gICAgaWYgKG9iaikge1xuICAgICAgcHJvZHVjdC5zdW1tYXJ5Q29uZGl0aW9uKG9iai5zdW1tYXJ5Q29uZGl0aW9uKTtcbiAgICAgIHByb2R1Y3QuZGVmYXVsdFN1YnNjcmliZXJzKG9iai5kZWZhdWx0U3Vic2NyaWJlcnMpO1xuICAgICAgcHJvZHVjdC5pbnZvaWNlR3JvdXAoY29uZmlnLmdldEJ5TmFtZShjb25maWcuaW52b2ljZUdyb3Vwcywgb2JqLmludm9pY2VHcm91cCkpO1xuICAgICAgcHJvZHVjdC5zdWJzY3JpYmVyc1BhY2thZ2UoY29uZmlnLmdldEJ5TmFtZShjb25maWcuc3Vic2NyaWJlcnNQYWNrYWdlcywgb2JqLnN1YnNjcmliZXJzUGFja2FnZSkpO1xuICAgICAgcHJvZHVjdC5wcm9kdWN0KGNvbmZpZy5nZXRCeU5hbWUoY29uZmlnLnByb2R1Y3RzLCBvYmoucHJvZHVjdCkpO1xuICAgICAgcHJvZHVjdC5jYXRlZ29yeShvYmouY2F0ZWdvcnkpO1xuXG4gICAgICAob2JqLmNvbmRpdGlvbnMgfHwgW10pLmZvckVhY2gocHJvZHVjdC5hZGRDb25kaXRpb24pO1xuICAgIH1cblxuICAgIHNlbGYucHJvZHVjdHMucHVzaChwcm9kdWN0KTtcblxuICAgIGlmICghb2JqKSB7XG4gICAgICBwcm9kdWN0LmFuaW1hdGUodHJ1ZSk7XG4gICAgICBnbG9iYWwubG9jYXRpb24uaHJlZiA9ICcjcHJvZHVjdC0nICsgbnVtYmVyICsgJy0nICsgc2VsZi5wcm9kdWN0cygpLmluZGV4T2YocHJvZHVjdCk7XG4gICAgICBnbG9iYWwuc2Nyb2xsVG8oZ2xvYmFsLnNjcm9sbFgsIGdsb2JhbC5zY3JvbGxZIC0gMTApO1xuICAgIH1cbiAgfTtcblxuICBzZWxmLmdldE1vbnRoRGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcHJvZHVjdHM6IHNlbGYucHJvZHVjdHMoKS5tYXAoZnVuY3Rpb24gKHApIHtcbiAgICAgICAgcmV0dXJuIHAuZ2V0UHJvZHVjdERhdGEoKTtcbiAgICAgIH0pLFxuICAgICAgbnVtYmVyOiBudW1iZXIsXG4gICAgICBuYW1lOiBzZWxmLm5hbWUsXG4gICAgfTtcbiAgfTtcblxuICBzZWxmLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHNlbGYucHJvZHVjdHMoW10pO1xuXG4gICAgKGRhdGEucHJvZHVjdHMgfHwgW10pLmZvckVhY2goc2VsZi5hZGRQcm9kdWN0KTtcbiAgfTtcbn1cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnJyk7XG52YXIgYmlsbGluZ01ldGhvZHMgPSByZXF1aXJlKCcuLi9jb25maWcnKS5iaWxsaW5nTWV0aG9kcztcbnZhciBwcmljZU1ldGhvZHMgPSByZXF1aXJlKCcuLi9jb25maWcnKS5wcmljZU1ldGhvZHM7XG52YXIgQ29uZGl0aW9uID0gcmVxdWlyZSgnLi9jb25kaXRpb24uanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9kdWN0O1xuXG5mdW5jdGlvbiBQcm9kdWN0KHBhcmVudCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBzdWJzY3JpcHRpb25zID0gW107XG4gIHZhciBpc1NvcnRpbmc7XG5cbiAgc2VsZi5pbnZvaWNlR3JvdXAgPSBrby5vYnNlcnZhYmxlKCk7XG4gIHNlbGYucHJvZHVjdCA9IGtvLm9ic2VydmFibGUoKTtcbiAgc2VsZi5zdWJzY3JpYmVyc1BhY2thZ2UgPSBrby5vYnNlcnZhYmxlKCk7XG4gIHNlbGYuY2F0ZWdvcnkgPSBrby5vYnNlcnZhYmxlKCk7XG4gIHNlbGYucHJpY2UgPSBrby5udW1lcmljT2JzZXJ2YWJsZSgpO1xuICBzZWxmLmRlZmF1bHRTdWJzY3JpYmVycyA9IGtvLm51bWVyaWNPYnNlcnZhYmxlKCk7XG4gIHNlbGYuY29uZGl0aW9ucyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xuICBzZWxmLnN1bW1hcnlDb25kaXRpb24gPSBrby5vYnNlcnZhYmxlKCdsb3dlcicpO1xuICBzZWxmLmFuaW1hdGUgPSBrby5vYnNlcnZhYmxlKCk7XG4gIHNlbGYubW9udGggPSBmdW5jdGlvbiAoKSB7IHJldHVybiBwYXJlbnQ7IH07XG4gIHNlbGYubmFtZSA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gc2VsZi5wcm9kdWN0KCkgJiYgc2VsZi5wcm9kdWN0KCkubmFtZTtcbiAgfSk7XG5cbiAgc2VsZi5lcXVhbHMgPSBmdW5jdGlvbiAocHJvZHVjdCkge1xuICAgIHJldHVybiBwcm9kdWN0LnByb2R1Y3QoKSA9PT0gc2VsZi5wcm9kdWN0KCkgJiZcbiAgICAgIHByb2R1Y3QuaW52b2ljZUdyb3VwKCkgPT09IHNlbGYuaW52b2ljZUdyb3VwKCkgJiZcbiAgICAgIHByb2R1Y3Quc3Vic2NyaWJlcnNQYWNrYWdlKCkgPT09IHNlbGYuc3Vic2NyaWJlcnNQYWNrYWdlKCkgJiZcbiAgICAgIHByb2R1Y3QuY2F0ZWdvcnkoKSA9PT0gc2VsZi5jYXRlZ29yeSgpO1xuICB9O1xuXG4gIHNlbGYuY2FsY3VsYXRlID0gZnVuY3Rpb24gKHN1YnNjcmliZXJzLCByZXRhaWxQcmljZSkge1xuICAgIHZhciB0b3RhbCwgc2VsZWN0ZWQ7XG4gICAgdmFyIGNvbmRpdGlvbiA9IHNlbGYuc3VtbWFyeUNvbmRpdGlvbigpO1xuICAgIHZhciByZXN1bHRzID0gc2VsZi5jb25kaXRpb25zKCkubWFwKGZ1bmN0aW9uIChjKSB7XG4gICAgICByZXR1cm4gYy5jYWxjdWxhdGUoc3Vic2NyaWJlcnMsIHJldGFpbFByaWNlKTtcbiAgICB9KTtcbiAgICB2YXIgdG90YWxzID0gcmVzdWx0cy5tYXAoZnVuY3Rpb24gKHIpIHsgcmV0dXJuIHIudG90YWw7IH0pO1xuXG4gICAgaWYgKGNvbmRpdGlvbiA9PT0gJ2xvd2VyJykge1xuICAgICAgdG90YWwgPSB0b3RhbHMuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYSAtIGI7IH0pWzBdO1xuICAgIH1cbiAgICBlbHNlIGlmIChjb25kaXRpb24gPT09ICdoaWdoZXInKSB7XG4gICAgICB0b3RhbCA9IHRvdGFscy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhIC0gYjsgfSlbdG90YWxzLmxlbmd0aCAtIDFdO1xuICAgIH1cbiAgICBlbHNlIGlmIChjb25kaXRpb24gPT09ICdhdmVyYWdlJykge1xuICAgICAgdG90YWwgPSB0b3RhbHMucmVkdWNlKGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhICsgYjsgfSwgMCkgLyB0b3RhbHMubGVuZ3RoO1xuICAgIH1cbiAgICBlbHNlIGlmIChjb25kaXRpb24gPT09ICdzdW0nKSB7XG4gICAgICB0b3RhbCA9IHRvdGFscy5yZWR1Y2UoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGEgKyBiOyB9LCAwKTtcbiAgICB9XG5cbiAgICBzZWxlY3RlZCA9IGNvbmRpdGlvbiAhPT0gJ2F2ZXJhZ2UnICYmIHJlc3VsdHMubGVuZ3RoID4gMSA/IHJlc3VsdHMuZmlsdGVyKGZ1bmN0aW9uIChyKSB7IHJldHVybiByLnRvdGFsID09PSB0b3RhbDsgfSlbMF0gOiBudWxsO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRvdGFsOiB0b3RhbCB8fCAwLFxuICAgICAgY29uZGl0aW9uczogcmVzdWx0cyxcbiAgICAgIHNlbGVjdGVkOiBzZWxlY3RlZCAmJiBzZWxlY3RlZC5jb25kaXRpb24sXG4gICAgfTtcbiAgfTtcblxuICBzZWxmLiRsYXN0ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBwYXJlbnQucHJvZHVjdHMoKVtwYXJlbnQucHJvZHVjdHMoKS5sZW5ndGggLSAxXSA9PT0gc2VsZjtcbiAgfSk7XG5cbiAgc2VsZi5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGdsb2JhbC5jb25maXJtKCdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcmVtb3ZlIHRoaXMgcHJvZHVjdD8nKSkge1xuICAgICAgdmFyIHJlc3VsdCA9IHBhcmVudC5wcm9kdWN0cygpXG4gICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKHApIHsgcmV0dXJuIHAgIT09IHNlbGY7IH0pO1xuXG4gICAgICBwYXJlbnQucHJvZHVjdHMocmVzdWx0KTtcbiAgICB9XG4gIH07XG5cbiAgc2VsZi5hZGRDb25kaXRpb24gPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgY29uZGl0aW9uLCBiaWxsaW5nTWV0aG9kO1xuXG4gICAgLy8gb2JqIGNvdWxkIGJlIGEgYmlsbGluZyBtZXRob2Qgb3IgYSBjb25kaXRpb25cbiAgICBpZiAoY29uZmlnLmdldChjb25maWcuYmlsbGluZ01ldGhvZHMpLmluZGV4T2Yob2JqKSA+IC0xKSB7XG4gICAgICBjb25kaXRpb24gPSBuZXcgQ29uZGl0aW9uKG9iaiwgc2VsZik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgYmlsbGluZ01ldGhvZCA9IGNvbmZpZy5nZXRCeU5hbWUoY29uZmlnLmJpbGxpbmdNZXRob2RzLCBvYmouYmlsbGluZ01ldGhvZCk7XG4gICAgICBjb25kaXRpb24gPSBuZXcgQ29uZGl0aW9uKGJpbGxpbmdNZXRob2QsIHNlbGYsIChvYmoucmFuZ2VzICYmIG9iai5yYW5nZXMubGVuZ3RoKSk7XG5cbiAgICAgIGNvbmRpdGlvbi5wcmljZShvYmoucHJpY2UpO1xuICAgICAgY29uZGl0aW9uLm1pbmltdW1HdWFyYW50ZWVkKG9iai5taW5pbXVtR3VhcmFudGVlZCk7XG4gICAgICBjb25kaXRpb24ucHJpY2VNZXRob2QoY29uZmlnLmdldEJ5TmFtZShjb25maWcucHJpY2VNZXRob2RzLCBvYmoucHJpY2VNZXRob2QpKTtcblxuICAgICAgKG9iai5yYW5nZXMgfHwgW10pLmZvckVhY2goY29uZGl0aW9uLmFkZFJhbmdlKTtcbiAgICB9XG5cbiAgICBzZWxmLmNvbmRpdGlvbnMucHVzaChjb25kaXRpb24pO1xuICB9O1xuXG4gIHNlbGYuZ2V0UHJvZHVjdERhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN1bW1hcnlDb25kaXRpb246IHNlbGYuc3VtbWFyeUNvbmRpdGlvbigpLFxuICAgICAgaW52b2ljZUdyb3VwOiBzZWxmLmludm9pY2VHcm91cCgpICYmIHNlbGYuaW52b2ljZUdyb3VwKCkubmFtZSxcbiAgICAgIHN1YnNjcmliZXJzUGFja2FnZTogc2VsZi5zdWJzY3JpYmVyc1BhY2thZ2UoKSAmJiBzZWxmLnN1YnNjcmliZXJzUGFja2FnZSgpLm5hbWUsXG4gICAgICBwcm9kdWN0OiBzZWxmLnByb2R1Y3QoKSAmJiBzZWxmLnByb2R1Y3QoKS5uYW1lLFxuICAgICAgY2F0ZWdvcnk6IHNlbGYuY2F0ZWdvcnkoKSxcbiAgICAgIGRlZmF1bHRTdWJzY3JpYmVyczogc2VsZi5kZWZhdWx0U3Vic2NyaWJlcnMoKSxcbiAgICAgIGNvbmRpdGlvbnM6IHNlbGYuY29uZGl0aW9ucygpLm1hcChmdW5jdGlvbiAoYykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGJpbGxpbmdNZXRob2Q6IGMuYmlsbGluZ01ldGhvZC5uYW1lLFxuICAgICAgICAgIHByaWNlTWV0aG9kOiBjLnByaWNlTWV0aG9kKCkgJiYgYy5wcmljZU1ldGhvZCgpLm5hbWUsXG4gICAgICAgICAgbWluaW11bUd1YXJhbnRlZWQ6IGMubWluaW11bUd1YXJhbnRlZWQoKSxcbiAgICAgICAgICBwcmljZTogYy5wcmljZSgpLFxuICAgICAgICAgIHJhbmdlczogYy5yYW5nZXMoKS5tYXAoZnVuY3Rpb24gKHIpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHRvOiByLnRvKCksXG4gICAgICAgICAgICAgIHByaWNlOiByLnByaWNlKCksXG4gICAgICAgICAgICAgIHBlcmNlbnRhZ2U6IHIucGVyY2VudGFnZSgpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KVxuICAgICAgICB9O1xuICAgICAgfSlcbiAgICB9O1xuICB9O1xufVxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gQ29uZGl0aW9uUmFuZ2U7XG5cbmZ1bmN0aW9uIENvbmRpdGlvblJhbmdlKHBhcmVudCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgc2VsZi50byA9IGtvLm51bWVyaWNPYnNlcnZhYmxlKCk7XG4gIHNlbGYucHJpY2UgPSBrby5udW1lcmljT2JzZXJ2YWJsZSgpO1xuICBzZWxmLnBlcmNlbnRhZ2UgPSBrby5udW1lcmljT2JzZXJ2YWJsZSgpO1xuXG4gIHNlbGYucmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBpc0xhc3QgPSBzZWxmID09PSBwYXJlbnQucmFuZ2VzKClbcGFyZW50LnJhbmdlcygpLmxlbmd0aCAtIDFdO1xuICAgIHZhciBpc0Fub3RoZXJJbmZpbml0eSA9IHBhcmVudC5yYW5nZXMoKS5maWx0ZXIoZnVuY3Rpb24gKHIpIHsgcmV0dXJuIHIgIT09IHNlbGYgJiYgIXIudG8oKTsgfSkubGVuZ3RoO1xuXG4gICAgaWYgKChwYXJlbnQucmFuZ2VzKCkubGVuZ3RoID4gMSAmJiAhaXNMYXN0KSB8fCBpc0Fub3RoZXJJbmZpbml0eSkge1xuICAgICAgdmFyIHJlc3VsdCA9IHBhcmVudC5yYW5nZXMoKVxuICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChyKSB7IHJldHVybiByICE9PSBzZWxmOyB9KTtcbiAgICAgIHBhcmVudC5yYW5nZXMocmVzdWx0KTtcbiAgICB9XG4gIH07XG5cbiAgc2VsZi4kbGFzdCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gcGFyZW50LnJhbmdlcygpW3BhcmVudC5yYW5nZXMoKS5sZW5ndGggLSAxXSA9PT0gc2VsZjtcbiAgfSk7XG5cbiAgW3NlbGYudG8sIHNlbGYucHJpY2UsIHNlbGYucGVyY2VudGFnZV0uZm9yRWFjaChmdW5jdGlvbiAoZikge1xuICAgIGYuc3Vic2NyaWJlKGZ1bmN0aW9uICh2KSB7XG4gICAgICBpZiAoIXNlbGYudG8oKSAmJiAhc2VsZi5wcmljZSgpICYmICFzZWxmLnBlcmNlbnRhZ2UoKSkge1xuICAgICAgICBzZWxmLnJlbW92ZSgpO1xuICAgICAgfVxuICAgICAgaWYgKCFzZWxmLnRvKCkgJiYgIXNlbGYuJGxhc3QoKSAmJiBwYXJlbnQucmFuZ2VzKCkubGVuZ3RoKSB7XG4gICAgICAgIHBhcmVudC5yYW5nZXMoKVtwYXJlbnQucmFuZ2VzKCkubGVuZ3RoIC0gMV0ucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHNlbGYuaXNIaWdoZXJUaGFuID0gZnVuY3Rpb24gKHIpIHtcbiAgICByZXR1cm4gIXIgfHwgKHNlbGYudG8oKSA8IHIudG8oKSk7XG4gIH07XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBNb250aCA9IHJlcXVpcmUoJy4vbW9udGguanMnKTtcbnZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcnKTtcbnZhciBkYiA9IHJlcXVpcmUoJy4uLy4uL2RiJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udHJhY3RUZXN0O1xuXG5mdW5jdGlvbiBDb250cmFjdFRlc3QoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIHRlc3RGaWVsZHMgPSBbJ3Rlc3RSZXRhaWxQcmljZScsICd0ZXN0U3Vic2NyaWJlcnMnXTtcblxuICBzZWxmLm1vbnRocyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xuICBzZWxmLnRlc3RSZXN1bHQgPSBrby5jb21wdXRlZChnZXRUb3RhbChzZWxmLm1vbnRocykpO1xuXG4gIGRiKCdtb250aHMnKS5nZXQoKS5mb3JFYWNoKGZ1bmN0aW9uIChtKSB7XG4gICAgdmFyIG1vbnRoID0gbmV3IE1vbnRoKG0ubnVtYmVyLCBzZWxmKTtcblxuICAgIG1vbnRoLmluaXRpYWxpemUobSk7XG4gICAgbW9udGgucHJvZHVjdHMoKS5mb3JFYWNoKGZ1bmN0aW9uIChwKSB7IHNldEFzVGVzdGluZyhwLCBtb250aCk7IH0pO1xuICAgIG1vbnRoLnRlc3RSZXN1bHQgPSBrby5jb21wdXRlZChnZXRUb3RhbChtb250aC5wcm9kdWN0cykpO1xuXG4gICAgc2VsZi5tb250aHMucHVzaChtb250aCk7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGdldFRvdGFsKGxpc3QpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHRvdGFscyA9IGxpc3QoKS5tYXAoZnVuY3Rpb24gKHApIHtcbiAgICAgICAgcmV0dXJuIHAudGVzdFJlc3VsdCgpO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiB0b3RhbHMucmVkdWNlKGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhICsgYjsgfSwgMCk7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEFzVGVzdGluZyhwcm9kdWN0LCBtb250aCkge1xuICAgIHByb2R1Y3QudGVzdFJldGFpbFByaWNlID0ga28ubnVtZXJpY09ic2VydmFibGUoKTtcbiAgICBwcm9kdWN0LnRlc3RTdWJzY3JpYmVycyA9IGtvLm51bWVyaWNPYnNlcnZhYmxlKCk7XG4gICAgcHJvZHVjdC50ZXN0UmVzdWx0ID0ga28ubnVtZXJpY09ic2VydmFibGUoKTtcbiAgICBwcm9kdWN0LmNvbmRpdGlvbnMoKS5mb3JFYWNoKGZ1bmN0aW9uIChjKSB7XG4gICAgICBjLmN1cnJlbnRSYW5nZSA9IGtvLm9ic2VydmFibGUoKTtcbiAgICB9KTtcblxuICAgIHRlc3RGaWVsZHNcbiAgICAgIC5tYXAoZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBmaWVsZDogcHJvZHVjdFtpXSxcbiAgICAgICAgICBuYW1lOiBpXG4gICAgICAgIH07XG4gICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChpKSB7XG4gICAgICAgIHZhciBsYXN0ID0ge307XG5cbiAgICAgICAgaS5maWVsZC5zdWJzY3JpYmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNoYW5nZVRlc3REYXRhKHByb2R1Y3QsIGkubmFtZSwgbGFzdCk7XG4gICAgICAgICAgZG9UZXN0KHByb2R1Y3QpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgZG9UZXN0KHByb2R1Y3QpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2hhbmdlVGVzdERhdGEocHJvZHVjdCwgZmllbGQsIGxhc3QpIHtcbiAgICB2YXIgcHJvZHVjdHMgPSBzZWxmLm1vbnRocygpXG4gICAgICAubWFwKGZ1bmN0aW9uIChtKSB7IHJldHVybiBtLnByb2R1Y3RzKCk7IH0pXG4gICAgICAucmVkdWNlKGZ1bmN0aW9uICh4LCB5KSB7IHJldHVybiB4LmNvbmNhdCh5KTsgfSwgW10pO1xuICAgIHZhciBpID0gcHJvZHVjdHMuaW5kZXhPZihwcm9kdWN0KSAtIDE7XG5cbiAgICB3aGlsZSAocHJvZHVjdHNbKytpXSkge1xuICAgICAgaWYgKCFwcm9kdWN0c1tpXVtmaWVsZF0oKSB8fCBwcm9kdWN0c1tpXVtmaWVsZF0oKSA9PT0gbGFzdFtmaWVsZF0pIHtcbiAgICAgICAgcHJvZHVjdHNbaV1bZmllbGRdKHByb2R1Y3RbZmllbGRdKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxhc3RbZmllbGRdID0gcHJvZHVjdFtmaWVsZF0oKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRvVGVzdChwcm9kdWN0KSB7XG4gICAgdmFyIGNhbGMgPSBwcm9kdWN0LmNhbGN1bGF0ZShwcm9kdWN0LnRlc3RTdWJzY3JpYmVycygpIHx8IHByb2R1Y3QuZGVmYXVsdFN1YnNjcmliZXJzKCksIHByb2R1Y3QudGVzdFJldGFpbFByaWNlKCkpO1xuXG4gICAgcHJvZHVjdC50ZXN0UmVzdWx0KGNhbGMudG90YWwpO1xuXG4gICAgY2FsYy5jb25kaXRpb25zLmZvckVhY2goZnVuY3Rpb24gKGMpIHtcbiAgICAgIGMuY29uZGl0aW9uLmN1cnJlbnRSYW5nZShjLnJhbmdlKTtcbiAgICB9KTtcbiAgfVxufVxuIiwiLyohXG4gKiBLbm9ja291dCBKYXZhU2NyaXB0IGxpYnJhcnkgdjMuMi4wXG4gKiAoYykgU3RldmVuIFNhbmRlcnNvbiAtIGh0dHA6Ly9rbm9ja291dGpzLmNvbS9cbiAqIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4gKi9cblxuKGZ1bmN0aW9uKCl7XG52YXIgREVCVUc9dHJ1ZTtcbihmdW5jdGlvbih1bmRlZmluZWQpe1xuICAgIC8vICgwLCBldmFsKSgndGhpcycpIGlzIGEgcm9idXN0IHdheSBvZiBnZXR0aW5nIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0XG4gICAgLy8gRm9yIGRldGFpbHMsIHNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE0MTE5OTg4L3JldHVybi10aGlzLTAtZXZhbHRoaXMvMTQxMjAwMjMjMTQxMjAwMjNcbiAgICB2YXIgd2luZG93ID0gdGhpcyB8fCAoMCwgZXZhbCkoJ3RoaXMnKSxcbiAgICAgICAgZG9jdW1lbnQgPSB3aW5kb3dbJ2RvY3VtZW50J10sXG4gICAgICAgIG5hdmlnYXRvciA9IHdpbmRvd1snbmF2aWdhdG9yJ10sXG4gICAgICAgIGpRdWVyeUluc3RhbmNlID0gd2luZG93W1wialF1ZXJ5XCJdLFxuICAgICAgICBKU09OID0gd2luZG93W1wiSlNPTlwiXTtcbihmdW5jdGlvbihmYWN0b3J5KSB7XG4gICAgLy8gU3VwcG9ydCB0aHJlZSBtb2R1bGUgbG9hZGluZyBzY2VuYXJpb3NcbiAgICBpZiAodHlwZW9mIHJlcXVpcmUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIC8vIFsxXSBDb21tb25KUy9Ob2RlLmpzXG4gICAgICAgIHZhciB0YXJnZXQgPSBtb2R1bGVbJ2V4cG9ydHMnXSB8fCBleHBvcnRzOyAvLyBtb2R1bGUuZXhwb3J0cyBpcyBmb3IgTm9kZS5qc1xuICAgICAgICBmYWN0b3J5KHRhcmdldCwgcmVxdWlyZSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZVsnYW1kJ10pIHtcbiAgICAgICAgLy8gWzJdIEFNRCBhbm9ueW1vdXMgbW9kdWxlXG4gICAgICAgIGRlZmluZShbJ2V4cG9ydHMnLCAncmVxdWlyZSddLCBmYWN0b3J5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBbM10gTm8gbW9kdWxlIGxvYWRlciAocGxhaW4gPHNjcmlwdD4gdGFnKSAtIHB1dCBkaXJlY3RseSBpbiBnbG9iYWwgbmFtZXNwYWNlXG4gICAgICAgIGZhY3Rvcnkod2luZG93WydrbyddID0ge30pO1xuICAgIH1cbn0oZnVuY3Rpb24oa29FeHBvcnRzLCByZXF1aXJlKXtcbi8vIEludGVybmFsbHksIGFsbCBLTyBvYmplY3RzIGFyZSBhdHRhY2hlZCB0byBrb0V4cG9ydHMgKGV2ZW4gdGhlIG5vbi1leHBvcnRlZCBvbmVzIHdob3NlIG5hbWVzIHdpbGwgYmUgbWluaWZpZWQgYnkgdGhlIGNsb3N1cmUgY29tcGlsZXIpLlxuLy8gSW4gdGhlIGZ1dHVyZSwgdGhlIGZvbGxvd2luZyBcImtvXCIgdmFyaWFibGUgbWF5IGJlIG1hZGUgZGlzdGluY3QgZnJvbSBcImtvRXhwb3J0c1wiIHNvIHRoYXQgcHJpdmF0ZSBvYmplY3RzIGFyZSBub3QgZXh0ZXJuYWxseSByZWFjaGFibGUuXG52YXIga28gPSB0eXBlb2Yga29FeHBvcnRzICE9PSAndW5kZWZpbmVkJyA/IGtvRXhwb3J0cyA6IHt9O1xuLy8gR29vZ2xlIENsb3N1cmUgQ29tcGlsZXIgaGVscGVycyAodXNlZCBvbmx5IHRvIG1ha2UgdGhlIG1pbmlmaWVkIGZpbGUgc21hbGxlcilcbmtvLmV4cG9ydFN5bWJvbCA9IGZ1bmN0aW9uKGtvUGF0aCwgb2JqZWN0KSB7XG4gICAgdmFyIHRva2VucyA9IGtvUGF0aC5zcGxpdChcIi5cIik7XG5cbiAgICAvLyBJbiB0aGUgZnV0dXJlLCBcImtvXCIgbWF5IGJlY29tZSBkaXN0aW5jdCBmcm9tIFwia29FeHBvcnRzXCIgKHNvIHRoYXQgbm9uLWV4cG9ydGVkIG9iamVjdHMgYXJlIG5vdCByZWFjaGFibGUpXG4gICAgLy8gQXQgdGhhdCBwb2ludCwgXCJ0YXJnZXRcIiB3b3VsZCBiZSBzZXQgdG86ICh0eXBlb2Yga29FeHBvcnRzICE9PSBcInVuZGVmaW5lZFwiID8ga29FeHBvcnRzIDoga28pXG4gICAgdmFyIHRhcmdldCA9IGtvO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoIC0gMTsgaSsrKVxuICAgICAgICB0YXJnZXQgPSB0YXJnZXRbdG9rZW5zW2ldXTtcbiAgICB0YXJnZXRbdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXV0gPSBvYmplY3Q7XG59O1xua28uZXhwb3J0UHJvcGVydHkgPSBmdW5jdGlvbihvd25lciwgcHVibGljTmFtZSwgb2JqZWN0KSB7XG4gICAgb3duZXJbcHVibGljTmFtZV0gPSBvYmplY3Q7XG59O1xua28udmVyc2lvbiA9IFwiMy4yLjBcIjtcblxua28uZXhwb3J0U3ltYm9sKCd2ZXJzaW9uJywga28udmVyc2lvbik7XG5rby51dGlscyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gb2JqZWN0Rm9yRWFjaChvYmosIGFjdGlvbikge1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIG9iaikge1xuICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgICAgIGFjdGlvbihwcm9wLCBvYmpbcHJvcF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXh0ZW5kKHRhcmdldCwgc291cmNlKSB7XG4gICAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgICAgIGZvcih2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICBpZihzb3VyY2UuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldFByb3RvdHlwZU9mKG9iaiwgcHJvdG8pIHtcbiAgICAgICAgb2JqLl9fcHJvdG9fXyA9IHByb3RvO1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cblxuICAgIHZhciBjYW5TZXRQcm90b3R5cGUgPSAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSk7XG5cbiAgICAvLyBSZXByZXNlbnQgdGhlIGtub3duIGV2ZW50IHR5cGVzIGluIGEgY29tcGFjdCB3YXksIHRoZW4gYXQgcnVudGltZSB0cmFuc2Zvcm0gaXQgaW50byBhIGhhc2ggd2l0aCBldmVudCBuYW1lIGFzIGtleSAoZm9yIGZhc3QgbG9va3VwKVxuICAgIHZhciBrbm93bkV2ZW50cyA9IHt9LCBrbm93bkV2ZW50VHlwZXNCeUV2ZW50TmFtZSA9IHt9O1xuICAgIHZhciBrZXlFdmVudFR5cGVOYW1lID0gKG5hdmlnYXRvciAmJiAvRmlyZWZveFxcLzIvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSA/ICdLZXlib2FyZEV2ZW50JyA6ICdVSUV2ZW50cyc7XG4gICAga25vd25FdmVudHNba2V5RXZlbnRUeXBlTmFtZV0gPSBbJ2tleXVwJywgJ2tleWRvd24nLCAna2V5cHJlc3MnXTtcbiAgICBrbm93bkV2ZW50c1snTW91c2VFdmVudHMnXSA9IFsnY2xpY2snLCAnZGJsY2xpY2snLCAnbW91c2Vkb3duJywgJ21vdXNldXAnLCAnbW91c2Vtb3ZlJywgJ21vdXNlb3ZlcicsICdtb3VzZW91dCcsICdtb3VzZWVudGVyJywgJ21vdXNlbGVhdmUnXTtcbiAgICBvYmplY3RGb3JFYWNoKGtub3duRXZlbnRzLCBmdW5jdGlvbihldmVudFR5cGUsIGtub3duRXZlbnRzRm9yVHlwZSkge1xuICAgICAgICBpZiAoa25vd25FdmVudHNGb3JUeXBlLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBrbm93bkV2ZW50c0ZvclR5cGUubGVuZ3RoOyBpIDwgajsgaSsrKVxuICAgICAgICAgICAgICAgIGtub3duRXZlbnRUeXBlc0J5RXZlbnROYW1lW2tub3duRXZlbnRzRm9yVHlwZVtpXV0gPSBldmVudFR5cGU7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgZXZlbnRzVGhhdE11c3RCZVJlZ2lzdGVyZWRVc2luZ0F0dGFjaEV2ZW50ID0geyAncHJvcGVydHljaGFuZ2UnOiB0cnVlIH07IC8vIFdvcmthcm91bmQgZm9yIGFuIElFOSBpc3N1ZSAtIGh0dHBzOi8vZ2l0aHViLmNvbS9TdGV2ZVNhbmRlcnNvbi9rbm9ja291dC9pc3N1ZXMvNDA2XG5cbiAgICAvLyBEZXRlY3QgSUUgdmVyc2lvbnMgZm9yIGJ1ZyB3b3JrYXJvdW5kcyAodXNlcyBJRSBjb25kaXRpb25hbHMsIG5vdCBVQSBzdHJpbmcsIGZvciByb2J1c3RuZXNzKVxuICAgIC8vIE5vdGUgdGhhdCwgc2luY2UgSUUgMTAgZG9lcyBub3Qgc3VwcG9ydCBjb25kaXRpb25hbCBjb21tZW50cywgdGhlIGZvbGxvd2luZyBsb2dpYyBvbmx5IGRldGVjdHMgSUUgPCAxMC5cbiAgICAvLyBDdXJyZW50bHkgdGhpcyBpcyBieSBkZXNpZ24sIHNpbmNlIElFIDEwKyBiZWhhdmVzIGNvcnJlY3RseSB3aGVuIHRyZWF0ZWQgYXMgYSBzdGFuZGFyZCBicm93c2VyLlxuICAgIC8vIElmIHRoZXJlIGlzIGEgZnV0dXJlIG5lZWQgdG8gZGV0ZWN0IHNwZWNpZmljIHZlcnNpb25zIG9mIElFMTArLCB3ZSB3aWxsIGFtZW5kIHRoaXMuXG4gICAgdmFyIGllVmVyc2lvbiA9IGRvY3VtZW50ICYmIChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZlcnNpb24gPSAzLCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSwgaUVsZW1zID0gZGl2LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpJyk7XG5cbiAgICAgICAgLy8gS2VlcCBjb25zdHJ1Y3RpbmcgY29uZGl0aW9uYWwgSFRNTCBibG9ja3MgdW50aWwgd2UgaGl0IG9uZSB0aGF0IHJlc29sdmVzIHRvIGFuIGVtcHR5IGZyYWdtZW50XG4gICAgICAgIHdoaWxlIChcbiAgICAgICAgICAgIGRpdi5pbm5lckhUTUwgPSAnPCEtLVtpZiBndCBJRSAnICsgKCsrdmVyc2lvbikgKyAnXT48aT48L2k+PCFbZW5kaWZdLS0+JyxcbiAgICAgICAgICAgIGlFbGVtc1swXVxuICAgICAgICApIHt9XG4gICAgICAgIHJldHVybiB2ZXJzaW9uID4gNCA/IHZlcnNpb24gOiB1bmRlZmluZWQ7XG4gICAgfSgpKTtcbiAgICB2YXIgaXNJZTYgPSBpZVZlcnNpb24gPT09IDYsXG4gICAgICAgIGlzSWU3ID0gaWVWZXJzaW9uID09PSA3O1xuXG4gICAgZnVuY3Rpb24gaXNDbGlja09uQ2hlY2thYmxlRWxlbWVudChlbGVtZW50LCBldmVudFR5cGUpIHtcbiAgICAgICAgaWYgKChrby51dGlscy50YWdOYW1lTG93ZXIoZWxlbWVudCkgIT09IFwiaW5wdXRcIikgfHwgIWVsZW1lbnQudHlwZSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAoZXZlbnRUeXBlLnRvTG93ZXJDYXNlKCkgIT0gXCJjbGlja1wiKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHZhciBpbnB1dFR5cGUgPSBlbGVtZW50LnR5cGU7XG4gICAgICAgIHJldHVybiAoaW5wdXRUeXBlID09IFwiY2hlY2tib3hcIikgfHwgKGlucHV0VHlwZSA9PSBcInJhZGlvXCIpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGZpZWxkc0luY2x1ZGVkV2l0aEpzb25Qb3N0OiBbJ2F1dGhlbnRpY2l0eV90b2tlbicsIC9eX19SZXF1ZXN0VmVyaWZpY2F0aW9uVG9rZW4oXy4qKT8kL10sXG5cbiAgICAgICAgYXJyYXlGb3JFYWNoOiBmdW5jdGlvbiAoYXJyYXksIGFjdGlvbikge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBhcnJheS5sZW5ndGg7IGkgPCBqOyBpKyspXG4gICAgICAgICAgICAgICAgYWN0aW9uKGFycmF5W2ldLCBpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBhcnJheUluZGV4T2Y6IGZ1bmN0aW9uIChhcnJheSwgaXRlbSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoYXJyYXksIGl0ZW0pO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBhcnJheS5sZW5ndGg7IGkgPCBqOyBpKyspXG4gICAgICAgICAgICAgICAgaWYgKGFycmF5W2ldID09PSBpdGVtKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfSxcblxuICAgICAgICBhcnJheUZpcnN0OiBmdW5jdGlvbiAoYXJyYXksIHByZWRpY2F0ZSwgcHJlZGljYXRlT3duZXIpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gYXJyYXkubGVuZ3RoOyBpIDwgajsgaSsrKVxuICAgICAgICAgICAgICAgIGlmIChwcmVkaWNhdGUuY2FsbChwcmVkaWNhdGVPd25lciwgYXJyYXlbaV0sIGkpKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJyYXlbaV07XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSxcblxuICAgICAgICBhcnJheVJlbW92ZUl0ZW06IGZ1bmN0aW9uIChhcnJheSwgaXRlbVRvUmVtb3ZlKSB7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBrby51dGlscy5hcnJheUluZGV4T2YoYXJyYXksIGl0ZW1Ub1JlbW92ZSk7XG4gICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICAgICAgYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgYXJyYXkuc2hpZnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBhcnJheUdldERpc3RpbmN0VmFsdWVzOiBmdW5jdGlvbiAoYXJyYXkpIHtcbiAgICAgICAgICAgIGFycmF5ID0gYXJyYXkgfHwgW107XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IGFycmF5Lmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChrby51dGlscy5hcnJheUluZGV4T2YocmVzdWx0LCBhcnJheVtpXSkgPCAwKVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChhcnJheVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9LFxuXG4gICAgICAgIGFycmF5TWFwOiBmdW5jdGlvbiAoYXJyYXksIG1hcHBpbmcpIHtcbiAgICAgICAgICAgIGFycmF5ID0gYXJyYXkgfHwgW107XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IGFycmF5Lmxlbmd0aDsgaSA8IGo7IGkrKylcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChtYXBwaW5nKGFycmF5W2ldLCBpKSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9LFxuXG4gICAgICAgIGFycmF5RmlsdGVyOiBmdW5jdGlvbiAoYXJyYXksIHByZWRpY2F0ZSkge1xuICAgICAgICAgICAgYXJyYXkgPSBhcnJheSB8fCBbXTtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gYXJyYXkubGVuZ3RoOyBpIDwgajsgaSsrKVxuICAgICAgICAgICAgICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaV0sIGkpKVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChhcnJheVtpXSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9LFxuXG4gICAgICAgIGFycmF5UHVzaEFsbDogZnVuY3Rpb24gKGFycmF5LCB2YWx1ZXNUb1B1c2gpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZXNUb1B1c2ggaW5zdGFuY2VvZiBBcnJheSlcbiAgICAgICAgICAgICAgICBhcnJheS5wdXNoLmFwcGx5KGFycmF5LCB2YWx1ZXNUb1B1c2gpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gdmFsdWVzVG9QdXNoLmxlbmd0aDsgaSA8IGo7IGkrKylcbiAgICAgICAgICAgICAgICAgICAgYXJyYXkucHVzaCh2YWx1ZXNUb1B1c2hbaV0pO1xuICAgICAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgICAgICB9LFxuXG4gICAgICAgIGFkZE9yUmVtb3ZlSXRlbTogZnVuY3Rpb24oYXJyYXksIHZhbHVlLCBpbmNsdWRlZCkge1xuICAgICAgICAgICAgdmFyIGV4aXN0aW5nRW50cnlJbmRleCA9IGtvLnV0aWxzLmFycmF5SW5kZXhPZihrby51dGlscy5wZWVrT2JzZXJ2YWJsZShhcnJheSksIHZhbHVlKTtcbiAgICAgICAgICAgIGlmIChleGlzdGluZ0VudHJ5SW5kZXggPCAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGluY2x1ZGVkKVxuICAgICAgICAgICAgICAgICAgICBhcnJheS5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpbmNsdWRlZClcbiAgICAgICAgICAgICAgICAgICAgYXJyYXkuc3BsaWNlKGV4aXN0aW5nRW50cnlJbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2FuU2V0UHJvdG90eXBlOiBjYW5TZXRQcm90b3R5cGUsXG5cbiAgICAgICAgZXh0ZW5kOiBleHRlbmQsXG5cbiAgICAgICAgc2V0UHJvdG90eXBlT2Y6IHNldFByb3RvdHlwZU9mLFxuXG4gICAgICAgIHNldFByb3RvdHlwZU9mT3JFeHRlbmQ6IGNhblNldFByb3RvdHlwZSA/IHNldFByb3RvdHlwZU9mIDogZXh0ZW5kLFxuXG4gICAgICAgIG9iamVjdEZvckVhY2g6IG9iamVjdEZvckVhY2gsXG5cbiAgICAgICAgb2JqZWN0TWFwOiBmdW5jdGlvbihzb3VyY2UsIG1hcHBpbmcpIHtcbiAgICAgICAgICAgIGlmICghc291cmNlKVxuICAgICAgICAgICAgICAgIHJldHVybiBzb3VyY2U7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0ge307XG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIHNvdXJjZSkge1xuICAgICAgICAgICAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W3Byb3BdID0gbWFwcGluZyhzb3VyY2VbcHJvcF0sIHByb3AsIHNvdXJjZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICAgICAgfSxcblxuICAgICAgICBlbXB0eURvbU5vZGU6IGZ1bmN0aW9uIChkb21Ob2RlKSB7XG4gICAgICAgICAgICB3aGlsZSAoZG9tTm9kZS5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICAgICAga28ucmVtb3ZlTm9kZShkb21Ob2RlLmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIG1vdmVDbGVhbmVkTm9kZXNUb0NvbnRhaW5lckVsZW1lbnQ6IGZ1bmN0aW9uKG5vZGVzKSB7XG4gICAgICAgICAgICAvLyBFbnN1cmUgaXQncyBhIHJlYWwgYXJyYXksIGFzIHdlJ3JlIGFib3V0IHRvIHJlcGFyZW50IHRoZSBub2RlcyBhbmRcbiAgICAgICAgICAgIC8vIHdlIGRvbid0IHdhbnQgdGhlIHVuZGVybHlpbmcgY29sbGVjdGlvbiB0byBjaGFuZ2Ugd2hpbGUgd2UncmUgZG9pbmcgdGhhdC5cbiAgICAgICAgICAgIHZhciBub2Rlc0FycmF5ID0ga28udXRpbHMubWFrZUFycmF5KG5vZGVzKTtcblxuICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBub2Rlc0FycmF5Lmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChrby5jbGVhbk5vZGUobm9kZXNBcnJheVtpXSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgICAgICAgfSxcblxuICAgICAgICBjbG9uZU5vZGVzOiBmdW5jdGlvbiAobm9kZXNBcnJheSwgc2hvdWxkQ2xlYW5Ob2Rlcykge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBub2Rlc0FycmF5Lmxlbmd0aCwgbmV3Tm9kZXNBcnJheSA9IFtdOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNsb25lZE5vZGUgPSBub2Rlc0FycmF5W2ldLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgICAgICBuZXdOb2Rlc0FycmF5LnB1c2goc2hvdWxkQ2xlYW5Ob2RlcyA/IGtvLmNsZWFuTm9kZShjbG9uZWROb2RlKSA6IGNsb25lZE5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5ld05vZGVzQXJyYXk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0RG9tTm9kZUNoaWxkcmVuOiBmdW5jdGlvbiAoZG9tTm9kZSwgY2hpbGROb2Rlcykge1xuICAgICAgICAgICAga28udXRpbHMuZW1wdHlEb21Ob2RlKGRvbU5vZGUpO1xuICAgICAgICAgICAgaWYgKGNoaWxkTm9kZXMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IGNoaWxkTm9kZXMubGVuZ3RoOyBpIDwgajsgaSsrKVxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLmFwcGVuZENoaWxkKGNoaWxkTm9kZXNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHJlcGxhY2VEb21Ob2RlczogZnVuY3Rpb24gKG5vZGVUb1JlcGxhY2VPck5vZGVBcnJheSwgbmV3Tm9kZXNBcnJheSkge1xuICAgICAgICAgICAgdmFyIG5vZGVzVG9SZXBsYWNlQXJyYXkgPSBub2RlVG9SZXBsYWNlT3JOb2RlQXJyYXkubm9kZVR5cGUgPyBbbm9kZVRvUmVwbGFjZU9yTm9kZUFycmF5XSA6IG5vZGVUb1JlcGxhY2VPck5vZGVBcnJheTtcbiAgICAgICAgICAgIGlmIChub2Rlc1RvUmVwbGFjZUFycmF5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5zZXJ0aW9uUG9pbnQgPSBub2Rlc1RvUmVwbGFjZUFycmF5WzBdO1xuICAgICAgICAgICAgICAgIHZhciBwYXJlbnQgPSBpbnNlcnRpb25Qb2ludC5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gbmV3Tm9kZXNBcnJheS5sZW5ndGg7IGkgPCBqOyBpKyspXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUobmV3Tm9kZXNBcnJheVtpXSwgaW5zZXJ0aW9uUG9pbnQpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gbm9kZXNUb1JlcGxhY2VBcnJheS5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAga28ucmVtb3ZlTm9kZShub2Rlc1RvUmVwbGFjZUFycmF5W2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZml4VXBDb250aW51b3VzTm9kZUFycmF5OiBmdW5jdGlvbihjb250aW51b3VzTm9kZUFycmF5LCBwYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAvLyBCZWZvcmUgYWN0aW5nIG9uIGEgc2V0IG9mIG5vZGVzIHRoYXQgd2VyZSBwcmV2aW91c2x5IG91dHB1dHRlZCBieSBhIHRlbXBsYXRlIGZ1bmN0aW9uLCB3ZSBoYXZlIHRvIHJlY29uY2lsZVxuICAgICAgICAgICAgLy8gdGhlbSBhZ2FpbnN0IHdoYXQgaXMgaW4gdGhlIERPTSByaWdodCBub3cuIEl0IG1heSBiZSB0aGF0IHNvbWUgb2YgdGhlIG5vZGVzIGhhdmUgYWxyZWFkeSBiZWVuIHJlbW92ZWQsIG9yIHRoYXRcbiAgICAgICAgICAgIC8vIG5ldyBub2RlcyBtaWdodCBoYXZlIGJlZW4gaW5zZXJ0ZWQgaW4gdGhlIG1pZGRsZSwgZm9yIGV4YW1wbGUgYnkgYSBiaW5kaW5nLiBBbHNvLCB0aGVyZSBtYXkgcHJldmlvdXNseSBoYXZlIGJlZW5cbiAgICAgICAgICAgIC8vIGxlYWRpbmcgY29tbWVudCBub2RlcyAoY3JlYXRlZCBieSByZXdyaXR0ZW4gc3RyaW5nLWJhc2VkIHRlbXBsYXRlcykgdGhhdCBoYXZlIHNpbmNlIGJlZW4gcmVtb3ZlZCBkdXJpbmcgYmluZGluZy5cbiAgICAgICAgICAgIC8vIFNvLCB0aGlzIGZ1bmN0aW9uIHRyYW5zbGF0ZXMgdGhlIG9sZCBcIm1hcFwiIG91dHB1dCBhcnJheSBpbnRvIGl0cyBiZXN0IGd1ZXNzIG9mIHRoZSBzZXQgb2YgY3VycmVudCBET00gbm9kZXMuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gUnVsZXM6XG4gICAgICAgICAgICAvLyAgIFtBXSBBbnkgbGVhZGluZyBub2RlcyB0aGF0IGhhdmUgYmVlbiByZW1vdmVkIHNob3VsZCBiZSBpZ25vcmVkXG4gICAgICAgICAgICAvLyAgICAgICBUaGVzZSBtb3N0IGxpa2VseSBjb3JyZXNwb25kIHRvIG1lbW9pemF0aW9uIG5vZGVzIHRoYXQgd2VyZSBhbHJlYWR5IHJlbW92ZWQgZHVyaW5nIGJpbmRpbmdcbiAgICAgICAgICAgIC8vICAgICAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20vU3RldmVTYW5kZXJzb24va25vY2tvdXQvcHVsbC80NDBcbiAgICAgICAgICAgIC8vICAgW0JdIFdlIHdhbnQgdG8gb3V0cHV0IGEgY29udGludW91cyBzZXJpZXMgb2Ygbm9kZXMuIFNvLCBpZ25vcmUgYW55IG5vZGVzIHRoYXQgaGF2ZSBhbHJlYWR5IGJlZW4gcmVtb3ZlZCxcbiAgICAgICAgICAgIC8vICAgICAgIGFuZCBpbmNsdWRlIGFueSBub2RlcyB0aGF0IGhhdmUgYmVlbiBpbnNlcnRlZCBhbW9uZyB0aGUgcHJldmlvdXMgY29sbGVjdGlvblxuXG4gICAgICAgICAgICBpZiAoY29udGludW91c05vZGVBcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgcGFyZW50IG5vZGUgY2FuIGJlIGEgdmlydHVhbCBlbGVtZW50OyBzbyBnZXQgdGhlIHJlYWwgcGFyZW50IG5vZGVcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlID0gKHBhcmVudE5vZGUubm9kZVR5cGUgPT09IDggJiYgcGFyZW50Tm9kZS5wYXJlbnROb2RlKSB8fCBwYXJlbnROb2RlO1xuXG4gICAgICAgICAgICAgICAgLy8gUnVsZSBbQV1cbiAgICAgICAgICAgICAgICB3aGlsZSAoY29udGludW91c05vZGVBcnJheS5sZW5ndGggJiYgY29udGludW91c05vZGVBcnJheVswXS5wYXJlbnROb2RlICE9PSBwYXJlbnROb2RlKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51b3VzTm9kZUFycmF5LnNoaWZ0KCk7XG5cbiAgICAgICAgICAgICAgICAvLyBSdWxlIFtCXVxuICAgICAgICAgICAgICAgIGlmIChjb250aW51b3VzTm9kZUFycmF5Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSBjb250aW51b3VzTm9kZUFycmF5WzBdLCBsYXN0ID0gY29udGludW91c05vZGVBcnJheVtjb250aW51b3VzTm9kZUFycmF5Lmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgICAgICAgICAvLyBSZXBsYWNlIHdpdGggdGhlIGFjdHVhbCBuZXcgY29udGludW91cyBub2RlIHNldFxuICAgICAgICAgICAgICAgICAgICBjb250aW51b3VzTm9kZUFycmF5Lmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChjdXJyZW50ICE9PSBsYXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51b3VzTm9kZUFycmF5LnB1c2goY3VycmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY3VycmVudCkgLy8gV29uJ3QgaGFwcGVuLCBleGNlcHQgaWYgdGhlIGRldmVsb3BlciBoYXMgbWFudWFsbHkgcmVtb3ZlZCBzb21lIERPTSBlbGVtZW50cyAodGhlbiB3ZSdyZSBpbiBhbiB1bmRlZmluZWQgc2NlbmFyaW8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVvdXNOb2RlQXJyYXkucHVzaChsYXN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY29udGludW91c05vZGVBcnJheTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRPcHRpb25Ob2RlU2VsZWN0aW9uU3RhdGU6IGZ1bmN0aW9uIChvcHRpb25Ob2RlLCBpc1NlbGVjdGVkKSB7XG4gICAgICAgICAgICAvLyBJRTYgc29tZXRpbWVzIHRocm93cyBcInVua25vd24gZXJyb3JcIiBpZiB5b3UgdHJ5IHRvIHdyaXRlIHRvIC5zZWxlY3RlZCBkaXJlY3RseSwgd2hlcmVhcyBGaXJlZm94IHN0cnVnZ2xlcyB3aXRoIHNldEF0dHJpYnV0ZS4gUGljayBvbmUgYmFzZWQgb24gYnJvd3Nlci5cbiAgICAgICAgICAgIGlmIChpZVZlcnNpb24gPCA3KVxuICAgICAgICAgICAgICAgIG9wdGlvbk5vZGUuc2V0QXR0cmlidXRlKFwic2VsZWN0ZWRcIiwgaXNTZWxlY3RlZCk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgb3B0aW9uTm9kZS5zZWxlY3RlZCA9IGlzU2VsZWN0ZWQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc3RyaW5nVHJpbTogZnVuY3Rpb24gKHN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIHN0cmluZyA9PT0gbnVsbCB8fCBzdHJpbmcgPT09IHVuZGVmaW5lZCA/ICcnIDpcbiAgICAgICAgICAgICAgICBzdHJpbmcudHJpbSA/XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZy50cmltKCkgOlxuICAgICAgICAgICAgICAgICAgICBzdHJpbmcudG9TdHJpbmcoKS5yZXBsYWNlKC9eW1xcc1xceGEwXSt8W1xcc1xceGEwXSskL2csICcnKTtcbiAgICAgICAgfSxcblxuICAgICAgICBzdHJpbmdTdGFydHNXaXRoOiBmdW5jdGlvbiAoc3RyaW5nLCBzdGFydHNXaXRoKSB7XG4gICAgICAgICAgICBzdHJpbmcgPSBzdHJpbmcgfHwgXCJcIjtcbiAgICAgICAgICAgIGlmIChzdGFydHNXaXRoLmxlbmd0aCA+IHN0cmluZy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHN0cmluZy5zdWJzdHJpbmcoMCwgc3RhcnRzV2l0aC5sZW5ndGgpID09PSBzdGFydHNXaXRoO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRvbU5vZGVJc0NvbnRhaW5lZEJ5OiBmdW5jdGlvbiAobm9kZSwgY29udGFpbmVkQnlOb2RlKSB7XG4gICAgICAgICAgICBpZiAobm9kZSA9PT0gY29udGFpbmVkQnlOb2RlKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDExKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gRml4ZXMgaXNzdWUgIzExNjIgLSBjYW4ndCB1c2Ugbm9kZS5jb250YWlucyBmb3IgZG9jdW1lbnQgZnJhZ21lbnRzIG9uIElFOFxuICAgICAgICAgICAgaWYgKGNvbnRhaW5lZEJ5Tm9kZS5jb250YWlucylcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udGFpbmVkQnlOb2RlLmNvbnRhaW5zKG5vZGUubm9kZVR5cGUgPT09IDMgPyBub2RlLnBhcmVudE5vZGUgOiBub2RlKTtcbiAgICAgICAgICAgIGlmIChjb250YWluZWRCeU5vZGUuY29tcGFyZURvY3VtZW50UG9zaXRpb24pXG4gICAgICAgICAgICAgICAgcmV0dXJuIChjb250YWluZWRCeU5vZGUuY29tcGFyZURvY3VtZW50UG9zaXRpb24obm9kZSkgJiAxNikgPT0gMTY7XG4gICAgICAgICAgICB3aGlsZSAobm9kZSAmJiBub2RlICE9IGNvbnRhaW5lZEJ5Tm9kZSkge1xuICAgICAgICAgICAgICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gISFub2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRvbU5vZGVJc0F0dGFjaGVkVG9Eb2N1bWVudDogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBrby51dGlscy5kb21Ob2RlSXNDb250YWluZWRCeShub2RlLCBub2RlLm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTtcbiAgICAgICAgfSxcblxuICAgICAgICBhbnlEb21Ob2RlSXNBdHRhY2hlZFRvRG9jdW1lbnQ6IGZ1bmN0aW9uKG5vZGVzKSB7XG4gICAgICAgICAgICByZXR1cm4gISFrby51dGlscy5hcnJheUZpcnN0KG5vZGVzLCBrby51dGlscy5kb21Ob2RlSXNBdHRhY2hlZFRvRG9jdW1lbnQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRhZ05hbWVMb3dlcjogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgLy8gRm9yIEhUTUwgZWxlbWVudHMsIHRhZ05hbWUgd2lsbCBhbHdheXMgYmUgdXBwZXIgY2FzZTsgZm9yIFhIVE1MIGVsZW1lbnRzLCBpdCdsbCBiZSBsb3dlciBjYXNlLlxuICAgICAgICAgICAgLy8gUG9zc2libGUgZnV0dXJlIG9wdGltaXphdGlvbjogSWYgd2Uga25vdyBpdCdzIGFuIGVsZW1lbnQgZnJvbSBhbiBYSFRNTCBkb2N1bWVudCAobm90IEhUTUwpLFxuICAgICAgICAgICAgLy8gd2UgZG9uJ3QgbmVlZCB0byBkbyB0aGUgLnRvTG93ZXJDYXNlKCkgYXMgaXQgd2lsbCBhbHdheXMgYmUgbG93ZXIgY2FzZSBhbnl3YXkuXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudCAmJiBlbGVtZW50LnRhZ05hbWUgJiYgZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVnaXN0ZXJFdmVudEhhbmRsZXI6IGZ1bmN0aW9uIChlbGVtZW50LCBldmVudFR5cGUsIGhhbmRsZXIpIHtcbiAgICAgICAgICAgIHZhciBtdXN0VXNlQXR0YWNoRXZlbnQgPSBpZVZlcnNpb24gJiYgZXZlbnRzVGhhdE11c3RCZVJlZ2lzdGVyZWRVc2luZ0F0dGFjaEV2ZW50W2V2ZW50VHlwZV07XG4gICAgICAgICAgICBpZiAoIW11c3RVc2VBdHRhY2hFdmVudCAmJiBqUXVlcnlJbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgIGpRdWVyeUluc3RhbmNlKGVsZW1lbnQpWydiaW5kJ10oZXZlbnRUeXBlLCBoYW5kbGVyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIW11c3RVc2VBdHRhY2hFdmVudCAmJiB0eXBlb2YgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyID09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgZWxlbWVudC5hdHRhY2hFdmVudCAhPSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgdmFyIGF0dGFjaEV2ZW50SGFuZGxlciA9IGZ1bmN0aW9uIChldmVudCkgeyBoYW5kbGVyLmNhbGwoZWxlbWVudCwgZXZlbnQpOyB9LFxuICAgICAgICAgICAgICAgICAgICBhdHRhY2hFdmVudE5hbWUgPSBcIm9uXCIgKyBldmVudFR5cGU7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hdHRhY2hFdmVudChhdHRhY2hFdmVudE5hbWUsIGF0dGFjaEV2ZW50SGFuZGxlcik7XG5cbiAgICAgICAgICAgICAgICAvLyBJRSBkb2VzIG5vdCBkaXNwb3NlIGF0dGFjaEV2ZW50IGhhbmRsZXJzIGF1dG9tYXRpY2FsbHkgKHVubGlrZSB3aXRoIGFkZEV2ZW50TGlzdGVuZXIpXG4gICAgICAgICAgICAgICAgLy8gc28gdG8gYXZvaWQgbGVha3MsIHdlIGhhdmUgdG8gcmVtb3ZlIHRoZW0gbWFudWFsbHkuIFNlZSBidWcgIzg1NlxuICAgICAgICAgICAgICAgIGtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbC5hZGREaXNwb3NlQ2FsbGJhY2soZWxlbWVudCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuZGV0YWNoRXZlbnQoYXR0YWNoRXZlbnROYW1lLCBhdHRhY2hFdmVudEhhbmRsZXIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgYWRkRXZlbnRMaXN0ZW5lciBvciBhdHRhY2hFdmVudFwiKTtcbiAgICAgICAgfSxcblxuICAgICAgICB0cmlnZ2VyRXZlbnQ6IGZ1bmN0aW9uIChlbGVtZW50LCBldmVudFR5cGUpIHtcbiAgICAgICAgICAgIGlmICghKGVsZW1lbnQgJiYgZWxlbWVudC5ub2RlVHlwZSkpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZWxlbWVudCBtdXN0IGJlIGEgRE9NIG5vZGUgd2hlbiBjYWxsaW5nIHRyaWdnZXJFdmVudFwiKTtcblxuICAgICAgICAgICAgLy8gRm9yIGNsaWNrIGV2ZW50cyBvbiBjaGVja2JveGVzIGFuZCByYWRpbyBidXR0b25zLCBqUXVlcnkgdG9nZ2xlcyB0aGUgZWxlbWVudCBjaGVja2VkIHN0YXRlICphZnRlciogdGhlXG4gICAgICAgICAgICAvLyBldmVudCBoYW5kbGVyIHJ1bnMgaW5zdGVhZCBvZiAqYmVmb3JlKi4gKFRoaXMgd2FzIGZpeGVkIGluIDEuOSBmb3IgY2hlY2tib3hlcyBidXQgbm90IGZvciByYWRpbyBidXR0b25zLilcbiAgICAgICAgICAgIC8vIElFIGRvZXNuJ3QgY2hhbmdlIHRoZSBjaGVja2VkIHN0YXRlIHdoZW4geW91IHRyaWdnZXIgdGhlIGNsaWNrIGV2ZW50IHVzaW5nIFwiZmlyZUV2ZW50XCIuXG4gICAgICAgICAgICAvLyBJbiBib3RoIGNhc2VzLCB3ZSdsbCB1c2UgdGhlIGNsaWNrIG1ldGhvZCBpbnN0ZWFkLlxuICAgICAgICAgICAgdmFyIHVzZUNsaWNrV29ya2Fyb3VuZCA9IGlzQ2xpY2tPbkNoZWNrYWJsZUVsZW1lbnQoZWxlbWVudCwgZXZlbnRUeXBlKTtcblxuICAgICAgICAgICAgaWYgKGpRdWVyeUluc3RhbmNlICYmICF1c2VDbGlja1dvcmthcm91bmQpIHtcbiAgICAgICAgICAgICAgICBqUXVlcnlJbnN0YW5jZShlbGVtZW50KVsndHJpZ2dlciddKGV2ZW50VHlwZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFdmVudCA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnQuZGlzcGF0Y2hFdmVudCA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGV2ZW50Q2F0ZWdvcnkgPSBrbm93bkV2ZW50VHlwZXNCeUV2ZW50TmFtZVtldmVudFR5cGVdIHx8IFwiSFRNTEV2ZW50c1wiO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudChldmVudENhdGVnb3J5KTtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuaW5pdEV2ZW50KGV2ZW50VHlwZSwgdHJ1ZSwgdHJ1ZSwgd2luZG93LCAwLCAwLCAwLCAwLCAwLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgMCwgZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN1cHBsaWVkIGVsZW1lbnQgZG9lc24ndCBzdXBwb3J0IGRpc3BhdGNoRXZlbnRcIik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHVzZUNsaWNrV29ya2Fyb3VuZCAmJiBlbGVtZW50LmNsaWNrKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5jbGljaygpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZWxlbWVudC5maXJlRXZlbnQgIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuZmlyZUV2ZW50KFwib25cIiArIGV2ZW50VHlwZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IHRyaWdnZXJpbmcgZXZlbnRzXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHVud3JhcE9ic2VydmFibGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGtvLmlzT2JzZXJ2YWJsZSh2YWx1ZSkgPyB2YWx1ZSgpIDogdmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGVla09ic2VydmFibGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGtvLmlzT2JzZXJ2YWJsZSh2YWx1ZSkgPyB2YWx1ZS5wZWVrKCkgOiB2YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICB0b2dnbGVEb21Ob2RlQ3NzQ2xhc3M6IGZ1bmN0aW9uIChub2RlLCBjbGFzc05hbWVzLCBzaG91bGRIYXZlQ2xhc3MpIHtcbiAgICAgICAgICAgIGlmIChjbGFzc05hbWVzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNzc0NsYXNzTmFtZVJlZ2V4ID0gL1xcUysvZyxcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudENsYXNzTmFtZXMgPSBub2RlLmNsYXNzTmFtZS5tYXRjaChjc3NDbGFzc05hbWVSZWdleCkgfHwgW107XG4gICAgICAgICAgICAgICAga28udXRpbHMuYXJyYXlGb3JFYWNoKGNsYXNzTmFtZXMubWF0Y2goY3NzQ2xhc3NOYW1lUmVnZXgpLCBmdW5jdGlvbihjbGFzc05hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAga28udXRpbHMuYWRkT3JSZW1vdmVJdGVtKGN1cnJlbnRDbGFzc05hbWVzLCBjbGFzc05hbWUsIHNob3VsZEhhdmVDbGFzcyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbm9kZS5jbGFzc05hbWUgPSBjdXJyZW50Q2xhc3NOYW1lcy5qb2luKFwiIFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBzZXRUZXh0Q29udGVudDogZnVuY3Rpb24oZWxlbWVudCwgdGV4dENvbnRlbnQpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodGV4dENvbnRlbnQpO1xuICAgICAgICAgICAgaWYgKCh2YWx1ZSA9PT0gbnVsbCkgfHwgKHZhbHVlID09PSB1bmRlZmluZWQpKVxuICAgICAgICAgICAgICAgIHZhbHVlID0gXCJcIjtcblxuICAgICAgICAgICAgLy8gV2UgbmVlZCB0aGVyZSB0byBiZSBleGFjdGx5IG9uZSBjaGlsZDogYSB0ZXh0IG5vZGUuXG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gY2hpbGRyZW4sIG1vcmUgdGhhbiBvbmUsIG9yIGlmIGl0J3Mgbm90IGEgdGV4dCBub2RlLFxuICAgICAgICAgICAgLy8gd2UnbGwgY2xlYXIgZXZlcnl0aGluZyBhbmQgY3JlYXRlIGEgc2luZ2xlIHRleHQgbm9kZS5cbiAgICAgICAgICAgIHZhciBpbm5lclRleHROb2RlID0ga28udmlydHVhbEVsZW1lbnRzLmZpcnN0Q2hpbGQoZWxlbWVudCk7XG4gICAgICAgICAgICBpZiAoIWlubmVyVGV4dE5vZGUgfHwgaW5uZXJUZXh0Tm9kZS5ub2RlVHlwZSAhPSAzIHx8IGtvLnZpcnR1YWxFbGVtZW50cy5uZXh0U2libGluZyhpbm5lclRleHROb2RlKSkge1xuICAgICAgICAgICAgICAgIGtvLnZpcnR1YWxFbGVtZW50cy5zZXREb21Ob2RlQ2hpbGRyZW4oZWxlbWVudCwgW2VsZW1lbnQub3duZXJEb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh2YWx1ZSldKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5uZXJUZXh0Tm9kZS5kYXRhID0gdmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGtvLnV0aWxzLmZvcmNlUmVmcmVzaChlbGVtZW50KTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRFbGVtZW50TmFtZTogZnVuY3Rpb24oZWxlbWVudCwgbmFtZSkge1xuICAgICAgICAgICAgZWxlbWVudC5uYW1lID0gbmFtZTtcblxuICAgICAgICAgICAgLy8gV29ya2Fyb3VuZCBJRSA2LzcgaXNzdWVcbiAgICAgICAgICAgIC8vIC0gaHR0cHM6Ly9naXRodWIuY29tL1N0ZXZlU2FuZGVyc29uL2tub2Nrb3V0L2lzc3Vlcy8xOTdcbiAgICAgICAgICAgIC8vIC0gaHR0cDovL3d3dy5tYXR0czQxMS5jb20vcG9zdC9zZXR0aW5nX3RoZV9uYW1lX2F0dHJpYnV0ZV9pbl9pZV9kb20vXG4gICAgICAgICAgICBpZiAoaWVWZXJzaW9uIDw9IDcpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50Lm1lcmdlQXR0cmlidXRlcyhkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiPGlucHV0IG5hbWU9J1wiICsgZWxlbWVudC5uYW1lICsgXCInLz5cIiksIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2goZSkge30gLy8gRm9yIElFOSB3aXRoIGRvYyBtb2RlIFwiSUU5IFN0YW5kYXJkc1wiIGFuZCBicm93c2VyIG1vZGUgXCJJRTkgQ29tcGF0aWJpbGl0eSBWaWV3XCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBmb3JjZVJlZnJlc2g6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgIC8vIFdvcmthcm91bmQgZm9yIGFuIElFOSByZW5kZXJpbmcgYnVnIC0gaHR0cHM6Ly9naXRodWIuY29tL1N0ZXZlU2FuZGVyc29uL2tub2Nrb3V0L2lzc3Vlcy8yMDlcbiAgICAgICAgICAgIGlmIChpZVZlcnNpb24gPj0gOSkge1xuICAgICAgICAgICAgICAgIC8vIEZvciB0ZXh0IG5vZGVzIGFuZCBjb21tZW50IG5vZGVzIChtb3N0IGxpa2VseSB2aXJ0dWFsIGVsZW1lbnRzKSwgd2Ugd2lsbCBoYXZlIHRvIHJlZnJlc2ggdGhlIGNvbnRhaW5lclxuICAgICAgICAgICAgICAgIHZhciBlbGVtID0gbm9kZS5ub2RlVHlwZSA9PSAxID8gbm9kZSA6IG5vZGUucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbS5zdHlsZSlcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5zdHlsZS56b29tID0gZWxlbS5zdHlsZS56b29tO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGVuc3VyZVNlbGVjdEVsZW1lbnRJc1JlbmRlcmVkQ29ycmVjdGx5OiBmdW5jdGlvbihzZWxlY3RFbGVtZW50KSB7XG4gICAgICAgICAgICAvLyBXb3JrYXJvdW5kIGZvciBJRTkgcmVuZGVyaW5nIGJ1ZyAtIGl0IGRvZXNuJ3QgcmVsaWFibHkgZGlzcGxheSBhbGwgdGhlIHRleHQgaW4gZHluYW1pY2FsbHktYWRkZWQgc2VsZWN0IGJveGVzIHVubGVzcyB5b3UgZm9yY2UgaXQgdG8gcmUtcmVuZGVyIGJ5IHVwZGF0aW5nIHRoZSB3aWR0aC5cbiAgICAgICAgICAgIC8vIChTZWUgaHR0cHM6Ly9naXRodWIuY29tL1N0ZXZlU2FuZGVyc29uL2tub2Nrb3V0L2lzc3Vlcy8zMTIsIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTkwODQ5NC9zZWxlY3Qtb25seS1zaG93cy1maXJzdC1jaGFyLW9mLXNlbGVjdGVkLW9wdGlvbilcbiAgICAgICAgICAgIC8vIEFsc28gZml4ZXMgSUU3IGFuZCBJRTggYnVnIHRoYXQgY2F1c2VzIHNlbGVjdHMgdG8gYmUgemVybyB3aWR0aCBpZiBlbmNsb3NlZCBieSAnaWYnIG9yICd3aXRoJy4gKFNlZSBpc3N1ZSAjODM5KVxuICAgICAgICAgICAgaWYgKGllVmVyc2lvbikge1xuICAgICAgICAgICAgICAgIHZhciBvcmlnaW5hbFdpZHRoID0gc2VsZWN0RWxlbWVudC5zdHlsZS53aWR0aDtcbiAgICAgICAgICAgICAgICBzZWxlY3RFbGVtZW50LnN0eWxlLndpZHRoID0gMDtcbiAgICAgICAgICAgICAgICBzZWxlY3RFbGVtZW50LnN0eWxlLndpZHRoID0gb3JpZ2luYWxXaWR0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICByYW5nZTogZnVuY3Rpb24gKG1pbiwgbWF4KSB7XG4gICAgICAgICAgICBtaW4gPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKG1pbik7XG4gICAgICAgICAgICBtYXggPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKG1heCk7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gbWluOyBpIDw9IG1heDsgaSsrKVxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGkpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSxcblxuICAgICAgICBtYWtlQXJyYXk6IGZ1bmN0aW9uKGFycmF5TGlrZU9iamVjdCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBhcnJheUxpa2VPYmplY3QubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goYXJyYXlMaWtlT2JqZWN0W2ldKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzSWU2IDogaXNJZTYsXG4gICAgICAgIGlzSWU3IDogaXNJZTcsXG4gICAgICAgIGllVmVyc2lvbiA6IGllVmVyc2lvbixcblxuICAgICAgICBnZXRGb3JtRmllbGRzOiBmdW5jdGlvbihmb3JtLCBmaWVsZE5hbWUpIHtcbiAgICAgICAgICAgIHZhciBmaWVsZHMgPSBrby51dGlscy5tYWtlQXJyYXkoZm9ybS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlucHV0XCIpKS5jb25jYXQoa28udXRpbHMubWFrZUFycmF5KGZvcm0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0ZXh0YXJlYVwiKSkpO1xuICAgICAgICAgICAgdmFyIGlzTWF0Y2hpbmdGaWVsZCA9ICh0eXBlb2YgZmllbGROYW1lID09ICdzdHJpbmcnKVxuICAgICAgICAgICAgICAgID8gZnVuY3Rpb24oZmllbGQpIHsgcmV0dXJuIGZpZWxkLm5hbWUgPT09IGZpZWxkTmFtZSB9XG4gICAgICAgICAgICAgICAgOiBmdW5jdGlvbihmaWVsZCkgeyByZXR1cm4gZmllbGROYW1lLnRlc3QoZmllbGQubmFtZSkgfTsgLy8gVHJlYXQgZmllbGROYW1lIGFzIHJlZ2V4IG9yIG9iamVjdCBjb250YWluaW5nIHByZWRpY2F0ZVxuICAgICAgICAgICAgdmFyIG1hdGNoZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBmaWVsZHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNNYXRjaGluZ0ZpZWxkKGZpZWxkc1tpXSkpXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoZXMucHVzaChmaWVsZHNbaV0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaGVzO1xuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNlSnNvbjogZnVuY3Rpb24gKGpzb25TdHJpbmcpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YganNvblN0cmluZyA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAganNvblN0cmluZyA9IGtvLnV0aWxzLnN0cmluZ1RyaW0oanNvblN0cmluZyk7XG4gICAgICAgICAgICAgICAgaWYgKGpzb25TdHJpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKEpTT04gJiYgSlNPTi5wYXJzZSkgLy8gVXNlIG5hdGl2ZSBwYXJzaW5nIHdoZXJlIGF2YWlsYWJsZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoanNvblN0cmluZyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAobmV3IEZ1bmN0aW9uKFwicmV0dXJuIFwiICsganNvblN0cmluZykpKCk7IC8vIEZhbGxiYWNrIG9uIGxlc3Mgc2FmZSBwYXJzaW5nIGZvciBvbGRlciBicm93c2Vyc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9LFxuXG4gICAgICAgIHN0cmluZ2lmeUpzb246IGZ1bmN0aW9uIChkYXRhLCByZXBsYWNlciwgc3BhY2UpIHsgICAvLyByZXBsYWNlciBhbmQgc3BhY2UgYXJlIG9wdGlvbmFsXG4gICAgICAgICAgICBpZiAoIUpTT04gfHwgIUpTT04uc3RyaW5naWZ5KVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIEpTT04uc3RyaW5naWZ5KCkuIFNvbWUgYnJvd3NlcnMgKGUuZy4sIElFIDwgOCkgZG9uJ3Qgc3VwcG9ydCBpdCBuYXRpdmVseSwgYnV0IHlvdSBjYW4gb3ZlcmNvbWUgdGhpcyBieSBhZGRpbmcgYSBzY3JpcHQgcmVmZXJlbmNlIHRvIGpzb24yLmpzLCBkb3dubG9hZGFibGUgZnJvbSBodHRwOi8vd3d3Lmpzb24ub3JnL2pzb24yLmpzXCIpO1xuICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUoZGF0YSksIHJlcGxhY2VyLCBzcGFjZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcG9zdEpzb246IGZ1bmN0aW9uICh1cmxPckZvcm0sIGRhdGEsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgICAgICAgdmFyIHBhcmFtcyA9IG9wdGlvbnNbJ3BhcmFtcyddIHx8IHt9O1xuICAgICAgICAgICAgdmFyIGluY2x1ZGVGaWVsZHMgPSBvcHRpb25zWydpbmNsdWRlRmllbGRzJ10gfHwgdGhpcy5maWVsZHNJbmNsdWRlZFdpdGhKc29uUG9zdDtcbiAgICAgICAgICAgIHZhciB1cmwgPSB1cmxPckZvcm07XG5cbiAgICAgICAgICAgIC8vIElmIHdlIHdlcmUgZ2l2ZW4gYSBmb3JtLCB1c2UgaXRzICdhY3Rpb24nIFVSTCBhbmQgcGljayBvdXQgYW55IHJlcXVlc3RlZCBmaWVsZCB2YWx1ZXNcbiAgICAgICAgICAgIGlmKCh0eXBlb2YgdXJsT3JGb3JtID09ICdvYmplY3QnKSAmJiAoa28udXRpbHMudGFnTmFtZUxvd2VyKHVybE9yRm9ybSkgPT09IFwiZm9ybVwiKSkge1xuICAgICAgICAgICAgICAgIHZhciBvcmlnaW5hbEZvcm0gPSB1cmxPckZvcm07XG4gICAgICAgICAgICAgICAgdXJsID0gb3JpZ2luYWxGb3JtLmFjdGlvbjtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gaW5jbHVkZUZpZWxkcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmllbGRzID0ga28udXRpbHMuZ2V0Rm9ybUZpZWxkcyhvcmlnaW5hbEZvcm0sIGluY2x1ZGVGaWVsZHNbaV0pO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gZmllbGRzLmxlbmd0aCAtIDE7IGogPj0gMDsgai0tKVxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zW2ZpZWxkc1tqXS5uYW1lXSA9IGZpZWxkc1tqXS52YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRhdGEgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKGRhdGEpO1xuICAgICAgICAgICAgdmFyIGZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiKTtcbiAgICAgICAgICAgIGZvcm0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgZm9ybS5hY3Rpb24gPSB1cmw7XG4gICAgICAgICAgICBmb3JtLm1ldGhvZCA9IFwicG9zdFwiO1xuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGRhdGEpIHtcbiAgICAgICAgICAgICAgICAvLyBTaW5jZSAnZGF0YScgdGhpcyBpcyBhIG1vZGVsIG9iamVjdCwgd2UgaW5jbHVkZSBhbGwgcHJvcGVydGllcyBpbmNsdWRpbmcgdGhvc2UgaW5oZXJpdGVkIGZyb20gaXRzIHByb3RvdHlwZVxuICAgICAgICAgICAgICAgIHZhciBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICAgICAgICAgICAgICBpbnB1dC50eXBlID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgICAgICBpbnB1dC5uYW1lID0ga2V5O1xuICAgICAgICAgICAgICAgIGlucHV0LnZhbHVlID0ga28udXRpbHMuc3RyaW5naWZ5SnNvbihrby51dGlscy51bndyYXBPYnNlcnZhYmxlKGRhdGFba2V5XSkpO1xuICAgICAgICAgICAgICAgIGZvcm0uYXBwZW5kQ2hpbGQoaW5wdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb2JqZWN0Rm9yRWFjaChwYXJhbXMsIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgICAgICAgICAgICAgaW5wdXQudHlwZSA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgaW5wdXQubmFtZSA9IGtleTtcbiAgICAgICAgICAgICAgICBpbnB1dC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGZvcm0uYXBwZW5kQ2hpbGQoaW5wdXQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGZvcm0pO1xuICAgICAgICAgICAgb3B0aW9uc1snc3VibWl0dGVyJ10gPyBvcHRpb25zWydzdWJtaXR0ZXInXShmb3JtKSA6IGZvcm0uc3VibWl0KCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgZm9ybS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGZvcm0pOyB9LCAwKTtcbiAgICAgICAgfVxuICAgIH1cbn0oKSk7XG5cbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMnLCBrby51dGlscyk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLmFycmF5Rm9yRWFjaCcsIGtvLnV0aWxzLmFycmF5Rm9yRWFjaCk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLmFycmF5Rmlyc3QnLCBrby51dGlscy5hcnJheUZpcnN0KTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuYXJyYXlGaWx0ZXInLCBrby51dGlscy5hcnJheUZpbHRlcik7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLmFycmF5R2V0RGlzdGluY3RWYWx1ZXMnLCBrby51dGlscy5hcnJheUdldERpc3RpbmN0VmFsdWVzKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuYXJyYXlJbmRleE9mJywga28udXRpbHMuYXJyYXlJbmRleE9mKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuYXJyYXlNYXAnLCBrby51dGlscy5hcnJheU1hcCk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLmFycmF5UHVzaEFsbCcsIGtvLnV0aWxzLmFycmF5UHVzaEFsbCk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLmFycmF5UmVtb3ZlSXRlbScsIGtvLnV0aWxzLmFycmF5UmVtb3ZlSXRlbSk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLmV4dGVuZCcsIGtvLnV0aWxzLmV4dGVuZCk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLmZpZWxkc0luY2x1ZGVkV2l0aEpzb25Qb3N0Jywga28udXRpbHMuZmllbGRzSW5jbHVkZWRXaXRoSnNvblBvc3QpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5nZXRGb3JtRmllbGRzJywga28udXRpbHMuZ2V0Rm9ybUZpZWxkcyk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLnBlZWtPYnNlcnZhYmxlJywga28udXRpbHMucGVla09ic2VydmFibGUpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5wb3N0SnNvbicsIGtvLnV0aWxzLnBvc3RKc29uKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMucGFyc2VKc29uJywga28udXRpbHMucGFyc2VKc29uKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMucmVnaXN0ZXJFdmVudEhhbmRsZXInLCBrby51dGlscy5yZWdpc3RlckV2ZW50SGFuZGxlcik7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLnN0cmluZ2lmeUpzb24nLCBrby51dGlscy5zdHJpbmdpZnlKc29uKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMucmFuZ2UnLCBrby51dGlscy5yYW5nZSk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLnRvZ2dsZURvbU5vZGVDc3NDbGFzcycsIGtvLnV0aWxzLnRvZ2dsZURvbU5vZGVDc3NDbGFzcyk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLnRyaWdnZXJFdmVudCcsIGtvLnV0aWxzLnRyaWdnZXJFdmVudCk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLnVud3JhcE9ic2VydmFibGUnLCBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMub2JqZWN0Rm9yRWFjaCcsIGtvLnV0aWxzLm9iamVjdEZvckVhY2gpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5hZGRPclJlbW92ZUl0ZW0nLCBrby51dGlscy5hZGRPclJlbW92ZUl0ZW0pO1xua28uZXhwb3J0U3ltYm9sKCd1bndyYXAnLCBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKTsgLy8gQ29udmVuaWVudCBzaG9ydGhhbmQsIGJlY2F1c2UgdGhpcyBpcyB1c2VkIHNvIGNvbW1vbmx5XG5cbmlmICghRnVuY3Rpb24ucHJvdG90eXBlWydiaW5kJ10pIHtcbiAgICAvLyBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCBpcyBhIHN0YW5kYXJkIHBhcnQgb2YgRUNNQVNjcmlwdCA1dGggRWRpdGlvbiAoRGVjZW1iZXIgMjAwOSwgaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL3B1YmxpY2F0aW9ucy9maWxlcy9FQ01BLVNUL0VDTUEtMjYyLnBkZilcbiAgICAvLyBJbiBjYXNlIHRoZSBicm93c2VyIGRvZXNuJ3QgaW1wbGVtZW50IGl0IG5hdGl2ZWx5LCBwcm92aWRlIGEgSmF2YVNjcmlwdCBpbXBsZW1lbnRhdGlvbi4gVGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBiYXNlZCBvbiB0aGUgb25lIGluIHByb3RvdHlwZS5qc1xuICAgIEZ1bmN0aW9uLnByb3RvdHlwZVsnYmluZCddID0gZnVuY3Rpb24gKG9iamVjdCkge1xuICAgICAgICB2YXIgb3JpZ2luYWxGdW5jdGlvbiA9IHRoaXMsIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLCBvYmplY3QgPSBhcmdzLnNoaWZ0KCk7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxGdW5jdGlvbi5hcHBseShvYmplY3QsIGFyZ3MuY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICAgICAgfTtcbiAgICB9O1xufVxuXG5rby51dGlscy5kb21EYXRhID0gbmV3IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHVuaXF1ZUlkID0gMDtcbiAgICB2YXIgZGF0YVN0b3JlS2V5RXhwYW5kb1Byb3BlcnR5TmFtZSA9IFwiX19rb19fXCIgKyAobmV3IERhdGUpLmdldFRpbWUoKTtcbiAgICB2YXIgZGF0YVN0b3JlID0ge307XG5cbiAgICBmdW5jdGlvbiBnZXRBbGwobm9kZSwgY3JlYXRlSWZOb3RGb3VuZCkge1xuICAgICAgICB2YXIgZGF0YVN0b3JlS2V5ID0gbm9kZVtkYXRhU3RvcmVLZXlFeHBhbmRvUHJvcGVydHlOYW1lXTtcbiAgICAgICAgdmFyIGhhc0V4aXN0aW5nRGF0YVN0b3JlID0gZGF0YVN0b3JlS2V5ICYmIChkYXRhU3RvcmVLZXkgIT09IFwibnVsbFwiKSAmJiBkYXRhU3RvcmVbZGF0YVN0b3JlS2V5XTtcbiAgICAgICAgaWYgKCFoYXNFeGlzdGluZ0RhdGFTdG9yZSkge1xuICAgICAgICAgICAgaWYgKCFjcmVhdGVJZk5vdEZvdW5kKVxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICBkYXRhU3RvcmVLZXkgPSBub2RlW2RhdGFTdG9yZUtleUV4cGFuZG9Qcm9wZXJ0eU5hbWVdID0gXCJrb1wiICsgdW5pcXVlSWQrKztcbiAgICAgICAgICAgIGRhdGFTdG9yZVtkYXRhU3RvcmVLZXldID0ge307XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGFTdG9yZVtkYXRhU3RvcmVLZXldO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKG5vZGUsIGtleSkge1xuICAgICAgICAgICAgdmFyIGFsbERhdGFGb3JOb2RlID0gZ2V0QWxsKG5vZGUsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiBhbGxEYXRhRm9yTm9kZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogYWxsRGF0YUZvck5vZGVba2V5XTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobm9kZSwga2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBNYWtlIHN1cmUgd2UgZG9uJ3QgYWN0dWFsbHkgY3JlYXRlIGEgbmV3IGRvbURhdGEga2V5IGlmIHdlIGFyZSBhY3R1YWxseSBkZWxldGluZyBhIHZhbHVlXG4gICAgICAgICAgICAgICAgaWYgKGdldEFsbChub2RlLCBmYWxzZSkgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGFsbERhdGFGb3JOb2RlID0gZ2V0QWxsKG5vZGUsIHRydWUpO1xuICAgICAgICAgICAgYWxsRGF0YUZvck5vZGVba2V5XSA9IHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBjbGVhcjogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIHZhciBkYXRhU3RvcmVLZXkgPSBub2RlW2RhdGFTdG9yZUtleUV4cGFuZG9Qcm9wZXJ0eU5hbWVdO1xuICAgICAgICAgICAgaWYgKGRhdGFTdG9yZUtleSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBkYXRhU3RvcmVbZGF0YVN0b3JlS2V5XTtcbiAgICAgICAgICAgICAgICBub2RlW2RhdGFTdG9yZUtleUV4cGFuZG9Qcm9wZXJ0eU5hbWVdID0gbnVsbDtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gRXhwb3NpbmcgXCJkaWQgY2xlYW5cIiBmbGFnIHB1cmVseSBzbyBzcGVjcyBjYW4gaW5mZXIgd2hldGhlciB0aGluZ3MgaGF2ZSBiZWVuIGNsZWFuZWQgdXAgYXMgaW50ZW5kZWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcblxuICAgICAgICBuZXh0S2V5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gKHVuaXF1ZUlkKyspICsgZGF0YVN0b3JlS2V5RXhwYW5kb1Byb3BlcnR5TmFtZTtcbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuXG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLmRvbURhdGEnLCBrby51dGlscy5kb21EYXRhKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuZG9tRGF0YS5jbGVhcicsIGtvLnV0aWxzLmRvbURhdGEuY2xlYXIpOyAvLyBFeHBvcnRpbmcgb25seSBzbyBzcGVjcyBjYW4gY2xlYXIgdXAgYWZ0ZXIgdGhlbXNlbHZlcyBmdWxseVxuXG5rby51dGlscy5kb21Ob2RlRGlzcG9zYWwgPSBuZXcgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZG9tRGF0YUtleSA9IGtvLnV0aWxzLmRvbURhdGEubmV4dEtleSgpO1xuICAgIHZhciBjbGVhbmFibGVOb2RlVHlwZXMgPSB7IDE6IHRydWUsIDg6IHRydWUsIDk6IHRydWUgfTsgICAgICAgLy8gRWxlbWVudCwgQ29tbWVudCwgRG9jdW1lbnRcbiAgICB2YXIgY2xlYW5hYmxlTm9kZVR5cGVzV2l0aERlc2NlbmRhbnRzID0geyAxOiB0cnVlLCA5OiB0cnVlIH07IC8vIEVsZW1lbnQsIERvY3VtZW50XG5cbiAgICBmdW5jdGlvbiBnZXREaXNwb3NlQ2FsbGJhY2tzQ29sbGVjdGlvbihub2RlLCBjcmVhdGVJZk5vdEZvdW5kKSB7XG4gICAgICAgIHZhciBhbGxEaXNwb3NlQ2FsbGJhY2tzID0ga28udXRpbHMuZG9tRGF0YS5nZXQobm9kZSwgZG9tRGF0YUtleSk7XG4gICAgICAgIGlmICgoYWxsRGlzcG9zZUNhbGxiYWNrcyA9PT0gdW5kZWZpbmVkKSAmJiBjcmVhdGVJZk5vdEZvdW5kKSB7XG4gICAgICAgICAgICBhbGxEaXNwb3NlQ2FsbGJhY2tzID0gW107XG4gICAgICAgICAgICBrby51dGlscy5kb21EYXRhLnNldChub2RlLCBkb21EYXRhS2V5LCBhbGxEaXNwb3NlQ2FsbGJhY2tzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWxsRGlzcG9zZUNhbGxiYWNrcztcbiAgICB9XG4gICAgZnVuY3Rpb24gZGVzdHJveUNhbGxiYWNrc0NvbGxlY3Rpb24obm9kZSkge1xuICAgICAgICBrby51dGlscy5kb21EYXRhLnNldChub2RlLCBkb21EYXRhS2V5LCB1bmRlZmluZWQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFuU2luZ2xlTm9kZShub2RlKSB7XG4gICAgICAgIC8vIFJ1biBhbGwgdGhlIGRpc3Bvc2UgY2FsbGJhY2tzXG4gICAgICAgIHZhciBjYWxsYmFja3MgPSBnZXREaXNwb3NlQ2FsbGJhY2tzQ29sbGVjdGlvbihub2RlLCBmYWxzZSk7XG4gICAgICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrcyA9IGNhbGxiYWNrcy5zbGljZSgwKTsgLy8gQ2xvbmUsIGFzIHRoZSBhcnJheSBtYXkgYmUgbW9kaWZpZWQgZHVyaW5nIGl0ZXJhdGlvbiAodHlwaWNhbGx5LCBjYWxsYmFja3Mgd2lsbCByZW1vdmUgdGhlbXNlbHZlcylcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrc1tpXShub2RlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEVyYXNlIHRoZSBET00gZGF0YVxuICAgICAgICBrby51dGlscy5kb21EYXRhLmNsZWFyKG5vZGUpO1xuXG4gICAgICAgIC8vIFBlcmZvcm0gY2xlYW51cCBuZWVkZWQgYnkgZXh0ZXJuYWwgbGlicmFyaWVzIChjdXJyZW50bHkgb25seSBqUXVlcnksIGJ1dCBjYW4gYmUgZXh0ZW5kZWQpXG4gICAgICAgIGtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbFtcImNsZWFuRXh0ZXJuYWxEYXRhXCJdKG5vZGUpO1xuXG4gICAgICAgIC8vIENsZWFyIGFueSBpbW1lZGlhdGUtY2hpbGQgY29tbWVudCBub2RlcywgYXMgdGhlc2Ugd291bGRuJ3QgaGF2ZSBiZWVuIGZvdW5kIGJ5XG4gICAgICAgIC8vIG5vZGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCIqXCIpIGluIGNsZWFuTm9kZSgpIChjb21tZW50IG5vZGVzIGFyZW4ndCBlbGVtZW50cylcbiAgICAgICAgaWYgKGNsZWFuYWJsZU5vZGVUeXBlc1dpdGhEZXNjZW5kYW50c1tub2RlLm5vZGVUeXBlXSlcbiAgICAgICAgICAgIGNsZWFuSW1tZWRpYXRlQ29tbWVudFR5cGVDaGlsZHJlbihub2RlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhbkltbWVkaWF0ZUNvbW1lbnRUeXBlQ2hpbGRyZW4obm9kZVdpdGhDaGlsZHJlbikge1xuICAgICAgICB2YXIgY2hpbGQsIG5leHRDaGlsZCA9IG5vZGVXaXRoQ2hpbGRyZW4uZmlyc3RDaGlsZDtcbiAgICAgICAgd2hpbGUgKGNoaWxkID0gbmV4dENoaWxkKSB7XG4gICAgICAgICAgICBuZXh0Q2hpbGQgPSBjaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgICAgIGlmIChjaGlsZC5ub2RlVHlwZSA9PT0gOClcbiAgICAgICAgICAgICAgICBjbGVhblNpbmdsZU5vZGUoY2hpbGQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgYWRkRGlzcG9zZUNhbGxiYWNrIDogZnVuY3Rpb24obm9kZSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT0gXCJmdW5jdGlvblwiKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvblwiKTtcbiAgICAgICAgICAgIGdldERpc3Bvc2VDYWxsYmFja3NDb2xsZWN0aW9uKG5vZGUsIHRydWUpLnB1c2goY2FsbGJhY2spO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlbW92ZURpc3Bvc2VDYWxsYmFjayA6IGZ1bmN0aW9uKG5vZGUsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB2YXIgY2FsbGJhY2tzQ29sbGVjdGlvbiA9IGdldERpc3Bvc2VDYWxsYmFja3NDb2xsZWN0aW9uKG5vZGUsIGZhbHNlKTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFja3NDb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAga28udXRpbHMuYXJyYXlSZW1vdmVJdGVtKGNhbGxiYWNrc0NvbGxlY3Rpb24sIGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2tzQ29sbGVjdGlvbi5sZW5ndGggPT0gMClcbiAgICAgICAgICAgICAgICAgICAgZGVzdHJveUNhbGxiYWNrc0NvbGxlY3Rpb24obm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2xlYW5Ob2RlIDogZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgLy8gRmlyc3QgY2xlYW4gdGhpcyBub2RlLCB3aGVyZSBhcHBsaWNhYmxlXG4gICAgICAgICAgICBpZiAoY2xlYW5hYmxlTm9kZVR5cGVzW25vZGUubm9kZVR5cGVdKSB7XG4gICAgICAgICAgICAgICAgY2xlYW5TaW5nbGVOb2RlKG5vZGUpO1xuXG4gICAgICAgICAgICAgICAgLy8gLi4uIHRoZW4gaXRzIGRlc2NlbmRhbnRzLCB3aGVyZSBhcHBsaWNhYmxlXG4gICAgICAgICAgICAgICAgaWYgKGNsZWFuYWJsZU5vZGVUeXBlc1dpdGhEZXNjZW5kYW50c1tub2RlLm5vZGVUeXBlXSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBDbG9uZSB0aGUgZGVzY2VuZGFudHMgbGlzdCBpbiBjYXNlIGl0IGNoYW5nZXMgZHVyaW5nIGl0ZXJhdGlvblxuICAgICAgICAgICAgICAgICAgICB2YXIgZGVzY2VuZGFudHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAga28udXRpbHMuYXJyYXlQdXNoQWxsKGRlc2NlbmRhbnRzLCBub2RlLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiKlwiKSk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gZGVzY2VuZGFudHMubGVuZ3RoOyBpIDwgajsgaSsrKVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYW5TaW5nbGVOb2RlKGRlc2NlbmRhbnRzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICByZW1vdmVOb2RlIDogZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAga28uY2xlYW5Ob2RlKG5vZGUpO1xuICAgICAgICAgICAgaWYgKG5vZGUucGFyZW50Tm9kZSlcbiAgICAgICAgICAgICAgICBub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgXCJjbGVhbkV4dGVybmFsRGF0YVwiIDogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIC8vIFNwZWNpYWwgc3VwcG9ydCBmb3IgalF1ZXJ5IGhlcmUgYmVjYXVzZSBpdCdzIHNvIGNvbW1vbmx5IHVzZWQuXG4gICAgICAgICAgICAvLyBNYW55IGpRdWVyeSBwbHVnaW5zIChpbmNsdWRpbmcganF1ZXJ5LnRtcGwpIHN0b3JlIGRhdGEgdXNpbmcgalF1ZXJ5J3MgZXF1aXZhbGVudCBvZiBkb21EYXRhXG4gICAgICAgICAgICAvLyBzbyBub3RpZnkgaXQgdG8gdGVhciBkb3duIGFueSByZXNvdXJjZXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBub2RlICYgZGVzY2VuZGFudHMgaGVyZS5cbiAgICAgICAgICAgIGlmIChqUXVlcnlJbnN0YW5jZSAmJiAodHlwZW9mIGpRdWVyeUluc3RhbmNlWydjbGVhbkRhdGEnXSA9PSBcImZ1bmN0aW9uXCIpKVxuICAgICAgICAgICAgICAgIGpRdWVyeUluc3RhbmNlWydjbGVhbkRhdGEnXShbbm9kZV0pO1xuICAgICAgICB9XG4gICAgfVxufSkoKTtcbmtvLmNsZWFuTm9kZSA9IGtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbC5jbGVhbk5vZGU7IC8vIFNob3J0aGFuZCBuYW1lIGZvciBjb252ZW5pZW5jZVxua28ucmVtb3ZlTm9kZSA9IGtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbC5yZW1vdmVOb2RlOyAvLyBTaG9ydGhhbmQgbmFtZSBmb3IgY29udmVuaWVuY2VcbmtvLmV4cG9ydFN5bWJvbCgnY2xlYW5Ob2RlJywga28uY2xlYW5Ob2RlKTtcbmtvLmV4cG9ydFN5bWJvbCgncmVtb3ZlTm9kZScsIGtvLnJlbW92ZU5vZGUpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5kb21Ob2RlRGlzcG9zYWwnLCBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5kb21Ob2RlRGlzcG9zYWwuYWRkRGlzcG9zZUNhbGxiYWNrJywga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLmRvbU5vZGVEaXNwb3NhbC5yZW1vdmVEaXNwb3NlQ2FsbGJhY2snLCBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwucmVtb3ZlRGlzcG9zZUNhbGxiYWNrKTtcbihmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxlYWRpbmdDb21tZW50UmVnZXggPSAvXihcXHMqKTwhLS0oLio/KS0tPi87XG5cbiAgICBmdW5jdGlvbiBzaW1wbGVIdG1sUGFyc2UoaHRtbCkge1xuICAgICAgICAvLyBCYXNlZCBvbiBqUXVlcnkncyBcImNsZWFuXCIgZnVuY3Rpb24sIGJ1dCBvbmx5IGFjY291bnRpbmcgZm9yIHRhYmxlLXJlbGF0ZWQgZWxlbWVudHMuXG4gICAgICAgIC8vIElmIHlvdSBoYXZlIHJlZmVyZW5jZWQgalF1ZXJ5LCB0aGlzIHdvbid0IGJlIHVzZWQgYW55d2F5IC0gS08gd2lsbCB1c2UgalF1ZXJ5J3MgXCJjbGVhblwiIGZ1bmN0aW9uIGRpcmVjdGx5XG5cbiAgICAgICAgLy8gTm90ZSB0aGF0IHRoZXJlJ3Mgc3RpbGwgYW4gaXNzdWUgaW4gSUUgPCA5IHdoZXJlYnkgaXQgd2lsbCBkaXNjYXJkIGNvbW1lbnQgbm9kZXMgdGhhdCBhcmUgdGhlIGZpcnN0IGNoaWxkIG9mXG4gICAgICAgIC8vIGEgZGVzY2VuZGFudCBub2RlLiBGb3IgZXhhbXBsZTogXCI8ZGl2PjwhLS0gbXljb21tZW50IC0tPmFiYzwvZGl2PlwiIHdpbGwgZ2V0IHBhcnNlZCBhcyBcIjxkaXY+YWJjPC9kaXY+XCJcbiAgICAgICAgLy8gVGhpcyB3b24ndCBhZmZlY3QgYW55b25lIHdobyBoYXMgcmVmZXJlbmNlZCBqUXVlcnksIGFuZCB0aGVyZSdzIGFsd2F5cyB0aGUgd29ya2Fyb3VuZCBvZiBpbnNlcnRpbmcgYSBkdW1teSBub2RlXG4gICAgICAgIC8vIChwb3NzaWJseSBhIHRleHQgbm9kZSkgaW4gZnJvbnQgb2YgdGhlIGNvbW1lbnQuIFNvLCBLTyBkb2VzIG5vdCBhdHRlbXB0IHRvIHdvcmthcm91bmQgdGhpcyBJRSBpc3N1ZSBhdXRvbWF0aWNhbGx5IGF0IHByZXNlbnQuXG5cbiAgICAgICAgLy8gVHJpbSB3aGl0ZXNwYWNlLCBvdGhlcndpc2UgaW5kZXhPZiB3b24ndCB3b3JrIGFzIGV4cGVjdGVkXG4gICAgICAgIHZhciB0YWdzID0ga28udXRpbHMuc3RyaW5nVHJpbShodG1sKS50b0xvd2VyQ2FzZSgpLCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgICAgIC8vIEZpbmRzIHRoZSBmaXJzdCBtYXRjaCBmcm9tIHRoZSBsZWZ0IGNvbHVtbiwgYW5kIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgXCJ3cmFwXCIgZGF0YSBmcm9tIHRoZSByaWdodCBjb2x1bW5cbiAgICAgICAgdmFyIHdyYXAgPSB0YWdzLm1hdGNoKC9ePCh0aGVhZHx0Ym9keXx0Zm9vdCkvKSAgICAgICAgICAgICAgJiYgWzEsIFwiPHRhYmxlPlwiLCBcIjwvdGFibGU+XCJdIHx8XG4gICAgICAgICAgICAgICAgICAgIXRhZ3MuaW5kZXhPZihcIjx0clwiKSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgWzIsIFwiPHRhYmxlPjx0Ym9keT5cIiwgXCI8L3Rib2R5PjwvdGFibGU+XCJdIHx8XG4gICAgICAgICAgICAgICAgICAgKCF0YWdzLmluZGV4T2YoXCI8dGRcIikgfHwgIXRhZ3MuaW5kZXhPZihcIjx0aFwiKSkgICAmJiBbMywgXCI8dGFibGU+PHRib2R5Pjx0cj5cIiwgXCI8L3RyPjwvdGJvZHk+PC90YWJsZT5cIl0gfHxcbiAgICAgICAgICAgICAgICAgICAvKiBhbnl0aGluZyBlbHNlICovICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWzAsIFwiXCIsIFwiXCJdO1xuXG4gICAgICAgIC8vIEdvIHRvIGh0bWwgYW5kIGJhY2ssIHRoZW4gcGVlbCBvZmYgZXh0cmEgd3JhcHBlcnNcbiAgICAgICAgLy8gTm90ZSB0aGF0IHdlIGFsd2F5cyBwcmVmaXggd2l0aCBzb21lIGR1bW15IHRleHQsIGJlY2F1c2Ugb3RoZXJ3aXNlLCBJRTw5IHdpbGwgc3RyaXAgb3V0IGxlYWRpbmcgY29tbWVudCBub2RlcyBpbiBkZXNjZW5kYW50cy4gVG90YWwgbWFkbmVzcy5cbiAgICAgICAgdmFyIG1hcmt1cCA9IFwiaWdub3JlZDxkaXY+XCIgKyB3cmFwWzFdICsgaHRtbCArIHdyYXBbMl0gKyBcIjwvZGl2PlwiO1xuICAgICAgICBpZiAodHlwZW9mIHdpbmRvd1snaW5uZXJTaGl2J10gPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQod2luZG93Wydpbm5lclNoaXYnXShtYXJrdXApKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpdi5pbm5lckhUTUwgPSBtYXJrdXA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNb3ZlIHRvIHRoZSByaWdodCBkZXB0aFxuICAgICAgICB3aGlsZSAod3JhcFswXS0tKVxuICAgICAgICAgICAgZGl2ID0gZGl2Lmxhc3RDaGlsZDtcblxuICAgICAgICByZXR1cm4ga28udXRpbHMubWFrZUFycmF5KGRpdi5sYXN0Q2hpbGQuY2hpbGROb2Rlcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24galF1ZXJ5SHRtbFBhcnNlKGh0bWwpIHtcbiAgICAgICAgLy8galF1ZXJ5J3MgXCJwYXJzZUhUTUxcIiBmdW5jdGlvbiB3YXMgaW50cm9kdWNlZCBpbiBqUXVlcnkgMS44LjAgYW5kIGlzIGEgZG9jdW1lbnRlZCBwdWJsaWMgQVBJLlxuICAgICAgICBpZiAoalF1ZXJ5SW5zdGFuY2VbJ3BhcnNlSFRNTCddKSB7XG4gICAgICAgICAgICByZXR1cm4galF1ZXJ5SW5zdGFuY2VbJ3BhcnNlSFRNTCddKGh0bWwpIHx8IFtdOyAvLyBFbnN1cmUgd2UgYWx3YXlzIHJldHVybiBhbiBhcnJheSBhbmQgbmV2ZXIgbnVsbFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gRm9yIGpRdWVyeSA8IDEuOC4wLCB3ZSBmYWxsIGJhY2sgb24gdGhlIHVuZG9jdW1lbnRlZCBpbnRlcm5hbCBcImNsZWFuXCIgZnVuY3Rpb24uXG4gICAgICAgICAgICB2YXIgZWxlbXMgPSBqUXVlcnlJbnN0YW5jZVsnY2xlYW4nXShbaHRtbF0pO1xuXG4gICAgICAgICAgICAvLyBBcyBvZiBqUXVlcnkgMS43LjEsIGpRdWVyeSBwYXJzZXMgdGhlIEhUTUwgYnkgYXBwZW5kaW5nIGl0IHRvIHNvbWUgZHVtbXkgcGFyZW50IG5vZGVzIGhlbGQgaW4gYW4gaW4tbWVtb3J5IGRvY3VtZW50IGZyYWdtZW50LlxuICAgICAgICAgICAgLy8gVW5mb3J0dW5hdGVseSwgaXQgbmV2ZXIgY2xlYXJzIHRoZSBkdW1teSBwYXJlbnQgbm9kZXMgZnJvbSB0aGUgZG9jdW1lbnQgZnJhZ21lbnQsIHNvIGl0IGxlYWtzIG1lbW9yeSBvdmVyIHRpbWUuXG4gICAgICAgICAgICAvLyBGaXggdGhpcyBieSBmaW5kaW5nIHRoZSB0b3AtbW9zdCBkdW1teSBwYXJlbnQgZWxlbWVudCwgYW5kIGRldGFjaGluZyBpdCBmcm9tIGl0cyBvd25lciBmcmFnbWVudC5cbiAgICAgICAgICAgIGlmIChlbGVtcyAmJiBlbGVtc1swXSkge1xuICAgICAgICAgICAgICAgIC8vIEZpbmQgdGhlIHRvcC1tb3N0IHBhcmVudCBlbGVtZW50IHRoYXQncyBhIGRpcmVjdCBjaGlsZCBvZiBhIGRvY3VtZW50IGZyYWdtZW50XG4gICAgICAgICAgICAgICAgdmFyIGVsZW0gPSBlbGVtc1swXTtcbiAgICAgICAgICAgICAgICB3aGlsZSAoZWxlbS5wYXJlbnROb2RlICYmIGVsZW0ucGFyZW50Tm9kZS5ub2RlVHlwZSAhPT0gMTEgLyogaS5lLiwgRG9jdW1lbnRGcmFnbWVudCAqLylcbiAgICAgICAgICAgICAgICAgICAgZWxlbSA9IGVsZW0ucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICAvLyAuLi4gdGhlbiBkZXRhY2ggaXRcbiAgICAgICAgICAgICAgICBpZiAoZWxlbS5wYXJlbnROb2RlKVxuICAgICAgICAgICAgICAgICAgICBlbGVtLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBlbGVtcztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGtvLnV0aWxzLnBhcnNlSHRtbEZyYWdtZW50ID0gZnVuY3Rpb24oaHRtbCkge1xuICAgICAgICByZXR1cm4galF1ZXJ5SW5zdGFuY2UgPyBqUXVlcnlIdG1sUGFyc2UoaHRtbCkgICAvLyBBcyBiZWxvdywgYmVuZWZpdCBmcm9tIGpRdWVyeSdzIG9wdGltaXNhdGlvbnMgd2hlcmUgcG9zc2libGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogc2ltcGxlSHRtbFBhcnNlKGh0bWwpOyAgLy8gLi4uIG90aGVyd2lzZSwgdGhpcyBzaW1wbGUgbG9naWMgd2lsbCBkbyBpbiBtb3N0IGNvbW1vbiBjYXNlcy5cbiAgICB9O1xuXG4gICAga28udXRpbHMuc2V0SHRtbCA9IGZ1bmN0aW9uKG5vZGUsIGh0bWwpIHtcbiAgICAgICAga28udXRpbHMuZW1wdHlEb21Ob2RlKG5vZGUpO1xuXG4gICAgICAgIC8vIFRoZXJlJ3Mgbm8gbGVnaXRpbWF0ZSByZWFzb24gdG8gZGlzcGxheSBhIHN0cmluZ2lmaWVkIG9ic2VydmFibGUgd2l0aG91dCB1bndyYXBwaW5nIGl0LCBzbyB3ZSdsbCB1bndyYXAgaXRcbiAgICAgICAgaHRtbCA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUoaHRtbCk7XG5cbiAgICAgICAgaWYgKChodG1sICE9PSBudWxsKSAmJiAoaHRtbCAhPT0gdW5kZWZpbmVkKSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBodG1sICE9ICdzdHJpbmcnKVxuICAgICAgICAgICAgICAgIGh0bWwgPSBodG1sLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgIC8vIGpRdWVyeSBjb250YWlucyBhIGxvdCBvZiBzb3BoaXN0aWNhdGVkIGNvZGUgdG8gcGFyc2UgYXJiaXRyYXJ5IEhUTUwgZnJhZ21lbnRzLFxuICAgICAgICAgICAgLy8gZm9yIGV4YW1wbGUgPHRyPiBlbGVtZW50cyB3aGljaCBhcmUgbm90IG5vcm1hbGx5IGFsbG93ZWQgdG8gZXhpc3Qgb24gdGhlaXIgb3duLlxuICAgICAgICAgICAgLy8gSWYgeW91J3ZlIHJlZmVyZW5jZWQgalF1ZXJ5IHdlJ2xsIHVzZSB0aGF0IHJhdGhlciB0aGFuIGR1cGxpY2F0aW5nIGl0cyBjb2RlLlxuICAgICAgICAgICAgaWYgKGpRdWVyeUluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgalF1ZXJ5SW5zdGFuY2Uobm9kZSlbJ2h0bWwnXShodG1sKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gLi4uIG90aGVyd2lzZSwgdXNlIEtPJ3Mgb3duIHBhcnNpbmcgbG9naWMuXG4gICAgICAgICAgICAgICAgdmFyIHBhcnNlZE5vZGVzID0ga28udXRpbHMucGFyc2VIdG1sRnJhZ21lbnQoaHRtbCk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJzZWROb2Rlcy5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChwYXJzZWROb2Rlc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcblxua28uZXhwb3J0U3ltYm9sKCd1dGlscy5wYXJzZUh0bWxGcmFnbWVudCcsIGtvLnV0aWxzLnBhcnNlSHRtbEZyYWdtZW50KTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuc2V0SHRtbCcsIGtvLnV0aWxzLnNldEh0bWwpO1xuXG5rby5tZW1vaXphdGlvbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1lbW9zID0ge307XG5cbiAgICBmdW5jdGlvbiByYW5kb21NYXg4SGV4Q2hhcnMoKSB7XG4gICAgICAgIHJldHVybiAoKCgxICsgTWF0aC5yYW5kb20oKSkgKiAweDEwMDAwMDAwMCkgfCAwKS50b1N0cmluZygxNikuc3Vic3RyaW5nKDEpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbUlkKCkge1xuICAgICAgICByZXR1cm4gcmFuZG9tTWF4OEhleENoYXJzKCkgKyByYW5kb21NYXg4SGV4Q2hhcnMoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZmluZE1lbW9Ob2Rlcyhyb290Tm9kZSwgYXBwZW5kVG9BcnJheSkge1xuICAgICAgICBpZiAoIXJvb3ROb2RlKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpZiAocm9vdE5vZGUubm9kZVR5cGUgPT0gOCkge1xuICAgICAgICAgICAgdmFyIG1lbW9JZCA9IGtvLm1lbW9pemF0aW9uLnBhcnNlTWVtb1RleHQocm9vdE5vZGUubm9kZVZhbHVlKTtcbiAgICAgICAgICAgIGlmIChtZW1vSWQgIT0gbnVsbClcbiAgICAgICAgICAgICAgICBhcHBlbmRUb0FycmF5LnB1c2goeyBkb21Ob2RlOiByb290Tm9kZSwgbWVtb0lkOiBtZW1vSWQgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAocm9vdE5vZGUubm9kZVR5cGUgPT0gMSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGNoaWxkTm9kZXMgPSByb290Tm9kZS5jaGlsZE5vZGVzLCBqID0gY2hpbGROb2Rlcy5sZW5ndGg7IGkgPCBqOyBpKyspXG4gICAgICAgICAgICAgICAgZmluZE1lbW9Ob2RlcyhjaGlsZE5vZGVzW2ldLCBhcHBlbmRUb0FycmF5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIG1lbW9pemU6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiWW91IGNhbiBvbmx5IHBhc3MgYSBmdW5jdGlvbiB0byBrby5tZW1vaXphdGlvbi5tZW1vaXplKClcIik7XG4gICAgICAgICAgICB2YXIgbWVtb0lkID0gZ2VuZXJhdGVSYW5kb21JZCgpO1xuICAgICAgICAgICAgbWVtb3NbbWVtb0lkXSA9IGNhbGxiYWNrO1xuICAgICAgICAgICAgcmV0dXJuIFwiPCEtLVtrb19tZW1vOlwiICsgbWVtb0lkICsgXCJdLS0+XCI7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdW5tZW1vaXplOiBmdW5jdGlvbiAobWVtb0lkLCBjYWxsYmFja1BhcmFtcykge1xuICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gbWVtb3NbbWVtb0lkXTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYW55IG1lbW8gd2l0aCBJRCBcIiArIG1lbW9JZCArIFwiLiBQZXJoYXBzIGl0J3MgYWxyZWFkeSBiZWVuIHVubWVtb2l6ZWQuXCIpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShudWxsLCBjYWxsYmFja1BhcmFtcyB8fCBbXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaW5hbGx5IHsgZGVsZXRlIG1lbW9zW21lbW9JZF07IH1cbiAgICAgICAgfSxcblxuICAgICAgICB1bm1lbW9pemVEb21Ob2RlQW5kRGVzY2VuZGFudHM6IGZ1bmN0aW9uIChkb21Ob2RlLCBleHRyYUNhbGxiYWNrUGFyYW1zQXJyYXkpIHtcbiAgICAgICAgICAgIHZhciBtZW1vcyA9IFtdO1xuICAgICAgICAgICAgZmluZE1lbW9Ob2Rlcyhkb21Ob2RlLCBtZW1vcyk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IG1lbW9zLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBub2RlID0gbWVtb3NbaV0uZG9tTm9kZTtcbiAgICAgICAgICAgICAgICB2YXIgY29tYmluZWRQYXJhbXMgPSBbbm9kZV07XG4gICAgICAgICAgICAgICAgaWYgKGV4dHJhQ2FsbGJhY2tQYXJhbXNBcnJheSlcbiAgICAgICAgICAgICAgICAgICAga28udXRpbHMuYXJyYXlQdXNoQWxsKGNvbWJpbmVkUGFyYW1zLCBleHRyYUNhbGxiYWNrUGFyYW1zQXJyYXkpO1xuICAgICAgICAgICAgICAgIGtvLm1lbW9pemF0aW9uLnVubWVtb2l6ZShtZW1vc1tpXS5tZW1vSWQsIGNvbWJpbmVkUGFyYW1zKTtcbiAgICAgICAgICAgICAgICBub2RlLm5vZGVWYWx1ZSA9IFwiXCI7IC8vIE5ldXRlciB0aGlzIG5vZGUgc28gd2UgZG9uJ3QgdHJ5IHRvIHVubWVtb2l6ZSBpdCBhZ2FpblxuICAgICAgICAgICAgICAgIGlmIChub2RlLnBhcmVudE5vZGUpXG4gICAgICAgICAgICAgICAgICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTsgLy8gSWYgcG9zc2libGUsIGVyYXNlIGl0IHRvdGFsbHkgKG5vdCBhbHdheXMgcG9zc2libGUgLSBzb21lb25lIGVsc2UgbWlnaHQganVzdCBob2xkIGEgcmVmZXJlbmNlIHRvIGl0IHRoZW4gY2FsbCB1bm1lbW9pemVEb21Ob2RlQW5kRGVzY2VuZGFudHMgYWdhaW4pXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2VNZW1vVGV4dDogZnVuY3Rpb24gKG1lbW9UZXh0KSB7XG4gICAgICAgICAgICB2YXIgbWF0Y2ggPSBtZW1vVGV4dC5tYXRjaCgvXlxcW2tvX21lbW9cXDooLio/KVxcXSQvKTtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaCA/IG1hdGNoWzFdIDogbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuXG5rby5leHBvcnRTeW1ib2woJ21lbW9pemF0aW9uJywga28ubWVtb2l6YXRpb24pO1xua28uZXhwb3J0U3ltYm9sKCdtZW1vaXphdGlvbi5tZW1vaXplJywga28ubWVtb2l6YXRpb24ubWVtb2l6ZSk7XG5rby5leHBvcnRTeW1ib2woJ21lbW9pemF0aW9uLnVubWVtb2l6ZScsIGtvLm1lbW9pemF0aW9uLnVubWVtb2l6ZSk7XG5rby5leHBvcnRTeW1ib2woJ21lbW9pemF0aW9uLnBhcnNlTWVtb1RleHQnLCBrby5tZW1vaXphdGlvbi5wYXJzZU1lbW9UZXh0KTtcbmtvLmV4cG9ydFN5bWJvbCgnbWVtb2l6YXRpb24udW5tZW1vaXplRG9tTm9kZUFuZERlc2NlbmRhbnRzJywga28ubWVtb2l6YXRpb24udW5tZW1vaXplRG9tTm9kZUFuZERlc2NlbmRhbnRzKTtcbmtvLmV4dGVuZGVycyA9IHtcbiAgICAndGhyb3R0bGUnOiBmdW5jdGlvbih0YXJnZXQsIHRpbWVvdXQpIHtcbiAgICAgICAgLy8gVGhyb3R0bGluZyBtZWFucyB0d28gdGhpbmdzOlxuXG4gICAgICAgIC8vICgxKSBGb3IgZGVwZW5kZW50IG9ic2VydmFibGVzLCB3ZSB0aHJvdHRsZSAqZXZhbHVhdGlvbnMqIHNvIHRoYXQsIG5vIG1hdHRlciBob3cgZmFzdCBpdHMgZGVwZW5kZW5jaWVzXG4gICAgICAgIC8vICAgICBub3RpZnkgdXBkYXRlcywgdGhlIHRhcmdldCBkb2Vzbid0IHJlLWV2YWx1YXRlIChhbmQgaGVuY2UgZG9lc24ndCBub3RpZnkpIGZhc3RlciB0aGFuIGEgY2VydGFpbiByYXRlXG4gICAgICAgIHRhcmdldFsndGhyb3R0bGVFdmFsdWF0aW9uJ10gPSB0aW1lb3V0O1xuXG4gICAgICAgIC8vICgyKSBGb3Igd3JpdGFibGUgdGFyZ2V0cyAob2JzZXJ2YWJsZXMsIG9yIHdyaXRhYmxlIGRlcGVuZGVudCBvYnNlcnZhYmxlcyksIHdlIHRocm90dGxlICp3cml0ZXMqXG4gICAgICAgIC8vICAgICBzbyB0aGUgdGFyZ2V0IGNhbm5vdCBjaGFuZ2UgdmFsdWUgc3luY2hyb25vdXNseSBvciBmYXN0ZXIgdGhhbiBhIGNlcnRhaW4gcmF0ZVxuICAgICAgICB2YXIgd3JpdGVUaW1lb3V0SW5zdGFuY2UgPSBudWxsO1xuICAgICAgICByZXR1cm4ga28uZGVwZW5kZW50T2JzZXJ2YWJsZSh7XG4gICAgICAgICAgICAncmVhZCc6IHRhcmdldCxcbiAgICAgICAgICAgICd3cml0ZSc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHdyaXRlVGltZW91dEluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICB3cml0ZVRpbWVvdXRJbnN0YW5jZSA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSwgdGltZW91dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAncmF0ZUxpbWl0JzogZnVuY3Rpb24odGFyZ2V0LCBvcHRpb25zKSB7XG4gICAgICAgIHZhciB0aW1lb3V0LCBtZXRob2QsIGxpbWl0RnVuY3Rpb247XG5cbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB0aW1lb3V0ID0gb3B0aW9ucztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBvcHRpb25zWyd0aW1lb3V0J107XG4gICAgICAgICAgICBtZXRob2QgPSBvcHRpb25zWydtZXRob2QnXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxpbWl0RnVuY3Rpb24gPSBtZXRob2QgPT0gJ25vdGlmeVdoZW5DaGFuZ2VzU3RvcCcgPyAgZGVib3VuY2UgOiB0aHJvdHRsZTtcbiAgICAgICAgdGFyZ2V0LmxpbWl0KGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICByZXR1cm4gbGltaXRGdW5jdGlvbihjYWxsYmFjaywgdGltZW91dCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAnbm90aWZ5JzogZnVuY3Rpb24odGFyZ2V0LCBub3RpZnlXaGVuKSB7XG4gICAgICAgIHRhcmdldFtcImVxdWFsaXR5Q29tcGFyZXJcIl0gPSBub3RpZnlXaGVuID09IFwiYWx3YXlzXCIgP1xuICAgICAgICAgICAgbnVsbCA6ICAvLyBudWxsIGVxdWFsaXR5Q29tcGFyZXIgbWVhbnMgdG8gYWx3YXlzIG5vdGlmeVxuICAgICAgICAgICAgdmFsdWVzQXJlUHJpbWl0aXZlQW5kRXF1YWw7XG4gICAgfVxufTtcblxudmFyIHByaW1pdGl2ZVR5cGVzID0geyAndW5kZWZpbmVkJzoxLCAnYm9vbGVhbic6MSwgJ251bWJlcic6MSwgJ3N0cmluZyc6MSB9O1xuZnVuY3Rpb24gdmFsdWVzQXJlUHJpbWl0aXZlQW5kRXF1YWwoYSwgYikge1xuICAgIHZhciBvbGRWYWx1ZUlzUHJpbWl0aXZlID0gKGEgPT09IG51bGwpIHx8ICh0eXBlb2YoYSkgaW4gcHJpbWl0aXZlVHlwZXMpO1xuICAgIHJldHVybiBvbGRWYWx1ZUlzUHJpbWl0aXZlID8gKGEgPT09IGIpIDogZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHRocm90dGxlKGNhbGxiYWNrLCB0aW1lb3V0KSB7XG4gICAgdmFyIHRpbWVvdXRJbnN0YW5jZTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRpbWVvdXRJbnN0YW5jZSkge1xuICAgICAgICAgICAgdGltZW91dEluc3RhbmNlID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aW1lb3V0SW5zdGFuY2UgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH0sIHRpbWVvdXQpO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gZGVib3VuY2UoY2FsbGJhY2ssIHRpbWVvdXQpIHtcbiAgICB2YXIgdGltZW91dEluc3RhbmNlO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SW5zdGFuY2UpO1xuICAgICAgICB0aW1lb3V0SW5zdGFuY2UgPSBzZXRUaW1lb3V0KGNhbGxiYWNrLCB0aW1lb3V0KTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBhcHBseUV4dGVuZGVycyhyZXF1ZXN0ZWRFeHRlbmRlcnMpIHtcbiAgICB2YXIgdGFyZ2V0ID0gdGhpcztcbiAgICBpZiAocmVxdWVzdGVkRXh0ZW5kZXJzKSB7XG4gICAgICAgIGtvLnV0aWxzLm9iamVjdEZvckVhY2gocmVxdWVzdGVkRXh0ZW5kZXJzLCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgZXh0ZW5kZXJIYW5kbGVyID0ga28uZXh0ZW5kZXJzW2tleV07XG4gICAgICAgICAgICBpZiAodHlwZW9mIGV4dGVuZGVySGFuZGxlciA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gZXh0ZW5kZXJIYW5kbGVyKHRhcmdldCwgdmFsdWUpIHx8IHRhcmdldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG59XG5cbmtvLmV4cG9ydFN5bWJvbCgnZXh0ZW5kZXJzJywga28uZXh0ZW5kZXJzKTtcblxua28uc3Vic2NyaXB0aW9uID0gZnVuY3Rpb24gKHRhcmdldCwgY2FsbGJhY2ssIGRpc3Bvc2VDYWxsYmFjaykge1xuICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB0aGlzLmRpc3Bvc2VDYWxsYmFjayA9IGRpc3Bvc2VDYWxsYmFjaztcbiAgICB0aGlzLmlzRGlzcG9zZWQgPSBmYWxzZTtcbiAgICBrby5leHBvcnRQcm9wZXJ0eSh0aGlzLCAnZGlzcG9zZScsIHRoaXMuZGlzcG9zZSk7XG59O1xua28uc3Vic2NyaXB0aW9uLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuaXNEaXNwb3NlZCA9IHRydWU7XG4gICAgdGhpcy5kaXNwb3NlQ2FsbGJhY2soKTtcbn07XG5cbmtvLnN1YnNjcmliYWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBrby51dGlscy5zZXRQcm90b3R5cGVPZk9yRXh0ZW5kKHRoaXMsIGtvLnN1YnNjcmliYWJsZVsnZm4nXSk7XG4gICAgdGhpcy5fc3Vic2NyaXB0aW9ucyA9IHt9O1xufVxuXG52YXIgZGVmYXVsdEV2ZW50ID0gXCJjaGFuZ2VcIjtcblxudmFyIGtvX3N1YnNjcmliYWJsZV9mbiA9IHtcbiAgICBzdWJzY3JpYmU6IGZ1bmN0aW9uIChjYWxsYmFjaywgY2FsbGJhY2tUYXJnZXQsIGV2ZW50KSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBldmVudCA9IGV2ZW50IHx8IGRlZmF1bHRFdmVudDtcbiAgICAgICAgdmFyIGJvdW5kQ2FsbGJhY2sgPSBjYWxsYmFja1RhcmdldCA/IGNhbGxiYWNrLmJpbmQoY2FsbGJhY2tUYXJnZXQpIDogY2FsbGJhY2s7XG5cbiAgICAgICAgdmFyIHN1YnNjcmlwdGlvbiA9IG5ldyBrby5zdWJzY3JpcHRpb24oc2VsZiwgYm91bmRDYWxsYmFjaywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAga28udXRpbHMuYXJyYXlSZW1vdmVJdGVtKHNlbGYuX3N1YnNjcmlwdGlvbnNbZXZlbnRdLCBzdWJzY3JpcHRpb24pO1xuICAgICAgICAgICAgaWYgKHNlbGYuYWZ0ZXJTdWJzY3JpcHRpb25SZW1vdmUpXG4gICAgICAgICAgICAgICAgc2VsZi5hZnRlclN1YnNjcmlwdGlvblJlbW92ZShldmVudCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChzZWxmLmJlZm9yZVN1YnNjcmlwdGlvbkFkZClcbiAgICAgICAgICAgIHNlbGYuYmVmb3JlU3Vic2NyaXB0aW9uQWRkKGV2ZW50KTtcblxuICAgICAgICBpZiAoIXNlbGYuX3N1YnNjcmlwdGlvbnNbZXZlbnRdKVxuICAgICAgICAgICAgc2VsZi5fc3Vic2NyaXB0aW9uc1tldmVudF0gPSBbXTtcbiAgICAgICAgc2VsZi5fc3Vic2NyaXB0aW9uc1tldmVudF0ucHVzaChzdWJzY3JpcHRpb24pO1xuXG4gICAgICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gICAgfSxcblxuICAgIFwibm90aWZ5U3Vic2NyaWJlcnNcIjogZnVuY3Rpb24gKHZhbHVlVG9Ob3RpZnksIGV2ZW50KSB7XG4gICAgICAgIGV2ZW50ID0gZXZlbnQgfHwgZGVmYXVsdEV2ZW50O1xuICAgICAgICBpZiAodGhpcy5oYXNTdWJzY3JpcHRpb25zRm9yRXZlbnQoZXZlbnQpKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uYmVnaW4oKTsgLy8gQmVnaW4gc3VwcHJlc3NpbmcgZGVwZW5kZW5jeSBkZXRlY3Rpb24gKGJ5IHNldHRpbmcgdGhlIHRvcCBmcmFtZSB0byB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgYSA9IHRoaXMuX3N1YnNjcmlwdGlvbnNbZXZlbnRdLnNsaWNlKDApLCBpID0gMCwgc3Vic2NyaXB0aW9uOyBzdWJzY3JpcHRpb24gPSBhW2ldOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSW4gY2FzZSBhIHN1YnNjcmlwdGlvbiB3YXMgZGlzcG9zZWQgZHVyaW5nIHRoZSBhcnJheUZvckVhY2ggY3ljbGUsIGNoZWNrXG4gICAgICAgICAgICAgICAgICAgIC8vIGZvciBpc0Rpc3Bvc2VkIG9uIGVhY2ggc3Vic2NyaXB0aW9uIGJlZm9yZSBpbnZva2luZyBpdHMgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzdWJzY3JpcHRpb24uaXNEaXNwb3NlZClcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi5jYWxsYmFjayh2YWx1ZVRvTm90aWZ5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uZW5kKCk7IC8vIEVuZCBzdXBwcmVzc2luZyBkZXBlbmRlbmN5IGRldGVjdGlvblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGxpbWl0OiBmdW5jdGlvbihsaW1pdEZ1bmN0aW9uKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcywgc2VsZklzT2JzZXJ2YWJsZSA9IGtvLmlzT2JzZXJ2YWJsZShzZWxmKSxcbiAgICAgICAgICAgIGlzUGVuZGluZywgcHJldmlvdXNWYWx1ZSwgcGVuZGluZ1ZhbHVlLCBiZWZvcmVDaGFuZ2UgPSAnYmVmb3JlQ2hhbmdlJztcblxuICAgICAgICBpZiAoIXNlbGYuX29yaWdOb3RpZnlTdWJzY3JpYmVycykge1xuICAgICAgICAgICAgc2VsZi5fb3JpZ05vdGlmeVN1YnNjcmliZXJzID0gc2VsZltcIm5vdGlmeVN1YnNjcmliZXJzXCJdO1xuICAgICAgICAgICAgc2VsZltcIm5vdGlmeVN1YnNjcmliZXJzXCJdID0gZnVuY3Rpb24odmFsdWUsIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFldmVudCB8fCBldmVudCA9PT0gZGVmYXVsdEV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX3JhdGVMaW1pdGVkQ2hhbmdlKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50ID09PSBiZWZvcmVDaGFuZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fcmF0ZUxpbWl0ZWRCZWZvcmVDaGFuZ2UodmFsdWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX29yaWdOb3RpZnlTdWJzY3JpYmVycyh2YWx1ZSwgZXZlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZmluaXNoID0gbGltaXRGdW5jdGlvbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIElmIGFuIG9ic2VydmFibGUgcHJvdmlkZWQgYSByZWZlcmVuY2UgdG8gaXRzZWxmLCBhY2Nlc3MgaXQgdG8gZ2V0IHRoZSBsYXRlc3QgdmFsdWUuXG4gICAgICAgICAgICAvLyBUaGlzIGFsbG93cyBjb21wdXRlZCBvYnNlcnZhYmxlcyB0byBkZWxheSBjYWxjdWxhdGluZyB0aGVpciB2YWx1ZSB1bnRpbCBuZWVkZWQuXG4gICAgICAgICAgICBpZiAoc2VsZklzT2JzZXJ2YWJsZSAmJiBwZW5kaW5nVmFsdWUgPT09IHNlbGYpIHtcbiAgICAgICAgICAgICAgICBwZW5kaW5nVmFsdWUgPSBzZWxmKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpc1BlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChzZWxmLmlzRGlmZmVyZW50KHByZXZpb3VzVmFsdWUsIHBlbmRpbmdWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBzZWxmLl9vcmlnTm90aWZ5U3Vic2NyaWJlcnMocHJldmlvdXNWYWx1ZSA9IHBlbmRpbmdWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNlbGYuX3JhdGVMaW1pdGVkQ2hhbmdlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlzUGVuZGluZyA9IHRydWU7XG4gICAgICAgICAgICBwZW5kaW5nVmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIGZpbmlzaCgpO1xuICAgICAgICB9O1xuICAgICAgICBzZWxmLl9yYXRlTGltaXRlZEJlZm9yZUNoYW5nZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoIWlzUGVuZGluZykge1xuICAgICAgICAgICAgICAgIHByZXZpb3VzVmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBzZWxmLl9vcmlnTm90aWZ5U3Vic2NyaWJlcnModmFsdWUsIGJlZm9yZUNoYW5nZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIGhhc1N1YnNjcmlwdGlvbnNGb3JFdmVudDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N1YnNjcmlwdGlvbnNbZXZlbnRdICYmIHRoaXMuX3N1YnNjcmlwdGlvbnNbZXZlbnRdLmxlbmd0aDtcbiAgICB9LFxuXG4gICAgZ2V0U3Vic2NyaXB0aW9uc0NvdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0b3RhbCA9IDA7XG4gICAgICAgIGtvLnV0aWxzLm9iamVjdEZvckVhY2godGhpcy5fc3Vic2NyaXB0aW9ucywgZnVuY3Rpb24oZXZlbnROYW1lLCBzdWJzY3JpcHRpb25zKSB7XG4gICAgICAgICAgICB0b3RhbCArPSBzdWJzY3JpcHRpb25zLmxlbmd0aDtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0b3RhbDtcbiAgICB9LFxuXG4gICAgaXNEaWZmZXJlbnQ6IGZ1bmN0aW9uKG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgICAgICByZXR1cm4gIXRoaXNbJ2VxdWFsaXR5Q29tcGFyZXInXSB8fCAhdGhpc1snZXF1YWxpdHlDb21wYXJlciddKG9sZFZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgfSxcblxuICAgIGV4dGVuZDogYXBwbHlFeHRlbmRlcnNcbn07XG5cbmtvLmV4cG9ydFByb3BlcnR5KGtvX3N1YnNjcmliYWJsZV9mbiwgJ3N1YnNjcmliZScsIGtvX3N1YnNjcmliYWJsZV9mbi5zdWJzY3JpYmUpO1xua28uZXhwb3J0UHJvcGVydHkoa29fc3Vic2NyaWJhYmxlX2ZuLCAnZXh0ZW5kJywga29fc3Vic2NyaWJhYmxlX2ZuLmV4dGVuZCk7XG5rby5leHBvcnRQcm9wZXJ0eShrb19zdWJzY3JpYmFibGVfZm4sICdnZXRTdWJzY3JpcHRpb25zQ291bnQnLCBrb19zdWJzY3JpYmFibGVfZm4uZ2V0U3Vic2NyaXB0aW9uc0NvdW50KTtcblxuLy8gRm9yIGJyb3dzZXJzIHRoYXQgc3VwcG9ydCBwcm90byBhc3NpZ25tZW50LCB3ZSBvdmVyd3JpdGUgdGhlIHByb3RvdHlwZSBvZiBlYWNoXG4vLyBvYnNlcnZhYmxlIGluc3RhbmNlLiBTaW5jZSBvYnNlcnZhYmxlcyBhcmUgZnVuY3Rpb25zLCB3ZSBuZWVkIEZ1bmN0aW9uLnByb3RvdHlwZVxuLy8gdG8gc3RpbGwgYmUgaW4gdGhlIHByb3RvdHlwZSBjaGFpbi5cbmlmIChrby51dGlscy5jYW5TZXRQcm90b3R5cGUpIHtcbiAgICBrby51dGlscy5zZXRQcm90b3R5cGVPZihrb19zdWJzY3JpYmFibGVfZm4sIEZ1bmN0aW9uLnByb3RvdHlwZSk7XG59XG5cbmtvLnN1YnNjcmliYWJsZVsnZm4nXSA9IGtvX3N1YnNjcmliYWJsZV9mbjtcblxuXG5rby5pc1N1YnNjcmliYWJsZSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHJldHVybiBpbnN0YW5jZSAhPSBudWxsICYmIHR5cGVvZiBpbnN0YW5jZS5zdWJzY3JpYmUgPT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBpbnN0YW5jZVtcIm5vdGlmeVN1YnNjcmliZXJzXCJdID09IFwiZnVuY3Rpb25cIjtcbn07XG5cbmtvLmV4cG9ydFN5bWJvbCgnc3Vic2NyaWJhYmxlJywga28uc3Vic2NyaWJhYmxlKTtcbmtvLmV4cG9ydFN5bWJvbCgnaXNTdWJzY3JpYmFibGUnLCBrby5pc1N1YnNjcmliYWJsZSk7XG5cbmtvLmNvbXB1dGVkQ29udGV4dCA9IGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24gPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBvdXRlckZyYW1lcyA9IFtdLFxuICAgICAgICBjdXJyZW50RnJhbWUsXG4gICAgICAgIGxhc3RJZCA9IDA7XG5cbiAgICAvLyBSZXR1cm4gYSB1bmlxdWUgSUQgdGhhdCBjYW4gYmUgYXNzaWduZWQgdG8gYW4gb2JzZXJ2YWJsZSBmb3IgZGVwZW5kZW5jeSB0cmFja2luZy5cbiAgICAvLyBUaGVvcmV0aWNhbGx5LCB5b3UgY291bGQgZXZlbnR1YWxseSBvdmVyZmxvdyB0aGUgbnVtYmVyIHN0b3JhZ2Ugc2l6ZSwgcmVzdWx0aW5nXG4gICAgLy8gaW4gZHVwbGljYXRlIElEcy4gQnV0IGluIEphdmFTY3JpcHQsIHRoZSBsYXJnZXN0IGV4YWN0IGludGVncmFsIHZhbHVlIGlzIDJeNTNcbiAgICAvLyBvciA5LDAwNywxOTksMjU0LDc0MCw5OTIuIElmIHlvdSBjcmVhdGVkIDEsMDAwLDAwMCBJRHMgcGVyIHNlY29uZCwgaXQgd291bGRcbiAgICAvLyB0YWtlIG92ZXIgMjg1IHllYXJzIHRvIHJlYWNoIHRoYXQgbnVtYmVyLlxuICAgIC8vIFJlZmVyZW5jZSBodHRwOi8vYmxvZy52amV1eC5jb20vMjAxMC9qYXZhc2NyaXB0L2phdmFzY3JpcHQtbWF4X2ludC1udW1iZXItbGltaXRzLmh0bWxcbiAgICBmdW5jdGlvbiBnZXRJZCgpIHtcbiAgICAgICAgcmV0dXJuICsrbGFzdElkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJlZ2luKG9wdGlvbnMpIHtcbiAgICAgICAgb3V0ZXJGcmFtZXMucHVzaChjdXJyZW50RnJhbWUpO1xuICAgICAgICBjdXJyZW50RnJhbWUgPSBvcHRpb25zO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVuZCgpIHtcbiAgICAgICAgY3VycmVudEZyYW1lID0gb3V0ZXJGcmFtZXMucG9wKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgYmVnaW46IGJlZ2luLFxuXG4gICAgICAgIGVuZDogZW5kLFxuXG4gICAgICAgIHJlZ2lzdGVyRGVwZW5kZW5jeTogZnVuY3Rpb24gKHN1YnNjcmliYWJsZSkge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRGcmFtZSkge1xuICAgICAgICAgICAgICAgIGlmICgha28uaXNTdWJzY3JpYmFibGUoc3Vic2NyaWJhYmxlKSlcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiT25seSBzdWJzY3JpYmFibGUgdGhpbmdzIGNhbiBhY3QgYXMgZGVwZW5kZW5jaWVzXCIpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRGcmFtZS5jYWxsYmFjayhzdWJzY3JpYmFibGUsIHN1YnNjcmliYWJsZS5faWQgfHwgKHN1YnNjcmliYWJsZS5faWQgPSBnZXRJZCgpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgaWdub3JlOiBmdW5jdGlvbiAoY2FsbGJhY2ssIGNhbGxiYWNrVGFyZ2V0LCBjYWxsYmFja0FyZ3MpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYmVnaW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkoY2FsbGJhY2tUYXJnZXQsIGNhbGxiYWNrQXJncyB8fCBbXSk7XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIGVuZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGdldERlcGVuZGVuY2llc0NvdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudEZyYW1lKVxuICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50RnJhbWUuY29tcHV0ZWQuZ2V0RGVwZW5kZW5jaWVzQ291bnQoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc0luaXRpYWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRGcmFtZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudEZyYW1lLmlzSW5pdGlhbDtcbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuXG5rby5leHBvcnRTeW1ib2woJ2NvbXB1dGVkQ29udGV4dCcsIGtvLmNvbXB1dGVkQ29udGV4dCk7XG5rby5leHBvcnRTeW1ib2woJ2NvbXB1dGVkQ29udGV4dC5nZXREZXBlbmRlbmNpZXNDb3VudCcsIGtvLmNvbXB1dGVkQ29udGV4dC5nZXREZXBlbmRlbmNpZXNDb3VudCk7XG5rby5leHBvcnRTeW1ib2woJ2NvbXB1dGVkQ29udGV4dC5pc0luaXRpYWwnLCBrby5jb21wdXRlZENvbnRleHQuaXNJbml0aWFsKTtcbmtvLmV4cG9ydFN5bWJvbCgnY29tcHV0ZWRDb250ZXh0LmlzU2xlZXBpbmcnLCBrby5jb21wdXRlZENvbnRleHQuaXNTbGVlcGluZyk7XG5rby5vYnNlcnZhYmxlID0gZnVuY3Rpb24gKGluaXRpYWxWYWx1ZSkge1xuICAgIHZhciBfbGF0ZXN0VmFsdWUgPSBpbml0aWFsVmFsdWU7XG5cbiAgICBmdW5jdGlvbiBvYnNlcnZhYmxlKCkge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIC8vIFdyaXRlXG5cbiAgICAgICAgICAgIC8vIElnbm9yZSB3cml0ZXMgaWYgdGhlIHZhbHVlIGhhc24ndCBjaGFuZ2VkXG4gICAgICAgICAgICBpZiAob2JzZXJ2YWJsZS5pc0RpZmZlcmVudChfbGF0ZXN0VmFsdWUsIGFyZ3VtZW50c1swXSkpIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZhYmxlLnZhbHVlV2lsbE11dGF0ZSgpO1xuICAgICAgICAgICAgICAgIF9sYXRlc3RWYWx1ZSA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgICAgICBpZiAoREVCVUcpIG9ic2VydmFibGUuX2xhdGVzdFZhbHVlID0gX2xhdGVzdFZhbHVlO1xuICAgICAgICAgICAgICAgIG9ic2VydmFibGUudmFsdWVIYXNNdXRhdGVkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpczsgLy8gUGVybWl0cyBjaGFpbmVkIGFzc2lnbm1lbnRzXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBSZWFkXG4gICAgICAgICAgICBrby5kZXBlbmRlbmN5RGV0ZWN0aW9uLnJlZ2lzdGVyRGVwZW5kZW5jeShvYnNlcnZhYmxlKTsgLy8gVGhlIGNhbGxlciBvbmx5IG5lZWRzIHRvIGJlIG5vdGlmaWVkIG9mIGNoYW5nZXMgaWYgdGhleSBkaWQgYSBcInJlYWRcIiBvcGVyYXRpb25cbiAgICAgICAgICAgIHJldHVybiBfbGF0ZXN0VmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAga28uc3Vic2NyaWJhYmxlLmNhbGwob2JzZXJ2YWJsZSk7XG4gICAga28udXRpbHMuc2V0UHJvdG90eXBlT2ZPckV4dGVuZChvYnNlcnZhYmxlLCBrby5vYnNlcnZhYmxlWydmbiddKTtcblxuICAgIGlmIChERUJVRykgb2JzZXJ2YWJsZS5fbGF0ZXN0VmFsdWUgPSBfbGF0ZXN0VmFsdWU7XG4gICAgb2JzZXJ2YWJsZS5wZWVrID0gZnVuY3Rpb24oKSB7IHJldHVybiBfbGF0ZXN0VmFsdWUgfTtcbiAgICBvYnNlcnZhYmxlLnZhbHVlSGFzTXV0YXRlZCA9IGZ1bmN0aW9uICgpIHsgb2JzZXJ2YWJsZVtcIm5vdGlmeVN1YnNjcmliZXJzXCJdKF9sYXRlc3RWYWx1ZSk7IH1cbiAgICBvYnNlcnZhYmxlLnZhbHVlV2lsbE11dGF0ZSA9IGZ1bmN0aW9uICgpIHsgb2JzZXJ2YWJsZVtcIm5vdGlmeVN1YnNjcmliZXJzXCJdKF9sYXRlc3RWYWx1ZSwgXCJiZWZvcmVDaGFuZ2VcIik7IH1cblxuICAgIGtvLmV4cG9ydFByb3BlcnR5KG9ic2VydmFibGUsICdwZWVrJywgb2JzZXJ2YWJsZS5wZWVrKTtcbiAgICBrby5leHBvcnRQcm9wZXJ0eShvYnNlcnZhYmxlLCBcInZhbHVlSGFzTXV0YXRlZFwiLCBvYnNlcnZhYmxlLnZhbHVlSGFzTXV0YXRlZCk7XG4gICAga28uZXhwb3J0UHJvcGVydHkob2JzZXJ2YWJsZSwgXCJ2YWx1ZVdpbGxNdXRhdGVcIiwgb2JzZXJ2YWJsZS52YWx1ZVdpbGxNdXRhdGUpO1xuXG4gICAgcmV0dXJuIG9ic2VydmFibGU7XG59XG5cbmtvLm9ic2VydmFibGVbJ2ZuJ10gPSB7XG4gICAgXCJlcXVhbGl0eUNvbXBhcmVyXCI6IHZhbHVlc0FyZVByaW1pdGl2ZUFuZEVxdWFsXG59O1xuXG52YXIgcHJvdG9Qcm9wZXJ0eSA9IGtvLm9ic2VydmFibGUucHJvdG9Qcm9wZXJ0eSA9IFwiX19rb19wcm90b19fXCI7XG5rby5vYnNlcnZhYmxlWydmbiddW3Byb3RvUHJvcGVydHldID0ga28ub2JzZXJ2YWJsZTtcblxuLy8gTm90ZSB0aGF0IGZvciBicm93c2VycyB0aGF0IGRvbid0IHN1cHBvcnQgcHJvdG8gYXNzaWdubWVudCwgdGhlXG4vLyBpbmhlcml0YW5jZSBjaGFpbiBpcyBjcmVhdGVkIG1hbnVhbGx5IGluIHRoZSBrby5vYnNlcnZhYmxlIGNvbnN0cnVjdG9yXG5pZiAoa28udXRpbHMuY2FuU2V0UHJvdG90eXBlKSB7XG4gICAga28udXRpbHMuc2V0UHJvdG90eXBlT2Yoa28ub2JzZXJ2YWJsZVsnZm4nXSwga28uc3Vic2NyaWJhYmxlWydmbiddKTtcbn1cblxua28uaGFzUHJvdG90eXBlID0gZnVuY3Rpb24oaW5zdGFuY2UsIHByb3RvdHlwZSkge1xuICAgIGlmICgoaW5zdGFuY2UgPT09IG51bGwpIHx8IChpbnN0YW5jZSA9PT0gdW5kZWZpbmVkKSB8fCAoaW5zdGFuY2VbcHJvdG9Qcm9wZXJ0eV0gPT09IHVuZGVmaW5lZCkpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoaW5zdGFuY2VbcHJvdG9Qcm9wZXJ0eV0gPT09IHByb3RvdHlwZSkgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGtvLmhhc1Byb3RvdHlwZShpbnN0YW5jZVtwcm90b1Byb3BlcnR5XSwgcHJvdG90eXBlKTsgLy8gV2FsayB0aGUgcHJvdG90eXBlIGNoYWluXG59O1xuXG5rby5pc09ic2VydmFibGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICByZXR1cm4ga28uaGFzUHJvdG90eXBlKGluc3RhbmNlLCBrby5vYnNlcnZhYmxlKTtcbn1cbmtvLmlzV3JpdGVhYmxlT2JzZXJ2YWJsZSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIC8vIE9ic2VydmFibGVcbiAgICBpZiAoKHR5cGVvZiBpbnN0YW5jZSA9PSBcImZ1bmN0aW9uXCIpICYmIGluc3RhbmNlW3Byb3RvUHJvcGVydHldID09PSBrby5vYnNlcnZhYmxlKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAvLyBXcml0ZWFibGUgZGVwZW5kZW50IG9ic2VydmFibGVcbiAgICBpZiAoKHR5cGVvZiBpbnN0YW5jZSA9PSBcImZ1bmN0aW9uXCIpICYmIChpbnN0YW5jZVtwcm90b1Byb3BlcnR5XSA9PT0ga28uZGVwZW5kZW50T2JzZXJ2YWJsZSkgJiYgKGluc3RhbmNlLmhhc1dyaXRlRnVuY3Rpb24pKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAvLyBBbnl0aGluZyBlbHNlXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5cbmtvLmV4cG9ydFN5bWJvbCgnb2JzZXJ2YWJsZScsIGtvLm9ic2VydmFibGUpO1xua28uZXhwb3J0U3ltYm9sKCdpc09ic2VydmFibGUnLCBrby5pc09ic2VydmFibGUpO1xua28uZXhwb3J0U3ltYm9sKCdpc1dyaXRlYWJsZU9ic2VydmFibGUnLCBrby5pc1dyaXRlYWJsZU9ic2VydmFibGUpO1xua28uZXhwb3J0U3ltYm9sKCdpc1dyaXRhYmxlT2JzZXJ2YWJsZScsIGtvLmlzV3JpdGVhYmxlT2JzZXJ2YWJsZSk7XG5rby5vYnNlcnZhYmxlQXJyYXkgPSBmdW5jdGlvbiAoaW5pdGlhbFZhbHVlcykge1xuICAgIGluaXRpYWxWYWx1ZXMgPSBpbml0aWFsVmFsdWVzIHx8IFtdO1xuXG4gICAgaWYgKHR5cGVvZiBpbml0aWFsVmFsdWVzICE9ICdvYmplY3QnIHx8ICEoJ2xlbmd0aCcgaW4gaW5pdGlhbFZhbHVlcykpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBhcmd1bWVudCBwYXNzZWQgd2hlbiBpbml0aWFsaXppbmcgYW4gb2JzZXJ2YWJsZSBhcnJheSBtdXN0IGJlIGFuIGFycmF5LCBvciBudWxsLCBvciB1bmRlZmluZWQuXCIpO1xuXG4gICAgdmFyIHJlc3VsdCA9IGtvLm9ic2VydmFibGUoaW5pdGlhbFZhbHVlcyk7XG4gICAga28udXRpbHMuc2V0UHJvdG90eXBlT2ZPckV4dGVuZChyZXN1bHQsIGtvLm9ic2VydmFibGVBcnJheVsnZm4nXSk7XG4gICAgcmV0dXJuIHJlc3VsdC5leHRlbmQoeyd0cmFja0FycmF5Q2hhbmdlcyc6dHJ1ZX0pO1xufTtcblxua28ub2JzZXJ2YWJsZUFycmF5WydmbiddID0ge1xuICAgICdyZW1vdmUnOiBmdW5jdGlvbiAodmFsdWVPclByZWRpY2F0ZSkge1xuICAgICAgICB2YXIgdW5kZXJseWluZ0FycmF5ID0gdGhpcy5wZWVrKCk7XG4gICAgICAgIHZhciByZW1vdmVkVmFsdWVzID0gW107XG4gICAgICAgIHZhciBwcmVkaWNhdGUgPSB0eXBlb2YgdmFsdWVPclByZWRpY2F0ZSA9PSBcImZ1bmN0aW9uXCIgJiYgIWtvLmlzT2JzZXJ2YWJsZSh2YWx1ZU9yUHJlZGljYXRlKSA/IHZhbHVlT3JQcmVkaWNhdGUgOiBmdW5jdGlvbiAodmFsdWUpIHsgcmV0dXJuIHZhbHVlID09PSB2YWx1ZU9yUHJlZGljYXRlOyB9O1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHVuZGVybHlpbmdBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gdW5kZXJseWluZ0FycmF5W2ldO1xuICAgICAgICAgICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVtb3ZlZFZhbHVlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YWx1ZVdpbGxNdXRhdGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVtb3ZlZFZhbHVlcy5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB1bmRlcmx5aW5nQXJyYXkuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGktLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocmVtb3ZlZFZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWVIYXNNdXRhdGVkKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlbW92ZWRWYWx1ZXM7XG4gICAgfSxcblxuICAgICdyZW1vdmVBbGwnOiBmdW5jdGlvbiAoYXJyYXlPZlZhbHVlcykge1xuICAgICAgICAvLyBJZiB5b3UgcGFzc2VkIHplcm8gYXJncywgd2UgcmVtb3ZlIGV2ZXJ5dGhpbmdcbiAgICAgICAgaWYgKGFycmF5T2ZWYWx1ZXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdmFyIHVuZGVybHlpbmdBcnJheSA9IHRoaXMucGVlaygpO1xuICAgICAgICAgICAgdmFyIGFsbFZhbHVlcyA9IHVuZGVybHlpbmdBcnJheS5zbGljZSgwKTtcbiAgICAgICAgICAgIHRoaXMudmFsdWVXaWxsTXV0YXRlKCk7XG4gICAgICAgICAgICB1bmRlcmx5aW5nQXJyYXkuc3BsaWNlKDAsIHVuZGVybHlpbmdBcnJheS5sZW5ndGgpO1xuICAgICAgICAgICAgdGhpcy52YWx1ZUhhc011dGF0ZWQoKTtcbiAgICAgICAgICAgIHJldHVybiBhbGxWYWx1ZXM7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgeW91IHBhc3NlZCBhbiBhcmcsIHdlIGludGVycHJldCBpdCBhcyBhbiBhcnJheSBvZiBlbnRyaWVzIHRvIHJlbW92ZVxuICAgICAgICBpZiAoIWFycmF5T2ZWYWx1ZXMpXG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIHJldHVybiB0aGlzWydyZW1vdmUnXShmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBrby51dGlscy5hcnJheUluZGV4T2YoYXJyYXlPZlZhbHVlcywgdmFsdWUpID49IDA7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAnZGVzdHJveSc6IGZ1bmN0aW9uICh2YWx1ZU9yUHJlZGljYXRlKSB7XG4gICAgICAgIHZhciB1bmRlcmx5aW5nQXJyYXkgPSB0aGlzLnBlZWsoKTtcbiAgICAgICAgdmFyIHByZWRpY2F0ZSA9IHR5cGVvZiB2YWx1ZU9yUHJlZGljYXRlID09IFwiZnVuY3Rpb25cIiAmJiAha28uaXNPYnNlcnZhYmxlKHZhbHVlT3JQcmVkaWNhdGUpID8gdmFsdWVPclByZWRpY2F0ZSA6IGZ1bmN0aW9uICh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgPT09IHZhbHVlT3JQcmVkaWNhdGU7IH07XG4gICAgICAgIHRoaXMudmFsdWVXaWxsTXV0YXRlKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSB1bmRlcmx5aW5nQXJyYXkubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHVuZGVybHlpbmdBcnJheVtpXTtcbiAgICAgICAgICAgIGlmIChwcmVkaWNhdGUodmFsdWUpKVxuICAgICAgICAgICAgICAgIHVuZGVybHlpbmdBcnJheVtpXVtcIl9kZXN0cm95XCJdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnZhbHVlSGFzTXV0YXRlZCgpO1xuICAgIH0sXG5cbiAgICAnZGVzdHJveUFsbCc6IGZ1bmN0aW9uIChhcnJheU9mVmFsdWVzKSB7XG4gICAgICAgIC8vIElmIHlvdSBwYXNzZWQgemVybyBhcmdzLCB3ZSBkZXN0cm95IGV2ZXJ5dGhpbmdcbiAgICAgICAgaWYgKGFycmF5T2ZWYWx1ZXMgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybiB0aGlzWydkZXN0cm95J10oZnVuY3Rpb24oKSB7IHJldHVybiB0cnVlIH0pO1xuXG4gICAgICAgIC8vIElmIHlvdSBwYXNzZWQgYW4gYXJnLCB3ZSBpbnRlcnByZXQgaXQgYXMgYW4gYXJyYXkgb2YgZW50cmllcyB0byBkZXN0cm95XG4gICAgICAgIGlmICghYXJyYXlPZlZhbHVlcylcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgcmV0dXJuIHRoaXNbJ2Rlc3Ryb3knXShmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBrby51dGlscy5hcnJheUluZGV4T2YoYXJyYXlPZlZhbHVlcywgdmFsdWUpID49IDA7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAnaW5kZXhPZic6IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHZhciB1bmRlcmx5aW5nQXJyYXkgPSB0aGlzKCk7XG4gICAgICAgIHJldHVybiBrby51dGlscy5hcnJheUluZGV4T2YodW5kZXJseWluZ0FycmF5LCBpdGVtKTtcbiAgICB9LFxuXG4gICAgJ3JlcGxhY2UnOiBmdW5jdGlvbihvbGRJdGVtLCBuZXdJdGVtKSB7XG4gICAgICAgIHZhciBpbmRleCA9IHRoaXNbJ2luZGV4T2YnXShvbGRJdGVtKTtcbiAgICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWVXaWxsTXV0YXRlKCk7XG4gICAgICAgICAgICB0aGlzLnBlZWsoKVtpbmRleF0gPSBuZXdJdGVtO1xuICAgICAgICAgICAgdGhpcy52YWx1ZUhhc011dGF0ZWQoKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8vIFBvcHVsYXRlIGtvLm9ic2VydmFibGVBcnJheS5mbiB3aXRoIHJlYWQvd3JpdGUgZnVuY3Rpb25zIGZyb20gbmF0aXZlIGFycmF5c1xuLy8gSW1wb3J0YW50OiBEbyBub3QgYWRkIGFueSBhZGRpdGlvbmFsIGZ1bmN0aW9ucyBoZXJlIHRoYXQgbWF5IHJlYXNvbmFibHkgYmUgdXNlZCB0byAqcmVhZCogZGF0YSBmcm9tIHRoZSBhcnJheVxuLy8gYmVjYXVzZSB3ZSdsbCBldmFsIHRoZW0gd2l0aG91dCBjYXVzaW5nIHN1YnNjcmlwdGlvbnMsIHNvIGtvLmNvbXB1dGVkIG91dHB1dCBjb3VsZCBlbmQgdXAgZ2V0dGluZyBzdGFsZVxua28udXRpbHMuYXJyYXlGb3JFYWNoKFtcInBvcFwiLCBcInB1c2hcIiwgXCJyZXZlcnNlXCIsIFwic2hpZnRcIiwgXCJzb3J0XCIsIFwic3BsaWNlXCIsIFwidW5zaGlmdFwiXSwgZnVuY3Rpb24gKG1ldGhvZE5hbWUpIHtcbiAgICBrby5vYnNlcnZhYmxlQXJyYXlbJ2ZuJ11bbWV0aG9kTmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFVzZSBcInBlZWtcIiB0byBhdm9pZCBjcmVhdGluZyBhIHN1YnNjcmlwdGlvbiBpbiBhbnkgY29tcHV0ZWQgdGhhdCB3ZSdyZSBleGVjdXRpbmcgaW4gdGhlIGNvbnRleHQgb2ZcbiAgICAgICAgLy8gKGZvciBjb25zaXN0ZW5jeSB3aXRoIG11dGF0aW5nIHJlZ3VsYXIgb2JzZXJ2YWJsZXMpXG4gICAgICAgIHZhciB1bmRlcmx5aW5nQXJyYXkgPSB0aGlzLnBlZWsoKTtcbiAgICAgICAgdGhpcy52YWx1ZVdpbGxNdXRhdGUoKTtcbiAgICAgICAgdGhpcy5jYWNoZURpZmZGb3JLbm93bk9wZXJhdGlvbih1bmRlcmx5aW5nQXJyYXksIG1ldGhvZE5hbWUsIGFyZ3VtZW50cyk7XG4gICAgICAgIHZhciBtZXRob2RDYWxsUmVzdWx0ID0gdW5kZXJseWluZ0FycmF5W21ldGhvZE5hbWVdLmFwcGx5KHVuZGVybHlpbmdBcnJheSwgYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy52YWx1ZUhhc011dGF0ZWQoKTtcbiAgICAgICAgcmV0dXJuIG1ldGhvZENhbGxSZXN1bHQ7XG4gICAgfTtcbn0pO1xuXG4vLyBQb3B1bGF0ZSBrby5vYnNlcnZhYmxlQXJyYXkuZm4gd2l0aCByZWFkLW9ubHkgZnVuY3Rpb25zIGZyb20gbmF0aXZlIGFycmF5c1xua28udXRpbHMuYXJyYXlGb3JFYWNoKFtcInNsaWNlXCJdLCBmdW5jdGlvbiAobWV0aG9kTmFtZSkge1xuICAgIGtvLm9ic2VydmFibGVBcnJheVsnZm4nXVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHVuZGVybHlpbmdBcnJheSA9IHRoaXMoKTtcbiAgICAgICAgcmV0dXJuIHVuZGVybHlpbmdBcnJheVttZXRob2ROYW1lXS5hcHBseSh1bmRlcmx5aW5nQXJyYXksIGFyZ3VtZW50cyk7XG4gICAgfTtcbn0pO1xuXG4vLyBOb3RlIHRoYXQgZm9yIGJyb3dzZXJzIHRoYXQgZG9uJ3Qgc3VwcG9ydCBwcm90byBhc3NpZ25tZW50LCB0aGVcbi8vIGluaGVyaXRhbmNlIGNoYWluIGlzIGNyZWF0ZWQgbWFudWFsbHkgaW4gdGhlIGtvLm9ic2VydmFibGVBcnJheSBjb25zdHJ1Y3RvclxuaWYgKGtvLnV0aWxzLmNhblNldFByb3RvdHlwZSkge1xuICAgIGtvLnV0aWxzLnNldFByb3RvdHlwZU9mKGtvLm9ic2VydmFibGVBcnJheVsnZm4nXSwga28ub2JzZXJ2YWJsZVsnZm4nXSk7XG59XG5cbmtvLmV4cG9ydFN5bWJvbCgnb2JzZXJ2YWJsZUFycmF5Jywga28ub2JzZXJ2YWJsZUFycmF5KTtcbnZhciBhcnJheUNoYW5nZUV2ZW50TmFtZSA9ICdhcnJheUNoYW5nZSc7XG5rby5leHRlbmRlcnNbJ3RyYWNrQXJyYXlDaGFuZ2VzJ10gPSBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICAvLyBPbmx5IG1vZGlmeSB0aGUgdGFyZ2V0IG9ic2VydmFibGUgb25jZVxuICAgIGlmICh0YXJnZXQuY2FjaGVEaWZmRm9yS25vd25PcGVyYXRpb24pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdHJhY2tpbmdDaGFuZ2VzID0gZmFsc2UsXG4gICAgICAgIGNhY2hlZERpZmYgPSBudWxsLFxuICAgICAgICBwZW5kaW5nTm90aWZpY2F0aW9ucyA9IDAsXG4gICAgICAgIHVuZGVybHlpbmdTdWJzY3JpYmVGdW5jdGlvbiA9IHRhcmdldC5zdWJzY3JpYmU7XG5cbiAgICAvLyBJbnRlcmNlcHQgXCJzdWJzY3JpYmVcIiBjYWxscywgYW5kIGZvciBhcnJheSBjaGFuZ2UgZXZlbnRzLCBlbnN1cmUgY2hhbmdlIHRyYWNraW5nIGlzIGVuYWJsZWRcbiAgICB0YXJnZXQuc3Vic2NyaWJlID0gdGFyZ2V0WydzdWJzY3JpYmUnXSA9IGZ1bmN0aW9uKGNhbGxiYWNrLCBjYWxsYmFja1RhcmdldCwgZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50ID09PSBhcnJheUNoYW5nZUV2ZW50TmFtZSkge1xuICAgICAgICAgICAgdHJhY2tDaGFuZ2VzKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVybHlpbmdTdWJzY3JpYmVGdW5jdGlvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiB0cmFja0NoYW5nZXMoKSB7XG4gICAgICAgIC8vIENhbGxpbmcgJ3RyYWNrQ2hhbmdlcycgbXVsdGlwbGUgdGltZXMgaXMgdGhlIHNhbWUgYXMgY2FsbGluZyBpdCBvbmNlXG4gICAgICAgIGlmICh0cmFja2luZ0NoYW5nZXMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyYWNraW5nQ2hhbmdlcyA9IHRydWU7XG5cbiAgICAgICAgLy8gSW50ZXJjZXB0IFwibm90aWZ5U3Vic2NyaWJlcnNcIiB0byB0cmFjayBob3cgbWFueSB0aW1lcyBpdCB3YXMgY2FsbGVkLlxuICAgICAgICB2YXIgdW5kZXJseWluZ05vdGlmeVN1YnNjcmliZXJzRnVuY3Rpb24gPSB0YXJnZXRbJ25vdGlmeVN1YnNjcmliZXJzJ107XG4gICAgICAgIHRhcmdldFsnbm90aWZ5U3Vic2NyaWJlcnMnXSA9IGZ1bmN0aW9uKHZhbHVlVG9Ob3RpZnksIGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoIWV2ZW50IHx8IGV2ZW50ID09PSBkZWZhdWx0RXZlbnQpIHtcbiAgICAgICAgICAgICAgICArK3BlbmRpbmdOb3RpZmljYXRpb25zO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVybHlpbmdOb3RpZnlTdWJzY3JpYmVyc0Z1bmN0aW9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gRWFjaCB0aW1lIHRoZSBhcnJheSBjaGFuZ2VzIHZhbHVlLCBjYXB0dXJlIGEgY2xvbmUgc28gdGhhdCBvbiB0aGUgbmV4dFxuICAgICAgICAvLyBjaGFuZ2UgaXQncyBwb3NzaWJsZSB0byBwcm9kdWNlIGEgZGlmZlxuICAgICAgICB2YXIgcHJldmlvdXNDb250ZW50cyA9IFtdLmNvbmNhdCh0YXJnZXQucGVlaygpIHx8IFtdKTtcbiAgICAgICAgY2FjaGVkRGlmZiA9IG51bGw7XG4gICAgICAgIHRhcmdldC5zdWJzY3JpYmUoZnVuY3Rpb24oY3VycmVudENvbnRlbnRzKSB7XG4gICAgICAgICAgICAvLyBNYWtlIGEgY29weSBvZiB0aGUgY3VycmVudCBjb250ZW50cyBhbmQgZW5zdXJlIGl0J3MgYW4gYXJyYXlcbiAgICAgICAgICAgIGN1cnJlbnRDb250ZW50cyA9IFtdLmNvbmNhdChjdXJyZW50Q29udGVudHMgfHwgW10pO1xuXG4gICAgICAgICAgICAvLyBDb21wdXRlIHRoZSBkaWZmIGFuZCBpc3N1ZSBub3RpZmljYXRpb25zLCBidXQgb25seSBpZiBzb21lb25lIGlzIGxpc3RlbmluZ1xuICAgICAgICAgICAgaWYgKHRhcmdldC5oYXNTdWJzY3JpcHRpb25zRm9yRXZlbnQoYXJyYXlDaGFuZ2VFdmVudE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNoYW5nZXMgPSBnZXRDaGFuZ2VzKHByZXZpb3VzQ29udGVudHMsIGN1cnJlbnRDb250ZW50cyk7XG4gICAgICAgICAgICAgICAgaWYgKGNoYW5nZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFsnbm90aWZ5U3Vic2NyaWJlcnMnXShjaGFuZ2VzLCBhcnJheUNoYW5nZUV2ZW50TmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBFbGltaW5hdGUgcmVmZXJlbmNlcyB0byB0aGUgb2xkLCByZW1vdmVkIGl0ZW1zLCBzbyB0aGV5IGNhbiBiZSBHQ2VkXG4gICAgICAgICAgICBwcmV2aW91c0NvbnRlbnRzID0gY3VycmVudENvbnRlbnRzO1xuICAgICAgICAgICAgY2FjaGVkRGlmZiA9IG51bGw7XG4gICAgICAgICAgICBwZW5kaW5nTm90aWZpY2F0aW9ucyA9IDA7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldENoYW5nZXMocHJldmlvdXNDb250ZW50cywgY3VycmVudENvbnRlbnRzKSB7XG4gICAgICAgIC8vIFdlIHRyeSB0byByZS11c2UgY2FjaGVkIGRpZmZzLlxuICAgICAgICAvLyBUaGUgc2NlbmFyaW9zIHdoZXJlIHBlbmRpbmdOb3RpZmljYXRpb25zID4gMSBhcmUgd2hlbiB1c2luZyByYXRlLWxpbWl0aW5nIG9yIHRoZSBEZWZlcnJlZCBVcGRhdGVzXG4gICAgICAgIC8vIHBsdWdpbiwgd2hpY2ggd2l0aG91dCB0aGlzIGNoZWNrIHdvdWxkIG5vdCBiZSBjb21wYXRpYmxlIHdpdGggYXJyYXlDaGFuZ2Ugbm90aWZpY2F0aW9ucy4gTm9ybWFsbHksXG4gICAgICAgIC8vIG5vdGlmaWNhdGlvbnMgYXJlIGlzc3VlZCBpbW1lZGlhdGVseSBzbyB3ZSB3b3VsZG4ndCBiZSBxdWV1ZWluZyB1cCBtb3JlIHRoYW4gb25lLlxuICAgICAgICBpZiAoIWNhY2hlZERpZmYgfHwgcGVuZGluZ05vdGlmaWNhdGlvbnMgPiAxKSB7XG4gICAgICAgICAgICBjYWNoZWREaWZmID0ga28udXRpbHMuY29tcGFyZUFycmF5cyhwcmV2aW91c0NvbnRlbnRzLCBjdXJyZW50Q29udGVudHMsIHsgJ3NwYXJzZSc6IHRydWUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2FjaGVkRGlmZjtcbiAgICB9XG5cbiAgICB0YXJnZXQuY2FjaGVEaWZmRm9yS25vd25PcGVyYXRpb24gPSBmdW5jdGlvbihyYXdBcnJheSwgb3BlcmF0aW9uTmFtZSwgYXJncykge1xuICAgICAgICAvLyBPbmx5IHJ1biBpZiB3ZSdyZSBjdXJyZW50bHkgdHJhY2tpbmcgY2hhbmdlcyBmb3IgdGhpcyBvYnNlcnZhYmxlIGFycmF5XG4gICAgICAgIC8vIGFuZCB0aGVyZSBhcmVuJ3QgYW55IHBlbmRpbmcgZGVmZXJyZWQgbm90aWZpY2F0aW9ucy5cbiAgICAgICAgaWYgKCF0cmFja2luZ0NoYW5nZXMgfHwgcGVuZGluZ05vdGlmaWNhdGlvbnMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGlmZiA9IFtdLFxuICAgICAgICAgICAgYXJyYXlMZW5ndGggPSByYXdBcnJheS5sZW5ndGgsXG4gICAgICAgICAgICBhcmdzTGVuZ3RoID0gYXJncy5sZW5ndGgsXG4gICAgICAgICAgICBvZmZzZXQgPSAwO1xuXG4gICAgICAgIGZ1bmN0aW9uIHB1c2hEaWZmKHN0YXR1cywgdmFsdWUsIGluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gZGlmZltkaWZmLmxlbmd0aF0gPSB7ICdzdGF0dXMnOiBzdGF0dXMsICd2YWx1ZSc6IHZhbHVlLCAnaW5kZXgnOiBpbmRleCB9O1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAob3BlcmF0aW9uTmFtZSkge1xuICAgICAgICAgICAgY2FzZSAncHVzaCc6XG4gICAgICAgICAgICAgICAgb2Zmc2V0ID0gYXJyYXlMZW5ndGg7XG4gICAgICAgICAgICBjYXNlICd1bnNoaWZ0JzpcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgYXJnc0xlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICBwdXNoRGlmZignYWRkZWQnLCBhcmdzW2luZGV4XSwgb2Zmc2V0ICsgaW5kZXgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAncG9wJzpcbiAgICAgICAgICAgICAgICBvZmZzZXQgPSBhcnJheUxlbmd0aCAtIDE7XG4gICAgICAgICAgICBjYXNlICdzaGlmdCc6XG4gICAgICAgICAgICAgICAgaWYgKGFycmF5TGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHB1c2hEaWZmKCdkZWxldGVkJywgcmF3QXJyYXlbb2Zmc2V0XSwgb2Zmc2V0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ3NwbGljZSc6XG4gICAgICAgICAgICAgICAgLy8gTmVnYXRpdmUgc3RhcnQgaW5kZXggbWVhbnMgJ2Zyb20gZW5kIG9mIGFycmF5Jy4gQWZ0ZXIgdGhhdCB3ZSBjbGFtcCB0byBbMC4uLmFycmF5TGVuZ3RoXS5cbiAgICAgICAgICAgICAgICAvLyBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvc3BsaWNlXG4gICAgICAgICAgICAgICAgdmFyIHN0YXJ0SW5kZXggPSBNYXRoLm1pbihNYXRoLm1heCgwLCBhcmdzWzBdIDwgMCA/IGFycmF5TGVuZ3RoICsgYXJnc1swXSA6IGFyZ3NbMF0pLCBhcnJheUxlbmd0aCksXG4gICAgICAgICAgICAgICAgICAgIGVuZERlbGV0ZUluZGV4ID0gYXJnc0xlbmd0aCA9PT0gMSA/IGFycmF5TGVuZ3RoIDogTWF0aC5taW4oc3RhcnRJbmRleCArIChhcmdzWzFdIHx8IDApLCBhcnJheUxlbmd0aCksXG4gICAgICAgICAgICAgICAgICAgIGVuZEFkZEluZGV4ID0gc3RhcnRJbmRleCArIGFyZ3NMZW5ndGggLSAyLFxuICAgICAgICAgICAgICAgICAgICBlbmRJbmRleCA9IE1hdGgubWF4KGVuZERlbGV0ZUluZGV4LCBlbmRBZGRJbmRleCksXG4gICAgICAgICAgICAgICAgICAgIGFkZGl0aW9ucyA9IFtdLCBkZWxldGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IHN0YXJ0SW5kZXgsIGFyZ3NJbmRleCA9IDI7IGluZGV4IDwgZW5kSW5kZXg7ICsraW5kZXgsICsrYXJnc0luZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IGVuZERlbGV0ZUluZGV4KVxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRpb25zLnB1c2gocHVzaERpZmYoJ2RlbGV0ZWQnLCByYXdBcnJheVtpbmRleF0sIGluZGV4KSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IGVuZEFkZEluZGV4KVxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkaXRpb25zLnB1c2gocHVzaERpZmYoJ2FkZGVkJywgYXJnc1thcmdzSW5kZXhdLCBpbmRleCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBrby51dGlscy5maW5kTW92ZXNJbkFycmF5Q29tcGFyaXNvbihkZWxldGlvbnMsIGFkZGl0aW9ucyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNhY2hlZERpZmYgPSBkaWZmO1xuICAgIH07XG59O1xua28uY29tcHV0ZWQgPSBrby5kZXBlbmRlbnRPYnNlcnZhYmxlID0gZnVuY3Rpb24gKGV2YWx1YXRvckZ1bmN0aW9uT3JPcHRpb25zLCBldmFsdWF0b3JGdW5jdGlvblRhcmdldCwgb3B0aW9ucykge1xuICAgIHZhciBfbGF0ZXN0VmFsdWUsXG4gICAgICAgIF9uZWVkc0V2YWx1YXRpb24gPSB0cnVlLFxuICAgICAgICBfaXNCZWluZ0V2YWx1YXRlZCA9IGZhbHNlLFxuICAgICAgICBfc3VwcHJlc3NEaXNwb3NhbFVudGlsRGlzcG9zZVdoZW5SZXR1cm5zRmFsc2UgPSBmYWxzZSxcbiAgICAgICAgX2lzRGlzcG9zZWQgPSBmYWxzZSxcbiAgICAgICAgcmVhZEZ1bmN0aW9uID0gZXZhbHVhdG9yRnVuY3Rpb25Pck9wdGlvbnMsXG4gICAgICAgIHB1cmUgPSBmYWxzZSxcbiAgICAgICAgaXNTbGVlcGluZyA9IGZhbHNlO1xuXG4gICAgaWYgKHJlYWRGdW5jdGlvbiAmJiB0eXBlb2YgcmVhZEZ1bmN0aW9uID09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgLy8gU2luZ2xlLXBhcmFtZXRlciBzeW50YXggLSBldmVyeXRoaW5nIGlzIG9uIHRoaXMgXCJvcHRpb25zXCIgcGFyYW1cbiAgICAgICAgb3B0aW9ucyA9IHJlYWRGdW5jdGlvbjtcbiAgICAgICAgcmVhZEZ1bmN0aW9uID0gb3B0aW9uc1tcInJlYWRcIl07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTXVsdGktcGFyYW1ldGVyIHN5bnRheCAtIGNvbnN0cnVjdCB0aGUgb3B0aW9ucyBhY2NvcmRpbmcgdG8gdGhlIHBhcmFtcyBwYXNzZWRcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICAgIGlmICghcmVhZEZ1bmN0aW9uKVxuICAgICAgICAgICAgcmVhZEZ1bmN0aW9uID0gb3B0aW9uc1tcInJlYWRcIl07XG4gICAgfVxuICAgIGlmICh0eXBlb2YgcmVhZEZ1bmN0aW9uICE9IFwiZnVuY3Rpb25cIilcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUGFzcyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgdmFsdWUgb2YgdGhlIGtvLmNvbXB1dGVkXCIpO1xuXG4gICAgZnVuY3Rpb24gYWRkU3Vic2NyaXB0aW9uVG9EZXBlbmRlbmN5KHN1YnNjcmliYWJsZSwgaWQpIHtcbiAgICAgICAgaWYgKCFfc3Vic2NyaXB0aW9uc1RvRGVwZW5kZW5jaWVzW2lkXSkge1xuICAgICAgICAgICAgX3N1YnNjcmlwdGlvbnNUb0RlcGVuZGVuY2llc1tpZF0gPSBzdWJzY3JpYmFibGUuc3Vic2NyaWJlKGV2YWx1YXRlUG9zc2libHlBc3luYyk7XG4gICAgICAgICAgICArK19kZXBlbmRlbmNpZXNDb3VudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRpc3Bvc2VBbGxTdWJzY3JpcHRpb25zVG9EZXBlbmRlbmNpZXMoKSB7XG4gICAgICAgIGtvLnV0aWxzLm9iamVjdEZvckVhY2goX3N1YnNjcmlwdGlvbnNUb0RlcGVuZGVuY2llcywgZnVuY3Rpb24gKGlkLCBzdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbi5kaXNwb3NlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBfc3Vic2NyaXB0aW9uc1RvRGVwZW5kZW5jaWVzID0ge307XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGlzcG9zZUNvbXB1dGVkKCkge1xuICAgICAgICBkaXNwb3NlQWxsU3Vic2NyaXB0aW9uc1RvRGVwZW5kZW5jaWVzKCk7XG4gICAgICAgIF9kZXBlbmRlbmNpZXNDb3VudCA9IDA7XG4gICAgICAgIF9pc0Rpc3Bvc2VkID0gdHJ1ZTtcbiAgICAgICAgX25lZWRzRXZhbHVhdGlvbiA9IGZhbHNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV2YWx1YXRlUG9zc2libHlBc3luYygpIHtcbiAgICAgICAgdmFyIHRocm90dGxlRXZhbHVhdGlvblRpbWVvdXQgPSBkZXBlbmRlbnRPYnNlcnZhYmxlWyd0aHJvdHRsZUV2YWx1YXRpb24nXTtcbiAgICAgICAgaWYgKHRocm90dGxlRXZhbHVhdGlvblRpbWVvdXQgJiYgdGhyb3R0bGVFdmFsdWF0aW9uVGltZW91dCA+PSAwKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoZXZhbHVhdGlvblRpbWVvdXRJbnN0YW5jZSk7XG4gICAgICAgICAgICBldmFsdWF0aW9uVGltZW91dEluc3RhbmNlID0gc2V0VGltZW91dChldmFsdWF0ZUltbWVkaWF0ZSwgdGhyb3R0bGVFdmFsdWF0aW9uVGltZW91dCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGVwZW5kZW50T2JzZXJ2YWJsZS5fZXZhbFJhdGVMaW1pdGVkKSB7XG4gICAgICAgICAgICBkZXBlbmRlbnRPYnNlcnZhYmxlLl9ldmFsUmF0ZUxpbWl0ZWQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV2YWx1YXRlSW1tZWRpYXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBldmFsdWF0ZUltbWVkaWF0ZShzdXBwcmVzc0NoYW5nZU5vdGlmaWNhdGlvbikge1xuICAgICAgICBpZiAoX2lzQmVpbmdFdmFsdWF0ZWQpIHtcbiAgICAgICAgICAgIGlmIChwdXJlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJBICdwdXJlJyBjb21wdXRlZCBtdXN0IG5vdCBiZSBjYWxsZWQgcmVjdXJzaXZlbHlcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBJZiB0aGUgZXZhbHVhdGlvbiBvZiBhIGtvLmNvbXB1dGVkIGNhdXNlcyBzaWRlIGVmZmVjdHMsIGl0J3MgcG9zc2libGUgdGhhdCBpdCB3aWxsIHRyaWdnZXIgaXRzIG93biByZS1ldmFsdWF0aW9uLlxuICAgICAgICAgICAgLy8gVGhpcyBpcyBub3QgZGVzaXJhYmxlIChpdCdzIGhhcmQgZm9yIGEgZGV2ZWxvcGVyIHRvIHJlYWxpc2UgYSBjaGFpbiBvZiBkZXBlbmRlbmNpZXMgbWlnaHQgY2F1c2UgdGhpcywgYW5kIHRoZXkgYWxtb3N0XG4gICAgICAgICAgICAvLyBjZXJ0YWlubHkgZGlkbid0IGludGVuZCBpbmZpbml0ZSByZS1ldmFsdWF0aW9ucykuIFNvLCBmb3IgcHJlZGljdGFiaWxpdHksIHdlIHNpbXBseSBwcmV2ZW50IGtvLmNvbXB1dGVkcyBmcm9tIGNhdXNpbmdcbiAgICAgICAgICAgIC8vIHRoZWlyIG93biByZS1ldmFsdWF0aW9uLiBGdXJ0aGVyIGRpc2N1c3Npb24gYXQgaHR0cHM6Ly9naXRodWIuY29tL1N0ZXZlU2FuZGVyc29uL2tub2Nrb3V0L3B1bGwvMzg3XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEbyBub3QgZXZhbHVhdGUgKGFuZCBwb3NzaWJseSBjYXB0dXJlIG5ldyBkZXBlbmRlbmNpZXMpIGlmIGRpc3Bvc2VkXG4gICAgICAgIGlmIChfaXNEaXNwb3NlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRpc3Bvc2VXaGVuICYmIGRpc3Bvc2VXaGVuKCkpIHtcbiAgICAgICAgICAgIC8vIFNlZSBjb21tZW50IGJlbG93IGFib3V0IF9zdXBwcmVzc0Rpc3Bvc2FsVW50aWxEaXNwb3NlV2hlblJldHVybnNGYWxzZVxuICAgICAgICAgICAgaWYgKCFfc3VwcHJlc3NEaXNwb3NhbFVudGlsRGlzcG9zZVdoZW5SZXR1cm5zRmFsc2UpIHtcbiAgICAgICAgICAgICAgICBkaXNwb3NlKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSXQganVzdCBkaWQgcmV0dXJuIGZhbHNlLCBzbyB3ZSBjYW4gc3RvcCBzdXBwcmVzc2luZyBub3dcbiAgICAgICAgICAgIF9zdXBwcmVzc0Rpc3Bvc2FsVW50aWxEaXNwb3NlV2hlblJldHVybnNGYWxzZSA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgX2lzQmVpbmdFdmFsdWF0ZWQgPSB0cnVlO1xuXG4gICAgICAgIC8vIFdoZW4gc2xlZXBpbmcsIHJlY2FsY3VsYXRlIHRoZSB2YWx1ZSBhbmQgcmV0dXJuLlxuICAgICAgICBpZiAoaXNTbGVlcGluZykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB2YXIgZGVwZW5kZW5jeVRyYWNraW5nID0ge307XG4gICAgICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5iZWdpbih7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbiAoc3Vic2NyaWJhYmxlLCBpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFkZXBlbmRlbmN5VHJhY2tpbmdbaWRdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVwZW5kZW5jeVRyYWNraW5nW2lkXSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKytfZGVwZW5kZW5jaWVzQ291bnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkOiBkZXBlbmRlbnRPYnNlcnZhYmxlLFxuICAgICAgICAgICAgICAgICAgICBpc0luaXRpYWw6IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIF9kZXBlbmRlbmNpZXNDb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgX2xhdGVzdFZhbHVlID0gcmVhZEZ1bmN0aW9uLmNhbGwoZXZhbHVhdG9yRnVuY3Rpb25UYXJnZXQpO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICBrby5kZXBlbmRlbmN5RGV0ZWN0aW9uLmVuZCgpO1xuICAgICAgICAgICAgICAgIF9pc0JlaW5nRXZhbHVhdGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIC8vIEluaXRpYWxseSwgd2UgYXNzdW1lIHRoYXQgbm9uZSBvZiB0aGUgc3Vic2NyaXB0aW9ucyBhcmUgc3RpbGwgYmVpbmcgdXNlZCAoaS5lLiwgYWxsIGFyZSBjYW5kaWRhdGVzIGZvciBkaXNwb3NhbCkuXG4gICAgICAgICAgICAgICAgLy8gVGhlbiwgZHVyaW5nIGV2YWx1YXRpb24sIHdlIGNyb3NzIG9mZiBhbnkgdGhhdCBhcmUgaW4gZmFjdCBzdGlsbCBiZWluZyB1c2VkLlxuICAgICAgICAgICAgICAgIHZhciBkaXNwb3NhbENhbmRpZGF0ZXMgPSBfc3Vic2NyaXB0aW9uc1RvRGVwZW5kZW5jaWVzLCBkaXNwb3NhbENvdW50ID0gX2RlcGVuZGVuY2llc0NvdW50O1xuICAgICAgICAgICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uYmVnaW4oe1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oc3Vic2NyaWJhYmxlLCBpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFfaXNEaXNwb3NlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkaXNwb3NhbENvdW50ICYmIGRpc3Bvc2FsQ2FuZGlkYXRlc1tpZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRG9uJ3Qgd2FudCB0byBkaXNwb3NlIHRoaXMgc3Vic2NyaXB0aW9uLCBhcyBpdCdzIHN0aWxsIGJlaW5nIHVzZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3N1YnNjcmlwdGlvbnNUb0RlcGVuZGVuY2llc1tpZF0gPSBkaXNwb3NhbENhbmRpZGF0ZXNbaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArK19kZXBlbmRlbmNpZXNDb3VudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGRpc3Bvc2FsQ2FuZGlkYXRlc1tpZF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tZGlzcG9zYWxDb3VudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCcmFuZCBuZXcgc3Vic2NyaXB0aW9uIC0gYWRkIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZFN1YnNjcmlwdGlvblRvRGVwZW5kZW5jeShzdWJzY3JpYmFibGUsIGlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkOiBkZXBlbmRlbnRPYnNlcnZhYmxlLFxuICAgICAgICAgICAgICAgICAgICBpc0luaXRpYWw6IHB1cmUgPyB1bmRlZmluZWQgOiAhX2RlcGVuZGVuY2llc0NvdW50ICAgICAgICAvLyBJZiB3ZSdyZSBldmFsdWF0aW5nIHdoZW4gdGhlcmUgYXJlIG5vIHByZXZpb3VzIGRlcGVuZGVuY2llcywgaXQgbXVzdCBiZSB0aGUgZmlyc3QgdGltZVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgX3N1YnNjcmlwdGlvbnNUb0RlcGVuZGVuY2llcyA9IHt9O1xuICAgICAgICAgICAgICAgIF9kZXBlbmRlbmNpZXNDb3VudCA9IDA7XG5cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3VmFsdWUgPSBldmFsdWF0b3JGdW5jdGlvblRhcmdldCA/IHJlYWRGdW5jdGlvbi5jYWxsKGV2YWx1YXRvckZ1bmN0aW9uVGFyZ2V0KSA6IHJlYWRGdW5jdGlvbigpO1xuXG4gICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5lbmQoKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBGb3IgZWFjaCBzdWJzY3JpcHRpb24gbm8gbG9uZ2VyIGJlaW5nIHVzZWQsIHJlbW92ZSBpdCBmcm9tIHRoZSBhY3RpdmUgc3Vic2NyaXB0aW9ucyBsaXN0IGFuZCBkaXNwb3NlIGl0XG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXNwb3NhbENvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrby51dGlscy5vYmplY3RGb3JFYWNoKGRpc3Bvc2FsQ2FuZGlkYXRlcywgZnVuY3Rpb24oaWQsIHRvRGlzcG9zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvRGlzcG9zZS5kaXNwb3NlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIF9uZWVkc0V2YWx1YXRpb24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoZGVwZW5kZW50T2JzZXJ2YWJsZS5pc0RpZmZlcmVudChfbGF0ZXN0VmFsdWUsIG5ld1ZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICBkZXBlbmRlbnRPYnNlcnZhYmxlW1wibm90aWZ5U3Vic2NyaWJlcnNcIl0oX2xhdGVzdFZhbHVlLCBcImJlZm9yZUNoYW5nZVwiKTtcblxuICAgICAgICAgICAgICAgICAgICBfbGF0ZXN0VmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKERFQlVHKSBkZXBlbmRlbnRPYnNlcnZhYmxlLl9sYXRlc3RWYWx1ZSA9IF9sYXRlc3RWYWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc3VwcHJlc3NDaGFuZ2VOb3RpZmljYXRpb24gIT09IHRydWUpIHsgIC8vIENoZWNrIGZvciBzdHJpY3QgdHJ1ZSB2YWx1ZSBzaW5jZSBzZXRUaW1lb3V0IGluIEZpcmVmb3ggcGFzc2VzIGEgbnVtZXJpYyB2YWx1ZSB0byB0aGUgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcGVuZGVudE9ic2VydmFibGVbXCJub3RpZnlTdWJzY3JpYmVyc1wiXShfbGF0ZXN0VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICBfaXNCZWluZ0V2YWx1YXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFfZGVwZW5kZW5jaWVzQ291bnQpXG4gICAgICAgICAgICBkaXNwb3NlKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVwZW5kZW50T2JzZXJ2YWJsZSgpIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHdyaXRlRnVuY3Rpb24gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIC8vIFdyaXRpbmcgYSB2YWx1ZVxuICAgICAgICAgICAgICAgIHdyaXRlRnVuY3Rpb24uYXBwbHkoZXZhbHVhdG9yRnVuY3Rpb25UYXJnZXQsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCB3cml0ZSBhIHZhbHVlIHRvIGEga28uY29tcHV0ZWQgdW5sZXNzIHlvdSBzcGVjaWZ5IGEgJ3dyaXRlJyBvcHRpb24uIElmIHlvdSB3aXNoIHRvIHJlYWQgdGhlIGN1cnJlbnQgdmFsdWUsIGRvbid0IHBhc3MgYW55IHBhcmFtZXRlcnMuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7IC8vIFBlcm1pdHMgY2hhaW5lZCBhc3NpZ25tZW50c1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gUmVhZGluZyB0aGUgdmFsdWVcbiAgICAgICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24ucmVnaXN0ZXJEZXBlbmRlbmN5KGRlcGVuZGVudE9ic2VydmFibGUpO1xuICAgICAgICAgICAgaWYgKF9uZWVkc0V2YWx1YXRpb24pXG4gICAgICAgICAgICAgICAgZXZhbHVhdGVJbW1lZGlhdGUodHJ1ZSAvKiBzdXBwcmVzc0NoYW5nZU5vdGlmaWNhdGlvbiAqLyk7XG4gICAgICAgICAgICByZXR1cm4gX2xhdGVzdFZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVlaygpIHtcbiAgICAgICAgLy8gUGVlayB3b24ndCByZS1ldmFsdWF0ZSwgZXhjZXB0IHRvIGdldCB0aGUgaW5pdGlhbCB2YWx1ZSB3aGVuIFwiZGVmZXJFdmFsdWF0aW9uXCIgaXMgc2V0LCBvciB3aGlsZSB0aGUgY29tcHV0ZWQgaXMgc2xlZXBpbmcuXG4gICAgICAgIC8vIFRob3NlIGFyZSB0aGUgb25seSB0aW1lcyB0aGF0IGJvdGggb2YgdGhlc2UgY29uZGl0aW9ucyB3aWxsIGJlIHNhdGlzZmllZC5cbiAgICAgICAgaWYgKF9uZWVkc0V2YWx1YXRpb24gJiYgIV9kZXBlbmRlbmNpZXNDb3VudClcbiAgICAgICAgICAgIGV2YWx1YXRlSW1tZWRpYXRlKHRydWUgLyogc3VwcHJlc3NDaGFuZ2VOb3RpZmljYXRpb24gKi8pO1xuICAgICAgICByZXR1cm4gX2xhdGVzdFZhbHVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQWN0aXZlKCkge1xuICAgICAgICByZXR1cm4gX25lZWRzRXZhbHVhdGlvbiB8fCBfZGVwZW5kZW5jaWVzQ291bnQgPiAwO1xuICAgIH1cblxuICAgIC8vIEJ5IGhlcmUsIFwib3B0aW9uc1wiIGlzIGFsd2F5cyBub24tbnVsbFxuICAgIHZhciB3cml0ZUZ1bmN0aW9uID0gb3B0aW9uc1tcIndyaXRlXCJdLFxuICAgICAgICBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQgPSBvcHRpb25zW1wiZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkXCJdIHx8IG9wdGlvbnMuZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkIHx8IG51bGwsXG4gICAgICAgIGRpc3Bvc2VXaGVuT3B0aW9uID0gb3B0aW9uc1tcImRpc3Bvc2VXaGVuXCJdIHx8IG9wdGlvbnMuZGlzcG9zZVdoZW4sXG4gICAgICAgIGRpc3Bvc2VXaGVuID0gZGlzcG9zZVdoZW5PcHRpb24sXG4gICAgICAgIGRpc3Bvc2UgPSBkaXNwb3NlQ29tcHV0ZWQsXG4gICAgICAgIF9zdWJzY3JpcHRpb25zVG9EZXBlbmRlbmNpZXMgPSB7fSxcbiAgICAgICAgX2RlcGVuZGVuY2llc0NvdW50ID0gMCxcbiAgICAgICAgZXZhbHVhdGlvblRpbWVvdXRJbnN0YW5jZSA9IG51bGw7XG5cbiAgICBpZiAoIWV2YWx1YXRvckZ1bmN0aW9uVGFyZ2V0KVxuICAgICAgICBldmFsdWF0b3JGdW5jdGlvblRhcmdldCA9IG9wdGlvbnNbXCJvd25lclwiXTtcblxuICAgIGtvLnN1YnNjcmliYWJsZS5jYWxsKGRlcGVuZGVudE9ic2VydmFibGUpO1xuICAgIGtvLnV0aWxzLnNldFByb3RvdHlwZU9mT3JFeHRlbmQoZGVwZW5kZW50T2JzZXJ2YWJsZSwga28uZGVwZW5kZW50T2JzZXJ2YWJsZVsnZm4nXSk7XG5cbiAgICBkZXBlbmRlbnRPYnNlcnZhYmxlLnBlZWsgPSBwZWVrO1xuICAgIGRlcGVuZGVudE9ic2VydmFibGUuZ2V0RGVwZW5kZW5jaWVzQ291bnQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBfZGVwZW5kZW5jaWVzQ291bnQ7IH07XG4gICAgZGVwZW5kZW50T2JzZXJ2YWJsZS5oYXNXcml0ZUZ1bmN0aW9uID0gdHlwZW9mIG9wdGlvbnNbXCJ3cml0ZVwiXSA9PT0gXCJmdW5jdGlvblwiO1xuICAgIGRlcGVuZGVudE9ic2VydmFibGUuZGlzcG9zZSA9IGZ1bmN0aW9uICgpIHsgZGlzcG9zZSgpOyB9O1xuICAgIGRlcGVuZGVudE9ic2VydmFibGUuaXNBY3RpdmUgPSBpc0FjdGl2ZTtcblxuICAgIC8vIFJlcGxhY2UgdGhlIGxpbWl0IGZ1bmN0aW9uIHdpdGggb25lIHRoYXQgZGVsYXlzIGV2YWx1YXRpb24gYXMgd2VsbC5cbiAgICB2YXIgb3JpZ2luYWxMaW1pdCA9IGRlcGVuZGVudE9ic2VydmFibGUubGltaXQ7XG4gICAgZGVwZW5kZW50T2JzZXJ2YWJsZS5saW1pdCA9IGZ1bmN0aW9uKGxpbWl0RnVuY3Rpb24pIHtcbiAgICAgICAgb3JpZ2luYWxMaW1pdC5jYWxsKGRlcGVuZGVudE9ic2VydmFibGUsIGxpbWl0RnVuY3Rpb24pO1xuICAgICAgICBkZXBlbmRlbnRPYnNlcnZhYmxlLl9ldmFsUmF0ZUxpbWl0ZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGRlcGVuZGVudE9ic2VydmFibGUuX3JhdGVMaW1pdGVkQmVmb3JlQ2hhbmdlKF9sYXRlc3RWYWx1ZSk7XG5cbiAgICAgICAgICAgIF9uZWVkc0V2YWx1YXRpb24gPSB0cnVlOyAgICAvLyBNYXJrIGFzIGRpcnR5XG5cbiAgICAgICAgICAgIC8vIFBhc3MgdGhlIG9ic2VydmFibGUgdG8gdGhlIHJhdGUtbGltaXQgY29kZSwgd2hpY2ggd2lsbCBhY2Nlc3MgaXQgd2hlblxuICAgICAgICAgICAgLy8gaXQncyB0aW1lIHRvIGRvIHRoZSBub3RpZmljYXRpb24uXG4gICAgICAgICAgICBkZXBlbmRlbnRPYnNlcnZhYmxlLl9yYXRlTGltaXRlZENoYW5nZShkZXBlbmRlbnRPYnNlcnZhYmxlKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAob3B0aW9uc1sncHVyZSddKSB7XG4gICAgICAgIHB1cmUgPSB0cnVlO1xuICAgICAgICBpc1NsZWVwaW5nID0gdHJ1ZTsgICAgIC8vIFN0YXJ0cyBvZmYgc2xlZXBpbmc7IHdpbGwgYXdha2Ugb24gdGhlIGZpcnN0IHN1YnNjcmlwdGlvblxuICAgICAgICBkZXBlbmRlbnRPYnNlcnZhYmxlLmJlZm9yZVN1YnNjcmlwdGlvbkFkZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIElmIGFzbGVlcCwgd2FrZSB1cCB0aGUgY29tcHV0ZWQgYW5kIGV2YWx1YXRlIHRvIHJlZ2lzdGVyIGFueSBkZXBlbmRlbmNpZXMuXG4gICAgICAgICAgICBpZiAoaXNTbGVlcGluZykge1xuICAgICAgICAgICAgICAgIGlzU2xlZXBpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBldmFsdWF0ZUltbWVkaWF0ZSh0cnVlIC8qIHN1cHByZXNzQ2hhbmdlTm90aWZpY2F0aW9uICovKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBkZXBlbmRlbnRPYnNlcnZhYmxlLmFmdGVyU3Vic2NyaXB0aW9uUmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCFkZXBlbmRlbnRPYnNlcnZhYmxlLmdldFN1YnNjcmlwdGlvbnNDb3VudCgpKSB7XG4gICAgICAgICAgICAgICAgZGlzcG9zZUFsbFN1YnNjcmlwdGlvbnNUb0RlcGVuZGVuY2llcygpO1xuICAgICAgICAgICAgICAgIGlzU2xlZXBpbmcgPSBfbmVlZHNFdmFsdWF0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAob3B0aW9uc1snZGVmZXJFdmFsdWF0aW9uJ10pIHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIGZvcmNlIGEgY29tcHV0ZWQgd2l0aCBkZWZlckV2YWx1YXRpb24gdG8gZXZhbHVhdGUgd2hlbiB0aGUgZmlyc3Qgc3Vic2NyaXB0aW9ucyBpcyByZWdpc3RlcmVkLlxuICAgICAgICBkZXBlbmRlbnRPYnNlcnZhYmxlLmJlZm9yZVN1YnNjcmlwdGlvbkFkZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHBlZWsoKTtcbiAgICAgICAgICAgIGRlbGV0ZSBkZXBlbmRlbnRPYnNlcnZhYmxlLmJlZm9yZVN1YnNjcmlwdGlvbkFkZDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGtvLmV4cG9ydFByb3BlcnR5KGRlcGVuZGVudE9ic2VydmFibGUsICdwZWVrJywgZGVwZW5kZW50T2JzZXJ2YWJsZS5wZWVrKTtcbiAgICBrby5leHBvcnRQcm9wZXJ0eShkZXBlbmRlbnRPYnNlcnZhYmxlLCAnZGlzcG9zZScsIGRlcGVuZGVudE9ic2VydmFibGUuZGlzcG9zZSk7XG4gICAga28uZXhwb3J0UHJvcGVydHkoZGVwZW5kZW50T2JzZXJ2YWJsZSwgJ2lzQWN0aXZlJywgZGVwZW5kZW50T2JzZXJ2YWJsZS5pc0FjdGl2ZSk7XG4gICAga28uZXhwb3J0UHJvcGVydHkoZGVwZW5kZW50T2JzZXJ2YWJsZSwgJ2dldERlcGVuZGVuY2llc0NvdW50JywgZGVwZW5kZW50T2JzZXJ2YWJsZS5nZXREZXBlbmRlbmNpZXNDb3VudCk7XG5cbiAgICAvLyBBZGQgYSBcImRpc3Bvc2VXaGVuXCIgY2FsbGJhY2sgdGhhdCwgb24gZWFjaCBldmFsdWF0aW9uLCBkaXNwb3NlcyBpZiB0aGUgbm9kZSB3YXMgcmVtb3ZlZCB3aXRob3V0IHVzaW5nIGtvLnJlbW92ZU5vZGUuXG4gICAgaWYgKGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZCkge1xuICAgICAgICAvLyBTaW5jZSB0aGlzIGNvbXB1dGVkIGlzIGFzc29jaWF0ZWQgd2l0aCBhIERPTSBub2RlLCBhbmQgd2UgZG9uJ3Qgd2FudCB0byBkaXNwb3NlIHRoZSBjb21wdXRlZFxuICAgICAgICAvLyB1bnRpbCB0aGUgRE9NIG5vZGUgaXMgKnJlbW92ZWQqIGZyb20gdGhlIGRvY3VtZW50IChhcyBvcHBvc2VkIHRvIG5ldmVyIGhhdmluZyBiZWVuIGluIHRoZSBkb2N1bWVudCksXG4gICAgICAgIC8vIHdlJ2xsIHByZXZlbnQgZGlzcG9zYWwgdW50aWwgXCJkaXNwb3NlV2hlblwiIGZpcnN0IHJldHVybnMgZmFsc2UuXG4gICAgICAgIF9zdXBwcmVzc0Rpc3Bvc2FsVW50aWxEaXNwb3NlV2hlblJldHVybnNGYWxzZSA9IHRydWU7XG5cbiAgICAgICAgLy8gT25seSB3YXRjaCBmb3IgdGhlIG5vZGUncyBkaXNwb3NhbCBpZiB0aGUgdmFsdWUgcmVhbGx5IGlzIGEgbm9kZS4gSXQgbWlnaHQgbm90IGJlLFxuICAgICAgICAvLyBlLmcuLCB7IGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZDogdHJ1ZSB9IGNhbiBiZSB1c2VkIHRvIG9wdCBpbnRvIHRoZSBcIm9ubHkgZGlzcG9zZVxuICAgICAgICAvLyBhZnRlciBmaXJzdCBmYWxzZSByZXN1bHRcIiBiZWhhdmlvdXIgZXZlbiBpZiB0aGVyZSdzIG5vIHNwZWNpZmljIG5vZGUgdG8gd2F0Y2guIFRoaXNcbiAgICAgICAgLy8gdGVjaG5pcXVlIGlzIGludGVuZGVkIGZvciBLTydzIGludGVybmFsIHVzZSBvbmx5IGFuZCBzaG91bGRuJ3QgYmUgZG9jdW1lbnRlZCBvciB1c2VkXG4gICAgICAgIC8vIGJ5IGFwcGxpY2F0aW9uIGNvZGUsIGFzIGl0J3MgbGlrZWx5IHRvIGNoYW5nZSBpbiBhIGZ1dHVyZSB2ZXJzaW9uIG9mIEtPLlxuICAgICAgICBpZiAoZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkLm5vZGVUeXBlKSB7XG4gICAgICAgICAgICBkaXNwb3NlV2hlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gIWtvLnV0aWxzLmRvbU5vZGVJc0F0dGFjaGVkVG9Eb2N1bWVudChkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQpIHx8IChkaXNwb3NlV2hlbk9wdGlvbiAmJiBkaXNwb3NlV2hlbk9wdGlvbigpKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBFdmFsdWF0ZSwgdW5sZXNzIHNsZWVwaW5nIG9yIGRlZmVyRXZhbHVhdGlvbiBpcyB0cnVlXG4gICAgaWYgKCFpc1NsZWVwaW5nICYmICFvcHRpb25zWydkZWZlckV2YWx1YXRpb24nXSlcbiAgICAgICAgZXZhbHVhdGVJbW1lZGlhdGUoKTtcblxuICAgIC8vIEF0dGFjaCBhIERPTSBub2RlIGRpc3Bvc2FsIGNhbGxiYWNrIHNvIHRoYXQgdGhlIGNvbXB1dGVkIHdpbGwgYmUgcHJvYWN0aXZlbHkgZGlzcG9zZWQgYXMgc29vbiBhcyB0aGUgbm9kZSBpc1xuICAgIC8vIHJlbW92ZWQgdXNpbmcga28ucmVtb3ZlTm9kZS4gQnV0IHNraXAgaWYgaXNBY3RpdmUgaXMgZmFsc2UgKHRoZXJlIHdpbGwgbmV2ZXIgYmUgYW55IGRlcGVuZGVuY2llcyB0byBkaXNwb3NlKS5cbiAgICBpZiAoZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkICYmIGlzQWN0aXZlKCkgJiYgZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkLm5vZGVUeXBlKSB7XG4gICAgICAgIGRpc3Bvc2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbC5yZW1vdmVEaXNwb3NlQ2FsbGJhY2soZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkLCBkaXNwb3NlKTtcbiAgICAgICAgICAgIGRpc3Bvc2VDb21wdXRlZCgpO1xuICAgICAgICB9O1xuICAgICAgICBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwuYWRkRGlzcG9zZUNhbGxiYWNrKGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZCwgZGlzcG9zZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlcGVuZGVudE9ic2VydmFibGU7XG59O1xuXG5rby5pc0NvbXB1dGVkID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgICByZXR1cm4ga28uaGFzUHJvdG90eXBlKGluc3RhbmNlLCBrby5kZXBlbmRlbnRPYnNlcnZhYmxlKTtcbn07XG5cbnZhciBwcm90b1Byb3AgPSBrby5vYnNlcnZhYmxlLnByb3RvUHJvcGVydHk7IC8vID09IFwiX19rb19wcm90b19fXCJcbmtvLmRlcGVuZGVudE9ic2VydmFibGVbcHJvdG9Qcm9wXSA9IGtvLm9ic2VydmFibGU7XG5cbmtvLmRlcGVuZGVudE9ic2VydmFibGVbJ2ZuJ10gPSB7XG4gICAgXCJlcXVhbGl0eUNvbXBhcmVyXCI6IHZhbHVlc0FyZVByaW1pdGl2ZUFuZEVxdWFsXG59O1xua28uZGVwZW5kZW50T2JzZXJ2YWJsZVsnZm4nXVtwcm90b1Byb3BdID0ga28uZGVwZW5kZW50T2JzZXJ2YWJsZTtcblxuLy8gTm90ZSB0aGF0IGZvciBicm93c2VycyB0aGF0IGRvbid0IHN1cHBvcnQgcHJvdG8gYXNzaWdubWVudCwgdGhlXG4vLyBpbmhlcml0YW5jZSBjaGFpbiBpcyBjcmVhdGVkIG1hbnVhbGx5IGluIHRoZSBrby5kZXBlbmRlbnRPYnNlcnZhYmxlIGNvbnN0cnVjdG9yXG5pZiAoa28udXRpbHMuY2FuU2V0UHJvdG90eXBlKSB7XG4gICAga28udXRpbHMuc2V0UHJvdG90eXBlT2Yoa28uZGVwZW5kZW50T2JzZXJ2YWJsZVsnZm4nXSwga28uc3Vic2NyaWJhYmxlWydmbiddKTtcbn1cblxua28uZXhwb3J0U3ltYm9sKCdkZXBlbmRlbnRPYnNlcnZhYmxlJywga28uZGVwZW5kZW50T2JzZXJ2YWJsZSk7XG5rby5leHBvcnRTeW1ib2woJ2NvbXB1dGVkJywga28uZGVwZW5kZW50T2JzZXJ2YWJsZSk7IC8vIE1ha2UgXCJrby5jb21wdXRlZFwiIGFuIGFsaWFzIGZvciBcImtvLmRlcGVuZGVudE9ic2VydmFibGVcIlxua28uZXhwb3J0U3ltYm9sKCdpc0NvbXB1dGVkJywga28uaXNDb21wdXRlZCk7XG5cbmtvLnB1cmVDb21wdXRlZCA9IGZ1bmN0aW9uIChldmFsdWF0b3JGdW5jdGlvbk9yT3B0aW9ucywgZXZhbHVhdG9yRnVuY3Rpb25UYXJnZXQpIHtcbiAgICBpZiAodHlwZW9mIGV2YWx1YXRvckZ1bmN0aW9uT3JPcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBrby5jb21wdXRlZChldmFsdWF0b3JGdW5jdGlvbk9yT3B0aW9ucywgZXZhbHVhdG9yRnVuY3Rpb25UYXJnZXQsIHsncHVyZSc6dHJ1ZX0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGV2YWx1YXRvckZ1bmN0aW9uT3JPcHRpb25zID0ga28udXRpbHMuZXh0ZW5kKHt9LCBldmFsdWF0b3JGdW5jdGlvbk9yT3B0aW9ucyk7ICAgLy8gbWFrZSBhIGNvcHkgb2YgdGhlIHBhcmFtZXRlciBvYmplY3RcbiAgICAgICAgZXZhbHVhdG9yRnVuY3Rpb25Pck9wdGlvbnNbJ3B1cmUnXSA9IHRydWU7XG4gICAgICAgIHJldHVybiBrby5jb21wdXRlZChldmFsdWF0b3JGdW5jdGlvbk9yT3B0aW9ucywgZXZhbHVhdG9yRnVuY3Rpb25UYXJnZXQpO1xuICAgIH1cbn1cbmtvLmV4cG9ydFN5bWJvbCgncHVyZUNvbXB1dGVkJywga28ucHVyZUNvbXB1dGVkKTtcblxuKGZ1bmN0aW9uKCkge1xuICAgIHZhciBtYXhOZXN0ZWRPYnNlcnZhYmxlRGVwdGggPSAxMDsgLy8gRXNjYXBlIHRoZSAodW5saWtlbHkpIHBhdGhhbG9naWNhbCBjYXNlIHdoZXJlIGFuIG9ic2VydmFibGUncyBjdXJyZW50IHZhbHVlIGlzIGl0c2VsZiAob3Igc2ltaWxhciByZWZlcmVuY2UgY3ljbGUpXG5cbiAgICBrby50b0pTID0gZnVuY3Rpb24ocm9vdE9iamVjdCkge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAwKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiV2hlbiBjYWxsaW5nIGtvLnRvSlMsIHBhc3MgdGhlIG9iamVjdCB5b3Ugd2FudCB0byBjb252ZXJ0LlwiKTtcblxuICAgICAgICAvLyBXZSBqdXN0IHVud3JhcCBldmVyeXRoaW5nIGF0IGV2ZXJ5IGxldmVsIGluIHRoZSBvYmplY3QgZ3JhcGhcbiAgICAgICAgcmV0dXJuIG1hcEpzT2JqZWN0R3JhcGgocm9vdE9iamVjdCwgZnVuY3Rpb24odmFsdWVUb01hcCkge1xuICAgICAgICAgICAgLy8gTG9vcCBiZWNhdXNlIGFuIG9ic2VydmFibGUncyB2YWx1ZSBtaWdodCBpbiB0dXJuIGJlIGFub3RoZXIgb2JzZXJ2YWJsZSB3cmFwcGVyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsga28uaXNPYnNlcnZhYmxlKHZhbHVlVG9NYXApICYmIChpIDwgbWF4TmVzdGVkT2JzZXJ2YWJsZURlcHRoKTsgaSsrKVxuICAgICAgICAgICAgICAgIHZhbHVlVG9NYXAgPSB2YWx1ZVRvTWFwKCk7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWVUb01hcDtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGtvLnRvSlNPTiA9IGZ1bmN0aW9uKHJvb3RPYmplY3QsIHJlcGxhY2VyLCBzcGFjZSkgeyAgICAgLy8gcmVwbGFjZXIgYW5kIHNwYWNlIGFyZSBvcHRpb25hbFxuICAgICAgICB2YXIgcGxhaW5KYXZhU2NyaXB0T2JqZWN0ID0ga28udG9KUyhyb290T2JqZWN0KTtcbiAgICAgICAgcmV0dXJuIGtvLnV0aWxzLnN0cmluZ2lmeUpzb24ocGxhaW5KYXZhU2NyaXB0T2JqZWN0LCByZXBsYWNlciwgc3BhY2UpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBtYXBKc09iamVjdEdyYXBoKHJvb3RPYmplY3QsIG1hcElucHV0Q2FsbGJhY2ssIHZpc2l0ZWRPYmplY3RzKSB7XG4gICAgICAgIHZpc2l0ZWRPYmplY3RzID0gdmlzaXRlZE9iamVjdHMgfHwgbmV3IG9iamVjdExvb2t1cCgpO1xuXG4gICAgICAgIHJvb3RPYmplY3QgPSBtYXBJbnB1dENhbGxiYWNrKHJvb3RPYmplY3QpO1xuICAgICAgICB2YXIgY2FuSGF2ZVByb3BlcnRpZXMgPSAodHlwZW9mIHJvb3RPYmplY3QgPT0gXCJvYmplY3RcIikgJiYgKHJvb3RPYmplY3QgIT09IG51bGwpICYmIChyb290T2JqZWN0ICE9PSB1bmRlZmluZWQpICYmICghKHJvb3RPYmplY3QgaW5zdGFuY2VvZiBEYXRlKSkgJiYgKCEocm9vdE9iamVjdCBpbnN0YW5jZW9mIFN0cmluZykpICYmICghKHJvb3RPYmplY3QgaW5zdGFuY2VvZiBOdW1iZXIpKSAmJiAoIShyb290T2JqZWN0IGluc3RhbmNlb2YgQm9vbGVhbikpO1xuICAgICAgICBpZiAoIWNhbkhhdmVQcm9wZXJ0aWVzKVxuICAgICAgICAgICAgcmV0dXJuIHJvb3RPYmplY3Q7XG5cbiAgICAgICAgdmFyIG91dHB1dFByb3BlcnRpZXMgPSByb290T2JqZWN0IGluc3RhbmNlb2YgQXJyYXkgPyBbXSA6IHt9O1xuICAgICAgICB2aXNpdGVkT2JqZWN0cy5zYXZlKHJvb3RPYmplY3QsIG91dHB1dFByb3BlcnRpZXMpO1xuXG4gICAgICAgIHZpc2l0UHJvcGVydGllc09yQXJyYXlFbnRyaWVzKHJvb3RPYmplY3QsIGZ1bmN0aW9uKGluZGV4ZXIpIHtcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eVZhbHVlID0gbWFwSW5wdXRDYWxsYmFjayhyb290T2JqZWN0W2luZGV4ZXJdKTtcblxuICAgICAgICAgICAgc3dpdGNoICh0eXBlb2YgcHJvcGVydHlWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJib29sZWFuXCI6XG4gICAgICAgICAgICAgICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgICAgICAgICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgICAgICAgICAgICBjYXNlIFwiZnVuY3Rpb25cIjpcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0UHJvcGVydGllc1tpbmRleGVyXSA9IHByb3BlcnR5VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICAgICAgICAgICAgICBjYXNlIFwidW5kZWZpbmVkXCI6XG4gICAgICAgICAgICAgICAgICAgIHZhciBwcmV2aW91c2x5TWFwcGVkVmFsdWUgPSB2aXNpdGVkT2JqZWN0cy5nZXQocHJvcGVydHlWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dFByb3BlcnRpZXNbaW5kZXhlcl0gPSAocHJldmlvdXNseU1hcHBlZFZhbHVlICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHByZXZpb3VzbHlNYXBwZWRWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgOiBtYXBKc09iamVjdEdyYXBoKHByb3BlcnR5VmFsdWUsIG1hcElucHV0Q2FsbGJhY2ssIHZpc2l0ZWRPYmplY3RzKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBvdXRwdXRQcm9wZXJ0aWVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZpc2l0UHJvcGVydGllc09yQXJyYXlFbnRyaWVzKHJvb3RPYmplY3QsIHZpc2l0b3JDYWxsYmFjaykge1xuICAgICAgICBpZiAocm9vdE9iamVjdCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJvb3RPYmplY3QubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICAgICAgdmlzaXRvckNhbGxiYWNrKGkpO1xuXG4gICAgICAgICAgICAvLyBGb3IgYXJyYXlzLCBhbHNvIHJlc3BlY3QgdG9KU09OIHByb3BlcnR5IGZvciBjdXN0b20gbWFwcGluZ3MgKGZpeGVzICMyNzgpXG4gICAgICAgICAgICBpZiAodHlwZW9mIHJvb3RPYmplY3RbJ3RvSlNPTiddID09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgdmlzaXRvckNhbGxiYWNrKCd0b0pTT04nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5TmFtZSBpbiByb290T2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgdmlzaXRvckNhbGxiYWNrKHByb3BlcnR5TmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gb2JqZWN0TG9va3VwKCkge1xuICAgICAgICB0aGlzLmtleXMgPSBbXTtcbiAgICAgICAgdGhpcy52YWx1ZXMgPSBbXTtcbiAgICB9O1xuXG4gICAgb2JqZWN0TG9va3VwLnByb3RvdHlwZSA9IHtcbiAgICAgICAgY29uc3RydWN0b3I6IG9iamVjdExvb2t1cCxcbiAgICAgICAgc2F2ZTogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIGV4aXN0aW5nSW5kZXggPSBrby51dGlscy5hcnJheUluZGV4T2YodGhpcy5rZXlzLCBrZXkpO1xuICAgICAgICAgICAgaWYgKGV4aXN0aW5nSW5kZXggPj0gMClcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlc1tleGlzdGluZ0luZGV4XSA9IHZhbHVlO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5rZXlzLnB1c2goa2V5KTtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlcy5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgIHZhciBleGlzdGluZ0luZGV4ID0ga28udXRpbHMuYXJyYXlJbmRleE9mKHRoaXMua2V5cywga2V5KTtcbiAgICAgICAgICAgIHJldHVybiAoZXhpc3RpbmdJbmRleCA+PSAwKSA/IHRoaXMudmFsdWVzW2V4aXN0aW5nSW5kZXhdIDogdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG5cbmtvLmV4cG9ydFN5bWJvbCgndG9KUycsIGtvLnRvSlMpO1xua28uZXhwb3J0U3ltYm9sKCd0b0pTT04nLCBrby50b0pTT04pO1xuKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaGFzRG9tRGF0YUV4cGFuZG9Qcm9wZXJ0eSA9ICdfX2tvX19oYXNEb21EYXRhT3B0aW9uVmFsdWVfXyc7XG5cbiAgICAvLyBOb3JtYWxseSwgU0VMRUNUIGVsZW1lbnRzIGFuZCB0aGVpciBPUFRJT05zIGNhbiBvbmx5IHRha2UgdmFsdWUgb2YgdHlwZSAnc3RyaW5nJyAoYmVjYXVzZSB0aGUgdmFsdWVzXG4gICAgLy8gYXJlIHN0b3JlZCBvbiBET00gYXR0cmlidXRlcykuIGtvLnNlbGVjdEV4dGVuc2lvbnMgcHJvdmlkZXMgYSB3YXkgZm9yIFNFTEVDVHMvT1BUSU9OcyB0byBoYXZlIHZhbHVlc1xuICAgIC8vIHRoYXQgYXJlIGFyYml0cmFyeSBvYmplY3RzLiBUaGlzIGlzIHZlcnkgY29udmVuaWVudCB3aGVuIGltcGxlbWVudGluZyB0aGluZ3MgbGlrZSBjYXNjYWRpbmcgZHJvcGRvd25zLlxuICAgIGtvLnNlbGVjdEV4dGVuc2lvbnMgPSB7XG4gICAgICAgIHJlYWRWYWx1ZSA6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoa28udXRpbHMudGFnTmFtZUxvd2VyKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnb3B0aW9uJzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnRbaGFzRG9tRGF0YUV4cGFuZG9Qcm9wZXJ0eV0gPT09IHRydWUpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ga28udXRpbHMuZG9tRGF0YS5nZXQoZWxlbWVudCwga28uYmluZGluZ0hhbmRsZXJzLm9wdGlvbnMub3B0aW9uVmFsdWVEb21EYXRhS2V5KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtvLnV0aWxzLmllVmVyc2lvbiA8PSA3XG4gICAgICAgICAgICAgICAgICAgICAgICA/IChlbGVtZW50LmdldEF0dHJpYnV0ZU5vZGUoJ3ZhbHVlJykgJiYgZWxlbWVudC5nZXRBdHRyaWJ1dGVOb2RlKCd2YWx1ZScpLnNwZWNpZmllZCA/IGVsZW1lbnQudmFsdWUgOiBlbGVtZW50LnRleHQpXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGVsZW1lbnQudmFsdWU7XG4gICAgICAgICAgICAgICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQuc2VsZWN0ZWRJbmRleCA+PSAwID8ga28uc2VsZWN0RXh0ZW5zaW9ucy5yZWFkVmFsdWUoZWxlbWVudC5vcHRpb25zW2VsZW1lbnQuc2VsZWN0ZWRJbmRleF0pIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50LnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHdyaXRlVmFsdWU6IGZ1bmN0aW9uKGVsZW1lbnQsIHZhbHVlLCBhbGxvd1Vuc2V0KSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGtvLnV0aWxzLnRhZ05hbWVMb3dlcihlbGVtZW50KSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ29wdGlvbic6XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCh0eXBlb2YgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrby51dGlscy5kb21EYXRhLnNldChlbGVtZW50LCBrby5iaW5kaW5nSGFuZGxlcnMub3B0aW9ucy5vcHRpb25WYWx1ZURvbURhdGFLZXksIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhhc0RvbURhdGFFeHBhbmRvUHJvcGVydHkgaW4gZWxlbWVudCkgeyAvLyBJRSA8PSA4IHRocm93cyBlcnJvcnMgaWYgeW91IGRlbGV0ZSBub24tZXhpc3RlbnQgcHJvcGVydGllcyBmcm9tIGEgRE9NIG5vZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGVsZW1lbnRbaGFzRG9tRGF0YUV4cGFuZG9Qcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3RvcmUgYXJiaXRyYXJ5IG9iamVjdCB1c2luZyBEb21EYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga28udXRpbHMuZG9tRGF0YS5zZXQoZWxlbWVudCwga28uYmluZGluZ0hhbmRsZXJzLm9wdGlvbnMub3B0aW9uVmFsdWVEb21EYXRhS2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudFtoYXNEb21EYXRhRXhwYW5kb1Byb3BlcnR5XSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTcGVjaWFsIHRyZWF0bWVudCBvZiBudW1iZXJzIGlzIGp1c3QgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkuIEtPIDEuMi4xIHdyb3RlIG51bWVyaWNhbCB2YWx1ZXMgdG8gZWxlbWVudC52YWx1ZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnZhbHVlID0gdHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiID8gdmFsdWUgOiBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gXCJcIiB8fCB2YWx1ZSA9PT0gbnVsbCkgICAgICAgLy8gQSBibGFuayBzdHJpbmcgb3IgbnVsbCB2YWx1ZSB3aWxsIHNlbGVjdCB0aGUgY2FwdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3Rpb24gPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSBlbGVtZW50Lm9wdGlvbnMubGVuZ3RoLCBvcHRpb25WYWx1ZTsgaSA8IG47ICsraSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uVmFsdWUgPSBrby5zZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZShlbGVtZW50Lm9wdGlvbnNbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSW5jbHVkZSBzcGVjaWFsIGNoZWNrIHRvIGhhbmRsZSBzZWxlY3RpbmcgYSBjYXB0aW9uIHdpdGggYSBibGFuayBzdHJpbmcgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25WYWx1ZSA9PSB2YWx1ZSB8fCAob3B0aW9uVmFsdWUgPT0gXCJcIiAmJiB2YWx1ZSA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbiA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGFsbG93VW5zZXQgfHwgc2VsZWN0aW9uID49IDAgfHwgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgZWxlbWVudC5zaXplID4gMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc2VsZWN0ZWRJbmRleCA9IHNlbGVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoKHZhbHVlID09PSBudWxsKSB8fCAodmFsdWUgPT09IHVuZGVmaW5lZCkpXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcblxua28uZXhwb3J0U3ltYm9sKCdzZWxlY3RFeHRlbnNpb25zJywga28uc2VsZWN0RXh0ZW5zaW9ucyk7XG5rby5leHBvcnRTeW1ib2woJ3NlbGVjdEV4dGVuc2lvbnMucmVhZFZhbHVlJywga28uc2VsZWN0RXh0ZW5zaW9ucy5yZWFkVmFsdWUpO1xua28uZXhwb3J0U3ltYm9sKCdzZWxlY3RFeHRlbnNpb25zLndyaXRlVmFsdWUnLCBrby5zZWxlY3RFeHRlbnNpb25zLndyaXRlVmFsdWUpO1xua28uZXhwcmVzc2lvblJld3JpdGluZyA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGphdmFTY3JpcHRSZXNlcnZlZFdvcmRzID0gW1widHJ1ZVwiLCBcImZhbHNlXCIsIFwibnVsbFwiLCBcInVuZGVmaW5lZFwiXTtcblxuICAgIC8vIE1hdGNoZXMgc29tZXRoaW5nIHRoYXQgY2FuIGJlIGFzc2lnbmVkIHRvLS1laXRoZXIgYW4gaXNvbGF0ZWQgaWRlbnRpZmllciBvciBzb21ldGhpbmcgZW5kaW5nIHdpdGggYSBwcm9wZXJ0eSBhY2Nlc3NvclxuICAgIC8vIFRoaXMgaXMgZGVzaWduZWQgdG8gYmUgc2ltcGxlIGFuZCBhdm9pZCBmYWxzZSBuZWdhdGl2ZXMsIGJ1dCBjb3VsZCBwcm9kdWNlIGZhbHNlIHBvc2l0aXZlcyAoZS5nLiwgYStiLmMpLlxuICAgIC8vIFRoaXMgYWxzbyB3aWxsIG5vdCBwcm9wZXJseSBoYW5kbGUgbmVzdGVkIGJyYWNrZXRzIChlLmcuLCBvYmoxW29iajJbJ3Byb3AnXV07IHNlZSAjOTExKS5cbiAgICB2YXIgamF2YVNjcmlwdEFzc2lnbm1lbnRUYXJnZXQgPSAvXig/OlskX2Etel1bJFxcd10qfCguKykoXFwuXFxzKlskX2Etel1bJFxcd10qfFxcWy4rXFxdKSkkL2k7XG5cbiAgICBmdW5jdGlvbiBnZXRXcml0ZWFibGVWYWx1ZShleHByZXNzaW9uKSB7XG4gICAgICAgIGlmIChrby51dGlscy5hcnJheUluZGV4T2YoamF2YVNjcmlwdFJlc2VydmVkV29yZHMsIGV4cHJlc3Npb24pID49IDApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIHZhciBtYXRjaCA9IGV4cHJlc3Npb24ubWF0Y2goamF2YVNjcmlwdEFzc2lnbm1lbnRUYXJnZXQpO1xuICAgICAgICByZXR1cm4gbWF0Y2ggPT09IG51bGwgPyBmYWxzZSA6IG1hdGNoWzFdID8gKCdPYmplY3QoJyArIG1hdGNoWzFdICsgJyknICsgbWF0Y2hbMl0pIDogZXhwcmVzc2lvbjtcbiAgICB9XG5cbiAgICAvLyBUaGUgZm9sbG93aW5nIHJlZ3VsYXIgZXhwcmVzc2lvbnMgd2lsbCBiZSB1c2VkIHRvIHNwbGl0IGFuIG9iamVjdC1saXRlcmFsIHN0cmluZyBpbnRvIHRva2Vuc1xuXG4gICAgICAgIC8vIFRoZXNlIHR3byBtYXRjaCBzdHJpbmdzLCBlaXRoZXIgd2l0aCBkb3VibGUgcXVvdGVzIG9yIHNpbmdsZSBxdW90ZXNcbiAgICB2YXIgc3RyaW5nRG91YmxlID0gJ1wiKD86W15cIlxcXFxcXFxcXXxcXFxcXFxcXC4pKlwiJyxcbiAgICAgICAgc3RyaW5nU2luZ2xlID0gXCInKD86W14nXFxcXFxcXFxdfFxcXFxcXFxcLikqJ1wiLFxuICAgICAgICAvLyBNYXRjaGVzIGEgcmVndWxhciBleHByZXNzaW9uICh0ZXh0IGVuY2xvc2VkIGJ5IHNsYXNoZXMpLCBidXQgd2lsbCBhbHNvIG1hdGNoIHNldHMgb2YgZGl2aXNpb25zXG4gICAgICAgIC8vIGFzIGEgcmVndWxhciBleHByZXNzaW9uICh0aGlzIGlzIGhhbmRsZWQgYnkgdGhlIHBhcnNpbmcgbG9vcCBiZWxvdykuXG4gICAgICAgIHN0cmluZ1JlZ2V4cCA9ICcvKD86W14vXFxcXFxcXFxdfFxcXFxcXFxcLikqL1xcdyonLFxuICAgICAgICAvLyBUaGVzZSBjaGFyYWN0ZXJzIGhhdmUgc3BlY2lhbCBtZWFuaW5nIHRvIHRoZSBwYXJzZXIgYW5kIG11c3Qgbm90IGFwcGVhciBpbiB0aGUgbWlkZGxlIG9mIGFcbiAgICAgICAgLy8gdG9rZW4sIGV4Y2VwdCBhcyBwYXJ0IG9mIGEgc3RyaW5nLlxuICAgICAgICBzcGVjaWFscyA9ICcsXCJcXCd7fSgpLzpbXFxcXF0nLFxuICAgICAgICAvLyBNYXRjaCB0ZXh0IChhdCBsZWFzdCB0d28gY2hhcmFjdGVycykgdGhhdCBkb2VzIG5vdCBjb250YWluIGFueSBvZiB0aGUgYWJvdmUgc3BlY2lhbCBjaGFyYWN0ZXJzLFxuICAgICAgICAvLyBhbHRob3VnaCBzb21lIG9mIHRoZSBzcGVjaWFsIGNoYXJhY3RlcnMgYXJlIGFsbG93ZWQgdG8gc3RhcnQgaXQgKGFsbCBidXQgdGhlIGNvbG9uIGFuZCBjb21tYSkuXG4gICAgICAgIC8vIFRoZSB0ZXh0IGNhbiBjb250YWluIHNwYWNlcywgYnV0IGxlYWRpbmcgb3IgdHJhaWxpbmcgc3BhY2VzIGFyZSBza2lwcGVkLlxuICAgICAgICBldmVyeVRoaW5nRWxzZSA9ICdbXlxcXFxzOiwvXVteJyArIHNwZWNpYWxzICsgJ10qW15cXFxccycgKyBzcGVjaWFscyArICddJyxcbiAgICAgICAgLy8gTWF0Y2ggYW55IG5vbi1zcGFjZSBjaGFyYWN0ZXIgbm90IG1hdGNoZWQgYWxyZWFkeS4gVGhpcyB3aWxsIG1hdGNoIGNvbG9ucyBhbmQgY29tbWFzLCBzaW5jZSB0aGV5J3JlXG4gICAgICAgIC8vIG5vdCBtYXRjaGVkIGJ5IFwiZXZlcnlUaGluZ0Vsc2VcIiwgYnV0IHdpbGwgYWxzbyBtYXRjaCBhbnkgb3RoZXIgc2luZ2xlIGNoYXJhY3RlciB0aGF0IHdhc24ndCBhbHJlYWR5XG4gICAgICAgIC8vIG1hdGNoZWQgKGZvciBleGFtcGxlOiBpbiBcImE6IDEsIGI6IDJcIiwgZWFjaCBvZiB0aGUgbm9uLXNwYWNlIGNoYXJhY3RlcnMgd2lsbCBiZSBtYXRjaGVkIGJ5IG9uZU5vdFNwYWNlKS5cbiAgICAgICAgb25lTm90U3BhY2UgPSAnW15cXFxcc10nLFxuXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgYWN0dWFsIHJlZ3VsYXIgZXhwcmVzc2lvbiBieSBvci1pbmcgdGhlIGFib3ZlIHN0cmluZ3MuIFRoZSBvcmRlciBpcyBpbXBvcnRhbnQuXG4gICAgICAgIGJpbmRpbmdUb2tlbiA9IFJlZ0V4cChzdHJpbmdEb3VibGUgKyAnfCcgKyBzdHJpbmdTaW5nbGUgKyAnfCcgKyBzdHJpbmdSZWdleHAgKyAnfCcgKyBldmVyeVRoaW5nRWxzZSArICd8JyArIG9uZU5vdFNwYWNlLCAnZycpLFxuXG4gICAgICAgIC8vIE1hdGNoIGVuZCBvZiBwcmV2aW91cyB0b2tlbiB0byBkZXRlcm1pbmUgd2hldGhlciBhIHNsYXNoIGlzIGEgZGl2aXNpb24gb3IgcmVnZXguXG4gICAgICAgIGRpdmlzaW9uTG9va0JlaGluZCA9IC9bXFxdKVwiJ0EtWmEtejAtOV8kXSskLyxcbiAgICAgICAga2V5d29yZFJlZ2V4TG9va0JlaGluZCA9IHsnaW4nOjEsJ3JldHVybic6MSwndHlwZW9mJzoxfTtcblxuICAgIGZ1bmN0aW9uIHBhcnNlT2JqZWN0TGl0ZXJhbChvYmplY3RMaXRlcmFsU3RyaW5nKSB7XG4gICAgICAgIC8vIFRyaW0gbGVhZGluZyBhbmQgdHJhaWxpbmcgc3BhY2VzIGZyb20gdGhlIHN0cmluZ1xuICAgICAgICB2YXIgc3RyID0ga28udXRpbHMuc3RyaW5nVHJpbShvYmplY3RMaXRlcmFsU3RyaW5nKTtcblxuICAgICAgICAvLyBUcmltIGJyYWNlcyAneycgc3Vycm91bmRpbmcgdGhlIHdob2xlIG9iamVjdCBsaXRlcmFsXG4gICAgICAgIGlmIChzdHIuY2hhckNvZGVBdCgwKSA9PT0gMTIzKSBzdHIgPSBzdHIuc2xpY2UoMSwgLTEpO1xuXG4gICAgICAgIC8vIFNwbGl0IGludG8gdG9rZW5zXG4gICAgICAgIHZhciByZXN1bHQgPSBbXSwgdG9rcyA9IHN0ci5tYXRjaChiaW5kaW5nVG9rZW4pLCBrZXksIHZhbHVlcywgZGVwdGggPSAwO1xuXG4gICAgICAgIGlmICh0b2tzKSB7XG4gICAgICAgICAgICAvLyBBcHBlbmQgYSBjb21tYSBzbyB0aGF0IHdlIGRvbid0IG5lZWQgYSBzZXBhcmF0ZSBjb2RlIGJsb2NrIHRvIGRlYWwgd2l0aCB0aGUgbGFzdCBpdGVtXG4gICAgICAgICAgICB0b2tzLnB1c2goJywnKTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIHRvazsgdG9rID0gdG9rc1tpXTsgKytpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGMgPSB0b2suY2hhckNvZGVBdCgwKTtcbiAgICAgICAgICAgICAgICAvLyBBIGNvbW1hIHNpZ25hbHMgdGhlIGVuZCBvZiBhIGtleS92YWx1ZSBwYWlyIGlmIGRlcHRoIGlzIHplcm9cbiAgICAgICAgICAgICAgICBpZiAoYyA9PT0gNDQpIHsgLy8gXCIsXCJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlcHRoIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godmFsdWVzID8ge2tleToga2V5LCB2YWx1ZTogdmFsdWVzLmpvaW4oJycpfSA6IHsndW5rbm93bic6IGtleX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5ID0gdmFsdWVzID0gZGVwdGggPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBTaW1wbHkgc2tpcCB0aGUgY29sb24gdGhhdCBzZXBhcmF0ZXMgdGhlIG5hbWUgYW5kIHZhbHVlXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjID09PSA1OCkgeyAvLyBcIjpcIlxuICAgICAgICAgICAgICAgICAgICBpZiAoIXZhbHVlcylcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIC8vIEEgc2V0IG9mIHNsYXNoZXMgaXMgaW5pdGlhbGx5IG1hdGNoZWQgYXMgYSByZWd1bGFyIGV4cHJlc3Npb24sIGJ1dCBjb3VsZCBiZSBkaXZpc2lvblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gNDcgJiYgaSAmJiB0b2subGVuZ3RoID4gMSkgeyAgLy8gXCIvXCJcbiAgICAgICAgICAgICAgICAgICAgLy8gTG9vayBhdCB0aGUgZW5kIG9mIHRoZSBwcmV2aW91cyB0b2tlbiB0byBkZXRlcm1pbmUgaWYgdGhlIHNsYXNoIGlzIGFjdHVhbGx5IGRpdmlzaW9uXG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXRjaCA9IHRva3NbaS0xXS5tYXRjaChkaXZpc2lvbkxvb2tCZWhpbmQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2ggJiYgIWtleXdvcmRSZWdleExvb2tCZWhpbmRbbWF0Y2hbMF1dKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgc2xhc2ggaXMgYWN0dWFsbHkgYSBkaXZpc2lvbiBwdW5jdHVhdG9yOyByZS1wYXJzZSB0aGUgcmVtYWluZGVyIG9mIHRoZSBzdHJpbmcgKG5vdCBpbmNsdWRpbmcgdGhlIHNsYXNoKVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyID0gc3RyLnN1YnN0cihzdHIuaW5kZXhPZih0b2spICsgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tzID0gc3RyLm1hdGNoKGJpbmRpbmdUb2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tzLnB1c2goJywnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvbnRpbnVlIHdpdGgganVzdCB0aGUgc2xhc2hcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvayA9ICcvJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIEluY3JlbWVudCBkZXB0aCBmb3IgcGFyZW50aGVzZXMsIGJyYWNlcywgYW5kIGJyYWNrZXRzIHNvIHRoYXQgaW50ZXJpb3IgY29tbWFzIGFyZSBpZ25vcmVkXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjID09PSA0MCB8fCBjID09PSAxMjMgfHwgYyA9PT0gOTEpIHsgLy8gJygnLCAneycsICdbJ1xuICAgICAgICAgICAgICAgICAgICArK2RlcHRoO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gNDEgfHwgYyA9PT0gMTI1IHx8IGMgPT09IDkzKSB7IC8vICcpJywgJ30nLCAnXSdcbiAgICAgICAgICAgICAgICAgICAgLS1kZXB0aDtcbiAgICAgICAgICAgICAgICAvLyBUaGUga2V5IG11c3QgYmUgYSBzaW5nbGUgdG9rZW47IGlmIGl0J3MgYSBzdHJpbmcsIHRyaW0gdGhlIHF1b3Rlc1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIWtleSAmJiAhdmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGtleSA9IChjID09PSAzNCB8fCBjID09PSAzOSkgLyogJ1wiJywgXCInXCIgKi8gPyB0b2suc2xpY2UoMSwgLTEpIDogdG9rO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlcylcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzLnB1c2godG9rKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlcyA9IFt0b2tdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLy8gVHdvLXdheSBiaW5kaW5ncyBpbmNsdWRlIGEgd3JpdGUgZnVuY3Rpb24gdGhhdCBhbGxvdyB0aGUgaGFuZGxlciB0byB1cGRhdGUgdGhlIHZhbHVlIGV2ZW4gaWYgaXQncyBub3QgYW4gb2JzZXJ2YWJsZS5cbiAgICB2YXIgdHdvV2F5QmluZGluZ3MgPSB7fTtcblxuICAgIGZ1bmN0aW9uIHByZVByb2Nlc3NCaW5kaW5ncyhiaW5kaW5nc1N0cmluZ09yS2V5VmFsdWVBcnJheSwgYmluZGluZ09wdGlvbnMpIHtcbiAgICAgICAgYmluZGluZ09wdGlvbnMgPSBiaW5kaW5nT3B0aW9ucyB8fCB7fTtcblxuICAgICAgICBmdW5jdGlvbiBwcm9jZXNzS2V5VmFsdWUoa2V5LCB2YWwpIHtcbiAgICAgICAgICAgIHZhciB3cml0YWJsZVZhbDtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNhbGxQcmVwcm9jZXNzSG9vayhvYmopIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKG9iaiAmJiBvYmpbJ3ByZXByb2Nlc3MnXSkgPyAodmFsID0gb2JqWydwcmVwcm9jZXNzJ10odmFsLCBrZXksIHByb2Nlc3NLZXlWYWx1ZSkpIDogdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghYmluZGluZ1BhcmFtcykge1xuICAgICAgICAgICAgICAgIGlmICghY2FsbFByZXByb2Nlc3NIb29rKGtvWydnZXRCaW5kaW5nSGFuZGxlciddKGtleSkpKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgICAgICBpZiAodHdvV2F5QmluZGluZ3Nba2V5XSAmJiAod3JpdGFibGVWYWwgPSBnZXRXcml0ZWFibGVWYWx1ZSh2YWwpKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBGb3IgdHdvLXdheSBiaW5kaW5ncywgcHJvdmlkZSBhIHdyaXRlIG1ldGhvZCBpbiBjYXNlIHRoZSB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAvLyBpc24ndCBhIHdyaXRhYmxlIG9ic2VydmFibGUuXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5QWNjZXNzb3JSZXN1bHRTdHJpbmdzLnB1c2goXCInXCIgKyBrZXkgKyBcIic6ZnVuY3Rpb24oX3ope1wiICsgd3JpdGFibGVWYWwgKyBcIj1fen1cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gVmFsdWVzIGFyZSB3cmFwcGVkIGluIGEgZnVuY3Rpb24gc28gdGhhdCBlYWNoIHZhbHVlIGNhbiBiZSBhY2Nlc3NlZCBpbmRlcGVuZGVudGx5XG4gICAgICAgICAgICBpZiAobWFrZVZhbHVlQWNjZXNzb3JzKSB7XG4gICAgICAgICAgICAgICAgdmFsID0gJ2Z1bmN0aW9uKCl7cmV0dXJuICcgKyB2YWwgKyAnIH0nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzdWx0U3RyaW5ncy5wdXNoKFwiJ1wiICsga2V5ICsgXCInOlwiICsgdmFsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZXN1bHRTdHJpbmdzID0gW10sXG4gICAgICAgICAgICBwcm9wZXJ0eUFjY2Vzc29yUmVzdWx0U3RyaW5ncyA9IFtdLFxuICAgICAgICAgICAgbWFrZVZhbHVlQWNjZXNzb3JzID0gYmluZGluZ09wdGlvbnNbJ3ZhbHVlQWNjZXNzb3JzJ10sXG4gICAgICAgICAgICBiaW5kaW5nUGFyYW1zID0gYmluZGluZ09wdGlvbnNbJ2JpbmRpbmdQYXJhbXMnXSxcbiAgICAgICAgICAgIGtleVZhbHVlQXJyYXkgPSB0eXBlb2YgYmluZGluZ3NTdHJpbmdPcktleVZhbHVlQXJyYXkgPT09IFwic3RyaW5nXCIgP1xuICAgICAgICAgICAgICAgIHBhcnNlT2JqZWN0TGl0ZXJhbChiaW5kaW5nc1N0cmluZ09yS2V5VmFsdWVBcnJheSkgOiBiaW5kaW5nc1N0cmluZ09yS2V5VmFsdWVBcnJheTtcblxuICAgICAgICBrby51dGlscy5hcnJheUZvckVhY2goa2V5VmFsdWVBcnJheSwgZnVuY3Rpb24oa2V5VmFsdWUpIHtcbiAgICAgICAgICAgIHByb2Nlc3NLZXlWYWx1ZShrZXlWYWx1ZS5rZXkgfHwga2V5VmFsdWVbJ3Vua25vd24nXSwga2V5VmFsdWUudmFsdWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAocHJvcGVydHlBY2Nlc3NvclJlc3VsdFN0cmluZ3MubGVuZ3RoKVxuICAgICAgICAgICAgcHJvY2Vzc0tleVZhbHVlKCdfa29fcHJvcGVydHlfd3JpdGVycycsIFwie1wiICsgcHJvcGVydHlBY2Nlc3NvclJlc3VsdFN0cmluZ3Muam9pbihcIixcIikgKyBcIiB9XCIpO1xuXG4gICAgICAgIHJldHVybiByZXN1bHRTdHJpbmdzLmpvaW4oXCIsXCIpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGJpbmRpbmdSZXdyaXRlVmFsaWRhdG9yczogW10sXG5cbiAgICAgICAgdHdvV2F5QmluZGluZ3M6IHR3b1dheUJpbmRpbmdzLFxuXG4gICAgICAgIHBhcnNlT2JqZWN0TGl0ZXJhbDogcGFyc2VPYmplY3RMaXRlcmFsLFxuXG4gICAgICAgIHByZVByb2Nlc3NCaW5kaW5nczogcHJlUHJvY2Vzc0JpbmRpbmdzLFxuXG4gICAgICAgIGtleVZhbHVlQXJyYXlDb250YWluc0tleTogZnVuY3Rpb24oa2V5VmFsdWVBcnJheSwga2V5KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleVZhbHVlQXJyYXkubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICAgICAgaWYgKGtleVZhbHVlQXJyYXlbaV1bJ2tleSddID09IGtleSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gSW50ZXJuYWwsIHByaXZhdGUgS08gdXRpbGl0eSBmb3IgdXBkYXRpbmcgbW9kZWwgcHJvcGVydGllcyBmcm9tIHdpdGhpbiBiaW5kaW5nc1xuICAgICAgICAvLyBwcm9wZXJ0eTogICAgICAgICAgICBJZiB0aGUgcHJvcGVydHkgYmVpbmcgdXBkYXRlZCBpcyAob3IgbWlnaHQgYmUpIGFuIG9ic2VydmFibGUsIHBhc3MgaXQgaGVyZVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICBJZiBpdCB0dXJucyBvdXQgdG8gYmUgYSB3cml0YWJsZSBvYnNlcnZhYmxlLCBpdCB3aWxsIGJlIHdyaXR0ZW4gdG8gZGlyZWN0bHlcbiAgICAgICAgLy8gYWxsQmluZGluZ3M6ICAgICAgICAgQW4gb2JqZWN0IHdpdGggYSBnZXQgbWV0aG9kIHRvIHJldHJpZXZlIGJpbmRpbmdzIGluIHRoZSBjdXJyZW50IGV4ZWN1dGlvbiBjb250ZXh0LlxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICBUaGlzIHdpbGwgYmUgc2VhcmNoZWQgZm9yIGEgJ19rb19wcm9wZXJ0eV93cml0ZXJzJyBwcm9wZXJ0eSBpbiBjYXNlIHlvdSdyZSB3cml0aW5nIHRvIGEgbm9uLW9ic2VydmFibGVcbiAgICAgICAgLy8ga2V5OiAgICAgICAgICAgICAgICAgVGhlIGtleSBpZGVudGlmeWluZyB0aGUgcHJvcGVydHkgdG8gYmUgd3JpdHRlbi4gRXhhbXBsZTogZm9yIHsgaGFzRm9jdXM6IG15VmFsdWUgfSwgd3JpdGUgdG8gJ215VmFsdWUnIGJ5IHNwZWNpZnlpbmcgdGhlIGtleSAnaGFzRm9jdXMnXG4gICAgICAgIC8vIHZhbHVlOiAgICAgICAgICAgICAgIFRoZSB2YWx1ZSB0byBiZSB3cml0dGVuXG4gICAgICAgIC8vIGNoZWNrSWZEaWZmZXJlbnQ6ICAgIElmIHRydWUsIGFuZCBpZiB0aGUgcHJvcGVydHkgYmVpbmcgd3JpdHRlbiBpcyBhIHdyaXRhYmxlIG9ic2VydmFibGUsIHRoZSB2YWx1ZSB3aWxsIG9ubHkgYmUgd3JpdHRlbiBpZlxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICBpdCBpcyAhPT0gZXhpc3RpbmcgdmFsdWUgb24gdGhhdCB3cml0YWJsZSBvYnNlcnZhYmxlXG4gICAgICAgIHdyaXRlVmFsdWVUb1Byb3BlcnR5OiBmdW5jdGlvbihwcm9wZXJ0eSwgYWxsQmluZGluZ3MsIGtleSwgdmFsdWUsIGNoZWNrSWZEaWZmZXJlbnQpIHtcbiAgICAgICAgICAgIGlmICghcHJvcGVydHkgfHwgIWtvLmlzT2JzZXJ2YWJsZShwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcHJvcFdyaXRlcnMgPSBhbGxCaW5kaW5ncy5nZXQoJ19rb19wcm9wZXJ0eV93cml0ZXJzJyk7XG4gICAgICAgICAgICAgICAgaWYgKHByb3BXcml0ZXJzICYmIHByb3BXcml0ZXJzW2tleV0pXG4gICAgICAgICAgICAgICAgICAgIHByb3BXcml0ZXJzW2tleV0odmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChrby5pc1dyaXRlYWJsZU9ic2VydmFibGUocHJvcGVydHkpICYmICghY2hlY2tJZkRpZmZlcmVudCB8fCBwcm9wZXJ0eS5wZWVrKCkgIT09IHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHByb3BlcnR5KHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuXG5rby5leHBvcnRTeW1ib2woJ2V4cHJlc3Npb25SZXdyaXRpbmcnLCBrby5leHByZXNzaW9uUmV3cml0aW5nKTtcbmtvLmV4cG9ydFN5bWJvbCgnZXhwcmVzc2lvblJld3JpdGluZy5iaW5kaW5nUmV3cml0ZVZhbGlkYXRvcnMnLCBrby5leHByZXNzaW9uUmV3cml0aW5nLmJpbmRpbmdSZXdyaXRlVmFsaWRhdG9ycyk7XG5rby5leHBvcnRTeW1ib2woJ2V4cHJlc3Npb25SZXdyaXRpbmcucGFyc2VPYmplY3RMaXRlcmFsJywga28uZXhwcmVzc2lvblJld3JpdGluZy5wYXJzZU9iamVjdExpdGVyYWwpO1xua28uZXhwb3J0U3ltYm9sKCdleHByZXNzaW9uUmV3cml0aW5nLnByZVByb2Nlc3NCaW5kaW5ncycsIGtvLmV4cHJlc3Npb25SZXdyaXRpbmcucHJlUHJvY2Vzc0JpbmRpbmdzKTtcblxuLy8gTWFraW5nIGJpbmRpbmdzIGV4cGxpY2l0bHkgZGVjbGFyZSB0aGVtc2VsdmVzIGFzIFwidHdvIHdheVwiIGlzbid0IGlkZWFsIGluIHRoZSBsb25nIHRlcm0gKGl0IHdvdWxkIGJlIGJldHRlciBpZlxuLy8gYWxsIGJpbmRpbmdzIGNvdWxkIHVzZSBhbiBvZmZpY2lhbCAncHJvcGVydHkgd3JpdGVyJyBBUEkgd2l0aG91dCBuZWVkaW5nIHRvIGRlY2xhcmUgdGhhdCB0aGV5IG1pZ2h0KS4gSG93ZXZlcixcbi8vIHNpbmNlIHRoaXMgaXMgbm90LCBhbmQgaGFzIG5ldmVyIGJlZW4sIGEgcHVibGljIEFQSSAoX2tvX3Byb3BlcnR5X3dyaXRlcnMgd2FzIG5ldmVyIGRvY3VtZW50ZWQpLCBpdCdzIGFjY2VwdGFibGVcbi8vIGFzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCBpbiB0aGUgc2hvcnQgdGVybS5cbi8vIEZvciB0aG9zZSBkZXZlbG9wZXJzIHdobyByZWx5IG9uIF9rb19wcm9wZXJ0eV93cml0ZXJzIGluIHRoZWlyIGN1c3RvbSBiaW5kaW5ncywgd2UgZXhwb3NlIF90d29XYXlCaW5kaW5ncyBhcyBhblxuLy8gdW5kb2N1bWVudGVkIGZlYXR1cmUgdGhhdCBtYWtlcyBpdCByZWxhdGl2ZWx5IGVhc3kgdG8gdXBncmFkZSB0byBLTyAzLjAuIEhvd2V2ZXIsIHRoaXMgaXMgc3RpbGwgbm90IGFuIG9mZmljaWFsXG4vLyBwdWJsaWMgQVBJLCBhbmQgd2UgcmVzZXJ2ZSB0aGUgcmlnaHQgdG8gcmVtb3ZlIGl0IGF0IGFueSB0aW1lIGlmIHdlIGNyZWF0ZSBhIHJlYWwgcHVibGljIHByb3BlcnR5IHdyaXRlcnMgQVBJLlxua28uZXhwb3J0U3ltYm9sKCdleHByZXNzaW9uUmV3cml0aW5nLl90d29XYXlCaW5kaW5ncycsIGtvLmV4cHJlc3Npb25SZXdyaXRpbmcudHdvV2F5QmluZGluZ3MpO1xuXG4vLyBGb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSwgZGVmaW5lIHRoZSBmb2xsb3dpbmcgYWxpYXNlcy4gKFByZXZpb3VzbHksIHRoZXNlIGZ1bmN0aW9uIG5hbWVzIHdlcmUgbWlzbGVhZGluZyBiZWNhdXNlXG4vLyB0aGV5IHJlZmVycmVkIHRvIEpTT04gc3BlY2lmaWNhbGx5LCBldmVuIHRob3VnaCB0aGV5IGFjdHVhbGx5IHdvcmsgd2l0aCBhcmJpdHJhcnkgSmF2YVNjcmlwdCBvYmplY3QgbGl0ZXJhbCBleHByZXNzaW9ucy4pXG5rby5leHBvcnRTeW1ib2woJ2pzb25FeHByZXNzaW9uUmV3cml0aW5nJywga28uZXhwcmVzc2lvblJld3JpdGluZyk7XG5rby5leHBvcnRTeW1ib2woJ2pzb25FeHByZXNzaW9uUmV3cml0aW5nLmluc2VydFByb3BlcnR5QWNjZXNzb3JzSW50b0pzb24nLCBrby5leHByZXNzaW9uUmV3cml0aW5nLnByZVByb2Nlc3NCaW5kaW5ncyk7XG4oZnVuY3Rpb24oKSB7XG4gICAgLy8gXCJWaXJ0dWFsIGVsZW1lbnRzXCIgaXMgYW4gYWJzdHJhY3Rpb24gb24gdG9wIG9mIHRoZSB1c3VhbCBET00gQVBJIHdoaWNoIHVuZGVyc3RhbmRzIHRoZSBub3Rpb24gdGhhdCBjb21tZW50IG5vZGVzXG4gICAgLy8gbWF5IGJlIHVzZWQgdG8gcmVwcmVzZW50IGhpZXJhcmNoeSAoaW4gYWRkaXRpb24gdG8gdGhlIERPTSdzIG5hdHVyYWwgaGllcmFyY2h5KS5cbiAgICAvLyBJZiB5b3UgY2FsbCB0aGUgRE9NLW1hbmlwdWxhdGluZyBmdW5jdGlvbnMgb24ga28udmlydHVhbEVsZW1lbnRzLCB5b3Ugd2lsbCBiZSBhYmxlIHRvIHJlYWQgYW5kIHdyaXRlIHRoZSBzdGF0ZVxuICAgIC8vIG9mIHRoYXQgdmlydHVhbCBoaWVyYXJjaHlcbiAgICAvL1xuICAgIC8vIFRoZSBwb2ludCBvZiBhbGwgdGhpcyBpcyB0byBzdXBwb3J0IGNvbnRhaW5lcmxlc3MgdGVtcGxhdGVzIChlLmcuLCA8IS0tIGtvIGZvcmVhY2g6c29tZUNvbGxlY3Rpb24gLS0+YmxhaDwhLS0gL2tvIC0tPilcbiAgICAvLyB3aXRob3V0IGhhdmluZyB0byBzY2F0dGVyIHNwZWNpYWwgY2FzZXMgYWxsIG92ZXIgdGhlIGJpbmRpbmcgYW5kIHRlbXBsYXRpbmcgY29kZS5cblxuICAgIC8vIElFIDkgY2Fubm90IHJlbGlhYmx5IHJlYWQgdGhlIFwibm9kZVZhbHVlXCIgcHJvcGVydHkgb2YgYSBjb21tZW50IG5vZGUgKHNlZSBodHRwczovL2dpdGh1Yi5jb20vU3RldmVTYW5kZXJzb24va25vY2tvdXQvaXNzdWVzLzE4NilcbiAgICAvLyBidXQgaXQgZG9lcyBnaXZlIHRoZW0gYSBub25zdGFuZGFyZCBhbHRlcm5hdGl2ZSBwcm9wZXJ0eSBjYWxsZWQgXCJ0ZXh0XCIgdGhhdCBpdCBjYW4gcmVhZCByZWxpYWJseS4gT3RoZXIgYnJvd3NlcnMgZG9uJ3QgaGF2ZSB0aGF0IHByb3BlcnR5LlxuICAgIC8vIFNvLCB1c2Ugbm9kZS50ZXh0IHdoZXJlIGF2YWlsYWJsZSwgYW5kIG5vZGUubm9kZVZhbHVlIGVsc2V3aGVyZVxuICAgIHZhciBjb21tZW50Tm9kZXNIYXZlVGV4dFByb3BlcnR5ID0gZG9jdW1lbnQgJiYgZG9jdW1lbnQuY3JlYXRlQ29tbWVudChcInRlc3RcIikudGV4dCA9PT0gXCI8IS0tdGVzdC0tPlwiO1xuXG4gICAgdmFyIHN0YXJ0Q29tbWVudFJlZ2V4ID0gY29tbWVudE5vZGVzSGF2ZVRleHRQcm9wZXJ0eSA/IC9ePCEtLVxccyprbyg/OlxccysoW1xcc1xcU10rKSk/XFxzKi0tPiQvIDogL15cXHMqa28oPzpcXHMrKFtcXHNcXFNdKykpP1xccyokLztcbiAgICB2YXIgZW5kQ29tbWVudFJlZ2V4ID0gICBjb21tZW50Tm9kZXNIYXZlVGV4dFByb3BlcnR5ID8gL148IS0tXFxzKlxcL2tvXFxzKi0tPiQvIDogL15cXHMqXFwva29cXHMqJC87XG4gICAgdmFyIGh0bWxUYWdzV2l0aE9wdGlvbmFsbHlDbG9zaW5nQ2hpbGRyZW4gPSB7ICd1bCc6IHRydWUsICdvbCc6IHRydWUgfTtcblxuICAgIGZ1bmN0aW9uIGlzU3RhcnRDb21tZW50KG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIChub2RlLm5vZGVUeXBlID09IDgpICYmIHN0YXJ0Q29tbWVudFJlZ2V4LnRlc3QoY29tbWVudE5vZGVzSGF2ZVRleHRQcm9wZXJ0eSA/IG5vZGUudGV4dCA6IG5vZGUubm9kZVZhbHVlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0VuZENvbW1lbnQobm9kZSkge1xuICAgICAgICByZXR1cm4gKG5vZGUubm9kZVR5cGUgPT0gOCkgJiYgZW5kQ29tbWVudFJlZ2V4LnRlc3QoY29tbWVudE5vZGVzSGF2ZVRleHRQcm9wZXJ0eSA/IG5vZGUudGV4dCA6IG5vZGUubm9kZVZhbHVlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRWaXJ0dWFsQ2hpbGRyZW4oc3RhcnRDb21tZW50LCBhbGxvd1VuYmFsYW5jZWQpIHtcbiAgICAgICAgdmFyIGN1cnJlbnROb2RlID0gc3RhcnRDb21tZW50O1xuICAgICAgICB2YXIgZGVwdGggPSAxO1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgd2hpbGUgKGN1cnJlbnROb2RlID0gY3VycmVudE5vZGUubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgICAgIGlmIChpc0VuZENvbW1lbnQoY3VycmVudE5vZGUpKSB7XG4gICAgICAgICAgICAgICAgZGVwdGgtLTtcbiAgICAgICAgICAgICAgICBpZiAoZGVwdGggPT09IDApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZHJlbjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChjdXJyZW50Tm9kZSk7XG5cbiAgICAgICAgICAgIGlmIChpc1N0YXJ0Q29tbWVudChjdXJyZW50Tm9kZSkpXG4gICAgICAgICAgICAgICAgZGVwdGgrKztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWFsbG93VW5iYWxhbmNlZClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIGNsb3NpbmcgY29tbWVudCB0YWcgdG8gbWF0Y2g6IFwiICsgc3RhcnRDb21tZW50Lm5vZGVWYWx1ZSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE1hdGNoaW5nRW5kQ29tbWVudChzdGFydENvbW1lbnQsIGFsbG93VW5iYWxhbmNlZCkge1xuICAgICAgICB2YXIgYWxsVmlydHVhbENoaWxkcmVuID0gZ2V0VmlydHVhbENoaWxkcmVuKHN0YXJ0Q29tbWVudCwgYWxsb3dVbmJhbGFuY2VkKTtcbiAgICAgICAgaWYgKGFsbFZpcnR1YWxDaGlsZHJlbikge1xuICAgICAgICAgICAgaWYgKGFsbFZpcnR1YWxDaGlsZHJlbi5sZW5ndGggPiAwKVxuICAgICAgICAgICAgICAgIHJldHVybiBhbGxWaXJ0dWFsQ2hpbGRyZW5bYWxsVmlydHVhbENoaWxkcmVuLmxlbmd0aCAtIDFdLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgcmV0dXJuIHN0YXJ0Q29tbWVudC5uZXh0U2libGluZztcbiAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICByZXR1cm4gbnVsbDsgLy8gTXVzdCBoYXZlIG5vIG1hdGNoaW5nIGVuZCBjb21tZW50LCBhbmQgYWxsb3dVbmJhbGFuY2VkIGlzIHRydWVcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRVbmJhbGFuY2VkQ2hpbGRUYWdzKG5vZGUpIHtcbiAgICAgICAgLy8gZS5nLiwgZnJvbSA8ZGl2Pk9LPC9kaXY+PCEtLSBrbyBibGFoIC0tPjxzcGFuPkFub3RoZXI8L3NwYW4+LCByZXR1cm5zOiA8IS0tIGtvIGJsYWggLS0+PHNwYW4+QW5vdGhlcjwvc3Bhbj5cbiAgICAgICAgLy8gICAgICAgZnJvbSA8ZGl2Pk9LPC9kaXY+PCEtLSAva28gLS0+PCEtLSAva28gLS0+LCAgICAgICAgICAgICByZXR1cm5zOiA8IS0tIC9rbyAtLT48IS0tIC9rbyAtLT5cbiAgICAgICAgdmFyIGNoaWxkTm9kZSA9IG5vZGUuZmlyc3RDaGlsZCwgY2FwdHVyZVJlbWFpbmluZyA9IG51bGw7XG4gICAgICAgIGlmIChjaGlsZE5vZGUpIHtcbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICBpZiAoY2FwdHVyZVJlbWFpbmluZykgICAgICAgICAgICAgICAgICAgLy8gV2UgYWxyZWFkeSBoaXQgYW4gdW5iYWxhbmNlZCBub2RlIGFuZCBhcmUgbm93IGp1c3Qgc2Nvb3BpbmcgdXAgYWxsIHN1YnNlcXVlbnQgbm9kZXNcbiAgICAgICAgICAgICAgICAgICAgY2FwdHVyZVJlbWFpbmluZy5wdXNoKGNoaWxkTm9kZSk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaXNTdGFydENvbW1lbnQoY2hpbGROb2RlKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWF0Y2hpbmdFbmRDb21tZW50ID0gZ2V0TWF0Y2hpbmdFbmRDb21tZW50KGNoaWxkTm9kZSwgLyogYWxsb3dVbmJhbGFuY2VkOiAqLyB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoaW5nRW5kQ29tbWVudCkgICAgICAgICAgICAgLy8gSXQncyBhIGJhbGFuY2VkIHRhZywgc28gc2tpcCBpbW1lZGlhdGVseSB0byB0aGUgZW5kIG9mIHRoaXMgdmlydHVhbCBzZXRcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkTm9kZSA9IG1hdGNoaW5nRW5kQ29tbWVudDtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FwdHVyZVJlbWFpbmluZyA9IFtjaGlsZE5vZGVdOyAvLyBJdCdzIHVuYmFsYW5jZWQsIHNvIHN0YXJ0IGNhcHR1cmluZyBmcm9tIHRoaXMgcG9pbnRcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlzRW5kQ29tbWVudChjaGlsZE5vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhcHR1cmVSZW1haW5pbmcgPSBbY2hpbGROb2RlXTsgICAgIC8vIEl0J3MgdW5iYWxhbmNlZCAoaWYgaXQgd2Fzbid0LCB3ZSdkIGhhdmUgc2tpcHBlZCBvdmVyIGl0IGFscmVhZHkpLCBzbyBzdGFydCBjYXB0dXJpbmdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IHdoaWxlIChjaGlsZE5vZGUgPSBjaGlsZE5vZGUubmV4dFNpYmxpbmcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYXB0dXJlUmVtYWluaW5nO1xuICAgIH1cblxuICAgIGtvLnZpcnR1YWxFbGVtZW50cyA9IHtcbiAgICAgICAgYWxsb3dlZEJpbmRpbmdzOiB7fSxcblxuICAgICAgICBjaGlsZE5vZGVzOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNTdGFydENvbW1lbnQobm9kZSkgPyBnZXRWaXJ0dWFsQ2hpbGRyZW4obm9kZSkgOiBub2RlLmNoaWxkTm9kZXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZW1wdHlOb2RlOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICBpZiAoIWlzU3RhcnRDb21tZW50KG5vZGUpKVxuICAgICAgICAgICAgICAgIGtvLnV0aWxzLmVtcHR5RG9tTm9kZShub2RlKTtcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciB2aXJ0dWFsQ2hpbGRyZW4gPSBrby52aXJ0dWFsRWxlbWVudHMuY2hpbGROb2Rlcyhub2RlKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IHZpcnR1YWxDaGlsZHJlbi5sZW5ndGg7IGkgPCBqOyBpKyspXG4gICAgICAgICAgICAgICAgICAgIGtvLnJlbW92ZU5vZGUodmlydHVhbENoaWxkcmVuW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBzZXREb21Ob2RlQ2hpbGRyZW46IGZ1bmN0aW9uKG5vZGUsIGNoaWxkTm9kZXMpIHtcbiAgICAgICAgICAgIGlmICghaXNTdGFydENvbW1lbnQobm9kZSkpXG4gICAgICAgICAgICAgICAga28udXRpbHMuc2V0RG9tTm9kZUNoaWxkcmVuKG5vZGUsIGNoaWxkTm9kZXMpO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAga28udmlydHVhbEVsZW1lbnRzLmVtcHR5Tm9kZShub2RlKTtcbiAgICAgICAgICAgICAgICB2YXIgZW5kQ29tbWVudE5vZGUgPSBub2RlLm5leHRTaWJsaW5nOyAvLyBNdXN0IGJlIHRoZSBuZXh0IHNpYmxpbmcsIGFzIHdlIGp1c3QgZW1wdGllZCB0aGUgY2hpbGRyZW5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IGNoaWxkTm9kZXMubGVuZ3RoOyBpIDwgajsgaSsrKVxuICAgICAgICAgICAgICAgICAgICBlbmRDb21tZW50Tm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShjaGlsZE5vZGVzW2ldLCBlbmRDb21tZW50Tm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcHJlcGVuZDogZnVuY3Rpb24oY29udGFpbmVyTm9kZSwgbm9kZVRvUHJlcGVuZCkge1xuICAgICAgICAgICAgaWYgKCFpc1N0YXJ0Q29tbWVudChjb250YWluZXJOb2RlKSkge1xuICAgICAgICAgICAgICAgIGlmIChjb250YWluZXJOb2RlLmZpcnN0Q2hpbGQpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lck5vZGUuaW5zZXJ0QmVmb3JlKG5vZGVUb1ByZXBlbmQsIGNvbnRhaW5lck5vZGUuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBjb250YWluZXJOb2RlLmFwcGVuZENoaWxkKG5vZGVUb1ByZXBlbmQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBTdGFydCBjb21tZW50cyBtdXN0IGFsd2F5cyBoYXZlIGEgcGFyZW50IGFuZCBhdCBsZWFzdCBvbmUgZm9sbG93aW5nIHNpYmxpbmcgKHRoZSBlbmQgY29tbWVudClcbiAgICAgICAgICAgICAgICBjb250YWluZXJOb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGVUb1ByZXBlbmQsIGNvbnRhaW5lck5vZGUubmV4dFNpYmxpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGluc2VydEFmdGVyOiBmdW5jdGlvbihjb250YWluZXJOb2RlLCBub2RlVG9JbnNlcnQsIGluc2VydEFmdGVyTm9kZSkge1xuICAgICAgICAgICAgaWYgKCFpbnNlcnRBZnRlck5vZGUpIHtcbiAgICAgICAgICAgICAgICBrby52aXJ0dWFsRWxlbWVudHMucHJlcGVuZChjb250YWluZXJOb2RlLCBub2RlVG9JbnNlcnQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghaXNTdGFydENvbW1lbnQoY29udGFpbmVyTm9kZSkpIHtcbiAgICAgICAgICAgICAgICAvLyBJbnNlcnQgYWZ0ZXIgaW5zZXJ0aW9uIHBvaW50XG4gICAgICAgICAgICAgICAgaWYgKGluc2VydEFmdGVyTm9kZS5uZXh0U2libGluZylcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyTm9kZS5pbnNlcnRCZWZvcmUobm9kZVRvSW5zZXJ0LCBpbnNlcnRBZnRlck5vZGUubmV4dFNpYmxpbmcpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyTm9kZS5hcHBlbmRDaGlsZChub2RlVG9JbnNlcnQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBDaGlsZHJlbiBvZiBzdGFydCBjb21tZW50cyBtdXN0IGFsd2F5cyBoYXZlIGEgcGFyZW50IGFuZCBhdCBsZWFzdCBvbmUgZm9sbG93aW5nIHNpYmxpbmcgKHRoZSBlbmQgY29tbWVudClcbiAgICAgICAgICAgICAgICBjb250YWluZXJOb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGVUb0luc2VydCwgaW5zZXJ0QWZ0ZXJOb2RlLm5leHRTaWJsaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBmaXJzdENoaWxkOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICBpZiAoIWlzU3RhcnRDb21tZW50KG5vZGUpKVxuICAgICAgICAgICAgICAgIHJldHVybiBub2RlLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICBpZiAoIW5vZGUubmV4dFNpYmxpbmcgfHwgaXNFbmRDb21tZW50KG5vZGUubmV4dFNpYmxpbmcpKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUubmV4dFNpYmxpbmc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbmV4dFNpYmxpbmc6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgIGlmIChpc1N0YXJ0Q29tbWVudChub2RlKSlcbiAgICAgICAgICAgICAgICBub2RlID0gZ2V0TWF0Y2hpbmdFbmRDb21tZW50KG5vZGUpO1xuICAgICAgICAgICAgaWYgKG5vZGUubmV4dFNpYmxpbmcgJiYgaXNFbmRDb21tZW50KG5vZGUubmV4dFNpYmxpbmcpKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUubmV4dFNpYmxpbmc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaGFzQmluZGluZ1ZhbHVlOiBpc1N0YXJ0Q29tbWVudCxcblxuICAgICAgICB2aXJ0dWFsTm9kZUJpbmRpbmdWYWx1ZTogZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgdmFyIHJlZ2V4TWF0Y2ggPSAoY29tbWVudE5vZGVzSGF2ZVRleHRQcm9wZXJ0eSA/IG5vZGUudGV4dCA6IG5vZGUubm9kZVZhbHVlKS5tYXRjaChzdGFydENvbW1lbnRSZWdleCk7XG4gICAgICAgICAgICByZXR1cm4gcmVnZXhNYXRjaCA/IHJlZ2V4TWF0Y2hbMV0gOiBudWxsO1xuICAgICAgICB9LFxuXG4gICAgICAgIG5vcm1hbGlzZVZpcnR1YWxFbGVtZW50RG9tU3RydWN0dXJlOiBmdW5jdGlvbihlbGVtZW50VmVyaWZpZWQpIHtcbiAgICAgICAgICAgIC8vIFdvcmthcm91bmQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9TdGV2ZVNhbmRlcnNvbi9rbm9ja291dC9pc3N1ZXMvMTU1XG4gICAgICAgICAgICAvLyAoSUUgPD0gOCBvciBJRSA5IHF1aXJrcyBtb2RlIHBhcnNlcyB5b3VyIEhUTUwgd2VpcmRseSwgdHJlYXRpbmcgY2xvc2luZyA8L2xpPiB0YWdzIGFzIGlmIHRoZXkgZG9uJ3QgZXhpc3QsIHRoZXJlYnkgbW92aW5nIGNvbW1lbnQgbm9kZXNcbiAgICAgICAgICAgIC8vIHRoYXQgYXJlIGRpcmVjdCBkZXNjZW5kYW50cyBvZiA8dWw+IGludG8gdGhlIHByZWNlZGluZyA8bGk+KVxuICAgICAgICAgICAgaWYgKCFodG1sVGFnc1dpdGhPcHRpb25hbGx5Q2xvc2luZ0NoaWxkcmVuW2tvLnV0aWxzLnRhZ05hbWVMb3dlcihlbGVtZW50VmVyaWZpZWQpXSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgIC8vIFNjYW4gaW1tZWRpYXRlIGNoaWxkcmVuIHRvIHNlZSBpZiB0aGV5IGNvbnRhaW4gdW5iYWxhbmNlZCBjb21tZW50IHRhZ3MuIElmIHRoZXkgZG8sIHRob3NlIGNvbW1lbnQgdGFnc1xuICAgICAgICAgICAgLy8gbXVzdCBiZSBpbnRlbmRlZCB0byBhcHBlYXIgKmFmdGVyKiB0aGF0IGNoaWxkLCBzbyBtb3ZlIHRoZW0gdGhlcmUuXG4gICAgICAgICAgICB2YXIgY2hpbGROb2RlID0gZWxlbWVudFZlcmlmaWVkLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICBpZiAoY2hpbGROb2RlKSB7XG4gICAgICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGROb2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdW5iYWxhbmNlZFRhZ3MgPSBnZXRVbmJhbGFuY2VkQ2hpbGRUYWdzKGNoaWxkTm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodW5iYWxhbmNlZFRhZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGaXggdXAgdGhlIERPTSBieSBtb3ZpbmcgdGhlIHVuYmFsYW5jZWQgdGFncyB0byB3aGVyZSB0aGV5IG1vc3QgbGlrZWx5IHdlcmUgaW50ZW5kZWQgdG8gYmUgcGxhY2VkIC0gKmFmdGVyKiB0aGUgY2hpbGRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbm9kZVRvSW5zZXJ0QmVmb3JlID0gY2hpbGROb2RlLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdW5iYWxhbmNlZFRhZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGVUb0luc2VydEJlZm9yZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRWZXJpZmllZC5pbnNlcnRCZWZvcmUodW5iYWxhbmNlZFRhZ3NbaV0sIG5vZGVUb0luc2VydEJlZm9yZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRWZXJpZmllZC5hcHBlbmRDaGlsZCh1bmJhbGFuY2VkVGFnc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSB3aGlsZSAoY2hpbGROb2RlID0gY2hpbGROb2RlLm5leHRTaWJsaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xua28uZXhwb3J0U3ltYm9sKCd2aXJ0dWFsRWxlbWVudHMnLCBrby52aXJ0dWFsRWxlbWVudHMpO1xua28uZXhwb3J0U3ltYm9sKCd2aXJ0dWFsRWxlbWVudHMuYWxsb3dlZEJpbmRpbmdzJywga28udmlydHVhbEVsZW1lbnRzLmFsbG93ZWRCaW5kaW5ncyk7XG5rby5leHBvcnRTeW1ib2woJ3ZpcnR1YWxFbGVtZW50cy5lbXB0eU5vZGUnLCBrby52aXJ0dWFsRWxlbWVudHMuZW1wdHlOb2RlKTtcbi8va28uZXhwb3J0U3ltYm9sKCd2aXJ0dWFsRWxlbWVudHMuZmlyc3RDaGlsZCcsIGtvLnZpcnR1YWxFbGVtZW50cy5maXJzdENoaWxkKTsgICAgIC8vIGZpcnN0Q2hpbGQgaXMgbm90IG1pbmlmaWVkXG5rby5leHBvcnRTeW1ib2woJ3ZpcnR1YWxFbGVtZW50cy5pbnNlcnRBZnRlcicsIGtvLnZpcnR1YWxFbGVtZW50cy5pbnNlcnRBZnRlcik7XG4vL2tvLmV4cG9ydFN5bWJvbCgndmlydHVhbEVsZW1lbnRzLm5leHRTaWJsaW5nJywga28udmlydHVhbEVsZW1lbnRzLm5leHRTaWJsaW5nKTsgICAvLyBuZXh0U2libGluZyBpcyBub3QgbWluaWZpZWRcbmtvLmV4cG9ydFN5bWJvbCgndmlydHVhbEVsZW1lbnRzLnByZXBlbmQnLCBrby52aXJ0dWFsRWxlbWVudHMucHJlcGVuZCk7XG5rby5leHBvcnRTeW1ib2woJ3ZpcnR1YWxFbGVtZW50cy5zZXREb21Ob2RlQ2hpbGRyZW4nLCBrby52aXJ0dWFsRWxlbWVudHMuc2V0RG9tTm9kZUNoaWxkcmVuKTtcbihmdW5jdGlvbigpIHtcbiAgICB2YXIgZGVmYXVsdEJpbmRpbmdBdHRyaWJ1dGVOYW1lID0gXCJkYXRhLWJpbmRcIjtcblxuICAgIGtvLmJpbmRpbmdQcm92aWRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmJpbmRpbmdDYWNoZSA9IHt9O1xuICAgIH07XG5cbiAgICBrby51dGlscy5leHRlbmQoa28uYmluZGluZ1Byb3ZpZGVyLnByb3RvdHlwZSwge1xuICAgICAgICAnbm9kZUhhc0JpbmRpbmdzJzogZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgc3dpdGNoIChub2RlLm5vZGVUeXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAxOiAvLyBFbGVtZW50XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBub2RlLmdldEF0dHJpYnV0ZShkZWZhdWx0QmluZGluZ0F0dHJpYnV0ZU5hbWUpICE9IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgIHx8IGtvLmNvbXBvbmVudHNbJ2dldENvbXBvbmVudE5hbWVGb3JOb2RlJ10obm9kZSk7XG4gICAgICAgICAgICAgICAgY2FzZSA4OiAvLyBDb21tZW50IG5vZGVcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtvLnZpcnR1YWxFbGVtZW50cy5oYXNCaW5kaW5nVmFsdWUobm9kZSk7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgICdnZXRCaW5kaW5ncyc6IGZ1bmN0aW9uKG5vZGUsIGJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgICAgICB2YXIgYmluZGluZ3NTdHJpbmcgPSB0aGlzWydnZXRCaW5kaW5nc1N0cmluZyddKG5vZGUsIGJpbmRpbmdDb250ZXh0KSxcbiAgICAgICAgICAgICAgICBwYXJzZWRCaW5kaW5ncyA9IGJpbmRpbmdzU3RyaW5nID8gdGhpc1sncGFyc2VCaW5kaW5nc1N0cmluZyddKGJpbmRpbmdzU3RyaW5nLCBiaW5kaW5nQ29udGV4dCwgbm9kZSkgOiBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIGtvLmNvbXBvbmVudHMuYWRkQmluZGluZ3NGb3JDdXN0b21FbGVtZW50KHBhcnNlZEJpbmRpbmdzLCBub2RlLCBiaW5kaW5nQ29udGV4dCwgLyogdmFsdWVBY2Nlc3NvcnMgKi8gZmFsc2UpO1xuICAgICAgICB9LFxuXG4gICAgICAgICdnZXRCaW5kaW5nQWNjZXNzb3JzJzogZnVuY3Rpb24obm9kZSwgYmluZGluZ0NvbnRleHQpIHtcbiAgICAgICAgICAgIHZhciBiaW5kaW5nc1N0cmluZyA9IHRoaXNbJ2dldEJpbmRpbmdzU3RyaW5nJ10obm9kZSwgYmluZGluZ0NvbnRleHQpLFxuICAgICAgICAgICAgICAgIHBhcnNlZEJpbmRpbmdzID0gYmluZGluZ3NTdHJpbmcgPyB0aGlzWydwYXJzZUJpbmRpbmdzU3RyaW5nJ10oYmluZGluZ3NTdHJpbmcsIGJpbmRpbmdDb250ZXh0LCBub2RlLCB7ICd2YWx1ZUFjY2Vzc29ycyc6IHRydWUgfSkgOiBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIGtvLmNvbXBvbmVudHMuYWRkQmluZGluZ3NGb3JDdXN0b21FbGVtZW50KHBhcnNlZEJpbmRpbmdzLCBub2RlLCBiaW5kaW5nQ29udGV4dCwgLyogdmFsdWVBY2Nlc3NvcnMgKi8gdHJ1ZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBmdW5jdGlvbiBpcyBvbmx5IHVzZWQgaW50ZXJuYWxseSBieSB0aGlzIGRlZmF1bHQgcHJvdmlkZXIuXG4gICAgICAgIC8vIEl0J3Mgbm90IHBhcnQgb2YgdGhlIGludGVyZmFjZSBkZWZpbml0aW9uIGZvciBhIGdlbmVyYWwgYmluZGluZyBwcm92aWRlci5cbiAgICAgICAgJ2dldEJpbmRpbmdzU3RyaW5nJzogZnVuY3Rpb24obm9kZSwgYmluZGluZ0NvbnRleHQpIHtcbiAgICAgICAgICAgIHN3aXRjaCAobm9kZS5ub2RlVHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIG5vZGUuZ2V0QXR0cmlidXRlKGRlZmF1bHRCaW5kaW5nQXR0cmlidXRlTmFtZSk7ICAgLy8gRWxlbWVudFxuICAgICAgICAgICAgICAgIGNhc2UgODogcmV0dXJuIGtvLnZpcnR1YWxFbGVtZW50cy52aXJ0dWFsTm9kZUJpbmRpbmdWYWx1ZShub2RlKTsgLy8gQ29tbWVudCBub2RlXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBmdW5jdGlvbiBpcyBvbmx5IHVzZWQgaW50ZXJuYWxseSBieSB0aGlzIGRlZmF1bHQgcHJvdmlkZXIuXG4gICAgICAgIC8vIEl0J3Mgbm90IHBhcnQgb2YgdGhlIGludGVyZmFjZSBkZWZpbml0aW9uIGZvciBhIGdlbmVyYWwgYmluZGluZyBwcm92aWRlci5cbiAgICAgICAgJ3BhcnNlQmluZGluZ3NTdHJpbmcnOiBmdW5jdGlvbihiaW5kaW5nc1N0cmluZywgYmluZGluZ0NvbnRleHQsIG5vZGUsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdmFyIGJpbmRpbmdGdW5jdGlvbiA9IGNyZWF0ZUJpbmRpbmdzU3RyaW5nRXZhbHVhdG9yVmlhQ2FjaGUoYmluZGluZ3NTdHJpbmcsIHRoaXMuYmluZGluZ0NhY2hlLCBvcHRpb25zKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYmluZGluZ0Z1bmN0aW9uKGJpbmRpbmdDb250ZXh0LCBub2RlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICAgICAgZXgubWVzc2FnZSA9IFwiVW5hYmxlIHRvIHBhcnNlIGJpbmRpbmdzLlxcbkJpbmRpbmdzIHZhbHVlOiBcIiArIGJpbmRpbmdzU3RyaW5nICsgXCJcXG5NZXNzYWdlOiBcIiArIGV4Lm1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGtvLmJpbmRpbmdQcm92aWRlclsnaW5zdGFuY2UnXSA9IG5ldyBrby5iaW5kaW5nUHJvdmlkZXIoKTtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUJpbmRpbmdzU3RyaW5nRXZhbHVhdG9yVmlhQ2FjaGUoYmluZGluZ3NTdHJpbmcsIGNhY2hlLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBjYWNoZUtleSA9IGJpbmRpbmdzU3RyaW5nICsgKG9wdGlvbnMgJiYgb3B0aW9uc1sndmFsdWVBY2Nlc3NvcnMnXSB8fCAnJyk7XG4gICAgICAgIHJldHVybiBjYWNoZVtjYWNoZUtleV1cbiAgICAgICAgICAgIHx8IChjYWNoZVtjYWNoZUtleV0gPSBjcmVhdGVCaW5kaW5nc1N0cmluZ0V2YWx1YXRvcihiaW5kaW5nc1N0cmluZywgb3B0aW9ucykpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUJpbmRpbmdzU3RyaW5nRXZhbHVhdG9yKGJpbmRpbmdzU3RyaW5nLCBvcHRpb25zKSB7XG4gICAgICAgIC8vIEJ1aWxkIHRoZSBzb3VyY2UgZm9yIGEgZnVuY3Rpb24gdGhhdCBldmFsdWF0ZXMgXCJleHByZXNzaW9uXCJcbiAgICAgICAgLy8gRm9yIGVhY2ggc2NvcGUgdmFyaWFibGUsIGFkZCBhbiBleHRyYSBsZXZlbCBvZiBcIndpdGhcIiBuZXN0aW5nXG4gICAgICAgIC8vIEV4YW1wbGUgcmVzdWx0OiB3aXRoKHNjMSkgeyB3aXRoKHNjMCkgeyByZXR1cm4gKGV4cHJlc3Npb24pIH0gfVxuICAgICAgICB2YXIgcmV3cml0dGVuQmluZGluZ3MgPSBrby5leHByZXNzaW9uUmV3cml0aW5nLnByZVByb2Nlc3NCaW5kaW5ncyhiaW5kaW5nc1N0cmluZywgb3B0aW9ucyksXG4gICAgICAgICAgICBmdW5jdGlvbkJvZHkgPSBcIndpdGgoJGNvbnRleHQpe3dpdGgoJGRhdGF8fHt9KXtyZXR1cm57XCIgKyByZXdyaXR0ZW5CaW5kaW5ncyArIFwifX19XCI7XG4gICAgICAgIHJldHVybiBuZXcgRnVuY3Rpb24oXCIkY29udGV4dFwiLCBcIiRlbGVtZW50XCIsIGZ1bmN0aW9uQm9keSk7XG4gICAgfVxufSkoKTtcblxua28uZXhwb3J0U3ltYm9sKCdiaW5kaW5nUHJvdmlkZXInLCBrby5iaW5kaW5nUHJvdmlkZXIpO1xuKGZ1bmN0aW9uICgpIHtcbiAgICBrby5iaW5kaW5nSGFuZGxlcnMgPSB7fTtcblxuICAgIC8vIFRoZSBmb2xsb3dpbmcgZWxlbWVudCB0eXBlcyB3aWxsIG5vdCBiZSByZWN1cnNlZCBpbnRvIGR1cmluZyBiaW5kaW5nLiBJbiB0aGUgZnV0dXJlLCB3ZVxuICAgIC8vIG1heSBjb25zaWRlciBhZGRpbmcgPHRlbXBsYXRlPiB0byB0aGlzIGxpc3QsIGJlY2F1c2Ugc3VjaCBlbGVtZW50cycgY29udGVudHMgYXJlIGFsd2F5c1xuICAgIC8vIGludGVuZGVkIHRvIGJlIGJvdW5kIGluIGEgZGlmZmVyZW50IGNvbnRleHQgZnJvbSB3aGVyZSB0aGV5IGFwcGVhciBpbiB0aGUgZG9jdW1lbnQuXG4gICAgdmFyIGJpbmRpbmdEb2VzTm90UmVjdXJzZUludG9FbGVtZW50VHlwZXMgPSB7XG4gICAgICAgIC8vIERvbid0IHdhbnQgYmluZGluZ3MgdGhhdCBvcGVyYXRlIG9uIHRleHQgbm9kZXMgdG8gbXV0YXRlIDxzY3JpcHQ+IGNvbnRlbnRzLFxuICAgICAgICAvLyBiZWNhdXNlIGl0J3MgdW5leHBlY3RlZCBhbmQgYSBwb3RlbnRpYWwgWFNTIGlzc3VlXG4gICAgICAgICdzY3JpcHQnOiB0cnVlXG4gICAgfTtcblxuICAgIC8vIFVzZSBhbiBvdmVycmlkYWJsZSBtZXRob2QgZm9yIHJldHJpZXZpbmcgYmluZGluZyBoYW5kbGVycyBzbyB0aGF0IGEgcGx1Z2lucyBtYXkgc3VwcG9ydCBkeW5hbWljYWxseSBjcmVhdGVkIGhhbmRsZXJzXG4gICAga29bJ2dldEJpbmRpbmdIYW5kbGVyJ10gPSBmdW5jdGlvbihiaW5kaW5nS2V5KSB7XG4gICAgICAgIHJldHVybiBrby5iaW5kaW5nSGFuZGxlcnNbYmluZGluZ0tleV07XG4gICAgfTtcblxuICAgIC8vIFRoZSBrby5iaW5kaW5nQ29udGV4dCBjb25zdHJ1Y3RvciBpcyBvbmx5IGNhbGxlZCBkaXJlY3RseSB0byBjcmVhdGUgdGhlIHJvb3QgY29udGV4dC4gRm9yIGNoaWxkXG4gICAgLy8gY29udGV4dHMsIHVzZSBiaW5kaW5nQ29udGV4dC5jcmVhdGVDaGlsZENvbnRleHQgb3IgYmluZGluZ0NvbnRleHQuZXh0ZW5kLlxuICAgIGtvLmJpbmRpbmdDb250ZXh0ID0gZnVuY3Rpb24oZGF0YUl0ZW1PckFjY2Vzc29yLCBwYXJlbnRDb250ZXh0LCBkYXRhSXRlbUFsaWFzLCBleHRlbmRDYWxsYmFjaykge1xuXG4gICAgICAgIC8vIFRoZSBiaW5kaW5nIGNvbnRleHQgb2JqZWN0IGluY2x1ZGVzIHN0YXRpYyBwcm9wZXJ0aWVzIGZvciB0aGUgY3VycmVudCwgcGFyZW50LCBhbmQgcm9vdCB2aWV3IG1vZGVscy5cbiAgICAgICAgLy8gSWYgYSB2aWV3IG1vZGVsIGlzIGFjdHVhbGx5IHN0b3JlZCBpbiBhbiBvYnNlcnZhYmxlLCB0aGUgY29ycmVzcG9uZGluZyBiaW5kaW5nIGNvbnRleHQgb2JqZWN0LCBhbmRcbiAgICAgICAgLy8gYW55IGNoaWxkIGNvbnRleHRzLCBtdXN0IGJlIHVwZGF0ZWQgd2hlbiB0aGUgdmlldyBtb2RlbCBpcyBjaGFuZ2VkLlxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVDb250ZXh0KCkge1xuICAgICAgICAgICAgLy8gTW9zdCBvZiB0aGUgdGltZSwgdGhlIGNvbnRleHQgd2lsbCBkaXJlY3RseSBnZXQgYSB2aWV3IG1vZGVsIG9iamVjdCwgYnV0IGlmIGEgZnVuY3Rpb24gaXMgZ2l2ZW4sXG4gICAgICAgICAgICAvLyB3ZSBjYWxsIHRoZSBmdW5jdGlvbiB0byByZXRyaWV2ZSB0aGUgdmlldyBtb2RlbC4gSWYgdGhlIGZ1bmN0aW9uIGFjY2Vzc2VzIGFueSBvYnNldmFibGVzIG9yIHJldHVybnNcbiAgICAgICAgICAgIC8vIGFuIG9ic2VydmFibGUsIHRoZSBkZXBlbmRlbmN5IGlzIHRyYWNrZWQsIGFuZCB0aG9zZSBvYnNlcnZhYmxlcyBjYW4gbGF0ZXIgY2F1c2UgdGhlIGJpbmRpbmdcbiAgICAgICAgICAgIC8vIGNvbnRleHQgdG8gYmUgdXBkYXRlZC5cbiAgICAgICAgICAgIHZhciBkYXRhSXRlbU9yT2JzZXJ2YWJsZSA9IGlzRnVuYyA/IGRhdGFJdGVtT3JBY2Nlc3NvcigpIDogZGF0YUl0ZW1PckFjY2Vzc29yLFxuICAgICAgICAgICAgICAgIGRhdGFJdGVtID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShkYXRhSXRlbU9yT2JzZXJ2YWJsZSk7XG5cbiAgICAgICAgICAgIGlmIChwYXJlbnRDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgLy8gV2hlbiBhIFwicGFyZW50XCIgY29udGV4dCBpcyBnaXZlbiwgcmVnaXN0ZXIgYSBkZXBlbmRlbmN5IG9uIHRoZSBwYXJlbnQgY29udGV4dC4gVGh1cyB3aGVuZXZlciB0aGVcbiAgICAgICAgICAgICAgICAvLyBwYXJlbnQgY29udGV4dCBpcyB1cGRhdGVkLCB0aGlzIGNvbnRleHQgd2lsbCBhbHNvIGJlIHVwZGF0ZWQuXG4gICAgICAgICAgICAgICAgaWYgKHBhcmVudENvbnRleHQuX3N1YnNjcmliYWJsZSlcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Q29udGV4dC5fc3Vic2NyaWJhYmxlKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBDb3B5ICRyb290IGFuZCBhbnkgY3VzdG9tIHByb3BlcnRpZXMgZnJvbSB0aGUgcGFyZW50IGNvbnRleHRcbiAgICAgICAgICAgICAgICBrby51dGlscy5leHRlbmQoc2VsZiwgcGFyZW50Q29udGV4dCk7XG5cbiAgICAgICAgICAgICAgICAvLyBCZWNhdXNlIHRoZSBhYm92ZSBjb3B5IG92ZXJ3cml0ZXMgb3VyIG93biBwcm9wZXJ0aWVzLCB3ZSBuZWVkIHRvIHJlc2V0IHRoZW0uXG4gICAgICAgICAgICAgICAgLy8gRHVyaW5nIHRoZSBmaXJzdCBleGVjdXRpb24sIFwic3Vic2NyaWJhYmxlXCIgaXNuJ3Qgc2V0LCBzbyBkb24ndCBib3RoZXIgZG9pbmcgdGhlIHVwZGF0ZSB0aGVuLlxuICAgICAgICAgICAgICAgIGlmIChzdWJzY3JpYmFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fc3Vic2NyaWJhYmxlID0gc3Vic2NyaWJhYmxlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZlsnJHBhcmVudHMnXSA9IFtdO1xuICAgICAgICAgICAgICAgIHNlbGZbJyRyb290J10gPSBkYXRhSXRlbTtcblxuICAgICAgICAgICAgICAgIC8vIEV4cG9ydCAna28nIGluIHRoZSBiaW5kaW5nIGNvbnRleHQgc28gaXQgd2lsbCBiZSBhdmFpbGFibGUgaW4gYmluZGluZ3MgYW5kIHRlbXBsYXRlc1xuICAgICAgICAgICAgICAgIC8vIGV2ZW4gaWYgJ2tvJyBpc24ndCBleHBvcnRlZCBhcyBhIGdsb2JhbCwgc3VjaCBhcyB3aGVuIHVzaW5nIGFuIEFNRCBsb2FkZXIuXG4gICAgICAgICAgICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TdGV2ZVNhbmRlcnNvbi9rbm9ja291dC9pc3N1ZXMvNDkwXG4gICAgICAgICAgICAgICAgc2VsZlsna28nXSA9IGtvO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZlsnJHJhd0RhdGEnXSA9IGRhdGFJdGVtT3JPYnNlcnZhYmxlO1xuICAgICAgICAgICAgc2VsZlsnJGRhdGEnXSA9IGRhdGFJdGVtO1xuICAgICAgICAgICAgaWYgKGRhdGFJdGVtQWxpYXMpXG4gICAgICAgICAgICAgICAgc2VsZltkYXRhSXRlbUFsaWFzXSA9IGRhdGFJdGVtO1xuXG4gICAgICAgICAgICAvLyBUaGUgZXh0ZW5kQ2FsbGJhY2sgZnVuY3Rpb24gaXMgcHJvdmlkZWQgd2hlbiBjcmVhdGluZyBhIGNoaWxkIGNvbnRleHQgb3IgZXh0ZW5kaW5nIGEgY29udGV4dC5cbiAgICAgICAgICAgIC8vIEl0IGhhbmRsZXMgdGhlIHNwZWNpZmljIGFjdGlvbnMgbmVlZGVkIHRvIGZpbmlzaCBzZXR0aW5nIHVwIHRoZSBiaW5kaW5nIGNvbnRleHQuIEFjdGlvbnMgaW4gdGhpc1xuICAgICAgICAgICAgLy8gZnVuY3Rpb24gY291bGQgYWxzbyBhZGQgZGVwZW5kZW5jaWVzIHRvIHRoaXMgYmluZGluZyBjb250ZXh0LlxuICAgICAgICAgICAgaWYgKGV4dGVuZENhbGxiYWNrKVxuICAgICAgICAgICAgICAgIGV4dGVuZENhbGxiYWNrKHNlbGYsIHBhcmVudENvbnRleHQsIGRhdGFJdGVtKTtcblxuICAgICAgICAgICAgcmV0dXJuIHNlbGZbJyRkYXRhJ107XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZGlzcG9zZVdoZW4oKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZXMgJiYgIWtvLnV0aWxzLmFueURvbU5vZGVJc0F0dGFjaGVkVG9Eb2N1bWVudChub2Rlcyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICBpc0Z1bmMgPSB0eXBlb2YoZGF0YUl0ZW1PckFjY2Vzc29yKSA9PSBcImZ1bmN0aW9uXCIgJiYgIWtvLmlzT2JzZXJ2YWJsZShkYXRhSXRlbU9yQWNjZXNzb3IpLFxuICAgICAgICAgICAgbm9kZXMsXG4gICAgICAgICAgICBzdWJzY3JpYmFibGUgPSBrby5kZXBlbmRlbnRPYnNlcnZhYmxlKHVwZGF0ZUNvbnRleHQsIG51bGwsIHsgZGlzcG9zZVdoZW46IGRpc3Bvc2VXaGVuLCBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IHRydWUgfSk7XG5cbiAgICAgICAgLy8gQXQgdGhpcyBwb2ludCwgdGhlIGJpbmRpbmcgY29udGV4dCBoYXMgYmVlbiBpbml0aWFsaXplZCwgYW5kIHRoZSBcInN1YnNjcmliYWJsZVwiIGNvbXB1dGVkIG9ic2VydmFibGUgaXNcbiAgICAgICAgLy8gc3Vic2NyaWJlZCB0byBhbnkgb2JzZXJ2YWJsZXMgdGhhdCB3ZXJlIGFjY2Vzc2VkIGluIHRoZSBwcm9jZXNzLiBJZiB0aGVyZSBpcyBub3RoaW5nIHRvIHRyYWNrLCB0aGVcbiAgICAgICAgLy8gY29tcHV0ZWQgd2lsbCBiZSBpbmFjdGl2ZSwgYW5kIHdlIGNhbiBzYWZlbHkgdGhyb3cgaXQgYXdheS4gSWYgaXQncyBhY3RpdmUsIHRoZSBjb21wdXRlZCBpcyBzdG9yZWQgaW5cbiAgICAgICAgLy8gdGhlIGNvbnRleHQgb2JqZWN0LlxuICAgICAgICBpZiAoc3Vic2NyaWJhYmxlLmlzQWN0aXZlKCkpIHtcbiAgICAgICAgICAgIHNlbGYuX3N1YnNjcmliYWJsZSA9IHN1YnNjcmliYWJsZTtcblxuICAgICAgICAgICAgLy8gQWx3YXlzIG5vdGlmeSBiZWNhdXNlIGV2ZW4gaWYgdGhlIG1vZGVsICgkZGF0YSkgaGFzbid0IGNoYW5nZWQsIG90aGVyIGNvbnRleHQgcHJvcGVydGllcyBtaWdodCBoYXZlIGNoYW5nZWRcbiAgICAgICAgICAgIHN1YnNjcmliYWJsZVsnZXF1YWxpdHlDb21wYXJlciddID0gbnVsbDtcblxuICAgICAgICAgICAgLy8gV2UgbmVlZCB0byBiZSBhYmxlIHRvIGRpc3Bvc2Ugb2YgdGhpcyBjb21wdXRlZCBvYnNlcnZhYmxlIHdoZW4gaXQncyBubyBsb25nZXIgbmVlZGVkLiBUaGlzIHdvdWxkIGJlXG4gICAgICAgICAgICAvLyBlYXN5IGlmIHdlIGhhZCBhIHNpbmdsZSBub2RlIHRvIHdhdGNoLCBidXQgYmluZGluZyBjb250ZXh0cyBjYW4gYmUgdXNlZCBieSBtYW55IGRpZmZlcmVudCBub2RlcywgYW5kXG4gICAgICAgICAgICAvLyB3ZSBjYW5ub3QgYXNzdW1lIHRoYXQgdGhvc2Ugbm9kZXMgaGF2ZSBhbnkgcmVsYXRpb24gdG8gZWFjaCBvdGhlci4gU28gaW5zdGVhZCB3ZSB0cmFjayBhbnkgbm9kZSB0aGF0XG4gICAgICAgICAgICAvLyB0aGUgY29udGV4dCBpcyBhdHRhY2hlZCB0bywgYW5kIGRpc3Bvc2UgdGhlIGNvbXB1dGVkIHdoZW4gYWxsIG9mIHRob3NlIG5vZGVzIGhhdmUgYmVlbiBjbGVhbmVkLlxuXG4gICAgICAgICAgICAvLyBBZGQgcHJvcGVydGllcyB0byAqc3Vic2NyaWJhYmxlKiBpbnN0ZWFkIG9mICpzZWxmKiBiZWNhdXNlIGFueSBwcm9wZXJ0aWVzIGFkZGVkIHRvICpzZWxmKiBtYXkgYmUgb3ZlcndyaXR0ZW4gb24gdXBkYXRlc1xuICAgICAgICAgICAgbm9kZXMgPSBbXTtcbiAgICAgICAgICAgIHN1YnNjcmliYWJsZS5fYWRkTm9kZSA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBub2Rlcy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICAgIGtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbC5hZGREaXNwb3NlQ2FsbGJhY2sobm9kZSwgZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBrby51dGlscy5hcnJheVJlbW92ZUl0ZW0obm9kZXMsIG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJhYmxlLmRpc3Bvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX3N1YnNjcmliYWJsZSA9IHN1YnNjcmliYWJsZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEV4dGVuZCB0aGUgYmluZGluZyBjb250ZXh0IGhpZXJhcmNoeSB3aXRoIGEgbmV3IHZpZXcgbW9kZWwgb2JqZWN0LiBJZiB0aGUgcGFyZW50IGNvbnRleHQgaXMgd2F0Y2hpbmdcbiAgICAvLyBhbnkgb2JzZXZhYmxlcywgdGhlIG5ldyBjaGlsZCBjb250ZXh0IHdpbGwgYXV0b21hdGljYWxseSBnZXQgYSBkZXBlbmRlbmN5IG9uIHRoZSBwYXJlbnQgY29udGV4dC5cbiAgICAvLyBCdXQgdGhpcyBkb2VzIG5vdCBtZWFuIHRoYXQgdGhlICRkYXRhIHZhbHVlIG9mIHRoZSBjaGlsZCBjb250ZXh0IHdpbGwgYWxzbyBnZXQgdXBkYXRlZC4gSWYgdGhlIGNoaWxkXG4gICAgLy8gdmlldyBtb2RlbCBhbHNvIGRlcGVuZHMgb24gdGhlIHBhcmVudCB2aWV3IG1vZGVsLCB5b3UgbXVzdCBwcm92aWRlIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBjb3JyZWN0XG4gICAgLy8gdmlldyBtb2RlbCBvbiBlYWNoIHVwZGF0ZS5cbiAgICBrby5iaW5kaW5nQ29udGV4dC5wcm90b3R5cGVbJ2NyZWF0ZUNoaWxkQ29udGV4dCddID0gZnVuY3Rpb24gKGRhdGFJdGVtT3JBY2Nlc3NvciwgZGF0YUl0ZW1BbGlhcywgZXh0ZW5kQ2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIG5ldyBrby5iaW5kaW5nQ29udGV4dChkYXRhSXRlbU9yQWNjZXNzb3IsIHRoaXMsIGRhdGFJdGVtQWxpYXMsIGZ1bmN0aW9uKHNlbGYsIHBhcmVudENvbnRleHQpIHtcbiAgICAgICAgICAgIC8vIEV4dGVuZCB0aGUgY29udGV4dCBoaWVyYXJjaHkgYnkgc2V0dGluZyB0aGUgYXBwcm9wcmlhdGUgcG9pbnRlcnNcbiAgICAgICAgICAgIHNlbGZbJyRwYXJlbnRDb250ZXh0J10gPSBwYXJlbnRDb250ZXh0O1xuICAgICAgICAgICAgc2VsZlsnJHBhcmVudCddID0gcGFyZW50Q29udGV4dFsnJGRhdGEnXTtcbiAgICAgICAgICAgIHNlbGZbJyRwYXJlbnRzJ10gPSAocGFyZW50Q29udGV4dFsnJHBhcmVudHMnXSB8fCBbXSkuc2xpY2UoMCk7XG4gICAgICAgICAgICBzZWxmWyckcGFyZW50cyddLnVuc2hpZnQoc2VsZlsnJHBhcmVudCddKTtcbiAgICAgICAgICAgIGlmIChleHRlbmRDYWxsYmFjaylcbiAgICAgICAgICAgICAgICBleHRlbmRDYWxsYmFjayhzZWxmKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIEV4dGVuZCB0aGUgYmluZGluZyBjb250ZXh0IHdpdGggbmV3IGN1c3RvbSBwcm9wZXJ0aWVzLiBUaGlzIGRvZXNuJ3QgY2hhbmdlIHRoZSBjb250ZXh0IGhpZXJhcmNoeS5cbiAgICAvLyBTaW1pbGFybHkgdG8gXCJjaGlsZFwiIGNvbnRleHRzLCBwcm92aWRlIGEgZnVuY3Rpb24gaGVyZSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgY29ycmVjdCB2YWx1ZXMgYXJlIHNldFxuICAgIC8vIHdoZW4gYW4gb2JzZXJ2YWJsZSB2aWV3IG1vZGVsIGlzIHVwZGF0ZWQuXG4gICAga28uYmluZGluZ0NvbnRleHQucHJvdG90eXBlWydleHRlbmQnXSA9IGZ1bmN0aW9uKHByb3BlcnRpZXMpIHtcbiAgICAgICAgLy8gSWYgdGhlIHBhcmVudCBjb250ZXh0IHJlZmVyZW5jZXMgYW4gb2JzZXJ2YWJsZSB2aWV3IG1vZGVsLCBcIl9zdWJzY3JpYmFibGVcIiB3aWxsIGFsd2F5cyBiZSB0aGVcbiAgICAgICAgLy8gbGF0ZXN0IHZpZXcgbW9kZWwgb2JqZWN0LiBJZiBub3QsIFwiX3N1YnNjcmliYWJsZVwiIGlzbid0IHNldCwgYW5kIHdlIGNhbiB1c2UgdGhlIHN0YXRpYyBcIiRkYXRhXCIgdmFsdWUuXG4gICAgICAgIHJldHVybiBuZXcga28uYmluZGluZ0NvbnRleHQodGhpcy5fc3Vic2NyaWJhYmxlIHx8IHRoaXNbJyRkYXRhJ10sIHRoaXMsIG51bGwsIGZ1bmN0aW9uKHNlbGYsIHBhcmVudENvbnRleHQpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgXCJjaGlsZFwiIGNvbnRleHQgZG9lc24ndCBkaXJlY3RseSB0cmFjayBhIHBhcmVudCBvYnNlcnZhYmxlIHZpZXcgbW9kZWwsXG4gICAgICAgICAgICAvLyBzbyB3ZSBuZWVkIHRvIG1hbnVhbGx5IHNldCB0aGUgJHJhd0RhdGEgdmFsdWUgdG8gbWF0Y2ggdGhlIHBhcmVudC5cbiAgICAgICAgICAgIHNlbGZbJyRyYXdEYXRhJ10gPSBwYXJlbnRDb250ZXh0WyckcmF3RGF0YSddO1xuICAgICAgICAgICAga28udXRpbHMuZXh0ZW5kKHNlbGYsIHR5cGVvZihwcm9wZXJ0aWVzKSA9PSBcImZ1bmN0aW9uXCIgPyBwcm9wZXJ0aWVzKCkgOiBwcm9wZXJ0aWVzKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIFJldHVybnMgdGhlIHZhbHVlQWNjZXNvciBmdW5jdGlvbiBmb3IgYSBiaW5kaW5nIHZhbHVlXG4gICAgZnVuY3Rpb24gbWFrZVZhbHVlQWNjZXNzb3IodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIFJldHVybnMgdGhlIHZhbHVlIG9mIGEgdmFsdWVBY2Nlc3NvciBmdW5jdGlvblxuICAgIGZ1bmN0aW9uIGV2YWx1YXRlVmFsdWVBY2Nlc3Nvcih2YWx1ZUFjY2Vzc29yKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZUFjY2Vzc29yKCk7XG4gICAgfVxuXG4gICAgLy8gR2l2ZW4gYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYmluZGluZ3MsIGNyZWF0ZSBhbmQgcmV0dXJuIGEgbmV3IG9iamVjdCB0aGF0IGNvbnRhaW5zXG4gICAgLy8gYmluZGluZyB2YWx1ZS1hY2Nlc3NvcnMgZnVuY3Rpb25zLiBFYWNoIGFjY2Vzc29yIGZ1bmN0aW9uIGNhbGxzIHRoZSBvcmlnaW5hbCBmdW5jdGlvblxuICAgIC8vIHNvIHRoYXQgaXQgYWx3YXlzIGdldHMgdGhlIGxhdGVzdCB2YWx1ZSBhbmQgYWxsIGRlcGVuZGVuY2llcyBhcmUgY2FwdHVyZWQuIFRoaXMgaXMgdXNlZFxuICAgIC8vIGJ5IGtvLmFwcGx5QmluZGluZ3NUb05vZGUgYW5kIGdldEJpbmRpbmdzQW5kTWFrZUFjY2Vzc29ycy5cbiAgICBmdW5jdGlvbiBtYWtlQWNjZXNzb3JzRnJvbUZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiBrby51dGlscy5vYmplY3RNYXAoa28uZGVwZW5kZW5jeURldGVjdGlvbi5pZ25vcmUoY2FsbGJhY2spLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKClba2V5XTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEdpdmVuIGEgYmluZGluZ3MgZnVuY3Rpb24gb3Igb2JqZWN0LCBjcmVhdGUgYW5kIHJldHVybiBhIG5ldyBvYmplY3QgdGhhdCBjb250YWluc1xuICAgIC8vIGJpbmRpbmcgdmFsdWUtYWNjZXNzb3JzIGZ1bmN0aW9ucy4gVGhpcyBpcyB1c2VkIGJ5IGtvLmFwcGx5QmluZGluZ3NUb05vZGUuXG4gICAgZnVuY3Rpb24gbWFrZUJpbmRpbmdBY2Nlc3NvcnMoYmluZGluZ3MsIGNvbnRleHQsIG5vZGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiaW5kaW5ncyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIG1ha2VBY2Nlc3NvcnNGcm9tRnVuY3Rpb24oYmluZGluZ3MuYmluZChudWxsLCBjb250ZXh0LCBub2RlKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ga28udXRpbHMub2JqZWN0TWFwKGJpbmRpbmdzLCBtYWtlVmFsdWVBY2Nlc3Nvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgaWYgdGhlIGJpbmRpbmcgcHJvdmlkZXIgZG9lc24ndCBpbmNsdWRlIGEgZ2V0QmluZGluZ0FjY2Vzc29ycyBmdW5jdGlvbi5cbiAgICAvLyBJdCBtdXN0IGJlIGNhbGxlZCB3aXRoICd0aGlzJyBzZXQgdG8gdGhlIHByb3ZpZGVyIGluc3RhbmNlLlxuICAgIGZ1bmN0aW9uIGdldEJpbmRpbmdzQW5kTWFrZUFjY2Vzc29ycyhub2RlLCBjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiBtYWtlQWNjZXNzb3JzRnJvbUZ1bmN0aW9uKHRoaXNbJ2dldEJpbmRpbmdzJ10uYmluZCh0aGlzLCBub2RlLCBjb250ZXh0KSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsaWRhdGVUaGF0QmluZGluZ0lzQWxsb3dlZEZvclZpcnR1YWxFbGVtZW50cyhiaW5kaW5nTmFtZSkge1xuICAgICAgICB2YXIgdmFsaWRhdG9yID0ga28udmlydHVhbEVsZW1lbnRzLmFsbG93ZWRCaW5kaW5nc1tiaW5kaW5nTmFtZV07XG4gICAgICAgIGlmICghdmFsaWRhdG9yKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIGJpbmRpbmcgJ1wiICsgYmluZGluZ05hbWUgKyBcIicgY2Fubm90IGJlIHVzZWQgd2l0aCB2aXJ0dWFsIGVsZW1lbnRzXCIpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXBwbHlCaW5kaW5nc1RvRGVzY2VuZGFudHNJbnRlcm5hbCAoYmluZGluZ0NvbnRleHQsIGVsZW1lbnRPclZpcnR1YWxFbGVtZW50LCBiaW5kaW5nQ29udGV4dHNNYXlEaWZmZXJGcm9tRG9tUGFyZW50RWxlbWVudCkge1xuICAgICAgICB2YXIgY3VycmVudENoaWxkLFxuICAgICAgICAgICAgbmV4dEluUXVldWUgPSBrby52aXJ0dWFsRWxlbWVudHMuZmlyc3RDaGlsZChlbGVtZW50T3JWaXJ0dWFsRWxlbWVudCksXG4gICAgICAgICAgICBwcm92aWRlciA9IGtvLmJpbmRpbmdQcm92aWRlclsnaW5zdGFuY2UnXSxcbiAgICAgICAgICAgIHByZXByb2Nlc3NOb2RlID0gcHJvdmlkZXJbJ3ByZXByb2Nlc3NOb2RlJ107XG5cbiAgICAgICAgLy8gUHJlcHJvY2Vzc2luZyBhbGxvd3MgYSBiaW5kaW5nIHByb3ZpZGVyIHRvIG11dGF0ZSBhIG5vZGUgYmVmb3JlIGJpbmRpbmdzIGFyZSBhcHBsaWVkIHRvIGl0LiBGb3IgZXhhbXBsZSBpdCdzXG4gICAgICAgIC8vIHBvc3NpYmxlIHRvIGluc2VydCBuZXcgc2libGluZ3MgYWZ0ZXIgaXQsIGFuZC9vciByZXBsYWNlIHRoZSBub2RlIHdpdGggYSBkaWZmZXJlbnQgb25lLiBUaGlzIGNhbiBiZSB1c2VkIHRvXG4gICAgICAgIC8vIGltcGxlbWVudCBjdXN0b20gYmluZGluZyBzeW50YXhlcywgc3VjaCBhcyB7eyB2YWx1ZSB9fSBmb3Igc3RyaW5nIGludGVycG9sYXRpb24sIG9yIGN1c3RvbSBlbGVtZW50IHR5cGVzIHRoYXRcbiAgICAgICAgLy8gdHJpZ2dlciBpbnNlcnRpb24gb2YgPHRlbXBsYXRlPiBjb250ZW50cyBhdCB0aGF0IHBvaW50IGluIHRoZSBkb2N1bWVudC5cbiAgICAgICAgaWYgKHByZXByb2Nlc3NOb2RlKSB7XG4gICAgICAgICAgICB3aGlsZSAoY3VycmVudENoaWxkID0gbmV4dEluUXVldWUpIHtcbiAgICAgICAgICAgICAgICBuZXh0SW5RdWV1ZSA9IGtvLnZpcnR1YWxFbGVtZW50cy5uZXh0U2libGluZyhjdXJyZW50Q2hpbGQpO1xuICAgICAgICAgICAgICAgIHByZXByb2Nlc3NOb2RlLmNhbGwocHJvdmlkZXIsIGN1cnJlbnRDaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBSZXNldCBuZXh0SW5RdWV1ZSBmb3IgdGhlIG5leHQgbG9vcFxuICAgICAgICAgICAgbmV4dEluUXVldWUgPSBrby52aXJ0dWFsRWxlbWVudHMuZmlyc3RDaGlsZChlbGVtZW50T3JWaXJ0dWFsRWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAoY3VycmVudENoaWxkID0gbmV4dEluUXVldWUpIHtcbiAgICAgICAgICAgIC8vIEtlZXAgYSByZWNvcmQgb2YgdGhlIG5leHQgY2hpbGQgKmJlZm9yZSogYXBwbHlpbmcgYmluZGluZ3MsIGluIGNhc2UgdGhlIGJpbmRpbmcgcmVtb3ZlcyB0aGUgY3VycmVudCBjaGlsZCBmcm9tIGl0cyBwb3NpdGlvblxuICAgICAgICAgICAgbmV4dEluUXVldWUgPSBrby52aXJ0dWFsRWxlbWVudHMubmV4dFNpYmxpbmcoY3VycmVudENoaWxkKTtcbiAgICAgICAgICAgIGFwcGx5QmluZGluZ3NUb05vZGVBbmREZXNjZW5kYW50c0ludGVybmFsKGJpbmRpbmdDb250ZXh0LCBjdXJyZW50Q2hpbGQsIGJpbmRpbmdDb250ZXh0c01heURpZmZlckZyb21Eb21QYXJlbnRFbGVtZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFwcGx5QmluZGluZ3NUb05vZGVBbmREZXNjZW5kYW50c0ludGVybmFsIChiaW5kaW5nQ29udGV4dCwgbm9kZVZlcmlmaWVkLCBiaW5kaW5nQ29udGV4dE1heURpZmZlckZyb21Eb21QYXJlbnRFbGVtZW50KSB7XG4gICAgICAgIHZhciBzaG91bGRCaW5kRGVzY2VuZGFudHMgPSB0cnVlO1xuXG4gICAgICAgIC8vIFBlcmYgb3B0aW1pc2F0aW9uOiBBcHBseSBiaW5kaW5ncyBvbmx5IGlmLi4uXG4gICAgICAgIC8vICgxKSBXZSBuZWVkIHRvIHN0b3JlIHRoZSBiaW5kaW5nIGNvbnRleHQgb24gdGhpcyBub2RlIChiZWNhdXNlIGl0IG1heSBkaWZmZXIgZnJvbSB0aGUgRE9NIHBhcmVudCBub2RlJ3MgYmluZGluZyBjb250ZXh0KVxuICAgICAgICAvLyAgICAgTm90ZSB0aGF0IHdlIGNhbid0IHN0b3JlIGJpbmRpbmcgY29udGV4dHMgb24gbm9uLWVsZW1lbnRzIChlLmcuLCB0ZXh0IG5vZGVzKSwgYXMgSUUgZG9lc24ndCBhbGxvdyBleHBhbmRvIHByb3BlcnRpZXMgZm9yIHRob3NlXG4gICAgICAgIC8vICgyKSBJdCBtaWdodCBoYXZlIGJpbmRpbmdzIChlLmcuLCBpdCBoYXMgYSBkYXRhLWJpbmQgYXR0cmlidXRlLCBvciBpdCdzIGEgbWFya2VyIGZvciBhIGNvbnRhaW5lcmxlc3MgdGVtcGxhdGUpXG4gICAgICAgIHZhciBpc0VsZW1lbnQgPSAobm9kZVZlcmlmaWVkLm5vZGVUeXBlID09PSAxKTtcbiAgICAgICAgaWYgKGlzRWxlbWVudCkgLy8gV29ya2Fyb3VuZCBJRSA8PSA4IEhUTUwgcGFyc2luZyB3ZWlyZG5lc3NcbiAgICAgICAgICAgIGtvLnZpcnR1YWxFbGVtZW50cy5ub3JtYWxpc2VWaXJ0dWFsRWxlbWVudERvbVN0cnVjdHVyZShub2RlVmVyaWZpZWQpO1xuXG4gICAgICAgIHZhciBzaG91bGRBcHBseUJpbmRpbmdzID0gKGlzRWxlbWVudCAmJiBiaW5kaW5nQ29udGV4dE1heURpZmZlckZyb21Eb21QYXJlbnRFbGVtZW50KSAgICAgICAgICAgICAvLyBDYXNlICgxKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IGtvLmJpbmRpbmdQcm92aWRlclsnaW5zdGFuY2UnXVsnbm9kZUhhc0JpbmRpbmdzJ10obm9kZVZlcmlmaWVkKTsgICAgICAgLy8gQ2FzZSAoMilcbiAgICAgICAgaWYgKHNob3VsZEFwcGx5QmluZGluZ3MpXG4gICAgICAgICAgICBzaG91bGRCaW5kRGVzY2VuZGFudHMgPSBhcHBseUJpbmRpbmdzVG9Ob2RlSW50ZXJuYWwobm9kZVZlcmlmaWVkLCBudWxsLCBiaW5kaW5nQ29udGV4dCwgYmluZGluZ0NvbnRleHRNYXlEaWZmZXJGcm9tRG9tUGFyZW50RWxlbWVudClbJ3Nob3VsZEJpbmREZXNjZW5kYW50cyddO1xuXG4gICAgICAgIGlmIChzaG91bGRCaW5kRGVzY2VuZGFudHMgJiYgIWJpbmRpbmdEb2VzTm90UmVjdXJzZUludG9FbGVtZW50VHlwZXNba28udXRpbHMudGFnTmFtZUxvd2VyKG5vZGVWZXJpZmllZCldKSB7XG4gICAgICAgICAgICAvLyBXZSdyZSByZWN1cnNpbmcgYXV0b21hdGljYWxseSBpbnRvIChyZWFsIG9yIHZpcnR1YWwpIGNoaWxkIG5vZGVzIHdpdGhvdXQgY2hhbmdpbmcgYmluZGluZyBjb250ZXh0cy4gU28sXG4gICAgICAgICAgICAvLyAgKiBGb3IgY2hpbGRyZW4gb2YgYSAqcmVhbCogZWxlbWVudCwgdGhlIGJpbmRpbmcgY29udGV4dCBpcyBjZXJ0YWlubHkgdGhlIHNhbWUgYXMgb24gdGhlaXIgRE9NIC5wYXJlbnROb2RlLFxuICAgICAgICAgICAgLy8gICAgaGVuY2UgYmluZGluZ0NvbnRleHRzTWF5RGlmZmVyRnJvbURvbVBhcmVudEVsZW1lbnQgaXMgZmFsc2VcbiAgICAgICAgICAgIC8vICAqIEZvciBjaGlsZHJlbiBvZiBhICp2aXJ0dWFsKiBlbGVtZW50LCB3ZSBjYW4ndCBiZSBzdXJlLiBFdmFsdWF0aW5nIC5wYXJlbnROb2RlIG9uIHRob3NlIGNoaWxkcmVuIG1heVxuICAgICAgICAgICAgLy8gICAgc2tpcCBvdmVyIGFueSBudW1iZXIgb2YgaW50ZXJtZWRpYXRlIHZpcnR1YWwgZWxlbWVudHMsIGFueSBvZiB3aGljaCBtaWdodCBkZWZpbmUgYSBjdXN0b20gYmluZGluZyBjb250ZXh0LFxuICAgICAgICAgICAgLy8gICAgaGVuY2UgYmluZGluZ0NvbnRleHRzTWF5RGlmZmVyRnJvbURvbVBhcmVudEVsZW1lbnQgaXMgdHJ1ZVxuICAgICAgICAgICAgYXBwbHlCaW5kaW5nc1RvRGVzY2VuZGFudHNJbnRlcm5hbChiaW5kaW5nQ29udGV4dCwgbm9kZVZlcmlmaWVkLCAvKiBiaW5kaW5nQ29udGV4dHNNYXlEaWZmZXJGcm9tRG9tUGFyZW50RWxlbWVudDogKi8gIWlzRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgYm91bmRFbGVtZW50RG9tRGF0YUtleSA9IGtvLnV0aWxzLmRvbURhdGEubmV4dEtleSgpO1xuXG5cbiAgICBmdW5jdGlvbiB0b3BvbG9naWNhbFNvcnRCaW5kaW5ncyhiaW5kaW5ncykge1xuICAgICAgICAvLyBEZXB0aC1maXJzdCBzb3J0XG4gICAgICAgIHZhciByZXN1bHQgPSBbXSwgICAgICAgICAgICAgICAgLy8gVGhlIGxpc3Qgb2Yga2V5L2hhbmRsZXIgcGFpcnMgdGhhdCB3ZSB3aWxsIHJldHVyblxuICAgICAgICAgICAgYmluZGluZ3NDb25zaWRlcmVkID0ge30sICAgIC8vIEEgdGVtcG9yYXJ5IHJlY29yZCBvZiB3aGljaCBiaW5kaW5ncyBhcmUgYWxyZWFkeSBpbiAncmVzdWx0J1xuICAgICAgICAgICAgY3ljbGljRGVwZW5kZW5jeVN0YWNrID0gW107IC8vIEtlZXBzIHRyYWNrIG9mIGEgZGVwdGgtc2VhcmNoIHNvIHRoYXQsIGlmIHRoZXJlJ3MgYSBjeWNsZSwgd2Uga25vdyB3aGljaCBiaW5kaW5ncyBjYXVzZWQgaXRcbiAgICAgICAga28udXRpbHMub2JqZWN0Rm9yRWFjaChiaW5kaW5ncywgZnVuY3Rpb24gcHVzaEJpbmRpbmcoYmluZGluZ0tleSkge1xuICAgICAgICAgICAgaWYgKCFiaW5kaW5nc0NvbnNpZGVyZWRbYmluZGluZ0tleV0pIHtcbiAgICAgICAgICAgICAgICB2YXIgYmluZGluZyA9IGtvWydnZXRCaW5kaW5nSGFuZGxlciddKGJpbmRpbmdLZXkpO1xuICAgICAgICAgICAgICAgIGlmIChiaW5kaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEZpcnN0IGFkZCBkZXBlbmRlbmNpZXMgKGlmIGFueSkgb2YgdGhlIGN1cnJlbnQgYmluZGluZ1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmluZGluZ1snYWZ0ZXInXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3ljbGljRGVwZW5kZW5jeVN0YWNrLnB1c2goYmluZGluZ0tleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBrby51dGlscy5hcnJheUZvckVhY2goYmluZGluZ1snYWZ0ZXInXSwgZnVuY3Rpb24oYmluZGluZ0RlcGVuZGVuY3lLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmluZGluZ3NbYmluZGluZ0RlcGVuZGVuY3lLZXldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrby51dGlscy5hcnJheUluZGV4T2YoY3ljbGljRGVwZW5kZW5jeVN0YWNrLCBiaW5kaW5nRGVwZW5kZW5jeUtleSkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIkNhbm5vdCBjb21iaW5lIHRoZSBmb2xsb3dpbmcgYmluZGluZ3MsIGJlY2F1c2UgdGhleSBoYXZlIGEgY3ljbGljIGRlcGVuZGVuY3k6IFwiICsgY3ljbGljRGVwZW5kZW5jeVN0YWNrLmpvaW4oXCIsIFwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwdXNoQmluZGluZyhiaW5kaW5nRGVwZW5kZW5jeUtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN5Y2xpY0RlcGVuZGVuY3lTdGFjay5sZW5ndGgtLTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBOZXh0IGFkZCB0aGUgY3VycmVudCBiaW5kaW5nXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHsga2V5OiBiaW5kaW5nS2V5LCBoYW5kbGVyOiBiaW5kaW5nIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBiaW5kaW5nc0NvbnNpZGVyZWRbYmluZGluZ0tleV0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFwcGx5QmluZGluZ3NUb05vZGVJbnRlcm5hbChub2RlLCBzb3VyY2VCaW5kaW5ncywgYmluZGluZ0NvbnRleHQsIGJpbmRpbmdDb250ZXh0TWF5RGlmZmVyRnJvbURvbVBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgLy8gUHJldmVudCBtdWx0aXBsZSBhcHBseUJpbmRpbmdzIGNhbGxzIGZvciB0aGUgc2FtZSBub2RlLCBleGNlcHQgd2hlbiBhIGJpbmRpbmcgdmFsdWUgaXMgc3BlY2lmaWVkXG4gICAgICAgIHZhciBhbHJlYWR5Qm91bmQgPSBrby51dGlscy5kb21EYXRhLmdldChub2RlLCBib3VuZEVsZW1lbnREb21EYXRhS2V5KTtcbiAgICAgICAgaWYgKCFzb3VyY2VCaW5kaW5ncykge1xuICAgICAgICAgICAgaWYgKGFscmVhZHlCb3VuZCkge1xuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiWW91IGNhbm5vdCBhcHBseSBiaW5kaW5ncyBtdWx0aXBsZSB0aW1lcyB0byB0aGUgc2FtZSBlbGVtZW50LlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGtvLnV0aWxzLmRvbURhdGEuc2V0KG5vZGUsIGJvdW5kRWxlbWVudERvbURhdGFLZXksIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gT3B0aW1pemF0aW9uOiBEb24ndCBzdG9yZSB0aGUgYmluZGluZyBjb250ZXh0IG9uIHRoaXMgbm9kZSBpZiBpdCdzIGRlZmluaXRlbHkgdGhlIHNhbWUgYXMgb24gbm9kZS5wYXJlbnROb2RlLCBiZWNhdXNlXG4gICAgICAgIC8vIHdlIGNhbiBlYXNpbHkgcmVjb3ZlciBpdCBqdXN0IGJ5IHNjYW5uaW5nIHVwIHRoZSBub2RlJ3MgYW5jZXN0b3JzIGluIHRoZSBET01cbiAgICAgICAgLy8gKG5vdGU6IGhlcmUsIHBhcmVudCBub2RlIG1lYW5zIFwicmVhbCBET00gcGFyZW50XCIgbm90IFwidmlydHVhbCBwYXJlbnRcIiwgYXMgdGhlcmUncyBubyBPKDEpIHdheSB0byBmaW5kIHRoZSB2aXJ0dWFsIHBhcmVudClcbiAgICAgICAgaWYgKCFhbHJlYWR5Qm91bmQgJiYgYmluZGluZ0NvbnRleHRNYXlEaWZmZXJGcm9tRG9tUGFyZW50RWxlbWVudClcbiAgICAgICAgICAgIGtvLnN0b3JlZEJpbmRpbmdDb250ZXh0Rm9yTm9kZShub2RlLCBiaW5kaW5nQ29udGV4dCk7XG5cbiAgICAgICAgLy8gVXNlIGJpbmRpbmdzIGlmIGdpdmVuLCBvdGhlcndpc2UgZmFsbCBiYWNrIG9uIGFza2luZyB0aGUgYmluZGluZ3MgcHJvdmlkZXIgdG8gZ2l2ZSB1cyBzb21lIGJpbmRpbmdzXG4gICAgICAgIHZhciBiaW5kaW5ncztcbiAgICAgICAgaWYgKHNvdXJjZUJpbmRpbmdzICYmIHR5cGVvZiBzb3VyY2VCaW5kaW5ncyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgYmluZGluZ3MgPSBzb3VyY2VCaW5kaW5ncztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBwcm92aWRlciA9IGtvLmJpbmRpbmdQcm92aWRlclsnaW5zdGFuY2UnXSxcbiAgICAgICAgICAgICAgICBnZXRCaW5kaW5ncyA9IHByb3ZpZGVyWydnZXRCaW5kaW5nQWNjZXNzb3JzJ10gfHwgZ2V0QmluZGluZ3NBbmRNYWtlQWNjZXNzb3JzO1xuXG4gICAgICAgICAgICAvLyBHZXQgdGhlIGJpbmRpbmcgZnJvbSB0aGUgcHJvdmlkZXIgd2l0aGluIGEgY29tcHV0ZWQgb2JzZXJ2YWJsZSBzbyB0aGF0IHdlIGNhbiB1cGRhdGUgdGhlIGJpbmRpbmdzIHdoZW5ldmVyXG4gICAgICAgICAgICAvLyB0aGUgYmluZGluZyBjb250ZXh0IGlzIHVwZGF0ZWQgb3IgaWYgdGhlIGJpbmRpbmcgcHJvdmlkZXIgYWNjZXNzZXMgb2JzZXJ2YWJsZXMuXG4gICAgICAgICAgICB2YXIgYmluZGluZ3NVcGRhdGVyID0ga28uZGVwZW5kZW50T2JzZXJ2YWJsZShcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZ3MgPSBzb3VyY2VCaW5kaW5ncyA/IHNvdXJjZUJpbmRpbmdzKGJpbmRpbmdDb250ZXh0LCBub2RlKSA6IGdldEJpbmRpbmdzLmNhbGwocHJvdmlkZXIsIG5vZGUsIGJpbmRpbmdDb250ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gUmVnaXN0ZXIgYSBkZXBlbmRlbmN5IG9uIHRoZSBiaW5kaW5nIGNvbnRleHQgdG8gc3VwcG9ydCBvYnNldmFibGUgdmlldyBtb2RlbHMuXG4gICAgICAgICAgICAgICAgICAgIGlmIChiaW5kaW5ncyAmJiBiaW5kaW5nQ29udGV4dC5fc3Vic2NyaWJhYmxlKVxuICAgICAgICAgICAgICAgICAgICAgICAgYmluZGluZ0NvbnRleHQuX3N1YnNjcmliYWJsZSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmluZGluZ3M7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBudWxsLCB7IGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZDogbm9kZSB9XG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBpZiAoIWJpbmRpbmdzIHx8ICFiaW5kaW5nc1VwZGF0ZXIuaXNBY3RpdmUoKSlcbiAgICAgICAgICAgICAgICBiaW5kaW5nc1VwZGF0ZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGJpbmRpbmdIYW5kbGVyVGhhdENvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzO1xuICAgICAgICBpZiAoYmluZGluZ3MpIHtcbiAgICAgICAgICAgIC8vIFJldHVybiB0aGUgdmFsdWUgYWNjZXNzb3IgZm9yIGEgZ2l2ZW4gYmluZGluZy4gV2hlbiBiaW5kaW5ncyBhcmUgc3RhdGljICh3b24ndCBiZSB1cGRhdGVkIGJlY2F1c2Ugb2YgYSBiaW5kaW5nXG4gICAgICAgICAgICAvLyBjb250ZXh0IHVwZGF0ZSksIGp1c3QgcmV0dXJuIHRoZSB2YWx1ZSBhY2Nlc3NvciBmcm9tIHRoZSBiaW5kaW5nLiBPdGhlcndpc2UsIHJldHVybiBhIGZ1bmN0aW9uIHRoYXQgYWx3YXlzIGdldHNcbiAgICAgICAgICAgIC8vIHRoZSBsYXRlc3QgYmluZGluZyB2YWx1ZSBhbmQgcmVnaXN0ZXJzIGEgZGVwZW5kZW5jeSBvbiB0aGUgYmluZGluZyB1cGRhdGVyLlxuICAgICAgICAgICAgdmFyIGdldFZhbHVlQWNjZXNzb3IgPSBiaW5kaW5nc1VwZGF0ZXJcbiAgICAgICAgICAgICAgICA/IGZ1bmN0aW9uKGJpbmRpbmdLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV2YWx1YXRlVmFsdWVBY2Nlc3NvcihiaW5kaW5nc1VwZGF0ZXIoKVtiaW5kaW5nS2V5XSk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSA6IGZ1bmN0aW9uKGJpbmRpbmdLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJpbmRpbmdzW2JpbmRpbmdLZXldO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIFVzZSBvZiBhbGxCaW5kaW5ncyBhcyBhIGZ1bmN0aW9uIGlzIG1haW50YWluZWQgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LCBidXQgaXRzIHVzZSBpcyBkZXByZWNhdGVkXG4gICAgICAgICAgICBmdW5jdGlvbiBhbGxCaW5kaW5ncygpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ga28udXRpbHMub2JqZWN0TWFwKGJpbmRpbmdzVXBkYXRlciA/IGJpbmRpbmdzVXBkYXRlcigpIDogYmluZGluZ3MsIGV2YWx1YXRlVmFsdWVBY2Nlc3Nvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGlzIHRoZSAzLnggYWxsQmluZGluZ3MgQVBJXG4gICAgICAgICAgICBhbGxCaW5kaW5nc1snZ2V0J10gPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYmluZGluZ3Nba2V5XSAmJiBldmFsdWF0ZVZhbHVlQWNjZXNzb3IoZ2V0VmFsdWVBY2Nlc3NvcihrZXkpKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhbGxCaW5kaW5nc1snaGFzJ10gPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5IGluIGJpbmRpbmdzO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gRmlyc3QgcHV0IHRoZSBiaW5kaW5ncyBpbnRvIHRoZSByaWdodCBvcmRlclxuICAgICAgICAgICAgdmFyIG9yZGVyZWRCaW5kaW5ncyA9IHRvcG9sb2dpY2FsU29ydEJpbmRpbmdzKGJpbmRpbmdzKTtcblxuICAgICAgICAgICAgLy8gR28gdGhyb3VnaCB0aGUgc29ydGVkIGJpbmRpbmdzLCBjYWxsaW5nIGluaXQgYW5kIHVwZGF0ZSBmb3IgZWFjaFxuICAgICAgICAgICAga28udXRpbHMuYXJyYXlGb3JFYWNoKG9yZGVyZWRCaW5kaW5ncywgZnVuY3Rpb24oYmluZGluZ0tleUFuZEhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICAvLyBOb3RlIHRoYXQgdG9wb2xvZ2ljYWxTb3J0QmluZGluZ3MgaGFzIGFscmVhZHkgZmlsdGVyZWQgb3V0IGFueSBub25leGlzdGVudCBiaW5kaW5nIGhhbmRsZXJzLFxuICAgICAgICAgICAgICAgIC8vIHNvIGJpbmRpbmdLZXlBbmRIYW5kbGVyLmhhbmRsZXIgd2lsbCBhbHdheXMgYmUgbm9ubnVsbC5cbiAgICAgICAgICAgICAgICB2YXIgaGFuZGxlckluaXRGbiA9IGJpbmRpbmdLZXlBbmRIYW5kbGVyLmhhbmRsZXJbXCJpbml0XCJdLFxuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyVXBkYXRlRm4gPSBiaW5kaW5nS2V5QW5kSGFuZGxlci5oYW5kbGVyW1widXBkYXRlXCJdLFxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nS2V5ID0gYmluZGluZ0tleUFuZEhhbmRsZXIua2V5O1xuXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGVUaGF0QmluZGluZ0lzQWxsb3dlZEZvclZpcnR1YWxFbGVtZW50cyhiaW5kaW5nS2V5KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAvLyBSdW4gaW5pdCwgaWdub3JpbmcgYW55IGRlcGVuZGVuY2llc1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGhhbmRsZXJJbml0Rm4gPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrby5kZXBlbmRlbmN5RGV0ZWN0aW9uLmlnbm9yZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5pdFJlc3VsdCA9IGhhbmRsZXJJbml0Rm4obm9kZSwgZ2V0VmFsdWVBY2Nlc3NvcihiaW5kaW5nS2V5KSwgYWxsQmluZGluZ3MsIGJpbmRpbmdDb250ZXh0WyckZGF0YSddLCBiaW5kaW5nQ29udGV4dCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGlzIGJpbmRpbmcgaGFuZGxlciBjbGFpbXMgdG8gY29udHJvbCBkZXNjZW5kYW50IGJpbmRpbmdzLCBtYWtlIGEgbm90ZSBvZiB0aGlzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluaXRSZXN1bHQgJiYgaW5pdFJlc3VsdFsnY29udHJvbHNEZXNjZW5kYW50QmluZGluZ3MnXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmluZGluZ0hhbmRsZXJUaGF0Q29udHJvbHNEZXNjZW5kYW50QmluZGluZ3MgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk11bHRpcGxlIGJpbmRpbmdzIChcIiArIGJpbmRpbmdIYW5kbGVyVGhhdENvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzICsgXCIgYW5kIFwiICsgYmluZGluZ0tleSArIFwiKSBhcmUgdHJ5aW5nIHRvIGNvbnRyb2wgZGVzY2VuZGFudCBiaW5kaW5ncyBvZiB0aGUgc2FtZSBlbGVtZW50LiBZb3UgY2Fubm90IHVzZSB0aGVzZSBiaW5kaW5ncyB0b2dldGhlciBvbiB0aGUgc2FtZSBlbGVtZW50LlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZGluZ0hhbmRsZXJUaGF0Q29udHJvbHNEZXNjZW5kYW50QmluZGluZ3MgPSBiaW5kaW5nS2V5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gUnVuIHVwZGF0ZSBpbiBpdHMgb3duIGNvbXB1dGVkIHdyYXBwZXJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBoYW5kbGVyVXBkYXRlRm4gPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrby5kZXBlbmRlbnRPYnNlcnZhYmxlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyVXBkYXRlRm4obm9kZSwgZ2V0VmFsdWVBY2Nlc3NvcihiaW5kaW5nS2V5KSwgYWxsQmluZGluZ3MsIGJpbmRpbmdDb250ZXh0WyckZGF0YSddLCBiaW5kaW5nQ29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkOiBub2RlIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgICAgICAgICAgICBleC5tZXNzYWdlID0gXCJVbmFibGUgdG8gcHJvY2VzcyBiaW5kaW5nIFxcXCJcIiArIGJpbmRpbmdLZXkgKyBcIjogXCIgKyBiaW5kaW5nc1tiaW5kaW5nS2V5XSArIFwiXFxcIlxcbk1lc3NhZ2U6IFwiICsgZXgubWVzc2FnZTtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ3Nob3VsZEJpbmREZXNjZW5kYW50cyc6IGJpbmRpbmdIYW5kbGVyVGhhdENvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzID09PSB1bmRlZmluZWRcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgdmFyIHN0b3JlZEJpbmRpbmdDb250ZXh0RG9tRGF0YUtleSA9IGtvLnV0aWxzLmRvbURhdGEubmV4dEtleSgpO1xuICAgIGtvLnN0b3JlZEJpbmRpbmdDb250ZXh0Rm9yTm9kZSA9IGZ1bmN0aW9uIChub2RlLCBiaW5kaW5nQ29udGV4dCkge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAyKSB7XG4gICAgICAgICAgICBrby51dGlscy5kb21EYXRhLnNldChub2RlLCBzdG9yZWRCaW5kaW5nQ29udGV4dERvbURhdGFLZXksIGJpbmRpbmdDb250ZXh0KTtcbiAgICAgICAgICAgIGlmIChiaW5kaW5nQ29udGV4dC5fc3Vic2NyaWJhYmxlKVxuICAgICAgICAgICAgICAgIGJpbmRpbmdDb250ZXh0Ll9zdWJzY3JpYmFibGUuX2FkZE5vZGUobm9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ga28udXRpbHMuZG9tRGF0YS5nZXQobm9kZSwgc3RvcmVkQmluZGluZ0NvbnRleHREb21EYXRhS2V5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEJpbmRpbmdDb250ZXh0KHZpZXdNb2RlbE9yQmluZGluZ0NvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIHZpZXdNb2RlbE9yQmluZGluZ0NvbnRleHQgJiYgKHZpZXdNb2RlbE9yQmluZGluZ0NvbnRleHQgaW5zdGFuY2VvZiBrby5iaW5kaW5nQ29udGV4dClcbiAgICAgICAgICAgID8gdmlld01vZGVsT3JCaW5kaW5nQ29udGV4dFxuICAgICAgICAgICAgOiBuZXcga28uYmluZGluZ0NvbnRleHQodmlld01vZGVsT3JCaW5kaW5nQ29udGV4dCk7XG4gICAgfVxuXG4gICAga28uYXBwbHlCaW5kaW5nQWNjZXNzb3JzVG9Ob2RlID0gZnVuY3Rpb24gKG5vZGUsIGJpbmRpbmdzLCB2aWV3TW9kZWxPckJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSAvLyBJZiBpdCdzIGFuIGVsZW1lbnQsIHdvcmthcm91bmQgSUUgPD0gOCBIVE1MIHBhcnNpbmcgd2VpcmRuZXNzXG4gICAgICAgICAgICBrby52aXJ0dWFsRWxlbWVudHMubm9ybWFsaXNlVmlydHVhbEVsZW1lbnREb21TdHJ1Y3R1cmUobm9kZSk7XG4gICAgICAgIHJldHVybiBhcHBseUJpbmRpbmdzVG9Ob2RlSW50ZXJuYWwobm9kZSwgYmluZGluZ3MsIGdldEJpbmRpbmdDb250ZXh0KHZpZXdNb2RlbE9yQmluZGluZ0NvbnRleHQpLCB0cnVlKTtcbiAgICB9O1xuXG4gICAga28uYXBwbHlCaW5kaW5nc1RvTm9kZSA9IGZ1bmN0aW9uIChub2RlLCBiaW5kaW5ncywgdmlld01vZGVsT3JCaW5kaW5nQ29udGV4dCkge1xuICAgICAgICB2YXIgY29udGV4dCA9IGdldEJpbmRpbmdDb250ZXh0KHZpZXdNb2RlbE9yQmluZGluZ0NvbnRleHQpO1xuICAgICAgICByZXR1cm4ga28uYXBwbHlCaW5kaW5nQWNjZXNzb3JzVG9Ob2RlKG5vZGUsIG1ha2VCaW5kaW5nQWNjZXNzb3JzKGJpbmRpbmdzLCBjb250ZXh0LCBub2RlKSwgY29udGV4dCk7XG4gICAgfTtcblxuICAgIGtvLmFwcGx5QmluZGluZ3NUb0Rlc2NlbmRhbnRzID0gZnVuY3Rpb24odmlld01vZGVsT3JCaW5kaW5nQ29udGV4dCwgcm9vdE5vZGUpIHtcbiAgICAgICAgaWYgKHJvb3ROb2RlLm5vZGVUeXBlID09PSAxIHx8IHJvb3ROb2RlLm5vZGVUeXBlID09PSA4KVxuICAgICAgICAgICAgYXBwbHlCaW5kaW5nc1RvRGVzY2VuZGFudHNJbnRlcm5hbChnZXRCaW5kaW5nQ29udGV4dCh2aWV3TW9kZWxPckJpbmRpbmdDb250ZXh0KSwgcm9vdE5vZGUsIHRydWUpO1xuICAgIH07XG5cbiAgICBrby5hcHBseUJpbmRpbmdzID0gZnVuY3Rpb24gKHZpZXdNb2RlbE9yQmluZGluZ0NvbnRleHQsIHJvb3ROb2RlKSB7XG4gICAgICAgIC8vIElmIGpRdWVyeSBpcyBsb2FkZWQgYWZ0ZXIgS25vY2tvdXQsIHdlIHdvbid0IGluaXRpYWxseSBoYXZlIGFjY2VzcyB0byBpdC4gU28gc2F2ZSBpdCBoZXJlLlxuICAgICAgICBpZiAoIWpRdWVyeUluc3RhbmNlICYmIHdpbmRvd1snalF1ZXJ5J10pIHtcbiAgICAgICAgICAgIGpRdWVyeUluc3RhbmNlID0gd2luZG93WydqUXVlcnknXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyb290Tm9kZSAmJiAocm9vdE5vZGUubm9kZVR5cGUgIT09IDEpICYmIChyb290Tm9kZS5ub2RlVHlwZSAhPT0gOCkpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJrby5hcHBseUJpbmRpbmdzOiBmaXJzdCBwYXJhbWV0ZXIgc2hvdWxkIGJlIHlvdXIgdmlldyBtb2RlbDsgc2Vjb25kIHBhcmFtZXRlciBzaG91bGQgYmUgYSBET00gbm9kZVwiKTtcbiAgICAgICAgcm9vdE5vZGUgPSByb290Tm9kZSB8fCB3aW5kb3cuZG9jdW1lbnQuYm9keTsgLy8gTWFrZSBcInJvb3ROb2RlXCIgcGFyYW1ldGVyIG9wdGlvbmFsXG5cbiAgICAgICAgYXBwbHlCaW5kaW5nc1RvTm9kZUFuZERlc2NlbmRhbnRzSW50ZXJuYWwoZ2V0QmluZGluZ0NvbnRleHQodmlld01vZGVsT3JCaW5kaW5nQ29udGV4dCksIHJvb3ROb2RlLCB0cnVlKTtcbiAgICB9O1xuXG4gICAgLy8gUmV0cmlldmluZyBiaW5kaW5nIGNvbnRleHQgZnJvbSBhcmJpdHJhcnkgbm9kZXNcbiAgICBrby5jb250ZXh0Rm9yID0gZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAvLyBXZSBjYW4gb25seSBkbyBzb21ldGhpbmcgbWVhbmluZ2Z1bCBmb3IgZWxlbWVudHMgYW5kIGNvbW1lbnQgbm9kZXMgKGluIHBhcnRpY3VsYXIsIG5vdCB0ZXh0IG5vZGVzLCBhcyBJRSBjYW4ndCBzdG9yZSBkb21kYXRhIGZvciB0aGVtKVxuICAgICAgICBzd2l0Y2ggKG5vZGUubm9kZVR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAgICB2YXIgY29udGV4dCA9IGtvLnN0b3JlZEJpbmRpbmdDb250ZXh0Rm9yTm9kZShub2RlKTtcbiAgICAgICAgICAgICAgICBpZiAoY29udGV4dCkgcmV0dXJuIGNvbnRleHQ7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUucGFyZW50Tm9kZSkgcmV0dXJuIGtvLmNvbnRleHRGb3Iobm9kZS5wYXJlbnROb2RlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH07XG4gICAga28uZGF0YUZvciA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgdmFyIGNvbnRleHQgPSBrby5jb250ZXh0Rm9yKG5vZGUpO1xuICAgICAgICByZXR1cm4gY29udGV4dCA/IGNvbnRleHRbJyRkYXRhJ10gOiB1bmRlZmluZWQ7XG4gICAgfTtcblxuICAgIGtvLmV4cG9ydFN5bWJvbCgnYmluZGluZ0hhbmRsZXJzJywga28uYmluZGluZ0hhbmRsZXJzKTtcbiAgICBrby5leHBvcnRTeW1ib2woJ2FwcGx5QmluZGluZ3MnLCBrby5hcHBseUJpbmRpbmdzKTtcbiAgICBrby5leHBvcnRTeW1ib2woJ2FwcGx5QmluZGluZ3NUb0Rlc2NlbmRhbnRzJywga28uYXBwbHlCaW5kaW5nc1RvRGVzY2VuZGFudHMpO1xuICAgIGtvLmV4cG9ydFN5bWJvbCgnYXBwbHlCaW5kaW5nQWNjZXNzb3JzVG9Ob2RlJywga28uYXBwbHlCaW5kaW5nQWNjZXNzb3JzVG9Ob2RlKTtcbiAgICBrby5leHBvcnRTeW1ib2woJ2FwcGx5QmluZGluZ3NUb05vZGUnLCBrby5hcHBseUJpbmRpbmdzVG9Ob2RlKTtcbiAgICBrby5leHBvcnRTeW1ib2woJ2NvbnRleHRGb3InLCBrby5jb250ZXh0Rm9yKTtcbiAgICBrby5leHBvcnRTeW1ib2woJ2RhdGFGb3InLCBrby5kYXRhRm9yKTtcbn0pKCk7XG4oZnVuY3Rpb24odW5kZWZpbmVkKSB7XG4gICAgdmFyIGxvYWRpbmdTdWJzY3JpYmFibGVzQ2FjaGUgPSB7fSwgLy8gVHJhY2tzIGNvbXBvbmVudCBsb2FkcyB0aGF0IGFyZSBjdXJyZW50bHkgaW4gZmxpZ2h0XG4gICAgICAgIGxvYWRlZERlZmluaXRpb25zQ2FjaGUgPSB7fTsgICAgLy8gVHJhY2tzIGNvbXBvbmVudCBsb2FkcyB0aGF0IGhhdmUgYWxyZWFkeSBjb21wbGV0ZWRcblxuICAgIGtvLmNvbXBvbmVudHMgPSB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oY29tcG9uZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHZhciBjYWNoZWREZWZpbml0aW9uID0gZ2V0T2JqZWN0T3duUHJvcGVydHkobG9hZGVkRGVmaW5pdGlvbnNDYWNoZSwgY29tcG9uZW50TmFtZSk7XG4gICAgICAgICAgICBpZiAoY2FjaGVkRGVmaW5pdGlvbikge1xuICAgICAgICAgICAgICAgIC8vIEl0J3MgYWxyZWFkeSBsb2FkZWQgYW5kIGNhY2hlZC4gUmV1c2UgdGhlIHNhbWUgZGVmaW5pdGlvbiBvYmplY3QuXG4gICAgICAgICAgICAgICAgLy8gTm90ZSB0aGF0IGZvciBBUEkgY29uc2lzdGVuY3ksIGV2ZW4gY2FjaGUgaGl0cyBjb21wbGV0ZSBhc3luY2hyb25vdXNseS5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBjYWxsYmFjayhjYWNoZWREZWZpbml0aW9uKSB9LCAwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gSm9pbiB0aGUgbG9hZGluZyBwcm9jZXNzIHRoYXQgaXMgYWxyZWFkeSB1bmRlcndheSwgb3Igc3RhcnQgYSBuZXcgb25lLlxuICAgICAgICAgICAgICAgIGxvYWRDb21wb25lbnRBbmROb3RpZnkoY29tcG9uZW50TmFtZSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGNsZWFyQ2FjaGVkRGVmaW5pdGlvbjogZnVuY3Rpb24oY29tcG9uZW50TmFtZSkge1xuICAgICAgICAgICAgZGVsZXRlIGxvYWRlZERlZmluaXRpb25zQ2FjaGVbY29tcG9uZW50TmFtZV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2dldEZpcnN0UmVzdWx0RnJvbUxvYWRlcnM6IGdldEZpcnN0UmVzdWx0RnJvbUxvYWRlcnNcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0T2JqZWN0T3duUHJvcGVydHkob2JqLCBwcm9wTmFtZSkge1xuICAgICAgICByZXR1cm4gb2JqLmhhc093blByb3BlcnR5KHByb3BOYW1lKSA/IG9ialtwcm9wTmFtZV0gOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9hZENvbXBvbmVudEFuZE5vdGlmeShjb21wb25lbnROYW1lLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgc3Vic2NyaWJhYmxlID0gZ2V0T2JqZWN0T3duUHJvcGVydHkobG9hZGluZ1N1YnNjcmliYWJsZXNDYWNoZSwgY29tcG9uZW50TmFtZSksXG4gICAgICAgICAgICBjb21wbGV0ZWRBc3luYztcbiAgICAgICAgaWYgKCFzdWJzY3JpYmFibGUpIHtcbiAgICAgICAgICAgIC8vIEl0J3Mgbm90IHN0YXJ0ZWQgbG9hZGluZyB5ZXQuIFN0YXJ0IGxvYWRpbmcsIGFuZCB3aGVuIGl0J3MgZG9uZSwgbW92ZSBpdCB0byBsb2FkZWREZWZpbml0aW9uc0NhY2hlLlxuICAgICAgICAgICAgc3Vic2NyaWJhYmxlID0gbG9hZGluZ1N1YnNjcmliYWJsZXNDYWNoZVtjb21wb25lbnROYW1lXSA9IG5ldyBrby5zdWJzY3JpYmFibGUoKTtcbiAgICAgICAgICAgIGJlZ2luTG9hZGluZ0NvbXBvbmVudChjb21wb25lbnROYW1lLCBmdW5jdGlvbihkZWZpbml0aW9uKSB7XG4gICAgICAgICAgICAgICAgbG9hZGVkRGVmaW5pdGlvbnNDYWNoZVtjb21wb25lbnROYW1lXSA9IGRlZmluaXRpb247XG4gICAgICAgICAgICAgICAgZGVsZXRlIGxvYWRpbmdTdWJzY3JpYmFibGVzQ2FjaGVbY29tcG9uZW50TmFtZV07XG5cbiAgICAgICAgICAgICAgICAvLyBGb3IgQVBJIGNvbnNpc3RlbmN5LCBhbGwgbG9hZHMgY29tcGxldGUgYXN5bmNocm9ub3VzbHkuIEhvd2V2ZXIgd2Ugd2FudCB0byBhdm9pZFxuICAgICAgICAgICAgICAgIC8vIGFkZGluZyBhbiBleHRyYSBzZXRUaW1lb3V0IGlmIGl0J3MgdW5uZWNlc3NhcnkgKGkuZS4sIHRoZSBjb21wbGV0aW9uIGlzIGFscmVhZHlcbiAgICAgICAgICAgICAgICAvLyBhc3luYykgc2luY2Ugc2V0VGltZW91dCguLi4sIDApIHN0aWxsIHRha2VzIGFib3V0IDE2bXMgb3IgbW9yZSBvbiBtb3N0IGJyb3dzZXJzLlxuICAgICAgICAgICAgICAgIGlmIChjb21wbGV0ZWRBc3luYykge1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmFibGVbJ25vdGlmeVN1YnNjcmliZXJzJ10oZGVmaW5pdGlvbik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmliYWJsZVsnbm90aWZ5U3Vic2NyaWJlcnMnXShkZWZpbml0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb21wbGV0ZWRBc3luYyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgc3Vic2NyaWJhYmxlLnN1YnNjcmliZShjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYmVnaW5Mb2FkaW5nQ29tcG9uZW50KGNvbXBvbmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGdldEZpcnN0UmVzdWx0RnJvbUxvYWRlcnMoJ2dldENvbmZpZycsIFtjb21wb25lbnROYW1lXSwgZnVuY3Rpb24oY29uZmlnKSB7XG4gICAgICAgICAgICBpZiAoY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgLy8gV2UgaGF2ZSBhIGNvbmZpZywgc28gbm93IGxvYWQgaXRzIGRlZmluaXRpb25cbiAgICAgICAgICAgICAgICBnZXRGaXJzdFJlc3VsdEZyb21Mb2FkZXJzKCdsb2FkQ29tcG9uZW50JywgW2NvbXBvbmVudE5hbWUsIGNvbmZpZ10sIGZ1bmN0aW9uKGRlZmluaXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZGVmaW5pdGlvbik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFRoZSBjb21wb25lbnQgaGFzIG5vIGNvbmZpZyAtIGl0J3MgdW5rbm93biB0byBhbGwgdGhlIGxvYWRlcnMuXG4gICAgICAgICAgICAgICAgLy8gTm90ZSB0aGF0IHRoaXMgaXMgbm90IGFuIGVycm9yIChlLmcuLCBhIG1vZHVsZSBsb2FkaW5nIGVycm9yKSAtIHRoYXQgd291bGQgYWJvcnQgdGhlXG4gICAgICAgICAgICAgICAgLy8gcHJvY2VzcyBhbmQgdGhpcyBjYWxsYmFjayB3b3VsZCBub3QgcnVuLiBGb3IgdGhpcyBjYWxsYmFjayB0byBydW4sIGFsbCBsb2FkZXJzIG11c3RcbiAgICAgICAgICAgICAgICAvLyBoYXZlIGNvbmZpcm1lZCB0aGV5IGRvbid0IGtub3cgYWJvdXQgdGhpcyBjb21wb25lbnQuXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEZpcnN0UmVzdWx0RnJvbUxvYWRlcnMobWV0aG9kTmFtZSwgYXJnc0V4Y2VwdENhbGxiYWNrLCBjYWxsYmFjaywgY2FuZGlkYXRlTG9hZGVycykge1xuICAgICAgICAvLyBPbiB0aGUgZmlyc3QgY2FsbCBpbiB0aGUgc3RhY2ssIHN0YXJ0IHdpdGggdGhlIGZ1bGwgc2V0IG9mIGxvYWRlcnNcbiAgICAgICAgaWYgKCFjYW5kaWRhdGVMb2FkZXJzKSB7XG4gICAgICAgICAgICBjYW5kaWRhdGVMb2FkZXJzID0ga28uY29tcG9uZW50c1snbG9hZGVycyddLnNsaWNlKDApOyAvLyBVc2UgYSBjb3B5LCBiZWNhdXNlIHdlJ2xsIGJlIG11dGF0aW5nIHRoaXMgYXJyYXlcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRyeSB0aGUgbmV4dCBjYW5kaWRhdGVcbiAgICAgICAgdmFyIGN1cnJlbnRDYW5kaWRhdGVMb2FkZXIgPSBjYW5kaWRhdGVMb2FkZXJzLnNoaWZ0KCk7XG4gICAgICAgIGlmIChjdXJyZW50Q2FuZGlkYXRlTG9hZGVyKSB7XG4gICAgICAgICAgICB2YXIgbWV0aG9kSW5zdGFuY2UgPSBjdXJyZW50Q2FuZGlkYXRlTG9hZGVyW21ldGhvZE5hbWVdO1xuICAgICAgICAgICAgaWYgKG1ldGhvZEluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHdhc0Fib3J0ZWQgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgc3luY2hyb25vdXNSZXR1cm5WYWx1ZSA9IG1ldGhvZEluc3RhbmNlLmFwcGx5KGN1cnJlbnRDYW5kaWRhdGVMb2FkZXIsIGFyZ3NFeGNlcHRDYWxsYmFjay5jb25jYXQoZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod2FzQWJvcnRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIGNhbmRpZGF0ZSByZXR1cm5lZCBhIHZhbHVlLiBVc2UgaXQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2socmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVHJ5IHRoZSBuZXh0IGNhbmRpZGF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEZpcnN0UmVzdWx0RnJvbUxvYWRlcnMobWV0aG9kTmFtZSwgYXJnc0V4Y2VwdENhbGxiYWNrLCBjYWxsYmFjaywgY2FuZGlkYXRlTG9hZGVycyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgIC8vIEN1cnJlbnRseSwgbG9hZGVycyBtYXkgbm90IHJldHVybiBhbnl0aGluZyBzeW5jaHJvbm91c2x5LiBUaGlzIGxlYXZlcyBvcGVuIHRoZSBwb3NzaWJpbGl0eVxuICAgICAgICAgICAgICAgIC8vIHRoYXQgd2UnbGwgZXh0ZW5kIHRoZSBBUEkgdG8gc3VwcG9ydCBzeW5jaHJvbm91cyByZXR1cm4gdmFsdWVzIGluIHRoZSBmdXR1cmUuIEl0IHdvbid0IGJlXG4gICAgICAgICAgICAgICAgLy8gYSBicmVha2luZyBjaGFuZ2UsIGJlY2F1c2UgY3VycmVudGx5IG5vIGxvYWRlciBpcyBhbGxvd2VkIHRvIHJldHVybiBhbnl0aGluZyBleGNlcHQgdW5kZWZpbmVkLlxuICAgICAgICAgICAgICAgIGlmIChzeW5jaHJvbm91c1JldHVyblZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgd2FzQWJvcnRlZCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gTWV0aG9kIHRvIHN1cHByZXNzIGV4Y2VwdGlvbnMgd2lsbCByZW1haW4gdW5kb2N1bWVudGVkLiBUaGlzIGlzIG9ubHkgdG8ga2VlcFxuICAgICAgICAgICAgICAgICAgICAvLyBLTydzIHNwZWNzIHJ1bm5pbmcgdGlkaWx5LCBzaW5jZSB3ZSBjYW4gb2JzZXJ2ZSB0aGUgbG9hZGluZyBnb3QgYWJvcnRlZCB3aXRob3V0XG4gICAgICAgICAgICAgICAgICAgIC8vIGhhdmluZyBleGNlcHRpb25zIGNsdXR0ZXJpbmcgdXAgdGhlIGNvbnNvbGUgdG9vLlxuICAgICAgICAgICAgICAgICAgICBpZiAoIWN1cnJlbnRDYW5kaWRhdGVMb2FkZXJbJ3N1cHByZXNzTG9hZGVyRXhjZXB0aW9ucyddKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbXBvbmVudCBsb2FkZXJzIG11c3Qgc3VwcGx5IHZhbHVlcyBieSBpbnZva2luZyB0aGUgY2FsbGJhY2ssIG5vdCBieSByZXR1cm5pbmcgdmFsdWVzIHN5bmNocm9ub3VzbHkuJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFRoaXMgY2FuZGlkYXRlIGRvZXNuJ3QgaGF2ZSB0aGUgcmVsZXZhbnQgaGFuZGxlci4gU3luY2hyb25vdXNseSBtb3ZlIG9uIHRvIHRoZSBuZXh0IG9uZS5cbiAgICAgICAgICAgICAgICBnZXRGaXJzdFJlc3VsdEZyb21Mb2FkZXJzKG1ldGhvZE5hbWUsIGFyZ3NFeGNlcHRDYWxsYmFjaywgY2FsbGJhY2ssIGNhbmRpZGF0ZUxvYWRlcnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gTm8gY2FuZGlkYXRlcyByZXR1cm5lZCBhIHZhbHVlXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlZmVyZW5jZSB0aGUgbG9hZGVycyB2aWEgc3RyaW5nIG5hbWUgc28gaXQncyBwb3NzaWJsZSBmb3IgZGV2ZWxvcGVyc1xuICAgIC8vIHRvIHJlcGxhY2UgdGhlIHdob2xlIGFycmF5IGJ5IGFzc2lnbmluZyB0byBrby5jb21wb25lbnRzLmxvYWRlcnNcbiAgICBrby5jb21wb25lbnRzWydsb2FkZXJzJ10gPSBbXTtcblxuICAgIGtvLmV4cG9ydFN5bWJvbCgnY29tcG9uZW50cycsIGtvLmNvbXBvbmVudHMpO1xuICAgIGtvLmV4cG9ydFN5bWJvbCgnY29tcG9uZW50cy5nZXQnLCBrby5jb21wb25lbnRzLmdldCk7XG4gICAga28uZXhwb3J0U3ltYm9sKCdjb21wb25lbnRzLmNsZWFyQ2FjaGVkRGVmaW5pdGlvbicsIGtvLmNvbXBvbmVudHMuY2xlYXJDYWNoZWREZWZpbml0aW9uKTtcbn0pKCk7XG4oZnVuY3Rpb24odW5kZWZpbmVkKSB7XG5cbiAgICAvLyBUaGUgZGVmYXVsdCBsb2FkZXIgaXMgcmVzcG9uc2libGUgZm9yIHR3byB0aGluZ3M6XG4gICAgLy8gMS4gTWFpbnRhaW5pbmcgdGhlIGRlZmF1bHQgaW4tbWVtb3J5IHJlZ2lzdHJ5IG9mIGNvbXBvbmVudCBjb25maWd1cmF0aW9uIG9iamVjdHNcbiAgICAvLyAgICAoaS5lLiwgdGhlIHRoaW5nIHlvdSdyZSB3cml0aW5nIHRvIHdoZW4geW91IGNhbGwga28uY29tcG9uZW50cy5yZWdpc3Rlcihzb21lTmFtZSwgLi4uKSlcbiAgICAvLyAyLiBBbnN3ZXJpbmcgcmVxdWVzdHMgZm9yIGNvbXBvbmVudHMgYnkgZmV0Y2hpbmcgY29uZmlndXJhdGlvbiBvYmplY3RzXG4gICAgLy8gICAgZnJvbSB0aGF0IGRlZmF1bHQgaW4tbWVtb3J5IHJlZ2lzdHJ5IGFuZCByZXNvbHZpbmcgdGhlbSBpbnRvIHN0YW5kYXJkXG4gICAgLy8gICAgY29tcG9uZW50IGRlZmluaXRpb24gb2JqZWN0cyAob2YgdGhlIGZvcm0geyBjcmVhdGVWaWV3TW9kZWw6IC4uLiwgdGVtcGxhdGU6IC4uLiB9KVxuICAgIC8vIEN1c3RvbSBsb2FkZXJzIG1heSBvdmVycmlkZSBlaXRoZXIgb2YgdGhlc2UgZmFjaWxpdGllcywgaS5lLixcbiAgICAvLyAxLiBUbyBzdXBwbHkgY29uZmlndXJhdGlvbiBvYmplY3RzIGZyb20gc29tZSBvdGhlciBzb3VyY2UgKGUuZy4sIGNvbnZlbnRpb25zKVxuICAgIC8vIDIuIE9yLCB0byByZXNvbHZlIGNvbmZpZ3VyYXRpb24gb2JqZWN0cyBieSBsb2FkaW5nIHZpZXdtb2RlbHMvdGVtcGxhdGVzIHZpYSBhcmJpdHJhcnkgbG9naWMuXG5cbiAgICB2YXIgZGVmYXVsdENvbmZpZ1JlZ2lzdHJ5ID0ge307XG5cbiAgICBrby5jb21wb25lbnRzLnJlZ2lzdGVyID0gZnVuY3Rpb24oY29tcG9uZW50TmFtZSwgY29uZmlnKSB7XG4gICAgICAgIGlmICghY29uZmlnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29uZmlndXJhdGlvbiBmb3IgJyArIGNvbXBvbmVudE5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGtvLmNvbXBvbmVudHMuaXNSZWdpc3RlcmVkKGNvbXBvbmVudE5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbXBvbmVudCAnICsgY29tcG9uZW50TmFtZSArICcgaXMgYWxyZWFkeSByZWdpc3RlcmVkJyk7XG4gICAgICAgIH1cblxuICAgICAgICBkZWZhdWx0Q29uZmlnUmVnaXN0cnlbY29tcG9uZW50TmFtZV0gPSBjb25maWc7XG4gICAgfVxuXG4gICAga28uY29tcG9uZW50cy5pc1JlZ2lzdGVyZWQgPSBmdW5jdGlvbihjb21wb25lbnROYW1lKSB7XG4gICAgICAgIHJldHVybiBjb21wb25lbnROYW1lIGluIGRlZmF1bHRDb25maWdSZWdpc3RyeTtcbiAgICB9XG5cbiAgICBrby5jb21wb25lbnRzLnVucmVnaXN0ZXIgPSBmdW5jdGlvbihjb21wb25lbnROYW1lKSB7XG4gICAgICAgIGRlbGV0ZSBkZWZhdWx0Q29uZmlnUmVnaXN0cnlbY29tcG9uZW50TmFtZV07XG4gICAgICAgIGtvLmNvbXBvbmVudHMuY2xlYXJDYWNoZWREZWZpbml0aW9uKGNvbXBvbmVudE5hbWUpO1xuICAgIH1cblxuICAgIGtvLmNvbXBvbmVudHMuZGVmYXVsdExvYWRlciA9IHtcbiAgICAgICAgJ2dldENvbmZpZyc6IGZ1bmN0aW9uKGNvbXBvbmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gZGVmYXVsdENvbmZpZ1JlZ2lzdHJ5Lmhhc093blByb3BlcnR5KGNvbXBvbmVudE5hbWUpXG4gICAgICAgICAgICAgICAgPyBkZWZhdWx0Q29uZmlnUmVnaXN0cnlbY29tcG9uZW50TmFtZV1cbiAgICAgICAgICAgICAgICA6IG51bGw7XG4gICAgICAgICAgICBjYWxsYmFjayhyZXN1bHQpO1xuICAgICAgICB9LFxuXG4gICAgICAgICdsb2FkQ29tcG9uZW50JzogZnVuY3Rpb24oY29tcG9uZW50TmFtZSwgY29uZmlnLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgdmFyIGVycm9yQ2FsbGJhY2sgPSBtYWtlRXJyb3JDYWxsYmFjayhjb21wb25lbnROYW1lKTtcbiAgICAgICAgICAgIHBvc3NpYmx5R2V0Q29uZmlnRnJvbUFtZChlcnJvckNhbGxiYWNrLCBjb25maWcsIGZ1bmN0aW9uKGxvYWRlZENvbmZpZykge1xuICAgICAgICAgICAgICAgIHJlc29sdmVDb25maWcoY29tcG9uZW50TmFtZSwgZXJyb3JDYWxsYmFjaywgbG9hZGVkQ29uZmlnLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICAnbG9hZFRlbXBsYXRlJzogZnVuY3Rpb24oY29tcG9uZW50TmFtZSwgdGVtcGxhdGVDb25maWcsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICByZXNvbHZlVGVtcGxhdGUobWFrZUVycm9yQ2FsbGJhY2soY29tcG9uZW50TmFtZSksIHRlbXBsYXRlQ29uZmlnLCBjYWxsYmFjayk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJ2xvYWRWaWV3TW9kZWwnOiBmdW5jdGlvbihjb21wb25lbnROYW1lLCB2aWV3TW9kZWxDb25maWcsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICByZXNvbHZlVmlld01vZGVsKG1ha2VFcnJvckNhbGxiYWNrKGNvbXBvbmVudE5hbWUpLCB2aWV3TW9kZWxDb25maWcsIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgY3JlYXRlVmlld01vZGVsS2V5ID0gJ2NyZWF0ZVZpZXdNb2RlbCc7XG5cbiAgICAvLyBUYWtlcyBhIGNvbmZpZyBvYmplY3Qgb2YgdGhlIGZvcm0geyB0ZW1wbGF0ZTogLi4uLCB2aWV3TW9kZWw6IC4uLiB9LCBhbmQgYXN5bmNocm9ub3VzbHkgY29udmVydCBpdFxuICAgIC8vIGludG8gdGhlIHN0YW5kYXJkIGNvbXBvbmVudCBkZWZpbml0aW9uIGZvcm1hdDpcbiAgICAvLyAgICB7IHRlbXBsYXRlOiA8QXJyYXlPZkRvbU5vZGVzPiwgY3JlYXRlVmlld01vZGVsOiBmdW5jdGlvbihwYXJhbXMsIGNvbXBvbmVudEluZm8pIHsgLi4uIH0gfS5cbiAgICAvLyBTaW5jZSBib3RoIHRlbXBsYXRlIGFuZCB2aWV3TW9kZWwgbWF5IG5lZWQgdG8gYmUgcmVzb2x2ZWQgYXN5bmNocm9ub3VzbHksIGJvdGggdGFza3MgYXJlIHBlcmZvcm1lZFxuICAgIC8vIGluIHBhcmFsbGVsLCBhbmQgdGhlIHJlc3VsdHMgam9pbmVkIHdoZW4gYm90aCBhcmUgcmVhZHkuIFdlIGRvbid0IGRlcGVuZCBvbiBhbnkgcHJvbWlzZXMgaW5mcmFzdHJ1Y3R1cmUsXG4gICAgLy8gc28gdGhpcyBpcyBpbXBsZW1lbnRlZCBtYW51YWxseSBiZWxvdy5cbiAgICBmdW5jdGlvbiByZXNvbHZlQ29uZmlnKGNvbXBvbmVudE5hbWUsIGVycm9yQ2FsbGJhY2ssIGNvbmZpZywgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHt9LFxuICAgICAgICAgICAgbWFrZUNhbGxCYWNrV2hlblplcm8gPSAyLFxuICAgICAgICAgICAgdHJ5SXNzdWVDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICgtLW1ha2VDYWxsQmFja1doZW5aZXJvID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlQ29uZmlnID0gY29uZmlnWyd0ZW1wbGF0ZSddLFxuICAgICAgICAgICAgdmlld01vZGVsQ29uZmlnID0gY29uZmlnWyd2aWV3TW9kZWwnXTtcblxuICAgICAgICBpZiAodGVtcGxhdGVDb25maWcpIHtcbiAgICAgICAgICAgIHBvc3NpYmx5R2V0Q29uZmlnRnJvbUFtZChlcnJvckNhbGxiYWNrLCB0ZW1wbGF0ZUNvbmZpZywgZnVuY3Rpb24obG9hZGVkQ29uZmlnKSB7XG4gICAgICAgICAgICAgICAga28uY29tcG9uZW50cy5fZ2V0Rmlyc3RSZXN1bHRGcm9tTG9hZGVycygnbG9hZFRlbXBsYXRlJywgW2NvbXBvbmVudE5hbWUsIGxvYWRlZENvbmZpZ10sIGZ1bmN0aW9uKHJlc29sdmVkVGVtcGxhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0Wyd0ZW1wbGF0ZSddID0gcmVzb2x2ZWRUZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgdHJ5SXNzdWVDYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cnlJc3N1ZUNhbGxiYWNrKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmlld01vZGVsQ29uZmlnKSB7XG4gICAgICAgICAgICBwb3NzaWJseUdldENvbmZpZ0Zyb21BbWQoZXJyb3JDYWxsYmFjaywgdmlld01vZGVsQ29uZmlnLCBmdW5jdGlvbihsb2FkZWRDb25maWcpIHtcbiAgICAgICAgICAgICAgICBrby5jb21wb25lbnRzLl9nZXRGaXJzdFJlc3VsdEZyb21Mb2FkZXJzKCdsb2FkVmlld01vZGVsJywgW2NvbXBvbmVudE5hbWUsIGxvYWRlZENvbmZpZ10sIGZ1bmN0aW9uKHJlc29sdmVkVmlld01vZGVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtjcmVhdGVWaWV3TW9kZWxLZXldID0gcmVzb2x2ZWRWaWV3TW9kZWw7XG4gICAgICAgICAgICAgICAgICAgIHRyeUlzc3VlQ2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHJ5SXNzdWVDYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzb2x2ZVRlbXBsYXRlKGVycm9yQ2FsbGJhY2ssIHRlbXBsYXRlQ29uZmlnLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAodHlwZW9mIHRlbXBsYXRlQ29uZmlnID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgLy8gTWFya3VwIC0gcGFyc2UgaXRcbiAgICAgICAgICAgIGNhbGxiYWNrKGtvLnV0aWxzLnBhcnNlSHRtbEZyYWdtZW50KHRlbXBsYXRlQ29uZmlnKSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGVtcGxhdGVDb25maWcgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgLy8gQXNzdW1lIGFscmVhZHkgYW4gYXJyYXkgb2YgRE9NIG5vZGVzIC0gcGFzcyB0aHJvdWdoIHVuY2hhbmdlZFxuICAgICAgICAgICAgY2FsbGJhY2sodGVtcGxhdGVDb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzRG9jdW1lbnRGcmFnbWVudCh0ZW1wbGF0ZUNvbmZpZykpIHtcbiAgICAgICAgICAgIC8vIERvY3VtZW50IGZyYWdtZW50IC0gdXNlIGl0cyBjaGlsZCBub2Rlc1xuICAgICAgICAgICAgY2FsbGJhY2soa28udXRpbHMubWFrZUFycmF5KHRlbXBsYXRlQ29uZmlnLmNoaWxkTm9kZXMpKTtcbiAgICAgICAgfSBlbHNlIGlmICh0ZW1wbGF0ZUNvbmZpZ1snZWxlbWVudCddKSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IHRlbXBsYXRlQ29uZmlnWydlbGVtZW50J107XG4gICAgICAgICAgICBpZiAoaXNEb21FbGVtZW50KGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgLy8gRWxlbWVudCBpbnN0YW5jZSAtIGNvcHkgaXRzIGNoaWxkIG5vZGVzXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soY2xvbmVOb2Rlc0Zyb21UZW1wbGF0ZVNvdXJjZUVsZW1lbnQoZWxlbWVudCkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAvLyBFbGVtZW50IElEIC0gZmluZCBpdCwgdGhlbiBjb3B5IGl0cyBjaGlsZCBub2Rlc1xuICAgICAgICAgICAgICAgIHZhciBlbGVtSW5zdGFuY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbUluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGNsb25lTm9kZXNGcm9tVGVtcGxhdGVTb3VyY2VFbGVtZW50KGVsZW1JbnN0YW5jZSkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yQ2FsbGJhY2soJ0Nhbm5vdCBmaW5kIGVsZW1lbnQgd2l0aCBJRCAnICsgZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlcnJvckNhbGxiYWNrKCdVbmtub3duIGVsZW1lbnQgdHlwZTogJyArIGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXJyb3JDYWxsYmFjaygnVW5rbm93biB0ZW1wbGF0ZSB2YWx1ZTogJyArIHRlbXBsYXRlQ29uZmlnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlc29sdmVWaWV3TW9kZWwoZXJyb3JDYWxsYmFjaywgdmlld01vZGVsQ29uZmlnLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAodHlwZW9mIHZpZXdNb2RlbENvbmZpZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgLy8gQ29uc3RydWN0b3IgLSBjb252ZXJ0IHRvIHN0YW5kYXJkIGZhY3RvcnkgZnVuY3Rpb24gZm9ybWF0XG4gICAgICAgICAgICAvLyBCeSBkZXNpZ24sIHRoaXMgZG9lcyAqbm90KiBzdXBwbHkgY29tcG9uZW50SW5mbyB0byB0aGUgY29uc3RydWN0b3IsIGFzIHRoZSBpbnRlbnQgaXMgdGhhdFxuICAgICAgICAgICAgLy8gY29tcG9uZW50SW5mbyBjb250YWlucyBub24tdmlld21vZGVsIGRhdGEgKGUuZy4sIHRoZSBjb21wb25lbnQncyBlbGVtZW50KSB0aGF0IHNob3VsZCBvbmx5XG4gICAgICAgICAgICAvLyBiZSB1c2VkIGluIGZhY3RvcnkgZnVuY3Rpb25zLCBub3Qgdmlld21vZGVsIGNvbnN0cnVjdG9ycy5cbiAgICAgICAgICAgIGNhbGxiYWNrKGZ1bmN0aW9uIChwYXJhbXMgLyosIGNvbXBvbmVudEluZm8gKi8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHZpZXdNb2RlbENvbmZpZyhwYXJhbXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZpZXdNb2RlbENvbmZpZ1tjcmVhdGVWaWV3TW9kZWxLZXldID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAvLyBBbHJlYWR5IGEgZmFjdG9yeSBmdW5jdGlvbiAtIHVzZSBpdCBhcy1pc1xuICAgICAgICAgICAgY2FsbGJhY2sodmlld01vZGVsQ29uZmlnW2NyZWF0ZVZpZXdNb2RlbEtleV0pO1xuICAgICAgICB9IGVsc2UgaWYgKCdpbnN0YW5jZScgaW4gdmlld01vZGVsQ29uZmlnKSB7XG4gICAgICAgICAgICAvLyBGaXhlZCBvYmplY3QgaW5zdGFuY2UgLSBwcm9tb3RlIHRvIGNyZWF0ZVZpZXdNb2RlbCBmb3JtYXQgZm9yIEFQSSBjb25zaXN0ZW5jeVxuICAgICAgICAgICAgdmFyIGZpeGVkSW5zdGFuY2UgPSB2aWV3TW9kZWxDb25maWdbJ2luc3RhbmNlJ107XG4gICAgICAgICAgICBjYWxsYmFjayhmdW5jdGlvbiAocGFyYW1zLCBjb21wb25lbnRJbmZvKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpeGVkSW5zdGFuY2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmICgndmlld01vZGVsJyBpbiB2aWV3TW9kZWxDb25maWcpIHtcbiAgICAgICAgICAgIC8vIFJlc29sdmVkIEFNRCBtb2R1bGUgd2hvc2UgdmFsdWUgaXMgb2YgdGhlIGZvcm0geyB2aWV3TW9kZWw6IC4uLiB9XG4gICAgICAgICAgICByZXNvbHZlVmlld01vZGVsKGVycm9yQ2FsbGJhY2ssIHZpZXdNb2RlbENvbmZpZ1sndmlld01vZGVsJ10sIGNhbGxiYWNrKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVycm9yQ2FsbGJhY2soJ1Vua25vd24gdmlld01vZGVsIHZhbHVlOiAnICsgdmlld01vZGVsQ29uZmlnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsb25lTm9kZXNGcm9tVGVtcGxhdGVTb3VyY2VFbGVtZW50KGVsZW1JbnN0YW5jZSkge1xuICAgICAgICBzd2l0Y2ggKGtvLnV0aWxzLnRhZ05hbWVMb3dlcihlbGVtSW5zdGFuY2UpKSB7XG4gICAgICAgICAgICBjYXNlICdzY3JpcHQnOlxuICAgICAgICAgICAgICAgIHJldHVybiBrby51dGlscy5wYXJzZUh0bWxGcmFnbWVudChlbGVtSW5zdGFuY2UudGV4dCk7XG4gICAgICAgICAgICBjYXNlICd0ZXh0YXJlYSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtvLnV0aWxzLnBhcnNlSHRtbEZyYWdtZW50KGVsZW1JbnN0YW5jZS52YWx1ZSk7XG4gICAgICAgICAgICBjYXNlICd0ZW1wbGF0ZSc6XG4gICAgICAgICAgICAgICAgLy8gRm9yIGJyb3dzZXJzIHdpdGggcHJvcGVyIDx0ZW1wbGF0ZT4gZWxlbWVudCBzdXBwb3J0IChpLmUuLCB3aGVyZSB0aGUgLmNvbnRlbnQgcHJvcGVydHlcbiAgICAgICAgICAgICAgICAvLyBnaXZlcyBhIGRvY3VtZW50IGZyYWdtZW50KSwgdXNlIHRoYXQgZG9jdW1lbnQgZnJhZ21lbnQuXG4gICAgICAgICAgICAgICAgaWYgKGlzRG9jdW1lbnRGcmFnbWVudChlbGVtSW5zdGFuY2UuY29udGVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtvLnV0aWxzLmNsb25lTm9kZXMoZWxlbUluc3RhbmNlLmNvbnRlbnQuY2hpbGROb2Rlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVndWxhciBlbGVtZW50cyBzdWNoIGFzIDxkaXY+LCBhbmQgPHRlbXBsYXRlPiBlbGVtZW50cyBvbiBvbGQgYnJvd3NlcnMgdGhhdCBkb24ndCByZWFsbHlcbiAgICAgICAgLy8gdW5kZXJzdGFuZCA8dGVtcGxhdGU+IGFuZCBqdXN0IHRyZWF0IGl0IGFzIGEgcmVndWxhciBjb250YWluZXJcbiAgICAgICAgcmV0dXJuIGtvLnV0aWxzLmNsb25lTm9kZXMoZWxlbUluc3RhbmNlLmNoaWxkTm9kZXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRG9tRWxlbWVudChvYmopIHtcbiAgICAgICAgaWYgKHdpbmRvd1snSFRNTEVsZW1lbnQnXSkge1xuICAgICAgICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIEhUTUxFbGVtZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG9iaiAmJiBvYmoudGFnTmFtZSAmJiBvYmoubm9kZVR5cGUgPT09IDE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0RvY3VtZW50RnJhZ21lbnQob2JqKSB7XG4gICAgICAgIGlmICh3aW5kb3dbJ0RvY3VtZW50RnJhZ21lbnQnXSkge1xuICAgICAgICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqICYmIG9iai5ub2RlVHlwZSA9PT0gMTE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwb3NzaWJseUdldENvbmZpZ0Zyb21BbWQoZXJyb3JDYWxsYmFjaywgY29uZmlnLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZ1sncmVxdWlyZSddID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgLy8gVGhlIGNvbmZpZyBpcyB0aGUgdmFsdWUgb2YgYW4gQU1EIG1vZHVsZVxuICAgICAgICAgICAgaWYgKHJlcXVpcmUgfHwgd2luZG93WydyZXF1aXJlJ10pIHtcbiAgICAgICAgICAgICAgICAocmVxdWlyZSB8fCB3aW5kb3dbJ3JlcXVpcmUnXSkoW2NvbmZpZ1sncmVxdWlyZSddXSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlcnJvckNhbGxiYWNrKCdVc2VzIHJlcXVpcmUsIGJ1dCBubyBBTUQgbG9hZGVyIGlzIHByZXNlbnQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGNvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlRXJyb3JDYWxsYmFjayhjb21wb25lbnROYW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb21wb25lbnQgXFwnJyArIGNvbXBvbmVudE5hbWUgKyAnXFwnOiAnICsgbWVzc2FnZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAga28uZXhwb3J0U3ltYm9sKCdjb21wb25lbnRzLnJlZ2lzdGVyJywga28uY29tcG9uZW50cy5yZWdpc3Rlcik7XG4gICAga28uZXhwb3J0U3ltYm9sKCdjb21wb25lbnRzLmlzUmVnaXN0ZXJlZCcsIGtvLmNvbXBvbmVudHMuaXNSZWdpc3RlcmVkKTtcbiAgICBrby5leHBvcnRTeW1ib2woJ2NvbXBvbmVudHMudW5yZWdpc3RlcicsIGtvLmNvbXBvbmVudHMudW5yZWdpc3Rlcik7XG5cbiAgICAvLyBFeHBvc2UgdGhlIGRlZmF1bHQgbG9hZGVyIHNvIHRoYXQgZGV2ZWxvcGVycyBjYW4gZGlyZWN0bHkgYXNrIGl0IGZvciBjb25maWd1cmF0aW9uXG4gICAgLy8gb3IgdG8gcmVzb2x2ZSBjb25maWd1cmF0aW9uXG4gICAga28uZXhwb3J0U3ltYm9sKCdjb21wb25lbnRzLmRlZmF1bHRMb2FkZXInLCBrby5jb21wb25lbnRzLmRlZmF1bHRMb2FkZXIpO1xuXG4gICAgLy8gQnkgZGVmYXVsdCwgdGhlIGRlZmF1bHQgbG9hZGVyIGlzIHRoZSBvbmx5IHJlZ2lzdGVyZWQgY29tcG9uZW50IGxvYWRlclxuICAgIGtvLmNvbXBvbmVudHNbJ2xvYWRlcnMnXS5wdXNoKGtvLmNvbXBvbmVudHMuZGVmYXVsdExvYWRlcik7XG5cbiAgICAvLyBQcml2YXRlbHkgZXhwb3NlIHRoZSB1bmRlcmx5aW5nIGNvbmZpZyByZWdpc3RyeSBmb3IgdXNlIGluIG9sZC1JRSBzaGltXG4gICAga28uY29tcG9uZW50cy5fYWxsUmVnaXN0ZXJlZENvbXBvbmVudHMgPSBkZWZhdWx0Q29uZmlnUmVnaXN0cnk7XG59KSgpO1xuKGZ1bmN0aW9uICh1bmRlZmluZWQpIHtcbiAgICAvLyBPdmVycmlkYWJsZSBBUEkgZm9yIGRldGVybWluaW5nIHdoaWNoIGNvbXBvbmVudCBuYW1lIGFwcGxpZXMgdG8gYSBnaXZlbiBub2RlLiBCeSBvdmVycmlkaW5nIHRoaXMsXG4gICAgLy8geW91IGNhbiBmb3IgZXhhbXBsZSBtYXAgc3BlY2lmaWMgdGFnTmFtZXMgdG8gY29tcG9uZW50cyB0aGF0IGFyZSBub3QgcHJlcmVnaXN0ZXJlZC5cbiAgICBrby5jb21wb25lbnRzWydnZXRDb21wb25lbnROYW1lRm9yTm9kZSddID0gZnVuY3Rpb24obm9kZSkge1xuICAgICAgICB2YXIgdGFnTmFtZUxvd2VyID0ga28udXRpbHMudGFnTmFtZUxvd2VyKG5vZGUpO1xuICAgICAgICByZXR1cm4ga28uY29tcG9uZW50cy5pc1JlZ2lzdGVyZWQodGFnTmFtZUxvd2VyKSAmJiB0YWdOYW1lTG93ZXI7XG4gICAgfTtcblxuICAgIGtvLmNvbXBvbmVudHMuYWRkQmluZGluZ3NGb3JDdXN0b21FbGVtZW50ID0gZnVuY3Rpb24oYWxsQmluZGluZ3MsIG5vZGUsIGJpbmRpbmdDb250ZXh0LCB2YWx1ZUFjY2Vzc29ycykge1xuICAgICAgICAvLyBEZXRlcm1pbmUgaWYgaXQncyByZWFsbHkgYSBjdXN0b20gZWxlbWVudCBtYXRjaGluZyBhIGNvbXBvbmVudFxuICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgICAgICAgdmFyIGNvbXBvbmVudE5hbWUgPSBrby5jb21wb25lbnRzWydnZXRDb21wb25lbnROYW1lRm9yTm9kZSddKG5vZGUpO1xuICAgICAgICAgICAgaWYgKGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICAvLyBJdCBkb2VzIHJlcHJlc2VudCBhIGNvbXBvbmVudCwgc28gYWRkIGEgY29tcG9uZW50IGJpbmRpbmcgZm9yIGl0XG4gICAgICAgICAgICAgICAgYWxsQmluZGluZ3MgPSBhbGxCaW5kaW5ncyB8fCB7fTtcblxuICAgICAgICAgICAgICAgIGlmIChhbGxCaW5kaW5nc1snY29tcG9uZW50J10pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQXZvaWQgc2lsZW50bHkgb3ZlcndyaXRpbmcgc29tZSBvdGhlciAnY29tcG9uZW50JyBiaW5kaW5nIHRoYXQgbWF5IGFscmVhZHkgYmUgb24gdGhlIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgdXNlIHRoZSBcImNvbXBvbmVudFwiIGJpbmRpbmcgb24gYSBjdXN0b20gZWxlbWVudCBtYXRjaGluZyBhIGNvbXBvbmVudCcpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBjb21wb25lbnRCaW5kaW5nVmFsdWUgPSB7ICduYW1lJzogY29tcG9uZW50TmFtZSwgJ3BhcmFtcyc6IGdldENvbXBvbmVudFBhcmFtc0Zyb21DdXN0b21FbGVtZW50KG5vZGUsIGJpbmRpbmdDb250ZXh0KSB9O1xuXG4gICAgICAgICAgICAgICAgYWxsQmluZGluZ3NbJ2NvbXBvbmVudCddID0gdmFsdWVBY2Nlc3NvcnNcbiAgICAgICAgICAgICAgICAgICAgPyBmdW5jdGlvbigpIHsgcmV0dXJuIGNvbXBvbmVudEJpbmRpbmdWYWx1ZTsgfVxuICAgICAgICAgICAgICAgICAgICA6IGNvbXBvbmVudEJpbmRpbmdWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhbGxCaW5kaW5ncztcbiAgICB9XG5cbiAgICB2YXIgbmF0aXZlQmluZGluZ1Byb3ZpZGVySW5zdGFuY2UgPSBuZXcga28uYmluZGluZ1Byb3ZpZGVyKCk7XG5cbiAgICBmdW5jdGlvbiBnZXRDb21wb25lbnRQYXJhbXNGcm9tQ3VzdG9tRWxlbWVudChlbGVtLCBiaW5kaW5nQ29udGV4dCkge1xuICAgICAgICB2YXIgcGFyYW1zQXR0cmlidXRlID0gZWxlbS5nZXRBdHRyaWJ1dGUoJ3BhcmFtcycpO1xuXG4gICAgICAgIGlmIChwYXJhbXNBdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSBuYXRpdmVCaW5kaW5nUHJvdmlkZXJJbnN0YW5jZVsncGFyc2VCaW5kaW5nc1N0cmluZyddKHBhcmFtc0F0dHJpYnV0ZSwgYmluZGluZ0NvbnRleHQsIGVsZW0sIHsgJ3ZhbHVlQWNjZXNzb3JzJzogdHJ1ZSwgJ2JpbmRpbmdQYXJhbXMnOiB0cnVlIH0pLFxuICAgICAgICAgICAgICAgIHJhd1BhcmFtQ29tcHV0ZWRWYWx1ZXMgPSBrby51dGlscy5vYmplY3RNYXAocGFyYW1zLCBmdW5jdGlvbihwYXJhbVZhbHVlLCBwYXJhbU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtvLmNvbXB1dGVkKHBhcmFtVmFsdWUsIG51bGwsIHsgZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkOiBlbGVtIH0pO1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGtvLnV0aWxzLm9iamVjdE1hcChyYXdQYXJhbUNvbXB1dGVkVmFsdWVzLCBmdW5jdGlvbihwYXJhbVZhbHVlQ29tcHV0ZWQsIHBhcmFtTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBEb2VzIHRoZSBldmFsdWF0aW9uIG9mIHRoZSBwYXJhbWV0ZXIgdmFsdWUgdW53cmFwIGFueSBvYnNlcnZhYmxlcz9cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwYXJhbVZhbHVlQ29tcHV0ZWQuaXNBY3RpdmUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm8gaXQgZG9lc24ndCwgc28gdGhlcmUncyBubyBuZWVkIGZvciBhbnkgY29tcHV0ZWQgd3JhcHBlci4gSnVzdCBwYXNzIHRocm91Z2ggdGhlIHN1cHBsaWVkIHZhbHVlIGRpcmVjdGx5LlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRXhhbXBsZTogXCJzb21lVmFsOiBmaXJzdE5hbWUsIGFnZTogMTIzXCIgKHdoZXRoZXIgb3Igbm90IGZpcnN0TmFtZSBpcyBhbiBvYnNlcnZhYmxlL2NvbXB1dGVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcmFtVmFsdWVDb21wdXRlZC5wZWVrKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBZZXMgaXQgZG9lcy4gU3VwcGx5IGEgY29tcHV0ZWQgcHJvcGVydHkgdGhhdCB1bndyYXBzIGJvdGggdGhlIG91dGVyIChiaW5kaW5nIGV4cHJlc3Npb24pXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBsZXZlbCBvZiBvYnNlcnZhYmlsaXR5LCBhbmQgYW55IGlubmVyIChyZXN1bHRpbmcgbW9kZWwgdmFsdWUpIGxldmVsIG9mIG9ic2VydmFiaWxpdHkuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIG1lYW5zIHRoZSBjb21wb25lbnQgZG9lc24ndCBoYXZlIHRvIHdvcnJ5IGFib3V0IG11bHRpcGxlIHVud3JhcHBpbmcuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUocGFyYW1WYWx1ZUNvbXB1dGVkKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgeyBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IGVsZW0gfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gR2l2ZSBhY2Nlc3MgdG8gdGhlIHJhdyBjb21wdXRlZHMsIGFzIGxvbmcgYXMgdGhhdCB3b3VsZG4ndCBvdmVyd3JpdGUgYW55IGN1c3RvbSBwYXJhbSBhbHNvIGNhbGxlZCAnJHJhdydcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgaW4gY2FzZSB0aGUgZGV2ZWxvcGVyIHdhbnRzIHRvIHJlYWN0IHRvIG91dGVyIChiaW5kaW5nKSBvYnNlcnZhYmlsaXR5IHNlcGFyYXRlbHkgZnJvbSBpbm5lclxuICAgICAgICAgICAgLy8gKG1vZGVsIHZhbHVlKSBvYnNlcnZhYmlsaXR5LCBvciBpbiBjYXNlIHRoZSBtb2RlbCB2YWx1ZSBvYnNlcnZhYmxlIGhhcyBzdWJvYnNlcnZhYmxlcy5cbiAgICAgICAgICAgIGlmICghcmVzdWx0Lmhhc093blByb3BlcnR5KCckcmF3JykpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbJyRyYXcnXSA9IHJhd1BhcmFtQ29tcHV0ZWRWYWx1ZXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBGb3IgY29uc2lzdGVuY3ksIGFic2VuY2Ugb2YgYSBcInBhcmFtc1wiIGF0dHJpYnV0ZSBpcyB0cmVhdGVkIHRoZSBzYW1lIGFzIHRoZSBwcmVzZW5jZSBvZlxuICAgICAgICAgICAgLy8gYW55IGVtcHR5IG9uZS4gT3RoZXJ3aXNlIGNvbXBvbmVudCB2aWV3bW9kZWxzIG5lZWQgc3BlY2lhbCBjb2RlIHRvIGNoZWNrIHdoZXRoZXIgb3Igbm90XG4gICAgICAgICAgICAvLyAncGFyYW1zJyBvciAncGFyYW1zLiRyYXcnIGlzIG51bGwvdW5kZWZpbmVkIGJlZm9yZSByZWFkaW5nIHN1YnByb3BlcnRpZXMsIHdoaWNoIGlzIGFubm95aW5nLlxuICAgICAgICAgICAgcmV0dXJuIHsgJyRyYXcnOiB7fSB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBDb21wYXRpYmlsaXR5IGNvZGUgZm9yIG9sZGVyIChwcmUtSFRNTDUpIElFIGJyb3dzZXJzXG5cbiAgICBpZiAoa28udXRpbHMuaWVWZXJzaW9uIDwgOSkge1xuICAgICAgICAvLyBXaGVuZXZlciB5b3UgcHJlcmVnaXN0ZXIgYSBjb21wb25lbnQsIGVuYWJsZSBpdCBhcyBhIGN1c3RvbSBlbGVtZW50IGluIHRoZSBjdXJyZW50IGRvY3VtZW50XG4gICAgICAgIGtvLmNvbXBvbmVudHNbJ3JlZ2lzdGVyJ10gPSAoZnVuY3Rpb24ob3JpZ2luYWxGdW5jdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGNvbXBvbmVudE5hbWUpOyAvLyBBbGxvd3MgSUU8OSB0byBwYXJzZSBtYXJrdXAgY29udGFpbmluZyB0aGUgY3VzdG9tIGVsZW1lbnRcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxGdW5jdGlvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KShrby5jb21wb25lbnRzWydyZWdpc3RlciddKTtcblxuICAgICAgICAvLyBXaGVuZXZlciB5b3UgY3JlYXRlIGEgZG9jdW1lbnQgZnJhZ21lbnQsIGVuYWJsZSBhbGwgcHJlcmVnaXN0ZXJlZCBjb21wb25lbnQgbmFtZXMgYXMgY3VzdG9tIGVsZW1lbnRzXG4gICAgICAgIC8vIFRoaXMgaXMgbmVlZGVkIHRvIG1ha2UgaW5uZXJTaGl2L2pRdWVyeSBIVE1MIHBhcnNpbmcgY29ycmVjdGx5IGhhbmRsZSB0aGUgY3VzdG9tIGVsZW1lbnRzXG4gICAgICAgIGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQgPSAoZnVuY3Rpb24ob3JpZ2luYWxGdW5jdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBuZXdEb2NGcmFnID0gb3JpZ2luYWxGdW5jdGlvbigpLFxuICAgICAgICAgICAgICAgICAgICBhbGxDb21wb25lbnRzID0ga28uY29tcG9uZW50cy5fYWxsUmVnaXN0ZXJlZENvbXBvbmVudHM7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgY29tcG9uZW50TmFtZSBpbiBhbGxDb21wb25lbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbGxDb21wb25lbnRzLmhhc093blByb3BlcnR5KGNvbXBvbmVudE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdEb2NGcmFnLmNyZWF0ZUVsZW1lbnQoY29tcG9uZW50TmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ld0RvY0ZyYWc7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KShkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KTtcbiAgICB9XG59KSgpOyhmdW5jdGlvbih1bmRlZmluZWQpIHtcblxuICAgIHZhciBjb21wb25lbnRMb2FkaW5nT3BlcmF0aW9uVW5pcXVlSWQgPSAwO1xuXG4gICAga28uYmluZGluZ0hhbmRsZXJzWydjb21wb25lbnQnXSA9IHtcbiAgICAgICAgJ2luaXQnOiBmdW5jdGlvbihlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBpZ25vcmVkMSwgaWdub3JlZDIsIGJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudFZpZXdNb2RlbCxcbiAgICAgICAgICAgICAgICBjdXJyZW50TG9hZGluZ09wZXJhdGlvbklkLFxuICAgICAgICAgICAgICAgIGRpc3Bvc2VBc3NvY2lhdGVkQ29tcG9uZW50Vmlld01vZGVsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudFZpZXdNb2RlbERpc3Bvc2UgPSBjdXJyZW50Vmlld01vZGVsICYmIGN1cnJlbnRWaWV3TW9kZWxbJ2Rpc3Bvc2UnXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjdXJyZW50Vmlld01vZGVsRGlzcG9zZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFZpZXdNb2RlbERpc3Bvc2UuY2FsbChjdXJyZW50Vmlld01vZGVsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIEFueSBpbi1mbGlnaHQgbG9hZGluZyBvcGVyYXRpb24gaXMgbm8gbG9uZ2VyIHJlbGV2YW50LCBzbyBtYWtlIHN1cmUgd2UgaWdub3JlIGl0cyBjb21wbGV0aW9uXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRMb2FkaW5nT3BlcmF0aW9uSWQgPSBudWxsO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbC5hZGREaXNwb3NlQ2FsbGJhY2soZWxlbWVudCwgZGlzcG9zZUFzc29jaWF0ZWRDb21wb25lbnRWaWV3TW9kZWwpO1xuXG4gICAgICAgICAgICBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZUFjY2Vzc29yKCkpLFxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnROYW1lLCBjb21wb25lbnRQYXJhbXM7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnROYW1lID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50TmFtZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVbJ25hbWUnXSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudFBhcmFtcyA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVbJ3BhcmFtcyddKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoIWNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBjb21wb25lbnQgbmFtZSBzcGVjaWZpZWQnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgbG9hZGluZ09wZXJhdGlvbklkID0gY3VycmVudExvYWRpbmdPcGVyYXRpb25JZCA9ICsrY29tcG9uZW50TG9hZGluZ09wZXJhdGlvblVuaXF1ZUlkO1xuICAgICAgICAgICAgICAgIGtvLmNvbXBvbmVudHMuZ2V0KGNvbXBvbmVudE5hbWUsIGZ1bmN0aW9uKGNvbXBvbmVudERlZmluaXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyBub3QgdGhlIGN1cnJlbnQgbG9hZCBvcGVyYXRpb24gZm9yIHRoaXMgZWxlbWVudCwgaWdub3JlIGl0LlxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudExvYWRpbmdPcGVyYXRpb25JZCAhPT0gbG9hZGluZ09wZXJhdGlvbklkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBDbGVhbiB1cCBwcmV2aW91cyBzdGF0ZVxuICAgICAgICAgICAgICAgICAgICBkaXNwb3NlQXNzb2NpYXRlZENvbXBvbmVudFZpZXdNb2RlbCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEluc3RhbnRpYXRlIGFuZCBiaW5kIG5ldyBjb21wb25lbnQuIEltcGxpY2l0bHkgdGhpcyBjbGVhbnMgYW55IG9sZCBET00gbm9kZXMuXG4gICAgICAgICAgICAgICAgICAgIGlmICghY29tcG9uZW50RGVmaW5pdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGNvbXBvbmVudCBcXCcnICsgY29tcG9uZW50TmFtZSArICdcXCcnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjbG9uZVRlbXBsYXRlSW50b0VsZW1lbnQoY29tcG9uZW50TmFtZSwgY29tcG9uZW50RGVmaW5pdGlvbiwgZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb21wb25lbnRWaWV3TW9kZWwgPSBjcmVhdGVWaWV3TW9kZWwoY29tcG9uZW50RGVmaW5pdGlvbiwgZWxlbWVudCwgY29tcG9uZW50UGFyYW1zKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkQmluZGluZ0NvbnRleHQgPSBiaW5kaW5nQ29udGV4dFsnY3JlYXRlQ2hpbGRDb250ZXh0J10oY29tcG9uZW50Vmlld01vZGVsKTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFZpZXdNb2RlbCA9IGNvbXBvbmVudFZpZXdNb2RlbDtcbiAgICAgICAgICAgICAgICAgICAga28uYXBwbHlCaW5kaW5nc1RvRGVzY2VuZGFudHMoY2hpbGRCaW5kaW5nQ29udGV4dCwgZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LCBudWxsLCB7IGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZDogZWxlbWVudCB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHsgJ2NvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzJzogdHJ1ZSB9O1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGtvLnZpcnR1YWxFbGVtZW50cy5hbGxvd2VkQmluZGluZ3NbJ2NvbXBvbmVudCddID0gdHJ1ZTtcblxuICAgIGZ1bmN0aW9uIGNsb25lVGVtcGxhdGVJbnRvRWxlbWVudChjb21wb25lbnROYW1lLCBjb21wb25lbnREZWZpbml0aW9uLCBlbGVtZW50KSB7XG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9IGNvbXBvbmVudERlZmluaXRpb25bJ3RlbXBsYXRlJ107XG4gICAgICAgIGlmICghdGVtcGxhdGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ29tcG9uZW50IFxcJycgKyBjb21wb25lbnROYW1lICsgJ1xcJyBoYXMgbm8gdGVtcGxhdGUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjbG9uZWROb2Rlc0FycmF5ID0ga28udXRpbHMuY2xvbmVOb2Rlcyh0ZW1wbGF0ZSk7XG4gICAgICAgIGtvLnZpcnR1YWxFbGVtZW50cy5zZXREb21Ob2RlQ2hpbGRyZW4oZWxlbWVudCwgY2xvbmVkTm9kZXNBcnJheSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlVmlld01vZGVsKGNvbXBvbmVudERlZmluaXRpb24sIGVsZW1lbnQsIGNvbXBvbmVudFBhcmFtcykge1xuICAgICAgICB2YXIgY29tcG9uZW50Vmlld01vZGVsRmFjdG9yeSA9IGNvbXBvbmVudERlZmluaXRpb25bJ2NyZWF0ZVZpZXdNb2RlbCddO1xuICAgICAgICByZXR1cm4gY29tcG9uZW50Vmlld01vZGVsRmFjdG9yeVxuICAgICAgICAgICAgPyBjb21wb25lbnRWaWV3TW9kZWxGYWN0b3J5LmNhbGwoY29tcG9uZW50RGVmaW5pdGlvbiwgY29tcG9uZW50UGFyYW1zLCB7IGVsZW1lbnQ6IGVsZW1lbnQgfSlcbiAgICAgICAgICAgIDogY29tcG9uZW50UGFyYW1zOyAvLyBUZW1wbGF0ZS1vbmx5IGNvbXBvbmVudFxuICAgIH1cblxufSkoKTtcbnZhciBhdHRySHRtbFRvSmF2YXNjcmlwdE1hcCA9IHsgJ2NsYXNzJzogJ2NsYXNzTmFtZScsICdmb3InOiAnaHRtbEZvcicgfTtcbmtvLmJpbmRpbmdIYW5kbGVyc1snYXR0ciddID0ge1xuICAgICd1cGRhdGUnOiBmdW5jdGlvbihlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5ncykge1xuICAgICAgICB2YXIgdmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSkgfHwge307XG4gICAgICAgIGtvLnV0aWxzLm9iamVjdEZvckVhY2godmFsdWUsIGZ1bmN0aW9uKGF0dHJOYW1lLCBhdHRyVmFsdWUpIHtcbiAgICAgICAgICAgIGF0dHJWYWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUoYXR0clZhbHVlKTtcblxuICAgICAgICAgICAgLy8gVG8gY292ZXIgY2FzZXMgbGlrZSBcImF0dHI6IHsgY2hlY2tlZDpzb21lUHJvcCB9XCIsIHdlIHdhbnQgdG8gcmVtb3ZlIHRoZSBhdHRyaWJ1dGUgZW50aXJlbHlcbiAgICAgICAgICAgIC8vIHdoZW4gc29tZVByb3AgaXMgYSBcIm5vIHZhbHVlXCItbGlrZSB2YWx1ZSAoc3RyaWN0bHkgbnVsbCwgZmFsc2UsIG9yIHVuZGVmaW5lZClcbiAgICAgICAgICAgIC8vIChiZWNhdXNlIHRoZSBhYnNlbmNlIG9mIHRoZSBcImNoZWNrZWRcIiBhdHRyIGlzIGhvdyB0byBtYXJrIGFuIGVsZW1lbnQgYXMgbm90IGNoZWNrZWQsIGV0Yy4pXG4gICAgICAgICAgICB2YXIgdG9SZW1vdmUgPSAoYXR0clZhbHVlID09PSBmYWxzZSkgfHwgKGF0dHJWYWx1ZSA9PT0gbnVsbCkgfHwgKGF0dHJWYWx1ZSA9PT0gdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIGlmICh0b1JlbW92ZSlcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShhdHRyTmFtZSk7XG5cbiAgICAgICAgICAgIC8vIEluIElFIDw9IDcgYW5kIElFOCBRdWlya3MgTW9kZSwgeW91IGhhdmUgdG8gdXNlIHRoZSBKYXZhc2NyaXB0IHByb3BlcnR5IG5hbWUgaW5zdGVhZCBvZiB0aGVcbiAgICAgICAgICAgIC8vIEhUTUwgYXR0cmlidXRlIG5hbWUgZm9yIGNlcnRhaW4gYXR0cmlidXRlcy4gSUU4IFN0YW5kYXJkcyBNb2RlIHN1cHBvcnRzIHRoZSBjb3JyZWN0IGJlaGF2aW9yLFxuICAgICAgICAgICAgLy8gYnV0IGluc3RlYWQgb2YgZmlndXJpbmcgb3V0IHRoZSBtb2RlLCB3ZSdsbCBqdXN0IHNldCB0aGUgYXR0cmlidXRlIHRocm91Z2ggdGhlIEphdmFzY3JpcHRcbiAgICAgICAgICAgIC8vIHByb3BlcnR5IGZvciBJRSA8PSA4LlxuICAgICAgICAgICAgaWYgKGtvLnV0aWxzLmllVmVyc2lvbiA8PSA4ICYmIGF0dHJOYW1lIGluIGF0dHJIdG1sVG9KYXZhc2NyaXB0TWFwKSB7XG4gICAgICAgICAgICAgICAgYXR0ck5hbWUgPSBhdHRySHRtbFRvSmF2YXNjcmlwdE1hcFthdHRyTmFtZV07XG4gICAgICAgICAgICAgICAgaWYgKHRvUmVtb3ZlKVxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShhdHRyTmFtZSk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50W2F0dHJOYW1lXSA9IGF0dHJWYWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRvUmVtb3ZlKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIGF0dHJWYWx1ZS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVHJlYXQgXCJuYW1lXCIgc3BlY2lhbGx5IC0gYWx0aG91Z2ggeW91IGNhbiB0aGluayBvZiBpdCBhcyBhbiBhdHRyaWJ1dGUsIGl0IGFsc28gbmVlZHNcbiAgICAgICAgICAgIC8vIHNwZWNpYWwgaGFuZGxpbmcgb24gb2xkZXIgdmVyc2lvbnMgb2YgSUUgKGh0dHBzOi8vZ2l0aHViLmNvbS9TdGV2ZVNhbmRlcnNvbi9rbm9ja291dC9wdWxsLzMzMylcbiAgICAgICAgICAgIC8vIERlbGliZXJhdGVseSBiZWluZyBjYXNlLXNlbnNpdGl2ZSBoZXJlIGJlY2F1c2UgWEhUTUwgd291bGQgcmVnYXJkIFwiTmFtZVwiIGFzIGEgZGlmZmVyZW50IHRoaW5nXG4gICAgICAgICAgICAvLyBlbnRpcmVseSwgYW5kIHRoZXJlJ3Mgbm8gc3Ryb25nIHJlYXNvbiB0byBhbGxvdyBmb3Igc3VjaCBjYXNpbmcgaW4gSFRNTC5cbiAgICAgICAgICAgIGlmIChhdHRyTmFtZSA9PT0gXCJuYW1lXCIpIHtcbiAgICAgICAgICAgICAgICBrby51dGlscy5zZXRFbGVtZW50TmFtZShlbGVtZW50LCB0b1JlbW92ZSA/IFwiXCIgOiBhdHRyVmFsdWUudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4oZnVuY3Rpb24oKSB7XG5cbmtvLmJpbmRpbmdIYW5kbGVyc1snY2hlY2tlZCddID0ge1xuICAgICdhZnRlcic6IFsndmFsdWUnLCAnYXR0ciddLFxuICAgICdpbml0JzogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzKSB7XG4gICAgICAgIHZhciBjaGVja2VkVmFsdWUgPSBrby5wdXJlQ29tcHV0ZWQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBUcmVhdCBcInZhbHVlXCIgbGlrZSBcImNoZWNrZWRWYWx1ZVwiIHdoZW4gaXQgaXMgaW5jbHVkZWQgd2l0aCBcImNoZWNrZWRcIiBiaW5kaW5nXG4gICAgICAgICAgICBpZiAoYWxsQmluZGluZ3NbJ2hhcyddKCdjaGVja2VkVmFsdWUnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKGFsbEJpbmRpbmdzLmdldCgnY2hlY2tlZFZhbHVlJykpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhbGxCaW5kaW5nc1snaGFzJ10oJ3ZhbHVlJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShhbGxCaW5kaW5ncy5nZXQoJ3ZhbHVlJykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudC52YWx1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlTW9kZWwoKSB7XG4gICAgICAgICAgICAvLyBUaGlzIHVwZGF0ZXMgdGhlIG1vZGVsIHZhbHVlIGZyb20gdGhlIHZpZXcgdmFsdWUuXG4gICAgICAgICAgICAvLyBJdCBydW5zIGluIHJlc3BvbnNlIHRvIERPTSBldmVudHMgKGNsaWNrKSBhbmQgY2hhbmdlcyBpbiBjaGVja2VkVmFsdWUuXG4gICAgICAgICAgICB2YXIgaXNDaGVja2VkID0gZWxlbWVudC5jaGVja2VkLFxuICAgICAgICAgICAgICAgIGVsZW1WYWx1ZSA9IHVzZUNoZWNrZWRWYWx1ZSA/IGNoZWNrZWRWYWx1ZSgpIDogaXNDaGVja2VkO1xuXG4gICAgICAgICAgICAvLyBXaGVuIHdlJ3JlIGZpcnN0IHNldHRpbmcgdXAgdGhpcyBjb21wdXRlZCwgZG9uJ3QgY2hhbmdlIGFueSBtb2RlbCBzdGF0ZS5cbiAgICAgICAgICAgIGlmIChrby5jb21wdXRlZENvbnRleHQuaXNJbml0aWFsKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFdlIGNhbiBpZ25vcmUgdW5jaGVja2VkIHJhZGlvIGJ1dHRvbnMsIGJlY2F1c2Ugc29tZSBvdGhlciByYWRpb1xuICAgICAgICAgICAgLy8gYnV0dG9uIHdpbGwgYmUgZ2V0dGluZyBjaGVja2VkLCBhbmQgdGhhdCBvbmUgY2FuIHRha2UgY2FyZSBvZiB1cGRhdGluZyBzdGF0ZS5cbiAgICAgICAgICAgIGlmIChpc1JhZGlvICYmICFpc0NoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBtb2RlbFZhbHVlID0ga28uZGVwZW5kZW5jeURldGVjdGlvbi5pZ25vcmUodmFsdWVBY2Nlc3Nvcik7XG4gICAgICAgICAgICBpZiAoaXNWYWx1ZUFycmF5KSB7XG4gICAgICAgICAgICAgICAgaWYgKG9sZEVsZW1WYWx1ZSAhPT0gZWxlbVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdoZW4gd2UncmUgcmVzcG9uZGluZyB0byB0aGUgY2hlY2tlZFZhbHVlIGNoYW5naW5nLCBhbmQgdGhlIGVsZW1lbnQgaXNcbiAgICAgICAgICAgICAgICAgICAgLy8gY3VycmVudGx5IGNoZWNrZWQsIHJlcGxhY2UgdGhlIG9sZCBlbGVtIHZhbHVlIHdpdGggdGhlIG5ldyBlbGVtIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIC8vIGluIHRoZSBtb2RlbCBhcnJheS5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzQ2hlY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAga28udXRpbHMuYWRkT3JSZW1vdmVJdGVtKG1vZGVsVmFsdWUsIGVsZW1WYWx1ZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBrby51dGlscy5hZGRPclJlbW92ZUl0ZW0obW9kZWxWYWx1ZSwgb2xkRWxlbVZhbHVlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBvbGRFbGVtVmFsdWUgPSBlbGVtVmFsdWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2hlbiB3ZSdyZSByZXNwb25kaW5nIHRvIHRoZSB1c2VyIGhhdmluZyBjaGVja2VkL3VuY2hlY2tlZCBhIGNoZWNrYm94LFxuICAgICAgICAgICAgICAgICAgICAvLyBhZGQvcmVtb3ZlIHRoZSBlbGVtZW50IHZhbHVlIHRvIHRoZSBtb2RlbCBhcnJheS5cbiAgICAgICAgICAgICAgICAgICAga28udXRpbHMuYWRkT3JSZW1vdmVJdGVtKG1vZGVsVmFsdWUsIGVsZW1WYWx1ZSwgaXNDaGVja2VkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGtvLmV4cHJlc3Npb25SZXdyaXRpbmcud3JpdGVWYWx1ZVRvUHJvcGVydHkobW9kZWxWYWx1ZSwgYWxsQmluZGluZ3MsICdjaGVja2VkJywgZWxlbVZhbHVlLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVWaWV3KCkge1xuICAgICAgICAgICAgLy8gVGhpcyB1cGRhdGVzIHRoZSB2aWV3IHZhbHVlIGZyb20gdGhlIG1vZGVsIHZhbHVlLlxuICAgICAgICAgICAgLy8gSXQgcnVucyBpbiByZXNwb25zZSB0byBjaGFuZ2VzIGluIHRoZSBib3VuZCAoY2hlY2tlZCkgdmFsdWUuXG4gICAgICAgICAgICB2YXIgbW9kZWxWYWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpKTtcblxuICAgICAgICAgICAgaWYgKGlzVmFsdWVBcnJheSkge1xuICAgICAgICAgICAgICAgIC8vIFdoZW4gYSBjaGVja2JveCBpcyBib3VuZCB0byBhbiBhcnJheSwgYmVpbmcgY2hlY2tlZCByZXByZXNlbnRzIGl0cyB2YWx1ZSBiZWluZyBwcmVzZW50IGluIHRoYXQgYXJyYXlcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNoZWNrZWQgPSBrby51dGlscy5hcnJheUluZGV4T2YobW9kZWxWYWx1ZSwgY2hlY2tlZFZhbHVlKCkpID49IDA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzQ2hlY2tib3gpIHtcbiAgICAgICAgICAgICAgICAvLyBXaGVuIGEgY2hlY2tib3ggaXMgYm91bmQgdG8gYW55IG90aGVyIHZhbHVlIChub3QgYW4gYXJyYXkpLCBiZWluZyBjaGVja2VkIHJlcHJlc2VudHMgdGhlIHZhbHVlIGJlaW5nIHRydWVpc2hcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNoZWNrZWQgPSBtb2RlbFZhbHVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBGb3IgcmFkaW8gYnV0dG9ucywgYmVpbmcgY2hlY2tlZCBtZWFucyB0aGF0IHRoZSByYWRpbyBidXR0b24ncyB2YWx1ZSBjb3JyZXNwb25kcyB0byB0aGUgbW9kZWwgdmFsdWVcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNoZWNrZWQgPSAoY2hlY2tlZFZhbHVlKCkgPT09IG1vZGVsVmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBpc0NoZWNrYm94ID0gZWxlbWVudC50eXBlID09IFwiY2hlY2tib3hcIixcbiAgICAgICAgICAgIGlzUmFkaW8gPSBlbGVtZW50LnR5cGUgPT0gXCJyYWRpb1wiO1xuXG4gICAgICAgIC8vIE9ubHkgYmluZCB0byBjaGVjayBib3hlcyBhbmQgcmFkaW8gYnV0dG9uc1xuICAgICAgICBpZiAoIWlzQ2hlY2tib3ggJiYgIWlzUmFkaW8pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpc1ZhbHVlQXJyYXkgPSBpc0NoZWNrYm94ICYmIChrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSkgaW5zdGFuY2VvZiBBcnJheSksXG4gICAgICAgICAgICBvbGRFbGVtVmFsdWUgPSBpc1ZhbHVlQXJyYXkgPyBjaGVja2VkVmFsdWUoKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHVzZUNoZWNrZWRWYWx1ZSA9IGlzUmFkaW8gfHwgaXNWYWx1ZUFycmF5O1xuXG4gICAgICAgIC8vIElFIDYgd29uJ3QgYWxsb3cgcmFkaW8gYnV0dG9ucyB0byBiZSBzZWxlY3RlZCB1bmxlc3MgdGhleSBoYXZlIGEgbmFtZVxuICAgICAgICBpZiAoaXNSYWRpbyAmJiAhZWxlbWVudC5uYW1lKVxuICAgICAgICAgICAga28uYmluZGluZ0hhbmRsZXJzWyd1bmlxdWVOYW1lJ11bJ2luaXQnXShlbGVtZW50LCBmdW5jdGlvbigpIHsgcmV0dXJuIHRydWUgfSk7XG5cbiAgICAgICAgLy8gU2V0IHVwIHR3byBjb21wdXRlZHMgdG8gdXBkYXRlIHRoZSBiaW5kaW5nOlxuXG4gICAgICAgIC8vIFRoZSBmaXJzdCByZXNwb25kcyB0byBjaGFuZ2VzIGluIHRoZSBjaGVja2VkVmFsdWUgdmFsdWUgYW5kIHRvIGVsZW1lbnQgY2xpY2tzXG4gICAgICAgIGtvLmNvbXB1dGVkKHVwZGF0ZU1vZGVsLCBudWxsLCB7IGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZDogZWxlbWVudCB9KTtcbiAgICAgICAga28udXRpbHMucmVnaXN0ZXJFdmVudEhhbmRsZXIoZWxlbWVudCwgXCJjbGlja1wiLCB1cGRhdGVNb2RlbCk7XG5cbiAgICAgICAgLy8gVGhlIHNlY29uZCByZXNwb25kcyB0byBjaGFuZ2VzIGluIHRoZSBtb2RlbCB2YWx1ZSAodGhlIG9uZSBhc3NvY2lhdGVkIHdpdGggdGhlIGNoZWNrZWQgYmluZGluZylcbiAgICAgICAga28uY29tcHV0ZWQodXBkYXRlVmlldywgbnVsbCwgeyBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IGVsZW1lbnQgfSk7XG4gICAgfVxufTtcbmtvLmV4cHJlc3Npb25SZXdyaXRpbmcudHdvV2F5QmluZGluZ3NbJ2NoZWNrZWQnXSA9IHRydWU7XG5cbmtvLmJpbmRpbmdIYW5kbGVyc1snY2hlY2tlZFZhbHVlJ10gPSB7XG4gICAgJ3VwZGF0ZSc6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yKSB7XG4gICAgICAgIGVsZW1lbnQudmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSk7XG4gICAgfVxufTtcblxufSkoKTt2YXIgY2xhc3Nlc1dyaXR0ZW5CeUJpbmRpbmdLZXkgPSAnX19rb19fY3NzVmFsdWUnO1xua28uYmluZGluZ0hhbmRsZXJzWydjc3MnXSA9IHtcbiAgICAndXBkYXRlJzogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IpIHtcbiAgICAgICAgdmFyIHZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZUFjY2Vzc29yKCkpO1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIGtvLnV0aWxzLm9iamVjdEZvckVhY2godmFsdWUsIGZ1bmN0aW9uKGNsYXNzTmFtZSwgc2hvdWxkSGF2ZUNsYXNzKSB7XG4gICAgICAgICAgICAgICAgc2hvdWxkSGF2ZUNsYXNzID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShzaG91bGRIYXZlQ2xhc3MpO1xuICAgICAgICAgICAgICAgIGtvLnV0aWxzLnRvZ2dsZURvbU5vZGVDc3NDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUsIHNob3VsZEhhdmVDbGFzcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlID0gU3RyaW5nKHZhbHVlIHx8ICcnKTsgLy8gTWFrZSBzdXJlIHdlIGRvbid0IHRyeSB0byBzdG9yZSBvciBzZXQgYSBub24tc3RyaW5nIHZhbHVlXG4gICAgICAgICAgICBrby51dGlscy50b2dnbGVEb21Ob2RlQ3NzQ2xhc3MoZWxlbWVudCwgZWxlbWVudFtjbGFzc2VzV3JpdHRlbkJ5QmluZGluZ0tleV0sIGZhbHNlKTtcbiAgICAgICAgICAgIGVsZW1lbnRbY2xhc3Nlc1dyaXR0ZW5CeUJpbmRpbmdLZXldID0gdmFsdWU7XG4gICAgICAgICAgICBrby51dGlscy50b2dnbGVEb21Ob2RlQ3NzQ2xhc3MoZWxlbWVudCwgdmFsdWUsIHRydWUpO1xuICAgICAgICB9XG4gICAgfVxufTtcbmtvLmJpbmRpbmdIYW5kbGVyc1snZW5hYmxlJ10gPSB7XG4gICAgJ3VwZGF0ZSc6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpKTtcbiAgICAgICAgaWYgKHZhbHVlICYmIGVsZW1lbnQuZGlzYWJsZWQpXG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xuICAgICAgICBlbHNlIGlmICgoIXZhbHVlKSAmJiAoIWVsZW1lbnQuZGlzYWJsZWQpKVxuICAgICAgICAgICAgZWxlbWVudC5kaXNhYmxlZCA9IHRydWU7XG4gICAgfVxufTtcblxua28uYmluZGluZ0hhbmRsZXJzWydkaXNhYmxlJ10gPSB7XG4gICAgJ3VwZGF0ZSc6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yKSB7XG4gICAgICAgIGtvLmJpbmRpbmdIYW5kbGVyc1snZW5hYmxlJ11bJ3VwZGF0ZSddKGVsZW1lbnQsIGZ1bmN0aW9uKCkgeyByZXR1cm4gIWtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpKSB9KTtcbiAgICB9XG59O1xuLy8gRm9yIGNlcnRhaW4gY29tbW9uIGV2ZW50cyAoY3VycmVudGx5IGp1c3QgJ2NsaWNrJyksIGFsbG93IGEgc2ltcGxpZmllZCBkYXRhLWJpbmRpbmcgc3ludGF4XG4vLyBlLmcuIGNsaWNrOmhhbmRsZXIgaW5zdGVhZCBvZiB0aGUgdXN1YWwgZnVsbC1sZW5ndGggZXZlbnQ6e2NsaWNrOmhhbmRsZXJ9XG5mdW5jdGlvbiBtYWtlRXZlbnRIYW5kbGVyU2hvcnRjdXQoZXZlbnROYW1lKSB7XG4gICAga28uYmluZGluZ0hhbmRsZXJzW2V2ZW50TmFtZV0gPSB7XG4gICAgICAgICdpbml0JzogZnVuY3Rpb24oZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3MsIHZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpIHtcbiAgICAgICAgICAgIHZhciBuZXdWYWx1ZUFjY2Vzc29yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgICAgICAgICAgICByZXN1bHRbZXZlbnROYW1lXSA9IHZhbHVlQWNjZXNzb3IoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBrby5iaW5kaW5nSGFuZGxlcnNbJ2V2ZW50J11bJ2luaXQnXS5jYWxsKHRoaXMsIGVsZW1lbnQsIG5ld1ZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzLCB2aWV3TW9kZWwsIGJpbmRpbmdDb250ZXh0KTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxua28uYmluZGluZ0hhbmRsZXJzWydldmVudCddID0ge1xuICAgICdpbml0JyA6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5ncywgdmlld01vZGVsLCBiaW5kaW5nQ29udGV4dCkge1xuICAgICAgICB2YXIgZXZlbnRzVG9IYW5kbGUgPSB2YWx1ZUFjY2Vzc29yKCkgfHwge307XG4gICAgICAgIGtvLnV0aWxzLm9iamVjdEZvckVhY2goZXZlbnRzVG9IYW5kbGUsIGZ1bmN0aW9uKGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBldmVudE5hbWUgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIGtvLnV0aWxzLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKGVsZW1lbnQsIGV2ZW50TmFtZSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoYW5kbGVyUmV0dXJuVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoYW5kbGVyRnVuY3Rpb24gPSB2YWx1ZUFjY2Vzc29yKClbZXZlbnROYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFoYW5kbGVyRnVuY3Rpb24pXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRha2UgYWxsIHRoZSBldmVudCBhcmdzLCBhbmQgcHJlZml4IHdpdGggdGhlIHZpZXdtb2RlbFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFyZ3NGb3JIYW5kbGVyID0ga28udXRpbHMubWFrZUFycmF5KGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3TW9kZWwgPSBiaW5kaW5nQ29udGV4dFsnJGRhdGEnXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3NGb3JIYW5kbGVyLnVuc2hpZnQodmlld01vZGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXJSZXR1cm5WYWx1ZSA9IGhhbmRsZXJGdW5jdGlvbi5hcHBseSh2aWV3TW9kZWwsIGFyZ3NGb3JIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYW5kbGVyUmV0dXJuVmFsdWUgIT09IHRydWUpIHsgLy8gTm9ybWFsbHkgd2Ugd2FudCB0byBwcmV2ZW50IGRlZmF1bHQgYWN0aW9uLiBEZXZlbG9wZXIgY2FuIG92ZXJyaWRlIHRoaXMgYmUgZXhwbGljaXRseSByZXR1cm5pbmcgdHJ1ZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQucHJldmVudERlZmF1bHQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGJ1YmJsZSA9IGFsbEJpbmRpbmdzLmdldChldmVudE5hbWUgKyAnQnViYmxlJykgIT09IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWJ1YmJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuY2FuY2VsQnViYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5zdG9wUHJvcGFnYXRpb24pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcbi8vIFwiZm9yZWFjaDogc29tZUV4cHJlc3Npb25cIiBpcyBlcXVpdmFsZW50IHRvIFwidGVtcGxhdGU6IHsgZm9yZWFjaDogc29tZUV4cHJlc3Npb24gfVwiXG4vLyBcImZvcmVhY2g6IHsgZGF0YTogc29tZUV4cHJlc3Npb24sIGFmdGVyQWRkOiBteWZuIH1cIiBpcyBlcXVpdmFsZW50IHRvIFwidGVtcGxhdGU6IHsgZm9yZWFjaDogc29tZUV4cHJlc3Npb24sIGFmdGVyQWRkOiBteWZuIH1cIlxua28uYmluZGluZ0hhbmRsZXJzWydmb3JlYWNoJ10gPSB7XG4gICAgbWFrZVRlbXBsYXRlVmFsdWVBY2Nlc3NvcjogZnVuY3Rpb24odmFsdWVBY2Nlc3Nvcikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgbW9kZWxWYWx1ZSA9IHZhbHVlQWNjZXNzb3IoKSxcbiAgICAgICAgICAgICAgICB1bndyYXBwZWRWYWx1ZSA9IGtvLnV0aWxzLnBlZWtPYnNlcnZhYmxlKG1vZGVsVmFsdWUpOyAgICAvLyBVbndyYXAgd2l0aG91dCBzZXR0aW5nIGEgZGVwZW5kZW5jeSBoZXJlXG5cbiAgICAgICAgICAgIC8vIElmIHVud3JhcHBlZFZhbHVlIGlzIHRoZSBhcnJheSwgcGFzcyBpbiB0aGUgd3JhcHBlZCB2YWx1ZSBvbiBpdHMgb3duXG4gICAgICAgICAgICAvLyBUaGUgdmFsdWUgd2lsbCBiZSB1bndyYXBwZWQgYW5kIHRyYWNrZWQgd2l0aGluIHRoZSB0ZW1wbGF0ZSBiaW5kaW5nXG4gICAgICAgICAgICAvLyAoU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TdGV2ZVNhbmRlcnNvbi9rbm9ja291dC9pc3N1ZXMvNTIzKVxuICAgICAgICAgICAgaWYgKCghdW53cmFwcGVkVmFsdWUpIHx8IHR5cGVvZiB1bndyYXBwZWRWYWx1ZS5sZW5ndGggPT0gXCJudW1iZXJcIilcbiAgICAgICAgICAgICAgICByZXR1cm4geyAnZm9yZWFjaCc6IG1vZGVsVmFsdWUsICd0ZW1wbGF0ZUVuZ2luZSc6IGtvLm5hdGl2ZVRlbXBsYXRlRW5naW5lLmluc3RhbmNlIH07XG5cbiAgICAgICAgICAgIC8vIElmIHVud3JhcHBlZFZhbHVlLmRhdGEgaXMgdGhlIGFycmF5LCBwcmVzZXJ2ZSBhbGwgcmVsZXZhbnQgb3B0aW9ucyBhbmQgdW53cmFwIGFnYWluIHZhbHVlIHNvIHdlIGdldCB1cGRhdGVzXG4gICAgICAgICAgICBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKG1vZGVsVmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAnZm9yZWFjaCc6IHVud3JhcHBlZFZhbHVlWydkYXRhJ10sXG4gICAgICAgICAgICAgICAgJ2FzJzogdW53cmFwcGVkVmFsdWVbJ2FzJ10sXG4gICAgICAgICAgICAgICAgJ2luY2x1ZGVEZXN0cm95ZWQnOiB1bndyYXBwZWRWYWx1ZVsnaW5jbHVkZURlc3Ryb3llZCddLFxuICAgICAgICAgICAgICAgICdhZnRlckFkZCc6IHVud3JhcHBlZFZhbHVlWydhZnRlckFkZCddLFxuICAgICAgICAgICAgICAgICdiZWZvcmVSZW1vdmUnOiB1bndyYXBwZWRWYWx1ZVsnYmVmb3JlUmVtb3ZlJ10sXG4gICAgICAgICAgICAgICAgJ2FmdGVyUmVuZGVyJzogdW53cmFwcGVkVmFsdWVbJ2FmdGVyUmVuZGVyJ10sXG4gICAgICAgICAgICAgICAgJ2JlZm9yZU1vdmUnOiB1bndyYXBwZWRWYWx1ZVsnYmVmb3JlTW92ZSddLFxuICAgICAgICAgICAgICAgICdhZnRlck1vdmUnOiB1bndyYXBwZWRWYWx1ZVsnYWZ0ZXJNb3ZlJ10sXG4gICAgICAgICAgICAgICAgJ3RlbXBsYXRlRW5naW5lJzoga28ubmF0aXZlVGVtcGxhdGVFbmdpbmUuaW5zdGFuY2VcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgfSxcbiAgICAnaW5pdCc6IGZ1bmN0aW9uKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzLCB2aWV3TW9kZWwsIGJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgIHJldHVybiBrby5iaW5kaW5nSGFuZGxlcnNbJ3RlbXBsYXRlJ11bJ2luaXQnXShlbGVtZW50LCBrby5iaW5kaW5nSGFuZGxlcnNbJ2ZvcmVhY2gnXS5tYWtlVGVtcGxhdGVWYWx1ZUFjY2Vzc29yKHZhbHVlQWNjZXNzb3IpKTtcbiAgICB9LFxuICAgICd1cGRhdGUnOiBmdW5jdGlvbihlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5ncywgdmlld01vZGVsLCBiaW5kaW5nQ29udGV4dCkge1xuICAgICAgICByZXR1cm4ga28uYmluZGluZ0hhbmRsZXJzWyd0ZW1wbGF0ZSddWyd1cGRhdGUnXShlbGVtZW50LCBrby5iaW5kaW5nSGFuZGxlcnNbJ2ZvcmVhY2gnXS5tYWtlVGVtcGxhdGVWYWx1ZUFjY2Vzc29yKHZhbHVlQWNjZXNzb3IpLCBhbGxCaW5kaW5ncywgdmlld01vZGVsLCBiaW5kaW5nQ29udGV4dCk7XG4gICAgfVxufTtcbmtvLmV4cHJlc3Npb25SZXdyaXRpbmcuYmluZGluZ1Jld3JpdGVWYWxpZGF0b3JzWydmb3JlYWNoJ10gPSBmYWxzZTsgLy8gQ2FuJ3QgcmV3cml0ZSBjb250cm9sIGZsb3cgYmluZGluZ3NcbmtvLnZpcnR1YWxFbGVtZW50cy5hbGxvd2VkQmluZGluZ3NbJ2ZvcmVhY2gnXSA9IHRydWU7XG52YXIgaGFzZm9jdXNVcGRhdGluZ1Byb3BlcnR5ID0gJ19fa29faGFzZm9jdXNVcGRhdGluZyc7XG52YXIgaGFzZm9jdXNMYXN0VmFsdWUgPSAnX19rb19oYXNmb2N1c0xhc3RWYWx1ZSc7XG5rby5iaW5kaW5nSGFuZGxlcnNbJ2hhc2ZvY3VzJ10gPSB7XG4gICAgJ2luaXQnOiBmdW5jdGlvbihlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5ncykge1xuICAgICAgICB2YXIgaGFuZGxlRWxlbWVudEZvY3VzQ2hhbmdlID0gZnVuY3Rpb24oaXNGb2N1c2VkKSB7XG4gICAgICAgICAgICAvLyBXaGVyZSBwb3NzaWJsZSwgaWdub3JlIHdoaWNoIGV2ZW50IHdhcyByYWlzZWQgYW5kIGRldGVybWluZSBmb2N1cyBzdGF0ZSB1c2luZyBhY3RpdmVFbGVtZW50LFxuICAgICAgICAgICAgLy8gYXMgdGhpcyBhdm9pZHMgcGhhbnRvbSBmb2N1cy9ibHVyIGV2ZW50cyByYWlzZWQgd2hlbiBjaGFuZ2luZyB0YWJzIGluIG1vZGVybiBicm93c2Vycy5cbiAgICAgICAgICAgIC8vIEhvd2V2ZXIsIG5vdCBhbGwgS08tdGFyZ2V0ZWQgYnJvd3NlcnMgKEZpcmVmb3ggMikgc3VwcG9ydCBhY3RpdmVFbGVtZW50LiBGb3IgdGhvc2UgYnJvd3NlcnMsXG4gICAgICAgICAgICAvLyBwcmV2ZW50IGEgbG9zcyBvZiBmb2N1cyB3aGVuIGNoYW5naW5nIHRhYnMvd2luZG93cyBieSBzZXR0aW5nIGEgZmxhZyB0aGF0IHByZXZlbnRzIGhhc2ZvY3VzXG4gICAgICAgICAgICAvLyBmcm9tIGNhbGxpbmcgJ2JsdXIoKScgb24gdGhlIGVsZW1lbnQgd2hlbiBpdCBsb3NlcyBmb2N1cy5cbiAgICAgICAgICAgIC8vIERpc2N1c3Npb24gYXQgaHR0cHM6Ly9naXRodWIuY29tL1N0ZXZlU2FuZGVyc29uL2tub2Nrb3V0L3B1bGwvMzUyXG4gICAgICAgICAgICBlbGVtZW50W2hhc2ZvY3VzVXBkYXRpbmdQcm9wZXJ0eV0gPSB0cnVlO1xuICAgICAgICAgICAgdmFyIG93bmVyRG9jID0gZWxlbWVudC5vd25lckRvY3VtZW50O1xuICAgICAgICAgICAgaWYgKFwiYWN0aXZlRWxlbWVudFwiIGluIG93bmVyRG9jKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFjdGl2ZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBhY3RpdmUgPSBvd25lckRvYy5hY3RpdmVFbGVtZW50O1xuICAgICAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBJRTkgdGhyb3dzIGlmIHlvdSBhY2Nlc3MgYWN0aXZlRWxlbWVudCBkdXJpbmcgcGFnZSBsb2FkIChzZWUgaXNzdWUgIzcwMylcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlID0gb3duZXJEb2MuYm9keTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaXNGb2N1c2VkID0gKGFjdGl2ZSA9PT0gZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbW9kZWxWYWx1ZSA9IHZhbHVlQWNjZXNzb3IoKTtcbiAgICAgICAgICAgIGtvLmV4cHJlc3Npb25SZXdyaXRpbmcud3JpdGVWYWx1ZVRvUHJvcGVydHkobW9kZWxWYWx1ZSwgYWxsQmluZGluZ3MsICdoYXNmb2N1cycsIGlzRm9jdXNlZCwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIC8vY2FjaGUgdGhlIGxhdGVzdCB2YWx1ZSwgc28gd2UgY2FuIGF2b2lkIHVubmVjZXNzYXJpbHkgY2FsbGluZyBmb2N1cy9ibHVyIGluIHRoZSB1cGRhdGUgZnVuY3Rpb25cbiAgICAgICAgICAgIGVsZW1lbnRbaGFzZm9jdXNMYXN0VmFsdWVdID0gaXNGb2N1c2VkO1xuICAgICAgICAgICAgZWxlbWVudFtoYXNmb2N1c1VwZGF0aW5nUHJvcGVydHldID0gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBoYW5kbGVFbGVtZW50Rm9jdXNJbiA9IGhhbmRsZUVsZW1lbnRGb2N1c0NoYW5nZS5iaW5kKG51bGwsIHRydWUpO1xuICAgICAgICB2YXIgaGFuZGxlRWxlbWVudEZvY3VzT3V0ID0gaGFuZGxlRWxlbWVudEZvY3VzQ2hhbmdlLmJpbmQobnVsbCwgZmFsc2UpO1xuXG4gICAgICAgIGtvLnV0aWxzLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKGVsZW1lbnQsIFwiZm9jdXNcIiwgaGFuZGxlRWxlbWVudEZvY3VzSW4pO1xuICAgICAgICBrby51dGlscy5yZWdpc3RlckV2ZW50SGFuZGxlcihlbGVtZW50LCBcImZvY3VzaW5cIiwgaGFuZGxlRWxlbWVudEZvY3VzSW4pOyAvLyBGb3IgSUVcbiAgICAgICAga28udXRpbHMucmVnaXN0ZXJFdmVudEhhbmRsZXIoZWxlbWVudCwgXCJibHVyXCIsICBoYW5kbGVFbGVtZW50Rm9jdXNPdXQpO1xuICAgICAgICBrby51dGlscy5yZWdpc3RlckV2ZW50SGFuZGxlcihlbGVtZW50LCBcImZvY3Vzb3V0XCIsICBoYW5kbGVFbGVtZW50Rm9jdXNPdXQpOyAvLyBGb3IgSUVcbiAgICB9LFxuICAgICd1cGRhdGUnOiBmdW5jdGlvbihlbGVtZW50LCB2YWx1ZUFjY2Vzc29yKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9ICEha28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZUFjY2Vzc29yKCkpOyAvL2ZvcmNlIGJvb2xlYW4gdG8gY29tcGFyZSB3aXRoIGxhc3QgdmFsdWVcbiAgICAgICAgaWYgKCFlbGVtZW50W2hhc2ZvY3VzVXBkYXRpbmdQcm9wZXJ0eV0gJiYgZWxlbWVudFtoYXNmb2N1c0xhc3RWYWx1ZV0gIT09IHZhbHVlKSB7XG4gICAgICAgICAgICB2YWx1ZSA/IGVsZW1lbnQuZm9jdXMoKSA6IGVsZW1lbnQuYmx1cigpO1xuICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5pZ25vcmUoa28udXRpbHMudHJpZ2dlckV2ZW50LCBudWxsLCBbZWxlbWVudCwgdmFsdWUgPyBcImZvY3VzaW5cIiA6IFwiZm9jdXNvdXRcIl0pOyAvLyBGb3IgSUUsIHdoaWNoIGRvZXNuJ3QgcmVsaWFibHkgZmlyZSBcImZvY3VzXCIgb3IgXCJibHVyXCIgZXZlbnRzIHN5bmNocm9ub3VzbHlcbiAgICAgICAgfVxuICAgIH1cbn07XG5rby5leHByZXNzaW9uUmV3cml0aW5nLnR3b1dheUJpbmRpbmdzWydoYXNmb2N1cyddID0gdHJ1ZTtcblxua28uYmluZGluZ0hhbmRsZXJzWydoYXNGb2N1cyddID0ga28uYmluZGluZ0hhbmRsZXJzWydoYXNmb2N1cyddOyAvLyBNYWtlIFwiaGFzRm9jdXNcIiBhbiBhbGlhc1xua28uZXhwcmVzc2lvblJld3JpdGluZy50d29XYXlCaW5kaW5nc1snaGFzRm9jdXMnXSA9IHRydWU7XG5rby5iaW5kaW5nSGFuZGxlcnNbJ2h0bWwnXSA9IHtcbiAgICAnaW5pdCc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBQcmV2ZW50IGJpbmRpbmcgb24gdGhlIGR5bmFtaWNhbGx5LWluamVjdGVkIEhUTUwgKGFzIGRldmVsb3BlcnMgYXJlIHVubGlrZWx5IHRvIGV4cGVjdCB0aGF0LCBhbmQgaXQgaGFzIHNlY3VyaXR5IGltcGxpY2F0aW9ucylcbiAgICAgICAgcmV0dXJuIHsgJ2NvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzJzogdHJ1ZSB9O1xuICAgIH0sXG4gICAgJ3VwZGF0ZSc6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yKSB7XG4gICAgICAgIC8vIHNldEh0bWwgd2lsbCB1bndyYXAgdGhlIHZhbHVlIGlmIG5lZWRlZFxuICAgICAgICBrby51dGlscy5zZXRIdG1sKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IoKSk7XG4gICAgfVxufTtcbi8vIE1ha2VzIGEgYmluZGluZyBsaWtlIHdpdGggb3IgaWZcbmZ1bmN0aW9uIG1ha2VXaXRoSWZCaW5kaW5nKGJpbmRpbmdLZXksIGlzV2l0aCwgaXNOb3QsIG1ha2VDb250ZXh0Q2FsbGJhY2spIHtcbiAgICBrby5iaW5kaW5nSGFuZGxlcnNbYmluZGluZ0tleV0gPSB7XG4gICAgICAgICdpbml0JzogZnVuY3Rpb24oZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3MsIHZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpIHtcbiAgICAgICAgICAgIHZhciBkaWREaXNwbGF5T25MYXN0VXBkYXRlLFxuICAgICAgICAgICAgICAgIHNhdmVkTm9kZXM7XG4gICAgICAgICAgICBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGF0YVZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZUFjY2Vzc29yKCkpLFxuICAgICAgICAgICAgICAgICAgICBzaG91bGREaXNwbGF5ID0gIWlzTm90ICE9PSAhZGF0YVZhbHVlLCAvLyBlcXVpdmFsZW50IHRvIGlzTm90ID8gIWRhdGFWYWx1ZSA6ICEhZGF0YVZhbHVlXG4gICAgICAgICAgICAgICAgICAgIGlzRmlyc3RSZW5kZXIgPSAhc2F2ZWROb2RlcyxcbiAgICAgICAgICAgICAgICAgICAgbmVlZHNSZWZyZXNoID0gaXNGaXJzdFJlbmRlciB8fCBpc1dpdGggfHwgKHNob3VsZERpc3BsYXkgIT09IGRpZERpc3BsYXlPbkxhc3RVcGRhdGUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKG5lZWRzUmVmcmVzaCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBTYXZlIGEgY29weSBvZiB0aGUgaW5uZXIgbm9kZXMgb24gdGhlIGluaXRpYWwgdXBkYXRlLCBidXQgb25seSBpZiB3ZSBoYXZlIGRlcGVuZGVuY2llcy5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzRmlyc3RSZW5kZXIgJiYga28uY29tcHV0ZWRDb250ZXh0LmdldERlcGVuZGVuY2llc0NvdW50KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVkTm9kZXMgPSBrby51dGlscy5jbG9uZU5vZGVzKGtvLnZpcnR1YWxFbGVtZW50cy5jaGlsZE5vZGVzKGVsZW1lbnQpLCB0cnVlIC8qIHNob3VsZENsZWFuTm9kZXMgKi8pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNob3VsZERpc3BsYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNGaXJzdFJlbmRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtvLnZpcnR1YWxFbGVtZW50cy5zZXREb21Ob2RlQ2hpbGRyZW4oZWxlbWVudCwga28udXRpbHMuY2xvbmVOb2RlcyhzYXZlZE5vZGVzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBrby5hcHBseUJpbmRpbmdzVG9EZXNjZW5kYW50cyhtYWtlQ29udGV4dENhbGxiYWNrID8gbWFrZUNvbnRleHRDYWxsYmFjayhiaW5kaW5nQ29udGV4dCwgZGF0YVZhbHVlKSA6IGJpbmRpbmdDb250ZXh0LCBlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtvLnZpcnR1YWxFbGVtZW50cy5lbXB0eU5vZGUoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBkaWREaXNwbGF5T25MYXN0VXBkYXRlID0gc2hvdWxkRGlzcGxheTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBudWxsLCB7IGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZDogZWxlbWVudCB9KTtcbiAgICAgICAgICAgIHJldHVybiB7ICdjb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5ncyc6IHRydWUgfTtcbiAgICAgICAgfVxuICAgIH07XG4gICAga28uZXhwcmVzc2lvblJld3JpdGluZy5iaW5kaW5nUmV3cml0ZVZhbGlkYXRvcnNbYmluZGluZ0tleV0gPSBmYWxzZTsgLy8gQ2FuJ3QgcmV3cml0ZSBjb250cm9sIGZsb3cgYmluZGluZ3NcbiAgICBrby52aXJ0dWFsRWxlbWVudHMuYWxsb3dlZEJpbmRpbmdzW2JpbmRpbmdLZXldID0gdHJ1ZTtcbn1cblxuLy8gQ29uc3RydWN0IHRoZSBhY3R1YWwgYmluZGluZyBoYW5kbGVyc1xubWFrZVdpdGhJZkJpbmRpbmcoJ2lmJyk7XG5tYWtlV2l0aElmQmluZGluZygnaWZub3QnLCBmYWxzZSAvKiBpc1dpdGggKi8sIHRydWUgLyogaXNOb3QgKi8pO1xubWFrZVdpdGhJZkJpbmRpbmcoJ3dpdGgnLCB0cnVlIC8qIGlzV2l0aCAqLywgZmFsc2UgLyogaXNOb3QgKi8sXG4gICAgZnVuY3Rpb24oYmluZGluZ0NvbnRleHQsIGRhdGFWYWx1ZSkge1xuICAgICAgICByZXR1cm4gYmluZGluZ0NvbnRleHRbJ2NyZWF0ZUNoaWxkQ29udGV4dCddKGRhdGFWYWx1ZSk7XG4gICAgfVxuKTtcbnZhciBjYXB0aW9uUGxhY2Vob2xkZXIgPSB7fTtcbmtvLmJpbmRpbmdIYW5kbGVyc1snb3B0aW9ucyddID0ge1xuICAgICdpbml0JzogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICBpZiAoa28udXRpbHMudGFnTmFtZUxvd2VyKGVsZW1lbnQpICE9PSBcInNlbGVjdFwiKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwib3B0aW9ucyBiaW5kaW5nIGFwcGxpZXMgb25seSB0byBTRUxFQ1QgZWxlbWVudHNcIik7XG5cbiAgICAgICAgLy8gUmVtb3ZlIGFsbCBleGlzdGluZyA8b3B0aW9uPnMuXG4gICAgICAgIHdoaWxlIChlbGVtZW50Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlKDApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRW5zdXJlcyB0aGF0IHRoZSBiaW5kaW5nIHByb2Nlc3NvciBkb2Vzbid0IHRyeSB0byBiaW5kIHRoZSBvcHRpb25zXG4gICAgICAgIHJldHVybiB7ICdjb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5ncyc6IHRydWUgfTtcbiAgICB9LFxuICAgICd1cGRhdGUnOiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3MpIHtcbiAgICAgICAgZnVuY3Rpb24gc2VsZWN0ZWRPcHRpb25zKCkge1xuICAgICAgICAgICAgcmV0dXJuIGtvLnV0aWxzLmFycmF5RmlsdGVyKGVsZW1lbnQub3B0aW9ucywgZnVuY3Rpb24gKG5vZGUpIHsgcmV0dXJuIG5vZGUuc2VsZWN0ZWQ7IH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNlbGVjdFdhc1ByZXZpb3VzbHlFbXB0eSA9IGVsZW1lbnQubGVuZ3RoID09IDA7XG4gICAgICAgIHZhciBwcmV2aW91c1Njcm9sbFRvcCA9ICghc2VsZWN0V2FzUHJldmlvdXNseUVtcHR5ICYmIGVsZW1lbnQubXVsdGlwbGUpID8gZWxlbWVudC5zY3JvbGxUb3AgOiBudWxsO1xuICAgICAgICB2YXIgdW53cmFwcGVkQXJyYXkgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSk7XG4gICAgICAgIHZhciBpbmNsdWRlRGVzdHJveWVkID0gYWxsQmluZGluZ3MuZ2V0KCdvcHRpb25zSW5jbHVkZURlc3Ryb3llZCcpO1xuICAgICAgICB2YXIgYXJyYXlUb0RvbU5vZGVDaGlsZHJlbk9wdGlvbnMgPSB7fTtcbiAgICAgICAgdmFyIGNhcHRpb25WYWx1ZTtcbiAgICAgICAgdmFyIGZpbHRlcmVkQXJyYXk7XG4gICAgICAgIHZhciBwcmV2aW91c1NlbGVjdGVkVmFsdWVzO1xuXG4gICAgICAgIGlmIChlbGVtZW50Lm11bHRpcGxlKSB7XG4gICAgICAgICAgICBwcmV2aW91c1NlbGVjdGVkVmFsdWVzID0ga28udXRpbHMuYXJyYXlNYXAoc2VsZWN0ZWRPcHRpb25zKCksIGtvLnNlbGVjdEV4dGVuc2lvbnMucmVhZFZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByZXZpb3VzU2VsZWN0ZWRWYWx1ZXMgPSBlbGVtZW50LnNlbGVjdGVkSW5kZXggPj0gMCA/IFsga28uc2VsZWN0RXh0ZW5zaW9ucy5yZWFkVmFsdWUoZWxlbWVudC5vcHRpb25zW2VsZW1lbnQuc2VsZWN0ZWRJbmRleF0pIF0gOiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1bndyYXBwZWRBcnJheSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB1bndyYXBwZWRBcnJheS5sZW5ndGggPT0gXCJ1bmRlZmluZWRcIikgLy8gQ29lcmNlIHNpbmdsZSB2YWx1ZSBpbnRvIGFycmF5XG4gICAgICAgICAgICAgICAgdW53cmFwcGVkQXJyYXkgPSBbdW53cmFwcGVkQXJyYXldO1xuXG4gICAgICAgICAgICAvLyBGaWx0ZXIgb3V0IGFueSBlbnRyaWVzIG1hcmtlZCBhcyBkZXN0cm95ZWRcbiAgICAgICAgICAgIGZpbHRlcmVkQXJyYXkgPSBrby51dGlscy5hcnJheUZpbHRlcih1bndyYXBwZWRBcnJheSwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbmNsdWRlRGVzdHJveWVkIHx8IGl0ZW0gPT09IHVuZGVmaW5lZCB8fCBpdGVtID09PSBudWxsIHx8ICFrby51dGlscy51bndyYXBPYnNlcnZhYmxlKGl0ZW1bJ19kZXN0cm95J10pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIElmIGNhcHRpb24gaXMgaW5jbHVkZWQsIGFkZCBpdCB0byB0aGUgYXJyYXlcbiAgICAgICAgICAgIGlmIChhbGxCaW5kaW5nc1snaGFzJ10oJ29wdGlvbnNDYXB0aW9uJykpIHtcbiAgICAgICAgICAgICAgICBjYXB0aW9uVmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKGFsbEJpbmRpbmdzLmdldCgnb3B0aW9uc0NhcHRpb24nKSk7XG4gICAgICAgICAgICAgICAgLy8gSWYgY2FwdGlvbiB2YWx1ZSBpcyBudWxsIG9yIHVuZGVmaW5lZCwgZG9uJ3Qgc2hvdyBhIGNhcHRpb25cbiAgICAgICAgICAgICAgICBpZiAoY2FwdGlvblZhbHVlICE9PSBudWxsICYmIGNhcHRpb25WYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkQXJyYXkudW5zaGlmdChjYXB0aW9uUGxhY2Vob2xkZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIElmIGEgZmFsc3kgdmFsdWUgaXMgcHJvdmlkZWQgKGUuZy4gbnVsbCksIHdlJ2xsIHNpbXBseSBlbXB0eSB0aGUgc2VsZWN0IGVsZW1lbnRcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGFwcGx5VG9PYmplY3Qob2JqZWN0LCBwcmVkaWNhdGUsIGRlZmF1bHRWYWx1ZSkge1xuICAgICAgICAgICAgdmFyIHByZWRpY2F0ZVR5cGUgPSB0eXBlb2YgcHJlZGljYXRlO1xuICAgICAgICAgICAgaWYgKHByZWRpY2F0ZVR5cGUgPT0gXCJmdW5jdGlvblwiKSAgICAvLyBHaXZlbiBhIGZ1bmN0aW9uOyBydW4gaXQgYWdhaW5zdCB0aGUgZGF0YSB2YWx1ZVxuICAgICAgICAgICAgICAgIHJldHVybiBwcmVkaWNhdGUob2JqZWN0KTtcbiAgICAgICAgICAgIGVsc2UgaWYgKHByZWRpY2F0ZVR5cGUgPT0gXCJzdHJpbmdcIikgLy8gR2l2ZW4gYSBzdHJpbmc7IHRyZWF0IGl0IGFzIGEgcHJvcGVydHkgbmFtZSBvbiB0aGUgZGF0YSB2YWx1ZVxuICAgICAgICAgICAgICAgIHJldHVybiBvYmplY3RbcHJlZGljYXRlXTtcbiAgICAgICAgICAgIGVsc2UgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdpdmVuIG5vIG9wdGlvbnNUZXh0IGFyZzsgdXNlIHRoZSBkYXRhIHZhbHVlIGl0c2VsZlxuICAgICAgICAgICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGZ1bmN0aW9ucyBjYW4gcnVuIGF0IHR3byBkaWZmZXJlbnQgdGltZXM6XG4gICAgICAgIC8vIFRoZSBmaXJzdCBpcyB3aGVuIHRoZSB3aG9sZSBhcnJheSBpcyBiZWluZyB1cGRhdGVkIGRpcmVjdGx5IGZyb20gdGhpcyBiaW5kaW5nIGhhbmRsZXIuXG4gICAgICAgIC8vIFRoZSBzZWNvbmQgaXMgd2hlbiBhbiBvYnNlcnZhYmxlIHZhbHVlIGZvciBhIHNwZWNpZmljIGFycmF5IGVudHJ5IGlzIHVwZGF0ZWQuXG4gICAgICAgIC8vIG9sZE9wdGlvbnMgd2lsbCBiZSBlbXB0eSBpbiB0aGUgZmlyc3QgY2FzZSwgYnV0IHdpbGwgYmUgZmlsbGVkIHdpdGggdGhlIHByZXZpb3VzbHkgZ2VuZXJhdGVkIG9wdGlvbiBpbiB0aGUgc2Vjb25kLlxuICAgICAgICB2YXIgaXRlbVVwZGF0ZSA9IGZhbHNlO1xuICAgICAgICBmdW5jdGlvbiBvcHRpb25Gb3JBcnJheUl0ZW0oYXJyYXlFbnRyeSwgaW5kZXgsIG9sZE9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChvbGRPcHRpb25zLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHByZXZpb3VzU2VsZWN0ZWRWYWx1ZXMgPSBvbGRPcHRpb25zWzBdLnNlbGVjdGVkID8gWyBrby5zZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZShvbGRPcHRpb25zWzBdKSBdIDogW107XG4gICAgICAgICAgICAgICAgaXRlbVVwZGF0ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgb3B0aW9uID0gZWxlbWVudC5vd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgICAgICAgICBpZiAoYXJyYXlFbnRyeSA9PT0gY2FwdGlvblBsYWNlaG9sZGVyKSB7XG4gICAgICAgICAgICAgICAga28udXRpbHMuc2V0VGV4dENvbnRlbnQob3B0aW9uLCBhbGxCaW5kaW5ncy5nZXQoJ29wdGlvbnNDYXB0aW9uJykpO1xuICAgICAgICAgICAgICAgIGtvLnNlbGVjdEV4dGVuc2lvbnMud3JpdGVWYWx1ZShvcHRpb24sIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIEFwcGx5IGEgdmFsdWUgdG8gdGhlIG9wdGlvbiBlbGVtZW50XG4gICAgICAgICAgICAgICAgdmFyIG9wdGlvblZhbHVlID0gYXBwbHlUb09iamVjdChhcnJheUVudHJ5LCBhbGxCaW5kaW5ncy5nZXQoJ29wdGlvbnNWYWx1ZScpLCBhcnJheUVudHJ5KTtcbiAgICAgICAgICAgICAgICBrby5zZWxlY3RFeHRlbnNpb25zLndyaXRlVmFsdWUob3B0aW9uLCBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKG9wdGlvblZhbHVlKSk7XG5cbiAgICAgICAgICAgICAgICAvLyBBcHBseSBzb21lIHRleHQgdG8gdGhlIG9wdGlvbiBlbGVtZW50XG4gICAgICAgICAgICAgICAgdmFyIG9wdGlvblRleHQgPSBhcHBseVRvT2JqZWN0KGFycmF5RW50cnksIGFsbEJpbmRpbmdzLmdldCgnb3B0aW9uc1RleHQnKSwgb3B0aW9uVmFsdWUpO1xuICAgICAgICAgICAgICAgIGtvLnV0aWxzLnNldFRleHRDb250ZW50KG9wdGlvbiwgb3B0aW9uVGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gW29wdGlvbl07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCeSB1c2luZyBhIGJlZm9yZVJlbW92ZSBjYWxsYmFjaywgd2UgZGVsYXkgdGhlIHJlbW92YWwgdW50aWwgYWZ0ZXIgbmV3IGl0ZW1zIGFyZSBhZGRlZC4gVGhpcyBmaXhlcyBhIHNlbGVjdGlvblxuICAgICAgICAvLyBwcm9ibGVtIGluIElFPD04IGFuZCBGaXJlZm94LiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2tub2Nrb3V0L2tub2Nrb3V0L2lzc3Vlcy8xMjA4XG4gICAgICAgIGFycmF5VG9Eb21Ob2RlQ2hpbGRyZW5PcHRpb25zWydiZWZvcmVSZW1vdmUnXSA9XG4gICAgICAgICAgICBmdW5jdGlvbiAob3B0aW9uKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVDaGlsZChvcHRpb24pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBzZXRTZWxlY3Rpb25DYWxsYmFjayhhcnJheUVudHJ5LCBuZXdPcHRpb25zKSB7XG4gICAgICAgICAgICAvLyBJRTYgZG9lc24ndCBsaWtlIHVzIHRvIGFzc2lnbiBzZWxlY3Rpb24gdG8gT1BUSU9OIG5vZGVzIGJlZm9yZSB0aGV5J3JlIGFkZGVkIHRvIHRoZSBkb2N1bWVudC5cbiAgICAgICAgICAgIC8vIFRoYXQncyB3aHkgd2UgZmlyc3QgYWRkZWQgdGhlbSB3aXRob3V0IHNlbGVjdGlvbi4gTm93IGl0J3MgdGltZSB0byBzZXQgdGhlIHNlbGVjdGlvbi5cbiAgICAgICAgICAgIGlmIChwcmV2aW91c1NlbGVjdGVkVmFsdWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHZhciBpc1NlbGVjdGVkID0ga28udXRpbHMuYXJyYXlJbmRleE9mKHByZXZpb3VzU2VsZWN0ZWRWYWx1ZXMsIGtvLnNlbGVjdEV4dGVuc2lvbnMucmVhZFZhbHVlKG5ld09wdGlvbnNbMF0pKSA+PSAwO1xuICAgICAgICAgICAgICAgIGtvLnV0aWxzLnNldE9wdGlvbk5vZGVTZWxlY3Rpb25TdGF0ZShuZXdPcHRpb25zWzBdLCBpc1NlbGVjdGVkKTtcblxuICAgICAgICAgICAgICAgIC8vIElmIHRoaXMgb3B0aW9uIHdhcyBjaGFuZ2VkIGZyb20gYmVpbmcgc2VsZWN0ZWQgZHVyaW5nIGEgc2luZ2xlLWl0ZW0gdXBkYXRlLCBub3RpZnkgdGhlIGNoYW5nZVxuICAgICAgICAgICAgICAgIGlmIChpdGVtVXBkYXRlICYmICFpc1NlbGVjdGVkKVxuICAgICAgICAgICAgICAgICAgICBrby5kZXBlbmRlbmN5RGV0ZWN0aW9uLmlnbm9yZShrby51dGlscy50cmlnZ2VyRXZlbnQsIG51bGwsIFtlbGVtZW50LCBcImNoYW5nZVwiXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2FsbGJhY2sgPSBzZXRTZWxlY3Rpb25DYWxsYmFjaztcbiAgICAgICAgaWYgKGFsbEJpbmRpbmdzWydoYXMnXSgnb3B0aW9uc0FmdGVyUmVuZGVyJykpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24oYXJyYXlFbnRyeSwgbmV3T3B0aW9ucykge1xuICAgICAgICAgICAgICAgIHNldFNlbGVjdGlvbkNhbGxiYWNrKGFycmF5RW50cnksIG5ld09wdGlvbnMpO1xuICAgICAgICAgICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uaWdub3JlKGFsbEJpbmRpbmdzLmdldCgnb3B0aW9uc0FmdGVyUmVuZGVyJyksIG51bGwsIFtuZXdPcHRpb25zWzBdLCBhcnJheUVudHJ5ICE9PSBjYXB0aW9uUGxhY2Vob2xkZXIgPyBhcnJheUVudHJ5IDogdW5kZWZpbmVkXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBrby51dGlscy5zZXREb21Ob2RlQ2hpbGRyZW5Gcm9tQXJyYXlNYXBwaW5nKGVsZW1lbnQsIGZpbHRlcmVkQXJyYXksIG9wdGlvbkZvckFycmF5SXRlbSwgYXJyYXlUb0RvbU5vZGVDaGlsZHJlbk9wdGlvbnMsIGNhbGxiYWNrKTtcblxuICAgICAgICBrby5kZXBlbmRlbmN5RGV0ZWN0aW9uLmlnbm9yZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoYWxsQmluZGluZ3MuZ2V0KCd2YWx1ZUFsbG93VW5zZXQnKSAmJiBhbGxCaW5kaW5nc1snaGFzJ10oJ3ZhbHVlJykpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgbW9kZWwgdmFsdWUgaXMgYXV0aG9yaXRhdGl2ZSwgc28gbWFrZSBzdXJlIGl0cyB2YWx1ZSBpcyB0aGUgb25lIHNlbGVjdGVkXG4gICAgICAgICAgICAgICAga28uc2VsZWN0RXh0ZW5zaW9ucy53cml0ZVZhbHVlKGVsZW1lbnQsIGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUoYWxsQmluZGluZ3MuZ2V0KCd2YWx1ZScpKSwgdHJ1ZSAvKiBhbGxvd1Vuc2V0ICovKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gRGV0ZXJtaW5lIGlmIHRoZSBzZWxlY3Rpb24gaGFzIGNoYW5nZWQgYXMgYSByZXN1bHQgb2YgdXBkYXRpbmcgdGhlIG9wdGlvbnMgbGlzdFxuICAgICAgICAgICAgICAgIHZhciBzZWxlY3Rpb25DaGFuZ2VkO1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50Lm11bHRpcGxlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEZvciBhIG11bHRpcGxlLXNlbGVjdCBib3gsIGNvbXBhcmUgdGhlIG5ldyBzZWxlY3Rpb24gY291bnQgdG8gdGhlIHByZXZpb3VzIG9uZVxuICAgICAgICAgICAgICAgICAgICAvLyBCdXQgaWYgbm90aGluZyB3YXMgc2VsZWN0ZWQgYmVmb3JlLCB0aGUgc2VsZWN0aW9uIGNhbid0IGhhdmUgY2hhbmdlZFxuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25DaGFuZ2VkID0gcHJldmlvdXNTZWxlY3RlZFZhbHVlcy5sZW5ndGggJiYgc2VsZWN0ZWRPcHRpb25zKCkubGVuZ3RoIDwgcHJldmlvdXNTZWxlY3RlZFZhbHVlcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRm9yIGEgc2luZ2xlLXNlbGVjdCBib3gsIGNvbXBhcmUgdGhlIGN1cnJlbnQgdmFsdWUgdG8gdGhlIHByZXZpb3VzIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIC8vIEJ1dCBpZiBub3RoaW5nIHdhcyBzZWxlY3RlZCBiZWZvcmUgb3Igbm90aGluZyBpcyBzZWxlY3RlZCBub3csIGp1c3QgbG9vayBmb3IgYSBjaGFuZ2UgaW4gc2VsZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbkNoYW5nZWQgPSAocHJldmlvdXNTZWxlY3RlZFZhbHVlcy5sZW5ndGggJiYgZWxlbWVudC5zZWxlY3RlZEluZGV4ID49IDApXG4gICAgICAgICAgICAgICAgICAgICAgICA/IChrby5zZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZShlbGVtZW50Lm9wdGlvbnNbZWxlbWVudC5zZWxlY3RlZEluZGV4XSkgIT09IHByZXZpb3VzU2VsZWN0ZWRWYWx1ZXNbMF0pXG4gICAgICAgICAgICAgICAgICAgICAgICA6IChwcmV2aW91c1NlbGVjdGVkVmFsdWVzLmxlbmd0aCB8fCBlbGVtZW50LnNlbGVjdGVkSW5kZXggPj0gMCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gRW5zdXJlIGNvbnNpc3RlbmN5IGJldHdlZW4gbW9kZWwgdmFsdWUgYW5kIHNlbGVjdGVkIG9wdGlvbi5cbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgZHJvcGRvd24gd2FzIGNoYW5nZWQgc28gdGhhdCBzZWxlY3Rpb24gaXMgbm8gbG9uZ2VyIHRoZSBzYW1lLFxuICAgICAgICAgICAgICAgIC8vIG5vdGlmeSB0aGUgdmFsdWUgb3Igc2VsZWN0ZWRPcHRpb25zIGJpbmRpbmcuXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGlvbkNoYW5nZWQpIHtcbiAgICAgICAgICAgICAgICAgICAga28udXRpbHMudHJpZ2dlckV2ZW50KGVsZW1lbnQsIFwiY2hhbmdlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gV29ya2Fyb3VuZCBmb3IgSUUgYnVnXG4gICAgICAgIGtvLnV0aWxzLmVuc3VyZVNlbGVjdEVsZW1lbnRJc1JlbmRlcmVkQ29ycmVjdGx5KGVsZW1lbnQpO1xuXG4gICAgICAgIGlmIChwcmV2aW91c1Njcm9sbFRvcCAmJiBNYXRoLmFicyhwcmV2aW91c1Njcm9sbFRvcCAtIGVsZW1lbnQuc2Nyb2xsVG9wKSA+IDIwKVxuICAgICAgICAgICAgZWxlbWVudC5zY3JvbGxUb3AgPSBwcmV2aW91c1Njcm9sbFRvcDtcbiAgICB9XG59O1xua28uYmluZGluZ0hhbmRsZXJzWydvcHRpb25zJ10ub3B0aW9uVmFsdWVEb21EYXRhS2V5ID0ga28udXRpbHMuZG9tRGF0YS5uZXh0S2V5KCk7XG5rby5iaW5kaW5nSGFuZGxlcnNbJ3NlbGVjdGVkT3B0aW9ucyddID0ge1xuICAgICdhZnRlcic6IFsnb3B0aW9ucycsICdmb3JlYWNoJ10sXG4gICAgJ2luaXQnOiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3MpIHtcbiAgICAgICAga28udXRpbHMucmVnaXN0ZXJFdmVudEhhbmRsZXIoZWxlbWVudCwgXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gdmFsdWVBY2Nlc3NvcigpLCB2YWx1ZVRvV3JpdGUgPSBbXTtcbiAgICAgICAgICAgIGtvLnV0aWxzLmFycmF5Rm9yRWFjaChlbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwib3B0aW9uXCIpLCBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuc2VsZWN0ZWQpXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlVG9Xcml0ZS5wdXNoKGtvLnNlbGVjdEV4dGVuc2lvbnMucmVhZFZhbHVlKG5vZGUpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAga28uZXhwcmVzc2lvblJld3JpdGluZy53cml0ZVZhbHVlVG9Qcm9wZXJ0eSh2YWx1ZSwgYWxsQmluZGluZ3MsICdzZWxlY3RlZE9wdGlvbnMnLCB2YWx1ZVRvV3JpdGUpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgICd1cGRhdGUnOiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3Nvcikge1xuICAgICAgICBpZiAoa28udXRpbHMudGFnTmFtZUxvd2VyKGVsZW1lbnQpICE9IFwic2VsZWN0XCIpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ2YWx1ZXMgYmluZGluZyBhcHBsaWVzIG9ubHkgdG8gU0VMRUNUIGVsZW1lbnRzXCIpO1xuXG4gICAgICAgIHZhciBuZXdWYWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpKTtcbiAgICAgICAgaWYgKG5ld1ZhbHVlICYmIHR5cGVvZiBuZXdWYWx1ZS5sZW5ndGggPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAga28udXRpbHMuYXJyYXlGb3JFYWNoKGVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJvcHRpb25cIiksIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgaXNTZWxlY3RlZCA9IGtvLnV0aWxzLmFycmF5SW5kZXhPZihuZXdWYWx1ZSwga28uc2VsZWN0RXh0ZW5zaW9ucy5yZWFkVmFsdWUobm9kZSkpID49IDA7XG4gICAgICAgICAgICAgICAga28udXRpbHMuc2V0T3B0aW9uTm9kZVNlbGVjdGlvblN0YXRlKG5vZGUsIGlzU2VsZWN0ZWQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xua28uZXhwcmVzc2lvblJld3JpdGluZy50d29XYXlCaW5kaW5nc1snc2VsZWN0ZWRPcHRpb25zJ10gPSB0cnVlO1xua28uYmluZGluZ0hhbmRsZXJzWydzdHlsZSddID0ge1xuICAgICd1cGRhdGUnOiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3Nvcikge1xuICAgICAgICB2YXIgdmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSB8fCB7fSk7XG4gICAgICAgIGtvLnV0aWxzLm9iamVjdEZvckVhY2godmFsdWUsIGZ1bmN0aW9uKHN0eWxlTmFtZSwgc3R5bGVWYWx1ZSkge1xuICAgICAgICAgICAgc3R5bGVWYWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUoc3R5bGVWYWx1ZSk7XG5cbiAgICAgICAgICAgIGlmIChzdHlsZVZhbHVlID09PSBudWxsIHx8IHN0eWxlVmFsdWUgPT09IHVuZGVmaW5lZCB8fCBzdHlsZVZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIC8vIEVtcHR5IHN0cmluZyByZW1vdmVzIHRoZSB2YWx1ZSwgd2hlcmVhcyBudWxsL3VuZGVmaW5lZCBoYXZlIG5vIGVmZmVjdFxuICAgICAgICAgICAgICAgIHN0eWxlVmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlW3N0eWxlTmFtZV0gPSBzdHlsZVZhbHVlO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xua28uYmluZGluZ0hhbmRsZXJzWydzdWJtaXQnXSA9IHtcbiAgICAnaW5pdCc6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5ncywgdmlld01vZGVsLCBiaW5kaW5nQ29udGV4dCkge1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlQWNjZXNzb3IoKSAhPSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgdmFsdWUgZm9yIGEgc3VibWl0IGJpbmRpbmcgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuICAgICAgICBrby51dGlscy5yZWdpc3RlckV2ZW50SGFuZGxlcihlbGVtZW50LCBcInN1Ym1pdFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBoYW5kbGVyUmV0dXJuVmFsdWU7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB2YWx1ZUFjY2Vzc29yKCk7XG4gICAgICAgICAgICB0cnkgeyBoYW5kbGVyUmV0dXJuVmFsdWUgPSB2YWx1ZS5jYWxsKGJpbmRpbmdDb250ZXh0WyckZGF0YSddLCBlbGVtZW50KTsgfVxuICAgICAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICAgICAgaWYgKGhhbmRsZXJSZXR1cm5WYWx1ZSAhPT0gdHJ1ZSkgeyAvLyBOb3JtYWxseSB3ZSB3YW50IHRvIHByZXZlbnQgZGVmYXVsdCBhY3Rpb24uIERldmVsb3BlciBjYW4gb3ZlcnJpZGUgdGhpcyBiZSBleHBsaWNpdGx5IHJldHVybmluZyB0cnVlLlxuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQucHJldmVudERlZmF1bHQpXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcbmtvLmJpbmRpbmdIYW5kbGVyc1sndGV4dCddID0ge1xuICAgICdpbml0JzogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIFByZXZlbnQgYmluZGluZyBvbiB0aGUgZHluYW1pY2FsbHktaW5qZWN0ZWQgdGV4dCBub2RlIChhcyBkZXZlbG9wZXJzIGFyZSB1bmxpa2VseSB0byBleHBlY3QgdGhhdCwgYW5kIGl0IGhhcyBzZWN1cml0eSBpbXBsaWNhdGlvbnMpLlxuICAgICAgICAvLyBJdCBzaG91bGQgYWxzbyBtYWtlIHRoaW5ncyBmYXN0ZXIsIGFzIHdlIG5vIGxvbmdlciBoYXZlIHRvIGNvbnNpZGVyIHdoZXRoZXIgdGhlIHRleHQgbm9kZSBtaWdodCBiZSBiaW5kYWJsZS5cbiAgICAgICAgcmV0dXJuIHsgJ2NvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzJzogdHJ1ZSB9O1xuICAgIH0sXG4gICAgJ3VwZGF0ZSc6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yKSB7XG4gICAgICAgIGtvLnV0aWxzLnNldFRleHRDb250ZW50KGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IoKSk7XG4gICAgfVxufTtcbmtvLnZpcnR1YWxFbGVtZW50cy5hbGxvd2VkQmluZGluZ3NbJ3RleHQnXSA9IHRydWU7XG4oZnVuY3Rpb24gKCkge1xuXG5pZiAod2luZG93ICYmIHdpbmRvdy5uYXZpZ2F0b3IpIHtcbiAgICB2YXIgcGFyc2VWZXJzaW9uID0gZnVuY3Rpb24gKG1hdGNoZXMpIHtcbiAgICAgICAgaWYgKG1hdGNoZXMpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KG1hdGNoZXNbMV0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIERldGVjdCB2YXJpb3VzIGJyb3dzZXIgdmVyc2lvbnMgYmVjYXVzZSBzb21lIG9sZCB2ZXJzaW9ucyBkb24ndCBmdWxseSBzdXBwb3J0IHRoZSAnaW5wdXQnIGV2ZW50XG4gICAgdmFyIG9wZXJhVmVyc2lvbiA9IHdpbmRvdy5vcGVyYSAmJiB3aW5kb3cub3BlcmEudmVyc2lvbiAmJiBwYXJzZUludCh3aW5kb3cub3BlcmEudmVyc2lvbigpKSxcbiAgICAgICAgdXNlckFnZW50ID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQsXG4gICAgICAgIHNhZmFyaVZlcnNpb24gPSBwYXJzZVZlcnNpb24odXNlckFnZW50Lm1hdGNoKC9eKD86KD8hY2hyb21lKS4pKnZlcnNpb25cXC8oW14gXSopIHNhZmFyaS9pKSksXG4gICAgICAgIGZpcmVmb3hWZXJzaW9uID0gcGFyc2VWZXJzaW9uKHVzZXJBZ2VudC5tYXRjaCgvRmlyZWZveFxcLyhbXiBdKikvKSk7XG59XG5cbi8vIElFIDggYW5kIDkgaGF2ZSBidWdzIHRoYXQgcHJldmVudCB0aGUgbm9ybWFsIGV2ZW50cyBmcm9tIGZpcmluZyB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuLy8gQnV0IGl0IGRvZXMgZmlyZSB0aGUgJ3NlbGVjdGlvbmNoYW5nZScgZXZlbnQgb24gbWFueSBvZiB0aG9zZSwgcHJlc3VtYWJseSBiZWNhdXNlIHRoZVxuLy8gY3Vyc29yIGlzIG1vdmluZyBhbmQgdGhhdCBjb3VudHMgYXMgdGhlIHNlbGVjdGlvbiBjaGFuZ2luZy4gVGhlICdzZWxlY3Rpb25jaGFuZ2UnIGV2ZW50IGlzXG4vLyBmaXJlZCBhdCB0aGUgZG9jdW1lbnQgbGV2ZWwgb25seSBhbmQgZG9lc24ndCBkaXJlY3RseSBpbmRpY2F0ZSB3aGljaCBlbGVtZW50IGNoYW5nZWQuIFdlXG4vLyBzZXQgdXAganVzdCBvbmUgZXZlbnQgaGFuZGxlciBmb3IgdGhlIGRvY3VtZW50IGFuZCB1c2UgJ2FjdGl2ZUVsZW1lbnQnIHRvIGRldGVybWluZSB3aGljaFxuLy8gZWxlbWVudCB3YXMgY2hhbmdlZC5cbmlmIChrby51dGlscy5pZVZlcnNpb24gPCAxMCkge1xuICAgIHZhciBzZWxlY3Rpb25DaGFuZ2VSZWdpc3RlcmVkTmFtZSA9IGtvLnV0aWxzLmRvbURhdGEubmV4dEtleSgpLFxuICAgICAgICBzZWxlY3Rpb25DaGFuZ2VIYW5kbGVyTmFtZSA9IGtvLnV0aWxzLmRvbURhdGEubmV4dEtleSgpO1xuICAgIHZhciBzZWxlY3Rpb25DaGFuZ2VIYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIHRhcmdldCA9IHRoaXMuYWN0aXZlRWxlbWVudCxcbiAgICAgICAgICAgIGhhbmRsZXIgPSB0YXJnZXQgJiYga28udXRpbHMuZG9tRGF0YS5nZXQodGFyZ2V0LCBzZWxlY3Rpb25DaGFuZ2VIYW5kbGVyTmFtZSk7XG4gICAgICAgIGlmIChoYW5kbGVyKSB7XG4gICAgICAgICAgICBoYW5kbGVyKGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdmFyIHJlZ2lzdGVyRm9yU2VsZWN0aW9uQ2hhbmdlRXZlbnQgPSBmdW5jdGlvbiAoZWxlbWVudCwgaGFuZGxlcikge1xuICAgICAgICB2YXIgb3duZXJEb2MgPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQ7XG4gICAgICAgIGlmICgha28udXRpbHMuZG9tRGF0YS5nZXQob3duZXJEb2MsIHNlbGVjdGlvbkNoYW5nZVJlZ2lzdGVyZWROYW1lKSkge1xuICAgICAgICAgICAga28udXRpbHMuZG9tRGF0YS5zZXQob3duZXJEb2MsIHNlbGVjdGlvbkNoYW5nZVJlZ2lzdGVyZWROYW1lLCB0cnVlKTtcbiAgICAgICAgICAgIGtvLnV0aWxzLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKG93bmVyRG9jLCAnc2VsZWN0aW9uY2hhbmdlJywgc2VsZWN0aW9uQ2hhbmdlSGFuZGxlcik7XG4gICAgICAgIH1cbiAgICAgICAga28udXRpbHMuZG9tRGF0YS5zZXQoZWxlbWVudCwgc2VsZWN0aW9uQ2hhbmdlSGFuZGxlck5hbWUsIGhhbmRsZXIpO1xuICAgIH07XG59XG5cbmtvLmJpbmRpbmdIYW5kbGVyc1sndGV4dElucHV0J10gPSB7XG4gICAgJ2luaXQnOiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3MpIHtcblxuICAgICAgICB2YXIgcHJldmlvdXNFbGVtZW50VmFsdWUgPSBlbGVtZW50LnZhbHVlLFxuICAgICAgICAgICAgdGltZW91dEhhbmRsZSxcbiAgICAgICAgICAgIGVsZW1lbnRWYWx1ZUJlZm9yZUV2ZW50O1xuXG4gICAgICAgIHZhciB1cGRhdGVNb2RlbCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRIYW5kbGUpO1xuICAgICAgICAgICAgZWxlbWVudFZhbHVlQmVmb3JlRXZlbnQgPSB0aW1lb3V0SGFuZGxlID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICB2YXIgZWxlbWVudFZhbHVlID0gZWxlbWVudC52YWx1ZTtcbiAgICAgICAgICAgIGlmIChwcmV2aW91c0VsZW1lbnRWYWx1ZSAhPT0gZWxlbWVudFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgLy8gUHJvdmlkZSBhIHdheSBmb3IgdGVzdHMgdG8ga25vdyBleGFjdGx5IHdoaWNoIGV2ZW50IHdhcyBwcm9jZXNzZWRcbiAgICAgICAgICAgICAgICBpZiAoREVCVUcgJiYgZXZlbnQpIGVsZW1lbnRbJ19rb190ZXh0SW5wdXRQcm9jZXNzZWRFdmVudCddID0gZXZlbnQudHlwZTtcbiAgICAgICAgICAgICAgICBwcmV2aW91c0VsZW1lbnRWYWx1ZSA9IGVsZW1lbnRWYWx1ZTtcbiAgICAgICAgICAgICAgICBrby5leHByZXNzaW9uUmV3cml0aW5nLndyaXRlVmFsdWVUb1Byb3BlcnR5KHZhbHVlQWNjZXNzb3IoKSwgYWxsQmluZGluZ3MsICd0ZXh0SW5wdXQnLCBlbGVtZW50VmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBkZWZlclVwZGF0ZU1vZGVsID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoIXRpbWVvdXRIYW5kbGUpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgZWxlbWVudFZhbHVlQmVmb3JlRXZlbnQgdmFyaWFibGUgaXMgc2V0ICpvbmx5KiBkdXJpbmcgdGhlIGJyaWVmIGdhcCBiZXR3ZWVuIGFuXG4gICAgICAgICAgICAgICAgLy8gZXZlbnQgZmlyaW5nIGFuZCB0aGUgdXBkYXRlTW9kZWwgZnVuY3Rpb24gcnVubmluZy4gVGhpcyBhbGxvd3MgdXMgdG8gaWdub3JlIG1vZGVsXG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlcyB0aGF0IGFyZSBmcm9tIHRoZSBwcmV2aW91cyBzdGF0ZSBvZiB0aGUgZWxlbWVudCwgdXN1YWxseSBkdWUgdG8gdGVjaG5pcXVlc1xuICAgICAgICAgICAgICAgIC8vIHN1Y2ggYXMgcmF0ZUxpbWl0LiBTdWNoIHVwZGF0ZXMsIGlmIG5vdCBpZ25vcmVkLCBjYW4gY2F1c2Uga2V5c3Ryb2tlcyB0byBiZSBsb3N0LlxuICAgICAgICAgICAgICAgIGVsZW1lbnRWYWx1ZUJlZm9yZUV2ZW50ID0gZWxlbWVudC52YWx1ZTtcbiAgICAgICAgICAgICAgICB2YXIgaGFuZGxlciA9IERFQlVHID8gdXBkYXRlTW9kZWwuYmluZChlbGVtZW50LCB7dHlwZTogZXZlbnQudHlwZX0pIDogdXBkYXRlTW9kZWw7XG4gICAgICAgICAgICAgICAgdGltZW91dEhhbmRsZSA9IHNldFRpbWVvdXQoaGFuZGxlciwgNCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHVwZGF0ZVZpZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbW9kZWxWYWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpKTtcblxuICAgICAgICAgICAgaWYgKG1vZGVsVmFsdWUgPT09IG51bGwgfHwgbW9kZWxWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbW9kZWxWYWx1ZSA9ICcnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZWxlbWVudFZhbHVlQmVmb3JlRXZlbnQgIT09IHVuZGVmaW5lZCAmJiBtb2RlbFZhbHVlID09PSBlbGVtZW50VmFsdWVCZWZvcmVFdmVudCkge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQodXBkYXRlVmlldywgNCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBVcGRhdGUgdGhlIGVsZW1lbnQgb25seSBpZiB0aGUgZWxlbWVudCBhbmQgbW9kZWwgYXJlIGRpZmZlcmVudC4gT24gc29tZSBicm93c2VycywgdXBkYXRpbmcgdGhlIHZhbHVlXG4gICAgICAgICAgICAvLyB3aWxsIG1vdmUgdGhlIGN1cnNvciB0byB0aGUgZW5kIG9mIHRoZSBpbnB1dCwgd2hpY2ggd291bGQgYmUgYmFkIHdoaWxlIHRoZSB1c2VyIGlzIHR5cGluZy5cbiAgICAgICAgICAgIGlmIChlbGVtZW50LnZhbHVlICE9PSBtb2RlbFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcHJldmlvdXNFbGVtZW50VmFsdWUgPSBtb2RlbFZhbHVlOyAgLy8gTWFrZSBzdXJlIHdlIGlnbm9yZSBldmVudHMgKHByb3BlcnR5Y2hhbmdlKSB0aGF0IHJlc3VsdCBmcm9tIHVwZGF0aW5nIHRoZSB2YWx1ZVxuICAgICAgICAgICAgICAgIGVsZW1lbnQudmFsdWUgPSBtb2RlbFZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBvbkV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgICAgICAgICBrby51dGlscy5yZWdpc3RlckV2ZW50SGFuZGxlcihlbGVtZW50LCBldmVudCwgaGFuZGxlcik7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKERFQlVHICYmIGtvLmJpbmRpbmdIYW5kbGVyc1sndGV4dElucHV0J11bJ19mb3JjZVVwZGF0ZU9uJ10pIHtcbiAgICAgICAgICAgIC8vIFByb3ZpZGUgYSB3YXkgZm9yIHRlc3RzIHRvIHNwZWNpZnkgZXhhY3RseSB3aGljaCBldmVudHMgYXJlIGJvdW5kXG4gICAgICAgICAgICBrby51dGlscy5hcnJheUZvckVhY2goa28uYmluZGluZ0hhbmRsZXJzWyd0ZXh0SW5wdXQnXVsnX2ZvcmNlVXBkYXRlT24nXSwgZnVuY3Rpb24oZXZlbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50TmFtZS5zbGljZSgwLDUpID09ICdhZnRlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgb25FdmVudChldmVudE5hbWUuc2xpY2UoNSksIGRlZmVyVXBkYXRlTW9kZWwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG9uRXZlbnQoZXZlbnROYW1lLCB1cGRhdGVNb2RlbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoa28udXRpbHMuaWVWZXJzaW9uIDwgMTApIHtcbiAgICAgICAgICAgICAgICAvLyBJbnRlcm5ldCBFeHBsb3JlciA8PSA4IGRvZXNuJ3Qgc3VwcG9ydCB0aGUgJ2lucHV0JyBldmVudCwgYnV0IGRvZXMgaW5jbHVkZSAncHJvcGVydHljaGFuZ2UnIHRoYXQgZmlyZXMgd2hlbmV2ZXJcbiAgICAgICAgICAgICAgICAvLyBhbnkgcHJvcGVydHkgb2YgYW4gZWxlbWVudCBjaGFuZ2VzLiBVbmxpa2UgJ2lucHV0JywgaXQgYWxzbyBmaXJlcyBpZiBhIHByb3BlcnR5IGlzIGNoYW5nZWQgZnJvbSBKYXZhU2NyaXB0IGNvZGUsXG4gICAgICAgICAgICAgICAgLy8gYnV0IHRoYXQncyBhbiBhY2NlcHRhYmxlIGNvbXByb21pc2UgZm9yIHRoaXMgYmluZGluZy4gSUUgOSBkb2VzIHN1cHBvcnQgJ2lucHV0JywgYnV0IHNpbmNlIGl0IGRvZXNuJ3QgZmlyZSBpdFxuICAgICAgICAgICAgICAgIC8vIHdoZW4gdXNpbmcgYXV0b2NvbXBsZXRlLCB3ZSdsbCB1c2UgJ3Byb3BlcnR5Y2hhbmdlJyBmb3IgaXQgYWxzby5cbiAgICAgICAgICAgICAgICBvbkV2ZW50KCdwcm9wZXJ0eWNoYW5nZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5wcm9wZXJ0eU5hbWUgPT09ICd2YWx1ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZU1vZGVsKGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKGtvLnV0aWxzLmllVmVyc2lvbiA9PSA4KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElFIDggaGFzIGEgYnVnIHdoZXJlIGl0IGZhaWxzIHRvIGZpcmUgJ3Byb3BlcnR5Y2hhbmdlJyBvbiB0aGUgZmlyc3QgdXBkYXRlIGZvbGxvd2luZyBhIHZhbHVlIGNoYW5nZSBmcm9tXG4gICAgICAgICAgICAgICAgICAgIC8vIEphdmFTY3JpcHQgY29kZS4gSXQgYWxzbyBkb2Vzbid0IGZpcmUgaWYgeW91IGNsZWFyIHRoZSBlbnRpcmUgdmFsdWUuIFRvIGZpeCB0aGlzLCB3ZSBiaW5kIHRvIHRoZSBmb2xsb3dpbmdcbiAgICAgICAgICAgICAgICAgICAgLy8gZXZlbnRzIHRvby5cbiAgICAgICAgICAgICAgICAgICAgb25FdmVudCgna2V5dXAnLCB1cGRhdGVNb2RlbCk7ICAgICAgLy8gQSBzaW5nbGUga2V5c3Rva2VcbiAgICAgICAgICAgICAgICAgICAgb25FdmVudCgna2V5ZG93bicsIHVwZGF0ZU1vZGVsKTsgICAgLy8gVGhlIGZpcnN0IGNoYXJhY3RlciB3aGVuIGEga2V5IGlzIGhlbGQgZG93blxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoa28udXRpbHMuaWVWZXJzaW9uID49IDgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSW50ZXJuZXQgRXhwbG9yZXIgOSBkb2Vzbid0IGZpcmUgdGhlICdpbnB1dCcgZXZlbnQgd2hlbiBkZWxldGluZyB0ZXh0LCBpbmNsdWRpbmcgdXNpbmdcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGJhY2tzcGFjZSwgZGVsZXRlLCBvciBjdHJsLXgga2V5cywgY2xpY2tpbmcgdGhlICd4JyB0byBjbGVhciB0aGUgaW5wdXQsIGRyYWdnaW5nIHRleHRcbiAgICAgICAgICAgICAgICAgICAgLy8gb3V0IG9mIHRoZSBmaWVsZCwgYW5kIGN1dHRpbmcgb3IgZGVsZXRpbmcgdGV4dCB1c2luZyB0aGUgY29udGV4dCBtZW51LiAnc2VsZWN0aW9uY2hhbmdlJ1xuICAgICAgICAgICAgICAgICAgICAvLyBjYW4gZGV0ZWN0IGFsbCBvZiB0aG9zZSBleGNlcHQgZHJhZ2dpbmcgdGV4dCBvdXQgb2YgdGhlIGZpZWxkLCBmb3Igd2hpY2ggd2UgdXNlICdkcmFnZW5kJy5cbiAgICAgICAgICAgICAgICAgICAgLy8gVGhlc2UgYXJlIGFsc28gbmVlZGVkIGluIElFOCBiZWNhdXNlIG9mIHRoZSBidWcgZGVzY3JpYmVkIGFib3ZlLlxuICAgICAgICAgICAgICAgICAgICByZWdpc3RlckZvclNlbGVjdGlvbkNoYW5nZUV2ZW50KGVsZW1lbnQsIHVwZGF0ZU1vZGVsKTsgIC8vICdzZWxlY3Rpb25jaGFuZ2UnIGNvdmVycyBjdXQsIHBhc3RlLCBkcm9wLCBkZWxldGUsIGV0Yy5cbiAgICAgICAgICAgICAgICAgICAgb25FdmVudCgnZHJhZ2VuZCcsIGRlZmVyVXBkYXRlTW9kZWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gQWxsIG90aGVyIHN1cHBvcnRlZCBicm93c2VycyBzdXBwb3J0IHRoZSAnaW5wdXQnIGV2ZW50LCB3aGljaCBmaXJlcyB3aGVuZXZlciB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudCBpcyBjaGFuZ2VkXG4gICAgICAgICAgICAgICAgLy8gdGhyb3VnaCB0aGUgdXNlciBpbnRlcmZhY2UuXG4gICAgICAgICAgICAgICAgb25FdmVudCgnaW5wdXQnLCB1cGRhdGVNb2RlbCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2FmYXJpVmVyc2lvbiA8IDUgJiYga28udXRpbHMudGFnTmFtZUxvd2VyKGVsZW1lbnQpID09PSBcInRleHRhcmVhXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2FmYXJpIDw1IGRvZXNuJ3QgZmlyZSB0aGUgJ2lucHV0JyBldmVudCBmb3IgPHRleHRhcmVhPiBlbGVtZW50cyAoaXQgZG9lcyBmaXJlICd0ZXh0SW5wdXQnXG4gICAgICAgICAgICAgICAgICAgIC8vIGJ1dCBvbmx5IHdoZW4gdHlwaW5nKS4gU28gd2UnbGwganVzdCBjYXRjaCBhcyBtdWNoIGFzIHdlIGNhbiB3aXRoIGtleWRvd24sIGN1dCwgYW5kIHBhc3RlLlxuICAgICAgICAgICAgICAgICAgICBvbkV2ZW50KCdrZXlkb3duJywgZGVmZXJVcGRhdGVNb2RlbCk7XG4gICAgICAgICAgICAgICAgICAgIG9uRXZlbnQoJ3Bhc3RlJywgZGVmZXJVcGRhdGVNb2RlbCk7XG4gICAgICAgICAgICAgICAgICAgIG9uRXZlbnQoJ2N1dCcsIGRlZmVyVXBkYXRlTW9kZWwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob3BlcmFWZXJzaW9uIDwgMTEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gT3BlcmEgMTAgZG9lc24ndCBhbHdheXMgZmlyZSB0aGUgJ2lucHV0JyBldmVudCBmb3IgY3V0LCBwYXN0ZSwgdW5kbyAmIGRyb3Agb3BlcmF0aW9ucy5cbiAgICAgICAgICAgICAgICAgICAgLy8gV2UgY2FuIHRyeSB0byBjYXRjaCBzb21lIG9mIHRob3NlIHVzaW5nICdrZXlkb3duJy5cbiAgICAgICAgICAgICAgICAgICAgb25FdmVudCgna2V5ZG93bicsIGRlZmVyVXBkYXRlTW9kZWwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlyZWZveFZlcnNpb24gPCA0LjApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRmlyZWZveCA8PSAzLjYgZG9lc24ndCBmaXJlIHRoZSAnaW5wdXQnIGV2ZW50IHdoZW4gdGV4dCBpcyBmaWxsZWQgaW4gdGhyb3VnaCBhdXRvY29tcGxldGVcbiAgICAgICAgICAgICAgICAgICAgb25FdmVudCgnRE9NQXV0b0NvbXBsZXRlJywgdXBkYXRlTW9kZWwpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEZpcmVmb3ggPD0zLjUgZG9lc24ndCBmaXJlIHRoZSAnaW5wdXQnIGV2ZW50IHdoZW4gdGV4dCBpcyBkcm9wcGVkIGludG8gdGhlIGlucHV0LlxuICAgICAgICAgICAgICAgICAgICBvbkV2ZW50KCdkcmFnZHJvcCcsIHVwZGF0ZU1vZGVsKTsgICAgICAgLy8gPDMuNVxuICAgICAgICAgICAgICAgICAgICBvbkV2ZW50KCdkcm9wJywgdXBkYXRlTW9kZWwpOyAgICAgICAgICAgLy8gMy41XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmluZCB0byB0aGUgY2hhbmdlIGV2ZW50IHNvIHRoYXQgd2UgY2FuIGNhdGNoIHByb2dyYW1tYXRpYyB1cGRhdGVzIG9mIHRoZSB2YWx1ZSB0aGF0IGZpcmUgdGhpcyBldmVudC5cbiAgICAgICAgb25FdmVudCgnY2hhbmdlJywgdXBkYXRlTW9kZWwpO1xuXG4gICAgICAgIGtvLmNvbXB1dGVkKHVwZGF0ZVZpZXcsIG51bGwsIHsgZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkOiBlbGVtZW50IH0pO1xuICAgIH1cbn07XG5rby5leHByZXNzaW9uUmV3cml0aW5nLnR3b1dheUJpbmRpbmdzWyd0ZXh0SW5wdXQnXSA9IHRydWU7XG5cbi8vIHRleHRpbnB1dCBpcyBhbiBhbGlhcyBmb3IgdGV4dElucHV0XG5rby5iaW5kaW5nSGFuZGxlcnNbJ3RleHRpbnB1dCddID0ge1xuICAgIC8vIHByZXByb2Nlc3MgaXMgdGhlIG9ubHkgd2F5IHRvIHNldCB1cCBhIGZ1bGwgYWxpYXNcbiAgICAncHJlcHJvY2Vzcyc6IGZ1bmN0aW9uICh2YWx1ZSwgbmFtZSwgYWRkQmluZGluZykge1xuICAgICAgICBhZGRCaW5kaW5nKCd0ZXh0SW5wdXQnLCB2YWx1ZSk7XG4gICAgfVxufTtcblxufSkoKTtrby5iaW5kaW5nSGFuZGxlcnNbJ3VuaXF1ZU5hbWUnXSA9IHtcbiAgICAnaW5pdCc6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yKSB7XG4gICAgICAgIGlmICh2YWx1ZUFjY2Vzc29yKCkpIHtcbiAgICAgICAgICAgIHZhciBuYW1lID0gXCJrb191bmlxdWVfXCIgKyAoKytrby5iaW5kaW5nSGFuZGxlcnNbJ3VuaXF1ZU5hbWUnXS5jdXJyZW50SW5kZXgpO1xuICAgICAgICAgICAga28udXRpbHMuc2V0RWxlbWVudE5hbWUoZWxlbWVudCwgbmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xua28uYmluZGluZ0hhbmRsZXJzWyd1bmlxdWVOYW1lJ10uY3VycmVudEluZGV4ID0gMDtcbmtvLmJpbmRpbmdIYW5kbGVyc1sndmFsdWUnXSA9IHtcbiAgICAnYWZ0ZXInOiBbJ29wdGlvbnMnLCAnZm9yZWFjaCddLFxuICAgICdpbml0JzogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzKSB7XG4gICAgICAgIC8vIElmIHRoZSB2YWx1ZSBiaW5kaW5nIGlzIHBsYWNlZCBvbiBhIHJhZGlvL2NoZWNrYm94LCB0aGVuIGp1c3QgcGFzcyB0aHJvdWdoIHRvIGNoZWNrZWRWYWx1ZSBhbmQgcXVpdFxuICAgICAgICBpZiAoZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT0gXCJpbnB1dFwiICYmIChlbGVtZW50LnR5cGUgPT0gXCJjaGVja2JveFwiIHx8IGVsZW1lbnQudHlwZSA9PSBcInJhZGlvXCIpKSB7XG4gICAgICAgICAgICBrby5hcHBseUJpbmRpbmdBY2Nlc3NvcnNUb05vZGUoZWxlbWVudCwgeyAnY2hlY2tlZFZhbHVlJzogdmFsdWVBY2Nlc3NvciB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFsd2F5cyBjYXRjaCBcImNoYW5nZVwiIGV2ZW50OyBwb3NzaWJseSBvdGhlciBldmVudHMgdG9vIGlmIGFza2VkXG4gICAgICAgIHZhciBldmVudHNUb0NhdGNoID0gW1wiY2hhbmdlXCJdO1xuICAgICAgICB2YXIgcmVxdWVzdGVkRXZlbnRzVG9DYXRjaCA9IGFsbEJpbmRpbmdzLmdldChcInZhbHVlVXBkYXRlXCIpO1xuICAgICAgICB2YXIgcHJvcGVydHlDaGFuZ2VkRmlyZWQgPSBmYWxzZTtcbiAgICAgICAgdmFyIGVsZW1lbnRWYWx1ZUJlZm9yZUV2ZW50ID0gbnVsbDtcblxuICAgICAgICBpZiAocmVxdWVzdGVkRXZlbnRzVG9DYXRjaCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiByZXF1ZXN0ZWRFdmVudHNUb0NhdGNoID09IFwic3RyaW5nXCIpIC8vIEFsbG93IGJvdGggaW5kaXZpZHVhbCBldmVudCBuYW1lcywgYW5kIGFycmF5cyBvZiBldmVudCBuYW1lc1xuICAgICAgICAgICAgICAgIHJlcXVlc3RlZEV2ZW50c1RvQ2F0Y2ggPSBbcmVxdWVzdGVkRXZlbnRzVG9DYXRjaF07XG4gICAgICAgICAgICBrby51dGlscy5hcnJheVB1c2hBbGwoZXZlbnRzVG9DYXRjaCwgcmVxdWVzdGVkRXZlbnRzVG9DYXRjaCk7XG4gICAgICAgICAgICBldmVudHNUb0NhdGNoID0ga28udXRpbHMuYXJyYXlHZXREaXN0aW5jdFZhbHVlcyhldmVudHNUb0NhdGNoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB2YWx1ZVVwZGF0ZUhhbmRsZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGVsZW1lbnRWYWx1ZUJlZm9yZUV2ZW50ID0gbnVsbDtcbiAgICAgICAgICAgIHByb3BlcnR5Q2hhbmdlZEZpcmVkID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgbW9kZWxWYWx1ZSA9IHZhbHVlQWNjZXNzb3IoKTtcbiAgICAgICAgICAgIHZhciBlbGVtZW50VmFsdWUgPSBrby5zZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZShlbGVtZW50KTtcbiAgICAgICAgICAgIGtvLmV4cHJlc3Npb25SZXdyaXRpbmcud3JpdGVWYWx1ZVRvUHJvcGVydHkobW9kZWxWYWx1ZSwgYWxsQmluZGluZ3MsICd2YWx1ZScsIGVsZW1lbnRWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXb3JrYXJvdW5kIGZvciBodHRwczovL2dpdGh1Yi5jb20vU3RldmVTYW5kZXJzb24va25vY2tvdXQvaXNzdWVzLzEyMlxuICAgICAgICAvLyBJRSBkb2Vzbid0IGZpcmUgXCJjaGFuZ2VcIiBldmVudHMgb24gdGV4dGJveGVzIGlmIHRoZSB1c2VyIHNlbGVjdHMgYSB2YWx1ZSBmcm9tIGl0cyBhdXRvY29tcGxldGUgbGlzdFxuICAgICAgICB2YXIgaWVBdXRvQ29tcGxldGVIYWNrTmVlZGVkID0ga28udXRpbHMuaWVWZXJzaW9uICYmIGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09IFwiaW5wdXRcIiAmJiBlbGVtZW50LnR5cGUgPT0gXCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIGVsZW1lbnQuYXV0b2NvbXBsZXRlICE9IFwib2ZmXCIgJiYgKCFlbGVtZW50LmZvcm0gfHwgZWxlbWVudC5mb3JtLmF1dG9jb21wbGV0ZSAhPSBcIm9mZlwiKTtcbiAgICAgICAgaWYgKGllQXV0b0NvbXBsZXRlSGFja05lZWRlZCAmJiBrby51dGlscy5hcnJheUluZGV4T2YoZXZlbnRzVG9DYXRjaCwgXCJwcm9wZXJ0eWNoYW5nZVwiKSA9PSAtMSkge1xuICAgICAgICAgICAga28udXRpbHMucmVnaXN0ZXJFdmVudEhhbmRsZXIoZWxlbWVudCwgXCJwcm9wZXJ0eWNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7IHByb3BlcnR5Q2hhbmdlZEZpcmVkID0gdHJ1ZSB9KTtcbiAgICAgICAgICAgIGtvLnV0aWxzLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKGVsZW1lbnQsIFwiZm9jdXNcIiwgZnVuY3Rpb24gKCkgeyBwcm9wZXJ0eUNoYW5nZWRGaXJlZCA9IGZhbHNlIH0pO1xuICAgICAgICAgICAga28udXRpbHMucmVnaXN0ZXJFdmVudEhhbmRsZXIoZWxlbWVudCwgXCJibHVyXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eUNoYW5nZWRGaXJlZCkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZVVwZGF0ZUhhbmRsZXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGtvLnV0aWxzLmFycmF5Rm9yRWFjaChldmVudHNUb0NhdGNoLCBmdW5jdGlvbihldmVudE5hbWUpIHtcbiAgICAgICAgICAgIC8vIFRoZSBzeW50YXggXCJhZnRlcjxldmVudG5hbWU+XCIgbWVhbnMgXCJydW4gdGhlIGhhbmRsZXIgYXN5bmNocm9ub3VzbHkgYWZ0ZXIgdGhlIGV2ZW50XCJcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgdXNlZnVsLCBmb3IgZXhhbXBsZSwgdG8gY2F0Y2ggXCJrZXlkb3duXCIgZXZlbnRzIGFmdGVyIHRoZSBicm93c2VyIGhhcyB1cGRhdGVkIHRoZSBjb250cm9sXG4gICAgICAgICAgICAvLyAob3RoZXJ3aXNlLCBrby5zZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZSh0aGlzKSB3aWxsIHJlY2VpdmUgdGhlIGNvbnRyb2wncyB2YWx1ZSAqYmVmb3JlKiB0aGUga2V5IGV2ZW50KVxuICAgICAgICAgICAgdmFyIGhhbmRsZXIgPSB2YWx1ZVVwZGF0ZUhhbmRsZXI7XG4gICAgICAgICAgICBpZiAoa28udXRpbHMuc3RyaW5nU3RhcnRzV2l0aChldmVudE5hbWUsIFwiYWZ0ZXJcIikpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZSBlbGVtZW50VmFsdWVCZWZvcmVFdmVudCB2YXJpYWJsZSBpcyBub24tbnVsbCAqb25seSogZHVyaW5nIHRoZSBicmllZiBnYXAgYmV0d2VlblxuICAgICAgICAgICAgICAgICAgICAvLyBhIGtleVggZXZlbnQgZmlyaW5nIGFuZCB0aGUgdmFsdWVVcGRhdGVIYW5kbGVyIHJ1bm5pbmcsIHdoaWNoIGlzIHNjaGVkdWxlZCB0byBoYXBwZW5cbiAgICAgICAgICAgICAgICAgICAgLy8gYXQgdGhlIGVhcmxpZXN0IGFzeW5jaHJvbm91cyBvcHBvcnR1bml0eS4gV2Ugc3RvcmUgdGhpcyB0ZW1wb3JhcnkgaW5mb3JtYXRpb24gc28gdGhhdFxuICAgICAgICAgICAgICAgICAgICAvLyBpZiwgYmV0d2VlbiBrZXlYIGFuZCB2YWx1ZVVwZGF0ZUhhbmRsZXIsIHRoZSB1bmRlcmx5aW5nIG1vZGVsIHZhbHVlIGNoYW5nZXMgc2VwYXJhdGVseSxcbiAgICAgICAgICAgICAgICAgICAgLy8gd2UgY2FuIG92ZXJ3cml0ZSB0aGF0IG1vZGVsIHZhbHVlIGNoYW5nZSB3aXRoIHRoZSB2YWx1ZSB0aGUgdXNlciBqdXN0IHR5cGVkLiBPdGhlcndpc2UsXG4gICAgICAgICAgICAgICAgICAgIC8vIHRlY2huaXF1ZXMgbGlrZSByYXRlTGltaXQgY2FuIHRyaWdnZXIgbW9kZWwgY2hhbmdlcyBhdCBjcml0aWNhbCBtb21lbnRzIHRoYXQgd2lsbFxuICAgICAgICAgICAgICAgICAgICAvLyBvdmVycmlkZSB0aGUgdXNlcidzIGlucHV0cywgY2F1c2luZyBrZXlzdHJva2VzIHRvIGJlIGxvc3QuXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRWYWx1ZUJlZm9yZUV2ZW50ID0ga28uc2VsZWN0RXh0ZW5zaW9ucy5yZWFkVmFsdWUoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQodmFsdWVVcGRhdGVIYW5kbGVyLCAwKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGV2ZW50TmFtZSA9IGV2ZW50TmFtZS5zdWJzdHJpbmcoXCJhZnRlclwiLmxlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBrby51dGlscy5yZWdpc3RlckV2ZW50SGFuZGxlcihlbGVtZW50LCBldmVudE5hbWUsIGhhbmRsZXIpO1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgdXBkYXRlRnJvbU1vZGVsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG5ld1ZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZUFjY2Vzc29yKCkpO1xuICAgICAgICAgICAgdmFyIGVsZW1lbnRWYWx1ZSA9IGtvLnNlbGVjdEV4dGVuc2lvbnMucmVhZFZhbHVlKGVsZW1lbnQpO1xuXG4gICAgICAgICAgICBpZiAoZWxlbWVudFZhbHVlQmVmb3JlRXZlbnQgIT09IG51bGwgJiYgbmV3VmFsdWUgPT09IGVsZW1lbnRWYWx1ZUJlZm9yZUV2ZW50KSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCh1cGRhdGVGcm9tTW9kZWwsIDApO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHZhbHVlSGFzQ2hhbmdlZCA9IChuZXdWYWx1ZSAhPT0gZWxlbWVudFZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKHZhbHVlSGFzQ2hhbmdlZCkge1xuICAgICAgICAgICAgICAgIGlmIChrby51dGlscy50YWdOYW1lTG93ZXIoZWxlbWVudCkgPT09IFwic2VsZWN0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFsbG93VW5zZXQgPSBhbGxCaW5kaW5ncy5nZXQoJ3ZhbHVlQWxsb3dVbnNldCcpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXBwbHlWYWx1ZUFjdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtvLnNlbGVjdEV4dGVuc2lvbnMud3JpdGVWYWx1ZShlbGVtZW50LCBuZXdWYWx1ZSwgYWxsb3dVbnNldCk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGFwcGx5VmFsdWVBY3Rpb24oKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWFsbG93VW5zZXQgJiYgbmV3VmFsdWUgIT09IGtvLnNlbGVjdEV4dGVuc2lvbnMucmVhZFZhbHVlKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB5b3UgdHJ5IHRvIHNldCBhIG1vZGVsIHZhbHVlIHRoYXQgY2FuJ3QgYmUgcmVwcmVzZW50ZWQgaW4gYW4gYWxyZWFkeS1wb3B1bGF0ZWQgZHJvcGRvd24sIHJlamVjdCB0aGF0IGNoYW5nZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJlY2F1c2UgeW91J3JlIG5vdCBhbGxvd2VkIHRvIGhhdmUgYSBtb2RlbCB2YWx1ZSB0aGF0IGRpc2FncmVlcyB3aXRoIGEgdmlzaWJsZSBVSSBzZWxlY3Rpb24uXG4gICAgICAgICAgICAgICAgICAgICAgICBrby5kZXBlbmRlbmN5RGV0ZWN0aW9uLmlnbm9yZShrby51dGlscy50cmlnZ2VyRXZlbnQsIG51bGwsIFtlbGVtZW50LCBcImNoYW5nZVwiXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXb3JrYXJvdW5kIGZvciBJRTYgYnVnOiBJdCB3b24ndCByZWxpYWJseSBhcHBseSB2YWx1ZXMgdG8gU0VMRUNUIG5vZGVzIGR1cmluZyB0aGUgc2FtZSBleGVjdXRpb24gdGhyZWFkXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyByaWdodCBhZnRlciB5b3UndmUgY2hhbmdlZCB0aGUgc2V0IG9mIE9QVElPTiBub2RlcyBvbiBpdC4gU28gZm9yIHRoYXQgbm9kZSB0eXBlLCB3ZSdsbCBzY2hlZHVsZSBhIHNlY29uZCB0aHJlYWRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRvIGFwcGx5IHRoZSB2YWx1ZSBhcyB3ZWxsLlxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChhcHBseVZhbHVlQWN0aW9uLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGtvLnNlbGVjdEV4dGVuc2lvbnMud3JpdGVWYWx1ZShlbGVtZW50LCBuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGtvLmNvbXB1dGVkKHVwZGF0ZUZyb21Nb2RlbCwgbnVsbCwgeyBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IGVsZW1lbnQgfSk7XG4gICAgfSxcbiAgICAndXBkYXRlJzogZnVuY3Rpb24oKSB7fSAvLyBLZWVwIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSB3aXRoIGNvZGUgdGhhdCBtYXkgaGF2ZSB3cmFwcGVkIHZhbHVlIGJpbmRpbmdcbn07XG5rby5leHByZXNzaW9uUmV3cml0aW5nLnR3b1dheUJpbmRpbmdzWyd2YWx1ZSddID0gdHJ1ZTtcbmtvLmJpbmRpbmdIYW5kbGVyc1sndmlzaWJsZSddID0ge1xuICAgICd1cGRhdGUnOiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3Nvcikge1xuICAgICAgICB2YXIgdmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSk7XG4gICAgICAgIHZhciBpc0N1cnJlbnRseVZpc2libGUgPSAhKGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9PSBcIm5vbmVcIik7XG4gICAgICAgIGlmICh2YWx1ZSAmJiAhaXNDdXJyZW50bHlWaXNpYmxlKVxuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcbiAgICAgICAgZWxzZSBpZiAoKCF2YWx1ZSkgJiYgaXNDdXJyZW50bHlWaXNpYmxlKVxuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfVxufTtcbi8vICdjbGljaycgaXMganVzdCBhIHNob3J0aGFuZCBmb3IgdGhlIHVzdWFsIGZ1bGwtbGVuZ3RoIGV2ZW50OntjbGljazpoYW5kbGVyfVxubWFrZUV2ZW50SGFuZGxlclNob3J0Y3V0KCdjbGljaycpO1xuLy8gSWYgeW91IHdhbnQgdG8gbWFrZSBhIGN1c3RvbSB0ZW1wbGF0ZSBlbmdpbmUsXG4vL1xuLy8gWzFdIEluaGVyaXQgZnJvbSB0aGlzIGNsYXNzIChsaWtlIGtvLm5hdGl2ZVRlbXBsYXRlRW5naW5lIGRvZXMpXG4vLyBbMl0gT3ZlcnJpZGUgJ3JlbmRlclRlbXBsYXRlU291cmNlJywgc3VwcGx5aW5nIGEgZnVuY3Rpb24gd2l0aCB0aGlzIHNpZ25hdHVyZTpcbi8vXG4vLyAgICAgICAgZnVuY3Rpb24gKHRlbXBsYXRlU291cmNlLCBiaW5kaW5nQ29udGV4dCwgb3B0aW9ucykge1xuLy8gICAgICAgICAgICAvLyAtIHRlbXBsYXRlU291cmNlLnRleHQoKSBpcyB0aGUgdGV4dCBvZiB0aGUgdGVtcGxhdGUgeW91IHNob3VsZCByZW5kZXJcbi8vICAgICAgICAgICAgLy8gLSBiaW5kaW5nQ29udGV4dC4kZGF0YSBpcyB0aGUgZGF0YSB5b3Ugc2hvdWxkIHBhc3MgaW50byB0aGUgdGVtcGxhdGVcbi8vICAgICAgICAgICAgLy8gICAtIHlvdSBtaWdodCBhbHNvIHdhbnQgdG8gbWFrZSBiaW5kaW5nQ29udGV4dC4kcGFyZW50LCBiaW5kaW5nQ29udGV4dC4kcGFyZW50cyxcbi8vICAgICAgICAgICAgLy8gICAgIGFuZCBiaW5kaW5nQ29udGV4dC4kcm9vdCBhdmFpbGFibGUgaW4gdGhlIHRlbXBsYXRlIHRvb1xuLy8gICAgICAgICAgICAvLyAtIG9wdGlvbnMgZ2l2ZXMgeW91IGFjY2VzcyB0byBhbnkgb3RoZXIgcHJvcGVydGllcyBzZXQgb24gXCJkYXRhLWJpbmQ6IHsgdGVtcGxhdGU6IG9wdGlvbnMgfVwiXG4vLyAgICAgICAgICAgIC8vXG4vLyAgICAgICAgICAgIC8vIFJldHVybiB2YWx1ZTogYW4gYXJyYXkgb2YgRE9NIG5vZGVzXG4vLyAgICAgICAgfVxuLy9cbi8vIFszXSBPdmVycmlkZSAnY3JlYXRlSmF2YVNjcmlwdEV2YWx1YXRvckJsb2NrJywgc3VwcGx5aW5nIGEgZnVuY3Rpb24gd2l0aCB0aGlzIHNpZ25hdHVyZTpcbi8vXG4vLyAgICAgICAgZnVuY3Rpb24gKHNjcmlwdCkge1xuLy8gICAgICAgICAgICAvLyBSZXR1cm4gdmFsdWU6IFdoYXRldmVyIHN5bnRheCBtZWFucyBcIkV2YWx1YXRlIHRoZSBKYXZhU2NyaXB0IHN0YXRlbWVudCAnc2NyaXB0JyBhbmQgb3V0cHV0IHRoZSByZXN1bHRcIlxuLy8gICAgICAgICAgICAvLyAgICAgICAgICAgICAgIEZvciBleGFtcGxlLCB0aGUganF1ZXJ5LnRtcGwgdGVtcGxhdGUgZW5naW5lIGNvbnZlcnRzICdzb21lU2NyaXB0JyB0byAnJHsgc29tZVNjcmlwdCB9J1xuLy8gICAgICAgIH1cbi8vXG4vLyAgICAgVGhpcyBpcyBvbmx5IG5lY2Vzc2FyeSBpZiB5b3Ugd2FudCB0byBhbGxvdyBkYXRhLWJpbmQgYXR0cmlidXRlcyB0byByZWZlcmVuY2UgYXJiaXRyYXJ5IHRlbXBsYXRlIHZhcmlhYmxlcy5cbi8vICAgICBJZiB5b3UgZG9uJ3Qgd2FudCB0byBhbGxvdyB0aGF0LCB5b3UgY2FuIHNldCB0aGUgcHJvcGVydHkgJ2FsbG93VGVtcGxhdGVSZXdyaXRpbmcnIHRvIGZhbHNlIChsaWtlIGtvLm5hdGl2ZVRlbXBsYXRlRW5naW5lIGRvZXMpXG4vLyAgICAgYW5kIHRoZW4geW91IGRvbid0IG5lZWQgdG8gb3ZlcnJpZGUgJ2NyZWF0ZUphdmFTY3JpcHRFdmFsdWF0b3JCbG9jaycuXG5cbmtvLnRlbXBsYXRlRW5naW5lID0gZnVuY3Rpb24gKCkgeyB9O1xuXG5rby50ZW1wbGF0ZUVuZ2luZS5wcm90b3R5cGVbJ3JlbmRlclRlbXBsYXRlU291cmNlJ10gPSBmdW5jdGlvbiAodGVtcGxhdGVTb3VyY2UsIGJpbmRpbmdDb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiT3ZlcnJpZGUgcmVuZGVyVGVtcGxhdGVTb3VyY2VcIik7XG59O1xuXG5rby50ZW1wbGF0ZUVuZ2luZS5wcm90b3R5cGVbJ2NyZWF0ZUphdmFTY3JpcHRFdmFsdWF0b3JCbG9jayddID0gZnVuY3Rpb24gKHNjcmlwdCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk92ZXJyaWRlIGNyZWF0ZUphdmFTY3JpcHRFdmFsdWF0b3JCbG9ja1wiKTtcbn07XG5cbmtvLnRlbXBsYXRlRW5naW5lLnByb3RvdHlwZVsnbWFrZVRlbXBsYXRlU291cmNlJ10gPSBmdW5jdGlvbih0ZW1wbGF0ZSwgdGVtcGxhdGVEb2N1bWVudCkge1xuICAgIC8vIE5hbWVkIHRlbXBsYXRlXG4gICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHRlbXBsYXRlRG9jdW1lbnQgPSB0ZW1wbGF0ZURvY3VtZW50IHx8IGRvY3VtZW50O1xuICAgICAgICB2YXIgZWxlbSA9IHRlbXBsYXRlRG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGVtcGxhdGUpO1xuICAgICAgICBpZiAoIWVsZW0pXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCB0ZW1wbGF0ZSB3aXRoIElEIFwiICsgdGVtcGxhdGUpO1xuICAgICAgICByZXR1cm4gbmV3IGtvLnRlbXBsYXRlU291cmNlcy5kb21FbGVtZW50KGVsZW0pO1xuICAgIH0gZWxzZSBpZiAoKHRlbXBsYXRlLm5vZGVUeXBlID09IDEpIHx8ICh0ZW1wbGF0ZS5ub2RlVHlwZSA9PSA4KSkge1xuICAgICAgICAvLyBBbm9ueW1vdXMgdGVtcGxhdGVcbiAgICAgICAgcmV0dXJuIG5ldyBrby50ZW1wbGF0ZVNvdXJjZXMuYW5vbnltb3VzVGVtcGxhdGUodGVtcGxhdGUpO1xuICAgIH0gZWxzZVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIHRlbXBsYXRlIHR5cGU6IFwiICsgdGVtcGxhdGUpO1xufTtcblxua28udGVtcGxhdGVFbmdpbmUucHJvdG90eXBlWydyZW5kZXJUZW1wbGF0ZSddID0gZnVuY3Rpb24gKHRlbXBsYXRlLCBiaW5kaW5nQ29udGV4dCwgb3B0aW9ucywgdGVtcGxhdGVEb2N1bWVudCkge1xuICAgIHZhciB0ZW1wbGF0ZVNvdXJjZSA9IHRoaXNbJ21ha2VUZW1wbGF0ZVNvdXJjZSddKHRlbXBsYXRlLCB0ZW1wbGF0ZURvY3VtZW50KTtcbiAgICByZXR1cm4gdGhpc1sncmVuZGVyVGVtcGxhdGVTb3VyY2UnXSh0ZW1wbGF0ZVNvdXJjZSwgYmluZGluZ0NvbnRleHQsIG9wdGlvbnMpO1xufTtcblxua28udGVtcGxhdGVFbmdpbmUucHJvdG90eXBlWydpc1RlbXBsYXRlUmV3cml0dGVuJ10gPSBmdW5jdGlvbiAodGVtcGxhdGUsIHRlbXBsYXRlRG9jdW1lbnQpIHtcbiAgICAvLyBTa2lwIHJld3JpdGluZyBpZiByZXF1ZXN0ZWRcbiAgICBpZiAodGhpc1snYWxsb3dUZW1wbGF0ZVJld3JpdGluZyddID09PSBmYWxzZSlcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIHRoaXNbJ21ha2VUZW1wbGF0ZVNvdXJjZSddKHRlbXBsYXRlLCB0ZW1wbGF0ZURvY3VtZW50KVsnZGF0YSddKFwiaXNSZXdyaXR0ZW5cIik7XG59O1xuXG5rby50ZW1wbGF0ZUVuZ2luZS5wcm90b3R5cGVbJ3Jld3JpdGVUZW1wbGF0ZSddID0gZnVuY3Rpb24gKHRlbXBsYXRlLCByZXdyaXRlckNhbGxiYWNrLCB0ZW1wbGF0ZURvY3VtZW50KSB7XG4gICAgdmFyIHRlbXBsYXRlU291cmNlID0gdGhpc1snbWFrZVRlbXBsYXRlU291cmNlJ10odGVtcGxhdGUsIHRlbXBsYXRlRG9jdW1lbnQpO1xuICAgIHZhciByZXdyaXR0ZW4gPSByZXdyaXRlckNhbGxiYWNrKHRlbXBsYXRlU291cmNlWyd0ZXh0J10oKSk7XG4gICAgdGVtcGxhdGVTb3VyY2VbJ3RleHQnXShyZXdyaXR0ZW4pO1xuICAgIHRlbXBsYXRlU291cmNlWydkYXRhJ10oXCJpc1Jld3JpdHRlblwiLCB0cnVlKTtcbn07XG5cbmtvLmV4cG9ydFN5bWJvbCgndGVtcGxhdGVFbmdpbmUnLCBrby50ZW1wbGF0ZUVuZ2luZSk7XG5cbmtvLnRlbXBsYXRlUmV3cml0aW5nID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWVtb2l6ZURhdGFCaW5kaW5nQXR0cmlidXRlU3ludGF4UmVnZXggPSAvKDwoW2Etel0rXFxkKikoPzpcXHMrKD8hZGF0YS1iaW5kXFxzKj1cXHMqKVthLXowLTlcXC1dKyg/Oj0oPzpcXFwiW15cXFwiXSpcXFwifFxcJ1teXFwnXSpcXCcpKT8pKlxccyspZGF0YS1iaW5kXFxzKj1cXHMqKFtcIiddKShbXFxzXFxTXSo/KVxcMy9naTtcbiAgICB2YXIgbWVtb2l6ZVZpcnR1YWxDb250YWluZXJCaW5kaW5nU3ludGF4UmVnZXggPSAvPCEtLVxccyprb1xcYlxccyooW1xcc1xcU10qPylcXHMqLS0+L2c7XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZURhdGFCaW5kVmFsdWVzRm9yUmV3cml0aW5nKGtleVZhbHVlQXJyYXkpIHtcbiAgICAgICAgdmFyIGFsbFZhbGlkYXRvcnMgPSBrby5leHByZXNzaW9uUmV3cml0aW5nLmJpbmRpbmdSZXdyaXRlVmFsaWRhdG9ycztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlWYWx1ZUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIga2V5ID0ga2V5VmFsdWVBcnJheVtpXVsna2V5J107XG4gICAgICAgICAgICBpZiAoYWxsVmFsaWRhdG9ycy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhbGlkYXRvciA9IGFsbFZhbGlkYXRvcnNba2V5XTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsaWRhdG9yID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBvc3NpYmxlRXJyb3JNZXNzYWdlID0gdmFsaWRhdG9yKGtleVZhbHVlQXJyYXlbaV1bJ3ZhbHVlJ10pO1xuICAgICAgICAgICAgICAgICAgICBpZiAocG9zc2libGVFcnJvck1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IocG9zc2libGVFcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXZhbGlkYXRvcikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIHRlbXBsYXRlIGVuZ2luZSBkb2VzIG5vdCBzdXBwb3J0IHRoZSAnXCIgKyBrZXkgKyBcIicgYmluZGluZyB3aXRoaW4gaXRzIHRlbXBsYXRlc1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb25zdHJ1Y3RNZW1vaXplZFRhZ1JlcGxhY2VtZW50KGRhdGFCaW5kQXR0cmlidXRlVmFsdWUsIHRhZ1RvUmV0YWluLCBub2RlTmFtZSwgdGVtcGxhdGVFbmdpbmUpIHtcbiAgICAgICAgdmFyIGRhdGFCaW5kS2V5VmFsdWVBcnJheSA9IGtvLmV4cHJlc3Npb25SZXdyaXRpbmcucGFyc2VPYmplY3RMaXRlcmFsKGRhdGFCaW5kQXR0cmlidXRlVmFsdWUpO1xuICAgICAgICB2YWxpZGF0ZURhdGFCaW5kVmFsdWVzRm9yUmV3cml0aW5nKGRhdGFCaW5kS2V5VmFsdWVBcnJheSk7XG4gICAgICAgIHZhciByZXdyaXR0ZW5EYXRhQmluZEF0dHJpYnV0ZVZhbHVlID0ga28uZXhwcmVzc2lvblJld3JpdGluZy5wcmVQcm9jZXNzQmluZGluZ3MoZGF0YUJpbmRLZXlWYWx1ZUFycmF5LCB7J3ZhbHVlQWNjZXNzb3JzJzp0cnVlfSk7XG5cbiAgICAgICAgLy8gRm9yIG5vIG9idmlvdXMgcmVhc29uLCBPcGVyYSBmYWlscyB0byBldmFsdWF0ZSByZXdyaXR0ZW5EYXRhQmluZEF0dHJpYnV0ZVZhbHVlIHVubGVzcyBpdCdzIHdyYXBwZWQgaW4gYW4gYWRkaXRpb25hbFxuICAgICAgICAvLyBhbm9ueW1vdXMgZnVuY3Rpb24sIGV2ZW4gdGhvdWdoIE9wZXJhJ3MgYnVpbHQtaW4gZGVidWdnZXIgY2FuIGV2YWx1YXRlIGl0IGFueXdheS4gTm8gb3RoZXIgYnJvd3NlciByZXF1aXJlcyB0aGlzXG4gICAgICAgIC8vIGV4dHJhIGluZGlyZWN0aW9uLlxuICAgICAgICB2YXIgYXBwbHlCaW5kaW5nc1RvTmV4dFNpYmxpbmdTY3JpcHQgPVxuICAgICAgICAgICAgXCJrby5fX3RyX2FtYnRucyhmdW5jdGlvbigkY29udGV4dCwkZWxlbWVudCl7cmV0dXJuKGZ1bmN0aW9uKCl7cmV0dXJueyBcIiArIHJld3JpdHRlbkRhdGFCaW5kQXR0cmlidXRlVmFsdWUgKyBcIiB9IH0pKCl9LCdcIiArIG5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgKyBcIicpXCI7XG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZUVuZ2luZVsnY3JlYXRlSmF2YVNjcmlwdEV2YWx1YXRvckJsb2NrJ10oYXBwbHlCaW5kaW5nc1RvTmV4dFNpYmxpbmdTY3JpcHQpICsgdGFnVG9SZXRhaW47XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZW5zdXJlVGVtcGxhdGVJc1Jld3JpdHRlbjogZnVuY3Rpb24gKHRlbXBsYXRlLCB0ZW1wbGF0ZUVuZ2luZSwgdGVtcGxhdGVEb2N1bWVudCkge1xuICAgICAgICAgICAgaWYgKCF0ZW1wbGF0ZUVuZ2luZVsnaXNUZW1wbGF0ZVJld3JpdHRlbiddKHRlbXBsYXRlLCB0ZW1wbGF0ZURvY3VtZW50KSlcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZUVuZ2luZVsncmV3cml0ZVRlbXBsYXRlJ10odGVtcGxhdGUsIGZ1bmN0aW9uIChodG1sU3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrby50ZW1wbGF0ZVJld3JpdGluZy5tZW1vaXplQmluZGluZ0F0dHJpYnV0ZVN5bnRheChodG1sU3RyaW5nLCB0ZW1wbGF0ZUVuZ2luZSk7XG4gICAgICAgICAgICAgICAgfSwgdGVtcGxhdGVEb2N1bWVudCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbWVtb2l6ZUJpbmRpbmdBdHRyaWJ1dGVTeW50YXg6IGZ1bmN0aW9uIChodG1sU3RyaW5nLCB0ZW1wbGF0ZUVuZ2luZSkge1xuICAgICAgICAgICAgcmV0dXJuIGh0bWxTdHJpbmcucmVwbGFjZShtZW1vaXplRGF0YUJpbmRpbmdBdHRyaWJ1dGVTeW50YXhSZWdleCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb25zdHJ1Y3RNZW1vaXplZFRhZ1JlcGxhY2VtZW50KC8qIGRhdGFCaW5kQXR0cmlidXRlVmFsdWU6ICovIGFyZ3VtZW50c1s0XSwgLyogdGFnVG9SZXRhaW46ICovIGFyZ3VtZW50c1sxXSwgLyogbm9kZU5hbWU6ICovIGFyZ3VtZW50c1syXSwgdGVtcGxhdGVFbmdpbmUpO1xuICAgICAgICAgICAgfSkucmVwbGFjZShtZW1vaXplVmlydHVhbENvbnRhaW5lckJpbmRpbmdTeW50YXhSZWdleCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnN0cnVjdE1lbW9pemVkVGFnUmVwbGFjZW1lbnQoLyogZGF0YUJpbmRBdHRyaWJ1dGVWYWx1ZTogKi8gYXJndW1lbnRzWzFdLCAvKiB0YWdUb1JldGFpbjogKi8gXCI8IS0tIGtvIC0tPlwiLCAvKiBub2RlTmFtZTogKi8gXCIjY29tbWVudFwiLCB0ZW1wbGF0ZUVuZ2luZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBhcHBseU1lbW9pemVkQmluZGluZ3NUb05leHRTaWJsaW5nOiBmdW5jdGlvbiAoYmluZGluZ3MsIG5vZGVOYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4ga28ubWVtb2l6YXRpb24ubWVtb2l6ZShmdW5jdGlvbiAoZG9tTm9kZSwgYmluZGluZ0NvbnRleHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgbm9kZVRvQmluZCA9IGRvbU5vZGUubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGVUb0JpbmQgJiYgbm9kZVRvQmluZC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBub2RlTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBrby5hcHBseUJpbmRpbmdBY2Nlc3NvcnNUb05vZGUobm9kZVRvQmluZCwgYmluZGluZ3MsIGJpbmRpbmdDb250ZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn0pKCk7XG5cblxuLy8gRXhwb3J0ZWQgb25seSBiZWNhdXNlIGl0IGhhcyB0byBiZSByZWZlcmVuY2VkIGJ5IHN0cmluZyBsb29rdXAgZnJvbSB3aXRoaW4gcmV3cml0dGVuIHRlbXBsYXRlXG5rby5leHBvcnRTeW1ib2woJ19fdHJfYW1idG5zJywga28udGVtcGxhdGVSZXdyaXRpbmcuYXBwbHlNZW1vaXplZEJpbmRpbmdzVG9OZXh0U2libGluZyk7XG4oZnVuY3Rpb24oKSB7XG4gICAgLy8gQSB0ZW1wbGF0ZSBzb3VyY2UgcmVwcmVzZW50cyBhIHJlYWQvd3JpdGUgd2F5IG9mIGFjY2Vzc2luZyBhIHRlbXBsYXRlLiBUaGlzIGlzIHRvIGVsaW1pbmF0ZSB0aGUgbmVlZCBmb3IgdGVtcGxhdGUgbG9hZGluZy9zYXZpbmdcbiAgICAvLyBsb2dpYyB0byBiZSBkdXBsaWNhdGVkIGluIGV2ZXJ5IHRlbXBsYXRlIGVuZ2luZSAoYW5kIG1lYW5zIHRoZXkgY2FuIGFsbCB3b3JrIHdpdGggYW5vbnltb3VzIHRlbXBsYXRlcywgZXRjLilcbiAgICAvL1xuICAgIC8vIFR3byBhcmUgcHJvdmlkZWQgYnkgZGVmYXVsdDpcbiAgICAvLyAgMS4ga28udGVtcGxhdGVTb3VyY2VzLmRvbUVsZW1lbnQgICAgICAgLSByZWFkcy93cml0ZXMgdGhlIHRleHQgY29udGVudCBvZiBhbiBhcmJpdHJhcnkgRE9NIGVsZW1lbnRcbiAgICAvLyAgMi4ga28udGVtcGxhdGVTb3VyY2VzLmFub255bW91c0VsZW1lbnQgLSB1c2VzIGtvLnV0aWxzLmRvbURhdGEgdG8gcmVhZC93cml0ZSB0ZXh0ICphc3NvY2lhdGVkKiB3aXRoIHRoZSBET00gZWxlbWVudCwgYnV0XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2l0aG91dCByZWFkaW5nL3dyaXRpbmcgdGhlIGFjdHVhbCBlbGVtZW50IHRleHQgY29udGVudCwgc2luY2UgaXQgd2lsbCBiZSBvdmVyd3JpdHRlblxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpdGggdGhlIHJlbmRlcmVkIHRlbXBsYXRlIG91dHB1dC5cbiAgICAvLyBZb3UgY2FuIGltcGxlbWVudCB5b3VyIG93biB0ZW1wbGF0ZSBzb3VyY2UgaWYgeW91IHdhbnQgdG8gZmV0Y2gvc3RvcmUgdGVtcGxhdGVzIHNvbWV3aGVyZSBvdGhlciB0aGFuIGluIERPTSBlbGVtZW50cy5cbiAgICAvLyBUZW1wbGF0ZSBzb3VyY2VzIG5lZWQgdG8gaGF2ZSB0aGUgZm9sbG93aW5nIGZ1bmN0aW9uczpcbiAgICAvLyAgIHRleHQoKSBcdFx0XHQtIHJldHVybnMgdGhlIHRlbXBsYXRlIHRleHQgZnJvbSB5b3VyIHN0b3JhZ2UgbG9jYXRpb25cbiAgICAvLyAgIHRleHQodmFsdWUpXHRcdC0gd3JpdGVzIHRoZSBzdXBwbGllZCB0ZW1wbGF0ZSB0ZXh0IHRvIHlvdXIgc3RvcmFnZSBsb2NhdGlvblxuICAgIC8vICAgZGF0YShrZXkpXHRcdFx0LSByZWFkcyB2YWx1ZXMgc3RvcmVkIHVzaW5nIGRhdGEoa2V5LCB2YWx1ZSkgLSBzZWUgYmVsb3dcbiAgICAvLyAgIGRhdGEoa2V5LCB2YWx1ZSlcdC0gYXNzb2NpYXRlcyBcInZhbHVlXCIgd2l0aCB0aGlzIHRlbXBsYXRlIGFuZCB0aGUga2V5IFwia2V5XCIuIElzIHVzZWQgdG8gc3RvcmUgaW5mb3JtYXRpb24gbGlrZSBcImlzUmV3cml0dGVuXCIuXG4gICAgLy9cbiAgICAvLyBPcHRpb25hbGx5LCB0ZW1wbGF0ZSBzb3VyY2VzIGNhbiBhbHNvIGhhdmUgdGhlIGZvbGxvd2luZyBmdW5jdGlvbnM6XG4gICAgLy8gICBub2RlcygpICAgICAgICAgICAgLSByZXR1cm5zIGEgRE9NIGVsZW1lbnQgY29udGFpbmluZyB0aGUgbm9kZXMgb2YgdGhpcyB0ZW1wbGF0ZSwgd2hlcmUgYXZhaWxhYmxlXG4gICAgLy8gICBub2Rlcyh2YWx1ZSkgICAgICAgLSB3cml0ZXMgdGhlIGdpdmVuIERPTSBlbGVtZW50IHRvIHlvdXIgc3RvcmFnZSBsb2NhdGlvblxuICAgIC8vIElmIGEgRE9NIGVsZW1lbnQgaXMgYXZhaWxhYmxlIGZvciBhIGdpdmVuIHRlbXBsYXRlIHNvdXJjZSwgdGVtcGxhdGUgZW5naW5lcyBhcmUgZW5jb3VyYWdlZCB0byB1c2UgaXQgaW4gcHJlZmVyZW5jZSBvdmVyIHRleHQoKVxuICAgIC8vIGZvciBpbXByb3ZlZCBzcGVlZC4gSG93ZXZlciwgYWxsIHRlbXBsYXRlU291cmNlcyBtdXN0IHN1cHBseSB0ZXh0KCkgZXZlbiBpZiB0aGV5IGRvbid0IHN1cHBseSBub2RlcygpLlxuICAgIC8vXG4gICAgLy8gT25jZSB5b3UndmUgaW1wbGVtZW50ZWQgYSB0ZW1wbGF0ZVNvdXJjZSwgbWFrZSB5b3VyIHRlbXBsYXRlIGVuZ2luZSB1c2UgaXQgYnkgc3ViY2xhc3Npbmcgd2hhdGV2ZXIgdGVtcGxhdGUgZW5naW5lIHlvdSB3ZXJlXG4gICAgLy8gdXNpbmcgYW5kIG92ZXJyaWRpbmcgXCJtYWtlVGVtcGxhdGVTb3VyY2VcIiB0byByZXR1cm4gYW4gaW5zdGFuY2Ugb2YgeW91ciBjdXN0b20gdGVtcGxhdGUgc291cmNlLlxuXG4gICAga28udGVtcGxhdGVTb3VyY2VzID0ge307XG5cbiAgICAvLyAtLS0tIGtvLnRlbXBsYXRlU291cmNlcy5kb21FbGVtZW50IC0tLS0tXG5cbiAgICBrby50ZW1wbGF0ZVNvdXJjZXMuZG9tRWxlbWVudCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5kb21FbGVtZW50ID0gZWxlbWVudDtcbiAgICB9XG5cbiAgICBrby50ZW1wbGF0ZVNvdXJjZXMuZG9tRWxlbWVudC5wcm90b3R5cGVbJ3RleHQnXSA9IGZ1bmN0aW9uKC8qIHZhbHVlVG9Xcml0ZSAqLykge1xuICAgICAgICB2YXIgdGFnTmFtZUxvd2VyID0ga28udXRpbHMudGFnTmFtZUxvd2VyKHRoaXMuZG9tRWxlbWVudCksXG4gICAgICAgICAgICBlbGVtQ29udGVudHNQcm9wZXJ0eSA9IHRhZ05hbWVMb3dlciA9PT0gXCJzY3JpcHRcIiA/IFwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHRhZ05hbWVMb3dlciA9PT0gXCJ0ZXh0YXJlYVwiID8gXCJ2YWx1ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiaW5uZXJIVE1MXCI7XG5cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZG9tRWxlbWVudFtlbGVtQ29udGVudHNQcm9wZXJ0eV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgdmFsdWVUb1dyaXRlID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgaWYgKGVsZW1Db250ZW50c1Byb3BlcnR5ID09PSBcImlubmVySFRNTFwiKVxuICAgICAgICAgICAgICAgIGtvLnV0aWxzLnNldEh0bWwodGhpcy5kb21FbGVtZW50LCB2YWx1ZVRvV3JpdGUpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRoaXMuZG9tRWxlbWVudFtlbGVtQ29udGVudHNQcm9wZXJ0eV0gPSB2YWx1ZVRvV3JpdGU7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGRhdGFEb21EYXRhUHJlZml4ID0ga28udXRpbHMuZG9tRGF0YS5uZXh0S2V5KCkgKyBcIl9cIjtcbiAgICBrby50ZW1wbGF0ZVNvdXJjZXMuZG9tRWxlbWVudC5wcm90b3R5cGVbJ2RhdGEnXSA9IGZ1bmN0aW9uKGtleSAvKiwgdmFsdWVUb1dyaXRlICovKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4ga28udXRpbHMuZG9tRGF0YS5nZXQodGhpcy5kb21FbGVtZW50LCBkYXRhRG9tRGF0YVByZWZpeCArIGtleSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBrby51dGlscy5kb21EYXRhLnNldCh0aGlzLmRvbUVsZW1lbnQsIGRhdGFEb21EYXRhUHJlZml4ICsga2V5LCBhcmd1bWVudHNbMV0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIC0tLS0ga28udGVtcGxhdGVTb3VyY2VzLmFub255bW91c1RlbXBsYXRlIC0tLS0tXG4gICAgLy8gQW5vbnltb3VzIHRlbXBsYXRlcyBhcmUgbm9ybWFsbHkgc2F2ZWQvcmV0cmlldmVkIGFzIERPTSBub2RlcyB0aHJvdWdoIFwibm9kZXNcIi5cbiAgICAvLyBGb3IgY29tcGF0aWJpbGl0eSwgeW91IGNhbiBhbHNvIHJlYWQgXCJ0ZXh0XCI7IGl0IHdpbGwgYmUgc2VyaWFsaXplZCBmcm9tIHRoZSBub2RlcyBvbiBkZW1hbmQuXG4gICAgLy8gV3JpdGluZyB0byBcInRleHRcIiBpcyBzdGlsbCBzdXBwb3J0ZWQsIGJ1dCB0aGVuIHRoZSB0ZW1wbGF0ZSBkYXRhIHdpbGwgbm90IGJlIGF2YWlsYWJsZSBhcyBET00gbm9kZXMuXG5cbiAgICB2YXIgYW5vbnltb3VzVGVtcGxhdGVzRG9tRGF0YUtleSA9IGtvLnV0aWxzLmRvbURhdGEubmV4dEtleSgpO1xuICAgIGtvLnRlbXBsYXRlU291cmNlcy5hbm9ueW1vdXNUZW1wbGF0ZSA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5kb21FbGVtZW50ID0gZWxlbWVudDtcbiAgICB9XG4gICAga28udGVtcGxhdGVTb3VyY2VzLmFub255bW91c1RlbXBsYXRlLnByb3RvdHlwZSA9IG5ldyBrby50ZW1wbGF0ZVNvdXJjZXMuZG9tRWxlbWVudCgpO1xuICAgIGtvLnRlbXBsYXRlU291cmNlcy5hbm9ueW1vdXNUZW1wbGF0ZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBrby50ZW1wbGF0ZVNvdXJjZXMuYW5vbnltb3VzVGVtcGxhdGU7XG4gICAga28udGVtcGxhdGVTb3VyY2VzLmFub255bW91c1RlbXBsYXRlLnByb3RvdHlwZVsndGV4dCddID0gZnVuY3Rpb24oLyogdmFsdWVUb1dyaXRlICovKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZURhdGEgPSBrby51dGlscy5kb21EYXRhLmdldCh0aGlzLmRvbUVsZW1lbnQsIGFub255bW91c1RlbXBsYXRlc0RvbURhdGFLZXkpIHx8IHt9O1xuICAgICAgICAgICAgaWYgKHRlbXBsYXRlRGF0YS50ZXh0RGF0YSA9PT0gdW5kZWZpbmVkICYmIHRlbXBsYXRlRGF0YS5jb250YWluZXJEYXRhKVxuICAgICAgICAgICAgICAgIHRlbXBsYXRlRGF0YS50ZXh0RGF0YSA9IHRlbXBsYXRlRGF0YS5jb250YWluZXJEYXRhLmlubmVySFRNTDtcbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZURhdGEudGV4dERhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgdmFsdWVUb1dyaXRlID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAga28udXRpbHMuZG9tRGF0YS5zZXQodGhpcy5kb21FbGVtZW50LCBhbm9ueW1vdXNUZW1wbGF0ZXNEb21EYXRhS2V5LCB7dGV4dERhdGE6IHZhbHVlVG9Xcml0ZX0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBrby50ZW1wbGF0ZVNvdXJjZXMuZG9tRWxlbWVudC5wcm90b3R5cGVbJ25vZGVzJ10gPSBmdW5jdGlvbigvKiB2YWx1ZVRvV3JpdGUgKi8pIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgdmFyIHRlbXBsYXRlRGF0YSA9IGtvLnV0aWxzLmRvbURhdGEuZ2V0KHRoaXMuZG9tRWxlbWVudCwgYW5vbnltb3VzVGVtcGxhdGVzRG9tRGF0YUtleSkgfHwge307XG4gICAgICAgICAgICByZXR1cm4gdGVtcGxhdGVEYXRhLmNvbnRhaW5lckRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgdmFsdWVUb1dyaXRlID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAga28udXRpbHMuZG9tRGF0YS5zZXQodGhpcy5kb21FbGVtZW50LCBhbm9ueW1vdXNUZW1wbGF0ZXNEb21EYXRhS2V5LCB7Y29udGFpbmVyRGF0YTogdmFsdWVUb1dyaXRlfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAga28uZXhwb3J0U3ltYm9sKCd0ZW1wbGF0ZVNvdXJjZXMnLCBrby50ZW1wbGF0ZVNvdXJjZXMpO1xuICAgIGtvLmV4cG9ydFN5bWJvbCgndGVtcGxhdGVTb3VyY2VzLmRvbUVsZW1lbnQnLCBrby50ZW1wbGF0ZVNvdXJjZXMuZG9tRWxlbWVudCk7XG4gICAga28uZXhwb3J0U3ltYm9sKCd0ZW1wbGF0ZVNvdXJjZXMuYW5vbnltb3VzVGVtcGxhdGUnLCBrby50ZW1wbGF0ZVNvdXJjZXMuYW5vbnltb3VzVGVtcGxhdGUpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF90ZW1wbGF0ZUVuZ2luZTtcbiAgICBrby5zZXRUZW1wbGF0ZUVuZ2luZSA9IGZ1bmN0aW9uICh0ZW1wbGF0ZUVuZ2luZSkge1xuICAgICAgICBpZiAoKHRlbXBsYXRlRW5naW5lICE9IHVuZGVmaW5lZCkgJiYgISh0ZW1wbGF0ZUVuZ2luZSBpbnN0YW5jZW9mIGtvLnRlbXBsYXRlRW5naW5lKSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRlbXBsYXRlRW5naW5lIG11c3QgaW5oZXJpdCBmcm9tIGtvLnRlbXBsYXRlRW5naW5lXCIpO1xuICAgICAgICBfdGVtcGxhdGVFbmdpbmUgPSB0ZW1wbGF0ZUVuZ2luZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnZva2VGb3JFYWNoTm9kZUluQ29udGludW91c1JhbmdlKGZpcnN0Tm9kZSwgbGFzdE5vZGUsIGFjdGlvbikge1xuICAgICAgICB2YXIgbm9kZSwgbmV4dEluUXVldWUgPSBmaXJzdE5vZGUsIGZpcnN0T3V0T2ZSYW5nZU5vZGUgPSBrby52aXJ0dWFsRWxlbWVudHMubmV4dFNpYmxpbmcobGFzdE5vZGUpO1xuICAgICAgICB3aGlsZSAobmV4dEluUXVldWUgJiYgKChub2RlID0gbmV4dEluUXVldWUpICE9PSBmaXJzdE91dE9mUmFuZ2VOb2RlKSkge1xuICAgICAgICAgICAgbmV4dEluUXVldWUgPSBrby52aXJ0dWFsRWxlbWVudHMubmV4dFNpYmxpbmcobm9kZSk7XG4gICAgICAgICAgICBhY3Rpb24obm9kZSwgbmV4dEluUXVldWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWN0aXZhdGVCaW5kaW5nc09uQ29udGludW91c05vZGVBcnJheShjb250aW51b3VzTm9kZUFycmF5LCBiaW5kaW5nQ29udGV4dCkge1xuICAgICAgICAvLyBUbyBiZSB1c2VkIG9uIGFueSBub2RlcyB0aGF0IGhhdmUgYmVlbiByZW5kZXJlZCBieSBhIHRlbXBsYXRlIGFuZCBoYXZlIGJlZW4gaW5zZXJ0ZWQgaW50byBzb21lIHBhcmVudCBlbGVtZW50XG4gICAgICAgIC8vIFdhbGtzIHRocm91Z2ggY29udGludW91c05vZGVBcnJheSAod2hpY2ggKm11c3QqIGJlIGNvbnRpbnVvdXMsIGkuZS4sIGFuIHVuaW50ZXJydXB0ZWQgc2VxdWVuY2Ugb2Ygc2libGluZyBub2RlcywgYmVjYXVzZVxuICAgICAgICAvLyB0aGUgYWxnb3JpdGhtIGZvciB3YWxraW5nIHRoZW0gcmVsaWVzIG9uIHRoaXMpLCBhbmQgZm9yIGVhY2ggdG9wLWxldmVsIGl0ZW0gaW4gdGhlIHZpcnR1YWwtZWxlbWVudCBzZW5zZSxcbiAgICAgICAgLy8gKDEpIERvZXMgYSByZWd1bGFyIFwiYXBwbHlCaW5kaW5nc1wiIHRvIGFzc29jaWF0ZSBiaW5kaW5nQ29udGV4dCB3aXRoIHRoaXMgbm9kZSBhbmQgdG8gYWN0aXZhdGUgYW55IG5vbi1tZW1vaXplZCBiaW5kaW5nc1xuICAgICAgICAvLyAoMikgVW5tZW1vaXplcyBhbnkgbWVtb3MgaW4gdGhlIERPTSBzdWJ0cmVlIChlLmcuLCB0byBhY3RpdmF0ZSBiaW5kaW5ncyB0aGF0IGhhZCBiZWVuIG1lbW9pemVkIGR1cmluZyB0ZW1wbGF0ZSByZXdyaXRpbmcpXG5cbiAgICAgICAgaWYgKGNvbnRpbnVvdXNOb2RlQXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgZmlyc3ROb2RlID0gY29udGludW91c05vZGVBcnJheVswXSxcbiAgICAgICAgICAgICAgICBsYXN0Tm9kZSA9IGNvbnRpbnVvdXNOb2RlQXJyYXlbY29udGludW91c05vZGVBcnJheS5sZW5ndGggLSAxXSxcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlID0gZmlyc3ROb2RlLnBhcmVudE5vZGUsXG4gICAgICAgICAgICAgICAgcHJvdmlkZXIgPSBrby5iaW5kaW5nUHJvdmlkZXJbJ2luc3RhbmNlJ10sXG4gICAgICAgICAgICAgICAgcHJlcHJvY2Vzc05vZGUgPSBwcm92aWRlclsncHJlcHJvY2Vzc05vZGUnXTtcblxuICAgICAgICAgICAgaWYgKHByZXByb2Nlc3NOb2RlKSB7XG4gICAgICAgICAgICAgICAgaW52b2tlRm9yRWFjaE5vZGVJbkNvbnRpbnVvdXNSYW5nZShmaXJzdE5vZGUsIGxhc3ROb2RlLCBmdW5jdGlvbihub2RlLCBuZXh0Tm9kZUluUmFuZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5vZGVQcmV2aW91c1NpYmxpbmcgPSBub2RlLnByZXZpb3VzU2libGluZztcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld05vZGVzID0gcHJlcHJvY2Vzc05vZGUuY2FsbChwcm92aWRlciwgbm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdOb2Rlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUgPT09IGZpcnN0Tm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdE5vZGUgPSBuZXdOb2Rlc1swXSB8fCBuZXh0Tm9kZUluUmFuZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZSA9PT0gbGFzdE5vZGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdE5vZGUgPSBuZXdOb2Rlc1tuZXdOb2Rlcy5sZW5ndGggLSAxXSB8fCBub2RlUHJldmlvdXNTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBCZWNhdXNlIHByZXByb2Nlc3NOb2RlIGNhbiBjaGFuZ2UgdGhlIG5vZGVzLCBpbmNsdWRpbmcgdGhlIGZpcnN0IGFuZCBsYXN0IG5vZGVzLCB1cGRhdGUgY29udGludW91c05vZGVBcnJheSB0byBtYXRjaC5cbiAgICAgICAgICAgICAgICAvLyBXZSBuZWVkIHRoZSBmdWxsIHNldCwgaW5jbHVkaW5nIGlubmVyIG5vZGVzLCBiZWNhdXNlIHRoZSB1bm1lbW9pemUgc3RlcCBtaWdodCByZW1vdmUgdGhlIGZpcnN0IG5vZGUgKGFuZCBzbyB0aGUgcmVhbFxuICAgICAgICAgICAgICAgIC8vIGZpcnN0IG5vZGUgbmVlZHMgdG8gYmUgaW4gdGhlIGFycmF5KS5cbiAgICAgICAgICAgICAgICBjb250aW51b3VzTm9kZUFycmF5Lmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKCFmaXJzdE5vZGUpIHsgLy8gcHJlcHJvY2Vzc05vZGUgbWlnaHQgaGF2ZSByZW1vdmVkIGFsbCB0aGUgbm9kZXMsIGluIHdoaWNoIGNhc2UgdGhlcmUncyBub3RoaW5nIGxlZnQgdG8gZG9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZmlyc3ROb2RlID09PSBsYXN0Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51b3VzTm9kZUFycmF5LnB1c2goZmlyc3ROb2RlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51b3VzTm9kZUFycmF5LnB1c2goZmlyc3ROb2RlLCBsYXN0Tm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIGtvLnV0aWxzLmZpeFVwQ29udGludW91c05vZGVBcnJheShjb250aW51b3VzTm9kZUFycmF5LCBwYXJlbnROb2RlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIE5lZWQgdG8gYXBwbHlCaW5kaW5ncyAqYmVmb3JlKiB1bm1lbW96aWF0aW9uLCBiZWNhdXNlIHVubWVtb2l6YXRpb24gbWlnaHQgaW50cm9kdWNlIGV4dHJhIG5vZGVzICh0aGF0IHdlIGRvbid0IHdhbnQgdG8gcmUtYmluZClcbiAgICAgICAgICAgIC8vIHdoZXJlYXMgYSByZWd1bGFyIGFwcGx5QmluZGluZ3Mgd29uJ3QgaW50cm9kdWNlIG5ldyBtZW1vaXplZCBub2Rlc1xuICAgICAgICAgICAgaW52b2tlRm9yRWFjaE5vZGVJbkNvbnRpbnVvdXNSYW5nZShmaXJzdE5vZGUsIGxhc3ROb2RlLCBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEgfHwgbm9kZS5ub2RlVHlwZSA9PT0gOClcbiAgICAgICAgICAgICAgICAgICAga28uYXBwbHlCaW5kaW5ncyhiaW5kaW5nQ29udGV4dCwgbm9kZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGludm9rZUZvckVhY2hOb2RlSW5Db250aW51b3VzUmFuZ2UoZmlyc3ROb2RlLCBsYXN0Tm9kZSwgZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxIHx8IG5vZGUubm9kZVR5cGUgPT09IDgpXG4gICAgICAgICAgICAgICAgICAgIGtvLm1lbW9pemF0aW9uLnVubWVtb2l6ZURvbU5vZGVBbmREZXNjZW5kYW50cyhub2RlLCBbYmluZGluZ0NvbnRleHRdKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgYW55IGNoYW5nZXMgZG9uZSBieSBhcHBseUJpbmRpbmdzIG9yIHVubWVtb2l6ZSBhcmUgcmVmbGVjdGVkIGluIHRoZSBhcnJheVxuICAgICAgICAgICAga28udXRpbHMuZml4VXBDb250aW51b3VzTm9kZUFycmF5KGNvbnRpbnVvdXNOb2RlQXJyYXksIHBhcmVudE5vZGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Rmlyc3ROb2RlRnJvbVBvc3NpYmxlQXJyYXkobm9kZU9yTm9kZUFycmF5KSB7XG4gICAgICAgIHJldHVybiBub2RlT3JOb2RlQXJyYXkubm9kZVR5cGUgPyBub2RlT3JOb2RlQXJyYXlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG5vZGVPck5vZGVBcnJheS5sZW5ndGggPiAwID8gbm9kZU9yTm9kZUFycmF5WzBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBudWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4ZWN1dGVUZW1wbGF0ZSh0YXJnZXROb2RlT3JOb2RlQXJyYXksIHJlbmRlck1vZGUsIHRlbXBsYXRlLCBiaW5kaW5nQ29udGV4dCwgb3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgICAgdmFyIGZpcnN0VGFyZ2V0Tm9kZSA9IHRhcmdldE5vZGVPck5vZGVBcnJheSAmJiBnZXRGaXJzdE5vZGVGcm9tUG9zc2libGVBcnJheSh0YXJnZXROb2RlT3JOb2RlQXJyYXkpO1xuICAgICAgICB2YXIgdGVtcGxhdGVEb2N1bWVudCA9IGZpcnN0VGFyZ2V0Tm9kZSAmJiBmaXJzdFRhcmdldE5vZGUub3duZXJEb2N1bWVudDtcbiAgICAgICAgdmFyIHRlbXBsYXRlRW5naW5lVG9Vc2UgPSAob3B0aW9uc1sndGVtcGxhdGVFbmdpbmUnXSB8fCBfdGVtcGxhdGVFbmdpbmUpO1xuICAgICAgICBrby50ZW1wbGF0ZVJld3JpdGluZy5lbnN1cmVUZW1wbGF0ZUlzUmV3cml0dGVuKHRlbXBsYXRlLCB0ZW1wbGF0ZUVuZ2luZVRvVXNlLCB0ZW1wbGF0ZURvY3VtZW50KTtcbiAgICAgICAgdmFyIHJlbmRlcmVkTm9kZXNBcnJheSA9IHRlbXBsYXRlRW5naW5lVG9Vc2VbJ3JlbmRlclRlbXBsYXRlJ10odGVtcGxhdGUsIGJpbmRpbmdDb250ZXh0LCBvcHRpb25zLCB0ZW1wbGF0ZURvY3VtZW50KTtcblxuICAgICAgICAvLyBMb29zZWx5IGNoZWNrIHJlc3VsdCBpcyBhbiBhcnJheSBvZiBET00gbm9kZXNcbiAgICAgICAgaWYgKCh0eXBlb2YgcmVuZGVyZWROb2Rlc0FycmF5Lmxlbmd0aCAhPSBcIm51bWJlclwiKSB8fCAocmVuZGVyZWROb2Rlc0FycmF5Lmxlbmd0aCA+IDAgJiYgdHlwZW9mIHJlbmRlcmVkTm9kZXNBcnJheVswXS5ub2RlVHlwZSAhPSBcIm51bWJlclwiKSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRlbXBsYXRlIGVuZ2luZSBtdXN0IHJldHVybiBhbiBhcnJheSBvZiBET00gbm9kZXNcIik7XG5cbiAgICAgICAgdmFyIGhhdmVBZGRlZE5vZGVzVG9QYXJlbnQgPSBmYWxzZTtcbiAgICAgICAgc3dpdGNoIChyZW5kZXJNb2RlKSB7XG4gICAgICAgICAgICBjYXNlIFwicmVwbGFjZUNoaWxkcmVuXCI6XG4gICAgICAgICAgICAgICAga28udmlydHVhbEVsZW1lbnRzLnNldERvbU5vZGVDaGlsZHJlbih0YXJnZXROb2RlT3JOb2RlQXJyYXksIHJlbmRlcmVkTm9kZXNBcnJheSk7XG4gICAgICAgICAgICAgICAgaGF2ZUFkZGVkTm9kZXNUb1BhcmVudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwicmVwbGFjZU5vZGVcIjpcbiAgICAgICAgICAgICAgICBrby51dGlscy5yZXBsYWNlRG9tTm9kZXModGFyZ2V0Tm9kZU9yTm9kZUFycmF5LCByZW5kZXJlZE5vZGVzQXJyYXkpO1xuICAgICAgICAgICAgICAgIGhhdmVBZGRlZE5vZGVzVG9QYXJlbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImlnbm9yZVRhcmdldE5vZGVcIjogYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gcmVuZGVyTW9kZTogXCIgKyByZW5kZXJNb2RlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXZlQWRkZWROb2Rlc1RvUGFyZW50KSB7XG4gICAgICAgICAgICBhY3RpdmF0ZUJpbmRpbmdzT25Db250aW51b3VzTm9kZUFycmF5KHJlbmRlcmVkTm9kZXNBcnJheSwgYmluZGluZ0NvbnRleHQpO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnNbJ2FmdGVyUmVuZGVyJ10pXG4gICAgICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5pZ25vcmUob3B0aW9uc1snYWZ0ZXJSZW5kZXInXSwgbnVsbCwgW3JlbmRlcmVkTm9kZXNBcnJheSwgYmluZGluZ0NvbnRleHRbJyRkYXRhJ11dKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZW5kZXJlZE5vZGVzQXJyYXk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzb2x2ZVRlbXBsYXRlTmFtZSh0ZW1wbGF0ZSwgZGF0YSwgY29udGV4dCkge1xuICAgICAgICAvLyBUaGUgdGVtcGxhdGUgY2FuIGJlIHNwZWNpZmllZCBhczpcbiAgICAgICAgaWYgKGtvLmlzT2JzZXJ2YWJsZSh0ZW1wbGF0ZSkpIHtcbiAgICAgICAgICAgIC8vIDEuIEFuIG9ic2VydmFibGUsIHdpdGggc3RyaW5nIHZhbHVlXG4gICAgICAgICAgICByZXR1cm4gdGVtcGxhdGUoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGVtcGxhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIC8vIDIuIEEgZnVuY3Rpb24gb2YgKGRhdGEsIGNvbnRleHQpIHJldHVybmluZyBhIHN0cmluZ1xuICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlKGRhdGEsIGNvbnRleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gMy4gQSBzdHJpbmdcbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGtvLnJlbmRlclRlbXBsYXRlID0gZnVuY3Rpb24gKHRlbXBsYXRlLCBkYXRhT3JCaW5kaW5nQ29udGV4dCwgb3B0aW9ucywgdGFyZ2V0Tm9kZU9yTm9kZUFycmF5LCByZW5kZXJNb2RlKSB7XG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgICBpZiAoKG9wdGlvbnNbJ3RlbXBsYXRlRW5naW5lJ10gfHwgX3RlbXBsYXRlRW5naW5lKSA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTZXQgYSB0ZW1wbGF0ZSBlbmdpbmUgYmVmb3JlIGNhbGxpbmcgcmVuZGVyVGVtcGxhdGVcIik7XG4gICAgICAgIHJlbmRlck1vZGUgPSByZW5kZXJNb2RlIHx8IFwicmVwbGFjZUNoaWxkcmVuXCI7XG5cbiAgICAgICAgaWYgKHRhcmdldE5vZGVPck5vZGVBcnJheSkge1xuICAgICAgICAgICAgdmFyIGZpcnN0VGFyZ2V0Tm9kZSA9IGdldEZpcnN0Tm9kZUZyb21Qb3NzaWJsZUFycmF5KHRhcmdldE5vZGVPck5vZGVBcnJheSk7XG5cbiAgICAgICAgICAgIHZhciB3aGVuVG9EaXNwb3NlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gKCFmaXJzdFRhcmdldE5vZGUpIHx8ICFrby51dGlscy5kb21Ob2RlSXNBdHRhY2hlZFRvRG9jdW1lbnQoZmlyc3RUYXJnZXROb2RlKTsgfTsgLy8gUGFzc2l2ZSBkaXNwb3NhbCAob24gbmV4dCBldmFsdWF0aW9uKVxuICAgICAgICAgICAgdmFyIGFjdGl2ZWx5RGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkID0gKGZpcnN0VGFyZ2V0Tm9kZSAmJiByZW5kZXJNb2RlID09IFwicmVwbGFjZU5vZGVcIikgPyBmaXJzdFRhcmdldE5vZGUucGFyZW50Tm9kZSA6IGZpcnN0VGFyZ2V0Tm9kZTtcblxuICAgICAgICAgICAgcmV0dXJuIGtvLmRlcGVuZGVudE9ic2VydmFibGUoIC8vIFNvIHRoZSBET00gaXMgYXV0b21hdGljYWxseSB1cGRhdGVkIHdoZW4gYW55IGRlcGVuZGVuY3kgY2hhbmdlc1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRW5zdXJlIHdlJ3ZlIGdvdCBhIHByb3BlciBiaW5kaW5nIGNvbnRleHQgdG8gd29yayB3aXRoXG4gICAgICAgICAgICAgICAgICAgIHZhciBiaW5kaW5nQ29udGV4dCA9IChkYXRhT3JCaW5kaW5nQ29udGV4dCAmJiAoZGF0YU9yQmluZGluZ0NvbnRleHQgaW5zdGFuY2VvZiBrby5iaW5kaW5nQ29udGV4dCkpXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGRhdGFPckJpbmRpbmdDb250ZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICA6IG5ldyBrby5iaW5kaW5nQ29udGV4dChrby51dGlscy51bndyYXBPYnNlcnZhYmxlKGRhdGFPckJpbmRpbmdDb250ZXh0KSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXBsYXRlTmFtZSA9IHJlc29sdmVUZW1wbGF0ZU5hbWUodGVtcGxhdGUsIGJpbmRpbmdDb250ZXh0WyckZGF0YSddLCBiaW5kaW5nQ29udGV4dCksXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJlZE5vZGVzQXJyYXkgPSBleGVjdXRlVGVtcGxhdGUodGFyZ2V0Tm9kZU9yTm9kZUFycmF5LCByZW5kZXJNb2RlLCB0ZW1wbGF0ZU5hbWUsIGJpbmRpbmdDb250ZXh0LCBvcHRpb25zKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocmVuZGVyTW9kZSA9PSBcInJlcGxhY2VOb2RlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldE5vZGVPck5vZGVBcnJheSA9IHJlbmRlcmVkTm9kZXNBcnJheTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0VGFyZ2V0Tm9kZSA9IGdldEZpcnN0Tm9kZUZyb21Qb3NzaWJsZUFycmF5KHRhcmdldE5vZGVPck5vZGVBcnJheSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgeyBkaXNwb3NlV2hlbjogd2hlblRvRGlzcG9zZSwgZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkOiBhY3RpdmVseURpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZCB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gV2UgZG9uJ3QgeWV0IGhhdmUgYSBET00gbm9kZSB0byBldmFsdWF0ZSwgc28gdXNlIGEgbWVtbyBhbmQgcmVuZGVyIHRoZSB0ZW1wbGF0ZSBsYXRlciB3aGVuIHRoZXJlIGlzIGEgRE9NIG5vZGVcbiAgICAgICAgICAgIHJldHVybiBrby5tZW1vaXphdGlvbi5tZW1vaXplKGZ1bmN0aW9uIChkb21Ob2RlKSB7XG4gICAgICAgICAgICAgICAga28ucmVuZGVyVGVtcGxhdGUodGVtcGxhdGUsIGRhdGFPckJpbmRpbmdDb250ZXh0LCBvcHRpb25zLCBkb21Ob2RlLCBcInJlcGxhY2VOb2RlXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAga28ucmVuZGVyVGVtcGxhdGVGb3JFYWNoID0gZnVuY3Rpb24gKHRlbXBsYXRlLCBhcnJheU9yT2JzZXJ2YWJsZUFycmF5LCBvcHRpb25zLCB0YXJnZXROb2RlLCBwYXJlbnRCaW5kaW5nQ29udGV4dCkge1xuICAgICAgICAvLyBTaW5jZSBzZXREb21Ob2RlQ2hpbGRyZW5Gcm9tQXJyYXlNYXBwaW5nIGFsd2F5cyBjYWxscyBleGVjdXRlVGVtcGxhdGVGb3JBcnJheUl0ZW0gYW5kIHRoZW5cbiAgICAgICAgLy8gYWN0aXZhdGVCaW5kaW5nc0NhbGxiYWNrIGZvciBhZGRlZCBpdGVtcywgd2UgY2FuIHN0b3JlIHRoZSBiaW5kaW5nIGNvbnRleHQgaW4gdGhlIGZvcm1lciB0byB1c2UgaW4gdGhlIGxhdHRlci5cbiAgICAgICAgdmFyIGFycmF5SXRlbUNvbnRleHQ7XG5cbiAgICAgICAgLy8gVGhpcyB3aWxsIGJlIGNhbGxlZCBieSBzZXREb21Ob2RlQ2hpbGRyZW5Gcm9tQXJyYXlNYXBwaW5nIHRvIGdldCB0aGUgbm9kZXMgdG8gYWRkIHRvIHRhcmdldE5vZGVcbiAgICAgICAgdmFyIGV4ZWN1dGVUZW1wbGF0ZUZvckFycmF5SXRlbSA9IGZ1bmN0aW9uIChhcnJheVZhbHVlLCBpbmRleCkge1xuICAgICAgICAgICAgLy8gU3VwcG9ydCBzZWxlY3RpbmcgdGVtcGxhdGUgYXMgYSBmdW5jdGlvbiBvZiB0aGUgZGF0YSBiZWluZyByZW5kZXJlZFxuICAgICAgICAgICAgYXJyYXlJdGVtQ29udGV4dCA9IHBhcmVudEJpbmRpbmdDb250ZXh0WydjcmVhdGVDaGlsZENvbnRleHQnXShhcnJheVZhbHVlLCBvcHRpb25zWydhcyddLCBmdW5jdGlvbihjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgY29udGV4dFsnJGluZGV4J10gPSBpbmRleDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgdGVtcGxhdGVOYW1lID0gcmVzb2x2ZVRlbXBsYXRlTmFtZSh0ZW1wbGF0ZSwgYXJyYXlWYWx1ZSwgYXJyYXlJdGVtQ29udGV4dCk7XG4gICAgICAgICAgICByZXR1cm4gZXhlY3V0ZVRlbXBsYXRlKG51bGwsIFwiaWdub3JlVGFyZ2V0Tm9kZVwiLCB0ZW1wbGF0ZU5hbWUsIGFycmF5SXRlbUNvbnRleHQsIG9wdGlvbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhpcyB3aWxsIGJlIGNhbGxlZCB3aGVuZXZlciBzZXREb21Ob2RlQ2hpbGRyZW5Gcm9tQXJyYXlNYXBwaW5nIGhhcyBhZGRlZCBub2RlcyB0byB0YXJnZXROb2RlXG4gICAgICAgIHZhciBhY3RpdmF0ZUJpbmRpbmdzQ2FsbGJhY2sgPSBmdW5jdGlvbihhcnJheVZhbHVlLCBhZGRlZE5vZGVzQXJyYXksIGluZGV4KSB7XG4gICAgICAgICAgICBhY3RpdmF0ZUJpbmRpbmdzT25Db250aW51b3VzTm9kZUFycmF5KGFkZGVkTm9kZXNBcnJheSwgYXJyYXlJdGVtQ29udGV4dCk7XG4gICAgICAgICAgICBpZiAob3B0aW9uc1snYWZ0ZXJSZW5kZXInXSlcbiAgICAgICAgICAgICAgICBvcHRpb25zWydhZnRlclJlbmRlciddKGFkZGVkTm9kZXNBcnJheSwgYXJyYXlWYWx1ZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGtvLmRlcGVuZGVudE9ic2VydmFibGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHVud3JhcHBlZEFycmF5ID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShhcnJheU9yT2JzZXJ2YWJsZUFycmF5KSB8fCBbXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdW53cmFwcGVkQXJyYXkubGVuZ3RoID09IFwidW5kZWZpbmVkXCIpIC8vIENvZXJjZSBzaW5nbGUgdmFsdWUgaW50byBhcnJheVxuICAgICAgICAgICAgICAgIHVud3JhcHBlZEFycmF5ID0gW3Vud3JhcHBlZEFycmF5XTtcblxuICAgICAgICAgICAgLy8gRmlsdGVyIG91dCBhbnkgZW50cmllcyBtYXJrZWQgYXMgZGVzdHJveWVkXG4gICAgICAgICAgICB2YXIgZmlsdGVyZWRBcnJheSA9IGtvLnV0aWxzLmFycmF5RmlsdGVyKHVud3JhcHBlZEFycmF5LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnNbJ2luY2x1ZGVEZXN0cm95ZWQnXSB8fCBpdGVtID09PSB1bmRlZmluZWQgfHwgaXRlbSA9PT0gbnVsbCB8fCAha28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShpdGVtWydfZGVzdHJveSddKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBDYWxsIHNldERvbU5vZGVDaGlsZHJlbkZyb21BcnJheU1hcHBpbmcsIGlnbm9yaW5nIGFueSBvYnNlcnZhYmxlcyB1bndyYXBwZWQgd2l0aGluIChtb3N0IGxpa2VseSBmcm9tIGEgY2FsbGJhY2sgZnVuY3Rpb24pLlxuICAgICAgICAgICAgLy8gSWYgdGhlIGFycmF5IGl0ZW1zIGFyZSBvYnNlcnZhYmxlcywgdGhvdWdoLCB0aGV5IHdpbGwgYmUgdW53cmFwcGVkIGluIGV4ZWN1dGVUZW1wbGF0ZUZvckFycmF5SXRlbSBhbmQgbWFuYWdlZCB3aXRoaW4gc2V0RG9tTm9kZUNoaWxkcmVuRnJvbUFycmF5TWFwcGluZy5cbiAgICAgICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uaWdub3JlKGtvLnV0aWxzLnNldERvbU5vZGVDaGlsZHJlbkZyb21BcnJheU1hcHBpbmcsIG51bGwsIFt0YXJnZXROb2RlLCBmaWx0ZXJlZEFycmF5LCBleGVjdXRlVGVtcGxhdGVGb3JBcnJheUl0ZW0sIG9wdGlvbnMsIGFjdGl2YXRlQmluZGluZ3NDYWxsYmFja10pO1xuXG4gICAgICAgIH0sIG51bGwsIHsgZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkOiB0YXJnZXROb2RlIH0pO1xuICAgIH07XG5cbiAgICB2YXIgdGVtcGxhdGVDb21wdXRlZERvbURhdGFLZXkgPSBrby51dGlscy5kb21EYXRhLm5leHRLZXkoKTtcbiAgICBmdW5jdGlvbiBkaXNwb3NlT2xkQ29tcHV0ZWRBbmRTdG9yZU5ld09uZShlbGVtZW50LCBuZXdDb21wdXRlZCkge1xuICAgICAgICB2YXIgb2xkQ29tcHV0ZWQgPSBrby51dGlscy5kb21EYXRhLmdldChlbGVtZW50LCB0ZW1wbGF0ZUNvbXB1dGVkRG9tRGF0YUtleSk7XG4gICAgICAgIGlmIChvbGRDb21wdXRlZCAmJiAodHlwZW9mKG9sZENvbXB1dGVkLmRpc3Bvc2UpID09ICdmdW5jdGlvbicpKVxuICAgICAgICAgICAgb2xkQ29tcHV0ZWQuZGlzcG9zZSgpO1xuICAgICAgICBrby51dGlscy5kb21EYXRhLnNldChlbGVtZW50LCB0ZW1wbGF0ZUNvbXB1dGVkRG9tRGF0YUtleSwgKG5ld0NvbXB1dGVkICYmIG5ld0NvbXB1dGVkLmlzQWN0aXZlKCkpID8gbmV3Q29tcHV0ZWQgOiB1bmRlZmluZWQpO1xuICAgIH1cblxuICAgIGtvLmJpbmRpbmdIYW5kbGVyc1sndGVtcGxhdGUnXSA9IHtcbiAgICAgICAgJ2luaXQnOiBmdW5jdGlvbihlbGVtZW50LCB2YWx1ZUFjY2Vzc29yKSB7XG4gICAgICAgICAgICAvLyBTdXBwb3J0IGFub255bW91cyB0ZW1wbGF0ZXNcbiAgICAgICAgICAgIHZhciBiaW5kaW5nVmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGJpbmRpbmdWYWx1ZSA9PSBcInN0cmluZ1wiIHx8IGJpbmRpbmdWYWx1ZVsnbmFtZSddKSB7XG4gICAgICAgICAgICAgICAgLy8gSXQncyBhIG5hbWVkIHRlbXBsYXRlIC0gY2xlYXIgdGhlIGVsZW1lbnRcbiAgICAgICAgICAgICAgICBrby52aXJ0dWFsRWxlbWVudHMuZW1wdHlOb2RlKGVsZW1lbnQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBJdCdzIGFuIGFub255bW91cyB0ZW1wbGF0ZSAtIHN0b3JlIHRoZSBlbGVtZW50IGNvbnRlbnRzLCB0aGVuIGNsZWFyIHRoZSBlbGVtZW50XG4gICAgICAgICAgICAgICAgdmFyIHRlbXBsYXRlTm9kZXMgPSBrby52aXJ0dWFsRWxlbWVudHMuY2hpbGROb2RlcyhlbGVtZW50KSxcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyID0ga28udXRpbHMubW92ZUNsZWFuZWROb2Rlc1RvQ29udGFpbmVyRWxlbWVudCh0ZW1wbGF0ZU5vZGVzKTsgLy8gVGhpcyBhbHNvIHJlbW92ZXMgdGhlIG5vZGVzIGZyb20gdGhlaXIgY3VycmVudCBwYXJlbnRcbiAgICAgICAgICAgICAgICBuZXcga28udGVtcGxhdGVTb3VyY2VzLmFub255bW91c1RlbXBsYXRlKGVsZW1lbnQpWydub2RlcyddKGNvbnRhaW5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geyAnY29udHJvbHNEZXNjZW5kYW50QmluZGluZ3MnOiB0cnVlIH07XG4gICAgICAgIH0sXG4gICAgICAgICd1cGRhdGUnOiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3MsIHZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHZhbHVlQWNjZXNzb3IoKSxcbiAgICAgICAgICAgICAgICBkYXRhVmFsdWUsXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWUpLFxuICAgICAgICAgICAgICAgIHNob3VsZERpc3BsYXkgPSB0cnVlLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlQ29tcHV0ZWQgPSBudWxsLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlTmFtZTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZU5hbWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBvcHRpb25zID0ge307XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlTmFtZSA9IG9wdGlvbnNbJ25hbWUnXTtcblxuICAgICAgICAgICAgICAgIC8vIFN1cHBvcnQgXCJpZlwiL1wiaWZub3RcIiBjb25kaXRpb25zXG4gICAgICAgICAgICAgICAgaWYgKCdpZicgaW4gb3B0aW9ucylcbiAgICAgICAgICAgICAgICAgICAgc2hvdWxkRGlzcGxheSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUob3B0aW9uc1snaWYnXSk7XG4gICAgICAgICAgICAgICAgaWYgKHNob3VsZERpc3BsYXkgJiYgJ2lmbm90JyBpbiBvcHRpb25zKVxuICAgICAgICAgICAgICAgICAgICBzaG91bGREaXNwbGF5ID0gIWtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUob3B0aW9uc1snaWZub3QnXSk7XG5cbiAgICAgICAgICAgICAgICBkYXRhVmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKG9wdGlvbnNbJ2RhdGEnXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgnZm9yZWFjaCcgaW4gb3B0aW9ucykge1xuICAgICAgICAgICAgICAgIC8vIFJlbmRlciBvbmNlIGZvciBlYWNoIGRhdGEgcG9pbnQgKHRyZWF0aW5nIGRhdGEgc2V0IGFzIGVtcHR5IGlmIHNob3VsZERpc3BsYXk9PWZhbHNlKVxuICAgICAgICAgICAgICAgIHZhciBkYXRhQXJyYXkgPSAoc2hvdWxkRGlzcGxheSAmJiBvcHRpb25zWydmb3JlYWNoJ10pIHx8IFtdO1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlQ29tcHV0ZWQgPSBrby5yZW5kZXJUZW1wbGF0ZUZvckVhY2godGVtcGxhdGVOYW1lIHx8IGVsZW1lbnQsIGRhdGFBcnJheSwgb3B0aW9ucywgZWxlbWVudCwgYmluZGluZ0NvbnRleHQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghc2hvdWxkRGlzcGxheSkge1xuICAgICAgICAgICAgICAgIGtvLnZpcnR1YWxFbGVtZW50cy5lbXB0eU5vZGUoZWxlbWVudCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFJlbmRlciBvbmNlIGZvciB0aGlzIHNpbmdsZSBkYXRhIHBvaW50IChvciB1c2UgdGhlIHZpZXdNb2RlbCBpZiBubyBkYXRhIHdhcyBwcm92aWRlZClcbiAgICAgICAgICAgICAgICB2YXIgaW5uZXJCaW5kaW5nQ29udGV4dCA9ICgnZGF0YScgaW4gb3B0aW9ucykgP1xuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nQ29udGV4dFsnY3JlYXRlQ2hpbGRDb250ZXh0J10oZGF0YVZhbHVlLCBvcHRpb25zWydhcyddKSA6ICAvLyBHaXZlbiBhbiBleHBsaXRpdCAnZGF0YScgdmFsdWUsIHdlIGNyZWF0ZSBhIGNoaWxkIGJpbmRpbmcgY29udGV4dCBmb3IgaXRcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZ0NvbnRleHQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHaXZlbiBubyBleHBsaWNpdCAnZGF0YScgdmFsdWUsIHdlIHJldGFpbiB0aGUgc2FtZSBiaW5kaW5nIGNvbnRleHRcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZUNvbXB1dGVkID0ga28ucmVuZGVyVGVtcGxhdGUodGVtcGxhdGVOYW1lIHx8IGVsZW1lbnQsIGlubmVyQmluZGluZ0NvbnRleHQsIG9wdGlvbnMsIGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJdCBvbmx5IG1ha2VzIHNlbnNlIHRvIGhhdmUgYSBzaW5nbGUgdGVtcGxhdGUgY29tcHV0ZWQgcGVyIGVsZW1lbnQgKG90aGVyd2lzZSB3aGljaCBvbmUgc2hvdWxkIGhhdmUgaXRzIG91dHB1dCBkaXNwbGF5ZWQ/KVxuICAgICAgICAgICAgZGlzcG9zZU9sZENvbXB1dGVkQW5kU3RvcmVOZXdPbmUoZWxlbWVudCwgdGVtcGxhdGVDb21wdXRlZCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gQW5vbnltb3VzIHRlbXBsYXRlcyBjYW4ndCBiZSByZXdyaXR0ZW4uIEdpdmUgYSBuaWNlIGVycm9yIG1lc3NhZ2UgaWYgeW91IHRyeSB0byBkbyBpdC5cbiAgICBrby5leHByZXNzaW9uUmV3cml0aW5nLmJpbmRpbmdSZXdyaXRlVmFsaWRhdG9yc1sndGVtcGxhdGUnXSA9IGZ1bmN0aW9uKGJpbmRpbmdWYWx1ZSkge1xuICAgICAgICB2YXIgcGFyc2VkQmluZGluZ1ZhbHVlID0ga28uZXhwcmVzc2lvblJld3JpdGluZy5wYXJzZU9iamVjdExpdGVyYWwoYmluZGluZ1ZhbHVlKTtcblxuICAgICAgICBpZiAoKHBhcnNlZEJpbmRpbmdWYWx1ZS5sZW5ndGggPT0gMSkgJiYgcGFyc2VkQmluZGluZ1ZhbHVlWzBdWyd1bmtub3duJ10pXG4gICAgICAgICAgICByZXR1cm4gbnVsbDsgLy8gSXQgbG9va3MgbGlrZSBhIHN0cmluZyBsaXRlcmFsLCBub3QgYW4gb2JqZWN0IGxpdGVyYWwsIHNvIHRyZWF0IGl0IGFzIGEgbmFtZWQgdGVtcGxhdGUgKHdoaWNoIGlzIGFsbG93ZWQgZm9yIHJld3JpdGluZylcblxuICAgICAgICBpZiAoa28uZXhwcmVzc2lvblJld3JpdGluZy5rZXlWYWx1ZUFycmF5Q29udGFpbnNLZXkocGFyc2VkQmluZGluZ1ZhbHVlLCBcIm5hbWVcIikpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDsgLy8gTmFtZWQgdGVtcGxhdGVzIGNhbiBiZSByZXdyaXR0ZW4sIHNvIHJldHVybiBcIm5vIGVycm9yXCJcbiAgICAgICAgcmV0dXJuIFwiVGhpcyB0ZW1wbGF0ZSBlbmdpbmUgZG9lcyBub3Qgc3VwcG9ydCBhbm9ueW1vdXMgdGVtcGxhdGVzIG5lc3RlZCB3aXRoaW4gaXRzIHRlbXBsYXRlc1wiO1xuICAgIH07XG5cbiAgICBrby52aXJ0dWFsRWxlbWVudHMuYWxsb3dlZEJpbmRpbmdzWyd0ZW1wbGF0ZSddID0gdHJ1ZTtcbn0pKCk7XG5cbmtvLmV4cG9ydFN5bWJvbCgnc2V0VGVtcGxhdGVFbmdpbmUnLCBrby5zZXRUZW1wbGF0ZUVuZ2luZSk7XG5rby5leHBvcnRTeW1ib2woJ3JlbmRlclRlbXBsYXRlJywga28ucmVuZGVyVGVtcGxhdGUpO1xuLy8gR28gdGhyb3VnaCB0aGUgaXRlbXMgdGhhdCBoYXZlIGJlZW4gYWRkZWQgYW5kIGRlbGV0ZWQgYW5kIHRyeSB0byBmaW5kIG1hdGNoZXMgYmV0d2VlbiB0aGVtLlxua28udXRpbHMuZmluZE1vdmVzSW5BcnJheUNvbXBhcmlzb24gPSBmdW5jdGlvbiAobGVmdCwgcmlnaHQsIGxpbWl0RmFpbGVkQ29tcGFyZXMpIHtcbiAgICBpZiAobGVmdC5sZW5ndGggJiYgcmlnaHQubGVuZ3RoKSB7XG4gICAgICAgIHZhciBmYWlsZWRDb21wYXJlcywgbCwgciwgbGVmdEl0ZW0sIHJpZ2h0SXRlbTtcbiAgICAgICAgZm9yIChmYWlsZWRDb21wYXJlcyA9IGwgPSAwOyAoIWxpbWl0RmFpbGVkQ29tcGFyZXMgfHwgZmFpbGVkQ29tcGFyZXMgPCBsaW1pdEZhaWxlZENvbXBhcmVzKSAmJiAobGVmdEl0ZW0gPSBsZWZ0W2xdKTsgKytsKSB7XG4gICAgICAgICAgICBmb3IgKHIgPSAwOyByaWdodEl0ZW0gPSByaWdodFtyXTsgKytyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxlZnRJdGVtWyd2YWx1ZSddID09PSByaWdodEl0ZW1bJ3ZhbHVlJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdEl0ZW1bJ21vdmVkJ10gPSByaWdodEl0ZW1bJ2luZGV4J107XG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0SXRlbVsnbW92ZWQnXSA9IGxlZnRJdGVtWydpbmRleCddO1xuICAgICAgICAgICAgICAgICAgICByaWdodC5zcGxpY2UociwgMSk7ICAgICAgICAgLy8gVGhpcyBpdGVtIGlzIG1hcmtlZCBhcyBtb3ZlZDsgc28gcmVtb3ZlIGl0IGZyb20gcmlnaHQgbGlzdFxuICAgICAgICAgICAgICAgICAgICBmYWlsZWRDb21wYXJlcyA9IHIgPSAwOyAgICAgLy8gUmVzZXQgZmFpbGVkIGNvbXBhcmVzIGNvdW50IGJlY2F1c2Ugd2UncmUgY2hlY2tpbmcgZm9yIGNvbnNlY3V0aXZlIGZhaWx1cmVzXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZhaWxlZENvbXBhcmVzICs9IHI7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5rby51dGlscy5jb21wYXJlQXJyYXlzID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc3RhdHVzTm90SW5PbGQgPSAnYWRkZWQnLCBzdGF0dXNOb3RJbk5ldyA9ICdkZWxldGVkJztcblxuICAgIC8vIFNpbXBsZSBjYWxjdWxhdGlvbiBiYXNlZCBvbiBMZXZlbnNodGVpbiBkaXN0YW5jZS5cbiAgICBmdW5jdGlvbiBjb21wYXJlQXJyYXlzKG9sZEFycmF5LCBuZXdBcnJheSwgb3B0aW9ucykge1xuICAgICAgICAvLyBGb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSwgaWYgdGhlIHRoaXJkIGFyZyBpcyBhY3R1YWxseSBhIGJvb2wsIGludGVycHJldFxuICAgICAgICAvLyBpdCBhcyB0aGUgb2xkIHBhcmFtZXRlciAnZG9udExpbWl0TW92ZXMnLiBOZXdlciBjb2RlIHNob3VsZCB1c2UgeyBkb250TGltaXRNb3ZlczogdHJ1ZSB9LlxuICAgICAgICBvcHRpb25zID0gKHR5cGVvZiBvcHRpb25zID09PSAnYm9vbGVhbicpID8geyAnZG9udExpbWl0TW92ZXMnOiBvcHRpb25zIH0gOiAob3B0aW9ucyB8fCB7fSk7XG4gICAgICAgIG9sZEFycmF5ID0gb2xkQXJyYXkgfHwgW107XG4gICAgICAgIG5ld0FycmF5ID0gbmV3QXJyYXkgfHwgW107XG5cbiAgICAgICAgaWYgKG9sZEFycmF5Lmxlbmd0aCA8PSBuZXdBcnJheS5sZW5ndGgpXG4gICAgICAgICAgICByZXR1cm4gY29tcGFyZVNtYWxsQXJyYXlUb0JpZ0FycmF5KG9sZEFycmF5LCBuZXdBcnJheSwgc3RhdHVzTm90SW5PbGQsIHN0YXR1c05vdEluTmV3LCBvcHRpb25zKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIGNvbXBhcmVTbWFsbEFycmF5VG9CaWdBcnJheShuZXdBcnJheSwgb2xkQXJyYXksIHN0YXR1c05vdEluTmV3LCBzdGF0dXNOb3RJbk9sZCwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29tcGFyZVNtYWxsQXJyYXlUb0JpZ0FycmF5KHNtbEFycmF5LCBiaWdBcnJheSwgc3RhdHVzTm90SW5TbWwsIHN0YXR1c05vdEluQmlnLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBteU1pbiA9IE1hdGgubWluLFxuICAgICAgICAgICAgbXlNYXggPSBNYXRoLm1heCxcbiAgICAgICAgICAgIGVkaXREaXN0YW5jZU1hdHJpeCA9IFtdLFxuICAgICAgICAgICAgc21sSW5kZXgsIHNtbEluZGV4TWF4ID0gc21sQXJyYXkubGVuZ3RoLFxuICAgICAgICAgICAgYmlnSW5kZXgsIGJpZ0luZGV4TWF4ID0gYmlnQXJyYXkubGVuZ3RoLFxuICAgICAgICAgICAgY29tcGFyZVJhbmdlID0gKGJpZ0luZGV4TWF4IC0gc21sSW5kZXhNYXgpIHx8IDEsXG4gICAgICAgICAgICBtYXhEaXN0YW5jZSA9IHNtbEluZGV4TWF4ICsgYmlnSW5kZXhNYXggKyAxLFxuICAgICAgICAgICAgdGhpc1JvdywgbGFzdFJvdyxcbiAgICAgICAgICAgIGJpZ0luZGV4TWF4Rm9yUm93LCBiaWdJbmRleE1pbkZvclJvdztcblxuICAgICAgICBmb3IgKHNtbEluZGV4ID0gMDsgc21sSW5kZXggPD0gc21sSW5kZXhNYXg7IHNtbEluZGV4KyspIHtcbiAgICAgICAgICAgIGxhc3RSb3cgPSB0aGlzUm93O1xuICAgICAgICAgICAgZWRpdERpc3RhbmNlTWF0cml4LnB1c2godGhpc1JvdyA9IFtdKTtcbiAgICAgICAgICAgIGJpZ0luZGV4TWF4Rm9yUm93ID0gbXlNaW4oYmlnSW5kZXhNYXgsIHNtbEluZGV4ICsgY29tcGFyZVJhbmdlKTtcbiAgICAgICAgICAgIGJpZ0luZGV4TWluRm9yUm93ID0gbXlNYXgoMCwgc21sSW5kZXggLSAxKTtcbiAgICAgICAgICAgIGZvciAoYmlnSW5kZXggPSBiaWdJbmRleE1pbkZvclJvdzsgYmlnSW5kZXggPD0gYmlnSW5kZXhNYXhGb3JSb3c7IGJpZ0luZGV4KyspIHtcbiAgICAgICAgICAgICAgICBpZiAoIWJpZ0luZGV4KVxuICAgICAgICAgICAgICAgICAgICB0aGlzUm93W2JpZ0luZGV4XSA9IHNtbEluZGV4ICsgMTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICghc21sSW5kZXgpICAvLyBUb3Agcm93IC0gdHJhbnNmb3JtIGVtcHR5IGFycmF5IGludG8gbmV3IGFycmF5IHZpYSBhZGRpdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgdGhpc1Jvd1tiaWdJbmRleF0gPSBiaWdJbmRleCArIDE7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoc21sQXJyYXlbc21sSW5kZXggLSAxXSA9PT0gYmlnQXJyYXlbYmlnSW5kZXggLSAxXSlcbiAgICAgICAgICAgICAgICAgICAgdGhpc1Jvd1tiaWdJbmRleF0gPSBsYXN0Um93W2JpZ0luZGV4IC0gMV07ICAgICAgICAgICAgICAgICAgLy8gY29weSB2YWx1ZSAobm8gZWRpdClcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5vcnRoRGlzdGFuY2UgPSBsYXN0Um93W2JpZ0luZGV4XSB8fCBtYXhEaXN0YW5jZTsgICAgICAgLy8gbm90IGluIGJpZyAoZGVsZXRpb24pXG4gICAgICAgICAgICAgICAgICAgIHZhciB3ZXN0RGlzdGFuY2UgPSB0aGlzUm93W2JpZ0luZGV4IC0gMV0gfHwgbWF4RGlzdGFuY2U7ICAgIC8vIG5vdCBpbiBzbWFsbCAoYWRkaXRpb24pXG4gICAgICAgICAgICAgICAgICAgIHRoaXNSb3dbYmlnSW5kZXhdID0gbXlNaW4obm9ydGhEaXN0YW5jZSwgd2VzdERpc3RhbmNlKSArIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGVkaXRTY3JpcHQgPSBbXSwgbWVNaW51c09uZSwgbm90SW5TbWwgPSBbXSwgbm90SW5CaWcgPSBbXTtcbiAgICAgICAgZm9yIChzbWxJbmRleCA9IHNtbEluZGV4TWF4LCBiaWdJbmRleCA9IGJpZ0luZGV4TWF4OyBzbWxJbmRleCB8fCBiaWdJbmRleDspIHtcbiAgICAgICAgICAgIG1lTWludXNPbmUgPSBlZGl0RGlzdGFuY2VNYXRyaXhbc21sSW5kZXhdW2JpZ0luZGV4XSAtIDE7XG4gICAgICAgICAgICBpZiAoYmlnSW5kZXggJiYgbWVNaW51c09uZSA9PT0gZWRpdERpc3RhbmNlTWF0cml4W3NtbEluZGV4XVtiaWdJbmRleC0xXSkge1xuICAgICAgICAgICAgICAgIG5vdEluU21sLnB1c2goZWRpdFNjcmlwdFtlZGl0U2NyaXB0Lmxlbmd0aF0gPSB7ICAgICAvLyBhZGRlZFxuICAgICAgICAgICAgICAgICAgICAnc3RhdHVzJzogc3RhdHVzTm90SW5TbWwsXG4gICAgICAgICAgICAgICAgICAgICd2YWx1ZSc6IGJpZ0FycmF5Wy0tYmlnSW5kZXhdLFxuICAgICAgICAgICAgICAgICAgICAnaW5kZXgnOiBiaWdJbmRleCB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc21sSW5kZXggJiYgbWVNaW51c09uZSA9PT0gZWRpdERpc3RhbmNlTWF0cml4W3NtbEluZGV4IC0gMV1bYmlnSW5kZXhdKSB7XG4gICAgICAgICAgICAgICAgbm90SW5CaWcucHVzaChlZGl0U2NyaXB0W2VkaXRTY3JpcHQubGVuZ3RoXSA9IHsgICAgIC8vIGRlbGV0ZWRcbiAgICAgICAgICAgICAgICAgICAgJ3N0YXR1cyc6IHN0YXR1c05vdEluQmlnLFxuICAgICAgICAgICAgICAgICAgICAndmFsdWUnOiBzbWxBcnJheVstLXNtbEluZGV4XSxcbiAgICAgICAgICAgICAgICAgICAgJ2luZGV4Jzogc21sSW5kZXggfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC0tYmlnSW5kZXg7XG4gICAgICAgICAgICAgICAgLS1zbWxJbmRleDtcbiAgICAgICAgICAgICAgICBpZiAoIW9wdGlvbnNbJ3NwYXJzZSddKSB7XG4gICAgICAgICAgICAgICAgICAgIGVkaXRTY3JpcHQucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAnc3RhdHVzJzogXCJyZXRhaW5lZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlJzogYmlnQXJyYXlbYmlnSW5kZXhdIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNldCBhIGxpbWl0IG9uIHRoZSBudW1iZXIgb2YgY29uc2VjdXRpdmUgbm9uLW1hdGNoaW5nIGNvbXBhcmlzb25zOyBoYXZpbmcgaXQgYSBtdWx0aXBsZSBvZlxuICAgICAgICAvLyBzbWxJbmRleE1heCBrZWVwcyB0aGUgdGltZSBjb21wbGV4aXR5IG9mIHRoaXMgYWxnb3JpdGhtIGxpbmVhci5cbiAgICAgICAga28udXRpbHMuZmluZE1vdmVzSW5BcnJheUNvbXBhcmlzb24obm90SW5TbWwsIG5vdEluQmlnLCBzbWxJbmRleE1heCAqIDEwKTtcblxuICAgICAgICByZXR1cm4gZWRpdFNjcmlwdC5yZXZlcnNlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbXBhcmVBcnJheXM7XG59KSgpO1xuXG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLmNvbXBhcmVBcnJheXMnLCBrby51dGlscy5jb21wYXJlQXJyYXlzKTtcbihmdW5jdGlvbiAoKSB7XG4gICAgLy8gT2JqZWN0aXZlOlxuICAgIC8vICogR2l2ZW4gYW4gaW5wdXQgYXJyYXksIGEgY29udGFpbmVyIERPTSBub2RlLCBhbmQgYSBmdW5jdGlvbiBmcm9tIGFycmF5IGVsZW1lbnRzIHRvIGFycmF5cyBvZiBET00gbm9kZXMsXG4gICAgLy8gICBtYXAgdGhlIGFycmF5IGVsZW1lbnRzIHRvIGFycmF5cyBvZiBET00gbm9kZXMsIGNvbmNhdGVuYXRlIHRvZ2V0aGVyIGFsbCB0aGVzZSBhcnJheXMsIGFuZCB1c2UgdGhlbSB0byBwb3B1bGF0ZSB0aGUgY29udGFpbmVyIERPTSBub2RlXG4gICAgLy8gKiBOZXh0IHRpbWUgd2UncmUgZ2l2ZW4gdGhlIHNhbWUgY29tYmluYXRpb24gb2YgdGhpbmdzICh3aXRoIHRoZSBhcnJheSBwb3NzaWJseSBoYXZpbmcgbXV0YXRlZCksIHVwZGF0ZSB0aGUgY29udGFpbmVyIERPTSBub2RlXG4gICAgLy8gICBzbyB0aGF0IGl0cyBjaGlsZHJlbiBpcyBhZ2FpbiB0aGUgY29uY2F0ZW5hdGlvbiBvZiB0aGUgbWFwcGluZ3Mgb2YgdGhlIGFycmF5IGVsZW1lbnRzLCBidXQgZG9uJ3QgcmUtbWFwIGFueSBhcnJheSBlbGVtZW50cyB0aGF0IHdlXG4gICAgLy8gICBwcmV2aW91c2x5IG1hcHBlZCAtIHJldGFpbiB0aG9zZSBub2RlcywgYW5kIGp1c3QgaW5zZXJ0L2RlbGV0ZSBvdGhlciBvbmVzXG5cbiAgICAvLyBcImNhbGxiYWNrQWZ0ZXJBZGRpbmdOb2Rlc1wiIHdpbGwgYmUgaW52b2tlZCBhZnRlciBhbnkgXCJtYXBwaW5nXCItZ2VuZXJhdGVkIG5vZGVzIGFyZSBpbnNlcnRlZCBpbnRvIHRoZSBjb250YWluZXIgbm9kZVxuICAgIC8vIFlvdSBjYW4gdXNlIHRoaXMsIGZvciBleGFtcGxlLCB0byBhY3RpdmF0ZSBiaW5kaW5ncyBvbiB0aG9zZSBub2Rlcy5cblxuICAgIGZ1bmN0aW9uIG1hcE5vZGVBbmRSZWZyZXNoV2hlbkNoYW5nZWQoY29udGFpbmVyTm9kZSwgbWFwcGluZywgdmFsdWVUb01hcCwgY2FsbGJhY2tBZnRlckFkZGluZ05vZGVzLCBpbmRleCkge1xuICAgICAgICAvLyBNYXAgdGhpcyBhcnJheSB2YWx1ZSBpbnNpZGUgYSBkZXBlbmRlbnRPYnNlcnZhYmxlIHNvIHdlIHJlLW1hcCB3aGVuIGFueSBkZXBlbmRlbmN5IGNoYW5nZXNcbiAgICAgICAgdmFyIG1hcHBlZE5vZGVzID0gW107XG4gICAgICAgIHZhciBkZXBlbmRlbnRPYnNlcnZhYmxlID0ga28uZGVwZW5kZW50T2JzZXJ2YWJsZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBuZXdNYXBwZWROb2RlcyA9IG1hcHBpbmcodmFsdWVUb01hcCwgaW5kZXgsIGtvLnV0aWxzLmZpeFVwQ29udGludW91c05vZGVBcnJheShtYXBwZWROb2RlcywgY29udGFpbmVyTm9kZSkpIHx8IFtdO1xuXG4gICAgICAgICAgICAvLyBPbiBzdWJzZXF1ZW50IGV2YWx1YXRpb25zLCBqdXN0IHJlcGxhY2UgdGhlIHByZXZpb3VzbHktaW5zZXJ0ZWQgRE9NIG5vZGVzXG4gICAgICAgICAgICBpZiAobWFwcGVkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGtvLnV0aWxzLnJlcGxhY2VEb21Ob2RlcyhtYXBwZWROb2RlcywgbmV3TWFwcGVkTm9kZXMpO1xuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFja0FmdGVyQWRkaW5nTm9kZXMpXG4gICAgICAgICAgICAgICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uaWdub3JlKGNhbGxiYWNrQWZ0ZXJBZGRpbmdOb2RlcywgbnVsbCwgW3ZhbHVlVG9NYXAsIG5ld01hcHBlZE5vZGVzLCBpbmRleF0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBSZXBsYWNlIHRoZSBjb250ZW50cyBvZiB0aGUgbWFwcGVkTm9kZXMgYXJyYXksIHRoZXJlYnkgdXBkYXRpbmcgdGhlIHJlY29yZFxuICAgICAgICAgICAgLy8gb2Ygd2hpY2ggbm9kZXMgd291bGQgYmUgZGVsZXRlZCBpZiB2YWx1ZVRvTWFwIHdhcyBpdHNlbGYgbGF0ZXIgcmVtb3ZlZFxuICAgICAgICAgICAgbWFwcGVkTm9kZXMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIGtvLnV0aWxzLmFycmF5UHVzaEFsbChtYXBwZWROb2RlcywgbmV3TWFwcGVkTm9kZXMpO1xuICAgICAgICB9LCBudWxsLCB7IGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZDogY29udGFpbmVyTm9kZSwgZGlzcG9zZVdoZW46IGZ1bmN0aW9uKCkgeyByZXR1cm4gIWtvLnV0aWxzLmFueURvbU5vZGVJc0F0dGFjaGVkVG9Eb2N1bWVudChtYXBwZWROb2Rlcyk7IH0gfSk7XG4gICAgICAgIHJldHVybiB7IG1hcHBlZE5vZGVzIDogbWFwcGVkTm9kZXMsIGRlcGVuZGVudE9ic2VydmFibGUgOiAoZGVwZW5kZW50T2JzZXJ2YWJsZS5pc0FjdGl2ZSgpID8gZGVwZW5kZW50T2JzZXJ2YWJsZSA6IHVuZGVmaW5lZCkgfTtcbiAgICB9XG5cbiAgICB2YXIgbGFzdE1hcHBpbmdSZXN1bHREb21EYXRhS2V5ID0ga28udXRpbHMuZG9tRGF0YS5uZXh0S2V5KCk7XG5cbiAgICBrby51dGlscy5zZXREb21Ob2RlQ2hpbGRyZW5Gcm9tQXJyYXlNYXBwaW5nID0gZnVuY3Rpb24gKGRvbU5vZGUsIGFycmF5LCBtYXBwaW5nLCBvcHRpb25zLCBjYWxsYmFja0FmdGVyQWRkaW5nTm9kZXMpIHtcbiAgICAgICAgLy8gQ29tcGFyZSB0aGUgcHJvdmlkZWQgYXJyYXkgYWdhaW5zdCB0aGUgcHJldmlvdXMgb25lXG4gICAgICAgIGFycmF5ID0gYXJyYXkgfHwgW107XG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgICB2YXIgaXNGaXJzdEV4ZWN1dGlvbiA9IGtvLnV0aWxzLmRvbURhdGEuZ2V0KGRvbU5vZGUsIGxhc3RNYXBwaW5nUmVzdWx0RG9tRGF0YUtleSkgPT09IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIGxhc3RNYXBwaW5nUmVzdWx0ID0ga28udXRpbHMuZG9tRGF0YS5nZXQoZG9tTm9kZSwgbGFzdE1hcHBpbmdSZXN1bHREb21EYXRhS2V5KSB8fCBbXTtcbiAgICAgICAgdmFyIGxhc3RBcnJheSA9IGtvLnV0aWxzLmFycmF5TWFwKGxhc3RNYXBwaW5nUmVzdWx0LCBmdW5jdGlvbiAoeCkgeyByZXR1cm4geC5hcnJheUVudHJ5OyB9KTtcbiAgICAgICAgdmFyIGVkaXRTY3JpcHQgPSBrby51dGlscy5jb21wYXJlQXJyYXlzKGxhc3RBcnJheSwgYXJyYXksIG9wdGlvbnNbJ2RvbnRMaW1pdE1vdmVzJ10pO1xuXG4gICAgICAgIC8vIEJ1aWxkIHRoZSBuZXcgbWFwcGluZyByZXN1bHRcbiAgICAgICAgdmFyIG5ld01hcHBpbmdSZXN1bHQgPSBbXTtcbiAgICAgICAgdmFyIGxhc3RNYXBwaW5nUmVzdWx0SW5kZXggPSAwO1xuICAgICAgICB2YXIgbmV3TWFwcGluZ1Jlc3VsdEluZGV4ID0gMDtcblxuICAgICAgICB2YXIgbm9kZXNUb0RlbGV0ZSA9IFtdO1xuICAgICAgICB2YXIgaXRlbXNUb1Byb2Nlc3MgPSBbXTtcbiAgICAgICAgdmFyIGl0ZW1zRm9yQmVmb3JlUmVtb3ZlQ2FsbGJhY2tzID0gW107XG4gICAgICAgIHZhciBpdGVtc0Zvck1vdmVDYWxsYmFja3MgPSBbXTtcbiAgICAgICAgdmFyIGl0ZW1zRm9yQWZ0ZXJBZGRDYWxsYmFja3MgPSBbXTtcbiAgICAgICAgdmFyIG1hcERhdGE7XG5cbiAgICAgICAgZnVuY3Rpb24gaXRlbU1vdmVkT3JSZXRhaW5lZChlZGl0U2NyaXB0SW5kZXgsIG9sZFBvc2l0aW9uKSB7XG4gICAgICAgICAgICBtYXBEYXRhID0gbGFzdE1hcHBpbmdSZXN1bHRbb2xkUG9zaXRpb25dO1xuICAgICAgICAgICAgaWYgKG5ld01hcHBpbmdSZXN1bHRJbmRleCAhPT0gb2xkUG9zaXRpb24pXG4gICAgICAgICAgICAgICAgaXRlbXNGb3JNb3ZlQ2FsbGJhY2tzW2VkaXRTY3JpcHRJbmRleF0gPSBtYXBEYXRhO1xuICAgICAgICAgICAgLy8gU2luY2UgdXBkYXRpbmcgdGhlIGluZGV4IG1pZ2h0IGNoYW5nZSB0aGUgbm9kZXMsIGRvIHNvIGJlZm9yZSBjYWxsaW5nIGZpeFVwQ29udGludW91c05vZGVBcnJheVxuICAgICAgICAgICAgbWFwRGF0YS5pbmRleE9ic2VydmFibGUobmV3TWFwcGluZ1Jlc3VsdEluZGV4KyspO1xuICAgICAgICAgICAga28udXRpbHMuZml4VXBDb250aW51b3VzTm9kZUFycmF5KG1hcERhdGEubWFwcGVkTm9kZXMsIGRvbU5vZGUpO1xuICAgICAgICAgICAgbmV3TWFwcGluZ1Jlc3VsdC5wdXNoKG1hcERhdGEpO1xuICAgICAgICAgICAgaXRlbXNUb1Byb2Nlc3MucHVzaChtYXBEYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNhbGxDYWxsYmFjayhjYWxsYmFjaywgaXRlbXMpIHtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBuID0gaXRlbXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtc1tpXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAga28udXRpbHMuYXJyYXlGb3JFYWNoKGl0ZW1zW2ldLm1hcHBlZE5vZGVzLCBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobm9kZSwgaSwgaXRlbXNbaV0uYXJyYXlFbnRyeSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBlZGl0U2NyaXB0SXRlbSwgbW92ZWRJbmRleDsgZWRpdFNjcmlwdEl0ZW0gPSBlZGl0U2NyaXB0W2ldOyBpKyspIHtcbiAgICAgICAgICAgIG1vdmVkSW5kZXggPSBlZGl0U2NyaXB0SXRlbVsnbW92ZWQnXTtcbiAgICAgICAgICAgIHN3aXRjaCAoZWRpdFNjcmlwdEl0ZW1bJ3N0YXR1cyddKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcImRlbGV0ZWRcIjpcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1vdmVkSW5kZXggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFwRGF0YSA9IGxhc3RNYXBwaW5nUmVzdWx0W2xhc3RNYXBwaW5nUmVzdWx0SW5kZXhdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTdG9wIHRyYWNraW5nIGNoYW5nZXMgdG8gdGhlIG1hcHBpbmcgZm9yIHRoZXNlIG5vZGVzXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFwRGF0YS5kZXBlbmRlbnRPYnNlcnZhYmxlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcERhdGEuZGVwZW5kZW50T2JzZXJ2YWJsZS5kaXNwb3NlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFF1ZXVlIHRoZXNlIG5vZGVzIGZvciBsYXRlciByZW1vdmFsXG4gICAgICAgICAgICAgICAgICAgICAgICBub2Rlc1RvRGVsZXRlLnB1c2guYXBwbHkobm9kZXNUb0RlbGV0ZSwga28udXRpbHMuZml4VXBDb250aW51b3VzTm9kZUFycmF5KG1hcERhdGEubWFwcGVkTm9kZXMsIGRvbU5vZGUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zWydiZWZvcmVSZW1vdmUnXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zRm9yQmVmb3JlUmVtb3ZlQ2FsbGJhY2tzW2ldID0gbWFwRGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtc1RvUHJvY2Vzcy5wdXNoKG1hcERhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxhc3RNYXBwaW5nUmVzdWx0SW5kZXgrKztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIFwicmV0YWluZWRcIjpcbiAgICAgICAgICAgICAgICAgICAgaXRlbU1vdmVkT3JSZXRhaW5lZChpLCBsYXN0TWFwcGluZ1Jlc3VsdEluZGV4KyspO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgXCJhZGRlZFwiOlxuICAgICAgICAgICAgICAgICAgICBpZiAobW92ZWRJbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtTW92ZWRPclJldGFpbmVkKGksIG1vdmVkSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFwRGF0YSA9IHsgYXJyYXlFbnRyeTogZWRpdFNjcmlwdEl0ZW1bJ3ZhbHVlJ10sIGluZGV4T2JzZXJ2YWJsZToga28ub2JzZXJ2YWJsZShuZXdNYXBwaW5nUmVzdWx0SW5kZXgrKykgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld01hcHBpbmdSZXN1bHQucHVzaChtYXBEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zVG9Qcm9jZXNzLnB1c2gobWFwRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzRmlyc3RFeGVjdXRpb24pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXNGb3JBZnRlckFkZENhbGxiYWNrc1tpXSA9IG1hcERhdGE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDYWxsIGJlZm9yZU1vdmUgZmlyc3QgYmVmb3JlIGFueSBjaGFuZ2VzIGhhdmUgYmVlbiBtYWRlIHRvIHRoZSBET01cbiAgICAgICAgY2FsbENhbGxiYWNrKG9wdGlvbnNbJ2JlZm9yZU1vdmUnXSwgaXRlbXNGb3JNb3ZlQ2FsbGJhY2tzKTtcblxuICAgICAgICAvLyBOZXh0IHJlbW92ZSBub2RlcyBmb3IgZGVsZXRlZCBpdGVtcyAob3IganVzdCBjbGVhbiBpZiB0aGVyZSdzIGEgYmVmb3JlUmVtb3ZlIGNhbGxiYWNrKVxuICAgICAgICBrby51dGlscy5hcnJheUZvckVhY2gobm9kZXNUb0RlbGV0ZSwgb3B0aW9uc1snYmVmb3JlUmVtb3ZlJ10gPyBrby5jbGVhbk5vZGUgOiBrby5yZW1vdmVOb2RlKTtcblxuICAgICAgICAvLyBOZXh0IGFkZC9yZW9yZGVyIHRoZSByZW1haW5pbmcgaXRlbXMgKHdpbGwgaW5jbHVkZSBkZWxldGVkIGl0ZW1zIGlmIHRoZXJlJ3MgYSBiZWZvcmVSZW1vdmUgY2FsbGJhY2spXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBuZXh0Tm9kZSA9IGtvLnZpcnR1YWxFbGVtZW50cy5maXJzdENoaWxkKGRvbU5vZGUpLCBsYXN0Tm9kZSwgbm9kZTsgbWFwRGF0YSA9IGl0ZW1zVG9Qcm9jZXNzW2ldOyBpKyspIHtcbiAgICAgICAgICAgIC8vIEdldCBub2RlcyBmb3IgbmV3bHkgYWRkZWQgaXRlbXNcbiAgICAgICAgICAgIGlmICghbWFwRGF0YS5tYXBwZWROb2RlcylcbiAgICAgICAgICAgICAgICBrby51dGlscy5leHRlbmQobWFwRGF0YSwgbWFwTm9kZUFuZFJlZnJlc2hXaGVuQ2hhbmdlZChkb21Ob2RlLCBtYXBwaW5nLCBtYXBEYXRhLmFycmF5RW50cnksIGNhbGxiYWNrQWZ0ZXJBZGRpbmdOb2RlcywgbWFwRGF0YS5pbmRleE9ic2VydmFibGUpKTtcblxuICAgICAgICAgICAgLy8gUHV0IG5vZGVzIGluIHRoZSByaWdodCBwbGFjZSBpZiB0aGV5IGFyZW4ndCB0aGVyZSBhbHJlYWR5XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgbm9kZSA9IG1hcERhdGEubWFwcGVkTm9kZXNbal07IG5leHROb2RlID0gbm9kZS5uZXh0U2libGluZywgbGFzdE5vZGUgPSBub2RlLCBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZSAhPT0gbmV4dE5vZGUpXG4gICAgICAgICAgICAgICAgICAgIGtvLnZpcnR1YWxFbGVtZW50cy5pbnNlcnRBZnRlcihkb21Ob2RlLCBub2RlLCBsYXN0Tm9kZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFJ1biB0aGUgY2FsbGJhY2tzIGZvciBuZXdseSBhZGRlZCBub2RlcyAoZm9yIGV4YW1wbGUsIHRvIGFwcGx5IGJpbmRpbmdzLCBldGMuKVxuICAgICAgICAgICAgaWYgKCFtYXBEYXRhLmluaXRpYWxpemVkICYmIGNhbGxiYWNrQWZ0ZXJBZGRpbmdOb2Rlcykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrQWZ0ZXJBZGRpbmdOb2RlcyhtYXBEYXRhLmFycmF5RW50cnksIG1hcERhdGEubWFwcGVkTm9kZXMsIG1hcERhdGEuaW5kZXhPYnNlcnZhYmxlKTtcbiAgICAgICAgICAgICAgICBtYXBEYXRhLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoZXJlJ3MgYSBiZWZvcmVSZW1vdmUgY2FsbGJhY2ssIGNhbGwgaXQgYWZ0ZXIgcmVvcmRlcmluZy5cbiAgICAgICAgLy8gTm90ZSB0aGF0IHdlIGFzc3VtZSB0aGF0IHRoZSBiZWZvcmVSZW1vdmUgY2FsbGJhY2sgd2lsbCB1c3VhbGx5IGJlIHVzZWQgdG8gcmVtb3ZlIHRoZSBub2RlcyB1c2luZ1xuICAgICAgICAvLyBzb21lIHNvcnQgb2YgYW5pbWF0aW9uLCB3aGljaCBpcyB3aHkgd2UgZmlyc3QgcmVvcmRlciB0aGUgbm9kZXMgdGhhdCB3aWxsIGJlIHJlbW92ZWQuIElmIHRoZVxuICAgICAgICAvLyBjYWxsYmFjayBpbnN0ZWFkIHJlbW92ZXMgdGhlIG5vZGVzIHJpZ2h0IGF3YXksIGl0IHdvdWxkIGJlIG1vcmUgZWZmaWNpZW50IHRvIHNraXAgcmVvcmRlcmluZyB0aGVtLlxuICAgICAgICAvLyBQZXJoYXBzIHdlJ2xsIG1ha2UgdGhhdCBjaGFuZ2UgaW4gdGhlIGZ1dHVyZSBpZiB0aGlzIHNjZW5hcmlvIGJlY29tZXMgbW9yZSBjb21tb24uXG4gICAgICAgIGNhbGxDYWxsYmFjayhvcHRpb25zWydiZWZvcmVSZW1vdmUnXSwgaXRlbXNGb3JCZWZvcmVSZW1vdmVDYWxsYmFja3MpO1xuXG4gICAgICAgIC8vIEZpbmFsbHkgY2FsbCBhZnRlck1vdmUgYW5kIGFmdGVyQWRkIGNhbGxiYWNrc1xuICAgICAgICBjYWxsQ2FsbGJhY2sob3B0aW9uc1snYWZ0ZXJNb3ZlJ10sIGl0ZW1zRm9yTW92ZUNhbGxiYWNrcyk7XG4gICAgICAgIGNhbGxDYWxsYmFjayhvcHRpb25zWydhZnRlckFkZCddLCBpdGVtc0ZvckFmdGVyQWRkQ2FsbGJhY2tzKTtcblxuICAgICAgICAvLyBTdG9yZSBhIGNvcHkgb2YgdGhlIGFycmF5IGl0ZW1zIHdlIGp1c3QgY29uc2lkZXJlZCBzbyB3ZSBjYW4gZGlmZmVyZW5jZSBpdCBuZXh0IHRpbWVcbiAgICAgICAga28udXRpbHMuZG9tRGF0YS5zZXQoZG9tTm9kZSwgbGFzdE1hcHBpbmdSZXN1bHREb21EYXRhS2V5LCBuZXdNYXBwaW5nUmVzdWx0KTtcbiAgICB9XG59KSgpO1xuXG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLnNldERvbU5vZGVDaGlsZHJlbkZyb21BcnJheU1hcHBpbmcnLCBrby51dGlscy5zZXREb21Ob2RlQ2hpbGRyZW5Gcm9tQXJyYXlNYXBwaW5nKTtcbmtvLm5hdGl2ZVRlbXBsYXRlRW5naW5lID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXNbJ2FsbG93VGVtcGxhdGVSZXdyaXRpbmcnXSA9IGZhbHNlO1xufVxuXG5rby5uYXRpdmVUZW1wbGF0ZUVuZ2luZS5wcm90b3R5cGUgPSBuZXcga28udGVtcGxhdGVFbmdpbmUoKTtcbmtvLm5hdGl2ZVRlbXBsYXRlRW5naW5lLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGtvLm5hdGl2ZVRlbXBsYXRlRW5naW5lO1xua28ubmF0aXZlVGVtcGxhdGVFbmdpbmUucHJvdG90eXBlWydyZW5kZXJUZW1wbGF0ZVNvdXJjZSddID0gZnVuY3Rpb24gKHRlbXBsYXRlU291cmNlLCBiaW5kaW5nQ29udGV4dCwgb3B0aW9ucykge1xuICAgIHZhciB1c2VOb2Rlc0lmQXZhaWxhYmxlID0gIShrby51dGlscy5pZVZlcnNpb24gPCA5KSwgLy8gSUU8OSBjbG9uZU5vZGUgZG9lc24ndCB3b3JrIHByb3Blcmx5XG4gICAgICAgIHRlbXBsYXRlTm9kZXNGdW5jID0gdXNlTm9kZXNJZkF2YWlsYWJsZSA/IHRlbXBsYXRlU291cmNlWydub2RlcyddIDogbnVsbCxcbiAgICAgICAgdGVtcGxhdGVOb2RlcyA9IHRlbXBsYXRlTm9kZXNGdW5jID8gdGVtcGxhdGVTb3VyY2VbJ25vZGVzJ10oKSA6IG51bGw7XG5cbiAgICBpZiAodGVtcGxhdGVOb2Rlcykge1xuICAgICAgICByZXR1cm4ga28udXRpbHMubWFrZUFycmF5KHRlbXBsYXRlTm9kZXMuY2xvbmVOb2RlKHRydWUpLmNoaWxkTm9kZXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciB0ZW1wbGF0ZVRleHQgPSB0ZW1wbGF0ZVNvdXJjZVsndGV4dCddKCk7XG4gICAgICAgIHJldHVybiBrby51dGlscy5wYXJzZUh0bWxGcmFnbWVudCh0ZW1wbGF0ZVRleHQpO1xuICAgIH1cbn07XG5cbmtvLm5hdGl2ZVRlbXBsYXRlRW5naW5lLmluc3RhbmNlID0gbmV3IGtvLm5hdGl2ZVRlbXBsYXRlRW5naW5lKCk7XG5rby5zZXRUZW1wbGF0ZUVuZ2luZShrby5uYXRpdmVUZW1wbGF0ZUVuZ2luZS5pbnN0YW5jZSk7XG5cbmtvLmV4cG9ydFN5bWJvbCgnbmF0aXZlVGVtcGxhdGVFbmdpbmUnLCBrby5uYXRpdmVUZW1wbGF0ZUVuZ2luZSk7XG4oZnVuY3Rpb24oKSB7XG4gICAga28uanF1ZXJ5VG1wbFRlbXBsYXRlRW5naW5lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBEZXRlY3Qgd2hpY2ggdmVyc2lvbiBvZiBqcXVlcnktdG1wbCB5b3UncmUgdXNpbmcuIFVuZm9ydHVuYXRlbHkganF1ZXJ5LXRtcGxcbiAgICAgICAgLy8gZG9lc24ndCBleHBvc2UgYSB2ZXJzaW9uIG51bWJlciwgc28gd2UgaGF2ZSB0byBpbmZlciBpdC5cbiAgICAgICAgLy8gTm90ZSB0aGF0IGFzIG9mIEtub2Nrb3V0IDEuMywgd2Ugb25seSBzdXBwb3J0IGpRdWVyeS50bXBsIDEuMC4wcHJlIGFuZCBsYXRlcixcbiAgICAgICAgLy8gd2hpY2ggS08gaW50ZXJuYWxseSByZWZlcnMgdG8gYXMgdmVyc2lvbiBcIjJcIiwgc28gb2xkZXIgdmVyc2lvbnMgYXJlIG5vIGxvbmdlciBkZXRlY3RlZC5cbiAgICAgICAgdmFyIGpRdWVyeVRtcGxWZXJzaW9uID0gdGhpcy5qUXVlcnlUbXBsVmVyc2lvbiA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghalF1ZXJ5SW5zdGFuY2UgfHwgIShqUXVlcnlJbnN0YW5jZVsndG1wbCddKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIC8vIFNpbmNlIGl0IGV4cG9zZXMgbm8gb2ZmaWNpYWwgdmVyc2lvbiBudW1iZXIsIHdlIHVzZSBvdXIgb3duIG51bWJlcmluZyBzeXN0ZW0uIFRvIGJlIHVwZGF0ZWQgYXMganF1ZXJ5LXRtcGwgZXZvbHZlcy5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKGpRdWVyeUluc3RhbmNlWyd0bXBsJ11bJ3RhZyddWyd0bXBsJ11bJ29wZW4nXS50b1N0cmluZygpLmluZGV4T2YoJ19fJykgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBTaW5jZSAxLjAuMHByZSwgY3VzdG9tIHRhZ3Mgc2hvdWxkIGFwcGVuZCBtYXJrdXAgdG8gYW4gYXJyYXkgY2FsbGVkIFwiX19cIlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMjsgLy8gRmluYWwgdmVyc2lvbiBvZiBqcXVlcnkudG1wbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2goZXgpIHsgLyogQXBwYXJlbnRseSBub3QgdGhlIHZlcnNpb24gd2Ugd2VyZSBsb29raW5nIGZvciAqLyB9XG5cbiAgICAgICAgICAgIHJldHVybiAxOyAvLyBBbnkgb2xkZXIgdmVyc2lvbiB0aGF0IHdlIGRvbid0IHN1cHBvcnRcbiAgICAgICAgfSkoKTtcblxuICAgICAgICBmdW5jdGlvbiBlbnN1cmVIYXNSZWZlcmVuY2VkSlF1ZXJ5VGVtcGxhdGVzKCkge1xuICAgICAgICAgICAgaWYgKGpRdWVyeVRtcGxWZXJzaW9uIDwgMilcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJZb3VyIHZlcnNpb24gb2YgalF1ZXJ5LnRtcGwgaXMgdG9vIG9sZC4gUGxlYXNlIHVwZ3JhZGUgdG8galF1ZXJ5LnRtcGwgMS4wLjBwcmUgb3IgbGF0ZXIuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZXhlY3V0ZVRlbXBsYXRlKGNvbXBpbGVkVGVtcGxhdGUsIGRhdGEsIGpRdWVyeVRlbXBsYXRlT3B0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuIGpRdWVyeUluc3RhbmNlWyd0bXBsJ10oY29tcGlsZWRUZW1wbGF0ZSwgZGF0YSwgalF1ZXJ5VGVtcGxhdGVPcHRpb25zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXNbJ3JlbmRlclRlbXBsYXRlU291cmNlJ10gPSBmdW5jdGlvbih0ZW1wbGF0ZVNvdXJjZSwgYmluZGluZ0NvbnRleHQsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgICAgICAgZW5zdXJlSGFzUmVmZXJlbmNlZEpRdWVyeVRlbXBsYXRlcygpO1xuXG4gICAgICAgICAgICAvLyBFbnN1cmUgd2UgaGF2ZSBzdG9yZWQgYSBwcmVjb21waWxlZCB2ZXJzaW9uIG9mIHRoaXMgdGVtcGxhdGUgKGRvbid0IHdhbnQgdG8gcmVwYXJzZSBvbiBldmVyeSByZW5kZXIpXG4gICAgICAgICAgICB2YXIgcHJlY29tcGlsZWQgPSB0ZW1wbGF0ZVNvdXJjZVsnZGF0YSddKCdwcmVjb21waWxlZCcpO1xuICAgICAgICAgICAgaWYgKCFwcmVjb21waWxlZCkge1xuICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZVRleHQgPSB0ZW1wbGF0ZVNvdXJjZVsndGV4dCddKCkgfHwgXCJcIjtcbiAgICAgICAgICAgICAgICAvLyBXcmFwIGluIFwid2l0aCgkd2hhdGV2ZXIua29CaW5kaW5nQ29udGV4dCkgeyAuLi4gfVwiXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVUZXh0ID0gXCJ7e2tvX3dpdGggJGl0ZW0ua29CaW5kaW5nQ29udGV4dH19XCIgKyB0ZW1wbGF0ZVRleHQgKyBcInt7L2tvX3dpdGh9fVwiO1xuXG4gICAgICAgICAgICAgICAgcHJlY29tcGlsZWQgPSBqUXVlcnlJbnN0YW5jZVsndGVtcGxhdGUnXShudWxsLCB0ZW1wbGF0ZVRleHQpO1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlU291cmNlWydkYXRhJ10oJ3ByZWNvbXBpbGVkJywgcHJlY29tcGlsZWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZGF0YSA9IFtiaW5kaW5nQ29udGV4dFsnJGRhdGEnXV07IC8vIFByZXdyYXAgdGhlIGRhdGEgaW4gYW4gYXJyYXkgdG8gc3RvcCBqcXVlcnkudG1wbCBmcm9tIHRyeWluZyB0byB1bndyYXAgYW55IGFycmF5c1xuICAgICAgICAgICAgdmFyIGpRdWVyeVRlbXBsYXRlT3B0aW9ucyA9IGpRdWVyeUluc3RhbmNlWydleHRlbmQnXSh7ICdrb0JpbmRpbmdDb250ZXh0JzogYmluZGluZ0NvbnRleHQgfSwgb3B0aW9uc1sndGVtcGxhdGVPcHRpb25zJ10pO1xuXG4gICAgICAgICAgICB2YXIgcmVzdWx0Tm9kZXMgPSBleGVjdXRlVGVtcGxhdGUocHJlY29tcGlsZWQsIGRhdGEsIGpRdWVyeVRlbXBsYXRlT3B0aW9ucyk7XG4gICAgICAgICAgICByZXN1bHROb2Rlc1snYXBwZW5kVG8nXShkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKTsgLy8gVXNpbmcgXCJhcHBlbmRUb1wiIGZvcmNlcyBqUXVlcnkvalF1ZXJ5LnRtcGwgdG8gcGVyZm9ybSBuZWNlc3NhcnkgY2xlYW51cCB3b3JrXG5cbiAgICAgICAgICAgIGpRdWVyeUluc3RhbmNlWydmcmFnbWVudHMnXSA9IHt9OyAvLyBDbGVhciBqUXVlcnkncyBmcmFnbWVudCBjYWNoZSB0byBhdm9pZCBhIG1lbW9yeSBsZWFrIGFmdGVyIGEgbGFyZ2UgbnVtYmVyIG9mIHRlbXBsYXRlIHJlbmRlcnNcbiAgICAgICAgICAgIHJldHVybiByZXN1bHROb2RlcztcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzWydjcmVhdGVKYXZhU2NyaXB0RXZhbHVhdG9yQmxvY2snXSA9IGZ1bmN0aW9uKHNjcmlwdCkge1xuICAgICAgICAgICAgcmV0dXJuIFwie3trb19jb2RlICgoZnVuY3Rpb24oKSB7IHJldHVybiBcIiArIHNjcmlwdCArIFwiIH0pKCkpIH19XCI7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpc1snYWRkVGVtcGxhdGUnXSA9IGZ1bmN0aW9uKHRlbXBsYXRlTmFtZSwgdGVtcGxhdGVNYXJrdXApIHtcbiAgICAgICAgICAgIGRvY3VtZW50LndyaXRlKFwiPHNjcmlwdCB0eXBlPSd0ZXh0L2h0bWwnIGlkPSdcIiArIHRlbXBsYXRlTmFtZSArIFwiJz5cIiArIHRlbXBsYXRlTWFya3VwICsgXCI8XCIgKyBcIi9zY3JpcHQ+XCIpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChqUXVlcnlUbXBsVmVyc2lvbiA+IDApIHtcbiAgICAgICAgICAgIGpRdWVyeUluc3RhbmNlWyd0bXBsJ11bJ3RhZyddWydrb19jb2RlJ10gPSB7XG4gICAgICAgICAgICAgICAgb3BlbjogXCJfXy5wdXNoKCQxIHx8ICcnKTtcIlxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGpRdWVyeUluc3RhbmNlWyd0bXBsJ11bJ3RhZyddWydrb193aXRoJ10gPSB7XG4gICAgICAgICAgICAgICAgb3BlbjogXCJ3aXRoKCQxKSB7XCIsXG4gICAgICAgICAgICAgICAgY2xvc2U6IFwifSBcIlxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBrby5qcXVlcnlUbXBsVGVtcGxhdGVFbmdpbmUucHJvdG90eXBlID0gbmV3IGtvLnRlbXBsYXRlRW5naW5lKCk7XG4gICAga28uanF1ZXJ5VG1wbFRlbXBsYXRlRW5naW5lLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGtvLmpxdWVyeVRtcGxUZW1wbGF0ZUVuZ2luZTtcblxuICAgIC8vIFVzZSB0aGlzIG9uZSBieSBkZWZhdWx0ICpvbmx5IGlmIGpxdWVyeS50bXBsIGlzIHJlZmVyZW5jZWQqXG4gICAgdmFyIGpxdWVyeVRtcGxUZW1wbGF0ZUVuZ2luZUluc3RhbmNlID0gbmV3IGtvLmpxdWVyeVRtcGxUZW1wbGF0ZUVuZ2luZSgpO1xuICAgIGlmIChqcXVlcnlUbXBsVGVtcGxhdGVFbmdpbmVJbnN0YW5jZS5qUXVlcnlUbXBsVmVyc2lvbiA+IDApXG4gICAgICAgIGtvLnNldFRlbXBsYXRlRW5naW5lKGpxdWVyeVRtcGxUZW1wbGF0ZUVuZ2luZUluc3RhbmNlKTtcblxuICAgIGtvLmV4cG9ydFN5bWJvbCgnanF1ZXJ5VG1wbFRlbXBsYXRlRW5naW5lJywga28uanF1ZXJ5VG1wbFRlbXBsYXRlRW5naW5lKTtcbn0pKCk7XG59KSk7XG59KCkpO1xufSkoKTtcbiJdfQ==
