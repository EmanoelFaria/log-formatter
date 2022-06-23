import { IAgoraFormattedLine } from '../../../dtos/IAgoraFormattedLog';

export default interface ILogParserProvider {
  parseLine(customLine: string): IAgoraFormattedLine | null | string;
  parseLines(customLines: string[]): IAgoraFormattedLine[];
  parseResponse(response: any): any;
  parseChunkToLines(chunk: string): string[];
  chunkHasManyLines(chunk: string): boolean;
}
