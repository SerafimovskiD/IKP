package com.example.backend.service.nomenclature;

import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.model.VidPredmet;
import com.example.backend.repository.VidPredmetRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VidPredmetService {
    private final VidPredmetRepository vidPredmetRepository;

    public VidPredmetService(VidPredmetRepository vidPredmetRepository) {
        this.vidPredmetRepository = vidPredmetRepository;
    }

    public List<VidPredmet> getAllVidPredmet() {
        return this.vidPredmetRepository.findAll();
    }

    public VidPredmet getVidPredmetById(Long id) {
        return this.vidPredmetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Вид на предмет", id));
    }
    public VidPredmet createVidPredmet(VidPredmet vidPredmet) {
        return this.vidPredmetRepository.save(vidPredmet);
    }
    public VidPredmet updateVidPredmet(Long id,VidPredmet vidPredmet) {
        VidPredmet existingVidPredmet = this.getVidPredmetById(id);
        existingVidPredmet.setNaziv(vidPredmet.getNaziv());
        return this.vidPredmetRepository.save(existingVidPredmet);
    }
    public void deleteVidPredmetById(Long id) {
        VidPredmet existingVidPredmet = this.getVidPredmetById(id);
        this.vidPredmetRepository.delete(existingVidPredmet);
    }
}
