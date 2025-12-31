import pino from "pino";

let instance;

export function getLogger(config) {
  if (!instance) {
    instance = pino({
      level: config.logLevel ?? "info",
    });
  }
  return instance;
}
