import { test, expect } from '@playwright/test';

test.describe('Document Processing E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'admin@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should upload and process documents', async ({ page }) => {
    // Navigate to document management
    await page.goto('/documents');
    await expect(page.locator('[data-testid="document-dashboard"]')).toBeVisible();

    // Upload passport document
    await page.click('[data-testid="upload-document"]');
    await page.setInputFiles('[data-testid="file-input"]', 'test-files/passport.pdf');
    await page.selectOption('[data-testid="document-type"]', 'passport');
    await page.fill('[data-testid="document-number"]', 'ET1234567');
    await page.fill('[data-testid="document-expiry"]', '2030-01-01');
    await page.selectOption('[data-testid="employee-select"]', '1');
    
    await page.click('[data-testid="submit-upload"]');

    // Should show success message
    await expect(page.locator('[data-testid="upload-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="upload-success"]')).toContainText('Document uploaded successfully');

    // Verify document appears in list
    await expect(page.locator('[data-testid="document-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="document-item-1"]')).toBeVisible();
    await expect(page.locator('[data-testid="document-status-1"]')).toContainText('pending');

    // Upload CV document
    await page.click('[data-testid="upload-document"]');
    await page.setInputFiles('[data-testid="file-input"]', 'test-files/cv.pdf');
    await page.selectOption('[data-testid="document-type"]', 'cv');
    await page.selectOption('[data-testid="employee-select"]', '1');
    
    await page.click('[data-testid="submit-upload"]');

    // Upload medical certificate
    await page.click('[data-testid="upload-document"]');
    await page.setInputFiles('[data-testid="file-input"]', 'test-files/medical.pdf');
    await page.selectOption('[data-testid="document-type"]', 'medical');
    await page.selectOption('[data-testid="employee-select"]', '1');
    
    await page.click('[data-testid="submit-upload"]');
  });

  test('should verify documents', async ({ page }) => {
    // Navigate to document verification
    await page.goto('/documents');
    
    // Click on first document to verify
    await page.click('[data-testid="verify-document-1"]');
    await expect(page.locator('[data-testid="verification-modal"]')).toBeVisible();

    // Verify passport document
    await page.selectOption('[data-testid="verification-status"]', 'verified');
    await page.fill('[data-testid="verification-notes"]', 'Passport verified - all details match');
    await page.fill('[data-testid="verified-by"]', 'Admin User');
    
    await page.click('[data-testid="submit-verification"]');

    // Should show verification success
    await expect(page.locator('[data-testid="verification-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="verification-success"]')).toContainText('Document verified successfully');

    // Verify document status updated
    await expect(page.locator('[data-testid="document-status-1"]')).toContainText('verified');
  });

  test('should handle document rejection', async ({ page }) => {
    await page.goto('/documents');
    
    // Click on second document to verify
    await page.click('[data-testid="verify-document-2"]');
    await expect(page.locator('[data-testid="verification-modal"]')).toBeVisible();

    // Reject document
    await page.selectOption('[data-testid="verification-status"]', 'rejected');
    await page.fill('[data-testid="verification-notes"]', 'Document quality is poor - please resubmit');
    await page.fill('[data-testid="verified-by"]', 'Admin User');
    
    await page.click('[data-testid="submit-verification"]');

    // Should show rejection message
    await expect(page.locator('[data-testid="verification-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="verification-success"]')).toContainText('Document rejected');

    // Verify document status updated
    await expect(page.locator('[data-testid="document-status-2"]')).toContainText('rejected');
  });

  test('should generate missing document report', async ({ page }) => {
    await page.goto('/documents/missing-report');
    await expect(page.locator('[data-testid="missing-report-dashboard"]')).toBeVisible();

    // Generate report for all employees
    await page.click('[data-testid="generate-report"]');
    await expect(page.locator('[data-testid="report-progress"]')).toBeVisible();

    // Wait for report generation
    await expect(page.locator('[data-testid="report-complete"]')).toBeVisible({ timeout: 10000 });

    // Verify report content
    await expect(page.locator('[data-testid="report-summary"]')).toBeVisible();
    await expect(page.locator('[data-testid="missing-documents-list"]')).toBeVisible();

    // Download report
    await page.click('[data-testid="download-report"]');
    
    // Verify download started
    const downloadPromise = page.waitForEvent('download');
    await downloadPromise;
  });

  test('should perform cross-match verification', async ({ page }) => {
    await page.goto('/documents/cross-match');
    await expect(page.locator('[data-testid="cross-match-dashboard"]')).toBeVisible();

    // Select employees for cross-match
    await page.check('[data-testid="employee-1"]');
    await page.check('[data-testid="employee-2"]');
    
    // Start cross-match
    await page.click('[data-testid="start-cross-match"]');
    await expect(page.locator('[data-testid="cross-match-progress"]')).toBeVisible();

    // Wait for cross-match to complete
    await expect(page.locator('[data-testid="cross-match-results"]')).toBeVisible({ timeout: 15000 });

    // Verify results
    await expect(page.locator('[data-testid="match-summary"]')).toBeVisible();
    await expect(page.locator('[data-testid="discrepancies-list"]')).toBeVisible();

    // Export results
    await page.click('[data-testid="export-results"]');
    
    // Verify export started
    const downloadPromise = page.waitForEvent('download');
    await downloadPromise;
  });

  test('should handle MOLS integration', async ({ page }) => {
    await page.goto('/documents/mols');
    await expect(page.locator('[data-testid="mols-dashboard"]')).toBeVisible();

    // Test MOLS connection
    await page.click('[data-testid="test-connection"]');
    await expect(page.locator('[data-testid="connection-status"]')).toBeVisible();
    await expect(page.locator('[data-testid="connection-status"]')).toContainText('Connected');

    // Sync documents with MOLS
    await page.click('[data-testid="sync-documents"]');
    await expect(page.locator('[data-testid="sync-progress"]')).toBeVisible();
    
    // Wait for sync to complete
    await expect(page.locator('[data-testid="sync-complete"]')).toBeVisible({ timeout: 20000 });

    // Verify sync results
    await expect(page.locator('[data-testid="sync-summary"]')).toBeVisible();
    await expect(page.locator('[data-testid="synced-count"]')).toBeVisible();

    // Check for conflicts
    if (await page.locator('[data-testid="conflicts-found"]').isVisible()) {
      await page.click('[data-testid="resolve-conflicts"]');
      await expect(page.locator('[data-testid="conflict-resolution"]')).toBeVisible();
      
      // Resolve conflicts
      await page.click('[data-testid="resolve-all-conflicts"]');
      await expect(page.locator('[data-testid="conflicts-resolved"]')).toBeVisible();
    }
  });

  test('should handle bulk document operations', async ({ page }) => {
    await page.goto('/documents');
    
    // Select multiple documents
    await page.check('[data-testid="document-checkbox-1"]');
    await page.check('[data-testid="document-checkbox-2"]');
    await page.check('[data-testid="document-checkbox-3"]');

    // Bulk verify
    await page.click('[data-testid="bulk-verify"]');
    await expect(page.locator('[data-testid="bulk-verification-modal"]')).toBeVisible();
    
    await page.selectOption('[data-testid="bulk-status"]', 'verified');
    await page.fill('[data-testid="bulk-notes"]', 'Bulk verification completed');
    
    await page.click('[data-testid="submit-bulk-verification"]');

    // Should show bulk success
    await expect(page.locator('[data-testid="bulk-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="bulk-success"]')).toContainText('3 documents verified');

    // Verify all documents updated
    await expect(page.locator('[data-testid="document-status-1"]')).toContainText('verified');
    await expect(page.locator('[data-testid="document-status-2"]')).toContainText('verified');
    await expect(page.locator('[data-testid="document-status-3"]')).toContainText('verified');
  });
});
