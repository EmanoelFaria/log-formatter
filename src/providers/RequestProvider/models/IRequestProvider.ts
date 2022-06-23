export default interface IRequestProvider {
  get(url: string): Promise<any>;
}
