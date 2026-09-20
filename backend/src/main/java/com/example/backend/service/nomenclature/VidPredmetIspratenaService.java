package com.example.backend.service.nomenclature;

import java.util.UUID;

import com.example.backend.dto.VidPredmetRequest;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.model.VidPredmetIspratena;
import com.example.backend.repository.VidPredmetIspratenaRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VidPredmetIspratenaService {
    private final VidPredmetIspratenaRepository vidPredmetRepository;

    public VidPredmetIspratenaService(VidPredmetIspratenaRepository vidPredmetRepository) {
        this.vidPredmetRepository = vidPredmetRepository;
    }

    @Cacheable("vidPredmetIspratena")
    public List<VidPredmetIspratena> getAllVidPredmet() {
        return this.vidPredmetRepository.findAll();
    }

    public VidPredmetIspratena getVidPredmetById(UUID id) {
        return this.vidPredmetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Вид на предмет", id));
    }

    @CacheEvict(value = "vidPredmetIspratena", allEntries = true)
    public VidPredmetIspratena createVidPredmet(VidPredmetRequest request) {
        VidPredmetIspratena vidPredmet = new VidPredmetIspratena();
        vidPredmet.setNaziv(request.getNaziv());
        return this.vidPredmetRepository.save(vidPredmet);
    }

    @CacheEvict(value = "vidPredmetIspratena", allEntries = true)
    public VidPredmetIspratena updateVidPredmet(UUID id, VidPredmetRequest request) {
        VidPredmetIspratena existingVidPredmet = this.getVidPredmetById(id);
        existingVidPredmet.setNaziv(request.getNaziv());
        return this.vidPredmetRepository.save(existingVidPredmet);
    }

    @CacheEvict(value = "vidPredmetIspratena", allEntries = true)
    public void deleteVidPredmetById(UUID id) {
        VidPredmetIspratena existingVidPredmet = this.getVidPredmetById(id);
        this.vidPredmetRepository.delete(existingVidPredmet);
    }
}
