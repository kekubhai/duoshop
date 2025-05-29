import ratelimit from "../config/upstash.js";
const rateLimiter=async(req,res,next)=>{
    try {
    const {success}=await ratelimit.limit("my-rate-limit")
    if (!success) {
        return res.status(429).json({ error: "Rate limit exceeded" });
    }
    // Continue with the request
    next()
    } catch(error){
        console.error("Rate limiter error:", error);
        res.status(500).json({ error: "Internal Server Error" });
        next(error)
    }
}
export default rateLimiter; 