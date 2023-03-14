import { CMSConfigEntity } from '@cms/entities';
import { MigrationInterface, QueryRunner, Repository } from 'typeorm';

export class createCmsConfigsSeeder1678812684960 implements MigrationInterface {
    configs = [
        {
            name: 'Logo',
            slug: 'logo',
            value: 'logo.png',
            type: 'file',
        },
        {
            name: 'CMS Title',
            slug: 'cms-title',
            value: 'Texpress',
            type: 'text',
        },
    ];

    public async up(queryRunner: QueryRunner): Promise<void> {
        const cmsConfigRepository: Repository<CMSConfigEntity> =
            queryRunner.manager.getRepository(CMSConfigEntity);
        await cmsConfigRepository.save(this.configs);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `TRUNCATE TABLE public."cms_configs" RESTART IDENTITY`
        );
    }
}
