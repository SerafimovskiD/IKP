package com.example.backend.web_controller;

import com.example.backend.model.IspratenDo;
import com.example.backend.service.nomenclature.IspratenDoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/isprateni-do")
public class IspratenDoController {
    private final IspratenDoService ispratenDoService;

    public IspratenDoController(IspratenDoService ispratenDoService) {
        this.ispratenDoService = ispratenDoService;
    }
    @GetMapping
    public List<IspratenDo> getAllIspratenDo(){
        return this.ispratenDoService.getAllIspratenDo();
    }

    @GetMapping("/{id}")
    public IspratenDo getIspratenDoById(@PathVariable Long id) {
        return this.ispratenDoService.getIspratenDoById(id);
    }
    @PostMapping
    public IspratenDo createIspratenDo(@RequestBody IspratenDo ispratenDo){
        return this.ispratenDoService.createIspratenDo(ispratenDo);
    }
    @PutMapping("/{id}")
    public IspratenDo updateIspratenDo(@PathVariable Long id, @RequestBody IspratenDo ispratenDo){
        return this.ispratenDoService.updateIspratenDo(id, ispratenDo);
    }
    @DeleteMapping("/{id}")
    public void deleteIspratenDoById(@PathVariable Long id) {
        this.ispratenDoService.deleteIspratenDoById(id);
    }
}
