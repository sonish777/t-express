import { ConsumeMessage } from 'amqplib';
import { GetRepository } from 'core/entities';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import path from 'path';
import { Consume, Consumer } from 'rabbitmq';
import { QueueConfig } from 'shared/configs';
import { UserEntity } from 'shared/entities';
import sharp from 'sharp';
import { Repository } from 'typeorm';
import { Log } from '../../logger';
import { Service } from 'typedi';

@Service()
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
            payload.uploadThumbnailMap.map(async (mapper) => {
                const [uploadColumn, thumbnailColumn] = mapper;
                if (payload.uploadedFiles[uploadColumn]) {
                    const file = payload.uploadedFiles[uploadColumn][0];
                    const fileContent = readFileSync(path.join(file.path));
                    const thumbnailName = `thumb_${file.filename}`;
                    const destPath = path.join(
                        __dirname,
                        '../../../../texpress-cms/public/uploads',
                        payload.module,
                        'thumbnails'
                    );
                    if (!existsSync(destPath)) {
                        mkdirSync(destPath);
                    }
                    sharp(fileContent)
                        .resize(200, 200)
                        .toFormat('jpeg')
                        .jpeg({ quality: 50 })
                        .toFile(
                            path.join(
                                __dirname,
                                '../../../../texpress-cms/public/uploads',
                                payload.module,
                                'thumbnails',
                                thumbnailName
                            )
                        )
                        // .then((result) => this.logger.log('Thumbnail Generated', result))
                        .catch((err) => {
                            this.logger.error(err);
                        });

                    const user = await this.userRepository.findOne({
                        where: {
                            avatar: file.filename,
                        },
                    });
                    if (!user) {
                        return Promise.resolve(null);
                    }
                    (<any>user)[thumbnailColumn] = thumbnailName;
                    return this.userRepository.save(user);
                }
            })
        );
    }
}
