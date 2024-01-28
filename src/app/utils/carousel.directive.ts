import { Directive, ElementRef, AfterViewInit, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[appCarousel]'
})
export class CarouselDirective implements AfterViewInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {
    console.log(el.nativeElement)
  }

  ngAfterViewInit() {
    this.initializeCarousel();
  }

  private initializeCarousel() {

    const items = this.el.nativeElement.querySelectorAll('.carousel-item');
    console.log(items)
    items.forEach((el: HTMLElement) => {
      console.log(items)
      const minPerSlide = 4
      let next = el.nextElementSibling;

      for (let i = 1; i < minPerSlide; i++) {
        console.log(next)
        if (!next) {
          // Wrap carousel by using the first child
          next = items[0];
        }
        if (next) {
          let cloneChild = next.cloneNode(true) as HTMLElement;
          this.renderer.appendChild(el, cloneChild.children[0]);
          next = next.nextElementSibling;
        }
      }
    });
  }
}
