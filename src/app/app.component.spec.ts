import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Title } from '@angular/platform-browser';

describe('AppComponent', () => {
  let titleService: Title;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
    titleService = TestBed.inject(Title)
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'interactive-svg-editor' title`, () => {
    spyOn(titleService, 'setTitle')
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, interactive-svg-editor');
  });
});
