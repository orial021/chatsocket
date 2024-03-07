import express from 'express'
import { Server } from 'socket.io'
import http from 'http'

const router = express.Router()

const server = http.createServer()
const io = new Server(server)

io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado')

    socket.on('join room', (room) => {
        socket.join(room)
        console.log(`Usuario se unio a la sala ${room}`)
    })

    socket.on('chat message', (room, msg) => {
        io.to(room).emit('chat message', msg)
    })

    socket.on('leave room', (room) => {
        socket.leave(room)
        console.log(`Usuario dejo la sala ${room}`)
    })

    socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado')
    })
})

export default router