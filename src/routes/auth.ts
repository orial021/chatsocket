import express from 'express'
import { registerUser, getUserByUsername } from '@DB'
import bcrypt from 'bcrypt'
import { validateUsername, generateAuthToken } from '@utils'

const router = express.Router()

router.post('/register', async (req, res) => {
    const { username, password } = req.body

    if (!validateUsername(username)) {
        return res
        .status(400)
        .send({ message: 'Nombre de usuario invalido' })
    }
    try {
        await registerUser(username, password)
        res
        .status(200)
        .send({ message: 'Registro exitoso' })
    } catch (err) {
        console.error(err)
        res
        .status(500)
        .send(err)
    }
})

router.post('/login', async (req, res) => {
    const {username, password } = req.body
    try {
        const user = await getUserByUsername(username)
        if (user && await bcrypt.compare(password, user.password)) {
            const authToken = generateAuthToken(user)
            res
            .status(200)
            .send({
                message: 'Inicio de sesion exitoso',
                authToken: authToken,
                username: username
            })
        } else {
            res
            .status(401)
            .send({ message: 'Nombre de usuario o contraseña incorrectos' })
    } 
    } catch (err) {
        console.error(err)
         res
         .status(500)
        .send(err)
    }
})
export default router