import * as uuid from 'uuid';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { Product } from '../../types/api-types';

const { REGION, SQS_URL } = process.env;

export default class QueueService {
    async sendMessage(products: Product[]) {
        const sqsClient = new SQSClient({ region: REGION });

        console.log('Start sending imported products to the queue: ', JSON.stringify(products));
        
        try {
            await Promise.all(
                products.map(product => {
                    const params = {
                        QueueUrl: SQS_URL,
                        MessageBody: JSON.stringify(product),
                        MessageGroupId: uuid.v4()
                    };

                    sqsClient.send(new SendMessageCommand(params));

                    console.log(
                        'The product was successfully sent to the queue: ',
                        JSON.stringify(product)
                    );
                })
            );

            console.log('Finish sending imported products to the queue');
        } catch (e) {
            console.log('Sending products to the queue failed: ', e);
        }
    }
}
