package com.example.backend.service.nomenclature;

import com.example.backend.dto.DobienaPostaRequest;
import com.example.backend.dto.DobienaPostaResponse;
import com.example.backend.dto.IspratenaPostaRequest;
import com.example.backend.exceptions.BadRequestException;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.example.backend.dto.StatusPredmetRequest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class PredmetService {
    private final PredmetRepository predmetRepository;
    private final IsprakjacRepository isprakjacRepository;
    private final VidPredmetDobienaRepository vidPredmetRepository;
    private final UserRepository userRepository;
    private final ArhivaRepository arhivaRepository;
    private final orgEdinicaRepository orgEdinicaRepository;
    private final PredmetStatusRepository predmetStatusRepository;

    public PredmetService(PredmetRepository predmetRepository, IsprakjacRepository isprakjacRepository, VidPredmetDobienaRepository vidPredmetRepository, UserRepository userRepository, ArhivaRepository arhivaRepository, orgEdinicaRepository orgEdinicaRepository, PredmetStatusRepository predmetStatusRepository) {
        this.predmetRepository = predmetRepository;
        this.isprakjacRepository = isprakjacRepository;
        this.vidPredmetRepository = vidPredmetRepository;
        this.userRepository = userRepository;
        this.arhivaRepository = arhivaRepository;
        this.orgEdinicaRepository = orgEdinicaRepository;
        this.predmetStatusRepository = predmetStatusRepository;
    }
    //Gavrilov
//    @Transactional
//    public DobienaPostaResponse createDobienaPosta(DobienaPostaRequest request) {
//
//        if (request.getIsprakjacId() == null) {
//            throw new BadRequestException("Испраќач е задолжителен за добиена пошта");
//        }
//
//        if (request.getVidPredmetId() == null) {
//            throw new BadRequestException("Вид на предмет е задолжителен");
//        }
//
//        if (request.getOdgovornoLiceId() == null) {
//            throw new BadRequestException("Одговорно лице е задолжително");
//        }
//

    /// /        if (request.getArhivaId() == null) {
    /// /            throw new BadRequestException("Архива е задолжителна");
    /// /        }
//
//        if (request.getDatumZaveduvanje() == null) {
//            throw new BadRequestException("Датум на заведување е задолжителен");
//        }
//
//        if (request.getTipPosta() == null) {
//            throw new BadRequestException("Тип на пошта е задолжителен");
//        }
//
//        if (request.getPrioritet() == null) {
//            throw new BadRequestException("Приоритет е задолжителен");
//        }
//
//        if (request.getSodrzina() == null || request.getSodrzina().isBlank()) {
//            throw new BadRequestException("Содржина е задолжителна");
//        }
//
//        Isprakjac isprakjac = isprakjacRepository.findById(request.getIsprakjacId())
//                .orElseThrow(() -> new ResourceNotFoundException("Испраќач", request.getIsprakjacId()));
//
//        VidPredmet vidPredmet = vidPredmetRepository.findById(request.getVidPredmetId())
//                .orElseThrow(() -> new ResourceNotFoundException("Вид на предмет", request.getVidPredmetId()));
//
//        UserTable odgovornoLice = userRepository.findById(request.getOdgovornoLiceId())
//                .orElseThrow(() -> new ResourceNotFoundException("Одговорно лице", request.getOdgovornoLiceId()));
//
//        Arhiva arhiva = arhivaRepository.findById(request.getArhivaId())
//                .orElseThrow(() -> new ResourceNotFoundException("Архива", request.getArhivaId()));
//
//        LocalDate datumZaveduvanje = request.getDatumZaveduvanje();
//        Integer godina = datumZaveduvanje.getYear();
//        Integer redenBroj = predmetRepository.findMaxRedenBroj(godina) + 1;
//
//        String brAkt = "11.1"; // TODO: да се потврди од каде точно се зема ова
//        Integer podBroj = 1;
//
//        Predmet predmet = new Predmet();
//
//        predmet.setBrAkt(brAkt);
//        predmet.setRedenBroj(redenBroj);
//        predmet.setPodBroj(podBroj);
//        predmet.setGodina(godina);
//        predmet.setDatumZaveduvanje(datumZaveduvanje);
//
//        predmet.setTipPosta(request.getTipPosta());
//        predmet.setPrioritet(request.getPrioritet());
//
//        predmet.setIsprakjac(isprakjac);
//        predmet.setIspratenoDo(null);
//
//        predmet.setBrAktNivni(request.getBrAktNivni());
//        predmet.setDatumIsprakjanje(request.getDatumIsprakjanje());
//        predmet.setBrAktArhivski(request.getBrAktArhivski());
//
//        predmet.setVidPredmet(vidPredmet);
//        predmet.setSodrzina(request.getSodrzina());
//        predmet.setOdgovornoLice(odgovornoLice);
//
//        predmet.setInformativnaPosta(request.getInformativnaPosta());
//        predmet.setRealizirano(request.getRealizirano());
//
//        predmet.setArhiva(arhiva);
//        predmet.setZabeleska(request.getZabeleska());
//
//        predmet.setTipOdgovor(TipOdgovor.ДП_одговор);
//
//        Predmet saved = predmetRepository.save(predmet);
//
//        return DobienaPostaResponse.from(saved);
//    }

    //NAUM
    @Transactional
    public DobienaPostaResponse createDobienaPosta(DobienaPostaRequest request, String email) {

        UserTable user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Isprakjac isprakjac = isprakjacRepository.findById(request.getIsprakjacId())
                .orElseThrow(() -> new ResourceNotFoundException("Isprakjac not found"));
        List<VidPredmetDobiena> vidPredmet = request.getVidPredmetDobienaId().stream()
                .map(id->vidPredmetRepository.findById(id)
                        .orElseThrow(()->new ResourceNotFoundException("Vid Predmet with ID: "+id+" not exists"))).collect(Collectors.toList());
        List<UserTable> odgovornoLice = request.getOdgovornoLiceId().stream()
                .map(id->userRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("User with ID: "+id+" not exists"))).collect(Collectors.toList());
        List<Arhiva> arhiva = request.getArhivaId().stream()
                .map(id->arhivaRepository.findById(id)
                        .orElseThrow(()->new  ResourceNotFoundException("Arhiva with ID: "+id+" not exists"))).collect(Collectors.toList());
        //Mislam nema potreba od pravenje na zadolzitelni polinja vo
        // backend pobrzo e za testiranje a na frontend posekako
        // ke stavime required na polinjata koi se zadolzitelni
        // ^ Naum
        String brAkt = user.getOrganizaciskaEdinica().getCode();
        Integer godina = LocalDate.now().getYear();
        Integer redenBroj = predmetRepository.findMaxRedenBroj(godina) + 1;
        Predmet predmet = new Predmet();
        predmet.setBrAkt(brAkt);
        predmet.setRedenBroj(redenBroj);
        predmet.setPodBroj(1);
        predmet.setGodina(godina);
        return getDobienaPostaResponse(request, isprakjac, vidPredmet, odgovornoLice, arhiva, predmet);
    }
    //delumno e napravena nekoi testiranja da se napravat treba mozda <-Naum
    public DobienaPostaResponse odgovorDobienaPosta(DobienaPostaRequest request, String email,Integer predmetSoRedBr,Integer godina) {
//        UserTable user = userRepository.findByEmail(email)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Isprakjac isprakjac = isprakjacRepository.findById(request.getIsprakjacId())
                .orElseThrow(() -> new ResourceNotFoundException("Isprakjac not found"));
        List<VidPredmetDobiena> vidPredmet = request.getVidPredmetDobienaId().stream()
                .map(id->vidPredmetRepository.findById(id)
                        .orElseThrow(()->new ResourceNotFoundException("Vid Predmet with ID: "+id+" not exists"))).collect(Collectors.toList());
        List<UserTable> odgovornoLice = request.getOdgovornoLiceId().stream()
                .map(id->userRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("User with ID: "+id+" not exists"))).collect(Collectors.toList());
        List<Arhiva> arhiva = request.getArhivaId().stream()
                .map(id->arhivaRepository.findById(id)
                        .orElseThrow(()->new  ResourceNotFoundException("Arhiva with ID: "+id+" not exists"))).collect(Collectors.toList());
        Predmet predmet = predmetRepository.findPredmetByRedenBrojAndGodina(predmetSoRedBr,godina).getLast();
        predmet.setPodBroj(predmet.getPodBroj()+1);
        //tuka ke gi stavam site polinja da moze da se
        // smenat koga se pravi nov podbroj za pocetok
        // sledno ke prasame sto ke smee da se menuva  <-Naum
        return getDobienaPostaResponse(request, isprakjac, vidPredmet, odgovornoLice, arhiva, predmet);

    }

    private DobienaPostaResponse getDobienaPostaResponse(DobienaPostaRequest request, Isprakjac isprakjac, List<VidPredmetDobiena> vidPredmet, List<UserTable> odgovornoLice, List<Arhiva> arhiva, Predmet predmet) {
        predmet.setVidPredmetDobiena(vidPredmet);
        predmet.setIsprakjac(isprakjac);
        predmet.setArhiva(arhiva);
        predmet.setDatumZaveduvanje(request.getDatumZaveduvanje());
        predmet.setTipPosta(request.getTipPosta());
        predmet.setPrioritet(request.getPrioritet());
        predmet.setBrAktNivni(request.getBrAktNivni());
        predmet.setDatumIsprakjanje(request.getDatumIsprakjanje());
        predmet.setBrAktArhivski(request.getBrAktArhivski());
        predmet.setSodrzina(request.getSodrzina());
        predmet.setOdgovornoLice(odgovornoLice);
        predmet.setInformativnaPosta(request.getInformativnaPosta());
        predmet.setRealizirano(request.getRealizirano());
        predmet.setZabeleska(request.getZabeleska());
        predmet.setStatusPredmet(request.getStatusPredmet());

        Predmet saved = predmetRepository.save(predmet);
        Predmet refreshed = predmetRepository.findById(saved.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Predmet not found"));
        return DobienaPostaResponse.from(refreshed);
    }

    @Transactional
    public Predmet createIspratenaPosta(IspratenaPostaRequest request) {
        Predmet predmet = new Predmet();
        LocalDate datumZaveduvanje = request.getDatumZaveduvanje() != null
                ? request.getDatumZaveduvanje()
                : LocalDate.now();
        Integer godina = datumZaveduvanje.getYear();
        Integer lastRedenBroj = this.predmetRepository.findMaxRedenBroj(godina);
        Integer nextRedenBroj = lastRedenBroj + 1;

        Integer podBroj = 0;
        String brAkt = nextRedenBroj + "/" + godina;
        predmet.setBrAkt(brAkt);
        predmet.setRedenBroj(nextRedenBroj);
        predmet.setPodBroj(podBroj);
        predmet.setGodina(godina);
        predmet.setDatumZaveduvanje(datumZaveduvanje);

        predmet.setTipPosta(request.getTipPosta());
        predmet.setPrioritet(request.getPrioritet());

        if (request.getIspratenoDoId() == null) {
            throw new BadRequestException("Примач е задолжителен за испратена пошта");
        }

        Isprakjac isprakjac = this.isprakjacRepository.findById(request.getIspratenoDoId())
                .orElseThrow(() -> new ResourceNotFoundException("Испратено до", request.getIspratenoDoId()));
        //prov dobiena posta da naprajme <-naum
//        predmet.setIspratenoDo(ispratenDo);
        predmet.setIsprakjac(null);
        predmet.setBrAktNivni(request.getBrAktNivni());
        predmet.setDatumIsprakjanje(request.getDatumIsprakjanje());
        predmet.setBrAktArhivski(request.getBrAktArhivski());

//        if (request.getVidPredmetId() != null) {
//            VidPredmet vidPredmet = this.vidPredmetRepository.findById(request.getVidPredmetId())
//                    .orElseThrow(() -> new ResourceNotFoundException("Вид на предмет", request.getVidPredmetId()));
//            predmet.setVidPredmet(vidPredmet);
//        }
        predmet.setSodrzina(request.getSodrzina());

//        if (request.getOdgovornoLiceId() != null) {
//            UserTable odgovornolice = this.userRepository.findById(request.getOdgovornoLiceId())
//                    .orElseThrow(() -> new ResourceNotFoundException("Одговорно лице", request.getOdgovornoLiceId()));
//            predmet.setOdgovornoLice(odgovornolice);
//        }
        predmet.setInformativnaPosta(request.getInformativnaPosta());
        predmet.setRealizirano(request.getRealizirano());

//        if (request.getArhivaId() != null) {
//            Arhiva arhiva = this.arhivaRepository.findById(request.getArhivaId())
//                    .orElseThrow(() -> new ResourceNotFoundException("Архива", request.getArhivaId()));
//            predmet.setArhiva(arhiva);
//        }
        predmet.setZabeleska(request.getZabeleska());

        if (request.getRoditelPredmetId() != null) {
            Predmet roditelPredmet = this.predmetRepository.findById(request.getRoditelPredmetId())
                    .orElseThrow(() -> new ResourceNotFoundException("Родител предмет", request.getRoditelPredmetId()));
            predmet.setRoditelPredmet(roditelPredmet);
        }

        if (request.getOrganizaciskaEdinicaId() != null) {
            OrganizaciskaEdinica organizaciskaEdinica = this.orgEdinicaRepository.findById(request.getOrganizaciskaEdinicaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Организациска единица", request.getOrganizaciskaEdinicaId()));
            predmet.setOrganizaciskaedinica(organizaciskaEdinica);
        }
        predmet.setStatusPredmet(request.getStatusPredmet());

        predmet.setTipOdgovor(TipOdgovor.ИП_одговор);
        return this.predmetRepository.save(predmet);
    }

    @Transactional
    public Predmet updateStatusPredmet(Long id, StatusPredmetRequest request, String changedBy) {
        if (request.getStatusPredmet() == null) {
            throw new BadRequestException("Статусот на предметот е задолжителен");
        }
        Predmet predmet = this.predmetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Предмет", id));
        UserTable user = this.userRepository.findByEmail(changedBy)
                .orElseThrow(() -> new BadRequestException("Корисникот не е пронајден"));
        StatusPredmet oldStatus = predmet.getStatusPredmet();
        StatusPredmet newStatus = request.getStatusPredmet();

        predmet.setStatusPredmet(newStatus);
        Predmet savedPredmet = this.predmetRepository.save(predmet);

        PredmetStatusLog log = new PredmetStatusLog();
        log.setPredmet(savedPredmet);
        log.setOldStatus(oldStatus);
        log.setNewStatus(newStatus);
        log.setChangedBy(user);
        log.setChangedAt(LocalDateTime.now());

        this.predmetStatusRepository.save(log);

        return savedPredmet;
    }

}
