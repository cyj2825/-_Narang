package com.ssafy.tripservice;

import com.ssafy.tripservice.db.repository.PlanRepository;
import com.ssafy.tripservice.db.repository.TripRepository;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

//@EnableDiscoveryClient
// For Deployment
//@EnableMongoRepositories(basePackageClasses = {TripRepository.class, PlanRepository.class})
@OpenAPIDefinition(servers = {@Server(url = "https://i10a701.p.ssafy.io", description = "default url")})
@SpringBootApplication
public class TripServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(TripServiceApplication.class, args);
	}
}
