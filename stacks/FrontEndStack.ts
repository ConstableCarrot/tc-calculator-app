import {NextjsSite, StackContext} from "@serverless-stack/resources";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import {Duration} from "aws-cdk-lib";

export function FrontEndStack({stack, app}: StackContext) {
    const cachePolicies = {
        staticCachePolicy: new cloudfront.CachePolicy(stack, "StaticCache", NextjsSite.staticCachePolicyProps),
        imageCachePolicy: new cloudfront.CachePolicy(stack, "ImageCache", NextjsSite.imageCachePolicyProps),
        lambdaCachePolicy: new cloudfront.CachePolicy(stack, "LambdaCache", {
            // overriding NextjsSite.lambdaCachePolicyProps to cache result for 5 minutes
            queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
            headerBehavior: cloudfront.CacheHeaderBehavior.none(),
            cookieBehavior: cloudfront.CacheCookieBehavior.all(),
            defaultTtl: Duration.minutes(5),
            maxTtl: Duration.days(365),
            minTtl: Duration.minutes(5),
            enableAcceptEncodingBrotli: true,
            enableAcceptEncodingGzip: true,
            comment: "SST NextjsSite Lambda Default Cache Policy",
        })
    };

    stack.addOutputs({
        URL: createFrontEndWebsite().url
    });

    function createFrontEndWebsite() {
        return new NextjsSite(stack, `TC-Calculator-Site-${app.stage}-${app.region}`, {
            path: "frontend",
            environment: {
                'AMZN_TICKER': `${process.env.AMZN_TICKER}`,
                'STOCK_HISTORY_DATE_RANGE': `${process.env.STOCK_HISTORY_DATE_RANGE}`,
                'TABLE_NAME': `StockPrice-${app.stage}-${app.region}`,
                'DB_ACCESS_KEY_ID': `${process.env.DB_ACCESS_KEY_ID}`,
                'DB_SECRET_ACCESS_KEY': `${process.env.DB_SECRET_ACCESS_KEY}`
            },
            defaults: {
                function: {
                    permissions: ['dynamodb'],
                    timeout: 20
                }
            },
            cdk: {
                cachePolicies
            }
        });
    }
}