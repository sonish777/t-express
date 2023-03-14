import { DataSource } from 'typeorm';
import { Server } from 'http';
import { bootstrap } from '../../../texpress-api/src';
import { postgresDataSource, redisConnection } from 'shared/connections';
import { RedisClientType } from 'redis';

export class AppFactory {
    constructor(
        public readonly appInstance: Server,
        public readonly dbConnection: DataSource,
        public readonly redis: RedisClientType
    ) {}

    static async new() {
        const app = bootstrap();
        while (!postgresDataSource.isInitialized) {
            await new Promise((res) => setTimeout(res, 1000));
        }
        return new AppFactory(app, postgresDataSource, redisConnection.client);
    }

    async close() {
        if (this.dbConnection) await this.dbConnection.destroy();
        if (this.redis) await teardown(this.redis);
        if (this.appInstance) this.appInstance.close();
    }

    async cleanDB() {
        if (this.dbConnection.isInitialized) {
            const entities = this.dbConnection.entityMetadatas;
            for (const entity of entities) {
                if (entity.tableName === 'email_templates') {
                    return;
                }
                const queryRunner = this.dbConnection.manager.getRepository(
                    entity.name
                );
                // delete everything from table ignoring relations
                await queryRunner.query(
                    `TRUNCATE "${entity.tableName}" RESTART IDENTITY CASCADE;`
                );
            }
        }
        await this.redis.flushAll();
    }
}

const teardown = async (redis: RedisClientType) => {
    await new Promise((resolve) => {
        redis.quit();
        redis.on('end', resolve);
    });
};
