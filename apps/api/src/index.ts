import { app, connectDB } from './app';

const PORT = parseInt(process.env.PORT || '3001', 10);

const startServer = async () => {
    await connectDB();
    
    try {
        await app.listen({ port: PORT, host: '0.0.0.0' });
        app.log.info(`🚀 AetherBase API listening on port ${PORT}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

startServer();
