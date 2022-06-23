#!/usr/bin/env node

import { promisify } from 'util';
import LogParserProviderFactory from '../factories/LogParserProviderFactory';
import LogFormatterProviderFactory from '../factories/LogFormatterProviderFactory';
import ICommandLineProvider from '../providers/CommandLineProvider/models/ICommandLineProvider';
import ILogParserProvider from '../providers/LogParserProvider/models/ILogParserProvider';
import IRequestProvider from '../providers/RequestProvider/models/IRequestProvider';
import IFileManagerProvider from '../providers/FileManagerProvider/models/IFileManagerProvider';
import ILogFormatterProvider from '../providers/LogFormatterProvider/models/ILogFormatterProvider';
import { pipeline, Transform } from 'stream';
import { IPossibleCommandLineArgs } from '../dtos/IPossibleCommandLineArgs';
const pipelineAsync = promisify(pipeline);

export default class ConvertLogService {
  requestProvider: IRequestProvider;
  logParserProvider: ILogParserProvider;
  logFormatterProvider: ILogFormatterProvider;
  commandLineProvider: ICommandLineProvider;
  fileManagerProvider: IFileManagerProvider;
  conversionOptions: IPossibleCommandLineArgs;

  constructor(
    requestProvider: IRequestProvider,
    commandLineProvider: ICommandLineProvider,
    fileManagerProvider: IFileManagerProvider,
  ) {
    this.requestProvider = requestProvider;
    this.commandLineProvider = commandLineProvider;
    this.fileManagerProvider = fileManagerProvider;
    this.conversionOptions = this.getOptions();
    this.logParserProvider = LogParserProviderFactory.getLogParserInstance(
      this.conversionOptions.origin,
    );
    this.logFormatterProvider =
      LogFormatterProviderFactory.getLogFormatterInstance(
        this.conversionOptions.destiny,
      );
  }

  getOptions(): IPossibleCommandLineArgs {
    return this.commandLineProvider.getPossibleArgs();
  }

  async convert() {
    this.validateArgs();
    const url = this.getUrl();
    const outputPath = this.getOutputPath();
    const writeableStream = this.getWritableStream(outputPath);
    const readableStream = await this.getLogData(url);

    writeableStream.write(this.getHeader());

    await pipelineAsync(
      readableStream,
      this.parseChunkLines(),
      writeableStream,
    );
  }

  getWritableStream(outputPath: string): NodeJS.WritableStream {
    return this.fileManagerProvider.getWritableStream(outputPath);
  }

  getHeader() {
    return this.logFormatterProvider.getHeader(this.conversionOptions);
  }

  parseChunkLines() {
    return new Transform({
      transform: async (chunk, encoding, cb) => {
        const lines = this.logParserProvider.parseChunkToLines(chunk);
        const linesValues = this.logParserProvider.parseLines(lines);
        const parsedLines =
          this.logFormatterProvider.parseValuesToLines(linesValues);
        const mergedLines = this.logFormatterProvider.mergeLines(parsedLines);

        cb(null, mergedLines);
      },
    });
  }

  async getLogData(url: string) {
    try {
      const response = await this.requestProvider.get(url);
      const parsedResponse = this.logParserProvider.parseResponse(response);
      return parsedResponse;
    } catch (error) {
      throw new Error('Error while getting logs from origin');
    }
  }

  validateArgs() {
    const args = this.commandLineProvider.getArrayArgs();
    if (args.length != 2) throw new Error(`Origin and destiny are required`);
  }

  getUrl(): string {
    const args = this.commandLineProvider.getArrayArgs();

    const url = args[0];

    this.validateUrl(url);

    return url;
  }

  validateUrl(url: string) {
    try {
      new URL(url);
    } catch (_) {
      throw new Error('Origin URL is not valid');
    }
  }

  getOutputPath(): string {
    const args = this.commandLineProvider.getArrayArgs();

    const url = args[1];

    if (!url) throw new Error('Invalid destination param');

    return url;
  }
}
