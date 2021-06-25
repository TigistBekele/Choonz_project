package com.qa.Examples_cucumber_base.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class SignupPage {
	private WebDriver driver;
	

	@FindBy(xpath = "//input[@id='username']")
	private WebElement usernameInputField;
	
	@FindBy(xpath = " //input[@id='password']")
	private WebElement passwordInputField;

	@FindBy(id = "confpassword")
	private WebElement confpasswordInputField;
	
	@FindBy(id = "submit")
	private WebElement createaccountButton;

	public void fillInLoginDetails(String username, String password, String confpw) throws InterruptedException {
		usernameInputField.sendKeys(username);
		passwordInputField.sendKeys(password);
		confpasswordInputField.sendKeys(confpw);
		createaccountButton.submit();
	}
	
	@FindBy(xpath = "//h2[contains(text(),'Welcome to Choonz')]")
	private WebElement welcomenote;
	

	public WebElement getwelcomenote() {
		return welcomenote;
	}

//	public void clicksingin() {
//		signinbutton.click();
//	}
//
//	public void clicklogout() {
//		logutbutton.click();
//	}
	public boolean singupcompleted() {
		if (welcomenote != null) {
			if (welcomenote.getText().equals("Welcome to Choonz")) {
				return true;
			}
		}
		return false;
	}

}
