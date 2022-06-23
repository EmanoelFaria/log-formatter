import { IAgoraFormattedLine } from '../../../dtos/IAgoraFormattedLog';
import { IPossibleCommandLineArgs } from '../../../dtos/IPossibleCommandLineArgs';
import { ECacheStatusTypes } from '../enums/ECacheStatusTypes';
import ILogParserProvider from '../models/ILogParserProvider';

export default class MinhaCDNLogParserProvider implements ILogParserProvider {
  getHeader(possibleOptions?: IPossibleCommandLineArgs): string {
    const headerVersion = possibleOptions?.version
      ? possibleOptions.version
      : '1.0';
    const headerDate = this.formatDate();

    return [
      `#Version: ${headerVersion}\n`,
      `#Date: ${headerDate}\n`,
      `#Fields: provider http-method status-code uri-path response-size cache-status \n`,
    ].join('');
  }

  private formatDate(date?: Date) {
    date = date ? new Date(date) : new Date();

    const data = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getMilliseconds()}`;
    return `${data} ${time}`;
  }

  parseLine(customLine: string): IAgoraFormattedLine | null {
    const splittedLog = customLine.split('|');

    if (splittedLog.length < 5) {
      return null;
    }

    const responseSize = parseInt(splittedLog[0]);
    const statusCode = parseInt(splittedLog[1]);
    const httpMethod = splittedLog[3]
      .replace('"', '')
      .split(' ')[0]
      .toUpperCase();
    const uriPath = splittedLog[3].replace('"', '').split(' ')[1];
    const cacheStatus = this.parseCacheStatusFlag(splittedLog[2]);
    const timeTaken = Math.round(parseInt(splittedLog[4]));
    const provider = 'MINHA CDN';

    return {
      provider,
      httpMethod,
      statusCode,
      uriPath,
      timeTaken,
      responseSize,
      cacheStatus,
    };
  }

  mergeLines(lines: string[]): string {
    return lines.join('');
  }

  parseValuesToLines(lines: IAgoraFormattedLine[]): string[] {
    return lines.map(line => {
      return `"${line.provider}" ${line.httpMethod} ${line.statusCode} ${line.uriPath} ${line.timeTaken} ${line.responseSize} ${line.cacheStatus} \n`;
    });
  }

  parseLines(customLines: string[]): IAgoraFormattedLine[] {
    const parsedLines = customLines.map(line => this.parseLine(line));
    return parsedLines.filter(line => !!line) as IAgoraFormattedLine[];
  }

  parseResponse(response: any): any {
    if (!response.data) {
      throw new Error('Invalid response from "MINHA CDN" API');
    }

    return response.data;
  }

  parseCacheStatusFlag(cacheStatus: string): string {
    if (cacheStatus === 'INVALIDATE') return ECacheStatusTypes.REFRESH_HIT;
    if (cacheStatus === 'MISS') return ECacheStatusTypes.MISS;
    if (cacheStatus === 'HIT') return ECacheStatusTypes.HIT;

    return cacheStatus;
  }

  chunkHasManyLines(chunk: string): boolean {
    return chunk.toString().split(/\r?\n/).length > 1;
  }

  parseChunkToLines(chunk: string): string[] {
    if (this.chunkHasManyLines(chunk)) return chunk.toString().split(/\r?\n/);
    return [chunk.toString()];
  }
}
