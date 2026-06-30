package com.example.backend.service.nomenclature;

import com.example.backend.model.Isprakjac;
import com.example.backend.repository.IsprakjacRepository;
import org.springframework.stereotype.Service;
import com.example.backend.exceptions.ResourceNotFoundException;


import java.util.List;

@Service
public class IsprakjacService {
    private final IsprakjacRepository isprakjacRepository;


    public IsprakjacService(IsprakjacRepository isprakjacRepository) {
        this.isprakjacRepository = isprakjacRepository;
    }

    public List<Isprakjac> getAllIsprakjaci() {
        return this.isprakjacRepository.findAll();
    }

    public Isprakjac getIsprakjacById(Long id) {
        return this.isprakjacRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Испраќач", id));
    }

    public Isprakjac createIsprakjac(Isprakjac isprakjac) {
        return this.isprakjacRepository.save(isprakjac);
    }

    public Isprakjac updateIsprakjac(Long id, Isprakjac updatedIsprakjac) {
        Isprakjac existingIsprakjac = getIsprakjacById(id);
        existingIsprakjac.setNaziv(updatedIsprakjac.getNaziv());
        return this.isprakjacRepository.save(existingIsprakjac);
    }
    public void deleteIsprakjacById(Long id) {
        Isprakjac existingIsprakjac = getIsprakjacById(id);
        this.isprakjacRepository.delete(existingIsprakjac);
    }
}
