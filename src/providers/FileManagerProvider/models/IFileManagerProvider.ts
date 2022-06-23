export default interface IFileManagerProvider {
  getWritableStream(outputPath: string): NodeJS.WritableStream;
}
