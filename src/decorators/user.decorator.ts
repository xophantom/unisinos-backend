import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import axios from 'axios';
import { UserDetails } from 'src/domain/interfaces/user-cognito';

export const User = createParamDecorator(async (data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user as UserDetails;

  if (!user) {
    return null;
  }

  if (data) {
    return user[data];
  }

  const accessToken = request.headers.authorization?.split(' ')[1];

  if (!accessToken) {
    console.error('Access token não encontrado');
    return user;
  }

  try {
    const response = await axios.post(
      `https://cognito-idp.us-east-1.amazonaws.com/`,
      { AccessToken: accessToken },
      {
        headers: {
          'Content-Type': 'application/x-amz-json-1.1',
          'X-Amz-Target': 'AWSCognitoIdentityProviderService.GetUser',
        },
      },
    );

    const userDetails = response.data.UserAttributes;

    const emailAttribute = userDetails.find((attr: CognitoUserAttribute) => attr.Name === 'email');
    if (emailAttribute) {
      user.email = emailAttribute.Value;
    }

    user.details = userDetails;
    return user;
  } catch (error) {
    console.error('Erro ao buscar detalhes do usuário do Cognito:', error.response?.data || error.message);
    return user;
  }
});
