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
      urls: {
        small: item.urls.small,
        small_s3: item.urls.small_s3,
      },
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
    // Récupère le paramètre de la requête 'url' de la requête
    const { url, downloadLocation } = req.query;
    if (!url || !downloadLocation) {
      return res.status(400).json([{ errCode: 153, errMessage: 'Missing url or downloadLocation parameter' }]);
    }

    // Envoie une requête GET à l'URL fournie et obtient la réponse en tant que 'arraybuffer'.
    // 'arraybuffer' est utilisé pour manipuler directement les données binaires.
    const response = await axios.get(url, {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
      responseType: 'arraybuffer',
    });
    // Crée un buffer à partir des données binaires de la réponse
    // Un buffer est utilisé pour stocker des données binaires
    const buffer = Buffer.from(response.data, 'binary');
    // " La raison d'utiliser un arrayBuffer et de le convertir en Buffer est que cela permet de manipuler
    // directement les données binaires de l'image sans les convertir en d'autres formats intermédiaires. "

    // Notifier Unsplash du téléchargement
    await axios.get(downloadLocation, {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    });

    // Définit le statut de réponse HTTP et les en-têtes HTTP
    res.writeHead(200, {
      'Content-Type': response.headers['content-type'], // ou 'image/jpeg' par exemple
      'Content-Length': buffer.length,
    });
    // Envoie le buffer des données d'image dans le corps de la réponse
    return res.end(buffer);
  } catch (error) {
    console.error({ getImageProxyError: error });
    return res.status(500).json([{ errCode: 152, errMessage: 'A server error occurred when fetching the image' }]);
  }
};

module.exports = { searchUnsplashImages, getImageProxy };
