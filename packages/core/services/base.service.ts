import { BaseEntity } from 'core/entities';
import { HttpException } from 'core/exceptions';
import { CommonSearchQuery } from 'core/interfaces';
import { PaginationResponse } from 'core/interfaces/pagination/pagination-options.interface';
import {
  Repository,
  FindOptionsWhere,
  DeepPartial,
  SelectQueryBuilder,
} from 'typeorm';

export class BaseService<K extends BaseEntity> {
  protected readonly repository: Repository<K>;
  protected readonly filterColumns: string[] = [];

  findAll(): Promise<K[]> {
    return this.repository.find();
  }

  findOne(
    where: FindOptionsWhere<K>,
    relations: string[] = []
  ): Promise<K | null> {
    return this.repository.findOne({
      where: {
        ...where,
      },
      relations,
    });
  }

  create(payload: DeepPartial<K>): Promise<K> {
    const newEntity = this.repository.create(payload);
    return this.repository.save(newEntity);
  }

  async update(id: number, payload: DeepPartial<K>): Promise<K> {
    const entity = await this.repository.findOne({
      where: {
        id: <any>id,
      },
    });
    if (!entity) {
      throw new HttpException(400, 'User not found', 'NotFoundException', true);
    }
    return this.repository.save({
      ...entity,
      ...payload,
    });
  }

  async delete(id: number): Promise<K> {
    const entity = await this.repository.findOne({
      where: {
        id: <any>id,
      },
    });
    if (!entity) {
      throw new HttpException(400, 'User not found', 'NotFoundException', true);
    }
    return this.repository.remove(entity);
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
    if (filter.keywords && this.filterColumns.length > 0) {
      for (const column of this.filterColumns) {
        qb.orWhere(`"table"."${column}" like :keyword`, {
          keyword: `%${filter.keywords}%`,
        });
      }
    }

    if (typeof filter.active === 'boolean') {
      qb.andWhere(`"table"."status" is true`);
    } else if (Array.isArray(filter.active)) {
      const [column, value] = filter.active;
      qb.andWhere(`"table"."${column}" = :active`, { active: value });
    }
  }
}
