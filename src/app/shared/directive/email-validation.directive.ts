import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[emailValidation]'
})
export class EmailValidationDirective {
  regexStr = '^([a-z0-9]+(?:[._-][a-z0-9]+)*)@([a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,})$';
  allowChar = ['8', '9', '37', '38', '39', '40', '46'];

  @Input() isNumeric: boolean = false;

  constructor(private el: ElementRef) { }

  @HostListener('keypress', ['$event']) onKeyPress(event: any) {
    return event.key.match(this.regexStr);
    //return new RegExp(this.regexStr).test(event.key);
  }

  @HostListener('paste', ['$event']) blockPaste(event: any) {
    this.validateFields(event);
  }

  validateFields(event: any) {
    setTimeout(() => {
      let regex = new RegExp(this.regexStr);
      let text = this.el.nativeElement.value;
      let str = typeof text != 'undefined' && text.length ? text : String.fromCharCode(!event.charCode ? event.which : event.charCode);
      if (!regex.test(str)) {
        let notAllowed = true;
        if (!event.shiftKey && !event.ctrlKey && !event.altKey) {
            for (var i in this.allowChar) {
                if (this.allowChar[i] == event.keyCode && event.keyCode != '0' && str != '.' && str != "'") {
                    notAllowed = false;
                }
            }
        }
        if (notAllowed) {
            this.el.nativeElement.value = ''
            event.preventDefault();
        }
      }
    }, 100);
  }
}
