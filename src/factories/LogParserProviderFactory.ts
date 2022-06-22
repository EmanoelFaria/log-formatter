import {ELogParserTypes} from '../providers/LogParserProvider/enums/ELogParserTypes';
import MinhaCDNLogParserProvider from '../providers/LogParserProvider/implementations/MinhaCDNLogParserProvider';
import ILogParserProvider from '../providers/LogParserProvider/models/ILogParserProvider';

export default class LogParserProviderFactory {
  static getLogParserInstance(clientName?: string): ILogParserProvider {
    if (!clientName) return new MinhaCDNLogParserProvider();

    if (clientName.toLowerCase() === ELogParserTypes.minhacdn)
      return new MinhaCDNLogParserProvider();

    return new MinhaCDNLogParserProvider();
  }
}
