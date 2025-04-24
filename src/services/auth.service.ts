import { Injectable } from '@nestjs/common';
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import { ConfigService } from '@nestjs/config';
import { AuthResult } from 'src/domain';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;

  constructor(private configService: ConfigService) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.configService.get<string>('COGNITO_POOL_ID'),
      ClientId: this.configService.get<string>('COGNITO_CLIENT_ID'),
    });
  }

  authenticateUser(email: string, password: string): Promise<AuthResult> {
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          const response: AuthResult = {
            access_token: result.getAccessToken().getJwtToken(),
            id_token: result.getIdToken().getJwtToken(),
            refresh_token: result.getRefreshToken().getToken(),
          };
          resolve(response);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }
}
