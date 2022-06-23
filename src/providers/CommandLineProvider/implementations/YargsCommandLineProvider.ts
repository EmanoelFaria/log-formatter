import ICommandLineProvider from '../models/ICommandLineProvider';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { IPossibleCommandLineArgs } from '../../../dtos/IPossibleCommandLineArgs';

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
    console.log(this.getArgs());
    return {
      version: this.getArgs()['log-version'],
      origin: this.getArgs()['origin'],
    };
  }
}
