package com.talentra.repository;

import com.talentra.entity.Application;
import com.talentra.entity.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentProfileId(Long studentProfileId);
    List<Application> findByJobProfileId(Long jobProfileId);
    List<Application> findByStatus(ApplicationStatus status);
    List<Application> findByStatusIn(java.util.List<ApplicationStatus> statuses);
    java.util.Optional<Application> findByStudentProfileIdAndJobProfileId(Long studentProfileId, Long jobProfileId);
}
