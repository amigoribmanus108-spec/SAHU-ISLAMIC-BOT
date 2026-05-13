module.exports.config = {
  name: "joinNoti",
  eventType: ["log:subscribe"],
  version: "2.0.0",
  credits: "SOHAN AHMED",
  description: "Premium Stylish Join Notification",
  dependencies: {
    "fs-extra": "",
    "path": "",
    "pidusage": ""
  }
};

module.exports.onLoad = function () {
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { join } = global.nodemodule["path"];

  const dir = join(__dirname, "SOHAN");

  if (!existsSync(dir)) mkdirSync(dir);

  const gifFolder = join(dir, "joinGif");

  if (!existsSync(gifFolder)) mkdirSync(gifFolder);
};

module.exports.run = async function ({ api, event }) {

  const { join } = global.nodemodule["path"];
  const {
    createReadStream,
    existsSync,
    readdirSync
  } = global.nodemodule["fs-extra"];

  const threadID = event.threadID;

  const added = event.logMessageData.addedParticipants || [];

  const botAdded = added.find(
    i => i.userFbId == api.getCurrentUserID()
  );

  // BOT ADDED
  if (botAdded) {

    api.changeNickname(
      `[ ${global.config.PREFIX} ] • ${global.config.BOTNAME || "SOHAN BOT"}`,
      threadID,
      api.getCurrentUserID()
    );

    return api.sendMessage({
      body:
`╔════❖ ASSALAMUALAIKUM ❖════╗

🤖 আমাকে গ্রুপে এড করার জন্য ধন্যবাদ

✨ আমি এখন থেকে আপনাদের সার্ভিস দিবো ইনশাআল্লাহ

📌 COMMAND LIST

➤ ${global.config.PREFIX}help
➤ ${global.config.PREFIX}admin
➤ ${global.config.PREFIX}info

━━━━━━━━━━━━━━━━━━
👑 OWNER : SOHAN AHMED
⚡ PREMIUM BOT SYSTEM
╚════════════════╝`
    }, threadID);
  }

  try {

    let {
      threadName,
      participantIDs
    } = await api.getThreadInfo(threadID);

    const threadData =
      global.data.threadData.get(parseInt(threadID)) || {};

    const gifFolder = join(__dirname, "SOHAN", "joinGif");

    let mentions = [];
    let nameArray = [];
    let memLength = [];
    let i = 0;

    for (let user of added) {

      const userName = user.fullName;

      nameArray.push(userName);

      mentions.push({
        tag: userName,
        id: user.userFbId
      });

      memLength.push(participantIDs.length - i++);
    }

    memLength.sort((a, b) => a - b);

    let msg =
typeof threadData.customJoin == "undefined"
? `╔════❖ WELCOME TO GROUP ❖════╗

🌸 আসসালামু আলাইকুম 🌸

👤 নতুন মেম্বার:
➤ {name}

🏡 গ্রুপ:
➤ {threadName}

🎉 আপনি এই গ্রুপের
➤ {soThanhVien} নং সদস্য

💖 আশা করি সবাইকে সাথে নিয়ে
ভালো সময় কাটাবেন

━━━━━━━━━━━━━━━━━━
👑 OWNER : SOHAN AHMED
⚡ PREMIUM JOIN SYSTEM
╚════════════════╝`
: threadData.customJoin;

    msg = msg
      .replace(/\{name}/g, nameArray.join(", "))
      .replace(/\{soThanhVien}/g, memLength.join(", "))
      .replace(/\{threadName}/g, threadName);

    const files = existsSync(gifFolder)
      ? readdirSync(gifFolder)
      : [];

    let formPush = {
      body: msg,
      mentions
    };

    if (files.length > 0) {

      const randomFile =
        files[Math.floor(Math.random() * files.length)];

      const filePath = join(gifFolder, randomFile);

      formPush.attachment = createReadStream(filePath);
    }

    return api.sendMessage(formPush, threadID);

  } catch (e) {
    console.log(e);
  }
};
