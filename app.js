const express = require('express');
const app = express();
const timerMiddleware = require('./timer');

app.use(express.json()); 

app.use(timerMiddleware);

app.post('/api/timer', (req, res) => {

  if(req.headers['x-from-mqtt']) {
    console.log('📥 Dados recebidos da IoT:', req.body);
  }

  res.sendStatus(200); 
});

app.listen(3000, () => {
  console.log('🚀 API ouvindo na porta 3000');
});