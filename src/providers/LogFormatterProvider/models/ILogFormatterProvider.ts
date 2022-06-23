import { IAgoraFormattedLine } from '../../../dtos/IAgoraFormattedLog';
import { IPossibleCommandLineArgs } from '../../../dtos/IPossibleCommandLineArgs';

export default interface ILogFormatterProvider {
  getHeader(possibleOptions?: IPossibleCommandLineArgs): string;
  parseValuesToLines(lines: IAgoraFormattedLine[]): string[];
  mergeLines(lines: string[]): string;
}
