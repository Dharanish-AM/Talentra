package com.talentra.e2e;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class BaseE2ETest {

    protected WebDriver driver;
    protected WebDriverWait wait;
    protected final String baseUrl = "http://localhost:8080";

    @BeforeEach
    public void setUp() {
        ChromeOptions options = new ChromeOptions();
        // options.addArguments("--headless"); // Uncomment for CI
        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        driver.manage().window().maximize();
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    protected void loginAs(String email, String password) {
        driver.get(baseUrl + "/login");
        
        WebElement emailInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input[type='email']")));
        WebElement passwordInput = driver.findElement(By.cssSelector("input[type='password']"));
        WebElement loginButton = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(., 'Sign In')]")));

        emailInput.clear();
        emailInput.sendKeys(email);
        
        passwordInput.clear();
        passwordInput.sendKeys(password);
        
        loginButton.click();
        
        wait.until(ExpectedConditions.urlContains("/dashboard"));
    }

    protected void logout() {
        WebElement logoutButton = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(., 'Sign Out')]")));
        logoutButton.click();
        wait.until(ExpectedConditions.urlContains("/login"));
    }

    protected void waitForUrl(String snippet) {
        wait.until(ExpectedConditions.urlContains(snippet));
    }

    protected void clickNavigation(String linkText) {
        WebElement navLink = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//nav//a[contains(., '" + linkText + "')]")));
        navLink.click();
    }

    protected void waitForPortal(String role) {
        String xpath = "//p[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '" + role.toLowerCase() + " portal')]";
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(xpath)));
    }
    
    protected WebElement waitForVisible(By locator) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
    }
}
