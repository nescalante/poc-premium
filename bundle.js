(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"C:\\dev\\poc-premium\\main.js":[function(require,module,exports){
var ko = require('knockout');
var ContractPremium = require('./models').ContractPremium;

// model definition
var model = new ContractPremium();

ko.applyBindings(model);

},{"./models":"C:\\dev\\poc-premium\\models\\index.js","knockout":"C:\\dev\\poc-premium\\node_modules\\knockout\\build\\output\\knockout-latest.debug.js"}],"C:\\dev\\poc-premium\\models\\config\\billingMethods.js":[function(require,module,exports){
'use strict';

var methods = [{
  name: 'Flat Fee',
  template: 'flat-fee',
}, {
  name: 'Revenue Share',
  template: 'revenue-share',
}, {
  name: 'Actual Subscribers',
  template: 'actual-subscribers',
}];

module.exports = methods;

},{}],"C:\\dev\\poc-premium\\models\\config\\index.js":[function(require,module,exports){
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
};

},{"./billingMethods.js":"C:\\dev\\poc-premium\\models\\config\\billingMethods.js","./invoiceGroups.js":"C:\\dev\\poc-premium\\models\\config\\invoiceGroups.js","./priceMethods.js":"C:\\dev\\poc-premium\\models\\config\\priceMethods.js","./products.js":"C:\\dev\\poc-premium\\models\\config\\products.js","./serviceTypes.js":"C:\\dev\\poc-premium\\models\\config\\serviceTypes.js","./subscribersPackages.js":"C:\\dev\\poc-premium\\models\\config\\subscribersPackages.js"}],"C:\\dev\\poc-premium\\models\\config\\invoiceGroups.js":[function(require,module,exports){
'use strict';

var groups = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (i) {
  return {
    name: 'Invoice ' + i,
  };
});

module.exports = groups;

},{}],"C:\\dev\\poc-premium\\models\\config\\priceMethods.js":[function(require,module,exports){
'use strict';

var groups = [{
  name: 'Fixed',
}, {
  name: 'Range',
}, {
  name: 'Incremental',
}];

module.exports = groups;

},{}],"C:\\dev\\poc-premium\\models\\config\\products.js":[function(require,module,exports){
'use strict';

var types = require('./serviceTypes.js');
var signal = types.filter(function (t) { return t.name === 'Signal'; })[0];
var pkg = types.filter(function (t) { return t.name === 'Package'; })[0];

var products = [{
  name: 'Signal Fox HD',
  type: signal,
}, {
  name: 'Signal Fox Life',
  type: signal,
}, {
  name: 'Signal Fox Sports',
  type: signal,
}, {
  name: 'Signal Fox Sports 2',
  type: signal,
}, {
  name: 'Signal Fox Sports 2 HD',
  type: signal,
}, {
  name: 'Signal Fox Sports Premium',
  type: signal,
}, {
  name: 'Signal FX',
  type: signal,
}, {
  name: 'Signal FX HD',
  type: signal,
}, {
  name: 'Signal Mundo Fox',
  type: signal,
}, {
  name: 'CF+NG',
  type: pkg,
}, {
  name: 'CF+NG+FS',
  type: pkg,
}, {
  name: 'CF+NG+FX+FS3+FL',
  type: pkg,
}, {
  name: 'FS3+NGW',
  type: pkg,
}, {
  name: 'FL+NGW+FS3',
  type: pkg,
}, {
  name: 'Syfy+UC',
  type: pkg,
}, {
  name: 'FSB+FS2',
  type: pkg,
}, {
  name: 'CF+NG+FS3',
  type: pkg,
}, {
  name: 'UTILIS+CF+NG+FX+FL',
  type: pkg,
}];

module.exports = products;

},{"./serviceTypes.js":"C:\\dev\\poc-premium\\models\\config\\serviceTypes.js"}],"C:\\dev\\poc-premium\\models\\config\\serviceTypes.js":[function(require,module,exports){
'use strict';

var types = [{
  name: 'Signal',
}, {
  name: 'Package',
}];

module.exports = types;

},{}],"C:\\dev\\poc-premium\\models\\config\\subscribersPackages.js":[function(require,module,exports){
'use strict';

var packages = [{
  name: 'New',
}, {
  name: 'Old',
}, {
  name: 'All',
}];

module.exports = packages;

},{}],"C:\\dev\\poc-premium\\models\\index.js":[function(require,module,exports){
var ContractPremium = require('./premium');

module.exports = {
  ContractPremium: ContractPremium
};

},{"./premium":"C:\\dev\\poc-premium\\models\\premium\\index.js"}],"C:\\dev\\poc-premium\\models\\premium\\condition.js":[function(require,module,exports){
'use strict';

var ko = require('knockout');
var ConditionRange = require('./range.js');

module.exports = Condition;

function Condition(parent) {
  var self = this;
  var subscriptions = [];

  self.billingMethod = ko.observable();
  self.invoiceGroup = ko.observable();
  self.priceMethod = ko.observable();
  self.serviceType = ko.observable();
  self.subscribersPackage = ko.observable();
  self.product = ko.observable();
  self.price = ko.observable();
  self.ranges = ko.observableArray();

  self.addToMonth = function () {
    parent.conditions.push(self);
  };

  initializeNewRange();

  function initializeNewRange() {
    var lastRange;

    self.ranges.push(new ConditionRange(self));
    lastRange = self.ranges()[self.ranges().length - 1];
    [
      'to',
      'price',
      'percentage',
    ].map(function (f) {
      return lastRange[f].subscribe(addNewRange.bind(self, f));
    }).forEach(function (s) {
      subscriptions.push(s);
    });
  }

  function addNewRange(field) {
    console.log(field);

    subscriptions.forEach(function (s) {
      s.dispose();
    });
    subscriptions = [];
    initializeNewRange();
  }
}

},{"./range.js":"C:\\dev\\poc-premium\\models\\premium\\range.js","knockout":"C:\\dev\\poc-premium\\node_modules\\knockout\\build\\output\\knockout-latest.debug.js"}],"C:\\dev\\poc-premium\\models\\premium\\index.js":[function(require,module,exports){
'use strict';

var ko = require('knockout');
var Month = require('./month.js');
var config = require('../config');

module.exports = ContractPremium;

function ContractPremium() {
  var self = this;

  self.billingMethods = config.billingMethods;
  self.invoiceGroups = config.invoiceGroups;
  self.priceMethods = config.priceMethods;
  self.serviceTypes = config.serviceTypes;
  self.subscribersPackages = config.subscribersPackages;
  self.months = ko.observableArray();
  self.selectedCondition = ko.observable();

  self.productsFor = function (type) {
    return ko.computed(function () {
      return config.products.filter(function (p) { return p.type === type(); });
    });
  };

  // initial data
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (i) {
    return new Month(i, self);
  }).forEach(addMonth);

  self.months()[0].addCondition({
    billingMethod: config.billingMethods[0], // flat fee
    signal: 'HD Basic',
    package: 'Premium Fox Sports',
    price: 0,
  });

  self.months()[0].addCondition({
    billingMethod: config.billingMethods[1], // revenue share
    signal: 'HD Basic',
    package: 'Premium Fox Sports',
  });

  function addMonth(month) {
    self.months.push(month);
  }
}

},{"../config":"C:\\dev\\poc-premium\\models\\config\\index.js","./month.js":"C:\\dev\\poc-premium\\models\\premium\\month.js","knockout":"C:\\dev\\poc-premium\\node_modules\\knockout\\build\\output\\knockout-latest.debug.js"}],"C:\\dev\\poc-premium\\models\\premium\\month.js":[function(require,module,exports){
'use strict';

var ko = require('knockout');
var Condition = require('./condition.js');
var ConditionRange = require('./range.js');
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

module.exports = Month;

function Month(number, parent) {
  var self = this;

  self.name = months[number - 1];
  self.number = number > 9 ? '' + number : '0' + number;
  self.conditions = ko.observableArray();

  self.newCondition = function() {
    parent.selectedCondition(new Condition(self));
  };

  self.addCondition = function(condition) {
    var obj = new Condition(self);

    obj.billingMethod(condition.billingMethod);
    obj.serviceType(condition.signal);
    obj.subscribersPackage(condition.package);
    obj.price(condition.price);

    (condition.ranges || []).forEach(function (i) {
      var range = new ConditionRange(obj);

      range.from(i.from);
      range.to(i.to);
      range.price(i.price);
      range.percentage(i.percentage);

      obj.ranges.push(range);
    });

    self.conditions.push(obj)
  };

  self.template = function(condition) {
    return condition.billingMethod().template;
  };
}

},{"./condition.js":"C:\\dev\\poc-premium\\models\\premium\\condition.js","./range.js":"C:\\dev\\poc-premium\\models\\premium\\range.js","knockout":"C:\\dev\\poc-premium\\node_modules\\knockout\\build\\output\\knockout-latest.debug.js"}],"C:\\dev\\poc-premium\\models\\premium\\range.js":[function(require,module,exports){
'use strict';

var ko = require('knockout');

module.exports = ConditionRange;

function ConditionRange(parent) {
  var self = this;

  self.from = ko.observable();
  self.to = ko.observable();
  self.price = ko.observable();
  self.percentage = ko.observable();

  self.from.subscribe(function (from) {
    var prev = previousRange();

    if (prev && prev.to() !== from) {
      prev.to(from);
    }
  });

  self.to.subscribe(function (to) {
    var next = nextRange();

    if (next && next.from() !== to) {
      next.from(to);
    }
  });

  function previousRange() {
    var ranges = parent.ranges();
    var ix = ranges.indexOf(self);

    return ranges[ix - 1];
  }

  function nextRange() {
    var ranges = parent.ranges();
    var ix = ranges.indexOf(self);

    return ranges[ix + 1];
  }
}

},{"knockout":"C:\\dev\\poc-premium\\node_modules\\knockout\\build\\output\\knockout-latest.debug.js"}],"C:\\dev\\poc-premium\\node_modules\\knockout\\build\\output\\knockout-latest.debug.js":[function(require,module,exports){
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

},{}]},{},["C:\\dev\\poc-premium\\main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcd2F0Y2hpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzovZGV2L3BvYy1wcmVtaXVtL21haW4uanMiLCJDOi9kZXYvcG9jLXByZW1pdW0vbW9kZWxzL2NvbmZpZy9iaWxsaW5nTWV0aG9kcy5qcyIsIkM6L2Rldi9wb2MtcHJlbWl1bS9tb2RlbHMvY29uZmlnL2luZGV4LmpzIiwiQzovZGV2L3BvYy1wcmVtaXVtL21vZGVscy9jb25maWcvaW52b2ljZUdyb3Vwcy5qcyIsIkM6L2Rldi9wb2MtcHJlbWl1bS9tb2RlbHMvY29uZmlnL3ByaWNlTWV0aG9kcy5qcyIsIkM6L2Rldi9wb2MtcHJlbWl1bS9tb2RlbHMvY29uZmlnL3Byb2R1Y3RzLmpzIiwiQzovZGV2L3BvYy1wcmVtaXVtL21vZGVscy9jb25maWcvc2VydmljZVR5cGVzLmpzIiwiQzovZGV2L3BvYy1wcmVtaXVtL21vZGVscy9jb25maWcvc3Vic2NyaWJlcnNQYWNrYWdlcy5qcyIsIkM6L2Rldi9wb2MtcHJlbWl1bS9tb2RlbHMvaW5kZXguanMiLCJDOi9kZXYvcG9jLXByZW1pdW0vbW9kZWxzL3ByZW1pdW0vY29uZGl0aW9uLmpzIiwiQzovZGV2L3BvYy1wcmVtaXVtL21vZGVscy9wcmVtaXVtL2luZGV4LmpzIiwiQzovZGV2L3BvYy1wcmVtaXVtL21vZGVscy9wcmVtaXVtL21vbnRoLmpzIiwiQzovZGV2L3BvYy1wcmVtaXVtL21vZGVscy9wcmVtaXVtL3JhbmdlLmpzIiwiQzovZGV2L3BvYy1wcmVtaXVtL25vZGVfbW9kdWxlcy9rbm9ja291dC9idWlsZC9vdXRwdXQva25vY2tvdXQtbGF0ZXN0LmRlYnVnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGtvID0gcmVxdWlyZSgna25vY2tvdXQnKTtcbnZhciBDb250cmFjdFByZW1pdW0gPSByZXF1aXJlKCcuL21vZGVscycpLkNvbnRyYWN0UHJlbWl1bTtcblxuLy8gbW9kZWwgZGVmaW5pdGlvblxudmFyIG1vZGVsID0gbmV3IENvbnRyYWN0UHJlbWl1bSgpO1xuXG5rby5hcHBseUJpbmRpbmdzKG1vZGVsKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIG1ldGhvZHMgPSBbe1xuICBuYW1lOiAnRmxhdCBGZWUnLFxuICB0ZW1wbGF0ZTogJ2ZsYXQtZmVlJyxcbn0sIHtcbiAgbmFtZTogJ1JldmVudWUgU2hhcmUnLFxuICB0ZW1wbGF0ZTogJ3JldmVudWUtc2hhcmUnLFxufSwge1xuICBuYW1lOiAnQWN0dWFsIFN1YnNjcmliZXJzJyxcbiAgdGVtcGxhdGU6ICdhY3R1YWwtc3Vic2NyaWJlcnMnLFxufV07XG5cbm1vZHVsZS5leHBvcnRzID0gbWV0aG9kcztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJpbGxpbmdNZXRob2RzID0gcmVxdWlyZSgnLi9iaWxsaW5nTWV0aG9kcy5qcycpO1xudmFyIGludm9pY2VHcm91cHMgPSByZXF1aXJlKCcuL2ludm9pY2VHcm91cHMuanMnKTtcbnZhciBwcmljZU1ldGhvZHMgPSByZXF1aXJlKCcuL3ByaWNlTWV0aG9kcy5qcycpO1xudmFyIHByb2R1Y3RzID0gcmVxdWlyZSgnLi9wcm9kdWN0cy5qcycpO1xudmFyIHNlcnZpY2VUeXBlcyA9IHJlcXVpcmUoJy4vc2VydmljZVR5cGVzLmpzJyk7XG52YXIgc3Vic2NyaWJlcnNQYWNrYWdlcyA9IHJlcXVpcmUoJy4vc3Vic2NyaWJlcnNQYWNrYWdlcy5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYmlsbGluZ01ldGhvZHM6IGJpbGxpbmdNZXRob2RzLFxuICBpbnZvaWNlR3JvdXBzOiBpbnZvaWNlR3JvdXBzLFxuICBwcmljZU1ldGhvZHM6IHByaWNlTWV0aG9kcyxcbiAgcHJvZHVjdHM6IHByb2R1Y3RzLFxuICBzZXJ2aWNlVHlwZXM6IHNlcnZpY2VUeXBlcyxcbiAgc3Vic2NyaWJlcnNQYWNrYWdlczogc3Vic2NyaWJlcnNQYWNrYWdlcyxcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBncm91cHMgPSBbMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTBdLm1hcChmdW5jdGlvbiAoaSkge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdJbnZvaWNlICcgKyBpLFxuICB9O1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZ3JvdXBzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ3JvdXBzID0gW3tcbiAgbmFtZTogJ0ZpeGVkJyxcbn0sIHtcbiAgbmFtZTogJ1JhbmdlJyxcbn0sIHtcbiAgbmFtZTogJ0luY3JlbWVudGFsJyxcbn1dO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdyb3VwcztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHR5cGVzID0gcmVxdWlyZSgnLi9zZXJ2aWNlVHlwZXMuanMnKTtcbnZhciBzaWduYWwgPSB0eXBlcy5maWx0ZXIoZnVuY3Rpb24gKHQpIHsgcmV0dXJuIHQubmFtZSA9PT0gJ1NpZ25hbCc7IH0pWzBdO1xudmFyIHBrZyA9IHR5cGVzLmZpbHRlcihmdW5jdGlvbiAodCkgeyByZXR1cm4gdC5uYW1lID09PSAnUGFja2FnZSc7IH0pWzBdO1xuXG52YXIgcHJvZHVjdHMgPSBbe1xuICBuYW1lOiAnU2lnbmFsIEZveCBIRCcsXG4gIHR5cGU6IHNpZ25hbCxcbn0sIHtcbiAgbmFtZTogJ1NpZ25hbCBGb3ggTGlmZScsXG4gIHR5cGU6IHNpZ25hbCxcbn0sIHtcbiAgbmFtZTogJ1NpZ25hbCBGb3ggU3BvcnRzJyxcbiAgdHlwZTogc2lnbmFsLFxufSwge1xuICBuYW1lOiAnU2lnbmFsIEZveCBTcG9ydHMgMicsXG4gIHR5cGU6IHNpZ25hbCxcbn0sIHtcbiAgbmFtZTogJ1NpZ25hbCBGb3ggU3BvcnRzIDIgSEQnLFxuICB0eXBlOiBzaWduYWwsXG59LCB7XG4gIG5hbWU6ICdTaWduYWwgRm94IFNwb3J0cyBQcmVtaXVtJyxcbiAgdHlwZTogc2lnbmFsLFxufSwge1xuICBuYW1lOiAnU2lnbmFsIEZYJyxcbiAgdHlwZTogc2lnbmFsLFxufSwge1xuICBuYW1lOiAnU2lnbmFsIEZYIEhEJyxcbiAgdHlwZTogc2lnbmFsLFxufSwge1xuICBuYW1lOiAnU2lnbmFsIE11bmRvIEZveCcsXG4gIHR5cGU6IHNpZ25hbCxcbn0sIHtcbiAgbmFtZTogJ0NGK05HJyxcbiAgdHlwZTogcGtnLFxufSwge1xuICBuYW1lOiAnQ0YrTkcrRlMnLFxuICB0eXBlOiBwa2csXG59LCB7XG4gIG5hbWU6ICdDRitORytGWCtGUzMrRkwnLFxuICB0eXBlOiBwa2csXG59LCB7XG4gIG5hbWU6ICdGUzMrTkdXJyxcbiAgdHlwZTogcGtnLFxufSwge1xuICBuYW1lOiAnRkwrTkdXK0ZTMycsXG4gIHR5cGU6IHBrZyxcbn0sIHtcbiAgbmFtZTogJ1N5ZnkrVUMnLFxuICB0eXBlOiBwa2csXG59LCB7XG4gIG5hbWU6ICdGU0IrRlMyJyxcbiAgdHlwZTogcGtnLFxufSwge1xuICBuYW1lOiAnQ0YrTkcrRlMzJyxcbiAgdHlwZTogcGtnLFxufSwge1xuICBuYW1lOiAnVVRJTElTK0NGK05HK0ZYK0ZMJyxcbiAgdHlwZTogcGtnLFxufV07XG5cbm1vZHVsZS5leHBvcnRzID0gcHJvZHVjdHM7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB0eXBlcyA9IFt7XG4gIG5hbWU6ICdTaWduYWwnLFxufSwge1xuICBuYW1lOiAnUGFja2FnZScsXG59XTtcblxubW9kdWxlLmV4cG9ydHMgPSB0eXBlcztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHBhY2thZ2VzID0gW3tcbiAgbmFtZTogJ05ldycsXG59LCB7XG4gIG5hbWU6ICdPbGQnLFxufSwge1xuICBuYW1lOiAnQWxsJyxcbn1dO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHBhY2thZ2VzO1xuIiwidmFyIENvbnRyYWN0UHJlbWl1bSA9IHJlcXVpcmUoJy4vcHJlbWl1bScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQ29udHJhY3RQcmVtaXVtOiBDb250cmFjdFByZW1pdW1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBrbyA9IHJlcXVpcmUoJ2tub2Nrb3V0Jyk7XG52YXIgQ29uZGl0aW9uUmFuZ2UgPSByZXF1aXJlKCcuL3JhbmdlLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ29uZGl0aW9uO1xuXG5mdW5jdGlvbiBDb25kaXRpb24ocGFyZW50KSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIHN1YnNjcmlwdGlvbnMgPSBbXTtcblxuICBzZWxmLmJpbGxpbmdNZXRob2QgPSBrby5vYnNlcnZhYmxlKCk7XG4gIHNlbGYuaW52b2ljZUdyb3VwID0ga28ub2JzZXJ2YWJsZSgpO1xuICBzZWxmLnByaWNlTWV0aG9kID0ga28ub2JzZXJ2YWJsZSgpO1xuICBzZWxmLnNlcnZpY2VUeXBlID0ga28ub2JzZXJ2YWJsZSgpO1xuICBzZWxmLnN1YnNjcmliZXJzUGFja2FnZSA9IGtvLm9ic2VydmFibGUoKTtcbiAgc2VsZi5wcm9kdWN0ID0ga28ub2JzZXJ2YWJsZSgpO1xuICBzZWxmLnByaWNlID0ga28ub2JzZXJ2YWJsZSgpO1xuICBzZWxmLnJhbmdlcyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xuXG4gIHNlbGYuYWRkVG9Nb250aCA9IGZ1bmN0aW9uICgpIHtcbiAgICBwYXJlbnQuY29uZGl0aW9ucy5wdXNoKHNlbGYpO1xuICB9O1xuXG4gIGluaXRpYWxpemVOZXdSYW5nZSgpO1xuXG4gIGZ1bmN0aW9uIGluaXRpYWxpemVOZXdSYW5nZSgpIHtcbiAgICB2YXIgbGFzdFJhbmdlO1xuXG4gICAgc2VsZi5yYW5nZXMucHVzaChuZXcgQ29uZGl0aW9uUmFuZ2Uoc2VsZikpO1xuICAgIGxhc3RSYW5nZSA9IHNlbGYucmFuZ2VzKClbc2VsZi5yYW5nZXMoKS5sZW5ndGggLSAxXTtcbiAgICBbXG4gICAgICAndG8nLFxuICAgICAgJ3ByaWNlJyxcbiAgICAgICdwZXJjZW50YWdlJyxcbiAgICBdLm1hcChmdW5jdGlvbiAoZikge1xuICAgICAgcmV0dXJuIGxhc3RSYW5nZVtmXS5zdWJzY3JpYmUoYWRkTmV3UmFuZ2UuYmluZChzZWxmLCBmKSk7XG4gICAgfSkuZm9yRWFjaChmdW5jdGlvbiAocykge1xuICAgICAgc3Vic2NyaXB0aW9ucy5wdXNoKHMpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkTmV3UmFuZ2UoZmllbGQpIHtcbiAgICBjb25zb2xlLmxvZyhmaWVsZCk7XG5cbiAgICBzdWJzY3JpcHRpb25zLmZvckVhY2goZnVuY3Rpb24gKHMpIHtcbiAgICAgIHMuZGlzcG9zZSgpO1xuICAgIH0pO1xuICAgIHN1YnNjcmlwdGlvbnMgPSBbXTtcbiAgICBpbml0aWFsaXplTmV3UmFuZ2UoKTtcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIga28gPSByZXF1aXJlKCdrbm9ja291dCcpO1xudmFyIE1vbnRoID0gcmVxdWlyZSgnLi9tb250aC5qcycpO1xudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRyYWN0UHJlbWl1bTtcblxuZnVuY3Rpb24gQ29udHJhY3RQcmVtaXVtKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgc2VsZi5iaWxsaW5nTWV0aG9kcyA9IGNvbmZpZy5iaWxsaW5nTWV0aG9kcztcbiAgc2VsZi5pbnZvaWNlR3JvdXBzID0gY29uZmlnLmludm9pY2VHcm91cHM7XG4gIHNlbGYucHJpY2VNZXRob2RzID0gY29uZmlnLnByaWNlTWV0aG9kcztcbiAgc2VsZi5zZXJ2aWNlVHlwZXMgPSBjb25maWcuc2VydmljZVR5cGVzO1xuICBzZWxmLnN1YnNjcmliZXJzUGFja2FnZXMgPSBjb25maWcuc3Vic2NyaWJlcnNQYWNrYWdlcztcbiAgc2VsZi5tb250aHMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcbiAgc2VsZi5zZWxlY3RlZENvbmRpdGlvbiA9IGtvLm9ic2VydmFibGUoKTtcblxuICBzZWxmLnByb2R1Y3RzRm9yID0gZnVuY3Rpb24gKHR5cGUpIHtcbiAgICByZXR1cm4ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGNvbmZpZy5wcm9kdWN0cy5maWx0ZXIoZnVuY3Rpb24gKHApIHsgcmV0dXJuIHAudHlwZSA9PT0gdHlwZSgpOyB9KTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBpbml0aWFsIGRhdGFcbiAgWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTJdLm1hcChmdW5jdGlvbiAoaSkge1xuICAgIHJldHVybiBuZXcgTW9udGgoaSwgc2VsZik7XG4gIH0pLmZvckVhY2goYWRkTW9udGgpO1xuXG4gIHNlbGYubW9udGhzKClbMF0uYWRkQ29uZGl0aW9uKHtcbiAgICBiaWxsaW5nTWV0aG9kOiBjb25maWcuYmlsbGluZ01ldGhvZHNbMF0sIC8vIGZsYXQgZmVlXG4gICAgc2lnbmFsOiAnSEQgQmFzaWMnLFxuICAgIHBhY2thZ2U6ICdQcmVtaXVtIEZveCBTcG9ydHMnLFxuICAgIHByaWNlOiAwLFxuICB9KTtcblxuICBzZWxmLm1vbnRocygpWzBdLmFkZENvbmRpdGlvbih7XG4gICAgYmlsbGluZ01ldGhvZDogY29uZmlnLmJpbGxpbmdNZXRob2RzWzFdLCAvLyByZXZlbnVlIHNoYXJlXG4gICAgc2lnbmFsOiAnSEQgQmFzaWMnLFxuICAgIHBhY2thZ2U6ICdQcmVtaXVtIEZveCBTcG9ydHMnLFxuICB9KTtcblxuICBmdW5jdGlvbiBhZGRNb250aChtb250aCkge1xuICAgIHNlbGYubW9udGhzLnB1c2gobW9udGgpO1xuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBrbyA9IHJlcXVpcmUoJ2tub2Nrb3V0Jyk7XG52YXIgQ29uZGl0aW9uID0gcmVxdWlyZSgnLi9jb25kaXRpb24uanMnKTtcbnZhciBDb25kaXRpb25SYW5nZSA9IHJlcXVpcmUoJy4vcmFuZ2UuanMnKTtcbnZhciBtb250aHMgPSBbJ0phbnVhcnknLCAnRmVicnVhcnknLCAnTWFyY2gnLCAnQXByaWwnLCAnTWF5JywgJ0p1bmUnLCAnSnVseScsICdBdWd1c3QnLCAnU2VwdGVtYmVyJywgJ09jdG9iZXInLCAnTm92ZW1iZXInLCAnRGVjZW1iZXInXTtcblxubW9kdWxlLmV4cG9ydHMgPSBNb250aDtcblxuZnVuY3Rpb24gTW9udGgobnVtYmVyLCBwYXJlbnQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHNlbGYubmFtZSA9IG1vbnRoc1tudW1iZXIgLSAxXTtcbiAgc2VsZi5udW1iZXIgPSBudW1iZXIgPiA5ID8gJycgKyBudW1iZXIgOiAnMCcgKyBudW1iZXI7XG4gIHNlbGYuY29uZGl0aW9ucyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xuXG4gIHNlbGYubmV3Q29uZGl0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgcGFyZW50LnNlbGVjdGVkQ29uZGl0aW9uKG5ldyBDb25kaXRpb24oc2VsZikpO1xuICB9O1xuXG4gIHNlbGYuYWRkQ29uZGl0aW9uID0gZnVuY3Rpb24oY29uZGl0aW9uKSB7XG4gICAgdmFyIG9iaiA9IG5ldyBDb25kaXRpb24oc2VsZik7XG5cbiAgICBvYmouYmlsbGluZ01ldGhvZChjb25kaXRpb24uYmlsbGluZ01ldGhvZCk7XG4gICAgb2JqLnNlcnZpY2VUeXBlKGNvbmRpdGlvbi5zaWduYWwpO1xuICAgIG9iai5zdWJzY3JpYmVyc1BhY2thZ2UoY29uZGl0aW9uLnBhY2thZ2UpO1xuICAgIG9iai5wcmljZShjb25kaXRpb24ucHJpY2UpO1xuXG4gICAgKGNvbmRpdGlvbi5yYW5nZXMgfHwgW10pLmZvckVhY2goZnVuY3Rpb24gKGkpIHtcbiAgICAgIHZhciByYW5nZSA9IG5ldyBDb25kaXRpb25SYW5nZShvYmopO1xuXG4gICAgICByYW5nZS5mcm9tKGkuZnJvbSk7XG4gICAgICByYW5nZS50byhpLnRvKTtcbiAgICAgIHJhbmdlLnByaWNlKGkucHJpY2UpO1xuICAgICAgcmFuZ2UucGVyY2VudGFnZShpLnBlcmNlbnRhZ2UpO1xuXG4gICAgICBvYmoucmFuZ2VzLnB1c2gocmFuZ2UpO1xuICAgIH0pO1xuXG4gICAgc2VsZi5jb25kaXRpb25zLnB1c2gob2JqKVxuICB9O1xuXG4gIHNlbGYudGVtcGxhdGUgPSBmdW5jdGlvbihjb25kaXRpb24pIHtcbiAgICByZXR1cm4gY29uZGl0aW9uLmJpbGxpbmdNZXRob2QoKS50ZW1wbGF0ZTtcbiAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGtvID0gcmVxdWlyZSgna25vY2tvdXQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb25kaXRpb25SYW5nZTtcblxuZnVuY3Rpb24gQ29uZGl0aW9uUmFuZ2UocGFyZW50KSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBzZWxmLmZyb20gPSBrby5vYnNlcnZhYmxlKCk7XG4gIHNlbGYudG8gPSBrby5vYnNlcnZhYmxlKCk7XG4gIHNlbGYucHJpY2UgPSBrby5vYnNlcnZhYmxlKCk7XG4gIHNlbGYucGVyY2VudGFnZSA9IGtvLm9ic2VydmFibGUoKTtcblxuICBzZWxmLmZyb20uc3Vic2NyaWJlKGZ1bmN0aW9uIChmcm9tKSB7XG4gICAgdmFyIHByZXYgPSBwcmV2aW91c1JhbmdlKCk7XG5cbiAgICBpZiAocHJldiAmJiBwcmV2LnRvKCkgIT09IGZyb20pIHtcbiAgICAgIHByZXYudG8oZnJvbSk7XG4gICAgfVxuICB9KTtcblxuICBzZWxmLnRvLnN1YnNjcmliZShmdW5jdGlvbiAodG8pIHtcbiAgICB2YXIgbmV4dCA9IG5leHRSYW5nZSgpO1xuXG4gICAgaWYgKG5leHQgJiYgbmV4dC5mcm9tKCkgIT09IHRvKSB7XG4gICAgICBuZXh0LmZyb20odG8pO1xuICAgIH1cbiAgfSk7XG5cbiAgZnVuY3Rpb24gcHJldmlvdXNSYW5nZSgpIHtcbiAgICB2YXIgcmFuZ2VzID0gcGFyZW50LnJhbmdlcygpO1xuICAgIHZhciBpeCA9IHJhbmdlcy5pbmRleE9mKHNlbGYpO1xuXG4gICAgcmV0dXJuIHJhbmdlc1tpeCAtIDFdO1xuICB9XG5cbiAgZnVuY3Rpb24gbmV4dFJhbmdlKCkge1xuICAgIHZhciByYW5nZXMgPSBwYXJlbnQucmFuZ2VzKCk7XG4gICAgdmFyIGl4ID0gcmFuZ2VzLmluZGV4T2Yoc2VsZik7XG5cbiAgICByZXR1cm4gcmFuZ2VzW2l4ICsgMV07XG4gIH1cbn1cbiIsIi8qIVxuICogS25vY2tvdXQgSmF2YVNjcmlwdCBsaWJyYXJ5IHYzLjIuMFxuICogKGMpIFN0ZXZlbiBTYW5kZXJzb24gLSBodHRwOi8va25vY2tvdXRqcy5jb20vXG4gKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuICovXG5cbihmdW5jdGlvbigpe1xudmFyIERFQlVHPXRydWU7XG4oZnVuY3Rpb24odW5kZWZpbmVkKXtcbiAgICAvLyAoMCwgZXZhbCkoJ3RoaXMnKSBpcyBhIHJvYnVzdCB3YXkgb2YgZ2V0dGluZyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdFxuICAgIC8vIEZvciBkZXRhaWxzLCBzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNDExOTk4OC9yZXR1cm4tdGhpcy0wLWV2YWx0aGlzLzE0MTIwMDIzIzE0MTIwMDIzXG4gICAgdmFyIHdpbmRvdyA9IHRoaXMgfHwgKDAsIGV2YWwpKCd0aGlzJyksXG4gICAgICAgIGRvY3VtZW50ID0gd2luZG93Wydkb2N1bWVudCddLFxuICAgICAgICBuYXZpZ2F0b3IgPSB3aW5kb3dbJ25hdmlnYXRvciddLFxuICAgICAgICBqUXVlcnlJbnN0YW5jZSA9IHdpbmRvd1tcImpRdWVyeVwiXSxcbiAgICAgICAgSlNPTiA9IHdpbmRvd1tcIkpTT05cIl07XG4oZnVuY3Rpb24oZmFjdG9yeSkge1xuICAgIC8vIFN1cHBvcnQgdGhyZWUgbW9kdWxlIGxvYWRpbmcgc2NlbmFyaW9zXG4gICAgaWYgKHR5cGVvZiByZXF1aXJlID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAvLyBbMV0gQ29tbW9uSlMvTm9kZS5qc1xuICAgICAgICB2YXIgdGFyZ2V0ID0gbW9kdWxlWydleHBvcnRzJ10gfHwgZXhwb3J0czsgLy8gbW9kdWxlLmV4cG9ydHMgaXMgZm9yIE5vZGUuanNcbiAgICAgICAgZmFjdG9yeSh0YXJnZXQsIHJlcXVpcmUpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmVbJ2FtZCddKSB7XG4gICAgICAgIC8vIFsyXSBBTUQgYW5vbnltb3VzIG1vZHVsZVxuICAgICAgICBkZWZpbmUoWydleHBvcnRzJywgJ3JlcXVpcmUnXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gWzNdIE5vIG1vZHVsZSBsb2FkZXIgKHBsYWluIDxzY3JpcHQ+IHRhZykgLSBwdXQgZGlyZWN0bHkgaW4gZ2xvYmFsIG5hbWVzcGFjZVxuICAgICAgICBmYWN0b3J5KHdpbmRvd1sna28nXSA9IHt9KTtcbiAgICB9XG59KGZ1bmN0aW9uKGtvRXhwb3J0cywgcmVxdWlyZSl7XG4vLyBJbnRlcm5hbGx5LCBhbGwgS08gb2JqZWN0cyBhcmUgYXR0YWNoZWQgdG8ga29FeHBvcnRzIChldmVuIHRoZSBub24tZXhwb3J0ZWQgb25lcyB3aG9zZSBuYW1lcyB3aWxsIGJlIG1pbmlmaWVkIGJ5IHRoZSBjbG9zdXJlIGNvbXBpbGVyKS5cbi8vIEluIHRoZSBmdXR1cmUsIHRoZSBmb2xsb3dpbmcgXCJrb1wiIHZhcmlhYmxlIG1heSBiZSBtYWRlIGRpc3RpbmN0IGZyb20gXCJrb0V4cG9ydHNcIiBzbyB0aGF0IHByaXZhdGUgb2JqZWN0cyBhcmUgbm90IGV4dGVybmFsbHkgcmVhY2hhYmxlLlxudmFyIGtvID0gdHlwZW9mIGtvRXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcgPyBrb0V4cG9ydHMgOiB7fTtcbi8vIEdvb2dsZSBDbG9zdXJlIENvbXBpbGVyIGhlbHBlcnMgKHVzZWQgb25seSB0byBtYWtlIHRoZSBtaW5pZmllZCBmaWxlIHNtYWxsZXIpXG5rby5leHBvcnRTeW1ib2wgPSBmdW5jdGlvbihrb1BhdGgsIG9iamVjdCkge1xuICAgIHZhciB0b2tlbnMgPSBrb1BhdGguc3BsaXQoXCIuXCIpO1xuXG4gICAgLy8gSW4gdGhlIGZ1dHVyZSwgXCJrb1wiIG1heSBiZWNvbWUgZGlzdGluY3QgZnJvbSBcImtvRXhwb3J0c1wiIChzbyB0aGF0IG5vbi1leHBvcnRlZCBvYmplY3RzIGFyZSBub3QgcmVhY2hhYmxlKVxuICAgIC8vIEF0IHRoYXQgcG9pbnQsIFwidGFyZ2V0XCIgd291bGQgYmUgc2V0IHRvOiAodHlwZW9mIGtvRXhwb3J0cyAhPT0gXCJ1bmRlZmluZWRcIiA/IGtvRXhwb3J0cyA6IGtvKVxuICAgIHZhciB0YXJnZXQgPSBrbztcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aCAtIDE7IGkrKylcbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0W3Rva2Vuc1tpXV07XG4gICAgdGFyZ2V0W3Rva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV1dID0gb2JqZWN0O1xufTtcbmtvLmV4cG9ydFByb3BlcnR5ID0gZnVuY3Rpb24ob3duZXIsIHB1YmxpY05hbWUsIG9iamVjdCkge1xuICAgIG93bmVyW3B1YmxpY05hbWVdID0gb2JqZWN0O1xufTtcbmtvLnZlcnNpb24gPSBcIjMuMi4wXCI7XG5cbmtvLmV4cG9ydFN5bWJvbCgndmVyc2lvbicsIGtvLnZlcnNpb24pO1xua28udXRpbHMgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIG9iamVjdEZvckVhY2gob2JqLCBhY3Rpb24pIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgICAgICBhY3Rpb24ocHJvcCwgb2JqW3Byb3BdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4dGVuZCh0YXJnZXQsIHNvdXJjZSkge1xuICAgICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgICAgICBmb3IodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgICAgICAgICAgaWYoc291cmNlLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRQcm90b3R5cGVPZihvYmosIHByb3RvKSB7XG4gICAgICAgIG9iai5fX3Byb3RvX18gPSBwcm90bztcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG5cbiAgICB2YXIgY2FuU2V0UHJvdG90eXBlID0gKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkpO1xuXG4gICAgLy8gUmVwcmVzZW50IHRoZSBrbm93biBldmVudCB0eXBlcyBpbiBhIGNvbXBhY3Qgd2F5LCB0aGVuIGF0IHJ1bnRpbWUgdHJhbnNmb3JtIGl0IGludG8gYSBoYXNoIHdpdGggZXZlbnQgbmFtZSBhcyBrZXkgKGZvciBmYXN0IGxvb2t1cClcbiAgICB2YXIga25vd25FdmVudHMgPSB7fSwga25vd25FdmVudFR5cGVzQnlFdmVudE5hbWUgPSB7fTtcbiAgICB2YXIga2V5RXZlbnRUeXBlTmFtZSA9IChuYXZpZ2F0b3IgJiYgL0ZpcmVmb3hcXC8yL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSkgPyAnS2V5Ym9hcmRFdmVudCcgOiAnVUlFdmVudHMnO1xuICAgIGtub3duRXZlbnRzW2tleUV2ZW50VHlwZU5hbWVdID0gWydrZXl1cCcsICdrZXlkb3duJywgJ2tleXByZXNzJ107XG4gICAga25vd25FdmVudHNbJ01vdXNlRXZlbnRzJ10gPSBbJ2NsaWNrJywgJ2RibGNsaWNrJywgJ21vdXNlZG93bicsICdtb3VzZXVwJywgJ21vdXNlbW92ZScsICdtb3VzZW92ZXInLCAnbW91c2VvdXQnLCAnbW91c2VlbnRlcicsICdtb3VzZWxlYXZlJ107XG4gICAgb2JqZWN0Rm9yRWFjaChrbm93bkV2ZW50cywgZnVuY3Rpb24oZXZlbnRUeXBlLCBrbm93bkV2ZW50c0ZvclR5cGUpIHtcbiAgICAgICAgaWYgKGtub3duRXZlbnRzRm9yVHlwZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0ga25vd25FdmVudHNGb3JUeXBlLmxlbmd0aDsgaSA8IGo7IGkrKylcbiAgICAgICAgICAgICAgICBrbm93bkV2ZW50VHlwZXNCeUV2ZW50TmFtZVtrbm93bkV2ZW50c0ZvclR5cGVbaV1dID0gZXZlbnRUeXBlO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGV2ZW50c1RoYXRNdXN0QmVSZWdpc3RlcmVkVXNpbmdBdHRhY2hFdmVudCA9IHsgJ3Byb3BlcnR5Y2hhbmdlJzogdHJ1ZSB9OyAvLyBXb3JrYXJvdW5kIGZvciBhbiBJRTkgaXNzdWUgLSBodHRwczovL2dpdGh1Yi5jb20vU3RldmVTYW5kZXJzb24va25vY2tvdXQvaXNzdWVzLzQwNlxuXG4gICAgLy8gRGV0ZWN0IElFIHZlcnNpb25zIGZvciBidWcgd29ya2Fyb3VuZHMgKHVzZXMgSUUgY29uZGl0aW9uYWxzLCBub3QgVUEgc3RyaW5nLCBmb3Igcm9idXN0bmVzcylcbiAgICAvLyBOb3RlIHRoYXQsIHNpbmNlIElFIDEwIGRvZXMgbm90IHN1cHBvcnQgY29uZGl0aW9uYWwgY29tbWVudHMsIHRoZSBmb2xsb3dpbmcgbG9naWMgb25seSBkZXRlY3RzIElFIDwgMTAuXG4gICAgLy8gQ3VycmVudGx5IHRoaXMgaXMgYnkgZGVzaWduLCBzaW5jZSBJRSAxMCsgYmVoYXZlcyBjb3JyZWN0bHkgd2hlbiB0cmVhdGVkIGFzIGEgc3RhbmRhcmQgYnJvd3Nlci5cbiAgICAvLyBJZiB0aGVyZSBpcyBhIGZ1dHVyZSBuZWVkIHRvIGRldGVjdCBzcGVjaWZpYyB2ZXJzaW9ucyBvZiBJRTEwKywgd2Ugd2lsbCBhbWVuZCB0aGlzLlxuICAgIHZhciBpZVZlcnNpb24gPSBkb2N1bWVudCAmJiAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2ZXJzaW9uID0gMywgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksIGlFbGVtcyA9IGRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaScpO1xuXG4gICAgICAgIC8vIEtlZXAgY29uc3RydWN0aW5nIGNvbmRpdGlvbmFsIEhUTUwgYmxvY2tzIHVudGlsIHdlIGhpdCBvbmUgdGhhdCByZXNvbHZlcyB0byBhbiBlbXB0eSBmcmFnbWVudFxuICAgICAgICB3aGlsZSAoXG4gICAgICAgICAgICBkaXYuaW5uZXJIVE1MID0gJzwhLS1baWYgZ3QgSUUgJyArICgrK3ZlcnNpb24pICsgJ10+PGk+PC9pPjwhW2VuZGlmXS0tPicsXG4gICAgICAgICAgICBpRWxlbXNbMF1cbiAgICAgICAgKSB7fVxuICAgICAgICByZXR1cm4gdmVyc2lvbiA+IDQgPyB2ZXJzaW9uIDogdW5kZWZpbmVkO1xuICAgIH0oKSk7XG4gICAgdmFyIGlzSWU2ID0gaWVWZXJzaW9uID09PSA2LFxuICAgICAgICBpc0llNyA9IGllVmVyc2lvbiA9PT0gNztcblxuICAgIGZ1bmN0aW9uIGlzQ2xpY2tPbkNoZWNrYWJsZUVsZW1lbnQoZWxlbWVudCwgZXZlbnRUeXBlKSB7XG4gICAgICAgIGlmICgoa28udXRpbHMudGFnTmFtZUxvd2VyKGVsZW1lbnQpICE9PSBcImlucHV0XCIpIHx8ICFlbGVtZW50LnR5cGUpIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKGV2ZW50VHlwZS50b0xvd2VyQ2FzZSgpICE9IFwiY2xpY2tcIikgcmV0dXJuIGZhbHNlO1xuICAgICAgICB2YXIgaW5wdXRUeXBlID0gZWxlbWVudC50eXBlO1xuICAgICAgICByZXR1cm4gKGlucHV0VHlwZSA9PSBcImNoZWNrYm94XCIpIHx8IChpbnB1dFR5cGUgPT0gXCJyYWRpb1wiKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBmaWVsZHNJbmNsdWRlZFdpdGhKc29uUG9zdDogWydhdXRoZW50aWNpdHlfdG9rZW4nLCAvXl9fUmVxdWVzdFZlcmlmaWNhdGlvblRva2VuKF8uKik/JC9dLFxuXG4gICAgICAgIGFycmF5Rm9yRWFjaDogZnVuY3Rpb24gKGFycmF5LCBhY3Rpb24pIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gYXJyYXkubGVuZ3RoOyBpIDwgajsgaSsrKVxuICAgICAgICAgICAgICAgIGFjdGlvbihhcnJheVtpXSwgaSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYXJyYXlJbmRleE9mOiBmdW5jdGlvbiAoYXJyYXksIGl0ZW0pIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgQXJyYXkucHJvdG90eXBlLmluZGV4T2YgPT0gXCJmdW5jdGlvblwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGFycmF5LCBpdGVtKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gYXJyYXkubGVuZ3RoOyBpIDwgajsgaSsrKVxuICAgICAgICAgICAgICAgIGlmIChhcnJheVtpXSA9PT0gaXRlbSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYXJyYXlGaXJzdDogZnVuY3Rpb24gKGFycmF5LCBwcmVkaWNhdGUsIHByZWRpY2F0ZU93bmVyKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IGFycmF5Lmxlbmd0aDsgaSA8IGo7IGkrKylcbiAgICAgICAgICAgICAgICBpZiAocHJlZGljYXRlLmNhbGwocHJlZGljYXRlT3duZXIsIGFycmF5W2ldLCBpKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFycmF5W2ldO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYXJyYXlSZW1vdmVJdGVtOiBmdW5jdGlvbiAoYXJyYXksIGl0ZW1Ub1JlbW92ZSkge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0ga28udXRpbHMuYXJyYXlJbmRleE9mKGFycmF5LCBpdGVtVG9SZW1vdmUpO1xuICAgICAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgIGFycmF5LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGFycmF5LnNoaWZ0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgYXJyYXlHZXREaXN0aW5jdFZhbHVlczogZnVuY3Rpb24gKGFycmF5KSB7XG4gICAgICAgICAgICBhcnJheSA9IGFycmF5IHx8IFtdO1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBhcnJheS5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoa28udXRpbHMuYXJyYXlJbmRleE9mKHJlc3VsdCwgYXJyYXlbaV0pIDwgMClcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goYXJyYXlbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSxcblxuICAgICAgICBhcnJheU1hcDogZnVuY3Rpb24gKGFycmF5LCBtYXBwaW5nKSB7XG4gICAgICAgICAgICBhcnJheSA9IGFycmF5IHx8IFtdO1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBhcnJheS5sZW5ndGg7IGkgPCBqOyBpKyspXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gobWFwcGluZyhhcnJheVtpXSwgaSkpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSxcblxuICAgICAgICBhcnJheUZpbHRlcjogZnVuY3Rpb24gKGFycmF5LCBwcmVkaWNhdGUpIHtcbiAgICAgICAgICAgIGFycmF5ID0gYXJyYXkgfHwgW107XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IGFycmF5Lmxlbmd0aDsgaSA8IGo7IGkrKylcbiAgICAgICAgICAgICAgICBpZiAocHJlZGljYXRlKGFycmF5W2ldLCBpKSlcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goYXJyYXlbaV0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSxcblxuICAgICAgICBhcnJheVB1c2hBbGw6IGZ1bmN0aW9uIChhcnJheSwgdmFsdWVzVG9QdXNoKSB7XG4gICAgICAgICAgICBpZiAodmFsdWVzVG9QdXNoIGluc3RhbmNlb2YgQXJyYXkpXG4gICAgICAgICAgICAgICAgYXJyYXkucHVzaC5hcHBseShhcnJheSwgdmFsdWVzVG9QdXNoKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IHZhbHVlc1RvUHVzaC5sZW5ndGg7IGkgPCBqOyBpKyspXG4gICAgICAgICAgICAgICAgICAgIGFycmF5LnB1c2godmFsdWVzVG9QdXNoW2ldKTtcbiAgICAgICAgICAgIHJldHVybiBhcnJheTtcbiAgICAgICAgfSxcblxuICAgICAgICBhZGRPclJlbW92ZUl0ZW06IGZ1bmN0aW9uKGFycmF5LCB2YWx1ZSwgaW5jbHVkZWQpIHtcbiAgICAgICAgICAgIHZhciBleGlzdGluZ0VudHJ5SW5kZXggPSBrby51dGlscy5hcnJheUluZGV4T2Yoa28udXRpbHMucGVla09ic2VydmFibGUoYXJyYXkpLCB2YWx1ZSk7XG4gICAgICAgICAgICBpZiAoZXhpc3RpbmdFbnRyeUluZGV4IDwgMCkge1xuICAgICAgICAgICAgICAgIGlmIChpbmNsdWRlZClcbiAgICAgICAgICAgICAgICAgICAgYXJyYXkucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghaW5jbHVkZWQpXG4gICAgICAgICAgICAgICAgICAgIGFycmF5LnNwbGljZShleGlzdGluZ0VudHJ5SW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGNhblNldFByb3RvdHlwZTogY2FuU2V0UHJvdG90eXBlLFxuXG4gICAgICAgIGV4dGVuZDogZXh0ZW5kLFxuXG4gICAgICAgIHNldFByb3RvdHlwZU9mOiBzZXRQcm90b3R5cGVPZixcblxuICAgICAgICBzZXRQcm90b3R5cGVPZk9yRXh0ZW5kOiBjYW5TZXRQcm90b3R5cGUgPyBzZXRQcm90b3R5cGVPZiA6IGV4dGVuZCxcblxuICAgICAgICBvYmplY3RGb3JFYWNoOiBvYmplY3RGb3JFYWNoLFxuXG4gICAgICAgIG9iamVjdE1hcDogZnVuY3Rpb24oc291cmNlLCBtYXBwaW5nKSB7XG4gICAgICAgICAgICBpZiAoIXNvdXJjZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gc291cmNlO1xuICAgICAgICAgICAgdmFyIHRhcmdldCA9IHt9O1xuICAgICAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFtwcm9wXSA9IG1hcHBpbmcoc291cmNlW3Byb3BdLCBwcm9wLCBzb3VyY2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZW1wdHlEb21Ob2RlOiBmdW5jdGlvbiAoZG9tTm9kZSkge1xuICAgICAgICAgICAgd2hpbGUgKGRvbU5vZGUuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgICAgIGtvLnJlbW92ZU5vZGUoZG9tTm9kZS5maXJzdENoaWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBtb3ZlQ2xlYW5lZE5vZGVzVG9Db250YWluZXJFbGVtZW50OiBmdW5jdGlvbihub2Rlcykge1xuICAgICAgICAgICAgLy8gRW5zdXJlIGl0J3MgYSByZWFsIGFycmF5LCBhcyB3ZSdyZSBhYm91dCB0byByZXBhcmVudCB0aGUgbm9kZXMgYW5kXG4gICAgICAgICAgICAvLyB3ZSBkb24ndCB3YW50IHRoZSB1bmRlcmx5aW5nIGNvbGxlY3Rpb24gdG8gY2hhbmdlIHdoaWxlIHdlJ3JlIGRvaW5nIHRoYXQuXG4gICAgICAgICAgICB2YXIgbm9kZXNBcnJheSA9IGtvLnV0aWxzLm1ha2VBcnJheShub2Rlcyk7XG5cbiAgICAgICAgICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gbm9kZXNBcnJheS5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoa28uY2xlYW5Ob2RlKG5vZGVzQXJyYXlbaV0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjb250YWluZXI7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2xvbmVOb2RlczogZnVuY3Rpb24gKG5vZGVzQXJyYXksIHNob3VsZENsZWFuTm9kZXMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gbm9kZXNBcnJheS5sZW5ndGgsIG5ld05vZGVzQXJyYXkgPSBbXTsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBjbG9uZWROb2RlID0gbm9kZXNBcnJheVtpXS5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgbmV3Tm9kZXNBcnJheS5wdXNoKHNob3VsZENsZWFuTm9kZXMgPyBrby5jbGVhbk5vZGUoY2xvbmVkTm9kZSkgOiBjbG9uZWROb2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXdOb2Rlc0FycmF5O1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldERvbU5vZGVDaGlsZHJlbjogZnVuY3Rpb24gKGRvbU5vZGUsIGNoaWxkTm9kZXMpIHtcbiAgICAgICAgICAgIGtvLnV0aWxzLmVtcHR5RG9tTm9kZShkb21Ob2RlKTtcbiAgICAgICAgICAgIGlmIChjaGlsZE5vZGVzKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBjaGlsZE5vZGVzLmxlbmd0aDsgaSA8IGo7IGkrKylcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5hcHBlbmRDaGlsZChjaGlsZE5vZGVzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICByZXBsYWNlRG9tTm9kZXM6IGZ1bmN0aW9uIChub2RlVG9SZXBsYWNlT3JOb2RlQXJyYXksIG5ld05vZGVzQXJyYXkpIHtcbiAgICAgICAgICAgIHZhciBub2Rlc1RvUmVwbGFjZUFycmF5ID0gbm9kZVRvUmVwbGFjZU9yTm9kZUFycmF5Lm5vZGVUeXBlID8gW25vZGVUb1JlcGxhY2VPck5vZGVBcnJheV0gOiBub2RlVG9SZXBsYWNlT3JOb2RlQXJyYXk7XG4gICAgICAgICAgICBpZiAobm9kZXNUb1JlcGxhY2VBcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIGluc2VydGlvblBvaW50ID0gbm9kZXNUb1JlcGxhY2VBcnJheVswXTtcbiAgICAgICAgICAgICAgICB2YXIgcGFyZW50ID0gaW5zZXJ0aW9uUG9pbnQucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IG5ld05vZGVzQXJyYXkubGVuZ3RoOyBpIDwgajsgaSsrKVxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKG5ld05vZGVzQXJyYXlbaV0sIGluc2VydGlvblBvaW50KTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IG5vZGVzVG9SZXBsYWNlQXJyYXkubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGtvLnJlbW92ZU5vZGUobm9kZXNUb1JlcGxhY2VBcnJheVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGZpeFVwQ29udGludW91c05vZGVBcnJheTogZnVuY3Rpb24oY29udGludW91c05vZGVBcnJheSwgcGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgLy8gQmVmb3JlIGFjdGluZyBvbiBhIHNldCBvZiBub2RlcyB0aGF0IHdlcmUgcHJldmlvdXNseSBvdXRwdXR0ZWQgYnkgYSB0ZW1wbGF0ZSBmdW5jdGlvbiwgd2UgaGF2ZSB0byByZWNvbmNpbGVcbiAgICAgICAgICAgIC8vIHRoZW0gYWdhaW5zdCB3aGF0IGlzIGluIHRoZSBET00gcmlnaHQgbm93LiBJdCBtYXkgYmUgdGhhdCBzb21lIG9mIHRoZSBub2RlcyBoYXZlIGFscmVhZHkgYmVlbiByZW1vdmVkLCBvciB0aGF0XG4gICAgICAgICAgICAvLyBuZXcgbm9kZXMgbWlnaHQgaGF2ZSBiZWVuIGluc2VydGVkIGluIHRoZSBtaWRkbGUsIGZvciBleGFtcGxlIGJ5IGEgYmluZGluZy4gQWxzbywgdGhlcmUgbWF5IHByZXZpb3VzbHkgaGF2ZSBiZWVuXG4gICAgICAgICAgICAvLyBsZWFkaW5nIGNvbW1lbnQgbm9kZXMgKGNyZWF0ZWQgYnkgcmV3cml0dGVuIHN0cmluZy1iYXNlZCB0ZW1wbGF0ZXMpIHRoYXQgaGF2ZSBzaW5jZSBiZWVuIHJlbW92ZWQgZHVyaW5nIGJpbmRpbmcuXG4gICAgICAgICAgICAvLyBTbywgdGhpcyBmdW5jdGlvbiB0cmFuc2xhdGVzIHRoZSBvbGQgXCJtYXBcIiBvdXRwdXQgYXJyYXkgaW50byBpdHMgYmVzdCBndWVzcyBvZiB0aGUgc2V0IG9mIGN1cnJlbnQgRE9NIG5vZGVzLlxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIFJ1bGVzOlxuICAgICAgICAgICAgLy8gICBbQV0gQW55IGxlYWRpbmcgbm9kZXMgdGhhdCBoYXZlIGJlZW4gcmVtb3ZlZCBzaG91bGQgYmUgaWdub3JlZFxuICAgICAgICAgICAgLy8gICAgICAgVGhlc2UgbW9zdCBsaWtlbHkgY29ycmVzcG9uZCB0byBtZW1vaXphdGlvbiBub2RlcyB0aGF0IHdlcmUgYWxyZWFkeSByZW1vdmVkIGR1cmluZyBiaW5kaW5nXG4gICAgICAgICAgICAvLyAgICAgICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL1N0ZXZlU2FuZGVyc29uL2tub2Nrb3V0L3B1bGwvNDQwXG4gICAgICAgICAgICAvLyAgIFtCXSBXZSB3YW50IHRvIG91dHB1dCBhIGNvbnRpbnVvdXMgc2VyaWVzIG9mIG5vZGVzLiBTbywgaWdub3JlIGFueSBub2RlcyB0aGF0IGhhdmUgYWxyZWFkeSBiZWVuIHJlbW92ZWQsXG4gICAgICAgICAgICAvLyAgICAgICBhbmQgaW5jbHVkZSBhbnkgbm9kZXMgdGhhdCBoYXZlIGJlZW4gaW5zZXJ0ZWQgYW1vbmcgdGhlIHByZXZpb3VzIGNvbGxlY3Rpb25cblxuICAgICAgICAgICAgaWYgKGNvbnRpbnVvdXNOb2RlQXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhlIHBhcmVudCBub2RlIGNhbiBiZSBhIHZpcnR1YWwgZWxlbWVudDsgc28gZ2V0IHRoZSByZWFsIHBhcmVudCBub2RlXG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZSA9IChwYXJlbnROb2RlLm5vZGVUeXBlID09PSA4ICYmIHBhcmVudE5vZGUucGFyZW50Tm9kZSkgfHwgcGFyZW50Tm9kZTtcblxuICAgICAgICAgICAgICAgIC8vIFJ1bGUgW0FdXG4gICAgICAgICAgICAgICAgd2hpbGUgKGNvbnRpbnVvdXNOb2RlQXJyYXkubGVuZ3RoICYmIGNvbnRpbnVvdXNOb2RlQXJyYXlbMF0ucGFyZW50Tm9kZSAhPT0gcGFyZW50Tm9kZSlcbiAgICAgICAgICAgICAgICAgICAgY29udGludW91c05vZGVBcnJheS5zaGlmdCgpO1xuXG4gICAgICAgICAgICAgICAgLy8gUnVsZSBbQl1cbiAgICAgICAgICAgICAgICBpZiAoY29udGludW91c05vZGVBcnJheS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW50ID0gY29udGludW91c05vZGVBcnJheVswXSwgbGFzdCA9IGNvbnRpbnVvdXNOb2RlQXJyYXlbY29udGludW91c05vZGVBcnJheS5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgLy8gUmVwbGFjZSB3aXRoIHRoZSBhY3R1YWwgbmV3IGNvbnRpbnVvdXMgbm9kZSBzZXRcbiAgICAgICAgICAgICAgICAgICAgY29udGludW91c05vZGVBcnJheS5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoY3VycmVudCAhPT0gbGFzdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludW91c05vZGVBcnJheS5wdXNoKGN1cnJlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWN1cnJlbnQpIC8vIFdvbid0IGhhcHBlbiwgZXhjZXB0IGlmIHRoZSBkZXZlbG9wZXIgaGFzIG1hbnVhbGx5IHJlbW92ZWQgc29tZSBET00gZWxlbWVudHMgKHRoZW4gd2UncmUgaW4gYW4gdW5kZWZpbmVkIHNjZW5hcmlvKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb250aW51b3VzTm9kZUFycmF5LnB1c2gobGFzdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNvbnRpbnVvdXNOb2RlQXJyYXk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0T3B0aW9uTm9kZVNlbGVjdGlvblN0YXRlOiBmdW5jdGlvbiAob3B0aW9uTm9kZSwgaXNTZWxlY3RlZCkge1xuICAgICAgICAgICAgLy8gSUU2IHNvbWV0aW1lcyB0aHJvd3MgXCJ1bmtub3duIGVycm9yXCIgaWYgeW91IHRyeSB0byB3cml0ZSB0byAuc2VsZWN0ZWQgZGlyZWN0bHksIHdoZXJlYXMgRmlyZWZveCBzdHJ1Z2dsZXMgd2l0aCBzZXRBdHRyaWJ1dGUuIFBpY2sgb25lIGJhc2VkIG9uIGJyb3dzZXIuXG4gICAgICAgICAgICBpZiAoaWVWZXJzaW9uIDwgNylcbiAgICAgICAgICAgICAgICBvcHRpb25Ob2RlLnNldEF0dHJpYnV0ZShcInNlbGVjdGVkXCIsIGlzU2VsZWN0ZWQpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIG9wdGlvbk5vZGUuc2VsZWN0ZWQgPSBpc1NlbGVjdGVkO1xuICAgICAgICB9LFxuXG4gICAgICAgIHN0cmluZ1RyaW06IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHJpbmcgPT09IG51bGwgfHwgc3RyaW5nID09PSB1bmRlZmluZWQgPyAnJyA6XG4gICAgICAgICAgICAgICAgc3RyaW5nLnRyaW0gP1xuICAgICAgICAgICAgICAgICAgICBzdHJpbmcudHJpbSgpIDpcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nLnRvU3RyaW5nKCkucmVwbGFjZSgvXltcXHNcXHhhMF0rfFtcXHNcXHhhMF0rJC9nLCAnJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc3RyaW5nU3RhcnRzV2l0aDogZnVuY3Rpb24gKHN0cmluZywgc3RhcnRzV2l0aCkge1xuICAgICAgICAgICAgc3RyaW5nID0gc3RyaW5nIHx8IFwiXCI7XG4gICAgICAgICAgICBpZiAoc3RhcnRzV2l0aC5sZW5ndGggPiBzdHJpbmcubGVuZ3RoKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBzdHJpbmcuc3Vic3RyaW5nKDAsIHN0YXJ0c1dpdGgubGVuZ3RoKSA9PT0gc3RhcnRzV2l0aDtcbiAgICAgICAgfSxcblxuICAgICAgICBkb21Ob2RlSXNDb250YWluZWRCeTogZnVuY3Rpb24gKG5vZGUsIGNvbnRhaW5lZEJ5Tm9kZSkge1xuICAgICAgICAgICAgaWYgKG5vZGUgPT09IGNvbnRhaW5lZEJ5Tm9kZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxMSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vIEZpeGVzIGlzc3VlICMxMTYyIC0gY2FuJ3QgdXNlIG5vZGUuY29udGFpbnMgZm9yIGRvY3VtZW50IGZyYWdtZW50cyBvbiBJRThcbiAgICAgICAgICAgIGlmIChjb250YWluZWRCeU5vZGUuY29udGFpbnMpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRhaW5lZEJ5Tm9kZS5jb250YWlucyhub2RlLm5vZGVUeXBlID09PSAzID8gbm9kZS5wYXJlbnROb2RlIDogbm9kZSk7XG4gICAgICAgICAgICBpZiAoY29udGFpbmVkQnlOb2RlLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKVxuICAgICAgICAgICAgICAgIHJldHVybiAoY29udGFpbmVkQnlOb2RlLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKG5vZGUpICYgMTYpID09IDE2O1xuICAgICAgICAgICAgd2hpbGUgKG5vZGUgJiYgbm9kZSAhPSBjb250YWluZWRCeU5vZGUpIHtcbiAgICAgICAgICAgICAgICBub2RlID0gbm9kZS5wYXJlbnROb2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICEhbm9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICBkb21Ob2RlSXNBdHRhY2hlZFRvRG9jdW1lbnQ6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICByZXR1cm4ga28udXRpbHMuZG9tTm9kZUlzQ29udGFpbmVkQnkobm9kZSwgbm9kZS5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYW55RG9tTm9kZUlzQXR0YWNoZWRUb0RvY3VtZW50OiBmdW5jdGlvbihub2Rlcykge1xuICAgICAgICAgICAgcmV0dXJuICEha28udXRpbHMuYXJyYXlGaXJzdChub2Rlcywga28udXRpbHMuZG9tTm9kZUlzQXR0YWNoZWRUb0RvY3VtZW50KTtcbiAgICAgICAgfSxcblxuICAgICAgICB0YWdOYW1lTG93ZXI6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIC8vIEZvciBIVE1MIGVsZW1lbnRzLCB0YWdOYW1lIHdpbGwgYWx3YXlzIGJlIHVwcGVyIGNhc2U7IGZvciBYSFRNTCBlbGVtZW50cywgaXQnbGwgYmUgbG93ZXIgY2FzZS5cbiAgICAgICAgICAgIC8vIFBvc3NpYmxlIGZ1dHVyZSBvcHRpbWl6YXRpb246IElmIHdlIGtub3cgaXQncyBhbiBlbGVtZW50IGZyb20gYW4gWEhUTUwgZG9jdW1lbnQgKG5vdCBIVE1MKSxcbiAgICAgICAgICAgIC8vIHdlIGRvbid0IG5lZWQgdG8gZG8gdGhlIC50b0xvd2VyQ2FzZSgpIGFzIGl0IHdpbGwgYWx3YXlzIGJlIGxvd2VyIGNhc2UgYW55d2F5LlxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQgJiYgZWxlbWVudC50YWdOYW1lICYmIGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlZ2lzdGVyRXZlbnRIYW5kbGVyOiBmdW5jdGlvbiAoZWxlbWVudCwgZXZlbnRUeXBlLCBoYW5kbGVyKSB7XG4gICAgICAgICAgICB2YXIgbXVzdFVzZUF0dGFjaEV2ZW50ID0gaWVWZXJzaW9uICYmIGV2ZW50c1RoYXRNdXN0QmVSZWdpc3RlcmVkVXNpbmdBdHRhY2hFdmVudFtldmVudFR5cGVdO1xuICAgICAgICAgICAgaWYgKCFtdXN0VXNlQXR0YWNoRXZlbnQgJiYgalF1ZXJ5SW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICBqUXVlcnlJbnN0YW5jZShlbGVtZW50KVsnYmluZCddKGV2ZW50VHlwZSwgaGFuZGxlcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFtdXN0VXNlQXR0YWNoRXZlbnQgJiYgdHlwZW9mIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciA9PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgaGFuZGxlciwgZmFsc2UpO1xuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGVsZW1lbnQuYXR0YWNoRXZlbnQgIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIHZhciBhdHRhY2hFdmVudEhhbmRsZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHsgaGFuZGxlci5jYWxsKGVsZW1lbnQsIGV2ZW50KTsgfSxcbiAgICAgICAgICAgICAgICAgICAgYXR0YWNoRXZlbnROYW1lID0gXCJvblwiICsgZXZlbnRUeXBlO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYXR0YWNoRXZlbnQoYXR0YWNoRXZlbnROYW1lLCBhdHRhY2hFdmVudEhhbmRsZXIpO1xuXG4gICAgICAgICAgICAgICAgLy8gSUUgZG9lcyBub3QgZGlzcG9zZSBhdHRhY2hFdmVudCBoYW5kbGVycyBhdXRvbWF0aWNhbGx5ICh1bmxpa2Ugd2l0aCBhZGRFdmVudExpc3RlbmVyKVxuICAgICAgICAgICAgICAgIC8vIHNvIHRvIGF2b2lkIGxlYWtzLCB3ZSBoYXZlIHRvIHJlbW92ZSB0aGVtIG1hbnVhbGx5LiBTZWUgYnVnICM4NTZcbiAgICAgICAgICAgICAgICBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwuYWRkRGlzcG9zZUNhbGxiYWNrKGVsZW1lbnQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmRldGFjaEV2ZW50KGF0dGFjaEV2ZW50TmFtZSwgYXR0YWNoRXZlbnRIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IGFkZEV2ZW50TGlzdGVuZXIgb3IgYXR0YWNoRXZlbnRcIik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdHJpZ2dlckV2ZW50OiBmdW5jdGlvbiAoZWxlbWVudCwgZXZlbnRUeXBlKSB7XG4gICAgICAgICAgICBpZiAoIShlbGVtZW50ICYmIGVsZW1lbnQubm9kZVR5cGUpKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImVsZW1lbnQgbXVzdCBiZSBhIERPTSBub2RlIHdoZW4gY2FsbGluZyB0cmlnZ2VyRXZlbnRcIik7XG5cbiAgICAgICAgICAgIC8vIEZvciBjbGljayBldmVudHMgb24gY2hlY2tib3hlcyBhbmQgcmFkaW8gYnV0dG9ucywgalF1ZXJ5IHRvZ2dsZXMgdGhlIGVsZW1lbnQgY2hlY2tlZCBzdGF0ZSAqYWZ0ZXIqIHRoZVxuICAgICAgICAgICAgLy8gZXZlbnQgaGFuZGxlciBydW5zIGluc3RlYWQgb2YgKmJlZm9yZSouIChUaGlzIHdhcyBmaXhlZCBpbiAxLjkgZm9yIGNoZWNrYm94ZXMgYnV0IG5vdCBmb3IgcmFkaW8gYnV0dG9ucy4pXG4gICAgICAgICAgICAvLyBJRSBkb2Vzbid0IGNoYW5nZSB0aGUgY2hlY2tlZCBzdGF0ZSB3aGVuIHlvdSB0cmlnZ2VyIHRoZSBjbGljayBldmVudCB1c2luZyBcImZpcmVFdmVudFwiLlxuICAgICAgICAgICAgLy8gSW4gYm90aCBjYXNlcywgd2UnbGwgdXNlIHRoZSBjbGljayBtZXRob2QgaW5zdGVhZC5cbiAgICAgICAgICAgIHZhciB1c2VDbGlja1dvcmthcm91bmQgPSBpc0NsaWNrT25DaGVja2FibGVFbGVtZW50KGVsZW1lbnQsIGV2ZW50VHlwZSk7XG5cbiAgICAgICAgICAgIGlmIChqUXVlcnlJbnN0YW5jZSAmJiAhdXNlQ2xpY2tXb3JrYXJvdW5kKSB7XG4gICAgICAgICAgICAgICAgalF1ZXJ5SW5zdGFuY2UoZWxlbWVudClbJ3RyaWdnZXInXShldmVudFR5cGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRXZlbnQgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50LmRpc3BhdGNoRXZlbnQgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBldmVudENhdGVnb3J5ID0ga25vd25FdmVudFR5cGVzQnlFdmVudE5hbWVbZXZlbnRUeXBlXSB8fCBcIkhUTUxFdmVudHNcIjtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoZXZlbnRDYXRlZ29yeSk7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LmluaXRFdmVudChldmVudFR5cGUsIHRydWUsIHRydWUsIHdpbmRvdywgMCwgMCwgMCwgMCwgMCwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIDAsIGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBzdXBwbGllZCBlbGVtZW50IGRvZXNuJ3Qgc3VwcG9ydCBkaXNwYXRjaEV2ZW50XCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh1c2VDbGlja1dvcmthcm91bmQgJiYgZWxlbWVudC5jbGljaykge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xpY2soKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGVsZW1lbnQuZmlyZUV2ZW50ICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmZpcmVFdmVudChcIm9uXCIgKyBldmVudFR5cGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJCcm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCB0cmlnZ2VyaW5nIGV2ZW50c1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICB1bndyYXBPYnNlcnZhYmxlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBrby5pc09ic2VydmFibGUodmFsdWUpID8gdmFsdWUoKSA6IHZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHBlZWtPYnNlcnZhYmxlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBrby5pc09ic2VydmFibGUodmFsdWUpID8gdmFsdWUucGVlaygpIDogdmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9nZ2xlRG9tTm9kZUNzc0NsYXNzOiBmdW5jdGlvbiAobm9kZSwgY2xhc3NOYW1lcywgc2hvdWxkSGF2ZUNsYXNzKSB7XG4gICAgICAgICAgICBpZiAoY2xhc3NOYW1lcykge1xuICAgICAgICAgICAgICAgIHZhciBjc3NDbGFzc05hbWVSZWdleCA9IC9cXFMrL2csXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRDbGFzc05hbWVzID0gbm9kZS5jbGFzc05hbWUubWF0Y2goY3NzQ2xhc3NOYW1lUmVnZXgpIHx8IFtdO1xuICAgICAgICAgICAgICAgIGtvLnV0aWxzLmFycmF5Rm9yRWFjaChjbGFzc05hbWVzLm1hdGNoKGNzc0NsYXNzTmFtZVJlZ2V4KSwgZnVuY3Rpb24oY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGtvLnV0aWxzLmFkZE9yUmVtb3ZlSXRlbShjdXJyZW50Q2xhc3NOYW1lcywgY2xhc3NOYW1lLCBzaG91bGRIYXZlQ2xhc3MpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG5vZGUuY2xhc3NOYW1lID0gY3VycmVudENsYXNzTmFtZXMuam9pbihcIiBcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0VGV4dENvbnRlbnQ6IGZ1bmN0aW9uKGVsZW1lbnQsIHRleHRDb250ZW50KSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHRleHRDb250ZW50KTtcbiAgICAgICAgICAgIGlmICgodmFsdWUgPT09IG51bGwpIHx8ICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSlcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IFwiXCI7XG5cbiAgICAgICAgICAgIC8vIFdlIG5lZWQgdGhlcmUgdG8gYmUgZXhhY3RseSBvbmUgY2hpbGQ6IGEgdGV4dCBub2RlLlxuICAgICAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIGNoaWxkcmVuLCBtb3JlIHRoYW4gb25lLCBvciBpZiBpdCdzIG5vdCBhIHRleHQgbm9kZSxcbiAgICAgICAgICAgIC8vIHdlJ2xsIGNsZWFyIGV2ZXJ5dGhpbmcgYW5kIGNyZWF0ZSBhIHNpbmdsZSB0ZXh0IG5vZGUuXG4gICAgICAgICAgICB2YXIgaW5uZXJUZXh0Tm9kZSA9IGtvLnZpcnR1YWxFbGVtZW50cy5maXJzdENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgaWYgKCFpbm5lclRleHROb2RlIHx8IGlubmVyVGV4dE5vZGUubm9kZVR5cGUgIT0gMyB8fCBrby52aXJ0dWFsRWxlbWVudHMubmV4dFNpYmxpbmcoaW5uZXJUZXh0Tm9kZSkpIHtcbiAgICAgICAgICAgICAgICBrby52aXJ0dWFsRWxlbWVudHMuc2V0RG9tTm9kZUNoaWxkcmVuKGVsZW1lbnQsIFtlbGVtZW50Lm93bmVyRG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodmFsdWUpXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlubmVyVGV4dE5vZGUuZGF0YSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBrby51dGlscy5mb3JjZVJlZnJlc2goZWxlbWVudCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0RWxlbWVudE5hbWU6IGZ1bmN0aW9uKGVsZW1lbnQsIG5hbWUpIHtcbiAgICAgICAgICAgIGVsZW1lbnQubmFtZSA9IG5hbWU7XG5cbiAgICAgICAgICAgIC8vIFdvcmthcm91bmQgSUUgNi83IGlzc3VlXG4gICAgICAgICAgICAvLyAtIGh0dHBzOi8vZ2l0aHViLmNvbS9TdGV2ZVNhbmRlcnNvbi9rbm9ja291dC9pc3N1ZXMvMTk3XG4gICAgICAgICAgICAvLyAtIGh0dHA6Ly93d3cubWF0dHM0MTEuY29tL3Bvc3Qvc2V0dGluZ190aGVfbmFtZV9hdHRyaWJ1dGVfaW5faWVfZG9tL1xuICAgICAgICAgICAgaWYgKGllVmVyc2lvbiA8PSA3KSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5tZXJnZUF0dHJpYnV0ZXMoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIjxpbnB1dCBuYW1lPSdcIiArIGVsZW1lbnQubmFtZSArIFwiJy8+XCIpLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoKGUpIHt9IC8vIEZvciBJRTkgd2l0aCBkb2MgbW9kZSBcIklFOSBTdGFuZGFyZHNcIiBhbmQgYnJvd3NlciBtb2RlIFwiSUU5IENvbXBhdGliaWxpdHkgVmlld1wiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZm9yY2VSZWZyZXNoOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICAvLyBXb3JrYXJvdW5kIGZvciBhbiBJRTkgcmVuZGVyaW5nIGJ1ZyAtIGh0dHBzOi8vZ2l0aHViLmNvbS9TdGV2ZVNhbmRlcnNvbi9rbm9ja291dC9pc3N1ZXMvMjA5XG4gICAgICAgICAgICBpZiAoaWVWZXJzaW9uID49IDkpIHtcbiAgICAgICAgICAgICAgICAvLyBGb3IgdGV4dCBub2RlcyBhbmQgY29tbWVudCBub2RlcyAobW9zdCBsaWtlbHkgdmlydHVhbCBlbGVtZW50cyksIHdlIHdpbGwgaGF2ZSB0byByZWZyZXNoIHRoZSBjb250YWluZXJcbiAgICAgICAgICAgICAgICB2YXIgZWxlbSA9IG5vZGUubm9kZVR5cGUgPT0gMSA/IG5vZGUgOiBub2RlLnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW0uc3R5bGUpXG4gICAgICAgICAgICAgICAgICAgIGVsZW0uc3R5bGUuem9vbSA9IGVsZW0uc3R5bGUuem9vbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBlbnN1cmVTZWxlY3RFbGVtZW50SXNSZW5kZXJlZENvcnJlY3RseTogZnVuY3Rpb24oc2VsZWN0RWxlbWVudCkge1xuICAgICAgICAgICAgLy8gV29ya2Fyb3VuZCBmb3IgSUU5IHJlbmRlcmluZyBidWcgLSBpdCBkb2Vzbid0IHJlbGlhYmx5IGRpc3BsYXkgYWxsIHRoZSB0ZXh0IGluIGR5bmFtaWNhbGx5LWFkZGVkIHNlbGVjdCBib3hlcyB1bmxlc3MgeW91IGZvcmNlIGl0IHRvIHJlLXJlbmRlciBieSB1cGRhdGluZyB0aGUgd2lkdGguXG4gICAgICAgICAgICAvLyAoU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TdGV2ZVNhbmRlcnNvbi9rbm9ja291dC9pc3N1ZXMvMzEyLCBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzU5MDg0OTQvc2VsZWN0LW9ubHktc2hvd3MtZmlyc3QtY2hhci1vZi1zZWxlY3RlZC1vcHRpb24pXG4gICAgICAgICAgICAvLyBBbHNvIGZpeGVzIElFNyBhbmQgSUU4IGJ1ZyB0aGF0IGNhdXNlcyBzZWxlY3RzIHRvIGJlIHplcm8gd2lkdGggaWYgZW5jbG9zZWQgYnkgJ2lmJyBvciAnd2l0aCcuIChTZWUgaXNzdWUgIzgzOSlcbiAgICAgICAgICAgIGlmIChpZVZlcnNpb24pIHtcbiAgICAgICAgICAgICAgICB2YXIgb3JpZ2luYWxXaWR0aCA9IHNlbGVjdEVsZW1lbnQuc3R5bGUud2lkdGg7XG4gICAgICAgICAgICAgICAgc2VsZWN0RWxlbWVudC5zdHlsZS53aWR0aCA9IDA7XG4gICAgICAgICAgICAgICAgc2VsZWN0RWxlbWVudC5zdHlsZS53aWR0aCA9IG9yaWdpbmFsV2lkdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmFuZ2U6IGZ1bmN0aW9uIChtaW4sIG1heCkge1xuICAgICAgICAgICAgbWluID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShtaW4pO1xuICAgICAgICAgICAgbWF4ID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShtYXgpO1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IG1pbjsgaSA8PSBtYXg7IGkrKylcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbWFrZUFycmF5OiBmdW5jdGlvbihhcnJheUxpa2VPYmplY3QpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gYXJyYXlMaWtlT2JqZWN0Lmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGFycmF5TGlrZU9iamVjdFtpXSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSxcblxuICAgICAgICBpc0llNiA6IGlzSWU2LFxuICAgICAgICBpc0llNyA6IGlzSWU3LFxuICAgICAgICBpZVZlcnNpb24gOiBpZVZlcnNpb24sXG5cbiAgICAgICAgZ2V0Rm9ybUZpZWxkczogZnVuY3Rpb24oZm9ybSwgZmllbGROYW1lKSB7XG4gICAgICAgICAgICB2YXIgZmllbGRzID0ga28udXRpbHMubWFrZUFycmF5KGZvcm0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbnB1dFwiKSkuY29uY2F0KGtvLnV0aWxzLm1ha2VBcnJheShmb3JtLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGV4dGFyZWFcIikpKTtcbiAgICAgICAgICAgIHZhciBpc01hdGNoaW5nRmllbGQgPSAodHlwZW9mIGZpZWxkTmFtZSA9PSAnc3RyaW5nJylcbiAgICAgICAgICAgICAgICA/IGZ1bmN0aW9uKGZpZWxkKSB7IHJldHVybiBmaWVsZC5uYW1lID09PSBmaWVsZE5hbWUgfVxuICAgICAgICAgICAgICAgIDogZnVuY3Rpb24oZmllbGQpIHsgcmV0dXJuIGZpZWxkTmFtZS50ZXN0KGZpZWxkLm5hbWUpIH07IC8vIFRyZWF0IGZpZWxkTmFtZSBhcyByZWdleCBvciBvYmplY3QgY29udGFpbmluZyBwcmVkaWNhdGVcbiAgICAgICAgICAgIHZhciBtYXRjaGVzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gZmllbGRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzTWF0Y2hpbmdGaWVsZChmaWVsZHNbaV0pKVxuICAgICAgICAgICAgICAgICAgICBtYXRjaGVzLnB1c2goZmllbGRzW2ldKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2hlcztcbiAgICAgICAgfSxcblxuICAgICAgICBwYXJzZUpzb246IGZ1bmN0aW9uIChqc29uU3RyaW5nKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGpzb25TdHJpbmcgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIGpzb25TdHJpbmcgPSBrby51dGlscy5zdHJpbmdUcmltKGpzb25TdHJpbmcpO1xuICAgICAgICAgICAgICAgIGlmIChqc29uU3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChKU09OICYmIEpTT04ucGFyc2UpIC8vIFVzZSBuYXRpdmUgcGFyc2luZyB3aGVyZSBhdmFpbGFibGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKGpzb25TdHJpbmcpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKG5ldyBGdW5jdGlvbihcInJldHVybiBcIiArIGpzb25TdHJpbmcpKSgpOyAvLyBGYWxsYmFjayBvbiBsZXNzIHNhZmUgcGFyc2luZyBmb3Igb2xkZXIgYnJvd3NlcnNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSxcblxuICAgICAgICBzdHJpbmdpZnlKc29uOiBmdW5jdGlvbiAoZGF0YSwgcmVwbGFjZXIsIHNwYWNlKSB7ICAgLy8gcmVwbGFjZXIgYW5kIHNwYWNlIGFyZSBvcHRpb25hbFxuICAgICAgICAgICAgaWYgKCFKU09OIHx8ICFKU09OLnN0cmluZ2lmeSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBKU09OLnN0cmluZ2lmeSgpLiBTb21lIGJyb3dzZXJzIChlLmcuLCBJRSA8IDgpIGRvbid0IHN1cHBvcnQgaXQgbmF0aXZlbHksIGJ1dCB5b3UgY2FuIG92ZXJjb21lIHRoaXMgYnkgYWRkaW5nIGEgc2NyaXB0IHJlZmVyZW5jZSB0byBqc29uMi5qcywgZG93bmxvYWRhYmxlIGZyb20gaHR0cDovL3d3dy5qc29uLm9yZy9qc29uMi5qc1wiKTtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShrby51dGlscy51bndyYXBPYnNlcnZhYmxlKGRhdGEpLCByZXBsYWNlciwgc3BhY2UpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHBvc3RKc29uOiBmdW5jdGlvbiAodXJsT3JGb3JtLCBkYXRhLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSBvcHRpb25zWydwYXJhbXMnXSB8fCB7fTtcbiAgICAgICAgICAgIHZhciBpbmNsdWRlRmllbGRzID0gb3B0aW9uc1snaW5jbHVkZUZpZWxkcyddIHx8IHRoaXMuZmllbGRzSW5jbHVkZWRXaXRoSnNvblBvc3Q7XG4gICAgICAgICAgICB2YXIgdXJsID0gdXJsT3JGb3JtO1xuXG4gICAgICAgICAgICAvLyBJZiB3ZSB3ZXJlIGdpdmVuIGEgZm9ybSwgdXNlIGl0cyAnYWN0aW9uJyBVUkwgYW5kIHBpY2sgb3V0IGFueSByZXF1ZXN0ZWQgZmllbGQgdmFsdWVzXG4gICAgICAgICAgICBpZigodHlwZW9mIHVybE9yRm9ybSA9PSAnb2JqZWN0JykgJiYgKGtvLnV0aWxzLnRhZ05hbWVMb3dlcih1cmxPckZvcm0pID09PSBcImZvcm1cIikpIHtcbiAgICAgICAgICAgICAgICB2YXIgb3JpZ2luYWxGb3JtID0gdXJsT3JGb3JtO1xuICAgICAgICAgICAgICAgIHVybCA9IG9yaWdpbmFsRm9ybS5hY3Rpb247XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IGluY2x1ZGVGaWVsZHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZpZWxkcyA9IGtvLnV0aWxzLmdldEZvcm1GaWVsZHMob3JpZ2luYWxGb3JtLCBpbmNsdWRlRmllbGRzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IGZpZWxkcy5sZW5ndGggLSAxOyBqID49IDA7IGotLSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtc1tmaWVsZHNbal0ubmFtZV0gPSBmaWVsZHNbal0udmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkYXRhID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShkYXRhKTtcbiAgICAgICAgICAgIHZhciBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIik7XG4gICAgICAgICAgICBmb3JtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIGZvcm0uYWN0aW9uID0gdXJsO1xuICAgICAgICAgICAgZm9ybS5tZXRob2QgPSBcInBvc3RcIjtcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgLy8gU2luY2UgJ2RhdGEnIHRoaXMgaXMgYSBtb2RlbCBvYmplY3QsIHdlIGluY2x1ZGUgYWxsIHByb3BlcnRpZXMgaW5jbHVkaW5nIHRob3NlIGluaGVyaXRlZCBmcm9tIGl0cyBwcm90b3R5cGVcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgICAgICAgICAgICAgaW5wdXQudHlwZSA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgaW5wdXQubmFtZSA9IGtleTtcbiAgICAgICAgICAgICAgICBpbnB1dC52YWx1ZSA9IGtvLnV0aWxzLnN0cmluZ2lmeUpzb24oa28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShkYXRhW2tleV0pKTtcbiAgICAgICAgICAgICAgICBmb3JtLmFwcGVuZENoaWxkKGlucHV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9iamVjdEZvckVhY2gocGFyYW1zLCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgICAgICAgICAgIGlucHV0LnR5cGUgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgIGlucHV0Lm5hbWUgPSBrZXk7XG4gICAgICAgICAgICAgICAgaW5wdXQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBmb3JtLmFwcGVuZENoaWxkKGlucHV0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChmb3JtKTtcbiAgICAgICAgICAgIG9wdGlvbnNbJ3N1Ym1pdHRlciddID8gb3B0aW9uc1snc3VibWl0dGVyJ10oZm9ybSkgOiBmb3JtLnN1Ym1pdCgpO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGZvcm0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChmb3JtKTsgfSwgMCk7XG4gICAgICAgIH1cbiAgICB9XG59KCkpO1xuXG5rby5leHBvcnRTeW1ib2woJ3V0aWxzJywga28udXRpbHMpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5hcnJheUZvckVhY2gnLCBrby51dGlscy5hcnJheUZvckVhY2gpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5hcnJheUZpcnN0Jywga28udXRpbHMuYXJyYXlGaXJzdCk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLmFycmF5RmlsdGVyJywga28udXRpbHMuYXJyYXlGaWx0ZXIpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5hcnJheUdldERpc3RpbmN0VmFsdWVzJywga28udXRpbHMuYXJyYXlHZXREaXN0aW5jdFZhbHVlcyk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLmFycmF5SW5kZXhPZicsIGtvLnV0aWxzLmFycmF5SW5kZXhPZik7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLmFycmF5TWFwJywga28udXRpbHMuYXJyYXlNYXApO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5hcnJheVB1c2hBbGwnLCBrby51dGlscy5hcnJheVB1c2hBbGwpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5hcnJheVJlbW92ZUl0ZW0nLCBrby51dGlscy5hcnJheVJlbW92ZUl0ZW0pO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5leHRlbmQnLCBrby51dGlscy5leHRlbmQpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5maWVsZHNJbmNsdWRlZFdpdGhKc29uUG9zdCcsIGtvLnV0aWxzLmZpZWxkc0luY2x1ZGVkV2l0aEpzb25Qb3N0KTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuZ2V0Rm9ybUZpZWxkcycsIGtvLnV0aWxzLmdldEZvcm1GaWVsZHMpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5wZWVrT2JzZXJ2YWJsZScsIGtvLnV0aWxzLnBlZWtPYnNlcnZhYmxlKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMucG9zdEpzb24nLCBrby51dGlscy5wb3N0SnNvbik7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLnBhcnNlSnNvbicsIGtvLnV0aWxzLnBhcnNlSnNvbik7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLnJlZ2lzdGVyRXZlbnRIYW5kbGVyJywga28udXRpbHMucmVnaXN0ZXJFdmVudEhhbmRsZXIpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5zdHJpbmdpZnlKc29uJywga28udXRpbHMuc3RyaW5naWZ5SnNvbik7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLnJhbmdlJywga28udXRpbHMucmFuZ2UpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy50b2dnbGVEb21Ob2RlQ3NzQ2xhc3MnLCBrby51dGlscy50b2dnbGVEb21Ob2RlQ3NzQ2xhc3MpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy50cmlnZ2VyRXZlbnQnLCBrby51dGlscy50cmlnZ2VyRXZlbnQpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy51bndyYXBPYnNlcnZhYmxlJywga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLm9iamVjdEZvckVhY2gnLCBrby51dGlscy5vYmplY3RGb3JFYWNoKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuYWRkT3JSZW1vdmVJdGVtJywga28udXRpbHMuYWRkT3JSZW1vdmVJdGVtKTtcbmtvLmV4cG9ydFN5bWJvbCgndW53cmFwJywga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSk7IC8vIENvbnZlbmllbnQgc2hvcnRoYW5kLCBiZWNhdXNlIHRoaXMgaXMgdXNlZCBzbyBjb21tb25seVxuXG5pZiAoIUZ1bmN0aW9uLnByb3RvdHlwZVsnYmluZCddKSB7XG4gICAgLy8gRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgaXMgYSBzdGFuZGFyZCBwYXJ0IG9mIEVDTUFTY3JpcHQgNXRoIEVkaXRpb24gKERlY2VtYmVyIDIwMDksIGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9wdWJsaWNhdGlvbnMvZmlsZXMvRUNNQS1TVC9FQ01BLTI2Mi5wZGYpXG4gICAgLy8gSW4gY2FzZSB0aGUgYnJvd3NlciBkb2Vzbid0IGltcGxlbWVudCBpdCBuYXRpdmVseSwgcHJvdmlkZSBhIEphdmFTY3JpcHQgaW1wbGVtZW50YXRpb24uIFRoaXMgaW1wbGVtZW50YXRpb24gaXMgYmFzZWQgb24gdGhlIG9uZSBpbiBwcm90b3R5cGUuanNcbiAgICBGdW5jdGlvbi5wcm90b3R5cGVbJ2JpbmQnXSA9IGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICAgICAgdmFyIG9yaWdpbmFsRnVuY3Rpb24gPSB0aGlzLCBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSwgb2JqZWN0ID0gYXJncy5zaGlmdCgpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsRnVuY3Rpb24uYXBwbHkob2JqZWN0LCBhcmdzLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgICAgIH07XG4gICAgfTtcbn1cblxua28udXRpbHMuZG9tRGF0YSA9IG5ldyAoZnVuY3Rpb24gKCkge1xuICAgIHZhciB1bmlxdWVJZCA9IDA7XG4gICAgdmFyIGRhdGFTdG9yZUtleUV4cGFuZG9Qcm9wZXJ0eU5hbWUgPSBcIl9fa29fX1wiICsgKG5ldyBEYXRlKS5nZXRUaW1lKCk7XG4gICAgdmFyIGRhdGFTdG9yZSA9IHt9O1xuXG4gICAgZnVuY3Rpb24gZ2V0QWxsKG5vZGUsIGNyZWF0ZUlmTm90Rm91bmQpIHtcbiAgICAgICAgdmFyIGRhdGFTdG9yZUtleSA9IG5vZGVbZGF0YVN0b3JlS2V5RXhwYW5kb1Byb3BlcnR5TmFtZV07XG4gICAgICAgIHZhciBoYXNFeGlzdGluZ0RhdGFTdG9yZSA9IGRhdGFTdG9yZUtleSAmJiAoZGF0YVN0b3JlS2V5ICE9PSBcIm51bGxcIikgJiYgZGF0YVN0b3JlW2RhdGFTdG9yZUtleV07XG4gICAgICAgIGlmICghaGFzRXhpc3RpbmdEYXRhU3RvcmUpIHtcbiAgICAgICAgICAgIGlmICghY3JlYXRlSWZOb3RGb3VuZClcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgZGF0YVN0b3JlS2V5ID0gbm9kZVtkYXRhU3RvcmVLZXlFeHBhbmRvUHJvcGVydHlOYW1lXSA9IFwia29cIiArIHVuaXF1ZUlkKys7XG4gICAgICAgICAgICBkYXRhU3RvcmVbZGF0YVN0b3JlS2V5XSA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRhU3RvcmVbZGF0YVN0b3JlS2V5XTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uIChub2RlLCBrZXkpIHtcbiAgICAgICAgICAgIHZhciBhbGxEYXRhRm9yTm9kZSA9IGdldEFsbChub2RlLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm4gYWxsRGF0YUZvck5vZGUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IGFsbERhdGFGb3JOb2RlW2tleV07XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKG5vZGUsIGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHdlIGRvbid0IGFjdHVhbGx5IGNyZWF0ZSBhIG5ldyBkb21EYXRhIGtleSBpZiB3ZSBhcmUgYWN0dWFsbHkgZGVsZXRpbmcgYSB2YWx1ZVxuICAgICAgICAgICAgICAgIGlmIChnZXRBbGwobm9kZSwgZmFsc2UpID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBhbGxEYXRhRm9yTm9kZSA9IGdldEFsbChub2RlLCB0cnVlKTtcbiAgICAgICAgICAgIGFsbERhdGFGb3JOb2RlW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgY2xlYXI6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICB2YXIgZGF0YVN0b3JlS2V5ID0gbm9kZVtkYXRhU3RvcmVLZXlFeHBhbmRvUHJvcGVydHlOYW1lXTtcbiAgICAgICAgICAgIGlmIChkYXRhU3RvcmVLZXkpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgZGF0YVN0b3JlW2RhdGFTdG9yZUtleV07XG4gICAgICAgICAgICAgICAgbm9kZVtkYXRhU3RvcmVLZXlFeHBhbmRvUHJvcGVydHlOYW1lXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7IC8vIEV4cG9zaW5nIFwiZGlkIGNsZWFuXCIgZmxhZyBwdXJlbHkgc28gc3BlY3MgY2FuIGluZmVyIHdoZXRoZXIgdGhpbmdzIGhhdmUgYmVlbiBjbGVhbmVkIHVwIGFzIGludGVuZGVkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbmV4dEtleTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICh1bmlxdWVJZCsrKSArIGRhdGFTdG9yZUtleUV4cGFuZG9Qcm9wZXJ0eU5hbWU7XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcblxua28uZXhwb3J0U3ltYm9sKCd1dGlscy5kb21EYXRhJywga28udXRpbHMuZG9tRGF0YSk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLmRvbURhdGEuY2xlYXInLCBrby51dGlscy5kb21EYXRhLmNsZWFyKTsgLy8gRXhwb3J0aW5nIG9ubHkgc28gc3BlY3MgY2FuIGNsZWFyIHVwIGFmdGVyIHRoZW1zZWx2ZXMgZnVsbHlcblxua28udXRpbHMuZG9tTm9kZURpc3Bvc2FsID0gbmV3IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRvbURhdGFLZXkgPSBrby51dGlscy5kb21EYXRhLm5leHRLZXkoKTtcbiAgICB2YXIgY2xlYW5hYmxlTm9kZVR5cGVzID0geyAxOiB0cnVlLCA4OiB0cnVlLCA5OiB0cnVlIH07ICAgICAgIC8vIEVsZW1lbnQsIENvbW1lbnQsIERvY3VtZW50XG4gICAgdmFyIGNsZWFuYWJsZU5vZGVUeXBlc1dpdGhEZXNjZW5kYW50cyA9IHsgMTogdHJ1ZSwgOTogdHJ1ZSB9OyAvLyBFbGVtZW50LCBEb2N1bWVudFxuXG4gICAgZnVuY3Rpb24gZ2V0RGlzcG9zZUNhbGxiYWNrc0NvbGxlY3Rpb24obm9kZSwgY3JlYXRlSWZOb3RGb3VuZCkge1xuICAgICAgICB2YXIgYWxsRGlzcG9zZUNhbGxiYWNrcyA9IGtvLnV0aWxzLmRvbURhdGEuZ2V0KG5vZGUsIGRvbURhdGFLZXkpO1xuICAgICAgICBpZiAoKGFsbERpc3Bvc2VDYWxsYmFja3MgPT09IHVuZGVmaW5lZCkgJiYgY3JlYXRlSWZOb3RGb3VuZCkge1xuICAgICAgICAgICAgYWxsRGlzcG9zZUNhbGxiYWNrcyA9IFtdO1xuICAgICAgICAgICAga28udXRpbHMuZG9tRGF0YS5zZXQobm9kZSwgZG9tRGF0YUtleSwgYWxsRGlzcG9zZUNhbGxiYWNrcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFsbERpc3Bvc2VDYWxsYmFja3M7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRlc3Ryb3lDYWxsYmFja3NDb2xsZWN0aW9uKG5vZGUpIHtcbiAgICAgICAga28udXRpbHMuZG9tRGF0YS5zZXQobm9kZSwgZG9tRGF0YUtleSwgdW5kZWZpbmVkKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhblNpbmdsZU5vZGUobm9kZSkge1xuICAgICAgICAvLyBSdW4gYWxsIHRoZSBkaXNwb3NlIGNhbGxiYWNrc1xuICAgICAgICB2YXIgY2FsbGJhY2tzID0gZ2V0RGlzcG9zZUNhbGxiYWNrc0NvbGxlY3Rpb24obm9kZSwgZmFsc2UpO1xuICAgICAgICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgICAgICAgICBjYWxsYmFja3MgPSBjYWxsYmFja3Muc2xpY2UoMCk7IC8vIENsb25lLCBhcyB0aGUgYXJyYXkgbWF5IGJlIG1vZGlmaWVkIGR1cmluZyBpdGVyYXRpb24gKHR5cGljYWxseSwgY2FsbGJhY2tzIHdpbGwgcmVtb3ZlIHRoZW1zZWx2ZXMpXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgICAgICBjYWxsYmFja3NbaV0obm9kZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBFcmFzZSB0aGUgRE9NIGRhdGFcbiAgICAgICAga28udXRpbHMuZG9tRGF0YS5jbGVhcihub2RlKTtcblxuICAgICAgICAvLyBQZXJmb3JtIGNsZWFudXAgbmVlZGVkIGJ5IGV4dGVybmFsIGxpYnJhcmllcyAoY3VycmVudGx5IG9ubHkgalF1ZXJ5LCBidXQgY2FuIGJlIGV4dGVuZGVkKVxuICAgICAgICBrby51dGlscy5kb21Ob2RlRGlzcG9zYWxbXCJjbGVhbkV4dGVybmFsRGF0YVwiXShub2RlKTtcblxuICAgICAgICAvLyBDbGVhciBhbnkgaW1tZWRpYXRlLWNoaWxkIGNvbW1lbnQgbm9kZXMsIGFzIHRoZXNlIHdvdWxkbid0IGhhdmUgYmVlbiBmb3VuZCBieVxuICAgICAgICAvLyBub2RlLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiKlwiKSBpbiBjbGVhbk5vZGUoKSAoY29tbWVudCBub2RlcyBhcmVuJ3QgZWxlbWVudHMpXG4gICAgICAgIGlmIChjbGVhbmFibGVOb2RlVHlwZXNXaXRoRGVzY2VuZGFudHNbbm9kZS5ub2RlVHlwZV0pXG4gICAgICAgICAgICBjbGVhbkltbWVkaWF0ZUNvbW1lbnRUeXBlQ2hpbGRyZW4obm9kZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYW5JbW1lZGlhdGVDb21tZW50VHlwZUNoaWxkcmVuKG5vZGVXaXRoQ2hpbGRyZW4pIHtcbiAgICAgICAgdmFyIGNoaWxkLCBuZXh0Q2hpbGQgPSBub2RlV2l0aENoaWxkcmVuLmZpcnN0Q2hpbGQ7XG4gICAgICAgIHdoaWxlIChjaGlsZCA9IG5leHRDaGlsZCkge1xuICAgICAgICAgICAgbmV4dENoaWxkID0gY2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICBpZiAoY2hpbGQubm9kZVR5cGUgPT09IDgpXG4gICAgICAgICAgICAgICAgY2xlYW5TaW5nbGVOb2RlKGNoaWxkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGFkZERpc3Bvc2VDYWxsYmFjayA6IGZ1bmN0aW9uKG5vZGUsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9IFwiZnVuY3Rpb25cIilcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG4gICAgICAgICAgICBnZXREaXNwb3NlQ2FsbGJhY2tzQ29sbGVjdGlvbihub2RlLCB0cnVlKS5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZW1vdmVEaXNwb3NlQ2FsbGJhY2sgOiBmdW5jdGlvbihub2RlLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgdmFyIGNhbGxiYWNrc0NvbGxlY3Rpb24gPSBnZXREaXNwb3NlQ2FsbGJhY2tzQ29sbGVjdGlvbihub2RlLCBmYWxzZSk7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2tzQ29sbGVjdGlvbikge1xuICAgICAgICAgICAgICAgIGtvLnV0aWxzLmFycmF5UmVtb3ZlSXRlbShjYWxsYmFja3NDb2xsZWN0aW9uLCBjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrc0NvbGxlY3Rpb24ubGVuZ3RoID09IDApXG4gICAgICAgICAgICAgICAgICAgIGRlc3Ryb3lDYWxsYmFja3NDb2xsZWN0aW9uKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGNsZWFuTm9kZSA6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgIC8vIEZpcnN0IGNsZWFuIHRoaXMgbm9kZSwgd2hlcmUgYXBwbGljYWJsZVxuICAgICAgICAgICAgaWYgKGNsZWFuYWJsZU5vZGVUeXBlc1tub2RlLm5vZGVUeXBlXSkge1xuICAgICAgICAgICAgICAgIGNsZWFuU2luZ2xlTm9kZShub2RlKTtcblxuICAgICAgICAgICAgICAgIC8vIC4uLiB0aGVuIGl0cyBkZXNjZW5kYW50cywgd2hlcmUgYXBwbGljYWJsZVxuICAgICAgICAgICAgICAgIGlmIChjbGVhbmFibGVOb2RlVHlwZXNXaXRoRGVzY2VuZGFudHNbbm9kZS5ub2RlVHlwZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2xvbmUgdGhlIGRlc2NlbmRhbnRzIGxpc3QgaW4gY2FzZSBpdCBjaGFuZ2VzIGR1cmluZyBpdGVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgdmFyIGRlc2NlbmRhbnRzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGtvLnV0aWxzLmFycmF5UHVzaEFsbChkZXNjZW5kYW50cywgbm9kZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcIipcIikpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IGRlc2NlbmRhbnRzLmxlbmd0aDsgaSA8IGo7IGkrKylcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFuU2luZ2xlTm9kZShkZXNjZW5kYW50c1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVtb3ZlTm9kZSA6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgIGtvLmNsZWFuTm9kZShub2RlKTtcbiAgICAgICAgICAgIGlmIChub2RlLnBhcmVudE5vZGUpXG4gICAgICAgICAgICAgICAgbm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIFwiY2xlYW5FeHRlcm5hbERhdGFcIiA6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAvLyBTcGVjaWFsIHN1cHBvcnQgZm9yIGpRdWVyeSBoZXJlIGJlY2F1c2UgaXQncyBzbyBjb21tb25seSB1c2VkLlxuICAgICAgICAgICAgLy8gTWFueSBqUXVlcnkgcGx1Z2lucyAoaW5jbHVkaW5nIGpxdWVyeS50bXBsKSBzdG9yZSBkYXRhIHVzaW5nIGpRdWVyeSdzIGVxdWl2YWxlbnQgb2YgZG9tRGF0YVxuICAgICAgICAgICAgLy8gc28gbm90aWZ5IGl0IHRvIHRlYXIgZG93biBhbnkgcmVzb3VyY2VzIGFzc29jaWF0ZWQgd2l0aCB0aGUgbm9kZSAmIGRlc2NlbmRhbnRzIGhlcmUuXG4gICAgICAgICAgICBpZiAoalF1ZXJ5SW5zdGFuY2UgJiYgKHR5cGVvZiBqUXVlcnlJbnN0YW5jZVsnY2xlYW5EYXRhJ10gPT0gXCJmdW5jdGlvblwiKSlcbiAgICAgICAgICAgICAgICBqUXVlcnlJbnN0YW5jZVsnY2xlYW5EYXRhJ10oW25vZGVdKTtcbiAgICAgICAgfVxuICAgIH1cbn0pKCk7XG5rby5jbGVhbk5vZGUgPSBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwuY2xlYW5Ob2RlOyAvLyBTaG9ydGhhbmQgbmFtZSBmb3IgY29udmVuaWVuY2VcbmtvLnJlbW92ZU5vZGUgPSBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwucmVtb3ZlTm9kZTsgLy8gU2hvcnRoYW5kIG5hbWUgZm9yIGNvbnZlbmllbmNlXG5rby5leHBvcnRTeW1ib2woJ2NsZWFuTm9kZScsIGtvLmNsZWFuTm9kZSk7XG5rby5leHBvcnRTeW1ib2woJ3JlbW92ZU5vZGUnLCBrby5yZW1vdmVOb2RlKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuZG9tTm9kZURpc3Bvc2FsJywga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjaycsIGtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbC5hZGREaXNwb3NlQ2FsbGJhY2spO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5kb21Ob2RlRGlzcG9zYWwucmVtb3ZlRGlzcG9zZUNhbGxiYWNrJywga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLnJlbW92ZURpc3Bvc2VDYWxsYmFjayk7XG4oZnVuY3Rpb24gKCkge1xuICAgIHZhciBsZWFkaW5nQ29tbWVudFJlZ2V4ID0gL14oXFxzKik8IS0tKC4qPyktLT4vO1xuXG4gICAgZnVuY3Rpb24gc2ltcGxlSHRtbFBhcnNlKGh0bWwpIHtcbiAgICAgICAgLy8gQmFzZWQgb24galF1ZXJ5J3MgXCJjbGVhblwiIGZ1bmN0aW9uLCBidXQgb25seSBhY2NvdW50aW5nIGZvciB0YWJsZS1yZWxhdGVkIGVsZW1lbnRzLlxuICAgICAgICAvLyBJZiB5b3UgaGF2ZSByZWZlcmVuY2VkIGpRdWVyeSwgdGhpcyB3b24ndCBiZSB1c2VkIGFueXdheSAtIEtPIHdpbGwgdXNlIGpRdWVyeSdzIFwiY2xlYW5cIiBmdW5jdGlvbiBkaXJlY3RseVxuXG4gICAgICAgIC8vIE5vdGUgdGhhdCB0aGVyZSdzIHN0aWxsIGFuIGlzc3VlIGluIElFIDwgOSB3aGVyZWJ5IGl0IHdpbGwgZGlzY2FyZCBjb21tZW50IG5vZGVzIHRoYXQgYXJlIHRoZSBmaXJzdCBjaGlsZCBvZlxuICAgICAgICAvLyBhIGRlc2NlbmRhbnQgbm9kZS4gRm9yIGV4YW1wbGU6IFwiPGRpdj48IS0tIG15Y29tbWVudCAtLT5hYmM8L2Rpdj5cIiB3aWxsIGdldCBwYXJzZWQgYXMgXCI8ZGl2PmFiYzwvZGl2PlwiXG4gICAgICAgIC8vIFRoaXMgd29uJ3QgYWZmZWN0IGFueW9uZSB3aG8gaGFzIHJlZmVyZW5jZWQgalF1ZXJ5LCBhbmQgdGhlcmUncyBhbHdheXMgdGhlIHdvcmthcm91bmQgb2YgaW5zZXJ0aW5nIGEgZHVtbXkgbm9kZVxuICAgICAgICAvLyAocG9zc2libHkgYSB0ZXh0IG5vZGUpIGluIGZyb250IG9mIHRoZSBjb21tZW50LiBTbywgS08gZG9lcyBub3QgYXR0ZW1wdCB0byB3b3JrYXJvdW5kIHRoaXMgSUUgaXNzdWUgYXV0b21hdGljYWxseSBhdCBwcmVzZW50LlxuXG4gICAgICAgIC8vIFRyaW0gd2hpdGVzcGFjZSwgb3RoZXJ3aXNlIGluZGV4T2Ygd29uJ3Qgd29yayBhcyBleHBlY3RlZFxuICAgICAgICB2YXIgdGFncyA9IGtvLnV0aWxzLnN0cmluZ1RyaW0oaHRtbCkudG9Mb3dlckNhc2UoKSwgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuICAgICAgICAvLyBGaW5kcyB0aGUgZmlyc3QgbWF0Y2ggZnJvbSB0aGUgbGVmdCBjb2x1bW4sIGFuZCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIFwid3JhcFwiIGRhdGEgZnJvbSB0aGUgcmlnaHQgY29sdW1uXG4gICAgICAgIHZhciB3cmFwID0gdGFncy5tYXRjaCgvXjwodGhlYWR8dGJvZHl8dGZvb3QpLykgICAgICAgICAgICAgICYmIFsxLCBcIjx0YWJsZT5cIiwgXCI8L3RhYmxlPlwiXSB8fFxuICAgICAgICAgICAgICAgICAgICF0YWdzLmluZGV4T2YoXCI8dHJcIikgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIFsyLCBcIjx0YWJsZT48dGJvZHk+XCIsIFwiPC90Ym9keT48L3RhYmxlPlwiXSB8fFxuICAgICAgICAgICAgICAgICAgICghdGFncy5pbmRleE9mKFwiPHRkXCIpIHx8ICF0YWdzLmluZGV4T2YoXCI8dGhcIikpICAgJiYgWzMsIFwiPHRhYmxlPjx0Ym9keT48dHI+XCIsIFwiPC90cj48L3Rib2R5PjwvdGFibGU+XCJdIHx8XG4gICAgICAgICAgICAgICAgICAgLyogYW55dGhpbmcgZWxzZSAqLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFswLCBcIlwiLCBcIlwiXTtcblxuICAgICAgICAvLyBHbyB0byBodG1sIGFuZCBiYWNrLCB0aGVuIHBlZWwgb2ZmIGV4dHJhIHdyYXBwZXJzXG4gICAgICAgIC8vIE5vdGUgdGhhdCB3ZSBhbHdheXMgcHJlZml4IHdpdGggc29tZSBkdW1teSB0ZXh0LCBiZWNhdXNlIG90aGVyd2lzZSwgSUU8OSB3aWxsIHN0cmlwIG91dCBsZWFkaW5nIGNvbW1lbnQgbm9kZXMgaW4gZGVzY2VuZGFudHMuIFRvdGFsIG1hZG5lc3MuXG4gICAgICAgIHZhciBtYXJrdXAgPSBcImlnbm9yZWQ8ZGl2PlwiICsgd3JhcFsxXSArIGh0bWwgKyB3cmFwWzJdICsgXCI8L2Rpdj5cIjtcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3dbJ2lubmVyU2hpdiddID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgZGl2LmFwcGVuZENoaWxkKHdpbmRvd1snaW5uZXJTaGl2J10obWFya3VwKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkaXYuaW5uZXJIVE1MID0gbWFya3VwO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTW92ZSB0byB0aGUgcmlnaHQgZGVwdGhcbiAgICAgICAgd2hpbGUgKHdyYXBbMF0tLSlcbiAgICAgICAgICAgIGRpdiA9IGRpdi5sYXN0Q2hpbGQ7XG5cbiAgICAgICAgcmV0dXJuIGtvLnV0aWxzLm1ha2VBcnJheShkaXYubGFzdENoaWxkLmNoaWxkTm9kZXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGpRdWVyeUh0bWxQYXJzZShodG1sKSB7XG4gICAgICAgIC8vIGpRdWVyeSdzIFwicGFyc2VIVE1MXCIgZnVuY3Rpb24gd2FzIGludHJvZHVjZWQgaW4galF1ZXJ5IDEuOC4wIGFuZCBpcyBhIGRvY3VtZW50ZWQgcHVibGljIEFQSS5cbiAgICAgICAgaWYgKGpRdWVyeUluc3RhbmNlWydwYXJzZUhUTUwnXSkge1xuICAgICAgICAgICAgcmV0dXJuIGpRdWVyeUluc3RhbmNlWydwYXJzZUhUTUwnXShodG1sKSB8fCBbXTsgLy8gRW5zdXJlIHdlIGFsd2F5cyByZXR1cm4gYW4gYXJyYXkgYW5kIG5ldmVyIG51bGxcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEZvciBqUXVlcnkgPCAxLjguMCwgd2UgZmFsbCBiYWNrIG9uIHRoZSB1bmRvY3VtZW50ZWQgaW50ZXJuYWwgXCJjbGVhblwiIGZ1bmN0aW9uLlxuICAgICAgICAgICAgdmFyIGVsZW1zID0galF1ZXJ5SW5zdGFuY2VbJ2NsZWFuJ10oW2h0bWxdKTtcblxuICAgICAgICAgICAgLy8gQXMgb2YgalF1ZXJ5IDEuNy4xLCBqUXVlcnkgcGFyc2VzIHRoZSBIVE1MIGJ5IGFwcGVuZGluZyBpdCB0byBzb21lIGR1bW15IHBhcmVudCBub2RlcyBoZWxkIGluIGFuIGluLW1lbW9yeSBkb2N1bWVudCBmcmFnbWVudC5cbiAgICAgICAgICAgIC8vIFVuZm9ydHVuYXRlbHksIGl0IG5ldmVyIGNsZWFycyB0aGUgZHVtbXkgcGFyZW50IG5vZGVzIGZyb20gdGhlIGRvY3VtZW50IGZyYWdtZW50LCBzbyBpdCBsZWFrcyBtZW1vcnkgb3ZlciB0aW1lLlxuICAgICAgICAgICAgLy8gRml4IHRoaXMgYnkgZmluZGluZyB0aGUgdG9wLW1vc3QgZHVtbXkgcGFyZW50IGVsZW1lbnQsIGFuZCBkZXRhY2hpbmcgaXQgZnJvbSBpdHMgb3duZXIgZnJhZ21lbnQuXG4gICAgICAgICAgICBpZiAoZWxlbXMgJiYgZWxlbXNbMF0pIHtcbiAgICAgICAgICAgICAgICAvLyBGaW5kIHRoZSB0b3AtbW9zdCBwYXJlbnQgZWxlbWVudCB0aGF0J3MgYSBkaXJlY3QgY2hpbGQgb2YgYSBkb2N1bWVudCBmcmFnbWVudFxuICAgICAgICAgICAgICAgIHZhciBlbGVtID0gZWxlbXNbMF07XG4gICAgICAgICAgICAgICAgd2hpbGUgKGVsZW0ucGFyZW50Tm9kZSAmJiBlbGVtLnBhcmVudE5vZGUubm9kZVR5cGUgIT09IDExIC8qIGkuZS4sIERvY3VtZW50RnJhZ21lbnQgKi8pXG4gICAgICAgICAgICAgICAgICAgIGVsZW0gPSBlbGVtLnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgLy8gLi4uIHRoZW4gZGV0YWNoIGl0XG4gICAgICAgICAgICAgICAgaWYgKGVsZW0ucGFyZW50Tm9kZSlcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZWxlbXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBrby51dGlscy5wYXJzZUh0bWxGcmFnbWVudCA9IGZ1bmN0aW9uKGh0bWwpIHtcbiAgICAgICAgcmV0dXJuIGpRdWVyeUluc3RhbmNlID8galF1ZXJ5SHRtbFBhcnNlKGh0bWwpICAgLy8gQXMgYmVsb3csIGJlbmVmaXQgZnJvbSBqUXVlcnkncyBvcHRpbWlzYXRpb25zIHdoZXJlIHBvc3NpYmxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHNpbXBsZUh0bWxQYXJzZShodG1sKTsgIC8vIC4uLiBvdGhlcndpc2UsIHRoaXMgc2ltcGxlIGxvZ2ljIHdpbGwgZG8gaW4gbW9zdCBjb21tb24gY2FzZXMuXG4gICAgfTtcblxuICAgIGtvLnV0aWxzLnNldEh0bWwgPSBmdW5jdGlvbihub2RlLCBodG1sKSB7XG4gICAgICAgIGtvLnV0aWxzLmVtcHR5RG9tTm9kZShub2RlKTtcblxuICAgICAgICAvLyBUaGVyZSdzIG5vIGxlZ2l0aW1hdGUgcmVhc29uIHRvIGRpc3BsYXkgYSBzdHJpbmdpZmllZCBvYnNlcnZhYmxlIHdpdGhvdXQgdW53cmFwcGluZyBpdCwgc28gd2UnbGwgdW53cmFwIGl0XG4gICAgICAgIGh0bWwgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKGh0bWwpO1xuXG4gICAgICAgIGlmICgoaHRtbCAhPT0gbnVsbCkgJiYgKGh0bWwgIT09IHVuZGVmaW5lZCkpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaHRtbCAhPSAnc3RyaW5nJylcbiAgICAgICAgICAgICAgICBodG1sID0gaHRtbC50b1N0cmluZygpO1xuXG4gICAgICAgICAgICAvLyBqUXVlcnkgY29udGFpbnMgYSBsb3Qgb2Ygc29waGlzdGljYXRlZCBjb2RlIHRvIHBhcnNlIGFyYml0cmFyeSBIVE1MIGZyYWdtZW50cyxcbiAgICAgICAgICAgIC8vIGZvciBleGFtcGxlIDx0cj4gZWxlbWVudHMgd2hpY2ggYXJlIG5vdCBub3JtYWxseSBhbGxvd2VkIHRvIGV4aXN0IG9uIHRoZWlyIG93bi5cbiAgICAgICAgICAgIC8vIElmIHlvdSd2ZSByZWZlcmVuY2VkIGpRdWVyeSB3ZSdsbCB1c2UgdGhhdCByYXRoZXIgdGhhbiBkdXBsaWNhdGluZyBpdHMgY29kZS5cbiAgICAgICAgICAgIGlmIChqUXVlcnlJbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgIGpRdWVyeUluc3RhbmNlKG5vZGUpWydodG1sJ10oaHRtbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIC4uLiBvdGhlcndpc2UsIHVzZSBLTydzIG93biBwYXJzaW5nIGxvZ2ljLlxuICAgICAgICAgICAgICAgIHZhciBwYXJzZWROb2RlcyA9IGtvLnV0aWxzLnBhcnNlSHRtbEZyYWdtZW50KGh0bWwpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFyc2VkTm9kZXMubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICAgICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQocGFyc2VkTm9kZXNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG5cbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMucGFyc2VIdG1sRnJhZ21lbnQnLCBrby51dGlscy5wYXJzZUh0bWxGcmFnbWVudCk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLnNldEh0bWwnLCBrby51dGlscy5zZXRIdG1sKTtcblxua28ubWVtb2l6YXRpb24gPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBtZW1vcyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gcmFuZG9tTWF4OEhleENoYXJzKCkge1xuICAgICAgICByZXR1cm4gKCgoMSArIE1hdGgucmFuZG9tKCkpICogMHgxMDAwMDAwMDApIHwgMCkudG9TdHJpbmcoMTYpLnN1YnN0cmluZygxKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVSYW5kb21JZCgpIHtcbiAgICAgICAgcmV0dXJuIHJhbmRvbU1heDhIZXhDaGFycygpICsgcmFuZG9tTWF4OEhleENoYXJzKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGZpbmRNZW1vTm9kZXMocm9vdE5vZGUsIGFwcGVuZFRvQXJyYXkpIHtcbiAgICAgICAgaWYgKCFyb290Tm9kZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKHJvb3ROb2RlLm5vZGVUeXBlID09IDgpIHtcbiAgICAgICAgICAgIHZhciBtZW1vSWQgPSBrby5tZW1vaXphdGlvbi5wYXJzZU1lbW9UZXh0KHJvb3ROb2RlLm5vZGVWYWx1ZSk7XG4gICAgICAgICAgICBpZiAobWVtb0lkICE9IG51bGwpXG4gICAgICAgICAgICAgICAgYXBwZW5kVG9BcnJheS5wdXNoKHsgZG9tTm9kZTogcm9vdE5vZGUsIG1lbW9JZDogbWVtb0lkIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHJvb3ROb2RlLm5vZGVUeXBlID09IDEpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBjaGlsZE5vZGVzID0gcm9vdE5vZGUuY2hpbGROb2RlcywgaiA9IGNoaWxkTm9kZXMubGVuZ3RoOyBpIDwgajsgaSsrKVxuICAgICAgICAgICAgICAgIGZpbmRNZW1vTm9kZXMoY2hpbGROb2Rlc1tpXSwgYXBwZW5kVG9BcnJheSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBtZW1vaXplOiBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT0gXCJmdW5jdGlvblwiKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIllvdSBjYW4gb25seSBwYXNzIGEgZnVuY3Rpb24gdG8ga28ubWVtb2l6YXRpb24ubWVtb2l6ZSgpXCIpO1xuICAgICAgICAgICAgdmFyIG1lbW9JZCA9IGdlbmVyYXRlUmFuZG9tSWQoKTtcbiAgICAgICAgICAgIG1lbW9zW21lbW9JZF0gPSBjYWxsYmFjaztcbiAgICAgICAgICAgIHJldHVybiBcIjwhLS1ba29fbWVtbzpcIiArIG1lbW9JZCArIFwiXS0tPlwiO1xuICAgICAgICB9LFxuXG4gICAgICAgIHVubWVtb2l6ZTogZnVuY3Rpb24gKG1lbW9JZCwgY2FsbGJhY2tQYXJhbXMpIHtcbiAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IG1lbW9zW21lbW9JZF07XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2sgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGFueSBtZW1vIHdpdGggSUQgXCIgKyBtZW1vSWQgKyBcIi4gUGVyaGFwcyBpdCdzIGFscmVhZHkgYmVlbiB1bm1lbW9pemVkLlwiKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkobnVsbCwgY2FsbGJhY2tQYXJhbXMgfHwgW10pO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmluYWxseSB7IGRlbGV0ZSBtZW1vc1ttZW1vSWRdOyB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgdW5tZW1vaXplRG9tTm9kZUFuZERlc2NlbmRhbnRzOiBmdW5jdGlvbiAoZG9tTm9kZSwgZXh0cmFDYWxsYmFja1BhcmFtc0FycmF5KSB7XG4gICAgICAgICAgICB2YXIgbWVtb3MgPSBbXTtcbiAgICAgICAgICAgIGZpbmRNZW1vTm9kZXMoZG9tTm9kZSwgbWVtb3MpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBtZW1vcy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IG1lbW9zW2ldLmRvbU5vZGU7XG4gICAgICAgICAgICAgICAgdmFyIGNvbWJpbmVkUGFyYW1zID0gW25vZGVdO1xuICAgICAgICAgICAgICAgIGlmIChleHRyYUNhbGxiYWNrUGFyYW1zQXJyYXkpXG4gICAgICAgICAgICAgICAgICAgIGtvLnV0aWxzLmFycmF5UHVzaEFsbChjb21iaW5lZFBhcmFtcywgZXh0cmFDYWxsYmFja1BhcmFtc0FycmF5KTtcbiAgICAgICAgICAgICAgICBrby5tZW1vaXphdGlvbi51bm1lbW9pemUobWVtb3NbaV0ubWVtb0lkLCBjb21iaW5lZFBhcmFtcyk7XG4gICAgICAgICAgICAgICAgbm9kZS5ub2RlVmFsdWUgPSBcIlwiOyAvLyBOZXV0ZXIgdGhpcyBub2RlIHNvIHdlIGRvbid0IHRyeSB0byB1bm1lbW9pemUgaXQgYWdhaW5cbiAgICAgICAgICAgICAgICBpZiAobm9kZS5wYXJlbnROb2RlKVxuICAgICAgICAgICAgICAgICAgICBub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7IC8vIElmIHBvc3NpYmxlLCBlcmFzZSBpdCB0b3RhbGx5IChub3QgYWx3YXlzIHBvc3NpYmxlIC0gc29tZW9uZSBlbHNlIG1pZ2h0IGp1c3QgaG9sZCBhIHJlZmVyZW5jZSB0byBpdCB0aGVuIGNhbGwgdW5tZW1vaXplRG9tTm9kZUFuZERlc2NlbmRhbnRzIGFnYWluKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNlTWVtb1RleHQ6IGZ1bmN0aW9uIChtZW1vVGV4dCkge1xuICAgICAgICAgICAgdmFyIG1hdGNoID0gbWVtb1RleHQubWF0Y2goL15cXFtrb19tZW1vXFw6KC4qPylcXF0kLyk7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2ggPyBtYXRjaFsxXSA6IG51bGw7XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcblxua28uZXhwb3J0U3ltYm9sKCdtZW1vaXphdGlvbicsIGtvLm1lbW9pemF0aW9uKTtcbmtvLmV4cG9ydFN5bWJvbCgnbWVtb2l6YXRpb24ubWVtb2l6ZScsIGtvLm1lbW9pemF0aW9uLm1lbW9pemUpO1xua28uZXhwb3J0U3ltYm9sKCdtZW1vaXphdGlvbi51bm1lbW9pemUnLCBrby5tZW1vaXphdGlvbi51bm1lbW9pemUpO1xua28uZXhwb3J0U3ltYm9sKCdtZW1vaXphdGlvbi5wYXJzZU1lbW9UZXh0Jywga28ubWVtb2l6YXRpb24ucGFyc2VNZW1vVGV4dCk7XG5rby5leHBvcnRTeW1ib2woJ21lbW9pemF0aW9uLnVubWVtb2l6ZURvbU5vZGVBbmREZXNjZW5kYW50cycsIGtvLm1lbW9pemF0aW9uLnVubWVtb2l6ZURvbU5vZGVBbmREZXNjZW5kYW50cyk7XG5rby5leHRlbmRlcnMgPSB7XG4gICAgJ3Rocm90dGxlJzogZnVuY3Rpb24odGFyZ2V0LCB0aW1lb3V0KSB7XG4gICAgICAgIC8vIFRocm90dGxpbmcgbWVhbnMgdHdvIHRoaW5nczpcblxuICAgICAgICAvLyAoMSkgRm9yIGRlcGVuZGVudCBvYnNlcnZhYmxlcywgd2UgdGhyb3R0bGUgKmV2YWx1YXRpb25zKiBzbyB0aGF0LCBubyBtYXR0ZXIgaG93IGZhc3QgaXRzIGRlcGVuZGVuY2llc1xuICAgICAgICAvLyAgICAgbm90aWZ5IHVwZGF0ZXMsIHRoZSB0YXJnZXQgZG9lc24ndCByZS1ldmFsdWF0ZSAoYW5kIGhlbmNlIGRvZXNuJ3Qgbm90aWZ5KSBmYXN0ZXIgdGhhbiBhIGNlcnRhaW4gcmF0ZVxuICAgICAgICB0YXJnZXRbJ3Rocm90dGxlRXZhbHVhdGlvbiddID0gdGltZW91dDtcblxuICAgICAgICAvLyAoMikgRm9yIHdyaXRhYmxlIHRhcmdldHMgKG9ic2VydmFibGVzLCBvciB3cml0YWJsZSBkZXBlbmRlbnQgb2JzZXJ2YWJsZXMpLCB3ZSB0aHJvdHRsZSAqd3JpdGVzKlxuICAgICAgICAvLyAgICAgc28gdGhlIHRhcmdldCBjYW5ub3QgY2hhbmdlIHZhbHVlIHN5bmNocm9ub3VzbHkgb3IgZmFzdGVyIHRoYW4gYSBjZXJ0YWluIHJhdGVcbiAgICAgICAgdmFyIHdyaXRlVGltZW91dEluc3RhbmNlID0gbnVsbDtcbiAgICAgICAgcmV0dXJuIGtvLmRlcGVuZGVudE9ic2VydmFibGUoe1xuICAgICAgICAgICAgJ3JlYWQnOiB0YXJnZXQsXG4gICAgICAgICAgICAnd3JpdGUnOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh3cml0ZVRpbWVvdXRJbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgd3JpdGVUaW1lb3V0SW5zdGFuY2UgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQodmFsdWUpO1xuICAgICAgICAgICAgICAgIH0sIHRpbWVvdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgJ3JhdGVMaW1pdCc6IGZ1bmN0aW9uKHRhcmdldCwgb3B0aW9ucykge1xuICAgICAgICB2YXIgdGltZW91dCwgbWV0aG9kLCBsaW1pdEZ1bmN0aW9uO1xuXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdGltZW91dCA9IG9wdGlvbnM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aW1lb3V0ID0gb3B0aW9uc1sndGltZW91dCddO1xuICAgICAgICAgICAgbWV0aG9kID0gb3B0aW9uc1snbWV0aG9kJ107XG4gICAgICAgIH1cblxuICAgICAgICBsaW1pdEZ1bmN0aW9uID0gbWV0aG9kID09ICdub3RpZnlXaGVuQ2hhbmdlc1N0b3AnID8gIGRlYm91bmNlIDogdGhyb3R0bGU7XG4gICAgICAgIHRhcmdldC5saW1pdChmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgcmV0dXJuIGxpbWl0RnVuY3Rpb24oY2FsbGJhY2ssIHRpbWVvdXQpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgJ25vdGlmeSc6IGZ1bmN0aW9uKHRhcmdldCwgbm90aWZ5V2hlbikge1xuICAgICAgICB0YXJnZXRbXCJlcXVhbGl0eUNvbXBhcmVyXCJdID0gbm90aWZ5V2hlbiA9PSBcImFsd2F5c1wiID9cbiAgICAgICAgICAgIG51bGwgOiAgLy8gbnVsbCBlcXVhbGl0eUNvbXBhcmVyIG1lYW5zIHRvIGFsd2F5cyBub3RpZnlcbiAgICAgICAgICAgIHZhbHVlc0FyZVByaW1pdGl2ZUFuZEVxdWFsO1xuICAgIH1cbn07XG5cbnZhciBwcmltaXRpdmVUeXBlcyA9IHsgJ3VuZGVmaW5lZCc6MSwgJ2Jvb2xlYW4nOjEsICdudW1iZXInOjEsICdzdHJpbmcnOjEgfTtcbmZ1bmN0aW9uIHZhbHVlc0FyZVByaW1pdGl2ZUFuZEVxdWFsKGEsIGIpIHtcbiAgICB2YXIgb2xkVmFsdWVJc1ByaW1pdGl2ZSA9IChhID09PSBudWxsKSB8fCAodHlwZW9mKGEpIGluIHByaW1pdGl2ZVR5cGVzKTtcbiAgICByZXR1cm4gb2xkVmFsdWVJc1ByaW1pdGl2ZSA/IChhID09PSBiKSA6IGZhbHNlO1xufVxuXG5mdW5jdGlvbiB0aHJvdHRsZShjYWxsYmFjaywgdGltZW91dCkge1xuICAgIHZhciB0aW1lb3V0SW5zdGFuY2U7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aW1lb3V0SW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHRpbWVvdXRJbnN0YW5jZSA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGltZW91dEluc3RhbmNlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9LCB0aW1lb3V0KTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGRlYm91bmNlKGNhbGxiYWNrLCB0aW1lb3V0KSB7XG4gICAgdmFyIHRpbWVvdXRJbnN0YW5jZTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dEluc3RhbmNlKTtcbiAgICAgICAgdGltZW91dEluc3RhbmNlID0gc2V0VGltZW91dChjYWxsYmFjaywgdGltZW91dCk7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gYXBwbHlFeHRlbmRlcnMocmVxdWVzdGVkRXh0ZW5kZXJzKSB7XG4gICAgdmFyIHRhcmdldCA9IHRoaXM7XG4gICAgaWYgKHJlcXVlc3RlZEV4dGVuZGVycykge1xuICAgICAgICBrby51dGlscy5vYmplY3RGb3JFYWNoKHJlcXVlc3RlZEV4dGVuZGVycywgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIGV4dGVuZGVySGFuZGxlciA9IGtvLmV4dGVuZGVyc1trZXldO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBleHRlbmRlckhhbmRsZXIgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHRhcmdldCA9IGV4dGVuZGVySGFuZGxlcih0YXJnZXQsIHZhbHVlKSB8fCB0YXJnZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xufVxuXG5rby5leHBvcnRTeW1ib2woJ2V4dGVuZGVycycsIGtvLmV4dGVuZGVycyk7XG5cbmtvLnN1YnNjcmlwdGlvbiA9IGZ1bmN0aW9uICh0YXJnZXQsIGNhbGxiYWNrLCBkaXNwb3NlQ2FsbGJhY2spIHtcbiAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcbiAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgdGhpcy5kaXNwb3NlQ2FsbGJhY2sgPSBkaXNwb3NlQ2FsbGJhY2s7XG4gICAgdGhpcy5pc0Rpc3Bvc2VkID0gZmFsc2U7XG4gICAga28uZXhwb3J0UHJvcGVydHkodGhpcywgJ2Rpc3Bvc2UnLCB0aGlzLmRpc3Bvc2UpO1xufTtcbmtvLnN1YnNjcmlwdGlvbi5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmlzRGlzcG9zZWQgPSB0cnVlO1xuICAgIHRoaXMuZGlzcG9zZUNhbGxiYWNrKCk7XG59O1xuXG5rby5zdWJzY3JpYmFibGUgPSBmdW5jdGlvbiAoKSB7XG4gICAga28udXRpbHMuc2V0UHJvdG90eXBlT2ZPckV4dGVuZCh0aGlzLCBrby5zdWJzY3JpYmFibGVbJ2ZuJ10pO1xuICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMgPSB7fTtcbn1cblxudmFyIGRlZmF1bHRFdmVudCA9IFwiY2hhbmdlXCI7XG5cbnZhciBrb19zdWJzY3JpYmFibGVfZm4gPSB7XG4gICAgc3Vic2NyaWJlOiBmdW5jdGlvbiAoY2FsbGJhY2ssIGNhbGxiYWNrVGFyZ2V0LCBldmVudCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgZXZlbnQgPSBldmVudCB8fCBkZWZhdWx0RXZlbnQ7XG4gICAgICAgIHZhciBib3VuZENhbGxiYWNrID0gY2FsbGJhY2tUYXJnZXQgPyBjYWxsYmFjay5iaW5kKGNhbGxiYWNrVGFyZ2V0KSA6IGNhbGxiYWNrO1xuXG4gICAgICAgIHZhciBzdWJzY3JpcHRpb24gPSBuZXcga28uc3Vic2NyaXB0aW9uKHNlbGYsIGJvdW5kQ2FsbGJhY2ssIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGtvLnV0aWxzLmFycmF5UmVtb3ZlSXRlbShzZWxmLl9zdWJzY3JpcHRpb25zW2V2ZW50XSwgc3Vic2NyaXB0aW9uKTtcbiAgICAgICAgICAgIGlmIChzZWxmLmFmdGVyU3Vic2NyaXB0aW9uUmVtb3ZlKVxuICAgICAgICAgICAgICAgIHNlbGYuYWZ0ZXJTdWJzY3JpcHRpb25SZW1vdmUoZXZlbnQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoc2VsZi5iZWZvcmVTdWJzY3JpcHRpb25BZGQpXG4gICAgICAgICAgICBzZWxmLmJlZm9yZVN1YnNjcmlwdGlvbkFkZChldmVudCk7XG5cbiAgICAgICAgaWYgKCFzZWxmLl9zdWJzY3JpcHRpb25zW2V2ZW50XSlcbiAgICAgICAgICAgIHNlbGYuX3N1YnNjcmlwdGlvbnNbZXZlbnRdID0gW107XG4gICAgICAgIHNlbGYuX3N1YnNjcmlwdGlvbnNbZXZlbnRdLnB1c2goc3Vic2NyaXB0aW9uKTtcblxuICAgICAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICAgIH0sXG5cbiAgICBcIm5vdGlmeVN1YnNjcmliZXJzXCI6IGZ1bmN0aW9uICh2YWx1ZVRvTm90aWZ5LCBldmVudCkge1xuICAgICAgICBldmVudCA9IGV2ZW50IHx8IGRlZmF1bHRFdmVudDtcbiAgICAgICAgaWYgKHRoaXMuaGFzU3Vic2NyaXB0aW9uc0ZvckV2ZW50KGV2ZW50KSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBrby5kZXBlbmRlbmN5RGV0ZWN0aW9uLmJlZ2luKCk7IC8vIEJlZ2luIHN1cHByZXNzaW5nIGRlcGVuZGVuY3kgZGV0ZWN0aW9uIChieSBzZXR0aW5nIHRoZSB0b3AgZnJhbWUgdG8gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGEgPSB0aGlzLl9zdWJzY3JpcHRpb25zW2V2ZW50XS5zbGljZSgwKSwgaSA9IDAsIHN1YnNjcmlwdGlvbjsgc3Vic2NyaXB0aW9uID0gYVtpXTsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEluIGNhc2UgYSBzdWJzY3JpcHRpb24gd2FzIGRpc3Bvc2VkIGR1cmluZyB0aGUgYXJyYXlGb3JFYWNoIGN5Y2xlLCBjaGVja1xuICAgICAgICAgICAgICAgICAgICAvLyBmb3IgaXNEaXNwb3NlZCBvbiBlYWNoIHN1YnNjcmlwdGlvbiBiZWZvcmUgaW52b2tpbmcgaXRzIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgICAgIGlmICghc3Vic2NyaXB0aW9uLmlzRGlzcG9zZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24uY2FsbGJhY2sodmFsdWVUb05vdGlmeSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICBrby5kZXBlbmRlbmN5RGV0ZWN0aW9uLmVuZCgpOyAvLyBFbmQgc3VwcHJlc3NpbmcgZGVwZW5kZW5jeSBkZXRlY3Rpb25cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBsaW1pdDogZnVuY3Rpb24obGltaXRGdW5jdGlvbikge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXMsIHNlbGZJc09ic2VydmFibGUgPSBrby5pc09ic2VydmFibGUoc2VsZiksXG4gICAgICAgICAgICBpc1BlbmRpbmcsIHByZXZpb3VzVmFsdWUsIHBlbmRpbmdWYWx1ZSwgYmVmb3JlQ2hhbmdlID0gJ2JlZm9yZUNoYW5nZSc7XG5cbiAgICAgICAgaWYgKCFzZWxmLl9vcmlnTm90aWZ5U3Vic2NyaWJlcnMpIHtcbiAgICAgICAgICAgIHNlbGYuX29yaWdOb3RpZnlTdWJzY3JpYmVycyA9IHNlbGZbXCJub3RpZnlTdWJzY3JpYmVyc1wiXTtcbiAgICAgICAgICAgIHNlbGZbXCJub3RpZnlTdWJzY3JpYmVyc1wiXSA9IGZ1bmN0aW9uKHZhbHVlLCBldmVudCkge1xuICAgICAgICAgICAgICAgIGlmICghZXZlbnQgfHwgZXZlbnQgPT09IGRlZmF1bHRFdmVudCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9yYXRlTGltaXRlZENoYW5nZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudCA9PT0gYmVmb3JlQ2hhbmdlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX3JhdGVMaW1pdGVkQmVmb3JlQ2hhbmdlKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9vcmlnTm90aWZ5U3Vic2NyaWJlcnModmFsdWUsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZpbmlzaCA9IGxpbWl0RnVuY3Rpb24oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBJZiBhbiBvYnNlcnZhYmxlIHByb3ZpZGVkIGEgcmVmZXJlbmNlIHRvIGl0c2VsZiwgYWNjZXNzIGl0IHRvIGdldCB0aGUgbGF0ZXN0IHZhbHVlLlxuICAgICAgICAgICAgLy8gVGhpcyBhbGxvd3MgY29tcHV0ZWQgb2JzZXJ2YWJsZXMgdG8gZGVsYXkgY2FsY3VsYXRpbmcgdGhlaXIgdmFsdWUgdW50aWwgbmVlZGVkLlxuICAgICAgICAgICAgaWYgKHNlbGZJc09ic2VydmFibGUgJiYgcGVuZGluZ1ZhbHVlID09PSBzZWxmKSB7XG4gICAgICAgICAgICAgICAgcGVuZGluZ1ZhbHVlID0gc2VsZigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaXNQZW5kaW5nID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoc2VsZi5pc0RpZmZlcmVudChwcmV2aW91c1ZhbHVlLCBwZW5kaW5nVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5fb3JpZ05vdGlmeVN1YnNjcmliZXJzKHByZXZpb3VzVmFsdWUgPSBwZW5kaW5nVmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBzZWxmLl9yYXRlTGltaXRlZENoYW5nZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpc1BlbmRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgcGVuZGluZ1ZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICBmaW5pc2goKTtcbiAgICAgICAgfTtcbiAgICAgICAgc2VsZi5fcmF0ZUxpbWl0ZWRCZWZvcmVDaGFuZ2UgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKCFpc1BlbmRpbmcpIHtcbiAgICAgICAgICAgICAgICBwcmV2aW91c1ZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgc2VsZi5fb3JpZ05vdGlmeVN1YnNjcmliZXJzKHZhbHVlLCBiZWZvcmVDaGFuZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBoYXNTdWJzY3JpcHRpb25zRm9yRXZlbnQ6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdWJzY3JpcHRpb25zW2V2ZW50XSAmJiB0aGlzLl9zdWJzY3JpcHRpb25zW2V2ZW50XS5sZW5ndGg7XG4gICAgfSxcblxuICAgIGdldFN1YnNjcmlwdGlvbnNDb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdG90YWwgPSAwO1xuICAgICAgICBrby51dGlscy5vYmplY3RGb3JFYWNoKHRoaXMuX3N1YnNjcmlwdGlvbnMsIGZ1bmN0aW9uKGV2ZW50TmFtZSwgc3Vic2NyaXB0aW9ucykge1xuICAgICAgICAgICAgdG90YWwgKz0gc3Vic2NyaXB0aW9ucy5sZW5ndGg7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdG90YWw7XG4gICAgfSxcblxuICAgIGlzRGlmZmVyZW50OiBmdW5jdGlvbihvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzWydlcXVhbGl0eUNvbXBhcmVyJ10gfHwgIXRoaXNbJ2VxdWFsaXR5Q29tcGFyZXInXShvbGRWYWx1ZSwgbmV3VmFsdWUpO1xuICAgIH0sXG5cbiAgICBleHRlbmQ6IGFwcGx5RXh0ZW5kZXJzXG59O1xuXG5rby5leHBvcnRQcm9wZXJ0eShrb19zdWJzY3JpYmFibGVfZm4sICdzdWJzY3JpYmUnLCBrb19zdWJzY3JpYmFibGVfZm4uc3Vic2NyaWJlKTtcbmtvLmV4cG9ydFByb3BlcnR5KGtvX3N1YnNjcmliYWJsZV9mbiwgJ2V4dGVuZCcsIGtvX3N1YnNjcmliYWJsZV9mbi5leHRlbmQpO1xua28uZXhwb3J0UHJvcGVydHkoa29fc3Vic2NyaWJhYmxlX2ZuLCAnZ2V0U3Vic2NyaXB0aW9uc0NvdW50Jywga29fc3Vic2NyaWJhYmxlX2ZuLmdldFN1YnNjcmlwdGlvbnNDb3VudCk7XG5cbi8vIEZvciBicm93c2VycyB0aGF0IHN1cHBvcnQgcHJvdG8gYXNzaWdubWVudCwgd2Ugb3ZlcndyaXRlIHRoZSBwcm90b3R5cGUgb2YgZWFjaFxuLy8gb2JzZXJ2YWJsZSBpbnN0YW5jZS4gU2luY2Ugb2JzZXJ2YWJsZXMgYXJlIGZ1bmN0aW9ucywgd2UgbmVlZCBGdW5jdGlvbi5wcm90b3R5cGVcbi8vIHRvIHN0aWxsIGJlIGluIHRoZSBwcm90b3R5cGUgY2hhaW4uXG5pZiAoa28udXRpbHMuY2FuU2V0UHJvdG90eXBlKSB7XG4gICAga28udXRpbHMuc2V0UHJvdG90eXBlT2Yoa29fc3Vic2NyaWJhYmxlX2ZuLCBGdW5jdGlvbi5wcm90b3R5cGUpO1xufVxuXG5rby5zdWJzY3JpYmFibGVbJ2ZuJ10gPSBrb19zdWJzY3JpYmFibGVfZm47XG5cblxua28uaXNTdWJzY3JpYmFibGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gaW5zdGFuY2UgIT0gbnVsbCAmJiB0eXBlb2YgaW5zdGFuY2Uuc3Vic2NyaWJlID09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgaW5zdGFuY2VbXCJub3RpZnlTdWJzY3JpYmVyc1wiXSA9PSBcImZ1bmN0aW9uXCI7XG59O1xuXG5rby5leHBvcnRTeW1ib2woJ3N1YnNjcmliYWJsZScsIGtvLnN1YnNjcmliYWJsZSk7XG5rby5leHBvcnRTeW1ib2woJ2lzU3Vic2NyaWJhYmxlJywga28uaXNTdWJzY3JpYmFibGUpO1xuXG5rby5jb21wdXRlZENvbnRleHQgPSBrby5kZXBlbmRlbmN5RGV0ZWN0aW9uID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3V0ZXJGcmFtZXMgPSBbXSxcbiAgICAgICAgY3VycmVudEZyYW1lLFxuICAgICAgICBsYXN0SWQgPSAwO1xuXG4gICAgLy8gUmV0dXJuIGEgdW5pcXVlIElEIHRoYXQgY2FuIGJlIGFzc2lnbmVkIHRvIGFuIG9ic2VydmFibGUgZm9yIGRlcGVuZGVuY3kgdHJhY2tpbmcuXG4gICAgLy8gVGhlb3JldGljYWxseSwgeW91IGNvdWxkIGV2ZW50dWFsbHkgb3ZlcmZsb3cgdGhlIG51bWJlciBzdG9yYWdlIHNpemUsIHJlc3VsdGluZ1xuICAgIC8vIGluIGR1cGxpY2F0ZSBJRHMuIEJ1dCBpbiBKYXZhU2NyaXB0LCB0aGUgbGFyZ2VzdCBleGFjdCBpbnRlZ3JhbCB2YWx1ZSBpcyAyXjUzXG4gICAgLy8gb3IgOSwwMDcsMTk5LDI1NCw3NDAsOTkyLiBJZiB5b3UgY3JlYXRlZCAxLDAwMCwwMDAgSURzIHBlciBzZWNvbmQsIGl0IHdvdWxkXG4gICAgLy8gdGFrZSBvdmVyIDI4NSB5ZWFycyB0byByZWFjaCB0aGF0IG51bWJlci5cbiAgICAvLyBSZWZlcmVuY2UgaHR0cDovL2Jsb2cudmpldXguY29tLzIwMTAvamF2YXNjcmlwdC9qYXZhc2NyaXB0LW1heF9pbnQtbnVtYmVyLWxpbWl0cy5odG1sXG4gICAgZnVuY3Rpb24gZ2V0SWQoKSB7XG4gICAgICAgIHJldHVybiArK2xhc3RJZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBiZWdpbihvcHRpb25zKSB7XG4gICAgICAgIG91dGVyRnJhbWVzLnB1c2goY3VycmVudEZyYW1lKTtcbiAgICAgICAgY3VycmVudEZyYW1lID0gb3B0aW9ucztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbmQoKSB7XG4gICAgICAgIGN1cnJlbnRGcmFtZSA9IG91dGVyRnJhbWVzLnBvcCgpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGJlZ2luOiBiZWdpbixcblxuICAgICAgICBlbmQ6IGVuZCxcblxuICAgICAgICByZWdpc3RlckRlcGVuZGVuY3k6IGZ1bmN0aW9uIChzdWJzY3JpYmFibGUpIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50RnJhbWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWtvLmlzU3Vic2NyaWJhYmxlKHN1YnNjcmliYWJsZSkpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk9ubHkgc3Vic2NyaWJhYmxlIHRoaW5ncyBjYW4gYWN0IGFzIGRlcGVuZGVuY2llc1wiKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50RnJhbWUuY2FsbGJhY2soc3Vic2NyaWJhYmxlLCBzdWJzY3JpYmFibGUuX2lkIHx8IChzdWJzY3JpYmFibGUuX2lkID0gZ2V0SWQoKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGlnbm9yZTogZnVuY3Rpb24gKGNhbGxiYWNrLCBjYWxsYmFja1RhcmdldCwgY2FsbGJhY2tBcmdzKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGJlZ2luKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KGNhbGxiYWNrVGFyZ2V0LCBjYWxsYmFja0FyZ3MgfHwgW10pO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICBlbmQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBnZXREZXBlbmRlbmNpZXNDb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRGcmFtZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudEZyYW1lLmNvbXB1dGVkLmdldERlcGVuZGVuY2llc0NvdW50KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNJbml0aWFsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50RnJhbWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRGcmFtZS5pc0luaXRpYWw7XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcblxua28uZXhwb3J0U3ltYm9sKCdjb21wdXRlZENvbnRleHQnLCBrby5jb21wdXRlZENvbnRleHQpO1xua28uZXhwb3J0U3ltYm9sKCdjb21wdXRlZENvbnRleHQuZ2V0RGVwZW5kZW5jaWVzQ291bnQnLCBrby5jb21wdXRlZENvbnRleHQuZ2V0RGVwZW5kZW5jaWVzQ291bnQpO1xua28uZXhwb3J0U3ltYm9sKCdjb21wdXRlZENvbnRleHQuaXNJbml0aWFsJywga28uY29tcHV0ZWRDb250ZXh0LmlzSW5pdGlhbCk7XG5rby5leHBvcnRTeW1ib2woJ2NvbXB1dGVkQ29udGV4dC5pc1NsZWVwaW5nJywga28uY29tcHV0ZWRDb250ZXh0LmlzU2xlZXBpbmcpO1xua28ub2JzZXJ2YWJsZSA9IGZ1bmN0aW9uIChpbml0aWFsVmFsdWUpIHtcbiAgICB2YXIgX2xhdGVzdFZhbHVlID0gaW5pdGlhbFZhbHVlO1xuXG4gICAgZnVuY3Rpb24gb2JzZXJ2YWJsZSgpIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAvLyBXcml0ZVxuXG4gICAgICAgICAgICAvLyBJZ25vcmUgd3JpdGVzIGlmIHRoZSB2YWx1ZSBoYXNuJ3QgY2hhbmdlZFxuICAgICAgICAgICAgaWYgKG9ic2VydmFibGUuaXNEaWZmZXJlbnQoX2xhdGVzdFZhbHVlLCBhcmd1bWVudHNbMF0pKSB7XG4gICAgICAgICAgICAgICAgb2JzZXJ2YWJsZS52YWx1ZVdpbGxNdXRhdGUoKTtcbiAgICAgICAgICAgICAgICBfbGF0ZXN0VmFsdWUgPSBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICAgICAgaWYgKERFQlVHKSBvYnNlcnZhYmxlLl9sYXRlc3RWYWx1ZSA9IF9sYXRlc3RWYWx1ZTtcbiAgICAgICAgICAgICAgICBvYnNlcnZhYmxlLnZhbHVlSGFzTXV0YXRlZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7IC8vIFBlcm1pdHMgY2hhaW5lZCBhc3NpZ25tZW50c1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gUmVhZFxuICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5yZWdpc3RlckRlcGVuZGVuY3kob2JzZXJ2YWJsZSk7IC8vIFRoZSBjYWxsZXIgb25seSBuZWVkcyB0byBiZSBub3RpZmllZCBvZiBjaGFuZ2VzIGlmIHRoZXkgZGlkIGEgXCJyZWFkXCIgb3BlcmF0aW9uXG4gICAgICAgICAgICByZXR1cm4gX2xhdGVzdFZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGtvLnN1YnNjcmliYWJsZS5jYWxsKG9ic2VydmFibGUpO1xuICAgIGtvLnV0aWxzLnNldFByb3RvdHlwZU9mT3JFeHRlbmQob2JzZXJ2YWJsZSwga28ub2JzZXJ2YWJsZVsnZm4nXSk7XG5cbiAgICBpZiAoREVCVUcpIG9ic2VydmFibGUuX2xhdGVzdFZhbHVlID0gX2xhdGVzdFZhbHVlO1xuICAgIG9ic2VydmFibGUucGVlayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gX2xhdGVzdFZhbHVlIH07XG4gICAgb2JzZXJ2YWJsZS52YWx1ZUhhc011dGF0ZWQgPSBmdW5jdGlvbiAoKSB7IG9ic2VydmFibGVbXCJub3RpZnlTdWJzY3JpYmVyc1wiXShfbGF0ZXN0VmFsdWUpOyB9XG4gICAgb2JzZXJ2YWJsZS52YWx1ZVdpbGxNdXRhdGUgPSBmdW5jdGlvbiAoKSB7IG9ic2VydmFibGVbXCJub3RpZnlTdWJzY3JpYmVyc1wiXShfbGF0ZXN0VmFsdWUsIFwiYmVmb3JlQ2hhbmdlXCIpOyB9XG5cbiAgICBrby5leHBvcnRQcm9wZXJ0eShvYnNlcnZhYmxlLCAncGVlaycsIG9ic2VydmFibGUucGVlayk7XG4gICAga28uZXhwb3J0UHJvcGVydHkob2JzZXJ2YWJsZSwgXCJ2YWx1ZUhhc011dGF0ZWRcIiwgb2JzZXJ2YWJsZS52YWx1ZUhhc011dGF0ZWQpO1xuICAgIGtvLmV4cG9ydFByb3BlcnR5KG9ic2VydmFibGUsIFwidmFsdWVXaWxsTXV0YXRlXCIsIG9ic2VydmFibGUudmFsdWVXaWxsTXV0YXRlKTtcblxuICAgIHJldHVybiBvYnNlcnZhYmxlO1xufVxuXG5rby5vYnNlcnZhYmxlWydmbiddID0ge1xuICAgIFwiZXF1YWxpdHlDb21wYXJlclwiOiB2YWx1ZXNBcmVQcmltaXRpdmVBbmRFcXVhbFxufTtcblxudmFyIHByb3RvUHJvcGVydHkgPSBrby5vYnNlcnZhYmxlLnByb3RvUHJvcGVydHkgPSBcIl9fa29fcHJvdG9fX1wiO1xua28ub2JzZXJ2YWJsZVsnZm4nXVtwcm90b1Byb3BlcnR5XSA9IGtvLm9ic2VydmFibGU7XG5cbi8vIE5vdGUgdGhhdCBmb3IgYnJvd3NlcnMgdGhhdCBkb24ndCBzdXBwb3J0IHByb3RvIGFzc2lnbm1lbnQsIHRoZVxuLy8gaW5oZXJpdGFuY2UgY2hhaW4gaXMgY3JlYXRlZCBtYW51YWxseSBpbiB0aGUga28ub2JzZXJ2YWJsZSBjb25zdHJ1Y3RvclxuaWYgKGtvLnV0aWxzLmNhblNldFByb3RvdHlwZSkge1xuICAgIGtvLnV0aWxzLnNldFByb3RvdHlwZU9mKGtvLm9ic2VydmFibGVbJ2ZuJ10sIGtvLnN1YnNjcmliYWJsZVsnZm4nXSk7XG59XG5cbmtvLmhhc1Byb3RvdHlwZSA9IGZ1bmN0aW9uKGluc3RhbmNlLCBwcm90b3R5cGUpIHtcbiAgICBpZiAoKGluc3RhbmNlID09PSBudWxsKSB8fCAoaW5zdGFuY2UgPT09IHVuZGVmaW5lZCkgfHwgKGluc3RhbmNlW3Byb3RvUHJvcGVydHldID09PSB1bmRlZmluZWQpKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGluc3RhbmNlW3Byb3RvUHJvcGVydHldID09PSBwcm90b3R5cGUpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBrby5oYXNQcm90b3R5cGUoaW5zdGFuY2VbcHJvdG9Qcm9wZXJ0eV0sIHByb3RvdHlwZSk7IC8vIFdhbGsgdGhlIHByb3RvdHlwZSBjaGFpblxufTtcblxua28uaXNPYnNlcnZhYmxlID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgcmV0dXJuIGtvLmhhc1Byb3RvdHlwZShpbnN0YW5jZSwga28ub2JzZXJ2YWJsZSk7XG59XG5rby5pc1dyaXRlYWJsZU9ic2VydmFibGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAvLyBPYnNlcnZhYmxlXG4gICAgaWYgKCh0eXBlb2YgaW5zdGFuY2UgPT0gXCJmdW5jdGlvblwiKSAmJiBpbnN0YW5jZVtwcm90b1Byb3BlcnR5XSA9PT0ga28ub2JzZXJ2YWJsZSlcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgLy8gV3JpdGVhYmxlIGRlcGVuZGVudCBvYnNlcnZhYmxlXG4gICAgaWYgKCh0eXBlb2YgaW5zdGFuY2UgPT0gXCJmdW5jdGlvblwiKSAmJiAoaW5zdGFuY2VbcHJvdG9Qcm9wZXJ0eV0gPT09IGtvLmRlcGVuZGVudE9ic2VydmFibGUpICYmIChpbnN0YW5jZS5oYXNXcml0ZUZ1bmN0aW9uKSlcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgLy8gQW55dGhpbmcgZWxzZVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuXG5rby5leHBvcnRTeW1ib2woJ29ic2VydmFibGUnLCBrby5vYnNlcnZhYmxlKTtcbmtvLmV4cG9ydFN5bWJvbCgnaXNPYnNlcnZhYmxlJywga28uaXNPYnNlcnZhYmxlKTtcbmtvLmV4cG9ydFN5bWJvbCgnaXNXcml0ZWFibGVPYnNlcnZhYmxlJywga28uaXNXcml0ZWFibGVPYnNlcnZhYmxlKTtcbmtvLmV4cG9ydFN5bWJvbCgnaXNXcml0YWJsZU9ic2VydmFibGUnLCBrby5pc1dyaXRlYWJsZU9ic2VydmFibGUpO1xua28ub2JzZXJ2YWJsZUFycmF5ID0gZnVuY3Rpb24gKGluaXRpYWxWYWx1ZXMpIHtcbiAgICBpbml0aWFsVmFsdWVzID0gaW5pdGlhbFZhbHVlcyB8fCBbXTtcblxuICAgIGlmICh0eXBlb2YgaW5pdGlhbFZhbHVlcyAhPSAnb2JqZWN0JyB8fCAhKCdsZW5ndGgnIGluIGluaXRpYWxWYWx1ZXMpKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgYXJndW1lbnQgcGFzc2VkIHdoZW4gaW5pdGlhbGl6aW5nIGFuIG9ic2VydmFibGUgYXJyYXkgbXVzdCBiZSBhbiBhcnJheSwgb3IgbnVsbCwgb3IgdW5kZWZpbmVkLlwiKTtcblxuICAgIHZhciByZXN1bHQgPSBrby5vYnNlcnZhYmxlKGluaXRpYWxWYWx1ZXMpO1xuICAgIGtvLnV0aWxzLnNldFByb3RvdHlwZU9mT3JFeHRlbmQocmVzdWx0LCBrby5vYnNlcnZhYmxlQXJyYXlbJ2ZuJ10pO1xuICAgIHJldHVybiByZXN1bHQuZXh0ZW5kKHsndHJhY2tBcnJheUNoYW5nZXMnOnRydWV9KTtcbn07XG5cbmtvLm9ic2VydmFibGVBcnJheVsnZm4nXSA9IHtcbiAgICAncmVtb3ZlJzogZnVuY3Rpb24gKHZhbHVlT3JQcmVkaWNhdGUpIHtcbiAgICAgICAgdmFyIHVuZGVybHlpbmdBcnJheSA9IHRoaXMucGVlaygpO1xuICAgICAgICB2YXIgcmVtb3ZlZFZhbHVlcyA9IFtdO1xuICAgICAgICB2YXIgcHJlZGljYXRlID0gdHlwZW9mIHZhbHVlT3JQcmVkaWNhdGUgPT0gXCJmdW5jdGlvblwiICYmICFrby5pc09ic2VydmFibGUodmFsdWVPclByZWRpY2F0ZSkgPyB2YWx1ZU9yUHJlZGljYXRlIDogZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybiB2YWx1ZSA9PT0gdmFsdWVPclByZWRpY2F0ZTsgfTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB1bmRlcmx5aW5nQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHVuZGVybHlpbmdBcnJheVtpXTtcbiAgICAgICAgICAgIGlmIChwcmVkaWNhdGUodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlbW92ZWRWYWx1ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWVXaWxsTXV0YXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlbW92ZWRWYWx1ZXMucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgdW5kZXJseWluZ0FycmF5LnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBpLS07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbW92ZWRWYWx1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlSGFzTXV0YXRlZCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZW1vdmVkVmFsdWVzO1xuICAgIH0sXG5cbiAgICAncmVtb3ZlQWxsJzogZnVuY3Rpb24gKGFycmF5T2ZWYWx1ZXMpIHtcbiAgICAgICAgLy8gSWYgeW91IHBhc3NlZCB6ZXJvIGFyZ3MsIHdlIHJlbW92ZSBldmVyeXRoaW5nXG4gICAgICAgIGlmIChhcnJheU9mVmFsdWVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHZhciB1bmRlcmx5aW5nQXJyYXkgPSB0aGlzLnBlZWsoKTtcbiAgICAgICAgICAgIHZhciBhbGxWYWx1ZXMgPSB1bmRlcmx5aW5nQXJyYXkuc2xpY2UoMCk7XG4gICAgICAgICAgICB0aGlzLnZhbHVlV2lsbE11dGF0ZSgpO1xuICAgICAgICAgICAgdW5kZXJseWluZ0FycmF5LnNwbGljZSgwLCB1bmRlcmx5aW5nQXJyYXkubGVuZ3RoKTtcbiAgICAgICAgICAgIHRoaXMudmFsdWVIYXNNdXRhdGVkKCk7XG4gICAgICAgICAgICByZXR1cm4gYWxsVmFsdWVzO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIHlvdSBwYXNzZWQgYW4gYXJnLCB3ZSBpbnRlcnByZXQgaXQgYXMgYW4gYXJyYXkgb2YgZW50cmllcyB0byByZW1vdmVcbiAgICAgICAgaWYgKCFhcnJheU9mVmFsdWVzKVxuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICByZXR1cm4gdGhpc1sncmVtb3ZlJ10oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4ga28udXRpbHMuYXJyYXlJbmRleE9mKGFycmF5T2ZWYWx1ZXMsIHZhbHVlKSA+PSAwO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgJ2Rlc3Ryb3knOiBmdW5jdGlvbiAodmFsdWVPclByZWRpY2F0ZSkge1xuICAgICAgICB2YXIgdW5kZXJseWluZ0FycmF5ID0gdGhpcy5wZWVrKCk7XG4gICAgICAgIHZhciBwcmVkaWNhdGUgPSB0eXBlb2YgdmFsdWVPclByZWRpY2F0ZSA9PSBcImZ1bmN0aW9uXCIgJiYgIWtvLmlzT2JzZXJ2YWJsZSh2YWx1ZU9yUHJlZGljYXRlKSA/IHZhbHVlT3JQcmVkaWNhdGUgOiBmdW5jdGlvbiAodmFsdWUpIHsgcmV0dXJuIHZhbHVlID09PSB2YWx1ZU9yUHJlZGljYXRlOyB9O1xuICAgICAgICB0aGlzLnZhbHVlV2lsbE11dGF0ZSgpO1xuICAgICAgICBmb3IgKHZhciBpID0gdW5kZXJseWluZ0FycmF5Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB1bmRlcmx5aW5nQXJyYXlbaV07XG4gICAgICAgICAgICBpZiAocHJlZGljYXRlKHZhbHVlKSlcbiAgICAgICAgICAgICAgICB1bmRlcmx5aW5nQXJyYXlbaV1bXCJfZGVzdHJveVwiXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy52YWx1ZUhhc011dGF0ZWQoKTtcbiAgICB9LFxuXG4gICAgJ2Rlc3Ryb3lBbGwnOiBmdW5jdGlvbiAoYXJyYXlPZlZhbHVlcykge1xuICAgICAgICAvLyBJZiB5b3UgcGFzc2VkIHplcm8gYXJncywgd2UgZGVzdHJveSBldmVyeXRoaW5nXG4gICAgICAgIGlmIChhcnJheU9mVmFsdWVzID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gdGhpc1snZGVzdHJveSddKGZ1bmN0aW9uKCkgeyByZXR1cm4gdHJ1ZSB9KTtcblxuICAgICAgICAvLyBJZiB5b3UgcGFzc2VkIGFuIGFyZywgd2UgaW50ZXJwcmV0IGl0IGFzIGFuIGFycmF5IG9mIGVudHJpZXMgdG8gZGVzdHJveVxuICAgICAgICBpZiAoIWFycmF5T2ZWYWx1ZXMpXG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIHJldHVybiB0aGlzWydkZXN0cm95J10oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4ga28udXRpbHMuYXJyYXlJbmRleE9mKGFycmF5T2ZWYWx1ZXMsIHZhbHVlKSA+PSAwO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgJ2luZGV4T2YnOiBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICB2YXIgdW5kZXJseWluZ0FycmF5ID0gdGhpcygpO1xuICAgICAgICByZXR1cm4ga28udXRpbHMuYXJyYXlJbmRleE9mKHVuZGVybHlpbmdBcnJheSwgaXRlbSk7XG4gICAgfSxcblxuICAgICdyZXBsYWNlJzogZnVuY3Rpb24ob2xkSXRlbSwgbmV3SXRlbSkge1xuICAgICAgICB2YXIgaW5kZXggPSB0aGlzWydpbmRleE9mJ10ob2xkSXRlbSk7XG4gICAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlV2lsbE11dGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5wZWVrKClbaW5kZXhdID0gbmV3SXRlbTtcbiAgICAgICAgICAgIHRoaXMudmFsdWVIYXNNdXRhdGVkKCk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vLyBQb3B1bGF0ZSBrby5vYnNlcnZhYmxlQXJyYXkuZm4gd2l0aCByZWFkL3dyaXRlIGZ1bmN0aW9ucyBmcm9tIG5hdGl2ZSBhcnJheXNcbi8vIEltcG9ydGFudDogRG8gbm90IGFkZCBhbnkgYWRkaXRpb25hbCBmdW5jdGlvbnMgaGVyZSB0aGF0IG1heSByZWFzb25hYmx5IGJlIHVzZWQgdG8gKnJlYWQqIGRhdGEgZnJvbSB0aGUgYXJyYXlcbi8vIGJlY2F1c2Ugd2UnbGwgZXZhbCB0aGVtIHdpdGhvdXQgY2F1c2luZyBzdWJzY3JpcHRpb25zLCBzbyBrby5jb21wdXRlZCBvdXRwdXQgY291bGQgZW5kIHVwIGdldHRpbmcgc3RhbGVcbmtvLnV0aWxzLmFycmF5Rm9yRWFjaChbXCJwb3BcIiwgXCJwdXNoXCIsIFwicmV2ZXJzZVwiLCBcInNoaWZ0XCIsIFwic29ydFwiLCBcInNwbGljZVwiLCBcInVuc2hpZnRcIl0sIGZ1bmN0aW9uIChtZXRob2ROYW1lKSB7XG4gICAga28ub2JzZXJ2YWJsZUFycmF5WydmbiddW21ldGhvZE5hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBVc2UgXCJwZWVrXCIgdG8gYXZvaWQgY3JlYXRpbmcgYSBzdWJzY3JpcHRpb24gaW4gYW55IGNvbXB1dGVkIHRoYXQgd2UncmUgZXhlY3V0aW5nIGluIHRoZSBjb250ZXh0IG9mXG4gICAgICAgIC8vIChmb3IgY29uc2lzdGVuY3kgd2l0aCBtdXRhdGluZyByZWd1bGFyIG9ic2VydmFibGVzKVxuICAgICAgICB2YXIgdW5kZXJseWluZ0FycmF5ID0gdGhpcy5wZWVrKCk7XG4gICAgICAgIHRoaXMudmFsdWVXaWxsTXV0YXRlKCk7XG4gICAgICAgIHRoaXMuY2FjaGVEaWZmRm9yS25vd25PcGVyYXRpb24odW5kZXJseWluZ0FycmF5LCBtZXRob2ROYW1lLCBhcmd1bWVudHMpO1xuICAgICAgICB2YXIgbWV0aG9kQ2FsbFJlc3VsdCA9IHVuZGVybHlpbmdBcnJheVttZXRob2ROYW1lXS5hcHBseSh1bmRlcmx5aW5nQXJyYXksIGFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMudmFsdWVIYXNNdXRhdGVkKCk7XG4gICAgICAgIHJldHVybiBtZXRob2RDYWxsUmVzdWx0O1xuICAgIH07XG59KTtcblxuLy8gUG9wdWxhdGUga28ub2JzZXJ2YWJsZUFycmF5LmZuIHdpdGggcmVhZC1vbmx5IGZ1bmN0aW9ucyBmcm9tIG5hdGl2ZSBhcnJheXNcbmtvLnV0aWxzLmFycmF5Rm9yRWFjaChbXCJzbGljZVwiXSwgZnVuY3Rpb24gKG1ldGhvZE5hbWUpIHtcbiAgICBrby5vYnNlcnZhYmxlQXJyYXlbJ2ZuJ11bbWV0aG9kTmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB1bmRlcmx5aW5nQXJyYXkgPSB0aGlzKCk7XG4gICAgICAgIHJldHVybiB1bmRlcmx5aW5nQXJyYXlbbWV0aG9kTmFtZV0uYXBwbHkodW5kZXJseWluZ0FycmF5LCBhcmd1bWVudHMpO1xuICAgIH07XG59KTtcblxuLy8gTm90ZSB0aGF0IGZvciBicm93c2VycyB0aGF0IGRvbid0IHN1cHBvcnQgcHJvdG8gYXNzaWdubWVudCwgdGhlXG4vLyBpbmhlcml0YW5jZSBjaGFpbiBpcyBjcmVhdGVkIG1hbnVhbGx5IGluIHRoZSBrby5vYnNlcnZhYmxlQXJyYXkgY29uc3RydWN0b3JcbmlmIChrby51dGlscy5jYW5TZXRQcm90b3R5cGUpIHtcbiAgICBrby51dGlscy5zZXRQcm90b3R5cGVPZihrby5vYnNlcnZhYmxlQXJyYXlbJ2ZuJ10sIGtvLm9ic2VydmFibGVbJ2ZuJ10pO1xufVxuXG5rby5leHBvcnRTeW1ib2woJ29ic2VydmFibGVBcnJheScsIGtvLm9ic2VydmFibGVBcnJheSk7XG52YXIgYXJyYXlDaGFuZ2VFdmVudE5hbWUgPSAnYXJyYXlDaGFuZ2UnO1xua28uZXh0ZW5kZXJzWyd0cmFja0FycmF5Q2hhbmdlcyddID0gZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgLy8gT25seSBtb2RpZnkgdGhlIHRhcmdldCBvYnNlcnZhYmxlIG9uY2VcbiAgICBpZiAodGFyZ2V0LmNhY2hlRGlmZkZvcktub3duT3BlcmF0aW9uKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRyYWNraW5nQ2hhbmdlcyA9IGZhbHNlLFxuICAgICAgICBjYWNoZWREaWZmID0gbnVsbCxcbiAgICAgICAgcGVuZGluZ05vdGlmaWNhdGlvbnMgPSAwLFxuICAgICAgICB1bmRlcmx5aW5nU3Vic2NyaWJlRnVuY3Rpb24gPSB0YXJnZXQuc3Vic2NyaWJlO1xuXG4gICAgLy8gSW50ZXJjZXB0IFwic3Vic2NyaWJlXCIgY2FsbHMsIGFuZCBmb3IgYXJyYXkgY2hhbmdlIGV2ZW50cywgZW5zdXJlIGNoYW5nZSB0cmFja2luZyBpcyBlbmFibGVkXG4gICAgdGFyZ2V0LnN1YnNjcmliZSA9IHRhcmdldFsnc3Vic2NyaWJlJ10gPSBmdW5jdGlvbihjYWxsYmFjaywgY2FsbGJhY2tUYXJnZXQsIGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudCA9PT0gYXJyYXlDaGFuZ2VFdmVudE5hbWUpIHtcbiAgICAgICAgICAgIHRyYWNrQ2hhbmdlcygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlcmx5aW5nU3Vic2NyaWJlRnVuY3Rpb24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gdHJhY2tDaGFuZ2VzKCkge1xuICAgICAgICAvLyBDYWxsaW5nICd0cmFja0NoYW5nZXMnIG11bHRpcGxlIHRpbWVzIGlzIHRoZSBzYW1lIGFzIGNhbGxpbmcgaXQgb25jZVxuICAgICAgICBpZiAodHJhY2tpbmdDaGFuZ2VzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0cmFja2luZ0NoYW5nZXMgPSB0cnVlO1xuXG4gICAgICAgIC8vIEludGVyY2VwdCBcIm5vdGlmeVN1YnNjcmliZXJzXCIgdG8gdHJhY2sgaG93IG1hbnkgdGltZXMgaXQgd2FzIGNhbGxlZC5cbiAgICAgICAgdmFyIHVuZGVybHlpbmdOb3RpZnlTdWJzY3JpYmVyc0Z1bmN0aW9uID0gdGFyZ2V0Wydub3RpZnlTdWJzY3JpYmVycyddO1xuICAgICAgICB0YXJnZXRbJ25vdGlmeVN1YnNjcmliZXJzJ10gPSBmdW5jdGlvbih2YWx1ZVRvTm90aWZ5LCBldmVudCkge1xuICAgICAgICAgICAgaWYgKCFldmVudCB8fCBldmVudCA9PT0gZGVmYXVsdEV2ZW50KSB7XG4gICAgICAgICAgICAgICAgKytwZW5kaW5nTm90aWZpY2F0aW9ucztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB1bmRlcmx5aW5nTm90aWZ5U3Vic2NyaWJlcnNGdW5jdGlvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEVhY2ggdGltZSB0aGUgYXJyYXkgY2hhbmdlcyB2YWx1ZSwgY2FwdHVyZSBhIGNsb25lIHNvIHRoYXQgb24gdGhlIG5leHRcbiAgICAgICAgLy8gY2hhbmdlIGl0J3MgcG9zc2libGUgdG8gcHJvZHVjZSBhIGRpZmZcbiAgICAgICAgdmFyIHByZXZpb3VzQ29udGVudHMgPSBbXS5jb25jYXQodGFyZ2V0LnBlZWsoKSB8fCBbXSk7XG4gICAgICAgIGNhY2hlZERpZmYgPSBudWxsO1xuICAgICAgICB0YXJnZXQuc3Vic2NyaWJlKGZ1bmN0aW9uKGN1cnJlbnRDb250ZW50cykge1xuICAgICAgICAgICAgLy8gTWFrZSBhIGNvcHkgb2YgdGhlIGN1cnJlbnQgY29udGVudHMgYW5kIGVuc3VyZSBpdCdzIGFuIGFycmF5XG4gICAgICAgICAgICBjdXJyZW50Q29udGVudHMgPSBbXS5jb25jYXQoY3VycmVudENvbnRlbnRzIHx8IFtdKTtcblxuICAgICAgICAgICAgLy8gQ29tcHV0ZSB0aGUgZGlmZiBhbmQgaXNzdWUgbm90aWZpY2F0aW9ucywgYnV0IG9ubHkgaWYgc29tZW9uZSBpcyBsaXN0ZW5pbmdcbiAgICAgICAgICAgIGlmICh0YXJnZXQuaGFzU3Vic2NyaXB0aW9uc0ZvckV2ZW50KGFycmF5Q2hhbmdlRXZlbnROYW1lKSkge1xuICAgICAgICAgICAgICAgIHZhciBjaGFuZ2VzID0gZ2V0Q2hhbmdlcyhwcmV2aW91c0NvbnRlbnRzLCBjdXJyZW50Q29udGVudHMpO1xuICAgICAgICAgICAgICAgIGlmIChjaGFuZ2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRbJ25vdGlmeVN1YnNjcmliZXJzJ10oY2hhbmdlcywgYXJyYXlDaGFuZ2VFdmVudE5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRWxpbWluYXRlIHJlZmVyZW5jZXMgdG8gdGhlIG9sZCwgcmVtb3ZlZCBpdGVtcywgc28gdGhleSBjYW4gYmUgR0NlZFxuICAgICAgICAgICAgcHJldmlvdXNDb250ZW50cyA9IGN1cnJlbnRDb250ZW50cztcbiAgICAgICAgICAgIGNhY2hlZERpZmYgPSBudWxsO1xuICAgICAgICAgICAgcGVuZGluZ05vdGlmaWNhdGlvbnMgPSAwO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRDaGFuZ2VzKHByZXZpb3VzQ29udGVudHMsIGN1cnJlbnRDb250ZW50cykge1xuICAgICAgICAvLyBXZSB0cnkgdG8gcmUtdXNlIGNhY2hlZCBkaWZmcy5cbiAgICAgICAgLy8gVGhlIHNjZW5hcmlvcyB3aGVyZSBwZW5kaW5nTm90aWZpY2F0aW9ucyA+IDEgYXJlIHdoZW4gdXNpbmcgcmF0ZS1saW1pdGluZyBvciB0aGUgRGVmZXJyZWQgVXBkYXRlc1xuICAgICAgICAvLyBwbHVnaW4sIHdoaWNoIHdpdGhvdXQgdGhpcyBjaGVjayB3b3VsZCBub3QgYmUgY29tcGF0aWJsZSB3aXRoIGFycmF5Q2hhbmdlIG5vdGlmaWNhdGlvbnMuIE5vcm1hbGx5LFxuICAgICAgICAvLyBub3RpZmljYXRpb25zIGFyZSBpc3N1ZWQgaW1tZWRpYXRlbHkgc28gd2Ugd291bGRuJ3QgYmUgcXVldWVpbmcgdXAgbW9yZSB0aGFuIG9uZS5cbiAgICAgICAgaWYgKCFjYWNoZWREaWZmIHx8IHBlbmRpbmdOb3RpZmljYXRpb25zID4gMSkge1xuICAgICAgICAgICAgY2FjaGVkRGlmZiA9IGtvLnV0aWxzLmNvbXBhcmVBcnJheXMocHJldmlvdXNDb250ZW50cywgY3VycmVudENvbnRlbnRzLCB7ICdzcGFyc2UnOiB0cnVlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNhY2hlZERpZmY7XG4gICAgfVxuXG4gICAgdGFyZ2V0LmNhY2hlRGlmZkZvcktub3duT3BlcmF0aW9uID0gZnVuY3Rpb24ocmF3QXJyYXksIG9wZXJhdGlvbk5hbWUsIGFyZ3MpIHtcbiAgICAgICAgLy8gT25seSBydW4gaWYgd2UncmUgY3VycmVudGx5IHRyYWNraW5nIGNoYW5nZXMgZm9yIHRoaXMgb2JzZXJ2YWJsZSBhcnJheVxuICAgICAgICAvLyBhbmQgdGhlcmUgYXJlbid0IGFueSBwZW5kaW5nIGRlZmVycmVkIG5vdGlmaWNhdGlvbnMuXG4gICAgICAgIGlmICghdHJhY2tpbmdDaGFuZ2VzIHx8IHBlbmRpbmdOb3RpZmljYXRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRpZmYgPSBbXSxcbiAgICAgICAgICAgIGFycmF5TGVuZ3RoID0gcmF3QXJyYXkubGVuZ3RoLFxuICAgICAgICAgICAgYXJnc0xlbmd0aCA9IGFyZ3MubGVuZ3RoLFxuICAgICAgICAgICAgb2Zmc2V0ID0gMDtcblxuICAgICAgICBmdW5jdGlvbiBwdXNoRGlmZihzdGF0dXMsIHZhbHVlLCBpbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIGRpZmZbZGlmZi5sZW5ndGhdID0geyAnc3RhdHVzJzogc3RhdHVzLCAndmFsdWUnOiB2YWx1ZSwgJ2luZGV4JzogaW5kZXggfTtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKG9wZXJhdGlvbk5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3B1c2gnOlxuICAgICAgICAgICAgICAgIG9mZnNldCA9IGFycmF5TGVuZ3RoO1xuICAgICAgICAgICAgY2FzZSAndW5zaGlmdCc6XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGFyZ3NMZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgcHVzaERpZmYoJ2FkZGVkJywgYXJnc1tpbmRleF0sIG9mZnNldCArIGluZGV4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ3BvcCc6XG4gICAgICAgICAgICAgICAgb2Zmc2V0ID0gYXJyYXlMZW5ndGggLSAxO1xuICAgICAgICAgICAgY2FzZSAnc2hpZnQnOlxuICAgICAgICAgICAgICAgIGlmIChhcnJheUxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBwdXNoRGlmZignZGVsZXRlZCcsIHJhd0FycmF5W29mZnNldF0sIG9mZnNldCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdzcGxpY2UnOlxuICAgICAgICAgICAgICAgIC8vIE5lZ2F0aXZlIHN0YXJ0IGluZGV4IG1lYW5zICdmcm9tIGVuZCBvZiBhcnJheScuIEFmdGVyIHRoYXQgd2UgY2xhbXAgdG8gWzAuLi5hcnJheUxlbmd0aF0uXG4gICAgICAgICAgICAgICAgLy8gU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L3NwbGljZVxuICAgICAgICAgICAgICAgIHZhciBzdGFydEluZGV4ID0gTWF0aC5taW4oTWF0aC5tYXgoMCwgYXJnc1swXSA8IDAgPyBhcnJheUxlbmd0aCArIGFyZ3NbMF0gOiBhcmdzWzBdKSwgYXJyYXlMZW5ndGgpLFxuICAgICAgICAgICAgICAgICAgICBlbmREZWxldGVJbmRleCA9IGFyZ3NMZW5ndGggPT09IDEgPyBhcnJheUxlbmd0aCA6IE1hdGgubWluKHN0YXJ0SW5kZXggKyAoYXJnc1sxXSB8fCAwKSwgYXJyYXlMZW5ndGgpLFxuICAgICAgICAgICAgICAgICAgICBlbmRBZGRJbmRleCA9IHN0YXJ0SW5kZXggKyBhcmdzTGVuZ3RoIC0gMixcbiAgICAgICAgICAgICAgICAgICAgZW5kSW5kZXggPSBNYXRoLm1heChlbmREZWxldGVJbmRleCwgZW5kQWRkSW5kZXgpLFxuICAgICAgICAgICAgICAgICAgICBhZGRpdGlvbnMgPSBbXSwgZGVsZXRpb25zID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSBzdGFydEluZGV4LCBhcmdzSW5kZXggPSAyOyBpbmRleCA8IGVuZEluZGV4OyArK2luZGV4LCArK2FyZ3NJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPCBlbmREZWxldGVJbmRleClcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0aW9ucy5wdXNoKHB1c2hEaWZmKCdkZWxldGVkJywgcmF3QXJyYXlbaW5kZXhdLCBpbmRleCkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPCBlbmRBZGRJbmRleClcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZGl0aW9ucy5wdXNoKHB1c2hEaWZmKCdhZGRlZCcsIGFyZ3NbYXJnc0luZGV4XSwgaW5kZXgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAga28udXRpbHMuZmluZE1vdmVzSW5BcnJheUNvbXBhcmlzb24oZGVsZXRpb25zLCBhZGRpdGlvbnMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjYWNoZWREaWZmID0gZGlmZjtcbiAgICB9O1xufTtcbmtvLmNvbXB1dGVkID0ga28uZGVwZW5kZW50T2JzZXJ2YWJsZSA9IGZ1bmN0aW9uIChldmFsdWF0b3JGdW5jdGlvbk9yT3B0aW9ucywgZXZhbHVhdG9yRnVuY3Rpb25UYXJnZXQsIG9wdGlvbnMpIHtcbiAgICB2YXIgX2xhdGVzdFZhbHVlLFxuICAgICAgICBfbmVlZHNFdmFsdWF0aW9uID0gdHJ1ZSxcbiAgICAgICAgX2lzQmVpbmdFdmFsdWF0ZWQgPSBmYWxzZSxcbiAgICAgICAgX3N1cHByZXNzRGlzcG9zYWxVbnRpbERpc3Bvc2VXaGVuUmV0dXJuc0ZhbHNlID0gZmFsc2UsXG4gICAgICAgIF9pc0Rpc3Bvc2VkID0gZmFsc2UsXG4gICAgICAgIHJlYWRGdW5jdGlvbiA9IGV2YWx1YXRvckZ1bmN0aW9uT3JPcHRpb25zLFxuICAgICAgICBwdXJlID0gZmFsc2UsXG4gICAgICAgIGlzU2xlZXBpbmcgPSBmYWxzZTtcblxuICAgIGlmIChyZWFkRnVuY3Rpb24gJiYgdHlwZW9mIHJlYWRGdW5jdGlvbiA9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIC8vIFNpbmdsZS1wYXJhbWV0ZXIgc3ludGF4IC0gZXZlcnl0aGluZyBpcyBvbiB0aGlzIFwib3B0aW9uc1wiIHBhcmFtXG4gICAgICAgIG9wdGlvbnMgPSByZWFkRnVuY3Rpb247XG4gICAgICAgIHJlYWRGdW5jdGlvbiA9IG9wdGlvbnNbXCJyZWFkXCJdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE11bHRpLXBhcmFtZXRlciBzeW50YXggLSBjb25zdHJ1Y3QgdGhlIG9wdGlvbnMgYWNjb3JkaW5nIHRvIHRoZSBwYXJhbXMgcGFzc2VkXG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgICBpZiAoIXJlYWRGdW5jdGlvbilcbiAgICAgICAgICAgIHJlYWRGdW5jdGlvbiA9IG9wdGlvbnNbXCJyZWFkXCJdO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHJlYWRGdW5jdGlvbiAhPSBcImZ1bmN0aW9uXCIpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlBhc3MgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIHZhbHVlIG9mIHRoZSBrby5jb21wdXRlZFwiKTtcblxuICAgIGZ1bmN0aW9uIGFkZFN1YnNjcmlwdGlvblRvRGVwZW5kZW5jeShzdWJzY3JpYmFibGUsIGlkKSB7XG4gICAgICAgIGlmICghX3N1YnNjcmlwdGlvbnNUb0RlcGVuZGVuY2llc1tpZF0pIHtcbiAgICAgICAgICAgIF9zdWJzY3JpcHRpb25zVG9EZXBlbmRlbmNpZXNbaWRdID0gc3Vic2NyaWJhYmxlLnN1YnNjcmliZShldmFsdWF0ZVBvc3NpYmx5QXN5bmMpO1xuICAgICAgICAgICAgKytfZGVwZW5kZW5jaWVzQ291bnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkaXNwb3NlQWxsU3Vic2NyaXB0aW9uc1RvRGVwZW5kZW5jaWVzKCkge1xuICAgICAgICBrby51dGlscy5vYmplY3RGb3JFYWNoKF9zdWJzY3JpcHRpb25zVG9EZXBlbmRlbmNpZXMsIGZ1bmN0aW9uIChpZCwgc3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBzdWJzY3JpcHRpb24uZGlzcG9zZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgX3N1YnNjcmlwdGlvbnNUb0RlcGVuZGVuY2llcyA9IHt9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRpc3Bvc2VDb21wdXRlZCgpIHtcbiAgICAgICAgZGlzcG9zZUFsbFN1YnNjcmlwdGlvbnNUb0RlcGVuZGVuY2llcygpO1xuICAgICAgICBfZGVwZW5kZW5jaWVzQ291bnQgPSAwO1xuICAgICAgICBfaXNEaXNwb3NlZCA9IHRydWU7XG4gICAgICAgIF9uZWVkc0V2YWx1YXRpb24gPSBmYWxzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBldmFsdWF0ZVBvc3NpYmx5QXN5bmMoKSB7XG4gICAgICAgIHZhciB0aHJvdHRsZUV2YWx1YXRpb25UaW1lb3V0ID0gZGVwZW5kZW50T2JzZXJ2YWJsZVsndGhyb3R0bGVFdmFsdWF0aW9uJ107XG4gICAgICAgIGlmICh0aHJvdHRsZUV2YWx1YXRpb25UaW1lb3V0ICYmIHRocm90dGxlRXZhbHVhdGlvblRpbWVvdXQgPj0gMCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGV2YWx1YXRpb25UaW1lb3V0SW5zdGFuY2UpO1xuICAgICAgICAgICAgZXZhbHVhdGlvblRpbWVvdXRJbnN0YW5jZSA9IHNldFRpbWVvdXQoZXZhbHVhdGVJbW1lZGlhdGUsIHRocm90dGxlRXZhbHVhdGlvblRpbWVvdXQpO1xuICAgICAgICB9IGVsc2UgaWYgKGRlcGVuZGVudE9ic2VydmFibGUuX2V2YWxSYXRlTGltaXRlZCkge1xuICAgICAgICAgICAgZGVwZW5kZW50T2JzZXJ2YWJsZS5fZXZhbFJhdGVMaW1pdGVkKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBldmFsdWF0ZUltbWVkaWF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXZhbHVhdGVJbW1lZGlhdGUoc3VwcHJlc3NDaGFuZ2VOb3RpZmljYXRpb24pIHtcbiAgICAgICAgaWYgKF9pc0JlaW5nRXZhbHVhdGVkKSB7XG4gICAgICAgICAgICBpZiAocHVyZSkge1xuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiQSAncHVyZScgY29tcHV0ZWQgbXVzdCBub3QgYmUgY2FsbGVkIHJlY3Vyc2l2ZWx5XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSWYgdGhlIGV2YWx1YXRpb24gb2YgYSBrby5jb21wdXRlZCBjYXVzZXMgc2lkZSBlZmZlY3RzLCBpdCdzIHBvc3NpYmxlIHRoYXQgaXQgd2lsbCB0cmlnZ2VyIGl0cyBvd24gcmUtZXZhbHVhdGlvbi5cbiAgICAgICAgICAgIC8vIFRoaXMgaXMgbm90IGRlc2lyYWJsZSAoaXQncyBoYXJkIGZvciBhIGRldmVsb3BlciB0byByZWFsaXNlIGEgY2hhaW4gb2YgZGVwZW5kZW5jaWVzIG1pZ2h0IGNhdXNlIHRoaXMsIGFuZCB0aGV5IGFsbW9zdFxuICAgICAgICAgICAgLy8gY2VydGFpbmx5IGRpZG4ndCBpbnRlbmQgaW5maW5pdGUgcmUtZXZhbHVhdGlvbnMpLiBTbywgZm9yIHByZWRpY3RhYmlsaXR5LCB3ZSBzaW1wbHkgcHJldmVudCBrby5jb21wdXRlZHMgZnJvbSBjYXVzaW5nXG4gICAgICAgICAgICAvLyB0aGVpciBvd24gcmUtZXZhbHVhdGlvbi4gRnVydGhlciBkaXNjdXNzaW9uIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9TdGV2ZVNhbmRlcnNvbi9rbm9ja291dC9wdWxsLzM4N1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRG8gbm90IGV2YWx1YXRlIChhbmQgcG9zc2libHkgY2FwdHVyZSBuZXcgZGVwZW5kZW5jaWVzKSBpZiBkaXNwb3NlZFxuICAgICAgICBpZiAoX2lzRGlzcG9zZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkaXNwb3NlV2hlbiAmJiBkaXNwb3NlV2hlbigpKSB7XG4gICAgICAgICAgICAvLyBTZWUgY29tbWVudCBiZWxvdyBhYm91dCBfc3VwcHJlc3NEaXNwb3NhbFVudGlsRGlzcG9zZVdoZW5SZXR1cm5zRmFsc2VcbiAgICAgICAgICAgIGlmICghX3N1cHByZXNzRGlzcG9zYWxVbnRpbERpc3Bvc2VXaGVuUmV0dXJuc0ZhbHNlKSB7XG4gICAgICAgICAgICAgICAgZGlzcG9zZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEl0IGp1c3QgZGlkIHJldHVybiBmYWxzZSwgc28gd2UgY2FuIHN0b3Agc3VwcHJlc3Npbmcgbm93XG4gICAgICAgICAgICBfc3VwcHJlc3NEaXNwb3NhbFVudGlsRGlzcG9zZVdoZW5SZXR1cm5zRmFsc2UgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9pc0JlaW5nRXZhbHVhdGVkID0gdHJ1ZTtcblxuICAgICAgICAvLyBXaGVuIHNsZWVwaW5nLCByZWNhbGN1bGF0ZSB0aGUgdmFsdWUgYW5kIHJldHVybi5cbiAgICAgICAgaWYgKGlzU2xlZXBpbmcpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlcGVuZGVuY3lUcmFja2luZyA9IHt9O1xuICAgICAgICAgICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uYmVnaW4oe1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24gKHN1YnNjcmliYWJsZSwgaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZGVwZW5kZW5jeVRyYWNraW5nW2lkXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlcGVuZGVuY3lUcmFja2luZ1tpZF0gPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsrX2RlcGVuZGVuY2llc0NvdW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjb21wdXRlZDogZGVwZW5kZW50T2JzZXJ2YWJsZSxcbiAgICAgICAgICAgICAgICAgICAgaXNJbml0aWFsOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBfZGVwZW5kZW5jaWVzQ291bnQgPSAwO1xuICAgICAgICAgICAgICAgIF9sYXRlc3RWYWx1ZSA9IHJlYWRGdW5jdGlvbi5jYWxsKGV2YWx1YXRvckZ1bmN0aW9uVGFyZ2V0KTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5lbmQoKTtcbiAgICAgICAgICAgICAgICBfaXNCZWluZ0V2YWx1YXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAvLyBJbml0aWFsbHksIHdlIGFzc3VtZSB0aGF0IG5vbmUgb2YgdGhlIHN1YnNjcmlwdGlvbnMgYXJlIHN0aWxsIGJlaW5nIHVzZWQgKGkuZS4sIGFsbCBhcmUgY2FuZGlkYXRlcyBmb3IgZGlzcG9zYWwpLlxuICAgICAgICAgICAgICAgIC8vIFRoZW4sIGR1cmluZyBldmFsdWF0aW9uLCB3ZSBjcm9zcyBvZmYgYW55IHRoYXQgYXJlIGluIGZhY3Qgc3RpbGwgYmVpbmcgdXNlZC5cbiAgICAgICAgICAgICAgICB2YXIgZGlzcG9zYWxDYW5kaWRhdGVzID0gX3N1YnNjcmlwdGlvbnNUb0RlcGVuZGVuY2llcywgZGlzcG9zYWxDb3VudCA9IF9kZXBlbmRlbmNpZXNDb3VudDtcbiAgICAgICAgICAgICAgICBrby5kZXBlbmRlbmN5RGV0ZWN0aW9uLmJlZ2luKHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKHN1YnNjcmliYWJsZSwgaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghX2lzRGlzcG9zZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGlzcG9zYWxDb3VudCAmJiBkaXNwb3NhbENhbmRpZGF0ZXNbaWRdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvbid0IHdhbnQgdG8gZGlzcG9zZSB0aGlzIHN1YnNjcmlwdGlvbiwgYXMgaXQncyBzdGlsbCBiZWluZyB1c2VkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9zdWJzY3JpcHRpb25zVG9EZXBlbmRlbmNpZXNbaWRdID0gZGlzcG9zYWxDYW5kaWRhdGVzW2lkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKytfZGVwZW5kZW5jaWVzQ291bnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBkaXNwb3NhbENhbmRpZGF0ZXNbaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLWRpc3Bvc2FsQ291bnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQnJhbmQgbmV3IHN1YnNjcmlwdGlvbiAtIGFkZCBpdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRTdWJzY3JpcHRpb25Ub0RlcGVuZGVuY3koc3Vic2NyaWJhYmxlLCBpZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjb21wdXRlZDogZGVwZW5kZW50T2JzZXJ2YWJsZSxcbiAgICAgICAgICAgICAgICAgICAgaXNJbml0aWFsOiBwdXJlID8gdW5kZWZpbmVkIDogIV9kZXBlbmRlbmNpZXNDb3VudCAgICAgICAgLy8gSWYgd2UncmUgZXZhbHVhdGluZyB3aGVuIHRoZXJlIGFyZSBubyBwcmV2aW91cyBkZXBlbmRlbmNpZXMsIGl0IG11c3QgYmUgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIF9zdWJzY3JpcHRpb25zVG9EZXBlbmRlbmNpZXMgPSB7fTtcbiAgICAgICAgICAgICAgICBfZGVwZW5kZW5jaWVzQ291bnQgPSAwO1xuXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld1ZhbHVlID0gZXZhbHVhdG9yRnVuY3Rpb25UYXJnZXQgPyByZWFkRnVuY3Rpb24uY2FsbChldmFsdWF0b3JGdW5jdGlvblRhcmdldCkgOiByZWFkRnVuY3Rpb24oKTtcblxuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uZW5kKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRm9yIGVhY2ggc3Vic2NyaXB0aW9uIG5vIGxvbmdlciBiZWluZyB1c2VkLCByZW1vdmUgaXQgZnJvbSB0aGUgYWN0aXZlIHN1YnNjcmlwdGlvbnMgbGlzdCBhbmQgZGlzcG9zZSBpdFxuICAgICAgICAgICAgICAgICAgICBpZiAoZGlzcG9zYWxDb3VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAga28udXRpbHMub2JqZWN0Rm9yRWFjaChkaXNwb3NhbENhbmRpZGF0ZXMsIGZ1bmN0aW9uKGlkLCB0b0Rpc3Bvc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b0Rpc3Bvc2UuZGlzcG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBfbmVlZHNFdmFsdWF0aW9uID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGRlcGVuZGVudE9ic2VydmFibGUuaXNEaWZmZXJlbnQoX2xhdGVzdFZhbHVlLCBuZXdWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVwZW5kZW50T2JzZXJ2YWJsZVtcIm5vdGlmeVN1YnNjcmliZXJzXCJdKF9sYXRlc3RWYWx1ZSwgXCJiZWZvcmVDaGFuZ2VcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgX2xhdGVzdFZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChERUJVRykgZGVwZW5kZW50T2JzZXJ2YWJsZS5fbGF0ZXN0VmFsdWUgPSBfbGF0ZXN0VmFsdWU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHN1cHByZXNzQ2hhbmdlTm90aWZpY2F0aW9uICE9PSB0cnVlKSB7ICAvLyBDaGVjayBmb3Igc3RyaWN0IHRydWUgdmFsdWUgc2luY2Ugc2V0VGltZW91dCBpbiBGaXJlZm94IHBhc3NlcyBhIG51bWVyaWMgdmFsdWUgdG8gdGhlIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXBlbmRlbnRPYnNlcnZhYmxlW1wibm90aWZ5U3Vic2NyaWJlcnNcIl0oX2xhdGVzdFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgX2lzQmVpbmdFdmFsdWF0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghX2RlcGVuZGVuY2llc0NvdW50KVxuICAgICAgICAgICAgZGlzcG9zZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlcGVuZGVudE9ic2VydmFibGUoKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB3cml0ZUZ1bmN0aW9uID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAvLyBXcml0aW5nIGEgdmFsdWVcbiAgICAgICAgICAgICAgICB3cml0ZUZ1bmN0aW9uLmFwcGx5KGV2YWx1YXRvckZ1bmN0aW9uVGFyZ2V0LCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3Qgd3JpdGUgYSB2YWx1ZSB0byBhIGtvLmNvbXB1dGVkIHVubGVzcyB5b3Ugc3BlY2lmeSBhICd3cml0ZScgb3B0aW9uLiBJZiB5b3Ugd2lzaCB0byByZWFkIHRoZSBjdXJyZW50IHZhbHVlLCBkb24ndCBwYXNzIGFueSBwYXJhbWV0ZXJzLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzOyAvLyBQZXJtaXRzIGNoYWluZWQgYXNzaWdubWVudHNcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFJlYWRpbmcgdGhlIHZhbHVlXG4gICAgICAgICAgICBrby5kZXBlbmRlbmN5RGV0ZWN0aW9uLnJlZ2lzdGVyRGVwZW5kZW5jeShkZXBlbmRlbnRPYnNlcnZhYmxlKTtcbiAgICAgICAgICAgIGlmIChfbmVlZHNFdmFsdWF0aW9uKVxuICAgICAgICAgICAgICAgIGV2YWx1YXRlSW1tZWRpYXRlKHRydWUgLyogc3VwcHJlc3NDaGFuZ2VOb3RpZmljYXRpb24gKi8pO1xuICAgICAgICAgICAgcmV0dXJuIF9sYXRlc3RWYWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBlZWsoKSB7XG4gICAgICAgIC8vIFBlZWsgd29uJ3QgcmUtZXZhbHVhdGUsIGV4Y2VwdCB0byBnZXQgdGhlIGluaXRpYWwgdmFsdWUgd2hlbiBcImRlZmVyRXZhbHVhdGlvblwiIGlzIHNldCwgb3Igd2hpbGUgdGhlIGNvbXB1dGVkIGlzIHNsZWVwaW5nLlxuICAgICAgICAvLyBUaG9zZSBhcmUgdGhlIG9ubHkgdGltZXMgdGhhdCBib3RoIG9mIHRoZXNlIGNvbmRpdGlvbnMgd2lsbCBiZSBzYXRpc2ZpZWQuXG4gICAgICAgIGlmIChfbmVlZHNFdmFsdWF0aW9uICYmICFfZGVwZW5kZW5jaWVzQ291bnQpXG4gICAgICAgICAgICBldmFsdWF0ZUltbWVkaWF0ZSh0cnVlIC8qIHN1cHByZXNzQ2hhbmdlTm90aWZpY2F0aW9uICovKTtcbiAgICAgICAgcmV0dXJuIF9sYXRlc3RWYWx1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0FjdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuIF9uZWVkc0V2YWx1YXRpb24gfHwgX2RlcGVuZGVuY2llc0NvdW50ID4gMDtcbiAgICB9XG5cbiAgICAvLyBCeSBoZXJlLCBcIm9wdGlvbnNcIiBpcyBhbHdheXMgbm9uLW51bGxcbiAgICB2YXIgd3JpdGVGdW5jdGlvbiA9IG9wdGlvbnNbXCJ3cml0ZVwiXSxcbiAgICAgICAgZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkID0gb3B0aW9uc1tcImRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZFwiXSB8fCBvcHRpb25zLmRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZCB8fCBudWxsLFxuICAgICAgICBkaXNwb3NlV2hlbk9wdGlvbiA9IG9wdGlvbnNbXCJkaXNwb3NlV2hlblwiXSB8fCBvcHRpb25zLmRpc3Bvc2VXaGVuLFxuICAgICAgICBkaXNwb3NlV2hlbiA9IGRpc3Bvc2VXaGVuT3B0aW9uLFxuICAgICAgICBkaXNwb3NlID0gZGlzcG9zZUNvbXB1dGVkLFxuICAgICAgICBfc3Vic2NyaXB0aW9uc1RvRGVwZW5kZW5jaWVzID0ge30sXG4gICAgICAgIF9kZXBlbmRlbmNpZXNDb3VudCA9IDAsXG4gICAgICAgIGV2YWx1YXRpb25UaW1lb3V0SW5zdGFuY2UgPSBudWxsO1xuXG4gICAgaWYgKCFldmFsdWF0b3JGdW5jdGlvblRhcmdldClcbiAgICAgICAgZXZhbHVhdG9yRnVuY3Rpb25UYXJnZXQgPSBvcHRpb25zW1wib3duZXJcIl07XG5cbiAgICBrby5zdWJzY3JpYmFibGUuY2FsbChkZXBlbmRlbnRPYnNlcnZhYmxlKTtcbiAgICBrby51dGlscy5zZXRQcm90b3R5cGVPZk9yRXh0ZW5kKGRlcGVuZGVudE9ic2VydmFibGUsIGtvLmRlcGVuZGVudE9ic2VydmFibGVbJ2ZuJ10pO1xuXG4gICAgZGVwZW5kZW50T2JzZXJ2YWJsZS5wZWVrID0gcGVlaztcbiAgICBkZXBlbmRlbnRPYnNlcnZhYmxlLmdldERlcGVuZGVuY2llc0NvdW50ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gX2RlcGVuZGVuY2llc0NvdW50OyB9O1xuICAgIGRlcGVuZGVudE9ic2VydmFibGUuaGFzV3JpdGVGdW5jdGlvbiA9IHR5cGVvZiBvcHRpb25zW1wid3JpdGVcIl0gPT09IFwiZnVuY3Rpb25cIjtcbiAgICBkZXBlbmRlbnRPYnNlcnZhYmxlLmRpc3Bvc2UgPSBmdW5jdGlvbiAoKSB7IGRpc3Bvc2UoKTsgfTtcbiAgICBkZXBlbmRlbnRPYnNlcnZhYmxlLmlzQWN0aXZlID0gaXNBY3RpdmU7XG5cbiAgICAvLyBSZXBsYWNlIHRoZSBsaW1pdCBmdW5jdGlvbiB3aXRoIG9uZSB0aGF0IGRlbGF5cyBldmFsdWF0aW9uIGFzIHdlbGwuXG4gICAgdmFyIG9yaWdpbmFsTGltaXQgPSBkZXBlbmRlbnRPYnNlcnZhYmxlLmxpbWl0O1xuICAgIGRlcGVuZGVudE9ic2VydmFibGUubGltaXQgPSBmdW5jdGlvbihsaW1pdEZ1bmN0aW9uKSB7XG4gICAgICAgIG9yaWdpbmFsTGltaXQuY2FsbChkZXBlbmRlbnRPYnNlcnZhYmxlLCBsaW1pdEZ1bmN0aW9uKTtcbiAgICAgICAgZGVwZW5kZW50T2JzZXJ2YWJsZS5fZXZhbFJhdGVMaW1pdGVkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkZXBlbmRlbnRPYnNlcnZhYmxlLl9yYXRlTGltaXRlZEJlZm9yZUNoYW5nZShfbGF0ZXN0VmFsdWUpO1xuXG4gICAgICAgICAgICBfbmVlZHNFdmFsdWF0aW9uID0gdHJ1ZTsgICAgLy8gTWFyayBhcyBkaXJ0eVxuXG4gICAgICAgICAgICAvLyBQYXNzIHRoZSBvYnNlcnZhYmxlIHRvIHRoZSByYXRlLWxpbWl0IGNvZGUsIHdoaWNoIHdpbGwgYWNjZXNzIGl0IHdoZW5cbiAgICAgICAgICAgIC8vIGl0J3MgdGltZSB0byBkbyB0aGUgbm90aWZpY2F0aW9uLlxuICAgICAgICAgICAgZGVwZW5kZW50T2JzZXJ2YWJsZS5fcmF0ZUxpbWl0ZWRDaGFuZ2UoZGVwZW5kZW50T2JzZXJ2YWJsZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKG9wdGlvbnNbJ3B1cmUnXSkge1xuICAgICAgICBwdXJlID0gdHJ1ZTtcbiAgICAgICAgaXNTbGVlcGluZyA9IHRydWU7ICAgICAvLyBTdGFydHMgb2ZmIHNsZWVwaW5nOyB3aWxsIGF3YWtlIG9uIHRoZSBmaXJzdCBzdWJzY3JpcHRpb25cbiAgICAgICAgZGVwZW5kZW50T2JzZXJ2YWJsZS5iZWZvcmVTdWJzY3JpcHRpb25BZGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBJZiBhc2xlZXAsIHdha2UgdXAgdGhlIGNvbXB1dGVkIGFuZCBldmFsdWF0ZSB0byByZWdpc3RlciBhbnkgZGVwZW5kZW5jaWVzLlxuICAgICAgICAgICAgaWYgKGlzU2xlZXBpbmcpIHtcbiAgICAgICAgICAgICAgICBpc1NsZWVwaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZXZhbHVhdGVJbW1lZGlhdGUodHJ1ZSAvKiBzdXBwcmVzc0NoYW5nZU5vdGlmaWNhdGlvbiAqLyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZGVwZW5kZW50T2JzZXJ2YWJsZS5hZnRlclN1YnNjcmlwdGlvblJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghZGVwZW5kZW50T2JzZXJ2YWJsZS5nZXRTdWJzY3JpcHRpb25zQ291bnQoKSkge1xuICAgICAgICAgICAgICAgIGRpc3Bvc2VBbGxTdWJzY3JpcHRpb25zVG9EZXBlbmRlbmNpZXMoKTtcbiAgICAgICAgICAgICAgICBpc1NsZWVwaW5nID0gX25lZWRzRXZhbHVhdGlvbiA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9wdGlvbnNbJ2RlZmVyRXZhbHVhdGlvbiddKSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCBmb3JjZSBhIGNvbXB1dGVkIHdpdGggZGVmZXJFdmFsdWF0aW9uIHRvIGV2YWx1YXRlIHdoZW4gdGhlIGZpcnN0IHN1YnNjcmlwdGlvbnMgaXMgcmVnaXN0ZXJlZC5cbiAgICAgICAgZGVwZW5kZW50T2JzZXJ2YWJsZS5iZWZvcmVTdWJzY3JpcHRpb25BZGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBwZWVrKCk7XG4gICAgICAgICAgICBkZWxldGUgZGVwZW5kZW50T2JzZXJ2YWJsZS5iZWZvcmVTdWJzY3JpcHRpb25BZGQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBrby5leHBvcnRQcm9wZXJ0eShkZXBlbmRlbnRPYnNlcnZhYmxlLCAncGVlaycsIGRlcGVuZGVudE9ic2VydmFibGUucGVlayk7XG4gICAga28uZXhwb3J0UHJvcGVydHkoZGVwZW5kZW50T2JzZXJ2YWJsZSwgJ2Rpc3Bvc2UnLCBkZXBlbmRlbnRPYnNlcnZhYmxlLmRpc3Bvc2UpO1xuICAgIGtvLmV4cG9ydFByb3BlcnR5KGRlcGVuZGVudE9ic2VydmFibGUsICdpc0FjdGl2ZScsIGRlcGVuZGVudE9ic2VydmFibGUuaXNBY3RpdmUpO1xuICAgIGtvLmV4cG9ydFByb3BlcnR5KGRlcGVuZGVudE9ic2VydmFibGUsICdnZXREZXBlbmRlbmNpZXNDb3VudCcsIGRlcGVuZGVudE9ic2VydmFibGUuZ2V0RGVwZW5kZW5jaWVzQ291bnQpO1xuXG4gICAgLy8gQWRkIGEgXCJkaXNwb3NlV2hlblwiIGNhbGxiYWNrIHRoYXQsIG9uIGVhY2ggZXZhbHVhdGlvbiwgZGlzcG9zZXMgaWYgdGhlIG5vZGUgd2FzIHJlbW92ZWQgd2l0aG91dCB1c2luZyBrby5yZW1vdmVOb2RlLlxuICAgIGlmIChkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQpIHtcbiAgICAgICAgLy8gU2luY2UgdGhpcyBjb21wdXRlZCBpcyBhc3NvY2lhdGVkIHdpdGggYSBET00gbm9kZSwgYW5kIHdlIGRvbid0IHdhbnQgdG8gZGlzcG9zZSB0aGUgY29tcHV0ZWRcbiAgICAgICAgLy8gdW50aWwgdGhlIERPTSBub2RlIGlzICpyZW1vdmVkKiBmcm9tIHRoZSBkb2N1bWVudCAoYXMgb3Bwb3NlZCB0byBuZXZlciBoYXZpbmcgYmVlbiBpbiB0aGUgZG9jdW1lbnQpLFxuICAgICAgICAvLyB3ZSdsbCBwcmV2ZW50IGRpc3Bvc2FsIHVudGlsIFwiZGlzcG9zZVdoZW5cIiBmaXJzdCByZXR1cm5zIGZhbHNlLlxuICAgICAgICBfc3VwcHJlc3NEaXNwb3NhbFVudGlsRGlzcG9zZVdoZW5SZXR1cm5zRmFsc2UgPSB0cnVlO1xuXG4gICAgICAgIC8vIE9ubHkgd2F0Y2ggZm9yIHRoZSBub2RlJ3MgZGlzcG9zYWwgaWYgdGhlIHZhbHVlIHJlYWxseSBpcyBhIG5vZGUuIEl0IG1pZ2h0IG5vdCBiZSxcbiAgICAgICAgLy8gZS5nLiwgeyBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IHRydWUgfSBjYW4gYmUgdXNlZCB0byBvcHQgaW50byB0aGUgXCJvbmx5IGRpc3Bvc2VcbiAgICAgICAgLy8gYWZ0ZXIgZmlyc3QgZmFsc2UgcmVzdWx0XCIgYmVoYXZpb3VyIGV2ZW4gaWYgdGhlcmUncyBubyBzcGVjaWZpYyBub2RlIHRvIHdhdGNoLiBUaGlzXG4gICAgICAgIC8vIHRlY2huaXF1ZSBpcyBpbnRlbmRlZCBmb3IgS08ncyBpbnRlcm5hbCB1c2Ugb25seSBhbmQgc2hvdWxkbid0IGJlIGRvY3VtZW50ZWQgb3IgdXNlZFxuICAgICAgICAvLyBieSBhcHBsaWNhdGlvbiBjb2RlLCBhcyBpdCdzIGxpa2VseSB0byBjaGFuZ2UgaW4gYSBmdXR1cmUgdmVyc2lvbiBvZiBLTy5cbiAgICAgICAgaWYgKGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZC5ub2RlVHlwZSkge1xuICAgICAgICAgICAgZGlzcG9zZVdoZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICFrby51dGlscy5kb21Ob2RlSXNBdHRhY2hlZFRvRG9jdW1lbnQoZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkKSB8fCAoZGlzcG9zZVdoZW5PcHRpb24gJiYgZGlzcG9zZVdoZW5PcHRpb24oKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gRXZhbHVhdGUsIHVubGVzcyBzbGVlcGluZyBvciBkZWZlckV2YWx1YXRpb24gaXMgdHJ1ZVxuICAgIGlmICghaXNTbGVlcGluZyAmJiAhb3B0aW9uc1snZGVmZXJFdmFsdWF0aW9uJ10pXG4gICAgICAgIGV2YWx1YXRlSW1tZWRpYXRlKCk7XG5cbiAgICAvLyBBdHRhY2ggYSBET00gbm9kZSBkaXNwb3NhbCBjYWxsYmFjayBzbyB0aGF0IHRoZSBjb21wdXRlZCB3aWxsIGJlIHByb2FjdGl2ZWx5IGRpc3Bvc2VkIGFzIHNvb24gYXMgdGhlIG5vZGUgaXNcbiAgICAvLyByZW1vdmVkIHVzaW5nIGtvLnJlbW92ZU5vZGUuIEJ1dCBza2lwIGlmIGlzQWN0aXZlIGlzIGZhbHNlICh0aGVyZSB3aWxsIG5ldmVyIGJlIGFueSBkZXBlbmRlbmNpZXMgdG8gZGlzcG9zZSkuXG4gICAgaWYgKGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZCAmJiBpc0FjdGl2ZSgpICYmIGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZC5ub2RlVHlwZSkge1xuICAgICAgICBkaXNwb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwucmVtb3ZlRGlzcG9zZUNhbGxiYWNrKGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZCwgZGlzcG9zZSk7XG4gICAgICAgICAgICBkaXNwb3NlQ29tcHV0ZWQoKTtcbiAgICAgICAgfTtcbiAgICAgICAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQsIGRpc3Bvc2UpO1xuICAgIH1cblxuICAgIHJldHVybiBkZXBlbmRlbnRPYnNlcnZhYmxlO1xufTtcblxua28uaXNDb21wdXRlZCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gICAgcmV0dXJuIGtvLmhhc1Byb3RvdHlwZShpbnN0YW5jZSwga28uZGVwZW5kZW50T2JzZXJ2YWJsZSk7XG59O1xuXG52YXIgcHJvdG9Qcm9wID0ga28ub2JzZXJ2YWJsZS5wcm90b1Byb3BlcnR5OyAvLyA9PSBcIl9fa29fcHJvdG9fX1wiXG5rby5kZXBlbmRlbnRPYnNlcnZhYmxlW3Byb3RvUHJvcF0gPSBrby5vYnNlcnZhYmxlO1xuXG5rby5kZXBlbmRlbnRPYnNlcnZhYmxlWydmbiddID0ge1xuICAgIFwiZXF1YWxpdHlDb21wYXJlclwiOiB2YWx1ZXNBcmVQcmltaXRpdmVBbmRFcXVhbFxufTtcbmtvLmRlcGVuZGVudE9ic2VydmFibGVbJ2ZuJ11bcHJvdG9Qcm9wXSA9IGtvLmRlcGVuZGVudE9ic2VydmFibGU7XG5cbi8vIE5vdGUgdGhhdCBmb3IgYnJvd3NlcnMgdGhhdCBkb24ndCBzdXBwb3J0IHByb3RvIGFzc2lnbm1lbnQsIHRoZVxuLy8gaW5oZXJpdGFuY2UgY2hhaW4gaXMgY3JlYXRlZCBtYW51YWxseSBpbiB0aGUga28uZGVwZW5kZW50T2JzZXJ2YWJsZSBjb25zdHJ1Y3RvclxuaWYgKGtvLnV0aWxzLmNhblNldFByb3RvdHlwZSkge1xuICAgIGtvLnV0aWxzLnNldFByb3RvdHlwZU9mKGtvLmRlcGVuZGVudE9ic2VydmFibGVbJ2ZuJ10sIGtvLnN1YnNjcmliYWJsZVsnZm4nXSk7XG59XG5cbmtvLmV4cG9ydFN5bWJvbCgnZGVwZW5kZW50T2JzZXJ2YWJsZScsIGtvLmRlcGVuZGVudE9ic2VydmFibGUpO1xua28uZXhwb3J0U3ltYm9sKCdjb21wdXRlZCcsIGtvLmRlcGVuZGVudE9ic2VydmFibGUpOyAvLyBNYWtlIFwia28uY29tcHV0ZWRcIiBhbiBhbGlhcyBmb3IgXCJrby5kZXBlbmRlbnRPYnNlcnZhYmxlXCJcbmtvLmV4cG9ydFN5bWJvbCgnaXNDb21wdXRlZCcsIGtvLmlzQ29tcHV0ZWQpO1xuXG5rby5wdXJlQ29tcHV0ZWQgPSBmdW5jdGlvbiAoZXZhbHVhdG9yRnVuY3Rpb25Pck9wdGlvbnMsIGV2YWx1YXRvckZ1bmN0aW9uVGFyZ2V0KSB7XG4gICAgaWYgKHR5cGVvZiBldmFsdWF0b3JGdW5jdGlvbk9yT3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4ga28uY29tcHV0ZWQoZXZhbHVhdG9yRnVuY3Rpb25Pck9wdGlvbnMsIGV2YWx1YXRvckZ1bmN0aW9uVGFyZ2V0LCB7J3B1cmUnOnRydWV9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBldmFsdWF0b3JGdW5jdGlvbk9yT3B0aW9ucyA9IGtvLnV0aWxzLmV4dGVuZCh7fSwgZXZhbHVhdG9yRnVuY3Rpb25Pck9wdGlvbnMpOyAgIC8vIG1ha2UgYSBjb3B5IG9mIHRoZSBwYXJhbWV0ZXIgb2JqZWN0XG4gICAgICAgIGV2YWx1YXRvckZ1bmN0aW9uT3JPcHRpb25zWydwdXJlJ10gPSB0cnVlO1xuICAgICAgICByZXR1cm4ga28uY29tcHV0ZWQoZXZhbHVhdG9yRnVuY3Rpb25Pck9wdGlvbnMsIGV2YWx1YXRvckZ1bmN0aW9uVGFyZ2V0KTtcbiAgICB9XG59XG5rby5leHBvcnRTeW1ib2woJ3B1cmVDb21wdXRlZCcsIGtvLnB1cmVDb21wdXRlZCk7XG5cbihmdW5jdGlvbigpIHtcbiAgICB2YXIgbWF4TmVzdGVkT2JzZXJ2YWJsZURlcHRoID0gMTA7IC8vIEVzY2FwZSB0aGUgKHVubGlrZWx5KSBwYXRoYWxvZ2ljYWwgY2FzZSB3aGVyZSBhbiBvYnNlcnZhYmxlJ3MgY3VycmVudCB2YWx1ZSBpcyBpdHNlbGYgKG9yIHNpbWlsYXIgcmVmZXJlbmNlIGN5Y2xlKVxuXG4gICAga28udG9KUyA9IGZ1bmN0aW9uKHJvb3RPYmplY3QpIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIldoZW4gY2FsbGluZyBrby50b0pTLCBwYXNzIHRoZSBvYmplY3QgeW91IHdhbnQgdG8gY29udmVydC5cIik7XG5cbiAgICAgICAgLy8gV2UganVzdCB1bndyYXAgZXZlcnl0aGluZyBhdCBldmVyeSBsZXZlbCBpbiB0aGUgb2JqZWN0IGdyYXBoXG4gICAgICAgIHJldHVybiBtYXBKc09iamVjdEdyYXBoKHJvb3RPYmplY3QsIGZ1bmN0aW9uKHZhbHVlVG9NYXApIHtcbiAgICAgICAgICAgIC8vIExvb3AgYmVjYXVzZSBhbiBvYnNlcnZhYmxlJ3MgdmFsdWUgbWlnaHQgaW4gdHVybiBiZSBhbm90aGVyIG9ic2VydmFibGUgd3JhcHBlclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGtvLmlzT2JzZXJ2YWJsZSh2YWx1ZVRvTWFwKSAmJiAoaSA8IG1heE5lc3RlZE9ic2VydmFibGVEZXB0aCk7IGkrKylcbiAgICAgICAgICAgICAgICB2YWx1ZVRvTWFwID0gdmFsdWVUb01hcCgpO1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlVG9NYXA7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBrby50b0pTT04gPSBmdW5jdGlvbihyb290T2JqZWN0LCByZXBsYWNlciwgc3BhY2UpIHsgICAgIC8vIHJlcGxhY2VyIGFuZCBzcGFjZSBhcmUgb3B0aW9uYWxcbiAgICAgICAgdmFyIHBsYWluSmF2YVNjcmlwdE9iamVjdCA9IGtvLnRvSlMocm9vdE9iamVjdCk7XG4gICAgICAgIHJldHVybiBrby51dGlscy5zdHJpbmdpZnlKc29uKHBsYWluSmF2YVNjcmlwdE9iamVjdCwgcmVwbGFjZXIsIHNwYWNlKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gbWFwSnNPYmplY3RHcmFwaChyb290T2JqZWN0LCBtYXBJbnB1dENhbGxiYWNrLCB2aXNpdGVkT2JqZWN0cykge1xuICAgICAgICB2aXNpdGVkT2JqZWN0cyA9IHZpc2l0ZWRPYmplY3RzIHx8IG5ldyBvYmplY3RMb29rdXAoKTtcblxuICAgICAgICByb290T2JqZWN0ID0gbWFwSW5wdXRDYWxsYmFjayhyb290T2JqZWN0KTtcbiAgICAgICAgdmFyIGNhbkhhdmVQcm9wZXJ0aWVzID0gKHR5cGVvZiByb290T2JqZWN0ID09IFwib2JqZWN0XCIpICYmIChyb290T2JqZWN0ICE9PSBudWxsKSAmJiAocm9vdE9iamVjdCAhPT0gdW5kZWZpbmVkKSAmJiAoIShyb290T2JqZWN0IGluc3RhbmNlb2YgRGF0ZSkpICYmICghKHJvb3RPYmplY3QgaW5zdGFuY2VvZiBTdHJpbmcpKSAmJiAoIShyb290T2JqZWN0IGluc3RhbmNlb2YgTnVtYmVyKSkgJiYgKCEocm9vdE9iamVjdCBpbnN0YW5jZW9mIEJvb2xlYW4pKTtcbiAgICAgICAgaWYgKCFjYW5IYXZlUHJvcGVydGllcylcbiAgICAgICAgICAgIHJldHVybiByb290T2JqZWN0O1xuXG4gICAgICAgIHZhciBvdXRwdXRQcm9wZXJ0aWVzID0gcm9vdE9iamVjdCBpbnN0YW5jZW9mIEFycmF5ID8gW10gOiB7fTtcbiAgICAgICAgdmlzaXRlZE9iamVjdHMuc2F2ZShyb290T2JqZWN0LCBvdXRwdXRQcm9wZXJ0aWVzKTtcblxuICAgICAgICB2aXNpdFByb3BlcnRpZXNPckFycmF5RW50cmllcyhyb290T2JqZWN0LCBmdW5jdGlvbihpbmRleGVyKSB7XG4gICAgICAgICAgICB2YXIgcHJvcGVydHlWYWx1ZSA9IG1hcElucHV0Q2FsbGJhY2socm9vdE9iamVjdFtpbmRleGVyXSk7XG5cbiAgICAgICAgICAgIHN3aXRjaCAodHlwZW9mIHByb3BlcnR5VmFsdWUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgICAgICAgICAgICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgICAgICAgICAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICAgICAgICAgICAgY2FzZSBcImZ1bmN0aW9uXCI6XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dFByb3BlcnRpZXNbaW5kZXhlcl0gPSBwcm9wZXJ0eVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICAgICAgICAgICAgY2FzZSBcInVuZGVmaW5lZFwiOlxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJldmlvdXNseU1hcHBlZFZhbHVlID0gdmlzaXRlZE9iamVjdHMuZ2V0KHByb3BlcnR5VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXRQcm9wZXJ0aWVzW2luZGV4ZXJdID0gKHByZXZpb3VzbHlNYXBwZWRWYWx1ZSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgPyBwcmV2aW91c2x5TWFwcGVkVmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIDogbWFwSnNPYmplY3RHcmFwaChwcm9wZXJ0eVZhbHVlLCBtYXBJbnB1dENhbGxiYWNrLCB2aXNpdGVkT2JqZWN0cyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gb3V0cHV0UHJvcGVydGllcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2aXNpdFByb3BlcnRpZXNPckFycmF5RW50cmllcyhyb290T2JqZWN0LCB2aXNpdG9yQ2FsbGJhY2spIHtcbiAgICAgICAgaWYgKHJvb3RPYmplY3QgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByb290T2JqZWN0Lmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgICAgIHZpc2l0b3JDYWxsYmFjayhpKTtcblxuICAgICAgICAgICAgLy8gRm9yIGFycmF5cywgYWxzbyByZXNwZWN0IHRvSlNPTiBwcm9wZXJ0eSBmb3IgY3VzdG9tIG1hcHBpbmdzIChmaXhlcyAjMjc4KVxuICAgICAgICAgICAgaWYgKHR5cGVvZiByb290T2JqZWN0Wyd0b0pTT04nXSA9PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgICAgIHZpc2l0b3JDYWxsYmFjaygndG9KU09OJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eU5hbWUgaW4gcm9vdE9iamVjdCkge1xuICAgICAgICAgICAgICAgIHZpc2l0b3JDYWxsYmFjayhwcm9wZXJ0eU5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIG9iamVjdExvb2t1cCgpIHtcbiAgICAgICAgdGhpcy5rZXlzID0gW107XG4gICAgICAgIHRoaXMudmFsdWVzID0gW107XG4gICAgfTtcblxuICAgIG9iamVjdExvb2t1cC5wcm90b3R5cGUgPSB7XG4gICAgICAgIGNvbnN0cnVjdG9yOiBvYmplY3RMb29rdXAsXG4gICAgICAgIHNhdmU6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBleGlzdGluZ0luZGV4ID0ga28udXRpbHMuYXJyYXlJbmRleE9mKHRoaXMua2V5cywga2V5KTtcbiAgICAgICAgICAgIGlmIChleGlzdGluZ0luZGV4ID49IDApXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZXNbZXhpc3RpbmdJbmRleF0gPSB2YWx1ZTtcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMua2V5cy5wdXNoKGtleSk7XG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZXMucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGdldDogZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICB2YXIgZXhpc3RpbmdJbmRleCA9IGtvLnV0aWxzLmFycmF5SW5kZXhPZih0aGlzLmtleXMsIGtleSk7XG4gICAgICAgICAgICByZXR1cm4gKGV4aXN0aW5nSW5kZXggPj0gMCkgPyB0aGlzLnZhbHVlc1tleGlzdGluZ0luZGV4XSA6IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuXG5rby5leHBvcnRTeW1ib2woJ3RvSlMnLCBrby50b0pTKTtcbmtvLmV4cG9ydFN5bWJvbCgndG9KU09OJywga28udG9KU09OKTtcbihmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGhhc0RvbURhdGFFeHBhbmRvUHJvcGVydHkgPSAnX19rb19faGFzRG9tRGF0YU9wdGlvblZhbHVlX18nO1xuXG4gICAgLy8gTm9ybWFsbHksIFNFTEVDVCBlbGVtZW50cyBhbmQgdGhlaXIgT1BUSU9OcyBjYW4gb25seSB0YWtlIHZhbHVlIG9mIHR5cGUgJ3N0cmluZycgKGJlY2F1c2UgdGhlIHZhbHVlc1xuICAgIC8vIGFyZSBzdG9yZWQgb24gRE9NIGF0dHJpYnV0ZXMpLiBrby5zZWxlY3RFeHRlbnNpb25zIHByb3ZpZGVzIGEgd2F5IGZvciBTRUxFQ1RzL09QVElPTnMgdG8gaGF2ZSB2YWx1ZXNcbiAgICAvLyB0aGF0IGFyZSBhcmJpdHJhcnkgb2JqZWN0cy4gVGhpcyBpcyB2ZXJ5IGNvbnZlbmllbnQgd2hlbiBpbXBsZW1lbnRpbmcgdGhpbmdzIGxpa2UgY2FzY2FkaW5nIGRyb3Bkb3ducy5cbiAgICBrby5zZWxlY3RFeHRlbnNpb25zID0ge1xuICAgICAgICByZWFkVmFsdWUgOiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGtvLnV0aWxzLnRhZ05hbWVMb3dlcihlbGVtZW50KSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ29wdGlvbic6XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50W2hhc0RvbURhdGFFeHBhbmRvUHJvcGVydHldID09PSB0cnVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtvLnV0aWxzLmRvbURhdGEuZ2V0KGVsZW1lbnQsIGtvLmJpbmRpbmdIYW5kbGVycy5vcHRpb25zLm9wdGlvblZhbHVlRG9tRGF0YUtleSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrby51dGlscy5pZVZlcnNpb24gPD0gN1xuICAgICAgICAgICAgICAgICAgICAgICAgPyAoZWxlbWVudC5nZXRBdHRyaWJ1dGVOb2RlKCd2YWx1ZScpICYmIGVsZW1lbnQuZ2V0QXR0cmlidXRlTm9kZSgndmFsdWUnKS5zcGVjaWZpZWQgPyBlbGVtZW50LnZhbHVlIDogZWxlbWVudC50ZXh0KVxuICAgICAgICAgICAgICAgICAgICAgICAgOiBlbGVtZW50LnZhbHVlO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50LnNlbGVjdGVkSW5kZXggPj0gMCA/IGtvLnNlbGVjdEV4dGVuc2lvbnMucmVhZFZhbHVlKGVsZW1lbnQub3B0aW9uc1tlbGVtZW50LnNlbGVjdGVkSW5kZXhdKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudC52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICB3cml0ZVZhbHVlOiBmdW5jdGlvbihlbGVtZW50LCB2YWx1ZSwgYWxsb3dVbnNldCkge1xuICAgICAgICAgICAgc3dpdGNoIChrby51dGlscy50YWdOYW1lTG93ZXIoZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdvcHRpb24nOlxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2godHlwZW9mIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga28udXRpbHMuZG9tRGF0YS5zZXQoZWxlbWVudCwga28uYmluZGluZ0hhbmRsZXJzLm9wdGlvbnMub3B0aW9uVmFsdWVEb21EYXRhS2V5LCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNEb21EYXRhRXhwYW5kb1Byb3BlcnR5IGluIGVsZW1lbnQpIHsgLy8gSUUgPD0gOCB0aHJvd3MgZXJyb3JzIGlmIHlvdSBkZWxldGUgbm9uLWV4aXN0ZW50IHByb3BlcnRpZXMgZnJvbSBhIERPTSBub2RlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBlbGVtZW50W2hhc0RvbURhdGFFeHBhbmRvUHJvcGVydHldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN0b3JlIGFyYml0cmFyeSBvYmplY3QgdXNpbmcgRG9tRGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtvLnV0aWxzLmRvbURhdGEuc2V0KGVsZW1lbnQsIGtvLmJpbmRpbmdIYW5kbGVycy5vcHRpb25zLm9wdGlvblZhbHVlRG9tRGF0YUtleSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRbaGFzRG9tRGF0YUV4cGFuZG9Qcm9wZXJ0eV0gPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3BlY2lhbCB0cmVhdG1lbnQgb2YgbnVtYmVycyBpcyBqdXN0IGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LiBLTyAxLjIuMSB3cm90ZSBudW1lcmljYWwgdmFsdWVzIHRvIGVsZW1lbnQudmFsdWUuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC52YWx1ZSA9IHR5cGVvZiB2YWx1ZSA9PT0gXCJudW1iZXJcIiA/IHZhbHVlIDogXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IFwiXCIgfHwgdmFsdWUgPT09IG51bGwpICAgICAgIC8vIEEgYmxhbmsgc3RyaW5nIG9yIG51bGwgdmFsdWUgd2lsbCBzZWxlY3QgdGhlIGNhcHRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZWN0aW9uID0gLTE7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBuID0gZWxlbWVudC5vcHRpb25zLmxlbmd0aCwgb3B0aW9uVmFsdWU7IGkgPCBuOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvblZhbHVlID0ga28uc2VsZWN0RXh0ZW5zaW9ucy5yZWFkVmFsdWUoZWxlbWVudC5vcHRpb25zW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEluY2x1ZGUgc3BlY2lhbCBjaGVjayB0byBoYW5kbGUgc2VsZWN0aW5nIGEgY2FwdGlvbiB3aXRoIGEgYmxhbmsgc3RyaW5nIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9uVmFsdWUgPT0gdmFsdWUgfHwgKG9wdGlvblZhbHVlID09IFwiXCIgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb24gPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbGxvd1Vuc2V0IHx8IHNlbGVjdGlvbiA+PSAwIHx8ICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmIGVsZW1lbnQuc2l6ZSA+IDEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNlbGVjdGVkSW5kZXggPSBzZWxlY3Rpb247XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCh2YWx1ZSA9PT0gbnVsbCkgfHwgKHZhbHVlID09PSB1bmRlZmluZWQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG5cbmtvLmV4cG9ydFN5bWJvbCgnc2VsZWN0RXh0ZW5zaW9ucycsIGtvLnNlbGVjdEV4dGVuc2lvbnMpO1xua28uZXhwb3J0U3ltYm9sKCdzZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZScsIGtvLnNlbGVjdEV4dGVuc2lvbnMucmVhZFZhbHVlKTtcbmtvLmV4cG9ydFN5bWJvbCgnc2VsZWN0RXh0ZW5zaW9ucy53cml0ZVZhbHVlJywga28uc2VsZWN0RXh0ZW5zaW9ucy53cml0ZVZhbHVlKTtcbmtvLmV4cHJlc3Npb25SZXdyaXRpbmcgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBqYXZhU2NyaXB0UmVzZXJ2ZWRXb3JkcyA9IFtcInRydWVcIiwgXCJmYWxzZVwiLCBcIm51bGxcIiwgXCJ1bmRlZmluZWRcIl07XG5cbiAgICAvLyBNYXRjaGVzIHNvbWV0aGluZyB0aGF0IGNhbiBiZSBhc3NpZ25lZCB0by0tZWl0aGVyIGFuIGlzb2xhdGVkIGlkZW50aWZpZXIgb3Igc29tZXRoaW5nIGVuZGluZyB3aXRoIGEgcHJvcGVydHkgYWNjZXNzb3JcbiAgICAvLyBUaGlzIGlzIGRlc2lnbmVkIHRvIGJlIHNpbXBsZSBhbmQgYXZvaWQgZmFsc2UgbmVnYXRpdmVzLCBidXQgY291bGQgcHJvZHVjZSBmYWxzZSBwb3NpdGl2ZXMgKGUuZy4sIGErYi5jKS5cbiAgICAvLyBUaGlzIGFsc28gd2lsbCBub3QgcHJvcGVybHkgaGFuZGxlIG5lc3RlZCBicmFja2V0cyAoZS5nLiwgb2JqMVtvYmoyWydwcm9wJ11dOyBzZWUgIzkxMSkuXG4gICAgdmFyIGphdmFTY3JpcHRBc3NpZ25tZW50VGFyZ2V0ID0gL14oPzpbJF9hLXpdWyRcXHddKnwoLispKFxcLlxccypbJF9hLXpdWyRcXHddKnxcXFsuK1xcXSkpJC9pO1xuXG4gICAgZnVuY3Rpb24gZ2V0V3JpdGVhYmxlVmFsdWUoZXhwcmVzc2lvbikge1xuICAgICAgICBpZiAoa28udXRpbHMuYXJyYXlJbmRleE9mKGphdmFTY3JpcHRSZXNlcnZlZFdvcmRzLCBleHByZXNzaW9uKSA+PSAwKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB2YXIgbWF0Y2ggPSBleHByZXNzaW9uLm1hdGNoKGphdmFTY3JpcHRBc3NpZ25tZW50VGFyZ2V0KTtcbiAgICAgICAgcmV0dXJuIG1hdGNoID09PSBudWxsID8gZmFsc2UgOiBtYXRjaFsxXSA/ICgnT2JqZWN0KCcgKyBtYXRjaFsxXSArICcpJyArIG1hdGNoWzJdKSA6IGV4cHJlc3Npb247XG4gICAgfVxuXG4gICAgLy8gVGhlIGZvbGxvd2luZyByZWd1bGFyIGV4cHJlc3Npb25zIHdpbGwgYmUgdXNlZCB0byBzcGxpdCBhbiBvYmplY3QtbGl0ZXJhbCBzdHJpbmcgaW50byB0b2tlbnNcblxuICAgICAgICAvLyBUaGVzZSB0d28gbWF0Y2ggc3RyaW5ncywgZWl0aGVyIHdpdGggZG91YmxlIHF1b3RlcyBvciBzaW5nbGUgcXVvdGVzXG4gICAgdmFyIHN0cmluZ0RvdWJsZSA9ICdcIig/OlteXCJcXFxcXFxcXF18XFxcXFxcXFwuKSpcIicsXG4gICAgICAgIHN0cmluZ1NpbmdsZSA9IFwiJyg/OlteJ1xcXFxcXFxcXXxcXFxcXFxcXC4pKidcIixcbiAgICAgICAgLy8gTWF0Y2hlcyBhIHJlZ3VsYXIgZXhwcmVzc2lvbiAodGV4dCBlbmNsb3NlZCBieSBzbGFzaGVzKSwgYnV0IHdpbGwgYWxzbyBtYXRjaCBzZXRzIG9mIGRpdmlzaW9uc1xuICAgICAgICAvLyBhcyBhIHJlZ3VsYXIgZXhwcmVzc2lvbiAodGhpcyBpcyBoYW5kbGVkIGJ5IHRoZSBwYXJzaW5nIGxvb3AgYmVsb3cpLlxuICAgICAgICBzdHJpbmdSZWdleHAgPSAnLyg/OlteL1xcXFxcXFxcXXxcXFxcXFxcXC4pKi9cXHcqJyxcbiAgICAgICAgLy8gVGhlc2UgY2hhcmFjdGVycyBoYXZlIHNwZWNpYWwgbWVhbmluZyB0byB0aGUgcGFyc2VyIGFuZCBtdXN0IG5vdCBhcHBlYXIgaW4gdGhlIG1pZGRsZSBvZiBhXG4gICAgICAgIC8vIHRva2VuLCBleGNlcHQgYXMgcGFydCBvZiBhIHN0cmluZy5cbiAgICAgICAgc3BlY2lhbHMgPSAnLFwiXFwne30oKS86W1xcXFxdJyxcbiAgICAgICAgLy8gTWF0Y2ggdGV4dCAoYXQgbGVhc3QgdHdvIGNoYXJhY3RlcnMpIHRoYXQgZG9lcyBub3QgY29udGFpbiBhbnkgb2YgdGhlIGFib3ZlIHNwZWNpYWwgY2hhcmFjdGVycyxcbiAgICAgICAgLy8gYWx0aG91Z2ggc29tZSBvZiB0aGUgc3BlY2lhbCBjaGFyYWN0ZXJzIGFyZSBhbGxvd2VkIHRvIHN0YXJ0IGl0IChhbGwgYnV0IHRoZSBjb2xvbiBhbmQgY29tbWEpLlxuICAgICAgICAvLyBUaGUgdGV4dCBjYW4gY29udGFpbiBzcGFjZXMsIGJ1dCBsZWFkaW5nIG9yIHRyYWlsaW5nIHNwYWNlcyBhcmUgc2tpcHBlZC5cbiAgICAgICAgZXZlcnlUaGluZ0Vsc2UgPSAnW15cXFxcczosL11bXicgKyBzcGVjaWFscyArICddKlteXFxcXHMnICsgc3BlY2lhbHMgKyAnXScsXG4gICAgICAgIC8vIE1hdGNoIGFueSBub24tc3BhY2UgY2hhcmFjdGVyIG5vdCBtYXRjaGVkIGFscmVhZHkuIFRoaXMgd2lsbCBtYXRjaCBjb2xvbnMgYW5kIGNvbW1hcywgc2luY2UgdGhleSdyZVxuICAgICAgICAvLyBub3QgbWF0Y2hlZCBieSBcImV2ZXJ5VGhpbmdFbHNlXCIsIGJ1dCB3aWxsIGFsc28gbWF0Y2ggYW55IG90aGVyIHNpbmdsZSBjaGFyYWN0ZXIgdGhhdCB3YXNuJ3QgYWxyZWFkeVxuICAgICAgICAvLyBtYXRjaGVkIChmb3IgZXhhbXBsZTogaW4gXCJhOiAxLCBiOiAyXCIsIGVhY2ggb2YgdGhlIG5vbi1zcGFjZSBjaGFyYWN0ZXJzIHdpbGwgYmUgbWF0Y2hlZCBieSBvbmVOb3RTcGFjZSkuXG4gICAgICAgIG9uZU5vdFNwYWNlID0gJ1teXFxcXHNdJyxcblxuICAgICAgICAvLyBDcmVhdGUgdGhlIGFjdHVhbCByZWd1bGFyIGV4cHJlc3Npb24gYnkgb3ItaW5nIHRoZSBhYm92ZSBzdHJpbmdzLiBUaGUgb3JkZXIgaXMgaW1wb3J0YW50LlxuICAgICAgICBiaW5kaW5nVG9rZW4gPSBSZWdFeHAoc3RyaW5nRG91YmxlICsgJ3wnICsgc3RyaW5nU2luZ2xlICsgJ3wnICsgc3RyaW5nUmVnZXhwICsgJ3wnICsgZXZlcnlUaGluZ0Vsc2UgKyAnfCcgKyBvbmVOb3RTcGFjZSwgJ2cnKSxcblxuICAgICAgICAvLyBNYXRjaCBlbmQgb2YgcHJldmlvdXMgdG9rZW4gdG8gZGV0ZXJtaW5lIHdoZXRoZXIgYSBzbGFzaCBpcyBhIGRpdmlzaW9uIG9yIHJlZ2V4LlxuICAgICAgICBkaXZpc2lvbkxvb2tCZWhpbmQgPSAvW1xcXSlcIidBLVphLXowLTlfJF0rJC8sXG4gICAgICAgIGtleXdvcmRSZWdleExvb2tCZWhpbmQgPSB7J2luJzoxLCdyZXR1cm4nOjEsJ3R5cGVvZic6MX07XG5cbiAgICBmdW5jdGlvbiBwYXJzZU9iamVjdExpdGVyYWwob2JqZWN0TGl0ZXJhbFN0cmluZykge1xuICAgICAgICAvLyBUcmltIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHNwYWNlcyBmcm9tIHRoZSBzdHJpbmdcbiAgICAgICAgdmFyIHN0ciA9IGtvLnV0aWxzLnN0cmluZ1RyaW0ob2JqZWN0TGl0ZXJhbFN0cmluZyk7XG5cbiAgICAgICAgLy8gVHJpbSBicmFjZXMgJ3snIHN1cnJvdW5kaW5nIHRoZSB3aG9sZSBvYmplY3QgbGl0ZXJhbFxuICAgICAgICBpZiAoc3RyLmNoYXJDb2RlQXQoMCkgPT09IDEyMykgc3RyID0gc3RyLnNsaWNlKDEsIC0xKTtcblxuICAgICAgICAvLyBTcGxpdCBpbnRvIHRva2Vuc1xuICAgICAgICB2YXIgcmVzdWx0ID0gW10sIHRva3MgPSBzdHIubWF0Y2goYmluZGluZ1Rva2VuKSwga2V5LCB2YWx1ZXMsIGRlcHRoID0gMDtcblxuICAgICAgICBpZiAodG9rcykge1xuICAgICAgICAgICAgLy8gQXBwZW5kIGEgY29tbWEgc28gdGhhdCB3ZSBkb24ndCBuZWVkIGEgc2VwYXJhdGUgY29kZSBibG9jayB0byBkZWFsIHdpdGggdGhlIGxhc3QgaXRlbVxuICAgICAgICAgICAgdG9rcy5wdXNoKCcsJyk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCB0b2s7IHRvayA9IHRva3NbaV07ICsraSkge1xuICAgICAgICAgICAgICAgIHZhciBjID0gdG9rLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgICAgICAgICAgLy8gQSBjb21tYSBzaWduYWxzIHRoZSBlbmQgb2YgYSBrZXkvdmFsdWUgcGFpciBpZiBkZXB0aCBpcyB6ZXJvXG4gICAgICAgICAgICAgICAgaWYgKGMgPT09IDQ0KSB7IC8vIFwiLFwiXG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXB0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2V5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlcyA/IHtrZXk6IGtleSwgdmFsdWU6IHZhbHVlcy5qb2luKCcnKX0gOiB7J3Vua25vd24nOiBrZXl9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IHZhbHVlcyA9IGRlcHRoID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gU2ltcGx5IHNraXAgdGhlIGNvbG9uIHRoYXQgc2VwYXJhdGVzIHRoZSBuYW1lIGFuZCB2YWx1ZVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gNTgpIHsgLy8gXCI6XCJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF2YWx1ZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAvLyBBIHNldCBvZiBzbGFzaGVzIGlzIGluaXRpYWxseSBtYXRjaGVkIGFzIGEgcmVndWxhciBleHByZXNzaW9uLCBidXQgY291bGQgYmUgZGl2aXNpb25cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09IDQ3ICYmIGkgJiYgdG9rLmxlbmd0aCA+IDEpIHsgIC8vIFwiL1wiXG4gICAgICAgICAgICAgICAgICAgIC8vIExvb2sgYXQgdGhlIGVuZCBvZiB0aGUgcHJldmlvdXMgdG9rZW4gdG8gZGV0ZXJtaW5lIGlmIHRoZSBzbGFzaCBpcyBhY3R1YWxseSBkaXZpc2lvblxuICAgICAgICAgICAgICAgICAgICB2YXIgbWF0Y2ggPSB0b2tzW2ktMV0ubWF0Y2goZGl2aXNpb25Mb29rQmVoaW5kKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoICYmICFrZXl3b3JkUmVnZXhMb29rQmVoaW5kW21hdGNoWzBdXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIHNsYXNoIGlzIGFjdHVhbGx5IGEgZGl2aXNpb24gcHVuY3R1YXRvcjsgcmUtcGFyc2UgdGhlIHJlbWFpbmRlciBvZiB0aGUgc3RyaW5nIChub3QgaW5jbHVkaW5nIHRoZSBzbGFzaClcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ciA9IHN0ci5zdWJzdHIoc3RyLmluZGV4T2YodG9rKSArIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9rcyA9IHN0ci5tYXRjaChiaW5kaW5nVG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9rcy5wdXNoKCcsJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpID0gLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDb250aW51ZSB3aXRoIGp1c3QgdGhlIHNsYXNoXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2sgPSAnLyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBJbmNyZW1lbnQgZGVwdGggZm9yIHBhcmVudGhlc2VzLCBicmFjZXMsIGFuZCBicmFja2V0cyBzbyB0aGF0IGludGVyaW9yIGNvbW1hcyBhcmUgaWdub3JlZFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gNDAgfHwgYyA9PT0gMTIzIHx8IGMgPT09IDkxKSB7IC8vICcoJywgJ3snLCAnWydcbiAgICAgICAgICAgICAgICAgICAgKytkZXB0aDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09IDQxIHx8IGMgPT09IDEyNSB8fCBjID09PSA5MykgeyAvLyAnKScsICd9JywgJ10nXG4gICAgICAgICAgICAgICAgICAgIC0tZGVwdGg7XG4gICAgICAgICAgICAgICAgLy8gVGhlIGtleSBtdXN0IGJlIGEgc2luZ2xlIHRva2VuOyBpZiBpdCdzIGEgc3RyaW5nLCB0cmltIHRoZSBxdW90ZXNcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFrZXkgJiYgIXZhbHVlcykge1xuICAgICAgICAgICAgICAgICAgICBrZXkgPSAoYyA9PT0gMzQgfHwgYyA9PT0gMzkpIC8qICdcIicsIFwiJ1wiICovID8gdG9rLnNsaWNlKDEsIC0xKSA6IHRvaztcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZXMpXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKHRvayk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXMgPSBbdG9rXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8vIFR3by13YXkgYmluZGluZ3MgaW5jbHVkZSBhIHdyaXRlIGZ1bmN0aW9uIHRoYXQgYWxsb3cgdGhlIGhhbmRsZXIgdG8gdXBkYXRlIHRoZSB2YWx1ZSBldmVuIGlmIGl0J3Mgbm90IGFuIG9ic2VydmFibGUuXG4gICAgdmFyIHR3b1dheUJpbmRpbmdzID0ge307XG5cbiAgICBmdW5jdGlvbiBwcmVQcm9jZXNzQmluZGluZ3MoYmluZGluZ3NTdHJpbmdPcktleVZhbHVlQXJyYXksIGJpbmRpbmdPcHRpb25zKSB7XG4gICAgICAgIGJpbmRpbmdPcHRpb25zID0gYmluZGluZ09wdGlvbnMgfHwge307XG5cbiAgICAgICAgZnVuY3Rpb24gcHJvY2Vzc0tleVZhbHVlKGtleSwgdmFsKSB7XG4gICAgICAgICAgICB2YXIgd3JpdGFibGVWYWw7XG4gICAgICAgICAgICBmdW5jdGlvbiBjYWxsUHJlcHJvY2Vzc0hvb2sob2JqKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChvYmogJiYgb2JqWydwcmVwcm9jZXNzJ10pID8gKHZhbCA9IG9ialsncHJlcHJvY2VzcyddKHZhbCwga2V5LCBwcm9jZXNzS2V5VmFsdWUpKSA6IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWJpbmRpbmdQYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWNhbGxQcmVwcm9jZXNzSG9vayhrb1snZ2V0QmluZGluZ0hhbmRsZXInXShrZXkpKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR3b1dheUJpbmRpbmdzW2tleV0gJiYgKHdyaXRhYmxlVmFsID0gZ2V0V3JpdGVhYmxlVmFsdWUodmFsKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRm9yIHR3by13YXkgYmluZGluZ3MsIHByb3ZpZGUgYSB3cml0ZSBtZXRob2QgaW4gY2FzZSB0aGUgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgLy8gaXNuJ3QgYSB3cml0YWJsZSBvYnNlcnZhYmxlLlxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eUFjY2Vzc29yUmVzdWx0U3RyaW5ncy5wdXNoKFwiJ1wiICsga2V5ICsgXCInOmZ1bmN0aW9uKF96KXtcIiArIHdyaXRhYmxlVmFsICsgXCI9X3p9XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFZhbHVlcyBhcmUgd3JhcHBlZCBpbiBhIGZ1bmN0aW9uIHNvIHRoYXQgZWFjaCB2YWx1ZSBjYW4gYmUgYWNjZXNzZWQgaW5kZXBlbmRlbnRseVxuICAgICAgICAgICAgaWYgKG1ha2VWYWx1ZUFjY2Vzc29ycykge1xuICAgICAgICAgICAgICAgIHZhbCA9ICdmdW5jdGlvbigpe3JldHVybiAnICsgdmFsICsgJyB9JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc3VsdFN0cmluZ3MucHVzaChcIidcIiArIGtleSArIFwiJzpcIiArIHZhbCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmVzdWx0U3RyaW5ncyA9IFtdLFxuICAgICAgICAgICAgcHJvcGVydHlBY2Nlc3NvclJlc3VsdFN0cmluZ3MgPSBbXSxcbiAgICAgICAgICAgIG1ha2VWYWx1ZUFjY2Vzc29ycyA9IGJpbmRpbmdPcHRpb25zWyd2YWx1ZUFjY2Vzc29ycyddLFxuICAgICAgICAgICAgYmluZGluZ1BhcmFtcyA9IGJpbmRpbmdPcHRpb25zWydiaW5kaW5nUGFyYW1zJ10sXG4gICAgICAgICAgICBrZXlWYWx1ZUFycmF5ID0gdHlwZW9mIGJpbmRpbmdzU3RyaW5nT3JLZXlWYWx1ZUFycmF5ID09PSBcInN0cmluZ1wiID9cbiAgICAgICAgICAgICAgICBwYXJzZU9iamVjdExpdGVyYWwoYmluZGluZ3NTdHJpbmdPcktleVZhbHVlQXJyYXkpIDogYmluZGluZ3NTdHJpbmdPcktleVZhbHVlQXJyYXk7XG5cbiAgICAgICAga28udXRpbHMuYXJyYXlGb3JFYWNoKGtleVZhbHVlQXJyYXksIGZ1bmN0aW9uKGtleVZhbHVlKSB7XG4gICAgICAgICAgICBwcm9jZXNzS2V5VmFsdWUoa2V5VmFsdWUua2V5IHx8IGtleVZhbHVlWyd1bmtub3duJ10sIGtleVZhbHVlLnZhbHVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHByb3BlcnR5QWNjZXNzb3JSZXN1bHRTdHJpbmdzLmxlbmd0aClcbiAgICAgICAgICAgIHByb2Nlc3NLZXlWYWx1ZSgnX2tvX3Byb3BlcnR5X3dyaXRlcnMnLCBcIntcIiArIHByb3BlcnR5QWNjZXNzb3JSZXN1bHRTdHJpbmdzLmpvaW4oXCIsXCIpICsgXCIgfVwiKTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0U3RyaW5ncy5qb2luKFwiLFwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBiaW5kaW5nUmV3cml0ZVZhbGlkYXRvcnM6IFtdLFxuXG4gICAgICAgIHR3b1dheUJpbmRpbmdzOiB0d29XYXlCaW5kaW5ncyxcblxuICAgICAgICBwYXJzZU9iamVjdExpdGVyYWw6IHBhcnNlT2JqZWN0TGl0ZXJhbCxcblxuICAgICAgICBwcmVQcm9jZXNzQmluZGluZ3M6IHByZVByb2Nlc3NCaW5kaW5ncyxcblxuICAgICAgICBrZXlWYWx1ZUFycmF5Q29udGFpbnNLZXk6IGZ1bmN0aW9uKGtleVZhbHVlQXJyYXksIGtleSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlWYWx1ZUFycmF5Lmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgICAgIGlmIChrZXlWYWx1ZUFycmF5W2ldWydrZXknXSA9PSBrZXkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIEludGVybmFsLCBwcml2YXRlIEtPIHV0aWxpdHkgZm9yIHVwZGF0aW5nIG1vZGVsIHByb3BlcnRpZXMgZnJvbSB3aXRoaW4gYmluZGluZ3NcbiAgICAgICAgLy8gcHJvcGVydHk6ICAgICAgICAgICAgSWYgdGhlIHByb3BlcnR5IGJlaW5nIHVwZGF0ZWQgaXMgKG9yIG1pZ2h0IGJlKSBhbiBvYnNlcnZhYmxlLCBwYXNzIGl0IGhlcmVcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgSWYgaXQgdHVybnMgb3V0IHRvIGJlIGEgd3JpdGFibGUgb2JzZXJ2YWJsZSwgaXQgd2lsbCBiZSB3cml0dGVuIHRvIGRpcmVjdGx5XG4gICAgICAgIC8vIGFsbEJpbmRpbmdzOiAgICAgICAgIEFuIG9iamVjdCB3aXRoIGEgZ2V0IG1ldGhvZCB0byByZXRyaWV2ZSBiaW5kaW5ncyBpbiB0aGUgY3VycmVudCBleGVjdXRpb24gY29udGV4dC5cbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgVGhpcyB3aWxsIGJlIHNlYXJjaGVkIGZvciBhICdfa29fcHJvcGVydHlfd3JpdGVycycgcHJvcGVydHkgaW4gY2FzZSB5b3UncmUgd3JpdGluZyB0byBhIG5vbi1vYnNlcnZhYmxlXG4gICAgICAgIC8vIGtleTogICAgICAgICAgICAgICAgIFRoZSBrZXkgaWRlbnRpZnlpbmcgdGhlIHByb3BlcnR5IHRvIGJlIHdyaXR0ZW4uIEV4YW1wbGU6IGZvciB7IGhhc0ZvY3VzOiBteVZhbHVlIH0sIHdyaXRlIHRvICdteVZhbHVlJyBieSBzcGVjaWZ5aW5nIHRoZSBrZXkgJ2hhc0ZvY3VzJ1xuICAgICAgICAvLyB2YWx1ZTogICAgICAgICAgICAgICBUaGUgdmFsdWUgdG8gYmUgd3JpdHRlblxuICAgICAgICAvLyBjaGVja0lmRGlmZmVyZW50OiAgICBJZiB0cnVlLCBhbmQgaWYgdGhlIHByb3BlcnR5IGJlaW5nIHdyaXR0ZW4gaXMgYSB3cml0YWJsZSBvYnNlcnZhYmxlLCB0aGUgdmFsdWUgd2lsbCBvbmx5IGJlIHdyaXR0ZW4gaWZcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgaXQgaXMgIT09IGV4aXN0aW5nIHZhbHVlIG9uIHRoYXQgd3JpdGFibGUgb2JzZXJ2YWJsZVxuICAgICAgICB3cml0ZVZhbHVlVG9Qcm9wZXJ0eTogZnVuY3Rpb24ocHJvcGVydHksIGFsbEJpbmRpbmdzLCBrZXksIHZhbHVlLCBjaGVja0lmRGlmZmVyZW50KSB7XG4gICAgICAgICAgICBpZiAoIXByb3BlcnR5IHx8ICFrby5pc09ic2VydmFibGUocHJvcGVydHkpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHByb3BXcml0ZXJzID0gYWxsQmluZGluZ3MuZ2V0KCdfa29fcHJvcGVydHlfd3JpdGVycycpO1xuICAgICAgICAgICAgICAgIGlmIChwcm9wV3JpdGVycyAmJiBwcm9wV3JpdGVyc1trZXldKVxuICAgICAgICAgICAgICAgICAgICBwcm9wV3JpdGVyc1trZXldKHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoa28uaXNXcml0ZWFibGVPYnNlcnZhYmxlKHByb3BlcnR5KSAmJiAoIWNoZWNrSWZEaWZmZXJlbnQgfHwgcHJvcGVydHkucGVlaygpICE9PSB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eSh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcblxua28uZXhwb3J0U3ltYm9sKCdleHByZXNzaW9uUmV3cml0aW5nJywga28uZXhwcmVzc2lvblJld3JpdGluZyk7XG5rby5leHBvcnRTeW1ib2woJ2V4cHJlc3Npb25SZXdyaXRpbmcuYmluZGluZ1Jld3JpdGVWYWxpZGF0b3JzJywga28uZXhwcmVzc2lvblJld3JpdGluZy5iaW5kaW5nUmV3cml0ZVZhbGlkYXRvcnMpO1xua28uZXhwb3J0U3ltYm9sKCdleHByZXNzaW9uUmV3cml0aW5nLnBhcnNlT2JqZWN0TGl0ZXJhbCcsIGtvLmV4cHJlc3Npb25SZXdyaXRpbmcucGFyc2VPYmplY3RMaXRlcmFsKTtcbmtvLmV4cG9ydFN5bWJvbCgnZXhwcmVzc2lvblJld3JpdGluZy5wcmVQcm9jZXNzQmluZGluZ3MnLCBrby5leHByZXNzaW9uUmV3cml0aW5nLnByZVByb2Nlc3NCaW5kaW5ncyk7XG5cbi8vIE1ha2luZyBiaW5kaW5ncyBleHBsaWNpdGx5IGRlY2xhcmUgdGhlbXNlbHZlcyBhcyBcInR3byB3YXlcIiBpc24ndCBpZGVhbCBpbiB0aGUgbG9uZyB0ZXJtIChpdCB3b3VsZCBiZSBiZXR0ZXIgaWZcbi8vIGFsbCBiaW5kaW5ncyBjb3VsZCB1c2UgYW4gb2ZmaWNpYWwgJ3Byb3BlcnR5IHdyaXRlcicgQVBJIHdpdGhvdXQgbmVlZGluZyB0byBkZWNsYXJlIHRoYXQgdGhleSBtaWdodCkuIEhvd2V2ZXIsXG4vLyBzaW5jZSB0aGlzIGlzIG5vdCwgYW5kIGhhcyBuZXZlciBiZWVuLCBhIHB1YmxpYyBBUEkgKF9rb19wcm9wZXJ0eV93cml0ZXJzIHdhcyBuZXZlciBkb2N1bWVudGVkKSwgaXQncyBhY2NlcHRhYmxlXG4vLyBhcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwgaW4gdGhlIHNob3J0IHRlcm0uXG4vLyBGb3IgdGhvc2UgZGV2ZWxvcGVycyB3aG8gcmVseSBvbiBfa29fcHJvcGVydHlfd3JpdGVycyBpbiB0aGVpciBjdXN0b20gYmluZGluZ3MsIHdlIGV4cG9zZSBfdHdvV2F5QmluZGluZ3MgYXMgYW5cbi8vIHVuZG9jdW1lbnRlZCBmZWF0dXJlIHRoYXQgbWFrZXMgaXQgcmVsYXRpdmVseSBlYXN5IHRvIHVwZ3JhZGUgdG8gS08gMy4wLiBIb3dldmVyLCB0aGlzIGlzIHN0aWxsIG5vdCBhbiBvZmZpY2lhbFxuLy8gcHVibGljIEFQSSwgYW5kIHdlIHJlc2VydmUgdGhlIHJpZ2h0IHRvIHJlbW92ZSBpdCBhdCBhbnkgdGltZSBpZiB3ZSBjcmVhdGUgYSByZWFsIHB1YmxpYyBwcm9wZXJ0eSB3cml0ZXJzIEFQSS5cbmtvLmV4cG9ydFN5bWJvbCgnZXhwcmVzc2lvblJld3JpdGluZy5fdHdvV2F5QmluZGluZ3MnLCBrby5leHByZXNzaW9uUmV3cml0aW5nLnR3b1dheUJpbmRpbmdzKTtcblxuLy8gRm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHksIGRlZmluZSB0aGUgZm9sbG93aW5nIGFsaWFzZXMuIChQcmV2aW91c2x5LCB0aGVzZSBmdW5jdGlvbiBuYW1lcyB3ZXJlIG1pc2xlYWRpbmcgYmVjYXVzZVxuLy8gdGhleSByZWZlcnJlZCB0byBKU09OIHNwZWNpZmljYWxseSwgZXZlbiB0aG91Z2ggdGhleSBhY3R1YWxseSB3b3JrIHdpdGggYXJiaXRyYXJ5IEphdmFTY3JpcHQgb2JqZWN0IGxpdGVyYWwgZXhwcmVzc2lvbnMuKVxua28uZXhwb3J0U3ltYm9sKCdqc29uRXhwcmVzc2lvblJld3JpdGluZycsIGtvLmV4cHJlc3Npb25SZXdyaXRpbmcpO1xua28uZXhwb3J0U3ltYm9sKCdqc29uRXhwcmVzc2lvblJld3JpdGluZy5pbnNlcnRQcm9wZXJ0eUFjY2Vzc29yc0ludG9Kc29uJywga28uZXhwcmVzc2lvblJld3JpdGluZy5wcmVQcm9jZXNzQmluZGluZ3MpO1xuKGZ1bmN0aW9uKCkge1xuICAgIC8vIFwiVmlydHVhbCBlbGVtZW50c1wiIGlzIGFuIGFic3RyYWN0aW9uIG9uIHRvcCBvZiB0aGUgdXN1YWwgRE9NIEFQSSB3aGljaCB1bmRlcnN0YW5kcyB0aGUgbm90aW9uIHRoYXQgY29tbWVudCBub2Rlc1xuICAgIC8vIG1heSBiZSB1c2VkIHRvIHJlcHJlc2VudCBoaWVyYXJjaHkgKGluIGFkZGl0aW9uIHRvIHRoZSBET00ncyBuYXR1cmFsIGhpZXJhcmNoeSkuXG4gICAgLy8gSWYgeW91IGNhbGwgdGhlIERPTS1tYW5pcHVsYXRpbmcgZnVuY3Rpb25zIG9uIGtvLnZpcnR1YWxFbGVtZW50cywgeW91IHdpbGwgYmUgYWJsZSB0byByZWFkIGFuZCB3cml0ZSB0aGUgc3RhdGVcbiAgICAvLyBvZiB0aGF0IHZpcnR1YWwgaGllcmFyY2h5XG4gICAgLy9cbiAgICAvLyBUaGUgcG9pbnQgb2YgYWxsIHRoaXMgaXMgdG8gc3VwcG9ydCBjb250YWluZXJsZXNzIHRlbXBsYXRlcyAoZS5nLiwgPCEtLSBrbyBmb3JlYWNoOnNvbWVDb2xsZWN0aW9uIC0tPmJsYWg8IS0tIC9rbyAtLT4pXG4gICAgLy8gd2l0aG91dCBoYXZpbmcgdG8gc2NhdHRlciBzcGVjaWFsIGNhc2VzIGFsbCBvdmVyIHRoZSBiaW5kaW5nIGFuZCB0ZW1wbGF0aW5nIGNvZGUuXG5cbiAgICAvLyBJRSA5IGNhbm5vdCByZWxpYWJseSByZWFkIHRoZSBcIm5vZGVWYWx1ZVwiIHByb3BlcnR5IG9mIGEgY29tbWVudCBub2RlIChzZWUgaHR0cHM6Ly9naXRodWIuY29tL1N0ZXZlU2FuZGVyc29uL2tub2Nrb3V0L2lzc3Vlcy8xODYpXG4gICAgLy8gYnV0IGl0IGRvZXMgZ2l2ZSB0aGVtIGEgbm9uc3RhbmRhcmQgYWx0ZXJuYXRpdmUgcHJvcGVydHkgY2FsbGVkIFwidGV4dFwiIHRoYXQgaXQgY2FuIHJlYWQgcmVsaWFibHkuIE90aGVyIGJyb3dzZXJzIGRvbid0IGhhdmUgdGhhdCBwcm9wZXJ0eS5cbiAgICAvLyBTbywgdXNlIG5vZGUudGV4dCB3aGVyZSBhdmFpbGFibGUsIGFuZCBub2RlLm5vZGVWYWx1ZSBlbHNld2hlcmVcbiAgICB2YXIgY29tbWVudE5vZGVzSGF2ZVRleHRQcm9wZXJ0eSA9IGRvY3VtZW50ICYmIGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoXCJ0ZXN0XCIpLnRleHQgPT09IFwiPCEtLXRlc3QtLT5cIjtcblxuICAgIHZhciBzdGFydENvbW1lbnRSZWdleCA9IGNvbW1lbnROb2Rlc0hhdmVUZXh0UHJvcGVydHkgPyAvXjwhLS1cXHMqa28oPzpcXHMrKFtcXHNcXFNdKykpP1xccyotLT4kLyA6IC9eXFxzKmtvKD86XFxzKyhbXFxzXFxTXSspKT9cXHMqJC87XG4gICAgdmFyIGVuZENvbW1lbnRSZWdleCA9ICAgY29tbWVudE5vZGVzSGF2ZVRleHRQcm9wZXJ0eSA/IC9ePCEtLVxccypcXC9rb1xccyotLT4kLyA6IC9eXFxzKlxcL2tvXFxzKiQvO1xuICAgIHZhciBodG1sVGFnc1dpdGhPcHRpb25hbGx5Q2xvc2luZ0NoaWxkcmVuID0geyAndWwnOiB0cnVlLCAnb2wnOiB0cnVlIH07XG5cbiAgICBmdW5jdGlvbiBpc1N0YXJ0Q29tbWVudChub2RlKSB7XG4gICAgICAgIHJldHVybiAobm9kZS5ub2RlVHlwZSA9PSA4KSAmJiBzdGFydENvbW1lbnRSZWdleC50ZXN0KGNvbW1lbnROb2Rlc0hhdmVUZXh0UHJvcGVydHkgPyBub2RlLnRleHQgOiBub2RlLm5vZGVWYWx1ZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNFbmRDb21tZW50KG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIChub2RlLm5vZGVUeXBlID09IDgpICYmIGVuZENvbW1lbnRSZWdleC50ZXN0KGNvbW1lbnROb2Rlc0hhdmVUZXh0UHJvcGVydHkgPyBub2RlLnRleHQgOiBub2RlLm5vZGVWYWx1ZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0VmlydHVhbENoaWxkcmVuKHN0YXJ0Q29tbWVudCwgYWxsb3dVbmJhbGFuY2VkKSB7XG4gICAgICAgIHZhciBjdXJyZW50Tm9kZSA9IHN0YXJ0Q29tbWVudDtcbiAgICAgICAgdmFyIGRlcHRoID0gMTtcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gW107XG4gICAgICAgIHdoaWxlIChjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLm5leHRTaWJsaW5nKSB7XG4gICAgICAgICAgICBpZiAoaXNFbmRDb21tZW50KGN1cnJlbnROb2RlKSkge1xuICAgICAgICAgICAgICAgIGRlcHRoLS07XG4gICAgICAgICAgICAgICAgaWYgKGRlcHRoID09PSAwKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2hpbGRyZW47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goY3VycmVudE5vZGUpO1xuXG4gICAgICAgICAgICBpZiAoaXNTdGFydENvbW1lbnQoY3VycmVudE5vZGUpKVxuICAgICAgICAgICAgICAgIGRlcHRoKys7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhbGxvd1VuYmFsYW5jZWQpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBjbG9zaW5nIGNvbW1lbnQgdGFnIHRvIG1hdGNoOiBcIiArIHN0YXJ0Q29tbWVudC5ub2RlVmFsdWUpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRNYXRjaGluZ0VuZENvbW1lbnQoc3RhcnRDb21tZW50LCBhbGxvd1VuYmFsYW5jZWQpIHtcbiAgICAgICAgdmFyIGFsbFZpcnR1YWxDaGlsZHJlbiA9IGdldFZpcnR1YWxDaGlsZHJlbihzdGFydENvbW1lbnQsIGFsbG93VW5iYWxhbmNlZCk7XG4gICAgICAgIGlmIChhbGxWaXJ0dWFsQ2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGlmIChhbGxWaXJ0dWFsQ2hpbGRyZW4ubGVuZ3RoID4gMClcbiAgICAgICAgICAgICAgICByZXR1cm4gYWxsVmlydHVhbENoaWxkcmVuW2FsbFZpcnR1YWxDaGlsZHJlbi5sZW5ndGggLSAxXS5uZXh0U2libGluZztcbiAgICAgICAgICAgIHJldHVybiBzdGFydENvbW1lbnQubmV4dFNpYmxpbmc7XG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7IC8vIE11c3QgaGF2ZSBubyBtYXRjaGluZyBlbmQgY29tbWVudCwgYW5kIGFsbG93VW5iYWxhbmNlZCBpcyB0cnVlXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0VW5iYWxhbmNlZENoaWxkVGFncyhub2RlKSB7XG4gICAgICAgIC8vIGUuZy4sIGZyb20gPGRpdj5PSzwvZGl2PjwhLS0ga28gYmxhaCAtLT48c3Bhbj5Bbm90aGVyPC9zcGFuPiwgcmV0dXJuczogPCEtLSBrbyBibGFoIC0tPjxzcGFuPkFub3RoZXI8L3NwYW4+XG4gICAgICAgIC8vICAgICAgIGZyb20gPGRpdj5PSzwvZGl2PjwhLS0gL2tvIC0tPjwhLS0gL2tvIC0tPiwgICAgICAgICAgICAgcmV0dXJuczogPCEtLSAva28gLS0+PCEtLSAva28gLS0+XG4gICAgICAgIHZhciBjaGlsZE5vZGUgPSBub2RlLmZpcnN0Q2hpbGQsIGNhcHR1cmVSZW1haW5pbmcgPSBudWxsO1xuICAgICAgICBpZiAoY2hpbGROb2RlKSB7XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgaWYgKGNhcHR1cmVSZW1haW5pbmcpICAgICAgICAgICAgICAgICAgIC8vIFdlIGFscmVhZHkgaGl0IGFuIHVuYmFsYW5jZWQgbm9kZSBhbmQgYXJlIG5vdyBqdXN0IHNjb29waW5nIHVwIGFsbCBzdWJzZXF1ZW50IG5vZGVzXG4gICAgICAgICAgICAgICAgICAgIGNhcHR1cmVSZW1haW5pbmcucHVzaChjaGlsZE5vZGUpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGlzU3RhcnRDb21tZW50KGNoaWxkTm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1hdGNoaW5nRW5kQ29tbWVudCA9IGdldE1hdGNoaW5nRW5kQ29tbWVudChjaGlsZE5vZGUsIC8qIGFsbG93VW5iYWxhbmNlZDogKi8gdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaGluZ0VuZENvbW1lbnQpICAgICAgICAgICAgIC8vIEl0J3MgYSBiYWxhbmNlZCB0YWcsIHNvIHNraXAgaW1tZWRpYXRlbHkgdG8gdGhlIGVuZCBvZiB0aGlzIHZpcnR1YWwgc2V0XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZE5vZGUgPSBtYXRjaGluZ0VuZENvbW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcHR1cmVSZW1haW5pbmcgPSBbY2hpbGROb2RlXTsgLy8gSXQncyB1bmJhbGFuY2VkLCBzbyBzdGFydCBjYXB0dXJpbmcgZnJvbSB0aGlzIHBvaW50XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc0VuZENvbW1lbnQoY2hpbGROb2RlKSkge1xuICAgICAgICAgICAgICAgICAgICBjYXB0dXJlUmVtYWluaW5nID0gW2NoaWxkTm9kZV07ICAgICAvLyBJdCdzIHVuYmFsYW5jZWQgKGlmIGl0IHdhc24ndCwgd2UnZCBoYXZlIHNraXBwZWQgb3ZlciBpdCBhbHJlYWR5KSwgc28gc3RhcnQgY2FwdHVyaW5nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSB3aGlsZSAoY2hpbGROb2RlID0gY2hpbGROb2RlLm5leHRTaWJsaW5nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2FwdHVyZVJlbWFpbmluZztcbiAgICB9XG5cbiAgICBrby52aXJ0dWFsRWxlbWVudHMgPSB7XG4gICAgICAgIGFsbG93ZWRCaW5kaW5nczoge30sXG5cbiAgICAgICAgY2hpbGROb2RlczogZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzU3RhcnRDb21tZW50KG5vZGUpID8gZ2V0VmlydHVhbENoaWxkcmVuKG5vZGUpIDogbm9kZS5jaGlsZE5vZGVzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGVtcHR5Tm9kZTogZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgaWYgKCFpc1N0YXJ0Q29tbWVudChub2RlKSlcbiAgICAgICAgICAgICAgICBrby51dGlscy5lbXB0eURvbU5vZGUobm9kZSk7XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgdmlydHVhbENoaWxkcmVuID0ga28udmlydHVhbEVsZW1lbnRzLmNoaWxkTm9kZXMobm9kZSk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSB2aXJ0dWFsQ2hpbGRyZW4ubGVuZ3RoOyBpIDwgajsgaSsrKVxuICAgICAgICAgICAgICAgICAgICBrby5yZW1vdmVOb2RlKHZpcnR1YWxDaGlsZHJlbltpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0RG9tTm9kZUNoaWxkcmVuOiBmdW5jdGlvbihub2RlLCBjaGlsZE5vZGVzKSB7XG4gICAgICAgICAgICBpZiAoIWlzU3RhcnRDb21tZW50KG5vZGUpKVxuICAgICAgICAgICAgICAgIGtvLnV0aWxzLnNldERvbU5vZGVDaGlsZHJlbihub2RlLCBjaGlsZE5vZGVzKTtcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGtvLnZpcnR1YWxFbGVtZW50cy5lbXB0eU5vZGUobm9kZSk7XG4gICAgICAgICAgICAgICAgdmFyIGVuZENvbW1lbnROb2RlID0gbm9kZS5uZXh0U2libGluZzsgLy8gTXVzdCBiZSB0aGUgbmV4dCBzaWJsaW5nLCBhcyB3ZSBqdXN0IGVtcHRpZWQgdGhlIGNoaWxkcmVuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBjaGlsZE5vZGVzLmxlbmd0aDsgaSA8IGo7IGkrKylcbiAgICAgICAgICAgICAgICAgICAgZW5kQ29tbWVudE5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoY2hpbGROb2Rlc1tpXSwgZW5kQ29tbWVudE5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHByZXBlbmQ6IGZ1bmN0aW9uKGNvbnRhaW5lck5vZGUsIG5vZGVUb1ByZXBlbmQpIHtcbiAgICAgICAgICAgIGlmICghaXNTdGFydENvbW1lbnQoY29udGFpbmVyTm9kZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29udGFpbmVyTm9kZS5maXJzdENoaWxkKVxuICAgICAgICAgICAgICAgICAgICBjb250YWluZXJOb2RlLmluc2VydEJlZm9yZShub2RlVG9QcmVwZW5kLCBjb250YWluZXJOb2RlLmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyTm9kZS5hcHBlbmRDaGlsZChub2RlVG9QcmVwZW5kKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gU3RhcnQgY29tbWVudHMgbXVzdCBhbHdheXMgaGF2ZSBhIHBhcmVudCBhbmQgYXQgbGVhc3Qgb25lIGZvbGxvd2luZyBzaWJsaW5nICh0aGUgZW5kIGNvbW1lbnQpXG4gICAgICAgICAgICAgICAgY29udGFpbmVyTm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShub2RlVG9QcmVwZW5kLCBjb250YWluZXJOb2RlLm5leHRTaWJsaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBpbnNlcnRBZnRlcjogZnVuY3Rpb24oY29udGFpbmVyTm9kZSwgbm9kZVRvSW5zZXJ0LCBpbnNlcnRBZnRlck5vZGUpIHtcbiAgICAgICAgICAgIGlmICghaW5zZXJ0QWZ0ZXJOb2RlKSB7XG4gICAgICAgICAgICAgICAga28udmlydHVhbEVsZW1lbnRzLnByZXBlbmQoY29udGFpbmVyTm9kZSwgbm9kZVRvSW5zZXJ0KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWlzU3RhcnRDb21tZW50KGNvbnRhaW5lck5vZGUpKSB7XG4gICAgICAgICAgICAgICAgLy8gSW5zZXJ0IGFmdGVyIGluc2VydGlvbiBwb2ludFxuICAgICAgICAgICAgICAgIGlmIChpbnNlcnRBZnRlck5vZGUubmV4dFNpYmxpbmcpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lck5vZGUuaW5zZXJ0QmVmb3JlKG5vZGVUb0luc2VydCwgaW5zZXJ0QWZ0ZXJOb2RlLm5leHRTaWJsaW5nKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lck5vZGUuYXBwZW5kQ2hpbGQobm9kZVRvSW5zZXJ0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gQ2hpbGRyZW4gb2Ygc3RhcnQgY29tbWVudHMgbXVzdCBhbHdheXMgaGF2ZSBhIHBhcmVudCBhbmQgYXQgbGVhc3Qgb25lIGZvbGxvd2luZyBzaWJsaW5nICh0aGUgZW5kIGNvbW1lbnQpXG4gICAgICAgICAgICAgICAgY29udGFpbmVyTm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShub2RlVG9JbnNlcnQsIGluc2VydEFmdGVyTm9kZS5uZXh0U2libGluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmlyc3RDaGlsZDogZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgaWYgKCFpc1N0YXJ0Q29tbWVudChub2RlKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS5maXJzdENoaWxkO1xuICAgICAgICAgICAgaWYgKCFub2RlLm5leHRTaWJsaW5nIHx8IGlzRW5kQ29tbWVudChub2RlLm5leHRTaWJsaW5nKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIHJldHVybiBub2RlLm5leHRTaWJsaW5nO1xuICAgICAgICB9LFxuXG4gICAgICAgIG5leHRTaWJsaW5nOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICBpZiAoaXNTdGFydENvbW1lbnQobm9kZSkpXG4gICAgICAgICAgICAgICAgbm9kZSA9IGdldE1hdGNoaW5nRW5kQ29tbWVudChub2RlKTtcbiAgICAgICAgICAgIGlmIChub2RlLm5leHRTaWJsaW5nICYmIGlzRW5kQ29tbWVudChub2RlLm5leHRTaWJsaW5nKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIHJldHVybiBub2RlLm5leHRTaWJsaW5nO1xuICAgICAgICB9LFxuXG4gICAgICAgIGhhc0JpbmRpbmdWYWx1ZTogaXNTdGFydENvbW1lbnQsXG5cbiAgICAgICAgdmlydHVhbE5vZGVCaW5kaW5nVmFsdWU6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgIHZhciByZWdleE1hdGNoID0gKGNvbW1lbnROb2Rlc0hhdmVUZXh0UHJvcGVydHkgPyBub2RlLnRleHQgOiBub2RlLm5vZGVWYWx1ZSkubWF0Y2goc3RhcnRDb21tZW50UmVnZXgpO1xuICAgICAgICAgICAgcmV0dXJuIHJlZ2V4TWF0Y2ggPyByZWdleE1hdGNoWzFdIDogbnVsbDtcbiAgICAgICAgfSxcblxuICAgICAgICBub3JtYWxpc2VWaXJ0dWFsRWxlbWVudERvbVN0cnVjdHVyZTogZnVuY3Rpb24oZWxlbWVudFZlcmlmaWVkKSB7XG4gICAgICAgICAgICAvLyBXb3JrYXJvdW5kIGZvciBodHRwczovL2dpdGh1Yi5jb20vU3RldmVTYW5kZXJzb24va25vY2tvdXQvaXNzdWVzLzE1NVxuICAgICAgICAgICAgLy8gKElFIDw9IDggb3IgSUUgOSBxdWlya3MgbW9kZSBwYXJzZXMgeW91ciBIVE1MIHdlaXJkbHksIHRyZWF0aW5nIGNsb3NpbmcgPC9saT4gdGFncyBhcyBpZiB0aGV5IGRvbid0IGV4aXN0LCB0aGVyZWJ5IG1vdmluZyBjb21tZW50IG5vZGVzXG4gICAgICAgICAgICAvLyB0aGF0IGFyZSBkaXJlY3QgZGVzY2VuZGFudHMgb2YgPHVsPiBpbnRvIHRoZSBwcmVjZWRpbmcgPGxpPilcbiAgICAgICAgICAgIGlmICghaHRtbFRhZ3NXaXRoT3B0aW9uYWxseUNsb3NpbmdDaGlsZHJlbltrby51dGlscy50YWdOYW1lTG93ZXIoZWxlbWVudFZlcmlmaWVkKV0pXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAvLyBTY2FuIGltbWVkaWF0ZSBjaGlsZHJlbiB0byBzZWUgaWYgdGhleSBjb250YWluIHVuYmFsYW5jZWQgY29tbWVudCB0YWdzLiBJZiB0aGV5IGRvLCB0aG9zZSBjb21tZW50IHRhZ3NcbiAgICAgICAgICAgIC8vIG11c3QgYmUgaW50ZW5kZWQgdG8gYXBwZWFyICphZnRlciogdGhhdCBjaGlsZCwgc28gbW92ZSB0aGVtIHRoZXJlLlxuICAgICAgICAgICAgdmFyIGNoaWxkTm9kZSA9IGVsZW1lbnRWZXJpZmllZC5maXJzdENoaWxkO1xuICAgICAgICAgICAgaWYgKGNoaWxkTm9kZSkge1xuICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkTm9kZS5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVuYmFsYW5jZWRUYWdzID0gZ2V0VW5iYWxhbmNlZENoaWxkVGFncyhjaGlsZE5vZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVuYmFsYW5jZWRUYWdzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRml4IHVwIHRoZSBET00gYnkgbW92aW5nIHRoZSB1bmJhbGFuY2VkIHRhZ3MgdG8gd2hlcmUgdGhleSBtb3N0IGxpa2VseSB3ZXJlIGludGVuZGVkIHRvIGJlIHBsYWNlZCAtICphZnRlciogdGhlIGNoaWxkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5vZGVUb0luc2VydEJlZm9yZSA9IGNoaWxkTm9kZS5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHVuYmFsYW5jZWRUYWdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub2RlVG9JbnNlcnRCZWZvcmUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50VmVyaWZpZWQuaW5zZXJ0QmVmb3JlKHVuYmFsYW5jZWRUYWdzW2ldLCBub2RlVG9JbnNlcnRCZWZvcmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50VmVyaWZpZWQuYXBwZW5kQ2hpbGQodW5iYWxhbmNlZFRhZ3NbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gd2hpbGUgKGNoaWxkTm9kZSA9IGNoaWxkTm9kZS5uZXh0U2libGluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcbmtvLmV4cG9ydFN5bWJvbCgndmlydHVhbEVsZW1lbnRzJywga28udmlydHVhbEVsZW1lbnRzKTtcbmtvLmV4cG9ydFN5bWJvbCgndmlydHVhbEVsZW1lbnRzLmFsbG93ZWRCaW5kaW5ncycsIGtvLnZpcnR1YWxFbGVtZW50cy5hbGxvd2VkQmluZGluZ3MpO1xua28uZXhwb3J0U3ltYm9sKCd2aXJ0dWFsRWxlbWVudHMuZW1wdHlOb2RlJywga28udmlydHVhbEVsZW1lbnRzLmVtcHR5Tm9kZSk7XG4vL2tvLmV4cG9ydFN5bWJvbCgndmlydHVhbEVsZW1lbnRzLmZpcnN0Q2hpbGQnLCBrby52aXJ0dWFsRWxlbWVudHMuZmlyc3RDaGlsZCk7ICAgICAvLyBmaXJzdENoaWxkIGlzIG5vdCBtaW5pZmllZFxua28uZXhwb3J0U3ltYm9sKCd2aXJ0dWFsRWxlbWVudHMuaW5zZXJ0QWZ0ZXInLCBrby52aXJ0dWFsRWxlbWVudHMuaW5zZXJ0QWZ0ZXIpO1xuLy9rby5leHBvcnRTeW1ib2woJ3ZpcnR1YWxFbGVtZW50cy5uZXh0U2libGluZycsIGtvLnZpcnR1YWxFbGVtZW50cy5uZXh0U2libGluZyk7ICAgLy8gbmV4dFNpYmxpbmcgaXMgbm90IG1pbmlmaWVkXG5rby5leHBvcnRTeW1ib2woJ3ZpcnR1YWxFbGVtZW50cy5wcmVwZW5kJywga28udmlydHVhbEVsZW1lbnRzLnByZXBlbmQpO1xua28uZXhwb3J0U3ltYm9sKCd2aXJ0dWFsRWxlbWVudHMuc2V0RG9tTm9kZUNoaWxkcmVuJywga28udmlydHVhbEVsZW1lbnRzLnNldERvbU5vZGVDaGlsZHJlbik7XG4oZnVuY3Rpb24oKSB7XG4gICAgdmFyIGRlZmF1bHRCaW5kaW5nQXR0cmlidXRlTmFtZSA9IFwiZGF0YS1iaW5kXCI7XG5cbiAgICBrby5iaW5kaW5nUHJvdmlkZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5iaW5kaW5nQ2FjaGUgPSB7fTtcbiAgICB9O1xuXG4gICAga28udXRpbHMuZXh0ZW5kKGtvLmJpbmRpbmdQcm92aWRlci5wcm90b3R5cGUsIHtcbiAgICAgICAgJ25vZGVIYXNCaW5kaW5ncyc6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgIHN3aXRjaCAobm9kZS5ub2RlVHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMTogLy8gRWxlbWVudFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS5nZXRBdHRyaWJ1dGUoZGVmYXVsdEJpbmRpbmdBdHRyaWJ1dGVOYW1lKSAhPSBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICB8fCBrby5jb21wb25lbnRzWydnZXRDb21wb25lbnROYW1lRm9yTm9kZSddKG5vZGUpO1xuICAgICAgICAgICAgICAgIGNhc2UgODogLy8gQ29tbWVudCBub2RlXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrby52aXJ0dWFsRWxlbWVudHMuaGFzQmluZGluZ1ZhbHVlKG5vZGUpO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAnZ2V0QmluZGluZ3MnOiBmdW5jdGlvbihub2RlLCBiaW5kaW5nQ29udGV4dCkge1xuICAgICAgICAgICAgdmFyIGJpbmRpbmdzU3RyaW5nID0gdGhpc1snZ2V0QmluZGluZ3NTdHJpbmcnXShub2RlLCBiaW5kaW5nQ29udGV4dCksXG4gICAgICAgICAgICAgICAgcGFyc2VkQmluZGluZ3MgPSBiaW5kaW5nc1N0cmluZyA/IHRoaXNbJ3BhcnNlQmluZGluZ3NTdHJpbmcnXShiaW5kaW5nc1N0cmluZywgYmluZGluZ0NvbnRleHQsIG5vZGUpIDogbnVsbDtcbiAgICAgICAgICAgIHJldHVybiBrby5jb21wb25lbnRzLmFkZEJpbmRpbmdzRm9yQ3VzdG9tRWxlbWVudChwYXJzZWRCaW5kaW5ncywgbm9kZSwgYmluZGluZ0NvbnRleHQsIC8qIHZhbHVlQWNjZXNzb3JzICovIGZhbHNlKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnZ2V0QmluZGluZ0FjY2Vzc29ycyc6IGZ1bmN0aW9uKG5vZGUsIGJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgICAgICB2YXIgYmluZGluZ3NTdHJpbmcgPSB0aGlzWydnZXRCaW5kaW5nc1N0cmluZyddKG5vZGUsIGJpbmRpbmdDb250ZXh0KSxcbiAgICAgICAgICAgICAgICBwYXJzZWRCaW5kaW5ncyA9IGJpbmRpbmdzU3RyaW5nID8gdGhpc1sncGFyc2VCaW5kaW5nc1N0cmluZyddKGJpbmRpbmdzU3RyaW5nLCBiaW5kaW5nQ29udGV4dCwgbm9kZSwgeyAndmFsdWVBY2Nlc3NvcnMnOiB0cnVlIH0pIDogbnVsbDtcbiAgICAgICAgICAgIHJldHVybiBrby5jb21wb25lbnRzLmFkZEJpbmRpbmdzRm9yQ3VzdG9tRWxlbWVudChwYXJzZWRCaW5kaW5ncywgbm9kZSwgYmluZGluZ0NvbnRleHQsIC8qIHZhbHVlQWNjZXNzb3JzICovIHRydWUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgZnVuY3Rpb24gaXMgb25seSB1c2VkIGludGVybmFsbHkgYnkgdGhpcyBkZWZhdWx0IHByb3ZpZGVyLlxuICAgICAgICAvLyBJdCdzIG5vdCBwYXJ0IG9mIHRoZSBpbnRlcmZhY2UgZGVmaW5pdGlvbiBmb3IgYSBnZW5lcmFsIGJpbmRpbmcgcHJvdmlkZXIuXG4gICAgICAgICdnZXRCaW5kaW5nc1N0cmluZyc6IGZ1bmN0aW9uKG5vZGUsIGJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgICAgICBzd2l0Y2ggKG5vZGUubm9kZVR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDE6IHJldHVybiBub2RlLmdldEF0dHJpYnV0ZShkZWZhdWx0QmluZGluZ0F0dHJpYnV0ZU5hbWUpOyAgIC8vIEVsZW1lbnRcbiAgICAgICAgICAgICAgICBjYXNlIDg6IHJldHVybiBrby52aXJ0dWFsRWxlbWVudHMudmlydHVhbE5vZGVCaW5kaW5nVmFsdWUobm9kZSk7IC8vIENvbW1lbnQgbm9kZVxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgZnVuY3Rpb24gaXMgb25seSB1c2VkIGludGVybmFsbHkgYnkgdGhpcyBkZWZhdWx0IHByb3ZpZGVyLlxuICAgICAgICAvLyBJdCdzIG5vdCBwYXJ0IG9mIHRoZSBpbnRlcmZhY2UgZGVmaW5pdGlvbiBmb3IgYSBnZW5lcmFsIGJpbmRpbmcgcHJvdmlkZXIuXG4gICAgICAgICdwYXJzZUJpbmRpbmdzU3RyaW5nJzogZnVuY3Rpb24oYmluZGluZ3NTdHJpbmcsIGJpbmRpbmdDb250ZXh0LCBub2RlLCBvcHRpb25zKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHZhciBiaW5kaW5nRnVuY3Rpb24gPSBjcmVhdGVCaW5kaW5nc1N0cmluZ0V2YWx1YXRvclZpYUNhY2hlKGJpbmRpbmdzU3RyaW5nLCB0aGlzLmJpbmRpbmdDYWNoZSwgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJpbmRpbmdGdW5jdGlvbihiaW5kaW5nQ29udGV4dCwgbm9kZSk7XG4gICAgICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgICAgICAgIGV4Lm1lc3NhZ2UgPSBcIlVuYWJsZSB0byBwYXJzZSBiaW5kaW5ncy5cXG5CaW5kaW5ncyB2YWx1ZTogXCIgKyBiaW5kaW5nc1N0cmluZyArIFwiXFxuTWVzc2FnZTogXCIgKyBleC5tZXNzYWdlO1xuICAgICAgICAgICAgICAgIHRocm93IGV4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBrby5iaW5kaW5nUHJvdmlkZXJbJ2luc3RhbmNlJ10gPSBuZXcga28uYmluZGluZ1Byb3ZpZGVyKCk7XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVCaW5kaW5nc1N0cmluZ0V2YWx1YXRvclZpYUNhY2hlKGJpbmRpbmdzU3RyaW5nLCBjYWNoZSwgb3B0aW9ucykge1xuICAgICAgICB2YXIgY2FjaGVLZXkgPSBiaW5kaW5nc1N0cmluZyArIChvcHRpb25zICYmIG9wdGlvbnNbJ3ZhbHVlQWNjZXNzb3JzJ10gfHwgJycpO1xuICAgICAgICByZXR1cm4gY2FjaGVbY2FjaGVLZXldXG4gICAgICAgICAgICB8fCAoY2FjaGVbY2FjaGVLZXldID0gY3JlYXRlQmluZGluZ3NTdHJpbmdFdmFsdWF0b3IoYmluZGluZ3NTdHJpbmcsIG9wdGlvbnMpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVCaW5kaW5nc1N0cmluZ0V2YWx1YXRvcihiaW5kaW5nc1N0cmluZywgb3B0aW9ucykge1xuICAgICAgICAvLyBCdWlsZCB0aGUgc291cmNlIGZvciBhIGZ1bmN0aW9uIHRoYXQgZXZhbHVhdGVzIFwiZXhwcmVzc2lvblwiXG4gICAgICAgIC8vIEZvciBlYWNoIHNjb3BlIHZhcmlhYmxlLCBhZGQgYW4gZXh0cmEgbGV2ZWwgb2YgXCJ3aXRoXCIgbmVzdGluZ1xuICAgICAgICAvLyBFeGFtcGxlIHJlc3VsdDogd2l0aChzYzEpIHsgd2l0aChzYzApIHsgcmV0dXJuIChleHByZXNzaW9uKSB9IH1cbiAgICAgICAgdmFyIHJld3JpdHRlbkJpbmRpbmdzID0ga28uZXhwcmVzc2lvblJld3JpdGluZy5wcmVQcm9jZXNzQmluZGluZ3MoYmluZGluZ3NTdHJpbmcsIG9wdGlvbnMpLFxuICAgICAgICAgICAgZnVuY3Rpb25Cb2R5ID0gXCJ3aXRoKCRjb250ZXh0KXt3aXRoKCRkYXRhfHx7fSl7cmV0dXJue1wiICsgcmV3cml0dGVuQmluZGluZ3MgKyBcIn19fVwiO1xuICAgICAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKFwiJGNvbnRleHRcIiwgXCIkZWxlbWVudFwiLCBmdW5jdGlvbkJvZHkpO1xuICAgIH1cbn0pKCk7XG5cbmtvLmV4cG9ydFN5bWJvbCgnYmluZGluZ1Byb3ZpZGVyJywga28uYmluZGluZ1Byb3ZpZGVyKTtcbihmdW5jdGlvbiAoKSB7XG4gICAga28uYmluZGluZ0hhbmRsZXJzID0ge307XG5cbiAgICAvLyBUaGUgZm9sbG93aW5nIGVsZW1lbnQgdHlwZXMgd2lsbCBub3QgYmUgcmVjdXJzZWQgaW50byBkdXJpbmcgYmluZGluZy4gSW4gdGhlIGZ1dHVyZSwgd2VcbiAgICAvLyBtYXkgY29uc2lkZXIgYWRkaW5nIDx0ZW1wbGF0ZT4gdG8gdGhpcyBsaXN0LCBiZWNhdXNlIHN1Y2ggZWxlbWVudHMnIGNvbnRlbnRzIGFyZSBhbHdheXNcbiAgICAvLyBpbnRlbmRlZCB0byBiZSBib3VuZCBpbiBhIGRpZmZlcmVudCBjb250ZXh0IGZyb20gd2hlcmUgdGhleSBhcHBlYXIgaW4gdGhlIGRvY3VtZW50LlxuICAgIHZhciBiaW5kaW5nRG9lc05vdFJlY3Vyc2VJbnRvRWxlbWVudFR5cGVzID0ge1xuICAgICAgICAvLyBEb24ndCB3YW50IGJpbmRpbmdzIHRoYXQgb3BlcmF0ZSBvbiB0ZXh0IG5vZGVzIHRvIG11dGF0ZSA8c2NyaXB0PiBjb250ZW50cyxcbiAgICAgICAgLy8gYmVjYXVzZSBpdCdzIHVuZXhwZWN0ZWQgYW5kIGEgcG90ZW50aWFsIFhTUyBpc3N1ZVxuICAgICAgICAnc2NyaXB0JzogdHJ1ZVxuICAgIH07XG5cbiAgICAvLyBVc2UgYW4gb3ZlcnJpZGFibGUgbWV0aG9kIGZvciByZXRyaWV2aW5nIGJpbmRpbmcgaGFuZGxlcnMgc28gdGhhdCBhIHBsdWdpbnMgbWF5IHN1cHBvcnQgZHluYW1pY2FsbHkgY3JlYXRlZCBoYW5kbGVyc1xuICAgIGtvWydnZXRCaW5kaW5nSGFuZGxlciddID0gZnVuY3Rpb24oYmluZGluZ0tleSkge1xuICAgICAgICByZXR1cm4ga28uYmluZGluZ0hhbmRsZXJzW2JpbmRpbmdLZXldO1xuICAgIH07XG5cbiAgICAvLyBUaGUga28uYmluZGluZ0NvbnRleHQgY29uc3RydWN0b3IgaXMgb25seSBjYWxsZWQgZGlyZWN0bHkgdG8gY3JlYXRlIHRoZSByb290IGNvbnRleHQuIEZvciBjaGlsZFxuICAgIC8vIGNvbnRleHRzLCB1c2UgYmluZGluZ0NvbnRleHQuY3JlYXRlQ2hpbGRDb250ZXh0IG9yIGJpbmRpbmdDb250ZXh0LmV4dGVuZC5cbiAgICBrby5iaW5kaW5nQ29udGV4dCA9IGZ1bmN0aW9uKGRhdGFJdGVtT3JBY2Nlc3NvciwgcGFyZW50Q29udGV4dCwgZGF0YUl0ZW1BbGlhcywgZXh0ZW5kQ2FsbGJhY2spIHtcblxuICAgICAgICAvLyBUaGUgYmluZGluZyBjb250ZXh0IG9iamVjdCBpbmNsdWRlcyBzdGF0aWMgcHJvcGVydGllcyBmb3IgdGhlIGN1cnJlbnQsIHBhcmVudCwgYW5kIHJvb3QgdmlldyBtb2RlbHMuXG4gICAgICAgIC8vIElmIGEgdmlldyBtb2RlbCBpcyBhY3R1YWxseSBzdG9yZWQgaW4gYW4gb2JzZXJ2YWJsZSwgdGhlIGNvcnJlc3BvbmRpbmcgYmluZGluZyBjb250ZXh0IG9iamVjdCwgYW5kXG4gICAgICAgIC8vIGFueSBjaGlsZCBjb250ZXh0cywgbXVzdCBiZSB1cGRhdGVkIHdoZW4gdGhlIHZpZXcgbW9kZWwgaXMgY2hhbmdlZC5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlQ29udGV4dCgpIHtcbiAgICAgICAgICAgIC8vIE1vc3Qgb2YgdGhlIHRpbWUsIHRoZSBjb250ZXh0IHdpbGwgZGlyZWN0bHkgZ2V0IGEgdmlldyBtb2RlbCBvYmplY3QsIGJ1dCBpZiBhIGZ1bmN0aW9uIGlzIGdpdmVuLFxuICAgICAgICAgICAgLy8gd2UgY2FsbCB0aGUgZnVuY3Rpb24gdG8gcmV0cmlldmUgdGhlIHZpZXcgbW9kZWwuIElmIHRoZSBmdW5jdGlvbiBhY2Nlc3NlcyBhbnkgb2JzZXZhYmxlcyBvciByZXR1cm5zXG4gICAgICAgICAgICAvLyBhbiBvYnNlcnZhYmxlLCB0aGUgZGVwZW5kZW5jeSBpcyB0cmFja2VkLCBhbmQgdGhvc2Ugb2JzZXJ2YWJsZXMgY2FuIGxhdGVyIGNhdXNlIHRoZSBiaW5kaW5nXG4gICAgICAgICAgICAvLyBjb250ZXh0IHRvIGJlIHVwZGF0ZWQuXG4gICAgICAgICAgICB2YXIgZGF0YUl0ZW1Pck9ic2VydmFibGUgPSBpc0Z1bmMgPyBkYXRhSXRlbU9yQWNjZXNzb3IoKSA6IGRhdGFJdGVtT3JBY2Nlc3NvcixcbiAgICAgICAgICAgICAgICBkYXRhSXRlbSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUoZGF0YUl0ZW1Pck9ic2VydmFibGUpO1xuXG4gICAgICAgICAgICBpZiAocGFyZW50Q29udGV4dCkge1xuICAgICAgICAgICAgICAgIC8vIFdoZW4gYSBcInBhcmVudFwiIGNvbnRleHQgaXMgZ2l2ZW4sIHJlZ2lzdGVyIGEgZGVwZW5kZW5jeSBvbiB0aGUgcGFyZW50IGNvbnRleHQuIFRodXMgd2hlbmV2ZXIgdGhlXG4gICAgICAgICAgICAgICAgLy8gcGFyZW50IGNvbnRleHQgaXMgdXBkYXRlZCwgdGhpcyBjb250ZXh0IHdpbGwgYWxzbyBiZSB1cGRhdGVkLlxuICAgICAgICAgICAgICAgIGlmIChwYXJlbnRDb250ZXh0Ll9zdWJzY3JpYmFibGUpXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudENvbnRleHQuX3N1YnNjcmliYWJsZSgpO1xuXG4gICAgICAgICAgICAgICAgLy8gQ29weSAkcm9vdCBhbmQgYW55IGN1c3RvbSBwcm9wZXJ0aWVzIGZyb20gdGhlIHBhcmVudCBjb250ZXh0XG4gICAgICAgICAgICAgICAga28udXRpbHMuZXh0ZW5kKHNlbGYsIHBhcmVudENvbnRleHQpO1xuXG4gICAgICAgICAgICAgICAgLy8gQmVjYXVzZSB0aGUgYWJvdmUgY29weSBvdmVyd3JpdGVzIG91ciBvd24gcHJvcGVydGllcywgd2UgbmVlZCB0byByZXNldCB0aGVtLlxuICAgICAgICAgICAgICAgIC8vIER1cmluZyB0aGUgZmlyc3QgZXhlY3V0aW9uLCBcInN1YnNjcmliYWJsZVwiIGlzbid0IHNldCwgc28gZG9uJ3QgYm90aGVyIGRvaW5nIHRoZSB1cGRhdGUgdGhlbi5cbiAgICAgICAgICAgICAgICBpZiAoc3Vic2NyaWJhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX3N1YnNjcmliYWJsZSA9IHN1YnNjcmliYWJsZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGZbJyRwYXJlbnRzJ10gPSBbXTtcbiAgICAgICAgICAgICAgICBzZWxmWyckcm9vdCddID0gZGF0YUl0ZW07XG5cbiAgICAgICAgICAgICAgICAvLyBFeHBvcnQgJ2tvJyBpbiB0aGUgYmluZGluZyBjb250ZXh0IHNvIGl0IHdpbGwgYmUgYXZhaWxhYmxlIGluIGJpbmRpbmdzIGFuZCB0ZW1wbGF0ZXNcbiAgICAgICAgICAgICAgICAvLyBldmVuIGlmICdrbycgaXNuJ3QgZXhwb3J0ZWQgYXMgYSBnbG9iYWwsIHN1Y2ggYXMgd2hlbiB1c2luZyBhbiBBTUQgbG9hZGVyLlxuICAgICAgICAgICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vU3RldmVTYW5kZXJzb24va25vY2tvdXQvaXNzdWVzLzQ5MFxuICAgICAgICAgICAgICAgIHNlbGZbJ2tvJ10gPSBrbztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGZbJyRyYXdEYXRhJ10gPSBkYXRhSXRlbU9yT2JzZXJ2YWJsZTtcbiAgICAgICAgICAgIHNlbGZbJyRkYXRhJ10gPSBkYXRhSXRlbTtcbiAgICAgICAgICAgIGlmIChkYXRhSXRlbUFsaWFzKVxuICAgICAgICAgICAgICAgIHNlbGZbZGF0YUl0ZW1BbGlhc10gPSBkYXRhSXRlbTtcblxuICAgICAgICAgICAgLy8gVGhlIGV4dGVuZENhbGxiYWNrIGZ1bmN0aW9uIGlzIHByb3ZpZGVkIHdoZW4gY3JlYXRpbmcgYSBjaGlsZCBjb250ZXh0IG9yIGV4dGVuZGluZyBhIGNvbnRleHQuXG4gICAgICAgICAgICAvLyBJdCBoYW5kbGVzIHRoZSBzcGVjaWZpYyBhY3Rpb25zIG5lZWRlZCB0byBmaW5pc2ggc2V0dGluZyB1cCB0aGUgYmluZGluZyBjb250ZXh0LiBBY3Rpb25zIGluIHRoaXNcbiAgICAgICAgICAgIC8vIGZ1bmN0aW9uIGNvdWxkIGFsc28gYWRkIGRlcGVuZGVuY2llcyB0byB0aGlzIGJpbmRpbmcgY29udGV4dC5cbiAgICAgICAgICAgIGlmIChleHRlbmRDYWxsYmFjaylcbiAgICAgICAgICAgICAgICBleHRlbmRDYWxsYmFjayhzZWxmLCBwYXJlbnRDb250ZXh0LCBkYXRhSXRlbSk7XG5cbiAgICAgICAgICAgIHJldHVybiBzZWxmWyckZGF0YSddO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGRpc3Bvc2VXaGVuKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGVzICYmICFrby51dGlscy5hbnlEb21Ob2RlSXNBdHRhY2hlZFRvRG9jdW1lbnQobm9kZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgaXNGdW5jID0gdHlwZW9mKGRhdGFJdGVtT3JBY2Nlc3NvcikgPT0gXCJmdW5jdGlvblwiICYmICFrby5pc09ic2VydmFibGUoZGF0YUl0ZW1PckFjY2Vzc29yKSxcbiAgICAgICAgICAgIG5vZGVzLFxuICAgICAgICAgICAgc3Vic2NyaWJhYmxlID0ga28uZGVwZW5kZW50T2JzZXJ2YWJsZSh1cGRhdGVDb250ZXh0LCBudWxsLCB7IGRpc3Bvc2VXaGVuOiBkaXNwb3NlV2hlbiwgZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkOiB0cnVlIH0pO1xuXG4gICAgICAgIC8vIEF0IHRoaXMgcG9pbnQsIHRoZSBiaW5kaW5nIGNvbnRleHQgaGFzIGJlZW4gaW5pdGlhbGl6ZWQsIGFuZCB0aGUgXCJzdWJzY3JpYmFibGVcIiBjb21wdXRlZCBvYnNlcnZhYmxlIGlzXG4gICAgICAgIC8vIHN1YnNjcmliZWQgdG8gYW55IG9ic2VydmFibGVzIHRoYXQgd2VyZSBhY2Nlc3NlZCBpbiB0aGUgcHJvY2Vzcy4gSWYgdGhlcmUgaXMgbm90aGluZyB0byB0cmFjaywgdGhlXG4gICAgICAgIC8vIGNvbXB1dGVkIHdpbGwgYmUgaW5hY3RpdmUsIGFuZCB3ZSBjYW4gc2FmZWx5IHRocm93IGl0IGF3YXkuIElmIGl0J3MgYWN0aXZlLCB0aGUgY29tcHV0ZWQgaXMgc3RvcmVkIGluXG4gICAgICAgIC8vIHRoZSBjb250ZXh0IG9iamVjdC5cbiAgICAgICAgaWYgKHN1YnNjcmliYWJsZS5pc0FjdGl2ZSgpKSB7XG4gICAgICAgICAgICBzZWxmLl9zdWJzY3JpYmFibGUgPSBzdWJzY3JpYmFibGU7XG5cbiAgICAgICAgICAgIC8vIEFsd2F5cyBub3RpZnkgYmVjYXVzZSBldmVuIGlmIHRoZSBtb2RlbCAoJGRhdGEpIGhhc24ndCBjaGFuZ2VkLCBvdGhlciBjb250ZXh0IHByb3BlcnRpZXMgbWlnaHQgaGF2ZSBjaGFuZ2VkXG4gICAgICAgICAgICBzdWJzY3JpYmFibGVbJ2VxdWFsaXR5Q29tcGFyZXInXSA9IG51bGw7XG5cbiAgICAgICAgICAgIC8vIFdlIG5lZWQgdG8gYmUgYWJsZSB0byBkaXNwb3NlIG9mIHRoaXMgY29tcHV0ZWQgb2JzZXJ2YWJsZSB3aGVuIGl0J3Mgbm8gbG9uZ2VyIG5lZWRlZC4gVGhpcyB3b3VsZCBiZVxuICAgICAgICAgICAgLy8gZWFzeSBpZiB3ZSBoYWQgYSBzaW5nbGUgbm9kZSB0byB3YXRjaCwgYnV0IGJpbmRpbmcgY29udGV4dHMgY2FuIGJlIHVzZWQgYnkgbWFueSBkaWZmZXJlbnQgbm9kZXMsIGFuZFxuICAgICAgICAgICAgLy8gd2UgY2Fubm90IGFzc3VtZSB0aGF0IHRob3NlIG5vZGVzIGhhdmUgYW55IHJlbGF0aW9uIHRvIGVhY2ggb3RoZXIuIFNvIGluc3RlYWQgd2UgdHJhY2sgYW55IG5vZGUgdGhhdFxuICAgICAgICAgICAgLy8gdGhlIGNvbnRleHQgaXMgYXR0YWNoZWQgdG8sIGFuZCBkaXNwb3NlIHRoZSBjb21wdXRlZCB3aGVuIGFsbCBvZiB0aG9zZSBub2RlcyBoYXZlIGJlZW4gY2xlYW5lZC5cblxuICAgICAgICAgICAgLy8gQWRkIHByb3BlcnRpZXMgdG8gKnN1YnNjcmliYWJsZSogaW5zdGVhZCBvZiAqc2VsZiogYmVjYXVzZSBhbnkgcHJvcGVydGllcyBhZGRlZCB0byAqc2VsZiogbWF5IGJlIG92ZXJ3cml0dGVuIG9uIHVwZGF0ZXNcbiAgICAgICAgICAgIG5vZGVzID0gW107XG4gICAgICAgICAgICBzdWJzY3JpYmFibGUuX2FkZE5vZGUgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICAgICAgbm9kZXMucHVzaChub2RlKTtcbiAgICAgICAgICAgICAgICBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwuYWRkRGlzcG9zZUNhbGxiYWNrKG5vZGUsIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAga28udXRpbHMuYXJyYXlSZW1vdmVJdGVtKG5vZGVzLCBub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFub2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmliYWJsZS5kaXNwb3NlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLl9zdWJzY3JpYmFibGUgPSBzdWJzY3JpYmFibGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBFeHRlbmQgdGhlIGJpbmRpbmcgY29udGV4dCBoaWVyYXJjaHkgd2l0aCBhIG5ldyB2aWV3IG1vZGVsIG9iamVjdC4gSWYgdGhlIHBhcmVudCBjb250ZXh0IGlzIHdhdGNoaW5nXG4gICAgLy8gYW55IG9ic2V2YWJsZXMsIHRoZSBuZXcgY2hpbGQgY29udGV4dCB3aWxsIGF1dG9tYXRpY2FsbHkgZ2V0IGEgZGVwZW5kZW5jeSBvbiB0aGUgcGFyZW50IGNvbnRleHQuXG4gICAgLy8gQnV0IHRoaXMgZG9lcyBub3QgbWVhbiB0aGF0IHRoZSAkZGF0YSB2YWx1ZSBvZiB0aGUgY2hpbGQgY29udGV4dCB3aWxsIGFsc28gZ2V0IHVwZGF0ZWQuIElmIHRoZSBjaGlsZFxuICAgIC8vIHZpZXcgbW9kZWwgYWxzbyBkZXBlbmRzIG9uIHRoZSBwYXJlbnQgdmlldyBtb2RlbCwgeW91IG11c3QgcHJvdmlkZSBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgY29ycmVjdFxuICAgIC8vIHZpZXcgbW9kZWwgb24gZWFjaCB1cGRhdGUuXG4gICAga28uYmluZGluZ0NvbnRleHQucHJvdG90eXBlWydjcmVhdGVDaGlsZENvbnRleHQnXSA9IGZ1bmN0aW9uIChkYXRhSXRlbU9yQWNjZXNzb3IsIGRhdGFJdGVtQWxpYXMsIGV4dGVuZENhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiBuZXcga28uYmluZGluZ0NvbnRleHQoZGF0YUl0ZW1PckFjY2Vzc29yLCB0aGlzLCBkYXRhSXRlbUFsaWFzLCBmdW5jdGlvbihzZWxmLCBwYXJlbnRDb250ZXh0KSB7XG4gICAgICAgICAgICAvLyBFeHRlbmQgdGhlIGNvbnRleHQgaGllcmFyY2h5IGJ5IHNldHRpbmcgdGhlIGFwcHJvcHJpYXRlIHBvaW50ZXJzXG4gICAgICAgICAgICBzZWxmWyckcGFyZW50Q29udGV4dCddID0gcGFyZW50Q29udGV4dDtcbiAgICAgICAgICAgIHNlbGZbJyRwYXJlbnQnXSA9IHBhcmVudENvbnRleHRbJyRkYXRhJ107XG4gICAgICAgICAgICBzZWxmWyckcGFyZW50cyddID0gKHBhcmVudENvbnRleHRbJyRwYXJlbnRzJ10gfHwgW10pLnNsaWNlKDApO1xuICAgICAgICAgICAgc2VsZlsnJHBhcmVudHMnXS51bnNoaWZ0KHNlbGZbJyRwYXJlbnQnXSk7XG4gICAgICAgICAgICBpZiAoZXh0ZW5kQ2FsbGJhY2spXG4gICAgICAgICAgICAgICAgZXh0ZW5kQ2FsbGJhY2soc2VsZik7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBFeHRlbmQgdGhlIGJpbmRpbmcgY29udGV4dCB3aXRoIG5ldyBjdXN0b20gcHJvcGVydGllcy4gVGhpcyBkb2Vzbid0IGNoYW5nZSB0aGUgY29udGV4dCBoaWVyYXJjaHkuXG4gICAgLy8gU2ltaWxhcmx5IHRvIFwiY2hpbGRcIiBjb250ZXh0cywgcHJvdmlkZSBhIGZ1bmN0aW9uIGhlcmUgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIGNvcnJlY3QgdmFsdWVzIGFyZSBzZXRcbiAgICAvLyB3aGVuIGFuIG9ic2VydmFibGUgdmlldyBtb2RlbCBpcyB1cGRhdGVkLlxuICAgIGtvLmJpbmRpbmdDb250ZXh0LnByb3RvdHlwZVsnZXh0ZW5kJ10gPSBmdW5jdGlvbihwcm9wZXJ0aWVzKSB7XG4gICAgICAgIC8vIElmIHRoZSBwYXJlbnQgY29udGV4dCByZWZlcmVuY2VzIGFuIG9ic2VydmFibGUgdmlldyBtb2RlbCwgXCJfc3Vic2NyaWJhYmxlXCIgd2lsbCBhbHdheXMgYmUgdGhlXG4gICAgICAgIC8vIGxhdGVzdCB2aWV3IG1vZGVsIG9iamVjdC4gSWYgbm90LCBcIl9zdWJzY3JpYmFibGVcIiBpc24ndCBzZXQsIGFuZCB3ZSBjYW4gdXNlIHRoZSBzdGF0aWMgXCIkZGF0YVwiIHZhbHVlLlxuICAgICAgICByZXR1cm4gbmV3IGtvLmJpbmRpbmdDb250ZXh0KHRoaXMuX3N1YnNjcmliYWJsZSB8fCB0aGlzWyckZGF0YSddLCB0aGlzLCBudWxsLCBmdW5jdGlvbihzZWxmLCBwYXJlbnRDb250ZXh0KSB7XG4gICAgICAgICAgICAvLyBUaGlzIFwiY2hpbGRcIiBjb250ZXh0IGRvZXNuJ3QgZGlyZWN0bHkgdHJhY2sgYSBwYXJlbnQgb2JzZXJ2YWJsZSB2aWV3IG1vZGVsLFxuICAgICAgICAgICAgLy8gc28gd2UgbmVlZCB0byBtYW51YWxseSBzZXQgdGhlICRyYXdEYXRhIHZhbHVlIHRvIG1hdGNoIHRoZSBwYXJlbnQuXG4gICAgICAgICAgICBzZWxmWyckcmF3RGF0YSddID0gcGFyZW50Q29udGV4dFsnJHJhd0RhdGEnXTtcbiAgICAgICAgICAgIGtvLnV0aWxzLmV4dGVuZChzZWxmLCB0eXBlb2YocHJvcGVydGllcykgPT0gXCJmdW5jdGlvblwiID8gcHJvcGVydGllcygpIDogcHJvcGVydGllcyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBSZXR1cm5zIHRoZSB2YWx1ZUFjY2Vzb3IgZnVuY3Rpb24gZm9yIGEgYmluZGluZyB2YWx1ZVxuICAgIGZ1bmN0aW9uIG1ha2VWYWx1ZUFjY2Vzc29yKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm5zIHRoZSB2YWx1ZSBvZiBhIHZhbHVlQWNjZXNzb3IgZnVuY3Rpb25cbiAgICBmdW5jdGlvbiBldmFsdWF0ZVZhbHVlQWNjZXNzb3IodmFsdWVBY2Nlc3Nvcikge1xuICAgICAgICByZXR1cm4gdmFsdWVBY2Nlc3NvcigpO1xuICAgIH1cblxuICAgIC8vIEdpdmVuIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGJpbmRpbmdzLCBjcmVhdGUgYW5kIHJldHVybiBhIG5ldyBvYmplY3QgdGhhdCBjb250YWluc1xuICAgIC8vIGJpbmRpbmcgdmFsdWUtYWNjZXNzb3JzIGZ1bmN0aW9ucy4gRWFjaCBhY2Nlc3NvciBmdW5jdGlvbiBjYWxscyB0aGUgb3JpZ2luYWwgZnVuY3Rpb25cbiAgICAvLyBzbyB0aGF0IGl0IGFsd2F5cyBnZXRzIHRoZSBsYXRlc3QgdmFsdWUgYW5kIGFsbCBkZXBlbmRlbmNpZXMgYXJlIGNhcHR1cmVkLiBUaGlzIGlzIHVzZWRcbiAgICAvLyBieSBrby5hcHBseUJpbmRpbmdzVG9Ob2RlIGFuZCBnZXRCaW5kaW5nc0FuZE1ha2VBY2Nlc3NvcnMuXG4gICAgZnVuY3Rpb24gbWFrZUFjY2Vzc29yc0Zyb21GdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4ga28udXRpbHMub2JqZWN0TWFwKGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uaWdub3JlKGNhbGxiYWNrKSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpW2tleV07XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBHaXZlbiBhIGJpbmRpbmdzIGZ1bmN0aW9uIG9yIG9iamVjdCwgY3JlYXRlIGFuZCByZXR1cm4gYSBuZXcgb2JqZWN0IHRoYXQgY29udGFpbnNcbiAgICAvLyBiaW5kaW5nIHZhbHVlLWFjY2Vzc29ycyBmdW5jdGlvbnMuIFRoaXMgaXMgdXNlZCBieSBrby5hcHBseUJpbmRpbmdzVG9Ob2RlLlxuICAgIGZ1bmN0aW9uIG1ha2VCaW5kaW5nQWNjZXNzb3JzKGJpbmRpbmdzLCBjb250ZXh0LCBub2RlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYmluZGluZ3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiBtYWtlQWNjZXNzb3JzRnJvbUZ1bmN0aW9uKGJpbmRpbmdzLmJpbmQobnVsbCwgY29udGV4dCwgbm9kZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGtvLnV0aWxzLm9iamVjdE1hcChiaW5kaW5ncywgbWFrZVZhbHVlQWNjZXNzb3IpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBpcyB1c2VkIGlmIHRoZSBiaW5kaW5nIHByb3ZpZGVyIGRvZXNuJ3QgaW5jbHVkZSBhIGdldEJpbmRpbmdBY2Nlc3NvcnMgZnVuY3Rpb24uXG4gICAgLy8gSXQgbXVzdCBiZSBjYWxsZWQgd2l0aCAndGhpcycgc2V0IHRvIHRoZSBwcm92aWRlciBpbnN0YW5jZS5cbiAgICBmdW5jdGlvbiBnZXRCaW5kaW5nc0FuZE1ha2VBY2Nlc3NvcnMobm9kZSwgY29udGV4dCkge1xuICAgICAgICByZXR1cm4gbWFrZUFjY2Vzc29yc0Zyb21GdW5jdGlvbih0aGlzWydnZXRCaW5kaW5ncyddLmJpbmQodGhpcywgbm9kZSwgY29udGV4dCkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlVGhhdEJpbmRpbmdJc0FsbG93ZWRGb3JWaXJ0dWFsRWxlbWVudHMoYmluZGluZ05hbWUpIHtcbiAgICAgICAgdmFyIHZhbGlkYXRvciA9IGtvLnZpcnR1YWxFbGVtZW50cy5hbGxvd2VkQmluZGluZ3NbYmluZGluZ05hbWVdO1xuICAgICAgICBpZiAoIXZhbGlkYXRvcilcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBiaW5kaW5nICdcIiArIGJpbmRpbmdOYW1lICsgXCInIGNhbm5vdCBiZSB1c2VkIHdpdGggdmlydHVhbCBlbGVtZW50c1wiKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFwcGx5QmluZGluZ3NUb0Rlc2NlbmRhbnRzSW50ZXJuYWwgKGJpbmRpbmdDb250ZXh0LCBlbGVtZW50T3JWaXJ0dWFsRWxlbWVudCwgYmluZGluZ0NvbnRleHRzTWF5RGlmZmVyRnJvbURvbVBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRDaGlsZCxcbiAgICAgICAgICAgIG5leHRJblF1ZXVlID0ga28udmlydHVhbEVsZW1lbnRzLmZpcnN0Q2hpbGQoZWxlbWVudE9yVmlydHVhbEVsZW1lbnQpLFxuICAgICAgICAgICAgcHJvdmlkZXIgPSBrby5iaW5kaW5nUHJvdmlkZXJbJ2luc3RhbmNlJ10sXG4gICAgICAgICAgICBwcmVwcm9jZXNzTm9kZSA9IHByb3ZpZGVyWydwcmVwcm9jZXNzTm9kZSddO1xuXG4gICAgICAgIC8vIFByZXByb2Nlc3NpbmcgYWxsb3dzIGEgYmluZGluZyBwcm92aWRlciB0byBtdXRhdGUgYSBub2RlIGJlZm9yZSBiaW5kaW5ncyBhcmUgYXBwbGllZCB0byBpdC4gRm9yIGV4YW1wbGUgaXQnc1xuICAgICAgICAvLyBwb3NzaWJsZSB0byBpbnNlcnQgbmV3IHNpYmxpbmdzIGFmdGVyIGl0LCBhbmQvb3IgcmVwbGFjZSB0aGUgbm9kZSB3aXRoIGEgZGlmZmVyZW50IG9uZS4gVGhpcyBjYW4gYmUgdXNlZCB0b1xuICAgICAgICAvLyBpbXBsZW1lbnQgY3VzdG9tIGJpbmRpbmcgc3ludGF4ZXMsIHN1Y2ggYXMge3sgdmFsdWUgfX0gZm9yIHN0cmluZyBpbnRlcnBvbGF0aW9uLCBvciBjdXN0b20gZWxlbWVudCB0eXBlcyB0aGF0XG4gICAgICAgIC8vIHRyaWdnZXIgaW5zZXJ0aW9uIG9mIDx0ZW1wbGF0ZT4gY29udGVudHMgYXQgdGhhdCBwb2ludCBpbiB0aGUgZG9jdW1lbnQuXG4gICAgICAgIGlmIChwcmVwcm9jZXNzTm9kZSkge1xuICAgICAgICAgICAgd2hpbGUgKGN1cnJlbnRDaGlsZCA9IG5leHRJblF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgbmV4dEluUXVldWUgPSBrby52aXJ0dWFsRWxlbWVudHMubmV4dFNpYmxpbmcoY3VycmVudENoaWxkKTtcbiAgICAgICAgICAgICAgICBwcmVwcm9jZXNzTm9kZS5jYWxsKHByb3ZpZGVyLCBjdXJyZW50Q2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gUmVzZXQgbmV4dEluUXVldWUgZm9yIHRoZSBuZXh0IGxvb3BcbiAgICAgICAgICAgIG5leHRJblF1ZXVlID0ga28udmlydHVhbEVsZW1lbnRzLmZpcnN0Q2hpbGQoZWxlbWVudE9yVmlydHVhbEVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUgKGN1cnJlbnRDaGlsZCA9IG5leHRJblF1ZXVlKSB7XG4gICAgICAgICAgICAvLyBLZWVwIGEgcmVjb3JkIG9mIHRoZSBuZXh0IGNoaWxkICpiZWZvcmUqIGFwcGx5aW5nIGJpbmRpbmdzLCBpbiBjYXNlIHRoZSBiaW5kaW5nIHJlbW92ZXMgdGhlIGN1cnJlbnQgY2hpbGQgZnJvbSBpdHMgcG9zaXRpb25cbiAgICAgICAgICAgIG5leHRJblF1ZXVlID0ga28udmlydHVhbEVsZW1lbnRzLm5leHRTaWJsaW5nKGN1cnJlbnRDaGlsZCk7XG4gICAgICAgICAgICBhcHBseUJpbmRpbmdzVG9Ob2RlQW5kRGVzY2VuZGFudHNJbnRlcm5hbChiaW5kaW5nQ29udGV4dCwgY3VycmVudENoaWxkLCBiaW5kaW5nQ29udGV4dHNNYXlEaWZmZXJGcm9tRG9tUGFyZW50RWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhcHBseUJpbmRpbmdzVG9Ob2RlQW5kRGVzY2VuZGFudHNJbnRlcm5hbCAoYmluZGluZ0NvbnRleHQsIG5vZGVWZXJpZmllZCwgYmluZGluZ0NvbnRleHRNYXlEaWZmZXJGcm9tRG9tUGFyZW50RWxlbWVudCkge1xuICAgICAgICB2YXIgc2hvdWxkQmluZERlc2NlbmRhbnRzID0gdHJ1ZTtcblxuICAgICAgICAvLyBQZXJmIG9wdGltaXNhdGlvbjogQXBwbHkgYmluZGluZ3Mgb25seSBpZi4uLlxuICAgICAgICAvLyAoMSkgV2UgbmVlZCB0byBzdG9yZSB0aGUgYmluZGluZyBjb250ZXh0IG9uIHRoaXMgbm9kZSAoYmVjYXVzZSBpdCBtYXkgZGlmZmVyIGZyb20gdGhlIERPTSBwYXJlbnQgbm9kZSdzIGJpbmRpbmcgY29udGV4dClcbiAgICAgICAgLy8gICAgIE5vdGUgdGhhdCB3ZSBjYW4ndCBzdG9yZSBiaW5kaW5nIGNvbnRleHRzIG9uIG5vbi1lbGVtZW50cyAoZS5nLiwgdGV4dCBub2RlcyksIGFzIElFIGRvZXNuJ3QgYWxsb3cgZXhwYW5kbyBwcm9wZXJ0aWVzIGZvciB0aG9zZVxuICAgICAgICAvLyAoMikgSXQgbWlnaHQgaGF2ZSBiaW5kaW5ncyAoZS5nLiwgaXQgaGFzIGEgZGF0YS1iaW5kIGF0dHJpYnV0ZSwgb3IgaXQncyBhIG1hcmtlciBmb3IgYSBjb250YWluZXJsZXNzIHRlbXBsYXRlKVxuICAgICAgICB2YXIgaXNFbGVtZW50ID0gKG5vZGVWZXJpZmllZC5ub2RlVHlwZSA9PT0gMSk7XG4gICAgICAgIGlmIChpc0VsZW1lbnQpIC8vIFdvcmthcm91bmQgSUUgPD0gOCBIVE1MIHBhcnNpbmcgd2VpcmRuZXNzXG4gICAgICAgICAgICBrby52aXJ0dWFsRWxlbWVudHMubm9ybWFsaXNlVmlydHVhbEVsZW1lbnREb21TdHJ1Y3R1cmUobm9kZVZlcmlmaWVkKTtcblxuICAgICAgICB2YXIgc2hvdWxkQXBwbHlCaW5kaW5ncyA9IChpc0VsZW1lbnQgJiYgYmluZGluZ0NvbnRleHRNYXlEaWZmZXJGcm9tRG9tUGFyZW50RWxlbWVudCkgICAgICAgICAgICAgLy8gQ2FzZSAoMSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBrby5iaW5kaW5nUHJvdmlkZXJbJ2luc3RhbmNlJ11bJ25vZGVIYXNCaW5kaW5ncyddKG5vZGVWZXJpZmllZCk7ICAgICAgIC8vIENhc2UgKDIpXG4gICAgICAgIGlmIChzaG91bGRBcHBseUJpbmRpbmdzKVxuICAgICAgICAgICAgc2hvdWxkQmluZERlc2NlbmRhbnRzID0gYXBwbHlCaW5kaW5nc1RvTm9kZUludGVybmFsKG5vZGVWZXJpZmllZCwgbnVsbCwgYmluZGluZ0NvbnRleHQsIGJpbmRpbmdDb250ZXh0TWF5RGlmZmVyRnJvbURvbVBhcmVudEVsZW1lbnQpWydzaG91bGRCaW5kRGVzY2VuZGFudHMnXTtcblxuICAgICAgICBpZiAoc2hvdWxkQmluZERlc2NlbmRhbnRzICYmICFiaW5kaW5nRG9lc05vdFJlY3Vyc2VJbnRvRWxlbWVudFR5cGVzW2tvLnV0aWxzLnRhZ05hbWVMb3dlcihub2RlVmVyaWZpZWQpXSkge1xuICAgICAgICAgICAgLy8gV2UncmUgcmVjdXJzaW5nIGF1dG9tYXRpY2FsbHkgaW50byAocmVhbCBvciB2aXJ0dWFsKSBjaGlsZCBub2RlcyB3aXRob3V0IGNoYW5naW5nIGJpbmRpbmcgY29udGV4dHMuIFNvLFxuICAgICAgICAgICAgLy8gICogRm9yIGNoaWxkcmVuIG9mIGEgKnJlYWwqIGVsZW1lbnQsIHRoZSBiaW5kaW5nIGNvbnRleHQgaXMgY2VydGFpbmx5IHRoZSBzYW1lIGFzIG9uIHRoZWlyIERPTSAucGFyZW50Tm9kZSxcbiAgICAgICAgICAgIC8vICAgIGhlbmNlIGJpbmRpbmdDb250ZXh0c01heURpZmZlckZyb21Eb21QYXJlbnRFbGVtZW50IGlzIGZhbHNlXG4gICAgICAgICAgICAvLyAgKiBGb3IgY2hpbGRyZW4gb2YgYSAqdmlydHVhbCogZWxlbWVudCwgd2UgY2FuJ3QgYmUgc3VyZS4gRXZhbHVhdGluZyAucGFyZW50Tm9kZSBvbiB0aG9zZSBjaGlsZHJlbiBtYXlcbiAgICAgICAgICAgIC8vICAgIHNraXAgb3ZlciBhbnkgbnVtYmVyIG9mIGludGVybWVkaWF0ZSB2aXJ0dWFsIGVsZW1lbnRzLCBhbnkgb2Ygd2hpY2ggbWlnaHQgZGVmaW5lIGEgY3VzdG9tIGJpbmRpbmcgY29udGV4dCxcbiAgICAgICAgICAgIC8vICAgIGhlbmNlIGJpbmRpbmdDb250ZXh0c01heURpZmZlckZyb21Eb21QYXJlbnRFbGVtZW50IGlzIHRydWVcbiAgICAgICAgICAgIGFwcGx5QmluZGluZ3NUb0Rlc2NlbmRhbnRzSW50ZXJuYWwoYmluZGluZ0NvbnRleHQsIG5vZGVWZXJpZmllZCwgLyogYmluZGluZ0NvbnRleHRzTWF5RGlmZmVyRnJvbURvbVBhcmVudEVsZW1lbnQ6ICovICFpc0VsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGJvdW5kRWxlbWVudERvbURhdGFLZXkgPSBrby51dGlscy5kb21EYXRhLm5leHRLZXkoKTtcblxuXG4gICAgZnVuY3Rpb24gdG9wb2xvZ2ljYWxTb3J0QmluZGluZ3MoYmluZGluZ3MpIHtcbiAgICAgICAgLy8gRGVwdGgtZmlyc3Qgc29ydFxuICAgICAgICB2YXIgcmVzdWx0ID0gW10sICAgICAgICAgICAgICAgIC8vIFRoZSBsaXN0IG9mIGtleS9oYW5kbGVyIHBhaXJzIHRoYXQgd2Ugd2lsbCByZXR1cm5cbiAgICAgICAgICAgIGJpbmRpbmdzQ29uc2lkZXJlZCA9IHt9LCAgICAvLyBBIHRlbXBvcmFyeSByZWNvcmQgb2Ygd2hpY2ggYmluZGluZ3MgYXJlIGFscmVhZHkgaW4gJ3Jlc3VsdCdcbiAgICAgICAgICAgIGN5Y2xpY0RlcGVuZGVuY3lTdGFjayA9IFtdOyAvLyBLZWVwcyB0cmFjayBvZiBhIGRlcHRoLXNlYXJjaCBzbyB0aGF0LCBpZiB0aGVyZSdzIGEgY3ljbGUsIHdlIGtub3cgd2hpY2ggYmluZGluZ3MgY2F1c2VkIGl0XG4gICAgICAgIGtvLnV0aWxzLm9iamVjdEZvckVhY2goYmluZGluZ3MsIGZ1bmN0aW9uIHB1c2hCaW5kaW5nKGJpbmRpbmdLZXkpIHtcbiAgICAgICAgICAgIGlmICghYmluZGluZ3NDb25zaWRlcmVkW2JpbmRpbmdLZXldKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJpbmRpbmcgPSBrb1snZ2V0QmluZGluZ0hhbmRsZXInXShiaW5kaW5nS2V5KTtcbiAgICAgICAgICAgICAgICBpZiAoYmluZGluZykge1xuICAgICAgICAgICAgICAgICAgICAvLyBGaXJzdCBhZGQgZGVwZW5kZW5jaWVzIChpZiBhbnkpIG9mIHRoZSBjdXJyZW50IGJpbmRpbmdcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJpbmRpbmdbJ2FmdGVyJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN5Y2xpY0RlcGVuZGVuY3lTdGFjay5wdXNoKGJpbmRpbmdLZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAga28udXRpbHMuYXJyYXlGb3JFYWNoKGJpbmRpbmdbJ2FmdGVyJ10sIGZ1bmN0aW9uKGJpbmRpbmdEZXBlbmRlbmN5S2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJpbmRpbmdzW2JpbmRpbmdEZXBlbmRlbmN5S2V5XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoa28udXRpbHMuYXJyYXlJbmRleE9mKGN5Y2xpY0RlcGVuZGVuY3lTdGFjaywgYmluZGluZ0RlcGVuZGVuY3lLZXkpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJDYW5ub3QgY29tYmluZSB0aGUgZm9sbG93aW5nIGJpbmRpbmdzLCBiZWNhdXNlIHRoZXkgaGF2ZSBhIGN5Y2xpYyBkZXBlbmRlbmN5OiBcIiArIGN5Y2xpY0RlcGVuZGVuY3lTdGFjay5qb2luKFwiLCBcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHVzaEJpbmRpbmcoYmluZGluZ0RlcGVuZGVuY3lLZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjeWNsaWNEZXBlbmRlbmN5U3RhY2subGVuZ3RoLS07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gTmV4dCBhZGQgdGhlIGN1cnJlbnQgYmluZGluZ1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh7IGtleTogYmluZGluZ0tleSwgaGFuZGxlcjogYmluZGluZyB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYmluZGluZ3NDb25zaWRlcmVkW2JpbmRpbmdLZXldID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhcHBseUJpbmRpbmdzVG9Ob2RlSW50ZXJuYWwobm9kZSwgc291cmNlQmluZGluZ3MsIGJpbmRpbmdDb250ZXh0LCBiaW5kaW5nQ29udGV4dE1heURpZmZlckZyb21Eb21QYXJlbnRFbGVtZW50KSB7XG4gICAgICAgIC8vIFByZXZlbnQgbXVsdGlwbGUgYXBwbHlCaW5kaW5ncyBjYWxscyBmb3IgdGhlIHNhbWUgbm9kZSwgZXhjZXB0IHdoZW4gYSBiaW5kaW5nIHZhbHVlIGlzIHNwZWNpZmllZFxuICAgICAgICB2YXIgYWxyZWFkeUJvdW5kID0ga28udXRpbHMuZG9tRGF0YS5nZXQobm9kZSwgYm91bmRFbGVtZW50RG9tRGF0YUtleSk7XG4gICAgICAgIGlmICghc291cmNlQmluZGluZ3MpIHtcbiAgICAgICAgICAgIGlmIChhbHJlYWR5Qm91bmQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIllvdSBjYW5ub3QgYXBwbHkgYmluZGluZ3MgbXVsdGlwbGUgdGltZXMgdG8gdGhlIHNhbWUgZWxlbWVudC5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBrby51dGlscy5kb21EYXRhLnNldChub2RlLCBib3VuZEVsZW1lbnREb21EYXRhS2V5LCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE9wdGltaXphdGlvbjogRG9uJ3Qgc3RvcmUgdGhlIGJpbmRpbmcgY29udGV4dCBvbiB0aGlzIG5vZGUgaWYgaXQncyBkZWZpbml0ZWx5IHRoZSBzYW1lIGFzIG9uIG5vZGUucGFyZW50Tm9kZSwgYmVjYXVzZVxuICAgICAgICAvLyB3ZSBjYW4gZWFzaWx5IHJlY292ZXIgaXQganVzdCBieSBzY2FubmluZyB1cCB0aGUgbm9kZSdzIGFuY2VzdG9ycyBpbiB0aGUgRE9NXG4gICAgICAgIC8vIChub3RlOiBoZXJlLCBwYXJlbnQgbm9kZSBtZWFucyBcInJlYWwgRE9NIHBhcmVudFwiIG5vdCBcInZpcnR1YWwgcGFyZW50XCIsIGFzIHRoZXJlJ3Mgbm8gTygxKSB3YXkgdG8gZmluZCB0aGUgdmlydHVhbCBwYXJlbnQpXG4gICAgICAgIGlmICghYWxyZWFkeUJvdW5kICYmIGJpbmRpbmdDb250ZXh0TWF5RGlmZmVyRnJvbURvbVBhcmVudEVsZW1lbnQpXG4gICAgICAgICAgICBrby5zdG9yZWRCaW5kaW5nQ29udGV4dEZvck5vZGUobm9kZSwgYmluZGluZ0NvbnRleHQpO1xuXG4gICAgICAgIC8vIFVzZSBiaW5kaW5ncyBpZiBnaXZlbiwgb3RoZXJ3aXNlIGZhbGwgYmFjayBvbiBhc2tpbmcgdGhlIGJpbmRpbmdzIHByb3ZpZGVyIHRvIGdpdmUgdXMgc29tZSBiaW5kaW5nc1xuICAgICAgICB2YXIgYmluZGluZ3M7XG4gICAgICAgIGlmIChzb3VyY2VCaW5kaW5ncyAmJiB0eXBlb2Ygc291cmNlQmluZGluZ3MgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGJpbmRpbmdzID0gc291cmNlQmluZGluZ3M7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgcHJvdmlkZXIgPSBrby5iaW5kaW5nUHJvdmlkZXJbJ2luc3RhbmNlJ10sXG4gICAgICAgICAgICAgICAgZ2V0QmluZGluZ3MgPSBwcm92aWRlclsnZ2V0QmluZGluZ0FjY2Vzc29ycyddIHx8IGdldEJpbmRpbmdzQW5kTWFrZUFjY2Vzc29ycztcblxuICAgICAgICAgICAgLy8gR2V0IHRoZSBiaW5kaW5nIGZyb20gdGhlIHByb3ZpZGVyIHdpdGhpbiBhIGNvbXB1dGVkIG9ic2VydmFibGUgc28gdGhhdCB3ZSBjYW4gdXBkYXRlIHRoZSBiaW5kaW5ncyB3aGVuZXZlclxuICAgICAgICAgICAgLy8gdGhlIGJpbmRpbmcgY29udGV4dCBpcyB1cGRhdGVkIG9yIGlmIHRoZSBiaW5kaW5nIHByb3ZpZGVyIGFjY2Vzc2VzIG9ic2VydmFibGVzLlxuICAgICAgICAgICAgdmFyIGJpbmRpbmdzVXBkYXRlciA9IGtvLmRlcGVuZGVudE9ic2VydmFibGUoXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmdzID0gc291cmNlQmluZGluZ3MgPyBzb3VyY2VCaW5kaW5ncyhiaW5kaW5nQ29udGV4dCwgbm9kZSkgOiBnZXRCaW5kaW5ncy5jYWxsKHByb3ZpZGVyLCBub2RlLCBiaW5kaW5nQ29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIFJlZ2lzdGVyIGEgZGVwZW5kZW5jeSBvbiB0aGUgYmluZGluZyBjb250ZXh0IHRvIHN1cHBvcnQgb2JzZXZhYmxlIHZpZXcgbW9kZWxzLlxuICAgICAgICAgICAgICAgICAgICBpZiAoYmluZGluZ3MgJiYgYmluZGluZ0NvbnRleHQuX3N1YnNjcmliYWJsZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGJpbmRpbmdDb250ZXh0Ll9zdWJzY3JpYmFibGUoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJpbmRpbmdzO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbnVsbCwgeyBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IG5vZGUgfVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgaWYgKCFiaW5kaW5ncyB8fCAhYmluZGluZ3NVcGRhdGVyLmlzQWN0aXZlKCkpXG4gICAgICAgICAgICAgICAgYmluZGluZ3NVcGRhdGVyID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBiaW5kaW5nSGFuZGxlclRoYXRDb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5ncztcbiAgICAgICAgaWYgKGJpbmRpbmdzKSB7XG4gICAgICAgICAgICAvLyBSZXR1cm4gdGhlIHZhbHVlIGFjY2Vzc29yIGZvciBhIGdpdmVuIGJpbmRpbmcuIFdoZW4gYmluZGluZ3MgYXJlIHN0YXRpYyAod29uJ3QgYmUgdXBkYXRlZCBiZWNhdXNlIG9mIGEgYmluZGluZ1xuICAgICAgICAgICAgLy8gY29udGV4dCB1cGRhdGUpLCBqdXN0IHJldHVybiB0aGUgdmFsdWUgYWNjZXNzb3IgZnJvbSB0aGUgYmluZGluZy4gT3RoZXJ3aXNlLCByZXR1cm4gYSBmdW5jdGlvbiB0aGF0IGFsd2F5cyBnZXRzXG4gICAgICAgICAgICAvLyB0aGUgbGF0ZXN0IGJpbmRpbmcgdmFsdWUgYW5kIHJlZ2lzdGVycyBhIGRlcGVuZGVuY3kgb24gdGhlIGJpbmRpbmcgdXBkYXRlci5cbiAgICAgICAgICAgIHZhciBnZXRWYWx1ZUFjY2Vzc29yID0gYmluZGluZ3NVcGRhdGVyXG4gICAgICAgICAgICAgICAgPyBmdW5jdGlvbihiaW5kaW5nS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBldmFsdWF0ZVZhbHVlQWNjZXNzb3IoYmluZGluZ3NVcGRhdGVyKClbYmluZGluZ0tleV0pO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0gOiBmdW5jdGlvbihiaW5kaW5nS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiaW5kaW5nc1tiaW5kaW5nS2V5XTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBVc2Ugb2YgYWxsQmluZGluZ3MgYXMgYSBmdW5jdGlvbiBpcyBtYWludGFpbmVkIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSwgYnV0IGl0cyB1c2UgaXMgZGVwcmVjYXRlZFxuICAgICAgICAgICAgZnVuY3Rpb24gYWxsQmluZGluZ3MoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtvLnV0aWxzLm9iamVjdE1hcChiaW5kaW5nc1VwZGF0ZXIgPyBiaW5kaW5nc1VwZGF0ZXIoKSA6IGJpbmRpbmdzLCBldmFsdWF0ZVZhbHVlQWNjZXNzb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBpcyB0aGUgMy54IGFsbEJpbmRpbmdzIEFQSVxuICAgICAgICAgICAgYWxsQmluZGluZ3NbJ2dldCddID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJpbmRpbmdzW2tleV0gJiYgZXZhbHVhdGVWYWx1ZUFjY2Vzc29yKGdldFZhbHVlQWNjZXNzb3Ioa2V5KSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYWxsQmluZGluZ3NbJ2hhcyddID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtleSBpbiBiaW5kaW5ncztcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIEZpcnN0IHB1dCB0aGUgYmluZGluZ3MgaW50byB0aGUgcmlnaHQgb3JkZXJcbiAgICAgICAgICAgIHZhciBvcmRlcmVkQmluZGluZ3MgPSB0b3BvbG9naWNhbFNvcnRCaW5kaW5ncyhiaW5kaW5ncyk7XG5cbiAgICAgICAgICAgIC8vIEdvIHRocm91Z2ggdGhlIHNvcnRlZCBiaW5kaW5ncywgY2FsbGluZyBpbml0IGFuZCB1cGRhdGUgZm9yIGVhY2hcbiAgICAgICAgICAgIGtvLnV0aWxzLmFycmF5Rm9yRWFjaChvcmRlcmVkQmluZGluZ3MsIGZ1bmN0aW9uKGJpbmRpbmdLZXlBbmRIYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgLy8gTm90ZSB0aGF0IHRvcG9sb2dpY2FsU29ydEJpbmRpbmdzIGhhcyBhbHJlYWR5IGZpbHRlcmVkIG91dCBhbnkgbm9uZXhpc3RlbnQgYmluZGluZyBoYW5kbGVycyxcbiAgICAgICAgICAgICAgICAvLyBzbyBiaW5kaW5nS2V5QW5kSGFuZGxlci5oYW5kbGVyIHdpbGwgYWx3YXlzIGJlIG5vbm51bGwuXG4gICAgICAgICAgICAgICAgdmFyIGhhbmRsZXJJbml0Rm4gPSBiaW5kaW5nS2V5QW5kSGFuZGxlci5oYW5kbGVyW1wiaW5pdFwiXSxcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlclVwZGF0ZUZuID0gYmluZGluZ0tleUFuZEhhbmRsZXIuaGFuZGxlcltcInVwZGF0ZVwiXSxcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZ0tleSA9IGJpbmRpbmdLZXlBbmRIYW5kbGVyLmtleTtcblxuICAgICAgICAgICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSA4KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlVGhhdEJpbmRpbmdJc0FsbG93ZWRGb3JWaXJ0dWFsRWxlbWVudHMoYmluZGluZ0tleSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gUnVuIGluaXQsIGlnbm9yaW5nIGFueSBkZXBlbmRlbmNpZXNcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBoYW5kbGVySW5pdEZuID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5pZ25vcmUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluaXRSZXN1bHQgPSBoYW5kbGVySW5pdEZuKG5vZGUsIGdldFZhbHVlQWNjZXNzb3IoYmluZGluZ0tleSksIGFsbEJpbmRpbmdzLCBiaW5kaW5nQ29udGV4dFsnJGRhdGEnXSwgYmluZGluZ0NvbnRleHQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhpcyBiaW5kaW5nIGhhbmRsZXIgY2xhaW1zIHRvIGNvbnRyb2wgZGVzY2VuZGFudCBiaW5kaW5ncywgbWFrZSBhIG5vdGUgb2YgdGhpc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbml0UmVzdWx0ICYmIGluaXRSZXN1bHRbJ2NvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJpbmRpbmdIYW5kbGVyVGhhdENvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdWx0aXBsZSBiaW5kaW5ncyAoXCIgKyBiaW5kaW5nSGFuZGxlclRoYXRDb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5ncyArIFwiIGFuZCBcIiArIGJpbmRpbmdLZXkgKyBcIikgYXJlIHRyeWluZyB0byBjb250cm9sIGRlc2NlbmRhbnQgYmluZGluZ3Mgb2YgdGhlIHNhbWUgZWxlbWVudC4gWW91IGNhbm5vdCB1c2UgdGhlc2UgYmluZGluZ3MgdG9nZXRoZXIgb24gdGhlIHNhbWUgZWxlbWVudC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmRpbmdIYW5kbGVyVGhhdENvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzID0gYmluZGluZ0tleTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIFJ1biB1cGRhdGUgaW4gaXRzIG93biBjb21wdXRlZCB3cmFwcGVyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaGFuZGxlclVwZGF0ZUZuID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAga28uZGVwZW5kZW50T2JzZXJ2YWJsZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlclVwZGF0ZUZuKG5vZGUsIGdldFZhbHVlQWNjZXNzb3IoYmluZGluZ0tleSksIGFsbEJpbmRpbmdzLCBiaW5kaW5nQ29udGV4dFsnJGRhdGEnXSwgYmluZGluZ0NvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZDogbm9kZSB9XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgZXgubWVzc2FnZSA9IFwiVW5hYmxlIHRvIHByb2Nlc3MgYmluZGluZyBcXFwiXCIgKyBiaW5kaW5nS2V5ICsgXCI6IFwiICsgYmluZGluZ3NbYmluZGluZ0tleV0gKyBcIlxcXCJcXG5NZXNzYWdlOiBcIiArIGV4Lm1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGV4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICdzaG91bGRCaW5kRGVzY2VuZGFudHMnOiBiaW5kaW5nSGFuZGxlclRoYXRDb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5ncyA9PT0gdW5kZWZpbmVkXG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIHZhciBzdG9yZWRCaW5kaW5nQ29udGV4dERvbURhdGFLZXkgPSBrby51dGlscy5kb21EYXRhLm5leHRLZXkoKTtcbiAgICBrby5zdG9yZWRCaW5kaW5nQ29udGV4dEZvck5vZGUgPSBmdW5jdGlvbiAobm9kZSwgYmluZGluZ0NvbnRleHQpIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMikge1xuICAgICAgICAgICAga28udXRpbHMuZG9tRGF0YS5zZXQobm9kZSwgc3RvcmVkQmluZGluZ0NvbnRleHREb21EYXRhS2V5LCBiaW5kaW5nQ29udGV4dCk7XG4gICAgICAgICAgICBpZiAoYmluZGluZ0NvbnRleHQuX3N1YnNjcmliYWJsZSlcbiAgICAgICAgICAgICAgICBiaW5kaW5nQ29udGV4dC5fc3Vic2NyaWJhYmxlLl9hZGROb2RlKG5vZGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGtvLnV0aWxzLmRvbURhdGEuZ2V0KG5vZGUsIHN0b3JlZEJpbmRpbmdDb250ZXh0RG9tRGF0YUtleSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRCaW5kaW5nQ29udGV4dCh2aWV3TW9kZWxPckJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgIHJldHVybiB2aWV3TW9kZWxPckJpbmRpbmdDb250ZXh0ICYmICh2aWV3TW9kZWxPckJpbmRpbmdDb250ZXh0IGluc3RhbmNlb2Yga28uYmluZGluZ0NvbnRleHQpXG4gICAgICAgICAgICA/IHZpZXdNb2RlbE9yQmluZGluZ0NvbnRleHRcbiAgICAgICAgICAgIDogbmV3IGtvLmJpbmRpbmdDb250ZXh0KHZpZXdNb2RlbE9yQmluZGluZ0NvbnRleHQpO1xuICAgIH1cblxuICAgIGtvLmFwcGx5QmluZGluZ0FjY2Vzc29yc1RvTm9kZSA9IGZ1bmN0aW9uIChub2RlLCBiaW5kaW5ncywgdmlld01vZGVsT3JCaW5kaW5nQ29udGV4dCkge1xuICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMSkgLy8gSWYgaXQncyBhbiBlbGVtZW50LCB3b3JrYXJvdW5kIElFIDw9IDggSFRNTCBwYXJzaW5nIHdlaXJkbmVzc1xuICAgICAgICAgICAga28udmlydHVhbEVsZW1lbnRzLm5vcm1hbGlzZVZpcnR1YWxFbGVtZW50RG9tU3RydWN0dXJlKG5vZGUpO1xuICAgICAgICByZXR1cm4gYXBwbHlCaW5kaW5nc1RvTm9kZUludGVybmFsKG5vZGUsIGJpbmRpbmdzLCBnZXRCaW5kaW5nQ29udGV4dCh2aWV3TW9kZWxPckJpbmRpbmdDb250ZXh0KSwgdHJ1ZSk7XG4gICAgfTtcblxuICAgIGtvLmFwcGx5QmluZGluZ3NUb05vZGUgPSBmdW5jdGlvbiAobm9kZSwgYmluZGluZ3MsIHZpZXdNb2RlbE9yQmluZGluZ0NvbnRleHQpIHtcbiAgICAgICAgdmFyIGNvbnRleHQgPSBnZXRCaW5kaW5nQ29udGV4dCh2aWV3TW9kZWxPckJpbmRpbmdDb250ZXh0KTtcbiAgICAgICAgcmV0dXJuIGtvLmFwcGx5QmluZGluZ0FjY2Vzc29yc1RvTm9kZShub2RlLCBtYWtlQmluZGluZ0FjY2Vzc29ycyhiaW5kaW5ncywgY29udGV4dCwgbm9kZSksIGNvbnRleHQpO1xuICAgIH07XG5cbiAgICBrby5hcHBseUJpbmRpbmdzVG9EZXNjZW5kYW50cyA9IGZ1bmN0aW9uKHZpZXdNb2RlbE9yQmluZGluZ0NvbnRleHQsIHJvb3ROb2RlKSB7XG4gICAgICAgIGlmIChyb290Tm9kZS5ub2RlVHlwZSA9PT0gMSB8fCByb290Tm9kZS5ub2RlVHlwZSA9PT0gOClcbiAgICAgICAgICAgIGFwcGx5QmluZGluZ3NUb0Rlc2NlbmRhbnRzSW50ZXJuYWwoZ2V0QmluZGluZ0NvbnRleHQodmlld01vZGVsT3JCaW5kaW5nQ29udGV4dCksIHJvb3ROb2RlLCB0cnVlKTtcbiAgICB9O1xuXG4gICAga28uYXBwbHlCaW5kaW5ncyA9IGZ1bmN0aW9uICh2aWV3TW9kZWxPckJpbmRpbmdDb250ZXh0LCByb290Tm9kZSkge1xuICAgICAgICAvLyBJZiBqUXVlcnkgaXMgbG9hZGVkIGFmdGVyIEtub2Nrb3V0LCB3ZSB3b24ndCBpbml0aWFsbHkgaGF2ZSBhY2Nlc3MgdG8gaXQuIFNvIHNhdmUgaXQgaGVyZS5cbiAgICAgICAgaWYgKCFqUXVlcnlJbnN0YW5jZSAmJiB3aW5kb3dbJ2pRdWVyeSddKSB7XG4gICAgICAgICAgICBqUXVlcnlJbnN0YW5jZSA9IHdpbmRvd1snalF1ZXJ5J107XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocm9vdE5vZGUgJiYgKHJvb3ROb2RlLm5vZGVUeXBlICE9PSAxKSAmJiAocm9vdE5vZGUubm9kZVR5cGUgIT09IDgpKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwia28uYXBwbHlCaW5kaW5nczogZmlyc3QgcGFyYW1ldGVyIHNob3VsZCBiZSB5b3VyIHZpZXcgbW9kZWw7IHNlY29uZCBwYXJhbWV0ZXIgc2hvdWxkIGJlIGEgRE9NIG5vZGVcIik7XG4gICAgICAgIHJvb3ROb2RlID0gcm9vdE5vZGUgfHwgd2luZG93LmRvY3VtZW50LmJvZHk7IC8vIE1ha2UgXCJyb290Tm9kZVwiIHBhcmFtZXRlciBvcHRpb25hbFxuXG4gICAgICAgIGFwcGx5QmluZGluZ3NUb05vZGVBbmREZXNjZW5kYW50c0ludGVybmFsKGdldEJpbmRpbmdDb250ZXh0KHZpZXdNb2RlbE9yQmluZGluZ0NvbnRleHQpLCByb290Tm9kZSwgdHJ1ZSk7XG4gICAgfTtcblxuICAgIC8vIFJldHJpZXZpbmcgYmluZGluZyBjb250ZXh0IGZyb20gYXJiaXRyYXJ5IG5vZGVzXG4gICAga28uY29udGV4dEZvciA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgLy8gV2UgY2FuIG9ubHkgZG8gc29tZXRoaW5nIG1lYW5pbmdmdWwgZm9yIGVsZW1lbnRzIGFuZCBjb21tZW50IG5vZGVzIChpbiBwYXJ0aWN1bGFyLCBub3QgdGV4dCBub2RlcywgYXMgSUUgY2FuJ3Qgc3RvcmUgZG9tZGF0YSBmb3IgdGhlbSlcbiAgICAgICAgc3dpdGNoIChub2RlLm5vZGVUeXBlKSB7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICAgICAgdmFyIGNvbnRleHQgPSBrby5zdG9yZWRCaW5kaW5nQ29udGV4dEZvck5vZGUobm9kZSk7XG4gICAgICAgICAgICAgICAgaWYgKGNvbnRleHQpIHJldHVybiBjb250ZXh0O1xuICAgICAgICAgICAgICAgIGlmIChub2RlLnBhcmVudE5vZGUpIHJldHVybiBrby5jb250ZXh0Rm9yKG5vZGUucGFyZW50Tm9kZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9O1xuICAgIGtvLmRhdGFGb3IgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIHZhciBjb250ZXh0ID0ga28uY29udGV4dEZvcihub2RlKTtcbiAgICAgICAgcmV0dXJuIGNvbnRleHQgPyBjb250ZXh0WyckZGF0YSddIDogdW5kZWZpbmVkO1xuICAgIH07XG5cbiAgICBrby5leHBvcnRTeW1ib2woJ2JpbmRpbmdIYW5kbGVycycsIGtvLmJpbmRpbmdIYW5kbGVycyk7XG4gICAga28uZXhwb3J0U3ltYm9sKCdhcHBseUJpbmRpbmdzJywga28uYXBwbHlCaW5kaW5ncyk7XG4gICAga28uZXhwb3J0U3ltYm9sKCdhcHBseUJpbmRpbmdzVG9EZXNjZW5kYW50cycsIGtvLmFwcGx5QmluZGluZ3NUb0Rlc2NlbmRhbnRzKTtcbiAgICBrby5leHBvcnRTeW1ib2woJ2FwcGx5QmluZGluZ0FjY2Vzc29yc1RvTm9kZScsIGtvLmFwcGx5QmluZGluZ0FjY2Vzc29yc1RvTm9kZSk7XG4gICAga28uZXhwb3J0U3ltYm9sKCdhcHBseUJpbmRpbmdzVG9Ob2RlJywga28uYXBwbHlCaW5kaW5nc1RvTm9kZSk7XG4gICAga28uZXhwb3J0U3ltYm9sKCdjb250ZXh0Rm9yJywga28uY29udGV4dEZvcik7XG4gICAga28uZXhwb3J0U3ltYm9sKCdkYXRhRm9yJywga28uZGF0YUZvcik7XG59KSgpO1xuKGZ1bmN0aW9uKHVuZGVmaW5lZCkge1xuICAgIHZhciBsb2FkaW5nU3Vic2NyaWJhYmxlc0NhY2hlID0ge30sIC8vIFRyYWNrcyBjb21wb25lbnQgbG9hZHMgdGhhdCBhcmUgY3VycmVudGx5IGluIGZsaWdodFxuICAgICAgICBsb2FkZWREZWZpbml0aW9uc0NhY2hlID0ge307ICAgIC8vIFRyYWNrcyBjb21wb25lbnQgbG9hZHMgdGhhdCBoYXZlIGFscmVhZHkgY29tcGxldGVkXG5cbiAgICBrby5jb21wb25lbnRzID0ge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKGNvbXBvbmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB2YXIgY2FjaGVkRGVmaW5pdGlvbiA9IGdldE9iamVjdE93blByb3BlcnR5KGxvYWRlZERlZmluaXRpb25zQ2FjaGUsIGNvbXBvbmVudE5hbWUpO1xuICAgICAgICAgICAgaWYgKGNhY2hlZERlZmluaXRpb24pIHtcbiAgICAgICAgICAgICAgICAvLyBJdCdzIGFscmVhZHkgbG9hZGVkIGFuZCBjYWNoZWQuIFJldXNlIHRoZSBzYW1lIGRlZmluaXRpb24gb2JqZWN0LlxuICAgICAgICAgICAgICAgIC8vIE5vdGUgdGhhdCBmb3IgQVBJIGNvbnNpc3RlbmN5LCBldmVuIGNhY2hlIGhpdHMgY29tcGxldGUgYXN5bmNocm9ub3VzbHkuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgY2FsbGJhY2soY2FjaGVkRGVmaW5pdGlvbikgfSwgMCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIEpvaW4gdGhlIGxvYWRpbmcgcHJvY2VzcyB0aGF0IGlzIGFscmVhZHkgdW5kZXJ3YXksIG9yIHN0YXJ0IGEgbmV3IG9uZS5cbiAgICAgICAgICAgICAgICBsb2FkQ29tcG9uZW50QW5kTm90aWZ5KGNvbXBvbmVudE5hbWUsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBjbGVhckNhY2hlZERlZmluaXRpb246IGZ1bmN0aW9uKGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBsb2FkZWREZWZpbml0aW9uc0NhY2hlW2NvbXBvbmVudE5hbWVdO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9nZXRGaXJzdFJlc3VsdEZyb21Mb2FkZXJzOiBnZXRGaXJzdFJlc3VsdEZyb21Mb2FkZXJzXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldE9iamVjdE93blByb3BlcnR5KG9iaiwgcHJvcE5hbWUpIHtcbiAgICAgICAgcmV0dXJuIG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wTmFtZSkgPyBvYmpbcHJvcE5hbWVdIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvYWRDb21wb25lbnRBbmROb3RpZnkoY29tcG9uZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHN1YnNjcmliYWJsZSA9IGdldE9iamVjdE93blByb3BlcnR5KGxvYWRpbmdTdWJzY3JpYmFibGVzQ2FjaGUsIGNvbXBvbmVudE5hbWUpLFxuICAgICAgICAgICAgY29tcGxldGVkQXN5bmM7XG4gICAgICAgIGlmICghc3Vic2NyaWJhYmxlKSB7XG4gICAgICAgICAgICAvLyBJdCdzIG5vdCBzdGFydGVkIGxvYWRpbmcgeWV0LiBTdGFydCBsb2FkaW5nLCBhbmQgd2hlbiBpdCdzIGRvbmUsIG1vdmUgaXQgdG8gbG9hZGVkRGVmaW5pdGlvbnNDYWNoZS5cbiAgICAgICAgICAgIHN1YnNjcmliYWJsZSA9IGxvYWRpbmdTdWJzY3JpYmFibGVzQ2FjaGVbY29tcG9uZW50TmFtZV0gPSBuZXcga28uc3Vic2NyaWJhYmxlKCk7XG4gICAgICAgICAgICBiZWdpbkxvYWRpbmdDb21wb25lbnQoY29tcG9uZW50TmFtZSwgZnVuY3Rpb24oZGVmaW5pdGlvbikge1xuICAgICAgICAgICAgICAgIGxvYWRlZERlZmluaXRpb25zQ2FjaGVbY29tcG9uZW50TmFtZV0gPSBkZWZpbml0aW9uO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBsb2FkaW5nU3Vic2NyaWJhYmxlc0NhY2hlW2NvbXBvbmVudE5hbWVdO1xuXG4gICAgICAgICAgICAgICAgLy8gRm9yIEFQSSBjb25zaXN0ZW5jeSwgYWxsIGxvYWRzIGNvbXBsZXRlIGFzeW5jaHJvbm91c2x5LiBIb3dldmVyIHdlIHdhbnQgdG8gYXZvaWRcbiAgICAgICAgICAgICAgICAvLyBhZGRpbmcgYW4gZXh0cmEgc2V0VGltZW91dCBpZiBpdCdzIHVubmVjZXNzYXJ5IChpLmUuLCB0aGUgY29tcGxldGlvbiBpcyBhbHJlYWR5XG4gICAgICAgICAgICAgICAgLy8gYXN5bmMpIHNpbmNlIHNldFRpbWVvdXQoLi4uLCAwKSBzdGlsbCB0YWtlcyBhYm91dCAxNm1zIG9yIG1vcmUgb24gbW9zdCBicm93c2Vycy5cbiAgICAgICAgICAgICAgICBpZiAoY29tcGxldGVkQXN5bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJhYmxlWydub3RpZnlTdWJzY3JpYmVycyddKGRlZmluaXRpb24pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmFibGVbJ25vdGlmeVN1YnNjcmliZXJzJ10oZGVmaW5pdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29tcGxldGVkQXN5bmMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHN1YnNjcmliYWJsZS5zdWJzY3JpYmUoY2FsbGJhY2spO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJlZ2luTG9hZGluZ0NvbXBvbmVudChjb21wb25lbnROYW1lLCBjYWxsYmFjaykge1xuICAgICAgICBnZXRGaXJzdFJlc3VsdEZyb21Mb2FkZXJzKCdnZXRDb25maWcnLCBbY29tcG9uZW50TmFtZV0sIGZ1bmN0aW9uKGNvbmZpZykge1xuICAgICAgICAgICAgaWYgKGNvbmZpZykge1xuICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgYSBjb25maWcsIHNvIG5vdyBsb2FkIGl0cyBkZWZpbml0aW9uXG4gICAgICAgICAgICAgICAgZ2V0Rmlyc3RSZXN1bHRGcm9tTG9hZGVycygnbG9hZENvbXBvbmVudCcsIFtjb21wb25lbnROYW1lLCBjb25maWddLCBmdW5jdGlvbihkZWZpbml0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGRlZmluaXRpb24pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgY29tcG9uZW50IGhhcyBubyBjb25maWcgLSBpdCdzIHVua25vd24gdG8gYWxsIHRoZSBsb2FkZXJzLlxuICAgICAgICAgICAgICAgIC8vIE5vdGUgdGhhdCB0aGlzIGlzIG5vdCBhbiBlcnJvciAoZS5nLiwgYSBtb2R1bGUgbG9hZGluZyBlcnJvcikgLSB0aGF0IHdvdWxkIGFib3J0IHRoZVxuICAgICAgICAgICAgICAgIC8vIHByb2Nlc3MgYW5kIHRoaXMgY2FsbGJhY2sgd291bGQgbm90IHJ1bi4gRm9yIHRoaXMgY2FsbGJhY2sgdG8gcnVuLCBhbGwgbG9hZGVycyBtdXN0XG4gICAgICAgICAgICAgICAgLy8gaGF2ZSBjb25maXJtZWQgdGhleSBkb24ndCBrbm93IGFib3V0IHRoaXMgY29tcG9uZW50LlxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRGaXJzdFJlc3VsdEZyb21Mb2FkZXJzKG1ldGhvZE5hbWUsIGFyZ3NFeGNlcHRDYWxsYmFjaywgY2FsbGJhY2ssIGNhbmRpZGF0ZUxvYWRlcnMpIHtcbiAgICAgICAgLy8gT24gdGhlIGZpcnN0IGNhbGwgaW4gdGhlIHN0YWNrLCBzdGFydCB3aXRoIHRoZSBmdWxsIHNldCBvZiBsb2FkZXJzXG4gICAgICAgIGlmICghY2FuZGlkYXRlTG9hZGVycykge1xuICAgICAgICAgICAgY2FuZGlkYXRlTG9hZGVycyA9IGtvLmNvbXBvbmVudHNbJ2xvYWRlcnMnXS5zbGljZSgwKTsgLy8gVXNlIGEgY29weSwgYmVjYXVzZSB3ZSdsbCBiZSBtdXRhdGluZyB0aGlzIGFycmF5XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUcnkgdGhlIG5leHQgY2FuZGlkYXRlXG4gICAgICAgIHZhciBjdXJyZW50Q2FuZGlkYXRlTG9hZGVyID0gY2FuZGlkYXRlTG9hZGVycy5zaGlmdCgpO1xuICAgICAgICBpZiAoY3VycmVudENhbmRpZGF0ZUxvYWRlcikge1xuICAgICAgICAgICAgdmFyIG1ldGhvZEluc3RhbmNlID0gY3VycmVudENhbmRpZGF0ZUxvYWRlclttZXRob2ROYW1lXTtcbiAgICAgICAgICAgIGlmIChtZXRob2RJbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgIHZhciB3YXNBYm9ydGVkID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHN5bmNocm9ub3VzUmV0dXJuVmFsdWUgPSBtZXRob2RJbnN0YW5jZS5hcHBseShjdXJyZW50Q2FuZGlkYXRlTG9hZGVyLCBhcmdzRXhjZXB0Q2FsbGJhY2suY29uY2F0KGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdhc0Fib3J0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBjYW5kaWRhdGUgcmV0dXJuZWQgYSB2YWx1ZS4gVXNlIGl0LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRyeSB0aGUgbmV4dCBjYW5kaWRhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRGaXJzdFJlc3VsdEZyb21Mb2FkZXJzKG1ldGhvZE5hbWUsIGFyZ3NFeGNlcHRDYWxsYmFjaywgY2FsbGJhY2ssIGNhbmRpZGF0ZUxvYWRlcnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgICAgICAvLyBDdXJyZW50bHksIGxvYWRlcnMgbWF5IG5vdCByZXR1cm4gYW55dGhpbmcgc3luY2hyb25vdXNseS4gVGhpcyBsZWF2ZXMgb3BlbiB0aGUgcG9zc2liaWxpdHlcbiAgICAgICAgICAgICAgICAvLyB0aGF0IHdlJ2xsIGV4dGVuZCB0aGUgQVBJIHRvIHN1cHBvcnQgc3luY2hyb25vdXMgcmV0dXJuIHZhbHVlcyBpbiB0aGUgZnV0dXJlLiBJdCB3b24ndCBiZVxuICAgICAgICAgICAgICAgIC8vIGEgYnJlYWtpbmcgY2hhbmdlLCBiZWNhdXNlIGN1cnJlbnRseSBubyBsb2FkZXIgaXMgYWxsb3dlZCB0byByZXR1cm4gYW55dGhpbmcgZXhjZXB0IHVuZGVmaW5lZC5cbiAgICAgICAgICAgICAgICBpZiAoc3luY2hyb25vdXNSZXR1cm5WYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHdhc0Fib3J0ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIE1ldGhvZCB0byBzdXBwcmVzcyBleGNlcHRpb25zIHdpbGwgcmVtYWluIHVuZG9jdW1lbnRlZC4gVGhpcyBpcyBvbmx5IHRvIGtlZXBcbiAgICAgICAgICAgICAgICAgICAgLy8gS08ncyBzcGVjcyBydW5uaW5nIHRpZGlseSwgc2luY2Ugd2UgY2FuIG9ic2VydmUgdGhlIGxvYWRpbmcgZ290IGFib3J0ZWQgd2l0aG91dFxuICAgICAgICAgICAgICAgICAgICAvLyBoYXZpbmcgZXhjZXB0aW9ucyBjbHV0dGVyaW5nIHVwIHRoZSBjb25zb2xlIHRvby5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjdXJyZW50Q2FuZGlkYXRlTG9hZGVyWydzdXBwcmVzc0xvYWRlckV4Y2VwdGlvbnMnXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb21wb25lbnQgbG9hZGVycyBtdXN0IHN1cHBseSB2YWx1ZXMgYnkgaW52b2tpbmcgdGhlIGNhbGxiYWNrLCBub3QgYnkgcmV0dXJuaW5nIHZhbHVlcyBzeW5jaHJvbm91c2x5LicpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBUaGlzIGNhbmRpZGF0ZSBkb2Vzbid0IGhhdmUgdGhlIHJlbGV2YW50IGhhbmRsZXIuIFN5bmNocm9ub3VzbHkgbW92ZSBvbiB0byB0aGUgbmV4dCBvbmUuXG4gICAgICAgICAgICAgICAgZ2V0Rmlyc3RSZXN1bHRGcm9tTG9hZGVycyhtZXRob2ROYW1lLCBhcmdzRXhjZXB0Q2FsbGJhY2ssIGNhbGxiYWNrLCBjYW5kaWRhdGVMb2FkZXJzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE5vIGNhbmRpZGF0ZXMgcmV0dXJuZWQgYSB2YWx1ZVxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZWZlcmVuY2UgdGhlIGxvYWRlcnMgdmlhIHN0cmluZyBuYW1lIHNvIGl0J3MgcG9zc2libGUgZm9yIGRldmVsb3BlcnNcbiAgICAvLyB0byByZXBsYWNlIHRoZSB3aG9sZSBhcnJheSBieSBhc3NpZ25pbmcgdG8ga28uY29tcG9uZW50cy5sb2FkZXJzXG4gICAga28uY29tcG9uZW50c1snbG9hZGVycyddID0gW107XG5cbiAgICBrby5leHBvcnRTeW1ib2woJ2NvbXBvbmVudHMnLCBrby5jb21wb25lbnRzKTtcbiAgICBrby5leHBvcnRTeW1ib2woJ2NvbXBvbmVudHMuZ2V0Jywga28uY29tcG9uZW50cy5nZXQpO1xuICAgIGtvLmV4cG9ydFN5bWJvbCgnY29tcG9uZW50cy5jbGVhckNhY2hlZERlZmluaXRpb24nLCBrby5jb21wb25lbnRzLmNsZWFyQ2FjaGVkRGVmaW5pdGlvbik7XG59KSgpO1xuKGZ1bmN0aW9uKHVuZGVmaW5lZCkge1xuXG4gICAgLy8gVGhlIGRlZmF1bHQgbG9hZGVyIGlzIHJlc3BvbnNpYmxlIGZvciB0d28gdGhpbmdzOlxuICAgIC8vIDEuIE1haW50YWluaW5nIHRoZSBkZWZhdWx0IGluLW1lbW9yeSByZWdpc3RyeSBvZiBjb21wb25lbnQgY29uZmlndXJhdGlvbiBvYmplY3RzXG4gICAgLy8gICAgKGkuZS4sIHRoZSB0aGluZyB5b3UncmUgd3JpdGluZyB0byB3aGVuIHlvdSBjYWxsIGtvLmNvbXBvbmVudHMucmVnaXN0ZXIoc29tZU5hbWUsIC4uLikpXG4gICAgLy8gMi4gQW5zd2VyaW5nIHJlcXVlc3RzIGZvciBjb21wb25lbnRzIGJ5IGZldGNoaW5nIGNvbmZpZ3VyYXRpb24gb2JqZWN0c1xuICAgIC8vICAgIGZyb20gdGhhdCBkZWZhdWx0IGluLW1lbW9yeSByZWdpc3RyeSBhbmQgcmVzb2x2aW5nIHRoZW0gaW50byBzdGFuZGFyZFxuICAgIC8vICAgIGNvbXBvbmVudCBkZWZpbml0aW9uIG9iamVjdHMgKG9mIHRoZSBmb3JtIHsgY3JlYXRlVmlld01vZGVsOiAuLi4sIHRlbXBsYXRlOiAuLi4gfSlcbiAgICAvLyBDdXN0b20gbG9hZGVycyBtYXkgb3ZlcnJpZGUgZWl0aGVyIG9mIHRoZXNlIGZhY2lsaXRpZXMsIGkuZS4sXG4gICAgLy8gMS4gVG8gc3VwcGx5IGNvbmZpZ3VyYXRpb24gb2JqZWN0cyBmcm9tIHNvbWUgb3RoZXIgc291cmNlIChlLmcuLCBjb252ZW50aW9ucylcbiAgICAvLyAyLiBPciwgdG8gcmVzb2x2ZSBjb25maWd1cmF0aW9uIG9iamVjdHMgYnkgbG9hZGluZyB2aWV3bW9kZWxzL3RlbXBsYXRlcyB2aWEgYXJiaXRyYXJ5IGxvZ2ljLlxuXG4gICAgdmFyIGRlZmF1bHRDb25maWdSZWdpc3RyeSA9IHt9O1xuXG4gICAga28uY29tcG9uZW50cy5yZWdpc3RlciA9IGZ1bmN0aW9uKGNvbXBvbmVudE5hbWUsIGNvbmZpZykge1xuICAgICAgICBpZiAoIWNvbmZpZykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvbmZpZ3VyYXRpb24gZm9yICcgKyBjb21wb25lbnROYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChrby5jb21wb25lbnRzLmlzUmVnaXN0ZXJlZChjb21wb25lbnROYW1lKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb21wb25lbnQgJyArIGNvbXBvbmVudE5hbWUgKyAnIGlzIGFscmVhZHkgcmVnaXN0ZXJlZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ1JlZ2lzdHJ5W2NvbXBvbmVudE5hbWVdID0gY29uZmlnO1xuICAgIH1cblxuICAgIGtvLmNvbXBvbmVudHMuaXNSZWdpc3RlcmVkID0gZnVuY3Rpb24oY29tcG9uZW50TmFtZSkge1xuICAgICAgICByZXR1cm4gY29tcG9uZW50TmFtZSBpbiBkZWZhdWx0Q29uZmlnUmVnaXN0cnk7XG4gICAgfVxuXG4gICAga28uY29tcG9uZW50cy51bnJlZ2lzdGVyID0gZnVuY3Rpb24oY29tcG9uZW50TmFtZSkge1xuICAgICAgICBkZWxldGUgZGVmYXVsdENvbmZpZ1JlZ2lzdHJ5W2NvbXBvbmVudE5hbWVdO1xuICAgICAgICBrby5jb21wb25lbnRzLmNsZWFyQ2FjaGVkRGVmaW5pdGlvbihjb21wb25lbnROYW1lKTtcbiAgICB9XG5cbiAgICBrby5jb21wb25lbnRzLmRlZmF1bHRMb2FkZXIgPSB7XG4gICAgICAgICdnZXRDb25maWcnOiBmdW5jdGlvbihjb21wb25lbnROYW1lLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGRlZmF1bHRDb25maWdSZWdpc3RyeS5oYXNPd25Qcm9wZXJ0eShjb21wb25lbnROYW1lKVxuICAgICAgICAgICAgICAgID8gZGVmYXVsdENvbmZpZ1JlZ2lzdHJ5W2NvbXBvbmVudE5hbWVdXG4gICAgICAgICAgICAgICAgOiBudWxsO1xuICAgICAgICAgICAgY2FsbGJhY2socmVzdWx0KTtcbiAgICAgICAgfSxcblxuICAgICAgICAnbG9hZENvbXBvbmVudCc6IGZ1bmN0aW9uKGNvbXBvbmVudE5hbWUsIGNvbmZpZywgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHZhciBlcnJvckNhbGxiYWNrID0gbWFrZUVycm9yQ2FsbGJhY2soY29tcG9uZW50TmFtZSk7XG4gICAgICAgICAgICBwb3NzaWJseUdldENvbmZpZ0Zyb21BbWQoZXJyb3JDYWxsYmFjaywgY29uZmlnLCBmdW5jdGlvbihsb2FkZWRDb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlQ29uZmlnKGNvbXBvbmVudE5hbWUsIGVycm9yQ2FsbGJhY2ssIGxvYWRlZENvbmZpZywgY2FsbGJhY2spO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJ2xvYWRUZW1wbGF0ZSc6IGZ1bmN0aW9uKGNvbXBvbmVudE5hbWUsIHRlbXBsYXRlQ29uZmlnLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgcmVzb2x2ZVRlbXBsYXRlKG1ha2VFcnJvckNhbGxiYWNrKGNvbXBvbmVudE5hbWUpLCB0ZW1wbGF0ZUNvbmZpZywgY2FsbGJhY2spO1xuICAgICAgICB9LFxuXG4gICAgICAgICdsb2FkVmlld01vZGVsJzogZnVuY3Rpb24oY29tcG9uZW50TmFtZSwgdmlld01vZGVsQ29uZmlnLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgcmVzb2x2ZVZpZXdNb2RlbChtYWtlRXJyb3JDYWxsYmFjayhjb21wb25lbnROYW1lKSwgdmlld01vZGVsQ29uZmlnLCBjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGNyZWF0ZVZpZXdNb2RlbEtleSA9ICdjcmVhdGVWaWV3TW9kZWwnO1xuXG4gICAgLy8gVGFrZXMgYSBjb25maWcgb2JqZWN0IG9mIHRoZSBmb3JtIHsgdGVtcGxhdGU6IC4uLiwgdmlld01vZGVsOiAuLi4gfSwgYW5kIGFzeW5jaHJvbm91c2x5IGNvbnZlcnQgaXRcbiAgICAvLyBpbnRvIHRoZSBzdGFuZGFyZCBjb21wb25lbnQgZGVmaW5pdGlvbiBmb3JtYXQ6XG4gICAgLy8gICAgeyB0ZW1wbGF0ZTogPEFycmF5T2ZEb21Ob2Rlcz4sIGNyZWF0ZVZpZXdNb2RlbDogZnVuY3Rpb24ocGFyYW1zLCBjb21wb25lbnRJbmZvKSB7IC4uLiB9IH0uXG4gICAgLy8gU2luY2UgYm90aCB0ZW1wbGF0ZSBhbmQgdmlld01vZGVsIG1heSBuZWVkIHRvIGJlIHJlc29sdmVkIGFzeW5jaHJvbm91c2x5LCBib3RoIHRhc2tzIGFyZSBwZXJmb3JtZWRcbiAgICAvLyBpbiBwYXJhbGxlbCwgYW5kIHRoZSByZXN1bHRzIGpvaW5lZCB3aGVuIGJvdGggYXJlIHJlYWR5LiBXZSBkb24ndCBkZXBlbmQgb24gYW55IHByb21pc2VzIGluZnJhc3RydWN0dXJlLFxuICAgIC8vIHNvIHRoaXMgaXMgaW1wbGVtZW50ZWQgbWFudWFsbHkgYmVsb3cuXG4gICAgZnVuY3Rpb24gcmVzb2x2ZUNvbmZpZyhjb21wb25lbnROYW1lLCBlcnJvckNhbGxiYWNrLCBjb25maWcsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSB7fSxcbiAgICAgICAgICAgIG1ha2VDYWxsQmFja1doZW5aZXJvID0gMixcbiAgICAgICAgICAgIHRyeUlzc3VlQ2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoLS1tYWtlQ2FsbEJhY2tXaGVuWmVybyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZW1wbGF0ZUNvbmZpZyA9IGNvbmZpZ1sndGVtcGxhdGUnXSxcbiAgICAgICAgICAgIHZpZXdNb2RlbENvbmZpZyA9IGNvbmZpZ1sndmlld01vZGVsJ107XG5cbiAgICAgICAgaWYgKHRlbXBsYXRlQ29uZmlnKSB7XG4gICAgICAgICAgICBwb3NzaWJseUdldENvbmZpZ0Zyb21BbWQoZXJyb3JDYWxsYmFjaywgdGVtcGxhdGVDb25maWcsIGZ1bmN0aW9uKGxvYWRlZENvbmZpZykge1xuICAgICAgICAgICAgICAgIGtvLmNvbXBvbmVudHMuX2dldEZpcnN0UmVzdWx0RnJvbUxvYWRlcnMoJ2xvYWRUZW1wbGF0ZScsIFtjb21wb25lbnROYW1lLCBsb2FkZWRDb25maWddLCBmdW5jdGlvbihyZXNvbHZlZFRlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFsndGVtcGxhdGUnXSA9IHJlc29sdmVkVGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIHRyeUlzc3VlQ2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHJ5SXNzdWVDYWxsYmFjaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZpZXdNb2RlbENvbmZpZykge1xuICAgICAgICAgICAgcG9zc2libHlHZXRDb25maWdGcm9tQW1kKGVycm9yQ2FsbGJhY2ssIHZpZXdNb2RlbENvbmZpZywgZnVuY3Rpb24obG9hZGVkQ29uZmlnKSB7XG4gICAgICAgICAgICAgICAga28uY29tcG9uZW50cy5fZ2V0Rmlyc3RSZXN1bHRGcm9tTG9hZGVycygnbG9hZFZpZXdNb2RlbCcsIFtjb21wb25lbnROYW1lLCBsb2FkZWRDb25maWddLCBmdW5jdGlvbihyZXNvbHZlZFZpZXdNb2RlbCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRbY3JlYXRlVmlld01vZGVsS2V5XSA9IHJlc29sdmVkVmlld01vZGVsO1xuICAgICAgICAgICAgICAgICAgICB0cnlJc3N1ZUNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRyeUlzc3VlQ2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlc29sdmVUZW1wbGF0ZShlcnJvckNhbGxiYWNrLCB0ZW1wbGF0ZUNvbmZpZywgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZUNvbmZpZyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIC8vIE1hcmt1cCAtIHBhcnNlIGl0XG4gICAgICAgICAgICBjYWxsYmFjayhrby51dGlscy5wYXJzZUh0bWxGcmFnbWVudCh0ZW1wbGF0ZUNvbmZpZykpO1xuICAgICAgICB9IGVsc2UgaWYgKHRlbXBsYXRlQ29uZmlnIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIC8vIEFzc3VtZSBhbHJlYWR5IGFuIGFycmF5IG9mIERPTSBub2RlcyAtIHBhc3MgdGhyb3VnaCB1bmNoYW5nZWRcbiAgICAgICAgICAgIGNhbGxiYWNrKHRlbXBsYXRlQ29uZmlnKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0RvY3VtZW50RnJhZ21lbnQodGVtcGxhdGVDb25maWcpKSB7XG4gICAgICAgICAgICAvLyBEb2N1bWVudCBmcmFnbWVudCAtIHVzZSBpdHMgY2hpbGQgbm9kZXNcbiAgICAgICAgICAgIGNhbGxiYWNrKGtvLnV0aWxzLm1ha2VBcnJheSh0ZW1wbGF0ZUNvbmZpZy5jaGlsZE5vZGVzKSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGVtcGxhdGVDb25maWdbJ2VsZW1lbnQnXSkge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSB0ZW1wbGF0ZUNvbmZpZ1snZWxlbWVudCddO1xuICAgICAgICAgICAgaWYgKGlzRG9tRWxlbWVudChlbGVtZW50KSkge1xuICAgICAgICAgICAgICAgIC8vIEVsZW1lbnQgaW5zdGFuY2UgLSBjb3B5IGl0cyBjaGlsZCBub2Rlc1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGNsb25lTm9kZXNGcm9tVGVtcGxhdGVTb3VyY2VFbGVtZW50KGVsZW1lbnQpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgLy8gRWxlbWVudCBJRCAtIGZpbmQgaXQsIHRoZW4gY29weSBpdHMgY2hpbGQgbm9kZXNcbiAgICAgICAgICAgICAgICB2YXIgZWxlbUluc3RhbmNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1JbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhjbG9uZU5vZGVzRnJvbVRlbXBsYXRlU291cmNlRWxlbWVudChlbGVtSW5zdGFuY2UpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlcnJvckNhbGxiYWNrKCdDYW5ub3QgZmluZCBlbGVtZW50IHdpdGggSUQgJyArIGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZXJyb3JDYWxsYmFjaygnVW5rbm93biBlbGVtZW50IHR5cGU6ICcgKyBlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVycm9yQ2FsbGJhY2soJ1Vua25vd24gdGVtcGxhdGUgdmFsdWU6ICcgKyB0ZW1wbGF0ZUNvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXNvbHZlVmlld01vZGVsKGVycm9yQ2FsbGJhY2ssIHZpZXdNb2RlbENvbmZpZywgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKHR5cGVvZiB2aWV3TW9kZWxDb25maWcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIC8vIENvbnN0cnVjdG9yIC0gY29udmVydCB0byBzdGFuZGFyZCBmYWN0b3J5IGZ1bmN0aW9uIGZvcm1hdFxuICAgICAgICAgICAgLy8gQnkgZGVzaWduLCB0aGlzIGRvZXMgKm5vdCogc3VwcGx5IGNvbXBvbmVudEluZm8gdG8gdGhlIGNvbnN0cnVjdG9yLCBhcyB0aGUgaW50ZW50IGlzIHRoYXRcbiAgICAgICAgICAgIC8vIGNvbXBvbmVudEluZm8gY29udGFpbnMgbm9uLXZpZXdtb2RlbCBkYXRhIChlLmcuLCB0aGUgY29tcG9uZW50J3MgZWxlbWVudCkgdGhhdCBzaG91bGQgb25seVxuICAgICAgICAgICAgLy8gYmUgdXNlZCBpbiBmYWN0b3J5IGZ1bmN0aW9ucywgbm90IHZpZXdtb2RlbCBjb25zdHJ1Y3RvcnMuXG4gICAgICAgICAgICBjYWxsYmFjayhmdW5jdGlvbiAocGFyYW1zIC8qLCBjb21wb25lbnRJbmZvICovKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyB2aWV3TW9kZWxDb25maWcocGFyYW1zKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2aWV3TW9kZWxDb25maWdbY3JlYXRlVmlld01vZGVsS2V5XSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgLy8gQWxyZWFkeSBhIGZhY3RvcnkgZnVuY3Rpb24gLSB1c2UgaXQgYXMtaXNcbiAgICAgICAgICAgIGNhbGxiYWNrKHZpZXdNb2RlbENvbmZpZ1tjcmVhdGVWaWV3TW9kZWxLZXldKTtcbiAgICAgICAgfSBlbHNlIGlmICgnaW5zdGFuY2UnIGluIHZpZXdNb2RlbENvbmZpZykge1xuICAgICAgICAgICAgLy8gRml4ZWQgb2JqZWN0IGluc3RhbmNlIC0gcHJvbW90ZSB0byBjcmVhdGVWaWV3TW9kZWwgZm9ybWF0IGZvciBBUEkgY29uc2lzdGVuY3lcbiAgICAgICAgICAgIHZhciBmaXhlZEluc3RhbmNlID0gdmlld01vZGVsQ29uZmlnWydpbnN0YW5jZSddO1xuICAgICAgICAgICAgY2FsbGJhY2soZnVuY3Rpb24gKHBhcmFtcywgY29tcG9uZW50SW5mbykge1xuICAgICAgICAgICAgICAgIHJldHVybiBmaXhlZEluc3RhbmNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoJ3ZpZXdNb2RlbCcgaW4gdmlld01vZGVsQ29uZmlnKSB7XG4gICAgICAgICAgICAvLyBSZXNvbHZlZCBBTUQgbW9kdWxlIHdob3NlIHZhbHVlIGlzIG9mIHRoZSBmb3JtIHsgdmlld01vZGVsOiAuLi4gfVxuICAgICAgICAgICAgcmVzb2x2ZVZpZXdNb2RlbChlcnJvckNhbGxiYWNrLCB2aWV3TW9kZWxDb25maWdbJ3ZpZXdNb2RlbCddLCBjYWxsYmFjayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlcnJvckNhbGxiYWNrKCdVbmtub3duIHZpZXdNb2RlbCB2YWx1ZTogJyArIHZpZXdNb2RlbENvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbG9uZU5vZGVzRnJvbVRlbXBsYXRlU291cmNlRWxlbWVudChlbGVtSW5zdGFuY2UpIHtcbiAgICAgICAgc3dpdGNoIChrby51dGlscy50YWdOYW1lTG93ZXIoZWxlbUluc3RhbmNlKSkge1xuICAgICAgICAgICAgY2FzZSAnc2NyaXB0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4ga28udXRpbHMucGFyc2VIdG1sRnJhZ21lbnQoZWxlbUluc3RhbmNlLnRleHQpO1xuICAgICAgICAgICAgY2FzZSAndGV4dGFyZWEnOlxuICAgICAgICAgICAgICAgIHJldHVybiBrby51dGlscy5wYXJzZUh0bWxGcmFnbWVudChlbGVtSW5zdGFuY2UudmFsdWUpO1xuICAgICAgICAgICAgY2FzZSAndGVtcGxhdGUnOlxuICAgICAgICAgICAgICAgIC8vIEZvciBicm93c2VycyB3aXRoIHByb3BlciA8dGVtcGxhdGU+IGVsZW1lbnQgc3VwcG9ydCAoaS5lLiwgd2hlcmUgdGhlIC5jb250ZW50IHByb3BlcnR5XG4gICAgICAgICAgICAgICAgLy8gZ2l2ZXMgYSBkb2N1bWVudCBmcmFnbWVudCksIHVzZSB0aGF0IGRvY3VtZW50IGZyYWdtZW50LlxuICAgICAgICAgICAgICAgIGlmIChpc0RvY3VtZW50RnJhZ21lbnQoZWxlbUluc3RhbmNlLmNvbnRlbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrby51dGlscy5jbG9uZU5vZGVzKGVsZW1JbnN0YW5jZS5jb250ZW50LmNoaWxkTm9kZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlZ3VsYXIgZWxlbWVudHMgc3VjaCBhcyA8ZGl2PiwgYW5kIDx0ZW1wbGF0ZT4gZWxlbWVudHMgb24gb2xkIGJyb3dzZXJzIHRoYXQgZG9uJ3QgcmVhbGx5XG4gICAgICAgIC8vIHVuZGVyc3RhbmQgPHRlbXBsYXRlPiBhbmQganVzdCB0cmVhdCBpdCBhcyBhIHJlZ3VsYXIgY29udGFpbmVyXG4gICAgICAgIHJldHVybiBrby51dGlscy5jbG9uZU5vZGVzKGVsZW1JbnN0YW5jZS5jaGlsZE5vZGVzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0RvbUVsZW1lbnQob2JqKSB7XG4gICAgICAgIGlmICh3aW5kb3dbJ0hUTUxFbGVtZW50J10pIHtcbiAgICAgICAgICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBIVE1MRWxlbWVudDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBvYmogJiYgb2JqLnRhZ05hbWUgJiYgb2JqLm5vZGVUeXBlID09PSAxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNEb2N1bWVudEZyYWdtZW50KG9iaikge1xuICAgICAgICBpZiAod2luZG93WydEb2N1bWVudEZyYWdtZW50J10pIHtcbiAgICAgICAgICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG9iaiAmJiBvYmoubm9kZVR5cGUgPT09IDExO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcG9zc2libHlHZXRDb25maWdGcm9tQW1kKGVycm9yQ2FsbGJhY2ssIGNvbmZpZywgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWdbJ3JlcXVpcmUnXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIC8vIFRoZSBjb25maWcgaXMgdGhlIHZhbHVlIG9mIGFuIEFNRCBtb2R1bGVcbiAgICAgICAgICAgIGlmIChyZXF1aXJlIHx8IHdpbmRvd1sncmVxdWlyZSddKSB7XG4gICAgICAgICAgICAgICAgKHJlcXVpcmUgfHwgd2luZG93WydyZXF1aXJlJ10pKFtjb25maWdbJ3JlcXVpcmUnXV0sIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZXJyb3JDYWxsYmFjaygnVXNlcyByZXF1aXJlLCBidXQgbm8gQU1EIGxvYWRlciBpcyBwcmVzZW50Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWxsYmFjayhjb25maWcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUVycm9yQ2FsbGJhY2soY29tcG9uZW50TmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ29tcG9uZW50IFxcJycgKyBjb21wb25lbnROYW1lICsgJ1xcJzogJyArIG1lc3NhZ2UpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGtvLmV4cG9ydFN5bWJvbCgnY29tcG9uZW50cy5yZWdpc3RlcicsIGtvLmNvbXBvbmVudHMucmVnaXN0ZXIpO1xuICAgIGtvLmV4cG9ydFN5bWJvbCgnY29tcG9uZW50cy5pc1JlZ2lzdGVyZWQnLCBrby5jb21wb25lbnRzLmlzUmVnaXN0ZXJlZCk7XG4gICAga28uZXhwb3J0U3ltYm9sKCdjb21wb25lbnRzLnVucmVnaXN0ZXInLCBrby5jb21wb25lbnRzLnVucmVnaXN0ZXIpO1xuXG4gICAgLy8gRXhwb3NlIHRoZSBkZWZhdWx0IGxvYWRlciBzbyB0aGF0IGRldmVsb3BlcnMgY2FuIGRpcmVjdGx5IGFzayBpdCBmb3IgY29uZmlndXJhdGlvblxuICAgIC8vIG9yIHRvIHJlc29sdmUgY29uZmlndXJhdGlvblxuICAgIGtvLmV4cG9ydFN5bWJvbCgnY29tcG9uZW50cy5kZWZhdWx0TG9hZGVyJywga28uY29tcG9uZW50cy5kZWZhdWx0TG9hZGVyKTtcblxuICAgIC8vIEJ5IGRlZmF1bHQsIHRoZSBkZWZhdWx0IGxvYWRlciBpcyB0aGUgb25seSByZWdpc3RlcmVkIGNvbXBvbmVudCBsb2FkZXJcbiAgICBrby5jb21wb25lbnRzWydsb2FkZXJzJ10ucHVzaChrby5jb21wb25lbnRzLmRlZmF1bHRMb2FkZXIpO1xuXG4gICAgLy8gUHJpdmF0ZWx5IGV4cG9zZSB0aGUgdW5kZXJseWluZyBjb25maWcgcmVnaXN0cnkgZm9yIHVzZSBpbiBvbGQtSUUgc2hpbVxuICAgIGtvLmNvbXBvbmVudHMuX2FsbFJlZ2lzdGVyZWRDb21wb25lbnRzID0gZGVmYXVsdENvbmZpZ1JlZ2lzdHJ5O1xufSkoKTtcbihmdW5jdGlvbiAodW5kZWZpbmVkKSB7XG4gICAgLy8gT3ZlcnJpZGFibGUgQVBJIGZvciBkZXRlcm1pbmluZyB3aGljaCBjb21wb25lbnQgbmFtZSBhcHBsaWVzIHRvIGEgZ2l2ZW4gbm9kZS4gQnkgb3ZlcnJpZGluZyB0aGlzLFxuICAgIC8vIHlvdSBjYW4gZm9yIGV4YW1wbGUgbWFwIHNwZWNpZmljIHRhZ05hbWVzIHRvIGNvbXBvbmVudHMgdGhhdCBhcmUgbm90IHByZXJlZ2lzdGVyZWQuXG4gICAga28uY29tcG9uZW50c1snZ2V0Q29tcG9uZW50TmFtZUZvck5vZGUnXSA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgdmFyIHRhZ05hbWVMb3dlciA9IGtvLnV0aWxzLnRhZ05hbWVMb3dlcihub2RlKTtcbiAgICAgICAgcmV0dXJuIGtvLmNvbXBvbmVudHMuaXNSZWdpc3RlcmVkKHRhZ05hbWVMb3dlcikgJiYgdGFnTmFtZUxvd2VyO1xuICAgIH07XG5cbiAgICBrby5jb21wb25lbnRzLmFkZEJpbmRpbmdzRm9yQ3VzdG9tRWxlbWVudCA9IGZ1bmN0aW9uKGFsbEJpbmRpbmdzLCBub2RlLCBiaW5kaW5nQ29udGV4dCwgdmFsdWVBY2Nlc3NvcnMpIHtcbiAgICAgICAgLy8gRGV0ZXJtaW5lIGlmIGl0J3MgcmVhbGx5IGEgY3VzdG9tIGVsZW1lbnQgbWF0Y2hpbmcgYSBjb21wb25lbnRcbiAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICAgIHZhciBjb21wb25lbnROYW1lID0ga28uY29tcG9uZW50c1snZ2V0Q29tcG9uZW50TmFtZUZvck5vZGUnXShub2RlKTtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgLy8gSXQgZG9lcyByZXByZXNlbnQgYSBjb21wb25lbnQsIHNvIGFkZCBhIGNvbXBvbmVudCBiaW5kaW5nIGZvciBpdFxuICAgICAgICAgICAgICAgIGFsbEJpbmRpbmdzID0gYWxsQmluZGluZ3MgfHwge307XG5cbiAgICAgICAgICAgICAgICBpZiAoYWxsQmluZGluZ3NbJ2NvbXBvbmVudCddKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEF2b2lkIHNpbGVudGx5IG92ZXJ3cml0aW5nIHNvbWUgb3RoZXIgJ2NvbXBvbmVudCcgYmluZGluZyB0aGF0IG1heSBhbHJlYWR5IGJlIG9uIHRoZSBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHVzZSB0aGUgXCJjb21wb25lbnRcIiBiaW5kaW5nIG9uIGEgY3VzdG9tIGVsZW1lbnQgbWF0Y2hpbmcgYSBjb21wb25lbnQnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgY29tcG9uZW50QmluZGluZ1ZhbHVlID0geyAnbmFtZSc6IGNvbXBvbmVudE5hbWUsICdwYXJhbXMnOiBnZXRDb21wb25lbnRQYXJhbXNGcm9tQ3VzdG9tRWxlbWVudChub2RlLCBiaW5kaW5nQ29udGV4dCkgfTtcblxuICAgICAgICAgICAgICAgIGFsbEJpbmRpbmdzWydjb21wb25lbnQnXSA9IHZhbHVlQWNjZXNzb3JzXG4gICAgICAgICAgICAgICAgICAgID8gZnVuY3Rpb24oKSB7IHJldHVybiBjb21wb25lbnRCaW5kaW5nVmFsdWU7IH1cbiAgICAgICAgICAgICAgICAgICAgOiBjb21wb25lbnRCaW5kaW5nVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYWxsQmluZGluZ3M7XG4gICAgfVxuXG4gICAgdmFyIG5hdGl2ZUJpbmRpbmdQcm92aWRlckluc3RhbmNlID0gbmV3IGtvLmJpbmRpbmdQcm92aWRlcigpO1xuXG4gICAgZnVuY3Rpb24gZ2V0Q29tcG9uZW50UGFyYW1zRnJvbUN1c3RvbUVsZW1lbnQoZWxlbSwgYmluZGluZ0NvbnRleHQpIHtcbiAgICAgICAgdmFyIHBhcmFtc0F0dHJpYnV0ZSA9IGVsZW0uZ2V0QXR0cmlidXRlKCdwYXJhbXMnKTtcblxuICAgICAgICBpZiAocGFyYW1zQXR0cmlidXRlKSB7XG4gICAgICAgICAgICB2YXIgcGFyYW1zID0gbmF0aXZlQmluZGluZ1Byb3ZpZGVySW5zdGFuY2VbJ3BhcnNlQmluZGluZ3NTdHJpbmcnXShwYXJhbXNBdHRyaWJ1dGUsIGJpbmRpbmdDb250ZXh0LCBlbGVtLCB7ICd2YWx1ZUFjY2Vzc29ycyc6IHRydWUsICdiaW5kaW5nUGFyYW1zJzogdHJ1ZSB9KSxcbiAgICAgICAgICAgICAgICByYXdQYXJhbUNvbXB1dGVkVmFsdWVzID0ga28udXRpbHMub2JqZWN0TWFwKHBhcmFtcywgZnVuY3Rpb24ocGFyYW1WYWx1ZSwgcGFyYW1OYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrby5jb21wdXRlZChwYXJhbVZhbHVlLCBudWxsLCB7IGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZDogZWxlbSB9KTtcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBrby51dGlscy5vYmplY3RNYXAocmF3UGFyYW1Db21wdXRlZFZhbHVlcywgZnVuY3Rpb24ocGFyYW1WYWx1ZUNvbXB1dGVkLCBwYXJhbU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRG9lcyB0aGUgZXZhbHVhdGlvbiBvZiB0aGUgcGFyYW1ldGVyIHZhbHVlIHVud3JhcCBhbnkgb2JzZXJ2YWJsZXM/XG4gICAgICAgICAgICAgICAgICAgIGlmICghcGFyYW1WYWx1ZUNvbXB1dGVkLmlzQWN0aXZlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vIGl0IGRvZXNuJ3QsIHNvIHRoZXJlJ3Mgbm8gbmVlZCBmb3IgYW55IGNvbXB1dGVkIHdyYXBwZXIuIEp1c3QgcGFzcyB0aHJvdWdoIHRoZSBzdXBwbGllZCB2YWx1ZSBkaXJlY3RseS5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEV4YW1wbGU6IFwic29tZVZhbDogZmlyc3ROYW1lLCBhZ2U6IDEyM1wiICh3aGV0aGVyIG9yIG5vdCBmaXJzdE5hbWUgaXMgYW4gb2JzZXJ2YWJsZS9jb21wdXRlZClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJhbVZhbHVlQ29tcHV0ZWQucGVlaygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gWWVzIGl0IGRvZXMuIFN1cHBseSBhIGNvbXB1dGVkIHByb3BlcnR5IHRoYXQgdW53cmFwcyBib3RoIHRoZSBvdXRlciAoYmluZGluZyBleHByZXNzaW9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGV2ZWwgb2Ygb2JzZXJ2YWJpbGl0eSwgYW5kIGFueSBpbm5lciAocmVzdWx0aW5nIG1vZGVsIHZhbHVlKSBsZXZlbCBvZiBvYnNlcnZhYmlsaXR5LlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBtZWFucyB0aGUgY29tcG9uZW50IGRvZXNuJ3QgaGF2ZSB0byB3b3JyeSBhYm91dCBtdWx0aXBsZSB1bndyYXBwaW5nLlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHBhcmFtVmFsdWVDb21wdXRlZCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIG51bGwsIHsgZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkOiBlbGVtIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEdpdmUgYWNjZXNzIHRvIHRoZSByYXcgY29tcHV0ZWRzLCBhcyBsb25nIGFzIHRoYXQgd291bGRuJ3Qgb3ZlcndyaXRlIGFueSBjdXN0b20gcGFyYW0gYWxzbyBjYWxsZWQgJyRyYXcnXG4gICAgICAgICAgICAvLyBUaGlzIGlzIGluIGNhc2UgdGhlIGRldmVsb3BlciB3YW50cyB0byByZWFjdCB0byBvdXRlciAoYmluZGluZykgb2JzZXJ2YWJpbGl0eSBzZXBhcmF0ZWx5IGZyb20gaW5uZXJcbiAgICAgICAgICAgIC8vIChtb2RlbCB2YWx1ZSkgb2JzZXJ2YWJpbGl0eSwgb3IgaW4gY2FzZSB0aGUgbW9kZWwgdmFsdWUgb2JzZXJ2YWJsZSBoYXMgc3Vib2JzZXJ2YWJsZXMuXG4gICAgICAgICAgICBpZiAoIXJlc3VsdC5oYXNPd25Qcm9wZXJ0eSgnJHJhdycpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0WyckcmF3J10gPSByYXdQYXJhbUNvbXB1dGVkVmFsdWVzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gRm9yIGNvbnNpc3RlbmN5LCBhYnNlbmNlIG9mIGEgXCJwYXJhbXNcIiBhdHRyaWJ1dGUgaXMgdHJlYXRlZCB0aGUgc2FtZSBhcyB0aGUgcHJlc2VuY2Ugb2ZcbiAgICAgICAgICAgIC8vIGFueSBlbXB0eSBvbmUuIE90aGVyd2lzZSBjb21wb25lbnQgdmlld21vZGVscyBuZWVkIHNwZWNpYWwgY29kZSB0byBjaGVjayB3aGV0aGVyIG9yIG5vdFxuICAgICAgICAgICAgLy8gJ3BhcmFtcycgb3IgJ3BhcmFtcy4kcmF3JyBpcyBudWxsL3VuZGVmaW5lZCBiZWZvcmUgcmVhZGluZyBzdWJwcm9wZXJ0aWVzLCB3aGljaCBpcyBhbm5veWluZy5cbiAgICAgICAgICAgIHJldHVybiB7ICckcmF3Jzoge30gfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQ29tcGF0aWJpbGl0eSBjb2RlIGZvciBvbGRlciAocHJlLUhUTUw1KSBJRSBicm93c2Vyc1xuXG4gICAgaWYgKGtvLnV0aWxzLmllVmVyc2lvbiA8IDkpIHtcbiAgICAgICAgLy8gV2hlbmV2ZXIgeW91IHByZXJlZ2lzdGVyIGEgY29tcG9uZW50LCBlbmFibGUgaXQgYXMgYSBjdXN0b20gZWxlbWVudCBpbiB0aGUgY3VycmVudCBkb2N1bWVudFxuICAgICAgICBrby5jb21wb25lbnRzWydyZWdpc3RlciddID0gKGZ1bmN0aW9uKG9yaWdpbmFsRnVuY3Rpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihjb21wb25lbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChjb21wb25lbnROYW1lKTsgLy8gQWxsb3dzIElFPDkgdG8gcGFyc2UgbWFya3VwIGNvbnRhaW5pbmcgdGhlIGN1c3RvbSBlbGVtZW50XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsRnVuY3Rpb24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkoa28uY29tcG9uZW50c1sncmVnaXN0ZXInXSk7XG5cbiAgICAgICAgLy8gV2hlbmV2ZXIgeW91IGNyZWF0ZSBhIGRvY3VtZW50IGZyYWdtZW50LCBlbmFibGUgYWxsIHByZXJlZ2lzdGVyZWQgY29tcG9uZW50IG5hbWVzIGFzIGN1c3RvbSBlbGVtZW50c1xuICAgICAgICAvLyBUaGlzIGlzIG5lZWRlZCB0byBtYWtlIGlubmVyU2hpdi9qUXVlcnkgSFRNTCBwYXJzaW5nIGNvcnJlY3RseSBoYW5kbGUgdGhlIGN1c3RvbSBlbGVtZW50c1xuICAgICAgICBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50ID0gKGZ1bmN0aW9uKG9yaWdpbmFsRnVuY3Rpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV3RG9jRnJhZyA9IG9yaWdpbmFsRnVuY3Rpb24oKSxcbiAgICAgICAgICAgICAgICAgICAgYWxsQ29tcG9uZW50cyA9IGtvLmNvbXBvbmVudHMuX2FsbFJlZ2lzdGVyZWRDb21wb25lbnRzO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGNvbXBvbmVudE5hbWUgaW4gYWxsQ29tcG9uZW50cykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYWxsQ29tcG9uZW50cy5oYXNPd25Qcm9wZXJ0eShjb21wb25lbnROYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3RG9jRnJhZy5jcmVhdGVFbGVtZW50KGNvbXBvbmVudE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBuZXdEb2NGcmFnO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSkoZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCk7XG4gICAgfVxufSkoKTsoZnVuY3Rpb24odW5kZWZpbmVkKSB7XG5cbiAgICB2YXIgY29tcG9uZW50TG9hZGluZ09wZXJhdGlvblVuaXF1ZUlkID0gMDtcblxuICAgIGtvLmJpbmRpbmdIYW5kbGVyc1snY29tcG9uZW50J10gPSB7XG4gICAgICAgICdpbml0JzogZnVuY3Rpb24oZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgaWdub3JlZDEsIGlnbm9yZWQyLCBiaW5kaW5nQ29udGV4dCkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRWaWV3TW9kZWwsXG4gICAgICAgICAgICAgICAgY3VycmVudExvYWRpbmdPcGVyYXRpb25JZCxcbiAgICAgICAgICAgICAgICBkaXNwb3NlQXNzb2NpYXRlZENvbXBvbmVudFZpZXdNb2RlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRWaWV3TW9kZWxEaXNwb3NlID0gY3VycmVudFZpZXdNb2RlbCAmJiBjdXJyZW50Vmlld01vZGVsWydkaXNwb3NlJ107XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY3VycmVudFZpZXdNb2RlbERpc3Bvc2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWaWV3TW9kZWxEaXNwb3NlLmNhbGwoY3VycmVudFZpZXdNb2RlbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBBbnkgaW4tZmxpZ2h0IGxvYWRpbmcgb3BlcmF0aW9uIGlzIG5vIGxvbmdlciByZWxldmFudCwgc28gbWFrZSBzdXJlIHdlIGlnbm9yZSBpdHMgY29tcGxldGlvblxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50TG9hZGluZ09wZXJhdGlvbklkID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwuYWRkRGlzcG9zZUNhbGxiYWNrKGVsZW1lbnQsIGRpc3Bvc2VBc3NvY2lhdGVkQ29tcG9uZW50Vmlld01vZGVsKTtcblxuICAgICAgICAgICAga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpKSxcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50TmFtZSwgY29tcG9uZW50UGFyYW1zO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50TmFtZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudE5hbWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlWyduYW1lJ10pO1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRQYXJhbXMgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlWydwYXJhbXMnXSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCFjb21wb25lbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gY29tcG9uZW50IG5hbWUgc3BlY2lmaWVkJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGxvYWRpbmdPcGVyYXRpb25JZCA9IGN1cnJlbnRMb2FkaW5nT3BlcmF0aW9uSWQgPSArK2NvbXBvbmVudExvYWRpbmdPcGVyYXRpb25VbmlxdWVJZDtcbiAgICAgICAgICAgICAgICBrby5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lLCBmdW5jdGlvbihjb21wb25lbnREZWZpbml0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgbm90IHRoZSBjdXJyZW50IGxvYWQgb3BlcmF0aW9uIGZvciB0aGlzIGVsZW1lbnQsIGlnbm9yZSBpdC5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRMb2FkaW5nT3BlcmF0aW9uSWQgIT09IGxvYWRpbmdPcGVyYXRpb25JZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQ2xlYW4gdXAgcHJldmlvdXMgc3RhdGVcbiAgICAgICAgICAgICAgICAgICAgZGlzcG9zZUFzc29jaWF0ZWRDb21wb25lbnRWaWV3TW9kZWwoKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBJbnN0YW50aWF0ZSBhbmQgYmluZCBuZXcgY29tcG9uZW50LiBJbXBsaWNpdGx5IHRoaXMgY2xlYW5zIGFueSBvbGQgRE9NIG5vZGVzLlxuICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbXBvbmVudERlZmluaXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBjb21wb25lbnQgXFwnJyArIGNvbXBvbmVudE5hbWUgKyAnXFwnJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2xvbmVUZW1wbGF0ZUludG9FbGVtZW50KGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudERlZmluaXRpb24sIGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29tcG9uZW50Vmlld01vZGVsID0gY3JlYXRlVmlld01vZGVsKGNvbXBvbmVudERlZmluaXRpb24sIGVsZW1lbnQsIGNvbXBvbmVudFBhcmFtcyksXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZEJpbmRpbmdDb250ZXh0ID0gYmluZGluZ0NvbnRleHRbJ2NyZWF0ZUNoaWxkQ29udGV4dCddKGNvbXBvbmVudFZpZXdNb2RlbCk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWaWV3TW9kZWwgPSBjb21wb25lbnRWaWV3TW9kZWw7XG4gICAgICAgICAgICAgICAgICAgIGtvLmFwcGx5QmluZGluZ3NUb0Rlc2NlbmRhbnRzKGNoaWxkQmluZGluZ0NvbnRleHQsIGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwgbnVsbCwgeyBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IGVsZW1lbnQgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB7ICdjb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5ncyc6IHRydWUgfTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBrby52aXJ0dWFsRWxlbWVudHMuYWxsb3dlZEJpbmRpbmdzWydjb21wb25lbnQnXSA9IHRydWU7XG5cbiAgICBmdW5jdGlvbiBjbG9uZVRlbXBsYXRlSW50b0VsZW1lbnQoY29tcG9uZW50TmFtZSwgY29tcG9uZW50RGVmaW5pdGlvbiwgZWxlbWVudCkge1xuICAgICAgICB2YXIgdGVtcGxhdGUgPSBjb21wb25lbnREZWZpbml0aW9uWyd0ZW1wbGF0ZSddO1xuICAgICAgICBpZiAoIXRlbXBsYXRlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbXBvbmVudCBcXCcnICsgY29tcG9uZW50TmFtZSArICdcXCcgaGFzIG5vIHRlbXBsYXRlJyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2xvbmVkTm9kZXNBcnJheSA9IGtvLnV0aWxzLmNsb25lTm9kZXModGVtcGxhdGUpO1xuICAgICAgICBrby52aXJ0dWFsRWxlbWVudHMuc2V0RG9tTm9kZUNoaWxkcmVuKGVsZW1lbnQsIGNsb25lZE5vZGVzQXJyYXkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZVZpZXdNb2RlbChjb21wb25lbnREZWZpbml0aW9uLCBlbGVtZW50LCBjb21wb25lbnRQYXJhbXMpIHtcbiAgICAgICAgdmFyIGNvbXBvbmVudFZpZXdNb2RlbEZhY3RvcnkgPSBjb21wb25lbnREZWZpbml0aW9uWydjcmVhdGVWaWV3TW9kZWwnXTtcbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudFZpZXdNb2RlbEZhY3RvcnlcbiAgICAgICAgICAgID8gY29tcG9uZW50Vmlld01vZGVsRmFjdG9yeS5jYWxsKGNvbXBvbmVudERlZmluaXRpb24sIGNvbXBvbmVudFBhcmFtcywgeyBlbGVtZW50OiBlbGVtZW50IH0pXG4gICAgICAgICAgICA6IGNvbXBvbmVudFBhcmFtczsgLy8gVGVtcGxhdGUtb25seSBjb21wb25lbnRcbiAgICB9XG5cbn0pKCk7XG52YXIgYXR0ckh0bWxUb0phdmFzY3JpcHRNYXAgPSB7ICdjbGFzcyc6ICdjbGFzc05hbWUnLCAnZm9yJzogJ2h0bWxGb3InIH07XG5rby5iaW5kaW5nSGFuZGxlcnNbJ2F0dHInXSA9IHtcbiAgICAndXBkYXRlJzogZnVuY3Rpb24oZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3MpIHtcbiAgICAgICAgdmFyIHZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZUFjY2Vzc29yKCkpIHx8IHt9O1xuICAgICAgICBrby51dGlscy5vYmplY3RGb3JFYWNoKHZhbHVlLCBmdW5jdGlvbihhdHRyTmFtZSwgYXR0clZhbHVlKSB7XG4gICAgICAgICAgICBhdHRyVmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKGF0dHJWYWx1ZSk7XG5cbiAgICAgICAgICAgIC8vIFRvIGNvdmVyIGNhc2VzIGxpa2UgXCJhdHRyOiB7IGNoZWNrZWQ6c29tZVByb3AgfVwiLCB3ZSB3YW50IHRvIHJlbW92ZSB0aGUgYXR0cmlidXRlIGVudGlyZWx5XG4gICAgICAgICAgICAvLyB3aGVuIHNvbWVQcm9wIGlzIGEgXCJubyB2YWx1ZVwiLWxpa2UgdmFsdWUgKHN0cmljdGx5IG51bGwsIGZhbHNlLCBvciB1bmRlZmluZWQpXG4gICAgICAgICAgICAvLyAoYmVjYXVzZSB0aGUgYWJzZW5jZSBvZiB0aGUgXCJjaGVja2VkXCIgYXR0ciBpcyBob3cgdG8gbWFyayBhbiBlbGVtZW50IGFzIG5vdCBjaGVja2VkLCBldGMuKVxuICAgICAgICAgICAgdmFyIHRvUmVtb3ZlID0gKGF0dHJWYWx1ZSA9PT0gZmFsc2UpIHx8IChhdHRyVmFsdWUgPT09IG51bGwpIHx8IChhdHRyVmFsdWUgPT09IHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBpZiAodG9SZW1vdmUpXG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0ck5hbWUpO1xuXG4gICAgICAgICAgICAvLyBJbiBJRSA8PSA3IGFuZCBJRTggUXVpcmtzIE1vZGUsIHlvdSBoYXZlIHRvIHVzZSB0aGUgSmF2YXNjcmlwdCBwcm9wZXJ0eSBuYW1lIGluc3RlYWQgb2YgdGhlXG4gICAgICAgICAgICAvLyBIVE1MIGF0dHJpYnV0ZSBuYW1lIGZvciBjZXJ0YWluIGF0dHJpYnV0ZXMuIElFOCBTdGFuZGFyZHMgTW9kZSBzdXBwb3J0cyB0aGUgY29ycmVjdCBiZWhhdmlvcixcbiAgICAgICAgICAgIC8vIGJ1dCBpbnN0ZWFkIG9mIGZpZ3VyaW5nIG91dCB0aGUgbW9kZSwgd2UnbGwganVzdCBzZXQgdGhlIGF0dHJpYnV0ZSB0aHJvdWdoIHRoZSBKYXZhc2NyaXB0XG4gICAgICAgICAgICAvLyBwcm9wZXJ0eSBmb3IgSUUgPD0gOC5cbiAgICAgICAgICAgIGlmIChrby51dGlscy5pZVZlcnNpb24gPD0gOCAmJiBhdHRyTmFtZSBpbiBhdHRySHRtbFRvSmF2YXNjcmlwdE1hcCkge1xuICAgICAgICAgICAgICAgIGF0dHJOYW1lID0gYXR0ckh0bWxUb0phdmFzY3JpcHRNYXBbYXR0ck5hbWVdO1xuICAgICAgICAgICAgICAgIGlmICh0b1JlbW92ZSlcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0ck5hbWUpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudFthdHRyTmFtZV0gPSBhdHRyVmFsdWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCF0b1JlbW92ZSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCBhdHRyVmFsdWUudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRyZWF0IFwibmFtZVwiIHNwZWNpYWxseSAtIGFsdGhvdWdoIHlvdSBjYW4gdGhpbmsgb2YgaXQgYXMgYW4gYXR0cmlidXRlLCBpdCBhbHNvIG5lZWRzXG4gICAgICAgICAgICAvLyBzcGVjaWFsIGhhbmRsaW5nIG9uIG9sZGVyIHZlcnNpb25zIG9mIElFIChodHRwczovL2dpdGh1Yi5jb20vU3RldmVTYW5kZXJzb24va25vY2tvdXQvcHVsbC8zMzMpXG4gICAgICAgICAgICAvLyBEZWxpYmVyYXRlbHkgYmVpbmcgY2FzZS1zZW5zaXRpdmUgaGVyZSBiZWNhdXNlIFhIVE1MIHdvdWxkIHJlZ2FyZCBcIk5hbWVcIiBhcyBhIGRpZmZlcmVudCB0aGluZ1xuICAgICAgICAgICAgLy8gZW50aXJlbHksIGFuZCB0aGVyZSdzIG5vIHN0cm9uZyByZWFzb24gdG8gYWxsb3cgZm9yIHN1Y2ggY2FzaW5nIGluIEhUTUwuXG4gICAgICAgICAgICBpZiAoYXR0ck5hbWUgPT09IFwibmFtZVwiKSB7XG4gICAgICAgICAgICAgICAga28udXRpbHMuc2V0RWxlbWVudE5hbWUoZWxlbWVudCwgdG9SZW1vdmUgPyBcIlwiIDogYXR0clZhbHVlLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59O1xuKGZ1bmN0aW9uKCkge1xuXG5rby5iaW5kaW5nSGFuZGxlcnNbJ2NoZWNrZWQnXSA9IHtcbiAgICAnYWZ0ZXInOiBbJ3ZhbHVlJywgJ2F0dHInXSxcbiAgICAnaW5pdCc6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5ncykge1xuICAgICAgICB2YXIgY2hlY2tlZFZhbHVlID0ga28ucHVyZUNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gVHJlYXQgXCJ2YWx1ZVwiIGxpa2UgXCJjaGVja2VkVmFsdWVcIiB3aGVuIGl0IGlzIGluY2x1ZGVkIHdpdGggXCJjaGVja2VkXCIgYmluZGluZ1xuICAgICAgICAgICAgaWYgKGFsbEJpbmRpbmdzWydoYXMnXSgnY2hlY2tlZFZhbHVlJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShhbGxCaW5kaW5ncy5nZXQoJ2NoZWNrZWRWYWx1ZScpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYWxsQmluZGluZ3NbJ2hhcyddKCd2YWx1ZScpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUoYWxsQmluZGluZ3MuZ2V0KCd2YWx1ZScpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQudmFsdWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZU1vZGVsKCkge1xuICAgICAgICAgICAgLy8gVGhpcyB1cGRhdGVzIHRoZSBtb2RlbCB2YWx1ZSBmcm9tIHRoZSB2aWV3IHZhbHVlLlxuICAgICAgICAgICAgLy8gSXQgcnVucyBpbiByZXNwb25zZSB0byBET00gZXZlbnRzIChjbGljaykgYW5kIGNoYW5nZXMgaW4gY2hlY2tlZFZhbHVlLlxuICAgICAgICAgICAgdmFyIGlzQ2hlY2tlZCA9IGVsZW1lbnQuY2hlY2tlZCxcbiAgICAgICAgICAgICAgICBlbGVtVmFsdWUgPSB1c2VDaGVja2VkVmFsdWUgPyBjaGVja2VkVmFsdWUoKSA6IGlzQ2hlY2tlZDtcblxuICAgICAgICAgICAgLy8gV2hlbiB3ZSdyZSBmaXJzdCBzZXR0aW5nIHVwIHRoaXMgY29tcHV0ZWQsIGRvbid0IGNoYW5nZSBhbnkgbW9kZWwgc3RhdGUuXG4gICAgICAgICAgICBpZiAoa28uY29tcHV0ZWRDb250ZXh0LmlzSW5pdGlhbCgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBXZSBjYW4gaWdub3JlIHVuY2hlY2tlZCByYWRpbyBidXR0b25zLCBiZWNhdXNlIHNvbWUgb3RoZXIgcmFkaW9cbiAgICAgICAgICAgIC8vIGJ1dHRvbiB3aWxsIGJlIGdldHRpbmcgY2hlY2tlZCwgYW5kIHRoYXQgb25lIGNhbiB0YWtlIGNhcmUgb2YgdXBkYXRpbmcgc3RhdGUuXG4gICAgICAgICAgICBpZiAoaXNSYWRpbyAmJiAhaXNDaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbW9kZWxWYWx1ZSA9IGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uaWdub3JlKHZhbHVlQWNjZXNzb3IpO1xuICAgICAgICAgICAgaWYgKGlzVmFsdWVBcnJheSkge1xuICAgICAgICAgICAgICAgIGlmIChvbGRFbGVtVmFsdWUgIT09IGVsZW1WYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXaGVuIHdlJ3JlIHJlc3BvbmRpbmcgdG8gdGhlIGNoZWNrZWRWYWx1ZSBjaGFuZ2luZywgYW5kIHRoZSBlbGVtZW50IGlzXG4gICAgICAgICAgICAgICAgICAgIC8vIGN1cnJlbnRseSBjaGVja2VkLCByZXBsYWNlIHRoZSBvbGQgZWxlbSB2YWx1ZSB3aXRoIHRoZSBuZXcgZWxlbSB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAvLyBpbiB0aGUgbW9kZWwgYXJyYXkuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0NoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtvLnV0aWxzLmFkZE9yUmVtb3ZlSXRlbShtb2RlbFZhbHVlLCBlbGVtVmFsdWUsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAga28udXRpbHMuYWRkT3JSZW1vdmVJdGVtKG1vZGVsVmFsdWUsIG9sZEVsZW1WYWx1ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgb2xkRWxlbVZhbHVlID0gZWxlbVZhbHVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdoZW4gd2UncmUgcmVzcG9uZGluZyB0byB0aGUgdXNlciBoYXZpbmcgY2hlY2tlZC91bmNoZWNrZWQgYSBjaGVja2JveCxcbiAgICAgICAgICAgICAgICAgICAgLy8gYWRkL3JlbW92ZSB0aGUgZWxlbWVudCB2YWx1ZSB0byB0aGUgbW9kZWwgYXJyYXkuXG4gICAgICAgICAgICAgICAgICAgIGtvLnV0aWxzLmFkZE9yUmVtb3ZlSXRlbShtb2RlbFZhbHVlLCBlbGVtVmFsdWUsIGlzQ2hlY2tlZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBrby5leHByZXNzaW9uUmV3cml0aW5nLndyaXRlVmFsdWVUb1Byb3BlcnR5KG1vZGVsVmFsdWUsIGFsbEJpbmRpbmdzLCAnY2hlY2tlZCcsIGVsZW1WYWx1ZSwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlVmlldygpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgdXBkYXRlcyB0aGUgdmlldyB2YWx1ZSBmcm9tIHRoZSBtb2RlbCB2YWx1ZS5cbiAgICAgICAgICAgIC8vIEl0IHJ1bnMgaW4gcmVzcG9uc2UgdG8gY2hhbmdlcyBpbiB0aGUgYm91bmQgKGNoZWNrZWQpIHZhbHVlLlxuICAgICAgICAgICAgdmFyIG1vZGVsVmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSk7XG5cbiAgICAgICAgICAgIGlmIChpc1ZhbHVlQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAvLyBXaGVuIGEgY2hlY2tib3ggaXMgYm91bmQgdG8gYW4gYXJyYXksIGJlaW5nIGNoZWNrZWQgcmVwcmVzZW50cyBpdHMgdmFsdWUgYmVpbmcgcHJlc2VudCBpbiB0aGF0IGFycmF5XG4gICAgICAgICAgICAgICAgZWxlbWVudC5jaGVja2VkID0ga28udXRpbHMuYXJyYXlJbmRleE9mKG1vZGVsVmFsdWUsIGNoZWNrZWRWYWx1ZSgpKSA+PSAwO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpc0NoZWNrYm94KSB7XG4gICAgICAgICAgICAgICAgLy8gV2hlbiBhIGNoZWNrYm94IGlzIGJvdW5kIHRvIGFueSBvdGhlciB2YWx1ZSAobm90IGFuIGFycmF5KSwgYmVpbmcgY2hlY2tlZCByZXByZXNlbnRzIHRoZSB2YWx1ZSBiZWluZyB0cnVlaXNoXG4gICAgICAgICAgICAgICAgZWxlbWVudC5jaGVja2VkID0gbW9kZWxWYWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gRm9yIHJhZGlvIGJ1dHRvbnMsIGJlaW5nIGNoZWNrZWQgbWVhbnMgdGhhdCB0aGUgcmFkaW8gYnV0dG9uJ3MgdmFsdWUgY29ycmVzcG9uZHMgdG8gdGhlIG1vZGVsIHZhbHVlXG4gICAgICAgICAgICAgICAgZWxlbWVudC5jaGVja2VkID0gKGNoZWNrZWRWYWx1ZSgpID09PSBtb2RlbFZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgaXNDaGVja2JveCA9IGVsZW1lbnQudHlwZSA9PSBcImNoZWNrYm94XCIsXG4gICAgICAgICAgICBpc1JhZGlvID0gZWxlbWVudC50eXBlID09IFwicmFkaW9cIjtcblxuICAgICAgICAvLyBPbmx5IGJpbmQgdG8gY2hlY2sgYm94ZXMgYW5kIHJhZGlvIGJ1dHRvbnNcbiAgICAgICAgaWYgKCFpc0NoZWNrYm94ICYmICFpc1JhZGlvKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaXNWYWx1ZUFycmF5ID0gaXNDaGVja2JveCAmJiAoa28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZUFjY2Vzc29yKCkpIGluc3RhbmNlb2YgQXJyYXkpLFxuICAgICAgICAgICAgb2xkRWxlbVZhbHVlID0gaXNWYWx1ZUFycmF5ID8gY2hlY2tlZFZhbHVlKCkgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICB1c2VDaGVja2VkVmFsdWUgPSBpc1JhZGlvIHx8IGlzVmFsdWVBcnJheTtcblxuICAgICAgICAvLyBJRSA2IHdvbid0IGFsbG93IHJhZGlvIGJ1dHRvbnMgdG8gYmUgc2VsZWN0ZWQgdW5sZXNzIHRoZXkgaGF2ZSBhIG5hbWVcbiAgICAgICAgaWYgKGlzUmFkaW8gJiYgIWVsZW1lbnQubmFtZSlcbiAgICAgICAgICAgIGtvLmJpbmRpbmdIYW5kbGVyc1sndW5pcXVlTmFtZSddWydpbml0J10oZWxlbWVudCwgZnVuY3Rpb24oKSB7IHJldHVybiB0cnVlIH0pO1xuXG4gICAgICAgIC8vIFNldCB1cCB0d28gY29tcHV0ZWRzIHRvIHVwZGF0ZSB0aGUgYmluZGluZzpcblxuICAgICAgICAvLyBUaGUgZmlyc3QgcmVzcG9uZHMgdG8gY2hhbmdlcyBpbiB0aGUgY2hlY2tlZFZhbHVlIHZhbHVlIGFuZCB0byBlbGVtZW50IGNsaWNrc1xuICAgICAgICBrby5jb21wdXRlZCh1cGRhdGVNb2RlbCwgbnVsbCwgeyBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IGVsZW1lbnQgfSk7XG4gICAgICAgIGtvLnV0aWxzLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKGVsZW1lbnQsIFwiY2xpY2tcIiwgdXBkYXRlTW9kZWwpO1xuXG4gICAgICAgIC8vIFRoZSBzZWNvbmQgcmVzcG9uZHMgdG8gY2hhbmdlcyBpbiB0aGUgbW9kZWwgdmFsdWUgKHRoZSBvbmUgYXNzb2NpYXRlZCB3aXRoIHRoZSBjaGVja2VkIGJpbmRpbmcpXG4gICAgICAgIGtvLmNvbXB1dGVkKHVwZGF0ZVZpZXcsIG51bGwsIHsgZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkOiBlbGVtZW50IH0pO1xuICAgIH1cbn07XG5rby5leHByZXNzaW9uUmV3cml0aW5nLnR3b1dheUJpbmRpbmdzWydjaGVja2VkJ10gPSB0cnVlO1xuXG5rby5iaW5kaW5nSGFuZGxlcnNbJ2NoZWNrZWRWYWx1ZSddID0ge1xuICAgICd1cGRhdGUnOiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3Nvcikge1xuICAgICAgICBlbGVtZW50LnZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZUFjY2Vzc29yKCkpO1xuICAgIH1cbn07XG5cbn0pKCk7dmFyIGNsYXNzZXNXcml0dGVuQnlCaW5kaW5nS2V5ID0gJ19fa29fX2Nzc1ZhbHVlJztcbmtvLmJpbmRpbmdIYW5kbGVyc1snY3NzJ10gPSB7XG4gICAgJ3VwZGF0ZSc6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpKTtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICBrby51dGlscy5vYmplY3RGb3JFYWNoKHZhbHVlLCBmdW5jdGlvbihjbGFzc05hbWUsIHNob3VsZEhhdmVDbGFzcykge1xuICAgICAgICAgICAgICAgIHNob3VsZEhhdmVDbGFzcyA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUoc2hvdWxkSGF2ZUNsYXNzKTtcbiAgICAgICAgICAgICAgICBrby51dGlscy50b2dnbGVEb21Ob2RlQ3NzQ2xhc3MoZWxlbWVudCwgY2xhc3NOYW1lLCBzaG91bGRIYXZlQ2xhc3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSB8fCAnJyk7IC8vIE1ha2Ugc3VyZSB3ZSBkb24ndCB0cnkgdG8gc3RvcmUgb3Igc2V0IGEgbm9uLXN0cmluZyB2YWx1ZVxuICAgICAgICAgICAga28udXRpbHMudG9nZ2xlRG9tTm9kZUNzc0NsYXNzKGVsZW1lbnQsIGVsZW1lbnRbY2xhc3Nlc1dyaXR0ZW5CeUJpbmRpbmdLZXldLCBmYWxzZSk7XG4gICAgICAgICAgICBlbGVtZW50W2NsYXNzZXNXcml0dGVuQnlCaW5kaW5nS2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAga28udXRpbHMudG9nZ2xlRG9tTm9kZUNzc0NsYXNzKGVsZW1lbnQsIHZhbHVlLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5rby5iaW5kaW5nSGFuZGxlcnNbJ2VuYWJsZSddID0ge1xuICAgICd1cGRhdGUnOiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3Nvcikge1xuICAgICAgICB2YXIgdmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSk7XG4gICAgICAgIGlmICh2YWx1ZSAmJiBlbGVtZW50LmRpc2FibGVkKVxuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgZWxzZSBpZiAoKCF2YWx1ZSkgJiYgKCFlbGVtZW50LmRpc2FibGVkKSlcbiAgICAgICAgICAgIGVsZW1lbnQuZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cbn07XG5cbmtvLmJpbmRpbmdIYW5kbGVyc1snZGlzYWJsZSddID0ge1xuICAgICd1cGRhdGUnOiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3Nvcikge1xuICAgICAgICBrby5iaW5kaW5nSGFuZGxlcnNbJ2VuYWJsZSddWyd1cGRhdGUnXShlbGVtZW50LCBmdW5jdGlvbigpIHsgcmV0dXJuICFrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSkgfSk7XG4gICAgfVxufTtcbi8vIEZvciBjZXJ0YWluIGNvbW1vbiBldmVudHMgKGN1cnJlbnRseSBqdXN0ICdjbGljaycpLCBhbGxvdyBhIHNpbXBsaWZpZWQgZGF0YS1iaW5kaW5nIHN5bnRheFxuLy8gZS5nLiBjbGljazpoYW5kbGVyIGluc3RlYWQgb2YgdGhlIHVzdWFsIGZ1bGwtbGVuZ3RoIGV2ZW50OntjbGljazpoYW5kbGVyfVxuZnVuY3Rpb24gbWFrZUV2ZW50SGFuZGxlclNob3J0Y3V0KGV2ZW50TmFtZSkge1xuICAgIGtvLmJpbmRpbmdIYW5kbGVyc1tldmVudE5hbWVdID0ge1xuICAgICAgICAnaW5pdCc6IGZ1bmN0aW9uKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzLCB2aWV3TW9kZWwsIGJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgICAgICB2YXIgbmV3VmFsdWVBY2Nlc3NvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICAgICAgICAgICAgcmVzdWx0W2V2ZW50TmFtZV0gPSB2YWx1ZUFjY2Vzc29yKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4ga28uYmluZGluZ0hhbmRsZXJzWydldmVudCddWydpbml0J10uY2FsbCh0aGlzLCBlbGVtZW50LCBuZXdWYWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5ncywgdmlld01vZGVsLCBiaW5kaW5nQ29udGV4dCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmtvLmJpbmRpbmdIYW5kbGVyc1snZXZlbnQnXSA9IHtcbiAgICAnaW5pdCcgOiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3MsIHZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpIHtcbiAgICAgICAgdmFyIGV2ZW50c1RvSGFuZGxlID0gdmFsdWVBY2Nlc3NvcigpIHx8IHt9O1xuICAgICAgICBrby51dGlscy5vYmplY3RGb3JFYWNoKGV2ZW50c1RvSGFuZGxlLCBmdW5jdGlvbihldmVudE5hbWUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXZlbnROYW1lID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICBrby51dGlscy5yZWdpc3RlckV2ZW50SGFuZGxlcihlbGVtZW50LCBldmVudE5hbWUsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGFuZGxlclJldHVyblZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGFuZGxlckZ1bmN0aW9uID0gdmFsdWVBY2Nlc3NvcigpW2V2ZW50TmFtZV07XG4gICAgICAgICAgICAgICAgICAgIGlmICghaGFuZGxlckZ1bmN0aW9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUYWtlIGFsbCB0aGUgZXZlbnQgYXJncywgYW5kIHByZWZpeCB3aXRoIHRoZSB2aWV3bW9kZWxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhcmdzRm9ySGFuZGxlciA9IGtvLnV0aWxzLm1ha2VBcnJheShhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlld01vZGVsID0gYmluZGluZ0NvbnRleHRbJyRkYXRhJ107XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmdzRm9ySGFuZGxlci51bnNoaWZ0KHZpZXdNb2RlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyUmV0dXJuVmFsdWUgPSBoYW5kbGVyRnVuY3Rpb24uYXBwbHkodmlld01vZGVsLCBhcmdzRm9ySGFuZGxlcik7XG4gICAgICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFuZGxlclJldHVyblZhbHVlICE9PSB0cnVlKSB7IC8vIE5vcm1hbGx5IHdlIHdhbnQgdG8gcHJldmVudCBkZWZhdWx0IGFjdGlvbi4gRGV2ZWxvcGVyIGNhbiBvdmVycmlkZSB0aGlzIGJlIGV4cGxpY2l0bHkgcmV0dXJuaW5nIHRydWUuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LnByZXZlbnREZWZhdWx0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciBidWJibGUgPSBhbGxCaW5kaW5ncy5nZXQoZXZlbnROYW1lICsgJ0J1YmJsZScpICE9PSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFidWJibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LmNhbmNlbEJ1YmJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQuc3RvcFByb3BhZ2F0aW9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4vLyBcImZvcmVhY2g6IHNvbWVFeHByZXNzaW9uXCIgaXMgZXF1aXZhbGVudCB0byBcInRlbXBsYXRlOiB7IGZvcmVhY2g6IHNvbWVFeHByZXNzaW9uIH1cIlxuLy8gXCJmb3JlYWNoOiB7IGRhdGE6IHNvbWVFeHByZXNzaW9uLCBhZnRlckFkZDogbXlmbiB9XCIgaXMgZXF1aXZhbGVudCB0byBcInRlbXBsYXRlOiB7IGZvcmVhY2g6IHNvbWVFeHByZXNzaW9uLCBhZnRlckFkZDogbXlmbiB9XCJcbmtvLmJpbmRpbmdIYW5kbGVyc1snZm9yZWFjaCddID0ge1xuICAgIG1ha2VUZW1wbGF0ZVZhbHVlQWNjZXNzb3I6IGZ1bmN0aW9uKHZhbHVlQWNjZXNzb3IpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG1vZGVsVmFsdWUgPSB2YWx1ZUFjY2Vzc29yKCksXG4gICAgICAgICAgICAgICAgdW53cmFwcGVkVmFsdWUgPSBrby51dGlscy5wZWVrT2JzZXJ2YWJsZShtb2RlbFZhbHVlKTsgICAgLy8gVW53cmFwIHdpdGhvdXQgc2V0dGluZyBhIGRlcGVuZGVuY3kgaGVyZVxuXG4gICAgICAgICAgICAvLyBJZiB1bndyYXBwZWRWYWx1ZSBpcyB0aGUgYXJyYXksIHBhc3MgaW4gdGhlIHdyYXBwZWQgdmFsdWUgb24gaXRzIG93blxuICAgICAgICAgICAgLy8gVGhlIHZhbHVlIHdpbGwgYmUgdW53cmFwcGVkIGFuZCB0cmFja2VkIHdpdGhpbiB0aGUgdGVtcGxhdGUgYmluZGluZ1xuICAgICAgICAgICAgLy8gKFNlZSBodHRwczovL2dpdGh1Yi5jb20vU3RldmVTYW5kZXJzb24va25vY2tvdXQvaXNzdWVzLzUyMylcbiAgICAgICAgICAgIGlmICgoIXVud3JhcHBlZFZhbHVlKSB8fCB0eXBlb2YgdW53cmFwcGVkVmFsdWUubGVuZ3RoID09IFwibnVtYmVyXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgJ2ZvcmVhY2gnOiBtb2RlbFZhbHVlLCAndGVtcGxhdGVFbmdpbmUnOiBrby5uYXRpdmVUZW1wbGF0ZUVuZ2luZS5pbnN0YW5jZSB9O1xuXG4gICAgICAgICAgICAvLyBJZiB1bndyYXBwZWRWYWx1ZS5kYXRhIGlzIHRoZSBhcnJheSwgcHJlc2VydmUgYWxsIHJlbGV2YW50IG9wdGlvbnMgYW5kIHVud3JhcCBhZ2FpbiB2YWx1ZSBzbyB3ZSBnZXQgdXBkYXRlc1xuICAgICAgICAgICAga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShtb2RlbFZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgJ2ZvcmVhY2gnOiB1bndyYXBwZWRWYWx1ZVsnZGF0YSddLFxuICAgICAgICAgICAgICAgICdhcyc6IHVud3JhcHBlZFZhbHVlWydhcyddLFxuICAgICAgICAgICAgICAgICdpbmNsdWRlRGVzdHJveWVkJzogdW53cmFwcGVkVmFsdWVbJ2luY2x1ZGVEZXN0cm95ZWQnXSxcbiAgICAgICAgICAgICAgICAnYWZ0ZXJBZGQnOiB1bndyYXBwZWRWYWx1ZVsnYWZ0ZXJBZGQnXSxcbiAgICAgICAgICAgICAgICAnYmVmb3JlUmVtb3ZlJzogdW53cmFwcGVkVmFsdWVbJ2JlZm9yZVJlbW92ZSddLFxuICAgICAgICAgICAgICAgICdhZnRlclJlbmRlcic6IHVud3JhcHBlZFZhbHVlWydhZnRlclJlbmRlciddLFxuICAgICAgICAgICAgICAgICdiZWZvcmVNb3ZlJzogdW53cmFwcGVkVmFsdWVbJ2JlZm9yZU1vdmUnXSxcbiAgICAgICAgICAgICAgICAnYWZ0ZXJNb3ZlJzogdW53cmFwcGVkVmFsdWVbJ2FmdGVyTW92ZSddLFxuICAgICAgICAgICAgICAgICd0ZW1wbGF0ZUVuZ2luZSc6IGtvLm5hdGl2ZVRlbXBsYXRlRW5naW5lLmluc3RhbmNlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgIH0sXG4gICAgJ2luaXQnOiBmdW5jdGlvbihlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5ncywgdmlld01vZGVsLCBiaW5kaW5nQ29udGV4dCkge1xuICAgICAgICByZXR1cm4ga28uYmluZGluZ0hhbmRsZXJzWyd0ZW1wbGF0ZSddWydpbml0J10oZWxlbWVudCwga28uYmluZGluZ0hhbmRsZXJzWydmb3JlYWNoJ10ubWFrZVRlbXBsYXRlVmFsdWVBY2Nlc3Nvcih2YWx1ZUFjY2Vzc29yKSk7XG4gICAgfSxcbiAgICAndXBkYXRlJzogZnVuY3Rpb24oZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3MsIHZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIGtvLmJpbmRpbmdIYW5kbGVyc1sndGVtcGxhdGUnXVsndXBkYXRlJ10oZWxlbWVudCwga28uYmluZGluZ0hhbmRsZXJzWydmb3JlYWNoJ10ubWFrZVRlbXBsYXRlVmFsdWVBY2Nlc3Nvcih2YWx1ZUFjY2Vzc29yKSwgYWxsQmluZGluZ3MsIHZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpO1xuICAgIH1cbn07XG5rby5leHByZXNzaW9uUmV3cml0aW5nLmJpbmRpbmdSZXdyaXRlVmFsaWRhdG9yc1snZm9yZWFjaCddID0gZmFsc2U7IC8vIENhbid0IHJld3JpdGUgY29udHJvbCBmbG93IGJpbmRpbmdzXG5rby52aXJ0dWFsRWxlbWVudHMuYWxsb3dlZEJpbmRpbmdzWydmb3JlYWNoJ10gPSB0cnVlO1xudmFyIGhhc2ZvY3VzVXBkYXRpbmdQcm9wZXJ0eSA9ICdfX2tvX2hhc2ZvY3VzVXBkYXRpbmcnO1xudmFyIGhhc2ZvY3VzTGFzdFZhbHVlID0gJ19fa29faGFzZm9jdXNMYXN0VmFsdWUnO1xua28uYmluZGluZ0hhbmRsZXJzWydoYXNmb2N1cyddID0ge1xuICAgICdpbml0JzogZnVuY3Rpb24oZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3MpIHtcbiAgICAgICAgdmFyIGhhbmRsZUVsZW1lbnRGb2N1c0NoYW5nZSA9IGZ1bmN0aW9uKGlzRm9jdXNlZCkge1xuICAgICAgICAgICAgLy8gV2hlcmUgcG9zc2libGUsIGlnbm9yZSB3aGljaCBldmVudCB3YXMgcmFpc2VkIGFuZCBkZXRlcm1pbmUgZm9jdXMgc3RhdGUgdXNpbmcgYWN0aXZlRWxlbWVudCxcbiAgICAgICAgICAgIC8vIGFzIHRoaXMgYXZvaWRzIHBoYW50b20gZm9jdXMvYmx1ciBldmVudHMgcmFpc2VkIHdoZW4gY2hhbmdpbmcgdGFicyBpbiBtb2Rlcm4gYnJvd3NlcnMuXG4gICAgICAgICAgICAvLyBIb3dldmVyLCBub3QgYWxsIEtPLXRhcmdldGVkIGJyb3dzZXJzIChGaXJlZm94IDIpIHN1cHBvcnQgYWN0aXZlRWxlbWVudC4gRm9yIHRob3NlIGJyb3dzZXJzLFxuICAgICAgICAgICAgLy8gcHJldmVudCBhIGxvc3Mgb2YgZm9jdXMgd2hlbiBjaGFuZ2luZyB0YWJzL3dpbmRvd3MgYnkgc2V0dGluZyBhIGZsYWcgdGhhdCBwcmV2ZW50cyBoYXNmb2N1c1xuICAgICAgICAgICAgLy8gZnJvbSBjYWxsaW5nICdibHVyKCknIG9uIHRoZSBlbGVtZW50IHdoZW4gaXQgbG9zZXMgZm9jdXMuXG4gICAgICAgICAgICAvLyBEaXNjdXNzaW9uIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9TdGV2ZVNhbmRlcnNvbi9rbm9ja291dC9wdWxsLzM1MlxuICAgICAgICAgICAgZWxlbWVudFtoYXNmb2N1c1VwZGF0aW5nUHJvcGVydHldID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBvd25lckRvYyA9IGVsZW1lbnQub3duZXJEb2N1bWVudDtcbiAgICAgICAgICAgIGlmIChcImFjdGl2ZUVsZW1lbnRcIiBpbiBvd25lckRvYykge1xuICAgICAgICAgICAgICAgIHZhciBhY3RpdmU7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlID0gb3duZXJEb2MuYWN0aXZlRWxlbWVudDtcbiAgICAgICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSUU5IHRocm93cyBpZiB5b3UgYWNjZXNzIGFjdGl2ZUVsZW1lbnQgZHVyaW5nIHBhZ2UgbG9hZCAoc2VlIGlzc3VlICM3MDMpXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZSA9IG93bmVyRG9jLmJvZHk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlzRm9jdXNlZCA9IChhY3RpdmUgPT09IGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG1vZGVsVmFsdWUgPSB2YWx1ZUFjY2Vzc29yKCk7XG4gICAgICAgICAgICBrby5leHByZXNzaW9uUmV3cml0aW5nLndyaXRlVmFsdWVUb1Byb3BlcnR5KG1vZGVsVmFsdWUsIGFsbEJpbmRpbmdzLCAnaGFzZm9jdXMnLCBpc0ZvY3VzZWQsIHRydWUpO1xuXG4gICAgICAgICAgICAvL2NhY2hlIHRoZSBsYXRlc3QgdmFsdWUsIHNvIHdlIGNhbiBhdm9pZCB1bm5lY2Vzc2FyaWx5IGNhbGxpbmcgZm9jdXMvYmx1ciBpbiB0aGUgdXBkYXRlIGZ1bmN0aW9uXG4gICAgICAgICAgICBlbGVtZW50W2hhc2ZvY3VzTGFzdFZhbHVlXSA9IGlzRm9jdXNlZDtcbiAgICAgICAgICAgIGVsZW1lbnRbaGFzZm9jdXNVcGRhdGluZ1Byb3BlcnR5XSA9IGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgaGFuZGxlRWxlbWVudEZvY3VzSW4gPSBoYW5kbGVFbGVtZW50Rm9jdXNDaGFuZ2UuYmluZChudWxsLCB0cnVlKTtcbiAgICAgICAgdmFyIGhhbmRsZUVsZW1lbnRGb2N1c091dCA9IGhhbmRsZUVsZW1lbnRGb2N1c0NoYW5nZS5iaW5kKG51bGwsIGZhbHNlKTtcblxuICAgICAgICBrby51dGlscy5yZWdpc3RlckV2ZW50SGFuZGxlcihlbGVtZW50LCBcImZvY3VzXCIsIGhhbmRsZUVsZW1lbnRGb2N1c0luKTtcbiAgICAgICAga28udXRpbHMucmVnaXN0ZXJFdmVudEhhbmRsZXIoZWxlbWVudCwgXCJmb2N1c2luXCIsIGhhbmRsZUVsZW1lbnRGb2N1c0luKTsgLy8gRm9yIElFXG4gICAgICAgIGtvLnV0aWxzLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKGVsZW1lbnQsIFwiYmx1clwiLCAgaGFuZGxlRWxlbWVudEZvY3VzT3V0KTtcbiAgICAgICAga28udXRpbHMucmVnaXN0ZXJFdmVudEhhbmRsZXIoZWxlbWVudCwgXCJmb2N1c291dFwiLCAgaGFuZGxlRWxlbWVudEZvY3VzT3V0KTsgLy8gRm9yIElFXG4gICAgfSxcbiAgICAndXBkYXRlJzogZnVuY3Rpb24oZWxlbWVudCwgdmFsdWVBY2Nlc3Nvcikge1xuICAgICAgICB2YXIgdmFsdWUgPSAhIWtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpKTsgLy9mb3JjZSBib29sZWFuIHRvIGNvbXBhcmUgd2l0aCBsYXN0IHZhbHVlXG4gICAgICAgIGlmICghZWxlbWVudFtoYXNmb2N1c1VwZGF0aW5nUHJvcGVydHldICYmIGVsZW1lbnRbaGFzZm9jdXNMYXN0VmFsdWVdICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgdmFsdWUgPyBlbGVtZW50LmZvY3VzKCkgOiBlbGVtZW50LmJsdXIoKTtcbiAgICAgICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uaWdub3JlKGtvLnV0aWxzLnRyaWdnZXJFdmVudCwgbnVsbCwgW2VsZW1lbnQsIHZhbHVlID8gXCJmb2N1c2luXCIgOiBcImZvY3Vzb3V0XCJdKTsgLy8gRm9yIElFLCB3aGljaCBkb2Vzbid0IHJlbGlhYmx5IGZpcmUgXCJmb2N1c1wiIG9yIFwiYmx1clwiIGV2ZW50cyBzeW5jaHJvbm91c2x5XG4gICAgICAgIH1cbiAgICB9XG59O1xua28uZXhwcmVzc2lvblJld3JpdGluZy50d29XYXlCaW5kaW5nc1snaGFzZm9jdXMnXSA9IHRydWU7XG5cbmtvLmJpbmRpbmdIYW5kbGVyc1snaGFzRm9jdXMnXSA9IGtvLmJpbmRpbmdIYW5kbGVyc1snaGFzZm9jdXMnXTsgLy8gTWFrZSBcImhhc0ZvY3VzXCIgYW4gYWxpYXNcbmtvLmV4cHJlc3Npb25SZXdyaXRpbmcudHdvV2F5QmluZGluZ3NbJ2hhc0ZvY3VzJ10gPSB0cnVlO1xua28uYmluZGluZ0hhbmRsZXJzWydodG1sJ10gPSB7XG4gICAgJ2luaXQnOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gUHJldmVudCBiaW5kaW5nIG9uIHRoZSBkeW5hbWljYWxseS1pbmplY3RlZCBIVE1MIChhcyBkZXZlbG9wZXJzIGFyZSB1bmxpa2VseSB0byBleHBlY3QgdGhhdCwgYW5kIGl0IGhhcyBzZWN1cml0eSBpbXBsaWNhdGlvbnMpXG4gICAgICAgIHJldHVybiB7ICdjb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5ncyc6IHRydWUgfTtcbiAgICB9LFxuICAgICd1cGRhdGUnOiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3Nvcikge1xuICAgICAgICAvLyBzZXRIdG1sIHdpbGwgdW53cmFwIHRoZSB2YWx1ZSBpZiBuZWVkZWRcbiAgICAgICAga28udXRpbHMuc2V0SHRtbChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yKCkpO1xuICAgIH1cbn07XG4vLyBNYWtlcyBhIGJpbmRpbmcgbGlrZSB3aXRoIG9yIGlmXG5mdW5jdGlvbiBtYWtlV2l0aElmQmluZGluZyhiaW5kaW5nS2V5LCBpc1dpdGgsIGlzTm90LCBtYWtlQ29udGV4dENhbGxiYWNrKSB7XG4gICAga28uYmluZGluZ0hhbmRsZXJzW2JpbmRpbmdLZXldID0ge1xuICAgICAgICAnaW5pdCc6IGZ1bmN0aW9uKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzLCB2aWV3TW9kZWwsIGJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgICAgICB2YXIgZGlkRGlzcGxheU9uTGFzdFVwZGF0ZSxcbiAgICAgICAgICAgICAgICBzYXZlZE5vZGVzO1xuICAgICAgICAgICAga28uY29tcHV0ZWQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGFWYWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpKSxcbiAgICAgICAgICAgICAgICAgICAgc2hvdWxkRGlzcGxheSA9ICFpc05vdCAhPT0gIWRhdGFWYWx1ZSwgLy8gZXF1aXZhbGVudCB0byBpc05vdCA/ICFkYXRhVmFsdWUgOiAhIWRhdGFWYWx1ZVxuICAgICAgICAgICAgICAgICAgICBpc0ZpcnN0UmVuZGVyID0gIXNhdmVkTm9kZXMsXG4gICAgICAgICAgICAgICAgICAgIG5lZWRzUmVmcmVzaCA9IGlzRmlyc3RSZW5kZXIgfHwgaXNXaXRoIHx8IChzaG91bGREaXNwbGF5ICE9PSBkaWREaXNwbGF5T25MYXN0VXBkYXRlKTtcblxuICAgICAgICAgICAgICAgIGlmIChuZWVkc1JlZnJlc2gpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2F2ZSBhIGNvcHkgb2YgdGhlIGlubmVyIG5vZGVzIG9uIHRoZSBpbml0aWFsIHVwZGF0ZSwgYnV0IG9ubHkgaWYgd2UgaGF2ZSBkZXBlbmRlbmNpZXMuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0ZpcnN0UmVuZGVyICYmIGtvLmNvbXB1dGVkQ29udGV4dC5nZXREZXBlbmRlbmNpZXNDb3VudCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYXZlZE5vZGVzID0ga28udXRpbHMuY2xvbmVOb2Rlcyhrby52aXJ0dWFsRWxlbWVudHMuY2hpbGROb2RlcyhlbGVtZW50KSwgdHJ1ZSAvKiBzaG91bGRDbGVhbk5vZGVzICovKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzaG91bGREaXNwbGF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzRmlyc3RSZW5kZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrby52aXJ0dWFsRWxlbWVudHMuc2V0RG9tTm9kZUNoaWxkcmVuKGVsZW1lbnQsIGtvLnV0aWxzLmNsb25lTm9kZXMoc2F2ZWROb2RlcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAga28uYXBwbHlCaW5kaW5nc1RvRGVzY2VuZGFudHMobWFrZUNvbnRleHRDYWxsYmFjayA/IG1ha2VDb250ZXh0Q2FsbGJhY2soYmluZGluZ0NvbnRleHQsIGRhdGFWYWx1ZSkgOiBiaW5kaW5nQ29udGV4dCwgZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrby52aXJ0dWFsRWxlbWVudHMuZW1wdHlOb2RlKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZGlkRGlzcGxheU9uTGFzdFVwZGF0ZSA9IHNob3VsZERpc3BsYXk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgbnVsbCwgeyBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IGVsZW1lbnQgfSk7XG4gICAgICAgICAgICByZXR1cm4geyAnY29udHJvbHNEZXNjZW5kYW50QmluZGluZ3MnOiB0cnVlIH07XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGtvLmV4cHJlc3Npb25SZXdyaXRpbmcuYmluZGluZ1Jld3JpdGVWYWxpZGF0b3JzW2JpbmRpbmdLZXldID0gZmFsc2U7IC8vIENhbid0IHJld3JpdGUgY29udHJvbCBmbG93IGJpbmRpbmdzXG4gICAga28udmlydHVhbEVsZW1lbnRzLmFsbG93ZWRCaW5kaW5nc1tiaW5kaW5nS2V5XSA9IHRydWU7XG59XG5cbi8vIENvbnN0cnVjdCB0aGUgYWN0dWFsIGJpbmRpbmcgaGFuZGxlcnNcbm1ha2VXaXRoSWZCaW5kaW5nKCdpZicpO1xubWFrZVdpdGhJZkJpbmRpbmcoJ2lmbm90JywgZmFsc2UgLyogaXNXaXRoICovLCB0cnVlIC8qIGlzTm90ICovKTtcbm1ha2VXaXRoSWZCaW5kaW5nKCd3aXRoJywgdHJ1ZSAvKiBpc1dpdGggKi8sIGZhbHNlIC8qIGlzTm90ICovLFxuICAgIGZ1bmN0aW9uKGJpbmRpbmdDb250ZXh0LCBkYXRhVmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGJpbmRpbmdDb250ZXh0WydjcmVhdGVDaGlsZENvbnRleHQnXShkYXRhVmFsdWUpO1xuICAgIH1cbik7XG52YXIgY2FwdGlvblBsYWNlaG9sZGVyID0ge307XG5rby5iaW5kaW5nSGFuZGxlcnNbJ29wdGlvbnMnXSA9IHtcbiAgICAnaW5pdCc6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKGtvLnV0aWxzLnRhZ05hbWVMb3dlcihlbGVtZW50KSAhPT0gXCJzZWxlY3RcIilcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm9wdGlvbnMgYmluZGluZyBhcHBsaWVzIG9ubHkgdG8gU0VMRUNUIGVsZW1lbnRzXCIpO1xuXG4gICAgICAgIC8vIFJlbW92ZSBhbGwgZXhpc3RpbmcgPG9wdGlvbj5zLlxuICAgICAgICB3aGlsZSAoZWxlbWVudC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZSgwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEVuc3VyZXMgdGhhdCB0aGUgYmluZGluZyBwcm9jZXNzb3IgZG9lc24ndCB0cnkgdG8gYmluZCB0aGUgb3B0aW9uc1xuICAgICAgICByZXR1cm4geyAnY29udHJvbHNEZXNjZW5kYW50QmluZGluZ3MnOiB0cnVlIH07XG4gICAgfSxcbiAgICAndXBkYXRlJzogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzKSB7XG4gICAgICAgIGZ1bmN0aW9uIHNlbGVjdGVkT3B0aW9ucygpIHtcbiAgICAgICAgICAgIHJldHVybiBrby51dGlscy5hcnJheUZpbHRlcihlbGVtZW50Lm9wdGlvbnMsIGZ1bmN0aW9uIChub2RlKSB7IHJldHVybiBub2RlLnNlbGVjdGVkOyB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzZWxlY3RXYXNQcmV2aW91c2x5RW1wdHkgPSBlbGVtZW50Lmxlbmd0aCA9PSAwO1xuICAgICAgICB2YXIgcHJldmlvdXNTY3JvbGxUb3AgPSAoIXNlbGVjdFdhc1ByZXZpb3VzbHlFbXB0eSAmJiBlbGVtZW50Lm11bHRpcGxlKSA/IGVsZW1lbnQuc2Nyb2xsVG9wIDogbnVsbDtcbiAgICAgICAgdmFyIHVud3JhcHBlZEFycmF5ID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZUFjY2Vzc29yKCkpO1xuICAgICAgICB2YXIgaW5jbHVkZURlc3Ryb3llZCA9IGFsbEJpbmRpbmdzLmdldCgnb3B0aW9uc0luY2x1ZGVEZXN0cm95ZWQnKTtcbiAgICAgICAgdmFyIGFycmF5VG9Eb21Ob2RlQ2hpbGRyZW5PcHRpb25zID0ge307XG4gICAgICAgIHZhciBjYXB0aW9uVmFsdWU7XG4gICAgICAgIHZhciBmaWx0ZXJlZEFycmF5O1xuICAgICAgICB2YXIgcHJldmlvdXNTZWxlY3RlZFZhbHVlcztcblxuICAgICAgICBpZiAoZWxlbWVudC5tdWx0aXBsZSkge1xuICAgICAgICAgICAgcHJldmlvdXNTZWxlY3RlZFZhbHVlcyA9IGtvLnV0aWxzLmFycmF5TWFwKHNlbGVjdGVkT3B0aW9ucygpLCBrby5zZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcmV2aW91c1NlbGVjdGVkVmFsdWVzID0gZWxlbWVudC5zZWxlY3RlZEluZGV4ID49IDAgPyBbIGtvLnNlbGVjdEV4dGVuc2lvbnMucmVhZFZhbHVlKGVsZW1lbnQub3B0aW9uc1tlbGVtZW50LnNlbGVjdGVkSW5kZXhdKSBdIDogW107XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodW53cmFwcGVkQXJyYXkpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdW53cmFwcGVkQXJyYXkubGVuZ3RoID09IFwidW5kZWZpbmVkXCIpIC8vIENvZXJjZSBzaW5nbGUgdmFsdWUgaW50byBhcnJheVxuICAgICAgICAgICAgICAgIHVud3JhcHBlZEFycmF5ID0gW3Vud3JhcHBlZEFycmF5XTtcblxuICAgICAgICAgICAgLy8gRmlsdGVyIG91dCBhbnkgZW50cmllcyBtYXJrZWQgYXMgZGVzdHJveWVkXG4gICAgICAgICAgICBmaWx0ZXJlZEFycmF5ID0ga28udXRpbHMuYXJyYXlGaWx0ZXIodW53cmFwcGVkQXJyYXksIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5jbHVkZURlc3Ryb3llZCB8fCBpdGVtID09PSB1bmRlZmluZWQgfHwgaXRlbSA9PT0gbnVsbCB8fCAha28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShpdGVtWydfZGVzdHJveSddKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBJZiBjYXB0aW9uIGlzIGluY2x1ZGVkLCBhZGQgaXQgdG8gdGhlIGFycmF5XG4gICAgICAgICAgICBpZiAoYWxsQmluZGluZ3NbJ2hhcyddKCdvcHRpb25zQ2FwdGlvbicpKSB7XG4gICAgICAgICAgICAgICAgY2FwdGlvblZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShhbGxCaW5kaW5ncy5nZXQoJ29wdGlvbnNDYXB0aW9uJykpO1xuICAgICAgICAgICAgICAgIC8vIElmIGNhcHRpb24gdmFsdWUgaXMgbnVsbCBvciB1bmRlZmluZWQsIGRvbid0IHNob3cgYSBjYXB0aW9uXG4gICAgICAgICAgICAgICAgaWYgKGNhcHRpb25WYWx1ZSAhPT0gbnVsbCAmJiBjYXB0aW9uVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZEFycmF5LnVuc2hpZnQoY2FwdGlvblBsYWNlaG9sZGVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBJZiBhIGZhbHN5IHZhbHVlIGlzIHByb3ZpZGVkIChlLmcuIG51bGwpLCB3ZSdsbCBzaW1wbHkgZW1wdHkgdGhlIHNlbGVjdCBlbGVtZW50XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhcHBseVRvT2JqZWN0KG9iamVjdCwgcHJlZGljYXRlLCBkZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBwcmVkaWNhdGVUeXBlID0gdHlwZW9mIHByZWRpY2F0ZTtcbiAgICAgICAgICAgIGlmIChwcmVkaWNhdGVUeXBlID09IFwiZnVuY3Rpb25cIikgICAgLy8gR2l2ZW4gYSBmdW5jdGlvbjsgcnVuIGl0IGFnYWluc3QgdGhlIGRhdGEgdmFsdWVcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJlZGljYXRlKG9iamVjdCk7XG4gICAgICAgICAgICBlbHNlIGlmIChwcmVkaWNhdGVUeXBlID09IFwic3RyaW5nXCIpIC8vIEdpdmVuIGEgc3RyaW5nOyB0cmVhdCBpdCBhcyBhIHByb3BlcnR5IG5hbWUgb24gdGhlIGRhdGEgdmFsdWVcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqZWN0W3ByZWRpY2F0ZV07XG4gICAgICAgICAgICBlbHNlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHaXZlbiBubyBvcHRpb25zVGV4dCBhcmc7IHVzZSB0aGUgZGF0YSB2YWx1ZSBpdHNlbGZcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBmdW5jdGlvbnMgY2FuIHJ1biBhdCB0d28gZGlmZmVyZW50IHRpbWVzOlxuICAgICAgICAvLyBUaGUgZmlyc3QgaXMgd2hlbiB0aGUgd2hvbGUgYXJyYXkgaXMgYmVpbmcgdXBkYXRlZCBkaXJlY3RseSBmcm9tIHRoaXMgYmluZGluZyBoYW5kbGVyLlxuICAgICAgICAvLyBUaGUgc2Vjb25kIGlzIHdoZW4gYW4gb2JzZXJ2YWJsZSB2YWx1ZSBmb3IgYSBzcGVjaWZpYyBhcnJheSBlbnRyeSBpcyB1cGRhdGVkLlxuICAgICAgICAvLyBvbGRPcHRpb25zIHdpbGwgYmUgZW1wdHkgaW4gdGhlIGZpcnN0IGNhc2UsIGJ1dCB3aWxsIGJlIGZpbGxlZCB3aXRoIHRoZSBwcmV2aW91c2x5IGdlbmVyYXRlZCBvcHRpb24gaW4gdGhlIHNlY29uZC5cbiAgICAgICAgdmFyIGl0ZW1VcGRhdGUgPSBmYWxzZTtcbiAgICAgICAgZnVuY3Rpb24gb3B0aW9uRm9yQXJyYXlJdGVtKGFycmF5RW50cnksIGluZGV4LCBvbGRPcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAob2xkT3B0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBwcmV2aW91c1NlbGVjdGVkVmFsdWVzID0gb2xkT3B0aW9uc1swXS5zZWxlY3RlZCA/IFsga28uc2VsZWN0RXh0ZW5zaW9ucy5yZWFkVmFsdWUob2xkT3B0aW9uc1swXSkgXSA6IFtdO1xuICAgICAgICAgICAgICAgIGl0ZW1VcGRhdGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG9wdGlvbiA9IGVsZW1lbnQub3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuICAgICAgICAgICAgaWYgKGFycmF5RW50cnkgPT09IGNhcHRpb25QbGFjZWhvbGRlcikge1xuICAgICAgICAgICAgICAgIGtvLnV0aWxzLnNldFRleHRDb250ZW50KG9wdGlvbiwgYWxsQmluZGluZ3MuZ2V0KCdvcHRpb25zQ2FwdGlvbicpKTtcbiAgICAgICAgICAgICAgICBrby5zZWxlY3RFeHRlbnNpb25zLndyaXRlVmFsdWUob3B0aW9uLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBBcHBseSBhIHZhbHVlIHRvIHRoZSBvcHRpb24gZWxlbWVudFxuICAgICAgICAgICAgICAgIHZhciBvcHRpb25WYWx1ZSA9IGFwcGx5VG9PYmplY3QoYXJyYXlFbnRyeSwgYWxsQmluZGluZ3MuZ2V0KCdvcHRpb25zVmFsdWUnKSwgYXJyYXlFbnRyeSk7XG4gICAgICAgICAgICAgICAga28uc2VsZWN0RXh0ZW5zaW9ucy53cml0ZVZhbHVlKG9wdGlvbiwga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShvcHRpb25WYWx1ZSkpO1xuXG4gICAgICAgICAgICAgICAgLy8gQXBwbHkgc29tZSB0ZXh0IHRvIHRoZSBvcHRpb24gZWxlbWVudFxuICAgICAgICAgICAgICAgIHZhciBvcHRpb25UZXh0ID0gYXBwbHlUb09iamVjdChhcnJheUVudHJ5LCBhbGxCaW5kaW5ncy5nZXQoJ29wdGlvbnNUZXh0JyksIG9wdGlvblZhbHVlKTtcbiAgICAgICAgICAgICAgICBrby51dGlscy5zZXRUZXh0Q29udGVudChvcHRpb24sIG9wdGlvblRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFtvcHRpb25dO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQnkgdXNpbmcgYSBiZWZvcmVSZW1vdmUgY2FsbGJhY2ssIHdlIGRlbGF5IHRoZSByZW1vdmFsIHVudGlsIGFmdGVyIG5ldyBpdGVtcyBhcmUgYWRkZWQuIFRoaXMgZml4ZXMgYSBzZWxlY3Rpb25cbiAgICAgICAgLy8gcHJvYmxlbSBpbiBJRTw9OCBhbmQgRmlyZWZveC4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9rbm9ja291dC9rbm9ja291dC9pc3N1ZXMvMTIwOFxuICAgICAgICBhcnJheVRvRG9tTm9kZUNoaWxkcmVuT3B0aW9uc1snYmVmb3JlUmVtb3ZlJ10gPVxuICAgICAgICAgICAgZnVuY3Rpb24gKG9wdGlvbikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQ2hpbGQob3B0aW9uKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0U2VsZWN0aW9uQ2FsbGJhY2soYXJyYXlFbnRyeSwgbmV3T3B0aW9ucykge1xuICAgICAgICAgICAgLy8gSUU2IGRvZXNuJ3QgbGlrZSB1cyB0byBhc3NpZ24gc2VsZWN0aW9uIHRvIE9QVElPTiBub2RlcyBiZWZvcmUgdGhleSdyZSBhZGRlZCB0byB0aGUgZG9jdW1lbnQuXG4gICAgICAgICAgICAvLyBUaGF0J3Mgd2h5IHdlIGZpcnN0IGFkZGVkIHRoZW0gd2l0aG91dCBzZWxlY3Rpb24uIE5vdyBpdCdzIHRpbWUgdG8gc2V0IHRoZSBzZWxlY3Rpb24uXG4gICAgICAgICAgICBpZiAocHJldmlvdXNTZWxlY3RlZFZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB2YXIgaXNTZWxlY3RlZCA9IGtvLnV0aWxzLmFycmF5SW5kZXhPZihwcmV2aW91c1NlbGVjdGVkVmFsdWVzLCBrby5zZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZShuZXdPcHRpb25zWzBdKSkgPj0gMDtcbiAgICAgICAgICAgICAgICBrby51dGlscy5zZXRPcHRpb25Ob2RlU2VsZWN0aW9uU3RhdGUobmV3T3B0aW9uc1swXSwgaXNTZWxlY3RlZCk7XG5cbiAgICAgICAgICAgICAgICAvLyBJZiB0aGlzIG9wdGlvbiB3YXMgY2hhbmdlZCBmcm9tIGJlaW5nIHNlbGVjdGVkIGR1cmluZyBhIHNpbmdsZS1pdGVtIHVwZGF0ZSwgbm90aWZ5IHRoZSBjaGFuZ2VcbiAgICAgICAgICAgICAgICBpZiAoaXRlbVVwZGF0ZSAmJiAhaXNTZWxlY3RlZClcbiAgICAgICAgICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5pZ25vcmUoa28udXRpbHMudHJpZ2dlckV2ZW50LCBudWxsLCBbZWxlbWVudCwgXCJjaGFuZ2VcIl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNhbGxiYWNrID0gc2V0U2VsZWN0aW9uQ2FsbGJhY2s7XG4gICAgICAgIGlmIChhbGxCaW5kaW5nc1snaGFzJ10oJ29wdGlvbnNBZnRlclJlbmRlcicpKSB7XG4gICAgICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uKGFycmF5RW50cnksIG5ld09wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBzZXRTZWxlY3Rpb25DYWxsYmFjayhhcnJheUVudHJ5LCBuZXdPcHRpb25zKTtcbiAgICAgICAgICAgICAgICBrby5kZXBlbmRlbmN5RGV0ZWN0aW9uLmlnbm9yZShhbGxCaW5kaW5ncy5nZXQoJ29wdGlvbnNBZnRlclJlbmRlcicpLCBudWxsLCBbbmV3T3B0aW9uc1swXSwgYXJyYXlFbnRyeSAhPT0gY2FwdGlvblBsYWNlaG9sZGVyID8gYXJyYXlFbnRyeSA6IHVuZGVmaW5lZF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAga28udXRpbHMuc2V0RG9tTm9kZUNoaWxkcmVuRnJvbUFycmF5TWFwcGluZyhlbGVtZW50LCBmaWx0ZXJlZEFycmF5LCBvcHRpb25Gb3JBcnJheUl0ZW0sIGFycmF5VG9Eb21Ob2RlQ2hpbGRyZW5PcHRpb25zLCBjYWxsYmFjayk7XG5cbiAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5pZ25vcmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGFsbEJpbmRpbmdzLmdldCgndmFsdWVBbGxvd1Vuc2V0JykgJiYgYWxsQmluZGluZ3NbJ2hhcyddKCd2YWx1ZScpKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhlIG1vZGVsIHZhbHVlIGlzIGF1dGhvcml0YXRpdmUsIHNvIG1ha2Ugc3VyZSBpdHMgdmFsdWUgaXMgdGhlIG9uZSBzZWxlY3RlZFxuICAgICAgICAgICAgICAgIGtvLnNlbGVjdEV4dGVuc2lvbnMud3JpdGVWYWx1ZShlbGVtZW50LCBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKGFsbEJpbmRpbmdzLmdldCgndmFsdWUnKSksIHRydWUgLyogYWxsb3dVbnNldCAqLyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIERldGVybWluZSBpZiB0aGUgc2VsZWN0aW9uIGhhcyBjaGFuZ2VkIGFzIGEgcmVzdWx0IG9mIHVwZGF0aW5nIHRoZSBvcHRpb25zIGxpc3RcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0aW9uQ2hhbmdlZDtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5tdWx0aXBsZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBGb3IgYSBtdWx0aXBsZS1zZWxlY3QgYm94LCBjb21wYXJlIHRoZSBuZXcgc2VsZWN0aW9uIGNvdW50IHRvIHRoZSBwcmV2aW91cyBvbmVcbiAgICAgICAgICAgICAgICAgICAgLy8gQnV0IGlmIG5vdGhpbmcgd2FzIHNlbGVjdGVkIGJlZm9yZSwgdGhlIHNlbGVjdGlvbiBjYW4ndCBoYXZlIGNoYW5nZWRcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uQ2hhbmdlZCA9IHByZXZpb3VzU2VsZWN0ZWRWYWx1ZXMubGVuZ3RoICYmIHNlbGVjdGVkT3B0aW9ucygpLmxlbmd0aCA8IHByZXZpb3VzU2VsZWN0ZWRWYWx1ZXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEZvciBhIHNpbmdsZS1zZWxlY3QgYm94LCBjb21wYXJlIHRoZSBjdXJyZW50IHZhbHVlIHRvIHRoZSBwcmV2aW91cyB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAvLyBCdXQgaWYgbm90aGluZyB3YXMgc2VsZWN0ZWQgYmVmb3JlIG9yIG5vdGhpbmcgaXMgc2VsZWN0ZWQgbm93LCBqdXN0IGxvb2sgZm9yIGEgY2hhbmdlIGluIHNlbGVjdGlvblxuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25DaGFuZ2VkID0gKHByZXZpb3VzU2VsZWN0ZWRWYWx1ZXMubGVuZ3RoICYmIGVsZW1lbnQuc2VsZWN0ZWRJbmRleCA+PSAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgPyAoa28uc2VsZWN0RXh0ZW5zaW9ucy5yZWFkVmFsdWUoZWxlbWVudC5vcHRpb25zW2VsZW1lbnQuc2VsZWN0ZWRJbmRleF0pICE9PSBwcmV2aW91c1NlbGVjdGVkVmFsdWVzWzBdKVxuICAgICAgICAgICAgICAgICAgICAgICAgOiAocHJldmlvdXNTZWxlY3RlZFZhbHVlcy5sZW5ndGggfHwgZWxlbWVudC5zZWxlY3RlZEluZGV4ID49IDApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEVuc3VyZSBjb25zaXN0ZW5jeSBiZXR3ZWVuIG1vZGVsIHZhbHVlIGFuZCBzZWxlY3RlZCBvcHRpb24uXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIGRyb3Bkb3duIHdhcyBjaGFuZ2VkIHNvIHRoYXQgc2VsZWN0aW9uIGlzIG5vIGxvbmdlciB0aGUgc2FtZSxcbiAgICAgICAgICAgICAgICAvLyBub3RpZnkgdGhlIHZhbHVlIG9yIHNlbGVjdGVkT3B0aW9ucyBiaW5kaW5nLlxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3Rpb25DaGFuZ2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIGtvLnV0aWxzLnRyaWdnZXJFdmVudChlbGVtZW50LCBcImNoYW5nZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFdvcmthcm91bmQgZm9yIElFIGJ1Z1xuICAgICAgICBrby51dGlscy5lbnN1cmVTZWxlY3RFbGVtZW50SXNSZW5kZXJlZENvcnJlY3RseShlbGVtZW50KTtcblxuICAgICAgICBpZiAocHJldmlvdXNTY3JvbGxUb3AgJiYgTWF0aC5hYnMocHJldmlvdXNTY3JvbGxUb3AgLSBlbGVtZW50LnNjcm9sbFRvcCkgPiAyMClcbiAgICAgICAgICAgIGVsZW1lbnQuc2Nyb2xsVG9wID0gcHJldmlvdXNTY3JvbGxUb3A7XG4gICAgfVxufTtcbmtvLmJpbmRpbmdIYW5kbGVyc1snb3B0aW9ucyddLm9wdGlvblZhbHVlRG9tRGF0YUtleSA9IGtvLnV0aWxzLmRvbURhdGEubmV4dEtleSgpO1xua28uYmluZGluZ0hhbmRsZXJzWydzZWxlY3RlZE9wdGlvbnMnXSA9IHtcbiAgICAnYWZ0ZXInOiBbJ29wdGlvbnMnLCAnZm9yZWFjaCddLFxuICAgICdpbml0JzogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzKSB7XG4gICAgICAgIGtvLnV0aWxzLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKGVsZW1lbnQsIFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHZhbHVlQWNjZXNzb3IoKSwgdmFsdWVUb1dyaXRlID0gW107XG4gICAgICAgICAgICBrby51dGlscy5hcnJheUZvckVhY2goZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIm9wdGlvblwiKSwgZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgICAgIGlmIChub2RlLnNlbGVjdGVkKVxuICAgICAgICAgICAgICAgICAgICB2YWx1ZVRvV3JpdGUucHVzaChrby5zZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZShub2RlKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGtvLmV4cHJlc3Npb25SZXdyaXRpbmcud3JpdGVWYWx1ZVRvUHJvcGVydHkodmFsdWUsIGFsbEJpbmRpbmdzLCAnc2VsZWN0ZWRPcHRpb25zJywgdmFsdWVUb1dyaXRlKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICAndXBkYXRlJzogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IpIHtcbiAgICAgICAgaWYgKGtvLnV0aWxzLnRhZ05hbWVMb3dlcihlbGVtZW50KSAhPSBcInNlbGVjdFwiKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidmFsdWVzIGJpbmRpbmcgYXBwbGllcyBvbmx5IHRvIFNFTEVDVCBlbGVtZW50c1wiKTtcblxuICAgICAgICB2YXIgbmV3VmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSk7XG4gICAgICAgIGlmIChuZXdWYWx1ZSAmJiB0eXBlb2YgbmV3VmFsdWUubGVuZ3RoID09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIGtvLnV0aWxzLmFycmF5Rm9yRWFjaChlbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwib3B0aW9uXCIpLCBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlzU2VsZWN0ZWQgPSBrby51dGlscy5hcnJheUluZGV4T2YobmV3VmFsdWUsIGtvLnNlbGVjdEV4dGVuc2lvbnMucmVhZFZhbHVlKG5vZGUpKSA+PSAwO1xuICAgICAgICAgICAgICAgIGtvLnV0aWxzLnNldE9wdGlvbk5vZGVTZWxlY3Rpb25TdGF0ZShub2RlLCBpc1NlbGVjdGVkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufTtcbmtvLmV4cHJlc3Npb25SZXdyaXRpbmcudHdvV2F5QmluZGluZ3NbJ3NlbGVjdGVkT3B0aW9ucyddID0gdHJ1ZTtcbmtvLmJpbmRpbmdIYW5kbGVyc1snc3R5bGUnXSA9IHtcbiAgICAndXBkYXRlJzogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IpIHtcbiAgICAgICAgdmFyIHZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZUFjY2Vzc29yKCkgfHwge30pO1xuICAgICAgICBrby51dGlscy5vYmplY3RGb3JFYWNoKHZhbHVlLCBmdW5jdGlvbihzdHlsZU5hbWUsIHN0eWxlVmFsdWUpIHtcbiAgICAgICAgICAgIHN0eWxlVmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHN0eWxlVmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAoc3R5bGVWYWx1ZSA9PT0gbnVsbCB8fCBzdHlsZVZhbHVlID09PSB1bmRlZmluZWQgfHwgc3R5bGVWYWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAvLyBFbXB0eSBzdHJpbmcgcmVtb3ZlcyB0aGUgdmFsdWUsIHdoZXJlYXMgbnVsbC91bmRlZmluZWQgaGF2ZSBubyBlZmZlY3RcbiAgICAgICAgICAgICAgICBzdHlsZVZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZWxlbWVudC5zdHlsZVtzdHlsZU5hbWVdID0gc3R5bGVWYWx1ZTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbmtvLmJpbmRpbmdIYW5kbGVyc1snc3VibWl0J10gPSB7XG4gICAgJ2luaXQnOiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3MsIHZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZUFjY2Vzc29yKCkgIT0gXCJmdW5jdGlvblwiKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHZhbHVlIGZvciBhIHN1Ym1pdCBiaW5kaW5nIG11c3QgYmUgYSBmdW5jdGlvblwiKTtcbiAgICAgICAga28udXRpbHMucmVnaXN0ZXJFdmVudEhhbmRsZXIoZWxlbWVudCwgXCJzdWJtaXRcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgaGFuZGxlclJldHVyblZhbHVlO1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gdmFsdWVBY2Nlc3NvcigpO1xuICAgICAgICAgICAgdHJ5IHsgaGFuZGxlclJldHVyblZhbHVlID0gdmFsdWUuY2FsbChiaW5kaW5nQ29udGV4dFsnJGRhdGEnXSwgZWxlbWVudCk7IH1cbiAgICAgICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIGlmIChoYW5kbGVyUmV0dXJuVmFsdWUgIT09IHRydWUpIHsgLy8gTm9ybWFsbHkgd2Ugd2FudCB0byBwcmV2ZW50IGRlZmF1bHQgYWN0aW9uLiBEZXZlbG9wZXIgY2FuIG92ZXJyaWRlIHRoaXMgYmUgZXhwbGljaXRseSByZXR1cm5pbmcgdHJ1ZS5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LnByZXZlbnREZWZhdWx0KVxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5rby5iaW5kaW5nSGFuZGxlcnNbJ3RleHQnXSA9IHtcbiAgICAnaW5pdCc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBQcmV2ZW50IGJpbmRpbmcgb24gdGhlIGR5bmFtaWNhbGx5LWluamVjdGVkIHRleHQgbm9kZSAoYXMgZGV2ZWxvcGVycyBhcmUgdW5saWtlbHkgdG8gZXhwZWN0IHRoYXQsIGFuZCBpdCBoYXMgc2VjdXJpdHkgaW1wbGljYXRpb25zKS5cbiAgICAgICAgLy8gSXQgc2hvdWxkIGFsc28gbWFrZSB0aGluZ3MgZmFzdGVyLCBhcyB3ZSBubyBsb25nZXIgaGF2ZSB0byBjb25zaWRlciB3aGV0aGVyIHRoZSB0ZXh0IG5vZGUgbWlnaHQgYmUgYmluZGFibGUuXG4gICAgICAgIHJldHVybiB7ICdjb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5ncyc6IHRydWUgfTtcbiAgICB9LFxuICAgICd1cGRhdGUnOiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3Nvcikge1xuICAgICAgICBrby51dGlscy5zZXRUZXh0Q29udGVudChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yKCkpO1xuICAgIH1cbn07XG5rby52aXJ0dWFsRWxlbWVudHMuYWxsb3dlZEJpbmRpbmdzWyd0ZXh0J10gPSB0cnVlO1xuKGZ1bmN0aW9uICgpIHtcblxuaWYgKHdpbmRvdyAmJiB3aW5kb3cubmF2aWdhdG9yKSB7XG4gICAgdmFyIHBhcnNlVmVyc2lvbiA9IGZ1bmN0aW9uIChtYXRjaGVzKSB7XG4gICAgICAgIGlmIChtYXRjaGVzKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChtYXRjaGVzWzFdKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBEZXRlY3QgdmFyaW91cyBicm93c2VyIHZlcnNpb25zIGJlY2F1c2Ugc29tZSBvbGQgdmVyc2lvbnMgZG9uJ3QgZnVsbHkgc3VwcG9ydCB0aGUgJ2lucHV0JyBldmVudFxuICAgIHZhciBvcGVyYVZlcnNpb24gPSB3aW5kb3cub3BlcmEgJiYgd2luZG93Lm9wZXJhLnZlcnNpb24gJiYgcGFyc2VJbnQod2luZG93Lm9wZXJhLnZlcnNpb24oKSksXG4gICAgICAgIHVzZXJBZ2VudCA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LFxuICAgICAgICBzYWZhcmlWZXJzaW9uID0gcGFyc2VWZXJzaW9uKHVzZXJBZ2VudC5tYXRjaCgvXig/Oig/IWNocm9tZSkuKSp2ZXJzaW9uXFwvKFteIF0qKSBzYWZhcmkvaSkpLFxuICAgICAgICBmaXJlZm94VmVyc2lvbiA9IHBhcnNlVmVyc2lvbih1c2VyQWdlbnQubWF0Y2goL0ZpcmVmb3hcXC8oW14gXSopLykpO1xufVxuXG4vLyBJRSA4IGFuZCA5IGhhdmUgYnVncyB0aGF0IHByZXZlbnQgdGhlIG5vcm1hbCBldmVudHMgZnJvbSBmaXJpbmcgd2hlbiB0aGUgdmFsdWUgY2hhbmdlcy5cbi8vIEJ1dCBpdCBkb2VzIGZpcmUgdGhlICdzZWxlY3Rpb25jaGFuZ2UnIGV2ZW50IG9uIG1hbnkgb2YgdGhvc2UsIHByZXN1bWFibHkgYmVjYXVzZSB0aGVcbi8vIGN1cnNvciBpcyBtb3ZpbmcgYW5kIHRoYXQgY291bnRzIGFzIHRoZSBzZWxlY3Rpb24gY2hhbmdpbmcuIFRoZSAnc2VsZWN0aW9uY2hhbmdlJyBldmVudCBpc1xuLy8gZmlyZWQgYXQgdGhlIGRvY3VtZW50IGxldmVsIG9ubHkgYW5kIGRvZXNuJ3QgZGlyZWN0bHkgaW5kaWNhdGUgd2hpY2ggZWxlbWVudCBjaGFuZ2VkLiBXZVxuLy8gc2V0IHVwIGp1c3Qgb25lIGV2ZW50IGhhbmRsZXIgZm9yIHRoZSBkb2N1bWVudCBhbmQgdXNlICdhY3RpdmVFbGVtZW50JyB0byBkZXRlcm1pbmUgd2hpY2hcbi8vIGVsZW1lbnQgd2FzIGNoYW5nZWQuXG5pZiAoa28udXRpbHMuaWVWZXJzaW9uIDwgMTApIHtcbiAgICB2YXIgc2VsZWN0aW9uQ2hhbmdlUmVnaXN0ZXJlZE5hbWUgPSBrby51dGlscy5kb21EYXRhLm5leHRLZXkoKSxcbiAgICAgICAgc2VsZWN0aW9uQ2hhbmdlSGFuZGxlck5hbWUgPSBrby51dGlscy5kb21EYXRhLm5leHRLZXkoKTtcbiAgICB2YXIgc2VsZWN0aW9uQ2hhbmdlSGFuZGxlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHZhciB0YXJnZXQgPSB0aGlzLmFjdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgICBoYW5kbGVyID0gdGFyZ2V0ICYmIGtvLnV0aWxzLmRvbURhdGEuZ2V0KHRhcmdldCwgc2VsZWN0aW9uQ2hhbmdlSGFuZGxlck5hbWUpO1xuICAgICAgICBpZiAoaGFuZGxlcikge1xuICAgICAgICAgICAgaGFuZGxlcihldmVudCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHZhciByZWdpc3RlckZvclNlbGVjdGlvbkNoYW5nZUV2ZW50ID0gZnVuY3Rpb24gKGVsZW1lbnQsIGhhbmRsZXIpIHtcbiAgICAgICAgdmFyIG93bmVyRG9jID0gZWxlbWVudC5vd25lckRvY3VtZW50O1xuICAgICAgICBpZiAoIWtvLnV0aWxzLmRvbURhdGEuZ2V0KG93bmVyRG9jLCBzZWxlY3Rpb25DaGFuZ2VSZWdpc3RlcmVkTmFtZSkpIHtcbiAgICAgICAgICAgIGtvLnV0aWxzLmRvbURhdGEuc2V0KG93bmVyRG9jLCBzZWxlY3Rpb25DaGFuZ2VSZWdpc3RlcmVkTmFtZSwgdHJ1ZSk7XG4gICAgICAgICAgICBrby51dGlscy5yZWdpc3RlckV2ZW50SGFuZGxlcihvd25lckRvYywgJ3NlbGVjdGlvbmNoYW5nZScsIHNlbGVjdGlvbkNoYW5nZUhhbmRsZXIpO1xuICAgICAgICB9XG4gICAgICAgIGtvLnV0aWxzLmRvbURhdGEuc2V0KGVsZW1lbnQsIHNlbGVjdGlvbkNoYW5nZUhhbmRsZXJOYW1lLCBoYW5kbGVyKTtcbiAgICB9O1xufVxuXG5rby5iaW5kaW5nSGFuZGxlcnNbJ3RleHRJbnB1dCddID0ge1xuICAgICdpbml0JzogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzKSB7XG5cbiAgICAgICAgdmFyIHByZXZpb3VzRWxlbWVudFZhbHVlID0gZWxlbWVudC52YWx1ZSxcbiAgICAgICAgICAgIHRpbWVvdXRIYW5kbGUsXG4gICAgICAgICAgICBlbGVtZW50VmFsdWVCZWZvcmVFdmVudDtcblxuICAgICAgICB2YXIgdXBkYXRlTW9kZWwgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SGFuZGxlKTtcbiAgICAgICAgICAgIGVsZW1lbnRWYWx1ZUJlZm9yZUV2ZW50ID0gdGltZW91dEhhbmRsZSA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgdmFyIGVsZW1lbnRWYWx1ZSA9IGVsZW1lbnQudmFsdWU7XG4gICAgICAgICAgICBpZiAocHJldmlvdXNFbGVtZW50VmFsdWUgIT09IGVsZW1lbnRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIC8vIFByb3ZpZGUgYSB3YXkgZm9yIHRlc3RzIHRvIGtub3cgZXhhY3RseSB3aGljaCBldmVudCB3YXMgcHJvY2Vzc2VkXG4gICAgICAgICAgICAgICAgaWYgKERFQlVHICYmIGV2ZW50KSBlbGVtZW50Wydfa29fdGV4dElucHV0UHJvY2Vzc2VkRXZlbnQnXSA9IGV2ZW50LnR5cGU7XG4gICAgICAgICAgICAgICAgcHJldmlvdXNFbGVtZW50VmFsdWUgPSBlbGVtZW50VmFsdWU7XG4gICAgICAgICAgICAgICAga28uZXhwcmVzc2lvblJld3JpdGluZy53cml0ZVZhbHVlVG9Qcm9wZXJ0eSh2YWx1ZUFjY2Vzc29yKCksIGFsbEJpbmRpbmdzLCAndGV4dElucHV0JywgZWxlbWVudFZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZGVmZXJVcGRhdGVNb2RlbCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgaWYgKCF0aW1lb3V0SGFuZGxlKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhlIGVsZW1lbnRWYWx1ZUJlZm9yZUV2ZW50IHZhcmlhYmxlIGlzIHNldCAqb25seSogZHVyaW5nIHRoZSBicmllZiBnYXAgYmV0d2VlbiBhblxuICAgICAgICAgICAgICAgIC8vIGV2ZW50IGZpcmluZyBhbmQgdGhlIHVwZGF0ZU1vZGVsIGZ1bmN0aW9uIHJ1bm5pbmcuIFRoaXMgYWxsb3dzIHVzIHRvIGlnbm9yZSBtb2RlbFxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZXMgdGhhdCBhcmUgZnJvbSB0aGUgcHJldmlvdXMgc3RhdGUgb2YgdGhlIGVsZW1lbnQsIHVzdWFsbHkgZHVlIHRvIHRlY2huaXF1ZXNcbiAgICAgICAgICAgICAgICAvLyBzdWNoIGFzIHJhdGVMaW1pdC4gU3VjaCB1cGRhdGVzLCBpZiBub3QgaWdub3JlZCwgY2FuIGNhdXNlIGtleXN0cm9rZXMgdG8gYmUgbG9zdC5cbiAgICAgICAgICAgICAgICBlbGVtZW50VmFsdWVCZWZvcmVFdmVudCA9IGVsZW1lbnQudmFsdWU7XG4gICAgICAgICAgICAgICAgdmFyIGhhbmRsZXIgPSBERUJVRyA/IHVwZGF0ZU1vZGVsLmJpbmQoZWxlbWVudCwge3R5cGU6IGV2ZW50LnR5cGV9KSA6IHVwZGF0ZU1vZGVsO1xuICAgICAgICAgICAgICAgIHRpbWVvdXRIYW5kbGUgPSBzZXRUaW1lb3V0KGhhbmRsZXIsIDQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciB1cGRhdGVWaWV3ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG1vZGVsVmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSk7XG5cbiAgICAgICAgICAgIGlmIChtb2RlbFZhbHVlID09PSBudWxsIHx8IG1vZGVsVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG1vZGVsVmFsdWUgPSAnJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGVsZW1lbnRWYWx1ZUJlZm9yZUV2ZW50ICE9PSB1bmRlZmluZWQgJiYgbW9kZWxWYWx1ZSA9PT0gZWxlbWVudFZhbHVlQmVmb3JlRXZlbnQpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHVwZGF0ZVZpZXcsIDQpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBlbGVtZW50IG9ubHkgaWYgdGhlIGVsZW1lbnQgYW5kIG1vZGVsIGFyZSBkaWZmZXJlbnQuIE9uIHNvbWUgYnJvd3NlcnMsIHVwZGF0aW5nIHRoZSB2YWx1ZVxuICAgICAgICAgICAgLy8gd2lsbCBtb3ZlIHRoZSBjdXJzb3IgdG8gdGhlIGVuZCBvZiB0aGUgaW5wdXQsIHdoaWNoIHdvdWxkIGJlIGJhZCB3aGlsZSB0aGUgdXNlciBpcyB0eXBpbmcuXG4gICAgICAgICAgICBpZiAoZWxlbWVudC52YWx1ZSAhPT0gbW9kZWxWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHByZXZpb3VzRWxlbWVudFZhbHVlID0gbW9kZWxWYWx1ZTsgIC8vIE1ha2Ugc3VyZSB3ZSBpZ25vcmUgZXZlbnRzIChwcm9wZXJ0eWNoYW5nZSkgdGhhdCByZXN1bHQgZnJvbSB1cGRhdGluZyB0aGUgdmFsdWVcbiAgICAgICAgICAgICAgICBlbGVtZW50LnZhbHVlID0gbW9kZWxWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgb25FdmVudCA9IGZ1bmN0aW9uIChldmVudCwgaGFuZGxlcikge1xuICAgICAgICAgICAga28udXRpbHMucmVnaXN0ZXJFdmVudEhhbmRsZXIoZWxlbWVudCwgZXZlbnQsIGhhbmRsZXIpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChERUJVRyAmJiBrby5iaW5kaW5nSGFuZGxlcnNbJ3RleHRJbnB1dCddWydfZm9yY2VVcGRhdGVPbiddKSB7XG4gICAgICAgICAgICAvLyBQcm92aWRlIGEgd2F5IGZvciB0ZXN0cyB0byBzcGVjaWZ5IGV4YWN0bHkgd2hpY2ggZXZlbnRzIGFyZSBib3VuZFxuICAgICAgICAgICAga28udXRpbHMuYXJyYXlGb3JFYWNoKGtvLmJpbmRpbmdIYW5kbGVyc1sndGV4dElucHV0J11bJ19mb3JjZVVwZGF0ZU9uJ10sIGZ1bmN0aW9uKGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgICAgIGlmIChldmVudE5hbWUuc2xpY2UoMCw1KSA9PSAnYWZ0ZXInKSB7XG4gICAgICAgICAgICAgICAgICAgIG9uRXZlbnQoZXZlbnROYW1lLnNsaWNlKDUpLCBkZWZlclVwZGF0ZU1vZGVsKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvbkV2ZW50KGV2ZW50TmFtZSwgdXBkYXRlTW9kZWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGtvLnV0aWxzLmllVmVyc2lvbiA8IDEwKSB7XG4gICAgICAgICAgICAgICAgLy8gSW50ZXJuZXQgRXhwbG9yZXIgPD0gOCBkb2Vzbid0IHN1cHBvcnQgdGhlICdpbnB1dCcgZXZlbnQsIGJ1dCBkb2VzIGluY2x1ZGUgJ3Byb3BlcnR5Y2hhbmdlJyB0aGF0IGZpcmVzIHdoZW5ldmVyXG4gICAgICAgICAgICAgICAgLy8gYW55IHByb3BlcnR5IG9mIGFuIGVsZW1lbnQgY2hhbmdlcy4gVW5saWtlICdpbnB1dCcsIGl0IGFsc28gZmlyZXMgaWYgYSBwcm9wZXJ0eSBpcyBjaGFuZ2VkIGZyb20gSmF2YVNjcmlwdCBjb2RlLFxuICAgICAgICAgICAgICAgIC8vIGJ1dCB0aGF0J3MgYW4gYWNjZXB0YWJsZSBjb21wcm9taXNlIGZvciB0aGlzIGJpbmRpbmcuIElFIDkgZG9lcyBzdXBwb3J0ICdpbnB1dCcsIGJ1dCBzaW5jZSBpdCBkb2Vzbid0IGZpcmUgaXRcbiAgICAgICAgICAgICAgICAvLyB3aGVuIHVzaW5nIGF1dG9jb21wbGV0ZSwgd2UnbGwgdXNlICdwcm9wZXJ0eWNoYW5nZScgZm9yIGl0IGFsc28uXG4gICAgICAgICAgICAgICAgb25FdmVudCgncHJvcGVydHljaGFuZ2UnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQucHJvcGVydHlOYW1lID09PSAndmFsdWUnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVNb2RlbChldmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmIChrby51dGlscy5pZVZlcnNpb24gPT0gOCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBJRSA4IGhhcyBhIGJ1ZyB3aGVyZSBpdCBmYWlscyB0byBmaXJlICdwcm9wZXJ0eWNoYW5nZScgb24gdGhlIGZpcnN0IHVwZGF0ZSBmb2xsb3dpbmcgYSB2YWx1ZSBjaGFuZ2UgZnJvbVxuICAgICAgICAgICAgICAgICAgICAvLyBKYXZhU2NyaXB0IGNvZGUuIEl0IGFsc28gZG9lc24ndCBmaXJlIGlmIHlvdSBjbGVhciB0aGUgZW50aXJlIHZhbHVlLiBUbyBmaXggdGhpcywgd2UgYmluZCB0byB0aGUgZm9sbG93aW5nXG4gICAgICAgICAgICAgICAgICAgIC8vIGV2ZW50cyB0b28uXG4gICAgICAgICAgICAgICAgICAgIG9uRXZlbnQoJ2tleXVwJywgdXBkYXRlTW9kZWwpOyAgICAgIC8vIEEgc2luZ2xlIGtleXN0b2tlXG4gICAgICAgICAgICAgICAgICAgIG9uRXZlbnQoJ2tleWRvd24nLCB1cGRhdGVNb2RlbCk7ICAgIC8vIFRoZSBmaXJzdCBjaGFyYWN0ZXIgd2hlbiBhIGtleSBpcyBoZWxkIGRvd25cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGtvLnV0aWxzLmllVmVyc2lvbiA+PSA4KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEludGVybmV0IEV4cGxvcmVyIDkgZG9lc24ndCBmaXJlIHRoZSAnaW5wdXQnIGV2ZW50IHdoZW4gZGVsZXRpbmcgdGV4dCwgaW5jbHVkaW5nIHVzaW5nXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBiYWNrc3BhY2UsIGRlbGV0ZSwgb3IgY3RybC14IGtleXMsIGNsaWNraW5nIHRoZSAneCcgdG8gY2xlYXIgdGhlIGlucHV0LCBkcmFnZ2luZyB0ZXh0XG4gICAgICAgICAgICAgICAgICAgIC8vIG91dCBvZiB0aGUgZmllbGQsIGFuZCBjdXR0aW5nIG9yIGRlbGV0aW5nIHRleHQgdXNpbmcgdGhlIGNvbnRleHQgbWVudS4gJ3NlbGVjdGlvbmNoYW5nZSdcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FuIGRldGVjdCBhbGwgb2YgdGhvc2UgZXhjZXB0IGRyYWdnaW5nIHRleHQgb3V0IG9mIHRoZSBmaWVsZCwgZm9yIHdoaWNoIHdlIHVzZSAnZHJhZ2VuZCcuXG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZXNlIGFyZSBhbHNvIG5lZWRlZCBpbiBJRTggYmVjYXVzZSBvZiB0aGUgYnVnIGRlc2NyaWJlZCBhYm92ZS5cbiAgICAgICAgICAgICAgICAgICAgcmVnaXN0ZXJGb3JTZWxlY3Rpb25DaGFuZ2VFdmVudChlbGVtZW50LCB1cGRhdGVNb2RlbCk7ICAvLyAnc2VsZWN0aW9uY2hhbmdlJyBjb3ZlcnMgY3V0LCBwYXN0ZSwgZHJvcCwgZGVsZXRlLCBldGMuXG4gICAgICAgICAgICAgICAgICAgIG9uRXZlbnQoJ2RyYWdlbmQnLCBkZWZlclVwZGF0ZU1vZGVsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIEFsbCBvdGhlciBzdXBwb3J0ZWQgYnJvd3NlcnMgc3VwcG9ydCB0aGUgJ2lucHV0JyBldmVudCwgd2hpY2ggZmlyZXMgd2hlbmV2ZXIgdGhlIGNvbnRlbnQgb2YgdGhlIGVsZW1lbnQgaXMgY2hhbmdlZFxuICAgICAgICAgICAgICAgIC8vIHRocm91Z2ggdGhlIHVzZXIgaW50ZXJmYWNlLlxuICAgICAgICAgICAgICAgIG9uRXZlbnQoJ2lucHV0JywgdXBkYXRlTW9kZWwpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHNhZmFyaVZlcnNpb24gPCA1ICYmIGtvLnV0aWxzLnRhZ05hbWVMb3dlcihlbGVtZW50KSA9PT0gXCJ0ZXh0YXJlYVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNhZmFyaSA8NSBkb2Vzbid0IGZpcmUgdGhlICdpbnB1dCcgZXZlbnQgZm9yIDx0ZXh0YXJlYT4gZWxlbWVudHMgKGl0IGRvZXMgZmlyZSAndGV4dElucHV0J1xuICAgICAgICAgICAgICAgICAgICAvLyBidXQgb25seSB3aGVuIHR5cGluZykuIFNvIHdlJ2xsIGp1c3QgY2F0Y2ggYXMgbXVjaCBhcyB3ZSBjYW4gd2l0aCBrZXlkb3duLCBjdXQsIGFuZCBwYXN0ZS5cbiAgICAgICAgICAgICAgICAgICAgb25FdmVudCgna2V5ZG93bicsIGRlZmVyVXBkYXRlTW9kZWwpO1xuICAgICAgICAgICAgICAgICAgICBvbkV2ZW50KCdwYXN0ZScsIGRlZmVyVXBkYXRlTW9kZWwpO1xuICAgICAgICAgICAgICAgICAgICBvbkV2ZW50KCdjdXQnLCBkZWZlclVwZGF0ZU1vZGVsKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9wZXJhVmVyc2lvbiA8IDExKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIE9wZXJhIDEwIGRvZXNuJ3QgYWx3YXlzIGZpcmUgdGhlICdpbnB1dCcgZXZlbnQgZm9yIGN1dCwgcGFzdGUsIHVuZG8gJiBkcm9wIG9wZXJhdGlvbnMuXG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIGNhbiB0cnkgdG8gY2F0Y2ggc29tZSBvZiB0aG9zZSB1c2luZyAna2V5ZG93bicuXG4gICAgICAgICAgICAgICAgICAgIG9uRXZlbnQoJ2tleWRvd24nLCBkZWZlclVwZGF0ZU1vZGVsKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZpcmVmb3hWZXJzaW9uIDwgNC4wKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEZpcmVmb3ggPD0gMy42IGRvZXNuJ3QgZmlyZSB0aGUgJ2lucHV0JyBldmVudCB3aGVuIHRleHQgaXMgZmlsbGVkIGluIHRocm91Z2ggYXV0b2NvbXBsZXRlXG4gICAgICAgICAgICAgICAgICAgIG9uRXZlbnQoJ0RPTUF1dG9Db21wbGV0ZScsIHVwZGF0ZU1vZGVsKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBGaXJlZm94IDw9My41IGRvZXNuJ3QgZmlyZSB0aGUgJ2lucHV0JyBldmVudCB3aGVuIHRleHQgaXMgZHJvcHBlZCBpbnRvIHRoZSBpbnB1dC5cbiAgICAgICAgICAgICAgICAgICAgb25FdmVudCgnZHJhZ2Ryb3AnLCB1cGRhdGVNb2RlbCk7ICAgICAgIC8vIDwzLjVcbiAgICAgICAgICAgICAgICAgICAgb25FdmVudCgnZHJvcCcsIHVwZGF0ZU1vZGVsKTsgICAgICAgICAgIC8vIDMuNVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJpbmQgdG8gdGhlIGNoYW5nZSBldmVudCBzbyB0aGF0IHdlIGNhbiBjYXRjaCBwcm9ncmFtbWF0aWMgdXBkYXRlcyBvZiB0aGUgdmFsdWUgdGhhdCBmaXJlIHRoaXMgZXZlbnQuXG4gICAgICAgIG9uRXZlbnQoJ2NoYW5nZScsIHVwZGF0ZU1vZGVsKTtcblxuICAgICAgICBrby5jb21wdXRlZCh1cGRhdGVWaWV3LCBudWxsLCB7IGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZDogZWxlbWVudCB9KTtcbiAgICB9XG59O1xua28uZXhwcmVzc2lvblJld3JpdGluZy50d29XYXlCaW5kaW5nc1sndGV4dElucHV0J10gPSB0cnVlO1xuXG4vLyB0ZXh0aW5wdXQgaXMgYW4gYWxpYXMgZm9yIHRleHRJbnB1dFxua28uYmluZGluZ0hhbmRsZXJzWyd0ZXh0aW5wdXQnXSA9IHtcbiAgICAvLyBwcmVwcm9jZXNzIGlzIHRoZSBvbmx5IHdheSB0byBzZXQgdXAgYSBmdWxsIGFsaWFzXG4gICAgJ3ByZXByb2Nlc3MnOiBmdW5jdGlvbiAodmFsdWUsIG5hbWUsIGFkZEJpbmRpbmcpIHtcbiAgICAgICAgYWRkQmluZGluZygndGV4dElucHV0JywgdmFsdWUpO1xuICAgIH1cbn07XG5cbn0pKCk7a28uYmluZGluZ0hhbmRsZXJzWyd1bmlxdWVOYW1lJ10gPSB7XG4gICAgJ2luaXQnOiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3Nvcikge1xuICAgICAgICBpZiAodmFsdWVBY2Nlc3NvcigpKSB7XG4gICAgICAgICAgICB2YXIgbmFtZSA9IFwia29fdW5pcXVlX1wiICsgKCsra28uYmluZGluZ0hhbmRsZXJzWyd1bmlxdWVOYW1lJ10uY3VycmVudEluZGV4KTtcbiAgICAgICAgICAgIGtvLnV0aWxzLnNldEVsZW1lbnROYW1lKGVsZW1lbnQsIG5hbWUpO1xuICAgICAgICB9XG4gICAgfVxufTtcbmtvLmJpbmRpbmdIYW5kbGVyc1sndW5pcXVlTmFtZSddLmN1cnJlbnRJbmRleCA9IDA7XG5rby5iaW5kaW5nSGFuZGxlcnNbJ3ZhbHVlJ10gPSB7XG4gICAgJ2FmdGVyJzogWydvcHRpb25zJywgJ2ZvcmVhY2gnXSxcbiAgICAnaW5pdCc6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5ncykge1xuICAgICAgICAvLyBJZiB0aGUgdmFsdWUgYmluZGluZyBpcyBwbGFjZWQgb24gYSByYWRpby9jaGVja2JveCwgdGhlbiBqdXN0IHBhc3MgdGhyb3VnaCB0byBjaGVja2VkVmFsdWUgYW5kIHF1aXRcbiAgICAgICAgaWYgKGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09IFwiaW5wdXRcIiAmJiAoZWxlbWVudC50eXBlID09IFwiY2hlY2tib3hcIiB8fCBlbGVtZW50LnR5cGUgPT0gXCJyYWRpb1wiKSkge1xuICAgICAgICAgICAga28uYXBwbHlCaW5kaW5nQWNjZXNzb3JzVG9Ob2RlKGVsZW1lbnQsIHsgJ2NoZWNrZWRWYWx1ZSc6IHZhbHVlQWNjZXNzb3IgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBbHdheXMgY2F0Y2ggXCJjaGFuZ2VcIiBldmVudDsgcG9zc2libHkgb3RoZXIgZXZlbnRzIHRvbyBpZiBhc2tlZFxuICAgICAgICB2YXIgZXZlbnRzVG9DYXRjaCA9IFtcImNoYW5nZVwiXTtcbiAgICAgICAgdmFyIHJlcXVlc3RlZEV2ZW50c1RvQ2F0Y2ggPSBhbGxCaW5kaW5ncy5nZXQoXCJ2YWx1ZVVwZGF0ZVwiKTtcbiAgICAgICAgdmFyIHByb3BlcnR5Q2hhbmdlZEZpcmVkID0gZmFsc2U7XG4gICAgICAgIHZhciBlbGVtZW50VmFsdWVCZWZvcmVFdmVudCA9IG51bGw7XG5cbiAgICAgICAgaWYgKHJlcXVlc3RlZEV2ZW50c1RvQ2F0Y2gpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdGVkRXZlbnRzVG9DYXRjaCA9PSBcInN0cmluZ1wiKSAvLyBBbGxvdyBib3RoIGluZGl2aWR1YWwgZXZlbnQgbmFtZXMsIGFuZCBhcnJheXMgb2YgZXZlbnQgbmFtZXNcbiAgICAgICAgICAgICAgICByZXF1ZXN0ZWRFdmVudHNUb0NhdGNoID0gW3JlcXVlc3RlZEV2ZW50c1RvQ2F0Y2hdO1xuICAgICAgICAgICAga28udXRpbHMuYXJyYXlQdXNoQWxsKGV2ZW50c1RvQ2F0Y2gsIHJlcXVlc3RlZEV2ZW50c1RvQ2F0Y2gpO1xuICAgICAgICAgICAgZXZlbnRzVG9DYXRjaCA9IGtvLnV0aWxzLmFycmF5R2V0RGlzdGluY3RWYWx1ZXMoZXZlbnRzVG9DYXRjaCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdmFsdWVVcGRhdGVIYW5kbGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBlbGVtZW50VmFsdWVCZWZvcmVFdmVudCA9IG51bGw7XG4gICAgICAgICAgICBwcm9wZXJ0eUNoYW5nZWRGaXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdmFyIG1vZGVsVmFsdWUgPSB2YWx1ZUFjY2Vzc29yKCk7XG4gICAgICAgICAgICB2YXIgZWxlbWVudFZhbHVlID0ga28uc2VsZWN0RXh0ZW5zaW9ucy5yZWFkVmFsdWUoZWxlbWVudCk7XG4gICAgICAgICAgICBrby5leHByZXNzaW9uUmV3cml0aW5nLndyaXRlVmFsdWVUb1Byb3BlcnR5KG1vZGVsVmFsdWUsIGFsbEJpbmRpbmdzLCAndmFsdWUnLCBlbGVtZW50VmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gV29ya2Fyb3VuZCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL1N0ZXZlU2FuZGVyc29uL2tub2Nrb3V0L2lzc3Vlcy8xMjJcbiAgICAgICAgLy8gSUUgZG9lc24ndCBmaXJlIFwiY2hhbmdlXCIgZXZlbnRzIG9uIHRleHRib3hlcyBpZiB0aGUgdXNlciBzZWxlY3RzIGEgdmFsdWUgZnJvbSBpdHMgYXV0b2NvbXBsZXRlIGxpc3RcbiAgICAgICAgdmFyIGllQXV0b0NvbXBsZXRlSGFja05lZWRlZCA9IGtvLnV0aWxzLmllVmVyc2lvbiAmJiBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PSBcImlucHV0XCIgJiYgZWxlbWVudC50eXBlID09IFwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBlbGVtZW50LmF1dG9jb21wbGV0ZSAhPSBcIm9mZlwiICYmICghZWxlbWVudC5mb3JtIHx8IGVsZW1lbnQuZm9ybS5hdXRvY29tcGxldGUgIT0gXCJvZmZcIik7XG4gICAgICAgIGlmIChpZUF1dG9Db21wbGV0ZUhhY2tOZWVkZWQgJiYga28udXRpbHMuYXJyYXlJbmRleE9mKGV2ZW50c1RvQ2F0Y2gsIFwicHJvcGVydHljaGFuZ2VcIikgPT0gLTEpIHtcbiAgICAgICAgICAgIGtvLnV0aWxzLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKGVsZW1lbnQsIFwicHJvcGVydHljaGFuZ2VcIiwgZnVuY3Rpb24gKCkgeyBwcm9wZXJ0eUNoYW5nZWRGaXJlZCA9IHRydWUgfSk7XG4gICAgICAgICAgICBrby51dGlscy5yZWdpc3RlckV2ZW50SGFuZGxlcihlbGVtZW50LCBcImZvY3VzXCIsIGZ1bmN0aW9uICgpIHsgcHJvcGVydHlDaGFuZ2VkRmlyZWQgPSBmYWxzZSB9KTtcbiAgICAgICAgICAgIGtvLnV0aWxzLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKGVsZW1lbnQsIFwiYmx1clwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlDaGFuZ2VkRmlyZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVVcGRhdGVIYW5kbGVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBrby51dGlscy5hcnJheUZvckVhY2goZXZlbnRzVG9DYXRjaCwgZnVuY3Rpb24oZXZlbnROYW1lKSB7XG4gICAgICAgICAgICAvLyBUaGUgc3ludGF4IFwiYWZ0ZXI8ZXZlbnRuYW1lPlwiIG1lYW5zIFwicnVuIHRoZSBoYW5kbGVyIGFzeW5jaHJvbm91c2x5IGFmdGVyIHRoZSBldmVudFwiXG4gICAgICAgICAgICAvLyBUaGlzIGlzIHVzZWZ1bCwgZm9yIGV4YW1wbGUsIHRvIGNhdGNoIFwia2V5ZG93blwiIGV2ZW50cyBhZnRlciB0aGUgYnJvd3NlciBoYXMgdXBkYXRlZCB0aGUgY29udHJvbFxuICAgICAgICAgICAgLy8gKG90aGVyd2lzZSwga28uc2VsZWN0RXh0ZW5zaW9ucy5yZWFkVmFsdWUodGhpcykgd2lsbCByZWNlaXZlIHRoZSBjb250cm9sJ3MgdmFsdWUgKmJlZm9yZSogdGhlIGtleSBldmVudClcbiAgICAgICAgICAgIHZhciBoYW5kbGVyID0gdmFsdWVVcGRhdGVIYW5kbGVyO1xuICAgICAgICAgICAgaWYgKGtvLnV0aWxzLnN0cmluZ1N0YXJ0c1dpdGgoZXZlbnROYW1lLCBcImFmdGVyXCIpKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGUgZWxlbWVudFZhbHVlQmVmb3JlRXZlbnQgdmFyaWFibGUgaXMgbm9uLW51bGwgKm9ubHkqIGR1cmluZyB0aGUgYnJpZWYgZ2FwIGJldHdlZW5cbiAgICAgICAgICAgICAgICAgICAgLy8gYSBrZXlYIGV2ZW50IGZpcmluZyBhbmQgdGhlIHZhbHVlVXBkYXRlSGFuZGxlciBydW5uaW5nLCB3aGljaCBpcyBzY2hlZHVsZWQgdG8gaGFwcGVuXG4gICAgICAgICAgICAgICAgICAgIC8vIGF0IHRoZSBlYXJsaWVzdCBhc3luY2hyb25vdXMgb3Bwb3J0dW5pdHkuIFdlIHN0b3JlIHRoaXMgdGVtcG9yYXJ5IGluZm9ybWF0aW9uIHNvIHRoYXRcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYsIGJldHdlZW4ga2V5WCBhbmQgdmFsdWVVcGRhdGVIYW5kbGVyLCB0aGUgdW5kZXJseWluZyBtb2RlbCB2YWx1ZSBjaGFuZ2VzIHNlcGFyYXRlbHksXG4gICAgICAgICAgICAgICAgICAgIC8vIHdlIGNhbiBvdmVyd3JpdGUgdGhhdCBtb2RlbCB2YWx1ZSBjaGFuZ2Ugd2l0aCB0aGUgdmFsdWUgdGhlIHVzZXIganVzdCB0eXBlZC4gT3RoZXJ3aXNlLFxuICAgICAgICAgICAgICAgICAgICAvLyB0ZWNobmlxdWVzIGxpa2UgcmF0ZUxpbWl0IGNhbiB0cmlnZ2VyIG1vZGVsIGNoYW5nZXMgYXQgY3JpdGljYWwgbW9tZW50cyB0aGF0IHdpbGxcbiAgICAgICAgICAgICAgICAgICAgLy8gb3ZlcnJpZGUgdGhlIHVzZXIncyBpbnB1dHMsIGNhdXNpbmcga2V5c3Ryb2tlcyB0byBiZSBsb3N0LlxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50VmFsdWVCZWZvcmVFdmVudCA9IGtvLnNlbGVjdEV4dGVuc2lvbnMucmVhZFZhbHVlKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHZhbHVlVXBkYXRlSGFuZGxlciwgMCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBldmVudE5hbWUgPSBldmVudE5hbWUuc3Vic3RyaW5nKFwiYWZ0ZXJcIi5sZW5ndGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAga28udXRpbHMucmVnaXN0ZXJFdmVudEhhbmRsZXIoZWxlbWVudCwgZXZlbnROYW1lLCBoYW5kbGVyKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIHVwZGF0ZUZyb21Nb2RlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBuZXdWYWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpKTtcbiAgICAgICAgICAgIHZhciBlbGVtZW50VmFsdWUgPSBrby5zZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZShlbGVtZW50KTtcblxuICAgICAgICAgICAgaWYgKGVsZW1lbnRWYWx1ZUJlZm9yZUV2ZW50ICE9PSBudWxsICYmIG5ld1ZhbHVlID09PSBlbGVtZW50VmFsdWVCZWZvcmVFdmVudCkge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQodXBkYXRlRnJvbU1vZGVsLCAwKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB2YWx1ZUhhc0NoYW5nZWQgPSAobmV3VmFsdWUgIT09IGVsZW1lbnRWYWx1ZSk7XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZUhhc0NoYW5nZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoa28udXRpbHMudGFnTmFtZUxvd2VyKGVsZW1lbnQpID09PSBcInNlbGVjdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhbGxvd1Vuc2V0ID0gYWxsQmluZGluZ3MuZ2V0KCd2YWx1ZUFsbG93VW5zZXQnKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFwcGx5VmFsdWVBY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrby5zZWxlY3RFeHRlbnNpb25zLndyaXRlVmFsdWUoZWxlbWVudCwgbmV3VmFsdWUsIGFsbG93VW5zZXQpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBhcHBseVZhbHVlQWN0aW9uKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhbGxvd1Vuc2V0ICYmIG5ld1ZhbHVlICE9PSBrby5zZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZShlbGVtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgeW91IHRyeSB0byBzZXQgYSBtb2RlbCB2YWx1ZSB0aGF0IGNhbid0IGJlIHJlcHJlc2VudGVkIGluIGFuIGFscmVhZHktcG9wdWxhdGVkIGRyb3Bkb3duLCByZWplY3QgdGhhdCBjaGFuZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBiZWNhdXNlIHlvdSdyZSBub3QgYWxsb3dlZCB0byBoYXZlIGEgbW9kZWwgdmFsdWUgdGhhdCBkaXNhZ3JlZXMgd2l0aCBhIHZpc2libGUgVUkgc2VsZWN0aW9uLlxuICAgICAgICAgICAgICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5pZ25vcmUoa28udXRpbHMudHJpZ2dlckV2ZW50LCBudWxsLCBbZWxlbWVudCwgXCJjaGFuZ2VcIl0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV29ya2Fyb3VuZCBmb3IgSUU2IGJ1ZzogSXQgd29uJ3QgcmVsaWFibHkgYXBwbHkgdmFsdWVzIHRvIFNFTEVDVCBub2RlcyBkdXJpbmcgdGhlIHNhbWUgZXhlY3V0aW9uIHRocmVhZFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmlnaHQgYWZ0ZXIgeW91J3ZlIGNoYW5nZWQgdGhlIHNldCBvZiBPUFRJT04gbm9kZXMgb24gaXQuIFNvIGZvciB0aGF0IG5vZGUgdHlwZSwgd2UnbGwgc2NoZWR1bGUgYSBzZWNvbmQgdGhyZWFkXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0byBhcHBseSB0aGUgdmFsdWUgYXMgd2VsbC5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoYXBwbHlWYWx1ZUFjdGlvbiwgMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBrby5zZWxlY3RFeHRlbnNpb25zLndyaXRlVmFsdWUoZWxlbWVudCwgbmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBrby5jb21wdXRlZCh1cGRhdGVGcm9tTW9kZWwsIG51bGwsIHsgZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkOiBlbGVtZW50IH0pO1xuICAgIH0sXG4gICAgJ3VwZGF0ZSc6IGZ1bmN0aW9uKCkge30gLy8gS2VlcCBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkgd2l0aCBjb2RlIHRoYXQgbWF5IGhhdmUgd3JhcHBlZCB2YWx1ZSBiaW5kaW5nXG59O1xua28uZXhwcmVzc2lvblJld3JpdGluZy50d29XYXlCaW5kaW5nc1sndmFsdWUnXSA9IHRydWU7XG5rby5iaW5kaW5nSGFuZGxlcnNbJ3Zpc2libGUnXSA9IHtcbiAgICAndXBkYXRlJzogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IpIHtcbiAgICAgICAgdmFyIHZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZUFjY2Vzc29yKCkpO1xuICAgICAgICB2YXIgaXNDdXJyZW50bHlWaXNpYmxlID0gIShlbGVtZW50LnN0eWxlLmRpc3BsYXkgPT0gXCJub25lXCIpO1xuICAgICAgICBpZiAodmFsdWUgJiYgIWlzQ3VycmVudGx5VmlzaWJsZSlcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwiXCI7XG4gICAgICAgIGVsc2UgaWYgKCghdmFsdWUpICYmIGlzQ3VycmVudGx5VmlzaWJsZSlcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH1cbn07XG4vLyAnY2xpY2snIGlzIGp1c3QgYSBzaG9ydGhhbmQgZm9yIHRoZSB1c3VhbCBmdWxsLWxlbmd0aCBldmVudDp7Y2xpY2s6aGFuZGxlcn1cbm1ha2VFdmVudEhhbmRsZXJTaG9ydGN1dCgnY2xpY2snKTtcbi8vIElmIHlvdSB3YW50IHRvIG1ha2UgYSBjdXN0b20gdGVtcGxhdGUgZW5naW5lLFxuLy9cbi8vIFsxXSBJbmhlcml0IGZyb20gdGhpcyBjbGFzcyAobGlrZSBrby5uYXRpdmVUZW1wbGF0ZUVuZ2luZSBkb2VzKVxuLy8gWzJdIE92ZXJyaWRlICdyZW5kZXJUZW1wbGF0ZVNvdXJjZScsIHN1cHBseWluZyBhIGZ1bmN0aW9uIHdpdGggdGhpcyBzaWduYXR1cmU6XG4vL1xuLy8gICAgICAgIGZ1bmN0aW9uICh0ZW1wbGF0ZVNvdXJjZSwgYmluZGluZ0NvbnRleHQsIG9wdGlvbnMpIHtcbi8vICAgICAgICAgICAgLy8gLSB0ZW1wbGF0ZVNvdXJjZS50ZXh0KCkgaXMgdGhlIHRleHQgb2YgdGhlIHRlbXBsYXRlIHlvdSBzaG91bGQgcmVuZGVyXG4vLyAgICAgICAgICAgIC8vIC0gYmluZGluZ0NvbnRleHQuJGRhdGEgaXMgdGhlIGRhdGEgeW91IHNob3VsZCBwYXNzIGludG8gdGhlIHRlbXBsYXRlXG4vLyAgICAgICAgICAgIC8vICAgLSB5b3UgbWlnaHQgYWxzbyB3YW50IHRvIG1ha2UgYmluZGluZ0NvbnRleHQuJHBhcmVudCwgYmluZGluZ0NvbnRleHQuJHBhcmVudHMsXG4vLyAgICAgICAgICAgIC8vICAgICBhbmQgYmluZGluZ0NvbnRleHQuJHJvb3QgYXZhaWxhYmxlIGluIHRoZSB0ZW1wbGF0ZSB0b29cbi8vICAgICAgICAgICAgLy8gLSBvcHRpb25zIGdpdmVzIHlvdSBhY2Nlc3MgdG8gYW55IG90aGVyIHByb3BlcnRpZXMgc2V0IG9uIFwiZGF0YS1iaW5kOiB7IHRlbXBsYXRlOiBvcHRpb25zIH1cIlxuLy8gICAgICAgICAgICAvL1xuLy8gICAgICAgICAgICAvLyBSZXR1cm4gdmFsdWU6IGFuIGFycmF5IG9mIERPTSBub2Rlc1xuLy8gICAgICAgIH1cbi8vXG4vLyBbM10gT3ZlcnJpZGUgJ2NyZWF0ZUphdmFTY3JpcHRFdmFsdWF0b3JCbG9jaycsIHN1cHBseWluZyBhIGZ1bmN0aW9uIHdpdGggdGhpcyBzaWduYXR1cmU6XG4vL1xuLy8gICAgICAgIGZ1bmN0aW9uIChzY3JpcHQpIHtcbi8vICAgICAgICAgICAgLy8gUmV0dXJuIHZhbHVlOiBXaGF0ZXZlciBzeW50YXggbWVhbnMgXCJFdmFsdWF0ZSB0aGUgSmF2YVNjcmlwdCBzdGF0ZW1lbnQgJ3NjcmlwdCcgYW5kIG91dHB1dCB0aGUgcmVzdWx0XCJcbi8vICAgICAgICAgICAgLy8gICAgICAgICAgICAgICBGb3IgZXhhbXBsZSwgdGhlIGpxdWVyeS50bXBsIHRlbXBsYXRlIGVuZ2luZSBjb252ZXJ0cyAnc29tZVNjcmlwdCcgdG8gJyR7IHNvbWVTY3JpcHQgfSdcbi8vICAgICAgICB9XG4vL1xuLy8gICAgIFRoaXMgaXMgb25seSBuZWNlc3NhcnkgaWYgeW91IHdhbnQgdG8gYWxsb3cgZGF0YS1iaW5kIGF0dHJpYnV0ZXMgdG8gcmVmZXJlbmNlIGFyYml0cmFyeSB0ZW1wbGF0ZSB2YXJpYWJsZXMuXG4vLyAgICAgSWYgeW91IGRvbid0IHdhbnQgdG8gYWxsb3cgdGhhdCwgeW91IGNhbiBzZXQgdGhlIHByb3BlcnR5ICdhbGxvd1RlbXBsYXRlUmV3cml0aW5nJyB0byBmYWxzZSAobGlrZSBrby5uYXRpdmVUZW1wbGF0ZUVuZ2luZSBkb2VzKVxuLy8gICAgIGFuZCB0aGVuIHlvdSBkb24ndCBuZWVkIHRvIG92ZXJyaWRlICdjcmVhdGVKYXZhU2NyaXB0RXZhbHVhdG9yQmxvY2snLlxuXG5rby50ZW1wbGF0ZUVuZ2luZSA9IGZ1bmN0aW9uICgpIHsgfTtcblxua28udGVtcGxhdGVFbmdpbmUucHJvdG90eXBlWydyZW5kZXJUZW1wbGF0ZVNvdXJjZSddID0gZnVuY3Rpb24gKHRlbXBsYXRlU291cmNlLCBiaW5kaW5nQ29udGV4dCwgb3B0aW9ucykge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk92ZXJyaWRlIHJlbmRlclRlbXBsYXRlU291cmNlXCIpO1xufTtcblxua28udGVtcGxhdGVFbmdpbmUucHJvdG90eXBlWydjcmVhdGVKYXZhU2NyaXB0RXZhbHVhdG9yQmxvY2snXSA9IGZ1bmN0aW9uIChzY3JpcHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJPdmVycmlkZSBjcmVhdGVKYXZhU2NyaXB0RXZhbHVhdG9yQmxvY2tcIik7XG59O1xuXG5rby50ZW1wbGF0ZUVuZ2luZS5wcm90b3R5cGVbJ21ha2VUZW1wbGF0ZVNvdXJjZSddID0gZnVuY3Rpb24odGVtcGxhdGUsIHRlbXBsYXRlRG9jdW1lbnQpIHtcbiAgICAvLyBOYW1lZCB0ZW1wbGF0ZVxuICAgIGlmICh0eXBlb2YgdGVtcGxhdGUgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0ZW1wbGF0ZURvY3VtZW50ID0gdGVtcGxhdGVEb2N1bWVudCB8fCBkb2N1bWVudDtcbiAgICAgICAgdmFyIGVsZW0gPSB0ZW1wbGF0ZURvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRlbXBsYXRlKTtcbiAgICAgICAgaWYgKCFlbGVtKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgdGVtcGxhdGUgd2l0aCBJRCBcIiArIHRlbXBsYXRlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBrby50ZW1wbGF0ZVNvdXJjZXMuZG9tRWxlbWVudChlbGVtKTtcbiAgICB9IGVsc2UgaWYgKCh0ZW1wbGF0ZS5ub2RlVHlwZSA9PSAxKSB8fCAodGVtcGxhdGUubm9kZVR5cGUgPT0gOCkpIHtcbiAgICAgICAgLy8gQW5vbnltb3VzIHRlbXBsYXRlXG4gICAgICAgIHJldHVybiBuZXcga28udGVtcGxhdGVTb3VyY2VzLmFub255bW91c1RlbXBsYXRlKHRlbXBsYXRlKTtcbiAgICB9IGVsc2VcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biB0ZW1wbGF0ZSB0eXBlOiBcIiArIHRlbXBsYXRlKTtcbn07XG5cbmtvLnRlbXBsYXRlRW5naW5lLnByb3RvdHlwZVsncmVuZGVyVGVtcGxhdGUnXSA9IGZ1bmN0aW9uICh0ZW1wbGF0ZSwgYmluZGluZ0NvbnRleHQsIG9wdGlvbnMsIHRlbXBsYXRlRG9jdW1lbnQpIHtcbiAgICB2YXIgdGVtcGxhdGVTb3VyY2UgPSB0aGlzWydtYWtlVGVtcGxhdGVTb3VyY2UnXSh0ZW1wbGF0ZSwgdGVtcGxhdGVEb2N1bWVudCk7XG4gICAgcmV0dXJuIHRoaXNbJ3JlbmRlclRlbXBsYXRlU291cmNlJ10odGVtcGxhdGVTb3VyY2UsIGJpbmRpbmdDb250ZXh0LCBvcHRpb25zKTtcbn07XG5cbmtvLnRlbXBsYXRlRW5naW5lLnByb3RvdHlwZVsnaXNUZW1wbGF0ZVJld3JpdHRlbiddID0gZnVuY3Rpb24gKHRlbXBsYXRlLCB0ZW1wbGF0ZURvY3VtZW50KSB7XG4gICAgLy8gU2tpcCByZXdyaXRpbmcgaWYgcmVxdWVzdGVkXG4gICAgaWYgKHRoaXNbJ2FsbG93VGVtcGxhdGVSZXdyaXRpbmcnXSA9PT0gZmFsc2UpXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIHJldHVybiB0aGlzWydtYWtlVGVtcGxhdGVTb3VyY2UnXSh0ZW1wbGF0ZSwgdGVtcGxhdGVEb2N1bWVudClbJ2RhdGEnXShcImlzUmV3cml0dGVuXCIpO1xufTtcblxua28udGVtcGxhdGVFbmdpbmUucHJvdG90eXBlWydyZXdyaXRlVGVtcGxhdGUnXSA9IGZ1bmN0aW9uICh0ZW1wbGF0ZSwgcmV3cml0ZXJDYWxsYmFjaywgdGVtcGxhdGVEb2N1bWVudCkge1xuICAgIHZhciB0ZW1wbGF0ZVNvdXJjZSA9IHRoaXNbJ21ha2VUZW1wbGF0ZVNvdXJjZSddKHRlbXBsYXRlLCB0ZW1wbGF0ZURvY3VtZW50KTtcbiAgICB2YXIgcmV3cml0dGVuID0gcmV3cml0ZXJDYWxsYmFjayh0ZW1wbGF0ZVNvdXJjZVsndGV4dCddKCkpO1xuICAgIHRlbXBsYXRlU291cmNlWyd0ZXh0J10ocmV3cml0dGVuKTtcbiAgICB0ZW1wbGF0ZVNvdXJjZVsnZGF0YSddKFwiaXNSZXdyaXR0ZW5cIiwgdHJ1ZSk7XG59O1xuXG5rby5leHBvcnRTeW1ib2woJ3RlbXBsYXRlRW5naW5lJywga28udGVtcGxhdGVFbmdpbmUpO1xuXG5rby50ZW1wbGF0ZVJld3JpdGluZyA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1lbW9pemVEYXRhQmluZGluZ0F0dHJpYnV0ZVN5bnRheFJlZ2V4ID0gLyg8KFthLXpdK1xcZCopKD86XFxzKyg/IWRhdGEtYmluZFxccyo9XFxzKilbYS16MC05XFwtXSsoPzo9KD86XFxcIlteXFxcIl0qXFxcInxcXCdbXlxcJ10qXFwnKSk/KSpcXHMrKWRhdGEtYmluZFxccyo9XFxzKihbXCInXSkoW1xcc1xcU10qPylcXDMvZ2k7XG4gICAgdmFyIG1lbW9pemVWaXJ0dWFsQ29udGFpbmVyQmluZGluZ1N5bnRheFJlZ2V4ID0gLzwhLS1cXHMqa29cXGJcXHMqKFtcXHNcXFNdKj8pXFxzKi0tPi9nO1xuXG4gICAgZnVuY3Rpb24gdmFsaWRhdGVEYXRhQmluZFZhbHVlc0ZvclJld3JpdGluZyhrZXlWYWx1ZUFycmF5KSB7XG4gICAgICAgIHZhciBhbGxWYWxpZGF0b3JzID0ga28uZXhwcmVzc2lvblJld3JpdGluZy5iaW5kaW5nUmV3cml0ZVZhbGlkYXRvcnM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5VmFsdWVBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGtleSA9IGtleVZhbHVlQXJyYXlbaV1bJ2tleSddO1xuICAgICAgICAgICAgaWYgKGFsbFZhbGlkYXRvcnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIHZhciB2YWxpZGF0b3IgPSBhbGxWYWxpZGF0b3JzW2tleV07XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbGlkYXRvciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwb3NzaWJsZUVycm9yTWVzc2FnZSA9IHZhbGlkYXRvcihrZXlWYWx1ZUFycmF5W2ldWyd2YWx1ZSddKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvc3NpYmxlRXJyb3JNZXNzYWdlKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHBvc3NpYmxlRXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCF2YWxpZGF0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhpcyB0ZW1wbGF0ZSBlbmdpbmUgZG9lcyBub3Qgc3VwcG9ydCB0aGUgJ1wiICsga2V5ICsgXCInIGJpbmRpbmcgd2l0aGluIGl0cyB0ZW1wbGF0ZXNcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29uc3RydWN0TWVtb2l6ZWRUYWdSZXBsYWNlbWVudChkYXRhQmluZEF0dHJpYnV0ZVZhbHVlLCB0YWdUb1JldGFpbiwgbm9kZU5hbWUsIHRlbXBsYXRlRW5naW5lKSB7XG4gICAgICAgIHZhciBkYXRhQmluZEtleVZhbHVlQXJyYXkgPSBrby5leHByZXNzaW9uUmV3cml0aW5nLnBhcnNlT2JqZWN0TGl0ZXJhbChkYXRhQmluZEF0dHJpYnV0ZVZhbHVlKTtcbiAgICAgICAgdmFsaWRhdGVEYXRhQmluZFZhbHVlc0ZvclJld3JpdGluZyhkYXRhQmluZEtleVZhbHVlQXJyYXkpO1xuICAgICAgICB2YXIgcmV3cml0dGVuRGF0YUJpbmRBdHRyaWJ1dGVWYWx1ZSA9IGtvLmV4cHJlc3Npb25SZXdyaXRpbmcucHJlUHJvY2Vzc0JpbmRpbmdzKGRhdGFCaW5kS2V5VmFsdWVBcnJheSwgeyd2YWx1ZUFjY2Vzc29ycyc6dHJ1ZX0pO1xuXG4gICAgICAgIC8vIEZvciBubyBvYnZpb3VzIHJlYXNvbiwgT3BlcmEgZmFpbHMgdG8gZXZhbHVhdGUgcmV3cml0dGVuRGF0YUJpbmRBdHRyaWJ1dGVWYWx1ZSB1bmxlc3MgaXQncyB3cmFwcGVkIGluIGFuIGFkZGl0aW9uYWxcbiAgICAgICAgLy8gYW5vbnltb3VzIGZ1bmN0aW9uLCBldmVuIHRob3VnaCBPcGVyYSdzIGJ1aWx0LWluIGRlYnVnZ2VyIGNhbiBldmFsdWF0ZSBpdCBhbnl3YXkuIE5vIG90aGVyIGJyb3dzZXIgcmVxdWlyZXMgdGhpc1xuICAgICAgICAvLyBleHRyYSBpbmRpcmVjdGlvbi5cbiAgICAgICAgdmFyIGFwcGx5QmluZGluZ3NUb05leHRTaWJsaW5nU2NyaXB0ID1cbiAgICAgICAgICAgIFwia28uX190cl9hbWJ0bnMoZnVuY3Rpb24oJGNvbnRleHQsJGVsZW1lbnQpe3JldHVybihmdW5jdGlvbigpe3JldHVybnsgXCIgKyByZXdyaXR0ZW5EYXRhQmluZEF0dHJpYnV0ZVZhbHVlICsgXCIgfSB9KSgpfSwnXCIgKyBub2RlTmFtZS50b0xvd2VyQ2FzZSgpICsgXCInKVwiO1xuICAgICAgICByZXR1cm4gdGVtcGxhdGVFbmdpbmVbJ2NyZWF0ZUphdmFTY3JpcHRFdmFsdWF0b3JCbG9jayddKGFwcGx5QmluZGluZ3NUb05leHRTaWJsaW5nU2NyaXB0KSArIHRhZ1RvUmV0YWluO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGVuc3VyZVRlbXBsYXRlSXNSZXdyaXR0ZW46IGZ1bmN0aW9uICh0ZW1wbGF0ZSwgdGVtcGxhdGVFbmdpbmUsIHRlbXBsYXRlRG9jdW1lbnQpIHtcbiAgICAgICAgICAgIGlmICghdGVtcGxhdGVFbmdpbmVbJ2lzVGVtcGxhdGVSZXdyaXR0ZW4nXSh0ZW1wbGF0ZSwgdGVtcGxhdGVEb2N1bWVudCkpXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVFbmdpbmVbJ3Jld3JpdGVUZW1wbGF0ZSddKHRlbXBsYXRlLCBmdW5jdGlvbiAoaHRtbFN0cmluZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga28udGVtcGxhdGVSZXdyaXRpbmcubWVtb2l6ZUJpbmRpbmdBdHRyaWJ1dGVTeW50YXgoaHRtbFN0cmluZywgdGVtcGxhdGVFbmdpbmUpO1xuICAgICAgICAgICAgICAgIH0sIHRlbXBsYXRlRG9jdW1lbnQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIG1lbW9pemVCaW5kaW5nQXR0cmlidXRlU3ludGF4OiBmdW5jdGlvbiAoaHRtbFN0cmluZywgdGVtcGxhdGVFbmdpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiBodG1sU3RyaW5nLnJlcGxhY2UobWVtb2l6ZURhdGFCaW5kaW5nQXR0cmlidXRlU3ludGF4UmVnZXgsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uc3RydWN0TWVtb2l6ZWRUYWdSZXBsYWNlbWVudCgvKiBkYXRhQmluZEF0dHJpYnV0ZVZhbHVlOiAqLyBhcmd1bWVudHNbNF0sIC8qIHRhZ1RvUmV0YWluOiAqLyBhcmd1bWVudHNbMV0sIC8qIG5vZGVOYW1lOiAqLyBhcmd1bWVudHNbMl0sIHRlbXBsYXRlRW5naW5lKTtcbiAgICAgICAgICAgIH0pLnJlcGxhY2UobWVtb2l6ZVZpcnR1YWxDb250YWluZXJCaW5kaW5nU3ludGF4UmVnZXgsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb25zdHJ1Y3RNZW1vaXplZFRhZ1JlcGxhY2VtZW50KC8qIGRhdGFCaW5kQXR0cmlidXRlVmFsdWU6ICovIGFyZ3VtZW50c1sxXSwgLyogdGFnVG9SZXRhaW46ICovIFwiPCEtLSBrbyAtLT5cIiwgLyogbm9kZU5hbWU6ICovIFwiI2NvbW1lbnRcIiwgdGVtcGxhdGVFbmdpbmUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYXBwbHlNZW1vaXplZEJpbmRpbmdzVG9OZXh0U2libGluZzogZnVuY3Rpb24gKGJpbmRpbmdzLCBub2RlTmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIGtvLm1lbW9pemF0aW9uLm1lbW9pemUoZnVuY3Rpb24gKGRvbU5vZGUsIGJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgdmFyIG5vZGVUb0JpbmQgPSBkb21Ob2RlLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIGlmIChub2RlVG9CaW5kICYmIG5vZGVUb0JpbmQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gbm9kZU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAga28uYXBwbHlCaW5kaW5nQWNjZXNzb3JzVG9Ob2RlKG5vZGVUb0JpbmQsIGJpbmRpbmdzLCBiaW5kaW5nQ29udGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59KSgpO1xuXG5cbi8vIEV4cG9ydGVkIG9ubHkgYmVjYXVzZSBpdCBoYXMgdG8gYmUgcmVmZXJlbmNlZCBieSBzdHJpbmcgbG9va3VwIGZyb20gd2l0aGluIHJld3JpdHRlbiB0ZW1wbGF0ZVxua28uZXhwb3J0U3ltYm9sKCdfX3RyX2FtYnRucycsIGtvLnRlbXBsYXRlUmV3cml0aW5nLmFwcGx5TWVtb2l6ZWRCaW5kaW5nc1RvTmV4dFNpYmxpbmcpO1xuKGZ1bmN0aW9uKCkge1xuICAgIC8vIEEgdGVtcGxhdGUgc291cmNlIHJlcHJlc2VudHMgYSByZWFkL3dyaXRlIHdheSBvZiBhY2Nlc3NpbmcgYSB0ZW1wbGF0ZS4gVGhpcyBpcyB0byBlbGltaW5hdGUgdGhlIG5lZWQgZm9yIHRlbXBsYXRlIGxvYWRpbmcvc2F2aW5nXG4gICAgLy8gbG9naWMgdG8gYmUgZHVwbGljYXRlZCBpbiBldmVyeSB0ZW1wbGF0ZSBlbmdpbmUgKGFuZCBtZWFucyB0aGV5IGNhbiBhbGwgd29yayB3aXRoIGFub255bW91cyB0ZW1wbGF0ZXMsIGV0Yy4pXG4gICAgLy9cbiAgICAvLyBUd28gYXJlIHByb3ZpZGVkIGJ5IGRlZmF1bHQ6XG4gICAgLy8gIDEuIGtvLnRlbXBsYXRlU291cmNlcy5kb21FbGVtZW50ICAgICAgIC0gcmVhZHMvd3JpdGVzIHRoZSB0ZXh0IGNvbnRlbnQgb2YgYW4gYXJiaXRyYXJ5IERPTSBlbGVtZW50XG4gICAgLy8gIDIuIGtvLnRlbXBsYXRlU291cmNlcy5hbm9ueW1vdXNFbGVtZW50IC0gdXNlcyBrby51dGlscy5kb21EYXRhIHRvIHJlYWQvd3JpdGUgdGV4dCAqYXNzb2NpYXRlZCogd2l0aCB0aGUgRE9NIGVsZW1lbnQsIGJ1dFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpdGhvdXQgcmVhZGluZy93cml0aW5nIHRoZSBhY3R1YWwgZWxlbWVudCB0ZXh0IGNvbnRlbnQsIHNpbmNlIGl0IHdpbGwgYmUgb3ZlcndyaXR0ZW5cbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXRoIHRoZSByZW5kZXJlZCB0ZW1wbGF0ZSBvdXRwdXQuXG4gICAgLy8gWW91IGNhbiBpbXBsZW1lbnQgeW91ciBvd24gdGVtcGxhdGUgc291cmNlIGlmIHlvdSB3YW50IHRvIGZldGNoL3N0b3JlIHRlbXBsYXRlcyBzb21ld2hlcmUgb3RoZXIgdGhhbiBpbiBET00gZWxlbWVudHMuXG4gICAgLy8gVGVtcGxhdGUgc291cmNlcyBuZWVkIHRvIGhhdmUgdGhlIGZvbGxvd2luZyBmdW5jdGlvbnM6XG4gICAgLy8gICB0ZXh0KCkgXHRcdFx0LSByZXR1cm5zIHRoZSB0ZW1wbGF0ZSB0ZXh0IGZyb20geW91ciBzdG9yYWdlIGxvY2F0aW9uXG4gICAgLy8gICB0ZXh0KHZhbHVlKVx0XHQtIHdyaXRlcyB0aGUgc3VwcGxpZWQgdGVtcGxhdGUgdGV4dCB0byB5b3VyIHN0b3JhZ2UgbG9jYXRpb25cbiAgICAvLyAgIGRhdGEoa2V5KVx0XHRcdC0gcmVhZHMgdmFsdWVzIHN0b3JlZCB1c2luZyBkYXRhKGtleSwgdmFsdWUpIC0gc2VlIGJlbG93XG4gICAgLy8gICBkYXRhKGtleSwgdmFsdWUpXHQtIGFzc29jaWF0ZXMgXCJ2YWx1ZVwiIHdpdGggdGhpcyB0ZW1wbGF0ZSBhbmQgdGhlIGtleSBcImtleVwiLiBJcyB1c2VkIHRvIHN0b3JlIGluZm9ybWF0aW9uIGxpa2UgXCJpc1Jld3JpdHRlblwiLlxuICAgIC8vXG4gICAgLy8gT3B0aW9uYWxseSwgdGVtcGxhdGUgc291cmNlcyBjYW4gYWxzbyBoYXZlIHRoZSBmb2xsb3dpbmcgZnVuY3Rpb25zOlxuICAgIC8vICAgbm9kZXMoKSAgICAgICAgICAgIC0gcmV0dXJucyBhIERPTSBlbGVtZW50IGNvbnRhaW5pbmcgdGhlIG5vZGVzIG9mIHRoaXMgdGVtcGxhdGUsIHdoZXJlIGF2YWlsYWJsZVxuICAgIC8vICAgbm9kZXModmFsdWUpICAgICAgIC0gd3JpdGVzIHRoZSBnaXZlbiBET00gZWxlbWVudCB0byB5b3VyIHN0b3JhZ2UgbG9jYXRpb25cbiAgICAvLyBJZiBhIERPTSBlbGVtZW50IGlzIGF2YWlsYWJsZSBmb3IgYSBnaXZlbiB0ZW1wbGF0ZSBzb3VyY2UsIHRlbXBsYXRlIGVuZ2luZXMgYXJlIGVuY291cmFnZWQgdG8gdXNlIGl0IGluIHByZWZlcmVuY2Ugb3ZlciB0ZXh0KClcbiAgICAvLyBmb3IgaW1wcm92ZWQgc3BlZWQuIEhvd2V2ZXIsIGFsbCB0ZW1wbGF0ZVNvdXJjZXMgbXVzdCBzdXBwbHkgdGV4dCgpIGV2ZW4gaWYgdGhleSBkb24ndCBzdXBwbHkgbm9kZXMoKS5cbiAgICAvL1xuICAgIC8vIE9uY2UgeW91J3ZlIGltcGxlbWVudGVkIGEgdGVtcGxhdGVTb3VyY2UsIG1ha2UgeW91ciB0ZW1wbGF0ZSBlbmdpbmUgdXNlIGl0IGJ5IHN1YmNsYXNzaW5nIHdoYXRldmVyIHRlbXBsYXRlIGVuZ2luZSB5b3Ugd2VyZVxuICAgIC8vIHVzaW5nIGFuZCBvdmVycmlkaW5nIFwibWFrZVRlbXBsYXRlU291cmNlXCIgdG8gcmV0dXJuIGFuIGluc3RhbmNlIG9mIHlvdXIgY3VzdG9tIHRlbXBsYXRlIHNvdXJjZS5cblxuICAgIGtvLnRlbXBsYXRlU291cmNlcyA9IHt9O1xuXG4gICAgLy8gLS0tLSBrby50ZW1wbGF0ZVNvdXJjZXMuZG9tRWxlbWVudCAtLS0tLVxuXG4gICAga28udGVtcGxhdGVTb3VyY2VzLmRvbUVsZW1lbnQgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIHRoaXMuZG9tRWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgfVxuXG4gICAga28udGVtcGxhdGVTb3VyY2VzLmRvbUVsZW1lbnQucHJvdG90eXBlWyd0ZXh0J10gPSBmdW5jdGlvbigvKiB2YWx1ZVRvV3JpdGUgKi8pIHtcbiAgICAgICAgdmFyIHRhZ05hbWVMb3dlciA9IGtvLnV0aWxzLnRhZ05hbWVMb3dlcih0aGlzLmRvbUVsZW1lbnQpLFxuICAgICAgICAgICAgZWxlbUNvbnRlbnRzUHJvcGVydHkgPSB0YWdOYW1lTG93ZXIgPT09IFwic2NyaXB0XCIgPyBcInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB0YWdOYW1lTG93ZXIgPT09IFwidGV4dGFyZWFcIiA/IFwidmFsdWVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcImlubmVySFRNTFwiO1xuXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRvbUVsZW1lbnRbZWxlbUNvbnRlbnRzUHJvcGVydHldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHZhbHVlVG9Xcml0ZSA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgIGlmIChlbGVtQ29udGVudHNQcm9wZXJ0eSA9PT0gXCJpbm5lckhUTUxcIilcbiAgICAgICAgICAgICAgICBrby51dGlscy5zZXRIdG1sKHRoaXMuZG9tRWxlbWVudCwgdmFsdWVUb1dyaXRlKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aGlzLmRvbUVsZW1lbnRbZWxlbUNvbnRlbnRzUHJvcGVydHldID0gdmFsdWVUb1dyaXRlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBkYXRhRG9tRGF0YVByZWZpeCA9IGtvLnV0aWxzLmRvbURhdGEubmV4dEtleSgpICsgXCJfXCI7XG4gICAga28udGVtcGxhdGVTb3VyY2VzLmRvbUVsZW1lbnQucHJvdG90eXBlWydkYXRhJ10gPSBmdW5jdGlvbihrZXkgLyosIHZhbHVlVG9Xcml0ZSAqLykge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIGtvLnV0aWxzLmRvbURhdGEuZ2V0KHRoaXMuZG9tRWxlbWVudCwgZGF0YURvbURhdGFQcmVmaXggKyBrZXkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAga28udXRpbHMuZG9tRGF0YS5zZXQodGhpcy5kb21FbGVtZW50LCBkYXRhRG9tRGF0YVByZWZpeCArIGtleSwgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyAtLS0tIGtvLnRlbXBsYXRlU291cmNlcy5hbm9ueW1vdXNUZW1wbGF0ZSAtLS0tLVxuICAgIC8vIEFub255bW91cyB0ZW1wbGF0ZXMgYXJlIG5vcm1hbGx5IHNhdmVkL3JldHJpZXZlZCBhcyBET00gbm9kZXMgdGhyb3VnaCBcIm5vZGVzXCIuXG4gICAgLy8gRm9yIGNvbXBhdGliaWxpdHksIHlvdSBjYW4gYWxzbyByZWFkIFwidGV4dFwiOyBpdCB3aWxsIGJlIHNlcmlhbGl6ZWQgZnJvbSB0aGUgbm9kZXMgb24gZGVtYW5kLlxuICAgIC8vIFdyaXRpbmcgdG8gXCJ0ZXh0XCIgaXMgc3RpbGwgc3VwcG9ydGVkLCBidXQgdGhlbiB0aGUgdGVtcGxhdGUgZGF0YSB3aWxsIG5vdCBiZSBhdmFpbGFibGUgYXMgRE9NIG5vZGVzLlxuXG4gICAgdmFyIGFub255bW91c1RlbXBsYXRlc0RvbURhdGFLZXkgPSBrby51dGlscy5kb21EYXRhLm5leHRLZXkoKTtcbiAgICBrby50ZW1wbGF0ZVNvdXJjZXMuYW5vbnltb3VzVGVtcGxhdGUgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIHRoaXMuZG9tRWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgfVxuICAgIGtvLnRlbXBsYXRlU291cmNlcy5hbm9ueW1vdXNUZW1wbGF0ZS5wcm90b3R5cGUgPSBuZXcga28udGVtcGxhdGVTb3VyY2VzLmRvbUVsZW1lbnQoKTtcbiAgICBrby50ZW1wbGF0ZVNvdXJjZXMuYW5vbnltb3VzVGVtcGxhdGUucHJvdG90eXBlLmNvbnN0cnVjdG9yID0ga28udGVtcGxhdGVTb3VyY2VzLmFub255bW91c1RlbXBsYXRlO1xuICAgIGtvLnRlbXBsYXRlU291cmNlcy5hbm9ueW1vdXNUZW1wbGF0ZS5wcm90b3R5cGVbJ3RleHQnXSA9IGZ1bmN0aW9uKC8qIHZhbHVlVG9Xcml0ZSAqLykge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICB2YXIgdGVtcGxhdGVEYXRhID0ga28udXRpbHMuZG9tRGF0YS5nZXQodGhpcy5kb21FbGVtZW50LCBhbm9ueW1vdXNUZW1wbGF0ZXNEb21EYXRhS2V5KSB8fCB7fTtcbiAgICAgICAgICAgIGlmICh0ZW1wbGF0ZURhdGEudGV4dERhdGEgPT09IHVuZGVmaW5lZCAmJiB0ZW1wbGF0ZURhdGEuY29udGFpbmVyRGF0YSlcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZURhdGEudGV4dERhdGEgPSB0ZW1wbGF0ZURhdGEuY29udGFpbmVyRGF0YS5pbm5lckhUTUw7XG4gICAgICAgICAgICByZXR1cm4gdGVtcGxhdGVEYXRhLnRleHREYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHZhbHVlVG9Xcml0ZSA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgIGtvLnV0aWxzLmRvbURhdGEuc2V0KHRoaXMuZG9tRWxlbWVudCwgYW5vbnltb3VzVGVtcGxhdGVzRG9tRGF0YUtleSwge3RleHREYXRhOiB2YWx1ZVRvV3JpdGV9KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAga28udGVtcGxhdGVTb3VyY2VzLmRvbUVsZW1lbnQucHJvdG90eXBlWydub2RlcyddID0gZnVuY3Rpb24oLyogdmFsdWVUb1dyaXRlICovKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZURhdGEgPSBrby51dGlscy5kb21EYXRhLmdldCh0aGlzLmRvbUVsZW1lbnQsIGFub255bW91c1RlbXBsYXRlc0RvbURhdGFLZXkpIHx8IHt9O1xuICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlRGF0YS5jb250YWluZXJEYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHZhbHVlVG9Xcml0ZSA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgIGtvLnV0aWxzLmRvbURhdGEuc2V0KHRoaXMuZG9tRWxlbWVudCwgYW5vbnltb3VzVGVtcGxhdGVzRG9tRGF0YUtleSwge2NvbnRhaW5lckRhdGE6IHZhbHVlVG9Xcml0ZX0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGtvLmV4cG9ydFN5bWJvbCgndGVtcGxhdGVTb3VyY2VzJywga28udGVtcGxhdGVTb3VyY2VzKTtcbiAgICBrby5leHBvcnRTeW1ib2woJ3RlbXBsYXRlU291cmNlcy5kb21FbGVtZW50Jywga28udGVtcGxhdGVTb3VyY2VzLmRvbUVsZW1lbnQpO1xuICAgIGtvLmV4cG9ydFN5bWJvbCgndGVtcGxhdGVTb3VyY2VzLmFub255bW91c1RlbXBsYXRlJywga28udGVtcGxhdGVTb3VyY2VzLmFub255bW91c1RlbXBsYXRlKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICAgIHZhciBfdGVtcGxhdGVFbmdpbmU7XG4gICAga28uc2V0VGVtcGxhdGVFbmdpbmUgPSBmdW5jdGlvbiAodGVtcGxhdGVFbmdpbmUpIHtcbiAgICAgICAgaWYgKCh0ZW1wbGF0ZUVuZ2luZSAhPSB1bmRlZmluZWQpICYmICEodGVtcGxhdGVFbmdpbmUgaW5zdGFuY2VvZiBrby50ZW1wbGF0ZUVuZ2luZSkpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0ZW1wbGF0ZUVuZ2luZSBtdXN0IGluaGVyaXQgZnJvbSBrby50ZW1wbGF0ZUVuZ2luZVwiKTtcbiAgICAgICAgX3RlbXBsYXRlRW5naW5lID0gdGVtcGxhdGVFbmdpbmU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW52b2tlRm9yRWFjaE5vZGVJbkNvbnRpbnVvdXNSYW5nZShmaXJzdE5vZGUsIGxhc3ROb2RlLCBhY3Rpb24pIHtcbiAgICAgICAgdmFyIG5vZGUsIG5leHRJblF1ZXVlID0gZmlyc3ROb2RlLCBmaXJzdE91dE9mUmFuZ2VOb2RlID0ga28udmlydHVhbEVsZW1lbnRzLm5leHRTaWJsaW5nKGxhc3ROb2RlKTtcbiAgICAgICAgd2hpbGUgKG5leHRJblF1ZXVlICYmICgobm9kZSA9IG5leHRJblF1ZXVlKSAhPT0gZmlyc3RPdXRPZlJhbmdlTm9kZSkpIHtcbiAgICAgICAgICAgIG5leHRJblF1ZXVlID0ga28udmlydHVhbEVsZW1lbnRzLm5leHRTaWJsaW5nKG5vZGUpO1xuICAgICAgICAgICAgYWN0aW9uKG5vZGUsIG5leHRJblF1ZXVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlQmluZGluZ3NPbkNvbnRpbnVvdXNOb2RlQXJyYXkoY29udGludW91c05vZGVBcnJheSwgYmluZGluZ0NvbnRleHQpIHtcbiAgICAgICAgLy8gVG8gYmUgdXNlZCBvbiBhbnkgbm9kZXMgdGhhdCBoYXZlIGJlZW4gcmVuZGVyZWQgYnkgYSB0ZW1wbGF0ZSBhbmQgaGF2ZSBiZWVuIGluc2VydGVkIGludG8gc29tZSBwYXJlbnQgZWxlbWVudFxuICAgICAgICAvLyBXYWxrcyB0aHJvdWdoIGNvbnRpbnVvdXNOb2RlQXJyYXkgKHdoaWNoICptdXN0KiBiZSBjb250aW51b3VzLCBpLmUuLCBhbiB1bmludGVycnVwdGVkIHNlcXVlbmNlIG9mIHNpYmxpbmcgbm9kZXMsIGJlY2F1c2VcbiAgICAgICAgLy8gdGhlIGFsZ29yaXRobSBmb3Igd2Fsa2luZyB0aGVtIHJlbGllcyBvbiB0aGlzKSwgYW5kIGZvciBlYWNoIHRvcC1sZXZlbCBpdGVtIGluIHRoZSB2aXJ0dWFsLWVsZW1lbnQgc2Vuc2UsXG4gICAgICAgIC8vICgxKSBEb2VzIGEgcmVndWxhciBcImFwcGx5QmluZGluZ3NcIiB0byBhc3NvY2lhdGUgYmluZGluZ0NvbnRleHQgd2l0aCB0aGlzIG5vZGUgYW5kIHRvIGFjdGl2YXRlIGFueSBub24tbWVtb2l6ZWQgYmluZGluZ3NcbiAgICAgICAgLy8gKDIpIFVubWVtb2l6ZXMgYW55IG1lbW9zIGluIHRoZSBET00gc3VidHJlZSAoZS5nLiwgdG8gYWN0aXZhdGUgYmluZGluZ3MgdGhhdCBoYWQgYmVlbiBtZW1vaXplZCBkdXJpbmcgdGVtcGxhdGUgcmV3cml0aW5nKVxuXG4gICAgICAgIGlmIChjb250aW51b3VzTm9kZUFycmF5Lmxlbmd0aCkge1xuICAgICAgICAgICAgdmFyIGZpcnN0Tm9kZSA9IGNvbnRpbnVvdXNOb2RlQXJyYXlbMF0sXG4gICAgICAgICAgICAgICAgbGFzdE5vZGUgPSBjb250aW51b3VzTm9kZUFycmF5W2NvbnRpbnVvdXNOb2RlQXJyYXkubGVuZ3RoIC0gMV0sXG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZSA9IGZpcnN0Tm9kZS5wYXJlbnROb2RlLFxuICAgICAgICAgICAgICAgIHByb3ZpZGVyID0ga28uYmluZGluZ1Byb3ZpZGVyWydpbnN0YW5jZSddLFxuICAgICAgICAgICAgICAgIHByZXByb2Nlc3NOb2RlID0gcHJvdmlkZXJbJ3ByZXByb2Nlc3NOb2RlJ107XG5cbiAgICAgICAgICAgIGlmIChwcmVwcm9jZXNzTm9kZSkge1xuICAgICAgICAgICAgICAgIGludm9rZUZvckVhY2hOb2RlSW5Db250aW51b3VzUmFuZ2UoZmlyc3ROb2RlLCBsYXN0Tm9kZSwgZnVuY3Rpb24obm9kZSwgbmV4dE5vZGVJblJhbmdlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBub2RlUHJldmlvdXNTaWJsaW5nID0gbm9kZS5wcmV2aW91c1NpYmxpbmc7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdOb2RlcyA9IHByZXByb2Nlc3NOb2RlLmNhbGwocHJvdmlkZXIsIG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV3Tm9kZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub2RlID09PSBmaXJzdE5vZGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3ROb2RlID0gbmV3Tm9kZXNbMF0gfHwgbmV4dE5vZGVJblJhbmdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUgPT09IGxhc3ROb2RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3ROb2RlID0gbmV3Tm9kZXNbbmV3Tm9kZXMubGVuZ3RoIC0gMV0gfHwgbm9kZVByZXZpb3VzU2libGluZztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gQmVjYXVzZSBwcmVwcm9jZXNzTm9kZSBjYW4gY2hhbmdlIHRoZSBub2RlcywgaW5jbHVkaW5nIHRoZSBmaXJzdCBhbmQgbGFzdCBub2RlcywgdXBkYXRlIGNvbnRpbnVvdXNOb2RlQXJyYXkgdG8gbWF0Y2guXG4gICAgICAgICAgICAgICAgLy8gV2UgbmVlZCB0aGUgZnVsbCBzZXQsIGluY2x1ZGluZyBpbm5lciBub2RlcywgYmVjYXVzZSB0aGUgdW5tZW1vaXplIHN0ZXAgbWlnaHQgcmVtb3ZlIHRoZSBmaXJzdCBub2RlIChhbmQgc28gdGhlIHJlYWxcbiAgICAgICAgICAgICAgICAvLyBmaXJzdCBub2RlIG5lZWRzIHRvIGJlIGluIHRoZSBhcnJheSkuXG4gICAgICAgICAgICAgICAgY29udGludW91c05vZGVBcnJheS5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgIGlmICghZmlyc3ROb2RlKSB7IC8vIHByZXByb2Nlc3NOb2RlIG1pZ2h0IGhhdmUgcmVtb3ZlZCBhbGwgdGhlIG5vZGVzLCBpbiB3aGljaCBjYXNlIHRoZXJlJ3Mgbm90aGluZyBsZWZ0IHRvIGRvXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGZpcnN0Tm9kZSA9PT0gbGFzdE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludW91c05vZGVBcnJheS5wdXNoKGZpcnN0Tm9kZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludW91c05vZGVBcnJheS5wdXNoKGZpcnN0Tm9kZSwgbGFzdE5vZGUpO1xuICAgICAgICAgICAgICAgICAgICBrby51dGlscy5maXhVcENvbnRpbnVvdXNOb2RlQXJyYXkoY29udGludW91c05vZGVBcnJheSwgcGFyZW50Tm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBOZWVkIHRvIGFwcGx5QmluZGluZ3MgKmJlZm9yZSogdW5tZW1vemlhdGlvbiwgYmVjYXVzZSB1bm1lbW9pemF0aW9uIG1pZ2h0IGludHJvZHVjZSBleHRyYSBub2RlcyAodGhhdCB3ZSBkb24ndCB3YW50IHRvIHJlLWJpbmQpXG4gICAgICAgICAgICAvLyB3aGVyZWFzIGEgcmVndWxhciBhcHBseUJpbmRpbmdzIHdvbid0IGludHJvZHVjZSBuZXcgbWVtb2l6ZWQgbm9kZXNcbiAgICAgICAgICAgIGludm9rZUZvckVhY2hOb2RlSW5Db250aW51b3VzUmFuZ2UoZmlyc3ROb2RlLCBsYXN0Tm9kZSwgZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxIHx8IG5vZGUubm9kZVR5cGUgPT09IDgpXG4gICAgICAgICAgICAgICAgICAgIGtvLmFwcGx5QmluZGluZ3MoYmluZGluZ0NvbnRleHQsIG5vZGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpbnZva2VGb3JFYWNoTm9kZUluQ29udGludW91c1JhbmdlKGZpcnN0Tm9kZSwgbGFzdE5vZGUsIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMSB8fCBub2RlLm5vZGVUeXBlID09PSA4KVxuICAgICAgICAgICAgICAgICAgICBrby5tZW1vaXphdGlvbi51bm1lbW9pemVEb21Ob2RlQW5kRGVzY2VuZGFudHMobm9kZSwgW2JpbmRpbmdDb250ZXh0XSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gTWFrZSBzdXJlIGFueSBjaGFuZ2VzIGRvbmUgYnkgYXBwbHlCaW5kaW5ncyBvciB1bm1lbW9pemUgYXJlIHJlZmxlY3RlZCBpbiB0aGUgYXJyYXlcbiAgICAgICAgICAgIGtvLnV0aWxzLmZpeFVwQ29udGludW91c05vZGVBcnJheShjb250aW51b3VzTm9kZUFycmF5LCBwYXJlbnROb2RlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEZpcnN0Tm9kZUZyb21Qb3NzaWJsZUFycmF5KG5vZGVPck5vZGVBcnJheSkge1xuICAgICAgICByZXR1cm4gbm9kZU9yTm9kZUFycmF5Lm5vZGVUeXBlID8gbm9kZU9yTm9kZUFycmF5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBub2RlT3JOb2RlQXJyYXkubGVuZ3RoID4gMCA/IG5vZGVPck5vZGVBcnJheVswXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleGVjdXRlVGVtcGxhdGUodGFyZ2V0Tm9kZU9yTm9kZUFycmF5LCByZW5kZXJNb2RlLCB0ZW1wbGF0ZSwgYmluZGluZ0NvbnRleHQsIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICAgIHZhciBmaXJzdFRhcmdldE5vZGUgPSB0YXJnZXROb2RlT3JOb2RlQXJyYXkgJiYgZ2V0Rmlyc3ROb2RlRnJvbVBvc3NpYmxlQXJyYXkodGFyZ2V0Tm9kZU9yTm9kZUFycmF5KTtcbiAgICAgICAgdmFyIHRlbXBsYXRlRG9jdW1lbnQgPSBmaXJzdFRhcmdldE5vZGUgJiYgZmlyc3RUYXJnZXROb2RlLm93bmVyRG9jdW1lbnQ7XG4gICAgICAgIHZhciB0ZW1wbGF0ZUVuZ2luZVRvVXNlID0gKG9wdGlvbnNbJ3RlbXBsYXRlRW5naW5lJ10gfHwgX3RlbXBsYXRlRW5naW5lKTtcbiAgICAgICAga28udGVtcGxhdGVSZXdyaXRpbmcuZW5zdXJlVGVtcGxhdGVJc1Jld3JpdHRlbih0ZW1wbGF0ZSwgdGVtcGxhdGVFbmdpbmVUb1VzZSwgdGVtcGxhdGVEb2N1bWVudCk7XG4gICAgICAgIHZhciByZW5kZXJlZE5vZGVzQXJyYXkgPSB0ZW1wbGF0ZUVuZ2luZVRvVXNlWydyZW5kZXJUZW1wbGF0ZSddKHRlbXBsYXRlLCBiaW5kaW5nQ29udGV4dCwgb3B0aW9ucywgdGVtcGxhdGVEb2N1bWVudCk7XG5cbiAgICAgICAgLy8gTG9vc2VseSBjaGVjayByZXN1bHQgaXMgYW4gYXJyYXkgb2YgRE9NIG5vZGVzXG4gICAgICAgIGlmICgodHlwZW9mIHJlbmRlcmVkTm9kZXNBcnJheS5sZW5ndGggIT0gXCJudW1iZXJcIikgfHwgKHJlbmRlcmVkTm9kZXNBcnJheS5sZW5ndGggPiAwICYmIHR5cGVvZiByZW5kZXJlZE5vZGVzQXJyYXlbMF0ubm9kZVR5cGUgIT0gXCJudW1iZXJcIikpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUZW1wbGF0ZSBlbmdpbmUgbXVzdCByZXR1cm4gYW4gYXJyYXkgb2YgRE9NIG5vZGVzXCIpO1xuXG4gICAgICAgIHZhciBoYXZlQWRkZWROb2Rlc1RvUGFyZW50ID0gZmFsc2U7XG4gICAgICAgIHN3aXRjaCAocmVuZGVyTW9kZSkge1xuICAgICAgICAgICAgY2FzZSBcInJlcGxhY2VDaGlsZHJlblwiOlxuICAgICAgICAgICAgICAgIGtvLnZpcnR1YWxFbGVtZW50cy5zZXREb21Ob2RlQ2hpbGRyZW4odGFyZ2V0Tm9kZU9yTm9kZUFycmF5LCByZW5kZXJlZE5vZGVzQXJyYXkpO1xuICAgICAgICAgICAgICAgIGhhdmVBZGRlZE5vZGVzVG9QYXJlbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInJlcGxhY2VOb2RlXCI6XG4gICAgICAgICAgICAgICAga28udXRpbHMucmVwbGFjZURvbU5vZGVzKHRhcmdldE5vZGVPck5vZGVBcnJheSwgcmVuZGVyZWROb2Rlc0FycmF5KTtcbiAgICAgICAgICAgICAgICBoYXZlQWRkZWROb2Rlc1RvUGFyZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJpZ25vcmVUYXJnZXROb2RlXCI6IGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIHJlbmRlck1vZGU6IFwiICsgcmVuZGVyTW9kZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGF2ZUFkZGVkTm9kZXNUb1BhcmVudCkge1xuICAgICAgICAgICAgYWN0aXZhdGVCaW5kaW5nc09uQ29udGludW91c05vZGVBcnJheShyZW5kZXJlZE5vZGVzQXJyYXksIGJpbmRpbmdDb250ZXh0KTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zWydhZnRlclJlbmRlciddKVxuICAgICAgICAgICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uaWdub3JlKG9wdGlvbnNbJ2FmdGVyUmVuZGVyJ10sIG51bGwsIFtyZW5kZXJlZE5vZGVzQXJyYXksIGJpbmRpbmdDb250ZXh0WyckZGF0YSddXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVuZGVyZWROb2Rlc0FycmF5O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlc29sdmVUZW1wbGF0ZU5hbWUodGVtcGxhdGUsIGRhdGEsIGNvbnRleHQpIHtcbiAgICAgICAgLy8gVGhlIHRlbXBsYXRlIGNhbiBiZSBzcGVjaWZpZWQgYXM6XG4gICAgICAgIGlmIChrby5pc09ic2VydmFibGUodGVtcGxhdGUpKSB7XG4gICAgICAgICAgICAvLyAxLiBBbiBvYnNlcnZhYmxlLCB3aXRoIHN0cmluZyB2YWx1ZVxuICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRlbXBsYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAvLyAyLiBBIGZ1bmN0aW9uIG9mIChkYXRhLCBjb250ZXh0KSByZXR1cm5pbmcgYSBzdHJpbmdcbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZShkYXRhLCBjb250ZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIDMuIEEgc3RyaW5nXG4gICAgICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBrby5yZW5kZXJUZW1wbGF0ZSA9IGZ1bmN0aW9uICh0ZW1wbGF0ZSwgZGF0YU9yQmluZGluZ0NvbnRleHQsIG9wdGlvbnMsIHRhcmdldE5vZGVPck5vZGVBcnJheSwgcmVuZGVyTW9kZSkge1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgICAgaWYgKChvcHRpb25zWyd0ZW1wbGF0ZUVuZ2luZSddIHx8IF90ZW1wbGF0ZUVuZ2luZSkgPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2V0IGEgdGVtcGxhdGUgZW5naW5lIGJlZm9yZSBjYWxsaW5nIHJlbmRlclRlbXBsYXRlXCIpO1xuICAgICAgICByZW5kZXJNb2RlID0gcmVuZGVyTW9kZSB8fCBcInJlcGxhY2VDaGlsZHJlblwiO1xuXG4gICAgICAgIGlmICh0YXJnZXROb2RlT3JOb2RlQXJyYXkpIHtcbiAgICAgICAgICAgIHZhciBmaXJzdFRhcmdldE5vZGUgPSBnZXRGaXJzdE5vZGVGcm9tUG9zc2libGVBcnJheSh0YXJnZXROb2RlT3JOb2RlQXJyYXkpO1xuXG4gICAgICAgICAgICB2YXIgd2hlblRvRGlzcG9zZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICghZmlyc3RUYXJnZXROb2RlKSB8fCAha28udXRpbHMuZG9tTm9kZUlzQXR0YWNoZWRUb0RvY3VtZW50KGZpcnN0VGFyZ2V0Tm9kZSk7IH07IC8vIFBhc3NpdmUgZGlzcG9zYWwgKG9uIG5leHQgZXZhbHVhdGlvbilcbiAgICAgICAgICAgIHZhciBhY3RpdmVseURpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZCA9IChmaXJzdFRhcmdldE5vZGUgJiYgcmVuZGVyTW9kZSA9PSBcInJlcGxhY2VOb2RlXCIpID8gZmlyc3RUYXJnZXROb2RlLnBhcmVudE5vZGUgOiBmaXJzdFRhcmdldE5vZGU7XG5cbiAgICAgICAgICAgIHJldHVybiBrby5kZXBlbmRlbnRPYnNlcnZhYmxlKCAvLyBTbyB0aGUgRE9NIGlzIGF1dG9tYXRpY2FsbHkgdXBkYXRlZCB3aGVuIGFueSBkZXBlbmRlbmN5IGNoYW5nZXNcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEVuc3VyZSB3ZSd2ZSBnb3QgYSBwcm9wZXIgYmluZGluZyBjb250ZXh0IHRvIHdvcmsgd2l0aFxuICAgICAgICAgICAgICAgICAgICB2YXIgYmluZGluZ0NvbnRleHQgPSAoZGF0YU9yQmluZGluZ0NvbnRleHQgJiYgKGRhdGFPckJpbmRpbmdDb250ZXh0IGluc3RhbmNlb2Yga28uYmluZGluZ0NvbnRleHQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgPyBkYXRhT3JCaW5kaW5nQ29udGV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgOiBuZXcga28uYmluZGluZ0NvbnRleHQoa28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShkYXRhT3JCaW5kaW5nQ29udGV4dCkpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZU5hbWUgPSByZXNvbHZlVGVtcGxhdGVOYW1lKHRlbXBsYXRlLCBiaW5kaW5nQ29udGV4dFsnJGRhdGEnXSwgYmluZGluZ0NvbnRleHQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyZWROb2Rlc0FycmF5ID0gZXhlY3V0ZVRlbXBsYXRlKHRhcmdldE5vZGVPck5vZGVBcnJheSwgcmVuZGVyTW9kZSwgdGVtcGxhdGVOYW1lLCBiaW5kaW5nQ29udGV4dCwgb3B0aW9ucyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbmRlck1vZGUgPT0gXCJyZXBsYWNlTm9kZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXROb2RlT3JOb2RlQXJyYXkgPSByZW5kZXJlZE5vZGVzQXJyYXk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdFRhcmdldE5vZGUgPSBnZXRGaXJzdE5vZGVGcm9tUG9zc2libGVBcnJheSh0YXJnZXROb2RlT3JOb2RlQXJyYXkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgIHsgZGlzcG9zZVdoZW46IHdoZW5Ub0Rpc3Bvc2UsIGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZDogYWN0aXZlbHlEaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFdlIGRvbid0IHlldCBoYXZlIGEgRE9NIG5vZGUgdG8gZXZhbHVhdGUsIHNvIHVzZSBhIG1lbW8gYW5kIHJlbmRlciB0aGUgdGVtcGxhdGUgbGF0ZXIgd2hlbiB0aGVyZSBpcyBhIERPTSBub2RlXG4gICAgICAgICAgICByZXR1cm4ga28ubWVtb2l6YXRpb24ubWVtb2l6ZShmdW5jdGlvbiAoZG9tTm9kZSkge1xuICAgICAgICAgICAgICAgIGtvLnJlbmRlclRlbXBsYXRlKHRlbXBsYXRlLCBkYXRhT3JCaW5kaW5nQ29udGV4dCwgb3B0aW9ucywgZG9tTm9kZSwgXCJyZXBsYWNlTm9kZVwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGtvLnJlbmRlclRlbXBsYXRlRm9yRWFjaCA9IGZ1bmN0aW9uICh0ZW1wbGF0ZSwgYXJyYXlPck9ic2VydmFibGVBcnJheSwgb3B0aW9ucywgdGFyZ2V0Tm9kZSwgcGFyZW50QmluZGluZ0NvbnRleHQpIHtcbiAgICAgICAgLy8gU2luY2Ugc2V0RG9tTm9kZUNoaWxkcmVuRnJvbUFycmF5TWFwcGluZyBhbHdheXMgY2FsbHMgZXhlY3V0ZVRlbXBsYXRlRm9yQXJyYXlJdGVtIGFuZCB0aGVuXG4gICAgICAgIC8vIGFjdGl2YXRlQmluZGluZ3NDYWxsYmFjayBmb3IgYWRkZWQgaXRlbXMsIHdlIGNhbiBzdG9yZSB0aGUgYmluZGluZyBjb250ZXh0IGluIHRoZSBmb3JtZXIgdG8gdXNlIGluIHRoZSBsYXR0ZXIuXG4gICAgICAgIHZhciBhcnJheUl0ZW1Db250ZXh0O1xuXG4gICAgICAgIC8vIFRoaXMgd2lsbCBiZSBjYWxsZWQgYnkgc2V0RG9tTm9kZUNoaWxkcmVuRnJvbUFycmF5TWFwcGluZyB0byBnZXQgdGhlIG5vZGVzIHRvIGFkZCB0byB0YXJnZXROb2RlXG4gICAgICAgIHZhciBleGVjdXRlVGVtcGxhdGVGb3JBcnJheUl0ZW0gPSBmdW5jdGlvbiAoYXJyYXlWYWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgICAgIC8vIFN1cHBvcnQgc2VsZWN0aW5nIHRlbXBsYXRlIGFzIGEgZnVuY3Rpb24gb2YgdGhlIGRhdGEgYmVpbmcgcmVuZGVyZWRcbiAgICAgICAgICAgIGFycmF5SXRlbUNvbnRleHQgPSBwYXJlbnRCaW5kaW5nQ29udGV4dFsnY3JlYXRlQ2hpbGRDb250ZXh0J10oYXJyYXlWYWx1ZSwgb3B0aW9uc1snYXMnXSwgZnVuY3Rpb24oY29udGV4dCkge1xuICAgICAgICAgICAgICAgIGNvbnRleHRbJyRpbmRleCddID0gaW5kZXg7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIHRlbXBsYXRlTmFtZSA9IHJlc29sdmVUZW1wbGF0ZU5hbWUodGVtcGxhdGUsIGFycmF5VmFsdWUsIGFycmF5SXRlbUNvbnRleHQpO1xuICAgICAgICAgICAgcmV0dXJuIGV4ZWN1dGVUZW1wbGF0ZShudWxsLCBcImlnbm9yZVRhcmdldE5vZGVcIiwgdGVtcGxhdGVOYW1lLCBhcnJheUl0ZW1Db250ZXh0LCBvcHRpb25zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoaXMgd2lsbCBiZSBjYWxsZWQgd2hlbmV2ZXIgc2V0RG9tTm9kZUNoaWxkcmVuRnJvbUFycmF5TWFwcGluZyBoYXMgYWRkZWQgbm9kZXMgdG8gdGFyZ2V0Tm9kZVxuICAgICAgICB2YXIgYWN0aXZhdGVCaW5kaW5nc0NhbGxiYWNrID0gZnVuY3Rpb24oYXJyYXlWYWx1ZSwgYWRkZWROb2Rlc0FycmF5LCBpbmRleCkge1xuICAgICAgICAgICAgYWN0aXZhdGVCaW5kaW5nc09uQ29udGludW91c05vZGVBcnJheShhZGRlZE5vZGVzQXJyYXksIGFycmF5SXRlbUNvbnRleHQpO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnNbJ2FmdGVyUmVuZGVyJ10pXG4gICAgICAgICAgICAgICAgb3B0aW9uc1snYWZ0ZXJSZW5kZXInXShhZGRlZE5vZGVzQXJyYXksIGFycmF5VmFsdWUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBrby5kZXBlbmRlbnRPYnNlcnZhYmxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB1bndyYXBwZWRBcnJheSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUoYXJyYXlPck9ic2VydmFibGVBcnJheSkgfHwgW107XG4gICAgICAgICAgICBpZiAodHlwZW9mIHVud3JhcHBlZEFycmF5Lmxlbmd0aCA9PSBcInVuZGVmaW5lZFwiKSAvLyBDb2VyY2Ugc2luZ2xlIHZhbHVlIGludG8gYXJyYXlcbiAgICAgICAgICAgICAgICB1bndyYXBwZWRBcnJheSA9IFt1bndyYXBwZWRBcnJheV07XG5cbiAgICAgICAgICAgIC8vIEZpbHRlciBvdXQgYW55IGVudHJpZXMgbWFya2VkIGFzIGRlc3Ryb3llZFxuICAgICAgICAgICAgdmFyIGZpbHRlcmVkQXJyYXkgPSBrby51dGlscy5hcnJheUZpbHRlcih1bndyYXBwZWRBcnJheSwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcHRpb25zWydpbmNsdWRlRGVzdHJveWVkJ10gfHwgaXRlbSA9PT0gdW5kZWZpbmVkIHx8IGl0ZW0gPT09IG51bGwgfHwgIWtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUoaXRlbVsnX2Rlc3Ryb3knXSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gQ2FsbCBzZXREb21Ob2RlQ2hpbGRyZW5Gcm9tQXJyYXlNYXBwaW5nLCBpZ25vcmluZyBhbnkgb2JzZXJ2YWJsZXMgdW53cmFwcGVkIHdpdGhpbiAobW9zdCBsaWtlbHkgZnJvbSBhIGNhbGxiYWNrIGZ1bmN0aW9uKS5cbiAgICAgICAgICAgIC8vIElmIHRoZSBhcnJheSBpdGVtcyBhcmUgb2JzZXJ2YWJsZXMsIHRob3VnaCwgdGhleSB3aWxsIGJlIHVud3JhcHBlZCBpbiBleGVjdXRlVGVtcGxhdGVGb3JBcnJheUl0ZW0gYW5kIG1hbmFnZWQgd2l0aGluIHNldERvbU5vZGVDaGlsZHJlbkZyb21BcnJheU1hcHBpbmcuXG4gICAgICAgICAgICBrby5kZXBlbmRlbmN5RGV0ZWN0aW9uLmlnbm9yZShrby51dGlscy5zZXREb21Ob2RlQ2hpbGRyZW5Gcm9tQXJyYXlNYXBwaW5nLCBudWxsLCBbdGFyZ2V0Tm9kZSwgZmlsdGVyZWRBcnJheSwgZXhlY3V0ZVRlbXBsYXRlRm9yQXJyYXlJdGVtLCBvcHRpb25zLCBhY3RpdmF0ZUJpbmRpbmdzQ2FsbGJhY2tdKTtcblxuICAgICAgICB9LCBudWxsLCB7IGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZDogdGFyZ2V0Tm9kZSB9KTtcbiAgICB9O1xuXG4gICAgdmFyIHRlbXBsYXRlQ29tcHV0ZWREb21EYXRhS2V5ID0ga28udXRpbHMuZG9tRGF0YS5uZXh0S2V5KCk7XG4gICAgZnVuY3Rpb24gZGlzcG9zZU9sZENvbXB1dGVkQW5kU3RvcmVOZXdPbmUoZWxlbWVudCwgbmV3Q29tcHV0ZWQpIHtcbiAgICAgICAgdmFyIG9sZENvbXB1dGVkID0ga28udXRpbHMuZG9tRGF0YS5nZXQoZWxlbWVudCwgdGVtcGxhdGVDb21wdXRlZERvbURhdGFLZXkpO1xuICAgICAgICBpZiAob2xkQ29tcHV0ZWQgJiYgKHR5cGVvZihvbGRDb21wdXRlZC5kaXNwb3NlKSA9PSAnZnVuY3Rpb24nKSlcbiAgICAgICAgICAgIG9sZENvbXB1dGVkLmRpc3Bvc2UoKTtcbiAgICAgICAga28udXRpbHMuZG9tRGF0YS5zZXQoZWxlbWVudCwgdGVtcGxhdGVDb21wdXRlZERvbURhdGFLZXksIChuZXdDb21wdXRlZCAmJiBuZXdDb21wdXRlZC5pc0FjdGl2ZSgpKSA/IG5ld0NvbXB1dGVkIDogdW5kZWZpbmVkKTtcbiAgICB9XG5cbiAgICBrby5iaW5kaW5nSGFuZGxlcnNbJ3RlbXBsYXRlJ10gPSB7XG4gICAgICAgICdpbml0JzogZnVuY3Rpb24oZWxlbWVudCwgdmFsdWVBY2Nlc3Nvcikge1xuICAgICAgICAgICAgLy8gU3VwcG9ydCBhbm9ueW1vdXMgdGVtcGxhdGVzXG4gICAgICAgICAgICB2YXIgYmluZGluZ1ZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZUFjY2Vzc29yKCkpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBiaW5kaW5nVmFsdWUgPT0gXCJzdHJpbmdcIiB8fCBiaW5kaW5nVmFsdWVbJ25hbWUnXSkge1xuICAgICAgICAgICAgICAgIC8vIEl0J3MgYSBuYW1lZCB0ZW1wbGF0ZSAtIGNsZWFyIHRoZSBlbGVtZW50XG4gICAgICAgICAgICAgICAga28udmlydHVhbEVsZW1lbnRzLmVtcHR5Tm9kZShlbGVtZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gSXQncyBhbiBhbm9ueW1vdXMgdGVtcGxhdGUgLSBzdG9yZSB0aGUgZWxlbWVudCBjb250ZW50cywgdGhlbiBjbGVhciB0aGUgZWxlbWVudFxuICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZU5vZGVzID0ga28udmlydHVhbEVsZW1lbnRzLmNoaWxkTm9kZXMoZWxlbWVudCksXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lciA9IGtvLnV0aWxzLm1vdmVDbGVhbmVkTm9kZXNUb0NvbnRhaW5lckVsZW1lbnQodGVtcGxhdGVOb2Rlcyk7IC8vIFRoaXMgYWxzbyByZW1vdmVzIHRoZSBub2RlcyBmcm9tIHRoZWlyIGN1cnJlbnQgcGFyZW50XG4gICAgICAgICAgICAgICAgbmV3IGtvLnRlbXBsYXRlU291cmNlcy5hbm9ueW1vdXNUZW1wbGF0ZShlbGVtZW50KVsnbm9kZXMnXShjb250YWluZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHsgJ2NvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzJzogdHJ1ZSB9O1xuICAgICAgICB9LFxuICAgICAgICAndXBkYXRlJzogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzLCB2aWV3TW9kZWwsIGJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB2YWx1ZUFjY2Vzc29yKCksXG4gICAgICAgICAgICAgICAgZGF0YVZhbHVlLFxuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlKSxcbiAgICAgICAgICAgICAgICBzaG91bGREaXNwbGF5ID0gdHJ1ZSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZUNvbXB1dGVkID0gbnVsbCxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZU5hbWU7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVOYW1lID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZU5hbWUgPSBvcHRpb25zWyduYW1lJ107XG5cbiAgICAgICAgICAgICAgICAvLyBTdXBwb3J0IFwiaWZcIi9cImlmbm90XCIgY29uZGl0aW9uc1xuICAgICAgICAgICAgICAgIGlmICgnaWYnIGluIG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgICAgIHNob3VsZERpc3BsYXkgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKG9wdGlvbnNbJ2lmJ10pO1xuICAgICAgICAgICAgICAgIGlmIChzaG91bGREaXNwbGF5ICYmICdpZm5vdCcgaW4gb3B0aW9ucylcbiAgICAgICAgICAgICAgICAgICAgc2hvdWxkRGlzcGxheSA9ICFrby51dGlscy51bndyYXBPYnNlcnZhYmxlKG9wdGlvbnNbJ2lmbm90J10pO1xuXG4gICAgICAgICAgICAgICAgZGF0YVZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShvcHRpb25zWydkYXRhJ10pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoJ2ZvcmVhY2gnIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAvLyBSZW5kZXIgb25jZSBmb3IgZWFjaCBkYXRhIHBvaW50ICh0cmVhdGluZyBkYXRhIHNldCBhcyBlbXB0eSBpZiBzaG91bGREaXNwbGF5PT1mYWxzZSlcbiAgICAgICAgICAgICAgICB2YXIgZGF0YUFycmF5ID0gKHNob3VsZERpc3BsYXkgJiYgb3B0aW9uc1snZm9yZWFjaCddKSB8fCBbXTtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZUNvbXB1dGVkID0ga28ucmVuZGVyVGVtcGxhdGVGb3JFYWNoKHRlbXBsYXRlTmFtZSB8fCBlbGVtZW50LCBkYXRhQXJyYXksIG9wdGlvbnMsIGVsZW1lbnQsIGJpbmRpbmdDb250ZXh0KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXNob3VsZERpc3BsYXkpIHtcbiAgICAgICAgICAgICAgICBrby52aXJ0dWFsRWxlbWVudHMuZW1wdHlOb2RlKGVsZW1lbnQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBSZW5kZXIgb25jZSBmb3IgdGhpcyBzaW5nbGUgZGF0YSBwb2ludCAob3IgdXNlIHRoZSB2aWV3TW9kZWwgaWYgbm8gZGF0YSB3YXMgcHJvdmlkZWQpXG4gICAgICAgICAgICAgICAgdmFyIGlubmVyQmluZGluZ0NvbnRleHQgPSAoJ2RhdGEnIGluIG9wdGlvbnMpID9cbiAgICAgICAgICAgICAgICAgICAgYmluZGluZ0NvbnRleHRbJ2NyZWF0ZUNoaWxkQ29udGV4dCddKGRhdGFWYWx1ZSwgb3B0aW9uc1snYXMnXSkgOiAgLy8gR2l2ZW4gYW4gZXhwbGl0aXQgJ2RhdGEnIHZhbHVlLCB3ZSBjcmVhdGUgYSBjaGlsZCBiaW5kaW5nIGNvbnRleHQgZm9yIGl0XG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmdDb250ZXh0OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2l2ZW4gbm8gZXhwbGljaXQgJ2RhdGEnIHZhbHVlLCB3ZSByZXRhaW4gdGhlIHNhbWUgYmluZGluZyBjb250ZXh0XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVDb21wdXRlZCA9IGtvLnJlbmRlclRlbXBsYXRlKHRlbXBsYXRlTmFtZSB8fCBlbGVtZW50LCBpbm5lckJpbmRpbmdDb250ZXh0LCBvcHRpb25zLCBlbGVtZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSXQgb25seSBtYWtlcyBzZW5zZSB0byBoYXZlIGEgc2luZ2xlIHRlbXBsYXRlIGNvbXB1dGVkIHBlciBlbGVtZW50IChvdGhlcndpc2Ugd2hpY2ggb25lIHNob3VsZCBoYXZlIGl0cyBvdXRwdXQgZGlzcGxheWVkPylcbiAgICAgICAgICAgIGRpc3Bvc2VPbGRDb21wdXRlZEFuZFN0b3JlTmV3T25lKGVsZW1lbnQsIHRlbXBsYXRlQ29tcHV0ZWQpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIEFub255bW91cyB0ZW1wbGF0ZXMgY2FuJ3QgYmUgcmV3cml0dGVuLiBHaXZlIGEgbmljZSBlcnJvciBtZXNzYWdlIGlmIHlvdSB0cnkgdG8gZG8gaXQuXG4gICAga28uZXhwcmVzc2lvblJld3JpdGluZy5iaW5kaW5nUmV3cml0ZVZhbGlkYXRvcnNbJ3RlbXBsYXRlJ10gPSBmdW5jdGlvbihiaW5kaW5nVmFsdWUpIHtcbiAgICAgICAgdmFyIHBhcnNlZEJpbmRpbmdWYWx1ZSA9IGtvLmV4cHJlc3Npb25SZXdyaXRpbmcucGFyc2VPYmplY3RMaXRlcmFsKGJpbmRpbmdWYWx1ZSk7XG5cbiAgICAgICAgaWYgKChwYXJzZWRCaW5kaW5nVmFsdWUubGVuZ3RoID09IDEpICYmIHBhcnNlZEJpbmRpbmdWYWx1ZVswXVsndW5rbm93biddKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7IC8vIEl0IGxvb2tzIGxpa2UgYSBzdHJpbmcgbGl0ZXJhbCwgbm90IGFuIG9iamVjdCBsaXRlcmFsLCBzbyB0cmVhdCBpdCBhcyBhIG5hbWVkIHRlbXBsYXRlICh3aGljaCBpcyBhbGxvd2VkIGZvciByZXdyaXRpbmcpXG5cbiAgICAgICAgaWYgKGtvLmV4cHJlc3Npb25SZXdyaXRpbmcua2V5VmFsdWVBcnJheUNvbnRhaW5zS2V5KHBhcnNlZEJpbmRpbmdWYWx1ZSwgXCJuYW1lXCIpKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7IC8vIE5hbWVkIHRlbXBsYXRlcyBjYW4gYmUgcmV3cml0dGVuLCBzbyByZXR1cm4gXCJubyBlcnJvclwiXG4gICAgICAgIHJldHVybiBcIlRoaXMgdGVtcGxhdGUgZW5naW5lIGRvZXMgbm90IHN1cHBvcnQgYW5vbnltb3VzIHRlbXBsYXRlcyBuZXN0ZWQgd2l0aGluIGl0cyB0ZW1wbGF0ZXNcIjtcbiAgICB9O1xuXG4gICAga28udmlydHVhbEVsZW1lbnRzLmFsbG93ZWRCaW5kaW5nc1sndGVtcGxhdGUnXSA9IHRydWU7XG59KSgpO1xuXG5rby5leHBvcnRTeW1ib2woJ3NldFRlbXBsYXRlRW5naW5lJywga28uc2V0VGVtcGxhdGVFbmdpbmUpO1xua28uZXhwb3J0U3ltYm9sKCdyZW5kZXJUZW1wbGF0ZScsIGtvLnJlbmRlclRlbXBsYXRlKTtcbi8vIEdvIHRocm91Z2ggdGhlIGl0ZW1zIHRoYXQgaGF2ZSBiZWVuIGFkZGVkIGFuZCBkZWxldGVkIGFuZCB0cnkgdG8gZmluZCBtYXRjaGVzIGJldHdlZW4gdGhlbS5cbmtvLnV0aWxzLmZpbmRNb3Zlc0luQXJyYXlDb21wYXJpc29uID0gZnVuY3Rpb24gKGxlZnQsIHJpZ2h0LCBsaW1pdEZhaWxlZENvbXBhcmVzKSB7XG4gICAgaWYgKGxlZnQubGVuZ3RoICYmIHJpZ2h0Lmxlbmd0aCkge1xuICAgICAgICB2YXIgZmFpbGVkQ29tcGFyZXMsIGwsIHIsIGxlZnRJdGVtLCByaWdodEl0ZW07XG4gICAgICAgIGZvciAoZmFpbGVkQ29tcGFyZXMgPSBsID0gMDsgKCFsaW1pdEZhaWxlZENvbXBhcmVzIHx8IGZhaWxlZENvbXBhcmVzIDwgbGltaXRGYWlsZWRDb21wYXJlcykgJiYgKGxlZnRJdGVtID0gbGVmdFtsXSk7ICsrbCkge1xuICAgICAgICAgICAgZm9yIChyID0gMDsgcmlnaHRJdGVtID0gcmlnaHRbcl07ICsrcikge1xuICAgICAgICAgICAgICAgIGlmIChsZWZ0SXRlbVsndmFsdWUnXSA9PT0gcmlnaHRJdGVtWyd2YWx1ZSddKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRJdGVtWydtb3ZlZCddID0gcmlnaHRJdGVtWydpbmRleCddO1xuICAgICAgICAgICAgICAgICAgICByaWdodEl0ZW1bJ21vdmVkJ10gPSBsZWZ0SXRlbVsnaW5kZXgnXTtcbiAgICAgICAgICAgICAgICAgICAgcmlnaHQuc3BsaWNlKHIsIDEpOyAgICAgICAgIC8vIFRoaXMgaXRlbSBpcyBtYXJrZWQgYXMgbW92ZWQ7IHNvIHJlbW92ZSBpdCBmcm9tIHJpZ2h0IGxpc3RcbiAgICAgICAgICAgICAgICAgICAgZmFpbGVkQ29tcGFyZXMgPSByID0gMDsgICAgIC8vIFJlc2V0IGZhaWxlZCBjb21wYXJlcyBjb3VudCBiZWNhdXNlIHdlJ3JlIGNoZWNraW5nIGZvciBjb25zZWN1dGl2ZSBmYWlsdXJlc1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmYWlsZWRDb21wYXJlcyArPSByO1xuICAgICAgICB9XG4gICAgfVxufTtcblxua28udXRpbHMuY29tcGFyZUFycmF5cyA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHN0YXR1c05vdEluT2xkID0gJ2FkZGVkJywgc3RhdHVzTm90SW5OZXcgPSAnZGVsZXRlZCc7XG5cbiAgICAvLyBTaW1wbGUgY2FsY3VsYXRpb24gYmFzZWQgb24gTGV2ZW5zaHRlaW4gZGlzdGFuY2UuXG4gICAgZnVuY3Rpb24gY29tcGFyZUFycmF5cyhvbGRBcnJheSwgbmV3QXJyYXksIG9wdGlvbnMpIHtcbiAgICAgICAgLy8gRm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHksIGlmIHRoZSB0aGlyZCBhcmcgaXMgYWN0dWFsbHkgYSBib29sLCBpbnRlcnByZXRcbiAgICAgICAgLy8gaXQgYXMgdGhlIG9sZCBwYXJhbWV0ZXIgJ2RvbnRMaW1pdE1vdmVzJy4gTmV3ZXIgY29kZSBzaG91bGQgdXNlIHsgZG9udExpbWl0TW92ZXM6IHRydWUgfS5cbiAgICAgICAgb3B0aW9ucyA9ICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Jvb2xlYW4nKSA/IHsgJ2RvbnRMaW1pdE1vdmVzJzogb3B0aW9ucyB9IDogKG9wdGlvbnMgfHwge30pO1xuICAgICAgICBvbGRBcnJheSA9IG9sZEFycmF5IHx8IFtdO1xuICAgICAgICBuZXdBcnJheSA9IG5ld0FycmF5IHx8IFtdO1xuXG4gICAgICAgIGlmIChvbGRBcnJheS5sZW5ndGggPD0gbmV3QXJyYXkubGVuZ3RoKVxuICAgICAgICAgICAgcmV0dXJuIGNvbXBhcmVTbWFsbEFycmF5VG9CaWdBcnJheShvbGRBcnJheSwgbmV3QXJyYXksIHN0YXR1c05vdEluT2xkLCBzdGF0dXNOb3RJbk5ldywgb3B0aW9ucyk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiBjb21wYXJlU21hbGxBcnJheVRvQmlnQXJyYXkobmV3QXJyYXksIG9sZEFycmF5LCBzdGF0dXNOb3RJbk5ldywgc3RhdHVzTm90SW5PbGQsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbXBhcmVTbWFsbEFycmF5VG9CaWdBcnJheShzbWxBcnJheSwgYmlnQXJyYXksIHN0YXR1c05vdEluU21sLCBzdGF0dXNOb3RJbkJpZywgb3B0aW9ucykge1xuICAgICAgICB2YXIgbXlNaW4gPSBNYXRoLm1pbixcbiAgICAgICAgICAgIG15TWF4ID0gTWF0aC5tYXgsXG4gICAgICAgICAgICBlZGl0RGlzdGFuY2VNYXRyaXggPSBbXSxcbiAgICAgICAgICAgIHNtbEluZGV4LCBzbWxJbmRleE1heCA9IHNtbEFycmF5Lmxlbmd0aCxcbiAgICAgICAgICAgIGJpZ0luZGV4LCBiaWdJbmRleE1heCA9IGJpZ0FycmF5Lmxlbmd0aCxcbiAgICAgICAgICAgIGNvbXBhcmVSYW5nZSA9IChiaWdJbmRleE1heCAtIHNtbEluZGV4TWF4KSB8fCAxLFxuICAgICAgICAgICAgbWF4RGlzdGFuY2UgPSBzbWxJbmRleE1heCArIGJpZ0luZGV4TWF4ICsgMSxcbiAgICAgICAgICAgIHRoaXNSb3csIGxhc3RSb3csXG4gICAgICAgICAgICBiaWdJbmRleE1heEZvclJvdywgYmlnSW5kZXhNaW5Gb3JSb3c7XG5cbiAgICAgICAgZm9yIChzbWxJbmRleCA9IDA7IHNtbEluZGV4IDw9IHNtbEluZGV4TWF4OyBzbWxJbmRleCsrKSB7XG4gICAgICAgICAgICBsYXN0Um93ID0gdGhpc1JvdztcbiAgICAgICAgICAgIGVkaXREaXN0YW5jZU1hdHJpeC5wdXNoKHRoaXNSb3cgPSBbXSk7XG4gICAgICAgICAgICBiaWdJbmRleE1heEZvclJvdyA9IG15TWluKGJpZ0luZGV4TWF4LCBzbWxJbmRleCArIGNvbXBhcmVSYW5nZSk7XG4gICAgICAgICAgICBiaWdJbmRleE1pbkZvclJvdyA9IG15TWF4KDAsIHNtbEluZGV4IC0gMSk7XG4gICAgICAgICAgICBmb3IgKGJpZ0luZGV4ID0gYmlnSW5kZXhNaW5Gb3JSb3c7IGJpZ0luZGV4IDw9IGJpZ0luZGV4TWF4Rm9yUm93OyBiaWdJbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFiaWdJbmRleClcbiAgICAgICAgICAgICAgICAgICAgdGhpc1Jvd1tiaWdJbmRleF0gPSBzbWxJbmRleCArIDE7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoIXNtbEluZGV4KSAgLy8gVG9wIHJvdyAtIHRyYW5zZm9ybSBlbXB0eSBhcnJheSBpbnRvIG5ldyBhcnJheSB2aWEgYWRkaXRpb25zXG4gICAgICAgICAgICAgICAgICAgIHRoaXNSb3dbYmlnSW5kZXhdID0gYmlnSW5kZXggKyAxO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHNtbEFycmF5W3NtbEluZGV4IC0gMV0gPT09IGJpZ0FycmF5W2JpZ0luZGV4IC0gMV0pXG4gICAgICAgICAgICAgICAgICAgIHRoaXNSb3dbYmlnSW5kZXhdID0gbGFzdFJvd1tiaWdJbmRleCAtIDFdOyAgICAgICAgICAgICAgICAgIC8vIGNvcHkgdmFsdWUgKG5vIGVkaXQpXG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBub3J0aERpc3RhbmNlID0gbGFzdFJvd1tiaWdJbmRleF0gfHwgbWF4RGlzdGFuY2U7ICAgICAgIC8vIG5vdCBpbiBiaWcgKGRlbGV0aW9uKVxuICAgICAgICAgICAgICAgICAgICB2YXIgd2VzdERpc3RhbmNlID0gdGhpc1Jvd1tiaWdJbmRleCAtIDFdIHx8IG1heERpc3RhbmNlOyAgICAvLyBub3QgaW4gc21hbGwgKGFkZGl0aW9uKVxuICAgICAgICAgICAgICAgICAgICB0aGlzUm93W2JpZ0luZGV4XSA9IG15TWluKG5vcnRoRGlzdGFuY2UsIHdlc3REaXN0YW5jZSkgKyAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBlZGl0U2NyaXB0ID0gW10sIG1lTWludXNPbmUsIG5vdEluU21sID0gW10sIG5vdEluQmlnID0gW107XG4gICAgICAgIGZvciAoc21sSW5kZXggPSBzbWxJbmRleE1heCwgYmlnSW5kZXggPSBiaWdJbmRleE1heDsgc21sSW5kZXggfHwgYmlnSW5kZXg7KSB7XG4gICAgICAgICAgICBtZU1pbnVzT25lID0gZWRpdERpc3RhbmNlTWF0cml4W3NtbEluZGV4XVtiaWdJbmRleF0gLSAxO1xuICAgICAgICAgICAgaWYgKGJpZ0luZGV4ICYmIG1lTWludXNPbmUgPT09IGVkaXREaXN0YW5jZU1hdHJpeFtzbWxJbmRleF1bYmlnSW5kZXgtMV0pIHtcbiAgICAgICAgICAgICAgICBub3RJblNtbC5wdXNoKGVkaXRTY3JpcHRbZWRpdFNjcmlwdC5sZW5ndGhdID0geyAgICAgLy8gYWRkZWRcbiAgICAgICAgICAgICAgICAgICAgJ3N0YXR1cyc6IHN0YXR1c05vdEluU21sLFxuICAgICAgICAgICAgICAgICAgICAndmFsdWUnOiBiaWdBcnJheVstLWJpZ0luZGV4XSxcbiAgICAgICAgICAgICAgICAgICAgJ2luZGV4JzogYmlnSW5kZXggfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNtbEluZGV4ICYmIG1lTWludXNPbmUgPT09IGVkaXREaXN0YW5jZU1hdHJpeFtzbWxJbmRleCAtIDFdW2JpZ0luZGV4XSkge1xuICAgICAgICAgICAgICAgIG5vdEluQmlnLnB1c2goZWRpdFNjcmlwdFtlZGl0U2NyaXB0Lmxlbmd0aF0gPSB7ICAgICAvLyBkZWxldGVkXG4gICAgICAgICAgICAgICAgICAgICdzdGF0dXMnOiBzdGF0dXNOb3RJbkJpZyxcbiAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlJzogc21sQXJyYXlbLS1zbWxJbmRleF0sXG4gICAgICAgICAgICAgICAgICAgICdpbmRleCc6IHNtbEluZGV4IH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAtLWJpZ0luZGV4O1xuICAgICAgICAgICAgICAgIC0tc21sSW5kZXg7XG4gICAgICAgICAgICAgICAgaWYgKCFvcHRpb25zWydzcGFyc2UnXSkge1xuICAgICAgICAgICAgICAgICAgICBlZGl0U2NyaXB0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0YXR1cyc6IFwicmV0YWluZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICd2YWx1ZSc6IGJpZ0FycmF5W2JpZ0luZGV4XSB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXQgYSBsaW1pdCBvbiB0aGUgbnVtYmVyIG9mIGNvbnNlY3V0aXZlIG5vbi1tYXRjaGluZyBjb21wYXJpc29uczsgaGF2aW5nIGl0IGEgbXVsdGlwbGUgb2ZcbiAgICAgICAgLy8gc21sSW5kZXhNYXgga2VlcHMgdGhlIHRpbWUgY29tcGxleGl0eSBvZiB0aGlzIGFsZ29yaXRobSBsaW5lYXIuXG4gICAgICAgIGtvLnV0aWxzLmZpbmRNb3Zlc0luQXJyYXlDb21wYXJpc29uKG5vdEluU21sLCBub3RJbkJpZywgc21sSW5kZXhNYXggKiAxMCk7XG5cbiAgICAgICAgcmV0dXJuIGVkaXRTY3JpcHQucmV2ZXJzZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBjb21wYXJlQXJyYXlzO1xufSkoKTtcblxua28uZXhwb3J0U3ltYm9sKCd1dGlscy5jb21wYXJlQXJyYXlzJywga28udXRpbHMuY29tcGFyZUFycmF5cyk7XG4oZnVuY3Rpb24gKCkge1xuICAgIC8vIE9iamVjdGl2ZTpcbiAgICAvLyAqIEdpdmVuIGFuIGlucHV0IGFycmF5LCBhIGNvbnRhaW5lciBET00gbm9kZSwgYW5kIGEgZnVuY3Rpb24gZnJvbSBhcnJheSBlbGVtZW50cyB0byBhcnJheXMgb2YgRE9NIG5vZGVzLFxuICAgIC8vICAgbWFwIHRoZSBhcnJheSBlbGVtZW50cyB0byBhcnJheXMgb2YgRE9NIG5vZGVzLCBjb25jYXRlbmF0ZSB0b2dldGhlciBhbGwgdGhlc2UgYXJyYXlzLCBhbmQgdXNlIHRoZW0gdG8gcG9wdWxhdGUgdGhlIGNvbnRhaW5lciBET00gbm9kZVxuICAgIC8vICogTmV4dCB0aW1lIHdlJ3JlIGdpdmVuIHRoZSBzYW1lIGNvbWJpbmF0aW9uIG9mIHRoaW5ncyAod2l0aCB0aGUgYXJyYXkgcG9zc2libHkgaGF2aW5nIG11dGF0ZWQpLCB1cGRhdGUgdGhlIGNvbnRhaW5lciBET00gbm9kZVxuICAgIC8vICAgc28gdGhhdCBpdHMgY2hpbGRyZW4gaXMgYWdhaW4gdGhlIGNvbmNhdGVuYXRpb24gb2YgdGhlIG1hcHBpbmdzIG9mIHRoZSBhcnJheSBlbGVtZW50cywgYnV0IGRvbid0IHJlLW1hcCBhbnkgYXJyYXkgZWxlbWVudHMgdGhhdCB3ZVxuICAgIC8vICAgcHJldmlvdXNseSBtYXBwZWQgLSByZXRhaW4gdGhvc2Ugbm9kZXMsIGFuZCBqdXN0IGluc2VydC9kZWxldGUgb3RoZXIgb25lc1xuXG4gICAgLy8gXCJjYWxsYmFja0FmdGVyQWRkaW5nTm9kZXNcIiB3aWxsIGJlIGludm9rZWQgYWZ0ZXIgYW55IFwibWFwcGluZ1wiLWdlbmVyYXRlZCBub2RlcyBhcmUgaW5zZXJ0ZWQgaW50byB0aGUgY29udGFpbmVyIG5vZGVcbiAgICAvLyBZb3UgY2FuIHVzZSB0aGlzLCBmb3IgZXhhbXBsZSwgdG8gYWN0aXZhdGUgYmluZGluZ3Mgb24gdGhvc2Ugbm9kZXMuXG5cbiAgICBmdW5jdGlvbiBtYXBOb2RlQW5kUmVmcmVzaFdoZW5DaGFuZ2VkKGNvbnRhaW5lck5vZGUsIG1hcHBpbmcsIHZhbHVlVG9NYXAsIGNhbGxiYWNrQWZ0ZXJBZGRpbmdOb2RlcywgaW5kZXgpIHtcbiAgICAgICAgLy8gTWFwIHRoaXMgYXJyYXkgdmFsdWUgaW5zaWRlIGEgZGVwZW5kZW50T2JzZXJ2YWJsZSBzbyB3ZSByZS1tYXAgd2hlbiBhbnkgZGVwZW5kZW5jeSBjaGFuZ2VzXG4gICAgICAgIHZhciBtYXBwZWROb2RlcyA9IFtdO1xuICAgICAgICB2YXIgZGVwZW5kZW50T2JzZXJ2YWJsZSA9IGtvLmRlcGVuZGVudE9ic2VydmFibGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgbmV3TWFwcGVkTm9kZXMgPSBtYXBwaW5nKHZhbHVlVG9NYXAsIGluZGV4LCBrby51dGlscy5maXhVcENvbnRpbnVvdXNOb2RlQXJyYXkobWFwcGVkTm9kZXMsIGNvbnRhaW5lck5vZGUpKSB8fCBbXTtcblxuICAgICAgICAgICAgLy8gT24gc3Vic2VxdWVudCBldmFsdWF0aW9ucywganVzdCByZXBsYWNlIHRoZSBwcmV2aW91c2x5LWluc2VydGVkIERPTSBub2Rlc1xuICAgICAgICAgICAgaWYgKG1hcHBlZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBrby51dGlscy5yZXBsYWNlRG9tTm9kZXMobWFwcGVkTm9kZXMsIG5ld01hcHBlZE5vZGVzKTtcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2tBZnRlckFkZGluZ05vZGVzKVxuICAgICAgICAgICAgICAgICAgICBrby5kZXBlbmRlbmN5RGV0ZWN0aW9uLmlnbm9yZShjYWxsYmFja0FmdGVyQWRkaW5nTm9kZXMsIG51bGwsIFt2YWx1ZVRvTWFwLCBuZXdNYXBwZWROb2RlcywgaW5kZXhdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUmVwbGFjZSB0aGUgY29udGVudHMgb2YgdGhlIG1hcHBlZE5vZGVzIGFycmF5LCB0aGVyZWJ5IHVwZGF0aW5nIHRoZSByZWNvcmRcbiAgICAgICAgICAgIC8vIG9mIHdoaWNoIG5vZGVzIHdvdWxkIGJlIGRlbGV0ZWQgaWYgdmFsdWVUb01hcCB3YXMgaXRzZWxmIGxhdGVyIHJlbW92ZWRcbiAgICAgICAgICAgIG1hcHBlZE5vZGVzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICBrby51dGlscy5hcnJheVB1c2hBbGwobWFwcGVkTm9kZXMsIG5ld01hcHBlZE5vZGVzKTtcbiAgICAgICAgfSwgbnVsbCwgeyBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IGNvbnRhaW5lck5vZGUsIGRpc3Bvc2VXaGVuOiBmdW5jdGlvbigpIHsgcmV0dXJuICFrby51dGlscy5hbnlEb21Ob2RlSXNBdHRhY2hlZFRvRG9jdW1lbnQobWFwcGVkTm9kZXMpOyB9IH0pO1xuICAgICAgICByZXR1cm4geyBtYXBwZWROb2RlcyA6IG1hcHBlZE5vZGVzLCBkZXBlbmRlbnRPYnNlcnZhYmxlIDogKGRlcGVuZGVudE9ic2VydmFibGUuaXNBY3RpdmUoKSA/IGRlcGVuZGVudE9ic2VydmFibGUgOiB1bmRlZmluZWQpIH07XG4gICAgfVxuXG4gICAgdmFyIGxhc3RNYXBwaW5nUmVzdWx0RG9tRGF0YUtleSA9IGtvLnV0aWxzLmRvbURhdGEubmV4dEtleSgpO1xuXG4gICAga28udXRpbHMuc2V0RG9tTm9kZUNoaWxkcmVuRnJvbUFycmF5TWFwcGluZyA9IGZ1bmN0aW9uIChkb21Ob2RlLCBhcnJheSwgbWFwcGluZywgb3B0aW9ucywgY2FsbGJhY2tBZnRlckFkZGluZ05vZGVzKSB7XG4gICAgICAgIC8vIENvbXBhcmUgdGhlIHByb3ZpZGVkIGFycmF5IGFnYWluc3QgdGhlIHByZXZpb3VzIG9uZVxuICAgICAgICBhcnJheSA9IGFycmF5IHx8IFtdO1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgICAgdmFyIGlzRmlyc3RFeGVjdXRpb24gPSBrby51dGlscy5kb21EYXRhLmdldChkb21Ob2RlLCBsYXN0TWFwcGluZ1Jlc3VsdERvbURhdGFLZXkpID09PSB1bmRlZmluZWQ7XG4gICAgICAgIHZhciBsYXN0TWFwcGluZ1Jlc3VsdCA9IGtvLnV0aWxzLmRvbURhdGEuZ2V0KGRvbU5vZGUsIGxhc3RNYXBwaW5nUmVzdWx0RG9tRGF0YUtleSkgfHwgW107XG4gICAgICAgIHZhciBsYXN0QXJyYXkgPSBrby51dGlscy5hcnJheU1hcChsYXN0TWFwcGluZ1Jlc3VsdCwgZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHguYXJyYXlFbnRyeTsgfSk7XG4gICAgICAgIHZhciBlZGl0U2NyaXB0ID0ga28udXRpbHMuY29tcGFyZUFycmF5cyhsYXN0QXJyYXksIGFycmF5LCBvcHRpb25zWydkb250TGltaXRNb3ZlcyddKTtcblxuICAgICAgICAvLyBCdWlsZCB0aGUgbmV3IG1hcHBpbmcgcmVzdWx0XG4gICAgICAgIHZhciBuZXdNYXBwaW5nUmVzdWx0ID0gW107XG4gICAgICAgIHZhciBsYXN0TWFwcGluZ1Jlc3VsdEluZGV4ID0gMDtcbiAgICAgICAgdmFyIG5ld01hcHBpbmdSZXN1bHRJbmRleCA9IDA7XG5cbiAgICAgICAgdmFyIG5vZGVzVG9EZWxldGUgPSBbXTtcbiAgICAgICAgdmFyIGl0ZW1zVG9Qcm9jZXNzID0gW107XG4gICAgICAgIHZhciBpdGVtc0ZvckJlZm9yZVJlbW92ZUNhbGxiYWNrcyA9IFtdO1xuICAgICAgICB2YXIgaXRlbXNGb3JNb3ZlQ2FsbGJhY2tzID0gW107XG4gICAgICAgIHZhciBpdGVtc0ZvckFmdGVyQWRkQ2FsbGJhY2tzID0gW107XG4gICAgICAgIHZhciBtYXBEYXRhO1xuXG4gICAgICAgIGZ1bmN0aW9uIGl0ZW1Nb3ZlZE9yUmV0YWluZWQoZWRpdFNjcmlwdEluZGV4LCBvbGRQb3NpdGlvbikge1xuICAgICAgICAgICAgbWFwRGF0YSA9IGxhc3RNYXBwaW5nUmVzdWx0W29sZFBvc2l0aW9uXTtcbiAgICAgICAgICAgIGlmIChuZXdNYXBwaW5nUmVzdWx0SW5kZXggIT09IG9sZFBvc2l0aW9uKVxuICAgICAgICAgICAgICAgIGl0ZW1zRm9yTW92ZUNhbGxiYWNrc1tlZGl0U2NyaXB0SW5kZXhdID0gbWFwRGF0YTtcbiAgICAgICAgICAgIC8vIFNpbmNlIHVwZGF0aW5nIHRoZSBpbmRleCBtaWdodCBjaGFuZ2UgdGhlIG5vZGVzLCBkbyBzbyBiZWZvcmUgY2FsbGluZyBmaXhVcENvbnRpbnVvdXNOb2RlQXJyYXlcbiAgICAgICAgICAgIG1hcERhdGEuaW5kZXhPYnNlcnZhYmxlKG5ld01hcHBpbmdSZXN1bHRJbmRleCsrKTtcbiAgICAgICAgICAgIGtvLnV0aWxzLmZpeFVwQ29udGludW91c05vZGVBcnJheShtYXBEYXRhLm1hcHBlZE5vZGVzLCBkb21Ob2RlKTtcbiAgICAgICAgICAgIG5ld01hcHBpbmdSZXN1bHQucHVzaChtYXBEYXRhKTtcbiAgICAgICAgICAgIGl0ZW1zVG9Qcm9jZXNzLnB1c2gobWFwRGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjYWxsQ2FsbGJhY2soY2FsbGJhY2ssIGl0ZW1zKSB7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbiA9IGl0ZW1zLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbXNbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtvLnV0aWxzLmFycmF5Rm9yRWFjaChpdGVtc1tpXS5tYXBwZWROb2RlcywgZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG5vZGUsIGksIGl0ZW1zW2ldLmFycmF5RW50cnkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgZWRpdFNjcmlwdEl0ZW0sIG1vdmVkSW5kZXg7IGVkaXRTY3JpcHRJdGVtID0gZWRpdFNjcmlwdFtpXTsgaSsrKSB7XG4gICAgICAgICAgICBtb3ZlZEluZGV4ID0gZWRpdFNjcmlwdEl0ZW1bJ21vdmVkJ107XG4gICAgICAgICAgICBzd2l0Y2ggKGVkaXRTY3JpcHRJdGVtWydzdGF0dXMnXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJkZWxldGVkXCI6XG4gICAgICAgICAgICAgICAgICAgIGlmIChtb3ZlZEluZGV4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcERhdGEgPSBsYXN0TWFwcGluZ1Jlc3VsdFtsYXN0TWFwcGluZ1Jlc3VsdEluZGV4XTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3RvcCB0cmFja2luZyBjaGFuZ2VzIHRvIHRoZSBtYXBwaW5nIGZvciB0aGVzZSBub2Rlc1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hcERhdGEuZGVwZW5kZW50T2JzZXJ2YWJsZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBEYXRhLmRlcGVuZGVudE9ic2VydmFibGUuZGlzcG9zZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBRdWV1ZSB0aGVzZSBub2RlcyBmb3IgbGF0ZXIgcmVtb3ZhbFxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZXNUb0RlbGV0ZS5wdXNoLmFwcGx5KG5vZGVzVG9EZWxldGUsIGtvLnV0aWxzLmZpeFVwQ29udGludW91c05vZGVBcnJheShtYXBEYXRhLm1hcHBlZE5vZGVzLCBkb21Ob2RlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9uc1snYmVmb3JlUmVtb3ZlJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtc0ZvckJlZm9yZVJlbW92ZUNhbGxiYWNrc1tpXSA9IG1hcERhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXNUb1Byb2Nlc3MucHVzaChtYXBEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsYXN0TWFwcGluZ1Jlc3VsdEluZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSBcInJldGFpbmVkXCI6XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1Nb3ZlZE9yUmV0YWluZWQoaSwgbGFzdE1hcHBpbmdSZXN1bHRJbmRleCsrKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIFwiYWRkZWRcIjpcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1vdmVkSW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbU1vdmVkT3JSZXRhaW5lZChpLCBtb3ZlZEluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcERhdGEgPSB7IGFycmF5RW50cnk6IGVkaXRTY3JpcHRJdGVtWyd2YWx1ZSddLCBpbmRleE9ic2VydmFibGU6IGtvLm9ic2VydmFibGUobmV3TWFwcGluZ1Jlc3VsdEluZGV4KyspIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdNYXBwaW5nUmVzdWx0LnB1c2gobWFwRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtc1RvUHJvY2Vzcy5wdXNoKG1hcERhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0ZpcnN0RXhlY3V0aW9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zRm9yQWZ0ZXJBZGRDYWxsYmFja3NbaV0gPSBtYXBEYXRhO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2FsbCBiZWZvcmVNb3ZlIGZpcnN0IGJlZm9yZSBhbnkgY2hhbmdlcyBoYXZlIGJlZW4gbWFkZSB0byB0aGUgRE9NXG4gICAgICAgIGNhbGxDYWxsYmFjayhvcHRpb25zWydiZWZvcmVNb3ZlJ10sIGl0ZW1zRm9yTW92ZUNhbGxiYWNrcyk7XG5cbiAgICAgICAgLy8gTmV4dCByZW1vdmUgbm9kZXMgZm9yIGRlbGV0ZWQgaXRlbXMgKG9yIGp1c3QgY2xlYW4gaWYgdGhlcmUncyBhIGJlZm9yZVJlbW92ZSBjYWxsYmFjaylcbiAgICAgICAga28udXRpbHMuYXJyYXlGb3JFYWNoKG5vZGVzVG9EZWxldGUsIG9wdGlvbnNbJ2JlZm9yZVJlbW92ZSddID8ga28uY2xlYW5Ob2RlIDoga28ucmVtb3ZlTm9kZSk7XG5cbiAgICAgICAgLy8gTmV4dCBhZGQvcmVvcmRlciB0aGUgcmVtYWluaW5nIGl0ZW1zICh3aWxsIGluY2x1ZGUgZGVsZXRlZCBpdGVtcyBpZiB0aGVyZSdzIGEgYmVmb3JlUmVtb3ZlIGNhbGxiYWNrKVxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbmV4dE5vZGUgPSBrby52aXJ0dWFsRWxlbWVudHMuZmlyc3RDaGlsZChkb21Ob2RlKSwgbGFzdE5vZGUsIG5vZGU7IG1hcERhdGEgPSBpdGVtc1RvUHJvY2Vzc1tpXTsgaSsrKSB7XG4gICAgICAgICAgICAvLyBHZXQgbm9kZXMgZm9yIG5ld2x5IGFkZGVkIGl0ZW1zXG4gICAgICAgICAgICBpZiAoIW1hcERhdGEubWFwcGVkTm9kZXMpXG4gICAgICAgICAgICAgICAga28udXRpbHMuZXh0ZW5kKG1hcERhdGEsIG1hcE5vZGVBbmRSZWZyZXNoV2hlbkNoYW5nZWQoZG9tTm9kZSwgbWFwcGluZywgbWFwRGF0YS5hcnJheUVudHJ5LCBjYWxsYmFja0FmdGVyQWRkaW5nTm9kZXMsIG1hcERhdGEuaW5kZXhPYnNlcnZhYmxlKSk7XG5cbiAgICAgICAgICAgIC8vIFB1dCBub2RlcyBpbiB0aGUgcmlnaHQgcGxhY2UgaWYgdGhleSBhcmVuJ3QgdGhlcmUgYWxyZWFkeVxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IG5vZGUgPSBtYXBEYXRhLm1hcHBlZE5vZGVzW2pdOyBuZXh0Tm9kZSA9IG5vZGUubmV4dFNpYmxpbmcsIGxhc3ROb2RlID0gbm9kZSwgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUgIT09IG5leHROb2RlKVxuICAgICAgICAgICAgICAgICAgICBrby52aXJ0dWFsRWxlbWVudHMuaW5zZXJ0QWZ0ZXIoZG9tTm9kZSwgbm9kZSwgbGFzdE5vZGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBSdW4gdGhlIGNhbGxiYWNrcyBmb3IgbmV3bHkgYWRkZWQgbm9kZXMgKGZvciBleGFtcGxlLCB0byBhcHBseSBiaW5kaW5ncywgZXRjLilcbiAgICAgICAgICAgIGlmICghbWFwRGF0YS5pbml0aWFsaXplZCAmJiBjYWxsYmFja0FmdGVyQWRkaW5nTm9kZXMpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFja0FmdGVyQWRkaW5nTm9kZXMobWFwRGF0YS5hcnJheUVudHJ5LCBtYXBEYXRhLm1hcHBlZE5vZGVzLCBtYXBEYXRhLmluZGV4T2JzZXJ2YWJsZSk7XG4gICAgICAgICAgICAgICAgbWFwRGF0YS5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGVyZSdzIGEgYmVmb3JlUmVtb3ZlIGNhbGxiYWNrLCBjYWxsIGl0IGFmdGVyIHJlb3JkZXJpbmcuXG4gICAgICAgIC8vIE5vdGUgdGhhdCB3ZSBhc3N1bWUgdGhhdCB0aGUgYmVmb3JlUmVtb3ZlIGNhbGxiYWNrIHdpbGwgdXN1YWxseSBiZSB1c2VkIHRvIHJlbW92ZSB0aGUgbm9kZXMgdXNpbmdcbiAgICAgICAgLy8gc29tZSBzb3J0IG9mIGFuaW1hdGlvbiwgd2hpY2ggaXMgd2h5IHdlIGZpcnN0IHJlb3JkZXIgdGhlIG5vZGVzIHRoYXQgd2lsbCBiZSByZW1vdmVkLiBJZiB0aGVcbiAgICAgICAgLy8gY2FsbGJhY2sgaW5zdGVhZCByZW1vdmVzIHRoZSBub2RlcyByaWdodCBhd2F5LCBpdCB3b3VsZCBiZSBtb3JlIGVmZmljaWVudCB0byBza2lwIHJlb3JkZXJpbmcgdGhlbS5cbiAgICAgICAgLy8gUGVyaGFwcyB3ZSdsbCBtYWtlIHRoYXQgY2hhbmdlIGluIHRoZSBmdXR1cmUgaWYgdGhpcyBzY2VuYXJpbyBiZWNvbWVzIG1vcmUgY29tbW9uLlxuICAgICAgICBjYWxsQ2FsbGJhY2sob3B0aW9uc1snYmVmb3JlUmVtb3ZlJ10sIGl0ZW1zRm9yQmVmb3JlUmVtb3ZlQ2FsbGJhY2tzKTtcblxuICAgICAgICAvLyBGaW5hbGx5IGNhbGwgYWZ0ZXJNb3ZlIGFuZCBhZnRlckFkZCBjYWxsYmFja3NcbiAgICAgICAgY2FsbENhbGxiYWNrKG9wdGlvbnNbJ2FmdGVyTW92ZSddLCBpdGVtc0Zvck1vdmVDYWxsYmFja3MpO1xuICAgICAgICBjYWxsQ2FsbGJhY2sob3B0aW9uc1snYWZ0ZXJBZGQnXSwgaXRlbXNGb3JBZnRlckFkZENhbGxiYWNrcyk7XG5cbiAgICAgICAgLy8gU3RvcmUgYSBjb3B5IG9mIHRoZSBhcnJheSBpdGVtcyB3ZSBqdXN0IGNvbnNpZGVyZWQgc28gd2UgY2FuIGRpZmZlcmVuY2UgaXQgbmV4dCB0aW1lXG4gICAgICAgIGtvLnV0aWxzLmRvbURhdGEuc2V0KGRvbU5vZGUsIGxhc3RNYXBwaW5nUmVzdWx0RG9tRGF0YUtleSwgbmV3TWFwcGluZ1Jlc3VsdCk7XG4gICAgfVxufSkoKTtcblxua28uZXhwb3J0U3ltYm9sKCd1dGlscy5zZXREb21Ob2RlQ2hpbGRyZW5Gcm9tQXJyYXlNYXBwaW5nJywga28udXRpbHMuc2V0RG9tTm9kZUNoaWxkcmVuRnJvbUFycmF5TWFwcGluZyk7XG5rby5uYXRpdmVUZW1wbGF0ZUVuZ2luZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzWydhbGxvd1RlbXBsYXRlUmV3cml0aW5nJ10gPSBmYWxzZTtcbn1cblxua28ubmF0aXZlVGVtcGxhdGVFbmdpbmUucHJvdG90eXBlID0gbmV3IGtvLnRlbXBsYXRlRW5naW5lKCk7XG5rby5uYXRpdmVUZW1wbGF0ZUVuZ2luZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBrby5uYXRpdmVUZW1wbGF0ZUVuZ2luZTtcbmtvLm5hdGl2ZVRlbXBsYXRlRW5naW5lLnByb3RvdHlwZVsncmVuZGVyVGVtcGxhdGVTb3VyY2UnXSA9IGZ1bmN0aW9uICh0ZW1wbGF0ZVNvdXJjZSwgYmluZGluZ0NvbnRleHQsIG9wdGlvbnMpIHtcbiAgICB2YXIgdXNlTm9kZXNJZkF2YWlsYWJsZSA9ICEoa28udXRpbHMuaWVWZXJzaW9uIDwgOSksIC8vIElFPDkgY2xvbmVOb2RlIGRvZXNuJ3Qgd29yayBwcm9wZXJseVxuICAgICAgICB0ZW1wbGF0ZU5vZGVzRnVuYyA9IHVzZU5vZGVzSWZBdmFpbGFibGUgPyB0ZW1wbGF0ZVNvdXJjZVsnbm9kZXMnXSA6IG51bGwsXG4gICAgICAgIHRlbXBsYXRlTm9kZXMgPSB0ZW1wbGF0ZU5vZGVzRnVuYyA/IHRlbXBsYXRlU291cmNlWydub2RlcyddKCkgOiBudWxsO1xuXG4gICAgaWYgKHRlbXBsYXRlTm9kZXMpIHtcbiAgICAgICAgcmV0dXJuIGtvLnV0aWxzLm1ha2VBcnJheSh0ZW1wbGF0ZU5vZGVzLmNsb25lTm9kZSh0cnVlKS5jaGlsZE5vZGVzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgdGVtcGxhdGVUZXh0ID0gdGVtcGxhdGVTb3VyY2VbJ3RleHQnXSgpO1xuICAgICAgICByZXR1cm4ga28udXRpbHMucGFyc2VIdG1sRnJhZ21lbnQodGVtcGxhdGVUZXh0KTtcbiAgICB9XG59O1xuXG5rby5uYXRpdmVUZW1wbGF0ZUVuZ2luZS5pbnN0YW5jZSA9IG5ldyBrby5uYXRpdmVUZW1wbGF0ZUVuZ2luZSgpO1xua28uc2V0VGVtcGxhdGVFbmdpbmUoa28ubmF0aXZlVGVtcGxhdGVFbmdpbmUuaW5zdGFuY2UpO1xuXG5rby5leHBvcnRTeW1ib2woJ25hdGl2ZVRlbXBsYXRlRW5naW5lJywga28ubmF0aXZlVGVtcGxhdGVFbmdpbmUpO1xuKGZ1bmN0aW9uKCkge1xuICAgIGtvLmpxdWVyeVRtcGxUZW1wbGF0ZUVuZ2luZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gRGV0ZWN0IHdoaWNoIHZlcnNpb24gb2YganF1ZXJ5LXRtcGwgeW91J3JlIHVzaW5nLiBVbmZvcnR1bmF0ZWx5IGpxdWVyeS10bXBsXG4gICAgICAgIC8vIGRvZXNuJ3QgZXhwb3NlIGEgdmVyc2lvbiBudW1iZXIsIHNvIHdlIGhhdmUgdG8gaW5mZXIgaXQuXG4gICAgICAgIC8vIE5vdGUgdGhhdCBhcyBvZiBLbm9ja291dCAxLjMsIHdlIG9ubHkgc3VwcG9ydCBqUXVlcnkudG1wbCAxLjAuMHByZSBhbmQgbGF0ZXIsXG4gICAgICAgIC8vIHdoaWNoIEtPIGludGVybmFsbHkgcmVmZXJzIHRvIGFzIHZlcnNpb24gXCIyXCIsIHNvIG9sZGVyIHZlcnNpb25zIGFyZSBubyBsb25nZXIgZGV0ZWN0ZWQuXG4gICAgICAgIHZhciBqUXVlcnlUbXBsVmVyc2lvbiA9IHRoaXMualF1ZXJ5VG1wbFZlcnNpb24gPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoIWpRdWVyeUluc3RhbmNlIHx8ICEoalF1ZXJ5SW5zdGFuY2VbJ3RtcGwnXSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAvLyBTaW5jZSBpdCBleHBvc2VzIG5vIG9mZmljaWFsIHZlcnNpb24gbnVtYmVyLCB3ZSB1c2Ugb3VyIG93biBudW1iZXJpbmcgc3lzdGVtLiBUbyBiZSB1cGRhdGVkIGFzIGpxdWVyeS10bXBsIGV2b2x2ZXMuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmIChqUXVlcnlJbnN0YW5jZVsndG1wbCddWyd0YWcnXVsndG1wbCddWydvcGVuJ10udG9TdHJpbmcoKS5pbmRleE9mKCdfXycpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2luY2UgMS4wLjBwcmUsIGN1c3RvbSB0YWdzIHNob3VsZCBhcHBlbmQgbWFya3VwIHRvIGFuIGFycmF5IGNhbGxlZCBcIl9fXCJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDI7IC8vIEZpbmFsIHZlcnNpb24gb2YganF1ZXJ5LnRtcGxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoKGV4KSB7IC8qIEFwcGFyZW50bHkgbm90IHRoZSB2ZXJzaW9uIHdlIHdlcmUgbG9va2luZyBmb3IgKi8gfVxuXG4gICAgICAgICAgICByZXR1cm4gMTsgLy8gQW55IG9sZGVyIHZlcnNpb24gdGhhdCB3ZSBkb24ndCBzdXBwb3J0XG4gICAgICAgIH0pKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gZW5zdXJlSGFzUmVmZXJlbmNlZEpRdWVyeVRlbXBsYXRlcygpIHtcbiAgICAgICAgICAgIGlmIChqUXVlcnlUbXBsVmVyc2lvbiA8IDIpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiWW91ciB2ZXJzaW9uIG9mIGpRdWVyeS50bXBsIGlzIHRvbyBvbGQuIFBsZWFzZSB1cGdyYWRlIHRvIGpRdWVyeS50bXBsIDEuMC4wcHJlIG9yIGxhdGVyLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGV4ZWN1dGVUZW1wbGF0ZShjb21waWxlZFRlbXBsYXRlLCBkYXRhLCBqUXVlcnlUZW1wbGF0ZU9wdGlvbnMpIHtcbiAgICAgICAgICAgIHJldHVybiBqUXVlcnlJbnN0YW5jZVsndG1wbCddKGNvbXBpbGVkVGVtcGxhdGUsIGRhdGEsIGpRdWVyeVRlbXBsYXRlT3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzWydyZW5kZXJUZW1wbGF0ZVNvdXJjZSddID0gZnVuY3Rpb24odGVtcGxhdGVTb3VyY2UsIGJpbmRpbmdDb250ZXh0LCBvcHRpb25zKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgICAgICAgIGVuc3VyZUhhc1JlZmVyZW5jZWRKUXVlcnlUZW1wbGF0ZXMoKTtcblxuICAgICAgICAgICAgLy8gRW5zdXJlIHdlIGhhdmUgc3RvcmVkIGEgcHJlY29tcGlsZWQgdmVyc2lvbiBvZiB0aGlzIHRlbXBsYXRlIChkb24ndCB3YW50IHRvIHJlcGFyc2Ugb24gZXZlcnkgcmVuZGVyKVxuICAgICAgICAgICAgdmFyIHByZWNvbXBpbGVkID0gdGVtcGxhdGVTb3VyY2VbJ2RhdGEnXSgncHJlY29tcGlsZWQnKTtcbiAgICAgICAgICAgIGlmICghcHJlY29tcGlsZWQpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGVUZXh0ID0gdGVtcGxhdGVTb3VyY2VbJ3RleHQnXSgpIHx8IFwiXCI7XG4gICAgICAgICAgICAgICAgLy8gV3JhcCBpbiBcIndpdGgoJHdoYXRldmVyLmtvQmluZGluZ0NvbnRleHQpIHsgLi4uIH1cIlxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVGV4dCA9IFwie3trb193aXRoICRpdGVtLmtvQmluZGluZ0NvbnRleHR9fVwiICsgdGVtcGxhdGVUZXh0ICsgXCJ7ey9rb193aXRofX1cIjtcblxuICAgICAgICAgICAgICAgIHByZWNvbXBpbGVkID0galF1ZXJ5SW5zdGFuY2VbJ3RlbXBsYXRlJ10obnVsbCwgdGVtcGxhdGVUZXh0KTtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVNvdXJjZVsnZGF0YSddKCdwcmVjb21waWxlZCcsIHByZWNvbXBpbGVkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRhdGEgPSBbYmluZGluZ0NvbnRleHRbJyRkYXRhJ11dOyAvLyBQcmV3cmFwIHRoZSBkYXRhIGluIGFuIGFycmF5IHRvIHN0b3AganF1ZXJ5LnRtcGwgZnJvbSB0cnlpbmcgdG8gdW53cmFwIGFueSBhcnJheXNcbiAgICAgICAgICAgIHZhciBqUXVlcnlUZW1wbGF0ZU9wdGlvbnMgPSBqUXVlcnlJbnN0YW5jZVsnZXh0ZW5kJ10oeyAna29CaW5kaW5nQ29udGV4dCc6IGJpbmRpbmdDb250ZXh0IH0sIG9wdGlvbnNbJ3RlbXBsYXRlT3B0aW9ucyddKTtcblxuICAgICAgICAgICAgdmFyIHJlc3VsdE5vZGVzID0gZXhlY3V0ZVRlbXBsYXRlKHByZWNvbXBpbGVkLCBkYXRhLCBqUXVlcnlUZW1wbGF0ZU9wdGlvbnMpO1xuICAgICAgICAgICAgcmVzdWx0Tm9kZXNbJ2FwcGVuZFRvJ10oZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSk7IC8vIFVzaW5nIFwiYXBwZW5kVG9cIiBmb3JjZXMgalF1ZXJ5L2pRdWVyeS50bXBsIHRvIHBlcmZvcm0gbmVjZXNzYXJ5IGNsZWFudXAgd29ya1xuXG4gICAgICAgICAgICBqUXVlcnlJbnN0YW5jZVsnZnJhZ21lbnRzJ10gPSB7fTsgLy8gQ2xlYXIgalF1ZXJ5J3MgZnJhZ21lbnQgY2FjaGUgdG8gYXZvaWQgYSBtZW1vcnkgbGVhayBhZnRlciBhIGxhcmdlIG51bWJlciBvZiB0ZW1wbGF0ZSByZW5kZXJzXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0Tm9kZXM7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpc1snY3JlYXRlSmF2YVNjcmlwdEV2YWx1YXRvckJsb2NrJ10gPSBmdW5jdGlvbihzY3JpcHQpIHtcbiAgICAgICAgICAgIHJldHVybiBcInt7a29fY29kZSAoKGZ1bmN0aW9uKCkgeyByZXR1cm4gXCIgKyBzY3JpcHQgKyBcIiB9KSgpKSB9fVwiO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXNbJ2FkZFRlbXBsYXRlJ10gPSBmdW5jdGlvbih0ZW1wbGF0ZU5hbWUsIHRlbXBsYXRlTWFya3VwKSB7XG4gICAgICAgICAgICBkb2N1bWVudC53cml0ZShcIjxzY3JpcHQgdHlwZT0ndGV4dC9odG1sJyBpZD0nXCIgKyB0ZW1wbGF0ZU5hbWUgKyBcIic+XCIgKyB0ZW1wbGF0ZU1hcmt1cCArIFwiPFwiICsgXCIvc2NyaXB0PlwiKTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoalF1ZXJ5VG1wbFZlcnNpb24gPiAwKSB7XG4gICAgICAgICAgICBqUXVlcnlJbnN0YW5jZVsndG1wbCddWyd0YWcnXVsna29fY29kZSddID0ge1xuICAgICAgICAgICAgICAgIG9wZW46IFwiX18ucHVzaCgkMSB8fCAnJyk7XCJcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBqUXVlcnlJbnN0YW5jZVsndG1wbCddWyd0YWcnXVsna29fd2l0aCddID0ge1xuICAgICAgICAgICAgICAgIG9wZW46IFwid2l0aCgkMSkge1wiLFxuICAgICAgICAgICAgICAgIGNsb3NlOiBcIn0gXCJcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAga28uanF1ZXJ5VG1wbFRlbXBsYXRlRW5naW5lLnByb3RvdHlwZSA9IG5ldyBrby50ZW1wbGF0ZUVuZ2luZSgpO1xuICAgIGtvLmpxdWVyeVRtcGxUZW1wbGF0ZUVuZ2luZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBrby5qcXVlcnlUbXBsVGVtcGxhdGVFbmdpbmU7XG5cbiAgICAvLyBVc2UgdGhpcyBvbmUgYnkgZGVmYXVsdCAqb25seSBpZiBqcXVlcnkudG1wbCBpcyByZWZlcmVuY2VkKlxuICAgIHZhciBqcXVlcnlUbXBsVGVtcGxhdGVFbmdpbmVJbnN0YW5jZSA9IG5ldyBrby5qcXVlcnlUbXBsVGVtcGxhdGVFbmdpbmUoKTtcbiAgICBpZiAoanF1ZXJ5VG1wbFRlbXBsYXRlRW5naW5lSW5zdGFuY2UualF1ZXJ5VG1wbFZlcnNpb24gPiAwKVxuICAgICAgICBrby5zZXRUZW1wbGF0ZUVuZ2luZShqcXVlcnlUbXBsVGVtcGxhdGVFbmdpbmVJbnN0YW5jZSk7XG5cbiAgICBrby5leHBvcnRTeW1ib2woJ2pxdWVyeVRtcGxUZW1wbGF0ZUVuZ2luZScsIGtvLmpxdWVyeVRtcGxUZW1wbGF0ZUVuZ2luZSk7XG59KSgpO1xufSkpO1xufSgpKTtcbn0pKCk7XG4iXX0=
