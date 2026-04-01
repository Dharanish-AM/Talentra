package com.talentra.repository;

import com.talentra.entity.InterviewRound;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InterviewRoundRepository extends JpaRepository<InterviewRound, Long> {
    List<InterviewRound> findByApplicationId(Long applicationId);
    List<InterviewRound> findByApplicationStudentProfileId(Long studentProfileId);
}
