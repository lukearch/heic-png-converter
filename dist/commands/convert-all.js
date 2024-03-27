"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fs_extra_1 = require("fs-extra");
const heicConvert = require("heic-convert");
const path_1 = require("path");
const picocolors_1 = require("picocolors");
const convertAllCommand = new commander_1.Command('convert-all')
    .description('Convert all .heic files in the current directory to .png')
    .action(async () => {
    const root = (0, path_1.resolve)(process.cwd());
    process.chdir(root);
    console.log((0, picocolors_1.blue)('Converting all .heic files to .png\n'));
    const files = (0, fs_extra_1.readdirSync)(root).filter((file) => file.endsWith('.heic'));
    if (files.length === 0) {
        console.log((0, picocolors_1.blue)('No .heic files found in the current directory.'));
        return;
    }
    for (const file of files) {
        console.log(`Converting ${file}...`);
        const inputBuffer = await (0, fs_extra_1.readFile)((0, path_1.resolve)(root, file));
        const outputBuffer = await heicConvert({
            buffer: inputBuffer,
            format: 'PNG',
            quality: 1,
        });
        const newPNGFile = file.replace('.heic', '.png');
        await (0, fs_extra_1.writeFile)((0, path_1.resolve)(root, newPNGFile), Buffer.from(outputBuffer));
    }
    console.log((0, picocolors_1.blue)('\nConversion complete!'));
});
exports.default = convertAllCommand;
//# sourceMappingURL=convert-all.js.map