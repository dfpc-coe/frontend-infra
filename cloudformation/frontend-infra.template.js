import cf from '@openaddresses/cloudfriend';
import SG from './lib/sg.js';
import RDS from './lib/db.js';
import KMS from './lib/kms.js';

export default cf.merge(
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
        },
    }, SG, RDS, KMS
);
