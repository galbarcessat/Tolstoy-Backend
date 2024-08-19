import axios from 'axios'
import { metadataService } from '../api/metadata/metadata.service.js'

jest.mock('axios')

//Test Successful Metadata Fetching
test('fetchMetadata returns correct metadata for a valid URL', async () => {
    const urls = ['https://example.com']
    const html = '<html><head><title>Test Title</title><meta name="description" content="Description Content"></head><body></body></html>';

    axios.get.mockResolvedValue({ data: html })

    const result = await metadataService.fetchMetadata(urls)

    expect(result[0].title).toBe('Test Title')
    expect(result[0].description).toBe('Description Content')
    expect(result[0].image).toBe(null)
    expect(result[0].url).toBe(urls[0])
})


//Test Handling of Invalid URL
test('fetchMetadata returns error metadata for an invalid URL', async () => {
    const urls = ['https://invalid-url.com']

    axios.get.mockRejectedValue(new Error('Network Error'))

    const result = await metadataService.fetchMetadata(urls)

    expect(result[0].title).toBe('Error fetching metadata')
    expect(result[0].description).toBe('Error fetching metadata')
    expect(result[0].image).toBe(null)
    expect(result[0].url).toBe(urls[0])
});


//Test XSS Protection
test('fetchMetadata sanitizes metadata to prevent XSS', async () => {
    const urls = ['https://example.com']
    const html = '<html><head><title><script>alert("XSS")</script></title></head></html>'

    axios.get.mockResolvedValue({ data: html })

    const result = await metadataService.fetchMetadata(urls)
    expect(result[0].title).toBe('&lt;script&gt;alert(“XSS”)&lt;/script&gt;')

});
