import { ValidationBuilder } from "@core/utils/validation-builder.util";
import { ValidatorWithStaticProps } from "@core/validators";
import { ValidationChain } from "express-validator";
import { UniqueEmailValidator } from "./customs";
import { GenderValidator } from "./customs/gender.validator";

export class CreateUserValidator implements ValidatorWithStaticProps<typeof CreateUserValidator> {
    static get rules(): Record<string, ValidationChain[]> {
        return {
            email: ValidationBuilder.ForField("email")
                .Required({ fieldDisplayName: "email" })
                .IsEmail({ fieldDisplayName: "Email" })
                .Custom(UniqueEmailValidator)
                .build(),
            password: ValidationBuilder.ForField("password").MinCharacters(8, { fieldDisplayName: "password" }).build(),
            gender: ValidationBuilder.ForField("gender").Custom(GenderValidator).build()
        };
    }
}
