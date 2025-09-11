import cf from '@openaddresses/cloudfriend';

const ForgeKeys = [];

export default {
    Parameters: {
        LatestUbuntuAMI: {
            Description: 'AMI of Graviton compatible Ubuntu AMI',
            Type: 'String'
        },
        InstanceType: {
            Description: 'EC2 Instance Type',
            Type: 'String',
            Default: 't4g.micro',
            AllowedValues: [
                't4g.micro',
                't4g.small',
                't4g.medium',
                't4g.large'
            ]
        },
        SubdomainPrefix: {
            Description: 'Subdomain prefix for the API (e.g. api, app, etc) - leave empty for root domain',
            Type: 'String',
            Default: ''
        }
    },
    Resources: {
        ELBNS: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                HostedZoneId: cf.importValue(cf.join(['tak-vpc-', cf.ref('Environment'), '-hosted-zone-id'])),
                Type : 'A',
                Name: cf.if(
                    'isRootDomain',
                    cf.importValue(cf.join(['tak-vpc-', cf.ref('Environment'), '-hosted-zone-name'])),
                    cf.join([cf.ref('SubdomainPrefix'), '.', cf.importValue(cf.join(['tak-vpc-', cf.ref('Environment'), '-hosted-zone-name']))])
                ),
                Comment: cf.join(' ', [cf.stackName, 'UI/API DNS Entry']),
                AliasTarget: {
                    DNSName: cf.getAtt('ELB', 'DNSName'),
                    EvaluateTargetHealth: true,
                    HostedZoneId: cf.getAtt('ELB', 'CanonicalHostedZoneID')
                }
            }
        },
        InstanceASG: {
            Type: 'AWS::AutoScaling::AutoScalingGroup',
            Properties: {
                AutoScalingGroupName: cf.stackName,
                LaunchTemplate: {
                    LaunchTemplateId: cf.ref('InstanceLaunchConfig'),
                    Version: cf.getAtt('InstanceLaunchConfig', 'LatestVersionNumber')
                },
                TargetGroupARNs: [cf.ref('TargetGroup')],
                InstanceMaintenancePolicy: {
                    MaxHealthyPercentage: 200,
                    MinHealthyPercentage: 100
                },
                VPCZoneIdentifier: [
                    cf.importValue(cf.join(['tak-vpc-', cf.ref('Environment'), '-subnet-public-a'])),
                    cf.importValue(cf.join(['tak-vpc-', cf.ref('Environment'), '-subnet-public-b']))
                ],
                MinSize: '1',
                DesiredCapacity: '1',
                MaxSize: '1',
                Tags: [{
                    Key: 'Name',
                    Value: cf.stackName,
                    PropagateAtLaunch: true
                }]
            }
        },
        InstanceLaunchConfig: {
            Type: 'AWS::EC2::LaunchTemplate',
            Metadata: {
                'AWS::CloudFormation::Init': {
                    package_update: true,
                    package_upgrade: true,
                    package_reboot_if_required: true,
                    configSets: {
                        default: ['setup_users', 'sources']
                    },
                    setup_users: {
                        files: {
                            '/home/ubuntu/.ssh/authorized_keys': {
                                content: ForgeKeys.map((User) => { return User.Key; }).join('\n'),
                                mode: '000600',
                                owner: 'ubuntu',
                                group: 'ubuntu'
                            }
                        }
                    },
                    sources: {
                        packages: {
                            apt: {
                                wget: []
                            }
                        },
                        commands: {
                            '001': {
                                command: 'apt-get update'
                            }
                        }
                    }
                }
            },
            Properties: {
                LaunchTemplateName: cf.stackName,
                LaunchTemplateData: {
                    ImageId: cf.ref('LatestUbuntuAMI'),
                    InstanceType: cf.ref('InstanceType'),
                    NetworkInterfaces: [{
                        AssociatePublicIpAddress: true,
                        DeviceIndex: 0,
                        DeleteOnTermination: true,
                        Groups: [
                            cf.getAtt('InstanceSecurityGroup', 'GroupId')
                        ]
                    }],
                    IamInstanceProfile: {
                        Arn: cf.getAtt('InstanceProfile', 'Arn')
                    },
                    UserData: cf.base64(cf.sub([
                        '#!/bin/bash',
                        'set -euo pipefail',

                        'apt-get update -y',

                        'sed -i "s/#PasswordAuthentication yes/PasswordAuthentication no/" /etc/ssh/sshd_config',
                        'sed -i "s/PasswordAuthentication yes/PasswordAuthentication no/" /etc/ssh/sshd_config',
                        'sed -i "s/#PermitRootLogin yes/PermitRootLogin no/" /etc/ssh/sshd_config',
                        'sed -i "s/PermitRootLogin yes/PermitRootLogin no/" /etc/ssh/sshd_config',
                        'sed -i "s/#PubkeyAuthentication yes/PubkeyAuthentication yes/" /etc/ssh/sshd_config',

                        'systemctl restart ssh',

                        'apt-get install -y ufw python3-pip python3-setuptools',

                        'ufw --force enable',
                        'ufw allow ssh',
                        'ufw --force reload',

                        'export DEBIAN_FRONTEND=noninteractive',

                        // Ref https://repost.aws/knowledge-center/install-cloudformation-scripts
                        'mkdir -p /opt/aws/',
                        'pip3 install --break-system-packages https://s3.amazonaws.com/cloudformation-examples/aws-cfn-bootstrap-py3-latest.tar.gz',

                        'ln -s /usr/local/init/ubuntu/cfn-hup /etc/init.d/cfn-hup',

                        '/usr/local/bin/cfn-init --verbose --stack ${AWS::StackName} --resource InstanceLaunchConfig --region ${AWS::Region}',
                        '/usr/local/bin/cfn-signal -e $? --stack ${AWS::StackName} --resource InstanceLaunchConfig --region ${AWS::Region}'
                    ].join('\n')))
                }
            }
        },
        InstanceProfile: {
            Type: 'AWS::IAM::InstanceProfile',
            Properties: {
                Roles: [cf.ref('InstanceRole')]
            }
        },
        InstanceRole: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Version: '2012-10-17',
                    Statement: [{
                        Effect: 'Allow',
                        Principal: { Service: 'ec2.amazonaws.com' },
                        Action: 'sts:AssumeRole'
                    }]
                },
                ManagedPolicyArns: [
                    cf.join(['arn:', cf.partition, ':iam::aws:policy/AmazonSSMManagedInstanceCore'])
                ]
            }
        },
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
                    Value: cf.importValue(cf.join(['tak-vpc-', cf.ref('Environment'), '-bucket']))
                },{
                    Key: 'connection_logs.s3.prefix',
                    Value: cf.stackName
                },{
                    Key: 'access_logs.s3.enabled',
                    Value: true
                },{
                    Key: 'access_logs.s3.bucket',
                    Value: cf.importValue(cf.join(['tak-vpc-', cf.ref('Environment'), '-bucket']))
                },{
                    Key: 'access_logs.s3.prefix',
                    Value: cf.stackName
                }],
                Subnets:  [
                    cf.importValue(cf.join(['tak-vpc-', cf.ref('Environment'), '-subnet-public-a'])),
                    cf.importValue(cf.join(['tak-vpc-', cf.ref('Environment'), '-subnet-public-b']))
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
                VpcId: cf.importValue(cf.join(['tak-vpc-', cf.ref('Environment'), '-vpc']))
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
                VpcId: cf.importValue(cf.join(['tak-vpc-', cf.ref('Environment'), '-vpc'])),
                Matcher: {
                    HttpCode: '200,202,302,304'
                }
            }
        },
        ApplicationInstanceProfile: {
            Type: 'AWS::IAM::InstanceProfile',
            Properties: {
                InstanceProfileName: cf.stackName,
                Roles: [cf.ref('ApplicationRole')]
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
                            cf.join(['arn:', cf.partition, ':s3:::', cf.ref('PublicAssetBucket'), '/*']),
                            cf.join(['arn:', cf.partition, ':s3:::', cf.ref('TemporaryAssetBucket')]),
                            cf.join(['arn:', cf.partition, ':s3:::', cf.ref('TemporaryAssetBucket'), '/*'])
                        ],
                        Action: '*'
                    },{
                        Effect: 'Allow',
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
                        Resource: [cf.getAtt('KMS', 'Arn')],
                        Action: [
                            'kms:Decrypt',
                            'kms:GenerateDataKey'
                        ]
                    }]
                }
            }
        },
        InstanceSecurityGroup: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                Tags: [{
                    Key: 'Name',
                    Value: cf.join('-', [cf.stackName, 'ec2-sg'])
                }],
                GroupName: cf.join('-', [cf.stackName, 'ec2-sg']),
                GroupDescription: 'EC2s in this SG have access to the MySQL Database',
                VpcId: cf.importValue(cf.join(['tak-vpc-', cf.ref('Environment'), '-vpc'])),
                SecurityGroupIngress: [{
                    Description: 'ELB Traffic',
                    SourceSecurityGroupId: cf.ref('ELBSecurityGroup'),
                    IpProtocol: 'tcp',
                    FromPort: 80,
                    ToPort: 80
                }, {
                    Description: 'Internal SSH Traffic',
                    CidrIp: cf.importValue(cf.join(['tak-vpc-', cf.ref('Environment'), '-vpc-cidr'])),
                    IpProtocol: 'tcp',
                    FromPort: 22,
                    ToPort: 22
                }, {
                    Description: 'AWS EC2 Connect internal VPC Endpoint',
                    SourceSecurityGroupId: cf.importValue(cf.join(['tak-vpc-', cf.ref('Environment'), '-connect-public-a-sg'])),
                    IpProtocol: 'tcp',
                    FromPort: 22,
                    ToPort: 22
                }, {
                    Description: 'Forge Deploy IP: https://forge.laravel.com/ips-v4.txt #1',
                    CidrIp: '159.203.150.232/32',
                    IpProtocol: 'tcp',
                    FromPort: 22,
                    ToPort: 22
                }, {
                    Description: 'Forge Deploy IP: https://forge.laravel.com/ips-v4.txt #2',
                    CidrIp: '45.55.124.124/32',
                    IpProtocol: 'tcp',
                    FromPort: 22,
                    ToPort: 22
                }, {
                    Description: 'Forge Deploy IP: https://forge.laravel.com/ips-v4.txt #3',
                    CidrIp: '159.203.150.216/32',
                    IpProtocol: 'tcp',
                    FromPort: 22,
                    ToPort: 22
                }, {
                    Description: 'Forge Deploy IP: https://forge.laravel.com/ips-v4.txt #4',
                    CidrIp: '165.227.248.218/32',
                    IpProtocol: 'tcp',
                    FromPort: 22,
                    ToPort: 22
                }]
            }
        },
        ApplicationGroup: {
            Type: 'AWS::IAM::Group',
            Properties: {
                GroupName: cf.join('-', [cf.stackName, cf.accountId, cf.region])
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
                Path: '/',
                ManagedPolicyArns: [
                    cf.join(['arn:', cf.partition, ':iam::aws:policy/AmazonSSMManagedInstanceCore'])
                ]
            }
        }
    },
    Conditions: {
        isRootDomain: cf.equals(cf.ref('SubdomainPrefix'), '')
    }
};
