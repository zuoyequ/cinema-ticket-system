package com.fuwuwaibao.entity;

public record OrderCreatedEvent(String eventId, int orderId, int userId, int productId) {}
