return {
  parameters: [
    { name: "length", default: 100 },
    { name: "width", default: 10 },
    { name: "left", default: { type: "cut" } },
    { name: "right", default: { type: "cut" } },
  ],

  func: function (sketch, length, width, left, right) {
    const rect = sketch.new
      .rectangle(0, 0, length, width);

    const l = sketch.new
      .segment([0, 0], [0, width]);

    const r = sketch.new
      .segment([length, 0], [length, width]);

    let assembly = sketch.new
      .add(rect);

    if (left) {
      assembly = assembly.add(l.user[left.type]('left'));
    }
    
    if (right) {
      assembly = assembly.add(r.user[right.type]('right'));
    }

    return sketch.add(assembly);
  }
}
