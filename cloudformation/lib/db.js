import cf from '@openaddresses/cloudfriend';

export default {
    Parameters: {
        DatabaseType: {
            Type: 'String',
            Default: 'db.t4g.micro',
            Description: 'Database size to create',
            AllowedValues: [
                'db.t4g.micro',

                // No Micro currnetly in GovCloud
                'db.t4g.small',

                // If more options are added be sure to update the PerformanceInsights Condition
                'db.m5.large'
            ]
        }
    },
    Resources: {
        DBMasterSecret: {
            Type: 'AWS::SecretsManager::Secret',
            Properties: {
                Description: cf.join([cf.stackName, ' RDS Master Password']),
                GenerateSecretString: {
                    SecretStringTemplate: '{"username": "frontend"}',
                    GenerateStringKey: 'password',
                    ExcludePunctuation: true,
                    PasswordLength: 32
                },
                Name: cf.join([cf.stackName, '/rds/secret']),
                KmsKeyId: cf.ref('KMS')
            }
        },
        DBMasterSecretAttachment: {
            Type: 'AWS::SecretsManager::SecretTargetAttachment',
            Properties: {
                SecretId: cf.ref('DBMasterSecret'),
                TargetId: cf.ref('DBInstance'),
                TargetType: 'AWS::RDS::DBInstance'
            }
        },
        DBMonitoringRole: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Version: '2012-10-17',
                    Statement: [{
                        Sid: '',
                        Effect: 'Allow',
                        Principal: {
                            Service: 'monitoring.rds.amazonaws.com'
                        },
                        Action: 'sts:AssumeRole'
                    }]
                },
                ManagedPolicyArns: [
                    cf.join(['arn:', cf.partition, ':iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole'])
                ],
                Path: '/'
            }
        },
        DBInstance: {
            Type: 'AWS::RDS::DBInstance',
            DependsOn: ['DBMasterSecret'],
            Properties: {
                Engine: 'MySQL',
                AllowMajorVersionUpgrade: false,
                DBName: 'frontend',
                CopyTagsToSnapshot: true,
                DBInstanceIdentifier: cf.stackName,
                MonitoringInterval: 60,
                MonitoringRoleArn: cf.getAtt('DBMonitoringRole', 'Arn'),
                KmsKeyId: cf.ref('KMS'),
                EngineVersion: '8.4.6',
                PreferredMaintenanceWindow: 'Sun:22:00-Sun:22:30',
                StorageEncrypted: true,
                MasterUsername: cf.sub('{{resolve:secretsmanager:${AWS::StackName}/rds/secret:SecretString:username:AWSCURRENT}}'),
                MasterUserPassword: cf.sub('{{resolve:secretsmanager:${AWS::StackName}/rds/secret:SecretString:password:AWSCURRENT}}'),
                EnablePerformanceInsights: cf.if('PerformanceInsightsEnabled', true, false),
                PerformanceInsightsRetentionPeriod: cf.if('PerformanceInsightsEnabled', 7, cf.noValue),
                PerformanceInsightsKMSKeyId: cf.if('PerformanceInsightsEnabled', cf.ref('KMS'), cf.noValue),
                AllocatedStorage: 50,
                MaxAllocatedStorage: 100,
                BackupRetentionPeriod: 10,
                StorageType: 'gp3',
                DBInstanceClass: cf.ref('DatabaseType'),
                VPCSecurityGroups: [cf.ref('DBVPCSecurityGroup')],
                DBSubnetGroupName: cf.ref('DBSubnet'),
                PubliclyAccessible: true,
                DeletionProtection: true
            }
        },
        DBSubnet: {
            Type: 'AWS::RDS::DBSubnetGroup',
            Properties: {
                DBSubnetGroupDescription: cf.join('-', [cf.stackName, 'rds-subnets']),
                SubnetIds: [
                    cf.importValue(cf.join(['tak-vpc-', cf.ref('Environment'), '-subnet-private-a'])),
                    cf.importValue(cf.join(['tak-vpc-', cf.ref('Environment'), '-subnet-private-b']))
                ]
            }
        },
        DBVPCSecurityGroup: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                Tags: [{
                    Key: 'Name',
                    Value: cf.join('-', [cf.stackName, 'rds-sg'])
                }],
                GroupName: cf.join('-', [cf.stackName, 'rds-sg']),
                GroupDescription: 'Allow RDS Database Ingress',
                VpcId: cf.importValue(cf.join(['tak-vpc-', cf.ref('Environment'), '-vpc'])),
                SecurityGroupIngress: [{
                    IpProtocol: 'TCP',
                    FromPort: 3306,
                    ToPort: 3306,
                    SourceSecurityGroupId: cf.getAtt('InstanceSecurityGroup', 'GroupId')
                },{
                    IpProtocol: 'TCP',
                    FromPort: 3306,
                    ToPort: 3306,
                    CidrIp: cf.importValue(cf.join(['tak-vpc-', cf.ref('Environment'), '-vpc-cidr'])),
                    Description: 'Allow Ingress from within VPC'
                }]
            }
        }
    },
    Conditions: {
        PerformanceInsightsEnabled: cf.equals(cf.findInMap('DatabaseConfig', cf.select(1, cf.split('.', cf.ref('DatabaseType'))), 'PerformanceInsights'), true)
    },
    Mappings: {
        DatabaseConfig: {
            'm5': {
                PerformanceInsights: true
            },
            't4g': {
                PerformanceInsights: false
            },
            't3': {
                PerformanceInsights: false
            }
        }
    },
    Outputs: {
        DB: {
            Description: 'MySQL Connection String',
            Value: cf.join([
                'Server=', cf.getAtt('DBInstance', 'Endpoint.Address'), '; ',
                'Port=3306; ',
                'Database=frontend; ',
                'Uid=', cf.sub('{{resolve:secretsmanager:${AWS::StackName}/rds/secret:SecretString:username:AWSCURRENT}}'), '; ',
                'Pwd=', cf.sub('{{resolve:secretsmanager:${AWS::StackName}/rds/secret:SecretString:password:AWSCURRENT}}'), '; '
            ])
        }
    }
};
