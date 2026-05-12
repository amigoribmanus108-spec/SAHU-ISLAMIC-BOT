const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "pair",
    version: "1.0",
    author: "SOHAN AHMED",
    countDown: 5,
    role: 0,
    shortDescription: "Random pair",
    longDescription: "Generate a couple banner with random group member",
    category: "banner",
    guide: {
      en: "{pn}"
    }
  }
};

module.exports.onStart = async function ({ message, event, api }) {
  const { senderID, threadID } = event;

  try {
    const threadInfo = await api.getThreadInfo(threadID);

    const members = threadInfo.participantIDs.filter(
      id => id !== senderID && id !== api.getCurrentUserID()
    );

    if (!members.length) {
      return message.reply("No available members to pair.");
    }

    const targetID =
      members[Math.floor(Math.random() * members.length)];

    const apiList = await axios.get(
      "https://raw.githubusercontent.com/shahadat-sahu/SAHU-API/refs/heads/main/SAHU-API.json"
    );

    const AVATAR_CANVAS_API = apiList.data.AvatarCanvas;

    const res = await axios.post(
      `${AVATAR_CANVAS_API}/api`,
      {
        cmd: "pair",
        senderID,
        targetID
      },
      {
        responseType: "arraybuffer",
        timeout: 30000
      }
    );

    const tmpDir = path.join(__dirname, "tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    const imgPath = path.join(
      tmpDir,
      `pair_${senderID}_${targetID}.png`
    );

    fs.writeFileSync(imgPath, res.data);

    return message.reply(
      {
        body: "~পারফেক্ট জুটি তোমাদের জন্য শুভকামনা রইল 🫶",
        attachment: fs.createReadStream(imgPath)
      },
      () => fs.unlinkSync(imgPath)
    );

  } catch (err) {
    return message.reply("API Error Call Boss SAHU");
  }
};
