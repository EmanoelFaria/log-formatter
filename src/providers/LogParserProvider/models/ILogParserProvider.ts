import {
  IAgoraFormattedHeader,
  IAgoraFormattedLine,
} from '../../../dtos/IAgoraFormattedLog';

export default interface ILogParserProvider {
  parseHeader(customHeader: string): IAgoraFormattedHeader;
  parseLine(customLine: string): IAgoraFormattedLine | null;
  parseLines(customLines: string[]): IAgoraFormattedLine[];
  parseValuesToLines(lines: IAgoraFormattedLine[]): string[];
  parseResponse(response: any): any;
  mergeLines(lines: string[]): string;
  parseChunkToLines(chunk: string): string[];
  chunkHasManyLines(chunk: string): boolean;
}
