#!/usr/bin/env node

import RequestProvider from './providers/RequestProvider';
import CommandLineProvider from './providers/CommandLineProvider';
import FileManagerProvider from './providers/FileManagerProvider';
import ConvertLogService from './services/ConvertLogService';
import help from './config/help';
import * as process from 'process';

const convertLogService = new ConvertLogService(
  RequestProvider,
  CommandLineProvider,
  FileManagerProvider,
);

convertLogService
  .convert()
  .then(() => {
    // console.log('Conversion finished');
    process.kill(process.pid, 'SIGTERM');
  })
  .catch((error: any) => {
    console.log(help.errorMessage(error.message));
    console.log(help.usageInstructions);
  });
