const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

module.exports = async (req, res) => {

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false
    });
  }

  const { otp } = req.body;

  const telegramId =
    await redis.get(`otp:${otp}`);

  if (!telegramId) {

    return res.json({
      success: false
    });

  }

  await redis.del(`otp:${otp}`);

  return res.json({
    success: true,
    telegramId
  });
};
