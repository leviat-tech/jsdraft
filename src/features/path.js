import CompoundPolycurve from '../entities/compound-polycurve.js';


export default {
  name: 'path',
  parameters: [
    {
      name: 'commands',
      type: 'array',
      default: () => [],
      items: {
        type: 'command',
      },
    },
  ],
  func(sketch, commands) {
    // TODO: actually make this work
    const path = new CompoundPolycurve(commands);

    return sketch
      .create_entities(path);
  },
};
