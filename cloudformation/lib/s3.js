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
                    Status: "Enabled"
                },
                OwnershipControls: {
                    Rules: [{
                        ObjectOwnership: "BucketOwnerEnforced"
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
                OwnershipControls: {
                    Rules: [{
                        ObjectOwnership: "BucketOwnerEnforced"
                    }]
                },
                VersioningConfiguration: {
                    Status: "Enabled"
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
        }
    }
};
