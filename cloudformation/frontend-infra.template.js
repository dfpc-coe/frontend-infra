import cf from '@openaddresses/cloudfriend';
import RDS from './lib/db.js';
import Alarms from './lib/alarms.js';
import S3 from './lib/s3.js';
import KMS from './lib/kms.js';
import API from './lib/api.js';
import {
    ELB as ELBAlarms,
    RDS as RDSAlarms
} from '@openaddresses/batch-alarms';

export default cf.merge(
    S3, RDS, KMS, Alarms, API,
    {
        Description: 'Template for @tak-ps/frontend-infra',
        Parameters: {
            GitSha: {
                Description: 'GitSha that is currently being deployed',
                Type: 'String'
            },
            Environment: {
                Description: 'VPC/ECS Stack to deploy into',
                Type: 'String',
                Default: 'prod'
            },
            HostedURL: {
                Description: 'URL of domain/subdomain at which the API is hosted ie: "example.com"',
                Type: 'String'
            },
            SSLCertificateIdentifier: {
                Description: 'ACM SSL Certificate for top level wildcard: *.example.com and second level *.map.example.com',
                Type: 'String'
            }
        }
    },
    ELBAlarms({
        prefix: 'elb',
        topic: cf.ref('AlarmTopic'),
        loadbalancer: cf.getAtt('ELB', 'LoadBalancerFullName'),
        targetgroup: cf.getAtt('TargetGroup', 'TargetGroupFullName')
    }),
    RDSAlarms({
        prefix: 'rds',
        topic: cf.ref('AlarmTopic'),
        instance: cf.ref('DBInstance')
    })
);
