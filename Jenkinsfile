pipeline {
    agent any

    stages {
        stage('Checkout Verification') {
            steps {
                echo 'Cart System v1 - Jenkins Pipeline'

                bat '''
                    @echo off
                    echo ===== GIT =====
                    git --version

                    echo ===== CURRENT COMMIT =====
                    git log -1 --oneline

                    echo ===== PROJECT FILES =====
                    dir
                '''
            }
        }
    }
}