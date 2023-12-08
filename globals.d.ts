import { Comple } from './src/comple';
import { observer } from './src/observe';

declare global {
  interface Window {
    observer: typeof observer;
    Comple: typeof Comple;
  }

  /** 空对象类型 */
  type RecordType<V extends any = any> = Record<PropertyKey, V>;

  /** 视图模型类型  */
  type VM<D extends RecordType = RecordType> = {
    data: D;
    methods: RecordType<Function>;
    root: string | Element;
  };
}
