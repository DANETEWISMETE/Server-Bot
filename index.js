import express from 'express';

const app = express();
const PORT = process.env.PORT || 10000;

// Endpoint principal
app.get('/', (req, res) => res.send('🌐 Bot activo y funcionando correctamente.'));

// Health check
app.get('/health', (req, res) => {
  if (botReady && client.isReady()) {
    res.send('✅ Bot conectado a Discord y operativo.');
  } else {
    res.status(500).send('❌ Bot desconectado o no listo.');
  }
});

app.listen(PORT, () => console.log(`🌐 Servidor web activo en puerto ${PORT}`));
