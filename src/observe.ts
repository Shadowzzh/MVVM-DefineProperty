import { Dep } from './dep';

/**
 * 监听一个的对象
 * @param obj - 被监听的对象
 * @returns undefined
 */
export function observer<O extends Record<PropertyKey, any>>(obj: O) {
  // 非对象不进行监听
  if (Array.prototype.toString.call(obj) !== '[object Object]') return;

  Object.keys(obj).forEach((property) => {
    observer(obj[property]); // 递归监听对象所有属性
    defineRelative(obj, property, obj[property]);
  });
}

/**
 * 监听对象的属性变化
 * @param obj - 被监听属性的对象
 * @param property - 被监听的属性
 * @param value - 被监听对象的属性的值
 */
function defineRelative<O extends Record<PropertyKey, any>>(
  obj: O,
  property: keyof O,
  value: O[keyof O]
) {
  /** 对每一个属性的 get/set 进行 订阅/发布  */
  const dep = new Dep();

  Object.defineProperty(obj, property, {
    configurable: false,
    enumerable: true,

    get() {
      Dep.target && dep.subscriptTarget();
      return value;
    },

    set(v) {
      value = v;
      dep.publish();
    }
  });
}
