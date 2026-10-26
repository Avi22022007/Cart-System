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
                    powershell '''
                        $ErrorActionPreference = 'Stop'
                        $token = $env:DOCKER_TOKEN
                        $token | & $env:DOCKER login --username $env:DOCKER_USER --password-stdin

                        if ($LASTEXITCODE -ne 0) {
                            throw "DockerHub login failed"
                        }

                        & $env:DOCKER push $env:IMAGE

                        if ($LASTEXITCODE -ne 0) {
                            throw "DockerHub push failed"
                        }
                    '''
                }
            }
        }
    }
}