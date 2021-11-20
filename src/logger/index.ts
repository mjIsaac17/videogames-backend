import logger from 'pino';
import dayjs from 'dayjs';

const log = logger({
    transport: { target: 'pino-pretty' },
    base: { pid: true },
    timestamp: () => `,"time":"${dayjs().format()}"`
});

export default log;