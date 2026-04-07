package com.talentra.e2e;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class RecruiterE2ETest extends BaseE2ETest {

    @Test
    public void testRecruiterFullJourney() {
        loginAs("hr@google.com", "1234");
        waitForPortal("recruiter");
        
        // 1. Recruiter Dashboard (Matching StatCard labels in RecruiterDashboard.tsx)
        WebElement shortlistedStat = waitForVisible(By.xpath("//p[text()='Shortlisted']/following-sibling::p"));
        assertTrue(Integer.parseInt(shortlistedStat.getText().replaceAll("[^0-9]", "")) >= 0);

        // 2. Candidate Pipeline
        clickNavigation("Candidates");
        waitForUrl("/candidates");
        // PageHeader uses h1
        WebElement candidatesTitle = waitForVisible(By.xpath("//h1[contains(text(), 'Candidates')]"));
        assertTrue(candidatesTitle.isDisplayed());
        
        WebElement candidateTable = waitForVisible(By.xpath("//table"));
        // Case-insensitive check
        assertTrue(candidateTable.getText().toLowerCase().contains("student"));
        
        logout();
    }
}
