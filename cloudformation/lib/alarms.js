import cf from '@openaddresses/cloudfriend';

export default {
    Resources: {
        AlarmTopic: {
            Type: 'AWS::SNS::Topic',
            Properties: {
                DisplayName: cf.stackName,
                TopicName: cf.stackName
            }
        },
    }
};
