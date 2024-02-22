package com.ssafy.userservice.api.messanger;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.userservice.api.request.UserDeleteRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

@Component @Slf4j
public class EventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public EventProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    /**
     *
     * @param topic
     * @param message
     */
    @Async
    public CompletableFuture<?> request(String topic, String message) {
        // Topic + Message
        CompletableFuture<SendResult<String, Object>> future = kafkaTemplate.send(topic, message);

        return CompletableFuture.completedFuture(future);
    }

    @Async
    public CompletableFuture<?> request(String topic, UserDeleteRequest request) {
        // Topic + Message
        CompletableFuture<SendResult<String, Object>> future = kafkaTemplate.send(topic, request);

        ObjectMapper mapper = new ObjectMapper();

        String jsonString = "";
        try{
            jsonString = mapper.writeValueAsString(request);
            kafkaTemplate.send(topic,jsonString);
            log.info("Kafka Producer sent data form the User microservice: " + request);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            log.error("Kafka Producer failed to send data form the User microservice");
        }

        return CompletableFuture.completedFuture(future);
    }

    /**
     *
     * @param topic
     * @param message
     */
    public void confirm(String topic, String message) {
        // Topic + Message
        kafkaTemplate.send(topic, "Message : " + message);
    }
}

