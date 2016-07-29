import { SiteV2Page } from './app.po';

describe('site-v2 App', function() {
  let page: SiteV2Page;

  beforeEach(() => {
    page = new SiteV2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
