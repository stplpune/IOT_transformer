import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNumberWithDec]'
})
export class NumberWithDecDirective {

  regexStr = '^[0-9.]*$';
  @Input() isNumeric: boolean = false;

  constructor(private el: ElementRef) { }

  @HostListener('keypress', ['$event']) onKeyPress(event: any) {
    if (event.currentTarget.value.split('.').length - 1 == 1 && (event.keyCode == 46)) return false;  // double . not accept
    const maskSeperator = new RegExp(this.regexStr);
    return maskSeperator.test(event.key);
    // return new RegExp(this.regexStr).test(event.key);
  }

  @HostListener('paste', ['$event']) blockPaste(event: any) {
    this.validateFields(event);
  }

  validateFields(event: any) {
    setTimeout(() => {
      let val = this.el.nativeElement.value;
        val.replace(/[^0-9.]/g, '');
        if(this.el.nativeElement.value.split('.').length - 1 != 1){
          this.el.nativeElement.value = ''
          event.preventDefault();
        }else{
          val.replace(/\s/g, '');
          event.preventDefault();
        }
       
    }, 100);
  }
}

