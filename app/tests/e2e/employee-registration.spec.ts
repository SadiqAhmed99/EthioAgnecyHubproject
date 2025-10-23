import { test, expect } from '@playwright/test';

test.describe('Employee Registration E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'admin@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should complete full employee registration workflow', async ({ page }) => {
    // Navigate to employee registration
    await page.goto('/employee-management/registration');
    await expect(page.locator('[data-testid="registration-wizard"]')).toBeVisible();

    // Step 1: Personal Information
    await page.fill('[data-testid="first-name"]', 'Alemitu');
    await page.fill('[data-testid="last-name"]', 'Kebede');
    await page.fill('[data-testid="email"]', 'alemitu.kebede@example.com');
    await page.fill('[data-testid="phone"]', '+251911234567');
    await page.selectOption('[data-testid="gender"]', 'female');
    await page.fill('[data-testid="date-of-birth"]', '1995-05-15');
    await page.fill('[data-testid="place-of-birth"]', 'Addis Ababa');
    
    await page.click('[data-testid="next-step"]');
    await expect(page.locator('[data-testid="step-passport"]')).toBeVisible();

    // Step 2: Passport Information
    await page.fill('[data-testid="passport-number"]', 'ET9876543');
    await page.fill('[data-testid="passport-issue-date"]', '2020-01-01');
    await page.fill('[data-testid="passport-expiry"]', '2030-01-01');
    await page.selectOption('[data-testid="nationality"]', 'Ethiopian');
    await page.fill('[data-testid="place-of-issue"]', 'Addis Ababa');
    
    await page.click('[data-testid="next-step"]');
    await expect(page.locator('[data-testid="step-emergency"]')).toBeVisible();

    // Step 3: Emergency Contact
    await page.fill('[data-testid="emergency-name"]', 'Kebede Worku');
    await page.fill('[data-testid="emergency-phone"]', '+251911234568');
    await page.fill('[data-testid="emergency-relationship"]', 'Father');
    await page.fill('[data-testid="emergency-address"]', 'Addis Ababa, Ethiopia');
    
    await page.click('[data-testid="next-step"]');
    await expect(page.locator('[data-testid="step-skills"]')).toBeVisible();

    // Step 4: Skills and Experience
    await page.check('[data-testid="skill-housekeeping"]');
    await page.check('[data-testid="skill-cooking"]');
    await page.check('[data-testid="skill-childcare"]');
    await page.selectOption('[data-testid="experience-level"]', 'intermediate');
    await page.fill('[data-testid="years-experience"]', '3');
    await page.fill('[data-testid="previous-employer"]', 'Private household');
    
    await page.click('[data-testid="next-step"]');
    await expect(page.locator('[data-testid="step-languages"]')).toBeVisible();

    // Step 5: Languages
    await page.check('[data-testid="language-amharic"]');
    await page.check('[data-testid="language-english"]');
    await page.check('[data-testid="language-arabic"]');
    await page.selectOption('[data-testid="english-level"]', 'basic');
    await page.selectOption('[data-testid="arabic-level"]', 'basic');
    
    await page.click('[data-testid="next-step"]');
    await expect(page.locator('[data-testid="step-regional"]')).toBeVisible();

    // Step 6: Regional Information
    await page.selectOption('[data-testid="region"]', 'Addis Ababa');
    await page.selectOption('[data-testid="zone"]', 'Addis Ababa');
    await page.fill('[data-testid="woreda"]', 'Bole');
    await page.fill('[data-testid="kebele"]', 'Kebele 01');
    await page.fill('[data-testid="house-number"]', '123');
    
    await page.click('[data-testid="next-step"]');
    await expect(page.locator('[data-testid="step-interests"]')).toBeVisible();

    // Step 7: Job Interests
    await page.check('[data-testid="interest-housekeeping"]');
    await page.check('[data-testid="interest-cooking"]');
    await page.check('[data-testid="interest-childcare"]');
    await page.check('[data-testid="interest-elderly-care"]');
    await page.fill('[data-testid="additional-interests"]', 'Gardening, Pet care');
    await page.selectOption('[data-testid="preferred-country"]', 'Saudi Arabia');
    
    await page.click('[data-testid="next-step"]');
    await expect(page.locator('[data-testid="step-documents"]')).toBeVisible();

    // Step 8: Document Upload
    await page.setInputFiles('[data-testid="passport-file"]', 'test-files/passport.pdf');
    await page.setInputFiles('[data-testid="cv-file"]', 'test-files/cv.pdf');
    await page.setInputFiles('[data-testid="photo-file"]', 'test-files/photo.jpg');
    await page.setInputFiles('[data-testid="medical-file"]', 'test-files/medical.pdf');
    
    await page.click('[data-testid="next-step"]');
    await expect(page.locator('[data-testid="step-bank"]')).toBeVisible();

    // Step 9: Bank Information
    await page.fill('[data-testid="bank-name"]', 'Commercial Bank of Ethiopia');
    await page.fill('[data-testid="branch-name"]', 'Bole Branch');
    await page.fill('[data-testid="account-number"]', '1234567890');
    await page.fill('[data-testid="account-holder"]', 'Alemitu Kebede');
    await page.fill('[data-testid="swift-code"]', 'CBETETAA');
    
    await page.click('[data-testid="next-step"]');
    await expect(page.locator('[data-testid="step-appointment"]')).toBeVisible();

    // Step 10: Appointment Scheduling
    await page.fill('[data-testid="appointment-date"]', '2024-02-15');
    await page.fill('[data-testid="appointment-time"]', '10:00');
    await page.selectOption('[data-testid="appointment-type"]', 'interview');
    await page.fill('[data-testid="appointment-notes"]', 'Initial interview and document verification');
    
    await page.click('[data-testid="next-step"]');
    await expect(page.locator('[data-testid="step-preview"]')).toBeVisible();

    // Step 11: Preview and Submit
    await expect(page.locator('[data-testid="preview-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="employee-name"]')).toContainText('Alemitu Kebede');
    await expect(page.locator('[data-testid="employee-email"]')).toContainText('alemitu.kebede@example.com');
    await expect(page.locator('[data-testid="employee-phone"]')).toContainText('+251911234567');
    
    // Review all sections
    await expect(page.locator('[data-testid="personal-info"]')).toBeVisible();
    await expect(page.locator('[data-testid="passport-info"]')).toBeVisible();
    await expect(page.locator('[data-testid="skills-info"]')).toBeVisible();
    
    // Submit registration
    await page.click('[data-testid="submit-registration"]');

    // Should show success message and redirect
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Registration completed successfully');
    
    // Should redirect to employee management
    await expect(page).toHaveURL('/employee-management');
  });

  test('should handle validation errors in registration', async ({ page }) => {
    await page.goto('/employee-management/registration');

    // Try to proceed without filling required fields
    await page.click('[data-testid="next-step"]');

    // Should show validation errors
    await expect(page.locator('[data-testid="first-name-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="last-name-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="phone-error"]')).toBeVisible();

    // Fill invalid email
    await page.fill('[data-testid="email"]', 'invalid-email');
    await page.click('[data-testid="next-step"]');

    // Should show email validation error
    await expect(page.locator('[data-testid="email-error"]')).toContainText('Invalid email format');

    // Fill invalid phone
    await page.fill('[data-testid="phone"]', '123');
    await page.click('[data-testid="next-step"]');

    // Should show phone validation error
    await expect(page.locator('[data-testid="phone-error"]')).toContainText('Invalid phone number');
  });

  test('should allow going back and editing previous steps', async ({ page }) => {
    await page.goto('/employee-management/registration');

    // Fill step 1
    await page.fill('[data-testid="first-name"]', 'Test');
    await page.fill('[data-testid="last-name"]', 'User');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="phone"]', '+251911234567');
    await page.selectOption('[data-testid="gender"]', 'female');
    await page.fill('[data-testid="date-of-birth"]', '1990-01-01');
    
    await page.click('[data-testid="next-step"]');

    // Go to step 2
    await page.fill('[data-testid="passport-number"]', 'ET1234567');
    await page.click('[data-testid="next-step"]');

    // Go back to step 1
    await page.click('[data-testid="previous-step"]');
    await expect(page.locator('[data-testid="step-personal"]')).toBeVisible();

    // Verify data is still there
    await expect(page.locator('[data-testid="first-name"]')).toHaveValue('Test');
    await expect(page.locator('[data-testid="last-name"]')).toHaveValue('User');

    // Edit the data
    await page.fill('[data-testid="first-name"]', 'Updated Test');
    await page.click('[data-testid="next-step"]');

    // Go to step 2 and verify the change
    await expect(page.locator('[data-testid="step-passport"]')).toBeVisible();
    await page.click('[data-testid="previous-step"]');
    await expect(page.locator('[data-testid="first-name"]')).toHaveValue('Updated Test');
  });
});
