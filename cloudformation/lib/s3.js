import cf from '@openaddresses/cloudfriend';

export default {
    Resources: {
        ContentAssetBucket: {
            Type: 'AWS::S3::Bucket',
            Properties: {
                BucketName: cf.join('-', [cf.stackName, cf.accountId, cf.region, 'content'])
            }
        },
        PublicAssetBucket: {
            Type: 'AWS::S3::Bucket',
            Properties: {
                BucketName: cf.join('-', [cf.stackName, cf.accountId, cf.region, 'public'])
            }
        }
    }
};
