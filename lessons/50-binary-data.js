/* =============================================================================
 * 50 · BINARY DATA — bytes, buffers, and files
 * =============================================================================
 * Run:  node lessons/50-binary-data.js
 *       (the Blob/File/FormData parts are BROWSER APIs — shown as comments;
 *        the ArrayBuffer/TypedArray parts run in Node too.)
 *
 * WHAT YOU'LL LEARN
 *   How JavaScript handles RAW BYTES — not just strings and numbers:
 *   • ArrayBuffer — a fixed block of memory
 *   • Typed arrays (Uint8Array, Float64Array, …) — views over that memory
 *   • DataView — read/write mixed types at exact byte offsets
 *   • Blob / File — chunks of binary data in the browser
 *   • FormData — sending files and fields to a server
 *   • TextEncoder / TextDecoder — text ↔ bytes
 *   • SharedArrayBuffer + Atomics — memory shared across threads
 *
 * WHY THIS MATTERS
 *   File uploads/downloads, images, audio, WebSockets (lesson 47), streaming
 *   fetch responses, WebGL, and WebAssembly all move BYTES. Strings can't
 *   represent that efficiently — typed arrays can.
 * ========================================================================== */

// ── 1. ArrayBuffer — a raw block of memory ───────────────────────────────────
// An ArrayBuffer is just N bytes. You can't read it directly — you need a VIEW.
const buffer = new ArrayBuffer(8); // 8 bytes, all zero
console.log('buffer byteLength:', buffer.byteLength); // => 8


// ── 2. Typed arrays — views over a buffer ────────────────────────────────────
// A typed array reads the buffer's bytes as numbers of a fixed size/type.
//   Uint8Array   → 1 byte,  0..255          (the workhorse for raw bytes)
//   Int32Array   → 4 bytes, signed integers
//   Float64Array → 8 bytes, decimals (same precision as a normal JS number)
const bytes = new Uint8Array(buffer); // view the 8-byte buffer as 8 × uint8
bytes[0] = 255;
bytes[1] = 256;  // wraps! 256 doesn't fit in a byte → becomes 0
bytes[2] = 42;
console.log('uint8 view:', bytes); // => Uint8Array(8) [ 255, 0, 42, 0, 0, 0, 0, 0 ]

// Multiple views can share ONE buffer — they read the same bytes differently:
const ints = new Int32Array(buffer); // 8 bytes → two 32-bit ints
console.log('same bytes as int32:', ints); // values depend on byte order

// Typed arrays have most array methods (map/filter/reduce, lesson 13) but a
// FIXED length and a single number type — that's what makes them fast & compact.
const doubled = Uint8Array.from([1, 2, 3], (n) => n * 2);
console.log('typed map:', doubled); // => Uint8Array(3) [ 2, 4, 6 ]


// ── 3. DataView — precise, mixed-type access ─────────────────────────────────
// When a binary format packs different types at known offsets (file headers,
// network protocols), DataView reads/writes them exactly — and lets you control
// "endianness" (byte order).
const dv = new DataView(new ArrayBuffer(8));
dv.setInt16(0, 300);          // write a 16-bit int at byte 0
dv.setFloat32(2, 3.14, true); // write a 32-bit float at byte 2 (true = little-endian)
console.log('DataView int16 :', dv.getInt16(0));        // => 300
console.log('DataView f32   :', dv.getFloat32(2, true).toFixed(2)); // => 3.14


// ── 4. Text ↔ bytes (TextEncoder / TextDecoder) ──────────────────────────────
// Strings are UTF-16 in memory; on the wire/disk text is usually UTF-8 bytes.
const encoder = new TextEncoder();
const encoded = encoder.encode('Hi 👋'); // string → Uint8Array of UTF-8 bytes
console.log('encoded bytes:', encoded);   // emoji takes 4 bytes

const decoder = new TextDecoder();
console.log('decoded back:', decoder.decode(encoded)); // => Hi 👋


// ── 5. Blob & File (BROWSER) — chunks of binary data ─────────────────────────
/* A Blob is an immutable bag of bytes with a MIME type. A File is a Blob with a
 * name (what you get from <input type="file">). Both are how the browser holds
 * images, downloads, and uploads.
 *
 *   // Make a Blob and trigger a download:
 *   const blob = new Blob(['name,score\nAna,10'], { type: 'text/csv' });
 *   const url = URL.createObjectURL(blob);
 *   const a = Object.assign(document.createElement('a'),
 *                           { href: url, download: 'data.csv' });
 *   a.click();
 *   URL.revokeObjectURL(url);   // free the memory when done
 *
 *   // Read a file the user picked:
 *   input.addEventListener('change', async () => {
 *     const file = input.files[0];          // a File (Blob + name + size)
 *     const text  = await file.text();       // read as string
 *     const bytes = await file.arrayBuffer(); // read as raw bytes
 *     console.log(file.name, file.size, text);
 *   });
 */


// ── 6. FormData (BROWSER) — send files + fields to a server ───────────────────
/* FormData builds a multipart request body — the standard way to upload files
 * alongside text fields. fetch (lesson 25) sets the right headers automatically.
 *
 *   const form = new FormData();
 *   form.append('username', 'ana');
 *   form.append('avatar', fileInput.files[0]); // a File/Blob
 *   await fetch('/upload', { method: 'POST', body: form });
 *   //  ^ do NOT set Content-Type yourself — the browser adds the boundary.
 *
 *   // FormData can also read an entire <form> at once:
 *   const form2 = new FormData(document.querySelector('form'));
 *   for (const [key, value] of form2) console.log(key, value);
 */


// ── 7. Streaming binary (concept) ────────────────────────────────────────────
/* Large responses don't have to load all at once. fetch bodies are streams of
 * Uint8Array chunks — read them progressively (great for progress bars):
 *
 *   const res = await fetch('/big-file');
 *   const reader = res.body.getReader();      // a stream of byte chunks
 *   let received = 0;
 *   while (true) {
 *     const { done, value } = await reader.read(); // value = Uint8Array chunk
 *     if (done) break;
 *     received += value.length;
 *     console.log('received', received, 'bytes');
 *   }
 *  (In Node, see streams in lesson 45 — same idea, different API.)
 */


// ── 8. SharedArrayBuffer + Atomics — memory shared between threads ────────────
// A normal ArrayBuffer is copied (transferred) when sent to a Web Worker
// (lesson 46) / Node worker_thread (lesson 45). A SharedArrayBuffer is the SAME
// memory seen by BOTH threads at once — true shared state, no copying.
// (Browsers require special COOP/COEP headers to enable it, for security.)
const shared = new SharedArrayBuffer(8); // 8 bytes, shareable across threads
const sharedView = new Int32Array(shared);

// When two threads touch the same memory you get RACE CONDITIONS. `Atomics`
// provides operations that are guaranteed to complete without interruption:
Atomics.store(sharedView, 0, 100);          // safely write slot 0
Atomics.add(sharedView, 0, 5);              // atomic read-modify-write → 105
console.log('Atomics value:', Atomics.load(sharedView, 0)); // => 105

// Atomics.wait / Atomics.notify let one thread SLEEP until another signals it —
// the building block of locks and cross-thread coordination:
//   // worker:  Atomics.wait(sharedView, 0, 105);   // block while slot 0 === 105
//   // main:    Atomics.store(sharedView, 0, 0); Atomics.notify(sharedView, 0);
// ⚠️ This is advanced/rare. You only need it for high-performance parallel work
// (image/audio processing, simulations, WASM threads). For normal worker
// communication, plain postMessage (lesson 46) is simpler and safer.


/* MENTAL MODEL ---------------------------------------------------------------
 *   ArrayBuffer = the memory (bytes).   Typed array / DataView = how you READ it.
 *   SharedArrayBuffer = memory shared across threads; Atomics = safe access to it.
 *   Blob/File   = bytes + a type/name (browser).   FormData = a way to SEND them.
 *   TextEncoder/Decoder = the bridge between text and UTF-8 bytes.
 *
 *   Reach for these only when you actually handle binary: uploads, media,
 *   protocols, WebGL/WASM. For everyday data, JSON + objects (lessons 14/25)
 *   are simpler and correct.
 * --------------------------------------------------------------------------- */

/* PRACTICE -------------------------------------------------------------------
 *   1. Make a Uint8Array of [72,105] and TextDecoder.decode it (what word?).
 *   2. Use a DataView to store two Float32 values in one 8-byte buffer, read back.
 *   3. (Browser) Build a CSV string, wrap it in a Blob, and download it.
 *   4. (Browser) Add a file <input>, read the chosen file with file.text().
 * ------------------------------------------------------------------------- */
