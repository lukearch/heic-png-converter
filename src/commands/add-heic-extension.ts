import { Command } from 'commander';
import { readdirSync, rename } from 'fs-extra';
import { blue } from 'picocolors';

const addHeicExtensionCommand = new Command('add-heic-extension')
  .description('Add .heic extension to all files in the current directory')
  .action(async () => {
    const root = process.cwd();
    process.chdir(root);

    console.log(
      blue('Adding .heic extension to all files in the current directory')
    );

    const files = readdirSync(root).filter((file) => !file.includes('.'));

    if (files.length === 0) {
      console.log(blue('No files found in the current directory.'));
      return;
    }

    for (const file of files) {
      const newFile = `${file}.heic`;
      await rename(file, newFile);
      console.log(`Renaming ${file} to ${newFile}`);
    }

    console.log(blue('\nAdding .heic extension complete!'));
  });

export default addHeicExtensionCommand;
