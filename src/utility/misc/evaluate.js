// WARNING: using new Function is insecure
function evaluate(expression, scope) {
  scope = scope ?? {};
  const f = new Function(...Object.keys(scope), `return (${expression});`); // eslint-disable-line no-new-func
  return f(...Object.values(scope));
}

module.exports = evaluate;
