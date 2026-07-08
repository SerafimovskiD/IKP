package com.example.backend.service.nomenclature;

import com.example.backend.dto.VidPredmetRequest;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.model.VidPredmetIspratena;
import com.example.backend.repository.VidPredmetIspratenaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VidPredmetIspratenaService {
    private final VidPredmetIspratenaRepository vidPredmetRepository;

    public VidPredmetIspratenaService(VidPredmetIspratenaRepository vidPredmetRepository) {
        this.vidPredmetRepository = vidPredmetRepository;
    }

    public List<VidPredmetIspratena> getAllVidPredmet() {
        return this.vidPredmetRepository.findAll();
    }

    public VidPredmetIspratena getVidPredmetById(Long id) {
        return this.vidPredmetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Вид на предмет", id));
    }
    public VidPredmetIspratena createVidPredmet(VidPredmetRequest request) {
        VidPredmetIspratena vidPredmet = new VidPredmetIspratena();
        vidPredmet.setNaziv(request.getNaziv());
        return this.vidPredmetRepository.save(vidPredmet);
    }
    public VidPredmetIspratena updateVidPredmet(Long id,VidPredmetRequest request) {
        VidPredmetIspratena existingVidPredmet = this.getVidPredmetById(id);
        existingVidPredmet.setNaziv(request.getNaziv());
        return this.vidPredmetRepository.save(existingVidPredmet);
    }
    public void deleteVidPredmetById(Long id) {
        VidPredmetIspratena existingVidPredmet = this.getVidPredmetById(id);
        this.vidPredmetRepository.delete(existingVidPredmet);
    }
}

