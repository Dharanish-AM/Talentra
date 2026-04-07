package com.talentra.e2e;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class AdminE2ETest extends BaseE2ETest {

    @Test
    public void testAdminFullJourney() {
        loginAs("admin@mail.com", "1234");
        waitForPortal("admin");
        
        // 1. Dashboard Metrics (Matching StatCard labels in AdminDashboard.tsx)
        WebElement companyStat = waitForVisible(By.xpath("//p[text()='Companies']/following-sibling::p"));
        WebElement drivesStat = waitForVisible(By.xpath("//p[text()='Active Drives']/following-sibling::p"));
        
        assertTrue(Integer.parseInt(companyStat.getText().replaceAll("[^0-9]", "")) >= 0);
        assertTrue(Integer.parseInt(drivesStat.getText().replaceAll("[^0-9]", "")) >= 0);

        // 2. Company Management (Grid of cards in Companies.tsx)
        clickNavigation("Companies");
        waitForUrl("/companies");
        WebElement companyCard = waitForVisible(By.xpath("//h3[contains(text(), 'Google')]"));
        assertTrue(companyCard.isDisplayed());

        // 3. Applicant Audit (Table in Applicants.tsx)
        clickNavigation("Applicants");
        waitForUrl("/applicants");
        // PageHeader uses h1 for the title
        WebElement applicantsHeader = waitForVisible(By.xpath("//h1[contains(text(), 'Applicants')]"));
        assertTrue(applicantsHeader.isDisplayed());
        
        WebElement appTable = waitForVisible(By.xpath("//table"));
        assertTrue(appTable.isDisplayed());
        
        logout();
    }
}
