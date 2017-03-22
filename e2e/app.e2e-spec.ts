import { ForgeAngularPage } from './app.po';

describe('forge-angular App', () => {
  let page: ForgeAngularPage;

  beforeEach(() => {
    page = new ForgeAngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
