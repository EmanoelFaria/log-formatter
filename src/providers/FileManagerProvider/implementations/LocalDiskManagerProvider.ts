import ICommandLineProvider from '../models/IFileManagerProvider';
import fs from 'fs';

export default class LocalDiskManagerProvider implements ICommandLineProvider {
  private folderExists(path: string): boolean {
    return fs.existsSync(path);
  }

  private createFolder(path: string): void {
    fs.mkdirSync(path, { recursive: true });
  }

  private getFolderPath(path: string) {
    let result = path.split('/');
    result.pop();
    return result.join('');
  }
  private getFilename(path: string) {
    return path.split('/').pop();
  }

  public getWritableStream(outputPath: string): NodeJS.WritableStream {
    const path = this.getFolderPath(outputPath);
    const file = this.getFilename(outputPath);
    if (!this.folderExists(path)) this.createFolder(path);

    return fs.createWriteStream(`${path}/${file}`);
  }
}
