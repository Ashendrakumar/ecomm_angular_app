import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarUserItem } from './navbar-user-item';

describe('NavbarUserItem', () => {
  let component: NavbarUserItem;
  let fixture: ComponentFixture<NavbarUserItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarUserItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarUserItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
