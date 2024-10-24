import debug from 'debug';
import * as dotenv from 'dotenv';

dotenv.config();


const log: debug.IDebugger = debug('app:config');
const config = {
    jwt: {
        secret: process.env.JWT_SECRET,
        audience: process.env.JWT_AUDIENCE,
        issuer: process.env.JWT_ISSUER,
        token_ttl: Number(process.env.JWT_TOKEN_TTL) || 3600,
        refresh_token_ttl: Number(process.env.JWT_REFRESH_TOKEN_TTL)|| 3960,
    },
    port: process.env.API_OAUTH_PORT || 3000,
    prefix: process.env.API_OAUTH_PREFIX || 'api',
    oauth_mongodb: {
        host: process.env.MONGO_OAUTH_HOST || '',
        user: process.env.MONGO_OAUTH_USER || '',
        pass: process.env.MONGO_OAUTH_PASS || '',
        port: process.env.MONGO_OAUTH_PORT || 27017,
        database: process.env.MONGO_OAUTH_DATABASE || 's1-oauth',
        authSource: process.env.MONGO_OAUTH_DB_AUTH || 'admin',
    }
};

log("config: ", config);
export default config;