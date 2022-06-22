import axios from 'axios';
import IRequestProvider from '../models/IRequestProvider';

export default class AxiosRequestProvider implements IRequestProvider {
  public async get(url: string) {
    return await axios({
      method: 'get',
      url: url,
      responseType: 'stream',
    });
  }
}
