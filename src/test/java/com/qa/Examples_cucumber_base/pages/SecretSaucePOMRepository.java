package com.qa.Examples_cucumber_base.pages;

import java.util.concurrent.TimeUnit;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.PageFactory;



public class SecretSaucePOMRepository {



	private WebDriver webDriver;
	
	public LandingPage landingPage;
	public SignupPage signupPage;
	public LoginPage loginPage;

	
	public SecretSaucePOMRepository(WebDriver webDriver) {
		this.webDriver = webDriver;
		this.webDriver.manage().timeouts().pageLoadTimeout(30, TimeUnit.SECONDS);
		this.webDriver.manage().timeouts().implicitlyWait(3000, TimeUnit.MILLISECONDS);
		
		this.landingPage = PageFactory.initElements(webDriver, LandingPage.class);
		this.signupPage = PageFactory.initElements(webDriver, SignupPage.class);
		this.loginPage = PageFactory.initElements(webDriver, LoginPage.class);

	}
	
	
}
