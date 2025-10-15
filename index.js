// ---- IMPORTS ----
import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
import express from 'express';
import { status as statusJava } from 'minecraft-server-util';
import dotenv from 'dotenv';
dotenv.config();

// ---- CONFIGURACIÓN ----
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const SERVER_IP = 'tu.servidor.minecraft'; // 🔹 Cambia por tu dominio o IP pública
const SERVER_PORT = process.env.SERVER_PORT; // 🔹 Cambia si usas otro puerto

// ---- INICIALIZAR DISCORD ----
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: '10' }).setToken(TOKEN);

// ---- VARIABLE DE ESTADO ----
let botReady = false;

// ---- COMANDO /status ----
const commands = [
  new SlashCommandBuilder()
    .setName('status')
    .setDescription('Verifica el estado del servidor de Minecraft'),
].map(cmd => cmd.toJSON());

// ---- EVENTOS DE DISCORD ----
client.once('ready', async () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
  botReady = true;

  try {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log('✅ Comando /status registrado correctamente.');
  } catch (error) {
    console.error('❌ Error al registrar comandos:', error);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === 'status') {
    await interaction.deferReply();

    try {
      const result = await statusJava(SERVER_IP, SERVER_PORT, {
        timeout: 10000, // ⏱️ más tiempo para Render
        enableSRV: true, // ✅ resuelve SRV records
      });

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

client.on('error', err => console.error('❌ Error del cliente Discord:', err));
client.on('shardError', err => console.error('❌ Error de shard:', err));

// ---- LOGIN DEL BOT ----
(async () => {
  try {
    console.log('🔹 Intentando conectar el bot...');
    await client.login(TOKEN);
    console.log(`✅ Bot conectado como ${client.user?.tag || 'Desconocido'}`);
  } catch (err) {
    console.error('❌ Error al iniciar sesión en Discord:');
    console.error(err);
  }
})();

// ---- SERVIDOR EXPRESS ----
const app = express();

// Endpoint raíz
app.get('/', (req, res) => res.send('🌐 Bot activo y funcionando correctamente.'));

// Endpoint health mejorado
app.get('/health', (req, res) => {
  if (botReady && client.isReady()) {
    res.send('✅ Bot conectado a Discord y operativo.');
  } else {
    res.status(500).send('❌ Bot desconectado o no listo.');
  }
});

// Monitor de estado cada 60 s (útil en Render)
setInterval(() => {
  console.log(`🔎 Estado del bot: ${botReady && client.isReady() ? 'READY' : 'DESCONECTADO'}`);
}, 60000);

// ---- INICIAR SERVIDOR WEB ----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Servidor web activo en puerto ${PORT}`));
