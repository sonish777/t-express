import { BaseEntity } from '@core/entities';
import { CommonSearchQuery } from '@core/interfaces';
import { PaginationResponse } from '@core/interfaces/pagination/pagination-options.interface';
import {
  Repository,
  FindOptionsWhere,
  DeepPartial,
  SelectQueryBuilder,
} from 'typeorm';

export class BaseService<K extends BaseEntity> {
  protected readonly repository: Repository<K>;
  private readonly filterColumns: string[] = [];

  findAll(): Promise<K[]> {
    return this.repository.find();
  }

  findOne(where: FindOptionsWhere<K>): Promise<K | null> {
    return this.repository.findOne({
      where: {
        ...where,
      },
    });
  }

  create(payload: DeepPartial<K>): Promise<K> {
    const newEntity = this.repository.create(payload);
    return this.repository.save(newEntity);
  }

  async paginate(
    query: CommonSearchQuery = {}
  ): Promise<PaginationResponse<K>> {
    const page = Number(query.page) || 1;
    const take = Number(query.take) || 5;
    const skip = (page - 1) * take;
    const queryBuilder = await this.repository.createQueryBuilder('table');
    queryBuilder.skip(skip).take(take);
    this.filterQuery(query, queryBuilder);
    const [data, count] = await queryBuilder.getManyAndCount();
    const paginatedResponse = {
      page,
      take,
      skip,
      total: count,
      data,
      totalPages: Math.ceil(count / take),
    };
    return paginatedResponse;
  }

  private filterQuery(
    filter: Pick<CommonSearchQuery, 'active' | 'keywords'> = {},
    qb: SelectQueryBuilder<K>
  ) {
    let useAndWhereForActive = false;
    if (filter.keywords && this.filterColumns.length > 0) {
      useAndWhereForActive = true;
      for (const [idx, column] of this.filterColumns.entries()) {
        if (idx === 0) {
          qb.where(`${column} like :keyword`, { keyword: filter.keywords });
        } else {
          qb.andWhere(`${column} like :keyword`, { keyword: filter.keywords });
        }
      }
    }

    if (typeof filter.active === 'boolean') {
      qb[useAndWhereForActive ? 'andWhere' : 'where'](`table.status is true`);
    } else if (Array.isArray(filter.active)) {
      const [column, value] = filter.active;
      qb[useAndWhereForActive ? 'andWhere' : 'where'](
        `table.${column} = :active`,
        { active: value }
      );
    }
  }
}
