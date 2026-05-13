module.exports.config = {
  name: "adminUpdate",
  eventType: [
    "log:thread-admins",
    "log:thread-name",
    "log:user-nickname",
    "log:thread-call",
    "log:thread-icon",
    "log:thread-color",
    "log:link-status",
    "log:magic-words",
    "log:thread-approval-mode",
    "log:thread-poll"
  ],
  version: "2.0.0",
  credits: "SOHAN AHMED",
  description: "Premium Stylish Group Update System",
  envConfig: {
    autoUnsend: false,
    sendNoti: true,
    timeToUnsend: 30
  }
};

module.exports.run = async function ({ event, api, Threads, Users }) {
  const { author, threadID, logMessageType, logMessageData } = event;
  const { setData, getData } = Threads;
  const fs = require("fs");

  const iconPath = __dirname + "/emoji.json";

  if (!fs.existsSync(iconPath)) {
    fs.writeFileSync(iconPath, JSON.stringify({}));
  }

  if (author == api.getCurrentUserID()) return;
  if (author == threadID) return;

  try {
    let dataThread = (await getData(threadID)).threadInfo;

    const sendMsg = async (msg) => {
      api.sendMessage(msg, threadID, async (err, info) => {
        if (!err && global.configModule.adminUpdate.autoUnsend == true) {
          await new Promise(resolve =>
            setTimeout(resolve, global.configModule.adminUpdate.timeToUnsend * 1000)
          );
          api.unsendMessage(info.messageID);
        }
      });
    };

    switch (logMessageType) {

      case "log:thread-admins": {
        const name = await Users.getNameUser(logMessageData.TARGET_ID);

        if (logMessageData.ADMIN_EVENT == "add_admin") {

          dataThread.adminIDs.push({
            id: logMessageData.TARGET_ID
          });

          sendMsg(
`╔════❖ ADMIN UPDATE ❖════╗
👑 নতুন এডমিন যুক্ত করা হয়েছে

👤 নাম: ${name}
🆔 UID: ${logMessageData.TARGET_ID}

━━━━━━━━━━━━━━━━━━
⚡ Powered By SOHAN AHMED
╚════════════════╝`
          );

        } else {

          dataThread.adminIDs = dataThread.adminIDs.filter(
            i => i.id != logMessageData.TARGET_ID
          );

          sendMsg(
`╔════❖ ADMIN UPDATE ❖════╗
❌ একজন এডমিন রিমুভ করা হয়েছে

👤 নাম: ${name}
🆔 UID: ${logMessageData.TARGET_ID}

━━━━━━━━━━━━━━━━━━
⚡ Powered By SOHAN AHMED
╚════════════════╝`
          );
        }

        break;
      }

      case "log:user-nickname": {

        const name = await Users.getNameUser(logMessageData.participant_id);

        dataThread.nicknames[logMessageData.participant_id] =
          logMessageData.nickname;

        sendMsg(
`╔════❖ NICKNAME UPDATE ❖════╗

👤 ইউজার: ${name}

📝 নতুন নিকনেম:
${logMessageData.nickname || "নিকনেম মুছে ফেলা হয়েছে"}

━━━━━━━━━━━━━━━━━━
⚡ SOHAN AHMED SYSTEM
╚════════════════╝`
        );

        break;
      }

      case "log:thread-name": {

        dataThread.threadName = logMessageData.name || null;

        sendMsg(
`╔════❖ GROUP NAME UPDATE ❖════╗

📛 নতুন গ্রুপ নাম:
${dataThread.threadName}

━━━━━━━━━━━━━━━━━━
👑 SOHAN AHMED
╚════════════════╝`
        );

        break;
      }

      case "log:thread-icon": {

        let preIcon = JSON.parse(fs.readFileSync(iconPath));

        dataThread.threadIcon = logMessageData.thread_icon;

        sendMsg(
`╔════❖ GROUP EMOJI UPDATE ❖════╗

🔹 পুরাতন ইমোজি:
${preIcon[threadID] || "❔"}

🔸 নতুন ইমোজি:
${logMessageData.thread_icon}

━━━━━━━━━━━━━━━━━━
⚡ SOHAN AHMED
╚════════════════╝`
        );

        preIcon[threadID] = dataThread.threadIcon;

        fs.writeFileSync(iconPath, JSON.stringify(preIcon));

        break;
      }

      case "log:thread-call": {

        if (logMessageData.event == "group_call_started") {

          const name = await Users.getNameUser(logMessageData.caller_id);

          sendMsg(
`╔════❖ GROUP CALL ❖════╗

📞 গ্রুপ কল শুরু হয়েছে

👤 কল করেছেন:
${name}

━━━━━━━━━━━━━━━━━━
⚡ SOHAN AHMED
╚════════════════╝`
          );
        }

        if (logMessageData.event == "group_call_ended") {

          const d = logMessageData.call_duration;

          let h = Math.floor(d / 3600);
          let m = Math.floor((d % 3600) / 60);
          let s = d % 60;

          sendMsg(
`╔════❖ GROUP CALL END ❖════╗

☎️ গ্রুপ কল শেষ হয়েছে

⏱ সময়:
${h}h ${m}m ${s}s

━━━━━━━━━━━━━━━━━━
⚡ SOHAN AHMED
╚════════════════╝`
          );
        }

        break;
      }

      case "log:magic-words": {

        sendMsg(
`╔════❖ THEME UPDATE ❖════╗

✨ নতুন থিম:
${event.logMessageData.theme_name}

━━━━━━━━━━━━━━━━━━
⚡ SOHAN AHMED
╚════════════════╝`
        );

        break;
      }

      case "log:thread-color": {

        dataThread.threadColor = logMessageData.thread_color;

        sendMsg(
`╔════❖ GROUP COLOR UPDATE ❖════╗

🎨 গ্রুপের নতুন কালার সেট করা হয়েছে

━━━━━━━━━━━━━━━━━━
⚡ SOHAN AHMED
╚════════════════╝`
        );

        break;
      }

      case "log:thread-poll":
      case "log:thread-approval-mode": {

        sendMsg(
`╔════❖ GROUP UPDATE ❖════╗

${event.logMessageBody}

━━━━━━━━━━━━━━━━━━
⚡ SOHAN AHMED
╚════════════════╝`
        );

        break;
      }
    }

    await setData(threadID, {
      threadInfo: dataThread
    });

  } catch (e) {
    console.log(e);
  }
};
