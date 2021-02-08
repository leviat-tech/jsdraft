function number(parameter, arg) {
  let num = Number(arg);
  if (Number.isNaN(num)) throw new Error('Invalid number');

  if (parameter.max !== undefined && num > parameter.max) num = parameter.max;
  if (parameter.min !== undefined && num < parameter.min) num = parameter.min;

  return num;
}

export default number;
