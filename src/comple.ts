import { getValueFromPath } from './utils';
import { Watcher } from './watcher';

export class Comple {
  $el: Element;
  $fragment: DocumentFragment;
  $vm: VM;

  constructor(vm: VM) {
    const $el =
      (typeof vm.root === 'string' ? document.querySelector(vm.root) : vm.root) ?? document.body;

    this.$vm = vm;
    this.$el = $el;
    this.$fragment = this.createFragment($el);
    this.compile(this.$fragment);

    $el.appendChild(this.$fragment);
  }

  /**
   * 根据元素节点生成一个 DocumentFragment
   * @param $el 元素节点
   * @returns DocumentFragment
   */
  createFragment($el: Element) {
    const fragment = document.createDocumentFragment();
    let child: ChildNode | null = null;

    while ((child = $el.firstChild)) {
      fragment.appendChild(child);
    }

    return fragment;
  }

  /** 解析 Document 元素 */
  compile(fragment: DocumentFragment) {
    // 插入的值，如；{{ vm.value }}
    const insertionRegex = /\{\{(.+)\}\}/;

    fragment.childNodes.forEach((node) => {
      const textContent = node.textContent ?? '';

      // 是否是 {{ }} 的表达式
      const expression = textContent.match(insertionRegex)?.[1];

      if (expression) {
        // 纯文本节点
        this.compileTextNode(node, expression);
      } else if (Comple.isElementNode(node)) {
        // Element 节点
        this.compileElementNode(node);
      }
    });
  }

  compileElementNode(node: Node) {
    const $vm = this.$vm;

    const attributes = (node as Element).attributes; // 只有 Element 类型的 Node 有 attributes
    const attrs: Attr[] = Array.prototype.slice.call(attributes); // 借用 slice 把类数组，转换成数组。

    attrs.forEach((attribute) => {
      const keyword = {
        event: '@',
        value: ':'
      };

      const eventRegExp = new RegExp(`${keyword.event}(.+)`);
      const [_, eventName] = attribute.name.match(eventRegExp) ?? [];
      console.log(eventName);

      if (eventName) {
        // 事件
        console.log('event', attribute);
        const fn = $vm.methods[attribute.value];

        node.addEventListener(eventName, function onHandle(e) {
          fn?.call($vm.data, e);
        });
      }
      if (new RegExp(`${keyword.value}`).test(attribute.name)) {
        // 值
        console.log('value', attribute.value);
      }
    });
  }

  /** 解析纯文本的节点 */
  compileTextNode(node: Node, exp: string) {
    if (!exp) return;

    node.textContent = getValueFromPath(this.$vm.data, exp); // 初始化视图

    new Watcher(this.$vm, exp, (value) => {
      node.textContent = value;
    });
  }

  bind() {}

  /** 判断一个 childNode 是否是文字节点 */
  static isTextNode(node: ChildNode) {
    return node.nodeType === node.TEXT_NODE;
  }

  /** 判断一个 childNode 是否是元素节点 */
  static isElementNode(node: ChildNode) {
    return node.nodeType === node.ELEMENT_NODE;
  }
}
