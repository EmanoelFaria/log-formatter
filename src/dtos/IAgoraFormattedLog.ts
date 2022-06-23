export interface IAgoraFormattedLine {
  provider: string;
  httpMethod: string;
  statusCode: number;
  uriPath: string;
  timeTaken: number;
  responseSize: number;
  cacheStatus: string;
}
