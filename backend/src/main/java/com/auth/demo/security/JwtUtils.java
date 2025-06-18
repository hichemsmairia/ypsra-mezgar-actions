package com.auth.demo.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtUtils {
    private static final String SECRET_KEY = "mysecraskjfhasdfdfsdfdsfdfdsfsdfsdskjfhsdjkfsdfsetkey";
    private static final long EXPIRATION_TIME = 86400000; // 1 day

    public String generateToken(UserDetails userDetails) {
        return JWT.create()
                .withSubject(userDetails.getUsername())
                .withClaim("roles", userDetails.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList()))
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(Algorithm.HMAC256(SECRET_KEY));
    }

    public String validateToken(String token) {
        try {
            DecodedJWT jwt = JWT.require(Algorithm.HMAC256(SECRET_KEY))
                    .build()
                    .verify(token);
            return jwt.getSubject();
        } catch (JWTVerificationException e) {
            return null;
        }
    }
}



// package com.auth.demo.security;

// import com.auth0.jwt.JWT;
// import com.auth0.jwt.algorithms.Algorithm;
// import com.auth0.jwt.exceptions.JWTVerificationException;
// import org.springframework.stereotype.Component;

// import java.util.Date;

// @Component
// public class JwtUtils {
//     private static final String SECRET_KEY = "mysecraskjfhasdfdfsdfdsfdfdsfsdfsdskjfhsdjkfsdfsetkey";
//     private static final long EXPIRATION_TIME = 86400000; // 1 day
//         // sign 
//     public String generateToken(String email) {
//         return JWT.create()
//                 .withSubject(email)
//                 .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
//                 .sign(Algorithm.HMAC256(SECRET_KEY));
//     }
// // verify 
//     public String validateToken(String token) {
//         try {
//             return JWT.require(Algorithm.HMAC256(SECRET_KEY))
//                     .build()
//                     .verify(token)
//                     .getSubject();
//         } catch (JWTVerificationException e) {
//             return null;
//         }
//     }
// }
