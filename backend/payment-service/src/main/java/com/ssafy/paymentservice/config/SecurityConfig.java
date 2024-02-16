package com.ssafy.paymentservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.encrypt.Encryptors;
import org.springframework.security.crypto.encrypt.TextEncryptor;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    // 암호화 키로 ENCRYPTION_KEY 사용
    // 솔트는 필요에 따라 변경 가능
    @Value("${spring.encrypt.key}")
    private String encryptionKey;
    private String salt = "your-salt";

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/", "/api/payment/**").permitAll()
                        .anyRequest().authenticated());

        return http.build();
    }

    @Bean
    public TextEncryptor textEncryptor() {

        // 헥스로 인코딩된 문자열 생성
        String hexEncodedKey = toHex(encryptionKey);
        String hexEncodedSalt = toHex(salt);

        return Encryptors.text(hexEncodedKey, hexEncodedSalt);
    }

    private String toHex(String input) {
        byte[] bytes = input.getBytes();
        StringBuilder hex = new StringBuilder();
        for (byte b : bytes) {
            hex.append(String.format("%02x", b));
        }
        return hex.toString();
    }
}