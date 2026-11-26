package com.fuwuwaibao.webcontroller;

import com.fuwuwaibao.service.TicketOrderService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
public class TicketOrderController {
    private final TicketOrderService tickets;
    public TicketOrderController(TicketOrderService tickets) { this.tickets = tickets; }

    public record BookingRequest(int userId, int userType, int showId, List<Integer> seatIds, String requestId) {}

    @GetMapping("/ticket_show")
    public Map<String, Object> show(@RequestParam int id) { return tickets.show(id); }

    @GetMapping("/ticket_seats")
    public List<Map<String, Object>> seats(@RequestParam int showId) { return tickets.seats(showId); }

    @PostMapping("/ticket_orders")
    public Map<String, Object> book(@RequestBody BookingRequest request) {
        return tickets.book(request.userId(), request.userType(), request.showId(), request.seatIds(), request.requestId());
    }

    @GetMapping("/ticket_orders")
    public List<Map<String, Object>> orders(@RequestParam int id, @RequestParam(defaultValue = "1") int type) {
        return tickets.orders(id, type);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> error(ResponseStatusException error) {
        return ResponseEntity.status(error.getStatusCode()).body(Map.of("message", error.getReason() == null ? "购票失败" : error.getReason()));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> conflict(DataIntegrityViolationException error) {
        return ResponseEntity.status(409).body(Map.of("message", "座位或订单已被提交，请刷新订单或重新选座"));
    }
}
