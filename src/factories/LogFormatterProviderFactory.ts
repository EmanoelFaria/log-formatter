import { ELogFormatterTypes } from '../providers/LogFormatterProvider/enums/ELogFormatterTypes';
import AgoraLogFormatterProvider from '../providers/LogFormatterProvider/implementations/AgoraLogFormatterProvider';
import OtherCompanyLogFormatterProvider from '../providers/LogFormatterProvider/implementations/OtherCompanyLogFormatterProvider';
import ILogFormatterProvider from '../providers/LogFormatterProvider/models/ILogFormatterProvider';

export default class LogParserProviderFactory {
  static getLogFormatterInstance(
    formatterName?: string,
  ): ILogFormatterProvider {
    if (!formatterName) return new AgoraLogFormatterProvider();

    if (formatterName.toLowerCase() === ELogFormatterTypes.agora)
      return new AgoraLogFormatterProvider();

    if (formatterName.toLowerCase() === ELogFormatterTypes.other)
      return new OtherCompanyLogFormatterProvider();

    // throw new Error('cant find log parser');

    return new AgoraLogFormatterProvider();
  }
}
