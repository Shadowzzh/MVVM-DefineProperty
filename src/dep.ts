import type { Watcher } from './watcher';

/**
 * 订阅发布
 */
export class Dep {
  static target: Watcher | null;
  static uid = 0;

  list: Watcher[] = [];
  id = 0; // 每个 Watcher 的唯一 id

  constructor() {
    this.id = Dep.uid++;
  }

  /** 订阅 Dep.target */
  subscriptTarget() {
    Dep.target?.subscriptToDep(this);
  }

  /** 订阅 Watcher */
  subscribe(watcher: Watcher) {
    this.list.push(watcher);
  }

  /** 发布：调用所有 Watcher 的 update 方法 */
  publish() {
    this.list.forEach(function publishWatcher(event) {
      event.update();
    });
  }
}
