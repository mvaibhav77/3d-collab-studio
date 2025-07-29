export const config = {
  server: {
    port: process.env.PORT || 3001,
  },
  socket: {
    cors: {
      origin:
        process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "*",
      methods: ["GET", "POST"] as string[],
    },
    throttle: {
      transformUpdateDelay: 30, // ms
      colorUpdateDelay: 30, // ms
    },
  },
};
