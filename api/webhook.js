const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

function generateOTP() {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
}

module.exports = async (req, res) => {

  const update = req.body || {};

if (!update.message) {
  return res.status(200).send("Webhook Ready");
}

  const chatId =
    update.message.chat.id;

  const text =
    update.message.text || "";

  if (text === "/start") {

    const otp =
      generateOTP();

    await redis.set(
      `otp:${otp}`,
      chatId,
      {
        ex: 300
      }
    );

    await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type":
          "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text:
`🔐 Your login code:

${otp}

Valid for 5 minutes.`
        })
      }
    );
  }

  res.status(200).send("ok");
};
