package com.qa.Examples_cucumber_base.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class LandingPage {
	final public static String URL = "http://localhost:8082";
	private WebDriver driver;
	
  
	@FindBy(xpath = "//a[contains(text(),'Logout')]")
	private WebElement logoutInputField;
	
	@FindBy(xpath = "//a[contains(text(),'Sign Up')]")

	private WebElement signupInputField;
	

	public void logoutButton() throws InterruptedException{
		logoutInputField.click();
	}
	public void signupButton() throws InterruptedException{
		signupInputField.click();
	}
}
