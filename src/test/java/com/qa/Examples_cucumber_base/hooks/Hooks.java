package com.qa.Examples_cucumber_base.hooks;

import org.openqa.selenium.WebDriver;

import com.qa.Examples_cucumber_base.utils.WebDriverFactory;

import io.cucumber.java.After;
import io.cucumber.java.Before;


public class Hooks {
	private WebDriver webDriver;
	
	@Before
	public void setup() {
		if (webDriver == null) {
			webDriver = WebDriverFactory.createWebDriver();
		}
	}
	
	@After
	public void teardown() {
		if (webDriver != null) {
			webDriver.quit();
		}
	}
	
	public WebDriver getWebDriver() {
		return webDriver;
	}
}
