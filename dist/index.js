"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const convert_all_1 = require("./commands/convert-all");
const run = async () => {
    const pkgJson = await Promise.resolve().then(() => require('../package.json'));
    const program = new commander_1.Command()
        .version(pkgJson.version)
        .description(pkgJson.description)
        .addCommand(convert_all_1.default);
    program.parse(process.argv);
};
run();
//# sourceMappingURL=index.js.map