import cf from '@openaddresses/cloudfriend';

export default {
    Resources: {
        NotifyTopic: {
            Type: 'AWS::SNS::Topic',
            Properties: {
                DisplayName: cf.join([cf.stackName, '-notify']),
                TopicName: cf.join([cf.stackName, '-notify'])
            }
        }
    }
};
