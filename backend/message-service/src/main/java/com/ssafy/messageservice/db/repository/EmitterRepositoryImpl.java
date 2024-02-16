package com.ssafy.messageservice.db.repository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Slf4j
@Repository
public class EmitterRepositoryImpl implements EmitterRepository{
    // 모든 Emitters를 저장하는 ConcurrentHashMap
    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();
    private final Map<String, Object> eventCache = new ConcurrentHashMap<>();

    // emitter 저장
    // 새로운 사용자가 접속할 때마다 save 메소드를 호출하여 해당 사용자에 대한 SseEmitter를 저장
    @Override
    public SseEmitter save(String id, SseEmitter sseEmitter) {
        log.info("EmitterRepositoryImpl save 호출 id : {}, sseEmitter : {}", id, sseEmitter);
        emitters.put(id, sseEmitter);
        return sseEmitter;
    }

    // 이벤트를 저장
    // 서버에서 발생한 특정 이벤트의 데이터를 저장하고, 나중에 해당 이벤트 데이터를 사용하여 클라이언트에게 알림을 보낼 때 활용
    @Override
    public void saveEventCache(String eventCacheId, Object event) {
        eventCache.put(eventCacheId, event);
    }

    // 해당 회원과 관련된 모든 이벤트를 찾음
    @Override
    public Map<String, SseEmitter> findAllEmitterStartWithByUserId(String userId) {
        return emitters.entrySet().stream()
                .filter(entry -> entry.getKey().startsWith(userId))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    @Override
    public Map<String, Object> findAllEventCacheStartWithByUserId(String userId) {
        return eventCache.entrySet().stream()
                .filter(entry -> entry.getKey().startsWith(userId))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    // 주어진 아이디의 emitter를 지움
    @Override
    public void deleteById(String id) {
        emitters.remove(id);
    }

    // 해당 회원과 관련된 모든 emitter를 지움
    @Override
    public void deleteAllEmitterStartWithId(String userId) {
        emitters.forEach(
                (key, emitter) -> {
                    if (key.startsWith(userId)) {
                        emitters.remove(key);
                    }
                }
        );
    }

    // 해당 회원과 관련된 모든 이벤트를 지움
    @Override
    public void deleteAllEventCacheStartWithId(String userId) {
        eventCache.forEach(
                (key, emitter) -> {
                    if (key.startsWith(userId)) {
                        eventCache.remove(key);
                    }
                }
        );
    }
}
