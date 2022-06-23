import ICommandLineProvider from '../models/ICommandLineProvider';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { IPossibleCommandLineArgs } from '../../../dtos/IPossibleCommandLineArgs';
import help from '../../../config/help';

export default class YargsCommandLineProvider implements ICommandLineProvider {
  public getArrayArgs(): string[] {
    const result = yargs(hideBin(process.argv)).argv as any;

    if (!result || !result._) throw new Error('Invalid params');

    return result._;
  }

  private getArgs(): any {
    const result = yargs(hideBin(process.argv)).argv;
    return result || {};
  }

  public getPossibleArgs(): IPossibleCommandLineArgs {
    return {
      version: this.getArgs()['log-version'],
      origin: this.getArgs()['origin'],
      destiny: this.getArgs()['destiny'],
    };
  }
}
