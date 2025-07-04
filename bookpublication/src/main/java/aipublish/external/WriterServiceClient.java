package aipublish.external;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "writerService", url = "${external.writer-service.url}")
public interface WriterServiceClient {

    @GetMapping("/writers/{userId}/isApproved")
    boolean isApprovedWriter(@PathVariable("userId") Long userId);
}
