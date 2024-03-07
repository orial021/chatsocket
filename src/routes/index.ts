import express from 'express'

import AuthRoute from './auth'
import ChatRoute from './chat'


const router = express.Router()



router.use('/', AuthRoute)
router.use('/chat', ChatRoute)



export default router