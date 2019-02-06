import {Directive, InjectionToken} from '@angular/core';
import {FormatterParser} from '../formatter-parser';

export const NG_FORMATTER_PARSER = new InjectionToken<Array<IFormatterParser>>('NgFormatterParser');

export interface IFormatterParser {
  parse(value: any): any;
  format(value: any): any;
}

@Directive({
  selector: '[toUpperCase]',
  providers: [{
    provide: NG_FORMATTER_PARSER, 
    useExisting: ToUpperCaseDirective, 
    multi: true
  }]
})
export class ToUpperCaseDirective implements IFormatterParser {

  parse(value: string) {
    return FormatterParser.toLowerCase(value).result;
  }  
  
  format(value: any) {
    return FormatterParser.toUpperCase(value).result;
  }
}
