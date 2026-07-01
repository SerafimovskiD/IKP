package com.example.backend.service.nomenclature;

import com.example.backend.dto.DobienaPostaRequest;
import com.example.backend.exceptions.BadRequestException;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import org.springframework.stereotype.Service;

@Service
public class PredmetService {
    private final PredmetRepository predmetRepository;
    private final IsprakjacRepository isprakjacRepository;
    private final VidPredmetRepository vidPredmetRepository;
    private final UserRepository userRepository;
    private final ArhivaRepository arhivaRepository;
    private final orgEdinicaRepository orgEdinicaRepository;

    public PredmetService(PredmetRepository predmetRepository, IsprakjacRepository isprakjacRepository, VidPredmetRepository vidPredmetRepository, UserRepository userRepository, ArhivaRepository arhivaRepository, orgEdinicaRepository orgEdinicaRepository) {
        this.predmetRepository = predmetRepository;
        this.isprakjacRepository = isprakjacRepository;
        this.vidPredmetRepository = vidPredmetRepository;
        this.userRepository = userRepository;
        this.arhivaRepository = arhivaRepository;
        this.orgEdinicaRepository = orgEdinicaRepository;
    }

    public Predmet createDobienaPosta(DobienaPostaRequest request){
        Predmet predmet = new Predmet();
        predmet.setBrAkt(request.getBrAkt());
        predmet.setRedenBroj(request.getRedenBroj());
        predmet.setPodBroj(request.getPodBroj());
        predmet.setGodina(request.getGodina());
        predmet.setDatumZaveduvanje(request.getDatumZaveduvanje());

        predmet.setTipPosta(request.getTipPosta());
        predmet.setPrioritet(request.getPrioritet());

        if(request.getIsprakjacId() == null){
            throw new BadRequestException("Испраќач е задолжителен за добиена пошта");
        }

        Isprakjac isprakjac = this.isprakjacRepository.findById(request.getIsprakjacId())
                .orElseThrow(() -> new ResourceNotFoundException("Испраќач", request.getIsprakjacId()));
                        predmet.setIsprakjac(isprakjac);
                        predmet.setBrAktNivni(request.getBrAktNivni());
                        predmet.setDatumIsprakjanje(request.getDatumIsprakjanje());
                        predmet.setBrAktArhivski(request.getBrAktArhivski());

        if(request.getVidPredmetId() != null){
            VidPredmet vidPredmet = this.vidPredmetRepository.findById(request.getVidPredmetId())
                    .orElseThrow(() -> new ResourceNotFoundException("Вид на предмет", request.getVidPredmetId()));
            predmet.setVidPredmet(vidPredmet);
        }
        predmet.setSodrzina(request.getSodrzina());

        if(request.getOdgovornoLiceId() != null){
            UserTable odgovornolice = this.userRepository.findById(request.getOdgovornoLiceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Одговорно лице", request.getOdgovornoLiceId()));
            predmet.setOdgovornoLice(odgovornolice);
        }
        predmet.setInformativnaPosta(request.getInformativnaPosta());
        predmet.setRealizirano(request.getRealizirano());

        if(request.getArhivaId() != null){
            Arhiva arhiva = this.arhivaRepository.findById(request.getArhivaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Архива", request.getArhivaId()));
            predmet.setArhiva(arhiva);
        }
        predmet.setZabeleska(request.getZabeleska());

        if(request.getRoditelPredmetId() != null){
            Predmet roditelPredmet = this.predmetRepository.findById(request.getRoditelPredmetId())
                    .orElseThrow(() -> new ResourceNotFoundException("Родител предмет", request.getRoditelPredmetId()));
            predmet.setRoditelPredmet(roditelPredmet);
        }
        if(request.getOrganizaciskaEdinicaId() != null){
            OrganizaciskaEdinica organizaciskaEdinica = this.orgEdinicaRepository.findById(request.getOrganizaciskaEdinicaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Организациска единица", request.getOrganizaciskaEdinicaId()));
            predmet.setOrganizaciskaedinica(organizaciskaEdinica);
        }
        predmet.setStatusPredmet(request.getStatusPredmet());
        predmet.setTipOdgovor(TipOdgovor.добиена);
        predmet.setIspratenoDo(null);
        return this.predmetRepository.save(predmet);
    }
}
