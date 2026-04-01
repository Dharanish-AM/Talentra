package com.talentra.repository;

import com.talentra.entity.JobProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobProfileRepository extends JpaRepository<JobProfile, Long> {
    List<JobProfile> findByCompanyId(Long companyId);
}
