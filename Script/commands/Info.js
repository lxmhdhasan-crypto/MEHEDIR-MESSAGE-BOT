const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
const moment = require("moment-timezone");

module.exports.config = {
  name: "info",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU",
  description: "Bot information command",
  commandCategory: "For users",
  hide: true,
  usages: "",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args, Users, Threads }) {
  const { threadID } = event;

  try {
    // ================= CONFIG =================
    const { configPath } = global.client;

    delete require.cache[require.resolve(configPath)];
    const config = require(configPath);

    // ================= COMMANDS =================
    const { commands } = global.client;

    // ================= THREAD PREFIX =================
    const threadData = await Threads.getData(String(threadID));
    const threadSetting = threadData?.data || {};

    const prefix = Object.prototype.hasOwnProperty.call(
      threadSetting,
      "PREFIX"
    )
      ? threadSetting.PREFIX
      : config.PREFIX;

    // ================= UPTIME =================
    const uptime = process.uptime();

    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    // ================= USERS / GROUPS =================
    const totalUsers = global.data.allUserID.length;
    const totalThreads = global.data.allThreadID.length;

    // ================= PING =================
    const ping = Date.now() - event.timestamp;

    // ================= MESSAGE =================
    const msg = `╭⭓ ⪩ 𝐁𝐎𝐓𝐓 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 ⪨
│
├─ 🤖 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲 : ─꯭─⃝‌‌𝐌𝐞𝐡𝐞𝐝𝐢 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭
├─ ☢️ 𝗣𝗿𝗲𝗳𝗶𝘅 : ${config.PREFIX}
├─ ♻️ 𝗣𝗿𝗲𝗳𝗶𝘅 𝗕𝗼𝘅 : ${prefix}
├─ 🔶 𝗠𝗼𝗱𝘂𝗹𝗲𝘀 : ${commands.size}
├─ 🔰 𝗣𝗶𝗻𝗴 : ${ping}ms
│
╰───────⭓

╭⭓ ⪩ 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 ⪨
│
├─ 👑 𝗡𝗮𝗺𝗲 : 𝐌𝐞𝐡𝐞𝐝𝐢 𝐡𝐚𝐬𝐚𝐧
├─ 📲 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 :
│ facebook.com/100009335118902
├─ 💌 𝗠𝗲𝘀𝘀𝗲𝗻𝗴𝗲𝗿 :
│ m.me/100009335118902
├─ 📞 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 :
│ wa.me/+8801628104464
│
╰───────⭓

╭⭓ ⪩ 𝗔𝗖𝗧𝗜𝗩𝗜𝗧𝗜𝗘𝗦 ⪨
│
├─ ⏳ 𝗔𝗰𝘁𝗶𝘃𝗲 𝗧𝗶𝗺𝗲 : ${hours}h ${minutes}m ${seconds}s
├─ 📣 𝗚𝗿𝗼𝘂𝗽𝘀 : ${totalThreads}
├─ 🧿 𝗧𝗼𝘁𝗮𝗹 𝗨𝘀𝗲𝗿𝘀 : ${totalUsers}
╰───────⭓

❤️ 𝗧𝗵𝗮𝗻𝗸𝘀 𝗳𝗼𝗿 𝘂𝘀𝗶𝗻𝗴 🌺
 😍─꯭─⃝‌‌𝐌𝐞𝐡𝐞𝐝𝐢 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭😘`;

    // ================= CACHE =================
    const cacheDir = __dirname + "/cache";
    const imagePath = cacheDir + "/info.jpg";

    await fs.ensureDir(cacheDir);

    // ================= IMAGE =================
    // শুধু valid image URL রাখা হয়েছে
    const imgLinks = [
      "https://i.imgur.com/3WHqHJG.jpeg"
    ];

    const imgLink =
      imgLinks[Math.floor(Math.random() * imgLinks.length)];

    // ================= DOWNLOAD IMAGE =================
    request
      .get(imgLink)
      .on("error", (error) => {
        console.error("INFO IMAGE ERROR:", error);

        return api.sendMessage(
          msg,
          threadID
        );
      })
      .pipe(fs.createWriteStream(imagePath))
      .on("finish", () => {
        api.sendMessage(
          {
            body: msg,
            attachment: fs.createReadStream(imagePath)
          },
          threadID,
          (err) => {
            // message পাঠানোর পর cache file delete
            fs.unlink(imagePath).catch(() => {});

            if (err) {
              console.error("INFO SEND ERROR:", err);
            }
          }
        );
      })
      .on("error", (error) => {
        console.error("INFO WRITE ERROR:", error);

        return api.sendMessage(
          msg,
          threadID
        );
      });

  } catch (error) {
    console.error("INFO COMMAND ERROR:", error);

    return api.sendMessage(
      "❌ Info command চালাতে সমস্যা হয়েছে।",
      threadID
    );
  }
};
