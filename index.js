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
const SERVER_IP = 'tu.servidor.minecraft'; // 🔹 Cambia por tu IP o dominio
const SERVER_PORT = process.env.SERVER_PORT; // 🔹 Cambia si usas otro puerto

// ---- INICIALIZAR DISCORD ----
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: '10' }).setToken(TOKEN);

// ---- COMANDOS ----
const commands = [
  new SlashCommandBuilder()
    .setName('status')
    .setDescription('Verifica el estado del servidor de Minecraft'),
].map(cmd => cmd.toJSON());

// ---- EVENTOS DE DISCORD ----
client.once('ready', async () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);

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
      const result = await statusJava(SERVER_IP, SERVER_PORT, { timeout: 5000 });
      const motd = result.motd?.clean || result.motd?.raw || 'Sin MOTD';

      await interaction.editReply(
        `🟢 **Servidor en línea**\n` +
        `📶 Jugadores: ${result.players.online}/${result.players.max}\n` +
        `💬 MOTD: ${motd}`
      );
    } catch (error) {
      console.error('❌ Error al obtener estado del servidor:', error);
      await interaction.editReply('🔴 Servidor fuera de línea o sin respuesta.');
    }
  }
});

client.on('error', err => console.error('❌ Error de cliente Discord:', err));
client.on('shardError', err => console.error('❌ Error de shard:', err));

// ---- LOGIN DEL BOT ----
(async () => {
  try {
    console.log('🔹 Intentando conectar el bot...');
    await client.login(TOKEN);
    console.log(`✅ Bot conectado como ${client.user?.tag || 'Desconocido'}`);
  } catch (err) {
    console.error('❌ Error al iniciar sesión en Discord:', err);
  }
})();

// ---- SERVIDOR WEB ----
const app = express();

// Endpoint raíz
app.get('/', (req, res) => res.send('🌐 Bot activo y funcionando correctamente.'));

// Endpoint health (ahora fiable)
app.get('/health', (req, res) => {
  if (client.isReady()) {
    res.send('✅ Bot conectado a Discord y operativo.');
  } else {
    res.status(500).send('❌ Bot desconectado o no listo.');
  }
});

// ---- MONITOR DE CONEXIÓN ----
setInterval(() => {
  console.log(`🔎 Estado del bot: ${client.isReady() ? 'READY' : 'DESCONECTADO'}`);
}, 60000);

// ---- INICIAR SERVIDOR EXPRESS ----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Servidor web activo en puerto ${PORT}`));
