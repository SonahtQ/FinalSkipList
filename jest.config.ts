import type { Config } from '@jest/types';

//

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    

    testEnvironment: 'node',
    
    testRegex: String.raw`/tests/jest/[a-z0-9_\-]+\.test\.[jt]s$`,
};

export default config;