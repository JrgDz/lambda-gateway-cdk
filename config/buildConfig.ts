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

        const required = ['URL_GET', 'URL_POST'];
        const missing = required.filter((k) => !process.env[k]);
        if (missing.length > 0) {
            throw new Error(`Faltan variables de entorno: ${missing.join(', ')}`);
        }

        return {
            STAGE: this.stage,
            URL_GET: process.env.URL_GET,
            URL_POST: process.env.URL_POST
        };

    }
}
