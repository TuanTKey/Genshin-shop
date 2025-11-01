pipeline {
    agent any
    
    // Cấu hình timeout và options
    options {
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }
    
    // Environment variables
    environment {
        EC2_HOST = '54.166.186.43'  // ← ĐỔI IP NÀY
        EC2_USER = 'ubuntu'
        APP_DIR = '/var/www/Genshin-shop'
        DEPLOY_TIME = new Date().format('yyyy-MM-dd HH:mm:ss')
    }
    
    stages {
        stage('🔍 1. Pre-Check') {
            steps {
                script {
                    echo "═══════════════════════════════════════"
                    echo "🚀 GENSHIN SHOP DEPLOYMENT"
                    echo "═══════════════════════════════════════"
                    echo "📅 Deploy Time: ${DEPLOY_TIME}"
                    echo "🌐 Target Server: ${EC2_HOST}"
                    echo "👤 User: ${EC2_USER}"
                    echo "═══════════════════════════════════════"
                }
            }
        }
        
        stage('🔗 2. Test SSH Connection') {
            steps {
                script {
                    echo "Testing connection to EC2..."
                    sshPublisher(
                        publishers: [
                            sshPublisherDesc(
                                configName: 'AWS-Genshin-Shop',
                                transfers: [
                                    sshTransfer(
                                        execCommand: 'echo "✅ SSH Connection Successful!" && hostname && uptime'
                                    )
                                ],
                                verbose: true
                            )
                        ]
                    )
                }
            }
        }
        
        stage('📊 3. Check Current Status') {
            steps {
                script {
                    echo "Checking current application status..."
                    sshPublisher(
                        publishers: [
                            sshPublisherDesc(
                                configName: 'AWS-Genshin-Shop',
                                transfers: [
                                    sshTransfer(
                                        execCommand: '''
                                            echo "=== CURRENT STATUS ==="
                                            echo "MongoDB:"
                                            sudo systemctl status mongod | grep Active || echo "MongoDB not running"
                                            echo ""
                                            echo "Backend (PM2):"
                                            pm2 list | grep genshin-backend || echo "Backend not running"
                                            echo ""
                                            echo "Nginx:"
                                            sudo systemctl status nginx | grep Active || echo "Nginx not running"
                                            echo ""
                                            echo "Disk Usage:"
                                            df -h / | tail -1
                                            echo ""
                                            echo "Memory Usage:"
                                            free -h | grep Mem
                                        '''
                                    )
                                ],
                                verbose: true
                            )
                        ]
                    )
                }
            }
        }
        
        stage('📥 4. Pull Latest Code') {
            steps {
                script {
                    echo "Pulling latest code from Git..."
                    sshPublisher(
                        publishers: [
                            sshPublisherDesc(
                                configName: 'AWS-Genshin-Shop',
                                transfers: [
                                    sshTransfer(
                                        execCommand: """
                                            cd ${APP_DIR}
                                            echo "Current directory: \$(pwd)"
                                            git pull origin main || echo "⚠️  No git repository, using local files"
                                        """
                                    )
                                ],
                                verbose: true
                            )
                        ]
                    )
                }
            }
        }
        
        stage('📦 5. Install Backend Dependencies') {
            steps {
                script {
                    echo "Installing backend dependencies..."
                    sshPublisher(
                        publishers: [
                            sshPublisherDesc(
                                configName: 'AWS-Genshin-Shop',
                                transfers: [
                                    sshTransfer(
                                        execCommand: """
                                            cd ${APP_DIR}/backend
                                            echo "📦 Installing backend dependencies..."
                                            npm install --production
                                            echo "✅ Backend dependencies installed"
                                        """
                                    )
                                ],
                                verbose: true
                            )
                        ]
                    )
                }
            }
        }
        
        stage('🔄 6. Restart Backend') {
            steps {
                script {
                    echo "Restarting backend with PM2..."
                    sshPublisher(
                        publishers: [
                            sshPublisherDesc(
                                configName: 'AWS-Genshin-Shop',
                                transfers: [
                                    sshTransfer(
                                        execCommand: """
                                            cd ${APP_DIR}/backend
                                            echo "🔄 Restarting backend..."
                                            pm2 restart genshin-backend || pm2 start server.js --name genshin-backend
                                            sleep 3
                                            pm2 list
                                            echo "✅ Backend restarted"
                                        """
                                    )
                                ],
                                verbose: true
                            )
                        ]
                    )
                }
            }
        }
        
        stage('🏗️ 7. Build Frontend') {
            steps {
                script {
                    echo "Building React frontend..."
                    sshPublisher(
                        publishers: [
                            sshPublisherDesc(
                                configName: 'AWS-Genshin-Shop',
                                transfers: [
                                    sshTransfer(
                                        execCommand: """
                                            cd ${APP_DIR}/frontend
                                            echo "📦 Installing frontend dependencies..."
                                            npm install
                                            
                                            echo "🔧 Fixing API URL..."
                                            sed -i "s|const API_BASE_URL = 'http://localhost:5000/api'|const API_BASE_URL = '/api'|g" src/services/api.js
                                            
                                            echo "🏗️ Building production bundle..."
                                            npm run build
                                            
                                            echo "📊 Build size:"
                                            du -sh build/
                                            echo "✅ Frontend built successfully"
                                        """
                                    )
                                ],
                                verbose: true
                            )
                        ]
                    )
                }
            }
        }
        
        stage('🚀 8. Deploy Frontend') {
            steps {
                script {
                    echo "Deploying frontend to Nginx..."
                    sshPublisher(
                        publishers: [
                            sshPublisherDesc(
                                configName: 'AWS-Genshin-Shop',
                                transfers: [
                                    sshTransfer(
                                        execCommand: """
                                            echo "🚀 Deploying frontend..."
                                            sudo rm -rf /var/www/html.backup
                                            sudo mv /var/www/html /var/www/html.backup 2>/dev/null || true
                                            sudo cp -r ${APP_DIR}/frontend/build /var/www/html
                                            sudo chown -R www-data:www-data /var/www/html
                                            echo "✅ Frontend deployed"
                                        """
                                    )
                                ],
                                verbose: true
                            )
                        ]
                    )
                }
            }
        }
        
        stage('🔄 9. Restart Nginx') {
            steps {
                script {
                    echo "Restarting Nginx..."
                    sshPublisher(
                        publishers: [
                            sshPublisherDesc(
                                configName: 'AWS-Genshin-Shop',
                                transfers: [
                                    sshTransfer(
                                        execCommand: '''
                                            echo "🔄 Restarting Nginx..."
                                            sudo nginx -t
                                            sudo systemctl restart nginx
                                            echo "✅ Nginx restarted"
                                        '''
                                    )
                                ],
                                verbose: true
                            )
                        ]
                    )
                }
            }
        }
        
        stage('🏥 10. Health Check') {
            steps {
                script {
                    echo "Running health checks..."
                    sshPublisher(
                        publishers: [
                            sshPublisherDesc(
                                configName: 'AWS-Genshin-Shop',
                                transfers: [
                                    sshTransfer(
                                        execCommand: """
                                            echo "🏥 Running health checks..."
                                            
                                            echo "1. Backend API:"
                                            curl -f http://localhost:5000/ || (echo "❌ Backend health check failed" && exit 1)
                                            
                                            echo ""
                                            echo "2. Backend via Nginx proxy:"
                                            curl -f http://localhost/api/ || (echo "❌ API proxy failed" && exit 1)
                                            
                                            echo ""
                                            echo "3. Frontend:"
                                            curl -f http://localhost/ | head -n 5 || (echo "❌ Frontend health check failed" && exit 1)
                                            
                                            echo ""
                                            echo "✅ All health checks passed!"
                                        """
                                    )
                                ],
                                verbose: true
                            )
                        ]
                    )
                }
            }
        }
        
        stage('📊 11. Collect Deployment Data') {
            steps {
                script {
                    echo "Collecting deployment statistics..."
                    sshPublisher(
                        publishers: [
                            sshPublisherDesc(
                                configName: 'AWS-Genshin-Shop',
                                transfers: [
                                    sshTransfer(
                                        execCommand: """
                                            cd ${APP_DIR}
                                            
                                            # Create deployment report
                                            cat > /tmp/deployment-report.json << 'EOFMARKER'
{
  "deployTime": "${DEPLOY_TIME}",
  "buildNumber": "${BUILD_NUMBER}",
  "server": "${EC2_HOST}",
  "services": {
    "mongodb": "\$(sudo systemctl is-active mongod)",
    "backend": "\$(pm2 list | grep genshin-backend | awk '{print \$10}' || echo 'unknown')",
    "nginx": "\$(sudo systemctl is-active nginx)"
  },
  "statistics": {
    "accounts": \$(mongosh genshin-shop --quiet --eval "db.accounts.countDocuments()" 2>/dev/null || echo 0),
    "orders": \$(mongosh genshin-shop --quiet --eval "db.orders.countDocuments()" 2>/dev/null || echo 0),
    "users": \$(mongosh genshin-shop --quiet --eval "db.users.countDocuments()" 2>/dev/null || echo 0)
  },
  "system": {
    "diskUsage": "\$(df -h / | tail -1 | awk '{print \$5}')",
    "memoryUsage": "\$(free -h | grep Mem | awk '{print \$3 "/" \$2}')",
    "uptime": "\$(uptime -p)"
  }
}
EOFMARKER
                                            
                                            cat /tmp/deployment-report.json
                                        """
                                    )
                                ],
                                verbose: true
                            )
                        ]
                    )
                }
            }
        }
        
        stage('📄 12. Generate Dashboard') {
            steps {
                script {
                    echo "Generating deployment dashboard..."
                    
                    def dashboardHtml = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Genshin Shop - Deployment Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            background: white;
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .header h1 {
            color: #667eea;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .header .subtitle {
            color: #666;
            font-size: 1.1em;
        }
        .status-badge {
            display: inline-block;
            padding: 8px 20px;
            border-radius: 20px;
            font-weight: bold;
            margin-top: 15px;
            font-size: 1.1em;
        }
        .success { background: #10b981; color: white; }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        .card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .card h2 {
            color: #667eea;
            margin-bottom: 20px;
            font-size: 1.5em;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #eee;
        }
        .info-row:last-child { border-bottom: none; }
        .label {
            font-weight: 600;
            color: #555;
        }
        .value {
            color: #333;
            font-family: 'Courier New', monospace;
        }
        .status-dot {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
        }
        .status-online { background: #10b981; }
        .status-offline { background: #ef4444; }
        .links {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .links h2 {
            color: #667eea;
            margin-bottom: 20px;
        }
        .link-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            text-decoration: none;
            margin: 10px 10px 10px 0;
            font-weight: bold;
            transition: transform 0.2s;
        }
        .link-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        .timestamp {
            text-align: center;
            color: white;
            margin-top: 20px;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎮 Genshin Shop Deployment</h1>
            <p class="subtitle">Build #${BUILD_NUMBER} - ${DEPLOY_TIME}</p>
            <span class="status-badge success">✅ Deployment Successful</span>
        </div>
        
        <div class="grid">
            <div class="card">
                <h2>📊 Services Status</h2>
                <div class="info-row">
                    <span class="label"><span class="status-dot status-online"></span>MongoDB</span>
                    <span class="value">Running</span>
                </div>
                <div class="info-row">
                    <span class="label"><span class="status-dot status-online"></span>Backend API</span>
                    <span class="value">Running</span>
                </div>
                <div class="info-row">
                    <span class="label"><span class="status-dot status-online"></span>Nginx</span>
                    <span class="value">Running</span>
                </div>
                <div class="info-row">
                    <span class="label"><span class="status-dot status-online"></span>Jenkins</span>
                    <span class="value">Running</span>
                </div>
            </div>
            
            <div class="card">
                <h2>💾 Database Statistics</h2>
                <div class="info-row">
                    <span class="label">🎮 Game Accounts</span>
                    <span class="value">Loading...</span>
                </div>
                <div class="info-row">
                    <span class="label">🛒 Orders</span>
                    <span class="value">Loading...</span>
                </div>
                <div class="info-row">
                    <span class="label">👤 Users</span>
                    <span class="value">Loading...</span>
                </div>
                <div class="info-row">
                    <span class="label">📅 Last Updated</span>
                    <span class="value">${DEPLOY_TIME}</span>
                </div>
            </div>
            
            <div class="card">
                <h2>🖥️ Server Info</h2>
                <div class="info-row">
                    <span class="label">🌐 IP Address</span>
                    <span class="value">${EC2_HOST}</span>
                </div>
                <div class="info-row">
                    <span class="label">💽 Disk Usage</span>
                    <span class="value">Loading...</span>
                </div>
                <div class="info-row">
                    <span class="label">🧠 Memory</span>
                    <span class="value">Loading...</span>
                </div>
                <div class="info-row">
                    <span class="label">⏱️ Uptime</span>
                    <span class="value">Loading...</span>
                </div>
            </div>
        </div>
        
        <div class="links">
            <h2>🔗 Quick Links</h2>
            <a href="http://${EC2_HOST}/" class="link-button" target="_blank">🌐 Open Website</a>
            <a href="http://${EC2_HOST}/api/" class="link-button" target="_blank">🔌 API Health</a>
            <a href="http://${EC2_HOST}/login" class="link-button" target="_blank">🔐 Admin Login</a>
            <a href="http://${EC2_HOST}/admin" class="link-button" target="_blank">👑 Admin Dashboard</a>
            <a href="http://${EC2_HOST}:8080" class="link-button" target="_blank">⚙️ Jenkins</a>
        </div>
        
        <p class="timestamp">
            Generated by Jenkins Build #${BUILD_NUMBER}<br>
            Deploy Time: ${DEPLOY_TIME}
        </p>
    </div>
    
    <script>
        // Auto-refresh data every 30 seconds
        setInterval(function() {
            fetch('http://${EC2_HOST}/api/accounts/stats')
                .then(r => r.json())
                .then(data => console.log('Stats:', data))
                .catch(e => console.log('Stats not available'));
        }, 30000);
    </script>
</body>
</html>
"""
                    
                    writeFile file: 'deployment-dashboard.html', text: dashboardHtml
                    echo "✅ Dashboard generated!"
                }
            }
        }
    }
    
    post {
        always {
            echo "═══════════════════════════════════════"
            echo "📊 Deployment Summary"
            echo "═══════════════════════════════════════"
        }
        success {
            echo "✅✅✅ DEPLOYMENT SUCCESSFUL! ✅✅✅"
            echo "🌐 Website: http://${EC2_HOST}"
            echo "🔌 API: http://${EC2_HOST}/api"
            echo "👑 Admin: http://${EC2_HOST}/admin"
            echo "⚙️  Jenkins: http://${EC2_HOST}:8080"
            echo "═══════════════════════════════════════"
            
            archiveArtifacts artifacts: 'deployment-dashboard.html', fingerprint: true
            echo "📁 Deployment dashboard saved as artifact"
        }
        failure {
            echo "❌❌❌ DEPLOYMENT FAILED! ❌❌❌"
            echo "Check console output for details"
            echo "═══════════════════════════════════════"
        }
    }
}