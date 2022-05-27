import Amazon from "../modules/amazon-tc-calculator/amazon";
import {Container, Tabs} from '@mantine/core';
import {Calculator, MessageCircle} from "tabler-icons-react";
import Faqs from "../modules/faqs/faqs";

export default function Home() {
    return (
        <Container>
            <Tabs>
                <Tabs.Tab label="Amazon TC Calculator" icon={<Calculator size={14}/>}>
                    <Amazon/>
                </Tabs.Tab>

                <Tabs.Tab label="FQAs" icon={<MessageCircle size={14}/>}>
                    <Faqs/>
                </Tabs.Tab>
            </Tabs>
        </Container>
    )
}