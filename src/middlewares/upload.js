const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

// ----- AWS S3 client

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ----- Multer configuration

const storage = multerS3({
  s3, // Client S3 configuré
  bucket: process.env.S3_BUCKET_NAME, // Nom du bucket où les fichier seront stockés
  // acl: 'public-read', // Contrôle d'accès : accès public
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  }, // Définit des métadonnées
  key: (req, file, cb) => {
    console.log('file in key callback:', file);
    cb(null, `${Date.now().toString()}-${path.basename(file.originalname)}`);
  }, // Génère une clé unique pour chaque fichier
});

const limits = {
  fileSize: 1024 * 1024 * 3,
}; // Limite de taille de fichier à 3MB

const fileFilter = (req, res, file, cb) => {
  console.log('fileFilter called');
  console.log('file:', file);
  console.log('originalname:', file.originalname);
  console.log('mimetype:', file.mimetype);
  if (!file) {
    return cb(null, true); // Pas de fichier à vérifier (l'envoi de fichier est facultatif)
  }
  const fileTypes = /jpeg|jpg|png|gif/; // Types de fichiers acceptés
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase()); // Vérifie l'extension
  const mimetype = fileTypes.test(file.mimetype); // Vérifie le type MIME

  console.log('extname:', extname);
  console.log('mimetype:', mimetype);

  if (extname && mimetype) {
    return cb(null, true); // Fichier accepté
  }
  return cb(new Error(JSON.stringify({ errCode: 62, errMessage: 'Invalid file type' }))); // Fichier refusé
};

const upload = multer({ storage, limits });

// ----- Middleware de gestion d'erreur d'upload

const handleUploadError = (err, req, res, next) => {
  if (err) {
    if (err instanceof multer.MulterError) {
      // Gère l'erreur de taille de fichier
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json([{ errCode: 61, errMessage: 'File too large' }]);
      }
      // Gestion des autres erreurs Multer
      console.error({ multerError: err.message });
      return res
        .status(400)
        .json([{ errCode: 63, errMessage: 'File upload error - see the console for more details' }]);
    }
    console.error({ originalError: err.message });
    try {
      // Gestion des erreurs personnalisées (-> fileFilter)
      const error = JSON.parse(err.message);
      return res.status(400).json([error]);
    } catch (parseError) {
      // Gestion des erreurs inattendues
      console.error({ parseError: parseError.message });
      return res.status(500).json([{ errCode: 64, errMessage: 'An unexpected error occurred during file upload' }]);
    }
  }
  return next();
};

// ----- Middleware vérifiant la présence d'un fichier

// const checkFileExists = (req, res, next) => {
//   // Quand multer gère un upload de fichier, il place le fichier dans req.file
//   // Si aucun fichier n'est fourni, req.file sera undefined
//   if (!req.file) {
//     return res.status(400).json([{ errCode: 60, errMessage: 'No file uploaded' }]);
//   }
//   return next();
// };

// ----- Export

module.exports = { upload, handleUploadError };
