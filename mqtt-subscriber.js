const mqtt = require('mqtt');
const fs = require('fs');
const axios = require('axios');

const client = mqtt.connect('mqtt://test.mosquitto.org');

let isProcessing = false;

client.on('connect', () => {
    console.log('✅ Conectado ao broker MQTT');
    
    client.subscribe('monitoramento/timer'); 
  });

client.on('message', (topic, message) => {
    if (isProcessing) return;

    const payload = message.toString();
    console.log(`📥 Mensagem recebida em "${topic}": ${payload}`);

    isProcessing = true;
  
    axios.post('http://localhost:3000/api/timer', { 
        topic,
        payload,
       }, {
        headers: {
            'x-from-mqtt': 'true',
        }
       })
    .then(() => {
        console.log('Dados enviados com sucesso para a API')
        isProcessing = false;
    })
    .catch(err => {
        console.error('Erro ao enviar dados para a API:', err)
        isProcessing = false;
    });

    const logLine = `Tempo: ${payload}\n`;
    fs.appendFile('tempo_requisicao.txt', logLine, (err) => {
      if (err) console.error('Erro ao salvar dados:', err.message);
    });
  });
  

  client.on('error', (err) => {
    console.error('Erro na conexão com o broker MQTT:', err.message);
  });


module.exports = client;


