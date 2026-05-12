module.exports.config = {
 name: "birthday",
 version: "1.0.0",
 hasPermssion: 1,
 credits: "SHAHADAT SAHU",
 description: "Islamic birthday wish system",
 commandCategory: "group",
 usages: "birthday @tag or reply",
 cooldowns: 0
};

module.exports.run = async function ({ api, event, Users }) {
 try {
 let targetID;
 let name;

 if (event.messageReply) {
 targetID = event.messageReply.senderID;
 name = await Users.getNameUser(targetID);
 }
 else if (Object.keys(event.mentions).length > 0) {
 targetID = Object.keys(event.mentions)[0];
 name = event.mentions[targetID];
 }
 else {
 return api.sendMessage("Please tag or reply to someone 🤍", event.threadID, event.messageID);
 }

 const tagArray = [{ id: targetID, tag: name }];
 const send = msg => api.sendMessage({ body: msg, mentions: tagArray }, event.threadID);

 send(`🎉 শুভ জন্মদিন 🎉\n\n${name}, আল্লাহ তোমার জীবনে রহমত, বরকত ও হেদায়েত দান করুন 🤲`);

 const messages = [
 { delay: 3000, msg: `${name} 🤍\nবয়স বাড়ার সাথে সাথে তোমার তাকওয়া ও ঈমান যেন আরও মজবুত হয়, সেই দোয়া করি।` },
 { delay: 6000, msg: `🌸 প্রিয় ${name}\nনতুন বছরের প্রতিটি কদম হোক সিরাতুল মুস্তাকিমের দিকে, আল্লাহর সন্তুষ্টির পথে।` },
 { delay: 10000, msg: `🕌 ${name}\nপবিত্র কোরআনের আলোয় আলোকিত হোক তোমার আগামী দিনগুলো।` },
 { delay: 14000, msg: `🤲 ${name}\nআল্লাহ তোমার অতীতের সব গুনাহ মাফ করে দিন এবং দুনিয়া ও আখিরাতে কল্যাণ দান করুন।` },
 { delay: 18000, msg: `✨ ${name}\nরাসূল (সা.)-এর সুন্নাহ অনুযায়ী জীবন গড়ার তৌফিক দিক আল্লাহ।` },
 { delay: 22000, msg: `🌙 ${name}\nতোমার জীবনে সুখ, শান্তি আর ইবাদতের মাঝ দিয়ে কাটুক বাকিটা সময়।` },
 { delay: 26000, msg: `💖 ${name}\nআল্লাহ তোমাকে দুনিয়াতে সম্মান এবং আখিরাতে জান্নাতুল ফিরদাউস নসিব করুন।` },
 { delay: 30000, msg: `📖 ${name}\nবিপদ-আপদ থেকে আল্লাহ তোমাকে সর্বদা হেফাজতে রাখুন।` },
 { delay: 34000, msg: `🕋 ${name}\nতোমার জীবনের প্রতিটি মুহূর্ত হোক নেক কাজ ও হালাল রিজিক দিয়ে পূর্ণ।` },
 { delay: 38000, msg: `🤍 ${name}\nজন্মদিনে একটাই দোয়া—আল্লাহ তোমার সব নেক মাকসাদ ও আশা কবুল করুন।` },
 { delay: 42000, msg: `🌺 ${name}\nসর্বদা দোয়ায় রাখলাম। আল্লাহ আমাদের সবাইকে দ্বীনের ওপর অটল রাখুন। আমিন ইয়া রাব্বাল আলামিন 🤲` }
 ];

 messages.forEach(({ delay, msg }) => {
 setTimeout(() => send(msg), delay);
 });

 } catch {
 api.sendMessage("Something went wrong!", event.threadID);
 }
};      
