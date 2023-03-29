import { ProductInStock } from '../../types/api-types';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

const { REGION, SNS_ARN } = process.env;

export default class NotificationService {
    async sendNotification(product: ProductInStock) {
        const snsClient = new SNSClient({ region: REGION });

        const params = {
            Subject: 'Product addition',
            Message: JSON.stringify(product),
            TopicArn: SNS_ARN,
            MessageAttributes: {
                count: {
                    DataType: 'Number',
                    StringValue: String(product.count)
                }
            }
        };

        await snsClient.send(new PublishCommand(params));

        console.log(
            `Notification about the product ${JSON.stringify(product)} was successfully sent`
        );
    }
}
