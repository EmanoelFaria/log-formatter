import { IAgoraFormattedLine } from '../../../dtos/IAgoraFormattedLog';
import { IPossibleCommandLineArgs } from '../../../dtos/IPossibleCommandLineArgs';
import ILogFormatterProvider from '../models/ILogFormatterProvider';

export default class OtherCompanyLogFormatterProvider
  implements ILogFormatterProvider
{
  getHeader(possibleOptions?: IPossibleCommandLineArgs): string {
    const headerVersion = possibleOptions?.version
      ? possibleOptions.version
      : '1.0';
    const headerDate = this.formatDate();

    return [
      `[Date: ${headerDate}]\n`,
      `[Version: ${headerVersion}]\n`,
      `--------------------------------------------------\n`,
      `http-method | uri-path | status-code \n`,
    ].join('');
  }

  private formatDate(date?: Date) {
    date = date ? new Date(date) : new Date();

    const data = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getMilliseconds()}`;
    return `${data} ${time}`;
  }

  mergeLines(lines: string[]): string {
    return lines.join('');
  }

  parseValuesToLines(lines: IAgoraFormattedLine[]): string[] {
    return lines.map(line => {
      return `| ${line.httpMethod} | ${line.uriPath} | ${line.statusCode} \n`;
    });
  }
}
