import { Watcher } from './watcher';

const $ = (query: string) => document.querySelector(query);

/** 渲染 Input  */
function renderInput(data: { inputValue: string }) {
  const $app = $('#app');
  if (!$app) return;

  function onInput(e: Event) {
    const inputElement = e.target as HTMLInputElement;
    data.inputValue = inputElement.value;
  }

  const $input = document.createElement('input');

  $input.removeEventListener('input', onInput);
  $input.addEventListener('input', onInput);

  $app.appendChild($input);
}

/** 渲染 Span  */
export function renderSpan(data: { inputValue: string }) {
  const $app = $('#app');
  if (!$app) return;

  const preSpan = document.querySelector('#span');
  preSpan && $app.removeChild(preSpan);

  const $span = document.createElement('div');

  new Watcher(data, 'inputValue', function updateSpan() {
    $span.innerHTML = `<span>${data.inputValue}</span>`;
  });

  $span.innerHTML = `<span>${data.inputValue}</span>`;
  $span.id = 'span';

  $app.appendChild($span);
}

export function render(data: { inputValue: string }) {
  const $app = $('#app');
  if (!$app) return;

  $app.innerHTML = '';

  renderInput(data);
  renderSpan(data);
}
