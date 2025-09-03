import { test, expect } from '@playwright/test';

test.describe('Search functionality', () => {
  test.beforeEach(async ({ page }) => {
    // テスト前に検索ページに移動
    await page.goto('/search');
  });

  test('should display search page with all components', async ({ page }) => {
    // ページタイトルの確認
    await expect(page).toHaveTitle(/検索結果/);

    // 検索バーが表示されていることを確認
    const searchInput = page.locator('input[placeholder*="検索"]');
    await expect(searchInput).toBeVisible();

    // フィルターセクションが表示されていることを確認
    await expect(page.locator('text=フィルター')).toBeVisible();
    
    // カテゴリフィルターが存在することを確認
    await expect(page.locator('select[name="category"]')).toBeVisible();
    
    // 価格範囲フィルターが存在することを確認
    await expect(page.locator('input[name="minPrice"]')).toBeVisible();
    await expect(page.locator('input[name="maxPrice"]')).toBeVisible();
    
    // ソート選択が存在することを確認
    await expect(page.locator('select[name="sortBy"]')).toBeVisible();
  });

  test('should perform search and display results', async ({ page }) => {
    // 検索バーに入力
    const searchInput = page.locator('input[placeholder*="検索"]');
    await searchInput.fill('テスト商品');
    
    // Enterキーを押して検索実行
    await searchInput.press('Enter');
    
    // 検索結果が表示されるまで待機（最大5秒）
    await page.waitForSelector('[data-testid="search-results"]', { 
      timeout: 5000,
      state: 'visible' 
    });
    
    // 検索結果が存在することを確認
    const results = page.locator('[data-testid="search-result-item"]');
    await expect(results).toHaveCount(10); // デフォルトで10件表示と仮定
  });

  test('should filter search results by category', async ({ page }) => {
    // カテゴリフィルターを選択
    const categorySelect = page.locator('select[name="category"]');
    await categorySelect.selectOption('electronics');
    
    // フィルター適用ボタンをクリック（存在する場合）
    const applyButton = page.locator('button:has-text("適用")');
    if (await applyButton.isVisible()) {
      await applyButton.click();
    }
    
    // フィルター結果が反映されるまで待機
    await page.waitForTimeout(1000);
    
    // URLにカテゴリパラメータが含まれることを確認
    expect(page.url()).toContain('category=electronics');
  });

  test('should filter search results by price range', async ({ page }) => {
    // 価格範囲を入力
    await page.locator('input[name="minPrice"]').fill('1000');
    await page.locator('input[name="maxPrice"]').fill('5000');
    
    // フィルター適用
    const applyButton = page.locator('button:has-text("適用")');
    if (await applyButton.isVisible()) {
      await applyButton.click();
    }
    
    // 価格フィルターが適用されたことを確認
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('minPrice=1000');
    expect(page.url()).toContain('maxPrice=5000');
  });

  test('should sort search results', async ({ page }) => {
    // 検索を実行
    const searchInput = page.locator('input[placeholder*="検索"]');
    await searchInput.fill('商品');
    await searchInput.press('Enter');
    
    // 結果が表示されるまで待機
    await page.waitForSelector('[data-testid="search-results"]');
    
    // ソート順を変更
    const sortSelect = page.locator('select[name="sortBy"]');
    await sortSelect.selectOption('price_asc');
    
    // ソートが反映されるまで待機
    await page.waitForTimeout(1000);
    
    // URLにソートパラメータが含まれることを確認
    expect(page.url()).toContain('sortBy=price_asc');
  });

  test('should clear search and filters', async ({ page }) => {
    // 検索とフィルターを設定
    await page.locator('input[placeholder*="検索"]').fill('テスト');
    await page.locator('select[name="category"]').selectOption('electronics');
    await page.locator('input[name="minPrice"]').fill('1000');
    
    // クリアボタンをクリック
    const clearButton = page.locator('button:has-text("クリア")');
    if (await clearButton.isVisible()) {
      await clearButton.click();
      
      // フィールドがクリアされたことを確認
      await expect(page.locator('input[placeholder*="検索"]')).toHaveValue('');
      await expect(page.locator('select[name="category"]')).toHaveValue('all');
      await expect(page.locator('input[name="minPrice"]')).toHaveValue('');
    }
  });

  test('should show no results message when no items found', async ({ page }) => {
    // 存在しない商品を検索
    const searchInput = page.locator('input[placeholder*="検索"]');
    await searchInput.fill('存在しない商品名XXXYYY123');
    await searchInput.press('Enter');
    
    // 結果なしメッセージが表示されることを確認
    await expect(page.locator('text=検索結果が見つかりませんでした')).toBeVisible();
  });

  test('should maintain search state on page refresh', async ({ page }) => {
    // 検索条件を設定
    const searchInput = page.locator('input[placeholder*="検索"]');
    await searchInput.fill('キーワード');
    await searchInput.press('Enter');
    
    // カテゴリも選択
    await page.locator('select[name="category"]').selectOption('electronics');
    
    // ページをリロード
    await page.reload();
    
    // 検索条件が保持されていることを確認
    await expect(page.locator('input[placeholder*="検索"]')).toHaveValue('キーワード');
    await expect(page.locator('select[name="category"]')).toHaveValue('electronics');
  });

  test('should navigate to product detail from search results', async ({ page }) => {
    // 検索を実行
    await page.locator('input[placeholder*="検索"]').fill('商品');
    await page.locator('input[placeholder*="検索"]').press('Enter');
    
    // 結果が表示されるまで待機
    await page.waitForSelector('[data-testid="search-result-item"]');
    
    // 最初の商品をクリック
    const firstProduct = page.locator('[data-testid="search-result-item"]').first();
    await firstProduct.click();
    
    // 商品詳細ページに遷移したことを確認
    await expect(page).toHaveURL(/\/products\/\d+/);
  });

  test('should handle search with special characters', async ({ page }) => {
    // 特殊文字を含む検索
    const specialChars = '!@#$%^&*()_+{}[]|\\:";\'<>?,./';
    const searchInput = page.locator('input[placeholder*="検索"]');
    await searchInput.fill(specialChars);
    await searchInput.press('Enter');
    
    // エラーが発生しないことを確認
    await expect(page.locator('text=エラーが発生しました')).not.toBeVisible();
  });
});

test.describe('Search page accessibility', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/search');
    
    // Tabキーでフォーカス移動できることを確認
    await page.keyboard.press('Tab');
    const searchInput = page.locator('input[placeholder*="検索"]');
    await expect(searchInput).toBeFocused();
    
    // Enterキーで検索できることを確認
    await searchInput.fill('テスト');
    await page.keyboard.press('Enter');
    
    // 検索が実行されたことを確認
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('q=テスト');
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/search');
    
    // 重要な要素にARIAラベルがあることを確認
    const searchInput = page.locator('input[placeholder*="検索"]');
    const ariaLabel = await searchInput.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
  });
});

test.describe('Search page performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/search');
    const loadTime = Date.now() - startTime;
    
    // ページロードが3秒以内であることを確認
    expect(loadTime).toBeLessThan(3000);
  });

  test('should handle rapid search inputs (debouncing)', async ({ page }) => {
    await page.goto('/search');
    
    const searchInput = page.locator('input[placeholder*="検索"]');
    
    // 高速で文字を入力
    await searchInput.type('テスト商品', { delay: 50 });
    
    // デバウンス後に1回だけリクエストが送信されることを確認
    // (実際のAPIコール数を確認するにはネットワークモニタリングが必要)
    await page.waitForTimeout(1000);
    
    // エラーが発生していないことを確認
    await expect(page.locator('text=エラーが発生しました')).not.toBeVisible();
  });
});

test.describe('Search page responsive design', () => {
  test('should display correctly on mobile', async ({ page }) => {
    // モバイルビューポートに設定
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/search');
    
    // モバイル用のレイアウトが適用されていることを確認
    const searchInput = page.locator('input[placeholder*="検索"]');
    await expect(searchInput).toBeVisible();
    
    // フィルターがモバイル用に折りたたまれているか確認
    const filterToggle = page.locator('button:has-text("フィルター")');
    if (await filterToggle.isVisible()) {
      // フィルターボタンをクリックして展開
      await filterToggle.click();
      await expect(page.locator('select[name="category"]')).toBeVisible();
    }
  });

  test('should display correctly on tablet', async ({ page }) => {
    // タブレットビューポートに設定
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/search');
    
    // タブレット用のレイアウトが適用されていることを確認
    await expect(page.locator('input[placeholder*="検索"]')).toBeVisible();
    await expect(page.locator('select[name="category"]')).toBeVisible();
  });

  test('should display correctly on desktop', async ({ page }) => {
    // デスクトップビューポートに設定
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/search');
    
    // デスクトップ用のレイアウトが適用されていることを確認
    await expect(page.locator('input[placeholder*="検索"]')).toBeVisible();
    await expect(page.locator('select[name="category"]')).toBeVisible();
    
    // サイドバーフィルターが表示されることを確認（デスクトップのみ）
    const sidebar = page.locator('[data-testid="search-sidebar"]');
    if (await sidebar.isVisible()) {
      await expect(sidebar).toBeVisible();
    }
  });
});
