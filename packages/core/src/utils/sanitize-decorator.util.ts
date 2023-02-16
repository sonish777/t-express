import { plainToClass } from 'class-transformer';
import { Class } from 'core/interfaces';
import { DTOMetadataKey } from './metadata.util';

interface DTOIndexTypeMap {
    index: number;
    type: Class;
}

export const DTO: ParameterDecorator = (target, prop, paramIndex) => {
    const dtoIndices: any[] =
        Reflect.getOwnMetadata(
            DTOMetadataKey.DTO_PARAMETER_INDICES,
            target,
            prop
        ) || [];

    const dtoType: DTOIndexTypeMap[] = Reflect.getMetadata(
        'design:paramtypes',
        target,
        prop
    )[paramIndex];
    dtoIndices.push({
        index: paramIndex,
        type: dtoType,
    });
    Reflect.defineMetadata(
        DTOMetadataKey.DTO_PARAMETER_INDICES,
        dtoIndices,
        target,
        prop
    );
};

/* eslint-disable */

export const Sanitize: MethodDecorator = (
    target,
    prop,
    descriptor: PropertyDescriptor
) => {
    const originalMethod = descriptor.value;
    descriptor.value = function () {
        const dtoIndices: DTOIndexTypeMap[] =
            Reflect.getOwnMetadata(
                DTOMetadataKey.DTO_PARAMETER_INDICES,
                target,
                prop
            ) || [];

        for (const dtoIndex of dtoIndices) {
            if (arguments[dtoIndex.index]) {
                arguments[dtoIndex.index] = plainToClass(
                    dtoIndex.type,
                    arguments[dtoIndex.index],
                    { excludeExtraneousValues: true }
                );
            }
        }
        return (<Function>originalMethod)!.call(this, ...arguments);
    };
};
