import { logger } from "./apiLogger";

export async function request(api: any, method: string, url: string, payload?: any) {
  logger.req(method, url, payload);
  const t0 = performance.now();

  try {
    const { data } = await api[method](url, payload);
    logger.ok(method, url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logger.err(method, url, performance.now() - t0, err);
    throw err;
  }
}
