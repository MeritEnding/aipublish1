package aipublish.external;

import aipublish.domain.UpdateBookMetadataCommand;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(
    name = "bookServiceClient",
    url = "https://8084-meritending-aipublish1-uhq7q346trw.ws-us120.gitpod.io" 
)
public interface BookServiceClient {

    @PostMapping("/books/updatemetadata")
    void updateBookMetadata(UpdateBookMetadataCommand command);
}
