const getAllowedOrigins = () => {
  const rawOrigins = process.env.CLIENT_URL || "";
  const origins = rawOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return origins.length ? origins : "*";
};

module.exports = getAllowedOrigins;