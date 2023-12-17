import { observer } from './observe';
import { Comple } from './comple';

export class Mvvm<Data extends RecordType = RecordType> {
  vm: VM;


  constructor(options: { vm: VM<Data> }) {
    this.vm = options.vm;

    observer(this.vm.data);
    new Comple(this.vm);
  }
}

window.Mvvm = Mvvm;
