var AWS = require('aws-sdk');
var request = require('request');
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});


function sendresponse(event, responsestatus, responsedata, reason) {
    let payload = {
        'StackId': event.StackId,
        'Status' : responsestatus,
        'Reason' : reason,
        'RequestId': event.RequestId,
        'LogicalResourceId': event.LogicalResourceId,
        'PhysicalResourceId': event.LogicalResourceId + 'qwerty',
        'Data': responsedata
    };

    console.log(payload);

    //request.post(event.ResponseURL, payload);

    request(
        {
            method: 'PUT',
            uri: event.ResponseURL,
            headers:
                [
                    {
                        'content-type': 'application/json'
                    },
                ],
            body: JSON.stringify(payload)
        },
        function (error, response, body) {
            if(error){
                console.log(error);
            } else {
                console.log('status: '+ response.statusCode);
                console.log(body);
            }
        }
    )

}

module.exports.createClient = (event, context, callback) => {
    console.log(JSON.stringify(event));

    if (event.RequestType == 'Create') {
        let genSec = event.ResourceProperties.GenerateSecret == 'true' ? true : false;
        let params = {
            ClientName: event.ResourceProperties.ClientName, /* required */
            UserPoolId: event.ResourceProperties.UserPoolId, /* required */
            AllowedOAuthFlows: [
                'implicit'
            ],
            AllowedOAuthFlowsUserPoolClient: true,
            AllowedOAuthScopes: [
                'openid',
            ],
            CallbackURLs: [
                'https://aws.amazon.com',
            ],
            DefaultRedirectURI: 'https://aws.amazon.com',
            GenerateSecret: genSec,
            LogoutURLs: [
                'https://aws.amazon.com',
            ],
            SupportedIdentityProviders: [
                "COGNITO"
            ]
        };

        cognitoidentityserviceprovider.createUserPoolClient(params, function (err, data) {
            if (err) {
                console.log(err, err.stack);

                let response = {
                    'error': err,
                };
                sendresponse(event, "FAILED", response, "create failed");
            }
            else {
                console.log(data);           // successful response

                let response = {
                    'UserPoolClientId': data.UserPoolClient.ClientId,
                    'RedirectURI': data.UserPoolClient.DefaultRedirectURI
                };

                sendresponse(event, "SUCCESS", response, "");
            }
        });
    }

    if (event.RequestType == 'Delete') {
        let params = {
            ClientId: event.ResourceProperties.ClientId, /* required */
            UserPoolId: event.ResourceProperties.UserPoolId /* required */
        };
        cognitoidentityserviceprovider.deleteUserPoolClient(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);  // an error occurred

                let response = {
                    'error' : err,
                };
                sendresponse(event, "SUCCESS", response, "delete failed");
            }
            else  {
                console.log(data);  // successful response

                let response = {
                    'status': 'deleted'
                };

                sendresponse(event, "SUCCESS", response, "");
            }
        });
    }

    callback(null, 'Hello from Lambda');
};

module.exports.createDomain = (event, context, callback) => {
    console.log(JSON.stringify(event));

    if (event.RequestType == 'Create') {
        let params = {
            Domain: event.ResourceProperties.Domain, /* required */
            UserPoolId: event.ResourceProperties.UserPoolId /* required */
        };

        cognitoidentityserviceprovider.createUserPoolDomain(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);

                let response = {
                    'error' : err,
                };
                sendresponse(event, "FAILED", response, "create failed");
            }
            else {
                console.log(data);           // successful response

                let response = {
                    'Domain': event.ResourceProperties.Domain
                };

                sendresponse(event, "SUCCESS", response, "");
            }
        });
    }

    if (event.RequestType == 'Delete') {
        let params = {
            Domain: event.ResourceProperties.Domain, /* required */
            UserPoolId: event.ResourceProperties.UserPoolId /* required */
        };

        cognitoidentityserviceprovider.deleteUserPoolDomain(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);

                let response = {
                    'error' : err,
                };
                sendresponse(event, "SUCCESS", response, "delete failed");
            }
            else {
                console.log(data);           // successful response

                let response = {
                    'status': 'ok'
                };

                sendresponse(event, "SUCCESS", response, "");
            }
        });
    }

    callback(null, 'Hello from Lambda');
};

module.exports.createUser = (event, context, callback) => {
    console.log(JSON.stringify(event));

    if (event.RequestType == 'Create') {
        let params = {
            UserPoolId: event.ResourceProperties.UserPool, /* required */
            Username: event.ResourceProperties.UserName, /* required */
            DesiredDeliveryMediums: [
                "EMAIL"
                /* more items */
            ],
            ForceAliasCreation: false,
            MessageAction: 'SUPPRESS',
            TemporaryPassword: 'ccclogic1',
            UserAttributes: [
                {
                    Name: 'email', /* required */
                    Value: 'arawat@3clogic.com'
                },
                /* more items */
            ]
        };
        cognitoidentityserviceprovider.adminCreateUser(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);

                let response = {
                    'error' : err,
                };
                sendresponse(event, "FAILED", response, "create failed");
            }
            else {
                console.log(data);           // successful response

                let response = {
                    'UserName': event.ResourceProperties.UserName
                };

                sendresponse(event, "SUCCESS", response, "");
            }
        });
    }

    if (event.RequestType == 'Delete') {
        let params = {
            UserPoolId: event.ResourceProperties.UserPool, /* required */
            Username: event.ResourceProperties.UserName /* required */
        };
        cognitoidentityserviceprovider.adminDeleteUser(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);

                let response = {
                    'error' : err,
                };
                sendresponse(event, "SUCCESS", response, "delete failed");
            }
            else {
                console.log(data);           // successful response

                let response = {
                    'status': 'ok'
                };

                sendresponse(event, "SUCCESS", response, "");
            }
        });
    }
    callback(null, 'Hello from Lambda');
};