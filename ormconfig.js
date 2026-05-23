//import * as dotenv from "dotenv";
// module.exports = {
//     name: "default",
//     type: "mysql",
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     username: process.env.DB_USER,
//     password: process.env.DB_PWD,
//     database: process.env.DB_NAME,
//     entities: [
//         "src/database/types/*.ts"
//     ],
//     logging: false,
//     synchronize: true
// };

const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    name: "default",
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    // Fix the path to point to the correct location
    entities: [
        "src/infras/database/types/*.ts"
    ],
    logging: false,  // Set to true to see what's happening
    synchronize: true,
    ssl: {
        rejectUnauthorized: false
    },
    extra: {
        ssl: {
            rejectUnauthorized: false
        },
        connectTimeout: 10000
    }
};