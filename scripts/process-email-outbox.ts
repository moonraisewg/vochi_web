import { processEmailOutboxOnce } from "../lib/server/email";

const result = await processEmailOutboxOnce(Number(process.argv[2] ?? 25));
console.log(JSON.stringify(result, null, 2));
