package org.example.aiarycproject.domain.diaries.repository;

import org.example.aiarycproject.domain.diaries.entity.Diary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DiaryRepository extends JpaRepository<Diary, UUID> {

    List<Diary> findByThreadIdAndIdGreaterThanOrderByIdAsc(UUID threadId, UUID cursor);

    List<Diary> findByThreadIdOrderByIdAsc(UUID threadId);
}