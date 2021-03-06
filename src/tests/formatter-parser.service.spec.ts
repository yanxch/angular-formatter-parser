import {inject, TestBed} from '@angular/core/testing'
import {FORMATTER_PARSER} from '../formatter-parser.injectionToken'
import {FormatterParserCollectorService} from '../formatter-parser.service'
import {IFormatterParserFn} from '../struct/formatter-parser-function'
import {IFormatterParserResult} from '../struct/formatter-parser-result'


function customFormatterFunction(v) {
  const result: IFormatterParserResult = {
    result: v + '_',
    name: 'customFormatterFunction',
  };
  return result;
}

describe('FormatterParserService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormatterParserCollectorService,
        {
          provide: FORMATTER_PARSER,
          useValue: customFormatterFunction,
          multi: true
        }
      ],
    });
  });

  it('should be created', inject([FormatterParserCollectorService], (service: FormatterParserCollectorService) => {
    expect(service).toBeTruthy();
  }));

  it('should throw if we request a not existing function', inject([FormatterParserCollectorService], (service: FormatterParserCollectorService) => {
    const functionName = 'notExistingFunction';
    expect(() => {
      service.getFormatParseFunction(functionName);
    }).toThrow(new Error(`Formatter or Parser with name ${functionName} 
                            is not provided as a function via FormatterParser 
                            service or FORMATTER_PARSER InjectionToken. 
                            Did you forgot to provide them?`));
  }));

  it('should be able to get the built in functions', inject([FormatterParserCollectorService], (service: FormatterParserCollectorService) => {
    const buildInFuncNames: string[] = ['toUpperCase', 'toLowerCase', 'replaceString', 'toCapitalized'];
    for (let i = 0; i < buildInFuncNames.length; i++) {
      const func: IFormatterParserFn = service.getFormatParseFunction(buildInFuncNames[i]);
      expect(typeof func).toBe('function');
    }
  }));

  it('replaceString built in function should work', inject([FormatterParserCollectorService], (service: FormatterParserCollectorService) => {
    const func: IFormatterParserFn = service.getFormatParseFunction('replaceString', [/[b]/, '']);
    expect(func('abc').result).toBe('ac');
  }));

  it('should return the function if we request a custom existing function', inject([FormatterParserCollectorService], (service: FormatterParserCollectorService) => {
    const customFormatterFunction = service.getFormatParseFunction('customFormatterFunction');
    expect(typeof customFormatterFunction).toBe('function');
    expect(customFormatterFunction('').result).toBe('_');
  }));

});
