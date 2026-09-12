package com.example.backend.config;

import com.example.backend.model.OrganizaciskaEdinica;
import com.example.backend.model.enums.Role;
import com.example.backend.model.UserTable;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.orgEdinicaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

/**
 * Полни тест-корисници: за СЕКОЈА организациска единица во базата создава по
 * {@code USERS_PER_ROLE} корисници со улога NACALNIK и исто толку со POMOSNIK.
 *
 * Идемпотентно е - корисник што веќе постои (по email) се прескокнува, па може да
 * се пали повеќепати без дупликати.
 *
 * НЕ се пали автоматски. Вклучи го само за тестирање со:
 *   application.properties →  app.seed-test-users=true
 * или при стартување:        --app.seed-test-users=true
 *
 * Email шема:  {role}{n}.{orgCodeSanitiziran}@ikp.mk
 *   пр. nacalnik1.11-1@ikp.mk , pomosnik3.12-1-4@ikp.mk
 * Лозинка (иста за сите тест-корисници):  TEST_PASSWORD
 */
@Configuration
public class TestUserSeeder {

    private static final Logger log = LoggerFactory.getLogger(TestUserSeeder.class);

    private static final int USERS_PER_ROLE = 3;
    private static final String TEST_PASSWORD = "Test1234!";
    private static final String EMAIL_DOMAIN = "@ikp.mk";

    @Bean
    CommandLineRunner seedTestUsers(
            orgEdinicaRepository orgEdinicaRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            org.springframework.core.env.Environment env) {

        return args -> {
            if (!env.getProperty("app.seed-test-users", Boolean.class, false)) {
                return;
            }

            // Ако базата е празна (пр. по drop-от за миграцијата во UUID), создади
            // неколку орг. единици за апликацијата да е употреблива веднаш.
            if (orgEdinicaRepository.count() == 0) {
                for (String[] oe : new String[][]{
                        {"11.1", "Сектор 11.1"},
                        {"12.1.4", "Одделение 12.1.4"},
                        {"13.2", "Сектор 13.2"}}) {
                    OrganizaciskaEdinica e = new OrganizaciskaEdinica();
                    e.setCode(oe[0]);
                    e.setNaziv(oe[1]);
                    orgEdinicaRepository.save(e);
                }
                log.info("[TestUserSeeder] Создадени 3 организациски единици.");
            }

            List<OrganizaciskaEdinica> edinici = orgEdinicaRepository.findAll();
            if (edinici.isEmpty()) {
                log.warn("[TestUserSeeder] Нема организациски единици во базата - прескокнато.");
                return;
            }

            String encodedPassword = passwordEncoder.encode(TEST_PASSWORD);
            int created = 0;

            for (OrganizaciskaEdinica edinica : edinici) {
                String codeSlug = edinica.getCode().replaceAll("[^A-Za-z0-9]", "-");
                created += ensureUsers(edinica, codeSlug, Role.NACALNIK, "nacalnik", "Началник",
                        userRepository, encodedPassword);
                created += ensureUsers(edinica, codeSlug, Role.POMOSNIK, "pomosnik", "Помошник",
                        userRepository, encodedPassword);
            }

            log.info("[TestUserSeeder] Готово - создадени {} нови тест-корисници за {} орг. единици " +
                            "(по {} NACALNIK + {} POMOSNIK). Лозинка за сите: {}",
                    created, edinici.size(), USERS_PER_ROLE, USERS_PER_ROLE, TEST_PASSWORD);
        };
    }

    private int ensureUsers(OrganizaciskaEdinica edinica, String codeSlug, Role role,
                            String emailPrefix, String imePrefix,
                            UserRepository userRepository, String encodedPassword) {
        int created = 0;
        for (int i = 1; i <= USERS_PER_ROLE; i++) {
            String email = emailPrefix + i + "." + codeSlug + EMAIL_DOMAIN;
            if (userRepository.findByEmail(email).isPresent()) {
                continue;
            }
            UserTable u = new UserTable();
            u.setIme(imePrefix + " " + i);
            u.setPrezime(edinica.getCode());
            u.setEmail(email);
            u.setPassword(encodedPassword);
            u.setUloga(role);
            u.setOrganizaciskaEdinica(edinica);
            userRepository.save(u);
            created++;
        }
        return created;
    }
}
