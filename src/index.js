import {setupServer} from "./server.js";
import 'dotenv/config';
import {initMongoConnection} from "./db/initMongoConnection.js";

await initMongoConnection();
setupServer();

