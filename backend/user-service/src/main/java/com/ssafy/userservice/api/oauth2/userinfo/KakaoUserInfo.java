package com.ssafy.userservice.api.oauth2.userinfo;

import java.util.Map;

public class KakaoUserInfo implements OAuth2UserInfo {
    private Map<String, Object> attributes;
    private Map<String, Object> kakaoAccountAttributes;
    private Map<String, Object> profileAttributes;

    public KakaoUserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
        this.kakaoAccountAttributes = (Map<String, Object>) attributes.get("kakao_account");
        this.profileAttributes = (Map<String, Object>) kakaoAccountAttributes.get("profile");
    }

    @Override
    public String getProviderId() {
        return attributes.get("id").toString();
    }

    @Override
    public String getProvider() {
        return "kakao";
    }

    @Override
    public String getName() {
        return profileAttributes.get("nickname").toString();
    }

    @Override
    public String getEmail() {
        return kakaoAccountAttributes.get("email").toString();
    }

    @Override
    public String getProfileUrl(){
        return profileAttributes.get("profile_image_url").toString();
    }
    @Override
    public String getGender() {
        return kakaoAccountAttributes.get("gender").toString();
    }
    @Override
    public int getAgeRange() {
        String attribute_age_range = kakaoAccountAttributes.get("age_range").toString().substring(0, 2);
        return Integer.parseInt(attribute_age_range);
    }
    @Override
    public String getNickName(){return profileAttributes.get("nickname").toString();}
}