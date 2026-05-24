import { Command } from 'commander';
import { decorateProgram } from './program';

const program = new Command();
decorateProgram(program);
program.parse(process.argv);
