# Media Editor - Deployment Guide

## 🚀 Quick Deploy

### Local Development
```bash
# Clone repository
git clone https://github.com/your-username/media-editor.git
cd media-editor

# Start with default port (8080)
./deploy.sh

# Or specify custom port
./deploy.sh 8080
```

## 🏗️ Production Deployment with VPS

### Prerequisites
- VPS with Docker and Docker Compose installed
- Git installed on VPS
- SSH access configured

### VPS Setup

#### Single Application Deployment
```bash
# Create deployment directory
sudo mkdir -p /opt/media-editor
cd /opt/media-editor

# Clone your repository
git clone https://github.com/your-username/media-editor.git .

# Make deploy script executable
chmod +x deploy.sh
```

#### Multiple Applications on Same VPS

Untuk VPS yang menampung banyak aplikasi, gunakan custom deployment paths:

```bash
# Buat struktur direktori yang terorganisir
sudo mkdir -p /opt/apps
sudo mkdir -p /opt/apps/media-editor
sudo mkdir -p /opt/apps/blog-app
sudo mkdir -p /opt/apps/api-app

# Setiap aplikasi mendapat path unik
# VPS_DEPLOY_PATH=/opt/apps/media-editor (untuk Media Editor)
# VPS_DEPLOY_PATH=/opt/apps/blog-app     (untuk Blog App)
# VPS_DEPLOY_PATH=/opt/apps/api-app      (untuk API App)
```

Ketika menggunakan GitHub Actions, setiap aplikasi memiliki secret `VPS_DEPLOY_PATH` yang berbeda untuk menghindari konflik.

### GitHub Actions Setup

1. **Add Repository Secrets** (Settings → Secrets and variables → Actions):
   ```
   DOCKER_USERNAME=your-dockerhub-username
   DOCKER_PASSWORD=your-dockerhub-password
   VPS_HOST=your-vps-ip-address
   VPS_USERNAME=root
   VPS_PASSWORD=your-vps-password
   VPS_SSH_KEY=your-private-ssh-key
   VPS_SSH_PORT=22
   VPS_DEPLOY_PATH=/opt/media-editor   # Custom deployment path (optional)
   APP_PORT=8080
   ```

2. **Custom Deployment Path** (when VPS hosts multiple applications):
   ```bash
   # Example paths for different applications:
   VPS_DEPLOY_PATH=/opt/apps/media-editor
   VPS_DEPLOY_PATH=/home/deploy/media-editor
   VPS_DEPLOY_PATH=/var/www/media-editor
   ```

3. **Update Workflow Configuration**:
   - Modify `.github/workflows/deploy.yml` to match your GitHub repository name
   - Update the branch trigger if needed (main/master)
   - Update deployment directory path in VPS

4. **Deploy**:
   - Push to main branch or manually trigger workflow
   - GitHub Actions will build and deploy automatically

## 🔧 Manual Commands

### Start Application
```bash
# Using deployment script
./deploy.sh 8080

# Or using Docker Compose directly
APP_PORT=8080 docker compose up -d
```

### Stop Application
```bash
docker compose down
```

### View Logs
```bash
docker compose logs -f
```

### Update Application
```bash
git pull origin main
docker compose build --no-cache
docker compose up -d
```

### Clean Up
```bash
docker compose down
docker system prune -f
```

## 🌐 Access Application

After deployment, your Media Editor will be available at:
- `http://localhost:8080` (local)
- `http://your-vps-ip:8080` (VPS)

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Copy example file
cp .env.example .env

# Edit with your settings
nano .env
```

Key variables:
- `APP_PORT`: Port to access the application (default: 8080)

### Custom Port

The application listens on port 8080 by default. To change:
1. Set `APP_PORT` environment variable
2. Update your firewall/security group
3. Ensure the port is not already in use

```bash
export APP_PORT=9000
./deploy.sh
```

## 🔒 Security Considerations

### Firewall Configuration
```bash
# UFW (Ubuntu/Debian)
sudo ufw allow 8080
sudo ufw allow ssh
sudo ufw enable

# Firewalld (CentOS/RHEL)
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload
```

### SSL/TLS (Recommended)
Consider adding SSL with Let's Encrypt:
```bash
# Using Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## 🐛 Troubleshooting

### Application Not Starting
```bash
# Check container status
docker compose ps

# View detailed logs
docker compose logs

# Restart services
docker compose restart
```

### Port Already in Use
```bash
# Find process using port
sudo lsof -i :8080

# Kill the process
sudo kill -9 PID_NUMBER
```

### Out of Memory
Increase Docker memory limit or VPS RAM.

## 📊 Monitoring

### Health Checks
The application includes built-in health checks. Monitor via:
```bash
curl -f http://localhost:8080
```

### Logs
```bash
# Application logs
docker compose logs media-editor

# Nginx logs
docker compose logs nginx
```

## 🔄 Backup Strategy

### Application Data
Since this is a stateless application, regular git backups contain all source code.

### Database (if added later)
Configure automated database backups if you extend the application.

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [GitHub Actions](https://github.com/features/actions)
- [Nuxt.js Deployment](https://nuxt.com/docs/getting-started/deployment)
