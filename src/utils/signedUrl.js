const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const generateSignedUrl = async (key, ttl) => {
  const command = new GetObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: key });
  const url = await getSignedUrl(s3, command, { expiresIn: ttl });
  return url;
};

module.exports = { generateSignedUrl };
