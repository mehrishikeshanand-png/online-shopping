# Server deployment from GitHub

CodForge added a GitHub Actions workflow at `.github/workflows/deploy-to-server.yml`.

## Required GitHub repository secrets

Open your GitHub repository, then go to:

Settings > Secrets and variables > Actions > New repository secret

For your WinSCP FTP hosting, add these secrets:

- `FTP_HOST`: your FTP host, for example `forgeon.co.in`
- `FTP_USERNAME`: your FTP username, for example `forgeon`
- `FTP_PASSWORD`: your FTP password
- `FTP_TARGET_DIR`: the remote folder, for example `/domains/forgeon.co.in/public_html/codforge-demo`
- `FTP_PORT`: optional FTP port, usually `21`

## Optional SSH/SFTP secrets

If your hosting supports SSH/SFTP with a private key, you may use these instead:

- `SERVER_HOST`: your server IP address or domain
- `SERVER_USER`: the SSH username on your server
- `SERVER_SSH_KEY`: the private SSH key allowed to deploy to the server
- `SERVER_PATH`: the absolute folder to deploy into, for example `/var/www/example.com`
- `SERVER_PORT`: optional SSH port, defaults to `22`

## How deployment works

Every push to the `main` branch copies the generated website files to your configured FTP target directory or SSH server path.
The workflow intentionally excludes `.env`, `.github`, backend files, node modules, and Git data.

Your server must already be configured to serve the target folder through your domain or subfolder.
