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

// ---- VALIDACIÓN INICIAL ----
console.log('🧩 Verificando variables de entorno...');
console.log('TOKEN:', TOKEN ? '✅ Presente' : '❌ No definido');
console.log('CLIENT_ID:', CLIENT_ID ? '✅ Presente' : '❌ No definido');
console.log('GUILD_ID:', GUILD_ID ? '✅ Presente' : '❌ No definido');

// ---- INICIALIZAR DISCORD ----
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: '10' }).setToken(TOKEN);

// ---- COMANDOS ----
const commands = [
  new SlashCommandBuilder()
    .setName('status')
    .setDescription('Verifica el estado del servidor de Minecraft')
].map(cmd => cmd.toJSON());

// ---- EVENTOS ----
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
      const result = await status(SERVER_IP, SERVER_PORT, { timeout: 5000 });
      await interaction.editReply(`🟢 Servidor en línea: ${result.players.online}/${result.players.max}`);
    } catch {
      await interaction.editReply('🔴 Servidor fuera de línea o sin respuesta.');
    }
  }
});

client.on('error', err => console.error('⚠️ Error de cliente Discord:', err));
client.on('shardError', err => console.error('⚠️ Error de shard Discord:', err));

// ---- LOGIN DEL BOT ----
(async () => {
  try {
    console.log('🔹 Intentando conectar el bot...');
    if (!TOKEN) throw new Error('El TOKEN no está definido en las variables de entorno');
    await client.login(TOKEN);
    console.log(`✅ Login exitoso como ${client.user?.tag || '(desconocido)'}`);
  } catch (err) {
    console.error('❌ Error al iniciar sesión en Discord:', err);
    console.error('📦 Valor actual de TOKEN:', TOKEN ? 'Presente ✅' : 'No definido ❌');
  }
})();

// ---- SERVIDOR WEB (para Render) ----
const app = express();

app.get('/', (req, res) => res.send('Bot activo y funcionando correctamente.'));

app.get('/health', (req, res) => {
  if (client.ws?.status === 0) res.send('Bot y servidor activo ✅');
  else res.status(500).send('Bot desconectado ❌');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Servidor web activo en puerto ${PORT}`));

