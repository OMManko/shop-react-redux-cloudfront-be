import csv from 'csv-parser';
import { Readable } from 'stream';

export default class FileParserService {
	public parseFileStream(fileStream: Readable) {
		const parsedData = [];
		
		return new Promise((resolve, reject) => {
			fileStream
				.pipe(csv())
				.on('error', () => reject('Error while parsing the stream'))
				.on('data', (item) => parsedData.push(item))
				.on('end', () => resolve(parsedData));
		});
	}
}
