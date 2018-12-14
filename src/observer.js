/**
 * Created by sh on 2017/9/22.
 */

class Observer {

  /**
   * 构造类
   * @param {object} data
   */
  constructor(data) {
    this.data = data;
    this.walk(data);
  }

  walk(data) {
    var me = this;
    Object.keys(data).forEach(function (key) {
      me.convert(key, data[key]);
    });
  }

  convert(key, val) {
    this.defineReactive(this.data, key, val);
  }

  /**
   *
   * @param {object} data
   * @param {string} key
   * @param  oldval
   */
  defineReactive(data, key, oldval) {
    var dep = new Dep();
    var childObj = observe(data[key]);
    Object.defineProperty(data, key, {
      enumerable: true, // 可枚举
      configurable: false, // 不能再define
      get: function () {
        if (Dep.target) {
          dep.depend();
        }
        return oldval;
      },
      set: function (newVal) {
        if (oldval === newVal) {
          return
        }

        oldval = newVal;
        // 新的值是object的话，进行监听
        childObj = observe(newVal);
        // 通知订阅者
        dep.notify();
      }
    })
  }
}
function observe(value) {
  if (!value || typeof value !== 'object') {
    return;
  }
  return new Observer(value);
};

var uid = 0
class Dep {
  constructor() {
    this.id = uid++;
    this.subs = [];
  }

  depend() {
    Dep.target.addDep(this);
  }

  /**
   * @param sub
   */
  addSub(sub) {
    this.subs.push(sub)
  }

  removeSub(sub) {
    var index = this.subs.indexOf(sub);
    if (index != -1) {
      this.subs.splice(index, 1);
    }
  }

  notify() {
    this.subs.forEach((sub) => {
      sub.update()
    })
  }
}

module.exports = {
  observe,
  Dep,
}