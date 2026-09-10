package com.example.backend.service.nomenclature;

import java.util.UUID;

import com.example.backend.model.Isprakjac;
import com.example.backend.repository.IsprakjacRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.dto.IsprakjacRequest;


import java.util.List;

@Service
public class IsprakjacService {
    private final IsprakjacRepository isprakjacRepository;

    public IsprakjacService(IsprakjacRepository isprakjacRepository) {
        this.isprakjacRepository = isprakjacRepository;
    }

    @Cacheable("isprakjaci")
    public List<Isprakjac> getAllIsprakjaci() {
        return this.isprakjacRepository.findAllWithOrgEdinica();
    }

    public Isprakjac getIsprakjacById(UUID id) {
        return this.isprakjacRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Испраќач", id));
    }

    @CacheEvict(value = "isprakjaci", allEntries = true)
    public Isprakjac createIsprakjac(IsprakjacRequest request) {
        Isprakjac isprakjac = new Isprakjac();
        isprakjac.setNaziv(request.getNaziv());
        return this.isprakjacRepository.save(isprakjac);
    }

    @CacheEvict(value = "isprakjaci", allEntries = true)
    public Isprakjac updateIsprakjac(UUID id, IsprakjacRequest request) {
        Isprakjac existingIsprakjac = getIsprakjacById(id);
        existingIsprakjac.setNaziv(request.getNaziv());
        return this.isprakjacRepository.save(existingIsprakjac);
    }

    @CacheEvict(value = "isprakjaci", allEntries = true)
    public void deleteIsprakjacById(UUID id) {
        Isprakjac existingIsprakjac = getIsprakjacById(id);
        this.isprakjacRepository.delete(existingIsprakjac);
    }
}