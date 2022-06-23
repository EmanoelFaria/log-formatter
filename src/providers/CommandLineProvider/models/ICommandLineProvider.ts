import { IPossibleCommandLineArgs } from '../../../dtos/IPossibleCommandLineArgs';

export default interface ICommandLineProvider {
  getArrayArgs(): string[];
  getPossibleArgs(): IPossibleCommandLineArgs;
}
