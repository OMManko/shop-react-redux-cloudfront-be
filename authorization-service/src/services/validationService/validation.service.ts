const { CREDENTIALS } = process.env;

export default class ValidationService {
    
    private getCredentials(token: string) {
        const [, credentials] = token.split(' ');
        return Buffer.from(credentials, 'base64').toString('utf8').split(':');
    }
    
    validateToken(token: string): boolean {
        console.log(`Start validation: ${token}`)
        
        const [userName, password] = this.getCredentials(token);
        const [allowedUserName, allowedPassword] = CREDENTIALS.split(':');

        return userName === allowedUserName && password === allowedPassword;
    }
}
