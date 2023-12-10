import { blocking, getValueFromPath } from './utils';
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
    const self = this;

    fragment.childNodes.forEach(function compileNodeByType(node) {
      const textContent = node.textContent ?? '';

      // 是否是 {{ }} 的表达式
      const expression = textContent.match(insertionRegex)?.[1];

      if (expression) {
        // 纯文本节点
        self.compileTextNode(node, expression);
      } else if (Comple.isElementNode(node)) {
        // Element 节点
        self.compileElementNode(node);
      }
    });
  }

  /**
   *
   * @param node
   */
  compileElementNode(node: Node) {
    const self = this;

    const attributes = (node as Element).attributes; // 只有 Element 类型的 Node 有 attributes
    const attrs: Attr[] = Array.prototype.slice.call(attributes); // 借用 slice 把类数组，转换成数组。

    const keyword = {
      event: '@',
      value: ':',
      model: 'v-model'
    };

    attrs.forEach(function compleElementByAttrsType(attribute) {
      // 对事件进行处理 如 onInput
      const eventRegExp = new RegExp(`${keyword.event}(.+)`);
      const [, eventName] = attribute.name.match(eventRegExp) ?? [];

      if (eventName) {
        self.handleElementEvent(node, attribute, eventName);
      }

      // 对 Element 属性进行处理
      const bindingRegExp = new RegExp(`${keyword.value}(.+)`);
      const [, binding] = attribute.name.match(bindingRegExp) ?? [];

      if (binding) {
        self.handleElementAttr(node, attribute, binding);
      }

      // 对 v-model 处理
      const modelExp = new RegExp(`${keyword.model}`);

      if (modelExp.test(attribute.name)) {
        self.handleModel(node, attribute);
      }
    });
  }

  /** 解析纯文本的节点 */
  compileTextNode(node: Node, exp: string) {
    if (!exp) return;

    node.textContent = getValueFromPath(this.$vm.data, exp); // 初始化视图

    new Watcher(this.$vm, exp, function updateTextNodeView(value) {
      blocking();
      node.textContent = value;
    });
  }

  /** 处理 model */
  handleModel(node: Node, attribute: Attr) {
    const self = this;

    node.addEventListener('input', function onHandleElementEvent(e) {
      self.$vm.data[attribute.value] = (e.target as HTMLInputElement).value;
    });

    (node as any).value = this.$vm.data[attribute.value];

    new Watcher(self.$vm, attribute.value, function updateElementModelView(value) {
      blocking();
      (node as any).value = value;
    });
  }

  /** 处理元素的属性 */
  handleElementAttr(node: Node, attribute: Attr, binding: string) {
    (node as any)[binding] = getValueFromPath(this.$vm.data, attribute.value);

    new Watcher(this.$vm, attribute.value, function updateElementAttrView(value) {
      blocking();
      (node as any)[binding] = value;
    });
  }

  /** 事件处理 */
  handleElementEvent(node: Node, attribute: Attr, eventName: string) {
    const self = this;
    const fn = this.$vm.methods[attribute.value];

    node.addEventListener(eventName, function onHandleElementEvent(e) {
      fn?.call(self.$vm.data, e);
    });

    blocking();
  }

  /** 判断一个 childNode 是否是文字节点 */
  static isTextNode(node: ChildNode) {
    return node.nodeType === node.TEXT_NODE;
  }

  /** 判断一个 childNode 是否是元素节点 */
  static isElementNode(node: ChildNode) {
    return node.nodeType === node.ELEMENT_NODE;
  }
}
