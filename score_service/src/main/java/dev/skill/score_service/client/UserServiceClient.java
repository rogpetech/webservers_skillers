package dev.skill.score_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import dev.skill.score_service.entity.User;

@FeignClient(name="user-service", url="http://localhost:8000")
public interface UserServiceClient {
  @GetMapping("/users/{id}")
  User getUserById(@PathVariable("id") Long id);
}
