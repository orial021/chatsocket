import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import path from 'path'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'

import  AuthRoute  from '@routes'
import ChatRoute from '@routes'


dotenv.config()

const app = express()
const users = {}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true }))

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/auth/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'))
})

app.get('/auth/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'))
})

app.use('/auth', AuthRoute)
app.use('/chat', ChatRoute)

const server = http.createServer(app)
const io = new Server(server)

io.on('connection', (socket) => {
    console.log('un usuario se ha conectado')

    socket.on('new user', (username) => {
        users[username] = socket.id
    })

    socket.on('private message', (recipient, msg) => {
        const id = users[recipient]
        if (id) {
            io.to(id).emit('private message', msg)
        }
    })
    socket.on('disconnect', () => {
        console.log('un usuario se ha desconectado')
    })
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log(`El servidor esta escuchando en http://localhost:${PORT}`)
})
