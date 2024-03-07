import jwt from 'jsonwebtoken'

export function generateAuthToken(user: any) {
    const payload = {
        username: user.username,
        id: user.id
    }
    const secret = "secreto"
    const options ={
        expiresIn: '1h'
    }
    return jwt.sign(payload, secret, options)
}