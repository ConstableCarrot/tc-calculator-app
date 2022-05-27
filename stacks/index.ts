import {App} from "@serverless-stack/resources";
import {FrontEndStack} from "./FrontEndStack";
import {BackEndStack} from "./BackEndStack";

export default function (app: App) {
    app.setDefaultFunctionProps({
        runtime: "nodejs16.x",
        srcPath: "backend",
        bundle: {
            format: "esm"
        }
    });

    app.stack(BackEndStack)
        .stack(FrontEndStack);
}
