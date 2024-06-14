import cf from '@openaddresses/cloudfriend';

export default {
    Resources: {
        ApplicationInstanceProfile: {
            Type: 'AWS::IAM::InstanceProfile',
            Properties: {
                InstanceProfileName: cf.stackName,
                Roles: [ cf.ref('ApplicationRole') ]
            }
        },
        ApplicationPolicy: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyName: cf.join('-', [cf.stackName, cf.accountId, cf.region, 'api-policy']),
                Roles: [cf.ref('ApplicationRole')],
                Groups: [cf.ref('ApplicationGroup')],
                PolicyDocument: {
                    Statement: [{
                        Effect: 'Allow',
                        Resource: [
                            cf.join(['arn:', cf.partition, ':s3:::', cf.ref('ContentAssetBucket')]),
                            cf.join(['arn:', cf.partition, ':s3:::', cf.ref('ContentAssetBucket'), '/*']),
                            cf.join(['arn:', cf.partition, ':s3:::', cf.ref('PublicAssetBucket')]),
                            cf.join(['arn:', cf.partition, ':s3:::', cf.ref('PublicAssetBucket'), '/*'])
                        ],
                        Action: '*'
                    },{
                        Effect: "Allow",
                        Action: [
                            'sms-voice:DeleteOptedOutNumber',
                            'sms-voice:PutOptedOutNumber',
                            'sms-voice:CheckIfPhoneNumberIsOptedOut',
                            'sms-voice:Get*',
                            'sms-voice:Describe*',
                            'sms-voice:List*',
                            'sms-voice:Verify*',
                            'sms-voice:Send*'
                        ],
                        Resource: '*'
                    },{
                        Effect: 'Allow',
                        Resource: [ cf.getAtt('KMS', 'Arn') ],
                        Action: [
                            'kms:Decrypt',
                            'kms:GenerateDataKey'
                        ]
                    }]
                }
            }
        },
        ApplicationGroup: {
            Type: 'AWS::IAM::Group',
            Properties: {
                GroupName: cf.join('-', [cf.stackName, cf.accountId, cf.region]),
            }
        },
        ApplicationRole: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Version: '2012-10-17',
                    Statement: [{
                        Sid: '',
                        Effect: 'Allow',
                        Principal: {
                            Service: 'ec2.amazonaws.com'
                        },
                        Action: 'sts:AssumeRole'
                    }]
                },
                Path: '/'
            }
        },
    }
};
