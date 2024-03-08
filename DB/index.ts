export * from './queries'
import { Pool } from 'pg'

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'practicas',
    password: '2354',
    port: 5432
})

export default pool