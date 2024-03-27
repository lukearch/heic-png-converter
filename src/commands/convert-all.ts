import { Command } from 'commander';
import { readdirSync, readFile, writeFile } from 'fs-extra';
import { unlink } from 'fs/promises';
import * as heicConvert from 'heic-convert';
import { resolve } from 'path';
import { blue, red } from 'picocolors';

type ConvertAllArgs = {
  delete?: boolean;
  quality: number;
};

const convertAllCommand = new Command('convert-all')
  .description('Convert all .heic files in the current directory to .png')
  .option('-D, --delete', 'Delete the original .heic files after conversion')
  .option('-q, --quality <quality>', 'Quality of the output image', '1')
  .action(async (args: ConvertAllArgs) => {
    if (!Number(args.quality)) {
      console.log(red('Quality must be a number.'));
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
        quality: Number(args.quality),
      });

      const newPNGFile = file.replace('.heic', '.png');

      await writeFile(resolve(root, newPNGFile), Buffer.from(outputBuffer));

      if (args.delete) {
        await unlink(resolve(root, file));
      }
    }

    console.log(blue('\nConversion complete!'));
  });

export default convertAllCommand;
