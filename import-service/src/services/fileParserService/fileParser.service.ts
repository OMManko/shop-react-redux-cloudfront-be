import csv from 'csv-parser';
import { Readable } from 'stream';
import { Product } from '../../types/api-types';

export default class FileParserService {
	public parseFileStream(fileStream: Readable): Promise<Product[]> {
		const parsedData: Product[] = [];
		
		return new Promise((resolve, reject) => {
			fileStream
				.pipe(csv())
				.on('error', () => reject('Error while parsing the stream'))
				.on('data', (item) => {
					console.log(`Parsed item: ${JSON.stringify(item)}`);
					parsedData.push(item)
				})
				.on('end', () => resolve(parsedData));
		});
	}
}
