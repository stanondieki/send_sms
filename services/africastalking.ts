// services/africastalking.ts
import { Client } from 'africastalking-ts';

const client = new Client({
    apiKey: process.env.AFRICAS_TALKING_API_KEY as string,
    username: process.env.AFRICAS_TALKING_USERNAME as string,
});

export default client;

