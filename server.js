import http from 'http'
import path from 'path'
import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'

const app = express()
const server = http.createServer(app)

const limiter = rateLimit({
    windowMs: 1000, // 1 second window
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many requests, please try again later.',
})

app.use(express.json())
app.use(limiter)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('public')))
} else {
    const corsOptions = {
        origin: [
            'http://127.0.0.1:3000',
            'http://localhost:3000',
            'http://127.0.0.1:5173',
            'http://localhost:5173'
        ],
        credentials: true
    }
    app.use(cors(corsOptions))
}

import { metadataRoutes } from './api/metadata/metadata.routes.js'
import { logger } from './services/logger.service.js'

// routes

app.use('/api/url', metadataRoutes)

// Make every server-side-route to match the index.html
// so when requesting http://localhost:3030/index.html/car/123 it will still respond with
// our SPA (single page app) (the index.html file) and allow vue/react-router to take it from there
app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const port = process.env.PORT || 3030
server.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})