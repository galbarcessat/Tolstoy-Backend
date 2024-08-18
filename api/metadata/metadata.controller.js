import { metadataService } from './metadata.service.js'
import { logger } from '../../services/logger.service.js'

export async function getMetadata(req, res) {
    const urls = req.body
    
    try {
        logger.debug('Getting Metadata:', urls)
        const metadata = await metadataService.fetchMetadata(urls)
        res.json(metadata)
    } catch (err) {
        logger.error('Failed to get metadata', err)
        res.status(400).send({ err: 'Failed to get metadata' })
    }
}
