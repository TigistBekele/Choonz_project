package com.qa.Examples_cucumber_base.pages;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class LoginPage {
	final public static String URL = "http://localhost:8082";

	@FindBy(xpath = "//h2[contains(text(),'Welcome to Choonz')]")
	private WebElement wellcomeField;

	public void welcomeButton() throws InterruptedException{
		wellcomeField.click();
	}
}
