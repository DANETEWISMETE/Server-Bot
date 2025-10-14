import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
import express from 'express';
import { status } from 'minecraft-server-util';

// ---- CONFIGURACIÓN ----
const TOKEN = 'TU_TOKEN_AQUI';
const CLIENT_ID = 'TU_CLIENT_ID_AQUI'; // lo obtienes desde el portal de Discord Developer
const GUILD_ID = 'TU_GUILD_ID_AQUI';   // tu servidor de Discord
const SERVER_IP = 'tu.servidor.minecraft'; // ejemplo: play.hypixel.net
const SERVER_PORT = 25565; // cambia si tu server usa otro puerto

// ---- INICIALIZAR DISCORD ----
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// ---- REGISTRAR SLASH COMMAND /status ----
const commands = [
  new SlashCommandBuilder()
    .setName('status')
    .setDescription('Verifica el estado del servidor de Minecraft')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('🔄 Registrando comandos de barra (/)...');
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log('✅ Comando /status registrado correctamente.');
  } catch (error) {
    console.error('❌ Error al registrar comandos:', error);
  }
})();

// ---- EVENTOS DEL BOT ----
client.once('ready', () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'status') {
    await interaction.deferReply(); // muestra "pensando..." mientras se procesa

    try {
      const result = await status(SERVER_IP, SERVER_PORT, { timeout: 5000 });
      const playersOnline = result.players.online;
      const maxPlayers = result.players.max;
      await interaction.editReply(`🟢 **Servidor en línea**\nJugadores: ${playersOnline}/${maxPlayers}`);
    } catch (error) {
      await interaction.editReply('🔴 El servidor está **fuera de línea** o no responde.');
    }
  }
});

// ---- MANTENER EL BOT ACTIVO (para Replit o Railway) ----
const app = express();
app.get('/', (req, res) => res.send('Bot activo y funcionando correctamente.'));
app.listen(3000, () => console.log('🌐 Servidor web activo en puerto 3000.'));

// ---- INICIAR BOT ----
client.login(TOKEN);
