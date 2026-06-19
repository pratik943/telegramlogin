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

  const user =
  await redis.get(`otp:${otp}`);

if (!user) {

  return res.json({
    success: false
  });

}

await redis.del(`otp:${otp}`);

const userData =
  typeof user === "string"
  ? JSON.parse(user)
  : user;

return res.json({
  success: true,
  user: userData
});
};
