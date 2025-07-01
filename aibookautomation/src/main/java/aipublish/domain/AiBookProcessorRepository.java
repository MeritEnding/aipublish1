package aipublish.domain;

import aipublish.domain.*;
// import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

//<<< PoEAA / Repository
@RepositoryRestResource(
    collectionResourceRel = "aiBookProcessors",
    path = "aiBookProcessors"
)
// public interface AiBookProcessorRepository extends PagingAndSortingRepository<AiBookProcessor, Long> {}
@Repository
public interface AiBookProcessorRepository extends JpaRepository<AiBookProcessor, Long> {}
