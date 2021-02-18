module.exports = function basic(sketch) {
  // sketch.node.name = 'a';
  // a = sketch;
  // b = sketch.create({name: 'b'})
  // c = sketch.create({name: 'c'})
  // d = sketch.create({name: 'd'})
  // e = sketch.create({name: 'e'})
  // f = sketch.create({name: 'f'})
  // g = sketch.create({name: 'g'})
  // h = sketch.create({name: 'h'})
  //
  //
  // a.add(b)
  //   b.add(e)
  //     e.add(g)
  //       e.add(h)
  //
  // a.add(c)
  //   b.add(f)
  //
  // a.add(d)
  //
  //
  // const result = sketch.find(s => s.node.name == 'h');
  // console.log(result)
  // return sketch;
  return sketch.new.golden(10);
};
