package com.ssafy.tripservice.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class S3Config {
    @Value("${cloud.aws.credentials.access-key}")
    String accessKey;
    @Value("${cloud.aws.credentials.secret-key}")
    String secretKey;

    @Bean
    AmazonS3Client amazonS3Client() {

        return (AmazonS3Client)AmazonS3ClientBuilder.standard()
                .withRegion(Regions.AP_NORTHEAST_2)
                .withCredentials(
                        new AWSStaticCredentialsProvider(
                                new BasicAWSCredentials(accessKey, secretKey)))
                .build();
    }
}