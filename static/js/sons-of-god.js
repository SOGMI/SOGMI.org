/*!
 * Webflow: Front-end site library
 * @license MIT
 * Inline scripts may access the api using an async handler:
 *   var Webflow = Webflow || [];
 *   Webflow.push(readyFunction);
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 85);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Webflow: Core site library
 */

var Webflow = {};
var modules = {};
var primary = [];
var secondary = window.Webflow || [];
var $ = window.jQuery;
var $win = $(window);
var $doc = $(document);
var isFunction = $.isFunction;
var _ = Webflow._ = __webpack_require__(87);
var tram = __webpack_require__(48) && $.tram;
var domready = false;
var destroyed = false;
tram.config.hideBackface = false;
tram.config.keepInherited = true;

/**
 * Webflow.define - Define a named module
 * @param  {string} name
 * @param  {function} factory
 * @param  {object} options
 * @return {object}
 */
Webflow.define = function (name, factory, options) {
  if (modules[name]) {
    unbindModule(modules[name]);
  }
  var instance = modules[name] = factory($, _, options) || {};
  bindModule(instance);
  return instance;
};

/**
 * Webflow.require - Require a named module
 * @param  {string} name
 * @return {object}
 */
Webflow.require = function (name) {
  return modules[name];
};

function bindModule(module) {
  // If running in Webflow app, subscribe to design/preview events
  if (Webflow.env()) {
    isFunction(module.design) && $win.on('__wf_design', module.design);
    isFunction(module.preview) && $win.on('__wf_preview', module.preview);
  }
  // Subscribe to front-end destroy event
  isFunction(module.destroy) && $win.on('__wf_destroy', module.destroy);
  // Look for ready method on module
  if (module.ready && isFunction(module.ready)) {
    addReady(module);
  }
}

function addReady(module) {
  // If domready has already happened, run ready method
  if (domready) {
    module.ready();
    return;
  }
  // Otherwise add ready method to the primary queue (only once)
  if (_.contains(primary, module.ready)) {
    return;
  }
  primary.push(module.ready);
}

function unbindModule(module) {
  // Unsubscribe module from window events
  isFunction(module.design) && $win.off('__wf_design', module.design);
  isFunction(module.preview) && $win.off('__wf_preview', module.preview);
  isFunction(module.destroy) && $win.off('__wf_destroy', module.destroy);
  // Remove ready method from primary queue
  if (module.ready && isFunction(module.ready)) {
    removeReady(module);
  }
}

function removeReady(module) {
  primary = _.filter(primary, function (readyFn) {
    return readyFn !== module.ready;
  });
}

/**
 * Webflow.push - Add a ready handler into secondary queue
 * @param {function} ready  Callback to invoke on domready
 */
Webflow.push = function (ready) {
  // If domready has already happened, invoke handler
  if (domready) {
    isFunction(ready) && ready();
    return;
  }
  // Otherwise push into secondary queue
  secondary.push(ready);
};

/**
 * Webflow.env - Get the state of the Webflow app
 * @param {string} mode [optional]
 * @return {boolean}
 */
Webflow.env = function (mode) {
  var designFlag = window.__wf_design;
  var inApp = typeof designFlag !== 'undefined';
  if (!mode) {
    return inApp;
  }
  if (mode === 'design') {
    return inApp && designFlag;
  }
  if (mode === 'preview') {
    return inApp && !designFlag;
  }
  if (mode === 'slug') {
    return inApp && window.__wf_slug;
  }
  if (mode === 'editor') {
    return window.WebflowEditor;
  }
  if (mode === 'test') {
    return false || window.__wf_test;
  }
  if (mode === 'frame') {
    return window !== window.top;
  }
};

// Feature detects + browser sniffs  à² _à² 
var userAgent = navigator.userAgent.toLowerCase();
var touch = Webflow.env.touch = 'ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch;
var chrome = Webflow.env.chrome = /chrome/.test(userAgent) && /Google/.test(navigator.vendor) && parseInt(userAgent.match(/chrome\/(\d+)\./)[1], 10);
var ios = Webflow.env.ios = /(ipod|iphone|ipad)/.test(userAgent);
Webflow.env.safari = /safari/.test(userAgent) && !chrome && !ios;

// Maintain current touch target to prevent late clicks on touch devices
var touchTarget;
// Listen for both events to support touch/mouse hybrid devices
touch && $doc.on('touchstart mousedown', function (evt) {
  touchTarget = evt.target;
});

/**
 * Webflow.validClick - validate click target against current touch target
 * @param  {HTMLElement} clickTarget  Element being clicked
 * @return {Boolean}  True if click target is valid (always true on non-touch)
 */
Webflow.validClick = touch ? function (clickTarget) {
  return clickTarget === touchTarget || $.contains(clickTarget, touchTarget);
} : function () {
  return true;
};

/**
 * Webflow.resize, Webflow.scroll - throttled event proxies
 */
var resizeEvents = 'resize.webflow orientationchange.webflow load.webflow';
var scrollEvents = 'scroll.webflow ' + resizeEvents;
Webflow.resize = eventProxy($win, resizeEvents);
Webflow.scroll = eventProxy($win, scrollEvents);
Webflow.redraw = eventProxy();

// Create a proxy instance for throttled events
function eventProxy(target, types) {

  // Set up throttled method (using custom frame-based _.throttle)
  var handlers = [];
  var proxy = {};
  proxy.up = _.throttle(function (evt) {
    _.each(handlers, function (h) {
      h(evt);
    });
  });

  // Bind events to target
  if (target && types) {
    target.on(types, proxy.up);
  }

  /**
   * Add an event handler
   * @param  {function} handler
   */
  proxy.on = function (handler) {
    if (typeof handler !== 'function') {
      return;
    }
    if (_.contains(handlers, handler)) {
      return;
    }
    handlers.push(handler);
  };

  /**
   * Remove an event handler
   * @param  {function} handler
   */
  proxy.off = function (handler) {
    // If no arguments supplied, clear all handlers
    if (!arguments.length) {
      handlers = [];
      return;
    }
    // Otherwise, remove handler from the list
    handlers = _.filter(handlers, function (h) {
      return h !== handler;
    });
  };

  return proxy;
}

// Webflow.location - Wrap window.location in api
Webflow.location = function (url) {
  window.location = url;
};

if (Webflow.env()) {
  // Ignore redirects inside a Webflow design/edit environment
  Webflow.location = function () {};
}

// Webflow.ready - Call primary and secondary handlers
Webflow.ready = function () {
  domready = true;

  // Restore modules after destroy
  if (destroyed) {
    restoreModules();

    // Otherwise run primary ready methods
  } else {
    _.each(primary, callReady);
  }

  // Run secondary ready methods
  _.each(secondary, callReady);

  // Trigger resize
  Webflow.resize.up();
};

function callReady(readyFn) {
  isFunction(readyFn) && readyFn();
}

function restoreModules() {
  destroyed = false;
  _.each(modules, bindModule);
}

/**
 * Webflow.load - Add a window load handler that will run even if load event has already happened
 * @param  {function} handler
 */
var deferLoad;
Webflow.load = function (handler) {
  deferLoad.then(handler);
};

function bindLoad() {
  // Reject any previous deferred (to support destroy)
  if (deferLoad) {
    deferLoad.reject();
    $win.off('load', deferLoad.resolve);
  }
  // Create deferred and bind window load event
  deferLoad = new $.Deferred();
  $win.on('load', deferLoad.resolve);
}

// Webflow.destroy - Trigger a destroy event for all modules
Webflow.destroy = function (options) {
  options = options || {};
  destroyed = true;
  $win.triggerHandler('__wf_destroy');

  // Allow domready reset for tests
  if (options.domready != null) {
    domready = options.domready;
  }

  // Unbind modules
  _.each(modules, unbindModule);

  // Clear any proxy event handlers
  Webflow.resize.off();
  Webflow.scroll.off();
  Webflow.redraw.off();

  // Clear any queued ready methods
  primary = [];
  secondary = [];

  // If load event has not yet fired, replace the deferred
  if (deferLoad.state() === 'pending') {
    bindLoad();
  }
};

// Listen for domready
$(Webflow.ready);

// Listen for window.onload and resolve deferred
bindLoad();

// Export commonjs module
module.exports = window.Webflow = Webflow;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(61);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsNative = __webpack_require__(131),
    getValue = __webpack_require__(136);

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return IX2_RAW_DATA_IMPORTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return IX2_SESSION_INITIALIZED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return IX2_SESSION_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return IX2_SESSION_STOPPED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return IX2_PREVIEW_REQUESTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return IX2_PLAYBACK_REQUESTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return IX2_STOP_REQUESTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return IX2_CLEAR_REQUESTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return IX2_EVENT_LISTENER_ADDED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return IX2_EVENT_STATE_CHANGED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return IX2_ANIMATION_FRAME_CHANGED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return IX2_PARAMETER_CHANGED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return IX2_INSTANCE_ADDED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return IX2_INSTANCE_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return IX2_INSTANCE_REMOVED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IX2_ACTION_LIST_PLAYBACK_CHANGED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "q", function() { return IX2_VIEWPORT_WIDTH_CHANGED; });
var IX2_RAW_DATA_IMPORTED = 'IX2_RAW_DATA_IMPORTED';
var IX2_SESSION_INITIALIZED = 'IX2_SESSION_INITIALIZED';
var IX2_SESSION_STARTED = 'IX2_SESSION_STARTED';
var IX2_SESSION_STOPPED = 'IX2_SESSION_STOPPED';
var IX2_PREVIEW_REQUESTED = 'IX2_PREVIEW_REQUESTED';
var IX2_PLAYBACK_REQUESTED = 'IX2_PLAYBACK_REQUESTED';
var IX2_STOP_REQUESTED = 'IX2_STOP_REQUESTED';
var IX2_CLEAR_REQUESTED = 'IX2_CLEAR_REQUESTED';
var IX2_EVENT_LISTENER_ADDED = 'IX2_EVENT_LISTENER_ADDED';
var IX2_EVENT_STATE_CHANGED = 'IX2_EVENT_STATE_CHANGED';
var IX2_ANIMATION_FRAME_CHANGED = 'IX2_ANIMATION_FRAME_CHANGED';
var IX2_PARAMETER_CHANGED = 'IX2_PARAMETER_CHANGED';
var IX2_INSTANCE_ADDED = 'IX2_INSTANCE_ADDED';
var IX2_INSTANCE_STARTED = 'IX2_INSTANCE_STARTED';
var IX2_INSTANCE_REMOVED = 'IX2_INSTANCE_REMOVED';
var IX2_ACTION_LIST_PLAYBACK_CHANGED = 'IX2_ACTION_LIST_PLAYBACK_CHANGED';
var IX2_VIEWPORT_WIDTH_CHANGED = 'IX2_VIEWPORT_WIDTH_CHANGED';

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var baseMatches = __webpack_require__(119),
    baseMatchesProperty = __webpack_require__(171),
    identity = __webpack_require__(38),
    isArray = __webpack_require__(0),
    property = __webpack_require__(178);

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

module.exports = baseIteratee;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(10),
    getRawTag = __webpack_require__(132),
    objectToString = __webpack_require__(133);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  value = Object(value);
  return (symToStringTag && symToStringTag in value)
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(60),
    isLength = __webpack_require__(31);

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(2);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var isSymbol = __webpack_require__(21);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = toKey;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var invariant = __webpack_require__(112);

var hasOwnProperty = Object.prototype.hasOwnProperty;
var splice = Array.prototype.splice;

var assign = Object.assign || /* istanbul ignore next */ function assign(target, source) {
  getAllKeys(source).forEach(function(key) {
    if (hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  });
  return target;
};

var getAllKeys = typeof Object.getOwnPropertySymbols === 'function' ?
  function(obj) { return Object.keys(obj).concat(Object.getOwnPropertySymbols(obj)) } :
  /* istanbul ignore next */ function(obj) { return Object.keys(obj) };

function copy(object) {
  if (object instanceof Array) {
    return object.slice();
  } else if (object && typeof object === 'object') {
    return assign(new object.constructor(), object);
  } else {
    return object;
  }
}

function newContext() {
  var commands = assign({}, defaultCommands);
  update.extend = function(directive, fn) {
    commands[directive] = fn;
  };

  return update;

  function update(object, spec) {
    if (!(Array.isArray(object) && Array.isArray(spec))) {
      invariant(
        !Array.isArray(spec),
        'update(): You provided an invalid spec to update(). The spec may ' +
        'not contain an array except as the value of $set, $push, $unshift, ' +
        '$splice or any custom command allowing an array value.'
      );
    }

    invariant(
      typeof spec === 'object' && spec !== null,
      'update(): You provided an invalid spec to update(). The spec and ' +
      'every included key path must be plain objects containing one of the ' +
      'following commands: %s.',
      Object.keys(commands).join(', ')
    );

    var nextObject = object;
    var specKeys = getAllKeys(spec);
    var index, key;
    getAllKeys(spec).forEach(function(key) {
      if (hasOwnProperty.call(commands, key)) {
        nextObject = commands[key](spec[key], nextObject, spec, object);
      } else {
        var nextValueForKey = update(object[key], spec[key]);
        if (nextValueForKey !== nextObject[key]) {
          if (nextObject === object) {
            nextObject = copy(object);
          }
          nextObject[key] = nextValueForKey;
        }
      }
    })
    return nextObject;
  }

}

var defaultCommands = {
  $push: function(value, original, spec) {
    invariantPushAndUnshift(original, spec, '$push');
    return original.concat(value);
  },
  $unshift: function(value, original, spec) {
    invariantPushAndUnshift(original, spec, '$unshift');
    return value.concat(original);
  },
  $splice: function(value, nextObject, spec, object) {
    var originalValue = nextObject === object ? copy(object) : nextObject;
    invariantSplices(originalValue, spec);
    value.forEach(function(args) {
      invariantSplice(args);
      splice.apply(originalValue, args);
    });
    return originalValue;
  },
  $set: function(value, original, spec) {
    invariantSet(spec);
    return value;
  },
  $unset: function(value, nextObject, spec, object) {
    invariant(
      Array.isArray(value),
      'update(): expected spec of $unset to be an array; got %s. ' +
      'Did you forget to wrap the key(s) in an array?',
      value
    );
    var originalValue = nextObject;
    value.forEach(function(key) {
      if (Object.hasOwnProperty.call(originalValue, key)) {
        if (nextObject === object) nextObject = copy(object);
        delete nextObject[key];
      }
    });
    return nextObject;
  },
  $merge: function(value, nextObject, spec, object) {
    var nextObject = nextObject;
    invariantMerge(nextObject, value);
    getAllKeys(value).forEach(function(key) {
      if (value[key] !== nextObject[key]) {
        if (nextObject === object) nextObject = copy(object);
        nextObject[key] = value[key];
      }
    });
    return nextObject;
  },
  $apply: function(value, original) {
    invariantApply(value);
    return value(original);
  }
};

module.exports = newContext();
module.exports.newContext = newContext;

// invariants

function invariantPushAndUnshift(value, spec, command) {
  invariant(
    Array.isArray(value),
    'update(): expected target of %s to be an array; got %s.',
    command,
    value
  );
  var specValue = spec[command];
  invariant(
    Array.isArray(specValue),
    'update(): expected spec of %s to be an array; got %s. ' +
    'Did you forget to wrap your parameter in an array?',
    command,
    specValue
  );
}

function invariantSplices(value, spec) {
  invariant(
    Array.isArray(value),
    'Expected $splice target to be an array; got %s',
    value
  );
  invariantSplice(spec['$splice']);
}

function invariantSplice(value) {
  invariant(
    Array.isArray(value),
    'update(): expected spec of $splice to be an array of arrays; got %s. ' +
    'Did you forget to wrap your parameters in an array?',
    value
  );
}

function invariantApply(fn) {
  invariant(
    typeof fn === 'function',
    'update(): expected spec of $apply to be a function; got %s.',
    fn
  );
}

function invariantSet(spec) {
  invariant(
    Object.keys(spec).length === 1,
    'Cannot have more than one key in an object with $set'
  );
}

function invariantMerge(target, specValue) {
  invariant(
    specValue && typeof specValue === 'object',
    'update(): $merge expects a spec of type \'object\'; got %s',
    specValue
  );
  invariant(
    target && typeof target === 'object',
    'update(): $merge expects a target of type \'object\'; got %s',
    target
  );
}


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var listCacheClear = __webpack_require__(121),
    listCacheDelete = __webpack_require__(122),
    listCacheGet = __webpack_require__(123),
    listCacheHas = __webpack_require__(124),
    listCacheSet = __webpack_require__(125);

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(25);

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(4);

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var isKeyable = __webpack_require__(145);

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeKeys = __webpack_require__(65),
    baseKeys = __webpack_require__(32),
    isArrayLike = __webpack_require__(9);

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsArguments = __webpack_require__(161),
    isObjectLike = __webpack_require__(5);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(36);

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(0),
    isKey = __webpack_require__(37),
    stringToPath = __webpack_require__(172),
    toString = __webpack_require__(70);

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

module.exports = castPath;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(8),
    isObjectLike = __webpack_require__(5);

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return IX2_ID_DELIMITER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "E", function() { return WF_PAGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return BOUNDARY_SELECTOR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "A", function() { return TRANSFORM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "B", function() { return TRANSLATE_X; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "C", function() { return TRANSLATE_Y; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "D", function() { return TRANSLATE_Z; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "u", function() { return SCALE_X; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "v", function() { return SCALE_Y; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "w", function() { return SCALE_Z; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "r", function() { return ROTATE_X; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "s", function() { return ROTATE_Y; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return ROTATE_Z; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "y", function() { return SKEW_X; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "z", function() { return SKEW_Y; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return OPACITY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "F", function() { return WIDTH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return HEIGHT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return BACKGROUND_COLOR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return BACKGROUND; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return BORDER_COLOR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return COLOR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return DISPLAY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return FLEX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "G", function() { return WILL_CHANGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AUTO; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return COMMA_DELIMITER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return COLON_DELIMITER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return BAR_DELIMITER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return CHILDREN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return IMMEDIATE_CHILDREN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "x", function() { return SIBLINGS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "q", function() { return PRESERVE_3D; });
var IX2_ID_DELIMITER = '|';
var WF_PAGE = 'data-wf-page';
var BOUNDARY_SELECTOR = '.w-dyn-item';
var TRANSFORM = 'transform';
var TRANSLATE_X = 'translateX';
var TRANSLATE_Y = 'translateY';
var TRANSLATE_Z = 'translateZ';
var SCALE_X = 'scaleX';
var SCALE_Y = 'scaleY';
var SCALE_Z = 'scaleZ';
var ROTATE_X = 'rotateX';
var ROTATE_Y = 'rotateY';
var ROTATE_Z = 'rotateZ';
var SKEW_X = 'skewX';
var SKEW_Y = 'skewY';
var OPACITY = 'opacity';
var WIDTH = 'width';
var HEIGHT = 'height';
var BACKGROUND_COLOR = 'backgroundColor';
var BACKGROUND = 'background';
var BORDER_COLOR = 'borderColor';
var COLOR = 'color';
var DISPLAY = 'display';
var FLEX = 'flex';
var WILL_CHANGE = 'willChange';
var AUTO = 'AUTO';
var COMMA_DELIMITER = ',';
var COLON_DELIMITER = ':';
var BAR_DELIMITER = '|';
var CHILDREN = 'CHILDREN';
var IMMEDIATE_CHILDREN = 'IMMEDIATE_CHILDREN';
var SIBLINGS = 'SIBLINGS';
var PRESERVE_3D = 'preserve-3d';

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var IXEvents = __webpack_require__(49);

function dispatchCustomEvent(element, eventName) {
  var event = document.createEvent('CustomEvent');
  event.initCustomEvent(eventName, true, true, null);
  element.dispatchEvent(event);
}

/**
 * Webflow: IX Event triggers for other modules
 */

var $ = window.jQuery;
var api = {};
var namespace = '.w-ix';

var eventTriggers = {
  reset: function reset(i, el) {
    IXEvents.triggers.reset(i, el);
  },
  intro: function intro(i, el) {
    IXEvents.triggers.intro(i, el);
    dispatchCustomEvent(el, 'COMPONENT_ACTIVE');
  },
  outro: function outro(i, el) {
    IXEvents.triggers.outro(i, el);
    dispatchCustomEvent(el, 'COMPONENT_INACTIVE');
  }
};

api.triggers = {};

api.types = {
  INTRO: 'w-ix-intro' + namespace,
  OUTRO: 'w-ix-outro' + namespace
};

$.extend(api.triggers, eventTriggers);

module.exports = api;

/***/ }),
/* 24 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 25 */
/***/ (function(module, exports) {

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(4),
    root = __webpack_require__(2);

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var mapCacheClear = __webpack_require__(137),
    mapCacheDelete = __webpack_require__(144),
    mapCacheGet = __webpack_require__(146),
    mapCacheHas = __webpack_require__(147),
    mapCacheSet = __webpack_require__(148);

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(2),
    stubFalse = __webpack_require__(162);

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(66)(module)))

/***/ }),
/* 29 */
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsTypedArray = __webpack_require__(163),
    baseUnary = __webpack_require__(164),
    nodeUtil = __webpack_require__(165);

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;


/***/ }),
/* 31 */
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var isPrototype = __webpack_require__(33),
    nativeKeys = __webpack_require__(166);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;


/***/ }),
/* 33 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;


/***/ }),
/* 34 */
/***/ (function(module, exports) {

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

var DataView = __webpack_require__(167),
    Map = __webpack_require__(26),
    Promise = __webpack_require__(168),
    Set = __webpack_require__(169),
    WeakMap = __webpack_require__(67),
    baseGetTag = __webpack_require__(8),
    toSource = __webpack_require__(62);

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(20),
    toKey = __webpack_require__(11);

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(0),
    isSymbol = __webpack_require__(21);

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

module.exports = isKey;


/***/ }),
/* 38 */
/***/ (function(module, exports) {

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(3),
    isSymbol = __webpack_require__(21);

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;


/***/ }),
/* 40 */
/***/ (function(module, exports) {

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;


/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["f"] = getInstanceId;
/* harmony export (immutable) */ __webpack_exports__["l"] = reifyState;
/* harmony export (immutable) */ __webpack_exports__["j"] = observeStore;
/* unused harmony export normalizeTarget */
/* harmony export (immutable) */ __webpack_exports__["c"] = getAffectedElements;
/* harmony export (immutable) */ __webpack_exports__["d"] = getComputedStyle;
/* harmony export (immutable) */ __webpack_exports__["g"] = getInstanceOrigin;
/* harmony export (immutable) */ __webpack_exports__["e"] = getDestinationValues;
/* harmony export (immutable) */ __webpack_exports__["m"] = renderInstance;
/* unused harmony export parseTransform */
/* unused harmony export renderStyle */
/* unused harmony export renderGeneral */
/* unused harmony export addWillChange */
/* unused harmony export removeWillChange */
/* harmony export (immutable) */ __webpack_exports__["b"] = clearAllStyles;
/* harmony export (immutable) */ __webpack_exports__["a"] = cleanupInstance;
/* harmony export (immutable) */ __webpack_exports__["h"] = getMaxDurationItemIndex;
/* unused harmony export getActionListProgress */
/* harmony export (immutable) */ __webpack_exports__["k"] = reduceListToGroup;
/* harmony export (immutable) */ __webpack_exports__["o"] = shouldNamespaceEventParameter;
/* harmony export (immutable) */ __webpack_exports__["i"] = getNamespacedParameterId;
/* harmony export (immutable) */ __webpack_exports__["n"] = shouldAllowMediaQuery;
/* harmony export (immutable) */ __webpack_exports__["p"] = stringifyTarget;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_get__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_get___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_get__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_defaultTo__ = __webpack_require__(217);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_defaultTo___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash_defaultTo__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_reduce__ = __webpack_require__(218);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_reduce___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash_reduce__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_immutability_helper__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_immutability_helper___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_immutability_helper__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__IX2EasingUtils__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__IX2BrowserSupport__ = __webpack_require__(81);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _Object$freeze, _Object$freeze2, _transformDefaults;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }














var trim = function trim(v) {
  return v.trim();
};

var colorStyleProps = Object.freeze((_Object$freeze = {}, _defineProperty(_Object$freeze, __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["d" /* STYLE_BACKGROUND_COLOR */], __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["c" /* BACKGROUND_COLOR */]), _defineProperty(_Object$freeze, __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["e" /* STYLE_BORDER */], __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["e" /* BORDER_COLOR */]), _defineProperty(_Object$freeze, __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["h" /* STYLE_TEXT_COLOR */], __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["i" /* COLOR */]), _Object$freeze));

var willChangeProps = Object.freeze((_Object$freeze2 = {}, _defineProperty(_Object$freeze2, __WEBPACK_IMPORTED_MODULE_8__IX2BrowserSupport__["d" /* TRANSFORM_PREFIXED */], __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["A" /* TRANSFORM */]), _defineProperty(_Object$freeze2, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["c" /* BACKGROUND_COLOR */], __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["b" /* BACKGROUND */]), _defineProperty(_Object$freeze2, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["p" /* OPACITY */], __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["p" /* OPACITY */]), _defineProperty(_Object$freeze2, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["F" /* WIDTH */], __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["F" /* WIDTH */]), _defineProperty(_Object$freeze2, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["m" /* HEIGHT */], __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["m" /* HEIGHT */]), _Object$freeze2));

var uuid = 1;
function getInstanceId() {
  return 'i' + uuid++;
}

function reifyState() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      events = _ref.events,
      actionLists = _ref.actionLists,
      site = _ref.site;

  var eventTypeMap = __WEBPACK_IMPORTED_MODULE_2_lodash_reduce___default()(events, function (result, event) {
    var eventTypeId = event.eventTypeId;

    if (!result[eventTypeId]) {
      result[eventTypeId] = {};
    }
    result[eventTypeId][event.id] = event;
    return result;
  }, {});

  var mediaQueries = site && site.mediaQueries;
  var mediaQueryKeys = [];
  if (mediaQueries) {
    mediaQueryKeys = mediaQueries.map(function (mq) {
      return mq.key;
    });
  } else {
    mediaQueries = [];
    console.warn('IX2 missing mediaQueries in site data');
  }

  return {
    ixData: {
      events: events,
      actionLists: actionLists,
      eventTypeMap: eventTypeMap,
      mediaQueries: mediaQueries,
      mediaQueryKeys: mediaQueryKeys
    }
  };
}

var strictEqual = function strictEqual(a, b) {
  return a === b;
};

function observeStore(_ref2) {
  var store = _ref2.store,
      select = _ref2.select,
      onChange = _ref2.onChange,
      _ref2$comparator = _ref2.comparator,
      comparator = _ref2$comparator === undefined ? strictEqual : _ref2$comparator;
  var getState = store.getState,
      subscribe = store.subscribe;

  var unsubscribe = subscribe(handleChange);
  var currentState = select(getState());
  function handleChange() {
    var nextState = select(getState());
    if (nextState == null) {
      unsubscribe();
      return;
    }
    if (!comparator(nextState, currentState)) {
      currentState = nextState;
      onChange(currentState, store);
    }
  }
  return unsubscribe;
}

function normalizeTarget(target) {
  var type = typeof target === 'undefined' ? 'undefined' : _typeof(target);
  if (type === 'string') {
    return { id: target };
  } else if (target != null && type === 'object') {
    var id = target.id,
        selector = target.selector,
        selectorGuids = target.selectorGuids,
        appliesTo = target.appliesTo,
        useEventTarget = target.useEventTarget;

    return { id: id, selector: selector, selectorGuids: selectorGuids, appliesTo: appliesTo, useEventTarget: useEventTarget };
  }
  return {};
}

function getAffectedElements(_ref3) {
  var config = _ref3.config,
      event = _ref3.event,
      eventTarget = _ref3.eventTarget,
      elementRoot = _ref3.elementRoot,
      elementApi = _ref3.elementApi;

  if (!elementApi) {
    throw new Error('IX2 missing elementApi');
  }

  var getValidDocument = elementApi.getValidDocument,
      getQuerySelector = elementApi.getQuerySelector,
      queryDocument = elementApi.queryDocument,
      getChildElements = elementApi.getChildElements,
      getSiblingElements = elementApi.getSiblingElements,
      matchSelector = elementApi.matchSelector,
      elementContains = elementApi.elementContains,
      isSiblingNode = elementApi.isSiblingNode;
  var target = config.target;

  if (!target) {
    return [];
  }

  var _normalizeTarget = normalizeTarget(target),
      id = _normalizeTarget.id,
      selector = _normalizeTarget.selector,
      selectorGuids = _normalizeTarget.selectorGuids,
      appliesTo = _normalizeTarget.appliesTo,
      useEventTarget = _normalizeTarget.useEventTarget;

  if (appliesTo === __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["o" /* PAGE */]) {
    var doc = getValidDocument(id);
    return doc ? [doc] : [];
  }

  var overrides = __WEBPACK_IMPORTED_MODULE_0_lodash_get___default()(event, 'action.config.affectedElements', {});
  var override = overrides[id || selector] || {};
  var validOverride = Boolean(override.id || override.selector);

  var limitAffectedElements = void 0;
  var baseSelector = void 0;
  var finalSelector = void 0;

  var eventTargetSelector = event && getQuerySelector(normalizeTarget(event.target));

  if (validOverride) {
    limitAffectedElements = override.limitAffectedElements;
    baseSelector = eventTargetSelector;
    finalSelector = getQuerySelector(override);
  } else {

    // pass in selectorGuids as well for server-side rendering.
    baseSelector = finalSelector = getQuerySelector({ id: id, selector: selector, selectorGuids: selectorGuids });
  }

  if (event && useEventTarget) {

    // eventTarget is not defined when this function is called in a clear request, so find
    // all target elements associated with the event data, and return affected elements.
    var eventTargets = eventTarget && finalSelector ? [eventTarget] : queryDocument(eventTargetSelector);

    if (finalSelector) {
      if (useEventTarget === __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["g" /* CHILDREN */]) {
        return queryDocument(finalSelector).filter(function (childElement) {
          return eventTargets.some(function (targetElement) {
            return elementContains(targetElement, childElement);
          });
        });
      }
      if (useEventTarget === __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["x" /* SIBLINGS */]) {
        return queryDocument(finalSelector).filter(function (siblingElement) {
          return eventTargets.some(function (targetElement) {
            return isSiblingNode(targetElement, siblingElement);
          });
        });
      }
    }
    return eventTargets;
  }

  if (baseSelector == null || finalSelector == null) {
    return [];
  }

  if (__WEBPACK_IMPORTED_MODULE_8__IX2BrowserSupport__["c" /* IS_BROWSER_ENV */] && elementRoot) {
    return queryDocument(finalSelector).filter(function (element) {
      return elementRoot.contains(element);
    });
  }

  if (limitAffectedElements === __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["g" /* CHILDREN */]) {
    return queryDocument(baseSelector, finalSelector);
  } else if (limitAffectedElements === __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["n" /* IMMEDIATE_CHILDREN */]) {
    return getChildElements(queryDocument(baseSelector)).filter(matchSelector(finalSelector));
  } else if (limitAffectedElements === __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["x" /* SIBLINGS */]) {
    return getSiblingElements(queryDocument(baseSelector)).filter(matchSelector(finalSelector));
  } else {
    return queryDocument(finalSelector);
  }
}

function getComputedStyle(_ref4) {
  var element = _ref4.element,
      actionItem = _ref4.actionItem;

  if (!__WEBPACK_IMPORTED_MODULE_8__IX2BrowserSupport__["c" /* IS_BROWSER_ENV */]) {
    return {};
  }
  var actionTypeId = actionItem.actionTypeId;

  switch (actionTypeId) {
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["g" /* STYLE_SIZE */]:
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["d" /* STYLE_BACKGROUND_COLOR */]:
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["e" /* STYLE_BORDER */]:
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["h" /* STYLE_TEXT_COLOR */]:
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["b" /* GENERAL_DISPLAY */]:
      return window.getComputedStyle(element);
    default:
      return {};
  }
}

var pxValueRegex = /px/;

function getInstanceOrigin(_ref5) {
  var element = _ref5.element,
      actionItem = _ref5.actionItem,
      _ref5$computedStyle = _ref5.computedStyle,
      computedStyle = _ref5$computedStyle === undefined ? {} : _ref5$computedStyle,
      elementApi = _ref5.elementApi;
  var getStyle = elementApi.getStyle;
  var actionTypeId = actionItem.actionTypeId,
      config = actionItem.config;

  switch (actionTypeId) {
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["i" /* TRANSFORM_MOVE */]:
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["k" /* TRANSFORM_SCALE */]:
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["j" /* TRANSFORM_ROTATE */]:
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["l" /* TRANSFORM_SKEW */]:
      return parseTransform(getStyle(element, __WEBPACK_IMPORTED_MODULE_8__IX2BrowserSupport__["d" /* TRANSFORM_PREFIXED */]), actionTypeId);
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["f" /* STYLE_OPACITY */]:
      return { value: __WEBPACK_IMPORTED_MODULE_1_lodash_defaultTo___default()(parseFloat(getStyle(element, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["p" /* OPACITY */])), 1.0) };
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["g" /* STYLE_SIZE */]:
      {
        var inlineWidth = getStyle(element, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["F" /* WIDTH */]);
        var inlineHeight = getStyle(element, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["m" /* HEIGHT */]);
        var widthValue = void 0;
        var heightValue = void 0;
        // When destination unit is 'AUTO', ensure origin values are in px
        if (config.widthUnit === __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["a" /* AUTO */]) {
          widthValue = pxValueRegex.test(inlineWidth) ? parseFloat(inlineWidth) : parseFloat(computedStyle.width);
        } else {
          widthValue = __WEBPACK_IMPORTED_MODULE_1_lodash_defaultTo___default()(parseFloat(inlineWidth), parseFloat(computedStyle.width));
        }
        if (config.heightUnit === __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["a" /* AUTO */]) {
          heightValue = pxValueRegex.test(inlineHeight) ? parseFloat(inlineHeight) : parseFloat(computedStyle.height);
        } else {
          heightValue = __WEBPACK_IMPORTED_MODULE_1_lodash_defaultTo___default()(parseFloat(inlineHeight), parseFloat(computedStyle.height));
        }
        return {
          widthValue: widthValue,
          heightValue: heightValue
        };
      }
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["d" /* STYLE_BACKGROUND_COLOR */]:
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["e" /* STYLE_BORDER */]:
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["h" /* STYLE_TEXT_COLOR */]:
      return parseColor({ element: element, actionTypeId: actionTypeId, computedStyle: computedStyle, getStyle: getStyle });
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["b" /* GENERAL_DISPLAY */]:
      return { value: __WEBPACK_IMPORTED_MODULE_1_lodash_defaultTo___default()(getStyle(element, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["k" /* DISPLAY */]), computedStyle.display) };
    default:
      return;
  }
}

function getDestinationValues(_ref6) {
  var element = _ref6.element,
      actionItem = _ref6.actionItem,
      elementApi = _ref6.elementApi;

  switch (actionItem.actionTypeId) {
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["i" /* TRANSFORM_MOVE */]:
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["k" /* TRANSFORM_SCALE */]:
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["j" /* TRANSFORM_ROTATE */]:
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["l" /* TRANSFORM_SKEW */]:
      {
        var _actionItem$config = actionItem.config,
            xValue = _actionItem$config.xValue,
            yValue = _actionItem$config.yValue,
            zValue = _actionItem$config.zValue;

        return { xValue: xValue, yValue: yValue, zValue: zValue };
      }
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["g" /* STYLE_SIZE */]:
      {
        var getStyle = elementApi.getStyle,
            setStyle = elementApi.setStyle,
            getProperty = elementApi.getProperty;
        var _actionItem$config2 = actionItem.config,
            widthUnit = _actionItem$config2.widthUnit,
            heightUnit = _actionItem$config2.heightUnit;
        var _actionItem$config3 = actionItem.config,
            widthValue = _actionItem$config3.widthValue,
            heightValue = _actionItem$config3.heightValue;

        if (!__WEBPACK_IMPORTED_MODULE_8__IX2BrowserSupport__["c" /* IS_BROWSER_ENV */]) {
          return { widthValue: widthValue, heightValue: heightValue };
        }
        if (widthUnit === __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["a" /* AUTO */]) {
          var temp = getStyle(element, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["F" /* WIDTH */]);
          setStyle(element, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["F" /* WIDTH */], '');
          widthValue = getProperty(element, 'offsetWidth');
          setStyle(element, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["F" /* WIDTH */], temp);
        }
        if (heightUnit === __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["a" /* AUTO */]) {
          var _temp = getStyle(element, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["m" /* HEIGHT */]);
          setStyle(element, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["m" /* HEIGHT */], '');
          heightValue = getProperty(element, 'offsetHeight');
          setStyle(element, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["m" /* HEIGHT */], _temp);
        }
        return { widthValue: widthValue, heightValue: heightValue };
      }
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["d" /* STYLE_BACKGROUND_COLOR */]:
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["e" /* STYLE_BORDER */]:
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["h" /* STYLE_TEXT_COLOR */]:
      {
        var _actionItem$config4 = actionItem.config,
            rValue = _actionItem$config4.rValue,
            gValue = _actionItem$config4.gValue,
            bValue = _actionItem$config4.bValue,
            aValue = _actionItem$config4.aValue;

        return { rValue: rValue, gValue: gValue, bValue: bValue, aValue: aValue };
      }
    default:
      {
        var value = actionItem.config.value;

        return { value: value };
      }
  }
}

function renderInstance(instance, elementApi) {
  var isTransform = instance.isTransform,
      isStyle = instance.isStyle,
      isGeneral = instance.isGeneral;


  if (isTransform) {
    return renderTransform(instance, elementApi);
  }
  if (isStyle) {
    return renderStyle(instance, elementApi);
  }
  if (isGeneral) {
    return renderGeneral(instance, elementApi);
  }
}

var transformDefaults = (_transformDefaults = {}, _defineProperty(_transformDefaults, __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["i" /* TRANSFORM_MOVE */], Object.freeze({
  xValue: 0,
  yValue: 0,
  zValue: 0
})), _defineProperty(_transformDefaults, __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["k" /* TRANSFORM_SCALE */], Object.freeze({
  xValue: 1,
  yValue: 1,
  zValue: 1
})), _defineProperty(_transformDefaults, __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["j" /* TRANSFORM_ROTATE */], Object.freeze({
  xValue: 0,
  yValue: 0,
  zValue: 0
})), _defineProperty(_transformDefaults, __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["l" /* TRANSFORM_SKEW */], Object.freeze({
  xValue: 0,
  yValue: 0
})), _transformDefaults);

var paramCapture = '\\(([^)]+)\\)';
var translateXRegex = RegExp('' + __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["B" /* TRANSLATE_X */] + paramCapture);
var translateYRegex = RegExp('' + __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["C" /* TRANSLATE_Y */] + paramCapture);
var translateZRegex = RegExp('' + __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["D" /* TRANSLATE_Z */] + paramCapture);
var scaleXRegex = RegExp('' + __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["u" /* SCALE_X */] + paramCapture);
var scaleYRegex = RegExp('' + __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["v" /* SCALE_Y */] + paramCapture);
var scaleZRegex = RegExp('' + __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["w" /* SCALE_Z */] + paramCapture);
var rotateXRegex = RegExp('' + __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["r" /* ROTATE_X */] + paramCapture);
var rotateYRegex = RegExp('' + __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["s" /* ROTATE_Y */] + paramCapture);
var rotateZRegex = RegExp('' + __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["t" /* ROTATE_Z */] + paramCapture);
var skewXRegex = RegExp('' + __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["y" /* SKEW_X */] + paramCapture);
var skewYRegex = RegExp('' + __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["z" /* SKEW_Y */] + paramCapture);

var defaultTransform = Object.keys(transformDefaults).map(function (actionTypeId) {
  var defaults = transformDefaults[actionTypeId];
  var xValue = defaults.xValue,
      yValue = defaults.yValue,
      zValue = defaults.zValue;

  switch (actionTypeId) {
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["i" /* TRANSFORM_MOVE */]:
      return fillTransformValues([[__WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["B" /* TRANSLATE_X */], xValue], [__WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["C" /* TRANSLATE_Y */], yValue], [__WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["D" /* TRANSLATE_Z */], zValue]]);
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["k" /* TRANSFORM_SCALE */]:
      return fillTransformValues([[__WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["u" /* SCALE_X */], xValue], [__WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["v" /* SCALE_Y */], yValue], [__WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["w" /* SCALE_Z */], zValue]]);
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["j" /* TRANSFORM_ROTATE */]:
      return fillTransformValues([[__WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["r" /* ROTATE_X */], xValue], [__WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["s" /* ROTATE_Y */], yValue], [__WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["t" /* ROTATE_Z */], zValue]]);
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["l" /* TRANSFORM_SKEW */]:
      return fillTransformValues([[__WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["y" /* SKEW_X */], xValue], [__WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["z" /* SKEW_Y */], yValue]]);
    default:
      return '';
  }
}).join(' ');

function fillTransformValues(pairs) {
  return pairs.map(function (pair) {
    return pair[0] + '(' + pair[1] + ')';
  }).join(' ');
}

function getFirstMatch(regex, value) {
  var match = regex.exec(value);
  return match ? match[1] : '';
}

function parseTransform(transform, actionTypeId) {
  var defaults = transformDefaults[actionTypeId];
  if (!transform) {
    return defaults;
  }
  var parseXYZ = function parseXYZ(values) {
    return {
      xValue: __WEBPACK_IMPORTED_MODULE_1_lodash_defaultTo___default()(parseFloat(values[0]), defaults.xValue),
      yValue: __WEBPACK_IMPORTED_MODULE_1_lodash_defaultTo___default()(parseFloat(values[1]), defaults.yValue),
      zValue: __WEBPACK_IMPORTED_MODULE_1_lodash_defaultTo___default()(parseFloat(values[2]), defaults.zValue)
    };
  };
  switch (actionTypeId) {
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["i" /* TRANSFORM_MOVE */]:
      {
        var values = [getFirstMatch(translateXRegex, transform), getFirstMatch(translateYRegex, transform), getFirstMatch(translateZRegex, transform)];
        return parseXYZ(values);
      }
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["k" /* TRANSFORM_SCALE */]:
      {
        var _values = [getFirstMatch(scaleXRegex, transform), getFirstMatch(scaleYRegex, transform), getFirstMatch(scaleZRegex, transform)];
        return parseXYZ(_values);
      }
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["j" /* TRANSFORM_ROTATE */]:
      {
        var _values2 = [getFirstMatch(rotateXRegex, transform), getFirstMatch(rotateYRegex, transform), getFirstMatch(rotateZRegex, transform)];
        return parseXYZ(_values2);
      }
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["l" /* TRANSFORM_SKEW */]:
      {
        var _values3 = [getFirstMatch(skewXRegex, transform), getFirstMatch(skewYRegex, transform)];
        return {
          xValue: __WEBPACK_IMPORTED_MODULE_1_lodash_defaultTo___default()(parseFloat(_values3[0]), defaults.xValue),
          yValue: __WEBPACK_IMPORTED_MODULE_1_lodash_defaultTo___default()(parseFloat(_values3[1]), defaults.yValue)
        };
      }
    default:
      {
        return;
      }
  }
}

function renderTransform(_ref7, elementApi) {
  var element = _ref7.element,
      current = _ref7.current,
      actionItem = _ref7.actionItem;
  var getStyle = elementApi.getStyle,
      setStyle = elementApi.setStyle;

  var transform = getStyle(element, __WEBPACK_IMPORTED_MODULE_8__IX2BrowserSupport__["d" /* TRANSFORM_PREFIXED */]);
  var newTransform = updateTransformValues(transform, actionItem, current);
  if (transform !== newTransform) {
    addWillChange(element, __WEBPACK_IMPORTED_MODULE_8__IX2BrowserSupport__["d" /* TRANSFORM_PREFIXED */], elementApi);
    setStyle(element, __WEBPACK_IMPORTED_MODULE_8__IX2BrowserSupport__["d" /* TRANSFORM_PREFIXED */], newTransform);
    // Set transform-style: preserve-3d
    if (hasDefined3dTransform(actionItem, current)) {
      setStyle(element, __WEBPACK_IMPORTED_MODULE_8__IX2BrowserSupport__["e" /* TRANSFORM_STYLE_PREFIXED */], __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["q" /* PRESERVE_3D */]);
    }
  }
}

function hasDefined3dTransform(_ref8, _ref9) {
  var actionTypeId = _ref8.actionTypeId;
  var xValue = _ref9.xValue,
      yValue = _ref9.yValue,
      zValue = _ref9.zValue;

  // TRANSLATE_Z
  return actionTypeId === __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["i" /* TRANSFORM_MOVE */] && zValue !== undefined ||
  // SCALE_Z
  actionTypeId === __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["k" /* TRANSFORM_SCALE */] && zValue !== undefined ||
  // ROTATE_X or ROTATE_Y
  actionTypeId === __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["j" /* TRANSFORM_ROTATE */] && (xValue !== undefined || yValue !== undefined);
}

function updateTransformValues(transform, actionItem, current) {
  var actionTypeId = actionItem.actionTypeId,
      config = actionItem.config;
  var _config$xUnit = config.xUnit,
      xUnit = _config$xUnit === undefined ? '' : _config$xUnit,
      _config$yUnit = config.yUnit,
      yUnit = _config$yUnit === undefined ? '' : _config$yUnit,
      _config$zUnit = config.zUnit,
      zUnit = _config$zUnit === undefined ? '' : _config$zUnit;
  var xValue = current.xValue,
      yValue = current.yValue,
      zValue = current.zValue;

  var result = transform || defaultTransform;
  switch (actionTypeId) {
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["i" /* TRANSFORM_MOVE */]:
      if (xValue !== undefined) {
        result = replaceTransformPart(result, translateXRegex, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["B" /* TRANSLATE_X */], xValue + xUnit);
      }
      if (yValue !== undefined) {
        result = replaceTransformPart(result, translateYRegex, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["C" /* TRANSLATE_Y */], yValue + yUnit);
      }
      if (zValue !== undefined) {
        result = replaceTransformPart(result, translateZRegex, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["D" /* TRANSLATE_Z */], zValue + zUnit);
      }
      return result;
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["k" /* TRANSFORM_SCALE */]:
      if (xValue !== undefined) {
        result = replaceTransformPart(result, scaleXRegex, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["u" /* SCALE_X */], xValue + xUnit);
      }
      if (yValue !== undefined) {
        result = replaceTransformPart(result, scaleYRegex, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["v" /* SCALE_Y */], yValue + yUnit);
      }
      if (zValue !== undefined) {
        result = replaceTransformPart(result, scaleZRegex, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["w" /* SCALE_Z */], zValue + zUnit);
      }
      return result;
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["j" /* TRANSFORM_ROTATE */]:
      if (xValue !== undefined) {
        result = replaceTransformPart(result, rotateXRegex, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["r" /* ROTATE_X */], xValue + xUnit);
      }
      if (yValue !== undefined) {
        result = replaceTransformPart(result, rotateYRegex, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["s" /* ROTATE_Y */], yValue + yUnit);
      }
      if (zValue !== undefined) {
        result = replaceTransformPart(result, rotateZRegex, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["t" /* ROTATE_Z */], zValue + zUnit);
      }
      return result;
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["l" /* TRANSFORM_SKEW */]:
      if (xValue !== undefined) {
        result = replaceTransformPart(result, skewXRegex, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["y" /* SKEW_X */], xValue + xUnit);
      }
      if (yValue !== undefined) {
        result = replaceTransformPart(result, skewYRegex, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["z" /* SKEW_Y */], yValue + yUnit);
      }
      return result;
    default:
      return result;
  }
}

function replaceTransformPart(input, regex, func, value) {
  return input.replace(regex, func + '(' + value + ')');
}

var rgbValidRegex = /^rgb/;
var rgbMatchRegex = RegExp('rgba?' + paramCapture);

function parseColor(_ref10) {
  var element = _ref10.element,
      actionTypeId = _ref10.actionTypeId,
      computedStyle = _ref10.computedStyle,
      getStyle = _ref10.getStyle;

  var prop = colorStyleProps[actionTypeId];
  var inlineValue = getStyle(element, prop);
  var value = rgbValidRegex.test(inlineValue) ? inlineValue : computedStyle[prop];
  var matches = getFirstMatch(rgbMatchRegex, value).split(__WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["j" /* COMMA_DELIMITER */]);
  return {
    rValue: __WEBPACK_IMPORTED_MODULE_1_lodash_defaultTo___default()(parseInt(matches[0], 10), 255),
    gValue: __WEBPACK_IMPORTED_MODULE_1_lodash_defaultTo___default()(parseInt(matches[1], 10), 255),
    bValue: __WEBPACK_IMPORTED_MODULE_1_lodash_defaultTo___default()(parseInt(matches[2], 10), 255),
    aValue: __WEBPACK_IMPORTED_MODULE_1_lodash_defaultTo___default()(parseFloat(matches[3]), 1)
  };
}

function renderStyle(_ref11, elementApi) {
  var element = _ref11.element,
      actionItem = _ref11.actionItem,
      current = _ref11.current,
      styleProp = _ref11.styleProp;
  var setStyle = elementApi.setStyle;
  var actionTypeId = actionItem.actionTypeId,
      config = actionItem.config;

  switch (actionTypeId) {
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["g" /* STYLE_SIZE */]:
      {
        var _actionItem$config5 = actionItem.config,
            _actionItem$config5$w = _actionItem$config5.widthUnit,
            widthUnit = _actionItem$config5$w === undefined ? '' : _actionItem$config5$w,
            _actionItem$config5$h = _actionItem$config5.heightUnit,
            heightUnit = _actionItem$config5$h === undefined ? '' : _actionItem$config5$h;
        var widthValue = current.widthValue,
            heightValue = current.heightValue;

        if (widthValue !== undefined) {
          if (widthUnit === __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["a" /* AUTO */]) {
            widthUnit = 'px';
          }
          addWillChange(element, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["F" /* WIDTH */], elementApi);
          setStyle(element, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["F" /* WIDTH */], widthValue + widthUnit);
        }
        if (heightValue !== undefined) {
          if (heightUnit === __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["a" /* AUTO */]) {
            heightUnit = 'px';
          }
          addWillChange(element, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["m" /* HEIGHT */], elementApi);
          setStyle(element, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["m" /* HEIGHT */], heightValue + heightUnit);
        }
        break;
      }
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["d" /* STYLE_BACKGROUND_COLOR */]:
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["e" /* STYLE_BORDER */]:
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["h" /* STYLE_TEXT_COLOR */]:
      {
        var prop = colorStyleProps[actionTypeId];
        var rValue = current.rValue,
            gValue = current.gValue,
            bValue = current.bValue,
            aValue = current.aValue;

        addWillChange(element, prop, elementApi);
        setStyle(element, prop, aValue >= 1 ? 'rgb(' + Math.round(rValue) + ',' + Math.round(gValue) + ',' + Math.round(bValue) + ')' : 'rgba(' + Math.round(rValue) + ',' + Math.round(gValue) + ',' + Math.round(bValue) + ',' + aValue + ')');
        break;
      }
    default:
      {
        var _config$unit = config.unit,
            unit = _config$unit === undefined ? '' : _config$unit;

        addWillChange(element, styleProp, elementApi);
        setStyle(element, styleProp, current.value + unit);
        break;
      }
  }
}

function renderGeneral(_ref12, elementApi) {
  var element = _ref12.element,
      actionItem = _ref12.actionItem;
  var setStyle = elementApi.setStyle;

  switch (actionItem.actionTypeId) {
    case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["b" /* GENERAL_DISPLAY */]:
      {
        var value = actionItem.config.value;

        if (value === __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["l" /* FLEX */] && __WEBPACK_IMPORTED_MODULE_8__IX2BrowserSupport__["c" /* IS_BROWSER_ENV */]) {
          setStyle(element, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["k" /* DISPLAY */], __WEBPACK_IMPORTED_MODULE_8__IX2BrowserSupport__["b" /* FLEX_PREFIXED */]);
        } else {
          setStyle(element, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["k" /* DISPLAY */], value);
        }
        return;
      }
  }
}

function addWillChange(element, prop, elementApi) {
  if (!__WEBPACK_IMPORTED_MODULE_8__IX2BrowserSupport__["c" /* IS_BROWSER_ENV */]) {
    return;
  }
  var validProp = willChangeProps[prop];
  if (!validProp) {
    return;
  }
  var getStyle = elementApi.getStyle,
      setStyle = elementApi.setStyle;

  var value = getStyle(element, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["G" /* WILL_CHANGE */]);
  if (!value) {
    setStyle(element, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["G" /* WILL_CHANGE */], validProp);
    return;
  }
  var values = value.split(__WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["j" /* COMMA_DELIMITER */]).map(trim);
  if (values.indexOf(validProp) === -1) {
    setStyle(element, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["G" /* WILL_CHANGE */], values.concat(validProp).join(__WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["j" /* COMMA_DELIMITER */]));
  }
}

function removeWillChange(element, prop, elementApi) {
  if (!__WEBPACK_IMPORTED_MODULE_8__IX2BrowserSupport__["c" /* IS_BROWSER_ENV */]) {
    return;
  }
  var validProp = willChangeProps[prop];
  if (!validProp) {
    return;
  }
  var getStyle = elementApi.getStyle,
      setStyle = elementApi.setStyle;

  var value = getStyle(element, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["G" /* WILL_CHANGE */]);
  if (!value || value.indexOf(validProp) === -1) {
    return;
  }
  setStyle(element, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["G" /* WILL_CHANGE */], value.split(__WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["j" /* COMMA_DELIMITER */]).map(trim).filter(function (v) {
    return v !== validProp;
  }).join(__WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["j" /* COMMA_DELIMITER */]));
}

function clearAllStyles(_ref13) {
  var store = _ref13.store,
      elementApi = _ref13.elementApi;

  var _store$getState = store.getState(),
      ixData = _store$getState.ixData;

  var _ixData$events = ixData.events,
      events = _ixData$events === undefined ? {} : _ixData$events,
      _ixData$actionLists = ixData.actionLists,
      actionLists = _ixData$actionLists === undefined ? {} : _ixData$actionLists;

  Object.keys(events).forEach(function (eventId) {
    var event = events[eventId];
    var config = event.action.config;
    var actionListId = config.actionListId;

    var actionList = actionLists[actionListId];
    if (actionList) {
      clearActionListStyles({ actionList: actionList, event: event, elementApi: elementApi });
    }
  });
  Object.keys(actionLists).forEach(function (actionListId) {
    clearActionListStyles({ actionList: actionLists[actionListId], elementApi: elementApi });
  });
}

function clearActionListStyles(_ref14) {
  var _ref14$actionList = _ref14.actionList,
      actionList = _ref14$actionList === undefined ? {} : _ref14$actionList,
      event = _ref14.event,
      elementApi = _ref14.elementApi;
  var actionItemGroups = actionList.actionItemGroups,
      continuousParameterGroups = actionList.continuousParameterGroups;

  actionItemGroups && actionItemGroups.forEach(function (actionGroup) {
    clearActionGroupStyles({ actionGroup: actionGroup, event: event, elementApi: elementApi });
  });
  continuousParameterGroups && continuousParameterGroups.forEach(function (paramGroup) {
    var continuousActionGroups = paramGroup.continuousActionGroups;

    continuousActionGroups.forEach(function (actionGroup) {
      clearActionGroupStyles({ actionGroup: actionGroup, event: event, elementApi: elementApi });
    });
  });
}

function clearActionGroupStyles(_ref15) {
  var actionGroup = _ref15.actionGroup,
      event = _ref15.event,
      elementApi = _ref15.elementApi;
  var actionItems = actionGroup.actionItems;

  actionItems.forEach(function (_ref16) {
    var actionTypeId = _ref16.actionTypeId,
        config = _ref16.config;

    var clearElement = processElementByType({ effect: clearStyleProp, actionTypeId: actionTypeId, elementApi: elementApi });
    getAffectedElements({ config: config, event: event, elementApi: elementApi }).forEach(clearElement);
  });
}

function cleanupInstance(instance, elementApi) {
  var actionItem = instance.actionItem,
      element = instance.element;
  var setStyle = elementApi.setStyle,
      getStyle = elementApi.getStyle;
  var actionTypeId = actionItem.actionTypeId;


  if (actionTypeId === __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["g" /* STYLE_SIZE */]) {
    var config = actionItem.config;

    if (config.widthUnit === __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["a" /* AUTO */]) {
      setStyle(element, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["F" /* WIDTH */], '');
    }
    if (config.heightUnit === __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["a" /* AUTO */]) {
      setStyle(element, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["m" /* HEIGHT */], '');
    }
  }

  if (getStyle(element, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["G" /* WILL_CHANGE */])) {
    processElementByType({ effect: removeWillChange, actionTypeId: actionTypeId, elementApi: elementApi })(element);
  }
}

var processElementByType = function processElementByType(_ref17) {
  var effect = _ref17.effect,
      actionTypeId = _ref17.actionTypeId,
      elementApi = _ref17.elementApi;
  return function (element) {
    switch (actionTypeId) {
      case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["i" /* TRANSFORM_MOVE */]:
      case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["k" /* TRANSFORM_SCALE */]:
      case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["j" /* TRANSFORM_ROTATE */]:
      case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["l" /* TRANSFORM_SKEW */]:
        effect(element, __WEBPACK_IMPORTED_MODULE_8__IX2BrowserSupport__["d" /* TRANSFORM_PREFIXED */], elementApi);
        break;
      case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["f" /* STYLE_OPACITY */]:
        effect(element, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["p" /* OPACITY */], elementApi);
        break;
      case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["g" /* STYLE_SIZE */]:
        effect(element, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["F" /* WIDTH */], elementApi);
        effect(element, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["m" /* HEIGHT */], elementApi);
        break;
      case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["d" /* STYLE_BACKGROUND_COLOR */]:
      case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["e" /* STYLE_BORDER */]:
      case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["h" /* STYLE_TEXT_COLOR */]:
        effect(element, colorStyleProps[actionTypeId], elementApi);
        break;
      case __WEBPACK_IMPORTED_MODULE_5__constants_IX2EngineItemTypes__["b" /* GENERAL_DISPLAY */]:
        effect(element, __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["k" /* DISPLAY */], elementApi);
        break;
    }
  };
};

function clearStyleProp(element, prop, elementApi) {
  var setStyle = elementApi.setStyle;

  removeWillChange(element, prop, elementApi);
  setStyle(element, prop, '');
  // Clear transform-style: preserve-3d
  if (prop === __WEBPACK_IMPORTED_MODULE_8__IX2BrowserSupport__["d" /* TRANSFORM_PREFIXED */]) {
    setStyle(element, __WEBPACK_IMPORTED_MODULE_8__IX2BrowserSupport__["e" /* TRANSFORM_STYLE_PREFIXED */], '');
  }
}

function getMaxDurationItemIndex(actionItems) {
  var maxDuration = 0;
  var resultIndex = 0;
  actionItems.forEach(function (actionItem, index) {
    var config = actionItem.config;

    var total = config.delay + config.duration;
    if (total >= maxDuration) {
      maxDuration = total;
      resultIndex = index;
    }
  });
  return resultIndex;
}

function getActionListProgress(actionList, instance) {
  var actionItemGroups = actionList.actionItemGroups,
      useFirstGroupAsInitialState = actionList.useFirstGroupAsInitialState;
  var instanceItem = instance.actionItem,
      _instance$verboseTime = instance.verboseTimeElapsed,
      verboseTimeElapsed = _instance$verboseTime === undefined ? 0 : _instance$verboseTime;

  var totalDuration = 0;
  var elapsedDuration = 0;
  actionItemGroups.forEach(function (group, index) {
    if (useFirstGroupAsInitialState && index === 0) {
      return;
    }
    var actionItems = group.actionItems;

    var carrierItem = actionItems[getMaxDurationItemIndex(actionItems)];
    var config = carrierItem.config,
        actionTypeId = carrierItem.actionTypeId;

    var isGeneral = /^GENERAL_/.test(actionTypeId);
    if (instanceItem.id === carrierItem.id) {
      elapsedDuration = totalDuration + verboseTimeElapsed;
    }
    var duration = isGeneral ? 0 : config.duration;
    totalDuration += config.delay + duration;
  });
  return totalDuration > 0 ? Object(__WEBPACK_IMPORTED_MODULE_4__IX2EasingUtils__["b" /* optimizeFloat */])(elapsedDuration / totalDuration) : 0;
}

function reduceListToGroup(_ref18) {
  var actionListId = _ref18.actionListId,
      actionItemId = _ref18.actionItemId,
      rawData = _ref18.rawData;
  var actionLists = rawData.actionLists;

  var actionList = actionLists[actionListId];
  var actionItemGroups = actionList.actionItemGroups,
      continuousParameterGroups = actionList.continuousParameterGroups;

  var newActionItems = [];

  var takeItemUntilMatch = function takeItemUntilMatch(actionItem) {
    newActionItems.push(__WEBPACK_IMPORTED_MODULE_3_immutability_helper___default()(actionItem, {
      config: { $merge: { delay: 0, duration: 0 } }
    }));
    return actionItem.id === actionItemId;
  };

  actionItemGroups && actionItemGroups.some(function (_ref19) {
    var actionItems = _ref19.actionItems;

    return actionItems.some(takeItemUntilMatch);
  });

  continuousParameterGroups && continuousParameterGroups.some(function (paramGroup) {
    var continuousActionGroups = paramGroup.continuousActionGroups;

    return continuousActionGroups.some(function (_ref20) {
      var actionItems = _ref20.actionItems;

      return actionItems.some(takeItemUntilMatch);
    });
  });

  return __WEBPACK_IMPORTED_MODULE_3_immutability_helper___default()(rawData, {
    actionLists: { $set: _defineProperty({}, actionListId, {
        id: actionListId,
        actionItemGroups: [{
          actionItems: newActionItems
        }]
      }) }
  });
}

function shouldNamespaceEventParameter(eventTypeId, _ref21) {
  var basedOn = _ref21.basedOn;

  return eventTypeId === __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["u" /* SCROLLING_IN_VIEW */] && (basedOn === __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["e" /* ELEMENT */] || basedOn == null) || eventTypeId === __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["h" /* MOUSE_MOVE */] && basedOn === __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["e" /* ELEMENT */];
}

function getNamespacedParameterId(eventStateKey, continuousParameterGroupId) {
  return eventStateKey + __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["h" /* COLON_DELIMITER */] + continuousParameterGroupId;
}

function shouldAllowMediaQuery(mediaQueries, mediaQueryKey) {
  // During design mode, current media query key does not exist
  if (mediaQueryKey == null) {
    return true;
  }
  return mediaQueries.indexOf(mediaQueryKey) !== -1;
}

function stringifyTarget(target) {
  if (typeof target === 'string') {
    return target;
  }
  var _target$id = target.id,
      id = _target$id === undefined ? '' : _target$id,
      _target$selector = target.selector,
      selector = _target$selector === undefined ? '' : _target$selector,
      _target$useEventTarge = target.useEventTarget,
      useEventTarget = _target$useEventTarge === undefined ? '' : _target$useEventTarge;

  return id + __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["d" /* BAR_DELIMITER */] + selector + __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["d" /* BAR_DELIMITER */] + useEventTarget;
}

/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return TRANSFORM_MOVE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return TRANSFORM_SCALE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return TRANSFORM_ROTATE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return TRANSFORM_SKEW; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return STYLE_OPACITY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return STYLE_SIZE; });
/* unused harmony export STYLE_BOX_SHADOW */
/* unused harmony export STYLE_FILTER */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return STYLE_BACKGROUND_COLOR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return STYLE_BORDER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return STYLE_TEXT_COLOR; });
/* unused harmony export GENERAL_COMBO_CLASS */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return GENERAL_DISPLAY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GENERAL_CONTINUOUS_ACTION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return GENERAL_START_ACTION; });
/* unused harmony export GENERAL_STOP_ACTION */
/* unused harmony export GENERAL_LOOP */
/* unused harmony export FADE_EFFECT */
/* unused harmony export SLIDE_EFFECT */
/* unused harmony export BLUR_EFFECT */
/* unused harmony export GROW_EFFECT */
/* unused harmony export GROW_BIG_EFFECT */
/* unused harmony export SHRINK_EFFECT */
/* unused harmony export SHRINK_BIG_EFFECT */
/* unused harmony export SPIN_EFFECT */
/* unused harmony export FLY_EFFECT */
/* unused harmony export POP_EFFECT */
/* unused harmony export FLIP_EFFECT */
/* unused harmony export JIGGLE_EFFECT */
/* unused harmony export PULSE_EFFECT */
/* unused harmony export DROP_EFFECT */
/* unused harmony export BLINK_EFFECT */
/* unused harmony export BOUNCE_EFFECT */
/* unused harmony export FLIP_LEFT_TO_RIGHT_EFFECT */
/* unused harmony export FLIP_RIGHT_TO_LEFT_EFFECT */
/* unused harmony export RUBBER_BAND_EFFECT */
/* unused harmony export JELLO_EFFECT */
var TRANSFORM_MOVE = 'TRANSFORM_MOVE';
var TRANSFORM_SCALE = 'TRANSFORM_SCALE';
var TRANSFORM_ROTATE = 'TRANSFORM_ROTATE';
var TRANSFORM_SKEW = 'TRANSFORM_SKEW';

var STYLE_OPACITY = 'STYLE_OPACITY';
var STYLE_SIZE = 'STYLE_SIZE';
var STYLE_BOX_SHADOW = 'STYLE_BOX_SHADOW';
var STYLE_FILTER = 'STYLE_FILTER';
var STYLE_BACKGROUND_COLOR = 'STYLE_BACKGROUND_COLOR';
var STYLE_BORDER = 'STYLE_BORDER';
var STYLE_TEXT_COLOR = 'STYLE_TEXT_COLOR';

var GENERAL_COMBO_CLASS = 'GENERAL_COMBO_CLASS';
var GENERAL_DISPLAY = 'GENERAL_DISPLAY';
var GENERAL_CONTINUOUS_ACTION = 'GENERAL_CONTINUOUS_ACTION';
var GENERAL_START_ACTION = 'GENERAL_START_ACTION';
var GENERAL_STOP_ACTION = 'GENERAL_STOP_ACTION';
var GENERAL_LOOP = 'GENERAL_LOOP';

var FADE_EFFECT = 'FADE_EFFECT';
var SLIDE_EFFECT = 'SLIDE_EFFECT';
var BLUR_EFFECT = 'BLUR_EFFECT';
var GROW_EFFECT = 'GROW_EFFECT';
var GROW_BIG_EFFECT = 'GROW_BIG_EFFECT';
var SHRINK_EFFECT = 'SHRINK_EFFECT';
var SHRINK_BIG_EFFECT = 'SHRINK_BIG_EFFECT';
var SPIN_EFFECT = 'SPIN_EFFECT';
var FLY_EFFECT = 'FLY_EFFECT';
var POP_EFFECT = 'POP_EFFECT';
var FLIP_EFFECT = 'FLIP_EFFECT';
var JIGGLE_EFFECT = 'JIGGLE_EFFECT';
var PULSE_EFFECT = 'PULSE_EFFECT';
var DROP_EFFECT = 'DROP_EFFECT';
var BLINK_EFFECT = 'BLINK_EFFECT';
var BOUNCE_EFFECT = 'BOUNCE_EFFECT';
var FLIP_LEFT_TO_RIGHT_EFFECT = 'FLIP_LEFT_TO_RIGHT_EFFECT';
var FLIP_RIGHT_TO_LEFT_EFFECT = 'FLIP_RIGHT_TO_LEFT_EFFECT';
var RUBBER_BAND_EFFECT = 'RUBBER_BAND_EFFECT';
var JELLO_EFFECT = 'JELLO_EFFECT';

/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return MOUSE_CLICK; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return MOUSE_SECOND_CLICK; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return MOUSE_DOWN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return MOUSE_UP; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return MOUSE_OVER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return MOUSE_OUT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return MOUSE_MOVE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "v", function() { return SCROLL_INTO_VIEW; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "w", function() { return SCROLL_OUT_OF_VIEW; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "u", function() { return SCROLLING_IN_VIEW; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "z", function() { return TAB_ACTIVE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "A", function() { return TAB_INACTIVE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return NAVBAR_OPEN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return NAVBAR_CLOSE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "x", function() { return SLIDER_ACTIVE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "y", function() { return SLIDER_INACTIVE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return DROPDOWN_OPEN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return DROPDOWN_CLOSE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return COMPONENT_ACTIVE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return COMPONENT_INACTIVE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return PAGE_START; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return PAGE_FINISH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "s", function() { return PAGE_SCROLL_UP; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "r", function() { return PAGE_SCROLL_DOWN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "q", function() { return PAGE_SCROLL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return ELEMENT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "B", function() { return VIEWPORT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return PAGE; });
var MOUSE_CLICK = 'MOUSE_CLICK';
var MOUSE_SECOND_CLICK = 'MOUSE_SECOND_CLICK';
var MOUSE_DOWN = 'MOUSE_DOWN';
var MOUSE_UP = 'MOUSE_UP';
var MOUSE_OVER = 'MOUSE_OVER';
var MOUSE_OUT = 'MOUSE_OUT';
var MOUSE_MOVE = 'MOUSE_MOVE';

var SCROLL_INTO_VIEW = 'SCROLL_INTO_VIEW';
var SCROLL_OUT_OF_VIEW = 'SCROLL_OUT_OF_VIEW';
var SCROLLING_IN_VIEW = 'SCROLLING_IN_VIEW';

var TAB_ACTIVE = 'TAB_ACTIVE';
var TAB_INACTIVE = 'TAB_INACTIVE';
var NAVBAR_OPEN = 'NAVBAR_OPEN';
var NAVBAR_CLOSE = 'NAVBAR_CLOSE';
var SLIDER_ACTIVE = 'SLIDER_ACTIVE';
var SLIDER_INACTIVE = 'SLIDER_INACTIVE';
var DROPDOWN_OPEN = 'DROPDOWN_OPEN';
var DROPDOWN_CLOSE = 'DROPDOWN_CLOSE';
var COMPONENT_ACTIVE = 'COMPONENT_ACTIVE';
var COMPONENT_INACTIVE = 'COMPONENT_INACTIVE';

var PAGE_START = 'PAGE_START';
var PAGE_FINISH = 'PAGE_FINISH';
var PAGE_SCROLL_UP = 'PAGE_SCROLL_UP';
var PAGE_SCROLL_DOWN = 'PAGE_SCROLL_DOWN';
var PAGE_SCROLL = 'PAGE_SCROLL';

var ELEMENT = 'ELEMENT';
var VIEWPORT = 'VIEWPORT';
var PAGE = 'PAGE';

/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rawDataImported", function() { return rawDataImported; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sessionInitialized", function() { return sessionInitialized; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sessionStarted", function() { return sessionStarted; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sessionStopped", function() { return sessionStopped; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "previewRequested", function() { return previewRequested; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "playbackRequested", function() { return playbackRequested; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stopRequested", function() { return stopRequested; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clearRequested", function() { return clearRequested; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "eventListenerAdded", function() { return eventListenerAdded; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "eventStateChanged", function() { return eventStateChanged; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "animationFrameChanged", function() { return animationFrameChanged; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parameterChanged", function() { return parameterChanged; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "instanceAdded", function() { return instanceAdded; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "instanceStarted", function() { return instanceStarted; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "instanceRemoved", function() { return instanceRemoved; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "actionListPlaybackChanged", function() { return actionListPlaybackChanged; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "viewportWidthChanged", function() { return viewportWidthChanged; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__constants_IX2EngineItemTypes__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__logic_IX2VanillaUtils__ = __webpack_require__(41);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };







var rawDataImported = function rawDataImported(rawData) {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["l" /* IX2_RAW_DATA_IMPORTED */],
    payload: _extends({}, Object(__WEBPACK_IMPORTED_MODULE_2__logic_IX2VanillaUtils__["l" /* reifyState */])(rawData))
  };
};

var sessionInitialized = function sessionInitialized(_ref) {
  var hasBoundaryNodes = _ref.hasBoundaryNodes;
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["m" /* IX2_SESSION_INITIALIZED */],
    payload: {
      hasBoundaryNodes: hasBoundaryNodes
    }
  };
};

var sessionStarted = function sessionStarted() {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["n" /* IX2_SESSION_STARTED */],
    payload: {}
  };
};

var sessionStopped = function sessionStopped() {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["o" /* IX2_SESSION_STOPPED */],
    payload: {}
  };
};

var previewRequested = function previewRequested(_ref2) {
  var rawData = _ref2.rawData;
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["k" /* IX2_PREVIEW_REQUESTED */],
    payload: {
      rawData: rawData
    }
  };
};

var playbackRequested = function playbackRequested(_ref3) {
  var _ref3$actionTypeId = _ref3.actionTypeId,
      actionTypeId = _ref3$actionTypeId === undefined ? __WEBPACK_IMPORTED_MODULE_1__constants_IX2EngineItemTypes__["c" /* GENERAL_START_ACTION */] : _ref3$actionTypeId,
      actionListId = _ref3.actionListId,
      actionItemId = _ref3.actionItemId,
      eventId = _ref3.eventId,
      allowEvents = _ref3.allowEvents,
      immediate = _ref3.immediate,
      verbose = _ref3.verbose,
      rawData = _ref3.rawData;
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["j" /* IX2_PLAYBACK_REQUESTED */],
    payload: {
      actionTypeId: actionTypeId,
      actionListId: actionListId,
      actionItemId: actionItemId,
      eventId: eventId,
      allowEvents: allowEvents,
      immediate: immediate,
      verbose: verbose,
      rawData: rawData
    }
  };
};

var stopRequested = function stopRequested(actionListId) {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["p" /* IX2_STOP_REQUESTED */],
    payload: {
      actionListId: actionListId
    }
  };
};

var clearRequested = function clearRequested() {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["c" /* IX2_CLEAR_REQUESTED */],
    payload: {}
  };
};

var eventListenerAdded = function eventListenerAdded(target, listenerParams) {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["d" /* IX2_EVENT_LISTENER_ADDED */],
    payload: {
      target: target,
      listenerParams: listenerParams
    }
  };
};

var eventStateChanged = function eventStateChanged(stateKey, newState) {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["e" /* IX2_EVENT_STATE_CHANGED */],
    payload: {
      stateKey: stateKey,
      newState: newState
    }
  };
};

var animationFrameChanged = function animationFrameChanged(now, parameters) {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["b" /* IX2_ANIMATION_FRAME_CHANGED */],
    payload: {
      now: now,
      parameters: parameters
    }
  };
};

var parameterChanged = function parameterChanged(key, value) {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["i" /* IX2_PARAMETER_CHANGED */],
    payload: {
      key: key,
      value: value
    }
  };
};

var instanceAdded = function instanceAdded(options) {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["f" /* IX2_INSTANCE_ADDED */],
    payload: _extends({}, options)
  };
};

var instanceStarted = function instanceStarted(instanceId) {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["h" /* IX2_INSTANCE_STARTED */],
    payload: {
      instanceId: instanceId
    }
  };
};

var instanceRemoved = function instanceRemoved(instanceId) {
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["g" /* IX2_INSTANCE_REMOVED */],
    payload: {
      instanceId: instanceId
    }
  };
};

var actionListPlaybackChanged = function actionListPlaybackChanged(_ref4) {
  var actionListId = _ref4.actionListId,
      isPlaying = _ref4.isPlaying;
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["a" /* IX2_ACTION_LIST_PLAYBACK_CHANGED */],
    payload: {
      actionListId: actionListId,
      isPlaying: isPlaying
    }
  };
};

var viewportWidthChanged = function viewportWidthChanged(_ref5) {
  var width = _ref5.width,
      mediaQueries = _ref5.mediaQueries;
  return {
    type: __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["q" /* IX2_VIEWPORT_WIDTH_CHANGED */],
    payload: {
      width: width,
      mediaQueries: mediaQueries
    }
  };
};

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var baseCreate = __webpack_require__(82),
    baseLodash = __webpack_require__(46);

/**
 * The base constructor for creating `lodash` wrapper objects.
 *
 * @private
 * @param {*} value The value to wrap.
 * @param {boolean} [chainAll] Enable explicit method chain sequences.
 */
function LodashWrapper(value, chainAll) {
  this.__wrapped__ = value;
  this.__actions__ = [];
  this.__chain__ = !!chainAll;
  this.__index__ = 0;
  this.__values__ = undefined;
}

LodashWrapper.prototype = baseCreate(baseLodash.prototype);
LodashWrapper.prototype.constructor = LodashWrapper;

module.exports = LodashWrapper;


/***/ }),
/* 46 */
/***/ (function(module, exports) {

/**
 * The function whose prototype chain sequence wrappers inherit from.
 *
 * @private
 */
function baseLodash() {
  // No operation performed.
}

module.exports = baseLodash;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var baseCreate = __webpack_require__(82),
    baseLodash = __webpack_require__(46);

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH = 4294967295;

/**
 * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
 *
 * @private
 * @constructor
 * @param {*} value The value to wrap.
 */
function LazyWrapper(value) {
  this.__wrapped__ = value;
  this.__actions__ = [];
  this.__dir__ = 1;
  this.__filtered__ = false;
  this.__iteratees__ = [];
  this.__takeCount__ = MAX_ARRAY_LENGTH;
  this.__views__ = [];
}

// Ensure `LazyWrapper` is an instance of `baseLodash`.
LazyWrapper.prototype = baseCreate(baseLodash.prototype);
LazyWrapper.prototype.constructor = LazyWrapper;

module.exports = LazyWrapper;


/***/ }),
/* 48 */
/***/ (function(module, exports) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * tram.js v0.8.2-global
 * Cross-browser CSS3 transitions in JavaScript
 * https://github.com/bkwld/tram
 * MIT License
 */
window.tram = function (a) {
  function b(a, b) {
    var c = new M.Bare();return c.init(a, b);
  }function c(a) {
    return a.replace(/[A-Z]/g, function (a) {
      return "-" + a.toLowerCase();
    });
  }function d(a) {
    var b = parseInt(a.slice(1), 16),
        c = b >> 16 & 255,
        d = b >> 8 & 255,
        e = 255 & b;return [c, d, e];
  }function e(a, b, c) {
    return "#" + (1 << 24 | a << 16 | b << 8 | c).toString(16).slice(1);
  }function f() {}function g(a, b) {
    j("Type warning: Expected: [" + a + "] Got: [" + (typeof b === "undefined" ? "undefined" : _typeof(b)) + "] " + b);
  }function h(a, b, c) {
    j("Units do not match [" + a + "]: " + b + ", " + c);
  }function i(a, b, c) {
    if (void 0 !== b && (c = b), void 0 === a) return c;var d = c;return $.test(a) || !_.test(a) ? d = parseInt(a, 10) : _.test(a) && (d = 1e3 * parseFloat(a)), 0 > d && (d = 0), d === d ? d : c;
  }function j(a) {
    U.debug && window && window.console.warn(a);
  }function k(a) {
    for (var b = -1, c = a ? a.length : 0, d = []; ++b < c;) {
      var e = a[b];e && d.push(e);
    }return d;
  }var l = function (a, b, c) {
    function d(a) {
      return "object" == (typeof a === "undefined" ? "undefined" : _typeof(a));
    }function e(a) {
      return "function" == typeof a;
    }function f() {}function g(h, i) {
      function j() {
        var a = new k();return e(a.init) && a.init.apply(a, arguments), a;
      }function k() {}i === c && (i = h, h = Object), j.Bare = k;var l,
          m = f[a] = h[a],
          n = k[a] = j[a] = new f();return n.constructor = j, j.mixin = function (b) {
        return k[a] = j[a] = g(j, b)[a], j;
      }, j.open = function (a) {
        if (l = {}, e(a) ? l = a.call(j, n, m, j, h) : d(a) && (l = a), d(l)) for (var c in l) {
          b.call(l, c) && (n[c] = l[c]);
        }return e(n.init) || (n.init = h), j;
      }, j.open(i);
    }return g;
  }("prototype", {}.hasOwnProperty),
      m = { ease: ["ease", function (a, b, c, d) {
      var e = (a /= d) * a,
          f = e * a;return b + c * (-2.75 * f * e + 11 * e * e + -15.5 * f + 8 * e + .25 * a);
    }], "ease-in": ["ease-in", function (a, b, c, d) {
      var e = (a /= d) * a,
          f = e * a;return b + c * (-1 * f * e + 3 * e * e + -3 * f + 2 * e);
    }], "ease-out": ["ease-out", function (a, b, c, d) {
      var e = (a /= d) * a,
          f = e * a;return b + c * (.3 * f * e + -1.6 * e * e + 2.2 * f + -1.8 * e + 1.9 * a);
    }], "ease-in-out": ["ease-in-out", function (a, b, c, d) {
      var e = (a /= d) * a,
          f = e * a;return b + c * (2 * f * e + -5 * e * e + 2 * f + 2 * e);
    }], linear: ["linear", function (a, b, c, d) {
      return c * a / d + b;
    }], "ease-in-quad": ["cubic-bezier(0.550, 0.085, 0.680, 0.530)", function (a, b, c, d) {
      return c * (a /= d) * a + b;
    }], "ease-out-quad": ["cubic-bezier(0.250, 0.460, 0.450, 0.940)", function (a, b, c, d) {
      return -c * (a /= d) * (a - 2) + b;
    }], "ease-in-out-quad": ["cubic-bezier(0.455, 0.030, 0.515, 0.955)", function (a, b, c, d) {
      return (a /= d / 2) < 1 ? c / 2 * a * a + b : -c / 2 * (--a * (a - 2) - 1) + b;
    }], "ease-in-cubic": ["cubic-bezier(0.550, 0.055, 0.675, 0.190)", function (a, b, c, d) {
      return c * (a /= d) * a * a + b;
    }], "ease-out-cubic": ["cubic-bezier(0.215, 0.610, 0.355, 1)", function (a, b, c, d) {
      return c * ((a = a / d - 1) * a * a + 1) + b;
    }], "ease-in-out-cubic": ["cubic-bezier(0.645, 0.045, 0.355, 1)", function (a, b, c, d) {
      return (a /= d / 2) < 1 ? c / 2 * a * a * a + b : c / 2 * ((a -= 2) * a * a + 2) + b;
    }], "ease-in-quart": ["cubic-bezier(0.895, 0.030, 0.685, 0.220)", function (a, b, c, d) {
      return c * (a /= d) * a * a * a + b;
    }], "ease-out-quart": ["cubic-bezier(0.165, 0.840, 0.440, 1)", function (a, b, c, d) {
      return -c * ((a = a / d - 1) * a * a * a - 1) + b;
    }], "ease-in-out-quart": ["cubic-bezier(0.770, 0, 0.175, 1)", function (a, b, c, d) {
      return (a /= d / 2) < 1 ? c / 2 * a * a * a * a + b : -c / 2 * ((a -= 2) * a * a * a - 2) + b;
    }], "ease-in-quint": ["cubic-bezier(0.755, 0.050, 0.855, 0.060)", function (a, b, c, d) {
      return c * (a /= d) * a * a * a * a + b;
    }], "ease-out-quint": ["cubic-bezier(0.230, 1, 0.320, 1)", function (a, b, c, d) {
      return c * ((a = a / d - 1) * a * a * a * a + 1) + b;
    }], "ease-in-out-quint": ["cubic-bezier(0.860, 0, 0.070, 1)", function (a, b, c, d) {
      return (a /= d / 2) < 1 ? c / 2 * a * a * a * a * a + b : c / 2 * ((a -= 2) * a * a * a * a + 2) + b;
    }], "ease-in-sine": ["cubic-bezier(0.470, 0, 0.745, 0.715)", function (a, b, c, d) {
      return -c * Math.cos(a / d * (Math.PI / 2)) + c + b;
    }], "ease-out-sine": ["cubic-bezier(0.390, 0.575, 0.565, 1)", function (a, b, c, d) {
      return c * Math.sin(a / d * (Math.PI / 2)) + b;
    }], "ease-in-out-sine": ["cubic-bezier(0.445, 0.050, 0.550, 0.950)", function (a, b, c, d) {
      return -c / 2 * (Math.cos(Math.PI * a / d) - 1) + b;
    }], "ease-in-expo": ["cubic-bezier(0.950, 0.050, 0.795, 0.035)", function (a, b, c, d) {
      return 0 === a ? b : c * Math.pow(2, 10 * (a / d - 1)) + b;
    }], "ease-out-expo": ["cubic-bezier(0.190, 1, 0.220, 1)", function (a, b, c, d) {
      return a === d ? b + c : c * (-Math.pow(2, -10 * a / d) + 1) + b;
    }], "ease-in-out-expo": ["cubic-bezier(1, 0, 0, 1)", function (a, b, c, d) {
      return 0 === a ? b : a === d ? b + c : (a /= d / 2) < 1 ? c / 2 * Math.pow(2, 10 * (a - 1)) + b : c / 2 * (-Math.pow(2, -10 * --a) + 2) + b;
    }], "ease-in-circ": ["cubic-bezier(0.600, 0.040, 0.980, 0.335)", function (a, b, c, d) {
      return -c * (Math.sqrt(1 - (a /= d) * a) - 1) + b;
    }], "ease-out-circ": ["cubic-bezier(0.075, 0.820, 0.165, 1)", function (a, b, c, d) {
      return c * Math.sqrt(1 - (a = a / d - 1) * a) + b;
    }], "ease-in-out-circ": ["cubic-bezier(0.785, 0.135, 0.150, 0.860)", function (a, b, c, d) {
      return (a /= d / 2) < 1 ? -c / 2 * (Math.sqrt(1 - a * a) - 1) + b : c / 2 * (Math.sqrt(1 - (a -= 2) * a) + 1) + b;
    }], "ease-in-back": ["cubic-bezier(0.600, -0.280, 0.735, 0.045)", function (a, b, c, d, e) {
      return void 0 === e && (e = 1.70158), c * (a /= d) * a * ((e + 1) * a - e) + b;
    }], "ease-out-back": ["cubic-bezier(0.175, 0.885, 0.320, 1.275)", function (a, b, c, d, e) {
      return void 0 === e && (e = 1.70158), c * ((a = a / d - 1) * a * ((e + 1) * a + e) + 1) + b;
    }], "ease-in-out-back": ["cubic-bezier(0.680, -0.550, 0.265, 1.550)", function (a, b, c, d, e) {
      return void 0 === e && (e = 1.70158), (a /= d / 2) < 1 ? c / 2 * a * a * (((e *= 1.525) + 1) * a - e) + b : c / 2 * ((a -= 2) * a * (((e *= 1.525) + 1) * a + e) + 2) + b;
    }] },
      n = { "ease-in-back": "cubic-bezier(0.600, 0, 0.735, 0.045)", "ease-out-back": "cubic-bezier(0.175, 0.885, 0.320, 1)", "ease-in-out-back": "cubic-bezier(0.680, 0, 0.265, 1)" },
      o = document,
      p = window,
      q = "bkwld-tram",
      r = /[\-\.0-9]/g,
      s = /[A-Z]/,
      t = "number",
      u = /^(rgb|#)/,
      v = /(em|cm|mm|in|pt|pc|px)$/,
      w = /(em|cm|mm|in|pt|pc|px|%)$/,
      x = /(deg|rad|turn)$/,
      y = "unitless",
      z = /(all|none) 0s ease 0s/,
      A = /^(width|height)$/,
      B = " ",
      C = o.createElement("a"),
      D = ["Webkit", "Moz", "O", "ms"],
      E = ["-webkit-", "-moz-", "-o-", "-ms-"],
      F = function F(a) {
    if (a in C.style) return { dom: a, css: a };var b,
        c,
        d = "",
        e = a.split("-");for (b = 0; b < e.length; b++) {
      d += e[b].charAt(0).toUpperCase() + e[b].slice(1);
    }for (b = 0; b < D.length; b++) {
      if (c = D[b] + d, c in C.style) return { dom: c, css: E[b] + a };
    }
  },
      G = b.support = { bind: Function.prototype.bind, transform: F("transform"), transition: F("transition"), backface: F("backface-visibility"), timing: F("transition-timing-function") };if (G.transition) {
    var H = G.timing.dom;if (C.style[H] = m["ease-in-back"][0], !C.style[H]) for (var I in n) {
      m[I][0] = n[I];
    }
  }var J = b.frame = function () {
    var a = p.requestAnimationFrame || p.webkitRequestAnimationFrame || p.mozRequestAnimationFrame || p.oRequestAnimationFrame || p.msRequestAnimationFrame;return a && G.bind ? a.bind(p) : function (a) {
      p.setTimeout(a, 16);
    };
  }(),
      K = b.now = function () {
    var a = p.performance,
        b = a && (a.now || a.webkitNow || a.msNow || a.mozNow);return b && G.bind ? b.bind(a) : Date.now || function () {
      return +new Date();
    };
  }(),
      L = l(function (b) {
    function d(a, b) {
      var c = k(("" + a).split(B)),
          d = c[0];b = b || {};var e = Y[d];if (!e) return j("Unsupported property: " + d);if (!b.weak || !this.props[d]) {
        var f = e[0],
            g = this.props[d];return g || (g = this.props[d] = new f.Bare()), g.init(this.$el, c, e, b), g;
      }
    }function e(a, b, c) {
      if (a) {
        var e = typeof a === "undefined" ? "undefined" : _typeof(a);if (b || (this.timer && this.timer.destroy(), this.queue = [], this.active = !1), "number" == e && b) return this.timer = new S({ duration: a, context: this, complete: h }), void (this.active = !0);if ("string" == e && b) {
          switch (a) {case "hide":
              o.call(this);break;case "stop":
              l.call(this);break;case "redraw":
              p.call(this);break;default:
              d.call(this, a, c && c[1]);}return h.call(this);
        }if ("function" == e) return void a.call(this, this);if ("object" == e) {
          var f = 0;u.call(this, a, function (a, b) {
            a.span > f && (f = a.span), a.stop(), a.animate(b);
          }, function (a) {
            "wait" in a && (f = i(a.wait, 0));
          }), t.call(this), f > 0 && (this.timer = new S({ duration: f, context: this }), this.active = !0, b && (this.timer.complete = h));var g = this,
              j = !1,
              k = {};J(function () {
            u.call(g, a, function (a) {
              a.active && (j = !0, k[a.name] = a.nextStyle);
            }), j && g.$el.css(k);
          });
        }
      }
    }function f(a) {
      a = i(a, 0), this.active ? this.queue.push({ options: a }) : (this.timer = new S({ duration: a, context: this, complete: h }), this.active = !0);
    }function g(a) {
      return this.active ? (this.queue.push({ options: a, args: arguments }), void (this.timer.complete = h)) : j("No active transition timer. Use start() or wait() before then().");
    }function h() {
      if (this.timer && this.timer.destroy(), this.active = !1, this.queue.length) {
        var a = this.queue.shift();e.call(this, a.options, !0, a.args);
      }
    }function l(a) {
      this.timer && this.timer.destroy(), this.queue = [], this.active = !1;var b;"string" == typeof a ? (b = {}, b[a] = 1) : b = "object" == (typeof a === "undefined" ? "undefined" : _typeof(a)) && null != a ? a : this.props, u.call(this, b, v), t.call(this);
    }function m(a) {
      l.call(this, a), u.call(this, a, w, x);
    }function n(a) {
      "string" != typeof a && (a = "block"), this.el.style.display = a;
    }function o() {
      l.call(this), this.el.style.display = "none";
    }function p() {
      this.el.offsetHeight;
    }function r() {
      l.call(this), a.removeData(this.el, q), this.$el = this.el = null;
    }function t() {
      var a,
          b,
          c = [];this.upstream && c.push(this.upstream);for (a in this.props) {
        b = this.props[a], b.active && c.push(b.string);
      }c = c.join(","), this.style !== c && (this.style = c, this.el.style[G.transition.dom] = c);
    }function u(a, b, e) {
      var f,
          g,
          h,
          i,
          j = b !== v,
          k = {};for (f in a) {
        h = a[f], f in Z ? (k.transform || (k.transform = {}), k.transform[f] = h) : (s.test(f) && (f = c(f)), f in Y ? k[f] = h : (i || (i = {}), i[f] = h));
      }for (f in k) {
        if (h = k[f], g = this.props[f], !g) {
          if (!j) continue;g = d.call(this, f);
        }b.call(this, g, h);
      }e && i && e.call(this, i);
    }function v(a) {
      a.stop();
    }function w(a, b) {
      a.set(b);
    }function x(a) {
      this.$el.css(a);
    }function y(a, c) {
      b[a] = function () {
        return this.children ? A.call(this, c, arguments) : (this.el && c.apply(this, arguments), this);
      };
    }function A(a, b) {
      var c,
          d = this.children.length;for (c = 0; d > c; c++) {
        a.apply(this.children[c], b);
      }return this;
    }b.init = function (b) {
      if (this.$el = a(b), this.el = this.$el[0], this.props = {}, this.queue = [], this.style = "", this.active = !1, U.keepInherited && !U.fallback) {
        var c = W(this.el, "transition");c && !z.test(c) && (this.upstream = c);
      }G.backface && U.hideBackface && V(this.el, G.backface.css, "hidden");
    }, y("add", d), y("start", e), y("wait", f), y("then", g), y("next", h), y("stop", l), y("set", m), y("show", n), y("hide", o), y("redraw", p), y("destroy", r);
  }),
      M = l(L, function (b) {
    function c(b, c) {
      var d = a.data(b, q) || a.data(b, q, new L.Bare());return d.el || d.init(b), c ? d.start(c) : d;
    }b.init = function (b, d) {
      var e = a(b);if (!e.length) return this;if (1 === e.length) return c(e[0], d);var f = [];return e.each(function (a, b) {
        f.push(c(b, d));
      }), this.children = f, this;
    };
  }),
      N = l(function (a) {
    function b() {
      var a = this.get();this.update("auto");var b = this.get();return this.update(a), b;
    }function c(a, b, c) {
      return void 0 !== b && (c = b), a in m ? a : c;
    }function d(a) {
      var b = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(a);return (b ? e(b[1], b[2], b[3]) : a).replace(/#(\w)(\w)(\w)$/, "#$1$1$2$2$3$3");
    }var f = { duration: 500, ease: "ease", delay: 0 };a.init = function (a, b, d, e) {
      this.$el = a, this.el = a[0];var g = b[0];d[2] && (g = d[2]), X[g] && (g = X[g]), this.name = g, this.type = d[1], this.duration = i(b[1], this.duration, f.duration), this.ease = c(b[2], this.ease, f.ease), this.delay = i(b[3], this.delay, f.delay), this.span = this.duration + this.delay, this.active = !1, this.nextStyle = null, this.auto = A.test(this.name), this.unit = e.unit || this.unit || U.defaultUnit, this.angle = e.angle || this.angle || U.defaultAngle, U.fallback || e.fallback ? this.animate = this.fallback : (this.animate = this.transition, this.string = this.name + B + this.duration + "ms" + ("ease" != this.ease ? B + m[this.ease][0] : "") + (this.delay ? B + this.delay + "ms" : ""));
    }, a.set = function (a) {
      a = this.convert(a, this.type), this.update(a), this.redraw();
    }, a.transition = function (a) {
      this.active = !0, a = this.convert(a, this.type), this.auto && ("auto" == this.el.style[this.name] && (this.update(this.get()), this.redraw()), "auto" == a && (a = b.call(this))), this.nextStyle = a;
    }, a.fallback = function (a) {
      var c = this.el.style[this.name] || this.convert(this.get(), this.type);a = this.convert(a, this.type), this.auto && ("auto" == c && (c = this.convert(this.get(), this.type)), "auto" == a && (a = b.call(this))), this.tween = new R({ from: c, to: a, duration: this.duration, delay: this.delay, ease: this.ease, update: this.update, context: this });
    }, a.get = function () {
      return W(this.el, this.name);
    }, a.update = function (a) {
      V(this.el, this.name, a);
    }, a.stop = function () {
      (this.active || this.nextStyle) && (this.active = !1, this.nextStyle = null, V(this.el, this.name, this.get()));var a = this.tween;a && a.context && a.destroy();
    }, a.convert = function (a, b) {
      if ("auto" == a && this.auto) return a;var c,
          e = "number" == typeof a,
          f = "string" == typeof a;switch (b) {case t:
          if (e) return a;if (f && "" === a.replace(r, "")) return +a;c = "number(unitless)";break;case u:
          if (f) {
            if ("" === a && this.original) return this.original;if (b.test(a)) return "#" == a.charAt(0) && 7 == a.length ? a : d(a);
          }c = "hex or rgb string";break;case v:
          if (e) return a + this.unit;if (f && b.test(a)) return a;c = "number(px) or string(unit)";break;case w:
          if (e) return a + this.unit;if (f && b.test(a)) return a;c = "number(px) or string(unit or %)";break;case x:
          if (e) return a + this.angle;if (f && b.test(a)) return a;c = "number(deg) or string(angle)";break;case y:
          if (e) return a;if (f && w.test(a)) return a;c = "number(unitless) or string(unit or %)";}return g(c, a), a;
    }, a.redraw = function () {
      this.el.offsetHeight;
    };
  }),
      O = l(N, function (a, b) {
    a.init = function () {
      b.init.apply(this, arguments), this.original || (this.original = this.convert(this.get(), u));
    };
  }),
      P = l(N, function (a, b) {
    a.init = function () {
      b.init.apply(this, arguments), this.animate = this.fallback;
    }, a.get = function () {
      return this.$el[this.name]();
    }, a.update = function (a) {
      this.$el[this.name](a);
    };
  }),
      Q = l(N, function (a, b) {
    function c(a, b) {
      var c, d, e, f, g;for (c in a) {
        f = Z[c], e = f[0], d = f[1] || c, g = this.convert(a[c], e), b.call(this, d, g, e);
      }
    }a.init = function () {
      b.init.apply(this, arguments), this.current || (this.current = {}, Z.perspective && U.perspective && (this.current.perspective = U.perspective, V(this.el, this.name, this.style(this.current)), this.redraw()));
    }, a.set = function (a) {
      c.call(this, a, function (a, b) {
        this.current[a] = b;
      }), V(this.el, this.name, this.style(this.current)), this.redraw();
    }, a.transition = function (a) {
      var b = this.values(a);this.tween = new T({ current: this.current, values: b, duration: this.duration, delay: this.delay, ease: this.ease });var c,
          d = {};for (c in this.current) {
        d[c] = c in b ? b[c] : this.current[c];
      }this.active = !0, this.nextStyle = this.style(d);
    }, a.fallback = function (a) {
      var b = this.values(a);this.tween = new T({ current: this.current, values: b, duration: this.duration, delay: this.delay, ease: this.ease, update: this.update, context: this });
    }, a.update = function () {
      V(this.el, this.name, this.style(this.current));
    }, a.style = function (a) {
      var b,
          c = "";for (b in a) {
        c += b + "(" + a[b] + ") ";
      }return c;
    }, a.values = function (a) {
      var b,
          d = {};return c.call(this, a, function (a, c, e) {
        d[a] = c, void 0 === this.current[a] && (b = 0, ~a.indexOf("scale") && (b = 1), this.current[a] = this.convert(b, e));
      }), d;
    };
  }),
      R = l(function (b) {
    function c(a) {
      1 === n.push(a) && J(g);
    }function g() {
      var a,
          b,
          c,
          d = n.length;if (d) for (J(g), b = K(), a = d; a--;) {
        c = n[a], c && c.render(b);
      }
    }function i(b) {
      var c,
          d = a.inArray(b, n);d >= 0 && (c = n.slice(d + 1), n.length = d, c.length && (n = n.concat(c)));
    }function j(a) {
      return Math.round(a * o) / o;
    }function k(a, b, c) {
      return e(a[0] + c * (b[0] - a[0]), a[1] + c * (b[1] - a[1]), a[2] + c * (b[2] - a[2]));
    }var l = { ease: m.ease[1], from: 0, to: 1 };b.init = function (a) {
      this.duration = a.duration || 0, this.delay = a.delay || 0;var b = a.ease || l.ease;m[b] && (b = m[b][1]), "function" != typeof b && (b = l.ease), this.ease = b, this.update = a.update || f, this.complete = a.complete || f, this.context = a.context || this, this.name = a.name;var c = a.from,
          d = a.to;void 0 === c && (c = l.from), void 0 === d && (d = l.to), this.unit = a.unit || "", "number" == typeof c && "number" == typeof d ? (this.begin = c, this.change = d - c) : this.format(d, c), this.value = this.begin + this.unit, this.start = K(), a.autoplay !== !1 && this.play();
    }, b.play = function () {
      this.active || (this.start || (this.start = K()), this.active = !0, c(this));
    }, b.stop = function () {
      this.active && (this.active = !1, i(this));
    }, b.render = function (a) {
      var b,
          c = a - this.start;if (this.delay) {
        if (c <= this.delay) return;c -= this.delay;
      }if (c < this.duration) {
        var d = this.ease(c, 0, 1, this.duration);return b = this.startRGB ? k(this.startRGB, this.endRGB, d) : j(this.begin + d * this.change), this.value = b + this.unit, void this.update.call(this.context, this.value);
      }b = this.endHex || this.begin + this.change, this.value = b + this.unit, this.update.call(this.context, this.value), this.complete.call(this.context), this.destroy();
    }, b.format = function (a, b) {
      if (b += "", a += "", "#" == a.charAt(0)) return this.startRGB = d(b), this.endRGB = d(a), this.endHex = a, this.begin = 0, void (this.change = 1);if (!this.unit) {
        var c = b.replace(r, ""),
            e = a.replace(r, "");c !== e && h("tween", b, a), this.unit = c;
      }b = parseFloat(b), a = parseFloat(a), this.begin = this.value = b, this.change = a - b;
    }, b.destroy = function () {
      this.stop(), this.context = null, this.ease = this.update = this.complete = f;
    };var n = [],
        o = 1e3;
  }),
      S = l(R, function (a) {
    a.init = function (a) {
      this.duration = a.duration || 0, this.complete = a.complete || f, this.context = a.context, this.play();
    }, a.render = function (a) {
      var b = a - this.start;b < this.duration || (this.complete.call(this.context), this.destroy());
    };
  }),
      T = l(R, function (a, b) {
    a.init = function (a) {
      this.context = a.context, this.update = a.update, this.tweens = [], this.current = a.current;var b, c;for (b in a.values) {
        c = a.values[b], this.current[b] !== c && this.tweens.push(new R({ name: b, from: this.current[b], to: c, duration: a.duration, delay: a.delay, ease: a.ease, autoplay: !1 }));
      }this.play();
    }, a.render = function (a) {
      var b,
          c,
          d = this.tweens.length,
          e = !1;for (b = d; b--;) {
        c = this.tweens[b], c.context && (c.render(a), this.current[c.name] = c.value, e = !0);
      }return e ? void (this.update && this.update.call(this.context)) : this.destroy();
    }, a.destroy = function () {
      if (b.destroy.call(this), this.tweens) {
        var a,
            c = this.tweens.length;for (a = c; a--;) {
          this.tweens[a].destroy();
        }this.tweens = null, this.current = null;
      }
    };
  }),
      U = b.config = { debug: !1, defaultUnit: "px", defaultAngle: "deg", keepInherited: !1, hideBackface: !1, perspective: "", fallback: !G.transition, agentTests: [] };b.fallback = function (a) {
    if (!G.transition) return U.fallback = !0;U.agentTests.push("(" + a + ")");var b = new RegExp(U.agentTests.join("|"), "i");U.fallback = b.test(navigator.userAgent);
  }, b.fallback("6.0.[2-5] Safari"), b.tween = function (a) {
    return new R(a);
  }, b.delay = function (a, b, c) {
    return new S({ complete: b, duration: a, context: c });
  }, a.fn.tram = function (a) {
    return b.call(null, this, a);
  };var V = a.style,
      W = a.css,
      X = { transform: G.transform && G.transform.css },
      Y = { color: [O, u], background: [O, u, "background-color"], "outline-color": [O, u], "border-color": [O, u], "border-top-color": [O, u], "border-right-color": [O, u], "border-bottom-color": [O, u], "border-left-color": [O, u], "border-width": [N, v], "border-top-width": [N, v], "border-right-width": [N, v], "border-bottom-width": [N, v], "border-left-width": [N, v], "border-spacing": [N, v], "letter-spacing": [N, v], margin: [N, v], "margin-top": [N, v], "margin-right": [N, v], "margin-bottom": [N, v], "margin-left": [N, v], padding: [N, v], "padding-top": [N, v], "padding-right": [N, v], "padding-bottom": [N, v], "padding-left": [N, v], "outline-width": [N, v], opacity: [N, t], top: [N, w], right: [N, w], bottom: [N, w], left: [N, w], "font-size": [N, w], "text-indent": [N, w], "word-spacing": [N, w], width: [N, w], "min-width": [N, w], "max-width": [N, w], height: [N, w], "min-height": [N, w], "max-height": [N, w], "line-height": [N, y], "scroll-top": [P, t, "scrollTop"], "scroll-left": [P, t, "scrollLeft"] },
      Z = {};G.transform && (Y.transform = [Q], Z = { x: [w, "translateX"], y: [w, "translateY"], rotate: [x], rotateX: [x], rotateY: [x], scale: [t], scaleX: [t], scaleY: [t], skew: [x], skewX: [x], skewY: [x] }), G.transform && G.backface && (Z.z = [w, "translateZ"], Z.rotateZ = [x], Z.scaleZ = [t], Z.perspective = [v]);var $ = /ms/,
      _ = /s|\./;return a.tram = b;
}(window.jQuery);

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Webflow: IX Event triggers for other modules
 */

var $ = window.jQuery;
var api = {};
var eventQueue = [];
var namespace = '.w-ix';

var eventTriggers = {
  reset: function reset(i, el) {
    el.__wf_intro = null;
  },
  intro: function intro(i, el) {
    if (el.__wf_intro) {
      return;
    }
    el.__wf_intro = true;
    $(el).triggerHandler(api.types.INTRO);
  },
  outro: function outro(i, el) {
    if (!el.__wf_intro) {
      return;
    }
    el.__wf_intro = null;
    $(el).triggerHandler(api.types.OUTRO);
  }
};

api.triggers = {};

api.types = {
  INTRO: 'w-ix-intro' + namespace,
  OUTRO: 'w-ix-outro' + namespace
};

// Trigger any events in queue + restore trigger methods
api.init = function () {
  var count = eventQueue.length;
  for (var i = 0; i < count; i++) {
    var memo = eventQueue[i];
    memo[0](0, memo[1]);
  }
  eventQueue = [];
  $.extend(api.triggers, eventTriggers);
};

// Replace all triggers with async wrapper to queue events until init
api.async = function () {
  for (var key in eventTriggers) {
    var func = eventTriggers[key];
    if (!eventTriggers.hasOwnProperty(key)) {
      continue;
    }

    // Replace trigger method with async wrapper
    api.triggers[key] = function (i, el) {
      eventQueue.push([func, el]);
    };
  }
};

// Default triggers to async queue
api.async();

module.exports = api;

/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__createStore__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__combineReducers__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__bindActionCreators__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__applyMiddleware__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__compose__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_warning__ = __webpack_require__(54);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__createStore__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__combineReducers__["a"]; });
/* unused harmony reexport bindActionCreators */
/* unused harmony reexport applyMiddleware */
/* unused harmony reexport compose */







/*
* This is a dummy function to check if the function name has been altered by minification.
* If the function has been minified and NODE_ENV !== 'production', warn the user.
*/
function isCrushed() {}

if (false) {
  warning('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
}



/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ActionTypes; });
/* harmony export (immutable) */ __webpack_exports__["b"] = createStore;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_es_isPlainObject__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_symbol_observable__ = __webpack_require__(103);



/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var ActionTypes = {
  INIT: '@@redux/INIT'
};

/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [preloadedState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} enhancer The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */
function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing â€œwhat changedâ€. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!Object(__WEBPACK_IMPORTED_MODULE_0_lodash_es_isPlainObject__["a" /* default */])(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      listeners[i]();
    }

    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/zenparsing/es-observable
   */
  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return { unsubscribe: unsubscribe };
      }
    }, _ref[__WEBPACK_IMPORTED_MODULE_1_symbol_observable__["a" /* default */]] = function () {
      return this;
    }, _ref;
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[__WEBPACK_IMPORTED_MODULE_1_symbol_observable__["a" /* default */]] = observable, _ref2;
}

/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__baseGetTag_js__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__getPrototype_js__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__isObjectLike_js__ = __webpack_require__(102);




/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!Object(__WEBPACK_IMPORTED_MODULE_2__isObjectLike_js__["a" /* default */])(value) || Object(__WEBPACK_IMPORTED_MODULE_0__baseGetTag_js__["a" /* default */])(value) != objectTag) {
    return false;
  }
  var proto = Object(__WEBPACK_IMPORTED_MODULE_1__getPrototype_js__["a" /* default */])(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

/* harmony default export */ __webpack_exports__["a"] = (isPlainObject);


/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__root_js__ = __webpack_require__(96);


/** Built-in value references. */
var Symbol = __WEBPACK_IMPORTED_MODULE_0__root_js__["a" /* default */].Symbol;

/* harmony default export */ __webpack_exports__["a"] = (Symbol);


/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}

/***/ }),
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = compose;
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  var last = funcs[funcs.length - 1];
  var rest = funcs.slice(0, -1);
  return function () {
    return rest.reduceRight(function (composed, f) {
      return f(composed);
    }, last.apply(undefined, arguments));
  };
}

/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = optimizeFloat;
/* harmony export (immutable) */ __webpack_exports__["a"] = applyEasing;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__IX2Easings__ = __webpack_require__(115);


function optimizeFloat(value) {
  var digits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
  var base = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;

  var pow = Math.pow(base, digits);
  var float = Number(Math.round(value * pow) / pow);
  return Math.abs(float) > 0.0001 ? float : 0;
}

function applyEasing(easing, position) {
  if (position === 0) {
    return 0;
  }
  if (position === 1) {
    return 1;
  }
  return optimizeFloat(position > 0 && easing && __WEBPACK_IMPORTED_MODULE_0__IX2Easings__[easing] ? __WEBPACK_IMPORTED_MODULE_0__IX2Easings__[easing](position) : position);
}

/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = observeRequests;
/* harmony export (immutable) */ __webpack_exports__["c"] = startEngine;
/* harmony export (immutable) */ __webpack_exports__["e"] = stopEngine;
/* unused harmony export stopAllActionGroups */
/* harmony export (immutable) */ __webpack_exports__["d"] = stopActionGroup;
/* harmony export (immutable) */ __webpack_exports__["b"] = startActionGroup;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_find__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_find___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_find__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_get__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_get___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash_get__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_size__ = __webpack_require__(183);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_size___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash_size__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash_omitBy__ = __webpack_require__(189);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash_omitBy___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_lodash_omitBy__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_lodash_isEmpty__ = __webpack_require__(203);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_lodash_isEmpty___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_lodash_isEmpty__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash_mapValues__ = __webpack_require__(204);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash_mapValues___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_lodash_mapValues__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_lodash_forEach__ = __webpack_require__(207);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_lodash_forEach___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_lodash_forEach__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_lodash_endsWith__ = __webpack_require__(211);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_lodash_endsWith___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_lodash_endsWith__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_lodash_throttle__ = __webpack_require__(212);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_lodash_throttle___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_lodash_throttle__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_recompose_shallowEqual__ = __webpack_require__(215);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_recompose_shallowEqual___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_recompose_shallowEqual__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__IX2VanillaUtils__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__constants_IX2EngineEventTypes__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__actions_IX2EngineActions__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__IX2BrowserApi__ = __webpack_require__(221);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__constants_IX2EngineConstants__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__constants_IX2EngineItemTypes__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__IX2VanillaEvents__ = __webpack_require__(222);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }


























var ua = navigator.userAgent;
var IS_MOBILE_SAFARI = ua.match(/iPad/i) || ua.match(/iPhone/);

// Keep throttled events at ~80fps to reduce reflows while maintaining render accuracy
var THROTTLED_EVENT_WAIT = 12;

function observeRequests(store) {
  Object(__WEBPACK_IMPORTED_MODULE_10__IX2VanillaUtils__["j" /* observeStore */])({
    store: store,
    select: function select(_ref) {
      var ixRequest = _ref.ixRequest;
      return ixRequest.preview;
    },
    onChange: handlePreviewRequest
  });
  Object(__WEBPACK_IMPORTED_MODULE_10__IX2VanillaUtils__["j" /* observeStore */])({
    store: store,
    select: function select(_ref2) {
      var ixRequest = _ref2.ixRequest;
      return ixRequest.playback;
    },
    onChange: handlePlaybackRequest
  });
  Object(__WEBPACK_IMPORTED_MODULE_10__IX2VanillaUtils__["j" /* observeStore */])({
    store: store,
    select: function select(_ref3) {
      var ixRequest = _ref3.ixRequest;
      return ixRequest.stop;
    },
    onChange: handleStopRequest
  });
  Object(__WEBPACK_IMPORTED_MODULE_10__IX2VanillaUtils__["j" /* observeStore */])({
    store: store,
    select: function select(_ref4) {
      var ixRequest = _ref4.ixRequest;
      return ixRequest.clear;
    },
    onChange: handleClearRequest
  });
}

function handlePreviewRequest(_ref5, store) {
  var rawData = _ref5.rawData;

  startEngine({ store: store, rawData: rawData, allowEvents: true });
  document.dispatchEvent(new CustomEvent('IX2_PREVIEW_LOAD'));
}

function isQuickEffect(id) {
  return id && __WEBPACK_IMPORTED_MODULE_7_lodash_endsWith___default()(id, '_EFFECT');
}

function handlePlaybackRequest(playback, store) {
  var actionTypeId = playback.actionTypeId,
      actionListId = playback.actionListId,
      actionItemId = playback.actionItemId,
      eventId = playback.eventId,
      allowEvents = playback.allowEvents,
      immediate = playback.immediate,
      _playback$verbose = playback.verbose,
      verbose = _playback$verbose === undefined ? true : _playback$verbose;
  var rawData = playback.rawData;


  if (actionListId && actionItemId && rawData && immediate) {
    rawData = Object(__WEBPACK_IMPORTED_MODULE_10__IX2VanillaUtils__["k" /* reduceListToGroup */])({
      actionListId: actionListId,
      actionItemId: actionItemId,
      rawData: rawData
    });
  }

  startEngine({ store: store, rawData: rawData, allowEvents: allowEvents });

  if (actionListId && actionTypeId === __WEBPACK_IMPORTED_MODULE_15__constants_IX2EngineItemTypes__["c" /* GENERAL_START_ACTION */] || isQuickEffect(actionTypeId)) {
    stopActionGroup({ store: store, actionListId: actionListId });
    renderInitialGroup({ store: store, actionListId: actionListId, eventId: eventId });
    var started = startActionGroup({ store: store, eventId: eventId, actionListId: actionListId, immediate: immediate, verbose: verbose });
    if (verbose && started) {
      store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_12__actions_IX2EngineActions__["actionListPlaybackChanged"])({ actionListId: actionListId, isPlaying: !immediate }));
    }
  }
}

function handleStopRequest(_ref6, store) {
  var actionListId = _ref6.actionListId;

  if (actionListId) {
    stopActionGroup({ store: store, actionListId: actionListId });
  } else {
    stopAllActionGroups({ store: store });
  }
  stopEngine(store);
}

function handleClearRequest(state, store) {
  stopEngine(store);
  Object(__WEBPACK_IMPORTED_MODULE_10__IX2VanillaUtils__["b" /* clearAllStyles */])({ store: store, elementApi: __WEBPACK_IMPORTED_MODULE_13__IX2BrowserApi__ });
}

function startEngine(_ref7) {
  var store = _ref7.store,
      rawData = _ref7.rawData,
      allowEvents = _ref7.allowEvents;

  var _store$getState = store.getState(),
      ixSession = _store$getState.ixSession;

  if (rawData) {
    store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_12__actions_IX2EngineActions__["rawDataImported"])(rawData));
  }
  if (!ixSession.active) {
    store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_12__actions_IX2EngineActions__["sessionInitialized"])({
      hasBoundaryNodes: Boolean(document.querySelector(__WEBPACK_IMPORTED_MODULE_14__constants_IX2EngineConstants__["f" /* BOUNDARY_SELECTOR */]))
    }));
    if (allowEvents) {
      bindEvents(store);
    }
    store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_12__actions_IX2EngineActions__["sessionStarted"])());
    startRenderLoop(store);
  }
}

function startRenderLoop(store) {
  var handleFrame = function handleFrame(now) {
    var _store$getState2 = store.getState(),
        ixSession = _store$getState2.ixSession,
        ixParameters = _store$getState2.ixParameters;

    if (ixSession.active) {
      store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_12__actions_IX2EngineActions__["animationFrameChanged"])(now, ixParameters));
      requestAnimationFrame(handleFrame);
    }
  };
  handleFrame(window.performance.now());
}

function stopEngine(store) {
  var _store$getState3 = store.getState(),
      ixSession = _store$getState3.ixSession;

  if (ixSession.active) {
    var eventListeners = ixSession.eventListeners;

    eventListeners.forEach(clearEventListener);
    store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_12__actions_IX2EngineActions__["sessionStopped"])());
  }
}

function clearEventListener(_ref8) {
  var target = _ref8.target,
      listenerParams = _ref8.listenerParams;

  target.removeEventListener.apply(target, listenerParams);
}

function createGroupInstances(_ref9) {
  var store = _ref9.store,
      eventStateKey = _ref9.eventStateKey,
      eventTarget = _ref9.eventTarget,
      eventId = _ref9.eventId,
      eventConfig = _ref9.eventConfig,
      actionListId = _ref9.actionListId,
      parameterGroup = _ref9.parameterGroup,
      smoothing = _ref9.smoothing,
      restingValue = _ref9.restingValue;

  var _store$getState4 = store.getState(),
      ixData = _store$getState4.ixData,
      ixSession = _store$getState4.ixSession;

  var events = ixData.events;

  var event = events[eventId];
  var eventTypeId = event.eventTypeId;

  var targetCache = {};
  var instanceActionGroups = {};
  var instanceConfigs = [];

  var continuousActionGroups = parameterGroup.continuousActionGroups;
  var parameterId = parameterGroup.id;

  if (Object(__WEBPACK_IMPORTED_MODULE_10__IX2VanillaUtils__["o" /* shouldNamespaceEventParameter */])(eventTypeId, eventConfig)) {
    parameterId = Object(__WEBPACK_IMPORTED_MODULE_10__IX2VanillaUtils__["i" /* getNamespacedParameterId */])(eventStateKey, parameterId);
  }

  // Limit affected elements when event target is within a boundary node
  var eventElementRoot = ixSession.hasBoundaryNodes && eventTarget ? __WEBPACK_IMPORTED_MODULE_13__IX2BrowserApi__["getClosestElement"](eventTarget, __WEBPACK_IMPORTED_MODULE_14__constants_IX2EngineConstants__["f" /* BOUNDARY_SELECTOR */]) : null;

  continuousActionGroups.forEach(function (actionGroup) {
    var keyframe = actionGroup.keyframe,
        actionItems = actionGroup.actionItems;


    actionItems.forEach(function (actionItem) {
      var actionTypeId = actionItem.actionTypeId;
      var target = actionItem.config.target;

      if (!target) {
        return;
      }
      var elementRoot = target.boundaryMode ? eventElementRoot : null;

      var key = Object(__WEBPACK_IMPORTED_MODULE_10__IX2VanillaUtils__["p" /* stringifyTarget */])(target) + __WEBPACK_IMPORTED_MODULE_14__constants_IX2EngineConstants__["h" /* COLON_DELIMITER */] + actionTypeId;
      instanceActionGroups[key] = appendActionItem(instanceActionGroups[key], keyframe, actionItem);

      if (!targetCache[key]) {
        targetCache[key] = true;
        var config = actionItem.config;

        Object(__WEBPACK_IMPORTED_MODULE_10__IX2VanillaUtils__["c" /* getAffectedElements */])({ config: config, event: event, eventTarget: eventTarget, elementRoot: elementRoot, elementApi: __WEBPACK_IMPORTED_MODULE_13__IX2BrowserApi__ }).forEach(function (element) {
          instanceConfigs.push({ element: element, key: key });
        });
      }
    });
  });

  instanceConfigs.forEach(function (_ref10) {
    var element = _ref10.element,
        key = _ref10.key;

    var actionGroups = instanceActionGroups[key];
    var actionItem = __WEBPACK_IMPORTED_MODULE_1_lodash_get___default()(actionGroups, '[0].actionItems[0]', {});
    var destination = Object(__WEBPACK_IMPORTED_MODULE_10__IX2VanillaUtils__["e" /* getDestinationValues */])({ element: element, actionItem: actionItem, elementApi: __WEBPACK_IMPORTED_MODULE_13__IX2BrowserApi__ });
    createInstance({
      store: store,
      element: element,
      eventId: eventId,
      actionListId: actionListId,
      actionItem: actionItem,
      destination: destination,
      continuous: true,
      parameterId: parameterId,
      actionGroups: actionGroups,
      smoothing: smoothing,
      restingValue: restingValue
    });
  });
}

function appendActionItem() {
  var actionGroups = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var keyframe = arguments[1];
  var actionItem = arguments[2];

  var newActionGroups = [].concat(_toConsumableArray(actionGroups));
  var groupIndex = void 0;
  newActionGroups.some(function (group, index) {
    if (group.keyframe === keyframe) {
      groupIndex = index;
      return true;
    }
    return false;
  });
  if (groupIndex == null) {
    groupIndex = newActionGroups.length;
    newActionGroups.push({
      keyframe: keyframe,
      actionItems: []
    });
  }
  newActionGroups[groupIndex].actionItems.push(actionItem);
  return newActionGroups;
}

function bindEvents(store) {
  var _store$getState5 = store.getState(),
      ixData = _store$getState5.ixData;

  var eventTypeMap = ixData.eventTypeMap;


  __WEBPACK_IMPORTED_MODULE_6_lodash_forEach___default()(eventTypeMap, function (events, key) {
    var logic = __WEBPACK_IMPORTED_MODULE_16__IX2VanillaEvents__["a" /* default */][key];
    if (!logic) {
      console.warn('IX2 event type not configured: ' + key);
      return;
    }
    bindEventType({
      logic: logic,
      store: store,
      events: events
    });
  });

  var _store$getState6 = store.getState(),
      ixSession = _store$getState6.ixSession;

  if (ixSession.eventListeners.length) {
    bindResizeEvents(store);
  }
}

var WINDOW_RESIZE_EVENTS = ['resize', 'orientationchange'];

function bindResizeEvents(store) {
  WINDOW_RESIZE_EVENTS.forEach(function (type) {
    window.addEventListener(type, handleResize);
    store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_12__actions_IX2EngineActions__["eventListenerAdded"])(window, [type, handleResize]));
  });
  function handleResize() {
    var _store$getState7 = store.getState(),
        ixSession = _store$getState7.ixSession,
        ixData = _store$getState7.ixData;

    var width = window.innerWidth;
    if (width !== ixSession.viewportWidth) {
      var mediaQueries = ixData.mediaQueries;

      store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_12__actions_IX2EngineActions__["viewportWidthChanged"])({ width: width, mediaQueries: mediaQueries }));
    }
  }
  handleResize();
}

var mapFoundValues = function mapFoundValues(object, iteratee) {
  return __WEBPACK_IMPORTED_MODULE_3_lodash_omitBy___default()(__WEBPACK_IMPORTED_MODULE_5_lodash_mapValues___default()(object, iteratee), __WEBPACK_IMPORTED_MODULE_4_lodash_isEmpty___default.a);
};

var forEachEventTarget = function forEachEventTarget(eventTargets, eventCallback) {
  __WEBPACK_IMPORTED_MODULE_6_lodash_forEach___default()(eventTargets, function (elements, eventId) {
    elements.forEach(function (element, index) {
      var eventStateKey = eventId + __WEBPACK_IMPORTED_MODULE_14__constants_IX2EngineConstants__["h" /* COLON_DELIMITER */] + index;
      eventCallback(element, eventId, eventStateKey);
    });
  });
};

var getAffectedForEvent = function getAffectedForEvent(event) {
  var config = { target: event.target };
  return Object(__WEBPACK_IMPORTED_MODULE_10__IX2VanillaUtils__["c" /* getAffectedElements */])({ config: config, elementApi: __WEBPACK_IMPORTED_MODULE_13__IX2BrowserApi__ });
};

function bindEventType(_ref11) {
  var logic = _ref11.logic,
      store = _ref11.store,
      events = _ref11.events;

  injectBehaviorCSSFixes(events);
  var eventTypes = logic.types,
      eventHandler = logic.handler;

  var _store$getState8 = store.getState(),
      ixData = _store$getState8.ixData;

  var actionLists = ixData.actionLists;

  var eventTargets = mapFoundValues(events, getAffectedForEvent);

  if (!__WEBPACK_IMPORTED_MODULE_2_lodash_size___default()(eventTargets)) {
    return;
  }

  __WEBPACK_IMPORTED_MODULE_6_lodash_forEach___default()(eventTargets, function (elements, key) {
    var event = events[key];
    var eventAction = event.action,
        eventId = event.id;
    var actionListId = eventAction.config.actionListId;


    if (eventAction.actionTypeId === __WEBPACK_IMPORTED_MODULE_15__constants_IX2EngineItemTypes__["a" /* GENERAL_CONTINUOUS_ACTION */]) {
      var configs = Array.isArray(event.config) ? event.config : [event.config];

      configs.forEach(function (eventConfig) {
        var continuousParameterGroupId = eventConfig.continuousParameterGroupId;

        var paramGroups = __WEBPACK_IMPORTED_MODULE_1_lodash_get___default()(actionLists, actionListId + '.continuousParameterGroups', []);
        var parameterGroup = __WEBPACK_IMPORTED_MODULE_0_lodash_find___default()(paramGroups, function (_ref12) {
          var id = _ref12.id;
          return id === continuousParameterGroupId;
        });
        var smoothing = (eventConfig.smoothing || 0) / 100;
        var restingValue = (eventConfig.restingState || 0) / 100;

        if (!parameterGroup) {
          return;
        }

        elements.forEach(function (eventTarget, index) {
          var eventStateKey = eventId + __WEBPACK_IMPORTED_MODULE_14__constants_IX2EngineConstants__["h" /* COLON_DELIMITER */] + index;
          createGroupInstances({
            store: store,
            eventStateKey: eventStateKey,
            eventTarget: eventTarget,
            eventId: eventId,
            eventConfig: eventConfig,
            actionListId: actionListId,
            parameterGroup: parameterGroup,
            smoothing: smoothing,
            restingValue: restingValue
          });
        });
      });
    }

    if (eventAction.actionTypeId === __WEBPACK_IMPORTED_MODULE_15__constants_IX2EngineItemTypes__["c" /* GENERAL_START_ACTION */] || isQuickEffect(eventAction.actionTypeId)) {
      renderInitialGroup({ store: store, actionListId: actionListId, eventId: eventId });
    }
  });

  var handleEvent = function handleEvent(nativeEvent) {
    var _store$getState9 = store.getState(),
        ixSession = _store$getState9.ixSession;

    forEachEventTarget(eventTargets, function (element, eventId, eventStateKey) {
      var event = events[eventId];
      var oldState = ixSession.eventState[eventStateKey];
      var eventAction = event.action,
          _event$mediaQueries = event.mediaQueries,
          mediaQueries = _event$mediaQueries === undefined ? ixData.mediaQueryKeys : _event$mediaQueries;
      // Bypass event handler if current media query is not listed in event config

      if (!Object(__WEBPACK_IMPORTED_MODULE_10__IX2VanillaUtils__["n" /* shouldAllowMediaQuery */])(mediaQueries, ixSession.mediaQueryKey)) {
        return;
      }
      var handleEventWithConfig = function handleEventWithConfig() {
        var eventConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var newState = eventHandler({
          store: store,
          element: element,
          event: event,
          eventConfig: eventConfig,
          nativeEvent: nativeEvent,
          eventStateKey: eventStateKey
        }, oldState);
        if (!__WEBPACK_IMPORTED_MODULE_9_recompose_shallowEqual___default()(newState, oldState)) {
          store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_12__actions_IX2EngineActions__["eventStateChanged"])(eventStateKey, newState));
        }
      };
      if (eventAction.actionTypeId === __WEBPACK_IMPORTED_MODULE_15__constants_IX2EngineItemTypes__["a" /* GENERAL_CONTINUOUS_ACTION */]) {
        var configs = Array.isArray(event.config) ? event.config : [event.config];
        configs.forEach(handleEventWithConfig);
      } else {
        handleEventWithConfig();
      }
    });
  };

  var handleEventThrottled = __WEBPACK_IMPORTED_MODULE_8_lodash_throttle___default()(handleEvent, THROTTLED_EVENT_WAIT);

  var addListeners = function addListeners(_ref13) {
    var _ref13$target = _ref13.target,
        target = _ref13$target === undefined ? document : _ref13$target,
        types = _ref13.types,
        shouldThrottle = _ref13.throttle;

    types.split(' ').filter(Boolean).forEach(function (type) {
      var handlerFunc = shouldThrottle ? handleEventThrottled : handleEvent;
      target.addEventListener(type, handlerFunc);
      store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_12__actions_IX2EngineActions__["eventListenerAdded"])(target, [type, handlerFunc]));
    });
  };

  if (Array.isArray(eventTypes)) {
    eventTypes.forEach(addListeners);
  } else if (typeof eventTypes === 'string') {
    addListeners(logic);
  }
}

/**
 * Injects CSS into the document to fix behavior issues across
 * different devices.
 */

function injectBehaviorCSSFixes(events) {

  if (!IS_MOBILE_SAFARI) {
    return;
  }

  var injectedSelectors = {};

  var cssText = '';
  for (var eventId in events) {
    var _events$eventId = events[eventId],
        eventTypeId = _events$eventId.eventTypeId,
        target = _events$eventId.target;


    var selector = __WEBPACK_IMPORTED_MODULE_13__IX2BrowserApi__["getQuerySelector"](target);
    if (injectedSelectors[selector]) {
      continue;
    }

    // add a "cursor: pointer" style rule to ensure that CLICK events get fired for IOS devices
    if (eventTypeId === __WEBPACK_IMPORTED_MODULE_11__constants_IX2EngineEventTypes__["f" /* MOUSE_CLICK */] || eventTypeId === __WEBPACK_IMPORTED_MODULE_11__constants_IX2EngineEventTypes__["k" /* MOUSE_SECOND_CLICK */]) {
      injectedSelectors[selector] = true;
      cssText += selector + '{' + 'cursor: pointer;' + 'touch-action: manipulation;' + '}';
    }
  }

  if (cssText) {
    var style = document.createElement("style");
    style.textContent = cssText;
    document.body.appendChild(style);
  }
}

function renderInitialGroup(_ref14) {
  var store = _ref14.store,
      actionListId = _ref14.actionListId,
      eventId = _ref14.eventId;

  var _store$getState10 = store.getState(),
      ixData = _store$getState10.ixData;

  var actionLists = ixData.actionLists,
      events = ixData.events;

  var event = events[eventId];
  var actionList = actionLists[actionListId];

  if (actionList && actionList.useFirstGroupAsInitialState) {
    var initialStateItems = __WEBPACK_IMPORTED_MODULE_1_lodash_get___default()(actionList, 'actionItemGroups[0].actionItems', []);

    initialStateItems.forEach(function (actionItem) {
      var config = actionItem.config;

      var itemElements = Object(__WEBPACK_IMPORTED_MODULE_10__IX2VanillaUtils__["c" /* getAffectedElements */])({ config: config, event: event, elementApi: __WEBPACK_IMPORTED_MODULE_13__IX2BrowserApi__ });

      itemElements.forEach(function (element) {
        createInstance({
          destination: Object(__WEBPACK_IMPORTED_MODULE_10__IX2VanillaUtils__["e" /* getDestinationValues */])({ element: element, actionItem: actionItem, elementApi: __WEBPACK_IMPORTED_MODULE_13__IX2BrowserApi__ }),
          origin: Object(__WEBPACK_IMPORTED_MODULE_10__IX2VanillaUtils__["g" /* getInstanceOrigin */])({ element: element, actionItem: actionItem, elementApi: __WEBPACK_IMPORTED_MODULE_13__IX2BrowserApi__ }),
          immediate: true,
          store: store,
          element: element,
          eventId: eventId,
          actionItem: actionItem,
          actionListId: actionListId
        });
      });
    });
  }
}

function stopAllActionGroups(_ref15) {
  var store = _ref15.store;

  var _store$getState11 = store.getState(),
      ixInstances = _store$getState11.ixInstances;

  __WEBPACK_IMPORTED_MODULE_6_lodash_forEach___default()(ixInstances, function (instance) {
    if (!instance.continuous) {
      var actionListId = instance.actionListId,
          verbose = instance.verbose;

      removeInstance(instance, store);
      if (verbose) {
        store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_12__actions_IX2EngineActions__["actionListPlaybackChanged"])({ actionListId: actionListId, isPlaying: false }));
      }
    }
  });
}

function stopActionGroup(_ref16) {
  var store = _ref16.store,
      eventId = _ref16.eventId,
      eventTarget = _ref16.eventTarget,
      eventStateKey = _ref16.eventStateKey,
      actionListId = _ref16.actionListId;

  var _store$getState12 = store.getState(),
      ixInstances = _store$getState12.ixInstances,
      ixSession = _store$getState12.ixSession;

  // Check for element boundary before stopping engine instances


  var eventElementRoot = ixSession.hasBoundaryNodes && eventTarget ? __WEBPACK_IMPORTED_MODULE_13__IX2BrowserApi__["getClosestElement"](eventTarget, __WEBPACK_IMPORTED_MODULE_14__constants_IX2EngineConstants__["f" /* BOUNDARY_SELECTOR */]) : null;

  __WEBPACK_IMPORTED_MODULE_6_lodash_forEach___default()(ixInstances, function (instance) {
    var boundaryMode = __WEBPACK_IMPORTED_MODULE_1_lodash_get___default()(instance, 'actionItem.config.target.boundaryMode');
    // Validate event key if eventStateKey was provided, otherwise default to true
    var validEventKey = eventStateKey ? instance.eventStateKey === eventStateKey : true;
    // Remove engine instances that match the required ids
    if (instance.actionListId === actionListId && instance.eventId === eventId && validEventKey) {
      // Avoid removal when root boundary does not contain instance element
      if (eventElementRoot && boundaryMode && !__WEBPACK_IMPORTED_MODULE_13__IX2BrowserApi__["elementContains"](eventElementRoot, instance.element)) {
        return;
      }
      removeInstance(instance, store);
      if (instance.verbose) {
        store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_12__actions_IX2EngineActions__["actionListPlaybackChanged"])({ actionListId: actionListId, isPlaying: false }));
      }
    }
  });
}

function startActionGroup(_ref17) {
  var store = _ref17.store,
      eventId = _ref17.eventId,
      eventTarget = _ref17.eventTarget,
      eventStateKey = _ref17.eventStateKey,
      actionListId = _ref17.actionListId,
      _ref17$groupIndex = _ref17.groupIndex,
      groupIndex = _ref17$groupIndex === undefined ? 0 : _ref17$groupIndex,
      immediate = _ref17.immediate,
      verbose = _ref17.verbose;

  var _store$getState13 = store.getState(),
      ixData = _store$getState13.ixData,
      ixSession = _store$getState13.ixSession;

  var events = ixData.events;

  var event = events[eventId] || {};
  var _event$mediaQueries2 = event.mediaQueries,
      mediaQueries = _event$mediaQueries2 === undefined ? ixData.mediaQueryKeys : _event$mediaQueries2;

  var actionList = __WEBPACK_IMPORTED_MODULE_1_lodash_get___default()(ixData, 'actionLists.' + actionListId, {});
  var actionItemGroups = actionList.actionItemGroups;
  // Reset to first group when event loop is configured

  if (groupIndex >= actionItemGroups.length && __WEBPACK_IMPORTED_MODULE_1_lodash_get___default()(event, 'config.loop')) {
    groupIndex = 0;
  }
  // Skip initial state group during action list playback, as it should already be applied
  if (groupIndex === 0 && actionList.useFirstGroupAsInitialState) {
    groupIndex++;
  }
  // Abort playback if no action items exist at group index
  var actionItems = __WEBPACK_IMPORTED_MODULE_1_lodash_get___default()(actionItemGroups, [groupIndex, 'actionItems'], []);
  if (!actionItems.length) {
    return false;
  }
  // Abort playback if current media query is not listed in event config
  if (!Object(__WEBPACK_IMPORTED_MODULE_10__IX2VanillaUtils__["n" /* shouldAllowMediaQuery */])(mediaQueries, ixSession.mediaQueryKey)) {
    return false;
  }
  // Limit affected elements when event target is within a boundary node
  var eventElementRoot = ixSession.hasBoundaryNodes && eventTarget ? __WEBPACK_IMPORTED_MODULE_13__IX2BrowserApi__["getClosestElement"](eventTarget, __WEBPACK_IMPORTED_MODULE_14__constants_IX2EngineConstants__["f" /* BOUNDARY_SELECTOR */]) : null;

  var carrierIndex = Object(__WEBPACK_IMPORTED_MODULE_10__IX2VanillaUtils__["h" /* getMaxDurationItemIndex */])(actionItems);
  var groupStartResult = false;

  actionItems.forEach(function (actionItem, actionIndex) {
    var config = actionItem.config;
    var target = config.target;

    if (!target) {
      return;
    }
    var elementRoot = target.boundaryMode ? eventElementRoot : null;
    var elements = Object(__WEBPACK_IMPORTED_MODULE_10__IX2VanillaUtils__["c" /* getAffectedElements */])({ config: config, event: event, eventTarget: eventTarget, elementRoot: elementRoot, elementApi: __WEBPACK_IMPORTED_MODULE_13__IX2BrowserApi__ });
    elements.forEach(function (element, elementIndex) {
      groupStartResult = true;
      var isCarrier = carrierIndex === actionIndex && elementIndex === 0;
      var computedStyle = Object(__WEBPACK_IMPORTED_MODULE_10__IX2VanillaUtils__["d" /* getComputedStyle */])({ element: element, actionItem: actionItem });
      var origin = Object(__WEBPACK_IMPORTED_MODULE_10__IX2VanillaUtils__["g" /* getInstanceOrigin */])({ element: element, actionItem: actionItem, computedStyle: computedStyle, elementApi: __WEBPACK_IMPORTED_MODULE_13__IX2BrowserApi__ });
      var destination = Object(__WEBPACK_IMPORTED_MODULE_10__IX2VanillaUtils__["e" /* getDestinationValues */])({ element: element, actionItem: actionItem, elementApi: __WEBPACK_IMPORTED_MODULE_13__IX2BrowserApi__ });
      createInstance({
        store: store,
        element: element,
        actionItem: actionItem,
        eventId: eventId,
        eventTarget: eventTarget,
        eventStateKey: eventStateKey,
        actionListId: actionListId,
        groupIndex: groupIndex,
        isCarrier: isCarrier,
        origin: origin,
        destination: destination,
        immediate: immediate,
        verbose: verbose
      });
    });
  });
  return groupStartResult;
}

function createInstance(options) {
  var store = options.store,
      rest = _objectWithoutProperties(options, ['store']);

  var autoStart = !rest.continuous;
  var immediate = rest.immediate;

  var instanceId = Object(__WEBPACK_IMPORTED_MODULE_10__IX2VanillaUtils__["f" /* getInstanceId */])();

  store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_12__actions_IX2EngineActions__["instanceAdded"])(_extends({
    instanceId: instanceId
  }, rest)));

  if (immediate) {
    renderImmediateInstance(store, instanceId);
    return;
  }

  Object(__WEBPACK_IMPORTED_MODULE_10__IX2VanillaUtils__["j" /* observeStore */])({
    store: store,
    select: function select(_ref18) {
      var ixInstances = _ref18.ixInstances;
      return ixInstances[instanceId];
    },
    onChange: handleInstanceChange
  });

  if (autoStart) {
    store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_12__actions_IX2EngineActions__["instanceStarted"])(instanceId));
  }
}

function removeInstance(instance, store) {
  Object(__WEBPACK_IMPORTED_MODULE_10__IX2VanillaUtils__["a" /* cleanupInstance */])(instance, __WEBPACK_IMPORTED_MODULE_13__IX2BrowserApi__);
  store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_12__actions_IX2EngineActions__["instanceRemoved"])(instance.id));
}

function renderImmediateInstance(store, instanceId) {
  store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_12__actions_IX2EngineActions__["instanceStarted"])(instanceId));

  var _store$getState14 = store.getState(),
      ixParameters = _store$getState14.ixParameters;

  store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_12__actions_IX2EngineActions__["animationFrameChanged"])(Number.POSITIVE_INFINITY, ixParameters));

  var _store$getState15 = store.getState(),
      ixInstances = _store$getState15.ixInstances;

  handleInstanceChange(ixInstances[instanceId], store);
}

function handleInstanceChange(instance, store) {
  var active = instance.active,
      continuous = instance.continuous,
      complete = instance.complete,
      current = instance.current,
      groupIndex = instance.groupIndex,
      eventId = instance.eventId,
      eventTarget = instance.eventTarget,
      eventStateKey = instance.eventStateKey,
      actionListId = instance.actionListId,
      isGeneral = instance.isGeneral,
      isCarrier = instance.isCarrier,
      verbose = instance.verbose;

  // Bypass render if current media query is not listed in event config

  var _store$getState16 = store.getState(),
      ixData = _store$getState16.ixData,
      ixSession = _store$getState16.ixSession;

  var events = ixData.events;

  var event = events[eventId] || {};
  var _event$mediaQueries3 = event.mediaQueries,
      mediaQueries = _event$mediaQueries3 === undefined ? ixData.mediaQueryKeys : _event$mediaQueries3;

  if (!Object(__WEBPACK_IMPORTED_MODULE_10__IX2VanillaUtils__["n" /* shouldAllowMediaQuery */])(mediaQueries, ixSession.mediaQueryKey)) {
    return;
  }

  if (continuous || active || complete) {

    if (current || isGeneral && complete) {
      Object(__WEBPACK_IMPORTED_MODULE_10__IX2VanillaUtils__["m" /* renderInstance */])(instance, __WEBPACK_IMPORTED_MODULE_13__IX2BrowserApi__);
    }

    if (complete) {

      if (isCarrier) {
        var started = startActionGroup({ store: store, eventId: eventId, eventTarget: eventTarget, eventStateKey: eventStateKey, actionListId: actionListId, groupIndex: groupIndex + 1, verbose: verbose });
        if (verbose && !started) {
          store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_12__actions_IX2EngineActions__["actionListPlaybackChanged"])({ actionListId: actionListId, isPlaying: false }));
        }
      }

      removeInstance(instance, store);
    }
  }
}

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var createFind = __webpack_require__(118),
    findIndex = __webpack_require__(180);

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.find(users, function(o) { return o.age < 40; });
 * // => object for 'barney'
 *
 * // The `_.matches` iteratee shorthand.
 * _.find(users, { 'age': 1, 'active': true });
 * // => object for 'pebbles'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.find(users, ['active', false]);
 * // => object for 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.find(users, 'active');
 * // => object for 'barney'
 */
var find = createFind(findIndex);

module.exports = find;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(13),
    stackClear = __webpack_require__(126),
    stackDelete = __webpack_require__(127),
    stackGet = __webpack_require__(128),
    stackHas = __webpack_require__(129),
    stackSet = __webpack_require__(130);

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(8),
    isObject = __webpack_require__(3);

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(24)))

/***/ }),
/* 62 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsEqualDeep = __webpack_require__(149),
    isObject = __webpack_require__(3),
    isObjectLike = __webpack_require__(5);

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

module.exports = baseIsEqual;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var SetCache = __webpack_require__(150),
    arraySome = __webpack_require__(153),
    cacheHas = __webpack_require__(154);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

module.exports = equalArrays;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var baseTimes = __webpack_require__(160),
    isArguments = __webpack_require__(18),
    isArray = __webpack_require__(0),
    isBuffer = __webpack_require__(28),
    isIndex = __webpack_require__(29),
    isTypedArray = __webpack_require__(30);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;


/***/ }),
/* 66 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(4),
    root = __webpack_require__(2);

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(3);

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;


/***/ }),
/* 69 */
/***/ (function(module, exports) {

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

module.exports = matchesStrictComparable;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var baseToString = __webpack_require__(71);

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(10),
    arrayMap = __webpack_require__(72),
    isArray = __webpack_require__(0),
    isSymbol = __webpack_require__(21);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;


/***/ }),
/* 72 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;


/***/ }),
/* 73 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

var toFinite = __webpack_require__(182);

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

module.exports = toInteger;


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var defineProperty = __webpack_require__(76);

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(4);

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;


/***/ }),
/* 77 */
/***/ (function(module, exports) {

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

var baseFor = __webpack_require__(205),
    keys = __webpack_require__(17);

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

var baseForOwn = __webpack_require__(78),
    createBaseEach = __webpack_require__(209);

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;


/***/ }),
/* 80 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.clamp` which doesn't coerce arguments.
 *
 * @private
 * @param {number} number The number to clamp.
 * @param {number} [lower] The lower bound.
 * @param {number} upper The upper bound.
 * @returns {number} Returns the clamped number.
 */
function baseClamp(number, lower, upper) {
  if (number === number) {
    if (upper !== undefined) {
      number = number <= upper ? number : upper;
    }
    if (lower !== undefined) {
      number = number >= lower ? number : lower;
    }
  }
  return number;
}

module.exports = baseClamp;


/***/ }),
/* 81 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return IS_BROWSER_ENV; });
/* unused harmony export withBrowser */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ELEMENT_MATCHES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return FLEX_PREFIXED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return TRANSFORM_PREFIXED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return TRANSFORM_STYLE_PREFIXED; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_find__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_find___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_find__);


var IS_BROWSER_ENV = typeof window !== 'undefined';

var withBrowser = function withBrowser(fn, fallback) {
  if (IS_BROWSER_ENV) {
    return fn();
  }
  return fallback;
};

var ELEMENT_MATCHES = withBrowser(function () {
  return __WEBPACK_IMPORTED_MODULE_0_lodash_find___default()(['matches', 'matchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector', 'webkitMatchesSelector'], function (key) {
    return key in Element.prototype;
  });
});

var FLEX_PREFIXED = withBrowser(function () {
  var el = document.createElement('i');
  var values = ['flex', '-webkit-flex', '-ms-flexbox', '-moz-box', '-webkit-box'];
  var none = '';
  try {
    var length = values.length;

    for (var i = 0; i < length; i++) {
      var value = values[i];
      el.style.display = value;
      if (el.style.display === value) {
        return value;
      }
    }
    return none;
  } catch (err) {
    return none;
  }
}, 'flex');

var TRANSFORM_PREFIXED = withBrowser(function () {
  var el = document.createElement('i');
  if (el.style.transform == null) {
    var prefixes = ['Webkit', 'Moz', 'ms'];
    var suffix = 'Transform';
    var length = prefixes.length;

    for (var i = 0; i < length; i++) {
      var prop = prefixes[i] + suffix;
      if (el.style[prop] !== undefined) {
        return prop;
      }
    }
  }
  return 'transform';
}, 'transform');

var TRANSFORM_PREFIX = TRANSFORM_PREFIXED.split('transform')[0];

var TRANSFORM_STYLE_PREFIXED = TRANSFORM_PREFIX ? TRANSFORM_PREFIX + 'TransformStyle' : 'transformStyle';

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(3);

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

module.exports = baseCreate;


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

var metaMap = __webpack_require__(235),
    noop = __webpack_require__(236);

/**
 * Gets metadata for `func`.
 *
 * @private
 * @param {Function} func The function to query.
 * @returns {*} Returns the metadata for `func`.
 */
var getData = !metaMap ? noop : function(func) {
  return metaMap.get(func);
};

module.exports = getData;


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

var realNames = __webpack_require__(237);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the name of `func`.
 *
 * @private
 * @param {Function} func The function to query.
 * @returns {string} Returns the function name.
 */
function getFuncName(func) {
  var result = (func.name + ''),
      array = realNames[result],
      length = hasOwnProperty.call(realNames, result) ? array.length : 0;

  while (length--) {
    var data = array[length],
        otherFunc = data.func;
    if (otherFunc == null || otherFunc == func) {
      return data.name;
    }
  }
  return result;
}

module.exports = getFuncName;


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(86);
__webpack_require__(88);
__webpack_require__(89);
__webpack_require__(90);
__webpack_require__(92);
__webpack_require__(93);
__webpack_require__(243);
__webpack_require__(244);
__webpack_require__(245);
__webpack_require__(246);
__webpack_require__(247);
module.exports = __webpack_require__(248);


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Webflow: Brand pages on the subdomain
 */

var Webflow = __webpack_require__(1);

Webflow.define('brand', module.exports = function ($) {
  var api = {};
  var $html = $('html');
  var $body = $('body');
  var namespace = '.w-webflow-badge';
  var location = window.location;
  var isPhantom = /PhantomJS/i.test(navigator.userAgent);
  var brandElement;

  // -----------------------------------
  // Module methods

  api.ready = function () {
    var shouldBrand = $html.attr('data-wf-status');
    var publishedDomain = $html.attr('data-wf-domain') || '';
    if (/\.webflow\.io$/i.test(publishedDomain) && location.hostname !== publishedDomain) {
      shouldBrand = true;
    }
    if (shouldBrand && !isPhantom) {
      brandElement = brandElement || createBadge();
      ensureBrand();
      setTimeout(ensureBrand, 500);
    }
  };

  function createBadge() {
    var $brand = $('<a class="w-webflow-badge"></a>').attr('href', 'https://webflow.com?utm_campaign=brandjs');

    var $logoArt = $('<img>').attr('src', 'https://d1otoma47x30pg.cloudfront.net/img/webflow-badge-icon.60efbf6ec9.svg').css({
      marginRight: '8px',
      width: '16px'
    });

    var $logoText = $('<img>').attr('src', 'https://d1otoma47x30pg.cloudfront.net/img/webflow-badge-text.6faa6a38cd.svg');

    $brand.append($logoArt, $logoText);
    return $brand[0];
  }

  function ensureBrand() {
    var found = $body.children(namespace);
    var match = found.length && found.get(0) === brandElement;
    var inEditor = Webflow.env('editor');
    if (match) {
      // Remove brand when Editor is active
      if (inEditor) {
        found.remove();
      }
      // Exit early, brand is in place
      return;
    }
    // Remove any invalid brand elements
    if (found.length) {
      found.remove();
    }
    // Append the brand (unless Editor is active)
    if (!inEditor) {
      $body.append(brandElement);
    }
  }

  // Export module
  return api;
});

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

// Include tram for frame-throttling
var $ = window.$;
var tram = __webpack_require__(48) && $.tram;

/*eslint-disable */

/*!
 * Webflow._ (aka) Underscore.js 1.6.0 (custom build)
 * _.each
 * _.map
 * _.find
 * _.filter
 * _.any
 * _.contains
 * _.delay
 * _.defer
 * _.throttle (webflow)
 * _.debounce
 * _.keys
 * _.has
 * _.now
 *
 * http://underscorejs.org
 * (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Underscore may be freely distributed under the MIT license.
 * @license MIT
 */
module.exports = function () {
  var _ = {};

  // Current version.
  _.VERSION = '1.6.0-Webflow';

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype,
      ObjProto = Object.prototype,
      FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var push = ArrayProto.push,
      slice = ArrayProto.slice,
      concat = ArrayProto.concat,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var nativeForEach = ArrayProto.forEach,
      nativeMap = ArrayProto.map,
      nativeReduce = ArrayProto.reduce,
      nativeReduceRight = ArrayProto.reduceRight,
      nativeFilter = ArrayProto.filter,
      nativeEvery = ArrayProto.every,
      nativeSome = ArrayProto.some,
      nativeIndexOf = ArrayProto.indexOf,
      nativeLastIndexOf = ArrayProto.lastIndexOf,
      nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeBind = FuncProto.bind;

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function (obj, iterator, context) {
    /* jshint shadow:true */
    if (obj == null) return obj;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
    return obj;
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function (obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function (value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function (obj, predicate, context) {
    var result;
    any(obj, function (value, index, list) {
      if (predicate.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function (obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);
    each(obj, function (value, index, list) {
      if (predicate.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function (obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);
    each(obj, function (value, index, list) {
      if (result || (result = predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function (obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function (value) {
      return value === target;
    });
  };

  // Function (ahem) Functions
  // --------------------

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function (func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function () {
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function (func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered once every
  // browser animation frame - using tram's requestAnimationFrame polyfill.
  _.throttle = function (func) {
    var wait, args, context;
    return function () {
      if (wait) return;
      wait = true;
      args = arguments;
      context = this;
      tram.frame(function () {
        wait = false;
        func.apply(context, args);
      });
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function (func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function later() {
      var last = _.now() - timestamp;
      if (last < wait) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          context = args = null;
        }
      }
    };

    return function () {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Object Functions
  // ----------------

  // Fill in a given object with default properties.
  _.defaults = function (obj) {
    if (!_.isObject(obj)) return obj;
    for (var i = 1, length = arguments.length; i < length; i++) {
      var source = arguments[i];
      for (var prop in source) {
        if (obj[prop] === void 0) obj[prop] = source[prop];
      }
    }
    return obj;
  };

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function (obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) {
      if (_.has(obj, key)) keys.push(key);
    }return keys;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function (obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Is a given variable an object?
  _.isObject = function (obj) {
    return obj === Object(obj);
  };

  // Utility Functions
  // -----------------

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function () {
    return new Date().getTime();
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function escapeChar(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function (text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function template(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Export underscore
  return _;
}();

/* eslint-enable */

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Webflow: Dropdown component
 */

var Webflow = __webpack_require__(1);
var IXEvents = __webpack_require__(23);

Webflow.define('dropdown', module.exports = function ($, _) {
  var api = {};
  var $doc = $(document);
  var $dropdowns;
  var designer;
  var inApp = Webflow.env();
  var touch = Webflow.env.touch;
  var namespace = '.w-dropdown';
  var stateOpen = 'w--open';
  var closeEvent = 'w-close' + namespace;
  var ix = IXEvents.triggers;
  var defaultZIndex = 900; // @dropdown-depth
  var inPreview = false;

  // -----------------------------------
  // Module methods

  api.ready = init;

  api.design = function () {
    // Close all when returning from preview
    if (inPreview) {
      closeAll();
    }
    inPreview = false;
    init();
  };

  api.preview = function () {
    inPreview = true;
    init();
  };

  // -----------------------------------
  // Private methods

  function init() {
    designer = inApp && Webflow.env('design');

    // Find all instances on the page
    $dropdowns = $doc.find(namespace);
    $dropdowns.each(build);
  }

  function build(i, el) {
    var $el = $(el);

    // Store state in data
    var data = $.data(el, namespace);
    if (!data) {
      data = $.data(el, namespace, { open: false, el: $el, config: {} });
    }
    data.list = $el.children('.w-dropdown-list');
    data.toggle = $el.children('.w-dropdown-toggle');
    data.links = data.list.children('.w-dropdown-link');
    data.outside = outside(data);
    data.complete = complete(data);
    data.leave = leave(data);
    data.moveOutside = moveOutside(data);

    // Remove old events
    $el.off(namespace);
    data.toggle.off(namespace);

    // Set config from data attributes
    configure(data);

    if (data.nav) {
      data.nav.off(namespace);
    }
    data.nav = $el.closest('.w-nav');
    data.nav.on(closeEvent, handler(data));

    // Add events based on mode
    if (designer) {
      $el.on('setting' + namespace, handler(data));
    } else {
      data.toggle.on(mouseOrTap() + namespace, toggle(data));
      if (data.config.hover) {
        data.toggle.on('mouseenter' + namespace, enter(data));
      }
      $el.on(closeEvent, handler(data));

      // Close in preview mode and clean the data.hovering state
      if (inApp) {
        data.hovering = false;
        close(data);
      }
    }
  }

  function configure(data) {
    // Determine if z-index should be managed
    var zIndex = Number(data.el.css('z-index'));
    data.manageZ = zIndex === defaultZIndex || zIndex === defaultZIndex + 1;

    data.config = {
      hover: Boolean(data.el.attr('data-hover')) && !touch,
      delay: Number(data.el.attr('data-delay')) || 0
    };
  }

  function handler(data) {
    return function (evt, options) {
      options = options || {};

      if (evt.type === 'w-close') {
        return close(data);
      }

      if (evt.type === 'setting') {
        configure(data);
        options.open === true && open(data, true);
        options.open === false && close(data, true);
        return;
      }
    };
  }

  function toggle(data) {
    return _.debounce(function () {
      data.open ? close(data) : open(data);
    });
  }

  function open(data) {
    if (data.open) {
      return;
    }
    closeOthers(data);
    data.open = true;
    data.list.addClass(stateOpen);
    data.toggle.addClass(stateOpen);
    ix.intro(0, data.el[0]);
    Webflow.redraw.up();

    // Increase z-index to keep above other managed dropdowns
    data.manageZ && data.el.css('z-index', defaultZIndex + 1);

    // Listen for tap outside events
    var isEditor = Webflow.env('editor');
    if (!designer) {
      $doc.on(mouseOrTap() + namespace, data.outside);
    }
    if (data.hovering && !isEditor) {
      data.el.on('mouseleave' + namespace, data.leave);
    }
    if (data.hovering && isEditor) {
      $doc.on('mousemove' + namespace, data.moveOutside);
    }

    // Clear previous delay
    window.clearTimeout(data.delayId);
  }

  function close(data, immediate) {
    if (!data.open) {
      return;
    }

    // Do not close hover-based menus if currently hovering
    if (data.config.hover && data.hovering) {
      return;
    }

    data.open = false;
    var config = data.config;
    ix.outro(0, data.el[0]);

    // Stop listening for tap outside events
    $doc.off(mouseOrTap() + namespace, data.outside);
    data.el.off('mouseleave' + namespace, data.leave);
    $doc.off('mousemove' + namespace, data.moveOutside);

    // Clear previous delay
    window.clearTimeout(data.delayId);

    // Skip delay during immediate
    if (!config.delay || immediate) {
      return data.complete();
    }

    // Optionally wait for delay before close
    data.delayId = window.setTimeout(data.complete, config.delay);
  }

  function closeAll() {
    $doc.find(namespace).each(function (i, el) {
      $(el).triggerHandler(closeEvent);
    });
  }

  function closeOthers(data) {
    var self = data.el[0];
    $dropdowns.each(function (i, other) {
      var $other = $(other);
      if ($other.is(self) || $other.has(self).length) {
        return;
      }
      $other.triggerHandler(closeEvent);
    });
  }

  function outside(data) {
    // Unbind previous tap handler if it exists
    if (data.outside) {
      $doc.off(mouseOrTap() + namespace, data.outside);
    }

    // Close menu when tapped outside
    return _.debounce(function (evt) {
      if (!data.open) {
        return;
      }
      var $target = $(evt.target);
      if ($target.closest('.w-dropdown-toggle').length) {
        return;
      }
      var isEventOutsideDropdowns = $.inArray(data.el[0], $target.parents(namespace)) === -1;
      var isEditor = Webflow.env('editor');
      if (isEventOutsideDropdowns) {
        if (isEditor) {
          var isEventOnDetachedSvg = $target.parents().length === 1 && $target.parents('svg').length === 1;
          var isEventOnHoverControls = $target.parents('.w-editor-bem-EditorHoverControls').length;
          if (isEventOnDetachedSvg || isEventOnHoverControls) {
            return;
          }
        }
        close(data);
      }
    });
  }

  function complete(data) {
    return function () {
      data.list.removeClass(stateOpen);
      data.toggle.removeClass(stateOpen);

      // Reset z-index for managed dropdowns
      data.manageZ && data.el.css('z-index', '');
    };
  }

  function enter(data) {
    return function () {
      data.hovering = true;
      open(data);
    };
  }

  function leave(data) {
    return function () {
      data.hovering = false;
      close(data);
    };
  }

  function moveOutside(data) {
    return _.debounce(function (evt) {
      if (!data.open) {
        return;
      }
      var $target = $(evt.target);
      var isEventOutsideDropdowns = $.inArray(data.el[0], $target.parents(namespace)) === -1;
      if (isEventOutsideDropdowns) {
        var isEventOnHoverControls = $target.parents('.w-editor-bem-EditorHoverControls').length;
        var isEventOnHoverToolbar = $target.parents('.w-editor-bem-RTToolbar').length;
        var $editorOverlay = $('.w-editor-bem-EditorOverlay');
        var isDropdownInEdition = $editorOverlay.find('.w-editor-edit-outline').length || $editorOverlay.find('.w-editor-bem-RTToolbar').length;
        if (isEventOnHoverControls || isEventOnHoverToolbar || isDropdownInEdition) {
          return;
        }
        data.hovering = false;
        close(data);
      }
    });
  }

  function mouseOrTap() {
    return touch ? 'tap' : 'mouseup';
  }

  // Export module
  return api;
});

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Webflow: Editor loader
 */

var Webflow = __webpack_require__(1);

Webflow.define('edit', module.exports = function ($, _, options) {
  options = options || {};

  // Exit early in test env or when inside an iframe
  if (Webflow.env('test') || Webflow.env('frame')) {
    // Allow test fixtures to continue
    if (!options.fixture) {
      return { exit: 1 };
    }
  }

  var api = {};
  var $win = $(window);
  var $html = $(document.documentElement);
  var location = document.location;
  var hashchange = 'hashchange';
  var loaded;
  var loadEditor = options.load || load;
  var hasLocalStorage = false;

  try {
    // Check localStorage for editor data
    hasLocalStorage = localStorage && localStorage.getItem && localStorage.getItem('WebflowEditor');
  } catch (e) {
    // SecurityError: browser storage has been disabled
  }

  if (hasLocalStorage) {
    loadEditor();
  } else if (location.search) {
    // Check url query for `edit` parameter or any url ending in `?edit`
    if (/[?&](edit)(?:[=&?]|$)/.test(location.search) || /\?edit$/.test(location.href)) {
      loadEditor();
    }
  } else {
    // Check hash fragment to support `#hash?edit`
    $win.on(hashchange, checkHash).triggerHandler(hashchange);
  }

  function checkHash() {
    if (loaded) {
      return;
    }
    // Load editor when hash contains `?edit`
    if (/\?edit/.test(location.hash)) {
      loadEditor();
    }
  }

  function load() {
    loaded = true;
    // Predefine global immediately to benefit Webflow.env
    window.WebflowEditor = true;
    $win.off(hashchange, checkHash);
    checkThirdPartyCookieSupport(function (thirdPartyCookiesSupported) {
      $.ajax({
        url: cleanSlashes("https://editor-api.webflow.com" + '/api/editor/view'),
        data: { siteId: $html.attr('data-wf-site') },
        xhrFields: { withCredentials: true },
        dataType: 'json',
        crossDomain: true,
        success: success(thirdPartyCookiesSupported)
      });
    });
  }

  function success(thirdPartyCookiesSupported) {
    return function (data) {
      if (!data) {
        console.error('Could not load editor data');
        return;
      }
      data.thirdPartyCookiesSupported = thirdPartyCookiesSupported;
      getScript(prefix(data.scriptPath), function () {
        window.WebflowEditor(data);
      });
    };
  }

  function getScript(url, done) {
    $.ajax({ type: 'GET', url: url, dataType: 'script', cache: true }).then(done, error);
  }

  function error(jqXHR, textStatus, errorThrown) {
    console.error('Could not load editor script: ' + textStatus);
    throw errorThrown;
  }

  function prefix(url) {
    return url.indexOf('//') >= 0 ? url : cleanSlashes("https://editor-api.webflow.com" + url);
  }

  function cleanSlashes(url) {
    return url.replace(/([^:])\/\//g, '$1/');
  }

  function checkThirdPartyCookieSupport(callback) {
    var iframe = window.document.createElement('iframe');
    iframe.src = "https://webflow.com" + '/site/third-party-cookie-check.html';
    iframe.style.display = 'none';
    iframe.sandbox = 'allow-scripts allow-same-origin';

    var handleMessage = function handleMessage(event) {
      if (event.data === 'WF_third_party_cookies_unsupported') {
        cleanUpCookieCheckerIframe(iframe, handleMessage);
        callback(false);
      } else if (event.data === 'WF_third_party_cookies_supported') {
        cleanUpCookieCheckerIframe(iframe, handleMessage);
        callback(true);
      }
    };

    iframe.onerror = function () {
      cleanUpCookieCheckerIframe(iframe, handleMessage);
      callback(false);
    };

    window.addEventListener('message', handleMessage, false);
    window.document.body.appendChild(iframe);
  }

  function cleanUpCookieCheckerIframe(iframe, listener) {
    window.removeEventListener('message', listener, false);
    iframe.remove();
  }

  // Export module
  return api;
});

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Webflow: Forms
 */

var Webflow = __webpack_require__(1);

Webflow.define('forms', module.exports = function ($, _) {
  var api = {};

  // Cross-Domain AJAX for IE8
  __webpack_require__(91);

  var $doc = $(document);
  var $forms;
  var loc = window.location;
  var retro = window.XDomainRequest && !window.atob;
  var namespace = '.w-form';
  var siteId;
  var emailField = /e(-)?mail/i;
  var emailValue = /^\S+@\S+$/;
  var alert = window.alert;
  var inApp = Webflow.env();
  var listening;

  // MailChimp domains: list-manage.com + mirrors
  var chimpRegex = /list-manage[1-9]?.com/i;

  var disconnected = _.debounce(function () {
    alert('Oops! This page has improperly configured forms. Please contact your website administrator to fix this issue.');
  }, 100);

  api.ready = api.design = api.preview = function () {
    // Init forms
    init();

    // Wire document events on published site only once
    if (!inApp && !listening) {
      addListeners();
    }
  };

  function init() {
    siteId = $('html').attr('data-wf-site');

    $forms = $(namespace + ' form');
    if (!$forms.length) {
      return;
    }
    $forms.each(build);
  }

  function build(i, el) {
    // Store form state using namespace
    var $el = $(el);
    var data = $.data(el, namespace);
    if (!data) {
      data = $.data(el, namespace, { form: $el });
    } // data.form

    reset(data);
    var wrap = $el.closest('div.w-form');
    data.done = wrap.find('> .w-form-done');
    data.fail = wrap.find('> .w-form-fail');

    var action = data.action = $el.attr('action');
    data.handler = null;
    data.redirect = $el.attr('data-redirect');

    // MailChimp form
    if (chimpRegex.test(action)) {
      data.handler = submitMailChimp;return;
    }

    // Custom form action
    if (action) {
      return;
    }

    // Webflow form
    if (siteId) {
      data.handler = submitWebflow;return;
    }

    // Alert for disconnected Webflow forms
    disconnected();
  }

  function addListeners() {
    listening = true;

    // Handle form submission for Webflow forms
    $doc.on('submit', namespace + ' form', function (evt) {
      var data = $.data(this, namespace);
      if (data.handler) {
        data.evt = evt;
        data.handler(data);
      }
    });
  }

  // Reset data common to all submit handlers
  function reset(data) {
    var btn = data.btn = data.form.find(':input[type="submit"]');
    data.wait = data.btn.attr('data-wait') || null;
    data.success = false;
    btn.prop('disabled', false);
    data.label && btn.val(data.label);
  }

  // Disable submit button
  function disableBtn(data) {
    var btn = data.btn;
    var wait = data.wait;
    btn.prop('disabled', true);
    // Show wait text and store previous label
    if (wait) {
      data.label = btn.val();
      btn.val(wait);
    }
  }

  // Find form fields, validate, and set value pairs
  function findFields(form, result) {
    var status = null;
    result = result || {};

    // The ":input" selector is a jQuery shortcut to select all inputs, selects, textareas
    form.find(':input:not([type="submit"])').each(function (i, el) {
      var field = $(el);
      var type = field.attr('type');
      var name = field.attr('data-name') || field.attr('name') || 'Field ' + (i + 1);
      var value = field.val();

      if (type === 'checkbox') {
        value = field.is(':checked');
      }if (type === 'radio') {
        // Radio group value already processed
        if (result[name] === null || typeof result[name] === 'string') {
          return;
        }

        value = form.find('input[name="' + field.attr('name') + '"]:checked').val() || null;
      }

      if (typeof value === 'string') {
        value = $.trim(value);
      }
      result[name] = value;
      status = status || getStatus(field, type, name, value);
    });

    return status;
  }

  function getStatus(field, type, name, value) {
    var status = null;

    if (type === 'password') {
      status = 'Passwords cannot be submitted.';
    } else if (field.attr('required')) {
      if (!value) {
        status = 'Please fill out the required field: ' + name;
      } else if (emailField.test(field.attr('type'))) {
        if (!emailValue.test(value)) {
          status = 'Please enter a valid email address for: ' + name;
        }
      }
    }

    return status;
  }

  // Submit form to Webflow
  function submitWebflow(data) {
    reset(data);

    var form = data.form;
    var payload = {
      name: form.attr('data-name') || form.attr('name') || 'Untitled Form',
      source: loc.href,
      test: Webflow.env(),
      fields: {},
      dolphin: /pass[\s-_]?(word|code)|secret|login|credentials/i.test(form.html())
    };

    preventDefault(data);

    // Find & populate all fields
    var status = findFields(form, payload.fields);
    if (status) {
      return alert(status);
    }

    // Disable submit button
    disableBtn(data);

    // Read site ID
    // NOTE: If this site is exported, the HTML tag must retain the data-wf-site attribute for forms to work
    if (!siteId) {
      afterSubmit(data);return;
    }
    var url = "https://webflow.com" + '/api/v1/form/' + siteId;

    // Work around same-protocol IE XDR limitation - without this IE9 and below forms won't submit
    if (retro && url.indexOf("https://webflow.com") >= 0) {
      url = url.replace("https://webflow.com", "http://formdata.webflow.com");
    }

    $.ajax({
      url: url,
      type: 'POST',
      data: payload,
      dataType: 'json',
      crossDomain: true
    }).done(function () {
      data.success = true;
      afterSubmit(data);
    }).fail(function () {
      afterSubmit(data);
    });
  }

  // Submit form to MailChimp
  function submitMailChimp(data) {
    reset(data);

    var form = data.form;
    var payload = {};

    // Skip Ajax submission if http/s mismatch, fallback to POST instead
    if (/^https/.test(loc.href) && !/^https/.test(data.action)) {
      form.attr('method', 'post');
      return;
    }

    preventDefault(data);

    // Find & populate all fields
    var status = findFields(form, payload);
    if (status) {
      return alert(status);
    }

    // Disable submit button
    disableBtn(data);

    // Use special format for MailChimp params
    var fullName;
    _.each(payload, function (value, key) {
      if (emailField.test(key)) {
        payload.EMAIL = value;
      }
      if (/^((full[ _-]?)?name)$/i.test(key)) {
        fullName = value;
      }
      if (/^(first[ _-]?name)$/i.test(key)) {
        payload.FNAME = value;
      }
      if (/^(last[ _-]?name)$/i.test(key)) {
        payload.LNAME = value;
      }
    });

    if (fullName && !payload.FNAME) {
      fullName = fullName.split(' ');
      payload.FNAME = fullName[0];
      payload.LNAME = payload.LNAME || fullName[1];
    }

    // Use the (undocumented) MailChimp jsonp api
    var url = data.action.replace('/post?', '/post-json?') + '&c=?';
    // Add special param to prevent bot signups
    var userId = url.indexOf('u=') + 2;
    userId = url.substring(userId, url.indexOf('&', userId));
    var listId = url.indexOf('id=') + 3;
    listId = url.substring(listId, url.indexOf('&', listId));
    payload['b_' + userId + '_' + listId] = '';

    $.ajax({
      url: url,
      data: payload,
      dataType: 'jsonp'
    }).done(function (resp) {
      data.success = resp.result === 'success' || /already/.test(resp.msg);
      if (!data.success) {
        console.info('MailChimp error: ' + resp.msg);
      }
      afterSubmit(data);
    }).fail(function () {
      afterSubmit(data);
    });
  }

  // Common callback which runs after all Ajax submissions
  function afterSubmit(data) {
    var form = data.form;
    var redirect = data.redirect;
    var success = data.success;

    // Redirect to a success url if defined
    if (success && redirect) {
      Webflow.location(redirect);
      return;
    }

    // Show or hide status divs
    data.done.toggle(success);
    data.fail.toggle(!success);

    // Hide form on success
    form.toggle(!success);

    // Reset data and enable submit button
    reset(data);
  }

  function preventDefault(data) {
    data.evt && data.evt.preventDefault();
    data.evt = null;
  }

  // Export module
  return api;
});

/***/ }),
/* 91 */
/***/ (function(module, exports) {

/*!
 * jQuery-ajaxTransport-XDomainRequest - v1.0.3
 * 2014-12-16 WEBFLOW - Removed UMD wrapper
 * https://github.com/MoonScript/jQuery-ajaxTransport-XDomainRequest
 * Copyright (c) 2014 Jason Moon (@JSONMOON)
 * @license MIT (/blob/master/LICENSE.txt)
 */
module.exports = function ($) {
  if ($.support.cors || !$.ajaxTransport || !window.XDomainRequest) {
    return;
  }var httpRegEx = /^https?:\/\//i;var getOrPostRegEx = /^get|post$/i;var sameSchemeRegEx = new RegExp("^" + location.protocol, "i");$.ajaxTransport("* text html xml json", function (options, userOptions, jqXHR) {
    if (!options.crossDomain || !options.async || !getOrPostRegEx.test(options.type) || !httpRegEx.test(options.url) || !sameSchemeRegEx.test(options.url)) {
      return;
    }var xdr = null;return { send: function send(headers, complete) {
        var postData = "";var userType = (userOptions.dataType || "").toLowerCase();xdr = new XDomainRequest();if (/^\d+$/.test(userOptions.timeout)) {
          xdr.timeout = userOptions.timeout;
        }xdr.ontimeout = function () {
          complete(500, "timeout");
        };xdr.onload = function () {
          var allResponseHeaders = "Content-Length: " + xdr.responseText.length + "\r\nContent-Type: " + xdr.contentType;var status = { code: 200, message: "success" };var responses = { text: xdr.responseText };try {
            if (userType === "html" || /text\/html/i.test(xdr.contentType)) {
              responses.html = xdr.responseText;
            } else if (userType === "json" || userType !== "text" && /\/json/i.test(xdr.contentType)) {
              try {
                responses.json = $.parseJSON(xdr.responseText);
              } catch (e) {
                status.code = 500;status.message = "parseerror";
              }
            } else if (userType === "xml" || userType !== "text" && /\/xml/i.test(xdr.contentType)) {
              var doc = new ActiveXObject("Microsoft.XMLDOM");doc.async = false;try {
                doc.loadXML(xdr.responseText);
              } catch (e) {
                doc = undefined;
              }if (!doc || !doc.documentElement || doc.getElementsByTagName("parsererror").length) {
                status.code = 500;status.message = "parseerror";throw "Invalid XML: " + xdr.responseText;
              }responses.xml = doc;
            }
          } catch (parseMessage) {
            throw parseMessage;
          } finally {
            complete(status.code, status.message, responses, allResponseHeaders);
          }
        };xdr.onprogress = function () {};xdr.onerror = function () {
          complete(500, "error", { text: xdr.responseText });
        };if (userOptions.data) {
          postData = $.type(userOptions.data) === "string" ? userOptions.data : $.param(userOptions.data);
        }xdr.open(options.type, options.url);xdr.send(postData);
      }, abort: function abort() {
        if (xdr) {
          xdr.abort();
        }
      } };
  });
}(window.jQuery);

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Webflow: Interactions
 */

var Webflow = __webpack_require__(1);
var IXEvents = __webpack_require__(49);

Webflow.define('ix', module.exports = function ($, _) {
  var api = {};
  var designer;
  var $win = $(window);
  var namespace = '.w-ix';
  var tram = $.tram;
  var env = Webflow.env;
  var inApp = env();
  var emptyFix = env.chrome && env.chrome < 35;
  var transNone = 'none 0s ease 0s';
  var $subs = $();
  var config = {};
  var anchors = [];
  var loads = [];
  var readys = [];
  var destroyed;
  var readyDelay = 1;

  // Component types and proxy selectors
  var components = {
    tabs: '.w-tab-link, .w-tab-pane',
    dropdown: '.w-dropdown',
    slider: '.w-slide',
    navbar: '.w-nav'
  };

  // -----------------------------------
  // Module methods

  api.init = function (list) {
    setTimeout(function () {
      configure(list);
    }, 1);
  };

  api.preview = function () {
    designer = false;
    readyDelay = 100;
    setTimeout(function () {
      configure(window.__wf_ix);
    }, 1);
  };

  api.design = function () {
    designer = true;
    api.destroy();
  };

  api.destroy = function () {
    destroyed = true;
    $subs.each(teardown);
    Webflow.scroll.off(scroll);
    IXEvents.async();
    anchors = [];
    loads = [];
    readys = [];
  };

  api.ready = function () {
    // Redirect IX init while in design/preview modes
    if (inApp) {
      return env('design') ? api.design() : api.preview();
    }

    // Ready should only be used after destroy, as a way to re-init
    if (config && destroyed) {
      destroyed = false;
      init();
    }
  };

  api.run = run;
  api.style = inApp ? styleApp : stylePub;

  // -----------------------------------
  // Private methods

  function configure(list) {
    if (!list) {
      return;
    }

    // Map all interactions by slug
    config = {};
    _.each(list, function (item) {
      config[item.slug] = item.value;
    });

    // Init ix after config
    init();
  }

  function init() {

    initIX1Engine();

    // Need init IXEvents regardless if IX1 events exist since
    // IXEvents _also_ dispatch IX2 events.

    // Trigger queued events, must happen after init
    IXEvents.init();

    // Trigger a redraw to ensure all IX intros play
    Webflow.redraw.up();
  }

  function initIX1Engine() {
    // Build each element's interaction keying from data attribute
    var els = $('[data-ix]');
    if (!els.length) {
      return;
    }

    els.each(teardown);
    els.each(build);

    // Listen for scroll events if any anchors exist
    if (anchors.length) {
      Webflow.scroll.on(scroll);
      setTimeout(scroll, 1);
    }

    // Handle loads or readys if they exist
    if (loads.length) {
      Webflow.load(runLoads);
    }
    if (readys.length) {
      setTimeout(runReadys, readyDelay);
    }
  }

  function build(i, el) {
    var $el = $(el);
    var id = $el.attr('data-ix');
    var ix = config[id];
    if (!ix) {
      return;
    }
    var triggers = ix.triggers;
    if (!triggers) {
      return;
    }

    // Set styles immediately to provide tram with starting transform values
    api.style($el, ix.style);

    _.each(triggers, function (trigger) {
      var state = {};
      var type = trigger.type;
      var stepsB = trigger.stepsB && trigger.stepsB.length;

      function runA() {
        run(trigger, $el, { group: 'A' });
      }
      function runB() {
        run(trigger, $el, { group: 'B' });
      }

      if (type === 'load') {
        trigger.preload && !inApp ? loads.push(runA) : readys.push(runA);
        return;
      }

      if (type === 'click') {
        $el.on('click' + namespace, function (evt) {
          // Avoid late clicks on touch devices
          if (!Webflow.validClick(evt.currentTarget)) {
            return;
          }

          // Prevent default on empty hash urls
          if ($el.attr('href') === '#') {
            evt.preventDefault();
          }

          run(trigger, $el, { group: state.clicked ? 'B' : 'A' });
          if (stepsB) {
            state.clicked = !state.clicked;
          }
        });
        $subs = $subs.add($el);
        return;
      }

      if (type === 'hover') {
        $el.on('mouseenter' + namespace, runA);
        $el.on('mouseleave' + namespace, runB);
        $subs = $subs.add($el);
        return;
      }

      if (type === 'scroll') {
        anchors.push({
          el: $el, trigger: trigger, state: { active: false },
          offsetTop: convert(trigger.offsetTop),
          offsetBot: convert(trigger.offsetBot)
        });
        return;
      }

      // Check for a proxy component selector
      // type == [tabs, dropdown, slider, navbar]
      var proxy = components[type];
      if (proxy) {
        var $proxy = $el.closest(proxy);
        $proxy.on(IXEvents.types.INTRO, runA).on(IXEvents.types.OUTRO, runB);
        $subs = $subs.add($proxy);
        return;
      }
    });
  }

  function convert(offset) {
    if (!offset) {
      return 0;
    }
    offset = String(offset);
    var result = parseInt(offset, 10);
    if (result !== result) {
      return 0;
    }
    if (offset.indexOf('%') > 0) {
      result /= 100;
      if (result >= 1) {
        result = 0.999;
      }
    }
    return result;
  }

  function teardown(i, el) {
    $(el).off(namespace);
  }

  function scroll() {
    var viewTop = $win.scrollTop();
    var viewHeight = $win.height();

    // Check each anchor for a valid scroll trigger
    var count = anchors.length;
    for (var i = 0; i < count; i++) {
      var anchor = anchors[i];
      var $el = anchor.el;
      var trigger = anchor.trigger;
      var stepsB = trigger.stepsB && trigger.stepsB.length;
      var state = anchor.state;
      var top = $el.offset().top;
      var height = $el.outerHeight();
      var offsetTop = anchor.offsetTop;
      var offsetBot = anchor.offsetBot;
      if (offsetTop < 1 && offsetTop > 0) {
        offsetTop *= viewHeight;
      }
      if (offsetBot < 1 && offsetBot > 0) {
        offsetBot *= viewHeight;
      }
      var active = top + height - offsetTop >= viewTop && top + offsetBot <= viewTop + viewHeight;
      if (active === state.active) {
        continue;
      }
      if (active === false && !stepsB) {
        continue;
      }
      state.active = active;
      run(trigger, $el, { group: active ? 'A' : 'B' });
    }
  }

  function runLoads() {
    var count = loads.length;
    for (var i = 0; i < count; i++) {
      loads[i]();
    }
  }

  function runReadys() {
    var count = readys.length;
    for (var i = 0; i < count; i++) {
      readys[i]();
    }
  }

  function run(trigger, $el, opts, replay) {
    opts = opts || {};
    var done = opts.done;
    var preserve3d = trigger.preserve3d;

    // Do not run in designer unless forced
    if (designer && !opts.force) {
      return;
    }

    // Operate on a set of grouped steps
    var group = opts.group || 'A';
    var loop = trigger['loop' + group];
    var steps = trigger['steps' + group];
    if (!steps || !steps.length) {
      return;
    }
    if (steps.length < 2) {
      loop = false;
    }

    // One-time init before any loops
    if (!replay) {

      // Find selector within element descendants, siblings, or query whole document
      var selector = trigger.selector;
      if (selector) {
        if (trigger.descend) {
          $el = $el.find(selector);
        } else if (trigger.siblings) {
          $el = $el.siblings(selector);
        } else {
          $el = $(selector);
        }
        if (inApp) {
          $el.attr('data-ix-affect', 1);
        }
      }

      // Apply empty fix for certain Chrome versions
      if (emptyFix) {
        $el.addClass('w-ix-emptyfix');
      }

      // Set preserve3d for triggers with 3d transforms
      if (preserve3d) {
        $el.css('transform-style', 'preserve-3d');
      }
    }

    var _tram = tram($el);

    // Add steps
    var meta = { omit3d: !preserve3d };
    for (var i = 0; i < steps.length; i++) {
      addStep(_tram, steps[i], meta);
    }

    function fin() {
      // Run trigger again if looped
      if (loop) {
        return run(trigger, $el, opts, true);
      }

      // Reset any 'auto' values
      if (meta.width === 'auto') {
        _tram.set({ width: 'auto' });
      }
      if (meta.height === 'auto') {
        _tram.set({ height: 'auto' });
      }

      // Run callback
      done && done();
    }

    // Add final step to queue if tram has started
    meta.start ? _tram.then(fin) : fin();
  }

  function addStep(_tram, step, meta) {
    var addMethod = 'add';
    var startMethod = 'start';

    // Once the transition has started, we will always use then() to add to the queue.
    if (meta.start) {
      addMethod = startMethod = 'then';
    }

    // Parse transitions string on the current step
    var transitions = step.transition;
    if (transitions) {
      transitions = transitions.split(',');
      for (var i = 0; i < transitions.length; i++) {
        var transition = transitions[i];
        _tram[addMethod](transition);
      }
    }

    // Build a clean object to pass to the tram method
    var clean = tramify(step, meta) || {};

    // Store last width and height values
    if (clean.width != null) {
      meta.width = clean.width;
    }
    if (clean.height != null) {
      meta.height = clean.height;
    }

    // When transitions are not present, set values immediately and continue queue.
    if (transitions == null) {

      // If we have started, wrap set() in then() and reset queue
      if (meta.start) {
        _tram.then(function () {
          var queue = this.queue;
          this.set(clean);
          if (clean.display) {
            _tram.redraw();
            Webflow.redraw.up();
          }
          this.queue = queue;
          this.next();
        });
      } else {
        _tram.set(clean);

        // Always redraw after setting display
        if (clean.display) {
          _tram.redraw();
          Webflow.redraw.up();
        }
      }

      // Use the wait() method to kick off queue in absence of transitions.
      var wait = clean.wait;
      if (wait != null) {
        _tram.wait(wait);
        meta.start = true;
      }

      // Otherwise, when transitions are present
    } else {

      // If display is present, handle it separately
      if (clean.display) {
        var display = clean.display;
        delete clean.display;

        // If we've already started, we need to wrap it in a then()
        if (meta.start) {
          _tram.then(function () {
            var queue = this.queue;
            this.set({ display: display }).redraw();
            Webflow.redraw.up();
            this.queue = queue;
            this.next();
          });
        } else {
          _tram.set({ display: display }).redraw();
          Webflow.redraw.up();
        }
      }

      // Otherwise, start a transition using the current start method.
      _tram[startMethod](clean);
      meta.start = true;
    }
  }

  // (In app) Set styles immediately and manage upstream transition
  function styleApp(el, data) {
    var _tram = tram(el);

    // Exit early when data is empty to avoid clearing upstream
    if ($.isEmptyObject(data)) {
      return;
    }

    // Get computed transition value
    el.css('transition', '');
    var computed = el.css('transition');

    // If computed is set to none, clear upstream
    if (computed === transNone) {
      computed = _tram.upstream = null;
    }

    // Set upstream transition to none temporarily
    _tram.upstream = transNone;

    // Set values immediately
    _tram.set(tramify(data));

    // Only restore upstream in preview mode
    _tram.upstream = computed;
  }

  // (Published) Set styles immediately on specified jquery element
  function stylePub(el, data) {
    tram(el).set(tramify(data));
  }

  // Build a clean object for tram
  function tramify(obj, meta) {
    var omit3d = meta && meta.omit3d;
    var result = {};
    var found = false;
    for (var key in obj) {
      if (key === 'transition') {
        continue;
      }
      if (key === 'keysort') {
        continue;
      }
      if (omit3d) {
        if (key === 'z' || key === 'rotateX' || key === 'rotateY' || key === 'scaleZ') {
          continue;
        }
      }
      result[key] = obj[key];
      found = true;
    }
    // If empty, return null for tram.set/stop compliance
    return found ? result : null;
  }

  // Export module
  return api;
});

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Webflow: Interactions 2
 */

var Webflow = __webpack_require__(1);
var ix2 = __webpack_require__(94);

Webflow.define('ix2', module.exports = function () {
  return ix2;
});

/***/ }),
/* 94 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "destroy", function() { return destroy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "store", function() { return store; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__reducers_IX2Reducer__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__logic_IX2VanillaEngine__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modules_webflow_lib__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modules_webflow_lib___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__modules_webflow_lib__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__actions_IX2EngineActions__ = __webpack_require__(44);
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "actions", function() { return __WEBPACK_IMPORTED_MODULE_4__actions_IX2EngineActions__; });






var store = Object(__WEBPACK_IMPORTED_MODULE_0_redux__["b" /* createStore */])(__WEBPACK_IMPORTED_MODULE_1__reducers_IX2Reducer__["a" /* default */]);

if (__WEBPACK_IMPORTED_MODULE_3__modules_webflow_lib___default.a.env()) {
  Object(__WEBPACK_IMPORTED_MODULE_2__logic_IX2VanillaEngine__["a" /* observeRequests */])(store);
}

function init(rawData) {
  destroy();
  Object(__WEBPACK_IMPORTED_MODULE_2__logic_IX2VanillaEngine__["c" /* startEngine */])({ store: store, rawData: rawData, allowEvents: true });
}

function destroy() {
  Object(__WEBPACK_IMPORTED_MODULE_2__logic_IX2VanillaEngine__["e" /* stopEngine */])(store);
}



/***/ }),
/* 95 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Symbol_js__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__getRawTag_js__ = __webpack_require__(98);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__objectToString_js__ = __webpack_require__(99);




/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = __WEBPACK_IMPORTED_MODULE_0__Symbol_js__["a" /* default */] ? __WEBPACK_IMPORTED_MODULE_0__Symbol_js__["a" /* default */].toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? Object(__WEBPACK_IMPORTED_MODULE_1__getRawTag_js__["a" /* default */])(value)
    : Object(__WEBPACK_IMPORTED_MODULE_2__objectToString_js__["a" /* default */])(value);
}

/* harmony default export */ __webpack_exports__["a"] = (baseGetTag);


/***/ }),
/* 96 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__freeGlobal_js__ = __webpack_require__(97);


/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = __WEBPACK_IMPORTED_MODULE_0__freeGlobal_js__["a" /* default */] || freeSelf || Function('return this')();

/* harmony default export */ __webpack_exports__["a"] = (root);


/***/ }),
/* 97 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/* harmony default export */ __webpack_exports__["a"] = (freeGlobal);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(24)))

/***/ }),
/* 98 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Symbol_js__ = __webpack_require__(53);


/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = __WEBPACK_IMPORTED_MODULE_0__Symbol_js__["a" /* default */] ? __WEBPACK_IMPORTED_MODULE_0__Symbol_js__["a" /* default */].toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/* harmony default export */ __webpack_exports__["a"] = (getRawTag);


/***/ }),
/* 99 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/* harmony default export */ __webpack_exports__["a"] = (objectToString);


/***/ }),
/* 100 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__overArg_js__ = __webpack_require__(101);


/** Built-in value references. */
var getPrototype = Object(__WEBPACK_IMPORTED_MODULE_0__overArg_js__["a" /* default */])(Object.getPrototypeOf, Object);

/* harmony default export */ __webpack_exports__["a"] = (getPrototype);


/***/ }),
/* 101 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/* harmony default export */ __webpack_exports__["a"] = (overArg);


/***/ }),
/* 102 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/* harmony default export */ __webpack_exports__["a"] = (isObjectLike);


/***/ }),
/* 103 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, module) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ponyfill_js__ = __webpack_require__(105);
/* global window */


var root;

if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (true) {
  root = module;
} else {
  root = Function('return this')();
}

var result = Object(__WEBPACK_IMPORTED_MODULE_0__ponyfill_js__["a" /* default */])(root);
/* harmony default export */ __webpack_exports__["a"] = (result);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(24), __webpack_require__(104)(module)))

/***/ }),
/* 104 */
/***/ (function(module, exports) {

module.exports = function(originalModule) {
	if(!originalModule.webpackPolyfill) {
		var module = Object.create(originalModule);
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		Object.defineProperty(module, "exports", {
			enumerable: true,
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 105 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = symbolObservablePonyfill;
function symbolObservablePonyfill(root) {
	var result;
	var Symbol = root.Symbol;

	if (typeof Symbol === 'function') {
		if (Symbol.observable) {
			result = Symbol.observable;
		} else {
			result = Symbol('observable');
			Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};


/***/ }),
/* 106 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = combineReducers;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__createStore__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_es_isPlainObject__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_warning__ = __webpack_require__(54);




function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state.';
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === __WEBPACK_IMPORTED_MODULE_0__createStore__["a" /* ActionTypes */].INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!Object(__WEBPACK_IMPORTED_MODULE_1_lodash_es_isPlainObject__["a" /* default */])(inputState)) {
    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });

  unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
  });

  if (unexpectedKeys.length > 0) {
    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
  }
}

function assertReducerSanity(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, { type: __WEBPACK_IMPORTED_MODULE_0__createStore__["a" /* ActionTypes */].INIT });

    if (typeof initialState === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
    }

    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if (typeof reducer(undefined, { type: type }) === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + __WEBPACK_IMPORTED_MODULE_0__createStore__["a" /* ActionTypes */].INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
    }
  });
}

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */
function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if (false) {
      if (typeof reducers[key] === 'undefined') {
        warning('No reducer provided for key "' + key + '"');
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  var finalReducerKeys = Object.keys(finalReducers);

  if (false) {
    var unexpectedKeyCache = {};
  }

  var sanityError;
  try {
    assertReducerSanity(finalReducers);
  } catch (e) {
    sanityError = e;
  }

  return function combination() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var action = arguments[1];

    if (sanityError) {
      throw sanityError;
    }

    if (false) {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
      if (warningMessage) {
        warning(warningMessage);
      }
    }

    var hasChanged = false;
    var nextState = {};
    for (var i = 0; i < finalReducerKeys.length; i++) {
      var key = finalReducerKeys[i];
      var reducer = finalReducers[key];
      var previousStateForKey = state[key];
      var nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(key, action);
        throw new Error(errorMessage);
      }
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
}

/***/ }),
/* 107 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(undefined, arguments));
  };
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
  }

  var keys = Object.keys(actionCreators);
  var boundActionCreators = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}

/***/ }),
/* 108 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__compose__ = __webpack_require__(55);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };



/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
function applyMiddleware() {
  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function (reducer, preloadedState, enhancer) {
      var store = createStore(reducer, preloadedState, enhancer);
      var _dispatch = store.dispatch;
      var chain = [];

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch(action) {
          return _dispatch(action);
        }
      };
      chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = __WEBPACK_IMPORTED_MODULE_0__compose__["a" /* default */].apply(undefined, chain)(store.dispatch);

      return _extends({}, store, {
        dispatch: _dispatch
      });
    };
  };
}

/***/ }),
/* 109 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__IX2DataReducer__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__IX2RequestReducer__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__IX2SessionReducer__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__IX2InstancesReducer__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__IX2ParametersReducer__ = __webpack_require__(117);








/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0_redux__["a" /* combineReducers */])({
  ixData: __WEBPACK_IMPORTED_MODULE_1__IX2DataReducer__["a" /* ixData */],
  ixRequest: __WEBPACK_IMPORTED_MODULE_2__IX2RequestReducer__["a" /* ixRequest */],
  ixSession: __WEBPACK_IMPORTED_MODULE_3__IX2SessionReducer__["a" /* ixSession */],
  ixInstances: __WEBPACK_IMPORTED_MODULE_4__IX2InstancesReducer__["a" /* ixInstances */],
  ixParameters: __WEBPACK_IMPORTED_MODULE_5__IX2ParametersReducer__["a" /* ixParameters */]
}));

/***/ }),
/* 110 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ixData; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__ = __webpack_require__(6);


var ixData = function ixData() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Object.freeze({});
  var action = arguments[1];

  switch (action.type) {
    case __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["l" /* IX2_RAW_DATA_IMPORTED */]:
      {
        return action.payload.ixData || Object.freeze({});
      }
    default:
      {
        return state;
      }
  }
};

/***/ }),
/* 111 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ixRequest; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_immutability_helper__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_immutability_helper___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_immutability_helper__);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Object$create;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




var initialState = {
  preview: {},
  playback: {},
  stop: {},
  clear: {}
};

var stateKeys = Object.create(null, (_Object$create = {}, _defineProperty(_Object$create, __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["k" /* IX2_PREVIEW_REQUESTED */], { value: 'preview' }), _defineProperty(_Object$create, __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["j" /* IX2_PLAYBACK_REQUESTED */], { value: 'playback' }), _defineProperty(_Object$create, __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["p" /* IX2_STOP_REQUESTED */], { value: 'stop' }), _defineProperty(_Object$create, __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["c" /* IX2_CLEAR_REQUESTED */], { value: 'clear' }), _Object$create));

var ixRequest = function ixRequest() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  if (action.type in stateKeys) {
    return __WEBPACK_IMPORTED_MODULE_1_immutability_helper___default()(state, _defineProperty({}, stateKeys[action.type], { $set: _extends({}, action.payload) }));
  }
  return state;
};

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (false) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;


/***/ }),
/* 113 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ixSession; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_immutability_helper__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_immutability_helper___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_immutability_helper__);
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




var initialState = {
  active: false,
  eventListeners: [],
  eventState: {},
  playbackState: {},
  viewportWidth: 0,
  mediaQueryKey: null,
  hasBoundaryNodes: false
};

var ixSession = function ixSession() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["m" /* IX2_SESSION_INITIALIZED */]:
      {
        var hasBoundaryNodes = action.payload.hasBoundaryNodes;

        return __WEBPACK_IMPORTED_MODULE_1_immutability_helper___default()(state, {
          hasBoundaryNodes: { $set: hasBoundaryNodes }
        });
      }
    case __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["n" /* IX2_SESSION_STARTED */]:
      {
        return __WEBPACK_IMPORTED_MODULE_1_immutability_helper___default()(state, {
          active: { $set: true }
        });
      }
    case __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["o" /* IX2_SESSION_STOPPED */]:
      {
        return initialState;
      }
    case __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["d" /* IX2_EVENT_LISTENER_ADDED */]:
      {
        return __WEBPACK_IMPORTED_MODULE_1_immutability_helper___default()(state, {
          eventListeners: { $push: [action.payload] }
        });
      }
    case __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["e" /* IX2_EVENT_STATE_CHANGED */]:
      {
        return __WEBPACK_IMPORTED_MODULE_1_immutability_helper___default()(state, {
          eventState: _defineProperty({}, action.payload.stateKey, { $set: action.payload.newState })
        });
      }
    case __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["a" /* IX2_ACTION_LIST_PLAYBACK_CHANGED */]:
      {
        var _action$payload = action.payload,
            actionListId = _action$payload.actionListId,
            isPlaying = _action$payload.isPlaying;

        return __WEBPACK_IMPORTED_MODULE_1_immutability_helper___default()(state, {
          playbackState: _defineProperty({}, actionListId, { $set: isPlaying })
        });
      }
    case __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["q" /* IX2_VIEWPORT_WIDTH_CHANGED */]:
      {
        var _action$payload2 = action.payload,
            width = _action$payload2.width,
            mediaQueries = _action$payload2.mediaQueries;

        var mediaQueryCount = mediaQueries.length;
        var mediaQueryKey = null;
        for (var i = 0; i < mediaQueryCount; i++) {
          var _mediaQueries$i = mediaQueries[i],
              key = _mediaQueries$i.key,
              min = _mediaQueries$i.min,
              max = _mediaQueries$i.max;

          if (width >= min && width <= max) {
            mediaQueryKey = key;
            break;
          }
        }
        return __WEBPACK_IMPORTED_MODULE_1_immutability_helper___default()(state, {
          viewportWidth: { $set: width },
          mediaQueryKey: { $set: mediaQueryKey }
        });
      }
    default:
      {
        return state;
      }
  }
};

/***/ }),
/* 114 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ixInstances; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_immutability_helper__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_immutability_helper___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_immutability_helper__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__logic_IX2EasingUtils__ = __webpack_require__(56);
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





var continuousInstance = function continuousInstance(state, action) {
  var lastPosition = state.position,
      parameterId = state.parameterId,
      actionGroups = state.actionGroups,
      destinationKeys = state.destinationKeys,
      smoothing = state.smoothing,
      restingValue = state.restingValue;
  var parameters = action.payload.parameters;

  var velocity = Math.max(1 - smoothing, 0.01);
  var paramValue = parameters[parameterId];
  if (paramValue == null) {
    velocity = 1;
    paramValue = restingValue;
  }
  var nextPosition = Math.max(paramValue, 0) || 0;
  var positionDiff = Object(__WEBPACK_IMPORTED_MODULE_2__logic_IX2EasingUtils__["b" /* optimizeFloat */])(nextPosition - lastPosition);
  var position = Object(__WEBPACK_IMPORTED_MODULE_2__logic_IX2EasingUtils__["b" /* optimizeFloat */])(lastPosition + positionDiff * velocity);
  var keyframePosition = position * 100;

  if (position === lastPosition && state.current) {
    return state;
  }

  var fromActionItem = void 0;
  var toActionItem = void 0;
  var positionOffset = void 0;
  var positionRange = void 0;

  for (var i = 0, length = actionGroups.length; i < length; i++) {
    var _actionGroups$i = actionGroups[i],
        keyframe = _actionGroups$i.keyframe,
        actionItems = _actionGroups$i.actionItems;


    if (i === 0) {
      fromActionItem = actionItems[0];
    }

    if (keyframePosition >= keyframe) {
      fromActionItem = actionItems[0];

      var nextGroup = actionGroups[i + 1];
      var hasNextItem = nextGroup && keyframePosition !== keyframe;

      toActionItem = hasNextItem ? nextGroup.actionItems[0] : null;

      if (hasNextItem) {
        positionOffset = keyframe / 100;
        positionRange = (nextGroup.keyframe - keyframe) / 100;
      }
    }
  }

  var current = {};

  if (fromActionItem && !toActionItem) {
    for (var _i = 0, _length = destinationKeys.length; _i < _length; _i++) {
      var key = destinationKeys[_i];
      current[key] = fromActionItem.config[key];
    }
  } else if (fromActionItem && toActionItem) {
    var localPosition = (position - positionOffset) / positionRange;
    var easing = fromActionItem.config.easing;
    var eased = Object(__WEBPACK_IMPORTED_MODULE_2__logic_IX2EasingUtils__["a" /* applyEasing */])(easing, localPosition);
    for (var _i2 = 0, _length2 = destinationKeys.length; _i2 < _length2; _i2++) {
      var _key = destinationKeys[_i2];
      var fromVal = fromActionItem.config[_key];
      var toVal = toActionItem.config[_key];
      var diff = toVal - fromVal;
      var value = diff * eased + fromVal;
      current[_key] = value;
    }
  }

  return __WEBPACK_IMPORTED_MODULE_1_immutability_helper___default()(state, {
    position: { $set: position },
    current: { $set: current }
  });
};

var timedInstance = function timedInstance(state, action) {
  var _state = state,
      active = _state.active,
      origin = _state.origin,
      start = _state.start,
      immediate = _state.immediate,
      isGeneral = _state.isGeneral,
      verbose = _state.verbose,
      actionItem = _state.actionItem,
      destination = _state.destination,
      destinationKeys = _state.destinationKeys;


  var easing = actionItem.config.easing;
  var _actionItem$config = actionItem.config,
      duration = _actionItem$config.duration,
      delay = _actionItem$config.delay;

  if (isGeneral) {
    duration = 0;
  } else if (immediate) {
    duration = delay = 0;
  }
  var now = action.payload.now;


  if (active && origin) {
    var delta = now - (start + delay);

    if (verbose) {
      var verboseDelta = now - start;
      var verboseDuration = duration + delay;
      var verbosePosition = Object(__WEBPACK_IMPORTED_MODULE_2__logic_IX2EasingUtils__["b" /* optimizeFloat */])(Math.min(Math.max(0, verboseDelta / verboseDuration), 1));
      state = __WEBPACK_IMPORTED_MODULE_1_immutability_helper___default()(state, {
        verboseTimeElapsed: { $set: verboseDuration * verbosePosition }
      });
    }

    if (delta < 0) {
      return state;
    }

    var position = Object(__WEBPACK_IMPORTED_MODULE_2__logic_IX2EasingUtils__["b" /* optimizeFloat */])(Math.min(Math.max(0, delta / duration), 1));
    var eased = Object(__WEBPACK_IMPORTED_MODULE_2__logic_IX2EasingUtils__["a" /* applyEasing */])(easing, position);

    var query = {};

    var current = destinationKeys.length ? destinationKeys.reduce(function (result, key) {
      var destValue = destination[key];
      var originVal = parseFloat(origin[key]) || 0;
      var diff = parseFloat(destValue) - originVal;
      var value = diff * eased + originVal;
      result[key] = value;
      return result;
    }, {}) : null;

    query.current = { $set: current };
    query.position = { $set: position };

    if (position === 1) {
      query.active = { $set: false };
      query.complete = { $set: true };
    }

    return __WEBPACK_IMPORTED_MODULE_1_immutability_helper___default()(state, query);
  }
  return state;
};

var ixInstances = function ixInstances() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Object.freeze({});
  var action = arguments[1];

  switch (action.type) {
    case __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["l" /* IX2_RAW_DATA_IMPORTED */]:
      {
        return action.payload.ixInstances || Object.freeze({});
      }
    case __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["o" /* IX2_SESSION_STOPPED */]:
      {
        return Object.freeze({});
      }
    case __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["f" /* IX2_INSTANCE_ADDED */]:
      {
        var _action$payload = action.payload,
            instanceId = _action$payload.instanceId,
            actionItem = _action$payload.actionItem,
            element = _action$payload.element,
            eventId = _action$payload.eventId,
            eventTarget = _action$payload.eventTarget,
            eventStateKey = _action$payload.eventStateKey,
            actionListId = _action$payload.actionListId,
            groupIndex = _action$payload.groupIndex,
            isCarrier = _action$payload.isCarrier,
            origin = _action$payload.origin,
            destination = _action$payload.destination,
            immediate = _action$payload.immediate,
            verbose = _action$payload.verbose,
            continuous = _action$payload.continuous,
            parameterId = _action$payload.parameterId,
            actionGroups = _action$payload.actionGroups,
            smoothing = _action$payload.smoothing,
            restingValue = _action$payload.restingValue;
        var actionTypeId = actionItem.actionTypeId;

        var typeFound = void 0;
        var isTransform = typeFound = /^TRANSFORM_/.test(actionTypeId);
        var isStyle = !typeFound ? typeFound = /^STYLE_/.test(actionTypeId) : false;
        var isGeneral = !typeFound ? typeFound = /^GENERAL_/.test(actionTypeId) : false;
        var styleProp = isStyle && actionTypeId.replace('STYLE_', '').toLowerCase();
        var destinationKeys = Object.keys(destination).filter(function (key) {
          return destination[key] != null;
        });

        return __WEBPACK_IMPORTED_MODULE_1_immutability_helper___default()(state, _defineProperty({}, instanceId, { $set: {
            id: instanceId,
            active: false,
            position: 0,
            start: 0,
            origin: origin,
            destination: destination,
            destinationKeys: destinationKeys,
            immediate: immediate,
            verbose: verbose,
            current: null,
            actionItem: actionItem,
            element: element,
            eventId: eventId,
            eventTarget: eventTarget,
            eventStateKey: eventStateKey,
            actionListId: actionListId,
            groupIndex: groupIndex,
            isTransform: isTransform,
            isStyle: isStyle,
            isGeneral: isGeneral,
            isCarrier: isCarrier,
            styleProp: styleProp,
            continuous: continuous,
            parameterId: parameterId,
            actionGroups: actionGroups,
            smoothing: smoothing,
            restingValue: restingValue
          } }));
      }
    case __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["h" /* IX2_INSTANCE_STARTED */]:
      {
        var _instanceId = action.payload.instanceId;

        return __WEBPACK_IMPORTED_MODULE_1_immutability_helper___default()(state, _defineProperty({}, _instanceId, { $merge: {
            active: true,
            complete: false,
            start: window.performance.now()
          } }));
      }
    case __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["g" /* IX2_INSTANCE_REMOVED */]:
      {
        var _instanceId2 = action.payload.instanceId;

        return __WEBPACK_IMPORTED_MODULE_1_immutability_helper___default()(state, { $unset: [_instanceId2] });
      }
    case __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["b" /* IX2_ANIMATION_FRAME_CHANGED */]:
      {
        var newState = state;
        var keys = Object.keys(state);
        var length = keys.length;

        for (var i = 0; i < length; i++) {
          var key = keys[i];
          var instance = state[key];
          var reducer = instance.continuous ? continuousInstance : timedInstance;
          newState = __WEBPACK_IMPORTED_MODULE_1_immutability_helper___default()(newState, _defineProperty({}, key, { $set: reducer(instance, action) }));
        }
        return newState;
      }
    default:
      {
        return state;
      }
  }
};

/***/ }),
/* 115 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ease", function() { return ease; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "easeIn", function() { return easeIn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "easeOut", function() { return easeOut; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "easeInOut", function() { return easeInOut; });
/* harmony export (immutable) */ __webpack_exports__["inQuad"] = inQuad;
/* harmony export (immutable) */ __webpack_exports__["outQuad"] = outQuad;
/* harmony export (immutable) */ __webpack_exports__["inOutQuad"] = inOutQuad;
/* harmony export (immutable) */ __webpack_exports__["inCubic"] = inCubic;
/* harmony export (immutable) */ __webpack_exports__["outCubic"] = outCubic;
/* harmony export (immutable) */ __webpack_exports__["inOutCubic"] = inOutCubic;
/* harmony export (immutable) */ __webpack_exports__["inQuart"] = inQuart;
/* harmony export (immutable) */ __webpack_exports__["outQuart"] = outQuart;
/* harmony export (immutable) */ __webpack_exports__["inOutQuart"] = inOutQuart;
/* harmony export (immutable) */ __webpack_exports__["inQuint"] = inQuint;
/* harmony export (immutable) */ __webpack_exports__["outQuint"] = outQuint;
/* harmony export (immutable) */ __webpack_exports__["inOutQuint"] = inOutQuint;
/* harmony export (immutable) */ __webpack_exports__["inSine"] = inSine;
/* harmony export (immutable) */ __webpack_exports__["outSine"] = outSine;
/* harmony export (immutable) */ __webpack_exports__["inOutSine"] = inOutSine;
/* harmony export (immutable) */ __webpack_exports__["inExpo"] = inExpo;
/* harmony export (immutable) */ __webpack_exports__["outExpo"] = outExpo;
/* harmony export (immutable) */ __webpack_exports__["inOutExpo"] = inOutExpo;
/* harmony export (immutable) */ __webpack_exports__["inCirc"] = inCirc;
/* harmony export (immutable) */ __webpack_exports__["outCirc"] = outCirc;
/* harmony export (immutable) */ __webpack_exports__["inOutCirc"] = inOutCirc;
/* harmony export (immutable) */ __webpack_exports__["outBounce"] = outBounce;
/* harmony export (immutable) */ __webpack_exports__["inBack"] = inBack;
/* harmony export (immutable) */ __webpack_exports__["outBack"] = outBack;
/* harmony export (immutable) */ __webpack_exports__["inOutBack"] = inOutBack;
/* harmony export (immutable) */ __webpack_exports__["inElastic"] = inElastic;
/* harmony export (immutable) */ __webpack_exports__["outElastic"] = outElastic;
/* harmony export (immutable) */ __webpack_exports__["inOutElastic"] = inOutElastic;
/* harmony export (immutable) */ __webpack_exports__["swingFromTo"] = swingFromTo;
/* harmony export (immutable) */ __webpack_exports__["swingFrom"] = swingFrom;
/* harmony export (immutable) */ __webpack_exports__["swingTo"] = swingTo;
/* harmony export (immutable) */ __webpack_exports__["bounce"] = bounce;
/* harmony export (immutable) */ __webpack_exports__["bouncePast"] = bouncePast;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bezier_easing__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bezier_easing___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_bezier_easing__);


// Easing functions adapted from Thomas Fuchs & Jeremy Kahn
// Easing Equations (c) 2003 Robert Penner, BSD license
// https://raw.github.com/danro/easing-js/master/LICENSE

var magicSwing = 1.70158;

var ease = __WEBPACK_IMPORTED_MODULE_0_bezier_easing___default()(0.250, 0.100, 0.250, 1.000);
var easeIn = __WEBPACK_IMPORTED_MODULE_0_bezier_easing___default()(0.420, 0.000, 1.000, 1.000);
var easeOut = __WEBPACK_IMPORTED_MODULE_0_bezier_easing___default()(0.000, 0.000, 0.580, 1.000);
var easeInOut = __WEBPACK_IMPORTED_MODULE_0_bezier_easing___default()(0.420, 0.000, 0.580, 1.000);

function inQuad(pos) {
  return Math.pow(pos, 2);
}

function outQuad(pos) {
  return -(Math.pow(pos - 1, 2) - 1);
}

function inOutQuad(pos) {
  if ((pos /= 0.5) < 1) {
    return 0.5 * Math.pow(pos, 2);
  }
  return -0.5 * ((pos -= 2) * pos - 2);
}

function inCubic(pos) {
  return Math.pow(pos, 3);
}

function outCubic(pos) {
  return Math.pow(pos - 1, 3) + 1;
}

function inOutCubic(pos) {
  if ((pos /= 0.5) < 1) {
    return 0.5 * Math.pow(pos, 3);
  }
  return 0.5 * (Math.pow(pos - 2, 3) + 2);
}

function inQuart(pos) {
  return Math.pow(pos, 4);
}

function outQuart(pos) {
  return -(Math.pow(pos - 1, 4) - 1);
}

function inOutQuart(pos) {
  if ((pos /= 0.5) < 1) {
    return 0.5 * Math.pow(pos, 4);
  }
  return -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
}

function inQuint(pos) {
  return Math.pow(pos, 5);
}

function outQuint(pos) {
  return Math.pow(pos - 1, 5) + 1;
}

function inOutQuint(pos) {
  if ((pos /= 0.5) < 1) {
    return 0.5 * Math.pow(pos, 5);
  }
  return 0.5 * (Math.pow(pos - 2, 5) + 2);
}

function inSine(pos) {
  return -Math.cos(pos * (Math.PI / 2)) + 1;
}

function outSine(pos) {
  return Math.sin(pos * (Math.PI / 2));
}

function inOutSine(pos) {
  return -0.5 * (Math.cos(Math.PI * pos) - 1);
}

function inExpo(pos) {
  return pos === 0 ? 0 : Math.pow(2, 10 * (pos - 1));
}

function outExpo(pos) {
  return pos === 1 ? 1 : -Math.pow(2, -10 * pos) + 1;
}

function inOutExpo(pos) {
  if (pos === 0) {
    return 0;
  }
  if (pos === 1) {
    return 1;
  }
  if ((pos /= 0.5) < 1) {
    return 0.5 * Math.pow(2, 10 * (pos - 1));
  }
  return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
}

function inCirc(pos) {
  return -(Math.sqrt(1 - pos * pos) - 1);
}

function outCirc(pos) {
  return Math.sqrt(1 - Math.pow(pos - 1, 2));
}

function inOutCirc(pos) {
  if ((pos /= 0.5) < 1) {
    return -0.5 * (Math.sqrt(1 - pos * pos) - 1);
  }
  return 0.5 * (Math.sqrt(1 - (pos -= 2) * pos) + 1);
}

function outBounce(pos) {
  if (pos < 1 / 2.75) {
    return 7.5625 * pos * pos;
  } else if (pos < 2 / 2.75) {
    return 7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75;
  } else if (pos < 2.5 / 2.75) {
    return 7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375;
  } else {
    return 7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375;
  }
}

function inBack(pos) {
  var s = magicSwing;
  return pos * pos * ((s + 1) * pos - s);
}

function outBack(pos) {
  var s = magicSwing;
  return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
}

function inOutBack(pos) {
  var s = magicSwing;
  if ((pos /= 0.5) < 1) {
    return 0.5 * (pos * pos * (((s *= 1.525) + 1) * pos - s));
  }
  return 0.5 * ((pos -= 2) * pos * (((s *= 1.525) + 1) * pos + s) + 2);
}

function inElastic(pos) {
  var s = magicSwing;
  var p = 0;
  var a = 1;
  if (pos === 0) {
    return 0;
  }
  if (pos === 1) {
    return 1;
  }
  if (!p) {
    p = 0.3;
  }
  if (a < 1) {
    a = 1;
    s = p / 4;
  } else {
    s = p / (2 * Math.PI) * Math.asin(1 / a);
  }
  return -(a * Math.pow(2, 10 * (pos -= 1)) * Math.sin((pos - s) * (2 * Math.PI) / p));
}

function outElastic(pos) {
  var s = magicSwing;
  var p = 0;
  var a = 1;
  if (pos === 0) {
    return 0;
  }
  if (pos === 1) {
    return 1;
  }
  if (!p) {
    p = 0.3;
  }
  if (a < 1) {
    a = 1;
    s = p / 4;
  } else {
    s = p / (2 * Math.PI) * Math.asin(1 / a);
  }
  return a * Math.pow(2, -10 * pos) * Math.sin((pos - s) * (2 * Math.PI) / p) + 1;
}

function inOutElastic(pos) {
  var s = magicSwing;
  var p = 0;
  var a = 1;
  if (pos === 0) {
    return 0;
  }
  if ((pos /= 1 / 2) === 2) {
    return 1;
  }
  if (!p) {
    p = 0.3 * 1.5;
  }
  if (a < 1) {
    a = 1;
    s = p / 4;
  } else {
    s = p / (2 * Math.PI) * Math.asin(1 / a);
  }
  if (pos < 1) {
    return -0.5 * (a * Math.pow(2, 10 * (pos -= 1)) * Math.sin((pos - s) * (2 * Math.PI) / p));
  }
  return a * Math.pow(2, -10 * (pos -= 1)) * Math.sin((pos - s) * (2 * Math.PI) / p) * 0.5 + 1;
}

function swingFromTo(pos) {
  var s = magicSwing;
  return (pos /= 0.5) < 1 ? 0.5 * (pos * pos * (((s *= 1.525) + 1) * pos - s)) : 0.5 * ((pos -= 2) * pos * (((s *= 1.525) + 1) * pos + s) + 2);
}

function swingFrom(pos) {
  var s = magicSwing;
  return pos * pos * ((s + 1) * pos - s);
}

function swingTo(pos) {
  var s = magicSwing;
  return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
}

function bounce(pos) {
  if (pos < 1 / 2.75) {
    return 7.5625 * pos * pos;
  } else if (pos < 2 / 2.75) {
    return 7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75;
  } else if (pos < 2.5 / 2.75) {
    return 7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375;
  } else {
    return 7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375;
  }
}

function bouncePast(pos) {
  if (pos < 1 / 2.75) {
    return 7.5625 * pos * pos;
  } else if (pos < 2 / 2.75) {
    return 2 - (7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75);
  } else if (pos < 2.5 / 2.75) {
    return 2 - (7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375);
  } else {
    return 2 - (7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375);
  }
}

/***/ }),
/* 116 */
/***/ (function(module, exports) {

/**
 * https://github.com/gre/bezier-easing
 * BezierEasing - use bezier curve for transition easing function
 * by GaÃ«tan Renaudeau 2014 - 2015 â€“ MIT License
 */

// These values are established by empiricism with tests (tradeoff: performance VS precision)
var NEWTON_ITERATIONS = 4;
var NEWTON_MIN_SLOPE = 0.001;
var SUBDIVISION_PRECISION = 0.0000001;
var SUBDIVISION_MAX_ITERATIONS = 10;

var kSplineTableSize = 11;
var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

var float32ArraySupported = typeof Float32Array === 'function';

function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
function C (aA1)      { return 3.0 * aA1; }

// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
function calcBezier (aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }

// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
function getSlope (aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }

function binarySubdivide (aX, aA, aB, mX1, mX2) {
  var currentX, currentT, i = 0;
  do {
    currentT = aA + (aB - aA) / 2.0;
    currentX = calcBezier(currentT, mX1, mX2) - aX;
    if (currentX > 0.0) {
      aB = currentT;
    } else {
      aA = currentT;
    }
  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
  return currentT;
}

function newtonRaphsonIterate (aX, aGuessT, mX1, mX2) {
 for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
   var currentSlope = getSlope(aGuessT, mX1, mX2);
   if (currentSlope === 0.0) {
     return aGuessT;
   }
   var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
   aGuessT -= currentX / currentSlope;
 }
 return aGuessT;
}

module.exports = function bezier (mX1, mY1, mX2, mY2) {
  if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
    throw new Error('bezier x values must be in [0, 1] range');
  }

  // Precompute samples table
  var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
  if (mX1 !== mY1 || mX2 !== mY2) {
    for (var i = 0; i < kSplineTableSize; ++i) {
      sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
    }
  }

  function getTForX (aX) {
    var intervalStart = 0.0;
    var currentSample = 1;
    var lastSample = kSplineTableSize - 1;

    for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
      intervalStart += kSampleStepSize;
    }
    --currentSample;

    // Interpolate to provide an initial guess for t
    var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
    var guessForT = intervalStart + dist * kSampleStepSize;

    var initialSlope = getSlope(guessForT, mX1, mX2);
    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
    } else if (initialSlope === 0.0) {
      return guessForT;
    } else {
      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
    }
  }

  return function BezierEasing (x) {
    if (mX1 === mY1 && mX2 === mY2) {
      return x; // linear
    }
    // Because JavaScript number are imprecise, we should guarantee the extremes are right.
    if (x === 0) {
      return 0;
    }
    if (x === 1) {
      return 1;
    }
    return calcBezier(getTForX(x), mY1, mY2);
  };
};


/***/ }),
/* 117 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ixParameters; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__ = __webpack_require__(6);


var ixParameters = function ixParameters() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {/*mutable flat state*/};
  var action = arguments[1];

  switch (action.type) {
    case __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["l" /* IX2_RAW_DATA_IMPORTED */]:
      {
        return action.payload.ixParameters || {/*mutable flat state*/};
      }
    case __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["o" /* IX2_SESSION_STOPPED */]:
      {
        return {/*mutable flat state*/};
      }
    case __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineActionTypes__["i" /* IX2_PARAMETER_CHANGED */]:
      {
        var _action$payload = action.payload,
            key = _action$payload.key,
            value = _action$payload.value;

        state[key] = value;
        return state;
      }
    default:
      {
        return state;
      }
  }
};

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

var baseIteratee = __webpack_require__(7),
    isArrayLike = __webpack_require__(9),
    keys = __webpack_require__(17);

/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} findIndexFunc The function to find the collection index.
 * @returns {Function} Returns the new find function.
 */
function createFind(findIndexFunc) {
  return function(collection, predicate, fromIndex) {
    var iterable = Object(collection);
    if (!isArrayLike(collection)) {
      var iteratee = baseIteratee(predicate, 3);
      collection = keys(collection);
      predicate = function(key) { return iteratee(iterable[key], key, iterable); };
    }
    var index = findIndexFunc(collection, predicate, fromIndex);
    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
  };
}

module.exports = createFind;


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsMatch = __webpack_require__(120),
    getMatchData = __webpack_require__(170),
    matchesStrictComparable = __webpack_require__(69);

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

module.exports = baseMatches;


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(59),
    baseIsEqual = __webpack_require__(63);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;


/***/ }),
/* 121 */
/***/ (function(module, exports) {

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(14);

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(14);

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(14);

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(14);

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(13);

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;


/***/ }),
/* 127 */
/***/ (function(module, exports) {

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;


/***/ }),
/* 128 */
/***/ (function(module, exports) {

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;


/***/ }),
/* 129 */
/***/ (function(module, exports) {

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(13),
    Map = __webpack_require__(26),
    MapCache = __webpack_require__(27);

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(60),
    isMasked = __webpack_require__(134),
    isObject = __webpack_require__(3),
    toSource = __webpack_require__(62);

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(10);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),
/* 133 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

var coreJsData = __webpack_require__(135);

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(2);

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ }),
/* 136 */
/***/ (function(module, exports) {

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

var Hash = __webpack_require__(138),
    ListCache = __webpack_require__(13),
    Map = __webpack_require__(26);

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;


/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

var hashClear = __webpack_require__(139),
    hashDelete = __webpack_require__(140),
    hashGet = __webpack_require__(141),
    hashHas = __webpack_require__(142),
    hashSet = __webpack_require__(143);

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(15);

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;


/***/ }),
/* 140 */
/***/ (function(module, exports) {

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(15);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;


/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(15);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

module.exports = hashHas;


/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(15);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(16);

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;


/***/ }),
/* 145 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;


/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(16);

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;


/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(16);

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;


/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(16);

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;


/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(59),
    equalArrays = __webpack_require__(64),
    equalByTag = __webpack_require__(155),
    equalObjects = __webpack_require__(159),
    getTag = __webpack_require__(35),
    isArray = __webpack_require__(0),
    isBuffer = __webpack_require__(28),
    isTypedArray = __webpack_require__(30);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = getTag(object);
    objTag = objTag == argsTag ? objectTag : objTag;
  }
  if (!othIsArr) {
    othTag = getTag(other);
    othTag = othTag == argsTag ? objectTag : othTag;
  }
  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

module.exports = baseIsEqualDeep;


/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

var MapCache = __webpack_require__(27),
    setCacheAdd = __webpack_require__(151),
    setCacheHas = __webpack_require__(152);

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;


/***/ }),
/* 151 */
/***/ (function(module, exports) {

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;


/***/ }),
/* 152 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;


/***/ }),
/* 153 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;


/***/ }),
/* 154 */
/***/ (function(module, exports) {

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(10),
    Uint8Array = __webpack_require__(156),
    eq = __webpack_require__(25),
    equalArrays = __webpack_require__(64),
    mapToArray = __webpack_require__(157),
    setToArray = __webpack_require__(158);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(2);

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;


/***/ }),
/* 157 */
/***/ (function(module, exports) {

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;


/***/ }),
/* 158 */
/***/ (function(module, exports) {

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;


/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

var keys = __webpack_require__(17);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

module.exports = equalObjects;


/***/ }),
/* 160 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;


/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(8),
    isObjectLike = __webpack_require__(5);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;


/***/ }),
/* 162 */
/***/ (function(module, exports) {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;


/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(8),
    isLength = __webpack_require__(31),
    isObjectLike = __webpack_require__(5);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;


/***/ }),
/* 164 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;


/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var freeGlobal = __webpack_require__(61);

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(66)(module)))

/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

var overArg = __webpack_require__(34);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;


/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(4),
    root = __webpack_require__(2);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;


/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(4),
    root = __webpack_require__(2);

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;


/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(4),
    root = __webpack_require__(2);

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;


/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

var isStrictComparable = __webpack_require__(68),
    keys = __webpack_require__(17);

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

module.exports = getMatchData;


/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsEqual = __webpack_require__(63),
    get = __webpack_require__(19),
    hasIn = __webpack_require__(175),
    isKey = __webpack_require__(37),
    isStrictComparable = __webpack_require__(68),
    matchesStrictComparable = __webpack_require__(69),
    toKey = __webpack_require__(11);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}

module.exports = baseMatchesProperty;


/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

var memoizeCapped = __webpack_require__(173);

/** Used to match property names within property paths. */
var reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;


/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

var memoize = __webpack_require__(174);

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

module.exports = memoizeCapped;


/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

var MapCache = __webpack_require__(27);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

module.exports = memoize;


/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

var baseHasIn = __webpack_require__(176),
    hasPath = __webpack_require__(177);

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

module.exports = hasIn;


/***/ }),
/* 176 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

module.exports = baseHasIn;


/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(20),
    isArguments = __webpack_require__(18),
    isArray = __webpack_require__(0),
    isIndex = __webpack_require__(29),
    isLength = __webpack_require__(31),
    toKey = __webpack_require__(11);

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

module.exports = hasPath;


/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

var baseProperty = __webpack_require__(73),
    basePropertyDeep = __webpack_require__(179),
    isKey = __webpack_require__(37),
    toKey = __webpack_require__(11);

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

module.exports = property;


/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(36);

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

module.exports = basePropertyDeep;


/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

var baseFindIndex = __webpack_require__(181),
    baseIteratee = __webpack_require__(7),
    toInteger = __webpack_require__(74);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * This method is like `_.find` except that it returns the index of the first
 * element `predicate` returns truthy for instead of the element itself.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.findIndex(users, function(o) { return o.user == 'barney'; });
 * // => 0
 *
 * // The `_.matches` iteratee shorthand.
 * _.findIndex(users, { 'user': 'fred', 'active': false });
 * // => 1
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findIndex(users, ['active', false]);
 * // => 0
 *
 * // The `_.property` iteratee shorthand.
 * _.findIndex(users, 'active');
 * // => 2
 */
function findIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger(fromIndex);
  if (index < 0) {
    index = nativeMax(length + index, 0);
  }
  return baseFindIndex(array, baseIteratee(predicate, 3), index);
}

module.exports = findIndex;


/***/ }),
/* 181 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;


/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

var toNumber = __webpack_require__(39);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

module.exports = toFinite;


/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

var baseKeys = __webpack_require__(32),
    getTag = __webpack_require__(35),
    isArrayLike = __webpack_require__(9),
    isString = __webpack_require__(184),
    stringSize = __webpack_require__(185);

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    setTag = '[object Set]';

/**
 * Gets the size of `collection` by returning its length for array-like
 * values or the number of own enumerable string keyed properties for objects.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object|string} collection The collection to inspect.
 * @returns {number} Returns the collection size.
 * @example
 *
 * _.size([1, 2, 3]);
 * // => 3
 *
 * _.size({ 'a': 1, 'b': 2 });
 * // => 2
 *
 * _.size('pebbles');
 * // => 7
 */
function size(collection) {
  if (collection == null) {
    return 0;
  }
  if (isArrayLike(collection)) {
    return isString(collection) ? stringSize(collection) : collection.length;
  }
  var tag = getTag(collection);
  if (tag == mapTag || tag == setTag) {
    return collection.size;
  }
  return baseKeys(collection).length;
}

module.exports = size;


/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(8),
    isArray = __webpack_require__(0),
    isObjectLike = __webpack_require__(5);

/** `Object#toString` result references. */
var stringTag = '[object String]';

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
}

module.exports = isString;


/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

var asciiSize = __webpack_require__(186),
    hasUnicode = __webpack_require__(187),
    unicodeSize = __webpack_require__(188);

/**
 * Gets the number of symbols in `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the string size.
 */
function stringSize(string) {
  return hasUnicode(string)
    ? unicodeSize(string)
    : asciiSize(string);
}

module.exports = stringSize;


/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

var baseProperty = __webpack_require__(73);

/**
 * Gets the size of an ASCII `string`.
 *
 * @private
 * @param {string} string The string inspect.
 * @returns {number} Returns the string size.
 */
var asciiSize = baseProperty('length');

module.exports = asciiSize;


/***/ }),
/* 187 */
/***/ (function(module, exports) {

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsZWJ = '\\u200d';

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

module.exports = hasUnicode;


/***/ }),
/* 188 */
/***/ (function(module, exports) {

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange + ']',
    rsCombo = '[' + rsComboRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/**
 * Gets the size of a Unicode `string`.
 *
 * @private
 * @param {string} string The string inspect.
 * @returns {number} Returns the string size.
 */
function unicodeSize(string) {
  var result = reUnicode.lastIndex = 0;
  while (reUnicode.test(string)) {
    ++result;
  }
  return result;
}

module.exports = unicodeSize;


/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

var baseIteratee = __webpack_require__(7),
    negate = __webpack_require__(190),
    pickBy = __webpack_require__(191);

/**
 * The opposite of `_.pickBy`; this method creates an object composed of
 * the own and inherited enumerable string keyed properties of `object` that
 * `predicate` doesn't return truthy for. The predicate is invoked with two
 * arguments: (value, key).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The source object.
 * @param {Function} [predicate=_.identity] The function invoked per property.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.omitBy(object, _.isNumber);
 * // => { 'b': '2' }
 */
function omitBy(object, predicate) {
  return pickBy(object, negate(baseIteratee(predicate)));
}

module.exports = omitBy;


/***/ }),
/* 190 */
/***/ (function(module, exports) {

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that negates the result of the predicate `func`. The
 * `func` predicate is invoked with the `this` binding and arguments of the
 * created function.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {Function} predicate The predicate to negate.
 * @returns {Function} Returns the new negated function.
 * @example
 *
 * function isEven(n) {
 *   return n % 2 == 0;
 * }
 *
 * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
 * // => [1, 3, 5]
 */
function negate(predicate) {
  if (typeof predicate != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  return function() {
    var args = arguments;
    switch (args.length) {
      case 0: return !predicate.call(this);
      case 1: return !predicate.call(this, args[0]);
      case 2: return !predicate.call(this, args[0], args[1]);
      case 3: return !predicate.call(this, args[0], args[1], args[2]);
    }
    return !predicate.apply(this, args);
  };
}

module.exports = negate;


/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__(72),
    baseIteratee = __webpack_require__(7),
    basePickBy = __webpack_require__(192),
    getAllKeysIn = __webpack_require__(195);

/**
 * Creates an object composed of the `object` properties `predicate` returns
 * truthy for. The predicate is invoked with two arguments: (value, key).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The source object.
 * @param {Function} [predicate=_.identity] The function invoked per property.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.pickBy(object, _.isNumber);
 * // => { 'a': 1, 'c': 3 }
 */
function pickBy(object, predicate) {
  if (object == null) {
    return {};
  }
  var props = arrayMap(getAllKeysIn(object), function(prop) {
    return [prop];
  });
  predicate = baseIteratee(predicate);
  return basePickBy(object, props, function(value, path) {
    return predicate(value, path[0]);
  });
}

module.exports = pickBy;


/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(36),
    baseSet = __webpack_require__(193),
    castPath = __webpack_require__(20);

/**
 * The base implementation of  `_.pickBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @param {Function} predicate The function invoked per property.
 * @returns {Object} Returns the new object.
 */
function basePickBy(object, paths, predicate) {
  var index = -1,
      length = paths.length,
      result = {};

  while (++index < length) {
    var path = paths[index],
        value = baseGet(object, path);

    if (predicate(value, path)) {
      baseSet(result, castPath(path, object), value);
    }
  }
  return result;
}

module.exports = basePickBy;


/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

var assignValue = __webpack_require__(194),
    castPath = __webpack_require__(20),
    isIndex = __webpack_require__(29),
    isObject = __webpack_require__(3),
    toKey = __webpack_require__(11);

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]),
        newValue = value;

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {});
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

module.exports = baseSet;


/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

var baseAssignValue = __webpack_require__(75),
    eq = __webpack_require__(25);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;


/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetAllKeys = __webpack_require__(196),
    getSymbolsIn = __webpack_require__(197),
    keysIn = __webpack_require__(200);

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

module.exports = getAllKeysIn;


/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(40),
    isArray = __webpack_require__(0);

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;


/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(40),
    getPrototype = __webpack_require__(198),
    getSymbols = __webpack_require__(199),
    stubArray = __webpack_require__(77);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

module.exports = getSymbolsIn;


/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

var overArg = __webpack_require__(34);

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;


/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

var overArg = __webpack_require__(34),
    stubArray = __webpack_require__(77);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

module.exports = getSymbols;


/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeKeys = __webpack_require__(65),
    baseKeysIn = __webpack_require__(201),
    isArrayLike = __webpack_require__(9);

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

module.exports = keysIn;


/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(3),
    isPrototype = __webpack_require__(33),
    nativeKeysIn = __webpack_require__(202);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeysIn;


/***/ }),
/* 202 */
/***/ (function(module, exports) {

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = nativeKeysIn;


/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

var baseKeys = __webpack_require__(32),
    getTag = __webpack_require__(35),
    isArguments = __webpack_require__(18),
    isArray = __webpack_require__(0),
    isArrayLike = __webpack_require__(9),
    isBuffer = __webpack_require__(28),
    isPrototype = __webpack_require__(33),
    isTypedArray = __webpack_require__(30);

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    setTag = '[object Set]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if `value` is an empty object, collection, map, or set.
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (isArrayLike(value) &&
      (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
        isBuffer(value) || isTypedArray(value) || isArguments(value))) {
    return !value.length;
  }
  var tag = getTag(value);
  if (tag == mapTag || tag == setTag) {
    return !value.size;
  }
  if (isPrototype(value)) {
    return !baseKeys(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
}

module.exports = isEmpty;


/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

var baseAssignValue = __webpack_require__(75),
    baseForOwn = __webpack_require__(78),
    baseIteratee = __webpack_require__(7);

/**
 * Creates an object with the same keys as `object` and values generated
 * by running each own enumerable string keyed property of `object` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, key, object).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns the new mapped object.
 * @see _.mapKeys
 * @example
 *
 * var users = {
 *   'fred':    { 'user': 'fred',    'age': 40 },
 *   'pebbles': { 'user': 'pebbles', 'age': 1 }
 * };
 *
 * _.mapValues(users, function(o) { return o.age; });
 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
 *
 * // The `_.property` iteratee shorthand.
 * _.mapValues(users, 'age');
 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
 */
function mapValues(object, iteratee) {
  var result = {};
  iteratee = baseIteratee(iteratee, 3);

  baseForOwn(object, function(value, key, object) {
    baseAssignValue(result, key, iteratee(value, key, object));
  });
  return result;
}

module.exports = mapValues;


/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

var createBaseFor = __webpack_require__(206);

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;


/***/ }),
/* 206 */
/***/ (function(module, exports) {

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;


/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

var arrayEach = __webpack_require__(208),
    baseEach = __webpack_require__(79),
    castFunction = __webpack_require__(210),
    isArray = __webpack_require__(0);

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _.forEach([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray(collection) ? arrayEach : baseEach;
  return func(collection, castFunction(iteratee));
}

module.exports = forEach;


/***/ }),
/* 208 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;


/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

var isArrayLike = __webpack_require__(9);

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;


/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

var identity = __webpack_require__(38);

/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */
function castFunction(value) {
  return typeof value == 'function' ? value : identity;
}

module.exports = castFunction;


/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

var baseClamp = __webpack_require__(80),
    baseToString = __webpack_require__(71),
    toInteger = __webpack_require__(74),
    toString = __webpack_require__(70);

/**
 * Checks if `string` ends with the given target string.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to inspect.
 * @param {string} [target] The string to search for.
 * @param {number} [position=string.length] The position to search up to.
 * @returns {boolean} Returns `true` if `string` ends with `target`,
 *  else `false`.
 * @example
 *
 * _.endsWith('abc', 'c');
 * // => true
 *
 * _.endsWith('abc', 'b');
 * // => false
 *
 * _.endsWith('abc', 'b', 2);
 * // => true
 */
function endsWith(string, target, position) {
  string = toString(string);
  target = baseToString(target);

  var length = string.length;
  position = position === undefined
    ? length
    : baseClamp(toInteger(position), 0, length);

  var end = position;
  position -= target.length;
  return position >= 0 && string.slice(position, end) == target;
}

module.exports = endsWith;


/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

var debounce = __webpack_require__(213),
    isObject = __webpack_require__(3);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

module.exports = throttle;


/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(3),
    now = __webpack_require__(214),
    toNumber = __webpack_require__(39);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

module.exports = debounce;


/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(2);

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

module.exports = now;


/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _shallowEqual = __webpack_require__(216);

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _shallowEqual2.default;

/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 * 
 */

/*eslint-disable no-self-compare */



var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
  // SameValue algorithm
  if (x === y) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    // Added the nonzero y check to make Flow happy, but it is redundant
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
  }
}

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
function shallowEqual(objA, objB) {
  if (is(objA, objB)) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

module.exports = shallowEqual;

/***/ }),
/* 217 */
/***/ (function(module, exports) {

/**
 * Checks `value` to determine whether a default value should be returned in
 * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
 * or `undefined`.
 *
 * @static
 * @memberOf _
 * @since 4.14.0
 * @category Util
 * @param {*} value The value to check.
 * @param {*} defaultValue The default value.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * _.defaultTo(1, 10);
 * // => 1
 *
 * _.defaultTo(undefined, 10);
 * // => 10
 */
function defaultTo(value, defaultValue) {
  return (value == null || value !== value) ? defaultValue : value;
}

module.exports = defaultTo;


/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

var arrayReduce = __webpack_require__(219),
    baseEach = __webpack_require__(79),
    baseIteratee = __webpack_require__(7),
    baseReduce = __webpack_require__(220),
    isArray = __webpack_require__(0);

/**
 * Reduces `collection` to a value which is the accumulated result of running
 * each element in `collection` thru `iteratee`, where each successive
 * invocation is supplied the return value of the previous. If `accumulator`
 * is not given, the first element of `collection` is used as the initial
 * value. The iteratee is invoked with four arguments:
 * (accumulator, value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.reduce`, `_.reduceRight`, and `_.transform`.
 *
 * The guarded methods are:
 * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
 * and `sortBy`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @returns {*} Returns the accumulated value.
 * @see _.reduceRight
 * @example
 *
 * _.reduce([1, 2], function(sum, n) {
 *   return sum + n;
 * }, 0);
 * // => 3
 *
 * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
 *   (result[value] || (result[value] = [])).push(key);
 *   return result;
 * }, {});
 * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
 */
function reduce(collection, iteratee, accumulator) {
  var func = isArray(collection) ? arrayReduce : baseReduce,
      initAccum = arguments.length < 3;

  return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEach);
}

module.exports = reduce;


/***/ }),
/* 219 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

module.exports = arrayReduce;


/***/ }),
/* 220 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.reduce` and `_.reduceRight`, without support
 * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} accumulator The initial value.
 * @param {boolean} initAccum Specify using the first or last element of
 *  `collection` as the initial value.
 * @param {Function} eachFunc The function to iterate over `collection`.
 * @returns {*} Returns the accumulated value.
 */
function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
  eachFunc(collection, function(value, index, collection) {
    accumulator = initAccum
      ? (initAccum = false, value)
      : iteratee(accumulator, value, index, collection);
  });
  return accumulator;
}

module.exports = baseReduce;


/***/ }),
/* 221 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["setStyle"] = setStyle;
/* harmony export (immutable) */ __webpack_exports__["getStyle"] = getStyle;
/* harmony export (immutable) */ __webpack_exports__["getProperty"] = getProperty;
/* harmony export (immutable) */ __webpack_exports__["matchSelector"] = matchSelector;
/* harmony export (immutable) */ __webpack_exports__["getQuerySelector"] = getQuerySelector;
/* harmony export (immutable) */ __webpack_exports__["getValidDocument"] = getValidDocument;
/* harmony export (immutable) */ __webpack_exports__["queryDocument"] = queryDocument;
/* harmony export (immutable) */ __webpack_exports__["elementContains"] = elementContains;
/* harmony export (immutable) */ __webpack_exports__["isSiblingNode"] = isSiblingNode;
/* harmony export (immutable) */ __webpack_exports__["getChildElements"] = getChildElements;
/* harmony export (immutable) */ __webpack_exports__["getSiblingElements"] = getSiblingElements;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getClosestElement", function() { return getClosestElement; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineConstants__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__IX2BrowserSupport__ = __webpack_require__(81);



function setStyle(element, prop, value) {
  element.style[prop] = value;
}

function getStyle(element, prop) {
  return element.style[prop];
}

function getProperty(element, prop) {
  return element[prop];
}

function matchSelector(selector) {
  return function (element) {
    return element[__WEBPACK_IMPORTED_MODULE_1__IX2BrowserSupport__["a" /* ELEMENT_MATCHES */]](selector);
  };
}

function getQuerySelector(_ref) {
  var id = _ref.id,
      selector = _ref.selector;

  if (id) {
    var nodeId = id;
    if (id.indexOf(__WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineConstants__["o" /* IX2_ID_DELIMITER */]) !== -1) {
      var pair = id.split(__WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineConstants__["o" /* IX2_ID_DELIMITER */]);
      var pageId = pair[0];
      nodeId = pair[1];
      // Short circuit query if we're on the wrong page
      if (pageId !== document.documentElement.getAttribute(__WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineConstants__["E" /* WF_PAGE */])) {
        return null;
      }
    }
    return '[data-w-id^="' + nodeId + '"]';
  }
  return selector;
}

function getValidDocument(pageId) {
  if (pageId == null || pageId === document.documentElement.getAttribute(__WEBPACK_IMPORTED_MODULE_0__constants_IX2EngineConstants__["E" /* WF_PAGE */])) {
    return document;
  }
  return null;
}

function queryDocument(baseSelector, descendantSelector) {
  return Array.prototype.slice.call(document.querySelectorAll(descendantSelector ? baseSelector + ' ' + descendantSelector : baseSelector));
}

function elementContains(parent, child) {
  return parent.contains(child);
}

function isSiblingNode(a, b) {
  return a !== b && a.parentNode === b.parentNode;
}

function getChildElements() {
  var sourceElements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var elements = [];
  for (var i = 0, length = sourceElements.length; i < length; i++) {
    var children = sourceElements[i].children;
    var childCount = children.length;

    if (!childCount) {
      continue;
    }
    for (var j = 0; j < childCount; j++) {
      elements.push(children[j]);
    }
  }
  return elements;
}

function getSiblingElements() {
  var sourceElements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var elements = [];
  var parentCache = [];
  for (var i = 0, length = sourceElements.length; i < length; i++) {
    var parentNode = sourceElements[i].parentNode;

    if (!parentNode || !parentNode.children || !parentNode.children.length) {
      continue;
    }
    if (parentCache.indexOf(parentNode) !== -1) {
      continue;
    }
    parentCache.push(parentNode);
    var el = parentNode.firstElementChild;
    while (el != null) {
      if (sourceElements.indexOf(el) === -1) {
        elements.push(el);
      }
      el = el.nextElementSibling;
    }
  }
  return elements;
}

var getClosestElement = Element.prototype.closest ? function (element, selector) {
  if (!document.documentElement.contains(element)) {
    return null;
  }
  return element.closest(selector);
} : function (element, selector) {
  if (!document.documentElement.contains(element)) {
    return null;
  }
  var el = element;
  do {
    if (el[__WEBPACK_IMPORTED_MODULE_1__IX2BrowserSupport__["a" /* ELEMENT_MATCHES */]] && el[__WEBPACK_IMPORTED_MODULE_1__IX2BrowserSupport__["a" /* ELEMENT_MATCHES */]](selector)) {
      return el;
    }
    el = el.parentNode;
  } while (el != null);
  return null;
};

/***/ }),
/* 222 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_flow__ = __webpack_require__(223);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_flow___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_flow__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_get__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_get___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash_get__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_clamp__ = __webpack_require__(242);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_clamp___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash_clamp__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__IX2VanillaEngine__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__IX2VanillaUtils__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__actions_IX2EngineActions__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__ = __webpack_require__(22);
var _SLIDER_ACTIVE$SLIDER;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }















var composableFilter = function composableFilter(predicate) {
  return function (options) {
    if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' && predicate(options)) {
      return true;
    }
    return options;
  };
};

var isElement = composableFilter(function (_ref) {
  var element = _ref.element,
      nativeEvent = _ref.nativeEvent;

  return element === nativeEvent.target;
});

var containsElement = composableFilter(function (_ref2) {
  var element = _ref2.element,
      nativeEvent = _ref2.nativeEvent;

  return element.contains(nativeEvent.target);
});

var isOrContainsElement = __WEBPACK_IMPORTED_MODULE_0_lodash_flow___default()([isElement, containsElement]);

var getAutoStopEvent = function getAutoStopEvent(store, autoStopEventId) {
  if (autoStopEventId) {
    var _store$getState = store.getState(),
        ixData = _store$getState.ixData;

    var events = ixData.events;

    return events[autoStopEventId];
  }
  return null;
};

var hasAutoStopEvent = function hasAutoStopEvent(_ref3) {
  var store = _ref3.store,
      event = _ref3.event;
  var eventAction = event.action;
  var autoStopEventId = eventAction.config.autoStopEventId;

  return Boolean(getAutoStopEvent(store, autoStopEventId));
};

var actionGroupCreator = function actionGroupCreator(_ref4, state) {
  var store = _ref4.store,
      event = _ref4.event,
      element = _ref4.element,
      eventStateKey = _ref4.eventStateKey;
  var eventAction = event.action,
      eventId = event.id;
  var _eventAction$config = eventAction.config,
      actionListId = _eventAction$config.actionListId,
      autoStopEventId = _eventAction$config.autoStopEventId;

  var eventToStop = getAutoStopEvent(store, autoStopEventId);
  if (eventToStop) {
    Object(__WEBPACK_IMPORTED_MODULE_3__IX2VanillaEngine__["d" /* stopActionGroup */])({
      store: store,
      eventId: autoStopEventId,
      eventTarget: element,
      eventStateKey: autoStopEventId + __WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["h" /* COLON_DELIMITER */] + eventStateKey.split(__WEBPACK_IMPORTED_MODULE_7__constants_IX2EngineConstants__["h" /* COLON_DELIMITER */])[1],
      actionListId: __WEBPACK_IMPORTED_MODULE_1_lodash_get___default()(eventToStop, 'action.config.actionListId')
    });
  }
  Object(__WEBPACK_IMPORTED_MODULE_3__IX2VanillaEngine__["d" /* stopActionGroup */])({ store: store, eventId: eventId, eventTarget: element, eventStateKey: eventStateKey, actionListId: actionListId });
  Object(__WEBPACK_IMPORTED_MODULE_3__IX2VanillaEngine__["b" /* startActionGroup */])({ store: store, eventId: eventId, eventTarget: element, eventStateKey: eventStateKey, actionListId: actionListId });
  return state;
};

var withFilter = function withFilter(filter, handler) {
  return function (options, state) {
    return filter(options, state) === true ? handler(options, state) : state;
  };
};

var baseActionGroupOptions = {
  handler: withFilter(isOrContainsElement, actionGroupCreator)
};

var baseActivityActionGroupOptions = _extends({}, baseActionGroupOptions, {
  types: [__WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["a" /* COMPONENT_ACTIVE */], __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["b" /* COMPONENT_INACTIVE */]].join(" ")
});

var CONTINUOUS_SCROLL_EVENT_TYPES = [{ target: window, types: 'resize orientationchange', throttle: true }, { target: document, types: 'scroll wheel readystatechange IX2_PREVIEW_LOAD', throttle: true }];

var TRIGGERED_SCROLL_EVENT_TYPES = [{ target: document, types: 'scroll wheel', throttle: true }];

var MOUSE_OVER_OUT_TYPES = 'mouseover mouseout';

var baseScrollActionGroupOptions = {
  types: TRIGGERED_SCROLL_EVENT_TYPES
};

var getDocumentState = function () {
  var supportOffset = window.pageXOffset !== undefined;
  var isCSS1Compat = document.compatMode === 'CSS1Compat';
  var rootElement = isCSS1Compat ? document.documentElement : document.body;
  return function () {
    return {
      scrollLeft: supportOffset ? window.pageXOffset : rootElement.scrollLeft,
      scrollTop: supportOffset ? window.pageYOffset : rootElement.scrollTop,

      // required to remove elasticity in Safari scrolling.
      stiffScrollTop: __WEBPACK_IMPORTED_MODULE_2_lodash_clamp___default()(supportOffset ? window.pageYOffset : rootElement.scrollTop, 0, rootElement.scrollHeight - window.innerHeight),
      scrollWidth: rootElement.scrollWidth,
      scrollHeight: rootElement.scrollHeight,
      clientWidth: rootElement.clientWidth,
      clientHeight: rootElement.clientHeight,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight
    };
  };
}();

var areBoxesIntersecting = function areBoxesIntersecting(a, b) {
  return !(a.left > b.right || a.right < b.left || a.top > b.bottom || a.bottom < b.top);
};

var isElementHovered = function isElementHovered(_ref5) {
  var element = _ref5.element,
      nativeEvent = _ref5.nativeEvent;
  var type = nativeEvent.type,
      target = nativeEvent.target,
      relatedTarget = nativeEvent.relatedTarget;

  var containsTarget = element.contains(target);
  if (type === 'mouseover' && containsTarget) {
    return true;
  }
  var containsRelated = element.contains(relatedTarget);
  if (type === 'mouseout' && containsTarget && containsRelated) {
    return true;
  }
  return false;
};

var isElementVisible = function isElementVisible(options) {
  var element = options.element,
      config = options.event.config;

  var _getDocumentState = getDocumentState(),
      clientWidth = _getDocumentState.clientWidth,
      clientHeight = _getDocumentState.clientHeight;

  var scrollOffsetValue = config.scrollOffsetValue;
  var scrollOffsetUnit = config.scrollOffsetUnit;
  var isPX = scrollOffsetUnit === 'PX';

  var offsetPadding = isPX ? scrollOffsetValue : clientHeight * (scrollOffsetValue || 0) / 100;

  return areBoxesIntersecting(element.getBoundingClientRect(), {
    left: 0,
    top: offsetPadding,
    right: clientWidth,
    bottom: clientHeight - offsetPadding
  });
};

var whenComponentActiveChange = function whenComponentActiveChange(handler) {
  return function (options, oldState) {
    var isActive = [__WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["a" /* COMPONENT_ACTIVE */], __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["b" /* COMPONENT_INACTIVE */]].indexOf(options.nativeEvent.type) !== -1 ? options.nativeEvent.type === __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["a" /* COMPONENT_ACTIVE */] : oldState.isActive;

    var newState = _extends({}, oldState, {
      isActive: isActive
    });

    if (!oldState || newState.isActive !== oldState.isActive) {
      return handler(options, newState) || newState;
    }

    return newState;
  };
};

var whenElementHoverChange = function whenElementHoverChange(handler) {
  return function (options, oldState) {
    var newState = {
      elementHovered: isElementHovered(options)
    };
    if (oldState ? newState.elementHovered !== oldState.elementHovered : newState.elementHovered) {
      return handler(options, newState) || newState;
    }
    return newState;
  };
};

var whenElementVisibiltyChange = function whenElementVisibiltyChange(handler) {
  return function (options, oldState) {
    var newState = _extends({}, oldState, {
      elementVisible: isElementVisible(options)
    });
    if (oldState ? newState.elementVisible !== oldState.elementVisible : newState.elementVisible) {
      return handler(options, newState) || newState;
    }
    return newState;
  };
};

var whenScrollDirectionChange = function whenScrollDirectionChange(handler) {
  return function (options) {
    var oldState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _getDocumentState2 = getDocumentState(),
        scrollTop = _getDocumentState2.stiffScrollTop,
        scrollHeight = _getDocumentState2.scrollHeight,
        innerHeight = _getDocumentState2.innerHeight;

    var _options$event = options.event,
        config = _options$event.config,
        eventTypeId = _options$event.eventTypeId;
    var scrollOffsetValue = config.scrollOffsetValue,
        scrollOffsetUnit = config.scrollOffsetUnit;

    var isPX = scrollOffsetUnit === 'PX';

    var scrollHeightBounds = scrollHeight - innerHeight;
    // percent top since innerHeight may change for mobile devices which also changes the scrollTop value.
    var percentTop = Number((scrollTop / scrollHeightBounds).toFixed(2));

    // no state change
    if (oldState && oldState.percentTop === percentTop) {
      return oldState;
    }

    var scrollTopPadding = (isPX ? scrollOffsetValue : innerHeight * (scrollOffsetValue || 0) / 100) / scrollHeightBounds;

    var scrollingDown = void 0;
    var scrollDirectionChanged = void 0;
    var anchorTop = 0;

    if (oldState) {
      scrollingDown = percentTop > oldState.percentTop;
      scrollDirectionChanged = oldState.scrollingDown !== scrollingDown;
      anchorTop = scrollDirectionChanged ? percentTop : oldState.anchorTop;
    }

    var inBounds = eventTypeId === __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["r" /* PAGE_SCROLL_DOWN */] ? percentTop >= anchorTop + scrollTopPadding : percentTop <= anchorTop - scrollTopPadding;

    var newState = _extends({}, oldState, {
      percentTop: percentTop,
      inBounds: inBounds,
      anchorTop: anchorTop,
      scrollingDown: scrollingDown
    });

    if (oldState && inBounds && (scrollDirectionChanged || newState.inBounds !== oldState.inBounds)) {
      return handler(options, newState) || newState;
    }

    return newState;
  };
};

var pointIntersects = function pointIntersects(point, rect) {
  return point.left > rect.left && point.left < rect.right && point.top > rect.top && point.top < rect.bottom;
};

var whenPageLoadFinish = function whenPageLoadFinish(handler) {
  return function (options, oldState) {
    var newState = {
      finished: document.readyState === 'complete'
    };
    if (newState.finished && !(oldState && oldState.finshed)) {
      handler(options);
    }
    return newState;
  };
};

var whenPageLoadStart = function whenPageLoadStart(handler) {
  return function (options, oldState) {
    var newState = {
      started: true
    };
    if (!oldState) {
      handler(options);
    }
    return newState;
  };
};

var whenClickCountChange = function whenClickCountChange(handler) {
  return function (options) {
    var oldState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { clickCount: 0 };

    var newState = {
      clickCount: oldState.clickCount % 2 + 1
    };
    if (newState.clickCount !== oldState.clickCount) {
      return handler(options, newState) || newState;
    }
    return newState;
  };
};

var getComponentActiveOptions = function getComponentActiveOptions() {
  var allowNestedChildrenEvents = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  return _extends({}, baseActivityActionGroupOptions, {
    handler: withFilter(allowNestedChildrenEvents ? isOrContainsElement : isElement, whenComponentActiveChange(function (options, state) {
      return state.isActive ? baseActionGroupOptions.handler(options, state) : state;
    }))
  });
};

var getComponentInactiveOptions = function getComponentInactiveOptions() {
  var allowNestedChildrenEvents = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  return _extends({}, baseActivityActionGroupOptions, {
    handler: withFilter(allowNestedChildrenEvents ? isOrContainsElement : isElement, whenComponentActiveChange(function (options, state) {
      return !state.isActive ? baseActionGroupOptions.handler(options, state) : state;
    }))
  });
};

var scrollIntoOutOfViewOptions = _extends({}, baseScrollActionGroupOptions, {
  handler: whenElementVisibiltyChange(function (options, state) {
    var elementVisible = state.elementVisible;
    var event = options.event,
        store = options.store;

    var _store$getState2 = store.getState(),
        ixData = _store$getState2.ixData;

    var events = ixData.events;

    // trigger the handler only once if only one of SCROLL_INTO or SCROLL_OUT_OF event types
    // are registered.

    if (!events[event.action.config.autoStopEventId] && state.triggered) {
      return state;
    }

    if (event.eventTypeId === __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["v" /* SCROLL_INTO_VIEW */] === elementVisible) {
      actionGroupCreator(options);
      return _extends({}, state, {
        triggered: true
      });
    } else {
      return state;
    }
  })
});

var MOUSE_OUT_ROUND_THRESHOLD = 0.05;

/* harmony default export */ __webpack_exports__["a"] = (_SLIDER_ACTIVE$SLIDER = {}, _defineProperty(_SLIDER_ACTIVE$SLIDER, __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["x" /* SLIDER_ACTIVE */], getComponentActiveOptions()), _defineProperty(_SLIDER_ACTIVE$SLIDER, __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["y" /* SLIDER_INACTIVE */], getComponentInactiveOptions()), _defineProperty(_SLIDER_ACTIVE$SLIDER, __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["d" /* DROPDOWN_OPEN */], getComponentActiveOptions()), _defineProperty(_SLIDER_ACTIVE$SLIDER, __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["c" /* DROPDOWN_CLOSE */], getComponentInactiveOptions()), _defineProperty(_SLIDER_ACTIVE$SLIDER, __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["n" /* NAVBAR_OPEN */], getComponentActiveOptions(false)), _defineProperty(_SLIDER_ACTIVE$SLIDER, __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["m" /* NAVBAR_CLOSE */], getComponentInactiveOptions(false)), _defineProperty(_SLIDER_ACTIVE$SLIDER, __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["z" /* TAB_ACTIVE */], getComponentActiveOptions()), _defineProperty(_SLIDER_ACTIVE$SLIDER, __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["A" /* TAB_INACTIVE */], getComponentInactiveOptions()), _defineProperty(_SLIDER_ACTIVE$SLIDER, __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["f" /* MOUSE_CLICK */], {
  types: 'click',
  handler: withFilter(isOrContainsElement, whenClickCountChange(function (options, _ref6) {
    var clickCount = _ref6.clickCount;

    if (hasAutoStopEvent(options)) {
      clickCount === 1 && actionGroupCreator(options);
    } else {
      actionGroupCreator(options);
    }
  }))
}), _defineProperty(_SLIDER_ACTIVE$SLIDER, __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["k" /* MOUSE_SECOND_CLICK */], {
  types: 'click',
  handler: withFilter(isOrContainsElement, whenClickCountChange(function (options, _ref7) {
    var clickCount = _ref7.clickCount;

    if (clickCount === 2) {
      actionGroupCreator(options);
    }
  }))
}), _defineProperty(_SLIDER_ACTIVE$SLIDER, __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["g" /* MOUSE_DOWN */], _extends({}, baseActionGroupOptions, {
  types: 'mousedown'
})), _defineProperty(_SLIDER_ACTIVE$SLIDER, __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["l" /* MOUSE_UP */], _extends({}, baseActionGroupOptions, {
  types: 'mouseup'
})), _defineProperty(_SLIDER_ACTIVE$SLIDER, __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["j" /* MOUSE_OVER */], {
  types: MOUSE_OVER_OUT_TYPES,
  handler: withFilter(isOrContainsElement, whenElementHoverChange(function (options, state) {
    if (state.elementHovered) {
      actionGroupCreator(options);
    }
  }))
}), _defineProperty(_SLIDER_ACTIVE$SLIDER, __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["i" /* MOUSE_OUT */], {
  types: MOUSE_OVER_OUT_TYPES,
  handler: withFilter(isOrContainsElement, whenElementHoverChange(function (options, state) {
    if (!state.elementHovered) {
      actionGroupCreator(options);
    }
  }))
}), _defineProperty(_SLIDER_ACTIVE$SLIDER, __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["h" /* MOUSE_MOVE */], {
  types: 'mousemove mouseout scroll',
  handler: function handler(_ref8) {
    var store = _ref8.store,
        element = _ref8.element,
        eventConfig = _ref8.eventConfig,
        nativeEvent = _ref8.nativeEvent,
        eventStateKey = _ref8.eventStateKey;
    var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { clientX: 0, clientY: 0, pageX: 0, pageY: 0 };
    var basedOn = eventConfig.basedOn,
        selectedAxis = eventConfig.selectedAxis,
        continuousParameterGroupId = eventConfig.continuousParameterGroupId,
        reverse = eventConfig.reverse,
        _eventConfig$restingS = eventConfig.restingState,
        restingState = _eventConfig$restingS === undefined ? 0 : _eventConfig$restingS;
    var _nativeEvent$clientX = nativeEvent.clientX,
        clientX = _nativeEvent$clientX === undefined ? state.clientX : _nativeEvent$clientX,
        _nativeEvent$clientY = nativeEvent.clientY,
        clientY = _nativeEvent$clientY === undefined ? state.clientY : _nativeEvent$clientY,
        _nativeEvent$pageX = nativeEvent.pageX,
        pageX = _nativeEvent$pageX === undefined ? state.pageX : _nativeEvent$pageX,
        _nativeEvent$pageY = nativeEvent.pageY,
        pageY = _nativeEvent$pageY === undefined ? state.pageY : _nativeEvent$pageY;

    var isXAxis = selectedAxis === 'X_AXIS';
    var isMouseOut = nativeEvent.type === 'mouseout';

    var value = restingState / 100;
    var namespacedParameterId = continuousParameterGroupId;
    var elementHovered = false;

    switch (basedOn) {
      case __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["B" /* VIEWPORT */]:
        {
          value = isXAxis ? Math.min(clientX, window.innerWidth) / window.innerWidth : Math.min(clientY, window.innerHeight) / window.innerHeight;
          break;
        }
      case __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["o" /* PAGE */]:
        {
          var _getDocumentState3 = getDocumentState(),
              scrollLeft = _getDocumentState3.scrollLeft,
              scrollTop = _getDocumentState3.scrollTop,
              scrollWidth = _getDocumentState3.scrollWidth,
              scrollHeight = _getDocumentState3.scrollHeight;

          value = isXAxis ? Math.min(scrollLeft + pageX, scrollWidth) / scrollWidth : Math.min(scrollTop + pageY, scrollHeight) / scrollHeight;
          break;
        }
      case __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["e" /* ELEMENT */]:
      default:
        {
          namespacedParameterId = Object(__WEBPACK_IMPORTED_MODULE_4__IX2VanillaUtils__["i" /* getNamespacedParameterId */])(eventStateKey, continuousParameterGroupId);

          var isMouseEvent = nativeEvent.type.indexOf('mouse') === 0;

          // Use isOrContainsElement for mouse events since they are fired from the target
          if (isMouseEvent && isOrContainsElement({ element: element, nativeEvent: nativeEvent }) !== true) {
            break;
          }

          var rect = element.getBoundingClientRect();
          var left = rect.left,
              top = rect.top,
              width = rect.width,
              height = rect.height;

          // Otherwise we'll need to calculate the mouse position from the previous handler state
          // against the target element's rect

          if (!isMouseEvent && !pointIntersects({ left: clientX, top: clientY }, rect)) {
            break;
          }

          elementHovered = true;

          value = isXAxis ? (clientX - left) / width : (clientY - top) / height;
          break;
        }
    }

    // cover case where the event is a mouse out, but the value is not quite at 100%
    if (isMouseOut && (value > 1 - MOUSE_OUT_ROUND_THRESHOLD || value < MOUSE_OUT_ROUND_THRESHOLD)) {
      value = Math.round(value);
    }

    // Only update based on element if the mouse is moving over or has just left the element
    if (basedOn !== __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["e" /* ELEMENT */] || elementHovered || elementHovered !== state.elementHovered) {
      value = reverse ? 1 - value : value;
      store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_5__actions_IX2EngineActions__["parameterChanged"])(namespacedParameterId, value));
    }

    return {
      elementHovered: elementHovered,
      clientX: clientX,
      clientY: clientY,
      pageX: pageX,
      pageY: pageY
    };
  }
}), _defineProperty(_SLIDER_ACTIVE$SLIDER, __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["q" /* PAGE_SCROLL */], {
  types: CONTINUOUS_SCROLL_EVENT_TYPES,
  handler: function handler(_ref9) {
    var store = _ref9.store,
        eventConfig = _ref9.eventConfig;
    var continuousParameterGroupId = eventConfig.continuousParameterGroupId,
        reverse = eventConfig.reverse;

    var _getDocumentState4 = getDocumentState(),
        scrollTop = _getDocumentState4.scrollTop,
        scrollHeight = _getDocumentState4.scrollHeight,
        clientHeight = _getDocumentState4.clientHeight;

    var value = scrollTop / (scrollHeight - clientHeight);
    value = reverse ? 1 - value : value;
    store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_5__actions_IX2EngineActions__["parameterChanged"])(continuousParameterGroupId, value));
  }
}), _defineProperty(_SLIDER_ACTIVE$SLIDER, __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["u" /* SCROLLING_IN_VIEW */], {
  types: CONTINUOUS_SCROLL_EVENT_TYPES,
  handler: function handler(_ref10) {
    var element = _ref10.element,
        store = _ref10.store,
        eventConfig = _ref10.eventConfig,
        eventStateKey = _ref10.eventStateKey;
    var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { scrollPercent: 0 };

    var _getDocumentState5 = getDocumentState(),
        scrollLeft = _getDocumentState5.scrollLeft,
        scrollTop = _getDocumentState5.scrollTop,
        scrollWidth = _getDocumentState5.scrollWidth,
        scrollHeight = _getDocumentState5.scrollHeight,
        visibleWidth = _getDocumentState5.clientWidth,
        visibleHeight = _getDocumentState5.clientHeight;

    var viewportWidth = scrollWidth - visibleWidth;
    var viewportHeight = scrollHeight - visibleHeight;

    var basedOn = eventConfig.basedOn,
        selectedAxis = eventConfig.selectedAxis,
        continuousParameterGroupId = eventConfig.continuousParameterGroupId,
        startsEntering = eventConfig.startsEntering,
        startsExiting = eventConfig.startsExiting,
        addEndOffset = eventConfig.addEndOffset,
        addStartOffset = eventConfig.addStartOffset,
        _eventConfig$addOffse = eventConfig.addOffsetValue,
        addOffsetValue = _eventConfig$addOffse === undefined ? 0 : _eventConfig$addOffse,
        _eventConfig$endOffse = eventConfig.endOffsetValue,
        endOffsetValue = _eventConfig$endOffse === undefined ? 0 : _eventConfig$endOffse;


    var isXAxis = selectedAxis === 'X_AXIS';

    if (basedOn === __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["B" /* VIEWPORT */]) {
      var value = isXAxis ? scrollLeft / viewportWidth : scrollTop / viewportHeight;
      if (value !== state.scrollPercent) {
        store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_5__actions_IX2EngineActions__["parameterChanged"])(continuousParameterGroupId, value));
      }
      return {
        scrollPercent: value
      };
    } else {
      var namespacedParameterId = Object(__WEBPACK_IMPORTED_MODULE_4__IX2VanillaUtils__["i" /* getNamespacedParameterId */])(eventStateKey, continuousParameterGroupId);
      var elementRect = element.getBoundingClientRect();
      var offsetStartPerc = (addStartOffset ? addOffsetValue : 0) / 100;
      var offsetEndPerc = (addEndOffset ? endOffsetValue : 0) / 100;

      // flip the offset percentages depending on start / exit type
      offsetStartPerc = startsEntering ? offsetStartPerc : 1 - offsetStartPerc;
      offsetEndPerc = startsExiting ? offsetEndPerc : 1 - offsetEndPerc;

      var offsetElementTop = elementRect.top + Math.min(elementRect.height * offsetStartPerc, visibleHeight);
      var offsetElementBottom = elementRect.top + elementRect.height * offsetEndPerc;
      var offsetHeight = offsetElementBottom - offsetElementTop;

      var fixedScrollHeight = Math.min(visibleHeight + offsetHeight, viewportHeight);

      var fixedScrollTop = Math.min(Math.max(0, visibleHeight - offsetElementTop), fixedScrollHeight);
      var fixedScrollPerc = fixedScrollTop / fixedScrollHeight;

      if (fixedScrollPerc !== state.scrollPercent) {
        store.dispatch(Object(__WEBPACK_IMPORTED_MODULE_5__actions_IX2EngineActions__["parameterChanged"])(namespacedParameterId, fixedScrollPerc));
      }
      return {
        scrollPercent: fixedScrollPerc
      };
    }
  }
}), _defineProperty(_SLIDER_ACTIVE$SLIDER, __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["v" /* SCROLL_INTO_VIEW */], scrollIntoOutOfViewOptions), _defineProperty(_SLIDER_ACTIVE$SLIDER, __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["w" /* SCROLL_OUT_OF_VIEW */], scrollIntoOutOfViewOptions), _defineProperty(_SLIDER_ACTIVE$SLIDER, __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["r" /* PAGE_SCROLL_DOWN */], _extends({}, baseScrollActionGroupOptions, {
  handler: whenScrollDirectionChange(function (options, state) {
    if (state.scrollingDown) {
      actionGroupCreator(options);
    }
  })
})), _defineProperty(_SLIDER_ACTIVE$SLIDER, __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["s" /* PAGE_SCROLL_UP */], _extends({}, baseScrollActionGroupOptions, {
  handler: whenScrollDirectionChange(function (options, state) {
    if (!state.scrollingDown) {
      actionGroupCreator(options);
    }
  })
})), _defineProperty(_SLIDER_ACTIVE$SLIDER, __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["p" /* PAGE_FINISH */], {
  types: 'readystatechange IX2_PREVIEW_LOAD',
  handler: withFilter(isElement, whenPageLoadFinish(actionGroupCreator))
}), _defineProperty(_SLIDER_ACTIVE$SLIDER, __WEBPACK_IMPORTED_MODULE_6__constants_IX2EngineEventTypes__["t" /* PAGE_START */], {
  types: 'readystatechange IX2_PREVIEW_LOAD',
  handler: withFilter(isElement, whenPageLoadStart(actionGroupCreator))
}), _SLIDER_ACTIVE$SLIDER);

/***/ }),
/* 223 */
/***/ (function(module, exports, __webpack_require__) {

var createFlow = __webpack_require__(224);

/**
 * Creates a function that returns the result of invoking the given functions
 * with the `this` binding of the created function, where each successive
 * invocation is supplied the return value of the previous.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Util
 * @param {...(Function|Function[])} [funcs] The functions to invoke.
 * @returns {Function} Returns the new composite function.
 * @see _.flowRight
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * var addSquare = _.flow([_.add, square]);
 * addSquare(1, 2);
 * // => 9
 */
var flow = createFlow();

module.exports = flow;


/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

var LodashWrapper = __webpack_require__(45),
    flatRest = __webpack_require__(225),
    getData = __webpack_require__(83),
    getFuncName = __webpack_require__(84),
    isArray = __webpack_require__(0),
    isLaziable = __webpack_require__(238);

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to compose bitmasks for function metadata. */
var WRAP_CURRY_FLAG = 8,
    WRAP_PARTIAL_FLAG = 32,
    WRAP_ARY_FLAG = 128,
    WRAP_REARG_FLAG = 256;

/**
 * Creates a `_.flow` or `_.flowRight` function.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new flow function.
 */
function createFlow(fromRight) {
  return flatRest(function(funcs) {
    var length = funcs.length,
        index = length,
        prereq = LodashWrapper.prototype.thru;

    if (fromRight) {
      funcs.reverse();
    }
    while (index--) {
      var func = funcs[index];
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      if (prereq && !wrapper && getFuncName(func) == 'wrapper') {
        var wrapper = new LodashWrapper([], true);
      }
    }
    index = wrapper ? index : length;
    while (++index < length) {
      func = funcs[index];

      var funcName = getFuncName(func),
          data = funcName == 'wrapper' ? getData(func) : undefined;

      if (data && isLaziable(data[0]) &&
            data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) &&
            !data[4].length && data[9] == 1
          ) {
        wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
      } else {
        wrapper = (func.length == 1 && isLaziable(func))
          ? wrapper[funcName]()
          : wrapper.thru(func);
      }
    }
    return function() {
      var args = arguments,
          value = args[0];

      if (wrapper && args.length == 1 &&
          isArray(value) && value.length >= LARGE_ARRAY_SIZE) {
        return wrapper.plant(value).value();
      }
      var index = 0,
          result = length ? funcs[index].apply(this, args) : value;

      while (++index < length) {
        result = funcs[index].call(this, result);
      }
      return result;
    };
  });
}

module.exports = createFlow;


/***/ }),
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

var flatten = __webpack_require__(226),
    overRest = __webpack_require__(229),
    setToString = __webpack_require__(231);

/**
 * A specialized version of `baseRest` which flattens the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @returns {Function} Returns the new function.
 */
function flatRest(func) {
  return setToString(overRest(func, undefined, flatten), func + '');
}

module.exports = flatRest;


/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

var baseFlatten = __webpack_require__(227);

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}

module.exports = flatten;


/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(40),
    isFlattenable = __webpack_require__(228);

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

module.exports = baseFlatten;


/***/ }),
/* 228 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(10),
    isArguments = __webpack_require__(18),
    isArray = __webpack_require__(0);

/** Built-in value references. */
var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

module.exports = isFlattenable;


/***/ }),
/* 229 */
/***/ (function(module, exports, __webpack_require__) {

var apply = __webpack_require__(230);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

module.exports = overRest;


/***/ }),
/* 230 */
/***/ (function(module, exports) {

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;


/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

var baseSetToString = __webpack_require__(232),
    shortOut = __webpack_require__(234);

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

module.exports = setToString;


/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

var constant = __webpack_require__(233),
    defineProperty = __webpack_require__(76),
    identity = __webpack_require__(38);

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

module.exports = baseSetToString;


/***/ }),
/* 233 */
/***/ (function(module, exports) {

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;


/***/ }),
/* 234 */
/***/ (function(module, exports) {

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

module.exports = shortOut;


/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

var WeakMap = __webpack_require__(67);

/** Used to store function metadata. */
var metaMap = WeakMap && new WeakMap;

module.exports = metaMap;


/***/ }),
/* 236 */
/***/ (function(module, exports) {

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

module.exports = noop;


/***/ }),
/* 237 */
/***/ (function(module, exports) {

/** Used to lookup unminified function names. */
var realNames = {};

module.exports = realNames;


/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

var LazyWrapper = __webpack_require__(47),
    getData = __webpack_require__(83),
    getFuncName = __webpack_require__(84),
    lodash = __webpack_require__(239);

/**
 * Checks if `func` has a lazy counterpart.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` has a lazy counterpart,
 *  else `false`.
 */
function isLaziable(func) {
  var funcName = getFuncName(func),
      other = lodash[funcName];

  if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
    return false;
  }
  if (func === other) {
    return true;
  }
  var data = getData(other);
  return !!data && func === data[0];
}

module.exports = isLaziable;


/***/ }),
/* 239 */
/***/ (function(module, exports, __webpack_require__) {

var LazyWrapper = __webpack_require__(47),
    LodashWrapper = __webpack_require__(45),
    baseLodash = __webpack_require__(46),
    isArray = __webpack_require__(0),
    isObjectLike = __webpack_require__(5),
    wrapperClone = __webpack_require__(240);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates a `lodash` object which wraps `value` to enable implicit method
 * chain sequences. Methods that operate on and return arrays, collections,
 * and functions can be chained together. Methods that retrieve a single value
 * or may return a primitive value will automatically end the chain sequence
 * and return the unwrapped value. Otherwise, the value must be unwrapped
 * with `_#value`.
 *
 * Explicit chain sequences, which must be unwrapped with `_#value`, may be
 * enabled using `_.chain`.
 *
 * The execution of chained methods is lazy, that is, it's deferred until
 * `_#value` is implicitly or explicitly called.
 *
 * Lazy evaluation allows several methods to support shortcut fusion.
 * Shortcut fusion is an optimization to merge iteratee calls; this avoids
 * the creation of intermediate arrays and can greatly reduce the number of
 * iteratee executions. Sections of a chain sequence qualify for shortcut
 * fusion if the section is applied to an array of at least `200` elements
 * and any iteratees accept only one argument. The heuristic for whether a
 * section qualifies for shortcut fusion is subject to change.
 *
 * Chaining is supported in custom builds as long as the `_#value` method is
 * directly or indirectly included in the build.
 *
 * In addition to lodash methods, wrappers have `Array` and `String` methods.
 *
 * The wrapper `Array` methods are:
 * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
 *
 * The wrapper `String` methods are:
 * `replace` and `split`
 *
 * The wrapper methods that support shortcut fusion are:
 * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
 * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
 * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
 *
 * The chainable wrapper methods are:
 * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
 * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
 * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
 * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
 * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
 * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
 * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
 * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
 * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
 * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
 * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
 * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
 * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
 * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
 * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
 * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
 * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
 * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
 * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
 * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
 * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
 * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
 * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
 * `zipObject`, `zipObjectDeep`, and `zipWith`
 *
 * The wrapper methods that are **not** chainable by default are:
 * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
 * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
 * `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
 * `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
 * `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
 * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
 * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
 * `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
 * `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
 * `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
 * `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
 * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
 * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
 * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
 * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
 * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
 * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
 * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
 * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
 * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
 * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
 * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
 * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
 * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
 * `upperFirst`, `value`, and `words`
 *
 * @name _
 * @constructor
 * @category Seq
 * @param {*} value The value to wrap in a `lodash` instance.
 * @returns {Object} Returns the new `lodash` wrapper instance.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * var wrapped = _([1, 2, 3]);
 *
 * // Returns an unwrapped value.
 * wrapped.reduce(_.add);
 * // => 6
 *
 * // Returns a wrapped value.
 * var squares = wrapped.map(square);
 *
 * _.isArray(squares);
 * // => false
 *
 * _.isArray(squares.value());
 * // => true
 */
function lodash(value) {
  if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
    if (value instanceof LodashWrapper) {
      return value;
    }
    if (hasOwnProperty.call(value, '__wrapped__')) {
      return wrapperClone(value);
    }
  }
  return new LodashWrapper(value);
}

// Ensure wrappers are instances of `baseLodash`.
lodash.prototype = baseLodash.prototype;
lodash.prototype.constructor = lodash;

module.exports = lodash;


/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

var LazyWrapper = __webpack_require__(47),
    LodashWrapper = __webpack_require__(45),
    copyArray = __webpack_require__(241);

/**
 * Creates a clone of `wrapper`.
 *
 * @private
 * @param {Object} wrapper The wrapper to clone.
 * @returns {Object} Returns the cloned wrapper.
 */
function wrapperClone(wrapper) {
  if (wrapper instanceof LazyWrapper) {
    return wrapper.clone();
  }
  var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
  result.__actions__ = copyArray(wrapper.__actions__);
  result.__index__  = wrapper.__index__;
  result.__values__ = wrapper.__values__;
  return result;
}

module.exports = wrapperClone;


/***/ }),
/* 241 */
/***/ (function(module, exports) {

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;


/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

var baseClamp = __webpack_require__(80),
    toNumber = __webpack_require__(39);

/**
 * Clamps `number` within the inclusive `lower` and `upper` bounds.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Number
 * @param {number} number The number to clamp.
 * @param {number} [lower] The lower bound.
 * @param {number} upper The upper bound.
 * @returns {number} Returns the clamped number.
 * @example
 *
 * _.clamp(-10, -5, 5);
 * // => -5
 *
 * _.clamp(10, -5, 5);
 * // => 5
 */
function clamp(number, lower, upper) {
  if (upper === undefined) {
    upper = lower;
    lower = undefined;
  }
  if (upper !== undefined) {
    upper = toNumber(upper);
    upper = upper === upper ? upper : 0;
  }
  if (lower !== undefined) {
    lower = toNumber(lower);
    lower = lower === lower ? lower : 0;
  }
  return baseClamp(toNumber(number), lower, upper);
}

module.exports = clamp;


/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

/*eslint no-shadow: 0*/

/**
 * Webflow: Lightbox component
 */

var Webflow = __webpack_require__(1);

function createLightbox(window, document, $, container) {
  var tram = $.tram;
  var isArray = Array.isArray;
  var namespace = 'w-lightbox';
  var prefix = namespace + '-';
  var prefixRegex = /(^|\s+)/g;

  // Array of objects describing items to be displayed.
  var items = [];

  // Index of the currently displayed item.
  var currentIndex;

  // Object holding references to jQuery wrapped nodes.
  var $refs;

  // Instance of Spinner
  var spinner;

  function lightbox(thing, index) {
    items = isArray(thing) ? thing : [thing];

    if (!$refs) {
      lightbox.build();
    }

    if (items.length > 1) {
      $refs.items = $refs.empty;

      items.forEach(function (item) {
        var $thumbnail = dom('thumbnail');
        var $item = dom('item').append($thumbnail);

        $refs.items = $refs.items.add($item);

        loadImage(item.thumbnailUrl || item.url, function ($image) {
          if ($image.prop('width') > $image.prop('height')) {
            addClass($image, 'wide');
          } else {
            addClass($image, 'tall');
          }
          $thumbnail.append(addClass($image, 'thumbnail-image'));
        });
      });

      $refs.strip.empty().append($refs.items);
      addClass($refs.content, 'group');
    }

    tram(
    // Focus the lightbox to receive keyboard events.
    removeClass($refs.lightbox, 'hide').trigger('focus')).add('opacity .3s').start({ opacity: 1 });

    // Prevent document from scrolling while lightbox is active.
    addClass($refs.html, 'noscroll');

    return lightbox.show(index || 0);
  }

  /**
   * Creates the DOM structure required by the lightbox.
   */
  lightbox.build = function () {
    // In case `build` is called more than once.
    lightbox.destroy();

    $refs = {
      html: $(document.documentElement),
      // Empty jQuery object can be used to build new ones using `.add`.
      empty: $()
    };

    $refs.arrowLeft = dom('control left inactive');
    $refs.arrowRight = dom('control right inactive');
    $refs.close = dom('control close');

    $refs.spinner = dom('spinner');
    $refs.strip = dom('strip');

    spinner = new Spinner($refs.spinner, prefixed('hide'));

    $refs.content = dom('content').append($refs.spinner, $refs.arrowLeft, $refs.arrowRight, $refs.close);

    $refs.container = dom('container').append($refs.content, $refs.strip);

    $refs.lightbox = dom('backdrop hide').append($refs.container);

    // We are delegating events for performance reasons and also
    // to not have to reattach handlers when images change.
    $refs.strip.on('tap', selector('item'), itemTapHandler);
    $refs.content.on('swipe', swipeHandler).on('tap', selector('left'), handlerPrev).on('tap', selector('right'), handlerNext).on('tap', selector('close'), handlerHide).on('tap', selector('image, caption'), handlerNext);
    $refs.container.on('tap', selector('view'), handlerHide)
    // Prevent images from being dragged around.
    .on('dragstart', selector('img'), preventDefault);
    $refs.lightbox.on('keydown', keyHandler)
    // IE loses focus to inner nodes without letting us know.
    .on('focusin', focusThis);

    // The `tabindex` attribute is needed to enable non-input elements
    // to receive keyboard events.
    $(container).append($refs.lightbox.prop('tabIndex', 0));

    return lightbox;
  };

  /**
   * Dispose of DOM nodes created by the lightbox.
   */
  lightbox.destroy = function () {
    if (!$refs) {
      return;
    }

    // Event handlers are also removed.
    removeClass($refs.html, 'noscroll');
    $refs.lightbox.remove();
    $refs = undefined;
  };

  /**
   * Show a specific item.
   */
  lightbox.show = function (index) {
    // Bail if we are already showing this item.
    if (index === currentIndex) {
      return;
    }

    var item = items[index];
    if (!item) {
      return lightbox.hide();
    }

    var previousIndex = currentIndex;
    currentIndex = index;
    spinner.show();

    // For videos, load an empty SVG with the video dimensions to preserve
    // the videoâ€™s aspect ratio while being responsive.
    var url = item.html && svgDataUri(item.width, item.height) || item.url;
    loadImage(url, function ($image) {
      // Make sure this is the last item requested to be shown since
      // images can finish loading in a different order than they were
      // requested in.
      if (index !== currentIndex) {
        return;
      }

      var $figure = dom('figure', 'figure').append(addClass($image, 'image'));
      var $frame = dom('frame').append($figure);
      var $newView = dom('view').append($frame);
      var $html;
      var isIframe;

      if (item.html) {
        $html = $(item.html);
        isIframe = $html.is('iframe');

        if (isIframe) {
          $html.on('load', transitionToNewView);
        }

        $figure.append(addClass($html, 'embed'));
      }

      if (item.caption) {
        $figure.append(dom('caption', 'figcaption').text(item.caption));
      }

      $refs.spinner.before($newView);

      if (!isIframe) {
        transitionToNewView();
      }

      function transitionToNewView() {
        spinner.hide();

        if (index !== currentIndex) {
          $newView.remove();
          return;
        }

        toggleClass($refs.arrowLeft, 'inactive', index <= 0);
        toggleClass($refs.arrowRight, 'inactive', index >= items.length - 1);

        if ($refs.view) {
          tram($refs.view).add('opacity .3s').start({ opacity: 0 }).then(remover($refs.view));

          tram($newView).add('opacity .3s').add('transform .3s').set({ x: index > previousIndex ? '80px' : '-80px' }).start({ opacity: 1, x: 0 });
        } else {
          $newView.css('opacity', 1);
        }

        $refs.view = $newView;

        if ($refs.items) {
          removeClass($refs.items, 'active');
          // Mark proper thumbnail as active
          var $activeThumb = $refs.items.eq(index);
          addClass($activeThumb, 'active');
          // Scroll into view
          maybeScroll($activeThumb);
        }
      }
    });

    return lightbox;
  };

  /**
   * Hides the lightbox.
   */
  lightbox.hide = function () {
    tram($refs.lightbox).add('opacity .3s').start({ opacity: 0 }).then(hideLightbox);

    return lightbox;
  };

  lightbox.prev = function () {
    if (currentIndex > 0) {
      lightbox.show(currentIndex - 1);
    }
  };

  lightbox.next = function () {
    if (currentIndex < items.length - 1) {
      lightbox.show(currentIndex + 1);
    }
  };

  function createHandler(action) {
    return function (event) {
      // We only care about events triggered directly on the bound selectors.
      if (this !== event.target) {
        return;
      }

      event.stopPropagation();
      event.preventDefault();

      action();
    };
  }

  var handlerPrev = createHandler(lightbox.prev);
  var handlerNext = createHandler(lightbox.next);
  var handlerHide = createHandler(lightbox.hide);

  var itemTapHandler = function itemTapHandler(event) {
    var index = $(this).index();

    event.preventDefault();
    lightbox.show(index);
  };

  var swipeHandler = function swipeHandler(event, data) {
    // Prevent scrolling.
    event.preventDefault();

    if (data.direction === 'left') {
      lightbox.next();
    } else if (data.direction === 'right') {
      lightbox.prev();
    }
  };

  var focusThis = function focusThis() {
    this.focus();
  };

  function preventDefault(event) {
    event.preventDefault();
  }

  function keyHandler(event) {
    var keyCode = event.keyCode;

    // [esc]
    if (keyCode === 27) {
      lightbox.hide();

      // [â—€]
    } else if (keyCode === 37) {
      lightbox.prev();

      // [â–¶]
    } else if (keyCode === 39) {
      lightbox.next();
    }
  }

  function hideLightbox() {
    // If the lightbox hasn't been destroyed already
    if ($refs) {
      // Reset strip scroll, otherwise next lightbox opens scrolled to last position
      $refs.strip.scrollLeft(0).empty();
      removeClass($refs.html, 'noscroll');
      addClass($refs.lightbox, 'hide');
      $refs.view && $refs.view.remove();

      // Reset some stuff
      removeClass($refs.content, 'group');
      addClass($refs.arrowLeft, 'inactive');
      addClass($refs.arrowRight, 'inactive');

      currentIndex = $refs.view = undefined;
    }
  }

  function loadImage(url, callback) {
    var $image = dom('img', 'img');

    $image.one('load', function () {
      callback($image);
    });

    // Start loading image.
    $image.attr('src', url);

    return $image;
  }

  function remover($element) {
    return function () {
      $element.remove();
    };
  }

  function maybeScroll($item) {
    var itemLeft = $item.position().left;
    var stripScrollLeft = $refs.strip.scrollLeft();
    var stripWidth = $refs.strip.width();
    if (itemLeft < stripScrollLeft || itemLeft > stripWidth + stripScrollLeft) {
      tram($refs.strip).add('scroll-left 500ms').start({ 'scroll-left': itemLeft });
    }
  }

  /**
   * Spinner
   */
  function Spinner($spinner, className, delay) {
    this.$element = $spinner;
    this.className = className;
    this.delay = delay || 200;
    this.hide();
  }

  Spinner.prototype.show = function () {
    var spinner = this;

    // Bail if we are already showing the spinner.
    if (spinner.timeoutId) {
      return;
    }

    spinner.timeoutId = setTimeout(function () {
      spinner.$element.removeClass(spinner.className);
      delete spinner.timeoutId;
    }, spinner.delay);
  };

  Spinner.prototype.hide = function () {
    var spinner = this;
    if (spinner.timeoutId) {
      clearTimeout(spinner.timeoutId);
      delete spinner.timeoutId;
      return;
    }

    spinner.$element.addClass(spinner.className);
  };

  function prefixed(string, isSelector) {
    return string.replace(prefixRegex, (isSelector ? ' .' : ' ') + prefix);
  }

  function selector(string) {
    return prefixed(string, true);
  }

  /**
   * jQuery.addClass with auto-prefixing
   * @param  {jQuery} Element to add class to
   * @param  {string} Class name that will be prefixed and added to element
   * @return {jQuery}
   */
  function addClass($element, className) {
    return $element.addClass(prefixed(className));
  }

  /**
   * jQuery.removeClass with auto-prefixing
   * @param  {jQuery} Element to remove class from
   * @param  {string} Class name that will be prefixed and removed from element
   * @return {jQuery}
   */
  function removeClass($element, className) {
    return $element.removeClass(prefixed(className));
  }

  /**
   * jQuery.toggleClass with auto-prefixing
   * @param  {jQuery}  Element where class will be toggled
   * @param  {string}  Class name that will be prefixed and toggled
   * @param  {boolean} Optional boolean that determines if class will be added or removed
   * @return {jQuery}
   */
  function toggleClass($element, className, shouldAdd) {
    return $element.toggleClass(prefixed(className), shouldAdd);
  }

  /**
   * Create a new DOM element wrapped in a jQuery object,
   * decorated with our custom methods.
   * @param  {string} className
   * @param  {string} [tag]
   * @return {jQuery}
   */
  function dom(className, tag) {
    return addClass($(document.createElement(tag || 'div')), className);
  }

  function svgDataUri(width, height) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '"/>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURI(svg);
  }

  // Compute some dimensions manually for iOS < 8, because of buggy support for VH.
  // Also, Android built-in browser does not support viewport units.
  (function () {
    var ua = window.navigator.userAgent;
    var iOSRegex = /(iPhone|iPad|iPod);[^OS]*OS (\d)/;
    var iOSMatches = ua.match(iOSRegex);
    var android = ua.indexOf('Android ') > -1 && ua.indexOf('Chrome') === -1;

    if (!android && (!iOSMatches || iOSMatches[2] > 7)) {
      return;
    }

    var styleNode = document.createElement('style');
    document.head.appendChild(styleNode);
    window.addEventListener('orientationchange', refresh, true);

    function refresh() {
      var vh = window.innerHeight;
      var vw = window.innerWidth;
      var content = '.w-lightbox-content, .w-lightbox-view, .w-lightbox-view:before {' + 'height:' + vh + 'px' + '}' + '.w-lightbox-view {' + 'width:' + vw + 'px' + '}' + '.w-lightbox-group, .w-lightbox-group .w-lightbox-view, .w-lightbox-group .w-lightbox-view:before {' + 'height:' + 0.86 * vh + 'px' + '}' + '.w-lightbox-image {' + 'max-width:' + vw + 'px;' + 'max-height:' + vh + 'px' + '}' + '.w-lightbox-group .w-lightbox-image {' + 'max-height:' + 0.86 * vh + 'px' + '}' + '.w-lightbox-strip {' + 'padding: 0 ' + 0.01 * vh + 'px' + '}' + '.w-lightbox-item {' + 'width:' + 0.1 * vh + 'px;' + 'padding:' + 0.02 * vh + 'px ' + 0.01 * vh + 'px' + '}' + '.w-lightbox-thumbnail {' + 'height:' + 0.1 * vh + 'px' + '}' + '@media (min-width: 768px) {' + '.w-lightbox-content, .w-lightbox-view, .w-lightbox-view:before {' + 'height:' + 0.96 * vh + 'px' + '}' + '.w-lightbox-content {' + 'margin-top:' + 0.02 * vh + 'px' + '}' + '.w-lightbox-group, .w-lightbox-group .w-lightbox-view, .w-lightbox-group .w-lightbox-view:before {' + 'height:' + 0.84 * vh + 'px' + '}' + '.w-lightbox-image {' + 'max-width:' + 0.96 * vw + 'px;' + 'max-height:' + 0.96 * vh + 'px' + '}' + '.w-lightbox-group .w-lightbox-image {' + 'max-width:' + 0.823 * vw + 'px;' + 'max-height:' + 0.84 * vh + 'px' + '}' + '}';

      styleNode.textContent = content;
    }

    refresh();
  })();

  return lightbox;
}

Webflow.define('lightbox', module.exports = function ($) {
  var api = {};
  var inApp = Webflow.env();
  var lightbox = createLightbox(window, document, $, inApp ? '#lightbox-mountpoint' : 'body');
  var $doc = $(document);
  var $lightboxes;
  var designer;
  var namespace = '.w-lightbox';
  var groups;

  // -----------------------------------
  // Module methods

  api.ready = api.design = api.preview = init;

  // -----------------------------------
  // Private methods

  function init() {
    designer = inApp && Webflow.env('design');

    // Reset Lightbox
    lightbox.destroy();

    // Reset groups
    groups = {};

    // Find all instances on the page
    $lightboxes = $doc.find(namespace);

    // Instantiate all lighboxes
    $lightboxes.webflowLightBox();
  }

  jQuery.fn.extend({
    webflowLightBox: function webflowLightBox() {
      var $el = this;
      $.each($el, function (i, el) {
        // Store state in data
        var data = $.data(el, namespace);
        if (!data) {
          data = $.data(el, namespace, {
            el: $(el),
            mode: 'images',
            images: [],
            embed: ''
          });
        }

        // Remove old events
        data.el.off(namespace);

        // Set config from json script tag
        configure(data);

        // Add events based on mode
        if (designer) {
          data.el.on('setting' + namespace, configure.bind(null, data));
        } else {
          data.el.on('tap' + namespace, tapHandler(data))
          // Prevent page scrolling to top when clicking on lightbox triggers.
          .on('click' + namespace, function (e) {
            e.preventDefault();
          });
        }
      });
    }
  });

  function configure(data) {
    var json = data.el.children('.w-json').html();
    var groupName;
    var groupItems;

    if (!json) {
      data.items = [];
      return;
    }

    try {
      json = JSON.parse(json);
    } catch (e) {
      console.error('Malformed lightbox JSON configuration.', e);
    }

    supportOldLightboxJson(json);

    groupName = json.group;

    if (groupName) {
      groupItems = groups[groupName];
      if (!groupItems) {
        groupItems = groups[groupName] = [];
      }

      data.items = groupItems;

      if (json.items.length) {
        data.index = groupItems.length;
        groupItems.push.apply(groupItems, json.items);
      }
    } else {
      data.items = json.items;
    }
  }

  function tapHandler(data) {
    return function () {
      data.items.length && lightbox(data.items, data.index || 0);
    };
  }

  function supportOldLightboxJson(data) {
    if (data.images) {
      data.images.forEach(function (item) {
        item.type = 'image';
      });
      data.items = data.images;
    }

    if (data.embed) {
      data.embed.type = 'video';
      data.items = [data.embed];
    }

    if (data.groupId) {
      data.group = data.groupId;
    }
  }

  // Export module
  return api;
});

/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Webflow: Auto-select links to current page or section
 */

var Webflow = __webpack_require__(1);

Webflow.define('links', module.exports = function ($, _) {
  var api = {};
  var $win = $(window);
  var designer;
  var inApp = Webflow.env();
  var location = window.location;
  var tempLink = document.createElement('a');
  var linkCurrent = 'w--current';
  var validHash = /^#[\w:.-]+$/;
  var indexPage = /index\.(html|php)$/;
  var dirList = /\/$/;
  var anchors;
  var slug;

  // -----------------------------------
  // Module methods

  api.ready = api.design = api.preview = init;

  // -----------------------------------
  // Private methods

  function init() {
    designer = inApp && Webflow.env('design');
    slug = Webflow.env('slug') || location.pathname || '';

    // Reset scroll listener, init anchors
    Webflow.scroll.off(scroll);
    anchors = [];

    // Test all links for a selectable href
    var links = document.links;
    for (var i = 0; i < links.length; ++i) {
      select(links[i]);
    }

    // Listen for scroll if any anchors exist
    if (anchors.length) {
      Webflow.scroll.on(scroll);
      scroll();
    }
  }

  function select(link) {
    var href = designer && link.getAttribute('href-disabled') || link.getAttribute('href');
    tempLink.href = href;

    // Ignore any hrefs with a colon to safely avoid all uri schemes
    if (href.indexOf(':') >= 0) {
      return;
    }

    var $link = $(link);

    // Check for valid hash links w/ sections and use scroll anchor
    if (href.indexOf('#') === 0 && validHash.test(href)) {
      var $section = $(href);
      $section.length && anchors.push({ link: $link, sec: $section, active: false });
      return;
    }

    // Ignore empty # links
    if (href === '#' || href === '') {
      return;
    }

    // Determine whether the link should be selected
    var match = tempLink.href === location.href || href === slug || indexPage.test(href) && dirList.test(slug);
    setClass($link, linkCurrent, match);
  }

  function scroll() {
    var viewTop = $win.scrollTop();
    var viewHeight = $win.height();

    // Check each anchor for a section in view
    _.each(anchors, function (anchor) {
      var $link = anchor.link;
      var $section = anchor.sec;
      var top = $section.offset().top;
      var height = $section.outerHeight();
      var offset = viewHeight * 0.5;
      var active = $section.is(':visible') && top + height - offset >= viewTop && top + offset <= viewTop + viewHeight;
      if (anchor.active === active) {
        return;
      }
      anchor.active = active;
      setClass($link, linkCurrent, active);
    });
  }

  function setClass($elem, className, add) {
    var exists = $elem.hasClass(className);
    if (add && exists) {
      return;
    }
    if (!add && !exists) {
      return;
    }
    add ? $elem.addClass(className) : $elem.removeClass(className);
  }

  // Export module
  return api;
});

/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Webflow: Smooth scroll
 */

var Webflow = __webpack_require__(1);

Webflow.define('scroll', module.exports = function ($) {
  var $doc = $(document);
  var win = window;
  var loc = win.location;
  var history = inIframe() ? null : win.history;
  var validHash = /^[a-zA-Z0-9][\w:.-]*$/;

  function inIframe() {
    try {
      return Boolean(win.frameElement);
    } catch (e) {
      return true;
    }
  }

  function ready() {
    // If hash is already present on page load, scroll to it right away
    if (loc.hash) {
      findEl(loc.hash.substring(1));
    }

    // The current page url without the hash part.
    var locHref = loc.href.split('#')[0];

    // When clicking on a link, check if it links to another part of the page
    $doc.on('click', 'a', function (e) {
      if (Webflow.env('design')) {
        return;
      }

      // Ignore links being used by jQuery mobile
      if (window.$.mobile && $(e.currentTarget).hasClass('ui-link')) {
        return;
      }

      // Ignore empty # links
      if (this.getAttribute('href') === '#') {
        e.preventDefault();
        return;
      }

      // The href property always contains the full url so we can compare
      // with the documentâ€™s location to only target links on this page.
      var parts = this.href.split('#');
      var hash = parts[0] === locHref ? parts[1] : null;
      if (hash) {
        findEl(hash, e);
      }
    });
  }

  function findEl(hash, e) {
    if (!validHash.test(hash)) {
      return;
    }

    var el = $('#' + hash);
    if (!el.length) {
      return;
    }

    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Push new history state
    if (loc.hash !== hash && history && history.pushState &&
    // Navigation breaks Chrome when the protocol is `file:`.
    !(Webflow.env.chrome && loc.protocol === 'file:')) {
      var oldHash = history.state && history.state.hash;
      if (oldHash !== hash) {
        history.pushState({ hash: hash }, '', '#' + hash);
      }
    }

    // If a fixed header exists, offset for the height
    var rootTag = Webflow.env('editor') ? '.w-editor-body' : 'body';
    var header = $('header, ' + rootTag + ' > .header, ' + rootTag + ' > .w-nav:not([data-no-scroll])');
    var offset = header.css('position') === 'fixed' ? header.outerHeight() : 0;

    win.setTimeout(function () {
      scroll(el, offset);
    }, e ? 0 : 300);
  }

  function scroll(el, offset) {
    var start = $(win).scrollTop();
    var end = el.offset().top - offset;

    // If specified, scroll so that the element ends up in the middle of the viewport
    if (el.data('scroll') === 'mid') {
      var available = $(win).height() - offset;
      var elHeight = el.outerHeight();
      if (elHeight < available) {
        end -= Math.round((available - elHeight) / 2);
      }
    }

    var mult = 1;

    // Check for custom time multiplier on the body and the element
    $('body').add(el).each(function () {
      var time = parseFloat($(this).attr('data-scroll-time'), 10);
      if (!isNaN(time) && (time === 0 || time > 0)) {
        mult = time;
      }
    });

    // Shim for IE8 and below
    if (!Date.now) {
      Date.now = function () {
        return new Date().getTime();
      };
    }

    var clock = Date.now();
    var animate = win.requestAnimationFrame || win.mozRequestAnimationFrame || win.webkitRequestAnimationFrame || function (fn) {
      win.setTimeout(fn, 15);
    };
    var duration = (472.143 * Math.log(Math.abs(start - end) + 125) - 2000) * mult;

    var step = function step() {
      var elapsed = Date.now() - clock;
      win.scroll(0, getY(start, end, elapsed, duration));

      if (elapsed <= duration) {
        animate(step);
      }
    };

    step();
  }

  function getY(start, end, elapsed, duration) {
    if (elapsed > duration) {
      return end;
    }

    return start + (end - start) * ease(elapsed / duration);
  }

  function ease(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }

  // Export module
  return { ready: ready };
});

/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Webflow: Slider component
 */

var Webflow = __webpack_require__(1);
var IXEvents = __webpack_require__(23);

Webflow.define('slider', module.exports = function ($, _) {
  var api = {};
  var tram = $.tram;
  var $doc = $(document);
  var $sliders;
  var designer;
  var inApp = Webflow.env();
  var namespace = '.w-slider';
  var dot = '<div class="w-slider-dot" data-wf-ignore />';
  var ix = IXEvents.triggers;
  var fallback;
  var inRedraw;

  // -----------------------------------
  // Module methods

  api.ready = function () {
    designer = Webflow.env('design');
    init();
  };

  api.design = function () {
    designer = true;
    init();
  };

  api.preview = function () {
    designer = false;
    init();
  };

  api.redraw = function () {
    inRedraw = true;
    init();
  };

  api.destroy = removeListeners;

  // -----------------------------------
  // Private methods

  function init() {
    // Find all sliders on the page
    $sliders = $doc.find(namespace);
    if (!$sliders.length) {
      return;
    }
    $sliders.filter(':visible').each(build);
    inRedraw = null;
    if (fallback) {
      return;
    }

    removeListeners();
    addListeners();
  }

  function removeListeners() {
    Webflow.resize.off(renderAll);
    Webflow.redraw.off(api.redraw);
  }

  function addListeners() {
    Webflow.resize.on(renderAll);
    Webflow.redraw.on(api.redraw);
  }

  function renderAll() {
    $sliders.filter(':visible').each(render);
  }

  function build(i, el) {
    var $el = $(el);

    // Store slider state in data
    var data = $.data(el, namespace);
    if (!data) {
      data = $.data(el, namespace, {
        index: 0,
        depth: 1,
        el: $el,
        config: {}
      });
    }
    data.mask = $el.children('.w-slider-mask');
    data.left = $el.children('.w-slider-arrow-left');
    data.right = $el.children('.w-slider-arrow-right');
    data.nav = $el.children('.w-slider-nav');
    data.slides = data.mask.children('.w-slide');
    data.slides.each(ix.reset);
    if (inRedraw) {
      data.maskWidth = 0;
    }

    // Disable in old browsers
    if (!tram.support.transform) {
      data.left.hide();
      data.right.hide();
      data.nav.hide();
      fallback = true;
      return;
    }

    // Remove old events
    data.el.off(namespace);
    data.left.off(namespace);
    data.right.off(namespace);
    data.nav.off(namespace);

    // Set config from data attributes
    configure(data);

    // Add events based on mode
    if (designer) {
      data.el.on('setting' + namespace, handler(data));
      stopTimer(data);
      data.hasTimer = false;
    } else {
      data.el.on('swipe' + namespace, handler(data));
      data.left.on('tap' + namespace, previousFunction(data));
      data.right.on('tap' + namespace, next(data));

      // Start timer if autoplay is true, only once
      if (data.config.autoplay && !data.hasTimer) {
        data.hasTimer = true;
        data.timerCount = 1;
        startTimer(data);
      }
    }

    // Listen to nav events
    data.nav.on('tap' + namespace, '> div', handler(data));

    // Remove gaps from formatted html (for inline-blocks)
    if (!inApp) {
      data.mask.contents().filter(function () {
        return this.nodeType === 3;
      }).remove();
    }

    // Run first render
    render(i, el);
  }

  function configure(data) {
    var config = {};

    config.crossOver = 0;

    // Set config options from data attributes
    config.animation = data.el.attr('data-animation') || 'slide';
    if (config.animation === 'outin') {
      config.animation = 'cross';
      config.crossOver = 0.5;
    }
    config.easing = data.el.attr('data-easing') || 'ease';

    var duration = data.el.attr('data-duration');
    config.duration = duration != null ? parseInt(duration, 10) : 500;

    if (isAttrTrue(data.el.attr('data-infinite'))) {
      config.infinite = true;
    }

    if (isAttrTrue(data.el.attr('data-disable-swipe'))) {
      config.disableSwipe = true;
    }

    if (isAttrTrue(data.el.attr('data-hide-arrows'))) {
      config.hideArrows = true;
    } else if (data.config.hideArrows) {
      data.left.show();
      data.right.show();
    }

    if (isAttrTrue(data.el.attr('data-autoplay'))) {
      config.autoplay = true;
      config.delay = parseInt(data.el.attr('data-delay'), 10) || 2000;
      config.timerMax = parseInt(data.el.attr('data-autoplay-limit'), 10);
      // Disable timer on first touch or mouse down
      var touchEvents = 'mousedown' + namespace + ' touchstart' + namespace;
      if (!designer) {
        data.el.off(touchEvents).one(touchEvents, function () {
          stopTimer(data);
        });
      }
    }

    // Use edge buffer to help calculate page count
    var arrowWidth = data.right.width();
    config.edge = arrowWidth ? arrowWidth + 40 : 100;

    // Store config in data
    data.config = config;
  }

  function isAttrTrue(value) {
    return value === '1' || value === 'true';
  }

  function previousFunction(data) {
    return function () {
      change(data, { index: data.index - 1, vector: -1 });
    };
  }

  function next(data) {
    return function () {
      change(data, { index: data.index + 1, vector: 1 });
    };
  }

  function select(data, value) {
    // Select page based on slide element index
    var found = null;
    if (value === data.slides.length) {
      init();layout(data); // Rebuild and find new slides
    }
    _.each(data.anchors, function (anchor, index) {
      $(anchor.els).each(function (i, el) {
        if ($(el).index() === value) {
          found = index;
        }
      });
    });
    if (found != null) {
      change(data, { index: found, immediate: true });
    }
  }

  function startTimer(data) {
    stopTimer(data);
    var config = data.config;
    var timerMax = config.timerMax;
    if (timerMax && data.timerCount++ > timerMax) {
      return;
    }
    data.timerId = window.setTimeout(function () {
      if (data.timerId == null || designer) {
        return;
      }
      next(data)();
      startTimer(data);
    }, config.delay);
  }

  function stopTimer(data) {
    window.clearTimeout(data.timerId);
    data.timerId = null;
  }

  function handler(data) {
    return function (evt, options) {
      options = options || {};
      var config = data.config;

      // Designer settings
      if (designer && evt.type === 'setting') {
        if (options.select === 'prev') {
          return previousFunction(data)();
        }
        if (options.select === 'next') {
          return next(data)();
        }
        configure(data);
        layout(data);
        if (options.select == null) {
          return;
        }
        select(data, options.select);
        return;
      }

      // Swipe event
      if (evt.type === 'swipe') {
        if (config.disableSwipe) {
          return;
        }
        if (Webflow.env('editor')) {
          return;
        }
        if (options.direction === 'left') {
          return next(data)();
        }
        if (options.direction === 'right') {
          return previousFunction(data)();
        }
        return;
      }

      // Page buttons
      if (data.nav.has(evt.target).length) {
        change(data, { index: $(evt.target).index() });
      }
    };
  }

  function change(data, options) {
    options = options || {};
    var config = data.config;
    var anchors = data.anchors;

    // Set new index
    data.previous = data.index;
    var index = options.index;
    var shift = {};
    if (index < 0) {
      index = anchors.length - 1;
      if (config.infinite) {
        // Shift first slide to the end
        shift.x = -data.endX;
        shift.from = 0;
        shift.to = anchors[0].width;
      }
    } else if (index >= anchors.length) {
      index = 0;
      if (config.infinite) {
        // Shift last slide to the start
        shift.x = anchors[anchors.length - 1].width;
        shift.from = -anchors[anchors.length - 1].x;
        shift.to = shift.from - shift.x;
      }
    }
    data.index = index;

    // Select page nav
    var active = data.nav.children().eq(data.index).addClass('w-active');
    data.nav.children().not(active).removeClass('w-active');

    // Hide arrows
    if (config.hideArrows) {
      data.index === anchors.length - 1 ? data.right.hide() : data.right.show();
      data.index === 0 ? data.left.hide() : data.left.show();
    }

    // Get page offset from anchors
    var lastOffsetX = data.offsetX || 0;
    var offsetX = data.offsetX = -anchors[data.index].x;
    var resetConfig = { x: offsetX, opacity: 1, visibility: '' };

    // Transition slides
    var targets = $(anchors[data.index].els);
    var prevTargs = $(anchors[data.previous] && anchors[data.previous].els);
    var others = data.slides.not(targets);
    var animation = config.animation;
    var easing = config.easing;
    var duration = Math.round(config.duration);
    var vector = options.vector || (data.index > data.previous ? 1 : -1);
    var fadeRule = 'opacity ' + duration + 'ms ' + easing;
    var slideRule = 'transform ' + duration + 'ms ' + easing;

    // Trigger IX events
    if (!designer) {
      targets.each(ix.intro);
      others.each(ix.outro);
    }

    // Set immediately after layout changes (but not during redraw)
    if (options.immediate && !inRedraw) {
      tram(targets).set(resetConfig);
      resetOthers();
      return;
    }

    // Exit early if index is unchanged
    if (data.index === data.previous) {
      return;
    }

    // Cross Fade / Out-In
    if (animation === 'cross') {
      var reduced = Math.round(duration - duration * config.crossOver);
      var wait = Math.round(duration - reduced);
      fadeRule = 'opacity ' + reduced + 'ms ' + easing;
      tram(prevTargs).set({ visibility: '' }).add(fadeRule).start({ opacity: 0 });
      tram(targets).set({ visibility: '', x: offsetX, opacity: 0, zIndex: data.depth++ }).add(fadeRule).wait(wait).then({ opacity: 1 }).then(resetOthers);
      return;
    }

    // Fade Over
    if (animation === 'fade') {
      tram(prevTargs).set({ visibility: '' }).stop();
      tram(targets).set({ visibility: '', x: offsetX, opacity: 0, zIndex: data.depth++ }).add(fadeRule).start({ opacity: 1 }).then(resetOthers);
      return;
    }

    // Slide Over
    if (animation === 'over') {
      resetConfig = { x: data.endX };
      tram(prevTargs).set({ visibility: '' }).stop();
      tram(targets).set({ visibility: '', zIndex: data.depth++, x: offsetX + anchors[data.index].width * vector }).add(slideRule).start({ x: offsetX }).then(resetOthers);
      return;
    }

    // Slide - infinite scroll
    if (config.infinite && shift.x) {
      tram(data.slides.not(prevTargs)).set({ visibility: '', x: shift.x }).add(slideRule).start({ x: offsetX });
      tram(prevTargs).set({ visibility: '', x: shift.from }).add(slideRule).start({ x: shift.to });
      data.shifted = prevTargs;
    } else {
      if (config.infinite && data.shifted) {
        tram(data.shifted).set({ visibility: '', x: lastOffsetX });
        data.shifted = null;
      }

      // Slide - basic scroll
      tram(data.slides).set({ visibility: '' }).add(slideRule).start({ x: offsetX });
    }

    // Helper to move others out of view
    function resetOthers() {
      targets = $(anchors[data.index].els);
      others = data.slides.not(targets);
      if (animation !== 'slide') {
        resetConfig.visibility = 'hidden';
      }
      tram(others).set(resetConfig);
    }
  }

  function render(i, el) {
    var data = $.data(el, namespace);
    if (!data) {
      return;
    }
    if (maskChanged(data)) {
      return layout(data);
    }
    if (designer && slidesChanged(data)) {
      layout(data);
    }
  }

  function layout(data) {
    // Determine page count from width of slides
    var pages = 1;
    var offset = 0;
    var anchor = 0;
    var width = 0;
    var maskWidth = data.maskWidth;
    var threshold = maskWidth - data.config.edge;
    if (threshold < 0) {
      threshold = 0;
    }
    data.anchors = [{ els: [], x: 0, width: 0 }];
    data.slides.each(function (i, el) {
      if (anchor - offset > threshold) {
        pages++;
        offset += maskWidth;
        // Store page anchor for transition
        data.anchors[pages - 1] = { els: [], x: anchor, width: 0 };
      }
      // Set next anchor using current width + margin
      width = $(el).outerWidth(true);
      anchor += width;
      data.anchors[pages - 1].width += width;
      data.anchors[pages - 1].els.push(el);
    });
    data.endX = anchor;

    // Build dots if nav exists and needs updating
    if (designer) {
      data.pages = null;
    }
    if (data.nav.length && data.pages !== pages) {
      data.pages = pages;
      buildNav(data);
    }

    // Make sure index is still within range and call change handler
    var index = data.index;
    if (index >= pages) {
      index = pages - 1;
    }
    change(data, { immediate: true, index: index });
  }

  function buildNav(data) {
    var dots = [];
    var $dot;
    var spacing = data.el.attr('data-nav-spacing');
    if (spacing) {
      spacing = parseFloat(spacing) + 'px';
    }
    for (var i = 0; i < data.pages; i++) {
      $dot = $(dot);
      if (data.nav.hasClass('w-num')) {
        $dot.text(i + 1);
      }
      if (spacing != null) {
        $dot.css({
          'margin-left': spacing,
          'margin-right': spacing
        });
      }
      dots.push($dot);
    }
    data.nav.empty().append(dots);
  }

  function maskChanged(data) {
    var maskWidth = data.mask.width();
    if (data.maskWidth !== maskWidth) {
      data.maskWidth = maskWidth;
      return true;
    }
    return false;
  }

  function slidesChanged(data) {
    var slidesWidth = 0;
    data.slides.each(function (i, el) {
      slidesWidth += $(el).outerWidth(true);
    });
    if (data.slidesWidth !== slidesWidth) {
      data.slidesWidth = slidesWidth;
      return true;
    }
    return false;
  }

  // Export module
  return api;
});

/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Webflow: Tabs component
 */

var Webflow = __webpack_require__(1);
var IXEvents = __webpack_require__(23);

Webflow.define('tabs', module.exports = function ($) {
  var api = {};
  var tram = $.tram;
  var $doc = $(document);
  var $tabs;
  var design;
  var env = Webflow.env;
  var safari = env.safari;
  var inApp = env();
  var tabAttr = 'data-w-tab';
  var namespace = '.w-tabs';
  var linkCurrent = 'w--current';
  var tabActive = 'w--tab-active';
  var ix = IXEvents.triggers;

  var inRedraw = false;

  // -----------------------------------
  // Module methods

  api.ready = api.design = api.preview = init;

  api.redraw = function () {
    inRedraw = true;
    init();
    inRedraw = false;
  };

  api.destroy = function () {
    $tabs = $doc.find(namespace);
    if (!$tabs.length) {
      return;
    }
    $tabs.each(resetIX);
    removeListeners();
  };

  // -----------------------------------
  // Private methods

  function init() {
    design = inApp && Webflow.env('design');

    // Find all instances on the page
    $tabs = $doc.find(namespace);
    if (!$tabs.length) {
      return;
    }
    $tabs.each(build);
    if (Webflow.env('preview') && !inRedraw) {
      $tabs.each(resetIX);
    }

    removeListeners();
    addListeners();
  }

  function removeListeners() {
    Webflow.redraw.off(api.redraw);
  }

  function addListeners() {
    Webflow.redraw.on(api.redraw);
  }

  function resetIX(i, el) {
    var data = $.data(el, namespace);
    if (!data) {
      return;
    }
    data.links && data.links.each(ix.reset);
    data.panes && data.panes.each(ix.reset);
  }

  function build(i, el) {
    var $el = $(el);

    // Store state in data
    var data = $.data(el, namespace);
    if (!data) {
      data = $.data(el, namespace, { el: $el, config: {} });
    }
    data.current = null;
    data.menu = $el.children('.w-tab-menu');
    data.links = data.menu.children('.w-tab-link');
    data.content = $el.children('.w-tab-content');
    data.panes = data.content.children('.w-tab-pane');

    // Remove old events
    data.el.off(namespace);
    data.links.off(namespace);

    // Set config from data attributes
    configure(data);

    // Wire up events when not in design mode
    if (!design) {
      data.links.on('click' + namespace, linkSelect(data));

      // Trigger first intro event from current tab
      var $link = data.links.filter('.' + linkCurrent);
      var tab = $link.attr(tabAttr);
      tab && changeTab(data, { tab: tab, immediate: true });
    }
  }

  function configure(data) {
    var config = {};

    // Set config options from data attributes
    config.easing = data.el.attr('data-easing') || 'ease';

    var intro = parseInt(data.el.attr('data-duration-in'), 10);
    intro = config.intro = intro === intro ? intro : 0;

    var outro = parseInt(data.el.attr('data-duration-out'), 10);
    outro = config.outro = outro === outro ? outro : 0;

    config.immediate = !intro && !outro;

    // Store config in data
    data.config = config;
  }

  function linkSelect(data) {
    return function (evt) {
      var tab = evt.currentTarget.getAttribute(tabAttr);
      tab && changeTab(data, { tab: tab });
    };
  }

  function changeTab(data, options) {
    options = options || {};

    var config = data.config;
    var easing = config.easing;
    var tab = options.tab;

    // Don't select the same tab twice
    if (tab === data.current) {
      return;
    }
    data.current = tab;

    // Select the current link
    data.links.each(function (i, el) {
      var $el = $(el);
      if (el.getAttribute(tabAttr) === tab) {
        $el.addClass(linkCurrent).each(ix.intro);
      } else if ($el.hasClass(linkCurrent)) {
        $el.removeClass(linkCurrent).each(ix.outro);
      }
    });

    // Find the new tab panes and keep track of previous
    var targets = [];
    var previous = [];
    data.panes.each(function (i, el) {
      var $el = $(el);
      if (el.getAttribute(tabAttr) === tab) {
        targets.push(el);
      } else if ($el.hasClass(tabActive)) {
        previous.push(el);
      }
    });

    var $targets = $(targets);
    var $previous = $(previous);

    // Switch tabs immediately and bypass transitions
    if (options.immediate || config.immediate) {
      $targets.addClass(tabActive).each(ix.intro);
      $previous.removeClass(tabActive);
      // Redraw to benefit components in the hidden tab pane
      // But only if not currently in the middle of a redraw
      if (!inRedraw) {
        Webflow.redraw.up();
      }
      return;
    }

    // Fade out the currently active tab before intro
    if ($previous.length && config.outro) {
      $previous.each(ix.outro);
      tram($previous).add('opacity ' + config.outro + 'ms ' + easing, { fallback: safari }).start({ opacity: 0 }).then(intro);
    } else {
      // Skip the outro and play intro
      intro();
    }

    // Fade in the new target
    function intro() {
      // Clear previous active class + styles touched by tram
      // We cannot remove the whole inline style because it could be dynamically bound
      $previous.removeClass(tabActive).css({
        opacity: '',
        transition: '',
        transform: '',
        width: '',
        height: ''
      });

      // Add active class to new target
      $targets.addClass(tabActive).each(ix.intro);
      Webflow.redraw.up();

      // Set opacity immediately if intro is zero
      if (!config.intro) {
        return tram($targets).set({ opacity: 1 });
      }

      // Otherwise fade in opacity
      tram($targets).set({ opacity: 0 }).redraw().add('opacity ' + config.intro + 'ms ' + easing, { fallback: safari }).start({ opacity: 1 });
    }
  }

  // Export module
  return api;
});

/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Webflow: Touch events
 */

var Webflow = __webpack_require__(1);

Webflow.define('touch', module.exports = function ($) {
  var api = {};
  var fallback = !document.addEventListener;
  var getSelection = window.getSelection;

  // Fallback to click events in old IE
  if (fallback) {
    $.event.special.tap = { bindType: 'click', delegateType: 'click' };
  }

  api.init = function (el) {
    if (fallback) {
      return null;
    }
    el = typeof el === 'string' ? $(el).get(0) : el;
    return el ? new Touch(el) : null;
  };

  function Touch(el) {
    var active = false;
    var dirty = false;
    var useTouch = false;
    var thresholdX = Math.min(Math.round(window.innerWidth * 0.04), 40);
    var startX;
    var startY;
    var lastX;

    el.addEventListener('touchstart', start, false);
    el.addEventListener('touchmove', move, false);
    el.addEventListener('touchend', end, false);
    el.addEventListener('touchcancel', cancel, false);
    el.addEventListener('mousedown', start, false);
    el.addEventListener('mousemove', move, false);
    el.addEventListener('mouseup', end, false);
    el.addEventListener('mouseout', cancel, false);

    function start(evt) {
      // We donâ€™t handle multi-touch events yet.
      var touches = evt.touches;
      if (touches && touches.length > 1) {
        return;
      }

      active = true;
      dirty = false;

      if (touches) {
        useTouch = true;
        startX = touches[0].clientX;
        startY = touches[0].clientY;
      } else {
        startX = evt.clientX;
        startY = evt.clientY;
      }

      lastX = startX;
    }

    function move(evt) {
      if (!active) {
        return;
      }

      if (useTouch && evt.type === 'mousemove') {
        evt.preventDefault();
        evt.stopPropagation();
        return;
      }

      var touches = evt.touches;
      var x = touches ? touches[0].clientX : evt.clientX;
      var y = touches ? touches[0].clientY : evt.clientY;

      var velocityX = x - lastX;
      lastX = x;

      // Allow swipes while pointer is down, but prevent them during text selection
      if (Math.abs(velocityX) > thresholdX && getSelection && String(getSelection()) === '') {
        triggerEvent('swipe', evt, { direction: velocityX > 0 ? 'right' : 'left' });
        cancel();
      }

      // If pointer moves more than 10px flag to cancel tap
      if (Math.abs(x - startX) > 10 || Math.abs(y - startY) > 10) {
        dirty = true;
      }
    }

    function end(evt) {
      if (!active) {
        return;
      }
      active = false;

      if (useTouch && evt.type === 'mouseup') {
        evt.preventDefault();
        evt.stopPropagation();
        useTouch = false;
        return;
      }

      if (!dirty) {
        triggerEvent('tap', evt);
      }
    }

    function cancel() {
      active = false;
    }

    function destroy() {
      el.removeEventListener('touchstart', start, false);
      el.removeEventListener('touchmove', move, false);
      el.removeEventListener('touchend', end, false);
      el.removeEventListener('touchcancel', cancel, false);
      el.removeEventListener('mousedown', start, false);
      el.removeEventListener('mousemove', move, false);
      el.removeEventListener('mouseup', end, false);
      el.removeEventListener('mouseout', cancel, false);
      el = null;
    }

    // Public instance methods
    this.destroy = destroy;
  }

  // Wrap native event to supoprt preventdefault + stopPropagation
  function triggerEvent(type, evt, data) {
    var newEvent = $.Event(type, { originalEvent: evt });
    $(evt.target).trigger(newEvent, data);
  }

  // Listen for touch events on all nodes by default.
  api.instance = api.init(document);

  // Export module
  return api;
});

/***/ })
/******/ ]);/**
 * ----------------------------------------------------------------------
 * Webflow: Interactions: Init
 */
Webflow.require('ix').init([
  {"slug":"category-icon-hover","name":"Category Icon Hover","value":{"style":{},"triggers":[{"type":"hover","selector":".category-popout","siblings":true,"preserve3d":true,"stepsA":[{"display":"block","opacity":1,"transition":"transform 300ms ease 0, opacity 300ms ease 0","x":"0px","y":"0px","z":"0px"}],"stepsB":[{"opacity":0,"transition":"transform 500ms ease 0, opacity 500ms ease 0","x":"0px","y":"0px","z":"0px"},{"display":"none"}]}]}},
  {"slug":"featured-article-hover","name":"Featured Article Hover","value":{"style":{},"triggers":[{"type":"hover","selector":".featured-article-overlay","descend":true,"preserve3d":true,"stepsA":[{"opacity":0.7000000000000001,"transition":"opacity 300ms ease 0, transform 300ms ease 0","scaleX":1.03,"scaleY":1.03,"scaleZ":1}],"stepsB":[{"opacity":1,"transition":"transform 500ms ease 0, opacity 500ms ease 0","scaleX":1,"scaleY":1,"scaleZ":1}]}]}},
  {"slug":"hover-entry","name":"Hover Entry","value":{"style":{},"triggers":[{"type":"slider","selector":".banner-header","descend":true,"preserve3d":true,"stepsA":[{"wait":"500ms"},{"opacity":1,"transition":"opacity 500ms ease 0, transform 500ms ease 0","x":"0px","y":"0px","z":"0px"}],"stepsB":[{"wait":"500ms"},{"opacity":0,"transition":"transform 500ms ease 0, opacity 500ms ease 0","x":"0px","y":"20px","z":"0px"}]},{"type":"slider","selector":".button-container","descend":true,"preserve3d":true,"stepsA":[{"wait":"1000ms"},{"opacity":1,"transition":"opacity 500ms ease 0, transform 500ms ease 0","x":"0px","y":"0px","z":"0px"}],"stepsB":[{"wait":"1s"},{"opacity":0,"transition":"transform 500ms ease 0, opacity 500ms ease 0","x":"0px","y":"20px","z":"0px"}]},{"type":"slider","selector":".homepage-sub-header","descend":true,"preserve3d":true,"stepsA":[{"wait":"750ms"},{"opacity":1,"transition":"opacity 500ms ease 0, transform 500ms ease 0","x":"0px","y":"0px","z":"0px"}],"stepsB":[{"wait":"750ms"},{"opacity":0,"transition":"transform 500ms ease 0, opacity 500ms ease 0","x":"0px","y":"20px","z":"0px"}]}]}},
  {"slug":"invis-and-down-20","name":"Invis and Down 20","value":{"style":{"opacity":0,"x":"0px","y":"20px","z":"0px"},"triggers":[]}},
  {"slug":"homepage-grid-hover","name":"Homepage Grid Hover","value":{"style":{},"triggers":[{"type":"hover","selector":".homepage-grid-image-overlay","descend":true,"preserve3d":true,"stepsA":[{"opacity":0.7000000000000001,"transition":"transform 300ms ease 0, opacity 300ms ease 0","scaleX":1.03,"scaleY":1.03,"scaleZ":1}],"stepsB":[{"opacity":1,"transition":"transform 300ms ease 0, opacity 300ms ease 0","scaleX":1,"scaleY":1,"scaleZ":1}]}]}},
  {"slug":"event-button-click","name":"Event Button Click","value":{"style":{},"triggers":[{"type":"click","selector":".event-button-popup","stepsA":[{"display":"flex"}],"stepsB":[]}]}},
  {"slug":"event-popup-close","name":"Event Popup Close","value":{"style":{},"triggers":[{"type":"click","selector":".event-button-popup","stepsA":[{"display":"none"}],"stepsB":[]}]}},
  {"slug":"podcast-hover","name":"podcast hover","value":{"style":{},"triggers":[{"type":"hover","selector":".play-notification","descend":true,"preserve3d":true,"stepsA":[{"display":"block"},{"opacity":1,"transition":"opacity 500ms ease 0, transform 500ms ease 0"}],"stepsB":[{"opacity":0,"transition":"transform 500ms ease 0, opacity 500ms ease 0","scaleX":1,"scaleY":1,"scaleZ":1},{"display":"none"}]},{"type":"click","selector":".audio-player","preserve3d":true,"stepsA":[{"opacity":1,"transition":"transform 500ms ease 0, opacity 500ms ease 0","x":"0px","y":"0px","z":"0px"}],"stepsB":[]},{"type":"hover","selector":".podcast-grid-image-overlay","descend":true,"stepsA":[{"display":"block"},{"opacity":1,"transition":"opacity 500ms ease 0"}],"stepsB":[{"opacity":0,"transition":"opacity 500ms ease 0"},{"display":"none"}]},{"type":"click","selector":".expand-player-container","stepsA":[{"display":"none"}],"stepsB":[]}]}},
  {"slug":"social-popup","name":"social popup","value":{"style":{},"triggers":[{"type":"click","selector":".share-popup","siblings":true,"stepsA":[{"display":"flex"},{"opacity":1,"transition":"transform 300ms ease 0, opacity 300ms ease 0"}],"stepsB":[]}]}},
  {"slug":"share-close","name":"share close","value":{"style":{},"triggers":[{"type":"click","selector":".share-popup","preserve3d":true,"stepsA":[{"display":"none"},{"opacity":0,"x":"0px","y":"0px","z":"0px"}],"stepsB":[]}]}},
  {"slug":"audio-player-initial-appearance","name":"Audio Player Initial Appearance","value":{"style":{"opacity":0,"x":"0px","y":"100%","z":"0px"},"triggers":[]}},
  {"slug":"subscribe-popup","name":"subscribe popup","value":{"style":{},"triggers":[{"type":"click","selector":".subscribe-popup","preserve3d":true,"stepsA":[{"display":"flex"},{"opacity":1,"transition":"opacity 200 ease 0, transform 200 ease 0","x":"0px","y":"0px","z":"0px"}],"stepsB":[{"display":"none","opacity":0}]}]}},
  {"slug":"blog-grid-hover","name":"Blog Grid Hover","value":{"style":{},"triggers":[{"type":"hover","selector":".grid-item-image","descend":true,"stepsA":[{}],"stepsB":[{"transition":"transform 200 ease 0"}]},{"type":"hover","selector":".blog-grid-read-more","descend":true,"stepsA":[{},{}],"stepsB":[{},{}]}]}},
  {"slug":"artist-page-grid-item-hover","name":"Artist Page Grid Item Hover","value":{"style":{},"triggers":[{"type":"hover","selector":".grid-item-image","descend":true,"stepsA":[{"opacity":0.5,"transition":"opacity 300ms ease 0"}],"stepsB":[{"opacity":0,"transition":"transform 200 ease 0, opacity 300ms ease 0"}]},{"type":"hover","selector":".author-grid-read-more","descend":true,"stepsA":[{"display":"block"},{"opacity":1,"transition":"opacity 500ms ease 0"}],"stepsB":[{"opacity":0,"transition":"opacity 500ms ease 0"},{"display":"none"}]}]}},
  {"slug":"video-grid-hover","name":"Video Grid Hover","value":{"style":{},"triggers":[{"type":"hover","selector":".video-grid-image-overlay","descend":true,"stepsA":[{"display":"flex"},{"opacity":1,"transition":"opacity 300ms ease 0"}],"stepsB":[{"opacity":0,"transition":"opacity 300ms ease 0"},{"display":"none"}]}]}},
  {"slug":"hide-player","name":"Hide Player","value":{"style":{},"triggers":[{"type":"click","selector":".audio-player","preserve3d":true,"stepsA":[{"transition":"transform 500ms ease 0","x":"0px","y":"100%","z":"0px"}],"stepsB":[]},{"type":"click","selector":".expand-player-container","preserve3d":true,"stepsA":[{"wait":"500ms"},{"display":"flex"},{"opacity":1,"transition":"transform 500ms ease 0, opacity 200 ease 0","x":"0px","y":"0px","z":"0px"}],"stepsB":[]}]}},
  {"slug":"new-interaction-3","name":"New Interaction 3","value":{"style":{},"triggers":[{"type":"click","selector":".expand-player-container","preserve3d":true,"stepsA":[{"transition":"transform 500ms ease 0","x":"0px","y":"300px","z":"0px"},{"display":"none"}],"stepsB":[]},{"type":"click","selector":".audio-player","preserve3d":true,"stepsA":[{"transition":"transform 500ms ease 0","x":"0px","y":"0px","z":"0px"}],"stepsB":[]}]}},
  {"slug":"show-comments","name":"show comments","value":{"style":{},"triggers":[{"type":"click","selector":".comment-wrapper-div","stepsA":[{"display":"block"}],"stepsB":[]},{"type":"click","stepsA":[{"display":"none"}],"stepsB":[]},{"type":"click","selector":".video-single-comments-title","stepsA":[{"display":"block"}],"stepsB":[]},{"type":"click","selector":".disqus-thread","stepsA":[{"display":"block"}],"stepsB":[]},{"type":"click","selector":".comment-wrapper","stepsA":[{"display":"block"}],"stepsB":[]}]}},
  {"slug":"hide-comments","name":"Hide comments","value":{"style":{},"triggers":[{"type":"click","selector":".disqus-thread","stepsA":[{"display":"none"}],"stepsB":[{"display":"block"}]},{"type":"click","selector":".show-text","stepsA":[{"display":"block"}],"stepsB":[{"display":"none"}]},{"type":"click","selector":".hide-text","stepsA":[{"display":"none"}],"stepsB":[{"display":"block"}]}]}},
  {"slug":"click-video","name":"click video","value":{"style":{},"triggers":[{"type":"click","selector":".select-video","stepsA":[{"display":"none"}],"stepsB":[]},{"type":"click","selector":".loading-video","stepsA":[{"display":"block"}],"stepsB":[]}]}},
  {"slug":"subscribe-modal-appear","name":"subscribe modal appear","value":{"style":{},"triggers":[{"type":"click","selector":".subscribe-modal-window","stepsA":[{"display":"flex"}],"stepsB":[]}]}},
  {"slug":"subscribe-modal-dissappear","name":"Subscribe modal dissappear","value":{"style":{},"triggers":[{"type":"click","selector":".subscribe-modal-window","stepsA":[{"display":"none"}],"stepsB":[]},{"type":"click","selector":".subscribe-modal-beginning-content","stepsA":[{"display":"block"}],"stepsB":[]},{"type":"click","selector":".rss-option","stepsA":[{"display":"none"}],"stepsB":[]}]}},
  {"slug":"rss-option","name":"rss option","value":{"style":{},"triggers":[{"type":"click","selector":".rss-option","stepsA":[{"display":"block"}],"stepsB":[]},{"type":"click","selector":".subscribe-modal-beginning-content","stepsA":[{"display":"none"}],"stepsB":[]}]}},
  {"slug":"menu-disappear","name":"menu disappear","value":{"style":{},"triggers":[{"type":"click","selector":".navigation-mobile","preserve3d":true,"stepsA":[{"transition":"transform 300ms ease 0","x":"-200px","y":"0px","z":"0px"},{"display":"none"}],"stepsB":[]},{"type":"click","stepsA":[{"display":"none"}],"stepsB":[]}]}},
  {"slug":"menu-appear","name":"menu appear","value":{"style":{},"triggers":[{"type":"click","selector":".navigation-mobile","preserve3d":true,"stepsA":[{"display":"flex"},{"transition":"transform 300ms ease 0","x":"0px","y":"0px","z":"0px"}],"stepsB":[]},{"type":"click","selector":".menu-dark-overlay","stepsA":[{"display":"block"}],"stepsB":[]}]}},
  {"slug":"open-transcript","name":"Open Transcript","value":{"style":{},"triggers":[{"type":"click","selector":".transcript-modal-window","stepsA":[{"display":"flex"},{"opacity":1,"transition":"opacity 500ms ease 0"}],"stepsB":[]}]}},
  {"slug":"transcript-close","name":"Transcript Close","value":{"style":{},"triggers":[{"type":"click","selector":".transcript-modal-window","stepsA":[{"opacity":0,"transition":"opacity 500ms ease 0"},{"display":"none"}],"stepsB":[]}]}}
]);
/**
 * ----------------------------------------------------------------------
 * Webflow: Interactions 2.0: Init
 */
Webflow.require('ix2').init(
{"events":{"e":{"id":"e","eventTypeId":"MOUSE_CLICK","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-5","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-2"}},"mediaQueries":["medium","small","tiny"],"target":{"appliesTo":"ELEMENT","styleBlockIds":[],"id":"faff6c49-0934-4e9f-e9d2-9aa7f6b59f23"},"config":{"loop":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1516338056914},"e-3":{"id":"e-3","eventTypeId":"MOUSE_CLICK","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-6","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-4"}},"mediaQueries":["medium","small","tiny","main"],"target":{"appliesTo":"ELEMENT","styleBlockIds":[],"id":"d3242deb-f5ec-69c4-a2ef-0fd638dc31b2"},"config":{"loop":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1516338373591},"e-7":{"id":"e-7","eventTypeId":"PAGE_START","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-7","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-8"}},"mediaQueries":["main","medium","small","tiny"],"target":{"appliesTo":"PAGE","styleBlockIds":[],"id":"5a0281c89a6ada000101512d"},"config":{"loop":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1517175685674}},"actionLists":{"a":{"id":"a","title":"New Timed Animation","actionItemGroups":[{"actionItems":[{"id":"a-n","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"value":"none","target":{"id":"5a5315e41409430001871d26|b1b38133-242e-7680-39ff-ccdad6f5fbb9"}}}]}],"createdOn":1515620794538,"useFirstGroupAsInitialState":false},"a-2":{"id":"a-2","title":"New Timed Animation","actionItemGroups":[{"actionItems":[{"id":"a-2-n","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"value":"none","target":{"id":"5a5315e41409430001871d26|b1b38133-242e-7680-39ff-ccdad6f5fbb9"}}}]},{"actionItems":[{"id":"a-2-n-2","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"value":"block","target":{"id":"5a5315e41409430001871d26|8654463a-e0f5-e884-de34-0b38717476d2"}}}]}],"createdOn":1515621580954,"useFirstGroupAsInitialState":false},"a-3":{"id":"a-3","title":"New Timed Animation 2","actionItemGroups":[{"actionItems":[{"id":"a-3-n","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"value":"block","target":{"id":"5a5315e41409430001871d26|b1b38133-242e-7680-39ff-ccdad6f5fbb9"}}}]},{"actionItems":[{"id":"a-3-n-2","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"value":"none","target":{"id":"5a5315e41409430001871d26|8654463a-e0f5-e884-de34-0b38717476d2"}}}]}],"createdOn":1515621580954,"useFirstGroupAsInitialState":false},"a-4":{"id":"a-4","title":"New Scroll Animation","continuousParameterGroups":[{"id":"a-4-p","type":"SCROLL_PROGRESS","parameterLabel":"Scroll","continuousActionGroups":[{"keyframe":0,"actionItems":[{"id":"a-4-n","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"easeIn","duration":500,"target":{"id":"5a5315e41409430001871d26|6c9e62f5-ca7f-2417-a859-2f5e9e799d6b"},"yValue":0,"xUnit":"PX","yUnit":"PX","zUnit":"PX"}}]},{"keyframe":100,"actionItems":[{"id":"a-4-n-2","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"id":"5a5315e41409430001871d26|6c9e62f5-ca7f-2417-a859-2f5e9e799d6b"},"yValue":800,"xUnit":"PX","yUnit":"PX","zUnit":"PX"}}]}]}],"createdOn":1515622035283},"a-5":{"id":"a-5","title":"Open Menu","actionItemGroups":[{"actionItems":[{"id":"a-5-n","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"value":"none","target":{"id":"d3242deb-f5ec-69c4-a2ef-0fd638dc31b2"}}},{"id":"a-5-n-2","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"id":"d3242deb-f5ec-69c4-a2ef-0fd638dc31b2"},"value":0,"unit":""}},{"id":"a-5-n-7","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"id":"e1647646-0043-423f-743e-d0bcb7846416"},"xValue":-300,"xUnit":"PX","yUnit":"PX","zUnit":"PX"}},{"id":"a-5-n-5","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"value":"none","target":{"id":"e1647646-0043-423f-743e-d0bcb7846416"}}}]},{"actionItems":[{"id":"a-5-n-3","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"value":"block","target":{"id":"d3242deb-f5ec-69c4-a2ef-0fd638dc31b2"}}},{"id":"a-5-n-4","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":300,"target":{"id":"d3242deb-f5ec-69c4-a2ef-0fd638dc31b2"},"value":1,"unit":""}},{"id":"a-5-n-8","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"value":"flex","target":{"id":"e1647646-0043-423f-743e-d0bcb7846416"}}},{"id":"a-5-n-6","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"easeIn","duration":300,"target":{"id":"e1647646-0043-423f-743e-d0bcb7846416"},"xValue":0,"xUnit":"PX","yUnit":"PX","zUnit":"PX"}}]}],"createdOn":1516338060512,"useFirstGroupAsInitialState":true},"a-6":{"id":"a-6","title":"Close Menu","actionItemGroups":[{"actionItems":[{"id":"a-6-n","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":300,"target":{"id":"d3242deb-f5ec-69c4-a2ef-0fd638dc31b2"},"value":0,"unit":""}},{"id":"a-6-n-3","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"easeOut","duration":300,"target":{"id":"e1647646-0043-423f-743e-d0bcb7846416"},"xValue":-300,"xUnit":"PX","yUnit":"PX","zUnit":"PX"}}]},{"actionItems":[{"id":"a-6-n-2","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"value":"none","target":{"id":"d3242deb-f5ec-69c4-a2ef-0fd638dc31b2"}}},{"id":"a-6-n-4","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"value":"none","target":{"id":"e1647646-0043-423f-743e-d0bcb7846416"}}}]}],"createdOn":1516338060512,"useFirstGroupAsInitialState":false},"a-7":{"id":"a-7","title":"New Timed Animation","actionItemGroups":[{"actionItems":[{"id":"a-7-n","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"id":"5a0281c89a6ada000101512d|9b83a36e-c3a2-84b4-d677-5d7e7b5baf26"},"value":0,"unit":""}},{"id":"a-7-n-3","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"id":"5a0281c89a6ada000101512d|2bad5b24-1e88-417d-1fb0-a82626f0bc60"},"value":0,"unit":""}}]},{"actionItems":[{"id":"a-7-n-2","actionTypeId":"STYLE_OPACITY","config":{"delay":500,"easing":"","duration":1000,"target":{"id":"5a0281c89a6ada000101512d|9b83a36e-c3a2-84b4-d677-5d7e7b5baf26"},"value":1,"unit":""}},{"id":"a-7-n-4","actionTypeId":"STYLE_OPACITY","config":{"delay":1000,"easing":"","duration":1000,"target":{"id":"5a0281c89a6ada000101512d|2bad5b24-1e88-417d-1fb0-a82626f0bc60"},"value":1,"unit":""}}]}],"createdOn":1517175419805,"useFirstGroupAsInitialState":true}},"site":{"mediaQueries":[{"key":"main","min":992,"max":10000},{"key":"medium","min":768,"max":991},{"key":"small","min":480,"max":767},{"key":"tiny","min":0,"max":479}]}}
);