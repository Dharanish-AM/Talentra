package com.talentra.e2e;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class StudentE2ETest extends BaseE2ETest {

    @Test
    public void testStudentFullJourney() {
        // 1. Login
        loginAs("dharanish@mail.com", "1234");
        waitForPortal("student");
        
        // 2. Dashboard Widgets
        WebElement welcomeMsg = waitForVisible(By.xpath("//h1[contains(text(), 'Talentra')]"));
        assertTrue(welcomeMsg.isDisplayed());

        // 3. Job Drives & Details
        clickNavigation("Job Drives");
        waitForUrl("/drives");
        
        // Find a drive card (e.g., Google or Microsoft)
        WebElement driveCard = waitForVisible(By.xpath("//div[contains(@class, 'shadow-card')][.//p[contains(text(), 'Google')]]"));
        assertTrue(driveCard.isDisplayed());
        
        // Click to view details
        driveCard.click();
        
        // Verify dialog content (matching DriveDetailDialog.tsx which uses role='dialog')
        WebElement dialog = waitForVisible(By.xpath("//div[@role='dialog']"));
        assertTrue(dialog.isDisplayed());
        
        // Verify company name in dialog title (which is an h2)
        WebElement dialogHeading = dialog.findElement(By.xpath(".//h2[contains(text(), 'Google')]"));
        assertTrue(dialogHeading.isDisplayed());
        
        // Verify salary/package in dialog text
        assertTrue(dialog.getText().toLowerCase().contains("package"));
        
        // Close dialog using ESC key
        driver.findElement(By.tagName("body")).sendKeys("\uE00C"); 

        // 4. My Applications
        clickNavigation("My Applications");
        waitForUrl("/applications");
        WebElement appTable = waitForVisible(By.xpath("//table"));
        // Case-insensitive check because of CSS uppercase
        assertTrue(appTable.getText().toLowerCase().contains("company"));

        // 5. Profile Verification
        clickNavigation("My Profile");
        waitForUrl("/profile");
        // Email is displayed as text in a p tag, not an input value
        WebElement emailField = waitForVisible(By.xpath("//p[contains(text(), 'dharanish@mail.com')]"));
        assertTrue(emailField.isDisplayed());
        
        // 6. Logout
        logout();
    }
}
