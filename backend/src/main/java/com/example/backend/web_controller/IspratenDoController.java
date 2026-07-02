package com.example.backend.web_controller;

import com.example.backend.dto.IsprakjacRequest;
import com.example.backend.dto.IspratenDoRequest;
import com.example.backend.model.IspratenDo;
import com.example.backend.service.nomenclature.IspratenDoService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/isprateni-do")
public class IspratenDoController {
    private final IspratenDoService ispratenDoService;

    public IspratenDoController(IspratenDoService ispratenDoService) {
        this.ispratenDoService = ispratenDoService;
    }

    @PreAuthorize("hasAnyRole('OSL','POMOSNIK','NACALNIK','ADMIN')")
    @GetMapping
    public List<IspratenDo> getAllIspratenDo(){
        return this.ispratenDoService.getAllIspratenDo();
    }

    @PreAuthorize("hasAnyRole('OSL','POMOSNIK','NACALNIK','ADMIN')")
    @GetMapping("/{id}")
    public IspratenDo getIspratenDoById(@PathVariable Long id) {
        return this.ispratenDoService.getIspratenDoById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public IspratenDo createIspratenDo(@RequestBody IspratenDoRequest request){
        return this.ispratenDoService.createIspratenDo(request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public IspratenDo updateIspratenDo(@PathVariable Long id, @RequestBody IspratenDoRequest request){
        return this.ispratenDoService.updateIspratenDo(id, request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteIspratenDoById(@PathVariable Long id) {
        this.ispratenDoService.deleteIspratenDoById(id);
    }
}
