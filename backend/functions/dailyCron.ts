import fetch from "node-fetch";
import {DynamoDB} from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

/**
 * Store today's SMA-30 to the database
 */
export async function handler() {
    const today = new Date();
    const todayDate = formatDate(today);

    // Use this to run ad-hod update via the SST console
    //const todayDate = '2022-07-01';

    const params = {
        TableName: `${process.env.TABLE_NAME}`,
        Key: {
            'ticker': process.env.AMZN_TICKER,
            'closingDate': todayDate
        },

        UpdateExpression: 'set sma30 = :s, expiration = :t',
        ExpressionAttributeValues: {
            ':s': await getTodaySMA30(todayDate),
            ':t': createExpiration(today)
        }
    };

    await dynamoDb.update(params).promise()
        .then(res => console.log(res))
        .catch(err => console.log(err));
}

async function getTodaySMA30(todayDate: string) {
    console.log('todayDate: ' + todayDate);

    const res = await getHistoryStockPrices();
    const sma30 = res["Technical Analysis: SMA"][todayDate]["SMA"];

    console.log('sma30: ' + sma30);
    return sma30;

    function getHistoryStockPrices(ticker: string = `${process.env.AMZN_TICKER}`): any {
        const url = `https://alpha-vantage.p.rapidapi.com/query?symbol=${ticker}&function=SMA&series_type=close&interval=daily&time_period=30&datatype=json`;

        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': `${process.env.X_RAPID_API_HOST}`,
                'X-RapidAPI-Key': `${process.env.X_RAPID_API_KEY}`
            }
        };

        return fetch(url, options)
            .then(res => res.json() || {})
            .catch(err => console.log(err));
    }
}

/**
 * format: YYYY-MM-DD
 */
function formatDate(date: Date) {
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - (offset * 60 * 1000))
        .toISOString()
        .split('T')[0];
}

function createExpiration(today: Date) {
    const expiredDate = new Date(today);
    expiredDate.setDate(today.getDate() + Number(process.env.STOCK_HISTORY_DATE_RANGE));
    return Math.floor(expiredDate.getTime() / 1000.0);
}

