/**
 * on(event, listener)：为指定事件注册一个监听器，接受一个字符串 event 和一个回调函数。
 * emit(event, [arg1], [arg2])： 按监听器的顺序执行执行每个监听器
 * addListener(event, listener)：on的同名函数（alias）
 * once(event, listener): 和on类似，但只触发一次，随后便解除事件监听
 * removeListener(event, listener)： 移除指定事件的某个监听回调
 * removeAllListeners([event])：移除指定事件的所有监听回调
 * setMaxListeners(n)：用于提高监听器的默认限制的数量。（默认10监听回调个产生警告）
 * listeners(event)： 返回指定事件的监听器数组。
 */
var EventEmitter = function() {
  this.maxListeners = 1000;
  this.events = {};
};
EventEmitter.prototype.on = function(event, listener) {
  if (!this.events[event]) {
    this.events[event] = [listener];
    return;
  }
  this.events[event].push(listener);
  if (this.events[event].length > this.maxListeners) {
    console.warn(event + "超出" + this.maxListeners + "监听");
  }
};
EventEmitter.prototype.fire = function(event) {
  var params = [].slice.call(arguments);
  params.shift();
  if (!this.events[event]) {
    return;
  }
  var originLen = this.listeners(event).length;
  for (var i = 0; i < this.events[event].length; i++) {
    this.events[event][i].apply(null, params);
    if (originLen > this.events[event].length) {
      // 解决 once执行removeListener函数的时候长度问题导致的event漏执行问题
      i--;
      originLen--;
    }
  }
};
EventEmitter.prototype.emit = function(event) {
  var params = [].slice.call(arguments);
  params.shift();
  if (!this.events[event]) {
    return;
  }
  var originLen = this.listeners(event).length;
  for (var i = 0; i < this.events[event].length; i++) {
    this.events[event][i].apply(null, params);
    if (originLen > this.events[event].length) {
      // 解决 once执行removeListener函数的时候长度问题导致的event漏执行问题
      i--;
      originLen--;
    }
  }
};
EventEmitter.prototype.addListener = function(event, listener) {
  return this.on(event, listener);
};
EventEmitter.prototype.once = function(event, listener) {
  var self = this;
  function fn() {
    var args = [].slice.call(arguments);
    listener.apply(null, args);
    self.removeListener(event, fn);
  }
  this.on(event, fn);
};
EventEmitter.prototype.removeListener = function(event, listener) {
  if (!this.events[event]) {
    return;
  }
  var index = this.events[event].indexOf(listener);
  if (index >= 0) {
    this.events[event].splice(index, 1);
  }
};
EventEmitter.prototype.removeAllListeners = function(event) {
  if (event) {
    delete this.events[event];
  } else {
    this.events = {};
  }
};
EventEmitter.prototype.setMaxListeners = function(n) {
  this.maxListeners = n;
};
EventEmitter.prototype.listeners = function(event) {
  if (this.events[event]) {
    return this.events[event];
  } else {
    return [];
  }
};

export default EventEmitter;
