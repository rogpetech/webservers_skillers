package dev.skill.score_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import dev.skill.score_service.entity.Score;

public interface ScoreRepository extends JpaRepository<Score, Long> {
}
