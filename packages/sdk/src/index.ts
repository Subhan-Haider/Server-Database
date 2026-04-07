import axios, { AxiosInstance } from 'axios';
import { io, Socket } from 'socket.io-client';

export interface AetherConfig {
  apiKey: string;
  projectId: string;
  endpoint: string;
}

export class AetherBase {
    private client: AxiosInstance;
    private socket: Socket;
    private config: AetherConfig;

    constructor(config: AetherConfig) {
        this.config = config;
        this.client = axios.create({
            baseURL: `${config.endpoint}/api`,
            headers: {
                'x-api-key': config.apiKey
            }
        });
        
        this.socket = io(config.endpoint, {
            extraHeaders: {
                'x-api-key': config.apiKey
            }
        });
    }

    collection(name: string) {
        return new CollectionReference(this.client, this.socket, this.config.projectId, name);
    }

    setToken(token: string) {
        this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
}

class CollectionReference {
    constructor(
        private client: AxiosInstance,
        private socket: Socket,
        private projectId: string,
        private name: string
    ) {}

    async get() {
        const res = await this.client.get(`/db/${this.name}`);
        return res.data;
    }

    async add(data: any) {
        const res = await this.client.post(`/db/${this.name}`, data);
        return res.data;
    }

    doc(id: string) {
        return new DocumentReference(this.client, this.socket, this.projectId, this.name, id);
    }

    onSnapshot(callback: (data: any) => void) {
        this.socket.emit('subscribe', { projectId: this.projectId, collection: this.name });
        this.socket.on(`${this.name}:created`, (data) => callback(data));
        this.socket.on(`${this.name}:updated`, (data) => callback(data));
        this.socket.on(`${this.name}:deleted`, (data) => callback(data));

        return () => {
            this.socket.off(`${this.name}:created`);
            this.socket.off(`${this.name}:updated`);
            this.socket.off(`${this.name}:deleted`);
        };
    }
}

class DocumentReference {
    constructor(
        private client: AxiosInstance,
        private socket: Socket,
        private projectId: string,
        private collection: string,
        private id: string
    ) {}

    async get() {
        const res = await this.client.get(`/db/${this.collection}/${this.id}`);
        return res.data;
    }

    async update(data: any) {
        const res = await this.client.patch(`/db/${this.collection}/${this.id}`, data);
        return res.data;
    }

    async delete() {
        const res = await this.client.delete(`/db/${this.collection}/${this.id}`);
        return res.data;
    }

    onSnapshot(callback: (data: any) => void) {
        this.socket.emit('subscribe', { projectId: this.projectId, collection: this.collection, docId: this.id });
        this.socket.on('updated', (data) => {
            if (data._id === this.id) callback(data);
        });
        this.socket.on('deleted', (data) => {
            if (data.id === this.id) callback(null);
        });

        return () => {
            this.socket.off('updated');
            this.socket.off('deleted');
        };
    }
}
