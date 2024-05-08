// TODO: Regenerate documentation for given prompts
import Generator from 'yeoman-generator';
import fs from 'fs';
import { validateDirectoryFormat, validateKeyValuePairs, validateDirectoryPath, validatePortNumbers, validateArg, validateHealthcheck, validateOnbuild, validateStopsignal, validateUser, validateVolume, validateCmd } from './validate.js';


export default class extends Generator {
  async prompting() {
    const prompts = [
      {
        type: 'input',
        name: 'baseImage',
        message: 'Enter the base image of your container (e.g., "node:14"):',
        default: 'node:14'
      },
      {
        type: 'input',
        name: 'copySource',
        message: 'What file or folder to copy from? (optional, e.g., "app.js or /src"):',
        default: './',
        validate: validateDirectoryPath
      },
      {
        type: 'input',
        name: 'copyDestination',
        message: 'What\'s the destination folder? (optional, e.g., "/app"):',
        default: './',
        validate: validateDirectoryFormat
      },
      {
        type: 'input',
        name: 'exposePorts',
        message: 'Enter the ports to expose the container to the host (optional, e.g., "8080 3000"):',
        validate: validatePortNumbers
      },
      {
        type: 'input',
        name: 'environment',
        message: 'Enter container\'s environment variables (optional, separated by spaces, e.g., "<KEY>=<VALUE> <KEY>=<VALUE>"):',
        validate: validateKeyValuePairs,
      },
      {
        type: 'input',
        name: 'cmd',
        message: 'Enter the command to run when the container starts (optional, shell form. e.g., "npm start"):',
        default: 'npm start',
        validate: validateCmd
      },
      {
        type: 'input',
        name: 'arg',
        message: 'Define a variable to pass with the docker build command at the build-time (optional, format: <name>[=<default>]):',
        validate: validateArg
      },
      {
        type: 'input',
        name: 'entrypoint',
        message: 'Enter the main command that will be executed when the container is launched (optional, shell form. e.g., "executable param1 param2"):',
        validate: validateCmd
      },
      {
        type: 'input',
        name: 'healthcheck',
        message: 'Enter the health check options (optional, e.g., \'--timeout=30s --retries=3\'. See de docs for details.):',
        validate: validateHealthcheck
      },
      {
        type: 'input',
        name: 'healthcheckCmd',
        message: 'Enter the health check command (optional, shell form. e.g. "executable param1 param2"):',
        validate: validateCmd
      },
      {
        type: 'input',
        name: 'label',
        message: 'Add any labels to the image (optional, format: <key>=<value> <key>=<value> ...):',
        validate: validateKeyValuePairs
      },
      {
        // TODO: Allow multiple inputs
        type: 'input',
        name: 'onbuild',
        message: 'Enter the instruction to be executed when the image is used as the base for another build.  (optional, format: [INSTRUCTION]):',
        validate: validateOnbuild
      },
      {
        type: 'input',
        name: 'stopsignal',
        message: 'Enter the call signal that will be sent to the container to exit (optional, e.g. SIGKILL. See the docs for details.):',
        validate: validateStopsignal
      },
      {
        type: 'input',
        name: 'user',
        message: 'Set the user and group (optional, format: <user>[:<group>]):',
        validate: validateUser
      },
      {
        type: 'input',
        name: 'volume',
        message: 'Enter the volume\'s mount point (optional, format: /data):',
        validate: validateVolume
      },
    ];

    this.answers = await this.prompt(prompts);
  }

  writing() {
    try {
        // Check if answers exist and are valid
        if (!this.answers) {
          return;
        }

        // Copy the template file and apply template variables
        this.fs.copyTpl(
          this.templatePath('Dockerfile.template'),
          this.destinationPath('Dockerfile'),
          this.answers
        );

        this.removeDuplicateLines();

      } catch (error) {
        // Handle any errors that occur during file generation
        this.log(`Error occurred during file generation: ${error.message}`);
      }
  }

  removeDuplicateLines() {
    fs.readFile('Dockerfile', 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          this.removeDuplicateLines();
        } else {
          console.error('Error reading file:', err);
        }
      } else if (data) {
        const cleanedContent = data.replace(/\n{2,}/g, '\n\n');

        fs.writeFile('Dockerfile', cleanedContent, 'utf8', (err) => {
          if (err) {
              console.error('Error writing file:', err);
              return;
          }
        });
      }
    })
  }
  
};