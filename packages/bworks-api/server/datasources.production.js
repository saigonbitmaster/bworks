const S3_KEY = process.env.S3_KEY || 'AKIAJTTWQ7FVPEO333HA';
const S3_SECRET = process.env.S3_SECRET || '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';
const S3_BUCKET = process.env.S3_BUCKET || 'hcm30';
const MONGO_HOST = 'localhost';
const REDIS_HOST = 'localhost';
const mongoConfig = name => ({
  name,
  url: `mongodb://admin:${process.env.PASSWORD}@${MONGO_HOST}:27017/${name}?serverSelectionTimeoutMS=500000&connectTimeoutMS=500000&authSource=admin&authMechanism=SCRAM-SHA-256`,
  connector: 'mongodb',
  useNewUrlParser: 'true',
  enableGeoIndexing: true,
  allowExtendedOperators: true,
  useUnifiedTopology: true,
});
const s3Config = (name, prefix) => ({
  name,
  connector: 'loopback-storage-aws',
  provider: 'amazon',
  key: S3_SECRET,
  keyId: S3_KEY,
  bucket: S3_BUCKET,
  options: {
    prefix,
  },
});
const dts = {
  bWorksSystem: mongoConfig('bWorksSystem'),
  bWorksData: mongoConfig('bWorksData'),
  redis: {
    host: REDIS_HOST,
    port: 6379,
    url: '',
    password: '',
    name: 'redis',
    db: 1,
    connector: 'kv-redis',
  },
  sourceStorage: s3Config('sourceStorage', 'SourceFiles'),
  transient: {
    name: 'transient',
    connector: 'transient',
  }
};

// eslint-disable-next-line no-console
console.log('production', dts.srcMain.url);
module.exports = dts;
