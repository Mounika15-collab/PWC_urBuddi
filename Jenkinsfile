pipeline {
    agent any
    
    tools {
        // This must match the exact name of your NodeJS installation in Manage Jenkins -> Tools
        nodejs 'NodeJS' 
    }

    stages {
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
                bat 'npx playwright install'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    bat 'npx playwright test"'
                }
            }
        }

        stage('Send Execution Report') {
            steps {
                bat 'npx ts-node utils/sendReport.ts'
            }
        }
    }
}