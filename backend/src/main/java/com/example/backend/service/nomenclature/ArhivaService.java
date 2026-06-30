package com.example.backend.service.nomenclature;

import com.example.backend.dto.ArhivaRequest;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.model.Arhiva;
import com.example.backend.model.OrganizaciskaEdinica;
import com.example.backend.repository.ArhivaRepository;
import com.example.backend.repository.orgEdinicaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArhivaService {
    private final ArhivaRepository arhivaRepository;
    private final orgEdinicaRepository organizaciskaEdinicaRepository;

    public ArhivaService(ArhivaRepository arhivaRepository, orgEdinicaRepository organizaciskaEdinicaRepository) {
        this.arhivaRepository = arhivaRepository;
        this.organizaciskaEdinicaRepository = organizaciskaEdinicaRepository;
    }

    public List<Arhiva> getAllArhivi(){
        return this.arhivaRepository.findAll();
    }
    public Arhiva getArhivaById(Long id){
        return this.arhivaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Архива",id));
    }

    public Arhiva createArhiva(ArhivaRequest arhivaRequest) {
        OrganizaciskaEdinica organizaciskaEdinica = this.organizaciskaEdinicaRepository.findById(arhivaRequest.getOrganizaciskaEdinicaId())
                .orElseThrow(() -> new ResourceNotFoundException("Организациска единица",arhivaRequest.getOrganizaciskaEdinicaId()));
        Arhiva arhiva = new Arhiva();
        arhiva.setNaziv(arhivaRequest.getNaziv());
        arhiva.setOrganizaciskaedinica(organizaciskaEdinica);
        return arhivaRepository.save(arhiva);
    }
    public Arhiva updateArhiva(Long id,ArhivaRequest arhivaRequest) {
        Arhiva existingArhiva = this.getArhivaById(id);
        OrganizaciskaEdinica organizaciskaEdinica = this.organizaciskaEdinicaRepository.findById(arhivaRequest.getOrganizaciskaEdinicaId())
                .orElseThrow(() -> new ResourceNotFoundException("Организациска единица",arhivaRequest.getOrganizaciskaEdinicaId()));
        existingArhiva.setNaziv(arhivaRequest.getNaziv());
        existingArhiva.setOrganizaciskaedinica(organizaciskaEdinica);
        return arhivaRepository.save(existingArhiva);
    }

    public void deleteArhiva(Long id){
        Arhiva existingArhiva = getArhivaById(id);
        this.arhivaRepository.delete(existingArhiva);
    }

}
