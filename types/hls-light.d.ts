// hls.js ships no types for its light entry point, which has the same API.
declare module 'hls.js/light' {
  export { default } from 'hls.js';
  export * from 'hls.js';
}
