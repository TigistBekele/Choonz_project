package com.qa.Examples_cucumber_base;


import org.junit.runner.RunWith;

import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;
import io.cucumber.junit.CucumberOptions.SnippetType;

@RunWith(Cucumber.class)
@CucumberOptions(
		features = "classpath:features", // sets location of feature files
		glue = {
				"com.qa.Examples_cucumber_base.step_definations",
				"com.qa.Examples_cucumber_base.hooks"
		},
		snippets = SnippetType.CAMELCASE, // changes snippet output to camelcase rather than underscore
		plugin = {
				"pretty", // prettify output
				"html:target/cucumber-reports/cucumber-html-report.html",
				"junit:target/cucumber-reports/cucumber-junit-report.xml",
				"json:target/cucumber-reports/cucumber-json-report.json"
		},
		monochrome = false // true = black & white output
)


public class RunnerChoonzProjectTest {

}
