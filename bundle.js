(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
(function (global){
global.ko = require('knockout');
global.models = require('./models');

// extensions
ko.numericObservable = require('./extensions/numericObservable.js');

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./extensions/numericObservable.js":1,"./models":10,"knockout":15}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{"./billingMethods.js":3,"./invoiceGroups.js":5,"./priceMethods.js":6,"./products.js":7,"./serviceTypes.js":8,"./subscribersPackages.js":9}],5:[function(require,module,exports){
'use strict';

var groups = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (i) {
  return {
    name: 'Invoice ' + i,
  };
});

module.exports = groups;

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{"./products.js":7}],9:[function(require,module,exports){
'use strict';

var packages = [{
  name: 'New',
}, {
  name: 'Old',
}, {
  name: 'All',
}];

module.exports = packages;

},{}],10:[function(require,module,exports){
var ContractPremium = require('./premium');

module.exports = {
  ContractPremium: ContractPremium
};

},{"./premium":12}],11:[function(require,module,exports){
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
  self.invoiceGroup = ko.observable();
  self.priceMethod = ko.observable();
  self.serviceType = ko.observable();
  self.subscribersPackage = ko.observable();
  self.product = ko.observable();
  self.category = ko.observable();
  self.price = ko.numericObservable();
  self.ranges = ko.observableArray();
  self.defaultSubscribers = ko.numericObservable();
  self.currentRange = ko.observable();

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

  self.test = function(subscribers, retailPrice) {
    var range = getRangeFor(subscribers);
    var remaining = subscribers;
    var total = 0;
    var last;

    // just for visual help
    self.currentRange(range);

    if (billingMethod === billingMethods.flatFee) {
      total = self.price();
    }
    else if (billingMethod === billingMethods.revenueShare && range) {
      total = retailPrice * (range.percentage() / 100) * subscribers;
    }
    else if (billingMethod === billingMethods.actualSubscribers && range) {
      if (self.priceMethod() === priceMethods.range) {
        total = range.price() * subscribers;
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
      total: total,
      range: range,
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

},{"../config":4,"./range.js":14}],12:[function(require,module,exports){
(function (global){
'use strict';

var Month = require('./month.js');
var config = require('../config');

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

  // initial data
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (i) {
    return new Month(i, self);
  }).forEach(addMonth);

  if (global.localStorage && global.localStorage.data) {
    // its evalution baby!
    json = eval('(' + global.localStorage.data + ')');

    try
    {
      json.months.forEach(function (m) {
        var month = self.months()[m.number - 1];

        if (month) {
          month.initialize(m);
        }
      });
    }
    catch(err) {
      global.localStorage.clear();
    }
  }

  self.testResult = ko.computed(function () {
    if (self.demoMode()) {
      return self.months().map(function (m) {
        return m.testResult();
      }).reduce(function (a, b) {
        return (a || 0) + (b || 0);
      }, 0);
    }
  });

  function save() {
    var data = JSON.stringify({
      months: self.months().map(function (m) {
        return m.getMonthData();
      })
    });

    global.localStorage['data'] = data;
  }

  global.onbeforeunload = save;

  function addMonth(month) {
    self.months.push(month);
  }

  (function saveForever() {
    setInterval(function () {
      save();
      saveForever();
    }, 3000);
  })();
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../config":4,"./month.js":13}],13:[function(require,module,exports){
'use strict';

var Condition = require('./condition.js');
var ConditionRange = require('./range.js');
var config = require('../config');
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

module.exports = Month;

function Month(number, parent) {
  var self = this;
  var testSubscribers = 0;
  var testRetailPrice = 0;
  var get = config.getByName;

  self.name = months[number - 1];
  self.number = number > 9 ? '' + number : '0' + number;
  self.conditions = ko.observableArray();
  self.summaryCondition = ko.observable('lower');
  self.testSubscribers = ko.numericObservable();
  self.testRetailPrice = ko.numericObservable();

  ['testSubscribers', 'testRetailPrice'].forEach(function (f) {
    var temp;

    self[f].subscribe(function (value) {
      var ix = parent.months().indexOf(self);

      for (;ix < parent.months().length; ix++) {
        if (!parent.months()[ix][f]() || parent.months()[ix][f]() === temp) {
          parent.months()[ix][f](value);
        }
      }

      temp = value;
    });
  });

  self.testResult = ko.computed(function () {
    // test only if needed
    if (parent.demoMode()) {
      var condition = self.summaryCondition();
      var results = self.conditions().map(function (c) {
        return c.test(self.testSubscribers(), self.testRetailPrice());
      });
      var totals = results.map(function (r) { return r.total; });

      if (condition === 'lower') {
        return totals.sort(function (a, b) { return a - b; })[0];
      }
      else if (condition === 'higher') {
        return totals.sort(function (a, b) { return a - b; })[totals.length - 1];
      }
      else if (condition === 'average') {
        return totals.reduce(function (a, b) { return a + b; }, 0) / totals.length;
      }
    }
  });

  self.$last = ko.computed(function () {
    return parent.months()[parent.months().length - 1] === self;
  });

  self.newCondition = function(serviceType) {
    var condition = new Condition(serviceType, self);

    self.conditions.push(condition);
  };

  self.addCondition = function(condition) {
    var billingMethod = get(config.billingMethods, condition.billingMethod);
    var obj = new Condition(billingMethod, self, (condition.ranges && condition.ranges.length));

    obj.serviceType(get(config.serviceTypes, condition.serviceType));
    obj.subscribersPackage(get(config.subscribersPackages, condition.subscribersPackage));
    obj.price(condition.price);
    obj.priceMethod(get(config.priceMethods, condition.priceMethod));
    obj.invoiceGroup(get(config.invoiceGroups, condition.invoiceGroup));
    obj.product(get(config.products, condition.product));
    obj.category(condition.category);
    obj.defaultSubscribers(condition.defaultSubscribers);

    (condition.ranges || []).forEach(obj.addRange);

    self.conditions.push(obj);
  };

  self.copyFrom = function (month) {
    var data = month.getMonthData();

    self.initialize(data);
  };

  self.getMonthData = function () {
    return {
      conditions: self.conditions().map(function (c) {
        return {
          billingMethod: c.billingMethod.name,
          invoiceGroup: c.invoiceGroup() && c.invoiceGroup().name,
          priceMethod: c.priceMethod() && c.priceMethod().name,
          serviceType: c.serviceType() && c.serviceType().name,
          subscribersPackage: c.subscribersPackage() && c.subscribersPackage().name,
          product: c.product() && c.product().name,
          category: c.category(),
          price: c.price(),
          defaultSubscribers: c.defaultSubscribers(),
          ranges: c.ranges().map(function (r) {
            return {
              to: r.to(),
              price: r.price(),
              percentage: r.percentage(),
            };
          })
        };
      }),
      number: parseInt(self.number, 10),
      name: self.name,
      summaryCondition: self.summaryCondition(),
      testSubscribers: self.testSubscribers(),
      testRetailPrice: self.testRetailPrice(),
    };
  };

  self.initialize = function (data) {
    self.summaryCondition(data.summaryCondition);
    self.testSubscribers(data.testSubscribers);
    self.testRetailPrice(data.testRetailPrice);
    self.conditions([]);

    (data.conditions || []).forEach(self.addCondition);
  };
}

},{"../config":4,"./condition.js":11,"./range.js":14}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiZXh0ZW5zaW9uc1xcbnVtZXJpY09ic2VydmFibGUuanMiLCJtYWluLmpzIiwibW9kZWxzXFxjb25maWdcXGJpbGxpbmdNZXRob2RzLmpzIiwibW9kZWxzXFxjb25maWdcXGluZGV4LmpzIiwibW9kZWxzXFxjb25maWdcXGludm9pY2VHcm91cHMuanMiLCJtb2RlbHNcXGNvbmZpZ1xccHJpY2VNZXRob2RzLmpzIiwibW9kZWxzXFxjb25maWdcXHByb2R1Y3RzLmpzIiwibW9kZWxzXFxjb25maWdcXHNlcnZpY2VUeXBlcy5qcyIsIm1vZGVsc1xcY29uZmlnXFxzdWJzY3JpYmVyc1BhY2thZ2VzLmpzIiwibW9kZWxzXFxpbmRleC5qcyIsIm1vZGVsc1xccHJlbWl1bVxcY29uZGl0aW9uLmpzIiwibW9kZWxzXFxwcmVtaXVtXFxpbmRleC5qcyIsIm1vZGVsc1xccHJlbWl1bVxcbW9udGguanMiLCJtb2RlbHNcXHByZW1pdW1cXHJhbmdlLmpzIiwibm9kZV9tb2R1bGVzXFxrbm9ja291dFxcYnVpbGRcXG91dHB1dFxca25vY2tvdXQtbGF0ZXN0LmRlYnVnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG51bWVyaWNPYnNlcnZhYmxlO1xuXG5mdW5jdGlvbiBudW1lcmljT2JzZXJ2YWJsZShpbml0aWFsVmFsdWUpIHtcbiAgdmFyIF9hY3R1YWwgPSBrby5vYnNlcnZhYmxlKGluaXRpYWxWYWx1ZSk7XG5cbiAgdmFyIHJlc3VsdCA9IGtvLmNvbXB1dGVkKHtcbiAgICByZWFkOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfYWN0dWFsKCk7XG4gICAgfSxcbiAgICB3cml0ZTogZnVuY3Rpb24obmV3VmFsdWUpIHtcbiAgICAgIHZhciBwYXJzZWRWYWx1ZSA9IHBhcnNlRmxvYXQobmV3VmFsdWUpO1xuICAgICAgX2FjdHVhbChpc05hTihwYXJzZWRWYWx1ZSkgPyBuZXdWYWx1ZSA6IHBhcnNlZFZhbHVlKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG5nbG9iYWwua28gPSByZXF1aXJlKCdrbm9ja291dCcpO1xuZ2xvYmFsLm1vZGVscyA9IHJlcXVpcmUoJy4vbW9kZWxzJyk7XG5cbi8vIGV4dGVuc2lvbnNcbmtvLm51bWVyaWNPYnNlcnZhYmxlID0gcmVxdWlyZSgnLi9leHRlbnNpb25zL251bWVyaWNPYnNlcnZhYmxlLmpzJyk7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGZsYXRGZWU6IGNyZWF0ZU1ldGhvZCgnRmxhdCBGZWUnLCAnZmxhdC1mZWUnKSxcbiAgcmV2ZW51ZVNoYXJlOiBjcmVhdGVNZXRob2QoJ1JldmVudWUgU2hhcmUnLCAncmV2ZW51ZS1zaGFyZScpLFxuICBhY3R1YWxTdWJzY3JpYmVyczogY3JlYXRlTWV0aG9kKCdBY3R1YWwgU3Vic2NyaWJlcnMnLCAnYWN0dWFsLXN1YnNjcmliZXJzJywgdHJ1ZSksXG59O1xuXG5mdW5jdGlvbiBjcmVhdGVNZXRob2QobmFtZSwgdGVtcGxhdGUsIGlzQWN0dWFsU3Vic2NyaWJlcnMpIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBuYW1lLFxuICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgICBpc0FjdHVhbFN1YnNjcmliZXJzOiAhIWlzQWN0dWFsU3Vic2NyaWJlcnMsXG4gIH07XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiaWxsaW5nTWV0aG9kcyA9IHJlcXVpcmUoJy4vYmlsbGluZ01ldGhvZHMuanMnKTtcbnZhciBpbnZvaWNlR3JvdXBzID0gcmVxdWlyZSgnLi9pbnZvaWNlR3JvdXBzLmpzJyk7XG52YXIgcHJpY2VNZXRob2RzID0gcmVxdWlyZSgnLi9wcmljZU1ldGhvZHMuanMnKTtcbnZhciBwcm9kdWN0cyA9IHJlcXVpcmUoJy4vcHJvZHVjdHMuanMnKTtcbnZhciBzZXJ2aWNlVHlwZXMgPSByZXF1aXJlKCcuL3NlcnZpY2VUeXBlcy5qcycpO1xudmFyIHN1YnNjcmliZXJzUGFja2FnZXMgPSByZXF1aXJlKCcuL3N1YnNjcmliZXJzUGFja2FnZXMuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGJpbGxpbmdNZXRob2RzOiBiaWxsaW5nTWV0aG9kcyxcbiAgaW52b2ljZUdyb3VwczogaW52b2ljZUdyb3VwcyxcbiAgcHJpY2VNZXRob2RzOiBwcmljZU1ldGhvZHMsXG4gIHByb2R1Y3RzOiBwcm9kdWN0cyxcbiAgc2VydmljZVR5cGVzOiBzZXJ2aWNlVHlwZXMsXG4gIHN1YnNjcmliZXJzUGFja2FnZXM6IHN1YnNjcmliZXJzUGFja2FnZXMsXG4gIGdldEJ5TmFtZTogZ2V0QnlOYW1lLFxuICBnZXQ6IGdldFxufTtcblxuZnVuY3Rpb24gZ2V0QnlOYW1lKHR5cGUsIG5hbWUpIHtcbiAgcmV0dXJuIGdldCh0eXBlKS5maWx0ZXIoZnVuY3Rpb24gKGkpIHsgcmV0dXJuIGkubmFtZSA9PT0gbmFtZTsgfSlbMF07XG59XG5cbmZ1bmN0aW9uIGdldCh0eXBlKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyh0eXBlKS5tYXAoZnVuY3Rpb24gKGspIHsgcmV0dXJuIHR5cGVba107IH0pO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ3JvdXBzID0gWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwXS5tYXAoZnVuY3Rpb24gKGkpIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnSW52b2ljZSAnICsgaSxcbiAgfTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdyb3VwcztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHJhbmdlID0gY3JlYXRlTWV0aG9kKCdSYW5nZScpO1xudmFyIGluY3JlbWVudGFsID0gY3JlYXRlTWV0aG9kKCdJbmNyZW1lbnRhbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmFuZ2U6IHJhbmdlLFxuICBpbmNyZW1lbnRhbDogaW5jcmVtZW50YWwsXG59O1xuXG5mdW5jdGlvbiBjcmVhdGVNZXRob2QobmFtZSkge1xuICByZXR1cm4ge1xuICAgIG5hbWU6IG5hbWUsXG4gIH07XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBwcm9kdWN0cyA9IFt7XG4gIG5hbWU6ICdTaWduYWwgRm94IEhEJyxcbiAgdHlwZTogJ1NpZ25hbCcsXG59LCB7XG4gIG5hbWU6ICdTaWduYWwgRm94IExpZmUnLFxuICB0eXBlOiAnU2lnbmFsJyxcbn0sIHtcbiAgbmFtZTogJ1NpZ25hbCBGb3ggU3BvcnRzJyxcbiAgdHlwZTogJ1NpZ25hbCcsXG59LCB7XG4gIG5hbWU6ICdTaWduYWwgRm94IFNwb3J0cyAyJyxcbiAgdHlwZTogJ1NpZ25hbCcsXG59LCB7XG4gIG5hbWU6ICdTaWduYWwgRm94IFNwb3J0cyAyIEhEJyxcbiAgdHlwZTogJ1NpZ25hbCcsXG59LCB7XG4gIG5hbWU6ICdTaWduYWwgRm94IFNwb3J0cyBQcmVtaXVtJyxcbiAgdHlwZTogJ1NpZ25hbCcsXG59LCB7XG4gIG5hbWU6ICdTaWduYWwgRlgnLFxuICB0eXBlOiAnU2lnbmFsJyxcbn0sIHtcbiAgbmFtZTogJ1NpZ25hbCBGWCBIRCcsXG4gIHR5cGU6ICdTaWduYWwnLFxufSwge1xuICBuYW1lOiAnU2lnbmFsIE11bmRvIEZveCcsXG4gIHR5cGU6ICdTaWduYWwnLFxufSwge1xuICBuYW1lOiAnQ0YrTkcnLFxuICB0eXBlOiAnUGFja2FnZScsXG59LCB7XG4gIG5hbWU6ICdDRitORytGUycsXG4gIHR5cGU6ICdQYWNrYWdlJyxcbn0sIHtcbiAgbmFtZTogJ0NGK05HK0ZYK0ZTMytGTCcsXG4gIHR5cGU6ICdQYWNrYWdlJyxcbn0sIHtcbiAgbmFtZTogJ0ZTMytOR1cnLFxuICB0eXBlOiAnUGFja2FnZScsXG59LCB7XG4gIG5hbWU6ICdGTCtOR1crRlMzJyxcbiAgdHlwZTogJ1BhY2thZ2UnLFxufSwge1xuICBuYW1lOiAnU3lmeStVQycsXG4gIHR5cGU6ICdQYWNrYWdlJyxcbn0sIHtcbiAgbmFtZTogJ0ZTQitGUzInLFxuICB0eXBlOiAnUGFja2FnZScsXG59LCB7XG4gIG5hbWU6ICdDRitORytGUzMnLFxuICB0eXBlOiAnUGFja2FnZScsXG59LCB7XG4gIG5hbWU6ICdVVElMSVMrQ0YrTkcrRlgrRkwnLFxuICB0eXBlOiAnUGFja2FnZScsXG59XTtcblxubW9kdWxlLmV4cG9ydHMgPSBwcm9kdWN0cztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHByb2R1Y3RzID0gcmVxdWlyZSgnLi9wcm9kdWN0cy5qcycpO1xudmFyIHR5cGVzID0gW3tcbiAgbmFtZTogJ1NpZ25hbCcsXG59LCB7XG4gIG5hbWU6ICdQYWNrYWdlJyxcbn1dO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHR5cGVzLm1hcChmdW5jdGlvbiAodCkge1xuICB0LnByb2R1Y3RzID0gcHJvZHVjdHMuZmlsdGVyKGZ1bmN0aW9uIChwKSB7IHJldHVybiBwLnR5cGUgPT09IHQubmFtZTsgfSk7XG5cbiAgcmV0dXJuIHQ7XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHBhY2thZ2VzID0gW3tcbiAgbmFtZTogJ05ldycsXG59LCB7XG4gIG5hbWU6ICdPbGQnLFxufSwge1xuICBuYW1lOiAnQWxsJyxcbn1dO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHBhY2thZ2VzO1xuIiwidmFyIENvbnRyYWN0UHJlbWl1bSA9IHJlcXVpcmUoJy4vcHJlbWl1bScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQ29udHJhY3RQcmVtaXVtOiBDb250cmFjdFByZW1pdW1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiaWxsaW5nTWV0aG9kcyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpLmJpbGxpbmdNZXRob2RzO1xudmFyIHByaWNlTWV0aG9kcyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpLnByaWNlTWV0aG9kcztcbnZhciBDb25kaXRpb25SYW5nZSA9IHJlcXVpcmUoJy4vcmFuZ2UuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb25kaXRpb247XG5cbmZ1bmN0aW9uIENvbmRpdGlvbihiaWxsaW5nTWV0aG9kLCBwYXJlbnQsIHByZXZlbnRSYW5nZUluaXQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgc3Vic2NyaXB0aW9ucyA9IFtdO1xuICB2YXIgaXNTb3J0aW5nO1xuXG4gIHNlbGYuYmlsbGluZ01ldGhvZCA9IGJpbGxpbmdNZXRob2Q7XG4gIHNlbGYuaW52b2ljZUdyb3VwID0ga28ub2JzZXJ2YWJsZSgpO1xuICBzZWxmLnByaWNlTWV0aG9kID0ga28ub2JzZXJ2YWJsZSgpO1xuICBzZWxmLnNlcnZpY2VUeXBlID0ga28ub2JzZXJ2YWJsZSgpO1xuICBzZWxmLnN1YnNjcmliZXJzUGFja2FnZSA9IGtvLm9ic2VydmFibGUoKTtcbiAgc2VsZi5wcm9kdWN0ID0ga28ub2JzZXJ2YWJsZSgpO1xuICBzZWxmLmNhdGVnb3J5ID0ga28ub2JzZXJ2YWJsZSgpO1xuICBzZWxmLnByaWNlID0ga28ubnVtZXJpY09ic2VydmFibGUoKTtcbiAgc2VsZi5yYW5nZXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcbiAgc2VsZi5kZWZhdWx0U3Vic2NyaWJlcnMgPSBrby5udW1lcmljT2JzZXJ2YWJsZSgpO1xuICBzZWxmLmN1cnJlbnRSYW5nZSA9IGtvLm9ic2VydmFibGUoKTtcblxuICBzZWxmLnJhbmdlcy5zdWJzY3JpYmUoZnVuY3Rpb24gKCkge1xuICAgIHZhciBsYXN0UmFuZ2UgPSBzZWxmLnJhbmdlcygpW3NlbGYucmFuZ2VzKCkubGVuZ3RoIC0gMV07XG4gICAgZGlzcG9zZVN1YnNjcmlwdGlvbnMoKTtcbiAgICBzdWJzY3JpYmVSYW5nZShsYXN0UmFuZ2UpO1xuICAgIGlmICghaXNTb3J0aW5nKSB7XG4gICAgICBpc1NvcnRpbmcgPSB0cnVlO1xuICAgICAgc2VsZi5zb3J0KCk7XG4gICAgfVxuICB9KTtcblxuICBzZWxmLnNvcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlc3VsdCA9IHNlbGYucmFuZ2VzKClcbiAgICAgIC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIGlmICghYi50bygpKSB7XG4gICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFhLnRvKCkpIHtcbiAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gYS50bygpIC0gYi50bygpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHNlbGYucmFuZ2VzKHJlc3VsdCk7XG4gICAgaXNTb3J0aW5nID0gZmFsc2U7XG4gIH07XG5cbiAgc2VsZi5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlc3VsdCA9IHBhcmVudC5jb25kaXRpb25zKClcbiAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGMgIT09IHNlbGY7IH0pO1xuXG4gICAgcGFyZW50LmNvbmRpdGlvbnMocmVzdWx0KTtcbiAgfTtcblxuICBzZWxmLnRlc3QgPSBmdW5jdGlvbihzdWJzY3JpYmVycywgcmV0YWlsUHJpY2UpIHtcbiAgICB2YXIgcmFuZ2UgPSBnZXRSYW5nZUZvcihzdWJzY3JpYmVycyk7XG4gICAgdmFyIHJlbWFpbmluZyA9IHN1YnNjcmliZXJzO1xuICAgIHZhciB0b3RhbCA9IDA7XG4gICAgdmFyIGxhc3Q7XG5cbiAgICAvLyBqdXN0IGZvciB2aXN1YWwgaGVscFxuICAgIHNlbGYuY3VycmVudFJhbmdlKHJhbmdlKTtcblxuICAgIGlmIChiaWxsaW5nTWV0aG9kID09PSBiaWxsaW5nTWV0aG9kcy5mbGF0RmVlKSB7XG4gICAgICB0b3RhbCA9IHNlbGYucHJpY2UoKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoYmlsbGluZ01ldGhvZCA9PT0gYmlsbGluZ01ldGhvZHMucmV2ZW51ZVNoYXJlICYmIHJhbmdlKSB7XG4gICAgICB0b3RhbCA9IHJldGFpbFByaWNlICogKHJhbmdlLnBlcmNlbnRhZ2UoKSAvIDEwMCkgKiBzdWJzY3JpYmVycztcbiAgICB9XG4gICAgZWxzZSBpZiAoYmlsbGluZ01ldGhvZCA9PT0gYmlsbGluZ01ldGhvZHMuYWN0dWFsU3Vic2NyaWJlcnMgJiYgcmFuZ2UpIHtcbiAgICAgIGlmIChzZWxmLnByaWNlTWV0aG9kKCkgPT09IHByaWNlTWV0aG9kcy5yYW5nZSkge1xuICAgICAgICB0b3RhbCA9IHJhbmdlLnByaWNlKCkgKiBzdWJzY3JpYmVycztcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHNlbGYucHJpY2VNZXRob2QoKSA9PT0gcHJpY2VNZXRob2RzLmluY3JlbWVudGFsKSB7XG5cbiAgICAgICAgc2VsZi5yYW5nZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChyKSB7XG4gICAgICAgICAgdmFyIGxhc3RUbyA9IGxhc3QgPyBsYXN0LnRvKCkgOiAwO1xuXG4gICAgICAgICAgaWYgKHJlbWFpbmluZyAmJiByLnByaWNlKCkpIHtcbiAgICAgICAgICAgIGlmIChyLnRvKCkpIHtcbiAgICAgICAgICAgICAgcmVtYWluaW5nIC09IHIudG8oKSAtIGxhc3RUbztcblxuICAgICAgICAgICAgICBpZiAocmVtYWluaW5nID4gMCkge1xuICAgICAgICAgICAgICAgIHRvdGFsICs9IChyLnRvKCkgLSBsYXN0VG8pICogci5wcmljZSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRvdGFsICs9IChyLnRvKCkgLSBsYXN0VG8gKyByZW1haW5pbmcpICogci5wcmljZSgpO1xuICAgICAgICAgICAgICAgIHJlbWFpbmluZyA9IDA7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICB0b3RhbCArPSByZW1haW5pbmcgKiByLnByaWNlKCk7XG4gICAgICAgICAgICAgIHJlbWFpbmluZyA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGFzdCA9IHI7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB0b3RhbDogdG90YWwsXG4gICAgICByYW5nZTogcmFuZ2UsXG4gICAgfTtcbiAgfTtcblxuICBzZWxmLmFkZFJhbmdlID0gZnVuY3Rpb24gKGkpIHtcbiAgICB2YXIgcmFuZ2UgPSBuZXcgQ29uZGl0aW9uUmFuZ2Uoc2VsZik7XG5cbiAgICByYW5nZS50byhpLnRvKTtcbiAgICByYW5nZS5wcmljZShpLnByaWNlKTtcbiAgICByYW5nZS5wZXJjZW50YWdlKGkucGVyY2VudGFnZSk7XG5cbiAgICBzZWxmLnJhbmdlcy5wdXNoKHJhbmdlKTtcbiAgfTtcblxuICAhcHJldmVudFJhbmdlSW5pdCAmJiBpbml0aWFsaXplTmV3UmFuZ2UoKTtcblxuICBmdW5jdGlvbiBpbml0aWFsaXplTmV3UmFuZ2UoKSB7XG4gICAgc2VsZi5yYW5nZXMucHVzaChuZXcgQ29uZGl0aW9uUmFuZ2Uoc2VsZikpO1xuICB9XG5cbiAgZnVuY3Rpb24gc3Vic2NyaWJlUmFuZ2UocmFuZ2UpIHtcbiAgICBbXG4gICAgICAndG8nLFxuICAgIF0ubWFwKGZ1bmN0aW9uIChmKSB7XG4gICAgICByZXR1cm4gcmFuZ2VbZl0uc3Vic2NyaWJlKGFkZE5ld1JhbmdlKTtcbiAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChzKSB7XG4gICAgICBzdWJzY3JpcHRpb25zLnB1c2gocyk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRSYW5nZUZvcihzdWJzY3JpYmVycykge1xuICAgIHZhciByYW5nZTtcblxuICAgIHNlbGYucmFuZ2VzKCkuZm9yRWFjaChmdW5jdGlvbiAocikge1xuICAgICAgdmFyIGlzT25SYW5nZSA9IHIudG8oKSA+PSBzdWJzY3JpYmVycztcblxuICAgICAgaWYgKGlzT25SYW5nZSAmJiByLmlzSGlnaGVyVGhhbihyYW5nZSkpIHtcbiAgICAgICAgcmFuZ2UgPSByO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKCFyYW5nZSkge1xuICAgICAgcmFuZ2UgPSBzZWxmLnJhbmdlcygpLmZpbHRlcihmdW5jdGlvbiAocikge1xuICAgICAgICByZXR1cm4gKHIucHJpY2UoKSB8fCByLnBlcmNlbnRhZ2UoKSkgJiYgIXIudG8oKTtcbiAgICAgIH0pWzBdO1xuICAgIH1cblxuICAgIHJldHVybiByYW5nZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZE5ld1JhbmdlKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBkaXNwb3NlU3Vic2NyaXB0aW9ucygpO1xuICAgICAgaW5pdGlhbGl6ZU5ld1JhbmdlKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZGlzcG9zZVN1YnNjcmlwdGlvbnMoKSB7XG4gICAgc3Vic2NyaXB0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIHMuZGlzcG9zZSgpO1xuICAgICAgfSk7XG4gICAgc3Vic2NyaXB0aW9ucyA9IFtdO1xuICB9XG59XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBNb250aCA9IHJlcXVpcmUoJy4vbW9udGguanMnKTtcbnZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb250cmFjdFByZW1pdW07XG5cbmZ1bmN0aW9uIENvbnRyYWN0UHJlbWl1bSgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIganNvbjtcblxuICBzZWxmLmJpbGxpbmdNZXRob2RzID0gW2NvbmZpZy5iaWxsaW5nTWV0aG9kcy5mbGF0RmVlLCBjb25maWcuYmlsbGluZ01ldGhvZHMucmV2ZW51ZVNoYXJlLCBjb25maWcuYmlsbGluZ01ldGhvZHMuYWN0dWFsU3Vic2NyaWJlcnNdO1xuICBzZWxmLnByaWNlTWV0aG9kcyA9IFtjb25maWcucHJpY2VNZXRob2RzLnJhbmdlLCBjb25maWcucHJpY2VNZXRob2RzLmluY3JlbWVudGFsXTtcbiAgc2VsZi5pbnZvaWNlR3JvdXBzID0gY29uZmlnLmludm9pY2VHcm91cHM7XG4gIHNlbGYuc2VydmljZVR5cGVzID0gY29uZmlnLnNlcnZpY2VUeXBlcztcbiAgc2VsZi5zdWJzY3JpYmVyc1BhY2thZ2VzID0gY29uZmlnLnN1YnNjcmliZXJzUGFja2FnZXM7XG4gIHNlbGYubW9udGhzID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XG4gIHNlbGYuc2VsZWN0ZWRDb25kaXRpb24gPSBrby5vYnNlcnZhYmxlKCk7XG4gIHNlbGYuZGVtb01vZGUgPSBrby5vYnNlcnZhYmxlKCk7XG5cbiAgLy8gaW5pdGlhbCBkYXRhXG4gIFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgMTEsIDEyXS5tYXAoZnVuY3Rpb24gKGkpIHtcbiAgICByZXR1cm4gbmV3IE1vbnRoKGksIHNlbGYpO1xuICB9KS5mb3JFYWNoKGFkZE1vbnRoKTtcblxuICBpZiAoZ2xvYmFsLmxvY2FsU3RvcmFnZSAmJiBnbG9iYWwubG9jYWxTdG9yYWdlLmRhdGEpIHtcbiAgICAvLyBpdHMgZXZhbHV0aW9uIGJhYnkhXG4gICAganNvbiA9IGV2YWwoJygnICsgZ2xvYmFsLmxvY2FsU3RvcmFnZS5kYXRhICsgJyknKTtcblxuICAgIHRyeVxuICAgIHtcbiAgICAgIGpzb24ubW9udGhzLmZvckVhY2goZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgdmFyIG1vbnRoID0gc2VsZi5tb250aHMoKVttLm51bWJlciAtIDFdO1xuXG4gICAgICAgIGlmIChtb250aCkge1xuICAgICAgICAgIG1vbnRoLmluaXRpYWxpemUobSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBjYXRjaChlcnIpIHtcbiAgICAgIGdsb2JhbC5sb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbiAgICB9XG4gIH1cblxuICBzZWxmLnRlc3RSZXN1bHQgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHNlbGYuZGVtb01vZGUoKSkge1xuICAgICAgcmV0dXJuIHNlbGYubW9udGhzKCkubWFwKGZ1bmN0aW9uIChtKSB7XG4gICAgICAgIHJldHVybiBtLnRlc3RSZXN1bHQoKTtcbiAgICAgIH0pLnJlZHVjZShmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICByZXR1cm4gKGEgfHwgMCkgKyAoYiB8fCAwKTtcbiAgICAgIH0sIDApO1xuICAgIH1cbiAgfSk7XG5cbiAgZnVuY3Rpb24gc2F2ZSgpIHtcbiAgICB2YXIgZGF0YSA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIG1vbnRoczogc2VsZi5tb250aHMoKS5tYXAoZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgcmV0dXJuIG0uZ2V0TW9udGhEYXRhKCk7XG4gICAgICB9KVxuICAgIH0pO1xuXG4gICAgZ2xvYmFsLmxvY2FsU3RvcmFnZVsnZGF0YSddID0gZGF0YTtcbiAgfVxuXG4gIGdsb2JhbC5vbmJlZm9yZXVubG9hZCA9IHNhdmU7XG5cbiAgZnVuY3Rpb24gYWRkTW9udGgobW9udGgpIHtcbiAgICBzZWxmLm1vbnRocy5wdXNoKG1vbnRoKTtcbiAgfVxuXG4gIChmdW5jdGlvbiBzYXZlRm9yZXZlcigpIHtcbiAgICBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICBzYXZlKCk7XG4gICAgICBzYXZlRm9yZXZlcigpO1xuICAgIH0sIDMwMDApO1xuICB9KSgpO1xufVxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBDb25kaXRpb24gPSByZXF1aXJlKCcuL2NvbmRpdGlvbi5qcycpO1xudmFyIENvbmRpdGlvblJhbmdlID0gcmVxdWlyZSgnLi9yYW5nZS5qcycpO1xudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpO1xudmFyIG1vbnRocyA9IFsnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsICdKdWx5JywgJ0F1Z3VzdCcsICdTZXB0ZW1iZXInLCAnT2N0b2JlcicsICdOb3ZlbWJlcicsICdEZWNlbWJlciddO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1vbnRoO1xuXG5mdW5jdGlvbiBNb250aChudW1iZXIsIHBhcmVudCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciB0ZXN0U3Vic2NyaWJlcnMgPSAwO1xuICB2YXIgdGVzdFJldGFpbFByaWNlID0gMDtcbiAgdmFyIGdldCA9IGNvbmZpZy5nZXRCeU5hbWU7XG5cbiAgc2VsZi5uYW1lID0gbW9udGhzW251bWJlciAtIDFdO1xuICBzZWxmLm51bWJlciA9IG51bWJlciA+IDkgPyAnJyArIG51bWJlciA6ICcwJyArIG51bWJlcjtcbiAgc2VsZi5jb25kaXRpb25zID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XG4gIHNlbGYuc3VtbWFyeUNvbmRpdGlvbiA9IGtvLm9ic2VydmFibGUoJ2xvd2VyJyk7XG4gIHNlbGYudGVzdFN1YnNjcmliZXJzID0ga28ubnVtZXJpY09ic2VydmFibGUoKTtcbiAgc2VsZi50ZXN0UmV0YWlsUHJpY2UgPSBrby5udW1lcmljT2JzZXJ2YWJsZSgpO1xuXG4gIFsndGVzdFN1YnNjcmliZXJzJywgJ3Rlc3RSZXRhaWxQcmljZSddLmZvckVhY2goZnVuY3Rpb24gKGYpIHtcbiAgICB2YXIgdGVtcDtcblxuICAgIHNlbGZbZl0uc3Vic2NyaWJlKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgdmFyIGl4ID0gcGFyZW50Lm1vbnRocygpLmluZGV4T2Yoc2VsZik7XG5cbiAgICAgIGZvciAoO2l4IDwgcGFyZW50Lm1vbnRocygpLmxlbmd0aDsgaXgrKykge1xuICAgICAgICBpZiAoIXBhcmVudC5tb250aHMoKVtpeF1bZl0oKSB8fCBwYXJlbnQubW9udGhzKClbaXhdW2ZdKCkgPT09IHRlbXApIHtcbiAgICAgICAgICBwYXJlbnQubW9udGhzKClbaXhdW2ZdKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0ZW1wID0gdmFsdWU7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHNlbGYudGVzdFJlc3VsdCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcbiAgICAvLyB0ZXN0IG9ubHkgaWYgbmVlZGVkXG4gICAgaWYgKHBhcmVudC5kZW1vTW9kZSgpKSB7XG4gICAgICB2YXIgY29uZGl0aW9uID0gc2VsZi5zdW1tYXJ5Q29uZGl0aW9uKCk7XG4gICAgICB2YXIgcmVzdWx0cyA9IHNlbGYuY29uZGl0aW9ucygpLm1hcChmdW5jdGlvbiAoYykge1xuICAgICAgICByZXR1cm4gYy50ZXN0KHNlbGYudGVzdFN1YnNjcmliZXJzKCksIHNlbGYudGVzdFJldGFpbFByaWNlKCkpO1xuICAgICAgfSk7XG4gICAgICB2YXIgdG90YWxzID0gcmVzdWx0cy5tYXAoZnVuY3Rpb24gKHIpIHsgcmV0dXJuIHIudG90YWw7IH0pO1xuXG4gICAgICBpZiAoY29uZGl0aW9uID09PSAnbG93ZXInKSB7XG4gICAgICAgIHJldHVybiB0b3RhbHMuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYSAtIGI7IH0pWzBdO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoY29uZGl0aW9uID09PSAnaGlnaGVyJykge1xuICAgICAgICByZXR1cm4gdG90YWxzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGEgLSBiOyB9KVt0b3RhbHMubGVuZ3RoIC0gMV07XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChjb25kaXRpb24gPT09ICdhdmVyYWdlJykge1xuICAgICAgICByZXR1cm4gdG90YWxzLnJlZHVjZShmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYSArIGI7IH0sIDApIC8gdG90YWxzLmxlbmd0aDtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHNlbGYuJGxhc3QgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHBhcmVudC5tb250aHMoKVtwYXJlbnQubW9udGhzKCkubGVuZ3RoIC0gMV0gPT09IHNlbGY7XG4gIH0pO1xuXG4gIHNlbGYubmV3Q29uZGl0aW9uID0gZnVuY3Rpb24oc2VydmljZVR5cGUpIHtcbiAgICB2YXIgY29uZGl0aW9uID0gbmV3IENvbmRpdGlvbihzZXJ2aWNlVHlwZSwgc2VsZik7XG5cbiAgICBzZWxmLmNvbmRpdGlvbnMucHVzaChjb25kaXRpb24pO1xuICB9O1xuXG4gIHNlbGYuYWRkQ29uZGl0aW9uID0gZnVuY3Rpb24oY29uZGl0aW9uKSB7XG4gICAgdmFyIGJpbGxpbmdNZXRob2QgPSBnZXQoY29uZmlnLmJpbGxpbmdNZXRob2RzLCBjb25kaXRpb24uYmlsbGluZ01ldGhvZCk7XG4gICAgdmFyIG9iaiA9IG5ldyBDb25kaXRpb24oYmlsbGluZ01ldGhvZCwgc2VsZiwgKGNvbmRpdGlvbi5yYW5nZXMgJiYgY29uZGl0aW9uLnJhbmdlcy5sZW5ndGgpKTtcblxuICAgIG9iai5zZXJ2aWNlVHlwZShnZXQoY29uZmlnLnNlcnZpY2VUeXBlcywgY29uZGl0aW9uLnNlcnZpY2VUeXBlKSk7XG4gICAgb2JqLnN1YnNjcmliZXJzUGFja2FnZShnZXQoY29uZmlnLnN1YnNjcmliZXJzUGFja2FnZXMsIGNvbmRpdGlvbi5zdWJzY3JpYmVyc1BhY2thZ2UpKTtcbiAgICBvYmoucHJpY2UoY29uZGl0aW9uLnByaWNlKTtcbiAgICBvYmoucHJpY2VNZXRob2QoZ2V0KGNvbmZpZy5wcmljZU1ldGhvZHMsIGNvbmRpdGlvbi5wcmljZU1ldGhvZCkpO1xuICAgIG9iai5pbnZvaWNlR3JvdXAoZ2V0KGNvbmZpZy5pbnZvaWNlR3JvdXBzLCBjb25kaXRpb24uaW52b2ljZUdyb3VwKSk7XG4gICAgb2JqLnByb2R1Y3QoZ2V0KGNvbmZpZy5wcm9kdWN0cywgY29uZGl0aW9uLnByb2R1Y3QpKTtcbiAgICBvYmouY2F0ZWdvcnkoY29uZGl0aW9uLmNhdGVnb3J5KTtcbiAgICBvYmouZGVmYXVsdFN1YnNjcmliZXJzKGNvbmRpdGlvbi5kZWZhdWx0U3Vic2NyaWJlcnMpO1xuXG4gICAgKGNvbmRpdGlvbi5yYW5nZXMgfHwgW10pLmZvckVhY2gob2JqLmFkZFJhbmdlKTtcblxuICAgIHNlbGYuY29uZGl0aW9ucy5wdXNoKG9iaik7XG4gIH07XG5cbiAgc2VsZi5jb3B5RnJvbSA9IGZ1bmN0aW9uIChtb250aCkge1xuICAgIHZhciBkYXRhID0gbW9udGguZ2V0TW9udGhEYXRhKCk7XG5cbiAgICBzZWxmLmluaXRpYWxpemUoZGF0YSk7XG4gIH07XG5cbiAgc2VsZi5nZXRNb250aERhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmRpdGlvbnM6IHNlbGYuY29uZGl0aW9ucygpLm1hcChmdW5jdGlvbiAoYykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGJpbGxpbmdNZXRob2Q6IGMuYmlsbGluZ01ldGhvZC5uYW1lLFxuICAgICAgICAgIGludm9pY2VHcm91cDogYy5pbnZvaWNlR3JvdXAoKSAmJiBjLmludm9pY2VHcm91cCgpLm5hbWUsXG4gICAgICAgICAgcHJpY2VNZXRob2Q6IGMucHJpY2VNZXRob2QoKSAmJiBjLnByaWNlTWV0aG9kKCkubmFtZSxcbiAgICAgICAgICBzZXJ2aWNlVHlwZTogYy5zZXJ2aWNlVHlwZSgpICYmIGMuc2VydmljZVR5cGUoKS5uYW1lLFxuICAgICAgICAgIHN1YnNjcmliZXJzUGFja2FnZTogYy5zdWJzY3JpYmVyc1BhY2thZ2UoKSAmJiBjLnN1YnNjcmliZXJzUGFja2FnZSgpLm5hbWUsXG4gICAgICAgICAgcHJvZHVjdDogYy5wcm9kdWN0KCkgJiYgYy5wcm9kdWN0KCkubmFtZSxcbiAgICAgICAgICBjYXRlZ29yeTogYy5jYXRlZ29yeSgpLFxuICAgICAgICAgIHByaWNlOiBjLnByaWNlKCksXG4gICAgICAgICAgZGVmYXVsdFN1YnNjcmliZXJzOiBjLmRlZmF1bHRTdWJzY3JpYmVycygpLFxuICAgICAgICAgIHJhbmdlczogYy5yYW5nZXMoKS5tYXAoZnVuY3Rpb24gKHIpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHRvOiByLnRvKCksXG4gICAgICAgICAgICAgIHByaWNlOiByLnByaWNlKCksXG4gICAgICAgICAgICAgIHBlcmNlbnRhZ2U6IHIucGVyY2VudGFnZSgpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KVxuICAgICAgICB9O1xuICAgICAgfSksXG4gICAgICBudW1iZXI6IHBhcnNlSW50KHNlbGYubnVtYmVyLCAxMCksXG4gICAgICBuYW1lOiBzZWxmLm5hbWUsXG4gICAgICBzdW1tYXJ5Q29uZGl0aW9uOiBzZWxmLnN1bW1hcnlDb25kaXRpb24oKSxcbiAgICAgIHRlc3RTdWJzY3JpYmVyczogc2VsZi50ZXN0U3Vic2NyaWJlcnMoKSxcbiAgICAgIHRlc3RSZXRhaWxQcmljZTogc2VsZi50ZXN0UmV0YWlsUHJpY2UoKSxcbiAgICB9O1xuICB9O1xuXG4gIHNlbGYuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgc2VsZi5zdW1tYXJ5Q29uZGl0aW9uKGRhdGEuc3VtbWFyeUNvbmRpdGlvbik7XG4gICAgc2VsZi50ZXN0U3Vic2NyaWJlcnMoZGF0YS50ZXN0U3Vic2NyaWJlcnMpO1xuICAgIHNlbGYudGVzdFJldGFpbFByaWNlKGRhdGEudGVzdFJldGFpbFByaWNlKTtcbiAgICBzZWxmLmNvbmRpdGlvbnMoW10pO1xuXG4gICAgKGRhdGEuY29uZGl0aW9ucyB8fCBbXSkuZm9yRWFjaChzZWxmLmFkZENvbmRpdGlvbik7XG4gIH07XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gQ29uZGl0aW9uUmFuZ2U7XG5cbmZ1bmN0aW9uIENvbmRpdGlvblJhbmdlKHBhcmVudCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgc2VsZi50byA9IGtvLm51bWVyaWNPYnNlcnZhYmxlKCk7XG4gIHNlbGYucHJpY2UgPSBrby5udW1lcmljT2JzZXJ2YWJsZSgpO1xuICBzZWxmLnBlcmNlbnRhZ2UgPSBrby5udW1lcmljT2JzZXJ2YWJsZSgpO1xuXG4gIHNlbGYucmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBpc0xhc3QgPSBzZWxmID09PSBwYXJlbnQucmFuZ2VzKClbcGFyZW50LnJhbmdlcygpLmxlbmd0aCAtIDFdO1xuICAgIHZhciBpc0Fub3RoZXJJbmZpbml0eSA9IHBhcmVudC5yYW5nZXMoKS5maWx0ZXIoZnVuY3Rpb24gKHIpIHsgcmV0dXJuIHIgIT09IHNlbGYgJiYgIXIudG8oKTsgfSkubGVuZ3RoO1xuXG4gICAgaWYgKChwYXJlbnQucmFuZ2VzKCkubGVuZ3RoID4gMSAmJiAhaXNMYXN0KSB8fCBpc0Fub3RoZXJJbmZpbml0eSkge1xuICAgICAgdmFyIHJlc3VsdCA9IHBhcmVudC5yYW5nZXMoKVxuICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChyKSB7IHJldHVybiByICE9PSBzZWxmOyB9KTtcbiAgICAgIHBhcmVudC5yYW5nZXMocmVzdWx0KTtcbiAgICB9XG4gIH07XG5cbiAgc2VsZi4kbGFzdCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gcGFyZW50LnJhbmdlcygpW3BhcmVudC5yYW5nZXMoKS5sZW5ndGggLSAxXSA9PT0gc2VsZjtcbiAgfSk7XG5cbiAgW3NlbGYudG8sIHNlbGYucHJpY2UsIHNlbGYucGVyY2VudGFnZV0uZm9yRWFjaChmdW5jdGlvbiAoZikge1xuICAgIGYuc3Vic2NyaWJlKGZ1bmN0aW9uICh2KSB7XG4gICAgICBpZiAoIXNlbGYudG8oKSAmJiAhc2VsZi5wcmljZSgpICYmICFzZWxmLnBlcmNlbnRhZ2UoKSkge1xuICAgICAgICBzZWxmLnJlbW92ZSgpO1xuICAgICAgfVxuICAgICAgaWYgKCFzZWxmLnRvKCkgJiYgIXNlbGYuJGxhc3QoKSAmJiBwYXJlbnQucmFuZ2VzKCkubGVuZ3RoKSB7XG4gICAgICAgIHBhcmVudC5yYW5nZXMoKVtwYXJlbnQucmFuZ2VzKCkubGVuZ3RoIC0gMV0ucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHNlbGYuaXNIaWdoZXJUaGFuID0gZnVuY3Rpb24gKHIpIHtcbiAgICByZXR1cm4gIXIgfHwgKHNlbGYudG8oKSA8IHIudG8oKSk7XG4gIH07XG59XG4iLCIvKiFcbiAqIEtub2Nrb3V0IEphdmFTY3JpcHQgbGlicmFyeSB2My4yLjBcbiAqIChjKSBTdGV2ZW4gU2FuZGVyc29uIC0gaHR0cDovL2tub2Nrb3V0anMuY29tL1xuICogTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiAqL1xuXG4oZnVuY3Rpb24oKXtcbnZhciBERUJVRz10cnVlO1xuKGZ1bmN0aW9uKHVuZGVmaW5lZCl7XG4gICAgLy8gKDAsIGV2YWwpKCd0aGlzJykgaXMgYSByb2J1c3Qgd2F5IG9mIGdldHRpbmcgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3RcbiAgICAvLyBGb3IgZGV0YWlscywgc2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTQxMTk5ODgvcmV0dXJuLXRoaXMtMC1ldmFsdGhpcy8xNDEyMDAyMyMxNDEyMDAyM1xuICAgIHZhciB3aW5kb3cgPSB0aGlzIHx8ICgwLCBldmFsKSgndGhpcycpLFxuICAgICAgICBkb2N1bWVudCA9IHdpbmRvd1snZG9jdW1lbnQnXSxcbiAgICAgICAgbmF2aWdhdG9yID0gd2luZG93WyduYXZpZ2F0b3InXSxcbiAgICAgICAgalF1ZXJ5SW5zdGFuY2UgPSB3aW5kb3dbXCJqUXVlcnlcIl0sXG4gICAgICAgIEpTT04gPSB3aW5kb3dbXCJKU09OXCJdO1xuKGZ1bmN0aW9uKGZhY3RvcnkpIHtcbiAgICAvLyBTdXBwb3J0IHRocmVlIG1vZHVsZSBsb2FkaW5nIHNjZW5hcmlvc1xuICAgIGlmICh0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgLy8gWzFdIENvbW1vbkpTL05vZGUuanNcbiAgICAgICAgdmFyIHRhcmdldCA9IG1vZHVsZVsnZXhwb3J0cyddIHx8IGV4cG9ydHM7IC8vIG1vZHVsZS5leHBvcnRzIGlzIGZvciBOb2RlLmpzXG4gICAgICAgIGZhY3RvcnkodGFyZ2V0LCByZXF1aXJlKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lWydhbWQnXSkge1xuICAgICAgICAvLyBbMl0gQU1EIGFub255bW91cyBtb2R1bGVcbiAgICAgICAgZGVmaW5lKFsnZXhwb3J0cycsICdyZXF1aXJlJ10sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFszXSBObyBtb2R1bGUgbG9hZGVyIChwbGFpbiA8c2NyaXB0PiB0YWcpIC0gcHV0IGRpcmVjdGx5IGluIGdsb2JhbCBuYW1lc3BhY2VcbiAgICAgICAgZmFjdG9yeSh3aW5kb3dbJ2tvJ10gPSB7fSk7XG4gICAgfVxufShmdW5jdGlvbihrb0V4cG9ydHMsIHJlcXVpcmUpe1xuLy8gSW50ZXJuYWxseSwgYWxsIEtPIG9iamVjdHMgYXJlIGF0dGFjaGVkIHRvIGtvRXhwb3J0cyAoZXZlbiB0aGUgbm9uLWV4cG9ydGVkIG9uZXMgd2hvc2UgbmFtZXMgd2lsbCBiZSBtaW5pZmllZCBieSB0aGUgY2xvc3VyZSBjb21waWxlcikuXG4vLyBJbiB0aGUgZnV0dXJlLCB0aGUgZm9sbG93aW5nIFwia29cIiB2YXJpYWJsZSBtYXkgYmUgbWFkZSBkaXN0aW5jdCBmcm9tIFwia29FeHBvcnRzXCIgc28gdGhhdCBwcml2YXRlIG9iamVjdHMgYXJlIG5vdCBleHRlcm5hbGx5IHJlYWNoYWJsZS5cbnZhciBrbyA9IHR5cGVvZiBrb0V4cG9ydHMgIT09ICd1bmRlZmluZWQnID8ga29FeHBvcnRzIDoge307XG4vLyBHb29nbGUgQ2xvc3VyZSBDb21waWxlciBoZWxwZXJzICh1c2VkIG9ubHkgdG8gbWFrZSB0aGUgbWluaWZpZWQgZmlsZSBzbWFsbGVyKVxua28uZXhwb3J0U3ltYm9sID0gZnVuY3Rpb24oa29QYXRoLCBvYmplY3QpIHtcbiAgICB2YXIgdG9rZW5zID0ga29QYXRoLnNwbGl0KFwiLlwiKTtcblxuICAgIC8vIEluIHRoZSBmdXR1cmUsIFwia29cIiBtYXkgYmVjb21lIGRpc3RpbmN0IGZyb20gXCJrb0V4cG9ydHNcIiAoc28gdGhhdCBub24tZXhwb3J0ZWQgb2JqZWN0cyBhcmUgbm90IHJlYWNoYWJsZSlcbiAgICAvLyBBdCB0aGF0IHBvaW50LCBcInRhcmdldFwiIHdvdWxkIGJlIHNldCB0bzogKHR5cGVvZiBrb0V4cG9ydHMgIT09IFwidW5kZWZpbmVkXCIgPyBrb0V4cG9ydHMgOiBrbylcbiAgICB2YXIgdGFyZ2V0ID0ga287XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRva2Vucy5sZW5ndGggLSAxOyBpKyspXG4gICAgICAgIHRhcmdldCA9IHRhcmdldFt0b2tlbnNbaV1dO1xuICAgIHRhcmdldFt0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdXSA9IG9iamVjdDtcbn07XG5rby5leHBvcnRQcm9wZXJ0eSA9IGZ1bmN0aW9uKG93bmVyLCBwdWJsaWNOYW1lLCBvYmplY3QpIHtcbiAgICBvd25lcltwdWJsaWNOYW1lXSA9IG9iamVjdDtcbn07XG5rby52ZXJzaW9uID0gXCIzLjIuMFwiO1xuXG5rby5leHBvcnRTeW1ib2woJ3ZlcnNpb24nLCBrby52ZXJzaW9uKTtcbmtvLnV0aWxzID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBvYmplY3RGb3JFYWNoKG9iaiwgYWN0aW9uKSB7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgICAgICAgYWN0aW9uKHByb3AsIG9ialtwcm9wXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleHRlbmQodGFyZ2V0LCBzb3VyY2UpIHtcbiAgICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICAgICAgZm9yKHZhciBwcm9wIGluIHNvdXJjZSkge1xuICAgICAgICAgICAgICAgIGlmKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0UHJvdG90eXBlT2Yob2JqLCBwcm90bykge1xuICAgICAgICBvYmouX19wcm90b19fID0gcHJvdG87XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuXG4gICAgdmFyIGNhblNldFByb3RvdHlwZSA9ICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5KTtcblxuICAgIC8vIFJlcHJlc2VudCB0aGUga25vd24gZXZlbnQgdHlwZXMgaW4gYSBjb21wYWN0IHdheSwgdGhlbiBhdCBydW50aW1lIHRyYW5zZm9ybSBpdCBpbnRvIGEgaGFzaCB3aXRoIGV2ZW50IG5hbWUgYXMga2V5IChmb3IgZmFzdCBsb29rdXApXG4gICAgdmFyIGtub3duRXZlbnRzID0ge30sIGtub3duRXZlbnRUeXBlc0J5RXZlbnROYW1lID0ge307XG4gICAgdmFyIGtleUV2ZW50VHlwZU5hbWUgPSAobmF2aWdhdG9yICYmIC9GaXJlZm94XFwvMi9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpID8gJ0tleWJvYXJkRXZlbnQnIDogJ1VJRXZlbnRzJztcbiAgICBrbm93bkV2ZW50c1trZXlFdmVudFR5cGVOYW1lXSA9IFsna2V5dXAnLCAna2V5ZG93bicsICdrZXlwcmVzcyddO1xuICAgIGtub3duRXZlbnRzWydNb3VzZUV2ZW50cyddID0gWydjbGljaycsICdkYmxjbGljaycsICdtb3VzZWRvd24nLCAnbW91c2V1cCcsICdtb3VzZW1vdmUnLCAnbW91c2VvdmVyJywgJ21vdXNlb3V0JywgJ21vdXNlZW50ZXInLCAnbW91c2VsZWF2ZSddO1xuICAgIG9iamVjdEZvckVhY2goa25vd25FdmVudHMsIGZ1bmN0aW9uKGV2ZW50VHlwZSwga25vd25FdmVudHNGb3JUeXBlKSB7XG4gICAgICAgIGlmIChrbm93bkV2ZW50c0ZvclR5cGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IGtub3duRXZlbnRzRm9yVHlwZS5sZW5ndGg7IGkgPCBqOyBpKyspXG4gICAgICAgICAgICAgICAga25vd25FdmVudFR5cGVzQnlFdmVudE5hbWVba25vd25FdmVudHNGb3JUeXBlW2ldXSA9IGV2ZW50VHlwZTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBldmVudHNUaGF0TXVzdEJlUmVnaXN0ZXJlZFVzaW5nQXR0YWNoRXZlbnQgPSB7ICdwcm9wZXJ0eWNoYW5nZSc6IHRydWUgfTsgLy8gV29ya2Fyb3VuZCBmb3IgYW4gSUU5IGlzc3VlIC0gaHR0cHM6Ly9naXRodWIuY29tL1N0ZXZlU2FuZGVyc29uL2tub2Nrb3V0L2lzc3Vlcy80MDZcblxuICAgIC8vIERldGVjdCBJRSB2ZXJzaW9ucyBmb3IgYnVnIHdvcmthcm91bmRzICh1c2VzIElFIGNvbmRpdGlvbmFscywgbm90IFVBIHN0cmluZywgZm9yIHJvYnVzdG5lc3MpXG4gICAgLy8gTm90ZSB0aGF0LCBzaW5jZSBJRSAxMCBkb2VzIG5vdCBzdXBwb3J0IGNvbmRpdGlvbmFsIGNvbW1lbnRzLCB0aGUgZm9sbG93aW5nIGxvZ2ljIG9ubHkgZGV0ZWN0cyBJRSA8IDEwLlxuICAgIC8vIEN1cnJlbnRseSB0aGlzIGlzIGJ5IGRlc2lnbiwgc2luY2UgSUUgMTArIGJlaGF2ZXMgY29ycmVjdGx5IHdoZW4gdHJlYXRlZCBhcyBhIHN0YW5kYXJkIGJyb3dzZXIuXG4gICAgLy8gSWYgdGhlcmUgaXMgYSBmdXR1cmUgbmVlZCB0byBkZXRlY3Qgc3BlY2lmaWMgdmVyc2lvbnMgb2YgSUUxMCssIHdlIHdpbGwgYW1lbmQgdGhpcy5cbiAgICB2YXIgaWVWZXJzaW9uID0gZG9jdW1lbnQgJiYgKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmVyc2lvbiA9IDMsIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLCBpRWxlbXMgPSBkaXYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2knKTtcblxuICAgICAgICAvLyBLZWVwIGNvbnN0cnVjdGluZyBjb25kaXRpb25hbCBIVE1MIGJsb2NrcyB1bnRpbCB3ZSBoaXQgb25lIHRoYXQgcmVzb2x2ZXMgdG8gYW4gZW1wdHkgZnJhZ21lbnRcbiAgICAgICAgd2hpbGUgKFxuICAgICAgICAgICAgZGl2LmlubmVySFRNTCA9ICc8IS0tW2lmIGd0IElFICcgKyAoKyt2ZXJzaW9uKSArICddPjxpPjwvaT48IVtlbmRpZl0tLT4nLFxuICAgICAgICAgICAgaUVsZW1zWzBdXG4gICAgICAgICkge31cbiAgICAgICAgcmV0dXJuIHZlcnNpb24gPiA0ID8gdmVyc2lvbiA6IHVuZGVmaW5lZDtcbiAgICB9KCkpO1xuICAgIHZhciBpc0llNiA9IGllVmVyc2lvbiA9PT0gNixcbiAgICAgICAgaXNJZTcgPSBpZVZlcnNpb24gPT09IDc7XG5cbiAgICBmdW5jdGlvbiBpc0NsaWNrT25DaGVja2FibGVFbGVtZW50KGVsZW1lbnQsIGV2ZW50VHlwZSkge1xuICAgICAgICBpZiAoKGtvLnV0aWxzLnRhZ05hbWVMb3dlcihlbGVtZW50KSAhPT0gXCJpbnB1dFwiKSB8fCAhZWxlbWVudC50eXBlKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmIChldmVudFR5cGUudG9Mb3dlckNhc2UoKSAhPSBcImNsaWNrXCIpIHJldHVybiBmYWxzZTtcbiAgICAgICAgdmFyIGlucHV0VHlwZSA9IGVsZW1lbnQudHlwZTtcbiAgICAgICAgcmV0dXJuIChpbnB1dFR5cGUgPT0gXCJjaGVja2JveFwiKSB8fCAoaW5wdXRUeXBlID09IFwicmFkaW9cIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZmllbGRzSW5jbHVkZWRXaXRoSnNvblBvc3Q6IFsnYXV0aGVudGljaXR5X3Rva2VuJywgL15fX1JlcXVlc3RWZXJpZmljYXRpb25Ub2tlbihfLiopPyQvXSxcblxuICAgICAgICBhcnJheUZvckVhY2g6IGZ1bmN0aW9uIChhcnJheSwgYWN0aW9uKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IGFycmF5Lmxlbmd0aDsgaSA8IGo7IGkrKylcbiAgICAgICAgICAgICAgICBhY3Rpb24oYXJyYXlbaV0sIGkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFycmF5SW5kZXhPZjogZnVuY3Rpb24gKGFycmF5LCBpdGVtKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIEFycmF5LnByb3RvdHlwZS5pbmRleE9mID09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChhcnJheSwgaXRlbSk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IGFycmF5Lmxlbmd0aDsgaSA8IGo7IGkrKylcbiAgICAgICAgICAgICAgICBpZiAoYXJyYXlbaV0gPT09IGl0ZW0pXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFycmF5Rmlyc3Q6IGZ1bmN0aW9uIChhcnJheSwgcHJlZGljYXRlLCBwcmVkaWNhdGVPd25lcikge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBhcnJheS5sZW5ndGg7IGkgPCBqOyBpKyspXG4gICAgICAgICAgICAgICAgaWYgKHByZWRpY2F0ZS5jYWxsKHByZWRpY2F0ZU93bmVyLCBhcnJheVtpXSwgaSkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcnJheVtpXTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFycmF5UmVtb3ZlSXRlbTogZnVuY3Rpb24gKGFycmF5LCBpdGVtVG9SZW1vdmUpIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IGtvLnV0aWxzLmFycmF5SW5kZXhPZihhcnJheSwgaXRlbVRvUmVtb3ZlKTtcbiAgICAgICAgICAgIGlmIChpbmRleCA+IDApIHtcbiAgICAgICAgICAgICAgICBhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgICBhcnJheS5zaGlmdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGFycmF5R2V0RGlzdGluY3RWYWx1ZXM6IGZ1bmN0aW9uIChhcnJheSkge1xuICAgICAgICAgICAgYXJyYXkgPSBhcnJheSB8fCBbXTtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gYXJyYXkubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGtvLnV0aWxzLmFycmF5SW5kZXhPZihyZXN1bHQsIGFycmF5W2ldKSA8IDApXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGFycmF5W2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYXJyYXlNYXA6IGZ1bmN0aW9uIChhcnJheSwgbWFwcGluZykge1xuICAgICAgICAgICAgYXJyYXkgPSBhcnJheSB8fCBbXTtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gYXJyYXkubGVuZ3RoOyBpIDwgajsgaSsrKVxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKG1hcHBpbmcoYXJyYXlbaV0sIGkpKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYXJyYXlGaWx0ZXI6IGZ1bmN0aW9uIChhcnJheSwgcHJlZGljYXRlKSB7XG4gICAgICAgICAgICBhcnJheSA9IGFycmF5IHx8IFtdO1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBhcnJheS5sZW5ndGg7IGkgPCBqOyBpKyspXG4gICAgICAgICAgICAgICAgaWYgKHByZWRpY2F0ZShhcnJheVtpXSwgaSkpXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGFycmF5W2ldKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYXJyYXlQdXNoQWxsOiBmdW5jdGlvbiAoYXJyYXksIHZhbHVlc1RvUHVzaCkge1xuICAgICAgICAgICAgaWYgKHZhbHVlc1RvUHVzaCBpbnN0YW5jZW9mIEFycmF5KVxuICAgICAgICAgICAgICAgIGFycmF5LnB1c2guYXBwbHkoYXJyYXksIHZhbHVlc1RvUHVzaCk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSB2YWx1ZXNUb1B1c2gubGVuZ3RoOyBpIDwgajsgaSsrKVxuICAgICAgICAgICAgICAgICAgICBhcnJheS5wdXNoKHZhbHVlc1RvUHVzaFtpXSk7XG4gICAgICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWRkT3JSZW1vdmVJdGVtOiBmdW5jdGlvbihhcnJheSwgdmFsdWUsIGluY2x1ZGVkKSB7XG4gICAgICAgICAgICB2YXIgZXhpc3RpbmdFbnRyeUluZGV4ID0ga28udXRpbHMuYXJyYXlJbmRleE9mKGtvLnV0aWxzLnBlZWtPYnNlcnZhYmxlKGFycmF5KSwgdmFsdWUpO1xuICAgICAgICAgICAgaWYgKGV4aXN0aW5nRW50cnlJbmRleCA8IDApIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5jbHVkZWQpXG4gICAgICAgICAgICAgICAgICAgIGFycmF5LnB1c2godmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIWluY2x1ZGVkKVxuICAgICAgICAgICAgICAgICAgICBhcnJheS5zcGxpY2UoZXhpc3RpbmdFbnRyeUluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBjYW5TZXRQcm90b3R5cGU6IGNhblNldFByb3RvdHlwZSxcblxuICAgICAgICBleHRlbmQ6IGV4dGVuZCxcblxuICAgICAgICBzZXRQcm90b3R5cGVPZjogc2V0UHJvdG90eXBlT2YsXG5cbiAgICAgICAgc2V0UHJvdG90eXBlT2ZPckV4dGVuZDogY2FuU2V0UHJvdG90eXBlID8gc2V0UHJvdG90eXBlT2YgOiBleHRlbmQsXG5cbiAgICAgICAgb2JqZWN0Rm9yRWFjaDogb2JqZWN0Rm9yRWFjaCxcblxuICAgICAgICBvYmplY3RNYXA6IGZ1bmN0aW9uKHNvdXJjZSwgbWFwcGluZykge1xuICAgICAgICAgICAgaWYgKCFzb3VyY2UpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRbcHJvcF0gPSBtYXBwaW5nKHNvdXJjZVtwcm9wXSwgcHJvcCwgc291cmNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgICB9LFxuXG4gICAgICAgIGVtcHR5RG9tTm9kZTogZnVuY3Rpb24gKGRvbU5vZGUpIHtcbiAgICAgICAgICAgIHdoaWxlIChkb21Ob2RlLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgICAgICBrby5yZW1vdmVOb2RlKGRvbU5vZGUuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgbW92ZUNsZWFuZWROb2Rlc1RvQ29udGFpbmVyRWxlbWVudDogZnVuY3Rpb24obm9kZXMpIHtcbiAgICAgICAgICAgIC8vIEVuc3VyZSBpdCdzIGEgcmVhbCBhcnJheSwgYXMgd2UncmUgYWJvdXQgdG8gcmVwYXJlbnQgdGhlIG5vZGVzIGFuZFxuICAgICAgICAgICAgLy8gd2UgZG9uJ3Qgd2FudCB0aGUgdW5kZXJseWluZyBjb2xsZWN0aW9uIHRvIGNoYW5nZSB3aGlsZSB3ZSdyZSBkb2luZyB0aGF0LlxuICAgICAgICAgICAgdmFyIG5vZGVzQXJyYXkgPSBrby51dGlscy5tYWtlQXJyYXkobm9kZXMpO1xuXG4gICAgICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IG5vZGVzQXJyYXkubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGtvLmNsZWFuTm9kZShub2Rlc0FycmF5W2ldKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY29udGFpbmVyO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNsb25lTm9kZXM6IGZ1bmN0aW9uIChub2Rlc0FycmF5LCBzaG91bGRDbGVhbk5vZGVzKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IG5vZGVzQXJyYXkubGVuZ3RoLCBuZXdOb2Rlc0FycmF5ID0gW107IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY2xvbmVkTm9kZSA9IG5vZGVzQXJyYXlbaV0uY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgICAgICAgIG5ld05vZGVzQXJyYXkucHVzaChzaG91bGRDbGVhbk5vZGVzID8ga28uY2xlYW5Ob2RlKGNsb25lZE5vZGUpIDogY2xvbmVkTm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV3Tm9kZXNBcnJheTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXREb21Ob2RlQ2hpbGRyZW46IGZ1bmN0aW9uIChkb21Ob2RlLCBjaGlsZE5vZGVzKSB7XG4gICAgICAgICAgICBrby51dGlscy5lbXB0eURvbU5vZGUoZG9tTm9kZSk7XG4gICAgICAgICAgICBpZiAoY2hpbGROb2Rlcykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gY2hpbGROb2Rlcy5sZW5ndGg7IGkgPCBqOyBpKyspXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuYXBwZW5kQ2hpbGQoY2hpbGROb2Rlc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVwbGFjZURvbU5vZGVzOiBmdW5jdGlvbiAobm9kZVRvUmVwbGFjZU9yTm9kZUFycmF5LCBuZXdOb2Rlc0FycmF5KSB7XG4gICAgICAgICAgICB2YXIgbm9kZXNUb1JlcGxhY2VBcnJheSA9IG5vZGVUb1JlcGxhY2VPck5vZGVBcnJheS5ub2RlVHlwZSA/IFtub2RlVG9SZXBsYWNlT3JOb2RlQXJyYXldIDogbm9kZVRvUmVwbGFjZU9yTm9kZUFycmF5O1xuICAgICAgICAgICAgaWYgKG5vZGVzVG9SZXBsYWNlQXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBpbnNlcnRpb25Qb2ludCA9IG5vZGVzVG9SZXBsYWNlQXJyYXlbMF07XG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudCA9IGluc2VydGlvblBvaW50LnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBuZXdOb2Rlc0FycmF5Lmxlbmd0aDsgaSA8IGo7IGkrKylcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Lmluc2VydEJlZm9yZShuZXdOb2Rlc0FycmF5W2ldLCBpbnNlcnRpb25Qb2ludCk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBub2Rlc1RvUmVwbGFjZUFycmF5Lmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBrby5yZW1vdmVOb2RlKG5vZGVzVG9SZXBsYWNlQXJyYXlbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBmaXhVcENvbnRpbnVvdXNOb2RlQXJyYXk6IGZ1bmN0aW9uKGNvbnRpbnVvdXNOb2RlQXJyYXksIHBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgIC8vIEJlZm9yZSBhY3Rpbmcgb24gYSBzZXQgb2Ygbm9kZXMgdGhhdCB3ZXJlIHByZXZpb3VzbHkgb3V0cHV0dGVkIGJ5IGEgdGVtcGxhdGUgZnVuY3Rpb24sIHdlIGhhdmUgdG8gcmVjb25jaWxlXG4gICAgICAgICAgICAvLyB0aGVtIGFnYWluc3Qgd2hhdCBpcyBpbiB0aGUgRE9NIHJpZ2h0IG5vdy4gSXQgbWF5IGJlIHRoYXQgc29tZSBvZiB0aGUgbm9kZXMgaGF2ZSBhbHJlYWR5IGJlZW4gcmVtb3ZlZCwgb3IgdGhhdFxuICAgICAgICAgICAgLy8gbmV3IG5vZGVzIG1pZ2h0IGhhdmUgYmVlbiBpbnNlcnRlZCBpbiB0aGUgbWlkZGxlLCBmb3IgZXhhbXBsZSBieSBhIGJpbmRpbmcuIEFsc28sIHRoZXJlIG1heSBwcmV2aW91c2x5IGhhdmUgYmVlblxuICAgICAgICAgICAgLy8gbGVhZGluZyBjb21tZW50IG5vZGVzIChjcmVhdGVkIGJ5IHJld3JpdHRlbiBzdHJpbmctYmFzZWQgdGVtcGxhdGVzKSB0aGF0IGhhdmUgc2luY2UgYmVlbiByZW1vdmVkIGR1cmluZyBiaW5kaW5nLlxuICAgICAgICAgICAgLy8gU28sIHRoaXMgZnVuY3Rpb24gdHJhbnNsYXRlcyB0aGUgb2xkIFwibWFwXCIgb3V0cHV0IGFycmF5IGludG8gaXRzIGJlc3QgZ3Vlc3Mgb2YgdGhlIHNldCBvZiBjdXJyZW50IERPTSBub2Rlcy5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBSdWxlczpcbiAgICAgICAgICAgIC8vICAgW0FdIEFueSBsZWFkaW5nIG5vZGVzIHRoYXQgaGF2ZSBiZWVuIHJlbW92ZWQgc2hvdWxkIGJlIGlnbm9yZWRcbiAgICAgICAgICAgIC8vICAgICAgIFRoZXNlIG1vc3QgbGlrZWx5IGNvcnJlc3BvbmQgdG8gbWVtb2l6YXRpb24gbm9kZXMgdGhhdCB3ZXJlIGFscmVhZHkgcmVtb3ZlZCBkdXJpbmcgYmluZGluZ1xuICAgICAgICAgICAgLy8gICAgICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TdGV2ZVNhbmRlcnNvbi9rbm9ja291dC9wdWxsLzQ0MFxuICAgICAgICAgICAgLy8gICBbQl0gV2Ugd2FudCB0byBvdXRwdXQgYSBjb250aW51b3VzIHNlcmllcyBvZiBub2Rlcy4gU28sIGlnbm9yZSBhbnkgbm9kZXMgdGhhdCBoYXZlIGFscmVhZHkgYmVlbiByZW1vdmVkLFxuICAgICAgICAgICAgLy8gICAgICAgYW5kIGluY2x1ZGUgYW55IG5vZGVzIHRoYXQgaGF2ZSBiZWVuIGluc2VydGVkIGFtb25nIHRoZSBwcmV2aW91cyBjb2xsZWN0aW9uXG5cbiAgICAgICAgICAgIGlmIChjb250aW51b3VzTm9kZUFycmF5Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIC8vIFRoZSBwYXJlbnQgbm9kZSBjYW4gYmUgYSB2aXJ0dWFsIGVsZW1lbnQ7IHNvIGdldCB0aGUgcmVhbCBwYXJlbnQgbm9kZVxuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUgPSAocGFyZW50Tm9kZS5ub2RlVHlwZSA9PT0gOCAmJiBwYXJlbnROb2RlLnBhcmVudE5vZGUpIHx8IHBhcmVudE5vZGU7XG5cbiAgICAgICAgICAgICAgICAvLyBSdWxlIFtBXVxuICAgICAgICAgICAgICAgIHdoaWxlIChjb250aW51b3VzTm9kZUFycmF5Lmxlbmd0aCAmJiBjb250aW51b3VzTm9kZUFycmF5WzBdLnBhcmVudE5vZGUgIT09IHBhcmVudE5vZGUpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVvdXNOb2RlQXJyYXkuc2hpZnQoKTtcblxuICAgICAgICAgICAgICAgIC8vIFJ1bGUgW0JdXG4gICAgICAgICAgICAgICAgaWYgKGNvbnRpbnVvdXNOb2RlQXJyYXkubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudCA9IGNvbnRpbnVvdXNOb2RlQXJyYXlbMF0sIGxhc3QgPSBjb250aW51b3VzTm9kZUFycmF5W2NvbnRpbnVvdXNOb2RlQXJyYXkubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgICAgIC8vIFJlcGxhY2Ugd2l0aCB0aGUgYWN0dWFsIG5ldyBjb250aW51b3VzIG5vZGUgc2V0XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVvdXNOb2RlQXJyYXkubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGN1cnJlbnQgIT09IGxhc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVvdXNOb2RlQXJyYXkucHVzaChjdXJyZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjdXJyZW50KSAvLyBXb24ndCBoYXBwZW4sIGV4Y2VwdCBpZiB0aGUgZGV2ZWxvcGVyIGhhcyBtYW51YWxseSByZW1vdmVkIHNvbWUgRE9NIGVsZW1lbnRzICh0aGVuIHdlJ3JlIGluIGFuIHVuZGVmaW5lZCBzY2VuYXJpbylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29udGludW91c05vZGVBcnJheS5wdXNoKGxhc3QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjb250aW51b3VzTm9kZUFycmF5O1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldE9wdGlvbk5vZGVTZWxlY3Rpb25TdGF0ZTogZnVuY3Rpb24gKG9wdGlvbk5vZGUsIGlzU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIC8vIElFNiBzb21ldGltZXMgdGhyb3dzIFwidW5rbm93biBlcnJvclwiIGlmIHlvdSB0cnkgdG8gd3JpdGUgdG8gLnNlbGVjdGVkIGRpcmVjdGx5LCB3aGVyZWFzIEZpcmVmb3ggc3RydWdnbGVzIHdpdGggc2V0QXR0cmlidXRlLiBQaWNrIG9uZSBiYXNlZCBvbiBicm93c2VyLlxuICAgICAgICAgICAgaWYgKGllVmVyc2lvbiA8IDcpXG4gICAgICAgICAgICAgICAgb3B0aW9uTm9kZS5zZXRBdHRyaWJ1dGUoXCJzZWxlY3RlZFwiLCBpc1NlbGVjdGVkKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBvcHRpb25Ob2RlLnNlbGVjdGVkID0gaXNTZWxlY3RlZDtcbiAgICAgICAgfSxcblxuICAgICAgICBzdHJpbmdUcmltOiBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyaW5nID09PSBudWxsIHx8IHN0cmluZyA9PT0gdW5kZWZpbmVkID8gJycgOlxuICAgICAgICAgICAgICAgIHN0cmluZy50cmltID9cbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nLnRyaW0oKSA6XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZy50b1N0cmluZygpLnJlcGxhY2UoL15bXFxzXFx4YTBdK3xbXFxzXFx4YTBdKyQvZywgJycpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHN0cmluZ1N0YXJ0c1dpdGg6IGZ1bmN0aW9uIChzdHJpbmcsIHN0YXJ0c1dpdGgpIHtcbiAgICAgICAgICAgIHN0cmluZyA9IHN0cmluZyB8fCBcIlwiO1xuICAgICAgICAgICAgaWYgKHN0YXJ0c1dpdGgubGVuZ3RoID4gc3RyaW5nLmxlbmd0aClcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gc3RyaW5nLnN1YnN0cmluZygwLCBzdGFydHNXaXRoLmxlbmd0aCkgPT09IHN0YXJ0c1dpdGg7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZG9tTm9kZUlzQ29udGFpbmVkQnk6IGZ1bmN0aW9uIChub2RlLCBjb250YWluZWRCeU5vZGUpIHtcbiAgICAgICAgICAgIGlmIChub2RlID09PSBjb250YWluZWRCeU5vZGUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMTEpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBGaXhlcyBpc3N1ZSAjMTE2MiAtIGNhbid0IHVzZSBub2RlLmNvbnRhaW5zIGZvciBkb2N1bWVudCBmcmFnbWVudHMgb24gSUU4XG4gICAgICAgICAgICBpZiAoY29udGFpbmVkQnlOb2RlLmNvbnRhaW5zKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZWRCeU5vZGUuY29udGFpbnMobm9kZS5ub2RlVHlwZSA9PT0gMyA/IG5vZGUucGFyZW50Tm9kZSA6IG5vZGUpO1xuICAgICAgICAgICAgaWYgKGNvbnRhaW5lZEJ5Tm9kZS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbilcbiAgICAgICAgICAgICAgICByZXR1cm4gKGNvbnRhaW5lZEJ5Tm9kZS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihub2RlKSAmIDE2KSA9PSAxNjtcbiAgICAgICAgICAgIHdoaWxlIChub2RlICYmIG5vZGUgIT0gY29udGFpbmVkQnlOb2RlKSB7XG4gICAgICAgICAgICAgICAgbm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAhIW5vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZG9tTm9kZUlzQXR0YWNoZWRUb0RvY3VtZW50OiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIGtvLnV0aWxzLmRvbU5vZGVJc0NvbnRhaW5lZEJ5KG5vZGUsIG5vZGUub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFueURvbU5vZGVJc0F0dGFjaGVkVG9Eb2N1bWVudDogZnVuY3Rpb24obm9kZXMpIHtcbiAgICAgICAgICAgIHJldHVybiAhIWtvLnV0aWxzLmFycmF5Rmlyc3Qobm9kZXMsIGtvLnV0aWxzLmRvbU5vZGVJc0F0dGFjaGVkVG9Eb2N1bWVudCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdGFnTmFtZUxvd2VyOiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICAvLyBGb3IgSFRNTCBlbGVtZW50cywgdGFnTmFtZSB3aWxsIGFsd2F5cyBiZSB1cHBlciBjYXNlOyBmb3IgWEhUTUwgZWxlbWVudHMsIGl0J2xsIGJlIGxvd2VyIGNhc2UuXG4gICAgICAgICAgICAvLyBQb3NzaWJsZSBmdXR1cmUgb3B0aW1pemF0aW9uOiBJZiB3ZSBrbm93IGl0J3MgYW4gZWxlbWVudCBmcm9tIGFuIFhIVE1MIGRvY3VtZW50IChub3QgSFRNTCksXG4gICAgICAgICAgICAvLyB3ZSBkb24ndCBuZWVkIHRvIGRvIHRoZSAudG9Mb3dlckNhc2UoKSBhcyBpdCB3aWxsIGFsd2F5cyBiZSBsb3dlciBjYXNlIGFueXdheS5cbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50ICYmIGVsZW1lbnQudGFnTmFtZSAmJiBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZWdpc3RlckV2ZW50SGFuZGxlcjogZnVuY3Rpb24gKGVsZW1lbnQsIGV2ZW50VHlwZSwgaGFuZGxlcikge1xuICAgICAgICAgICAgdmFyIG11c3RVc2VBdHRhY2hFdmVudCA9IGllVmVyc2lvbiAmJiBldmVudHNUaGF0TXVzdEJlUmVnaXN0ZXJlZFVzaW5nQXR0YWNoRXZlbnRbZXZlbnRUeXBlXTtcbiAgICAgICAgICAgIGlmICghbXVzdFVzZUF0dGFjaEV2ZW50ICYmIGpRdWVyeUluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgalF1ZXJ5SW5zdGFuY2UoZWxlbWVudClbJ2JpbmQnXShldmVudFR5cGUsIGhhbmRsZXIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghbXVzdFVzZUF0dGFjaEV2ZW50ICYmIHR5cGVvZiBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIgPT0gXCJmdW5jdGlvblwiKVxuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBlbGVtZW50LmF0dGFjaEV2ZW50ICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0YWNoRXZlbnRIYW5kbGVyID0gZnVuY3Rpb24gKGV2ZW50KSB7IGhhbmRsZXIuY2FsbChlbGVtZW50LCBldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgICAgIGF0dGFjaEV2ZW50TmFtZSA9IFwib25cIiArIGV2ZW50VHlwZTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmF0dGFjaEV2ZW50KGF0dGFjaEV2ZW50TmFtZSwgYXR0YWNoRXZlbnRIYW5kbGVyKTtcblxuICAgICAgICAgICAgICAgIC8vIElFIGRvZXMgbm90IGRpc3Bvc2UgYXR0YWNoRXZlbnQgaGFuZGxlcnMgYXV0b21hdGljYWxseSAodW5saWtlIHdpdGggYWRkRXZlbnRMaXN0ZW5lcilcbiAgICAgICAgICAgICAgICAvLyBzbyB0byBhdm9pZCBsZWFrcywgd2UgaGF2ZSB0byByZW1vdmUgdGhlbSBtYW51YWxseS4gU2VlIGJ1ZyAjODU2XG4gICAgICAgICAgICAgICAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhlbGVtZW50LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5kZXRhY2hFdmVudChhdHRhY2hFdmVudE5hbWUsIGF0dGFjaEV2ZW50SGFuZGxlcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJCcm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCBhZGRFdmVudExpc3RlbmVyIG9yIGF0dGFjaEV2ZW50XCIpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRyaWdnZXJFdmVudDogZnVuY3Rpb24gKGVsZW1lbnQsIGV2ZW50VHlwZSkge1xuICAgICAgICAgICAgaWYgKCEoZWxlbWVudCAmJiBlbGVtZW50Lm5vZGVUeXBlKSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJlbGVtZW50IG11c3QgYmUgYSBET00gbm9kZSB3aGVuIGNhbGxpbmcgdHJpZ2dlckV2ZW50XCIpO1xuXG4gICAgICAgICAgICAvLyBGb3IgY2xpY2sgZXZlbnRzIG9uIGNoZWNrYm94ZXMgYW5kIHJhZGlvIGJ1dHRvbnMsIGpRdWVyeSB0b2dnbGVzIHRoZSBlbGVtZW50IGNoZWNrZWQgc3RhdGUgKmFmdGVyKiB0aGVcbiAgICAgICAgICAgIC8vIGV2ZW50IGhhbmRsZXIgcnVucyBpbnN0ZWFkIG9mICpiZWZvcmUqLiAoVGhpcyB3YXMgZml4ZWQgaW4gMS45IGZvciBjaGVja2JveGVzIGJ1dCBub3QgZm9yIHJhZGlvIGJ1dHRvbnMuKVxuICAgICAgICAgICAgLy8gSUUgZG9lc24ndCBjaGFuZ2UgdGhlIGNoZWNrZWQgc3RhdGUgd2hlbiB5b3UgdHJpZ2dlciB0aGUgY2xpY2sgZXZlbnQgdXNpbmcgXCJmaXJlRXZlbnRcIi5cbiAgICAgICAgICAgIC8vIEluIGJvdGggY2FzZXMsIHdlJ2xsIHVzZSB0aGUgY2xpY2sgbWV0aG9kIGluc3RlYWQuXG4gICAgICAgICAgICB2YXIgdXNlQ2xpY2tXb3JrYXJvdW5kID0gaXNDbGlja09uQ2hlY2thYmxlRWxlbWVudChlbGVtZW50LCBldmVudFR5cGUpO1xuXG4gICAgICAgICAgICBpZiAoalF1ZXJ5SW5zdGFuY2UgJiYgIXVzZUNsaWNrV29ya2Fyb3VuZCkge1xuICAgICAgICAgICAgICAgIGpRdWVyeUluc3RhbmNlKGVsZW1lbnQpWyd0cmlnZ2VyJ10oZXZlbnRUeXBlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGRvY3VtZW50LmNyZWF0ZUV2ZW50ID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZWxlbWVudC5kaXNwYXRjaEV2ZW50ID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZXZlbnRDYXRlZ29yeSA9IGtub3duRXZlbnRUeXBlc0J5RXZlbnROYW1lW2V2ZW50VHlwZV0gfHwgXCJIVE1MRXZlbnRzXCI7XG4gICAgICAgICAgICAgICAgICAgIHZhciBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KGV2ZW50Q2F0ZWdvcnkpO1xuICAgICAgICAgICAgICAgICAgICBldmVudC5pbml0RXZlbnQoZXZlbnRUeXBlLCB0cnVlLCB0cnVlLCB3aW5kb3csIDAsIDAsIDAsIDAsIDAsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCAwLCBlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3VwcGxpZWQgZWxlbWVudCBkb2Vzbid0IHN1cHBvcnQgZGlzcGF0Y2hFdmVudFwiKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodXNlQ2xpY2tXb3JrYXJvdW5kICYmIGVsZW1lbnQuY2xpY2spIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNsaWNrKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBlbGVtZW50LmZpcmVFdmVudCAhPSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5maXJlRXZlbnQoXCJvblwiICsgZXZlbnRUeXBlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgdHJpZ2dlcmluZyBldmVudHNcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgdW53cmFwT2JzZXJ2YWJsZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4ga28uaXNPYnNlcnZhYmxlKHZhbHVlKSA/IHZhbHVlKCkgOiB2YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBwZWVrT2JzZXJ2YWJsZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4ga28uaXNPYnNlcnZhYmxlKHZhbHVlKSA/IHZhbHVlLnBlZWsoKSA6IHZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRvZ2dsZURvbU5vZGVDc3NDbGFzczogZnVuY3Rpb24gKG5vZGUsIGNsYXNzTmFtZXMsIHNob3VsZEhhdmVDbGFzcykge1xuICAgICAgICAgICAgaWYgKGNsYXNzTmFtZXMpIHtcbiAgICAgICAgICAgICAgICB2YXIgY3NzQ2xhc3NOYW1lUmVnZXggPSAvXFxTKy9nLFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50Q2xhc3NOYW1lcyA9IG5vZGUuY2xhc3NOYW1lLm1hdGNoKGNzc0NsYXNzTmFtZVJlZ2V4KSB8fCBbXTtcbiAgICAgICAgICAgICAgICBrby51dGlscy5hcnJheUZvckVhY2goY2xhc3NOYW1lcy5tYXRjaChjc3NDbGFzc05hbWVSZWdleCksIGZ1bmN0aW9uKGNsYXNzTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBrby51dGlscy5hZGRPclJlbW92ZUl0ZW0oY3VycmVudENsYXNzTmFtZXMsIGNsYXNzTmFtZSwgc2hvdWxkSGF2ZUNsYXNzKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBub2RlLmNsYXNzTmFtZSA9IGN1cnJlbnRDbGFzc05hbWVzLmpvaW4oXCIgXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHNldFRleHRDb250ZW50OiBmdW5jdGlvbihlbGVtZW50LCB0ZXh0Q29udGVudCkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh0ZXh0Q29udGVudCk7XG4gICAgICAgICAgICBpZiAoKHZhbHVlID09PSBudWxsKSB8fCAodmFsdWUgPT09IHVuZGVmaW5lZCkpXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBcIlwiO1xuXG4gICAgICAgICAgICAvLyBXZSBuZWVkIHRoZXJlIHRvIGJlIGV4YWN0bHkgb25lIGNoaWxkOiBhIHRleHQgbm9kZS5cbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGFyZSBubyBjaGlsZHJlbiwgbW9yZSB0aGFuIG9uZSwgb3IgaWYgaXQncyBub3QgYSB0ZXh0IG5vZGUsXG4gICAgICAgICAgICAvLyB3ZSdsbCBjbGVhciBldmVyeXRoaW5nIGFuZCBjcmVhdGUgYSBzaW5nbGUgdGV4dCBub2RlLlxuICAgICAgICAgICAgdmFyIGlubmVyVGV4dE5vZGUgPSBrby52aXJ0dWFsRWxlbWVudHMuZmlyc3RDaGlsZChlbGVtZW50KTtcbiAgICAgICAgICAgIGlmICghaW5uZXJUZXh0Tm9kZSB8fCBpbm5lclRleHROb2RlLm5vZGVUeXBlICE9IDMgfHwga28udmlydHVhbEVsZW1lbnRzLm5leHRTaWJsaW5nKGlubmVyVGV4dE5vZGUpKSB7XG4gICAgICAgICAgICAgICAga28udmlydHVhbEVsZW1lbnRzLnNldERvbU5vZGVDaGlsZHJlbihlbGVtZW50LCBbZWxlbWVudC5vd25lckRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHZhbHVlKV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbm5lclRleHROb2RlLmRhdGEgPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAga28udXRpbHMuZm9yY2VSZWZyZXNoKGVsZW1lbnQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldEVsZW1lbnROYW1lOiBmdW5jdGlvbihlbGVtZW50LCBuYW1lKSB7XG4gICAgICAgICAgICBlbGVtZW50Lm5hbWUgPSBuYW1lO1xuXG4gICAgICAgICAgICAvLyBXb3JrYXJvdW5kIElFIDYvNyBpc3N1ZVxuICAgICAgICAgICAgLy8gLSBodHRwczovL2dpdGh1Yi5jb20vU3RldmVTYW5kZXJzb24va25vY2tvdXQvaXNzdWVzLzE5N1xuICAgICAgICAgICAgLy8gLSBodHRwOi8vd3d3Lm1hdHRzNDExLmNvbS9wb3N0L3NldHRpbmdfdGhlX25hbWVfYXR0cmlidXRlX2luX2llX2RvbS9cbiAgICAgICAgICAgIGlmIChpZVZlcnNpb24gPD0gNykge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQubWVyZ2VBdHRyaWJ1dGVzKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCI8aW5wdXQgbmFtZT0nXCIgKyBlbGVtZW50Lm5hbWUgKyBcIicvPlwiKSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaChlKSB7fSAvLyBGb3IgSUU5IHdpdGggZG9jIG1vZGUgXCJJRTkgU3RhbmRhcmRzXCIgYW5kIGJyb3dzZXIgbW9kZSBcIklFOSBDb21wYXRpYmlsaXR5IFZpZXdcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGZvcmNlUmVmcmVzaDogZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgLy8gV29ya2Fyb3VuZCBmb3IgYW4gSUU5IHJlbmRlcmluZyBidWcgLSBodHRwczovL2dpdGh1Yi5jb20vU3RldmVTYW5kZXJzb24va25vY2tvdXQvaXNzdWVzLzIwOVxuICAgICAgICAgICAgaWYgKGllVmVyc2lvbiA+PSA5KSB7XG4gICAgICAgICAgICAgICAgLy8gRm9yIHRleHQgbm9kZXMgYW5kIGNvbW1lbnQgbm9kZXMgKG1vc3QgbGlrZWx5IHZpcnR1YWwgZWxlbWVudHMpLCB3ZSB3aWxsIGhhdmUgdG8gcmVmcmVzaCB0aGUgY29udGFpbmVyXG4gICAgICAgICAgICAgICAgdmFyIGVsZW0gPSBub2RlLm5vZGVUeXBlID09IDEgPyBub2RlIDogbm9kZS5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIGlmIChlbGVtLnN0eWxlKVxuICAgICAgICAgICAgICAgICAgICBlbGVtLnN0eWxlLnpvb20gPSBlbGVtLnN0eWxlLnpvb207XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZW5zdXJlU2VsZWN0RWxlbWVudElzUmVuZGVyZWRDb3JyZWN0bHk6IGZ1bmN0aW9uKHNlbGVjdEVsZW1lbnQpIHtcbiAgICAgICAgICAgIC8vIFdvcmthcm91bmQgZm9yIElFOSByZW5kZXJpbmcgYnVnIC0gaXQgZG9lc24ndCByZWxpYWJseSBkaXNwbGF5IGFsbCB0aGUgdGV4dCBpbiBkeW5hbWljYWxseS1hZGRlZCBzZWxlY3QgYm94ZXMgdW5sZXNzIHlvdSBmb3JjZSBpdCB0byByZS1yZW5kZXIgYnkgdXBkYXRpbmcgdGhlIHdpZHRoLlxuICAgICAgICAgICAgLy8gKFNlZSBodHRwczovL2dpdGh1Yi5jb20vU3RldmVTYW5kZXJzb24va25vY2tvdXQvaXNzdWVzLzMxMiwgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81OTA4NDk0L3NlbGVjdC1vbmx5LXNob3dzLWZpcnN0LWNoYXItb2Ytc2VsZWN0ZWQtb3B0aW9uKVxuICAgICAgICAgICAgLy8gQWxzbyBmaXhlcyBJRTcgYW5kIElFOCBidWcgdGhhdCBjYXVzZXMgc2VsZWN0cyB0byBiZSB6ZXJvIHdpZHRoIGlmIGVuY2xvc2VkIGJ5ICdpZicgb3IgJ3dpdGgnLiAoU2VlIGlzc3VlICM4MzkpXG4gICAgICAgICAgICBpZiAoaWVWZXJzaW9uKSB7XG4gICAgICAgICAgICAgICAgdmFyIG9yaWdpbmFsV2lkdGggPSBzZWxlY3RFbGVtZW50LnN0eWxlLndpZHRoO1xuICAgICAgICAgICAgICAgIHNlbGVjdEVsZW1lbnQuc3R5bGUud2lkdGggPSAwO1xuICAgICAgICAgICAgICAgIHNlbGVjdEVsZW1lbnQuc3R5bGUud2lkdGggPSBvcmlnaW5hbFdpZHRoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHJhbmdlOiBmdW5jdGlvbiAobWluLCBtYXgpIHtcbiAgICAgICAgICAgIG1pbiA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUobWluKTtcbiAgICAgICAgICAgIG1heCA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUobWF4KTtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBtaW47IGkgPD0gbWF4OyBpKyspXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goaSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9LFxuXG4gICAgICAgIG1ha2VBcnJheTogZnVuY3Rpb24oYXJyYXlMaWtlT2JqZWN0KSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IGFycmF5TGlrZU9iamVjdC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChhcnJheUxpa2VPYmplY3RbaV0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNJZTYgOiBpc0llNixcbiAgICAgICAgaXNJZTcgOiBpc0llNyxcbiAgICAgICAgaWVWZXJzaW9uIDogaWVWZXJzaW9uLFxuXG4gICAgICAgIGdldEZvcm1GaWVsZHM6IGZ1bmN0aW9uKGZvcm0sIGZpZWxkTmFtZSkge1xuICAgICAgICAgICAgdmFyIGZpZWxkcyA9IGtvLnV0aWxzLm1ha2VBcnJheShmb3JtLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW5wdXRcIikpLmNvbmNhdChrby51dGlscy5tYWtlQXJyYXkoZm9ybS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRleHRhcmVhXCIpKSk7XG4gICAgICAgICAgICB2YXIgaXNNYXRjaGluZ0ZpZWxkID0gKHR5cGVvZiBmaWVsZE5hbWUgPT0gJ3N0cmluZycpXG4gICAgICAgICAgICAgICAgPyBmdW5jdGlvbihmaWVsZCkgeyByZXR1cm4gZmllbGQubmFtZSA9PT0gZmllbGROYW1lIH1cbiAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uKGZpZWxkKSB7IHJldHVybiBmaWVsZE5hbWUudGVzdChmaWVsZC5uYW1lKSB9OyAvLyBUcmVhdCBmaWVsZE5hbWUgYXMgcmVnZXggb3Igb2JqZWN0IGNvbnRhaW5pbmcgcHJlZGljYXRlXG4gICAgICAgICAgICB2YXIgbWF0Y2hlcyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGZpZWxkcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIGlmIChpc01hdGNoaW5nRmllbGQoZmllbGRzW2ldKSlcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hlcy5wdXNoKGZpZWxkc1tpXSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIG1hdGNoZXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2VKc29uOiBmdW5jdGlvbiAoanNvblN0cmluZykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBqc29uU3RyaW5nID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICBqc29uU3RyaW5nID0ga28udXRpbHMuc3RyaW5nVHJpbShqc29uU3RyaW5nKTtcbiAgICAgICAgICAgICAgICBpZiAoanNvblN0cmluZykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoSlNPTiAmJiBKU09OLnBhcnNlKSAvLyBVc2UgbmF0aXZlIHBhcnNpbmcgd2hlcmUgYXZhaWxhYmxlXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShqc29uU3RyaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChuZXcgRnVuY3Rpb24oXCJyZXR1cm4gXCIgKyBqc29uU3RyaW5nKSkoKTsgLy8gRmFsbGJhY2sgb24gbGVzcyBzYWZlIHBhcnNpbmcgZm9yIG9sZGVyIGJyb3dzZXJzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc3RyaW5naWZ5SnNvbjogZnVuY3Rpb24gKGRhdGEsIHJlcGxhY2VyLCBzcGFjZSkgeyAgIC8vIHJlcGxhY2VyIGFuZCBzcGFjZSBhcmUgb3B0aW9uYWxcbiAgICAgICAgICAgIGlmICghSlNPTiB8fCAhSlNPTi5zdHJpbmdpZnkpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgSlNPTi5zdHJpbmdpZnkoKS4gU29tZSBicm93c2VycyAoZS5nLiwgSUUgPCA4KSBkb24ndCBzdXBwb3J0IGl0IG5hdGl2ZWx5LCBidXQgeW91IGNhbiBvdmVyY29tZSB0aGlzIGJ5IGFkZGluZyBhIHNjcmlwdCByZWZlcmVuY2UgdG8ganNvbjIuanMsIGRvd25sb2FkYWJsZSBmcm9tIGh0dHA6Ly93d3cuanNvbi5vcmcvanNvbjIuanNcIik7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoa28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShkYXRhKSwgcmVwbGFjZXIsIHNwYWNlKTtcbiAgICAgICAgfSxcblxuICAgICAgICBwb3N0SnNvbjogZnVuY3Rpb24gKHVybE9yRm9ybSwgZGF0YSwgb3B0aW9ucykge1xuICAgICAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICAgICAgICB2YXIgcGFyYW1zID0gb3B0aW9uc1sncGFyYW1zJ10gfHwge307XG4gICAgICAgICAgICB2YXIgaW5jbHVkZUZpZWxkcyA9IG9wdGlvbnNbJ2luY2x1ZGVGaWVsZHMnXSB8fCB0aGlzLmZpZWxkc0luY2x1ZGVkV2l0aEpzb25Qb3N0O1xuICAgICAgICAgICAgdmFyIHVybCA9IHVybE9yRm9ybTtcblxuICAgICAgICAgICAgLy8gSWYgd2Ugd2VyZSBnaXZlbiBhIGZvcm0sIHVzZSBpdHMgJ2FjdGlvbicgVVJMIGFuZCBwaWNrIG91dCBhbnkgcmVxdWVzdGVkIGZpZWxkIHZhbHVlc1xuICAgICAgICAgICAgaWYoKHR5cGVvZiB1cmxPckZvcm0gPT0gJ29iamVjdCcpICYmIChrby51dGlscy50YWdOYW1lTG93ZXIodXJsT3JGb3JtKSA9PT0gXCJmb3JtXCIpKSB7XG4gICAgICAgICAgICAgICAgdmFyIG9yaWdpbmFsRm9ybSA9IHVybE9yRm9ybTtcbiAgICAgICAgICAgICAgICB1cmwgPSBvcmlnaW5hbEZvcm0uYWN0aW9uO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBpbmNsdWRlRmllbGRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmaWVsZHMgPSBrby51dGlscy5nZXRGb3JtRmllbGRzKG9yaWdpbmFsRm9ybSwgaW5jbHVkZUZpZWxkc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSBmaWVsZHMubGVuZ3RoIC0gMTsgaiA+PSAwOyBqLS0pXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXNbZmllbGRzW2pdLm5hbWVdID0gZmllbGRzW2pdLnZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGF0YSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUoZGF0YSk7XG4gICAgICAgICAgICB2YXIgZm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIpO1xuICAgICAgICAgICAgZm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICBmb3JtLmFjdGlvbiA9IHVybDtcbiAgICAgICAgICAgIGZvcm0ubWV0aG9kID0gXCJwb3N0XCI7XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gZGF0YSkge1xuICAgICAgICAgICAgICAgIC8vIFNpbmNlICdkYXRhJyB0aGlzIGlzIGEgbW9kZWwgb2JqZWN0LCB3ZSBpbmNsdWRlIGFsbCBwcm9wZXJ0aWVzIGluY2x1ZGluZyB0aG9zZSBpbmhlcml0ZWQgZnJvbSBpdHMgcHJvdG90eXBlXG4gICAgICAgICAgICAgICAgdmFyIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgICAgICAgICAgIGlucHV0LnR5cGUgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgIGlucHV0Lm5hbWUgPSBrZXk7XG4gICAgICAgICAgICAgICAgaW5wdXQudmFsdWUgPSBrby51dGlscy5zdHJpbmdpZnlKc29uKGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUoZGF0YVtrZXldKSk7XG4gICAgICAgICAgICAgICAgZm9ybS5hcHBlbmRDaGlsZChpbnB1dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvYmplY3RGb3JFYWNoKHBhcmFtcywgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICAgICAgICAgICAgICBpbnB1dC50eXBlID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgICAgICBpbnB1dC5uYW1lID0ga2V5O1xuICAgICAgICAgICAgICAgIGlucHV0LnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgZm9ybS5hcHBlbmRDaGlsZChpbnB1dCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZm9ybSk7XG4gICAgICAgICAgICBvcHRpb25zWydzdWJtaXR0ZXInXSA/IG9wdGlvbnNbJ3N1Ym1pdHRlciddKGZvcm0pIDogZm9ybS5zdWJtaXQoKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBmb3JtLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZm9ybSk7IH0sIDApO1xuICAgICAgICB9XG4gICAgfVxufSgpKTtcblxua28uZXhwb3J0U3ltYm9sKCd1dGlscycsIGtvLnV0aWxzKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuYXJyYXlGb3JFYWNoJywga28udXRpbHMuYXJyYXlGb3JFYWNoKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuYXJyYXlGaXJzdCcsIGtvLnV0aWxzLmFycmF5Rmlyc3QpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5hcnJheUZpbHRlcicsIGtvLnV0aWxzLmFycmF5RmlsdGVyKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuYXJyYXlHZXREaXN0aW5jdFZhbHVlcycsIGtvLnV0aWxzLmFycmF5R2V0RGlzdGluY3RWYWx1ZXMpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5hcnJheUluZGV4T2YnLCBrby51dGlscy5hcnJheUluZGV4T2YpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5hcnJheU1hcCcsIGtvLnV0aWxzLmFycmF5TWFwKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuYXJyYXlQdXNoQWxsJywga28udXRpbHMuYXJyYXlQdXNoQWxsKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuYXJyYXlSZW1vdmVJdGVtJywga28udXRpbHMuYXJyYXlSZW1vdmVJdGVtKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuZXh0ZW5kJywga28udXRpbHMuZXh0ZW5kKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuZmllbGRzSW5jbHVkZWRXaXRoSnNvblBvc3QnLCBrby51dGlscy5maWVsZHNJbmNsdWRlZFdpdGhKc29uUG9zdCk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLmdldEZvcm1GaWVsZHMnLCBrby51dGlscy5nZXRGb3JtRmllbGRzKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMucGVla09ic2VydmFibGUnLCBrby51dGlscy5wZWVrT2JzZXJ2YWJsZSk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLnBvc3RKc29uJywga28udXRpbHMucG9zdEpzb24pO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5wYXJzZUpzb24nLCBrby51dGlscy5wYXJzZUpzb24pO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5yZWdpc3RlckV2ZW50SGFuZGxlcicsIGtvLnV0aWxzLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuc3RyaW5naWZ5SnNvbicsIGtvLnV0aWxzLnN0cmluZ2lmeUpzb24pO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5yYW5nZScsIGtvLnV0aWxzLnJhbmdlKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMudG9nZ2xlRG9tTm9kZUNzc0NsYXNzJywga28udXRpbHMudG9nZ2xlRG9tTm9kZUNzc0NsYXNzKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMudHJpZ2dlckV2ZW50Jywga28udXRpbHMudHJpZ2dlckV2ZW50KTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMudW53cmFwT2JzZXJ2YWJsZScsIGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5vYmplY3RGb3JFYWNoJywga28udXRpbHMub2JqZWN0Rm9yRWFjaCk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLmFkZE9yUmVtb3ZlSXRlbScsIGtvLnV0aWxzLmFkZE9yUmVtb3ZlSXRlbSk7XG5rby5leHBvcnRTeW1ib2woJ3Vud3JhcCcsIGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUpOyAvLyBDb252ZW5pZW50IHNob3J0aGFuZCwgYmVjYXVzZSB0aGlzIGlzIHVzZWQgc28gY29tbW9ubHlcblxuaWYgKCFGdW5jdGlvbi5wcm90b3R5cGVbJ2JpbmQnXSkge1xuICAgIC8vIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kIGlzIGEgc3RhbmRhcmQgcGFydCBvZiBFQ01BU2NyaXB0IDV0aCBFZGl0aW9uIChEZWNlbWJlciAyMDA5LCBodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvcHVibGljYXRpb25zL2ZpbGVzL0VDTUEtU1QvRUNNQS0yNjIucGRmKVxuICAgIC8vIEluIGNhc2UgdGhlIGJyb3dzZXIgZG9lc24ndCBpbXBsZW1lbnQgaXQgbmF0aXZlbHksIHByb3ZpZGUgYSBKYXZhU2NyaXB0IGltcGxlbWVudGF0aW9uLiBUaGlzIGltcGxlbWVudGF0aW9uIGlzIGJhc2VkIG9uIHRoZSBvbmUgaW4gcHJvdG90eXBlLmpzXG4gICAgRnVuY3Rpb24ucHJvdG90eXBlWydiaW5kJ10gPSBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgICAgIHZhciBvcmlnaW5hbEZ1bmN0aW9uID0gdGhpcywgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyksIG9iamVjdCA9IGFyZ3Muc2hpZnQoKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEZ1bmN0aW9uLmFwcGx5KG9iamVjdCwgYXJncy5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgICAgICB9O1xuICAgIH07XG59XG5cbmtvLnV0aWxzLmRvbURhdGEgPSBuZXcgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdW5pcXVlSWQgPSAwO1xuICAgIHZhciBkYXRhU3RvcmVLZXlFeHBhbmRvUHJvcGVydHlOYW1lID0gXCJfX2tvX19cIiArIChuZXcgRGF0ZSkuZ2V0VGltZSgpO1xuICAgIHZhciBkYXRhU3RvcmUgPSB7fTtcblxuICAgIGZ1bmN0aW9uIGdldEFsbChub2RlLCBjcmVhdGVJZk5vdEZvdW5kKSB7XG4gICAgICAgIHZhciBkYXRhU3RvcmVLZXkgPSBub2RlW2RhdGFTdG9yZUtleUV4cGFuZG9Qcm9wZXJ0eU5hbWVdO1xuICAgICAgICB2YXIgaGFzRXhpc3RpbmdEYXRhU3RvcmUgPSBkYXRhU3RvcmVLZXkgJiYgKGRhdGFTdG9yZUtleSAhPT0gXCJudWxsXCIpICYmIGRhdGFTdG9yZVtkYXRhU3RvcmVLZXldO1xuICAgICAgICBpZiAoIWhhc0V4aXN0aW5nRGF0YVN0b3JlKSB7XG4gICAgICAgICAgICBpZiAoIWNyZWF0ZUlmTm90Rm91bmQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGRhdGFTdG9yZUtleSA9IG5vZGVbZGF0YVN0b3JlS2V5RXhwYW5kb1Byb3BlcnR5TmFtZV0gPSBcImtvXCIgKyB1bmlxdWVJZCsrO1xuICAgICAgICAgICAgZGF0YVN0b3JlW2RhdGFTdG9yZUtleV0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0YVN0b3JlW2RhdGFTdG9yZUtleV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAobm9kZSwga2V5KSB7XG4gICAgICAgICAgICB2YXIgYWxsRGF0YUZvck5vZGUgPSBnZXRBbGwobm9kZSwgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIGFsbERhdGFGb3JOb2RlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBhbGxEYXRhRm9yTm9kZVtrZXldO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChub2RlLCBrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB3ZSBkb24ndCBhY3R1YWxseSBjcmVhdGUgYSBuZXcgZG9tRGF0YSBrZXkgaWYgd2UgYXJlIGFjdHVhbGx5IGRlbGV0aW5nIGEgdmFsdWVcbiAgICAgICAgICAgICAgICBpZiAoZ2V0QWxsKG5vZGUsIGZhbHNlKSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYWxsRGF0YUZvck5vZGUgPSBnZXRBbGwobm9kZSwgdHJ1ZSk7XG4gICAgICAgICAgICBhbGxEYXRhRm9yTm9kZVtrZXldID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGNsZWFyOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgdmFyIGRhdGFTdG9yZUtleSA9IG5vZGVbZGF0YVN0b3JlS2V5RXhwYW5kb1Byb3BlcnR5TmFtZV07XG4gICAgICAgICAgICBpZiAoZGF0YVN0b3JlS2V5KSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGRhdGFTdG9yZVtkYXRhU3RvcmVLZXldO1xuICAgICAgICAgICAgICAgIG5vZGVbZGF0YVN0b3JlS2V5RXhwYW5kb1Byb3BlcnR5TmFtZV0gPSBudWxsO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlOyAvLyBFeHBvc2luZyBcImRpZCBjbGVhblwiIGZsYWcgcHVyZWx5IHNvIHNwZWNzIGNhbiBpbmZlciB3aGV0aGVyIHRoaW5ncyBoYXZlIGJlZW4gY2xlYW5lZCB1cCBhcyBpbnRlbmRlZFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIG5leHRLZXk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAodW5pcXVlSWQrKykgKyBkYXRhU3RvcmVLZXlFeHBhbmRvUHJvcGVydHlOYW1lO1xuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG5cbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuZG9tRGF0YScsIGtvLnV0aWxzLmRvbURhdGEpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5kb21EYXRhLmNsZWFyJywga28udXRpbHMuZG9tRGF0YS5jbGVhcik7IC8vIEV4cG9ydGluZyBvbmx5IHNvIHNwZWNzIGNhbiBjbGVhciB1cCBhZnRlciB0aGVtc2VsdmVzIGZ1bGx5XG5cbmtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbCA9IG5ldyAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBkb21EYXRhS2V5ID0ga28udXRpbHMuZG9tRGF0YS5uZXh0S2V5KCk7XG4gICAgdmFyIGNsZWFuYWJsZU5vZGVUeXBlcyA9IHsgMTogdHJ1ZSwgODogdHJ1ZSwgOTogdHJ1ZSB9OyAgICAgICAvLyBFbGVtZW50LCBDb21tZW50LCBEb2N1bWVudFxuICAgIHZhciBjbGVhbmFibGVOb2RlVHlwZXNXaXRoRGVzY2VuZGFudHMgPSB7IDE6IHRydWUsIDk6IHRydWUgfTsgLy8gRWxlbWVudCwgRG9jdW1lbnRcblxuICAgIGZ1bmN0aW9uIGdldERpc3Bvc2VDYWxsYmFja3NDb2xsZWN0aW9uKG5vZGUsIGNyZWF0ZUlmTm90Rm91bmQpIHtcbiAgICAgICAgdmFyIGFsbERpc3Bvc2VDYWxsYmFja3MgPSBrby51dGlscy5kb21EYXRhLmdldChub2RlLCBkb21EYXRhS2V5KTtcbiAgICAgICAgaWYgKChhbGxEaXNwb3NlQ2FsbGJhY2tzID09PSB1bmRlZmluZWQpICYmIGNyZWF0ZUlmTm90Rm91bmQpIHtcbiAgICAgICAgICAgIGFsbERpc3Bvc2VDYWxsYmFja3MgPSBbXTtcbiAgICAgICAgICAgIGtvLnV0aWxzLmRvbURhdGEuc2V0KG5vZGUsIGRvbURhdGFLZXksIGFsbERpc3Bvc2VDYWxsYmFja3MpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbGxEaXNwb3NlQ2FsbGJhY2tzO1xuICAgIH1cbiAgICBmdW5jdGlvbiBkZXN0cm95Q2FsbGJhY2tzQ29sbGVjdGlvbihub2RlKSB7XG4gICAgICAgIGtvLnV0aWxzLmRvbURhdGEuc2V0KG5vZGUsIGRvbURhdGFLZXksIHVuZGVmaW5lZCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYW5TaW5nbGVOb2RlKG5vZGUpIHtcbiAgICAgICAgLy8gUnVuIGFsbCB0aGUgZGlzcG9zZSBjYWxsYmFja3NcbiAgICAgICAgdmFyIGNhbGxiYWNrcyA9IGdldERpc3Bvc2VDYWxsYmFja3NDb2xsZWN0aW9uKG5vZGUsIGZhbHNlKTtcbiAgICAgICAgaWYgKGNhbGxiYWNrcykge1xuICAgICAgICAgICAgY2FsbGJhY2tzID0gY2FsbGJhY2tzLnNsaWNlKDApOyAvLyBDbG9uZSwgYXMgdGhlIGFycmF5IG1heSBiZSBtb2RpZmllZCBkdXJpbmcgaXRlcmF0aW9uICh0eXBpY2FsbHksIGNhbGxiYWNrcyB3aWxsIHJlbW92ZSB0aGVtc2VsdmVzKVxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICAgICAgY2FsbGJhY2tzW2ldKG5vZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRXJhc2UgdGhlIERPTSBkYXRhXG4gICAgICAgIGtvLnV0aWxzLmRvbURhdGEuY2xlYXIobm9kZSk7XG5cbiAgICAgICAgLy8gUGVyZm9ybSBjbGVhbnVwIG5lZWRlZCBieSBleHRlcm5hbCBsaWJyYXJpZXMgKGN1cnJlbnRseSBvbmx5IGpRdWVyeSwgYnV0IGNhbiBiZSBleHRlbmRlZClcbiAgICAgICAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsW1wiY2xlYW5FeHRlcm5hbERhdGFcIl0obm9kZSk7XG5cbiAgICAgICAgLy8gQ2xlYXIgYW55IGltbWVkaWF0ZS1jaGlsZCBjb21tZW50IG5vZGVzLCBhcyB0aGVzZSB3b3VsZG4ndCBoYXZlIGJlZW4gZm91bmQgYnlcbiAgICAgICAgLy8gbm9kZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcIipcIikgaW4gY2xlYW5Ob2RlKCkgKGNvbW1lbnQgbm9kZXMgYXJlbid0IGVsZW1lbnRzKVxuICAgICAgICBpZiAoY2xlYW5hYmxlTm9kZVR5cGVzV2l0aERlc2NlbmRhbnRzW25vZGUubm9kZVR5cGVdKVxuICAgICAgICAgICAgY2xlYW5JbW1lZGlhdGVDb21tZW50VHlwZUNoaWxkcmVuKG5vZGUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFuSW1tZWRpYXRlQ29tbWVudFR5cGVDaGlsZHJlbihub2RlV2l0aENoaWxkcmVuKSB7XG4gICAgICAgIHZhciBjaGlsZCwgbmV4dENoaWxkID0gbm9kZVdpdGhDaGlsZHJlbi5maXJzdENoaWxkO1xuICAgICAgICB3aGlsZSAoY2hpbGQgPSBuZXh0Q2hpbGQpIHtcbiAgICAgICAgICAgIG5leHRDaGlsZCA9IGNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgaWYgKGNoaWxkLm5vZGVUeXBlID09PSA4KVxuICAgICAgICAgICAgICAgIGNsZWFuU2luZ2xlTm9kZShjaGlsZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBhZGREaXNwb3NlQ2FsbGJhY2sgOiBmdW5jdGlvbihub2RlLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuICAgICAgICAgICAgZ2V0RGlzcG9zZUNhbGxiYWNrc0NvbGxlY3Rpb24obm9kZSwgdHJ1ZSkucHVzaChjYWxsYmFjayk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVtb3ZlRGlzcG9zZUNhbGxiYWNrIDogZnVuY3Rpb24obm9kZSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHZhciBjYWxsYmFja3NDb2xsZWN0aW9uID0gZ2V0RGlzcG9zZUNhbGxiYWNrc0NvbGxlY3Rpb24obm9kZSwgZmFsc2UpO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrc0NvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBrby51dGlscy5hcnJheVJlbW92ZUl0ZW0oY2FsbGJhY2tzQ29sbGVjdGlvbiwgY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFja3NDb2xsZWN0aW9uLmxlbmd0aCA9PSAwKVxuICAgICAgICAgICAgICAgICAgICBkZXN0cm95Q2FsbGJhY2tzQ29sbGVjdGlvbihub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBjbGVhbk5vZGUgOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICAvLyBGaXJzdCBjbGVhbiB0aGlzIG5vZGUsIHdoZXJlIGFwcGxpY2FibGVcbiAgICAgICAgICAgIGlmIChjbGVhbmFibGVOb2RlVHlwZXNbbm9kZS5ub2RlVHlwZV0pIHtcbiAgICAgICAgICAgICAgICBjbGVhblNpbmdsZU5vZGUobm9kZSk7XG5cbiAgICAgICAgICAgICAgICAvLyAuLi4gdGhlbiBpdHMgZGVzY2VuZGFudHMsIHdoZXJlIGFwcGxpY2FibGVcbiAgICAgICAgICAgICAgICBpZiAoY2xlYW5hYmxlTm9kZVR5cGVzV2l0aERlc2NlbmRhbnRzW25vZGUubm9kZVR5cGVdKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENsb25lIHRoZSBkZXNjZW5kYW50cyBsaXN0IGluIGNhc2UgaXQgY2hhbmdlcyBkdXJpbmcgaXRlcmF0aW9uXG4gICAgICAgICAgICAgICAgICAgIHZhciBkZXNjZW5kYW50cyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBrby51dGlscy5hcnJheVB1c2hBbGwoZGVzY2VuZGFudHMsIG5vZGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCIqXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBkZXNjZW5kYW50cy5sZW5ndGg7IGkgPCBqOyBpKyspXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhblNpbmdsZU5vZGUoZGVzY2VuZGFudHNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBub2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlbW92ZU5vZGUgOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICBrby5jbGVhbk5vZGUobm9kZSk7XG4gICAgICAgICAgICBpZiAobm9kZS5wYXJlbnROb2RlKVxuICAgICAgICAgICAgICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbiAgICAgICAgfSxcblxuICAgICAgICBcImNsZWFuRXh0ZXJuYWxEYXRhXCIgOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgLy8gU3BlY2lhbCBzdXBwb3J0IGZvciBqUXVlcnkgaGVyZSBiZWNhdXNlIGl0J3Mgc28gY29tbW9ubHkgdXNlZC5cbiAgICAgICAgICAgIC8vIE1hbnkgalF1ZXJ5IHBsdWdpbnMgKGluY2x1ZGluZyBqcXVlcnkudG1wbCkgc3RvcmUgZGF0YSB1c2luZyBqUXVlcnkncyBlcXVpdmFsZW50IG9mIGRvbURhdGFcbiAgICAgICAgICAgIC8vIHNvIG5vdGlmeSBpdCB0byB0ZWFyIGRvd24gYW55IHJlc291cmNlcyBhc3NvY2lhdGVkIHdpdGggdGhlIG5vZGUgJiBkZXNjZW5kYW50cyBoZXJlLlxuICAgICAgICAgICAgaWYgKGpRdWVyeUluc3RhbmNlICYmICh0eXBlb2YgalF1ZXJ5SW5zdGFuY2VbJ2NsZWFuRGF0YSddID09IFwiZnVuY3Rpb25cIikpXG4gICAgICAgICAgICAgICAgalF1ZXJ5SW5zdGFuY2VbJ2NsZWFuRGF0YSddKFtub2RlXSk7XG4gICAgICAgIH1cbiAgICB9XG59KSgpO1xua28uY2xlYW5Ob2RlID0ga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmNsZWFuTm9kZTsgLy8gU2hvcnRoYW5kIG5hbWUgZm9yIGNvbnZlbmllbmNlXG5rby5yZW1vdmVOb2RlID0ga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLnJlbW92ZU5vZGU7IC8vIFNob3J0aGFuZCBuYW1lIGZvciBjb252ZW5pZW5jZVxua28uZXhwb3J0U3ltYm9sKCdjbGVhbk5vZGUnLCBrby5jbGVhbk5vZGUpO1xua28uZXhwb3J0U3ltYm9sKCdyZW1vdmVOb2RlJywga28ucmVtb3ZlTm9kZSk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLmRvbU5vZGVEaXNwb3NhbCcsIGtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbCk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLmRvbU5vZGVEaXNwb3NhbC5hZGREaXNwb3NlQ2FsbGJhY2snLCBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwuYWRkRGlzcG9zZUNhbGxiYWNrKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuZG9tTm9kZURpc3Bvc2FsLnJlbW92ZURpc3Bvc2VDYWxsYmFjaycsIGtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbC5yZW1vdmVEaXNwb3NlQ2FsbGJhY2spO1xuKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbGVhZGluZ0NvbW1lbnRSZWdleCA9IC9eKFxccyopPCEtLSguKj8pLS0+LztcblxuICAgIGZ1bmN0aW9uIHNpbXBsZUh0bWxQYXJzZShodG1sKSB7XG4gICAgICAgIC8vIEJhc2VkIG9uIGpRdWVyeSdzIFwiY2xlYW5cIiBmdW5jdGlvbiwgYnV0IG9ubHkgYWNjb3VudGluZyBmb3IgdGFibGUtcmVsYXRlZCBlbGVtZW50cy5cbiAgICAgICAgLy8gSWYgeW91IGhhdmUgcmVmZXJlbmNlZCBqUXVlcnksIHRoaXMgd29uJ3QgYmUgdXNlZCBhbnl3YXkgLSBLTyB3aWxsIHVzZSBqUXVlcnkncyBcImNsZWFuXCIgZnVuY3Rpb24gZGlyZWN0bHlcblxuICAgICAgICAvLyBOb3RlIHRoYXQgdGhlcmUncyBzdGlsbCBhbiBpc3N1ZSBpbiBJRSA8IDkgd2hlcmVieSBpdCB3aWxsIGRpc2NhcmQgY29tbWVudCBub2RlcyB0aGF0IGFyZSB0aGUgZmlyc3QgY2hpbGQgb2ZcbiAgICAgICAgLy8gYSBkZXNjZW5kYW50IG5vZGUuIEZvciBleGFtcGxlOiBcIjxkaXY+PCEtLSBteWNvbW1lbnQgLS0+YWJjPC9kaXY+XCIgd2lsbCBnZXQgcGFyc2VkIGFzIFwiPGRpdj5hYmM8L2Rpdj5cIlxuICAgICAgICAvLyBUaGlzIHdvbid0IGFmZmVjdCBhbnlvbmUgd2hvIGhhcyByZWZlcmVuY2VkIGpRdWVyeSwgYW5kIHRoZXJlJ3MgYWx3YXlzIHRoZSB3b3JrYXJvdW5kIG9mIGluc2VydGluZyBhIGR1bW15IG5vZGVcbiAgICAgICAgLy8gKHBvc3NpYmx5IGEgdGV4dCBub2RlKSBpbiBmcm9udCBvZiB0aGUgY29tbWVudC4gU28sIEtPIGRvZXMgbm90IGF0dGVtcHQgdG8gd29ya2Fyb3VuZCB0aGlzIElFIGlzc3VlIGF1dG9tYXRpY2FsbHkgYXQgcHJlc2VudC5cblxuICAgICAgICAvLyBUcmltIHdoaXRlc3BhY2UsIG90aGVyd2lzZSBpbmRleE9mIHdvbid0IHdvcmsgYXMgZXhwZWN0ZWRcbiAgICAgICAgdmFyIHRhZ3MgPSBrby51dGlscy5zdHJpbmdUcmltKGh0bWwpLnRvTG93ZXJDYXNlKCksIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICAgICAgLy8gRmluZHMgdGhlIGZpcnN0IG1hdGNoIGZyb20gdGhlIGxlZnQgY29sdW1uLCBhbmQgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBcIndyYXBcIiBkYXRhIGZyb20gdGhlIHJpZ2h0IGNvbHVtblxuICAgICAgICB2YXIgd3JhcCA9IHRhZ3MubWF0Y2goL148KHRoZWFkfHRib2R5fHRmb290KS8pICAgICAgICAgICAgICAmJiBbMSwgXCI8dGFibGU+XCIsIFwiPC90YWJsZT5cIl0gfHxcbiAgICAgICAgICAgICAgICAgICAhdGFncy5pbmRleE9mKFwiPHRyXCIpICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBbMiwgXCI8dGFibGU+PHRib2R5PlwiLCBcIjwvdGJvZHk+PC90YWJsZT5cIl0gfHxcbiAgICAgICAgICAgICAgICAgICAoIXRhZ3MuaW5kZXhPZihcIjx0ZFwiKSB8fCAhdGFncy5pbmRleE9mKFwiPHRoXCIpKSAgICYmIFszLCBcIjx0YWJsZT48dGJvZHk+PHRyPlwiLCBcIjwvdHI+PC90Ym9keT48L3RhYmxlPlwiXSB8fFxuICAgICAgICAgICAgICAgICAgIC8qIGFueXRoaW5nIGVsc2UgKi8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbMCwgXCJcIiwgXCJcIl07XG5cbiAgICAgICAgLy8gR28gdG8gaHRtbCBhbmQgYmFjaywgdGhlbiBwZWVsIG9mZiBleHRyYSB3cmFwcGVyc1xuICAgICAgICAvLyBOb3RlIHRoYXQgd2UgYWx3YXlzIHByZWZpeCB3aXRoIHNvbWUgZHVtbXkgdGV4dCwgYmVjYXVzZSBvdGhlcndpc2UsIElFPDkgd2lsbCBzdHJpcCBvdXQgbGVhZGluZyBjb21tZW50IG5vZGVzIGluIGRlc2NlbmRhbnRzLiBUb3RhbCBtYWRuZXNzLlxuICAgICAgICB2YXIgbWFya3VwID0gXCJpZ25vcmVkPGRpdj5cIiArIHdyYXBbMV0gKyBodG1sICsgd3JhcFsyXSArIFwiPC9kaXY+XCI7XG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93Wydpbm5lclNoaXYnXSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZCh3aW5kb3dbJ2lubmVyU2hpdiddKG1hcmt1cCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGl2LmlubmVySFRNTCA9IG1hcmt1cDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1vdmUgdG8gdGhlIHJpZ2h0IGRlcHRoXG4gICAgICAgIHdoaWxlICh3cmFwWzBdLS0pXG4gICAgICAgICAgICBkaXYgPSBkaXYubGFzdENoaWxkO1xuXG4gICAgICAgIHJldHVybiBrby51dGlscy5tYWtlQXJyYXkoZGl2Lmxhc3RDaGlsZC5jaGlsZE5vZGVzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBqUXVlcnlIdG1sUGFyc2UoaHRtbCkge1xuICAgICAgICAvLyBqUXVlcnkncyBcInBhcnNlSFRNTFwiIGZ1bmN0aW9uIHdhcyBpbnRyb2R1Y2VkIGluIGpRdWVyeSAxLjguMCBhbmQgaXMgYSBkb2N1bWVudGVkIHB1YmxpYyBBUEkuXG4gICAgICAgIGlmIChqUXVlcnlJbnN0YW5jZVsncGFyc2VIVE1MJ10pIHtcbiAgICAgICAgICAgIHJldHVybiBqUXVlcnlJbnN0YW5jZVsncGFyc2VIVE1MJ10oaHRtbCkgfHwgW107IC8vIEVuc3VyZSB3ZSBhbHdheXMgcmV0dXJuIGFuIGFycmF5IGFuZCBuZXZlciBudWxsXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBGb3IgalF1ZXJ5IDwgMS44LjAsIHdlIGZhbGwgYmFjayBvbiB0aGUgdW5kb2N1bWVudGVkIGludGVybmFsIFwiY2xlYW5cIiBmdW5jdGlvbi5cbiAgICAgICAgICAgIHZhciBlbGVtcyA9IGpRdWVyeUluc3RhbmNlWydjbGVhbiddKFtodG1sXSk7XG5cbiAgICAgICAgICAgIC8vIEFzIG9mIGpRdWVyeSAxLjcuMSwgalF1ZXJ5IHBhcnNlcyB0aGUgSFRNTCBieSBhcHBlbmRpbmcgaXQgdG8gc29tZSBkdW1teSBwYXJlbnQgbm9kZXMgaGVsZCBpbiBhbiBpbi1tZW1vcnkgZG9jdW1lbnQgZnJhZ21lbnQuXG4gICAgICAgICAgICAvLyBVbmZvcnR1bmF0ZWx5LCBpdCBuZXZlciBjbGVhcnMgdGhlIGR1bW15IHBhcmVudCBub2RlcyBmcm9tIHRoZSBkb2N1bWVudCBmcmFnbWVudCwgc28gaXQgbGVha3MgbWVtb3J5IG92ZXIgdGltZS5cbiAgICAgICAgICAgIC8vIEZpeCB0aGlzIGJ5IGZpbmRpbmcgdGhlIHRvcC1tb3N0IGR1bW15IHBhcmVudCBlbGVtZW50LCBhbmQgZGV0YWNoaW5nIGl0IGZyb20gaXRzIG93bmVyIGZyYWdtZW50LlxuICAgICAgICAgICAgaWYgKGVsZW1zICYmIGVsZW1zWzBdKSB7XG4gICAgICAgICAgICAgICAgLy8gRmluZCB0aGUgdG9wLW1vc3QgcGFyZW50IGVsZW1lbnQgdGhhdCdzIGEgZGlyZWN0IGNoaWxkIG9mIGEgZG9jdW1lbnQgZnJhZ21lbnRcbiAgICAgICAgICAgICAgICB2YXIgZWxlbSA9IGVsZW1zWzBdO1xuICAgICAgICAgICAgICAgIHdoaWxlIChlbGVtLnBhcmVudE5vZGUgJiYgZWxlbS5wYXJlbnROb2RlLm5vZGVUeXBlICE9PSAxMSAvKiBpLmUuLCBEb2N1bWVudEZyYWdtZW50ICovKVxuICAgICAgICAgICAgICAgICAgICBlbGVtID0gZWxlbS5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIC8vIC4uLiB0aGVuIGRldGFjaCBpdFxuICAgICAgICAgICAgICAgIGlmIChlbGVtLnBhcmVudE5vZGUpXG4gICAgICAgICAgICAgICAgICAgIGVsZW0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGVsZW1zO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAga28udXRpbHMucGFyc2VIdG1sRnJhZ21lbnQgPSBmdW5jdGlvbihodG1sKSB7XG4gICAgICAgIHJldHVybiBqUXVlcnlJbnN0YW5jZSA/IGpRdWVyeUh0bWxQYXJzZShodG1sKSAgIC8vIEFzIGJlbG93LCBiZW5lZml0IGZyb20galF1ZXJ5J3Mgb3B0aW1pc2F0aW9ucyB3aGVyZSBwb3NzaWJsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBzaW1wbGVIdG1sUGFyc2UoaHRtbCk7ICAvLyAuLi4gb3RoZXJ3aXNlLCB0aGlzIHNpbXBsZSBsb2dpYyB3aWxsIGRvIGluIG1vc3QgY29tbW9uIGNhc2VzLlxuICAgIH07XG5cbiAgICBrby51dGlscy5zZXRIdG1sID0gZnVuY3Rpb24obm9kZSwgaHRtbCkge1xuICAgICAgICBrby51dGlscy5lbXB0eURvbU5vZGUobm9kZSk7XG5cbiAgICAgICAgLy8gVGhlcmUncyBubyBsZWdpdGltYXRlIHJlYXNvbiB0byBkaXNwbGF5IGEgc3RyaW5naWZpZWQgb2JzZXJ2YWJsZSB3aXRob3V0IHVud3JhcHBpbmcgaXQsIHNvIHdlJ2xsIHVud3JhcCBpdFxuICAgICAgICBodG1sID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShodG1sKTtcblxuICAgICAgICBpZiAoKGh0bWwgIT09IG51bGwpICYmIChodG1sICE9PSB1bmRlZmluZWQpKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGh0bWwgIT0gJ3N0cmluZycpXG4gICAgICAgICAgICAgICAgaHRtbCA9IGh0bWwudG9TdHJpbmcoKTtcblxuICAgICAgICAgICAgLy8galF1ZXJ5IGNvbnRhaW5zIGEgbG90IG9mIHNvcGhpc3RpY2F0ZWQgY29kZSB0byBwYXJzZSBhcmJpdHJhcnkgSFRNTCBmcmFnbWVudHMsXG4gICAgICAgICAgICAvLyBmb3IgZXhhbXBsZSA8dHI+IGVsZW1lbnRzIHdoaWNoIGFyZSBub3Qgbm9ybWFsbHkgYWxsb3dlZCB0byBleGlzdCBvbiB0aGVpciBvd24uXG4gICAgICAgICAgICAvLyBJZiB5b3UndmUgcmVmZXJlbmNlZCBqUXVlcnkgd2UnbGwgdXNlIHRoYXQgcmF0aGVyIHRoYW4gZHVwbGljYXRpbmcgaXRzIGNvZGUuXG4gICAgICAgICAgICBpZiAoalF1ZXJ5SW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICBqUXVlcnlJbnN0YW5jZShub2RlKVsnaHRtbCddKGh0bWwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyAuLi4gb3RoZXJ3aXNlLCB1c2UgS08ncyBvd24gcGFyc2luZyBsb2dpYy5cbiAgICAgICAgICAgICAgICB2YXIgcGFyc2VkTm9kZXMgPSBrby51dGlscy5wYXJzZUh0bWxGcmFnbWVudChodG1sKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcnNlZE5vZGVzLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgICAgICAgICBub2RlLmFwcGVuZENoaWxkKHBhcnNlZE5vZGVzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuXG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLnBhcnNlSHRtbEZyYWdtZW50Jywga28udXRpbHMucGFyc2VIdG1sRnJhZ21lbnQpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5zZXRIdG1sJywga28udXRpbHMuc2V0SHRtbCk7XG5cbmtvLm1lbW9pemF0aW9uID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWVtb3MgPSB7fTtcblxuICAgIGZ1bmN0aW9uIHJhbmRvbU1heDhIZXhDaGFycygpIHtcbiAgICAgICAgcmV0dXJuICgoKDEgKyBNYXRoLnJhbmRvbSgpKSAqIDB4MTAwMDAwMDAwKSB8IDApLnRvU3RyaW5nKDE2KS5zdWJzdHJpbmcoMSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tSWQoKSB7XG4gICAgICAgIHJldHVybiByYW5kb21NYXg4SGV4Q2hhcnMoKSArIHJhbmRvbU1heDhIZXhDaGFycygpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBmaW5kTWVtb05vZGVzKHJvb3ROb2RlLCBhcHBlbmRUb0FycmF5KSB7XG4gICAgICAgIGlmICghcm9vdE5vZGUpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGlmIChyb290Tm9kZS5ub2RlVHlwZSA9PSA4KSB7XG4gICAgICAgICAgICB2YXIgbWVtb0lkID0ga28ubWVtb2l6YXRpb24ucGFyc2VNZW1vVGV4dChyb290Tm9kZS5ub2RlVmFsdWUpO1xuICAgICAgICAgICAgaWYgKG1lbW9JZCAhPSBudWxsKVxuICAgICAgICAgICAgICAgIGFwcGVuZFRvQXJyYXkucHVzaCh7IGRvbU5vZGU6IHJvb3ROb2RlLCBtZW1vSWQ6IG1lbW9JZCB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChyb290Tm9kZS5ub2RlVHlwZSA9PSAxKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgY2hpbGROb2RlcyA9IHJvb3ROb2RlLmNoaWxkTm9kZXMsIGogPSBjaGlsZE5vZGVzLmxlbmd0aDsgaSA8IGo7IGkrKylcbiAgICAgICAgICAgICAgICBmaW5kTWVtb05vZGVzKGNoaWxkTm9kZXNbaV0sIGFwcGVuZFRvQXJyYXkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbWVtb2l6ZTogZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9IFwiZnVuY3Rpb25cIilcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJZb3UgY2FuIG9ubHkgcGFzcyBhIGZ1bmN0aW9uIHRvIGtvLm1lbW9pemF0aW9uLm1lbW9pemUoKVwiKTtcbiAgICAgICAgICAgIHZhciBtZW1vSWQgPSBnZW5lcmF0ZVJhbmRvbUlkKCk7XG4gICAgICAgICAgICBtZW1vc1ttZW1vSWRdID0gY2FsbGJhY2s7XG4gICAgICAgICAgICByZXR1cm4gXCI8IS0tW2tvX21lbW86XCIgKyBtZW1vSWQgKyBcIl0tLT5cIjtcbiAgICAgICAgfSxcblxuICAgICAgICB1bm1lbW9pemU6IGZ1bmN0aW9uIChtZW1vSWQsIGNhbGxiYWNrUGFyYW1zKSB7XG4gICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBtZW1vc1ttZW1vSWRdO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhbnkgbWVtbyB3aXRoIElEIFwiICsgbWVtb0lkICsgXCIuIFBlcmhhcHMgaXQncyBhbHJlYWR5IGJlZW4gdW5tZW1vaXplZC5cIik7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KG51bGwsIGNhbGxiYWNrUGFyYW1zIHx8IFtdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbmFsbHkgeyBkZWxldGUgbWVtb3NbbWVtb0lkXTsgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHVubWVtb2l6ZURvbU5vZGVBbmREZXNjZW5kYW50czogZnVuY3Rpb24gKGRvbU5vZGUsIGV4dHJhQ2FsbGJhY2tQYXJhbXNBcnJheSkge1xuICAgICAgICAgICAgdmFyIG1lbW9zID0gW107XG4gICAgICAgICAgICBmaW5kTWVtb05vZGVzKGRvbU5vZGUsIG1lbW9zKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gbWVtb3MubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5vZGUgPSBtZW1vc1tpXS5kb21Ob2RlO1xuICAgICAgICAgICAgICAgIHZhciBjb21iaW5lZFBhcmFtcyA9IFtub2RlXTtcbiAgICAgICAgICAgICAgICBpZiAoZXh0cmFDYWxsYmFja1BhcmFtc0FycmF5KVxuICAgICAgICAgICAgICAgICAgICBrby51dGlscy5hcnJheVB1c2hBbGwoY29tYmluZWRQYXJhbXMsIGV4dHJhQ2FsbGJhY2tQYXJhbXNBcnJheSk7XG4gICAgICAgICAgICAgICAga28ubWVtb2l6YXRpb24udW5tZW1vaXplKG1lbW9zW2ldLm1lbW9JZCwgY29tYmluZWRQYXJhbXMpO1xuICAgICAgICAgICAgICAgIG5vZGUubm9kZVZhbHVlID0gXCJcIjsgLy8gTmV1dGVyIHRoaXMgbm9kZSBzbyB3ZSBkb24ndCB0cnkgdG8gdW5tZW1vaXplIGl0IGFnYWluXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUucGFyZW50Tm9kZSlcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpOyAvLyBJZiBwb3NzaWJsZSwgZXJhc2UgaXQgdG90YWxseSAobm90IGFsd2F5cyBwb3NzaWJsZSAtIHNvbWVvbmUgZWxzZSBtaWdodCBqdXN0IGhvbGQgYSByZWZlcmVuY2UgdG8gaXQgdGhlbiBjYWxsIHVubWVtb2l6ZURvbU5vZGVBbmREZXNjZW5kYW50cyBhZ2FpbilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBwYXJzZU1lbW9UZXh0OiBmdW5jdGlvbiAobWVtb1RleHQpIHtcbiAgICAgICAgICAgIHZhciBtYXRjaCA9IG1lbW9UZXh0Lm1hdGNoKC9eXFxba29fbWVtb1xcOiguKj8pXFxdJC8pO1xuICAgICAgICAgICAgcmV0dXJuIG1hdGNoID8gbWF0Y2hbMV0gOiBudWxsO1xuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG5cbmtvLmV4cG9ydFN5bWJvbCgnbWVtb2l6YXRpb24nLCBrby5tZW1vaXphdGlvbik7XG5rby5leHBvcnRTeW1ib2woJ21lbW9pemF0aW9uLm1lbW9pemUnLCBrby5tZW1vaXphdGlvbi5tZW1vaXplKTtcbmtvLmV4cG9ydFN5bWJvbCgnbWVtb2l6YXRpb24udW5tZW1vaXplJywga28ubWVtb2l6YXRpb24udW5tZW1vaXplKTtcbmtvLmV4cG9ydFN5bWJvbCgnbWVtb2l6YXRpb24ucGFyc2VNZW1vVGV4dCcsIGtvLm1lbW9pemF0aW9uLnBhcnNlTWVtb1RleHQpO1xua28uZXhwb3J0U3ltYm9sKCdtZW1vaXphdGlvbi51bm1lbW9pemVEb21Ob2RlQW5kRGVzY2VuZGFudHMnLCBrby5tZW1vaXphdGlvbi51bm1lbW9pemVEb21Ob2RlQW5kRGVzY2VuZGFudHMpO1xua28uZXh0ZW5kZXJzID0ge1xuICAgICd0aHJvdHRsZSc6IGZ1bmN0aW9uKHRhcmdldCwgdGltZW91dCkge1xuICAgICAgICAvLyBUaHJvdHRsaW5nIG1lYW5zIHR3byB0aGluZ3M6XG5cbiAgICAgICAgLy8gKDEpIEZvciBkZXBlbmRlbnQgb2JzZXJ2YWJsZXMsIHdlIHRocm90dGxlICpldmFsdWF0aW9ucyogc28gdGhhdCwgbm8gbWF0dGVyIGhvdyBmYXN0IGl0cyBkZXBlbmRlbmNpZXNcbiAgICAgICAgLy8gICAgIG5vdGlmeSB1cGRhdGVzLCB0aGUgdGFyZ2V0IGRvZXNuJ3QgcmUtZXZhbHVhdGUgKGFuZCBoZW5jZSBkb2Vzbid0IG5vdGlmeSkgZmFzdGVyIHRoYW4gYSBjZXJ0YWluIHJhdGVcbiAgICAgICAgdGFyZ2V0Wyd0aHJvdHRsZUV2YWx1YXRpb24nXSA9IHRpbWVvdXQ7XG5cbiAgICAgICAgLy8gKDIpIEZvciB3cml0YWJsZSB0YXJnZXRzIChvYnNlcnZhYmxlcywgb3Igd3JpdGFibGUgZGVwZW5kZW50IG9ic2VydmFibGVzKSwgd2UgdGhyb3R0bGUgKndyaXRlcypcbiAgICAgICAgLy8gICAgIHNvIHRoZSB0YXJnZXQgY2Fubm90IGNoYW5nZSB2YWx1ZSBzeW5jaHJvbm91c2x5IG9yIGZhc3RlciB0aGFuIGEgY2VydGFpbiByYXRlXG4gICAgICAgIHZhciB3cml0ZVRpbWVvdXRJbnN0YW5jZSA9IG51bGw7XG4gICAgICAgIHJldHVybiBrby5kZXBlbmRlbnRPYnNlcnZhYmxlKHtcbiAgICAgICAgICAgICdyZWFkJzogdGFyZ2V0LFxuICAgICAgICAgICAgJ3dyaXRlJzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQod3JpdGVUaW1lb3V0SW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgIHdyaXRlVGltZW91dEluc3RhbmNlID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9LCB0aW1lb3V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgICdyYXRlTGltaXQnOiBmdW5jdGlvbih0YXJnZXQsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHRpbWVvdXQsIG1ldGhvZCwgbGltaXRGdW5jdGlvbjtcblxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBvcHRpb25zO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGltZW91dCA9IG9wdGlvbnNbJ3RpbWVvdXQnXTtcbiAgICAgICAgICAgIG1ldGhvZCA9IG9wdGlvbnNbJ21ldGhvZCddO1xuICAgICAgICB9XG5cbiAgICAgICAgbGltaXRGdW5jdGlvbiA9IG1ldGhvZCA9PSAnbm90aWZ5V2hlbkNoYW5nZXNTdG9wJyA/ICBkZWJvdW5jZSA6IHRocm90dGxlO1xuICAgICAgICB0YXJnZXQubGltaXQoZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHJldHVybiBsaW1pdEZ1bmN0aW9uKGNhbGxiYWNrLCB0aW1lb3V0KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgICdub3RpZnknOiBmdW5jdGlvbih0YXJnZXQsIG5vdGlmeVdoZW4pIHtcbiAgICAgICAgdGFyZ2V0W1wiZXF1YWxpdHlDb21wYXJlclwiXSA9IG5vdGlmeVdoZW4gPT0gXCJhbHdheXNcIiA/XG4gICAgICAgICAgICBudWxsIDogIC8vIG51bGwgZXF1YWxpdHlDb21wYXJlciBtZWFucyB0byBhbHdheXMgbm90aWZ5XG4gICAgICAgICAgICB2YWx1ZXNBcmVQcmltaXRpdmVBbmRFcXVhbDtcbiAgICB9XG59O1xuXG52YXIgcHJpbWl0aXZlVHlwZXMgPSB7ICd1bmRlZmluZWQnOjEsICdib29sZWFuJzoxLCAnbnVtYmVyJzoxLCAnc3RyaW5nJzoxIH07XG5mdW5jdGlvbiB2YWx1ZXNBcmVQcmltaXRpdmVBbmRFcXVhbChhLCBiKSB7XG4gICAgdmFyIG9sZFZhbHVlSXNQcmltaXRpdmUgPSAoYSA9PT0gbnVsbCkgfHwgKHR5cGVvZihhKSBpbiBwcmltaXRpdmVUeXBlcyk7XG4gICAgcmV0dXJuIG9sZFZhbHVlSXNQcmltaXRpdmUgPyAoYSA9PT0gYikgOiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gdGhyb3R0bGUoY2FsbGJhY2ssIHRpbWVvdXQpIHtcbiAgICB2YXIgdGltZW91dEluc3RhbmNlO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGltZW91dEluc3RhbmNlKSB7XG4gICAgICAgICAgICB0aW1lb3V0SW5zdGFuY2UgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRpbWVvdXRJbnN0YW5jZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfSwgdGltZW91dCk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5mdW5jdGlvbiBkZWJvdW5jZShjYWxsYmFjaywgdGltZW91dCkge1xuICAgIHZhciB0aW1lb3V0SW5zdGFuY2U7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJbnN0YW5jZSk7XG4gICAgICAgIHRpbWVvdXRJbnN0YW5jZSA9IHNldFRpbWVvdXQoY2FsbGJhY2ssIHRpbWVvdXQpO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGFwcGx5RXh0ZW5kZXJzKHJlcXVlc3RlZEV4dGVuZGVycykge1xuICAgIHZhciB0YXJnZXQgPSB0aGlzO1xuICAgIGlmIChyZXF1ZXN0ZWRFeHRlbmRlcnMpIHtcbiAgICAgICAga28udXRpbHMub2JqZWN0Rm9yRWFjaChyZXF1ZXN0ZWRFeHRlbmRlcnMsIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBleHRlbmRlckhhbmRsZXIgPSBrby5leHRlbmRlcnNba2V5XTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXh0ZW5kZXJIYW5kbGVyID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSBleHRlbmRlckhhbmRsZXIodGFyZ2V0LCB2YWx1ZSkgfHwgdGFyZ2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbn1cblxua28uZXhwb3J0U3ltYm9sKCdleHRlbmRlcnMnLCBrby5leHRlbmRlcnMpO1xuXG5rby5zdWJzY3JpcHRpb24gPSBmdW5jdGlvbiAodGFyZ2V0LCBjYWxsYmFjaywgZGlzcG9zZUNhbGxiYWNrKSB7XG4gICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIHRoaXMuZGlzcG9zZUNhbGxiYWNrID0gZGlzcG9zZUNhbGxiYWNrO1xuICAgIHRoaXMuaXNEaXNwb3NlZCA9IGZhbHNlO1xuICAgIGtvLmV4cG9ydFByb3BlcnR5KHRoaXMsICdkaXNwb3NlJywgdGhpcy5kaXNwb3NlKTtcbn07XG5rby5zdWJzY3JpcHRpb24ucHJvdG90eXBlLmRpc3Bvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5pc0Rpc3Bvc2VkID0gdHJ1ZTtcbiAgICB0aGlzLmRpc3Bvc2VDYWxsYmFjaygpO1xufTtcblxua28uc3Vic2NyaWJhYmxlID0gZnVuY3Rpb24gKCkge1xuICAgIGtvLnV0aWxzLnNldFByb3RvdHlwZU9mT3JFeHRlbmQodGhpcywga28uc3Vic2NyaWJhYmxlWydmbiddKTtcbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zID0ge307XG59XG5cbnZhciBkZWZhdWx0RXZlbnQgPSBcImNoYW5nZVwiO1xuXG52YXIga29fc3Vic2NyaWJhYmxlX2ZuID0ge1xuICAgIHN1YnNjcmliZTogZnVuY3Rpb24gKGNhbGxiYWNrLCBjYWxsYmFja1RhcmdldCwgZXZlbnQpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGV2ZW50ID0gZXZlbnQgfHwgZGVmYXVsdEV2ZW50O1xuICAgICAgICB2YXIgYm91bmRDYWxsYmFjayA9IGNhbGxiYWNrVGFyZ2V0ID8gY2FsbGJhY2suYmluZChjYWxsYmFja1RhcmdldCkgOiBjYWxsYmFjaztcblxuICAgICAgICB2YXIgc3Vic2NyaXB0aW9uID0gbmV3IGtvLnN1YnNjcmlwdGlvbihzZWxmLCBib3VuZENhbGxiYWNrLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBrby51dGlscy5hcnJheVJlbW92ZUl0ZW0oc2VsZi5fc3Vic2NyaXB0aW9uc1tldmVudF0sIHN1YnNjcmlwdGlvbik7XG4gICAgICAgICAgICBpZiAoc2VsZi5hZnRlclN1YnNjcmlwdGlvblJlbW92ZSlcbiAgICAgICAgICAgICAgICBzZWxmLmFmdGVyU3Vic2NyaXB0aW9uUmVtb3ZlKGV2ZW50KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHNlbGYuYmVmb3JlU3Vic2NyaXB0aW9uQWRkKVxuICAgICAgICAgICAgc2VsZi5iZWZvcmVTdWJzY3JpcHRpb25BZGQoZXZlbnQpO1xuXG4gICAgICAgIGlmICghc2VsZi5fc3Vic2NyaXB0aW9uc1tldmVudF0pXG4gICAgICAgICAgICBzZWxmLl9zdWJzY3JpcHRpb25zW2V2ZW50XSA9IFtdO1xuICAgICAgICBzZWxmLl9zdWJzY3JpcHRpb25zW2V2ZW50XS5wdXNoKHN1YnNjcmlwdGlvbik7XG5cbiAgICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgICB9LFxuXG4gICAgXCJub3RpZnlTdWJzY3JpYmVyc1wiOiBmdW5jdGlvbiAodmFsdWVUb05vdGlmeSwgZXZlbnQpIHtcbiAgICAgICAgZXZlbnQgPSBldmVudCB8fCBkZWZhdWx0RXZlbnQ7XG4gICAgICAgIGlmICh0aGlzLmhhc1N1YnNjcmlwdGlvbnNGb3JFdmVudChldmVudCkpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5iZWdpbigpOyAvLyBCZWdpbiBzdXBwcmVzc2luZyBkZXBlbmRlbmN5IGRldGVjdGlvbiAoYnkgc2V0dGluZyB0aGUgdG9wIGZyYW1lIHRvIHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBhID0gdGhpcy5fc3Vic2NyaXB0aW9uc1tldmVudF0uc2xpY2UoMCksIGkgPSAwLCBzdWJzY3JpcHRpb247IHN1YnNjcmlwdGlvbiA9IGFbaV07ICsraSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBJbiBjYXNlIGEgc3Vic2NyaXB0aW9uIHdhcyBkaXNwb3NlZCBkdXJpbmcgdGhlIGFycmF5Rm9yRWFjaCBjeWNsZSwgY2hlY2tcbiAgICAgICAgICAgICAgICAgICAgLy8gZm9yIGlzRGlzcG9zZWQgb24gZWFjaCBzdWJzY3JpcHRpb24gYmVmb3JlIGludm9raW5nIGl0cyBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXN1YnNjcmlwdGlvbi5pc0Rpc3Bvc2VkKVxuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLmNhbGxiYWNrKHZhbHVlVG9Ob3RpZnkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5lbmQoKTsgLy8gRW5kIHN1cHByZXNzaW5nIGRlcGVuZGVuY3kgZGV0ZWN0aW9uXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgbGltaXQ6IGZ1bmN0aW9uKGxpbWl0RnVuY3Rpb24pIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzLCBzZWxmSXNPYnNlcnZhYmxlID0ga28uaXNPYnNlcnZhYmxlKHNlbGYpLFxuICAgICAgICAgICAgaXNQZW5kaW5nLCBwcmV2aW91c1ZhbHVlLCBwZW5kaW5nVmFsdWUsIGJlZm9yZUNoYW5nZSA9ICdiZWZvcmVDaGFuZ2UnO1xuXG4gICAgICAgIGlmICghc2VsZi5fb3JpZ05vdGlmeVN1YnNjcmliZXJzKSB7XG4gICAgICAgICAgICBzZWxmLl9vcmlnTm90aWZ5U3Vic2NyaWJlcnMgPSBzZWxmW1wibm90aWZ5U3Vic2NyaWJlcnNcIl07XG4gICAgICAgICAgICBzZWxmW1wibm90aWZ5U3Vic2NyaWJlcnNcIl0gPSBmdW5jdGlvbih2YWx1ZSwgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWV2ZW50IHx8IGV2ZW50ID09PSBkZWZhdWx0RXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fcmF0ZUxpbWl0ZWRDaGFuZ2UodmFsdWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQgPT09IGJlZm9yZUNoYW5nZSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9yYXRlTGltaXRlZEJlZm9yZUNoYW5nZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fb3JpZ05vdGlmeVN1YnNjcmliZXJzKHZhbHVlLCBldmVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmaW5pc2ggPSBsaW1pdEZ1bmN0aW9uKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gSWYgYW4gb2JzZXJ2YWJsZSBwcm92aWRlZCBhIHJlZmVyZW5jZSB0byBpdHNlbGYsIGFjY2VzcyBpdCB0byBnZXQgdGhlIGxhdGVzdCB2YWx1ZS5cbiAgICAgICAgICAgIC8vIFRoaXMgYWxsb3dzIGNvbXB1dGVkIG9ic2VydmFibGVzIHRvIGRlbGF5IGNhbGN1bGF0aW5nIHRoZWlyIHZhbHVlIHVudGlsIG5lZWRlZC5cbiAgICAgICAgICAgIGlmIChzZWxmSXNPYnNlcnZhYmxlICYmIHBlbmRpbmdWYWx1ZSA9PT0gc2VsZikge1xuICAgICAgICAgICAgICAgIHBlbmRpbmdWYWx1ZSA9IHNlbGYoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlzUGVuZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHNlbGYuaXNEaWZmZXJlbnQocHJldmlvdXNWYWx1ZSwgcGVuZGluZ1ZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHNlbGYuX29yaWdOb3RpZnlTdWJzY3JpYmVycyhwcmV2aW91c1ZhbHVlID0gcGVuZGluZ1ZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2VsZi5fcmF0ZUxpbWl0ZWRDaGFuZ2UgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaXNQZW5kaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHBlbmRpbmdWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgZmluaXNoKCk7XG4gICAgICAgIH07XG4gICAgICAgIHNlbGYuX3JhdGVMaW1pdGVkQmVmb3JlQ2hhbmdlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmICghaXNQZW5kaW5nKSB7XG4gICAgICAgICAgICAgICAgcHJldmlvdXNWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHNlbGYuX29yaWdOb3RpZnlTdWJzY3JpYmVycyh2YWx1ZSwgYmVmb3JlQ2hhbmdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgaGFzU3Vic2NyaXB0aW9uc0ZvckV2ZW50OiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3Vic2NyaXB0aW9uc1tldmVudF0gJiYgdGhpcy5fc3Vic2NyaXB0aW9uc1tldmVudF0ubGVuZ3RoO1xuICAgIH0sXG5cbiAgICBnZXRTdWJzY3JpcHRpb25zQ291bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRvdGFsID0gMDtcbiAgICAgICAga28udXRpbHMub2JqZWN0Rm9yRWFjaCh0aGlzLl9zdWJzY3JpcHRpb25zLCBmdW5jdGlvbihldmVudE5hbWUsIHN1YnNjcmlwdGlvbnMpIHtcbiAgICAgICAgICAgIHRvdGFsICs9IHN1YnNjcmlwdGlvbnMubGVuZ3RoO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRvdGFsO1xuICAgIH0sXG5cbiAgICBpc0RpZmZlcmVudDogZnVuY3Rpb24ob2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgICAgIHJldHVybiAhdGhpc1snZXF1YWxpdHlDb21wYXJlciddIHx8ICF0aGlzWydlcXVhbGl0eUNvbXBhcmVyJ10ob2xkVmFsdWUsIG5ld1ZhbHVlKTtcbiAgICB9LFxuXG4gICAgZXh0ZW5kOiBhcHBseUV4dGVuZGVyc1xufTtcblxua28uZXhwb3J0UHJvcGVydHkoa29fc3Vic2NyaWJhYmxlX2ZuLCAnc3Vic2NyaWJlJywga29fc3Vic2NyaWJhYmxlX2ZuLnN1YnNjcmliZSk7XG5rby5leHBvcnRQcm9wZXJ0eShrb19zdWJzY3JpYmFibGVfZm4sICdleHRlbmQnLCBrb19zdWJzY3JpYmFibGVfZm4uZXh0ZW5kKTtcbmtvLmV4cG9ydFByb3BlcnR5KGtvX3N1YnNjcmliYWJsZV9mbiwgJ2dldFN1YnNjcmlwdGlvbnNDb3VudCcsIGtvX3N1YnNjcmliYWJsZV9mbi5nZXRTdWJzY3JpcHRpb25zQ291bnQpO1xuXG4vLyBGb3IgYnJvd3NlcnMgdGhhdCBzdXBwb3J0IHByb3RvIGFzc2lnbm1lbnQsIHdlIG92ZXJ3cml0ZSB0aGUgcHJvdG90eXBlIG9mIGVhY2hcbi8vIG9ic2VydmFibGUgaW5zdGFuY2UuIFNpbmNlIG9ic2VydmFibGVzIGFyZSBmdW5jdGlvbnMsIHdlIG5lZWQgRnVuY3Rpb24ucHJvdG90eXBlXG4vLyB0byBzdGlsbCBiZSBpbiB0aGUgcHJvdG90eXBlIGNoYWluLlxuaWYgKGtvLnV0aWxzLmNhblNldFByb3RvdHlwZSkge1xuICAgIGtvLnV0aWxzLnNldFByb3RvdHlwZU9mKGtvX3N1YnNjcmliYWJsZV9mbiwgRnVuY3Rpb24ucHJvdG90eXBlKTtcbn1cblxua28uc3Vic2NyaWJhYmxlWydmbiddID0ga29fc3Vic2NyaWJhYmxlX2ZuO1xuXG5cbmtvLmlzU3Vic2NyaWJhYmxlID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlICE9IG51bGwgJiYgdHlwZW9mIGluc3RhbmNlLnN1YnNjcmliZSA9PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIGluc3RhbmNlW1wibm90aWZ5U3Vic2NyaWJlcnNcIl0gPT0gXCJmdW5jdGlvblwiO1xufTtcblxua28uZXhwb3J0U3ltYm9sKCdzdWJzY3JpYmFibGUnLCBrby5zdWJzY3JpYmFibGUpO1xua28uZXhwb3J0U3ltYm9sKCdpc1N1YnNjcmliYWJsZScsIGtvLmlzU3Vic2NyaWJhYmxlKTtcblxua28uY29tcHV0ZWRDb250ZXh0ID0ga28uZGVwZW5kZW5jeURldGVjdGlvbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG91dGVyRnJhbWVzID0gW10sXG4gICAgICAgIGN1cnJlbnRGcmFtZSxcbiAgICAgICAgbGFzdElkID0gMDtcblxuICAgIC8vIFJldHVybiBhIHVuaXF1ZSBJRCB0aGF0IGNhbiBiZSBhc3NpZ25lZCB0byBhbiBvYnNlcnZhYmxlIGZvciBkZXBlbmRlbmN5IHRyYWNraW5nLlxuICAgIC8vIFRoZW9yZXRpY2FsbHksIHlvdSBjb3VsZCBldmVudHVhbGx5IG92ZXJmbG93IHRoZSBudW1iZXIgc3RvcmFnZSBzaXplLCByZXN1bHRpbmdcbiAgICAvLyBpbiBkdXBsaWNhdGUgSURzLiBCdXQgaW4gSmF2YVNjcmlwdCwgdGhlIGxhcmdlc3QgZXhhY3QgaW50ZWdyYWwgdmFsdWUgaXMgMl41M1xuICAgIC8vIG9yIDksMDA3LDE5OSwyNTQsNzQwLDk5Mi4gSWYgeW91IGNyZWF0ZWQgMSwwMDAsMDAwIElEcyBwZXIgc2Vjb25kLCBpdCB3b3VsZFxuICAgIC8vIHRha2Ugb3ZlciAyODUgeWVhcnMgdG8gcmVhY2ggdGhhdCBudW1iZXIuXG4gICAgLy8gUmVmZXJlbmNlIGh0dHA6Ly9ibG9nLnZqZXV4LmNvbS8yMDEwL2phdmFzY3JpcHQvamF2YXNjcmlwdC1tYXhfaW50LW51bWJlci1saW1pdHMuaHRtbFxuICAgIGZ1bmN0aW9uIGdldElkKCkge1xuICAgICAgICByZXR1cm4gKytsYXN0SWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYmVnaW4ob3B0aW9ucykge1xuICAgICAgICBvdXRlckZyYW1lcy5wdXNoKGN1cnJlbnRGcmFtZSk7XG4gICAgICAgIGN1cnJlbnRGcmFtZSA9IG9wdGlvbnM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZW5kKCkge1xuICAgICAgICBjdXJyZW50RnJhbWUgPSBvdXRlckZyYW1lcy5wb3AoKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBiZWdpbjogYmVnaW4sXG5cbiAgICAgICAgZW5kOiBlbmQsXG5cbiAgICAgICAgcmVnaXN0ZXJEZXBlbmRlbmN5OiBmdW5jdGlvbiAoc3Vic2NyaWJhYmxlKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudEZyYW1lKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFrby5pc1N1YnNjcmliYWJsZShzdWJzY3JpYmFibGUpKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJPbmx5IHN1YnNjcmliYWJsZSB0aGluZ3MgY2FuIGFjdCBhcyBkZXBlbmRlbmNpZXNcIik7XG4gICAgICAgICAgICAgICAgY3VycmVudEZyYW1lLmNhbGxiYWNrKHN1YnNjcmliYWJsZSwgc3Vic2NyaWJhYmxlLl9pZCB8fCAoc3Vic2NyaWJhYmxlLl9pZCA9IGdldElkKCkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBpZ25vcmU6IGZ1bmN0aW9uIChjYWxsYmFjaywgY2FsbGJhY2tUYXJnZXQsIGNhbGxiYWNrQXJncykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBiZWdpbigpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjay5hcHBseShjYWxsYmFja1RhcmdldCwgY2FsbGJhY2tBcmdzIHx8IFtdKTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgZW5kKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0RGVwZW5kZW5jaWVzQ291bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50RnJhbWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRGcmFtZS5jb21wdXRlZC5nZXREZXBlbmRlbmNpZXNDb3VudCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzSW5pdGlhbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudEZyYW1lKVxuICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50RnJhbWUuaXNJbml0aWFsO1xuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG5cbmtvLmV4cG9ydFN5bWJvbCgnY29tcHV0ZWRDb250ZXh0Jywga28uY29tcHV0ZWRDb250ZXh0KTtcbmtvLmV4cG9ydFN5bWJvbCgnY29tcHV0ZWRDb250ZXh0LmdldERlcGVuZGVuY2llc0NvdW50Jywga28uY29tcHV0ZWRDb250ZXh0LmdldERlcGVuZGVuY2llc0NvdW50KTtcbmtvLmV4cG9ydFN5bWJvbCgnY29tcHV0ZWRDb250ZXh0LmlzSW5pdGlhbCcsIGtvLmNvbXB1dGVkQ29udGV4dC5pc0luaXRpYWwpO1xua28uZXhwb3J0U3ltYm9sKCdjb21wdXRlZENvbnRleHQuaXNTbGVlcGluZycsIGtvLmNvbXB1dGVkQ29udGV4dC5pc1NsZWVwaW5nKTtcbmtvLm9ic2VydmFibGUgPSBmdW5jdGlvbiAoaW5pdGlhbFZhbHVlKSB7XG4gICAgdmFyIF9sYXRlc3RWYWx1ZSA9IGluaXRpYWxWYWx1ZTtcblxuICAgIGZ1bmN0aW9uIG9ic2VydmFibGUoKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgLy8gV3JpdGVcblxuICAgICAgICAgICAgLy8gSWdub3JlIHdyaXRlcyBpZiB0aGUgdmFsdWUgaGFzbid0IGNoYW5nZWRcbiAgICAgICAgICAgIGlmIChvYnNlcnZhYmxlLmlzRGlmZmVyZW50KF9sYXRlc3RWYWx1ZSwgYXJndW1lbnRzWzBdKSkge1xuICAgICAgICAgICAgICAgIG9ic2VydmFibGUudmFsdWVXaWxsTXV0YXRlKCk7XG4gICAgICAgICAgICAgICAgX2xhdGVzdFZhbHVlID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgICAgIGlmIChERUJVRykgb2JzZXJ2YWJsZS5fbGF0ZXN0VmFsdWUgPSBfbGF0ZXN0VmFsdWU7XG4gICAgICAgICAgICAgICAgb2JzZXJ2YWJsZS52YWx1ZUhhc011dGF0ZWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzOyAvLyBQZXJtaXRzIGNoYWluZWQgYXNzaWdubWVudHNcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIFJlYWRcbiAgICAgICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24ucmVnaXN0ZXJEZXBlbmRlbmN5KG9ic2VydmFibGUpOyAvLyBUaGUgY2FsbGVyIG9ubHkgbmVlZHMgdG8gYmUgbm90aWZpZWQgb2YgY2hhbmdlcyBpZiB0aGV5IGRpZCBhIFwicmVhZFwiIG9wZXJhdGlvblxuICAgICAgICAgICAgcmV0dXJuIF9sYXRlc3RWYWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBrby5zdWJzY3JpYmFibGUuY2FsbChvYnNlcnZhYmxlKTtcbiAgICBrby51dGlscy5zZXRQcm90b3R5cGVPZk9yRXh0ZW5kKG9ic2VydmFibGUsIGtvLm9ic2VydmFibGVbJ2ZuJ10pO1xuXG4gICAgaWYgKERFQlVHKSBvYnNlcnZhYmxlLl9sYXRlc3RWYWx1ZSA9IF9sYXRlc3RWYWx1ZTtcbiAgICBvYnNlcnZhYmxlLnBlZWsgPSBmdW5jdGlvbigpIHsgcmV0dXJuIF9sYXRlc3RWYWx1ZSB9O1xuICAgIG9ic2VydmFibGUudmFsdWVIYXNNdXRhdGVkID0gZnVuY3Rpb24gKCkgeyBvYnNlcnZhYmxlW1wibm90aWZ5U3Vic2NyaWJlcnNcIl0oX2xhdGVzdFZhbHVlKTsgfVxuICAgIG9ic2VydmFibGUudmFsdWVXaWxsTXV0YXRlID0gZnVuY3Rpb24gKCkgeyBvYnNlcnZhYmxlW1wibm90aWZ5U3Vic2NyaWJlcnNcIl0oX2xhdGVzdFZhbHVlLCBcImJlZm9yZUNoYW5nZVwiKTsgfVxuXG4gICAga28uZXhwb3J0UHJvcGVydHkob2JzZXJ2YWJsZSwgJ3BlZWsnLCBvYnNlcnZhYmxlLnBlZWspO1xuICAgIGtvLmV4cG9ydFByb3BlcnR5KG9ic2VydmFibGUsIFwidmFsdWVIYXNNdXRhdGVkXCIsIG9ic2VydmFibGUudmFsdWVIYXNNdXRhdGVkKTtcbiAgICBrby5leHBvcnRQcm9wZXJ0eShvYnNlcnZhYmxlLCBcInZhbHVlV2lsbE11dGF0ZVwiLCBvYnNlcnZhYmxlLnZhbHVlV2lsbE11dGF0ZSk7XG5cbiAgICByZXR1cm4gb2JzZXJ2YWJsZTtcbn1cblxua28ub2JzZXJ2YWJsZVsnZm4nXSA9IHtcbiAgICBcImVxdWFsaXR5Q29tcGFyZXJcIjogdmFsdWVzQXJlUHJpbWl0aXZlQW5kRXF1YWxcbn07XG5cbnZhciBwcm90b1Byb3BlcnR5ID0ga28ub2JzZXJ2YWJsZS5wcm90b1Byb3BlcnR5ID0gXCJfX2tvX3Byb3RvX19cIjtcbmtvLm9ic2VydmFibGVbJ2ZuJ11bcHJvdG9Qcm9wZXJ0eV0gPSBrby5vYnNlcnZhYmxlO1xuXG4vLyBOb3RlIHRoYXQgZm9yIGJyb3dzZXJzIHRoYXQgZG9uJ3Qgc3VwcG9ydCBwcm90byBhc3NpZ25tZW50LCB0aGVcbi8vIGluaGVyaXRhbmNlIGNoYWluIGlzIGNyZWF0ZWQgbWFudWFsbHkgaW4gdGhlIGtvLm9ic2VydmFibGUgY29uc3RydWN0b3JcbmlmIChrby51dGlscy5jYW5TZXRQcm90b3R5cGUpIHtcbiAgICBrby51dGlscy5zZXRQcm90b3R5cGVPZihrby5vYnNlcnZhYmxlWydmbiddLCBrby5zdWJzY3JpYmFibGVbJ2ZuJ10pO1xufVxuXG5rby5oYXNQcm90b3R5cGUgPSBmdW5jdGlvbihpbnN0YW5jZSwgcHJvdG90eXBlKSB7XG4gICAgaWYgKChpbnN0YW5jZSA9PT0gbnVsbCkgfHwgKGluc3RhbmNlID09PSB1bmRlZmluZWQpIHx8IChpbnN0YW5jZVtwcm90b1Byb3BlcnR5XSA9PT0gdW5kZWZpbmVkKSkgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChpbnN0YW5jZVtwcm90b1Byb3BlcnR5XSA9PT0gcHJvdG90eXBlKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4ga28uaGFzUHJvdG90eXBlKGluc3RhbmNlW3Byb3RvUHJvcGVydHldLCBwcm90b3R5cGUpOyAvLyBXYWxrIHRoZSBwcm90b3R5cGUgY2hhaW5cbn07XG5cbmtvLmlzT2JzZXJ2YWJsZSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHJldHVybiBrby5oYXNQcm90b3R5cGUoaW5zdGFuY2UsIGtvLm9ic2VydmFibGUpO1xufVxua28uaXNXcml0ZWFibGVPYnNlcnZhYmxlID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgLy8gT2JzZXJ2YWJsZVxuICAgIGlmICgodHlwZW9mIGluc3RhbmNlID09IFwiZnVuY3Rpb25cIikgJiYgaW5zdGFuY2VbcHJvdG9Qcm9wZXJ0eV0gPT09IGtvLm9ic2VydmFibGUpXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIC8vIFdyaXRlYWJsZSBkZXBlbmRlbnQgb2JzZXJ2YWJsZVxuICAgIGlmICgodHlwZW9mIGluc3RhbmNlID09IFwiZnVuY3Rpb25cIikgJiYgKGluc3RhbmNlW3Byb3RvUHJvcGVydHldID09PSBrby5kZXBlbmRlbnRPYnNlcnZhYmxlKSAmJiAoaW5zdGFuY2UuaGFzV3JpdGVGdW5jdGlvbikpXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIC8vIEFueXRoaW5nIGVsc2VcbiAgICByZXR1cm4gZmFsc2U7XG59XG5cblxua28uZXhwb3J0U3ltYm9sKCdvYnNlcnZhYmxlJywga28ub2JzZXJ2YWJsZSk7XG5rby5leHBvcnRTeW1ib2woJ2lzT2JzZXJ2YWJsZScsIGtvLmlzT2JzZXJ2YWJsZSk7XG5rby5leHBvcnRTeW1ib2woJ2lzV3JpdGVhYmxlT2JzZXJ2YWJsZScsIGtvLmlzV3JpdGVhYmxlT2JzZXJ2YWJsZSk7XG5rby5leHBvcnRTeW1ib2woJ2lzV3JpdGFibGVPYnNlcnZhYmxlJywga28uaXNXcml0ZWFibGVPYnNlcnZhYmxlKTtcbmtvLm9ic2VydmFibGVBcnJheSA9IGZ1bmN0aW9uIChpbml0aWFsVmFsdWVzKSB7XG4gICAgaW5pdGlhbFZhbHVlcyA9IGluaXRpYWxWYWx1ZXMgfHwgW107XG5cbiAgICBpZiAodHlwZW9mIGluaXRpYWxWYWx1ZXMgIT0gJ29iamVjdCcgfHwgISgnbGVuZ3RoJyBpbiBpbml0aWFsVmFsdWVzKSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIGFyZ3VtZW50IHBhc3NlZCB3aGVuIGluaXRpYWxpemluZyBhbiBvYnNlcnZhYmxlIGFycmF5IG11c3QgYmUgYW4gYXJyYXksIG9yIG51bGwsIG9yIHVuZGVmaW5lZC5cIik7XG5cbiAgICB2YXIgcmVzdWx0ID0ga28ub2JzZXJ2YWJsZShpbml0aWFsVmFsdWVzKTtcbiAgICBrby51dGlscy5zZXRQcm90b3R5cGVPZk9yRXh0ZW5kKHJlc3VsdCwga28ub2JzZXJ2YWJsZUFycmF5WydmbiddKTtcbiAgICByZXR1cm4gcmVzdWx0LmV4dGVuZCh7J3RyYWNrQXJyYXlDaGFuZ2VzJzp0cnVlfSk7XG59O1xuXG5rby5vYnNlcnZhYmxlQXJyYXlbJ2ZuJ10gPSB7XG4gICAgJ3JlbW92ZSc6IGZ1bmN0aW9uICh2YWx1ZU9yUHJlZGljYXRlKSB7XG4gICAgICAgIHZhciB1bmRlcmx5aW5nQXJyYXkgPSB0aGlzLnBlZWsoKTtcbiAgICAgICAgdmFyIHJlbW92ZWRWYWx1ZXMgPSBbXTtcbiAgICAgICAgdmFyIHByZWRpY2F0ZSA9IHR5cGVvZiB2YWx1ZU9yUHJlZGljYXRlID09IFwiZnVuY3Rpb25cIiAmJiAha28uaXNPYnNlcnZhYmxlKHZhbHVlT3JQcmVkaWNhdGUpID8gdmFsdWVPclByZWRpY2F0ZSA6IGZ1bmN0aW9uICh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgPT09IHZhbHVlT3JQcmVkaWNhdGU7IH07XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdW5kZXJseWluZ0FycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB1bmRlcmx5aW5nQXJyYXlbaV07XG4gICAgICAgICAgICBpZiAocHJlZGljYXRlKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGlmIChyZW1vdmVkVmFsdWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlV2lsbE11dGF0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZW1vdmVkVmFsdWVzLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgICAgIHVuZGVybHlpbmdBcnJheS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgaS0tO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChyZW1vdmVkVmFsdWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZUhhc011dGF0ZWQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVtb3ZlZFZhbHVlcztcbiAgICB9LFxuXG4gICAgJ3JlbW92ZUFsbCc6IGZ1bmN0aW9uIChhcnJheU9mVmFsdWVzKSB7XG4gICAgICAgIC8vIElmIHlvdSBwYXNzZWQgemVybyBhcmdzLCB3ZSByZW1vdmUgZXZlcnl0aGluZ1xuICAgICAgICBpZiAoYXJyYXlPZlZhbHVlcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB2YXIgdW5kZXJseWluZ0FycmF5ID0gdGhpcy5wZWVrKCk7XG4gICAgICAgICAgICB2YXIgYWxsVmFsdWVzID0gdW5kZXJseWluZ0FycmF5LnNsaWNlKDApO1xuICAgICAgICAgICAgdGhpcy52YWx1ZVdpbGxNdXRhdGUoKTtcbiAgICAgICAgICAgIHVuZGVybHlpbmdBcnJheS5zcGxpY2UoMCwgdW5kZXJseWluZ0FycmF5Lmxlbmd0aCk7XG4gICAgICAgICAgICB0aGlzLnZhbHVlSGFzTXV0YXRlZCgpO1xuICAgICAgICAgICAgcmV0dXJuIGFsbFZhbHVlcztcbiAgICAgICAgfVxuICAgICAgICAvLyBJZiB5b3UgcGFzc2VkIGFuIGFyZywgd2UgaW50ZXJwcmV0IGl0IGFzIGFuIGFycmF5IG9mIGVudHJpZXMgdG8gcmVtb3ZlXG4gICAgICAgIGlmICghYXJyYXlPZlZhbHVlcylcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgcmV0dXJuIHRoaXNbJ3JlbW92ZSddKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGtvLnV0aWxzLmFycmF5SW5kZXhPZihhcnJheU9mVmFsdWVzLCB2YWx1ZSkgPj0gMDtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgICdkZXN0cm95JzogZnVuY3Rpb24gKHZhbHVlT3JQcmVkaWNhdGUpIHtcbiAgICAgICAgdmFyIHVuZGVybHlpbmdBcnJheSA9IHRoaXMucGVlaygpO1xuICAgICAgICB2YXIgcHJlZGljYXRlID0gdHlwZW9mIHZhbHVlT3JQcmVkaWNhdGUgPT0gXCJmdW5jdGlvblwiICYmICFrby5pc09ic2VydmFibGUodmFsdWVPclByZWRpY2F0ZSkgPyB2YWx1ZU9yUHJlZGljYXRlIDogZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybiB2YWx1ZSA9PT0gdmFsdWVPclByZWRpY2F0ZTsgfTtcbiAgICAgICAgdGhpcy52YWx1ZVdpbGxNdXRhdGUoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IHVuZGVybHlpbmdBcnJheS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gdW5kZXJseWluZ0FycmF5W2ldO1xuICAgICAgICAgICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSkpXG4gICAgICAgICAgICAgICAgdW5kZXJseWluZ0FycmF5W2ldW1wiX2Rlc3Ryb3lcIl0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudmFsdWVIYXNNdXRhdGVkKCk7XG4gICAgfSxcblxuICAgICdkZXN0cm95QWxsJzogZnVuY3Rpb24gKGFycmF5T2ZWYWx1ZXMpIHtcbiAgICAgICAgLy8gSWYgeW91IHBhc3NlZCB6ZXJvIGFyZ3MsIHdlIGRlc3Ryb3kgZXZlcnl0aGluZ1xuICAgICAgICBpZiAoYXJyYXlPZlZhbHVlcyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXNbJ2Rlc3Ryb3knXShmdW5jdGlvbigpIHsgcmV0dXJuIHRydWUgfSk7XG5cbiAgICAgICAgLy8gSWYgeW91IHBhc3NlZCBhbiBhcmcsIHdlIGludGVycHJldCBpdCBhcyBhbiBhcnJheSBvZiBlbnRyaWVzIHRvIGRlc3Ryb3lcbiAgICAgICAgaWYgKCFhcnJheU9mVmFsdWVzKVxuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICByZXR1cm4gdGhpc1snZGVzdHJveSddKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGtvLnV0aWxzLmFycmF5SW5kZXhPZihhcnJheU9mVmFsdWVzLCB2YWx1ZSkgPj0gMDtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgICdpbmRleE9mJzogZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgdmFyIHVuZGVybHlpbmdBcnJheSA9IHRoaXMoKTtcbiAgICAgICAgcmV0dXJuIGtvLnV0aWxzLmFycmF5SW5kZXhPZih1bmRlcmx5aW5nQXJyYXksIGl0ZW0pO1xuICAgIH0sXG5cbiAgICAncmVwbGFjZSc6IGZ1bmN0aW9uKG9sZEl0ZW0sIG5ld0l0ZW0pIHtcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpc1snaW5kZXhPZiddKG9sZEl0ZW0pO1xuICAgICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZVdpbGxNdXRhdGUoKTtcbiAgICAgICAgICAgIHRoaXMucGVlaygpW2luZGV4XSA9IG5ld0l0ZW07XG4gICAgICAgICAgICB0aGlzLnZhbHVlSGFzTXV0YXRlZCgpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLy8gUG9wdWxhdGUga28ub2JzZXJ2YWJsZUFycmF5LmZuIHdpdGggcmVhZC93cml0ZSBmdW5jdGlvbnMgZnJvbSBuYXRpdmUgYXJyYXlzXG4vLyBJbXBvcnRhbnQ6IERvIG5vdCBhZGQgYW55IGFkZGl0aW9uYWwgZnVuY3Rpb25zIGhlcmUgdGhhdCBtYXkgcmVhc29uYWJseSBiZSB1c2VkIHRvICpyZWFkKiBkYXRhIGZyb20gdGhlIGFycmF5XG4vLyBiZWNhdXNlIHdlJ2xsIGV2YWwgdGhlbSB3aXRob3V0IGNhdXNpbmcgc3Vic2NyaXB0aW9ucywgc28ga28uY29tcHV0ZWQgb3V0cHV0IGNvdWxkIGVuZCB1cCBnZXR0aW5nIHN0YWxlXG5rby51dGlscy5hcnJheUZvckVhY2goW1wicG9wXCIsIFwicHVzaFwiLCBcInJldmVyc2VcIiwgXCJzaGlmdFwiLCBcInNvcnRcIiwgXCJzcGxpY2VcIiwgXCJ1bnNoaWZ0XCJdLCBmdW5jdGlvbiAobWV0aG9kTmFtZSkge1xuICAgIGtvLm9ic2VydmFibGVBcnJheVsnZm4nXVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gVXNlIFwicGVla1wiIHRvIGF2b2lkIGNyZWF0aW5nIGEgc3Vic2NyaXB0aW9uIGluIGFueSBjb21wdXRlZCB0aGF0IHdlJ3JlIGV4ZWN1dGluZyBpbiB0aGUgY29udGV4dCBvZlxuICAgICAgICAvLyAoZm9yIGNvbnNpc3RlbmN5IHdpdGggbXV0YXRpbmcgcmVndWxhciBvYnNlcnZhYmxlcylcbiAgICAgICAgdmFyIHVuZGVybHlpbmdBcnJheSA9IHRoaXMucGVlaygpO1xuICAgICAgICB0aGlzLnZhbHVlV2lsbE11dGF0ZSgpO1xuICAgICAgICB0aGlzLmNhY2hlRGlmZkZvcktub3duT3BlcmF0aW9uKHVuZGVybHlpbmdBcnJheSwgbWV0aG9kTmFtZSwgYXJndW1lbnRzKTtcbiAgICAgICAgdmFyIG1ldGhvZENhbGxSZXN1bHQgPSB1bmRlcmx5aW5nQXJyYXlbbWV0aG9kTmFtZV0uYXBwbHkodW5kZXJseWluZ0FycmF5LCBhcmd1bWVudHMpO1xuICAgICAgICB0aGlzLnZhbHVlSGFzTXV0YXRlZCgpO1xuICAgICAgICByZXR1cm4gbWV0aG9kQ2FsbFJlc3VsdDtcbiAgICB9O1xufSk7XG5cbi8vIFBvcHVsYXRlIGtvLm9ic2VydmFibGVBcnJheS5mbiB3aXRoIHJlYWQtb25seSBmdW5jdGlvbnMgZnJvbSBuYXRpdmUgYXJyYXlzXG5rby51dGlscy5hcnJheUZvckVhY2goW1wic2xpY2VcIl0sIGZ1bmN0aW9uIChtZXRob2ROYW1lKSB7XG4gICAga28ub2JzZXJ2YWJsZUFycmF5WydmbiddW21ldGhvZE5hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdW5kZXJseWluZ0FycmF5ID0gdGhpcygpO1xuICAgICAgICByZXR1cm4gdW5kZXJseWluZ0FycmF5W21ldGhvZE5hbWVdLmFwcGx5KHVuZGVybHlpbmdBcnJheSwgYXJndW1lbnRzKTtcbiAgICB9O1xufSk7XG5cbi8vIE5vdGUgdGhhdCBmb3IgYnJvd3NlcnMgdGhhdCBkb24ndCBzdXBwb3J0IHByb3RvIGFzc2lnbm1lbnQsIHRoZVxuLy8gaW5oZXJpdGFuY2UgY2hhaW4gaXMgY3JlYXRlZCBtYW51YWxseSBpbiB0aGUga28ub2JzZXJ2YWJsZUFycmF5IGNvbnN0cnVjdG9yXG5pZiAoa28udXRpbHMuY2FuU2V0UHJvdG90eXBlKSB7XG4gICAga28udXRpbHMuc2V0UHJvdG90eXBlT2Yoa28ub2JzZXJ2YWJsZUFycmF5WydmbiddLCBrby5vYnNlcnZhYmxlWydmbiddKTtcbn1cblxua28uZXhwb3J0U3ltYm9sKCdvYnNlcnZhYmxlQXJyYXknLCBrby5vYnNlcnZhYmxlQXJyYXkpO1xudmFyIGFycmF5Q2hhbmdlRXZlbnROYW1lID0gJ2FycmF5Q2hhbmdlJztcbmtvLmV4dGVuZGVyc1sndHJhY2tBcnJheUNoYW5nZXMnXSA9IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgIC8vIE9ubHkgbW9kaWZ5IHRoZSB0YXJnZXQgb2JzZXJ2YWJsZSBvbmNlXG4gICAgaWYgKHRhcmdldC5jYWNoZURpZmZGb3JLbm93bk9wZXJhdGlvbikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0cmFja2luZ0NoYW5nZXMgPSBmYWxzZSxcbiAgICAgICAgY2FjaGVkRGlmZiA9IG51bGwsXG4gICAgICAgIHBlbmRpbmdOb3RpZmljYXRpb25zID0gMCxcbiAgICAgICAgdW5kZXJseWluZ1N1YnNjcmliZUZ1bmN0aW9uID0gdGFyZ2V0LnN1YnNjcmliZTtcblxuICAgIC8vIEludGVyY2VwdCBcInN1YnNjcmliZVwiIGNhbGxzLCBhbmQgZm9yIGFycmF5IGNoYW5nZSBldmVudHMsIGVuc3VyZSBjaGFuZ2UgdHJhY2tpbmcgaXMgZW5hYmxlZFxuICAgIHRhcmdldC5zdWJzY3JpYmUgPSB0YXJnZXRbJ3N1YnNjcmliZSddID0gZnVuY3Rpb24oY2FsbGJhY2ssIGNhbGxiYWNrVGFyZ2V0LCBldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQgPT09IGFycmF5Q2hhbmdlRXZlbnROYW1lKSB7XG4gICAgICAgICAgICB0cmFja0NoYW5nZXMoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZXJseWluZ1N1YnNjcmliZUZ1bmN0aW9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHRyYWNrQ2hhbmdlcygpIHtcbiAgICAgICAgLy8gQ2FsbGluZyAndHJhY2tDaGFuZ2VzJyBtdWx0aXBsZSB0aW1lcyBpcyB0aGUgc2FtZSBhcyBjYWxsaW5nIGl0IG9uY2VcbiAgICAgICAgaWYgKHRyYWNraW5nQ2hhbmdlcykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJhY2tpbmdDaGFuZ2VzID0gdHJ1ZTtcblxuICAgICAgICAvLyBJbnRlcmNlcHQgXCJub3RpZnlTdWJzY3JpYmVyc1wiIHRvIHRyYWNrIGhvdyBtYW55IHRpbWVzIGl0IHdhcyBjYWxsZWQuXG4gICAgICAgIHZhciB1bmRlcmx5aW5nTm90aWZ5U3Vic2NyaWJlcnNGdW5jdGlvbiA9IHRhcmdldFsnbm90aWZ5U3Vic2NyaWJlcnMnXTtcbiAgICAgICAgdGFyZ2V0Wydub3RpZnlTdWJzY3JpYmVycyddID0gZnVuY3Rpb24odmFsdWVUb05vdGlmeSwgZXZlbnQpIHtcbiAgICAgICAgICAgIGlmICghZXZlbnQgfHwgZXZlbnQgPT09IGRlZmF1bHRFdmVudCkge1xuICAgICAgICAgICAgICAgICsrcGVuZGluZ05vdGlmaWNhdGlvbnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdW5kZXJseWluZ05vdGlmeVN1YnNjcmliZXJzRnVuY3Rpb24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBFYWNoIHRpbWUgdGhlIGFycmF5IGNoYW5nZXMgdmFsdWUsIGNhcHR1cmUgYSBjbG9uZSBzbyB0aGF0IG9uIHRoZSBuZXh0XG4gICAgICAgIC8vIGNoYW5nZSBpdCdzIHBvc3NpYmxlIHRvIHByb2R1Y2UgYSBkaWZmXG4gICAgICAgIHZhciBwcmV2aW91c0NvbnRlbnRzID0gW10uY29uY2F0KHRhcmdldC5wZWVrKCkgfHwgW10pO1xuICAgICAgICBjYWNoZWREaWZmID0gbnVsbDtcbiAgICAgICAgdGFyZ2V0LnN1YnNjcmliZShmdW5jdGlvbihjdXJyZW50Q29udGVudHMpIHtcbiAgICAgICAgICAgIC8vIE1ha2UgYSBjb3B5IG9mIHRoZSBjdXJyZW50IGNvbnRlbnRzIGFuZCBlbnN1cmUgaXQncyBhbiBhcnJheVxuICAgICAgICAgICAgY3VycmVudENvbnRlbnRzID0gW10uY29uY2F0KGN1cnJlbnRDb250ZW50cyB8fCBbXSk7XG5cbiAgICAgICAgICAgIC8vIENvbXB1dGUgdGhlIGRpZmYgYW5kIGlzc3VlIG5vdGlmaWNhdGlvbnMsIGJ1dCBvbmx5IGlmIHNvbWVvbmUgaXMgbGlzdGVuaW5nXG4gICAgICAgICAgICBpZiAodGFyZ2V0Lmhhc1N1YnNjcmlwdGlvbnNGb3JFdmVudChhcnJheUNoYW5nZUV2ZW50TmFtZSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgY2hhbmdlcyA9IGdldENoYW5nZXMocHJldmlvdXNDb250ZW50cywgY3VycmVudENvbnRlbnRzKTtcbiAgICAgICAgICAgICAgICBpZiAoY2hhbmdlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Wydub3RpZnlTdWJzY3JpYmVycyddKGNoYW5nZXMsIGFycmF5Q2hhbmdlRXZlbnROYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEVsaW1pbmF0ZSByZWZlcmVuY2VzIHRvIHRoZSBvbGQsIHJlbW92ZWQgaXRlbXMsIHNvIHRoZXkgY2FuIGJlIEdDZWRcbiAgICAgICAgICAgIHByZXZpb3VzQ29udGVudHMgPSBjdXJyZW50Q29udGVudHM7XG4gICAgICAgICAgICBjYWNoZWREaWZmID0gbnVsbDtcbiAgICAgICAgICAgIHBlbmRpbmdOb3RpZmljYXRpb25zID0gMDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Q2hhbmdlcyhwcmV2aW91c0NvbnRlbnRzLCBjdXJyZW50Q29udGVudHMpIHtcbiAgICAgICAgLy8gV2UgdHJ5IHRvIHJlLXVzZSBjYWNoZWQgZGlmZnMuXG4gICAgICAgIC8vIFRoZSBzY2VuYXJpb3Mgd2hlcmUgcGVuZGluZ05vdGlmaWNhdGlvbnMgPiAxIGFyZSB3aGVuIHVzaW5nIHJhdGUtbGltaXRpbmcgb3IgdGhlIERlZmVycmVkIFVwZGF0ZXNcbiAgICAgICAgLy8gcGx1Z2luLCB3aGljaCB3aXRob3V0IHRoaXMgY2hlY2sgd291bGQgbm90IGJlIGNvbXBhdGlibGUgd2l0aCBhcnJheUNoYW5nZSBub3RpZmljYXRpb25zLiBOb3JtYWxseSxcbiAgICAgICAgLy8gbm90aWZpY2F0aW9ucyBhcmUgaXNzdWVkIGltbWVkaWF0ZWx5IHNvIHdlIHdvdWxkbid0IGJlIHF1ZXVlaW5nIHVwIG1vcmUgdGhhbiBvbmUuXG4gICAgICAgIGlmICghY2FjaGVkRGlmZiB8fCBwZW5kaW5nTm90aWZpY2F0aW9ucyA+IDEpIHtcbiAgICAgICAgICAgIGNhY2hlZERpZmYgPSBrby51dGlscy5jb21wYXJlQXJyYXlzKHByZXZpb3VzQ29udGVudHMsIGN1cnJlbnRDb250ZW50cywgeyAnc3BhcnNlJzogdHJ1ZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjYWNoZWREaWZmO1xuICAgIH1cblxuICAgIHRhcmdldC5jYWNoZURpZmZGb3JLbm93bk9wZXJhdGlvbiA9IGZ1bmN0aW9uKHJhd0FycmF5LCBvcGVyYXRpb25OYW1lLCBhcmdzKSB7XG4gICAgICAgIC8vIE9ubHkgcnVuIGlmIHdlJ3JlIGN1cnJlbnRseSB0cmFja2luZyBjaGFuZ2VzIGZvciB0aGlzIG9ic2VydmFibGUgYXJyYXlcbiAgICAgICAgLy8gYW5kIHRoZXJlIGFyZW4ndCBhbnkgcGVuZGluZyBkZWZlcnJlZCBub3RpZmljYXRpb25zLlxuICAgICAgICBpZiAoIXRyYWNraW5nQ2hhbmdlcyB8fCBwZW5kaW5nTm90aWZpY2F0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkaWZmID0gW10sXG4gICAgICAgICAgICBhcnJheUxlbmd0aCA9IHJhd0FycmF5Lmxlbmd0aCxcbiAgICAgICAgICAgIGFyZ3NMZW5ndGggPSBhcmdzLmxlbmd0aCxcbiAgICAgICAgICAgIG9mZnNldCA9IDA7XG5cbiAgICAgICAgZnVuY3Rpb24gcHVzaERpZmYoc3RhdHVzLCB2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiBkaWZmW2RpZmYubGVuZ3RoXSA9IHsgJ3N0YXR1cyc6IHN0YXR1cywgJ3ZhbHVlJzogdmFsdWUsICdpbmRleCc6IGluZGV4IH07XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChvcGVyYXRpb25OYW1lKSB7XG4gICAgICAgICAgICBjYXNlICdwdXNoJzpcbiAgICAgICAgICAgICAgICBvZmZzZXQgPSBhcnJheUxlbmd0aDtcbiAgICAgICAgICAgIGNhc2UgJ3Vuc2hpZnQnOlxuICAgICAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBhcmdzTGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHB1c2hEaWZmKCdhZGRlZCcsIGFyZ3NbaW5kZXhdLCBvZmZzZXQgKyBpbmRleCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdwb3AnOlxuICAgICAgICAgICAgICAgIG9mZnNldCA9IGFycmF5TGVuZ3RoIC0gMTtcbiAgICAgICAgICAgIGNhc2UgJ3NoaWZ0JzpcbiAgICAgICAgICAgICAgICBpZiAoYXJyYXlMZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcHVzaERpZmYoJ2RlbGV0ZWQnLCByYXdBcnJheVtvZmZzZXRdLCBvZmZzZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnc3BsaWNlJzpcbiAgICAgICAgICAgICAgICAvLyBOZWdhdGl2ZSBzdGFydCBpbmRleCBtZWFucyAnZnJvbSBlbmQgb2YgYXJyYXknLiBBZnRlciB0aGF0IHdlIGNsYW1wIHRvIFswLi4uYXJyYXlMZW5ndGhdLlxuICAgICAgICAgICAgICAgIC8vIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9zcGxpY2VcbiAgICAgICAgICAgICAgICB2YXIgc3RhcnRJbmRleCA9IE1hdGgubWluKE1hdGgubWF4KDAsIGFyZ3NbMF0gPCAwID8gYXJyYXlMZW5ndGggKyBhcmdzWzBdIDogYXJnc1swXSksIGFycmF5TGVuZ3RoKSxcbiAgICAgICAgICAgICAgICAgICAgZW5kRGVsZXRlSW5kZXggPSBhcmdzTGVuZ3RoID09PSAxID8gYXJyYXlMZW5ndGggOiBNYXRoLm1pbihzdGFydEluZGV4ICsgKGFyZ3NbMV0gfHwgMCksIGFycmF5TGVuZ3RoKSxcbiAgICAgICAgICAgICAgICAgICAgZW5kQWRkSW5kZXggPSBzdGFydEluZGV4ICsgYXJnc0xlbmd0aCAtIDIsXG4gICAgICAgICAgICAgICAgICAgIGVuZEluZGV4ID0gTWF0aC5tYXgoZW5kRGVsZXRlSW5kZXgsIGVuZEFkZEluZGV4KSxcbiAgICAgICAgICAgICAgICAgICAgYWRkaXRpb25zID0gW10sIGRlbGV0aW9ucyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gc3RhcnRJbmRleCwgYXJnc0luZGV4ID0gMjsgaW5kZXggPCBlbmRJbmRleDsgKytpbmRleCwgKythcmdzSW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4IDwgZW5kRGVsZXRlSW5kZXgpXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGlvbnMucHVzaChwdXNoRGlmZignZGVsZXRlZCcsIHJhd0FycmF5W2luZGV4XSwgaW5kZXgpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4IDwgZW5kQWRkSW5kZXgpXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRpdGlvbnMucHVzaChwdXNoRGlmZignYWRkZWQnLCBhcmdzW2FyZ3NJbmRleF0sIGluZGV4KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGtvLnV0aWxzLmZpbmRNb3Zlc0luQXJyYXlDb21wYXJpc29uKGRlbGV0aW9ucywgYWRkaXRpb25zKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY2FjaGVkRGlmZiA9IGRpZmY7XG4gICAgfTtcbn07XG5rby5jb21wdXRlZCA9IGtvLmRlcGVuZGVudE9ic2VydmFibGUgPSBmdW5jdGlvbiAoZXZhbHVhdG9yRnVuY3Rpb25Pck9wdGlvbnMsIGV2YWx1YXRvckZ1bmN0aW9uVGFyZ2V0LCBvcHRpb25zKSB7XG4gICAgdmFyIF9sYXRlc3RWYWx1ZSxcbiAgICAgICAgX25lZWRzRXZhbHVhdGlvbiA9IHRydWUsXG4gICAgICAgIF9pc0JlaW5nRXZhbHVhdGVkID0gZmFsc2UsXG4gICAgICAgIF9zdXBwcmVzc0Rpc3Bvc2FsVW50aWxEaXNwb3NlV2hlblJldHVybnNGYWxzZSA9IGZhbHNlLFxuICAgICAgICBfaXNEaXNwb3NlZCA9IGZhbHNlLFxuICAgICAgICByZWFkRnVuY3Rpb24gPSBldmFsdWF0b3JGdW5jdGlvbk9yT3B0aW9ucyxcbiAgICAgICAgcHVyZSA9IGZhbHNlLFxuICAgICAgICBpc1NsZWVwaW5nID0gZmFsc2U7XG5cbiAgICBpZiAocmVhZEZ1bmN0aW9uICYmIHR5cGVvZiByZWFkRnVuY3Rpb24gPT0gXCJvYmplY3RcIikge1xuICAgICAgICAvLyBTaW5nbGUtcGFyYW1ldGVyIHN5bnRheCAtIGV2ZXJ5dGhpbmcgaXMgb24gdGhpcyBcIm9wdGlvbnNcIiBwYXJhbVxuICAgICAgICBvcHRpb25zID0gcmVhZEZ1bmN0aW9uO1xuICAgICAgICByZWFkRnVuY3Rpb24gPSBvcHRpb25zW1wicmVhZFwiXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBNdWx0aS1wYXJhbWV0ZXIgc3ludGF4IC0gY29uc3RydWN0IHRoZSBvcHRpb25zIGFjY29yZGluZyB0byB0aGUgcGFyYW1zIHBhc3NlZFxuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgICAgaWYgKCFyZWFkRnVuY3Rpb24pXG4gICAgICAgICAgICByZWFkRnVuY3Rpb24gPSBvcHRpb25zW1wicmVhZFwiXTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiByZWFkRnVuY3Rpb24gIT0gXCJmdW5jdGlvblwiKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQYXNzIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGUga28uY29tcHV0ZWRcIik7XG5cbiAgICBmdW5jdGlvbiBhZGRTdWJzY3JpcHRpb25Ub0RlcGVuZGVuY3koc3Vic2NyaWJhYmxlLCBpZCkge1xuICAgICAgICBpZiAoIV9zdWJzY3JpcHRpb25zVG9EZXBlbmRlbmNpZXNbaWRdKSB7XG4gICAgICAgICAgICBfc3Vic2NyaXB0aW9uc1RvRGVwZW5kZW5jaWVzW2lkXSA9IHN1YnNjcmliYWJsZS5zdWJzY3JpYmUoZXZhbHVhdGVQb3NzaWJseUFzeW5jKTtcbiAgICAgICAgICAgICsrX2RlcGVuZGVuY2llc0NvdW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGlzcG9zZUFsbFN1YnNjcmlwdGlvbnNUb0RlcGVuZGVuY2llcygpIHtcbiAgICAgICAga28udXRpbHMub2JqZWN0Rm9yRWFjaChfc3Vic2NyaXB0aW9uc1RvRGVwZW5kZW5jaWVzLCBmdW5jdGlvbiAoaWQsIHN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uLmRpc3Bvc2UoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIF9zdWJzY3JpcHRpb25zVG9EZXBlbmRlbmNpZXMgPSB7fTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkaXNwb3NlQ29tcHV0ZWQoKSB7XG4gICAgICAgIGRpc3Bvc2VBbGxTdWJzY3JpcHRpb25zVG9EZXBlbmRlbmNpZXMoKTtcbiAgICAgICAgX2RlcGVuZGVuY2llc0NvdW50ID0gMDtcbiAgICAgICAgX2lzRGlzcG9zZWQgPSB0cnVlO1xuICAgICAgICBfbmVlZHNFdmFsdWF0aW9uID0gZmFsc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXZhbHVhdGVQb3NzaWJseUFzeW5jKCkge1xuICAgICAgICB2YXIgdGhyb3R0bGVFdmFsdWF0aW9uVGltZW91dCA9IGRlcGVuZGVudE9ic2VydmFibGVbJ3Rocm90dGxlRXZhbHVhdGlvbiddO1xuICAgICAgICBpZiAodGhyb3R0bGVFdmFsdWF0aW9uVGltZW91dCAmJiB0aHJvdHRsZUV2YWx1YXRpb25UaW1lb3V0ID49IDApIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChldmFsdWF0aW9uVGltZW91dEluc3RhbmNlKTtcbiAgICAgICAgICAgIGV2YWx1YXRpb25UaW1lb3V0SW5zdGFuY2UgPSBzZXRUaW1lb3V0KGV2YWx1YXRlSW1tZWRpYXRlLCB0aHJvdHRsZUV2YWx1YXRpb25UaW1lb3V0KTtcbiAgICAgICAgfSBlbHNlIGlmIChkZXBlbmRlbnRPYnNlcnZhYmxlLl9ldmFsUmF0ZUxpbWl0ZWQpIHtcbiAgICAgICAgICAgIGRlcGVuZGVudE9ic2VydmFibGUuX2V2YWxSYXRlTGltaXRlZCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXZhbHVhdGVJbW1lZGlhdGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV2YWx1YXRlSW1tZWRpYXRlKHN1cHByZXNzQ2hhbmdlTm90aWZpY2F0aW9uKSB7XG4gICAgICAgIGlmIChfaXNCZWluZ0V2YWx1YXRlZCkge1xuICAgICAgICAgICAgaWYgKHB1cmUpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIkEgJ3B1cmUnIGNvbXB1dGVkIG11c3Qgbm90IGJlIGNhbGxlZCByZWN1cnNpdmVseVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIElmIHRoZSBldmFsdWF0aW9uIG9mIGEga28uY29tcHV0ZWQgY2F1c2VzIHNpZGUgZWZmZWN0cywgaXQncyBwb3NzaWJsZSB0aGF0IGl0IHdpbGwgdHJpZ2dlciBpdHMgb3duIHJlLWV2YWx1YXRpb24uXG4gICAgICAgICAgICAvLyBUaGlzIGlzIG5vdCBkZXNpcmFibGUgKGl0J3MgaGFyZCBmb3IgYSBkZXZlbG9wZXIgdG8gcmVhbGlzZSBhIGNoYWluIG9mIGRlcGVuZGVuY2llcyBtaWdodCBjYXVzZSB0aGlzLCBhbmQgdGhleSBhbG1vc3RcbiAgICAgICAgICAgIC8vIGNlcnRhaW5seSBkaWRuJ3QgaW50ZW5kIGluZmluaXRlIHJlLWV2YWx1YXRpb25zKS4gU28sIGZvciBwcmVkaWN0YWJpbGl0eSwgd2Ugc2ltcGx5IHByZXZlbnQga28uY29tcHV0ZWRzIGZyb20gY2F1c2luZ1xuICAgICAgICAgICAgLy8gdGhlaXIgb3duIHJlLWV2YWx1YXRpb24uIEZ1cnRoZXIgZGlzY3Vzc2lvbiBhdCBodHRwczovL2dpdGh1Yi5jb20vU3RldmVTYW5kZXJzb24va25vY2tvdXQvcHVsbC8zODdcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERvIG5vdCBldmFsdWF0ZSAoYW5kIHBvc3NpYmx5IGNhcHR1cmUgbmV3IGRlcGVuZGVuY2llcykgaWYgZGlzcG9zZWRcbiAgICAgICAgaWYgKF9pc0Rpc3Bvc2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGlzcG9zZVdoZW4gJiYgZGlzcG9zZVdoZW4oKSkge1xuICAgICAgICAgICAgLy8gU2VlIGNvbW1lbnQgYmVsb3cgYWJvdXQgX3N1cHByZXNzRGlzcG9zYWxVbnRpbERpc3Bvc2VXaGVuUmV0dXJuc0ZhbHNlXG4gICAgICAgICAgICBpZiAoIV9zdXBwcmVzc0Rpc3Bvc2FsVW50aWxEaXNwb3NlV2hlblJldHVybnNGYWxzZSkge1xuICAgICAgICAgICAgICAgIGRpc3Bvc2UoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBJdCBqdXN0IGRpZCByZXR1cm4gZmFsc2UsIHNvIHdlIGNhbiBzdG9wIHN1cHByZXNzaW5nIG5vd1xuICAgICAgICAgICAgX3N1cHByZXNzRGlzcG9zYWxVbnRpbERpc3Bvc2VXaGVuUmV0dXJuc0ZhbHNlID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBfaXNCZWluZ0V2YWx1YXRlZCA9IHRydWU7XG5cbiAgICAgICAgLy8gV2hlbiBzbGVlcGluZywgcmVjYWxjdWxhdGUgdGhlIHZhbHVlIGFuZCByZXR1cm4uXG4gICAgICAgIGlmIChpc1NsZWVwaW5nKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHZhciBkZXBlbmRlbmN5VHJhY2tpbmcgPSB7fTtcbiAgICAgICAgICAgICAgICBrby5kZXBlbmRlbmN5RGV0ZWN0aW9uLmJlZ2luKHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uIChzdWJzY3JpYmFibGUsIGlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWRlcGVuZGVuY3lUcmFja2luZ1tpZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXBlbmRlbmN5VHJhY2tpbmdbaWRdID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArK19kZXBlbmRlbmNpZXNDb3VudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY29tcHV0ZWQ6IGRlcGVuZGVudE9ic2VydmFibGUsXG4gICAgICAgICAgICAgICAgICAgIGlzSW5pdGlhbDogdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgX2RlcGVuZGVuY2llc0NvdW50ID0gMDtcbiAgICAgICAgICAgICAgICBfbGF0ZXN0VmFsdWUgPSByZWFkRnVuY3Rpb24uY2FsbChldmFsdWF0b3JGdW5jdGlvblRhcmdldCk7XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uZW5kKCk7XG4gICAgICAgICAgICAgICAgX2lzQmVpbmdFdmFsdWF0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgLy8gSW5pdGlhbGx5LCB3ZSBhc3N1bWUgdGhhdCBub25lIG9mIHRoZSBzdWJzY3JpcHRpb25zIGFyZSBzdGlsbCBiZWluZyB1c2VkIChpLmUuLCBhbGwgYXJlIGNhbmRpZGF0ZXMgZm9yIGRpc3Bvc2FsKS5cbiAgICAgICAgICAgICAgICAvLyBUaGVuLCBkdXJpbmcgZXZhbHVhdGlvbiwgd2UgY3Jvc3Mgb2ZmIGFueSB0aGF0IGFyZSBpbiBmYWN0IHN0aWxsIGJlaW5nIHVzZWQuXG4gICAgICAgICAgICAgICAgdmFyIGRpc3Bvc2FsQ2FuZGlkYXRlcyA9IF9zdWJzY3JpcHRpb25zVG9EZXBlbmRlbmNpZXMsIGRpc3Bvc2FsQ291bnQgPSBfZGVwZW5kZW5jaWVzQ291bnQ7XG4gICAgICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5iZWdpbih7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihzdWJzY3JpYmFibGUsIGlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIV9pc0Rpc3Bvc2VkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3Bvc2FsQ291bnQgJiYgZGlzcG9zYWxDYW5kaWRhdGVzW2lkXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEb24ndCB3YW50IHRvIGRpc3Bvc2UgdGhpcyBzdWJzY3JpcHRpb24sIGFzIGl0J3Mgc3RpbGwgYmVpbmcgdXNlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc3Vic2NyaXB0aW9uc1RvRGVwZW5kZW5jaWVzW2lkXSA9IGRpc3Bvc2FsQ2FuZGlkYXRlc1tpZF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsrX2RlcGVuZGVuY2llc0NvdW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgZGlzcG9zYWxDYW5kaWRhdGVzW2lkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS1kaXNwb3NhbENvdW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJyYW5kIG5ldyBzdWJzY3JpcHRpb24gLSBhZGQgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkU3Vic2NyaXB0aW9uVG9EZXBlbmRlbmN5KHN1YnNjcmliYWJsZSwgaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY29tcHV0ZWQ6IGRlcGVuZGVudE9ic2VydmFibGUsXG4gICAgICAgICAgICAgICAgICAgIGlzSW5pdGlhbDogcHVyZSA/IHVuZGVmaW5lZCA6ICFfZGVwZW5kZW5jaWVzQ291bnQgICAgICAgIC8vIElmIHdlJ3JlIGV2YWx1YXRpbmcgd2hlbiB0aGVyZSBhcmUgbm8gcHJldmlvdXMgZGVwZW5kZW5jaWVzLCBpdCBtdXN0IGJlIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBfc3Vic2NyaXB0aW9uc1RvRGVwZW5kZW5jaWVzID0ge307XG4gICAgICAgICAgICAgICAgX2RlcGVuZGVuY2llc0NvdW50ID0gMDtcblxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdWYWx1ZSA9IGV2YWx1YXRvckZ1bmN0aW9uVGFyZ2V0ID8gcmVhZEZ1bmN0aW9uLmNhbGwoZXZhbHVhdG9yRnVuY3Rpb25UYXJnZXQpIDogcmVhZEZ1bmN0aW9uKCk7XG5cbiAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICBrby5kZXBlbmRlbmN5RGV0ZWN0aW9uLmVuZCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEZvciBlYWNoIHN1YnNjcmlwdGlvbiBubyBsb25nZXIgYmVpbmcgdXNlZCwgcmVtb3ZlIGl0IGZyb20gdGhlIGFjdGl2ZSBzdWJzY3JpcHRpb25zIGxpc3QgYW5kIGRpc3Bvc2UgaXRcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3Bvc2FsQ291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtvLnV0aWxzLm9iamVjdEZvckVhY2goZGlzcG9zYWxDYW5kaWRhdGVzLCBmdW5jdGlvbihpZCwgdG9EaXNwb3NlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9EaXNwb3NlLmRpc3Bvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgX25lZWRzRXZhbHVhdGlvbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChkZXBlbmRlbnRPYnNlcnZhYmxlLmlzRGlmZmVyZW50KF9sYXRlc3RWYWx1ZSwgbmV3VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlcGVuZGVudE9ic2VydmFibGVbXCJub3RpZnlTdWJzY3JpYmVyc1wiXShfbGF0ZXN0VmFsdWUsIFwiYmVmb3JlQ2hhbmdlXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIF9sYXRlc3RWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoREVCVUcpIGRlcGVuZGVudE9ic2VydmFibGUuX2xhdGVzdFZhbHVlID0gX2xhdGVzdFZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdXBwcmVzc0NoYW5nZU5vdGlmaWNhdGlvbiAhPT0gdHJ1ZSkgeyAgLy8gQ2hlY2sgZm9yIHN0cmljdCB0cnVlIHZhbHVlIHNpbmNlIHNldFRpbWVvdXQgaW4gRmlyZWZveCBwYXNzZXMgYSBudW1lcmljIHZhbHVlIHRvIHRoZSBmdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgZGVwZW5kZW50T2JzZXJ2YWJsZVtcIm5vdGlmeVN1YnNjcmliZXJzXCJdKF9sYXRlc3RWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIF9pc0JlaW5nRXZhbHVhdGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIV9kZXBlbmRlbmNpZXNDb3VudClcbiAgICAgICAgICAgIGRpc3Bvc2UoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXBlbmRlbnRPYnNlcnZhYmxlKCkge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd3JpdGVGdW5jdGlvbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgLy8gV3JpdGluZyBhIHZhbHVlXG4gICAgICAgICAgICAgICAgd3JpdGVGdW5jdGlvbi5hcHBseShldmFsdWF0b3JGdW5jdGlvblRhcmdldCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHdyaXRlIGEgdmFsdWUgdG8gYSBrby5jb21wdXRlZCB1bmxlc3MgeW91IHNwZWNpZnkgYSAnd3JpdGUnIG9wdGlvbi4gSWYgeW91IHdpc2ggdG8gcmVhZCB0aGUgY3VycmVudCB2YWx1ZSwgZG9uJ3QgcGFzcyBhbnkgcGFyYW1ldGVycy5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpczsgLy8gUGVybWl0cyBjaGFpbmVkIGFzc2lnbm1lbnRzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBSZWFkaW5nIHRoZSB2YWx1ZVxuICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5yZWdpc3RlckRlcGVuZGVuY3koZGVwZW5kZW50T2JzZXJ2YWJsZSk7XG4gICAgICAgICAgICBpZiAoX25lZWRzRXZhbHVhdGlvbilcbiAgICAgICAgICAgICAgICBldmFsdWF0ZUltbWVkaWF0ZSh0cnVlIC8qIHN1cHByZXNzQ2hhbmdlTm90aWZpY2F0aW9uICovKTtcbiAgICAgICAgICAgIHJldHVybiBfbGF0ZXN0VmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwZWVrKCkge1xuICAgICAgICAvLyBQZWVrIHdvbid0IHJlLWV2YWx1YXRlLCBleGNlcHQgdG8gZ2V0IHRoZSBpbml0aWFsIHZhbHVlIHdoZW4gXCJkZWZlckV2YWx1YXRpb25cIiBpcyBzZXQsIG9yIHdoaWxlIHRoZSBjb21wdXRlZCBpcyBzbGVlcGluZy5cbiAgICAgICAgLy8gVGhvc2UgYXJlIHRoZSBvbmx5IHRpbWVzIHRoYXQgYm90aCBvZiB0aGVzZSBjb25kaXRpb25zIHdpbGwgYmUgc2F0aXNmaWVkLlxuICAgICAgICBpZiAoX25lZWRzRXZhbHVhdGlvbiAmJiAhX2RlcGVuZGVuY2llc0NvdW50KVxuICAgICAgICAgICAgZXZhbHVhdGVJbW1lZGlhdGUodHJ1ZSAvKiBzdXBwcmVzc0NoYW5nZU5vdGlmaWNhdGlvbiAqLyk7XG4gICAgICAgIHJldHVybiBfbGF0ZXN0VmFsdWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNBY3RpdmUoKSB7XG4gICAgICAgIHJldHVybiBfbmVlZHNFdmFsdWF0aW9uIHx8IF9kZXBlbmRlbmNpZXNDb3VudCA+IDA7XG4gICAgfVxuXG4gICAgLy8gQnkgaGVyZSwgXCJvcHRpb25zXCIgaXMgYWx3YXlzIG5vbi1udWxsXG4gICAgdmFyIHdyaXRlRnVuY3Rpb24gPSBvcHRpb25zW1wid3JpdGVcIl0sXG4gICAgICAgIGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZCA9IG9wdGlvbnNbXCJkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWRcIl0gfHwgb3B0aW9ucy5kaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQgfHwgbnVsbCxcbiAgICAgICAgZGlzcG9zZVdoZW5PcHRpb24gPSBvcHRpb25zW1wiZGlzcG9zZVdoZW5cIl0gfHwgb3B0aW9ucy5kaXNwb3NlV2hlbixcbiAgICAgICAgZGlzcG9zZVdoZW4gPSBkaXNwb3NlV2hlbk9wdGlvbixcbiAgICAgICAgZGlzcG9zZSA9IGRpc3Bvc2VDb21wdXRlZCxcbiAgICAgICAgX3N1YnNjcmlwdGlvbnNUb0RlcGVuZGVuY2llcyA9IHt9LFxuICAgICAgICBfZGVwZW5kZW5jaWVzQ291bnQgPSAwLFxuICAgICAgICBldmFsdWF0aW9uVGltZW91dEluc3RhbmNlID0gbnVsbDtcblxuICAgIGlmICghZXZhbHVhdG9yRnVuY3Rpb25UYXJnZXQpXG4gICAgICAgIGV2YWx1YXRvckZ1bmN0aW9uVGFyZ2V0ID0gb3B0aW9uc1tcIm93bmVyXCJdO1xuXG4gICAga28uc3Vic2NyaWJhYmxlLmNhbGwoZGVwZW5kZW50T2JzZXJ2YWJsZSk7XG4gICAga28udXRpbHMuc2V0UHJvdG90eXBlT2ZPckV4dGVuZChkZXBlbmRlbnRPYnNlcnZhYmxlLCBrby5kZXBlbmRlbnRPYnNlcnZhYmxlWydmbiddKTtcblxuICAgIGRlcGVuZGVudE9ic2VydmFibGUucGVlayA9IHBlZWs7XG4gICAgZGVwZW5kZW50T2JzZXJ2YWJsZS5nZXREZXBlbmRlbmNpZXNDb3VudCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF9kZXBlbmRlbmNpZXNDb3VudDsgfTtcbiAgICBkZXBlbmRlbnRPYnNlcnZhYmxlLmhhc1dyaXRlRnVuY3Rpb24gPSB0eXBlb2Ygb3B0aW9uc1tcIndyaXRlXCJdID09PSBcImZ1bmN0aW9uXCI7XG4gICAgZGVwZW5kZW50T2JzZXJ2YWJsZS5kaXNwb3NlID0gZnVuY3Rpb24gKCkgeyBkaXNwb3NlKCk7IH07XG4gICAgZGVwZW5kZW50T2JzZXJ2YWJsZS5pc0FjdGl2ZSA9IGlzQWN0aXZlO1xuXG4gICAgLy8gUmVwbGFjZSB0aGUgbGltaXQgZnVuY3Rpb24gd2l0aCBvbmUgdGhhdCBkZWxheXMgZXZhbHVhdGlvbiBhcyB3ZWxsLlxuICAgIHZhciBvcmlnaW5hbExpbWl0ID0gZGVwZW5kZW50T2JzZXJ2YWJsZS5saW1pdDtcbiAgICBkZXBlbmRlbnRPYnNlcnZhYmxlLmxpbWl0ID0gZnVuY3Rpb24obGltaXRGdW5jdGlvbikge1xuICAgICAgICBvcmlnaW5hbExpbWl0LmNhbGwoZGVwZW5kZW50T2JzZXJ2YWJsZSwgbGltaXRGdW5jdGlvbik7XG4gICAgICAgIGRlcGVuZGVudE9ic2VydmFibGUuX2V2YWxSYXRlTGltaXRlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZGVwZW5kZW50T2JzZXJ2YWJsZS5fcmF0ZUxpbWl0ZWRCZWZvcmVDaGFuZ2UoX2xhdGVzdFZhbHVlKTtcblxuICAgICAgICAgICAgX25lZWRzRXZhbHVhdGlvbiA9IHRydWU7ICAgIC8vIE1hcmsgYXMgZGlydHlcblxuICAgICAgICAgICAgLy8gUGFzcyB0aGUgb2JzZXJ2YWJsZSB0byB0aGUgcmF0ZS1saW1pdCBjb2RlLCB3aGljaCB3aWxsIGFjY2VzcyBpdCB3aGVuXG4gICAgICAgICAgICAvLyBpdCdzIHRpbWUgdG8gZG8gdGhlIG5vdGlmaWNhdGlvbi5cbiAgICAgICAgICAgIGRlcGVuZGVudE9ic2VydmFibGUuX3JhdGVMaW1pdGVkQ2hhbmdlKGRlcGVuZGVudE9ic2VydmFibGUpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGlmIChvcHRpb25zWydwdXJlJ10pIHtcbiAgICAgICAgcHVyZSA9IHRydWU7XG4gICAgICAgIGlzU2xlZXBpbmcgPSB0cnVlOyAgICAgLy8gU3RhcnRzIG9mZiBzbGVlcGluZzsgd2lsbCBhd2FrZSBvbiB0aGUgZmlyc3Qgc3Vic2NyaXB0aW9uXG4gICAgICAgIGRlcGVuZGVudE9ic2VydmFibGUuYmVmb3JlU3Vic2NyaXB0aW9uQWRkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gSWYgYXNsZWVwLCB3YWtlIHVwIHRoZSBjb21wdXRlZCBhbmQgZXZhbHVhdGUgdG8gcmVnaXN0ZXIgYW55IGRlcGVuZGVuY2llcy5cbiAgICAgICAgICAgIGlmIChpc1NsZWVwaW5nKSB7XG4gICAgICAgICAgICAgICAgaXNTbGVlcGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGV2YWx1YXRlSW1tZWRpYXRlKHRydWUgLyogc3VwcHJlc3NDaGFuZ2VOb3RpZmljYXRpb24gKi8pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGRlcGVuZGVudE9ic2VydmFibGUuYWZ0ZXJTdWJzY3JpcHRpb25SZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIWRlcGVuZGVudE9ic2VydmFibGUuZ2V0U3Vic2NyaXB0aW9uc0NvdW50KCkpIHtcbiAgICAgICAgICAgICAgICBkaXNwb3NlQWxsU3Vic2NyaXB0aW9uc1RvRGVwZW5kZW5jaWVzKCk7XG4gICAgICAgICAgICAgICAgaXNTbGVlcGluZyA9IF9uZWVkc0V2YWx1YXRpb24gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChvcHRpb25zWydkZWZlckV2YWx1YXRpb24nXSkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgZm9yY2UgYSBjb21wdXRlZCB3aXRoIGRlZmVyRXZhbHVhdGlvbiB0byBldmFsdWF0ZSB3aGVuIHRoZSBmaXJzdCBzdWJzY3JpcHRpb25zIGlzIHJlZ2lzdGVyZWQuXG4gICAgICAgIGRlcGVuZGVudE9ic2VydmFibGUuYmVmb3JlU3Vic2NyaXB0aW9uQWRkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcGVlaygpO1xuICAgICAgICAgICAgZGVsZXRlIGRlcGVuZGVudE9ic2VydmFibGUuYmVmb3JlU3Vic2NyaXB0aW9uQWRkO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAga28uZXhwb3J0UHJvcGVydHkoZGVwZW5kZW50T2JzZXJ2YWJsZSwgJ3BlZWsnLCBkZXBlbmRlbnRPYnNlcnZhYmxlLnBlZWspO1xuICAgIGtvLmV4cG9ydFByb3BlcnR5KGRlcGVuZGVudE9ic2VydmFibGUsICdkaXNwb3NlJywgZGVwZW5kZW50T2JzZXJ2YWJsZS5kaXNwb3NlKTtcbiAgICBrby5leHBvcnRQcm9wZXJ0eShkZXBlbmRlbnRPYnNlcnZhYmxlLCAnaXNBY3RpdmUnLCBkZXBlbmRlbnRPYnNlcnZhYmxlLmlzQWN0aXZlKTtcbiAgICBrby5leHBvcnRQcm9wZXJ0eShkZXBlbmRlbnRPYnNlcnZhYmxlLCAnZ2V0RGVwZW5kZW5jaWVzQ291bnQnLCBkZXBlbmRlbnRPYnNlcnZhYmxlLmdldERlcGVuZGVuY2llc0NvdW50KTtcblxuICAgIC8vIEFkZCBhIFwiZGlzcG9zZVdoZW5cIiBjYWxsYmFjayB0aGF0LCBvbiBlYWNoIGV2YWx1YXRpb24sIGRpc3Bvc2VzIGlmIHRoZSBub2RlIHdhcyByZW1vdmVkIHdpdGhvdXQgdXNpbmcga28ucmVtb3ZlTm9kZS5cbiAgICBpZiAoZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkKSB7XG4gICAgICAgIC8vIFNpbmNlIHRoaXMgY29tcHV0ZWQgaXMgYXNzb2NpYXRlZCB3aXRoIGEgRE9NIG5vZGUsIGFuZCB3ZSBkb24ndCB3YW50IHRvIGRpc3Bvc2UgdGhlIGNvbXB1dGVkXG4gICAgICAgIC8vIHVudGlsIHRoZSBET00gbm9kZSBpcyAqcmVtb3ZlZCogZnJvbSB0aGUgZG9jdW1lbnQgKGFzIG9wcG9zZWQgdG8gbmV2ZXIgaGF2aW5nIGJlZW4gaW4gdGhlIGRvY3VtZW50KSxcbiAgICAgICAgLy8gd2UnbGwgcHJldmVudCBkaXNwb3NhbCB1bnRpbCBcImRpc3Bvc2VXaGVuXCIgZmlyc3QgcmV0dXJucyBmYWxzZS5cbiAgICAgICAgX3N1cHByZXNzRGlzcG9zYWxVbnRpbERpc3Bvc2VXaGVuUmV0dXJuc0ZhbHNlID0gdHJ1ZTtcblxuICAgICAgICAvLyBPbmx5IHdhdGNoIGZvciB0aGUgbm9kZSdzIGRpc3Bvc2FsIGlmIHRoZSB2YWx1ZSByZWFsbHkgaXMgYSBub2RlLiBJdCBtaWdodCBub3QgYmUsXG4gICAgICAgIC8vIGUuZy4sIHsgZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkOiB0cnVlIH0gY2FuIGJlIHVzZWQgdG8gb3B0IGludG8gdGhlIFwib25seSBkaXNwb3NlXG4gICAgICAgIC8vIGFmdGVyIGZpcnN0IGZhbHNlIHJlc3VsdFwiIGJlaGF2aW91ciBldmVuIGlmIHRoZXJlJ3Mgbm8gc3BlY2lmaWMgbm9kZSB0byB3YXRjaC4gVGhpc1xuICAgICAgICAvLyB0ZWNobmlxdWUgaXMgaW50ZW5kZWQgZm9yIEtPJ3MgaW50ZXJuYWwgdXNlIG9ubHkgYW5kIHNob3VsZG4ndCBiZSBkb2N1bWVudGVkIG9yIHVzZWRcbiAgICAgICAgLy8gYnkgYXBwbGljYXRpb24gY29kZSwgYXMgaXQncyBsaWtlbHkgdG8gY2hhbmdlIGluIGEgZnV0dXJlIHZlcnNpb24gb2YgS08uXG4gICAgICAgIGlmIChkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQubm9kZVR5cGUpIHtcbiAgICAgICAgICAgIGRpc3Bvc2VXaGVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAha28udXRpbHMuZG9tTm9kZUlzQXR0YWNoZWRUb0RvY3VtZW50KGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZCkgfHwgKGRpc3Bvc2VXaGVuT3B0aW9uICYmIGRpc3Bvc2VXaGVuT3B0aW9uKCkpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEV2YWx1YXRlLCB1bmxlc3Mgc2xlZXBpbmcgb3IgZGVmZXJFdmFsdWF0aW9uIGlzIHRydWVcbiAgICBpZiAoIWlzU2xlZXBpbmcgJiYgIW9wdGlvbnNbJ2RlZmVyRXZhbHVhdGlvbiddKVxuICAgICAgICBldmFsdWF0ZUltbWVkaWF0ZSgpO1xuXG4gICAgLy8gQXR0YWNoIGEgRE9NIG5vZGUgZGlzcG9zYWwgY2FsbGJhY2sgc28gdGhhdCB0aGUgY29tcHV0ZWQgd2lsbCBiZSBwcm9hY3RpdmVseSBkaXNwb3NlZCBhcyBzb29uIGFzIHRoZSBub2RlIGlzXG4gICAgLy8gcmVtb3ZlZCB1c2luZyBrby5yZW1vdmVOb2RlLiBCdXQgc2tpcCBpZiBpc0FjdGl2ZSBpcyBmYWxzZSAodGhlcmUgd2lsbCBuZXZlciBiZSBhbnkgZGVwZW5kZW5jaWVzIHRvIGRpc3Bvc2UpLlxuICAgIGlmIChkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQgJiYgaXNBY3RpdmUoKSAmJiBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQubm9kZVR5cGUpIHtcbiAgICAgICAgZGlzcG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLnJlbW92ZURpc3Bvc2VDYWxsYmFjayhkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQsIGRpc3Bvc2UpO1xuICAgICAgICAgICAgZGlzcG9zZUNvbXB1dGVkKCk7XG4gICAgICAgIH07XG4gICAgICAgIGtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbC5hZGREaXNwb3NlQ2FsbGJhY2soZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkLCBkaXNwb3NlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGVwZW5kZW50T2JzZXJ2YWJsZTtcbn07XG5cbmtvLmlzQ29tcHV0ZWQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICAgIHJldHVybiBrby5oYXNQcm90b3R5cGUoaW5zdGFuY2UsIGtvLmRlcGVuZGVudE9ic2VydmFibGUpO1xufTtcblxudmFyIHByb3RvUHJvcCA9IGtvLm9ic2VydmFibGUucHJvdG9Qcm9wZXJ0eTsgLy8gPT0gXCJfX2tvX3Byb3RvX19cIlxua28uZGVwZW5kZW50T2JzZXJ2YWJsZVtwcm90b1Byb3BdID0ga28ub2JzZXJ2YWJsZTtcblxua28uZGVwZW5kZW50T2JzZXJ2YWJsZVsnZm4nXSA9IHtcbiAgICBcImVxdWFsaXR5Q29tcGFyZXJcIjogdmFsdWVzQXJlUHJpbWl0aXZlQW5kRXF1YWxcbn07XG5rby5kZXBlbmRlbnRPYnNlcnZhYmxlWydmbiddW3Byb3RvUHJvcF0gPSBrby5kZXBlbmRlbnRPYnNlcnZhYmxlO1xuXG4vLyBOb3RlIHRoYXQgZm9yIGJyb3dzZXJzIHRoYXQgZG9uJ3Qgc3VwcG9ydCBwcm90byBhc3NpZ25tZW50LCB0aGVcbi8vIGluaGVyaXRhbmNlIGNoYWluIGlzIGNyZWF0ZWQgbWFudWFsbHkgaW4gdGhlIGtvLmRlcGVuZGVudE9ic2VydmFibGUgY29uc3RydWN0b3JcbmlmIChrby51dGlscy5jYW5TZXRQcm90b3R5cGUpIHtcbiAgICBrby51dGlscy5zZXRQcm90b3R5cGVPZihrby5kZXBlbmRlbnRPYnNlcnZhYmxlWydmbiddLCBrby5zdWJzY3JpYmFibGVbJ2ZuJ10pO1xufVxuXG5rby5leHBvcnRTeW1ib2woJ2RlcGVuZGVudE9ic2VydmFibGUnLCBrby5kZXBlbmRlbnRPYnNlcnZhYmxlKTtcbmtvLmV4cG9ydFN5bWJvbCgnY29tcHV0ZWQnLCBrby5kZXBlbmRlbnRPYnNlcnZhYmxlKTsgLy8gTWFrZSBcImtvLmNvbXB1dGVkXCIgYW4gYWxpYXMgZm9yIFwia28uZGVwZW5kZW50T2JzZXJ2YWJsZVwiXG5rby5leHBvcnRTeW1ib2woJ2lzQ29tcHV0ZWQnLCBrby5pc0NvbXB1dGVkKTtcblxua28ucHVyZUNvbXB1dGVkID0gZnVuY3Rpb24gKGV2YWx1YXRvckZ1bmN0aW9uT3JPcHRpb25zLCBldmFsdWF0b3JGdW5jdGlvblRhcmdldCkge1xuICAgIGlmICh0eXBlb2YgZXZhbHVhdG9yRnVuY3Rpb25Pck9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIGtvLmNvbXB1dGVkKGV2YWx1YXRvckZ1bmN0aW9uT3JPcHRpb25zLCBldmFsdWF0b3JGdW5jdGlvblRhcmdldCwgeydwdXJlJzp0cnVlfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZXZhbHVhdG9yRnVuY3Rpb25Pck9wdGlvbnMgPSBrby51dGlscy5leHRlbmQoe30sIGV2YWx1YXRvckZ1bmN0aW9uT3JPcHRpb25zKTsgICAvLyBtYWtlIGEgY29weSBvZiB0aGUgcGFyYW1ldGVyIG9iamVjdFxuICAgICAgICBldmFsdWF0b3JGdW5jdGlvbk9yT3B0aW9uc1sncHVyZSddID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGtvLmNvbXB1dGVkKGV2YWx1YXRvckZ1bmN0aW9uT3JPcHRpb25zLCBldmFsdWF0b3JGdW5jdGlvblRhcmdldCk7XG4gICAgfVxufVxua28uZXhwb3J0U3ltYm9sKCdwdXJlQ29tcHV0ZWQnLCBrby5wdXJlQ29tcHV0ZWQpO1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgdmFyIG1heE5lc3RlZE9ic2VydmFibGVEZXB0aCA9IDEwOyAvLyBFc2NhcGUgdGhlICh1bmxpa2VseSkgcGF0aGFsb2dpY2FsIGNhc2Ugd2hlcmUgYW4gb2JzZXJ2YWJsZSdzIGN1cnJlbnQgdmFsdWUgaXMgaXRzZWxmIChvciBzaW1pbGFyIHJlZmVyZW5jZSBjeWNsZSlcblxuICAgIGtvLnRvSlMgPSBmdW5jdGlvbihyb290T2JqZWN0KSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJXaGVuIGNhbGxpbmcga28udG9KUywgcGFzcyB0aGUgb2JqZWN0IHlvdSB3YW50IHRvIGNvbnZlcnQuXCIpO1xuXG4gICAgICAgIC8vIFdlIGp1c3QgdW53cmFwIGV2ZXJ5dGhpbmcgYXQgZXZlcnkgbGV2ZWwgaW4gdGhlIG9iamVjdCBncmFwaFxuICAgICAgICByZXR1cm4gbWFwSnNPYmplY3RHcmFwaChyb290T2JqZWN0LCBmdW5jdGlvbih2YWx1ZVRvTWFwKSB7XG4gICAgICAgICAgICAvLyBMb29wIGJlY2F1c2UgYW4gb2JzZXJ2YWJsZSdzIHZhbHVlIG1pZ2h0IGluIHR1cm4gYmUgYW5vdGhlciBvYnNlcnZhYmxlIHdyYXBwZXJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBrby5pc09ic2VydmFibGUodmFsdWVUb01hcCkgJiYgKGkgPCBtYXhOZXN0ZWRPYnNlcnZhYmxlRGVwdGgpOyBpKyspXG4gICAgICAgICAgICAgICAgdmFsdWVUb01hcCA9IHZhbHVlVG9NYXAoKTtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZVRvTWFwO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAga28udG9KU09OID0gZnVuY3Rpb24ocm9vdE9iamVjdCwgcmVwbGFjZXIsIHNwYWNlKSB7ICAgICAvLyByZXBsYWNlciBhbmQgc3BhY2UgYXJlIG9wdGlvbmFsXG4gICAgICAgIHZhciBwbGFpbkphdmFTY3JpcHRPYmplY3QgPSBrby50b0pTKHJvb3RPYmplY3QpO1xuICAgICAgICByZXR1cm4ga28udXRpbHMuc3RyaW5naWZ5SnNvbihwbGFpbkphdmFTY3JpcHRPYmplY3QsIHJlcGxhY2VyLCBzcGFjZSk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIG1hcEpzT2JqZWN0R3JhcGgocm9vdE9iamVjdCwgbWFwSW5wdXRDYWxsYmFjaywgdmlzaXRlZE9iamVjdHMpIHtcbiAgICAgICAgdmlzaXRlZE9iamVjdHMgPSB2aXNpdGVkT2JqZWN0cyB8fCBuZXcgb2JqZWN0TG9va3VwKCk7XG5cbiAgICAgICAgcm9vdE9iamVjdCA9IG1hcElucHV0Q2FsbGJhY2socm9vdE9iamVjdCk7XG4gICAgICAgIHZhciBjYW5IYXZlUHJvcGVydGllcyA9ICh0eXBlb2Ygcm9vdE9iamVjdCA9PSBcIm9iamVjdFwiKSAmJiAocm9vdE9iamVjdCAhPT0gbnVsbCkgJiYgKHJvb3RPYmplY3QgIT09IHVuZGVmaW5lZCkgJiYgKCEocm9vdE9iamVjdCBpbnN0YW5jZW9mIERhdGUpKSAmJiAoIShyb290T2JqZWN0IGluc3RhbmNlb2YgU3RyaW5nKSkgJiYgKCEocm9vdE9iamVjdCBpbnN0YW5jZW9mIE51bWJlcikpICYmICghKHJvb3RPYmplY3QgaW5zdGFuY2VvZiBCb29sZWFuKSk7XG4gICAgICAgIGlmICghY2FuSGF2ZVByb3BlcnRpZXMpXG4gICAgICAgICAgICByZXR1cm4gcm9vdE9iamVjdDtcblxuICAgICAgICB2YXIgb3V0cHV0UHJvcGVydGllcyA9IHJvb3RPYmplY3QgaW5zdGFuY2VvZiBBcnJheSA/IFtdIDoge307XG4gICAgICAgIHZpc2l0ZWRPYmplY3RzLnNhdmUocm9vdE9iamVjdCwgb3V0cHV0UHJvcGVydGllcyk7XG5cbiAgICAgICAgdmlzaXRQcm9wZXJ0aWVzT3JBcnJheUVudHJpZXMocm9vdE9iamVjdCwgZnVuY3Rpb24oaW5kZXhlcikge1xuICAgICAgICAgICAgdmFyIHByb3BlcnR5VmFsdWUgPSBtYXBJbnB1dENhbGxiYWNrKHJvb3RPYmplY3RbaW5kZXhlcl0pO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGVvZiBwcm9wZXJ0eVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICAgICAgICAgICAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICAgICAgICAgICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgICAgICAgICAgIGNhc2UgXCJmdW5jdGlvblwiOlxuICAgICAgICAgICAgICAgICAgICBvdXRwdXRQcm9wZXJ0aWVzW2luZGV4ZXJdID0gcHJvcGVydHlWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgICAgICAgICAgIGNhc2UgXCJ1bmRlZmluZWRcIjpcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByZXZpb3VzbHlNYXBwZWRWYWx1ZSA9IHZpc2l0ZWRPYmplY3RzLmdldChwcm9wZXJ0eVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0UHJvcGVydGllc1tpbmRleGVyXSA9IChwcmV2aW91c2x5TWFwcGVkVmFsdWUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgICAgID8gcHJldmlvdXNseU1hcHBlZFZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICA6IG1hcEpzT2JqZWN0R3JhcGgocHJvcGVydHlWYWx1ZSwgbWFwSW5wdXRDYWxsYmFjaywgdmlzaXRlZE9iamVjdHMpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIG91dHB1dFByb3BlcnRpZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmlzaXRQcm9wZXJ0aWVzT3JBcnJheUVudHJpZXMocm9vdE9iamVjdCwgdmlzaXRvckNhbGxiYWNrKSB7XG4gICAgICAgIGlmIChyb290T2JqZWN0IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm9vdE9iamVjdC5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgICAgICB2aXNpdG9yQ2FsbGJhY2soaSk7XG5cbiAgICAgICAgICAgIC8vIEZvciBhcnJheXMsIGFsc28gcmVzcGVjdCB0b0pTT04gcHJvcGVydHkgZm9yIGN1c3RvbSBtYXBwaW5ncyAoZml4ZXMgIzI3OClcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygcm9vdE9iamVjdFsndG9KU09OJ10gPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICB2aXNpdG9yQ2FsbGJhY2soJ3RvSlNPTicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHlOYW1lIGluIHJvb3RPYmplY3QpIHtcbiAgICAgICAgICAgICAgICB2aXNpdG9yQ2FsbGJhY2socHJvcGVydHlOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBvYmplY3RMb29rdXAoKSB7XG4gICAgICAgIHRoaXMua2V5cyA9IFtdO1xuICAgICAgICB0aGlzLnZhbHVlcyA9IFtdO1xuICAgIH07XG5cbiAgICBvYmplY3RMb29rdXAucHJvdG90eXBlID0ge1xuICAgICAgICBjb25zdHJ1Y3Rvcjogb2JqZWN0TG9va3VwLFxuICAgICAgICBzYXZlOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgZXhpc3RpbmdJbmRleCA9IGtvLnV0aWxzLmFycmF5SW5kZXhPZih0aGlzLmtleXMsIGtleSk7XG4gICAgICAgICAgICBpZiAoZXhpc3RpbmdJbmRleCA+PSAwKVxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVzW2V4aXN0aW5nSW5kZXhdID0gdmFsdWU7XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmtleXMucHVzaChrZXkpO1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVzLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgdmFyIGV4aXN0aW5nSW5kZXggPSBrby51dGlscy5hcnJheUluZGV4T2YodGhpcy5rZXlzLCBrZXkpO1xuICAgICAgICAgICAgcmV0dXJuIChleGlzdGluZ0luZGV4ID49IDApID8gdGhpcy52YWx1ZXNbZXhpc3RpbmdJbmRleF0gOiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcblxua28uZXhwb3J0U3ltYm9sKCd0b0pTJywga28udG9KUyk7XG5rby5leHBvcnRTeW1ib2woJ3RvSlNPTicsIGtvLnRvSlNPTik7XG4oZnVuY3Rpb24gKCkge1xuICAgIHZhciBoYXNEb21EYXRhRXhwYW5kb1Byb3BlcnR5ID0gJ19fa29fX2hhc0RvbURhdGFPcHRpb25WYWx1ZV9fJztcblxuICAgIC8vIE5vcm1hbGx5LCBTRUxFQ1QgZWxlbWVudHMgYW5kIHRoZWlyIE9QVElPTnMgY2FuIG9ubHkgdGFrZSB2YWx1ZSBvZiB0eXBlICdzdHJpbmcnIChiZWNhdXNlIHRoZSB2YWx1ZXNcbiAgICAvLyBhcmUgc3RvcmVkIG9uIERPTSBhdHRyaWJ1dGVzKS4ga28uc2VsZWN0RXh0ZW5zaW9ucyBwcm92aWRlcyBhIHdheSBmb3IgU0VMRUNUcy9PUFRJT05zIHRvIGhhdmUgdmFsdWVzXG4gICAgLy8gdGhhdCBhcmUgYXJiaXRyYXJ5IG9iamVjdHMuIFRoaXMgaXMgdmVyeSBjb252ZW5pZW50IHdoZW4gaW1wbGVtZW50aW5nIHRoaW5ncyBsaWtlIGNhc2NhZGluZyBkcm9wZG93bnMuXG4gICAga28uc2VsZWN0RXh0ZW5zaW9ucyA9IHtcbiAgICAgICAgcmVhZFZhbHVlIDogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgc3dpdGNoIChrby51dGlscy50YWdOYW1lTG93ZXIoZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdvcHRpb24nOlxuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudFtoYXNEb21EYXRhRXhwYW5kb1Byb3BlcnR5XSA9PT0gdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBrby51dGlscy5kb21EYXRhLmdldChlbGVtZW50LCBrby5iaW5kaW5nSGFuZGxlcnMub3B0aW9ucy5vcHRpb25WYWx1ZURvbURhdGFLZXkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga28udXRpbHMuaWVWZXJzaW9uIDw9IDdcbiAgICAgICAgICAgICAgICAgICAgICAgID8gKGVsZW1lbnQuZ2V0QXR0cmlidXRlTm9kZSgndmFsdWUnKSAmJiBlbGVtZW50LmdldEF0dHJpYnV0ZU5vZGUoJ3ZhbHVlJykuc3BlY2lmaWVkID8gZWxlbWVudC52YWx1ZSA6IGVsZW1lbnQudGV4dClcbiAgICAgICAgICAgICAgICAgICAgICAgIDogZWxlbWVudC52YWx1ZTtcbiAgICAgICAgICAgICAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudC5zZWxlY3RlZEluZGV4ID49IDAgPyBrby5zZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZShlbGVtZW50Lm9wdGlvbnNbZWxlbWVudC5zZWxlY3RlZEluZGV4XSkgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgd3JpdGVWYWx1ZTogZnVuY3Rpb24oZWxlbWVudCwgdmFsdWUsIGFsbG93VW5zZXQpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoa28udXRpbHMudGFnTmFtZUxvd2VyKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnb3B0aW9uJzpcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoKHR5cGVvZiB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtvLnV0aWxzLmRvbURhdGEuc2V0KGVsZW1lbnQsIGtvLmJpbmRpbmdIYW5kbGVycy5vcHRpb25zLm9wdGlvblZhbHVlRG9tRGF0YUtleSwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFzRG9tRGF0YUV4cGFuZG9Qcm9wZXJ0eSBpbiBlbGVtZW50KSB7IC8vIElFIDw9IDggdGhyb3dzIGVycm9ycyBpZiB5b3UgZGVsZXRlIG5vbi1leGlzdGVudCBwcm9wZXJ0aWVzIGZyb20gYSBET00gbm9kZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgZWxlbWVudFtoYXNEb21EYXRhRXhwYW5kb1Byb3BlcnR5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTdG9yZSBhcmJpdHJhcnkgb2JqZWN0IHVzaW5nIERvbURhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrby51dGlscy5kb21EYXRhLnNldChlbGVtZW50LCBrby5iaW5kaW5nSGFuZGxlcnMub3B0aW9ucy5vcHRpb25WYWx1ZURvbURhdGFLZXksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50W2hhc0RvbURhdGFFeHBhbmRvUHJvcGVydHldID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNwZWNpYWwgdHJlYXRtZW50IG9mIG51bWJlcnMgaXMganVzdCBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eS4gS08gMS4yLjEgd3JvdGUgbnVtZXJpY2FsIHZhbHVlcyB0byBlbGVtZW50LnZhbHVlLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudmFsdWUgPSB0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIgPyB2YWx1ZSA6IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSBcIlwiIHx8IHZhbHVlID09PSBudWxsKSAgICAgICAvLyBBIGJsYW5rIHN0cmluZyBvciBudWxsIHZhbHVlIHdpbGwgc2VsZWN0IHRoZSBjYXB0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdGlvbiA9IC0xO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbiA9IGVsZW1lbnQub3B0aW9ucy5sZW5ndGgsIG9wdGlvblZhbHVlOyBpIDwgbjsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25WYWx1ZSA9IGtvLnNlbGVjdEV4dGVuc2lvbnMucmVhZFZhbHVlKGVsZW1lbnQub3B0aW9uc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJbmNsdWRlIHNwZWNpYWwgY2hlY2sgdG8gaGFuZGxlIHNlbGVjdGluZyBhIGNhcHRpb24gd2l0aCBhIGJsYW5rIHN0cmluZyB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvblZhbHVlID09IHZhbHVlIHx8IChvcHRpb25WYWx1ZSA9PSBcIlwiICYmIHZhbHVlID09PSB1bmRlZmluZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoYWxsb3dVbnNldCB8fCBzZWxlY3Rpb24gPj0gMCB8fCAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiBlbGVtZW50LnNpemUgPiAxKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZWxlY3RlZEluZGV4ID0gc2VsZWN0aW9uO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICgodmFsdWUgPT09IG51bGwpIHx8ICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuXG5rby5leHBvcnRTeW1ib2woJ3NlbGVjdEV4dGVuc2lvbnMnLCBrby5zZWxlY3RFeHRlbnNpb25zKTtcbmtvLmV4cG9ydFN5bWJvbCgnc2VsZWN0RXh0ZW5zaW9ucy5yZWFkVmFsdWUnLCBrby5zZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZSk7XG5rby5leHBvcnRTeW1ib2woJ3NlbGVjdEV4dGVuc2lvbnMud3JpdGVWYWx1ZScsIGtvLnNlbGVjdEV4dGVuc2lvbnMud3JpdGVWYWx1ZSk7XG5rby5leHByZXNzaW9uUmV3cml0aW5nID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgamF2YVNjcmlwdFJlc2VydmVkV29yZHMgPSBbXCJ0cnVlXCIsIFwiZmFsc2VcIiwgXCJudWxsXCIsIFwidW5kZWZpbmVkXCJdO1xuXG4gICAgLy8gTWF0Y2hlcyBzb21ldGhpbmcgdGhhdCBjYW4gYmUgYXNzaWduZWQgdG8tLWVpdGhlciBhbiBpc29sYXRlZCBpZGVudGlmaWVyIG9yIHNvbWV0aGluZyBlbmRpbmcgd2l0aCBhIHByb3BlcnR5IGFjY2Vzc29yXG4gICAgLy8gVGhpcyBpcyBkZXNpZ25lZCB0byBiZSBzaW1wbGUgYW5kIGF2b2lkIGZhbHNlIG5lZ2F0aXZlcywgYnV0IGNvdWxkIHByb2R1Y2UgZmFsc2UgcG9zaXRpdmVzIChlLmcuLCBhK2IuYykuXG4gICAgLy8gVGhpcyBhbHNvIHdpbGwgbm90IHByb3Blcmx5IGhhbmRsZSBuZXN0ZWQgYnJhY2tldHMgKGUuZy4sIG9iajFbb2JqMlsncHJvcCddXTsgc2VlICM5MTEpLlxuICAgIHZhciBqYXZhU2NyaXB0QXNzaWdubWVudFRhcmdldCA9IC9eKD86WyRfYS16XVskXFx3XSp8KC4rKShcXC5cXHMqWyRfYS16XVskXFx3XSp8XFxbLitcXF0pKSQvaTtcblxuICAgIGZ1bmN0aW9uIGdldFdyaXRlYWJsZVZhbHVlKGV4cHJlc3Npb24pIHtcbiAgICAgICAgaWYgKGtvLnV0aWxzLmFycmF5SW5kZXhPZihqYXZhU2NyaXB0UmVzZXJ2ZWRXb3JkcywgZXhwcmVzc2lvbikgPj0gMClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgdmFyIG1hdGNoID0gZXhwcmVzc2lvbi5tYXRjaChqYXZhU2NyaXB0QXNzaWdubWVudFRhcmdldCk7XG4gICAgICAgIHJldHVybiBtYXRjaCA9PT0gbnVsbCA/IGZhbHNlIDogbWF0Y2hbMV0gPyAoJ09iamVjdCgnICsgbWF0Y2hbMV0gKyAnKScgKyBtYXRjaFsyXSkgOiBleHByZXNzaW9uO1xuICAgIH1cblxuICAgIC8vIFRoZSBmb2xsb3dpbmcgcmVndWxhciBleHByZXNzaW9ucyB3aWxsIGJlIHVzZWQgdG8gc3BsaXQgYW4gb2JqZWN0LWxpdGVyYWwgc3RyaW5nIGludG8gdG9rZW5zXG5cbiAgICAgICAgLy8gVGhlc2UgdHdvIG1hdGNoIHN0cmluZ3MsIGVpdGhlciB3aXRoIGRvdWJsZSBxdW90ZXMgb3Igc2luZ2xlIHF1b3Rlc1xuICAgIHZhciBzdHJpbmdEb3VibGUgPSAnXCIoPzpbXlwiXFxcXFxcXFxdfFxcXFxcXFxcLikqXCInLFxuICAgICAgICBzdHJpbmdTaW5nbGUgPSBcIicoPzpbXidcXFxcXFxcXF18XFxcXFxcXFwuKSonXCIsXG4gICAgICAgIC8vIE1hdGNoZXMgYSByZWd1bGFyIGV4cHJlc3Npb24gKHRleHQgZW5jbG9zZWQgYnkgc2xhc2hlcyksIGJ1dCB3aWxsIGFsc28gbWF0Y2ggc2V0cyBvZiBkaXZpc2lvbnNcbiAgICAgICAgLy8gYXMgYSByZWd1bGFyIGV4cHJlc3Npb24gKHRoaXMgaXMgaGFuZGxlZCBieSB0aGUgcGFyc2luZyBsb29wIGJlbG93KS5cbiAgICAgICAgc3RyaW5nUmVnZXhwID0gJy8oPzpbXi9cXFxcXFxcXF18XFxcXFxcXFwuKSovXFx3KicsXG4gICAgICAgIC8vIFRoZXNlIGNoYXJhY3RlcnMgaGF2ZSBzcGVjaWFsIG1lYW5pbmcgdG8gdGhlIHBhcnNlciBhbmQgbXVzdCBub3QgYXBwZWFyIGluIHRoZSBtaWRkbGUgb2YgYVxuICAgICAgICAvLyB0b2tlbiwgZXhjZXB0IGFzIHBhcnQgb2YgYSBzdHJpbmcuXG4gICAgICAgIHNwZWNpYWxzID0gJyxcIlxcJ3t9KCkvOltcXFxcXScsXG4gICAgICAgIC8vIE1hdGNoIHRleHQgKGF0IGxlYXN0IHR3byBjaGFyYWN0ZXJzKSB0aGF0IGRvZXMgbm90IGNvbnRhaW4gYW55IG9mIHRoZSBhYm92ZSBzcGVjaWFsIGNoYXJhY3RlcnMsXG4gICAgICAgIC8vIGFsdGhvdWdoIHNvbWUgb2YgdGhlIHNwZWNpYWwgY2hhcmFjdGVycyBhcmUgYWxsb3dlZCB0byBzdGFydCBpdCAoYWxsIGJ1dCB0aGUgY29sb24gYW5kIGNvbW1hKS5cbiAgICAgICAgLy8gVGhlIHRleHQgY2FuIGNvbnRhaW4gc3BhY2VzLCBidXQgbGVhZGluZyBvciB0cmFpbGluZyBzcGFjZXMgYXJlIHNraXBwZWQuXG4gICAgICAgIGV2ZXJ5VGhpbmdFbHNlID0gJ1teXFxcXHM6LC9dW14nICsgc3BlY2lhbHMgKyAnXSpbXlxcXFxzJyArIHNwZWNpYWxzICsgJ10nLFxuICAgICAgICAvLyBNYXRjaCBhbnkgbm9uLXNwYWNlIGNoYXJhY3RlciBub3QgbWF0Y2hlZCBhbHJlYWR5LiBUaGlzIHdpbGwgbWF0Y2ggY29sb25zIGFuZCBjb21tYXMsIHNpbmNlIHRoZXkncmVcbiAgICAgICAgLy8gbm90IG1hdGNoZWQgYnkgXCJldmVyeVRoaW5nRWxzZVwiLCBidXQgd2lsbCBhbHNvIG1hdGNoIGFueSBvdGhlciBzaW5nbGUgY2hhcmFjdGVyIHRoYXQgd2Fzbid0IGFscmVhZHlcbiAgICAgICAgLy8gbWF0Y2hlZCAoZm9yIGV4YW1wbGU6IGluIFwiYTogMSwgYjogMlwiLCBlYWNoIG9mIHRoZSBub24tc3BhY2UgY2hhcmFjdGVycyB3aWxsIGJlIG1hdGNoZWQgYnkgb25lTm90U3BhY2UpLlxuICAgICAgICBvbmVOb3RTcGFjZSA9ICdbXlxcXFxzXScsXG5cbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBhY3R1YWwgcmVndWxhciBleHByZXNzaW9uIGJ5IG9yLWluZyB0aGUgYWJvdmUgc3RyaW5ncy4gVGhlIG9yZGVyIGlzIGltcG9ydGFudC5cbiAgICAgICAgYmluZGluZ1Rva2VuID0gUmVnRXhwKHN0cmluZ0RvdWJsZSArICd8JyArIHN0cmluZ1NpbmdsZSArICd8JyArIHN0cmluZ1JlZ2V4cCArICd8JyArIGV2ZXJ5VGhpbmdFbHNlICsgJ3wnICsgb25lTm90U3BhY2UsICdnJyksXG5cbiAgICAgICAgLy8gTWF0Y2ggZW5kIG9mIHByZXZpb3VzIHRva2VuIHRvIGRldGVybWluZSB3aGV0aGVyIGEgc2xhc2ggaXMgYSBkaXZpc2lvbiBvciByZWdleC5cbiAgICAgICAgZGl2aXNpb25Mb29rQmVoaW5kID0gL1tcXF0pXCInQS1aYS16MC05XyRdKyQvLFxuICAgICAgICBrZXl3b3JkUmVnZXhMb29rQmVoaW5kID0geydpbic6MSwncmV0dXJuJzoxLCd0eXBlb2YnOjF9O1xuXG4gICAgZnVuY3Rpb24gcGFyc2VPYmplY3RMaXRlcmFsKG9iamVjdExpdGVyYWxTdHJpbmcpIHtcbiAgICAgICAgLy8gVHJpbSBsZWFkaW5nIGFuZCB0cmFpbGluZyBzcGFjZXMgZnJvbSB0aGUgc3RyaW5nXG4gICAgICAgIHZhciBzdHIgPSBrby51dGlscy5zdHJpbmdUcmltKG9iamVjdExpdGVyYWxTdHJpbmcpO1xuXG4gICAgICAgIC8vIFRyaW0gYnJhY2VzICd7JyBzdXJyb3VuZGluZyB0aGUgd2hvbGUgb2JqZWN0IGxpdGVyYWxcbiAgICAgICAgaWYgKHN0ci5jaGFyQ29kZUF0KDApID09PSAxMjMpIHN0ciA9IHN0ci5zbGljZSgxLCAtMSk7XG5cbiAgICAgICAgLy8gU3BsaXQgaW50byB0b2tlbnNcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdLCB0b2tzID0gc3RyLm1hdGNoKGJpbmRpbmdUb2tlbiksIGtleSwgdmFsdWVzLCBkZXB0aCA9IDA7XG5cbiAgICAgICAgaWYgKHRva3MpIHtcbiAgICAgICAgICAgIC8vIEFwcGVuZCBhIGNvbW1hIHNvIHRoYXQgd2UgZG9uJ3QgbmVlZCBhIHNlcGFyYXRlIGNvZGUgYmxvY2sgdG8gZGVhbCB3aXRoIHRoZSBsYXN0IGl0ZW1cbiAgICAgICAgICAgIHRva3MucHVzaCgnLCcpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgdG9rOyB0b2sgPSB0b2tzW2ldOyArK2kpIHtcbiAgICAgICAgICAgICAgICB2YXIgYyA9IHRvay5jaGFyQ29kZUF0KDApO1xuICAgICAgICAgICAgICAgIC8vIEEgY29tbWEgc2lnbmFscyB0aGUgZW5kIG9mIGEga2V5L3ZhbHVlIHBhaXIgaWYgZGVwdGggaXMgemVyb1xuICAgICAgICAgICAgICAgIGlmIChjID09PSA0NCkgeyAvLyBcIixcIlxuICAgICAgICAgICAgICAgICAgICBpZiAoZGVwdGggPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtleSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh2YWx1ZXMgPyB7a2V5OiBrZXksIHZhbHVlOiB2YWx1ZXMuam9pbignJyl9IDogeyd1bmtub3duJzoga2V5fSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXkgPSB2YWx1ZXMgPSBkZXB0aCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIFNpbXBseSBza2lwIHRoZSBjb2xvbiB0aGF0IHNlcGFyYXRlcyB0aGUgbmFtZSBhbmQgdmFsdWVcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09IDU4KSB7IC8vIFwiOlwiXG4gICAgICAgICAgICAgICAgICAgIGlmICghdmFsdWVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgLy8gQSBzZXQgb2Ygc2xhc2hlcyBpcyBpbml0aWFsbHkgbWF0Y2hlZCBhcyBhIHJlZ3VsYXIgZXhwcmVzc2lvbiwgYnV0IGNvdWxkIGJlIGRpdmlzaW9uXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjID09PSA0NyAmJiBpICYmIHRvay5sZW5ndGggPiAxKSB7ICAvLyBcIi9cIlxuICAgICAgICAgICAgICAgICAgICAvLyBMb29rIGF0IHRoZSBlbmQgb2YgdGhlIHByZXZpb3VzIHRva2VuIHRvIGRldGVybWluZSBpZiB0aGUgc2xhc2ggaXMgYWN0dWFsbHkgZGl2aXNpb25cbiAgICAgICAgICAgICAgICAgICAgdmFyIG1hdGNoID0gdG9rc1tpLTFdLm1hdGNoKGRpdmlzaW9uTG9va0JlaGluZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaCAmJiAha2V5d29yZFJlZ2V4TG9va0JlaGluZFttYXRjaFswXV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBzbGFzaCBpcyBhY3R1YWxseSBhIGRpdmlzaW9uIHB1bmN0dWF0b3I7IHJlLXBhcnNlIHRoZSByZW1haW5kZXIgb2YgdGhlIHN0cmluZyAobm90IGluY2x1ZGluZyB0aGUgc2xhc2gpXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHIgPSBzdHIuc3Vic3RyKHN0ci5pbmRleE9mKHRvaykgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva3MgPSBzdHIubWF0Y2goYmluZGluZ1Rva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva3MucHVzaCgnLCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaSA9IC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ29udGludWUgd2l0aCBqdXN0IHRoZSBzbGFzaFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9rID0gJy8nO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gSW5jcmVtZW50IGRlcHRoIGZvciBwYXJlbnRoZXNlcywgYnJhY2VzLCBhbmQgYnJhY2tldHMgc28gdGhhdCBpbnRlcmlvciBjb21tYXMgYXJlIGlnbm9yZWRcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09IDQwIHx8IGMgPT09IDEyMyB8fCBjID09PSA5MSkgeyAvLyAnKCcsICd7JywgJ1snXG4gICAgICAgICAgICAgICAgICAgICsrZGVwdGg7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjID09PSA0MSB8fCBjID09PSAxMjUgfHwgYyA9PT0gOTMpIHsgLy8gJyknLCAnfScsICddJ1xuICAgICAgICAgICAgICAgICAgICAtLWRlcHRoO1xuICAgICAgICAgICAgICAgIC8vIFRoZSBrZXkgbXVzdCBiZSBhIHNpbmdsZSB0b2tlbjsgaWYgaXQncyBhIHN0cmluZywgdHJpbSB0aGUgcXVvdGVzXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgha2V5ICYmICF2YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAga2V5ID0gKGMgPT09IDM0IHx8IGMgPT09IDM5KSAvKiAnXCInLCBcIidcIiAqLyA/IHRvay5zbGljZSgxLCAtMSkgOiB0b2s7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodmFsdWVzKVxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaCh0b2spO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzID0gW3Rva107XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvLyBUd28td2F5IGJpbmRpbmdzIGluY2x1ZGUgYSB3cml0ZSBmdW5jdGlvbiB0aGF0IGFsbG93IHRoZSBoYW5kbGVyIHRvIHVwZGF0ZSB0aGUgdmFsdWUgZXZlbiBpZiBpdCdzIG5vdCBhbiBvYnNlcnZhYmxlLlxuICAgIHZhciB0d29XYXlCaW5kaW5ncyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gcHJlUHJvY2Vzc0JpbmRpbmdzKGJpbmRpbmdzU3RyaW5nT3JLZXlWYWx1ZUFycmF5LCBiaW5kaW5nT3B0aW9ucykge1xuICAgICAgICBiaW5kaW5nT3B0aW9ucyA9IGJpbmRpbmdPcHRpb25zIHx8IHt9O1xuXG4gICAgICAgIGZ1bmN0aW9uIHByb2Nlc3NLZXlWYWx1ZShrZXksIHZhbCkge1xuICAgICAgICAgICAgdmFyIHdyaXRhYmxlVmFsO1xuICAgICAgICAgICAgZnVuY3Rpb24gY2FsbFByZXByb2Nlc3NIb29rKG9iaikge1xuICAgICAgICAgICAgICAgIHJldHVybiAob2JqICYmIG9ialsncHJlcHJvY2VzcyddKSA/ICh2YWwgPSBvYmpbJ3ByZXByb2Nlc3MnXSh2YWwsIGtleSwgcHJvY2Vzc0tleVZhbHVlKSkgOiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFiaW5kaW5nUGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjYWxsUHJlcHJvY2Vzc0hvb2soa29bJ2dldEJpbmRpbmdIYW5kbGVyJ10oa2V5KSkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgICAgIGlmICh0d29XYXlCaW5kaW5nc1trZXldICYmICh3cml0YWJsZVZhbCA9IGdldFdyaXRlYWJsZVZhbHVlKHZhbCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEZvciB0d28td2F5IGJpbmRpbmdzLCBwcm92aWRlIGEgd3JpdGUgbWV0aG9kIGluIGNhc2UgdGhlIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIC8vIGlzbid0IGEgd3JpdGFibGUgb2JzZXJ2YWJsZS5cbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlBY2Nlc3NvclJlc3VsdFN0cmluZ3MucHVzaChcIidcIiArIGtleSArIFwiJzpmdW5jdGlvbihfeil7XCIgKyB3cml0YWJsZVZhbCArIFwiPV96fVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBWYWx1ZXMgYXJlIHdyYXBwZWQgaW4gYSBmdW5jdGlvbiBzbyB0aGF0IGVhY2ggdmFsdWUgY2FuIGJlIGFjY2Vzc2VkIGluZGVwZW5kZW50bHlcbiAgICAgICAgICAgIGlmIChtYWtlVmFsdWVBY2Nlc3NvcnMpIHtcbiAgICAgICAgICAgICAgICB2YWwgPSAnZnVuY3Rpb24oKXtyZXR1cm4gJyArIHZhbCArICcgfSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXN1bHRTdHJpbmdzLnB1c2goXCInXCIgKyBrZXkgKyBcIic6XCIgKyB2YWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJlc3VsdFN0cmluZ3MgPSBbXSxcbiAgICAgICAgICAgIHByb3BlcnR5QWNjZXNzb3JSZXN1bHRTdHJpbmdzID0gW10sXG4gICAgICAgICAgICBtYWtlVmFsdWVBY2Nlc3NvcnMgPSBiaW5kaW5nT3B0aW9uc1sndmFsdWVBY2Nlc3NvcnMnXSxcbiAgICAgICAgICAgIGJpbmRpbmdQYXJhbXMgPSBiaW5kaW5nT3B0aW9uc1snYmluZGluZ1BhcmFtcyddLFxuICAgICAgICAgICAga2V5VmFsdWVBcnJheSA9IHR5cGVvZiBiaW5kaW5nc1N0cmluZ09yS2V5VmFsdWVBcnJheSA9PT0gXCJzdHJpbmdcIiA/XG4gICAgICAgICAgICAgICAgcGFyc2VPYmplY3RMaXRlcmFsKGJpbmRpbmdzU3RyaW5nT3JLZXlWYWx1ZUFycmF5KSA6IGJpbmRpbmdzU3RyaW5nT3JLZXlWYWx1ZUFycmF5O1xuXG4gICAgICAgIGtvLnV0aWxzLmFycmF5Rm9yRWFjaChrZXlWYWx1ZUFycmF5LCBmdW5jdGlvbihrZXlWYWx1ZSkge1xuICAgICAgICAgICAgcHJvY2Vzc0tleVZhbHVlKGtleVZhbHVlLmtleSB8fCBrZXlWYWx1ZVsndW5rbm93biddLCBrZXlWYWx1ZS52YWx1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChwcm9wZXJ0eUFjY2Vzc29yUmVzdWx0U3RyaW5ncy5sZW5ndGgpXG4gICAgICAgICAgICBwcm9jZXNzS2V5VmFsdWUoJ19rb19wcm9wZXJ0eV93cml0ZXJzJywgXCJ7XCIgKyBwcm9wZXJ0eUFjY2Vzc29yUmVzdWx0U3RyaW5ncy5qb2luKFwiLFwiKSArIFwiIH1cIik7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdFN0cmluZ3Muam9pbihcIixcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgYmluZGluZ1Jld3JpdGVWYWxpZGF0b3JzOiBbXSxcblxuICAgICAgICB0d29XYXlCaW5kaW5nczogdHdvV2F5QmluZGluZ3MsXG5cbiAgICAgICAgcGFyc2VPYmplY3RMaXRlcmFsOiBwYXJzZU9iamVjdExpdGVyYWwsXG5cbiAgICAgICAgcHJlUHJvY2Vzc0JpbmRpbmdzOiBwcmVQcm9jZXNzQmluZGluZ3MsXG5cbiAgICAgICAga2V5VmFsdWVBcnJheUNvbnRhaW5zS2V5OiBmdW5jdGlvbihrZXlWYWx1ZUFycmF5LCBrZXkpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5VmFsdWVBcnJheS5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgICAgICBpZiAoa2V5VmFsdWVBcnJheVtpXVsna2V5J10gPT0ga2V5KVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBJbnRlcm5hbCwgcHJpdmF0ZSBLTyB1dGlsaXR5IGZvciB1cGRhdGluZyBtb2RlbCBwcm9wZXJ0aWVzIGZyb20gd2l0aGluIGJpbmRpbmdzXG4gICAgICAgIC8vIHByb3BlcnR5OiAgICAgICAgICAgIElmIHRoZSBwcm9wZXJ0eSBiZWluZyB1cGRhdGVkIGlzIChvciBtaWdodCBiZSkgYW4gb2JzZXJ2YWJsZSwgcGFzcyBpdCBoZXJlXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgIElmIGl0IHR1cm5zIG91dCB0byBiZSBhIHdyaXRhYmxlIG9ic2VydmFibGUsIGl0IHdpbGwgYmUgd3JpdHRlbiB0byBkaXJlY3RseVxuICAgICAgICAvLyBhbGxCaW5kaW5nczogICAgICAgICBBbiBvYmplY3Qgd2l0aCBhIGdldCBtZXRob2QgdG8gcmV0cmlldmUgYmluZGluZ3MgaW4gdGhlIGN1cnJlbnQgZXhlY3V0aW9uIGNvbnRleHQuXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgIFRoaXMgd2lsbCBiZSBzZWFyY2hlZCBmb3IgYSAnX2tvX3Byb3BlcnR5X3dyaXRlcnMnIHByb3BlcnR5IGluIGNhc2UgeW91J3JlIHdyaXRpbmcgdG8gYSBub24tb2JzZXJ2YWJsZVxuICAgICAgICAvLyBrZXk6ICAgICAgICAgICAgICAgICBUaGUga2V5IGlkZW50aWZ5aW5nIHRoZSBwcm9wZXJ0eSB0byBiZSB3cml0dGVuLiBFeGFtcGxlOiBmb3IgeyBoYXNGb2N1czogbXlWYWx1ZSB9LCB3cml0ZSB0byAnbXlWYWx1ZScgYnkgc3BlY2lmeWluZyB0aGUga2V5ICdoYXNGb2N1cydcbiAgICAgICAgLy8gdmFsdWU6ICAgICAgICAgICAgICAgVGhlIHZhbHVlIHRvIGJlIHdyaXR0ZW5cbiAgICAgICAgLy8gY2hlY2tJZkRpZmZlcmVudDogICAgSWYgdHJ1ZSwgYW5kIGlmIHRoZSBwcm9wZXJ0eSBiZWluZyB3cml0dGVuIGlzIGEgd3JpdGFibGUgb2JzZXJ2YWJsZSwgdGhlIHZhbHVlIHdpbGwgb25seSBiZSB3cml0dGVuIGlmXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgIGl0IGlzICE9PSBleGlzdGluZyB2YWx1ZSBvbiB0aGF0IHdyaXRhYmxlIG9ic2VydmFibGVcbiAgICAgICAgd3JpdGVWYWx1ZVRvUHJvcGVydHk6IGZ1bmN0aW9uKHByb3BlcnR5LCBhbGxCaW5kaW5ncywga2V5LCB2YWx1ZSwgY2hlY2tJZkRpZmZlcmVudCkge1xuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0eSB8fCAha28uaXNPYnNlcnZhYmxlKHByb3BlcnR5KSkge1xuICAgICAgICAgICAgICAgIHZhciBwcm9wV3JpdGVycyA9IGFsbEJpbmRpbmdzLmdldCgnX2tvX3Byb3BlcnR5X3dyaXRlcnMnKTtcbiAgICAgICAgICAgICAgICBpZiAocHJvcFdyaXRlcnMgJiYgcHJvcFdyaXRlcnNba2V5XSlcbiAgICAgICAgICAgICAgICAgICAgcHJvcFdyaXRlcnNba2V5XSh2YWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGtvLmlzV3JpdGVhYmxlT2JzZXJ2YWJsZShwcm9wZXJ0eSkgJiYgKCFjaGVja0lmRGlmZmVyZW50IHx8IHByb3BlcnR5LnBlZWsoKSAhPT0gdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydHkodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG5cbmtvLmV4cG9ydFN5bWJvbCgnZXhwcmVzc2lvblJld3JpdGluZycsIGtvLmV4cHJlc3Npb25SZXdyaXRpbmcpO1xua28uZXhwb3J0U3ltYm9sKCdleHByZXNzaW9uUmV3cml0aW5nLmJpbmRpbmdSZXdyaXRlVmFsaWRhdG9ycycsIGtvLmV4cHJlc3Npb25SZXdyaXRpbmcuYmluZGluZ1Jld3JpdGVWYWxpZGF0b3JzKTtcbmtvLmV4cG9ydFN5bWJvbCgnZXhwcmVzc2lvblJld3JpdGluZy5wYXJzZU9iamVjdExpdGVyYWwnLCBrby5leHByZXNzaW9uUmV3cml0aW5nLnBhcnNlT2JqZWN0TGl0ZXJhbCk7XG5rby5leHBvcnRTeW1ib2woJ2V4cHJlc3Npb25SZXdyaXRpbmcucHJlUHJvY2Vzc0JpbmRpbmdzJywga28uZXhwcmVzc2lvblJld3JpdGluZy5wcmVQcm9jZXNzQmluZGluZ3MpO1xuXG4vLyBNYWtpbmcgYmluZGluZ3MgZXhwbGljaXRseSBkZWNsYXJlIHRoZW1zZWx2ZXMgYXMgXCJ0d28gd2F5XCIgaXNuJ3QgaWRlYWwgaW4gdGhlIGxvbmcgdGVybSAoaXQgd291bGQgYmUgYmV0dGVyIGlmXG4vLyBhbGwgYmluZGluZ3MgY291bGQgdXNlIGFuIG9mZmljaWFsICdwcm9wZXJ0eSB3cml0ZXInIEFQSSB3aXRob3V0IG5lZWRpbmcgdG8gZGVjbGFyZSB0aGF0IHRoZXkgbWlnaHQpLiBIb3dldmVyLFxuLy8gc2luY2UgdGhpcyBpcyBub3QsIGFuZCBoYXMgbmV2ZXIgYmVlbiwgYSBwdWJsaWMgQVBJIChfa29fcHJvcGVydHlfd3JpdGVycyB3YXMgbmV2ZXIgZG9jdW1lbnRlZCksIGl0J3MgYWNjZXB0YWJsZVxuLy8gYXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsIGluIHRoZSBzaG9ydCB0ZXJtLlxuLy8gRm9yIHRob3NlIGRldmVsb3BlcnMgd2hvIHJlbHkgb24gX2tvX3Byb3BlcnR5X3dyaXRlcnMgaW4gdGhlaXIgY3VzdG9tIGJpbmRpbmdzLCB3ZSBleHBvc2UgX3R3b1dheUJpbmRpbmdzIGFzIGFuXG4vLyB1bmRvY3VtZW50ZWQgZmVhdHVyZSB0aGF0IG1ha2VzIGl0IHJlbGF0aXZlbHkgZWFzeSB0byB1cGdyYWRlIHRvIEtPIDMuMC4gSG93ZXZlciwgdGhpcyBpcyBzdGlsbCBub3QgYW4gb2ZmaWNpYWxcbi8vIHB1YmxpYyBBUEksIGFuZCB3ZSByZXNlcnZlIHRoZSByaWdodCB0byByZW1vdmUgaXQgYXQgYW55IHRpbWUgaWYgd2UgY3JlYXRlIGEgcmVhbCBwdWJsaWMgcHJvcGVydHkgd3JpdGVycyBBUEkuXG5rby5leHBvcnRTeW1ib2woJ2V4cHJlc3Npb25SZXdyaXRpbmcuX3R3b1dheUJpbmRpbmdzJywga28uZXhwcmVzc2lvblJld3JpdGluZy50d29XYXlCaW5kaW5ncyk7XG5cbi8vIEZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LCBkZWZpbmUgdGhlIGZvbGxvd2luZyBhbGlhc2VzLiAoUHJldmlvdXNseSwgdGhlc2UgZnVuY3Rpb24gbmFtZXMgd2VyZSBtaXNsZWFkaW5nIGJlY2F1c2Vcbi8vIHRoZXkgcmVmZXJyZWQgdG8gSlNPTiBzcGVjaWZpY2FsbHksIGV2ZW4gdGhvdWdoIHRoZXkgYWN0dWFsbHkgd29yayB3aXRoIGFyYml0cmFyeSBKYXZhU2NyaXB0IG9iamVjdCBsaXRlcmFsIGV4cHJlc3Npb25zLilcbmtvLmV4cG9ydFN5bWJvbCgnanNvbkV4cHJlc3Npb25SZXdyaXRpbmcnLCBrby5leHByZXNzaW9uUmV3cml0aW5nKTtcbmtvLmV4cG9ydFN5bWJvbCgnanNvbkV4cHJlc3Npb25SZXdyaXRpbmcuaW5zZXJ0UHJvcGVydHlBY2Nlc3NvcnNJbnRvSnNvbicsIGtvLmV4cHJlc3Npb25SZXdyaXRpbmcucHJlUHJvY2Vzc0JpbmRpbmdzKTtcbihmdW5jdGlvbigpIHtcbiAgICAvLyBcIlZpcnR1YWwgZWxlbWVudHNcIiBpcyBhbiBhYnN0cmFjdGlvbiBvbiB0b3Agb2YgdGhlIHVzdWFsIERPTSBBUEkgd2hpY2ggdW5kZXJzdGFuZHMgdGhlIG5vdGlvbiB0aGF0IGNvbW1lbnQgbm9kZXNcbiAgICAvLyBtYXkgYmUgdXNlZCB0byByZXByZXNlbnQgaGllcmFyY2h5IChpbiBhZGRpdGlvbiB0byB0aGUgRE9NJ3MgbmF0dXJhbCBoaWVyYXJjaHkpLlxuICAgIC8vIElmIHlvdSBjYWxsIHRoZSBET00tbWFuaXB1bGF0aW5nIGZ1bmN0aW9ucyBvbiBrby52aXJ0dWFsRWxlbWVudHMsIHlvdSB3aWxsIGJlIGFibGUgdG8gcmVhZCBhbmQgd3JpdGUgdGhlIHN0YXRlXG4gICAgLy8gb2YgdGhhdCB2aXJ0dWFsIGhpZXJhcmNoeVxuICAgIC8vXG4gICAgLy8gVGhlIHBvaW50IG9mIGFsbCB0aGlzIGlzIHRvIHN1cHBvcnQgY29udGFpbmVybGVzcyB0ZW1wbGF0ZXMgKGUuZy4sIDwhLS0ga28gZm9yZWFjaDpzb21lQ29sbGVjdGlvbiAtLT5ibGFoPCEtLSAva28gLS0+KVxuICAgIC8vIHdpdGhvdXQgaGF2aW5nIHRvIHNjYXR0ZXIgc3BlY2lhbCBjYXNlcyBhbGwgb3ZlciB0aGUgYmluZGluZyBhbmQgdGVtcGxhdGluZyBjb2RlLlxuXG4gICAgLy8gSUUgOSBjYW5ub3QgcmVsaWFibHkgcmVhZCB0aGUgXCJub2RlVmFsdWVcIiBwcm9wZXJ0eSBvZiBhIGNvbW1lbnQgbm9kZSAoc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TdGV2ZVNhbmRlcnNvbi9rbm9ja291dC9pc3N1ZXMvMTg2KVxuICAgIC8vIGJ1dCBpdCBkb2VzIGdpdmUgdGhlbSBhIG5vbnN0YW5kYXJkIGFsdGVybmF0aXZlIHByb3BlcnR5IGNhbGxlZCBcInRleHRcIiB0aGF0IGl0IGNhbiByZWFkIHJlbGlhYmx5LiBPdGhlciBicm93c2VycyBkb24ndCBoYXZlIHRoYXQgcHJvcGVydHkuXG4gICAgLy8gU28sIHVzZSBub2RlLnRleHQgd2hlcmUgYXZhaWxhYmxlLCBhbmQgbm9kZS5ub2RlVmFsdWUgZWxzZXdoZXJlXG4gICAgdmFyIGNvbW1lbnROb2Rlc0hhdmVUZXh0UHJvcGVydHkgPSBkb2N1bWVudCAmJiBkb2N1bWVudC5jcmVhdGVDb21tZW50KFwidGVzdFwiKS50ZXh0ID09PSBcIjwhLS10ZXN0LS0+XCI7XG5cbiAgICB2YXIgc3RhcnRDb21tZW50UmVnZXggPSBjb21tZW50Tm9kZXNIYXZlVGV4dFByb3BlcnR5ID8gL148IS0tXFxzKmtvKD86XFxzKyhbXFxzXFxTXSspKT9cXHMqLS0+JC8gOiAvXlxccyprbyg/OlxccysoW1xcc1xcU10rKSk/XFxzKiQvO1xuICAgIHZhciBlbmRDb21tZW50UmVnZXggPSAgIGNvbW1lbnROb2Rlc0hhdmVUZXh0UHJvcGVydHkgPyAvXjwhLS1cXHMqXFwva29cXHMqLS0+JC8gOiAvXlxccypcXC9rb1xccyokLztcbiAgICB2YXIgaHRtbFRhZ3NXaXRoT3B0aW9uYWxseUNsb3NpbmdDaGlsZHJlbiA9IHsgJ3VsJzogdHJ1ZSwgJ29sJzogdHJ1ZSB9O1xuXG4gICAgZnVuY3Rpb24gaXNTdGFydENvbW1lbnQobm9kZSkge1xuICAgICAgICByZXR1cm4gKG5vZGUubm9kZVR5cGUgPT0gOCkgJiYgc3RhcnRDb21tZW50UmVnZXgudGVzdChjb21tZW50Tm9kZXNIYXZlVGV4dFByb3BlcnR5ID8gbm9kZS50ZXh0IDogbm9kZS5ub2RlVmFsdWUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRW5kQ29tbWVudChub2RlKSB7XG4gICAgICAgIHJldHVybiAobm9kZS5ub2RlVHlwZSA9PSA4KSAmJiBlbmRDb21tZW50UmVnZXgudGVzdChjb21tZW50Tm9kZXNIYXZlVGV4dFByb3BlcnR5ID8gbm9kZS50ZXh0IDogbm9kZS5ub2RlVmFsdWUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFZpcnR1YWxDaGlsZHJlbihzdGFydENvbW1lbnQsIGFsbG93VW5iYWxhbmNlZCkge1xuICAgICAgICB2YXIgY3VycmVudE5vZGUgPSBzdGFydENvbW1lbnQ7XG4gICAgICAgIHZhciBkZXB0aCA9IDE7XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IFtdO1xuICAgICAgICB3aGlsZSAoY3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5uZXh0U2libGluZykge1xuICAgICAgICAgICAgaWYgKGlzRW5kQ29tbWVudChjdXJyZW50Tm9kZSkpIHtcbiAgICAgICAgICAgICAgICBkZXB0aC0tO1xuICAgICAgICAgICAgICAgIGlmIChkZXB0aCA9PT0gMClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkcmVuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKGN1cnJlbnROb2RlKTtcblxuICAgICAgICAgICAgaWYgKGlzU3RhcnRDb21tZW50KGN1cnJlbnROb2RlKSlcbiAgICAgICAgICAgICAgICBkZXB0aCsrO1xuICAgICAgICB9XG4gICAgICAgIGlmICghYWxsb3dVbmJhbGFuY2VkKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgY2xvc2luZyBjb21tZW50IHRhZyB0byBtYXRjaDogXCIgKyBzdGFydENvbW1lbnQubm9kZVZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0TWF0Y2hpbmdFbmRDb21tZW50KHN0YXJ0Q29tbWVudCwgYWxsb3dVbmJhbGFuY2VkKSB7XG4gICAgICAgIHZhciBhbGxWaXJ0dWFsQ2hpbGRyZW4gPSBnZXRWaXJ0dWFsQ2hpbGRyZW4oc3RhcnRDb21tZW50LCBhbGxvd1VuYmFsYW5jZWQpO1xuICAgICAgICBpZiAoYWxsVmlydHVhbENoaWxkcmVuKSB7XG4gICAgICAgICAgICBpZiAoYWxsVmlydHVhbENoaWxkcmVuLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFsbFZpcnR1YWxDaGlsZHJlblthbGxWaXJ0dWFsQ2hpbGRyZW4ubGVuZ3RoIC0gMV0ubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICByZXR1cm4gc3RhcnRDb21tZW50Lm5leHRTaWJsaW5nO1xuICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIHJldHVybiBudWxsOyAvLyBNdXN0IGhhdmUgbm8gbWF0Y2hpbmcgZW5kIGNvbW1lbnQsIGFuZCBhbGxvd1VuYmFsYW5jZWQgaXMgdHJ1ZVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFVuYmFsYW5jZWRDaGlsZFRhZ3Mobm9kZSkge1xuICAgICAgICAvLyBlLmcuLCBmcm9tIDxkaXY+T0s8L2Rpdj48IS0tIGtvIGJsYWggLS0+PHNwYW4+QW5vdGhlcjwvc3Bhbj4sIHJldHVybnM6IDwhLS0ga28gYmxhaCAtLT48c3Bhbj5Bbm90aGVyPC9zcGFuPlxuICAgICAgICAvLyAgICAgICBmcm9tIDxkaXY+T0s8L2Rpdj48IS0tIC9rbyAtLT48IS0tIC9rbyAtLT4sICAgICAgICAgICAgIHJldHVybnM6IDwhLS0gL2tvIC0tPjwhLS0gL2tvIC0tPlxuICAgICAgICB2YXIgY2hpbGROb2RlID0gbm9kZS5maXJzdENoaWxkLCBjYXB0dXJlUmVtYWluaW5nID0gbnVsbDtcbiAgICAgICAgaWYgKGNoaWxkTm9kZSkge1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIGlmIChjYXB0dXJlUmVtYWluaW5nKSAgICAgICAgICAgICAgICAgICAvLyBXZSBhbHJlYWR5IGhpdCBhbiB1bmJhbGFuY2VkIG5vZGUgYW5kIGFyZSBub3cganVzdCBzY29vcGluZyB1cCBhbGwgc3Vic2VxdWVudCBub2Rlc1xuICAgICAgICAgICAgICAgICAgICBjYXB0dXJlUmVtYWluaW5nLnB1c2goY2hpbGROb2RlKTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChpc1N0YXJ0Q29tbWVudChjaGlsZE5vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXRjaGluZ0VuZENvbW1lbnQgPSBnZXRNYXRjaGluZ0VuZENvbW1lbnQoY2hpbGROb2RlLCAvKiBhbGxvd1VuYmFsYW5jZWQ6ICovIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2hpbmdFbmRDb21tZW50KSAgICAgICAgICAgICAvLyBJdCdzIGEgYmFsYW5jZWQgdGFnLCBzbyBza2lwIGltbWVkaWF0ZWx5IHRvIHRoZSBlbmQgb2YgdGhpcyB2aXJ0dWFsIHNldFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGROb2RlID0gbWF0Y2hpbmdFbmRDb21tZW50O1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXB0dXJlUmVtYWluaW5nID0gW2NoaWxkTm9kZV07IC8vIEl0J3MgdW5iYWxhbmNlZCwgc28gc3RhcnQgY2FwdHVyaW5nIGZyb20gdGhpcyBwb2ludFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNFbmRDb21tZW50KGNoaWxkTm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FwdHVyZVJlbWFpbmluZyA9IFtjaGlsZE5vZGVdOyAgICAgLy8gSXQncyB1bmJhbGFuY2VkIChpZiBpdCB3YXNuJ3QsIHdlJ2QgaGF2ZSBza2lwcGVkIG92ZXIgaXQgYWxyZWFkeSksIHNvIHN0YXJ0IGNhcHR1cmluZ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gd2hpbGUgKGNoaWxkTm9kZSA9IGNoaWxkTm9kZS5uZXh0U2libGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNhcHR1cmVSZW1haW5pbmc7XG4gICAgfVxuXG4gICAga28udmlydHVhbEVsZW1lbnRzID0ge1xuICAgICAgICBhbGxvd2VkQmluZGluZ3M6IHt9LFxuXG4gICAgICAgIGNoaWxkTm9kZXM6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBpc1N0YXJ0Q29tbWVudChub2RlKSA/IGdldFZpcnR1YWxDaGlsZHJlbihub2RlKSA6IG5vZGUuY2hpbGROb2RlcztcbiAgICAgICAgfSxcblxuICAgICAgICBlbXB0eU5vZGU6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgIGlmICghaXNTdGFydENvbW1lbnQobm9kZSkpXG4gICAgICAgICAgICAgICAga28udXRpbHMuZW1wdHlEb21Ob2RlKG5vZGUpO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIHZpcnR1YWxDaGlsZHJlbiA9IGtvLnZpcnR1YWxFbGVtZW50cy5jaGlsZE5vZGVzKG5vZGUpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gdmlydHVhbENoaWxkcmVuLmxlbmd0aDsgaSA8IGo7IGkrKylcbiAgICAgICAgICAgICAgICAgICAga28ucmVtb3ZlTm9kZSh2aXJ0dWFsQ2hpbGRyZW5baV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHNldERvbU5vZGVDaGlsZHJlbjogZnVuY3Rpb24obm9kZSwgY2hpbGROb2Rlcykge1xuICAgICAgICAgICAgaWYgKCFpc1N0YXJ0Q29tbWVudChub2RlKSlcbiAgICAgICAgICAgICAgICBrby51dGlscy5zZXREb21Ob2RlQ2hpbGRyZW4obm9kZSwgY2hpbGROb2Rlcyk7XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBrby52aXJ0dWFsRWxlbWVudHMuZW1wdHlOb2RlKG5vZGUpO1xuICAgICAgICAgICAgICAgIHZhciBlbmRDb21tZW50Tm9kZSA9IG5vZGUubmV4dFNpYmxpbmc7IC8vIE11c3QgYmUgdGhlIG5leHQgc2libGluZywgYXMgd2UganVzdCBlbXB0aWVkIHRoZSBjaGlsZHJlblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gY2hpbGROb2Rlcy5sZW5ndGg7IGkgPCBqOyBpKyspXG4gICAgICAgICAgICAgICAgICAgIGVuZENvbW1lbnROb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGNoaWxkTm9kZXNbaV0sIGVuZENvbW1lbnROb2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBwcmVwZW5kOiBmdW5jdGlvbihjb250YWluZXJOb2RlLCBub2RlVG9QcmVwZW5kKSB7XG4gICAgICAgICAgICBpZiAoIWlzU3RhcnRDb21tZW50KGNvbnRhaW5lck5vZGUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbnRhaW5lck5vZGUuZmlyc3RDaGlsZClcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyTm9kZS5pbnNlcnRCZWZvcmUobm9kZVRvUHJlcGVuZCwgY29udGFpbmVyTm9kZS5maXJzdENoaWxkKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lck5vZGUuYXBwZW5kQ2hpbGQobm9kZVRvUHJlcGVuZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFN0YXJ0IGNvbW1lbnRzIG11c3QgYWx3YXlzIGhhdmUgYSBwYXJlbnQgYW5kIGF0IGxlYXN0IG9uZSBmb2xsb3dpbmcgc2libGluZyAodGhlIGVuZCBjb21tZW50KVxuICAgICAgICAgICAgICAgIGNvbnRhaW5lck5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobm9kZVRvUHJlcGVuZCwgY29udGFpbmVyTm9kZS5uZXh0U2libGluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5zZXJ0QWZ0ZXI6IGZ1bmN0aW9uKGNvbnRhaW5lck5vZGUsIG5vZGVUb0luc2VydCwgaW5zZXJ0QWZ0ZXJOb2RlKSB7XG4gICAgICAgICAgICBpZiAoIWluc2VydEFmdGVyTm9kZSkge1xuICAgICAgICAgICAgICAgIGtvLnZpcnR1YWxFbGVtZW50cy5wcmVwZW5kKGNvbnRhaW5lck5vZGUsIG5vZGVUb0luc2VydCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFpc1N0YXJ0Q29tbWVudChjb250YWluZXJOb2RlKSkge1xuICAgICAgICAgICAgICAgIC8vIEluc2VydCBhZnRlciBpbnNlcnRpb24gcG9pbnRcbiAgICAgICAgICAgICAgICBpZiAoaW5zZXJ0QWZ0ZXJOb2RlLm5leHRTaWJsaW5nKVxuICAgICAgICAgICAgICAgICAgICBjb250YWluZXJOb2RlLmluc2VydEJlZm9yZShub2RlVG9JbnNlcnQsIGluc2VydEFmdGVyTm9kZS5uZXh0U2libGluZyk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBjb250YWluZXJOb2RlLmFwcGVuZENoaWxkKG5vZGVUb0luc2VydCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIENoaWxkcmVuIG9mIHN0YXJ0IGNvbW1lbnRzIG11c3QgYWx3YXlzIGhhdmUgYSBwYXJlbnQgYW5kIGF0IGxlYXN0IG9uZSBmb2xsb3dpbmcgc2libGluZyAodGhlIGVuZCBjb21tZW50KVxuICAgICAgICAgICAgICAgIGNvbnRhaW5lck5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobm9kZVRvSW5zZXJ0LCBpbnNlcnRBZnRlck5vZGUubmV4dFNpYmxpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGZpcnN0Q2hpbGQ6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgIGlmICghaXNTdGFydENvbW1lbnQobm9kZSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGUuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgIGlmICghbm9kZS5uZXh0U2libGluZyB8fCBpc0VuZENvbW1lbnQobm9kZS5uZXh0U2libGluZykpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5uZXh0U2libGluZztcbiAgICAgICAgfSxcblxuICAgICAgICBuZXh0U2libGluZzogZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgaWYgKGlzU3RhcnRDb21tZW50KG5vZGUpKVxuICAgICAgICAgICAgICAgIG5vZGUgPSBnZXRNYXRjaGluZ0VuZENvbW1lbnQobm9kZSk7XG4gICAgICAgICAgICBpZiAobm9kZS5uZXh0U2libGluZyAmJiBpc0VuZENvbW1lbnQobm9kZS5uZXh0U2libGluZykpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5uZXh0U2libGluZztcbiAgICAgICAgfSxcblxuICAgICAgICBoYXNCaW5kaW5nVmFsdWU6IGlzU3RhcnRDb21tZW50LFxuXG4gICAgICAgIHZpcnR1YWxOb2RlQmluZGluZ1ZhbHVlOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICB2YXIgcmVnZXhNYXRjaCA9IChjb21tZW50Tm9kZXNIYXZlVGV4dFByb3BlcnR5ID8gbm9kZS50ZXh0IDogbm9kZS5ub2RlVmFsdWUpLm1hdGNoKHN0YXJ0Q29tbWVudFJlZ2V4KTtcbiAgICAgICAgICAgIHJldHVybiByZWdleE1hdGNoID8gcmVnZXhNYXRjaFsxXSA6IG51bGw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbm9ybWFsaXNlVmlydHVhbEVsZW1lbnREb21TdHJ1Y3R1cmU6IGZ1bmN0aW9uKGVsZW1lbnRWZXJpZmllZCkge1xuICAgICAgICAgICAgLy8gV29ya2Fyb3VuZCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL1N0ZXZlU2FuZGVyc29uL2tub2Nrb3V0L2lzc3Vlcy8xNTVcbiAgICAgICAgICAgIC8vIChJRSA8PSA4IG9yIElFIDkgcXVpcmtzIG1vZGUgcGFyc2VzIHlvdXIgSFRNTCB3ZWlyZGx5LCB0cmVhdGluZyBjbG9zaW5nIDwvbGk+IHRhZ3MgYXMgaWYgdGhleSBkb24ndCBleGlzdCwgdGhlcmVieSBtb3ZpbmcgY29tbWVudCBub2Rlc1xuICAgICAgICAgICAgLy8gdGhhdCBhcmUgZGlyZWN0IGRlc2NlbmRhbnRzIG9mIDx1bD4gaW50byB0aGUgcHJlY2VkaW5nIDxsaT4pXG4gICAgICAgICAgICBpZiAoIWh0bWxUYWdzV2l0aE9wdGlvbmFsbHlDbG9zaW5nQ2hpbGRyZW5ba28udXRpbHMudGFnTmFtZUxvd2VyKGVsZW1lbnRWZXJpZmllZCldKVxuICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgLy8gU2NhbiBpbW1lZGlhdGUgY2hpbGRyZW4gdG8gc2VlIGlmIHRoZXkgY29udGFpbiB1bmJhbGFuY2VkIGNvbW1lbnQgdGFncy4gSWYgdGhleSBkbywgdGhvc2UgY29tbWVudCB0YWdzXG4gICAgICAgICAgICAvLyBtdXN0IGJlIGludGVuZGVkIHRvIGFwcGVhciAqYWZ0ZXIqIHRoYXQgY2hpbGQsIHNvIG1vdmUgdGhlbSB0aGVyZS5cbiAgICAgICAgICAgIHZhciBjaGlsZE5vZGUgPSBlbGVtZW50VmVyaWZpZWQuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgIGlmIChjaGlsZE5vZGUpIHtcbiAgICAgICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZE5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1bmJhbGFuY2VkVGFncyA9IGdldFVuYmFsYW5jZWRDaGlsZFRhZ3MoY2hpbGROb2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1bmJhbGFuY2VkVGFncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZpeCB1cCB0aGUgRE9NIGJ5IG1vdmluZyB0aGUgdW5iYWxhbmNlZCB0YWdzIHRvIHdoZXJlIHRoZXkgbW9zdCBsaWtlbHkgd2VyZSBpbnRlbmRlZCB0byBiZSBwbGFjZWQgLSAqYWZ0ZXIqIHRoZSBjaGlsZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBub2RlVG9JbnNlcnRCZWZvcmUgPSBjaGlsZE5vZGUubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB1bmJhbGFuY2VkVGFncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZVRvSW5zZXJ0QmVmb3JlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudFZlcmlmaWVkLmluc2VydEJlZm9yZSh1bmJhbGFuY2VkVGFnc1tpXSwgbm9kZVRvSW5zZXJ0QmVmb3JlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudFZlcmlmaWVkLmFwcGVuZENoaWxkKHVuYmFsYW5jZWRUYWdzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IHdoaWxlIChjaGlsZE5vZGUgPSBjaGlsZE5vZGUubmV4dFNpYmxpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG5rby5leHBvcnRTeW1ib2woJ3ZpcnR1YWxFbGVtZW50cycsIGtvLnZpcnR1YWxFbGVtZW50cyk7XG5rby5leHBvcnRTeW1ib2woJ3ZpcnR1YWxFbGVtZW50cy5hbGxvd2VkQmluZGluZ3MnLCBrby52aXJ0dWFsRWxlbWVudHMuYWxsb3dlZEJpbmRpbmdzKTtcbmtvLmV4cG9ydFN5bWJvbCgndmlydHVhbEVsZW1lbnRzLmVtcHR5Tm9kZScsIGtvLnZpcnR1YWxFbGVtZW50cy5lbXB0eU5vZGUpO1xuLy9rby5leHBvcnRTeW1ib2woJ3ZpcnR1YWxFbGVtZW50cy5maXJzdENoaWxkJywga28udmlydHVhbEVsZW1lbnRzLmZpcnN0Q2hpbGQpOyAgICAgLy8gZmlyc3RDaGlsZCBpcyBub3QgbWluaWZpZWRcbmtvLmV4cG9ydFN5bWJvbCgndmlydHVhbEVsZW1lbnRzLmluc2VydEFmdGVyJywga28udmlydHVhbEVsZW1lbnRzLmluc2VydEFmdGVyKTtcbi8va28uZXhwb3J0U3ltYm9sKCd2aXJ0dWFsRWxlbWVudHMubmV4dFNpYmxpbmcnLCBrby52aXJ0dWFsRWxlbWVudHMubmV4dFNpYmxpbmcpOyAgIC8vIG5leHRTaWJsaW5nIGlzIG5vdCBtaW5pZmllZFxua28uZXhwb3J0U3ltYm9sKCd2aXJ0dWFsRWxlbWVudHMucHJlcGVuZCcsIGtvLnZpcnR1YWxFbGVtZW50cy5wcmVwZW5kKTtcbmtvLmV4cG9ydFN5bWJvbCgndmlydHVhbEVsZW1lbnRzLnNldERvbU5vZGVDaGlsZHJlbicsIGtvLnZpcnR1YWxFbGVtZW50cy5zZXREb21Ob2RlQ2hpbGRyZW4pO1xuKGZ1bmN0aW9uKCkge1xuICAgIHZhciBkZWZhdWx0QmluZGluZ0F0dHJpYnV0ZU5hbWUgPSBcImRhdGEtYmluZFwiO1xuXG4gICAga28uYmluZGluZ1Byb3ZpZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuYmluZGluZ0NhY2hlID0ge307XG4gICAgfTtcblxuICAgIGtvLnV0aWxzLmV4dGVuZChrby5iaW5kaW5nUHJvdmlkZXIucHJvdG90eXBlLCB7XG4gICAgICAgICdub2RlSGFzQmluZGluZ3MnOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKG5vZGUubm9kZVR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDE6IC8vIEVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vZGUuZ2V0QXR0cmlidXRlKGRlZmF1bHRCaW5kaW5nQXR0cmlidXRlTmFtZSkgIT0gbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgfHwga28uY29tcG9uZW50c1snZ2V0Q29tcG9uZW50TmFtZUZvck5vZGUnXShub2RlKTtcbiAgICAgICAgICAgICAgICBjYXNlIDg6IC8vIENvbW1lbnQgbm9kZVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga28udmlydHVhbEVsZW1lbnRzLmhhc0JpbmRpbmdWYWx1ZShub2RlKTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgJ2dldEJpbmRpbmdzJzogZnVuY3Rpb24obm9kZSwgYmluZGluZ0NvbnRleHQpIHtcbiAgICAgICAgICAgIHZhciBiaW5kaW5nc1N0cmluZyA9IHRoaXNbJ2dldEJpbmRpbmdzU3RyaW5nJ10obm9kZSwgYmluZGluZ0NvbnRleHQpLFxuICAgICAgICAgICAgICAgIHBhcnNlZEJpbmRpbmdzID0gYmluZGluZ3NTdHJpbmcgPyB0aGlzWydwYXJzZUJpbmRpbmdzU3RyaW5nJ10oYmluZGluZ3NTdHJpbmcsIGJpbmRpbmdDb250ZXh0LCBub2RlKSA6IG51bGw7XG4gICAgICAgICAgICByZXR1cm4ga28uY29tcG9uZW50cy5hZGRCaW5kaW5nc0ZvckN1c3RvbUVsZW1lbnQocGFyc2VkQmluZGluZ3MsIG5vZGUsIGJpbmRpbmdDb250ZXh0LCAvKiB2YWx1ZUFjY2Vzc29ycyAqLyBmYWxzZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJ2dldEJpbmRpbmdBY2Nlc3NvcnMnOiBmdW5jdGlvbihub2RlLCBiaW5kaW5nQ29udGV4dCkge1xuICAgICAgICAgICAgdmFyIGJpbmRpbmdzU3RyaW5nID0gdGhpc1snZ2V0QmluZGluZ3NTdHJpbmcnXShub2RlLCBiaW5kaW5nQ29udGV4dCksXG4gICAgICAgICAgICAgICAgcGFyc2VkQmluZGluZ3MgPSBiaW5kaW5nc1N0cmluZyA/IHRoaXNbJ3BhcnNlQmluZGluZ3NTdHJpbmcnXShiaW5kaW5nc1N0cmluZywgYmluZGluZ0NvbnRleHQsIG5vZGUsIHsgJ3ZhbHVlQWNjZXNzb3JzJzogdHJ1ZSB9KSA6IG51bGw7XG4gICAgICAgICAgICByZXR1cm4ga28uY29tcG9uZW50cy5hZGRCaW5kaW5nc0ZvckN1c3RvbUVsZW1lbnQocGFyc2VkQmluZGluZ3MsIG5vZGUsIGJpbmRpbmdDb250ZXh0LCAvKiB2YWx1ZUFjY2Vzc29ycyAqLyB0cnVlKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGZ1bmN0aW9uIGlzIG9ubHkgdXNlZCBpbnRlcm5hbGx5IGJ5IHRoaXMgZGVmYXVsdCBwcm92aWRlci5cbiAgICAgICAgLy8gSXQncyBub3QgcGFydCBvZiB0aGUgaW50ZXJmYWNlIGRlZmluaXRpb24gZm9yIGEgZ2VuZXJhbCBiaW5kaW5nIHByb3ZpZGVyLlxuICAgICAgICAnZ2V0QmluZGluZ3NTdHJpbmcnOiBmdW5jdGlvbihub2RlLCBiaW5kaW5nQ29udGV4dCkge1xuICAgICAgICAgICAgc3dpdGNoIChub2RlLm5vZGVUeXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gbm9kZS5nZXRBdHRyaWJ1dGUoZGVmYXVsdEJpbmRpbmdBdHRyaWJ1dGVOYW1lKTsgICAvLyBFbGVtZW50XG4gICAgICAgICAgICAgICAgY2FzZSA4OiByZXR1cm4ga28udmlydHVhbEVsZW1lbnRzLnZpcnR1YWxOb2RlQmluZGluZ1ZhbHVlKG5vZGUpOyAvLyBDb21tZW50IG5vZGVcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGZ1bmN0aW9uIGlzIG9ubHkgdXNlZCBpbnRlcm5hbGx5IGJ5IHRoaXMgZGVmYXVsdCBwcm92aWRlci5cbiAgICAgICAgLy8gSXQncyBub3QgcGFydCBvZiB0aGUgaW50ZXJmYWNlIGRlZmluaXRpb24gZm9yIGEgZ2VuZXJhbCBiaW5kaW5nIHByb3ZpZGVyLlxuICAgICAgICAncGFyc2VCaW5kaW5nc1N0cmluZyc6IGZ1bmN0aW9uKGJpbmRpbmdzU3RyaW5nLCBiaW5kaW5nQ29udGV4dCwgbm9kZSwgb3B0aW9ucykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB2YXIgYmluZGluZ0Z1bmN0aW9uID0gY3JlYXRlQmluZGluZ3NTdHJpbmdFdmFsdWF0b3JWaWFDYWNoZShiaW5kaW5nc1N0cmluZywgdGhpcy5iaW5kaW5nQ2FjaGUsIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBiaW5kaW5nRnVuY3Rpb24oYmluZGluZ0NvbnRleHQsIG5vZGUpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgICAgICBleC5tZXNzYWdlID0gXCJVbmFibGUgdG8gcGFyc2UgYmluZGluZ3MuXFxuQmluZGluZ3MgdmFsdWU6IFwiICsgYmluZGluZ3NTdHJpbmcgKyBcIlxcbk1lc3NhZ2U6IFwiICsgZXgubWVzc2FnZTtcbiAgICAgICAgICAgICAgICB0aHJvdyBleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAga28uYmluZGluZ1Byb3ZpZGVyWydpbnN0YW5jZSddID0gbmV3IGtvLmJpbmRpbmdQcm92aWRlcigpO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlQmluZGluZ3NTdHJpbmdFdmFsdWF0b3JWaWFDYWNoZShiaW5kaW5nc1N0cmluZywgY2FjaGUsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGNhY2hlS2V5ID0gYmluZGluZ3NTdHJpbmcgKyAob3B0aW9ucyAmJiBvcHRpb25zWyd2YWx1ZUFjY2Vzc29ycyddIHx8ICcnKTtcbiAgICAgICAgcmV0dXJuIGNhY2hlW2NhY2hlS2V5XVxuICAgICAgICAgICAgfHwgKGNhY2hlW2NhY2hlS2V5XSA9IGNyZWF0ZUJpbmRpbmdzU3RyaW5nRXZhbHVhdG9yKGJpbmRpbmdzU3RyaW5nLCBvcHRpb25zKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlQmluZGluZ3NTdHJpbmdFdmFsdWF0b3IoYmluZGluZ3NTdHJpbmcsIG9wdGlvbnMpIHtcbiAgICAgICAgLy8gQnVpbGQgdGhlIHNvdXJjZSBmb3IgYSBmdW5jdGlvbiB0aGF0IGV2YWx1YXRlcyBcImV4cHJlc3Npb25cIlxuICAgICAgICAvLyBGb3IgZWFjaCBzY29wZSB2YXJpYWJsZSwgYWRkIGFuIGV4dHJhIGxldmVsIG9mIFwid2l0aFwiIG5lc3RpbmdcbiAgICAgICAgLy8gRXhhbXBsZSByZXN1bHQ6IHdpdGgoc2MxKSB7IHdpdGgoc2MwKSB7IHJldHVybiAoZXhwcmVzc2lvbikgfSB9XG4gICAgICAgIHZhciByZXdyaXR0ZW5CaW5kaW5ncyA9IGtvLmV4cHJlc3Npb25SZXdyaXRpbmcucHJlUHJvY2Vzc0JpbmRpbmdzKGJpbmRpbmdzU3RyaW5nLCBvcHRpb25zKSxcbiAgICAgICAgICAgIGZ1bmN0aW9uQm9keSA9IFwid2l0aCgkY29udGV4dCl7d2l0aCgkZGF0YXx8e30pe3JldHVybntcIiArIHJld3JpdHRlbkJpbmRpbmdzICsgXCJ9fX1cIjtcbiAgICAgICAgcmV0dXJuIG5ldyBGdW5jdGlvbihcIiRjb250ZXh0XCIsIFwiJGVsZW1lbnRcIiwgZnVuY3Rpb25Cb2R5KTtcbiAgICB9XG59KSgpO1xuXG5rby5leHBvcnRTeW1ib2woJ2JpbmRpbmdQcm92aWRlcicsIGtvLmJpbmRpbmdQcm92aWRlcik7XG4oZnVuY3Rpb24gKCkge1xuICAgIGtvLmJpbmRpbmdIYW5kbGVycyA9IHt9O1xuXG4gICAgLy8gVGhlIGZvbGxvd2luZyBlbGVtZW50IHR5cGVzIHdpbGwgbm90IGJlIHJlY3Vyc2VkIGludG8gZHVyaW5nIGJpbmRpbmcuIEluIHRoZSBmdXR1cmUsIHdlXG4gICAgLy8gbWF5IGNvbnNpZGVyIGFkZGluZyA8dGVtcGxhdGU+IHRvIHRoaXMgbGlzdCwgYmVjYXVzZSBzdWNoIGVsZW1lbnRzJyBjb250ZW50cyBhcmUgYWx3YXlzXG4gICAgLy8gaW50ZW5kZWQgdG8gYmUgYm91bmQgaW4gYSBkaWZmZXJlbnQgY29udGV4dCBmcm9tIHdoZXJlIHRoZXkgYXBwZWFyIGluIHRoZSBkb2N1bWVudC5cbiAgICB2YXIgYmluZGluZ0RvZXNOb3RSZWN1cnNlSW50b0VsZW1lbnRUeXBlcyA9IHtcbiAgICAgICAgLy8gRG9uJ3Qgd2FudCBiaW5kaW5ncyB0aGF0IG9wZXJhdGUgb24gdGV4dCBub2RlcyB0byBtdXRhdGUgPHNjcmlwdD4gY29udGVudHMsXG4gICAgICAgIC8vIGJlY2F1c2UgaXQncyB1bmV4cGVjdGVkIGFuZCBhIHBvdGVudGlhbCBYU1MgaXNzdWVcbiAgICAgICAgJ3NjcmlwdCc6IHRydWVcbiAgICB9O1xuXG4gICAgLy8gVXNlIGFuIG92ZXJyaWRhYmxlIG1ldGhvZCBmb3IgcmV0cmlldmluZyBiaW5kaW5nIGhhbmRsZXJzIHNvIHRoYXQgYSBwbHVnaW5zIG1heSBzdXBwb3J0IGR5bmFtaWNhbGx5IGNyZWF0ZWQgaGFuZGxlcnNcbiAgICBrb1snZ2V0QmluZGluZ0hhbmRsZXInXSA9IGZ1bmN0aW9uKGJpbmRpbmdLZXkpIHtcbiAgICAgICAgcmV0dXJuIGtvLmJpbmRpbmdIYW5kbGVyc1tiaW5kaW5nS2V5XTtcbiAgICB9O1xuXG4gICAgLy8gVGhlIGtvLmJpbmRpbmdDb250ZXh0IGNvbnN0cnVjdG9yIGlzIG9ubHkgY2FsbGVkIGRpcmVjdGx5IHRvIGNyZWF0ZSB0aGUgcm9vdCBjb250ZXh0LiBGb3IgY2hpbGRcbiAgICAvLyBjb250ZXh0cywgdXNlIGJpbmRpbmdDb250ZXh0LmNyZWF0ZUNoaWxkQ29udGV4dCBvciBiaW5kaW5nQ29udGV4dC5leHRlbmQuXG4gICAga28uYmluZGluZ0NvbnRleHQgPSBmdW5jdGlvbihkYXRhSXRlbU9yQWNjZXNzb3IsIHBhcmVudENvbnRleHQsIGRhdGFJdGVtQWxpYXMsIGV4dGVuZENhbGxiYWNrKSB7XG5cbiAgICAgICAgLy8gVGhlIGJpbmRpbmcgY29udGV4dCBvYmplY3QgaW5jbHVkZXMgc3RhdGljIHByb3BlcnRpZXMgZm9yIHRoZSBjdXJyZW50LCBwYXJlbnQsIGFuZCByb290IHZpZXcgbW9kZWxzLlxuICAgICAgICAvLyBJZiBhIHZpZXcgbW9kZWwgaXMgYWN0dWFsbHkgc3RvcmVkIGluIGFuIG9ic2VydmFibGUsIHRoZSBjb3JyZXNwb25kaW5nIGJpbmRpbmcgY29udGV4dCBvYmplY3QsIGFuZFxuICAgICAgICAvLyBhbnkgY2hpbGQgY29udGV4dHMsIG11c3QgYmUgdXBkYXRlZCB3aGVuIHRoZSB2aWV3IG1vZGVsIGlzIGNoYW5nZWQuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZUNvbnRleHQoKSB7XG4gICAgICAgICAgICAvLyBNb3N0IG9mIHRoZSB0aW1lLCB0aGUgY29udGV4dCB3aWxsIGRpcmVjdGx5IGdldCBhIHZpZXcgbW9kZWwgb2JqZWN0LCBidXQgaWYgYSBmdW5jdGlvbiBpcyBnaXZlbixcbiAgICAgICAgICAgIC8vIHdlIGNhbGwgdGhlIGZ1bmN0aW9uIHRvIHJldHJpZXZlIHRoZSB2aWV3IG1vZGVsLiBJZiB0aGUgZnVuY3Rpb24gYWNjZXNzZXMgYW55IG9ic2V2YWJsZXMgb3IgcmV0dXJuc1xuICAgICAgICAgICAgLy8gYW4gb2JzZXJ2YWJsZSwgdGhlIGRlcGVuZGVuY3kgaXMgdHJhY2tlZCwgYW5kIHRob3NlIG9ic2VydmFibGVzIGNhbiBsYXRlciBjYXVzZSB0aGUgYmluZGluZ1xuICAgICAgICAgICAgLy8gY29udGV4dCB0byBiZSB1cGRhdGVkLlxuICAgICAgICAgICAgdmFyIGRhdGFJdGVtT3JPYnNlcnZhYmxlID0gaXNGdW5jID8gZGF0YUl0ZW1PckFjY2Vzc29yKCkgOiBkYXRhSXRlbU9yQWNjZXNzb3IsXG4gICAgICAgICAgICAgICAgZGF0YUl0ZW0gPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKGRhdGFJdGVtT3JPYnNlcnZhYmxlKTtcblxuICAgICAgICAgICAgaWYgKHBhcmVudENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICAvLyBXaGVuIGEgXCJwYXJlbnRcIiBjb250ZXh0IGlzIGdpdmVuLCByZWdpc3RlciBhIGRlcGVuZGVuY3kgb24gdGhlIHBhcmVudCBjb250ZXh0LiBUaHVzIHdoZW5ldmVyIHRoZVxuICAgICAgICAgICAgICAgIC8vIHBhcmVudCBjb250ZXh0IGlzIHVwZGF0ZWQsIHRoaXMgY29udGV4dCB3aWxsIGFsc28gYmUgdXBkYXRlZC5cbiAgICAgICAgICAgICAgICBpZiAocGFyZW50Q29udGV4dC5fc3Vic2NyaWJhYmxlKVxuICAgICAgICAgICAgICAgICAgICBwYXJlbnRDb250ZXh0Ll9zdWJzY3JpYmFibGUoKTtcblxuICAgICAgICAgICAgICAgIC8vIENvcHkgJHJvb3QgYW5kIGFueSBjdXN0b20gcHJvcGVydGllcyBmcm9tIHRoZSBwYXJlbnQgY29udGV4dFxuICAgICAgICAgICAgICAgIGtvLnV0aWxzLmV4dGVuZChzZWxmLCBwYXJlbnRDb250ZXh0KTtcblxuICAgICAgICAgICAgICAgIC8vIEJlY2F1c2UgdGhlIGFib3ZlIGNvcHkgb3ZlcndyaXRlcyBvdXIgb3duIHByb3BlcnRpZXMsIHdlIG5lZWQgdG8gcmVzZXQgdGhlbS5cbiAgICAgICAgICAgICAgICAvLyBEdXJpbmcgdGhlIGZpcnN0IGV4ZWN1dGlvbiwgXCJzdWJzY3JpYmFibGVcIiBpc24ndCBzZXQsIHNvIGRvbid0IGJvdGhlciBkb2luZyB0aGUgdXBkYXRlIHRoZW4uXG4gICAgICAgICAgICAgICAgaWYgKHN1YnNjcmliYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9zdWJzY3JpYmFibGUgPSBzdWJzY3JpYmFibGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmWyckcGFyZW50cyddID0gW107XG4gICAgICAgICAgICAgICAgc2VsZlsnJHJvb3QnXSA9IGRhdGFJdGVtO1xuXG4gICAgICAgICAgICAgICAgLy8gRXhwb3J0ICdrbycgaW4gdGhlIGJpbmRpbmcgY29udGV4dCBzbyBpdCB3aWxsIGJlIGF2YWlsYWJsZSBpbiBiaW5kaW5ncyBhbmQgdGVtcGxhdGVzXG4gICAgICAgICAgICAgICAgLy8gZXZlbiBpZiAna28nIGlzbid0IGV4cG9ydGVkIGFzIGEgZ2xvYmFsLCBzdWNoIGFzIHdoZW4gdXNpbmcgYW4gQU1EIGxvYWRlci5cbiAgICAgICAgICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL1N0ZXZlU2FuZGVyc29uL2tub2Nrb3V0L2lzc3Vlcy80OTBcbiAgICAgICAgICAgICAgICBzZWxmWydrbyddID0ga287XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmWyckcmF3RGF0YSddID0gZGF0YUl0ZW1Pck9ic2VydmFibGU7XG4gICAgICAgICAgICBzZWxmWyckZGF0YSddID0gZGF0YUl0ZW07XG4gICAgICAgICAgICBpZiAoZGF0YUl0ZW1BbGlhcylcbiAgICAgICAgICAgICAgICBzZWxmW2RhdGFJdGVtQWxpYXNdID0gZGF0YUl0ZW07XG5cbiAgICAgICAgICAgIC8vIFRoZSBleHRlbmRDYWxsYmFjayBmdW5jdGlvbiBpcyBwcm92aWRlZCB3aGVuIGNyZWF0aW5nIGEgY2hpbGQgY29udGV4dCBvciBleHRlbmRpbmcgYSBjb250ZXh0LlxuICAgICAgICAgICAgLy8gSXQgaGFuZGxlcyB0aGUgc3BlY2lmaWMgYWN0aW9ucyBuZWVkZWQgdG8gZmluaXNoIHNldHRpbmcgdXAgdGhlIGJpbmRpbmcgY29udGV4dC4gQWN0aW9ucyBpbiB0aGlzXG4gICAgICAgICAgICAvLyBmdW5jdGlvbiBjb3VsZCBhbHNvIGFkZCBkZXBlbmRlbmNpZXMgdG8gdGhpcyBiaW5kaW5nIGNvbnRleHQuXG4gICAgICAgICAgICBpZiAoZXh0ZW5kQ2FsbGJhY2spXG4gICAgICAgICAgICAgICAgZXh0ZW5kQ2FsbGJhY2soc2VsZiwgcGFyZW50Q29udGV4dCwgZGF0YUl0ZW0pO1xuXG4gICAgICAgICAgICByZXR1cm4gc2VsZlsnJGRhdGEnXTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBkaXNwb3NlV2hlbigpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlcyAmJiAha28udXRpbHMuYW55RG9tTm9kZUlzQXR0YWNoZWRUb0RvY3VtZW50KG5vZGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIGlzRnVuYyA9IHR5cGVvZihkYXRhSXRlbU9yQWNjZXNzb3IpID09IFwiZnVuY3Rpb25cIiAmJiAha28uaXNPYnNlcnZhYmxlKGRhdGFJdGVtT3JBY2Nlc3NvciksXG4gICAgICAgICAgICBub2RlcyxcbiAgICAgICAgICAgIHN1YnNjcmliYWJsZSA9IGtvLmRlcGVuZGVudE9ic2VydmFibGUodXBkYXRlQ29udGV4dCwgbnVsbCwgeyBkaXNwb3NlV2hlbjogZGlzcG9zZVdoZW4sIGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZDogdHJ1ZSB9KTtcblxuICAgICAgICAvLyBBdCB0aGlzIHBvaW50LCB0aGUgYmluZGluZyBjb250ZXh0IGhhcyBiZWVuIGluaXRpYWxpemVkLCBhbmQgdGhlIFwic3Vic2NyaWJhYmxlXCIgY29tcHV0ZWQgb2JzZXJ2YWJsZSBpc1xuICAgICAgICAvLyBzdWJzY3JpYmVkIHRvIGFueSBvYnNlcnZhYmxlcyB0aGF0IHdlcmUgYWNjZXNzZWQgaW4gdGhlIHByb2Nlc3MuIElmIHRoZXJlIGlzIG5vdGhpbmcgdG8gdHJhY2ssIHRoZVxuICAgICAgICAvLyBjb21wdXRlZCB3aWxsIGJlIGluYWN0aXZlLCBhbmQgd2UgY2FuIHNhZmVseSB0aHJvdyBpdCBhd2F5LiBJZiBpdCdzIGFjdGl2ZSwgdGhlIGNvbXB1dGVkIGlzIHN0b3JlZCBpblxuICAgICAgICAvLyB0aGUgY29udGV4dCBvYmplY3QuXG4gICAgICAgIGlmIChzdWJzY3JpYmFibGUuaXNBY3RpdmUoKSkge1xuICAgICAgICAgICAgc2VsZi5fc3Vic2NyaWJhYmxlID0gc3Vic2NyaWJhYmxlO1xuXG4gICAgICAgICAgICAvLyBBbHdheXMgbm90aWZ5IGJlY2F1c2UgZXZlbiBpZiB0aGUgbW9kZWwgKCRkYXRhKSBoYXNuJ3QgY2hhbmdlZCwgb3RoZXIgY29udGV4dCBwcm9wZXJ0aWVzIG1pZ2h0IGhhdmUgY2hhbmdlZFxuICAgICAgICAgICAgc3Vic2NyaWJhYmxlWydlcXVhbGl0eUNvbXBhcmVyJ10gPSBudWxsO1xuXG4gICAgICAgICAgICAvLyBXZSBuZWVkIHRvIGJlIGFibGUgdG8gZGlzcG9zZSBvZiB0aGlzIGNvbXB1dGVkIG9ic2VydmFibGUgd2hlbiBpdCdzIG5vIGxvbmdlciBuZWVkZWQuIFRoaXMgd291bGQgYmVcbiAgICAgICAgICAgIC8vIGVhc3kgaWYgd2UgaGFkIGEgc2luZ2xlIG5vZGUgdG8gd2F0Y2gsIGJ1dCBiaW5kaW5nIGNvbnRleHRzIGNhbiBiZSB1c2VkIGJ5IG1hbnkgZGlmZmVyZW50IG5vZGVzLCBhbmRcbiAgICAgICAgICAgIC8vIHdlIGNhbm5vdCBhc3N1bWUgdGhhdCB0aG9zZSBub2RlcyBoYXZlIGFueSByZWxhdGlvbiB0byBlYWNoIG90aGVyLiBTbyBpbnN0ZWFkIHdlIHRyYWNrIGFueSBub2RlIHRoYXRcbiAgICAgICAgICAgIC8vIHRoZSBjb250ZXh0IGlzIGF0dGFjaGVkIHRvLCBhbmQgZGlzcG9zZSB0aGUgY29tcHV0ZWQgd2hlbiBhbGwgb2YgdGhvc2Ugbm9kZXMgaGF2ZSBiZWVuIGNsZWFuZWQuXG5cbiAgICAgICAgICAgIC8vIEFkZCBwcm9wZXJ0aWVzIHRvICpzdWJzY3JpYmFibGUqIGluc3RlYWQgb2YgKnNlbGYqIGJlY2F1c2UgYW55IHByb3BlcnRpZXMgYWRkZWQgdG8gKnNlbGYqIG1heSBiZSBvdmVyd3JpdHRlbiBvbiB1cGRhdGVzXG4gICAgICAgICAgICBub2RlcyA9IFtdO1xuICAgICAgICAgICAgc3Vic2NyaWJhYmxlLl9hZGROb2RlID0gZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgICAgIG5vZGVzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICAgICAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhub2RlLCBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGtvLnV0aWxzLmFycmF5UmVtb3ZlSXRlbShub2Rlcywgbm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghbm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmFibGUuZGlzcG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5fc3Vic2NyaWJhYmxlID0gc3Vic2NyaWJhYmxlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gRXh0ZW5kIHRoZSBiaW5kaW5nIGNvbnRleHQgaGllcmFyY2h5IHdpdGggYSBuZXcgdmlldyBtb2RlbCBvYmplY3QuIElmIHRoZSBwYXJlbnQgY29udGV4dCBpcyB3YXRjaGluZ1xuICAgIC8vIGFueSBvYnNldmFibGVzLCB0aGUgbmV3IGNoaWxkIGNvbnRleHQgd2lsbCBhdXRvbWF0aWNhbGx5IGdldCBhIGRlcGVuZGVuY3kgb24gdGhlIHBhcmVudCBjb250ZXh0LlxuICAgIC8vIEJ1dCB0aGlzIGRvZXMgbm90IG1lYW4gdGhhdCB0aGUgJGRhdGEgdmFsdWUgb2YgdGhlIGNoaWxkIGNvbnRleHQgd2lsbCBhbHNvIGdldCB1cGRhdGVkLiBJZiB0aGUgY2hpbGRcbiAgICAvLyB2aWV3IG1vZGVsIGFsc28gZGVwZW5kcyBvbiB0aGUgcGFyZW50IHZpZXcgbW9kZWwsIHlvdSBtdXN0IHByb3ZpZGUgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGNvcnJlY3RcbiAgICAvLyB2aWV3IG1vZGVsIG9uIGVhY2ggdXBkYXRlLlxuICAgIGtvLmJpbmRpbmdDb250ZXh0LnByb3RvdHlwZVsnY3JlYXRlQ2hpbGRDb250ZXh0J10gPSBmdW5jdGlvbiAoZGF0YUl0ZW1PckFjY2Vzc29yLCBkYXRhSXRlbUFsaWFzLCBleHRlbmRDYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gbmV3IGtvLmJpbmRpbmdDb250ZXh0KGRhdGFJdGVtT3JBY2Nlc3NvciwgdGhpcywgZGF0YUl0ZW1BbGlhcywgZnVuY3Rpb24oc2VsZiwgcGFyZW50Q29udGV4dCkge1xuICAgICAgICAgICAgLy8gRXh0ZW5kIHRoZSBjb250ZXh0IGhpZXJhcmNoeSBieSBzZXR0aW5nIHRoZSBhcHByb3ByaWF0ZSBwb2ludGVyc1xuICAgICAgICAgICAgc2VsZlsnJHBhcmVudENvbnRleHQnXSA9IHBhcmVudENvbnRleHQ7XG4gICAgICAgICAgICBzZWxmWyckcGFyZW50J10gPSBwYXJlbnRDb250ZXh0WyckZGF0YSddO1xuICAgICAgICAgICAgc2VsZlsnJHBhcmVudHMnXSA9IChwYXJlbnRDb250ZXh0WyckcGFyZW50cyddIHx8IFtdKS5zbGljZSgwKTtcbiAgICAgICAgICAgIHNlbGZbJyRwYXJlbnRzJ10udW5zaGlmdChzZWxmWyckcGFyZW50J10pO1xuICAgICAgICAgICAgaWYgKGV4dGVuZENhbGxiYWNrKVxuICAgICAgICAgICAgICAgIGV4dGVuZENhbGxiYWNrKHNlbGYpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gRXh0ZW5kIHRoZSBiaW5kaW5nIGNvbnRleHQgd2l0aCBuZXcgY3VzdG9tIHByb3BlcnRpZXMuIFRoaXMgZG9lc24ndCBjaGFuZ2UgdGhlIGNvbnRleHQgaGllcmFyY2h5LlxuICAgIC8vIFNpbWlsYXJseSB0byBcImNoaWxkXCIgY29udGV4dHMsIHByb3ZpZGUgYSBmdW5jdGlvbiBoZXJlIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSBjb3JyZWN0IHZhbHVlcyBhcmUgc2V0XG4gICAgLy8gd2hlbiBhbiBvYnNlcnZhYmxlIHZpZXcgbW9kZWwgaXMgdXBkYXRlZC5cbiAgICBrby5iaW5kaW5nQ29udGV4dC5wcm90b3R5cGVbJ2V4dGVuZCddID0gZnVuY3Rpb24ocHJvcGVydGllcykge1xuICAgICAgICAvLyBJZiB0aGUgcGFyZW50IGNvbnRleHQgcmVmZXJlbmNlcyBhbiBvYnNlcnZhYmxlIHZpZXcgbW9kZWwsIFwiX3N1YnNjcmliYWJsZVwiIHdpbGwgYWx3YXlzIGJlIHRoZVxuICAgICAgICAvLyBsYXRlc3QgdmlldyBtb2RlbCBvYmplY3QuIElmIG5vdCwgXCJfc3Vic2NyaWJhYmxlXCIgaXNuJ3Qgc2V0LCBhbmQgd2UgY2FuIHVzZSB0aGUgc3RhdGljIFwiJGRhdGFcIiB2YWx1ZS5cbiAgICAgICAgcmV0dXJuIG5ldyBrby5iaW5kaW5nQ29udGV4dCh0aGlzLl9zdWJzY3JpYmFibGUgfHwgdGhpc1snJGRhdGEnXSwgdGhpcywgbnVsbCwgZnVuY3Rpb24oc2VsZiwgcGFyZW50Q29udGV4dCkge1xuICAgICAgICAgICAgLy8gVGhpcyBcImNoaWxkXCIgY29udGV4dCBkb2Vzbid0IGRpcmVjdGx5IHRyYWNrIGEgcGFyZW50IG9ic2VydmFibGUgdmlldyBtb2RlbCxcbiAgICAgICAgICAgIC8vIHNvIHdlIG5lZWQgdG8gbWFudWFsbHkgc2V0IHRoZSAkcmF3RGF0YSB2YWx1ZSB0byBtYXRjaCB0aGUgcGFyZW50LlxuICAgICAgICAgICAgc2VsZlsnJHJhd0RhdGEnXSA9IHBhcmVudENvbnRleHRbJyRyYXdEYXRhJ107XG4gICAgICAgICAgICBrby51dGlscy5leHRlbmQoc2VsZiwgdHlwZW9mKHByb3BlcnRpZXMpID09IFwiZnVuY3Rpb25cIiA/IHByb3BlcnRpZXMoKSA6IHByb3BlcnRpZXMpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gUmV0dXJucyB0aGUgdmFsdWVBY2Nlc29yIGZ1bmN0aW9uIGZvciBhIGJpbmRpbmcgdmFsdWVcbiAgICBmdW5jdGlvbiBtYWtlVmFsdWVBY2Nlc3Nvcih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gUmV0dXJucyB0aGUgdmFsdWUgb2YgYSB2YWx1ZUFjY2Vzc29yIGZ1bmN0aW9uXG4gICAgZnVuY3Rpb24gZXZhbHVhdGVWYWx1ZUFjY2Vzc29yKHZhbHVlQWNjZXNzb3IpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlQWNjZXNzb3IoKTtcbiAgICB9XG5cbiAgICAvLyBHaXZlbiBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBiaW5kaW5ncywgY3JlYXRlIGFuZCByZXR1cm4gYSBuZXcgb2JqZWN0IHRoYXQgY29udGFpbnNcbiAgICAvLyBiaW5kaW5nIHZhbHVlLWFjY2Vzc29ycyBmdW5jdGlvbnMuIEVhY2ggYWNjZXNzb3IgZnVuY3Rpb24gY2FsbHMgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uXG4gICAgLy8gc28gdGhhdCBpdCBhbHdheXMgZ2V0cyB0aGUgbGF0ZXN0IHZhbHVlIGFuZCBhbGwgZGVwZW5kZW5jaWVzIGFyZSBjYXB0dXJlZC4gVGhpcyBpcyB1c2VkXG4gICAgLy8gYnkga28uYXBwbHlCaW5kaW5nc1RvTm9kZSBhbmQgZ2V0QmluZGluZ3NBbmRNYWtlQWNjZXNzb3JzLlxuICAgIGZ1bmN0aW9uIG1ha2VBY2Nlc3NvcnNGcm9tRnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIGtvLnV0aWxzLm9iamVjdE1hcChrby5kZXBlbmRlbmN5RGV0ZWN0aW9uLmlnbm9yZShjYWxsYmFjayksIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soKVtrZXldO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gR2l2ZW4gYSBiaW5kaW5ncyBmdW5jdGlvbiBvciBvYmplY3QsIGNyZWF0ZSBhbmQgcmV0dXJuIGEgbmV3IG9iamVjdCB0aGF0IGNvbnRhaW5zXG4gICAgLy8gYmluZGluZyB2YWx1ZS1hY2Nlc3NvcnMgZnVuY3Rpb25zLiBUaGlzIGlzIHVzZWQgYnkga28uYXBwbHlCaW5kaW5nc1RvTm9kZS5cbiAgICBmdW5jdGlvbiBtYWtlQmluZGluZ0FjY2Vzc29ycyhiaW5kaW5ncywgY29udGV4dCwgbm9kZSkge1xuICAgICAgICBpZiAodHlwZW9mIGJpbmRpbmdzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gbWFrZUFjY2Vzc29yc0Zyb21GdW5jdGlvbihiaW5kaW5ncy5iaW5kKG51bGwsIGNvbnRleHQsIG5vZGUpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBrby51dGlscy5vYmplY3RNYXAoYmluZGluZ3MsIG1ha2VWYWx1ZUFjY2Vzc29yKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCBpZiB0aGUgYmluZGluZyBwcm92aWRlciBkb2Vzbid0IGluY2x1ZGUgYSBnZXRCaW5kaW5nQWNjZXNzb3JzIGZ1bmN0aW9uLlxuICAgIC8vIEl0IG11c3QgYmUgY2FsbGVkIHdpdGggJ3RoaXMnIHNldCB0byB0aGUgcHJvdmlkZXIgaW5zdGFuY2UuXG4gICAgZnVuY3Rpb24gZ2V0QmluZGluZ3NBbmRNYWtlQWNjZXNzb3JzKG5vZGUsIGNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIG1ha2VBY2Nlc3NvcnNGcm9tRnVuY3Rpb24odGhpc1snZ2V0QmluZGluZ3MnXS5iaW5kKHRoaXMsIG5vZGUsIGNvbnRleHQpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZVRoYXRCaW5kaW5nSXNBbGxvd2VkRm9yVmlydHVhbEVsZW1lbnRzKGJpbmRpbmdOYW1lKSB7XG4gICAgICAgIHZhciB2YWxpZGF0b3IgPSBrby52aXJ0dWFsRWxlbWVudHMuYWxsb3dlZEJpbmRpbmdzW2JpbmRpbmdOYW1lXTtcbiAgICAgICAgaWYgKCF2YWxpZGF0b3IpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgYmluZGluZyAnXCIgKyBiaW5kaW5nTmFtZSArIFwiJyBjYW5ub3QgYmUgdXNlZCB3aXRoIHZpcnR1YWwgZWxlbWVudHNcIilcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhcHBseUJpbmRpbmdzVG9EZXNjZW5kYW50c0ludGVybmFsIChiaW5kaW5nQ29udGV4dCwgZWxlbWVudE9yVmlydHVhbEVsZW1lbnQsIGJpbmRpbmdDb250ZXh0c01heURpZmZlckZyb21Eb21QYXJlbnRFbGVtZW50KSB7XG4gICAgICAgIHZhciBjdXJyZW50Q2hpbGQsXG4gICAgICAgICAgICBuZXh0SW5RdWV1ZSA9IGtvLnZpcnR1YWxFbGVtZW50cy5maXJzdENoaWxkKGVsZW1lbnRPclZpcnR1YWxFbGVtZW50KSxcbiAgICAgICAgICAgIHByb3ZpZGVyID0ga28uYmluZGluZ1Byb3ZpZGVyWydpbnN0YW5jZSddLFxuICAgICAgICAgICAgcHJlcHJvY2Vzc05vZGUgPSBwcm92aWRlclsncHJlcHJvY2Vzc05vZGUnXTtcblxuICAgICAgICAvLyBQcmVwcm9jZXNzaW5nIGFsbG93cyBhIGJpbmRpbmcgcHJvdmlkZXIgdG8gbXV0YXRlIGEgbm9kZSBiZWZvcmUgYmluZGluZ3MgYXJlIGFwcGxpZWQgdG8gaXQuIEZvciBleGFtcGxlIGl0J3NcbiAgICAgICAgLy8gcG9zc2libGUgdG8gaW5zZXJ0IG5ldyBzaWJsaW5ncyBhZnRlciBpdCwgYW5kL29yIHJlcGxhY2UgdGhlIG5vZGUgd2l0aCBhIGRpZmZlcmVudCBvbmUuIFRoaXMgY2FuIGJlIHVzZWQgdG9cbiAgICAgICAgLy8gaW1wbGVtZW50IGN1c3RvbSBiaW5kaW5nIHN5bnRheGVzLCBzdWNoIGFzIHt7IHZhbHVlIH19IGZvciBzdHJpbmcgaW50ZXJwb2xhdGlvbiwgb3IgY3VzdG9tIGVsZW1lbnQgdHlwZXMgdGhhdFxuICAgICAgICAvLyB0cmlnZ2VyIGluc2VydGlvbiBvZiA8dGVtcGxhdGU+IGNvbnRlbnRzIGF0IHRoYXQgcG9pbnQgaW4gdGhlIGRvY3VtZW50LlxuICAgICAgICBpZiAocHJlcHJvY2Vzc05vZGUpIHtcbiAgICAgICAgICAgIHdoaWxlIChjdXJyZW50Q2hpbGQgPSBuZXh0SW5RdWV1ZSkge1xuICAgICAgICAgICAgICAgIG5leHRJblF1ZXVlID0ga28udmlydHVhbEVsZW1lbnRzLm5leHRTaWJsaW5nKGN1cnJlbnRDaGlsZCk7XG4gICAgICAgICAgICAgICAgcHJlcHJvY2Vzc05vZGUuY2FsbChwcm92aWRlciwgY3VycmVudENoaWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFJlc2V0IG5leHRJblF1ZXVlIGZvciB0aGUgbmV4dCBsb29wXG4gICAgICAgICAgICBuZXh0SW5RdWV1ZSA9IGtvLnZpcnR1YWxFbGVtZW50cy5maXJzdENoaWxkKGVsZW1lbnRPclZpcnR1YWxFbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdoaWxlIChjdXJyZW50Q2hpbGQgPSBuZXh0SW5RdWV1ZSkge1xuICAgICAgICAgICAgLy8gS2VlcCBhIHJlY29yZCBvZiB0aGUgbmV4dCBjaGlsZCAqYmVmb3JlKiBhcHBseWluZyBiaW5kaW5ncywgaW4gY2FzZSB0aGUgYmluZGluZyByZW1vdmVzIHRoZSBjdXJyZW50IGNoaWxkIGZyb20gaXRzIHBvc2l0aW9uXG4gICAgICAgICAgICBuZXh0SW5RdWV1ZSA9IGtvLnZpcnR1YWxFbGVtZW50cy5uZXh0U2libGluZyhjdXJyZW50Q2hpbGQpO1xuICAgICAgICAgICAgYXBwbHlCaW5kaW5nc1RvTm9kZUFuZERlc2NlbmRhbnRzSW50ZXJuYWwoYmluZGluZ0NvbnRleHQsIGN1cnJlbnRDaGlsZCwgYmluZGluZ0NvbnRleHRzTWF5RGlmZmVyRnJvbURvbVBhcmVudEVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXBwbHlCaW5kaW5nc1RvTm9kZUFuZERlc2NlbmRhbnRzSW50ZXJuYWwgKGJpbmRpbmdDb250ZXh0LCBub2RlVmVyaWZpZWQsIGJpbmRpbmdDb250ZXh0TWF5RGlmZmVyRnJvbURvbVBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgdmFyIHNob3VsZEJpbmREZXNjZW5kYW50cyA9IHRydWU7XG5cbiAgICAgICAgLy8gUGVyZiBvcHRpbWlzYXRpb246IEFwcGx5IGJpbmRpbmdzIG9ubHkgaWYuLi5cbiAgICAgICAgLy8gKDEpIFdlIG5lZWQgdG8gc3RvcmUgdGhlIGJpbmRpbmcgY29udGV4dCBvbiB0aGlzIG5vZGUgKGJlY2F1c2UgaXQgbWF5IGRpZmZlciBmcm9tIHRoZSBET00gcGFyZW50IG5vZGUncyBiaW5kaW5nIGNvbnRleHQpXG4gICAgICAgIC8vICAgICBOb3RlIHRoYXQgd2UgY2FuJ3Qgc3RvcmUgYmluZGluZyBjb250ZXh0cyBvbiBub24tZWxlbWVudHMgKGUuZy4sIHRleHQgbm9kZXMpLCBhcyBJRSBkb2Vzbid0IGFsbG93IGV4cGFuZG8gcHJvcGVydGllcyBmb3IgdGhvc2VcbiAgICAgICAgLy8gKDIpIEl0IG1pZ2h0IGhhdmUgYmluZGluZ3MgKGUuZy4sIGl0IGhhcyBhIGRhdGEtYmluZCBhdHRyaWJ1dGUsIG9yIGl0J3MgYSBtYXJrZXIgZm9yIGEgY29udGFpbmVybGVzcyB0ZW1wbGF0ZSlcbiAgICAgICAgdmFyIGlzRWxlbWVudCA9IChub2RlVmVyaWZpZWQubm9kZVR5cGUgPT09IDEpO1xuICAgICAgICBpZiAoaXNFbGVtZW50KSAvLyBXb3JrYXJvdW5kIElFIDw9IDggSFRNTCBwYXJzaW5nIHdlaXJkbmVzc1xuICAgICAgICAgICAga28udmlydHVhbEVsZW1lbnRzLm5vcm1hbGlzZVZpcnR1YWxFbGVtZW50RG9tU3RydWN0dXJlKG5vZGVWZXJpZmllZCk7XG5cbiAgICAgICAgdmFyIHNob3VsZEFwcGx5QmluZGluZ3MgPSAoaXNFbGVtZW50ICYmIGJpbmRpbmdDb250ZXh0TWF5RGlmZmVyRnJvbURvbVBhcmVudEVsZW1lbnQpICAgICAgICAgICAgIC8vIENhc2UgKDEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwga28uYmluZGluZ1Byb3ZpZGVyWydpbnN0YW5jZSddWydub2RlSGFzQmluZGluZ3MnXShub2RlVmVyaWZpZWQpOyAgICAgICAvLyBDYXNlICgyKVxuICAgICAgICBpZiAoc2hvdWxkQXBwbHlCaW5kaW5ncylcbiAgICAgICAgICAgIHNob3VsZEJpbmREZXNjZW5kYW50cyA9IGFwcGx5QmluZGluZ3NUb05vZGVJbnRlcm5hbChub2RlVmVyaWZpZWQsIG51bGwsIGJpbmRpbmdDb250ZXh0LCBiaW5kaW5nQ29udGV4dE1heURpZmZlckZyb21Eb21QYXJlbnRFbGVtZW50KVsnc2hvdWxkQmluZERlc2NlbmRhbnRzJ107XG5cbiAgICAgICAgaWYgKHNob3VsZEJpbmREZXNjZW5kYW50cyAmJiAhYmluZGluZ0RvZXNOb3RSZWN1cnNlSW50b0VsZW1lbnRUeXBlc1trby51dGlscy50YWdOYW1lTG93ZXIobm9kZVZlcmlmaWVkKV0pIHtcbiAgICAgICAgICAgIC8vIFdlJ3JlIHJlY3Vyc2luZyBhdXRvbWF0aWNhbGx5IGludG8gKHJlYWwgb3IgdmlydHVhbCkgY2hpbGQgbm9kZXMgd2l0aG91dCBjaGFuZ2luZyBiaW5kaW5nIGNvbnRleHRzLiBTbyxcbiAgICAgICAgICAgIC8vICAqIEZvciBjaGlsZHJlbiBvZiBhICpyZWFsKiBlbGVtZW50LCB0aGUgYmluZGluZyBjb250ZXh0IGlzIGNlcnRhaW5seSB0aGUgc2FtZSBhcyBvbiB0aGVpciBET00gLnBhcmVudE5vZGUsXG4gICAgICAgICAgICAvLyAgICBoZW5jZSBiaW5kaW5nQ29udGV4dHNNYXlEaWZmZXJGcm9tRG9tUGFyZW50RWxlbWVudCBpcyBmYWxzZVxuICAgICAgICAgICAgLy8gICogRm9yIGNoaWxkcmVuIG9mIGEgKnZpcnR1YWwqIGVsZW1lbnQsIHdlIGNhbid0IGJlIHN1cmUuIEV2YWx1YXRpbmcgLnBhcmVudE5vZGUgb24gdGhvc2UgY2hpbGRyZW4gbWF5XG4gICAgICAgICAgICAvLyAgICBza2lwIG92ZXIgYW55IG51bWJlciBvZiBpbnRlcm1lZGlhdGUgdmlydHVhbCBlbGVtZW50cywgYW55IG9mIHdoaWNoIG1pZ2h0IGRlZmluZSBhIGN1c3RvbSBiaW5kaW5nIGNvbnRleHQsXG4gICAgICAgICAgICAvLyAgICBoZW5jZSBiaW5kaW5nQ29udGV4dHNNYXlEaWZmZXJGcm9tRG9tUGFyZW50RWxlbWVudCBpcyB0cnVlXG4gICAgICAgICAgICBhcHBseUJpbmRpbmdzVG9EZXNjZW5kYW50c0ludGVybmFsKGJpbmRpbmdDb250ZXh0LCBub2RlVmVyaWZpZWQsIC8qIGJpbmRpbmdDb250ZXh0c01heURpZmZlckZyb21Eb21QYXJlbnRFbGVtZW50OiAqLyAhaXNFbGVtZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBib3VuZEVsZW1lbnREb21EYXRhS2V5ID0ga28udXRpbHMuZG9tRGF0YS5uZXh0S2V5KCk7XG5cblxuICAgIGZ1bmN0aW9uIHRvcG9sb2dpY2FsU29ydEJpbmRpbmdzKGJpbmRpbmdzKSB7XG4gICAgICAgIC8vIERlcHRoLWZpcnN0IHNvcnRcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdLCAgICAgICAgICAgICAgICAvLyBUaGUgbGlzdCBvZiBrZXkvaGFuZGxlciBwYWlycyB0aGF0IHdlIHdpbGwgcmV0dXJuXG4gICAgICAgICAgICBiaW5kaW5nc0NvbnNpZGVyZWQgPSB7fSwgICAgLy8gQSB0ZW1wb3JhcnkgcmVjb3JkIG9mIHdoaWNoIGJpbmRpbmdzIGFyZSBhbHJlYWR5IGluICdyZXN1bHQnXG4gICAgICAgICAgICBjeWNsaWNEZXBlbmRlbmN5U3RhY2sgPSBbXTsgLy8gS2VlcHMgdHJhY2sgb2YgYSBkZXB0aC1zZWFyY2ggc28gdGhhdCwgaWYgdGhlcmUncyBhIGN5Y2xlLCB3ZSBrbm93IHdoaWNoIGJpbmRpbmdzIGNhdXNlZCBpdFxuICAgICAgICBrby51dGlscy5vYmplY3RGb3JFYWNoKGJpbmRpbmdzLCBmdW5jdGlvbiBwdXNoQmluZGluZyhiaW5kaW5nS2V5KSB7XG4gICAgICAgICAgICBpZiAoIWJpbmRpbmdzQ29uc2lkZXJlZFtiaW5kaW5nS2V5XSkge1xuICAgICAgICAgICAgICAgIHZhciBiaW5kaW5nID0ga29bJ2dldEJpbmRpbmdIYW5kbGVyJ10oYmluZGluZ0tleSk7XG4gICAgICAgICAgICAgICAgaWYgKGJpbmRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRmlyc3QgYWRkIGRlcGVuZGVuY2llcyAoaWYgYW55KSBvZiB0aGUgY3VycmVudCBiaW5kaW5nXG4gICAgICAgICAgICAgICAgICAgIGlmIChiaW5kaW5nWydhZnRlciddKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjeWNsaWNEZXBlbmRlbmN5U3RhY2sucHVzaChiaW5kaW5nS2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtvLnV0aWxzLmFycmF5Rm9yRWFjaChiaW5kaW5nWydhZnRlciddLCBmdW5jdGlvbihiaW5kaW5nRGVwZW5kZW5jeUtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiaW5kaW5nc1tiaW5kaW5nRGVwZW5kZW5jeUtleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtvLnV0aWxzLmFycmF5SW5kZXhPZihjeWNsaWNEZXBlbmRlbmN5U3RhY2ssIGJpbmRpbmdEZXBlbmRlbmN5S2V5KSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiQ2Fubm90IGNvbWJpbmUgdGhlIGZvbGxvd2luZyBiaW5kaW5ncywgYmVjYXVzZSB0aGV5IGhhdmUgYSBjeWNsaWMgZGVwZW5kZW5jeTogXCIgKyBjeWNsaWNEZXBlbmRlbmN5U3RhY2suam9pbihcIiwgXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hCaW5kaW5nKGJpbmRpbmdEZXBlbmRlbmN5S2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3ljbGljRGVwZW5kZW5jeVN0YWNrLmxlbmd0aC0tO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIE5leHQgYWRkIHRoZSBjdXJyZW50IGJpbmRpbmdcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goeyBrZXk6IGJpbmRpbmdLZXksIGhhbmRsZXI6IGJpbmRpbmcgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJpbmRpbmdzQ29uc2lkZXJlZFtiaW5kaW5nS2V5XSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXBwbHlCaW5kaW5nc1RvTm9kZUludGVybmFsKG5vZGUsIHNvdXJjZUJpbmRpbmdzLCBiaW5kaW5nQ29udGV4dCwgYmluZGluZ0NvbnRleHRNYXlEaWZmZXJGcm9tRG9tUGFyZW50RWxlbWVudCkge1xuICAgICAgICAvLyBQcmV2ZW50IG11bHRpcGxlIGFwcGx5QmluZGluZ3MgY2FsbHMgZm9yIHRoZSBzYW1lIG5vZGUsIGV4Y2VwdCB3aGVuIGEgYmluZGluZyB2YWx1ZSBpcyBzcGVjaWZpZWRcbiAgICAgICAgdmFyIGFscmVhZHlCb3VuZCA9IGtvLnV0aWxzLmRvbURhdGEuZ2V0KG5vZGUsIGJvdW5kRWxlbWVudERvbURhdGFLZXkpO1xuICAgICAgICBpZiAoIXNvdXJjZUJpbmRpbmdzKSB7XG4gICAgICAgICAgICBpZiAoYWxyZWFkeUJvdW5kKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJZb3UgY2Fubm90IGFwcGx5IGJpbmRpbmdzIG11bHRpcGxlIHRpbWVzIHRvIHRoZSBzYW1lIGVsZW1lbnQuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAga28udXRpbHMuZG9tRGF0YS5zZXQobm9kZSwgYm91bmRFbGVtZW50RG9tRGF0YUtleSwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBPcHRpbWl6YXRpb246IERvbid0IHN0b3JlIHRoZSBiaW5kaW5nIGNvbnRleHQgb24gdGhpcyBub2RlIGlmIGl0J3MgZGVmaW5pdGVseSB0aGUgc2FtZSBhcyBvbiBub2RlLnBhcmVudE5vZGUsIGJlY2F1c2VcbiAgICAgICAgLy8gd2UgY2FuIGVhc2lseSByZWNvdmVyIGl0IGp1c3QgYnkgc2Nhbm5pbmcgdXAgdGhlIG5vZGUncyBhbmNlc3RvcnMgaW4gdGhlIERPTVxuICAgICAgICAvLyAobm90ZTogaGVyZSwgcGFyZW50IG5vZGUgbWVhbnMgXCJyZWFsIERPTSBwYXJlbnRcIiBub3QgXCJ2aXJ0dWFsIHBhcmVudFwiLCBhcyB0aGVyZSdzIG5vIE8oMSkgd2F5IHRvIGZpbmQgdGhlIHZpcnR1YWwgcGFyZW50KVxuICAgICAgICBpZiAoIWFscmVhZHlCb3VuZCAmJiBiaW5kaW5nQ29udGV4dE1heURpZmZlckZyb21Eb21QYXJlbnRFbGVtZW50KVxuICAgICAgICAgICAga28uc3RvcmVkQmluZGluZ0NvbnRleHRGb3JOb2RlKG5vZGUsIGJpbmRpbmdDb250ZXh0KTtcblxuICAgICAgICAvLyBVc2UgYmluZGluZ3MgaWYgZ2l2ZW4sIG90aGVyd2lzZSBmYWxsIGJhY2sgb24gYXNraW5nIHRoZSBiaW5kaW5ncyBwcm92aWRlciB0byBnaXZlIHVzIHNvbWUgYmluZGluZ3NcbiAgICAgICAgdmFyIGJpbmRpbmdzO1xuICAgICAgICBpZiAoc291cmNlQmluZGluZ3MgJiYgdHlwZW9mIHNvdXJjZUJpbmRpbmdzICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBiaW5kaW5ncyA9IHNvdXJjZUJpbmRpbmdzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHByb3ZpZGVyID0ga28uYmluZGluZ1Byb3ZpZGVyWydpbnN0YW5jZSddLFxuICAgICAgICAgICAgICAgIGdldEJpbmRpbmdzID0gcHJvdmlkZXJbJ2dldEJpbmRpbmdBY2Nlc3NvcnMnXSB8fCBnZXRCaW5kaW5nc0FuZE1ha2VBY2Nlc3NvcnM7XG5cbiAgICAgICAgICAgIC8vIEdldCB0aGUgYmluZGluZyBmcm9tIHRoZSBwcm92aWRlciB3aXRoaW4gYSBjb21wdXRlZCBvYnNlcnZhYmxlIHNvIHRoYXQgd2UgY2FuIHVwZGF0ZSB0aGUgYmluZGluZ3Mgd2hlbmV2ZXJcbiAgICAgICAgICAgIC8vIHRoZSBiaW5kaW5nIGNvbnRleHQgaXMgdXBkYXRlZCBvciBpZiB0aGUgYmluZGluZyBwcm92aWRlciBhY2Nlc3NlcyBvYnNlcnZhYmxlcy5cbiAgICAgICAgICAgIHZhciBiaW5kaW5nc1VwZGF0ZXIgPSBrby5kZXBlbmRlbnRPYnNlcnZhYmxlKFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBiaW5kaW5ncyA9IHNvdXJjZUJpbmRpbmdzID8gc291cmNlQmluZGluZ3MoYmluZGluZ0NvbnRleHQsIG5vZGUpIDogZ2V0QmluZGluZ3MuY2FsbChwcm92aWRlciwgbm9kZSwgYmluZGluZ0NvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgICAvLyBSZWdpc3RlciBhIGRlcGVuZGVuY3kgb24gdGhlIGJpbmRpbmcgY29udGV4dCB0byBzdXBwb3J0IG9ic2V2YWJsZSB2aWV3IG1vZGVscy5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGJpbmRpbmdzICYmIGJpbmRpbmdDb250ZXh0Ll9zdWJzY3JpYmFibGUpXG4gICAgICAgICAgICAgICAgICAgICAgICBiaW5kaW5nQ29udGV4dC5fc3Vic2NyaWJhYmxlKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiaW5kaW5ncztcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG51bGwsIHsgZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkOiBub2RlIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGlmICghYmluZGluZ3MgfHwgIWJpbmRpbmdzVXBkYXRlci5pc0FjdGl2ZSgpKVxuICAgICAgICAgICAgICAgIGJpbmRpbmdzVXBkYXRlciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYmluZGluZ0hhbmRsZXJUaGF0Q29udHJvbHNEZXNjZW5kYW50QmluZGluZ3M7XG4gICAgICAgIGlmIChiaW5kaW5ncykge1xuICAgICAgICAgICAgLy8gUmV0dXJuIHRoZSB2YWx1ZSBhY2Nlc3NvciBmb3IgYSBnaXZlbiBiaW5kaW5nLiBXaGVuIGJpbmRpbmdzIGFyZSBzdGF0aWMgKHdvbid0IGJlIHVwZGF0ZWQgYmVjYXVzZSBvZiBhIGJpbmRpbmdcbiAgICAgICAgICAgIC8vIGNvbnRleHQgdXBkYXRlKSwganVzdCByZXR1cm4gdGhlIHZhbHVlIGFjY2Vzc29yIGZyb20gdGhlIGJpbmRpbmcuIE90aGVyd2lzZSwgcmV0dXJuIGEgZnVuY3Rpb24gdGhhdCBhbHdheXMgZ2V0c1xuICAgICAgICAgICAgLy8gdGhlIGxhdGVzdCBiaW5kaW5nIHZhbHVlIGFuZCByZWdpc3RlcnMgYSBkZXBlbmRlbmN5IG9uIHRoZSBiaW5kaW5nIHVwZGF0ZXIuXG4gICAgICAgICAgICB2YXIgZ2V0VmFsdWVBY2Nlc3NvciA9IGJpbmRpbmdzVXBkYXRlclxuICAgICAgICAgICAgICAgID8gZnVuY3Rpb24oYmluZGluZ0tleSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXZhbHVhdGVWYWx1ZUFjY2Vzc29yKGJpbmRpbmdzVXBkYXRlcigpW2JpbmRpbmdLZXldKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9IDogZnVuY3Rpb24oYmluZGluZ0tleSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmluZGluZ3NbYmluZGluZ0tleV07XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gVXNlIG9mIGFsbEJpbmRpbmdzIGFzIGEgZnVuY3Rpb24gaXMgbWFpbnRhaW5lZCBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHksIGJ1dCBpdHMgdXNlIGlzIGRlcHJlY2F0ZWRcbiAgICAgICAgICAgIGZ1bmN0aW9uIGFsbEJpbmRpbmdzKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBrby51dGlscy5vYmplY3RNYXAoYmluZGluZ3NVcGRhdGVyID8gYmluZGluZ3NVcGRhdGVyKCkgOiBiaW5kaW5ncywgZXZhbHVhdGVWYWx1ZUFjY2Vzc29yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgaXMgdGhlIDMueCBhbGxCaW5kaW5ncyBBUElcbiAgICAgICAgICAgIGFsbEJpbmRpbmdzWydnZXQnXSA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBiaW5kaW5nc1trZXldICYmIGV2YWx1YXRlVmFsdWVBY2Nlc3NvcihnZXRWYWx1ZUFjY2Vzc29yKGtleSkpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGFsbEJpbmRpbmdzWydoYXMnXSA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBrZXkgaW4gYmluZGluZ3M7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBGaXJzdCBwdXQgdGhlIGJpbmRpbmdzIGludG8gdGhlIHJpZ2h0IG9yZGVyXG4gICAgICAgICAgICB2YXIgb3JkZXJlZEJpbmRpbmdzID0gdG9wb2xvZ2ljYWxTb3J0QmluZGluZ3MoYmluZGluZ3MpO1xuXG4gICAgICAgICAgICAvLyBHbyB0aHJvdWdoIHRoZSBzb3J0ZWQgYmluZGluZ3MsIGNhbGxpbmcgaW5pdCBhbmQgdXBkYXRlIGZvciBlYWNoXG4gICAgICAgICAgICBrby51dGlscy5hcnJheUZvckVhY2gob3JkZXJlZEJpbmRpbmdzLCBmdW5jdGlvbihiaW5kaW5nS2V5QW5kSGFuZGxlcikge1xuICAgICAgICAgICAgICAgIC8vIE5vdGUgdGhhdCB0b3BvbG9naWNhbFNvcnRCaW5kaW5ncyBoYXMgYWxyZWFkeSBmaWx0ZXJlZCBvdXQgYW55IG5vbmV4aXN0ZW50IGJpbmRpbmcgaGFuZGxlcnMsXG4gICAgICAgICAgICAgICAgLy8gc28gYmluZGluZ0tleUFuZEhhbmRsZXIuaGFuZGxlciB3aWxsIGFsd2F5cyBiZSBub25udWxsLlxuICAgICAgICAgICAgICAgIHZhciBoYW5kbGVySW5pdEZuID0gYmluZGluZ0tleUFuZEhhbmRsZXIuaGFuZGxlcltcImluaXRcIl0sXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXJVcGRhdGVGbiA9IGJpbmRpbmdLZXlBbmRIYW5kbGVyLmhhbmRsZXJbXCJ1cGRhdGVcIl0sXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmdLZXkgPSBiaW5kaW5nS2V5QW5kSGFuZGxlci5rZXk7XG5cbiAgICAgICAgICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gOCkge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZVRoYXRCaW5kaW5nSXNBbGxvd2VkRm9yVmlydHVhbEVsZW1lbnRzKGJpbmRpbmdLZXkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFJ1biBpbml0LCBpZ25vcmluZyBhbnkgZGVwZW5kZW5jaWVzXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaGFuZGxlckluaXRGbiA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uaWdub3JlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbml0UmVzdWx0ID0gaGFuZGxlckluaXRGbihub2RlLCBnZXRWYWx1ZUFjY2Vzc29yKGJpbmRpbmdLZXkpLCBhbGxCaW5kaW5ncywgYmluZGluZ0NvbnRleHRbJyRkYXRhJ10sIGJpbmRpbmdDb250ZXh0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIHRoaXMgYmluZGluZyBoYW5kbGVyIGNsYWltcyB0byBjb250cm9sIGRlc2NlbmRhbnQgYmluZGluZ3MsIG1ha2UgYSBub3RlIG9mIHRoaXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdFJlc3VsdCAmJiBpbml0UmVzdWx0Wydjb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5ncyddKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiaW5kaW5nSGFuZGxlclRoYXRDb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5ncyAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTXVsdGlwbGUgYmluZGluZ3MgKFwiICsgYmluZGluZ0hhbmRsZXJUaGF0Q29udHJvbHNEZXNjZW5kYW50QmluZGluZ3MgKyBcIiBhbmQgXCIgKyBiaW5kaW5nS2V5ICsgXCIpIGFyZSB0cnlpbmcgdG8gY29udHJvbCBkZXNjZW5kYW50IGJpbmRpbmdzIG9mIHRoZSBzYW1lIGVsZW1lbnQuIFlvdSBjYW5ub3QgdXNlIHRoZXNlIGJpbmRpbmdzIHRvZ2V0aGVyIG9uIHRoZSBzYW1lIGVsZW1lbnQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kaW5nSGFuZGxlclRoYXRDb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5ncyA9IGJpbmRpbmdLZXk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBSdW4gdXBkYXRlIGluIGl0cyBvd24gY29tcHV0ZWQgd3JhcHBlclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGhhbmRsZXJVcGRhdGVGbiA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtvLmRlcGVuZGVudE9ic2VydmFibGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXJVcGRhdGVGbihub2RlLCBnZXRWYWx1ZUFjY2Vzc29yKGJpbmRpbmdLZXkpLCBhbGxCaW5kaW5ncywgYmluZGluZ0NvbnRleHRbJyRkYXRhJ10sIGJpbmRpbmdDb250ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IG5vZGUgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGV4Lm1lc3NhZ2UgPSBcIlVuYWJsZSB0byBwcm9jZXNzIGJpbmRpbmcgXFxcIlwiICsgYmluZGluZ0tleSArIFwiOiBcIiArIGJpbmRpbmdzW2JpbmRpbmdLZXldICsgXCJcXFwiXFxuTWVzc2FnZTogXCIgKyBleC5tZXNzYWdlO1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBleDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAnc2hvdWxkQmluZERlc2NlbmRhbnRzJzogYmluZGluZ0hhbmRsZXJUaGF0Q29udHJvbHNEZXNjZW5kYW50QmluZGluZ3MgPT09IHVuZGVmaW5lZFxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICB2YXIgc3RvcmVkQmluZGluZ0NvbnRleHREb21EYXRhS2V5ID0ga28udXRpbHMuZG9tRGF0YS5uZXh0S2V5KCk7XG4gICAga28uc3RvcmVkQmluZGluZ0NvbnRleHRGb3JOb2RlID0gZnVuY3Rpb24gKG5vZGUsIGJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDIpIHtcbiAgICAgICAgICAgIGtvLnV0aWxzLmRvbURhdGEuc2V0KG5vZGUsIHN0b3JlZEJpbmRpbmdDb250ZXh0RG9tRGF0YUtleSwgYmluZGluZ0NvbnRleHQpO1xuICAgICAgICAgICAgaWYgKGJpbmRpbmdDb250ZXh0Ll9zdWJzY3JpYmFibGUpXG4gICAgICAgICAgICAgICAgYmluZGluZ0NvbnRleHQuX3N1YnNjcmliYWJsZS5fYWRkTm9kZShub2RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBrby51dGlscy5kb21EYXRhLmdldChub2RlLCBzdG9yZWRCaW5kaW5nQ29udGV4dERvbURhdGFLZXkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QmluZGluZ0NvbnRleHQodmlld01vZGVsT3JCaW5kaW5nQ29udGV4dCkge1xuICAgICAgICByZXR1cm4gdmlld01vZGVsT3JCaW5kaW5nQ29udGV4dCAmJiAodmlld01vZGVsT3JCaW5kaW5nQ29udGV4dCBpbnN0YW5jZW9mIGtvLmJpbmRpbmdDb250ZXh0KVxuICAgICAgICAgICAgPyB2aWV3TW9kZWxPckJpbmRpbmdDb250ZXh0XG4gICAgICAgICAgICA6IG5ldyBrby5iaW5kaW5nQ29udGV4dCh2aWV3TW9kZWxPckJpbmRpbmdDb250ZXh0KTtcbiAgICB9XG5cbiAgICBrby5hcHBseUJpbmRpbmdBY2Nlc3NvcnNUb05vZGUgPSBmdW5jdGlvbiAobm9kZSwgYmluZGluZ3MsIHZpZXdNb2RlbE9yQmluZGluZ0NvbnRleHQpIHtcbiAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpIC8vIElmIGl0J3MgYW4gZWxlbWVudCwgd29ya2Fyb3VuZCBJRSA8PSA4IEhUTUwgcGFyc2luZyB3ZWlyZG5lc3NcbiAgICAgICAgICAgIGtvLnZpcnR1YWxFbGVtZW50cy5ub3JtYWxpc2VWaXJ0dWFsRWxlbWVudERvbVN0cnVjdHVyZShub2RlKTtcbiAgICAgICAgcmV0dXJuIGFwcGx5QmluZGluZ3NUb05vZGVJbnRlcm5hbChub2RlLCBiaW5kaW5ncywgZ2V0QmluZGluZ0NvbnRleHQodmlld01vZGVsT3JCaW5kaW5nQ29udGV4dCksIHRydWUpO1xuICAgIH07XG5cbiAgICBrby5hcHBseUJpbmRpbmdzVG9Ob2RlID0gZnVuY3Rpb24gKG5vZGUsIGJpbmRpbmdzLCB2aWV3TW9kZWxPckJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgIHZhciBjb250ZXh0ID0gZ2V0QmluZGluZ0NvbnRleHQodmlld01vZGVsT3JCaW5kaW5nQ29udGV4dCk7XG4gICAgICAgIHJldHVybiBrby5hcHBseUJpbmRpbmdBY2Nlc3NvcnNUb05vZGUobm9kZSwgbWFrZUJpbmRpbmdBY2Nlc3NvcnMoYmluZGluZ3MsIGNvbnRleHQsIG5vZGUpLCBjb250ZXh0KTtcbiAgICB9O1xuXG4gICAga28uYXBwbHlCaW5kaW5nc1RvRGVzY2VuZGFudHMgPSBmdW5jdGlvbih2aWV3TW9kZWxPckJpbmRpbmdDb250ZXh0LCByb290Tm9kZSkge1xuICAgICAgICBpZiAocm9vdE5vZGUubm9kZVR5cGUgPT09IDEgfHwgcm9vdE5vZGUubm9kZVR5cGUgPT09IDgpXG4gICAgICAgICAgICBhcHBseUJpbmRpbmdzVG9EZXNjZW5kYW50c0ludGVybmFsKGdldEJpbmRpbmdDb250ZXh0KHZpZXdNb2RlbE9yQmluZGluZ0NvbnRleHQpLCByb290Tm9kZSwgdHJ1ZSk7XG4gICAgfTtcblxuICAgIGtvLmFwcGx5QmluZGluZ3MgPSBmdW5jdGlvbiAodmlld01vZGVsT3JCaW5kaW5nQ29udGV4dCwgcm9vdE5vZGUpIHtcbiAgICAgICAgLy8gSWYgalF1ZXJ5IGlzIGxvYWRlZCBhZnRlciBLbm9ja291dCwgd2Ugd29uJ3QgaW5pdGlhbGx5IGhhdmUgYWNjZXNzIHRvIGl0LiBTbyBzYXZlIGl0IGhlcmUuXG4gICAgICAgIGlmICghalF1ZXJ5SW5zdGFuY2UgJiYgd2luZG93WydqUXVlcnknXSkge1xuICAgICAgICAgICAgalF1ZXJ5SW5zdGFuY2UgPSB3aW5kb3dbJ2pRdWVyeSddO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJvb3ROb2RlICYmIChyb290Tm9kZS5ub2RlVHlwZSAhPT0gMSkgJiYgKHJvb3ROb2RlLm5vZGVUeXBlICE9PSA4KSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImtvLmFwcGx5QmluZGluZ3M6IGZpcnN0IHBhcmFtZXRlciBzaG91bGQgYmUgeW91ciB2aWV3IG1vZGVsOyBzZWNvbmQgcGFyYW1ldGVyIHNob3VsZCBiZSBhIERPTSBub2RlXCIpO1xuICAgICAgICByb290Tm9kZSA9IHJvb3ROb2RlIHx8IHdpbmRvdy5kb2N1bWVudC5ib2R5OyAvLyBNYWtlIFwicm9vdE5vZGVcIiBwYXJhbWV0ZXIgb3B0aW9uYWxcblxuICAgICAgICBhcHBseUJpbmRpbmdzVG9Ob2RlQW5kRGVzY2VuZGFudHNJbnRlcm5hbChnZXRCaW5kaW5nQ29udGV4dCh2aWV3TW9kZWxPckJpbmRpbmdDb250ZXh0KSwgcm9vdE5vZGUsIHRydWUpO1xuICAgIH07XG5cbiAgICAvLyBSZXRyaWV2aW5nIGJpbmRpbmcgY29udGV4dCBmcm9tIGFyYml0cmFyeSBub2Rlc1xuICAgIGtvLmNvbnRleHRGb3IgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIC8vIFdlIGNhbiBvbmx5IGRvIHNvbWV0aGluZyBtZWFuaW5nZnVsIGZvciBlbGVtZW50cyBhbmQgY29tbWVudCBub2RlcyAoaW4gcGFydGljdWxhciwgbm90IHRleHQgbm9kZXMsIGFzIElFIGNhbid0IHN0b3JlIGRvbWRhdGEgZm9yIHRoZW0pXG4gICAgICAgIHN3aXRjaCAobm9kZS5ub2RlVHlwZSkge1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgICAgIHZhciBjb250ZXh0ID0ga28uc3RvcmVkQmluZGluZ0NvbnRleHRGb3JOb2RlKG5vZGUpO1xuICAgICAgICAgICAgICAgIGlmIChjb250ZXh0KSByZXR1cm4gY29udGV4dDtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5wYXJlbnROb2RlKSByZXR1cm4ga28uY29udGV4dEZvcihub2RlLnBhcmVudE5vZGUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfTtcbiAgICBrby5kYXRhRm9yID0gZnVuY3Rpb24obm9kZSkge1xuICAgICAgICB2YXIgY29udGV4dCA9IGtvLmNvbnRleHRGb3Iobm9kZSk7XG4gICAgICAgIHJldHVybiBjb250ZXh0ID8gY29udGV4dFsnJGRhdGEnXSA6IHVuZGVmaW5lZDtcbiAgICB9O1xuXG4gICAga28uZXhwb3J0U3ltYm9sKCdiaW5kaW5nSGFuZGxlcnMnLCBrby5iaW5kaW5nSGFuZGxlcnMpO1xuICAgIGtvLmV4cG9ydFN5bWJvbCgnYXBwbHlCaW5kaW5ncycsIGtvLmFwcGx5QmluZGluZ3MpO1xuICAgIGtvLmV4cG9ydFN5bWJvbCgnYXBwbHlCaW5kaW5nc1RvRGVzY2VuZGFudHMnLCBrby5hcHBseUJpbmRpbmdzVG9EZXNjZW5kYW50cyk7XG4gICAga28uZXhwb3J0U3ltYm9sKCdhcHBseUJpbmRpbmdBY2Nlc3NvcnNUb05vZGUnLCBrby5hcHBseUJpbmRpbmdBY2Nlc3NvcnNUb05vZGUpO1xuICAgIGtvLmV4cG9ydFN5bWJvbCgnYXBwbHlCaW5kaW5nc1RvTm9kZScsIGtvLmFwcGx5QmluZGluZ3NUb05vZGUpO1xuICAgIGtvLmV4cG9ydFN5bWJvbCgnY29udGV4dEZvcicsIGtvLmNvbnRleHRGb3IpO1xuICAgIGtvLmV4cG9ydFN5bWJvbCgnZGF0YUZvcicsIGtvLmRhdGFGb3IpO1xufSkoKTtcbihmdW5jdGlvbih1bmRlZmluZWQpIHtcbiAgICB2YXIgbG9hZGluZ1N1YnNjcmliYWJsZXNDYWNoZSA9IHt9LCAvLyBUcmFja3MgY29tcG9uZW50IGxvYWRzIHRoYXQgYXJlIGN1cnJlbnRseSBpbiBmbGlnaHRcbiAgICAgICAgbG9hZGVkRGVmaW5pdGlvbnNDYWNoZSA9IHt9OyAgICAvLyBUcmFja3MgY29tcG9uZW50IGxvYWRzIHRoYXQgaGF2ZSBhbHJlYWR5IGNvbXBsZXRlZFxuXG4gICAga28uY29tcG9uZW50cyA9IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbihjb21wb25lbnROYW1lLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgdmFyIGNhY2hlZERlZmluaXRpb24gPSBnZXRPYmplY3RPd25Qcm9wZXJ0eShsb2FkZWREZWZpbml0aW9uc0NhY2hlLCBjb21wb25lbnROYW1lKTtcbiAgICAgICAgICAgIGlmIChjYWNoZWREZWZpbml0aW9uKSB7XG4gICAgICAgICAgICAgICAgLy8gSXQncyBhbHJlYWR5IGxvYWRlZCBhbmQgY2FjaGVkLiBSZXVzZSB0aGUgc2FtZSBkZWZpbml0aW9uIG9iamVjdC5cbiAgICAgICAgICAgICAgICAvLyBOb3RlIHRoYXQgZm9yIEFQSSBjb25zaXN0ZW5jeSwgZXZlbiBjYWNoZSBoaXRzIGNvbXBsZXRlIGFzeW5jaHJvbm91c2x5LlxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGNhbGxiYWNrKGNhY2hlZERlZmluaXRpb24pIH0sIDApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBKb2luIHRoZSBsb2FkaW5nIHByb2Nlc3MgdGhhdCBpcyBhbHJlYWR5IHVuZGVyd2F5LCBvciBzdGFydCBhIG5ldyBvbmUuXG4gICAgICAgICAgICAgICAgbG9hZENvbXBvbmVudEFuZE5vdGlmeShjb21wb25lbnROYW1lLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2xlYXJDYWNoZWREZWZpbml0aW9uOiBmdW5jdGlvbihjb21wb25lbnROYW1lKSB7XG4gICAgICAgICAgICBkZWxldGUgbG9hZGVkRGVmaW5pdGlvbnNDYWNoZVtjb21wb25lbnROYW1lXTtcbiAgICAgICAgfSxcblxuICAgICAgICBfZ2V0Rmlyc3RSZXN1bHRGcm9tTG9hZGVyczogZ2V0Rmlyc3RSZXN1bHRGcm9tTG9hZGVyc1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRPYmplY3RPd25Qcm9wZXJ0eShvYmosIHByb3BOYW1lKSB7XG4gICAgICAgIHJldHVybiBvYmouaGFzT3duUHJvcGVydHkocHJvcE5hbWUpID8gb2JqW3Byb3BOYW1lXSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2FkQ29tcG9uZW50QW5kTm90aWZ5KGNvbXBvbmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBzdWJzY3JpYmFibGUgPSBnZXRPYmplY3RPd25Qcm9wZXJ0eShsb2FkaW5nU3Vic2NyaWJhYmxlc0NhY2hlLCBjb21wb25lbnROYW1lKSxcbiAgICAgICAgICAgIGNvbXBsZXRlZEFzeW5jO1xuICAgICAgICBpZiAoIXN1YnNjcmliYWJsZSkge1xuICAgICAgICAgICAgLy8gSXQncyBub3Qgc3RhcnRlZCBsb2FkaW5nIHlldC4gU3RhcnQgbG9hZGluZywgYW5kIHdoZW4gaXQncyBkb25lLCBtb3ZlIGl0IHRvIGxvYWRlZERlZmluaXRpb25zQ2FjaGUuXG4gICAgICAgICAgICBzdWJzY3JpYmFibGUgPSBsb2FkaW5nU3Vic2NyaWJhYmxlc0NhY2hlW2NvbXBvbmVudE5hbWVdID0gbmV3IGtvLnN1YnNjcmliYWJsZSgpO1xuICAgICAgICAgICAgYmVnaW5Mb2FkaW5nQ29tcG9uZW50KGNvbXBvbmVudE5hbWUsIGZ1bmN0aW9uKGRlZmluaXRpb24pIHtcbiAgICAgICAgICAgICAgICBsb2FkZWREZWZpbml0aW9uc0NhY2hlW2NvbXBvbmVudE5hbWVdID0gZGVmaW5pdGlvbjtcbiAgICAgICAgICAgICAgICBkZWxldGUgbG9hZGluZ1N1YnNjcmliYWJsZXNDYWNoZVtjb21wb25lbnROYW1lXTtcblxuICAgICAgICAgICAgICAgIC8vIEZvciBBUEkgY29uc2lzdGVuY3ksIGFsbCBsb2FkcyBjb21wbGV0ZSBhc3luY2hyb25vdXNseS4gSG93ZXZlciB3ZSB3YW50IHRvIGF2b2lkXG4gICAgICAgICAgICAgICAgLy8gYWRkaW5nIGFuIGV4dHJhIHNldFRpbWVvdXQgaWYgaXQncyB1bm5lY2Vzc2FyeSAoaS5lLiwgdGhlIGNvbXBsZXRpb24gaXMgYWxyZWFkeVxuICAgICAgICAgICAgICAgIC8vIGFzeW5jKSBzaW5jZSBzZXRUaW1lb3V0KC4uLiwgMCkgc3RpbGwgdGFrZXMgYWJvdXQgMTZtcyBvciBtb3JlIG9uIG1vc3QgYnJvd3NlcnMuXG4gICAgICAgICAgICAgICAgaWYgKGNvbXBsZXRlZEFzeW5jKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliYWJsZVsnbm90aWZ5U3Vic2NyaWJlcnMnXShkZWZpbml0aW9uKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJhYmxlWydub3RpZnlTdWJzY3JpYmVycyddKGRlZmluaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbXBsZXRlZEFzeW5jID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBzdWJzY3JpYmFibGUuc3Vic2NyaWJlKGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBiZWdpbkxvYWRpbmdDb21wb25lbnQoY29tcG9uZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICAgICAgZ2V0Rmlyc3RSZXN1bHRGcm9tTG9hZGVycygnZ2V0Q29uZmlnJywgW2NvbXBvbmVudE5hbWVdLCBmdW5jdGlvbihjb25maWcpIHtcbiAgICAgICAgICAgIGlmIChjb25maWcpIHtcbiAgICAgICAgICAgICAgICAvLyBXZSBoYXZlIGEgY29uZmlnLCBzbyBub3cgbG9hZCBpdHMgZGVmaW5pdGlvblxuICAgICAgICAgICAgICAgIGdldEZpcnN0UmVzdWx0RnJvbUxvYWRlcnMoJ2xvYWRDb21wb25lbnQnLCBbY29tcG9uZW50TmFtZSwgY29uZmlnXSwgZnVuY3Rpb24oZGVmaW5pdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhkZWZpbml0aW9uKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gVGhlIGNvbXBvbmVudCBoYXMgbm8gY29uZmlnIC0gaXQncyB1bmtub3duIHRvIGFsbCB0aGUgbG9hZGVycy5cbiAgICAgICAgICAgICAgICAvLyBOb3RlIHRoYXQgdGhpcyBpcyBub3QgYW4gZXJyb3IgKGUuZy4sIGEgbW9kdWxlIGxvYWRpbmcgZXJyb3IpIC0gdGhhdCB3b3VsZCBhYm9ydCB0aGVcbiAgICAgICAgICAgICAgICAvLyBwcm9jZXNzIGFuZCB0aGlzIGNhbGxiYWNrIHdvdWxkIG5vdCBydW4uIEZvciB0aGlzIGNhbGxiYWNrIHRvIHJ1biwgYWxsIGxvYWRlcnMgbXVzdFxuICAgICAgICAgICAgICAgIC8vIGhhdmUgY29uZmlybWVkIHRoZXkgZG9uJ3Qga25vdyBhYm91dCB0aGlzIGNvbXBvbmVudC5cbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Rmlyc3RSZXN1bHRGcm9tTG9hZGVycyhtZXRob2ROYW1lLCBhcmdzRXhjZXB0Q2FsbGJhY2ssIGNhbGxiYWNrLCBjYW5kaWRhdGVMb2FkZXJzKSB7XG4gICAgICAgIC8vIE9uIHRoZSBmaXJzdCBjYWxsIGluIHRoZSBzdGFjaywgc3RhcnQgd2l0aCB0aGUgZnVsbCBzZXQgb2YgbG9hZGVyc1xuICAgICAgICBpZiAoIWNhbmRpZGF0ZUxvYWRlcnMpIHtcbiAgICAgICAgICAgIGNhbmRpZGF0ZUxvYWRlcnMgPSBrby5jb21wb25lbnRzWydsb2FkZXJzJ10uc2xpY2UoMCk7IC8vIFVzZSBhIGNvcHksIGJlY2F1c2Ugd2UnbGwgYmUgbXV0YXRpbmcgdGhpcyBhcnJheVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVHJ5IHRoZSBuZXh0IGNhbmRpZGF0ZVxuICAgICAgICB2YXIgY3VycmVudENhbmRpZGF0ZUxvYWRlciA9IGNhbmRpZGF0ZUxvYWRlcnMuc2hpZnQoKTtcbiAgICAgICAgaWYgKGN1cnJlbnRDYW5kaWRhdGVMb2FkZXIpIHtcbiAgICAgICAgICAgIHZhciBtZXRob2RJbnN0YW5jZSA9IGN1cnJlbnRDYW5kaWRhdGVMb2FkZXJbbWV0aG9kTmFtZV07XG4gICAgICAgICAgICBpZiAobWV0aG9kSW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgd2FzQWJvcnRlZCA9IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBzeW5jaHJvbm91c1JldHVyblZhbHVlID0gbWV0aG9kSW5zdGFuY2UuYXBwbHkoY3VycmVudENhbmRpZGF0ZUxvYWRlciwgYXJnc0V4Y2VwdENhbGxiYWNrLmNvbmNhdChmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3YXNBYm9ydGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgY2FuZGlkYXRlIHJldHVybmVkIGEgdmFsdWUuIFVzZSBpdC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhyZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUcnkgdGhlIG5leHQgY2FuZGlkYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0Rmlyc3RSZXN1bHRGcm9tTG9hZGVycyhtZXRob2ROYW1lLCBhcmdzRXhjZXB0Q2FsbGJhY2ssIGNhbGxiYWNrLCBjYW5kaWRhdGVMb2FkZXJzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgLy8gQ3VycmVudGx5LCBsb2FkZXJzIG1heSBub3QgcmV0dXJuIGFueXRoaW5nIHN5bmNocm9ub3VzbHkuIFRoaXMgbGVhdmVzIG9wZW4gdGhlIHBvc3NpYmlsaXR5XG4gICAgICAgICAgICAgICAgLy8gdGhhdCB3ZSdsbCBleHRlbmQgdGhlIEFQSSB0byBzdXBwb3J0IHN5bmNocm9ub3VzIHJldHVybiB2YWx1ZXMgaW4gdGhlIGZ1dHVyZS4gSXQgd29uJ3QgYmVcbiAgICAgICAgICAgICAgICAvLyBhIGJyZWFraW5nIGNoYW5nZSwgYmVjYXVzZSBjdXJyZW50bHkgbm8gbG9hZGVyIGlzIGFsbG93ZWQgdG8gcmV0dXJuIGFueXRoaW5nIGV4Y2VwdCB1bmRlZmluZWQuXG4gICAgICAgICAgICAgICAgaWYgKHN5bmNocm9ub3VzUmV0dXJuVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB3YXNBYm9ydGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBNZXRob2QgdG8gc3VwcHJlc3MgZXhjZXB0aW9ucyB3aWxsIHJlbWFpbiB1bmRvY3VtZW50ZWQuIFRoaXMgaXMgb25seSB0byBrZWVwXG4gICAgICAgICAgICAgICAgICAgIC8vIEtPJ3Mgc3BlY3MgcnVubmluZyB0aWRpbHksIHNpbmNlIHdlIGNhbiBvYnNlcnZlIHRoZSBsb2FkaW5nIGdvdCBhYm9ydGVkIHdpdGhvdXRcbiAgICAgICAgICAgICAgICAgICAgLy8gaGF2aW5nIGV4Y2VwdGlvbnMgY2x1dHRlcmluZyB1cCB0aGUgY29uc29sZSB0b28uXG4gICAgICAgICAgICAgICAgICAgIGlmICghY3VycmVudENhbmRpZGF0ZUxvYWRlclsnc3VwcHJlc3NMb2FkZXJFeGNlcHRpb25zJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ29tcG9uZW50IGxvYWRlcnMgbXVzdCBzdXBwbHkgdmFsdWVzIGJ5IGludm9raW5nIHRoZSBjYWxsYmFjaywgbm90IGJ5IHJldHVybmluZyB2YWx1ZXMgc3luY2hyb25vdXNseS4nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBjYW5kaWRhdGUgZG9lc24ndCBoYXZlIHRoZSByZWxldmFudCBoYW5kbGVyLiBTeW5jaHJvbm91c2x5IG1vdmUgb24gdG8gdGhlIG5leHQgb25lLlxuICAgICAgICAgICAgICAgIGdldEZpcnN0UmVzdWx0RnJvbUxvYWRlcnMobWV0aG9kTmFtZSwgYXJnc0V4Y2VwdENhbGxiYWNrLCBjYWxsYmFjaywgY2FuZGlkYXRlTG9hZGVycyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBObyBjYW5kaWRhdGVzIHJldHVybmVkIGEgdmFsdWVcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVmZXJlbmNlIHRoZSBsb2FkZXJzIHZpYSBzdHJpbmcgbmFtZSBzbyBpdCdzIHBvc3NpYmxlIGZvciBkZXZlbG9wZXJzXG4gICAgLy8gdG8gcmVwbGFjZSB0aGUgd2hvbGUgYXJyYXkgYnkgYXNzaWduaW5nIHRvIGtvLmNvbXBvbmVudHMubG9hZGVyc1xuICAgIGtvLmNvbXBvbmVudHNbJ2xvYWRlcnMnXSA9IFtdO1xuXG4gICAga28uZXhwb3J0U3ltYm9sKCdjb21wb25lbnRzJywga28uY29tcG9uZW50cyk7XG4gICAga28uZXhwb3J0U3ltYm9sKCdjb21wb25lbnRzLmdldCcsIGtvLmNvbXBvbmVudHMuZ2V0KTtcbiAgICBrby5leHBvcnRTeW1ib2woJ2NvbXBvbmVudHMuY2xlYXJDYWNoZWREZWZpbml0aW9uJywga28uY29tcG9uZW50cy5jbGVhckNhY2hlZERlZmluaXRpb24pO1xufSkoKTtcbihmdW5jdGlvbih1bmRlZmluZWQpIHtcblxuICAgIC8vIFRoZSBkZWZhdWx0IGxvYWRlciBpcyByZXNwb25zaWJsZSBmb3IgdHdvIHRoaW5nczpcbiAgICAvLyAxLiBNYWludGFpbmluZyB0aGUgZGVmYXVsdCBpbi1tZW1vcnkgcmVnaXN0cnkgb2YgY29tcG9uZW50IGNvbmZpZ3VyYXRpb24gb2JqZWN0c1xuICAgIC8vICAgIChpLmUuLCB0aGUgdGhpbmcgeW91J3JlIHdyaXRpbmcgdG8gd2hlbiB5b3UgY2FsbCBrby5jb21wb25lbnRzLnJlZ2lzdGVyKHNvbWVOYW1lLCAuLi4pKVxuICAgIC8vIDIuIEFuc3dlcmluZyByZXF1ZXN0cyBmb3IgY29tcG9uZW50cyBieSBmZXRjaGluZyBjb25maWd1cmF0aW9uIG9iamVjdHNcbiAgICAvLyAgICBmcm9tIHRoYXQgZGVmYXVsdCBpbi1tZW1vcnkgcmVnaXN0cnkgYW5kIHJlc29sdmluZyB0aGVtIGludG8gc3RhbmRhcmRcbiAgICAvLyAgICBjb21wb25lbnQgZGVmaW5pdGlvbiBvYmplY3RzIChvZiB0aGUgZm9ybSB7IGNyZWF0ZVZpZXdNb2RlbDogLi4uLCB0ZW1wbGF0ZTogLi4uIH0pXG4gICAgLy8gQ3VzdG9tIGxvYWRlcnMgbWF5IG92ZXJyaWRlIGVpdGhlciBvZiB0aGVzZSBmYWNpbGl0aWVzLCBpLmUuLFxuICAgIC8vIDEuIFRvIHN1cHBseSBjb25maWd1cmF0aW9uIG9iamVjdHMgZnJvbSBzb21lIG90aGVyIHNvdXJjZSAoZS5nLiwgY29udmVudGlvbnMpXG4gICAgLy8gMi4gT3IsIHRvIHJlc29sdmUgY29uZmlndXJhdGlvbiBvYmplY3RzIGJ5IGxvYWRpbmcgdmlld21vZGVscy90ZW1wbGF0ZXMgdmlhIGFyYml0cmFyeSBsb2dpYy5cblxuICAgIHZhciBkZWZhdWx0Q29uZmlnUmVnaXN0cnkgPSB7fTtcblxuICAgIGtvLmNvbXBvbmVudHMucmVnaXN0ZXIgPSBmdW5jdGlvbihjb21wb25lbnROYW1lLCBjb25maWcpIHtcbiAgICAgICAgaWYgKCFjb25maWcpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb25maWd1cmF0aW9uIGZvciAnICsgY29tcG9uZW50TmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoa28uY29tcG9uZW50cy5pc1JlZ2lzdGVyZWQoY29tcG9uZW50TmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ29tcG9uZW50ICcgKyBjb21wb25lbnROYW1lICsgJyBpcyBhbHJlYWR5IHJlZ2lzdGVyZWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlZmF1bHRDb25maWdSZWdpc3RyeVtjb21wb25lbnROYW1lXSA9IGNvbmZpZztcbiAgICB9XG5cbiAgICBrby5jb21wb25lbnRzLmlzUmVnaXN0ZXJlZCA9IGZ1bmN0aW9uKGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudE5hbWUgaW4gZGVmYXVsdENvbmZpZ1JlZ2lzdHJ5O1xuICAgIH1cblxuICAgIGtvLmNvbXBvbmVudHMudW5yZWdpc3RlciA9IGZ1bmN0aW9uKGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgZGVsZXRlIGRlZmF1bHRDb25maWdSZWdpc3RyeVtjb21wb25lbnROYW1lXTtcbiAgICAgICAga28uY29tcG9uZW50cy5jbGVhckNhY2hlZERlZmluaXRpb24oY29tcG9uZW50TmFtZSk7XG4gICAgfVxuXG4gICAga28uY29tcG9uZW50cy5kZWZhdWx0TG9hZGVyID0ge1xuICAgICAgICAnZ2V0Q29uZmlnJzogZnVuY3Rpb24oY29tcG9uZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBkZWZhdWx0Q29uZmlnUmVnaXN0cnkuaGFzT3duUHJvcGVydHkoY29tcG9uZW50TmFtZSlcbiAgICAgICAgICAgICAgICA/IGRlZmF1bHRDb25maWdSZWdpc3RyeVtjb21wb25lbnROYW1lXVxuICAgICAgICAgICAgICAgIDogbnVsbDtcbiAgICAgICAgICAgIGNhbGxiYWNrKHJlc3VsdCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJ2xvYWRDb21wb25lbnQnOiBmdW5jdGlvbihjb21wb25lbnROYW1lLCBjb25maWcsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB2YXIgZXJyb3JDYWxsYmFjayA9IG1ha2VFcnJvckNhbGxiYWNrKGNvbXBvbmVudE5hbWUpO1xuICAgICAgICAgICAgcG9zc2libHlHZXRDb25maWdGcm9tQW1kKGVycm9yQ2FsbGJhY2ssIGNvbmZpZywgZnVuY3Rpb24obG9hZGVkQ29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZUNvbmZpZyhjb21wb25lbnROYW1lLCBlcnJvckNhbGxiYWNrLCBsb2FkZWRDb25maWcsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgICdsb2FkVGVtcGxhdGUnOiBmdW5jdGlvbihjb21wb25lbnROYW1lLCB0ZW1wbGF0ZUNvbmZpZywgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHJlc29sdmVUZW1wbGF0ZShtYWtlRXJyb3JDYWxsYmFjayhjb21wb25lbnROYW1lKSwgdGVtcGxhdGVDb25maWcsIGNhbGxiYWNrKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnbG9hZFZpZXdNb2RlbCc6IGZ1bmN0aW9uKGNvbXBvbmVudE5hbWUsIHZpZXdNb2RlbENvbmZpZywgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHJlc29sdmVWaWV3TW9kZWwobWFrZUVycm9yQ2FsbGJhY2soY29tcG9uZW50TmFtZSksIHZpZXdNb2RlbENvbmZpZywgY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBjcmVhdGVWaWV3TW9kZWxLZXkgPSAnY3JlYXRlVmlld01vZGVsJztcblxuICAgIC8vIFRha2VzIGEgY29uZmlnIG9iamVjdCBvZiB0aGUgZm9ybSB7IHRlbXBsYXRlOiAuLi4sIHZpZXdNb2RlbDogLi4uIH0sIGFuZCBhc3luY2hyb25vdXNseSBjb252ZXJ0IGl0XG4gICAgLy8gaW50byB0aGUgc3RhbmRhcmQgY29tcG9uZW50IGRlZmluaXRpb24gZm9ybWF0OlxuICAgIC8vICAgIHsgdGVtcGxhdGU6IDxBcnJheU9mRG9tTm9kZXM+LCBjcmVhdGVWaWV3TW9kZWw6IGZ1bmN0aW9uKHBhcmFtcywgY29tcG9uZW50SW5mbykgeyAuLi4gfSB9LlxuICAgIC8vIFNpbmNlIGJvdGggdGVtcGxhdGUgYW5kIHZpZXdNb2RlbCBtYXkgbmVlZCB0byBiZSByZXNvbHZlZCBhc3luY2hyb25vdXNseSwgYm90aCB0YXNrcyBhcmUgcGVyZm9ybWVkXG4gICAgLy8gaW4gcGFyYWxsZWwsIGFuZCB0aGUgcmVzdWx0cyBqb2luZWQgd2hlbiBib3RoIGFyZSByZWFkeS4gV2UgZG9uJ3QgZGVwZW5kIG9uIGFueSBwcm9taXNlcyBpbmZyYXN0cnVjdHVyZSxcbiAgICAvLyBzbyB0aGlzIGlzIGltcGxlbWVudGVkIG1hbnVhbGx5IGJlbG93LlxuICAgIGZ1bmN0aW9uIHJlc29sdmVDb25maWcoY29tcG9uZW50TmFtZSwgZXJyb3JDYWxsYmFjaywgY29uZmlnLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgcmVzdWx0ID0ge30sXG4gICAgICAgICAgICBtYWtlQ2FsbEJhY2tXaGVuWmVybyA9IDIsXG4gICAgICAgICAgICB0cnlJc3N1ZUNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKC0tbWFrZUNhbGxCYWNrV2hlblplcm8gPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2socmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGVDb25maWcgPSBjb25maWdbJ3RlbXBsYXRlJ10sXG4gICAgICAgICAgICB2aWV3TW9kZWxDb25maWcgPSBjb25maWdbJ3ZpZXdNb2RlbCddO1xuXG4gICAgICAgIGlmICh0ZW1wbGF0ZUNvbmZpZykge1xuICAgICAgICAgICAgcG9zc2libHlHZXRDb25maWdGcm9tQW1kKGVycm9yQ2FsbGJhY2ssIHRlbXBsYXRlQ29uZmlnLCBmdW5jdGlvbihsb2FkZWRDb25maWcpIHtcbiAgICAgICAgICAgICAgICBrby5jb21wb25lbnRzLl9nZXRGaXJzdFJlc3VsdEZyb21Mb2FkZXJzKCdsb2FkVGVtcGxhdGUnLCBbY29tcG9uZW50TmFtZSwgbG9hZGVkQ29uZmlnXSwgZnVuY3Rpb24ocmVzb2x2ZWRUZW1wbGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRbJ3RlbXBsYXRlJ10gPSByZXNvbHZlZFRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICB0cnlJc3N1ZUNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRyeUlzc3VlQ2FsbGJhY2soKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2aWV3TW9kZWxDb25maWcpIHtcbiAgICAgICAgICAgIHBvc3NpYmx5R2V0Q29uZmlnRnJvbUFtZChlcnJvckNhbGxiYWNrLCB2aWV3TW9kZWxDb25maWcsIGZ1bmN0aW9uKGxvYWRlZENvbmZpZykge1xuICAgICAgICAgICAgICAgIGtvLmNvbXBvbmVudHMuX2dldEZpcnN0UmVzdWx0RnJvbUxvYWRlcnMoJ2xvYWRWaWV3TW9kZWwnLCBbY29tcG9uZW50TmFtZSwgbG9hZGVkQ29uZmlnXSwgZnVuY3Rpb24ocmVzb2x2ZWRWaWV3TW9kZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2NyZWF0ZVZpZXdNb2RlbEtleV0gPSByZXNvbHZlZFZpZXdNb2RlbDtcbiAgICAgICAgICAgICAgICAgICAgdHJ5SXNzdWVDYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cnlJc3N1ZUNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXNvbHZlVGVtcGxhdGUoZXJyb3JDYWxsYmFjaywgdGVtcGxhdGVDb25maWcsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGVtcGxhdGVDb25maWcgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAvLyBNYXJrdXAgLSBwYXJzZSBpdFxuICAgICAgICAgICAgY2FsbGJhY2soa28udXRpbHMucGFyc2VIdG1sRnJhZ21lbnQodGVtcGxhdGVDb25maWcpKTtcbiAgICAgICAgfSBlbHNlIGlmICh0ZW1wbGF0ZUNvbmZpZyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAvLyBBc3N1bWUgYWxyZWFkeSBhbiBhcnJheSBvZiBET00gbm9kZXMgLSBwYXNzIHRocm91Z2ggdW5jaGFuZ2VkXG4gICAgICAgICAgICBjYWxsYmFjayh0ZW1wbGF0ZUNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNEb2N1bWVudEZyYWdtZW50KHRlbXBsYXRlQ29uZmlnKSkge1xuICAgICAgICAgICAgLy8gRG9jdW1lbnQgZnJhZ21lbnQgLSB1c2UgaXRzIGNoaWxkIG5vZGVzXG4gICAgICAgICAgICBjYWxsYmFjayhrby51dGlscy5tYWtlQXJyYXkodGVtcGxhdGVDb25maWcuY2hpbGROb2RlcykpO1xuICAgICAgICB9IGVsc2UgaWYgKHRlbXBsYXRlQ29uZmlnWydlbGVtZW50J10pIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gdGVtcGxhdGVDb25maWdbJ2VsZW1lbnQnXTtcbiAgICAgICAgICAgIGlmIChpc0RvbUVsZW1lbnQoZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICAvLyBFbGVtZW50IGluc3RhbmNlIC0gY29weSBpdHMgY2hpbGQgbm9kZXNcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhjbG9uZU5vZGVzRnJvbVRlbXBsYXRlU291cmNlRWxlbWVudChlbGVtZW50KSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIC8vIEVsZW1lbnQgSUQgLSBmaW5kIGl0LCB0aGVuIGNvcHkgaXRzIGNoaWxkIG5vZGVzXG4gICAgICAgICAgICAgICAgdmFyIGVsZW1JbnN0YW5jZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIGlmIChlbGVtSW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soY2xvbmVOb2Rlc0Zyb21UZW1wbGF0ZVNvdXJjZUVsZW1lbnQoZWxlbUluc3RhbmNlKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JDYWxsYmFjaygnQ2Fubm90IGZpbmQgZWxlbWVudCB3aXRoIElEICcgKyBlbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVycm9yQ2FsbGJhY2soJ1Vua25vd24gZWxlbWVudCB0eXBlOiAnICsgZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlcnJvckNhbGxiYWNrKCdVbmtub3duIHRlbXBsYXRlIHZhbHVlOiAnICsgdGVtcGxhdGVDb25maWcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzb2x2ZVZpZXdNb2RlbChlcnJvckNhbGxiYWNrLCB2aWV3TW9kZWxDb25maWcsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygdmlld01vZGVsQ29uZmlnID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAvLyBDb25zdHJ1Y3RvciAtIGNvbnZlcnQgdG8gc3RhbmRhcmQgZmFjdG9yeSBmdW5jdGlvbiBmb3JtYXRcbiAgICAgICAgICAgIC8vIEJ5IGRlc2lnbiwgdGhpcyBkb2VzICpub3QqIHN1cHBseSBjb21wb25lbnRJbmZvIHRvIHRoZSBjb25zdHJ1Y3RvciwgYXMgdGhlIGludGVudCBpcyB0aGF0XG4gICAgICAgICAgICAvLyBjb21wb25lbnRJbmZvIGNvbnRhaW5zIG5vbi12aWV3bW9kZWwgZGF0YSAoZS5nLiwgdGhlIGNvbXBvbmVudCdzIGVsZW1lbnQpIHRoYXQgc2hvdWxkIG9ubHlcbiAgICAgICAgICAgIC8vIGJlIHVzZWQgaW4gZmFjdG9yeSBmdW5jdGlvbnMsIG5vdCB2aWV3bW9kZWwgY29uc3RydWN0b3JzLlxuICAgICAgICAgICAgY2FsbGJhY2soZnVuY3Rpb24gKHBhcmFtcyAvKiwgY29tcG9uZW50SW5mbyAqLykge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgdmlld01vZGVsQ29uZmlnKHBhcmFtcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygdmlld01vZGVsQ29uZmlnW2NyZWF0ZVZpZXdNb2RlbEtleV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIC8vIEFscmVhZHkgYSBmYWN0b3J5IGZ1bmN0aW9uIC0gdXNlIGl0IGFzLWlzXG4gICAgICAgICAgICBjYWxsYmFjayh2aWV3TW9kZWxDb25maWdbY3JlYXRlVmlld01vZGVsS2V5XSk7XG4gICAgICAgIH0gZWxzZSBpZiAoJ2luc3RhbmNlJyBpbiB2aWV3TW9kZWxDb25maWcpIHtcbiAgICAgICAgICAgIC8vIEZpeGVkIG9iamVjdCBpbnN0YW5jZSAtIHByb21vdGUgdG8gY3JlYXRlVmlld01vZGVsIGZvcm1hdCBmb3IgQVBJIGNvbnNpc3RlbmN5XG4gICAgICAgICAgICB2YXIgZml4ZWRJbnN0YW5jZSA9IHZpZXdNb2RlbENvbmZpZ1snaW5zdGFuY2UnXTtcbiAgICAgICAgICAgIGNhbGxiYWNrKGZ1bmN0aW9uIChwYXJhbXMsIGNvbXBvbmVudEluZm8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZml4ZWRJbnN0YW5jZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKCd2aWV3TW9kZWwnIGluIHZpZXdNb2RlbENvbmZpZykge1xuICAgICAgICAgICAgLy8gUmVzb2x2ZWQgQU1EIG1vZHVsZSB3aG9zZSB2YWx1ZSBpcyBvZiB0aGUgZm9ybSB7IHZpZXdNb2RlbDogLi4uIH1cbiAgICAgICAgICAgIHJlc29sdmVWaWV3TW9kZWwoZXJyb3JDYWxsYmFjaywgdmlld01vZGVsQ29uZmlnWyd2aWV3TW9kZWwnXSwgY2FsbGJhY2spO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXJyb3JDYWxsYmFjaygnVW5rbm93biB2aWV3TW9kZWwgdmFsdWU6ICcgKyB2aWV3TW9kZWxDb25maWcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xvbmVOb2Rlc0Zyb21UZW1wbGF0ZVNvdXJjZUVsZW1lbnQoZWxlbUluc3RhbmNlKSB7XG4gICAgICAgIHN3aXRjaCAoa28udXRpbHMudGFnTmFtZUxvd2VyKGVsZW1JbnN0YW5jZSkpIHtcbiAgICAgICAgICAgIGNhc2UgJ3NjcmlwdCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtvLnV0aWxzLnBhcnNlSHRtbEZyYWdtZW50KGVsZW1JbnN0YW5jZS50ZXh0KTtcbiAgICAgICAgICAgIGNhc2UgJ3RleHRhcmVhJzpcbiAgICAgICAgICAgICAgICByZXR1cm4ga28udXRpbHMucGFyc2VIdG1sRnJhZ21lbnQoZWxlbUluc3RhbmNlLnZhbHVlKTtcbiAgICAgICAgICAgIGNhc2UgJ3RlbXBsYXRlJzpcbiAgICAgICAgICAgICAgICAvLyBGb3IgYnJvd3NlcnMgd2l0aCBwcm9wZXIgPHRlbXBsYXRlPiBlbGVtZW50IHN1cHBvcnQgKGkuZS4sIHdoZXJlIHRoZSAuY29udGVudCBwcm9wZXJ0eVxuICAgICAgICAgICAgICAgIC8vIGdpdmVzIGEgZG9jdW1lbnQgZnJhZ21lbnQpLCB1c2UgdGhhdCBkb2N1bWVudCBmcmFnbWVudC5cbiAgICAgICAgICAgICAgICBpZiAoaXNEb2N1bWVudEZyYWdtZW50KGVsZW1JbnN0YW5jZS5jb250ZW50KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga28udXRpbHMuY2xvbmVOb2RlcyhlbGVtSW5zdGFuY2UuY29udGVudC5jaGlsZE5vZGVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZWd1bGFyIGVsZW1lbnRzIHN1Y2ggYXMgPGRpdj4sIGFuZCA8dGVtcGxhdGU+IGVsZW1lbnRzIG9uIG9sZCBicm93c2VycyB0aGF0IGRvbid0IHJlYWxseVxuICAgICAgICAvLyB1bmRlcnN0YW5kIDx0ZW1wbGF0ZT4gYW5kIGp1c3QgdHJlYXQgaXQgYXMgYSByZWd1bGFyIGNvbnRhaW5lclxuICAgICAgICByZXR1cm4ga28udXRpbHMuY2xvbmVOb2RlcyhlbGVtSW5zdGFuY2UuY2hpbGROb2Rlcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNEb21FbGVtZW50KG9iaikge1xuICAgICAgICBpZiAod2luZG93WydIVE1MRWxlbWVudCddKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqICYmIG9iai50YWdOYW1lICYmIG9iai5ub2RlVHlwZSA9PT0gMTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRG9jdW1lbnRGcmFnbWVudChvYmopIHtcbiAgICAgICAgaWYgKHdpbmRvd1snRG9jdW1lbnRGcmFnbWVudCddKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBvYmogJiYgb2JqLm5vZGVUeXBlID09PSAxMTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBvc3NpYmx5R2V0Q29uZmlnRnJvbUFtZChlcnJvckNhbGxiYWNrLCBjb25maWcsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnWydyZXF1aXJlJ10gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAvLyBUaGUgY29uZmlnIGlzIHRoZSB2YWx1ZSBvZiBhbiBBTUQgbW9kdWxlXG4gICAgICAgICAgICBpZiAocmVxdWlyZSB8fCB3aW5kb3dbJ3JlcXVpcmUnXSkge1xuICAgICAgICAgICAgICAgIChyZXF1aXJlIHx8IHdpbmRvd1sncmVxdWlyZSddKShbY29uZmlnWydyZXF1aXJlJ11dLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVycm9yQ2FsbGJhY2soJ1VzZXMgcmVxdWlyZSwgYnV0IG5vIEFNRCBsb2FkZXIgaXMgcHJlc2VudCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FsbGJhY2soY29uZmlnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VFcnJvckNhbGxiYWNrKGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbXBvbmVudCBcXCcnICsgY29tcG9uZW50TmFtZSArICdcXCc6ICcgKyBtZXNzYWdlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBrby5leHBvcnRTeW1ib2woJ2NvbXBvbmVudHMucmVnaXN0ZXInLCBrby5jb21wb25lbnRzLnJlZ2lzdGVyKTtcbiAgICBrby5leHBvcnRTeW1ib2woJ2NvbXBvbmVudHMuaXNSZWdpc3RlcmVkJywga28uY29tcG9uZW50cy5pc1JlZ2lzdGVyZWQpO1xuICAgIGtvLmV4cG9ydFN5bWJvbCgnY29tcG9uZW50cy51bnJlZ2lzdGVyJywga28uY29tcG9uZW50cy51bnJlZ2lzdGVyKTtcblxuICAgIC8vIEV4cG9zZSB0aGUgZGVmYXVsdCBsb2FkZXIgc28gdGhhdCBkZXZlbG9wZXJzIGNhbiBkaXJlY3RseSBhc2sgaXQgZm9yIGNvbmZpZ3VyYXRpb25cbiAgICAvLyBvciB0byByZXNvbHZlIGNvbmZpZ3VyYXRpb25cbiAgICBrby5leHBvcnRTeW1ib2woJ2NvbXBvbmVudHMuZGVmYXVsdExvYWRlcicsIGtvLmNvbXBvbmVudHMuZGVmYXVsdExvYWRlcik7XG5cbiAgICAvLyBCeSBkZWZhdWx0LCB0aGUgZGVmYXVsdCBsb2FkZXIgaXMgdGhlIG9ubHkgcmVnaXN0ZXJlZCBjb21wb25lbnQgbG9hZGVyXG4gICAga28uY29tcG9uZW50c1snbG9hZGVycyddLnB1c2goa28uY29tcG9uZW50cy5kZWZhdWx0TG9hZGVyKTtcblxuICAgIC8vIFByaXZhdGVseSBleHBvc2UgdGhlIHVuZGVybHlpbmcgY29uZmlnIHJlZ2lzdHJ5IGZvciB1c2UgaW4gb2xkLUlFIHNoaW1cbiAgICBrby5jb21wb25lbnRzLl9hbGxSZWdpc3RlcmVkQ29tcG9uZW50cyA9IGRlZmF1bHRDb25maWdSZWdpc3RyeTtcbn0pKCk7XG4oZnVuY3Rpb24gKHVuZGVmaW5lZCkge1xuICAgIC8vIE92ZXJyaWRhYmxlIEFQSSBmb3IgZGV0ZXJtaW5pbmcgd2hpY2ggY29tcG9uZW50IG5hbWUgYXBwbGllcyB0byBhIGdpdmVuIG5vZGUuIEJ5IG92ZXJyaWRpbmcgdGhpcyxcbiAgICAvLyB5b3UgY2FuIGZvciBleGFtcGxlIG1hcCBzcGVjaWZpYyB0YWdOYW1lcyB0byBjb21wb25lbnRzIHRoYXQgYXJlIG5vdCBwcmVyZWdpc3RlcmVkLlxuICAgIGtvLmNvbXBvbmVudHNbJ2dldENvbXBvbmVudE5hbWVGb3JOb2RlJ10gPSBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIHZhciB0YWdOYW1lTG93ZXIgPSBrby51dGlscy50YWdOYW1lTG93ZXIobm9kZSk7XG4gICAgICAgIHJldHVybiBrby5jb21wb25lbnRzLmlzUmVnaXN0ZXJlZCh0YWdOYW1lTG93ZXIpICYmIHRhZ05hbWVMb3dlcjtcbiAgICB9O1xuXG4gICAga28uY29tcG9uZW50cy5hZGRCaW5kaW5nc0ZvckN1c3RvbUVsZW1lbnQgPSBmdW5jdGlvbihhbGxCaW5kaW5ncywgbm9kZSwgYmluZGluZ0NvbnRleHQsIHZhbHVlQWNjZXNzb3JzKSB7XG4gICAgICAgIC8vIERldGVybWluZSBpZiBpdCdzIHJlYWxseSBhIGN1c3RvbSBlbGVtZW50IG1hdGNoaW5nIGEgY29tcG9uZW50XG4gICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgICB2YXIgY29tcG9uZW50TmFtZSA9IGtvLmNvbXBvbmVudHNbJ2dldENvbXBvbmVudE5hbWVGb3JOb2RlJ10obm9kZSk7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50TmFtZSkge1xuICAgICAgICAgICAgICAgIC8vIEl0IGRvZXMgcmVwcmVzZW50IGEgY29tcG9uZW50LCBzbyBhZGQgYSBjb21wb25lbnQgYmluZGluZyBmb3IgaXRcbiAgICAgICAgICAgICAgICBhbGxCaW5kaW5ncyA9IGFsbEJpbmRpbmdzIHx8IHt9O1xuXG4gICAgICAgICAgICAgICAgaWYgKGFsbEJpbmRpbmdzWydjb21wb25lbnQnXSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBBdm9pZCBzaWxlbnRseSBvdmVyd3JpdGluZyBzb21lIG90aGVyICdjb21wb25lbnQnIGJpbmRpbmcgdGhhdCBtYXkgYWxyZWFkeSBiZSBvbiB0aGUgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCB1c2UgdGhlIFwiY29tcG9uZW50XCIgYmluZGluZyBvbiBhIGN1c3RvbSBlbGVtZW50IG1hdGNoaW5nIGEgY29tcG9uZW50Jyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGNvbXBvbmVudEJpbmRpbmdWYWx1ZSA9IHsgJ25hbWUnOiBjb21wb25lbnROYW1lLCAncGFyYW1zJzogZ2V0Q29tcG9uZW50UGFyYW1zRnJvbUN1c3RvbUVsZW1lbnQobm9kZSwgYmluZGluZ0NvbnRleHQpIH07XG5cbiAgICAgICAgICAgICAgICBhbGxCaW5kaW5nc1snY29tcG9uZW50J10gPSB2YWx1ZUFjY2Vzc29yc1xuICAgICAgICAgICAgICAgICAgICA/IGZ1bmN0aW9uKCkgeyByZXR1cm4gY29tcG9uZW50QmluZGluZ1ZhbHVlOyB9XG4gICAgICAgICAgICAgICAgICAgIDogY29tcG9uZW50QmluZGluZ1ZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFsbEJpbmRpbmdzO1xuICAgIH1cblxuICAgIHZhciBuYXRpdmVCaW5kaW5nUHJvdmlkZXJJbnN0YW5jZSA9IG5ldyBrby5iaW5kaW5nUHJvdmlkZXIoKTtcblxuICAgIGZ1bmN0aW9uIGdldENvbXBvbmVudFBhcmFtc0Zyb21DdXN0b21FbGVtZW50KGVsZW0sIGJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgIHZhciBwYXJhbXNBdHRyaWJ1dGUgPSBlbGVtLmdldEF0dHJpYnV0ZSgncGFyYW1zJyk7XG5cbiAgICAgICAgaWYgKHBhcmFtc0F0dHJpYnV0ZSkge1xuICAgICAgICAgICAgdmFyIHBhcmFtcyA9IG5hdGl2ZUJpbmRpbmdQcm92aWRlckluc3RhbmNlWydwYXJzZUJpbmRpbmdzU3RyaW5nJ10ocGFyYW1zQXR0cmlidXRlLCBiaW5kaW5nQ29udGV4dCwgZWxlbSwgeyAndmFsdWVBY2Nlc3NvcnMnOiB0cnVlLCAnYmluZGluZ1BhcmFtcyc6IHRydWUgfSksXG4gICAgICAgICAgICAgICAgcmF3UGFyYW1Db21wdXRlZFZhbHVlcyA9IGtvLnV0aWxzLm9iamVjdE1hcChwYXJhbXMsIGZ1bmN0aW9uKHBhcmFtVmFsdWUsIHBhcmFtTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga28uY29tcHV0ZWQocGFyYW1WYWx1ZSwgbnVsbCwgeyBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IGVsZW0gfSk7XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0ga28udXRpbHMub2JqZWN0TWFwKHJhd1BhcmFtQ29tcHV0ZWRWYWx1ZXMsIGZ1bmN0aW9uKHBhcmFtVmFsdWVDb21wdXRlZCwgcGFyYW1OYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIERvZXMgdGhlIGV2YWx1YXRpb24gb2YgdGhlIHBhcmFtZXRlciB2YWx1ZSB1bndyYXAgYW55IG9ic2VydmFibGVzP1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXBhcmFtVmFsdWVDb21wdXRlZC5pc0FjdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBObyBpdCBkb2Vzbid0LCBzbyB0aGVyZSdzIG5vIG5lZWQgZm9yIGFueSBjb21wdXRlZCB3cmFwcGVyLiBKdXN0IHBhc3MgdGhyb3VnaCB0aGUgc3VwcGxpZWQgdmFsdWUgZGlyZWN0bHkuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBFeGFtcGxlOiBcInNvbWVWYWw6IGZpcnN0TmFtZSwgYWdlOiAxMjNcIiAod2hldGhlciBvciBub3QgZmlyc3ROYW1lIGlzIGFuIG9ic2VydmFibGUvY29tcHV0ZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyYW1WYWx1ZUNvbXB1dGVkLnBlZWsoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFllcyBpdCBkb2VzLiBTdXBwbHkgYSBjb21wdXRlZCBwcm9wZXJ0eSB0aGF0IHVud3JhcHMgYm90aCB0aGUgb3V0ZXIgKGJpbmRpbmcgZXhwcmVzc2lvbilcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxldmVsIG9mIG9ic2VydmFiaWxpdHksIGFuZCBhbnkgaW5uZXIgKHJlc3VsdGluZyBtb2RlbCB2YWx1ZSkgbGV2ZWwgb2Ygb2JzZXJ2YWJpbGl0eS5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgbWVhbnMgdGhlIGNvbXBvbmVudCBkb2Vzbid0IGhhdmUgdG8gd29ycnkgYWJvdXQgbXVsdGlwbGUgdW53cmFwcGluZy5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBrby5jb21wdXRlZChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShwYXJhbVZhbHVlQ29tcHV0ZWQoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBudWxsLCB7IGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZDogZWxlbSB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBHaXZlIGFjY2VzcyB0byB0aGUgcmF3IGNvbXB1dGVkcywgYXMgbG9uZyBhcyB0aGF0IHdvdWxkbid0IG92ZXJ3cml0ZSBhbnkgY3VzdG9tIHBhcmFtIGFsc28gY2FsbGVkICckcmF3J1xuICAgICAgICAgICAgLy8gVGhpcyBpcyBpbiBjYXNlIHRoZSBkZXZlbG9wZXIgd2FudHMgdG8gcmVhY3QgdG8gb3V0ZXIgKGJpbmRpbmcpIG9ic2VydmFiaWxpdHkgc2VwYXJhdGVseSBmcm9tIGlubmVyXG4gICAgICAgICAgICAvLyAobW9kZWwgdmFsdWUpIG9ic2VydmFiaWxpdHksIG9yIGluIGNhc2UgdGhlIG1vZGVsIHZhbHVlIG9ic2VydmFibGUgaGFzIHN1Ym9ic2VydmFibGVzLlxuICAgICAgICAgICAgaWYgKCFyZXN1bHQuaGFzT3duUHJvcGVydHkoJyRyYXcnKSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdFsnJHJhdyddID0gcmF3UGFyYW1Db21wdXRlZFZhbHVlcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEZvciBjb25zaXN0ZW5jeSwgYWJzZW5jZSBvZiBhIFwicGFyYW1zXCIgYXR0cmlidXRlIGlzIHRyZWF0ZWQgdGhlIHNhbWUgYXMgdGhlIHByZXNlbmNlIG9mXG4gICAgICAgICAgICAvLyBhbnkgZW1wdHkgb25lLiBPdGhlcndpc2UgY29tcG9uZW50IHZpZXdtb2RlbHMgbmVlZCBzcGVjaWFsIGNvZGUgdG8gY2hlY2sgd2hldGhlciBvciBub3RcbiAgICAgICAgICAgIC8vICdwYXJhbXMnIG9yICdwYXJhbXMuJHJhdycgaXMgbnVsbC91bmRlZmluZWQgYmVmb3JlIHJlYWRpbmcgc3VicHJvcGVydGllcywgd2hpY2ggaXMgYW5ub3lpbmcuXG4gICAgICAgICAgICByZXR1cm4geyAnJHJhdyc6IHt9IH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIENvbXBhdGliaWxpdHkgY29kZSBmb3Igb2xkZXIgKHByZS1IVE1MNSkgSUUgYnJvd3NlcnNcblxuICAgIGlmIChrby51dGlscy5pZVZlcnNpb24gPCA5KSB7XG4gICAgICAgIC8vIFdoZW5ldmVyIHlvdSBwcmVyZWdpc3RlciBhIGNvbXBvbmVudCwgZW5hYmxlIGl0IGFzIGEgY3VzdG9tIGVsZW1lbnQgaW4gdGhlIGN1cnJlbnQgZG9jdW1lbnRcbiAgICAgICAga28uY29tcG9uZW50c1sncmVnaXN0ZXInXSA9IChmdW5jdGlvbihvcmlnaW5hbEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oY29tcG9uZW50TmFtZSkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoY29tcG9uZW50TmFtZSk7IC8vIEFsbG93cyBJRTw5IHRvIHBhcnNlIG1hcmt1cCBjb250YWluaW5nIHRoZSBjdXN0b20gZWxlbWVudFxuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEZ1bmN0aW9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKGtvLmNvbXBvbmVudHNbJ3JlZ2lzdGVyJ10pO1xuXG4gICAgICAgIC8vIFdoZW5ldmVyIHlvdSBjcmVhdGUgYSBkb2N1bWVudCBmcmFnbWVudCwgZW5hYmxlIGFsbCBwcmVyZWdpc3RlcmVkIGNvbXBvbmVudCBuYW1lcyBhcyBjdXN0b20gZWxlbWVudHNcbiAgICAgICAgLy8gVGhpcyBpcyBuZWVkZWQgdG8gbWFrZSBpbm5lclNoaXYvalF1ZXJ5IEhUTUwgcGFyc2luZyBjb3JyZWN0bHkgaGFuZGxlIHRoZSBjdXN0b20gZWxlbWVudHNcbiAgICAgICAgZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCA9IChmdW5jdGlvbihvcmlnaW5hbEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld0RvY0ZyYWcgPSBvcmlnaW5hbEZ1bmN0aW9uKCksXG4gICAgICAgICAgICAgICAgICAgIGFsbENvbXBvbmVudHMgPSBrby5jb21wb25lbnRzLl9hbGxSZWdpc3RlcmVkQ29tcG9uZW50cztcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBjb21wb25lbnROYW1lIGluIGFsbENvbXBvbmVudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFsbENvbXBvbmVudHMuaGFzT3duUHJvcGVydHkoY29tcG9uZW50TmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0RvY0ZyYWcuY3JlYXRlRWxlbWVudChjb21wb25lbnROYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3RG9jRnJhZztcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pKGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQpO1xuICAgIH1cbn0pKCk7KGZ1bmN0aW9uKHVuZGVmaW5lZCkge1xuXG4gICAgdmFyIGNvbXBvbmVudExvYWRpbmdPcGVyYXRpb25VbmlxdWVJZCA9IDA7XG5cbiAgICBrby5iaW5kaW5nSGFuZGxlcnNbJ2NvbXBvbmVudCddID0ge1xuICAgICAgICAnaW5pdCc6IGZ1bmN0aW9uKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGlnbm9yZWQxLCBpZ25vcmVkMiwgYmluZGluZ0NvbnRleHQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50Vmlld01vZGVsLFxuICAgICAgICAgICAgICAgIGN1cnJlbnRMb2FkaW5nT3BlcmF0aW9uSWQsXG4gICAgICAgICAgICAgICAgZGlzcG9zZUFzc29jaWF0ZWRDb21wb25lbnRWaWV3TW9kZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW50Vmlld01vZGVsRGlzcG9zZSA9IGN1cnJlbnRWaWV3TW9kZWwgJiYgY3VycmVudFZpZXdNb2RlbFsnZGlzcG9zZSddO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGN1cnJlbnRWaWV3TW9kZWxEaXNwb3NlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50Vmlld01vZGVsRGlzcG9zZS5jYWxsKGN1cnJlbnRWaWV3TW9kZWwpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQW55IGluLWZsaWdodCBsb2FkaW5nIG9wZXJhdGlvbiBpcyBubyBsb25nZXIgcmVsZXZhbnQsIHNvIG1ha2Ugc3VyZSB3ZSBpZ25vcmUgaXRzIGNvbXBsZXRpb25cbiAgICAgICAgICAgICAgICAgICAgY3VycmVudExvYWRpbmdPcGVyYXRpb25JZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhlbGVtZW50LCBkaXNwb3NlQXNzb2NpYXRlZENvbXBvbmVudFZpZXdNb2RlbCk7XG5cbiAgICAgICAgICAgIGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSksXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudFBhcmFtcztcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudE5hbWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnROYW1lID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZVsnbmFtZSddKTtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50UGFyYW1zID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZVsncGFyYW1zJ10pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghY29tcG9uZW50TmFtZSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGNvbXBvbmVudCBuYW1lIHNwZWNpZmllZCcpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBsb2FkaW5nT3BlcmF0aW9uSWQgPSBjdXJyZW50TG9hZGluZ09wZXJhdGlvbklkID0gKytjb21wb25lbnRMb2FkaW5nT3BlcmF0aW9uVW5pcXVlSWQ7XG4gICAgICAgICAgICAgICAga28uY29tcG9uZW50cy5nZXQoY29tcG9uZW50TmFtZSwgZnVuY3Rpb24oY29tcG9uZW50RGVmaW5pdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGlzIGlzIG5vdCB0aGUgY3VycmVudCBsb2FkIG9wZXJhdGlvbiBmb3IgdGhpcyBlbGVtZW50LCBpZ25vcmUgaXQuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50TG9hZGluZ09wZXJhdGlvbklkICE9PSBsb2FkaW5nT3BlcmF0aW9uSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIENsZWFuIHVwIHByZXZpb3VzIHN0YXRlXG4gICAgICAgICAgICAgICAgICAgIGRpc3Bvc2VBc3NvY2lhdGVkQ29tcG9uZW50Vmlld01vZGVsKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gSW5zdGFudGlhdGUgYW5kIGJpbmQgbmV3IGNvbXBvbmVudC4gSW1wbGljaXRseSB0aGlzIGNsZWFucyBhbnkgb2xkIERPTSBub2Rlcy5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjb21wb25lbnREZWZpbml0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gY29tcG9uZW50IFxcJycgKyBjb21wb25lbnROYW1lICsgJ1xcJycpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNsb25lVGVtcGxhdGVJbnRvRWxlbWVudChjb21wb25lbnROYW1lLCBjb21wb25lbnREZWZpbml0aW9uLCBlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbXBvbmVudFZpZXdNb2RlbCA9IGNyZWF0ZVZpZXdNb2RlbChjb21wb25lbnREZWZpbml0aW9uLCBlbGVtZW50LCBjb21wb25lbnRQYXJhbXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRCaW5kaW5nQ29udGV4dCA9IGJpbmRpbmdDb250ZXh0WydjcmVhdGVDaGlsZENvbnRleHQnXShjb21wb25lbnRWaWV3TW9kZWwpO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50Vmlld01vZGVsID0gY29tcG9uZW50Vmlld01vZGVsO1xuICAgICAgICAgICAgICAgICAgICBrby5hcHBseUJpbmRpbmdzVG9EZXNjZW5kYW50cyhjaGlsZEJpbmRpbmdDb250ZXh0LCBlbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIG51bGwsIHsgZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkOiBlbGVtZW50IH0pO1xuXG4gICAgICAgICAgICByZXR1cm4geyAnY29udHJvbHNEZXNjZW5kYW50QmluZGluZ3MnOiB0cnVlIH07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAga28udmlydHVhbEVsZW1lbnRzLmFsbG93ZWRCaW5kaW5nc1snY29tcG9uZW50J10gPSB0cnVlO1xuXG4gICAgZnVuY3Rpb24gY2xvbmVUZW1wbGF0ZUludG9FbGVtZW50KGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudERlZmluaXRpb24sIGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIHRlbXBsYXRlID0gY29tcG9uZW50RGVmaW5pdGlvblsndGVtcGxhdGUnXTtcbiAgICAgICAgaWYgKCF0ZW1wbGF0ZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb21wb25lbnQgXFwnJyArIGNvbXBvbmVudE5hbWUgKyAnXFwnIGhhcyBubyB0ZW1wbGF0ZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNsb25lZE5vZGVzQXJyYXkgPSBrby51dGlscy5jbG9uZU5vZGVzKHRlbXBsYXRlKTtcbiAgICAgICAga28udmlydHVhbEVsZW1lbnRzLnNldERvbU5vZGVDaGlsZHJlbihlbGVtZW50LCBjbG9uZWROb2Rlc0FycmF5KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVWaWV3TW9kZWwoY29tcG9uZW50RGVmaW5pdGlvbiwgZWxlbWVudCwgY29tcG9uZW50UGFyYW1zKSB7XG4gICAgICAgIHZhciBjb21wb25lbnRWaWV3TW9kZWxGYWN0b3J5ID0gY29tcG9uZW50RGVmaW5pdGlvblsnY3JlYXRlVmlld01vZGVsJ107XG4gICAgICAgIHJldHVybiBjb21wb25lbnRWaWV3TW9kZWxGYWN0b3J5XG4gICAgICAgICAgICA/IGNvbXBvbmVudFZpZXdNb2RlbEZhY3RvcnkuY2FsbChjb21wb25lbnREZWZpbml0aW9uLCBjb21wb25lbnRQYXJhbXMsIHsgZWxlbWVudDogZWxlbWVudCB9KVxuICAgICAgICAgICAgOiBjb21wb25lbnRQYXJhbXM7IC8vIFRlbXBsYXRlLW9ubHkgY29tcG9uZW50XG4gICAgfVxuXG59KSgpO1xudmFyIGF0dHJIdG1sVG9KYXZhc2NyaXB0TWFwID0geyAnY2xhc3MnOiAnY2xhc3NOYW1lJywgJ2Zvcic6ICdodG1sRm9yJyB9O1xua28uYmluZGluZ0hhbmRsZXJzWydhdHRyJ10gPSB7XG4gICAgJ3VwZGF0ZSc6IGZ1bmN0aW9uKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpKSB8fCB7fTtcbiAgICAgICAga28udXRpbHMub2JqZWN0Rm9yRWFjaCh2YWx1ZSwgZnVuY3Rpb24oYXR0ck5hbWUsIGF0dHJWYWx1ZSkge1xuICAgICAgICAgICAgYXR0clZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShhdHRyVmFsdWUpO1xuXG4gICAgICAgICAgICAvLyBUbyBjb3ZlciBjYXNlcyBsaWtlIFwiYXR0cjogeyBjaGVja2VkOnNvbWVQcm9wIH1cIiwgd2Ugd2FudCB0byByZW1vdmUgdGhlIGF0dHJpYnV0ZSBlbnRpcmVseVxuICAgICAgICAgICAgLy8gd2hlbiBzb21lUHJvcCBpcyBhIFwibm8gdmFsdWVcIi1saWtlIHZhbHVlIChzdHJpY3RseSBudWxsLCBmYWxzZSwgb3IgdW5kZWZpbmVkKVxuICAgICAgICAgICAgLy8gKGJlY2F1c2UgdGhlIGFic2VuY2Ugb2YgdGhlIFwiY2hlY2tlZFwiIGF0dHIgaXMgaG93IHRvIG1hcmsgYW4gZWxlbWVudCBhcyBub3QgY2hlY2tlZCwgZXRjLilcbiAgICAgICAgICAgIHZhciB0b1JlbW92ZSA9IChhdHRyVmFsdWUgPT09IGZhbHNlKSB8fCAoYXR0clZhbHVlID09PSBudWxsKSB8fCAoYXR0clZhbHVlID09PSB1bmRlZmluZWQpO1xuICAgICAgICAgICAgaWYgKHRvUmVtb3ZlKVxuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGF0dHJOYW1lKTtcblxuICAgICAgICAgICAgLy8gSW4gSUUgPD0gNyBhbmQgSUU4IFF1aXJrcyBNb2RlLCB5b3UgaGF2ZSB0byB1c2UgdGhlIEphdmFzY3JpcHQgcHJvcGVydHkgbmFtZSBpbnN0ZWFkIG9mIHRoZVxuICAgICAgICAgICAgLy8gSFRNTCBhdHRyaWJ1dGUgbmFtZSBmb3IgY2VydGFpbiBhdHRyaWJ1dGVzLiBJRTggU3RhbmRhcmRzIE1vZGUgc3VwcG9ydHMgdGhlIGNvcnJlY3QgYmVoYXZpb3IsXG4gICAgICAgICAgICAvLyBidXQgaW5zdGVhZCBvZiBmaWd1cmluZyBvdXQgdGhlIG1vZGUsIHdlJ2xsIGp1c3Qgc2V0IHRoZSBhdHRyaWJ1dGUgdGhyb3VnaCB0aGUgSmF2YXNjcmlwdFxuICAgICAgICAgICAgLy8gcHJvcGVydHkgZm9yIElFIDw9IDguXG4gICAgICAgICAgICBpZiAoa28udXRpbHMuaWVWZXJzaW9uIDw9IDggJiYgYXR0ck5hbWUgaW4gYXR0ckh0bWxUb0phdmFzY3JpcHRNYXApIHtcbiAgICAgICAgICAgICAgICBhdHRyTmFtZSA9IGF0dHJIdG1sVG9KYXZhc2NyaXB0TWFwW2F0dHJOYW1lXTtcbiAgICAgICAgICAgICAgICBpZiAodG9SZW1vdmUpXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGF0dHJOYW1lKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRbYXR0ck5hbWVdID0gYXR0clZhbHVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghdG9SZW1vdmUpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgYXR0clZhbHVlLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUcmVhdCBcIm5hbWVcIiBzcGVjaWFsbHkgLSBhbHRob3VnaCB5b3UgY2FuIHRoaW5rIG9mIGl0IGFzIGFuIGF0dHJpYnV0ZSwgaXQgYWxzbyBuZWVkc1xuICAgICAgICAgICAgLy8gc3BlY2lhbCBoYW5kbGluZyBvbiBvbGRlciB2ZXJzaW9ucyBvZiBJRSAoaHR0cHM6Ly9naXRodWIuY29tL1N0ZXZlU2FuZGVyc29uL2tub2Nrb3V0L3B1bGwvMzMzKVxuICAgICAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGJlaW5nIGNhc2Utc2Vuc2l0aXZlIGhlcmUgYmVjYXVzZSBYSFRNTCB3b3VsZCByZWdhcmQgXCJOYW1lXCIgYXMgYSBkaWZmZXJlbnQgdGhpbmdcbiAgICAgICAgICAgIC8vIGVudGlyZWx5LCBhbmQgdGhlcmUncyBubyBzdHJvbmcgcmVhc29uIHRvIGFsbG93IGZvciBzdWNoIGNhc2luZyBpbiBIVE1MLlxuICAgICAgICAgICAgaWYgKGF0dHJOYW1lID09PSBcIm5hbWVcIikge1xuICAgICAgICAgICAgICAgIGtvLnV0aWxzLnNldEVsZW1lbnROYW1lKGVsZW1lbnQsIHRvUmVtb3ZlID8gXCJcIiA6IGF0dHJWYWx1ZS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcbihmdW5jdGlvbigpIHtcblxua28uYmluZGluZ0hhbmRsZXJzWydjaGVja2VkJ10gPSB7XG4gICAgJ2FmdGVyJzogWyd2YWx1ZScsICdhdHRyJ10sXG4gICAgJ2luaXQnOiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3MpIHtcbiAgICAgICAgdmFyIGNoZWNrZWRWYWx1ZSA9IGtvLnB1cmVDb21wdXRlZChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIFRyZWF0IFwidmFsdWVcIiBsaWtlIFwiY2hlY2tlZFZhbHVlXCIgd2hlbiBpdCBpcyBpbmNsdWRlZCB3aXRoIFwiY2hlY2tlZFwiIGJpbmRpbmdcbiAgICAgICAgICAgIGlmIChhbGxCaW5kaW5nc1snaGFzJ10oJ2NoZWNrZWRWYWx1ZScpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUoYWxsQmluZGluZ3MuZ2V0KCdjaGVja2VkVmFsdWUnKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFsbEJpbmRpbmdzWydoYXMnXSgndmFsdWUnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKGFsbEJpbmRpbmdzLmdldCgndmFsdWUnKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50LnZhbHVlO1xuICAgICAgICB9KTtcblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVNb2RlbCgpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgdXBkYXRlcyB0aGUgbW9kZWwgdmFsdWUgZnJvbSB0aGUgdmlldyB2YWx1ZS5cbiAgICAgICAgICAgIC8vIEl0IHJ1bnMgaW4gcmVzcG9uc2UgdG8gRE9NIGV2ZW50cyAoY2xpY2spIGFuZCBjaGFuZ2VzIGluIGNoZWNrZWRWYWx1ZS5cbiAgICAgICAgICAgIHZhciBpc0NoZWNrZWQgPSBlbGVtZW50LmNoZWNrZWQsXG4gICAgICAgICAgICAgICAgZWxlbVZhbHVlID0gdXNlQ2hlY2tlZFZhbHVlID8gY2hlY2tlZFZhbHVlKCkgOiBpc0NoZWNrZWQ7XG5cbiAgICAgICAgICAgIC8vIFdoZW4gd2UncmUgZmlyc3Qgc2V0dGluZyB1cCB0aGlzIGNvbXB1dGVkLCBkb24ndCBjaGFuZ2UgYW55IG1vZGVsIHN0YXRlLlxuICAgICAgICAgICAgaWYgKGtvLmNvbXB1dGVkQ29udGV4dC5pc0luaXRpYWwoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gV2UgY2FuIGlnbm9yZSB1bmNoZWNrZWQgcmFkaW8gYnV0dG9ucywgYmVjYXVzZSBzb21lIG90aGVyIHJhZGlvXG4gICAgICAgICAgICAvLyBidXR0b24gd2lsbCBiZSBnZXR0aW5nIGNoZWNrZWQsIGFuZCB0aGF0IG9uZSBjYW4gdGFrZSBjYXJlIG9mIHVwZGF0aW5nIHN0YXRlLlxuICAgICAgICAgICAgaWYgKGlzUmFkaW8gJiYgIWlzQ2hlY2tlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG1vZGVsVmFsdWUgPSBrby5kZXBlbmRlbmN5RGV0ZWN0aW9uLmlnbm9yZSh2YWx1ZUFjY2Vzc29yKTtcbiAgICAgICAgICAgIGlmIChpc1ZhbHVlQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBpZiAob2xkRWxlbVZhbHVlICE9PSBlbGVtVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2hlbiB3ZSdyZSByZXNwb25kaW5nIHRvIHRoZSBjaGVja2VkVmFsdWUgY2hhbmdpbmcsIGFuZCB0aGUgZWxlbWVudCBpc1xuICAgICAgICAgICAgICAgICAgICAvLyBjdXJyZW50bHkgY2hlY2tlZCwgcmVwbGFjZSB0aGUgb2xkIGVsZW0gdmFsdWUgd2l0aCB0aGUgbmV3IGVsZW0gdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgLy8gaW4gdGhlIG1vZGVsIGFycmF5LlxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNDaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrby51dGlscy5hZGRPclJlbW92ZUl0ZW0obW9kZWxWYWx1ZSwgZWxlbVZhbHVlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtvLnV0aWxzLmFkZE9yUmVtb3ZlSXRlbShtb2RlbFZhbHVlLCBvbGRFbGVtVmFsdWUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIG9sZEVsZW1WYWx1ZSA9IGVsZW1WYWx1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBXaGVuIHdlJ3JlIHJlc3BvbmRpbmcgdG8gdGhlIHVzZXIgaGF2aW5nIGNoZWNrZWQvdW5jaGVja2VkIGEgY2hlY2tib3gsXG4gICAgICAgICAgICAgICAgICAgIC8vIGFkZC9yZW1vdmUgdGhlIGVsZW1lbnQgdmFsdWUgdG8gdGhlIG1vZGVsIGFycmF5LlxuICAgICAgICAgICAgICAgICAgICBrby51dGlscy5hZGRPclJlbW92ZUl0ZW0obW9kZWxWYWx1ZSwgZWxlbVZhbHVlLCBpc0NoZWNrZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAga28uZXhwcmVzc2lvblJld3JpdGluZy53cml0ZVZhbHVlVG9Qcm9wZXJ0eShtb2RlbFZhbHVlLCBhbGxCaW5kaW5ncywgJ2NoZWNrZWQnLCBlbGVtVmFsdWUsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZVZpZXcoKSB7XG4gICAgICAgICAgICAvLyBUaGlzIHVwZGF0ZXMgdGhlIHZpZXcgdmFsdWUgZnJvbSB0aGUgbW9kZWwgdmFsdWUuXG4gICAgICAgICAgICAvLyBJdCBydW5zIGluIHJlc3BvbnNlIHRvIGNoYW5nZXMgaW4gdGhlIGJvdW5kIChjaGVja2VkKSB2YWx1ZS5cbiAgICAgICAgICAgIHZhciBtb2RlbFZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZUFjY2Vzc29yKCkpO1xuXG4gICAgICAgICAgICBpZiAoaXNWYWx1ZUFycmF5KSB7XG4gICAgICAgICAgICAgICAgLy8gV2hlbiBhIGNoZWNrYm94IGlzIGJvdW5kIHRvIGFuIGFycmF5LCBiZWluZyBjaGVja2VkIHJlcHJlc2VudHMgaXRzIHZhbHVlIGJlaW5nIHByZXNlbnQgaW4gdGhhdCBhcnJheVxuICAgICAgICAgICAgICAgIGVsZW1lbnQuY2hlY2tlZCA9IGtvLnV0aWxzLmFycmF5SW5kZXhPZihtb2RlbFZhbHVlLCBjaGVja2VkVmFsdWUoKSkgPj0gMDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNDaGVja2JveCkge1xuICAgICAgICAgICAgICAgIC8vIFdoZW4gYSBjaGVja2JveCBpcyBib3VuZCB0byBhbnkgb3RoZXIgdmFsdWUgKG5vdCBhbiBhcnJheSksIGJlaW5nIGNoZWNrZWQgcmVwcmVzZW50cyB0aGUgdmFsdWUgYmVpbmcgdHJ1ZWlzaFxuICAgICAgICAgICAgICAgIGVsZW1lbnQuY2hlY2tlZCA9IG1vZGVsVmFsdWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIEZvciByYWRpbyBidXR0b25zLCBiZWluZyBjaGVja2VkIG1lYW5zIHRoYXQgdGhlIHJhZGlvIGJ1dHRvbidzIHZhbHVlIGNvcnJlc3BvbmRzIHRvIHRoZSBtb2RlbCB2YWx1ZVxuICAgICAgICAgICAgICAgIGVsZW1lbnQuY2hlY2tlZCA9IChjaGVja2VkVmFsdWUoKSA9PT0gbW9kZWxWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGlzQ2hlY2tib3ggPSBlbGVtZW50LnR5cGUgPT0gXCJjaGVja2JveFwiLFxuICAgICAgICAgICAgaXNSYWRpbyA9IGVsZW1lbnQudHlwZSA9PSBcInJhZGlvXCI7XG5cbiAgICAgICAgLy8gT25seSBiaW5kIHRvIGNoZWNrIGJveGVzIGFuZCByYWRpbyBidXR0b25zXG4gICAgICAgIGlmICghaXNDaGVja2JveCAmJiAhaXNSYWRpbykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGlzVmFsdWVBcnJheSA9IGlzQ2hlY2tib3ggJiYgKGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpKSBpbnN0YW5jZW9mIEFycmF5KSxcbiAgICAgICAgICAgIG9sZEVsZW1WYWx1ZSA9IGlzVmFsdWVBcnJheSA/IGNoZWNrZWRWYWx1ZSgpIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdXNlQ2hlY2tlZFZhbHVlID0gaXNSYWRpbyB8fCBpc1ZhbHVlQXJyYXk7XG5cbiAgICAgICAgLy8gSUUgNiB3b24ndCBhbGxvdyByYWRpbyBidXR0b25zIHRvIGJlIHNlbGVjdGVkIHVubGVzcyB0aGV5IGhhdmUgYSBuYW1lXG4gICAgICAgIGlmIChpc1JhZGlvICYmICFlbGVtZW50Lm5hbWUpXG4gICAgICAgICAgICBrby5iaW5kaW5nSGFuZGxlcnNbJ3VuaXF1ZU5hbWUnXVsnaW5pdCddKGVsZW1lbnQsIGZ1bmN0aW9uKCkgeyByZXR1cm4gdHJ1ZSB9KTtcblxuICAgICAgICAvLyBTZXQgdXAgdHdvIGNvbXB1dGVkcyB0byB1cGRhdGUgdGhlIGJpbmRpbmc6XG5cbiAgICAgICAgLy8gVGhlIGZpcnN0IHJlc3BvbmRzIHRvIGNoYW5nZXMgaW4gdGhlIGNoZWNrZWRWYWx1ZSB2YWx1ZSBhbmQgdG8gZWxlbWVudCBjbGlja3NcbiAgICAgICAga28uY29tcHV0ZWQodXBkYXRlTW9kZWwsIG51bGwsIHsgZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkOiBlbGVtZW50IH0pO1xuICAgICAgICBrby51dGlscy5yZWdpc3RlckV2ZW50SGFuZGxlcihlbGVtZW50LCBcImNsaWNrXCIsIHVwZGF0ZU1vZGVsKTtcblxuICAgICAgICAvLyBUaGUgc2Vjb25kIHJlc3BvbmRzIHRvIGNoYW5nZXMgaW4gdGhlIG1vZGVsIHZhbHVlICh0aGUgb25lIGFzc29jaWF0ZWQgd2l0aCB0aGUgY2hlY2tlZCBiaW5kaW5nKVxuICAgICAgICBrby5jb21wdXRlZCh1cGRhdGVWaWV3LCBudWxsLCB7IGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZDogZWxlbWVudCB9KTtcbiAgICB9XG59O1xua28uZXhwcmVzc2lvblJld3JpdGluZy50d29XYXlCaW5kaW5nc1snY2hlY2tlZCddID0gdHJ1ZTtcblxua28uYmluZGluZ0hhbmRsZXJzWydjaGVja2VkVmFsdWUnXSA9IHtcbiAgICAndXBkYXRlJzogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IpIHtcbiAgICAgICAgZWxlbWVudC52YWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpKTtcbiAgICB9XG59O1xuXG59KSgpO3ZhciBjbGFzc2VzV3JpdHRlbkJ5QmluZGluZ0tleSA9ICdfX2tvX19jc3NWYWx1ZSc7XG5rby5iaW5kaW5nSGFuZGxlcnNbJ2NzcyddID0ge1xuICAgICd1cGRhdGUnOiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3Nvcikge1xuICAgICAgICB2YXIgdmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSk7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAga28udXRpbHMub2JqZWN0Rm9yRWFjaCh2YWx1ZSwgZnVuY3Rpb24oY2xhc3NOYW1lLCBzaG91bGRIYXZlQ2xhc3MpIHtcbiAgICAgICAgICAgICAgICBzaG91bGRIYXZlQ2xhc3MgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHNob3VsZEhhdmVDbGFzcyk7XG4gICAgICAgICAgICAgICAga28udXRpbHMudG9nZ2xlRG9tTm9kZUNzc0NsYXNzKGVsZW1lbnQsIGNsYXNzTmFtZSwgc2hvdWxkSGF2ZUNsYXNzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgPSBTdHJpbmcodmFsdWUgfHwgJycpOyAvLyBNYWtlIHN1cmUgd2UgZG9uJ3QgdHJ5IHRvIHN0b3JlIG9yIHNldCBhIG5vbi1zdHJpbmcgdmFsdWVcbiAgICAgICAgICAgIGtvLnV0aWxzLnRvZ2dsZURvbU5vZGVDc3NDbGFzcyhlbGVtZW50LCBlbGVtZW50W2NsYXNzZXNXcml0dGVuQnlCaW5kaW5nS2V5XSwgZmFsc2UpO1xuICAgICAgICAgICAgZWxlbWVudFtjbGFzc2VzV3JpdHRlbkJ5QmluZGluZ0tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIGtvLnV0aWxzLnRvZ2dsZURvbU5vZGVDc3NDbGFzcyhlbGVtZW50LCB2YWx1ZSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xua28uYmluZGluZ0hhbmRsZXJzWydlbmFibGUnXSA9IHtcbiAgICAndXBkYXRlJzogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IpIHtcbiAgICAgICAgdmFyIHZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZUFjY2Vzc29yKCkpO1xuICAgICAgICBpZiAodmFsdWUgJiYgZWxlbWVudC5kaXNhYmxlZClcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gICAgICAgIGVsc2UgaWYgKCghdmFsdWUpICYmICghZWxlbWVudC5kaXNhYmxlZCkpXG4gICAgICAgICAgICBlbGVtZW50LmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG59O1xuXG5rby5iaW5kaW5nSGFuZGxlcnNbJ2Rpc2FibGUnXSA9IHtcbiAgICAndXBkYXRlJzogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IpIHtcbiAgICAgICAga28uYmluZGluZ0hhbmRsZXJzWydlbmFibGUnXVsndXBkYXRlJ10oZWxlbWVudCwgZnVuY3Rpb24oKSB7IHJldHVybiAha28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZUFjY2Vzc29yKCkpIH0pO1xuICAgIH1cbn07XG4vLyBGb3IgY2VydGFpbiBjb21tb24gZXZlbnRzIChjdXJyZW50bHkganVzdCAnY2xpY2snKSwgYWxsb3cgYSBzaW1wbGlmaWVkIGRhdGEtYmluZGluZyBzeW50YXhcbi8vIGUuZy4gY2xpY2s6aGFuZGxlciBpbnN0ZWFkIG9mIHRoZSB1c3VhbCBmdWxsLWxlbmd0aCBldmVudDp7Y2xpY2s6aGFuZGxlcn1cbmZ1bmN0aW9uIG1ha2VFdmVudEhhbmRsZXJTaG9ydGN1dChldmVudE5hbWUpIHtcbiAgICBrby5iaW5kaW5nSGFuZGxlcnNbZXZlbnROYW1lXSA9IHtcbiAgICAgICAgJ2luaXQnOiBmdW5jdGlvbihlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5ncywgdmlld01vZGVsLCBiaW5kaW5nQ29udGV4dCkge1xuICAgICAgICAgICAgdmFyIG5ld1ZhbHVlQWNjZXNzb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgICAgICAgICAgIHJlc3VsdFtldmVudE5hbWVdID0gdmFsdWVBY2Nlc3NvcigpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIGtvLmJpbmRpbmdIYW5kbGVyc1snZXZlbnQnXVsnaW5pdCddLmNhbGwodGhpcywgZWxlbWVudCwgbmV3VmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3MsIHZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5rby5iaW5kaW5nSGFuZGxlcnNbJ2V2ZW50J10gPSB7XG4gICAgJ2luaXQnIDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzLCB2aWV3TW9kZWwsIGJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgIHZhciBldmVudHNUb0hhbmRsZSA9IHZhbHVlQWNjZXNzb3IoKSB8fCB7fTtcbiAgICAgICAga28udXRpbHMub2JqZWN0Rm9yRWFjaChldmVudHNUb0hhbmRsZSwgZnVuY3Rpb24oZXZlbnROYW1lKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGV2ZW50TmFtZSA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAga28udXRpbHMucmVnaXN0ZXJFdmVudEhhbmRsZXIoZWxlbWVudCwgZXZlbnROYW1lLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhhbmRsZXJSZXR1cm5WYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhhbmRsZXJGdW5jdGlvbiA9IHZhbHVlQWNjZXNzb3IoKVtldmVudE5hbWVdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWhhbmRsZXJGdW5jdGlvbilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGFrZSBhbGwgdGhlIGV2ZW50IGFyZ3MsIGFuZCBwcmVmaXggd2l0aCB0aGUgdmlld21vZGVsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXJnc0ZvckhhbmRsZXIgPSBrby51dGlscy5tYWtlQXJyYXkoYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdNb2RlbCA9IGJpbmRpbmdDb250ZXh0WyckZGF0YSddO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJnc0ZvckhhbmRsZXIudW5zaGlmdCh2aWV3TW9kZWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlclJldHVyblZhbHVlID0gaGFuZGxlckZ1bmN0aW9uLmFwcGx5KHZpZXdNb2RlbCwgYXJnc0ZvckhhbmRsZXIpO1xuICAgICAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhhbmRsZXJSZXR1cm5WYWx1ZSAhPT0gdHJ1ZSkgeyAvLyBOb3JtYWxseSB3ZSB3YW50IHRvIHByZXZlbnQgZGVmYXVsdCBhY3Rpb24uIERldmVsb3BlciBjYW4gb3ZlcnJpZGUgdGhpcyBiZSBleHBsaWNpdGx5IHJldHVybmluZyB0cnVlLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5wcmV2ZW50RGVmYXVsdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgYnViYmxlID0gYWxsQmluZGluZ3MuZ2V0KGV2ZW50TmFtZSArICdCdWJibGUnKSAhPT0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmICghYnViYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5jYW5jZWxCdWJibGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LnN0b3BQcm9wYWdhdGlvbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59O1xuLy8gXCJmb3JlYWNoOiBzb21lRXhwcmVzc2lvblwiIGlzIGVxdWl2YWxlbnQgdG8gXCJ0ZW1wbGF0ZTogeyBmb3JlYWNoOiBzb21lRXhwcmVzc2lvbiB9XCJcbi8vIFwiZm9yZWFjaDogeyBkYXRhOiBzb21lRXhwcmVzc2lvbiwgYWZ0ZXJBZGQ6IG15Zm4gfVwiIGlzIGVxdWl2YWxlbnQgdG8gXCJ0ZW1wbGF0ZTogeyBmb3JlYWNoOiBzb21lRXhwcmVzc2lvbiwgYWZ0ZXJBZGQ6IG15Zm4gfVwiXG5rby5iaW5kaW5nSGFuZGxlcnNbJ2ZvcmVhY2gnXSA9IHtcbiAgICBtYWtlVGVtcGxhdGVWYWx1ZUFjY2Vzc29yOiBmdW5jdGlvbih2YWx1ZUFjY2Vzc29yKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBtb2RlbFZhbHVlID0gdmFsdWVBY2Nlc3NvcigpLFxuICAgICAgICAgICAgICAgIHVud3JhcHBlZFZhbHVlID0ga28udXRpbHMucGVla09ic2VydmFibGUobW9kZWxWYWx1ZSk7ICAgIC8vIFVud3JhcCB3aXRob3V0IHNldHRpbmcgYSBkZXBlbmRlbmN5IGhlcmVcblxuICAgICAgICAgICAgLy8gSWYgdW53cmFwcGVkVmFsdWUgaXMgdGhlIGFycmF5LCBwYXNzIGluIHRoZSB3cmFwcGVkIHZhbHVlIG9uIGl0cyBvd25cbiAgICAgICAgICAgIC8vIFRoZSB2YWx1ZSB3aWxsIGJlIHVud3JhcHBlZCBhbmQgdHJhY2tlZCB3aXRoaW4gdGhlIHRlbXBsYXRlIGJpbmRpbmdcbiAgICAgICAgICAgIC8vIChTZWUgaHR0cHM6Ly9naXRodWIuY29tL1N0ZXZlU2FuZGVyc29uL2tub2Nrb3V0L2lzc3Vlcy81MjMpXG4gICAgICAgICAgICBpZiAoKCF1bndyYXBwZWRWYWx1ZSkgfHwgdHlwZW9mIHVud3JhcHBlZFZhbHVlLmxlbmd0aCA9PSBcIm51bWJlclwiKVxuICAgICAgICAgICAgICAgIHJldHVybiB7ICdmb3JlYWNoJzogbW9kZWxWYWx1ZSwgJ3RlbXBsYXRlRW5naW5lJzoga28ubmF0aXZlVGVtcGxhdGVFbmdpbmUuaW5zdGFuY2UgfTtcblxuICAgICAgICAgICAgLy8gSWYgdW53cmFwcGVkVmFsdWUuZGF0YSBpcyB0aGUgYXJyYXksIHByZXNlcnZlIGFsbCByZWxldmFudCBvcHRpb25zIGFuZCB1bndyYXAgYWdhaW4gdmFsdWUgc28gd2UgZ2V0IHVwZGF0ZXNcbiAgICAgICAgICAgIGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUobW9kZWxWYWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICdmb3JlYWNoJzogdW53cmFwcGVkVmFsdWVbJ2RhdGEnXSxcbiAgICAgICAgICAgICAgICAnYXMnOiB1bndyYXBwZWRWYWx1ZVsnYXMnXSxcbiAgICAgICAgICAgICAgICAnaW5jbHVkZURlc3Ryb3llZCc6IHVud3JhcHBlZFZhbHVlWydpbmNsdWRlRGVzdHJveWVkJ10sXG4gICAgICAgICAgICAgICAgJ2FmdGVyQWRkJzogdW53cmFwcGVkVmFsdWVbJ2FmdGVyQWRkJ10sXG4gICAgICAgICAgICAgICAgJ2JlZm9yZVJlbW92ZSc6IHVud3JhcHBlZFZhbHVlWydiZWZvcmVSZW1vdmUnXSxcbiAgICAgICAgICAgICAgICAnYWZ0ZXJSZW5kZXInOiB1bndyYXBwZWRWYWx1ZVsnYWZ0ZXJSZW5kZXInXSxcbiAgICAgICAgICAgICAgICAnYmVmb3JlTW92ZSc6IHVud3JhcHBlZFZhbHVlWydiZWZvcmVNb3ZlJ10sXG4gICAgICAgICAgICAgICAgJ2FmdGVyTW92ZSc6IHVud3JhcHBlZFZhbHVlWydhZnRlck1vdmUnXSxcbiAgICAgICAgICAgICAgICAndGVtcGxhdGVFbmdpbmUnOiBrby5uYXRpdmVUZW1wbGF0ZUVuZ2luZS5pbnN0YW5jZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICB9LFxuICAgICdpbml0JzogZnVuY3Rpb24oZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3MsIHZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIGtvLmJpbmRpbmdIYW5kbGVyc1sndGVtcGxhdGUnXVsnaW5pdCddKGVsZW1lbnQsIGtvLmJpbmRpbmdIYW5kbGVyc1snZm9yZWFjaCddLm1ha2VUZW1wbGF0ZVZhbHVlQWNjZXNzb3IodmFsdWVBY2Nlc3NvcikpO1xuICAgIH0sXG4gICAgJ3VwZGF0ZSc6IGZ1bmN0aW9uKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzLCB2aWV3TW9kZWwsIGJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgIHJldHVybiBrby5iaW5kaW5nSGFuZGxlcnNbJ3RlbXBsYXRlJ11bJ3VwZGF0ZSddKGVsZW1lbnQsIGtvLmJpbmRpbmdIYW5kbGVyc1snZm9yZWFjaCddLm1ha2VUZW1wbGF0ZVZhbHVlQWNjZXNzb3IodmFsdWVBY2Nlc3NvciksIGFsbEJpbmRpbmdzLCB2aWV3TW9kZWwsIGJpbmRpbmdDb250ZXh0KTtcbiAgICB9XG59O1xua28uZXhwcmVzc2lvblJld3JpdGluZy5iaW5kaW5nUmV3cml0ZVZhbGlkYXRvcnNbJ2ZvcmVhY2gnXSA9IGZhbHNlOyAvLyBDYW4ndCByZXdyaXRlIGNvbnRyb2wgZmxvdyBiaW5kaW5nc1xua28udmlydHVhbEVsZW1lbnRzLmFsbG93ZWRCaW5kaW5nc1snZm9yZWFjaCddID0gdHJ1ZTtcbnZhciBoYXNmb2N1c1VwZGF0aW5nUHJvcGVydHkgPSAnX19rb19oYXNmb2N1c1VwZGF0aW5nJztcbnZhciBoYXNmb2N1c0xhc3RWYWx1ZSA9ICdfX2tvX2hhc2ZvY3VzTGFzdFZhbHVlJztcbmtvLmJpbmRpbmdIYW5kbGVyc1snaGFzZm9jdXMnXSA9IHtcbiAgICAnaW5pdCc6IGZ1bmN0aW9uKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzKSB7XG4gICAgICAgIHZhciBoYW5kbGVFbGVtZW50Rm9jdXNDaGFuZ2UgPSBmdW5jdGlvbihpc0ZvY3VzZWQpIHtcbiAgICAgICAgICAgIC8vIFdoZXJlIHBvc3NpYmxlLCBpZ25vcmUgd2hpY2ggZXZlbnQgd2FzIHJhaXNlZCBhbmQgZGV0ZXJtaW5lIGZvY3VzIHN0YXRlIHVzaW5nIGFjdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgICAvLyBhcyB0aGlzIGF2b2lkcyBwaGFudG9tIGZvY3VzL2JsdXIgZXZlbnRzIHJhaXNlZCB3aGVuIGNoYW5naW5nIHRhYnMgaW4gbW9kZXJuIGJyb3dzZXJzLlxuICAgICAgICAgICAgLy8gSG93ZXZlciwgbm90IGFsbCBLTy10YXJnZXRlZCBicm93c2VycyAoRmlyZWZveCAyKSBzdXBwb3J0IGFjdGl2ZUVsZW1lbnQuIEZvciB0aG9zZSBicm93c2VycyxcbiAgICAgICAgICAgIC8vIHByZXZlbnQgYSBsb3NzIG9mIGZvY3VzIHdoZW4gY2hhbmdpbmcgdGFicy93aW5kb3dzIGJ5IHNldHRpbmcgYSBmbGFnIHRoYXQgcHJldmVudHMgaGFzZm9jdXNcbiAgICAgICAgICAgIC8vIGZyb20gY2FsbGluZyAnYmx1cigpJyBvbiB0aGUgZWxlbWVudCB3aGVuIGl0IGxvc2VzIGZvY3VzLlxuICAgICAgICAgICAgLy8gRGlzY3Vzc2lvbiBhdCBodHRwczovL2dpdGh1Yi5jb20vU3RldmVTYW5kZXJzb24va25vY2tvdXQvcHVsbC8zNTJcbiAgICAgICAgICAgIGVsZW1lbnRbaGFzZm9jdXNVcGRhdGluZ1Byb3BlcnR5XSA9IHRydWU7XG4gICAgICAgICAgICB2YXIgb3duZXJEb2MgPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQ7XG4gICAgICAgICAgICBpZiAoXCJhY3RpdmVFbGVtZW50XCIgaW4gb3duZXJEb2MpIHtcbiAgICAgICAgICAgICAgICB2YXIgYWN0aXZlO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZSA9IG93bmVyRG9jLmFjdGl2ZUVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElFOSB0aHJvd3MgaWYgeW91IGFjY2VzcyBhY3RpdmVFbGVtZW50IGR1cmluZyBwYWdlIGxvYWQgKHNlZSBpc3N1ZSAjNzAzKVxuICAgICAgICAgICAgICAgICAgICBhY3RpdmUgPSBvd25lckRvYy5ib2R5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpc0ZvY3VzZWQgPSAoYWN0aXZlID09PSBlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBtb2RlbFZhbHVlID0gdmFsdWVBY2Nlc3NvcigpO1xuICAgICAgICAgICAga28uZXhwcmVzc2lvblJld3JpdGluZy53cml0ZVZhbHVlVG9Qcm9wZXJ0eShtb2RlbFZhbHVlLCBhbGxCaW5kaW5ncywgJ2hhc2ZvY3VzJywgaXNGb2N1c2VkLCB0cnVlKTtcblxuICAgICAgICAgICAgLy9jYWNoZSB0aGUgbGF0ZXN0IHZhbHVlLCBzbyB3ZSBjYW4gYXZvaWQgdW5uZWNlc3NhcmlseSBjYWxsaW5nIGZvY3VzL2JsdXIgaW4gdGhlIHVwZGF0ZSBmdW5jdGlvblxuICAgICAgICAgICAgZWxlbWVudFtoYXNmb2N1c0xhc3RWYWx1ZV0gPSBpc0ZvY3VzZWQ7XG4gICAgICAgICAgICBlbGVtZW50W2hhc2ZvY3VzVXBkYXRpbmdQcm9wZXJ0eV0gPSBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGhhbmRsZUVsZW1lbnRGb2N1c0luID0gaGFuZGxlRWxlbWVudEZvY3VzQ2hhbmdlLmJpbmQobnVsbCwgdHJ1ZSk7XG4gICAgICAgIHZhciBoYW5kbGVFbGVtZW50Rm9jdXNPdXQgPSBoYW5kbGVFbGVtZW50Rm9jdXNDaGFuZ2UuYmluZChudWxsLCBmYWxzZSk7XG5cbiAgICAgICAga28udXRpbHMucmVnaXN0ZXJFdmVudEhhbmRsZXIoZWxlbWVudCwgXCJmb2N1c1wiLCBoYW5kbGVFbGVtZW50Rm9jdXNJbik7XG4gICAgICAgIGtvLnV0aWxzLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKGVsZW1lbnQsIFwiZm9jdXNpblwiLCBoYW5kbGVFbGVtZW50Rm9jdXNJbik7IC8vIEZvciBJRVxuICAgICAgICBrby51dGlscy5yZWdpc3RlckV2ZW50SGFuZGxlcihlbGVtZW50LCBcImJsdXJcIiwgIGhhbmRsZUVsZW1lbnRGb2N1c091dCk7XG4gICAgICAgIGtvLnV0aWxzLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKGVsZW1lbnQsIFwiZm9jdXNvdXRcIiwgIGhhbmRsZUVsZW1lbnRGb2N1c091dCk7IC8vIEZvciBJRVxuICAgIH0sXG4gICAgJ3VwZGF0ZSc6IGZ1bmN0aW9uKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gISFrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSk7IC8vZm9yY2UgYm9vbGVhbiB0byBjb21wYXJlIHdpdGggbGFzdCB2YWx1ZVxuICAgICAgICBpZiAoIWVsZW1lbnRbaGFzZm9jdXNVcGRhdGluZ1Byb3BlcnR5XSAmJiBlbGVtZW50W2hhc2ZvY3VzTGFzdFZhbHVlXSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgIHZhbHVlID8gZWxlbWVudC5mb2N1cygpIDogZWxlbWVudC5ibHVyKCk7XG4gICAgICAgICAgICBrby5kZXBlbmRlbmN5RGV0ZWN0aW9uLmlnbm9yZShrby51dGlscy50cmlnZ2VyRXZlbnQsIG51bGwsIFtlbGVtZW50LCB2YWx1ZSA/IFwiZm9jdXNpblwiIDogXCJmb2N1c291dFwiXSk7IC8vIEZvciBJRSwgd2hpY2ggZG9lc24ndCByZWxpYWJseSBmaXJlIFwiZm9jdXNcIiBvciBcImJsdXJcIiBldmVudHMgc3luY2hyb25vdXNseVxuICAgICAgICB9XG4gICAgfVxufTtcbmtvLmV4cHJlc3Npb25SZXdyaXRpbmcudHdvV2F5QmluZGluZ3NbJ2hhc2ZvY3VzJ10gPSB0cnVlO1xuXG5rby5iaW5kaW5nSGFuZGxlcnNbJ2hhc0ZvY3VzJ10gPSBrby5iaW5kaW5nSGFuZGxlcnNbJ2hhc2ZvY3VzJ107IC8vIE1ha2UgXCJoYXNGb2N1c1wiIGFuIGFsaWFzXG5rby5leHByZXNzaW9uUmV3cml0aW5nLnR3b1dheUJpbmRpbmdzWydoYXNGb2N1cyddID0gdHJ1ZTtcbmtvLmJpbmRpbmdIYW5kbGVyc1snaHRtbCddID0ge1xuICAgICdpbml0JzogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIFByZXZlbnQgYmluZGluZyBvbiB0aGUgZHluYW1pY2FsbHktaW5qZWN0ZWQgSFRNTCAoYXMgZGV2ZWxvcGVycyBhcmUgdW5saWtlbHkgdG8gZXhwZWN0IHRoYXQsIGFuZCBpdCBoYXMgc2VjdXJpdHkgaW1wbGljYXRpb25zKVxuICAgICAgICByZXR1cm4geyAnY29udHJvbHNEZXNjZW5kYW50QmluZGluZ3MnOiB0cnVlIH07XG4gICAgfSxcbiAgICAndXBkYXRlJzogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IpIHtcbiAgICAgICAgLy8gc2V0SHRtbCB3aWxsIHVud3JhcCB0aGUgdmFsdWUgaWYgbmVlZGVkXG4gICAgICAgIGtvLnV0aWxzLnNldEh0bWwoZWxlbWVudCwgdmFsdWVBY2Nlc3NvcigpKTtcbiAgICB9XG59O1xuLy8gTWFrZXMgYSBiaW5kaW5nIGxpa2Ugd2l0aCBvciBpZlxuZnVuY3Rpb24gbWFrZVdpdGhJZkJpbmRpbmcoYmluZGluZ0tleSwgaXNXaXRoLCBpc05vdCwgbWFrZUNvbnRleHRDYWxsYmFjaykge1xuICAgIGtvLmJpbmRpbmdIYW5kbGVyc1tiaW5kaW5nS2V5XSA9IHtcbiAgICAgICAgJ2luaXQnOiBmdW5jdGlvbihlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5ncywgdmlld01vZGVsLCBiaW5kaW5nQ29udGV4dCkge1xuICAgICAgICAgICAgdmFyIGRpZERpc3BsYXlPbkxhc3RVcGRhdGUsXG4gICAgICAgICAgICAgICAgc2F2ZWROb2RlcztcbiAgICAgICAgICAgIGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBkYXRhVmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSksXG4gICAgICAgICAgICAgICAgICAgIHNob3VsZERpc3BsYXkgPSAhaXNOb3QgIT09ICFkYXRhVmFsdWUsIC8vIGVxdWl2YWxlbnQgdG8gaXNOb3QgPyAhZGF0YVZhbHVlIDogISFkYXRhVmFsdWVcbiAgICAgICAgICAgICAgICAgICAgaXNGaXJzdFJlbmRlciA9ICFzYXZlZE5vZGVzLFxuICAgICAgICAgICAgICAgICAgICBuZWVkc1JlZnJlc2ggPSBpc0ZpcnN0UmVuZGVyIHx8IGlzV2l0aCB8fCAoc2hvdWxkRGlzcGxheSAhPT0gZGlkRGlzcGxheU9uTGFzdFVwZGF0ZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAobmVlZHNSZWZyZXNoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNhdmUgYSBjb3B5IG9mIHRoZSBpbm5lciBub2RlcyBvbiB0aGUgaW5pdGlhbCB1cGRhdGUsIGJ1dCBvbmx5IGlmIHdlIGhhdmUgZGVwZW5kZW5jaWVzLlxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNGaXJzdFJlbmRlciAmJiBrby5jb21wdXRlZENvbnRleHQuZ2V0RGVwZW5kZW5jaWVzQ291bnQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZWROb2RlcyA9IGtvLnV0aWxzLmNsb25lTm9kZXMoa28udmlydHVhbEVsZW1lbnRzLmNoaWxkTm9kZXMoZWxlbWVudCksIHRydWUgLyogc2hvdWxkQ2xlYW5Ob2RlcyAqLyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoc2hvdWxkRGlzcGxheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0ZpcnN0UmVuZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga28udmlydHVhbEVsZW1lbnRzLnNldERvbU5vZGVDaGlsZHJlbihlbGVtZW50LCBrby51dGlscy5jbG9uZU5vZGVzKHNhdmVkTm9kZXMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGtvLmFwcGx5QmluZGluZ3NUb0Rlc2NlbmRhbnRzKG1ha2VDb250ZXh0Q2FsbGJhY2sgPyBtYWtlQ29udGV4dENhbGxiYWNrKGJpbmRpbmdDb250ZXh0LCBkYXRhVmFsdWUpIDogYmluZGluZ0NvbnRleHQsIGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAga28udmlydHVhbEVsZW1lbnRzLmVtcHR5Tm9kZShlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGRpZERpc3BsYXlPbkxhc3RVcGRhdGUgPSBzaG91bGREaXNwbGF5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIG51bGwsIHsgZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkOiBlbGVtZW50IH0pO1xuICAgICAgICAgICAgcmV0dXJuIHsgJ2NvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzJzogdHJ1ZSB9O1xuICAgICAgICB9XG4gICAgfTtcbiAgICBrby5leHByZXNzaW9uUmV3cml0aW5nLmJpbmRpbmdSZXdyaXRlVmFsaWRhdG9yc1tiaW5kaW5nS2V5XSA9IGZhbHNlOyAvLyBDYW4ndCByZXdyaXRlIGNvbnRyb2wgZmxvdyBiaW5kaW5nc1xuICAgIGtvLnZpcnR1YWxFbGVtZW50cy5hbGxvd2VkQmluZGluZ3NbYmluZGluZ0tleV0gPSB0cnVlO1xufVxuXG4vLyBDb25zdHJ1Y3QgdGhlIGFjdHVhbCBiaW5kaW5nIGhhbmRsZXJzXG5tYWtlV2l0aElmQmluZGluZygnaWYnKTtcbm1ha2VXaXRoSWZCaW5kaW5nKCdpZm5vdCcsIGZhbHNlIC8qIGlzV2l0aCAqLywgdHJ1ZSAvKiBpc05vdCAqLyk7XG5tYWtlV2l0aElmQmluZGluZygnd2l0aCcsIHRydWUgLyogaXNXaXRoICovLCBmYWxzZSAvKiBpc05vdCAqLyxcbiAgICBmdW5jdGlvbihiaW5kaW5nQ29udGV4dCwgZGF0YVZhbHVlKSB7XG4gICAgICAgIHJldHVybiBiaW5kaW5nQ29udGV4dFsnY3JlYXRlQ2hpbGRDb250ZXh0J10oZGF0YVZhbHVlKTtcbiAgICB9XG4pO1xudmFyIGNhcHRpb25QbGFjZWhvbGRlciA9IHt9O1xua28uYmluZGluZ0hhbmRsZXJzWydvcHRpb25zJ10gPSB7XG4gICAgJ2luaXQnOiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIGlmIChrby51dGlscy50YWdOYW1lTG93ZXIoZWxlbWVudCkgIT09IFwic2VsZWN0XCIpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJvcHRpb25zIGJpbmRpbmcgYXBwbGllcyBvbmx5IHRvIFNFTEVDVCBlbGVtZW50c1wiKTtcblxuICAgICAgICAvLyBSZW1vdmUgYWxsIGV4aXN0aW5nIDxvcHRpb24+cy5cbiAgICAgICAgd2hpbGUgKGVsZW1lbnQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmUoMCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBFbnN1cmVzIHRoYXQgdGhlIGJpbmRpbmcgcHJvY2Vzc29yIGRvZXNuJ3QgdHJ5IHRvIGJpbmQgdGhlIG9wdGlvbnNcbiAgICAgICAgcmV0dXJuIHsgJ2NvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzJzogdHJ1ZSB9O1xuICAgIH0sXG4gICAgJ3VwZGF0ZSc6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5ncykge1xuICAgICAgICBmdW5jdGlvbiBzZWxlY3RlZE9wdGlvbnMoKSB7XG4gICAgICAgICAgICByZXR1cm4ga28udXRpbHMuYXJyYXlGaWx0ZXIoZWxlbWVudC5vcHRpb25zLCBmdW5jdGlvbiAobm9kZSkgeyByZXR1cm4gbm9kZS5zZWxlY3RlZDsgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2VsZWN0V2FzUHJldmlvdXNseUVtcHR5ID0gZWxlbWVudC5sZW5ndGggPT0gMDtcbiAgICAgICAgdmFyIHByZXZpb3VzU2Nyb2xsVG9wID0gKCFzZWxlY3RXYXNQcmV2aW91c2x5RW1wdHkgJiYgZWxlbWVudC5tdWx0aXBsZSkgPyBlbGVtZW50LnNjcm9sbFRvcCA6IG51bGw7XG4gICAgICAgIHZhciB1bndyYXBwZWRBcnJheSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpKTtcbiAgICAgICAgdmFyIGluY2x1ZGVEZXN0cm95ZWQgPSBhbGxCaW5kaW5ncy5nZXQoJ29wdGlvbnNJbmNsdWRlRGVzdHJveWVkJyk7XG4gICAgICAgIHZhciBhcnJheVRvRG9tTm9kZUNoaWxkcmVuT3B0aW9ucyA9IHt9O1xuICAgICAgICB2YXIgY2FwdGlvblZhbHVlO1xuICAgICAgICB2YXIgZmlsdGVyZWRBcnJheTtcbiAgICAgICAgdmFyIHByZXZpb3VzU2VsZWN0ZWRWYWx1ZXM7XG5cbiAgICAgICAgaWYgKGVsZW1lbnQubXVsdGlwbGUpIHtcbiAgICAgICAgICAgIHByZXZpb3VzU2VsZWN0ZWRWYWx1ZXMgPSBrby51dGlscy5hcnJheU1hcChzZWxlY3RlZE9wdGlvbnMoKSwga28uc2VsZWN0RXh0ZW5zaW9ucy5yZWFkVmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJldmlvdXNTZWxlY3RlZFZhbHVlcyA9IGVsZW1lbnQuc2VsZWN0ZWRJbmRleCA+PSAwID8gWyBrby5zZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZShlbGVtZW50Lm9wdGlvbnNbZWxlbWVudC5zZWxlY3RlZEluZGV4XSkgXSA6IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHVud3JhcHBlZEFycmF5KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHVud3JhcHBlZEFycmF5Lmxlbmd0aCA9PSBcInVuZGVmaW5lZFwiKSAvLyBDb2VyY2Ugc2luZ2xlIHZhbHVlIGludG8gYXJyYXlcbiAgICAgICAgICAgICAgICB1bndyYXBwZWRBcnJheSA9IFt1bndyYXBwZWRBcnJheV07XG5cbiAgICAgICAgICAgIC8vIEZpbHRlciBvdXQgYW55IGVudHJpZXMgbWFya2VkIGFzIGRlc3Ryb3llZFxuICAgICAgICAgICAgZmlsdGVyZWRBcnJheSA9IGtvLnV0aWxzLmFycmF5RmlsdGVyKHVud3JhcHBlZEFycmF5LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGluY2x1ZGVEZXN0cm95ZWQgfHwgaXRlbSA9PT0gdW5kZWZpbmVkIHx8IGl0ZW0gPT09IG51bGwgfHwgIWtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUoaXRlbVsnX2Rlc3Ryb3knXSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gSWYgY2FwdGlvbiBpcyBpbmNsdWRlZCwgYWRkIGl0IHRvIHRoZSBhcnJheVxuICAgICAgICAgICAgaWYgKGFsbEJpbmRpbmdzWydoYXMnXSgnb3B0aW9uc0NhcHRpb24nKSkge1xuICAgICAgICAgICAgICAgIGNhcHRpb25WYWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUoYWxsQmluZGluZ3MuZ2V0KCdvcHRpb25zQ2FwdGlvbicpKTtcbiAgICAgICAgICAgICAgICAvLyBJZiBjYXB0aW9uIHZhbHVlIGlzIG51bGwgb3IgdW5kZWZpbmVkLCBkb24ndCBzaG93IGEgY2FwdGlvblxuICAgICAgICAgICAgICAgIGlmIChjYXB0aW9uVmFsdWUgIT09IG51bGwgJiYgY2FwdGlvblZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWRBcnJheS51bnNoaWZ0KGNhcHRpb25QbGFjZWhvbGRlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSWYgYSBmYWxzeSB2YWx1ZSBpcyBwcm92aWRlZCAoZS5nLiBudWxsKSwgd2UnbGwgc2ltcGx5IGVtcHR5IHRoZSBzZWxlY3QgZWxlbWVudFxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYXBwbHlUb09iamVjdChvYmplY3QsIHByZWRpY2F0ZSwgZGVmYXVsdFZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgcHJlZGljYXRlVHlwZSA9IHR5cGVvZiBwcmVkaWNhdGU7XG4gICAgICAgICAgICBpZiAocHJlZGljYXRlVHlwZSA9PSBcImZ1bmN0aW9uXCIpICAgIC8vIEdpdmVuIGEgZnVuY3Rpb247IHJ1biBpdCBhZ2FpbnN0IHRoZSBkYXRhIHZhbHVlXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByZWRpY2F0ZShvYmplY3QpO1xuICAgICAgICAgICAgZWxzZSBpZiAocHJlZGljYXRlVHlwZSA9PSBcInN0cmluZ1wiKSAvLyBHaXZlbiBhIHN0cmluZzsgdHJlYXQgaXQgYXMgYSBwcm9wZXJ0eSBuYW1lIG9uIHRoZSBkYXRhIHZhbHVlXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iamVjdFtwcmVkaWNhdGVdO1xuICAgICAgICAgICAgZWxzZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2l2ZW4gbm8gb3B0aW9uc1RleHQgYXJnOyB1c2UgdGhlIGRhdGEgdmFsdWUgaXRzZWxmXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgZnVuY3Rpb25zIGNhbiBydW4gYXQgdHdvIGRpZmZlcmVudCB0aW1lczpcbiAgICAgICAgLy8gVGhlIGZpcnN0IGlzIHdoZW4gdGhlIHdob2xlIGFycmF5IGlzIGJlaW5nIHVwZGF0ZWQgZGlyZWN0bHkgZnJvbSB0aGlzIGJpbmRpbmcgaGFuZGxlci5cbiAgICAgICAgLy8gVGhlIHNlY29uZCBpcyB3aGVuIGFuIG9ic2VydmFibGUgdmFsdWUgZm9yIGEgc3BlY2lmaWMgYXJyYXkgZW50cnkgaXMgdXBkYXRlZC5cbiAgICAgICAgLy8gb2xkT3B0aW9ucyB3aWxsIGJlIGVtcHR5IGluIHRoZSBmaXJzdCBjYXNlLCBidXQgd2lsbCBiZSBmaWxsZWQgd2l0aCB0aGUgcHJldmlvdXNseSBnZW5lcmF0ZWQgb3B0aW9uIGluIHRoZSBzZWNvbmQuXG4gICAgICAgIHZhciBpdGVtVXBkYXRlID0gZmFsc2U7XG4gICAgICAgIGZ1bmN0aW9uIG9wdGlvbkZvckFycmF5SXRlbShhcnJheUVudHJ5LCBpbmRleCwgb2xkT3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKG9sZE9wdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcHJldmlvdXNTZWxlY3RlZFZhbHVlcyA9IG9sZE9wdGlvbnNbMF0uc2VsZWN0ZWQgPyBbIGtvLnNlbGVjdEV4dGVuc2lvbnMucmVhZFZhbHVlKG9sZE9wdGlvbnNbMF0pIF0gOiBbXTtcbiAgICAgICAgICAgICAgICBpdGVtVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBvcHRpb24gPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcbiAgICAgICAgICAgIGlmIChhcnJheUVudHJ5ID09PSBjYXB0aW9uUGxhY2Vob2xkZXIpIHtcbiAgICAgICAgICAgICAgICBrby51dGlscy5zZXRUZXh0Q29udGVudChvcHRpb24sIGFsbEJpbmRpbmdzLmdldCgnb3B0aW9uc0NhcHRpb24nKSk7XG4gICAgICAgICAgICAgICAga28uc2VsZWN0RXh0ZW5zaW9ucy53cml0ZVZhbHVlKG9wdGlvbiwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gQXBwbHkgYSB2YWx1ZSB0byB0aGUgb3B0aW9uIGVsZW1lbnRcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9uVmFsdWUgPSBhcHBseVRvT2JqZWN0KGFycmF5RW50cnksIGFsbEJpbmRpbmdzLmdldCgnb3B0aW9uc1ZhbHVlJyksIGFycmF5RW50cnkpO1xuICAgICAgICAgICAgICAgIGtvLnNlbGVjdEV4dGVuc2lvbnMud3JpdGVWYWx1ZShvcHRpb24sIGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUob3B0aW9uVmFsdWUpKTtcblxuICAgICAgICAgICAgICAgIC8vIEFwcGx5IHNvbWUgdGV4dCB0byB0aGUgb3B0aW9uIGVsZW1lbnRcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9uVGV4dCA9IGFwcGx5VG9PYmplY3QoYXJyYXlFbnRyeSwgYWxsQmluZGluZ3MuZ2V0KCdvcHRpb25zVGV4dCcpLCBvcHRpb25WYWx1ZSk7XG4gICAgICAgICAgICAgICAga28udXRpbHMuc2V0VGV4dENvbnRlbnQob3B0aW9uLCBvcHRpb25UZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBbb3B0aW9uXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJ5IHVzaW5nIGEgYmVmb3JlUmVtb3ZlIGNhbGxiYWNrLCB3ZSBkZWxheSB0aGUgcmVtb3ZhbCB1bnRpbCBhZnRlciBuZXcgaXRlbXMgYXJlIGFkZGVkLiBUaGlzIGZpeGVzIGEgc2VsZWN0aW9uXG4gICAgICAgIC8vIHByb2JsZW0gaW4gSUU8PTggYW5kIEZpcmVmb3guIFNlZSBodHRwczovL2dpdGh1Yi5jb20va25vY2tvdXQva25vY2tvdXQvaXNzdWVzLzEyMDhcbiAgICAgICAgYXJyYXlUb0RvbU5vZGVDaGlsZHJlbk9wdGlvbnNbJ2JlZm9yZVJlbW92ZSddID1cbiAgICAgICAgICAgIGZ1bmN0aW9uIChvcHRpb24pIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZUNoaWxkKG9wdGlvbik7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIHNldFNlbGVjdGlvbkNhbGxiYWNrKGFycmF5RW50cnksIG5ld09wdGlvbnMpIHtcbiAgICAgICAgICAgIC8vIElFNiBkb2Vzbid0IGxpa2UgdXMgdG8gYXNzaWduIHNlbGVjdGlvbiB0byBPUFRJT04gbm9kZXMgYmVmb3JlIHRoZXkncmUgYWRkZWQgdG8gdGhlIGRvY3VtZW50LlxuICAgICAgICAgICAgLy8gVGhhdCdzIHdoeSB3ZSBmaXJzdCBhZGRlZCB0aGVtIHdpdGhvdXQgc2VsZWN0aW9uLiBOb3cgaXQncyB0aW1lIHRvIHNldCB0aGUgc2VsZWN0aW9uLlxuICAgICAgICAgICAgaWYgKHByZXZpb3VzU2VsZWN0ZWRWYWx1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlzU2VsZWN0ZWQgPSBrby51dGlscy5hcnJheUluZGV4T2YocHJldmlvdXNTZWxlY3RlZFZhbHVlcywga28uc2VsZWN0RXh0ZW5zaW9ucy5yZWFkVmFsdWUobmV3T3B0aW9uc1swXSkpID49IDA7XG4gICAgICAgICAgICAgICAga28udXRpbHMuc2V0T3B0aW9uTm9kZVNlbGVjdGlvblN0YXRlKG5ld09wdGlvbnNbMF0sIGlzU2VsZWN0ZWQpO1xuXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhpcyBvcHRpb24gd2FzIGNoYW5nZWQgZnJvbSBiZWluZyBzZWxlY3RlZCBkdXJpbmcgYSBzaW5nbGUtaXRlbSB1cGRhdGUsIG5vdGlmeSB0aGUgY2hhbmdlXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1VcGRhdGUgJiYgIWlzU2VsZWN0ZWQpXG4gICAgICAgICAgICAgICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uaWdub3JlKGtvLnV0aWxzLnRyaWdnZXJFdmVudCwgbnVsbCwgW2VsZW1lbnQsIFwiY2hhbmdlXCJdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjYWxsYmFjayA9IHNldFNlbGVjdGlvbkNhbGxiYWNrO1xuICAgICAgICBpZiAoYWxsQmluZGluZ3NbJ2hhcyddKCdvcHRpb25zQWZ0ZXJSZW5kZXInKSkge1xuICAgICAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbihhcnJheUVudHJ5LCBuZXdPcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgc2V0U2VsZWN0aW9uQ2FsbGJhY2soYXJyYXlFbnRyeSwgbmV3T3B0aW9ucyk7XG4gICAgICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5pZ25vcmUoYWxsQmluZGluZ3MuZ2V0KCdvcHRpb25zQWZ0ZXJSZW5kZXInKSwgbnVsbCwgW25ld09wdGlvbnNbMF0sIGFycmF5RW50cnkgIT09IGNhcHRpb25QbGFjZWhvbGRlciA/IGFycmF5RW50cnkgOiB1bmRlZmluZWRdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGtvLnV0aWxzLnNldERvbU5vZGVDaGlsZHJlbkZyb21BcnJheU1hcHBpbmcoZWxlbWVudCwgZmlsdGVyZWRBcnJheSwgb3B0aW9uRm9yQXJyYXlJdGVtLCBhcnJheVRvRG9tTm9kZUNoaWxkcmVuT3B0aW9ucywgY2FsbGJhY2spO1xuXG4gICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uaWdub3JlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChhbGxCaW5kaW5ncy5nZXQoJ3ZhbHVlQWxsb3dVbnNldCcpICYmIGFsbEJpbmRpbmdzWydoYXMnXSgndmFsdWUnKSkge1xuICAgICAgICAgICAgICAgIC8vIFRoZSBtb2RlbCB2YWx1ZSBpcyBhdXRob3JpdGF0aXZlLCBzbyBtYWtlIHN1cmUgaXRzIHZhbHVlIGlzIHRoZSBvbmUgc2VsZWN0ZWRcbiAgICAgICAgICAgICAgICBrby5zZWxlY3RFeHRlbnNpb25zLndyaXRlVmFsdWUoZWxlbWVudCwga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShhbGxCaW5kaW5ncy5nZXQoJ3ZhbHVlJykpLCB0cnVlIC8qIGFsbG93VW5zZXQgKi8pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBEZXRlcm1pbmUgaWYgdGhlIHNlbGVjdGlvbiBoYXMgY2hhbmdlZCBhcyBhIHJlc3VsdCBvZiB1cGRhdGluZyB0aGUgb3B0aW9ucyBsaXN0XG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdGlvbkNoYW5nZWQ7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQubXVsdGlwbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRm9yIGEgbXVsdGlwbGUtc2VsZWN0IGJveCwgY29tcGFyZSB0aGUgbmV3IHNlbGVjdGlvbiBjb3VudCB0byB0aGUgcHJldmlvdXMgb25lXG4gICAgICAgICAgICAgICAgICAgIC8vIEJ1dCBpZiBub3RoaW5nIHdhcyBzZWxlY3RlZCBiZWZvcmUsIHRoZSBzZWxlY3Rpb24gY2FuJ3QgaGF2ZSBjaGFuZ2VkXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbkNoYW5nZWQgPSBwcmV2aW91c1NlbGVjdGVkVmFsdWVzLmxlbmd0aCAmJiBzZWxlY3RlZE9wdGlvbnMoKS5sZW5ndGggPCBwcmV2aW91c1NlbGVjdGVkVmFsdWVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBGb3IgYSBzaW5nbGUtc2VsZWN0IGJveCwgY29tcGFyZSB0aGUgY3VycmVudCB2YWx1ZSB0byB0aGUgcHJldmlvdXMgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgLy8gQnV0IGlmIG5vdGhpbmcgd2FzIHNlbGVjdGVkIGJlZm9yZSBvciBub3RoaW5nIGlzIHNlbGVjdGVkIG5vdywganVzdCBsb29rIGZvciBhIGNoYW5nZSBpbiBzZWxlY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uQ2hhbmdlZCA9IChwcmV2aW91c1NlbGVjdGVkVmFsdWVzLmxlbmd0aCAmJiBlbGVtZW50LnNlbGVjdGVkSW5kZXggPj0gMClcbiAgICAgICAgICAgICAgICAgICAgICAgID8gKGtvLnNlbGVjdEV4dGVuc2lvbnMucmVhZFZhbHVlKGVsZW1lbnQub3B0aW9uc1tlbGVtZW50LnNlbGVjdGVkSW5kZXhdKSAhPT0gcHJldmlvdXNTZWxlY3RlZFZhbHVlc1swXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIDogKHByZXZpb3VzU2VsZWN0ZWRWYWx1ZXMubGVuZ3RoIHx8IGVsZW1lbnQuc2VsZWN0ZWRJbmRleCA+PSAwKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBFbnN1cmUgY29uc2lzdGVuY3kgYmV0d2VlbiBtb2RlbCB2YWx1ZSBhbmQgc2VsZWN0ZWQgb3B0aW9uLlxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBkcm9wZG93biB3YXMgY2hhbmdlZCBzbyB0aGF0IHNlbGVjdGlvbiBpcyBubyBsb25nZXIgdGhlIHNhbWUsXG4gICAgICAgICAgICAgICAgLy8gbm90aWZ5IHRoZSB2YWx1ZSBvciBzZWxlY3RlZE9wdGlvbnMgYmluZGluZy5cbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0aW9uQ2hhbmdlZCkge1xuICAgICAgICAgICAgICAgICAgICBrby51dGlscy50cmlnZ2VyRXZlbnQoZWxlbWVudCwgXCJjaGFuZ2VcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBXb3JrYXJvdW5kIGZvciBJRSBidWdcbiAgICAgICAga28udXRpbHMuZW5zdXJlU2VsZWN0RWxlbWVudElzUmVuZGVyZWRDb3JyZWN0bHkoZWxlbWVudCk7XG5cbiAgICAgICAgaWYgKHByZXZpb3VzU2Nyb2xsVG9wICYmIE1hdGguYWJzKHByZXZpb3VzU2Nyb2xsVG9wIC0gZWxlbWVudC5zY3JvbGxUb3ApID4gMjApXG4gICAgICAgICAgICBlbGVtZW50LnNjcm9sbFRvcCA9IHByZXZpb3VzU2Nyb2xsVG9wO1xuICAgIH1cbn07XG5rby5iaW5kaW5nSGFuZGxlcnNbJ29wdGlvbnMnXS5vcHRpb25WYWx1ZURvbURhdGFLZXkgPSBrby51dGlscy5kb21EYXRhLm5leHRLZXkoKTtcbmtvLmJpbmRpbmdIYW5kbGVyc1snc2VsZWN0ZWRPcHRpb25zJ10gPSB7XG4gICAgJ2FmdGVyJzogWydvcHRpb25zJywgJ2ZvcmVhY2gnXSxcbiAgICAnaW5pdCc6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5ncykge1xuICAgICAgICBrby51dGlscy5yZWdpc3RlckV2ZW50SGFuZGxlcihlbGVtZW50LCBcImNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB2YWx1ZUFjY2Vzc29yKCksIHZhbHVlVG9Xcml0ZSA9IFtdO1xuICAgICAgICAgICAga28udXRpbHMuYXJyYXlGb3JFYWNoKGVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJvcHRpb25cIiksIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5zZWxlY3RlZClcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVUb1dyaXRlLnB1c2goa28uc2VsZWN0RXh0ZW5zaW9ucy5yZWFkVmFsdWUobm9kZSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBrby5leHByZXNzaW9uUmV3cml0aW5nLndyaXRlVmFsdWVUb1Byb3BlcnR5KHZhbHVlLCBhbGxCaW5kaW5ncywgJ3NlbGVjdGVkT3B0aW9ucycsIHZhbHVlVG9Xcml0ZSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgJ3VwZGF0ZSc6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yKSB7XG4gICAgICAgIGlmIChrby51dGlscy50YWdOYW1lTG93ZXIoZWxlbWVudCkgIT0gXCJzZWxlY3RcIilcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInZhbHVlcyBiaW5kaW5nIGFwcGxpZXMgb25seSB0byBTRUxFQ1QgZWxlbWVudHNcIik7XG5cbiAgICAgICAgdmFyIG5ld1ZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZUFjY2Vzc29yKCkpO1xuICAgICAgICBpZiAobmV3VmFsdWUgJiYgdHlwZW9mIG5ld1ZhbHVlLmxlbmd0aCA9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICBrby51dGlscy5hcnJheUZvckVhY2goZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIm9wdGlvblwiKSwgZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgICAgIHZhciBpc1NlbGVjdGVkID0ga28udXRpbHMuYXJyYXlJbmRleE9mKG5ld1ZhbHVlLCBrby5zZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZShub2RlKSkgPj0gMDtcbiAgICAgICAgICAgICAgICBrby51dGlscy5zZXRPcHRpb25Ob2RlU2VsZWN0aW9uU3RhdGUobm9kZSwgaXNTZWxlY3RlZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5rby5leHByZXNzaW9uUmV3cml0aW5nLnR3b1dheUJpbmRpbmdzWydzZWxlY3RlZE9wdGlvbnMnXSA9IHRydWU7XG5rby5iaW5kaW5nSGFuZGxlcnNbJ3N0eWxlJ10gPSB7XG4gICAgJ3VwZGF0ZSc6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpIHx8IHt9KTtcbiAgICAgICAga28udXRpbHMub2JqZWN0Rm9yRWFjaCh2YWx1ZSwgZnVuY3Rpb24oc3R5bGVOYW1lLCBzdHlsZVZhbHVlKSB7XG4gICAgICAgICAgICBzdHlsZVZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShzdHlsZVZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKHN0eWxlVmFsdWUgPT09IG51bGwgfHwgc3R5bGVWYWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHN0eWxlVmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgLy8gRW1wdHkgc3RyaW5nIHJlbW92ZXMgdGhlIHZhbHVlLCB3aGVyZWFzIG51bGwvdW5kZWZpbmVkIGhhdmUgbm8gZWZmZWN0XG4gICAgICAgICAgICAgICAgc3R5bGVWYWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGVbc3R5bGVOYW1lXSA9IHN0eWxlVmFsdWU7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5rby5iaW5kaW5nSGFuZGxlcnNbJ3N1Ym1pdCddID0ge1xuICAgICdpbml0JzogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzLCB2aWV3TW9kZWwsIGJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWVBY2Nlc3NvcigpICE9IFwiZnVuY3Rpb25cIilcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSB2YWx1ZSBmb3IgYSBzdWJtaXQgYmluZGluZyBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG4gICAgICAgIGtvLnV0aWxzLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKGVsZW1lbnQsIFwic3VibWl0XCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIGhhbmRsZXJSZXR1cm5WYWx1ZTtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHZhbHVlQWNjZXNzb3IoKTtcbiAgICAgICAgICAgIHRyeSB7IGhhbmRsZXJSZXR1cm5WYWx1ZSA9IHZhbHVlLmNhbGwoYmluZGluZ0NvbnRleHRbJyRkYXRhJ10sIGVsZW1lbnQpOyB9XG4gICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICBpZiAoaGFuZGxlclJldHVyblZhbHVlICE9PSB0cnVlKSB7IC8vIE5vcm1hbGx5IHdlIHdhbnQgdG8gcHJldmVudCBkZWZhdWx0IGFjdGlvbi4gRGV2ZWxvcGVyIGNhbiBvdmVycmlkZSB0aGlzIGJlIGV4cGxpY2l0bHkgcmV0dXJuaW5nIHRydWUuXG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5wcmV2ZW50RGVmYXVsdClcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59O1xua28uYmluZGluZ0hhbmRsZXJzWyd0ZXh0J10gPSB7XG4gICAgJ2luaXQnOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gUHJldmVudCBiaW5kaW5nIG9uIHRoZSBkeW5hbWljYWxseS1pbmplY3RlZCB0ZXh0IG5vZGUgKGFzIGRldmVsb3BlcnMgYXJlIHVubGlrZWx5IHRvIGV4cGVjdCB0aGF0LCBhbmQgaXQgaGFzIHNlY3VyaXR5IGltcGxpY2F0aW9ucykuXG4gICAgICAgIC8vIEl0IHNob3VsZCBhbHNvIG1ha2UgdGhpbmdzIGZhc3RlciwgYXMgd2Ugbm8gbG9uZ2VyIGhhdmUgdG8gY29uc2lkZXIgd2hldGhlciB0aGUgdGV4dCBub2RlIG1pZ2h0IGJlIGJpbmRhYmxlLlxuICAgICAgICByZXR1cm4geyAnY29udHJvbHNEZXNjZW5kYW50QmluZGluZ3MnOiB0cnVlIH07XG4gICAgfSxcbiAgICAndXBkYXRlJzogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IpIHtcbiAgICAgICAga28udXRpbHMuc2V0VGV4dENvbnRlbnQoZWxlbWVudCwgdmFsdWVBY2Nlc3NvcigpKTtcbiAgICB9XG59O1xua28udmlydHVhbEVsZW1lbnRzLmFsbG93ZWRCaW5kaW5nc1sndGV4dCddID0gdHJ1ZTtcbihmdW5jdGlvbiAoKSB7XG5cbmlmICh3aW5kb3cgJiYgd2luZG93Lm5hdmlnYXRvcikge1xuICAgIHZhciBwYXJzZVZlcnNpb24gPSBmdW5jdGlvbiAobWF0Y2hlcykge1xuICAgICAgICBpZiAobWF0Y2hlcykge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQobWF0Y2hlc1sxXSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gRGV0ZWN0IHZhcmlvdXMgYnJvd3NlciB2ZXJzaW9ucyBiZWNhdXNlIHNvbWUgb2xkIHZlcnNpb25zIGRvbid0IGZ1bGx5IHN1cHBvcnQgdGhlICdpbnB1dCcgZXZlbnRcbiAgICB2YXIgb3BlcmFWZXJzaW9uID0gd2luZG93Lm9wZXJhICYmIHdpbmRvdy5vcGVyYS52ZXJzaW9uICYmIHBhcnNlSW50KHdpbmRvdy5vcGVyYS52ZXJzaW9uKCkpLFxuICAgICAgICB1c2VyQWdlbnQgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCxcbiAgICAgICAgc2FmYXJpVmVyc2lvbiA9IHBhcnNlVmVyc2lvbih1c2VyQWdlbnQubWF0Y2goL14oPzooPyFjaHJvbWUpLikqdmVyc2lvblxcLyhbXiBdKikgc2FmYXJpL2kpKSxcbiAgICAgICAgZmlyZWZveFZlcnNpb24gPSBwYXJzZVZlcnNpb24odXNlckFnZW50Lm1hdGNoKC9GaXJlZm94XFwvKFteIF0qKS8pKTtcbn1cblxuLy8gSUUgOCBhbmQgOSBoYXZlIGJ1Z3MgdGhhdCBwcmV2ZW50IHRoZSBub3JtYWwgZXZlbnRzIGZyb20gZmlyaW5nIHdoZW4gdGhlIHZhbHVlIGNoYW5nZXMuXG4vLyBCdXQgaXQgZG9lcyBmaXJlIHRoZSAnc2VsZWN0aW9uY2hhbmdlJyBldmVudCBvbiBtYW55IG9mIHRob3NlLCBwcmVzdW1hYmx5IGJlY2F1c2UgdGhlXG4vLyBjdXJzb3IgaXMgbW92aW5nIGFuZCB0aGF0IGNvdW50cyBhcyB0aGUgc2VsZWN0aW9uIGNoYW5naW5nLiBUaGUgJ3NlbGVjdGlvbmNoYW5nZScgZXZlbnQgaXNcbi8vIGZpcmVkIGF0IHRoZSBkb2N1bWVudCBsZXZlbCBvbmx5IGFuZCBkb2Vzbid0IGRpcmVjdGx5IGluZGljYXRlIHdoaWNoIGVsZW1lbnQgY2hhbmdlZC4gV2Vcbi8vIHNldCB1cCBqdXN0IG9uZSBldmVudCBoYW5kbGVyIGZvciB0aGUgZG9jdW1lbnQgYW5kIHVzZSAnYWN0aXZlRWxlbWVudCcgdG8gZGV0ZXJtaW5lIHdoaWNoXG4vLyBlbGVtZW50IHdhcyBjaGFuZ2VkLlxuaWYgKGtvLnV0aWxzLmllVmVyc2lvbiA8IDEwKSB7XG4gICAgdmFyIHNlbGVjdGlvbkNoYW5nZVJlZ2lzdGVyZWROYW1lID0ga28udXRpbHMuZG9tRGF0YS5uZXh0S2V5KCksXG4gICAgICAgIHNlbGVjdGlvbkNoYW5nZUhhbmRsZXJOYW1lID0ga28udXRpbHMuZG9tRGF0YS5uZXh0S2V5KCk7XG4gICAgdmFyIHNlbGVjdGlvbkNoYW5nZUhhbmRsZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgdGFyZ2V0ID0gdGhpcy5hY3RpdmVFbGVtZW50LFxuICAgICAgICAgICAgaGFuZGxlciA9IHRhcmdldCAmJiBrby51dGlscy5kb21EYXRhLmdldCh0YXJnZXQsIHNlbGVjdGlvbkNoYW5nZUhhbmRsZXJOYW1lKTtcbiAgICAgICAgaWYgKGhhbmRsZXIpIHtcbiAgICAgICAgICAgIGhhbmRsZXIoZXZlbnQpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICB2YXIgcmVnaXN0ZXJGb3JTZWxlY3Rpb25DaGFuZ2VFdmVudCA9IGZ1bmN0aW9uIChlbGVtZW50LCBoYW5kbGVyKSB7XG4gICAgICAgIHZhciBvd25lckRvYyA9IGVsZW1lbnQub3duZXJEb2N1bWVudDtcbiAgICAgICAgaWYgKCFrby51dGlscy5kb21EYXRhLmdldChvd25lckRvYywgc2VsZWN0aW9uQ2hhbmdlUmVnaXN0ZXJlZE5hbWUpKSB7XG4gICAgICAgICAgICBrby51dGlscy5kb21EYXRhLnNldChvd25lckRvYywgc2VsZWN0aW9uQ2hhbmdlUmVnaXN0ZXJlZE5hbWUsIHRydWUpO1xuICAgICAgICAgICAga28udXRpbHMucmVnaXN0ZXJFdmVudEhhbmRsZXIob3duZXJEb2MsICdzZWxlY3Rpb25jaGFuZ2UnLCBzZWxlY3Rpb25DaGFuZ2VIYW5kbGVyKTtcbiAgICAgICAgfVxuICAgICAgICBrby51dGlscy5kb21EYXRhLnNldChlbGVtZW50LCBzZWxlY3Rpb25DaGFuZ2VIYW5kbGVyTmFtZSwgaGFuZGxlcik7XG4gICAgfTtcbn1cblxua28uYmluZGluZ0hhbmRsZXJzWyd0ZXh0SW5wdXQnXSA9IHtcbiAgICAnaW5pdCc6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5ncykge1xuXG4gICAgICAgIHZhciBwcmV2aW91c0VsZW1lbnRWYWx1ZSA9IGVsZW1lbnQudmFsdWUsXG4gICAgICAgICAgICB0aW1lb3V0SGFuZGxlLFxuICAgICAgICAgICAgZWxlbWVudFZhbHVlQmVmb3JlRXZlbnQ7XG5cbiAgICAgICAgdmFyIHVwZGF0ZU1vZGVsID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dEhhbmRsZSk7XG4gICAgICAgICAgICBlbGVtZW50VmFsdWVCZWZvcmVFdmVudCA9IHRpbWVvdXRIYW5kbGUgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIHZhciBlbGVtZW50VmFsdWUgPSBlbGVtZW50LnZhbHVlO1xuICAgICAgICAgICAgaWYgKHByZXZpb3VzRWxlbWVudFZhbHVlICE9PSBlbGVtZW50VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAvLyBQcm92aWRlIGEgd2F5IGZvciB0ZXN0cyB0byBrbm93IGV4YWN0bHkgd2hpY2ggZXZlbnQgd2FzIHByb2Nlc3NlZFxuICAgICAgICAgICAgICAgIGlmIChERUJVRyAmJiBldmVudCkgZWxlbWVudFsnX2tvX3RleHRJbnB1dFByb2Nlc3NlZEV2ZW50J10gPSBldmVudC50eXBlO1xuICAgICAgICAgICAgICAgIHByZXZpb3VzRWxlbWVudFZhbHVlID0gZWxlbWVudFZhbHVlO1xuICAgICAgICAgICAgICAgIGtvLmV4cHJlc3Npb25SZXdyaXRpbmcud3JpdGVWYWx1ZVRvUHJvcGVydHkodmFsdWVBY2Nlc3NvcigpLCBhbGxCaW5kaW5ncywgJ3RleHRJbnB1dCcsIGVsZW1lbnRWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGRlZmVyVXBkYXRlTW9kZWwgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmICghdGltZW91dEhhbmRsZSkge1xuICAgICAgICAgICAgICAgIC8vIFRoZSBlbGVtZW50VmFsdWVCZWZvcmVFdmVudCB2YXJpYWJsZSBpcyBzZXQgKm9ubHkqIGR1cmluZyB0aGUgYnJpZWYgZ2FwIGJldHdlZW4gYW5cbiAgICAgICAgICAgICAgICAvLyBldmVudCBmaXJpbmcgYW5kIHRoZSB1cGRhdGVNb2RlbCBmdW5jdGlvbiBydW5uaW5nLiBUaGlzIGFsbG93cyB1cyB0byBpZ25vcmUgbW9kZWxcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGVzIHRoYXQgYXJlIGZyb20gdGhlIHByZXZpb3VzIHN0YXRlIG9mIHRoZSBlbGVtZW50LCB1c3VhbGx5IGR1ZSB0byB0ZWNobmlxdWVzXG4gICAgICAgICAgICAgICAgLy8gc3VjaCBhcyByYXRlTGltaXQuIFN1Y2ggdXBkYXRlcywgaWYgbm90IGlnbm9yZWQsIGNhbiBjYXVzZSBrZXlzdHJva2VzIHRvIGJlIGxvc3QuXG4gICAgICAgICAgICAgICAgZWxlbWVudFZhbHVlQmVmb3JlRXZlbnQgPSBlbGVtZW50LnZhbHVlO1xuICAgICAgICAgICAgICAgIHZhciBoYW5kbGVyID0gREVCVUcgPyB1cGRhdGVNb2RlbC5iaW5kKGVsZW1lbnQsIHt0eXBlOiBldmVudC50eXBlfSkgOiB1cGRhdGVNb2RlbDtcbiAgICAgICAgICAgICAgICB0aW1lb3V0SGFuZGxlID0gc2V0VGltZW91dChoYW5kbGVyLCA0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgdXBkYXRlVmlldyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBtb2RlbFZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZUFjY2Vzc29yKCkpO1xuXG4gICAgICAgICAgICBpZiAobW9kZWxWYWx1ZSA9PT0gbnVsbCB8fCBtb2RlbFZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBtb2RlbFZhbHVlID0gJyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChlbGVtZW50VmFsdWVCZWZvcmVFdmVudCAhPT0gdW5kZWZpbmVkICYmIG1vZGVsVmFsdWUgPT09IGVsZW1lbnRWYWx1ZUJlZm9yZUV2ZW50KSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCh1cGRhdGVWaWV3LCA0KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgZWxlbWVudCBvbmx5IGlmIHRoZSBlbGVtZW50IGFuZCBtb2RlbCBhcmUgZGlmZmVyZW50LiBPbiBzb21lIGJyb3dzZXJzLCB1cGRhdGluZyB0aGUgdmFsdWVcbiAgICAgICAgICAgIC8vIHdpbGwgbW92ZSB0aGUgY3Vyc29yIHRvIHRoZSBlbmQgb2YgdGhlIGlucHV0LCB3aGljaCB3b3VsZCBiZSBiYWQgd2hpbGUgdGhlIHVzZXIgaXMgdHlwaW5nLlxuICAgICAgICAgICAgaWYgKGVsZW1lbnQudmFsdWUgIT09IG1vZGVsVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBwcmV2aW91c0VsZW1lbnRWYWx1ZSA9IG1vZGVsVmFsdWU7ICAvLyBNYWtlIHN1cmUgd2UgaWdub3JlIGV2ZW50cyAocHJvcGVydHljaGFuZ2UpIHRoYXQgcmVzdWx0IGZyb20gdXBkYXRpbmcgdGhlIHZhbHVlXG4gICAgICAgICAgICAgICAgZWxlbWVudC52YWx1ZSA9IG1vZGVsVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIG9uRXZlbnQgPSBmdW5jdGlvbiAoZXZlbnQsIGhhbmRsZXIpIHtcbiAgICAgICAgICAgIGtvLnV0aWxzLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKGVsZW1lbnQsIGV2ZW50LCBoYW5kbGVyKTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoREVCVUcgJiYga28uYmluZGluZ0hhbmRsZXJzWyd0ZXh0SW5wdXQnXVsnX2ZvcmNlVXBkYXRlT24nXSkge1xuICAgICAgICAgICAgLy8gUHJvdmlkZSBhIHdheSBmb3IgdGVzdHMgdG8gc3BlY2lmeSBleGFjdGx5IHdoaWNoIGV2ZW50cyBhcmUgYm91bmRcbiAgICAgICAgICAgIGtvLnV0aWxzLmFycmF5Rm9yRWFjaChrby5iaW5kaW5nSGFuZGxlcnNbJ3RleHRJbnB1dCddWydfZm9yY2VVcGRhdGVPbiddLCBmdW5jdGlvbihldmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnROYW1lLnNsaWNlKDAsNSkgPT0gJ2FmdGVyJykge1xuICAgICAgICAgICAgICAgICAgICBvbkV2ZW50KGV2ZW50TmFtZS5zbGljZSg1KSwgZGVmZXJVcGRhdGVNb2RlbCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgb25FdmVudChldmVudE5hbWUsIHVwZGF0ZU1vZGVsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChrby51dGlscy5pZVZlcnNpb24gPCAxMCkge1xuICAgICAgICAgICAgICAgIC8vIEludGVybmV0IEV4cGxvcmVyIDw9IDggZG9lc24ndCBzdXBwb3J0IHRoZSAnaW5wdXQnIGV2ZW50LCBidXQgZG9lcyBpbmNsdWRlICdwcm9wZXJ0eWNoYW5nZScgdGhhdCBmaXJlcyB3aGVuZXZlclxuICAgICAgICAgICAgICAgIC8vIGFueSBwcm9wZXJ0eSBvZiBhbiBlbGVtZW50IGNoYW5nZXMuIFVubGlrZSAnaW5wdXQnLCBpdCBhbHNvIGZpcmVzIGlmIGEgcHJvcGVydHkgaXMgY2hhbmdlZCBmcm9tIEphdmFTY3JpcHQgY29kZSxcbiAgICAgICAgICAgICAgICAvLyBidXQgdGhhdCdzIGFuIGFjY2VwdGFibGUgY29tcHJvbWlzZSBmb3IgdGhpcyBiaW5kaW5nLiBJRSA5IGRvZXMgc3VwcG9ydCAnaW5wdXQnLCBidXQgc2luY2UgaXQgZG9lc24ndCBmaXJlIGl0XG4gICAgICAgICAgICAgICAgLy8gd2hlbiB1c2luZyBhdXRvY29tcGxldGUsIHdlJ2xsIHVzZSAncHJvcGVydHljaGFuZ2UnIGZvciBpdCBhbHNvLlxuICAgICAgICAgICAgICAgIG9uRXZlbnQoJ3Byb3BlcnR5Y2hhbmdlJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LnByb3BlcnR5TmFtZSA9PT0gJ3ZhbHVlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlTW9kZWwoZXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoa28udXRpbHMuaWVWZXJzaW9uID09IDgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSUUgOCBoYXMgYSBidWcgd2hlcmUgaXQgZmFpbHMgdG8gZmlyZSAncHJvcGVydHljaGFuZ2UnIG9uIHRoZSBmaXJzdCB1cGRhdGUgZm9sbG93aW5nIGEgdmFsdWUgY2hhbmdlIGZyb21cbiAgICAgICAgICAgICAgICAgICAgLy8gSmF2YVNjcmlwdCBjb2RlLiBJdCBhbHNvIGRvZXNuJ3QgZmlyZSBpZiB5b3UgY2xlYXIgdGhlIGVudGlyZSB2YWx1ZS4gVG8gZml4IHRoaXMsIHdlIGJpbmQgdG8gdGhlIGZvbGxvd2luZ1xuICAgICAgICAgICAgICAgICAgICAvLyBldmVudHMgdG9vLlxuICAgICAgICAgICAgICAgICAgICBvbkV2ZW50KCdrZXl1cCcsIHVwZGF0ZU1vZGVsKTsgICAgICAvLyBBIHNpbmdsZSBrZXlzdG9rZVxuICAgICAgICAgICAgICAgICAgICBvbkV2ZW50KCdrZXlkb3duJywgdXBkYXRlTW9kZWwpOyAgICAvLyBUaGUgZmlyc3QgY2hhcmFjdGVyIHdoZW4gYSBrZXkgaXMgaGVsZCBkb3duXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChrby51dGlscy5pZVZlcnNpb24gPj0gOCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBJbnRlcm5ldCBFeHBsb3JlciA5IGRvZXNuJ3QgZmlyZSB0aGUgJ2lucHV0JyBldmVudCB3aGVuIGRlbGV0aW5nIHRleHQsIGluY2x1ZGluZyB1c2luZ1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgYmFja3NwYWNlLCBkZWxldGUsIG9yIGN0cmwteCBrZXlzLCBjbGlja2luZyB0aGUgJ3gnIHRvIGNsZWFyIHRoZSBpbnB1dCwgZHJhZ2dpbmcgdGV4dFxuICAgICAgICAgICAgICAgICAgICAvLyBvdXQgb2YgdGhlIGZpZWxkLCBhbmQgY3V0dGluZyBvciBkZWxldGluZyB0ZXh0IHVzaW5nIHRoZSBjb250ZXh0IG1lbnUuICdzZWxlY3Rpb25jaGFuZ2UnXG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbiBkZXRlY3QgYWxsIG9mIHRob3NlIGV4Y2VwdCBkcmFnZ2luZyB0ZXh0IG91dCBvZiB0aGUgZmllbGQsIGZvciB3aGljaCB3ZSB1c2UgJ2RyYWdlbmQnLlxuICAgICAgICAgICAgICAgICAgICAvLyBUaGVzZSBhcmUgYWxzbyBuZWVkZWQgaW4gSUU4IGJlY2F1c2Ugb2YgdGhlIGJ1ZyBkZXNjcmliZWQgYWJvdmUuXG4gICAgICAgICAgICAgICAgICAgIHJlZ2lzdGVyRm9yU2VsZWN0aW9uQ2hhbmdlRXZlbnQoZWxlbWVudCwgdXBkYXRlTW9kZWwpOyAgLy8gJ3NlbGVjdGlvbmNoYW5nZScgY292ZXJzIGN1dCwgcGFzdGUsIGRyb3AsIGRlbGV0ZSwgZXRjLlxuICAgICAgICAgICAgICAgICAgICBvbkV2ZW50KCdkcmFnZW5kJywgZGVmZXJVcGRhdGVNb2RlbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBBbGwgb3RoZXIgc3VwcG9ydGVkIGJyb3dzZXJzIHN1cHBvcnQgdGhlICdpbnB1dCcgZXZlbnQsIHdoaWNoIGZpcmVzIHdoZW5ldmVyIHRoZSBjb250ZW50IG9mIHRoZSBlbGVtZW50IGlzIGNoYW5nZWRcbiAgICAgICAgICAgICAgICAvLyB0aHJvdWdoIHRoZSB1c2VyIGludGVyZmFjZS5cbiAgICAgICAgICAgICAgICBvbkV2ZW50KCdpbnB1dCcsIHVwZGF0ZU1vZGVsKTtcblxuICAgICAgICAgICAgICAgIGlmIChzYWZhcmlWZXJzaW9uIDwgNSAmJiBrby51dGlscy50YWdOYW1lTG93ZXIoZWxlbWVudCkgPT09IFwidGV4dGFyZWFcIikge1xuICAgICAgICAgICAgICAgICAgICAvLyBTYWZhcmkgPDUgZG9lc24ndCBmaXJlIHRoZSAnaW5wdXQnIGV2ZW50IGZvciA8dGV4dGFyZWE+IGVsZW1lbnRzIChpdCBkb2VzIGZpcmUgJ3RleHRJbnB1dCdcbiAgICAgICAgICAgICAgICAgICAgLy8gYnV0IG9ubHkgd2hlbiB0eXBpbmcpLiBTbyB3ZSdsbCBqdXN0IGNhdGNoIGFzIG11Y2ggYXMgd2UgY2FuIHdpdGgga2V5ZG93biwgY3V0LCBhbmQgcGFzdGUuXG4gICAgICAgICAgICAgICAgICAgIG9uRXZlbnQoJ2tleWRvd24nLCBkZWZlclVwZGF0ZU1vZGVsKTtcbiAgICAgICAgICAgICAgICAgICAgb25FdmVudCgncGFzdGUnLCBkZWZlclVwZGF0ZU1vZGVsKTtcbiAgICAgICAgICAgICAgICAgICAgb25FdmVudCgnY3V0JywgZGVmZXJVcGRhdGVNb2RlbCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYVZlcnNpb24gPCAxMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBPcGVyYSAxMCBkb2Vzbid0IGFsd2F5cyBmaXJlIHRoZSAnaW5wdXQnIGV2ZW50IGZvciBjdXQsIHBhc3RlLCB1bmRvICYgZHJvcCBvcGVyYXRpb25zLlxuICAgICAgICAgICAgICAgICAgICAvLyBXZSBjYW4gdHJ5IHRvIGNhdGNoIHNvbWUgb2YgdGhvc2UgdXNpbmcgJ2tleWRvd24nLlxuICAgICAgICAgICAgICAgICAgICBvbkV2ZW50KCdrZXlkb3duJywgZGVmZXJVcGRhdGVNb2RlbCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChmaXJlZm94VmVyc2lvbiA8IDQuMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBGaXJlZm94IDw9IDMuNiBkb2Vzbid0IGZpcmUgdGhlICdpbnB1dCcgZXZlbnQgd2hlbiB0ZXh0IGlzIGZpbGxlZCBpbiB0aHJvdWdoIGF1dG9jb21wbGV0ZVxuICAgICAgICAgICAgICAgICAgICBvbkV2ZW50KCdET01BdXRvQ29tcGxldGUnLCB1cGRhdGVNb2RlbCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRmlyZWZveCA8PTMuNSBkb2Vzbid0IGZpcmUgdGhlICdpbnB1dCcgZXZlbnQgd2hlbiB0ZXh0IGlzIGRyb3BwZWQgaW50byB0aGUgaW5wdXQuXG4gICAgICAgICAgICAgICAgICAgIG9uRXZlbnQoJ2RyYWdkcm9wJywgdXBkYXRlTW9kZWwpOyAgICAgICAvLyA8My41XG4gICAgICAgICAgICAgICAgICAgIG9uRXZlbnQoJ2Ryb3AnLCB1cGRhdGVNb2RlbCk7ICAgICAgICAgICAvLyAzLjVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCaW5kIHRvIHRoZSBjaGFuZ2UgZXZlbnQgc28gdGhhdCB3ZSBjYW4gY2F0Y2ggcHJvZ3JhbW1hdGljIHVwZGF0ZXMgb2YgdGhlIHZhbHVlIHRoYXQgZmlyZSB0aGlzIGV2ZW50LlxuICAgICAgICBvbkV2ZW50KCdjaGFuZ2UnLCB1cGRhdGVNb2RlbCk7XG5cbiAgICAgICAga28uY29tcHV0ZWQodXBkYXRlVmlldywgbnVsbCwgeyBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IGVsZW1lbnQgfSk7XG4gICAgfVxufTtcbmtvLmV4cHJlc3Npb25SZXdyaXRpbmcudHdvV2F5QmluZGluZ3NbJ3RleHRJbnB1dCddID0gdHJ1ZTtcblxuLy8gdGV4dGlucHV0IGlzIGFuIGFsaWFzIGZvciB0ZXh0SW5wdXRcbmtvLmJpbmRpbmdIYW5kbGVyc1sndGV4dGlucHV0J10gPSB7XG4gICAgLy8gcHJlcHJvY2VzcyBpcyB0aGUgb25seSB3YXkgdG8gc2V0IHVwIGEgZnVsbCBhbGlhc1xuICAgICdwcmVwcm9jZXNzJzogZnVuY3Rpb24gKHZhbHVlLCBuYW1lLCBhZGRCaW5kaW5nKSB7XG4gICAgICAgIGFkZEJpbmRpbmcoJ3RleHRJbnB1dCcsIHZhbHVlKTtcbiAgICB9XG59O1xuXG59KSgpO2tvLmJpbmRpbmdIYW5kbGVyc1sndW5pcXVlTmFtZSddID0ge1xuICAgICdpbml0JzogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IpIHtcbiAgICAgICAgaWYgKHZhbHVlQWNjZXNzb3IoKSkge1xuICAgICAgICAgICAgdmFyIG5hbWUgPSBcImtvX3VuaXF1ZV9cIiArICgrK2tvLmJpbmRpbmdIYW5kbGVyc1sndW5pcXVlTmFtZSddLmN1cnJlbnRJbmRleCk7XG4gICAgICAgICAgICBrby51dGlscy5zZXRFbGVtZW50TmFtZShlbGVtZW50LCBuYW1lKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5rby5iaW5kaW5nSGFuZGxlcnNbJ3VuaXF1ZU5hbWUnXS5jdXJyZW50SW5kZXggPSAwO1xua28uYmluZGluZ0hhbmRsZXJzWyd2YWx1ZSddID0ge1xuICAgICdhZnRlcic6IFsnb3B0aW9ucycsICdmb3JlYWNoJ10sXG4gICAgJ2luaXQnOiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3MpIHtcbiAgICAgICAgLy8gSWYgdGhlIHZhbHVlIGJpbmRpbmcgaXMgcGxhY2VkIG9uIGEgcmFkaW8vY2hlY2tib3gsIHRoZW4ganVzdCBwYXNzIHRocm91Z2ggdG8gY2hlY2tlZFZhbHVlIGFuZCBxdWl0XG4gICAgICAgIGlmIChlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PSBcImlucHV0XCIgJiYgKGVsZW1lbnQudHlwZSA9PSBcImNoZWNrYm94XCIgfHwgZWxlbWVudC50eXBlID09IFwicmFkaW9cIikpIHtcbiAgICAgICAgICAgIGtvLmFwcGx5QmluZGluZ0FjY2Vzc29yc1RvTm9kZShlbGVtZW50LCB7ICdjaGVja2VkVmFsdWUnOiB2YWx1ZUFjY2Vzc29yIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWx3YXlzIGNhdGNoIFwiY2hhbmdlXCIgZXZlbnQ7IHBvc3NpYmx5IG90aGVyIGV2ZW50cyB0b28gaWYgYXNrZWRcbiAgICAgICAgdmFyIGV2ZW50c1RvQ2F0Y2ggPSBbXCJjaGFuZ2VcIl07XG4gICAgICAgIHZhciByZXF1ZXN0ZWRFdmVudHNUb0NhdGNoID0gYWxsQmluZGluZ3MuZ2V0KFwidmFsdWVVcGRhdGVcIik7XG4gICAgICAgIHZhciBwcm9wZXJ0eUNoYW5nZWRGaXJlZCA9IGZhbHNlO1xuICAgICAgICB2YXIgZWxlbWVudFZhbHVlQmVmb3JlRXZlbnQgPSBudWxsO1xuXG4gICAgICAgIGlmIChyZXF1ZXN0ZWRFdmVudHNUb0NhdGNoKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJlcXVlc3RlZEV2ZW50c1RvQ2F0Y2ggPT0gXCJzdHJpbmdcIikgLy8gQWxsb3cgYm90aCBpbmRpdmlkdWFsIGV2ZW50IG5hbWVzLCBhbmQgYXJyYXlzIG9mIGV2ZW50IG5hbWVzXG4gICAgICAgICAgICAgICAgcmVxdWVzdGVkRXZlbnRzVG9DYXRjaCA9IFtyZXF1ZXN0ZWRFdmVudHNUb0NhdGNoXTtcbiAgICAgICAgICAgIGtvLnV0aWxzLmFycmF5UHVzaEFsbChldmVudHNUb0NhdGNoLCByZXF1ZXN0ZWRFdmVudHNUb0NhdGNoKTtcbiAgICAgICAgICAgIGV2ZW50c1RvQ2F0Y2ggPSBrby51dGlscy5hcnJheUdldERpc3RpbmN0VmFsdWVzKGV2ZW50c1RvQ2F0Y2gpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHZhbHVlVXBkYXRlSGFuZGxlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZWxlbWVudFZhbHVlQmVmb3JlRXZlbnQgPSBudWxsO1xuICAgICAgICAgICAgcHJvcGVydHlDaGFuZ2VkRmlyZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHZhciBtb2RlbFZhbHVlID0gdmFsdWVBY2Nlc3NvcigpO1xuICAgICAgICAgICAgdmFyIGVsZW1lbnRWYWx1ZSA9IGtvLnNlbGVjdEV4dGVuc2lvbnMucmVhZFZhbHVlKGVsZW1lbnQpO1xuICAgICAgICAgICAga28uZXhwcmVzc2lvblJld3JpdGluZy53cml0ZVZhbHVlVG9Qcm9wZXJ0eShtb2RlbFZhbHVlLCBhbGxCaW5kaW5ncywgJ3ZhbHVlJywgZWxlbWVudFZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdvcmthcm91bmQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9TdGV2ZVNhbmRlcnNvbi9rbm9ja291dC9pc3N1ZXMvMTIyXG4gICAgICAgIC8vIElFIGRvZXNuJ3QgZmlyZSBcImNoYW5nZVwiIGV2ZW50cyBvbiB0ZXh0Ym94ZXMgaWYgdGhlIHVzZXIgc2VsZWN0cyBhIHZhbHVlIGZyb20gaXRzIGF1dG9jb21wbGV0ZSBsaXN0XG4gICAgICAgIHZhciBpZUF1dG9Db21wbGV0ZUhhY2tOZWVkZWQgPSBrby51dGlscy5pZVZlcnNpb24gJiYgZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT0gXCJpbnB1dFwiICYmIGVsZW1lbnQudHlwZSA9PSBcInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgZWxlbWVudC5hdXRvY29tcGxldGUgIT0gXCJvZmZcIiAmJiAoIWVsZW1lbnQuZm9ybSB8fCBlbGVtZW50LmZvcm0uYXV0b2NvbXBsZXRlICE9IFwib2ZmXCIpO1xuICAgICAgICBpZiAoaWVBdXRvQ29tcGxldGVIYWNrTmVlZGVkICYmIGtvLnV0aWxzLmFycmF5SW5kZXhPZihldmVudHNUb0NhdGNoLCBcInByb3BlcnR5Y2hhbmdlXCIpID09IC0xKSB7XG4gICAgICAgICAgICBrby51dGlscy5yZWdpc3RlckV2ZW50SGFuZGxlcihlbGVtZW50LCBcInByb3BlcnR5Y2hhbmdlXCIsIGZ1bmN0aW9uICgpIHsgcHJvcGVydHlDaGFuZ2VkRmlyZWQgPSB0cnVlIH0pO1xuICAgICAgICAgICAga28udXRpbHMucmVnaXN0ZXJFdmVudEhhbmRsZXIoZWxlbWVudCwgXCJmb2N1c1wiLCBmdW5jdGlvbiAoKSB7IHByb3BlcnR5Q2hhbmdlZEZpcmVkID0gZmFsc2UgfSk7XG4gICAgICAgICAgICBrby51dGlscy5yZWdpc3RlckV2ZW50SGFuZGxlcihlbGVtZW50LCBcImJsdXJcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5Q2hhbmdlZEZpcmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlVXBkYXRlSGFuZGxlcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAga28udXRpbHMuYXJyYXlGb3JFYWNoKGV2ZW50c1RvQ2F0Y2gsIGZ1bmN0aW9uKGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgLy8gVGhlIHN5bnRheCBcImFmdGVyPGV2ZW50bmFtZT5cIiBtZWFucyBcInJ1biB0aGUgaGFuZGxlciBhc3luY2hyb25vdXNseSBhZnRlciB0aGUgZXZlbnRcIlxuICAgICAgICAgICAgLy8gVGhpcyBpcyB1c2VmdWwsIGZvciBleGFtcGxlLCB0byBjYXRjaCBcImtleWRvd25cIiBldmVudHMgYWZ0ZXIgdGhlIGJyb3dzZXIgaGFzIHVwZGF0ZWQgdGhlIGNvbnRyb2xcbiAgICAgICAgICAgIC8vIChvdGhlcndpc2UsIGtvLnNlbGVjdEV4dGVuc2lvbnMucmVhZFZhbHVlKHRoaXMpIHdpbGwgcmVjZWl2ZSB0aGUgY29udHJvbCdzIHZhbHVlICpiZWZvcmUqIHRoZSBrZXkgZXZlbnQpXG4gICAgICAgICAgICB2YXIgaGFuZGxlciA9IHZhbHVlVXBkYXRlSGFuZGxlcjtcbiAgICAgICAgICAgIGlmIChrby51dGlscy5zdHJpbmdTdGFydHNXaXRoKGV2ZW50TmFtZSwgXCJhZnRlclwiKSkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhlIGVsZW1lbnRWYWx1ZUJlZm9yZUV2ZW50IHZhcmlhYmxlIGlzIG5vbi1udWxsICpvbmx5KiBkdXJpbmcgdGhlIGJyaWVmIGdhcCBiZXR3ZWVuXG4gICAgICAgICAgICAgICAgICAgIC8vIGEga2V5WCBldmVudCBmaXJpbmcgYW5kIHRoZSB2YWx1ZVVwZGF0ZUhhbmRsZXIgcnVubmluZywgd2hpY2ggaXMgc2NoZWR1bGVkIHRvIGhhcHBlblxuICAgICAgICAgICAgICAgICAgICAvLyBhdCB0aGUgZWFybGllc3QgYXN5bmNocm9ub3VzIG9wcG9ydHVuaXR5LiBXZSBzdG9yZSB0aGlzIHRlbXBvcmFyeSBpbmZvcm1hdGlvbiBzbyB0aGF0XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmLCBiZXR3ZWVuIGtleVggYW5kIHZhbHVlVXBkYXRlSGFuZGxlciwgdGhlIHVuZGVybHlpbmcgbW9kZWwgdmFsdWUgY2hhbmdlcyBzZXBhcmF0ZWx5LFxuICAgICAgICAgICAgICAgICAgICAvLyB3ZSBjYW4gb3ZlcndyaXRlIHRoYXQgbW9kZWwgdmFsdWUgY2hhbmdlIHdpdGggdGhlIHZhbHVlIHRoZSB1c2VyIGp1c3QgdHlwZWQuIE90aGVyd2lzZSxcbiAgICAgICAgICAgICAgICAgICAgLy8gdGVjaG5pcXVlcyBsaWtlIHJhdGVMaW1pdCBjYW4gdHJpZ2dlciBtb2RlbCBjaGFuZ2VzIGF0IGNyaXRpY2FsIG1vbWVudHMgdGhhdCB3aWxsXG4gICAgICAgICAgICAgICAgICAgIC8vIG92ZXJyaWRlIHRoZSB1c2VyJ3MgaW5wdXRzLCBjYXVzaW5nIGtleXN0cm9rZXMgdG8gYmUgbG9zdC5cbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudFZhbHVlQmVmb3JlRXZlbnQgPSBrby5zZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZShlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCh2YWx1ZVVwZGF0ZUhhbmRsZXIsIDApO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgZXZlbnROYW1lID0gZXZlbnROYW1lLnN1YnN0cmluZyhcImFmdGVyXCIubGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGtvLnV0aWxzLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKGVsZW1lbnQsIGV2ZW50TmFtZSwgaGFuZGxlcik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciB1cGRhdGVGcm9tTW9kZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbmV3VmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSk7XG4gICAgICAgICAgICB2YXIgZWxlbWVudFZhbHVlID0ga28uc2VsZWN0RXh0ZW5zaW9ucy5yZWFkVmFsdWUoZWxlbWVudCk7XG5cbiAgICAgICAgICAgIGlmIChlbGVtZW50VmFsdWVCZWZvcmVFdmVudCAhPT0gbnVsbCAmJiBuZXdWYWx1ZSA9PT0gZWxlbWVudFZhbHVlQmVmb3JlRXZlbnQpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHVwZGF0ZUZyb21Nb2RlbCwgMCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdmFsdWVIYXNDaGFuZ2VkID0gKG5ld1ZhbHVlICE9PSBlbGVtZW50VmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAodmFsdWVIYXNDaGFuZ2VkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGtvLnV0aWxzLnRhZ05hbWVMb3dlcihlbGVtZW50KSA9PT0gXCJzZWxlY3RcIikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYWxsb3dVbnNldCA9IGFsbEJpbmRpbmdzLmdldCgndmFsdWVBbGxvd1Vuc2V0Jyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhcHBseVZhbHVlQWN0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAga28uc2VsZWN0RXh0ZW5zaW9ucy53cml0ZVZhbHVlKGVsZW1lbnQsIG5ld1ZhbHVlLCBhbGxvd1Vuc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgYXBwbHlWYWx1ZUFjdGlvbigpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghYWxsb3dVbnNldCAmJiBuZXdWYWx1ZSAhPT0ga28uc2VsZWN0RXh0ZW5zaW9ucy5yZWFkVmFsdWUoZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIHlvdSB0cnkgdG8gc2V0IGEgbW9kZWwgdmFsdWUgdGhhdCBjYW4ndCBiZSByZXByZXNlbnRlZCBpbiBhbiBhbHJlYWR5LXBvcHVsYXRlZCBkcm9wZG93biwgcmVqZWN0IHRoYXQgY2hhbmdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYmVjYXVzZSB5b3UncmUgbm90IGFsbG93ZWQgdG8gaGF2ZSBhIG1vZGVsIHZhbHVlIHRoYXQgZGlzYWdyZWVzIHdpdGggYSB2aXNpYmxlIFVJIHNlbGVjdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uaWdub3JlKGtvLnV0aWxzLnRyaWdnZXJFdmVudCwgbnVsbCwgW2VsZW1lbnQsIFwiY2hhbmdlXCJdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdvcmthcm91bmQgZm9yIElFNiBidWc6IEl0IHdvbid0IHJlbGlhYmx5IGFwcGx5IHZhbHVlcyB0byBTRUxFQ1Qgbm9kZXMgZHVyaW5nIHRoZSBzYW1lIGV4ZWN1dGlvbiB0aHJlYWRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJpZ2h0IGFmdGVyIHlvdSd2ZSBjaGFuZ2VkIHRoZSBzZXQgb2YgT1BUSU9OIG5vZGVzIG9uIGl0LiBTbyBmb3IgdGhhdCBub2RlIHR5cGUsIHdlJ2xsIHNjaGVkdWxlIGEgc2Vjb25kIHRocmVhZFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdG8gYXBwbHkgdGhlIHZhbHVlIGFzIHdlbGwuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGFwcGx5VmFsdWVBY3Rpb24sIDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAga28uc2VsZWN0RXh0ZW5zaW9ucy53cml0ZVZhbHVlKGVsZW1lbnQsIG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAga28uY29tcHV0ZWQodXBkYXRlRnJvbU1vZGVsLCBudWxsLCB7IGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZDogZWxlbWVudCB9KTtcbiAgICB9LFxuICAgICd1cGRhdGUnOiBmdW5jdGlvbigpIHt9IC8vIEtlZXAgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IHdpdGggY29kZSB0aGF0IG1heSBoYXZlIHdyYXBwZWQgdmFsdWUgYmluZGluZ1xufTtcbmtvLmV4cHJlc3Npb25SZXdyaXRpbmcudHdvV2F5QmluZGluZ3NbJ3ZhbHVlJ10gPSB0cnVlO1xua28uYmluZGluZ0hhbmRsZXJzWyd2aXNpYmxlJ10gPSB7XG4gICAgJ3VwZGF0ZSc6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpKTtcbiAgICAgICAgdmFyIGlzQ3VycmVudGx5VmlzaWJsZSA9ICEoZWxlbWVudC5zdHlsZS5kaXNwbGF5ID09IFwibm9uZVwiKTtcbiAgICAgICAgaWYgKHZhbHVlICYmICFpc0N1cnJlbnRseVZpc2libGUpXG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuICAgICAgICBlbHNlIGlmICgoIXZhbHVlKSAmJiBpc0N1cnJlbnRseVZpc2libGUpXG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9XG59O1xuLy8gJ2NsaWNrJyBpcyBqdXN0IGEgc2hvcnRoYW5kIGZvciB0aGUgdXN1YWwgZnVsbC1sZW5ndGggZXZlbnQ6e2NsaWNrOmhhbmRsZXJ9XG5tYWtlRXZlbnRIYW5kbGVyU2hvcnRjdXQoJ2NsaWNrJyk7XG4vLyBJZiB5b3Ugd2FudCB0byBtYWtlIGEgY3VzdG9tIHRlbXBsYXRlIGVuZ2luZSxcbi8vXG4vLyBbMV0gSW5oZXJpdCBmcm9tIHRoaXMgY2xhc3MgKGxpa2Uga28ubmF0aXZlVGVtcGxhdGVFbmdpbmUgZG9lcylcbi8vIFsyXSBPdmVycmlkZSAncmVuZGVyVGVtcGxhdGVTb3VyY2UnLCBzdXBwbHlpbmcgYSBmdW5jdGlvbiB3aXRoIHRoaXMgc2lnbmF0dXJlOlxuLy9cbi8vICAgICAgICBmdW5jdGlvbiAodGVtcGxhdGVTb3VyY2UsIGJpbmRpbmdDb250ZXh0LCBvcHRpb25zKSB7XG4vLyAgICAgICAgICAgIC8vIC0gdGVtcGxhdGVTb3VyY2UudGV4dCgpIGlzIHRoZSB0ZXh0IG9mIHRoZSB0ZW1wbGF0ZSB5b3Ugc2hvdWxkIHJlbmRlclxuLy8gICAgICAgICAgICAvLyAtIGJpbmRpbmdDb250ZXh0LiRkYXRhIGlzIHRoZSBkYXRhIHlvdSBzaG91bGQgcGFzcyBpbnRvIHRoZSB0ZW1wbGF0ZVxuLy8gICAgICAgICAgICAvLyAgIC0geW91IG1pZ2h0IGFsc28gd2FudCB0byBtYWtlIGJpbmRpbmdDb250ZXh0LiRwYXJlbnQsIGJpbmRpbmdDb250ZXh0LiRwYXJlbnRzLFxuLy8gICAgICAgICAgICAvLyAgICAgYW5kIGJpbmRpbmdDb250ZXh0LiRyb290IGF2YWlsYWJsZSBpbiB0aGUgdGVtcGxhdGUgdG9vXG4vLyAgICAgICAgICAgIC8vIC0gb3B0aW9ucyBnaXZlcyB5b3UgYWNjZXNzIHRvIGFueSBvdGhlciBwcm9wZXJ0aWVzIHNldCBvbiBcImRhdGEtYmluZDogeyB0ZW1wbGF0ZTogb3B0aW9ucyB9XCJcbi8vICAgICAgICAgICAgLy9cbi8vICAgICAgICAgICAgLy8gUmV0dXJuIHZhbHVlOiBhbiBhcnJheSBvZiBET00gbm9kZXNcbi8vICAgICAgICB9XG4vL1xuLy8gWzNdIE92ZXJyaWRlICdjcmVhdGVKYXZhU2NyaXB0RXZhbHVhdG9yQmxvY2snLCBzdXBwbHlpbmcgYSBmdW5jdGlvbiB3aXRoIHRoaXMgc2lnbmF0dXJlOlxuLy9cbi8vICAgICAgICBmdW5jdGlvbiAoc2NyaXB0KSB7XG4vLyAgICAgICAgICAgIC8vIFJldHVybiB2YWx1ZTogV2hhdGV2ZXIgc3ludGF4IG1lYW5zIFwiRXZhbHVhdGUgdGhlIEphdmFTY3JpcHQgc3RhdGVtZW50ICdzY3JpcHQnIGFuZCBvdXRwdXQgdGhlIHJlc3VsdFwiXG4vLyAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgRm9yIGV4YW1wbGUsIHRoZSBqcXVlcnkudG1wbCB0ZW1wbGF0ZSBlbmdpbmUgY29udmVydHMgJ3NvbWVTY3JpcHQnIHRvICckeyBzb21lU2NyaXB0IH0nXG4vLyAgICAgICAgfVxuLy9cbi8vICAgICBUaGlzIGlzIG9ubHkgbmVjZXNzYXJ5IGlmIHlvdSB3YW50IHRvIGFsbG93IGRhdGEtYmluZCBhdHRyaWJ1dGVzIHRvIHJlZmVyZW5jZSBhcmJpdHJhcnkgdGVtcGxhdGUgdmFyaWFibGVzLlxuLy8gICAgIElmIHlvdSBkb24ndCB3YW50IHRvIGFsbG93IHRoYXQsIHlvdSBjYW4gc2V0IHRoZSBwcm9wZXJ0eSAnYWxsb3dUZW1wbGF0ZVJld3JpdGluZycgdG8gZmFsc2UgKGxpa2Uga28ubmF0aXZlVGVtcGxhdGVFbmdpbmUgZG9lcylcbi8vICAgICBhbmQgdGhlbiB5b3UgZG9uJ3QgbmVlZCB0byBvdmVycmlkZSAnY3JlYXRlSmF2YVNjcmlwdEV2YWx1YXRvckJsb2NrJy5cblxua28udGVtcGxhdGVFbmdpbmUgPSBmdW5jdGlvbiAoKSB7IH07XG5cbmtvLnRlbXBsYXRlRW5naW5lLnByb3RvdHlwZVsncmVuZGVyVGVtcGxhdGVTb3VyY2UnXSA9IGZ1bmN0aW9uICh0ZW1wbGF0ZVNvdXJjZSwgYmluZGluZ0NvbnRleHQsIG9wdGlvbnMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJPdmVycmlkZSByZW5kZXJUZW1wbGF0ZVNvdXJjZVwiKTtcbn07XG5cbmtvLnRlbXBsYXRlRW5naW5lLnByb3RvdHlwZVsnY3JlYXRlSmF2YVNjcmlwdEV2YWx1YXRvckJsb2NrJ10gPSBmdW5jdGlvbiAoc2NyaXB0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiT3ZlcnJpZGUgY3JlYXRlSmF2YVNjcmlwdEV2YWx1YXRvckJsb2NrXCIpO1xufTtcblxua28udGVtcGxhdGVFbmdpbmUucHJvdG90eXBlWydtYWtlVGVtcGxhdGVTb3VyY2UnXSA9IGZ1bmN0aW9uKHRlbXBsYXRlLCB0ZW1wbGF0ZURvY3VtZW50KSB7XG4gICAgLy8gTmFtZWQgdGVtcGxhdGVcbiAgICBpZiAodHlwZW9mIHRlbXBsYXRlID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdGVtcGxhdGVEb2N1bWVudCA9IHRlbXBsYXRlRG9jdW1lbnQgfHwgZG9jdW1lbnQ7XG4gICAgICAgIHZhciBlbGVtID0gdGVtcGxhdGVEb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0ZW1wbGF0ZSk7XG4gICAgICAgIGlmICghZWxlbSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIHRlbXBsYXRlIHdpdGggSUQgXCIgKyB0ZW1wbGF0ZSk7XG4gICAgICAgIHJldHVybiBuZXcga28udGVtcGxhdGVTb3VyY2VzLmRvbUVsZW1lbnQoZWxlbSk7XG4gICAgfSBlbHNlIGlmICgodGVtcGxhdGUubm9kZVR5cGUgPT0gMSkgfHwgKHRlbXBsYXRlLm5vZGVUeXBlID09IDgpKSB7XG4gICAgICAgIC8vIEFub255bW91cyB0ZW1wbGF0ZVxuICAgICAgICByZXR1cm4gbmV3IGtvLnRlbXBsYXRlU291cmNlcy5hbm9ueW1vdXNUZW1wbGF0ZSh0ZW1wbGF0ZSk7XG4gICAgfSBlbHNlXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gdGVtcGxhdGUgdHlwZTogXCIgKyB0ZW1wbGF0ZSk7XG59O1xuXG5rby50ZW1wbGF0ZUVuZ2luZS5wcm90b3R5cGVbJ3JlbmRlclRlbXBsYXRlJ10gPSBmdW5jdGlvbiAodGVtcGxhdGUsIGJpbmRpbmdDb250ZXh0LCBvcHRpb25zLCB0ZW1wbGF0ZURvY3VtZW50KSB7XG4gICAgdmFyIHRlbXBsYXRlU291cmNlID0gdGhpc1snbWFrZVRlbXBsYXRlU291cmNlJ10odGVtcGxhdGUsIHRlbXBsYXRlRG9jdW1lbnQpO1xuICAgIHJldHVybiB0aGlzWydyZW5kZXJUZW1wbGF0ZVNvdXJjZSddKHRlbXBsYXRlU291cmNlLCBiaW5kaW5nQ29udGV4dCwgb3B0aW9ucyk7XG59O1xuXG5rby50ZW1wbGF0ZUVuZ2luZS5wcm90b3R5cGVbJ2lzVGVtcGxhdGVSZXdyaXR0ZW4nXSA9IGZ1bmN0aW9uICh0ZW1wbGF0ZSwgdGVtcGxhdGVEb2N1bWVudCkge1xuICAgIC8vIFNraXAgcmV3cml0aW5nIGlmIHJlcXVlc3RlZFxuICAgIGlmICh0aGlzWydhbGxvd1RlbXBsYXRlUmV3cml0aW5nJ10gPT09IGZhbHNlKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gdGhpc1snbWFrZVRlbXBsYXRlU291cmNlJ10odGVtcGxhdGUsIHRlbXBsYXRlRG9jdW1lbnQpWydkYXRhJ10oXCJpc1Jld3JpdHRlblwiKTtcbn07XG5cbmtvLnRlbXBsYXRlRW5naW5lLnByb3RvdHlwZVsncmV3cml0ZVRlbXBsYXRlJ10gPSBmdW5jdGlvbiAodGVtcGxhdGUsIHJld3JpdGVyQ2FsbGJhY2ssIHRlbXBsYXRlRG9jdW1lbnQpIHtcbiAgICB2YXIgdGVtcGxhdGVTb3VyY2UgPSB0aGlzWydtYWtlVGVtcGxhdGVTb3VyY2UnXSh0ZW1wbGF0ZSwgdGVtcGxhdGVEb2N1bWVudCk7XG4gICAgdmFyIHJld3JpdHRlbiA9IHJld3JpdGVyQ2FsbGJhY2sodGVtcGxhdGVTb3VyY2VbJ3RleHQnXSgpKTtcbiAgICB0ZW1wbGF0ZVNvdXJjZVsndGV4dCddKHJld3JpdHRlbik7XG4gICAgdGVtcGxhdGVTb3VyY2VbJ2RhdGEnXShcImlzUmV3cml0dGVuXCIsIHRydWUpO1xufTtcblxua28uZXhwb3J0U3ltYm9sKCd0ZW1wbGF0ZUVuZ2luZScsIGtvLnRlbXBsYXRlRW5naW5lKTtcblxua28udGVtcGxhdGVSZXdyaXRpbmcgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBtZW1vaXplRGF0YUJpbmRpbmdBdHRyaWJ1dGVTeW50YXhSZWdleCA9IC8oPChbYS16XStcXGQqKSg/OlxccysoPyFkYXRhLWJpbmRcXHMqPVxccyopW2EtejAtOVxcLV0rKD86PSg/OlxcXCJbXlxcXCJdKlxcXCJ8XFwnW15cXCddKlxcJykpPykqXFxzKylkYXRhLWJpbmRcXHMqPVxccyooW1wiJ10pKFtcXHNcXFNdKj8pXFwzL2dpO1xuICAgIHZhciBtZW1vaXplVmlydHVhbENvbnRhaW5lckJpbmRpbmdTeW50YXhSZWdleCA9IC88IS0tXFxzKmtvXFxiXFxzKihbXFxzXFxTXSo/KVxccyotLT4vZztcblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlRGF0YUJpbmRWYWx1ZXNGb3JSZXdyaXRpbmcoa2V5VmFsdWVBcnJheSkge1xuICAgICAgICB2YXIgYWxsVmFsaWRhdG9ycyA9IGtvLmV4cHJlc3Npb25SZXdyaXRpbmcuYmluZGluZ1Jld3JpdGVWYWxpZGF0b3JzO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleVZhbHVlQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBrZXlWYWx1ZUFycmF5W2ldWydrZXknXTtcbiAgICAgICAgICAgIGlmIChhbGxWYWxpZGF0b3JzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsaWRhdG9yID0gYWxsVmFsaWRhdG9yc1trZXldO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWxpZGF0b3IgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zc2libGVFcnJvck1lc3NhZ2UgPSB2YWxpZGF0b3Ioa2V5VmFsdWVBcnJheVtpXVsndmFsdWUnXSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwb3NzaWJsZUVycm9yTWVzc2FnZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihwb3NzaWJsZUVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghdmFsaWRhdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoaXMgdGVtcGxhdGUgZW5naW5lIGRvZXMgbm90IHN1cHBvcnQgdGhlICdcIiArIGtleSArIFwiJyBiaW5kaW5nIHdpdGhpbiBpdHMgdGVtcGxhdGVzXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbnN0cnVjdE1lbW9pemVkVGFnUmVwbGFjZW1lbnQoZGF0YUJpbmRBdHRyaWJ1dGVWYWx1ZSwgdGFnVG9SZXRhaW4sIG5vZGVOYW1lLCB0ZW1wbGF0ZUVuZ2luZSkge1xuICAgICAgICB2YXIgZGF0YUJpbmRLZXlWYWx1ZUFycmF5ID0ga28uZXhwcmVzc2lvblJld3JpdGluZy5wYXJzZU9iamVjdExpdGVyYWwoZGF0YUJpbmRBdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICAgIHZhbGlkYXRlRGF0YUJpbmRWYWx1ZXNGb3JSZXdyaXRpbmcoZGF0YUJpbmRLZXlWYWx1ZUFycmF5KTtcbiAgICAgICAgdmFyIHJld3JpdHRlbkRhdGFCaW5kQXR0cmlidXRlVmFsdWUgPSBrby5leHByZXNzaW9uUmV3cml0aW5nLnByZVByb2Nlc3NCaW5kaW5ncyhkYXRhQmluZEtleVZhbHVlQXJyYXksIHsndmFsdWVBY2Nlc3NvcnMnOnRydWV9KTtcblxuICAgICAgICAvLyBGb3Igbm8gb2J2aW91cyByZWFzb24sIE9wZXJhIGZhaWxzIHRvIGV2YWx1YXRlIHJld3JpdHRlbkRhdGFCaW5kQXR0cmlidXRlVmFsdWUgdW5sZXNzIGl0J3Mgd3JhcHBlZCBpbiBhbiBhZGRpdGlvbmFsXG4gICAgICAgIC8vIGFub255bW91cyBmdW5jdGlvbiwgZXZlbiB0aG91Z2ggT3BlcmEncyBidWlsdC1pbiBkZWJ1Z2dlciBjYW4gZXZhbHVhdGUgaXQgYW55d2F5LiBObyBvdGhlciBicm93c2VyIHJlcXVpcmVzIHRoaXNcbiAgICAgICAgLy8gZXh0cmEgaW5kaXJlY3Rpb24uXG4gICAgICAgIHZhciBhcHBseUJpbmRpbmdzVG9OZXh0U2libGluZ1NjcmlwdCA9XG4gICAgICAgICAgICBcImtvLl9fdHJfYW1idG5zKGZ1bmN0aW9uKCRjb250ZXh0LCRlbGVtZW50KXtyZXR1cm4oZnVuY3Rpb24oKXtyZXR1cm57IFwiICsgcmV3cml0dGVuRGF0YUJpbmRBdHRyaWJ1dGVWYWx1ZSArIFwiIH0gfSkoKX0sJ1wiICsgbm9kZU5hbWUudG9Mb3dlckNhc2UoKSArIFwiJylcIjtcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlRW5naW5lWydjcmVhdGVKYXZhU2NyaXB0RXZhbHVhdG9yQmxvY2snXShhcHBseUJpbmRpbmdzVG9OZXh0U2libGluZ1NjcmlwdCkgKyB0YWdUb1JldGFpbjtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBlbnN1cmVUZW1wbGF0ZUlzUmV3cml0dGVuOiBmdW5jdGlvbiAodGVtcGxhdGUsIHRlbXBsYXRlRW5naW5lLCB0ZW1wbGF0ZURvY3VtZW50KSB7XG4gICAgICAgICAgICBpZiAoIXRlbXBsYXRlRW5naW5lWydpc1RlbXBsYXRlUmV3cml0dGVuJ10odGVtcGxhdGUsIHRlbXBsYXRlRG9jdW1lbnQpKVxuICAgICAgICAgICAgICAgIHRlbXBsYXRlRW5naW5lWydyZXdyaXRlVGVtcGxhdGUnXSh0ZW1wbGF0ZSwgZnVuY3Rpb24gKGh0bWxTdHJpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtvLnRlbXBsYXRlUmV3cml0aW5nLm1lbW9pemVCaW5kaW5nQXR0cmlidXRlU3ludGF4KGh0bWxTdHJpbmcsIHRlbXBsYXRlRW5naW5lKTtcbiAgICAgICAgICAgICAgICB9LCB0ZW1wbGF0ZURvY3VtZW50KTtcbiAgICAgICAgfSxcblxuICAgICAgICBtZW1vaXplQmluZGluZ0F0dHJpYnV0ZVN5bnRheDogZnVuY3Rpb24gKGh0bWxTdHJpbmcsIHRlbXBsYXRlRW5naW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gaHRtbFN0cmluZy5yZXBsYWNlKG1lbW9pemVEYXRhQmluZGluZ0F0dHJpYnV0ZVN5bnRheFJlZ2V4LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnN0cnVjdE1lbW9pemVkVGFnUmVwbGFjZW1lbnQoLyogZGF0YUJpbmRBdHRyaWJ1dGVWYWx1ZTogKi8gYXJndW1lbnRzWzRdLCAvKiB0YWdUb1JldGFpbjogKi8gYXJndW1lbnRzWzFdLCAvKiBub2RlTmFtZTogKi8gYXJndW1lbnRzWzJdLCB0ZW1wbGF0ZUVuZ2luZSk7XG4gICAgICAgICAgICB9KS5yZXBsYWNlKG1lbW9pemVWaXJ0dWFsQ29udGFpbmVyQmluZGluZ1N5bnRheFJlZ2V4LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uc3RydWN0TWVtb2l6ZWRUYWdSZXBsYWNlbWVudCgvKiBkYXRhQmluZEF0dHJpYnV0ZVZhbHVlOiAqLyBhcmd1bWVudHNbMV0sIC8qIHRhZ1RvUmV0YWluOiAqLyBcIjwhLS0ga28gLS0+XCIsIC8qIG5vZGVOYW1lOiAqLyBcIiNjb21tZW50XCIsIHRlbXBsYXRlRW5naW5lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFwcGx5TWVtb2l6ZWRCaW5kaW5nc1RvTmV4dFNpYmxpbmc6IGZ1bmN0aW9uIChiaW5kaW5ncywgbm9kZU5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBrby5tZW1vaXphdGlvbi5tZW1vaXplKGZ1bmN0aW9uIChkb21Ob2RlLCBiaW5kaW5nQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIHZhciBub2RlVG9CaW5kID0gZG9tTm9kZS5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICBpZiAobm9kZVRvQmluZCAmJiBub2RlVG9CaW5kLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5vZGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGtvLmFwcGx5QmluZGluZ0FjY2Vzc29yc1RvTm9kZShub2RlVG9CaW5kLCBiaW5kaW5ncywgYmluZGluZ0NvbnRleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufSkoKTtcblxuXG4vLyBFeHBvcnRlZCBvbmx5IGJlY2F1c2UgaXQgaGFzIHRvIGJlIHJlZmVyZW5jZWQgYnkgc3RyaW5nIGxvb2t1cCBmcm9tIHdpdGhpbiByZXdyaXR0ZW4gdGVtcGxhdGVcbmtvLmV4cG9ydFN5bWJvbCgnX190cl9hbWJ0bnMnLCBrby50ZW1wbGF0ZVJld3JpdGluZy5hcHBseU1lbW9pemVkQmluZGluZ3NUb05leHRTaWJsaW5nKTtcbihmdW5jdGlvbigpIHtcbiAgICAvLyBBIHRlbXBsYXRlIHNvdXJjZSByZXByZXNlbnRzIGEgcmVhZC93cml0ZSB3YXkgb2YgYWNjZXNzaW5nIGEgdGVtcGxhdGUuIFRoaXMgaXMgdG8gZWxpbWluYXRlIHRoZSBuZWVkIGZvciB0ZW1wbGF0ZSBsb2FkaW5nL3NhdmluZ1xuICAgIC8vIGxvZ2ljIHRvIGJlIGR1cGxpY2F0ZWQgaW4gZXZlcnkgdGVtcGxhdGUgZW5naW5lIChhbmQgbWVhbnMgdGhleSBjYW4gYWxsIHdvcmsgd2l0aCBhbm9ueW1vdXMgdGVtcGxhdGVzLCBldGMuKVxuICAgIC8vXG4gICAgLy8gVHdvIGFyZSBwcm92aWRlZCBieSBkZWZhdWx0OlxuICAgIC8vICAxLiBrby50ZW1wbGF0ZVNvdXJjZXMuZG9tRWxlbWVudCAgICAgICAtIHJlYWRzL3dyaXRlcyB0aGUgdGV4dCBjb250ZW50IG9mIGFuIGFyYml0cmFyeSBET00gZWxlbWVudFxuICAgIC8vICAyLiBrby50ZW1wbGF0ZVNvdXJjZXMuYW5vbnltb3VzRWxlbWVudCAtIHVzZXMga28udXRpbHMuZG9tRGF0YSB0byByZWFkL3dyaXRlIHRleHQgKmFzc29jaWF0ZWQqIHdpdGggdGhlIERPTSBlbGVtZW50LCBidXRcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXRob3V0IHJlYWRpbmcvd3JpdGluZyB0aGUgYWN0dWFsIGVsZW1lbnQgdGV4dCBjb250ZW50LCBzaW5jZSBpdCB3aWxsIGJlIG92ZXJ3cml0dGVuXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2l0aCB0aGUgcmVuZGVyZWQgdGVtcGxhdGUgb3V0cHV0LlxuICAgIC8vIFlvdSBjYW4gaW1wbGVtZW50IHlvdXIgb3duIHRlbXBsYXRlIHNvdXJjZSBpZiB5b3Ugd2FudCB0byBmZXRjaC9zdG9yZSB0ZW1wbGF0ZXMgc29tZXdoZXJlIG90aGVyIHRoYW4gaW4gRE9NIGVsZW1lbnRzLlxuICAgIC8vIFRlbXBsYXRlIHNvdXJjZXMgbmVlZCB0byBoYXZlIHRoZSBmb2xsb3dpbmcgZnVuY3Rpb25zOlxuICAgIC8vICAgdGV4dCgpIFx0XHRcdC0gcmV0dXJucyB0aGUgdGVtcGxhdGUgdGV4dCBmcm9tIHlvdXIgc3RvcmFnZSBsb2NhdGlvblxuICAgIC8vICAgdGV4dCh2YWx1ZSlcdFx0LSB3cml0ZXMgdGhlIHN1cHBsaWVkIHRlbXBsYXRlIHRleHQgdG8geW91ciBzdG9yYWdlIGxvY2F0aW9uXG4gICAgLy8gICBkYXRhKGtleSlcdFx0XHQtIHJlYWRzIHZhbHVlcyBzdG9yZWQgdXNpbmcgZGF0YShrZXksIHZhbHVlKSAtIHNlZSBiZWxvd1xuICAgIC8vICAgZGF0YShrZXksIHZhbHVlKVx0LSBhc3NvY2lhdGVzIFwidmFsdWVcIiB3aXRoIHRoaXMgdGVtcGxhdGUgYW5kIHRoZSBrZXkgXCJrZXlcIi4gSXMgdXNlZCB0byBzdG9yZSBpbmZvcm1hdGlvbiBsaWtlIFwiaXNSZXdyaXR0ZW5cIi5cbiAgICAvL1xuICAgIC8vIE9wdGlvbmFsbHksIHRlbXBsYXRlIHNvdXJjZXMgY2FuIGFsc28gaGF2ZSB0aGUgZm9sbG93aW5nIGZ1bmN0aW9uczpcbiAgICAvLyAgIG5vZGVzKCkgICAgICAgICAgICAtIHJldHVybnMgYSBET00gZWxlbWVudCBjb250YWluaW5nIHRoZSBub2RlcyBvZiB0aGlzIHRlbXBsYXRlLCB3aGVyZSBhdmFpbGFibGVcbiAgICAvLyAgIG5vZGVzKHZhbHVlKSAgICAgICAtIHdyaXRlcyB0aGUgZ2l2ZW4gRE9NIGVsZW1lbnQgdG8geW91ciBzdG9yYWdlIGxvY2F0aW9uXG4gICAgLy8gSWYgYSBET00gZWxlbWVudCBpcyBhdmFpbGFibGUgZm9yIGEgZ2l2ZW4gdGVtcGxhdGUgc291cmNlLCB0ZW1wbGF0ZSBlbmdpbmVzIGFyZSBlbmNvdXJhZ2VkIHRvIHVzZSBpdCBpbiBwcmVmZXJlbmNlIG92ZXIgdGV4dCgpXG4gICAgLy8gZm9yIGltcHJvdmVkIHNwZWVkLiBIb3dldmVyLCBhbGwgdGVtcGxhdGVTb3VyY2VzIG11c3Qgc3VwcGx5IHRleHQoKSBldmVuIGlmIHRoZXkgZG9uJ3Qgc3VwcGx5IG5vZGVzKCkuXG4gICAgLy9cbiAgICAvLyBPbmNlIHlvdSd2ZSBpbXBsZW1lbnRlZCBhIHRlbXBsYXRlU291cmNlLCBtYWtlIHlvdXIgdGVtcGxhdGUgZW5naW5lIHVzZSBpdCBieSBzdWJjbGFzc2luZyB3aGF0ZXZlciB0ZW1wbGF0ZSBlbmdpbmUgeW91IHdlcmVcbiAgICAvLyB1c2luZyBhbmQgb3ZlcnJpZGluZyBcIm1ha2VUZW1wbGF0ZVNvdXJjZVwiIHRvIHJldHVybiBhbiBpbnN0YW5jZSBvZiB5b3VyIGN1c3RvbSB0ZW1wbGF0ZSBzb3VyY2UuXG5cbiAgICBrby50ZW1wbGF0ZVNvdXJjZXMgPSB7fTtcblxuICAgIC8vIC0tLS0ga28udGVtcGxhdGVTb3VyY2VzLmRvbUVsZW1lbnQgLS0tLS1cblxuICAgIGtvLnRlbXBsYXRlU291cmNlcy5kb21FbGVtZW50ID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICB0aGlzLmRvbUVsZW1lbnQgPSBlbGVtZW50O1xuICAgIH1cblxuICAgIGtvLnRlbXBsYXRlU291cmNlcy5kb21FbGVtZW50LnByb3RvdHlwZVsndGV4dCddID0gZnVuY3Rpb24oLyogdmFsdWVUb1dyaXRlICovKSB7XG4gICAgICAgIHZhciB0YWdOYW1lTG93ZXIgPSBrby51dGlscy50YWdOYW1lTG93ZXIodGhpcy5kb21FbGVtZW50KSxcbiAgICAgICAgICAgIGVsZW1Db250ZW50c1Byb3BlcnR5ID0gdGFnTmFtZUxvd2VyID09PSBcInNjcmlwdFwiID8gXCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogdGFnTmFtZUxvd2VyID09PSBcInRleHRhcmVhXCIgPyBcInZhbHVlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJpbm5lckhUTUxcIjtcblxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kb21FbGVtZW50W2VsZW1Db250ZW50c1Byb3BlcnR5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZVRvV3JpdGUgPSBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICBpZiAoZWxlbUNvbnRlbnRzUHJvcGVydHkgPT09IFwiaW5uZXJIVE1MXCIpXG4gICAgICAgICAgICAgICAga28udXRpbHMuc2V0SHRtbCh0aGlzLmRvbUVsZW1lbnQsIHZhbHVlVG9Xcml0ZSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGhpcy5kb21FbGVtZW50W2VsZW1Db250ZW50c1Byb3BlcnR5XSA9IHZhbHVlVG9Xcml0ZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgZGF0YURvbURhdGFQcmVmaXggPSBrby51dGlscy5kb21EYXRhLm5leHRLZXkoKSArIFwiX1wiO1xuICAgIGtvLnRlbXBsYXRlU291cmNlcy5kb21FbGVtZW50LnByb3RvdHlwZVsnZGF0YSddID0gZnVuY3Rpb24oa2V5IC8qLCB2YWx1ZVRvV3JpdGUgKi8pIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBrby51dGlscy5kb21EYXRhLmdldCh0aGlzLmRvbUVsZW1lbnQsIGRhdGFEb21EYXRhUHJlZml4ICsga2V5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGtvLnV0aWxzLmRvbURhdGEuc2V0KHRoaXMuZG9tRWxlbWVudCwgZGF0YURvbURhdGFQcmVmaXggKyBrZXksIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gLS0tLSBrby50ZW1wbGF0ZVNvdXJjZXMuYW5vbnltb3VzVGVtcGxhdGUgLS0tLS1cbiAgICAvLyBBbm9ueW1vdXMgdGVtcGxhdGVzIGFyZSBub3JtYWxseSBzYXZlZC9yZXRyaWV2ZWQgYXMgRE9NIG5vZGVzIHRocm91Z2ggXCJub2Rlc1wiLlxuICAgIC8vIEZvciBjb21wYXRpYmlsaXR5LCB5b3UgY2FuIGFsc28gcmVhZCBcInRleHRcIjsgaXQgd2lsbCBiZSBzZXJpYWxpemVkIGZyb20gdGhlIG5vZGVzIG9uIGRlbWFuZC5cbiAgICAvLyBXcml0aW5nIHRvIFwidGV4dFwiIGlzIHN0aWxsIHN1cHBvcnRlZCwgYnV0IHRoZW4gdGhlIHRlbXBsYXRlIGRhdGEgd2lsbCBub3QgYmUgYXZhaWxhYmxlIGFzIERPTSBub2Rlcy5cblxuICAgIHZhciBhbm9ueW1vdXNUZW1wbGF0ZXNEb21EYXRhS2V5ID0ga28udXRpbHMuZG9tRGF0YS5uZXh0S2V5KCk7XG4gICAga28udGVtcGxhdGVTb3VyY2VzLmFub255bW91c1RlbXBsYXRlID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICB0aGlzLmRvbUVsZW1lbnQgPSBlbGVtZW50O1xuICAgIH1cbiAgICBrby50ZW1wbGF0ZVNvdXJjZXMuYW5vbnltb3VzVGVtcGxhdGUucHJvdG90eXBlID0gbmV3IGtvLnRlbXBsYXRlU291cmNlcy5kb21FbGVtZW50KCk7XG4gICAga28udGVtcGxhdGVTb3VyY2VzLmFub255bW91c1RlbXBsYXRlLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGtvLnRlbXBsYXRlU291cmNlcy5hbm9ueW1vdXNUZW1wbGF0ZTtcbiAgICBrby50ZW1wbGF0ZVNvdXJjZXMuYW5vbnltb3VzVGVtcGxhdGUucHJvdG90eXBlWyd0ZXh0J10gPSBmdW5jdGlvbigvKiB2YWx1ZVRvV3JpdGUgKi8pIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgdmFyIHRlbXBsYXRlRGF0YSA9IGtvLnV0aWxzLmRvbURhdGEuZ2V0KHRoaXMuZG9tRWxlbWVudCwgYW5vbnltb3VzVGVtcGxhdGVzRG9tRGF0YUtleSkgfHwge307XG4gICAgICAgICAgICBpZiAodGVtcGxhdGVEYXRhLnRleHREYXRhID09PSB1bmRlZmluZWQgJiYgdGVtcGxhdGVEYXRhLmNvbnRhaW5lckRhdGEpXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVEYXRhLnRleHREYXRhID0gdGVtcGxhdGVEYXRhLmNvbnRhaW5lckRhdGEuaW5uZXJIVE1MO1xuICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlRGF0YS50ZXh0RGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZVRvV3JpdGUgPSBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICBrby51dGlscy5kb21EYXRhLnNldCh0aGlzLmRvbUVsZW1lbnQsIGFub255bW91c1RlbXBsYXRlc0RvbURhdGFLZXksIHt0ZXh0RGF0YTogdmFsdWVUb1dyaXRlfSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGtvLnRlbXBsYXRlU291cmNlcy5kb21FbGVtZW50LnByb3RvdHlwZVsnbm9kZXMnXSA9IGZ1bmN0aW9uKC8qIHZhbHVlVG9Xcml0ZSAqLykge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICB2YXIgdGVtcGxhdGVEYXRhID0ga28udXRpbHMuZG9tRGF0YS5nZXQodGhpcy5kb21FbGVtZW50LCBhbm9ueW1vdXNUZW1wbGF0ZXNEb21EYXRhS2V5KSB8fCB7fTtcbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZURhdGEuY29udGFpbmVyRGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZVRvV3JpdGUgPSBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICBrby51dGlscy5kb21EYXRhLnNldCh0aGlzLmRvbUVsZW1lbnQsIGFub255bW91c1RlbXBsYXRlc0RvbURhdGFLZXksIHtjb250YWluZXJEYXRhOiB2YWx1ZVRvV3JpdGV9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBrby5leHBvcnRTeW1ib2woJ3RlbXBsYXRlU291cmNlcycsIGtvLnRlbXBsYXRlU291cmNlcyk7XG4gICAga28uZXhwb3J0U3ltYm9sKCd0ZW1wbGF0ZVNvdXJjZXMuZG9tRWxlbWVudCcsIGtvLnRlbXBsYXRlU291cmNlcy5kb21FbGVtZW50KTtcbiAgICBrby5leHBvcnRTeW1ib2woJ3RlbXBsYXRlU291cmNlcy5hbm9ueW1vdXNUZW1wbGF0ZScsIGtvLnRlbXBsYXRlU291cmNlcy5hbm9ueW1vdXNUZW1wbGF0ZSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX3RlbXBsYXRlRW5naW5lO1xuICAgIGtvLnNldFRlbXBsYXRlRW5naW5lID0gZnVuY3Rpb24gKHRlbXBsYXRlRW5naW5lKSB7XG4gICAgICAgIGlmICgodGVtcGxhdGVFbmdpbmUgIT0gdW5kZWZpbmVkKSAmJiAhKHRlbXBsYXRlRW5naW5lIGluc3RhbmNlb2Yga28udGVtcGxhdGVFbmdpbmUpKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidGVtcGxhdGVFbmdpbmUgbXVzdCBpbmhlcml0IGZyb20ga28udGVtcGxhdGVFbmdpbmVcIik7XG4gICAgICAgIF90ZW1wbGF0ZUVuZ2luZSA9IHRlbXBsYXRlRW5naW5lO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGludm9rZUZvckVhY2hOb2RlSW5Db250aW51b3VzUmFuZ2UoZmlyc3ROb2RlLCBsYXN0Tm9kZSwgYWN0aW9uKSB7XG4gICAgICAgIHZhciBub2RlLCBuZXh0SW5RdWV1ZSA9IGZpcnN0Tm9kZSwgZmlyc3RPdXRPZlJhbmdlTm9kZSA9IGtvLnZpcnR1YWxFbGVtZW50cy5uZXh0U2libGluZyhsYXN0Tm9kZSk7XG4gICAgICAgIHdoaWxlIChuZXh0SW5RdWV1ZSAmJiAoKG5vZGUgPSBuZXh0SW5RdWV1ZSkgIT09IGZpcnN0T3V0T2ZSYW5nZU5vZGUpKSB7XG4gICAgICAgICAgICBuZXh0SW5RdWV1ZSA9IGtvLnZpcnR1YWxFbGVtZW50cy5uZXh0U2libGluZyhub2RlKTtcbiAgICAgICAgICAgIGFjdGlvbihub2RlLCBuZXh0SW5RdWV1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhY3RpdmF0ZUJpbmRpbmdzT25Db250aW51b3VzTm9kZUFycmF5KGNvbnRpbnVvdXNOb2RlQXJyYXksIGJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgIC8vIFRvIGJlIHVzZWQgb24gYW55IG5vZGVzIHRoYXQgaGF2ZSBiZWVuIHJlbmRlcmVkIGJ5IGEgdGVtcGxhdGUgYW5kIGhhdmUgYmVlbiBpbnNlcnRlZCBpbnRvIHNvbWUgcGFyZW50IGVsZW1lbnRcbiAgICAgICAgLy8gV2Fsa3MgdGhyb3VnaCBjb250aW51b3VzTm9kZUFycmF5ICh3aGljaCAqbXVzdCogYmUgY29udGludW91cywgaS5lLiwgYW4gdW5pbnRlcnJ1cHRlZCBzZXF1ZW5jZSBvZiBzaWJsaW5nIG5vZGVzLCBiZWNhdXNlXG4gICAgICAgIC8vIHRoZSBhbGdvcml0aG0gZm9yIHdhbGtpbmcgdGhlbSByZWxpZXMgb24gdGhpcyksIGFuZCBmb3IgZWFjaCB0b3AtbGV2ZWwgaXRlbSBpbiB0aGUgdmlydHVhbC1lbGVtZW50IHNlbnNlLFxuICAgICAgICAvLyAoMSkgRG9lcyBhIHJlZ3VsYXIgXCJhcHBseUJpbmRpbmdzXCIgdG8gYXNzb2NpYXRlIGJpbmRpbmdDb250ZXh0IHdpdGggdGhpcyBub2RlIGFuZCB0byBhY3RpdmF0ZSBhbnkgbm9uLW1lbW9pemVkIGJpbmRpbmdzXG4gICAgICAgIC8vICgyKSBVbm1lbW9pemVzIGFueSBtZW1vcyBpbiB0aGUgRE9NIHN1YnRyZWUgKGUuZy4sIHRvIGFjdGl2YXRlIGJpbmRpbmdzIHRoYXQgaGFkIGJlZW4gbWVtb2l6ZWQgZHVyaW5nIHRlbXBsYXRlIHJld3JpdGluZylcblxuICAgICAgICBpZiAoY29udGludW91c05vZGVBcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHZhciBmaXJzdE5vZGUgPSBjb250aW51b3VzTm9kZUFycmF5WzBdLFxuICAgICAgICAgICAgICAgIGxhc3ROb2RlID0gY29udGludW91c05vZGVBcnJheVtjb250aW51b3VzTm9kZUFycmF5Lmxlbmd0aCAtIDFdLFxuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUgPSBmaXJzdE5vZGUucGFyZW50Tm9kZSxcbiAgICAgICAgICAgICAgICBwcm92aWRlciA9IGtvLmJpbmRpbmdQcm92aWRlclsnaW5zdGFuY2UnXSxcbiAgICAgICAgICAgICAgICBwcmVwcm9jZXNzTm9kZSA9IHByb3ZpZGVyWydwcmVwcm9jZXNzTm9kZSddO1xuXG4gICAgICAgICAgICBpZiAocHJlcHJvY2Vzc05vZGUpIHtcbiAgICAgICAgICAgICAgICBpbnZva2VGb3JFYWNoTm9kZUluQ29udGludW91c1JhbmdlKGZpcnN0Tm9kZSwgbGFzdE5vZGUsIGZ1bmN0aW9uKG5vZGUsIG5leHROb2RlSW5SYW5nZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbm9kZVByZXZpb3VzU2libGluZyA9IG5vZGUucHJldmlvdXNTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3Tm9kZXMgPSBwcmVwcm9jZXNzTm9kZS5jYWxsKHByb3ZpZGVyLCBub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld05vZGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZSA9PT0gZmlyc3ROb2RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0Tm9kZSA9IG5ld05vZGVzWzBdIHx8IG5leHROb2RlSW5SYW5nZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub2RlID09PSBsYXN0Tm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0Tm9kZSA9IG5ld05vZGVzW25ld05vZGVzLmxlbmd0aCAtIDFdIHx8IG5vZGVQcmV2aW91c1NpYmxpbmc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIEJlY2F1c2UgcHJlcHJvY2Vzc05vZGUgY2FuIGNoYW5nZSB0aGUgbm9kZXMsIGluY2x1ZGluZyB0aGUgZmlyc3QgYW5kIGxhc3Qgbm9kZXMsIHVwZGF0ZSBjb250aW51b3VzTm9kZUFycmF5IHRvIG1hdGNoLlxuICAgICAgICAgICAgICAgIC8vIFdlIG5lZWQgdGhlIGZ1bGwgc2V0LCBpbmNsdWRpbmcgaW5uZXIgbm9kZXMsIGJlY2F1c2UgdGhlIHVubWVtb2l6ZSBzdGVwIG1pZ2h0IHJlbW92ZSB0aGUgZmlyc3Qgbm9kZSAoYW5kIHNvIHRoZSByZWFsXG4gICAgICAgICAgICAgICAgLy8gZmlyc3Qgbm9kZSBuZWVkcyB0byBiZSBpbiB0aGUgYXJyYXkpLlxuICAgICAgICAgICAgICAgIGNvbnRpbnVvdXNOb2RlQXJyYXkubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICBpZiAoIWZpcnN0Tm9kZSkgeyAvLyBwcmVwcm9jZXNzTm9kZSBtaWdodCBoYXZlIHJlbW92ZWQgYWxsIHRoZSBub2RlcywgaW4gd2hpY2ggY2FzZSB0aGVyZSdzIG5vdGhpbmcgbGVmdCB0byBkb1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChmaXJzdE5vZGUgPT09IGxhc3ROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVvdXNOb2RlQXJyYXkucHVzaChmaXJzdE5vZGUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVvdXNOb2RlQXJyYXkucHVzaChmaXJzdE5vZGUsIGxhc3ROb2RlKTtcbiAgICAgICAgICAgICAgICAgICAga28udXRpbHMuZml4VXBDb250aW51b3VzTm9kZUFycmF5KGNvbnRpbnVvdXNOb2RlQXJyYXksIHBhcmVudE5vZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTmVlZCB0byBhcHBseUJpbmRpbmdzICpiZWZvcmUqIHVubWVtb3ppYXRpb24sIGJlY2F1c2UgdW5tZW1vaXphdGlvbiBtaWdodCBpbnRyb2R1Y2UgZXh0cmEgbm9kZXMgKHRoYXQgd2UgZG9uJ3Qgd2FudCB0byByZS1iaW5kKVxuICAgICAgICAgICAgLy8gd2hlcmVhcyBhIHJlZ3VsYXIgYXBwbHlCaW5kaW5ncyB3b24ndCBpbnRyb2R1Y2UgbmV3IG1lbW9pemVkIG5vZGVzXG4gICAgICAgICAgICBpbnZva2VGb3JFYWNoTm9kZUluQ29udGludW91c1JhbmdlKGZpcnN0Tm9kZSwgbGFzdE5vZGUsIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMSB8fCBub2RlLm5vZGVUeXBlID09PSA4KVxuICAgICAgICAgICAgICAgICAgICBrby5hcHBseUJpbmRpbmdzKGJpbmRpbmdDb250ZXh0LCBub2RlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaW52b2tlRm9yRWFjaE5vZGVJbkNvbnRpbnVvdXNSYW5nZShmaXJzdE5vZGUsIGxhc3ROb2RlLCBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEgfHwgbm9kZS5ub2RlVHlwZSA9PT0gOClcbiAgICAgICAgICAgICAgICAgICAga28ubWVtb2l6YXRpb24udW5tZW1vaXplRG9tTm9kZUFuZERlc2NlbmRhbnRzKG5vZGUsIFtiaW5kaW5nQ29udGV4dF0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSBhbnkgY2hhbmdlcyBkb25lIGJ5IGFwcGx5QmluZGluZ3Mgb3IgdW5tZW1vaXplIGFyZSByZWZsZWN0ZWQgaW4gdGhlIGFycmF5XG4gICAgICAgICAgICBrby51dGlscy5maXhVcENvbnRpbnVvdXNOb2RlQXJyYXkoY29udGludW91c05vZGVBcnJheSwgcGFyZW50Tm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRGaXJzdE5vZGVGcm9tUG9zc2libGVBcnJheShub2RlT3JOb2RlQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIG5vZGVPck5vZGVBcnJheS5ub2RlVHlwZSA/IG5vZGVPck5vZGVBcnJheVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbm9kZU9yTm9kZUFycmF5Lmxlbmd0aCA+IDAgPyBub2RlT3JOb2RlQXJyYXlbMF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXhlY3V0ZVRlbXBsYXRlKHRhcmdldE5vZGVPck5vZGVBcnJheSwgcmVuZGVyTW9kZSwgdGVtcGxhdGUsIGJpbmRpbmdDb250ZXh0LCBvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgICB2YXIgZmlyc3RUYXJnZXROb2RlID0gdGFyZ2V0Tm9kZU9yTm9kZUFycmF5ICYmIGdldEZpcnN0Tm9kZUZyb21Qb3NzaWJsZUFycmF5KHRhcmdldE5vZGVPck5vZGVBcnJheSk7XG4gICAgICAgIHZhciB0ZW1wbGF0ZURvY3VtZW50ID0gZmlyc3RUYXJnZXROb2RlICYmIGZpcnN0VGFyZ2V0Tm9kZS5vd25lckRvY3VtZW50O1xuICAgICAgICB2YXIgdGVtcGxhdGVFbmdpbmVUb1VzZSA9IChvcHRpb25zWyd0ZW1wbGF0ZUVuZ2luZSddIHx8IF90ZW1wbGF0ZUVuZ2luZSk7XG4gICAgICAgIGtvLnRlbXBsYXRlUmV3cml0aW5nLmVuc3VyZVRlbXBsYXRlSXNSZXdyaXR0ZW4odGVtcGxhdGUsIHRlbXBsYXRlRW5naW5lVG9Vc2UsIHRlbXBsYXRlRG9jdW1lbnQpO1xuICAgICAgICB2YXIgcmVuZGVyZWROb2Rlc0FycmF5ID0gdGVtcGxhdGVFbmdpbmVUb1VzZVsncmVuZGVyVGVtcGxhdGUnXSh0ZW1wbGF0ZSwgYmluZGluZ0NvbnRleHQsIG9wdGlvbnMsIHRlbXBsYXRlRG9jdW1lbnQpO1xuXG4gICAgICAgIC8vIExvb3NlbHkgY2hlY2sgcmVzdWx0IGlzIGFuIGFycmF5IG9mIERPTSBub2Rlc1xuICAgICAgICBpZiAoKHR5cGVvZiByZW5kZXJlZE5vZGVzQXJyYXkubGVuZ3RoICE9IFwibnVtYmVyXCIpIHx8IChyZW5kZXJlZE5vZGVzQXJyYXkubGVuZ3RoID4gMCAmJiB0eXBlb2YgcmVuZGVyZWROb2Rlc0FycmF5WzBdLm5vZGVUeXBlICE9IFwibnVtYmVyXCIpKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGVtcGxhdGUgZW5naW5lIG11c3QgcmV0dXJuIGFuIGFycmF5IG9mIERPTSBub2Rlc1wiKTtcblxuICAgICAgICB2YXIgaGF2ZUFkZGVkTm9kZXNUb1BhcmVudCA9IGZhbHNlO1xuICAgICAgICBzd2l0Y2ggKHJlbmRlck1vZGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJyZXBsYWNlQ2hpbGRyZW5cIjpcbiAgICAgICAgICAgICAgICBrby52aXJ0dWFsRWxlbWVudHMuc2V0RG9tTm9kZUNoaWxkcmVuKHRhcmdldE5vZGVPck5vZGVBcnJheSwgcmVuZGVyZWROb2Rlc0FycmF5KTtcbiAgICAgICAgICAgICAgICBoYXZlQWRkZWROb2Rlc1RvUGFyZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJyZXBsYWNlTm9kZVwiOlxuICAgICAgICAgICAgICAgIGtvLnV0aWxzLnJlcGxhY2VEb21Ob2Rlcyh0YXJnZXROb2RlT3JOb2RlQXJyYXksIHJlbmRlcmVkTm9kZXNBcnJheSk7XG4gICAgICAgICAgICAgICAgaGF2ZUFkZGVkTm9kZXNUb1BhcmVudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiaWdub3JlVGFyZ2V0Tm9kZVwiOiBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biByZW5kZXJNb2RlOiBcIiArIHJlbmRlck1vZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhdmVBZGRlZE5vZGVzVG9QYXJlbnQpIHtcbiAgICAgICAgICAgIGFjdGl2YXRlQmluZGluZ3NPbkNvbnRpbnVvdXNOb2RlQXJyYXkocmVuZGVyZWROb2Rlc0FycmF5LCBiaW5kaW5nQ29udGV4dCk7XG4gICAgICAgICAgICBpZiAob3B0aW9uc1snYWZ0ZXJSZW5kZXInXSlcbiAgICAgICAgICAgICAgICBrby5kZXBlbmRlbmN5RGV0ZWN0aW9uLmlnbm9yZShvcHRpb25zWydhZnRlclJlbmRlciddLCBudWxsLCBbcmVuZGVyZWROb2Rlc0FycmF5LCBiaW5kaW5nQ29udGV4dFsnJGRhdGEnXV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlbmRlcmVkTm9kZXNBcnJheTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXNvbHZlVGVtcGxhdGVOYW1lKHRlbXBsYXRlLCBkYXRhLCBjb250ZXh0KSB7XG4gICAgICAgIC8vIFRoZSB0ZW1wbGF0ZSBjYW4gYmUgc3BlY2lmaWVkIGFzOlxuICAgICAgICBpZiAoa28uaXNPYnNlcnZhYmxlKHRlbXBsYXRlKSkge1xuICAgICAgICAgICAgLy8gMS4gQW4gb2JzZXJ2YWJsZSwgd2l0aCBzdHJpbmcgdmFsdWVcbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgLy8gMi4gQSBmdW5jdGlvbiBvZiAoZGF0YSwgY29udGV4dCkgcmV0dXJuaW5nIGEgc3RyaW5nXG4gICAgICAgICAgICByZXR1cm4gdGVtcGxhdGUoZGF0YSwgY29udGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAzLiBBIHN0cmluZ1xuICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAga28ucmVuZGVyVGVtcGxhdGUgPSBmdW5jdGlvbiAodGVtcGxhdGUsIGRhdGFPckJpbmRpbmdDb250ZXh0LCBvcHRpb25zLCB0YXJnZXROb2RlT3JOb2RlQXJyYXksIHJlbmRlck1vZGUpIHtcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICAgIGlmICgob3B0aW9uc1sndGVtcGxhdGVFbmdpbmUnXSB8fCBfdGVtcGxhdGVFbmdpbmUpID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNldCBhIHRlbXBsYXRlIGVuZ2luZSBiZWZvcmUgY2FsbGluZyByZW5kZXJUZW1wbGF0ZVwiKTtcbiAgICAgICAgcmVuZGVyTW9kZSA9IHJlbmRlck1vZGUgfHwgXCJyZXBsYWNlQ2hpbGRyZW5cIjtcblxuICAgICAgICBpZiAodGFyZ2V0Tm9kZU9yTm9kZUFycmF5KSB7XG4gICAgICAgICAgICB2YXIgZmlyc3RUYXJnZXROb2RlID0gZ2V0Rmlyc3ROb2RlRnJvbVBvc3NpYmxlQXJyYXkodGFyZ2V0Tm9kZU9yTm9kZUFycmF5KTtcblxuICAgICAgICAgICAgdmFyIHdoZW5Ub0Rpc3Bvc2UgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAoIWZpcnN0VGFyZ2V0Tm9kZSkgfHwgIWtvLnV0aWxzLmRvbU5vZGVJc0F0dGFjaGVkVG9Eb2N1bWVudChmaXJzdFRhcmdldE5vZGUpOyB9OyAvLyBQYXNzaXZlIGRpc3Bvc2FsIChvbiBuZXh0IGV2YWx1YXRpb24pXG4gICAgICAgICAgICB2YXIgYWN0aXZlbHlEaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQgPSAoZmlyc3RUYXJnZXROb2RlICYmIHJlbmRlck1vZGUgPT0gXCJyZXBsYWNlTm9kZVwiKSA/IGZpcnN0VGFyZ2V0Tm9kZS5wYXJlbnROb2RlIDogZmlyc3RUYXJnZXROb2RlO1xuXG4gICAgICAgICAgICByZXR1cm4ga28uZGVwZW5kZW50T2JzZXJ2YWJsZSggLy8gU28gdGhlIERPTSBpcyBhdXRvbWF0aWNhbGx5IHVwZGF0ZWQgd2hlbiBhbnkgZGVwZW5kZW5jeSBjaGFuZ2VzXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBFbnN1cmUgd2UndmUgZ290IGEgcHJvcGVyIGJpbmRpbmcgY29udGV4dCB0byB3b3JrIHdpdGhcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJpbmRpbmdDb250ZXh0ID0gKGRhdGFPckJpbmRpbmdDb250ZXh0ICYmIChkYXRhT3JCaW5kaW5nQ29udGV4dCBpbnN0YW5jZW9mIGtvLmJpbmRpbmdDb250ZXh0KSlcbiAgICAgICAgICAgICAgICAgICAgICAgID8gZGF0YU9yQmluZGluZ0NvbnRleHRcbiAgICAgICAgICAgICAgICAgICAgICAgIDogbmV3IGtvLmJpbmRpbmdDb250ZXh0KGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUoZGF0YU9yQmluZGluZ0NvbnRleHQpKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGVOYW1lID0gcmVzb2x2ZVRlbXBsYXRlTmFtZSh0ZW1wbGF0ZSwgYmluZGluZ0NvbnRleHRbJyRkYXRhJ10sIGJpbmRpbmdDb250ZXh0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlcmVkTm9kZXNBcnJheSA9IGV4ZWN1dGVUZW1wbGF0ZSh0YXJnZXROb2RlT3JOb2RlQXJyYXksIHJlbmRlck1vZGUsIHRlbXBsYXRlTmFtZSwgYmluZGluZ0NvbnRleHQsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZW5kZXJNb2RlID09IFwicmVwbGFjZU5vZGVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Tm9kZU9yTm9kZUFycmF5ID0gcmVuZGVyZWROb2Rlc0FycmF5O1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RUYXJnZXROb2RlID0gZ2V0Rmlyc3ROb2RlRnJvbVBvc3NpYmxlQXJyYXkodGFyZ2V0Tm9kZU9yTm9kZUFycmF5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICB7IGRpc3Bvc2VXaGVuOiB3aGVuVG9EaXNwb3NlLCBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IGFjdGl2ZWx5RGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBXZSBkb24ndCB5ZXQgaGF2ZSBhIERPTSBub2RlIHRvIGV2YWx1YXRlLCBzbyB1c2UgYSBtZW1vIGFuZCByZW5kZXIgdGhlIHRlbXBsYXRlIGxhdGVyIHdoZW4gdGhlcmUgaXMgYSBET00gbm9kZVxuICAgICAgICAgICAgcmV0dXJuIGtvLm1lbW9pemF0aW9uLm1lbW9pemUoZnVuY3Rpb24gKGRvbU5vZGUpIHtcbiAgICAgICAgICAgICAgICBrby5yZW5kZXJUZW1wbGF0ZSh0ZW1wbGF0ZSwgZGF0YU9yQmluZGluZ0NvbnRleHQsIG9wdGlvbnMsIGRvbU5vZGUsIFwicmVwbGFjZU5vZGVcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBrby5yZW5kZXJUZW1wbGF0ZUZvckVhY2ggPSBmdW5jdGlvbiAodGVtcGxhdGUsIGFycmF5T3JPYnNlcnZhYmxlQXJyYXksIG9wdGlvbnMsIHRhcmdldE5vZGUsIHBhcmVudEJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgIC8vIFNpbmNlIHNldERvbU5vZGVDaGlsZHJlbkZyb21BcnJheU1hcHBpbmcgYWx3YXlzIGNhbGxzIGV4ZWN1dGVUZW1wbGF0ZUZvckFycmF5SXRlbSBhbmQgdGhlblxuICAgICAgICAvLyBhY3RpdmF0ZUJpbmRpbmdzQ2FsbGJhY2sgZm9yIGFkZGVkIGl0ZW1zLCB3ZSBjYW4gc3RvcmUgdGhlIGJpbmRpbmcgY29udGV4dCBpbiB0aGUgZm9ybWVyIHRvIHVzZSBpbiB0aGUgbGF0dGVyLlxuICAgICAgICB2YXIgYXJyYXlJdGVtQ29udGV4dDtcblxuICAgICAgICAvLyBUaGlzIHdpbGwgYmUgY2FsbGVkIGJ5IHNldERvbU5vZGVDaGlsZHJlbkZyb21BcnJheU1hcHBpbmcgdG8gZ2V0IHRoZSBub2RlcyB0byBhZGQgdG8gdGFyZ2V0Tm9kZVxuICAgICAgICB2YXIgZXhlY3V0ZVRlbXBsYXRlRm9yQXJyYXlJdGVtID0gZnVuY3Rpb24gKGFycmF5VmFsdWUsIGluZGV4KSB7XG4gICAgICAgICAgICAvLyBTdXBwb3J0IHNlbGVjdGluZyB0ZW1wbGF0ZSBhcyBhIGZ1bmN0aW9uIG9mIHRoZSBkYXRhIGJlaW5nIHJlbmRlcmVkXG4gICAgICAgICAgICBhcnJheUl0ZW1Db250ZXh0ID0gcGFyZW50QmluZGluZ0NvbnRleHRbJ2NyZWF0ZUNoaWxkQ29udGV4dCddKGFycmF5VmFsdWUsIG9wdGlvbnNbJ2FzJ10sIGZ1bmN0aW9uKGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0WyckaW5kZXgnXSA9IGluZGV4O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZU5hbWUgPSByZXNvbHZlVGVtcGxhdGVOYW1lKHRlbXBsYXRlLCBhcnJheVZhbHVlLCBhcnJheUl0ZW1Db250ZXh0KTtcbiAgICAgICAgICAgIHJldHVybiBleGVjdXRlVGVtcGxhdGUobnVsbCwgXCJpZ25vcmVUYXJnZXROb2RlXCIsIHRlbXBsYXRlTmFtZSwgYXJyYXlJdGVtQ29udGV4dCwgb3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGlzIHdpbGwgYmUgY2FsbGVkIHdoZW5ldmVyIHNldERvbU5vZGVDaGlsZHJlbkZyb21BcnJheU1hcHBpbmcgaGFzIGFkZGVkIG5vZGVzIHRvIHRhcmdldE5vZGVcbiAgICAgICAgdmFyIGFjdGl2YXRlQmluZGluZ3NDYWxsYmFjayA9IGZ1bmN0aW9uKGFycmF5VmFsdWUsIGFkZGVkTm9kZXNBcnJheSwgaW5kZXgpIHtcbiAgICAgICAgICAgIGFjdGl2YXRlQmluZGluZ3NPbkNvbnRpbnVvdXNOb2RlQXJyYXkoYWRkZWROb2Rlc0FycmF5LCBhcnJheUl0ZW1Db250ZXh0KTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zWydhZnRlclJlbmRlciddKVxuICAgICAgICAgICAgICAgIG9wdGlvbnNbJ2FmdGVyUmVuZGVyJ10oYWRkZWROb2Rlc0FycmF5LCBhcnJheVZhbHVlKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4ga28uZGVwZW5kZW50T2JzZXJ2YWJsZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgdW53cmFwcGVkQXJyYXkgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKGFycmF5T3JPYnNlcnZhYmxlQXJyYXkpIHx8IFtdO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB1bndyYXBwZWRBcnJheS5sZW5ndGggPT0gXCJ1bmRlZmluZWRcIikgLy8gQ29lcmNlIHNpbmdsZSB2YWx1ZSBpbnRvIGFycmF5XG4gICAgICAgICAgICAgICAgdW53cmFwcGVkQXJyYXkgPSBbdW53cmFwcGVkQXJyYXldO1xuXG4gICAgICAgICAgICAvLyBGaWx0ZXIgb3V0IGFueSBlbnRyaWVzIG1hcmtlZCBhcyBkZXN0cm95ZWRcbiAgICAgICAgICAgIHZhciBmaWx0ZXJlZEFycmF5ID0ga28udXRpbHMuYXJyYXlGaWx0ZXIodW53cmFwcGVkQXJyYXksIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3B0aW9uc1snaW5jbHVkZURlc3Ryb3llZCddIHx8IGl0ZW0gPT09IHVuZGVmaW5lZCB8fCBpdGVtID09PSBudWxsIHx8ICFrby51dGlscy51bndyYXBPYnNlcnZhYmxlKGl0ZW1bJ19kZXN0cm95J10pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIENhbGwgc2V0RG9tTm9kZUNoaWxkcmVuRnJvbUFycmF5TWFwcGluZywgaWdub3JpbmcgYW55IG9ic2VydmFibGVzIHVud3JhcHBlZCB3aXRoaW4gKG1vc3QgbGlrZWx5IGZyb20gYSBjYWxsYmFjayBmdW5jdGlvbikuXG4gICAgICAgICAgICAvLyBJZiB0aGUgYXJyYXkgaXRlbXMgYXJlIG9ic2VydmFibGVzLCB0aG91Z2gsIHRoZXkgd2lsbCBiZSB1bndyYXBwZWQgaW4gZXhlY3V0ZVRlbXBsYXRlRm9yQXJyYXlJdGVtIGFuZCBtYW5hZ2VkIHdpdGhpbiBzZXREb21Ob2RlQ2hpbGRyZW5Gcm9tQXJyYXlNYXBwaW5nLlxuICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5pZ25vcmUoa28udXRpbHMuc2V0RG9tTm9kZUNoaWxkcmVuRnJvbUFycmF5TWFwcGluZywgbnVsbCwgW3RhcmdldE5vZGUsIGZpbHRlcmVkQXJyYXksIGV4ZWN1dGVUZW1wbGF0ZUZvckFycmF5SXRlbSwgb3B0aW9ucywgYWN0aXZhdGVCaW5kaW5nc0NhbGxiYWNrXSk7XG5cbiAgICAgICAgfSwgbnVsbCwgeyBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IHRhcmdldE5vZGUgfSk7XG4gICAgfTtcblxuICAgIHZhciB0ZW1wbGF0ZUNvbXB1dGVkRG9tRGF0YUtleSA9IGtvLnV0aWxzLmRvbURhdGEubmV4dEtleSgpO1xuICAgIGZ1bmN0aW9uIGRpc3Bvc2VPbGRDb21wdXRlZEFuZFN0b3JlTmV3T25lKGVsZW1lbnQsIG5ld0NvbXB1dGVkKSB7XG4gICAgICAgIHZhciBvbGRDb21wdXRlZCA9IGtvLnV0aWxzLmRvbURhdGEuZ2V0KGVsZW1lbnQsIHRlbXBsYXRlQ29tcHV0ZWREb21EYXRhS2V5KTtcbiAgICAgICAgaWYgKG9sZENvbXB1dGVkICYmICh0eXBlb2Yob2xkQ29tcHV0ZWQuZGlzcG9zZSkgPT0gJ2Z1bmN0aW9uJykpXG4gICAgICAgICAgICBvbGRDb21wdXRlZC5kaXNwb3NlKCk7XG4gICAgICAgIGtvLnV0aWxzLmRvbURhdGEuc2V0KGVsZW1lbnQsIHRlbXBsYXRlQ29tcHV0ZWREb21EYXRhS2V5LCAobmV3Q29tcHV0ZWQgJiYgbmV3Q29tcHV0ZWQuaXNBY3RpdmUoKSkgPyBuZXdDb21wdXRlZCA6IHVuZGVmaW5lZCk7XG4gICAgfVxuXG4gICAga28uYmluZGluZ0hhbmRsZXJzWyd0ZW1wbGF0ZSddID0ge1xuICAgICAgICAnaW5pdCc6IGZ1bmN0aW9uKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IpIHtcbiAgICAgICAgICAgIC8vIFN1cHBvcnQgYW5vbnltb3VzIHRlbXBsYXRlc1xuICAgICAgICAgICAgdmFyIGJpbmRpbmdWYWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYmluZGluZ1ZhbHVlID09IFwic3RyaW5nXCIgfHwgYmluZGluZ1ZhbHVlWyduYW1lJ10pIHtcbiAgICAgICAgICAgICAgICAvLyBJdCdzIGEgbmFtZWQgdGVtcGxhdGUgLSBjbGVhciB0aGUgZWxlbWVudFxuICAgICAgICAgICAgICAgIGtvLnZpcnR1YWxFbGVtZW50cy5lbXB0eU5vZGUoZWxlbWVudCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIEl0J3MgYW4gYW5vbnltb3VzIHRlbXBsYXRlIC0gc3RvcmUgdGhlIGVsZW1lbnQgY29udGVudHMsIHRoZW4gY2xlYXIgdGhlIGVsZW1lbnRcbiAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGVOb2RlcyA9IGtvLnZpcnR1YWxFbGVtZW50cy5jaGlsZE5vZGVzKGVsZW1lbnQpLFxuICAgICAgICAgICAgICAgICAgICBjb250YWluZXIgPSBrby51dGlscy5tb3ZlQ2xlYW5lZE5vZGVzVG9Db250YWluZXJFbGVtZW50KHRlbXBsYXRlTm9kZXMpOyAvLyBUaGlzIGFsc28gcmVtb3ZlcyB0aGUgbm9kZXMgZnJvbSB0aGVpciBjdXJyZW50IHBhcmVudFxuICAgICAgICAgICAgICAgIG5ldyBrby50ZW1wbGF0ZVNvdXJjZXMuYW5vbnltb3VzVGVtcGxhdGUoZWxlbWVudClbJ25vZGVzJ10oY29udGFpbmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7ICdjb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5ncyc6IHRydWUgfTtcbiAgICAgICAgfSxcbiAgICAgICAgJ3VwZGF0ZSc6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5ncywgdmlld01vZGVsLCBiaW5kaW5nQ29udGV4dCkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gdmFsdWVBY2Nlc3NvcigpLFxuICAgICAgICAgICAgICAgIGRhdGFWYWx1ZSxcbiAgICAgICAgICAgICAgICBvcHRpb25zID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZSksXG4gICAgICAgICAgICAgICAgc2hvdWxkRGlzcGxheSA9IHRydWUsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVDb21wdXRlZCA9IG51bGwsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVOYW1lO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlTmFtZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVOYW1lID0gb3B0aW9uc1snbmFtZSddO1xuXG4gICAgICAgICAgICAgICAgLy8gU3VwcG9ydCBcImlmXCIvXCJpZm5vdFwiIGNvbmRpdGlvbnNcbiAgICAgICAgICAgICAgICBpZiAoJ2lmJyBpbiBvcHRpb25zKVxuICAgICAgICAgICAgICAgICAgICBzaG91bGREaXNwbGF5ID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShvcHRpb25zWydpZiddKTtcbiAgICAgICAgICAgICAgICBpZiAoc2hvdWxkRGlzcGxheSAmJiAnaWZub3QnIGluIG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgICAgIHNob3VsZERpc3BsYXkgPSAha28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShvcHRpb25zWydpZm5vdCddKTtcblxuICAgICAgICAgICAgICAgIGRhdGFWYWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUob3B0aW9uc1snZGF0YSddKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCdmb3JlYWNoJyBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgLy8gUmVuZGVyIG9uY2UgZm9yIGVhY2ggZGF0YSBwb2ludCAodHJlYXRpbmcgZGF0YSBzZXQgYXMgZW1wdHkgaWYgc2hvdWxkRGlzcGxheT09ZmFsc2UpXG4gICAgICAgICAgICAgICAgdmFyIGRhdGFBcnJheSA9IChzaG91bGREaXNwbGF5ICYmIG9wdGlvbnNbJ2ZvcmVhY2gnXSkgfHwgW107XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVDb21wdXRlZCA9IGtvLnJlbmRlclRlbXBsYXRlRm9yRWFjaCh0ZW1wbGF0ZU5hbWUgfHwgZWxlbWVudCwgZGF0YUFycmF5LCBvcHRpb25zLCBlbGVtZW50LCBiaW5kaW5nQ29udGV4dCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFzaG91bGREaXNwbGF5KSB7XG4gICAgICAgICAgICAgICAga28udmlydHVhbEVsZW1lbnRzLmVtcHR5Tm9kZShlbGVtZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gUmVuZGVyIG9uY2UgZm9yIHRoaXMgc2luZ2xlIGRhdGEgcG9pbnQgKG9yIHVzZSB0aGUgdmlld01vZGVsIGlmIG5vIGRhdGEgd2FzIHByb3ZpZGVkKVxuICAgICAgICAgICAgICAgIHZhciBpbm5lckJpbmRpbmdDb250ZXh0ID0gKCdkYXRhJyBpbiBvcHRpb25zKSA/XG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmdDb250ZXh0WydjcmVhdGVDaGlsZENvbnRleHQnXShkYXRhVmFsdWUsIG9wdGlvbnNbJ2FzJ10pIDogIC8vIEdpdmVuIGFuIGV4cGxpdGl0ICdkYXRhJyB2YWx1ZSwgd2UgY3JlYXRlIGEgY2hpbGQgYmluZGluZyBjb250ZXh0IGZvciBpdFxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nQ29udGV4dDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdpdmVuIG5vIGV4cGxpY2l0ICdkYXRhJyB2YWx1ZSwgd2UgcmV0YWluIHRoZSBzYW1lIGJpbmRpbmcgY29udGV4dFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlQ29tcHV0ZWQgPSBrby5yZW5kZXJUZW1wbGF0ZSh0ZW1wbGF0ZU5hbWUgfHwgZWxlbWVudCwgaW5uZXJCaW5kaW5nQ29udGV4dCwgb3B0aW9ucywgZWxlbWVudCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEl0IG9ubHkgbWFrZXMgc2Vuc2UgdG8gaGF2ZSBhIHNpbmdsZSB0ZW1wbGF0ZSBjb21wdXRlZCBwZXIgZWxlbWVudCAob3RoZXJ3aXNlIHdoaWNoIG9uZSBzaG91bGQgaGF2ZSBpdHMgb3V0cHV0IGRpc3BsYXllZD8pXG4gICAgICAgICAgICBkaXNwb3NlT2xkQ29tcHV0ZWRBbmRTdG9yZU5ld09uZShlbGVtZW50LCB0ZW1wbGF0ZUNvbXB1dGVkKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBBbm9ueW1vdXMgdGVtcGxhdGVzIGNhbid0IGJlIHJld3JpdHRlbi4gR2l2ZSBhIG5pY2UgZXJyb3IgbWVzc2FnZSBpZiB5b3UgdHJ5IHRvIGRvIGl0LlxuICAgIGtvLmV4cHJlc3Npb25SZXdyaXRpbmcuYmluZGluZ1Jld3JpdGVWYWxpZGF0b3JzWyd0ZW1wbGF0ZSddID0gZnVuY3Rpb24oYmluZGluZ1ZhbHVlKSB7XG4gICAgICAgIHZhciBwYXJzZWRCaW5kaW5nVmFsdWUgPSBrby5leHByZXNzaW9uUmV3cml0aW5nLnBhcnNlT2JqZWN0TGl0ZXJhbChiaW5kaW5nVmFsdWUpO1xuXG4gICAgICAgIGlmICgocGFyc2VkQmluZGluZ1ZhbHVlLmxlbmd0aCA9PSAxKSAmJiBwYXJzZWRCaW5kaW5nVmFsdWVbMF1bJ3Vua25vd24nXSlcbiAgICAgICAgICAgIHJldHVybiBudWxsOyAvLyBJdCBsb29rcyBsaWtlIGEgc3RyaW5nIGxpdGVyYWwsIG5vdCBhbiBvYmplY3QgbGl0ZXJhbCwgc28gdHJlYXQgaXQgYXMgYSBuYW1lZCB0ZW1wbGF0ZSAod2hpY2ggaXMgYWxsb3dlZCBmb3IgcmV3cml0aW5nKVxuXG4gICAgICAgIGlmIChrby5leHByZXNzaW9uUmV3cml0aW5nLmtleVZhbHVlQXJyYXlDb250YWluc0tleShwYXJzZWRCaW5kaW5nVmFsdWUsIFwibmFtZVwiKSlcbiAgICAgICAgICAgIHJldHVybiBudWxsOyAvLyBOYW1lZCB0ZW1wbGF0ZXMgY2FuIGJlIHJld3JpdHRlbiwgc28gcmV0dXJuIFwibm8gZXJyb3JcIlxuICAgICAgICByZXR1cm4gXCJUaGlzIHRlbXBsYXRlIGVuZ2luZSBkb2VzIG5vdCBzdXBwb3J0IGFub255bW91cyB0ZW1wbGF0ZXMgbmVzdGVkIHdpdGhpbiBpdHMgdGVtcGxhdGVzXCI7XG4gICAgfTtcblxuICAgIGtvLnZpcnR1YWxFbGVtZW50cy5hbGxvd2VkQmluZGluZ3NbJ3RlbXBsYXRlJ10gPSB0cnVlO1xufSkoKTtcblxua28uZXhwb3J0U3ltYm9sKCdzZXRUZW1wbGF0ZUVuZ2luZScsIGtvLnNldFRlbXBsYXRlRW5naW5lKTtcbmtvLmV4cG9ydFN5bWJvbCgncmVuZGVyVGVtcGxhdGUnLCBrby5yZW5kZXJUZW1wbGF0ZSk7XG4vLyBHbyB0aHJvdWdoIHRoZSBpdGVtcyB0aGF0IGhhdmUgYmVlbiBhZGRlZCBhbmQgZGVsZXRlZCBhbmQgdHJ5IHRvIGZpbmQgbWF0Y2hlcyBiZXR3ZWVuIHRoZW0uXG5rby51dGlscy5maW5kTW92ZXNJbkFycmF5Q29tcGFyaXNvbiA9IGZ1bmN0aW9uIChsZWZ0LCByaWdodCwgbGltaXRGYWlsZWRDb21wYXJlcykge1xuICAgIGlmIChsZWZ0Lmxlbmd0aCAmJiByaWdodC5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGZhaWxlZENvbXBhcmVzLCBsLCByLCBsZWZ0SXRlbSwgcmlnaHRJdGVtO1xuICAgICAgICBmb3IgKGZhaWxlZENvbXBhcmVzID0gbCA9IDA7ICghbGltaXRGYWlsZWRDb21wYXJlcyB8fCBmYWlsZWRDb21wYXJlcyA8IGxpbWl0RmFpbGVkQ29tcGFyZXMpICYmIChsZWZ0SXRlbSA9IGxlZnRbbF0pOyArK2wpIHtcbiAgICAgICAgICAgIGZvciAociA9IDA7IHJpZ2h0SXRlbSA9IHJpZ2h0W3JdOyArK3IpIHtcbiAgICAgICAgICAgICAgICBpZiAobGVmdEl0ZW1bJ3ZhbHVlJ10gPT09IHJpZ2h0SXRlbVsndmFsdWUnXSkge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0SXRlbVsnbW92ZWQnXSA9IHJpZ2h0SXRlbVsnaW5kZXgnXTtcbiAgICAgICAgICAgICAgICAgICAgcmlnaHRJdGVtWydtb3ZlZCddID0gbGVmdEl0ZW1bJ2luZGV4J107XG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0LnNwbGljZShyLCAxKTsgICAgICAgICAvLyBUaGlzIGl0ZW0gaXMgbWFya2VkIGFzIG1vdmVkOyBzbyByZW1vdmUgaXQgZnJvbSByaWdodCBsaXN0XG4gICAgICAgICAgICAgICAgICAgIGZhaWxlZENvbXBhcmVzID0gciA9IDA7ICAgICAvLyBSZXNldCBmYWlsZWQgY29tcGFyZXMgY291bnQgYmVjYXVzZSB3ZSdyZSBjaGVja2luZyBmb3IgY29uc2VjdXRpdmUgZmFpbHVyZXNcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmFpbGVkQ29tcGFyZXMgKz0gcjtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmtvLnV0aWxzLmNvbXBhcmVBcnJheXMgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBzdGF0dXNOb3RJbk9sZCA9ICdhZGRlZCcsIHN0YXR1c05vdEluTmV3ID0gJ2RlbGV0ZWQnO1xuXG4gICAgLy8gU2ltcGxlIGNhbGN1bGF0aW9uIGJhc2VkIG9uIExldmVuc2h0ZWluIGRpc3RhbmNlLlxuICAgIGZ1bmN0aW9uIGNvbXBhcmVBcnJheXMob2xkQXJyYXksIG5ld0FycmF5LCBvcHRpb25zKSB7XG4gICAgICAgIC8vIEZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LCBpZiB0aGUgdGhpcmQgYXJnIGlzIGFjdHVhbGx5IGEgYm9vbCwgaW50ZXJwcmV0XG4gICAgICAgIC8vIGl0IGFzIHRoZSBvbGQgcGFyYW1ldGVyICdkb250TGltaXRNb3ZlcycuIE5ld2VyIGNvZGUgc2hvdWxkIHVzZSB7IGRvbnRMaW1pdE1vdmVzOiB0cnVlIH0uXG4gICAgICAgIG9wdGlvbnMgPSAodHlwZW9mIG9wdGlvbnMgPT09ICdib29sZWFuJykgPyB7ICdkb250TGltaXRNb3Zlcyc6IG9wdGlvbnMgfSA6IChvcHRpb25zIHx8IHt9KTtcbiAgICAgICAgb2xkQXJyYXkgPSBvbGRBcnJheSB8fCBbXTtcbiAgICAgICAgbmV3QXJyYXkgPSBuZXdBcnJheSB8fCBbXTtcblxuICAgICAgICBpZiAob2xkQXJyYXkubGVuZ3RoIDw9IG5ld0FycmF5Lmxlbmd0aClcbiAgICAgICAgICAgIHJldHVybiBjb21wYXJlU21hbGxBcnJheVRvQmlnQXJyYXkob2xkQXJyYXksIG5ld0FycmF5LCBzdGF0dXNOb3RJbk9sZCwgc3RhdHVzTm90SW5OZXcsIG9wdGlvbnMpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gY29tcGFyZVNtYWxsQXJyYXlUb0JpZ0FycmF5KG5ld0FycmF5LCBvbGRBcnJheSwgc3RhdHVzTm90SW5OZXcsIHN0YXR1c05vdEluT2xkLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21wYXJlU21hbGxBcnJheVRvQmlnQXJyYXkoc21sQXJyYXksIGJpZ0FycmF5LCBzdGF0dXNOb3RJblNtbCwgc3RhdHVzTm90SW5CaWcsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIG15TWluID0gTWF0aC5taW4sXG4gICAgICAgICAgICBteU1heCA9IE1hdGgubWF4LFxuICAgICAgICAgICAgZWRpdERpc3RhbmNlTWF0cml4ID0gW10sXG4gICAgICAgICAgICBzbWxJbmRleCwgc21sSW5kZXhNYXggPSBzbWxBcnJheS5sZW5ndGgsXG4gICAgICAgICAgICBiaWdJbmRleCwgYmlnSW5kZXhNYXggPSBiaWdBcnJheS5sZW5ndGgsXG4gICAgICAgICAgICBjb21wYXJlUmFuZ2UgPSAoYmlnSW5kZXhNYXggLSBzbWxJbmRleE1heCkgfHwgMSxcbiAgICAgICAgICAgIG1heERpc3RhbmNlID0gc21sSW5kZXhNYXggKyBiaWdJbmRleE1heCArIDEsXG4gICAgICAgICAgICB0aGlzUm93LCBsYXN0Um93LFxuICAgICAgICAgICAgYmlnSW5kZXhNYXhGb3JSb3csIGJpZ0luZGV4TWluRm9yUm93O1xuXG4gICAgICAgIGZvciAoc21sSW5kZXggPSAwOyBzbWxJbmRleCA8PSBzbWxJbmRleE1heDsgc21sSW5kZXgrKykge1xuICAgICAgICAgICAgbGFzdFJvdyA9IHRoaXNSb3c7XG4gICAgICAgICAgICBlZGl0RGlzdGFuY2VNYXRyaXgucHVzaCh0aGlzUm93ID0gW10pO1xuICAgICAgICAgICAgYmlnSW5kZXhNYXhGb3JSb3cgPSBteU1pbihiaWdJbmRleE1heCwgc21sSW5kZXggKyBjb21wYXJlUmFuZ2UpO1xuICAgICAgICAgICAgYmlnSW5kZXhNaW5Gb3JSb3cgPSBteU1heCgwLCBzbWxJbmRleCAtIDEpO1xuICAgICAgICAgICAgZm9yIChiaWdJbmRleCA9IGJpZ0luZGV4TWluRm9yUm93OyBiaWdJbmRleCA8PSBiaWdJbmRleE1heEZvclJvdzsgYmlnSW5kZXgrKykge1xuICAgICAgICAgICAgICAgIGlmICghYmlnSW5kZXgpXG4gICAgICAgICAgICAgICAgICAgIHRoaXNSb3dbYmlnSW5kZXhdID0gc21sSW5kZXggKyAxO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCFzbWxJbmRleCkgIC8vIFRvcCByb3cgLSB0cmFuc2Zvcm0gZW1wdHkgYXJyYXkgaW50byBuZXcgYXJyYXkgdmlhIGFkZGl0aW9uc1xuICAgICAgICAgICAgICAgICAgICB0aGlzUm93W2JpZ0luZGV4XSA9IGJpZ0luZGV4ICsgMTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChzbWxBcnJheVtzbWxJbmRleCAtIDFdID09PSBiaWdBcnJheVtiaWdJbmRleCAtIDFdKVxuICAgICAgICAgICAgICAgICAgICB0aGlzUm93W2JpZ0luZGV4XSA9IGxhc3RSb3dbYmlnSW5kZXggLSAxXTsgICAgICAgICAgICAgICAgICAvLyBjb3B5IHZhbHVlIChubyBlZGl0KVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbm9ydGhEaXN0YW5jZSA9IGxhc3RSb3dbYmlnSW5kZXhdIHx8IG1heERpc3RhbmNlOyAgICAgICAvLyBub3QgaW4gYmlnIChkZWxldGlvbilcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdlc3REaXN0YW5jZSA9IHRoaXNSb3dbYmlnSW5kZXggLSAxXSB8fCBtYXhEaXN0YW5jZTsgICAgLy8gbm90IGluIHNtYWxsIChhZGRpdGlvbilcbiAgICAgICAgICAgICAgICAgICAgdGhpc1Jvd1tiaWdJbmRleF0gPSBteU1pbihub3J0aERpc3RhbmNlLCB3ZXN0RGlzdGFuY2UpICsgMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZWRpdFNjcmlwdCA9IFtdLCBtZU1pbnVzT25lLCBub3RJblNtbCA9IFtdLCBub3RJbkJpZyA9IFtdO1xuICAgICAgICBmb3IgKHNtbEluZGV4ID0gc21sSW5kZXhNYXgsIGJpZ0luZGV4ID0gYmlnSW5kZXhNYXg7IHNtbEluZGV4IHx8IGJpZ0luZGV4Oykge1xuICAgICAgICAgICAgbWVNaW51c09uZSA9IGVkaXREaXN0YW5jZU1hdHJpeFtzbWxJbmRleF1bYmlnSW5kZXhdIC0gMTtcbiAgICAgICAgICAgIGlmIChiaWdJbmRleCAmJiBtZU1pbnVzT25lID09PSBlZGl0RGlzdGFuY2VNYXRyaXhbc21sSW5kZXhdW2JpZ0luZGV4LTFdKSB7XG4gICAgICAgICAgICAgICAgbm90SW5TbWwucHVzaChlZGl0U2NyaXB0W2VkaXRTY3JpcHQubGVuZ3RoXSA9IHsgICAgIC8vIGFkZGVkXG4gICAgICAgICAgICAgICAgICAgICdzdGF0dXMnOiBzdGF0dXNOb3RJblNtbCxcbiAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlJzogYmlnQXJyYXlbLS1iaWdJbmRleF0sXG4gICAgICAgICAgICAgICAgICAgICdpbmRleCc6IGJpZ0luZGV4IH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzbWxJbmRleCAmJiBtZU1pbnVzT25lID09PSBlZGl0RGlzdGFuY2VNYXRyaXhbc21sSW5kZXggLSAxXVtiaWdJbmRleF0pIHtcbiAgICAgICAgICAgICAgICBub3RJbkJpZy5wdXNoKGVkaXRTY3JpcHRbZWRpdFNjcmlwdC5sZW5ndGhdID0geyAgICAgLy8gZGVsZXRlZFxuICAgICAgICAgICAgICAgICAgICAnc3RhdHVzJzogc3RhdHVzTm90SW5CaWcsXG4gICAgICAgICAgICAgICAgICAgICd2YWx1ZSc6IHNtbEFycmF5Wy0tc21sSW5kZXhdLFxuICAgICAgICAgICAgICAgICAgICAnaW5kZXgnOiBzbWxJbmRleCB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLS1iaWdJbmRleDtcbiAgICAgICAgICAgICAgICAtLXNtbEluZGV4O1xuICAgICAgICAgICAgICAgIGlmICghb3B0aW9uc1snc3BhcnNlJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgZWRpdFNjcmlwdC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdGF0dXMnOiBcInJldGFpbmVkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAndmFsdWUnOiBiaWdBcnJheVtiaWdJbmRleF0gfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2V0IGEgbGltaXQgb24gdGhlIG51bWJlciBvZiBjb25zZWN1dGl2ZSBub24tbWF0Y2hpbmcgY29tcGFyaXNvbnM7IGhhdmluZyBpdCBhIG11bHRpcGxlIG9mXG4gICAgICAgIC8vIHNtbEluZGV4TWF4IGtlZXBzIHRoZSB0aW1lIGNvbXBsZXhpdHkgb2YgdGhpcyBhbGdvcml0aG0gbGluZWFyLlxuICAgICAgICBrby51dGlscy5maW5kTW92ZXNJbkFycmF5Q29tcGFyaXNvbihub3RJblNtbCwgbm90SW5CaWcsIHNtbEluZGV4TWF4ICogMTApO1xuXG4gICAgICAgIHJldHVybiBlZGl0U2NyaXB0LnJldmVyc2UoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29tcGFyZUFycmF5cztcbn0pKCk7XG5cbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuY29tcGFyZUFycmF5cycsIGtvLnV0aWxzLmNvbXBhcmVBcnJheXMpO1xuKGZ1bmN0aW9uICgpIHtcbiAgICAvLyBPYmplY3RpdmU6XG4gICAgLy8gKiBHaXZlbiBhbiBpbnB1dCBhcnJheSwgYSBjb250YWluZXIgRE9NIG5vZGUsIGFuZCBhIGZ1bmN0aW9uIGZyb20gYXJyYXkgZWxlbWVudHMgdG8gYXJyYXlzIG9mIERPTSBub2RlcyxcbiAgICAvLyAgIG1hcCB0aGUgYXJyYXkgZWxlbWVudHMgdG8gYXJyYXlzIG9mIERPTSBub2RlcywgY29uY2F0ZW5hdGUgdG9nZXRoZXIgYWxsIHRoZXNlIGFycmF5cywgYW5kIHVzZSB0aGVtIHRvIHBvcHVsYXRlIHRoZSBjb250YWluZXIgRE9NIG5vZGVcbiAgICAvLyAqIE5leHQgdGltZSB3ZSdyZSBnaXZlbiB0aGUgc2FtZSBjb21iaW5hdGlvbiBvZiB0aGluZ3MgKHdpdGggdGhlIGFycmF5IHBvc3NpYmx5IGhhdmluZyBtdXRhdGVkKSwgdXBkYXRlIHRoZSBjb250YWluZXIgRE9NIG5vZGVcbiAgICAvLyAgIHNvIHRoYXQgaXRzIGNoaWxkcmVuIGlzIGFnYWluIHRoZSBjb25jYXRlbmF0aW9uIG9mIHRoZSBtYXBwaW5ncyBvZiB0aGUgYXJyYXkgZWxlbWVudHMsIGJ1dCBkb24ndCByZS1tYXAgYW55IGFycmF5IGVsZW1lbnRzIHRoYXQgd2VcbiAgICAvLyAgIHByZXZpb3VzbHkgbWFwcGVkIC0gcmV0YWluIHRob3NlIG5vZGVzLCBhbmQganVzdCBpbnNlcnQvZGVsZXRlIG90aGVyIG9uZXNcblxuICAgIC8vIFwiY2FsbGJhY2tBZnRlckFkZGluZ05vZGVzXCIgd2lsbCBiZSBpbnZva2VkIGFmdGVyIGFueSBcIm1hcHBpbmdcIi1nZW5lcmF0ZWQgbm9kZXMgYXJlIGluc2VydGVkIGludG8gdGhlIGNvbnRhaW5lciBub2RlXG4gICAgLy8gWW91IGNhbiB1c2UgdGhpcywgZm9yIGV4YW1wbGUsIHRvIGFjdGl2YXRlIGJpbmRpbmdzIG9uIHRob3NlIG5vZGVzLlxuXG4gICAgZnVuY3Rpb24gbWFwTm9kZUFuZFJlZnJlc2hXaGVuQ2hhbmdlZChjb250YWluZXJOb2RlLCBtYXBwaW5nLCB2YWx1ZVRvTWFwLCBjYWxsYmFja0FmdGVyQWRkaW5nTm9kZXMsIGluZGV4KSB7XG4gICAgICAgIC8vIE1hcCB0aGlzIGFycmF5IHZhbHVlIGluc2lkZSBhIGRlcGVuZGVudE9ic2VydmFibGUgc28gd2UgcmUtbWFwIHdoZW4gYW55IGRlcGVuZGVuY3kgY2hhbmdlc1xuICAgICAgICB2YXIgbWFwcGVkTm9kZXMgPSBbXTtcbiAgICAgICAgdmFyIGRlcGVuZGVudE9ic2VydmFibGUgPSBrby5kZXBlbmRlbnRPYnNlcnZhYmxlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG5ld01hcHBlZE5vZGVzID0gbWFwcGluZyh2YWx1ZVRvTWFwLCBpbmRleCwga28udXRpbHMuZml4VXBDb250aW51b3VzTm9kZUFycmF5KG1hcHBlZE5vZGVzLCBjb250YWluZXJOb2RlKSkgfHwgW107XG5cbiAgICAgICAgICAgIC8vIE9uIHN1YnNlcXVlbnQgZXZhbHVhdGlvbnMsIGp1c3QgcmVwbGFjZSB0aGUgcHJldmlvdXNseS1pbnNlcnRlZCBET00gbm9kZXNcbiAgICAgICAgICAgIGlmIChtYXBwZWROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAga28udXRpbHMucmVwbGFjZURvbU5vZGVzKG1hcHBlZE5vZGVzLCBuZXdNYXBwZWROb2Rlcyk7XG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrQWZ0ZXJBZGRpbmdOb2RlcylcbiAgICAgICAgICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5pZ25vcmUoY2FsbGJhY2tBZnRlckFkZGluZ05vZGVzLCBudWxsLCBbdmFsdWVUb01hcCwgbmV3TWFwcGVkTm9kZXMsIGluZGV4XSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFJlcGxhY2UgdGhlIGNvbnRlbnRzIG9mIHRoZSBtYXBwZWROb2RlcyBhcnJheSwgdGhlcmVieSB1cGRhdGluZyB0aGUgcmVjb3JkXG4gICAgICAgICAgICAvLyBvZiB3aGljaCBub2RlcyB3b3VsZCBiZSBkZWxldGVkIGlmIHZhbHVlVG9NYXAgd2FzIGl0c2VsZiBsYXRlciByZW1vdmVkXG4gICAgICAgICAgICBtYXBwZWROb2Rlcy5sZW5ndGggPSAwO1xuICAgICAgICAgICAga28udXRpbHMuYXJyYXlQdXNoQWxsKG1hcHBlZE5vZGVzLCBuZXdNYXBwZWROb2Rlcyk7XG4gICAgICAgIH0sIG51bGwsIHsgZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkOiBjb250YWluZXJOb2RlLCBkaXNwb3NlV2hlbjogZnVuY3Rpb24oKSB7IHJldHVybiAha28udXRpbHMuYW55RG9tTm9kZUlzQXR0YWNoZWRUb0RvY3VtZW50KG1hcHBlZE5vZGVzKTsgfSB9KTtcbiAgICAgICAgcmV0dXJuIHsgbWFwcGVkTm9kZXMgOiBtYXBwZWROb2RlcywgZGVwZW5kZW50T2JzZXJ2YWJsZSA6IChkZXBlbmRlbnRPYnNlcnZhYmxlLmlzQWN0aXZlKCkgPyBkZXBlbmRlbnRPYnNlcnZhYmxlIDogdW5kZWZpbmVkKSB9O1xuICAgIH1cblxuICAgIHZhciBsYXN0TWFwcGluZ1Jlc3VsdERvbURhdGFLZXkgPSBrby51dGlscy5kb21EYXRhLm5leHRLZXkoKTtcblxuICAgIGtvLnV0aWxzLnNldERvbU5vZGVDaGlsZHJlbkZyb21BcnJheU1hcHBpbmcgPSBmdW5jdGlvbiAoZG9tTm9kZSwgYXJyYXksIG1hcHBpbmcsIG9wdGlvbnMsIGNhbGxiYWNrQWZ0ZXJBZGRpbmdOb2Rlcykge1xuICAgICAgICAvLyBDb21wYXJlIHRoZSBwcm92aWRlZCBhcnJheSBhZ2FpbnN0IHRoZSBwcmV2aW91cyBvbmVcbiAgICAgICAgYXJyYXkgPSBhcnJheSB8fCBbXTtcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICAgIHZhciBpc0ZpcnN0RXhlY3V0aW9uID0ga28udXRpbHMuZG9tRGF0YS5nZXQoZG9tTm9kZSwgbGFzdE1hcHBpbmdSZXN1bHREb21EYXRhS2V5KSA9PT0gdW5kZWZpbmVkO1xuICAgICAgICB2YXIgbGFzdE1hcHBpbmdSZXN1bHQgPSBrby51dGlscy5kb21EYXRhLmdldChkb21Ob2RlLCBsYXN0TWFwcGluZ1Jlc3VsdERvbURhdGFLZXkpIHx8IFtdO1xuICAgICAgICB2YXIgbGFzdEFycmF5ID0ga28udXRpbHMuYXJyYXlNYXAobGFzdE1hcHBpbmdSZXN1bHQsIGZ1bmN0aW9uICh4KSB7IHJldHVybiB4LmFycmF5RW50cnk7IH0pO1xuICAgICAgICB2YXIgZWRpdFNjcmlwdCA9IGtvLnV0aWxzLmNvbXBhcmVBcnJheXMobGFzdEFycmF5LCBhcnJheSwgb3B0aW9uc1snZG9udExpbWl0TW92ZXMnXSk7XG5cbiAgICAgICAgLy8gQnVpbGQgdGhlIG5ldyBtYXBwaW5nIHJlc3VsdFxuICAgICAgICB2YXIgbmV3TWFwcGluZ1Jlc3VsdCA9IFtdO1xuICAgICAgICB2YXIgbGFzdE1hcHBpbmdSZXN1bHRJbmRleCA9IDA7XG4gICAgICAgIHZhciBuZXdNYXBwaW5nUmVzdWx0SW5kZXggPSAwO1xuXG4gICAgICAgIHZhciBub2Rlc1RvRGVsZXRlID0gW107XG4gICAgICAgIHZhciBpdGVtc1RvUHJvY2VzcyA9IFtdO1xuICAgICAgICB2YXIgaXRlbXNGb3JCZWZvcmVSZW1vdmVDYWxsYmFja3MgPSBbXTtcbiAgICAgICAgdmFyIGl0ZW1zRm9yTW92ZUNhbGxiYWNrcyA9IFtdO1xuICAgICAgICB2YXIgaXRlbXNGb3JBZnRlckFkZENhbGxiYWNrcyA9IFtdO1xuICAgICAgICB2YXIgbWFwRGF0YTtcblxuICAgICAgICBmdW5jdGlvbiBpdGVtTW92ZWRPclJldGFpbmVkKGVkaXRTY3JpcHRJbmRleCwgb2xkUG9zaXRpb24pIHtcbiAgICAgICAgICAgIG1hcERhdGEgPSBsYXN0TWFwcGluZ1Jlc3VsdFtvbGRQb3NpdGlvbl07XG4gICAgICAgICAgICBpZiAobmV3TWFwcGluZ1Jlc3VsdEluZGV4ICE9PSBvbGRQb3NpdGlvbilcbiAgICAgICAgICAgICAgICBpdGVtc0Zvck1vdmVDYWxsYmFja3NbZWRpdFNjcmlwdEluZGV4XSA9IG1hcERhdGE7XG4gICAgICAgICAgICAvLyBTaW5jZSB1cGRhdGluZyB0aGUgaW5kZXggbWlnaHQgY2hhbmdlIHRoZSBub2RlcywgZG8gc28gYmVmb3JlIGNhbGxpbmcgZml4VXBDb250aW51b3VzTm9kZUFycmF5XG4gICAgICAgICAgICBtYXBEYXRhLmluZGV4T2JzZXJ2YWJsZShuZXdNYXBwaW5nUmVzdWx0SW5kZXgrKyk7XG4gICAgICAgICAgICBrby51dGlscy5maXhVcENvbnRpbnVvdXNOb2RlQXJyYXkobWFwRGF0YS5tYXBwZWROb2RlcywgZG9tTm9kZSk7XG4gICAgICAgICAgICBuZXdNYXBwaW5nUmVzdWx0LnB1c2gobWFwRGF0YSk7XG4gICAgICAgICAgICBpdGVtc1RvUHJvY2Vzcy5wdXNoKG1hcERhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2FsbENhbGxiYWNrKGNhbGxiYWNrLCBpdGVtcykge1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSBpdGVtcy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW1zW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrby51dGlscy5hcnJheUZvckVhY2goaXRlbXNbaV0ubWFwcGVkTm9kZXMsIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhub2RlLCBpLCBpdGVtc1tpXS5hcnJheUVudHJ5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGVkaXRTY3JpcHRJdGVtLCBtb3ZlZEluZGV4OyBlZGl0U2NyaXB0SXRlbSA9IGVkaXRTY3JpcHRbaV07IGkrKykge1xuICAgICAgICAgICAgbW92ZWRJbmRleCA9IGVkaXRTY3JpcHRJdGVtWydtb3ZlZCddO1xuICAgICAgICAgICAgc3dpdGNoIChlZGl0U2NyaXB0SXRlbVsnc3RhdHVzJ10pIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwiZGVsZXRlZFwiOlxuICAgICAgICAgICAgICAgICAgICBpZiAobW92ZWRJbmRleCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBEYXRhID0gbGFzdE1hcHBpbmdSZXN1bHRbbGFzdE1hcHBpbmdSZXN1bHRJbmRleF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN0b3AgdHJhY2tpbmcgY2hhbmdlcyB0byB0aGUgbWFwcGluZyBmb3IgdGhlc2Ugbm9kZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXBEYXRhLmRlcGVuZGVudE9ic2VydmFibGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwRGF0YS5kZXBlbmRlbnRPYnNlcnZhYmxlLmRpc3Bvc2UoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUXVldWUgdGhlc2Ugbm9kZXMgZm9yIGxhdGVyIHJlbW92YWxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVzVG9EZWxldGUucHVzaC5hcHBseShub2Rlc1RvRGVsZXRlLCBrby51dGlscy5maXhVcENvbnRpbnVvdXNOb2RlQXJyYXkobWFwRGF0YS5tYXBwZWROb2RlcywgZG9tTm9kZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnNbJ2JlZm9yZVJlbW92ZSddKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXNGb3JCZWZvcmVSZW1vdmVDYWxsYmFja3NbaV0gPSBtYXBEYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zVG9Qcm9jZXNzLnB1c2gobWFwRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGFzdE1hcHBpbmdSZXN1bHRJbmRleCsrO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgXCJyZXRhaW5lZFwiOlxuICAgICAgICAgICAgICAgICAgICBpdGVtTW92ZWRPclJldGFpbmVkKGksIGxhc3RNYXBwaW5nUmVzdWx0SW5kZXgrKyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSBcImFkZGVkXCI6XG4gICAgICAgICAgICAgICAgICAgIGlmIChtb3ZlZEluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1Nb3ZlZE9yUmV0YWluZWQoaSwgbW92ZWRJbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBEYXRhID0geyBhcnJheUVudHJ5OiBlZGl0U2NyaXB0SXRlbVsndmFsdWUnXSwgaW5kZXhPYnNlcnZhYmxlOiBrby5vYnNlcnZhYmxlKG5ld01hcHBpbmdSZXN1bHRJbmRleCsrKSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3TWFwcGluZ1Jlc3VsdC5wdXNoKG1hcERhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXNUb1Byb2Nlc3MucHVzaChtYXBEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNGaXJzdEV4ZWN1dGlvbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtc0ZvckFmdGVyQWRkQ2FsbGJhY2tzW2ldID0gbWFwRGF0YTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENhbGwgYmVmb3JlTW92ZSBmaXJzdCBiZWZvcmUgYW55IGNoYW5nZXMgaGF2ZSBiZWVuIG1hZGUgdG8gdGhlIERPTVxuICAgICAgICBjYWxsQ2FsbGJhY2sob3B0aW9uc1snYmVmb3JlTW92ZSddLCBpdGVtc0Zvck1vdmVDYWxsYmFja3MpO1xuXG4gICAgICAgIC8vIE5leHQgcmVtb3ZlIG5vZGVzIGZvciBkZWxldGVkIGl0ZW1zIChvciBqdXN0IGNsZWFuIGlmIHRoZXJlJ3MgYSBiZWZvcmVSZW1vdmUgY2FsbGJhY2spXG4gICAgICAgIGtvLnV0aWxzLmFycmF5Rm9yRWFjaChub2Rlc1RvRGVsZXRlLCBvcHRpb25zWydiZWZvcmVSZW1vdmUnXSA/IGtvLmNsZWFuTm9kZSA6IGtvLnJlbW92ZU5vZGUpO1xuXG4gICAgICAgIC8vIE5leHQgYWRkL3Jlb3JkZXIgdGhlIHJlbWFpbmluZyBpdGVtcyAod2lsbCBpbmNsdWRlIGRlbGV0ZWQgaXRlbXMgaWYgdGhlcmUncyBhIGJlZm9yZVJlbW92ZSBjYWxsYmFjaylcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIG5leHROb2RlID0ga28udmlydHVhbEVsZW1lbnRzLmZpcnN0Q2hpbGQoZG9tTm9kZSksIGxhc3ROb2RlLCBub2RlOyBtYXBEYXRhID0gaXRlbXNUb1Byb2Nlc3NbaV07IGkrKykge1xuICAgICAgICAgICAgLy8gR2V0IG5vZGVzIGZvciBuZXdseSBhZGRlZCBpdGVtc1xuICAgICAgICAgICAgaWYgKCFtYXBEYXRhLm1hcHBlZE5vZGVzKVxuICAgICAgICAgICAgICAgIGtvLnV0aWxzLmV4dGVuZChtYXBEYXRhLCBtYXBOb2RlQW5kUmVmcmVzaFdoZW5DaGFuZ2VkKGRvbU5vZGUsIG1hcHBpbmcsIG1hcERhdGEuYXJyYXlFbnRyeSwgY2FsbGJhY2tBZnRlckFkZGluZ05vZGVzLCBtYXBEYXRhLmluZGV4T2JzZXJ2YWJsZSkpO1xuXG4gICAgICAgICAgICAvLyBQdXQgbm9kZXMgaW4gdGhlIHJpZ2h0IHBsYWNlIGlmIHRoZXkgYXJlbid0IHRoZXJlIGFscmVhZHlcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBub2RlID0gbWFwRGF0YS5tYXBwZWROb2Rlc1tqXTsgbmV4dE5vZGUgPSBub2RlLm5leHRTaWJsaW5nLCBsYXN0Tm9kZSA9IG5vZGUsIGorKykge1xuICAgICAgICAgICAgICAgIGlmIChub2RlICE9PSBuZXh0Tm9kZSlcbiAgICAgICAgICAgICAgICAgICAga28udmlydHVhbEVsZW1lbnRzLmluc2VydEFmdGVyKGRvbU5vZGUsIG5vZGUsIGxhc3ROb2RlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUnVuIHRoZSBjYWxsYmFja3MgZm9yIG5ld2x5IGFkZGVkIG5vZGVzIChmb3IgZXhhbXBsZSwgdG8gYXBwbHkgYmluZGluZ3MsIGV0Yy4pXG4gICAgICAgICAgICBpZiAoIW1hcERhdGEuaW5pdGlhbGl6ZWQgJiYgY2FsbGJhY2tBZnRlckFkZGluZ05vZGVzKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2tBZnRlckFkZGluZ05vZGVzKG1hcERhdGEuYXJyYXlFbnRyeSwgbWFwRGF0YS5tYXBwZWROb2RlcywgbWFwRGF0YS5pbmRleE9ic2VydmFibGUpO1xuICAgICAgICAgICAgICAgIG1hcERhdGEuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhlcmUncyBhIGJlZm9yZVJlbW92ZSBjYWxsYmFjaywgY2FsbCBpdCBhZnRlciByZW9yZGVyaW5nLlxuICAgICAgICAvLyBOb3RlIHRoYXQgd2UgYXNzdW1lIHRoYXQgdGhlIGJlZm9yZVJlbW92ZSBjYWxsYmFjayB3aWxsIHVzdWFsbHkgYmUgdXNlZCB0byByZW1vdmUgdGhlIG5vZGVzIHVzaW5nXG4gICAgICAgIC8vIHNvbWUgc29ydCBvZiBhbmltYXRpb24sIHdoaWNoIGlzIHdoeSB3ZSBmaXJzdCByZW9yZGVyIHRoZSBub2RlcyB0aGF0IHdpbGwgYmUgcmVtb3ZlZC4gSWYgdGhlXG4gICAgICAgIC8vIGNhbGxiYWNrIGluc3RlYWQgcmVtb3ZlcyB0aGUgbm9kZXMgcmlnaHQgYXdheSwgaXQgd291bGQgYmUgbW9yZSBlZmZpY2llbnQgdG8gc2tpcCByZW9yZGVyaW5nIHRoZW0uXG4gICAgICAgIC8vIFBlcmhhcHMgd2UnbGwgbWFrZSB0aGF0IGNoYW5nZSBpbiB0aGUgZnV0dXJlIGlmIHRoaXMgc2NlbmFyaW8gYmVjb21lcyBtb3JlIGNvbW1vbi5cbiAgICAgICAgY2FsbENhbGxiYWNrKG9wdGlvbnNbJ2JlZm9yZVJlbW92ZSddLCBpdGVtc0ZvckJlZm9yZVJlbW92ZUNhbGxiYWNrcyk7XG5cbiAgICAgICAgLy8gRmluYWxseSBjYWxsIGFmdGVyTW92ZSBhbmQgYWZ0ZXJBZGQgY2FsbGJhY2tzXG4gICAgICAgIGNhbGxDYWxsYmFjayhvcHRpb25zWydhZnRlck1vdmUnXSwgaXRlbXNGb3JNb3ZlQ2FsbGJhY2tzKTtcbiAgICAgICAgY2FsbENhbGxiYWNrKG9wdGlvbnNbJ2FmdGVyQWRkJ10sIGl0ZW1zRm9yQWZ0ZXJBZGRDYWxsYmFja3MpO1xuXG4gICAgICAgIC8vIFN0b3JlIGEgY29weSBvZiB0aGUgYXJyYXkgaXRlbXMgd2UganVzdCBjb25zaWRlcmVkIHNvIHdlIGNhbiBkaWZmZXJlbmNlIGl0IG5leHQgdGltZVxuICAgICAgICBrby51dGlscy5kb21EYXRhLnNldChkb21Ob2RlLCBsYXN0TWFwcGluZ1Jlc3VsdERvbURhdGFLZXksIG5ld01hcHBpbmdSZXN1bHQpO1xuICAgIH1cbn0pKCk7XG5cbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuc2V0RG9tTm9kZUNoaWxkcmVuRnJvbUFycmF5TWFwcGluZycsIGtvLnV0aWxzLnNldERvbU5vZGVDaGlsZHJlbkZyb21BcnJheU1hcHBpbmcpO1xua28ubmF0aXZlVGVtcGxhdGVFbmdpbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpc1snYWxsb3dUZW1wbGF0ZVJld3JpdGluZyddID0gZmFsc2U7XG59XG5cbmtvLm5hdGl2ZVRlbXBsYXRlRW5naW5lLnByb3RvdHlwZSA9IG5ldyBrby50ZW1wbGF0ZUVuZ2luZSgpO1xua28ubmF0aXZlVGVtcGxhdGVFbmdpbmUucHJvdG90eXBlLmNvbnN0cnVjdG9yID0ga28ubmF0aXZlVGVtcGxhdGVFbmdpbmU7XG5rby5uYXRpdmVUZW1wbGF0ZUVuZ2luZS5wcm90b3R5cGVbJ3JlbmRlclRlbXBsYXRlU291cmNlJ10gPSBmdW5jdGlvbiAodGVtcGxhdGVTb3VyY2UsIGJpbmRpbmdDb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIHVzZU5vZGVzSWZBdmFpbGFibGUgPSAhKGtvLnV0aWxzLmllVmVyc2lvbiA8IDkpLCAvLyBJRTw5IGNsb25lTm9kZSBkb2Vzbid0IHdvcmsgcHJvcGVybHlcbiAgICAgICAgdGVtcGxhdGVOb2Rlc0Z1bmMgPSB1c2VOb2Rlc0lmQXZhaWxhYmxlID8gdGVtcGxhdGVTb3VyY2VbJ25vZGVzJ10gOiBudWxsLFxuICAgICAgICB0ZW1wbGF0ZU5vZGVzID0gdGVtcGxhdGVOb2Rlc0Z1bmMgPyB0ZW1wbGF0ZVNvdXJjZVsnbm9kZXMnXSgpIDogbnVsbDtcblxuICAgIGlmICh0ZW1wbGF0ZU5vZGVzKSB7XG4gICAgICAgIHJldHVybiBrby51dGlscy5tYWtlQXJyYXkodGVtcGxhdGVOb2Rlcy5jbG9uZU5vZGUodHJ1ZSkuY2hpbGROb2Rlcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHRlbXBsYXRlVGV4dCA9IHRlbXBsYXRlU291cmNlWyd0ZXh0J10oKTtcbiAgICAgICAgcmV0dXJuIGtvLnV0aWxzLnBhcnNlSHRtbEZyYWdtZW50KHRlbXBsYXRlVGV4dCk7XG4gICAgfVxufTtcblxua28ubmF0aXZlVGVtcGxhdGVFbmdpbmUuaW5zdGFuY2UgPSBuZXcga28ubmF0aXZlVGVtcGxhdGVFbmdpbmUoKTtcbmtvLnNldFRlbXBsYXRlRW5naW5lKGtvLm5hdGl2ZVRlbXBsYXRlRW5naW5lLmluc3RhbmNlKTtcblxua28uZXhwb3J0U3ltYm9sKCduYXRpdmVUZW1wbGF0ZUVuZ2luZScsIGtvLm5hdGl2ZVRlbXBsYXRlRW5naW5lKTtcbihmdW5jdGlvbigpIHtcbiAgICBrby5qcXVlcnlUbXBsVGVtcGxhdGVFbmdpbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIERldGVjdCB3aGljaCB2ZXJzaW9uIG9mIGpxdWVyeS10bXBsIHlvdSdyZSB1c2luZy4gVW5mb3J0dW5hdGVseSBqcXVlcnktdG1wbFxuICAgICAgICAvLyBkb2Vzbid0IGV4cG9zZSBhIHZlcnNpb24gbnVtYmVyLCBzbyB3ZSBoYXZlIHRvIGluZmVyIGl0LlxuICAgICAgICAvLyBOb3RlIHRoYXQgYXMgb2YgS25vY2tvdXQgMS4zLCB3ZSBvbmx5IHN1cHBvcnQgalF1ZXJ5LnRtcGwgMS4wLjBwcmUgYW5kIGxhdGVyLFxuICAgICAgICAvLyB3aGljaCBLTyBpbnRlcm5hbGx5IHJlZmVycyB0byBhcyB2ZXJzaW9uIFwiMlwiLCBzbyBvbGRlciB2ZXJzaW9ucyBhcmUgbm8gbG9uZ2VyIGRldGVjdGVkLlxuICAgICAgICB2YXIgalF1ZXJ5VG1wbFZlcnNpb24gPSB0aGlzLmpRdWVyeVRtcGxWZXJzaW9uID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCFqUXVlcnlJbnN0YW5jZSB8fCAhKGpRdWVyeUluc3RhbmNlWyd0bXBsJ10pKVxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgLy8gU2luY2UgaXQgZXhwb3NlcyBubyBvZmZpY2lhbCB2ZXJzaW9uIG51bWJlciwgd2UgdXNlIG91ciBvd24gbnVtYmVyaW5nIHN5c3RlbS4gVG8gYmUgdXBkYXRlZCBhcyBqcXVlcnktdG1wbCBldm9sdmVzLlxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAoalF1ZXJ5SW5zdGFuY2VbJ3RtcGwnXVsndGFnJ11bJ3RtcGwnXVsnb3BlbiddLnRvU3RyaW5nKCkuaW5kZXhPZignX18nKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbmNlIDEuMC4wcHJlLCBjdXN0b20gdGFncyBzaG91bGQgYXBwZW5kIG1hcmt1cCB0byBhbiBhcnJheSBjYWxsZWQgXCJfX1wiXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAyOyAvLyBGaW5hbCB2ZXJzaW9uIG9mIGpxdWVyeS50bXBsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaChleCkgeyAvKiBBcHBhcmVudGx5IG5vdCB0aGUgdmVyc2lvbiB3ZSB3ZXJlIGxvb2tpbmcgZm9yICovIH1cblxuICAgICAgICAgICAgcmV0dXJuIDE7IC8vIEFueSBvbGRlciB2ZXJzaW9uIHRoYXQgd2UgZG9uJ3Qgc3VwcG9ydFxuICAgICAgICB9KSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGVuc3VyZUhhc1JlZmVyZW5jZWRKUXVlcnlUZW1wbGF0ZXMoKSB7XG4gICAgICAgICAgICBpZiAoalF1ZXJ5VG1wbFZlcnNpb24gPCAyKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIllvdXIgdmVyc2lvbiBvZiBqUXVlcnkudG1wbCBpcyB0b28gb2xkLiBQbGVhc2UgdXBncmFkZSB0byBqUXVlcnkudG1wbCAxLjAuMHByZSBvciBsYXRlci5cIik7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBleGVjdXRlVGVtcGxhdGUoY29tcGlsZWRUZW1wbGF0ZSwgZGF0YSwgalF1ZXJ5VGVtcGxhdGVPcHRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm4galF1ZXJ5SW5zdGFuY2VbJ3RtcGwnXShjb21waWxlZFRlbXBsYXRlLCBkYXRhLCBqUXVlcnlUZW1wbGF0ZU9wdGlvbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpc1sncmVuZGVyVGVtcGxhdGVTb3VyY2UnXSA9IGZ1bmN0aW9uKHRlbXBsYXRlU291cmNlLCBiaW5kaW5nQ29udGV4dCwgb3B0aW9ucykge1xuICAgICAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICAgICAgICBlbnN1cmVIYXNSZWZlcmVuY2VkSlF1ZXJ5VGVtcGxhdGVzKCk7XG5cbiAgICAgICAgICAgIC8vIEVuc3VyZSB3ZSBoYXZlIHN0b3JlZCBhIHByZWNvbXBpbGVkIHZlcnNpb24gb2YgdGhpcyB0ZW1wbGF0ZSAoZG9uJ3Qgd2FudCB0byByZXBhcnNlIG9uIGV2ZXJ5IHJlbmRlcilcbiAgICAgICAgICAgIHZhciBwcmVjb21waWxlZCA9IHRlbXBsYXRlU291cmNlWydkYXRhJ10oJ3ByZWNvbXBpbGVkJyk7XG4gICAgICAgICAgICBpZiAoIXByZWNvbXBpbGVkKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRlbXBsYXRlVGV4dCA9IHRlbXBsYXRlU291cmNlWyd0ZXh0J10oKSB8fCBcIlwiO1xuICAgICAgICAgICAgICAgIC8vIFdyYXAgaW4gXCJ3aXRoKCR3aGF0ZXZlci5rb0JpbmRpbmdDb250ZXh0KSB7IC4uLiB9XCJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVRleHQgPSBcInt7a29fd2l0aCAkaXRlbS5rb0JpbmRpbmdDb250ZXh0fX1cIiArIHRlbXBsYXRlVGV4dCArIFwie3sva29fd2l0aH19XCI7XG5cbiAgICAgICAgICAgICAgICBwcmVjb21waWxlZCA9IGpRdWVyeUluc3RhbmNlWyd0ZW1wbGF0ZSddKG51bGwsIHRlbXBsYXRlVGV4dCk7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVTb3VyY2VbJ2RhdGEnXSgncHJlY29tcGlsZWQnLCBwcmVjb21waWxlZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBkYXRhID0gW2JpbmRpbmdDb250ZXh0WyckZGF0YSddXTsgLy8gUHJld3JhcCB0aGUgZGF0YSBpbiBhbiBhcnJheSB0byBzdG9wIGpxdWVyeS50bXBsIGZyb20gdHJ5aW5nIHRvIHVud3JhcCBhbnkgYXJyYXlzXG4gICAgICAgICAgICB2YXIgalF1ZXJ5VGVtcGxhdGVPcHRpb25zID0galF1ZXJ5SW5zdGFuY2VbJ2V4dGVuZCddKHsgJ2tvQmluZGluZ0NvbnRleHQnOiBiaW5kaW5nQ29udGV4dCB9LCBvcHRpb25zWyd0ZW1wbGF0ZU9wdGlvbnMnXSk7XG5cbiAgICAgICAgICAgIHZhciByZXN1bHROb2RlcyA9IGV4ZWN1dGVUZW1wbGF0ZShwcmVjb21waWxlZCwgZGF0YSwgalF1ZXJ5VGVtcGxhdGVPcHRpb25zKTtcbiAgICAgICAgICAgIHJlc3VsdE5vZGVzWydhcHBlbmRUbyddKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpOyAvLyBVc2luZyBcImFwcGVuZFRvXCIgZm9yY2VzIGpRdWVyeS9qUXVlcnkudG1wbCB0byBwZXJmb3JtIG5lY2Vzc2FyeSBjbGVhbnVwIHdvcmtcblxuICAgICAgICAgICAgalF1ZXJ5SW5zdGFuY2VbJ2ZyYWdtZW50cyddID0ge307IC8vIENsZWFyIGpRdWVyeSdzIGZyYWdtZW50IGNhY2hlIHRvIGF2b2lkIGEgbWVtb3J5IGxlYWsgYWZ0ZXIgYSBsYXJnZSBudW1iZXIgb2YgdGVtcGxhdGUgcmVuZGVyc1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdE5vZGVzO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXNbJ2NyZWF0ZUphdmFTY3JpcHRFdmFsdWF0b3JCbG9jayddID0gZnVuY3Rpb24oc2NyaXB0KSB7XG4gICAgICAgICAgICByZXR1cm4gXCJ7e2tvX2NvZGUgKChmdW5jdGlvbigpIHsgcmV0dXJuIFwiICsgc2NyaXB0ICsgXCIgfSkoKSkgfX1cIjtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzWydhZGRUZW1wbGF0ZSddID0gZnVuY3Rpb24odGVtcGxhdGVOYW1lLCB0ZW1wbGF0ZU1hcmt1cCkge1xuICAgICAgICAgICAgZG9jdW1lbnQud3JpdGUoXCI8c2NyaXB0IHR5cGU9J3RleHQvaHRtbCcgaWQ9J1wiICsgdGVtcGxhdGVOYW1lICsgXCInPlwiICsgdGVtcGxhdGVNYXJrdXAgKyBcIjxcIiArIFwiL3NjcmlwdD5cIik7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGpRdWVyeVRtcGxWZXJzaW9uID4gMCkge1xuICAgICAgICAgICAgalF1ZXJ5SW5zdGFuY2VbJ3RtcGwnXVsndGFnJ11bJ2tvX2NvZGUnXSA9IHtcbiAgICAgICAgICAgICAgICBvcGVuOiBcIl9fLnB1c2goJDEgfHwgJycpO1wiXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgalF1ZXJ5SW5zdGFuY2VbJ3RtcGwnXVsndGFnJ11bJ2tvX3dpdGgnXSA9IHtcbiAgICAgICAgICAgICAgICBvcGVuOiBcIndpdGgoJDEpIHtcIixcbiAgICAgICAgICAgICAgICBjbG9zZTogXCJ9IFwiXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGtvLmpxdWVyeVRtcGxUZW1wbGF0ZUVuZ2luZS5wcm90b3R5cGUgPSBuZXcga28udGVtcGxhdGVFbmdpbmUoKTtcbiAgICBrby5qcXVlcnlUbXBsVGVtcGxhdGVFbmdpbmUucHJvdG90eXBlLmNvbnN0cnVjdG9yID0ga28uanF1ZXJ5VG1wbFRlbXBsYXRlRW5naW5lO1xuXG4gICAgLy8gVXNlIHRoaXMgb25lIGJ5IGRlZmF1bHQgKm9ubHkgaWYganF1ZXJ5LnRtcGwgaXMgcmVmZXJlbmNlZCpcbiAgICB2YXIganF1ZXJ5VG1wbFRlbXBsYXRlRW5naW5lSW5zdGFuY2UgPSBuZXcga28uanF1ZXJ5VG1wbFRlbXBsYXRlRW5naW5lKCk7XG4gICAgaWYgKGpxdWVyeVRtcGxUZW1wbGF0ZUVuZ2luZUluc3RhbmNlLmpRdWVyeVRtcGxWZXJzaW9uID4gMClcbiAgICAgICAga28uc2V0VGVtcGxhdGVFbmdpbmUoanF1ZXJ5VG1wbFRlbXBsYXRlRW5naW5lSW5zdGFuY2UpO1xuXG4gICAga28uZXhwb3J0U3ltYm9sKCdqcXVlcnlUbXBsVGVtcGxhdGVFbmdpbmUnLCBrby5qcXVlcnlUbXBsVGVtcGxhdGVFbmdpbmUpO1xufSkoKTtcbn0pKTtcbn0oKSk7XG59KSgpO1xuIl19
