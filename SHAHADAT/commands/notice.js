const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "notice",
  version: "2.0.0",
  hasPermssion: 2,
  credits: "SOHAN AHMED",
  description: "Send notice to all groups (Text + Media)",
  commandCategory: "Admin",
  usages: "/notice <text> or reply message",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args, Users }) {

  try {

    const allThreads = global.data.allThreadID || [];
    const senderName = await Users.getNameUser(event.senderID);

    if (!allThreads.length) {
      return api.sendMessage("❌ No thread found.", event.threadID);
    }

    const cacheFolder = path.join(__dirname, "cache");
    await fs.ensureDir(cacheFolder);

    let success = 0;
    let failed = 0;

    let messageBody = "";
    let attachments = [];

    // ===== REPLY MODE =====
    if (event.type === "message_reply") {

      const reply = event.messageReply;

      messageBody =
`╔══════════════╗
      📢 NOTICE
╚══════════════╝

👑 ADMIN: ${senderName}

📝 MESSAGE:
${reply.body || args.join(" ") || ""}

━━━━━━━━━━━━━━━━━━
🤖 BOT OWNER: SOHAN AHMED`;

      if (reply.attachments && reply.attachments.length > 0) {

        for (const file of reply.attachments) {

          try {

            const fileUrl = file.url;
            const ext = path.extname(fileUrl).split("?")[0];

            const filePath = path.join(
              cacheFolder,
              `${Date.now()}_${Math.random()}${ext}`
            );

            const response = await axios.get(fileUrl, {
              responseType: "arraybuffer"
            });

            await fs.writeFile(filePath, Buffer.from(response.data));

            attachments.push(fs.createReadStream(filePath));

          } catch (err) {
            console.log("Attachment Error:", err);
          }
        }
      }
    }

    // ===== TEXT MODE =====
    else if (args.length > 0) {

      messageBody =
`╔══════════════╗
      📢 NOTICE
╚══════════════╝

👑 ADMIN: ${senderName}

📝 MESSAGE:
${args.join(" ")}

━━━━━━━━━━━━━━━━━━
🤖 BOT OWNER: SOHAN AHMED`;
    }

    else {
      return api.sendMessage(
        "⚠️ Please enter a message or reply to a message.",
        event.threadID
      );
    }

    // ===== SEND NOTICE =====
    for (const threadID of allThreads) {

      try {

        await api.sendMessage(
          {
            body: messageBody,
            attachment: attachments
          },
          threadID
        );

        success++;

      } catch (e) {
        failed++;
      }
    }

    // ===== DELETE CACHE =====
    setTimeout(() => {

      fs.readdirSync(cacheFolder).forEach(file => {
        fs.unlinkSync(path.join(cacheFolder, file));
      });

    }, 5000);

    return api.sendMessage(
`✅ NOTICE SENT SUCCESSFULLY

📤 Sent To: ${success} Groups
❌ Failed: ${failed}

👑 OWNER: SOHAN AHMED`,
      event.threadID
    );

  } catch (error) {

    console.log(error);

    return api.sendMessage(
      "❌ Failed To Send Notice.",
      event.threadID
    );
  }
};
