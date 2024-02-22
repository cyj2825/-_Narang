package com.ssafy.userservice.config;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaConsumerConfig {

    @Bean
    public ConsumerFactory<String, Object> consumerFactory() {
        Map<String, Object> config = new HashMap<>();

        // Consumer의 Kafka 연결
        config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "kafka-container:9092");
        config.put(ConsumerConfig.GROUP_ID_CONFIG, "narang-trip-1");
        // 데이터 역직렬화
        config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        config.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        config.put(ConsumerConfig.ALLOW_AUTO_CREATE_TOPICS_CONFIG, false);

        return new DefaultKafkaConsumerFactory<>(config);
    }

    /*
    @KafkaListener 어노테이션이 붙은 메서드에 주입되어 사용.
    메시지를 동시에 처리할 수 있는 메시지 리스너 컨테이너를 생성.
    */
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, Object> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, Object> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());

        return factory;
    }
}
