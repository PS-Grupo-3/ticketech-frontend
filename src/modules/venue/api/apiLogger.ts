export const logger = {
  req(label: string, url: string, payload?: unknown) {    
    console.groupCollapsed(`[API] ${label}: ${url}`);
    if (payload !== undefined) console.log(payload);
    console.groupEnd();
  },

  ok(label: string, url: string, ms: number, data: any) {
    console.groupCollapsed(`[API] ${label} OK: ${url} (${ms.toFixed(1)} ms)`);
    console.log(data);
    console.groupEnd();
  },

  err(label: string, url: string, ms: number, err: any) {
    console.groupCollapsed(`[API] ${label} FAIL: ${url} (${ms.toFixed(1)} ms)`);
    console.error(err);
    if (err?.response) {
      console.log(err.response.status);
      console.log(err.response.data);
    }
    console.groupEnd();
  }
};
