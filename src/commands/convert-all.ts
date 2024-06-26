import { Command } from 'commander';
import { readdirSync, readFile } from 'fs-extra';
import { unlink } from 'fs/promises';
import * as heicConvert from 'heic-convert';
import { resolve } from 'path';
import { blue } from 'picocolors';
import * as prompts from 'prompts';
import sharp = require('sharp');

const convertAllCommand = new Command('convert-all')
  .description('Convert all .heic files in the current directory to .png')
  .action(async () => {
    const answers = await prompts([
      {
        type: 'number',
        name: 'quality',
        message: 'Enter the quality of the converted images (0-100)',
        initial: 100,
        min: 0,
        max: 100,
      },
      {
        type: 'confirm',
        name: 'delete',
        message: 'Delete the original .heic files after conversion?',
        initial: false,
      },
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Do you want to proceed?',
        initial: true,
      },
    ]);

    if (!answers.confirm) {
      console.log(blue('\nAborted.'));
      return;
    }

    const root = resolve(process.cwd());
    process.chdir(root);

    console.log(blue('Converting all .heic files to .png\n'));

    const files = readdirSync(root).filter((file) => file.endsWith('.heic'));

    if (files.length === 0) {
      console.log(blue('No .heic files found in the current directory.'));
      return;
    }

    for (const file of files) {
      console.log(`Converting ${file}...`);
      const inputBuffer = await readFile(resolve(root, file));
      const outputBuffer = await heicConvert({
        buffer: inputBuffer,
        format: 'PNG',
        quality: 1,
      });

      const newPNGFile = file.replace('.heic', '.png');

      await sharp(outputBuffer)
        .png({ quality: 80 })
        .toFile(resolve(root, newPNGFile));

      if (answers.delete) {
        await unlink(resolve(root, file));
      }
    }

    console.log(blue('\nConversion complete!'));
  });

export default convertAllCommand;
