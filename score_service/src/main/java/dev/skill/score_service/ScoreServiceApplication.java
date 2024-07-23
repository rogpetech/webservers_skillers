package dev.skill.score_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class ScoreServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ScoreServiceApplication.class, args);
	}

}
