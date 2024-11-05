import cf from '@openaddresses/cloudfriend';

export default {
    Parameters: {
        InstanceId: {
            Description: 'ECS Instance ID the frontend is deployed to',
            Type: 'String'
        },
    },
    Resources: {
        Logs: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: cf.stackName,
                RetentionInDays: 7
            }
        },
        ELB: {
            Type: 'AWS::ElasticLoadBalancingV2::LoadBalancer',
            Properties: {
                Name: cf.stackName,
                Type: 'application',
                SecurityGroups: [cf.ref('ELBSecurityGroup')],
                LoadBalancerAttributes: [{
                    Key: 'idle_timeout.timeout_seconds',
                    Value: 4000
                },{
                    Key: 'connection_logs.s3.enabled',
                    Value: true
                },{
                    Key: 'connection_logs.s3.bucket',
                    Value: cf.importValue(cf.join(['coe-elb-logs-', cf.ref('Environment'), '-bucket']))
                },{
                    Key: 'connection_logs.s3.prefix',
                    Value: cf.stackName
                },{
                    Key: 'access_logs.s3.enabled',
                    Value: true
                },{
                    Key: 'access_logs.s3.bucket',
                    Value: cf.importValue(cf.join(['coe-elb-logs-', cf.ref('Environment'), '-bucket']))
                },{
                    Key: 'access_logs.s3.prefix',
                    Value: cf.stackName
                }],
                Subnets:  [
                    cf.importValue(cf.join(['coe-vpc-', cf.ref('Environment'), '-subnet-public-a'])),
                    cf.importValue(cf.join(['coe-vpc-', cf.ref('Environment'), '-subnet-public-b']))
                ]
            }

        },
        ELBSecurityGroup: {
            Type : 'AWS::EC2::SecurityGroup',
            Properties : {
                Tags: [{
                    Key: 'Name',
                    Value: cf.join('-', [cf.stackName, 'elb-sg'])
                }],
                GroupName: cf.join('-', [cf.stackName, 'elb-sg']),
                GroupDescription: 'Allow 443 and 80 Access to ELB',
                SecurityGroupIngress: [{
                    CidrIp: '0.0.0.0/0',
                    IpProtocol: 'tcp',
                    FromPort: 443,
                    ToPort: 443
                },{
                    CidrIp: '0.0.0.0/0',
                    IpProtocol: 'tcp',
                    FromPort: 80,
                    ToPort: 80
                }],
                VpcId: cf.importValue(cf.join(['coe-vpc-', cf.ref('Environment'), '-vpc']))
            }
        },
        HttpsListener: {
            Type: 'AWS::ElasticLoadBalancingV2::Listener',
            Properties: {
                Certificates: [{
                    CertificateArn: cf.join(['arn:', cf.partition, ':acm:', cf.region, ':', cf.accountId, ':certificate/', cf.ref('SSLCertificateIdentifier')])
                }],
                DefaultActions: [{
                    Type: 'forward',
                    TargetGroupArn: cf.ref('TargetGroup')
                }],
                LoadBalancerArn: cf.ref('ELB'),
                Port: 443,
                Protocol: 'HTTPS'
            }
        },
        HttpListener: {
            Type: 'AWS::ElasticLoadBalancingV2::Listener',
            Properties: {
                DefaultActions: [{
                    Type: 'redirect',
                    RedirectConfig: {
                        Protocol: 'HTTPS',
                        StatusCode: 'HTTP_301',
                        Port: 443
                    }
                }],
                LoadBalancerArn: cf.ref('ELB'),
                Port: 80,
                Protocol: 'HTTP'
            }
        },
        TargetGroup: {
            Type: 'AWS::ElasticLoadBalancingV2::TargetGroup',
            DependsOn: 'ELB',
            Properties: {
                HealthCheckEnabled: true,
                HealthCheckIntervalSeconds: 30,
                HealthCheckPath: '/',
                Port: 80,
                Protocol: 'HTTP',
                TargetType: 'instance',
                Targets: [{
                    Id: cf.ref('InstanceId')
                }],
                VpcId: cf.importValue(cf.join(['coe-vpc-', cf.ref('Environment'), '-vpc'])),
                Matcher: {
                    HttpCode: '200,202,302,304'
                }
            }
        },
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
