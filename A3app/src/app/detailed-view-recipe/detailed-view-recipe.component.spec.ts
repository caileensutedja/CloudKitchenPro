import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedViewRecipeComponent } from './detailed-view-recipe.component';

describe('DetailedViewRecipeComponent', () => {
  let component: DetailedViewRecipeComponent;
  let fixture: ComponentFixture<DetailedViewRecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailedViewRecipeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailedViewRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
