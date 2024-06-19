package com.snccreations.springbootlibrary.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Base64;
import java.util.Map;

public class ExtractJWT {

    public static String payloadJWTExtraction(String token, String extraction) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            String[] chunks = token.split("\\.");
            Base64.Decoder decoder = Base64.getUrlDecoder();
            String payload = new String(decoder.decode(chunks[1]));

            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> map = objectMapper.readValue(payload, Map.class);

            return (String) map.get(extraction);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
