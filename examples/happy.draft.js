module.exports = function happy(c, color) {
  c.include(__dirname, 'face.draft.js');
  
  return c.face(color, happy);
};
