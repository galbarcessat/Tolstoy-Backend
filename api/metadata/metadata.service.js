import axios from 'axios';
import xss from 'xss';
import metascraper from 'metascraper';
import metascraperTitle from 'metascraper-title';
import metascraperDescription from 'metascraper-description';
import metascraperImage from 'metascraper-image';
import { logger } from '../../services/logger.service.js';

const scraper = metascraper([
    metascraperTitle(),
    metascraperDescription(),
    metascraperImage(),
]);

export const metadataService = {
    fetchMetadata,
}

async function fetchMetadata(urls) {
    try {
        const metadata = await Promise.all(urls.map(async (url) => {
            try {
                const { data: html } = await axios.get(url)
                const metadata = await scraper({ html, url })
                return {
                    title: xss(metadata.title) || 'No title available',
                    description: xss(metadata.description) || 'No description available',
                    image: xss(metadata.image) || null,
                };
            } catch (err) {
                logger.error(`Error fetching metadata for URL ${url}`, err)
                return { title: 'Error fetching metadata', description: '', image: null }
            }
        }))

        return metadata;
    } catch (err) {
        logger.error('Cannot get metadata', err);
        throw err;
    }
}

