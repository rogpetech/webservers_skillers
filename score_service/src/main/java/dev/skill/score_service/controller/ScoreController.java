package dev.skill.score_service.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.skill.score_service.client.UserServiceClient;
import dev.skill.score_service.repository.ScoreRepository;
import dev.skill.score_service.entity.Score;
import dev.skill.score_service.entity.User;
import dev.skill.score_service.exception.ResourceNotFoundException;

@RestController
@RequestMapping("/scores")
public class ScoreController {
  @Autowired
  private ScoreRepository scoreRepository;
  
  @Autowired
  UserServiceClient userServiceClient;

  @GetMapping
  public List<Score> getScores() {
    return scoreRepository.findAll();
  }

  @GetMapping("/{id}")
  public Score getScore(@PathVariable Long id) {
    return scoreRepository.findById(id).orElseThrow( () -> new ResourceNotFoundException("Score not found with id " + id));
  }

  @PostMapping
  public Score createScore(@RequestBody Score score) {
    User user = userServiceClient.getUserById(score.getUserId());

    if(user == null) {
      throw new ResourceNotFoundException("User not found with id " + score.getUserId());
    }

    return scoreRepository.save(score);
  }

  @PutMapping("/{id}")
  public Score updateScore(@PathVariable Long id, @RequestBody Score updateScore) {
    Score score = scoreRepository.findById(id).orElseThrow( () -> new ResourceNotFoundException("Score not found with id" + id));
    score.setUserId(updateScore.getUserId());
    score.setVideo(updateScore.getVieo());
    score.setPoints(updateScore.getPoints());

    return scoreRepository.save(score);
  }

  @DeleteMapping("/{id}")
  public void deleteScore(@PathVariable Long id) {
    Score score = scoreRepository.findById(id).orElseThrow( () -> new ResourceNotFoundException("Score not found with id" + id));
    scoreRepository.delete(score);
  }
}
