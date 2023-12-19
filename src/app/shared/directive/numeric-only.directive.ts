import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[numericOnly]'
})
export class NumericOnlyDirective {

  regexStr = '^[0-9]*$';
  @Input() isNumeric: boolean = false;

  constructor(private el: ElementRef) { }

  @HostListener('keypress', ['$event']) onKeyPress(event: any) {
    return new RegExp(this.regexStr).test(event.key);
  }

  @HostListener('paste', ['$event']) blockPaste(event: any) {
    this.validateFields(event);
  }

  validateFields(event: any) {
    setTimeout(() => {
      this.el.nativeElement.value = this.el.nativeElement.value
        .replace(/[^0-9 ]/g, '')
        .replace(/\s/g, '');
      event.preventDefault();
    }, 100);
  }
}
