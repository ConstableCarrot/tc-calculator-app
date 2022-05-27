import {Alert, Notification, Select} from '@mantine/core';
import {AlertCircle} from 'tabler-icons-react';
import useSWRImmutable from 'swr';

// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json());
const today = formatDate(new Date());

export default function SMA30DateSelect({setSelectedSMA30, sma30}) {
    const {sma30History, isLoading, isError} = useSMA30(today);

    if (isLoading) {
        return (
            <>
                <Notification sx={(theme) => ({
                    marginTop: theme.spacing.xs
                })}
                              loading
                              title="Retrieving SMA-30 historical data"
                              disallowClose>
                </Notification>
            </>);
    }

    if (isError) {
        return (
            <>
                <Alert sx={(theme) => ({
                    marginTop: theme.spacing.xs
                })} icon={<AlertCircle size={16}/>} title="Error!" color="red">
                    Failed to retrieve SMA-30 data, please refresh the page to retry.
                </Alert>
            </>);
    }

    const sma30List = [];
    sma30History.slice().reverse()
        .forEach(function (item) {
            const roundUpTo2Decimal = Math.round((Number(item.sma30) + Number.EPSILON) * 100) / 100;
            const key = `${item.closingDate}: $${roundUpTo2Decimal.toLocaleString("en-US")}`;
            sma30List.push({
                value: roundUpTo2Decimal,
                label: key
            })
        });

    return <Select required label="Simple Moving Average over 30 days (SMA-30)"
                   placeholder="Search by entering the date: YYYY-MM-DD"
                   maxDropdownHeight={280}
                   searchable
                   nothingFound="No options"
                   value={sma30} onChange={setSelectedSMA30} data={sma30List}/>;
}

function useSMA30(today) {
    const {data, error} = useSWRImmutable(`/api/sma30?endDate=${today}`, fetcher);

    return {
        sma30History: data,
        isLoading: !error && !data,
        isError: error
    }
}

function formatDate(date: Date) {
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - (offset * 60 * 1000))
        .toISOString()
        .split('T')[0];
}