import type { Knex } from 'knex'
import dotenv from 'dotenv'
dotenv.config()

const config: { development: Knex.Config } = {
    development: {
        client: 'pg',
        connection: {
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        },
        migrations: {
            directory: './migrations',
            extension: 'ts',
            stub: 'knex_migrations_stub.ts' // use the correctly typed version!!
        },
        seeds: {
            directory: './seeds',
        },
    },
}

export default config
