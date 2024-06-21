const axios = require('axios');

const searchUnsplashImages = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json([{ errCode: 151, errMessage: 'Missing query parameter' }]);
    }

    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query,
        per_page: 12,
      },
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
    });

    const results = response.data.results.map((item) => ({
      id: item.id,
      alternative_slugs: item.alternative_slugs,
      altDescription: item.alt_description,
      urls: { small_s3: item.urls.small_s3 },
      links: { download_location: item.links.download_location },
      user: {
        id: item.user.id,
        username: item.user.username,
        name: item.user.name,
        links: { html: item.user.links.html },
      },
    }));

    return res.status(200).json(results);
  } catch (error) {
    console.error({ searchUnsplashImagesError: error });
    return res.status(500).json([{ errCode: 150, errMessage: 'A server error occurred when searching for images' }]);
  }
};

const getImageProxy = async (req, res) => {
  try {
    const { imageUrl } = req.query;
    if (!imageUrl) {
      return res.status(400).json([{ errCode: 153, errMessage: 'Missing imageUrl query parameter' }]);
    }

    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');

    res.writeHead(200, {
      'Content-Type': response.headers['content-type'],
      'Content-Length': buffer.length,
    });

    res.end(buffer);

    // const contentType = response.headers['content-type'];
    // res.setHeader('Content-Type', contentType);
    // res.send(response.data);
  } catch (error) {
    console.error({ getImageProxyError: error });
    return res.status(500).json([{ errCode: 152, errMessage: 'A server error occurred when fetching the image' }]);
  }
};

module.exports = { searchUnsplashImages, getImageProxy };
