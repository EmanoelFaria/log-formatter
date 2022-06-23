import { ECacheStatusTypes } from '../providers/LogParserProvider/enums/ECacheStatusTypes';
import MinhaCDNLogParserProvider from '../providers/LogParserProvider/implementations/MinhaCDNLogParserProvider';
const logParserProvider = new MinhaCDNLogParserProvider();
import { validateSchema } from './utils';
import Joi from 'joi';

const agoraFormattedLineSchema = Joi.object({
  provider: Joi.string().required(),
  httpMethod: Joi.string().required(),
  statusCode: Joi.number().required(),
  uriPath: Joi.string().required(),
  timeTaken: Joi.number().required(),
  responseSize: Joi.number().required(),
  cacheStatus: Joi.string().required(),
});

describe('Unit tests for implementation of MinhaCDNLogParserProvider', () => {
  describe('parseLine Method', () => {
    it('Should return a IAgoraFormattedLine', async () => {
      const line = `312|200|HIT|"GET /robots.txt HTTP/1.1"|100`;

      const parsedLine = logParserProvider.parseLine(line);
      const isSchemaValid = await validateSchema(
        agoraFormattedLineSchema,
        parsedLine,
      );
      expect(isSchemaValid).toBe(true);
      expect(parsedLine?.provider).toBe('MINHA CDN');
      expect(parsedLine?.httpMethod).toBe('GET');
      expect(parsedLine?.statusCode).toBe(200);
      expect(parsedLine?.uriPath).toBe('/robots.txt');
      expect(parsedLine?.timeTaken).toBe(100);
      expect(parsedLine?.responseSize).toBe(312);
      expect(parsedLine?.cacheStatus).toBe(ECacheStatusTypes.HIT);
    });

    it('Should round time numbers for IAgoraFormattedLine', async () => {
      const line = `312|200|HIT|"GET /robots.txt HTTP/1.1"|100.2`;

      const parsedLine = logParserProvider.parseLine(line);
      const isSchemaValid = await validateSchema(
        agoraFormattedLineSchema,
        parsedLine,
      );
      expect(isSchemaValid).toBe(true);
      expect(parsedLine?.provider).toBe('MINHA CDN');
      expect(parsedLine?.httpMethod).toBe('GET');
      expect(parsedLine?.statusCode).toBe(200);
      expect(parsedLine?.uriPath).toBe('/robots.txt');
      expect(parsedLine?.timeTaken).toBe(100);
      expect(parsedLine?.responseSize).toBe(312);
      expect(parsedLine?.cacheStatus).toBe(ECacheStatusTypes.HIT);
    });

    it('Should return a IAgoraFormattedLine with replaced cached status', async () => {
      const line = `312|200|INVALIDATE|"GET /robots.txt HTTP/1.1"|100.2`;
      // const parsedLine = "MINHA CDN" GET 200 /robots.txt 100 312 HIT"

      const parsedLine = logParserProvider.parseLine(line);
      const isSchemaValid = await validateSchema(
        agoraFormattedLineSchema,
        parsedLine,
      );
      expect(isSchemaValid).toBe(true);
      expect(parsedLine?.provider).toBe('MINHA CDN');
      expect(parsedLine?.httpMethod).toBe('GET');
      expect(parsedLine?.statusCode).toBe(200);
      expect(parsedLine?.uriPath).toBe('/robots.txt');
      expect(parsedLine?.timeTaken).toBe(100);
      expect(parsedLine?.responseSize).toBe(312);
      expect(parsedLine?.cacheStatus).toBe(ECacheStatusTypes.REFRESH_HIT);
    });

    it('Should return null for invalid or incomplete line', () => {
      const line = `312|200|INVALIDATE|"GET /robo`;
      // const parsedLine = "MINHA CDN" GET 200 /robots.txt 100 312 HIT"

      const parsedLine = logParserProvider.parseLine(line);
      expect(parsedLine).toBe(null);
    });
  });

  describe('parseLines Method', () => {
    it('Should return a IAgoraFormattedLine array', async () => {
      const lines = [
        `312|200|INVALIDATE|"GET /robots.txt HTTP/1.1"|100.2`,
        `199|404|MISS|"GET /not-found HTTP/1.1"|142.9`,
      ];
      // const parsedLine = "MINHA CDN" GET 200 /robots.txt 100 312 HIT"

      const parsedLines = logParserProvider.parseLines(lines);
      const [firstLine, secondLine] = parsedLines;

      const isSchemaValidFirstLine = await validateSchema(
        agoraFormattedLineSchema,
        firstLine,
      );
      const isSchemaValidSecondLine = await validateSchema(
        agoraFormattedLineSchema,
        secondLine,
      );
      expect(Array.isArray(parsedLines)).toBe(true);
      expect(isSchemaValidFirstLine).toBe(true);
      expect(isSchemaValidSecondLine).toBe(true);
    });

    it('Should return only valid IAgoraFormattedLine lines array', async () => {
      const lines = [
        `312|200|INVALIDATE|"GET /robots.txt HTTP/1.1"|100.2`,
        `199|404|MISS|"GET /not-found`,
        `199|404|MISS|"GET /not-found HTTP/1.1"|142.9`,
      ];
      // const parsedLine = "MINHA CDN" GET 200 /robots.txt 100 312 HIT"

      const parsedLines = logParserProvider.parseLines(lines);
      const [firstLine, secondLine] = parsedLines;

      const isSchemaValidFirstLine = await validateSchema(
        agoraFormattedLineSchema,
        firstLine,
      );
      const isSchemaValidSecondLine = await validateSchema(
        agoraFormattedLineSchema,
        secondLine,
      );
      expect(parsedLines.length).toBe(2);
      expect(Array.isArray(parsedLines)).toBe(true);
      expect(isSchemaValidFirstLine).toBe(true);
      expect(isSchemaValidSecondLine).toBe(true);
    });

    it('Should return a IAgoraFormattedLine array even if there is one line', async () => {
      const lines = [`312|200|INVALIDATE|"GET /robots.txt HTTP/1.1"|100.2`];
      // const parsedLine = "MINHA CDN" GET 200 /robots.txt 100 312 HIT"

      const parsedLines = logParserProvider.parseLines(lines);
      const [firstLine] = parsedLines;
      const isSchemaValidFirstLine = await validateSchema(
        agoraFormattedLineSchema,
        firstLine,
      );
      expect(Array.isArray(parsedLines)).toBe(true);
      expect(isSchemaValidFirstLine).toBe(true);
    });
  });

  describe('parseCacheStatusFlag Method', () => {
    it('Should return "HIT" if receive "HIT" status ', async () => {
      const receivedStatus = 'HIT';
      const parsedStatus =
        logParserProvider.parseCacheStatusFlag(receivedStatus);
      expect(parsedStatus).toBe(ECacheStatusTypes.HIT);
    });

    it('Should return "REFRESH_HIT" if receive "INVALIDATE" status ', async () => {
      const receivedStatus = 'INVALIDATE';
      const parsedStatus =
        logParserProvider.parseCacheStatusFlag(receivedStatus);
      expect(parsedStatus).toBe(ECacheStatusTypes.REFRESH_HIT);
    });

    it('Should return "MISS" if receive "MISS" status ', async () => {
      const receivedStatus = 'MISS';
      const parsedStatus =
        logParserProvider.parseCacheStatusFlag(receivedStatus);
      expect(parsedStatus).toBe(ECacheStatusTypes.MISS);
    });

    it('Should return received status if its not mapped ', async () => {
      const receivedStatus = 'UNMAPPED_STATUS';
      const parsedStatus =
        logParserProvider.parseCacheStatusFlag(receivedStatus);
      expect(parsedStatus).toBe('UNMAPPED_STATUS');
    });
  });

  describe('chunkHasManyLines Method', () => {
    it('Should return true for multi lines chunk', async () => {
      const chunk = `
      312|200|INVALIDATE|"GET /robots.txt HTTP/1.1"|100.2
      312|200|INVALIDATE|"GET /robots.txt HTTP/1.1"|100.2
      312|200|INVALIDATE|"GET /robots.txt HTTP/1.1"|100.2`;

      const hasManyLines = logParserProvider.chunkHasManyLines(chunk);
      expect(hasManyLines).toBe(true);
    });

    it('Should return false for one line chunk', async () => {
      const chunk = `312|200|INVALIDATE|"GET /robots.txt HTTP/1.1"|100.2`;

      const hasManyLines = logParserProvider.chunkHasManyLines(chunk);
      expect(hasManyLines).toBe(false);
    });
  });

  describe('parseChunkToLines Method', () => {
    it('Should return a array with multi lines for multi lines chunk', async () => {
      const chunk = `312|200|INVALIDATE|"GET /robots.txt HTTP/1.1"|100.2
      312|200|INVALIDATE|"GET /robots.txt HTTP/1.1"|100.2
      312|200|INVALIDATE|"GET /robots.txt HTTP/1.1"|100.2`;

      const chunkLines = logParserProvider.parseChunkToLines(chunk);
      expect(chunkLines.length).toBe(3);
    });

    it('Should return one line array for one line chunk', async () => {
      const chunk = `312|200|INVALIDATE|"GET /robots.txt HTTP/1.1"|100.2`;

      const chunkLines = logParserProvider.parseChunkToLines(chunk);
      expect(chunkLines.length).toBe(1);
    });
  });

  describe('parseResponse Method', () => {
    it('Should return a valid data from response object ', async () => {
      const response = {
        data: {},
      };

      const data = logParserProvider.parseResponse(response);
      expect(!!data).toBe(true);
    });

    it('Should throw an error for a invalid response object', async () => {
      const response = {
        invalidField: {},
      };

      try {
        logParserProvider.parseResponse(response);
      } catch (error: any) {
        expect(error.message).toBe('Invalid response from "MINHA CDN" API');
      }
    });
  });

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
