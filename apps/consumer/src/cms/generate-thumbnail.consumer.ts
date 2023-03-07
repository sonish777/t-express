import { ConsumeMessage } from 'amqplib';
import { GetRepository } from 'core/entities';
import { readFileSync } from 'fs';
import path from 'path';
import { Consume, Consumer } from 'rabbitmq';
import { QueueConfig } from 'shared/configs';
import { UserEntity } from 'shared/entities';
import sharp from 'sharp';
import { Repository } from 'typeorm';
import { Log } from '../logger';

export class ThumbnailGenerator extends Consumer {
    @GetRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>;

    @Consume(
        QueueConfig.Cms.Exchange,
        QueueConfig.Shared.GenerateThumbnailQueue
    )
    @Log('Generate Thumbnail')
    async generateThumbnail(message: ConsumeMessage) {
        const payload: {
            uploadedFiles: Record<string, Express.Multer.File[]>;
            uploadThumbnailMap: [string, string][];
            module: string;
        } = JSON.parse(message.content.toString());

        await Promise.all(
            payload.uploadThumbnailMap.map((mapper) => {
                const [uploadColumn, thumbnailColumn] = mapper;
                if (payload.uploadedFiles[uploadColumn]) {
                    const file = payload.uploadedFiles[uploadColumn][0];
                    const fileContent = readFileSync(
                        path.join(__dirname, '../../../texpress-cms', file.path)
                    );
                    const thumbnailName = `thumb_${file.filename}`;
                    sharp(fileContent)
                        .resize(200, 200)
                        .toFormat('jpeg')
                        .jpeg({ quality: 50 })
                        .toFile(
                            path.join(
                                __dirname,
                                '../../../texpress-cms/public/uploads',
                                payload.module,
                                'thumbnails',
                                thumbnailName
                            )
                        )
                        .then((result) => console.log(result))
                        .catch(console.log);

                    return this.userRepository.update(
                        { avatar: file.filename },
                        {
                            [thumbnailColumn]: thumbnailName,
                        }
                    );
                }
            })
        );
    }
}
