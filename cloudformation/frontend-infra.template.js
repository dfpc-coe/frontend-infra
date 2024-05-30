import cf from '@openaddresses/cloudfriend';
import SG from './lib/sg.js';
import RDS from './lib/db.js';
import Alarms from './lib/alarms.js';
import S3 from './lib/s3.js';
import KMS from './lib/kms.js';
import SMS from './lib/sms.js';
import API from './lib/api.js';
import {
    RDS as RDSAlarms
} from '@openaddresses/batch-alarms';

export default cf.merge(
    S3, SG, RDS, SMS, KMS, Alarms, API,
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
            }
        }
    },
    RDSAlarms({
        prefix: 'Batch',
        topic: cf.ref('AlarmTopic'),
        instance: cf.ref('DBInstance')
    })
);
