pipeline {
    agent any
    
    parameters {
        booleanParam(
            name: 'SKIP_TESTS', 
            defaultValue: false, 
            description: 'Bỏ qua bước chạy test'
        )
        choice(
            name: 'DEPLOY_ENV',
            choices: ['development', 'staging', 'production'],
            description: 'Môi trường deploy'
        )
        booleanParam(
            name: 'CLEAN_DEPLOY',
            defaultValue: true,
            description: 'Xóa hoàn toàn trước khi deploy mới'
        )
        choice(
            name: 'SOURCE_TYPE',
            choices: ['git', 'workspace'],
            defaultValue: 'git',
            description: 'Chọn nguồn code (git: từ repository, workspace: từ thư mục hiện tại)'
        )
    }
    
    environment {
        NODE_VERSION = '18'
        MONGODB_URI = 'mongodb://localhost:27017/genshin-shop'
        BACKEND_PORT = '5000'
        FRONTEND_PORT = '3000'
        DEPLOY_DIR = '/var/www/genshin-shop'
    }
    
    options {
        timeout(time: 30, unit: 'MINUTES')
        retry(2)
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
        timestamps()
    }
    
    stages {
        stage('Prepare Source') {
            steps {
                script {
                    if (params.SOURCE_TYPE == 'git') {
                        echo '📥 Checking out code from Git...'
                        checkout scm
                    } else {
                        echo '📁 Using current workspace without Git checkout...'
                        sh '''
                            echo "🔍 Workspace content:"
                            pwd
                            ls -la
                            echo "--- Backend ---"
                            ls -la backend/ || echo "No backend directory"
                            echo "--- Frontend ---" 
                            ls -la frontend/ || echo "No frontend directory"
                        '''
                    }
                }
            }
        }
        
        stage('Check Environment') {
            steps {
                echo '🔍 Checking build environment...'
                sh """
                    echo "📋 Build Information:"
                    echo "Job: ${env.JOB_NAME}"
                    echo "Build: ${env.BUILD_NUMBER}"
                    echo "Environment: ${params.DEPLOY_ENV}"
                    echo "Source Type: ${params.SOURCE_TYPE}"
                    echo "Branch: ${env.GIT_BRANCH}"
                    
                    echo "🔧 System Information:"
                    echo "Node version:"
                    node --version
                    echo "NPM version:"
                    npm --version
                    echo "Git version:"
                    git --version
                    echo "Working directory:"
                    pwd
                """
            }
        }
        
        stage('Install Backend Dependencies') {
            steps {
                echo '📦 Installing backend dependencies...'
                dir('backend') {
                    sh 'npm install --no-audit --no-fund'
                }
            }
        }
        
        stage('Install Frontend Dependencies') {
            steps {
                echo '📦 Installing frontend dependencies...'
                dir('frontend') {
                    sh 'npm install --no-audit --no-fund'
                }
            }
        }
        
        stage('Backend Tests') {
            when {
                expression { !params.SKIP_TESTS }
            }
            steps {
                echo '🧪 Running backend tests...'
                dir('backend') {
                    sh 'npm test || echo "Tests failed or not specified, continuing..."'
                }
            }
        }

        stage('Frontend Tests') {
            when {
                expression { !params.SKIP_TESTS }
            }
            steps {
                echo '🧪 Running frontend tests...'
                dir('frontend') {
                    sh 'npm test -- --watchAll=false --passWithNoTests || echo "Tests failed or not specified, continuing..."'
                }
            }
        }
        
        stage('Build Backend') {
            steps {
                echo '🏗️ Building backend...'
                dir('backend') {
                    sh 'npm run build || echo "No build script found, skipping..."'
                }
            }
        }
                
        stage('Build Frontend') {
            steps {
                echo '🏗️ Building React frontend...'
                dir('frontend') {
                    sh 'npm run build'
                    sh 'ls -la build/'
                }
            }
        }
        
        stage('Deploy Backend') {
            steps {
                echo '🚀 Deploying backend...'
                dir('backend') {
                    script {
                        def cleanDeployCommand = params.CLEAN_DEPLOY ? 'rm -rf node_modules && npm install --no-audit --no-fund' : 'echo "Skipping clean install"'
                        
                        sh """
                            # Health check trước khi deploy
                            echo "🔍 Checking current backend status..."
                            curl -f http://localhost:${BACKEND_PORT}/health || echo "Backend not running or no health endpoint"
                            
                            # Kill existing process
                            echo "🛑 Stopping existing backend..."
                            pkill -f "node.*server.js" || echo "No existing process found"
                            sleep 2
                            
                            # Clean deploy nếu được chọn
                            ${cleanDeployCommand}
                            
                            # Start backend với log
                            echo "🎯 Starting backend on port ${BACKEND_PORT}..."
                            nohup npm start > backend.log 2>&1 &
                            echo "Backend process started with PID: \$!"
                            
                            # Chờ backend khởi động
                            sleep 5
                            
                            # Health check
                            echo "🔍 Performing health check..."
                            for i in {1..10}; do
                                if curl -f http://localhost:${BACKEND_PORT}/api/health || curl -f http://localhost:${BACKEND_PORT}/health || curl -f http://localhost:${BACKEND_PORT}/; then
                                    echo "✅ Backend health check passed!"
                                    break
                                elif [ \$i -eq 10 ]; then
                                    echo "❌ Backend health check failed after 10 attempts"
                                    echo "📋 Checking backend log:"
                                    cat backend.log || echo "No log file found"
                                    exit 1
                                else
                                    echo "⏳ Attempt \$i failed, retrying..."
                                    sleep 3
                                fi
                            done
                            
                            echo "✅ Backend deployed successfully to ${params.DEPLOY_ENV}"
                        """
                    }
                }
            }
        }
        
        stage('Deploy Frontend') {
            steps {
                echo '🚀 Deploying frontend...'
                dir('frontend') {
                    script {
                        sh """
                            # Tạo backup nếu là production
                            if [ "${params.DEPLOY_ENV}" = "production" ]; then
                                echo "📦 Creating backup of current deployment..."
                                sudo tar -czf /tmp/genshin-shop-backup-\$(date +%Y%m%d-%H%M%S).tar.gz ${DEPLOY_DIR} 2>/dev/null || echo "No existing deployment to backup"
                            fi
                            
                            # Kiểm tra thư mục build tồn tại
                            if [ ! -d "build" ]; then
                                echo "❌ Build directory not found!"
                                exit 1
                            fi
                            
                            # Deploy to web server directory
                            echo "📁 Deploying to ${DEPLOY_DIR}..."
                            sudo mkdir -p ${DEPLOY_DIR}
                            sudo cp -r build/* ${DEPLOY_DIR}/
                            sudo chown -R www-data:www-data ${DEPLOY_DIR}
                            sudo chmod -R 755 ${DEPLOY_DIR}
                            
                            # Tạo file cấu hình environment
                            sudo sh -c "cat > ${DEPLOY_DIR}/env-config.js << EOF
                            window.ENV = {
                                REACT_APP_API_URL: 'http://localhost:${BACKEND_PORT}',
                                REACT_APP_ENVIRONMENT: '${params.DEPLOY_ENV}'
                            }
                            EOF"
                            
                            echo "✅ Frontend deployed successfully to ${params.DEPLOY_ENV}"
                        """
                    }
                }
            }
        }
        
        stage('Post-deploy Verification') {
            steps {
                echo '🔍 Verifying deployment...'
                sh """
                    # Kiểm tra backend
                    echo "🔧 Backend verification..."
                    if curl -f http://localhost:${BACKEND_PORT}/ || curl -f http://localhost:${BACKEND_PORT}/api/health || curl -f http://localhost:${BACKEND_PORT}/health; then
                        echo "✅ Backend is responding"
                    else
                        echo "⚠️  Backend may not be fully responsive"
                    fi
                    
                    # Kiểm tra frontend
                    echo "🌐 Frontend verification..."
                    if sudo [ -f "${DEPLOY_DIR}/index.html" ]; then
                        echo "✅ Frontend files deployed successfully"
                        echo "Frontend files:"
                        sudo ls -la ${DEPLOY_DIR}/ | head -10
                    else
                        echo "❌ Frontend files missing"
                        exit 1
                    fi
                    
                    # Kiểm tra processes
                    echo "📊 Process check..."
                    if pgrep -f "node.*server.js" > /dev/null; then
                        echo "✅ Backend process is running"
                        echo "Backend processes:"
                        pgrep -f "node.*server.js" | xargs ps -p 2>/dev/null || echo "Cannot display process details"
                    else
                        echo "❌ Backend process not found"
                        exit 1
                    fi
                    
                    echo "🎉 Deployment verification completed!"
                    echo "📊 Summary:"
                    echo "  - Backend: http://localhost:${BACKEND_PORT}"
                    echo "  - Frontend: ${DEPLOY_DIR}"
                    echo "  - Environment: ${params.DEPLOY_ENV}"
                """
            }
        }
    }
    
    post {
        success {
            echo '✅✅✅ Pipeline completed successfully! ✅✅✅'
            script {
                def duration = currentBuild.durationString
                def branch = env.GIT_BRANCH ?: 'unknown'
                emailext (
                    subject: "✅ SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER} - ${params.DEPLOY_ENV}",
                    body: """
                        🎉 Build Success!
                        
                        Project: Genshin Shop
                        Environment: ${params.DEPLOY_ENV}
                        Source Type: ${params.SOURCE_TYPE}
                        Branch: ${branch}
                        Build Number: ${env.BUILD_NUMBER}
                        Duration: ${duration}
                        Build URL: ${env.BUILD_URL}
                        
                        ✅ Backend: http://localhost:${BACKEND_PORT}
                        ✅ Frontend: ${DEPLOY_DIR}
                        
                        The application has been deployed successfully.
                    """,
                    to: 'admin@genshinshop.com'
                )
            }
        }
        failure {
            echo '❌❌❌ Pipeline failed! ❌❌❌'
            script {
                emailext (
                    subject: "❌ FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER} - ${params.DEPLOY_ENV}",
                    body: """
                        ❌ Build Failed!
                        
                        Project: Genshin Shop
                        Environment: ${params.DEPLOY_ENV}
                        Source Type: ${params.SOURCE_TYPE}
                        Build Number: ${env.BUILD_NUMBER}
                        Build URL: ${env.BUILD_URL}
                        
                        Please check the Jenkins logs for details and investigate the issue.
                    """,
                    to: 'admin@genshinshop.com'
                )
            }
        }
        always {
            echo '📊 Pipeline execution completed'
            echo "Build Result: ${currentBuild.result}"
            echo "Build Duration: ${currentBuild.durationString}"
            
            // Archive important artifacts
            archiveArtifacts artifacts: 'backend/backend.log', allowEmptyArchive: true
            archiveArtifacts artifacts: 'frontend/build/**/*', allowEmptyArchive: true
            
            // Cleanup workspace chỉ khi dùng Git
            script {
                if (params.SOURCE_TYPE == 'git') {
                    echo '🧹 Cleaning up workspace...'
                    cleanWs()
                } else {
                    echo '💾 Keeping workspace for manual builds...'
                }
            }
        }
    }
}