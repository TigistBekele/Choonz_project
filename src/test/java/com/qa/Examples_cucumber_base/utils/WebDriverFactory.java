package com.qa.Examples_cucumber_base.utils;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.openqa.selenium.PageLoadStrategy;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriver.Options;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.firefox.FirefoxProfile;
import org.openqa.selenium.remote.BrowserType;
import org.openqa.selenium.remote.CapabilityType;

public class WebDriverFactory {

	public static WebDriver createWebDriver() {
		// gets browser property, if no property present defaults to "chrome"
		String webdriver = System.getProperty("browser", "chrome");
		Map<String, Object> prefs = new HashMap<String, Object>();

		switch (webdriver) {
		case "firefox":
			System.setProperty("webdriver.gecko.driver", "src/test/resources/Drivers/firefoxdriver.exe");
			prefs.clear();
			
			FirefoxOptions fOptions = new FirefoxOptions();
			fOptions.setAcceptInsecureCerts(true);
			fOptions.setPageLoadStrategy(PageLoadStrategy.NORMAL);
			fOptions.setHeadless(true);
			fOptions.setProfile(new FirefoxProfile());
			FirefoxProfile p = new FirefoxProfile();
			fOptions.addPreference("profile.default_content_setting_values.cookies", 2);
			fOptions.addPreference("network.cookie.cookieBehavior", 2);
			fOptions.addPreference("profile.block_third_party_cookies", true);

			return new FirefoxDriver(fOptions);
		case "chrome":
			prefs.clear();

			System.setProperty("webdriver.chrome.driver", "src/test/resources/Drivers/chromedriver.exe");
			ChromeOptions chromeOptions = new ChromeOptions();
			chromeOptions.setHeadless(false);
			chromeOptions.setAcceptInsecureCerts(true);
			chromeOptions.setPageLoadStrategy(PageLoadStrategy.NORMAL);
			
			// Settings - disabled as cookies are needed for SecretSauce login
//			prefs.put("profile.default_content_setting_values.cookies", 2);
//			prefs.put("network.cookie.cookieBehavior", 2);
//			prefs.put("profile.block_third_party_cookies", true);
//			prefs.put("profile.default_content_settings.popups", 0);
//			prefs.put("profile.default_content_settings.notifications", 2);
			// Create ChromeOptions to disable Cookies pop-up
			chromeOptions.setExperimentalOption("prefs", prefs);
			
			return new ChromeDriver(chromeOptions);
		case "edge":
			prefs.clear();
			System.setProperty("webdriver.edge.driver", "src/test/resources/Drivers/msedgedriver.exe");
			ChromeOptions cOptions = new ChromeOptions();	
			
//			prefs.put("profile.default_content_setting_values.cookies", 2);
//			prefs.put("network.cookie.cookieBehavior", 2);
//			prefs.put("profile.block_third_party_cookies", true);
//			prefs.put("profile.default_content_settings.popups", 0);
//			prefs.put("profile.default_content_settings.notifications", 2);
			
//			cOptions.setExperimentalOption("prefs", prefs);
			EdgeOptions eOptions = new EdgeOptions();
			
			Set<String> ops = eOptions.getCapabilityNames();
			
			System.out.println("Creating driver");
			ops.forEach(System.out::println);
			
			eOptions.setCapability("profile.default_content_setting_values.cookies", 2);
			eOptions.setCapability("network.cookie.cookieBehavior", 2);
			eOptions.setCapability("profile.block_third_party_cookies", true);
			eOptions.setCapability("profile.default_content_settings.popups", 0);
			eOptions.setCapability("profile.default_content_settings.notifications", 2);
			eOptions.setCapability(CapabilityType.BROWSER_NAME, BrowserType.EDGE);
			eOptions.setCapability("ms:edgeChromium", true);

			return new EdgeDriver(eOptions);
		default:
			throw new RuntimeException("Unsupported webdriver: " + webdriver);
		}
	}
}
