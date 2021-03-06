package com.enterpriseapp.main.web.rest;

import com.enterpriseapp.main.service.EnterpriseappKafkaProducer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/enterpriseapp-kafka")
public class EnterpriseappKafkaResource {

    private final Logger log = LoggerFactory.getLogger(EnterpriseappKafkaResource.class);

    private EnterpriseappKafkaProducer kafkaProducer;

    public EnterpriseappKafkaResource(EnterpriseappKafkaProducer kafkaProducer) {
        this.kafkaProducer = kafkaProducer;
    }

    @PostMapping("/publish")
    public void sendMessageToKafkaTopic(@RequestParam("message") String message) {
        log.debug("REST request to send to Kafka topic the message : {}", message);
        this.kafkaProducer.send(message);
    }
}
