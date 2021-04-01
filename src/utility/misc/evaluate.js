// WARNING: using new Function is insecure
function evaluate(expression, scope) {
  scope = scope ?? {};
  const str = expression.trim().replace(/^return\s+/, ''); // allow explicit return statement
  const f = new Function(...Object.keys(scope), `return (${str});`); // eslint-disable-line no-new-func
  return f(...Object.values(scope));
}

module.exports = evaluate;
