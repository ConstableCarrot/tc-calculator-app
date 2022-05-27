import {NextApiRequest, NextApiResponse} from "next";
import AWS, {DynamoDB} from "aws-sdk";
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import QueryInput = DocumentClient.QueryInput;

AWS.config.update({
    accessKeyId: process.env.DB_ACCESS_KEY_ID,
    secretAccessKey: process.env.DB_SECRET_ACCESS_KEY,
    region: 'us-east-1'
});

const dynamoDb = new DynamoDB.DocumentClient({apiVersion: 'latest'});

export async function getSMA30s(req: NextApiRequest, res: NextApiResponse) {
    const {endDate}: any = req.query;
    if (endDate == null) {
        res.status(400).end();
        return;
    }

    const end = new Date(endDate);
    if (end.toString() === "Invalid Date") {
        res.status(400).end();
        return;
    }

    const start = new Date(end);
    start.setDate(end.getDate() - Number(process.env.STOCK_HISTORY_DATE_RANGE));

    const params: QueryInput = {
        TableName: `${process.env.TABLE_NAME}`,
        KeyConditionExpression: 'ticker = :t AND closingDate BETWEEN :s and :e',
        ExpressionAttributeValues: {
            ':t': process.env.AMZN_TICKER,
            ':s': formatDate(start),
            ':e': formatDate(end)
        },
        ProjectionExpression: 'closingDate, sma30'
    };

    await dynamoDb.query(params).promise()
        .then(result => res.status(200).send(result.Items))
        .catch(err => {
            console.log(err);
            res.status(500).end();
        });
}

function formatDate(date: Date) {
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - (offset * 60 * 1000))
        .toISOString()
        .split('T')[0];
}