import { IServer } from './server'
import express from 'express'
import dotenv from "dotenv"

dotenv.config()

const AppConfig = {
    PORT: process.env.PORT || 3000,
}

export default Object.freeze(AppConfig)

const env = (key: any, defaultValue=null)=>{
    return process.env[key] || defaultValue;
}

export const app = express()
export const server: IServer = new IServer()

server.listen()