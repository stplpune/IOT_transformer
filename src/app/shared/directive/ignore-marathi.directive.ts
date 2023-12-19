import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appIgnoreMarathi]'
})
export class IgnoreMarathiDirective {

  regexStr = "^[a-zA-Z0-9?><;,{}[\]\-_+=!@#$%\^&*|']*$"
  allowChar = ['8', '9', '37', '38', '39', '40', '46'];

  constructor(private el: ElementRef) { }

  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    this.validateFields(e);
  }

  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
    e.preventDefault();
  }

  validateFields(event: any) {
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
  }
}
