/**
 * 这个函数通过一个字符串路径表达式来检索嵌套对象中的值
 * @param data 数据
 * @param expression 表达式
 * @returns 值
 */
export function getValueFromPath<Data extends Record<PropertyKey, any>>(
  data: Data,
  expression: string
) {
  if (!expression) return undefined;

  const args = expression.trim().split('.');
  const value = args.reduce<any>(function getValueNested(acc, cur) {
    acc = data[cur];
    return acc;
  }, undefined);

  return value;
}

/**
 * 阻塞程序一段时间
 * @param time 阻塞时间
 */
export function blocking(time: number = 5) {
  const start = Date.now();

  while (Date.now() - start < time) {
    console.log(); // 防止被 tree shakers
  }
}
