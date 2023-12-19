import { Directive, ElementRef } from '@angular/core';
import { of, map, filter, take } from 'rxjs';

@Directive({
  selector: '[appAutoFocus]'
})
export class AutoFocusDirective {

  constructor(private el: ElementRef) { }
  ngOnInit() {
    of(this.el)
    .pipe(
      map(elementRef => elementRef.nativeElement), // getting the el
      filter(nativeElement => !!nativeElement), // filtering
      take(1) // avoid memory leak, it will unsubscribe automatically
    )
    // our side effect
    .subscribe(input => {
      input.focus();
    })
}
}
