// ---- COMMONJS: app.cjs ----
// Run this for real:   node lessons/modules-demo/app.cjs
//
// require() runs the other file and returns its module.exports object.
const { PI, add } = require('./math.cjs'); // destructure what you need
const math = require('./math.cjs');         // or grab the whole object

console.log('PI:        ', PI);            // => 3.14159
console.log('add(2, 3): ', add(2, 3));     // => 5
console.log('whole obj: ', math);          // => { PI: 3.14159, add: [Function: add] }
