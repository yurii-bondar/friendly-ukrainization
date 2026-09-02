import { CliUsageError, runCli, USAGE } from './cli-runner.js';

try {
  console.log(runCli(process.argv.slice(2)));
} catch (error) {
  if (error instanceof CliUsageError) {
    console.error(error.message);
    console.error();
    console.error(USAGE);
    process.exit(1);
  }
  throw error;
}
