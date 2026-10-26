pipeline {
    agent any

    stages {
        stage('Checkout Verification') {
            steps {
                echo 'Cart System v1 - Jenkins Pipeline'

                bat '''
                    @echo off
                    git log -1 --oneline
                '''
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Cart System v1 Docker image'

                bat '''
                    @echo off
                    "C:\\Users\\avied\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe" build -t avi22022007/cart-system:v1 .
                    if errorlevel 1 exit /b 1
                '''
            }
        }
    }
}