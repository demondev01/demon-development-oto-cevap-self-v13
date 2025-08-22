const { Client } = require('discord.js-selfbot-v13'); 
const axios = require('axios'); 

const client = new Client({
    checkUpdate: false,
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "DIRECT_MESSAGES",
        "MESSAGE_CONTENT"
    ]
});

const myId = "SİZİN IDNİZ"; 
const WEBHOOK_URL = "BURAYA LOG WEBHOOK URL";


// Buraya Sizin Mesajınızı Yanıtladıklarında Hangi Tepkileri Vermesini İstiyorsanız Yazın
const mentionTrigger = { react: "👋" };

// Normal tetikleyiciler
const triggers = {
    // Buradaki Tetikleyiciler Opsiyoneldir Değiştirebilirsiniz
    // Buradaki "sa" Yazan Yeri Değiştirirseniz Tetikleyiciyi Değiştirmiş Olursunuz
    // Buradaki reply: "as" Yazan Kısım Tetikleyici Kullanılınca Vericeği Cevaptır 
    "sa": { reply: "as", react: "👋" },
    "selam": { reply: "aleyküm selam", react: "" },
    "merhaba": { reply: "", react: "😊" },
    "naber": { reply: "iyi senden?", react: "😎" },
    "günaydın": { reply: "sana da günaydın 🌞", react: "🌞" },
    "iyi geceler": { reply: "tatlı rüyalar 🌙", react: "🌙" },
    "bb": { reply: "görüşürüz 👋", react: "" } // react Kısımlarını Boş Bırakabilirsiniz
};

client.on('ready', () => {
    console.log(`${client.user.tag} giriş yaptı!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.id === myId) return;
    if (message.author.bot) return;

    const content = message.content.toLowerCase().trim();
    let triggerName = null;
    let trigger = null;


    if (message.mentions.has(myId)) {
        trigger = mentionTrigger;
        triggerName = "Mention";
    } else {
        for (let key in triggers) {
            if (content.startsWith(key)) { 
                trigger = triggers[key];
                triggerName = key;
                break;
            }
        }
    }

    if (!trigger) return;


    if (trigger.react) {
        try {
            await message.react(trigger.react);
        } catch (err) {
            console.error("Tepki eklenemedi:", err.message);
        }
    }


    if (trigger.reply && triggerName !== "Mention") {
        message.reply(trigger.reply).catch(err => console.error("Reply hatası:", err.message));
    }


    let location = "Bilinmeyen kanal";
    let type = "Mesaj";

    if (message.guild) {
        location = `Sunucu: **${message.guild.name}** (#${message.channel.name})`;
        type = "Sunucu Mesajı";
    } else if (message.channel.type === "DM") {
        location = `DM → Kullanıcı: **${message.author.tag}** (ID: ${message.author.id})`;
        type = "DM Mesajı";
    }

    const embed = {
        title: `${type} Tespit Edildi`,
        description: `**Tetikleyici:** ${triggerName}\n**Mesaj İçeriği:**\n\`\`\`${message.content}\`\`\`\n**Konum:** ${location}\n**Kullanıcı:** <@${message.author.id}> (${message.author.tag})`,
        color: 0x2f3136,
        thumbnail: { url: message.author.displayAvatarURL({ format: "png", size: 1024 }) },
        footer: { text: `Demon Development Auto Cevap | ${new Date().toLocaleString()}` },
        timestamp: new Date()
    };

    try {
        await axios.post(WEBHOOK_URL, { username: "AutoCevap Log", embeds: [embed] });
    } catch (err) {
        console.error("Webhook gönderilemedi:", err.message);
    }
});

client.login("SİZİN TOKENİNİZ");
