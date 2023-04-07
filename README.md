# Texpress

Texpress is a project setup for using **ExpressJS** with **Typescript**. It includes a monorepo architecture and uses turborepo for managing the codebase.

## For Complete Documentation
[View Documentation](https://sonish777.github.io/t-express/)

## Prerequisites

-   Node.js v17 or later
-   Yarn package manager
-   RabbitMQ (For Queue Management)
-   Redis (For Caching and Sessions)
-   PostgreSQL (For Database)

## Installation

To get started with Texpress, follow these steps:

1. Clone the repository:

```bash

git clone https://github.com/sonish777/t-express.git

```

2. Install the dependencies:

```bash

cd texpress
yarn install

```

3. Create configuration file `'default.json'` and copy the contents from `'default.example.json'` to the new file.

> Texpress uses [config](https://www.npmjs.com/package/config) package for managing configurations

4. Run migrations

> Note: Create a database named **`texpress`** (or the database name you have in previously created config file) in PostgreSQL.

```bash

yarn migration:run

```

5. Run Seeder

```bash

yarn seeder:run

```

6. Start the development server

```bash

yarn dev

```

## Usage

Once you have started the development server, you can access the built-in apps at the following URLs:

-   CMS: [http://localhost:8000/auth/login](http://localhost:8000/auth/login)  
     Super Admin Login Credentials:
    -   **Username:** admin@texpress.com
    -   **Password:** Test@1234
-   API: [http://localhost:8001/api-docs](http://localhost:8001/api-docs)

You can customize the apps and add your own functionality by editing the code in the `'apps'` and `'packages'` directory.

## Contributing

If you find a bug or have a feature request, please create an issue on the [GitHub repository](https://github.com/sonish777/t-express).

To contribute to Texpress, follow these steps:

1. Fork the repository.

2. Create a new branch with your changes:

3. Commit your changes:

4. Push your changes to your fork:

5. Open a pull request on the main repository.
