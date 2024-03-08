import express, { type Express } from 'express'
import path from 'path'
import { Server } from 'socket.io'
import bodyParser from 'body-parser'
import  AuthRoute  from '@routes'
import ChatRoute from '@routes'
import config from './index'

export class IServer {
    private app: Express

    constructor() {
        this.app = express()
        this.configuration()
        this.middlewares()
        this.errorReporting()
    }
    configuration() {
        this.app.set('port', config.PORT)
      }
     
      middlewares() {
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended:true }))
        this.app.use(express.static(path.join(__dirname, 'public')))
        this.app.use('/auth', AuthRoute)
        this.app.use('/chat', ChatRoute)

        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'index.html'))
        })
        this.app.get('/auth/login', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'login.html'))
        })
        
        this.app.get('/auth/register', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'register.html'))
        })
    }
    errorReporting() {
        this.app.use(async (err: any, req: any, res: any, _next: any) => {
          if (err.issues) {
            const errorMessage = err.issues.map((issue: any) => ({
              message: `${issue.path.join('.')} is ${issue.message}`,
            }))
            console.log('errorMessage :>> ', errorMessage)
            //   return res.status(400).json({ error: errorMessage[0] })
          }
          if (err instanceof ValidationError) {
            const errors: string[] = []
            for (const itemError of err.errors) {
              errors.push(itemError.message)
            }
            return res.status(400).json({ success: false, type: 'validation', message: errors })
          } else {
            console.log('err :>> ', err)
            const newErrorReporting = {
              type: 'middelware',
              data: JSON.stringify({
                request: {
                  method: req.method,
                  url: req.url,
                  headers: req.headers,
                  body: req.body,
                },
                userId: req?.auth?.id, // Asume que el usuario está en req.user
              }),
              error: JSON.stringify({
                message: err.message,
                stack: err.stack,
              }),
            }
            await modelErrorReporting.create(newErrorReporting)
            return res.status(500).send({ success: false, type: 'error', message: 'Ocurrió un error' })
          }
        })
      }
      listen() {
        this.app.listen(this.app.get('port'), () => {
          console.log(`el servidor esta escuchando en ${this.app.get('port')}`)
        })
      }
}

export let Io: Server = new Server()
const users: { [key: string]: any } = {};

Io.on('connection', (socket) => {
    console.log('un usuario se ha conectado')

    socket.on('new user', (username) => {
        users[username] = socket.id
    })
    socket.on('private message', (recipient, msg) => {
        const id = users[recipient]
        if (id) {
            Io.to(id).emit('private message', msg)
        }
    })
    socket.on('disconnect', () => {
        console.log('un usuario se ha desconectado')
    })
})
