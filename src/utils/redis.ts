import { Redis } from "@upstash/redis";
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export const isRedisEnabled = Boolean(
  UPSTASH_REDIS_REST_TOKEN?.trim() && UPSTASH_REDIS_REST_URL?.trim(),
);

export const redis = isRedisEnabled
  ? new Redis({
      url: UPSTASH_REDIS_REST_URL,
      token: UPSTASH_REDIS_REST_TOKEN,
    })
  : null;
