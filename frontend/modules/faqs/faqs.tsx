import {Anchor, Title} from "@mantine/core";

export default function Faqs() {
    return (
        <>
            <Title order={3}>Where is the code?</Title>
            <p>
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                Design wiki and code are available on
                <Anchor href="https://github.com/ConstableCarrot/tc-calculator-app#design-wiki" target="_blank">
                    &nbsp;github
                </Anchor>.
            </p>

            <Title order={3}>Why SMA-30?</Title>
            <p>
                Amazon uses SMA-30 as the price-per-unit for RSU award.
            </p>

            <Title order={3}>When does Amazon refresh their SMA-30 database?</Title>
            <p>
                Amazon systematically refreshes their SMA-30 price on every Friday.
            </p>

            <Title order={3}>How does this website store SMA-30 values?</Title>
            <p>
                We only store and display SMA-30 values for 8 latest consecutive Fridays. New value is added on every
                Friday at 4 pm PDT.
            </p>

            <Title order={3}>Why use 15% for YOY Stock Growth?</Title>
            <p>
                This is the number that Amazon often uses to calculate TC package.
            </p>
        </>
    )
}