package com.enterpriseapp.gateway.web.rest;

import com.enterpriseapp.gateway.service.GatewayKafkaProducer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/gateway-kafka")
public class GatewayKafkaResource {

    private final Logger log = LoggerFactory.getLogger(GatewayKafkaResource.class);

    private GatewayKafkaProducer kafkaProducer;

    public GatewayKafkaResource(GatewayKafkaProducer kafkaProducer) {
        this.kafkaProducer = kafkaProducer;
    }

    @PostMapping("/publish")
    public void sendMessageToKafkaTopic(@RequestParam("message") String message) {
        log.debug("REST request to send to Kafka topic the message : {}", message);
        this.kafkaProducer.send(message);
    }
}
