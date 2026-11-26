package com.fuwuwaibao;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fuwuwaibao.entity.Shopping;
import com.fuwuwaibao.service.ProductCacheService;
import net.rubyeye.xmemcached.MemcachedClient;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.ObjectProvider;

import java.util.List;
import java.util.concurrent.TimeoutException;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class ProductCacheTest {
    @SuppressWarnings("unchecked")
    private ProductCacheService service(MemcachedClient client) {
        ObjectProvider<MemcachedClient> provider = mock(ObjectProvider.class);
        when(provider.getIfAvailable()).thenReturn(client);
        return new ProductCacheService(provider, new ObjectMapper());
    }

    @Test
    void restoresTypedProductsAndInvalidatesAfterChanges() throws Exception {
        MemcachedClient client = mock(MemcachedClient.class);
        ProductCacheService cache = service(client);
        Shopping product = new Shopping();
        product.setId(8);
        product.setName("影院手办");
        product.setPrice(99);
        ObjectMapper json = new ObjectMapper();
        when(client.get(anyString())).thenReturn(json.writeValueAsString(List.of(product)));
        assertThat(cache.get()).singleElement().satisfies(value -> {
            assertThat(value.getId()).isEqualTo(8);
            assertThat(value.getName()).isEqualTo("影院手办");
        });
        cache.set(List.of(product));
        verify(client).set(anyString(), eq(600), contains("影院手办"));
        cache.evict();
        verify(client).delete(anyString());
    }

    @Test
    void outageOrCorruptCacheFallsBackToDatabase() throws Exception {
        MemcachedClient client = mock(MemcachedClient.class);
        when(client.get(anyString())).thenThrow(new TimeoutException("offline")).thenReturn("invalid json");
        ProductCacheService cache = service(client);
        assertThat(cache.get()).isNull();
        assertThat(cache.get()).isNull();
        assertThat(service(null).get()).isNull();
    }
}
