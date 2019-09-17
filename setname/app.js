// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const { TABLE_NAME } = process.env;

exports.handler = async (event, context) => {

  console.log("path = "+ JSON.stringify(event));


  var postData = JSON.parse(event.body).data;

  var params = {
    TableName: TABLE_NAME,
    Key:{
      "connectionId":event.requestContext.connectionId
    },
    UpdateExpression: "set nickname = :r",
    ExpressionAttributeValues:{
        ":r":postData
    },
    ReturnValues:"UPDATED_NEW"
  };
  
  console.log("Updating the item...");
  await ddb.update(params, function(err, data) {
      if (err) {
          console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
      }
  }).promise();

  return { statusCode: 200, body: 'Update success.' };
};
