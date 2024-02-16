package com.ssafy.userservice.security.filter;

import com.ssafy.userservice.db.entity.Auth;
import com.ssafy.userservice.db.repository.AuthRepository;
import com.ssafy.userservice.security.jwt.JwtService;
import com.ssafy.userservice.security.util.PasswordUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.core.authority.mapping.NullAuthoritiesMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationProcessingFilter extends OncePerRequestFilter {

    private static final String NO_CHECK_URL = "/api/user/login"; // "/login"으로 들어오는 요청은 Filter 작동 X

    private final JwtService jwtService;
    private final AuthRepository authRepository;

    private GrantedAuthoritiesMapper authoritiesMapper = new NullAuthoritiesMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        log.info("doFilterInternal() 호출");
        log.info("request.getRequestURI() : {}", request.getRequestURI());
        if (request.getRequestURI().startsWith(NO_CHECK_URL)) {
            filterChain.doFilter(request, response);
            return;
        }
        String refreshToken = jwtService.extractRefreshToken(request)
                .filter(jwtService::isTokenValid)
                .orElse(null);
        log.info("방금 받아온 refreshToken : {}", refreshToken);
        checkAccessTokenAndAuthentication(request, response, filterChain);
    }

    public void checkRefreshTokenAndReIssueAccessToken(HttpServletResponse response, String refreshToken) {
        log.info("checkRefreshTokenAndReIssueAccessToken() 호출");
        authRepository.findByRefreshToken(refreshToken)
                .ifPresent(auth -> {
                    String reIssuedRefreshToken = reIssueRefreshToken(auth);
                    addCorsHeaders(response); // CORS 헤더 추가
                    jwtService.sendAccessAndRefreshToken(response, jwtService.createAccessToken(auth.getId()),
                            reIssuedRefreshToken);
                });
    }

    private void addCorsHeaders(HttpServletResponse response) {
        log.info("addCorsHeaders() 호출");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Expose-Headers", "Authorization, Authorization-refresh");
    }

    private String reIssueRefreshToken(Auth auth) {
        log.info("reIssueRefreshToken() 호출");
        String reIssuedRefreshToken = jwtService.createRefreshToken();
        auth.updateRefreshToken(reIssuedRefreshToken);
        authRepository.saveAndFlush(auth);
        return reIssuedRefreshToken;
    }

    public void checkAccessTokenAndAuthentication(HttpServletRequest request, HttpServletResponse response,
                                                  FilterChain filterChain) throws ServletException, IOException {
        log.info("checkAccessTokenAndAuthentication() 호출");
        log.info("리퀘스트 리스폰스 찍어보자");
        log.error(request.toString());
        log.error(response.toString());
        // 1. AccessToken 추출
        Optional<String> accessToken = jwtService.extractAccessToken(request);
        if (!accessToken.isPresent()) {
            log.error("AccessToken이 없거나 비정상적인 형식입니다.");
            filterChain.doFilter(request, response);
            return;
        }

        // 2. AccessToken 유효성 검사
        if (!jwtService.isTokenValid(accessToken.get())) {
            log.error("유효하지 않은 AccessToken입니다.");
            filterChain.doFilter(request, response);
            return;
        }

        // 3. AccessToken에서 아이디 추출
        Optional<String> userId = jwtService.extractId(accessToken.get());
        if (!userId.isPresent()) {
            log.error("AccessToken에서 ID를 추출할 수 없습니다.");
            filterChain.doFilter(request, response);
            return;
        }

        // 4. 추출한 아이디를 사용하여 사용자 정보 조회
        authRepository.findById(userId.get())
                .ifPresent(this::saveAuthentication);

        filterChain.doFilter(request, response);
    }

    public void saveAuthentication(Auth myUser) {
        log.info("saveAuthentication() 호출");
        String password = myUser.getPassword();
        if (password == null) {
            password = PasswordUtil.generateRandomPassword();
        }


        UserDetails userDetailsUser = org.springframework.security.core.userdetails.User.builder()
                .username(myUser.getId())
                .password(password)
                .roles(String.valueOf(myUser.getAuthority()))
                .build();

        Authentication authentication =
                new UsernamePasswordAuthenticationToken(userDetailsUser, null,
                        authoritiesMapper.mapAuthorities(userDetailsUser.getAuthorities()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
