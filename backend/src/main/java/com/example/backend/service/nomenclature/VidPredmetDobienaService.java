package com.example.backend.service.nomenclature;

import com.example.backend.dto.VidPredmetRequest;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.model.VidPredmetDobiena;
import com.example.backend.repository.VidPredmetDobienaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VidPredmetDobienaService {
    private final VidPredmetDobienaRepository vidPredmetRepository;

    public VidPredmetDobienaService(VidPredmetDobienaRepository vidPredmetRepository) {
        this.vidPredmetRepository = vidPredmetRepository;
    }

    public List<VidPredmetDobiena> getAllVidPredmet() {
        return this.vidPredmetRepository.findAll();
    }

    public VidPredmetDobiena getVidPredmetById(Long id) {
        return this.vidPredmetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Вид на предмет", id));
    }
    public VidPredmetDobiena createVidPredmet(VidPredmetRequest request) {
        VidPredmetDobiena vidPredmet = new VidPredmetDobiena();
        vidPredmet.setNaziv(request.getNaziv());
        return this.vidPredmetRepository.save(vidPredmet);
    }
    public VidPredmetDobiena updateVidPredmet(Long id,VidPredmetRequest request) {
        VidPredmetDobiena existingVidPredmet = this.getVidPredmetById(id);
        existingVidPredmet.setNaziv(request.getNaziv());
        return this.vidPredmetRepository.save(existingVidPredmet);
    }
    public void deleteVidPredmetById(Long id) {
        VidPredmetDobiena existingVidPredmet = this.getVidPredmetById(id);
        this.vidPredmetRepository.delete(existingVidPredmet);
    }
}
