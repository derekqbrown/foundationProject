// How to Use SSM Parameter Store:

// Store the JWT secret in AWS Systems Manager Parameter Store.

// Example: Using AWS CLI to create a parameter.

// bash: aws ssm put-parameter --name "jwt-secret-key" --value "your-generated-jwt-secret-key" --type "SecureString"
// Access the secret in your Node.js application using the AWS SDK.

const AWS = require('aws-sdk');
const ssm = new AWS.SSM();

async function getJWTSecret() {
  try {
    const parameter = await ssm.getParameter({
      Name: 'jwt-secret-key',
      WithDecryption: true,
    }).promise();

    return parameter.Parameter.Value;
  } catch (err) {
    console.log('Error retrieving secret:', err);
    throw new Error('Unable to retrieve JWT secret key');
  }
}

getJWTSecret().then((jwtSecret) => {
  console.log('JWT Secret:', jwtSecret);
});
