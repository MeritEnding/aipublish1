package aipublish.external;

import aipublish.domain.UpdateBookMetadataCommand;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(
    name = "bookServiceClient",
    url = "${external.book-service.url}"
)
public interface BookServiceClient {

    @PostMapping("/books/updatemetadata")
    void updateBookMetadata(UpdateBookMetadataCommand command);
}
