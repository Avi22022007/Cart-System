pipeline {
    agent any

    environment {
        IMAGE = 'avi22022007/cart-system:v2'
        DOCKER = 'C:\\Users\\avied\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe'
    }

    stages {
        stage('Checkout Verification') {
            steps {
                bat 'git log -1 --oneline'
            }
        }

        stage('Docker Build') {
            steps {
                bat '"%DOCKER%" build -t %IMAGE% .'
            }
        }

        stage('DockerHub Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-cart',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_TOKEN'
                )]) {
                    bat '''
                        @echo off
                        setlocal DisableDelayedExpansion

                        set "DOCKER_CONFIG=%WORKSPACE%\\docker-auth"
                        if not exist "%DOCKER_CONFIG%" mkdir "%DOCKER_CONFIG%"

                        echo ===== DockerHub Login =====
                        echo %DOCKER_TOKEN%| "%DOCKER%" login --username "%DOCKER_USER%" --password-stdin
                        if errorlevel 1 exit /b 1

                        echo ===== DockerHub Push =====
                        "%DOCKER%" push "%IMAGE%"
                        if errorlevel 1 exit /b 1

                        "%DOCKER%" logout
                        if errorlevel 1 exit /b 1
                    '''
                }
            }
        }

        stage('Kubernetes Deploy') {
            steps {
                withCredentials([file(
                    credentialsId: 'cart-kubeconfig',
                    variable: 'KUBECONFIG'
                )]) {
                    bat '''
                        @echo off
                        set "KUBECTL=C:\\Users\\avied\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\kubectl.exe"

                        echo ===== Apply Kubernetes Configuration =====
                        "%KUBECTL%" apply -f k8s/v2.yaml
                        if errorlevel 1 exit /b 1

                        echo ===== Restart Deployment =====
                        "%KUBECTL%" rollout restart deployment/cart-v2
                        if errorlevel 1 exit /b 1

                        echo ===== Wait for Deployment =====
                        "%KUBECTL%" rollout status deployment/cart-v2 --timeout=120s
                        if errorlevel 1 exit /b 1

                        echo ===== Deployment Status =====
                        "%KUBECTL%" get deployment cart-v2
                        if errorlevel 1 exit /b 1
                    '''
                }
            }
        }
    }

    post {
        always {
            bat '''
                @echo off
                if exist "%WORKSPACE%\\docker-auth" rmdir /s /q "%WORKSPACE%\\docker-auth"
            '''
        }
    }
}