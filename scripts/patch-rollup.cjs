/**
 * Patches rollup's native.js to fall back to @rollup/wasm-node
 * when the native binary is blocked by Windows Application Control.
 * Run automatically via npm postinstall.
 */
const fs = require('fs');
const path = require('path');

const nativeJsPath = path.join(__dirname, '..', 'node_modules', 'rollup', 'dist', 'native.js');

if (!fs.existsSync(nativeJsPath)) {
  console.log('patch-rollup: rollup/dist/native.js not found, skipping.');
  process.exit(0);
}

const content = fs.readFileSync(nativeJsPath, 'utf8');
const marker = '/* WASM_FALLBACK_PATCHED */';

if (content.includes(marker)) {
  console.log('patch-rollup: already patched, skipping.');
  process.exit(0);
}

// Replace the final export line to try native first, then fall back to WASM
const original = `const { parse, parseAsync, xxhashBase64Url, xxhashBase36, xxhashBase16 } = requireWithFriendlyError(
\texistsSync(path.join(__dirname, localName)) ? localName : \`@rollup/rollup-\${packageBase}\`
);`;

const patched = `${marker}
let parse, parseAsync, xxhashBase64Url, xxhashBase36, xxhashBase16;
try {
\tconst native = requireWithFriendlyError(
\t\texistsSync(path.join(__dirname, localName)) ? localName : \`@rollup/rollup-\${packageBase}\`
\t);
\t({ parse, parseAsync, xxhashBase64Url, xxhashBase36, xxhashBase16 } = native);
} catch (nativeError) {
\ttry {
\t\tconst wasm = require('@rollup/wasm-node/dist/native.js');
\t\t({ parse, parseAsync, xxhashBase64Url, xxhashBase36, xxhashBase16 } = wasm);
\t\tconsole.warn('rollup: native binary blocked, using @rollup/wasm-node fallback');
\t} catch {
\t\tthrow nativeError;
\t}
}`;

if (!content.includes(original)) {
  console.log('patch-rollup: native.js structure not recognized, skipping.');
  process.exit(0);
}

fs.writeFileSync(nativeJsPath, content.replace(original, patched), 'utf8');
console.log('patch-rollup: patched rollup to use WASM fallback.');
