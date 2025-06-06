import { configDotenv} from 'dotenv';
import {neon} from "@neondatabase/serverless";
 
import { DatabaseSync } from "node:sqlite";
configDotenv();
const PORT=process.env.PORT || 5001;
const BASE_URL=process.env.BASE_URL || `http://localhost:${PORT}`;
const DATABASE_URL=process.env.DATABASE_URL
export const sql=neon(DATABASE_URL)