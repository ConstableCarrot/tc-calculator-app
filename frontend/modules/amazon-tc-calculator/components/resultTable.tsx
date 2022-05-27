import React from "react";
import {Box, Table} from "@mantine/core";

export default function ResultTable({inputs, sma30}) {
    if (JSON.stringify(inputs) == '{}' || sma30 == 0) {
        return;
    }

    const elements = getElements(sma30, inputs);
    const rows = elements.map((element) => (
        <tr key={element.year}>
            <td>{element.year}</td>
            <td>{element.base}</td>
            <td>{element.rsu}</td>
            <td>{element.price}</td>
            <td>{element.bonus}</td>
            <td>{element.tc}</td>
        </tr>
    ));

    return (
        <Box sx={(theme) => ({
            backgroundColor: theme.colors.gray[0],
            padding: theme.spacing.xs,
            marginTop: theme.spacing.xs,
            borderRadius: theme.radius.md
        })}>
            <Table striped highlightOnHover>
                <thead>
                <tr>
                    <th>Year</th>
                    <th>Base</th>
                    <th>RSU</th>
                    <th>Stock price</th>
                    <th>Sign-on bonus</th>
                    <th>Total Compensation</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </Box>
    );
}

function getElements(sma30, inputs) {
    let stockPrice = sma30;
    const rsuVestingPercentage = [0.05, 0.15, 0.4, 0.4];
    let elements = [];
    for (let i = 0; i < 4; i++) {
        const year = i + 1;
        const base = inputs.base;
        const rsu = inputs.rsu * rsuVestingPercentage[i];
        stockPrice = i == 0 ? stockPrice : calculateStockPrice(stockPrice, inputs.yoy);
        const bonus = i == 0 ? inputs.bonusYear1 : (i == 1 ? inputs.bonusYear2 : '0');
        const tc = calculateTC(base, rsu, stockPrice, bonus);
        elements.push({
            year: year,
            base: '$' + base.toLocaleString("en-US"),
            rsu: rsu.toLocaleString("en-US"),
            price: '$' + stockPrice.toLocaleString("en-US"),
            bonus: '$' + bonus.toLocaleString("en-US"),
            tc: '$' + tc.toLocaleString("en-US")
        })
    }
    return elements;

    function calculateStockPrice(price, yoy) {
        price += (price / 100) * Number(yoy);
        return price;
    }

    function calculateTC(base, rsu, price, bonus) {
        const baseNum: number = parseInt(base.replace(/,/g, ''));
        const bonusNum = parseInt(bonus.replace(/,/g, ''));
        return (baseNum + bonusNum + (rsu * price));
    }
}

