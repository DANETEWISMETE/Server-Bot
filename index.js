// ---- IMPORTS ----
import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
import express from 'express';
import { status as statusJava } from 'minecraft-server-util';
import dotenv from 'dotenv';
dotenv.config();

// ---- CONFIGURACIÓN ----
const TOKEN     = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID  = process.env.GUILD_ID;
const SERVER_IP   = process.env.SERVER_IP   || 'tu.servidor.minecraft';
const SERVER_PORT = parseInt(process.env.SERVER_PORT, 10) || 25565;
const MAX_RETRIES = 3;
const TIMEOUT     = 10000;

// ---- INICIALIZAR DISCORD ----
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest   = new REST({ version: '10' }).setToken(TOKEN);

// ---- ESTADO DEL BOT ----
let botReady = false;

// ---- LOGS DE DEBUG ----
client.on('debug', info => console.log('🛈 Discord.js debug:', info));
client.on('warn', info => console.warn('⚠️ Warn:', info));
client.on('raw', packet => console.log('📦 RAW packet:', packet.t));
process.on('unhandledRejection', err => console.error('❌ UnhandledPromiseRejection:', err));
process.on('uncaughtException', err => console.error('❌ UncaughtException:', err));

// ---- COMANDOS ----
const commands = [
  new SlashCommandBuilder()
    .setName('status')
    .setDescription('Verifica el estado del servidor de Minecraft'),
].map(cmd => cmd.toJSON());

// ---- EVENTOS DE DISCORD ----
client.once('ready', async () => {
  console.log(`✅ Evento ready disparado: ${client.user.tag}`);
  botReady = true;

  try {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log('✅ Comando /status registrado correctamente.');
  } catch (error) {
    console.error('❌ Error al registrar comandos:', error);
  }
});

// ---- PING CON REINTENTOS ----
async function pingServer(retries = MAX_RETRIES) {
  for (let i = 0; i < retries; i++) {
    try {
      return await statusJava(SERVER_IP, SERVER_PORT, { timeout: TIMEOUT, enableSRV: true });
    } catch (err) {
      console.warn(`Intento ${i + 1} fallido para ping a Minecraft, reintentando...`);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  throw new Error('No se pudo conectar al servidor Minecraft');
}

// ---- COMANDO /status ----
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === 'status') {
    await interaction.deferReply();

    try {
      const result = await pingServer();

      const motd =
        (Array.isArray(result.motd?.clean) && result.motd.clean.join(' ')) ||
        (Array.isArray(result.motd?.raw) && result.motd.raw.join(' ')) ||
        result.motd?.clean ||
        result.motd?.raw ||
        'Sin MOTD';

      await interaction.editReply(
        `🟢 **Servidor en línea**\n` +
        `📶 Jugadores: ${result.players?.online ?? 0}/${result.players?.max ?? '?'}\n` +
        `💬 MOTD: ${motd}\n` +
        `🌍 Versión: ${result.version?.name ?? 'Desconocida'}`
      );
    } catch (error) {
      console.error('❌ Error consultando estado del servidor:', error);
      await interaction.editReply('🔴 Servidor fuera de línea o sin respuesta.');
    }
  }
});

// ---- LOGS DE ERRORES ----
client.on('error', err => console.error('💥 Error del cliente Discord:', err));
client.on('shardError', err => console.error('💥 ShardError:', err));

// ---- LOGIN DEL BOT CON RECONEXIÓN AUTOMÁTICA ----
async function loginBot() {
  try {
    console.log('🔹 Intentando conectar el bot...');
    await client.login(TOKEN);
    console.log(`✅ Bot login completado: ${client.user?.tag || 'Desconocido'}`);
  } catch (err) {
    console.error('❌ Error al iniciar sesión en Discord:');
    console.error(err.stack || err);
    // Reintento en 15 segundos
    setTimeout(loginBot, 15000);
  }
}
loginBot();

// Reconexión si no se dispara ready en 30s
setTimeout(() => {
  if (!botReady) {
    console.warn('⚠️ Bot no conectó en 30s, reintentando login...');
    loginBot();
  }
}, 30000);

// ---- SERVIDOR EXPRESS ----
const app = express();

app.get('/', (req, res) => res.send('🌐 Bot activo y funcionando correctamente.'));

app.get('/health', (req, res) => {
  if (botReady && client.isReady()) {
    res.send('✅ Bot conectado a Discord y operativo.');
  } else {
    res.status(500).send('❌ Bot desconectado o no listo.');
  }
});

// Monitor de estado cada 30 s
setInterval(() => {
  console.log(`🔎 Estado del bot: ${botReady && client.isReady() ? 'READY' : 'DESCONECTADO'}`);
}, 30000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Servidor web activo en puerto ${PORT}`));
