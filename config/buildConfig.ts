import * as dotnet from 'dotenv';

export class BuildConfig {
    private nameStack : string;
    private stage : 'dev';

    constructor(nameStack: string, stage: 'dev') {
        this.nameStack = nameStack;
        this.stage = stage;
    }

    async getConfig(): Promise<any> {
        dotnet.config({quiet:true});

            try {
                const buildConfigResponse : any ={
                    STAGE: this.stage,
                    URL_GET: process.env.URL_GET,
                    URL_POST: process.env.URL_POST
                }
                return buildConfigResponse;
            } catch (error) {
                return {
                    STAGE: this.stage
                }
            }
    }
}
