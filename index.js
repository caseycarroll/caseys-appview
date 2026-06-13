// test-fetch.js
const res = await fetch("https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=casey-dev.bsky.social");
const json = await res.json();
console.log(json);