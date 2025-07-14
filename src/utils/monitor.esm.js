function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _createForOfIteratorHelper(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (!t) {
    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
      t && (r = t);
      var n = 0,
        F = function () {};
      return {
        s: F,
        n: function () {
          return n >= r.length ? {
            done: true
          } : {
            done: false,
            value: r[n++]
          };
        },
        e: function (r) {
          throw r;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var o,
    a = true,
    u = false;
  return {
    s: function () {
      t = t.call(r);
    },
    n: function () {
      var r = t.next();
      return a = r.done, r;
    },
    e: function (r) {
      u = true, o = r;
    },
    f: function () {
      try {
        a || null == t.return || t.return();
      } finally {
        if (u) throw o;
      }
    }
  };
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

var config = {
  url: "",
  projectName: "eyesdk",
  appId: "123456",
  userId: "123456",
  isImageUpload: false,
  batchSize: 5,
  autoReport: true,
  autoReportTime: 1000 * 60 * 5
};
function setConfig(options) {
  for (var key in config) {
    if (options[key]) {
      config[key] = options[key];
    }
  }
}

function deepCopy(target) {
  if (_typeof(target) === "object") {
    var result = Array.isArray(target) ? [] : {};
    for (var key in target) {
      if (_typeof(target[key]) == "object") {
        result[key] = deepCopy(target[key]);
      } else {
        result[key] = target[key];
      }
    }
    return result;
  }
  return target;
}
function generateUniqueId() {
  return "id-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9);
}
function throttle(func, delay) {
  var timer = null;
  return function () {
    var _arguments = arguments,
      _this = this;
    if (timer) return;
    timer = setTimeout(function () {
      func.apply(_this, _arguments);
      timer = null;
    }, delay);
  };
}

var cache = [];
function getCache() {
  return deepCopy(cache);
}
function addCache(data) {
  cache.push(data);
}
function clearCache() {
  cache.length = 0;
}

var originalOpen$1 = XMLHttpRequest.prototype.open;
var originalSend$1 = XMLHttpRequest.prototype.send;
function report$1(data) {
  if (!config.url) {
    console.error("请设置上传 url 地址");
    return;
  }
  var reportData = JSON.stringify({
    id: generateUniqueId(),
    data: data
  });
  // 上报数据，使用图片的方式
  if (config.isImageUpload) {
    imgRequest(reportData);
  } else {
    // 优先使用 sendBeacon
    if (window.navigator.sendBeacon) {
      return beaconRequest(reportData);
    } else {
      xhrRequest(reportData);
    }
  }
}
// 批量上报数据
function lazyReportBatch(data) {
  addCache(data);
  var dataCache = getCache();
  console.warn("dataCache", dataCache);
  if (dataCache.length && dataCache.length >= config.batchSize) {
    report$1(dataCache);
    clearCache();
  }
}
var timerId = null;
// 定时上报数据
function autoReport() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000 * 60 * 5;
  timerId = setInterval(function () {
    var dataCache = getCache();
    if (dataCache.length) {
      report$1(dataCache);
      clearCache();
    }
  }, time);
}
function clearAutoReport() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

// 图片发送数据
function imgRequest(data) {
  var img = new Image();
  // http://127.0.0.1:8080/api?data=encodeURIComponent(data)
  img.src = "".concat(config.url, "?data=").concat(encodeURIComponent(JSON.stringify(data)));
}
// 普通ajax发送请求数据
function xhrRequest(data) {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(function () {
      var xhr = new XMLHttpRequest();
      originalOpen$1.call(xhr, "post", config.url);
      originalSend$1.call(xhr, JSON.stringify(data));
    }, {
      timeout: 3000
    });
  } else {
    setTimeout(function () {
      var xhr = new XMLHttpRequest();
      originalOpen$1.call(xhr, "post", url);
      originalSend$1.call(xhr, JSON.stringify(data));
    });
  }
}
function beaconRequest(data) {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(function () {
      window.navigator.sendBeacon(config.url, data);
    }, {
      timeout: 3000
    });
  } else {
    setTimeout(function () {
      window.navigator.sendBeacon(config.url, data);
    });
  }
}

var originalFetch = window.fetch;
function overwriteFetch() {
  window.fetch = function newFetch(url, config) {
    var startTime = Date.now();
    var reportData = {
      type: "performance",
      subType: "fetch",
      url: url,
      startTime: startTime,
      method: config.method
    };
    return originalFetch(url, config).then(function (res) {
      var endTime = Date.now();
      reportData.endTime = endTime;
      reportData.duration = endTime - startTime;
      var data = res.clone();
      reportData.status = data.status;
      reportData.success = data.ok;
      // todo 上报数据
      lazyReportBatch(reportData);
      return res;
    }).catch(function (err) {
      var endTime = Date.now();
      reportData.endTime = endTime;
      reportData.duration = endTime - startTime;
      reportData.status = 0;
      reportData.success = false;
      // todo 上报数据
      lazyReportBatch(reportData);
    });
  };
}
function fetch() {
  overwriteFetch();
}

// 统计所有资源加载情况
function observerEntries() {
  if (document.readyState === "complete") {
    observerEvent();
  } else {
    var _onLoad = function onLoad() {
      observerEvent();
      window.removeEventListener("load", _onLoad, true);
    };
    window.addEventListener("load", _onLoad, true);
  }
}
function observerEvent() {
  var entryHandler = function entryHandler(list) {
    var data = list.getEntries().filter(function (entry) {
      return entry.name.indexOf("node_modules") < 0 && entry.name.indexOf("/@id/") < 0 && entry.name.indexOf("/@vite/") < 0;
    });
    var _iterator = _createForOfIteratorHelper(data),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        if (observer) {
          observer.disconnect();
        }
        var reportData = {
          name: entry.name,
          // 资源的名字
          type: "performance",
          // 类型
          subType: entry.entryType,
          // 类型 resource
          sourceType: entry.initiatorType,
          // 资源类型  script/img/css/js/font/xml/other
          duration: entry.duration,
          // 加载时间 单位ms
          dns: entry.domainLookupEnd - entry.domainLookupStart,
          // dns解析时间 单位ms
          tcp: entry.connectEnd - entry.connectStart,
          // tcp连接时间 单位ms
          redirect: entry.redirectEnd - entry.redirectStart,
          // 重定向时间 单位ms
          ttfb: entry.responseStart,
          // 首字节时间 单位ms
          protocol: entry.nextHopProtocol,
          // 请求协议
          responseBodySize: entry.encodedBodySize,
          // 响应内容大小 单位byte
          responseHeaderSize: entry.transferSize - entry.encodedBodySize,
          // 响应头部大小 单位byte
          transferSize: entry.transferSize,
          // 请求内容大小 单位byte
          resourceSize: entry.decodedBodySize,
          // 资源解压后的大小 单位byte
          startTime: performance.now()
        };
        lazyReportBatch(reportData);
        // console.log(entry);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
  var observer = new PerformanceObserver(entryHandler);
  observer.observe({
    type: ["resource"],
    buffered: true
  });
}

function observerLCP() {
  var entryHandler = function entryHandler(list) {
    if (observer) {
      observer.disconnect();
    }
    var _iterator = _createForOfIteratorHelper(list.getEntries()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        var json = entry.toJSON();
        console.log(json);
        var reportData = _objectSpread2(_objectSpread2({}, json), {}, {
          type: "performance",
          subType: entry.name,
          pageUrl: window.location.href
        });
        // 发送数据 todo;
        lazyReportBatch(reportData);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
  // 统计和计算lcp的时间
  var observer = new PerformanceObserver(entryHandler);
  // buffered: true 确保观察到所有paint事件
  observer.observe({
    type: "largest-contentful-paint",
    buffered: true
  });
}

function observerFCP() {
  var entryHandler = function entryHandler(list) {
    var _iterator = _createForOfIteratorHelper(list.getEntries()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        if (entry.name === "first-contentful-paint") {
          observer.disconnect();
          var json = entry.toJSON();
          console.log(json);
          var reportData = _objectSpread2(_objectSpread2({}, json), {}, {
            type: "performance",
            subType: entry.name,
            pageUrl: window.location.href
          });
          // 发送数据 todo;
          lazyReportBatch(reportData);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
  // 统计和计算fcp的时间
  var observer = new PerformanceObserver(entryHandler);
  // buffered: true 确保观察到所有paint事件
  observer.observe({
    type: "paint",
    buffered: true
  });
}

function observerLoad() {
  window.addEventListener("pageShow", function (event) {
    requestAnimationFrame(function () {
      // load: 页面加载完成(包括所有资源)  DOMContentLoaded: 页面DOM加载完成(不包括图片、样式表、脚本)
      ["load", "DOMContentLoaded"].forEach(function (type) {
        var reportData = {
          type: "performance",
          subType: type,
          pageUrl: window.location.href,
          startTime: performance.now() - event.timeStamp
        };
        // 发送数据
        lazyReportBatch(reportData);
      });
    }, true);
  });
}

function observerPaint() {
  var entryHandler = function entryHandler(list) {
    var _iterator = _createForOfIteratorHelper(list.getEntries()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        if (entry.name === "first-paint") {
          observer.disconnect();
          var json = entry.toJSON();
          console.log(json);
          var reportData = _objectSpread2(_objectSpread2({}, json), {}, {
            type: "performance",
            subType: entry.name,
            pageUrl: window.location.href
          });
          // 发送数据 todo;
          lazyReportBatch(reportData);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
  // 统计和计算fp的时间
  var observer = new PerformanceObserver(entryHandler);
  // buffered: true 确保观察到所有paint事件
  observer.observe({
    type: "paint",
    buffered: true
  });
}

var originalProto = XMLHttpRequest.prototype;
var originalSend = originalProto.send;
var originalOpen = originalProto.open;
function overwriteOpenAndSend() {
  originalProto.open = function newOpen() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    this.method = args[0];
    this.url = args[1];
    originalOpen.apply(this, args);
  };
  originalProto.send = function newSend() {
    var _this = this;
    this.startTime = Date.now();
    var _onLoadend = function onLoadend() {
      _this.endTime = Date.now();
      _this.duration = _this.endTime - _this.startTime;
      var url = _this.url,
        method = _this.method,
        startTime = _this.startTime,
        endTime = _this.endTime,
        duration = _this.duration,
        status = _this.status;
      var reportData = {
        status: status,
        duration: duration,
        startTime: startTime,
        endTime: endTime,
        url: url,
        method: method.toUpperCase(),
        type: "performance",
        success: status >= 200 && status < 300,
        subType: "xhr"
      };
      // todo 发送数据
      lazyReportBatch(reportData);
      _this.removeEventListener("loadend", _onLoadend, true);
    };
    this.addEventListener("loadend", _onLoadend, true);
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    originalSend.apply(this, args);
  };
}
function xhr() {
  overwriteOpenAndSend();
}

function performance$1() {
  fetch();
  observerEntries();
  observerLCP();
  observerFCP();
  observerLoad();
  observerPaint();
  xhr();
}

function error() {
  // 捕获资源加载失败的错误： js css  img
  window.addEventListener("error", function (e) {
    var target = e.target;
    if (target.src || target.href) {
      var url = target.src || target.href;
      var reportData = {
        type: "error",
        subType: "resource",
        url: url,
        html: target.outerHTML,
        pageUrl: window.location.href,
        paths: e.path
      };
      // todo 发送错误信息
      lazyReportBatch(reportData);
    }
  }, true);
  // 捕获js错误
  window.onerror = function (msg, url, lineNo, columnNo, error) {
    var reportData = {
      type: "error",
      subType: "js",
      msg: msg,
      url: url,
      lineNo: lineNo,
      columnNo: columnNo,
      stack: error.stack,
      pageUrl: window.location.href,
      startTime: performance.now()
    };
    // todo 发送错误信息
    lazyReportBatch(reportData);
  };
  // 捕获promise错误  async await
  window.addEventListener("unhandledrejection", function (e) {
    var _e$reason;
    var reportData = {
      type: "error",
      subType: "promise",
      reason: (_e$reason = e.reason) === null || _e$reason === void 0 ? void 0 : _e$reason.stack,
      pageUrl: window.location.href,
      startTime: e.timeStamp
    };
    // todo 发送错误信息
    lazyReportBatch(reportData);
  }, true);
}

function onClick() {
  ["mousedown", "touchstart"].forEach(function (eventType) {
    window.addEventListener(eventType, throttle(function (e) {
      var target = e.target;
      console.log("click", target);
      if (target.tagName) {
        var reportData = {
          // scrollTop: document.documentElement.scrollTop,
          type: "behavior",
          subType: "click",
          target: target.tagName,
          startTime: e.timeStamp,
          innerHtml: target.innerHTML,
          outerHtml: target.outerHTML,
          width: target.offsetWidth,
          height: target.offsetHeight,
          eventType: eventType,
          path: e.path
        };
        lazyReportBatch(reportData);
      }
    }, 1000));
  });
}

function pageChange() {
  // hash histroy
  var oldUrl = "";
  window.addEventListener("hashchange", function (event) {
    console.error("hashchange", event);
    var newUrl = event.newURL;
    var reportData = {
      form: oldUrl,
      to: newUrl,
      type: "behavior",
      subType: "hashchange",
      startTime: performance.now(),
      uuid: generateUniqueId()
    };
    lazyReportBatch(reportData);
    oldUrl = newUrl;
  }, true);
  var from = "";
  window.addEventListener("popstate", function (event) {
    console.error("popstate", event);
    var to = window.location.href;
    var reportData = {
      form: from,
      to: to,
      type: "behavior",
      subType: "popstate",
      startTime: performance.now(),
      uuid: generateUniqueId()
    };
    lazyReportBatch(reportData);
    from = to;
  }, true);
}

function pv() {
  var reportData = {
    type: "behavior",
    subType: "pv",
    startTime: performance.now(),
    pageUrl: window.location.href,
    referror: document.referrer,
    uuid: generateUniqueId()
  };
  lazyReportBatch(reportData);
}

function behavior() {
  onClick(), pageChange(), pv();
}

window.__webEyeSDK__ = {
  version: "0.0.1"
};

// 针对Vue项目的错误捕获
function install(Vue, options) {
  if (__webEyeSDK__.vue) return;
  __webEyeSDK__.vue = true;
  init(options);
  var handler = Vue.config.errorHandler;
  // vue项目中 通过 Vue.config.errorHandler 捕获错误
  Vue.config.errorHandler = function (err, vm, info) {
    // todo: 上报具体的错误信息
    var reportData = {
      info: info,
      error: err.stack,
      subType: "vue",
      type: "error",
      startTime: window.performance.now(),
      pageURL: window.location.href
    };
    console.log("vue error", reportData);
    lazyReportBatch(reportData);
    if (handler) {
      handler.call(this, err, vm, info);
    }
  };
}
// 针对React项目的错误捕获
function errorBoundary(err, info, options) {
  if (__webEyeSDK__.react) return;
  __webEyeSDK__.react = true;
  init(options);
  // todo: 上报具体的错误信息
  var reportData = {
    error: err === null || err === void 0 ? void 0 : err.stack,
    info: info,
    subType: "react",
    type: "error",
    startTime: window.performance.now(),
    pageURL: window.location.href
  };
  console.log("react error", reportData);
  lazyReportBatch(reportData);
}
function report() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  lazyReportBatch(_objectSpread2(_objectSpread2({}, data), {}, {
    uuid: generateUniqueId()
  }));
}

// 针对html的错误捕获
function init(options) {
  setConfig(options);
  performance$1();
  error();
  behavior();
  if (config.autoReport) {
    autoReport(config.autoReportTime);
  }
}
var webEyeSDK = {
  install: install,
  errorBoundary: errorBoundary,
  init: init,
  performance: performance$1,
  error: error,
  behavior: behavior,
  report: report,
  clearAutoReport: clearAutoReport
};

// webEyeSDK.init({
//     appId: '10000',
//     batchSize: 50,

// })

export { webEyeSDK as default, errorBoundary, init, install, report };
//# sourceMappingURL=monitor.esm.js.map
