import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
import express from 'express';
import { status } from 'minecraft-server-util';
import dotenv from 'dotenv';
dotenv.config();

// ---- CONFIGURACIÓN ----
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const SERVER_IP = 'tu.servidor.minecraft';
const SERVER_PORT = 25565;

// ---- INICIALIZAR DISCORD ----
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: '10' }).setToken(TOKEN);

// ---- COMANDO /status ----
const commands = [
  new SlashCommandBuilder()
    .setName('status')
    .setDescription('Verifica el estado del servidor de Minecraft')
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
      // Timeout seguro para no bloquear el bot
      const result = await Promise.race([
        status(SERVER_IP, SERVER_PORT, { timeout: 20000 }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout de Minecraft')), 15000)
        )
      ]);

      await interaction.editReply(`🟢 Servidor en línea: ${result.players.online}/${result.players.max}`);
    } catch (err) {
      console.error('❌ Error al consultar el servidor Minecraft:', err);
      await interaction.editReply('🔴 Servidor fuera de línea o sin respuesta.');
    }
  }
});

client.on('error', console.error);
client.on('shardError', console.error);

// ---- LOGIN DEL BOT ----
(async () => {
  try {
    console.log('🔹 Intentando conectar el bot...');
    await client.login(TOKEN);
    console.log(`✅ Bot conectado como ${client.user.tag}`);
  } catch (err) {
    console.error('❌ Error al iniciar sesión en Discord:', err);
  }
})();

// ---- SERVIDOR WEB ----
const app = express();

app.get('/', (req, res) => res.send('Bot activo y funcionando correctamente.'));
app.get('/health', (req, res) => {
  if (client.ws?.status === 0) {
    res.send('Bot y servidor activo ✅');
  } else {
    res.status(500).send('Bot desconectado ❌');
  }
});

// Usar siempre el puerto asignado por Render
const PORT = process.env.PORT;
if (!PORT) throw new Error('🚨 PORT no definido en el entorno de Render');

app.listen(PORT, () => console.log(`🌐 Servidor web activo en puerto ${PORT}`));

// ---- ERRORES GLOBALES ----
process.on('unhandledRejection', err => console.error('❌ Unhandled Rejection:', err));
process.on('uncaughtException', err => console.error('❌ Uncaught Exception:', err));

