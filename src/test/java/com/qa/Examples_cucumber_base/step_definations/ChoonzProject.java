package com.qa.Examples_cucumber_base.step_definations;

import static org.junit.Assert.assertEquals;



import org.openqa.selenium.WebDriver;

import com.qa.Examples_cucumber_base.hooks.Hooks;
import com.qa.Examples_cucumber_base.pages.SecretSaucePOMRepository;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;


public class ChoonzProject {
	
	private SecretSaucePOMRepository pom;
	private WebDriver webDriver;
	
	private boolean didOrderCompleteExpected;
	private boolean didOrderCompleteActual;
	
	public ChoonzProject(Hooks hooks) {
		this.webDriver = hooks.getWebDriver();
		this.pom = new SecretSaucePOMRepository(webDriver);
		this.didOrderCompleteExpected = true;
	}
//	

	@Given("the user is on the Landing page")
	public void the_user_is_on_the_landing_page() throws InterruptedException {
	    Thread.sleep(10000);
		webDriver.get(pom.landingPage.URL);
//		Thread.sleep(10000);
//	    pom.landingPage.logoutButton();
//	    Thread.sleep(10000);
//	    throw new io.cucumber.java.PendingException();
	}

	@When("the user clicked logout button")
	public void the_user_clicked_logout_button() throws InterruptedException{
		Thread.sleep(10000);
		pom.landingPage.signupButton();
	
	}

	@When("the user try to sing in with username {word},pasword {word} and confpw {word}")
	public void the_user_try_to_sing_in_with_username_tig_pasword_root_and_confpw_root(String username, String password, String confpw) throws InterruptedException {

		pom.signupPage.fillInLoginDetails(username, password,confpw);
		Thread.sleep(15000);
	}


	
	@Then("the user is singed up")
	public void the_user_is_singed_up() throws InterruptedException {
		pom.signupPage.getwelcomenote();
//		 Thread.sleep(10000);
//		pom.signupPage.singupcompleted();
        
//		 assertEquals(didOrderCompleteExpected, didOrderCompleteActual);
		
	}
}
