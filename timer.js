const mqtt = require('mqtt');
const { performance } = require('perf_hooks');

const client = mqtt.connect('mqtt://test.mosquitto.org'); 

function timerMiddleware(req, res, next) {
    if (req.headers['x-from-mqtt']) {
        return next();
      }

  const start = performance.now();

  res.on('finish', () => {
    const duration = performance.now() - start;
    const log = `[${req.method}] ${req.originalUrl} - Tempo: ${duration.toFixed(3)}ms`;

    client.publish('monitoramento/timer', log);

    console.log(log);
  });

  next();
}

module.exports = timerMiddleware;
