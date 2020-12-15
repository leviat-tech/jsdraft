import { implement } from '../context.js';
import stroke from './stroke.js';
import line from './line.js';
import group from './group.js';
import render from './render.js';


const Context = implement(
  line,
  stroke,
  group,
  render
);

export default Context;
