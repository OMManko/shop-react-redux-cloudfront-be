import { S3Event } from 'aws-lambda';
import importService from '../../services/importService';

export const importFileParser = async (event: S3Event) => {
    try {
        await Promise.all(
            event.Records.map(async record => {
                const file = record.s3.object.key;

                console.log(`${file}:  start parsing`);

                await importService.parseFile(file);

                console.log(`${file} was successfully parsed`);
            })
        );
    } catch (e) {
        console.log('Error while parsing the file', e);
    }
};
