import {NextApiRequest, NextApiResponse} from "next";
import {getSMA30s} from "../../modules/amazon-tc-calculator/api/getSMA30";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        await getSMA30s(req, res);

        // For local testing
        // res.status(200).send([
        //     {"closingDate": "2022-06-08", "sma30": "116.9165"}, {"closingDate": "2022-06-09", "sma30": "116.1826"}
        // ]);
    }
}