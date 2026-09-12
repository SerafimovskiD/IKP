package com.example.backend.service.nomenclature;

import java.util.UUID;

import com.example.backend.dto.*;

import com.example.backend.exceptions.BadRequestException;
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
                                     String roditelBrAkt,
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
            // Нов предмет - нумерацијата (redenBroj) е по орг. единица на корисникот + година.
            brAkt = user.getOrganizaciskaEdinica().getCode();
            godina = LocalDate.now().getYear();
            redenBroj = predmetRepository.findMaxRedenBrojByBrAktAndGodina(brAkt, godina) + 1;
            podBroj=1;
        }else{
            // Одговор/под-предмет - го наследува brAkt-от од родителот; дозволено е само
            // на предмет од сопствената орг. единица (освен за ADMIN).
            String userOrgCode = user.getOrganizaciskaEdinica() != null
                    ? user.getOrganizaciskaEdinica().getCode() : null;
            if (user.getUloga() != Role.ADMIN && !roditelBrAkt.equals(userOrgCode)) {
                throw new BadRequestException("Не може да се прави одговор на предмет од друга организациска единица");
            }
            Predmet roditel = predmetRepository
                    .findPredmetByBrAktAndRedenBrojAndGodinaAndPodBroj
                            (roditelBrAkt, roditelRedenBroj, roditelGodina, oldPodbroj)
                    .orElseThrow(() -> new ResourceNotFoundException("Predmet not found"));
            brAkt = roditel.getBrAkt();
            godina = roditel.getGodina();
            redenBroj = roditel.getRedenBroj();
            podBroj = predmetRepository.findMaxPodBrojByBrAktAndRedenBrojAndGodina(brAkt, redenBroj, godina) + 1;
        }
        Predmet predmet = new Predmet();
        if (tipOdgovor != null){
            predmetRepository.deactivateByBrAktAndRedenBrojAndGodina(brAkt, redenBroj, godina);
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

        List<UserTable> dodelenoNa = request.getDodelenoNaId().stream()
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
        predmet.setDodelenoNa( new HashSet<>(dodelenoNa));
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
                                   UUID predmetId,
                                   String email,
                                   TipDelovnik tipDelovnik

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
        List<UserTable> dodelenoNa = request.getDodelenoNaId().stream()
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
        predmet.setDodelenoNa( new HashSet<>(dodelenoNa));
        predmet.setArhiva(new HashSet<>(arhiva));
        predmet.setIsprakjac(isprakjac);
        predmet.setIsprakjacIme(request.getIsprakjacIme());
        if (tipDelovnik == TipDelovnik.Dobiena) {
            predmet.setPrioritet(request.getPrioritet());
            predmet.setBrAktNivni(request.getBrAktNivni());
            predmet.setDatumIsprakjanje(request.getDatumIsprakjanje());
            predmet.setBrAktArhivski(request.getBrAktArhivski());

            List<VidPredmetDobiena> vidPredmetDob = request.getVidPredmetDobienaId().stream()
                    .map(id -> vidPredmetDobienaRepository.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("VidPredmetDobiena with ID: " + id)))
                    .collect(Collectors.toList());
            predmet.setVidPredmetDobiena(new HashSet<>(vidPredmetDob));
            predmet.setVidPredmetIspratena(new HashSet<>());

        } else {

            List<VidPredmetIspratena> vidPredmetIsp = request.getVidPredmetIspratenaId().stream()
                    .map(id -> vidPredmetIspratenaRepository.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("VidPredmetIspratena with ID: " + id)))
                    .collect(Collectors.toList());
            predmet.setVidPredmetIspratena(new HashSet<>(vidPredmetIsp));
            predmet.setVidPredmetDobiena(new HashSet<>());
        }

        Predmet saved = predmetRepository.save(predmet);
        Predmet refreshed = predmetRepository.findById(saved.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Predmet not found"));
        return PostaResponse.from(refreshed);
    }

    public Page<PredmetListResponse> getAllPredmeti(
            Pageable pageable, Integer godina,String redenBroj,
            String isprakjacIme, UUID odgovornoLiceId, UUID dodelenoNaId,
            UUID vidPredmetDobienaId, UUID vidPredmetIspratenaId,
            Boolean realizirano, String search,
            TipDelovnik tipDelovnik, TipPosta tipPosta, StatusPredmet statusPredmet,UUID arhivaId,
            String datumZaveduvanje,String brAktNivni,String sodrzina,String zabeleska,
            String brAktArhivski,String promenilKorisnik,
            String brAkt, String imeDokument) {

        Specification<Predmet> spec = Specification
                .where(PredmetSpecification.isActive())
                // Секоја орг. единица си ги гледа само своите предмети (brAkt = null за ADMIN).
                .and(PredmetSpecification.hasBrAkt(brAkt))
                .and(PredmetSpecification.hasTipDelovnik(tipDelovnik))
                .and(PredmetSpecification.hasGodina(godina))
                .and(PredmetSpecification.hasRedenBrojLike(redenBroj))
                .and(PredmetSpecification.hasTipPosta(tipPosta))
                .and(PredmetSpecification.isRealizirano(realizirano))
                .and(PredmetSpecification.hasStatusPredmet(statusPredmet))

                .and(PredmetSpecification.hasIsprakjac(isprakjacIme))
                .and(PredmetSpecification.hasArhiva(arhivaId))
                .and(PredmetSpecification.hasOdgovornoLice(odgovornoLiceId))
                .and(PredmetSpecification.hasDodelenoNa(dodelenoNaId))
                .and(PredmetSpecification.hasVidPredmetDobiena(vidPredmetDobienaId))
                .and(PredmetSpecification.hasVidPredmetIspratena(vidPredmetIspratenaId))

                .and(PredmetSpecification.hasDatumZaveduvanjeLike(datumZaveduvanje))
                .and(PredmetSpecification.hasBrAktNivniLike(brAktNivni))
                .and(PredmetSpecification.hasSodrzina(sodrzina))
                .and(PredmetSpecification.hasZabeleska(zabeleska))
                .and(PredmetSpecification.hasBrAktArhivskiLike(brAktArhivski))
                .and(PredmetSpecification.hasPromenilKorisnikLike(promenilKorisnik))
                .and(PredmetSpecification.hasSkeniranDokumentIme(imeDokument))

                .and(PredmetSpecification.searchText(search));

        Page<Predmet> page = predmetRepository.findAll(spec, pageable);
        var vkPodBroeviMap = buildVkPodBroeviMap(page.getContent());
        return page.map(p -> PredmetListResponse.from(p, vkPodBroeviMap.get(vkPodBroeviKey(p))));
    }

    public PostaResponse getPosta(UUID id) {
        return PostaResponse.from(predmetRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Predmet not found")));
    }
    public List<PredmetListResponse> getPrethodniPredmeti(String brAkt, Integer redenBroj, Integer godina) {
        List<Predmet> predmeti = predmetRepository.findAllByBrAktAndRedenBrojAndGodina(brAkt, redenBroj, godina);
        var vkPodBroeviMap = buildVkPodBroeviMap(predmeti);
        return predmeti.stream()
                .map(p -> PredmetListResponse.from(p, vkPodBroeviMap.get(vkPodBroeviKey(p))))
                .collect(Collectors.toList());
    }

    private java.util.Map<String, Integer> buildVkPodBroeviMap(List<Predmet> predmeti) {
        var godini = predmeti.stream().map(Predmet::getGodina).collect(Collectors.toSet());
        if (godini.isEmpty()) return java.util.Map.of();
        // Редовите се [brAkt, redenBroj, godina, maxPodBroj] - клуч по трите
        // за да не се судираат исти (redenBroj, godina) од различни орг. единици.
        return predmetRepository.findMaxPodBrojGroupedByGodini(godini).stream()
                .collect(Collectors.toMap(
                        row -> row[0] + "-" + row[1] + "-" + row[2],
                        row -> (Integer) row[3]
                ));
    }

    private String vkPodBroeviKey(Predmet p) {
        return p.getBrAkt() + "-" + p.getRedenBroj() + "-" + p.getGodina();
    }
}