import range from 'lodash/range';


function getIndentLines(lines, startSelection, endSelection) {
  let start = null;
  let end = null;
  let charCount = 0;

  // Get line numbers for start and end of indentation
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    charCount += line.length + 1;
    if (!start) {
      if (startSelection < charCount) start = i;
    }

    if (!end) {
      if (endSelection < charCount) end = i;
    }

    if (start && end) break;
  }

  return { start, end };
}

function indentText(text, ss, se, indent = '  ') {
  const lines = text.split('\n');
  const { start, end } = getIndentLines(lines, ss, se);

  // Indent lines
  const r = range(start, end + 1);
  r.forEach((index) => { lines[index] = `${indent}${lines[index]}`; });
  const addedChars = r.length * indent.length;

  return {
    indented: lines.join('\n'),
    selectionStart: ss + indent.length,
    selectionEnd: se + addedChars,
  };
}

function dedentText(text, ss, se, chars = 2) {
  const lines = text.split('\n');
  const { start, end } = getIndentLines(lines, ss, se);

  // Dedent lines
  const r = range(start, end + 1);
  const firstLineChars = Math.min(lines[r[0]].search(/\S/), chars);
  let removedChars = 0;
  r.forEach((index) => {
    let line = lines[index];

    for (let i = 0; i < chars; i += 1) {
      if (/\s/.test(line[0])) {
        line = line.slice(1);
        removedChars += 1;
      } else {
        break;
      }
    }

    lines[index] = line;
  });

  return {
    dedented: lines.join('\n'),
    selectionStart: ss - firstLineChars,
    selectionEnd: se - removedChars,
  };
}

function comment(text, ss, se, char = '#') {
  const lines = text.split('\n');
  const { start, end } = getIndentLines(lines, ss, se);

  // Range of line indexes to be commented/uncommented
  const r = range(start, end + 1);

  const commentRe = /(^\s*)#(\s?)/;
  const noCommentRe = /(^\s*)/;

  // Find least-indented line among lines to be commented
  let lIndex = r[0];
  let i = lines[r[0]].search(/\S/);
  r.slice(1).forEach((index) => {
    const line = lines[index];
    const nonWhitespaceCharIndex = line.search(/\S/);
    if (nonWhitespaceCharIndex < i) {
      lIndex = index;
      i = nonWhitespaceCharIndex;
    }
  });

  // Should we be commenting or uncommenting?
  const commentMatch = lines[lIndex].match(commentRe);
  const noCommentMatch = lines[lIndex].match(noCommentRe);

  const firstLineDelta = commentMatch
    ? -(commentMatch[2].length + char.length)
    : char.length + 1;
  let charDelta = 0;

  // Update each line
  r.forEach((index) => {
    let line = lines[index];

    if (!commentMatch) {
      line = `${line.slice(0, noCommentMatch[0].length) + char} ${line.slice(noCommentMatch[0].length)}`;
      charDelta += char.length + 1;
    } else {
      const match = line.match(commentRe);
      charDelta -= match[2].length + char.length;
      line = line.replace(commentRe, '$1');
    }

    lines[index] = line;
  });

  return {
    commented: lines.join('\n'),
    selectionStart: ss + firstLineDelta,
    selectionEnd: se + charDelta,
  };
}

export { indentText, dedentText, comment };
