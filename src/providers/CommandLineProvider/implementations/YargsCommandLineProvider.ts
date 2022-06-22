import ICommandLineProvider from '../models/ICommandLineProvider';
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';

export default class YargsCommandLineProvider implements ICommandLineProvider {
  public getArrayArgs(): string[] {
    const result = yargs(hideBin(process.argv)).argv as any;

    if (!result || !result._) throw new Error('Invalid params');

    return result._;
  }

  public getArgs(): Object {
    const result = yargs(hideBin(process.argv)).argv;
    if (!result) throw new Error('Invalid params');
    return result;
  }
}
