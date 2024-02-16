package com.ssafy.userservice.api.oauth2.userinfo;

import java.util.Map;

public class NaverUserInfo implements OAuth2UserInfo {
    public NaverUserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    private Map<String, Object> attributes;
    @Override
    public String getProviderId() {
        return (String) attributes.get("id");
    }

    @Override
    public String getProvider() {
        return "naver";
    }

    @Override
    public String getName() {
        return (String) attributes.get("name");
    }

    @Override
    public String getEmail() {
        return (String) attributes.get("email");
    }

    @Override
    public String getProfileUrl(){return (String) attributes.get("profile_image");}

    @Override
    public String getGender() {
        String gender = (String)attributes.get("gender");
        return gender.equals("M") ? "male" : "female";
    }

    @Override
    public int getAgeRange() {
        String attribute_age_range = attributes.get("age").toString().substring(0, 2);
        return Integer.parseInt(attribute_age_range);
    }

    @Override
    public String getNickName(){return (String) attributes.get("nickname");}
}