pipeline {
    agent any

    environment {
        IMAGE = 'avi22022007/cart-system:v1'
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