import { Dep } from './dep';

/**
 * Watcher 类负责作为数据变化的观察者，当绑定的数据变化时执行回调函数更新视图。
 * 它通过依赖收集与数据的发布者（Dep 类）建立联系，并在数据发生变化时被通知。
 *
 * @param vm 数据上下文
 * @param expression 属性表达式，Watcher 观察的属性
 * @param callback 当观察的属性变化时，Watcher 将调用此函数进行更新
 */
export class Watcher {
  vm: Record<PropertyKey, any>; // 渲染视图的数据

  expression: string; // vm 的属性

  value: any; // 被观察的值

  ids: Set<Number> = new Set();

  callback: (value: any, oldVal: any) => any; // “更新操作” 触发的回调函数

  constructor(
    vm: Record<PropertyKey, any>,
    exp: string,
    callback: (value: any, oldVal: any) => void
  ) {
    this.vm = vm;
    this.expression = exp;
    this.callback = callback;

    this.value = this.get();
  }

  /**
   * 获取 {@link expression} 的值。
   * 此方法会触发属性的 getter，以便进行依赖收集。
   */
  get() {
    Dep.target = this;
    const value = this.vm[this.expression];
    Dep.target = null;

    return value;
  }

  /**
   * 当依赖的数据变化时，此方法被调用。
   */
  update() {
    var value = this.get(); // 取到最新值
    var oldVal = this.value;
    if (value !== oldVal) {
      this.value = value;
      this.callback.call(this.vm, value, oldVal); // 执行Compile中绑定的回调，更新视图
    }
  }

  /**
   * 将当前 Watcher 实例订阅到 Dep 实例。
   * 避免了 Watcher 对同一 Dep 实例的重复订阅。
   *
   * @param dep 要订阅的 Dep 实例
   */
  subscriptToDep(dep: Dep) {
    if (this.ids.has(dep.id)) return;

    this.ids.add(dep.id);
    dep.subscribe(this);
  }
}
