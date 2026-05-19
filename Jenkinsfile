pipeline {
    agent any
    
    tools 
    {
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