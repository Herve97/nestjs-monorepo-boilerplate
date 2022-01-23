import { MongooseModuleOptions } from '@nestjs/mongoose';

type ConnectionModel = {
  URI: string;
};

export class DataBaseService {
  constructor(private connection: ConnectionModel) {}

  getDefaultConnection(options?: MongooseModuleOptions): MongooseModuleOptions {
    return {
      appName: 'monorepo',
      uri: this.connection.URI,
      connectTimeoutMS: 2000,
      ...options,
    };
  }
}