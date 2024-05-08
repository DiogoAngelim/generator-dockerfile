# Dockerfile Generator

## Overview

Yeoman generator helps you quickly generate Dockerfiles for your Docker projects. It provides the following features:

- **Prompt-based Configuration**: Easily configure your Dockerfile by answering a series of prompts for options such as base image, source path for COPY, destination path for COPY, expose ports, environment variables, and more.

- **Input Validation**: Ensures that user inputs meet specific criteria or formats, such as validating port numbers, directory paths, and environment variable formats.

- **Fallback Options**: Use default values for prompts and skip optional prompts if desired, providing fallback options and alternative paths if certain inputs are missing or invalid.

- **User-friendly Usage**: Simple and intuitive command-line interface makes it easy to generate Dockerfiles for any Docker project.

## Requirements

- Node.js installed on your system

- Yeoman installed globally on your system

## Installation

**1. Install Yeoman globally if you haven't already:**

```bash

sudo npm install -g yo

```

**2. Install the Dockerfile Generator:**

```bash

npm install -g generator-yeoman-docker

```

## Usage

To use the Dockerfile Generator, follow these steps:

**1. Open your terminal or command prompt.**

**2. Navigate to the directory where you want to generate the Dockerfile. You can use the `cd` command to change directories. For example:**

```bash

cd path/to/your/project/directory

```

Replace `path/to/your/project/directory` with the actual path to your project directory.

**3. Run the generator:**

```bash

yo dockerfile

```

**4. Follow the prompts to configure your Dockerfile. You'll be prompted to provide information such as the base image, source path, destination path, and more.**

**5. Once you've provided all the necessary inputs, the generator will generate a Dockerfile in the current directory based on your configuration.**

**6. You can then use and customize the generated Dockerfile in your projects as needed.**

## Additional Information

- For more information on Yeoman generators, refer to the [Yeoman documentation](https://yeoman.io/).
- For more information on Docker & Dockerfile, refer to the [Docker documentation](https://docs.docker.com/reference/dockerfile/).
- If you encounter any issues or have suggestions for improvements, please report them on the [GitHub repository](https://github.com/DiogoAngelim/generator-yeoman-docker).
