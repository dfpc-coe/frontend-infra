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
                Policies: [{
                    PolicyName: cf.join('-', [cf.stackName, 'api-policy']),
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
                        }]
                    }
                }],
                Path: '/'
            }
        },
    }
};
