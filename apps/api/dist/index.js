"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const PORT = parseInt(process.env.PORT || '3001', 10);
const startServer = async () => {
    await (0, app_1.connectDB)();
    try {
        await app_1.app.listen({ port: PORT, host: '0.0.0.0' });
        app_1.app.log.info(`🚀 AetherBase API listening on port ${PORT}`);
    }
    catch (err) {
        app_1.app.log.error(err);
        process.exit(1);
    }
};
startServer();
