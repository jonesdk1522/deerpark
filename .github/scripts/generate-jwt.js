const crypto = require('crypto');
const { execSync } = require('child_process');

function base64urlEncode(data) {
  return Buffer.from(data).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

const header = base64urlEncode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
const payload = base64urlEncode(JSON.stringify({
  iat: Math.floor(Date.now() / 1000) - 60,
  exp: Math.floor(Date.now() / 1000) + 600,
  iss: process.env.APP_ID
}));
const unsignedToken = `${header}.${payload}`;
const signature = base64urlEncode(
  crypto.createSign('RSA-SHA256')
    .update(unsignedToken)
    .sign(process.env.APP_PRIVATE_KEY)
);
const jwt = `${unsignedToken}.${signature}`;

const owner = process.env.GITHUB_REPOSITORY.split('/')[0];
const repo = process.env.GITHUB_REPOSITORY.split('/')[1];
const installationResponse = execSync(
  `curl -s -H "Authorization: Bearer ${jwt}" -H "Accept: application/vnd.github.v3+json" https://github.enterprise.gov/api/v3/repos/${owner}/${repo}/installation`
).toString();
const installation = JSON.parse(installationResponse);
if (!installation.id) {
  console.error(`Failed to get installation ID: ${installationResponse}`);
  process.exit(1);
}
const installationId = installation.id;

const tokenResponse = execSync(
  `curl -s -X POST -H "Authorization: Bearer ${jwt}" -H "Accept: application/vnd.github.v3+json" https://github.enterprise.gov/api/v3/app/installations/${installationId}/access_tokens`
).toString();
const token = JSON.parse(tokenResponse);
if (!token.token) {
  console.error(`Failed to get token: ${tokenResponse}`);
  process.exit(1);
}

console.log(`::set-output name=token::${token.token}`);
