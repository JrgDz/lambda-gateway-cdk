import * as dotnet from 'dotenv';

export class BuildConfig {
    private nameStack : string;
    private stage : 'dev';

    constructor(nameStack: string, stage: 'dev') {
        this.nameStack = nameStack;
        this.stage = stage;
    }

    getConfig(): any {
        dotnet.config({quiet:true});
        return {
            STAGE: this.stage,
            URL_GET: process.env.URL_GET,
            URL_POST: process.env.URL_POST
        };

    }
}
