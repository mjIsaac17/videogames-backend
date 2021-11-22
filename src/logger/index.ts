import logger from "pino";

const getTimeStamp = (): string => {
  return new Date().toISOString();
};

const log = logger({
  transport: { target: "pino-pretty" },
  timestamp: () => `,"time":"${getTimeStamp()}"`,
});

const info = (namespace: string, message: string, object?: any) => {
  if (object) log.info(object, `[${namespace}] ${message}`);
  else log.info(`[${namespace}] ${message}`);
};

const warn = (namespace: string, message: string, object?: any) => {
  if (object) log.warn(object, `[${namespace}] ${message}`);
  else log.warn(`[${namespace}] ${message}`);
};

const error = (namespace: string, message: string, object?: any) => {
  if (object) log.error(object, `[${namespace}] ${message}`);
  else log.error(`[${namespace}] ${message}`);
};

const debug = (namespace: string, message: string, object?: any) => {
  if (object) log.debug(object, `[${namespace}] ${message}`);
  else log.debug(`[${namespace}] ${message}`);
};

export default {
  info,
  warn,
  error,
  debug,
};
