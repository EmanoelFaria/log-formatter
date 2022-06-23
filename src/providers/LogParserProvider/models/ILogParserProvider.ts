import { IAgoraFormattedLine } from '../../../dtos/IAgoraFormattedLog';
import { IPossibleCommandLineArgs } from '../../../dtos/IPossibleCommandLineArgs';

export default interface ILogParserProvider {
  getHeader(possibleOptions?: IPossibleCommandLineArgs): string;
  parseLine(customLine: string): IAgoraFormattedLine | null | string;
  parseLines(customLines: string[]): IAgoraFormattedLine[];
  parseValuesToLines(lines: IAgoraFormattedLine[]): string[];
  parseResponse(response: any): any;
  mergeLines(lines: string[]): string;
  parseChunkToLines(chunk: string): string[];
  chunkHasManyLines(chunk: string): boolean;
}
