import cf from '@openaddresses/cloudfriend';

export default {
    Resources: {
        ContentAssetBucket: {
            Type: 'AWS::S3::Bucket',
            Properties: {
                BucketName: cf.join('-', [cf.stackName, cf.accountId, cf.region, 'content']),
                PublicAccessBlockConfiguration: {
                    RestrictPublicBuckets: true,
                    IgnorePublicAcls: true,
                    BlockPublicPolicy: true,
                    BlockPublicAcls: true
                },
                VersioningConfiguration: {
                    Status: 'Enabled'
                },
                CorsConfiguration: {
                    CorsRules: [{
                        AllowedHeaders: ['Content-Type', 'Content-Length'],
                        AllowedMethods: ['GET'],
                        AllowedOrigins: [cf.join(['https://', cf.ref('HostedURL')])]
                    }]
                },
                OwnershipControls: {
                    Rules: [{
                        ObjectOwnership: 'BucketOwnerEnforced'
                    }]
                },
                BucketEncryption: {
                    ServerSideEncryptionConfiguration: [{
                        BucketKeyEnabled: true,
                        ServerSideEncryptionByDefault: {
                            KMSMasterKeyID: cf.ref('KMS'),
                            SSEAlgorithm: 'aws:kms'
                        }
                    }]
                }
            }
        },
        PublicAssetBucketPolicy: {
            Type: 'AWS::S3::BucketPolicy',
            Properties: {
                Bucket: cf.ref('PublicAssetBucket'),
                PolicyDocument: {
                    Version: '2012-10-17',
                    Statement: [{
                        Sid: 'Statement1',
                        Effect: 'Allow',
                        Principal: '*',
                        Action: 's3:GetObject',
                        Resource: [
                            cf.join(['arn:', cf.partition, ':s3:::', cf.ref('PublicAssetBucket'), '/*']),
                            cf.join(['arn:', cf.partition, ':s3:::', cf.ref('PublicAssetBucket')])
                        ]
                    }]
                }
            }
        },
        PublicAssetBucket: {
            Type: 'AWS::S3::Bucket',
            Properties: {
                BucketName: cf.join('-', [cf.stackName, cf.accountId, cf.region, 'public']),
                PublicAccessBlockConfiguration: {
                    RestrictPublicBuckets: false,
                    IgnorePublicAcls: false,
                    BlockPublicPolicy: false,
                    BlockPublicAcls: false
                },
                CorsConfiguration: {
                    CorsRules: [{
                        AllowedHeaders: ['Content-Type', 'Content-Length'],
                        AllowedMethods: ['GET'],
                        AllowedOrigins: [cf.join(['https://', cf.ref('HostedURL')])]
                    }]
                },
                OwnershipControls: {
                    Rules: [{
                        ObjectOwnership: 'BucketOwnerEnforced'
                    }]
                },
                VersioningConfiguration: {
                    Status: 'Enabled'
                }
            }
        }
    }
};
