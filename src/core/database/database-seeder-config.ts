import { postgresDataSource } from "@database/connections";
import { ConnectionOptions } from "typeorm-seeding";

const seederOptions: ConnectionOptions = {
    ...postgresDataSource.options,
    seeds: ["src/database/seeders/*{.ts,.js}"],
    factories: ["src/database/factories/**/*{.ts,.js}"]
};

export default seederOptions;
