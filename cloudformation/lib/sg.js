import cf from '@openaddresses/cloudfriend';

export default {
    Resources: {
        ServiceSecurityGroup: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                Tags: [{
                    Key: 'Name',
                    Value: cf.join('-', [cf.stackName, 'ec2-sg'])
                }],
                GroupName: cf.join('-', [cf.stackName, 'ec2-sg']),
                GroupDescription: 'EC2s in this SG have access to the MySQL Database',
                VpcId: cf.importValue(cf.join(['coe-vpc-', cf.ref('Environment'), '-vpc'])),
                SecurityGroupIngress: [{
                    Description: 'ELB Traffic',
                    SourceSecurityGroupId: cf.ref('ELBSecurityGroup'),
                    IpProtocol: 'tcp',
                    FromPort: 80,
                    ToPort: 80
                },{
                    Description: 'AWS EC2 Connect internal VPC Endpoint',
                    SourceSecurityGroupId: cf.importValue(cf.join(['coe-vpc-', cf.ref('Environment'), '-connect-public-a-sg'])),
                    IpProtocol: 'tcp',
                    FromPort: 22,
                    ToPort: 22
                },{
                    Description: 'Forge Deploy IP: https://forge.laravel.com/ips-v4.txt #1',
                    CidrIp: '159.203.150.232/32',
                    IpProtocol: 'tcp',
                    FromPort: 22,
                    ToPort: 22
                },{
                    Description: 'Forge Deploy IP: https://forge.laravel.com/ips-v4.txt #2',
                    CidrIp: '45.55.124.124/32',
                    IpProtocol: 'tcp',
                    FromPort: 22,
                    ToPort: 22
                },{
                    Description: 'Forge Deploy IP: https://forge.laravel.com/ips-v4.txt #3',
                    CidrIp: '159.203.150.216/32',
                    IpProtocol: 'tcp',
                    FromPort: 22,
                    ToPort: 22
                }],
            }
        }
    }
};
