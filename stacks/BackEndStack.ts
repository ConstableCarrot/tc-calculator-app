import {App, Cron, Stack, StackContext} from "@serverless-stack/resources";
import {AttributeType, BillingMode, Table} from "aws-cdk-lib/aws-dynamodb";

export function BackEndStack({stack, app}: StackContext) {
    const table = createTable(stack, app);
    createCronJon(stack, app, table.tableName);
}

function createCronJon(stack: Stack, app: App, tableName: string) {
    stack.addDefaultFunctionEnv({
        'AMZN_TICKER': `${process.env.AMZN_TICKER}`,
        'STOCK_HISTORY_DATE_RANGE': `${process.env.STOCK_HISTORY_DATE_RANGE}`,
        'TABLE_NAME': tableName,
        'X_RAPID_API_HOST': `${process.env.X_RAPID_API_HOST}`,
        'X_RAPID_API_KEY': `${process.env.X_RAPID_API_KEY}`
    });

    new Cron(stack, `DailyCron-${app.stage}-${app.region}`, {
        schedule: "cron(01 20 ? * Thu *)", // Run at 16:01pm EST or 20:01 UTC on every Friday
        job: "functions/dailyCron.handler",
        enabled: app.stage === 'prod'
    }).attachPermissions(["dynamodb"]);
}

function createTable(stack: Stack, app: App) {
    const table = new Table(stack, `StockPrice-${app.stage}-${app.region}`, {
        tableName: `StockPrice-${app.stage}-${app.region}`,
        partitionKey: {name: 'ticker', type: AttributeType.STRING},
        sortKey: {name: 'closingDate', type: AttributeType.STRING},
        billingMode: BillingMode.PROVISIONED,
        timeToLiveAttribute: 'expiration'
    });

    table.autoScaleReadCapacity({minCapacity: 5, maxCapacity: 10})
        .scaleOnUtilization({
            targetUtilizationPercent: 50
        });

    table.autoScaleWriteCapacity({minCapacity: 5, maxCapacity: 10})
        .scaleOnUtilization({
            targetUtilizationPercent: 50
        });

    return table;
}
