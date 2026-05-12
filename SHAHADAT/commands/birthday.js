module.exports.config = {
    name: "birthday",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "MiraBot",
    description: "জন্মদিন কবে, কি বারে, কতদিন বাকি দেখো + মেনশন করে",
    commandCategory: "utility",
    usages: "[DD/MM] বা [DD/MM/YYYY]",
    cooldowns: 3,
    dependencies: {
        "moment-timezone": ""
    }
};

module.exports.run = async function({ api, event, args, Users }) {
    const { threadID, senderID, messageID } = event;
    const moment = require("moment-timezone");

    if (args.length == 0) {
        return api.sendMessage(
            "ডেট দাও।\nব্যবহার: /birthday 15/08\nবা: /birthday 15/08/2000",
            threadID, messageID
        );
    }

    const input = args[0];
    const regex = /^(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?$/;

    if (!regex.test(input)) {
        return api.sendMessage("❌ ডেট ভুল। সঠিক ফরম্যাট: 15/08 বা 15/08/2000", threadID, messageID);
    }

    const [, day, month, year] = input.match(regex);
    const currentYear = moment.tz("Asia/Dhaka").year();
    const birthYear = year? parseInt(year) : null;

    // ডেট ভ্যালিড কিনা চেক
    const checkDate = moment(`${currentYear}-${month}-${day}`, "YYYY-M-D", true);
    if (!checkDate.isValid()) {
        return api.sendMessage("❌ এই তারিখটা ভুল। যেমন: 31/02 বললে হবে না", threadID, messageID);
    }

    // এই বছরের জন্মদিন
    let nextBirthday = moment.tz(`${currentYear}-${month}-${day}`, "YYYY-M-D", "Asia/Dhaka");

    // যদি এই বছরেরটা চলে যায় তাহলে সামনের বছর
    if (nextBirthday.isBefore(moment.tz("Asia/Dhaka"), 'day')) {
        nextBirthday = nextBirthday.add(1, 'year');
    }

    const dayName = nextBirthday.format('dddd');
    const daysLeft = nextBirthday.diff(moment.tz("Asia/Dhaka"), 'days');

    // বাংলা বার + মাস
    const banglaDays = {
        'Sunday': 'রবিবার', 'Monday': 'সোমবার', 'Tuesday': 'মঙ্গলবার',
        'Wednesday': 'বুধবার', 'Thursday': 'বৃহস্পতিবার',
        'Friday': 'শুক্রবার', 'Saturday': 'শনিবার'
    };

    const banglaMonths = {
        'January': 'জানুয়ারি', 'February': 'ফেব্রুয়ারি', 'March': 'মার্চ',
        'April': 'এপ্রিল', 'May': 'মে', 'June': 'জুন', 'July': 'জুলাই',
        'August': 'আগস্ট', 'September': 'সেপ্টেম্বর', 'October': 'অক্টোবর',
        'November': 'নভেম্বর', 'December': 'ডিসেম্বর'
    };

    let banglaDate = nextBirthday.format('DD MMMM YYYY');
    for (const [eng, ban] of Object.entries(banglaMonths)) {
        banglaDate = banglaDate.replace(eng, ban);
    }

    // ইউজারের নাম
    let name;
    try {
        name = await Users.getNameUser(senderID);
    } catch {
        name = "বন্ধু";
    }

    // মেসেজ বানানো
    let msg = `🎂 @${name} এর জন্মদিনের হিসাব:\n\n`;
    msg += `📅 তারিখ: ${banglaDate}\n`;
    msg += `📆 বার: ${banglaDays[dayName]}\n`;

    if (daysLeft === 0) {
        msg += `🎉 আজকেই জন্মদিন! Happy Birthday 🎂🎈`;
    } else if (daysLeft === 1) {
        msg += `⏰ আর মাত্র ১ দিন বাকি!`;
    } else {
        msg += `⏰ আর ${daysLeft} দিন বাকি`;
    }

    if (birthYear) {
        const age = nextBirthday.year() - birthYear;
        msg += `\n🎈 ${age} বছরে পা দিবা`;
    }

    return api.sendMessage({
        body: msg,
        mentions: [{ tag: name, id: senderID }]
    }, threadID, messageID);
};
