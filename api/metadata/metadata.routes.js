import express from 'express'
import { log } from '../../middlewares/logger.middleware.js'
import { getMetadata } from './metadata.controller.js'

const router = express.Router()

router.post('/fetch-metadata', log, getMetadata)

export const metadataRoutes = router
