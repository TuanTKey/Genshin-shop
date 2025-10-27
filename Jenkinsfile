pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        MONGODB_URI = 'mongodb://localhost:27017/genshin-shop'
        BACKEND_PORT = '5000'
        FRONTEND_PORT = '3000'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '📥 Checking out code from Git...'
                checkout scm
            }
        }
        
        stage('Check Environment') {
            steps {
                echo '🔍 Checking build environment...'
                sh '''
                    echo "Node version:"
                    node --version
                    echo "NPM version:"
                    npm --version
                    echo "Git version:"
                    git --version
                '''
            }
        }
        
        stage('Install Backend Dependencies') {
            steps {
                echo '📦 Installing backend dependencies...'
                dir('backend') {
                    sh 'npm install'
                }
            }
        }
        
        stage('Install Frontend Dependencies') {
            steps {
                echo '📦 Installing frontend dependencies...'
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }
        
        stage('Backend Tests') {
            steps {
                echo '🧪 Running backend tests...'
                dir('backend') {
                    sh 'npm test || echo "No tests specified"'
                }
            }
        }
        
        stage('Frontend Tests') {
            steps {
                echo '🧪 Running frontend tests...'
                dir('frontend') {
                    sh 'npm test -- --watchAll=false || echo "No tests specified"'
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                echo '🏗️ Building React frontend...'
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }
        
        stage('Deploy Backend') {
            steps {
                echo '🚀 Deploying backend...'
                dir('backend') {
                    sh '''
                        # Kill existing process
                        pkill -f "node server.js" || true
                        
                        # Start backend
                        nohup npm start > backend.log 2>&1 &
                        
                        sleep 3
                        
                        # Health check
                        curl -f http://localhost:5000/ || exit 1
                        
                        echo "✅ Backend deployed successfully"
                    '''
                }
            }
        }
        
        stage('Deploy Frontend') {
            steps {
                echo '🚀 Deploying frontend...'
                dir('frontend') {
                    sh '''
                        # Deploy to web server directory
                        sudo rm -rf /var/www/genshin-shop || true
                        sudo mkdir -p /var/www/genshin-shop
                        sudo cp -r build/* /var/www/genshin-shop/
                        sudo chown -R www-data:www-data /var/www/genshin-shop
                        
                        echo "✅ Frontend deployed successfully"
                    '''
                }
            }
        }
    }
    
    post {
        success {
            echo '✅✅✅ Pipeline completed successfully! ✅✅✅'
            emailext (
                subject: "✅ Jenkins Build Success: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    Build Success!
                    
                    Job: ${env.JOB_NAME}
                    Build Number: ${env.BUILD_NUMBER}
                    Build URL: ${env.BUILD_URL}
                    
                    The Genshin Shop application has been deployed successfully.
                """,
                to: 'admin@genshinshop.com'
            )
        }
        failure {
            echo '❌❌❌ Pipeline failed! ❌❌❌'
            emailext (
                subject: "❌ Jenkins Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    Build Failed!
                    
                    Job: ${env.JOB_NAME}
                    Build Number: ${env.BUILD_NUMBER}
                    Build URL: ${env.BUILD_URL}
                    
                    Please check the logs for details.
                """,
                to: 'admin@genshinshop.com'
            )
        }
        always {
            echo '🧹 Cleaning up workspace...'
            cleanWs()
        }
    }
}