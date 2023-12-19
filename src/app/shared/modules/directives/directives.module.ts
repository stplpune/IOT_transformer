import { UpperCaseTextDirective } from './../../directive/upper-case-text.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlphanumericWithSpaceDirective } from '../../directive/alphanumeric-with-space.directive';
import { AlphabetOnlyDirective } from '../../directive/alphabet-only.directive';
import { NumericOnlyDirective } from '../../directive/numeric-only.directive';
import { AlphanumericWithoutSpaceDirective } from '../../directive/alphanumeric-without-space.directive';
import { AlphaNumericWithSpecialcharDirective } from '../../directive/alpha-numeric-with-specialchar.directive';
import { EmailValidationDirective } from '../../directive/email-validation.directive';
import { AutoFocusDirective } from '../../directive/auto-focus.directive';
import { NumberWithDecDirective } from '../../directive/number-with-dec.directive';
import { SuryNoDirective } from '../../directive/sury-no.directive';
import { BlockCopyPasteDirective } from '../../directive/block-copy-paste.directive';

@NgModule({
  declarations: [
    NumericOnlyDirective,
    AlphanumericWithSpaceDirective,
    AlphabetOnlyDirective,
    AlphanumericWithoutSpaceDirective,
    AlphaNumericWithSpecialcharDirective,
    EmailValidationDirective,
    AutoFocusDirective,
    UpperCaseTextDirective,
    NumberWithDecDirective,
    SuryNoDirective,
    BlockCopyPasteDirective,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NumericOnlyDirective,
    AlphanumericWithSpaceDirective,
    AlphabetOnlyDirective,
    AlphanumericWithoutSpaceDirective,
    AlphaNumericWithSpecialcharDirective,
    EmailValidationDirective,
    AutoFocusDirective,
    UpperCaseTextDirective,
    NumberWithDecDirective,
    SuryNoDirective,
    BlockCopyPasteDirective
  ]
})
export class DirectivesModule { }
