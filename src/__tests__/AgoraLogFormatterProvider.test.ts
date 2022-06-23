import AgoraLogFormatterProvider from '../providers/LogFormatterProvider/implementations/AgoraLogFormatterProvider';
const logParserProvider = new AgoraLogFormatterProvider();

describe('Unit tests for implementation of AgoraLogFormatterProvider', () => {
  describe('parseValuesToLines Method', () => {
    it('Should return a valid data from response object ', async () => {
      const agoraFormattedLine = [
        {
          provider: 'MINHA CDN',
          httpMethod: 'GET',
          statusCode: 200,
          uriPath: '/robots.txt',
          timeTaken: 13,
          responseSize: 444,
          cacheStatus: 'HIT',
        },
        {
          provider: 'MINHA CDN',
          httpMethod: 'GET',
          statusCode: 401,
          uriPath: '/robots.txt',
          timeTaken: 13,
          responseSize: 10,
          cacheStatus: 'HIT',
        },
      ];

      const [firstLine, secondLine] =
        logParserProvider.parseValuesToLines(agoraFormattedLine);

      expect(firstLine).toBe(`"MINHA CDN" GET 200 /robots.txt 13 444 HIT \n`);
      expect(secondLine).toBe(`"MINHA CDN" GET 401 /robots.txt 13 10 HIT \n`);
    });
  });

  describe('mergeLines Method', () => {
    it('Should return a merged string from given string array ', async () => {
      const stringLines = [
        `"MINHA CDN" GET 200 /robots.txt 13 444 HIT \n`,
        `"MINHA CDN" GET 401 /robots.txt 13 10 HIT \n`,
      ];

      const mergedString = logParserProvider.mergeLines(stringLines);

      expect(mergedString).toBe(
        `"MINHA CDN" GET 200 /robots.txt 13 444 HIT \n"MINHA CDN" GET 401 /robots.txt 13 10 HIT \n`,
      );
    });

    it('Should return a merged string from given string array ', async () => {
      const stringLines = [`"MINHA CDN" GET 200 /robots.txt 13 444 HIT \n`];

      const mergedString = logParserProvider.mergeLines(stringLines);

      expect(mergedString).toBe(
        `"MINHA CDN" GET 200 /robots.txt 13 444 HIT \n`,
      );
    });
  });
});
