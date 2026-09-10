import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { Userlist } from './userlist';

describe('Userlist', () => {
  let component: Userlist;
  let fixture: ComponentFixture<Userlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Userlist],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(Userlist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
