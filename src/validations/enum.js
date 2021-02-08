function enum_type(parameter, arg) {
  const valid_values = parameter.options.map((o) => o.value);
  if (!valid_values.includes(arg)) throw new Error('Invalid enum value');
  return arg;
}

export default enum_type;
