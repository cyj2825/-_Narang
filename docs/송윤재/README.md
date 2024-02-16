## Spring Security

### 1. Spring Security란?

- 스프링 기반 애플리케이션의 보안(인증, 인가)을 담당하는 프레임워크
- Filter를 기반으로 처리
    - Filter는 Servlet보다 앞에서 동작한다. ⇒ Spring Security는 요청이 Spring Context에 도착하기 전에 동작을 처리한다.
    - Interceptor와의 차이점은 Interceptor는 DispatcherServlet과 Controller의 사이에서 동작한다.
    
    `![security](Security.png)`
    

### 2. 인증(Authentication)과 인가(Authorization)

- **인증** : 사용자가 누구인지 확인하는 것
- **인가** : 사용자가 요청한 **자원에 접근이 가능한지**를 확인하는 것

### 3. FilterChain과 Spring Security

`![security2](Security2.png)`

- Filter가 여러 개일 때, 체인 형태로 구성된다.
    - 각 Filter마다, ‘로직 실행 → 다음 필터 호출’ 이 반복되는 방식
- 이 중, **DelegatingFilterProxy**라는 필터가 있다.
- 이 필터는 사용자 요청을 받았을 때, 내부의 FilterChainProxy라는 것으로 요청을 위임한다.
- 이 FilterChainProxy를 통해서 스프링 시큐리티 로직이 호출되어 동작한다.
    - FilterChain과 SecurityFilterChain은 다르다. FilterChain은 서블릿 필터들의 묶음을, SecurityFilterChain은 그 중 하나에서 동작하는 Spring Security 내부에서 사용되는 것이다.

### 4. 내부 동작

`![security3](Security3.png)`

- **Spring Security Filters**
    
    해당 요청이 인증이 필요한 요청인지 검사하고, 필요하다면 로그인 페이지로 안내하거나, 기존 로그인 정보가 남아있다면 그것으로 인증을 시도한다.
    
    `![security4](Security4.png)`
    
    - AuthorizationFilter - doFilter() 내부
    - 요청을 검사하고, 승인되지 않았다면, 예외를 throw한다.
    
    `![security5](Security5.png)`
    
    UsernamePassswordAuthenticationFilter.attemptAuthentication()
    
    AuthenticationManager를 호출한다.
    
    - **Authentication**
        
        UsernamepasswordAuthenticationFilter와 같은 필터는 
        
        요청에서 username, pw 정보를 추출해서 authentication 타입 인스턴스를 생성하고, 
        
        그것을 인자로 담아 AuthenticationManager를 호출한다.
        
        Authentication 타입은 스프링 시큐리티에서 표준이 되는, 유저 정보를 저장한 객체이다.
        
        `![security6](Security6.png)`
        
        - UsernamePasswordAuthenticationFilter - attemptAuthentication() 내부
        - authentication 객체 생성 후, authenticationManager의 authenticate()를 호출
        
- **Authentication Manager**
    
    Filter로부터 요청이 넘어오면, 전달받은 Authentication 객체와 맞는 Authentication Provider를 호출한다. 스프링 구조 강의에서의 HandlerAdapter?와 비슷하다.
    
    `![security7](Security7.png)`
    
    - ProviderManager(구현 클래스 중 하나) - authenticate()
    - 처리할 수 있는 provider를 찾아, authenticate()를 호출한다.
- **Authentication Provider**
    
    유저를 인증하는 실제 로직을 수행한다.
    
    UserDetails (Manager/Service)를 통해 username을, passwordEncoder로 pw를 검증한다.
    
    `![security8](Security8.png)`
    
    - AbstractUserDetailsAuthenticationProvider - authenticate()
    - authenticatioon 객체에서 username을 꺼내와서, 유저 정보를 조회한다.
    - retrieveUser()는 유저정보를 찾지 못했다면, UsernameNotFoundException을 던진다.
    - 해당 클래스는 추상 클래스이며, retrieveUser는 DaoAuthenticationProvider 에 구현되어 있다.
    - DaoAuthenticationProvider - retrieveUser()
    - UserDetailService를 호출한다.
    
    - **Password 검증은,** username 검증이 끝난 후 호출되는 additionalAuthenticationChecks() 에서 수행된다.
    
    `![security9](Security9.png)`
    
    - DaoAuthenticationProvider - additionalAuthenticationChecks()
    - passwordEncoder.matches()를 통해 검증한다.
- **UserDetails (Manager/Service)**
    
    DB나 인메모리 저장소를 사용하며, 유저 CRUD 기능을 지원한다.
    
- **PasswordEncoder**
    
    password를 인코딩 or 해싱하는 기능을 지원한다.
    
- **Security Context**
    
    처리가 끝나고 나면 인증 정보를 저장하여, 다음에 같은 유저에게 요청이 왔을 때 빠르게 처리한다. SecurityContextHolder에 의해 관리된다.