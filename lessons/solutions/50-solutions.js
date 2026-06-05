/* =============================================================================
 * SOLUTIONS · 50 · BINARY DATA
 * =============================================================================
 * Run:  node lessons/solutions/50-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/50-binary-data.js.
 * Problems 1–2 run in Node. Problems 3–4 are BROWSER APIs, shown as commented
 * code you can paste into index.html / DevTools.
 * ========================================================================== */

// ── 1. Uint8Array([72, 105]) → TextDecoder.decode (what word?) ───────────────
// Each number is a byte; 72 and 105 are the ASCII codes for 'H' and 'i'.
const bytes = new Uint8Array([72, 105]);
const word = new TextDecoder().decode(bytes);
console.log('1. decoded word:', word); // => Hi
// (Bonus: encode it back to prove the round-trip.)
console.log('1. re-encoded :', new TextEncoder().encode(word)); // => Uint8Array [ 72, 105 ]


// ── 2. DataView: store two Float32 in one 8-byte buffer, read them back ───────
// A Float32 is 4 bytes, so two of them fill an 8-byte buffer at offsets 0 and 4.
// Pass `true` for little-endian so writing and reading agree on byte order.
const buffer = new ArrayBuffer(8);
const view = new DataView(buffer);
view.setFloat32(0, 3.14, true);  // first value at byte 0
view.setFloat32(4, 2.71, true);  // second value at byte 4
console.log('2. read [0]:', view.getFloat32(0, true).toFixed(2)); // => 3.14
console.log('2. read [4]:', view.getFloat32(4, true).toFixed(2)); // => 2.71
// Note: Float32 has less precision than a normal JS number, hence .toFixed(2).


/* ── 3. (BROWSER) Build a CSV string, wrap in a Blob, and download it ─────────
 * Paste into DevTools on any page, or into a <script> in index.html.
 *
 *   const rows = [
 *     ['name', 'score'],
 *     ['Ana', 95],
 *     ['Bob', 88],
 *   ];
 *   const csv = rows.map((r) => r.join(',')).join('\n'); // "name,score\nAna,95\n..."
 *   const blob = new Blob([csv], { type: 'text/csv' });
 *   const url = URL.createObjectURL(blob);
 *   const a = Object.assign(document.createElement('a'),
 *                           { href: url, download: 'scores.csv' });
 *   document.body.appendChild(a);
 *   a.click();                 // triggers the browser download
 *   a.remove();
 *   URL.revokeObjectURL(url);  // free the memory once it's downloaded
 */


/* ── 4. (BROWSER) Add a file <input> and read the chosen file with .text() ────
 * In index.html add:  <input type="file" id="picker">
 * Then:
 *
 *   const picker = document.querySelector('#picker');
 *   picker.addEventListener('change', async () => {
 *     const file = picker.files[0];        // a File (Blob + name/size/type)
 *     if (!file) return;
 *     const text = await file.text();      // read the contents as a string
 *     console.log(`${file.name} (${file.size} bytes):`);
 *     console.log(text);
 *     // For binary files (images, etc.) use: const bytes = await file.arrayBuffer();
 *   });
 */
console.log('3 & 4: browser-only — see the commented solutions in this file.');
