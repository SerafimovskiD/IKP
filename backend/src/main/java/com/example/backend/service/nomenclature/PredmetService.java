package com.example.backend.service.nomenclature;

import com.example.backend.dto.*;

import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import com.example.backend.repository.specification.PredmetSpecification;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.domain.Specification;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDate;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class PredmetService {
    private final PredmetRepository predmetRepository;
    private final IsprakjacRepository isprakjacRepository;
    private final VidPredmetDobienaRepository vidPredmetDobienaRepository;
    private final VidPredmetIspratenaRepository vidPredmetIspratenaRepository;
    private final UserRepository userRepository;
    private final ArhivaRepository arhivaRepository;
    private final orgEdinicaRepository orgEdinicaRepository;
    private final PredmetStatusRepository predmetStatusRepository;

    public PredmetService(PredmetRepository predmetRepository, IsprakjacRepository isprakjacRepository, VidPredmetDobienaRepository vidPredmetRepository, VidPredmetDobienaRepository vidPredmetDobienaRepository, VidPredmetIspratenaRepository vidPredmetIspratenaRepository, UserRepository userRepository, ArhivaRepository arhivaRepository, orgEdinicaRepository orgEdinicaRepository, PredmetStatusRepository predmetStatusRepository) {
        this.predmetRepository = predmetRepository;
        this.isprakjacRepository = isprakjacRepository;
        this.vidPredmetDobienaRepository = vidPredmetDobienaRepository;
        this.vidPredmetIspratenaRepository = vidPredmetIspratenaRepository;
        this.userRepository = userRepository;
        this.arhivaRepository = arhivaRepository;
        this.orgEdinicaRepository = orgEdinicaRepository;
        this.predmetStatusRepository = predmetStatusRepository;
    }
    @Transactional
    public PostaResponse createPosta(PostaRequest request,
                                     String email,
                                     TipDelovnik tipDelovnik,
                                     TipOdgovor tipOdgovor,
                                     Integer roditelRedenBroj,
                                     Integer roditelGodina,
                                     Integer oldPodbroj
                                     ) {
        UserTable user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String brAkt;
        Integer godina;
        Integer redenBroj;
        Integer podBroj;
        if (tipOdgovor == null){
            brAkt = user.getOrganizaciskaEdinica().getCode();
            godina = LocalDate.now().getYear();
            redenBroj = predmetRepository.findMaxRedenBroj(godina) + 1;
            podBroj=1;
        }else{
            Predmet roditel = predmetRepository
                    .findPredmetByRedenBrojAndGodinaAndPodBroj
                            (roditelRedenBroj,roditelGodina,oldPodbroj).orElseThrow(()->new ResourceNotFoundException("Predmet not found"));
            brAkt = roditel.getBrAkt();
            godina = roditel.getGodina();
            redenBroj = roditel.getRedenBroj();
            podBroj = predmetRepository.findMaxPodBrojByRedenBrojAndGodina(redenBroj,godina)+1;
//            podBroj = oldPodbroj+1;
        }
        Predmet predmet = new Predmet();
        if (tipOdgovor != null){
            predmetRepository.deactivateByRedenBrojAndGodina(redenBroj,godina);
        }
        predmet.setActive(true);
        predmet.setBrAkt(brAkt);
        predmet.setRedenBroj(redenBroj);
        predmet.setPodBroj(podBroj);
        predmet.setGodina(godina);
        predmet.setTipOdgovor(tipOdgovor);
        predmet.setDatumZaveduvanje(request.getDatumZaveduvanje());
        predmet.setTipPosta(request.getTipPosta());
        predmet.setSodrzina(request.getSodrzina());
        predmet.setInformativnaPosta(request.getInformativnaPosta());
        predmet.setRealizirano(request.getRealizirano());
        predmet.setZabeleska(request.getZabeleska());
        predmet.setStatusPredmet(request.getStatusPredmet());
        predmet.setTipDelovnik(tipDelovnik);
        predmet.setPromenil(user);

        List<UserTable> odgovornoLice = request.getOdgovornoLiceId().stream()
                .map(id -> userRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("User with ID: " + id)))
                .collect(Collectors.toList());

        List<Arhiva> arhiva = request.getArhivaId().stream()
                .map(id -> arhivaRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Arhiva with ID: " + id)))
                .collect(Collectors.toList());
        Isprakjac isprakjac = isprakjacRepository.findById(request.getIsprakjacId())
                .orElseThrow(() -> new ResourceNotFoundException("Isprakjac not found"));
        predmet.setOdgovornoLice(new HashSet<>(odgovornoLice));
        predmet.setArhiva(new HashSet<>(arhiva));
        predmet.setIsprakjac(isprakjac);
        predmet.setIsprakjacIme(request.getIsprakjacIme());
        if (tipDelovnik == TipDelovnik.Dobiena) {
            predmet.setPrioritet(request.getPrioritet());
            predmet.setBrAktNivni(request.getBrAktNivni());
            predmet.setDatumIsprakjanje(request.getDatumIsprakjanje());
            predmet.setBrAktArhivski(request.getBrAktArhivski());

            List<VidPredmetDobiena> vidPredmet = request.getVidPredmetDobienaId().stream()
                    .map(id -> vidPredmetDobienaRepository.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("VidPredmetDobiena with ID: " + id)))
                    .collect(Collectors.toList());
            predmet.setVidPredmetDobiena(new HashSet<>(vidPredmet));
            predmet.setVidPredmetIspratena(new HashSet<>());

        } else {

            List<VidPredmetIspratena> vidPredmet = request.getVidPredmetIspratenaId().stream()
                    .map(id -> vidPredmetIspratenaRepository.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("VidPredmetIspratena with ID: " + id)))
                    .collect(Collectors.toList());
            predmet.setVidPredmetIspratena(new HashSet<>(vidPredmet));
            predmet.setVidPredmetDobiena(new HashSet<>());
        }

        Predmet saved = predmetRepository.save(predmet);
        Predmet refreshed = predmetRepository.findById(saved.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Predmet not found"));
        return PostaResponse.from(refreshed);
    }
    @Transactional
    public PostaResponse editPosta(PostaRequest request,
                                   Long predmetId,
                                   String email
//                                   TipDelovnik tipDelovnik

    ) {
        UserTable user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Predmet predmet = predmetRepository.findById(predmetId).orElseThrow(()->new ResourceNotFoundException("Predmet not found"));
        predmet.setBrAkt(predmet.getBrAkt());
        predmet.setGodina(predmet.getGodina());
        predmet.setRedenBroj(predmet.getRedenBroj());
        predmet.setPodBroj(predmet.getPodBroj());
        predmet.setTipOdgovor(predmet.getTipOdgovor());
        predmet.setDatumZaveduvanje(request.getDatumZaveduvanje());
        predmet.setTipPosta(request.getTipPosta());
        predmet.setSodrzina(request.getSodrzina());
        predmet.setInformativnaPosta(request.getInformativnaPosta());
        predmet.setRealizirano(request.getRealizirano());
        predmet.setZabeleska(request.getZabeleska());
        predmet.setStatusPredmet(request.getStatusPredmet());
        predmet.setTipDelovnik(predmet.getTipDelovnik());
        predmet.setPromenil(user);

        List<UserTable> odgovornoLice = request.getOdgovornoLiceId().stream()
                .map(id -> userRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("User with ID: " + id)))
                .collect(Collectors.toList());

        List<Arhiva> arhiva = request.getArhivaId().stream()
                .map(id -> arhivaRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Arhiva with ID: " + id)))
                .collect(Collectors.toList());
        Isprakjac isprakjac = isprakjacRepository.findById(request.getIsprakjacId())
                .orElseThrow(() -> new ResourceNotFoundException("Isprakjac not found"));
        predmet.setOdgovornoLice(new HashSet<>(odgovornoLice));
        predmet.setArhiva(new HashSet<>(arhiva));
        predmet.setIsprakjac(isprakjac);
        predmet.setIsprakjacIme(request.getIsprakjacIme());
//        if (tipDelovnik == TipDelovnik.Dobiena) {
            predmet.setPrioritet(request.getPrioritet());
            predmet.setBrAktNivni(request.getBrAktNivni());
            predmet.setDatumIsprakjanje(request.getDatumIsprakjanje());
            predmet.setBrAktArhivski(request.getBrAktArhivski());

            List<VidPredmetDobiena> vidPredmetDob = request.getVidPredmetDobienaId().stream()
                    .map(id -> vidPredmetDobienaRepository.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("VidPredmetDobiena with ID: " + id)))
                    .collect(Collectors.toList());
            predmet.setVidPredmetDobiena(new HashSet<>(vidPredmetDob));
//            predmet.setVidPredmetIspratena(new HashSet<>());

//        } else {

            List<VidPredmetIspratena> vidPredmetIsp = request.getVidPredmetIspratenaId().stream()
                    .map(id -> vidPredmetIspratenaRepository.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("VidPredmetIspratena with ID: " + id)))
                    .collect(Collectors.toList());
            predmet.setVidPredmetIspratena(new HashSet<>(vidPredmetIsp));
//            predmet.setVidPredmetDobiena(new HashSet<>());
//        }

        Predmet saved = predmetRepository.save(predmet);
        Predmet refreshed = predmetRepository.findById(saved.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Predmet not found"));
        return PostaResponse.from(refreshed);
    }

    public Page<PredmetListResponse> getAllPredmeti(
            Pageable pageable, Integer godina,String redenBroj,
            String isprakjacIme, Long odgovornoLiceId,
            Long vidPredmetDobienaId, Long vidPredmetIspratenaId,
            Boolean realizirano, String search,
            TipDelovnik tipDelovnik, TipPosta tipPosta, StatusPredmet statusPredmet,Long arhivaId,
        String datumZaveduvanje,String brAktNivni,String sodrzina,String zabeleska) {

        Specification<Predmet> spec = Specification
                .where(PredmetSpecification.isActive())
                .and(PredmetSpecification.hasTipDelovnik(tipDelovnik))
                .and(PredmetSpecification.hasGodina(godina))
                .and(PredmetSpecification.hasRedenBrojLike(redenBroj))
                .and(PredmetSpecification.hasTipPosta(tipPosta))
                .and(PredmetSpecification.isRealizirano(realizirano))
                .and(PredmetSpecification.hasStatusPredmet(statusPredmet))

                .and(PredmetSpecification.hasIsprakjac(isprakjacIme))
                .and(PredmetSpecification.hasArhiva(arhivaId))
                .and(PredmetSpecification.hasOdgovornoLice(odgovornoLiceId))
                .and(PredmetSpecification.hasVidPredmetDobiena(vidPredmetDobienaId))
                .and(PredmetSpecification.hasVidPredmetIspratena(vidPredmetIspratenaId))

                .and(PredmetSpecification.hasDatumZaveduvanjeLike(datumZaveduvanje))
                .and(PredmetSpecification.hasBrAktNivniLike(brAktNivni))
                .and(PredmetSpecification.hasSodrzina(sodrzina))
                .and(PredmetSpecification.hasZabeleska(zabeleska))

                .and(PredmetSpecification.searchText(search));

        return predmetRepository.findAll(spec, pageable).map(PredmetListResponse::from);
    }

    public PostaResponse getPosta(Long id) {
        return PostaResponse.from(predmetRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Predmet not found")));
    }
    public List<PredmetListResponse> getPrethodniPredmeti(Integer redenBroj, Integer godina) {
        return predmetRepository.findAllByRedenBrojAndGodina(redenBroj, godina)
                .stream()
                .map(PredmetListResponse::from)
                .collect(Collectors.toList());
    }
}