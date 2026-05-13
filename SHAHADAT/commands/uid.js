module.exports.config = {
	name: "uid",
	version: "3.0.0",
	hasPermssion: 0,
	credits: "SOHAN AHMED",
	description: "Get UID with stylish design",
	commandCategory: "user",
	usages: "uid [tag/reply/none]",
	cooldowns: 0
};

module.exports.handleEvent = async function ({ api, event, prefix }) {
	if (!event.body) return;

	const body = event.body.trim();
	const command = body.split(" ")[0];

	const fileName = require("path").basename(__filename, ".js");

	const cmdName = command.startsWith(prefix || "")
		? command.slice((prefix || "").length)
		: command;

	if (cmdName.toLowerCase() !== fileName) return;

	return getUID(api, event);
};

module.exports.run = async function ({ api, event }) {
	return getUID(api, event);
};

async function getUID(api, event) {
	let targetID;
	let targetName = "Unknown User";

	if (event.type === "message_reply" && event.messageReply) {
		targetID = event.messageReply.senderID;
		targetName = event.messageReply.senderName || "Replied User";

	} else if (event.mentions && Object.keys(event.mentions).length > 0) {
		targetID = Object.keys(event.mentions)[0];
		targetName = event.mentions[targetID].replace("@", "");

	} else {
		targetID = event.senderID;

		try {
			const userInfo = await api.getUserInfo(targetID);
			targetName = userInfo[targetID].name;
		} catch {
			targetName = "Facebook User";
		}
	}

	const msg = `
╔══════════════════╗
        ✦ UID INFO ✦
╚══════════════════╝

👤 Name : ${targetName}

🆔 UID : ${targetID}

━━━━━━━━━━━━━━━━━━
👑 OWNER : SOHAN AHMED
⚡ FAST & STYLISH UID
━━━━━━━━━━━━━━━━━━
`;

	return api.sendMessage(msg, event.threadID, event.messageID);
}
