import {
  S3Client,
  PutObjectCommand,
  PutBucketCorsCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';

dotenv.config();

const { AWS_ACCESSKEYID, AWS_BUCKETNAME, AWS_SECRETACCESSKEY, AWS_REGION } =
  process.env;

type MyType = {
  msg: string,
  resultUpload?: any,
  error?: any,
};

export const generateUniqueId = () => {
  const length = 24;
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!$%&*()_+?';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters[randomIndex];
  }
  return result;
};

export const setCorsBucket = async () => {
  const client = new S3Client({
    credentials: {
      accessKeyId: AWS_ACCESSKEYID,
      secretAccessKey: AWS_SECRETACCESSKEY,
    },
    region: AWS_REGION,
  });
  /* console.log('setCorsBucket Variables:');
  console.log('AWS_REGION:', AWS_REGION);
  console.log('AWS_ACCESSKEYID:', AWS_ACCESSKEYID);
  console.log('AWS_SECRETACCESSKEY:', AWS_SECRETACCESSKEY);
  console.log('AWS_BUCKETNAME:', AWS_BUCKETNAME); */
  try {
    const input = {
      // PutBucketCorsRequest
      Bucket: AWS_BUCKETNAME, // required
      CORSConfiguration: {
        // CORSConfiguration
        CORSRules: [
          // CORSRules // required
          {
            // CORSRule
            AllowedHeaders: [
              // AllowedHeaders
              '*',
            ],
            AllowedMethods: [
              // AllowedMethods // required
              'POST',
              'GET',
            ],
            AllowedOrigins: [
              // AllowedOrigins // required
              '*',
            ],
            ExposeHeaders: [],
          },
        ],
      },
    };
    const command = new PutBucketCorsCommand(input);
    const response = await client.send(command);

    console.log('response setCorsBucket:..', response);
  } catch (error) {
    console.log('Error setBucketCors:..', error);
  }
};

export const uploadOneFileToBucket = async (dataFile: any, target_id: any) => {
  //console.log('dataFile:..', dataFile);
  //console.log('target_id:..', target_id);
  const client = new S3Client({
    credentials: {
      accessKeyId: AWS_ACCESSKEYID || '',
      secretAccessKey: AWS_SECRETACCESSKEY || '',
    },
    region: AWS_REGION || '',
  });
  /* console.log('AWS_ACCESSKEYID:..', AWS_ACCESSKEYID);
  console.log('AWS_SECRETACCESSKEY:..', AWS_SECRETACCESSKEY);
  console.log('AWS_BUCKETNAME:..', AWS_BUCKETNAME);
  console.log('AWS_REGION:..', AWS_REGION); */
  let response: MyType = {
    msg: 'Proceso upLoadOneFileToBubket:..',
  };
  //eliminar del tempFilePath el ./server
  //const tempFilePath = dataFile.tempFilePath.replace('server/','');
  try {
    //console.log('alparecer todo ok al leer el archivo:..', dataFile);
    //console.log('AWS_BUCKETNAME:..', dataEnv.AWS_BUCKETNAME);
    const input: PutObjectCommandInput = {
      ACL: 'public-read',
      Body: dataFile.buffer,
      Bucket: AWS_BUCKETNAME || '',
      Key: `${target_id}/${dataFile.originalname}`,
    };
    const command = new PutObjectCommand(input);
    const resultUpload = await client.send(command);
    //const resultUploadFile = `resultUpload${item.name}`;
    //https://magiclogror2024.s3.us-east-2.amazonaws.com/67660e877ed80129bccaba12/canastaBasica1.png
    const urlFile = `https://${AWS_BUCKETNAME}.s3.${AWS_REGION}.amazonaws.com/${target_id}/${dataFile.originalname}`;

    response = {
      ...response,
      resultUpload,
    };
    return urlFile;
  } catch (error) {
    return {
      ...response,
      error,
    };
  }
};
