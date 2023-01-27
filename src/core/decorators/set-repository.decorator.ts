import { postgresDataSource } from "@database/connections";
import Container from "typedi"

export function SetRepository(): ClassDecorator {
    return (target) => {
        Container.set(target.name, postgresDataSource.getRepository(target));
    }
}