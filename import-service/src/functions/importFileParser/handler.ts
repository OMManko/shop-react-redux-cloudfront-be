import { S3Event } from 'aws-lambda';
import importService from '../../services/importService';

export const importFileParser = async (event: S3Event) => {
  try {
      await Promise.all(
          event.Records.map(async (record) => {
              const file = record.s3.object.key;
              
              await importService.parseFile(file);
            
              console.log(`File was successfully parsed: ${file}`);
          })
      );
    
  } catch (e) {
    console.log('Error while parsing the file', e);
  }
};


