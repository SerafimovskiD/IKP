package com.example.backend.exceptions;

// 409 — за конфликти (дупликати, невалидни состојби)
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}