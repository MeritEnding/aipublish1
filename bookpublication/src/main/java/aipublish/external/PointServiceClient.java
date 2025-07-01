package aipublish.external;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
    name = "pointServiceClient",
    url = "https://8083-meritending-aipublish1-uhq7q346trw.ws-us120.gitpod.io"
)
public interface PointServiceClient {

    @PostMapping("/points/deduct")
    void deductPoint(@RequestBody DeductPointCommand command);
}
