pipeline {
    agent {
        node {
            label 'master'
        }
    }
    triggers {
        pollSCM('H/5 * * * *')
    }
    options {
        buildDiscarder(logRotator(numToKeepStr: '10', artifactNumToKeepStr: '10'))
    }
    stages {
        stage('Clean') {
            steps {
                sh "rm -rf ${WORKSPACE}/dist/*"
                sh "rm -rf ${WORKSPACE}/reports/*"
                sh "rm -rf ${WORKSPACE}/coverage/*"
                sh "mkdir -p ${WORKSPACE}/reports"
            }
        }
        stage('Init submodules') {
            steps {
                sh "git submodule init"
                sh "git submodule update"
            }
        }
        stage('Build Angular') {
            steps {
                sh "npm install"
                sh "npm run build-prod -- --verbose --base-href ${params.BASE_REF}"
            }
        }
        stage('Lint') {
            steps {
                sh "npm run lint-junit"
                junit allowEmptyResults: true, testResults: 'reports/**/lint-results.xml'
            }
        }
        stage('Compodoc') {
            steps {
                sh "npm run compodoc"
                publishHTML (target: [
                  allowMissing: true,
                  alwaysLinkToLastBuild: false,
                  keepAll: true,
                  reportDir: 'reports/documentation',
                  reportFiles: 'index.html',
                  reportName: "Compodoc"
                ])
            }
        }
        stage('Test') {
            steps {
                sh "npm run test"
                junit allowEmptyResults: true, testResults: 'reports/**/test-results.xml'
            }
        }
    }
}
