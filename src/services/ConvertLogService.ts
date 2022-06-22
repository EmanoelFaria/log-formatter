#!/usr/bin/env node

import * as fs from 'fs';
import { promisify } from 'util';
import LogParserProviderFactory from '../factories/LogParserProviderFactory';
import ICommandLineProvider from '../providers/CommandLineProvider/models/ICommandLineProvider';
import ILogParserProvider from '../providers/LogParserProvider/models/ILogParserProvider';
import IRequestProvider from '../providers/RequestProvider/models/IRequestProvider';
import { pipeline, Transform } from 'stream';
const pipelineAsync = promisify(pipeline);

export default class ConvertLogService {
  requestProvider: IRequestProvider;
  logParserProvider: ILogParserProvider;
  commandLineProvider: ICommandLineProvider;

  constructor(
    requestProvider: IRequestProvider,
    commandLineProvider: ICommandLineProvider,
  ) {
    this.requestProvider = requestProvider;
    this.commandLineProvider = commandLineProvider;
    this.logParserProvider = LogParserProviderFactory.getLogParserInstance(
      this.getClientName(),
    );
  }

  async convert() {
    const url = this.getUrl();
    const outputPath = this.getOutputPath();
    const writeableStream = fs.createWriteStream(outputPath);
    const readableStream = await this.getLogData(url);

    await pipelineAsync(readableStream, this.parseChunk(), writeableStream);
  }

  parseChunk() {
    return new Transform({
      transform: async (chunk, encoding, cb) => {
        const lines = this.logParserProvider.parseChunkToLines(chunk);
        const linesValues = this.logParserProvider.parseLines(lines);
        const parsedLines =
          this.logParserProvider.parseValuesToLines(linesValues);
        const mergedLines = this.logParserProvider.mergeLines(parsedLines);

        cb(null, mergedLines);
      },
    });
  }

  getClientName(): string | undefined {
    const clientName = this.commandLineProvider.getArgs()['name'];
    return clientName;
  }

  async getLogData(url: string) {
    const response = await this.requestProvider.get(url);
    const parsedResponse = this.logParserProvider.parseResponse(response);
    return parsedResponse;
  }

  getUrl(): string {
    const args = this.commandLineProvider.getArrayArgs();
    this.commandLineProvider.getArgs();

    const url = args[0];

    if (!url) throw new Error('Invalid url param');

    return url;
  }

  getOutputPath(): string {
    const args = this.commandLineProvider.getArrayArgs();
    this.commandLineProvider.getArgs();

    const url = args[1];

    if (!url) throw new Error('Invalid url param');

    return url;
  }
}
