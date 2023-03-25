const { CREDENTIALS } = process.env;

export default class ValidationService {
    validateToken(token: string): boolean {
        const [userName, password] = this.getCredentials(token);
        const [allowedUserName, allowedPassword] = CREDENTIALS.split(':');

        return userName === allowedUserName && password === allowedPassword;
    }

    private getCredentials(token: string) {
        const [, credentials] = token.split(' ');
        return Buffer.from(credentials, 'base64').toString('utf8').split(':');
    }
}
