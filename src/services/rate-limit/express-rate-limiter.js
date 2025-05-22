import rateLimit from "express-rate-limit";

class RateLimiter {
  constructor() {
    this.limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 25, 
      message: {
        status: "fail",
        message: "Too many requests from this IP, please try again later.",
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
  }

  applyLimiter() {
    return this.limiter;
  }
}
export const rateLimiter = new RateLimiter();