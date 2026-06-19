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

    const userData = {
telegramId: chatId,
username: update.message.from.username || "",
firstName: update.message.from.first_name || ""
};

console.log("GENERATED OTP:", otp);
console.log("USER DATA:", userData);

await redis.set(
otp:${otp},
JSON.stringify(userData),
{
ex: 300
}
);

const testRead = await redis.get(otp:${otp});

console.log("REDIS STORED:", testRead);

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
