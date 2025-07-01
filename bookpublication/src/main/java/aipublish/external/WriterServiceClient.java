package aipublish.external;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "writerService", url = "https://8082-meritending-aipublish1-uhq7q346trw.ws-us120.gitpod.io")
public interface WriterServiceClient {

    @GetMapping("/writers/{userId}/isApproved")
    boolean isApprovedWriter(@PathVariable("userId") Long userId);
}
