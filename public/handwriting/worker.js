let loadPromise = null;

function ensureLoaded(wasmUri) {
  if (!loadPromise) {
    importScripts("/handwriting/hanzi_lookup.js");
    loadPromise = fetch(wasmUri)
      .then((response) => {
        if (!response.ok) throw new Error(`WASM request failed: ${response.status}`);
        return response.arrayBuffer();
      })
      .then((bytes) => wasm_bindgen(bytes));
  }
  return loadPromise;
}

self.onmessage = async (event) => {
  const message = event.data || {};

  if (message.what === "init") {
    try {
      await ensureLoaded(message.wasmUri);
      self.postMessage({ what: "loaded" });
    } catch (error) {
      self.postMessage({ what: "error" });
    }
    return;
  }

  if (message.what === "lookup") {
    try {
      await loadPromise;
      const matches = JSON.parse(
        wasm_bindgen.lookup(message.strokes, message.limit || 8),
      );
      self.postMessage({
        what: "lookup",
        requestId: message.requestId,
        matches,
      });
    } catch (error) {
      self.postMessage({ what: "error", requestId: message.requestId });
    }
  }
};
