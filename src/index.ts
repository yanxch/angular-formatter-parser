import {CommonModule} from '@angular/common'
import {ModuleWithProviders, NgModule} from '@angular/core'
import {ReactiveFormsModule} from '@angular/forms'
import {FormatterParser} from './formatter-parser'

import {FormatterParserDirective} from './formatter-parser.directive'
import {FormatterParserCollectorService} from './formatter-parser.service'
import {InputContextService} from './input-context.service'
import {DefaultValueAccessorFormatterParser} from './directives/default_value_accessor';
import {ToUpperCaseDirective} from './directives/formatter-parser.directive';

export * from './formatter-parser.directive'
export * from './formatter-parser.service'
export * from './formatter-parser'
export * from './formatter-parser.injectionToken'
export * from './input-context.service'
export * from './directives/formatter-parser.directive'
export * from './directives/default_value_accessor'

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    FormatterParserDirective,
    DefaultValueAccessorFormatterParser,
    ToUpperCaseDirective
  ],
  exports: [FormatterParserDirective, ReactiveFormsModule]
})
export class FormatterParserModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FormatterParserModule,
      providers: [
        FormatterParserCollectorService,
        FormatterParser,
        InputContextService
      ]
    };
  }
}
