import rateLimiter from "../config/upstash";
const rateLimiter=async(req,res)=>{
    try {
    const {success}=await rateLimiter.limit("my-rate-limit")
    if (!success) {
        return res.status(429).json({ error: "Rate limit exceeded" });
    }
    // Continue with the request
    } catch(error){
        console.error("Rate limiter error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export default rateLimiter; 