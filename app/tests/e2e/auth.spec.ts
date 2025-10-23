import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill login form
    await page.fill('[data-testid="email-input"]', 'admin@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    
    // Submit form
    await page.click('[data-testid="login-button"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill with invalid credentials
    await page.fill('[data-testid="email-input"]', 'invalid@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    
    // Submit form
    await page.click('[data-testid="login-button"]');

    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid credentials');
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'admin@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');

    // Should be on dashboard
    await expect(page).toHaveURL('/dashboard');

    // Click logout
    await page.click('[data-testid="logout-button"]');

    // Should redirect to login
    await expect(page).toHaveURL('/login');
  });
});

test.describe('Employee Registration', () => {
  test('should complete employee registration wizard', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'admin@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');

    // Navigate to employee registration
    await page.goto('/employee-management/registration');
    await expect(page.locator('[data-testid="registration-wizard"]')).toBeVisible();

    // Step 1: Personal Information
    await page.fill('[data-testid="first-name"]', 'John');
    await page.fill('[data-testid="last-name"]', 'Doe');
    await page.fill('[data-testid="email"]', 'john.doe@example.com');
    await page.fill('[data-testid="phone"]', '+251911234567');
    await page.selectOption('[data-testid="gender"]', 'male');
    await page.fill('[data-testid="date-of-birth"]', '1990-01-01');
    
    await page.click('[data-testid="next-step"]');

    // Step 2: Passport Information
    await page.fill('[data-testid="passport-number"]', 'ET1234567');
    await page.fill('[data-testid="passport-expiry"]', '2030-01-01');
    await page.selectOption('[data-testid="nationality"]', 'Ethiopian');
    
    await page.click('[data-testid="next-step"]');

    // Step 3: Emergency Contact
    await page.fill('[data-testid="emergency-name"]', 'Jane Doe');
    await page.fill('[data-testid="emergency-phone"]', '+251911234568');
    await page.fill('[data-testid="emergency-relationship"]', 'Sister');
    
    await page.click('[data-testid="next-step"]');

    // Step 4: Skills
    await page.fill('[data-testid="skills"]', 'Housekeeping, Cooking, Childcare');
    await page.selectOption('[data-testid="experience-level"]', 'intermediate');
    
    await page.click('[data-testid="next-step"]');

    // Step 5: Languages
    await page.check('[data-testid="language-amharic"]');
    await page.check('[data-testid="language-english"]');
    await page.selectOption('[data-testid="english-level"]', 'basic');
    
    await page.click('[data-testid="next-step"]');

    // Step 6: Regional Information
    await page.selectOption('[data-testid="region"]', 'Addis Ababa');
    await page.selectOption('[data-testid="zone"]', 'Addis Ababa');
    await page.fill('[data-testid="woreda"]', 'Bole');
    
    await page.click('[data-testid="next-step"]');

    // Step 7: Interests
    await page.check('[data-testid="interest-housekeeping"]');
    await page.check('[data-testid="interest-cooking"]');
    await page.fill('[data-testid="additional-interests"]', 'Gardening');
    
    await page.click('[data-testid="next-step"]');

    // Step 8: Documents
    await page.setInputFiles('[data-testid="passport-file"]', 'test-files/passport.pdf');
    await page.setInputFiles('[data-testid="cv-file"]', 'test-files/cv.pdf');
    
    await page.click('[data-testid="next-step"]');

    // Step 9: Bank Information
    await page.fill('[data-testid="bank-name"]', 'Commercial Bank of Ethiopia');
    await page.fill('[data-testid="account-number"]', '1234567890');
    await page.fill('[data-testid="account-holder"]', 'John Doe');
    
    await page.click('[data-testid="next-step"]');

    // Step 10: Appointment
    await page.fill('[data-testid="appointment-date"]', '2024-02-01');
    await page.fill('[data-testid="appointment-time"]', '10:00');
    
    await page.click('[data-testid="next-step"]');

    // Step 11: Preview and Submit
    await expect(page.locator('[data-testid="preview-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="employee-name"]')).toContainText('John Doe');
    
    await page.click('[data-testid="submit-registration"]');

    // Should show success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Registration completed successfully');
  });

  test('should validate required fields in registration', async ({ page }) => {
    await page.goto('/employee-management/registration');

    // Try to proceed without filling required fields
    await page.click('[data-testid="next-step"]');

    // Should show validation errors
    await expect(page.locator('[data-testid="first-name-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="last-name-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
  });
});

test.describe('Document Processing', () => {
  test('should upload and verify documents', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'admin@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');

    // Navigate to document management
    await page.goto('/documents');
    await expect(page.locator('[data-testid="document-dashboard"]')).toBeVisible();

    // Upload a document
    await page.click('[data-testid="upload-document"]');
    await page.setInputFiles('[data-testid="file-input"]', 'test-files/passport.pdf');
    await page.selectOption('[data-testid="document-type"]', 'passport');
    await page.fill('[data-testid="document-number"]', 'ET1234567');
    
    await page.click('[data-testid="submit-upload"]');

    // Should show success message
    await expect(page.locator('[data-testid="upload-success"]')).toBeVisible();

    // Verify the document
    await page.click('[data-testid="verify-document"]');
    await page.selectOption('[data-testid="verification-status"]', 'verified');
    await page.fill('[data-testid="verification-notes"]', 'Document verified successfully');
    
    await page.click('[data-testid="submit-verification"]');

    // Should show verification success
    await expect(page.locator('[data-testid="verification-success"]')).toBeVisible();
  });

  test('should handle MOLS integration', async ({ page }) => {
    await page.goto('/documents/mols');
    await expect(page.locator('[data-testid="mols-dashboard"]')).toBeVisible();

    // Test MOLS connection
    await page.click('[data-testid="test-mols-connection"]');
    await expect(page.locator('[data-testid="connection-status"]')).toContainText('Connected');

    // Sync documents
    await page.click('[data-testid="sync-documents"]');
    await expect(page.locator('[data-testid="sync-progress"]')).toBeVisible();
    
    // Wait for sync to complete
    await expect(page.locator('[data-testid="sync-success"]')).toBeVisible({ timeout: 10000 });
  });
});
