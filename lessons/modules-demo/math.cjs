// ---- COMMONJS: math.cjs ----
// Node's original module system. You'll see this a lot in existing code.
const PI = 3.14159;
function add(a, b) {
  return a + b;
}

// Export an object — these become the result of require():
module.exports = { PI, add };
