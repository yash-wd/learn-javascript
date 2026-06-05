// ---- ES MODULE: app.mjs ----
// Run this for real:   node lessons/modules-demo/app.mjs
//
// The default import (multiply) needs no braces and can be named anything.
// Named imports go in { } and the names must match the exports.
import multiply, { PI, add, circleArea } from './math.mjs';
import { add as sum } from './math.mjs'; // rename on import
import * as math from './math.mjs';       // grab everything as one namespace

console.log('PI:          ', PI);              // => 3.14159
console.log('add(2, 3):   ', add(2, 3));       // => 5
console.log('sum alias:   ', sum(10, 5));      // => 15
console.log('multiply:    ', multiply(4, 5));  // => 20  (the default export)
console.log('circleArea:  ', circleArea(2));   // => 12.57
console.log('namespace:   ', math.PI, math.add(1, 1)); // => 3.14159 2
