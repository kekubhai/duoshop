import {Redis} from '@upstash/redis'
import {Ratelimit } from '@upstash/ratelimit'
import "dotenv/config.js"
const rateLimit =new Ratelimit({
    redis:Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(4, '10 s'), // 4 requests every 10 seconds
})
export default rateLimit