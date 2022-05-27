import {Box, Button, Group, TextInput} from '@mantine/core';
import {useForm} from '@mantine/form';
import SMA30DateSelect from "./sma30DateSelect";
import {useState} from "react";
import ResultTable from "./resultTable";

const invalidNumberFormat = 'Invalid number format';
const regNumber = /^(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d+)?$/;
const regPercentage = /^\d+(\.\d+)?$/;

export default function CalculatorForm() {
    const [sma30, setSelectedSMA30] = useState(0);
    const [inputs, setInputs] = useState({});

    const form = useForm({
        initialValues: {
            base: '100,000.00',
            rsu: '100',
            yoy: '15',
            bonusYear1: '150,000.00',
            bonusYear2: '130,000.00'
        },

        validate: {
            base: (value) => (regNumber.test(value) ? null : invalidNumberFormat),
            rsu: (value) => (regNumber.test(value) ? null : invalidNumberFormat),
            yoy: (value) => (regPercentage.test(value) ? null : invalidNumberFormat),
            bonusYear1: (value) => (regNumber.test(value) ? null : invalidNumberFormat),
            bonusYear2: (value) => (regNumber.test(value) ? null : invalidNumberFormat)
        }
    });

    return (
        <>
            <form onSubmit={form.onSubmit((values) => setInputs(values))}>
                <Box sx={(theme) => ({
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                    padding: theme.spacing.xs,
                    marginTop: theme.spacing.xs,
                    borderRadius: theme.radius.md
                })}>
                    <TextInput
                        required
                        label="Annual base salary"
                        {...form.getInputProps('base')}
                    />
                </Box>

                <Box sx={(theme) => ({
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                    padding: theme.spacing.xs,
                    marginTop: theme.spacing.xs,
                    borderRadius: theme.radius.md
                })}>
                    <TextInput
                        required
                        label="Restricted Stock Unit (RSU)"
                        {...form.getInputProps('rsu')}
                    />
                    <TextInput
                        required
                        label="Year-over-year growth percentage (YOY Growth)"
                        {...form.getInputProps('yoy')}
                    />

                    <SMA30DateSelect setSelectedSMA30={setSelectedSMA30} sma30={sma30}/>
                </Box>

                <Box sx={(theme) => ({
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                    padding: theme.spacing.xs,
                    marginTop: theme.spacing.xs,
                    borderRadius: theme.radius.md
                })}>
                    <TextInput
                        required
                        label="Sign-on bonus year 1"
                        placeholder="1st year sign-on bonus"
                        {...form.getInputProps('bonusYear1')}
                    />
                    <TextInput
                        required
                        label="Sign-on bonus year 2"
                        placeholder="2nd year sign-on bonus"
                        {...form.getInputProps('bonusYear2')}
                    />
                </Box>

                <Group sx={(theme) => ({
                    marginTop: theme.spacing.xs,
                    borderRadius: theme.radius.md
                })} position="center" mt="md">
                    <Button type="submit">Calculate Total Compensation</Button>
                </Group>
            </form>

            <ResultTable inputs={inputs} sma30={sma30}/>
        </>
    );
}