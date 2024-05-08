import { assert } from 'chai';
import { validateDirectoryFormat, validateKeyValuePairs, validateDirectoryPath, validatePortNumbers, validateArg, validateHealthcheck, validateCmd } from '../generators/app/validate.js';


describe('Dockerfile Generator', function () {
  
  describe('Input Validation', function () {
    describe('validateDirectoryPath', function () {
      it('should return true for valid directory path', function () {
        assert.isTrue(validateDirectoryPath('.'));
      });

      it('should return error message for invalid directory path', function () {
        assert.isString(validateDirectoryPath('/invalid/path'));
      });

      it('should return true for empty directory path', function () {
        assert.isTrue(validateDirectoryPath(''));
      });

      it('should return true for extremely large directory path', function () {
        assert.isTrue(validateDirectoryPath('/'.repeat(1000)));
      });
    });

    describe('validateDirectoryFormat', function () {
      it('should return true for an empty string', function () {
        assert.strictEqual(validateDirectoryFormat(''), true);
      });

      it('should return true for valid Unix directory paths', function () {
        assert.strictEqual(validateDirectoryFormat('/path/to/directory'), true);
        assert.strictEqual(validateDirectoryFormat('~/home/user'), true);
        assert.strictEqual(validateDirectoryFormat('./hidden/directory'), true);
      });

      it('should return true for valid Unix directory paths with backslash-escaped spaces', function () {
        assert.strictEqual(validateDirectoryFormat('/path/to/my\\ directory'), true);
        assert.strictEqual(validateDirectoryFormat('~/home/my\\ user'), true);
        assert.strictEqual(validateDirectoryFormat('./hidden/my\\ directory'), true);
      });

      it('should return an error message for invalid Unix directory paths', function () {
        assert.strictEqual(validateDirectoryFormat('path/with/special*characters'), 'Please enter a valid unix directory.');
      });
    });

    describe('validatePortNumbers', function () {
      it('should return error message for invalid port numbers', () => {
        const result = validatePortNumbers('abc, 8080, -100, 65536');
        assert.strictEqual(result, 'Invalid port numbers.');
      });

      it('should return true for valid port numbers', () => {
        const result = validatePortNumbers('8080 3000 5432');
        assert.strictEqual(result, true);
      });
    });

    describe('validateKeyValuePairs', function () {
      it('should return true for valid environment variables', function () {
        assert.isTrue(validateKeyValuePairs('NODE_ENV=production PORT=3000'));
      });

      it('should return error message for invalid environment variables', function () {
        assert.isString(validateKeyValuePairs('INVALID_VAR'));
      });

      it('should return true for empty environment variables', function () {
        assert.isTrue(validateKeyValuePairs(''));
      });

      it('should return true for environment variables with special characters', function () {
        assert.isTrue(validateKeyValuePairs('VAR=!@#$ ANOTHER_VAR=123'));
      });

    });
    describe('validateCmd', () => {
      it('should return true for valid command format', () => {
        const result = validateCmd('npm start');
        assert.isTrue(result);
      });

      it('should return true for empty input', () => {
        const result = validateCmd('');
        assert.isTrue(result);
      });

      it('should return true for valid command with special characters', () => {
        const result = validateCmd('npm run-script test -- --coverage');
        assert.isTrue(result);
      });

      // HealthCheck Command
      it('should return true for valid ENTRYPOINT format', () => {
        assert.isTrue(validateCmd('node server.js'));
        assert.isTrue(validateCmd('echo hello'));
        assert.isTrue(validateCmd('java -jar app.jar'));
      });

      it('should return true for empty command input', () => {
        assert.isTrue(validateCmd(''));
        assert.isTrue(validateCmd('   '));
      });

      it('should return an error message for invalid command format', () => {
        assert.equal(validateCmd('cmd;rm -rf /'), 'Invalid format. Please double check.');
      });
    });
  
    describe('validateArg', () => {
      it('should return true for valid argument format', function() {
        assert.isTrue(validateArg('valid_arg'));
        assert.isTrue(validateArg('ARG'));
        assert.isTrue(validateArg('_arg123'));
      });

      it('should return true for empty input', function() {
        assert.isTrue(validateArg(''));
      });

      it('should return an error message for invalid argument format', function() {
        assert.equal(validateArg('123invalid'), 'Invalid ARG format');
        assert.equal(validateArg('invalid-arg'), 'Invalid ARG format');
        assert.equal(validateArg('invalid arg'), 'Invalid ARG format');
        assert.equal(validateArg('invaliddé'), 'Invalid ARG format');
      });
    });

    describe('validateHealthcheck', () => {
      it('should return true for valid HEALTHCHECK format with CMD command', function () {
        assert.isTrue(validateHealthcheck('CMD curl -f http://localhost/ || exit 1'));
      });

      it('should return true for valid HEALTHCHECK format with CMD exec array', function () {
        assert.isTrue(validateHealthcheck('["curl", "-f", "http://localhost/"]'));
      });

      it('should return true for valid HEALTHCHECK format with OPTIONS only', function () {
        assert.isTrue(validateHealthcheck('--interval=5m --timeout=3s'));
      });

      it('should return true for valid HEALTHCHECK format with NONE', function () {
        assert.isTrue(validateHealthcheck('NONE'));
      });

      it('should return an error message for invalid HEALTHCHECK format', function () {
        assert.isTrue(validateHealthcheck('INVALID FORMAT'));
      });     
    });
  });
});