package com.example.backend.exceptions;

// 400 — за невалидни барања во бизнис логика
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}