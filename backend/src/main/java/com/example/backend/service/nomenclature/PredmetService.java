package com.example.backend.service.nomenclature;

import com.example.backend.dto.DobienaPostaRequest;
import com.example.backend.dto.DobienaPostaResponse;
import com.example.backend.dto.IspratenaPostaRequest;
import com.example.backend.exceptions.BadRequestException;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import org.springframework.stereotype.Service;
import com.example.backend.dto.StatusPredmetRequest;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;


@Service
public class PredmetService {
    private final PredmetRepository predmetRepository;
    private final IsprakjacRepository isprakjacRepository;
    private final VidPredmetRepository vidPredmetRepository;
    private final UserRepository userRepository;
    private final ArhivaRepository arhivaRepository;
    private final orgEdinicaRepository orgEdinicaRepository;
    private final PredmetStatusRepository predmetStatusRepository;
    private final IspratenDoRepository ispratenDoRepository;

    public PredmetService(PredmetRepository predmetRepository, IsprakjacRepository isprakjacRepository, VidPredmetRepository vidPredmetRepository, UserRepository userRepository, ArhivaRepository arhivaRepository, orgEdinicaRepository orgEdinicaRepository, PredmetStatusRepository predmetStatusRepository, IspratenDoRepository ispratenDoRepository) {
        this.predmetRepository = predmetRepository;
        this.isprakjacRepository = isprakjacRepository;
        this.vidPredmetRepository = vidPredmetRepository;
        this.userRepository = userRepository;
        this.arhivaRepository = arhivaRepository;
        this.orgEdinicaRepository = orgEdinicaRepository;
        this.predmetStatusRepository = predmetStatusRepository;
        this.ispratenDoRepository = ispratenDoRepository;
    }
    // Gavrilov
//    @Transactional
//    public Predmet createDobienaPosta(DobienaPostaRequest request){
//        Predmet predmet = new Predmet();
//        LocalDate datumZaveduvanje = request.getDatumZaveduvanje() != null
//                ? request.getDatumZaveduvanje()
//                : LocalDate.now();
//        Integer godina = datumZaveduvanje.getYear();
//        Integer lastRedenBroj = this.predmetRepository.findMaxRedenBroj(godina);
//        Integer nextRedenBroj = lastRedenBroj + 1;
//        Integer podBroj = 0 ;
//        String brAkt = nextRedenBroj + "/" + godina;
//        predmet.setBrAkt(brAkt);
//        predmet.setRedenBroj(nextRedenBroj);
//        predmet.setPodBroj(podBroj);
//        predmet.setGodina(godina);
//        predmet.setDatumZaveduvanje(datumZaveduvanje);
//        predmet.setTipPosta(request.getTipPosta());
//        predmet.setPrioritet(request.getPrioritet());
//
//        if(request.getIsprakjacId() == null){
//            throw new BadRequestException("Испраќач е задолжителен за добиена пошта");
//        }
//
//        Isprakjac isprakjac = this.isprakjacRepository.findById(request.getIsprakjacId())
//                .orElseThrow(() -> new ResourceNotFoundException("Испраќач", request.getIsprakjacId()));
//                        predmet.setIsprakjac(isprakjac);
//                        predmet.setBrAktNivni(request.getBrAktNivni());
//                        predmet.setDatumIsprakjanje(request.getDatumIsprakjanje());
//                        predmet.setBrAktArhivski(request.getBrAktArhivski());
//
//        if(request.getVidPredmetId() != null){
//            VidPredmet vidPredmet = this.vidPredmetRepository.findById(request.getVidPredmetId())
//                    .orElseThrow(() -> new ResourceNotFoundException("Вид на предмет", request.getVidPredmetId()));
//            predmet.setVidPredmet(vidPredmet);
//        }
//        predmet.setSodrzina(request.getSodrzina());
//
//        if(request.getOdgovornoLiceId() != null){
//            UserTable odgovornolice = this.userRepository.findById(request.getOdgovornoLiceId())
//                    .orElseThrow(() -> new ResourceNotFoundException("Одговорно лице", request.getOdgovornoLiceId()));
//            predmet.setOdgovornoLice(odgovornolice);
//        }
//        predmet.setInformativnaPosta(request.getInformativnaPosta());
//        predmet.setRealizirano(request.getRealizirano());
//
//        if(request.getArhivaId() != null){
//            Arhiva arhiva = this.arhivaRepository.findById(request.getArhivaId())
//                    .orElseThrow(() -> new ResourceNotFoundException("Архива", request.getArhivaId()));
//            predmet.setArhiva(arhiva);
//        }
//        predmet.setZabeleska(request.getZabeleska());
//
//        if(request.getRoditelPredmetId() != null){
//            Predmet roditelPredmet = this.predmetRepository.findById(request.getRoditelPredmetId())
//                    .orElseThrow(() -> new ResourceNotFoundException("Родител предмет", request.getRoditelPredmetId()));
//            predmet.setRoditelPredmet(roditelPredmet);
//        }
//        if(request.getOrganizaciskaEdinicaId() != null){
//            OrganizaciskaEdinica organizaciskaEdinica = this.orgEdinicaRepository.findById(request.getOrganizaciskaEdinicaId())
//                    .orElseThrow(() -> new ResourceNotFoundException("Организациска единица", request.getOrganizaciskaEdinicaId()));
//            predmet.setOrganizaciskaedinica(organizaciskaEdinica);
//        }
//        predmet.setStatusPredmet(request.getStatusPredmet());
//        predmet.setTipOdgovor(TipOdgovor.ДП_одговор);
//        predmet.setIspratenoDo(null);
//        return this.predmetRepository.save(predmet);
//    }

    //Naum
    @Transactional
    public DobienaPostaResponse createDobienaPosta(DobienaPostaRequest request, String email) {
        System.out.println("EMAIL: " + email);
        UserTable user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Isprakjac isprakjac = isprakjacRepository.findById(request.getIsprakjacId())
                .orElseThrow(() -> new ResourceNotFoundException("Isprakjac not found"));
        VidPredmet vidPredmet = vidPredmetRepository.findById(request.getVidPredmetId())
                .orElseThrow(() -> new ResourceNotFoundException("VidPredmet not found"));
        UserTable odgovornoLice = userRepository.findById(request.getOdgovornoLiceId())
                .orElseThrow(() -> new ResourceNotFoundException("OdgovornoLice not found"));
        Arhiva arhiva = arhivaRepository.findById(request.getArhivaId())
                .orElseThrow(() -> new ResourceNotFoundException("Arhiva not found"));

        String brAkt = "11.1"; //TEST da se prasa
        Integer godina = LocalDate.now().getYear();
        Integer redenBroj = predmetRepository.findMaxRedenBroj(godina) + 1;
        Predmet predmet = new Predmet();
        predmet.setBrAkt(brAkt);
        predmet.setRedenBroj(redenBroj);
        predmet.setPodBroj(1);
        predmet.setGodina(godina);
        predmet.setDatumZaveduvanje(request.getDatumZaveduvanje());
        predmet.setTipPosta(request.getTipPosta());
        predmet.setPrioritet(request.getPrioritet());
        predmet.setIsprakjac(isprakjac);
        predmet.setBrAktNivni(request.getBrAktNivni());
        predmet.setDatumIsprakjanje(request.getDatumIsprakjanje());
        predmet.setBrAktArhivski(request.getBrAktArhivski());
        predmet.setVidPredmet(vidPredmet);
        predmet.setSodrzina(request.getSodrzina());
        predmet.setOdgovornoLice(odgovornoLice);
        predmet.setInformativnaPosta(request.getInformativnaPosta());
        predmet.setRealizirano(request.getRealizirano());
        predmet.setArhiva(arhiva);
        predmet.setZabeleska(request.getZabeleska());
        Predmet saved = predmetRepository.save(predmet);
        return DobienaPostaResponse.from(saved);
    }
    @Transactional
    public Predmet createIspratenaPosta(IspratenaPostaRequest request){
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

        if (request.getIspratenoDoId() == null){
            throw new BadRequestException("Примач е задолжителен за испратена пошта");
        }
        IspratenDo ispratenDo = this.ispratenDoRepository.findById(request.getIspratenoDoId())
                .orElseThrow(() -> new ResourceNotFoundException("Испратено до", request.getIspratenoDoId()));

        predmet.setIspratenoDo(ispratenDo);
        predmet.setIsprakjac(null);
        predmet.setBrAktNivni(request.getBrAktNivni());
        predmet.setDatumIsprakjanje(request.getDatumIsprakjanje());
        predmet.setBrAktArhivski(request.getBrAktArhivski());

        if(request.getVidPredmetId() != null){
            VidPredmet vidPredmet = this.vidPredmetRepository.findById(request.getVidPredmetId())
                    .orElseThrow(() -> new ResourceNotFoundException("Вид на предмет", request.getVidPredmetId()));
            predmet.setVidPredmet(vidPredmet);
        }
        predmet.setSodrzina(request.getSodrzina());

        if(request.getOdgovornoLiceId() != null) {
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

        predmet.setTipOdgovor(TipOdgovor.ИП_одгоров);
        return this.predmetRepository.save(predmet);
    }

    @Transactional
    public Predmet updateStatusPredmet(Long id, StatusPredmetRequest request,String changedBy){
        if(request.getStatusPredmet() == null){
            throw new BadRequestException("Статусот на предметот е задолжителен");
        }
        Predmet predmet = this.predmetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Предмет", id));
        StatusPredmet oldStatus = predmet.getStatusPredmet();
        StatusPredmet newStatus = request.getStatusPredmet();

        predmet.setStatusPredmet(newStatus);
        Predmet savedPredmet = this.predmetRepository.save(predmet);

        PredmetStatusLog log = new PredmetStatusLog();
        log.setPredmet(savedPredmet);
        log.setOldStatus(oldStatus);
        log.setNewStatus(newStatus);
        log.setChangedBy(changedBy);
        log.setChangedAt(LocalDateTime.now());

        this.predmetStatusRepository.save(log);

        return savedPredmet;
    }

}
