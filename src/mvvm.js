const { Watcher } = require('./watch');
const { Compile } = require('./compile');
const { observe } = require('./observer');
class MVVM{
  constructor(options) {
    this.$options = options || {};
    var data = this._data = this.$options.data;
    var me = this;

    // 数据代理
    // 实现 vm.xxx -> vm._data.xxx
    Object.keys(data).forEach(function (key) {
      me._proxyData(key);
    });

    this._initComputed();

    observe(data, this);

    this.$compile = new Compile(options.el || document.body, this)
  }

  $watch(key, cb, options) {
    new Watcher(this, key, cb);
  }

  _proxyData(key) {
    var me = this;
    Object.defineProperty(me, key, {
      configurable: false,
      enumerable: true,
      get: function proxyGetter() {
        return me._data[key];
      },
      set: function proxySetter(newVal) {
        me._data[key] = newVal;
      }
    });
  }

  _initComputed() {
    var me = this;
    var computed = this.$options.computed;
    if (typeof computed === 'object') {
      Object.keys(computed).forEach(function (key) {
        Object.defineProperty(me, key, {
          get: typeof computed[key] === 'function'
            ? computed[key]
            : computed[key].get,
          set: function () {
          }
        });
      });
    }
  }
}

module.exports = {
  MVVM,
};