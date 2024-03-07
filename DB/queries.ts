import pool from './index'
import bcrypt from 'bcrypt'

export async function registerUser(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword])
    return result
}

export async function getUserByUsername(username: string) {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username])
    return result.rows[0]
}