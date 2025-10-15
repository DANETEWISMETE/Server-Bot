// archivo: test-discord.js
import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const TOKEN = process.env.TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log(`✅ Conectado correctamente: ${client.user.tag}`);
  process.exit(0); // Sale después de confirmar ready
});

client.on('error', err => console.error('💥 Error de cliente:', err));
client.on('warn', warn => console.warn('⚠️ Warn:', warn));
client.on('debug', info => console.log('🛈 Debug:', info));

client.on('raw', packet => console.log('📦 RAW packet:', packet.t));

(async () => {
  try {
    console.log('🔹 Intentando conectar al gateway de Discord...');
    await client.login(TOKEN);
  } catch (err) {
    console.error('❌ Error al iniciar sesión en Discord:', err);
    process.exit(1);
  }
})();
