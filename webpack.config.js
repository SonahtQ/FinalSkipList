const path = require('path');

const isProduction = true;

const config = {
    entry: './browser.ts',
    output: {
        path: path.resolve(__dirname, 'dist/browser'),
        filename: "finalskiplist.js"
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                options: {
                    configFile: path.resolve(__dirname, './tsconfig-browser.json')
                },
                exclude: ['/node_modules/'],
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';    
    }
    else {
        config.mode = 'development';
    }

    return config;
};
