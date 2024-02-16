package com.ssafy.tripservice.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.bson.UuidRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

@Configuration
public class MongoDBConfig {

    @Value("${spring.data.mongodb.username}")
    private String username;
    @Value("${spring.data.mongodb.password}")
    private String password;

    @Bean
    MongoClientSettings mongoClientSettings() {
        /*
               For Local Test
         */
//         return MongoClientSettings.builder()
//                 .uuidRepresentation(UuidRepresentation.STANDARD)
//                 .applyConnectionString(new ConnectionString(
//                         "mongodb://root:ssafy@localhost:27017/mongo-narang?authSource=admin"))
//                 .build();
        /*
               For Developments
         */
       return MongoClientSettings.builder()
               .uuidRepresentation(UuidRepresentation.STANDARD)
               .applyConnectionString(new ConnectionString(
                       "mongodb://" + username + ":" + password
                       +"@mongo-container:27017/mongo-narang?authSource=admin"))
               .build();
    }

    @Bean
    public MongoClient mongoClient() {
        return MongoClients.create(mongoClientSettings());
    }

    @Bean
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoClient(), "mongo-narang");
    }
}
