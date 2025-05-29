import {Redis} from '@upstash/redis'
import {RateLimit } from '@upstash/redis'
import ".dotenv/config"
const rateLimit =new RateLimit({
    redis:Redis.fromEnv(),
    limiter: RateLimit.slidingWindow({
        window: 60 * 1000, // 1 minute
        max: 100, // 100 requests per window
        namespace: 'rate_limit',
    }),
})
export default rateLimit