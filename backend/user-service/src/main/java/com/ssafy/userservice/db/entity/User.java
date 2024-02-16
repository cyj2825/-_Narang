package com.ssafy.userservice.db.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class User extends BaseEntity {
    @Column(length = 20)
    private String nickname;
    @Column(length = 10)
    private String gender;
    @Column
    private int ageRange;
    @Column
    private String profile_url;
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "user_role",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private List<Role> userRoles;

    @Builder
    public User(String id, String nickname, String gender, int ageRange, String profile_url, List<Role> userRoles){
        super.setId(id);
        this.nickname = nickname;
        this.gender = gender;
        this.ageRange = ageRange;
        this.profile_url = profile_url;
        this.userRoles = userRoles;
    }
}
