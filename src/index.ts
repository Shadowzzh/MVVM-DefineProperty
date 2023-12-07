import { observer } from './observe';
import { render } from './render';

declare global {
  interface Window {
    observer: typeof observer;
    render: typeof render;
  }
}
window.observer = observer;
window.render = render;
