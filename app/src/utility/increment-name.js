function incrementName(name, siblings) {
  const sibRx = `^${name}(\\s(?<num>[0-9]+)?)?$`;
  const siblingMatches = siblings.map((s) => s.match(sibRx));

  const copies = siblingMatches
    .filter((s) => s)
    .map((s) => (s.groups.num ? Number(s.groups.num) : 1))
    .sort();

  let copyIndex = 1;

  copies.forEach((copy) => {
    if (copy >= copyIndex) copyIndex = copy + 1;
  });

  const append = copyIndex === 1 ? '' : ` ${copyIndex}`;
  return `${name}${append}`;
}

export default incrementName;
