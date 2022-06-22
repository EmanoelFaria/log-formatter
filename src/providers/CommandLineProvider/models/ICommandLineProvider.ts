export default interface ICommandLineProvider {
  getArrayArgs(): string[];
  getArgs(): any;
}
