package com.example.backend.service.nomenclature;

import com.example.backend.dto.OrgEdinicaRequest;
import com.example.backend.dto.OrgEdinicaResponse;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.model.OrganizaciskaEdinica;
import com.example.backend.repository.orgEdinicaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrganizaciskaEdinicaService {
    private final orgEdinicaRepository orgEdinicaRepository;

    public OrganizaciskaEdinicaService(orgEdinicaRepository orgEdinicaRepository) {
        this.orgEdinicaRepository = orgEdinicaRepository;
    }
    public List<OrgEdinicaResponse> findAll(){
        return OrgEdinicaResponse.from(orgEdinicaRepository.findAll());
    }

    public OrgEdinicaResponse findById(Long id){
        return OrgEdinicaResponse.from(orgEdinicaRepository.findById(id).get());
    }
    public OrgEdinicaResponse create(OrgEdinicaRequest orgEdinicaRequest){
        OrganizaciskaEdinica organizaciskaEdinica = new OrganizaciskaEdinica();
        organizaciskaEdinica.setNaziv(orgEdinicaRequest.getNaziv());
        organizaciskaEdinica.setCode(orgEdinicaRequest.getCode());
        return OrgEdinicaResponse.from(orgEdinicaRepository.save(organizaciskaEdinica));
    }
    public OrgEdinicaResponse update(Long id,OrgEdinicaRequest orgEdinicaRequest){
        OrganizaciskaEdinica organizaciskaEdinica = orgEdinicaRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Organizaciska edinica so id: "+id+" ne postoi"));

        organizaciskaEdinica.setNaziv(orgEdinicaRequest.getNaziv());
        organizaciskaEdinica.setCode(orgEdinicaRequest.getCode());
        return OrgEdinicaResponse.from(orgEdinicaRepository.save(organizaciskaEdinica));
    }

    public void delete(Long id){
        orgEdinicaRepository.deleteById(id);
    }
}
