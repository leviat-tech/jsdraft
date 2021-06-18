// generate a unique id given an input
function hash(v) {
  const str = String(v);
  let h = 0;
  if (str.length === 0) return h;
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charCodeAt(i);
    h = ((h << 5) - h) + char;
    h &= h; // Convert to 32bit integer
  }
  return h;
}

module.exports = hash;
