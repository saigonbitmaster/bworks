const S3_KEY = process.env.S3_KEY || 'AKIAJTTWQ7FVPEO333HA';
const S3_SECRET = process.env.S3_SECRET || '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';
const S3_BUCKET = process.env.S3_BUCKET || 'hcm30';
const MONGO_HOST = 'mongo';
const REDIS_HOST = 'redis';
const mongoConfig = name => ({
  name,
  url: `mongodb://admin:SfHcm2017@${MONGO_HOST}:27017/${name}?serverSelectionTimeoutMS=500000&connectTimeoutMS=500000&authSource=admin&authMechanism=SCRAM-SHA-256`,
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

  orgMain: mongoConfig('orgMain'),
  srcMain: mongoConfig('srcMain'),
  redis: {
    host: REDIS_HOST,
    port: 6379,
    url: '',
    password: '',
    name: 'redis',
    db: 1,
    connector: 'kv-redis',
  },
  nmsStorage: s3Config('nmsStorage', 'NmsFiles'),
  ctmStorage: s3Config('ctmStorage', 'CtmFiles'),
  ctmReportStorage: s3Config('ctmReportStorage', 'CtmReportFiles'),
  sourceStorage: s3Config('sourceStorage', 'SourceFiles'),
  sheetStorage: {
    name: 'sheetStorage',
    connector: 'loopback-component-storage',
    provider: 'filesystem',
    root: './tempSpreadSheet/excel',
  },
  transient: {
    name: 'transient',
    connector: 'transient',
  }
};

// eslint-disable-next-line no-console
console.log(MONGO_HOST, REDIS_HOST);
module.exports = dts;
