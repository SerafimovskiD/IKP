package com.example.backend.service.nomenclature;

import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.model.IspratenDo;
import com.example.backend.repository.IspratenDoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IspratenDoService {
    private final IspratenDoRepository ispratenDoRepository;

    public IspratenDoService(IspratenDoRepository ispratenDoRepository) {
        this.ispratenDoRepository = ispratenDoRepository;
    }

    public List<IspratenDo> getAllIspratenDo() {
        return this.ispratenDoRepository.findAll();
    }
    public IspratenDo getIspratenDoById(Long id) {
        return this.ispratenDoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Испратен до", id));
    }
    public IspratenDo createIspratenDo(IspratenDo ispratenDo) {
        return this.ispratenDoRepository.save(ispratenDo);
    }
    public IspratenDo updateIspratenDo(Long id,IspratenDo ispratenDo) {
        IspratenDo existingIspratenDo = getIspratenDoById(id);
        existingIspratenDo.setNaziv(ispratenDo.getNaziv());
        return this.ispratenDoRepository.save(existingIspratenDo);
    }
    public void deleteIspratenDoById(Long id) {
        IspratenDo ispratenDo = getIspratenDoById(id);
        this.ispratenDoRepository.delete(ispratenDo);
    }
}
