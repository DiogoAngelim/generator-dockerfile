import fs from 'fs';

export function validateDirectoryPath(input) {
  if (input.trim() === '') {
    return true;
  }

  if (!fs.existsSync(input)) {
    return 'Directory does not exist. Please provide a valid directory path.';
  }

  if (!fs.statSync(input).isDirectory()) {
    return 'Provided path is not a directory. Please provide a valid directory path.';
  }

  return true;
}

export function validateDirectoryFormat(input) {
  if (input.trim() === '') {
    return true;
  }

  const regex = /^(?:\/(?:[\w\.-]+(?:\\ |\/)?)*|~(?:\/(?:[\w\.-]+(?:\\ |\/)?)*|)|\.(?:\/(?:[\w\.-]+(?:\\ |\/)?)*|\/)?)*$/;

  if (!regex.test(input)) {
    return 'Please enter a valid unix directory.'
  }

  return true;
}

export function validatePortNumbers(ports) {
// Trim leading and trailing whitespace from the input
  ports = ports.trim();

  // Check if the input string is empty
  if (ports === '') {
    return true; // No port numbers provided, return true (no error)
  }

  // Split the port numbers string by comma and trim each part
  const portArray = ports.split(' ').map(port => port.trim());

  // Validate each port number
  const invalidPorts = portArray.filter(port => {
    // Check if port is not a non-negative integer or is out of range
    return !/^\d+$/.test(port) || parseInt(port, 10) < 0 || parseInt(port, 10) > 65535;
  });

  if (invalidPorts.length > 0) {
    return 'Invalid port numbers.';
  }

  return true;
}

export function validateCmd(input) {
  if (input.trim() === '') {
    return true;
  }

  const cmdRegex = /^[a-zA-Z0-9_/.~-]+(?<param>[ ]+[a-zA-Z0-9_/.~-]+)*[ ]*$/;

  if (!cmdRegex.test(input)) {
    return 'Invalid format. Please double check.';
  }

  return true;
};

export function validateArg(input) {
    if (input.trim() === '') {
      return true; // return true for empty input
    }

    const argRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

    return argRegex.test(input) ? true : 'Invalid ARG format';
}

export function validateHealthcheck(input) {
    if (input.trim() === '') {
        return true;
    }

    const regex = /^(?:--interval=[\dsmh]+)? *(?:--timeout=[\dsmh]+)? *(?:--start-period=[\dsmh]+)? *(?:--start-interval=[\dsmh]+)? *(?:--retries=\d+)? *(?:CMD (?:["]?)(?:[^"]+)*)?[ ]*|NONE$/;

    if (!regex.test(input)) {
        return 'Invalid HEALTHCHECK format';
    }
    return true;
}

export function validateKeyValuePairs(input) {
    // Empty string is always valid
    if (input.trim() === '') {
        return true;
    }

    // Split the input into key-value pairs by spaces
    const pairs = input.split(' ');

    // Loop through each pair
    for (const pair of pairs) {
        // Check if the pair contains a comma, which is invalid
        if (pair.includes(',')) {
            return 'Invalid format. Please enter space separated key-value pairs.';
        }

        // Split the pair into key and value
        const [key, value] = pair.split('=');

        // Check if key and value are present
        if (!key || !value) {
            return 'Key and value must be present.';
        }

        // Check if key and value contain only allowed characters
        const keyRegex = /^[a-zA-Z0-9_.]+$/;

        if (!keyRegex.test(key)) {
            return 'Invalid input. Please check and try it again.';
        }
    }

    return true;
}

export function validateStopsignal(input) {
  // Validate format: STOPSIGNAL signal
  const validSignals = ['SIGINT', 'SIGALRM', 'SIGABRT', 'SIGSTOP', 'SIGCONT', 'SIGSEGV', 'SIGKILL'];
  
  return input.trim() === '' || validSignals.includes(input);
}

export function validateUser(input) {
  
  if (input.trim() === '') {
    return true;
  }

  return /^(?:(?:[a-z_]|\d)(?:[a-z0-9_-]{0,30})?)(?::(?:(?:[a-z_]|\d)(?:[a-z0-9_-]{0,30})?))?$/.test(input);
}

export function validateVolume(input) {
  if (input.trim() === '') {
    return true;
  }

  return /^\["(?:\/(?:[^\"\'\/\\]|\\.)+\/?)?"\]$/.test(input);
}

export function validateBuildArg(input) {
    // Check if the input is empty
    if (input.trim() === '') {
        return true;
    }

    // Define the regex pattern to validate key-value pairs
    const pattern = /^([a-zA-Z_][a-zA-Z0-9_]*)(?:=([\w./:]*))?$/;

    // Split the input into key and value
    const match = input.match(pattern);

    // Check if the match is valid
    if (match && match.length >= 1) {
        return true;
    }

    // Invalid input
    return "Invalid build argument format. Please use the format: <name>[=<default>]";
}

// Define the validation function for the ONBUILD instruction
export function validateOnbuild(input) {
    // Check if the input is empty
    if (input.trim() === '') {
        // Empty input is valid
        return true;
    }

    const validInstructions = ['ADD', 'ARG', 'CMD', 'COPY', 'ENTRYPOINT', 'ENV', 'EXPOSE', 'FROM', 'HEALTHCHECK', 'LABEL', 'ONBUILD', 'RUN', 'SHELL', 'STOPSIGNAL', 'USER', 'VOLUME', 'WORKDIR'];

    // Split the input into words
    const words = input.split(' ');

    // Check if the first word matches any valid instruction
    const instruction = words[0];
    if (!validInstructions.includes(instruction)) {
        // If the first word is not a valid instruction, return an error message
        return `Invalid instruction: '${instruction}'. Must be one of: ${validInstructions.join(', ')}`;
    }

    // If the first word is a valid instruction, validate the options
    // Get the options part of the input
    const options = words.slice(1).join(' ');

    // Call the respective validation function based on the instruction
    switch (instruction.toLowerCase()) {
      case 'arg':
        return validateArg(input);
      case 'cmd':
        return validateCmd(input);
      case 'entrypoint':
        return validateCmd(input);
      case 'expose':
        return validatePortNumbers(input);
      // case 'copy':
      //   return validateCopy(input);
      case 'env':
        return validateKeyValuePairs(input);
      // case 'healthcheck':
      //   return validateHealthcheck(input);
      case 'label':
        return validateKeyValuePairs(input);
      case 'run':
        return validateCmd(input);
      case 'stopsignal':
        return validateStopsignal(input);
      case 'user':
        return validateUser(input);
      case 'volume':
        return validateVolume(input);
      case 'workdir':
        return validateDirectoryPath(input);
      default:
        return true; // Default to true if instruction is not recognized
    }
}