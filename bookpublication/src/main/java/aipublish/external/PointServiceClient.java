package aipublish.external;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
    name = "pointServiceClient",
    url = "${external.user-service.url}"
)
public interface PointServiceClient {

    @PostMapping("/points/deduct")
    void deductPoint(@RequestBody DeductPointCommand command);
}
